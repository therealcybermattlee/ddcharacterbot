import React, { useState, useMemo } from 'react'
import { Card, CardContent, Button, Badge, Input } from '../ui'
import { cn } from '../../utils/cn'
import { Subclass } from '../../types/dnd5e'

interface SubclassSelectorProps {
  subclasses: Subclass[]
  selectedSubclass?: Subclass
  onSubclassSelect: (subclass: Subclass) => void
  className?: string
  characterLevel?: number
}

export function SubclassSelector({
  subclasses,
  selectedSubclass,
  onSubclassSelect,
  className,
  characterLevel = 1
}: SubclassSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('')

  // Filter subclasses by search
  const filteredSubclasses = useMemo(() => {
    if (!Array.isArray(subclasses)) {
      return []
    }

    if (!searchQuery) {
      return subclasses
    }

    const query = searchQuery.toLowerCase()
    return subclasses.filter(sub =>
      sub.name.toLowerCase().includes(query) ||
      sub.description.toLowerCase().includes(query)
    )
  }, [subclasses, searchQuery])

  // Get features available at current level
  const getFeaturesAtLevel = (subclass: Subclass) => {
    return subclass.features.filter(f => f.level <= characterLevel)
  }

  if (!subclasses || subclasses.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">
            No subclasses available for this class.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search */}
      {subclasses.length > 4 && (
        <div>
          <Input
            placeholder="Search subclasses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
          <p className="text-sm text-muted-foreground mt-2">
            {filteredSubclasses.length} subclass{filteredSubclasses.length !== 1 ? 'es' : ''} available
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>
      )}

      {/* Subclass Grid */}
      <div className="grid grid-cols-1 gap-3">
        {filteredSubclasses.map((subclass) => {
          const isSelected = selectedSubclass?.id === subclass.id
          const availableFeatures = getFeaturesAtLevel(subclass)

          return (
            <Card
              key={subclass.id}
              className={cn(
                "transition-all duration-200 cursor-pointer hover:shadow-md hover:border-primary/50",
                isSelected && "ring-2 ring-primary border-primary bg-primary/5"
              )}
              onClick={() => onSubclassSelect(subclass)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground mb-2">
                      {subclass.name}
                    </h3>

                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {subclass.description}
                    </p>

                    {/* Features at Current Level */}
                    {availableFeatures.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-foreground">
                          Features at Level {characterLevel}:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {availableFeatures.slice(0, 3).map((feature, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              size="sm"
                              title={feature.description}
                              className="cursor-help"
                            >
                              {feature.name}
                            </Badge>
                          ))}
                          {availableFeatures.length > 3 && (
                            <Badge variant="outline" size="sm">
                              +{availableFeatures.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="flex-shrink-0">
                      <Badge variant="default" className="bg-primary">
                        Selected
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* No Results */}
      {filteredSubclasses.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">
              No subclasses found matching your search.
            </p>
            <Button
              variant="outline"
              onClick={() => setSearchQuery('')}
            >
              Clear Search
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
