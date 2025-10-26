/**
 * Token Management System
 *
 * Manages access and refresh tokens with KV storage:
 * - Access tokens: Short-lived (1 hour) for API requests
 * - Refresh tokens: Long-lived (7 days) for obtaining new access tokens
 * - Token revocation and blacklisting
 * - Session tracking and cleanup
 */

import type { KVNamespace } from '@cloudflare/workers-types';
import { JWTService, type JWTPayload } from './jwt-service';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  refreshExpiresIn: number;
}

export interface RefreshTokenMetadata {
  userId: string;
  createdAt: string;
  lastUsed: string;
  deviceInfo?: string;
  ipAddress?: string;
}

export class TokenManager {
  private jwtService: JWTService;
  private kv: KVNamespace;

  // Token expiration times (in seconds)
  private static readonly ACCESS_TOKEN_EXPIRY = 3600; // 1 hour
  private static readonly REFRESH_TOKEN_EXPIRY = 604800; // 7 days

  constructor(jwtService: JWTService, kv: KVNamespace) {
    this.jwtService = jwtService;
    this.kv = kv;
  }

  /**
   * Generate access and refresh token pair
   */
  async generateTokenPair(
    user: {
      userId: string;
      email: string;
      username: string;
      role: 'dm' | 'player' | 'observer';
    },
    deviceInfo?: string,
    ipAddress?: string
  ): Promise<TokenPair> {
    const accessToken = await this.jwtService.sign(
      user,
      TokenManager.ACCESS_TOKEN_EXPIRY,
      'access'
    );

    const refreshToken = await this.jwtService.sign(
      user,
      TokenManager.REFRESH_TOKEN_EXPIRY,
      'refresh'
    );

    // Store refresh token metadata in KV
    // Use a hash of the token to create shorter keys
    const tokenHash = await this.hashToken(refreshToken);
    const metadata: RefreshTokenMetadata = {
      userId: user.userId,
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
      deviceInfo,
      ipAddress,
    };

    const refreshTokenKey = `refresh_token:${user.userId}:${tokenHash}`;
    await this.kv.put(refreshTokenKey, JSON.stringify(metadata), {
      expirationTtl: TokenManager.REFRESH_TOKEN_EXPIRY,
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: TokenManager.ACCESS_TOKEN_EXPIRY,
      refreshExpiresIn: TokenManager.REFRESH_TOKEN_EXPIRY,
    };
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(
    refreshToken: string
  ): Promise<{ accessToken: string; expiresIn: number } | null> {
    // Verify refresh token
    const payload = await this.jwtService.verify(refreshToken, 'refresh');
    if (!payload) {
      console.warn('[TokenManager] Invalid refresh token');
      return null;
    }

    // Check if refresh token exists in KV (not revoked)
    const tokenHash = await this.hashToken(refreshToken);
    const refreshTokenKey = `refresh_token:${payload.userId}:${tokenHash}`;
    const metadataStr = await this.kv.get(refreshTokenKey);

    if (!metadataStr) {
      console.warn('[TokenManager] Refresh token not found or revoked:', {
        userId: payload.userId,
      });
      return null;
    }

    // Update last used timestamp
    const metadata: RefreshTokenMetadata = JSON.parse(metadataStr);
    metadata.lastUsed = new Date().toISOString();
    await this.kv.put(refreshTokenKey, JSON.stringify(metadata), {
      expirationTtl: TokenManager.REFRESH_TOKEN_EXPIRY,
    });

    // Generate new access token
    const accessToken = await this.jwtService.sign(
      {
        userId: payload.userId,
        email: payload.email,
        username: payload.username,
        role: payload.role,
      },
      TokenManager.ACCESS_TOKEN_EXPIRY,
      'access'
    );

    return {
      accessToken,
      expiresIn: TokenManager.ACCESS_TOKEN_EXPIRY,
    };
  }

  /**
   * Revoke a specific refresh token
   */
  async revokeRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const tokenHash = await this.hashToken(refreshToken);
    const refreshTokenKey = `refresh_token:${userId}:${tokenHash}`;
    await this.kv.delete(refreshTokenKey);
    console.log('[TokenManager] Refresh token revoked:', { userId });
  }

  /**
   * Hash a token to create shorter KV keys
   */
  private async hashToken(token: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(token);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 32);
  }

