import React from 'react'
import { Character, AbilityScore } from '../../../types/character'
import { DiceRoll, rollAbilityCheck, rollSavingThrow, getAbilityModifier, formatAbilityModifier } from '../../../utils/dice'

interface AbilityScoresProps {
  character: Character
  onUpdate: (updates: Partial<Character>) => void
  onRoll: (roll: DiceRoll) => void
}

const ABILITY_NAMES: { key: AbilityScore; label: string; short: string }[] = [
  { key: 'strength', label: 'Strength', short: 'STR' },
  { key: 'dexterity', label: 'Dexterity', short: 'DEX' },
  { key: 'constitution', label: 'Constitution', short: 'CON' },
  { key: 'intelligence', label: 'Intelligence', short: 'INT' },
  { key: 'wisdom', label: 'Wisdom', short: 'WIS' },
  { key: 'charisma', label: 'Charisma', short: 'CHA' }
]

export default function AbilityScores({ character, onUpdate, onRoll }: AbilityScoresProps) {
  const handleAbilityCheck = (ability: AbilityScore) => {
    const abilityScore = character.stats[ability]
    const modifier = getAbilityModifier(abilityScore)
    const roll = rollAbilityCheck(modifier, `${ABILITY_NAMES.find(a => a.key === ability)?.label} Check`)
    onRoll(roll)
  }

  const handleSavingThrow = (ability: AbilityScore) => {
    const abilityScore = character.stats[ability]
    const modifier = getAbilityModifier(abilityScore)
    const savingThrowBonus = character.savingThrows[ability] || 0
    const isProficient = savingThrowBonus > modifier

    const roll = rollSavingThrow(
      modifier,
      character.proficiencyBonus,
      isProficient,
      ABILITY_NAMES.find(a => a.key === ability)?.label || ability
    )
    onRoll(roll)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Ability Scores</h3>

      <div className="space-y-4">
        {ABILITY_NAMES.map(({ key, label, short }) => {
          const score = character.stats[key]
          const modifier = getAbilityModifier(score)
          const savingThrowBonus = character.savingThrows[key] || 0
          const isProficient = savingThrowBonus > modifier

          return (
            <div key={key} className="border border-gray-200 rounded-lg p-4">
              {/* Ability Name */}
              <div className="text-center mb-3">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {label}
                </div>
                <div className="text-xs text-gray-400">{short}</div>
              </div>

              {/* Ability Score */}
              <div className="text-center mb-3">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {score}
                </div>
                <div className="text-lg text-gray-600">
                  {formatAbilityModifier(modifier)}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                {/* Ability Check */}
                <button
                  onClick={() => handleAbilityCheck(key)}
                  className="w-full px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded hover:bg-gray-100 hover:border-gray-400 transition-colors"
                >
                  Check
                </button>

                {/* Saving Throw */}
                <button
                  onClick={() => handleSavingThrow(key)}
                  className={`w-full px-3 py-2 text-sm font-medium border rounded transition-colors ${
                    isProficient
                      ? 'text-blue-700 bg-blue-50 border-blue-300 hover:bg-blue-100'
                      : 'text-gray-700 bg-gray-50 border-gray-300 hover:bg-gray-100 hover:border-gray-400'
                  }`}
                >
                  Save {formatAbilityModifier(isProficient ? savingThrowBonus : modifier)}
                  {isProficient && (
                    <span className="ml-1 text-blue-500">●</span>
                  )}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          <span className="text-blue-500">●</span> Proficient in saving throw
        </div>
      </div>
    </div>
  )
}