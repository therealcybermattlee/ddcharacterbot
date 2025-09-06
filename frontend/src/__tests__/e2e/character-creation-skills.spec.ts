import { test, expect, Page } from '@playwright/test'

/**
 * End-to-End Tests for Skills & Proficiencies Integration
 * Tests the complete character creation workflow focusing on skills and proficiencies step
 */

test.describe('Character Creation - Skills & Proficiencies E2E', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to character creation wizard
    await page.goto('/wizard/create')
    
    // Wait for page to load
    await expect(page.locator('h1')).toContainText('Create Your Character')
  })

  test('should complete full character creation with skills validation', async ({ page }) => {
    // Step 1: Basic Information
    await fillBasicInfo(page, {
      name: 'Thorin Ironbeard',
      race: 'Dwarf',
      class: 'Fighter',
      background: 'Soldier',
      alignment: 'Lawful Good'
    })
    
    await page.click('[data-testid="wizard-next-button"]')

    // Step 2: Ability Scores - use standard array
    await page.click('[data-testid="method-standard"]')
    await assignStandardArray(page, {
      strength: 15,
      dexterity: 14,
      constitution: 13,
      intelligence: 12,
      wisdom: 10,
      charisma: 8
    })
    
    await page.click('[data-testid="wizard-next-button"]')

    // Step 3: Skills & Proficiencies - Main focus of testing
    await expect(page.locator('h2')).toContainText('Skills & Proficiencies')
    
    // Verify proficiency bonus is correct for level 1
    await expect(page.locator('[data-testid="proficiency-bonus"]')).toContainText('+2')
    
    // Verify saving throws for Fighter (STR + CON)
    await expect(page.locator('[data-testid="saving-throws"]')).toContainText('2 from class')
    await expect(page.locator('[data-testid="strength-save"]')).toContainText('Proficient')
    await expect(page.locator('[data-testid="constitution-save"]')).toContainText('Proficient')
    
    // Verify background skills are automatically applied
    await expect(page.locator('[data-testid="background-skills"]')).toContainText('2 automatic')
    await expect(page.locator('[data-testid="background-skills"]')).toContainText('Athletics')
    await expect(page.locator('[data-testid="background-skills"]')).toContainText('Intimidation')
    
    // Verify class skill choices
    await expect(page.locator('[data-testid="class-skills"]')).toContainText('0/2 selected')
    
    // Select Fighter class skills (Athletics should be disabled - already from background)
    const acrobaticsButton = page.locator('[data-testid="skill-choice-Acrobatics"]')
    const perceptionButton = page.locator('[data-testid="skill-choice-Perception"]')
    const athleticsButton = page.locator('[data-testid="skill-choice-Athletics"]')
    
    // Athletics should be disabled
    await expect(athleticsButton).toBeDisabled()
    await expect(athleticsButton).toContainText('already proficient')
    
    // Select available skills
    await acrobaticsButton.click()
    await expect(page.locator('[data-testid="class-skills"]')).toContainText('1/2 selected')
    
    await perceptionButton.click()
    await expect(page.locator('[data-testid="class-skills"]')).toContainText('2/2 selected')
    
    // Verify skill modifiers are calculated correctly
    await verifySkillModifiers(page, {
      'Athletics': '+5',      // STR 15(+2) + Racial(+0) + Prof(+2) + STR Focus(+1) = +5
      'Intimidation': '+1',   // CHA 8(-1) + Prof(+2) = +1
      'Acrobatics': '+4',     // DEX 14(+2) + Prof(+2) = +4
      'Perception': '+2',     // WIS 10(+0) + Prof(+2) = +2
    })
    
    // Verify complete overview shows all skills
    await expect(page.locator('[data-testid="skills-overview"]')).toContainText('4 skills')
    await expect(page.locator('[data-testid="skills-overview"]')).toContainText('2 saving throws')
    
    // Verify optimization suggestions are shown
    await expect(page.locator('[data-testid="optimization-suggestion"]')).toContainText('💡 Optimization Suggestion')
    
    // Should now be able to proceed to next step
    const nextButton = page.locator('[data-testid="wizard-next-button"]')
    await expect(nextButton).not.toBeDisabled()
    await nextButton.click()
    
    // Step 4: Equipment & Spells
    await expect(page.locator('h2')).toContainText('Equipment & Spells')
  })

  test('should handle different class skill requirements correctly', async ({ page }) => {
    // Test with Rogue (gets 4 skill choices)
    await fillBasicInfo(page, {
      name: 'Shadow Blade',
      race: 'Human',
      class: 'Rogue',
      background: 'Criminal',
      alignment: 'Chaotic Neutral'
    })
    
    await proceedThroughAbilityScores(page)
    
    // Skills step - Rogue gets 4 choices
    await expect(page.locator('[data-testid="class-skills"]')).toContainText('0/4 selected')
    
    // Criminal background provides Deception and Stealth
    await expect(page.locator('[data-testid="background-skills"]')).toContainText('2 automatic')
    await expect(page.locator('[data-testid="background-skills"]')).toContainText('Deception')
    await expect(page.locator('[data-testid="background-skills"]')).toContainText('Stealth')
    
    // Select 4 different skills
    const skillChoices = ['Acrobatics', 'Athletics', 'Insight', 'Investigation']
    for (const skill of skillChoices) {
      await page.locator(`[data-testid="skill-choice-${skill}"]`).click()
    }
    
    await expect(page.locator('[data-testid="class-skills"]')).toContainText('4/4 selected')
    
    // Try to select 5th skill - should not be allowed
    const fifthSkill = page.locator(`[data-testid="skill-choice-Perception"]`)
    await fifthSkill.click()
    await expect(page.locator('[data-testid="class-skills"]')).toContainText('4/4 selected')
  })

  test('should handle racial skill bonuses correctly', async ({ page }) => {
    // Test with Half-Elf (gets additional skill choices)
    await fillBasicInfo(page, {
      name: 'Elaria Moonwhisper',
      race: 'Half-Elf',
      class: 'Bard',
      background: 'Entertainer',
      alignment: 'Chaotic Good'
    })
    
    await proceedThroughAbilityScores(page)
    
    // Should have racial skill section
    await expect(page.locator('[data-testid="racial-skills"]')).toContainText('Racial Skill Choices')
    await expect(page.locator('[data-testid="racial-skills"]')).toContainText('0/2 selected')
    
    // Select racial skills
    await page.locator(`[data-testid="race-skill-choice-Deception"]`).click()
    await page.locator(`[data-testid="race-skill-choice-Persuasion"]`).click()
    
    await expect(page.locator('[data-testid="racial-skills"]')).toContainText('2/2 selected')
  })

  test('should validate step completion correctly', async ({ page }) => {
    await fillBasicInfo(page, {
      name: 'Test Validation',
      race: 'Human',
      class: 'Wizard',
      background: 'Sage',
      alignment: 'Lawful Neutral'
    })
    
    await proceedThroughAbilityScores(page)
    
    // Initially, next button should be disabled
    const nextButton = page.locator('[data-testid="wizard-next-button"]')
    await expect(nextButton).toBeDisabled()
    
    // Error message should show
    await expect(page.locator('[data-testid="validation-errors"]')).toContainText('Select 2 skills from your class')
    
    // Select only 1 skill
    await page.locator(`[data-testid="skill-choice-Arcana"]`).click()
    await expect(nextButton).toBeDisabled()
    
    // Select 2nd skill
    await page.locator(`[data-testid="skill-choice-Investigation"]`).click()
    
    // Now should be valid
    await expect(nextButton).not.toBeDisabled()
    await expect(page.locator('[data-testid="validation-errors"]')).not.toBeVisible()
  })

  test('should persist selections when navigating back and forth', async ({ page }) => {
    await fillBasicInfo(page, {
      name: 'Persistence Test',
      race: 'Elf',
      class: 'Ranger',
      background: 'Outlander',
      alignment: 'True Neutral'
    })
    
    await proceedThroughAbilityScores(page)
    
    // Select skills
    await page.locator(`[data-testid="skill-choice-Athletics"]`).click()
    await page.locator(`[data-testid="skill-choice-Insight"]`).click()
    await page.locator(`[data-testid="skill-choice-Perception"]`).click()
    
    await expect(page.locator('[data-testid="class-skills"]')).toContainText('3/3 selected')
    
    // Go to next step
    await page.locator('[data-testid="wizard-next-button"]').click()
    
    // Go back to skills step
    await page.locator('[data-testid="wizard-prev-button"]').click()
    
    // Selections should be preserved
    await expect(page.locator('[data-testid="class-skills"]')).toContainText('3/3 selected')
    
    // Verify specific skills are still selected
    await expect(page.locator(`[data-testid="skill-choice-Athletics"]`)).toHaveClass(/border-blue-300/)
    await expect(page.locator(`[data-testid="skill-choice-Insight"]`)).toHaveClass(/border-blue-300/)
    await expect(page.locator(`[data-testid="skill-choice-Perception"]`)).toHaveClass(/border-blue-300/)
  })

  test('should handle responsive design on mobile viewports', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    await fillBasicInfo(page, {
      name: 'Mobile Test',
      race: 'Halfling',
      class: 'Cleric',
      background: 'Acolyte',
      alignment: 'Lawful Good'
    })
    
    await proceedThroughAbilityScores(page)
    
    // Verify layout adapts to mobile
    await expect(page.locator('[data-testid="skills-grid"]')).toHaveCSS('grid-template-columns', /1fr|auto/)
    
    // Skill buttons should still be clickable on mobile
    const skillButton = page.locator(`[data-testid="skill-choice-History"]`).first()
    await skillButton.click()
    
    await expect(skillButton).toHaveClass(/border-blue-300/)
  })

  test('should provide accessibility features', async ({ page }) => {
    await fillBasicInfo(page, {
      name: 'Accessibility Test',
      race: 'Dwarf',
      class: 'Paladin',
      background: 'Noble',
      alignment: 'Lawful Good'
    })
    
    await proceedThroughAbilityScores(page)
    
    // Check for proper heading structure
    const mainHeading = page.locator('h2')
    await expect(mainHeading).toContainText('Skills & Proficiencies')
    
    // Check for ARIA labels on skill buttons
    const skillButton = page.locator(`[data-testid="skill-choice-Religion"]`).first()
    await expect(skillButton).toHaveAttribute('role', 'button')
    await expect(skillButton).toHaveAttribute('tabindex', '0')
    
    // Check keyboard navigation
    await skillButton.focus()
    await expect(skillButton).toBeFocused()
    
    // Check that disabled skills have appropriate ARIA attributes
    const disabledSkill = page.locator('[disabled]').first()
    if (await disabledSkill.count() > 0) {
      await expect(disabledSkill).toHaveAttribute('aria-disabled', 'true')
    }
  })

  test('should handle edge cases gracefully', async ({ page }) => {
    // Test with minimal data
    await fillBasicInfo(page, {
      name: 'Edge Case',
      race: 'Human',
      class: 'Fighter',
      background: 'Folk Hero',
      alignment: 'True Neutral'
    })
    
    // Skip ability scores (use defaults)
    await page.click('[data-testid="wizard-next-button"]') // Basic info
    await page.click('[data-testid="wizard-next-button"]') // Ability scores with defaults
    
    // Should still work with default stats
    await expect(page.locator('h2')).toContainText('Skills & Proficiencies')
    await expect(page.locator('[data-testid="proficiency-bonus"]')).toContainText('+2')
    
    // Should be able to select skills even with default stats
    await page.locator(`[data-testid="skill-choice-Acrobatics"]`).click()
    await page.locator(`[data-testid="skill-choice-History"]`).click()
    
    await expect(page.locator('[data-testid="class-skills"]')).toContainText('2/2 selected')
  })
})

