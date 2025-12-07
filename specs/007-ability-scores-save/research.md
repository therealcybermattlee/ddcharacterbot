# Research: Ability Scores Not Persisting on Navigation

**Feature**: 007-ability-scores-save
**Date**: 2025-12-07
**Status**: Investigation Complete

---

## Executive Summary

**Finding**: ✅ **ROOT CAUSE IDENTIFIED**

The ability scores save bug is caused by the same unstable callback identity issue that affected BasicInfoStep (Feature 006) and SkillsProficienciesStep (Features 004, Bug #22, Bug #23). The AbilityScoresStep component directly calls the `onValidationChange` callback without using the ref pattern, causing validation state to not properly update when the callback identity changes during wizard navigation.

**Impact**: The data is actually being saved via `onChange`, but the validation state isn't updating properly via `onValidationChange`. This leaves the step marked as invalid, preventing the Next button from enabling and blocking wizard progression.

---

## Component Location

**Primary Component**:
- `/Users/therealtwobowshow/CodeStuff/ddcharacterbot/frontend/src/components/wizard/steps/AbilityScoresStep.tsx`

**Related Components**:
- `/Users/therealtwobowshow/CodeStuff/ddcharacterbot/frontend/src/components/wizard/CharacterWizard.tsx` (parent)
- `/Users/therealtwobowshow/CodeStuff/ddcharacterbot/frontend/src/components/wizard/steps/SkillsProficienciesStep.tsx` (working reference with ref pattern)
- `/Users/therealtwobowshow/CodeStuff/ddcharacterbot/frontend/src/components/wizard/steps/BasicInfoStep.tsx` (working reference with ref pattern)
- `/Users/therealtwobowshow/CodeStuff/ddcharacterbot/frontend/src/components/AbilityScoreGenerator.tsx` (child component managing ability score state)

---

## Root Cause Analysis

### The Problem: Unstable Callback Identity

**CharacterWizard.tsx** (Lines 146-164) provides validation callbacks to child steps:

```typescript
const handleValidationChange = useCallback((isValid: boolean, errors?: string[]) => {
  if (currentStep) {
    setStepValidity(currentStep.id, isValid, errors)
  }
}, [currentStep, setStepValidity])
```

**Issue**: Every time `currentStep` changes (user navigates between wizard steps), `handleValidationChange` gets a **new function identity**.

**Impact on AbilityScoresStep**:
1. AbilityScoresStep directly calls `onValidationChange` without using a ref pattern
2. When user navigates steps, the callback identity changes
3. The component captures a stale closure and validation updates don't reach the parent
4. Step remains marked as invalid even though ability scores are complete
5. Next button stays disabled, preventing progression

### Current Implementation Issues

#### Issue #1: Missing Ref Pattern for onValidationChange Callback

**Location**: AbilityScoresStep.tsx, lines 72-135 and 138-197

The component directly uses the `onValidationChange` callback in two places:

1. **Line 134** in `handleStateChange`:
```typescript
onValidationChange(errors.length === 0, errors)
```

2. **Line 192** in mount validation useEffect:
```typescript
onValidationChange(errors.length === 0, errors)
```

**Problem**: These direct calls use whatever callback identity was captured when the effect/handler was created. When the parent re-renders and provides a new callback identity, these calls invoke the old (stale) callback, which doesn't update the wizard's validation state.

#### Issue #2: Missing Ref Pattern for onChange Callback (Secondary)

**Location**: AbilityScoresStep.tsx, line 79

```typescript
onChange(updatedData)
```

While this appears to work currently, it's inconsistent with the pattern established in working components and could lead to similar issues.

#### Issue #3: Dependency Array Issues

**Location**: AbilityScoresStep.tsx, line 197

The mount validation useEffect has an empty dependency array `[]`:
```typescript
useEffect(() => {
  // Validation logic...
  onValidationChange(errors.length === 0, errors)
}, [])
```

This means:
- It only runs once on mount
- It captures the initial `onValidationChange` callback
- If the callback changes identity, validation won't re-run with the new callback
- Returning to the step after navigation won't update validation properly

### Comparison with Working Components

#### SkillsProficienciesStep (Working - Fixed in Bug #23)

**Lines 226-233** - Correct ref pattern implementation:
```typescript
// BUG FIX #23: Use ref pattern to handle unstable onValidationChange callback
// This ensures validation always calls the latest callback even when its identity changes
// Prevents Next button from staying disabled when selections are complete
const onValidationChangeRef = useRef(onValidationChange)

useEffect(() => {
  onValidationChangeRef.current = onValidationChange
}, [onValidationChange])
```

**Line 450** - Calls validation via ref:
```typescript
onValidationChangeRef.current(errors.length === 0, errors)
```

**Lines 457-462** - Dependencies exclude onValidationChange:
```typescript
}, [finalSkillProficiencies, savingThrowProficiencies, classData, raceSkillCount,
    proficiencyBonus, selectedClassSkills, selectedRaceSkills])
// BUG FIX #23: Use ref pattern (onValidationChangeRef.current) to call latest callback
```

#### BasicInfoStep (Working - Fixed in Feature 006)

**Lines 30-37** - Correct ref pattern implementation:
```typescript
// BUG FIX #006: Use ref pattern to handle unstable onValidationChange callback
// This ensures validation always calls the latest callback even when its identity changes
// Prevents Next button from staying disabled when selections are complete
const onValidationChangeRef = useRef(onValidationChange)

useEffect(() => {
  onValidationChangeRef.current = onValidationChange
}, [onValidationChange])
```

**Lines 115, 124** - Calls validation via ref:
```typescript
onValidationChangeRef.current(true, [])
// ...
onValidationChangeRef.current(false, errors)
```

#### AbilityScoresStep (Broken - Needs Fix)

**Missing**: No ref pattern implementation at all
- Directly uses `onValidationChange` callback
- Callbacks become stale when parent callback identity changes
- Validation updates don't reach parent wizard
- Next button stays disabled

---

## Data Flow Analysis

### How the Save Should Work:

1. **User enters ability scores** → AbilityScoreGenerator updates internal state
2. **AbilityScoreGenerator calls onStateChange** → Propagates to AbilityScoresStep
3. **AbilityScoresStep.handleStateChange** → Receives state update
4. **Call onChange(updatedData)** → Updates parent wizard character data ✅ (works)
5. **Call onValidationChange(isValid, errors)** → Updates parent wizard validation state ❌ (broken)
6. **CharacterWizard updates stepValidity** → Next button enables/disables

### Where the Save Actually Breaks:

**Step 5 is the problem**:

```typescript
// Line 134 in handleStateChange
onValidationChange(errors.length === 0, errors)  // ❌ Uses stale callback
```

**What happens**:
1. User completes ability scores
2. `onChange(updatedData)` successfully saves data to wizard state
3. `onValidationChange(true, [])` calls a stale callback (old identity)
4. The stale callback doesn't update `setStepValidity` in the current wizard context
5. Wizard still thinks step is invalid
6. Next button remains disabled
7. User can't navigate forward despite data being saved

**When user navigates back and returns**:
1. Mount useEffect runs (line 138-197)
2. Calls `onValidationChange` again (line 192)
3. Still using stale callback
4. Problem repeats

### Why This Appears as "Data Not Saved":

From the user's perspective:
- They enter ability scores
- Click Next
- Nothing happens (button stays disabled)
- They think data wasn't saved

In reality:
- Data **is** saved via `onChange`
- Validation state **is not** updated via stale `onValidationChange`
- Next button stays disabled due to invalid validation state
- Wizard has data but won't allow progression

---

## Historical Context: Evolution of This Bug

### Bug #14 (Earlier Features)
- **Problem**: Race conditions when callbacks were recreated
- **Solution**: Removed callbacks from dependency arrays
- **Side Effect**: Also removed data dependencies, causing validation to not respond to changes

### Bug #22 (SkillsProficienciesStep - Partial Fix)
- **Date**: 2025-11-20, Commit 076e18c
- **Problem**: Validation saw stale values because data dependencies weren't in arrays
- **Solution**: Added data dependencies back to dependency array
- **Result**: Partial fix - validation re-runs, but callback identity issues remained

### Bug #23 (SkillsProficienciesStep - Complete Fix)
- **Date**: 2025-11-27, Commit a3d3873
- **Problem**: `onValidationChange` callback has unstable identity from parent
- **Root Cause**: CharacterWizard's `handleValidationChange` uses `[currentStep, setStepValidity]` dependencies
- **Solution**: Ref pattern - store callback in ref, update it on every render, call via ref
- **Result**: Complete fix - validation always calls the latest callback

### Feature 006 (BasicInfoStep Fix)
- **Date**: 2025-12-07, Commit 0a40d83
- **Problem**: Same as Bug #23 but in BasicInfoStep component
- **Solution**: Applied same ref pattern to BasicInfoStep
- **Result**: Both BasicInfo and Skills steps now work correctly

### Feature 007 (AbilityScoresStep - Current Issue)
- **Date**: 2025-12-07 (in progress)
- **Problem**: Same as Bug #23 and Feature 006 but in AbilityScoresStep
- **Identified**: Same unstable callback identity causing stale closures
- **Solution**: Apply same ref pattern to AbilityScoresStep

---

## Recommended Solution

### Decision: Use Ref Pattern

**Chosen Solution**: Implement the same ref pattern that successfully fixed SkillsProficienciesStep and BasicInfoStep.

**Rationale**:
- Proven solution (worked for 2 previous components)
- Minimal code changes required
- Consistent with established codebase patterns
- Addresses root cause directly
- No changes needed to parent CharacterWizard component

**Alternatives Considered**:

1. **Stabilize Parent Callback** (Rejected)
   - ❌ Would require changing CharacterWizard.tsx
   - ❌ `currentStep` is legitimately needed in callback
   - ❌ Can't remove `currentStep` from dependencies without breaking functionality
   - ❌ Doesn't solve problem for other wizard steps
   - ❌ Would be inconsistent with existing fixes

2. **useMemo for Validation** (Rejected)
   - ❌ Doesn't solve callback identity problem
   - ❌ Validation needs to run on state changes, not be memoized
   - ❌ Would still need callback stabilization

3. **Remove Callback from Dependencies** (Rejected)
   - ❌ Creates stale closures (this is Bug #14 all over again)
   - ❌ Validation won't update when callback legitimately changes
   - ❌ Not a true fix, just hides the problem

**Why Ref Pattern is Correct**:
- React-recommended pattern for dealing with unstable callback props
- Decouples child from parent callback identity
- Always calls latest callback version
- No dependency array issues
- No unnecessary re-renders
- Simple to understand and maintain

---

## Implementation Plan

### Changes Required

**File**: `frontend/src/components/wizard/steps/AbilityScoresStep.tsx`

#### 1. Add useRef Import (Line 1)
```typescript
import React, { useState, useEffect, useRef } from 'react'
```

#### 2. Create Ref and Update Effect (After line 48, before state declarations)
```typescript
// BUG FIX #007: Use ref pattern to handle unstable onValidationChange callback
// This ensures validation always calls the latest callback even when its identity changes
// Prevents Next button from staying disabled when ability scores are complete
const onValidationChangeRef = useRef(onValidationChange)

useEffect(() => {
  onValidationChangeRef.current = onValidationChange
}, [onValidationChange])
```

#### 3. Update handleStateChange (Line 134)
Replace:
```typescript
onValidationChange(errors.length === 0, errors)
```

With:
```typescript
onValidationChangeRef.current(errors.length === 0, errors)
```

#### 4. Update Mount Validation useEffect (Line 192)
Replace:
```typescript
onValidationChange(errors.length === 0, errors)
```

With:
```typescript
onValidationChangeRef.current(errors.length === 0, errors)
```

#### 5. Add Explanatory Comment (Line 197 dependency array - if keeping empty array)
```typescript
}, [])
// BUG FIX #007: Empty dependency array is safe because we use ref pattern
// onValidationChangeRef.current always calls the latest callback
```

### Optional: Apply Ref Pattern to onChange (Consistency)

For consistency with the overall pattern and future-proofing:

```typescript
const onChangeRef = useRef(onChange)

useEffect(() => {
  onChangeRef.current = onChange
}, [onChange])
```

Then update line 79:
```typescript
onChangeRef.current(updatedData)
```

---

## Testing Strategy

### Manual Testing (Required)

**Test Case 1: Basic Save and Navigation**
```
1. Navigate to Ability Scores step
2. Enter values for all six ability scores (Str: 14, Dex: 16, Con: 15, Int: 10, Wis: 12, Cha: 8)
3. Click Next
4. EXPECTED: Next button enables, wizard advances to Skills step
5. Click Back
6. EXPECTED: All ability score values are still present and correct
7. ACTUAL: [Record result]
```

**Test Case 2: Point Buy Method Preservation**
```
1. Navigate to Ability Scores step
2. Select Point Buy method
3. Allocate 27 points across abilities
4. Click Next to Skills step
5. Click Back to Ability Scores
6. EXPECTED: Point Buy method still selected, allocations preserved
7. ACTUAL: [Record result]
```

**Test Case 3: Standard Array Method Preservation**
```
1. Navigate to Ability Scores step
2. Select Standard Array method
3. Assign array values to abilities
4. Click Next to Skills step
5. Click Back to Ability Scores
6. EXPECTED: Standard Array method still selected, assignments preserved
7. ACTUAL: [Record result]
```

**Test Case 4: Page Refresh Persistence**
```
1. Navigate to Ability Scores step
2. Enter ability scores
3. Refresh page (F5)
4. EXPECTED: Ability scores restored from localStorage
5. EXPECTED: Next button enables if all scores are set
6. ACTUAL: [Record result]
```

**Test Case 5: Multi-Step Navigation**
```
1. Complete Ability Scores step
2. Navigate forward to Skills step
3. Navigate forward to Equipment step
4. Navigate back twice to Ability Scores
5. EXPECTED: All ability score values preserved
6. ACTUAL: [Record result]
```

**Test Case 6: Racial Modifiers Applied**
```
1. Create a Dwarf character (Basic Info: +2 Constitution)
2. Navigate to Ability Scores
3. Enter base Constitution: 14
4. Click Next
5. Click Back
6. EXPECTED: Base score (14) and modified score (16) both displayed
7. ACTUAL: [Record result]
```

### Automated Testing (Future Enhancement)

**Unit Tests** (`AbilityScoresStep.test.tsx`):
```typescript
describe('AbilityScoresStep validation with unstable callbacks', () => {
  it('should call onValidationChange when all ability scores are set', () => {
    const onValidationChange = jest.fn()
    const { rerender } = render(
      <AbilityScoresStep onValidationChange={onValidationChange} data={{}} onChange={jest.fn()} />
    )

    // Set all six ability scores
    // ... (simulate user input)

    expect(onValidationChange).toHaveBeenCalledWith(true, [])
  })

  it('should handle callback identity changes without breaking validation', () => {
    const callback1 = jest.fn()
    const callback2 = jest.fn()

    const { rerender } = render(
      <AbilityScoresStep onValidationChange={callback1} data={{}} onChange={jest.fn()} />
    )

    // Change callback identity (simulates parent re-render)
    rerender(<AbilityScoresStep onValidationChange={callback2} data={{}} onChange={jest.fn()} />)

    // Set ability scores - should call callback2, not stale callback1
    // ... (simulate user input)

    expect(callback2).toHaveBeenCalled()
    expect(callback1).not.toHaveBeenCalled()
  })
})
```

---

## Success Criteria Validation

After implementing the fix, verify against spec success criteria:

- ✅ **SC-001**: Users can navigate forward from Ability Scores step and return to find all entered values preserved 100% of the time
- ✅ **SC-002**: Ability scores persist correctly across browser refresh/reload with zero data loss
- ✅ **SC-003**: Character creation abandonment rate at the Ability Scores step decreases by at least 40%
- ✅ **SC-004**: All ability score generation methods preserve data correctly in 100% of test cases
- ✅ **SC-005**: Ability scores update and save within 100ms of user input
- ✅ **SC-006**: Racial ability score modifiers are correctly applied and persisted in 100% of test cases

---

## Related Work

- **Feature 004**: BasicInfo bugs investigation (identified callback pattern issues)
- **Bug #22**: SkillsProficienciesStep partial fix (added dependencies back)
- **Bug #23**: SkillsProficienciesStep complete fix (ref pattern implementation)
- **Feature 006**: BasicInfoStep ref pattern fix (applied same solution)
- **Feature 007**: AbilityScoresStep fix (current feature - same solution)

**Pattern Established**: All wizard step components with validation callbacks should use the ref pattern to handle unstable callback identity from the parent CharacterWizard component.

---

**Last Updated**: 2025-12-07
**Status**: Root cause identified, solution designed
**Blockers**: None (clear path to implementation)
