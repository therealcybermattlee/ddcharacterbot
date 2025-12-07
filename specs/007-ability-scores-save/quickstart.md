# Quickstart: Ability Scores Not Persisting on Navigation

**Feature**: 007-ability-scores-save
**Date**: 2025-12-07
**Estimated Time**: 30 minutes

---

## Overview

This quickstart guide provides step-by-step instructions to fix the ability scores save bug by implementing the ref pattern for unstable callbacks in the AbilityScoresStep component.

**What You'll Do**:
1. Add useRef import to AbilityScoresStep.tsx
2. Create refs for onValidationChange and onChange callbacks
3. Update callback invocations to use refs
4. Add explanatory comments
5. Test the fix manually

**Root Cause**: The `onValidationChange` callback from CharacterWizard has unstable identity (changes on every navigation). AbilityScoresStep captures stale closures, preventing validation state from updating properly.

**Solution**: Ref pattern - store callbacks in refs, update refs on every render, call via refs to always get latest version.

---

## Prerequisites

- ✅ Feature specification complete (`spec.md`)
- ✅ Research complete (`research.md`)
- ✅ Root cause identified (unstable callback identity)
- ✅ Solution validated (ref pattern used successfully in SkillsProficienciesStep and BasicInfoStep)

---

## Implementation Steps

### Step 1: Add useRef to Imports

**File**: `frontend/src/components/wizard/steps/AbilityScoresStep.tsx`

**Current Code** (Line 1):
```typescript
import React, { useEffect } from 'react'
```

**Updated Code**:
```typescript
import React, { useEffect, useRef } from 'react'
```

**Why**: We need `useRef` hook to store callback references.

---

### Step 2: Create Callback Refs

**Location**: After the component function declaration, before any state/logic (after line 48)

**Current Code** (Lines 47-49):
```typescript
export function AbilityScoresStep({ data, onChange, onValidationChange }: WizardStepProps) {
  const { characterData } = useCharacterCreation()

```

**Add After Line 49**:
```typescript
  // BUG FIX #007: Use ref pattern to handle unstable onValidationChange callback
  // This ensures validation always calls the latest callback even when its identity changes
  // Prevents Next button from staying disabled when ability scores are complete
  const onValidationChangeRef = useRef(onValidationChange)

  useEffect(() => {
    onValidationChangeRef.current = onValidationChange
  }, [onValidationChange])

  // Also apply ref pattern to onChange for consistency and future-proofing
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

```

**Why**:
- `onValidationChangeRef` stores the latest `onValidationChange` callback
- `onChangeRef` stores the latest `onChange` callback (for consistency)
- Effects update refs whenever props change
- This decouples the component from parent callback identity changes

---

### Step 3: Update onChange Call in handleStateChange

**Location**: Line 79 in handleStateChange function

**Current Code**:
```typescript
    onChange(updatedData)
```

**Updated Code**:
```typescript
    onChangeRef.current(updatedData)
```

**Why**: Calls the latest `onChange` callback via ref, preventing stale closures.

---

### Step 4: Update onValidationChange Call in handleStateChange

**Location**: Line 134 in handleStateChange function

**Current Code**:
```typescript
    onValidationChange(errors.length === 0, errors)
```

**Updated Code**:
```typescript
    onValidationChangeRef.current(errors.length === 0, errors)
```

**Why**: This is the PRIMARY FIX - calls the latest `onValidationChange` callback via ref, ensuring validation state updates reach the parent wizard even when callback identity changes.

---

### Step 5: Update onValidationChange Call in Mount Effect (Saved Data Path)

**Location**: Line 192 in the mount validation useEffect (inside the `if (data?.abilityScoreState)` block)

**Current Code**:
```typescript
      onValidationChange(errors.length === 0, errors)
```

**Updated Code**:
```typescript
      onValidationChangeRef.current(errors.length === 0, errors)
```

**Why**: Ensures validation calls use the latest callback when returning to the step with saved data.

---

### Step 6: Update onValidationChange Call in Mount Effect (No Data Path)

