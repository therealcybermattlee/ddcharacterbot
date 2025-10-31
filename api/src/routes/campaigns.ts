import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import type { HonoEnv, Campaign, UserSession } from '../types';
import { createAuthMiddleware } from '../middleware/security';

// Create campaigns router
const campaigns = new Hono<HonoEnv>();

// Apply authentication middleware to all routes
campaigns.use('*', createAuthMiddleware());

// Helper function to sanitize text input (remove HTML/script tags)
function sanitizeText(text: string): string {
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<[^>]+>/g, '') // Remove all HTML tags
    .trim();
}

// Validation schemas
const createCampaignSchema = z.object({
  name: z.string()
    .min(1, 'Campaign name is required')
    .max(100)
    .transform(sanitizeText),
  description: z.string()
    .max(2000)
    .transform(sanitizeText)
    .optional(),
  isPublic: z.boolean().default(false),
  settings: z.record(z.any()).optional(), // JSON settings object
});

const updateCampaignSchema = createCampaignSchema.partial();

const addMemberSchema = z.object({
  userId: z.string().uuid('Invalid user ID format'),
  role: z.enum(['player', 'observer']).default('player'),
});

const updateMemberSchema = z.object({
  role: z.enum(['player', 'observer']),
});

const addCharacterSchema = z.object({
  characterId: z.string().uuid('Invalid character ID format'),
});

