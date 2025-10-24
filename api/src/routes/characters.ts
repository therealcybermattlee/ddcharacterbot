import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import type { Env, Character, UserSession } from '../types';
import { createAuthMiddleware } from '../middleware/security';

// Create characters router
const characters = new Hono<{ Bindings: Env }>();

// Apply authentication middleware to all routes
characters.use('*', createAuthMiddleware());

// Helper function to sanitize text input (remove HTML/script tags)
function sanitizeText(text: string): string {
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<[^>]+>/g, '') // Remove all HTML tags
    .trim();
}

// Validation schemas
const createCharacterSchema = z.object({
  name: z.string()
    .min(1, 'Character name is required')
    .max(100)
    .transform(sanitizeText),
  race: z.string()
    .min(1, 'Race is required')
    .max(50)
    .transform(sanitizeText),
  characterClass: z.string()
    .min(1, 'Class is required')
    .max(50)
    .transform(sanitizeText),
  level: z.number().int().min(1).max(20).default(1),
  experiencePoints: z.number().int().min(0).default(0),

  // Ability scores (3-20 range for D&D)
  strength: z.number().int().min(3).max(20),
  dexterity: z.number().int().min(3).max(20),
  constitution: z.number().int().min(3).max(20),
  intelligence: z.number().int().min(3).max(20),
  wisdom: z.number().int().min(3).max(20),
  charisma: z.number().int().min(3).max(20),

  // Derived stats
  armorClass: z.number().int().min(1).max(30).default(10),
  hitPointsMax: z.number().int().min(1).max(999).default(8),
  hitPointsCurrent: z.number().int().min(0).max(999).optional(),
  speed: z.number().int().min(0).max(100).default(30),

  // Optional character details (sanitized to prevent XSS)
  background: z.string()
    .max(50)
    .transform(sanitizeText)
    .optional(),
  alignment: z.string()
    .max(30)
    .transform(sanitizeText)
    .optional(),
  campaignId: z.string().uuid().optional(),
});

const updateCharacterSchema = createCharacterSchema.partial();

