# Data Model: Cleric Selection Blank Screen Bug Fix

**Feature**: 005-cleric-selection-bug
**Date**: 2025-12-05
**Status**: Complete

---

## Overview

This document defines the data models and transformations involved in the Cleric selection bug fix. The bug is caused by a missing field extraction in the `transformClassData()` function, which fails to copy the `subclasses` array from the API response to the frontend `Class` object.

---

## Root Cause: Data Transformation Gap

```
┌─────────────┐                 ┌──────────────────┐                 ┌─────────────┐
│   Backend   │                 │   Frontend       │                 │  Component  │
│     API     │────returns─────>│ transformClassData│────creates────>│ Class Object│
│             │   subclasses[]  │                   │  NO subclasses │             │
└─────────────┘                 └──────────────────┘                 └─────────────┘
                                        ↑
                                        │
                                   MISSING LINE:
                                subclasses: apiClass.subclasses || []
```

---

## Entity Models

### 1. API Response (Backend)

**Source**: `api/src/routes/classes.ts` lines 60-83

```typescript
interface APICharacterClass {
  id: number
  name: string
  hit_die: number
  primary_ability: string
  saving_throw_proficiencies: string[]
  skill_choices: number
  skill_proficiencies: string[]
  armor_proficiencies: string[]
  weapon_proficiencies: string[]
  tool_proficiencies: string[]
  features: ClassFeature[]          // ✅ Populated by getClassFeatures()
  subclasses: Subclass[]            // ✅ Populated by getSubclasses()
  spellcasting_ability?: string
}
```

**Key Properties**:
- `subclasses`: Array of Subclass objects returned by `getSubclasses(className)`
- **Cleric Example**: Contains 6 Divine Domains (Life, War, Knowledge, Light, Nature, Tempest)
- **Always populated**: Returns empty array `[]` if no subclasses defined

---

### 2. Frontend Class Interface

**Source**: `frontend/src/types/dnd5e.ts` lines 85-108

```typescript
export interface Class {
  id: string
  name: string
  description: string
  hit_die: number
  primary_ability: string
  saving_throw_proficiencies: string[]
  armor_proficiencies: ArmorProficiency
  weapon_proficiencies: WeaponProficiency
  skill_proficiencies: {
    choose: number
    from: string[]
  }
  class_features: ClassFeature[]
  subclasses?: Subclass[]           // ✅ Interface DOES support subclasses
  spellcasting?: SpellcastingInfo
}
```

**Key Properties**:
- `subclasses?`: Optional array of Subclass objects
- **Currently undefined**: Never populated by `transformClassData()`
- **This causes the bug**: `data.classData.subclasses` is undefined, conditional rendering fails

---

### 3. Subclass Entity

**Source**: `frontend/src/types/dnd5e.ts` lines 113-127

```typescript
export interface Subclass {
  id: string
  name: string
  description: string
  source: string
  features: SubclassFeature[]       // Level-based feature progression
}
```

**Cleric Subclasses** (6 Divine Domains):
1. **Life Domain** - Healing and preservation
2. **War Domain** - Combat and martial prowess
3. **Knowledge Domain** - Lore and information
4. **Light Domain** - Radiance and fire
5. **Nature Domain** - Wilderness and animals
6. **Tempest Domain** - Storm and thunder

**Feature Progression**:
- Level 1: Domain Spells + Bonus Proficiency + Domain Feature
- Level 2: Channel Divinity (1/rest)
- Level 6: Channel Divinity Feature + 2/rest
- Level 8: Divine Strike / Potent Spellcasting
- Level 17: Domain Capstone Feature

---

## Data Flow

### Current Flow (BROKEN)

```
1. User clicks Cleric class card
   └─> ClassSelector calls onClassSelect(clericClass)

2. BasicInfoStep.handleClassSelect() called
   └─> Creates newData with classData: clericClass
   └─> Calls onChange(newData)

3. CharacterWizard updates context
   └─> Context.updateStepData() merges new data
   └─> localStorage saves progress
   └─> Context triggers re-render

4. BasicInfoStep re-renders with new data
   └─> useEffect (lines 68-91) runs
   └─> Checks: data.level >= getSubclassLevel(data.class)
   └─> Evaluates: 1 >= 1 (true for Cleric)
   └─> Sets: currentStep = 'subclass'

5. Rendering logic (line 377)
   └─> Checks: currentStep === 'subclass' && data.classData?.subclasses
   └─> Evaluates: 'subclass' === 'subclass' && undefined
   └─> Result: FALSE ❌
   └─> SubclassSelector NOT rendered
   └─> USER SEES: Blank screen

```

