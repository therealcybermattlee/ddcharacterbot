import React, { useEffect, useRef } from 'react'
import { WizardStepProps } from '../../../types/wizard'
import { AbilityScoreGenerator } from '../../character-creation/AbilityScoreGenerator'
import { useCharacterCreation } from '../../../contexts/CharacterCreationContext'

interface AbilityScores {
  strength: number
  dexterity: number
  constitution: number
  intelligence: number
  wisdom: number
  charisma: number
}

interface AbilityScoreState {
  method: 'standard' | 'pointBuy' | 'rolled'
  baseScores: AbilityScores
  rollHistory?: Array<{
    ability: string
    rolls: number[]
    dropped: number
    result: number
    timestamp: number
  }>
  pointsUsed?: number
  standardAssignments?: { [key: string]: number }
  isComplete: boolean
}

// Mock racial bonuses for demonstration - in real app this would come from race data
const getRacialBonuses = (race: string) => {
  const bonuses: { [key: string]: any } = {
    'human': { strength: 1, dexterity: 1, constitution: 1, intelligence: 1, wisdom: 1, charisma: 1 },
    'elf': { dexterity: 2 },
    'dwarf': { constitution: 2 },
    'halfling': { dexterity: 2 },
    'dragonborn': { strength: 2, charisma: 1 },
    'gnome': { intelligence: 2 },
    'half-elf': { charisma: 2 },
    'half-orc': { strength: 2, constitution: 1 },
    'tiefling': { intelligence: 1, charisma: 2 }
  }
  
  return bonuses[race.toLowerCase()] || {}
}

