import React, { useState } from 'react'
import { Character } from '../../../types/character'
import { DiceRoll, rollInitiative, getAbilityModifier } from '../../../utils/dice'
import { Button } from '../../ui'

interface CoreStatsProps {
  character: Character
  onUpdate: (updates: Partial<Character>) => void
  onRoll: (roll: DiceRoll) => void
}

export default function CoreStats({ character, onUpdate, onRoll }: CoreStatsProps) {
  const [damageInput, setDamageInput] = useState('')
  const [healingInput, setHealingInput] = useState('')

  const dexModifier = getAbilityModifier(character.stats.dexterity)

  const handleDamage = () => {
    const damage = parseInt(damageInput)
    if (isNaN(damage) || damage <= 0) return

    const newCurrent = Math.max(0, character.hitPoints.current - damage)
    onUpdate({
      hitPoints: {
        ...character.hitPoints,
        current: newCurrent
      }
    })
    setDamageInput('')
  }

  const handleHealing = () => {
    const healing = parseInt(healingInput)
    if (isNaN(healing) || healing <= 0) return

    const newCurrent = Math.min(
      character.hitPoints.maximum + character.hitPoints.temporary,
      character.hitPoints.current + healing
    )
    onUpdate({
      hitPoints: {
        ...character.hitPoints,
        current: newCurrent
      }
    })
    setHealingInput('')
  }

  const handleHPChange = (field: 'current' | 'maximum' | 'temporary', value: number) => {
    const newValue = Math.max(0, value)
    onUpdate({
      hitPoints: {
        ...character.hitPoints,
        [field]: newValue
      }
    })
  }

  const handleInitiativeRoll = () => {
    const roll = rollInitiative(dexModifier)
    onRoll(roll)
    onUpdate({ initiative: roll.total })
  }

  const getHealthPercentage = () => {
    const maxHP = character.hitPoints.maximum + character.hitPoints.temporary
    return maxHP > 0 ? (character.hitPoints.current / maxHP) * 100 : 0
  }

  const getHealthColor = () => {
    const percentage = getHealthPercentage()
    if (percentage > 50) return 'bg-green-500'
    if (percentage > 25) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Core Stats</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Armor Class */}
        <div className="text-center">
          <div className="border-2 border-gray-300 rounded-lg p-4">
            <div className="text-3xl font-bold text-gray-900">
              {character.armorClass}
            </div>
            <div className="text-sm text-gray-500 uppercase tracking-wide">
              Armor Class
            </div>
          </div>
        </div>

        {/* Initiative */}
        <div className="text-center">
          <button
            onClick={handleInitiativeRoll}
            className="w-full border-2 border-gray-300 rounded-lg p-4 hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            <div className="text-3xl font-bold text-gray-900">
              {character.initiative !== undefined ? `+${character.initiative}` : `+${dexModifier}`}
            </div>
            <div className="text-sm text-gray-500 uppercase tracking-wide">
              Initiative
            </div>
          </button>
        </div>

        {/* Speed */}
        <div className="text-center">
          <div className="border-2 border-gray-300 rounded-lg p-4">
            <div className="text-3xl font-bold text-gray-900">
              {character.speed || 30}
            </div>
            <div className="text-sm text-gray-500 uppercase tracking-wide">
              Speed
            </div>
          </div>
        </div>

      </div>

      {/* Hit Points Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-medium text-gray-900">Hit Points</h4>

          {/* Health Bar */}
          <div className="flex-1 mx-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${getHealthColor()}`}
                style={{ width: `${getHealthPercentage()}%` }}
              />
            </div>
          </div>
        </div>

        {/* HP Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Current
            </label>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleHPChange('current', character.hitPoints.current - 1)}
                className="w-8 h-8 rounded bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center text-sm font-medium"
              >
                -
              </button>
              <input
                type="number"
                value={character.hitPoints.current}
                onChange={(e) => handleHPChange('current', parseInt(e.target.value) || 0)}
                className="w-16 text-center text-lg font-semibold border border-gray-300 rounded px-2 py-1"
                min="0"
              />
              <button
                onClick={() => handleHPChange('current', character.hitPoints.current + 1)}
                className="w-8 h-8 rounded bg-green-100 hover:bg-green-200 text-green-600 flex items-center justify-center text-sm font-medium"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Maximum
            </label>
            <input
              type="number"
              value={character.hitPoints.maximum}
              onChange={(e) => handleHPChange('maximum', parseInt(e.target.value) || 0)}
              className="w-full text-center text-lg font-semibold border border-gray-300 rounded px-2 py-1"
              min="1"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Temporary
            </label>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleHPChange('temporary', character.hitPoints.temporary - 1)}
                className="w-8 h-8 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center text-sm font-medium"
                disabled={character.hitPoints.temporary <= 0}
              >
                -
              </button>
              <input
                type="number"
                value={character.hitPoints.temporary}
                onChange={(e) => handleHPChange('temporary', parseInt(e.target.value) || 0)}
                className="w-16 text-center text-lg font-semibold border border-gray-300 rounded px-2 py-1"
                min="0"
              />
              <button
                onClick={() => handleHPChange('temporary', character.hitPoints.temporary + 1)}
                className="w-8 h-8 rounded bg-blue-100 hover:bg-blue-200 text-blue-600 flex items-center justify-center text-sm font-medium"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Quick Damage/Healing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Damage"
              value={damageInput}
              onChange={(e) => setDamageInput(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-3 py-2"
              min="1"
            />
            <Button
              onClick={handleDamage}
              variant="outline"
              size="sm"
              disabled={!damageInput || parseInt(damageInput) <= 0}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              Take Damage
            </Button>
          </div>

          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Healing"
              value={healingInput}
              onChange={(e) => setHealingInput(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-3 py-2"
              min="1"
            />
            <Button
              onClick={handleHealing}
              variant="outline"
              size="sm"
              disabled={!healingInput || parseInt(healingInput) <= 0}
              className="text-green-600 border-green-300 hover:bg-green-50"
            >
              Heal
            </Button>
          </div>
        </div>

        {/* HP Summary */}
        <div className="mt-4 text-center">
          <span className="text-2xl font-bold text-gray-900">
            {character.hitPoints.current}
          </span>
          <span className="text-gray-500 mx-1">/</span>
          <span className="text-lg text-gray-600">
            {character.hitPoints.maximum}
            {character.hitPoints.temporary > 0 && (
              <>
                <span className="text-blue-600 ml-1">
                  (+{character.hitPoints.temporary})
                </span>
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  )
}