import React, { useState, useEffect, useMemo } from 'react'
import { Button, Badge, Card, CardContent, CardHeader, CardTitle } from '../../ui'
import { WizardStepProps } from '../../../types/wizard'
import { useCharacterCreation } from '../../../contexts/CharacterCreationContext'
import { getAbilityModifier, type AbilityName } from '../../../types/dnd5e'
import {
  CLASS_STARTING_EQUIPMENT,
  getClassStartingEquipment,
  type EquipmentItem,
  type EquipmentChoice,
  type EquipmentPack,
  type ClassEquipmentConfig
} from '../../../data/startingEquipment'
import {
  type Spell,
  getSpellsByClass,
  getCantripsByClass
} from '../../../data/spells'

// Using EquipmentPack and ClassEquipmentConfig interfaces from startingEquipment.ts

// Spellcasting Class Info
interface SpellcastingClassInfo {
  spellcastingAbility: AbilityName
  cantripsKnown: number
  spellsKnown?: number
  canPrepareSpells: boolean
  spellSlots: { level: number; slots: number }[]
  ritualCasting?: boolean
  spellcastingFocus?: string
  spellbook?: boolean
  availableSpells: string[] // spell IDs
}

// Using EQUIPMENT_PACKS from startingEquipment.ts

// Using CLASS_STARTING_EQUIPMENT from startingEquipment.ts for comprehensive class coverage

// Spellcasting Class Information
const SPELLCASTING_CLASSES: Record<string, SpellcastingClassInfo> = {
  wizard: {
    spellcastingAbility: 'intelligence',
    cantripsKnown: 3,
    spellsKnown: 6, // in spellbook at 1st level
    canPrepareSpells: true,
    spellSlots: [{ level: 1, slots: 2 }],
    spellbook: true,
    spellcastingFocus: 'Arcane Focus or Component Pouch',
    ritualCasting: true,
    availableSpells: ['wizard']
  },
  cleric: {
    spellcastingAbility: 'wisdom',
    cantripsKnown: 3,
    canPrepareSpells: true,
    spellSlots: [{ level: 1, slots: 2 }],
    spellcastingFocus: 'Holy Symbol',
    ritualCasting: true,
    availableSpells: ['cleric']
  },
  sorcerer: {
    spellcastingAbility: 'charisma',
    cantripsKnown: 4,
    spellsKnown: 2,
    canPrepareSpells: false,
    spellSlots: [{ level: 1, slots: 2 }],
    spellcastingFocus: 'Arcane Focus or Component Pouch',
    availableSpells: ['sorcerer']
  },
  warlock: {
    spellcastingAbility: 'charisma',
    cantripsKnown: 2,
    spellsKnown: 2,
    canPrepareSpells: false,
    spellSlots: [{ level: 1, slots: 1 }], // Pact Magic - short rest recovery
    spellcastingFocus: 'Arcane Focus or Component Pouch',
    availableSpells: ['warlock']
  },
  bard: {
    spellcastingAbility: 'charisma',
    cantripsKnown: 2,
    spellsKnown: 4,
    canPrepareSpells: false,
    spellSlots: [{ level: 1, slots: 2 }],
    spellcastingFocus: 'Musical Instrument',
    ritualCasting: true,
    availableSpells: ['bard']
  },
  druid: {
    spellcastingAbility: 'wisdom',
    cantripsKnown: 2,
    canPrepareSpells: true,
    spellSlots: [{ level: 1, slots: 2 }],
    spellcastingFocus: 'Druidcraft Focus or Component Pouch',
    ritualCasting: true,
    availableSpells: ['druid']
  },
  paladin: {
    spellcastingAbility: 'charisma',
    cantripsKnown: 0, // Paladins get spells at level 2
    spellsKnown: 0, // Paladins get spells at level 2
    canPrepareSpells: true,
    spellSlots: [], // No spell slots at level 1
    spellcastingFocus: 'Holy Symbol',
    availableSpells: ['paladin']
  },
  ranger: {
    spellcastingAbility: 'wisdom',
    cantripsKnown: 0, // Rangers get spells at level 2
    spellsKnown: 0, // Rangers get spells at level 2
    canPrepareSpells: false,
    spellSlots: [], // No spell slots at level 1
    spellcastingFocus: 'Druidcraft Focus or Component Pouch',
    availableSpells: ['ranger']
  }
}