// Get all characters for the authenticated user
characters.get('/', async (c) => {
  try {
    const user = c.get('user') as UserSession;
    
    const characters = await c.env.DB.prepare(
      `SELECT 
        id, name, race, character_class as characterClass, level, experience_points as experiencePoints,
        strength, dexterity, constitution, intelligence, wisdom, charisma,
        armor_class as armorClass, hit_points_max as hitPointsMax, 
        hit_points_current as hitPointsCurrent, speed,
        background, alignment, campaign_id as campaignId,
        created_at as createdAt, updated_at as updatedAt
       FROM characters 
       WHERE user_id = ? 
       ORDER BY updated_at DESC`
    ).bind(user.userId).all();

    return c.json({
      success: true,
      data: {
        characters: characters.results
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get characters error:', error);
    return c.json({
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch characters'
      },
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Get a specific character by ID
characters.get('/:id', async (c) => {
  try {
    const user = c.get('user') as UserSession;
    const characterId = c.req.param('id');

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(characterId)) {
      return c.json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid character ID format'
        },
        timestamp: new Date().toISOString()
      }, 400);
    }

    const character = await c.env.DB.prepare(
      `SELECT 
        id, name, race, character_class as characterClass, level, experience_points as experiencePoints,
        strength, dexterity, constitution, intelligence, wisdom, charisma,
        armor_class as armorClass, hit_points_max as hitPointsMax, 
        hit_points_current as hitPointsCurrent, speed,
        background, alignment, campaign_id as campaignId,
        created_at as createdAt, updated_at as updatedAt
       FROM characters 
       WHERE id = ? AND user_id = ?`
    ).bind(characterId, user.userId).first();

    if (!character) {
      return c.json({
        success: false,
        error: {
          code: 'CHARACTER_NOT_FOUND',
          message: 'Character not found or access denied'
        },
        timestamp: new Date().toISOString()
      }, 404);
    }

    return c.json({
      success: true,
      data: {
        character
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get character error:', error);
    return c.json({
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch character'
      },
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Create a new character
characters.post('/', zValidator('json', createCharacterSchema), async (c) => {
  try {
    const user = c.get('user') as UserSession;
    const characterData = c.req.valid('json');

    // Generate character ID
    const characterId = crypto.randomUUID();
    const now = new Date().toISOString();

    // Set current HP to max HP if not provided
    const hitPointsCurrent = characterData.hitPointsCurrent ?? characterData.hitPointsMax;

    // Insert character into database
    await c.env.DB.prepare(
      `INSERT INTO characters (
        id, user_id, name, race, character_class, level, experience_points,
        strength, dexterity, constitution, intelligence, wisdom, charisma,
        armor_class, hit_points_max, hit_points_current, speed,
        background, alignment, campaign_id, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      characterId, user.userId, characterData.name, characterData.race, 
      characterData.characterClass, characterData.level, characterData.experiencePoints,
      characterData.strength, characterData.dexterity, characterData.constitution,
      characterData.intelligence, characterData.wisdom, characterData.charisma,
      characterData.armorClass, characterData.hitPointsMax, hitPointsCurrent,
      characterData.speed, characterData.background || null, 
      characterData.alignment || null, characterData.campaignId || null,
      now, now
    ).run();

    // Fetch the created character
    const createdCharacter = await c.env.DB.prepare(
      `SELECT 
        id, name, race, character_class as characterClass, level, experience_points as experiencePoints,
        strength, dexterity, constitution, intelligence, wisdom, charisma,
        armor_class as armorClass, hit_points_max as hitPointsMax, 
        hit_points_current as hitPointsCurrent, speed,
        background, alignment, campaign_id as campaignId,
        created_at as createdAt, updated_at as updatedAt
       FROM characters WHERE id = ?`
    ).bind(characterId).first();

    return c.json({
      success: true,
      data: {
        character: createdCharacter,
        message: 'Character created successfully'
      },
      timestamp: new Date().toISOString()
    }, 201);

  } catch (error) {
    console.error('Create character error:', error);
    return c.json({
      success: false,
      error: {
        code: 'CREATE_FAILED',
        message: 'Failed to create character'
      },
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Update an existing character
characters.put('/:id', zValidator('json', updateCharacterSchema), async (c) => {
  try {
    const user = c.get('user') as UserSession;
    const characterId = c.req.param('id');
    const updates = c.req.valid('json');

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(characterId)) {
      return c.json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid character ID format'
        },
        timestamp: new Date().toISOString()
      }, 400);
    }

    // Check if character exists and belongs to user
    const existingCharacter = await c.env.DB.prepare(
      'SELECT id FROM characters WHERE id = ? AND user_id = ?'
    ).bind(characterId, user.userId).first();

    if (!existingCharacter) {
      return c.json({
        success: false,
        error: {
          code: 'CHARACTER_NOT_FOUND',
          message: 'Character not found or access denied'
        },
        timestamp: new Date().toISOString()
      }, 404);
    }

    // Build dynamic update query with strict field whitelist
    const updateFields: string[] = [];
    const updateValues: any[] = [];

    // Whitelist of allowed fields for update - prevents SQL injection
    // Only these exact fields can be updated, no user input affects column names
    const fieldMap: { [key: string]: string } = {
      name: 'name',
      race: 'race',
      characterClass: 'character_class',
      level: 'level',
      experiencePoints: 'experience_points',
      strength: 'strength',
      dexterity: 'dexterity',
      constitution: 'constitution',
      intelligence: 'intelligence',
      wisdom: 'wisdom',
      charisma: 'charisma',
      armorClass: 'armor_class',
      hitPointsMax: 'hit_points_max',
      hitPointsCurrent: 'hit_points_current',
      speed: 'speed',
      background: 'background',
      alignment: 'alignment',
      campaignId: 'campaign_id',
    };

    // Only process fields that exist in the whitelist
    Object.entries(updates).forEach(([key, value]) => {
      if (Object.prototype.hasOwnProperty.call(fieldMap, key)) {
        updateFields.push(`${fieldMap[key]} = ?`);
        updateValues.push(value);
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
    
    // Add WHERE clause values
    updateValues.push(characterId, user.userId);

    const updateQuery = `UPDATE characters SET ${updateFields.join(', ')} WHERE id = ? AND user_id = ?`;
    
    await c.env.DB.prepare(updateQuery).bind(...updateValues).run();

    // Fetch updated character
    const updatedCharacter = await c.env.DB.prepare(
      `SELECT 
        id, name, race, character_class as characterClass, level, experience_points as experiencePoints,
        strength, dexterity, constitution, intelligence, wisdom, charisma,
        armor_class as armorClass, hit_points_max as hitPointsMax, 
        hit_points_current as hitPointsCurrent, speed,
        background, alignment, campaign_id as campaignId,
        created_at as createdAt, updated_at as updatedAt
       FROM characters WHERE id = ?`
    ).bind(characterId).first();

    return c.json({
      success: true,
      data: {
        character: updatedCharacter,
        message: 'Character updated successfully'
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Update character error:', error);
    return c.json({
      success: false,
      error: {
        code: 'UPDATE_FAILED',
        message: 'Failed to update character'
      },
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Delete a character
characters.delete('/:id', async (c) => {
  try {
    const user = c.get('user') as UserSession;
    const characterId = c.req.param('id');

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(characterId)) {
      return c.json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid character ID format'
        },
        timestamp: new Date().toISOString()
      }, 400);
    }

    // Check if character exists and belongs to user
    const existingCharacter = await c.env.DB.prepare(
      'SELECT id, name FROM characters WHERE id = ? AND user_id = ?'
    ).bind(characterId, user.userId).first();

    if (!existingCharacter) {
      return c.json({
        success: false,
        error: {
          code: 'CHARACTER_NOT_FOUND',
          message: 'Character not found or access denied'
        },
        timestamp: new Date().toISOString()
      }, 404);
    }

    // Delete character
    await c.env.DB.prepare(
      'DELETE FROM characters WHERE id = ? AND user_id = ?'
    ).bind(characterId, user.userId).run();

    return c.json({
      success: true,
      data: {
        message: `Character "${existingCharacter.name}" deleted successfully`
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Delete character error:', error);
    return c.json({
      success: false,
      error: {
        code: 'DELETE_FAILED',
        message: 'Failed to delete character'
      },
      timestamp: new Date().toISOString()
    }, 500);
  }
});

export default characters;