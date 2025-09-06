import React from 'react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Dice, D6 } from '../ui/dice'
import { cn } from '../../utils/cn'

type GenerationMethod = 'standard' | 'pointBuy' | 'rolled'

interface MethodInfo {
  id: GenerationMethod
  name: string
  description: string
  pros: string[]
  cons: string[]
  difficulty: 'Easy' | 'Medium' | 'Hard'
  timeEstimate: string
  icon: React.ReactNode
  recommended: boolean
}

interface MethodSelectorProps {
  selectedMethod: GenerationMethod
  onMethodSelect: (method: GenerationMethod) => void
  recommendedMethod?: GenerationMethod
  playerExperience?: 'new' | 'experienced' | 'expert'
  selectedClass?: string
  className?: string
}

// Get method recommendations based on player experience and class
function getMethodRecommendations(
  playerExperience: string = 'new',
  selectedClass?: string
): { primary: GenerationMethod; alternatives: GenerationMethod[] } {
  switch (playerExperience) {
    case 'new':
      return {
        primary: 'standard',
        alternatives: ['pointBuy']
      }
    case 'experienced':
      return {
        primary: 'pointBuy',
        alternatives: ['standard', 'rolled']
      }
    case 'expert':
      return {
        primary: 'rolled',
        alternatives: ['pointBuy', 'standard']
      }
    default:
      return {
        primary: 'standard',
        alternatives: ['pointBuy']
      }
  }
}

// Class-specific ability priority hints
const CLASS_ABILITIES = {
  'fighter': { primary: ['strength', 'dexterity'], secondary: ['constitution'] },
  'wizard': { primary: ['intelligence'], secondary: ['dexterity', 'constitution'] },
  'rogue': { primary: ['dexterity'], secondary: ['constitution', 'charisma'] },
  'cleric': { primary: ['wisdom'], secondary: ['strength', 'constitution'] },
  'barbarian': { primary: ['strength'], secondary: ['constitution', 'dexterity'] },
  'bard': { primary: ['charisma'], secondary: ['dexterity', 'constitution'] },
  'druid': { primary: ['wisdom'], secondary: ['dexterity', 'constitution'] },
  'monk': { primary: ['dexterity', 'wisdom'], secondary: ['constitution'] },
  'paladin': { primary: ['strength', 'charisma'], secondary: ['constitution'] },
  'ranger': { primary: ['dexterity'], secondary: ['wisdom', 'constitution'] },
  'sorcerer': { primary: ['charisma'], secondary: ['dexterity', 'constitution'] },
  'warlock': { primary: ['charisma'], secondary: ['dexterity', 'constitution'] }
} as const

