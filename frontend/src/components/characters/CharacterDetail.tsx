import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link } from 'react-router-dom'
import { PencilIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import { RootState, AppDispatch } from '../../stores/store'
import { fetchCharacterById } from '../../features/characters/charactersSlice'

export default function CharacterDetail() {
  const dispatch = useDispatch<AppDispatch>()
  const { id } = useParams<{ id: string }>()
  const { selectedCharacter: character, loading, error } = useSelector(
    (state: RootState) => state.characters
  )

  useEffect(() => {
    if (id) {
      dispatch(fetchCharacterById(id))
    }
  }, [dispatch, id])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-sm text-red-600">{error}</div>
      </div>
    )
  }

  if (!character) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-2 text-sm font-medium text-gray-900">Character not found</h3>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          to="/characters"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to Characters
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">{character.name}</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Level {character.level} {character.race} {character.class}
            </p>
          </div>
          <Link
            to={`/characters/${character.id}/edit`}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <PencilIcon className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </div>
        
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Background</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{character.background}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Alignment</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{character.alignment}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Armor Class</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{character.armorClass}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Hit Points</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {character.hitPoints.current} / {character.hitPoints.maximum}
                {character.hitPoints.temporary > 0 && ` (+${character.hitPoints.temporary} temp)`}
              </dd>
            </div>
          </dl>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <h4 className="text-sm font-medium text-gray-500 mb-3">Ability Scores</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Object.entries(character.stats).map(([stat, value]) => (
              <div key={stat} className="text-center">
                <div className="text-xs font-medium text-gray-500 uppercase">{stat}</div>
                <div className="text-2xl font-bold text-gray-900">{value}</div>
                <div className="text-sm text-gray-600">
                  {value >= 10 ? '+' : ''}{Math.floor((value - 10) / 2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {character.notes && (
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <h4 className="text-sm font-medium text-gray-500 mb-3">Notes</h4>
            <p className="text-sm text-gray-900 whitespace-pre-wrap">{character.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}