import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { EquipmentSpellsStep } from '../EquipmentSpellsStep'
import { useCharacterCreation } from '../../../../contexts/CharacterCreationContext'
import type { CharacterCreationData } from '../../../../types/wizard'

// Mock the character creation context
vi.mock('../../../../contexts/CharacterCreationContext')

// Mock UI components
vi.mock('../../../ui/badge', () => ({
  Badge: ({ children, className, variant }: any) => <span className={`badge ${className} ${variant}`}>{children}</span>
}))

vi.mock('../../../ui/button', () => ({
  Button: ({ children, onClick, disabled }: any) => 
    <button onClick={onClick} disabled={disabled}>{children}</button>
}))

vi.mock('../../../ui/card', () => ({
  Card: ({ children, className }: any) => <div data-testid="card" className={className}>{children}</div>,
  CardContent: ({ children, className }: any) => <div data-testid="card-content" className={className}>{children}</div>,
  CardHeader: ({ children, className }: any) => <div data-testid="card-header" className={className}>{children}</div>,
  CardTitle: ({ children, className }: any) => <h3 data-testid="card-title" className={className}>{children}</h3>
}))

describe('EquipmentSpellsStep', () => {
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

  describe('Equipment Pack Validation', () => {
    it('should display all 7 D&D 5e equipment packs correctly', () => {
      const packs = [
        "Burglar's Pack",
        "Diplomat's Pack", 
        "Dungeoneer's Pack",
        "Entertainer's Pack",
        "Explorer's Pack",
        "Priest's Pack",
        "Scholar's Pack"
      ]
      
      // Test each class that uses different packs
      const classPackPairs = [
        { class: 'Rogue', expectedPack: "Burglar's Pack" },
        { class: 'Wizard', expectedPack: "Scholar's Pack" },
        { class: 'Fighter', expectedPack: "Dungeoneer's Pack" },
        { class: 'Cleric', expectedPack: "Priest's Pack" }
      ]

      classPackPairs.forEach(({ class: className, expectedPack }) => {
        vi.mocked(useCharacterCreation).mockReturnValue({
          characterData: createMockCharacterData({ class: className }),
        } as any)

        render(
          <EquipmentSpellsStep
            data={{}}
            onChange={mockOnChange}
            onValidationChange={mockOnValidationChange}
          />
        )

        expect(screen.getByText(expectedPack)).toBeInTheDocument()
      })
    })

    it('should validate Burglar Pack contents against D&D 5e PHB', () => {
      vi.mocked(useCharacterCreation).mockReturnValue({
        characterData: createMockCharacterData({ class: 'Rogue' }),
      } as any)

      render(
        <EquipmentSpellsStep
          data={{}}
          onChange={mockOnChange}
          onValidationChange={mockOnValidationChange}
        />
      )

      // Burglar's Pack specific items
      const expectedItems = [
        'Backpack',
        'Ball Bearings (bag of 1,000)',
        'String (10 feet)',
        'Bell',
        'Candle',
        'Crowbar',
        'Hammer',
        'Piton',
        'Hooded Lantern',
        'Oil Flask',
        'Rations (5 days)',
        'Tinderbox',
        'Waterskin',
        'Hempen Rope (50 feet)'
      ]

      expectedItems.forEach(item => {
        expect(screen.getByText(item)).toBeInTheDocument()
      })
    })

    it('should calculate pack weights and values correctly', () => {
      vi.mocked(useCharacterCreation).mockReturnValue({
        characterData: createMockCharacterData({ class: 'Rogue' }),
      } as any)

      render(
        <EquipmentSpellsStep
          data={{}}
          onChange={mockOnChange}
          onValidationChange={mockOnValidationChange}
        />
      )

      // Burglar's Pack should be 46.5 lbs according to D&D 5e
      expect(screen.getByText(/46\.5 lbs/)).toBeInTheDocument()
    })
  })

  describe('Class Equipment Choices - Fighter', () => {
    beforeEach(() => {
      vi.mocked(useCharacterCreation).mockReturnValue({
        characterData: createMockCharacterData({ class: 'Fighter', stats: { ...createMockCharacterData().stats, strength: 16 } }),
      } as any)
    })

    it('should provide Fighter armor choices according to D&D 5e rules', () => {
      render(
        <EquipmentSpellsStep
          data={{}}
          onChange={mockOnChange}
          onValidationChange={mockOnValidationChange}
        />
      )

      // Fighter gets choice between Chain Mail or Leather Armor + Shield
      expect(screen.getByText('Choose armor:')).toBeInTheDocument()
      expect(screen.getByText('Chain Mail')).toBeInTheDocument()
      expect(screen.getByText('Leather Armor')).toBeInTheDocument()
      expect(screen.getAllByText('Shield')).toHaveLength(2) // Appears in multiple choices
    })

    it('should provide Fighter weapon choices according to D&D 5e rules', () => {
      render(
        <EquipmentSpellsStep
          data={{}}
          onChange={mockOnChange}
          onValidationChange={mockOnValidationChange}
        />
      )

      // Fighter weapon choices
      expect(screen.getByText('Choose weapons:')).toBeInTheDocument()
      expect(screen.getByText('Longsword')).toBeInTheDocument()
      expect(screen.getByText('Battleaxe')).toBeInTheDocument()
      expect(screen.getByText('Handaxe')).toBeInTheDocument()
    })

    it('should provide Fighter ranged weapon choices', () => {
      render(
        <EquipmentSpellsStep
          data={{}}
          onChange={mockOnChange}
          onValidationChange={mockOnValidationChange}
        />
      )

      expect(screen.getByText('Choose ranged weapon:')).toBeInTheDocument()
      expect(screen.getByText('Light Crossbow')).toBeInTheDocument()
      expect(screen.getByText('Crossbow Bolts')).toBeInTheDocument()
    })

    it('should allow selecting equipment options and validate completeness', async () => {
      render(
        <EquipmentSpellsStep
          data={{}}
          onChange={mockOnChange}
          onValidationChange={mockOnValidationChange}
        />
      )

      // Initially should be invalid - no choices made
      expect(mockOnValidationChange).toHaveBeenCalledWith(false, expect.arrayContaining([
        expect.stringMatching(/Make a selection for:/),
      ]))

      // Select Chain Mail option (first choice, first option)
      const chainMailOption = screen.getByText('Chain Mail').closest('button')
      fireEvent.click(chainMailOption!)

      // Select Longsword + Shield option
      const longswordOption = screen.getByText('Longsword').closest('button')
      fireEvent.click(longswordOption!)

      // Select Light Crossbow option
      const crossbowOption = screen.getByText('Light Crossbow').closest('button')
      fireEvent.click(crossbowOption!)

      // Should now be valid
      await waitFor(() => {
        expect(mockOnValidationChange).toHaveBeenCalledWith(true, [])
      })
    })
  })

  describe('Class Equipment Choices - Wizard', () => {
    beforeEach(() => {
      vi.mocked(useCharacterCreation).mockReturnValue({
        characterData: createMockCharacterData({ class: 'Wizard' }),
      } as any)
    })

    it('should provide Wizard equipment choices according to D&D 5e rules', () => {
      render(
        <EquipmentSpellsStep
          data={{}}
          onChange={mockOnChange}
          onValidationChange={mockOnValidationChange}
        />
      )

      // Wizard choices
      expect(screen.getByText('Choose weapon:')).toBeInTheDocument()
      expect(screen.getByText('Quarterstaff')).toBeInTheDocument()
      expect(screen.getByText('Dagger')).toBeInTheDocument()

      expect(screen.getByText('Choose spellcasting focus:')).toBeInTheDocument()
      expect(screen.getByText('Component Pouch')).toBeInTheDocument()
      expect(screen.getByText('Arcane Focus')).toBeInTheDocument()
    })

    it('should include Wizard additional equipment', () => {
      render(
        <EquipmentSpellsStep
          data={{}}
          onChange={mockOnChange}
          onValidationChange={mockOnValidationChange}
        />
      )

      expect(screen.getByText('Additional Class Equipment')).toBeInTheDocument()
      expect(screen.getByText('Spellbook')).toBeInTheDocument()
      expect(screen.getByText('Contains 6 1st-level wizard spells of your choice.')).toBeInTheDocument()
    })
  })

  describe('Class Equipment Choices - Cleric', () => {
    beforeEach(() => {
      vi.mocked(useCharacterCreation).mockReturnValue({
        characterData: createMockCharacterData({ class: 'Cleric' }),
      } as any)
    })

    it('should provide Cleric equipment choices according to D&D 5e rules', () => {
      render(
        <EquipmentSpellsStep
          data={{}}
          onChange={mockOnChange}
          onValidationChange={mockOnValidationChange}
        />
      )

      // Cleric armor choices
      expect(screen.getByText('Scale Mail')).toBeInTheDocument()
      
      // Cleric weapon choices
      expect(screen.getByText('Warhammer')).toBeInTheDocument()
      expect(screen.getByText('Mace')).toBeInTheDocument()

      // Cleric ranged options
      expect(screen.getByText('Javelin')).toBeInTheDocument()
    })

    it('should include Cleric additional equipment', () => {
      render(
        <EquipmentSpellsStep
          data={{}}
          onChange={mockOnChange}
          onValidationChange={mockOnValidationChange}
        />
      )

      expect(screen.getByText('Holy Symbol')).toBeInTheDocument()
    })
  })

  describe('Encumbrance System', () => {
    it('should calculate carrying capacity based on Strength score', () => {
      vi.mocked(useCharacterCreation).mockReturnValue({
        characterData: createMockCharacterData({ 
          class: 'Fighter',
          stats: { ...createMockCharacterData().stats, strength: 16 } // 16 STR = 240 lb capacity
        }),
      } as any)

      render(
        <EquipmentSpellsStep
          data={{}}
          onChange={mockOnChange}
          onValidationChange={mockOnValidationChange}
        />
      )

      expect(screen.getByText('Carrying Capacity')).toBeInTheDocument()
      expect(screen.getByText(/240 lbs \(STR 16\)/)).toBeInTheDocument()
    })

    it('should show encumbrance warnings when overloaded', () => {
      vi.mocked(useCharacterCreation).mockReturnValue({
        characterData: createMockCharacterData({ 
          class: 'Fighter',
          stats: { ...createMockCharacterData().stats, strength: 8 } // 8 STR = 120 lb capacity, will be overloaded by Dungeoneer's Pack
        }),
      } as any)

      render(
        <EquipmentSpellsStep
          data={{}}
          onChange={mockOnChange}
          onValidationChange={mockOnValidationChange}
        />
      )

      // Dungeoneer's Pack is 61.5 lbs, which is heavily encumbered at low STR
      expect(screen.getByText(/heavily encumbered|Overloaded/i)).toBeInTheDocument()
    })
  })

  describe('Spellcasting System - Wizard', () => {
    beforeEach(() => {
      vi.mocked(useCharacterCreation).mockReturnValue({
        characterData: createMockCharacterData({ 
          class: 'Wizard',
          stats: { ...createMockCharacterData().stats, intelligence: 16 } // +3 INT modifier
        }),
      } as any)
    })

    it('should display Wizard spellcasting information correctly', () => {
      render(
        <EquipmentSpellsStep
          data={{}}
          onChange={mockOnChange}
          onValidationChange={mockOnValidationChange}
        />
      )

      expect(screen.getByText('Spellcasting')).toBeInTheDocument()
      expect(screen.getByText('Spellcasting Details')).toBeInTheDocument()
      
      // Check spellcasting ability
      expect(screen.getByText('intelligence')).toBeInTheDocument()
      
      // Check spell slots
      expect(screen.getByText('2')).toBeInTheDocument() // 1st level has 2 spell slots
      
      // Check spell attack bonus and save DC
      expect(screen.getByText('+5')).toBeInTheDocument() // +2 prof + 3 INT
      expect(screen.getByText('13')).toBeInTheDocument() // 8 + 2 prof + 3 INT
    })

    it('should provide Wizard cantrip selection according to D&D 5e rules', () => {
      render(
        <EquipmentSpellsStep
          data={{}}
          onChange={mockOnChange}
          onValidationChange={mockOnValidationChange}
        />
      )

      expect(screen.getByText('Cantrips (Level 0)')).toBeInTheDocument()
      expect(screen.getByText('0/3 selected')).toBeInTheDocument() // Wizard gets 3 cantrips

      // Check sample wizard cantrips
      expect(screen.getByText('Fire Bolt')).toBeInTheDocument()
      expect(screen.getByText('Mage Hand')).toBeInTheDocument()
      expect(screen.getByText('Prestidigitation')).toBeInTheDocument()
      expect(screen.getByText('Light')).toBeInTheDocument()
    })

    it('should provide Wizard 1st level spell selection', () => {
      render(
        <EquipmentSpellsStep
          data={{}}
          onChange={mockOnChange}
          onValidationChange={mockOnValidationChange}
        />
      )

      expect(screen.getByText('1st Level Spells')).toBeInTheDocument()
      expect(screen.getByText('0/6 selected')).toBeInTheDocument() // Wizard gets 6 1st level spells

      // Check sample wizard 1st level spells
      expect(screen.getByText('Magic Missile')).toBeInTheDocument()
      expect(screen.getByText('Shield')).toBeInTheDocument()
      expect(screen.getByText('Detect Magic')).toBeInTheDocument()
      expect(screen.getByText('Sleep')).toBeInTheDocument()
    })

    it('should allow selecting cantrips up to the limit', async () => {
      render(
        <EquipmentSpellsStep
          data={{}}
          onChange={mockOnChange}
          onValidationChange={mockOnValidationChange}
        />
      )

      // Select Fire Bolt
      const fireBoltButton = screen.getByText('Fire Bolt').closest('button')
      fireEvent.click(fireBoltButton!)

      await waitFor(() => {
        expect(screen.getByText('1/3 selected')).toBeInTheDocument()
      })

      // Select Mage Hand
      const mageHandButton = screen.getByText('Mage Hand').closest('button')
      fireEvent.click(mageHandButton!)

      await waitFor(() => {
        expect(screen.getByText('2/3 selected')).toBeInTheDocument()
      })

      // Select Prestidigitation
      const prestidigitationButton = screen.getByText('Prestidigitation').closest('button')
      fireEvent.click(prestidigitationButton!)

      await waitFor(() => {
        expect(screen.getByText('3/3 selected')).toBeInTheDocument()
      })

      // Try to select Light - should not work (at limit)
      const lightButton = screen.getByText('Light').closest('button')
      fireEvent.click(lightButton!)
      
      // Should still show 3/3 selected
      expect(screen.getByText('3/3 selected')).toBeInTheDocument()
    })

    it('should validate spell selection completeness', async () => {
      render(
        <EquipmentSpellsStep
          data={{}}
          onChange={mockOnChange}
          onValidationChange={mockOnValidationChange}
        />
      )

      // Should be invalid initially
      expect(mockOnValidationChange).toHaveBeenCalledWith(false, expect.arrayContaining([
        expect.stringMatching(/Select \d+ cantrips/),
        expect.stringMatching(/Select \d+ spells/),
      ]))
    })
  })

  describe('Spellcasting System - Cleric', () => {
    beforeEach(() => {
      vi.mocked(useCharacterCreation).mockReturnValue({
        characterData: createMockCharacterData({ 
          class: 'Cleric',
          stats: { ...createMockCharacterData().stats, wisdom: 16 }, // +3 WIS modifier
          level: 1
        }),
      } as any)
    })

    it('should display Cleric spellcasting information correctly', () => {
      render(
        <EquipmentSpellsStep
          data={{}}
          onChange={mockOnChange}
          onValidationChange={mockOnValidationChange}
        />
      )

      // Check spellcasting ability is Wisdom
      expect(screen.getByText('wisdom')).toBeInTheDocument()
      expect(screen.getByText('Holy Symbol')).toBeInTheDocument()
    })

    it('should provide Cleric cantrips according to D&D 5e rules', () => {
      render(
        <EquipmentSpellsStep
          data={{}}
          onChange={mockOnChange}
          onValidationChange={mockOnValidationChange}
        />
      )

      expect(screen.getByText('0/3 selected')).toBeInTheDocument() // Cleric gets 3 cantrips

      // Check Cleric-specific cantrips
      expect(screen.getByText('Sacred Flame')).toBeInTheDocument()
      expect(screen.getByText('Guidance')).toBeInTheDocument()
      expect(screen.getByText('Thaumaturgy')).toBeInTheDocument()
      expect(screen.getByText('Spare the Dying')).toBeInTheDocument()
    })

    it('should show prepared spells information for Cleric', () => {
      render(
        <EquipmentSpellsStep
          data={{}}
          onChange={mockOnChange}
          onValidationChange={mockOnValidationChange}
        />
      )

      // Cleric can prepare spells = WIS modifier + level = 3 + 1 = 4
      expect(screen.getByText('4')).toBeInTheDocument() // Spells you can prepare
    })

    it('should provide Cleric 1st level spells', () => {
      render(
        <EquipmentSpellsStep
          data={{}}
          onChange={mockOnChange}
          onValidationChange={mockOnValidationChange}
        />
      )

      // Check Cleric-specific spells
      expect(screen.getByText('Cure Wounds')).toBeInTheDocument()
      expect(screen.getByText('Healing Word')).toBeInTheDocument()
      expect(screen.getByText('Bless')).toBeInTheDocument()
      expect(screen.getByText('Command')).toBeInTheDocument()
    })
  })

  describe('Non-Spellcasting Classes', () => {
    it('should not show spellcasting section for Fighter', () => {
      vi.mocked(useCharacterCreation).mockReturnValue({
        characterData: createMockCharacterData({ class: 'Fighter' }),
      } as any)

      render(
        <EquipmentSpellsStep
          data={{}}
          onChange={mockOnChange}
          onValidationChange={mockOnValidationChange}
        />
      )

      expect(screen.queryByText('Spellcasting')).not.toBeInTheDocument()
      expect(screen.queryByText('Cantrips')).not.toBeInTheDocument()
    })

    it('should not show spellcasting section for Rogue', () => {
      vi.mocked(useCharacterCreation).mockReturnValue({
        characterData: createMockCharacterData({ class: 'Rogue' }),
      } as any)

      render(
        <EquipmentSpellsStep
          data={{}}
          onChange={mockOnChange}
          onValidationChange={mockOnValidationChange}
        />
      )

      expect(screen.queryByText('Spellcasting')).not.toBeInTheDocument()
      expect(screen.queryByText('Cantrips')).not.toBeInTheDocument()
    })
  })

  describe('Data Integration', () => {
    it('should call onChange with complete equipment and spell data', async () => {
      vi.mocked(useCharacterCreation).mockReturnValue({
        characterData: createMockCharacterData({ class: 'Wizard' }),
      } as any)

      render(
        <EquipmentSpellsStep
          data={{}}
          onChange={mockOnChange}
          onValidationChange={mockOnValidationChange}
        />
      )

      // Make equipment choices
      const quarterstaffButton = screen.getByText('Quarterstaff').closest('button')
      fireEvent.click(quarterstaffButton!)

      const arcanefocusButton = screen.getByText('Arcane Focus').closest('button')
      fireEvent.click(arcanefocusButton!)

      // Select some cantrips and spells
      const fireBoltButton = screen.getByText('Fire Bolt').closest('button')
      fireEvent.click(fireBoltButton!)

      const magicMissileButton = screen.getByText('Magic Missile').closest('button')
      fireEvent.click(magicMissileButton!)

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith(
          expect.objectContaining({
            equipment: expect.arrayContaining([
              expect.objectContaining({ name: 'Quarterstaff' }),
              expect.objectContaining({ name: 'Arcane Focus' }),
              expect.objectContaining({ name: 'Spellbook' })
            ]),
            spells: expect.arrayContaining([
              expect.objectContaining({ name: 'Fire Bolt', level: 0 }),
              expect.objectContaining({ name: 'Magic Missile', level: 1 })
            ]),
            equipmentChoices: expect.any(Object),
            spellChoices: expect.objectContaining({
              cantrips: expect.arrayContaining(['fire_bolt']),
              knownSpells: expect.arrayContaining(['magic_missile'])
            })
          })
        )
      })
    })

    it('should handle missing class data gracefully', () => {
      vi.mocked(useCharacterCreation).mockReturnValue({
        characterData: createMockCharacterData({ class: '' }),
      } as any)

      render(
        <EquipmentSpellsStep
          data={{}}
          onChange={mockOnChange}
          onValidationChange={mockOnValidationChange}
        />
      )

      expect(screen.getByText('No Class Selected')).toBeInTheDocument()
      expect(screen.getByText('Please select a class in the previous step to configure equipment and spells.')).toBeInTheDocument()
    })
  })

  describe('UI and Accessibility', () => {
    beforeEach(() => {
      vi.mocked(useCharacterCreation).mockReturnValue({
        characterData: createMockCharacterData({ class: 'Wizard' }),
      } as any)
    })

    it('should have proper heading structure', () => {
      render(
        <EquipmentSpellsStep
          data={{}}
          onChange={mockOnChange}
          onValidationChange={mockOnValidationChange}
        />
      )

      expect(screen.getByText('Equipment & Spells')).toBeInTheDocument()
      expect(screen.getByText('Starting Equipment')).toBeInTheDocument()
      expect(screen.getByText('Spellcasting')).toBeInTheDocument()
      expect(screen.getByText('Character Summary')).toBeInTheDocument()
    })

    it('should show selection counts and progress indicators', () => {
      render(
        <EquipmentSpellsStep
          data={{}}
          onChange={mockOnChange}
          onValidationChange={mockOnValidationChange}
        />
      )

      // Equipment count
      expect(screen.getByText(/\d+ items/)).toBeInTheDocument()
      
      // Spell selection counts
      expect(screen.getByText('0/3 selected')).toBeInTheDocument() // Cantrips
      expect(screen.getByText('0/6 selected')).toBeInTheDocument() // Spells
    })

    it('should provide proper button states for selections', async () => {
      render(
        <EquipmentSpellsStep
          data={{}}
          onChange={mockOnChange}
          onValidationChange={mockOnValidationChange}
        />
      )

      const fireBoltButton = screen.getByText('Fire Bolt').closest('button')
      
      // Should be clickable initially
      expect(fireBoltButton).not.toBeDisabled()
      
      // Click to select
      fireEvent.click(fireBoltButton!)
      
      // Should show visual selection state
      await waitFor(() => {
        expect(fireBoltButton).toHaveClass(/border-purple-400|bg-purple-50/)
      })
    })
  })

  describe('Character Summary Integration', () => {
    it('should display comprehensive character summary', () => {
      vi.mocked(useCharacterCreation).mockReturnValue({
        characterData: createMockCharacterData({ 
          class: 'Wizard',
          stats: { ...createMockCharacterData().stats, intelligence: 16 }
        }),
      } as any)

      render(
        <EquipmentSpellsStep
          data={{}}
          onChange={mockOnChange}
          onValidationChange={mockOnValidationChange}
        />
      )

      expect(screen.getByText('Character Summary')).toBeInTheDocument()
      
      // Should show spell attack bonus and save DC
      expect(screen.getByText('+5')).toBeInTheDocument() // Attack bonus
      expect(screen.getByText('13')).toBeInTheDocument() // Save DC
      
      // Should show ability modifier
      expect(screen.getByText('intelligence (+3)')).toBeInTheDocument()
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('should handle extreme ability scores correctly', () => {
      vi.mocked(useCharacterCreation).mockReturnValue({
        characterData: createMockCharacterData({
          class: 'Wizard',
          stats: { 
            ...createMockCharacterData().stats, 
            intelligence: 3, // -4 modifier
            strength: 20     // +5 modifier
          }
        }),
      } as any)

      expect(() => {
        render(
          <EquipmentSpellsStep
            data={{}}
            onChange={mockOnChange}
            onValidationChange={mockOnValidationChange}
          />
        )
      }).not.toThrow()
    })

    it('should handle level edge cases correctly', () => {
      const edgeCases = [1, 20] // Minimum and maximum levels
      
      edgeCases.forEach(level => {
        vi.mocked(useCharacterCreation).mockReturnValue({
          characterData: createMockCharacterData({ level }),
        } as any)

        expect(() => {
          render(
            <EquipmentSpellsStep
              data={{}}
              onChange={mockOnChange}
              onValidationChange={mockOnValidationChange}
            />
          )
        }).not.toThrow()
      })
    })

    it('should handle unknown class gracefully', () => {
      vi.mocked(useCharacterCreation).mockReturnValue({
        characterData: createMockCharacterData({ class: 'UnknownClass' }),
      } as any)

      expect(() => {
        render(
          <EquipmentSpellsStep
            data={{}}
            onChange={mockOnChange}
            onValidationChange={mockOnValidationChange}
          />
        )
      }).not.toThrow()

      // Should show no class selected message or handle gracefully
      expect(screen.getByText('No Class Selected')).toBeInTheDocument()
    })
  })
})