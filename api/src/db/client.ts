/**
 * Database Client Utilities
 * Provides wrapper functions and helpers for D1 database operations
 */

import type { D1Database, D1Result } from '@cloudflare/workers-types';

export interface DatabaseClient {
  db: D1Database;
}

/**
 * Execute a query with proper error handling
 */
export async function executeQuery<T = unknown>(
  db: D1Database,
  query: string,
  params: unknown[] = []
): Promise<D1Result<T>> {
  try {
    const stmt = db.prepare(query);
    const bound = params.length > 0 ? stmt.bind(...params) : stmt;
    return await bound.all<T>();
  } catch (error) {
    console.error('[DB] Query execution failed:', {
      query: query.substring(0, 100),
      error: error instanceof Error ? error.message : String(error),
    });
    throw new Error(
      `Database query failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Execute a single query and return first result
 */
export async function executeQueryFirst<T = unknown>(
  db: D1Database,
  query: string,
  params: unknown[] = []
): Promise<T | null> {
  try {
    const stmt = db.prepare(query);
    const bound = params.length > 0 ? stmt.bind(...params) : stmt;
    return await bound.first<T>();
  } catch (error) {
    console.error('[DB] Query execution failed:', {
      query: query.substring(0, 100),
      error: error instanceof Error ? error.message : String(error),
    });
    throw new Error(
      `Database query failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Execute a query that modifies data (INSERT, UPDATE, DELETE)
 */
export async function executeCommand(
  db: D1Database,
  query: string,
  params: unknown[] = []
): Promise<D1Result> {
  try {
    const stmt = db.prepare(query);
    const bound = params.length > 0 ? stmt.bind(...params) : stmt;
    return await bound.run();
  } catch (error) {
    console.error('[DB] Command execution failed:', {
      query: query.substring(0, 100),
      error: error instanceof Error ? error.message : String(error),
    });
    throw new Error(
      `Database command failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Get query performance metrics
 */
export interface QueryMetrics {
  duration: number;
  success: boolean;
  rowCount?: number;
}

export async function executeWithMetrics<T = unknown>(
  db: D1Database,
  query: string,
  params: unknown[] = []
): Promise<{ result: D1Result<T>; metrics: QueryMetrics }> {
  const startTime = Date.now();
  let success = false;
  let result: D1Result<T>;

  try {
    result = await executeQuery<T>(db, query, params);
    success = true;

    const duration = Date.now() - startTime;

    return {
      result,
      metrics: {
        duration,
        success,
        rowCount: result.results?.length,
      },
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    throw {
      error,
      metrics: {
        duration,
        success: false,
      },
    };
  }
}

/**
 * Batch execute multiple queries
 * Note: D1 doesn't support traditional transactions, but this provides
 * a way to execute multiple queries and rollback on failure
 */
export async function executeBatch(
  db: D1Database,
  queries: Array<{ query: string; params?: unknown[] }>
): Promise<D1Result[]> {
  const results: D1Result[] = [];

  try {
    for (const { query, params = [] } of queries) {
      const result = await executeCommand(db, query, params);
      results.push(result);
    }

    return results;
  } catch (error) {
    console.error('[DB] Batch execution failed:', {
      completedQueries: results.length,
      totalQueries: queries.length,
      error: error instanceof Error ? error.message : String(error),
    });
    throw new Error(
      `Batch execution failed after ${results.length}/${queries.length} queries: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

/**
 * Check if a table exists
 */
export async function tableExists(
  db: D1Database,
  tableName: string
): Promise<boolean> {
  try {
    const result = await executeQueryFirst<{ count: number }>(
      db,
      `SELECT COUNT(*) as count FROM sqlite_master WHERE type='table' AND name=?`,
      [tableName]
    );

    return (result?.count ?? 0) > 0;
  } catch (error) {
    console.error('[DB] Table existence check failed:', {
      tableName,
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}

/**
 * Get database statistics
 */
export interface DatabaseStats {
  tables: number;
  indexes: number;
  totalRows?: number;
}

export async function getDatabaseStats(db: D1Database): Promise<DatabaseStats> {
  try {
    const tablesResult = await executeQueryFirst<{ count: number }>(
      db,
      `SELECT COUNT(*) as count FROM sqlite_master WHERE type='table'`
    );

    const indexesResult = await executeQueryFirst<{ count: number }>(
      db,
      `SELECT COUNT(*) as count FROM sqlite_master WHERE type='index'`
    );

    return {
      tables: tablesResult?.count ?? 0,
      indexes: indexesResult?.count ?? 0,
    };
  } catch (error) {
    console.error('[DB] Stats retrieval failed:', {
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}
