import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { Character } from '../types/character'
import { 
  WizardContextState, 
  CharacterCreationData, 
  WizardStep, 
  WIZARD_STORAGE_KEY,
  BasicInfoSchema,
  AbilityScoresSchema,
  SkillsSchema,
  EquipmentSchema,
  BackgroundDetailsSchema
} from '../types/wizard'
import { api } from '../services/api'
import { BasicInfoStep } from '../components/wizard/steps/BasicInfoStep'
import { AbilityScoresStep } from '../components/wizard/steps/AbilityScoresStep'
import { SkillsProficienciesStep } from '../components/wizard/steps/SkillsProficienciesStep'
import { EquipmentSpellsStep } from '../components/wizard/steps/EquipmentSpellsStep'
import { BackgroundDetailsStep } from '../components/wizard/steps/BackgroundDetailsStep'
import { ReviewCreateStep } from '../components/wizard/steps/ReviewCreateStep'

// Initial character data
const initialCharacterData: CharacterCreationData = {
  name: '',
  race: '',
  class: '',
  level: 1,
  background: '',
  alignment: '',
  stats: {
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
  },
  abilityScoreState: {
    method: 'standard',
    baseScores: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    rollHistory: [],
    pointsUsed: 0,
    standardAssignments: {},
    isComplete: false,
  },
  proficiencyBonus: 2,
  savingThrows: {},
  skills: {},
  equipment: [],
  spells: [],
  notes: '',
  armorClass: 10,
  hitPoints: {
    current: 8,
    maximum: 8,
    temporary: 0,
  },
}

// Wizard actions
type WizardAction = 
  | { type: 'SET_CURRENT_STEP'; payload: number }
  | { type: 'UPDATE_STEP_DATA'; payload: { stepId: string; data: any } }
  | { type: 'SET_STEP_VALIDITY'; payload: { stepId: string; isValid: boolean; errors?: string[] } }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'LOAD_SAVED_DATA'; payload: CharacterCreationData }
  | { type: 'RESET_WIZARD' }

// Wizard state interface
interface WizardState {
  currentStep: number
  characterData: CharacterCreationData
  stepValidities: Record<string, boolean>
  stepErrors: Record<string, string[]>
  isSubmitting: boolean
}

// Initial wizard state
const initialWizardState: WizardState = {
  currentStep: 0,
  characterData: initialCharacterData,
  stepValidities: {},
  stepErrors: {},
  isSubmitting: false,
}

// Wizard reducer
function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'SET_CURRENT_STEP':
      return { ...state, currentStep: action.payload }
    
    case 'UPDATE_STEP_DATA':
      const { stepId, data } = action.payload
      return {
        ...state,
        characterData: { ...state.characterData, ...data }
      }
    
    case 'SET_STEP_VALIDITY':
      return {
        ...state,
        stepValidities: {
          ...state.stepValidities,
          [action.payload.stepId]: action.payload.isValid
        },
        stepErrors: {
          ...state.stepErrors,
          [action.payload.stepId]: action.payload.errors || []
        }
      }
    
    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.payload }
    
    case 'LOAD_SAVED_DATA':
      return {
        ...state,
        characterData: { ...state.characterData, ...action.payload }
      }
    
    case 'RESET_WIZARD':
      return initialWizardState
    
    default:
      return state
  }
}

// Create context
const CharacterCreationContext = createContext<WizardContextState | undefined>(undefined)

// Provider props
interface CharacterCreationProviderProps {
  children: ReactNode
}

