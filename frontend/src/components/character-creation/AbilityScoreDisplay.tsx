import React from 'react'
import { Badge } from '../ui/badge'
import { Card } from '../ui/card'
import { cn } from '../../utils/cn'

// D&D 5e ability names and descriptions
export const ABILITY_NAMES = {
  strength: 'Strength',
  dexterity: 'Dexterity',
  constitution: 'Constitution',
  intelligence: 'Intelligence',
  wisdom: 'Wisdom',
  charisma: 'Charisma'
} as const

export const ABILITY_DESCRIPTIONS = {
  strength: 'Physical power, melee attacks, carrying capacity',
  dexterity: 'Agility, ranged attacks, armor class, stealth',
  constitution: 'Health, hit points, stamina, fortitude',
  intelligence: 'Reasoning, memory, knowledge skills',
  wisdom: 'Awareness, insight, perception, willpower',
  charisma: 'Force of personality, social skills, magic'
} as const

export const ABILITY_SHORT_NAMES = {
  strength: 'STR',
  dexterity: 'DEX',
  constitution: 'CON',
  intelligence: 'INT',
  wisdom: 'WIS',
  charisma: 'CHA'
} as const

type AbilityName = keyof typeof ABILITY_NAMES

interface AbilityScores {
  strength: number
  dexterity: number
  constitution: number
  intelligence: number
  wisdom: number
  charisma: number
}

interface RacialBonuses {
  strength?: number
  dexterity?: number
  constitution?: number
  intelligence?: number
  wisdom?: number
  charisma?: number
}

interface AbilityScoreDisplayProps {
  baseScores: AbilityScores
  racialBonuses?: RacialBonuses
  className?: string
  showDetailedView?: boolean
  primaryAbilities?: AbilityName[]
  secondaryAbilities?: AbilityName[]
  onAbilityClick?: (ability: AbilityName) => void
}

// Calculate modifier from ability score
export function getModifier(score: number): number {
  return Math.floor((score - 10) / 2)
}

// Format modifier with proper sign
export function formatModifier(modifier: number): string {
  return modifier >= 0 ? `+${modifier}` : `${modifier}`
}

// Get modifier color class based on value
function getModifierColorClass(modifier: number): string {
  if (modifier >= 4) return 'text-green-800 bg-green-100 border-green-300'
  if (modifier >= 2) return 'text-green-700 bg-green-50 border-green-200'
  if (modifier >= 1) return 'text-green-600 bg-green-25 border-green-100'
  if (modifier === 0) return 'text-gray-600 bg-gray-50 border-gray-200'
  if (modifier >= -1) return 'text-orange-600 bg-orange-50 border-orange-200'
  if (modifier >= -2) return 'text-red-600 bg-red-50 border-red-200'
  return 'text-red-700 bg-red-100 border-red-300'
}

// Get ability importance indicator
function getAbilityImportance(ability: AbilityName, primary?: AbilityName[], secondary?: AbilityName[]): 'primary' | 'secondary' | null {
  if (primary?.includes(ability)) return 'primary'
  if (secondary?.includes(ability)) return 'secondary'
  return null
}

