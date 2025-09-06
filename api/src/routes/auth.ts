import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import type { Env, User, UserSession, JWTPayload } from '../types';
import { createAuthMiddleware } from '../middleware/security';

// Create auth router
const auth = new Hono<{ Bindings: Env }>();

// Validation schemas
const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(30),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['dm', 'player']).default('player'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

// JWT Service class (extracted from middleware for reuse)
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

    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload64 = btoa(JSON.stringify(jwtPayload));
    const data = `${header}.${payload64}`;
    
    const signature = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(data)
    );
    
    const signature64 = btoa(String.fromCharCode(...new Uint8Array(signature)));
    return `${data}.${signature64}`;
  }
}

// Password hashing utility (using Web Crypto API)
class PasswordService {
  static async hash(password: string): Promise<string> {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (error) {
      console.error('Password hashing error:', error);
      throw new Error('Failed to hash password');
    }
  }

  static async verify(password: string, hash: string): Promise<boolean> {
    try {
      const passwordHash = await this.hash(password);
      return passwordHash === hash;
    } catch (error) {
      console.error('Password verification error:', error);
      return false;
    }
  }
}

// Register endpoint
auth.post('/register', zValidator('json', registerSchema), async (c) => {
  try {
    const { email, username, password, role } = c.req.valid('json');

    // Check if user already exists
    const existingUser = await c.env.DB.prepare(
      'SELECT id FROM users WHERE email = ? OR username = ?'
    ).bind(email, username).first();

    if (existingUser) {
      return c.json({
        success: false,
        error: {
          code: 'USER_EXISTS',
          message: 'User with this email or username already exists'
        },
        timestamp: new Date().toISOString()
      }, 409);
    }

    // Hash password
    const passwordHash = await PasswordService.hash(password);

    // Generate user ID
    const userId = crypto.randomUUID();

    // Create user
    const now = new Date().toISOString();
    await c.env.DB.prepare(
      'INSERT INTO users (id, email, username, password_hash, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(userId, email, username, passwordHash, role, now, now).run();

    // Generate JWT token
    const jwtService = new JWTService(c.env.JWT_SECRET);
    const token = await jwtService.sign({
      userId,
      email,
      username,
      role,
    }, 86400); // 24 hours

    // Create session in KV
    const session: UserSession = {
      userId,
      email,
      username,
      role,
      createdAt: now,
      lastActivity: now,
    };

    const sessionKey = `session:${userId}`;
    await c.env.KV.put(sessionKey, JSON.stringify(session), { expirationTtl: 86400 });

    return c.json({
      success: true,
      data: {
        user: {
          id: userId,
          email,
          username,
          role,
        },
        token,
        expiresIn: 86400,
      },
      timestamp: new Date().toISOString()
    }, 201);

  } catch (error) {
    console.error('Registration error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to register user';
    return c.json({
      success: false,
      error: {
        code: 'REGISTRATION_FAILED',
        message: errorMessage
      },
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Login endpoint
auth.post('/login', zValidator('json', loginSchema), async (c) => {
  try {
    const { email, password } = c.req.valid('json');

    // Find user
    const user = await c.env.DB.prepare(
      'SELECT id, email, username, password_hash, role FROM users WHERE email = ?'
    ).bind(email).first() as User | null;

    if (!user) {
      return c.json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        },
        timestamp: new Date().toISOString()
      }, 401);
    }

    // Verify password
    const isValidPassword = await PasswordService.verify(password, user.passwordHash);
    if (!isValidPassword) {
      return c.json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        },
        timestamp: new Date().toISOString()
      }, 401);
    }

    // Generate JWT token
    const jwtService = new JWTService(c.env.JWT_SECRET);
    const token = await jwtService.sign({
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    }, 86400); // 24 hours

    // Create session in KV
    const now = new Date().toISOString();
    const session: UserSession = {
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      createdAt: now,
      lastActivity: now,
    };

    const sessionKey = `session:${user.id}`;
    await c.env.KV.put(sessionKey, JSON.stringify(session), { expirationTtl: 86400 });

    return c.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
        },
        token,
        expiresIn: 86400,
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Login error:', error);
    return c.json({
      success: false,
      error: {
        code: 'LOGIN_FAILED',
        message: 'Failed to authenticate user'
      },
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Logout endpoint
auth.post('/logout', createAuthMiddleware(), async (c) => {
  try {
    const user = c.get('user') as UserSession;
    
    // Remove session from KV
    const sessionKey = `session:${user.userId}`;
    await c.env.KV.delete(sessionKey);

    return c.json({
      success: true,
      data: {
        message: 'Successfully logged out'
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Logout error:', error);
    return c.json({
      success: false,
      error: {
        code: 'LOGOUT_FAILED',
        message: 'Failed to logout user'
      },
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Get user profile endpoint
auth.get('/profile', createAuthMiddleware(), async (c) => {
  try {
    const user = c.get('user') as UserSession;
    
    // Get fresh user data from database
    const userData = await c.env.DB.prepare(
      'SELECT id, email, username, role, created_at FROM users WHERE id = ?'
    ).bind(user.userId).first();

    if (!userData) {
      return c.json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        },
        timestamp: new Date().toISOString()
      }, 404);
    }

    return c.json({
      success: true,
      data: {
        user: userData
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Profile error:', error);
    return c.json({
      success: false,
      error: {
        code: 'PROFILE_FAILED',
        message: 'Failed to get user profile'
      },
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Refresh token endpoint
auth.post('/refresh', createAuthMiddleware(), async (c) => {
  try {
    const user = c.get('user') as UserSession;
    
    // Generate new JWT token
    const jwtService = new JWTService(c.env.JWT_SECRET);
    const token = await jwtService.sign({
      userId: user.userId,
      email: user.email,
      username: user.username,
      role: user.role,
    }, 86400); // 24 hours

    // Update session activity
    user.lastActivity = new Date().toISOString();
    const sessionKey = `session:${user.userId}`;
    await c.env.KV.put(sessionKey, JSON.stringify(user), { expirationTtl: 86400 });

    return c.json({
      success: true,
      data: {
        token,
        expiresIn: 86400,
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    return c.json({
      success: false,
      error: {
        code: 'REFRESH_FAILED',
        message: 'Failed to refresh token'
      },
      timestamp: new Date().toISOString()
    }, 500);
  }
});

export default auth;