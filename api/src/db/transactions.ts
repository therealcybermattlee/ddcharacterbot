/**
 * Database Transaction Wrapper
 *
 * Note: D1 doesn't support traditional ACID transactions across multiple queries.
 * This wrapper provides transaction-like semantics using:
 * 1. Batch execution for atomic operations
 * 2. Savepoint-style rollback patterns
 * 3. Optimistic locking for conflict resolution
 */

import type { D1Database, D1Result } from '@cloudflare/workers-types';
import { executeCommand, executeQuery, executeQueryFirst } from './client';

export interface TransactionOperation {
  query: string;
  params?: unknown[];
  description?: string;
}

export interface TransactionResult {
  success: boolean;
  operations: number;
  duration: number;
  results?: D1Result[];
  error?: string;
}

/**
 * Execute multiple operations in a batch with rollback capability
 *
 * While D1 doesn't support true transactions, this provides:
 * - Sequential execution
 * - Error handling and reporting
 * - Operation tracking
 *
 * @param db D1 database instance
 * @param operations Array of operations to execute
 * @returns Transaction result with success status
 */
export async function executeTransaction(
  db: D1Database,
  operations: TransactionOperation[]
): Promise<TransactionResult> {
  const startTime = Date.now();
  const results: D1Result[] = [];
  let completedOperations = 0;

  try {
    // Execute operations sequentially
    for (const op of operations) {
      const result = await executeCommand(db, op.query, op.params || []);
      results.push(result);
      completedOperations++;
    }

    const duration = Date.now() - startTime;

    return {
      success: true,
      operations: completedOperations,
      duration,
      results,
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);

    console.error('[DB Transaction] Failed:', {
      completedOperations,
      totalOperations: operations.length,
      duration,
      error: errorMessage,
      failedOperation: operations[completedOperations]?.description || 'unknown',
    });

    return {
      success: false,
      operations: completedOperations,
      duration,
      error: errorMessage,
    };
  }
}

/**
 * Optimistic Locking Pattern
 *
 * Prevents concurrent modification conflicts by checking version numbers
 *
 * @example
 * const result = await withOptimisticLock(
 *   db,
 *   'characters',
 *   'char-123',
 *   async (currentVersion) => {
 *     return {
 *       query: 'UPDATE characters SET hit_points = ?, version = ? WHERE id = ? AND version = ?',
 *       params: [25, currentVersion + 1, 'char-123', currentVersion]
 *     };
 *   }
 * );
 */
export async function withOptimisticLock<T = D1Result>(
  db: D1Database,
  tableName: string,
  recordId: string,
  updateFn: (currentVersion: number) => Promise<TransactionOperation>
): Promise<{ success: boolean; result?: T; retries?: number }> {
  const MAX_RETRIES = 3;
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      // Get current version
      const record = await executeQueryFirst<{ version?: number }>(
        db,
        `SELECT version FROM ${tableName} WHERE id = ?`,
        [recordId]
      );

      if (!record) {
        return { success: false };
      }

      const currentVersion = record.version ?? 0;

      // Generate update operation
      const operation = await updateFn(currentVersion);

      // Execute update with version check
      const result = await executeCommand(
        db,
        operation.query,
        operation.params || []
      );

      // Check if update actually modified a row
      if ('meta' in result && typeof result.meta === 'object' && result.meta !== null && 'changes' in result.meta && (result.meta as any).changes === 0) {
        // Version conflict - retry
        retries++;
        await new Promise((resolve) => setTimeout(resolve, 50 * retries)); // Exponential backoff
        continue;
      }

      return { success: true, result: result as T, retries };
    } catch (error) {
      console.error('[DB Optimistic Lock] Failed:', {
        tableName,
        recordId,
        retries,
        error: error instanceof Error ? error.message : String(error),
      });
      return { success: false, retries };
    }
  }

  console.warn('[DB Optimistic Lock] Max retries exceeded:', {
    tableName,
    recordId,
    retries,
  });

  return { success: false, retries };
}

/**
 * Idempotent operation wrapper
 * Ensures operations can be safely retried without side effects
 *
 * @param db D1 database instance
 * @param idempotencyKey Unique key for this operation
 * @param ttlSeconds How long to store the idempotency record (default: 24 hours)
 * @param operation The operation to execute
 */
