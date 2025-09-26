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
// Transform API race data to frontend expected format
function transformRaceData(apiRace: any): Race {
  return {
    id: apiRace.id || '',
    name: apiRace.name || '',
    description: `A ${apiRace.name} character. (Description not available)`, // Default description since backend doesn't provide it
    size: apiRace.size || 'Medium',
    speed: apiRace.speed || 30,
    ability_score_increases: apiRace.abilityScoreBonuses ?
      Object.entries(apiRace.abilityScoreBonuses).map(([ability, increase]) => ({
        ability,
        increase: increase as number
      })) : [],
    traits: Array.isArray(apiRace.traits) ? apiRace.traits.map((trait: any) => ({
      id: trait.id || trait.name?.toLowerCase().replace(/\s+/g, '-') || '',
      name: trait.name || '',
      description: trait.description || '',
      type: trait.type || 'passive'
    })) : [],
    proficiencies: Array.isArray(apiRace.proficiencies?.skills) ?
      apiRace.proficiencies.skills.map((skill: string) => ({
        type: 'skill' as const,
        name: skill,
        source: 'race'
      })) : [],
    languages: Array.isArray(apiRace.languages) ?
      apiRace.languages.map((lang: string) => ({
        name: lang,
        script: undefined
      })) : []
  }
}

export async function fetchRaces(): Promise<Race[]> {
  const cacheKey = 'races'
  const cached = getCache<Race[]>(cacheKey)

  if (cached) {
    return cached
  }

  try {
    const response = await api.get('/races')
    console.log('Races API response:', response.data)

    if (!response.data || !response.data.data || !response.data.data.races) {
      console.error('Invalid races response structure:', response.data)
      throw new Error('Invalid API response structure')
    }

    const races = response.data.data.races.map(transformRaceData)
    console.log('Parsed and transformed races:', races)
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

// Transform API class data to frontend expected format
function transformClassData(apiClass: any): Class {
  return {
    id: apiClass.id || '',
    name: apiClass.name || '',
    description: `A ${apiClass.name} adventurer. (Description not available)`, // Default description
    hit_die: typeof apiClass.hitDie === 'number' ? apiClass.hitDie : parseInt(String(apiClass.hitDie || '8').replace('d', '')),
    primary_abilities: Array.isArray(apiClass.primaryAbility) ? apiClass.primaryAbility : [],
    saving_throw_proficiencies: Array.isArray(apiClass.savingThrowProficiencies) ? apiClass.savingThrowProficiencies : [],
    skill_proficiencies: {
      choose: apiClass.skillChoices || 2,
      from: Array.isArray(apiClass.skillProficiencies) ? apiClass.skillProficiencies : []
    },
    armor_proficiencies: Array.isArray(apiClass.armorProficiencies) ? apiClass.armorProficiencies : [],
    weapon_proficiencies: Array.isArray(apiClass.weaponProficiencies) ? apiClass.weaponProficiencies : [],
    tool_proficiencies: Array.isArray(apiClass.toolProficiencies) ? apiClass.toolProficiencies : [],
    starting_equipment: Array.isArray(apiClass.startingEquipment?.items) ?
      apiClass.startingEquipment.items.map((item: string) => ({
        id: item.toLowerCase().replace(/\s+/g, '-'),
        name: item,
        type: 'equipment',
        quantity: 1
      })) : [],
    class_features: [], // Features would need separate API call - set empty for now
    spellcasting: apiClass.spellcastingAbility ? {
      ability: apiClass.spellcastingAbility,
      spells_known: undefined,
      spell_slots: undefined,
      cantrips_known: undefined,
      ritual_casting: false,
      spellcasting_focus: undefined
    } : undefined,
    complexity: 'moderate' as const, // Default complexity
    playstyle: [],
    imageUrl: undefined,
    color: undefined
  }
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
    const response = await api.get('/classes')
    console.log('Classes API response:', response.data)

    if (!response.data || !response.data.data || !response.data.data.classes) {
      console.error('Invalid classes response structure:', response.data)
      throw new Error('Invalid API response structure')
    }

    const classes = response.data.data.classes.map(transformClassData)
    console.log('Parsed and transformed classes:', classes)
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

// Transform API background data to frontend expected format
function transformBackgroundData(apiBackground: any): Background {
  return {
    id: apiBackground.id || '',
    name: apiBackground.name || '',
    description: apiBackground.description || `A character with a ${apiBackground.name} background.`,
    skill_proficiencies: Array.isArray(apiBackground.skillProficiencies) ? apiBackground.skillProficiencies : [],
    tool_proficiencies: Array.isArray(apiBackground.toolProficiencies) ? apiBackground.toolProficiencies : [],
    languages: {
      count: apiBackground.languageChoices || 0,
      specific: []
    },
    equipment: Array.isArray(apiBackground.startingEquipment?.items) ?
      apiBackground.startingEquipment.items.map((item: string) => ({
        id: item.toLowerCase().replace(/\s+/g, '-'),
        name: item,
        type: 'equipment',
        quantity: 1
      })) : [],
    feature: {
      name: apiBackground.featureName || `${apiBackground.name} Feature`,
      description: apiBackground.featureDescription || 'A special feature from your background.'
    },
    suggested_characteristics: {
      personality_traits: Array.isArray(apiBackground.suggestedCharacteristics?.personalityTraits) ?
        apiBackground.suggestedCharacteristics.personalityTraits.map((trait: string) => ({
          id: trait.toLowerCase().replace(/\s+/g, '-'),
          text: trait
        })) : [],
      ideals: Array.isArray(apiBackground.suggestedCharacteristics?.ideals) ?
        apiBackground.suggestedCharacteristics.ideals.map((ideal: string) => ({
          id: ideal.toLowerCase().replace(/\s+/g, '-'),
          text: ideal
        })) : [],
      bonds: Array.isArray(apiBackground.suggestedCharacteristics?.bonds) ?
        apiBackground.suggestedCharacteristics.bonds.map((bond: string) => ({
          id: bond.toLowerCase().replace(/\s+/g, '-'),
          text: bond
        })) : [],
      flaws: Array.isArray(apiBackground.suggestedCharacteristics?.flaws) ?
        apiBackground.suggestedCharacteristics.flaws.map((flaw: string) => ({
          id: flaw.toLowerCase().replace(/\s+/g, '-'),
          text: flaw
        })) : []
    },
    imageUrl: undefined,
    color: undefined
  }
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
    const response = await api.get('/backgrounds')
    console.log('Backgrounds API response:', response.data)

    if (!response.data || !response.data.data || !response.data.data.backgrounds) {
      console.error('Invalid backgrounds response structure:', response.data)
      throw new Error('Invalid API response structure')
    }

    const backgrounds = response.data.data.backgrounds.map(transformBackgroundData)
    console.log('Parsed and transformed backgrounds:', backgrounds)
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