export function EquipmentSpellsStep({ data, onChange, onValidationChange }: WizardStepProps) {
  const { characterData } = useCharacterCreation()
  const [selectedEquipmentChoices, setSelectedEquipmentChoices] = useState<Record<number, number>>({})
  const [selectedSpells, setSelectedSpells] = useState<{
    cantrips: Set<string>
    knownSpells: Set<string>
    preparedSpells?: Set<string>
  }>({ cantrips: new Set(), knownSpells: new Set(), preparedSpells: new Set() })
  const [backgroundData, setBackgroundData] = useState<any>(null)

  const currentData = data || {
    equipment: [],
    spells: [],
    equipmentChoices: {},
    spellChoices: {
      cantrips: [],
      knownSpells: [],
      preparedSpells: []
    }
  }

  // Fetch background data when background changes
  useEffect(() => {
    const fetchBackgroundData = async () => {
      if (characterData.background) {
        try {
          const response = await fetch(`https://dnd-character-manager-api-dev.cybermattlee-llc.workers.dev/api/backgrounds`)
          const result = await response.json()
          if (result.success) {
            const background = result.data.backgrounds.find((bg: any) => bg.id === characterData.background)
            setBackgroundData(background)
          }
        } catch (error) {
          // Background data fetch failed - continue without background equipment
        }
      }
    }

    fetchBackgroundData()
  }, [characterData.background])

  // Get current class data
  const classData = getClassStartingEquipment(characterData.class || '')
  const spellcastingInfo = SPELLCASTING_CLASSES[characterData.class?.toLowerCase()]
  const isSpellcaster = !!spellcastingInfo

  // Get spell lists for current class using comprehensive spell data
  const availableSpells = useMemo(() => {
    if (!isSpellcaster || !characterData.class) return { cantrips: [], spells: [] }

    return {
      cantrips: getCantripsByClass(characterData.class),
      spells: getSpellsByClass(characterData.class, 1) // 1st level spells
    }
  }, [isSpellcaster, characterData.class])

  // Calculate final equipment list
  const finalEquipment = useMemo(() => {
    const equipment: EquipmentItem[] = []

    // Add background equipment
    if (backgroundData?.startingEquipment?.items) {
      backgroundData.startingEquipment.items.forEach((itemName: string) => {
        equipment.push({
          id: itemName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''),
          name: itemName,
          type: 'gear' as const,
          quantity: 1,
          weight: 1, // Default weight for background items
          value: 0, // Background items are free
          description: `Background equipment from ${backgroundData.name}`
        })
      })
    }

    if (!classData) return equipment

    // Add equipment pack items
    equipment.push(...classData.equipmentPack.items)

    // Add additional equipment
    if (classData.additionalEquipment) {
      equipment.push(...classData.additionalEquipment)
    }

    // Add equipment from choices
    classData.choices.forEach((choice, choiceIndex) => {
      const selectedOption = selectedEquipmentChoices[choiceIndex]
      if (selectedOption !== undefined && choice.options[selectedOption]) {
        equipment.push(...choice.options[selectedOption])
      }
    })

    return equipment
  }, [classData, selectedEquipmentChoices, backgroundData])

  // Calculate total encumbrance
  const totalWeight = finalEquipment.reduce((total, item) => total + (item.weight || 0) * item.quantity, 0)
  const strengthScore = characterData.stats?.strength || 10
  const carryingCapacity = strengthScore * 15 // in pounds
  const encumberedAt = carryingCapacity / 3 * 2 // heavily encumbered at 2/3 capacity
  
  // Handle equipment choice selection
  const handleEquipmentChoice = (choiceIndex: number, optionIndex: number) => {
    const newChoices = { ...selectedEquipmentChoices, [choiceIndex]: optionIndex }
    setSelectedEquipmentChoices(newChoices)
  }

  // Handle spell selection
  const handleSpellSelection = (spell: Spell, type: 'cantrip' | 'known') => {
    const newSelected = { ...selectedSpells }
    
    if (type === 'cantrip') {
      if (newSelected.cantrips.has(spell.id)) {
        newSelected.cantrips.delete(spell.id)
      } else if (newSelected.cantrips.size < (spellcastingInfo?.cantripsKnown || 0)) {
        newSelected.cantrips.add(spell.id)
      }
    } else {
      if (newSelected.knownSpells.has(spell.id)) {
        newSelected.knownSpells.delete(spell.id)
      } else if (newSelected.knownSpells.size < (spellcastingInfo?.spellsKnown || 0)) {
        newSelected.knownSpells.add(spell.id)
      }
    }
    
    setSelectedSpells(newSelected)
  }

  // Calculate prepared spells for classes that prepare spells
  const preparedSpellsLimit = useMemo(() => {
    if (!spellcastingInfo || !spellcastingInfo.canPrepareSpells) return 0
    
    const abilityModifier = getAbilityModifier(characterData.stats?.[spellcastingInfo.spellcastingAbility] || 10)
    const level = characterData.level || 1
    
    return Math.max(1, abilityModifier + level)
  }, [spellcastingInfo, characterData.stats, characterData.level])

  // Update parent component when data changes
  useEffect(() => {
    const spellsArray = [
      ...Array.from(selectedSpells.cantrips).map(id => {
        const spell = availableSpells.cantrips.find(s => s.id === id)!
        return {
          id: spell.id,
          name: spell.name,
          level: spell.level,
          school: spell.school,
          castingTime: spell.castingTime,
          range: spell.range,
          components: spell.components,
          duration: spell.duration,
          description: spell.description,
          prepared: true // Cantrips are always prepared
        }
      }),
      ...Array.from(selectedSpells.knownSpells).map(id => {
        const spell = availableSpells.spells.find(s => s.id === id)!
        return {
          id: spell.id,
          name: spell.name,
          level: spell.level,
          school: spell.school,
          castingTime: spell.castingTime,
          range: spell.range,
          components: spell.components,
          duration: spell.duration,
          description: spell.description,
          prepared: !spellcastingInfo?.canPrepareSpells || selectedSpells.preparedSpells?.has(spell.id)
        }
      })
    ]

    const equipmentArray = finalEquipment.map(item => ({
      id: item.id,
      name: item.name,
      type: item.type,
      description: item.description,
      quantity: item.quantity,
      weight: item.weight,
      value: item.value
    }))

    const newData = {
      equipment: equipmentArray,
      spells: spellsArray,
      equipmentChoices: selectedEquipmentChoices,
      spellChoices: {
        cantrips: Array.from(selectedSpells.cantrips),
        knownSpells: Array.from(selectedSpells.knownSpells),
        preparedSpells: Array.from(selectedSpells.preparedSpells || new Set())
      }
    }

    onChange(newData)

    // Validation
    const errors: string[] = []
    
    // Check equipment choices
    if (classData) {
      classData.choices.forEach((choice, index) => {
        if (selectedEquipmentChoices[index] === undefined) {
          errors.push(`Make a selection for: ${choice.description}`)
        }
      })
    }

    // Check spell choices for spellcasters
    if (isSpellcaster && spellcastingInfo) {
      if (selectedSpells.cantrips.size < spellcastingInfo.cantripsKnown) {
        errors.push(`Select ${spellcastingInfo.cantripsKnown} cantrips (${selectedSpells.cantrips.size} selected)`)
      }
      
      if (spellcastingInfo.spellsKnown && selectedSpells.knownSpells.size < spellcastingInfo.spellsKnown) {
        errors.push(`Select ${spellcastingInfo.spellsKnown} spells (${selectedSpells.knownSpells.size} selected)`)
      }
    }

    onValidationChange(errors.length === 0, errors)
  }, [finalEquipment, selectedSpells, selectedEquipmentChoices, availableSpells, classData, isSpellcaster, spellcastingInfo, onChange, onValidationChange])

  if (!characterData.class) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-muted-foreground mb-2">No Class Selected</h3>
          <p className="text-sm text-muted-foreground">Please select a class in the previous step to configure equipment and spells.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Equipment & Spells</h2>
        <p className="text-muted-foreground">
          Configure your starting equipment and spells based on your {characterData.class} class and {characterData.background || 'selected'} background.
        </p>
      </div>

      {/* Equipment Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-amber-800">Starting Equipment</h3>
          <Badge variant="outline" className="border-amber-300 text-amber-800">
            {finalEquipment.length} items • {totalWeight.toFixed(1)} lbs
          </Badge>
        </div>

        {/* Background Equipment */}
        {backgroundData?.startingEquipment?.items && (
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-blue-800">
                <span>Background Equipment ({backgroundData.name})</span>
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                  {backgroundData.startingEquipment.items.length} items
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Equipment provided by your {backgroundData.name} background.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {backgroundData.startingEquipment.items.map((itemName: string, index: number) => (
                  <div key={index} className="flex items-center p-2 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex-1">
                      <div className="font-medium text-sm text-blue-900">{itemName}</div>
                      <div className="text-xs text-blue-600">Background item</div>
                    </div>
                  </div>
                ))}
              </div>

              {backgroundData.startingEquipment.money && (
                <div className="pt-3 border-t border-blue-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-700 font-medium">Starting Money</span>
                    <span className="text-blue-900 font-semibold">{backgroundData.startingEquipment.money}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Equipment Pack */}
        {classData && (
          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-amber-800">
                <span>{classData.equipmentPack.name}</span>
                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                  {classData.equipmentPack.items.length} items
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {classData.equipmentPack.description}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {classData.equipmentPack.items.map((item, index) => (
                  <div key={index} className="p-2 border border-amber-200 bg-amber-50 rounded text-sm">
                    <div className="font-medium text-amber-900">{item.name}</div>
                    {item.quantity > 1 && (
                      <div className="text-xs text-amber-700">Quantity: {item.quantity}</div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Equipment Choices */}
        {classData && classData.choices.map((choice, choiceIndex) => (
          <Card key={choiceIndex} className="border-amber-200">
            <CardHeader>
              <CardTitle className="text-amber-800">{choice.description}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {choice.options.map((option, optionIndex) => (
                <button
                  key={optionIndex}
                  type="button"
                  onClick={() => handleEquipmentChoice(choiceIndex, optionIndex)}
                  className={`w-full p-4 border rounded-lg text-left transition-all ${
                    selectedEquipmentChoices[choiceIndex] === optionIndex
                      ? 'border-amber-400 bg-amber-50 text-amber-900'
                      : 'border-gray-200 hover:border-amber-300 hover:bg-amber-25'
                  }`}
                >
                  <div className="space-y-2">
                    {option.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{item.name}</div>
                          {item.description && (
                            <div className="text-xs text-muted-foreground">{item.description}</div>
                          )}
                          {item.damage && (
                            <div className="text-xs font-mono text-blue-600">{item.damage}</div>
                          )}
                        </div>
                        <div className="text-right text-xs text-muted-foreground">
                          {item.quantity > 1 && <div>×{item.quantity}</div>}
                          {item.weight && <div>{item.weight} lb</div>}
                          {item.armorClass && <div>AC {item.armorClass}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        ))}

        {/* Additional Equipment */}
        {classData && classData.additionalEquipment && classData.additionalEquipment.length > 0 && (
          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="text-amber-800">Additional Class Equipment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {classData.additionalEquipment.map((item, index) => (
                  <div key={index} className="p-3 border border-amber-200 bg-amber-50 rounded">
                    <div className="font-medium text-amber-900">{item.name}</div>
                    {item.description && (
                      <div className="text-xs text-amber-700 mt-1">{item.description}</div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Encumbrance */}
        <Card className="border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-800">Carrying Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Current Weight:</span>
                <span className="font-medium">{totalWeight.toFixed(1)} lbs</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Carrying Capacity:</span>
                <span>{carryingCapacity} lbs (STR {strengthScore})</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    totalWeight > carryingCapacity ? 'bg-red-500' :
                    totalWeight > encumberedAt ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(100, (totalWeight / carryingCapacity) * 100)}%` }}
                />
              </div>
              {totalWeight > carryingCapacity && (
                <p className="text-xs text-red-600">Overloaded! Movement speed reduced.</p>
              )}
              {totalWeight > encumberedAt && totalWeight <= carryingCapacity && (
                <p className="text-xs text-yellow-600">Heavily encumbered. Movement speed reduced.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Spells Section */}
      {isSpellcaster && spellcastingInfo && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-purple-800">Spellcasting</h3>
            <Badge variant="outline" className="border-purple-300 text-purple-800">
              {selectedSpells.cantrips.size + selectedSpells.knownSpells.size} spells selected
            </Badge>
          </div>

          {/* Spellcasting Info */}
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-800">Spellcasting Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium">Spellcasting Ability</div>
                <div className="text-sm text-muted-foreground capitalize">{spellcastingInfo.spellcastingAbility}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Spellcasting Focus</div>
                <div className="text-sm text-muted-foreground">{spellcastingInfo.spellcastingFocus}</div>
              </div>
              <div>
                <div className="text-sm font-medium">1st Level Spell Slots</div>
                <div className="text-sm text-muted-foreground">{spellcastingInfo.spellSlots[0]?.slots || 0}</div>
              </div>
              {spellcastingInfo.canPrepareSpells && (
                <div>
                  <div className="text-sm font-medium">Spells You Can Prepare</div>
                  <div className="text-sm text-muted-foreground">{preparedSpellsLimit}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cantrips */}
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-purple-800">
                <span>Cantrips (Level 0)</span>
                <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                  {selectedSpells.cantrips.size}/{spellcastingInfo.cantripsKnown} selected
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Cantrips are always known and prepared. They don't use spell slots and can be cast at will.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableSpells.cantrips.map((spell) => {
                  const isSelected = selectedSpells.cantrips.has(spell.id)
                  const canSelect = isSelected || selectedSpells.cantrips.size < spellcastingInfo.cantripsKnown
                  
                  return (
                    <button
                      key={spell.id}
                      type="button"
                      onClick={() => handleSpellSelection(spell, 'cantrip')}
                      disabled={!canSelect}
                      className={`p-3 border rounded-lg text-left transition-all ${
                        isSelected
                          ? 'border-purple-400 bg-purple-50 text-purple-900'
                          : canSelect
                          ? 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
                          : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium">{spell.name}</div>
                          <div className="text-xs text-muted-foreground">{spell.school}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {spell.castingTime} • {spell.range}
                          </div>
                        </div>
                        <div className={`w-4 h-4 border-2 rounded transition-all ${
                          isSelected ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
                        }`}>
                          {isSelected && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2 line-clamp-2">
                        {spell.description}
                      </div>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* 1st Level Spells */}
          {spellcastingInfo.spellsKnown && spellcastingInfo.spellsKnown > 0 && (
            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-purple-800">
                  <span>1st Level Spells</span>
                  <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                    {selectedSpells.knownSpells.size}/{spellcastingInfo.spellsKnown} selected
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {spellcastingInfo.canPrepareSpells 
                    ? `Select spells to add to your spellbook. You can prepare ${preparedSpellsLimit} spells from those you know.`
                    : 'Select the spells you know. Known spells are always available to cast when you have spell slots.'}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {availableSpells.spells.map((spell) => {
                    const isSelected = selectedSpells.knownSpells.has(spell.id)
                    const canSelect = isSelected || selectedSpells.knownSpells.size < spellcastingInfo.spellsKnown!
                    
                    return (
                      <button
                        key={spell.id}
                        type="button"
                        onClick={() => handleSpellSelection(spell, 'known')}
                        disabled={!canSelect}
                        className={`p-3 border rounded-lg text-left transition-all ${
                          isSelected
                            ? 'border-purple-400 bg-purple-50 text-purple-900'
                            : canSelect
                            ? 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
                            : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium">{spell.name}</div>
                            <div className="text-xs text-muted-foreground">{spell.school}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {spell.castingTime} • {spell.range} • {spell.duration}
                            </div>
                            {spell.concentration && (
                              <Badge size="sm" variant="outline" className="mt-1 text-xs">Concentration</Badge>
                            )}
                            {spell.ritual && (
                              <Badge size="sm" variant="outline" className="mt-1 ml-1 text-xs">Ritual</Badge>
                            )}
                          </div>
                          <div className={`w-4 h-4 border-2 rounded transition-all ${
                            isSelected ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
                          }`}>
                            {isSelected && (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground mt-2 line-clamp-2">
                          {spell.description}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Character Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="space-y-1">
              <div className="text-muted-foreground">Equipment Items</div>
              <div className="text-lg font-semibold text-amber-700">{finalEquipment.length}</div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground">Total Weight</div>
              <div className="text-lg font-semibold text-amber-700">{totalWeight.toFixed(1)} lbs</div>
            </div>
            {isSpellcaster && (
              <>
                <div className="space-y-1">
                  <div className="text-muted-foreground">Cantrips Known</div>
                  <div className="text-lg font-semibold text-purple-700">{selectedSpells.cantrips.size}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground">Spells Known</div>
                  <div className="text-lg font-semibold text-purple-700">{selectedSpells.knownSpells.size}</div>
                </div>
              </>
            )}
          </div>
          
          {isSpellcaster && spellcastingInfo && (
            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Spellcasting Ability</div>
                  <div className="font-medium capitalize">
                    {spellcastingInfo.spellcastingAbility} ({getAbilityModifier(characterData.stats?.[spellcastingInfo.spellcastingAbility] || 10) >= 0 ? '+' : ''}{getAbilityModifier(characterData.stats?.[spellcastingInfo.spellcastingAbility] || 10)})
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Spell Attack Bonus</div>
                  <div className="font-medium">
                    +{(characterData.proficiencyBonus || 2) + getAbilityModifier(characterData.stats?.[spellcastingInfo.spellcastingAbility] || 10)}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Spell Save DC</div>
                  <div className="font-medium">
                    {8 + (characterData.proficiencyBonus || 2) + getAbilityModifier(characterData.stats?.[spellcastingInfo.spellcastingAbility] || 10)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}