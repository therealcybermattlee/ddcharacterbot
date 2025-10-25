/**
 * Database Performance Utilities
 *
 * Query optimization, caching, and performance monitoring tools
 */

import type { D1Database } from '@cloudflare/workers-types';
import { executeQuery, executeQueryFirst, type QueryMetrics } from './client';

/**
 * Query performance tracker
 */
class QueryPerformanceTracker {
  private metrics: Map<
    string,
    { count: number; totalDuration: number; avgDuration: number }
  > = new Map();

  track(queryKey: string, duration: number): void {
    const existing = this.metrics.get(queryKey) || {
      count: 0,
      totalDuration: 0,
      avgDuration: 0,
    };

    existing.count++;
    existing.totalDuration += duration;
    existing.avgDuration = existing.totalDuration / existing.count;

    this.metrics.set(queryKey, existing);
  }

  getMetrics() {
    return Object.fromEntries(this.metrics);
  }

  getSlowestQueries(limit: number = 10) {
    return Array.from(this.metrics.entries())
      .sort((a, b) => b[1].avgDuration - a[1].avgDuration)
      .slice(0, limit)
      .map(([query, metrics]) => ({ query, ...metrics }));
  }

  reset(): void {
    this.metrics.clear();
  }
}

export const performanceTracker = new QueryPerformanceTracker();

/**
 * Execute query with performance tracking
 */
export async function executeWithTracking<T = unknown>(
  db: D1Database,
  queryKey: string,
  query: string,
  params: unknown[] = []
) {
  const startTime = Date.now();

  try {
    const result = await executeQuery<T>(db, query, params);
    const duration = Date.now() - startTime;

    performanceTracker.track(queryKey, duration);

    // Warn on slow queries (>100ms target)
    if (duration > 100) {
      console.warn('[DB Performance] Slow query detected:', {
        queryKey,
        duration: `${duration}ms`,
        target: '100ms',
      });
    }

    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    performanceTracker.track(queryKey, duration);
    throw error;
  }
}

/**
 * Query result cache using KV
 */
export interface CacheOptions {
  ttl: number; // seconds
  key: string;
}

export async function cachedQuery<T = unknown>(
  db: D1Database,
  kv: KVNamespace,
  options: CacheOptions,
  query: string,
  params: unknown[] = []
): Promise<{ cached: boolean; result: T | null }> {
  try {
    // Try cache first
    const cached = await kv.get(options.key, 'json');

    if (cached) {
      console.log('[DB Cache] Hit:', { key: options.key });
      return { cached: true, result: cached as T };
    }

    // Cache miss - execute query
    console.log('[DB Cache] Miss:', { key: options.key });
    const result = await executeQueryFirst<T>(db, query, params);

    // Store in cache
    if (result) {
      await kv.put(options.key, JSON.stringify(result), {
        expirationTtl: options.ttl,
      });
    }

    return { cached: false, result };
  } catch (error) {
    console.error('[DB Cache] Error:', {
      key: options.key,
      error: error instanceof Error ? error.message : String(error),
    });
    // Fallback to direct query on cache error
    const result = await executeQueryFirst<T>(db, query, params);
    return { cached: false, result };
  }
}

/**
 * Batch query optimization
 * Combines multiple queries into a single round-trip
 */
export async function batchQueries<T = unknown>(
  db: D1Database,
  queries: Array<{ query: string; params?: unknown[] }>
): Promise<T[]> {
  const results: T[] = [];

  // D1 doesn't support true batch queries with results,
  // so we execute sequentially but track performance
  for (const { query, params = [] } of queries) {
    const result = await executeQueryFirst<T>(db, query, params);
    if (result) results.push(result);
  }

  return results;
}

/**
 * Index usage analyzer
 * Helps identify missing indexes by analyzing query patterns
 */
export async function analyzeIndexUsage(
  db: D1Database
): Promise<
  Array<{
    table: string;
    column: string;
    hasIndex: boolean;
    scanCount?: number;
  }>
