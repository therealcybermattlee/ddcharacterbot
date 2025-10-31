// Health check and monitoring endpoints for D&D Character Manager API
// Provides system status, metrics, and diagnostics

import { Hono } from 'hono';
import { KVManager } from '../lib/kv-manager';
import { R2Manager } from '../lib/r2-manager';
import type { HonoEnv } from '../types';

const healthCheck = new Hono<HonoEnv>();

// Basic health check
healthCheck.get('/', async (c) => {
  const requestId = c.get('requestId');
  
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: c.env.ENVIRONMENT,
      requestId,
      uptime: Date.now(), // Would be process uptime in a traditional server
      version: '1.0.0',
    };

    return c.json(health);
  } catch (error) {
    return c.json({
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      requestId,
    }, 500);
  }
});

// Detailed health check with service dependencies
healthCheck.get('/detailed', async (c) => {
  const requestId = c.get('requestId');
  const startTime = Date.now();
  
  try {
    // Test database connection
    const dbStart = Date.now();
    let dbHealth = true;
    let dbLatency = 0;
    
    try {
      await c.env.DB.prepare('SELECT 1 as test').first();
      dbLatency = Date.now() - dbStart;
    } catch (error) {
      dbHealth = false;
      console.error('Database health check failed:', error);
    }

    // Test KV storage
    const kvManager = new KVManager(c.env.CACHE!, c.env.SESSIONS!);
    const kvHealth = await kvManager.healthCheck();

    // Test R2 storage
    const r2Manager = new R2Manager(c.env.ASSETS!, 'assets-bucket');
    const r2Start = Date.now();
    const r2Health = await r2Manager.healthCheck();
    const r2Latency = Date.now() - r2Start;

    const overallHealth = dbHealth && kvHealth.cache && kvHealth.sessions && r2Health;
    const totalLatency = Date.now() - startTime;

    const healthReport = {
      status: overallHealth ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      environment: c.env.ENVIRONMENT,
      requestId,
      latency: totalLatency,
      services: {
        database: {
          status: dbHealth ? 'healthy' : 'unhealthy',
          latency: dbLatency,
        },
        kv_cache: {
          status: kvHealth.cache ? 'healthy' : 'unhealthy',
        },
        kv_sessions: {
          status: kvHealth.sessions ? 'healthy' : 'unhealthy',
        },
        r2_storage: {
          status: r2Health ? 'healthy' : 'unhealthy',
          latency: r2Latency,
        },
      },
      system: {
        memory: {
          // Cloudflare Workers don't expose memory usage
          used: 'N/A',
          limit: '128MB',
        },
        cpu: {
          // CPU time is managed by Cloudflare
          limit: '50ms per request',
        },
      },
    };

    const statusCode = overallHealth ? 200 : 503;
    return c.json(healthReport, statusCode);
    
  } catch (error) {
    return c.json({
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      requestId,
      timestamp: new Date().toISOString(),
    }, 500);
  }
});

// Readiness check (for load balancers)
healthCheck.get('/ready', async (c) => {
  try {
    // Test critical dependencies
    await c.env.DB.prepare('SELECT 1 as test').first();
    
    return c.json({
      status: 'ready',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return c.json({
      status: 'not ready',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, 503);
  }
});

// Liveness check (for monitoring)
healthCheck.get('/alive', async (c) => {
  return c.json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    pid: 'cloudflare-worker', // Workers don't have PIDs
  });
});

// Metrics endpoint
healthCheck.get('/metrics', async (c) => {
  const requestId = c.get('requestId');
  
  try {
    // Get basic metrics from KV
    const kvManager = new KVManager(c.env.CACHE!, c.env.SESSIONS!);
    
    // Sample metrics (in a real app, these would be collected over time)
    const metrics = {
      timestamp: new Date().toISOString(),
      requestId,
      counters: {
        requests_total: await getMetricValue(kvManager, 'requests_total') || 0,
        requests_success: await getMetricValue(kvManager, 'requests_success') || 0,
        requests_error: await getMetricValue(kvManager, 'requests_error') || 0,
        users_active: await getMetricValue(kvManager, 'users_active') || 0,
        characters_created: await getMetricValue(kvManager, 'characters_created') || 0,
        campaigns_active: await getMetricValue(kvManager, 'campaigns_active') || 0,
      },
      gauges: {
        response_time_avg: await getMetricValue(kvManager, 'response_time_avg') || 0,
        database_connections: 1, // D1 handles connection pooling
        cache_hit_rate: await getMetricValue(kvManager, 'cache_hit_rate') || 0,
      },
      environment: c.env.ENVIRONMENT,
    };

    return c.json(metrics);
  } catch (error) {
    return c.json({
      error: 'Failed to retrieve metrics',
      message: error instanceof Error ? error.message : 'Unknown error',
      requestId,
    }, 500);
  }
});

// Performance metrics
healthCheck.get('/performance', async (c) => {
  const startTime = Date.now();
  
  try {
    // Database performance test
    const dbStart = Date.now();
    await c.env.DB.prepare('SELECT COUNT(*) as count FROM users').first();
    const dbTime = Date.now() - dbStart;

    // KV performance test
    const kvStart = Date.now();
    const kvManager = new KVManager(c.env.CACHE!, c.env.SESSIONS!);
    await kvManager.setCache('perf_test', { test: true }, 60);
    await kvManager.getCache('perf_test');
    const kvTime = Date.now() - kvStart;

    // R2 performance test (basic check)
    const r2Start = Date.now();
    const r2Manager = new R2Manager(c.env.ASSETS!, 'assets-bucket');
    await r2Manager.healthCheck();
    const r2Time = Date.now() - r2Start;

    const totalTime = Date.now() - startTime;

    return c.json({
      timestamp: new Date().toISOString(),
      total_time: totalTime,
      performance: {
        database: {
          latency: dbTime,
          status: dbTime < 100 ? 'good' : dbTime < 500 ? 'fair' : 'poor',
        },
        kv_storage: {
          latency: kvTime,
          status: kvTime < 50 ? 'good' : kvTime < 200 ? 'fair' : 'poor',
        },
        r2_storage: {
          latency: r2Time,
          status: r2Time < 200 ? 'good' : r2Time < 1000 ? 'fair' : 'poor',
        },
      },
      thresholds: {
        database: { good: '<100ms', fair: '<500ms' },
        kv_storage: { good: '<50ms', fair: '<200ms' },
        r2_storage: { good: '<200ms', fair: '<1000ms' },
      },
    });
  } catch (error) {
    return c.json({
      error: 'Performance test failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  }
});

// System information
healthCheck.get('/info', async (c) => {
  return c.json({
    application: {
      name: 'D&D Character Manager API',
      version: '1.0.0',
      environment: c.env.ENVIRONMENT,
      description: 'API for managing D&D characters and campaigns',
    },
    runtime: {
      platform: 'Cloudflare Workers',
      node_version: 'N/A',
      v8_version: 'N/A',
    },
    build: {
      timestamp: new Date().toISOString(),
      commit: process.env.GIT_COMMIT || 'unknown',
      branch: process.env.GIT_BRANCH || 'unknown',
    },
    features: {
      authentication: true,
      rate_limiting: true,
      caching: true,
      file_uploads: true,
      monitoring: true,
    },
  });
});

// Helper function to get metric values from KV
async function getMetricValue(kvManager: KVManager, metric: string): Promise<number | null> {
  try {
    const value = await kvManager.getCache(`metric:${metric}`);
    return typeof value === 'number' ? value : null;
  } catch {
    return null;
  }
}

export { healthCheck };