// Provider component
export function CharacterCreationProvider({ children }: CharacterCreationProviderProps) {
  const [state, dispatch] = useReducer(wizardReducer, initialWizardState)

  // Define wizard steps
  const steps: WizardStep[] = [
    {
      id: 'basic-info',
      title: 'Basic Information',
      description: 'Character name, race, class, and background',
      component: BasicInfoStep,
      isValid: state.stepValidities['basic-info'] || false,
      isComplete: state.stepValidities['basic-info'] || false,
      schema: BasicInfoSchema
    },
    {
      id: 'ability-scores',
      title: 'Ability Scores',
      description: 'Strength, Dexterity, Constitution, Intelligence, Wisdom, Charisma',
      component: AbilityScoresStep,
      isValid: state.stepValidities['ability-scores'] || false,
      isComplete: state.stepValidities['ability-scores'] || false,
      schema: AbilityScoresSchema
    },
    {
      id: 'skills-proficiencies',
      title: 'Skills & Proficiencies',
      description: 'Skill modifiers, saving throws, and proficiency bonus',
      component: SkillsProficienciesStep,
      isValid: state.stepValidities['skills-proficiencies'] || false,
      isComplete: state.stepValidities['skills-proficiencies'] || false,
      schema: SkillsSchema
    },
    {
      id: 'equipment-spells',
      title: 'Equipment & Spells',
      description: 'Starting equipment, weapons, armor, and spells',
      component: EquipmentSpellsStep,
      isValid: state.stepValidities['equipment-spells'] || false,
      isComplete: state.stepValidities['equipment-spells'] || false,
      schema: EquipmentSchema
    },
    {
      id: 'background-details',
      title: 'Background & Details',
      description: 'Character notes, AC, hit points, and final details',
      component: BackgroundDetailsStep,
      isValid: state.stepValidities['background-details'] || false,
      isComplete: state.stepValidities['background-details'] || false,
      schema: BackgroundDetailsSchema
    },
    {
      id: 'review-create',
      title: 'Review & Create',
      description: 'Review your character and create it',
      component: ReviewCreateStep,
      isValid: true, // Review step is always valid
      isComplete: false,
      schema: BackgroundDetailsSchema // Reuse last schema for review
    }
  ]

  // Navigation functions
  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      dispatch({ type: 'SET_CURRENT_STEP', payload: stepIndex })
    }
  }

  const nextStep = () => {
    if (state.currentStep < steps.length - 1) {
      dispatch({ type: 'SET_CURRENT_STEP', payload: state.currentStep + 1 })
    }
  }

  const previousStep = () => {
    if (state.currentStep > 0) {
      dispatch({ type: 'SET_CURRENT_STEP', payload: state.currentStep - 1 })
    }
  }

  const reset = () => {
    dispatch({ type: 'RESET_WIZARD' })
    localStorage.removeItem(WIZARD_STORAGE_KEY)
  }

  // Step data management
  const updateStepData = (_stepId: string, data: any) => {
    dispatch({ type: 'UPDATE_STEP_DATA', payload: { stepId: _stepId, data } })
    // Note: saveProgress() is now handled by useEffect to avoid race condition
  }

  const validateStep = async (stepId: string): Promise<boolean> => {
    const step = steps.find(s => s.id === stepId)
    if (!step) return false

    try {
      // Get the relevant data for this step
      let stepData: any = {}
      
      switch (stepId) {
        case 'basic-info':
          stepData = {
            name: state.characterData.name,
            race: state.characterData.race,
            class: state.characterData.class,
            level: state.characterData.level,
            background: state.characterData.background,
            alignment: state.characterData.alignment,
          }
          break
        case 'ability-scores':
          // Schema expects just the stats object, not wrapped
          stepData = state.characterData.stats
          break
        case 'skills-proficiencies':
          stepData = {
            proficiencyBonus: state.characterData.proficiencyBonus,
            savingThrows: state.characterData.savingThrows,
            skills: state.characterData.skills,
          }
          break
        case 'equipment-spells':
          stepData = {
            equipment: state.characterData.equipment,
            spells: state.characterData.spells,
            equipmentChoices: state.characterData.equipmentChoices,
            spellChoices: state.characterData.spellChoices,
          }
          break
        case 'background-details':
          stepData = {
            notes: state.characterData.notes,
            armorClass: state.characterData.armorClass,
            hitPoints: state.characterData.hitPoints,
          }
          break
        default:
          stepData = state.characterData
      }

      await step.schema.parseAsync(stepData)
      dispatch({ type: 'SET_STEP_VALIDITY', payload: { stepId, isValid: true, errors: [] } })
      return true
    } catch (error: any) {
      const errors = error.errors && error.errors.length > 0
        ? error.errors.map((e: any) => e.message)
        : ['Validation failed']
      dispatch({ type: 'SET_STEP_VALIDITY', payload: { stepId, isValid: false, errors } })
      return false
    }
  }

  // Character submission
  const submitCharacter = async (): Promise<Character | null> => {
    dispatch({ type: 'SET_SUBMITTING', payload: true })

    try {
      // Convert wizard data to Character format
      const characterPayload: Omit<Character, 'id' | 'createdAt' | 'updatedAt' | 'userId'> = {
        name: state.characterData.name,
        race: state.characterData.race,
        class: state.characterData.class,
        level: state.characterData.level,
        background: state.characterData.background,
        alignment: state.characterData.alignment,
        stats: state.characterData.stats,
        hitPoints: state.characterData.hitPoints,
        armorClass: state.characterData.armorClass,
        proficiencyBonus: state.characterData.proficiencyBonus,
        savingThrows: state.characterData.savingThrows,
        skills: state.characterData.skills,
        equipment: state.characterData.equipment,
        spells: state.characterData.spells,
        notes: state.characterData.notes,
      }

      const response = await api.post<Character>('/characters', characterPayload)

      // Clear saved progress after successful submission
      localStorage.removeItem(WIZARD_STORAGE_KEY)

      // Return the created character data with ID
      return response.data
    } catch (error) {
      throw error
    } finally {
      dispatch({ type: 'SET_SUBMITTING', payload: false })
    }
  }

  // Progress persistence
  const saveProgress = () => {
    try {
      localStorage.setItem(WIZARD_STORAGE_KEY, JSON.stringify(state.characterData))
    } catch (error) {
      // Silent fail - localStorage may not be available
    }
  }

  const loadProgress = () => {
    try {
      const saved = localStorage.getItem(WIZARD_STORAGE_KEY)
      if (saved) {
        const savedData = JSON.parse(saved)
        dispatch({ type: 'LOAD_SAVED_DATA', payload: savedData })
      }
    } catch (error) {
      // Silent fail - localStorage may not be available or data may be corrupted
    }
  }

  const clearProgress = () => {
    localStorage.removeItem(WIZARD_STORAGE_KEY)
    dispatch({ type: 'RESET_WIZARD' })
  }

  // Set step validity (for real-time validation callbacks)
  const setStepValidity = (stepId: string, isValid: boolean, errors?: string[]) => {
    dispatch({ type: 'SET_STEP_VALIDITY', payload: { stepId, isValid, errors } })
  }

  // Load saved progress on mount
  useEffect(() => {
    loadProgress()
  }, [])

  // Auto-save to localStorage whenever characterData changes
  // This ensures we save AFTER the reducer has updated the state
  useEffect(() => {
    saveProgress()
  }, [state.characterData])

  // Navigation object
  const navigation = {
    currentStep: state.currentStep,
    totalSteps: steps.length,
    canGoNext: state.currentStep < steps.length - 1,
    canGoPrevious: state.currentStep > 0,
    goToStep,
    nextStep,
    previousStep,
    reset
  }

  // Current step data
  const currentStepData = (() => {
    const currentStep = steps[state.currentStep]
    if (!currentStep) return {}

    switch (currentStep.id) {
      case 'basic-info':
        return {
          name: state.characterData.name,
          race: state.characterData.race,
          class: state.characterData.class,
          level: state.characterData.level,
          background: state.characterData.background,
          alignment: state.characterData.alignment,
        }
      case 'ability-scores':
        return {
          stats: state.characterData.stats,
          abilityScoreState: state.characterData.abilityScoreState
        }
      case 'skills-proficiencies':
        return {
          proficiencyBonus: state.characterData.proficiencyBonus,
          savingThrows: state.characterData.savingThrows,
          skills: state.characterData.skills,
        }
      case 'equipment-spells':
        return {
          equipment: state.characterData.equipment,
          spells: state.characterData.spells,
          equipmentChoices: state.characterData.equipmentChoices,
          spellChoices: state.characterData.spellChoices,
        }
      case 'background-details':
        return {
          notes: state.characterData.notes,
          armorClass: state.characterData.armorClass,
          hitPoints: state.characterData.hitPoints,
        }
      default:
        return state.characterData
    }
  })()

  // Context value
  const value: WizardContextState = {
    characterData: state.characterData,
    navigation,
    steps,
    currentStepData,
    updateStepData,
    validateStep,
    setStepValidity,
    submitCharacter,
    saveProgress,
    loadProgress,
    clearProgress,
    isSubmitting: state.isSubmitting,
    errors: state.stepErrors,
  }

  return (
    <CharacterCreationContext.Provider value={value}>
      {children}
    </CharacterCreationContext.Provider>
  )
}

// Hook to use the context
export function useCharacterCreation(): WizardContextState {
  const context = useContext(CharacterCreationContext)
  if (context === undefined) {
    throw new Error('useCharacterCreation must be used within a CharacterCreationProvider')
  }
  return context
}