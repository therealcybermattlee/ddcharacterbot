# Component Contract: AbilityScoresStep

**Feature**: 007-ability-scores-save
**Component**: `frontend/src/components/wizard/steps/AbilityScoresStep.tsx`
**Date**: 2025-12-07

---

## Component Interface

### Props (Input Contract)

```typescript
interface AbilityScoresStepProps extends WizardStepProps {
  // Inherited from WizardStepProps
  data: Partial<CharacterCreationData>
  onChange: (data: Partial<CharacterCreationData>) => void
  onValidationChange: (isValid: boolean, errors?: string[]) => void
}
```

**Required Props**:
- **data**: Partial character creation data including existing ability scores, race info, and generation method
- **onChange**: Callback to update parent wizard with new ability score data
- **onValidationChange**: Callback to update parent wizard validation state

**Optional Props**: None (all WizardStepProps are required)

---

## Data Contract

### Input Data Structure

```typescript
{
  // Ability scores (if previously set)
  stats?: {
    strength?: number
    dexterity?: number
    constitution?: number
    intelligence?: number
    wisdom?: number
    charisma?: number
  }

  // Race info (affects racial modifiers)
  race?: string
  raceData?: {
    name: string
    abilityBonuses: {
      [abilityName: string]: number
    }
  }

  // Ability score generation method and data
  abilityScoreMethod?: 'point_buy' | 'standard_array' | 'manual_entry' | 'dice_roll'
  abilityScoreAllocation?: object  // Method-specific allocation data
}
```

### Output Data Structure (via onChange)

```typescript
{
  stats: {
    strength: number      // 3-20 range
    dexterity: number     // 3-20 range
    constitution: number  // 3-20 range
    intelligence: number  // 3-20 range
    wisdom: number        // 3-20 range
    charisma: number      // 3-20 range
  }
  abilityScoreMethod: string
  abilityScoreAllocation?: object  // Optional method-specific data
}
```

**Guarantees**:
- All six ability scores will have numeric values when step is valid
- Values will be within valid range (3-20)
- Racial modifiers will be applied to base scores
- Generation method will be persisted

---

## Callback Contracts

### onChange Callback

**When Called**:
- User modifies any ability score value
- User switches generation method
- Ability scores are recalculated (e.g., race change)

**Parameters**:
```typescript
onChange(updatedData: Partial<CharacterCreationData>)
```

**updatedData Contains**:
- `stats` object with all six ability scores
- `abilityScoreMethod` string
- `abilityScoreAllocation` object (if applicable)

**Expected Behavior**:
- Parent wizard updates CharacterCreationContext
- Context automatically syncs to localStorage
- Data persists across navigation and refresh

**Current Status**: ✅ Working correctly

---

### onValidationChange Callback

**When Called**:
- On component mount (initial validation)
- When ability scores change (after validation check)
- When validation state transitions (valid ↔ invalid)

**Parameters**:
```typescript
onValidationChange(isValid: boolean, errors?: string[])
```

**isValid**: `true` if all ability scores are set and valid, `false` otherwise

**errors**: Array of validation error messages (empty if valid)

**Expected Behavior**:
- Parent wizard updates step validity state
- Next button enables/disables based on validity
- Wizard tracks which steps are complete

**Current Status**: ❌ BROKEN - Stale closure issue
**Fix**: Use ref pattern to always call latest callback

---

## Validation Contract

### Validation Rules

The step is considered **valid** when:
1. All six ability scores have values (not null/undefined)
2. All values are within valid range (3-20)
3. If using point buy: total points allocated equals 27
4. If using standard array: all array values assigned exactly once

The step is considered **invalid** when:
- Any ability score is missing (null/undefined)
- Any value is outside valid range (< 3 or > 20)
- Point buy constraint violated (points ≠ 27)
- Standard array constraint violated (duplicate/missing assignments)

### Error Messages

**Error Codes**:
- `"MISSING_ABILITY_SCORES"`: One or more ability scores not set
- `"INVALID_RANGE"`: Value outside 3-20 range
- `"POINT_BUY_INVALID"`: Point buy allocation doesn't sum to 27
- `"STANDARD_ARRAY_INVALID"`: Standard array assignments incomplete

**User-Facing Messages**:
- "Please set all six ability scores"
- "Ability score values must be between 3 and 20"
- "Point buy must allocate exactly 27 points"
- "All standard array values must be assigned"

---

## State Management Contract

### Internal State

**Component maintains**:
- Current ability score values (synchronized with props.data)
- Validation state (errors array)
- Generation method selection

**State Synchronization**:
- Props.data → Local state (on mount and when props change)
- Local state → Props.data (via onChange callback)
- Validation state → Parent (via onValidationChange callback)

### Ref Pattern Implementation (Bug Fix)

**Required Pattern**:
```typescript
const onValidationChangeRef = useRef(onValidationChange)

useEffect(() => {
  onValidationChangeRef.current = onValidationChange
}, [onValidationChange])

// Call validation via ref
onValidationChangeRef.current(isValid, errors)
```

