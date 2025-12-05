# Data Models: Basic Information Bug Fixes

**Feature**: 004-basic-info-bugs
**Date**: 2025-12-04
**Status**: Design Phase

## Overview

This document defines the data structures and state models for the Basic Information bug fixes. Since this is a frontend-only feature fixing existing components, we're documenting the component interfaces, state management patterns, and data flow rather than introducing new entities.

## Component State Models

### 1. CharacterPreview Component (Bug #2 Fix)

**Purpose**: Display character-in-progress with friendly placeholders instead of "?" symbols

**Current Interface** (from `frontend/src/components/character-creation/CharacterPreview.tsx`):
```typescript
interface CharacterPreviewProps {
  characterConcept: {
    name: string
    race?: Race           // ⚠️ May be undefined - causes "?" display
    class?: Class         // ⚠️ May be undefined - causes "?" display
    background?: Background
    level: number
  }
  baseAbilityScores: {
    strength: number
    dexterity: number
    constitution: number
    intelligence: number
    wisdom: number
    charisma: number
  }
  compact?: boolean
}
```

**Fixed Behavior**:
```typescript
// Internal rendering logic change (no prop changes needed)
interface CharacterPreviewDisplayData {
  name: string
  raceDisplay: string           // race?.name || "Not selected yet"
  classDisplay: string          // class?.name || "Not selected yet"
  backgroundDisplay?: string    // background?.name || undefined (optional)
  level: number
}
```

**State Transitions**:
```
Initial State:
  name: "Character Name"
  race: undefined
  class: undefined
  → Display: "Character Name, Level 1 Not selected yet Not selected yet"

After Race Selection:
  name: "Character Name"
  race: { name: "Elf", ... }
  class: undefined
  → Display: "Character Name, Level 1 Elf Not selected yet"

After Class Selection:
  name: "Character Name"
  race: { name: "Elf", ... }
  class: { name: "Wizard", ... }
  → Display: "Character Name, Level 1 Elf Wizard"
```

**Validation Rules**:
- `name` is always required (never empty string)
- `race` and `class` are optional during wizard progression
- `level` defaults to 1, range 1-20
- Display text "Not selected yet" is translatable, has proper ARIA labels

---

### 2. Sub-Step Navigation State (Bug #3 Fix)

**Purpose**: Enable clickable sub-step indicators for backward navigation

**New State Model**:
```typescript
type SubStep =
  | 'name'
  | 'race'
  | 'class'
  | 'subclass'    // Only shown if level >= subclass requirement
  | 'background'
  | 'feat'        // Only shown if background offers feat choices
  | 'alignment'
  | 'complete'

interface SubStepIndicatorState {
  currentStep: SubStep
  completedSteps: Set<SubStep>    // Steps user has finished
  availableSteps: SubStep[]       // Dynamic list based on character data
  stepOrder: Map<SubStep, number> // Dynamic ordering (1-based indexing)
}
```

**Step Availability Logic**:
```typescript
function getAvailableSteps(data: CharacterCreationData): SubStep[] {
  const steps: SubStep[] = ['name', 'race', 'class']

  // Conditionally add subclass step
  if (data.class && data.level >= getSubclassLevel(data.class)) {
    steps.push('subclass')
  }

  steps.push('background')

  // Conditionally add feat step
  if (data.backgroundData?.featChoices && data.backgroundData.featChoices.length > 0) {
    steps.push('feat')
  }

  steps.push('alignment', 'complete')

  return steps
}
```

**Navigation Rules**:
```typescript
interface SubStepNavigationRules {
  // Can navigate TO a step if:
  canNavigateTo(targetStep: SubStep): boolean {
    return (
      targetStep === currentStep ||           // Current step always accessible
      completedSteps.has(targetStep) ||       // Completed steps accessible
      isPreviousStepComplete(targetStep)      // Next step if previous complete
    )
  }

  // Step is "completed" if:
  isStepComplete(step: SubStep): boolean {
    switch (step) {
      case 'name': return Boolean(data.name?.trim())
      case 'race': return Boolean(data.race?.trim())
      case 'class': return Boolean(data.class?.trim())
      case 'subclass': return Boolean(data.subclass?.trim()) || !requiresSubclass
      case 'background': return Boolean(data.background?.trim())
      case 'feat': return Boolean(data.selectedFeat) || !requiresFeat
      case 'alignment': return Boolean(data.alignment)
      case 'complete': return allPreviousStepsComplete
    }
  }
}
```

