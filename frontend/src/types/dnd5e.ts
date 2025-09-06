// D&D 5e Reference Data Types
// Based on the backend API endpoints for races, classes, and backgrounds

export interface AbilityScoreIncrease {
  ability: string
  increase: number
}

export interface Trait {
  id: string
  name: string
  description: string
  type?: 'passive' | 'active' | 'reaction' | 'bonus'
}

export interface Language {
  name: string
  script?: string
}

export interface Proficiency {
  type: 'skill' | 'tool' | 'instrument' | 'armor' | 'weapon' | 'saving_throw'
  name: string
  source?: string
}

export interface Race {
  id: string
  name: string
  description: string
  size: 'Tiny' | 'Small' | 'Medium' | 'Large' | 'Huge' | 'Gargantuan'
  speed: number
  ability_score_increases: AbilityScoreIncrease[]
  traits: Trait[]
  proficiencies: Proficiency[]
  languages: Language[]
  age?: {
    maturity: number
    lifespan: number
  }
  // UI-specific properties
  imageUrl?: string
  color?: string
}

export interface Equipment {
  id: string
  name: string
  type: string
  description?: string
  quantity: number
  weight?: number
  value?: number
}

export interface ClassFeature {
  id: string
  name: string
  description: string
  level: number
  type?: 'passive' | 'active' | 'reaction' | 'bonus'
}

export interface SpellcastingInfo {
  ability: string
  spells_known?: number
  spell_slots?: Record<number, number>
  cantrips_known?: number
  ritual_casting?: boolean
  spellcasting_focus?: string
}

export interface Class {
  id: string
  name: string
  description: string
  hit_die: number
  primary_abilities: string[]
  saving_throw_proficiencies: string[]
  skill_proficiencies: {
    choose: number
    from: string[]
  }
  armor_proficiencies: string[]
  weapon_proficiencies: string[]
  tool_proficiencies?: string[]
  starting_equipment: Equipment[]
  class_features: ClassFeature[]
  spellcasting?: SpellcastingInfo
  // UI-specific properties
  imageUrl?: string
  color?: string
  playstyle?: string[]
  complexity?: 'simple' | 'moderate' | 'complex'
}

export interface PersonalityTrait {
  id: string
  text: string
}

export interface Background {
  id: string
  name: string
  description: string
  skill_proficiencies: string[]
  tool_proficiencies?: string[]
  languages?: {
    count: number
    specific?: string[]
  }
  equipment: Equipment[]
  feature: {
    name: string
    description: string
  }
  suggested_characteristics?: {
    personality_traits?: PersonalityTrait[]
    ideals?: PersonalityTrait[]
    bonds?: PersonalityTrait[]
    flaws?: PersonalityTrait[]
  }
  // UI-specific properties
  imageUrl?: string
  color?: string
}

export interface CharacterConcept {
  race?: Race
  class?: Class
  background?: Background
  level: number
  name: string
  // Computed properties
  finalAbilityScores?: Record<string, number>
  allProficiencies?: Proficiency[]
  startingEquipment?: Equipment[]
  features?: (Trait | ClassFeature)[]
}

// API Response types
export interface RacesResponse {
  races: Race[]
}

export interface ClassesResponse {
  classes: Class[]
}

export interface BackgroundsResponse {
  backgrounds: Background[]
}

// Selection state types
export interface RaceSelectionState {
  selectedRace?: Race
  comparisonRace?: Race
  searchQuery: string
  filterBy: 'all' | 'size' | 'abilities'
}

export interface ClassSelectionState {
  selectedClass?: Class
  comparisonClass?: Class
  searchQuery: string
  filterBy: 'all' | 'spellcasting' | 'complexity' | 'role'
}

export interface BackgroundSelectionState {
  selectedBackground?: Background
  searchQuery: string
  filterBy: 'all' | 'skills' | 'tools'
}

// Utility types for calculations
export interface AbilityScoreArray {
  strength: number
  dexterity: number
  constitution: number
  intelligence: number
  wisdom: number
  charisma: number
}

export function getAbilityModifier(score: number): number {
  return Math.floor((score - 10) / 2)
}

export function getAbilityScoreWithRacialBonus(
  baseScore: number, 
  racialIncrease: number
): number {
  return Math.min(20, baseScore + racialIncrease)
}

// Constants for D&D rules
export const ABILITY_NAMES = [
  'strength',
  'dexterity', 
  'constitution',
  'intelligence',
  'wisdom',
  'charisma'
] as const

export const SKILLS_BY_ABILITY = {
  strength: ['Athletics'],
  dexterity: ['Acrobatics', 'Sleight of Hand', 'Stealth'],
  constitution: [],
  intelligence: ['Arcana', 'History', 'Investigation', 'Nature', 'Religion'],
  wisdom: ['Animal Handling', 'Insight', 'Medicine', 'Perception', 'Survival'],
  charisma: ['Deception', 'Intimidation', 'Performance', 'Persuasion']
} as const

export const PROFICIENCY_BONUS_BY_LEVEL = {
  1: 2, 2: 2, 3: 2, 4: 2,
  5: 3, 6: 3, 7: 3, 8: 3,
  9: 4, 10: 4, 11: 4, 12: 4,
  13: 5, 14: 5, 15: 5, 16: 5,
  17: 6, 18: 6, 19: 6, 20: 6
} as const

export type AbilityName = typeof ABILITY_NAMES[number]
export type SkillName = typeof SKILLS_BY_ABILITY[keyof typeof SKILLS_BY_ABILITY][number]