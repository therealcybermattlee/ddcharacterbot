export interface Character {
  id: string
  name: string
  race: string
  class: string
  level: number
  background: string
  alignment: string
  stats: {
    strength: number
    dexterity: number
    constitution: number
    intelligence: number
    wisdom: number
    charisma: number
  }
  hitPoints: {
    current: number
    maximum: number
    temporary: number
  }
  armorClass: number
  proficiencyBonus: number
  savingThrows: Record<string, number>
  skills: Record<string, number>
  equipment: Equipment[]
  spells?: Spell[]
  spellSlots?: SpellSlots
  deathSaves?: DeathSaves
  hitDice?: HitDice
  speed?: number
  initiative?: number
  passivePerception?: number
  inspiration?: boolean
  notes?: string
  createdAt: Date
  updatedAt: Date
  userId: string
}

export interface Equipment {
  id: string
  name: string
  type: string
  description?: string
  quantity: number
  weight?: number
  value?: number
  equipped?: boolean
  attuned?: boolean
}

export interface Spell {
  id: string
  name: string
  level: number
  school: string
  castingTime: string
  range: string
  components: string[]
  duration: string
  description: string
  prepared?: boolean
  ritual?: boolean
  concentration?: boolean
}

export interface SpellSlot {
  used: number
  total: number
}

export interface SpellSlots {
  level1?: SpellSlot
  level2?: SpellSlot
  level3?: SpellSlot
  level4?: SpellSlot
  level5?: SpellSlot
  level6?: SpellSlot
  level7?: SpellSlot
  level8?: SpellSlot
  level9?: SpellSlot
}

export interface DeathSaves {
  successes: number
  failures: number
}

export interface HitDice {
  used: number
  total: number
  dieSize: number // d6, d8, d10, d12
}

export interface Attack {
  id: string
  name: string
  attackBonus: number
  damageType: string
  damageDice: string // e.g., "1d8+3"
  range?: string
  description?: string
}

export interface ClassFeature {
  id: string
  name: string
  description: string
  level: number
  uses?: {
    current: number
    maximum: number
    resetOn: 'short' | 'long' | 'daily'
  }
}

export interface SkillProficiency {
  proficient: boolean
  expertise: boolean
  modifier: number
}

// Ability score names
export type AbilityScore = 'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma'

// Skill names mapped to their governing ability
export const SKILLS: Record<string, AbilityScore> = {
  'Acrobatics': 'dexterity',
  'Animal Handling': 'wisdom',
  'Arcana': 'intelligence',
  'Athletics': 'strength',
  'Deception': 'charisma',
  'History': 'intelligence',
  'Insight': 'wisdom',
  'Intimidation': 'charisma',
  'Investigation': 'intelligence',
  'Medicine': 'wisdom',
  'Nature': 'intelligence',
  'Perception': 'wisdom',
  'Performance': 'charisma',
  'Persuasion': 'charisma',
  'Religion': 'intelligence',
  'Sleight of Hand': 'dexterity',
  'Stealth': 'dexterity',
  'Survival': 'wisdom'
}