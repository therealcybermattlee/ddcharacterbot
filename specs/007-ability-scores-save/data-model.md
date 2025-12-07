# Data Model: Ability Scores Not Persisting on Navigation

**Feature**: 007-ability-scores-save
**Date**: 2025-12-07
**Status**: Phase 1 - Design

---

## Overview

This document defines the data entities and their relationships for the Ability Scores save bug fix. The primary focus is on ensuring ability score data persists correctly across wizard navigation through proper callback handling.

---

## Core Entities

### 1. Ability Scores

**Description**: The six core D&D 5e ability scores that define a character's capabilities.

**Properties**:
- **strength** (number, 3-20): Physical power and athletic ability
- **dexterity** (number, 3-20): Agility, reflexes, and balance
- **constitution** (number, 3-20): Health, stamina, and vital force
- **intelligence** (number, 3-20): Reasoning, memory, and analytical skill
- **wisdom** (number, 3-20): Awareness, intuition, and insight
- **charisma** (number, 3-20): Force of personality and leadership

**Derived Properties** (for each ability):
- **base_value** (number): User-entered value before racial modifiers
- **racial_modifier** (number, typically +1 to +2): Bonus from selected race
- **final_value** (number): base_value + racial_modifier
- **modifier** (number): Calculated bonus/penalty: floor((final_value - 10) / 2)

**Validation Rules**:
- All six ability scores must have values set
- Base values typically 8-18 for standard generation methods
- Absolute range: 3-20 for base values
- Final values after racial modifiers can exceed 20

**Storage Locations**:
- Component State: AbilityScoresStep local state
- Context: CharacterCreationContext (shared wizard state)
- Persistence: localStorage (survives page refresh)

---

### 2. Ability Score Generation Method

**Description**: The method used to determine ability score values, each with different rules and constraints.

**Enumeration Values**:
- **point_buy**: Allocate 27 points across abilities with costs per value
- **standard_array**: Assign predefined values (15, 14, 13, 12, 10, 8) to abilities
- **manual_entry**: Directly enter values for each ability
- **dice_roll**: Generate random values by rolling 4d6 drop lowest

**Associated Data**:
- **selected_method** (enum): Currently active generation method
- **point_buy_allocation** (object, optional): Points spent per ability if using point buy
- **standard_array_assignments** (object, optional): Which array value assigned to which ability
- **rolled_values** (array, optional): Results from dice rolling if using that method

**Validation Rules**:
- Method must be selected before ability scores can be set
- Point buy: Total points spent ≤ 27
- Standard array: Each value used exactly once
- Manual entry: No constraints beyond valid ranges
- Dice roll: Values must be result of proper dice mechanics

**State Requirements**:
- Method selection must persist across navigation
- Method-specific data (allocations, assignments) must persist
- Switching methods should preserve or reset data appropriately

---

### 3. Character Data State

**Description**: The complete character creation data structure that persists ability scores and other character information.

**Structure** (ability scores portion):
```typescript
{
  stats: {
    strength: number
    dexterity: number
    constitution: number
    intelligence: number
    wisdom: number
    charisma: number
  }
  abilityScoreMethod?: string  // Generation method used
  abilityScoreAllocation?: object  // Method-specific data

  // Other character data (race, class, etc.)
  race?: string
  class?: string
  // ... etc
}
```

**Synchronization Points**:
1. **Component State** → **Context**: Via onChange callback
2. **Context** → **localStorage**: Automatic persistence
3. **localStorage** → **Context**: On page load/refresh
4. **Context** → **Component State**: On step mount/navigation

**Persistence Mechanism**:
- CharacterCreationContext manages in-memory state
- Automatic localStorage sync on context changes
- Component receives initial data via props on mount
- Component updates context via onChange callback
- Validation state via separate onValidationChange callback

---

## Validation State Entity

**Description**: Separate state tracking whether each wizard step's data is valid and complete.

**Properties**:
- **stepId** (string): Identifier for the wizard step (e.g., "ability-scores")
- **isValid** (boolean): Whether the step's data meets all requirements
- **errors** (string[]): Array of validation error messages if invalid

**Validation Requirements for Ability Scores Step**:
- All six ability scores must have values set (not null/undefined)
- All values must be within valid range (3-20)
- If using point buy: points allocated must equal 27
- If using standard array: all array values must be assigned
- Racial modifiers must be correctly applied

**Critical Bug Context**:
- Validation state updated via onValidationChange callback
- **Bug**: onValidationChange has unstable identity from parent
- **Result**: Stale closures prevent validation state updates
- **Fix**: Ref pattern to always call latest callback

---

## Callback Contracts

### onChange Callback

**Purpose**: Update parent wizard's character data when ability scores change

**Signature**:
```typescript
onChange: (data: Partial<CharacterCreationData>) => void
```

**Parameters**:
- **data**: Partial character data object with updated ability scores

**Invocation Points**:
- When user modifies any ability score value
- When user switches generation method
- When racial modifiers are recalculated

**Current Status**: ✅ Working correctly (data is being saved)

---

### onValidationChange Callback

**Purpose**: Update parent wizard's validation state for this step

**Signature**:
```typescript
onValidationChange: (isValid: boolean, errors?: string[]) => void
```

**Parameters**:
- **isValid**: Whether all ability scores are complete and valid
- **errors**: Optional array of validation error messages

**Invocation Points**:
- When ability scores are modified (after validation check)
- On step mount (initial validation)
- When validation state changes (complete → incomplete or vice versa)

**Current Status**: ❌ BROKEN - Stale closure issue
**Root Cause**: Callback identity changes when parent re-renders
**Impact**: Next button stays disabled even when data is complete

---

## Data Flow Diagram

