// Cloudflare Workers Environment Types
export interface Env {
  // Cloudflare bindings
  DB: D1Database;
  KV: KVNamespace;
  ASSETS?: R2Bucket;
  
  // Environment variables
  ENVIRONMENT: string;
  CORS_ORIGIN: string;
  RATE_LIMIT_REQUESTS: string;
  RATE_LIMIT_WINDOW: string;
  
  // Secrets (set via wrangler secret put)
  JWT_SECRET: string;
}

// Authentication types
export interface JWTPayload {
  userId: string;
  email: string;
  username: string;
  role: UserRole;
  exp: number;
  iat: number;
}

export interface UserSession {
  userId: string;
  email: string;
  username: string;
  role: UserRole;
  createdAt: string;
  lastActivity: string;
}

// User types
export type UserRole = 'dm' | 'player' | 'observer';

export interface User {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

// D&D Character types
export interface Character {
  id: string;
  name: string;
  userId: string;
  campaignId?: string;
  race: string;
  characterClass: string;
  level: number;
  experiencePoints: number;
  
  // Ability scores
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  
  // Derived stats
  armorClass: number;
  hitPointsMax: number;
  hitPointsCurrent: number;
  speed: number;
  
  // Character details
  background?: string;
  alignment?: string;
  
  createdAt: string;
  updatedAt: string;
}

// Campaign types
export interface Campaign {
  id: string;
  name: string;
  description?: string;
  dmUserId: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

// Rate limiting types
export interface RateLimitInfo {
  count: number;
  resetTime: number;
  windowStart: number;
}

// Validation error types
export interface ValidationError {
  field: string;
  message: string;
}