export function AbilityScoreDisplay({
  baseScores,
  racialBonuses = {},
  className,
  showDetailedView = true,
  primaryAbilities = [],
  secondaryAbilities = [],
  onAbilityClick
}: AbilityScoreDisplayProps) {
  const abilities = Object.keys(ABILITY_NAMES) as AbilityName[]

  // Calculate final scores with racial bonuses
  const finalScores = abilities.reduce((acc, ability) => {
    acc[ability] = baseScores[ability] + (racialBonuses[ability] || 0)
    return acc
  }, {} as AbilityScores)

  if (showDetailedView) {
    return (
      <div className={cn("space-y-3", className)}>
        {abilities.map(ability => {
          const baseScore = baseScores[ability]
          const racialBonus = racialBonuses[ability] || 0
          const finalScore = finalScores[ability]
          const modifier = getModifier(finalScore)
          const importance = getAbilityImportance(ability, primaryAbilities, secondaryAbilities)
          
          return (
            <Card
              key={ability}
              className={cn(
                "p-4 transition-colors cursor-pointer hover:bg-accent/50",
                importance === 'primary' && "border-blue-300 bg-blue-25",
                importance === 'secondary' && "border-green-300 bg-green-25",
                onAbilityClick && "cursor-pointer"
              )}
              onClick={() => onAbilityClick?.(ability)}
            >
              <div className="flex items-center justify-between">
                {/* Ability Name and Description */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-foreground">
                      {ABILITY_NAMES[ability]}
                    </h4>
                    {importance === 'primary' && (
                      <Badge variant="default" className="text-xs px-1.5 py-0.5">
                        Primary
                      </Badge>
                    )}
                    {importance === 'secondary' && (
                      <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                        Secondary
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {ABILITY_DESCRIPTIONS[ability]}
                  </p>
                </div>

                {/* Score Breakdown */}
                <div className="flex items-center gap-4">
                  {/* Base Score */}
                  <div className="text-center min-w-[3rem]">
                    <div className="text-sm text-muted-foreground">Base</div>
                    <div className="font-mono font-medium text-lg">
                      {baseScore}
                    </div>
                  </div>

                  {/* Racial Bonus */}
                  {racialBonus > 0 && (
                    <>
                      <div className="text-muted-foreground">+</div>
                      <div className="text-center min-w-[3rem]">
                        <div className="text-sm text-muted-foreground">Racial</div>
                        <div className="font-mono font-medium text-lg text-blue-600">
                          +{racialBonus}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Final Score */}
                  <div className="text-center min-w-[3rem]">
                    <div className="text-sm text-muted-foreground">Total</div>
                    <div className="font-mono font-bold text-xl">
                      {finalScore}
                    </div>
                  </div>

                  {/* Modifier */}
                  <div className="text-center min-w-[4rem]">
                    <div className="text-sm text-muted-foreground">Modifier</div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "font-mono font-bold text-base px-3 py-1 border-2",
                        getModifierColorClass(modifier)
                      )}
                    >
                      {formatModifier(modifier)}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    )
  }

  // Compact view for smaller spaces
  return (
    <div className={cn("grid grid-cols-2 sm:grid-cols-3 gap-3", className)}>
      {abilities.map(ability => {
        const finalScore = finalScores[ability]
        const modifier = getModifier(finalScore)
        const importance = getAbilityImportance(ability, primaryAbilities, secondaryAbilities)

        return (
          <Card
            key={ability}
            className={cn(
              "p-3 text-center transition-colors",
              importance === 'primary' && "border-blue-300 bg-blue-25",
              importance === 'secondary' && "border-green-300 bg-green-25",
              onAbilityClick && "cursor-pointer hover:bg-accent/50"
            )}
            onClick={() => onAbilityClick?.(ability)}
          >
            <div className="space-y-2">
              {/* Ability name */}
              <div className="text-sm font-medium text-foreground">
                {ABILITY_SHORT_NAMES[ability]}
              </div>

              {/* Score */}
              <div className="font-mono font-bold text-2xl">
                {finalScore}
              </div>

              {/* Modifier */}
              <Badge
                variant="outline"
                className={cn(
                  "font-mono text-sm px-2 py-0.5 border",
                  getModifierColorClass(modifier)
                )}
              >
                {formatModifier(modifier)}
              </Badge>

              {/* Importance indicator */}
              {importance && (
                <div className="text-xs">
                  {importance === 'primary' && (
                    <Badge variant="default" className="text-xs px-1 py-0">
                      1°
                    </Badge>
                  )}
                  {importance === 'secondary' && (
                    <Badge variant="secondary" className="text-xs px-1 py-0">
                      2°
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </Card>
        )
      })}
    </div>
  )
}

// Summary component for quick stats overview
interface AbilityScoreSummaryProps {
  baseScores: AbilityScores
  racialBonuses?: RacialBonuses
  className?: string
}

export function AbilityScoreSummary({
  baseScores,
  racialBonuses = {},
  className
}: AbilityScoreSummaryProps) {
  const abilities = Object.keys(ABILITY_NAMES) as AbilityName[]
  
  const finalScores = abilities.reduce((acc, ability) => {
    acc[ability] = baseScores[ability] + (racialBonuses[ability] || 0)
    return acc
  }, {} as AbilityScores)

  const totalScore = abilities.reduce((sum, ability) => sum + finalScores[ability], 0)
  const totalModifiers = abilities.reduce((sum, ability) => sum + getModifier(finalScores[ability]), 0)
  const highestScore = Math.max(...abilities.map(ability => finalScores[ability]))
  const lowestScore = Math.min(...abilities.map(ability => finalScores[ability]))
  
  return (
    <Card className={cn("p-4", className)}>
      <h4 className="font-medium text-foreground mb-3">Ability Summary</h4>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Total Score:</span>
          <span className="font-medium font-mono">{totalScore}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Total Modifiers:</span>
          <span className="font-medium font-mono">{formatModifier(totalModifiers)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Highest:</span>
          <span className="font-medium font-mono">{highestScore}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Lowest:</span>
          <span className="font-medium font-mono">{lowestScore}</span>
        </div>
      </div>
    </Card>
  )
}