```
User Input (AbilityScoreGenerator)
  ↓
handleStateChange (AbilityScoresStep)
  ↓
├─→ onChange(updatedData)          ✅ Works - data saved to context
│     ↓
│   CharacterCreationContext
│     ↓
│   localStorage
│
└─→ onValidationChange(isValid, errors)  ❌ Broken - stale closure
      ↓
    [Stale Callback - doesn't reach current wizard context]
      ↓
    Step validity NOT updated
      ↓
    Next button stays disabled
```

**Fix Applied**:
```
User Input (AbilityScoreGenerator)
  ↓
handleStateChange (AbilityScoresStep)
  ↓
├─→ onChange(updatedData)          ✅ Works
│     ↓
│   CharacterCreationContext
│     ↓
│   localStorage
│
└─→ onValidationChangeRef.current(isValid, errors)  ✅ Fixed - always latest
      ↓
    CharacterWizard.handleValidationChange
      ↓
    setStepValidity(stepId, isValid, errors)
      ↓
    Next button enables correctly
```

---

## Racial Modifier Application

**Entity**: Racial Ability Score Bonuses

**Structure**:
```typescript
{
  raceName: string
  abilityBonuses: {
    [abilityName: string]: number
  }
}
```

**Example (Dwarf)**:
```typescript
{
  raceName: "Dwarf",
  abilityBonuses: {
    constitution: 2
  }
}
```

**Application Logic**:
1. User selects race in Basic Info step
2. Race data includes ability score bonuses
3. AbilityScoresStep receives race data via character context
4. When user enters base ability scores, racial bonuses are added
5. Both base and final values are displayed and saved

**Persistence Requirements**:
- Base scores (user-entered) must persist
- Racial modifiers must persist
- Final scores (base + racial) must be recalculated on load
- If race changes, modifiers must update accordingly

---

## State Management Pattern

### Current Pattern (Pre-Fix)

**Problem**:
```typescript
// Parent (CharacterWizard)
const handleValidationChange = useCallback((isValid, errors) => {
  setStepValidity(currentStep.id, isValid, errors)
}, [currentStep, setStepValidity])
// ↑ New function identity every time currentStep changes

// Child (AbilityScoresStep) - BROKEN
useEffect(() => {
  // Validation logic...
  onValidationChange(isValid, errors)  // ❌ Stale callback
}, [/* dependencies */])
```

### Fixed Pattern (Ref Pattern)

**Solution**:
```typescript
// Child (AbilityScoresStep) - FIXED
const onValidationChangeRef = useRef(onValidationChange)

useEffect(() => {
  onValidationChangeRef.current = onValidationChange
}, [onValidationChange])

// Later in code...
useEffect(() => {
  // Validation logic...
  onValidationChangeRef.current(isValid, errors)  // ✅ Always latest
}, [/* dependencies excluding onValidationChange */])
```

**Why This Works**:
- Ref stores the callback reference
- Ref update effect runs on every render when prop changes
- Validation logic calls via ref (always latest version)
- No dependency on callback identity in validation effect
- Decouples child from parent callback instability

---

## Testing Data Scenarios

### Test Scenario 1: Point Buy Method
```typescript
{
  stats: {
    strength: 15,      // 9 points
    dexterity: 14,     // 7 points
    constitution: 13,  // 5 points
    intelligence: 12,  // 4 points
    wisdom: 10,        // 2 points
    charisma: 8        // 0 points
  },
  abilityScoreMethod: "point_buy",
  abilityScoreAllocation: {
    strength: 9,
    dexterity: 7,
    constitution: 5,
    intelligence: 4,
    wisdom: 2,
    charisma: 0
  }
  // Total: 27 points ✅
}
```

### Test Scenario 2: Standard Array with Racial Modifier
```typescript
{
  stats: {
    strength: 15,      // Base: 15
    dexterity: 14,     // Base: 14
    constitution: 15,  // Base: 13 + 2 (Dwarf racial)
    intelligence: 12,  // Base: 12
    wisdom: 10,        // Base: 10
    charisma: 8        // Base: 8
  },
  race: "Dwarf",
  abilityScoreMethod: "standard_array",
  abilityScoreAllocation: {
    strength: 15,
    dexterity: 14,
    constitution: 13,  // Base value before racial
    intelligence: 12,
    wisdom: 10,
    charisma: 8
  }
}
```

### Test Scenario 3: Manual Entry
```typescript
{
  stats: {
    strength: 18,
    dexterity: 16,
    constitution: 14,
    intelligence: 10,
    wisdom: 12,
    charisma: 8
  },
  abilityScoreMethod: "manual_entry"
  // No allocation data needed
}
```

---

## Edge Case Data States

### 1. Incomplete Data (Invalid State)
```typescript
{
  stats: {
    strength: 14,
    dexterity: 16,
    constitution: null,  // ❌ Missing
    intelligence: null,  // ❌ Missing
    wisdom: null,        // ❌ Missing
    charisma: null       // ❌ Missing
  }
}
// Expected: isValid = false, Next button disabled
```

### 2. Race Change After Ability Scores Set
```typescript
// Initial state (Human, +1 all)
{
  stats: { str: 11, dex: 11, con: 11, int: 11, wis: 11, cha: 11 },
  race: "Human"
}

// User changes to Dwarf (+2 Con)
{
  stats: { str: 10, dex: 10, con: 12, int: 10, wis: 10, cha: 10 },
  race: "Dwarf"
}
// Expected: Base scores recalculated, new racial modifiers applied
```

### 3. localStorage Corruption
```typescript
// localStorage has invalid JSON or missing keys
localStorage.getItem('characterData') === "corrupted{data"

// Expected: Graceful fallback to empty state, no crash
```

---

**Last Updated**: 2025-12-07
**Status**: Complete - Data model documented
**Next**: Generate contracts and quickstart guide
