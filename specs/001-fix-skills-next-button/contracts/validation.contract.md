# Validation Contract: Skills & Proficiencies Step

**Date**: 2025-11-26
**Branch**: `001-fix-skills-next-button`
**Status**: Design Complete

---

## Component Interface Contract

### WizardStepProps Interface

```typescript
interface WizardStepProps {
  /**
   * Current character creation data for this step
   */
  data: CharacterCreationData

  /**
   * Callback to update character data
   * MUST be called whenever user makes changes to skill selections
   */
  onChange: (data: Partial<CharacterCreationData>) => void

  /**
   * Callback to communicate validation state to parent wizard
   *
   * CONTRACT REQUIREMENTS:
   * 1. MUST be called whenever validation state changes
   * 2. MUST be called synchronously (not debounced or delayed)
   * 3. MUST provide accurate isValid boolean and error messages
   * 4. MUST be stable across renders OR handled via ref pattern
   */
  onValidationChange: (isValid: boolean, errors: string[]) => void
}
```

---

## Validation Trigger Contract

### When Validation MUST Run

The validation logic MUST execute when ANY of the following state changes occur:

1. **selectedClassSkills changes** - User selects/deselects a class skill
2. **selectedRaceSkills changes** - User selects/deselects a race skill
3. **classData changes** - API loads class information
4. **raceSkillCount changes** - Character race changes (from previous step)
5. **finalSkillProficiencies changes** - Computed skill set updates
6. **Component mounts** - Initial validation on first render

### When Validation MUST NOT Run

Validation logic MUST NOT execute when:

