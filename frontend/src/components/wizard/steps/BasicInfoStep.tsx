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

  // Determine current step based on data completion - progressive disclosure
  // Only auto-advance when selections are made (not during typing)
  useEffect(() => {
    if (!data.name?.trim()) {
      setCurrentStep('name')
    } else if (data.name?.trim() && !data.race?.trim() && currentStep === 'name') {
      // Stay on name step until user explicitly continues
      return
    } else if (!data.race?.trim()) {
      setCurrentStep('race')
    } else if (!data.class?.trim()) {
      setCurrentStep('class')
    } else if (!data.background?.trim()) {
      setCurrentStep('background')
    } else if (!data.alignment) {
      setCurrentStep('alignment')
    } else {
      setCurrentStep('complete')
    }
  }, [data, currentStep])

  const handleInputChange = (field: string, value: string | number) => {
    const newData = { ...data, [field]: value }
    onChange(newData)
    // Let the parent wizard handle validation timing
  }

  const handleRaceSelect = (race: Race) => {
    const newData = {
      ...data,
      race: race.name,
      raceData: race
    }
    onChange(newData)
    // Let the parent wizard handle validation timing
  }

  const handleClassSelect = (cls: Class) => {
    const newData = {
      ...data,
      class: cls.name,
      classData: cls
    }
    onChange(newData)
    // Let the parent wizard handle validation timing
  }

  const handleBackgroundSelect = (background: Background) => {
    const newData = {
      ...data,
      background: background.name,
      backgroundData: background
    }
    onChange(newData)
    // Let the parent wizard handle validation timing
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
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          {['name', 'race', 'class', 'background', 'alignment'].map((step, index) => {
            const isActive = currentStep === step
            const isCompleted = ['name', 'race', 'class', 'background', 'alignment'].indexOf(currentStep) > index
            return (
              <div key={step} className="flex items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${isActive ? 'bg-primary text-primary-foreground' :
                    isCompleted ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}
                `}>
                  {index + 1}
                </div>
                {index < 4 && (
                  <div className={`w-12 h-0.5 mx-2 ${isCompleted ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </div>
            )
          })}
        </div>

        {/* Character Name */}
        {currentStep === 'name' && (
          <Card className="ring-2 ring-primary/50">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">What's your character's name?</CardTitle>
              <p className="text-muted-foreground">This is the first step in creating your D&D character</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-3 max-w-md mx-auto">
                <Input
                  placeholder="Enter your character's name"
                  value={data.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="flex-1 text-lg py-3"
                  autoFocus
                />
                <Button
                  variant="outline"
                  onClick={handleRandomName}
                  type="button"
                  className="px-4"
                >
                  Random
                </Button>
              </div>
              {data.name && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">Great! Now let's choose a race for {data.name}</p>
                  <Button onClick={() => setCurrentStep('race')} className="px-8">
                    Continue to Race Selection
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Race Selection */}
        {currentStep === 'race' && (
          <Card className="ring-2 ring-primary/50">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Choose {data.name}'s Race</CardTitle>
              <p className="text-muted-foreground">Your race determines your character's physical traits and abilities</p>
            </CardHeader>
            <CardContent>
              {referenceData?.races ? (
                <RaceSelector
                  races={referenceData.races}
                  selectedRace={data.raceData}
                  onRaceSelect={handleRaceSelect}
                  baseAbilityScores={baseAbilityScores}
                />
              ) : (
                <div className="text-center py-8 text-muted-foreground">Loading races...</div>
              )}
              {data.race && (
                <div className="text-center mt-6">
                  <p className="text-sm text-muted-foreground mb-4">Excellent! {data.name} the {data.race}. Now choose a class.</p>
                  <Button onClick={() => setCurrentStep('class')} className="px-8">
                    Continue to Class Selection
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Class Selection */}
        {currentStep === 'class' && (
          <Card className="ring-2 ring-primary/50">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Choose {data.name}'s Class</CardTitle>
              <p className="text-muted-foreground">Your class determines your character's abilities and role in the party</p>
            </CardHeader>
            <CardContent>
              {referenceData?.classes ? (
                <ClassSelector
                  classes={referenceData.classes}
                  selectedClass={data.classData}
                  onClassSelect={handleClassSelect}
                  characterLevel={data.level || 1}
                />
              ) : (
                <div className="text-center py-8 text-muted-foreground">Loading classes...</div>
              )}
              {data.class && (
                <div className="text-center mt-6">
                  <p className="text-sm text-muted-foreground mb-4">{data.name} the {data.race} {data.class}! Now choose a background.</p>
                  <Button onClick={() => setCurrentStep('background')} className="px-8">
                    Continue to Background Selection
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Background Selection */}
        {currentStep === 'background' && (
          <Card className="ring-2 ring-primary/50">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Choose {data.name}'s Background</CardTitle>
              <p className="text-muted-foreground">Your background represents your character's life before becoming an adventurer</p>
            </CardHeader>
            <CardContent>
              {referenceData?.backgrounds ? (
                <BackgroundSelector
                  backgrounds={referenceData.backgrounds}
                  selectedBackground={data.backgroundData}
                  onBackgroundSelect={handleBackgroundSelect}
                  selectedClass={data.classData}
                />
              ) : (
                <div className="text-center py-8 text-muted-foreground">Loading backgrounds...</div>
              )}
              {data.background && (
                <div className="text-center mt-6">
                  <p className="text-sm text-muted-foreground mb-4">Perfect! Now set {data.name}'s alignment and level.</p>
                  <Button onClick={() => setCurrentStep('alignment')} className="px-8">
                    Continue to Final Details
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Level and Alignment */}
        {currentStep === 'alignment' && (
          <Card className="ring-2 ring-primary/50">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Final Details for {data.name}</CardTitle>
              <p className="text-muted-foreground">Set your character's starting level and moral alignment</p>
            </CardHeader>
            <CardContent className="space-y-8 max-w-md mx-auto">
              {/* Level */}
              <div className="space-y-3 text-center">
                <label className="text-lg font-medium text-foreground">
                  Starting Level
                </label>
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => handleInputChange('level', Math.max(1, (data.level || 1) - 1))}
                    disabled={data.level <= 1}
                    type="button"
                  >
                    -
                  </Button>
                  <div className="w-20 text-center">
                    <Badge variant="outline" className="text-2xl px-4 py-2">
                      {data.level || 1}
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => handleInputChange('level', Math.min(20, (data.level || 1) + 1))}
                    disabled={data.level >= 20}
                    type="button"
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Alignment */}
              <div className="space-y-3 text-center">
                <label className="text-lg font-medium text-foreground">
                  Alignment
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {ALIGNMENTS.map((alignment) => (
                    <button
                      key={alignment}
                      type="button"
                      onClick={() => handleInputChange('alignment', alignment)}
                      className={`
                        p-3 text-sm border rounded-lg transition-all font-medium
                        ${data.alignment === alignment
                          ? 'border-primary bg-primary text-primary-foreground shadow-md'
                          : 'border-border hover:border-primary/50 text-foreground hover:bg-muted'
                        }
                      `}
                    >
                      {alignment}
                    </button>
                  ))}
                </div>
              </div>

              {data.alignment && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Perfect! {data.name} the {data.alignment} {data.race} {data.class} is ready!
                  </p>
                  <Button onClick={() => setCurrentStep('complete')} size="lg" className="px-8">
                    Complete Basic Info
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Complete */}
        {currentStep === 'complete' && (
          <Card className="ring-2 ring-green-500/50 bg-green-50/50">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-green-700">Character Created!</CardTitle>
              <p className="text-green-600">Your basic character information is complete</p>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="text-lg font-semibold">
                {data.name} - Level {data.level || 1} {data.alignment} {data.race} {data.class}
              </div>
              <div className="text-sm text-muted-foreground">
                Background: {data.background}
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Choose what to do next:
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={() => {
                      // Trigger validation to show this step is complete and allow progression
                      onValidationChange(true, [])
                    }}
                    className="bg-green-600 hover:bg-green-700 px-6"
                  >
                    Continue Building
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Continue to customize ability scores, skills, and equipment before saving
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

    </>
  )
}