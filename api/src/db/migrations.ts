/**
 * Database Migration System
 *
 * Automated migration management with:
 * - Sequential migration execution
 * - Migration tracking and status
 * - Validation and integrity checks
 * - Zero-downtime deployment support
 */

import type { D1Database, D1Result } from '@cloudflare/workers-types';
import { executeCommand, executeQuery, executeQueryFirst, tableExists } from './client';

export interface Migration {
  id: string;
  name: string;
  sql: string;
  appliedAt?: string;
  checksum?: string;
}

export interface MigrationResult {
  success: boolean;
  appliedMigrations: string[];
  failedMigration?: string;
  error?: string;
  duration: number;
}

/**
 * Ensure migrations table exists
 */
async function ensureMigrationsTable(db: D1Database): Promise<void> {
  const exists = await tableExists(db, 'schema_migrations');

  if (!exists) {
    await executeCommand(
      db,
      `CREATE TABLE IF NOT EXISTS schema_migrations (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        checksum TEXT NOT NULL,
        execution_time_ms INTEGER,
        success BOOLEAN NOT NULL DEFAULT TRUE
      )`
    );

    await executeCommand(
      db,
      `CREATE INDEX IF NOT EXISTS idx_schema_migrations_applied_at
       ON schema_migrations(applied_at)`
    );

    console.log('[Migrations] Created schema_migrations table');
  }
}

/**
 * Calculate migration checksum for integrity verification
 */
function calculateChecksum(sql: string): string {
  // Simple checksum using string length and char codes
  // In production, use a proper hash function
  let sum = 0;
  for (let i = 0; i < sql.length; i++) {
    sum += sql.charCodeAt(i);
  }
  return sum.toString(36);
}

/**
 * Get list of applied migrations
 */
export async function getAppliedMigrations(
  db: D1Database
): Promise<Migration[]> {
  await ensureMigrationsTable(db);

  const result = await executeQuery<Migration>(
    db,
    `SELECT id, name, applied_at as appliedAt, checksum
     FROM schema_migrations
     WHERE success = TRUE
     ORDER BY applied_at ASC`
  );

  return result.results || [];
}

/**
 * Check if a migration has been applied
 */
export async function isMigrationApplied(
  db: D1Database,
  migrationId: string
): Promise<boolean> {
  await ensureMigrationsTable(db);

  const result = await executeQueryFirst<{ count: number }>(
    db,
    `SELECT COUNT(*) as count FROM schema_migrations
     WHERE id = ? AND success = TRUE`,
    [migrationId]
  );

  return (result?.count ?? 0) > 0;
}

/**
 * Record migration execution
 */
async function recordMigration(
  db: D1Database,
  migration: Migration,
  executionTimeMs: number,
  success: boolean = true
): Promise<void> {
  const checksum = calculateChecksum(migration.sql);

  await executeCommand(
    db,
    `INSERT INTO schema_migrations (id, name, checksum, execution_time_ms, success)
     VALUES (?, ?, ?, ?, ?)`,
    [migration.id, migration.name, checksum, executionTimeMs, success]
  );
}

/**
 * Execute a single migration
 */
async function executeMigration(
  db: D1Database,
  migration: Migration
): Promise<{ success: boolean; duration: number; error?: string }> {
  const startTime = Date.now();

  try {
    // Split SQL into individual statements
    const statements = migration.sql
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith('--'));

    // Execute each statement
    for (const statement of statements) {
      await executeCommand(db, statement);
    }

    const duration = Date.now() - startTime;

    // Record successful migration
    await recordMigration(db, migration, duration, true);

    console.log('[Migrations] Applied:', {
      id: migration.id,
      name: migration.name,
      duration: `${duration}ms`,
    });

    return { success: true, duration };
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);

    // Record failed migration
    await recordMigration(db, migration, duration, false);

    console.error('[Migrations] Failed:', {
      id: migration.id,
      name: migration.name,
      duration: `${duration}ms`,
      error: errorMessage,
    });

    return { success: false, duration, error: errorMessage };
  }
}

/**
 * Run pending migrations
 *
 * @param db D1 database instance
 * @param migrations Array of migration definitions
 * @returns Migration result with status and applied migrations
 */