export function AbilityScoresStep({ data, onChange, onValidationChange }: WizardStepProps) {
  const { characterData } = useCharacterCreation()

  // BUG FIX #007: Use ref pattern to handle unstable onValidationChange callback
  // This ensures validation always calls the latest callback even when its identity changes
  // Prevents Next button from staying disabled when ability scores are complete
  const onValidationChangeRef = useRef(onValidationChange)

  useEffect(() => {
    onValidationChangeRef.current = onValidationChange
  }, [onValidationChange])

  // Also apply ref pattern to onChange for consistency and future-proofing
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])


  // Extract ability score state from data prop first, then context, then defaults
  const abilityScoreState = data?.abilityScoreState || characterData.abilityScoreState || {
    method: 'standard' as const,
    baseScores: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10
    },
    rollHistory: [],
    pointsUsed: 0,
    standardAssignments: {},
    isComplete: false
  }

  // Get racial bonuses based on selected race
  const racialBonuses = characterData.race ? getRacialBonuses(characterData.race) : {}

  // Handle state changes from AbilityScoreGenerator
  const handleStateChange = (newState: AbilityScoreState) => {
    // Update only the specific fields that changed
    const updatedData = {
      stats: newState.baseScores,
      abilityScoreState: newState
    }

    onChangeRef.current(updatedData)
    
    // Validate the state
    const errors: string[] = []

    // Validate score ranges (base scores before racial bonuses)
    const scores = Object.values(newState.baseScores)
    if (scores.some(score => score < 3)) {
      errors.push('All ability scores must be at least 3')
    }
    if (scores.some(score => score > 20)) {
      errors.push('No base ability score can exceed 20')
    }

    // Method-specific validation
    let methodValid = true
    if (newState.method === 'pointBuy') {
      if (newState.pointsUsed !== 27) {
        errors.push('You must use exactly 27 points in point buy')
        methodValid = false
      }
      if (scores.some(score => score < 8 || score > 15)) {
        errors.push('Point buy scores must be between 8 and 15')
        methodValid = false
      }
    } else if (newState.method === 'standard') {
      const standardArray = [15, 14, 13, 12, 10, 8]
      const sortedScores = [...scores].sort((a, b) => b - a)
      const sortedStandard = [...standardArray].sort((a, b) => b - a)

      if (JSON.stringify(sortedScores) !== JSON.stringify(sortedStandard)) {
        errors.push('Must use exactly the standard array values: 15, 14, 13, 12, 10, 8')
        methodValid = false
      } else {
        // For standard array, if scores match, consider it valid regardless of isComplete flag
        // This fixes sync issues between AbilityScoreGenerator and AbilityScoresStep
        methodValid = true
      }
    } else if (newState.method === 'rolled') {
      if (scores.some(score => score < 3)) {
        errors.push('Rolled scores that are too low should be rerolled')
        methodValid = false
      }
    }

    // For standard array, skip the isComplete check if scores are valid
    // For other methods, check isComplete only if method validation passed
    // Trust the AbilityScoreGenerator's isComplete calculation
    if (newState.method === 'standard') {
      // For standard array, if methodValid is true, we're good regardless of isComplete
      // This fixes sync issues between components
    } else if (methodValid && !newState.isComplete) {
      errors.push('Please complete ability score generation')
    }

    onValidationChangeRef.current(errors.length === 0, errors)
  }

  // Validate on mount - but only for truly fresh states
  useEffect(() => {
    // Don't trigger validation automatically if we have saved data in the data prop
    // This prevents overwriting valid saved progress when returning to the step
    if (data?.abilityScoreState) {
      // We have saved data, run full validation on it (using same logic as handleStateChange)
      const errors: string[] = []

      // Validate score ranges (base scores before racial bonuses)
      const scores = Object.values(data.abilityScoreState.baseScores) as number[]
      if (scores.some(score => score < 3)) {
        errors.push('All ability scores must be at least 3')
      }
      if (scores.some(score => score > 20)) {
        errors.push('No base ability score can exceed 20')
      }

      // Method-specific validation
      let methodValid = true
      if (data.abilityScoreState.method === 'pointBuy') {
        if (data.abilityScoreState.pointsUsed !== 27) {
          errors.push('You must use exactly 27 points in point buy')
          methodValid = false
        }
        if (scores.some(score => score < 8 || score > 15)) {
          errors.push('Point buy scores must be between 8 and 15')
          methodValid = false
        }
      } else if (data.abilityScoreState.method === 'standard') {
        const standardArray = [15, 14, 13, 12, 10, 8]
        const sortedScores = [...scores].sort((a, b) => b - a)
        const sortedStandard = [...standardArray].sort((a, b) => b - a)

        if (JSON.stringify(sortedScores) !== JSON.stringify(sortedStandard)) {
          errors.push('Must use exactly the standard array values: 15, 14, 13, 12, 10, 8')
          methodValid = false
        } else {
          // For standard array, if scores match, consider it valid regardless of isComplete flag
          methodValid = true
        }
      } else if (data.abilityScoreState.method === 'rolled') {
        if (scores.some(score => score < 3)) {
          errors.push('Rolled scores that are too low should be rerolled')
          methodValid = false
        }
      }

      // For standard array, skip the isComplete check if scores are valid
      // For other methods, check isComplete only if method validation passed
      if (data.abilityScoreState.method === 'standard') {
        // For standard array, methodValid already accounts for everything we need
      } else if (methodValid && !data.abilityScoreState.isComplete) {
        errors.push('Please complete ability score generation')
      }

      onValidationChangeRef.current(errors.length === 0, errors)
    } else {
      // No saved data, start with valid empty state to avoid "Required" errors on initial load
      onValidationChangeRef.current(false, ['Please generate ability scores'])
    }
  }, [])
  // BUG FIX #007: Empty dependency array is safe because we use ref pattern
  // onValidationChangeRef.current always calls the latest callback

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">
          Generate Ability Scores
        </h2>
        <p className="text-muted-foreground">
          Choose how to determine your character's six core abilities: Strength, Dexterity, 
          Constitution, Intelligence, Wisdom, and Charisma.
        </p>
      </div>

      <AbilityScoreGenerator
        initialState={abilityScoreState}
        onStateChange={handleStateChange}
        selectedClass={characterData.class}
        selectedRace={characterData.race}
        racialBonuses={racialBonuses}
        playerExperience="new" // Could be determined from user preferences
        showRacialPreview={true}
      />
    </div>
  )
}