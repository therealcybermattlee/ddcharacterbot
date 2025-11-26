# Data Model: Fix Skills & Proficiencies Next Button

**Date**: 2025-11-26
**Branch**: `001-fix-skills-next-button`
**Status**: Design Complete

---

## Overview

This bug fix does not introduce new data entities. However, understanding the existing validation state model is critical for implementing the fix correctly.

---

## Validation State Model

### Component State

```typescript
// Skill selection state (managed by React useState)
interface SkillSelectionState {
  selectedClassSkills: Set<SkillName>   // Skills chosen from class options
  selectedRaceSkills: Set<SkillName>    // Skills chosen from race options
  classData: ClassData | null           // API-loaded class information (may be null)
  isLoadingClassData: boolean           // API loading state
}

// Class data structure (from API or fallback)
interface ClassData {
  skillChoices: number                  // How many skills the class gets (2-4)
  availableSkills: SkillName[]         // Which skills the class can choose from
  savingThrows: AbilityName[]          // Saving throw proficiencies
}
```

### Computed State

```typescript
// Derived via useMemo from component state
interface ComputedSkillState {
  finalSkillProficiencies: Set<SkillName>  // All skills (background + class + race)
  savingThrowProficiencies: Set<AbilityName>  // Saving throws from class
  proficiencyBonus: number                 // Based on character level
  raceSkillCount: number                   // How many skills the race grants (0-2)
}
```

### Validation State

```typescript
// Passed to parent via onValidationChange callback
interface ValidationResult {
  isValid: boolean        // True when all requirements met
  errors: string[]        // Human-readable error messages
}

// Validation rules (computed in useEffect)
interface ValidationRules {
  // Rule 1: Class skill selection complete
  classSkillsValid: boolean =
    classData !== null
      ? selectedClassSkills.size === classData.skillChoices
      : finalSkillProficiencies.size > 0  // Fallback: any skills selected

  // Rule 2: Race skill selection complete (if applicable)
  raceSkillsValid: boolean =
    raceSkillCount > 0
      ? selectedRaceSkills.size === raceSkillCount
      : true  // No race skills required

  // Combined validation
  isValid: boolean = classSkillsValid && raceSkillsValid
}
```

---

## State Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER INTERACTION                             │
│   Clicks skill button in Skills & Proficiencies step            │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                  SKILL SELECTION UPDATE                          │
│   handleClassSkillToggle() or handleRaceSkillToggle()          │
│   → Updates selectedClassSkills or selectedRaceSkills state    │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   REACT RE-RENDER                                │
│   1. finalSkillProficiencies useMemo recalculates              │
│   2. Validation useEffect triggers (dependency changed)         │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                  VALIDATION COMPUTATION                          │
│   - Check if selectedClassSkills.size === classData.skillChoices│
│   - Check if selectedRaceSkills.size === raceSkillCount         │
│   - Build errors array if validation fails                      │
│   - Compute isValid = errors.length === 0                      │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼ (BUG OCCURS HERE)
┌─────────────────────────────────────────────────────────────────┐
│              VALIDATION CALLBACK INVOCATION                      │
│   ❌ Current: onValidationChange(isValid, errors)               │
│      Problem: Callback identity may be stale                    │
│                                                                   │
│   ✅ Fix: onValidationChangeRef.current(isValid, errors)        │
│      Solution: Always use latest callback via ref               │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              CHARACTER CREATION CONTEXT                          │
│   Reducer: SET_STEP_VALIDITY                                    │
│   → Updates stepValidities['skills-proficiencies'] = isValid   │
│   → Updates stepErrors['skills-proficiencies'] = errors        │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                  CHARACTER WIZARD                                │
│   Re-renders with updated step.isValid                          │
│   → Next button enabled/disabled based on isValid               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Callback Identity Issue

### Current Implementation (Buggy)

```typescript
// In CharacterWizard.tsx (parent)
const handleValidationChange = useCallback((isValid: boolean, errors?: string[]) => {
  if (currentStep) {
    setStepValidity(currentStep.id, isValid, errors)
  }
}, [currentStep, setStepValidity])  // ⚠️ Callback changes when currentStep changes

// In SkillsProficienciesStep.tsx (child)
useEffect(() => {
  // ... validation logic ...
  onValidationChange(isValid, errors)  // ❌ May call stale callback

  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [selectedClassSkills, selectedRaceSkills, ...])  // ⚠️ onValidationChange NOT in deps
```

**Problem**: When `currentStep` changes (e.g., during navigation), the `handleValidationChange` callback gets a new identity. However, `SkillsProficienciesStep` doesn't have `onValidationChange` in its useEffect dependencies (to avoid infinite loops from Bug #14). This means the child component may call an outdated callback that doesn't properly update the wizard state.

### Fixed Implementation

```typescript
// In SkillsProficienciesStep.tsx
const onValidationChangeRef = useRef(onValidationChange)

// Always keep ref pointing to latest callback
useEffect(() => {
  onValidationChangeRef.current = onValidationChange
}, [onValidationChange])

// Validation useEffect uses ref instead of direct prop
useEffect(() => {
  // ... validation logic ...
  onValidationChangeRef.current(isValid, errors)  // ✅ Always latest callback

  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [selectedClassSkills, selectedRaceSkills, ...])  // ✅ No onValidationChange needed
```

**Solution**: Use a ref to always point to the latest callback while keeping validation dependencies clean. This decouples validation logic from callback identity.

---

## Data Constraints

### Validation Rules

1. **Class Skills**: `selectedClassSkills.size MUST equal classData.skillChoices`
   - Rogue: 4 skills
   - Bard, Ranger: 3 skills
   - Most other classes: 2 skills

2. **Race Skills**: `selectedRaceSkills.size MUST equal raceSkillCount` (if > 0)
   - Half-Elf: 2 skills
   - Variant Human: 1 skill
   - Most races: 0 skills (no requirement)

3. **Fallback Validation**: If `classData === null` (API not loaded), accept if `finalSkillProficiencies.size > 0`

### Error Messages

```typescript
// Error message format
errors: [
  "Select 4 skills from your class",  // Class requirement not met
  "Select 2 skills from your race"    // Race requirement not met
]
```

---

## localStorage Persistence

### Saved Data Structure

```typescript
// Character creation data saved to localStorage
interface SavedCharacterData {
  // ... other fields ...
  skills: Record<SkillName, number>,          // Final skill proficiencies with bonuses
  raceSkills: SkillName[],                    // Explicitly selected race skills
  // Used during restoration to distinguish class vs race selections
}
```

### Restoration Flow

1. Component mounts with `data` prop containing localStorage data
2. `getInitialClassSkills()` extracts class skills (excluding background/race)
3. `getInitialRaceSkills()` extracts race skills from `data.raceSkills`
4. State initialized with restored selections
5. Validation useEffect runs AFTER mount
6. If selections complete, validation should enable Next button
7. **Bug**: If callback is stale during mount, button may not enable

---

## No Schema Changes

This bug fix does not modify:
- Database schema
- API contracts
- Data types or interfaces
- localStorage format

The fix is purely behavioral (callback timing) with no data structure changes.

---

## Summary

**Key Insight**: The bug is not in the data model or validation logic itself, but in how validation results are **communicated** to the parent component. The ref pattern fix ensures validation state always propagates correctly regardless of callback identity changes.