import React from 'react'
import { Character, SKILLS, AbilityScore } from '../../../types/character'
import { DiceRoll, rollSkillCheck, getAbilityModifier, formatAbilityModifier } from '../../../utils/dice'

interface SkillsPanelProps {
  character: Character
  onUpdate: (updates: Partial<Character>) => void
  onRoll: (roll: DiceRoll) => void
}

export default function SkillsPanel({ character, onUpdate, onRoll }: SkillsPanelProps) {
  const handleSkillCheck = (skillName: string) => {
    const governingAbility = SKILLS[skillName]
    const abilityModifier = getAbilityModifier(character.stats[governingAbility])
    const skillBonus = character.skills[skillName] || 0

    // Determine proficiency level
    let proficiency: 'none' | 'proficient' | 'expertise' = 'none'
    if (skillBonus > abilityModifier) {
      if (skillBonus === abilityModifier + character.proficiencyBonus) {
        proficiency = 'proficient'
      } else if (skillBonus === abilityModifier + (character.proficiencyBonus * 2)) {
        proficiency = 'expertise'
      }
    }

    const roll = rollSkillCheck(
      abilityModifier,
      character.proficiencyBonus,
      proficiency,
      skillName
    )
    onRoll(roll)
  }

  const getSkillProficiencyIcon = (skillName: string) => {
    const governingAbility = SKILLS[skillName]
    const abilityModifier = getAbilityModifier(character.stats[governingAbility])
    const skillBonus = character.skills[skillName] || 0

    if (skillBonus === abilityModifier + (character.proficiencyBonus * 2)) {
      return '◆' // Expertise
    } else if (skillBonus > abilityModifier) {
      return '●' // Proficient
    }
    return '○' // Not proficient
  }

  const getSkillModifier = (skillName: string) => {
    return character.skills[skillName] || getAbilityModifier(character.stats[SKILLS[skillName]])
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Skills</h3>

      <div className="space-y-1">
        {Object.entries(SKILLS).map(([skillName, governingAbility]) => {
          const modifier = getSkillModifier(skillName)
          const proficiencyIcon = getSkillProficiencyIcon(skillName)

          return (
            <button
              key={skillName}
              onClick={() => handleSkillCheck(skillName)}
              className="w-full flex items-center justify-between px-3 py-2 text-sm rounded hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <span className={`text-xs font-mono ${
                  proficiencyIcon === '◆' ? 'text-purple-600' :
                  proficiencyIcon === '●' ? 'text-blue-600' : 'text-gray-400'
                }`}>
                  {proficiencyIcon}
                </span>

                <span className="text-left text-gray-900 group-hover:text-gray-700">
                  {skillName}
                </span>

                <span className="text-xs text-gray-400 uppercase">
                  {governingAbility.slice(0, 3)}
                </span>
              </div>

              <span className="font-mono text-gray-600 group-hover:text-gray-800">
                {formatAbilityModifier(modifier)}
              </span>
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">○</span>
            <span>Not proficient</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-blue-600">●</span>
            <span>Proficient</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-purple-600">◆</span>
            <span>Expertise</span>
          </div>
        </div>
      </div>

      {/* Passive Perception Highlight */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">
            Passive Perception
          </span>
          <span className="text-lg font-semibold text-gray-900">
            {10 + getSkillModifier('Perception')}
          </span>
        </div>
      </div>
    </div>
  )
}