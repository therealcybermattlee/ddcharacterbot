import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Input } from '../ui'
import { FeatureTooltip, AbilityTooltip, TraitTooltip } from './FeatureTooltip'
import { cn } from '../../utils/cn'
import { Race, RaceSelectionState, ABILITY_NAMES, AbilityScoreArray } from '../../types/dnd5e'
import { filterRacesByAbility, filterRacesBySize, searchRaces } from '../../services/dnd5eApi'

interface RaceSelectorProps {
  races: Race[]
  selectedRace?: Race
  onRaceSelect: (race: Race) => void
  baseAbilityScores?: AbilityScoreArray
  loading?: boolean
  className?: string
}

export function RaceSelector({
  races,
  selectedRace,
  onRaceSelect,
  baseAbilityScores,
  loading = false,
  className
}: RaceSelectorProps) {
  const [state, setState] = useState<RaceSelectionState>({
    searchQuery: '',
    filterBy: 'all',
    comparisonRace: undefined
  })

  // Filter and search races
  const filteredRaces = useMemo(() => {
    let filtered = races

    // Apply search
    if (state.searchQuery) {
      filtered = searchRaces(filtered, state.searchQuery)
    }

    // Apply filters
    switch (state.filterBy) {
      case 'size':
        // For demo, filter by Medium vs Small
        filtered = filtered.filter(race => race.size === 'Medium' || race.size === 'Small')
        break
      case 'abilities':
        // Show races with +2 ability bonuses
        filtered = filtered.filter(race => 
          race.ability_score_increases.some(asi => asi.increase >= 2)
        )
        break
      default:
        // All races
        break
    }

    return filtered
  }, [races, state.searchQuery, state.filterBy])

  const handleCompare = (race: Race) => {
    setState(prev => ({
      ...prev,
      comparisonRace: prev.comparisonRace?.id === race.id ? undefined : race
    }))
  }

  const getAbilityScorePreview = (race: Race) => {
    if (!baseAbilityScores) return null
    
    const preview: Record<string, number> = {}
    ABILITY_NAMES.forEach(ability => {
      const raceBonus = race.ability_score_increases.find(asi => 
        asi.ability.toLowerCase() === ability.toLowerCase()
      )?.increase || 0
      preview[ability] = baseAbilityScores[ability] + raceBonus
    })
    
    return preview
  }

  const getRaceImage = (race: Race) => {
    // Placeholder for race artwork - would use actual images in production
    const raceColors: Record<string, string> = {
      'Human': 'bg-gradient-to-br from-amber-100 to-yellow-200',
      'Elf': 'bg-gradient-to-br from-green-100 to-emerald-200',
      'Dwarf': 'bg-gradient-to-br from-stone-100 to-gray-200',
      'Halfling': 'bg-gradient-to-br from-orange-100 to-amber-200',
      'Dragonborn': 'bg-gradient-to-br from-red-100 to-orange-200',
      'Gnome': 'bg-gradient-to-br from-purple-100 to-pink-200',
      'Half-Elf': 'bg-gradient-to-br from-blue-100 to-cyan-200',
      'Half-Orc': 'bg-gradient-to-br from-green-200 to-lime-200',
      'Tiefling': 'bg-gradient-to-br from-red-200 to-pink-200'
    }
    
    return raceColors[race.name] || 'bg-gradient-to-br from-gray-100 to-slate-200'
  }

  if (loading) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="h-32">
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-muted rounded w-full mb-1"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Search and Filter Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search races by name, traits, or description..."
              value={state.searchQuery}
              onChange={(e) => setState(prev => ({ ...prev, searchQuery: e.target.value }))}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={state.filterBy === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setState(prev => ({ ...prev, filterBy: 'all' }))}
            >
              All Races
            </Button>
            <Button
              variant={state.filterBy === 'abilities' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setState(prev => ({ ...prev, filterBy: 'abilities' }))}
            >
              Major Bonuses
            </Button>
            <Button
              variant={state.filterBy === 'size' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setState(prev => ({ ...prev, filterBy: 'size' }))}
            >
              By Size
            </Button>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          {filteredRaces.length} race{filteredRaces.length !== 1 ? 's' : ''} available
          {state.searchQuery && ` for "${state.searchQuery}"`}
        </p>
      </div>

      {/* Race Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredRaces.map((race) => {
          const isSelected = selectedRace?.id === race.id
          const isComparing = state.comparisonRace?.id === race.id
          const abilityPreview = getAbilityScorePreview(race)
          
          return (
            <Card
              key={race.id}
              className={cn(
                "transition-all duration-200 cursor-pointer hover:shadow-md",
                isSelected && "ring-2 ring-primary border-primary bg-primary/5",
                isComparing && "ring-2 ring-blue-400 border-blue-400 bg-blue-50"
              )}
              onClick={() => onRaceSelect(race)}
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Race Artwork Placeholder */}
                  <div className={cn(
                    "w-16 h-16 rounded-lg flex-shrink-0 flex items-center justify-center",
                    getRaceImage(race)
                  )}>
                    <span className="text-2xl font-bold text-gray-600">
                      {race.name.charAt(0)}
                    </span>
                  </div>

                  {/* Race Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {race.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" size="sm">
                            {race.size}
                          </Badge>
                          <Badge variant="outline" size="sm">
                            {race.speed} ft speed
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCompare(race)
                        }}
                        className={cn(
                          isComparing && "bg-blue-100 text-blue-700"
                        )}
                      >
                        {isComparing ? 'Comparing' : 'Compare'}
                      </Button>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {race.description}
                    </p>

                    {/* Ability Score Increases */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-foreground">
                        Ability Score Increases
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {race.ability_score_increases.map((asi, index) => (
                          <AbilityTooltip
                            key={index}
                            ability={asi.ability}
                            increase={asi.increase}
                            side="top"
                          >
                            <Badge 
                              variant="secondary" 
                              size="sm"
                              className="cursor-help"
                            >
                              {asi.ability} +{asi.increase}
                            </Badge>
                          </AbilityTooltip>
                        ))}
                      </div>

                      {/* Preview final scores if base scores provided */}
                      {abilityPreview && (
                        <div className="text-xs text-muted-foreground">
                          Preview: {Object.entries(abilityPreview)
                            .filter(([ability, score]) => {
                              const bonus = race.ability_score_increases.find(asi => 
                                asi.ability.toLowerCase() === ability.toLowerCase()
                              )?.increase || 0
                              return bonus > 0
                            })
                            .map(([ability, score]) => `${ability} ${score}`)
                            .join(', ')
                          }
                        </div>
                      )}
                    </div>

                    {/* Racial Traits (first 3) */}
                    {race.traits.length > 0 && (
                      <div className="space-y-2 mt-3 pt-3 border-t border-muted">
                        <h4 className="text-xs font-medium text-foreground">
                          Racial Traits
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {race.traits.slice(0, 3).map((trait, index) => (
                            <TraitTooltip
                              key={index}
                              trait={trait}
                              side="top"
                            >
                              <Badge 
                                variant="outline" 
                                size="sm"
                                className="cursor-help"
                              >
                                {trait.name}
                              </Badge>
                            </TraitTooltip>
                          ))}
                          {race.traits.length > 3 && (
                            <Badge variant="ghost" size="sm">
                              +{race.traits.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Languages and Proficiencies Summary */}
                    <div className="mt-3 pt-3 border-t border-muted">
                      <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                        {race.languages.length > 0 && (
                          <div>
                            <span className="font-medium">Languages:</span>
                            <span className="ml-1">
                              {race.languages.length > 1 
                                ? `${race.languages[0].name} +${race.languages.length - 1}` 
                                : race.languages[0].name
                              }
                            </span>
                          </div>
                        )}
                        {race.proficiencies.length > 0 && (
                          <div>
                            <span className="font-medium">Proficiencies:</span>
                            <span className="ml-1">
                              {race.proficiencies.length} bonus{race.proficiencies.length !== 1 ? 'es' : ''}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* No Results */}
      {filteredRaces.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">
              No races found matching your criteria.
            </p>
            <Button
              variant="outline"
              onClick={() => setState({ searchQuery: '', filterBy: 'all' })}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Comparison Panel */}
      {state.comparisonRace && selectedRace && state.comparisonRace.id !== selectedRace.id && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              Race Comparison
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setState(prev => ({ ...prev, comparisonRace: undefined }))}
              >
                Close
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[selectedRace, state.comparisonRace].map((race, index) => (
                <div key={race.id} className={cn(
                  "space-y-3",
                  index === 0 ? "lg:border-r lg:pr-6" : "lg:pl-6"
                )}>
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    {race.name}
                    {index === 0 && <Badge variant="default" size="sm">Selected</Badge>}
                    {index === 1 && <Badge variant="outline" size="sm">Comparing</Badge>}
                  </h4>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Ability Bonuses:</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {race.ability_score_increases.map((asi, i) => (
                          <Badge key={i} variant="secondary" size="sm">
                            {asi.ability} +{asi.increase}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <span className="font-medium">Key Traits:</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {race.traits.slice(0, 2).map((trait, i) => (
                          <Badge key={i} variant="outline" size="sm">
                            {trait.name}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Size: {race.size} | Speed: {race.speed} ft | 
                      Languages: {race.languages.length}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}