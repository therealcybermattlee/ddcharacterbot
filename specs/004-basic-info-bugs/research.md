# Technical Research: Basic Information Bug Fixes

**Feature**: 004-basic-info-bugs
**Date**: 2025-12-04
**Researchers**: Claude (Sonnet 4.5)
**Status**: Complete

---

## Executive Summary

This document provides comprehensive research and technical decisions for fixing 7 bugs in the Basic Information step of the character creation wizard. Research covers React hook best practices, ARIA accessibility requirements, UX patterns for placeholder text, validation timing strategies, and implementation dependencies.

### Key Decisions Overview

1. **Sub-Step Navigation**: Use `<button>` elements with `aria-disabled` for incomplete steps
2. **Placeholder Text**: Use descriptive text like "Not selected yet" instead of "?" symbols
3. **Validation Timing**: Track touched/dirty state, show errors only after user interaction
4. **Auto-Advance Prevention**: Remove auto-advance logic, require explicit Continue button clicks
5. **Implementation Order**: Bug #2 (CharacterPreview) can proceed independently of Bug #1/#003

---

## 1. React Hook Best Practices for Sub-Step Navigation

### Research Question
What's the best pattern for making sub-step indicators clickable in a wizard without breaking progressive disclosure?

### Decision: Use `<button>` with `aria-disabled` for Incomplete Steps

**Rationale**:
- Native `<button>` elements provide built-in keyboard navigation (Enter and Spacebar)
- Using `aria-disabled` instead of `disabled` keeps elements in tab order for screen reader discovery
- Anchor tags (`<a>`) are semantically incorrect (they navigate to URLs, not trigger actions)
- `<div role="button">` requires manual keyboard event handlers and is less accessible

### Technical Implementation

```typescript
// Current problematic code (BasicInfoStep.tsx:246-264)
<div className={`w-8 h-8 rounded-full...`}>
  {index + 1}
</div>

// Recommended implementation
<button
  type="button"
  onClick={() => {
    if (isCompleted) {
      setCurrentStep(step as typeof currentStep)
    }
  }}
  disabled={!isCompleted && !isActive}
  aria-disabled={!isCompleted && !isActive}
  aria-current={isActive ? 'step' : undefined}
  className={cn(
    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
    isActive && "bg-primary text-primary-foreground",
    isCompleted && !isActive && "bg-primary/20 text-primary cursor-pointer hover:bg-primary/30",
    !isCompleted && !isActive && "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
  )}
>
  <span className="sr-only">
    {isActive ? 'Current step: ' : isCompleted ? 'Go to step: ' : 'Not yet available: '}
    {step}
  </span>
  {index + 1}
</button>
```

### ARIA Requirements (W3C WAI-ARIA Authoring Practices)

**Key ARIA Attributes**:
- `aria-current="step"`: Indicates the current step in a multi-step process
- `aria-disabled="true"`: Announces disabled state to screen readers while keeping element focusable
- Screen reader-only text (`sr-only`): Provides context for each step indicator

**Keyboard Navigation**:
- Tab: Move between focusable step indicators
- Enter or Spacebar: Activate clickable (completed) steps
- Arrow keys: Optional enhancement for sequential navigation

**Note**: W3C removed the dedicated wizard pattern from the ARIA Authoring Practices Guide (APG). Current guidance suggests using either the **Tabs pattern** or **Navigation landmark** approach. Our implementation follows the Navigation landmark pattern with `role="navigation"` implicit in our step indicator container.

