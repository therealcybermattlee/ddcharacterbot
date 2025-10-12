import React, { useState, useMemo } from 'react'
import { Search, BookOpen, Award, X } from 'lucide-react'
import { type Feat, searchFeats, getFeatsByCategory, meetsPrerequisites } from '../../data/feats'

interface FeatSelectorProps {
  availableFeats: Feat[]
  selectedFeat?: Feat
  onFeatSelect: (feat: Feat | undefined) => void
  characterData?: {
    abilityScores?: Record<string, number>
    class?: string
    race?: string
    proficiencies?: string[]
    level?: number
  }
  className?: string
}

export function FeatSelector({
  availableFeats,
  selectedFeat,
  onFeatSelect,
  characterData,
  className = ''
}: FeatSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [expandedFeat, setExpandedFeat] = useState<string | null>(null)

  // Filter feats based on search and category
  const filteredFeats = useMemo(() => {
    let feats = availableFeats

    // Apply search filter
    if (searchQuery.trim()) {
      feats = searchFeats(searchQuery).filter(feat =>
        availableFeats.some(af => af.id === feat.id)
      )
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      feats = feats.filter(feat => feat.category === selectedCategory)
    }

    // Sort feats by name
    return feats.sort((a, b) => a.name.localeCompare(b.name))
  }, [availableFeats, searchQuery, selectedCategory])

  // Get unique categories from available feats
  const categories = useMemo(() => {
    const cats = new Set(availableFeats.map(feat => feat.category))
    return Array.from(cats).sort()
  }, [availableFeats])

  // Check if character meets feat prerequisites
  const checkPrerequisites = (feat: Feat): boolean => {
    if (!characterData) return true
    return meetsPrerequisites(feat, characterData)
  }

  // Get category icon and color
  const getCategoryStyle = (category: string) => {
    switch (category) {
      case 'combat':
        return { icon: '⚔️', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' }
      case 'spellcasting':
        return { icon: '✨', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' }
      case 'utility':
        return { icon: '🛠️', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' }
      case 'social':
        return { icon: '💬', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' }
      case 'mobility':
        return { icon: '🏃', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' }
      case 'racial':
        return { icon: '👤', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' }
      default:
        return { icon: '📋', color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' }
    }
  }

  // Format ability score name
  const formatAbility = (ability: string): string => {
    return ability.charAt(0).toUpperCase() + ability.slice(1)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-600" />
          <h3 className="text-lg font-semibold text-gray-900">Select a Feat</h3>
        </div>
        {selectedFeat && (
          <button
            onClick={() => onFeatSelect(undefined)}
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear Selection
          </button>
        )}
      </div>

      {/* Selected Feat Display */}
      {selectedFeat && (
        <div className={`p-4 rounded-lg border-2 ${getCategoryStyle(selectedFeat.category).border} ${getCategoryStyle(selectedFeat.category).bg}`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{getCategoryStyle(selectedFeat.category).icon}</span>
                <h4 className="font-semibold text-lg text-gray-900">{selectedFeat.name}</h4>
              </div>
              <p className="text-sm text-gray-700 mb-3">{selectedFeat.description}</p>
              <div className="space-y-1">
                {selectedFeat.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-green-600 mt-0.5">•</span>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
              {selectedFeat.abilityScoreIncrease && (
                <div className="mt-3 p-2 bg-white rounded border border-gray-200">
                  <p className="text-sm font-medium text-gray-900">
                    +{selectedFeat.abilityScoreIncrease.amount} to{' '}
                    {selectedFeat.abilityScoreIncrease.options.map(formatAbility).join(' or ')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search feats by name or description..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
            }`}
          >
            All ({availableFeats.length})
          </button>
          {categories.map(category => {
            const style = getCategoryStyle(category)
            const count = availableFeats.filter(f => f.category === category).length
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 text-sm rounded-lg border transition-colors flex items-center gap-1.5 ${
                  selectedCategory === category
                    ? `${style.bg} ${style.color} ${style.border} font-medium`
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                <span>{style.icon}</span>
                <span className="capitalize">{category}</span>
                <span className="text-xs opacity-75">({count})</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Feat List */}
      <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
        {filteredFeats.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No feats found matching your criteria</p>
          </div>
        ) : (
          filteredFeats.map(feat => {
            const style = getCategoryStyle(feat.category)
            const isSelected = selectedFeat?.id === feat.id
            const isExpanded = expandedFeat === feat.id
            const meetsReqs = checkPrerequisites(feat)

            return (
              <div
                key={feat.id}
                className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                  isSelected
                    ? `${style.border} ${style.bg} ring-2 ring-offset-1 ring-blue-400`
                    : meetsReqs
                    ? 'border-gray-200 hover:border-gray-300 bg-white'
                    : 'border-gray-200 bg-gray-50 opacity-60'
                }`}
                onClick={() => {
                  if (meetsReqs) {
                    if (isSelected) {
                      onFeatSelect(undefined)
                    } else {
                      onFeatSelect(feat)
                    }
                  }
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{style.icon}</span>
                      <h4 className="font-medium text-gray-900">{feat.name}</h4>
                      {feat.abilityScoreIncrease && (
                        <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                          +{feat.abilityScoreIncrease.amount} ASI
                        </span>
                      )}
                      {!meetsReqs && (
                        <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full">
                          Prerequisites not met
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{feat.description}</p>

                    {/* Toggle Benefits */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setExpandedFeat(isExpanded ? null : feat.id)
                      }}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {isExpanded ? 'Hide' : 'Show'} Benefits
                    </button>

                    {/* Expanded Benefits */}
                    {isExpanded && (
                      <div className="mt-2 space-y-1 pl-2 border-l-2 border-gray-200">
                        {feat.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="text-green-600 mt-0.5">•</span>
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Prerequisites */}
                    {feat.prerequisites && (
                      <div className="mt-2 text-xs text-gray-600">
                        <span className="font-medium">Prerequisites: </span>
                        {feat.prerequisites.abilityScore && (
                          <span>
                            {formatAbility(feat.prerequisites.abilityScore.ability)}{' '}
                            {feat.prerequisites.abilityScore.minimum}+
                          </span>
                        )}
                        {feat.prerequisites.proficiency && (
                          <span>Proficiency with {feat.prerequisites.proficiency}</span>
                        )}
                        {feat.prerequisites.spellcasting && <span>Spellcasting ability</span>}
                        {feat.prerequisites.level && <span>Level {feat.prerequisites.level}+</span>}
                        {feat.prerequisites.race && <span>{feat.prerequisites.race}</span>}
                      </div>
                    )}

                    {/* Source */}
                    <div className="mt-1 text-xs text-gray-500">
                      Source: {feat.source}
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Help Text */}
      <div className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="font-medium text-blue-900 mb-1">About Feats</p>
        <p>
          Feats represent special talents or areas of expertise. Some backgrounds grant you a choice
          of feat during character creation. You can also gain feats at certain levels when you
          receive an Ability Score Improvement.
        </p>
      </div>
    </div>
  )
}
