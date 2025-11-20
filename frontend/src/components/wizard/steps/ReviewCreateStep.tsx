import React, { useState } from 'react'
import { Badge, Button } from '../../ui'
import { WizardStepProps } from '../../../types/wizard'
import { useCharacterCreation } from '../../../contexts/CharacterCreationContext'
import { LoginModal } from '../../auth/LoginModal'
import { api } from '../../../services/api'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'

function getModifier(score: number): number {
  return Math.floor((score - 10) / 2)
}

function formatModifier(modifier: number): string {
  return modifier >= 0 ? `+${modifier}` : `${modifier}`
}

export function ReviewCreateStep({ onValidationChange }: WizardStepProps) {
  const navigate = useNavigate()
  const { checkAuthStatus } = useAuth()
  const { characterData } = useCharacterCreation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [pendingCharacterData, setPendingCharacterData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  // Always valid since this is just a review
  React.useEffect(() => {
    onValidationChange(true, [])
  }, [onValidationChange])

  const handleCreateCharacter = async () => {
    const characterPayload = {
      name: characterData.name,
      race: characterData.race,
      characterClass: characterData.class, // Fixed: API expects 'characterClass' not 'class'
      level: characterData.level || 1,
      background: characterData.background,
      alignment: characterData.alignment,
      strength: characterData.stats?.strength || 10,
      dexterity: characterData.stats?.dexterity || 10,
      constitution: characterData.stats?.constitution || 10,
      intelligence: characterData.stats?.intelligence || 10,
      wisdom: characterData.stats?.wisdom || 10,
      charisma: characterData.stats?.charisma || 10,
      hitPointsMax: characterData.hitPoints?.maximum || 8,
      hitPointsCurrent: characterData.hitPoints?.current || characterData.hitPoints?.maximum || 8,
      armorClass: characterData.armorClass || 10,
      speed: 30, // Default D&D speed
      experiencePoints: 0
    }

    // Check authentication before attempting save
    const authStatus = await checkAuthStatus()

    if (!authStatus) {
      // User not authenticated - save character data and show login modal
      setPendingCharacterData(characterPayload)
      setShowLoginModal(true)
      return
    }

    // User is authenticated - proceed with save
    await saveCharacter(characterPayload)
  }

  const saveCharacter = async (characterPayload: any) => {
    setIsSubmitting(true)
    setError(null)
    try {
      const response = await api.post('/characters', characterPayload)
      if (response.data.success) {
        // Navigate to characters list or character view
        navigate('/characters')
      } else {
        throw new Error(response.data.error?.message || 'Failed to save character')
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || error.message || 'Failed to save character. Please try again.'
      setError(errorMessage)
      console.error('Character save error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLoginSuccess = async () => {
    // User successfully logged in - save the pending character
    if (pendingCharacterData) {
      await saveCharacter(pendingCharacterData)
      setPendingCharacterData(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Character Overview */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {characterData.name || 'Unnamed Character'}
        </h2>
        <p className="text-lg text-muted-foreground">
          Level {characterData.level} {characterData.race} {characterData.class}
        </p>
        {characterData.background && (
          <p className="text-sm text-muted-foreground">
            {characterData.background} • {characterData.alignment}
          </p>
        )}
      </div>

      {/* Core Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="text-center p-4 border border-border rounded-md">
          <div className="text-2xl font-bold text-foreground">{characterData.armorClass}</div>
          <div className="text-sm text-muted-foreground">Armor Class</div>
        </div>
        
        <div className="text-center p-4 border border-border rounded-md">
          <div className="text-2xl font-bold text-foreground">
            {characterData.hitPoints?.maximum ?? 8}
          </div>
          <div className="text-sm text-muted-foreground">Hit Points</div>
        </div>

        <div className="text-center p-4 border border-border rounded-md">
          <div className="text-2xl font-bold text-foreground">
            +{characterData.proficiencyBonus ?? 2}
          </div>
          <div className="text-sm text-muted-foreground">Proficiency</div>
        </div>
      </div>

      {/* Ability Scores */}
      <div>
        <h3 className="text-lg font-medium text-foreground mb-3">Ability Scores</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {characterData.stats && Object.entries(characterData.stats).map(([ability, score]) => (
            <div key={ability} className="p-3 border border-border rounded-md text-center">
              <div className="text-lg font-bold text-foreground">{score ?? 10}</div>
              <div className="text-sm font-medium text-muted-foreground">
                {formatModifier(getModifier(score ?? 10))}
              </div>
              <div className="text-xs text-muted-foreground capitalize">
                {ability.slice(0, 3)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills & Proficiencies */}
      <div>
        <h3 className="text-lg font-medium text-foreground mb-3">Proficiencies</h3>
        
        <div className="space-y-3">
          {/* Saving Throws */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Saving Throws</h4>
            <div className="flex flex-wrap gap-1">
              {characterData.savingThrows && Object.keys(characterData.savingThrows).length > 0 ? (
                Object.keys(characterData.savingThrows).map((save) => (
                  <Badge key={save} variant="outline" size="sm">
                    {save} +{characterData.savingThrows[save] ?? 0}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">None selected</span>
              )}
            </div>
          </div>

          {/* Skills */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Skills</h4>
            <div className="flex flex-wrap gap-1">
              {characterData.skills && Object.keys(characterData.skills).length > 0 ? (
                Object.keys(characterData.skills).map((skill) => (
                  <Badge key={skill} variant="outline" size="sm">
                    {skill} +{characterData.skills[skill] ?? 0}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">None selected</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Equipment */}
      <div>
        <h3 className="text-lg font-medium text-foreground mb-3">Equipment</h3>
        {characterData.equipment && characterData.equipment.length > 0 ? (
          <div className="space-y-2">
            {characterData.equipment.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 border border-border rounded text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{item?.name ?? 'Unknown Item'}</span>
                  <Badge variant="outline" size="sm">{item?.type ?? 'Item'}</Badge>
                </div>
                {item?.quantity && item.quantity > 1 && (
                  <Badge variant="secondary" size="sm">×{item.quantity}</Badge>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No equipment selected</p>
        )}
      </div>

      {/* Spells */}
      {characterData.spells && Array.isArray(characterData.spells) && characterData.spells.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-foreground mb-3">Spells</h3>
          <div className="space-y-2">
            {characterData.spells.map((spell, index) => (
              <div key={index} className="flex items-center justify-between p-2 border border-border rounded text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{spell?.name ?? 'Unknown Spell'}</span>
                  <Badge variant={spell?.level === 0 ? 'secondary' : 'outline'} size="sm">
                    Level {spell?.level ?? 0}
                  </Badge>
                  <Badge variant="outline" size="sm">{spell?.school ?? 'Unknown'}</Badge>
                </div>
                {spell?.prepared && (
                  <Badge variant="default" size="sm">Prepared</Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Character Notes */}
      {characterData.notes && (
        <div>
          <h3 className="text-lg font-medium text-foreground mb-3">Character Notes</h3>
          <div className="p-4 border border-border rounded-md bg-muted/20">
            <p className="text-sm text-foreground whitespace-pre-wrap">
              {characterData.notes}
            </p>
          </div>
        </div>
      )}

      {/* Validation Summary */}
      <div className="p-4 border-2 border-dashed border-green-300 bg-green-50 rounded-md">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <h3 className="text-lg font-medium text-green-800">Ready to Create!</h3>
        </div>
        <p className="text-sm text-green-700">
          Your character is complete and ready to be created. Click "Create Character" to save 
          {characterData.name ? ` ${characterData.name}` : ' your character'} to your collection.
        </p>
      </div>

      {/* Creation Preview */}
      <div className="p-4 bg-muted/50 rounded-md">
        <h4 className="font-medium text-foreground mb-2">What happens next?</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Your character will be saved to your account</li>
          <li>• You'll be able to use them in campaigns</li>
          <li>• You can edit their details anytime</li>
          <li>• Level them up as they gain experience</li>
          <li>• Track their progress and adventures</li>
        </ul>
      </div>

      {/* Final Check Actions */}
      <div className="flex gap-3 pt-4 border-t">
        <Button variant="outline" className="flex-1" disabled>
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Preview Sheet
        </Button>

        <Button variant="outline" className="flex-1" disabled>
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Export PDF
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="font-medium text-red-800">Failed to Save Character</h4>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-600"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Save Character Action */}
      <div className="pt-6 border-t-2">
        <Button
          onClick={handleCreateCharacter}
          size="lg"
          className="w-full bg-green-600 hover:bg-green-700 text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg className="w-4 h-4 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Character...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Create Character
            </>
          )}
        </Button>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
        title="Save Your Character"
        description="Create an account or log in to save your D&D character"
      />
    </div>
  )
}