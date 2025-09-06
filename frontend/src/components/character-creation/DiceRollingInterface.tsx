import React, { useState, useCallback } from 'react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Card } from '../ui/card'
import { D6 } from '../ui/dice'
import { cn } from '../../utils/cn'
import { ABILITY_NAMES, ABILITY_DESCRIPTIONS, getModifier, formatModifier } from './AbilityScoreDisplay'

type AbilityName = keyof typeof ABILITY_NAMES

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

interface DiceRollingInterfaceProps {
  scores: AbilityScores
  onScoresChange: (scores: AbilityScores) => void
  rollHistory?: RollHistory[]
  onRollHistoryChange?: (history: RollHistory[]) => void
  primaryAbilities?: AbilityName[]
  secondaryAbilities?: AbilityName[]
  className?: string
}

// D&D 5e dice rolling rules
const DICE_COUNT = 4
const DICE_SIDES = 6
const DROP_COUNT = 1

// Roll validation rules
const MIN_TOTAL_MODIFIER = -1 // Reroll if total modifiers are less than this
const MIN_ABILITY_SCORE = 8   // Reroll if any ability is below this

// Individual die component for animation
interface AnimatedDieProps {
  value: number
  isDropped: boolean
  isRolling: boolean
  delay?: number
  onAnimationComplete?: () => void
}

function AnimatedDie({ value, isDropped, isRolling, delay = 0, onAnimationComplete }: AnimatedDieProps) {
  return (
    <div 
      className={cn(
        "relative transition-all duration-500",
        isRolling && "animate-bounce",
        isDropped && "opacity-40 scale-75"
      )}
      style={{ animationDelay: `${delay}ms` }}
      onAnimationEnd={onAnimationComplete}
    >
      <Badge 
        variant={isDropped ? "secondary" : "default"}
        className={cn(
          "font-mono text-lg px-3 py-2 transition-colors duration-300",
          !isDropped && "bg-blue-600 hover:bg-blue-700",
          isDropped && "bg-gray-400 line-through"
        )}
      >
        {isRolling ? "?" : value}
      </Badge>
    </div>
  )
}

// Roll 4d6 drop lowest
function rollAbilityScore(): { rolls: number[], dropped: number, result: number } {
  const rolls = Array.from({ length: DICE_COUNT }, () => Math.floor(Math.random() * DICE_SIDES) + 1)
  const sortedRolls = [...rolls].sort((a, b) => a - b)
  const dropped = sortedRolls[0]
  const result = rolls.reduce((sum, roll) => sum + roll, 0) - dropped
  
  return { rolls, dropped, result }
}

// Check if scores need rerolling based on D&D 5e rules
function needsReroll(scores: AbilityScores): { needsReroll: boolean, reasons: string[] } {
  const totalModifier = Object.values(scores).reduce((sum, score) => sum + getModifier(score), 0)
  const lowestScore = Math.min(...Object.values(scores))
  
  const reasons = []
  let needsReroll = false
  
  if (totalModifier < MIN_TOTAL_MODIFIER) {
    needsReroll = true
    reasons.push(`Total modifiers (${formatModifier(totalModifier)}) are too low`)
  }
  
  if (lowestScore < MIN_ABILITY_SCORE) {
    needsReroll = true
    reasons.push(`Lowest score (${lowestScore}) is below minimum`)
  }
  
  return { needsReroll, reasons }
}

