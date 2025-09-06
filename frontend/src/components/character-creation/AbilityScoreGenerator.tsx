import React, { useState, useEffect } from 'react'
import { Card } from '../ui/card'
import { cn } from '../../utils/cn'
import { MethodSelector } from './MethodSelector'
import { PointBuyInterface } from './PointBuyInterface'
import { StandardArrayInterface } from './StandardArrayInterface'
import { DiceRollingInterface } from './DiceRollingInterface'
import { AbilityScoreDisplay, AbilityScoreSummary } from './AbilityScoreDisplay'

type GenerationMethod = 'standard' | 'pointBuy' | 'rolled'
type AbilityName = 'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma'

interface AbilityScores {
  strength: number
  dexterity: number
  constitution: number
  intelligence: number
  wisdom: number
  charisma: number
}

interface RollHistory {
  ability: string
  rolls: number[]
  dropped: number
  result: number
  timestamp: number
}

interface RacialBonuses {
  strength?: number
  dexterity?: number
  constitution?: number
  intelligence?: number
  wisdom?: number
  charisma?: number
}

interface AbilityScoreState {
  method: GenerationMethod
  baseScores: AbilityScores
  rollHistory?: RollHistory[]
  pointsUsed?: number
  standardAssignments?: { [key: string]: number }
  isComplete: boolean
}

interface AbilityScoreGeneratorProps {
  initialState?: Partial<AbilityScoreState>
  onStateChange: (state: AbilityScoreState) => void
  selectedClass?: string
  selectedRace?: string
  racialBonuses?: RacialBonuses
  playerExperience?: 'new' | 'experienced' | 'expert'
  showRacialPreview?: boolean
  className?: string
}

// Class-specific ability priorities
const CLASS_ABILITIES = {
  'fighter': { primary: ['strength', 'dexterity'] as AbilityName[], secondary: ['constitution'] as AbilityName[] },
  'wizard': { primary: ['intelligence'] as AbilityName[], secondary: ['dexterity', 'constitution'] as AbilityName[] },
  'rogue': { primary: ['dexterity'] as AbilityName[], secondary: ['constitution', 'charisma'] as AbilityName[] },
  'cleric': { primary: ['wisdom'] as AbilityName[], secondary: ['strength', 'constitution'] as AbilityName[] },
  'barbarian': { primary: ['strength'] as AbilityName[], secondary: ['constitution', 'dexterity'] as AbilityName[] },
  'bard': { primary: ['charisma'] as AbilityName[], secondary: ['dexterity', 'constitution'] as AbilityName[] },
  'druid': { primary: ['wisdom'] as AbilityName[], secondary: ['dexterity', 'constitution'] as AbilityName[] },
  'monk': { primary: ['dexterity', 'wisdom'] as AbilityName[], secondary: ['constitution'] as AbilityName[] },
  'paladin': { primary: ['strength', 'charisma'] as AbilityName[], secondary: ['constitution'] as AbilityName[] },
  'ranger': { primary: ['dexterity'] as AbilityName[], secondary: ['wisdom', 'constitution'] as AbilityName[] },
  'sorcerer': { primary: ['charisma'] as AbilityName[], secondary: ['dexterity', 'constitution'] as AbilityName[] },
  'warlock': { primary: ['charisma'] as AbilityName[], secondary: ['dexterity', 'constitution'] as AbilityName[] }
} as const

// Default ability scores
const DEFAULT_SCORES: AbilityScores = {
  strength: 10,
  dexterity: 10,
  constitution: 10,
  intelligence: 10,
  wisdom: 10,
  charisma: 10
}

// Standard array scores
const STANDARD_ARRAY_SCORES: AbilityScores = {
  strength: 15,
  dexterity: 14,
  constitution: 13,
  intelligence: 12,
  wisdom: 10,
  charisma: 8
}

// Point buy base scores
const POINT_BUY_BASE: AbilityScores = {
  strength: 8,
  dexterity: 8,
  constitution: 8,
  intelligence: 8,
  wisdom: 8,
  charisma: 8
}

