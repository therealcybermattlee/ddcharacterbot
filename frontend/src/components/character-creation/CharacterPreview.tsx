import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, Badge } from '../ui'
import { AbilityTooltip, TraitTooltip, ClassFeatureTooltip } from './FeatureTooltip'
import { cn } from '../../utils/cn'
import { 
  CharacterConcept, 
  AbilityScoreArray, 
  getAbilityModifier, 
  getAbilityScoreWithRacialBonus,
  ABILITY_NAMES, 
  PROFICIENCY_BONUS_BY_LEVEL,
  SKILLS_BY_ABILITY 
} from '../../types/dnd5e'

interface CharacterPreviewProps {
  characterConcept: CharacterConcept
  baseAbilityScores?: AbilityScoreArray
  className?: string
  compact?: boolean
}

export function CharacterPreview({
  characterConcept,
  baseAbilityScores,
  className,
  compact = false
}: CharacterPreviewProps) {
  const { race, class: characterClass, background, level, name } = characterConcept

  // Calculate final ability scores with racial bonuses
  const finalAbilityScores = React.useMemo(() => {
    if (!baseAbilityScores || !race) return null

    const scores: Record<string, number> = {}
    ABILITY_NAMES.forEach(ability => {
      const raceBonus = race.ability_score_increases.find(asi => 
        asi.ability.toLowerCase() === ability.toLowerCase()
      )?.increase || 0
      
      scores[ability] = getAbilityScoreWithRacialBonus(baseAbilityScores[ability], raceBonus)
    })
    
    return scores
  }, [baseAbilityScores, race])

  // Calculate proficiency bonus
  const proficiencyBonus = PROFICIENCY_BONUS_BY_LEVEL[level as keyof typeof PROFICIENCY_BONUS_BY_LEVEL]

  // Collect all proficiencies
  const allProficiencies = React.useMemo(() => {
    const proficiencies: string[] = []
    
    // Race proficiencies
    if (race) {
      race.proficiencies.forEach(prof => {
        if (prof.type === 'skill') {
          proficiencies.push(`${prof.name} (Racial)`)
        }
      })
    }
    
    // Class saving throw proficiencies
    if (characterClass) {
      characterClass.saving_throw_proficiencies.forEach(save => {
        proficiencies.push(`${save} Saving Throw`)
      })
    }
    
    // Background skill proficiencies
    if (background) {
      background.skill_proficiencies.forEach(skill => {
        proficiencies.push(`${skill} (Background)`)
      })
    }
    
    return proficiencies
  }, [race, characterClass, background])

  // Get starting equipment summary
  const startingEquipment = React.useMemo(() => {
    const equipment: string[] = []
    
    if (characterClass) {
      characterClass.starting_equipment.forEach(item => {
        equipment.push(`${item.name} (×${item.quantity})`)
      })
    }
    
    if (background) {
      background.equipment.forEach(item => {
        equipment.push(`${item.name} (×${item.quantity}) [Background]`)
      })
    }
    
    return equipment
  }, [characterClass, background])

  // Get level 1 features
  const level1Features = React.useMemo(() => {
    const features: Array<{ name: string; description: string; source: string; type?: string }> = []
    
    // Racial traits
    if (race) {
      race.traits.forEach(trait => {
        features.push({
          name: trait.name,
          description: trait.description,
          source: 'Racial',
          type: trait.type
        })
      })
    }
    
    // Class features at level 1
    if (characterClass) {
      characterClass.class_features
        .filter(feature => feature.level === 1)
        .forEach(feature => {
          features.push({
            name: feature.name,
            description: feature.description,
            source: 'Class',
            type: feature.type
          })
        })
    }
    
    // Background feature
    if (background) {
      features.push({
        name: background.feature.name,
        description: background.feature.description,
        source: 'Background'
      })
    }
    
    return features
  }, [race, characterClass, background])

  // Calculate estimated AC and HP
  const estimatedStats = React.useMemo(() => {
    if (!finalAbilityScores || !characterClass) return null
    
    // Basic AC calculation (10 + Dex modifier)
    const dexMod = getAbilityModifier(finalAbilityScores.dexterity)
    const baseAC = 10 + dexMod
    
    // Basic HP calculation (class hit die + Con modifier)
    const conMod = getAbilityModifier(finalAbilityScores.constitution)
    const baseHP = characterClass.hit_die + conMod
    
    return { ac: baseAC, hp: baseHP }
  }, [finalAbilityScores, characterClass])

  if (!name && !race && !characterClass && !background) {
    return (
      <Card className={cn("opacity-50", className)}>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            Select character options to see a preview
          </p>
        </CardContent>
      </Card>
    )
  }

  if (compact) {
    return (
      <Card className={cn("border-primary/20 bg-primary/5", className)}>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Character Avatar */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/30 flex items-center justify-center font-bold text-primary">
              {name ? name.charAt(0).toUpperCase() : '?'}
            </div>
            
            {/* Basic Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">
                {name || 'Unnamed Character'}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                Level {level} {race?.name || '?'} {characterClass?.name || '?'}
                {background && ` • ${background.name}`}
              </p>
            </div>
            
            {/* Quick Stats */}
            {estimatedStats && (
              <div className="flex gap-2 text-xs">
                <Badge variant="outline">AC {estimatedStats.ac}</Badge>
                <Badge variant="outline">HP {estimatedStats.hp}</Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Character Header */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            {/* Character Avatar */}
            <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center font-bold text-2xl text-primary flex-shrink-0">
              {name ? name.charAt(0).toUpperCase() : '?'}
            </div>
            
            {/* Basic Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {name || 'Unnamed Character'}
              </h2>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant="default" className="text-sm">
                  Level {level}
                </Badge>
                {race && (
                  <Badge variant="secondary" className="text-sm">
                    {race.name}
                  </Badge>
                )}
                {characterClass && (
                  <Badge variant="outline" className="text-sm">
                    {characterClass.name}
                  </Badge>
                )}
                {background && (
                  <Badge variant="ghost" className="text-sm">
                    {background.name}
                  </Badge>
                )}
              </div>
              
              {/* Character Description */}
              <p className="text-sm text-muted-foreground">
                {race && characterClass && (
                  `A ${race.name.toLowerCase()} ${characterClass.name.toLowerCase()} `
                )}
                {background && (
                  `with a ${background.name.toLowerCase()} background, `
                )}
                {race && characterClass && background ? (
                  `shaped by ${background.description.toLowerCase().slice(0, 100)}...`
                ) : (
                  'Still taking shape...'
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ability Scores */}
      {finalAbilityScores && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ability Scores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {ABILITY_NAMES.map(ability => {
                const score = finalAbilityScores[ability]
                const modifier = getAbilityModifier(score)
                const raceBonus = race?.ability_score_increases.find(asi => 
                  asi.ability.toLowerCase() === ability.toLowerCase()
                )?.increase || 0
                
                return (
                  <div key={ability} className="text-center">
                    <h4 className="text-sm font-medium text-foreground capitalize mb-1">
                      {ability}
                    </h4>
                    <div className="flex items-center justify-center gap-2">
                      <div className="text-2xl font-bold text-foreground">
                        {score}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        ({modifier >= 0 ? '+' : ''}{modifier})
                      </div>
                      {raceBonus > 0 && (
                        <AbilityTooltip ability={ability} increase={raceBonus}>
                          <Badge variant="secondary" size="sm" className="cursor-help">
                            +{raceBonus}
                          </Badge>
                        </AbilityTooltip>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Combat Stats */}
      {estimatedStats && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Combat Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <h4 className="text-sm font-medium text-foreground mb-1">Armor Class</h4>
                <div className="text-2xl font-bold text-foreground">{estimatedStats.ac}</div>
                <div className="text-xs text-muted-foreground">10 + Dex mod</div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground mb-1">Hit Points</h4>
                <div className="text-2xl font-bold text-foreground">{estimatedStats.hp}</div>
                <div className="text-xs text-muted-foreground">d{characterClass?.hit_die} + Con mod</div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground mb-1">Prof. Bonus</h4>
                <div className="text-2xl font-bold text-foreground">+{proficiencyBonus}</div>
                <div className="text-xs text-muted-foreground">Level {level}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Proficiencies */}
      {allProficiencies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Proficiencies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-1">
                {allProficiencies.map((prof, index) => (
                  <Badge key={index} variant="outline" size="sm">
                    {prof}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Add +{proficiencyBonus} to proficient skills and saving throws
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Features and Traits */}
      {level1Features.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Features & Traits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {level1Features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-md">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-foreground text-sm">
                        {feature.name}
                      </h4>
                      <Badge variant="ghost" size="sm">
                        {feature.source}
                      </Badge>
                      {feature.type && (
                        <Badge variant="outline" size="sm">
                          {feature.type}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Starting Equipment */}
      {startingEquipment.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Starting Equipment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {startingEquipment.slice(0, 8).map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
              {startingEquipment.length > 8 && (
                <p className="text-xs text-muted-foreground italic">
                  ...and {startingEquipment.length - 8} more items
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Character Concept Summary */}
      {race && characterClass && background && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              💡 Character Concept
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-amber-900 leading-relaxed">
              <strong>{name || 'This character'}</strong> combines the {' '}
              <span className="font-medium">{race.traits[0]?.name || 'natural traits'}</span> of the {race.name} people 
              with the <span className="font-medium">{characterClass.class_features.find(f => f.level === 1)?.name || 'skills'}</span> of a {characterClass.name.toLowerCase()}.
              Their {background.name.toLowerCase()} background provides {' '}
              <span className="font-medium">{background.feature.name}</span>, making them uniquely suited for 
              adventures that require both {characterClass.primary_abilities.join(' and ').toLowerCase()} and 
              practical experience from their past.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}