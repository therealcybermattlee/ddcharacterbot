import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Input } from '../ui'
import { ClassFeatureTooltip, FeatureTooltip } from './FeatureTooltip'
import { cn } from '../../utils/cn'
import { Class, ClassSelectionState, PROFICIENCY_BONUS_BY_LEVEL } from '../../types/dnd5e'
import { filterClassesBySpellcasting, filterClassesByComplexity, searchClasses } from '../../services/dnd5eApi'

interface ClassSelectorProps {
  classes: Class[]
  selectedClass?: Class
  onClassSelect: (cls: Class) => void
  characterLevel?: number
  loading?: boolean
  className?: string
}

export function ClassSelector({
  classes,
  selectedClass,
  onClassSelect,
  characterLevel = 1,
  loading = false,
  className
}: ClassSelectorProps) {
  const [state, setState] = useState<ClassSelectionState>({
    searchQuery: '',
    filterBy: 'all',
    comparisonClass: undefined
  })

  // Filter and search classes
  const filteredClasses = useMemo(() => {
    if (!Array.isArray(classes)) {
      return []
    }

    let filtered = classes

    // Apply search
    if (state.searchQuery) {
      filtered = searchClasses(filtered, state.searchQuery)
    }

    // Apply filters
    switch (state.filterBy) {
      case 'spellcasting':
        filtered = filterClassesBySpellcasting(filtered, true)
        break
      case 'complexity':
        // Show simple and moderate complexity classes
        filtered = filtered.filter(cls => cls?.complexity !== 'complex')
        break
      case 'role':
        // Group by general role - this would need more sophisticated logic
        // For now, just show martial classes
        filtered = filtered.filter(cls =>
          ['Fighter', 'Ranger', 'Paladin', 'Barbarian'].includes(cls?.name || '')
        )
        break
      default:
        // All classes
        break
    }

    return filtered
  }, [classes, state.searchQuery, state.filterBy])

  const handleCompare = (cls: Class) => {
    setState(prev => ({
      ...prev,
      comparisonClass: prev.comparisonClass?.id === cls.id ? undefined : cls
    }))
  }

  const getClassColor = (className: string) => {
    const classColors: Record<string, string> = {
      'Fighter': 'bg-gradient-to-br from-red-100 to-red-200 text-red-800',
      'Wizard': 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-800',
      'Rogue': 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800',
      'Cleric': 'bg-gradient-to-br from-yellow-100 to-yellow-200 text-yellow-800',
      'Ranger': 'bg-gradient-to-br from-green-100 to-green-200 text-green-800',
      'Barbarian': 'bg-gradient-to-br from-orange-100 to-orange-200 text-orange-800',
      'Bard': 'bg-gradient-to-br from-purple-100 to-purple-200 text-purple-800',
      'Druid': 'bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-800',
      'Monk': 'bg-gradient-to-br from-cyan-100 to-cyan-200 text-cyan-800',
      'Paladin': 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-800',
      'Sorcerer': 'bg-gradient-to-br from-red-100 to-pink-200 text-red-800',
      'Warlock': 'bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-800'
    }
    
    return classColors[className] || 'bg-gradient-to-br from-gray-100 to-slate-200 text-gray-800'
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'complex':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getHitPointsAtLevel = (cls: Class, level: number) => {
    const basePlusConMod = cls.hit_die + 2 // Assuming +2 Con modifier
    const averagePerLevel = (cls.hit_die / 2) + 1
    return basePlusConMod + Math.floor((level - 1) * (averagePerLevel + 2))
  }

  if (loading) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="h-40">
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
              placeholder="Search classes by name, features, or playstyle..."
              value={state.searchQuery}
              onChange={(e) => setState(prev => ({ ...prev, searchQuery: e.target.value }))}
              className="w-full"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={state.filterBy === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setState(prev => ({ ...prev, filterBy: 'all' }))}
            >
              All Classes
            </Button>
            <Button
              variant={state.filterBy === 'spellcasting' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setState(prev => ({ ...prev, filterBy: 'spellcasting' }))}
            >
              Spellcasters
            </Button>
            <Button
              variant={state.filterBy === 'role' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setState(prev => ({ ...prev, filterBy: 'role' }))}
            >
              Martial
            </Button>
            <Button
              variant={state.filterBy === 'complexity' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setState(prev => ({ ...prev, filterBy: 'complexity' }))}
            >
              Beginner
            </Button>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          {filteredClasses.length} class{filteredClasses.length !== 1 ? 'es' : ''} available
          {state.searchQuery && ` for "${state.searchQuery}"`}
        </p>
      </div>

      {/* Class Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredClasses.map((cls) => {
          const isSelected = selectedClass?.id === cls.id
          const isComparing = state.comparisonClass?.id === cls.id
          const estimatedHP = getHitPointsAtLevel(cls, characterLevel)
          const level1Features = Array.isArray(cls?.class_features) ? cls.class_features.filter(f => f?.level === 1) : []
          
          return (
            <Card
              key={cls.id}
              className={cn(
                "transition-all duration-200 cursor-pointer hover:shadow-md",
                isSelected && "ring-2 ring-primary border-primary bg-primary/5",
                isComparing && "ring-2 ring-blue-400 border-blue-400 bg-blue-50"
              )}
              onClick={() => onClassSelect(cls)}
            >
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {/* Class Icon */}
                  <div className={cn(
                    "w-16 h-16 rounded-lg flex-shrink-0 flex items-center justify-center font-bold text-lg",
                    getClassColor(cls.name)
                  )}>
                    {cls.name.slice(0, 2).toUpperCase()}
                  </div>

                  {/* Class Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {cls.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" size="sm">
                            d{cls.hit_die} Hit Die
                          </Badge>
                          {cls.spellcasting && (
                            <Badge variant="secondary" size="sm">
                              Spellcaster
                            </Badge>
                          )}
                          {cls.complexity && (
                            <Badge 
                              className={cn("border text-xs", getComplexityColor(cls.complexity))}
                              size="sm"
                            >
                              {cls.complexity}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCompare(cls)
                        }}
                        className={cn(
                          isComparing && "bg-blue-100 text-blue-700"
                        )}
                      >
                        {isComparing ? 'Comparing' : 'Compare'}
                      </Button>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {cls.description}
                    </p>

                    {/* Primary Abilities */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-medium text-foreground">
                        Key Abilities
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(cls?.primary_abilities) && cls.primary_abilities.map((ability, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            size="sm"
                          >
                            {ability}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Saving Throws */}
                    <div className="space-y-3 mt-4">
                      <h4 className="text-xs font-medium text-foreground">
                        Saving Throw Proficiencies
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(cls?.saving_throw_proficiencies) && cls.saving_throw_proficiencies.map((save, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            size="sm"
                          >
                            {save}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Starting Features */}
                    {level1Features.length > 0 && (
                      <div className="space-y-3 mt-4 pt-4 border-t border-muted">
                        <h4 className="text-xs font-medium text-foreground">
                          Level 1 Features
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {level1Features.slice(0, 3).map((feature, index) => (
                            <ClassFeatureTooltip
                              key={index}
                              feature={feature}
                              side="top"
                            >
                              <Badge 
                                variant="outline" 
                                size="sm"
                                className="cursor-help"
                              >
                                {feature.name}
                              </Badge>
                            </ClassFeatureTooltip>
                          ))}
                          {level1Features.length > 3 && (
                            <Badge variant="outline" size="sm">
                              +{level1Features.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Spellcasting Info */}
                    {cls.spellcasting && (
                      <div className="mt-4 pt-4 border-t border-muted">
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="font-medium text-foreground">Spell Ability:</span>
                            <div className="text-muted-foreground">
                              {cls.spellcasting.ability}
                            </div>
                          </div>
                          {cls.spellcasting.cantrips_known && (
                            <div>
                              <span className="font-medium text-foreground">Cantrips:</span>
                              <div className="text-muted-foreground">
                                {cls.spellcasting.cantrips_known} known
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Combat Stats Preview */}
                    <div className="mt-4 pt-4 border-t border-muted">
                      <div className="grid grid-cols-3 gap-4 text-xs text-center">
                        <div>
                          <div className="font-medium text-foreground">Hit Points</div>
                          <div className="text-muted-foreground">~{estimatedHP}</div>
                        </div>
                        <div>
                          <div className="font-medium text-foreground">Prof. Bonus</div>
                          <div className="text-muted-foreground">
                            +{PROFICIENCY_BONUS_BY_LEVEL[characterLevel as keyof typeof PROFICIENCY_BONUS_BY_LEVEL]}
                          </div>
                        </div>
                        <div>
                          <div className="font-medium text-foreground">Skills</div>
                          <div className="text-muted-foreground">
                            {cls?.skill_proficiencies?.choose || 0} of {cls?.skill_proficiencies?.from?.length || 0}
                          </div>
                        </div>
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
      {filteredClasses.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">
              No classes found matching your criteria.
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
      {state.comparisonClass && selectedClass && state.comparisonClass.id !== selectedClass.id && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              Class Comparison
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setState(prev => ({ ...prev, comparisonClass: undefined }))}
              >
                Close
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[selectedClass, state.comparisonClass].map((cls, index) => (
                <div key={cls.id} className={cn(
                  "space-y-3",
                  index === 0 ? "lg:border-r lg:pr-6" : "lg:pl-6"
                )}>
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    {cls.name}
                    {index === 0 && <Badge variant="default" size="sm">Selected</Badge>}
                    {index === 1 && <Badge variant="outline" size="sm">Comparing</Badge>}
                  </h4>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Hit Die:</span>
                      <span className="ml-2">d{cls.hit_die}</span>
                      {cls.spellcasting && (
                        <Badge variant="secondary" size="sm" className="ml-2">
                          Spellcaster
                        </Badge>
                      )}
                    </div>
                    
                    <div>
                      <span className="font-medium">Primary Abilities:</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {cls.primary_abilities.map((ability, i) => (
                          <Badge key={i} variant="secondary" size="sm">
                            {ability}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="font-medium">Saving Throws:</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {cls.saving_throw_proficiencies.map((save, i) => (
                          <Badge key={i} variant="outline" size="sm">
                            {save}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground pt-2 border-t">
                      Est. HP at Lvl {characterLevel}: {getHitPointsAtLevel(cls, characterLevel)} | 
                      Skills: {cls.skill_proficiencies.choose} choice{cls.skill_proficiencies.choose !== 1 ? 's' : ''}
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