import React, { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { RootState, AppDispatch } from '../../stores/store'
import { fetchCharacterById, updateCharacter } from '../../features/characters/charactersSlice'
import { Character } from '../../types/character'
import { DiceRoll } from '../../utils/dice'

// Import sheet components
import CharacterHeader from './sheet/CharacterHeader'
import AbilityScores from './sheet/AbilityScores'
import CoreStats from './sheet/CoreStats'
import SkillsPanel from './sheet/SkillsPanel'

interface RollResult {
  result: DiceRoll
  timestamp: number
}

export default function CharacterSheet() {
  const dispatch = useDispatch<AppDispatch>()
  const { id } = useParams<{ id: string }>()
  const { selectedCharacter: character, loading, error } = useSelector(
    (state: RootState) => state.characters
  )

  // Local state for real-time updates before API sync
  const [localCharacter, setLocalCharacter] = useState<Character | null>(null)
  const [recentRolls, setRecentRolls] = useState<RollResult[]>([])
  const [isUpdating, setIsUpdating] = useState(false)

  // Sync character data from Redux to local state
  useEffect(() => {
    if (character) {
      setLocalCharacter(character)
    }
  }, [character])

  // Load character data
  useEffect(() => {
    if (id) {
      dispatch(fetchCharacterById(id))
    }
  }, [dispatch, id])

  // Debounced API update function
  const debouncedUpdate = useCallback(
    debounce((updatedCharacter: Character) => {
      setIsUpdating(true)
      dispatch(updateCharacter({ id: updatedCharacter.id, data: updatedCharacter }))
        .finally(() => setIsUpdating(false))
    }, 1000),
    [dispatch]
  )

  // Update character data locally and trigger debounced API save
  const updateCharacterData = useCallback((updates: Partial<Character>) => {
    if (!localCharacter) return

    const updatedCharacter = { ...localCharacter, ...updates }
    setLocalCharacter(updatedCharacter)
    debouncedUpdate(updatedCharacter)
  }, [localCharacter, debouncedUpdate])

  // Add a roll result to recent rolls
  const addRollResult = useCallback((result: DiceRoll) => {
    const rollResult: RollResult = {
      result,
      timestamp: Date.now()
    }

    setRecentRolls(prev => {
      // Keep only the most recent 10 rolls
      const updated = [rollResult, ...prev].slice(0, 10)
      return updated
    })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Character</h3>
            <p className="text-sm text-red-600 mb-4">{error}</p>
            <Link
              to="/characters"
              className="inline-flex items-center text-sm text-red-700 hover:text-red-900"
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back to Characters
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!localCharacter) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Character not found</h3>
            <Link
              to="/characters"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back to Characters
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-2 sm:px-4">
      {/* Navigation */}
      <div className="max-w-7xl mx-auto mb-6">
        <Link
          to="/characters"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to Characters
        </Link>

        {/* Save indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`h-2 w-2 rounded-full ${
              isUpdating ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'
            }`} />
            <span className="text-xs text-gray-500">
              {isUpdating ? 'Saving...' : 'All changes saved'}
            </span>
          </div>
        </div>
      </div>

      {/* Character Sheet Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">

          {/* Header - Full Width */}
          <div className="lg:col-span-12">
            <CharacterHeader
              character={localCharacter}
              onUpdate={updateCharacterData}
            />
          </div>

          {/* Left Column - Ability Scores */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              <AbilityScores
                character={localCharacter}
                onUpdate={updateCharacterData}
                onRoll={addRollResult}
              />
            </div>
          </div>

          {/* Center Column - Core Stats & Skills */}
          <div className="lg:col-span-6">
            <div className="space-y-4">
              <CoreStats
                character={localCharacter}
                onUpdate={updateCharacterData}
                onRoll={addRollResult}
              />

              <SkillsPanel
                character={localCharacter}
                onUpdate={updateCharacterData}
                onRoll={addRollResult}
              />
            </div>
          </div>

          {/* Right Column - Recent Rolls & Combat */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              {/* Recent Rolls Panel */}
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Recent Rolls</h3>
                {recentRolls.length === 0 ? (
                  <p className="text-xs text-gray-500 italic">No rolls yet</p>
                ) : (
                  <div className="space-y-2">
                    {recentRolls.slice(0, 5).map((roll, index) => (
                      <div key={roll.timestamp} className="text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 truncate">
                            {roll.result.description}
                          </span>
                          <span className="font-mono font-medium text-gray-900 ml-2">
                            {roll.result.total}
                          </span>
                        </div>
                        <div className="text-gray-400 font-mono">
                          {roll.result.roll}
                          {roll.result.modifier !== 0 &&
                            ` ${roll.result.modifier >= 0 ? '+' : ''}${roll.result.modifier}`
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}