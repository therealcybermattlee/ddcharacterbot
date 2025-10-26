/**
 * JWT Service for Token Generation and Validation
 *
 * Implements secure JWT token handling with:
 * - HS256 (HMAC-SHA256) signing algorithm
 * - Base64URL encoding (RFC 7515)
 * - Expiration validation
 * - Unicode-safe encoding/decoding
 */

export interface JWTPayload {
  userId: string;
  email: string;
  username: string;
  role: 'dm' | 'player' | 'observer';
  iat: number;  // Issued at
  exp: number;  // Expiration
  type?: 'access' | 'refresh';
}

export class JWTService {
  private secret: string;

  constructor(secret: string) {
    this.secret = secret;
  }

  /**
   * Sign a JWT token
   *
   * @param payload - Token payload (user data)
   * @param expiresIn - Expiration time in seconds
   * @param type - Token type (access or refresh)
   * @returns Signed JWT token
   */
  async sign(
    payload: Omit<JWTPayload, 'iat' | 'exp' | 'type'>,
    expiresIn: number = 3600,
    type: 'access' | 'refresh' = 'access'
  ): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    const jwtPayload: JWTPayload = {
      ...payload,
      iat: now,
      exp: now + expiresIn,
      type,
    };

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(this.secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    // Use base64url encoding (RFC 7515)
    const header = this.base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payloadEncoded = this.base64UrlEncode(JSON.stringify(jwtPayload));
    const data = `${header}.${payloadEncoded}`;

    const signature = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(data)
    );

    const signatureEncoded = this.base64UrlEncode(
      String.fromCharCode(...new Uint8Array(signature))
    );

    return `${data}.${signatureEncoded}`;
  }

  /**
   * Verify a JWT token
   *
   * @param token - JWT token to verify
   * @param expectedType - Expected token type (access or refresh)
   * @returns Decoded payload or null if invalid
   */
  async verify(
    token: string,
    expectedType?: 'access' | 'refresh'
  ): Promise<JWTPayload | null> {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.warn('[JWT] Invalid token format');
        return null;
      }

      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(this.secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['verify']
      );

      const data = `${parts[0]}.${parts[1]}`;

      // Decode signature
      const signatureBase64 = parts[2].replace(/-/g, '+').replace(/_/g, '/');
      let paddedSignature = signatureBase64;
      while (paddedSignature.length % 4) {
        paddedSignature += '=';
      }
      const signature = Uint8Array.from(atob(paddedSignature), (c) =>
        c.charCodeAt(0)
      );

      // Verify signature
      const isValid = await crypto.subtle.verify(
        'HMAC',
        key,
        signature,
        encoder.encode(data)
      );

      if (!isValid) {
        console.warn('[JWT] Invalid signature');
        return null;
      }

      // Decode payload
      const payload = JSON.parse(this.base64UrlDecode(parts[1])) as JWTPayload;

      // Check expiration
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp < now) {
        console.warn('[JWT] Token expired:', {
          exp: payload.exp,
          now,
          diff: now - payload.exp,
        });
        return null;
      }

      // Check token type if specified
      if (expectedType && payload.type !== expectedType) {
        console.warn('[JWT] Token type mismatch:', {
          expected: expectedType,
          actual: payload.type,
        });
        return null;
      }

      return payload;
    } catch (error) {
      console.error('[JWT] Verification error:', error);
      return null;
    }
  }

  /**
   * Decode a JWT token without verification (use with caution)
   * Useful for extracting user info from expired tokens
   */
  decode(token: string): JWTPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const payload = JSON.parse(this.base64UrlDecode(parts[1])) as JWTPayload;
      return payload;
    } catch {
      return null;
    }
  }

  /**
   * Check if token is expired without full verification
   */
  isExpired(token: string): boolean {
    const payload = this.decode(token);
    if (!payload) return true;

    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  }

  /**
   * Get time until token expiration (in seconds)
   */
  getTimeToExpiry(token: string): number | null {
    const payload = this.decode(token);
    if (!payload) return null;

    const now = Math.floor(Date.now() / 1000);
    return Math.max(0, payload.exp - now);
  }

  /**
   * Unicode-safe base64url encoding
   */
  private base64UrlEncode(str: string): string {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const base64 = btoa(String.fromCharCode(...new Uint8Array(data)));
    // Convert to base64url format (RFC 7515)
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }

  /**
   * Unicode-safe base64url decoding
   */
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
}

/**
 * Token pair generator
 * Creates both access and refresh tokens
 */
export async function generateTokenPair(
  jwtService: JWTService,
  user: {
    userId: string;
    email: string;
    username: string;
    role: 'dm' | 'player' | 'observer';
  }
): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
  const ACCESS_TOKEN_EXPIRY = 3600; // 1 hour
  const REFRESH_TOKEN_EXPIRY = 604800; // 7 days

  const accessToken = await jwtService.sign(user, ACCESS_TOKEN_EXPIRY, 'access');
  const refreshToken = await jwtService.sign(user, REFRESH_TOKEN_EXPIRY, 'refresh');

  return {
    accessToken,
    refreshToken,
    expiresIn: ACCESS_TOKEN_EXPIRY,
  };
}
