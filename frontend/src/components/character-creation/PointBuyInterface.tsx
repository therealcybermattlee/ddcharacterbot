import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Card } from '../ui/card'
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

interface PointBuyInterfaceProps {
  scores: AbilityScores
  onScoresChange: (scores: AbilityScores) => void
  primaryAbilities?: AbilityName[]
  secondaryAbilities?: AbilityName[]
  className?: string
}

// D&D 5e Point Buy System Constants
const STARTING_POINTS = 27
const BASE_SCORE = 8
const MIN_SCORE = 8
const MAX_SCORE = 15 // Before racial bonuses

// Point costs for increasing ability scores in D&D 5e point buy
// From base 8: 8->9(0), 9->10(1), 10->11(1), 11->12(1), 12->13(1), 13->14(2), 14->15(2)
const POINT_COSTS: { [key: number]: number } = {
  8: 0,   // Base cost
  9: 1,   // +1 point
  10: 2,  // +2 points total
  11: 3,  // +3 points total
  12: 4,  // +4 points total
  13: 5,  // +5 points total
  14: 7,  // +7 points total (costs 2 points for 13->14)
  15: 9   // +9 points total (costs 2 points for 14->15)
}

// Calculate cost increase for going from one score to another
function getCostIncrease(fromScore: number, toScore: number): number {
  if (toScore < MIN_SCORE || toScore > MAX_SCORE) return Infinity
  return POINT_COSTS[toScore] - POINT_COSTS[fromScore]
}

// Calculate total points used for all abilities
function calculateTotalPointsUsed(scores: AbilityScores): number {
  return Object.values(scores).reduce((total, score) => {
    return total + POINT_COSTS[score]
  }, 0)
}

// Get optimization suggestions for a specific class
function getOptimizationSuggestions(
  primaryAbilities: AbilityName[] = [],
  secondaryAbilities: AbilityName[] = [],
  availablePoints: number
): { ability: AbilityName; currentScore: number; suggestedScore: number; reason: string }[] {
  const suggestions = []
  
  // Prioritize getting primary abilities to 15
  for (const ability of primaryAbilities) {
    if (availablePoints >= 9) {
      suggestions.push({
        ability,
        currentScore: 8,
        suggestedScore: 15,
        reason: 'Primary ability - maximize for best performance'
      })
    } else if (availablePoints >= 7) {
      suggestions.push({
        ability,
        currentScore: 8,
        suggestedScore: 14,
        reason: 'Primary ability - strong foundation'
      })
    }
  }
  
  return suggestions
}

