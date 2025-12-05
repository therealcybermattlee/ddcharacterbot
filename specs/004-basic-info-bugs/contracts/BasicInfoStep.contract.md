# Component Contract: BasicInfoStep

**Feature**: 004-basic-info-bugs (Bugs #3, #6, #7 Fixes)
**Component**: `frontend/src/components/wizard/steps/BasicInfoStep.tsx`
**Date**: 2025-12-04

## Contract Overview

BasicInfoStep manages the multi-sub-step Basic Information wizard with sub-step navigation, validation timing, and explicit user-driven progression. This contract defines behavior fixes for Bugs #3 (navigation), #6 (auto-advance), and #7 (validation timing).

---

## Input Contract

### Props Interface

```typescript
interface WizardStepProps {
  data: CharacterCreationData
  onChange: (data: CharacterCreationData) => void
  onValidationChange: (isValid: boolean, errors: string[]) => void
  onNext?: () => void
}
```

### Input Constraints

**MUST Accept:**
- ✅ `data` with any combination of filled/unfilled fields
- ✅ `onChange` callback with unstable identity (parent may recreate)
- ✅ `onValidationChange` callback with unstable identity
- ✅ `onNext` may be undefined

**MUST NOT:**
- ❌ Mutate `data` prop directly
- ❌ Assume callbacks have stable identity
- ❌ Call `onChange` synchronously in render

---

## Output Contract

### Sub-Step Navigation (Bug #3 Fix)

**MUST provide:**

1. **Clickable sub-step indicators** for completed steps
   ```typescript
   // Sub-step circles MUST be buttons:
   <button
     onClick={() => handleSubStepClick('name')}
     disabled={!isStepCompleted('name') && currentStep !== 'name'}
     aria-current={currentStep === 'name' ? 'step' : undefined}
     aria-disabled={!canNavigateTo('name')}
   >
     1
   </button>
   ```

2. **Backward navigation** preserves data
   ```typescript
   // When user clicks completed step indicator:
   handleSubStepClick(targetStep: SubStep) {
     if (canNavigateTo(targetStep)) {
       setCurrentStep(targetStep)  // Navigate
       // data.race, data.class, etc. remain unchanged
     }
   }
   ```

3. **Visual feedback** for step states
   - **Current step**: Primary color, aria-current="step"
   - **Completed step**: Muted primary, clickable
   - **Incomplete step**: Gray, aria-disabled="true", NOT removed from tab order

**MUST NOT:**
- ❌ Remove incomplete steps from DOM (keep in tab order for accessibility)
- ❌ Use native `disabled` attribute (use `aria-disabled` instead)
- ❌ Clear data when navigating backward

---

### Auto-Advance Removal (Bug #6 Fix)

**MUST provide:**

1. **Explicit Continue buttons** for all sub-steps
   ```typescript
   // Each sub-step shows Continue button when data is valid:
   {data.name && (
     <Button onClick={() => setCurrentStep('race')}>
       Continue to Race Selection
     </Button>
   )}
   ```

2. **No automatic step changes** during typing
   ```typescript
   // ❌ FORBIDDEN: useEffect that auto-advances
   useEffect(() => {
     if (data.name && !data.race) {
       setCurrentStep('race')  // NO! Causes jarring UX
     }
   }, [data])

   // ✅ REQUIRED: Only explicit onClick
   const handleContinue = () => {
     setCurrentStep('race')
   }
   ```

**MUST NOT:**
- ❌ Change `currentStep` in useEffect based on data changes
- ❌ Use debouncing or delays for auto-advance (still auto-advances)
- ❌ Automatically progress when validation passes

---

### Validation Timing (Bug #7 Fix)

**MUST provide:**

1. **Silent validation** on mount
   ```typescript
   // Run validation, but don't show errors yet:
   useEffect(() => {
     const isValid = validateAllFields(data)
     const errors = getValidationErrors(data)

     // Always call validation (updates Next button state)
     onValidationChangeRef.current(isValid, errors)

     // But UI only shows errors if user has interacted
   }, [data])
   ```

2. **Error display** only after interaction
   ```typescript
   // Show errors when:
   const shouldShowErrors = hasAttemptedNext || touchedFields.size > 0
   ```

3. **Touched field tracking**
   ```typescript
   // Mark fields as touched:
   const handleFieldBlur = (field: string) => {
     setTouchedFields(prev => new Set(prev).add(field))
   }

   const handleAttemptNext = () => {
     setHasAttemptedNext(true)
     // Validation errors now visible
   }
   ```

**MUST NOT:**
- ❌ Show error messages on initial mount (pristine form)
- ❌ Show errors before user interaction
- ❌ Prevent validation from running (always validate, just control display)

---

## Behavior Contract

### Sub-Step Progression

**State Machine:**
```
name → race → class → [subclass?] → background → [feat?] → alignment → complete
```

**Dynamic Steps:**
- Subclass step: Only if `level >= getSubclassLevel(class)`
- Feat step: Only if `backgroundData?.featChoices.length > 0`

**Navigation Rules:**
```typescript
interface NavigationRules {
  // Can navigate to step if:
  canNavigateTo(step: SubStep): boolean {
    return (
      step === currentStep ||           // Current step
      completedSteps.has(step) ||       // Completed step
      isPreviousStepComplete(step)      // Next step (if previous done)
    )
  }

  // Step is completed if:
  isStepComplete(step: SubStep): boolean {
    // Based on required data for that step
  }
}
```

### Data Preservation

**When navigating backward:**
```typescript
// User on class selection (step 3)
data = { name: "Gandalf", race: "Elf", class: "Wizard" }

// User clicks sub-step 1 (name)
handleSubStepClick('name')

// Data MUST remain:
data = { name: "Gandalf", race: "Elf", class: "Wizard" }  // Unchanged

// UI shows name input with value "Gandalf"
// User can edit or click Continue to return to race
```

**When navigating forward:**
```typescript
// Same rules - data always preserved
```

---

## Accessibility Contract

### ARIA for Sub-Step Navigation

**MUST implement:**

1. **Current step indicator**
   ```html
   <button aria-current="step" aria-label="Step 1: Name (current)">1</button>
   ```

2. **Completed step indicator**
   ```html
   <button aria-label="Step 2: Race (completed, click to revisit)">2</button>
   ```

3. **Incomplete step indicator**
   ```html
   <button
     aria-disabled="true"
     aria-label="Step 3: Class (not yet available)"
     tabindex="0"
   >
     3
   </button>
   ```

4. **Keyboard navigation**
   - Tab/Shift+Tab: Move through step indicators
   - Enter/Space: Activate (navigate to) completed steps
   - Arrow keys: Optional enhancement for step navigation

### Screen Reader Announcements

**When step changes:**
```typescript
// Update document.title or use aria-live region:
<div aria-live="polite" aria-atomic="true" className="sr-only">
  Now on step {stepNumber} of {totalSteps}: {stepName}
</div>
```

---

## Performance Contract

**Rendering:**
- Sub-step navigation < 100ms (per spec.md SC-007)
- No jank when typing in fields
- Smooth transitions between sub-steps

**Memory:**
- Clean up validation timeouts on unmount
- No memory leaks from ref pattern

---

## Error Handling Contract

### Validation Errors

**Must handle:**
```typescript
// Missing required fields
errors: [
  'Character name is required',
  'Race is required',
  'Class is required',
  'Background is required',
  'Alignment is required'
]

// Invalid data
errors: [
  'Character name must be at least 2 characters',
  'Level must be between 1 and 20'
]
```

**Error display timing:**
```typescript
// Before interaction: errors exist but hidden
// After Next attempt: errors visible
// After fixing: errors removed from list
```

### API Failures

**When D&D 5e API fails:**
```typescript
// Component shows error state:
<Card className="border-destructive">
  <p>Unable to Load Character Data</p>
  <Button onClick={() => window.location.reload()}>Retry</Button>
</Card>

// Does NOT crash wizard
// Does NOT show "?" symbols
```

---

## Testing Contract

### Unit Tests Required

**Sub-Step Navigation (Bug #3):**
```typescript
test('sub-step indicators are clickable for completed steps', () => {
  // Complete name and race
  // Click step 1 indicator
  // Verify navigation to name step
  // Verify data preserved
})

test('sub-step indicators are disabled for incomplete steps', () => {
  // On name step
  // Try to click step 3 (class) indicator
  // Verify no navigation occurs
  // Verify aria-disabled="true"
})

test('backward navigation preserves all data', () => {
  // Fill all fields
  // Navigate backward to step 1
  // Verify all data still present
})
```

**Auto-Advance Prevention (Bug #6):**
```typescript
test('typing in name field does not auto-advance', () => {
  // Type in name field
  // Verify still on name step
  // Verify no automatic navigation to race
})

test('Continue button advances to next step', () => {
  // Enter name
  // Click Continue button
  // Verify navigation to race step
})
```

**Validation Timing (Bug #7):**
```typescript
test('no validation errors shown on initial mount', () => {
  // Mount component
  // Verify no error messages displayed
  // Verify Next button disabled
})

test('validation errors appear after Next attempt', () => {
  // Mount component
  // Click Next button
  // Verify error messages displayed
})

test('validation errors removed when data valid', () => {
  // Show errors
  // Fill all required fields
  // Verify no error messages
  // Verify Next button enabled
})
```

---

## Integration Contract

### With CharacterWizard (Parent)

**Data flow:**
```typescript
CharacterWizard
  ↓ passes props
BasicInfoStep
  ↓ calls onChange
CharacterWizard updates context
  ↓ re-renders
BasicInfoStep receives new data
```

**Validation flow:**
```typescript
BasicInfoStep validates
  ↓ calls onValidationChange(isValid, errors)
CharacterWizard updates step validation state
  ↓ enables/disables Next button
User clicks Next (if enabled)
  ↓ CharacterWizard calls onNext
BasicInfoStep advances (if provided)
```

### With CharacterCreationContext

**Context usage:**
- Component does NOT directly read/write context
- All state changes through `onChange` callback
- Context updates handled by parent CharacterWizard

---

## Change Log

**Version 1.0 (2025-12-04)**
- Initial contract for Bugs #3, #6, #7 fixes
- Defines sub-step navigation behavior
- Specifies validation timing rules
- Documents auto-advance removal

---

## Contract Validation

**Before merging, verify:**
- [ ] Sub-step indicators are buttons with aria-disabled
- [ ] Backward navigation preserves all data
- [ ] No auto-advance during typing
- [ ] Validation runs but errors hidden until interaction
- [ ] All keyboard navigation works
- [ ] Screen readers announce step changes

**Acceptance Criteria (from spec.md):**
- [ ] SC-003: Backward navigation works without data loss
- [ ] SC-004: Name typing doesn't auto-advance
- [ ] SC-005: Validation only after interaction
- [ ] SC-008: Navigation preserves 100% of data