**Location**: Line 195 in the mount validation useEffect (inside the `else` block)

**Current Code**:
```typescript
      onValidationChange(false, ['Please generate ability scores'])
```

**Updated Code**:
```typescript
      onValidationChangeRef.current(false, ['Please generate ability scores'])
```

**Why**: Ensures initial validation uses the latest callback on first mount.

---

### Step 7: Add Dependency Array Comment

**Location**: Line 197, after the dependency array of the mount validation useEffect

**Current Code**:
```typescript
  }, [])
```

**Updated Code**:
```typescript
  }, [])
  // BUG FIX #007: Empty dependency array is safe because we use ref pattern
  // onValidationChangeRef.current always calls the latest callback
```

**Why**: Documents why the empty dependency array is safe (we're using refs, not direct callback calls).

---

## Complete Diff Summary

Here's what you're changing:

**Line 1**: Add `useRef` to imports
```diff
-import React, { useEffect } from 'react'
+import React, { useEffect, useRef } from 'react'
```

**After Line 49**: Add ref setup
```diff
 export function AbilityScoresStep({ data, onChange, onValidationChange }: WizardStepProps) {
   const { characterData } = useCharacterCreation()

+  // BUG FIX #007: Use ref pattern to handle unstable onValidationChange callback
+  // This ensures validation always calls the latest callback even when its identity changes
+  // Prevents Next button from staying disabled when ability scores are complete
+  const onValidationChangeRef = useRef(onValidationChange)
+
+  useEffect(() => {
+    onValidationChangeRef.current = onValidationChange
+  }, [onValidationChange])
+
+  // Also apply ref pattern to onChange for consistency and future-proofing
+  const onChangeRef = useRef(onChange)
+
+  useEffect(() => {
+    onChangeRef.current = onChange
+  }, [onChange])
+
```

**Line 79**: Update onChange call
```diff
-    onChange(updatedData)
+    onChangeRef.current(updatedData)
```

**Line 134**: Update onValidationChange call (PRIMARY FIX)
```diff
-    onValidationChange(errors.length === 0, errors)
+    onValidationChangeRef.current(errors.length === 0, errors)
```

**Line 192**: Update onValidationChange call in mount effect (saved data)
```diff
-      onValidationChange(errors.length === 0, errors)
+      onValidationChangeRef.current(errors.length === 0, errors)
```

**Line 195**: Update onValidationChange call in mount effect (no data)
```diff
-      onValidationChange(false, ['Please generate ability scores'])
+      onValidationChangeRef.current(false, ['Please generate ability scores'])
```

**Line 197**: Add dependency array comment
```diff
-  }, [])
+  }, [])
+  // BUG FIX #007: Empty dependency array is safe because we use ref pattern
+  // onValidationChangeRef.current always calls the latest callback
```

---

## Verification Steps

### Step 1: Build Check

After making changes, verify TypeScript compilation:

```bash
cd /Users/therealtwobowshow/CodeStuff/ddcharacterbot/frontend
npm run build
```

**Expected**: No TypeScript errors, clean build.

---

### Step 2: Manual Testing - Basic Save and Navigation

**Test Case**: Ability scores persist when navigating forward and back

**Steps**:
1. Navigate to production site: https://dnd.cyberlees.dev
2. Start character creation wizard
3. Complete Basic Info step (select race and class)
4. Navigate to Ability Scores step
5. Select Standard Array method
6. Assign values: Str=15, Dex=14, Con=13, Int=12, Wis=10, Cha=8
7. Click **Next** button
8. **VERIFY**: Next button enables and wizard advances to Skills step
9. Click **Back** button to return to Ability Scores
10. **VERIFY**: All ability score values are still present and correct
11. **VERIFY**: Standard Array method is still selected

**Expected Result**: ✅ All values preserved, method selection maintained

**Failure Indicates**: Issue with onChange or state persistence (not related to this fix)

---

### Step 3: Manual Testing - Next Button Validation

**Test Case**: Next button enables/disables correctly based on validation

**Steps**:
1. Navigate to Ability Scores step with no saved data
2. **VERIFY**: Next button is disabled
3. Select Point Buy method
4. Allocate 20 points (incomplete)
5. **VERIFY**: Next button is still disabled
6. Allocate remaining 7 points (27 total)
7. **VERIFY**: Next button enables immediately
8. Navigate to Skills step and back
9. **VERIFY**: Next button is still enabled (validation state persisted)

**Expected Result**: ✅ Next button responds correctly to validation state changes

**Failure Indicates**: Ref pattern not working correctly (this is what we're fixing)

---

### Step 4: Manual Testing - Point Buy Method Preservation

**Test Case**: Point buy allocations persist across navigation

**Steps**:
1. Navigate to Ability Scores step
2. Select Point Buy method
3. Allocate 27 points:
   - Strength: 15 (9 points)
   - Dexterity: 14 (7 points)
   - Constitution: 13 (5 points)
   - Intelligence: 12 (4 points)
   - Wisdom: 10 (2 points)
   - Charisma: 8 (0 points)
4. **VERIFY**: Points used shows "27/27"
5. Click Next to advance to Skills
6. Click Back to return to Ability Scores
7. **VERIFY**: Point Buy method still selected
8. **VERIFY**: All point allocations preserved
9. **VERIFY**: Points used still shows "27/27"

**Expected Result**: ✅ Method and allocations fully preserved

---

### Step 5: Manual Testing - Racial Modifiers

**Test Case**: Racial bonuses applied and persisted correctly

**Steps**:
1. Create a Dwarf character (Basic Info: Race = Dwarf, +2 Constitution)
2. Navigate to Ability Scores step
3. Select Standard Array method
4. Assign Constitution = 13 (base value)
5. **VERIFY**: Display shows "Constitution: 15 (13 + 2)" or similar
6. Complete other ability scores
7. Click Next to Skills step
8. Click Back to Ability Scores
9. **VERIFY**: Constitution still shows 15 (13 base + 2 racial)
10. **VERIFY**: Racial modifier is visually indicated

**Expected Result**: ✅ Base scores and racial modifiers both preserved

---

### Step 6: Manual Testing - Multi-Step Navigation

**Test Case**: Data survives navigation through multiple steps

**Steps**:
1. Complete Ability Scores step with any method
2. Click Next to advance to Skills step
3. Click Next to advance to Equipment step (if available)
4. Click Back twice to return to Ability Scores
5. **VERIFY**: All ability score values preserved
6. **VERIFY**: Generation method selection preserved

**Expected Result**: ✅ Data survives multi-step forward and back navigation

---

### Step 7: Browser Console Check

**Test Case**: No errors or warnings in console

**Steps**:
1. Open browser DevTools (F12)
2. Navigate through character wizard
3. Complete Ability Scores step
4. Navigate forward and back
5. Check Console tab

**Expected Result**: ✅ No React warnings, no errors related to AbilityScoresStep

**Common Issues to Look For**:
- ❌ "Cannot update a component while rendering a different component"
- ❌ "Warning: Cannot update during an existing state transition"
- ❌ Infinite re-render loops

---

## Troubleshooting

### Issue: Next Button Still Disabled After Completing Ability Scores

**Symptoms**: All ability scores are set, validation should pass, but Next button stays disabled.

**Debugging Steps**:
1. Add console.log to verify ref pattern is working:
```typescript
// In handleStateChange, before the onValidationChangeRef.current call:
console.log('Calling onValidationChange via ref:', errors.length === 0, errors)
onValidationChangeRef.current(errors.length === 0, errors)
```

2. Check that ref is updating correctly:
```typescript
// In the ref update effect:
useEffect(() => {
  console.log('Updating onValidationChangeRef')
  onValidationChangeRef.current = onValidationChange
}, [onValidationChange])
```

3. Verify callback is being called:
```typescript
// In CharacterWizard.tsx handleValidationChange:
console.log('handleValidationChange called:', currentStep?.id, isValid, errors)
```

**Expected Console Output** (when completing ability scores):
```
Updating onValidationChangeRef
Calling onValidationChange via ref: true []
handleValidationChange called: ability-scores true []
```

**Solution**: If logs show ref is updating but validation isn't reaching parent, check that CharacterWizard's `handleValidationChange` is correctly updating `stepValidity` state.

---

### Issue: Data Not Persisting Across Navigation

**Symptoms**: Ability scores save but don't restore when returning to the step.

**This Is NOT Related to This Fix**: This fix addresses validation state, not data persistence. If data isn't persisting:

1. Check that `onChange` is being called (should now be `onChangeRef.current`)
2. Verify CharacterCreationContext is receiving updates
3. Check localStorage in DevTools → Application → Local Storage
4. Verify `data` prop is being passed correctly to AbilityScoresStep

---

### Issue: TypeScript Errors After Changes

**Common Errors**:

**Error**: `Property 'current' does not exist on type '...'`
**Solution**: Verify `useRef` is imported from 'react'

**Error**: `Type 'MutableRefObject<...>' is not assignable to type '...'`
**Solution**: Check that ref initialization uses the callback as initial value:
```typescript
const onValidationChangeRef = useRef(onValidationChange)  // ✅ Correct
const onValidationChangeRef = useRef<typeof onValidationChange>(null)  // ❌ Wrong
```

---

## Deployment

After testing locally and verifying the fix works:

### Deploy to Production

```bash
# From project root
cd /Users/therealtwobowshow/CodeStuff/ddcharacterbot

# Build frontend
cd frontend
npm run build

# Deploy to Cloudflare Pages
# (Cloudflare Pages will auto-deploy on git push if configured)
git add .
git commit -m "fix: Apply ref pattern to AbilityScoresStep to fix validation state (Bug #007)"
git push origin 007-ability-scores-save
```

### Create Pull Request

1. Go to GitHub repository
2. Create PR from `007-ability-scores-save` to `main`
3. Title: "fix: Ability scores validation state not updating (Feature 007)"
4. Description:
```markdown
Fixes ability scores save bug where Next button stays disabled even when all ability scores are complete.

**Root Cause**: onValidationChange callback had unstable identity from parent CharacterWizard, causing stale closures in AbilityScoresStep.

**Solution**: Applied ref pattern (same as Bug #23 and Feature 006) to always call the latest callback.

**Changes**:
- Added useRef to imports
- Created onValidationChangeRef and onChangeRef with update effects
- Updated all callback invocations to use refs
- Added explanatory comments

**Testing**: Manual testing confirms Next button now enables correctly when ability scores are complete, and validation state persists across navigation.

Closes #007
```

5. Request review or merge if authorized

---

## Success Criteria Validation

After deployment, verify the fix meets all success criteria from the spec:

- ✅ **SC-001**: Users can navigate forward from Ability Scores step and return to find all entered values preserved 100% of the time
- ✅ **SC-002**: Ability scores persist correctly across browser refresh/reload with zero data loss
- ✅ **SC-003**: Character creation abandonment rate at the Ability Scores step decreases by at least 40%
- ✅ **SC-004**: All ability score generation methods preserve data correctly in 100% of test cases
- ✅ **SC-005**: Ability scores update and save within 100ms of user input
- ✅ **SC-006**: Racial ability score modifiers are correctly applied and persisted in 100% of test cases

---

## Related Documentation

- **Spec**: `specs/007-ability-scores-save/spec.md` - Feature requirements
- **Research**: `specs/007-ability-scores-save/research.md` - Root cause analysis
- **Data Model**: `specs/007-ability-scores-save/data-model.md` - Entity definitions
- **Contract**: `specs/007-ability-scores-save/contracts/AbilityScoresStep.contract.md` - Component contract
- **Similar Fixes**:
  - Bug #23 (SkillsProficienciesStep): Commit a3d3873
  - Feature 006 (BasicInfoStep): Commit 0a40d83

---

**Last Updated**: 2025-12-07
**Estimated Implementation Time**: 30 minutes
**Estimated Testing Time**: 20 minutes
**Status**: Ready for implementation