export function PointBuyInterface({
  scores,
  onScoresChange,
  primaryAbilities = [],
  secondaryAbilities = [],
  className
}: PointBuyInterfaceProps) {
  const abilities = Object.keys(ABILITY_NAMES) as AbilityName[]
  const pointsUsed = calculateTotalPointsUsed(scores)
  const pointsRemaining = STARTING_POINTS - pointsUsed
  
  // State for showing optimization suggestions
  const [showOptimization, setShowOptimization] = useState(false)
  const [optimizationApplied, setOptimizationApplied] = useState(false)

  // Handle ability score changes
  const handleScoreChange = (ability: AbilityName, newScore: number) => {
    if (newScore < MIN_SCORE || newScore > MAX_SCORE) return
    
    const currentScore = scores[ability]
    const costChange = getCostIncrease(currentScore, newScore)
    
    // Check if we have enough points
    if (costChange > pointsRemaining && newScore > currentScore) return
    
    onScoresChange({
      ...scores,
      [ability]: newScore
    })
    
    setOptimizationApplied(false) // Reset optimization flag when manually changing
  }

  // One-click optimization for class
  const applyOptimalDistribution = () => {
    if (primaryAbilities.length === 0) return

    let newScores = { ...scores }
    let remainingPoints = STARTING_POINTS

    // Reset all to base
    abilities.forEach(ability => {
      newScores[ability] = BASE_SCORE
    })

    // Prioritize primary abilities to 15
    for (const ability of primaryAbilities) {
      if (remainingPoints >= POINT_COSTS[15]) {
        newScores[ability] = 15
        remainingPoints -= POINT_COSTS[15]
      } else if (remainingPoints >= POINT_COSTS[14]) {
        newScores[ability] = 14
        remainingPoints -= POINT_COSTS[14]
      }
    }

    // Distribute remaining points to secondary abilities
    for (const ability of secondaryAbilities) {
      if (remainingPoints >= POINT_COSTS[14]) {
        newScores[ability] = 14
        remainingPoints -= POINT_COSTS[14]
      } else if (remainingPoints >= POINT_COSTS[13]) {
        newScores[ability] = 13
        remainingPoints -= POINT_COSTS[13]
      } else if (remainingPoints >= POINT_COSTS[12]) {
        newScores[ability] = 12
        remainingPoints -= POINT_COSTS[12]
      }
    }

    // Spend any remaining points on the lowest scores
    while (remainingPoints > 0) {
      const lowestAbility = abilities.reduce((lowest, current) => 
        newScores[current] < newScores[lowest] ? current : lowest
      )
      
      if (newScores[lowestAbility] >= MAX_SCORE) break
      
      const nextScore = newScores[lowestAbility] + 1
      const cost = getCostIncrease(newScores[lowestAbility], nextScore)
      
      if (cost <= remainingPoints) {
        newScores[lowestAbility] = nextScore
        remainingPoints -= cost
      } else {
        break
      }
    }

    onScoresChange(newScores)
    setOptimizationApplied(true)
  }

  // Reset to base scores
  const resetScores = () => {
    const baseScores = abilities.reduce((acc, ability) => {
      acc[ability] = BASE_SCORE
      return acc
    }, {} as AbilityScores)
    
    onScoresChange(baseScores)
    setOptimizationApplied(false)
  }

  // Validation state
  const isValid = pointsRemaining >= 0
  const isComplete = pointsRemaining === 0

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header with points remaining */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            Point Buy System
          </h3>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Points Remaining</div>
              <Badge 
                variant={isComplete ? "default" : pointsRemaining < 0 ? "destructive" : "secondary"}
                className="font-mono text-lg px-3 py-1"
              >
                {pointsRemaining}
              </Badge>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              isComplete ? "bg-green-500" : pointsRemaining < 0 ? "bg-red-500" : "bg-blue-500"
            )}
            style={{ width: `${Math.min(100, (pointsUsed / STARTING_POINTS) * 100)}%` }}
          />
        </div>

        {/* Status messages */}
        {pointsRemaining < 0 && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">
              You've exceeded your point budget by {Math.abs(pointsRemaining)} points. 
              Please reduce some ability scores.
            </p>
          </div>
        )}

        {isComplete && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-800">
              Perfect! You've used all {STARTING_POINTS} points.
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        {primaryAbilities.length > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={applyOptimalDistribution}
            disabled={optimizationApplied}
          >
            {optimizationApplied ? 'Optimized!' : 'Optimize for Class'}
          </Button>
        )}
        
        <Button variant="outline" size="sm" onClick={resetScores}>
          Reset All to 8
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowOptimization(!showOptimization)}
        >
          {showOptimization ? 'Hide' : 'Show'} Tips
        </Button>
      </div>

      {/* Optimization Tips */}
      {showOptimization && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">Point Buy Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Start with 8 in all abilities (0 points each)</li>
            <li>• Scores 8-13 cost 1 point per increase</li>
            <li>• Scores 14-15 cost 2 points per increase</li>
            <li>• Focus on primary abilities for your class first</li>
            <li>• Constitution affects hit points - don't neglect it</li>
            <li>• You can't go above 15 before racial bonuses</li>
          </ul>
        </Card>
      )}

      {/* Ability Score Controls */}
      <div className="space-y-4">
        {abilities.map(ability => {
          const score = scores[ability]
          const modifier = getModifier(score)
          const isPrimary = primaryAbilities.includes(ability)
          const isSecondary = secondaryAbilities.includes(ability)
          const pointCost = POINT_COSTS[score]
          
          // Can we increase/decrease?
          const canIncrease = score < MAX_SCORE && getCostIncrease(score, score + 1) <= pointsRemaining
          const canDecrease = score > MIN_SCORE

          return (
            <Card
              key={ability}
              className={cn(
                "p-4",
                isPrimary && "border-blue-300 bg-blue-25",
                isSecondary && "border-green-300 bg-green-25"
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

                {/* Controls */}
                <div className="flex items-center gap-4">
                  {/* Point cost */}
                  <div className="text-center min-w-[3rem]">
                    <div className="text-xs text-muted-foreground">Cost</div>
                    <div className="font-mono text-sm">
                      {pointCost} pts
                    </div>
                  </div>

                  {/* Decrease button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleScoreChange(ability, score - 1)}
                    disabled={!canDecrease}
                    className="w-8 h-8 p-0"
                  >
                    -
                  </Button>

                  {/* Score display */}
                  <div className="text-center min-w-[4rem]">
                    <div className="font-mono font-bold text-xl">
                      {score}
                    </div>
                  </div>

                  {/* Increase button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleScoreChange(ability, score + 1)}
                    disabled={!canIncrease}
                    className="w-8 h-8 p-0"
                  >
                    +
                  </Button>

                  {/* Modifier */}
                  <div className="text-center min-w-[4rem]">
                    <div className="text-xs text-muted-foreground mb-1">Modifier</div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "font-mono font-bold text-sm px-2 py-1",
                        modifier >= 2 ? "text-green-700 bg-green-50 border-green-300" :
                        modifier >= 0 ? "text-gray-700 bg-gray-50 border-gray-300" :
                        "text-red-700 bg-red-50 border-red-300"
                      )}
                    >
                      {formatModifier(modifier)}
                    </Badge>
                  </div>

                  {/* Next cost indicator */}
                  {score < MAX_SCORE && (
                    <div className="text-center min-w-[3rem]">
                      <div className="text-xs text-muted-foreground">Next</div>
                      <div className="font-mono text-sm">
                        +{getCostIncrease(score, score + 1)} pts
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Point Buy Rules Reference */}
      <Card className="p-4">
        <h4 className="font-medium text-foreground mb-3">D&D 5e Point Buy Rules</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="font-medium">Total Points:</div>
            <div className="text-muted-foreground">27 points</div>
          </div>
          <div>
            <div className="font-medium">Score Range:</div>
            <div className="text-muted-foreground">8-15</div>
          </div>
          <div>
            <div className="font-medium">Standard Costs:</div>
            <div className="text-muted-foreground">8-13 → 1pt each</div>
          </div>
          <div>
            <div className="font-medium">Premium Costs:</div>
            <div className="text-muted-foreground">14-15 → 2pts each</div>
          </div>
        </div>
      </Card>
    </div>
  )
}