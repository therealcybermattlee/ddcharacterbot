// KV Storage Manager for Caching and Session Management
// Provides utilities for interacting with Cloudflare KV storage

import type { KVNamespace } from '@cloudflare/workers-types';

export interface SessionData {
  userId: string;
  username: string;
  email: string;
  createdAt: number;
  lastActivity: number;
  ipAddress?: string;
  userAgent?: string;
}

export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  version?: string;
}

export class KVManager {
  private cache: KVNamespace;
  private sessions: KVNamespace;

  constructor(cache: KVNamespace, sessions: KVNamespace) {
    this.cache = cache;
    this.sessions = sessions;
  }

  // Session Management
  async createSession(sessionId: string, sessionData: SessionData, ttlSeconds = 86400): Promise<void> {
    const expirationTtl = ttlSeconds;
    await this.sessions.put(
      `session:${sessionId}`,
      JSON.stringify(sessionData),
      { expirationTtl }
    );
  }

  async getSession(sessionId: string): Promise<SessionData | null> {
    const sessionJson = await this.sessions.get(`session:${sessionId}`);
    return sessionJson ? JSON.parse(sessionJson) : null;
  }

  async updateSession(sessionId: string, updates: Partial<SessionData>): Promise<void> {
    const existing = await this.getSession(sessionId);
    if (!existing) return;

    const updated = { ...existing, ...updates, lastActivity: Date.now() };
    await this.sessions.put(`session:${sessionId}`, JSON.stringify(updated));
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.sessions.delete(`session:${sessionId}`);
  }

  async getUserSessions(userId: string): Promise<string[]> {
    // List all sessions for a user (for logout all devices)
    const { keys } = await this.sessions.list({ prefix: 'session:' });
    const userSessions: string[] = [];

    for (const key of keys) {
      const sessionData = await this.getSession(key.name.replace('session:', ''));
      if (sessionData?.userId === userId) {
        userSessions.push(key.name.replace('session:', ''));
      }
    }

    return userSessions;
  }

  // Cache Management
  async setCache<T>(key: string, data: T, ttlSeconds = 3600, version?: string): Promise<void> {
    const cacheEntry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000,
      version,
    };

    await this.cache.put(
      `cache:${key}`,
      JSON.stringify(cacheEntry),
      { expirationTtl: ttlSeconds }
    );
  }

  async getCache<T>(key: string, version?: string): Promise<T | null> {
    const cacheJson = await this.cache.get(`cache:${key}`);
    if (!cacheJson) return null;

    try {
      const cacheEntry: CacheEntry<T> = JSON.parse(cacheJson);
      
      // Check version if provided
      if (version && cacheEntry.version !== version) {
        await this.deleteCache(key);
        return null;
      }

      // Check if expired (fallback check)
      if (Date.now() > cacheEntry.timestamp + cacheEntry.ttl) {
        await this.deleteCache(key);
        return null;
      }

      return cacheEntry.data;
    } catch {
      await this.deleteCache(key);
      return null;
    }
  }

  async deleteCache(key: string): Promise<void> {
    await this.cache.delete(`cache:${key}`);
  }

  async invalidateCachePattern(pattern: string): Promise<void> {
    const { keys } = await this.cache.list({ prefix: `cache:${pattern}` });
    await Promise.all(keys.map(key => this.cache.delete(key.name)));
  }

  // Rate Limiting using KV
  async checkRateLimit(identifier: string, limit: number, windowSeconds: number): Promise<{
    allowed: boolean;
    remaining: number;
    resetTime: number;
  }> {
    const key = `rate_limit:${identifier}`;
    const now = Math.floor(Date.now() / 1000);
    const windowStart = Math.floor(now / windowSeconds) * windowSeconds;
    
    const rateLimitData = await this.cache.get(key);
    let requests = 0;
    
    if (rateLimitData) {
      try {
        const parsed = JSON.parse(rateLimitData);
        if (parsed.window === windowStart) {
          requests = parsed.requests;
        }
      } catch {
        // Invalid data, start fresh
      }
    }

    const allowed = requests < limit;
    const newRequests = requests + 1;

    // Update the counter
    await this.cache.put(
      key,
      JSON.stringify({
        requests: newRequests,
        window: windowStart,
      }),
      { expirationTtl: windowSeconds }
    );

    return {
      allowed,
      remaining: Math.max(0, limit - newRequests),
      resetTime: windowStart + windowSeconds,
    };
  }

  // Character/Campaign caching helpers
  async cacheCharacter(characterId: string, characterData: any, ttlSeconds = 1800): Promise<void> {
    await this.setCache(`character:${characterId}`, characterData, ttlSeconds, '1.0');
  }

  async getCachedCharacter(characterId: string): Promise<any | null> {
    return this.getCache(`character:${characterId}`, '1.0');
  }

  async invalidateCharacterCache(characterId: string): Promise<void> {
    await this.deleteCache(`character:${characterId}`);
  }

  async cacheCampaign(campaignId: string, campaignData: any, ttlSeconds = 1800): Promise<void> {
    await this.setCache(`campaign:${campaignId}`, campaignData, ttlSeconds, '1.0');
  }

  async getCachedCampaign(campaignId: string): Promise<any | null> {
    return this.getCache(`campaign:${campaignId}`, '1.0');
  }

  async invalidateCampaignCache(campaignId: string): Promise<void> {
    await this.deleteCache(`campaign:${campaignId}`);
    // Also invalidate related character caches
    await this.invalidateCachePattern(`campaign_characters:${campaignId}`);
  }

  // User preferences and settings cache
  async cacheUserPreferences(userId: string, preferences: any, ttlSeconds = 86400): Promise<void> {
    await this.setCache(`user_prefs:${userId}`, preferences, ttlSeconds, '1.0');
  }

  async getCachedUserPreferences(userId: string): Promise<any | null> {
    return this.getCache(`user_prefs:${userId}`, '1.0');
  }

  // Health check for KV stores
  async healthCheck(): Promise<{ cache: boolean; sessions: boolean }> {
    try {
      const testKey = `health_check:${Date.now()}`;
      const testData = { timestamp: Date.now() };

      // Test cache KV
      await this.cache.put(testKey, JSON.stringify(testData), { expirationTtl: 60 });
      const cacheResult = await this.cache.get(testKey);
      const cacheHealthy = cacheResult !== null;
      await this.cache.delete(testKey);

      // Test sessions KV
      await this.sessions.put(testKey, JSON.stringify(testData), { expirationTtl: 60 });
      const sessionsResult = await this.sessions.get(testKey);
      const sessionsHealthy = sessionsResult !== null;
      await this.sessions.delete(testKey);

      return {
        cache: cacheHealthy,
        sessions: sessionsHealthy,
      };
    } catch {
      return {
        cache: false,
        sessions: false,
      };
    }
  }
}