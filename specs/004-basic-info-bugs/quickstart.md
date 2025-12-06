# Quickstart Guide: Basic Information Bug Fixes

**Feature**: 004-basic-info-bugs
**Date**: 2025-12-04
**For**: Developers implementing the 7 bug fixes

## Overview

This guide helps you quickly implement and test the Basic Information bug fixes. Follow the priority order: Critical → UX → Enhancement.

---

## Prerequisites

**Before starting:**
```bash
# 1. Ensure you're on the correct branch
git checkout 004-basic-info-bugs

# 2. Install dependencies (if needed)
cd frontend && npm install

# 3. Start development server
npm run dev

# 4. In another terminal, run tests in watch mode
npm run test -- --watch
```

**Required reading:**
- [spec.md](./spec.md) - Full bug descriptions
- [research.md](./research.md) - Technical decisions
- [data-model.md](./data-model.md) - State structures
- [contracts/](./contracts/) - Component contracts

---

## Phase 1: Critical Fixes (2-3 hours)

### Bug #2: Character Preview "?" Symbols (HIGH PRIORITY)

**File**: `frontend/src/components/character-creation/CharacterPreview.tsx`

**Quick Fix Steps:**

1. **Locate the display logic** (likely around line 50-100):
   ```typescript
   // Find code that looks like:
   {race ? race.name : '?'}
   {class ? class.name : '?'}
   ```

2. **Replace with placeholder pattern**:
   ```typescript
   // Replace with:
   {race?.name || <span className="text-muted-foreground italic">Not selected yet</span>}
   {class?.name || <span className="text-muted-foreground italic">Not selected yet</span>}
   ```

3. **Add ARIA labels**:
   ```typescript
   {race?.name || (
     <span
       className="text-muted-foreground italic"
       aria-label="Race not yet selected"
     >
       Not selected yet
     </span>
   )}
   ```

4. **Write unit test**:
   ```bash
   # Create test file if it doesn't exist
   touch frontend/tests/components/CharacterPreview.test.tsx
   ```

   ```typescript
   import { render, screen } from '@testing-library/react'
   import { CharacterPreview } from '@/components/character-creation/CharacterPreview'

   test('displays placeholder when race is undefined', () => {
     const concept = {
       name: "Test Character",
       race: undefined,
       class: undefined,
       level: 1
     }

     render(<CharacterPreview characterConcept={concept} baseAbilityScores={{...}} />)

     // Verify no "?" symbols
     expect(screen.queryByText('?')).not.toBeInTheDocument()

     // Verify placeholder text
     expect(screen.getAllByText(/not selected yet/i)).toHaveLength(2)
   })
   ```

5. **Manual test**:
   ```bash
   # Navigate to: http://localhost:5173/characters/new
   # 1. Enter character name only
   # 2. Check preview sidebar
   # 3. Verify it shows "Not selected yet" not "?"
   # 4. Select race
   # 5. Verify race appears, class still shows "Not selected yet"
   ```

**Estimated time**: 1-2 hours (including tests)

---

### Bug #1: Class Skills "3 of 0" (Depends on Bug #003)

**Note**: This fix depends on the API fix from Bug #003. Check if that's complete first.

**File**: `frontend/src/components/character-creation/ClassSelector.tsx`

**Quick Check**:
```bash
# Test if API returns correct data:
curl https://dnd-character-manager-api-dev.cybermattlee-llc.workers.dev/api/classes | jq '.[] | select(.name == "Bard") | .skill_proficiencies'

# Should return:
# {
#   "choose": 3,
#   "from": ["Acrobatics", "Animal Handling", ..., "Survival"]  # 18 skills
# }
```

**If API is fixed:**
1. No frontend changes needed - display logic already correct
2. Verify fix by viewing Bard class card
3. Should show "Skills: 3 of 18"

