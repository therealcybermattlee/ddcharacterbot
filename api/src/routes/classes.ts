import { Hono } from 'hono';
import type { Env, CharacterClass, CachedReferenceData } from '../types';
import { getClassFeatures } from '../lib/classFeatures';
import { getSubclasses } from '../lib/subclasses';

// Create classes router (no auth required for reference data)
const classes = new Hono<{ Bindings: Env }>();

// Cache configuration
const CACHE_TTL = 3600; // 1 hour in seconds
const CACHE_KEY_PREFIX = 'classes:';

// Helper function to get cached data
async function getCachedData<T>(
  kv: KVNamespace,
  key: string,
  ttl: number = CACHE_TTL
): Promise<T | null> {
  try {
    const cached = await kv.get(key);
    if (!cached) return null;

    const data: CachedReferenceData<T> = JSON.parse(cached);
    const now = Date.now();
    
    // Check if cache is still valid
    if (now - data.timestamp > data.ttl * 1000) {
      await kv.delete(key);
      return null;
    }
    
    return data.data;
  } catch (error) {
    console.error('Cache read error:', error);
    return null;
  }
}

// Helper function to set cached data
async function setCachedData<T>(
  kv: KVNamespace,
  key: string,
  data: T,
  ttl: number = CACHE_TTL
): Promise<void> {
  try {
    const cacheData: CachedReferenceData<T> = {
      data,
      timestamp: Date.now(),
      ttl
    };
    
    await kv.put(key, JSON.stringify(cacheData), { expirationTtl: ttl });
  } catch (error) {
    console.error('Cache write error:', error);
  }
}

// Helper function to transform database class to API class
function transformClass(dbClass: any): CharacterClass {
  const className = dbClass.name;
  const features = getClassFeatures(className, 20); // Get all features up to level 20
  const subclasses = getSubclasses(className); // Get all subclasses for this class

  return {
    id: dbClass.id,
    name: className,
    hitDie: dbClass.hit_die,
    primaryAbility: JSON.parse(dbClass.primary_ability || '[]'),
    savingThrowProficiencies: JSON.parse(dbClass.saving_throw_proficiencies || '[]'),
    skillProficiencies: JSON.parse(dbClass.skill_proficiencies || '[]'),
    skillChoices: dbClass.skill_choices || 0,
    armorProficiencies: JSON.parse(dbClass.armor_proficiencies || '[]'),
    weaponProficiencies: JSON.parse(dbClass.weapon_proficiencies || '[]'),
    toolProficiencies: JSON.parse(dbClass.tool_proficiencies || '[]'),
    startingEquipment: JSON.parse(dbClass.starting_equipment || '{}'),
    spellcastingAbility: dbClass.spellcasting_ability || undefined,
    source: dbClass.source,
    isHomebrew: dbClass.is_homebrew,
    features: features,
    subclasses: subclasses
  };
}

