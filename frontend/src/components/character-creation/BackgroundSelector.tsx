import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Input } from '../ui'
import { FeatureTooltip } from './FeatureTooltip'
import { cn } from '../../utils/cn'
import { Background, BackgroundSelectionState, Class } from '../../types/dnd5e'
import { filterBackgroundsBySkill, searchBackgrounds } from '../../services/dnd5eApi'

interface BackgroundSelectorProps {
  backgrounds: Background[]
  selectedBackground?: Background
  onBackgroundSelect: (background: Background) => void
  selectedClass?: Class
  loading?: boolean
  className?: string
}

export function BackgroundSelector({
  backgrounds,
  selectedBackground,
  onBackgroundSelect,
  selectedClass,
  loading = false,
  className
}: BackgroundSelectorProps) {
  const [state, setState] = useState<BackgroundSelectionState>({
    searchQuery: '',
    filterBy: 'all'
  })

  // Filter and search backgrounds
  const filteredBackgrounds = useMemo(() => {
    if (!Array.isArray(backgrounds)) {
      return []
    }

    let filtered = backgrounds

    // Apply search
    if (state.searchQuery) {
      filtered = searchBackgrounds(filtered, state.searchQuery)
    }

    // Apply filters
    switch (state.filterBy) {
      case 'skills':
        // Show backgrounds that complement the selected class
        if (selectedClass && Array.isArray(selectedClass?.skill_proficiencies?.from)) {
          const classSkills = selectedClass.skill_proficiencies.from
          filtered = filtered.filter(bg =>
            Array.isArray(bg?.skill_proficiencies) &&
            bg.skill_proficiencies.some(skill => !classSkills.includes(skill))
          )
        }
        break
      case 'tools':
        // Show backgrounds with tool proficiencies
        filtered = filtered.filter(bg =>
          Array.isArray(bg?.tool_proficiencies) && bg.tool_proficiencies.length > 0
        )
        break
      default:
        // All backgrounds
        break
    }

    return filtered
  }, [backgrounds, state.searchQuery, state.filterBy, selectedClass])

  const getBackgroundColor = (backgroundName: string) => {
    const backgroundColors: Record<string, string> = {
      'Acolyte': 'bg-gradient-to-br from-yellow-100 to-amber-200',
      'Criminal': 'bg-gradient-to-br from-red-100 to-red-200', 
      'Folk Hero': 'bg-gradient-to-br from-green-100 to-green-200',
      'Noble': 'bg-gradient-to-br from-purple-100 to-purple-200',
      'Sage': 'bg-gradient-to-br from-blue-100 to-blue-200',
      'Soldier': 'bg-gradient-to-br from-gray-100 to-gray-200',
      'Charlatan': 'bg-gradient-to-br from-pink-100 to-pink-200',
      'Entertainer': 'bg-gradient-to-br from-orange-100 to-orange-200',
      'Guild Artisan': 'bg-gradient-to-br from-brown-100 to-amber-200',
      'Hermit': 'bg-gradient-to-br from-slate-100 to-slate-200',
      'Outlander': 'bg-gradient-to-br from-emerald-100 to-green-200',
      'Sailor': 'bg-gradient-to-br from-cyan-100 to-blue-200'
    }
    
    return backgroundColors[backgroundName] || 'bg-gradient-to-br from-gray-100 to-slate-200'
  }

  const checkSkillConflicts = (background: Background) => {
    if (!selectedClass || !Array.isArray(selectedClass?.skill_proficiencies?.from)) {
      return { conflicts: [], suggestions: [] }
    }

    const classSkills = selectedClass.skill_proficiencies.from
    const backgroundSkills = Array.isArray(background?.skill_proficiencies) ? background.skill_proficiencies : []

    const conflicts = backgroundSkills.filter(skill =>
      classSkills.includes(skill)
    )

    const suggestions = backgroundSkills.filter(skill =>
      !classSkills.includes(skill)
    )

    return { conflicts, suggestions }
  }

  const getPersonalityHint = (background: Background) => {
    if (background.suggested_characteristics?.personality_traits?.length) {
      const trait = background.suggested_characteristics.personality_traits[0]
      return trait.text
    }
    return 'A character shaped by their background experiences.'
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
              placeholder="Search backgrounds by name, skills, or features..."
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
              All
            </Button>
            {selectedClass && (
              <Button
                variant={state.filterBy === 'skills' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setState(prev => ({ ...prev, filterBy: 'skills' }))}
              >
                Complements Class
              </Button>
            )}
            <Button
              variant={state.filterBy === 'tools' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setState(prev => ({ ...prev, filterBy: 'tools' }))}
            >
              Tool Skills
            </Button>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          {filteredBackgrounds.length} background{filteredBackgrounds.length !== 1 ? 's' : ''} available
          {state.searchQuery && ` for "${state.searchQuery}"`}
        </p>
      </div>

      {/* Background Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredBackgrounds.map((background) => {
          const isSelected = selectedBackground?.id === background.id
          const { conflicts, suggestions } = checkSkillConflicts(background)
          
          return (
            <Card
              key={background.id}
              className={cn(
                "transition-all duration-200 cursor-pointer hover:shadow-md",
                isSelected && "ring-2 ring-primary border-primary bg-primary/5"
              )}
              onClick={() => onBackgroundSelect(background)}
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Background Icon */}
                  <div className={cn(
                    "w-16 h-16 rounded-lg flex-shrink-0 flex items-center justify-center font-bold text-lg text-gray-700",
                    getBackgroundColor(background.name)
                  )}>
                    {background.name.split(' ').map(word => word.charAt(0)).join('').slice(0, 2)}
                  </div>

                  {/* Background Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {background.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" size="sm">
                            {Array.isArray(background?.skill_proficiencies) ? background.skill_proficiencies.length : 0} Skills
                          </Badge>
                          {Array.isArray(background?.tool_proficiencies) && background.tool_proficiencies.length > 0 && (
                            <Badge variant="outline" size="sm">
                              {background.tool_proficiencies.length} Tool{background.tool_proficiencies.length !== 1 ? 's' : ''}
                            </Badge>
                          )}
                          {background?.languages && (
                            <Badge variant="outline" size="sm">
                              {background.languages.count || background.languages.specific?.length || 0} Language{(background.languages.count || background.languages.specific?.length || 0) !== 1 ? 's' : ''}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {background.description}
                    </p>

                    {/* Skill Proficiencies with Conflict Detection */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-foreground">
                        Skill Proficiencies
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(background?.skill_proficiencies) && background.skill_proficiencies.map((skill, index) => {
                          const hasConflict = conflicts.includes(skill)
                          const isGoodChoice = suggestions.includes(skill)

                          return (
                            <Badge
                              key={index}
                              variant={hasConflict ? "destructive" : isGoodChoice ? "default" : "secondary"}
                              size="sm"
                              className={cn(
                                hasConflict && "opacity-70",
                                isGoodChoice && "ring-1 ring-green-400"
                              )}
                            >
                              {skill}
                              {hasConflict && " (overlap)"}
                            </Badge>
                          )
                        })}
                      </div>
                      
                      {conflicts.length > 0 && (
                        <p className="text-xs text-amber-600">
                          ⚠️ {conflicts.length} skill{conflicts.length !== 1 ? 's' : ''} overlap with {selectedClass?.name}
                        </p>
                      )}
                    </div>

                    {/* Tool Proficiencies */}
                    {Array.isArray(background?.tool_proficiencies) && background.tool_proficiencies.length > 0 && (
                      <div className="space-y-2 mt-3">
                        <h4 className="text-xs font-medium text-foreground">
                          Tool Proficiencies
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {background.tool_proficiencies.map((tool, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              size="sm"
                            >
                              {tool}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Background Feature */}
                    <div className="space-y-2 mt-3 pt-3 border-t border-muted">
                      <h4 className="text-xs font-medium text-foreground">
                        Background Feature
                      </h4>
                      <FeatureTooltip
                        feature={{
                          name: background.feature.name,
                          description: background.feature.description
                        }}
                        side="top"
                      >
                        <Badge 
                          variant="default" 
                          size="sm"
                          className="cursor-help"
                        >
                          {background.feature.name}
                        </Badge>
                      </FeatureTooltip>
                    </div>

                    {/* Starting Equipment Preview */}
                    {Array.isArray(background?.equipment) && background.equipment.length > 0 && (
                      <div className="space-y-2 mt-3">
                        <h4 className="text-xs font-medium text-foreground">
                          Starting Equipment
                        </h4>
                        <div className="text-xs text-muted-foreground">
                          {background.equipment.length} item{background.equipment.length !== 1 ? 's' : ''} including {background.equipment.slice(0, 2).map(item => item?.name || 'Unknown').join(', ')}
                          {background.equipment.length > 2 && ` and ${background.equipment.length - 2} more`}
                        </div>
                      </div>
                    )}

                    {/* Personality Hint */}
                    <div className="mt-3 pt-3 border-t border-muted">
                      <div className="text-xs italic text-muted-foreground bg-muted/30 p-2 rounded">
                        💭 "{getPersonalityHint(background)}"
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
      {filteredBackgrounds.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">
              No backgrounds found matching your criteria.
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

      {/* Background Selection Summary */}
      {selectedBackground && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">Background Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">{selectedBackground.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedBackground.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-foreground mb-2">You Gain:</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• {selectedBackground.skill_proficiencies.length} skill proficiencies</li>
                    {selectedBackground.tool_proficiencies && (
                      <li>• {selectedBackground.tool_proficiencies.length} tool proficiencies</li>
                    )}
                    {selectedBackground.languages && (
                      <li>• {selectedBackground.languages.count || selectedBackground.languages.specific?.length} additional language(s)</li>
                    )}
                    <li>• Starting equipment package</li>
                    <li>• {selectedBackground.feature.name} feature</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-medium text-foreground mb-2">Character Flavor:</h5>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>This background shapes your character's past and provides roleplay opportunities.</p>
                    {selectedBackground.suggested_characteristics && (
                      <p className="text-xs italic mt-2">
                        Consider using the suggested personality traits, ideals, bonds, and flaws to bring your character to life.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}