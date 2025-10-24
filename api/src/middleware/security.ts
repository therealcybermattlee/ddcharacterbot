import { Context, Next } from 'hono';
import { getCookie, setCookie } from 'hono/cookie';
import { cors } from 'hono/cors';
import { csrf } from 'hono/csrf';
import { secureHeaders } from 'hono/secure-headers';
import type { Env, JWTPayload, UserSession, RateLimitInfo } from '../types';

// JWT utilities for Cloudflare Workers
class JWTService {
  private secret: string;

  constructor(secret: string) {
    this.secret = secret;
  }

  async sign(payload: object, expiresIn: number = 3600): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    const jwtPayload = {
      ...payload,
      iat: now,
      exp: now + expiresIn,
    };

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(this.secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    // Fixed: Use proper base64 encoding that handles Unicode characters
    const header = this.base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload64 = this.base64UrlEncode(JSON.stringify(jwtPayload));
    const data = `${header}.${payload64}`;

    const signature = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(data)
    );

    const signature64 = this.base64UrlEncode(String.fromCharCode(...new Uint8Array(signature)));
    return `${data}.${signature64}`;
  }

  // Helper method for Unicode-safe base64 encoding
  private base64UrlEncode(str: string): string {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const base64 = btoa(String.fromCharCode(...new Uint8Array(data)));
    // Convert to base64url format (replace + with -, / with _, remove padding =)
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }

  private base64UrlDecode(str: string): string {
    // Convert from base64url to base64
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    // Add padding if needed
    while (base64.length % 4) {
      base64 += '=';
    }
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const decoder = new TextDecoder();
    return decoder.decode(bytes);
  }

  async verify(token: string): Promise<JWTPayload | null> {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(this.secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['verify']
      );

      const data = `${parts[0]}.${parts[1]}`;

      // Fixed: Use proper base64url decoding for signature
      const signatureBase64 = parts[2].replace(/-/g, '+').replace(/_/g, '/');
      let paddedSignature = signatureBase64;
      while (paddedSignature.length % 4) {
        paddedSignature += '=';
      }
      const signature = Uint8Array.from(atob(paddedSignature), c => c.charCodeAt(0));

      const isValid = await crypto.subtle.verify(
        'HMAC',
        key,
        signature,
        encoder.encode(data)
      );

      if (!isValid) return null;

      // Fixed: Use Unicode-safe decoding for payload
      const payload = JSON.parse(this.base64UrlDecode(parts[1])) as JWTPayload;

      // Check expiration
      if (payload.exp < Math.floor(Date.now() / 1000)) {
        return null;
      }

      return payload;
    } catch {
      return null;
    }
  }
}

// CORS middleware factory
export function createCORSMiddleware(origin: string) {
  return cors({
    origin: [origin],
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
    credentials: true,
    maxAge: 86400, // 24 hours
  });
}

// Rate limiting middleware
export function createRateLimitMiddleware(requestsPerWindow: number, windowSeconds: number) {
  return async (c: Context<{ Bindings: Env }>, next: Next) => {
    const clientIP = c.req.header('CF-Connecting-IP') || 'unknown';
    const now = Math.floor(Date.now() / 1000);
    const windowStart = Math.floor(now / windowSeconds) * windowSeconds;
    const rateLimitKey = `rate_limit:${clientIP}:${windowStart}`;

    try {
      // Get current rate limit info
      const currentData = await c.env.KV.get(rateLimitKey);
      let rateLimitInfo: RateLimitInfo;

      if (currentData) {
        rateLimitInfo = JSON.parse(currentData);
      } else {
        rateLimitInfo = {
          count: 0,
          resetTime: windowStart + windowSeconds,
          windowStart,
        };
      }

      // Check if limit exceeded
      if (rateLimitInfo.count >= requestsPerWindow) {
        return c.json({
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests',
            details: { 
              limit: requestsPerWindow,
              resetTime: rateLimitInfo.resetTime
            }
          },
          timestamp: new Date().toISOString()
        }, 429);
      }

      // Increment counter
      rateLimitInfo.count++;
      await c.env.KV.put(
        rateLimitKey, 
        JSON.stringify(rateLimitInfo),
        { expirationTtl: windowSeconds + 10 } // Add buffer for cleanup
      );

      // Add rate limit headers
      c.res.headers.set('X-RateLimit-Limit', requestsPerWindow.toString());
      c.res.headers.set('X-RateLimit-Remaining', (requestsPerWindow - rateLimitInfo.count).toString());
      c.res.headers.set('X-RateLimit-Reset', rateLimitInfo.resetTime.toString());

      await next();
    } catch (error) {
      console.error('Rate limiting error:', error);
      // Allow request to continue if rate limiting fails
      await next();
    }
  };
}

// Authentication middleware
export function createAuthMiddleware() {
  return async (c: Context<{ Bindings: Env }>, next: Next) => {
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Missing or invalid authorization header'
        },
        timestamp: new Date().toISOString()
      }, 401);
    }

    const token = authHeader.slice(7); // Remove 'Bearer ' prefix
    const jwtService = new JWTService(c.env.JWT_SECRET);
    const payload = await jwtService.verify(token);

    if (!payload) {
      return c.json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid or expired token'
        },
        timestamp: new Date().toISOString()
      }, 401);
    }

    // Verify session exists in KV
    const sessionKey = `session:${payload.userId}`;
    const sessionData = await c.env.KV.get(sessionKey);
    
    if (!sessionData) {
      return c.json({
        success: false,
        error: {
          code: 'SESSION_EXPIRED',
          message: 'Session has expired'
        },
        timestamp: new Date().toISOString()
      }, 401);
    }

    const session: UserSession = JSON.parse(sessionData);
    
    // Update last activity
    session.lastActivity = new Date().toISOString();
    await c.env.KV.put(sessionKey, JSON.stringify(session), { expirationTtl: 86400 });

    // Add user info to context
    c.set('user', session);

    await next();
  };
}

// Security headers middleware
export function createSecurityHeadersMiddleware() {
  return secureHeaders({
    contentSecurityPolicy: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
    },
    crossOriginEmbedderPolicy: false, // Disable for KV/D1 compatibility
    strictTransportSecurity: 'max-age=31536000; includeSubDomains', // HSTS for 1 year
    xContentTypeOptions: 'nosniff',
    xFrameOptions: 'DENY',
    xXSSProtection: '1; mode=block',
    referrerPolicy: 'strict-origin-when-cross-origin',
  });
}

// CSRF protection middleware
export function createCSRFMiddleware(origin: string) {
  return csrf({
    origin: [origin],
  });
}

// Error handling middleware
export function createErrorHandlerMiddleware() {
  return async (c: Context<{ Bindings: Env }>, next: Next) => {
    try {
      await next();
    } catch (error) {
      console.error('Unhandled error:', error);
      
      return c.json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: c.env.ENVIRONMENT === 'development' 
            ? (error as Error).message 
            : 'Internal server error'
        },
        timestamp: new Date().toISOString()
      }, 500);
    }
  };
}