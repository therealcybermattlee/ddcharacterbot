/**
 * Database Utilities - Barrel Export
 *
 * Centralized exports for database operations:
 * - Client utilities for query execution
 * - Transaction wrappers for atomic operations
 * - Migration system for schema management
 */

// Client utilities
export {
  executeQuery,
  executeQueryFirst,
  executeCommand,
  executeWithMetrics,
  executeBatch,
  tableExists,
  getDatabaseStats,
  type DatabaseClient,
  type QueryMetrics,
  type DatabaseStats,
} from './client';

// Transaction utilities
export {
  executeTransaction,
  withOptimisticLock,
  withIdempotency,
  createSavepoint,
  logAuditEntry,
  acquireLock,
  releaseLock,
  withLock,
  type TransactionOperation,
  type TransactionResult,
  type Savepoint,
  type AuditLogEntry,
} from './transactions';

// Migration utilities
export {
  getAppliedMigrations,
  isMigrationApplied,
  runMigrations,
  validateMigrations,
  getMigrationStatus,
  resetMigrations,
  type Migration,
  type MigrationResult,
  type MigrationStatus,
} from './migrations';

// Performance utilities
export {
  performanceTracker,
  executeWithTracking,
  cachedQuery,
  batchQueries,
  analyzeIndexUsage,
  explainQuery,
  generatePerformanceReport,
  prefetchRelated,
  type CacheOptions,
  type PerformanceReport,
} from './performance';