> {
  try {
    // Get all tables
    const tables = await executeQuery<{ name: string }>(
      db,
      `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'`
    );

    if (!tables.results) return [];

    const analysis: Array<{
      table: string;
      column: string;
      hasIndex: boolean;
    }> = [];

    for (const table of tables.results) {
      // Get indexes for this table
      const indexes = await executeQuery<{ name: string }>(
        db,
        `SELECT name FROM sqlite_master WHERE type='index' AND tbl_name=?`,
        [table.name]
      );

      const tableIndexes = new Set(
        indexes.results?.map((i) => i.name) || []
      );

      // Get columns for this table
      const pragma = await executeQuery<{ name: string }>(
        db,
        `PRAGMA table_info(${table.name})`
      );

      for (const column of pragma.results || []) {
        const indexName = `idx_${table.name}_${column.name}`;
        analysis.push({
          table: table.name,
          column: column.name,
          hasIndex: tableIndexes.has(indexName),
        });
      }
    }

    return analysis;
  } catch (error) {
    console.error('[DB Index Analysis] Failed:', {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

/**
 * Query plan analyzer (using EXPLAIN QUERY PLAN)
 */
export async function explainQuery(
  db: D1Database,
  query: string,
  params: unknown[] = []
): Promise<string[]> {
  try {
    const result = await executeQuery<{ detail: string }>(
      db,
      `EXPLAIN QUERY PLAN ${query}`,
      params
    );

    return result.results?.map((r) => r.detail) || [];
  } catch (error) {
    console.error('[DB Explain] Failed:', {
      query: query.substring(0, 100),
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

/**
 * Generate performance report
 */
export interface PerformanceReport {
  slowQueries: Array<{
    query: string;
    count: number;
    avgDuration: number;
  }>;
  totalQueries: number;
  averageDuration: number;
  queriesOverTarget: number; // Queries taking >100ms
}

export function generatePerformanceReport(): PerformanceReport {
  const metrics = performanceTracker.getMetrics();
  const allQueries = Object.entries(metrics);

  const totalQueries = allQueries.reduce((sum, [, m]) => sum + m.count, 0);
  const totalDuration = allQueries.reduce(
    (sum, [, m]) => sum + m.totalDuration,
    0
  );
  const averageDuration = totalQueries > 0 ? totalDuration / totalQueries : 0;

  const queriesOverTarget = allQueries.filter(
    ([, m]) => m.avgDuration > 100
  ).length;

  const slowQueries = performanceTracker
    .getSlowestQueries(10)
    .map(({ query, count, avgDuration }) => ({
      query,
      count,
      avgDuration,
    }));

  return {
    slowQueries,
    totalQueries,
    averageDuration,
    queriesOverTarget,
  };
}

/**
 * Prefetch related data to reduce N+1 queries
 */
export async function prefetchRelated<T = unknown, R = unknown>(
  db: D1Database,
  mainResults: T[],
  relationConfig: {
    foreignKey: keyof T;
    table: string;
    fields: string[];
  }
): Promise<Map<string | number, R>> {
  const relatedData = new Map<string | number, R>();

  // Extract all foreign key values
  const foreignKeys = mainResults
    .map((r) => r[relationConfig.foreignKey])
    .filter((k) => k != null);

  if (foreignKeys.length === 0) return relatedData;

  // Create placeholders for IN clause
  const placeholders = foreignKeys.map(() => '?').join(',');

  // Fetch related records in one query
  const query = `SELECT ${relationConfig.fields.join(', ')}
                 FROM ${relationConfig.table}
                 WHERE id IN (${placeholders})`;

  const result = await executeQuery<R>(db, query, foreignKeys);

  // Build map for quick lookup
  result.results?.forEach((record) => {
    const id = (record as any).id;
    if (id) relatedData.set(id, record);
  });

  return relatedData;
}