**State Transitions**:
```
Initial:
  currentStep: 'name'
  completedSteps: Set([])
  availableSteps: ['name', 'race', 'class', 'background', 'alignment', 'complete']

User enters name "Aragorn" → Click Continue:
  currentStep: 'race'
  completedSteps: Set(['name'])
  availableSteps: ['name', 'race', 'class', 'background', 'alignment', 'complete']

User selects race "Human" → User clicks sub-step indicator "1":
  currentStep: 'name'  // Navigate backward
  completedSteps: Set(['name', 'race'])  // Race still completed
  availableSteps: unchanged
  data.race: 'Human'   // Data preserved
```

---

### 3. Validation State Tracking (Bug #7 Fix)

**Purpose**: Track user interaction to show errors only after engagement, not on pristine form

**New State Model**:
```typescript
interface ValidationState {
  // Core validation
  isValid: boolean                    // Overall form validity
  errors: string[]                    // Current validation errors

  // Interaction tracking
  touchedFields: Set<string>          // Fields user has interacted with
  hasAttemptedNext: boolean           // User tried to click Next

  // Timing control
  showErrors: boolean                 // Whether to display errors to user
}
```

**Field Tracking**:
```typescript
type ValidatableField =
  | 'name'
  | 'race'
  | 'class'
  | 'subclass'
  | 'background'
  | 'feat'
  | 'alignment'
  | 'level'

interface FieldInteraction {
  field: ValidatableField
  interactionType: 'focus' | 'blur' | 'change' | 'submit'
  timestamp: number
}
```

**Validation Timing Logic**:
```typescript
interface ValidationTimingRules {
  // Show errors if:
  shouldShowErrors(): boolean {
    return (
      hasAttemptedNext ||                          // User clicked Next
      touchedFields.size > 0 && hasInteracted()    // User interacted with form
    )
  }

  // Mark field as touched when:
  markTouched(field: ValidatableField): void {
    // On blur (user left field)
    // On change after initial blur
    // On Next button click
  }

  // Run validation:
  runValidation(): void {
    // Always run (update isValid, errors)
    // But only SHOW if shouldShowErrors() is true
  }
}
```

**State Transitions**:
```
Page Load:
  isValid: false
  errors: ['Character name is required', 'Race is required', ...]
  touchedFields: Set([])
  hasAttemptedNext: false
  showErrors: false
  → UI shows: No error messages, Next button disabled

User types "Ar" in name field:
  isValid: false
  errors: ['Race is required', 'Class is required', ...]  // Name error removed
  touchedFields: Set(['name'])
  hasAttemptedNext: false
  showErrors: false
  → UI shows: No error messages, Next button still disabled

User clicks Next (while form invalid):
  isValid: false
  errors: ['Race is required', 'Class is required', ...]
  touchedFields: Set(['name'])
  hasAttemptedNext: true
  showErrors: true  // ← NOW show errors
  → UI shows: Error messages appear, Next button disabled

User selects race:
  isValid: false
  errors: ['Class is required', 'Background is required', ...]
  touchedFields: Set(['name', 'race'])
  hasAttemptedNext: true
  showErrors: true
  → UI shows: Fewer errors, Next button still disabled

All fields valid:
  isValid: true
  errors: []
  touchedFields: Set(['name', 'race', 'class', 'background', 'alignment'])
  hasAttemptedNext: true
  showErrors: false  // No errors to show
  → UI shows: No error messages, Next button ENABLED
```

---

### 4. Auto-Advance Prevention State (Bug #6 Fix)

**Purpose**: Remove automatic step progression, require explicit Continue button clicks

**Current Problematic Logic** (lines 68-91):
```typescript
// ❌ AUTO-ADVANCE: Runs on every data change
useEffect(() => {
  if (!data.name?.trim()) {
    setCurrentStep('name')
  } else if (data.name?.trim() && !data.race?.trim() && currentStep === 'name') {
    return  // Attempt to prevent auto-advance
  } else if (!data.race?.trim()) {
    setCurrentStep('race')  // ← Auto-advance from name to race
  } else if (!data.class?.trim()) {
    setCurrentStep('class')  // ← Auto-advance from race to class
  }
  // ... more auto-advances
}, [data, currentStep, shouldShowFeatSelection])
```

