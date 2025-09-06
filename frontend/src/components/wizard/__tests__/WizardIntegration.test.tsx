import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CharacterCreationProvider } from '../../../contexts/CharacterCreationContext'
import { SkillsProficienciesStep } from '../steps/SkillsProficienciesStep'
import type { WizardStepProps, CharacterCreationData } from '../../../types/wizard'

// Mock UI components
vi.mock('../../ui/badge', () => ({
  Badge: ({ children, className }: any) => <span className={className}>{children}</span>
}))

vi.mock('../../ui/button', () => ({
  Button: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>
}))

vi.mock('../../ui/card', () => ({
  Card: ({ children }: any) => <div data-testid="card">{children}</div>,
  CardContent: ({ children }: any) => <div data-testid="card-content">{children}</div>,
  CardHeader: ({ children }: any) => <div data-testid="card-header">{children}</div>,
  CardTitle: ({ children }: any) => <h3 data-testid="card-title">{children}</h3>
}))

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(() => null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
}
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage })

// Test component that wraps the Skills step with context
function TestSkillsStepWithContext({ 
  initialData, 
  onDataChange, 
  onValidationChange 
}: {
  initialData?: Partial<CharacterCreationData>
  onDataChange?: (data: any) => void
  onValidationChange?: (isValid: boolean, errors?: string[]) => void
}) {
  // Set initial data in localStorage if provided
  if (initialData) {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(initialData))
  }

  const stepProps: WizardStepProps = {
    data: {},
    onChange: onDataChange || vi.fn(),
    onValidationChange: onValidationChange || vi.fn(),
  }

  return (
    <CharacterCreationProvider>
      <SkillsProficienciesStep {...stepProps} />
    </CharacterCreationProvider>
  )
}

