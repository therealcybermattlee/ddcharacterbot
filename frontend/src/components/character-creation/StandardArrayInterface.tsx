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

interface StandardArrayInterfaceProps {
  scores: AbilityScores
  onScoresChange: (scores: AbilityScores) => void
  primaryAbilities?: AbilityName[]
  secondaryAbilities?: AbilityName[]
  className?: string
}

// D&D 5e Standard Array
const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8]

// Drag and drop state
interface DragState {
  draggedScore: number | null
  draggedAbility: AbilityName | null
  dragOverTarget: string | null
}

export function StandardArrayInterface({
  scores,
  onScoresChange,
  primaryAbilities = [],
  secondaryAbilities = [],
  className
}: StandardArrayInterfaceProps) {
  const abilities = Object.keys(ABILITY_NAMES) as AbilityName[]
  
  // Track which scores are assigned
  const [availableScores, setAvailableScores] = useState<number[]>([])
  const [assignments, setAssignments] = useState<{ [key in AbilityName]?: number }>({})
  const [dragState, setDragState] = useState<DragState>({
    draggedScore: null,
    draggedAbility: null,
    dragOverTarget: null
  })

  // Initialize available scores and track assignments
  useEffect(() => {
    const currentScores = Object.values(scores)
    const usedScores = currentScores.filter(score => STANDARD_ARRAY.includes(score))
    const available = STANDARD_ARRAY.filter(score => {
      const usedCount = usedScores.filter(used => used === score).length
      const standardCount = STANDARD_ARRAY.filter(standard => standard === score).length
      return usedCount < standardCount
    })
    
    setAvailableScores(available.sort((a, b) => b - a))
    
    // Update assignments mapping
    const newAssignments: { [key in AbilityName]?: number } = {}
    abilities.forEach(ability => {
      if (STANDARD_ARRAY.includes(scores[ability])) {
        newAssignments[ability] = scores[ability]
      }
    })
    setAssignments(newAssignments)
  }, [scores])

  // Handle score assignment to ability
  const assignScore = (ability: AbilityName, score: number) => {
    if (!availableScores.includes(score) && !assignments[ability]) return
    
    const newScores = { ...scores }
    const newAssignments = { ...assignments }
    
    // If ability already has a score, return it to available pool
    if (assignments[ability]) {
      // Don't change anything if assigning the same score
      if (assignments[ability] === score) return
    }
    
    // Assign the new score
    newScores[ability] = score
    newAssignments[ability] = score
    
    onScoresChange(newScores)
    setAssignments(newAssignments)
  }

  // Handle removing assignment
  const removeAssignment = (ability: AbilityName) => {
    if (!assignments[ability]) return
    
    const newScores = { ...scores }
    const newAssignments = { ...assignments }
    
    newScores[ability] = 10 // Reset to default
    delete newAssignments[ability]
    
    onScoresChange(newScores)
    setAssignments(newAssignments)
  }

  // One-click optimal assignment
  const applyOptimalAssignment = () => {
    if (primaryAbilities.length === 0) return

    const sortedScores = [...STANDARD_ARRAY].sort((a, b) => b - a)
    const newScores = { ...scores }
    const newAssignments: { [key in AbilityName]?: number } = {}
    let scoreIndex = 0

    // Reset all abilities to default
    abilities.forEach(ability => {
      newScores[ability] = 10
    })

    // Assign highest scores to primary abilities
    for (const ability of primaryAbilities) {
      if (scoreIndex < sortedScores.length) {
        newScores[ability] = sortedScores[scoreIndex]
        newAssignments[ability] = sortedScores[scoreIndex]
        scoreIndex++
      }
    }

    // Assign next highest scores to secondary abilities
    for (const ability of secondaryAbilities) {
      if (scoreIndex < sortedScores.length) {
        newScores[ability] = sortedScores[scoreIndex]
        newAssignments[ability] = sortedScores[scoreIndex]
        scoreIndex++
      }
    }

    // Assign remaining scores to unassigned abilities
    const remainingAbilities = abilities.filter(ability => 
      !primaryAbilities.includes(ability) && !secondaryAbilities.includes(ability)
    )
    
    for (const ability of remainingAbilities) {
      if (scoreIndex < sortedScores.length) {
        newScores[ability] = sortedScores[scoreIndex]
        newAssignments[ability] = sortedScores[scoreIndex]
        scoreIndex++
      }
    }

    onScoresChange(newScores)
    setAssignments(newAssignments)
  }

  // Reset all assignments
  const resetAssignments = () => {
    const resetScores = abilities.reduce((acc, ability) => {
      acc[ability] = 10
      return acc
    }, {} as AbilityScores)
    
    onScoresChange(resetScores)
    setAssignments({})
  }

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, score?: number, ability?: AbilityName) => {
    if (score !== undefined) {
      setDragState({ ...dragState, draggedScore: score })
      e.dataTransfer.setData('score', score.toString())
    } else if (ability) {
      setDragState({ ...dragState, draggedAbility: ability })
      e.dataTransfer.setData('ability', ability)
    }
  }

  const handleDragOver = (e: React.DragEvent, target: string) => {
    e.preventDefault()
    setDragState({ ...dragState, dragOverTarget: target })
  }

  const handleDragLeave = () => {
    setDragState({ ...dragState, dragOverTarget: null })
  }

  const handleDrop = (e: React.DragEvent, targetAbility?: AbilityName) => {
    e.preventDefault()
    
    const score = e.dataTransfer.getData('score')
    const sourceAbility = e.dataTransfer.getData('ability')
    
    if (score && targetAbility) {
      assignScore(targetAbility, parseInt(score))
    } else if (sourceAbility && targetAbility && sourceAbility !== targetAbility) {
      // Swap assignments between abilities
      const sourceScore = assignments[sourceAbility as AbilityName]
      const targetScore = assignments[targetAbility]
      
      if (sourceScore || targetScore) {
        const newScores = { ...scores }
        
        if (sourceScore && targetScore) {
          // Swap scores
          newScores[sourceAbility as AbilityName] = targetScore
          newScores[targetAbility] = sourceScore
        } else if (sourceScore) {
          // Move source score to target
          newScores[sourceAbility as AbilityName] = 10
          newScores[targetAbility] = sourceScore
        }
        
        onScoresChange(newScores)
      }
    }
    
    setDragState({ draggedScore: null, draggedAbility: null, dragOverTarget: null })
  }

  const isComplete = availableScores.length === 0
  const assignedCount = Object.keys(assignments).length

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            Standard Array Assignment
          </h3>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Assigned</div>
              <Badge 
                variant={isComplete ? "default" : "secondary"}
                className="font-mono text-lg px-3 py-1"
              >
                {assignedCount}/6
              </Badge>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            Assign the standard array scores [15, 14, 13, 12, 10, 8] to your abilities. 
            Click a score to assign it, or drag and drop to reorder.
          </p>
        </div>

        {isComplete && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-800">
              Great! All scores have been assigned.
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
            onClick={applyOptimalAssignment}
          >
            Optimize for Class
          </Button>
        )}
        
        <Button variant="outline" size="sm" onClick={resetAssignments}>
          Reset All
        </Button>
      </div>

      {/* Available Scores Pool */}
      <Card className="p-4">
        <h4 className="font-medium text-foreground mb-3">Available Scores</h4>
        <div className="flex flex-wrap gap-2">
          {availableScores.length === 0 ? (
            <div className="text-sm text-muted-foreground italic">
              All scores assigned!
            </div>
          ) : (
            availableScores.map((score, index) => (
              <div
                key={`${score}-${index}`}
                draggable
                onDragStart={(e) => handleDragStart(e, score)}
                className={cn(
                  "cursor-grab active:cursor-grabbing transition-all duration-200 hover:scale-105",
                  dragState.draggedScore === score && "opacity-50"
                )}
              >
                <Badge 
                  variant="outline" 
                  className="font-mono text-lg px-4 py-2 border-2 border-blue-300 bg-blue-50 hover:bg-blue-100"
                >
                  {score}
                </Badge>
              </div>
            ))
          )}
        </div>
        
        {availableScores.length > 0 && (
          <p className="text-xs text-muted-foreground mt-2">
            Click a score and then click an ability to assign, or drag and drop.
          </p>
        )}
      </Card>

      {/* Ability Assignment Areas */}
      <div className="space-y-3">
        {abilities.map(ability => {
          const score = scores[ability]
          const assignedScore = assignments[ability]
          const modifier = getModifier(score)
          const isPrimary = primaryAbilities.includes(ability)
          const isSecondary = secondaryAbilities.includes(ability)
          const isDragOver = dragState.dragOverTarget === ability

          return (
            <Card
              key={ability}
              className={cn(
                "p-4 transition-all duration-200",
                isPrimary && "border-blue-300 bg-blue-25",
                isSecondary && "border-green-300 bg-green-25",
                isDragOver && "border-blue-500 bg-blue-100 ring-2 ring-blue-200",
                assignedScore && "border-gray-400"
              )}
              onDragOver={(e) => handleDragOver(e, ability)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, ability)}
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

                {/* Assignment Area */}
                <div className="flex items-center gap-4">
                  {/* Score Assignment */}
                  <div className="flex items-center gap-2">
                    {assignedScore ? (
                      <div
                        draggable
                        onDragStart={(e) => handleDragStart(e, undefined, ability)}
                        className="cursor-grab active:cursor-grabbing"
                      >
                        <Badge 
                          variant="default" 
                          className="font-mono text-xl px-4 py-2 bg-blue-600"
                        >
                          {assignedScore}
                        </Badge>
                      </div>
                    ) : (
                      <div 
                        className={cn(
                          "border-2 border-dashed border-gray-300 rounded-md px-4 py-2 min-w-[4rem] text-center",
                          "transition-colors duration-200",
                          isDragOver && "border-blue-500 bg-blue-50"
                        )}
                      >
                        <span className="text-sm text-muted-foreground">
                          Drop Here
                        </span>
                      </div>
                    )}
                  </div>

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

                  {/* Remove Assignment */}
                  {assignedScore && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAssignment(ability)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Available Score Buttons for Click Assignment */}
      {availableScores.length > 0 && (
        <Card className="p-4">
          <h4 className="font-medium text-foreground mb-3">Quick Assignment</h4>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
            {availableScores.map((score, index) => (
              <div key={`${score}-${index}`} className="text-center">
                <div className="text-xs text-muted-foreground mb-1">
                  Assign {score}
                </div>
                <div className="space-y-1">
                  {abilities
                    .filter(ability => !assignments[ability])
                    .slice(0, 3)
                    .map(ability => (
                      <Button
                        key={ability}
                        variant="outline"
                        size="sm"
                        onClick={() => assignScore(ability, score)}
                        className="w-full text-xs"
                      >
                        {ABILITY_NAMES[ability].slice(0, 3)}
                      </Button>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Standard Array Reference */}
      <Card className="p-4">
        <h4 className="font-medium text-foreground mb-3">Standard Array Reference</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="font-medium">Array:</div>
            <div className="text-muted-foreground font-mono">15, 14, 13, 12, 10, 8</div>
          </div>
          <div>
            <div className="font-medium">Total Modifiers:</div>
            <div className="text-muted-foreground">+1 (balanced)</div>
          </div>
          <div>
            <div className="font-medium">Best For:</div>
            <div className="text-muted-foreground">Quick, fair starts</div>
          </div>
        </div>
      </Card>
    </div>
  )
}