  /**
   * Revoke all refresh tokens for a user (logout from all devices)
   */
  async revokeAllRefreshTokens(userId: string): Promise<void> {
    // List all refresh tokens for user
    const prefix = `refresh_token:${userId}:`;
    const { keys } = await this.kv.list({ prefix });

    // Delete all tokens
    await Promise.all(keys.map((key) => this.kv.delete(key.name)));

    console.log('[TokenManager] All refresh tokens revoked:', {
      userId,
      count: keys.length,
    });
  }

  /**
   * Get all active refresh tokens for a user
   */
  async getActiveTokens(userId: string): Promise<RefreshTokenMetadata[]> {
    const prefix = `refresh_token:${userId}:`;
    const { keys } = await this.kv.list({ prefix });

    const tokens: RefreshTokenMetadata[] = [];

    for (const key of keys) {
      const metadataStr = await this.kv.get(key.name);
      if (metadataStr) {
        tokens.push(JSON.parse(metadataStr));
      }
    }

    return tokens;
  }

  /**
   * Blacklist a token (for immediate revocation before expiry)
   */
  async blacklistToken(token: string, expiresIn: number): Promise<void> {
    const blacklistKey = `blacklist:${token}`;
    await this.kv.put(blacklistKey, 'revoked', { expirationTtl: expiresIn });
  }

  /**
   * Check if token is blacklisted
   */
  async isTokenBlacklisted(token: string): Promise<boolean> {
    const blacklistKey = `blacklist:${token}`;
    const result = await this.kv.get(blacklistKey);
    return result !== null;
  }

  /**
   * Verify access token and check if blacklisted
   */
  async verifyAccessToken(accessToken: string): Promise<JWTPayload | null> {
    // Check if blacklisted first (fast check)
    const isBlacklisted = await this.isTokenBlacklisted(accessToken);
    if (isBlacklisted) {
      console.warn('[TokenManager] Access token is blacklisted');
      return null;
    }

    // Verify token signature and expiration
    return await this.jwtService.verify(accessToken, 'access');
  }

  /**
   * Clean up expired tokens (run periodically)
   * Note: KV automatically expires, but this helps with explicit cleanup
   */
  async cleanupExpiredTokens(userId: string): Promise<number> {
    const tokens = await this.getActiveTokens(userId);
    let cleaned = 0;

    for (const token of tokens) {
      const createdAt = new Date(token.createdAt).getTime();
      const now = Date.now();
      const age = (now - createdAt) / 1000; // seconds

      if (age > TokenManager.REFRESH_TOKEN_EXPIRY) {
        // This should already be expired by KV, but clean up just in case
        const prefix = `refresh_token:${userId}:`;
        const { keys } = await this.kv.list({ prefix });

        for (const key of keys) {
          const metadataStr = await this.kv.get(key.name);
          if (metadataStr) {
            const metadata: RefreshTokenMetadata = JSON.parse(metadataStr);
            if (metadata.createdAt === token.createdAt) {
              await this.kv.delete(key.name);
              cleaned++;
              break;
            }
          }
        }
      }
    }

    if (cleaned > 0) {
      console.log('[TokenManager] Cleaned up expired tokens:', {
        userId,
        count: cleaned,
      });
    }

    return cleaned;
  }

  /**
   * Get token statistics for a user
   */
  async getTokenStats(userId: string): Promise<{
    activeTokens: number;
    oldestToken: string | null;
    newestToken: string | null;
  }> {
    const tokens = await this.getActiveTokens(userId);

    if (tokens.length === 0) {
      return {
        activeTokens: 0,
        oldestToken: null,
        newestToken: null,
      };
    }

    tokens.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    return {
      activeTokens: tokens.length,
      oldestToken: tokens[0].createdAt,
      newestToken: tokens[tokens.length - 1].createdAt,
    };
  }
}
