import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import type { HonoEnv, User, UserSession, JWTPayload } from '../types';
import { createAuthMiddleware } from '../middleware/security';
import { scrypt } from '@noble/hashes/scrypt.js';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils.js';

// Create auth router
const auth = new Hono<HonoEnv>();

// Helper function to sanitize text input (prevent XSS in usernames)
function sanitizeText(text: string): string {
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<[^>]+>/g, '') // Remove all HTML tags
    .trim();
}

// Validation schemas
const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  role: z.enum(['dm', 'player']).optional(),
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

// Password hashing utility (using scrypt from @noble/hashes)
class PasswordService {
  // scrypt parameters (N=2^16, r=8, p=1 - balanced security/performance for edge)
  private static readonly SCRYPT_N = 65536; // 2^16 iterations
  private static readonly SCRYPT_R = 8;
  private static readonly SCRYPT_P = 1;
  private static readonly HASH_LENGTH = 32;

  /**
   * Hash a password using scrypt
   * Format: algorithm$salt$hash (e.g., "scrypt$abc123$def456")
   */
  static async hash(password: string): Promise<string> {
    try {
      // Generate random salt (16 bytes = 128 bits)
      const salt = crypto.getRandomValues(new Uint8Array(16));

      // Hash password with scrypt
      const hash = scrypt(password, salt, {
        N: this.SCRYPT_N,
        r: this.SCRYPT_R,
        p: this.SCRYPT_P,
        dkLen: this.HASH_LENGTH,
      });

      // Return in format: algorithm$salt$hash
      const saltHex = bytesToHex(salt);
      const hashHex = bytesToHex(hash);
      return `scrypt$${saltHex}$${hashHex}`;
    } catch (error) {
      console.error('Password hashing error:', error);
      throw new Error('Failed to hash password');
    }
  }

  /**
   * Verify password against hash
   * Supports both new scrypt hashes and legacy SHA-256 hashes
   */
  static async verify(password: string, storedHash: string): Promise<boolean> {
    try {
      // Check if this is a scrypt hash (format: algorithm$salt$hash)
      if (storedHash.startsWith('scrypt$')) {
        return await this.verifyScrypt(password, storedHash);
      } else {
        // Legacy SHA-256 hash (for backward compatibility)
        return await this.verifySHA256(password, storedHash);
      }
    } catch (error) {
      console.error('Password verification error:', error);
      return false;
    }
  }

  /**
   * Verify password against scrypt hash
   */
  private static async verifyScrypt(password: string, storedHash: string): Promise<boolean> {
    try {
      // Parse stored hash: algorithm$salt$hash
      const parts = storedHash.split('$');
      if (parts.length !== 3 || parts[0] !== 'scrypt') {
        return false;
      }

      const salt = hexToBytes(parts[1]);
      const expectedHash = hexToBytes(parts[2]);

      // Hash the provided password with the same salt
      const actualHash = scrypt(password, salt, {
        N: this.SCRYPT_N,
        r: this.SCRYPT_R,
        p: this.SCRYPT_P,
        dkLen: this.HASH_LENGTH,
      });

      // Constant-time comparison
      if (actualHash.length !== expectedHash.length) {
        return false;
      }

      let result = 0;
      for (let i = 0; i < actualHash.length; i++) {
        result |= actualHash[i] ^ expectedHash[i];
      }

      return result === 0;
    } catch (error) {
      console.error('Scrypt verification error:', error);
      return false;
    }
  }

  /**
   * Verify password against legacy SHA-256 hash
   * Used for backward compatibility with existing user passwords
   */
  private static async verifySHA256(password: string, storedHash: string): Promise<boolean> {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const passwordHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return passwordHash === storedHash;
    } catch (error) {
      console.error('SHA-256 verification error:', error);
      return false;
    }
  }
}

// Register endpoint (using manual JSON parsing as workaround)
auth.post('/register', async (c) => {
  try {
    // Manual JSON parsing workaround using raw request
    let body: any;
    try {
      // Use raw Request object to avoid Hono's body caching issues
      const text = await c.req.raw.text();
      body = JSON.parse(text);
    } catch (e) {
      return c.json({
        success: false,
        error: {
          code: 'INVALID_JSON',
          message: 'Invalid JSON in request body',
          debug: e instanceof Error ? e.message : String(e)
        },
        timestamp: new Date().toISOString()
      }, 400);
    }

    // Manual validation
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return c.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: result.error.errors
        },
        timestamp: new Date().toISOString()
      }, 400);
    }

    const email = result.data.email.toLowerCase();
    const username = sanitizeText(result.data.username);
    const password = result.data.password;
    const role = result.data.role || 'player';

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

    // Auto-migrate legacy SHA-256 passwords to scrypt on successful login
    if (!user.passwordHash.startsWith('scrypt$')) {
      try {
        const newHash = await PasswordService.hash(password);
        await c.env.DB.prepare(
          'UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?'
        ).bind(newHash, new Date().toISOString(), user.id).run();
        console.log(`Migrated user ${user.id} from SHA-256 to scrypt`);
      } catch (error) {
        // Don't fail login if migration fails - log and continue
        console.error('Password migration error:', error);
      }
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