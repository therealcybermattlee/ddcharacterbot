import React, { useState, useEffect } from 'react'
import { Input, Button, Badge, Card, CardContent, CardHeader, CardTitle } from '../../ui'
import { WizardStepProps } from '../../../types/wizard'
import { Race, Class, Background } from '../../../types/dnd5e'
import { fetchAllReferenceData } from '../../../services/dnd5eApi'
import { RaceSelector } from '../../character-creation/RaceSelector'
import { ClassSelector } from '../../character-creation/ClassSelector'
import { BackgroundSelector } from '../../character-creation/BackgroundSelector'
import { CharacterPreview } from '../../character-creation/CharacterPreview'

const ALIGNMENTS = [
  'Lawful Good', 'Neutral Good', 'Chaotic Good',
  'Lawful Neutral', 'True Neutral', 'Chaotic Neutral', 
  'Lawful Evil', 'Neutral Evil', 'Chaotic Evil'
]

export function BasicInfoStep({ data, onChange, onValidationChange }: WizardStepProps) {
  const [referenceData, setReferenceData] = useState<{
    races: Race[]
    classes: Class[]
    backgrounds: Background[]
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState<'name' | 'race' | 'class' | 'background' | 'alignment' | 'complete'>('name')

  // Load D&D 5e reference data
  useEffect(() => {
    const loadReferenceData = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchAllReferenceData()
        setReferenceData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load character data')
      } finally {
        setLoading(false)
      }
    }

    loadReferenceData()
  }, [])

  // Determine current step based on data completion
  useEffect(() => {
    if (!data.name?.trim()) {
      setCurrentStep('name')
    } else if (!data.raceData) {
      setCurrentStep('race')
    } else if (!data.classData) {
      setCurrentStep('class')
    } else if (!data.backgroundData) {
      setCurrentStep('background')
    } else if (!data.alignment) {
      setCurrentStep('alignment')
    } else {
      setCurrentStep('complete')
    }
  }, [data])

  const handleInputChange = (field: string, value: string | number) => {
    const newData = { ...data, [field]: value }
    onChange(newData)
    validateData(newData)
  }

  const handleRaceSelect = (race: Race) => {
    const newData = { 
      ...data, 
      race: race.name, 
      raceData: race 
    }
    onChange(newData)
    validateData(newData)
  }

  const handleClassSelect = (cls: Class) => {
    const newData = { 
      ...data, 
      class: cls.name, 
      classData: cls 
    }
    onChange(newData)
    validateData(newData)
  }

  const handleBackgroundSelect = (background: Background) => {
    const newData = { 
      ...data, 
      background: background.name, 
      backgroundData: background 
    }
    onChange(newData)
    validateData(newData)
  }

  const validateData = (newData: any) => {
    const errors: string[] = []
    if (!newData.name?.trim()) errors.push('Character name is required')
    if (!newData.raceData) errors.push('Race is required')
    if (!newData.classData) errors.push('Class is required')
    if (!newData.backgroundData) errors.push('Background is required')
    if (!newData.alignment) errors.push('Alignment is required')
    
    onValidationChange(errors.length === 0, errors)
  }

  const handleRandomName = () => {
    const randomNames = [
      'Aelar', 'Berris', 'Cyrus', 'Drannor', 'Enna', 'Galinndan', 'Halimath', 'Immeral', 'Ivellios', 'Korfel',
      'Lamlis', 'Mindartis', 'Nutae', 'Paelynn', 'Peren', 'Quarion', 'Riardon', 'Rolen', 'Silvyr', 'Suhnaal',
      'Thamior', 'Theriatis', 'Thervan', 'Uthemar', 'Vanuath', 'Varis'
    ]
    const randomName = randomNames[Math.floor(Math.random() * randomNames.length)]
    handleInputChange('name', randomName)
  }

  const getCharacterConcept = () => {
    return {
      name: data.name || '',
      race: data.raceData,
      class: data.classData,
      background: data.backgroundData,
      level: data.level || 1
    }
  }

  // Base ability scores for preview (these would come from the ability scores step later)
  const baseAbilityScores = {
    strength: 13,
    dexterity: 14,
    constitution: 15,
    intelligence: 12,
    wisdom: 10,
    charisma: 8
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-24 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  if (error || !referenceData) {
    return (
      <Card className="border-destructive/20 bg-destructive/5">
        <CardContent className="p-6 text-center">
          <h3 className="font-semibold text-destructive mb-2">Unable to Load Character Data</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {error || 'Failed to load D&D 5e reference data'}
          </p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-8">
        {/* Character Name */}
        <Card className={currentStep === 'name' ? 'ring-2 ring-primary/50' : ''}>
          <CardHeader>
            <CardTitle className="text-lg">Character Name</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter your character's name"
                value={data.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="flex-1"
              />
              <Button 
                variant="outline" 
                onClick={handleRandomName}
                type="button"
                className="whitespace-nowrap"
              >
                Random
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Choose a name that fits your character's personality and background
            </p>
          </CardContent>
        </Card>

        {/* Race Selection */}
        {(currentStep === 'race' || data.raceData) && (
          <Card className={currentStep === 'race' ? 'ring-2 ring-primary/50' : ''}>
            <CardHeader>
              <CardTitle className="text-lg">Choose Your Race</CardTitle>
            </CardHeader>
            <CardContent>
              <RaceSelector
                races={referenceData.races}
                selectedRace={data.raceData}
                onRaceSelect={handleRaceSelect}
                baseAbilityScores={baseAbilityScores}
              />
            </CardContent>
          </Card>
        )}

        {/* Class Selection */}
        {(currentStep === 'class' || data.classData) && (
          <Card className={currentStep === 'class' ? 'ring-2 ring-primary/50' : ''}>
            <CardHeader>
              <CardTitle className="text-lg">Choose Your Class</CardTitle>
            </CardHeader>
            <CardContent>
              <ClassSelector
                classes={referenceData.classes}
                selectedClass={data.classData}
                onClassSelect={handleClassSelect}
                characterLevel={data.level || 1}
              />
            </CardContent>
          </Card>
        )}

        {/* Background Selection */}
        {(currentStep === 'background' || data.backgroundData) && (
          <Card className={currentStep === 'background' ? 'ring-2 ring-primary/50' : ''}>
            <CardHeader>
              <CardTitle className="text-lg">Choose Your Background</CardTitle>
            </CardHeader>
            <CardContent>
              <BackgroundSelector
                backgrounds={referenceData.backgrounds}
                selectedBackground={data.backgroundData}
                onBackgroundSelect={handleBackgroundSelect}
                selectedClass={data.classData}
              />
            </CardContent>
          </Card>
        )}

        {/* Level and Alignment */}
        {(currentStep === 'alignment' || data.alignment) && (
          <Card className={currentStep === 'alignment' ? 'ring-2 ring-primary/50' : ''}>
            <CardHeader>
              <CardTitle className="text-lg">Final Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Level */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Starting Level
                </label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleInputChange('level', Math.max(1, (data.level || 1) - 1))}
                    disabled={data.level <= 1}
                    type="button"
                  >
                    -
                  </Button>
                  <div className="w-16 text-center">
                    <Badge variant="outline" className="text-lg px-3 py-1">
                      {data.level || 1}
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleInputChange('level', Math.min(20, (data.level || 1) + 1))}
                    disabled={data.level >= 20}
                    type="button"
                  >
                    +
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Starting level (1-20)
                </p>
              </div>

              {/* Alignment */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Alignment *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {ALIGNMENTS.map((alignment) => (
                    <button
                      key={alignment}
                      type="button"
                      onClick={() => handleInputChange('alignment', alignment)}
                      className={`
                        p-2 text-xs border rounded-md transition-all
                        ${data.alignment === alignment 
                          ? 'border-primary bg-primary/10 text-primary font-medium' 
                          : 'border-border hover:border-primary/50 text-foreground'
                        }
                      `}
                    >
                      {alignment}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Your character's moral and ethical outlook
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Character Preview Sidebar */}
      <div className="lg:col-span-1">
        <div className="sticky top-4">
          <CharacterPreview
            characterConcept={getCharacterConcept()}
            baseAbilityScores={baseAbilityScores}
          />
        </div>
      </div>
    </div>
  )
}