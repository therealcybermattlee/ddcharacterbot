import React, { useState } from 'react'
import { Badge, Card, CardContent } from '../ui'
import { cn } from '../../utils/cn'
import { Trait, ClassFeature, AbilityScoreIncrease } from '../../types/dnd5e'

interface FeatureTooltipProps {
  children: React.ReactNode
  feature: Trait | ClassFeature | AbilityScoreIncrease | { name: string; description: string }
  className?: string
  side?: 'top' | 'bottom' | 'left' | 'right'
}

export function FeatureTooltip({ 
  children, 
  feature, 
  className,
  side = 'top' 
}: FeatureTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  
  // Handle different feature types
  const getFeatureInfo = () => {
    if ('ability' in feature) {
      // AbilityScoreIncrease
      return {
        name: `${feature.ability} +${feature.increase}`,
        description: `Increases your ${feature.ability} score by ${feature.increase}.`,
        type: 'ability'
      }
    } else if ('level' in feature) {
      // ClassFeature
      return {
        name: feature.name,
        description: feature.description,
        type: feature.type || 'feature',
        level: feature.level
      }
    } else if ('type' in feature) {
      // Trait
      return {
        name: feature.name,
        description: feature.description,
        type: feature.type || 'trait'
      }
    } else {
      // Generic feature
      return {
        name: feature.name,
        description: feature.description,
        type: 'feature'
      }
    }
  }

  const featureInfo = getFeatureInfo()

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ability':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'passive':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'active':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'reaction':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'bonus':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'trait':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  }

  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-border',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-border',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-border',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-border'
  }

  return (
    <div 
      className={cn("relative inline-block", className)}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      
      {isVisible && (
        <div className={cn(
          "absolute z-50 w-80 max-w-sm",
          positionClasses[side]
        )}>
          {/* Arrow */}
          <div className={cn(
            "absolute w-0 h-0 border-4",
            arrowClasses[side]
          )} />
          
          {/* Tooltip content */}
          <Card className="shadow-lg border-2">
            <CardContent className="p-4">
              <div className="space-y-2">
                {/* Feature name and type badge */}
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-sm text-foreground leading-tight">
                    {featureInfo.name}
                  </h4>
                  <div className="flex gap-1 flex-shrink-0">
                    <Badge 
                      className={cn(
                        "text-xs px-2 py-0.5 border",
                        getTypeColor(featureInfo.type)
                      )}
                    >
                      {featureInfo.type}
                    </Badge>
                    {'level' in featureInfo && (
                      <Badge variant="outline" className="text-xs px-2 py-0.5">
                        Lvl {featureInfo.level}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Feature description */}
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {featureInfo.description}
                </p>

                {/* Additional info for specific feature types */}
                {'ability' in feature && (
                  <div className="pt-2 border-t border-muted">
                    <p className="text-xs text-muted-foreground">
                      This bonus is applied to your ability score, saving throws, 
                      and related skill checks.
                    </p>
                  </div>
                )}

                {'type' in feature && feature.type && ['active', 'reaction', 'bonus'].includes(feature.type) && (
                  <div className="pt-2 border-t border-muted">
                    <p className="text-xs text-muted-foreground">
                      {feature.type === 'active' && 'Requires an action to use.'}
                      {feature.type === 'reaction' && 'Can be used as a reaction.'}
                      {feature.type === 'bonus' && 'Requires a bonus action to use.'}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

// Higher-order component for adding tooltips to existing elements
export function withTooltip<T extends React.ComponentType<any>>(
  Component: T,
  getFeature: (props: any) => Trait | ClassFeature | AbilityScoreIncrease | { name: string; description: string }
) {
  return React.forwardRef<any, React.ComponentProps<T> & { tooltipSide?: 'top' | 'bottom' | 'left' | 'right' }>((props, ref) => {
    const { tooltipSide, ...componentProps } = props
    const feature = getFeature(props)
    
    return (
      <FeatureTooltip feature={feature} side={tooltipSide}>
        <Component {...(componentProps as any)} ref={ref} />
      </FeatureTooltip>
    )
  })
}

// Specialized tooltip components for common use cases
interface AbilityTooltipProps {
  children: React.ReactNode
  ability: string
  increase: number
  className?: string
  side?: 'top' | 'bottom' | 'left' | 'right'
}

export function AbilityTooltip({ children, ability, increase, className, side }: AbilityTooltipProps) {
  const feature = { ability, increase }
  return (
    <FeatureTooltip feature={feature} className={className} side={side}>
      {children}
    </FeatureTooltip>
  )
}

interface TraitTooltipProps {
  children: React.ReactNode
  trait: Trait
  className?: string
  side?: 'top' | 'bottom' | 'left' | 'right'
}

export function TraitTooltip({ children, trait, className, side }: TraitTooltipProps) {
  return (
    <FeatureTooltip feature={trait} className={className} side={side}>
      {children}
    </FeatureTooltip>
  )
}

interface ClassFeatureTooltipProps {
  children: React.ReactNode
  feature: ClassFeature
  className?: string
  side?: 'top' | 'bottom' | 'left' | 'right'
}

export function ClassFeatureTooltip({ children, feature, className, side }: ClassFeatureTooltipProps) {
  return (
    <FeatureTooltip feature={feature} className={className} side={side}>
      {children}
    </FeatureTooltip>
  )
}