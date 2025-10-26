# Authentication & Authorization System

Comprehensive authentication and authorization system for the D&D Character Manager API with JWT tokens, role-based access control, and refresh token management.

## Table of Contents

- [Overview](#overview)
- [JWT Service](#jwt-service)
- [Password Service](#password-service)
- [Token Manager](#token-manager)
- [Authorization Middleware](#authorization-middleware)
- [Security Best Practices](#security-best-practices)
- [Testing](#testing)

---

## Overview

The authentication system provides:

1. **JWT Authentication** - Secure token-based authentication with HS256
2. **Password Hashing** - scrypt-based password hashing with migration support
3. **Token Management** - Separate access and refresh tokens with KV storage
4. **Role-Based Authorization** - Fine-grained access control (DM, Player, Observer)
5. **Session Management** - KV-backed sessions with automatic expiration
6. **Token Revocation** - Blacklisting and immediate token invalidation

### Architecture

```
┌─────────────────┐
│  Client Request │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Auth Middleware│  ← Validates JWT token
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Authorization   │  ← Checks user role
│  Middleware     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Route Handler  │
└─────────────────┘
```

---

## JWT Service

Located in `lib/jwt-service.ts`, provides token generation and validation.

### Token Types

- **Access Token**: Short-lived (1 hour), used for API requests
- **Refresh Token**: Long-lived (7 days), used to obtain new access tokens

### Usage

```typescript
import { JWTService } from './lib/jwt-service';

const jwtService = new JWTService(JWT_SECRET);

// Sign a token
const accessToken = await jwtService.sign(
  {
    userId: 'user-123',
    email: 'user@example.com',
    username: 'johndoe',
    role: 'player'
  },
  3600,      // expiry in seconds
  'access'   // token type
);

// Verify a token
const payload = await jwtService.verify(accessToken, 'access');
if (payload) {
  console.log('Valid token for user:', payload.userId);
}

// Decode without verification (useful for extracting info)
const decoded = jwtService.decode(accessToken);

// Check if expired
const isExpired = jwtService.isExpired(accessToken);

// Get time to expiry
const timeLeft = jwtService.getTimeToExpiry(accessToken); // seconds
```

### Token Payload

```typescript
interface JWTPayload {
  userId: string;
  email: string;
  username: string;
  role: 'dm' | 'player' | 'observer';
  iat: number;  // Issued at (Unix timestamp)
  exp: number;  // Expiration (Unix timestamp)
  type: 'access' | 'refresh';
}
```

---

## Password Service

Located in `lib/password-service.ts`, provides secure password hashing using scrypt.

### Configuration

- **Algorithm**: scrypt
- **Parameters**: N=2^16 (65536), r=8, p=1
- **Salt**: 16 bytes (128 bits)
- **Hash length**: 32 bytes (256 bits)

### Usage

```typescript
import { PasswordService } from './lib/password-service';

// Hash a password
const hash = await PasswordService.hash('MyP@ssw0rd123!');
// Returns: "scrypt$<salt>$<hash>"

// Verify password
const isValid = await PasswordService.verify('MyP@ssw0rd123!', hash);

// Validate password complexity
const validation = PasswordService.validateComplexity('weak');
if (!validation.valid) {
  console.error('Password errors:', validation.errors);
}

// Check if hash needs migration from SHA-256
if (PasswordService.needsMigration(storedHash)) {
  // Re-hash with scrypt on next successful login
}

// Generate secure random password
const newPassword = PasswordService.generateSecurePassword(16);
```

### Password Requirements

- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)

### Legacy Support

The password service supports automatic migration from legacy SHA-256 hashes:

```typescript
// On login
const isValid = await PasswordService.verify(password, user.passwordHash);

if (isValid && PasswordService.needsMigration(user.passwordHash)) {
  // Re-hash with scrypt
  const newHash = await PasswordService.hash(password);
  await updateUserPassword(user.id, newHash);
}
```

---

## Token Manager

Located in `lib/token-manager.ts`, manages token lifecycle with KV storage.

### Features

- Token pair generation (access + refresh)
- Refresh token rotation
- Token revocation (individual or all)
- Token blacklisting
- Session tracking with device info
- Active token management

### Usage

```typescript
import { TokenManager } from './lib/token-manager';

const tokenManager = new TokenManager(jwtService, kv);

// Generate token pair
const tokens = await tokenManager.generateTokenPair(
  {
    userId: 'user-123',
    email: 'user@example.com',
    username: 'johndoe',
    role: 'player'
  },
  'Mozilla/5.0...',  // optional device info
  '192.168.1.1'      // optional IP address
);

console.log('Access token:', tokens.accessToken);
console.log('Refresh token:', tokens.refreshToken);
console.log('Expires in:', tokens.expiresIn, 'seconds');

// Refresh access token
const newTokens = await tokenManager.refreshAccessToken(refreshToken);
if (newTokens) {
  console.log('New access token:', newTokens.accessToken);
}

// Revoke a specific token (logout from one device)
await tokenManager.revokeRefreshToken(userId, refreshToken);

// Revoke all tokens (logout from all devices)
await tokenManager.revokeAllRefreshTokens(userId);

// Blacklist an access token (immediate revocation)
await tokenManager.blacklistToken(accessToken, 3600);

// Check if blacklisted
const isBlacklisted = await tokenManager.isTokenBlacklisted(accessToken);

// Get active tokens for a user
const activeTokens = await tokenManager.getActiveTokens(userId);
console.log('Active sessions:', activeTokens.length);

// Get token statistics
const stats = await tokenManager.getTokenStats(userId);
console.log('Active tokens:', stats.activeTokens);
console.log('Oldest token:', stats.oldestToken);
console.log('Newest token:', stats.newestToken);
```

### Token Storage in KV

```
Key Format:
- Refresh tokens: "refresh_token:{userId}:{token}"
- Blacklist: "blacklist:{token}"
- Sessions: "session:{userId}"

Expiration:
- Refresh tokens: Auto-expire after 7 days
- Blacklist: Auto-expire after token expiry
- Sessions: Auto-expire after 24 hours
```

---

## Authorization Middleware

Located in `middleware/authorization.ts`, provides role-based access control.

### Roles

- **dm**: Dungeon Master (full access to owned campaigns)
- **player**: Player (access to own characters and joined campaigns)
- **observer**: Read-only access to public campaigns

### Usage

```typescript
import {
  requireRole,
  requireDM,
  requirePlayerOrDM,
  requireAuthenticated,
  requireResourceOwnership,
  requireCampaignMembership,
  allowReadOnlyForObservers
} from './middleware/authorization';

// Require specific roles
router.post('/campaigns', requireRole(['dm']), async (c) => {
  // Only DMs can create campaigns
});

// Require DM role (shorthand)
router.delete('/campaigns/:id', requireDM(), async (c) => {
  // Only DMs can delete campaigns
});

// Require Player or DM
router.post('/characters', requirePlayerOrDM(), async (c) => {
  // Players and DMs can create characters
});

// Require any authenticated user
router.get('/races', requireAuthenticated(), async (c) => {
  // All roles can view races
});

// Require resource ownership
router.put('/characters/:id', requireResourceOwnership('characters'), async (c) => {
  // Only the character owner can update it
});

// Require campaign membership
router.get('/campaigns/:id', requireCampaignMembership(), async (c) => {
  const isCampaignDM = c.get('isCampaignDM');
  const campaignRole = c.get('campaignRole');
  // Access granted to campaign members
});

// Block write operations for observers
router.use('/campaigns/*', allowReadOnlyForObservers());
```

### Error Responses

**401 Unauthorized** - Missing or invalid token:
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  },
  "timestamp": "2025-10-25T12:00:00.000Z"
}
```

**403 Forbidden** - Insufficient permissions:
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Access denied. Required role: dm or player",
    "details": {
      "userRole": "observer",
      "requiredRoles": ["dm", "player"]
    }
  },
  "timestamp": "2025-10-25T12:00:00.000Z"
}
```

---

## Security Best Practices

### 1. Token Security

```typescript
// ✅ Good: Store tokens in HTTP-only cookies or secure storage
// ❌ Bad: Store tokens in localStorage (vulnerable to XSS)

// ✅ Good: Always verify token type
const payload = await jwtService.verify(token, 'access');

// ❌ Bad: Skip type checking
const payload = await jwtService.verify(token);
```

### 2. Password Security

```typescript
// ✅ Good: Validate password complexity before hashing
const validation = PasswordService.validateComplexity(password);
if (!validation.valid) {
  return errors(validation.errors);
}
const hash = await PasswordService.hash(password);

// ❌ Bad: Hash without validation
const hash = await PasswordService.hash(weakPassword);
```

### 3. Token Revocation

```typescript
// ✅ Good: Revoke refresh token on logout
await tokenManager.revokeRefreshToken(userId, refreshToken);

// ✅ Good: Blacklist access token for immediate revocation
await tokenManager.blacklistToken(accessToken, timeToExpiry);

// ❌ Bad: Just delete session without revoking tokens
await kv.delete(`session:${userId}`);
```

### 4. Role-Based Access

```typescript
// ✅ Good: Use authorization middleware
router.delete('/campaigns/:id', requireDM(), handler);

// ❌ Bad: Manual role checking in handler
router.delete('/campaigns/:id', async (c) => {
  const user = c.get('user');
  if (user.role !== 'dm') {
    return c.json({ error: 'Forbidden' }, 403);
  }
  // ...
});
```

### 5. Session Management

```typescript
// ✅ Good: Update last activity on each request
session.lastActivity = new Date().toISOString();
await kv.put(sessionKey, JSON.stringify(session), { expirationTtl: 86400 });

// ✅ Good: Clean up expired sessions
await tokenManager.cleanupExpiredTokens(userId);
```

---

## Testing

Run authentication tests:

```bash
# Run all auth tests
npm test src/__tests__/auth.test.ts

# Run with coverage
npm run test:coverage
```

### Test Coverage

- ✅ JWT token signing and verification
- ✅ Token expiration handling
- ✅ Token type validation
- ✅ Password hashing and verification
- ✅ Password complexity validation
- ✅ Legacy SHA-256 migration
- ✅ Token pair generation
- ✅ Refresh token rotation
- ✅ Token revocation
- ✅ Token blacklisting
- ✅ Active token management
- ✅ Token statistics

### Example Test

```typescript
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
```

---

## API Endpoints

### Authentication Routes

**POST /api/auth/register**
- Create new user account
- Requires: email, username, password, role (optional, defaults to 'player')
- Returns: user data + access token + refresh token

**POST /api/auth/login**
- Authenticate existing user
- Requires: email, password
- Returns: user data + access token + refresh token

**POST /api/auth/logout**
- Revoke refresh token and delete session
- Requires: Bearer token in Authorization header
- Returns: success message

**POST /api/auth/refresh**
- Get new access token using refresh token
- Requires: Bearer refresh token in Authorization header
- Returns: new access token

**GET /api/auth/profile**
- Get current user profile
- Requires: Bearer access token in Authorization header
- Returns: user data

**POST /api/auth/revoke-all**
- Logout from all devices
- Requires: Bearer access token in Authorization header
- Returns: success message with revoked token count

---

## Troubleshooting

### Token Verification Fails

```typescript
// Check if token is expired
const isExpired = jwtService.isExpired(token);

// Check if token is blacklisted
const isBlacklisted = await tokenManager.isTokenBlacklisted(token);

// Decode to inspect payload
const payload = jwtService.decode(token);
console.log('Token payload:', payload);
```

### Password Verification Fails

```typescript
// Check hash format
console.log('Hash format:', hash.split('$')[0]); // Should be 'scrypt'

// Check if migration needed
if (PasswordService.needsMigration(hash)) {
  console.log('Legacy SHA-256 hash detected');
}
```

### Session Issues

```typescript
// Check session in KV
const sessionData = await kv.get(`session:${userId}`);
if (!sessionData) {
  console.log('Session expired or deleted');
}

// Get active tokens
const tokens = await tokenManager.getActiveTokens(userId);
console.log('Active sessions:', tokens);
```

---

## Performance Considerations

### Token Verification

- Token verification is ~1-2ms (cryptographic operations)
- Blacklist checking adds ~5-10ms (KV lookup)
- Total: <15ms per request

### Password Hashing

- scrypt hashing: ~50-100ms (intentionally slow for security)
- Verification: ~50-100ms
- Use async operations to avoid blocking

### KV Storage

- Refresh token metadata: ~100 bytes
- Session data: ~200 bytes
- Blacklist entry: ~50 bytes

### Optimization Tips

```typescript
// ✅ Good: Verify token once, reuse payload
const payload = await jwtService.verify(token);
if (payload) {
  // Use payload multiple times
}

// ❌ Bad: Multiple verifications
await jwtService.verify(token); // First check
await jwtService.verify(token); // Redundant

// ✅ Good: Batch KV operations
await Promise.all([
  kv.put(key1, value1),
  kv.put(key2, value2),
  kv.put(key3, value3),
]);
```

---

## Additional Resources

- [JWT RFC 7519](https://tools.ietf.org/html/rfc7519)
- [scrypt RFC 7914](https://tools.ietf.org/html/rfc7914)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Cloudflare Workers KV Documentation](https://developers.cloudflare.com/workers/runtime-apis/kv/)