// Helper functions
async function fillBasicInfo(page: Page, character: {
  name: string
  race: string
  class: string
  background: string
  alignment: string
}) {
  await page.fill('[data-testid="character-name"]', character.name)
  await page.selectOption('[data-testid="race-select"]', character.race)
  await page.selectOption('[data-testid="class-select"]', character.class)
  await page.selectOption('[data-testid="background-select"]', character.background)
  await page.selectOption('[data-testid="alignment-select"]', character.alignment)
}

async function assignStandardArray(page: Page, scores: {
  strength: number
  dexterity: number
  constitution: number
  intelligence: number
  wisdom: number
  charisma: number
}) {
  const abilities = Object.keys(scores) as Array<keyof typeof scores>
  
  for (const ability of abilities) {
    await page.selectOption(`[data-testid="${ability}-assignment"]`, scores[ability].toString())
  }
}

async function proceedThroughAbilityScores(page: Page) {
  await page.click('[data-testid="wizard-next-button"]') // Basic info
  
  // Use standard array for ability scores
  await page.click('[data-testid="method-standard"]')
  await assignStandardArray(page, {
    strength: 15,
    dexterity: 14,
    constitution: 13,
    intelligence: 12,
    wisdom: 10,
    charisma: 8
  })
  
  await page.click('[data-testid="wizard-next-button"]') // Ability scores
}

async function verifySkillModifiers(page: Page, expectedModifiers: Record<string, string>) {
  for (const [skill, modifier] of Object.entries(expectedModifiers)) {
    await expect(page.locator(`[data-testid="skill-modifier-${skill}"]`)).toContainText(modifier)
  }
}