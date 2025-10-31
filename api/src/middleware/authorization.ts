/**
 * Role-Based Authorization Middleware
 *
 * Provides fine-grained access control based on user roles:
 * - dm: Dungeon Master (full access to campaigns they own)
 * - player: Player (access to own characters and joined campaigns)
 * - observer: Read-only access to public campaigns
 */

import { Context, Next } from 'hono';
import type { HonoEnv, UserSession } from '../types';

export type Role = 'dm' | 'player' | 'observer';

/**
 * Require specific roles to access an endpoint
 *
 * @param allowedRoles - Array of roles that can access this endpoint
 * @returns Middleware function
 *
 * @example
 * router.post('/campaigns', requireRole(['dm']), async (c) => {
 *   // Only DMs can create campaigns
 * });
 *
 * @example
 * router.get('/campaigns/:id', requireRole(['dm', 'player', 'observer']), async (c) => {
 *   // All authenticated users can view campaigns
 * });
 */
export function requireRole(allowedRoles: Role[]) {
  return async (c: Context<HonoEnv>, next: Next) => {
    const user = c.get('user') as UserSession | undefined;

    if (!user) {
      return c.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
          timestamp: new Date().toISOString(),
        },
        401
      );
    }

    if (!allowedRoles.includes(user.role as Role)) {
      console.warn('[Authorization] Role denied:', {
        userId: user.userId,
        userRole: user.role,
        allowedRoles,
      });

      return c.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: `Access denied. Required role: ${allowedRoles.join(' or ')}`,
            details: {
              userRole: user.role,
              requiredRoles: allowedRoles,
            },
          },
          timestamp: new Date().toISOString(),
        },
        403
      );
    }

    await next();
  };
}

/**
 * Require DM role (shorthand)
 */
export function requireDM() {
  return requireRole(['dm']);
}

/**
 * Require Player or DM role
 */
export function requirePlayerOrDM() {
  return requireRole(['player', 'dm']);
}

/**
 * Allow any authenticated user (all roles)
 */
export function requireAuthenticated() {
  return requireRole(['dm', 'player', 'observer']);
}

/**
 * Resource-based authorization
 * Checks if user owns a resource or has appropriate role
 *
 * @example
 * router.put('/characters/:id', requireResourceOwnership('characters', 'user_id'), async (c) => {
 *   // Only the character owner can update it
 * });
 */
export function requireResourceOwnership(
  tableName: string,
  ownerColumn: string = 'user_id'
) {
  return async (c: Context<HonoEnv>, next: Next) => {
    const user = c.get('user') as UserSession | undefined;
    const resourceId = c.req.param('id');

    if (!user) {
      return c.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
          timestamp: new Date().toISOString(),
        },
        401
      );
    }

    if (!resourceId) {
      return c.json(
        {
          success: false,
          error: {
            code: 'BAD_REQUEST',
            message: 'Resource ID required',
          },
          timestamp: new Date().toISOString(),
        },
        400
      );
    }

    try {
      // Check resource ownership
      const resource = await c.env.DB.prepare(
        `SELECT ${ownerColumn} FROM ${tableName} WHERE id = ?`
      )
        .bind(resourceId)
        .first<{ [key: string]: string }>();

      if (!resource) {
        return c.json(
          {
            success: false,
            error: {
              code: 'NOT_FOUND',
              message: 'Resource not found',
            },
            timestamp: new Date().toISOString(),
          },
          404
        );
      }

      const ownerId = resource[ownerColumn];

      // DMs can manage their own resources, players can manage theirs
      if (ownerId !== user.userId && user.role !== 'dm') {
        return c.json(
          {
            success: false,
            error: {
              code: 'FORBIDDEN',
              message: 'You do not have permission to access this resource',
            },
            timestamp: new Date().toISOString(),
          },
          403
        );
      }

      await next();
    } catch (error) {
      console.error('[Authorization] Resource ownership check failed:', error);
      return c.json(
        {
          success: false,
          error: {
            code: 'AUTHORIZATION_ERROR',
            message: 'Failed to verify resource ownership',
          },
          timestamp: new Date().toISOString(),
        },
        500
      );
    }
  };
}

/**
 * Campaign-specific authorization
 * Checks if user is a member of the campaign
 */
export function requireCampaignMembership() {
  return async (c: Context<HonoEnv>, next: Next) => {
    const user = c.get('user') as UserSession | undefined;
    const campaignId = c.req.param('id') || c.req.param('campaignId');

    if (!user) {
      return c.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
          timestamp: new Date().toISOString(),
        },
        401
      );
    }

    if (!campaignId) {
      return c.json(
        {
          success: false,
          error: {
            code: 'BAD_REQUEST',
            message: 'Campaign ID required',
          },
          timestamp: new Date().toISOString(),
        },
        400
      );
    }

    try {
      // Check if user is campaign DM
      const campaign = await c.env.DB.prepare(
        'SELECT dm_user_id FROM campaigns WHERE id = ?'
      )
        .bind(campaignId)
        .first<{ dm_user_id: string }>();

      if (!campaign) {
        return c.json(
          {
            success: false,
            error: {
              code: 'NOT_FOUND',
              message: 'Campaign not found',
            },
            timestamp: new Date().toISOString(),
          },
          404
        );
      }

      // DM has full access
      if (campaign.dm_user_id === user.userId) {
        c.set('isCampaignDM', true);
        await next();
        return;
      }

      // Check if user is a campaign member
      const membership = await c.env.DB.prepare(
        'SELECT role FROM campaign_members WHERE campaign_id = ? AND user_id = ?'
      )
        .bind(campaignId, user.userId)
        .first<{ role: string }>();

      if (!membership) {
        return c.json(
          {
            success: false,
            error: {
              code: 'FORBIDDEN',
              message: 'You are not a member of this campaign',
            },
            timestamp: new Date().toISOString(),
          },
          403
        );
      }

      c.set('campaignRole', membership.role as 'dm' | 'player' | 'observer');
      c.set('isCampaignDM', false);

      await next();
    } catch (error) {
      console.error('[Authorization] Campaign membership check failed:', error);
      return c.json(
        {
          success: false,
          error: {
            code: 'AUTHORIZATION_ERROR',
            message: 'Failed to verify campaign membership',
          },
          timestamp: new Date().toISOString(),
        },
        500
      );
    }
  };
}

/**
 * Read-only authorization for observers
 * Blocks write operations (POST, PUT, PATCH, DELETE) for observer role
 */
export function allowReadOnlyForObservers() {
  return async (c: Context<HonoEnv>, next: Next) => {
    const user = c.get('user') as UserSession | undefined;
    const method = c.req.method;

    if (!user) {
      return c.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
          timestamp: new Date().toISOString(),
        },
        401
      );
    }

    // Block write operations for observers
    const writeMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
    if (user.role === 'observer' && writeMethods.includes(method)) {
      return c.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Observers have read-only access',
          },
          timestamp: new Date().toISOString(),
        },
        403
      );
    }

    await next();
  };
}
