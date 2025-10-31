import { Hono } from 'hono';
import type { HonoEnv, Background, CachedReferenceData } from '../types';

// Create backgrounds router (no auth required for reference data)
const backgrounds = new Hono<HonoEnv>();

// Cache configuration
const CACHE_TTL = 3600; // 1 hour in seconds
const CACHE_KEY_PREFIX = 'backgrounds:';

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

// Helper function to transform database background to API background
function transformBackground(dbBackground: any): Background {
  // Parse equipment and transform to expected format
  const rawEquipment = JSON.parse(dbBackground.equipment || '{"items": [], "money": "0 gp"}');
  const gpAmount = typeof rawEquipment.money === 'string'
    ? parseInt(rawEquipment.money.replace(/\D/g, '')) || 0
    : (rawEquipment.gp || 0);

  return {
    id: dbBackground.id,
    name: dbBackground.name,
    description: `${dbBackground.feature_name}: ${dbBackground.feature_description}`,
    skillProficiencies: JSON.parse(dbBackground.skill_proficiencies || '[]'),
    languageChoices: 0, // Will be derived from language_proficiencies
    toolProficiencies: JSON.parse(dbBackground.tool_proficiencies || '[]'),
    startingEquipment: {
      items: rawEquipment.items || [],
      gp: gpAmount
    },
    featureName: dbBackground.feature_name,
    featureDescription: dbBackground.feature_description,
    suggestedCharacteristics: {
      personalityTraits: JSON.parse(dbBackground.personality_traits || '[]'),
      ideals: JSON.parse(dbBackground.ideals || '[]'),
      bonds: JSON.parse(dbBackground.bonds || '[]'),
      flaws: JSON.parse(dbBackground.flaws || '[]')
    },
    source: dbBackground.source,
    isHomebrew: dbBackground.is_homebrew
  };
}