**Fixed Logic**:
```typescript
// ✅ NO AUTO-ADVANCE: Only explicit button clicks
// Remove the entire useEffect above

// Keep only explicit Continue button handlers:
const handleContinueToRace = () => {
  setCurrentStep('race')
}

const handleContinueToClass = () => {
  setCurrentStep('class')
}

// etc...
```

**State Model**:
```typescript
// No new state needed - REMOVAL of reactive auto-advance
interface ExplicitNavigationModel {
  // Navigation triggered ONLY by:
  userClickedContinue: () => void     // Continue button
  userClickedSubStep: (step: SubStep) => void  // Sub-step indicator

  // NOT triggered by:
  // - Data changes (removed from useEffect)
  // - Typing in fields
  // - Time delays
  // - Automatic progression
}
```

**Behavior Change**:
```
Before (Auto-Advance):
  User types "Gandalf" in name field
  → useEffect detects data.name exists
  → Automatically sets currentStep to 'race'
  → UI jumps to race selection (JARRING)

After (Explicit Navigation):
  User types "Gandalf" in name field
  → UI stays on name step
  → Continue button appears (enabled because name is valid)
  → User clicks Continue
  → THEN currentStep changes to 'race'
  → UI smoothly transitions (USER CONTROL)
```

---

### 5. Class Skills Display (Bug #1 - Depends on Bug #003)

**Purpose**: Fix "Skills: 3 of 0" display for classes like Bard

**Current Problem**:
```typescript
// Frontend expects (frontend/src/types/dnd5e.ts):
interface Class {
  skill_proficiencies: {
    choose: number      // e.g., 3
    from: string[]      // e.g., ["Acrobatics", "Animal Handling", ...]
  }
}

// API returns (api/src/routes/classes.ts):
interface ClassAPIResponse {
  skillProficiencies: string[]  // e.g., [] for Bard
  skillChoices: number          // e.g., 3
}

// Display code (ClassSelector.tsx:360):
Skills: {cls?.skill_proficiencies?.choose || 0} of {cls?.skill_proficiencies?.from?.length || 0}
// Results in: "Skills: 3 of 0" because from is undefined
```