export function DiceRollingInterface({
  scores,
  onScoresChange,
  rollHistory = [],
  onRollHistoryChange,
  primaryAbilities = [],
  secondaryAbilities = [],
  className
}: DiceRollingInterfaceProps) {
  const abilities = Object.keys(ABILITY_NAMES) as AbilityName[]
  const [isRolling, setIsRolling] = useState(false)
  const [currentlyRolling, setCurrentlyRolling] = useState<AbilityName | null>(null)
  const [showHistory, setShowHistory] = useState(false)

  // Check if current scores need reroll
  const { needsReroll: shouldReroll, reasons } = needsReroll(scores)
  const totalModifier = Object.values(scores).reduce((sum, score) => sum + getModifier(score), 0)

  // Roll for a single ability
  const rollSingleAbility = useCallback(async (ability: AbilityName) => {
    if (isRolling) return
    
    setCurrentlyRolling(ability)
    
    // Simulate rolling animation
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const rollResult = rollAbilityScore()
    const newScores = { ...scores, [ability]: rollResult.result }
    
    const historyEntry: RollHistory = {
      ability,
      rolls: rollResult.rolls,
      dropped: rollResult.dropped,
      result: rollResult.result,
      timestamp: Date.now()
    }
    
    onScoresChange(newScores)
    onRollHistoryChange?.([...rollHistory, historyEntry])
    
    setCurrentlyRolling(null)
  }, [scores, isRolling, rollHistory, onScoresChange, onRollHistoryChange])

  // Roll for all abilities
  const rollAllAbilities = useCallback(async () => {
    if (isRolling) return
    
    setIsRolling(true)
    const newScores = { ...scores }
    const newHistory: RollHistory[] = []
    
    for (let i = 0; i < abilities.length; i++) {
      const ability = abilities[i]
      setCurrentlyRolling(ability)
      
      // Stagger the rolls for dramatic effect
      await new Promise(resolve => setTimeout(resolve, 600))
      
      const rollResult = rollAbilityScore()
      newScores[ability] = rollResult.result
      
      newHistory.push({
        ability,
        rolls: rollResult.rolls,
        dropped: rollResult.dropped,
        result: rollResult.result,
        timestamp: Date.now() + i
      })
    }
    
    onScoresChange(newScores)
    onRollHistoryChange?.([...rollHistory, ...newHistory])
    
    setCurrentlyRolling(null)
    setIsRolling(false)
  }, [abilities, scores, isRolling, rollHistory, onScoresChange, onRollHistoryChange])

  // Reroll if scores are too low
  const rerollLowScores = useCallback(() => {
    rollAllAbilities()
  }, [rollAllAbilities])

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            Roll for Ability Scores
          </h3>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Total Modifier</div>
              <Badge 
                variant={totalModifier >= 0 ? "default" : totalModifier >= MIN_TOTAL_MODIFIER ? "secondary" : "destructive"}
                className="font-mono text-lg px-3 py-1"
              >
                {formatModifier(totalModifier)}
              </Badge>
            </div>
          </div>
        </div>

        {/* Instructions and Rules */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">D&D 5e Rolling Rules</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Roll 4d6 for each ability, drop the lowest die</li>
            <li>• If total modifiers &lt; {formatModifier(MIN_TOTAL_MODIFIER)} or any score &lt; {MIN_ABILITY_SCORE}, reroll all</li>
            <li>• Results are random - embrace the adventure!</li>
          </ul>
        </div>

        {/* Reroll Warning */}
        {shouldReroll && (
          <div className="p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-2">Reroll Recommended</h4>
            <ul className="text-sm text-yellow-800">
              {reasons.map((reason, index) => (
                <li key={index}>• {reason}</li>
              ))}
            </ul>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={rerollLowScores}
              className="mt-2 border-yellow-400 text-yellow-700 hover:bg-yellow-100"
              disabled={isRolling}
            >
              Reroll All Scores
            </Button>
          </div>
        )}
      </div>

      {/* Main Actions */}
      <div className="flex flex-wrap gap-3">
        <Button 
          onClick={rollAllAbilities}
          disabled={isRolling}
          className="flex items-center gap-2"
        >
          <D6 />
          {isRolling ? 'Rolling...' : 'Roll All Abilities'}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => setShowHistory(!showHistory)}
          disabled={rollHistory.length === 0}
        >
          {showHistory ? 'Hide' : 'Show'} Roll History ({rollHistory.length})
        </Button>
      </div>

      {/* Ability Score Results */}
      <div className="space-y-4">
        {abilities.map(ability => {
          const score = scores[ability]
          const modifier = getModifier(score)
          const isPrimary = primaryAbilities.includes(ability)
          const isSecondary = secondaryAbilities.includes(ability)
          const isCurrentlyRolling = currentlyRolling === ability
          
          // Get latest roll for this ability
          const latestRoll = rollHistory
            .filter(roll => roll.ability === ability)
            .sort((a, b) => b.timestamp - a.timestamp)[0]

          return (
            <Card
              key={ability}
              className={cn(
                "p-4 transition-all duration-300",
                isPrimary && "border-blue-300 bg-blue-25",
                isSecondary && "border-green-300 bg-green-25",
                isCurrentlyRolling && "ring-2 ring-blue-400 bg-blue-50"
              )}
            >
              <div className="flex items-center justify-between">
                {/* Ability Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-foreground">
                      {ABILITY_NAMES[ability]}
                    </h4>
                    {isPrimary && (
                      <Badge variant="default" className="text-xs px-1.5 py-0.5">
                        Primary
                      </Badge>
                    )}
                    {isSecondary && (
                      <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                        Secondary
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {ABILITY_DESCRIPTIONS[ability]}
                  </p>
                </div>

                {/* Dice Display */}
                <div className="flex items-center gap-6">
                  {/* Individual Dice */}
                  {latestRoll && (
                    <div className="flex items-center gap-2">
                      <div className="text-xs text-muted-foreground mr-2">
                        Rolled:
                      </div>
                      {latestRoll.rolls.map((roll, index) => (
                        <AnimatedDie
                          key={index}
                          value={roll}
                          isDropped={roll === latestRoll.dropped}
                          isRolling={isCurrentlyRolling}
                          delay={index * 100}
                        />
                      ))}
                      <div className="text-xs text-muted-foreground ml-2">
                        = {latestRoll.result}
                      </div>
                    </div>
                  )}

                  {/* Score Display */}
                  <div className="text-center min-w-[4rem]">
                    <div className="text-xs text-muted-foreground mb-1">Score</div>
                    <Badge 
                      variant="outline" 
                      className="font-mono font-bold text-xl px-4 py-2"
                    >
                      {isCurrentlyRolling ? '...' : score}
                    </Badge>
                  </div>

                  {/* Modifier */}
                  <div className="text-center min-w-[4rem]">
                    <div className="text-xs text-muted-foreground mb-1">Modifier</div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "font-mono font-bold text-sm px-2 py-1",
                        modifier >= 3 ? "text-green-800 bg-green-100 border-green-400" :
                        modifier >= 1 ? "text-green-700 bg-green-50 border-green-300" :
                        modifier >= 0 ? "text-gray-700 bg-gray-50 border-gray-300" :
                        modifier >= -1 ? "text-orange-700 bg-orange-50 border-orange-300" :
                        "text-red-700 bg-red-50 border-red-300"
                      )}
                    >
                      {formatModifier(modifier)}
                    </Badge>
                  </div>

                  {/* Individual Roll Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => rollSingleAbility(ability)}
                    disabled={isRolling}
                    className="flex items-center gap-1"
                  >
                    <D6 />
                    {isCurrentlyRolling ? 'Rolling...' : 'Reroll'}
                  </Button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Roll History */}
      {showHistory && rollHistory.length > 0 && (
        <Card className="p-4">
          <h4 className="font-medium text-foreground mb-3">Roll History</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {rollHistory
              .sort((a, b) => b.timestamp - a.timestamp)
              .map((roll, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded text-sm">
                  <div className="flex items-center gap-3">
                    <span className="font-medium min-w-[5rem]">
                      {ABILITY_NAMES[roll.ability as AbilityName]}
                    </span>
                    <div className="flex items-center gap-1">
                      {roll.rolls.map((die, dieIndex) => (
                        <Badge
                          key={dieIndex}
                          variant="outline"
                          className={cn(
                            "font-mono text-xs px-1.5 py-0.5",
                            die === roll.dropped && "opacity-50 line-through"
                          )}
                        >
                          {die}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Result:</span>
                    <Badge variant="default" className="font-mono">
                      {roll.result}
                    </Badge>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      )}

      {/* Rolling Tips */}
      <Card className="p-4">
        <h4 className="font-medium text-foreground mb-3">Rolling Strategy</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-medium text-green-700">Good Results:</div>
            <ul className="text-muted-foreground space-y-1">
              <li>• Multiple scores 14+</li>
              <li>• Total modifiers +1 or higher</li>
              <li>• Strong primary abilities</li>
            </ul>
          </div>
          <div>
            <div className="font-medium text-amber-700">Consider Rerolling:</div>
            <ul className="text-muted-foreground space-y-1">
              <li>• Any score below 8</li>
              <li>• Total modifiers below -1</li>
              <li>• All scores below 13</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}