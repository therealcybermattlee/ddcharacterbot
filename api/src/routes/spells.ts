import { Hono } from 'hono';
import type { HonoEnv, Spell, CachedReferenceData } from '../types';

// Create spells router (no auth required for reference data)
const spells = new Hono<HonoEnv>();

// Cache configuration
const CACHE_TTL = 3600; // 1 hour in seconds
const CACHE_KEY_PREFIX = 'spells:';

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

// Helper function to transform database spell to API spell
function transformSpell(dbSpell: any): Spell {
  return {
    id: dbSpell.id,
    name: dbSpell.name,
    level: dbSpell.level,
    school: dbSpell.school,
    castingTime: dbSpell.casting_time,
    range: dbSpell.range,
    components: dbSpell.components,
    duration: dbSpell.duration,
    description: dbSpell.description,
    atHigherLevels: dbSpell.at_higher_levels || undefined,
    classes: JSON.parse(dbSpell.classes || '[]'),
    source: dbSpell.source,
    isHomebrew: dbSpell.is_homebrew
  };
}

// Get all spells
spells.get('/', async (c) => {
  try {
    // Try to get from cache first
    const cacheKey = `${CACHE_KEY_PREFIX}all`;
    const cached = await getCachedData<Spell[]>(c.env.KV, cacheKey);

    if (cached) {
      return c.json({
        success: true,
        data: {
          spells: cached,
          cached: true
        },
        timestamp: new Date().toISOString()
      });
    }

    // Fetch from database
    const dbSpells = await c.env.DB.prepare(
      `SELECT
        id, name, level, school, casting_time, range, components,
        duration, description, at_higher_levels, classes, source, is_homebrew
       FROM spells
       WHERE is_homebrew = FALSE
       ORDER BY level, name`
    ).all();

    // Transform the data
    const spells = dbSpells.results?.map(transformSpell) || [];

    // Cache the results
    await setCachedData(c.env.KV, cacheKey, spells);

    return c.json({
      success: true,
      data: {
        spells,
        cached: false
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get spells error:', error);
    return c.json({
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch spells'
      },
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Get spells by level
spells.get('/level/:level', async (c) => {
  try {
    const level = parseInt(c.req.param('level'));

    // Validate level (0-9 for cantrips to 9th level)
    if (isNaN(level) || level < 0 || level > 9) {
      return c.json({
        success: false,
        error: {
          code: 'INVALID_LEVEL',
          message: 'Spell level must be between 0 (cantrip) and 9'
        },
        timestamp: new Date().toISOString()
      }, 400);
    }

    // Try to get from cache first
    const cacheKey = `${CACHE_KEY_PREFIX}level:${level}`;
    const cached = await getCachedData<Spell[]>(c.env.KV, cacheKey);

    if (cached) {
      return c.json({
        success: true,
        data: {
          spells: cached,
          level,
          cached: true
        },
        timestamp: new Date().toISOString()
      });
    }

    // Fetch from database
    const dbSpells = await c.env.DB.prepare(
      `SELECT
        id, name, level, school, casting_time, range, components,
        duration, description, at_higher_levels, classes, source, is_homebrew
       FROM spells
       WHERE level = ? AND is_homebrew = FALSE
       ORDER BY name`
    ).bind(level).all();

    // Transform the data
    const spells = dbSpells.results?.map(transformSpell) || [];

    // Cache the results
    await setCachedData(c.env.KV, cacheKey, spells);

    return c.json({
      success: true,
      data: {
        spells,
        level,
        cached: false
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get spells by level error:', error);
    return c.json({
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch spells by level'
      },
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Get spells by school
spells.get('/school/:school', async (c) => {
  try {
    const school = c.req.param('school');

    // Validate school
    const validSchools = [
      'abjuration', 'conjuration', 'divination', 'enchantment',
      'evocation', 'illusion', 'necromancy', 'transmutation'
    ];
    const normalizedSchool = school.toLowerCase();

    if (!validSchools.includes(normalizedSchool)) {
      return c.json({
        success: false,
        error: {
          code: 'INVALID_SCHOOL',
          message: 'Invalid spell school. Valid schools: ' + validSchools.join(', ')
        },
        timestamp: new Date().toISOString()
      }, 400);
    }

    // Try to get from cache first
    const cacheKey = `${CACHE_KEY_PREFIX}school:${normalizedSchool}`;
    const cached = await getCachedData<Spell[]>(c.env.KV, cacheKey);

    if (cached) {
      return c.json({
        success: true,
        data: {
          spells: cached,
          school: normalizedSchool,
          cached: true
        },
        timestamp: new Date().toISOString()
      });
    }

    // Fetch from database (case-insensitive)
    const dbSpells = await c.env.DB.prepare(
      `SELECT
        id, name, level, school, casting_time, range, components,
        duration, description, at_higher_levels, classes, source, is_homebrew
       FROM spells
       WHERE LOWER(school) = ? AND is_homebrew = FALSE
       ORDER BY level, name`
    ).bind(normalizedSchool).all();

    // Transform the data
    const spells = dbSpells.results?.map(transformSpell) || [];

    // Cache the results
    await setCachedData(c.env.KV, cacheKey, spells);

    return c.json({
      success: true,
      data: {
        spells,
        school: normalizedSchool,
        cached: false
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get spells by school error:', error);
    return c.json({
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch spells by school'
      },
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Get spells by class
spells.get('/class/:className', async (c) => {
  try {
    const className = c.req.param('className').toLowerCase();

    // Validate class name
    const validClasses = [
      'bard', 'cleric', 'druid', 'paladin', 'ranger', 'sorcerer',
      'warlock', 'wizard', 'artificer'
    ];

    if (!validClasses.includes(className)) {
      return c.json({
        success: false,
        error: {
          code: 'INVALID_CLASS',
          message: 'Invalid class name. Valid classes: ' + validClasses.join(', ')
        },
        timestamp: new Date().toISOString()
      }, 400);
    }

    // Try to get from cache first
    const cacheKey = `${CACHE_KEY_PREFIX}class:${className}`;
    const cached = await getCachedData<Spell[]>(c.env.KV, cacheKey);

    if (cached) {
      return c.json({
        success: true,
        data: {
          spells: cached,
          class: className,
          cached: true
        },
        timestamp: new Date().toISOString()
      });
    }

    // Fetch from database - JSON array contains class
    const dbSpells = await c.env.DB.prepare(
      `SELECT
        id, name, level, school, casting_time, range, components,
        duration, description, at_higher_levels, classes, source, is_homebrew
       FROM spells
       WHERE classes LIKE ? AND is_homebrew = FALSE
       ORDER BY level, name`
    ).bind(`%"${className}"%`).all();

    // Transform the data
    const spells = dbSpells.results?.map(transformSpell) || [];

    // Cache the results
    await setCachedData(c.env.KV, cacheKey, spells);

    return c.json({
      success: true,
      data: {
        spells,
        class: className,
        cached: false
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get spells by class error:', error);
    return c.json({
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch spells by class'
      },
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Get a specific spell by ID
spells.get('/:id', async (c) => {
  try {
    const spellId = c.req.param('id');

    // Validate spell ID format (alphanumeric with underscores)
    if (!/^[a-z0-9_]+$/i.test(spellId)) {
      return c.json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid spell ID format'
        },
        timestamp: new Date().toISOString()
      }, 400);
    }

    // Try to get from cache first
    const cacheKey = `${CACHE_KEY_PREFIX}${spellId}`;
    const cached = await getCachedData<Spell>(c.env.KV, cacheKey);

    if (cached) {
      return c.json({
        success: true,
        data: {
          spell: cached,
          cached: true
        },
        timestamp: new Date().toISOString()
      });
    }

    // Fetch from database
    const dbSpell = await c.env.DB.prepare(
      `SELECT
        id, name, level, school, casting_time, range, components,
        duration, description, at_higher_levels, classes, source, is_homebrew
       FROM spells
       WHERE id = ? AND is_homebrew = FALSE`
    ).bind(spellId).first();

    if (!dbSpell) {
      return c.json({
        success: false,
        error: {
          code: 'SPELL_NOT_FOUND',
          message: 'Spell not found'
        },
        timestamp: new Date().toISOString()
      }, 404);
    }

    // Transform the data
    const spell = transformSpell(dbSpell);

    // Cache the result
    await setCachedData(c.env.KV, cacheKey, spell);

    return c.json({
      success: true,
      data: {
        spell,
        cached: false
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get spell error:', error);
    return c.json({
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch spell'
      },
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Clear cache endpoint (for development/admin)
spells.delete('/cache', async (c) => {
  try {
    // This would typically require admin authentication in production
    const cacheKeys = [
      `${CACHE_KEY_PREFIX}all`,
      // Level caches
      ...Array.from({ length: 10 }, (_, i) => `${CACHE_KEY_PREFIX}level:${i}`),
      // School caches
      'abjuration', 'conjuration', 'divination', 'enchantment',
      'evocation', 'illusion', 'necromancy', 'transmutation'
    ].map(key => key.startsWith(CACHE_KEY_PREFIX) ? key : `${CACHE_KEY_PREFIX}school:${key}`);

    await Promise.all(cacheKeys.map(key => c.env.KV.delete(key)));

    return c.json({
      success: true,
      data: {
        message: 'Spell cache cleared successfully'
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Clear cache error:', error);
    return c.json({
      success: false,
      error: {
        code: 'CACHE_CLEAR_FAILED',
        message: 'Failed to clear spell cache'
      },
      timestamp: new Date().toISOString()
    }, 500);
  }
});

export default spells;