export function MethodSelector({
  selectedMethod,
  onMethodSelect,
  playerExperience = 'new',
  selectedClass,
  className
}: MethodSelectorProps) {
  const recommendations = getMethodRecommendations(playerExperience, selectedClass)
  const classAbilities = selectedClass ? CLASS_ABILITIES[selectedClass.toLowerCase() as keyof typeof CLASS_ABILITIES] : null

  const methods: MethodInfo[] = [
    {
      id: 'standard',
      name: 'Standard Array',
      description: 'Use the predefined array of scores: 15, 14, 13, 12, 10, 8',
      pros: [
        'Quick and simple',
        'Balanced and fair',
        'Perfect for beginners',
        'Consistent power level'
      ],
      cons: [
        'No randomness or surprise',
        'Limited customization',
        'May feel restrictive'
      ],
      difficulty: 'Easy',
      timeEstimate: '2 minutes',
      icon: <div className="text-2xl">📊</div>,
      recommended: recommendations.primary === 'standard'
    },
    {
      id: 'pointBuy',
      name: 'Point Buy',
      description: 'Spend 27 points to customize your ability scores (8-15 before racial bonuses)',
      pros: [
        'Full customization',
        'Balanced power level',
        'Optimize for your class',
        'Strategic decisions'
      ],
      cons: [
        'More complex',
        'Takes more time',
        'Can be overwhelming'
      ],
      difficulty: 'Medium',
      timeEstimate: '5-10 minutes',
      icon: <div className="text-2xl">⚖️</div>,
      recommended: recommendations.primary === 'pointBuy'
    },
    {
      id: 'rolled',
      name: 'Roll Dice',
      description: 'Roll 4d6, drop the lowest for each ability score (traditional method)',
      pros: [
        'Classic D&D experience',
        'Exciting and unpredictable',
        'Potential for high scores',
        'Authentic randomness'
      ],
      cons: [
        'Can be unbalanced',
        'May get poor results',
        'Not tournament legal',
        'Luck-dependent'
      ],
      difficulty: 'Hard',
      timeEstimate: '3-5 minutes',
      icon: <D6 />,
      recommended: recommendations.primary === 'rolled'
    }
  ]

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header with recommendations */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">
          Choose Your Ability Score Generation Method
        </h2>
        
        {recommendations.primary && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="text-xs">
                Recommended
              </Badge>
              <span className="text-sm font-medium text-blue-900">
                {methods.find(m => m.id === recommendations.primary)?.name}
              </span>
              <span className="text-sm text-blue-700">
                - Best choice for {playerExperience} players
              </span>
            </div>
          </div>
        )}

        {/* Class-specific hint */}
        {selectedClass && classAbilities && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-sm">
              <span className="font-medium text-green-900">
                {selectedClass} Focus:
              </span>
              <span className="text-green-700 ml-2">
                Prioritize {classAbilities.primary.map(ability => 
                  ability.charAt(0).toUpperCase() + ability.slice(1)
                ).join(' and ')}
                {classAbilities.secondary.length > 0 && (
                  <span>, then {classAbilities.secondary.map(ability => 
                    ability.charAt(0).toUpperCase() + ability.slice(1)
                  ).join(', ')}</span>
                )}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Method Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {methods.map(method => (
          <Card
            key={method.id}
            className={cn(
              "relative p-6 cursor-pointer transition-all duration-200 hover:shadow-md",
              selectedMethod === method.id && "ring-2 ring-blue-500 border-blue-300 bg-blue-25",
              method.recommended && selectedMethod !== method.id && "border-blue-200 bg-blue-10"
            )}
            onClick={() => onMethodSelect(method.id)}
          >
            {/* Recommendation badge */}
            {method.recommended && (
              <Badge 
                variant="default" 
                className="absolute -top-2 -right-2 text-xs px-2 py-1"
              >
                Recommended
              </Badge>
            )}

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0">
                {method.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">
                  {method.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-xs",
                      method.difficulty === 'Easy' && "bg-green-50 text-green-700 border-green-300",
                      method.difficulty === 'Medium' && "bg-yellow-50 text-yellow-700 border-yellow-300",
                      method.difficulty === 'Hard' && "bg-red-50 text-red-700 border-red-300"
                    )}
                  >
                    {method.difficulty}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {method.timeEstimate}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground mb-4">
              {method.description}
            </p>

            {/* Pros and Cons */}
            <div className="space-y-3">
              {/* Pros */}
              <div>
                <h4 className="text-xs font-medium text-green-700 mb-1">
                  ADVANTAGES
                </h4>
                <ul className="space-y-1">
                  {method.pros.slice(0, 2).map((pro, index) => (
                    <li key={index} className="text-xs text-green-600 flex items-center gap-1">
                      <span className="w-1 h-1 bg-green-500 rounded-full flex-shrink-0" />
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div>
                <h4 className="text-xs font-medium text-red-700 mb-1">
                  CONSIDERATIONS
                </h4>
                <ul className="space-y-1">
                  {method.cons.slice(0, 2).map((con, index) => (
                    <li key={index} className="text-xs text-red-600 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full flex-shrink-0" />
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Selection Button */}
            <Button
              variant={selectedMethod === method.id ? "default" : "outline"}
              className="w-full mt-4"
              onClick={(e) => {
                e.stopPropagation()
                onMethodSelect(method.id)
              }}
            >
              {selectedMethod === method.id ? 'Selected' : `Choose ${method.name}`}
            </Button>
          </Card>
        ))}
      </div>

      {/* Additional Information */}
      <div className="p-4 bg-muted/50 rounded-lg">
        <h4 className="font-medium text-foreground mb-2">
          What are Ability Scores?
        </h4>
        <p className="text-sm text-muted-foreground">
          Ability scores determine your character's basic capabilities. Each score ranges from 3-20 and 
          provides a modifier that affects rolls. Higher scores mean better modifiers. Racial bonuses 
          are added after choosing your generation method.
        </p>
      </div>
    </div>
  )
}

// Quick method comparison component
interface MethodComparisonProps {
  className?: string
}

export function MethodComparison({ className }: MethodComparisonProps) {
  return (
    <Card className={cn("p-4", className)}>
      <h4 className="font-medium text-foreground mb-3">
        Quick Comparison
      </h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Method</th>
              <th className="text-left p-2">Power Level</th>
              <th className="text-left p-2">Customization</th>
              <th className="text-left p-2">Time</th>
              <th className="text-left p-2">Best For</th>
            </tr>
          </thead>
          <tbody className="text-xs">
            <tr className="border-b">
              <td className="p-2 font-medium">Standard Array</td>
              <td className="p-2">Balanced</td>
              <td className="p-2">Low</td>
              <td className="p-2">Fast</td>
              <td className="p-2">New players</td>
            </tr>
            <tr className="border-b">
              <td className="p-2 font-medium">Point Buy</td>
              <td className="p-2">Balanced</td>
              <td className="p-2">High</td>
              <td className="p-2">Medium</td>
              <td className="p-2">Optimization</td>
            </tr>
            <tr>
              <td className="p-2 font-medium">Roll Dice</td>
              <td className="p-2">Variable</td>
              <td className="p-2">None</td>
              <td className="p-2">Fast</td>
              <td className="p-2">Adventure</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  )
}