export async function runMigrations(
  db: D1Database,
  migrations: Migration[]
): Promise<MigrationResult> {
  const startTime = Date.now();
  const appliedMigrations: string[] = [];

  try {
    await ensureMigrationsTable(db);

    // Get already applied migrations
    const applied = await getAppliedMigrations(db);
    const appliedIds = new Set(applied.map((m) => m.id));

    // Filter pending migrations
    const pending = migrations.filter((m) => !appliedIds.has(m.id));

    if (pending.length === 0) {
      console.log('[Migrations] No pending migrations');
      return {
        success: true,
        appliedMigrations: [],
        duration: Date.now() - startTime,
      };
    }

    console.log('[Migrations] Found pending migrations:', {
      total: migrations.length,
      applied: appliedIds.size,
      pending: pending.length,
    });

    // Execute pending migrations in order
    for (const migration of pending) {
      const result = await executeMigration(db, migration);

      if (!result.success) {
        return {
          success: false,
          appliedMigrations,
          failedMigration: migration.id,
          error: result.error,
          duration: Date.now() - startTime,
        };
      }

      appliedMigrations.push(migration.id);
    }

    const duration = Date.now() - startTime;

    console.log('[Migrations] All migrations applied successfully:', {
      applied: appliedMigrations.length,
      duration: `${duration}ms`,
    });

    return {
      success: true,
      appliedMigrations,
      duration,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    console.error('[Migrations] Migration process failed:', {
      appliedMigrations,
      error: errorMessage,
    });

    return {
      success: false,
      appliedMigrations,
      error: errorMessage,
      duration: Date.now() - startTime,
    };
  }
}

/**
 * Validate migration integrity
 * Ensures applied migrations haven't been modified
 */
export async function validateMigrations(
  db: D1Database,
  migrations: Migration[]
): Promise<{ valid: boolean; issues: string[] }> {
  const issues: string[] = [];

  try {
    const applied = await getAppliedMigrations(db);

    for (const appliedMigration of applied) {
      const current = migrations.find((m) => m.id === appliedMigration.id);

      if (!current) {
        issues.push(
          `Applied migration ${appliedMigration.id} (${appliedMigration.name}) not found in current migration list`
        );
        continue;
      }

      const currentChecksum = calculateChecksum(current.sql);

      if (currentChecksum !== appliedMigration.checksum) {
        issues.push(
          `Migration ${appliedMigration.id} (${appliedMigration.name}) has been modified since application`
        );
      }
    }

    if (issues.length > 0) {
      console.warn('[Migrations] Validation issues found:', issues);
      return { valid: false, issues };
    }

    console.log('[Migrations] Validation passed');
    return { valid: true, issues: [] };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    issues.push(`Validation error: ${errorMessage}`);
    return { valid: false, issues };
  }
}

/**
 * Get migration status summary
 */
export interface MigrationStatus {
  total: number;
  applied: number;
  pending: number;
  lastApplied?: {
    id: string;
    name: string;
    appliedAt: string;
  };
  averageExecutionTime?: number;
}

export async function getMigrationStatus(
  db: D1Database,
  migrations: Migration[]
): Promise<MigrationStatus> {
  await ensureMigrationsTable(db);

  const applied = await getAppliedMigrations(db);
  const appliedIds = new Set(applied.map((m) => m.id));
  const pending = migrations.filter((m) => !appliedIds.has(m.id));

  const lastApplied = applied.length > 0 ? applied[applied.length - 1] : undefined;

  // Calculate average execution time
  const executionTimes = await executeQuery<{ execution_time_ms: number }>(
    db,
    `SELECT execution_time_ms FROM schema_migrations WHERE success = TRUE`
  );

  const avgExecutionTime =
    executionTimes.results && executionTimes.results.length > 0
      ? executionTimes.results.reduce((sum, r) => sum + r.execution_time_ms, 0) /
        executionTimes.results.length
      : undefined;

  return {
    total: migrations.length,
    applied: applied.length,
    pending: pending.length,
    lastApplied: lastApplied
      ? {
          id: lastApplied.id,
          name: lastApplied.name,
          appliedAt: lastApplied.appliedAt || '',
        }
      : undefined,
    averageExecutionTime: avgExecutionTime,
  };
}

/**
 * Reset migrations (DANGEROUS - only for development)
 */
export async function resetMigrations(db: D1Database): Promise<void> {
  console.warn('[Migrations] RESETTING ALL MIGRATIONS - This should only be done in development!');

  try {
    await executeCommand(db, `DROP TABLE IF EXISTS schema_migrations`);
    console.log('[Migrations] Reset complete');
  } catch (error) {
    console.error('[Migrations] Reset failed:', {
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}
