import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '../ui'
import { WeaponSelector as WeaponSelectorConfig } from '../../data/startingEquipment'
import { Weapon, ALL_MARTIAL_WEAPONS, ALL_SIMPLE_WEAPONS, formatWeaponProperties } from '../../data/weapons'
import { EquipmentItem } from '../../data/startingEquipment'

interface WeaponSelectorProps {
  config: WeaponSelectorConfig
  description: string
  onSelect: (weapons: EquipmentItem[], includesShield: boolean) => void
  currentSelection?: {
    weapons: EquipmentItem[]
    includesShield: boolean
  }
}

export function WeaponSelectorComponent({ config, description, onSelect, currentSelection }: WeaponSelectorProps) {
  const [selectedWeapons, setSelectedWeapons] = useState<string[]>(
    currentSelection?.weapons.map(w => w.id) || []
  )
  const [includeShield, setIncludeShield] = useState(currentSelection?.includesShield || false)

  // Get available weapons based on category and type filter
  const availableWeapons = React.useMemo(() => {
    const weapons = config.category === 'martial' ? ALL_MARTIAL_WEAPONS : ALL_SIMPLE_WEAPONS

    if (config.type) {
      return weapons.filter(w => w.type === config.type)
    }

    return weapons
  }, [config.category, config.type])

  // Convert Weapon to EquipmentItem format
  const weaponToEquipmentItem = (weapon: Weapon): EquipmentItem => ({
    id: weapon.id,
    name: weapon.name,
    type: 'weapon',
    quantity: 1,
    weight: weapon.weight,
    value: weapon.cost,
    damage: `${weapon.damage} ${weapon.damageType}`,
    properties: Object.keys(weapon.properties).filter(key =>
      weapon.properties[key as keyof typeof weapon.properties]
    )
  })

  const handleWeaponToggle = (weaponId: string) => {
    let newSelection: string[]

    // Determine max weapons based on shield selection
    // If includeShield is true and shield is selected, can only select 'count' weapons
    // If includeShield is true and shield is NOT selected, can select 2x 'count' weapons
    const maxWeapons = config.includeShield && !includeShield ? config.count * 2 : config.count

    if (selectedWeapons.includes(weaponId)) {
      // Deselect weapon
      newSelection = selectedWeapons.filter(id => id !== weaponId)
    } else if (selectedWeapons.length < maxWeapons) {
      // Select weapon if under limit
      newSelection = [...selectedWeapons, weaponId]
    } else if (maxWeapons === 1) {
      // Replace selection if only one weapon allowed
      newSelection = [weaponId]
    } else {
      return // Can't select more weapons
    }

    setSelectedWeapons(newSelection)

    // Convert selected weapon IDs to equipment items
    const selectedEquipment = newSelection
      .map(id => availableWeapons.find(w => w.id === id))
      .filter((w): w is Weapon => w !== undefined)
      .map(weaponToEquipmentItem)

    onSelect(selectedEquipment, includeShield)
  }

  const handleShieldToggle = () => {
    const newIncludeShield = !includeShield
    setIncludeShield(newIncludeShield)

    // If adding shield, reduce weapons to 'count' if needed
    let weaponsToKeep = selectedWeapons
    if (newIncludeShield && selectedWeapons.length > config.count) {
      weaponsToKeep = selectedWeapons.slice(0, config.count)
      setSelectedWeapons(weaponsToKeep)
    }

    // Convert selected weapon IDs to equipment items
    const selectedEquipment = weaponsToKeep
      .map(id => availableWeapons.find(w => w.id === id))
      .filter((w): w is Weapon => w !== undefined)
      .map(weaponToEquipmentItem)

    onSelect(selectedEquipment, newIncludeShield)
  }

  // Calculate selection count and max
  // If includeShield option is available:
  //   - With shield: need 'count' weapons + shield
  //   - Without shield: need 'count' * 2 weapons
  const maxWeapons = config.includeShield && !includeShield ? config.count * 2 : config.count
  const selectionCount = selectedWeapons.length + (includeShield ? 1 : 0)
  const maxSelections = maxWeapons + (includeShield ? 1 : 0)

  return (
    <Card className="border-amber-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-amber-800">
          <span>{description}</span>
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
            {selectionCount}/{maxSelections} selected
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {config.includeShield ? (
            <>
              Choose <strong>{config.count}</strong> {config.category} weapon{config.count > 1 ? 's' : ''}
              {config.type && ` (${config.type} only)`} and a shield,
              <strong> OR </strong>
              <strong>{config.count * 2}</strong> {config.category} weapon{config.count * 2 > 1 ? 's' : ''}
              {config.type && ` (${config.type} only)`}
            </>
          ) : (
            <>
              Choose <strong>{config.count}</strong> {config.category} weapon{config.count > 1 ? 's' : ''}
              {config.type && ` (${config.type} only)`}
            </>
          )}
        </p>

        {/* Shield option */}
        {config.includeShield && (
          <button
            type="button"
            onClick={handleShieldToggle}
            className={`w-full p-4 border rounded-lg text-left transition-all ${
              includeShield
                ? 'border-amber-400 bg-amber-50 text-amber-900'
                : 'border-gray-200 hover:border-amber-300 hover:bg-amber-25'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Shield</div>
                <div className="text-xs text-muted-foreground">+2 AC</div>
              </div>
              <div className={`w-4 h-4 border-2 rounded transition-all ${
                includeShield ? 'border-amber-500 bg-amber-500' : 'border-gray-300'
              }`}>
                {includeShield && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
          </button>
        )}

        {/* Weapon list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
          {availableWeapons.map((weapon) => {
            const isSelected = selectedWeapons.includes(weapon.id)
            const canSelect = isSelected || selectedWeapons.length < config.count

            return (
              <button
                key={weapon.id}
                type="button"
                onClick={() => handleWeaponToggle(weapon.id)}
                disabled={!canSelect}
                className={`p-3 border rounded-lg text-left transition-all ${
                  isSelected
                    ? 'border-amber-400 bg-amber-50 text-amber-900'
                    : canSelect
                    ? 'border-gray-200 hover:border-amber-300 hover:bg-amber-25'
                    : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium">{weapon.name}</div>
                    <div className="text-xs text-muted-foreground font-mono">
                      {weapon.damage} {weapon.damageType}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {formatWeaponProperties(weapon.properties)}
                    </div>
                  </div>
                  <div className={`w-4 h-4 border-2 rounded transition-all ${
                    isSelected ? 'border-amber-500 bg-amber-500' : 'border-gray-300'
                  }`}>
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {selectedWeapons.length === 0 && !includeShield && (
          <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded p-3">
            Select {config.count} weapon{config.count > 1 ? 's' : ''} to continue
          </div>
        )}
      </CardContent>
    </Card>
  )
}