### Fixed Flow (CORRECT)

```
1. User clicks Cleric class card
   └─> ClassSelector calls onClassSelect(clericClass)
   └─> clericClass.subclasses = [Life, War, Knowledge, Light, Nature, Tempest]

2. BasicInfoStep.handleClassSelect() called
   └─> Creates newData with classData: clericClass (now with subclasses!)
   └─> Calls onChange(newData)

3. CharacterWizard updates context
   └─> Context.updateStepData() merges new data
   └─> localStorage saves progress
   └─> Context triggers re-render

4. BasicInfoStep re-renders with new data
   └─> useEffect (lines 68-91) runs
   └─> Checks: data.level >= getSubclassLevel(data.class)
   └─> Evaluates: 1 >= 1 (true for Cleric)
   └─> Sets: currentStep = 'subclass'

5. Rendering logic (line 377)
   └─> Checks: currentStep === 'subclass' && data.classData?.subclasses
   └─> Evaluates: 'subclass' === 'subclass' && [6 domains]
   └─> Result: TRUE ✅
   └─> SubclassSelector rendered with 6 Divine Domains
   └─> USER SEES: Subclass selection UI

```

---

## Transformation Fix

### Location
**File**: `frontend/src/services/dnd5eApi.ts`
**Function**: `transformClassData(apiClass: any): Class`
**Lines**: 102-162

### Current Code (BROKEN)

```typescript
function transformClassData(apiClass: any): Class {
  return {
    id: apiClass.id?.toString() || '',
    name: apiClass.name || '',
    description: apiClass.description || '',
    hit_die: apiClass.hitDie || 8,
    primary_ability: apiClass.primaryAbility || '',
    saving_throw_proficiencies: apiClass.savingThrowProficiencies || [],
    armor_proficiencies: transformArmorProficiencies(apiClass.armorProficiencies),
    weapon_proficiencies: transformWeaponProficiencies(apiClass.weaponProficiencies),
    skill_proficiencies: {
      choose: apiClass.skillChoices || 0,
      from: apiClass.skillProficiencies || []
    },
    class_features: CLASS_FEATURES[apiClass.id?.toLowerCase()] || [],
    // ❌ MISSING: subclasses property not extracted from apiClass.subclasses
    spellcasting: apiClass.spellcastingAbility ? {
      ability: apiClass.spellcastingAbility,
      spells_known_formula: apiClass.spellsKnownFormula
    } : undefined,
  }
}
```

### Fixed Code (CORRECT)

```typescript
function transformClassData(apiClass: any): Class {
  return {
    id: apiClass.id?.toString() || '',
    name: apiClass.name || '',
    description: apiClass.description || '',
    hit_die: apiClass.hitDie || 8,
    primary_ability: apiClass.primaryAbility || '',
    saving_throw_proficiencies: apiClass.savingThrowProficiencies || [],
    armor_proficiencies: transformArmorProficiencies(apiClass.armorProficiencies),
    weapon_proficiencies: transformWeaponProficiencies(apiClass.weaponProficiencies),
    skill_proficiencies: {
      choose: apiClass.skillChoices || 0,
      from: apiClass.skillProficiencies || []
    },
    class_features: CLASS_FEATURES[apiClass.id?.toLowerCase()] || [],
    subclasses: apiClass.subclasses || [],  // ✅ FIX: Extract subclasses from API response
    spellcasting: apiClass.spellcastingAbility ? {
      ability: apiClass.spellcastingAbility,
      spells_known_formula: apiClass.spellsKnownFormula
    } : undefined,
  }
}
```

**Change**: Add line 148 to extract `subclasses` array from API response, defaulting to empty array if undefined.

---

## State Models

### BasicInfoStep Component State

```typescript
interface BasicInfoStepState {
  referenceData: {
    races: Race[]
    classes: Class[]              // ← Each Class now has subclasses array populated
    backgrounds: Background[]
  } | null
  loading: boolean
  error: string | null
  currentStep: SubStep            // 'name' | 'race' | 'class' | 'subclass' | etc.
}

type SubStep =
  | 'name'
  | 'race'
  | 'class'
  | 'subclass'                    // ← This step now renders correctly
  | 'background'
  | 'feat'
  | 'alignment'
  | 'complete'
```

