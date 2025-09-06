import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { ReactNode } from 'react'
import { CharacterCreationProvider, useCharacterCreation } from '../CharacterCreationContext'
import * as api from '../../services/api'
import type { CharacterCreationData } from '../../types/wizard'

// Mock the API service
vi.mock('../../services/api')

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
}
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage })

// Mock console.error to avoid noise in tests
const originalConsoleError = console.error
beforeEach(() => {
  console.error = vi.fn()
})
afterEach(() => {
  console.error = originalConsoleError
})

describe('CharacterCreationContext', () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <CharacterCreationProvider>{children}</CharacterCreationProvider>
  )

  beforeEach(() => {
    vi.clearAllMocks()
    mockLocalStorage.getItem.mockReturnValue(null)
  })

  describe('Context Initialization', () => {
    it('should initialize with correct default values', () => {
      const { result } = renderHook(() => useCharacterCreation(), { wrapper })

      expect(result.current.characterData).toEqual({
        name: '',
        race: '',
        class: '',
        level: 1,
        background: '',
        alignment: '',
        stats: {
          strength: 10,
          dexterity: 10,
          constitution: 10,
          intelligence: 10,
          wisdom: 10,
          charisma: 10,
        },
        abilityScoreState: {
          method: 'standard',
          baseScores: {
            strength: 10,
            dexterity: 10,
            constitution: 10,
            intelligence: 10,
            wisdom: 10,
            charisma: 10,
          },
          rollHistory: [],
          pointsUsed: 0,
          standardAssignments: {},
          isComplete: false,
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
      })

      expect(result.current.navigation.currentStep).toBe(0)
      expect(result.current.navigation.totalSteps).toBe(6)
      expect(result.current.isSubmitting).toBe(false)
    })

    it('should define correct wizard steps', () => {
      const { result } = renderHook(() => useCharacterCreation(), { wrapper })

      const expectedStepIds = [
        'basic-info',
        'ability-scores', 
        'skills-proficiencies',
        'equipment-spells',
        'background-details',
        'review-create'
      ]

      expect(result.current.steps).toHaveLength(6)
      result.current.steps.forEach((step, index) => {
        expect(step.id).toBe(expectedStepIds[index])
        expect(step.title).toBeTruthy()
        expect(step.description).toBeTruthy()
        expect(step.component).toBeTruthy()
        expect(step.schema).toBeTruthy()
      })
    })

    it('should load saved progress from localStorage on initialization', () => {
      const savedData: Partial<CharacterCreationData> = {
        name: 'Saved Character',
        race: 'Elf',
        class: 'Wizard',
        level: 3,
      }

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(savedData))

      const { result } = renderHook(() => useCharacterCreation(), { wrapper })

      expect(result.current.characterData.name).toBe('Saved Character')
      expect(result.current.characterData.race).toBe('Elf')
      expect(result.current.characterData.class).toBe('Wizard')
      expect(result.current.characterData.level).toBe(3)
    })
  })

  describe('Navigation Functions', () => {
    it('should navigate between steps correctly', () => {
      const { result } = renderHook(() => useCharacterCreation(), { wrapper })

      // Start at step 0
      expect(result.current.navigation.currentStep).toBe(0)
      expect(result.current.navigation.canGoNext).toBe(true)
      expect(result.current.navigation.canGoPrevious).toBe(false)

      // Go to next step
      act(() => {
        result.current.navigation.nextStep()
      })

      expect(result.current.navigation.currentStep).toBe(1)
      expect(result.current.navigation.canGoNext).toBe(true)
      expect(result.current.navigation.canGoPrevious).toBe(true)

      // Go to previous step
      act(() => {
        result.current.navigation.previousStep()
      })

      expect(result.current.navigation.currentStep).toBe(0)
    })

    it('should navigate to specific steps', () => {
      const { result } = renderHook(() => useCharacterCreation(), { wrapper })

      act(() => {
        result.current.navigation.goToStep(3)
      })

      expect(result.current.navigation.currentStep).toBe(3)

      // Should not allow navigation to invalid steps
      act(() => {
        result.current.navigation.goToStep(-1)
      })
      expect(result.current.navigation.currentStep).toBe(3)

      act(() => {
        result.current.navigation.goToStep(10)
      })
      expect(result.current.navigation.currentStep).toBe(3)
    })

    it('should handle boundary conditions for navigation', () => {
      const { result } = renderHook(() => useCharacterCreation(), { wrapper })

      // Navigate to last step
      act(() => {
        result.current.navigation.goToStep(5)
      })

      expect(result.current.navigation.currentStep).toBe(5)
      expect(result.current.navigation.canGoNext).toBe(false)
      expect(result.current.navigation.canGoPrevious).toBe(true)

      // Try to go beyond last step
      act(() => {
        result.current.navigation.nextStep()
      })
      expect(result.current.navigation.currentStep).toBe(5)

      // Navigate to first step
      act(() => {
        result.current.navigation.goToStep(0)
      })

      expect(result.current.navigation.currentStep).toBe(0)
      expect(result.current.navigation.canGoNext).toBe(true)
      expect(result.current.navigation.canGoPrevious).toBe(false)

      // Try to go before first step
      act(() => {
        result.current.navigation.previousStep()
      })
      expect(result.current.navigation.currentStep).toBe(0)
    })
  })

  describe('Data Management', () => {
    it('should update step data correctly', () => {
      const { result } = renderHook(() => useCharacterCreation(), { wrapper })

      const basicInfoData = {
        name: 'Test Character',
        race: 'Human',
        class: 'Fighter',
        level: 2,
        background: 'Soldier',
        alignment: 'Lawful Good',
      }

      act(() => {
        result.current.updateStepData('basic-info', basicInfoData)
      })

      expect(result.current.characterData.name).toBe('Test Character')
      expect(result.current.characterData.race).toBe('Human')
      expect(result.current.characterData.class).toBe('Fighter')
      expect(result.current.characterData.level).toBe(2)
      expect(result.current.characterData.background).toBe('Soldier')
      expect(result.current.characterData.alignment).toBe('Lawful Good')

      // Should auto-save to localStorage
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'dnd-character-wizard-draft',
        expect.stringContaining('"name":"Test Character"')
      )
    })

    it('should update skills and proficiencies data correctly', () => {
      const { result } = renderHook(() => useCharacterCreation(), { wrapper })

      const skillsData = {
        proficiencyBonus: 3,
        skills: {
          'Athletics': 3,
          'Perception': 3,
        },
        savingThrows: {
          'strength': 3,
          'constitution': 3,
        }
      }

      act(() => {
        result.current.updateStepData('skills-proficiencies', skillsData)
      })

      expect(result.current.characterData.proficiencyBonus).toBe(3)
      expect(result.current.characterData.skills).toEqual({
        'Athletics': 3,
        'Perception': 3,
      })
      expect(result.current.characterData.savingThrows).toEqual({
        'strength': 3,
        'constitution': 3,
      })
    })

    it('should get current step data correctly', () => {
      const { result } = renderHook(() => useCharacterCreation(), { wrapper })

      // Go to skills-proficiencies step
      act(() => {
        result.current.navigation.goToStep(2)
      })

      // Update some data
      act(() => {
        result.current.updateStepData('skills-proficiencies', {
          proficiencyBonus: 2,
          skills: { 'Athletics': 2 },
          savingThrows: { 'strength': 2 }
        })
      })

      // currentStepData should return only relevant data for current step
      expect(result.current.currentStepData).toEqual({
        proficiencyBonus: 2,
        skills: { 'Athletics': 2 },
        savingThrows: { 'strength': 2 }
      })
    })
  })

  describe('Step Validation', () => {
    it('should validate basic info step correctly', async () => {
      const { result } = renderHook(() => useCharacterCreation(), { wrapper })

      // Invalid data - missing required fields
      let isValid = false
      await act(async () => {
        isValid = await result.current.validateStep('basic-info')
      })
      expect(isValid).toBe(false)

      // Valid data
      act(() => {
        result.current.updateStepData('basic-info', {
          name: 'Test Character',
          race: 'Human',
          class: 'Fighter',
          level: 1,
          background: 'Soldier',
          alignment: 'Lawful Good',
        })
      })

      await act(async () => {
        isValid = await result.current.validateStep('basic-info')
      })
      expect(isValid).toBe(true)
    })

    it('should validate ability scores step correctly', async () => {
      const { result } = renderHook(() => useCharacterCreation(), { wrapper })

      // Invalid data - scores too low
      act(() => {
        result.current.updateStepData('ability-scores', {
          strength: 2, // Below minimum
          dexterity: 10,
          constitution: 10,
          intelligence: 10,
          wisdom: 10,
          charisma: 10,
        })
      })

      let isValid = false
      await act(async () => {
        isValid = await result.current.validateStep('ability-scores')
      })
      expect(isValid).toBe(false)

      // Valid data
      act(() => {
        result.current.updateStepData('ability-scores', {
          strength: 15,
          dexterity: 14,
          constitution: 13,
          intelligence: 12,
          wisdom: 10,
          charisma: 8,
        })
      })

      await act(async () => {
        isValid = await result.current.validateStep('ability-scores')
      })
      expect(isValid).toBe(true)
    })

    it('should validate skills proficiencies step correctly', async () => {
      const { result } = renderHook(() => useCharacterCreation(), { wrapper })

      // Valid skills data
      act(() => {
        result.current.updateStepData('skills-proficiencies', {
          proficiencyBonus: 2,
          skills: { 'Athletics': 2 },
          savingThrows: { 'strength': 2 }
        })
      })

      let isValid = false
      await act(async () => {
        isValid = await result.current.validateStep('skills-proficiencies')
      })
      expect(isValid).toBe(true)
    })
  })

  describe('Character Submission', () => {
    it('should submit character successfully', async () => {
      const mockApiPost = vi.mocked(api.api.post).mockResolvedValue({ data: { id: '123' } })

      const { result } = renderHook(() => useCharacterCreation(), { wrapper })

      // Set up complete character data
      act(() => {
        result.current.updateStepData('basic-info', {
          name: 'Test Character',
          race: 'Human',
          class: 'Fighter',
          level: 1,
          background: 'Soldier',
          alignment: 'Lawful Good',
        })
      })

      act(() => {
        result.current.updateStepData('skills-proficiencies', {
          proficiencyBonus: 2,
          skills: { 'Athletics': 2 },
          savingThrows: { 'strength': 2 }
        })
      })

      expect(result.current.isSubmitting).toBe(false)

      // Submit character
      await act(async () => {
        await result.current.submitCharacter()
      })

      expect(mockApiPost).toHaveBeenCalledWith('/characters', {
        name: 'Test Character',
        race: 'Human',
        class: 'Fighter',
        level: 1,
        background: 'Soldier',
        alignment: 'Lawful Good',
        stats: {
          strength: 10,
          dexterity: 10,
          constitution: 10,
          intelligence: 10,
          wisdom: 10,
          charisma: 10,
        },
        hitPoints: {
          current: 8,
          maximum: 8,
          temporary: 0,
        },
        armorClass: 10,
        proficiencyBonus: 2,
        skills: { 'Athletics': 2 },
        savingThrows: { 'strength': 2 },
        equipment: [],
        spells: [],
        notes: '',
      })

      expect(result.current.isSubmitting).toBe(false)
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('dnd-character-wizard-draft')
    })

    it('should handle submission errors', async () => {
      const mockApiPost = vi.mocked(api.api.post).mockRejectedValue(new Error('Network error'))

      const { result } = renderHook(() => useCharacterCreation(), { wrapper })

      await act(async () => {
        await expect(result.current.submitCharacter()).rejects.toThrow('Network error')
      })

      expect(result.current.isSubmitting).toBe(false)
      expect(mockLocalStorage.removeItem).not.toHaveBeenCalled()
    })

    it('should set submitting state during submission', async () => {
      let resolvePromise: (value: any) => void
      const mockApiPost = vi.mocked(api.api.post).mockImplementation(() => {
        return new Promise((resolve) => {
          resolvePromise = resolve
        })
      })

      const { result } = renderHook(() => useCharacterCreation(), { wrapper })

      // Start submission
      const submissionPromise = act(async () => {
        result.current.submitCharacter()
      })

      // Should be submitting
      await waitFor(() => {
        expect(result.current.isSubmitting).toBe(true)
      })

      // Complete submission
      act(() => {
        resolvePromise({ data: { id: '123' } })
      })

      await submissionPromise

      // Should no longer be submitting
      expect(result.current.isSubmitting).toBe(false)
    })
  })

  describe('Progress Persistence', () => {
    it('should save progress to localStorage', () => {
      const { result } = renderHook(() => useCharacterCreation(), { wrapper })

      act(() => {
        result.current.updateStepData('basic-info', { name: 'Test' })
      })

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'dnd-character-wizard-draft',
        expect.stringContaining('"name":"Test"')
      )
    })

    it('should load progress from localStorage', () => {
      const savedData = {
        name: 'Loaded Character',
        race: 'Elf',
      }

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(savedData))

      // Create a new context instance to trigger loading
      const { result } = renderHook(() => useCharacterCreation(), { wrapper })

      expect(result.current.characterData.name).toBe('Loaded Character')
      expect(result.current.characterData.race).toBe('Elf')
    })

    it('should clear progress', () => {
      const { result } = renderHook(() => useCharacterCreation(), { wrapper })

      // Set some data
      act(() => {
        result.current.updateStepData('basic-info', { name: 'Test' })
      })

      // Clear progress
      act(() => {
        result.current.clearProgress()
      })

      expect(result.current.characterData.name).toBe('')
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('dnd-character-wizard-draft')
    })

    it('should handle localStorage errors gracefully', () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage full')
      })

      const { result } = renderHook(() => useCharacterCreation(), { wrapper })

      // Should not throw when localStorage fails
      expect(() => {
        act(() => {
          result.current.updateStepData('basic-info', { name: 'Test' })
        })
      }).not.toThrow()
    })

    it('should handle invalid JSON in localStorage gracefully', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid json')

      // Should not throw when loading invalid JSON
      expect(() => {
        renderHook(() => useCharacterCreation(), { wrapper })
      }).not.toThrow()
    })
  })

  describe('Reset Functionality', () => {
    it('should reset wizard state completely', () => {
      const { result } = renderHook(() => useCharacterCreation(), { wrapper })

      // Set some data and navigate
      act(() => {
        result.current.updateStepData('basic-info', { name: 'Test Character' })
        result.current.navigation.goToStep(3)
      })

      expect(result.current.characterData.name).toBe('Test Character')
      expect(result.current.navigation.currentStep).toBe(3)

      // Reset
      act(() => {
        result.current.navigation.reset()
      })

      expect(result.current.characterData.name).toBe('')
      expect(result.current.navigation.currentStep).toBe(0)
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('dnd-character-wizard-draft')
    })
  })

  describe('Error Handling', () => {
    it('should throw error when used outside provider', () => {
      expect(() => {
        renderHook(() => useCharacterCreation())
      }).toThrow('useCharacterCreation must be used within a CharacterCreationProvider')
    })

    it('should handle validation errors gracefully', async () => {
      const { result } = renderHook(() => useCharacterCreation(), { wrapper })

      // Validate unknown step should return false
      let isValid = true
      await act(async () => {
        isValid = await result.current.validateStep('unknown-step')
      })

      expect(isValid).toBe(false)
    })
  })
})