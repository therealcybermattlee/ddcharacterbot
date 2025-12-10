import React, { useRef, useEffect } from 'react'
import { Button, Badge } from '../../ui'
import { WizardStepProps } from '../../../types/wizard'

export function BackgroundDetailsStep({ data, onChange, onValidationChange }: WizardStepProps) {
  // BUG FIX #1: Use ref pattern to handle unstable onValidationChange callback
  // This ensures validation always calls the latest callback even when its identity changes
  // Prevents Next button from staying disabled when data is valid
  const onValidationChangeRef = useRef(onValidationChange)

  useEffect(() => {
    onValidationChangeRef.current = onValidationChange
  }, [onValidationChange])

  const currentData = data || {
    notes: '',
    armorClass: 10,
    hitPoints: { current: 8, maximum: 8, temporary: 0 }
  }

  const handleFieldChange = (field: string, value: any) => {
    const newData = { ...currentData, [field]: value }
    onChange(newData)
    
    // Basic validation
    const errors: string[] = []
    if (newData.armorClass < 1 || newData.armorClass > 30) {
      errors.push('Armor Class must be between 1 and 30')
    }
    if (newData.hitPoints.maximum < 1) {
      errors.push('Maximum hit points must be at least 1')
    }
    if (newData.hitPoints.current < 0) {
      errors.push('Current hit points cannot be negative')
    }
    if (newData.hitPoints.temporary < 0) {
      errors.push('Temporary hit points cannot be negative')
    }

    onValidationChangeRef.current(errors.length === 0, errors)
  }

  const handleHitPointsChange = (field: string, value: number) => {
    const newHitPoints = { ...currentData.hitPoints, [field]: Math.max(0, value) }
    handleFieldChange('hitPoints', newHitPoints)
  }

  const rollHitPoints = (hitDie: number = 8, constitution: number = 0) => {
    const roll = Math.floor(Math.random() * hitDie) + 1
    const total = roll + constitution
    const newHitPoints = {
      current: total,
      maximum: total,
      temporary: 0
    }
    handleFieldChange('hitPoints', newHitPoints)
  }

  return (
    <div className="space-y-6">
      {/* Armor Class */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Armor Class *
        </label>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFieldChange('armorClass', Math.max(1, currentData.armorClass - 1))}
              disabled={currentData.armorClass <= 1}
            >
              -
            </Button>
            
            <div className="w-20 text-center">
              <Badge variant="outline" className="text-xl px-4 py-2">
                {currentData.armorClass}
              </Badge>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFieldChange('armorClass', Math.min(30, currentData.armorClass + 1))}
              disabled={currentData.armorClass >= 30}
            >
              +
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Base AC (without armor/shield bonuses)
          </div>
        </div>
        
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>AC Calculation:</strong> 10 + Dex modifier + armor bonus + shield bonus + other modifiers
          </p>
        </div>
      </div>

      {/* Hit Points */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">Hit Points</h3>
        
        {/* Maximum HP */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Maximum Hit Points *
          </label>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleHitPointsChange('maximum', currentData.hitPoints.maximum - 1)}
                disabled={currentData.hitPoints.maximum <= 1}
              >
                -
              </Button>
              
              <div className="w-20 text-center">
                <Badge variant="outline" className="text-xl px-4 py-2">
                  {currentData.hitPoints.maximum}
                </Badge>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleHitPointsChange('maximum', currentData.hitPoints.maximum + 1)}
              >
                +
              </Button>
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => rollHitPoints(8, 0)}
              className="flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
              Roll d8
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => rollHitPoints(6, 0)}
              className="flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
              Roll d6
            </Button>
          </div>
        </div>

        {/* Current HP */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Current Hit Points
          </label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleHitPointsChange('current', currentData.hitPoints.current - 1)}
              disabled={currentData.hitPoints.current <= 0}
            >
              -
            </Button>
            
            <div className="w-20 text-center">
              <Badge 
                variant={currentData.hitPoints.current === currentData.hitPoints.maximum ? "default" : "secondary"}
                className="text-lg px-3 py-1"
              >
                {currentData.hitPoints.current}
              </Badge>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleHitPointsChange('current', currentData.hitPoints.current + 1)}
              disabled={currentData.hitPoints.current >= currentData.hitPoints.maximum}
            >
              +
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleHitPointsChange('current', currentData.hitPoints.maximum)}
              disabled={currentData.hitPoints.current === currentData.hitPoints.maximum}
            >
              Full Heal
            </Button>
          </div>
        </div>

        {/* Temporary HP */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Temporary Hit Points
          </label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleHitPointsChange('temporary', currentData.hitPoints.temporary - 1)}
              disabled={currentData.hitPoints.temporary <= 0}
            >
              -
            </Button>
            
            <div className="w-20 text-center">
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {currentData.hitPoints.temporary}
              </Badge>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleHitPointsChange('temporary', currentData.hitPoints.temporary + 1)}
            >
              +
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleHitPointsChange('temporary', 0)}
              disabled={currentData.hitPoints.temporary === 0}
            >
              Clear
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Temporary HP doesn't stack and disappears when you take a long rest
          </p>
        </div>
      </div>

      {/* Character Notes */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Character Notes & Background
        </label>
        <textarea
          placeholder="Describe your character's personality, appearance, goals, fears, bonds, flaws, and backstory..."
          value={currentData.notes || ''}
          onChange={(e) => handleFieldChange('notes', e.target.value)}
          className="w-full h-32 p-3 border border-border rounded-md bg-background text-foreground resize-none"
        />
        <p className="text-xs text-muted-foreground">
          Optional but recommended - this helps bring your character to life!
        </p>
      </div>

      {/* Character Traits Template */}
      <div className="space-y-3">
        <h4 className="font-medium text-foreground">Character Development Prompts</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 border border-border rounded-md">
            <h5 className="text-sm font-medium text-foreground mb-1">Personality</h5>
            <p className="text-xs text-muted-foreground">
              How does your character act? What quirks do they have?
            </p>
          </div>
          
          <div className="p-3 border border-border rounded-md">
            <h5 className="text-sm font-medium text-foreground mb-1">Ideals</h5>
            <p className="text-xs text-muted-foreground">
              What principles drive your character? What do they believe in?
            </p>
          </div>
          
          <div className="p-3 border border-border rounded-md">
            <h5 className="text-sm font-medium text-foreground mb-1">Bonds</h5>
            <p className="text-xs text-muted-foreground">
              Who or what is important to your character?
            </p>
          </div>
          
          <div className="p-3 border border-border rounded-md">
            <h5 className="text-sm font-medium text-foreground mb-1">Flaws</h5>
            <p className="text-xs text-muted-foreground">
              What weakness or vice might get your character in trouble?
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="p-4 bg-muted/50 rounded-md">
        <h4 className="font-medium text-foreground mb-2">Combat Stats Summary</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Armor Class:</span>
            <span className="ml-2 font-medium">{currentData.armorClass}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Hit Points:</span>
            <span className="ml-2 font-medium">
              {currentData.hitPoints.current}/{currentData.hitPoints.maximum}
              {currentData.hitPoints.temporary > 0 && ` (+${currentData.hitPoints.temporary})`}
            </span>
          </div>
        </div>
        {currentData.notes && (
          <div className="mt-2 pt-2 border-t border-border">
            <span className="text-muted-foreground text-sm">Notes: </span>
            <span className="text-sm">
              {currentData.notes.length > 100 
                ? currentData.notes.substring(0, 100) + '...'
                : currentData.notes
              }
            </span>
          </div>
        )}
      </div>
    </div>
  )
}