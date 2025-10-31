import { Hono } from 'hono';
import { logger } from 'hono/logger';
import type { Env as AppEnv, HonoEnv } from './types';
import {
  createCORSMiddleware,
  createRateLimitMiddleware,
  createSecurityHeadersMiddleware,
  createErrorHandlerMiddleware,
} from './middleware/security';

// Import routes
import auth from './routes/auth';
import characters from './routes/characters';
import campaigns from './routes/campaigns';
import races from './routes/races';
import classes from './routes/classes';
import backgrounds from './routes/backgrounds';
import spells from './routes/spells';

// Create Hono app with Cloudflare bindings and context variables
const app = new Hono<HonoEnv>();

// Global error handling
app.use('*', createErrorHandlerMiddleware());

// Security headers
app.use('*', createSecurityHeadersMiddleware());

// Logger middleware (development only)
app.use('*', (c, next) => {
  if (c.env.ENVIRONMENT === 'development') {
    return logger()(c, next);
  }
  return next();
});

// CORS middleware
app.use('*', (c, next) => {
  const corsMiddleware = createCORSMiddleware(c.env.CORS_ORIGIN);
  return corsMiddleware(c, next);
});

// Rate limiting middleware
app.use('/api/*', (c, next) => {
  const requestsPerWindow = parseInt(c.env.RATE_LIMIT_REQUESTS) || 100;
  const windowSeconds = parseInt(c.env.RATE_LIMIT_WINDOW) || 60;
  const rateLimitMiddleware = createRateLimitMiddleware(requestsPerWindow, windowSeconds);
  return rateLimitMiddleware(c, next);
});

// Health check endpoint
app.get('/health', async (c) => {
  const startTime = Date.now();
  
  try {
    // Test database connection
    const dbTest = await c.env.DB.prepare('SELECT 1 as test').first();
    const dbLatency = Date.now() - startTime;
    
    // Test KV storage
    const kvStart = Date.now();
    await c.env.KV.put('health_check', 'ok', { expirationTtl: 60 });
    const kvResult = await c.env.KV.get('health_check');
    const kvLatency = Date.now() - kvStart;
    
    return c.json({
      success: true,
      data: {
        status: 'healthy',
        environment: c.env.ENVIRONMENT,
        timestamp: new Date().toISOString(),
        services: {
          database: {
            status: dbTest?.test === 1 ? 'healthy' : 'unhealthy',
            latency: `${dbLatency}ms`
          },
          kv: {
            status: kvResult === 'ok' ? 'healthy' : 'unhealthy',
            latency: `${kvLatency}ms`
          }
        },
        version: '1.0.0'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return c.json({
      success: false,
      data: {
        status: 'unhealthy',
        environment: c.env.ENVIRONMENT,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Mount API routes
app.route('/api/auth', auth);
app.route('/api/characters', characters);
app.route('/api/campaigns', campaigns);
app.route('/api/races', races);
app.route('/api/classes', classes);
app.route('/api/backgrounds', backgrounds);
app.route('/api/spells', spells);

// API status endpoint
app.get('/api/v1/status', (c) => {
  return c.json({
    success: true,
    data: {
      message: 'D&D Character Manager API',
      version: '1.0.0',
      environment: c.env.ENVIRONMENT
    },
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.notFound((c) => {
  return c.json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Endpoint not found'
    },
    timestamp: new Date().toISOString()
  }, 404);
});

// Export for Cloudflare Workers
export default {
  fetch: app.fetch,
};