// Get all classes
classes.get('/', async (c) => {
  try {
    // Try to get from cache first
    const cacheKey = `${CACHE_KEY_PREFIX}all`;
    const cached = await getCachedData<CharacterClass[]>(c.env.KV, cacheKey);
    
    if (cached) {
      return c.json({
        success: true,
        data: {
          classes: cached,
          cached: true
        },
        timestamp: new Date().toISOString()
      });
    }

    // Fetch from database
    const dbClasses = await c.env.DB.prepare(
      `SELECT 
        id, name, hit_die, primary_ability, saving_throw_proficiencies, 
        skill_proficiencies, skill_choices, armor_proficiencies, 
        weapon_proficiencies, tool_proficiencies, starting_equipment, 
        spellcasting_ability, source, is_homebrew
       FROM classes 
       WHERE is_homebrew = FALSE 
       ORDER BY name`
    ).all();

    // Transform the data
    const classes = dbClasses.results?.map(transformClass) || [];

    // Cache the results
    await setCachedData(c.env.KV, cacheKey, classes);

    return c.json({
      success: true,
      data: {
        classes,
        cached: false
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get classes error:', error);
    return c.json({
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch classes'
      },
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Get spellcasting classes only
classes.get('/spellcasters', async (c) => {
  try {
    // Try to get from cache first
    const cacheKey = `${CACHE_KEY_PREFIX}spellcasters`;
    const cached = await getCachedData<CharacterClass[]>(c.env.KV, cacheKey);
    
    if (cached) {
      return c.json({
        success: true,
        data: {
          classes: cached,
          cached: true
        },
        timestamp: new Date().toISOString()
      });
    }

    // Fetch from database
    const dbClasses = await c.env.DB.prepare(
      `SELECT 
        id, name, hit_die, primary_ability, saving_throw_proficiencies, 
        skill_proficiencies, skill_choices, armor_proficiencies, 
        weapon_proficiencies, tool_proficiencies, starting_equipment, 
        spellcasting_ability, source, is_homebrew
       FROM classes 
       WHERE spellcasting_ability IS NOT NULL AND is_homebrew = FALSE 
       ORDER BY name`
    ).all();

    // Transform the data
    const classes = dbClasses.results?.map(transformClass) || [];

    // Cache the results
    await setCachedData(c.env.KV, cacheKey, classes);

    return c.json({
      success: true,
      data: {
        classes,
        cached: false
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get spellcasting classes error:', error);
    return c.json({
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch spellcasting classes'
      },
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Get a specific class by ID
classes.get('/:id', async (c) => {
  try {
    const classId = c.req.param('id');

    // Validate class ID format (alphanumeric with hyphens)
    if (!/^[a-z0-9-]+$/i.test(classId)) {
      return c.json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid class ID format'
        },
        timestamp: new Date().toISOString()
      }, 400);
    }

    // Try to get from cache first
    const cacheKey = `${CACHE_KEY_PREFIX}${classId}`;
    const cached = await getCachedData<CharacterClass>(c.env.KV, cacheKey);
    
    if (cached) {
      return c.json({
        success: true,
        data: {
          class: cached,
          cached: true
        },
        timestamp: new Date().toISOString()
      });
    }

    // Fetch from database
    const dbClass = await c.env.DB.prepare(
      `SELECT 
        id, name, hit_die, primary_ability, saving_throw_proficiencies, 
        skill_proficiencies, skill_choices, armor_proficiencies, 
        weapon_proficiencies, tool_proficiencies, starting_equipment, 
        spellcasting_ability, source, is_homebrew
       FROM classes 
       WHERE id = ? AND is_homebrew = FALSE`
    ).bind(classId).first();

    if (!dbClass) {
      return c.json({
        success: false,
        error: {
          code: 'CLASS_NOT_FOUND',
          message: 'Class not found'
        },
        timestamp: new Date().toISOString()
      }, 404);
    }

    // Transform the data
    const characterClass = transformClass(dbClass);

    // Cache the result
    await setCachedData(c.env.KV, cacheKey, characterClass);

    return c.json({
      success: true,
      data: {
        class: characterClass,
        cached: false
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get class error:', error);
    return c.json({
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch class'
      },
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Get classes by source (PHB, homebrew, etc.)
classes.get('/source/:source', async (c) => {
  try {
    const source = c.req.param('source').toLowerCase();

    // Validate source
    const validSources = ['phb', 'dmg', 'mm', 'vgtm', 'xgte', 'homebrew'];
    if (!validSources.includes(source)) {
      return c.json({
        success: false,
        error: {
          code: 'INVALID_SOURCE',
          message: 'Invalid source. Valid sources: ' + validSources.join(', ')
        },
        timestamp: new Date().toISOString()
      }, 400);
    }

    // Try to get from cache first
    const cacheKey = `${CACHE_KEY_PREFIX}source:${source}`;
    const cached = await getCachedData<CharacterClass[]>(c.env.KV, cacheKey);
    
    if (cached) {
      return c.json({
        success: true,
        data: {
          classes: cached,
          source,
          cached: true
        },
        timestamp: new Date().toISOString()
      });
    }

    // Fetch from database
    let query: string;
    let params: any[];

    if (source === 'homebrew') {
      query = `SELECT 
        id, name, hit_die, primary_ability, saving_throw_proficiencies, 
        skill_proficiencies, skill_choices, armor_proficiencies, 
        weapon_proficiencies, tool_proficiencies, starting_equipment, 
        spellcasting_ability, source, is_homebrew
       FROM classes 
       WHERE is_homebrew = TRUE 
       ORDER BY name`;
      params = [];
    } else {
      query = `SELECT 
        id, name, hit_die, primary_ability, saving_throw_proficiencies, 
        skill_proficiencies, skill_choices, armor_proficiencies, 
        weapon_proficiencies, tool_proficiencies, starting_equipment, 
        spellcasting_ability, source, is_homebrew
       FROM classes 
       WHERE source = ? AND is_homebrew = FALSE 
       ORDER BY name`;
      params = [source];
    }

    const dbClasses = await c.env.DB.prepare(query).bind(...params).all();

    // Transform the data
    const classes = dbClasses.results?.map(transformClass) || [];

    // Cache the results
    await setCachedData(c.env.KV, cacheKey, classes);

    return c.json({
      success: true,
      data: {
        classes,
        source,
        cached: false
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get classes by source error:', error);
    return c.json({
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch classes by source'
      },
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Get class proficiency options (for character creation)
classes.get('/:id/proficiencies', async (c) => {
  try {
    const classId = c.req.param('id');

    // Validate class ID format
    if (!/^[a-z0-9-]+$/i.test(classId)) {
      return c.json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid class ID format'
        },
        timestamp: new Date().toISOString()
      }, 400);
    }

    // Try to get from cache first
    const cacheKey = `${CACHE_KEY_PREFIX}${classId}:proficiencies`;
    const cached = await getCachedData<any>(c.env.KV, cacheKey);
    
    if (cached) {
      return c.json({
        success: true,
        data: {
          proficiencies: cached,
          cached: true
        },
        timestamp: new Date().toISOString()
      });
    }

    // Fetch from database
    const dbClass = await c.env.DB.prepare(
      `SELECT 
        skill_proficiencies, skill_choices, armor_proficiencies, 
        weapon_proficiencies, tool_proficiencies, saving_throw_proficiencies
       FROM classes 
       WHERE id = ? AND is_homebrew = FALSE`
    ).bind(classId).first();

    if (!dbClass) {
      return c.json({
        success: false,
        error: {
          code: 'CLASS_NOT_FOUND',
          message: 'Class not found'
        },
        timestamp: new Date().toISOString()
      }, 404);
    }

    // Transform the proficiency data
    const proficiencies = {
      skills: {
        available: JSON.parse(dbClass.skill_proficiencies || '[]'),
        choices: dbClass.skill_choices || 0
      },
      armor: JSON.parse(dbClass.armor_proficiencies || '[]'),
      weapons: JSON.parse(dbClass.weapon_proficiencies || '[]'),
      tools: JSON.parse(dbClass.tool_proficiencies || '[]'),
      savingThrows: JSON.parse(dbClass.saving_throw_proficiencies || '[]')
    };

    // Cache the result
    await setCachedData(c.env.KV, cacheKey, proficiencies);

    return c.json({
      success: true,
      data: {
        proficiencies,
        cached: false
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get class proficiencies error:', error);
    return c.json({
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch class proficiencies'
      },
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Clear cache endpoint (for development/admin)
classes.delete('/cache', async (c) => {
  try {
    // This would typically require admin authentication in production
    // For now, we'll just clear the main cache keys
    const cacheKeys = [
      `${CACHE_KEY_PREFIX}all`,
      `${CACHE_KEY_PREFIX}spellcasters`,
      `${CACHE_KEY_PREFIX}source:phb`,
      `${CACHE_KEY_PREFIX}source:homebrew`
    ];

    await Promise.all(cacheKeys.map(key => c.env.KV.delete(key)));

    return c.json({
      success: true,
      data: {
        message: 'Class cache cleared successfully'
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Clear cache error:', error);
    return c.json({
      success: false,
      error: {
        code: 'CACHE_CLEAR_FAILED',
        message: 'Failed to clear class cache'
      },
      timestamp: new Date().toISOString()
    }, 500);
  }
});

export default classes;