// Get all campaigns (user's own + campaigns they're a member of)
campaigns.get('/', async (c) => {
  try {
    const user = c.get('user') as UserSession;

    // Get campaigns where user is DM
    const ownedCampaigns = await c.env.DB.prepare(
      `SELECT
        id, name, description, dm_user_id as dmUserId, is_public as isPublic,
        settings, created_at as createdAt, updated_at as updatedAt,
        'dm' as userRole
       FROM campaigns
       WHERE dm_user_id = ?
       ORDER BY updated_at DESC`
    ).bind(user.userId).all();

    // Get campaigns where user is a member
    const memberCampaigns = await c.env.DB.prepare(
      `SELECT
        c.id, c.name, c.description, c.dm_user_id as dmUserId, c.is_public as isPublic,
        c.settings, c.created_at as createdAt, c.updated_at as updatedAt,
        cm.role as userRole
       FROM campaigns c
       INNER JOIN campaign_members cm ON c.id = cm.campaign_id
       WHERE cm.user_id = ?
       ORDER BY c.updated_at DESC`
    ).bind(user.userId).all();

    // Combine and deduplicate
    const allCampaigns = [...ownedCampaigns.results, ...memberCampaigns.results];

    return c.json({
      success: true,
      data: {
        campaigns: allCampaigns
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get campaigns error:', error);
    return c.json({
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch campaigns'
      },
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Get public campaigns (discovery)
campaigns.get('/public', async (c) => {
  try {
    const publicCampaigns = await c.env.DB.prepare(
      `SELECT
        id, name, description, dm_user_id as dmUserId, is_public as isPublic,
        created_at as createdAt, updated_at as updatedAt
       FROM campaigns
       WHERE is_public = TRUE
       ORDER BY updated_at DESC
       LIMIT 50`
    ).all();

    return c.json({
      success: true,
      data: {
        campaigns: publicCampaigns.results
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get public campaigns error:', error);
    return c.json({
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch public campaigns'
      },
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Get a specific campaign by ID
campaigns.get('/:id', async (c) => {
  try {
    const user = c.get('user') as UserSession;
    const campaignId = c.req.param('id');

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(campaignId)) {
      return c.json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid campaign ID format'
        },
        timestamp: new Date().toISOString()
      }, 400);
    }

    const campaign = await c.env.DB.prepare(
      `SELECT
        id, name, description, dm_user_id as dmUserId, is_public as isPublic,
        settings, created_at as createdAt, updated_at as updatedAt
       FROM campaigns
       WHERE id = ?`
    ).bind(campaignId).first();

    if (!campaign) {
      return c.json({
        success: false,
        error: {
          code: 'CAMPAIGN_NOT_FOUND',
          message: 'Campaign not found'
        },
        timestamp: new Date().toISOString()
      }, 404);
    }

    // Check access: DM, member, or public campaign
    const isDM = campaign.dmUserId === user.userId;
    const isPublic = campaign.isPublic === true || campaign.isPublic === 1;

    if (!isDM && !isPublic) {
      // Check if user is a member
      const membership = await c.env.DB.prepare(
        'SELECT role FROM campaign_members WHERE campaign_id = ? AND user_id = ?'
      ).bind(campaignId, user.userId).first();

      if (!membership) {
        return c.json({
          success: false,
          error: {
            code: 'CAMPAIGN_ACCESS_DENIED',
            message: 'Access denied to this campaign'
          },
          timestamp: new Date().toISOString()
        }, 403);
      }

      // Add member role to response
      (campaign as any).userRole = membership.role;
    } else if (isDM) {
      (campaign as any).userRole = 'dm';
    }

    return c.json({
      success: true,
      data: {
        campaign
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get campaign error:', error);
    return c.json({
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch campaign'
      },
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Create a new campaign
campaigns.post('/', zValidator('json', createCampaignSchema), async (c) => {
  try {
    const user = c.get('user') as UserSession;
    const campaignData = c.req.valid('json');

    // Only DMs can create campaigns
    if (user.role !== 'dm') {
      return c.json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Only Dungeon Masters can create campaigns'
        },
        timestamp: new Date().toISOString()
      }, 403);
    }

    // Generate campaign ID
    const campaignId = crypto.randomUUID();
    const now = new Date().toISOString();

    // Convert settings to JSON string if provided
    const settingsJson = campaignData.settings ? JSON.stringify(campaignData.settings) : null;

    // Insert campaign into database
    await c.env.DB.prepare(
      `INSERT INTO campaigns (
        id, name, description, dm_user_id, is_public, settings, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      campaignId,
      campaignData.name,
      campaignData.description || null,
      user.userId,
      campaignData.isPublic ? 1 : 0,
      settingsJson,
      now,
      now
    ).run();

    // Fetch the created campaign
    const createdCampaign = await c.env.DB.prepare(
      `SELECT
        id, name, description, dm_user_id as dmUserId, is_public as isPublic,
        settings, created_at as createdAt, updated_at as updatedAt
       FROM campaigns WHERE id = ?`
    ).bind(campaignId).first();

    return c.json({
      success: true,
      data: {
        campaign: createdCampaign,
        message: 'Campaign created successfully'
      },
      timestamp: new Date().toISOString()
    }, 201);

  } catch (error) {
    console.error('Create campaign error:', error);
    return c.json({
      success: false,
      error: {
        code: 'CREATE_FAILED',
        message: 'Failed to create campaign'
      },
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Update an existing campaign
campaigns.put('/:id', zValidator('json', updateCampaignSchema), async (c) => {
  try {
    const user = c.get('user') as UserSession;
    const campaignId = c.req.param('id');
    const updates = c.req.valid('json');

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(campaignId)) {
      return c.json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid campaign ID format'
        },
        timestamp: new Date().toISOString()
      }, 400);
    }

    // Check if campaign exists and user is DM
    const existingCampaign = await c.env.DB.prepare(
      'SELECT id, dm_user_id as dmUserId FROM campaigns WHERE id = ?'
    ).bind(campaignId).first();

    if (!existingCampaign) {
      return c.json({
        success: false,
        error: {
          code: 'CAMPAIGN_NOT_FOUND',
          message: 'Campaign not found'
        },
        timestamp: new Date().toISOString()
      }, 404);
    }

    // Only DM can update campaign
    if (existingCampaign.dmUserId !== user.userId) {
      return c.json({
        success: false,
        error: {
          code: 'CAMPAIGN_ACCESS_DENIED',
          message: 'Only the campaign DM can update this campaign'
        },
        timestamp: new Date().toISOString()
      }, 403);
    }

    // Build dynamic update query with strict field whitelist
    const updateFields: string[] = [];
    const updateValues: any[] = [];

    const fieldMap: { [key: string]: string } = {
      name: 'name',
      description: 'description',
      isPublic: 'is_public',
      settings: 'settings',
    };

    Object.entries(updates).forEach(([key, value]) => {
      if (Object.prototype.hasOwnProperty.call(fieldMap, key)) {
        updateFields.push(`${fieldMap[key]} = ?`);

        // Handle boolean conversion for isPublic
        if (key === 'isPublic') {
          updateValues.push(value ? 1 : 0);
        }
        // Handle JSON stringification for settings
        else if (key === 'settings' && value !== null) {
          updateValues.push(JSON.stringify(value));
        }
        else {
          updateValues.push(value);
        }
      }
    });

    if (updateFields.length === 0) {
      return c.json({
        success: false,
        error: {
          code: 'NO_UPDATES',
          message: 'No valid fields to update'
        },
        timestamp: new Date().toISOString()
      }, 400);
    }

    // Add updated_at timestamp
    updateFields.push('updated_at = ?');
    updateValues.push(new Date().toISOString());

    // Add WHERE clause value
    updateValues.push(campaignId);

    const updateQuery = `UPDATE campaigns SET ${updateFields.join(', ')} WHERE id = ?`;

    await c.env.DB.prepare(updateQuery).bind(...updateValues).run();

    // Fetch updated campaign
    const updatedCampaign = await c.env.DB.prepare(
      `SELECT
        id, name, description, dm_user_id as dmUserId, is_public as isPublic,
        settings, created_at as createdAt, updated_at as updatedAt
       FROM campaigns WHERE id = ?`
    ).bind(campaignId).first();

    return c.json({
      success: true,
      data: {
        campaign: updatedCampaign,
        message: 'Campaign updated successfully'
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Update campaign error:', error);
    return c.json({
      success: false,
      error: {
        code: 'UPDATE_FAILED',
        message: 'Failed to update campaign'
      },
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Delete a campaign
campaigns.delete('/:id', async (c) => {
  try {
    const user = c.get('user') as UserSession;
    const campaignId = c.req.param('id');

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(campaignId)) {
      return c.json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid campaign ID format'
        },
        timestamp: new Date().toISOString()
      }, 400);
    }

    // Check if campaign exists and user is DM
    const existingCampaign = await c.env.DB.prepare(
      'SELECT id, name, dm_user_id as dmUserId FROM campaigns WHERE id = ?'
    ).bind(campaignId).first();

    if (!existingCampaign) {
      return c.json({
        success: false,
        error: {
          code: 'CAMPAIGN_NOT_FOUND',
          message: 'Campaign not found'
        },
        timestamp: new Date().toISOString()
      }, 404);
    }

    // Only DM can delete campaign
    if (existingCampaign.dmUserId !== user.userId) {
      return c.json({
        success: false,
        error: {
          code: 'CAMPAIGN_ACCESS_DENIED',
          message: 'Only the campaign DM can delete this campaign'
        },
        timestamp: new Date().toISOString()
      }, 403);
    }

    // Delete campaign (cascade will delete members and character associations)
    await c.env.DB.prepare(
      'DELETE FROM campaigns WHERE id = ?'
    ).bind(campaignId).run();

    return c.json({
      success: true,
      data: {
        message: `Campaign "${existingCampaign.name}" deleted successfully`
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Delete campaign error:', error);
    return c.json({
      success: false,
      error: {
        code: 'DELETE_FAILED',
        message: 'Failed to delete campaign'
      },
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Get campaign members
campaigns.get('/:id/members', async (c) => {
  try {
    const user = c.get('user') as UserSession;
    const campaignId = c.req.param('id');

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(campaignId)) {
      return c.json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid campaign ID format'
        },
        timestamp: new Date().toISOString()
      }, 400);
    }

    // Check if campaign exists
    const campaign = await c.env.DB.prepare(
      'SELECT id, dm_user_id as dmUserId, is_public as isPublic FROM campaigns WHERE id = ?'
    ).bind(campaignId).first();

    if (!campaign) {
      return c.json({
        success: false,
        error: {
          code: 'CAMPAIGN_NOT_FOUND',
          message: 'Campaign not found'
        },
        timestamp: new Date().toISOString()
      }, 404);
    }

    // Check access
    const isDM = campaign.dmUserId === user.userId;
    const isPublic = campaign.isPublic === true || campaign.isPublic === 1;
    const isMember = await c.env.DB.prepare(
      'SELECT role FROM campaign_members WHERE campaign_id = ? AND user_id = ?'
    ).bind(campaignId, user.userId).first();

    if (!isDM && !isPublic && !isMember) {
      return c.json({
        success: false,
        error: {
          code: 'CAMPAIGN_ACCESS_DENIED',
          message: 'Access denied to this campaign'
        },
        timestamp: new Date().toISOString()
      }, 403);
    }

    // Get campaign members
    const members = await c.env.DB.prepare(
      `SELECT
        cm.user_id as userId,
        cm.role,
        cm.joined_at as joinedAt,
        u.username,
        u.email
       FROM campaign_members cm
       INNER JOIN users u ON cm.user_id = u.id
       WHERE cm.campaign_id = ?
       ORDER BY cm.joined_at ASC`
    ).bind(campaignId).all();

    // Get DM info
    const dm = await c.env.DB.prepare(
      'SELECT id as userId, username, email FROM users WHERE id = ?'
    ).bind(campaign.dmUserId).first();

    return c.json({
      success: true,
      data: {
        dm: dm ? { ...dm, role: 'dm' } : null,
        members: members.results
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get campaign members error:', error);
    return c.json({
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch campaign members'
      },
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Add a member to campaign
campaigns.post('/:id/members', zValidator('json', addMemberSchema), async (c) => {
  try {
    const user = c.get('user') as UserSession;
    const campaignId = c.req.param('id');
    const { userId: newUserId, role } = c.req.valid('json');

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(campaignId)) {
      return c.json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid campaign ID format'
        },
        timestamp: new Date().toISOString()
      }, 400);
    }

    // Check if campaign exists and user is DM
    const campaign = await c.env.DB.prepare(
      'SELECT id, name, dm_user_id as dmUserId FROM campaigns WHERE id = ?'
    ).bind(campaignId).first();

    if (!campaign) {
      return c.json({
        success: false,
        error: {
          code: 'CAMPAIGN_NOT_FOUND',
          message: 'Campaign not found'
        },
        timestamp: new Date().toISOString()
      }, 404);
    }

    // Only DM can add members
    if (campaign.dmUserId !== user.userId) {
      return c.json({
        success: false,
        error: {
          code: 'CAMPAIGN_ACCESS_DENIED',
          message: 'Only the campaign DM can add members'
        },
        timestamp: new Date().toISOString()
      }, 403);
    }

    // Check if user exists
    const targetUser = await c.env.DB.prepare(
      'SELECT id, username FROM users WHERE id = ?'
    ).bind(newUserId).first();

    if (!targetUser) {
      return c.json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        },
        timestamp: new Date().toISOString()
      }, 404);
    }

    // Check if already a member
    const existingMember = await c.env.DB.prepare(
      'SELECT user_id FROM campaign_members WHERE campaign_id = ? AND user_id = ?'
    ).bind(campaignId, newUserId).first();

    if (existingMember) {
      return c.json({
        success: false,
        error: {
          code: 'ALREADY_MEMBER',
          message: 'User is already a member of this campaign'
        },
        timestamp: new Date().toISOString()
      }, 400);
    }

    // Add member
    await c.env.DB.prepare(
      `INSERT INTO campaign_members (campaign_id, user_id, role, joined_at)
       VALUES (?, ?, ?, ?)`
    ).bind(campaignId, newUserId, role, new Date().toISOString()).run();

    return c.json({
      success: true,
      data: {
        message: `${targetUser.username} added to campaign as ${role}`
      },
      timestamp: new Date().toISOString()
    }, 201);

  } catch (error) {
    console.error('Add campaign member error:', error);
    return c.json({
      success: false,
      error: {
        code: 'ADD_MEMBER_FAILED',
        message: 'Failed to add campaign member'
      },
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Update member role
campaigns.put('/:id/members/:userId', zValidator('json', updateMemberSchema), async (c) => {
  try {
    const user = c.get('user') as UserSession;
    const campaignId = c.req.param('id');
    const targetUserId = c.req.param('userId');
    const { role } = c.req.valid('json');

    // Validate UUID formats
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(campaignId) || !uuidRegex.test(targetUserId)) {
      return c.json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid campaign or user ID format'
        },
        timestamp: new Date().toISOString()
      }, 400);
    }

    // Check if campaign exists and user is DM
    const campaign = await c.env.DB.prepare(
      'SELECT id, dm_user_id as dmUserId FROM campaigns WHERE id = ?'
    ).bind(campaignId).first();

    if (!campaign) {
      return c.json({
        success: false,
        error: {
          code: 'CAMPAIGN_NOT_FOUND',
          message: 'Campaign not found'
        },
        timestamp: new Date().toISOString()
      }, 404);
    }

    // Only DM can update member roles
    if (campaign.dmUserId !== user.userId) {
      return c.json({
        success: false,
        error: {
          code: 'CAMPAIGN_ACCESS_DENIED',
          message: 'Only the campaign DM can update member roles'
        },
        timestamp: new Date().toISOString()
      }, 403);
    }

    // Check if member exists
    const member = await c.env.DB.prepare(
      'SELECT user_id FROM campaign_members WHERE campaign_id = ? AND user_id = ?'
    ).bind(campaignId, targetUserId).first();

    if (!member) {
      return c.json({
        success: false,
        error: {
          code: 'MEMBER_NOT_FOUND',
          message: 'Member not found in this campaign'
        },
        timestamp: new Date().toISOString()
      }, 404);
    }

    // Update member role
    await c.env.DB.prepare(
      'UPDATE campaign_members SET role = ? WHERE campaign_id = ? AND user_id = ?'
    ).bind(role, campaignId, targetUserId).run();

    return c.json({
      success: true,
      data: {
        message: `Member role updated to ${role}`
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Update member role error:', error);
    return c.json({
      success: false,
      error: {
        code: 'UPDATE_MEMBER_FAILED',
        message: 'Failed to update member role'
      },
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Remove member from campaign
campaigns.delete('/:id/members/:userId', async (c) => {
  try {
    const user = c.get('user') as UserSession;
    const campaignId = c.req.param('id');
    const targetUserId = c.req.param('userId');

    // Validate UUID formats
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(campaignId) || !uuidRegex.test(targetUserId)) {
      return c.json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid campaign or user ID format'
        },
        timestamp: new Date().toISOString()
      }, 400);
    }

    // Check if campaign exists
    const campaign = await c.env.DB.prepare(
      'SELECT id, dm_user_id as dmUserId FROM campaigns WHERE id = ?'
    ).bind(campaignId).first();

    if (!campaign) {
      return c.json({
        success: false,
        error: {
          code: 'CAMPAIGN_NOT_FOUND',
          message: 'Campaign not found'
        },
        timestamp: new Date().toISOString()
      }, 404);
    }

    const isDM = campaign.dmUserId === user.userId;
    const isSelf = targetUserId === user.userId;

    // Either DM can remove anyone, or user can remove themselves
    if (!isDM && !isSelf) {
      return c.json({
        success: false,
        error: {
          code: 'CAMPAIGN_ACCESS_DENIED',
          message: 'Only the campaign DM or the member themselves can remove membership'
        },
        timestamp: new Date().toISOString()
      }, 403);
    }

    // Check if member exists
    const member = await c.env.DB.prepare(
      'SELECT user_id FROM campaign_members WHERE campaign_id = ? AND user_id = ?'
    ).bind(campaignId, targetUserId).first();

    if (!member) {
      return c.json({
        success: false,
        error: {
          code: 'MEMBER_NOT_FOUND',
          message: 'Member not found in this campaign'
        },
        timestamp: new Date().toISOString()
      }, 404);
    }

    // Remove member and their characters from campaign
    await c.env.DB.batch([
      c.env.DB.prepare(
        'DELETE FROM campaign_members WHERE campaign_id = ? AND user_id = ?'
      ).bind(campaignId, targetUserId),
      c.env.DB.prepare(
        'UPDATE characters SET campaign_id = NULL WHERE campaign_id = ? AND user_id = ?'
      ).bind(campaignId, targetUserId)
    ]);

    return c.json({
      success: true,
      data: {
        message: isSelf ? 'You have left the campaign' : 'Member removed from campaign'
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Remove campaign member error:', error);
    return c.json({
      success: false,
      error: {
        code: 'REMOVE_MEMBER_FAILED',
        message: 'Failed to remove campaign member'
      },
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Get campaign characters
campaigns.get('/:id/characters', async (c) => {
  try {
    const user = c.get('user') as UserSession;
    const campaignId = c.req.param('id');

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(campaignId)) {
      return c.json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid campaign ID format'
        },
        timestamp: new Date().toISOString()
      }, 400);
    }

    // Check if campaign exists
    const campaign = await c.env.DB.prepare(
      'SELECT id, dm_user_id as dmUserId, is_public as isPublic FROM campaigns WHERE id = ?'
    ).bind(campaignId).first();

    if (!campaign) {
      return c.json({
        success: false,
        error: {
          code: 'CAMPAIGN_NOT_FOUND',
          message: 'Campaign not found'
        },
        timestamp: new Date().toISOString()
      }, 404);
    }

    // Check access
    const isDM = campaign.dmUserId === user.userId;
    const isPublic = campaign.isPublic === true || campaign.isPublic === 1;
    const isMember = await c.env.DB.prepare(
      'SELECT role FROM campaign_members WHERE campaign_id = ? AND user_id = ?'
    ).bind(campaignId, user.userId).first();

    if (!isDM && !isPublic && !isMember) {
      return c.json({
        success: false,
        error: {
          code: 'CAMPAIGN_ACCESS_DENIED',
          message: 'Access denied to this campaign'
        },
        timestamp: new Date().toISOString()
      }, 403);
    }

    // Get campaign characters
    const characters = await c.env.DB.prepare(
      `SELECT
        c.id, c.name, c.race, c.character_class as characterClass, c.level,
        c.user_id as userId, u.username as playerName
       FROM characters c
       INNER JOIN users u ON c.user_id = u.id
       WHERE c.campaign_id = ?
       ORDER BY c.name ASC`
    ).bind(campaignId).all();

    return c.json({
      success: true,
      data: {
        characters: characters.results
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get campaign characters error:', error);
    return c.json({
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch campaign characters'
      },
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Add character to campaign
campaigns.post('/:id/characters', zValidator('json', addCharacterSchema), async (c) => {
  try {
    const user = c.get('user') as UserSession;
    const campaignId = c.req.param('id');
    const { characterId } = c.req.valid('json');

    // Validate UUID formats
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(campaignId) || !uuidRegex.test(characterId)) {
      return c.json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid campaign or character ID format'
        },
        timestamp: new Date().toISOString()
      }, 400);
    }

    // Check if campaign exists
    const campaign = await c.env.DB.prepare(
      'SELECT id, dm_user_id as dmUserId FROM campaigns WHERE id = ?'
    ).bind(campaignId).first();

    if (!campaign) {
      return c.json({
        success: false,
        error: {
          code: 'CAMPAIGN_NOT_FOUND',
          message: 'Campaign not found'
        },
        timestamp: new Date().toISOString()
      }, 404);
    }

    // Check if character exists and belongs to user
    const character = await c.env.DB.prepare(
      'SELECT id, name, user_id as userId, campaign_id as campaignId FROM characters WHERE id = ?'
    ).bind(characterId).first();

    if (!character) {
      return c.json({
        success: false,
        error: {
          code: 'CHARACTER_NOT_FOUND',
          message: 'Character not found'
        },
        timestamp: new Date().toISOString()
      }, 404);
    }

    if (character.userId !== user.userId) {
      return c.json({
        success: false,
        error: {
          code: 'CHARACTER_ACCESS_DENIED',
          message: 'You can only add your own characters to campaigns'
        },
        timestamp: new Date().toISOString()
      }, 403);
    }

    // Check if user is a member of the campaign
    const isDM = campaign.dmUserId === user.userId;
    const isMember = await c.env.DB.prepare(
      'SELECT role FROM campaign_members WHERE campaign_id = ? AND user_id = ?'
    ).bind(campaignId, user.userId).first();

    if (!isDM && !isMember) {
      return c.json({
        success: false,
        error: {
          code: 'CAMPAIGN_ACCESS_DENIED',
          message: 'You must be a member of this campaign to add characters'
        },
        timestamp: new Date().toISOString()
      }, 403);
    }

    // Check if character is already in another campaign
    if (character.campaignId && character.campaignId !== campaignId) {
      return c.json({
        success: false,
        error: {
          code: 'CHARACTER_IN_CAMPAIGN',
          message: 'Character is already in another campaign'
        },
        timestamp: new Date().toISOString()
      }, 400);
    }

    // Add character to campaign
    await c.env.DB.prepare(
      'UPDATE characters SET campaign_id = ?, updated_at = ? WHERE id = ?'
    ).bind(campaignId, new Date().toISOString(), characterId).run();

    return c.json({
      success: true,
      data: {
        message: `Character "${character.name}" added to campaign`
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Add character to campaign error:', error);
    return c.json({
      success: false,
      error: {
        code: 'ADD_CHARACTER_FAILED',
        message: 'Failed to add character to campaign'
      },
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Remove character from campaign
campaigns.delete('/:id/characters/:characterId', async (c) => {
  try {
    const user = c.get('user') as UserSession;
    const campaignId = c.req.param('id');
    const characterId = c.req.param('characterId');

    // Validate UUID formats
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(campaignId) || !uuidRegex.test(characterId)) {
      return c.json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid campaign or character ID format'
        },
        timestamp: new Date().toISOString()
      }, 400);
    }

    // Check if campaign exists
    const campaign = await c.env.DB.prepare(
      'SELECT id, dm_user_id as dmUserId FROM campaigns WHERE id = ?'
    ).bind(campaignId).first();

    if (!campaign) {
      return c.json({
        success: false,
        error: {
          code: 'CAMPAIGN_NOT_FOUND',
          message: 'Campaign not found'
        },
        timestamp: new Date().toISOString()
      }, 404);
    }

    // Check if character exists
    const character = await c.env.DB.prepare(
      'SELECT id, name, user_id as userId, campaign_id as campaignId FROM characters WHERE id = ?'
    ).bind(characterId).first();

    if (!character) {
      return c.json({
        success: false,
        error: {
          code: 'CHARACTER_NOT_FOUND',
          message: 'Character not found'
        },
        timestamp: new Date().toISOString()
      }, 404);
    }

    // Either character owner or campaign DM can remove
    const isDM = campaign.dmUserId === user.userId;
    const isOwner = character.userId === user.userId;

    if (!isDM && !isOwner) {
      return c.json({
        success: false,
        error: {
          code: 'CHARACTER_ACCESS_DENIED',
          message: 'Only the character owner or campaign DM can remove this character'
        },
        timestamp: new Date().toISOString()
      }, 403);
    }

    // Check if character is in this campaign
    if (character.campaignId !== campaignId) {
      return c.json({
        success: false,
        error: {
          code: 'CHARACTER_NOT_IN_CAMPAIGN',
          message: 'Character is not in this campaign'
        },
        timestamp: new Date().toISOString()
      }, 400);
    }

    // Remove character from campaign
    await c.env.DB.prepare(
      'UPDATE characters SET campaign_id = NULL, updated_at = ? WHERE id = ?'
    ).bind(new Date().toISOString(), characterId).run();

    return c.json({
      success: true,
      data: {
        message: `Character "${character.name}" removed from campaign`
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Remove character from campaign error:', error);
    return c.json({
      success: false,
      error: {
        code: 'REMOVE_CHARACTER_FAILED',
        message: 'Failed to remove character from campaign'
      },
      timestamp: new Date().toISOString()
    }, 500);
  }
});

export default campaigns;

