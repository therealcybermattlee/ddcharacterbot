// import { Character } from './character'
import { z } from 'zod'

// Wizard step validation schemas
export const BasicInfoSchema = z.object({
  name: z.string().min(1, 'Character name is required'),
  race: z.string().min(1, 'Race is required'),
  class: z.string().min(1, 'Class is required'),
  level: z.number().min(1).max(20).default(1),
  background: z.string().min(1, 'Background is required'),
  alignment: z.string().min(1, 'Alignment is required'),
})

export const AbilityScoresSchema = z.object({
  strength: z.number().min(3).max(20),
  dexterity: z.number().min(3).max(20),
  constitution: z.number().min(3).max(20),
  intelligence: z.number().min(3).max(20),
  wisdom: z.number().min(3).max(20),
  charisma: z.number().min(3).max(20),
})

export const SkillsSchema = z.object({
  proficiencyBonus: z.number().min(2).max(6),
  savingThrows: z.record(z.number()),
  skills: z.record(z.number()),
})

export const EquipmentSchema = z.object({
  equipment: z.array(z.object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
    description: z.string().optional(),
    quantity: z.number().min(1),
    weight: z.number().optional(),
    value: z.number().optional(),
  })),
  spells: z.array(z.object({
    id: z.string(),
    name: z.string(),
    level: z.number().min(0).max(9),
    school: z.enum(['Abjuration', 'Conjuration', 'Divination', 'Enchantment', 'Evocation', 'Illusion', 'Necromancy', 'Transmutation']),
    castingTime: z.string(),
    range: z.string(),
    components: z.array(z.enum(['V', 'S', 'M'])),
    duration: z.string(),
    description: z.string(),
    prepared: z.boolean().optional(),
  })).optional(),
  equipmentChoices: z.record(z.number()).optional(),
  spellChoices: z.object({
    cantrips: z.array(z.string()),
    knownSpells: z.array(z.string()),
    preparedSpells: z.array(z.string()).optional(),
  }).optional(),
})

export const BackgroundDetailsSchema = z.object({
  notes: z.string().optional(),
  armorClass: z.number().min(1).max(30),
  hitPoints: z.object({
    current: z.number().min(1),
    maximum: z.number().min(1),
    temporary: z.number().min(0).default(0),
  }),
})

// Wizard step types
export interface WizardStep {
  id: string
  title: string
  description: string
  component: React.ComponentType<WizardStepProps>
  isValid: boolean
  isComplete: boolean
  schema: z.ZodSchema<any>
}

export interface WizardStepProps {
  data: any
  onChange: (data: any) => void
  onValidationChange: (isValid: boolean, errors?: string[]) => void
  onNext?: () => void
}

// Character creation data interface
export interface CharacterCreationData {
  // Basic Info
  name: string
  race: string
  class: string
  level: number
  background: string
  alignment: string
  // Enhanced D&D reference data
  raceData?: import('./dnd5e').Race
  classData?: import('./dnd5e').Class
  backgroundData?: import('./dnd5e').Background
  
  // Ability Scores
  stats: {
    strength: number
    dexterity: number
    constitution: number
    intelligence: number
    wisdom: number
    charisma: number
  }
  
  // Ability Score Generation State
  abilityScoreState?: {
    method: 'standard' | 'pointBuy' | 'rolled'
    baseScores: {
      strength: number
      dexterity: number
      constitution: number
      intelligence: number
      wisdom: number
      charisma: number
    }
    rollHistory?: Array<{
      ability: string
      rolls: number[]
      dropped: number
      result: number
      timestamp: number
    }>
    pointsUsed?: number // for point buy
    standardAssignments?: { [key: string]: number } // for standard array
    isComplete: boolean
  }
  
  // Skills & Proficiencies
  proficiencyBonus: number
  savingThrows: Record<string, number>
  skills: Record<string, number>
  
  // Equipment & Spells
  equipment: Array<{
    id: string
    name: string
    type: string
    description?: string
    quantity: number
    weight?: number
    value?: number
  }>
  spells?: Array<{
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
  }>
  
  // Equipment & Spell Choices (for step persistence)
  equipmentChoices?: Record<number, number>
  spellChoices?: {
    cantrips: string[]
    knownSpells: string[]
    preparedSpells?: string[]
  }
  
  // Background & Details
  notes?: string
  armorClass: number
  hitPoints: {
    current: number
    maximum: number
    temporary: number
  }
}

// Wizard navigation types
export interface WizardNavigation {
  currentStep: number
  totalSteps: number
  canGoNext: boolean
  canGoPrevious: boolean
  goToStep: (stepIndex: number) => void
  nextStep: () => void
  previousStep: () => void
  reset: () => void
}

// Wizard context state
export interface WizardContextState {
  // Data
  characterData: CharacterCreationData
  
  // Navigation
  navigation: WizardNavigation
  
  // Steps
  steps: WizardStep[]
  currentStepData: any
  
  // State management
  updateStepData: (stepId: string, data: any) => void
  validateStep: (stepId: string) => Promise<boolean>
  submitCharacter: () => Promise<void>
  saveProgress: () => void
  loadProgress: () => void
  clearProgress: () => void
  
  // Status
  isSubmitting: boolean
  errors: Record<string, string[]>
}

// Local storage key for draft data
export const WIZARD_STORAGE_KEY = 'dnd-character-wizard-draft'