import { api } from './api'
import { Race, Class, Background, RacesResponse, ClassesResponse, BackgroundsResponse } from '../types/dnd5e'

// Cache for reference data to avoid repeated API calls
interface CacheData<T> {
  data: T
  timestamp: number
}

const CACHE_DURATION = 30 * 60 * 1000 // 30 minutes
const cache = new Map<string, CacheData<any>>()

function isCacheValid(cacheItem: CacheData<any>): boolean {
  return Date.now() - cacheItem.timestamp < CACHE_DURATION
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, {
    data,
    timestamp: Date.now()
  })
}

function getCache<T>(key: string): T | null {
  const cacheItem = cache.get(key)
  if (cacheItem && isCacheValid(cacheItem)) {
    return cacheItem.data
  }
  return null
}

/**
 * Fetches all available D&D 5e races
 * Includes ability score bonuses, traits, languages, and proficiencies
 */
export async function fetchRaces(): Promise<Race[]> {
  const cacheKey = 'races'
  const cached = getCache<Race[]>(cacheKey)
  
  if (cached) {
    return cached
  }

  try {
    const response = await api.get<RacesResponse>('/races')
    const races = response.data.races
    setCache(cacheKey, races)
    return races
  } catch (error) {
    console.error('Failed to fetch races:', error)
    throw new Error('Unable to load race data. Please try again.')
  }
}

/**
 * Fetches a specific race by ID
 */
export async function fetchRaceById(raceId: string): Promise<Race | null> {
  const races = await fetchRaces()
  return races.find(race => race.id === raceId) || null
}

/**
 * Fetches all available D&D 5e classes
 * Includes features, proficiencies, equipment, and spellcasting info
 */
export async function fetchClasses(): Promise<Class[]> {
  const cacheKey = 'classes'
  const cached = getCache<Class[]>(cacheKey)
  
  if (cached) {
    return cached
  }

  try {
    const response = await api.get<ClassesResponse>('/classes')
    const classes = response.data.classes
    setCache(cacheKey, classes)
    return classes
  } catch (error) {
    console.error('Failed to fetch classes:', error)
    throw new Error('Unable to load class data. Please try again.')
  }
}

/**
 * Fetches a specific class by ID
 */
export async function fetchClassById(classId: string): Promise<Class | null> {
  const classes = await fetchClasses()
  return classes.find(cls => cls.id === classId) || null
}

/**
 * Fetches all available D&D 5e backgrounds  
 * Includes skills, tools, equipment, and personality characteristics
 */
export async function fetchBackgrounds(): Promise<Background[]> {
  const cacheKey = 'backgrounds'
  const cached = getCache<Background[]>(cacheKey)
  
  if (cached) {
    return cached
  }

  try {
    const response = await api.get<BackgroundsResponse>('/backgrounds')
    const backgrounds = response.data.backgrounds
    setCache(cacheKey, backgrounds)
    return backgrounds
  } catch (error) {
    console.error('Failed to fetch backgrounds:', error)
    throw new Error('Unable to load background data. Please try again.')
  }
}

/**
 * Fetches a specific background by ID
 */
export async function fetchBackgroundById(backgroundId: string): Promise<Background | null> {
  const backgrounds = await fetchBackgrounds()
  return backgrounds.find(bg => bg.id === backgroundId) || null
}

/**
 * Fetches all reference data at once for initial loading
 * Useful for pre-loading all data needed for character creation
 */
export async function fetchAllReferenceData(): Promise<{
  races: Race[]
  classes: Class[]
  backgrounds: Background[]
}> {
  try {
    const [races, classes, backgrounds] = await Promise.all([
      fetchRaces(),
      fetchClasses(),
      fetchBackgrounds()
    ])

    return { races, classes, backgrounds }
  } catch (error) {
    console.error('Failed to fetch reference data:', error)
    throw new Error('Unable to load character creation data. Please check your connection and try again.')
  }
}

/**
 * Clears the reference data cache
 * Useful for forcing a refresh of data
 */
export function clearReferenceDataCache(): void {
  cache.clear()
}

/**
 * Search and filter utility functions
 */

export function filterRacesByAbility(races: Race[], ability: string): Race[] {
  return races.filter(race => 
    race.ability_score_increases.some(asi => 
      asi.ability.toLowerCase() === ability.toLowerCase()
    )
  )
}

export function filterRacesBySize(races: Race[], size: string): Race[] {
  return races.filter(race => race.size.toLowerCase() === size.toLowerCase())
}

export function searchRaces(races: Race[], query: string): Race[] {
  const lowerQuery = query.toLowerCase()
  return races.filter(race =>
    race.name.toLowerCase().includes(lowerQuery) ||
    race.description.toLowerCase().includes(lowerQuery) ||
    race.traits.some(trait => 
      trait.name.toLowerCase().includes(lowerQuery) ||
      trait.description.toLowerCase().includes(lowerQuery)
    )
  )
}

export function filterClassesBySpellcasting(classes: Class[], hasSpellcasting: boolean): Class[] {
  return classes.filter(cls => hasSpellcasting ? cls.spellcasting : !cls.spellcasting)
}

export function filterClassesByComplexity(classes: Class[], complexity: 'simple' | 'moderate' | 'complex'): Class[] {
  return classes.filter(cls => cls.complexity === complexity)
}

export function searchClasses(classes: Class[], query: string): Class[] {
  const lowerQuery = query.toLowerCase()
  return classes.filter(cls =>
    cls.name.toLowerCase().includes(lowerQuery) ||
    cls.description.toLowerCase().includes(lowerQuery) ||
    cls.class_features.some(feature =>
      feature.name.toLowerCase().includes(lowerQuery) ||
      feature.description.toLowerCase().includes(lowerQuery)
    )
  )
}

export function filterBackgroundsBySkill(backgrounds: Background[], skill: string): Background[] {
  return backgrounds.filter(bg =>
    bg.skill_proficiencies.some(skillProf =>
      skillProf.toLowerCase() === skill.toLowerCase()
    )
  )
}

export function searchBackgrounds(backgrounds: Background[], query: string): Background[] {
  const lowerQuery = query.toLowerCase()
  return backgrounds.filter(bg =>
    bg.name.toLowerCase().includes(lowerQuery) ||
    bg.description.toLowerCase().includes(lowerQuery) ||
    bg.feature.name.toLowerCase().includes(lowerQuery) ||
    bg.feature.description.toLowerCase().includes(lowerQuery)
  )
}