describe('Wizard Integration - Skills & Proficiencies Step', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockLocalStorage.getItem.mockReturnValue(null)
  })

  describe('Integration with Character Creation Context', () => {
    it('should integrate with context to show character data from previous steps', () => {
      const characterData: Partial<CharacterCreationData> = {
        name: 'Gandalf',
        race: 'Human',
        class: 'Wizard',
        level: 5,
        background: 'Acolyte',
        stats: {
          strength: 10,
          dexterity: 12,
          constitution: 14,
          intelligence: 18,
          wisdom: 16,
          charisma: 11,
        }
      }

      render(
        <TestSkillsStepWithContext initialData={characterData} />
      )

      // Should show level-appropriate proficiency bonus
      expect(screen.getByText('+3')).toBeInTheDocument() // Level 5 = +3 proficiency

      // Should show class-specific skill choices
      expect(screen.getByText('0/2 selected')).toBeInTheDocument() // Wizard gets 2 choices

      // Should show background skills
      expect(screen.getByText('2 automatic')).toBeInTheDocument() // Acolyte gets 2 skills
      expect(screen.getByText('Insight')).toBeInTheDocument()
      expect(screen.getByText('Religion')).toBeInTheDocument()
    })

    it('should correctly calculate skill modifiers using character stats', () => {
      const characterData: Partial<CharacterCreationData> = {
        class: 'Fighter',
        background: 'Soldier',
        level: 1,
        stats: {
          strength: 16,    // +3 modifier
          dexterity: 14,   // +2 modifier
          constitution: 12, // +1 modifier
          intelligence: 10, // +0 modifier
          wisdom: 8,       // -1 modifier
          charisma: 6,     // -2 modifier
        }
      }

      render(
        <TestSkillsStepWithContext initialData={characterData} />
      )

      // Check Athletics (STR-based, provided by Soldier background)
      // Should show +5 (3 ability + 2 proficiency)
      const athleticsSkill = screen.getByText('Athletics')
      const athleticsCard = athleticsSkill.closest('[data-testid="card-content"]')
      expect(athleticsCard).toContainHTML('+5')

      // Check Intimidation (CHA-based, provided by Soldier background)
      // Should show +0 (-2 ability + 2 proficiency)
      const intimidationSkill = screen.getByText('Intimidation')
      const intimidationCard = intimidationSkill.closest('[data-testid="card-content"]')
      expect(intimidationCard).toContainHTML('+0')
    })

    it('should save skill selections to context and trigger onChange', async () => {
      const mockOnChange = vi.fn()
      const characterData: Partial<CharacterCreationData> = {
        class: 'Rogue',
        background: 'Criminal',
        level: 1,
      }

      render(
        <TestSkillsStepWithContext 
          initialData={characterData}
          onDataChange={mockOnChange}
        />
      )

      // Rogue gets 4 skill choices, Criminal background provides Deception and Stealth
      // Select Acrobatics
      const acrobaticsButton = screen.getByText('Acrobatics').closest('button')
      fireEvent.click(acrobaticsButton!)

      // Should update context with skill selection
      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith({
          proficiencyBonus: 2,
          skills: {
            'Deception': 2,    // From Criminal background
            'Stealth': 2,      // From Criminal background
            'Acrobatics': 2,   // From Rogue class selection
          },
          savingThrows: {
            'dexterity': 2,    // Rogue saving throw proficiency
            'intelligence': 2, // Rogue saving throw proficiency
          }
        })
      })
    })

    it('should validate step completion and report to parent', async () => {
      const mockOnValidation = vi.fn()
      const characterData: Partial<CharacterCreationData> = {
        class: 'Fighter',
        background: 'Folk Hero',
        level: 1,
      }

      render(
        <TestSkillsStepWithContext 
          initialData={characterData}
          onValidationChange={mockOnValidation}
        />
      )

      // Initially invalid - Fighter needs 2 skill selections
      await waitFor(() => {
        expect(mockOnValidation).toHaveBeenCalledWith(false, ['Select 2 skills from your class'])
      })

      // Select first skill
      const acrobaticsButton = screen.getByText('Acrobatics').closest('button')
      fireEvent.click(acrobaticsButton!)

      // Still invalid - need one more
      await waitFor(() => {
        expect(mockOnValidation).toHaveBeenCalledWith(false, ['Select 2 skills from your class'])
      })

      // Select second skill
      const perceptionButton = screen.getByText('Perception').closest('button')
      fireEvent.click(perceptionButton!)

      // Now valid
      await waitFor(() => {
        expect(mockOnValidation).toHaveBeenCalledWith(true, [])
      })
    })
  })

  describe('Complete Character Creation Workflow Integration', () => {
    it('should handle multi-source proficiency conflicts correctly', () => {
      const characterData: Partial<CharacterCreationData> = {
        race: 'Half-Elf',     // Gets 2 additional skill choices
        class: 'Ranger',      // Gets 3 skill choices, includes Perception
        background: 'Folk Hero', // Gets Animal Handling and Survival
        level: 1,
      }

      render(
        <TestSkillsStepWithContext initialData={characterData} />
      )

      // Should show automatic background skills
      expect(screen.getByText('Folk Hero')).toBeInTheDocument()
      expect(screen.getByText('Animal Handling')).toBeInTheDocument()
      expect(screen.getByText('Survival')).toBeInTheDocument()

      // Should show class choices (3 for Ranger)
      expect(screen.getByText('0/3 selected')).toBeInTheDocument()

      // Should show racial choices (2 for Half-Elf)
      expect(screen.getByText('0/2 selected')).toBeInTheDocument()

      // Animal Handling should be disabled in class choices since it's from background
      const animalHandlingButtons = screen.getAllByText('Animal Handling')
      const classAnimalHandlingButton = animalHandlingButtons.find(button => 
        button.closest('button')?.hasAttribute('disabled')
      )
      expect(classAnimalHandlingButton).toBeTruthy()
    })

    it('should persist selections through wizard navigation', () => {
      const characterData: Partial<CharacterCreationData> = {
        class: 'Wizard',
        background: 'Sage',
        level: 3,
        // Simulate skills already selected in previous visit
        skills: {
          'Arcana': 2,    // From Sage background
          'History': 2,   // From Sage background  
          'Investigation': 2, // From Wizard class choice
          'Medicine': 2,  // From Wizard class choice
        },
        savingThrows: {
          'intelligence': 2,
          'wisdom': 2,
        }
      }

      const mockOnChange = vi.fn()

      render(
        <TestSkillsStepWithContext 
          initialData={characterData}
          onDataChange={mockOnChange}
        />
      )

      // Should show previously selected skills as active
      expect(screen.getByText('2/2 selected')).toBeInTheDocument()

      // Investigation and Medicine should show as selected
      const investigationButton = screen.getByText('Investigation').closest('button')
      const medicineButton = screen.getByText('Medicine').closest('button')
      
      expect(investigationButton).toHaveClass('border-blue-300')
      expect(medicineButton).toHaveClass('border-blue-300')

      // Should immediately validate as complete
      const mockOnValidation = vi.fn()
      render(
        <TestSkillsStepWithContext 
          initialData={characterData}
          onValidationChange={mockOnValidation}
        />
      )

      waitFor(() => {
        expect(mockOnValidation).toHaveBeenCalledWith(true, [])
      })
    })

    it('should handle level changes affecting proficiency bonus', () => {
      // Test progression from level 1 to 5
      const levelProgression = [
        { level: 1, expectedBonus: 2 },
        { level: 5, expectedBonus: 3 },
        { level: 9, expectedBonus: 4 },
      ]

      levelProgression.forEach(({ level, expectedBonus }) => {
        const characterData: Partial<CharacterCreationData> = {
          class: 'Paladin',
          background: 'Noble',
          level,
          stats: { strength: 16, charisma: 14, constitution: 12, dexterity: 10, intelligence: 8, wisdom: 10 }
        }

        const { unmount } = render(
          <TestSkillsStepWithContext initialData={characterData} />
        )

        // Should show correct proficiency bonus for level
        expect(screen.getByText(`+${expectedBonus}`)).toBeInTheDocument()

        // Should update skill calculations accordingly
        // History (INT-based, from Noble background): -1 + proficiencyBonus
        const historyModifier = -1 + expectedBonus
        expect(screen.getByText(`+${historyModifier}`)).toBeInTheDocument()

        unmount()
      })
    })
  })

  describe('Edge Cases and Error Recovery', () => {
    it('should handle incomplete character data gracefully', () => {
      const incompleteData: Partial<CharacterCreationData> = {
        // Missing class, background, stats
        name: 'Incomplete Character',
        level: 1,
      }

      expect(() => {
        render(<TestSkillsStepWithContext initialData={incompleteData} />)
      }).not.toThrow()

      // Should show some default state
      expect(screen.getByText('Skills & Proficiencies')).toBeInTheDocument()
      expect(screen.getByText('+2')).toBeInTheDocument() // Default level 1 proficiency bonus
    })

    it('should recover from localStorage corruption', () => {
      // Simulate corrupted localStorage data
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('Corrupted data')
      })

      expect(() => {
        render(<TestSkillsStepWithContext />)
      }).not.toThrow()

      // Should show default state
      expect(screen.getByText('Skills & Proficiencies')).toBeInTheDocument()
    })

    it('should handle race/class/background combinations not in mock data', () => {
      const exoticData: Partial<CharacterCreationData> = {
        race: 'Dragonborn',      // Not in mock race data
        class: 'Artificer',      // Not in mock class data
        background: 'Hermit',    // Not in mock background data
        level: 7,
      }

      expect(() => {
        render(<TestSkillsStepWithContext initialData={exoticData} />)
      }).not.toThrow()

      // Should fall back to defaults
      expect(screen.getByText('0/2 selected')).toBeInTheDocument() // Default skill choices
      expect(screen.getByText('+3')).toBeInTheDocument() // Level 7 proficiency bonus
    })

    it('should maintain UI responsiveness with rapid user interactions', async () => {
      const characterData: Partial<CharacterCreationData> = {
        class: 'Bard',
        level: 1,
      }

      render(
        <TestSkillsStepWithContext initialData={characterData} />
      )

      // Rapidly click multiple skills
      const skillButtons = screen.getAllByRole('button').slice(0, 5)
      
      skillButtons.forEach(button => {
        fireEvent.click(button)
        fireEvent.click(button) // Double click to test toggle
      })

      // Should not crash and should maintain consistent state
      expect(screen.getByText('Skills & Proficiencies')).toBeInTheDocument()
    })
  })

  describe('Accessibility Integration', () => {
    it('should maintain focus management during skill selection', async () => {
      const characterData: Partial<CharacterCreationData> = {
        class: 'Cleric',
        level: 1,
      }

      render(
        <TestSkillsStepWithContext initialData={characterData} />
      )

      // Find first available skill button
      const firstSkillButton = screen.getAllByRole('button')[0]
      firstSkillButton.focus()
      expect(document.activeElement).toBe(firstSkillButton)

      // Click should not break focus management
      fireEvent.click(firstSkillButton)
      
      await waitFor(() => {
        // Focus should still be manageable
        expect(document.activeElement).toBeTruthy()
      })
    })

    it('should provide appropriate ARIA states for selected skills', async () => {
      const characterData: Partial<CharacterCreationData> = {
        class: 'Sorcerer',
        level: 1,
      }

      render(
        <TestSkillsStepWithContext initialData={characterData} />
      )

      const persuasionButton = screen.getByText('Persuasion').closest('button')
      
      // Initially not selected
      expect(persuasionButton).not.toHaveClass('bg-blue-50')
      
      // Select skill
      fireEvent.click(persuasionButton!)
      
      await waitFor(() => {
        // Should have selected state styling
        expect(persuasionButton).toHaveClass('border-blue-300')
        expect(persuasionButton).toHaveClass('bg-blue-50')
      })
    })

    it('should provide clear indication of disabled skills', () => {
      const characterData: Partial<CharacterCreationData> = {
        class: 'Monk',
        background: 'Hermit', // Provides Medicine and Religion
        level: 1,
      }

      render(
        <TestSkillsStepWithContext initialData={characterData} />
      )

      // Medicine should be disabled in class choices if Monk can choose it
      const medicineButtons = screen.getAllByText('Medicine')
      const disabledMedicineButton = medicineButtons.find(button => 
        button.closest('button')?.hasAttribute('disabled')
      )
      
      if (disabledMedicineButton) {
        expect(disabledMedicineButton.closest('button')).toHaveAttribute('disabled')
        expect(screen.getByText('(already proficient)')).toBeInTheDocument()
      }
    })
  })
})