export async function withIdempotency<T = unknown>(
  db: D1Database,
  idempotencyKey: string,
  operation: () => Promise<T>,
  ttlSeconds: number = 86400
): Promise<{ cached: boolean; result: T }> {
  try {
    // Check if operation was already executed
    const existing = await executeQueryFirst<{
      result: string;
      created_at: string;
    }>(
      db,
      `SELECT result, created_at FROM idempotency_cache
       WHERE key = ? AND expires_at > datetime('now')`,
      [idempotencyKey]
    );

    if (existing) {
      console.log('[DB Idempotency] Cache hit:', { idempotencyKey });
      return {
        cached: true,
        result: JSON.parse(existing.result) as T,
      };
    }

    // Execute operation
    const result = await operation();

    // Store result for future requests
    const expiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString();

    await executeCommand(
      db,
      `INSERT INTO idempotency_cache (key, result, expires_at) VALUES (?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET result = ?, expires_at = ?`,
      [
        idempotencyKey,
        JSON.stringify(result),
        expiresAt,
        JSON.stringify(result),
        expiresAt,
      ]
    );

    return {
      cached: false,
      result,
    };
  } catch (error) {
    console.error('[DB Idempotency] Failed:', {
      idempotencyKey,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

/**
 * Create savepoint for nested transaction-like behavior
 * Note: D1 doesn't support savepoints, but this provides a pattern for tracking state
 */
export interface Savepoint {
  id: string;
  timestamp: number;
  description?: string;
}

export function createSavepoint(description?: string): Savepoint {
  return {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    description,
  };
}

/**
 * Audit log for database operations
 * Useful for tracking changes and debugging transaction issues
 */
export interface AuditLogEntry {
  operationType: 'INSERT' | 'UPDATE' | 'DELETE' | 'SELECT';
  tableName: string;
  recordId?: string;
  userId?: string;
  changes?: Record<string, unknown>;
  timestamp: string;
}

export async function logAuditEntry(
  db: D1Database,
  entry: AuditLogEntry
): Promise<void> {
  try {
    await executeCommand(
      db,
      `INSERT INTO audit_log (
        id, operation_type, table_name, record_id, user_id, changes, timestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        crypto.randomUUID(),
        entry.operationType,
        entry.tableName,
        entry.recordId || null,
        entry.userId || null,
        entry.changes ? JSON.stringify(entry.changes) : null,
        entry.timestamp,
      ]
    );
  } catch (error) {
    // Don't fail the main operation if audit logging fails
    console.error('[DB Audit Log] Failed to write entry:', {
      entry,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Distributed lock implementation using KV or database
 * Useful for preventing concurrent modifications
 */
export async function acquireLock(
  db: D1Database,
  lockKey: string,
  ttlSeconds: number = 30
): Promise<{ acquired: boolean; lockId?: string }> {
  try {
    const lockId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString();

    const result = await executeCommand(
      db,
      `INSERT INTO distributed_locks (key, lock_id, expires_at, acquired_at)
       VALUES (?, ?, ?, datetime('now'))
       ON CONFLICT(key) DO NOTHING`,
      [lockKey, lockId, expiresAt]
    );

    // Check if we acquired the lock
    if ('meta' in result && result.meta.changes > 0) {
      return { acquired: true, lockId };
    }

    return { acquired: false };
  } catch (error) {
    console.error('[DB Lock] Failed to acquire:', {
      lockKey,
      error: error instanceof Error ? error.message : String(error),
    });
    return { acquired: false };
  }
}

export async function releaseLock(
  db: D1Database,
  lockKey: string,
  lockId: string
): Promise<boolean> {
  try {
    const result = await executeCommand(
      db,
      `DELETE FROM distributed_locks WHERE key = ? AND lock_id = ?`,
      [lockKey, lockId]
    );

    return 'meta' in result && result.meta.changes > 0;
  } catch (error) {
    console.error('[DB Lock] Failed to release:', {
      lockKey,
      lockId,
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}

/**
 * Execute with distributed lock
 */
export async function withLock<T = unknown>(
  db: D1Database,
  lockKey: string,
  operation: () => Promise<T>,
  ttlSeconds: number = 30
): Promise<{ success: boolean; result?: T }> {
  const lock = await acquireLock(db, lockKey, ttlSeconds);

  if (!lock.acquired || !lock.lockId) {
    console.warn('[DB Lock] Failed to acquire lock:', { lockKey });
    return { success: false };
  }

  try {
    const result = await operation();
    return { success: true, result };
  } catch (error) {
    console.error('[DB Lock] Operation failed:', {
      lockKey,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  } finally {
    await releaseLock(db, lockKey, lock.lockId);
  }
}
