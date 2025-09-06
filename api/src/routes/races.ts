import { Hono } from 'hono';
import type { Env, Race, CachedReferenceData } from '../types';

// Create races router (no auth required for reference data)
const races = new Hono<{ Bindings: Env }>();

// Cache configuration
const CACHE_TTL = 3600; // 1 hour in seconds
const CACHE_KEY_PREFIX = 'races:';

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

// Helper function to transform database race to API race
function transformRace(dbRace: any): Race {
  return {
    id: dbRace.id,
    name: dbRace.name,
    size: dbRace.size,
    speed: dbRace.speed,
    abilityScoreBonuses: JSON.parse(dbRace.ability_score_bonuses || '{}'),
    traits: JSON.parse(dbRace.traits || '[]'),
    languages: JSON.parse(dbRace.languages || '[]'),
    proficiencies: JSON.parse(dbRace.proficiencies || '{}'),
    source: dbRace.source,
    isHomebrew: dbRace.is_homebrew
  };
}

// Get all races
races.get('/', async (c) => {
  try {
    // Try to get from cache first
    const cacheKey = `${CACHE_KEY_PREFIX}all`;
    const cached = await getCachedData<Race[]>(c.env.KV, cacheKey);
    
    if (cached) {
      return c.json({
        success: true,
        data: {
          races: cached,
          cached: true
        },
        timestamp: new Date().toISOString()
      });
    }

    // Fetch from database
    const dbRaces = await c.env.DB.prepare(
      `SELECT 
        id, name, size, speed, ability_score_bonuses, traits, 
        languages, proficiencies, source, is_homebrew
       FROM races 
       WHERE is_homebrew = FALSE 
       ORDER BY name`
    ).all();

    // Transform the data
    const races = dbRaces.results?.map(transformRace) || [];

    // Cache the results
    await setCachedData(c.env.KV, cacheKey, races);

    return c.json({
      success: true,
      data: {
        races,
        cached: false
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get races error:', error);
    return c.json({
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch races'
      },
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Get a specific race by ID
races.get('/:id', async (c) => {
  try {
    const raceId = c.req.param('id');

    // Validate race ID format (alphanumeric with hyphens)
    if (!/^[a-z0-9-]+$/i.test(raceId)) {
      return c.json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid race ID format'
        },
        timestamp: new Date().toISOString()
      }, 400);
    }

    // Try to get from cache first
    const cacheKey = `${CACHE_KEY_PREFIX}${raceId}`;
    const cached = await getCachedData<Race>(c.env.KV, cacheKey);
    
    if (cached) {
      return c.json({
        success: true,
        data: {
          race: cached,
          cached: true
        },
        timestamp: new Date().toISOString()
      });
    }

    // Fetch from database
    const dbRace = await c.env.DB.prepare(
      `SELECT 
        id, name, size, speed, ability_score_bonuses, traits, 
        languages, proficiencies, source, is_homebrew
       FROM races 
       WHERE id = ? AND is_homebrew = FALSE`
    ).bind(raceId).first();

    if (!dbRace) {
      return c.json({
        success: false,
        error: {
          code: 'RACE_NOT_FOUND',
          message: 'Race not found'
        },
        timestamp: new Date().toISOString()
      }, 404);
    }

    // Transform the data
    const race = transformRace(dbRace);

    // Cache the result
    await setCachedData(c.env.KV, cacheKey, race);

    return c.json({
      success: true,
      data: {
        race,
        cached: false
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get race error:', error);
    return c.json({
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch race'
      },
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Get races by source (PHB, homebrew, etc.)
races.get('/source/:source', async (c) => {
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
    const cached = await getCachedData<Race[]>(c.env.KV, cacheKey);
    
    if (cached) {
      return c.json({
        success: true,
        data: {
          races: cached,
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
        id, name, size, speed, ability_score_bonuses, traits, 
        languages, proficiencies, source, is_homebrew
       FROM races 
       WHERE is_homebrew = TRUE 
       ORDER BY name`;
      params = [];
    } else {
      query = `SELECT 
        id, name, size, speed, ability_score_bonuses, traits, 
        languages, proficiencies, source, is_homebrew
       FROM races 
       WHERE source = ? AND is_homebrew = FALSE 
       ORDER BY name`;
      params = [source];
    }

    const dbRaces = await c.env.DB.prepare(query).bind(...params).all();

    // Transform the data
    const races = dbRaces.results?.map(transformRace) || [];

    // Cache the results
    await setCachedData(c.env.KV, cacheKey, races);

    return c.json({
      success: true,
      data: {
        races,
        source,
        cached: false
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get races by source error:', error);
    return c.json({
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch races by source'
      },
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Clear cache endpoint (for development/admin)
races.delete('/cache', async (c) => {
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
        message: 'Race cache cleared successfully'
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Clear cache error:', error);
    return c.json({
      success: false,
      error: {
        code: 'CACHE_CLEAR_FAILED',
        message: 'Failed to clear race cache'
      },
      timestamp: new Date().toISOString()
    }, 500);
  }
});

export default races;