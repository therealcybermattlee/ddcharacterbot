import React, { useState, useEffect, useMemo } from 'react'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { WizardStepProps } from '../../../types/wizard'
import { useCharacterCreation } from '../../../contexts/CharacterCreationContext'
import { 
  SKILLS_BY_ABILITY, 
  ABILITY_NAMES, 
  PROFICIENCY_BONUS_BY_LEVEL,
  getAbilityModifier,
  type AbilityName,
  type SkillName
} from '../../../types/dnd5e'

// Complete D&D 5e skills list with ability mappings
const ALL_SKILLS: { name: SkillName; ability: AbilityName }[] = [
  { name: 'Acrobatics', ability: 'dexterity' },
  { name: 'Animal Handling', ability: 'wisdom' },
  { name: 'Arcana', ability: 'intelligence' },
  { name: 'Athletics', ability: 'strength' },
  { name: 'Deception', ability: 'charisma' },
  { name: 'History', ability: 'intelligence' },
  { name: 'Insight', ability: 'wisdom' },
  { name: 'Intimidation', ability: 'charisma' },
  { name: 'Investigation', ability: 'intelligence' },
  { name: 'Medicine', ability: 'wisdom' },
  { name: 'Nature', ability: 'intelligence' },
  { name: 'Perception', ability: 'wisdom' },
  { name: 'Performance', ability: 'charisma' },
  { name: 'Persuasion', ability: 'charisma' },
  { name: 'Religion', ability: 'intelligence' },
  { name: 'Sleight of Hand', ability: 'dexterity' },
  { name: 'Stealth', ability: 'dexterity' },
  { name: 'Survival', ability: 'wisdom' }
]

// Get real class data from API instead of mock data
const getClassData = async (className: string) => {
  try {
    const response = await fetch(`https://dnd-character-manager-api.cybermattlee-llc.workers.dev/api/classes/${className.toLowerCase()}`)
    const result = await response.json()
    if (result.success && result.data?.class) {
      const classData = result.data.class
      return {
        skillChoices: classData.skillChoices,
        availableSkills: classData.skillProficiencies,
        savingThrows: classData.savingThrowProficiencies
      }
    }
  } catch (error) {
    console.error('Failed to fetch class data:', error)
  }

  // Fallback to mock data if API fails
  const fallbackData: Record<string, { skillChoices: number; availableSkills: SkillName[]; savingThrows: AbilityName[] }> = {
    'barbarian': {
      skillChoices: 2,
      availableSkills: ['Animal Handling', 'Athletics', 'Intimidation', 'Nature', 'Perception', 'Survival'],
      savingThrows: ['strength', 'constitution']
    },
    'fighter': {
      skillChoices: 2,
      availableSkills: ['Acrobatics', 'Animal Handling', 'Athletics', 'History', 'Insight', 'Intimidation', 'Perception', 'Survival'],
      savingThrows: ['strength', 'constitution']
    },
    'wizard': {
      skillChoices: 2,
      availableSkills: ['Arcana', 'History', 'Insight', 'Investigation', 'Medicine', 'Religion'],
      savingThrows: ['intelligence', 'wisdom']
    },
    'rogue': {
      skillChoices: 4,
      availableSkills: ['Acrobatics', 'Athletics', 'Deception', 'Insight', 'Intimidation', 'Investigation', 'Perception', 'Performance', 'Persuasion', 'Sleight of Hand', 'Stealth'],
      savingThrows: ['dexterity', 'intelligence']
    },
    'ranger': {
      skillChoices: 3,
      availableSkills: ['Animal Handling', 'Athletics', 'Insight', 'Investigation', 'Nature', 'Perception', 'Stealth', 'Survival'],
      savingThrows: ['strength', 'dexterity']
    }
  }
  return fallbackData[className.toLowerCase()] || { skillChoices: 2, availableSkills: [], savingThrows: [] }
}

