import React, { useEffect } from 'react'
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
  
  // Extract ability score state from data or use defaults
  const abilityScoreState = characterData.abilityScoreState || {
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
    // Update both the ability score state and the base stats
    const updatedData = {
      ...characterData,
      stats: newState.baseScores,
      abilityScoreState: newState
    }
    
    onChange(updatedData)
    
    // Validate the state
    const errors: string[] = []
    
    if (!newState.isComplete) {
      errors.push('Please complete ability score generation')
    }
    
    // Validate score ranges (base scores before racial bonuses)
    const scores = Object.values(newState.baseScores)
    if (scores.some(score => score < 3)) {
      errors.push('All ability scores must be at least 3')
    }
    if (scores.some(score => score > 20)) {
      errors.push('No base ability score can exceed 20')
    }
    
    // Method-specific validation
    if (newState.method === 'pointBuy') {
      if (newState.pointsUsed !== 27) {
        errors.push('You must use exactly 27 points in point buy')
      }
      if (scores.some(score => score < 8 || score > 15)) {
        errors.push('Point buy scores must be between 8 and 15')
      }
    } else if (newState.method === 'standard') {
      const standardArray = [15, 14, 13, 12, 10, 8]
      const sortedScores = [...scores].sort((a, b) => b - a)
      const sortedStandard = [...standardArray].sort((a, b) => b - a)
      
      if (JSON.stringify(sortedScores) !== JSON.stringify(sortedStandard)) {
        errors.push('Must use exactly the standard array values: 15, 14, 13, 12, 10, 8')
      }
    } else if (newState.method === 'rolled') {
      if (scores.some(score => score < 3)) {
        errors.push('Rolled scores that are too low should be rerolled')
      }
    }
    
    onValidationChange(errors.length === 0, errors)
  }

  // Validate on mount
  useEffect(() => {
    handleStateChange(abilityScoreState)
  }, [])

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