export function AbilityScoreGenerator({
  initialState,
  onStateChange,
  selectedClass,
  selectedRace,
  racialBonuses = {},
  playerExperience = 'new',
  showRacialPreview = true,
  className
}: AbilityScoreGeneratorProps) {
  // Initialize state
  const [method, setMethod] = useState<GenerationMethod>(initialState?.method || 'standard')
  const [baseScores, setBaseScores] = useState<AbilityScores>(
    initialState?.baseScores || STANDARD_ARRAY_SCORES
  )
  const [rollHistory, setRollHistory] = useState<RollHistory[]>(initialState?.rollHistory || [])
  const [pointsUsed, setPointsUsed] = useState(initialState?.pointsUsed || 0)
  const [standardAssignments, setStandardAssignments] = useState(
    initialState?.standardAssignments || {}
  )
  const [showMethodSelector, setShowMethodSelector] = useState(!initialState?.method)

  // Get class-specific ability priorities
  const classAbilities = selectedClass ? 
    CLASS_ABILITIES[selectedClass.toLowerCase() as keyof typeof CLASS_ABILITIES] : 
    { primary: [], secondary: [] }

  // Calculate final scores with racial bonuses
  const finalScores: AbilityScores = {
    strength: baseScores.strength + (racialBonuses.strength || 0),
    dexterity: baseScores.dexterity + (racialBonuses.dexterity || 0),
    constitution: baseScores.constitution + (racialBonuses.constitution || 0),
    intelligence: baseScores.intelligence + (racialBonuses.intelligence || 0),
    wisdom: baseScores.wisdom + (racialBonuses.wisdom || 0),
    charisma: baseScores.charisma + (racialBonuses.charisma || 0)
  }

  // Update parent component when state changes
  useEffect(() => {
    const isComplete = method === 'standard' ? 
      Object.values(baseScores).every(score => score >= 8) :
      method === 'pointBuy' ?
      pointsUsed === 27 :
      Object.values(baseScores).every(score => score >= 8)

    const state: AbilityScoreState = {
      method,
      baseScores,
      rollHistory: method === 'rolled' ? rollHistory : undefined,
      pointsUsed: method === 'pointBuy' ? pointsUsed : undefined,
      standardAssignments: method === 'standard' ? standardAssignments : undefined,
      isComplete
    }

    onStateChange(state)
  }, [method, baseScores, rollHistory, pointsUsed, standardAssignments, onStateChange])

  // Handle method selection
  const handleMethodChange = (newMethod: GenerationMethod) => {
    setMethod(newMethod)
    
    // Reset scores based on method
    switch (newMethod) {
      case 'standard':
        setBaseScores(STANDARD_ARRAY_SCORES)
        setStandardAssignments({})
        break
      case 'pointBuy':
        setBaseScores(POINT_BUY_BASE)
        setPointsUsed(0)
        break
      case 'rolled':
        setBaseScores(DEFAULT_SCORES)
        setRollHistory([])
        break
    }
    
    setShowMethodSelector(false)
  }

  // Handle score changes from interfaces
  const handleScoreChange = (newScores: AbilityScores) => {
    setBaseScores(newScores)
    
    // Update method-specific state
    if (method === 'pointBuy') {
      // Calculate points used for point buy
      const pointCosts: { [key: number]: number } = {
        8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9
      }
      const totalPoints = Object.values(newScores).reduce((sum, score) => 
        sum + pointCosts[score], 0
      )
      setPointsUsed(totalPoints)
    }
  }

  // Render method-specific interface
  const renderMethodInterface = () => {
    switch (method) {
      case 'pointBuy':
        return (
          <PointBuyInterface
            scores={baseScores}
            onScoresChange={handleScoreChange}
            primaryAbilities={classAbilities.primary}
            secondaryAbilities={classAbilities.secondary}
          />
        )
      case 'standard':
        return (
          <StandardArrayInterface
            scores={baseScores}
            onScoresChange={handleScoreChange}
            primaryAbilities={classAbilities.primary}
            secondaryAbilities={classAbilities.secondary}
          />
        )
      case 'rolled':
        return (
          <DiceRollingInterface
            scores={baseScores}
            onScoresChange={handleScoreChange}
            rollHistory={rollHistory}
            onRollHistoryChange={setRollHistory}
            primaryAbilities={classAbilities.primary}
            secondaryAbilities={classAbilities.secondary}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Method Selection */}
      {showMethodSelector ? (
        <MethodSelector
          selectedMethod={method}
          onMethodSelect={handleMethodChange}
          playerExperience={playerExperience}
          selectedClass={selectedClass}
        />
      ) : (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-foreground">
                {method === 'standard' && 'Standard Array'}
                {method === 'pointBuy' && 'Point Buy System'}
                {method === 'rolled' && 'Dice Rolling'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {method === 'standard' && 'Assign predetermined scores to abilities'}
                {method === 'pointBuy' && 'Spend 27 points to customize your scores'}
                {method === 'rolled' && 'Roll 4d6 drop lowest for each ability'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowMethodSelector(true)}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                Change Method
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Method Interface */}
      {!showMethodSelector && renderMethodInterface()}

      {/* Ability Score Preview */}
      {!showMethodSelector && showRacialPreview && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              Final Ability Scores
            </h3>
            {selectedRace && (
              <div className="text-sm text-muted-foreground">
                Including {selectedRace} racial bonuses
              </div>
            )}
          </div>

          <AbilityScoreDisplay
            baseScores={baseScores}
            racialBonuses={racialBonuses}
            showDetailedView={false}
            primaryAbilities={classAbilities.primary}
            secondaryAbilities={classAbilities.secondary}
          />

          <AbilityScoreSummary
            baseScores={baseScores}
            racialBonuses={racialBonuses}
          />
        </div>
      )}

      {/* Class Guidance */}
      {selectedClass && classAbilities.primary.length > 0 && (
        <Card className="p-4 bg-green-50 border-green-200">
          <h4 className="font-medium text-green-900 mb-2">
            {selectedClass} Optimization Tips
          </h4>
          <div className="text-sm text-green-800">
            <p className="mb-2">
              <strong>Primary abilities:</strong> Focus on {classAbilities.primary.map(ability => 
                ability.charAt(0).toUpperCase() + ability.slice(1)
              ).join(' and ')} for best performance.
            </p>
            {classAbilities.secondary.length > 0 && (
              <p>
                <strong>Secondary abilities:</strong> Consider {classAbilities.secondary.map(ability => 
                  ability.charAt(0).toUpperCase() + ability.slice(1)
                ).join(', ')} for survivability and utility.
              </p>
            )}
          </div>
        </Card>
      )}

      {/* Racial Bonus Preview */}
      {selectedRace && Object.values(racialBonuses).some(bonus => bonus && bonus > 0) && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">
            {selectedRace} Racial Bonuses
          </h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(racialBonuses).map(([ability, bonus]) => 
              bonus && bonus > 0 ? (
                <div key={ability} className="flex items-center gap-1 text-sm text-blue-800">
                  <span className="capitalize">{ability}:</span>
                  <span className="font-mono font-medium">+{bonus}</span>
                </div>
              ) : null
            )}
          </div>
        </Card>
      )}
    </div>
  )
}