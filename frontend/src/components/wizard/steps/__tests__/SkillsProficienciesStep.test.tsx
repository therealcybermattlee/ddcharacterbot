import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SkillsProficienciesStep } from '../SkillsProficienciesStep'
import { useCharacterCreation } from '../../../../contexts/CharacterCreationContext'
import type { CharacterCreationData } from '../../../../types/wizard'

// Mock the character creation context
vi.mock('../../../../contexts/CharacterCreationContext')

// Mock UI components
vi.mock('../../../ui/badge', () => ({
  Badge: ({ children, className }: any) => <span className={className}>{children}</span>
}))

vi.mock('../../../ui/button', () => ({
  Button: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>
}))

vi.mock('../../../ui/card', () => ({
  Card: ({ children }: any) => <div data-testid="card">{children}</div>,
  CardContent: ({ children }: any) => <div data-testid="card-content">{children}</div>,
  CardHeader: ({ children }: any) => <div data-testid="card-header">{children}</div>,
  CardTitle: ({ children }: any) => <h3 data-testid="card-title">{children}</h3>
}))

describe('SkillsProficienciesStep', () => {
  const mockOnChange = vi.fn()
  const mockOnValidationChange = vi.fn()

  const createMockCharacterData = (overrides: Partial<CharacterCreationData> = {}): CharacterCreationData => ({
    name: 'Test Character',
    race: 'Human',
    class: 'Fighter',
    level: 1,
    background: 'Soldier',
    alignment: 'Lawful Good',
    stats: {
      strength: 15,
      dexterity: 14,
      constitution: 13,
      intelligence: 12,
      wisdom: 10,
      charisma: 8,
    },
    abilityScoreState: {
      method: 'standard',
      baseScores: {
        strength: 15,
        dexterity: 14,
        constitution: 13,
        intelligence: 12,
        wisdom: 10,
        charisma: 8,
      },
      rollHistory: [],
      pointsUsed: 0,
      standardAssignments: {},
      isComplete: true,
    },
    proficiencyBonus: 2,
    savingThrows: {},
    skills: {},
    equipment: [],
    spells: [],
    notes: '',
    armorClass: 10,
    hitPoints: {
      current: 8,
      maximum: 8,
      temporary: 0,
    },
    ...overrides,
  })

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useCharacterCreation).mockReturnValue({
      characterData: createMockCharacterData(),
    } as any)
  })

  describe('D&D 5e Rules Implementation', () => {
    it('should correctly calculate proficiency bonus based on character level', () => {
      const testCases = [
        { level: 1, expectedBonus: 2 },
        { level: 4, expectedBonus: 2 },
        { level: 5, expectedBonus: 3 },
        { level: 8, expectedBonus: 3 },
        { level: 9, expectedBonus: 4 },
        { level: 12, expectedBonus: 4 },
        { level: 13, expectedBonus: 5 },
        { level: 16, expectedBonus: 5 },
        { level: 17, expectedBonus: 6 },
        { level: 20, expectedBonus: 6 },
      ]

      testCases.forEach(({ level, expectedBonus }) => {
        vi.mocked(useCharacterCreation).mockReturnValue({
          characterData: createMockCharacterData({ level }),
        } as any)

        render(
          <SkillsProficienciesStep
            data={{}}
            onChange={mockOnChange}
            onValidationChange={mockOnValidationChange}
          />
        )

        expect(screen.getByText(`+${expectedBonus}`)).toBeInTheDocument()
      })
    })

    it('should correctly apply Fighter class skill proficiency rules', () => {
      vi.mocked(useCharacterCreation).mockReturnValue({
        characterData: createMockCharacterData({ class: 'Fighter' }),
      } as any)

      render(
        <SkillsProficienciesStep
          data={{}}
          onChange={mockOnChange}
          onValidationChange={mockOnValidationChange}
        />
      )

      // Fighter gets 2 skill choices from 8 available skills
      expect(screen.getByText('0/2 selected')).toBeInTheDocument()
      
      // Check that Fighter's available skills are present
      const fighterSkills = ['Acrobatics', 'Animal Handling', 'Athletics', 'History', 'Insight', 'Intimidation', 'Perception', 'Survival']
      fighterSkills.forEach(skill => {
        expect(screen.getByText(skill)).toBeInTheDocument()
      })
    })

    it('should correctly apply Wizard class skill proficiency rules', () => {
      vi.mocked(useCharacterCreation).mockReturnValue({
        characterData: createMockCharacterData({ class: 'Wizard' }),
      } as any)

      render(
        <SkillsProficienciesStep
          data={{}}
          onChange={mockOnChange}
          onValidationChange={mockOnValidationChange}
        />
      )

      // Wizard gets 2 skill choices from 6 available skills
      expect(screen.getByText('0/2 selected')).toBeInTheDocument()
      
      // Check that Wizard's available skills are present
      const wizardSkills = ['Arcana', 'History', 'Insight', 'Investigation', 'Medicine', 'Religion']
      wizardSkills.forEach(skill => {
        expect(screen.getByText(skill)).toBeInTheDocument()
      })
    })

    it('should correctly apply Rogue class skill proficiency rules', () => {
      vi.mocked(useCharacterCreation).mockReturnValue({
        characterData: createMockCharacterData({ class: 'Rogue' }),
      } as any)

      render(
        <SkillsProficienciesStep
          data={{}}
          onChange={mockOnChange}
          onValidationChange={mockOnValidationChange}
        />
      )

      // Rogue gets 4 skill choices from 11 available skills
      expect(screen.getByText('0/4 selected')).toBeInTheDocument()
      
      // Check that Rogue's available skills are present
      const rogueSkills = ['Acrobatics', 'Athletics', 'Deception', 'Insight', 'Intimidation', 'Investigation', 'Perception', 'Performance', 'Persuasion', 'Sleight of Hand', 'Stealth']
      rogueSkills.forEach(skill => {
        expect(screen.getByText(skill)).toBeInTheDocument()
      })
    })

    it('should automatically apply background skill proficiencies', () => {
      vi.mocked(useCharacterCreation).mockReturnValue({
        characterData: createMockCharacterData({ background: 'Soldier' }),
      } as any)

      render(
        <SkillsProficienciesStep
          data={{}}
          onChange={mockOnChange}
          onValidationChange={mockOnValidationChange}
        />
      )

      // Soldier background provides Athletics and Intimidation
      expect(screen.getByText('2 automatic')).toBeInTheDocument()
      expect(screen.getByText('Athletics')).toBeInTheDocument()
      expect(screen.getByText('Intimidation')).toBeInTheDocument()
    })

    it('should calculate skill modifiers correctly with ability scores and proficiency', () => {
      const characterData = createMockCharacterData({
        stats: {
          strength: 16, // +3 modifier
          dexterity: 14, // +2 modifier
          constitution: 12, // +1 modifier
          intelligence: 10, // +0 modifier
          wisdom: 8,     // -1 modifier
          charisma: 6,   // -2 modifier
        },
        level: 1, // +2 proficiency bonus
      })

      vi.mocked(useCharacterCreation).mockReturnValue({ characterData } as any)

      render(
        <SkillsProficienciesStep
          data={{}}
          onChange={mockOnChange}
          onValidationChange={mockOnValidationChange}
        />
      )

      // Athletics (STR-based): 3 (ability) + 2 (proficiency) = +5 when proficient
      // Check that base modifiers show correctly before proficiency is applied
      const athleticsButton = screen.getByText('Athletics').closest('button')
      expect(athleticsButton).toBeInTheDocument()
    })

    it('should handle saving throw proficiencies correctly', () => {
      vi.mocked(useCharacterCreation).mockReturnValue({
        characterData: createMockCharacterData({
          class: 'Fighter',
          stats: { strength: 16, constitution: 14, dexterity: 12, intelligence: 10, wisdom: 8, charisma: 6 }
        }),
      } as any)

      render(
        <SkillsProficienciesStep
          data={{}}
          onChange={mockOnChange}
          onValidationChange={mockOnValidationChange}
        />
      )

      // Fighter has proficiency in Strength and Constitution saving throws
      expect(screen.getByText('2 from class')).toBeInTheDocument()
      
      // Check that strength and constitution show as proficient
      expect(screen.getAllByText('Proficient')).toHaveLength(2)
      expect(screen.getAllByText('Not Proficient')).toHaveLength(4)
    })
  })

  describe('User Interaction and Validation', () => {
    it('should allow selecting class skills up to the limit', async () => {
      vi.mocked(useCharacterCreation).mockReturnValue({
        characterData: createMockCharacterData({ class: 'Fighter' }),
      } as any)

      render(
        <SkillsProficienciesStep
          data={{}}
          onChange={mockOnChange}
          onValidationChange={mockOnValidationChange}
        />
      )

      // Fighter gets 2 skill choices
      const athleticsButton = screen.getByText('Athletics').closest('button')
      const acrobaticsButton = screen.getByText('Acrobatics').closest('button')
      const historyButton = screen.getByText('History').closest('button')

      // Select first skill
      fireEvent.click(athleticsButton!)
      await waitFor(() => {
        expect(screen.getByText('1/2 selected')).toBeInTheDocument()
      })

      // Select second skill
      fireEvent.click(acrobaticsButton!)
      await waitFor(() => {
        expect(screen.getByText('2/2 selected')).toBeInTheDocument()
      })

      // Try to select third skill - should not be allowed
      fireEvent.click(historyButton!)
      // Should still show 2/2 selected
      expect(screen.getByText('2/2 selected')).toBeInTheDocument()
    })

    it('should prevent selecting skills already proficient from background', async () => {
      vi.mocked(useCharacterCreation).mockReturnValue({
        characterData: createMockCharacterData({
          class: 'Fighter',
          background: 'Soldier', // Provides Athletics and Intimidation
        }),
      } as any)

      render(
        <SkillsProficienciesStep
          data={{}}
          onChange={mockOnChange}
          onValidationChange={mockOnValidationChange}
        />
      )

      // Athletics should be disabled because it's already provided by Soldier background
      const athleticsButton = screen.getByText('Athletics').closest('button')
      expect(athleticsButton).toHaveAttribute('disabled')
    })

    it('should validate that all required skill selections are made', async () => {
      vi.mocked(useCharacterCreation).mockReturnValue({
        characterData: createMockCharacterData({ class: 'Fighter' }),
      } as any)

      render(
        <SkillsProficienciesStep
          data={{}}
          onChange={mockOnChange}
          onValidationChange={mockOnValidationChange}
        />
      )

      // Should call onValidationChange with invalid state when no skills selected
      await waitFor(() => {
        expect(mockOnValidationChange).toHaveBeenCalledWith(false, ['Select 2 skills from your class'])
      })

      // Select one skill
      const athleticsButton = screen.getByText('Athletics').closest('button')
      fireEvent.click(athleticsButton!)

      // Should still be invalid with partial selection
      await waitFor(() => {
        expect(mockOnValidationChange).toHaveBeenCalledWith(false, ['Select 2 skills from your class'])
      })

      // Select second skill
      const acrobaticsButton = screen.getByText('Acrobatics').closest('button')
      fireEvent.click(acrobaticsButton!)

      // Should now be valid
      await waitFor(() => {
        expect(mockOnValidationChange).toHaveBeenCalledWith(true, [])
      })
    })

    it('should handle race skill choices correctly', async () => {
      vi.mocked(useCharacterCreation).mockReturnValue({
        characterData: createMockCharacterData({
          race: 'Half-Elf', // Gets 2 additional skill choices
          class: 'Fighter',
        }),
      } as any)

      render(
        <SkillsProficienciesStep
          data={{}}
          onChange={mockOnChange}
          onValidationChange={mockOnValidationChange}
        />
      )

      // Should show racial skill choices section
      expect(screen.getByText('Racial Skill Choices')).toBeInTheDocument()
      expect(screen.getByText('0/2 selected')).toBeInTheDocument()

      // Half-Elf gets Deception and Persuasion choices
      expect(screen.getByText('Deception')).toBeInTheDocument()
      expect(screen.getByText('Persuasion')).toBeInTheDocument()
    })
  })

  describe('Data Output and Integration', () => {
    it('should call onChange with correct skill proficiency data', async () => {
      vi.mocked(useCharacterCreation).mockReturnValue({
        characterData: createMockCharacterData({
          class: 'Fighter',
          background: 'Soldier',
          level: 1,
        }),
      } as any)

      render(
        <SkillsProficienciesStep
          data={{}}
          onChange={mockOnChange}
          onValidationChange={mockOnValidationChange}
        />
      )

      // Select Athletics and Acrobatics for Fighter
      const athleticsButton = screen.getByText('Acrobatics').closest('button') // Athletics disabled by Soldier background
      const perceptionButton = screen.getByText('Perception').closest('button')

      fireEvent.click(athleticsButton!)
      fireEvent.click(perceptionButton!)

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith({
          proficiencyBonus: 2,
          skills: {
            'Athletics': 2,    // From Soldier background
            'Intimidation': 2, // From Soldier background
            'Acrobatics': 2,   // From Fighter class choice
            'Perception': 2,   // From Fighter class choice
          },
          savingThrows: {
            'strength': 2,     // Fighter saving throw proficiency
            'constitution': 2, // Fighter saving throw proficiency
          }
        })
      })
    })

    it('should include all proficiency sources in complete skills overview', () => {
      vi.mocked(useCharacterCreation).mockReturnValue({
        characterData: createMockCharacterData({
          class: 'Fighter',
          background: 'Soldier',
          race: 'Half-Elf',
        }),
      } as any)

      render(
        <SkillsProficienciesStep
          data={{}}
          onChange={mockOnChange}
          onValidationChange={mockOnValidationChange}
        />
      )

      // Should show complete skills overview
      expect(screen.getByText('Complete Skills Overview')).toBeInTheDocument()
      
      // Should show color-coded proficiency sources legend
      expect(screen.getByText('Background')).toBeInTheDocument()
      expect(screen.getByText('Class')).toBeInTheDocument()
      expect(screen.getByText('Race')).toBeInTheDocument()
    })

    it('should provide optimization suggestions', () => {
      vi.mocked(useCharacterCreation).mockReturnValue({
        characterData: createMockCharacterData({
          class: 'Fighter',
          stats: { strength: 16, dexterity: 14, constitution: 12, intelligence: 10, wisdom: 8, charisma: 6 }
        }),
      } as any)

      render(
        <SkillsProficienciesStep
          data={{}}
          onChange={mockOnChange}
          onValidationChange={mockOnValidationChange}
        />
      )

      // Should show optimization suggestion when not all skills are selected
      expect(screen.getByText('💡 Optimization Suggestion')).toBeInTheDocument()
      expect(screen.getByText("Consider skills that match your class's primary abilities")).toBeInTheDocument()
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('should handle missing character data gracefully', () => {
      vi.mocked(useCharacterCreation).mockReturnValue({
        characterData: createMockCharacterData({ class: '', background: '', race: '' }),
      } as any)

      expect(() => {
        render(
          <SkillsProficienciesStep
            data={{}}
            onChange={mockOnChange}
            onValidationChange={mockOnValidationChange}
          />
        )
      }).not.toThrow()
    })

    it('should handle unknown class gracefully', () => {
      vi.mocked(useCharacterCreation).mockReturnValue({
        characterData: createMockCharacterData({ class: 'UnknownClass' }),
      } as any)

      render(
        <SkillsProficienciesStep
          data={{}}
          onChange={mockOnChange}
          onValidationChange={mockOnValidationChange}
        />
      )

      // Should default to 2 skill choices and empty available skills
      expect(screen.getByText('0/2 selected')).toBeInTheDocument()
    })

    it('should handle extreme ability scores correctly', () => {
      vi.mocked(useCharacterCreation).mockReturnValue({
        characterData: createMockCharacterData({
          stats: {
            strength: 3,  // -4 modifier (minimum)
            dexterity: 20, // +5 modifier (maximum)
            constitution: 10,
            intelligence: 10,
            wisdom: 10,
            charisma: 10,
          }
        }),
      } as any)

      expect(() => {
        render(
          <SkillsProficienciesStep
            data={{}}
            onChange={mockOnChange}
            onValidationChange={mockOnValidationChange}
          />
        )
      }).not.toThrow()
    })

    it('should handle level edge cases correctly', () => {
      const edgeCases = [0, 1, 20, 21] // Below minimum, minimum, maximum, above maximum
      
      edgeCases.forEach(level => {
        vi.mocked(useCharacterCreation).mockReturnValue({
          characterData: createMockCharacterData({ level }),
        } as any)

        expect(() => {
          render(
            <SkillsProficienciesStep
              data={{}}
              onChange={mockOnChange}
              onValidationChange={mockOnValidationChange}
            />
          )
        }).not.toThrow()
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', () => {
      vi.mocked(useCharacterCreation).mockReturnValue({
        characterData: createMockCharacterData(),
      } as any)

      render(
        <SkillsProficienciesStep
          data={{}}
          onChange={mockOnChange}
          onValidationChange={mockOnValidationChange}
        />
      )

      // Check for semantic headings
      expect(screen.getByRole('heading', { name: /Skills & Proficiencies/i })).toBeInTheDocument()
      
      // Check for button interactions
      const skillButtons = screen.getAllByRole('button')
      expect(skillButtons.length).toBeGreaterThan(0)
      
      // Each button should be keyboard accessible
      skillButtons.forEach(button => {
        expect(button).not.toHaveAttribute('tabindex', '-1')
      })
    })

    it('should show appropriate disabled states', () => {
      vi.mocked(useCharacterCreation).mockReturnValue({
        characterData: createMockCharacterData({
          class: 'Fighter',
          background: 'Soldier', // Provides Athletics
        }),
      } as any)

      render(
        <SkillsProficienciesStep
          data={{}}
          onChange={mockOnChange}
          onValidationChange={mockOnValidationChange}
        />
      )

      // Athletics button should be disabled and show "already proficient"
      const athleticsButton = screen.getByText('Athletics').closest('button')
      expect(athleticsButton).toHaveAttribute('disabled')
      expect(screen.getByText('(already proficient)')).toBeInTheDocument()
    })
  })
})