// Get all backgrounds
backgrounds.get('/', async (c) => {
  try {
    // Try to get from cache first
    const cacheKey = `${CACHE_KEY_PREFIX}all`;
    const cached = await getCachedData<Background[]>(c.env.KV, cacheKey);
    
    if (cached) {
      return c.json({
        success: true,
        data: {
          backgrounds: cached,
          cached: true
        },
        timestamp: new Date().toISOString()
      });
    }

    // Fetch from database
    const dbBackgrounds = await c.env.DB.prepare(
      `SELECT
        id, name, skill_proficiencies, language_proficiencies,
        tool_proficiencies, equipment, feature_name,
        feature_description, personality_traits, ideals, bonds, flaws, source, is_homebrew
       FROM backgrounds
       WHERE is_homebrew = FALSE
       ORDER BY name`
    ).all();

    // Transform the data
    const backgrounds = dbBackgrounds.results?.map(transformBackground) || [];

    // Cache the results
    await setCachedData(c.env.KV, cacheKey, backgrounds);

    return c.json({
      success: true,
      data: {
        backgrounds,
        cached: false
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get backgrounds error:', error);
    return c.json({
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch backgrounds'
      },
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Get a specific background by ID
backgrounds.get('/:id', async (c) => {
  try {
    const backgroundId = c.req.param('id');

    // Validate background ID format (alphanumeric with hyphens)
    if (!/^[a-z0-9-]+$/i.test(backgroundId)) {
      return c.json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid background ID format'
        },
        timestamp: new Date().toISOString()
      }, 400);
    }

    // Try to get from cache first
    const cacheKey = `${CACHE_KEY_PREFIX}${backgroundId}`;
    const cached = await getCachedData<Background>(c.env.KV, cacheKey);
    
    if (cached) {
      return c.json({
        success: true,
        data: {
          background: cached,
          cached: true
        },
        timestamp: new Date().toISOString()
      });
    }

    // Fetch from database
    const dbBackground = await c.env.DB.prepare(
      `SELECT
        id, name, skill_proficiencies, language_proficiencies,
        tool_proficiencies, equipment, feature_name,
        feature_description, personality_traits, ideals, bonds, flaws, source, is_homebrew
       FROM backgrounds
       WHERE id = ? AND is_homebrew = FALSE`
    ).bind(backgroundId).first();

    if (!dbBackground) {
      return c.json({
        success: false,
        error: {
          code: 'BACKGROUND_NOT_FOUND',
          message: 'Background not found'
        },
        timestamp: new Date().toISOString()
      }, 404);
    }

    // Transform the data
    const background = transformBackground(dbBackground);

    // Cache the result
    await setCachedData(c.env.KV, cacheKey, background);

    return c.json({
      success: true,
      data: {
        background,
        cached: false
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get background error:', error);
    return c.json({
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch background'
      },
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Get backgrounds by source (PHB, homebrew, etc.)
backgrounds.get('/source/:source', async (c) => {
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
    const cached = await getCachedData<Background[]>(c.env.KV, cacheKey);
    
    if (cached) {
      return c.json({
        success: true,
        data: {
          backgrounds: cached,
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
        id, name, skill_proficiencies, language_proficiencies,
        tool_proficiencies, equipment, feature_name,
        feature_description, personality_traits, ideals, bonds, flaws, source, is_homebrew
       FROM backgrounds
       WHERE is_homebrew = TRUE
       ORDER BY name`;
      params = [];
    } else {
      query = `SELECT
        id, name, skill_proficiencies, language_proficiencies,
        tool_proficiencies, equipment, feature_name,
        feature_description, personality_traits, ideals, bonds, flaws, source, is_homebrew
       FROM backgrounds
       WHERE source = ? AND is_homebrew = FALSE
       ORDER BY name`;
      params = [source];
    }

    const dbBackgrounds = await c.env.DB.prepare(query).bind(...params).all();

    // Transform the data
    const backgrounds = dbBackgrounds.results?.map(transformBackground) || [];

    // Cache the results
    await setCachedData(c.env.KV, cacheKey, backgrounds);

    return c.json({
      success: true,
      data: {
        backgrounds,
        source,
        cached: false
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get backgrounds by source error:', error);
    return c.json({
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch backgrounds by source'
      },
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Get background proficiency options (for character creation)
backgrounds.get('/:id/proficiencies', async (c) => {
  try {
    const backgroundId = c.req.param('id');

    // Validate background ID format
    if (!/^[a-z0-9-]+$/i.test(backgroundId)) {
      return c.json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid background ID format'
        },
        timestamp: new Date().toISOString()
      }, 400);
    }

    // Try to get from cache first
    const cacheKey = `${CACHE_KEY_PREFIX}${backgroundId}:proficiencies`;
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
    const dbBackground = await c.env.DB.prepare(
      `SELECT
        skill_proficiencies, language_proficiencies, tool_proficiencies, equipment
       FROM backgrounds
       WHERE id = ? AND is_homebrew = FALSE`
    ).bind(backgroundId).first();

    if (!dbBackground) {
      return c.json({
        success: false,
        error: {
          code: 'BACKGROUND_NOT_FOUND',
          message: 'Background not found'
        },
        timestamp: new Date().toISOString()
      }, 404);
    }

    // Transform the proficiency data
    const proficiencies = {
      skills: JSON.parse((dbBackground.skill_proficiencies as string) || '[]'),
      languages: JSON.parse((dbBackground.language_proficiencies as string) || '[]'),
      tools: JSON.parse((dbBackground.tool_proficiencies as string) || '[]'),
      startingEquipment: JSON.parse((dbBackground.equipment as string) || '{"items": [], "gp": 0}')
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
    console.error('Get background proficiencies error:', error);
    return c.json({
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch background proficiencies'
      },
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Get background characteristics (for character creation inspiration)
backgrounds.get('/:id/characteristics', async (c) => {
  try {
    const backgroundId = c.req.param('id');

    // Validate background ID format
    if (!/^[a-z0-9-]+$/i.test(backgroundId)) {
      return c.json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid background ID format'
        },
        timestamp: new Date().toISOString()
      }, 400);
    }

    // Try to get from cache first
    const cacheKey = `${CACHE_KEY_PREFIX}${backgroundId}:characteristics`;
    const cached = await getCachedData<any>(c.env.KV, cacheKey);
    
    if (cached) {
      return c.json({
        success: true,
        data: {
          characteristics: cached,
          cached: true
        },
        timestamp: new Date().toISOString()
      });
    }

    // Fetch from database
    const dbBackground = await c.env.DB.prepare(
      `SELECT personality_traits, ideals, bonds, flaws, feature_name, feature_description
       FROM backgrounds
       WHERE id = ? AND is_homebrew = FALSE`
    ).bind(backgroundId).first();

    if (!dbBackground) {
      return c.json({
        success: false,
        error: {
          code: 'BACKGROUND_NOT_FOUND',
          message: 'Background not found'
        },
        timestamp: new Date().toISOString()
      }, 404);
    }

    // Transform the characteristics data
    const characteristics = {
      personalityTraits: JSON.parse((dbBackground.personality_traits as string) || '[]'),
      ideals: JSON.parse((dbBackground.ideals as string) || '[]'),
      bonds: JSON.parse((dbBackground.bonds as string) || '[]'),
      flaws: JSON.parse((dbBackground.flaws as string) || '[]'),
      feature: {
        name: dbBackground.feature_name,
        description: dbBackground.feature_description
      }
    };

    // Cache the result
    await setCachedData(c.env.KV, cacheKey, characteristics);

    return c.json({
      success: true,
      data: {
        characteristics,
        cached: false
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get background characteristics error:', error);
    return c.json({
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch background characteristics'
      },
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Clear cache endpoint (for development/admin)
backgrounds.delete('/cache', async (c) => {
  try {
    // This would typically require admin authentication in production
    // For now, we'll just clear the main cache keys
    const cacheKeys = [
      `${CACHE_KEY_PREFIX}all`,
      `${CACHE_KEY_PREFIX}source:phb`,
      `${CACHE_KEY_PREFIX}source:homebrew`
    ];

    await Promise.all(cacheKeys.map(key => c.env.KV.delete(key)));

    return c.json({
      success: true,
      data: {
        message: 'Background cache cleared successfully'
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Clear cache error:', error);
    return c.json({
      success: false,
      error: {
        code: 'CACHE_CLEAR_FAILED',
        message: 'Failed to clear background cache'
      },
      timestamp: new Date().toISOString()
    }, 500);
  }
});

export default backgrounds;