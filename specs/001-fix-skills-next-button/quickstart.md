# Quickstart: Fix Skills & Proficiencies Next Button

**Date**: 2025-11-26
**Branch**: `001-fix-skills-next-button`
**Status**: Implementation Guide

---

## Quick Reference

**Problem**: Next button doesn't enable when skill selections are complete
**Root Cause**: Unstable `onValidationChange` callback not triggering wizard state updates
**Solution**: Use ref pattern to decouple validation from callback identity
**Files to Modify**: `frontend/src/components/wizard/steps/SkillsProficienciesStep.tsx`
**Estimated Time**: 30 minutes
**Risk Level**: LOW (proven React pattern, minimal code changes)

---

## Implementation Steps

### Step 1: Add useRef Import (Line 1)

**Current:**
```typescript
import React, { useState, useEffect, useMemo } from 'react'
```

**Updated:**
```typescript
import React, { useState, useEffect, useMemo, useRef } from 'react'
```

---

### Step 2: Create Ref for Callback (After Line 169)

**Location**: Inside `SkillsProficienciesStep` function, after state declarations

**Add these lines after `const [previousRace, setPreviousRace] = useState<string>(characterData.race)` (line 224):**

```typescript
// BUG FIX #23: Use ref pattern to handle unstable onValidationChange callback
// This ensures validation always calls the latest callback even when its identity changes
// Prevents Next button from staying disabled when selections are complete
const onValidationChangeRef = useRef(onValidationChange)

useEffect(() => {
  onValidationChangeRef.current = onValidationChange
}, [onValidationChange])
```

**Explanation**:
- `onValidationChangeRef` stores a reference to the latest callback
- The useEffect updates the ref whenever the callback prop changes
- This decouples validation logic from callback identity

---

### Step 3: Update Validation useEffect (Line 415)

**Current (line 415):**
```typescript
onValidationChange(errors.length === 0, errors)
```

**Updated:**
```typescript
onValidationChangeRef.current(errors.length === 0, errors)
```

**Location**: Inside the validation useEffect (around line 360-420)

**Full context of the change:**
```typescript
useEffect(() => {
  // ... existing onChange logic ...

  // BUG FIX #22: More lenient validation that works even when API data hasn't loaded
  const errors: string[] = []

  // ... existing validation logic ...

  onValidationChangeRef.current(errors.length === 0, errors)  // ⬅️ CHANGED THIS LINE
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [finalSkillProficiencies, savingThrowProficiencies, classData, raceSkillCount, proficiencyBonus, selectedClassSkills, selectedRaceSkills])
```

---

### Step 4: Update Comment (Line 416-420)

**Current comments (lines 416-420):**
```typescript
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [finalSkillProficiencies, savingThrowProficiencies, classData, raceSkillCount, proficiencyBonus, selectedClassSkills, selectedRaceSkills])
// BUG FIX #22: Added selectedClassSkills and selectedRaceSkills back to dependencies to fix validation
// Validation needs to re-run when skill selections change, otherwise Next button doesn't enable
// Note: onChange and onValidationChange still excluded to prevent race conditions from Bug #14
```

**Updated:**
```typescript
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [finalSkillProficiencies, savingThrowProficiencies, classData, raceSkillCount, proficiencyBonus, selectedClassSkills, selectedRaceSkills])
// BUG FIX #23: Use ref pattern (onValidationChangeRef.current) to call latest callback
// This fixes Bug #22 properly - Next button now enables when selections complete
// The ref pattern allows validation to work with unstable callbacks from CharacterWizard
// Dependencies include selectedClassSkills/selectedRaceSkills to trigger on selection changes
// onChange and onValidationChange excluded via ref pattern to prevent race conditions (Bug #14)
```

---

## Complete Code Change Summary

**File**: `frontend/src/components/wizard/steps/SkillsProficienciesStep.tsx`