**Required Data Structure** (after Bug #003 API fix):
```typescript
interface Class {
  name: string
  skill_proficiencies: {
    choose: number              // Number of skills to choose
    from: string[]              // Available skills to choose from
    type: 'any' | 'from_list'   // 'any' for Bard (all 18 skills), 'from_list' for others
  }
}

// For Bard specifically:
{
  name: 'Bard',
  skill_proficiencies: {
    choose: 3,
    from: [
      'Acrobatics', 'Animal Handling', 'Arcana', 'Athletics',
      'Deception', 'History', 'Insight', 'Intimidation',
      'Investigation', 'Medicine', 'Nature', 'Perception',
      'Performance', 'Persuasion', 'Religion', 'Sleight of Hand',
      'Stealth', 'Survival'
    ],  // All 18 D&D 5e skills
    type: 'any'
  }
}
```

**Fixed Display**:
```typescript
// ClassSelector.tsx display logic (no changes needed after API fix):
Skills: {cls?.skill_proficiencies?.choose || 0} of {cls?.skill_proficiencies?.from?.length || 0}

// Will now correctly show: "Skills: 3 of 18" for Bard
```

---

## Data Flow Diagrams

### Bug #2: CharacterPreview Data Flow

```
BasicInfoStep Component State
  ↓
  data.name: string
  data.raceData?: Race
  data.classData?: Class
  ↓
getCharacterConcept() helper
  ↓
  characterConcept: {
    name: data.name || '',
    race: data.raceData,      // May be undefined
    class: data.classData,    // May be undefined
    level: data.level || 1
  }
  ↓
CharacterPreview Component
  ↓
  Internal rendering:
  - raceDisplay = race?.name || "Not selected yet"
  - classDisplay = class?.name || "Not selected yet"
  ↓
UI Display: "Gandalf, Level 1 Not selected yet Not selected yet"
          → "Gandalf, Level 1 Elf Not selected yet"
          → "Gandalf, Level 1 Elf Wizard"
```

### Bug #3: Sub-Step Navigation Data Flow

```
User clicks sub-step indicator (e.g., circle "1")
  ↓
onClick handler: handleSubStepClick(step: 'name')
  ↓
Check: isStepClickable('name')
  - Is it current step? ✅ Always clickable
  - Is it completed? ✅ name is in completedSteps
  - Is it next step? ❌ Not relevant
  ↓
setCurrentStep('name')
  ↓
React re-renders:
  - Unmounts 'race' sub-step UI
  - Mounts 'name' sub-step UI
  - data.race still exists (preserved)
  ↓
UI shows name input with value "Gandalf"
User can edit or click Continue to return to race selection
```

### Bug #7: Validation Timing Data Flow

```
Component Mount
  ↓
Initial state:
  touchedFields = Set([])
  hasAttemptedNext = false
  ↓
Run validation (silent):
  isValid = false
  errors = ['Name required', 'Race required', ...]
  ↓
shouldShowErrors() → false
  ↓
UI: No errors shown, Next button disabled
  ↓
  ↓
User clicks Next button
  ↓
setHasAttemptedNext(true)
  ↓
shouldShowErrors() → true
  ↓
UI: Errors appear, Next button still disabled
  ↓
  ↓
User enters name "Gandalf"
  ↓
onChange → validate → errors = ['Race required', ...]
  ↓
shouldShowErrors() → true (hasAttemptedNext is true)
  ↓
UI: Fewer errors shown, Next button still disabled
  ↓
  ↓
User selects race, class, background, alignment
  ↓
onChange → validate → errors = [], isValid = true
  ↓
shouldShowErrors() → false (no errors to show)
  ↓
UI: No errors shown, Next button ENABLED
```

---

## Type Definitions

### New Types to Add

**File**: `frontend/src/types/wizard.ts`

```typescript
// Sub-step navigation types
export type SubStep =
  | 'name'
  | 'race'
  | 'class'
  | 'subclass'
  | 'background'
  | 'feat'
  | 'alignment'
  | 'complete'

export interface SubStepIndicatorProps {
  step: SubStep
  index: number
  isActive: boolean
  isCompleted: boolean
  label: string
  onClick: (step: SubStep) => void
}

// Validation state types
export interface ValidationState {
  isValid: boolean
  errors: string[]
  touchedFields: Set<string>
  hasAttemptedNext: boolean
  showErrors: boolean
}

export type ValidatableField =
  | 'name'
  | 'race'
  | 'class'
  | 'subclass'
  | 'background'
  | 'feat'
  | 'alignment'
  | 'level'
```

---

## Relationships

### Component Dependencies

```
CharacterWizard (parent)
  ↓ (passes data, onChange, onValidationChange props)
BasicInfoStep
  ├─→ CharacterPreview (sidebar)
  │     ↓ (receives characterConcept)
  │     Displays: name, race, class with placeholders
  │
  ├─→ RaceSelector (sub-step)
  ├─→ ClassSelector (sub-step)
  ├─→ BackgroundSelector (sub-step)
  └─→ SubclassSelector (conditional sub-step)
```

### Data Dependencies

```
CharacterCreationContext (localStorage)
  ↓
CharacterWizard state
  ↓
BasicInfoStep props.data
  ├─→ Used for validation
  ├─→ Passed to preview
  └─→ Determines sub-step availability
```

---

## Migration Notes

**No data migration required**. All fixes are:
- UI/UX improvements (presentation layer)
- Component behavior changes
- No localStorage structure changes
- No API contract changes (except Bug #1 depends on #003 API fix)

**Backward Compatibility**:
- Existing character data in localStorage works unchanged
- CharacterPreview props unchanged (only internal rendering logic)
- BasicInfoStep props unchanged (WizardStepProps interface)
- All changes are additive or fix existing bugs

---

## Summary

This data model document defines:

1. **CharacterPreview Display State**: How to render friendly placeholders
2. **Sub-Step Navigation State**: Dynamic step list, completion tracking, click rules
3. **Validation State**: Touched fields, error timing, user interaction tracking
4. **Auto-Advance Removal**: Explicit navigation model replacing reactive useEffect
5. **Class Skills Structure**: Required API format for Bug #1 fix (depends on #003)

All models maintain backward compatibility and follow React best practices from the research phase.
