import React from 'react'
import { Character } from '../../../types/character'
import { Badge } from '../../ui'

interface CharacterHeaderProps {
  character: Character
  onUpdate: (updates: Partial<Character>) => void
}

export default function CharacterHeader({ character, onUpdate }: CharacterHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Character Name & Basic Info */}
        <div className="lg:col-span-2">
          <div className="space-y-3">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{character.name}</h1>
              <p className="text-lg text-gray-600">
                Level {character.level} {character.race} {character.class}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" size="sm">
                {character.background}
              </Badge>
              <Badge variant="outline" size="sm">
                {character.alignment}
              </Badge>
            </div>
          </div>
        </div>

        {/* Experience & Proficiency */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Experience Points
            </label>
            <div className="text-lg font-semibold text-gray-900">
              0 XP {/* TODO: Add experience points to character model */}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Proficiency Bonus
            </label>
            <div className="text-lg font-semibold text-gray-900">
              +{character.proficiencyBonus}
            </div>
          </div>
        </div>

        {/* Inspiration & Passive Perception */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Inspiration
            </label>
            <button
              onClick={() => onUpdate({ inspiration: !character.inspiration })}
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                character.inspiration
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : 'border-gray-300 hover:border-blue-400'
              }`}
            >
              {character.inspiration && (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Passive Perception
            </label>
            <div className="text-lg font-semibold text-gray-900">
              {10 + (character.skills?.Perception || 0)}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}