```diff
-import React, { useState, useEffect, useMemo } from 'react'
+import React, { useState, useEffect, useMemo, useRef } from 'react'

 export function SkillsProficienciesStep({ data, onChange, onValidationChange }: WizardStepProps) {
   const { characterData } = useCharacterCreation()
   const [classData, setClassData] = useState<{ skillChoices: number; availableSkills: SkillName[]; savingThrows: AbilityName[] } | null>(null)
   const [isLoadingClassData, setIsLoadingClassData] = useState(false)

   // ... existing state declarations ...

   const [previousClass, setPreviousClass] = useState<string>(characterData.class)
   const [previousRace, setPreviousRace] = useState<string>(characterData.race)
+
+  // BUG FIX #23: Use ref pattern to handle unstable onValidationChange callback
+  // This ensures validation always calls the latest callback even when its identity changes
+  // Prevents Next button from staying disabled when selections are complete
+  const onValidationChangeRef = useRef(onValidationChange)
+
+  useEffect(() => {
+    onValidationChangeRef.current = onValidationChange
+  }, [onValidationChange])

   // ... rest of component ...

   useEffect(() => {
     // ... validation logic ...

-    onValidationChange(errors.length === 0, errors)
+    onValidationChangeRef.current(errors.length === 0, errors)
     // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [finalSkillProficiencies, savingThrowProficiencies, classData, raceSkillCount, proficiencyBonus, selectedClassSkills, selectedRaceSkills])
-  // BUG FIX #22: Added selectedClassSkills and selectedRaceSkills back to dependencies to fix validation
-  // Validation needs to re-run when skill selections change, otherwise Next button doesn't enable
-  // Note: onChange and onValidationChange still excluded to prevent race conditions from Bug #14
+  // BUG FIX #23: Use ref pattern (onValidationChangeRef.current) to call latest callback
+  // This fixes Bug #22 properly - Next button now enables when selections complete
+  // The ref pattern allows validation to work with unstable callbacks from CharacterWizard
+  // Dependencies include selectedClassSkills/selectedRaceSkills to trigger on selection changes
+  // onChange and onValidationChange excluded via ref pattern to prevent race conditions (Bug #14)
```

**Total Changes**: 3 additions, 3 modifications (< 10 lines of code)

---

## Testing Checklist

### Manual Testing (Required)

Navigate to https://dnd.cyberlees.dev and test:

1. **Basic Flow** (User Story 1 - Priority P1)
   - [ ] Create new character through basic info step
   - [ ] Navigate to Skills & Proficiencies step
   - [ ] Select required class skills (e.g., 4 for Rogue)
   - [ ] Verify Next button enables immediately
   - [ ] Click Next and verify navigation to next step

2. **Race Skills** (User Story 1 - Priority P1)
   - [ ] Create Half-Elf character (2 race skills)
   - [ ] Navigate to Skills step
   - [ ] Select 2 class skills (or required amount)
   - [ ] Verify Next button still disabled
   - [ ] Select 2 race skills
   - [ ] Verify Next button enables

3. **localStorage Restoration** (User Story 2 - Priority P2)
   - [ ] Start character creation, select all required skills
   - [ ] Refresh the page
   - [ ] Verify skills are restored
   - [ ] Verify Next button is already enabled

4. **Rapid Toggling** (Edge Case)
   - [ ] Click skills rapidly on/off
   - [ ] Verify Next button state updates correctly
   - [ ] Verify no infinite loops or freezing

### Regression Testing (Required)

Verify previous bugs remain fixed:

5. **Bug #14** (Race Conditions)
   - [ ] Toggle skills rapidly
   - [ ] Verify no infinite render loops
   - [ ] Check browser console for errors

6. **Bug #16** (Initialization)
   - [ ] Return to saved character with skills already selected
   - [ ] Verify no errors in console
   - [ ] Verify skills display correctly

7. **Bug #21** (Fallback Data)
   - [ ] Throttle network in DevTools
   - [ ] Create character with various classes
   - [ ] Verify all 12 classes work with fallback data

8. **Bug #22** (Dependencies)
   - [ ] Select skills one by one
   - [ ] Verify button enables after final selection
   - [ ] Verify button disables when de-selecting

### Unit Testing (Recommended)

Create `frontend/tests/components/wizard/SkillsProficienciesStep.test.tsx`:

```typescript
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SkillsProficienciesStep } from '../../../src/components/wizard/steps/SkillsProficienciesStep'

describe('SkillsProficienciesStep - Bug #23 Fix', () => {
  it('should call onValidationChange when skill selection completes', async () => {
    const mockOnValidationChange = jest.fn()
    const mockOnChange = jest.fn()

    const props = {
      data: { /* ... */ },
      onChange: mockOnChange,
      onValidationChange: mockOnValidationChange
    }

    render(<SkillsProficienciesStep {...props} />)

    // Select required skills
    const skillButtons = screen.getAllByRole('button', { name: /skill/i })
    await userEvent.click(skillButtons[0])
    await userEvent.click(skillButtons[1])

    // Wait for validation
    await waitFor(() => {
      expect(mockOnValidationChange).toHaveBeenCalledWith(true, [])
    })
  })

  it('should use latest callback even when identity changes', async () => {
    const mockOnValidationChange1 = jest.fn()
    const mockOnValidationChange2 = jest.fn()

    const { rerender } = render(
      <SkillsProficienciesStep
        data={{ /* ... */ }}
        onChange={jest.fn()}
        onValidationChange={mockOnValidationChange1}
      />
    )

    // Change callback identity
    rerender(
      <SkillsProficienciesStep
        data={{ /* ... */ }}
        onChange={jest.fn()}
        onValidationChange={mockOnValidationChange2}
      />
    )

    // Select skills
    const skillButton = screen.getByRole('button', { name: /athletics/i })
    await userEvent.click(skillButton)

    // Should call NEW callback (mockOnValidationChange2)
    await waitFor(() => {
      expect(mockOnValidationChange2).toHaveBeenCalled()
    })
  })
})
```

---

## Deployment

### Build and Deploy

```bash
# From frontend directory
cd frontend

# Build production bundle
npm run build:production

# Deploy to Cloudflare Pages
git add .
git commit -m "fix: Skills step Next button using ref pattern (Bug #23)

Implements ref pattern to decouple validation from callback identity.
Ensures onValidationChange always calls latest callback from parent.
Fixes regression where Next button doesn't enable when selections complete.

Fixes: Bug #23
Related: Bug #22, Bug #14

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push
```

### Verification

1. Wait for Cloudflare Pages deployment to complete
2. Test on production URL: https://dnd.cyberlees.dev
3. Complete all manual testing checklist items
4. Monitor for user reports or errors

---

## Rollback Plan

If the fix causes issues:

1. **Immediate Rollback**:
   ```bash
   git revert HEAD
   git push
   ```

2. **Verify Rollback**:
   - Wait for Cloudflare deployment
   - Test basic wizard flow
   - Confirm issue is contained

3. **Debug**:
   - Review error logs
   - Check browser console errors
   - Verify ref pattern implementation

---

## Success Criteria

**The fix is successful when:**

✅ Next button enables within 100ms of completing skill selections
✅ Works for both new selections and localStorage restoration
✅ No infinite loops or race conditions
✅ All previous bug fixes remain working (Bugs #14, #16, #21, #22)
✅ Character creation completion rate improves by 20%+
✅ Zero new bug reports related to skills step

---

## Common Issues and Solutions

### Issue: Next button still doesn't enable

**Diagnosis**:
- Check browser console for errors
- Verify `onValidationChangeRef.current` is being called
- Add temporary `console.log` before and after ref call

**Solution**:
```typescript
// Temporary debugging
console.log('[Validation] About to call ref:', {
  isValid: errors.length === 0,
  errors,
  refCurrent: onValidationChangeRef.current
})

onValidationChangeRef.current(errors.length === 0, errors)

console.log('[Validation] Ref called successfully')
```

### Issue: Infinite loop / Maximum update depth exceeded

**Diagnosis**:
- `onValidationChange` probably got added back to useEffect dependencies

**Solution**:
- Verify useEffect dependency array DOES NOT include `onValidationChange`
- Verify eslint-disable comment is present
- Only ref update useEffect should have `onValidationChange` in deps

### Issue: Button enables too early (with incomplete selections)

**Diagnosis**:
- Validation logic may have a bug
- Check if `selectedClassSkills.size` is being calculated correctly

**Solution**:
- Add console.log to validation logic to inspect values
- Verify `classData.skillChoices` matches expected number
- Check if race skills are being counted correctly

---

## Time Estimate

- **Code changes**: 5 minutes
- **Manual testing**: 15 minutes
- **Deployment**: 5 minutes
- **Production verification**: 5 minutes

**Total**: ~30 minutes

---

## Next Steps After Implementation

1. Update MEMORY.md with Bug #23 fix details
2. Close Bug #22 as resolved (it was incomplete fix)
3. Monitor character creation analytics for improvement
4. Consider adding automated E2E tests with Playwright

---

## References

- [React useRef Documentation](https://react.dev/reference/react/useRef)
- [Bug #22 Fix Attempt](../../commits/076e18c)
- [Feature Specification](./spec.md)
- [Research Findings](./research.md)
- [Validation Contract](./contracts/validation.contract.md)