const getMockBackgroundData = (backgroundName: string) => {
  const backgroundData: Record<string, SkillName[]> = {
    'acolyte': ['Insight', 'Religion'],
    'criminal': ['Deception', 'Stealth'],
    'folk hero': ['Animal Handling', 'Survival'],
    'noble': ['History', 'Persuasion'],
    'soldier': ['Athletics', 'Intimidation']
  }
  return backgroundData[backgroundName.toLowerCase()] || []
}

const getMockRaceData = (raceName: string) => {
  const raceData: Record<string, SkillName[]> = {
    'half-elf': ['Deception', 'Persuasion'], // Gets 2 skill choices
    'variant human': ['Persuasion'], // Gets 1 skill choice from feat
  }
  return raceData[raceName.toLowerCase()] || []
}

// Proficiency source colors
const PROFICIENCY_COLORS = {
  class: 'bg-blue-100 text-blue-800 border-blue-300',
  background: 'bg-green-100 text-green-800 border-green-300',
  race: 'bg-purple-100 text-purple-800 border-purple-300'
} as const

interface ProficiencySource {
  source: 'class' | 'background' | 'race'
  skills: SkillName[]
  choices?: {
    count: number
    available: SkillName[]
  }
}

export function SkillsProficienciesStep({ data, onChange, onValidationChange }: WizardStepProps) {
  const { characterData } = useCharacterCreation()
  const [selectedClassSkills, setSelectedClassSkills] = useState<Set<SkillName>>(new Set())
  const [selectedRaceSkills, setSelectedRaceSkills] = useState<Set<SkillName>>(new Set())
  const [classData, setClassData] = useState<{ skillChoices: number; availableSkills: SkillName[]; savingThrows: AbilityName[] } | null>(null)
  const [isLoadingClassData, setIsLoadingClassData] = useState(false)

  // Get current proficiency bonus based on level
  const proficiencyBonus = PROFICIENCY_BONUS_BY_LEVEL[characterData.level as keyof typeof PROFICIENCY_BONUS_BY_LEVEL] || 2

  // Load real class data from API
  useEffect(() => {
    if (characterData.class) {
      setIsLoadingClassData(true)
      getClassData(characterData.class)
        .then((data) => {
          setClassData(data)
          setIsLoadingClassData(false)
        })
        .catch((error) => {
          console.error('Failed to load class data:', error)
          setIsLoadingClassData(false)
        })
    }
  }, [characterData.class])

  // Get background and race data (keeping mock for now)
  const backgroundSkills = getMockBackgroundData(characterData.background)
  const raceSkillChoices = getMockRaceData(characterData.race)

  // Calculate all proficiencies from different sources
  const proficiencySources = useMemo((): ProficiencySource[] => {
    const sources: ProficiencySource[] = []

    // Background proficiencies (automatic)
    if (backgroundSkills.length > 0) {
      sources.push({
        source: 'background',
        skills: backgroundSkills
      })
    }

    // Class proficiencies (choices)
    if (classData && classData.skillChoices > 0) {
      sources.push({
        source: 'class',
        skills: [],
        choices: {
          count: classData.skillChoices,
          available: classData.availableSkills
        }
      })
    }

    // Race skill choices
    if (raceSkillChoices.length > 0) {
      sources.push({
        source: 'race',
        skills: [],
        choices: {
          count: raceSkillChoices.length,
          available: raceSkillChoices
        }
      })
    }

    return sources
  }, [backgroundSkills, classData, raceSkillChoices])

  // Calculate final skill proficiencies
  const finalSkillProficiencies = useMemo(() => {
    const skills = new Set<SkillName>()
    
    // Add background skills
    backgroundSkills.forEach(skill => skills.add(skill))
    
    // Add selected class skills
    selectedClassSkills.forEach(skill => skills.add(skill))
    
    // Add selected race skills
    selectedRaceSkills.forEach(skill => skills.add(skill))
    
    return skills
  }, [backgroundSkills, selectedClassSkills, selectedRaceSkills])

  // Calculate saving throw proficiencies
  const savingThrowProficiencies = useMemo(() => {
    return new Set(classData?.savingThrows || [])
  }, [classData?.savingThrows])

  // Handle class skill selection
  const handleClassSkillToggle = (skill: SkillName) => {
    const newSelected = new Set(selectedClassSkills)
    if (newSelected.has(skill)) {
      newSelected.delete(skill)
    } else if (newSelected.size < (classData?.skillChoices || 0)) {
      newSelected.add(skill)
    }
    setSelectedClassSkills(newSelected)
  }

  // Handle race skill selection
  const handleRaceSkillToggle = (skill: SkillName) => {
    const newSelected = new Set(selectedRaceSkills)
    if (newSelected.has(skill)) {
      newSelected.delete(skill)
    } else if (newSelected.size < raceSkillChoices.length) {
      newSelected.add(skill)
    }
    setSelectedRaceSkills(newSelected)
  }

  // Update parent component when selections change
  useEffect(() => {
    const skillsRecord: Record<string, number> = {}
    const savingThrowsRecord: Record<string, number> = {}

    // Convert final proficiencies to the expected format
    finalSkillProficiencies.forEach(skill => {
      skillsRecord[skill] = proficiencyBonus
    })

    savingThrowProficiencies.forEach(ability => {
      savingThrowsRecord[ability] = proficiencyBonus
    })

    const newData = {
      proficiencyBonus,
      skills: skillsRecord,
      savingThrows: savingThrowsRecord
    }

    onChange(newData)

    // Validation
    const errors: string[] = []
    
    // Check if all class skill choices are made
    if (classData && selectedClassSkills.size !== classData.skillChoices) {
      errors.push(`Select ${classData.skillChoices} skills from your class`)
    }

    // Check if all race skill choices are made
    if (selectedRaceSkills.size !== raceSkillChoices.length) {
      errors.push(`Select ${raceSkillChoices.length} skills from your race`)
    }

    onValidationChange(errors.length === 0, errors)
  }, [finalSkillProficiencies, savingThrowProficiencies, selectedClassSkills, selectedRaceSkills, classData?.skillChoices, raceSkillChoices.length, proficiencyBonus, onChange, onValidationChange])

  // Get skill modifier for display
  const getSkillModifier = (skill: SkillName, isProficient: boolean) => {
    const skillInfo = ALL_SKILLS.find(s => s.name === skill)
    if (!skillInfo) return 0
    
    const abilityScore = characterData.stats[skillInfo.ability] || 10
    const abilityModifier = getAbilityModifier(abilityScore)
    
    return abilityModifier + (isProficient ? proficiencyBonus : 0)
  }

  // Get suggestions for optimal skill choices
  const getOptimalSuggestions = () => {
    if (!characterData.class || !classData) return []

    const primaryAbilities = ['strength', 'dexterity'] // This would come from class data

    return (classData.availableSkills || []).filter(skill => {
      const skillInfo = ALL_SKILLS.find(s => s.name === skill)
      return skillInfo && primaryAbilities.includes(skillInfo.ability)
    }).slice(0, classData.skillChoices || 0)
  }

  // Show loading state while fetching class data
  if (isLoadingClassData) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-muted rounded mb-4"></div>
          <div className="h-8 bg-muted rounded w-1/4"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header with Proficiency Bonus */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Skills & Proficiencies</h2>
          <p className="text-muted-foreground">
            Your character's trained abilities, determined by class, background, and race.
          </p>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Proficiency Bonus</h3>
                <p className="text-sm text-muted-foreground">
                  Added to proficient skills and saving throws (Level {characterData.level})
                </p>
              </div>
              <Badge variant="outline" className="text-lg px-4 py-2 font-bold">
                +{proficiencyBonus}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Saving Throw Proficiencies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Saving Throw Proficiencies</span>
            <Badge variant="secondary">
              {savingThrowProficiencies.size} from class
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Your class determines which saving throws you're proficient in.
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {ABILITY_NAMES.map((ability) => {
              const isProficient = savingThrowProficiencies.has(ability)
              const abilityScore = characterData.stats[ability] || 10
              const modifier = getAbilityModifier(abilityScore) + (isProficient ? proficiencyBonus : 0)
              
              return (
                <div
                  key={ability}
                  className={`p-3 border rounded-lg transition-all ${
                    isProficient
                      ? 'border-blue-300 bg-blue-50 text-blue-900'
                      : 'border-gray-200 bg-gray-50 text-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium capitalize">{ability}</div>
                      <div className="text-xs">{isProficient ? 'Proficient' : 'Not Proficient'}</div>
                    </div>
                    <Badge variant={isProficient ? 'default' : 'outline'} size="sm">
                      {modifier >= 0 ? '+' : ''}{modifier}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Automatic Skill Proficiencies */}
      {backgroundSkills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Background Proficiencies</span>
              <Badge className={PROFICIENCY_COLORS.background}>
                {backgroundSkills.length} automatic
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Your <strong>{characterData.background}</strong> background provides these skill proficiencies:
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {backgroundSkills.map((skill) => {
                const skillInfo = ALL_SKILLS.find(s => s.name === skill)!
                const modifier = getSkillModifier(skill, true)
                
                return (
                  <div key={skill} className="p-3 border border-green-200 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-green-900">{skill}</div>
                        <div className="text-xs text-green-700 capitalize">{skillInfo.ability} based</div>
                      </div>
                      <Badge className="bg-green-600 hover:bg-green-700" size="sm">
                        +{modifier}
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Class Skill Choices */}
      {classData && classData.skillChoices > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Class Skill Choices</span>
              <Badge className={PROFICIENCY_COLORS.class}>
                {selectedClassSkills.size}/{classData?.skillChoices || 0} selected
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Choose <strong>{classData?.skillChoices || 0}</strong> skills from your <strong>{characterData.class}</strong> class options:
            </p>
            
            <div className="grid grid-cols-1 gap-2">
              {(classData?.availableSkills || []).map((skill) => {
                const skillInfo = ALL_SKILLS.find(s => s.name === skill)!
                const isSelected = selectedClassSkills.has(skill)
                const isAlreadyProficient = finalSkillProficiencies.has(skill) && !isSelected
                const modifier = getSkillModifier(skill, isSelected || isAlreadyProficient)
                const baseModifier = getSkillModifier(skill, false)
                
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleClassSkillToggle(skill)}
                    disabled={isAlreadyProficient || (selectedClassSkills.size >= (classData?.skillChoices || 0) && !isSelected)}
                    className={`p-3 border rounded-lg text-left transition-all ${
                      isSelected
                        ? 'border-blue-300 bg-blue-50 text-blue-900'
                        : isAlreadyProficient
                        ? 'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed'
                        : 'border-gray-200 hover:border-blue-200 hover:bg-blue-25 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 border-2 rounded transition-all ${
                          isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                        }`}>
                          {isSelected && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        
                        <div>
                          <div className="font-medium">{skill}</div>
                          <div className="text-xs text-muted-foreground capitalize">
                            {skillInfo.ability} based
                            {isAlreadyProficient && ' (already proficient)'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {!isAlreadyProficient && (
                          <span className="text-xs text-muted-foreground">
                            {baseModifier >= 0 ? '+' : ''}{baseModifier} → 
                          </span>
                        )}
                        <Badge variant={isSelected || isAlreadyProficient ? 'default' : 'outline'} size="sm">
                          {modifier >= 0 ? '+' : ''}{modifier}
                        </Badge>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Optimization suggestions */}
            {selectedClassSkills.size < (classData?.skillChoices || 0) && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <h4 className="text-sm font-medium text-amber-800 mb-2">💡 Optimization Suggestion</h4>
                <p className="text-sm text-amber-700 mb-2">
                  Consider skills that match your class's primary abilities for the highest modifiers:
                </p>
                <div className="flex flex-wrap gap-1">
                  {getOptimalSuggestions().map((skill) => (
                    <Badge key={skill} variant="outline" size="sm" className="text-amber-700 border-amber-300">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Race Skill Choices */}
      {raceSkillChoices.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Racial Skill Choices</span>
              <Badge className={PROFICIENCY_COLORS.race}>
                {selectedRaceSkills.size}/{raceSkillChoices.length} selected
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Your <strong>{characterData.race}</strong> race allows you to choose additional skills:
            </p>
            
            <div className="grid grid-cols-1 gap-2">
              {raceSkillChoices.map((skill) => {
                const skillInfo = ALL_SKILLS.find(s => s.name === skill)!
                const isSelected = selectedRaceSkills.has(skill)
                const isAlreadyProficient = finalSkillProficiencies.has(skill) && !isSelected
                const modifier = getSkillModifier(skill, isSelected || isAlreadyProficient)
                
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleRaceSkillToggle(skill)}
                    disabled={isAlreadyProficient}
                    className={`p-3 border rounded-lg text-left transition-all ${
                      isSelected
                        ? 'border-purple-300 bg-purple-50 text-purple-900'
                        : isAlreadyProficient
                        ? 'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed'
                        : 'border-gray-200 hover:border-purple-200 hover:bg-purple-25 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 border-2 rounded transition-all ${
                          isSelected ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
                        }`}>
                          {isSelected && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        
                        <div>
                          <div className="font-medium">{skill}</div>
                          <div className="text-xs text-muted-foreground capitalize">
                            {skillInfo.ability} based
                            {isAlreadyProficient && ' (already proficient)'}
                          </div>
                        </div>
                      </div>
                      
                      <Badge variant={isSelected || isAlreadyProficient ? 'default' : 'outline'} size="sm">
                        {modifier >= 0 ? '+' : ''}{modifier}
                      </Badge>
                    </div>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Complete Skills Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Complete Skills Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ALL_SKILLS.map((skillData) => {
              const isProficient = finalSkillProficiencies.has(skillData.name)
              const modifier = getSkillModifier(skillData.name, isProficient)
              const baseModifier = getSkillModifier(skillData.name, false)
              
              // Determine proficiency source
              let source = ''
              if (backgroundSkills.includes(skillData.name)) source = 'background'
              else if (selectedClassSkills.has(skillData.name)) source = 'class'
              else if (selectedRaceSkills.has(skillData.name)) source = 'race'
              
              return (
                <div
                  key={skillData.name}
                  className={`p-3 border rounded-lg ${
                    isProficient
                      ? 'border-gray-300 bg-gray-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{skillData.name}</span>
                        {isProficient && source && (
                          <Badge size="sm" className={PROFICIENCY_COLORS[source as keyof typeof PROFICIENCY_COLORS]}>
                            {source}
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {skillData.ability} based
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Badge variant={isProficient ? 'default' : 'outline'} size="sm">
                        {modifier >= 0 ? '+' : ''}{modifier}
                      </Badge>
                      {isProficient && (
                        <div className="text-xs text-muted-foreground mt-1">
                          (was {baseModifier >= 0 ? '+' : ''}{baseModifier})
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Proficiency Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Saving Throws ({savingThrowProficiencies.size})</h4>
              <div className="text-sm space-y-1">
                {Array.from(savingThrowProficiencies).map((ability) => (
                  <div key={ability} className="flex justify-between capitalize">
                    <span>{ability}</span>
                    <span>+{getAbilityModifier(characterData.stats[ability] || 10) + proficiencyBonus}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Skills ({finalSkillProficiencies.size})</h4>
              <div className="text-sm space-y-1 max-h-32 overflow-y-auto">
                {Array.from(finalSkillProficiencies).sort().map((skill) => (
                  <div key={skill} className="flex justify-between">
                    <span>{skill}</span>
                    <span>+{getSkillModifier(skill, true)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                <span>Background</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
                <span>Class</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-100 border border-purple-300 rounded"></div>
                <span>Race</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}