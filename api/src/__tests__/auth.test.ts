import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JWTService } from '../lib/jwt-service';
import { PasswordService } from '../lib/password-service';
import { TokenManager } from '../lib/token-manager';

// Mock KV namespace for testing
class MockKV {
  private store = new Map<string, string>();

  async get(key: string): Promise<string | null> {
    return this.store.get(key) || null;
  }

  async put(key: string, value: string, options?: any): Promise<void> {
    this.store.set(key, value);
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }

  async list(options?: any): Promise<{ keys: Array<{ name: string }> }> {
    const keys = Array.from(this.store.keys())
      .filter(key => !options?.prefix || key.startsWith(options.prefix))
      .map(name => ({ name }));
    return { keys };
  }
}

describe('JWT Service', () => {
  const JWT_SECRET = 'test-secret-key-for-testing-only';
  let jwtService: JWTService;

  beforeEach(() => {
    jwtService = new JWTService(JWT_SECRET);
  });

  it('should sign a JWT token', async () => {
    const payload = {
      userId: 'user-123',
      email: 'test@example.com',
      username: 'testuser',
      role: 'player' as const,
    };

    const token = await jwtService.sign(payload, 3600, 'access');

    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3);
  });

  it('should verify a valid JWT token', async () => {
    const payload = {
      userId: 'user-123',
      email: 'test@example.com',
      username: 'testuser',
      role: 'player' as const,
    };

    const token = await jwtService.sign(payload, 3600, 'access');
    const verified = await jwtService.verify(token, 'access');

    expect(verified).toBeDefined();
    expect(verified?.userId).toBe('user-123');
    expect(verified?.email).toBe('test@example.com');
    expect(verified?.role).toBe('player');
    expect(verified?.type).toBe('access');
  });

  it('should reject expired token', async () => {
    const payload = {
      userId: 'user-123',
      email: 'test@example.com',
      username: 'testuser',
      role: 'player' as const,
    };

    // Create token with 0 second expiry (already expired)
    const token = await jwtService.sign(payload, 0, 'access');

    // Wait a bit to ensure expiration
    await new Promise(resolve => setTimeout(resolve, 100));

    const verified = await jwtService.verify(token, 'access');
    expect(verified).toBeNull();
  });

  it('should reject token with wrong type', async () => {
    const payload = {
      userId: 'user-123',
      email: 'test@example.com',
      username: 'testuser',
      role: 'player' as const,
    };

    const token = await jwtService.sign(payload, 3600, 'access');
    const verified = await jwtService.verify(token, 'refresh');

    expect(verified).toBeNull();
  });

  it('should decode token without verification', () => {
    const payload = {
      userId: 'user-123',
      email: 'test@example.com',
      username: 'testuser',
      role: 'player' as const,
    };

    jwtService.sign(payload, 3600, 'access').then(token => {
      const decoded = jwtService.decode(token);

      expect(decoded).toBeDefined();
      expect(decoded?.userId).toBe('user-123');
    });
  });

  it('should check if token is expired', async () => {
    const payload = {
      userId: 'user-123',
      email: 'test@example.com',
      username: 'testuser',
      role: 'player' as const,
    };

    const token = await jwtService.sign(payload, 0, 'access');
    await new Promise(resolve => setTimeout(resolve, 100));

    const isExpired = jwtService.isExpired(token);
    expect(isExpired).toBe(true);
  });

  it('should get time to expiry', async () => {
    const payload = {
      userId: 'user-123',
      email: 'test@example.com',
      username: 'testuser',
      role: 'player' as const,
    };

    const token = await jwtService.sign(payload, 3600, 'access');
    const timeToExpiry = jwtService.getTimeToExpiry(token);

    expect(timeToExpiry).toBeGreaterThan(3500);
    expect(timeToExpiry).toBeLessThanOrEqual(3600);
  });
});

