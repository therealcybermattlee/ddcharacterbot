# Database Utilities Documentation

Comprehensive database utilities for the D&D Character Manager API, providing transaction management, migration system, and performance optimization.

## Table of Contents

- [Overview](#overview)
- [Client Utilities](#client-utilities)
- [Transaction Management](#transaction-management)
- [Migration System](#migration-system)
- [Performance Optimization](#performance-optimization)
- [Best Practices](#best-practices)

---

## Overview

The database layer provides:

1. **Client Utilities** - Query execution with error handling and metrics
2. **Transaction Wrappers** - Atomic operations and concurrency control
3. **Migration System** - Automated schema management with validation
4. **Performance Tools** - Query optimization, caching, and monitoring

### Architecture

```
api/src/db/
├── client.ts         # Core query execution utilities
├── transactions.ts   # Transaction patterns and locking
├── migrations.ts     # Migration management system
├── performance.ts    # Performance monitoring and optimization
├── index.ts          # Barrel exports
└── README.md         # This file
```

---

## Client Utilities

### Basic Query Execution

```typescript
import { executeQuery, executeQueryFirst, executeCommand } from './db';

// Execute query returning multiple rows
const characters = await executeQuery<Character>(
  db,
  'SELECT * FROM characters WHERE user_id = ?',
  [userId]
);

// Execute query returning single row
const character = await executeQueryFirst<Character>(
  db,
  'SELECT * FROM characters WHERE id = ?',
  [characterId]
);

// Execute command (INSERT, UPDATE, DELETE)
await executeCommand(
  db,
  'UPDATE characters SET hit_points = ? WHERE id = ?',
  [newHP, characterId]
);
```

### Performance Metrics

```typescript
import { executeWithMetrics } from './db';

const { result, metrics } = await executeWithMetrics<Character>(
  db,
  'SELECT * FROM characters WHERE user_id = ?',
  [userId]
);

console.log(`Query took ${metrics.duration}ms`);
console.log(`Returned ${metrics.rowCount} rows`);
```

### Batch Operations

```typescript
import { executeBatch } from './db';

const results = await executeBatch(db, [
  { query: 'INSERT INTO characters (...) VALUES (?)', params: [...] },
  { query: 'UPDATE users SET last_login = ? WHERE id = ?', params: [...] },
  { query: 'INSERT INTO audit_log (...) VALUES (?)', params: [...] },
]);
```

---

## Transaction Management

### Basic Transactions

```typescript
import { executeTransaction } from './db';

const result = await executeTransaction(db, [
  {
    query: 'UPDATE characters SET hit_points = ? WHERE id = ?',
    params: [newHP, charId],
    description: 'Update character HP',
  },
  {
    query: 'INSERT INTO audit_log (...) VALUES (?)',
    params: [...],
    description: 'Log HP change',
  },
]);

if (result.success) {
  console.log(`Transaction completed in ${result.duration}ms`);
} else {
  console.error(`Transaction failed: ${result.error}`);
}
```

### Optimistic Locking

Prevents concurrent modification conflicts:

```typescript
import { withOptimisticLock } from './db';

const result = await withOptimisticLock(
  db,
  'characters',  // table name
  'char-123',    // record ID
  async (currentVersion) => ({
    query: `UPDATE characters
            SET hit_points = ?, version = ?
            WHERE id = ? AND version = ?`,
    params: [25, currentVersion + 1, 'char-123', currentVersion]
  })
);

if (result.success) {
  console.log('Update successful');
} else {
  console.log(`Failed after ${result.retries} retries`);
}
```

### Idempotency

Safely retry operations without side effects:

```typescript
import { withIdempotency } from './db';

const { cached, result } = await withIdempotency(
  db,
  'create-character-user123-1234567890', // unique operation key
  async () => {
    // This operation will only execute once
    return await createCharacter(characterData);
  },
  3600 // TTL: 1 hour
);

if (cached) {
  console.log('Returning cached result from previous operation');
}
```

### Distributed Locks

Prevent concurrent modifications:

```typescript
import { withLock } from './db';

const result = await withLock(
  db,
  'update-character-char123',  // lock key
  async () => {
    // Critical section - only one process can execute this at a time
    const character = await getCharacter('char123');
    character.hit_points -= damage;
    await updateCharacter(character);
    return character;
  },
  30  // lock TTL: 30 seconds
);
```

### Audit Logging

Track all database modifications:

```typescript
import { logAuditEntry } from './db';

await logAuditEntry(db, {
  operationType: 'UPDATE',
  tableName: 'characters',
  recordId: 'char-123',
  userId: 'user-456',
  changes: {
    hit_points: { from: 30, to: 25 },
  },
  timestamp: new Date().toISOString(),
});
```

---

## Migration System

### Migration Structure

Create migration files in `database/migrations/`:

```sql
-- 001_initial_schema.sql
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    -- ...
);

CREATE INDEX idx_users_email ON users(email);
```

### Running Migrations

```typescript
import { runMigrations } from './db';

const migrations = [
  {
    id: '0001',
    name: 'initial schema',
    sql: await readFile('database/migrations/001_initial_schema.sql', 'utf-8')
  },
  // ...
];

const result = await runMigrations(db, migrations);

if (result.success) {
  console.log(`Applied ${result.appliedMigrations.length} migrations`);
} else {
  console.error(`Failed at migration ${result.failedMigration}: ${result.error}`);
}
```

### Migration Status

```typescript
import { getMigrationStatus } from './db';

const status = await getMigrationStatus(db, migrations);

console.log(`Total migrations: ${status.total}`);
console.log(`Applied: ${status.applied}`);
console.log(`Pending: ${status.pending}`);
console.log(`Last applied: ${status.lastApplied?.name} at ${status.lastApplied?.appliedAt}`);
console.log(`Average execution time: ${status.averageExecutionTime}ms`);
```

### Migration Validation

```typescript
import { validateMigrations } from './db';

const { valid, issues } = await validateMigrations(db, migrations);

if (!valid) {
  console.error('Migration integrity issues found:');
  issues.forEach(issue => console.error(`  - ${issue}`));
}
```

### CLI Migration Runner

```bash
# Apply migrations to development
cd api
npx tsx scripts/run-migrations.ts --env development

# Check migration status
npx tsx scripts/run-migrations.ts --env production --status

# Validate migration integrity
npx tsx scripts/run-migrations.ts --env production --validate
```

---

## Performance Optimization

### Query Performance Tracking

```typescript
import { executeWithTracking, performanceTracker } from './db';

// Track query performance
await executeWithTracking(
  db,
  'get-user-characters',  // query key for tracking
  'SELECT * FROM characters WHERE user_id = ?',
  [userId]
);

// Get performance metrics
const metrics = performanceTracker.getMetrics();
console.log(metrics['get-user-characters']);
// => { count: 150, totalDuration: 3250, avgDuration: 21.67 }

// Get slowest queries
const slow = performanceTracker.getSlowestQueries(10);
```

### Query Result Caching

```typescript
import { cachedQuery } from './db';

const { cached, result } = await cachedQuery<Character>(
  db,
  kv,  // KV namespace binding
  { key: 'character:char-123', ttl: 300 },  // 5 minutes
  'SELECT * FROM characters WHERE id = ?',
  ['char-123']
);

if (cached) {
  console.log('Served from cache');
}
```

### Index Analysis

```typescript
import { analyzeIndexUsage } from './db';

const analysis = await analyzeIndexUsage(db);

// Find columns without indexes
const missingIndexes = analysis.filter(a => !a.hasIndex);
console.log('Missing indexes:', missingIndexes);
```

### Query Plan Analysis

```typescript
import { explainQuery } from './db';

const plan = await explainQuery(
  db,
  'SELECT * FROM characters WHERE user_id = ? AND level > ?',
  ['user-123', 5]
);

console.log('Query plan:', plan);
// Check for "SCAN" (bad) vs "SEARCH" (good) in output
```

### Performance Report

```typescript
import { generatePerformanceReport } from './db';

const report = generatePerformanceReport();

console.log(`Total queries: ${report.totalQueries}`);
console.log(`Average duration: ${report.averageDuration.toFixed(2)}ms`);
console.log(`Queries over target (100ms): ${report.queriesOverTarget}`);
console.log('\nSlowest queries:');
report.slowQueries.forEach(q => {
  console.log(`  ${q.query}: ${q.avgDuration.toFixed(2)}ms (${q.count} executions)`);
});
```

### Prefetch Related Data

Prevent N+1 query problems:

```typescript
import { prefetchRelated } from './db';

// Get characters
const characters = await getCharacters(userId);

// Prefetch related classes in one query
const classData = await prefetchRelated(
  db,
  characters,
  {
    foreignKey: 'class_id',
    table: 'classes',
    fields: ['id', 'name', 'hit_die', 'spellcasting_ability']
  }
);

// Use prefetched data
characters.forEach(char => {
  const classInfo = classData.get(char.class_id);
  console.log(`${char.name} is a level ${char.level} ${classInfo?.name}`);
});
```

---

## Best Practices

### 1. Always Use Prepared Statements

```typescript
// Good - parameterized
await executeQuery(db, 'SELECT * FROM users WHERE id = ?', [userId]);

// Bad - vulnerable to SQL injection
await executeQuery(db, `SELECT * FROM users WHERE id = '${userId}'`);
```

### 2. Handle Errors Gracefully

```typescript
try {
  const result = await executeQuery(db, query, params);
  return result.results;
} catch (error) {
  console.error('Query failed:', error);
  // Return fallback data or rethrow
  return [];
}
```

### 3. Use Transactions for Multi-Step Operations

```typescript
// Good - atomic
await executeTransaction(db, [
  { query: 'UPDATE characters SET ...', params: [...] },
  { query: 'INSERT INTO audit_log ...', params: [...] },
]);

// Bad - not atomic, can fail halfway
await executeCommand(db, 'UPDATE characters SET ...', [...]);
await executeCommand(db, 'INSERT INTO audit_log ...', [...]);
```

### 4. Monitor Performance

```typescript
// Track slow queries
if (duration > 100) {
  console.warn('Slow query:', { query, duration });
}

// Generate regular performance reports
setInterval(() => {
  const report = generatePerformanceReport();
  if (report.queriesOverTarget > 0) {
    console.warn(`${report.queriesOverTarget} queries exceeding 100ms target`);
  }
}, 60000); // Every minute
```

### 5. Use Indexes Strategically

```sql
-- Index columns in WHERE clauses
CREATE INDEX idx_characters_user_id ON characters(user_id);

-- Composite indexes for multi-column filters
CREATE INDEX idx_characters_user_level ON characters(user_id, level);

-- Partial indexes for filtered queries
CREATE INDEX idx_characters_public
    ON characters(is_public, name)
    WHERE is_public = TRUE;
```

### 6. Cache Frequently Accessed Data

```typescript
// Cache reference data (races, classes, spells)
const classes = await cachedQuery(
  db, kv,
  { key: 'all-classes', ttl: 3600 },  // 1 hour
  'SELECT * FROM classes'
);
```

### 7. Validate Migrations

```typescript
// Always validate before deploying
const { valid, issues } = await validateMigrations(db, migrations);
if (!valid) {
  throw new Error(`Migration validation failed: ${issues.join(', ')}`);
}
```

---

## Migration Naming Convention

```
NNN_descriptive_name.sql

Examples:
001_initial_schema.sql
002_seed_reference_data.sql
015_transaction_support_tables.sql
016_performance_indexes.sql
```

- Use 3-4 digit numeric prefix
- Separate words with underscores
- Use descriptive, imperative names
- Keep SQL files focused (one logical change per migration)

---

## Performance Targets

| Operation | Target | Monitoring |
|-----------|--------|------------|
| Simple SELECT | < 50ms | `executeWithTracking` |
| JOIN queries | < 100ms | Performance reports |
| INSERT/UPDATE | < 50ms | Transaction metrics |
| Full migrations | < 5s total | Migration result |

---

## Troubleshooting

### Slow Queries

```typescript
// Analyze query plan
const plan = await explainQuery(db, query, params);
// Look for "SCAN table" - indicates missing index
// "SEARCH table USING INDEX" is good
```

### Lock Contention

```typescript
// If locks frequently timeout:
const result = await withLock(
  db,
  lockKey,
  operation,
  60  // Increase TTL
);
```

### Migration Failures

```bash
# Check applied migrations
npx tsx scripts/run-migrations.ts --env development --status

# Validate integrity
npx tsx scripts/run-migrations.ts --env development --validate

# View D1 database
npx wrangler d1 execute dnd-character-manager-dev --command "SELECT * FROM schema_migrations"
```

---

## Support Tables

The transaction system requires these support tables (created by migration 015):

```sql
-- Idempotency cache
CREATE TABLE idempotency_cache (
    key TEXT PRIMARY KEY,
    result TEXT NOT NULL,
    expires_at TEXT NOT NULL
);

-- Distributed locks
CREATE TABLE distributed_locks (
    key TEXT PRIMARY KEY,
    lock_id TEXT NOT NULL,
    expires_at TEXT NOT NULL
);

-- Audit log
CREATE TABLE audit_log (
    id TEXT PRIMARY KEY,
    operation_type TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id TEXT,
    user_id TEXT,
    changes TEXT,
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP
);
```

---

## Additional Resources

- [D1 Documentation](https://developers.cloudflare.com/d1/)
- [SQLite SQL Syntax](https://www.sqlite.org/lang.html)
- [Query Optimization](https://www.sqlite.org/optoverview.html)
- [CICD.md](/.github/CICD.md) - CI/CD pipeline documentation