### Source References
- [W3C ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [MDN: ARIA button role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/button_role)
- [W3C Discussion: Should APG include wizard pattern?](https://github.com/w3c/aria-practices/issues/92)
- [MDN: aria-disabled attribute](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-disabled)

### Alternatives Considered and Rejected

| Approach | Pros | Cons | Verdict |
|----------|------|------|---------|
| `<a>` anchor tags | Semantic for navigation | Only Enter key (no Spacebar), requires `href` or `role="button"` | ❌ Rejected |
| `<div role="button">` | Flexible styling | Requires manual keyboard handlers, less accessible | ❌ Rejected |
| Native `disabled` attribute | Fully prevents interaction | Removes from tab order, screen readers skip it | ❌ Rejected |
| `aria-disabled` only | Keeps in tab order | Requires manual onClick prevention | ✅ **Selected** |

---

## 2. Character Preview Placeholder Patterns

### Research Question
What's the UX best practice for showing "not yet selected" states in a preview component?

### Decision: Use Descriptive Text "Not selected yet" with Muted Styling

**Rationale**:
- WCAG 2.1 requires meaningful labels and instructions (SC 3.3.2)
- Question marks ("?") are cryptic and make the interface appear broken
- Em-dashes ("—") lack semantic meaning for screen readers
- "Pending" implies an action in progress, which is misleading
- Descriptive text like "Not selected yet" clearly communicates state

### Technical Implementation

```typescript
// Current problematic code (CharacterPreview.tsx:183)
Level {level} {race?.name || '?'} {characterClass?.name || '?'}

// Recommended implementation (compact mode)
Level {level} {race?.name || <span className="text-muted-foreground italic">Race not selected</span>} {characterClass?.name || <span className="text-muted-foreground italic">Class not selected</span>}

// Alternative: More concise format
{name || 'Unnamed Character'}, Level {level} {race?.name || '(no race)'} {characterClass?.name || '(no class)'}

// Best practice: Separate fields for clarity
<div className="text-sm text-muted-foreground">
  <div>Race: {race?.name || <span className="italic">Not selected yet</span>}</div>
  <div>Class: {characterClass?.name || <span className="italic">Not selected yet</span>}</div>
</div>
```

### Accessibility Guidelines (WCAG 2.1)

**Relevant Success Criteria**:
- **SC 3.3.2 (Labels or Instructions)**: Labels or instructions are provided when content requires user input
- **SC 1.4.3 (Contrast Minimum)**: Text must have contrast ratio of at least 4.5:1
- **SC 2.4.6 (Headings and Labels)**: Headings and labels describe topic or purpose

**Color Contrast Requirements**:
- Placeholder text should use muted colors (e.g., Tailwind's `text-muted-foreground`)
- Ensure contrast ratio meets 4.5:1 minimum for text
- Never rely on color alone to convey meaning (use italic or other styling)

### UX Best Practices from Industry

**LinkedIn Profile Completion**:
- Uses "Add [field]" buttons for incomplete sections
- Shows percentage completion
- Never uses "?" or "—" symbols

**Stripe Onboarding**:
- Uses "Not provided" or "Add details" for missing information
- Clearly distinguishes between optional and required fields
- Provides contextual help text

**Google Forms**:
- Shows "(Optional)" or "(Required)" labels
- Uses placeholder text inside fields, not as labels
- Never uses cryptic symbols

### Localization Considerations

**Text to Avoid**:
- Symbols like "?", "—", "N/A" (hard to translate, ambiguous)
- Abbreviations without context
- Culture-specific idioms

**Recommended Patterns**:
- "Not selected yet" → Easily translatable to all languages
- "Choose a race" → Action-oriented, clear intent
- "[Field name]: (empty)" → Programmatic, screen reader friendly

### Source References
- [W3C: Form Instructions](https://www.w3.org/WAI/tutorials/forms/instructions/)
- [DigitalA11Y: Accessible Forms - Placeholder Problems](https://www.digitala11y.com/anatomy-of-accessible-forms-placeholder-is-a-mirage/)
- [Deque: The Problem with Placeholders](https://www.deque.com/blog/accessible-forms-the-problem-with-placeholders/)
- [W3C: Placeholder Research (Low Vision Task Force)](https://www.w3.org/WAI/GL/low-vision-a11y-tf/wiki/Placeholder_Research)

### Alternatives Considered and Rejected

| Approach | Example | Pros | Cons | Verdict |
|----------|---------|------|------|---------|
| Question mark | `Level 1 ? ?` | Compact | Cryptic, appears broken | ❌ Rejected |
| Em-dash | `Level 1 — —` | Minimal | No semantic meaning | ❌ Rejected |
| "Pending" | `Race: Pending` | Indicates waiting | Implies action in progress | ❌ Rejected |
| Empty/blank | `Level 1  ` | Clean design | Confusing, looks like bug | ❌ Rejected |
| Descriptive text | `Race: Not selected yet` | Clear, accessible | Slightly longer | ✅ **Selected** |

---

## 3. Validation Timing Patterns in React

### Research Question
When should validation errors appear in multi-step wizard forms?

### Decision: Track Touched/Dirty State, Show Errors Only After User Interaction

**Rationale**:
- Showing errors on mount (pristine form) discourages users before they start
- WCAG 2.1 SC 3.3.1 requires error identification, but not premature display
- Industry-standard form libraries (React Hook Form, Formik) default to validate on blur/submit
- Better UX to allow users to complete fields before showing errors

### Technical Implementation

```typescript
// Add state tracking for touched fields
const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())
const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false)

// Validation useEffect with dirty state check
useEffect(() => {
  const isComplete = Boolean(
    data.name?.trim() &&
    data.race?.trim() &&
    data.class?.trim() &&
    data.background?.trim() &&
    data.alignment
  )

  if (isComplete) {
    onValidationChange(true, [])
  } else {
    // Only show errors if user has attempted to proceed OR fields have been touched
    const shouldShowErrors = hasAttemptedSubmit || touchedFields.size > 0

    const errors: string[] = []
    if (!data.name?.trim() && (hasAttemptedSubmit || touchedFields.has('name'))) {
      errors.push('Character name is required')
    }
    if (!data.race?.trim() && (hasAttemptedSubmit || touchedFields.has('race'))) {
      errors.push('Race is required')
    }
    if (!data.class?.trim() && (hasAttemptedSubmit || touchedFields.has('class'))) {
      errors.push('Class is required')
    }
    if (!data.background?.trim() && (hasAttemptedSubmit || touchedFields.has('background'))) {
      errors.push('Background is required')
    }
    if (!data.alignment && (hasAttemptedSubmit || touchedFields.has('alignment'))) {
      errors.push('Alignment is required')
    }

    // Always mark as invalid if incomplete (disables Next button)
    // But only pass error messages if we should show them
    onValidationChange(false, shouldShowErrors ? errors : [])
  }
}, [data.name, data.race, data.class, data.background, data.alignment, hasAttemptedSubmit, touchedFields, onValidationChange])

// Mark field as touched on blur or change
const handleInputChange = (field: string, value: string | number) => {
  const newData = { ...data, [field]: value }
  onChange(newData)
  setTouchedFields(prev => new Set(prev).add(field))
}

// Mark all fields as touched on Next button attempt
const handleNext = () => {
  setHasAttemptedSubmit(true)
  if (onNext) {
    onNext()
  }
}
```

### Validation Timing Strategies

**Option 1: On Blur (Recommended)**
- Validate when user leaves a field
- Least intrusive, waits for user to finish typing
- Used by React Hook Form default mode

**Option 2: On Submit**
- Validate only when user attempts to proceed
- Simple to implement
- May surprise user with multiple errors at once

**Option 3: On Change (Not Recommended)**
- Validate as user types
- Can be frustrating (errors appear while typing)
- Only use for real-time feedback (password strength, username availability)

**Option 4: Hybrid (Best for Wizards)**
- Start with disabled Next button (no error messages)
- Show errors after first Next attempt
- Subsequent validation on change
- **This is our selected approach**

### React Hook Form Patterns

React Hook Form provides excellent patterns we can adapt:

```typescript
// Inspired by React Hook Form's mode options
type ValidationMode = 'onBlur' | 'onChange' | 'onSubmit' | 'all'

// FormState properties from React Hook Form
interface FormState {
  isDirty: boolean       // User has modified any field
  isValid: boolean       // All validations pass
  isSubmitted: boolean   // Form has been submitted
  touchedFields: object  // Which fields user has interacted with
  errors: object         // Current validation errors
}
```

### useEffect Dependency Best Practices

**Anti-Pattern** (causes infinite loops):
```typescript
useEffect(() => {
  onValidationChange(isValid, errors) // onValidationChange may change on every render
}, [data, onValidationChange]) // Dependency changes → re-run → changes callback → infinite loop
```

**Solution 1: useRef for Callback Stability** (Already used in Bug #23 fix):
```typescript
const onValidationChangeRef = useRef(onValidationChange)

useEffect(() => {
  onValidationChangeRef.current = onValidationChange
}, [onValidationChange])

useEffect(() => {
  onValidationChangeRef.current(isValid, errors)
}, [data, isValid, errors]) // No callback in deps
```

**Solution 2: useCallback in Parent Component**:
```typescript
// In CharacterWizard.tsx
const handleValidationChange = useCallback((isValid: boolean, errors: string[]) => {
  // Validation logic
}, []) // Empty deps if no external dependencies
```

### Source References
- [React Hook Form: Validation Mode](https://react-hook-form.com/api/useform)
- [Final Form: FormState Documentation](https://final-form.org/docs/final-form/types/FormState)
- [RandomizeBlog: Multi-Step Form Validation in React](https://www.randomizeblog.com/multi-step-form-react/)
- [Modus Create: ReactJS Form Validation Approaches](https://moduscreate.com/blog/reactjs-form-validation-approaches/)

### Alternatives Considered and Rejected

| Approach | When Errors Show | Pros | Cons | Verdict |
|----------|------------------|------|------|---------|
| Immediate (on mount) | Page load | Simple | Discouraging, bad UX | ❌ Rejected |
| On change (typing) | Every keystroke | Real-time feedback | Frustrating, premature | ❌ Rejected |
| On blur only | Leaving field | Non-intrusive | May miss errors until late | ⚠️ Consider |
| On submit only | Clicking Next | Simple | All errors at once | ⚠️ Consider |
| Hybrid (submit then change) | After first attempt | Progressive disclosure | Requires state tracking | ✅ **Selected** |

---

## 4. Auto-Advance Prevention in useEffect

### Research Question
How to prevent useEffect from auto-advancing the wizard step during typing without breaking progressive disclosure?

### Decision: Remove Auto-Advance Logic, Require Explicit Continue Button Clicks

**Rationale**:
- Auto-advance creates jarring UX when step changes unexpectedly
- Current code (lines 71-73) attempts prevention but is fragile
- useEffect runs on every data change, making timing unpredictable
- Explicit Continue buttons provide better user control
- Progressive disclosure can still work via disabled button states

### Technical Implementation

```typescript
// Current problematic code (BasicInfoStep.tsx:68-91)
useEffect(() => {
  if (!data.name?.trim()) {
    setCurrentStep('name')
  } else if (data.name?.trim() && !data.race?.trim() && currentStep === 'name') {
    // Stay on name step until user explicitly continues
    return
  } else if (!data.race?.trim()) {
    setCurrentStep('race')
  }
  // ... more auto-advance logic
}, [data, currentStep, shouldShowFeatSelection])

// Recommended approach: Remove auto-advance entirely
// Step changes ONLY via Continue button clicks

// Name sub-step
{currentStep === 'name' && (
  <Card className="ring-2 ring-primary/50">
    <CardContent className="space-y-6">
      <Input
        value={data.name || ''}
        onChange={(e) => handleInputChange('name', e.target.value)}
      />
      <Button
        onClick={() => setCurrentStep('race')}
        disabled={!data.name?.trim()}
      >
        Continue to Race Selection
      </Button>
    </CardContent>
  </Card>
)}
```

### Debouncing vs Explicit Actions

**Debouncing Approach** (NOT recommended for step navigation):
```typescript
// Delays function execution until user stops typing
const [debouncedName, setDebouncedName] = useState(data.name)

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedName(data.name)
  }, 500)

  return () => clearTimeout(timer)
}, [data.name])

// Problem: Still auto-advances, just delayed
// User experience is unpredictable
```

**Explicit Action Approach** (RECOMMENDED):
```typescript
// No debouncing needed - user controls advancement
const handleContinue = (nextStep: SubStep) => {
  setCurrentStep(nextStep)
  // Optional: Scroll to top, focus management
}

// Clear, predictable UX
<Button onClick={() => handleContinue('race')}>
  Continue
</Button>
```

### When to Use Debouncing

**Good Use Cases**:
- Search input (avoid API call on every keystroke)
- Auto-save (reduce localStorage writes)
- Window resize handlers
- Scroll event listeners

**Bad Use Cases**:
- Navigation/routing changes
- Form step advancement
- Critical user actions
- Anything that changes UI layout unexpectedly

### Progressive Disclosure Pattern

**Key Principle**: Reveal complexity gradually as user progresses

**Implementation Without Auto-Advance**:
1. Show only current step's content (hide others)
2. Disable Continue button until step is valid
3. Enable Next button in parent wizard when step is complete
4. Use step indicators to show progress
5. Allow backward navigation to completed steps

```typescript
// Progressive disclosure via button states, not auto-advance
const isStepComplete = useMemo(() => {
  switch (currentStep) {
    case 'name': return Boolean(data.name?.trim())
    case 'race': return Boolean(data.race?.trim())
    case 'class': return Boolean(data.class?.trim())
    // ... other steps
    default: return false
  }
}, [currentStep, data])

<Button
  onClick={() => handleContinue(nextStep)}
  disabled={!isStepComplete}
>
  Continue
</Button>
```

### Source References
- [Developer Way: Debouncing in React](https://www.developerway.com/posts/debouncing-in-react)
- [useHooks: useDebounce](https://usehooks.com/usedebounce)
- [DEV Community: React Debouncing with useEffect](https://dev.to/remejuan/react-debouncing-input-with-useeffect-3nhk)
- [Stack Overflow: How to use debounce with React Hook](https://stackoverflow.com/questions/54666401/how-to-use-throttle-or-debounce-with-react-hook)

### Alternatives Considered and Rejected

| Approach | Description | Pros | Cons | Verdict |
|----------|-------------|------|------|---------|
| Auto-advance on data change | Step changes when field filled | Feels magical | Jarring, unpredictable | ❌ Rejected |
| Debounced auto-advance | Step changes 500ms after typing stops | Slight improvement | Still unexpected | ❌ Rejected |
| Explicit Continue button | User clicks to proceed | Predictable, accessible | Requires extra click | ✅ **Selected** |
| Enter key to advance | Keyboard shortcut | Fast for power users | Not discoverable | ⚠️ Optional enhancement |

---

## 5. Implementation Dependencies

### Research Question
Can Bug #2 (CharacterPreview) be fixed independently of Bug #1/#003 (class skills)?

### Decision: Yes, Bug #2 is Fully Independent

**Analysis**:

**Bug #2: CharacterPreview "?" Symbols**
- **Location**: `CharacterPreview.tsx` line 183
- **Data Source**: Props passed from `BasicInfoStep.getCharacterConcept()`
- **Fix Scope**: Update placeholder text rendering in CharacterPreview component only
- **No Dependencies**: Does not interact with class skill calculation

**Bug #1/#003: Class Skill Display "3 of 0"**
- **Location**: `ClassSelector.tsx` line 360
- **Data Source**: D&D 5e API via `fetchAllReferenceData()`
- **Root Cause**: API returns `skillProficiencies: []` and `skillChoices: 3` (flat structure)
- **Frontend Expects**: `skill_proficiencies: { choose: 3, from: [...] }` (nested structure)
- **Fix Scope**: API transformation in `dnd5eApi.ts` OR ClassSelector calculation logic

**Shared Code**: None. These components do not share state or data transformation logic.

### Implementation Order Recommendation

**Phase 1: Quick Wins (Independent)**
1. **Bug #2 - CharacterPreview** ✅ Can start immediately
   - Update placeholder text rendering
   - Add unit tests
   - Deploy independently
   - **Estimated Time**: 1-2 hours

**Phase 2: Coordination Required**
2. **Bug #1/#003 - Class Skills** ⚠️ Requires API fix
   - Wait for or coordinate with Bug #003 API transformation
   - Alternative: Add fallback calculation in ClassSelector
   - **Estimated Time**: 2-4 hours (includes API work)

**Phase 3: UX Improvements**
3. **Bug #3 - Sub-Step Navigation** ✅ Independent
   - Add button click handlers
   - Implement ARIA attributes
   - **Estimated Time**: 2-3 hours

4. **Bug #6 - Name Auto-Advance** ✅ Independent
   - Remove auto-advance logic
   - Test step transitions
   - **Estimated Time**: 1 hour

**Phase 4: Enhancements**
5. **Bug #7 - Validation Timing** ✅ Independent
   - Add touched state tracking
   - Update validation logic
   - **Estimated Time**: 2-3 hours

### Parallel Work Opportunities

**Developer 1**:
- Bug #2: CharacterPreview placeholder text
- Bug #6: Remove auto-advance logic
- Bug #7: Validation timing

**Developer 2**:
- Bug #3: Sub-step navigation
- Bug #1: Class skills (after API fix)

**Total Estimated Time**:
- Serial implementation: 10-15 hours
- Parallel implementation: 6-8 hours

### Testing Dependencies

**Unit Tests** (no dependencies):
- CharacterPreview with undefined props
- Sub-step button click handlers
- Validation state tracking

**Integration Tests** (sequential):
1. CharacterPreview in wizard context
2. Full wizard flow with backward navigation
3. Validation across all sub-steps

**E2E Tests** (requires all fixes):
- Complete character creation flow
- Accessibility testing with screen readers
- Keyboard navigation through wizard

---

## Code Examples Summary

### 1. Sub-Step Navigation (Bug #3)

```typescript
// Replace div with button
<button
  type="button"
  onClick={() => isCompleted && setCurrentStep(step as typeof currentStep)}
  disabled={!isCompleted && !isActive}
  aria-disabled={!isCompleted && !isActive}
  aria-current={isActive ? 'step' : undefined}
  className={cn(
    "w-8 h-8 rounded-full transition-all",
    "focus-visible:ring-2 focus-visible:ring-primary",
    isActive && "bg-primary text-primary-foreground",
    isCompleted && !isActive && "bg-primary/20 cursor-pointer hover:bg-primary/30",
    !isCompleted && "bg-muted opacity-50 cursor-not-allowed"
  )}
>
  <span className="sr-only">
    {isActive ? 'Current step: ' : isCompleted ? 'Go to: ' : 'Locked: '}
    {step}
  </span>
  {index + 1}
</button>
```

### 2. CharacterPreview Placeholder (Bug #2)

```typescript
// Compact mode
<p className="text-sm text-muted-foreground truncate">
  Level {level}{' '}
  {race?.name || <span className="italic">Race not selected</span>}{' '}
  {characterClass?.name || <span className="italic">Class not selected</span>}
  {background && ` • ${background.name}`}
</p>

// Full mode with better structure
<div className="space-y-1 text-sm">
  <div>
    <span className="font-medium">Race:</span>{' '}
    {race?.name || <span className="text-muted-foreground italic">Not selected yet</span>}
  </div>
  <div>
    <span className="font-medium">Class:</span>{' '}
    {characterClass?.name || <span className="text-muted-foreground italic">Not selected yet</span>}
  </div>
</div>
```

### 3. Validation with Dirty State (Bug #7)

```typescript
const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())
const [hasAttemptedNext, setHasAttemptedNext] = useState(false)

useEffect(() => {
  const isComplete = Boolean(
    data.name?.trim() && data.race && data.class && data.background && data.alignment
  )

  if (isComplete) {
    onValidationChange(true, [])
  } else {
    const shouldShowErrors = hasAttemptedNext || touchedFields.size > 0
    const errors: string[] = []

    if (!data.name?.trim() && (hasAttemptedNext || touchedFields.has('name'))) {
      errors.push('Character name is required')
    }
    // ... more validations

    onValidationChange(false, shouldShowErrors ? errors : [])
  }
}, [data, hasAttemptedNext, touchedFields, onValidationChange])
```

### 4. Remove Auto-Advance (Bug #6)

```typescript
// REMOVE this entire useEffect
useEffect(() => {
  if (!data.name?.trim()) {
    setCurrentStep('name')
  } else if (!data.race?.trim()) {
    setCurrentStep('race')
  }
  // ... auto-advance logic
}, [data, currentStep])

// KEEP only explicit Continue buttons
{currentStep === 'name' && (
  <Button
    onClick={() => setCurrentStep('race')}
    disabled={!data.name?.trim()}
  >
    Continue to Race Selection
  </Button>
)}
```

---

## References & Further Reading

### W3C & WCAG Standards
- [W3C ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA 1.3 Specification](https://w3c.github.io/aria/)
- [W3C Form Instructions Tutorial](https://www.w3.org/WAI/tutorials/forms/instructions/)

### Accessibility Resources
- [MDN: ARIA button role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/button_role)
- [MDN: aria-disabled attribute](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-disabled)
- [DigitalA11Y: Accessible Forms - Placeholder Problems](https://www.digitala11y.com/anatomy-of-accessible-forms-placeholder-is-a-mirage/)
- [Deque: Accessible Forms](https://www.deque.com/blog/accessible-forms-the-problem-with-placeholders/)

### React & Form Libraries
- [React Hook Form Documentation](https://react-hook-form.com/)
- [Final Form: FormState](https://final-form.org/docs/final-form/types/FormState)
- [RandomizeBlog: Multi-Step Form Validation](https://www.randomizeblog.com/multi-step-form-react/)
- [Developer Way: Debouncing in React](https://www.developerway.com/posts/debouncing-in-react)

### UX & Design Patterns
- [MakerKit: Multi-Step Forms in React](https://makerkit.dev/blog/tutorials/multi-step-forms-reactjs)
- [Modus Create: React Form Validation](https://moduscreate.com/blog/reactjs-form-validation-approaches/)
- [useHooks: useDebounce](https://usehooks.com/usedebounce)

### GitHub Discussions
- [w3c/aria-practices: Should APG include wizard pattern? #92](https://github.com/w3c/aria-practices/issues/92)
- [Stack Overflow: When to use disabled vs aria-disabled](https://stackoverflow.com/questions/38059140/when-to-use-the-disabled-attribute-vs-the-aria-disabled-attribute-for-html-eleme)
- [Stack Overflow: React Hook debounce](https://stackoverflow.com/questions/54666401/how-to-use-throttle-or-debounce-with-react-hook)

---

## Appendix: Decision Matrix

| Decision Area | Selected Approach | Key Benefit | Primary Source |
|---------------|-------------------|-------------|----------------|
| Sub-step navigation element | `<button>` with `aria-disabled` | Native keyboard support, accessibility | W3C ARIA APG |
| Placeholder text pattern | "Not selected yet" | Clear, translatable, screen-reader friendly | WCAG 2.1 SC 3.3.2 |
| Validation timing | Hybrid (submit then change) | Progressive disclosure, good UX | React Hook Form patterns |
| Auto-advance strategy | Remove entirely | Predictable, user-controlled | UX best practices |
| Implementation order | CharacterPreview first (independent) | Quick win, no dependencies | Codebase analysis |

---

**Document Status**: ✅ Complete
**Next Phase**: Design & Contracts (Phase 1)
**Ready for**: `/speckit.plan` Phase 1 execution