**If API NOT fixed:**
- Wait for Bug #003 to be implemented
- OR implement API fix in parallel (see Bug #003 spec)

**Estimated time**: 0-4 hours (depends on API work)

---

## Phase 2: UX Improvements (4-5 hours)

### Bug #3: Sub-Step Navigation

**File**: `frontend/src/components/wizard/steps/BasicInfoStep.tsx`

**Quick Fix Steps:**

1. **Find sub-step indicator rendering** (around line 246-264):
   ```typescript
   // Current code (passive div):
   <div className={`w-8 h-8 ...`}>
     {index + 1}
   </div>
   ```

2. **Replace with clickable button**:
   ```typescript
   const handleSubStepClick = (step: SubStep) => {
     if (isCompleted || step === currentStep) {
       setCurrentStep(step)
     }
   }

   // In JSX:
   <button
     onClick={() => handleSubStepClick(step)}
     disabled={!isCompleted && step !== currentStep}
     aria-current={isActive ? 'step' : undefined}
     aria-disabled={!isCompleted && step !== currentStep}
     aria-label={`Step ${index + 1}: ${stepLabel}${isActive ? ' (current)' : isCompleted ? ' (completed)' : ''}`}
     className={`
       w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
       ${isActive ? 'bg-primary text-primary-foreground' :
         isCompleted ? 'bg-primary/20 text-primary hover:bg-primary/30 cursor-pointer' :
         'bg-muted text-muted-foreground cursor-not-allowed'}
       transition-colors
     `}
   >
     {index + 1}
   </button>
   ```

3. **Track completed steps**:
   ```typescript
   const [completedSteps, setCompletedSteps] = useState<Set<SubStep>>(new Set())

   useEffect(() => {
     // Mark current step as completed when moving forward
     if (data.name && !completedSteps.has('name')) {
       setCompletedSteps(prev => new Set(prev).add('name'))
     }
     if (data.race && !completedSteps.has('race')) {
       setCompletedSteps(prev => new Set(prev).add('race'))
     }
     // ... etc for each step
   }, [data])
   ```

4. **Write tests**:
   ```typescript
   test('can navigate backward to completed steps', async () => {
     const { getByLabelText } = render(<BasicInfoStep {...props} />)

     // Complete name step
     await userEvent.type(screen.getByPlaceholderText(/enter your character's name/i), 'Gandalf')
     await userEvent.click(screen.getByText(/continue to race/i))

     // Complete race step
     await userEvent.click(screen.getByText('Elf'))
     await userEvent.click(screen.getByText(/continue to class/i))

     // Now on class step - click step 1 indicator
     const step1 = getByLabelText(/step 1.*name/i)
     await userEvent.click(step1)

     // Verify returned to name step
     expect(screen.getByPlaceholderText(/enter your character's name/i)).toHaveValue('Gandalf')
   })
   ```

**Estimated time**: 2-3 hours

---

### Bug #6: Auto-Advance Prevention

**File**: `frontend/src/components/wizard/steps/BasicInfoStep.tsx`

**Quick Fix Steps:**

1. **Locate and DELETE the problematic useEffect** (lines 68-91):
   ```typescript
   // ❌ DELETE THIS ENTIRE useEffect:
   useEffect(() => {
     if (!data.name?.trim()) {
       setCurrentStep('name')
     } else if (data.name?.trim() && !data.race?.trim() && currentStep === 'name') {
       return
     } else if (!data.race?.trim()) {
       setCurrentStep('race')  // ← This causes auto-advance
     }
     // ... delete all of this
   }, [data, currentStep, shouldShowFeatSelection])
   ```

2. **Verify Continue buttons still work**:
   ```typescript
   // These should already exist - keep them:
   <Button onClick={() => setCurrentStep('race')}>
     Continue to Race Selection
   </Button>
   ```

3. **Test manually**:
   ```bash
   # 1. Navigate to /characters/new
   # 2. Click into name field
   # 3. Type slowly: "G", "a", "n", "d", "a", "l", "f"
   # 4. Verify: UI stays on name step while typing
   # 5. Verify: Continue button appears when name is valid
   # 6. Click Continue button
   # 7. Verify: NOW advances to race step
   ```

4. **Write test**:
   ```typescript
   test('does not auto-advance while typing in name field', async () => {
     render(<BasicInfoStep {...props} />)

     const nameInput = screen.getByPlaceholderText(/enter your character's name/i)

     // Type character by character
     await userEvent.type(nameInput, 'Gandalf')

     // Verify still on name step (Continue button visible)
     expect(screen.getByText(/continue to race/i)).toBeInTheDocument()

     // Verify NOT on race step
     expect(screen.queryByText(/choose.*race/i)).not.toBeInTheDocument()
   })
   ```

**Estimated time**: 1 hour

---

## Phase 3: Enhancements (2-3 hours)

### Bug #7: Validation Timing

**File**: `frontend/src/components/wizard/steps/BasicInfoStep.tsx`

**Quick Fix Steps:**

1. **Add state tracking**:
   ```typescript
   const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())
   const [hasAttemptedNext, setHasAttemptedNext] = useState(false)
   ```

2. **Modify validation useEffect** (lines 93-117):
   ```typescript
   useEffect(() => {
     const isComplete = Boolean(
       data.name?.trim() &&
       data.race?.trim() &&
       data.class?.trim() &&
       data.background?.trim() &&
       data.alignment
     )

     if (isComplete) {
       onValidationChangeRef.current(true, [])
     } else {
       const errors: string[] = []
       if (!data.name?.trim()) errors.push('Character name is required')
       if (!data.race?.trim()) errors.push('Race is required')
       if (!data.class?.trim()) errors.push('Class is required')
       if (!data.background?.trim()) errors.push('Background is required')
       if (!data.alignment) errors.push('Alignment is required')

       // Always call validation (enables/disables Next button)
       onValidationChangeRef.current(false, errors)

       // But UI only shows errors if user has interacted
       // (This is handled by parent CharacterWizard - we just provide the data)
     }
   }, [data.name, data.race, data.class, data.background, data.alignment])
   ```

3. **No UI changes needed** - parent wizard controls error display

4. **Test**:
   ```typescript
   test('validation runs but errors not shown on mount', () => {
     const onValidationChange = jest.fn()
     render(<BasicInfoStep {...props} onValidationChange={onValidationChange} />)

     // Validation called with errors
     expect(onValidationChange).toHaveBeenCalledWith(false, expect.arrayContaining([
       expect.stringContaining('name'),
       expect.stringContaining('race')
     ]))

     // But no error messages visible in UI
     expect(screen.queryByText(/is required/i)).not.toBeInTheDocument()
   })
   ```

**Estimated time**: 2-3 hours

---

### Bugs #4, #5: Optional Enhancements

**These are low priority** - implement only if time allows:

- **Bug #4**: Add alternative to Continue buttons (optional)
- **Bug #5**: Add help text for level selection (optional)

**Estimated time**: 1-2 hours each (if implemented)

---

## Testing Strategy

### Unit Tests

**Run tests:**
```bash
npm run test

# Or watch mode:
npm run test -- --watch

# Or specific file:
npm run test CharacterPreview.test.tsx
```

**Required test coverage:**
- CharacterPreview with undefined race/class
- Sub-step navigation (forward and backward)
- Data preservation during navigation
- Auto-advance prevention
- Validation timing

### Integration Tests

**Create E2E test:**
```bash
# File: frontend/tests/e2e/character-wizard.spec.ts
```

```typescript
import { test, expect } from '@playwright/test'

test('complete basic information wizard flow', async ({ page }) => {
  await page.goto('/characters/new')

  // Step 1: Enter name
  await page.fill('input[placeholder*="name"]', 'Gandalf')
  await expect(page.getByText(/continue to race/i)).toBeVisible()
  await page.click('text=Continue to Race')

  // Step 2: Select race
  await page.click('text=Human')
  await page.click('text=Continue to Class')

  // Step 3: Navigate backward
  await page.click('[aria-label*="Step 1"]')
  await expect(page.getByPlaceholderText(/name/i)).toHaveValue('Gandalf')

  // Verify data preserved
  await page.click('text=Continue to Race')
  await expect(page.getByText('Human')).toHaveClass(/selected|active/)
})
```

### Manual Testing Checklist

```markdown
## Bug #2: Character Preview
- [ ] Load /characters/new
- [ ] Verify preview shows "Not selected yet" for race and class
- [ ] Enter character name
- [ ] Verify preview updates with name
- [ ] Select race
- [ ] Verify preview shows race name, class still "Not selected yet"
- [ ] Select class
- [ ] Verify preview shows both race and class names
- [ ] NEVER see "?" symbols at any point

## Bug #3: Sub-Step Navigation
- [ ] Complete name, race, class selections
- [ ] Click sub-step indicator "1" (name)
- [ ] Verify navigation to name step
- [ ] Verify name input still has value
- [ ] Click sub-step indicator "2" (race)
- [ ] Verify navigation to race step
- [ ] Verify race still selected
- [ ] Try clicking incomplete step indicator
- [ ] Verify no navigation occurs
- [ ] Verify indicator is visually disabled

## Bug #6: Auto-Advance
- [ ] Load /characters/new
- [ ] Click into name field
- [ ] Type slowly: "G" ... "a" ... "n" ... "d" ... "a" ... "l" ... "f"
- [ ] Verify UI stays on name step entire time
- [ ] Verify Continue button appears when name valid
- [ ] Click Continue
- [ ] Verify NOW advances to race step

## Bug #7: Validation
- [ ] Load /characters/new
- [ ] Verify no validation error messages visible
- [ ] Verify Next button is disabled
- [ ] Enter character name only
- [ ] Verify still no error messages
- [ ] Click Next button (while still invalid)
- [ ] Verify error messages now appear
- [ ] Complete all required fields
- [ ] Verify error messages disappear
- [ ] Verify Next button enabled
```

---

## Deployment

### Local Build
```bash
cd frontend
npm run build

# Verify build succeeds
ls -lh dist/
```

### Deploy to Cloudflare Pages
```bash
# 1. Commit changes
git add .
git commit -m "fix: Resolve Basic Information bugs #1-#7"

# 2. Push to GitHub
git push origin 004-basic-info-bugs

# 3. Automatic deployment via Cloudflare Pages
# Monitor: https://dash.cloudflare.com/

# 4. Test on production URL
# https://dnd.cyberlees.dev/characters/new
```

### Post-Deployment Verification
```bash
# Use playwright to test production:
npx playwright test --headed --project=chromium
```

---

## Troubleshooting

### Issue: "?" still appears in preview

**Check:**
1. Did you update CharacterPreview component?
2. Did you rebuild the app?
3. Did you clear browser cache?
4. Is the correct code deployed?

**Debug:**
```typescript
// Add console.log to CharacterPreview:
console.log('CharacterPreview props:', { race, class })

// Check browser console - should see undefined for missing data
```

### Issue: Sub-step navigation doesn't work

**Check:**
1. Are indicators `<button>` elements (not `<div>`)?
2. Is `onClick` handler attached?
3. Is `setCurrentStep` being called?
4. Check browser console for errors

**Debug:**
```typescript
const handleSubStepClick = (step: SubStep) => {
  console.log('Clicked step:', step, 'Current:', currentStep, 'Completed:', completedSteps)
  if (completedSteps.has(step) || step === currentStep) {
    setCurrentStep(step)
  }
}
```

### Issue: Still auto-advancing while typing

**Check:**
1. Did you DELETE the entire useEffect (lines 68-91)?
2. Did you save the file?
3. Did the dev server reload?

**Verify:**
```bash
# Search for auto-advance logic:
grep -n "setCurrentStep" frontend/src/components/wizard/steps/BasicInfoStep.tsx

# Should only appear in button onClick handlers, NOT in useEffect
```

---

## Performance Tips

**Optimize re-renders:**
```typescript
// Wrap expensive calculations in useMemo:
const availableSteps = useMemo(() => getAvailableSteps(data), [data])

// Wrap callbacks in useCallback:
const handleSubStepClick = useCallback((step: SubStep) => {
  setCurrentStep(step)
}, [])
```

**Prevent validation loops:**
```typescript
// Use ref pattern for callback stability (from Bug #23 fix):
const onValidationChangeRef = useRef(onValidationChange)

useEffect(() => {
  onValidationChangeRef.current = onValidationChange
}, [onValidationChange])

// Then use ref in validation:
onValidationChangeRef.current(isValid, errors)
```

---

## Quick Reference

**Key Files:**
- `frontend/src/components/character-creation/CharacterPreview.tsx` (Bug #2)
- `frontend/src/components/wizard/steps/BasicInfoStep.tsx` (Bugs #3, #6, #7)
- `frontend/src/components/character-creation/ClassSelector.tsx` (Bug #1 - API dependent)

**Key Patterns:**
- Placeholder: `{value || <span className="text-muted-foreground italic">Not selected yet</span>}`
- Navigation: `<button onClick={() => setCurrentStep(step)}>`
- No auto-advance: DELETE useEffect, keep onClick handlers only

**Testing Commands:**
```bash
npm run test                          # Run all tests
npm run test -- --watch               # Watch mode
npx playwright test                   # E2E tests
npm run build                         # Build for production
```

---

## Summary Checklist

**Phase 1 (Critical):**
- [ ] Bug #2: CharacterPreview placeholders implemented
- [ ] Bug #2: Unit tests passing
- [ ] Bug #1: API fix coordinated (or wait)

**Phase 2 (UX):**
- [ ] Bug #3: Sub-step navigation working
- [ ] Bug #3: Data preservation verified
- [ ] Bug #6: Auto-advance removed
- [ ] Bug #6: Typing doesn't cause navigation

**Phase 3 (Enhancement):**
- [ ] Bug #7: Validation timing fixed
- [ ] Bugs #4, #5: Optional enhancements (if time)

**Testing:**
- [ ] All unit tests passing
- [ ] E2E tests passing
- [ ] Manual testing checklist complete
- [ ] No regressions in existing functionality

**Deployment:**
- [ ] Code committed to branch
- [ ] Pushed to GitHub
- [ ] Cloudflare Pages deployment successful
- [ ] Production smoke testing complete

**Estimated Total Time**: 10-15 hours (serial), 6-8 hours (parallel)