**Why Needed**:
- Parent's `onValidationChange` has unstable identity
- Changes every time `currentStep` changes in parent
- Direct calls capture stale closures
- Ref pattern ensures latest callback is always called

**Also Apply To** (optional but recommended):
```typescript
const onChangeRef = useRef(onChange)

useEffect(() => {
  onChangeRef.current = onChange
}, [onChange])
```

---

## Child Component Contracts

### AbilityScoreGenerator Component

**Props**:
```typescript
{
  onStateChange: (state: AbilityScoreState) => void
  initialData?: Partial<CharacterCreationData>
  raceData?: RaceData
}
```

**Responsibilities**:
- Manage ability score generation UI (point buy, standard array, etc.)
- Handle user input for ability scores
- Apply racial modifiers
- Call onStateChange when values change

**Contract with AbilityScoresStep**:
- AbilityScoreGenerator calls `onStateChange` with new ability scores
- AbilityScoresStep.handleStateChange receives update
- handleStateChange validates and calls onChange/onValidationChange
- Data flows up to parent wizard

---

## Lifecycle Contract

### Component Mount

**Sequence**:
1. Component receives props (data, onChange, onValidationChange)
2. Initialize refs for callbacks
3. Set up ref update effects
4. Initialize local state from props.data
5. Run initial validation
6. Call onValidationChange with initial validation state

**Expected Behavior**:
- If props.data has complete ability scores → validate as valid
- If props.data is empty/incomplete → validate as invalid
- Next button state reflects initial validation

### Component Update (Navigation Return)

**Sequence**:
1. Component receives updated props when user navigates back
2. Props.data contains previously saved ability scores
3. Local state updates from props.data
4. Validation re-runs
5. onValidationChange called with current validation state

**Expected Behavior**:
- Previously entered values restore correctly
- Generation method selection restores
- Method-specific data (point buy allocation, etc.) restores
- Next button enables if data was previously complete

### Component Unmount (Navigation Away)

**Sequence**:
1. User clicks Next or navigates to another step
2. onChange has already been called with latest data
3. onValidationChange has confirmed step is valid
4. Component unmounts
5. Data persists in context and localStorage

**Expected Behavior**:
- All data is saved before unmount
- Validation state is up-to-date
- Parent wizard can navigate forward
- Data survives unmount and subsequent remount

---

## Error Handling Contract

### Input Data Errors

**Scenario**: props.data contains invalid or corrupt ability score data

**Handling**:
- Gracefully default to empty state
- Show validation errors to user
- Don't crash or throw errors
- Allow user to re-enter data

### Callback Errors

**Scenario**: onChange or onValidationChange throws error

**Handling**:
- Catch errors in try-catch blocks
- Log errors to console
- Continue component operation
- Don't lose user's entered data

### Race Data Missing

**Scenario**: props.data.raceData is undefined or incomplete

**Handling**:
- Default racial modifiers to 0 for all abilities
- Calculate base scores only
- Continue allowing ability score input
- Recalculate when race data becomes available

---

## Performance Contract

### Re-render Optimization

**Guarantees**:
- Component doesn't re-render on unrelated wizard state changes
- Ref pattern prevents unnecessary re-renders from callback identity changes
- Validation only runs when ability scores change, not on every render

**Measurements**:
- Ability score updates should complete within 100ms
- onChange callback should fire immediately on value change
- No debouncing or throttling (data must save in real-time)

---

## Testing Contract

### Unit Test Coverage

**Required Tests**:
1. Component renders with empty data
2. Component renders with existing ability scores
3. onChange called when ability scores change
4. onValidationChange called with correct validity state
5. Ref pattern handles callback identity changes
6. Validation rules enforced correctly
7. Racial modifiers applied correctly
8. Generation method selection persists

### Integration Test Coverage

**Required Tests**:
1. Complete ability scores → navigate forward → navigate back → values persist
2. Point buy method → navigate away → navigate back → allocation persists
3. Standard array → navigate away → navigate back → assignments persist
4. Change race → ability scores update with new modifiers
5. Browser refresh → data restores from localStorage

### Manual Test Scenarios

See `research.md` Testing Strategy section for comprehensive manual test cases.

---

## Breaking Changes

### This Fix (Feature 007)

**Changes**:
- Add ref pattern for onValidationChange callback
- Add ref pattern for onChange callback (optional)
- Update useEffect dependency arrays

**Compatibility**:
- ✅ No breaking changes to props interface
- ✅ No breaking changes to data structure
- ✅ No breaking changes to parent wizard
- ✅ Fully backward compatible

**Migration**: None required (bug fix only)

---

**Last Updated**: 2025-12-07
**Status**: Complete - Contract documented
**Related**: WizardStepProps interface, CharacterCreationContext, AbilityScoreGenerator component