1. **onChange callback changes** - Causes infinite loops (Bug #14)
2. **onValidationChange callback changes** - Causes infinite loops (Bug #14)
3. **Unrelated props change** - Performance optimization

---

## Validation Rules Contract

### Rule 1: Class Skill Selection (Priority: CRITICAL)

```typescript
/**
 * RULE: User must select exactly the number of skills required by their class
 *
 * WHEN: classData is loaded (not null)
 * THEN: selectedClassSkills.size MUST equal classData.skillChoices
 *
 * EXAMPLES:
 * - Rogue (4 skills): selectedClassSkills.size === 4
 * - Fighter (2 skills): selectedClassSkills.size === 2
 *
 * ERROR MESSAGE: "Select {classData.skillChoices} skills from your class"
 */
const classSkillsValid = classData
  ? selectedClassSkills.size === classData.skillChoices
  : finalSkillProficiencies.size > 0  // Fallback when API not loaded
```

### Rule 2: Race Skill Selection (Priority: CRITICAL)

```typescript
/**
 * RULE: User must select required race skills (if race grants skill choices)
 *
 * WHEN: raceSkillCount > 0 (race grants skill choices)
 * THEN: selectedRaceSkills.size MUST equal raceSkillCount
 *
 * WHEN: raceSkillCount === 0 (race doesn't grant skill choices)
 * THEN: This rule automatically passes
 *
 * EXAMPLES:
 * - Half-Elf (2 skills): selectedRaceSkills.size === 2
 * - Dwarf (0 skills): Rule passes automatically
 *
 * ERROR MESSAGE: "Select {raceSkillCount} skills from your race"
 */
const raceSkillsValid = raceSkillCount > 0
  ? selectedRaceSkills.size === raceSkillCount
  : true  // No requirement
```

### Rule 3: Fallback Validation (Priority: MEDIUM)

```typescript
/**
 * RULE: When API data unavailable, accept any skill selections
 *
 * PURPOSE: Allow progression with localStorage data when API is slow/failed
 *
 * WHEN: classData === null (API not loaded or failed)
 * THEN: Accept if finalSkillProficiencies.size > 0
 *
 * RATIONALE: User may have previously selected valid skills saved to localStorage.
 * Allow them to progress rather than blocking on API availability.
 * Server-side validation will catch invalid selections during character creation.
 */
const fallbackValid = !classData && finalSkillProficiencies.size === 0
  ? false  // No API data AND no skills selected = invalid
  : true   // Either have API data OR have some skills
```

### Combined Validation

```typescript
/**
 * OVERALL VALIDATION: All applicable rules must pass
 */
const isValid = classSkillsValid && raceSkillsValid
const errors: string[] = []

if (!classSkillsValid) {
  errors.push(classData
    ? `Select ${classData.skillChoices} skills from your class`
    : 'Select your skill proficiencies')
}

if (!raceSkillsValid) {
  errors.push(`Select ${raceSkillCount} skills from your race`)
}
```

---

## Callback Stability Contract

### Problem Statement

The `onValidationChange` callback passed from `CharacterWizard.tsx` uses `useCallback` with dependencies that cause the callback identity to change across renders:

```typescript
// Parent: CharacterWizard.tsx
const handleValidationChange = useCallback((isValid: boolean, errors?: string[]) => {
  if (currentStep) {
    setStepValidity(currentStep.id, isValid, errors)
  }
}, [currentStep, setStepValidity])  // ⚠️ Changes when currentStep changes
```

### Contract Requirement

**The child component (SkillsProficienciesStep) MUST handle unstable callback identities without breaking validation.**

### Solution: Ref Pattern Contract

```typescript
/**
 * CONTRACT: Use ref to decouple validation from callback identity
 *
 * IMPLEMENTATION:
 * 1. Create ref to store latest callback
 * 2. Update ref whenever callback prop changes
 * 3. Validation useEffect calls ref.current instead of direct prop
 * 4. Validation useEffect does NOT include callback in dependencies
 *
 * GUARANTEES:
 * - Latest callback always invoked
 * - No infinite loops (callback not in validation deps)
 * - No race conditions (ref update is synchronous)
 * - Works with unstable parent callbacks
 */

// Step 1: Create ref
const onValidationChangeRef = useRef(onValidationChange)

// Step 2: Keep ref up-to-date
useEffect(() => {
  onValidationChangeRef.current = onValidationChange
}, [onValidationChange])

// Step 3: Use ref in validation
useEffect(() => {
  // ... validation logic ...
  onValidationChangeRef.current(isValid, errors)  // ✅ Always latest

  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [selectedClassSkills, selectedRaceSkills, ...])  // ✅ No callback in deps
```

---

## Performance Contract

### Response Time

```typescript
/**
 * CONTRACT: Validation MUST complete within performance bounds
 *
 * TARGET: <100ms from skill selection to button state update
 *
 * BREAKDOWN:
 * - User click → State update: <10ms (React)
 * - State update → useEffect trigger: <10ms (React)
 * - Validation computation: <5ms (simple arithmetic)
 * - Callback invocation: <1ms (function call)
 * - Context reducer update: <5ms (state update)
 * - Wizard re-render: <50ms (DOM update)
 *
 * TOTAL: ~81ms (well under 100ms target)
 */
```

### No Debouncing

```typescript
/**
 * CONTRACT: Validation MUST NOT be debounced or delayed
 *
 * RATIONALE: Next button must respond immediately to complete selections.
 * User expects instant feedback.
 *
 * FORBIDDEN: setTimeout, requestAnimationFrame, debounce utilities
 * REQUIRED: Synchronous validation in useEffect
 */
```

---

## Error Handling Contract

### Error Message Format

```typescript
/**
 * CONTRACT: Error messages MUST be user-friendly and actionable
 *
 * REQUIREMENTS:
 * 1. Clear indication of what's missing
 * 2. Specific numbers (e.g., "Select 4 skills" not "Select skills")
 * 3. No technical jargon
 * 4. No implementation details
 *
 * EXAMPLES:
 * ✅ "Select 4 skills from your class"
 * ✅ "Select 2 skills from your race"
 * ❌ "selectedClassSkills.size !== classData.skillChoices"
 * ❌ "Validation failed"
 */
```

### Empty Errors Array

```typescript
/**
 * CONTRACT: When validation passes, errors array MUST be empty
 *
 * REQUIREMENT: errors.length === 0 when isValid === true
 * FORBIDDEN: Passing null, undefined, or non-empty array when valid
 */
```

---

## Regression Prevention Contract

### Previous Bug Fixes That MUST NOT Break

1. **Bug #14**: Race conditions in useEffect dependencies
   - `onChange` and `onValidationChange` MUST remain excluded from validation deps
   - No infinite render loops allowed

2. **Bug #16**: Skills initialization race conditions
   - Safety checks for undefined/null data MUST remain
   - `getInitialClassSkills()` and `getInitialRaceSkills()` MUST handle edge cases

3. **Bug #21**: Incomplete class fallback data
   - All 12 D&D classes MUST have fallback data
   - API failure MUST gracefully use fallback

4. **Bug #22**: Validation dependencies
   - `selectedClassSkills` and `selectedRaceSkills` MUST be in validation deps
   - Dependencies MUST be complete and accurate

### Regression Test Contract

```typescript
/**
 * CONTRACT: All previous bug fixes MUST be regression tested
 *
 * REQUIREMENT: Before deploying, verify:
 * 1. No infinite loops when toggling skills rapidly
 * 2. Skills restore correctly from localStorage
 * 3. Fallback data works when API fails
 * 4. Validation runs when selections change
 */
```

---

## Testing Contract

### Unit Test Coverage

```typescript
/**
 * CONTRACT: Validation logic MUST be unit tested in isolation
 *
 * TEST CASES:
 * 1. Validation passes when all class skills selected
 * 2. Validation fails when class skills incomplete
 * 3. Validation passes when race skills complete (if required)
 * 4. Validation fails when race skills incomplete
 * 5. Fallback validation works when classData is null
 * 6. onValidationChange called with correct arguments
 * 7. Ref pattern properly invokes latest callback
 */
```

### Integration Test Coverage

```typescript
/**
 * CONTRACT: Full wizard flow MUST be integration tested
 *
 * TEST SCENARIOS:
 * 1. Navigate to skills step → Select skills → Next button enables
 * 2. Refresh page with localStorage → Skills restored → Button enabled
 * 3. API slow/failed → Select skills → Button enables with fallback
 * 4. Rapidly toggle skills → Button state updates correctly
 */
```

---

## Summary

This contract defines the expected behavior and guarantees for the Skills & Proficiencies validation system. The ref pattern fix MUST satisfy all contract requirements while maintaining backward compatibility and preventing regression of previous bug fixes.