describe('Password Service', () => {
  it('should hash a password', async () => {
    const password = 'MySecureP@ssw0rd!';
    const hash = await PasswordService.hash(password);

    expect(hash).toBeDefined();
    expect(hash.startsWith('scrypt$')).toBe(true);
    expect(hash.split('$')).toHaveLength(3);
  });

  it('should verify correct password', async () => {
    const password = 'MySecureP@ssw0rd!';
    const hash = await PasswordService.hash(password);

    const isValid = await PasswordService.verify(password, hash);
    expect(isValid).toBe(true);
  });

  it('should reject incorrect password', async () => {
    const password = 'MySecureP@ssw0rd!';
    const hash = await PasswordService.hash(password);

    const isValid = await PasswordService.verify('WrongPassword123!', hash);
    expect(isValid).toBe(false);
  });

  it('should validate password complexity', () => {
    const validPassword = 'MySecureP@ssw0rd!';
    const result = PasswordService.validateComplexity(validPassword);

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject weak passwords', () => {
    const weakPasswords = [
      'short',           // Too short
      'nouppercase123!', // No uppercase
      'NOLOWERCASE123!', // No lowercase
      'NoNumbers!',      // No numbers
      'NoSpecialChar123', // No special char
    ];

    weakPasswords.forEach(password => {
      const result = PasswordService.validateComplexity(password);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  it('should detect hash that needs migration', () => {
    const scryptHash = 'scrypt$abc123$def456';
    const sha256Hash = 'a1b2c3d4e5f6g7h8i9j0';

    expect(PasswordService.needsMigration(scryptHash)).toBe(false);
    expect(PasswordService.needsMigration(sha256Hash)).toBe(true);
  });

  it('should generate secure password', () => {
    const password = PasswordService.generateSecurePassword(16);

    expect(password).toBeDefined();
    expect(password.length).toBe(16);

    const result = PasswordService.validateComplexity(password);
    expect(result.valid).toBe(true);
  });
});

describe('Token Manager', () => {
  const JWT_SECRET = 'test-secret-key-for-testing-only';
  let jwtService: JWTService;
  let tokenManager: TokenManager;
  let mockKV: MockKV;

  beforeEach(() => {
    jwtService = new JWTService(JWT_SECRET);
    mockKV = new MockKV();
    tokenManager = new TokenManager(jwtService, mockKV as any);
  });

  it('should generate token pair', async () => {
    const user = {
      userId: 'user-123',
      email: 'test@example.com',
      username: 'testuser',
      role: 'player' as const,
    };

    const tokens = await tokenManager.generateTokenPair(user);

    expect(tokens.accessToken).toBeDefined();
    expect(tokens.refreshToken).toBeDefined();
    expect(tokens.expiresIn).toBe(3600); // 1 hour
    expect(tokens.refreshExpiresIn).toBe(604800); // 7 days
  });

  it('should refresh access token', async () => {
    const user = {
      userId: 'user-123',
      email: 'test@example.com',
      username: 'testuser',
      role: 'player' as const,
    };

    const tokens = await tokenManager.generateTokenPair(user);
    const refreshResult = await tokenManager.refreshAccessToken(tokens.refreshToken);

    expect(refreshResult).toBeDefined();
    expect(refreshResult?.accessToken).toBeDefined();
    expect(refreshResult?.expiresIn).toBe(3600);
  });

  it('should reject invalid refresh token', async () => {
    const invalidToken = 'invalid.token.here';
    const result = await tokenManager.refreshAccessToken(invalidToken);

    expect(result).toBeNull();
  });

  it('should revoke refresh token', async () => {
    const user = {
      userId: 'user-123',
      email: 'test@example.com',
      username: 'testuser',
      role: 'player' as const,
    };

    const tokens = await tokenManager.generateTokenPair(user);
    await tokenManager.revokeRefreshToken(user.userId, tokens.refreshToken);

    const refreshResult = await tokenManager.refreshAccessToken(tokens.refreshToken);
    expect(refreshResult).toBeNull();
  });

  it('should revoke all refresh tokens', async () => {
    const user = {
      userId: 'user-123',
      email: 'test@example.com',
      username: 'testuser',
      role: 'player' as const,
    };

    // Generate multiple tokens
    const tokens1 = await tokenManager.generateTokenPair(user);
    const tokens2 = await tokenManager.generateTokenPair(user);

    await tokenManager.revokeAllRefreshTokens(user.userId);

    const result1 = await tokenManager.refreshAccessToken(tokens1.refreshToken);
    const result2 = await tokenManager.refreshAccessToken(tokens2.refreshToken);

    expect(result1).toBeNull();
    expect(result2).toBeNull();
  });

  it('should get active tokens', async () => {
    const user = {
      userId: 'user-123',
      email: 'test@example.com',
      username: 'testuser',
      role: 'player' as const,
    };

    await tokenManager.generateTokenPair(user);
    await tokenManager.generateTokenPair(user);

    const activeTokens = await tokenManager.getActiveTokens(user.userId);
    expect(activeTokens.length).toBe(2);
  });

  it('should blacklist token', async () => {
    const user = {
      userId: 'user-123',
      email: 'test@example.com',
      username: 'testuser',
      role: 'player' as const,
    };

    const tokens = await tokenManager.generateTokenPair(user);
    await tokenManager.blacklistToken(tokens.accessToken, 3600);

    const isBlacklisted = await tokenManager.isTokenBlacklisted(tokens.accessToken);
    expect(isBlacklisted).toBe(true);
  });

  it('should verify access token and check blacklist', async () => {
    const user = {
      userId: 'user-123',
      email: 'test@example.com',
      username: 'testuser',
      role: 'player' as const,
    };

    const tokens = await tokenManager.generateTokenPair(user);

    // Should verify successfully
    let verified = await tokenManager.verifyAccessToken(tokens.accessToken);
    expect(verified).toBeDefined();

    // Blacklist the token
    await tokenManager.blacklistToken(tokens.accessToken, 3600);

    // Should now fail verification
    verified = await tokenManager.verifyAccessToken(tokens.accessToken);
    expect(verified).toBeNull();
  });

  it('should get token statistics', async () => {
    const user = {
      userId: 'user-123',
      email: 'test@example.com',
      username: 'testuser',
      role: 'player' as const,
    };

    await tokenManager.generateTokenPair(user);
    await new Promise(resolve => setTimeout(resolve, 100));
    await tokenManager.generateTokenPair(user);

    const stats = await tokenManager.getTokenStats(user.userId);

    expect(stats.activeTokens).toBe(2);
    expect(stats.oldestToken).toBeDefined();
    expect(stats.newestToken).toBeDefined();
  });
});