### CharacterCreationData (Context)

```typescript
interface CharacterCreationData {
  name: string
  race: string
  raceData?: Race
  class: string
  classData?: Class                // ← Now includes subclasses array
  subclass?: string
  subclassData?: Subclass          // ← User's selected subclass
  background: string
  backgroundData?: Background
  alignment: string
  level: number
  // ... other fields
}
```

---

## Conditional Rendering Logic

### Primary Condition (BasicInfoStep.tsx:377)

```typescript
{/* Subclass Selection */}
{currentStep === 'subclass' && data.classData?.subclasses && (
  <Card className="ring-2 ring-primary/50">
    <CardHeader className="text-center">
      <CardTitle className="text-2xl">
        Choose {data.name}'s {data.class} Subclass
      </CardTitle>
      <p className="text-foreground/70">
        Your subclass specialization at level {data.level || 1}
      </p>
    </CardHeader>
    <CardContent>
      <SubclassSelector
        subclasses={data.classData.subclasses}  // ← Now defined!
        selectedSubclass={data.subclassData}
        onSubclassSelect={handleSubclassSelect}
        characterLevel={data.level || 1}
      />
      {/* Continue button logic */}
    </CardContent>
  </Card>
)}
```

**Before Fix**:
- `data.classData?.subclasses` = undefined
- Short-circuit evaluation stops at undefined
- Nothing rendered (blank screen)

**After Fix**:
- `data.classData?.subclasses` = array of 6 Subclass objects (for Cleric)
- Condition evaluates to true
- SubclassSelector rendered with Divine Domain options

---

### Recommended Enhancement (Optional)

Add fallback UI for edge case where API returns empty subclasses array:

```typescript
{/* Subclass Selection with Fallback */}
{currentStep === 'subclass' && (
  data.classData?.subclasses && data.classData.subclasses.length > 0 ? (
    <Card className="ring-2 ring-primary/50">
      {/* SubclassSelector UI */}
    </Card>
  ) : (
    <Card className="border-destructive/20 bg-destructive/5">
      <CardContent className="p-6 text-center">
        <h3 className="font-semibold text-destructive mb-2">
          Unable to Load Subclass Options
        </h3>
        <p className="text-sm text-foreground/70 mb-4">
          {data.class} subclass data is not available. You can continue without selecting a subclass for now.
        </p>
        <Button onClick={() => setCurrentStep('background')}>
          Skip to Background Selection
        </Button>
      </CardContent>
    </Card>
  )
)}
```

**Note**: This enhancement is optional since the primary fix ensures subclasses array is always populated (empty array if no subclasses defined).

---

## Testing Data

### Test Case: Cleric at Level 1

**Input**:
```typescript
characterData = {
  name: "Tiberius",
  race: "Human",
  raceData: { name: "Human", ... },
  class: "Cleric",
  classData: {
    name: "Cleric",
    subclasses: [  // ✅ Now populated after fix
      { id: 'cleric-life', name: 'Life Domain', ... },
      { id: 'cleric-war', name: 'War Domain', ... },
      { id: 'cleric-knowledge', name: 'Knowledge Domain', ... },
      { id: 'cleric-light', name: 'Light Domain', ... },
      { id: 'cleric-nature', name: 'Nature Domain', ... },
      { id: 'cleric-tempest', name: 'Tempest Domain', ... }
    ]
  },
  level: 1
}
```

**Expected Behavior**:
1. Auto-advance useEffect sets `currentStep = 'subclass'` (level 1 >= getSubclassLevel('Cleric') = 1)
2. Rendering condition `currentStep === 'subclass' && data.classData?.subclasses` evaluates to TRUE
3. SubclassSelector renders with 6 Divine Domain options
4. User selects a domain (e.g., Life Domain)
5. handleSubclassSelect updates data with `subclass: 'Life Domain'` and `subclassData: { ... }`
6. Wizard advances to background selection

---

## Summary

**Root Cause**: Missing data transformation - `subclasses` field not extracted from API response

**Fix Location**: `frontend/src/services/dnd5eApi.ts` line 148

**Fix Complexity**: Add 1 line of code: `subclasses: apiClass.subclasses || []`

**Impact**: Affects all 12 classes, but only manifests as bug for classes requiring subclass at level 1 (Cleric, Warlock)

**Testing Priority**: Cleric and Warlock at level 1, all classes at level 3+
