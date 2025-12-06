# Research Document: Cleric Selection Blank Screen Bug

**Feature**: 005-cleric-selection-bug
**Date**: 2025-12-05
**Status**: Complete

---

## Research Task 1: Root Cause Verification

### Question
Is the bug caused by missing API data, timing issue, or conditional rendering logic?

### Investigation

**1. D&D 5e API Response Structure**

Examined `/Users/therealtwobowshow/CodeStuff/ddcharacterbot/api/src/routes/classes.ts` (lines 60-83):

```typescript
function transformClass(dbClass: any): CharacterClass {
  const className = dbClass.name;
  const features = getClassFeatures(className, 20);
  const subclasses = getSubclasses(className); // ← Line 63: Calls getSubclasses

  return {
    id: dbClass.id,
    name: className,
    hitDie: dbClass.hit_die,
    // ... other properties
    features: features,
    subclasses: subclasses  // ← Line 81: Includes subclasses array
  };
}
```

**Verified**: The API **DOES** return a `subclasses` array for every class via the `transformClass()` function. The `getSubclasses()` function is called for each class name (line 63) and the result is included in the API response (line 81).

Examined `/Users/therealtwobowshow/CodeStuff/ddcharacterbot/api/src/lib/subclasses.ts` (lines 4623-4626):

```typescript
export function getSubclasses(className: string): Subclass[] {
  const classKey = className.toLowerCase();
  return SUBCLASSES[classKey] || [];
}
```

**Verified**: Cleric has 5 subclasses defined in the `SUBCLASSES` object starting at line 1311:
- Life Domain (id: 'cleric-life')
- War Domain (id: 'cleric-war')
- Knowledge Domain (id: 'cleric-knowledge')
- Light Domain (id: 'cleric-light')
- Nature Domain (id: 'cleric-nature')
- Tempest Domain (id: 'cleric-tempest')

**Conclusion**: The API correctly returns subclass data for Cleric.

---

**2. Frontend Data Transformation**

Examined `/Users/therealtwobowshow/CodeStuff/ddcharacterbot/frontend/src/services/dnd5eApi.ts` (lines 102-162):

```typescript
function transformClassData(apiClass: any): Class {
  return {
    id: apiClass.id || '',
    name: apiClass.name || '',
    // ... other properties
    class_features: CLASS_FEATURES[apiClass.id?.toLowerCase()] || [],
    // ← NOTE: No 'subclasses' property is extracted from API response!
    spellcasting: apiClass.spellcastingAbility ? { ... } : undefined,
  }
}
```

**CRITICAL FINDING**: The `transformClassData()` function **DOES NOT** extract the `subclasses` array from the API response. The API returns `subclasses` in the response (verified above), but the frontend transformation function ignores it.

**Missing line**: The transformation should include:
```typescript
subclasses: apiClass.subclasses || []
```

Examined `/Users/therealtwobowshow/CodeStuff/ddcharacterbot/frontend/src/types/dnd5e.ts` (lines 85-108):

```typescript
export interface Class {
  id: string
  name: string
  // ... other properties
  class_features: ClassFeature[]
  subclasses?: Subclass[]  // ← Line 101: Interface DOES support subclasses
  spellcasting?: SpellcastingInfo
  // ...
}
```

**Verified**: The `Class` interface includes an optional `subclasses?: Subclass[]` property (line 101), but the transformation function doesn't populate it.

---

**3. Timing Analysis**

Examined `/Users/therealtwobowshow/CodeStuff/ddcharacterbot/frontend/src/components/wizard/steps/BasicInfoStep.tsx`:

**Class Selection Handler (lines 135-143)**:
```typescript
const handleClassSelect = (cls: Class) => {
  const newData = {
    ...data,
    class: cls.name,      // Sets data.class = "Cleric"
    classData: cls        // Sets data.classData to the Class object
  }
  onChange(newData)
  // Let the parent wizard handle validation timing
}
```

**Auto-Advance useEffect (lines 68-91)**:
```typescript
useEffect(() => {
  // ... checks
  } else if (data.class && data.level && data.level >= getSubclassLevel(data.class) && !data.subclass?.trim()) {
    setCurrentStep('subclass')  // ← Line 80: Advances to 'subclass'
  }
  // ...
}, [data, currentStep, shouldShowFeatSelection])
```

**Rendering Logic (lines 377-404)**:
```typescript
{/* Subclass Selection */}
{currentStep === 'subclass' && data.classData?.subclasses && (  // ← Line 377
  <Card className="ring-2 ring-primary/50">
    <CardHeader className="text-center">
      <CardTitle className="text-2xl">Choose {data.name}'s {data.class} Subclass</CardTitle>
    </CardHeader>
    <CardContent>
      <SubclassSelector
        subclasses={data.classData.subclasses}  // ← Line 387
        selectedSubclass={data.subclassData}
        onSubclassSelect={handleSubclassSelect}
        characterLevel={data.level || 1}
      />
      {/* ... */}
    </CardContent>
  </Card>
)}
```

**Analysis**:
1. When `handleClassSelect` is called, it sets `data.classData = cls` (the Class object)
2. The Class object has `subclasses: undefined` because `transformClassData()` doesn't extract it
3. The useEffect runs and sets `currentStep = 'subclass'` (condition at line 78-80)
4. React re-renders, but line 377 checks `currentStep === 'subclass' && data.classData?.subclasses`
5. Since `data.classData.subclasses` is undefined, the condition fails → **blank screen**

**No timing issue detected**: The state updates happen synchronously. The problem is that `data.classData.subclasses` is always undefined due to the missing transformation.

---

### Findings

**ROOT CAUSE IDENTIFIED**: The bug is caused by **missing data transformation** in the frontend, NOT a timing issue or API failure.

**Specific Issue**: The `transformClassData()` function in `/Users/therealtwobowshow/CodeStuff/ddcharacterbot/frontend/src/services/dnd5eApi.ts` (lines 102-162) does **not** extract the `subclasses` array from the API response, even though:
1. The API correctly returns `subclasses` (verified in backend code)
2. The `Class` TypeScript interface supports `subclasses?: Subclass[]` (line 101 of dnd5e.ts)
3. The rendering logic expects `data.classData.subclasses` to be populated (line 377 of BasicInfoStep.tsx)

**Data Flow**:
1. API returns: `{ id: 'cleric', name: 'Cleric', ..., subclasses: [<5 domains>] }`
2. Frontend transforms: `{ id: 'cleric', name: 'Cleric', ..., subclasses: undefined }` ← **BUG HERE**
3. User selects Cleric → `data.classData.subclasses` is undefined
4. useEffect advances to `currentStep = 'subclass'`
5. Rendering checks `data.classData?.subclasses` → **false** → blank screen

### Decision

**Primary Fix**: Add `subclasses` extraction to the `transformClassData()` function:

**File**: `/Users/therealtwobowshow/CodeStuff/ddcharacterbot/frontend/src/services/dnd5eApi.ts`
**Line**: 102-162 (inside `transformClassData` function)
**Change**: Add line after line 148:
```typescript
subclasses: apiClass.subclasses || [],
```

**Secondary Fix**: Add defensive rendering to handle edge case where subclasses array is missing (for robustness):

**File**: `/Users/therealtwobowshow/CodeStuff/ddcharacterbot/frontend/src/components/wizard/steps/BasicInfoStep.tsx`
**Line**: 377-404
**Change**: Replace short-circuit evaluation with ternary operator:
```typescript
{currentStep === 'subclass' && (
  data.classData?.subclasses && data.classData.subclasses.length > 0 ? (
    <Card className="ring-2 ring-primary/50">
      {/* SubclassSelector UI */}
    </Card>
  ) : (
    <Card className="border-destructive/20 bg-destructive/5">
      <CardContent className="p-6 text-center">
        <h3 className="font-semibold text-destructive mb-2">Unable to Load Subclass Options</h3>
        <p className="text-sm text-foreground/70 mb-4">
          No subclasses available for {data.class}. Continuing to background selection.
        </p>
        <Button onClick={() => setCurrentStep('background')}>
          Continue to Background
        </Button>
      </CardContent>
    </Card>
  )
)}
```

---

## Research Task 2: Best Practices for Conditional Rendering

### Question
What is the React best practice for handling undefined data in conditional rendering?

### Investigation

**Pattern 1: Short-Circuit Evaluation (Current Code)**

```typescript
{condition && <Component />}
```

**Behavior**:
- If `condition` is falsy (undefined, null, false, 0, ""), React renders nothing
- Results in blank screen with no user feedback
- **Problem**: Provides no indication of why content is missing

**Use Case**: Appropriate when the absence of content is intentional and expected (e.g., hiding optional UI elements)

---

**Pattern 2: Ternary Operator with Fallback (Recommended Fix)**

```typescript
{condition ? <Component /> : <FallbackComponent />}
```

**Behavior**:
- If `condition` is truthy, render `<Component />`
- If `condition` is falsy, render `<FallbackComponent />` (e.g., error message, loading state)
- **Advantage**: Always renders something, preventing blank screens

**Use Case**: Required when data availability is uncertain or may fail (API calls, external dependencies)

---

**Pattern 3: Error Boundaries**

```typescript
<ErrorBoundary fallback={<ErrorUI />}>
  <Component data={data} />
</ErrorBoundary>
```

**Behavior**:
- Catches runtime JavaScript errors in child components
- Renders fallback UI when errors occur
- **Limitation**: Only catches errors during rendering, not async failures or logic bugs

**Use Case**: Preventing entire app crashes from component-level errors

---

**Pattern 4: Defensive Programming with Null Checks**

```typescript
{data?.classData?.subclasses && data.classData.subclasses.length > 0 ? (
  <SubclassSelector subclasses={data.classData.subclasses} />
) : (
  <NoDataMessage />
)}
```

**Behavior**:
- Uses optional chaining (`?.`) to safely access nested properties
- Explicitly checks for non-empty arrays (`.length > 0`)
- **Advantage**: Prevents both undefined errors and empty array edge cases

**Use Case**: Working with complex nested data structures from APIs

---

### Decision

**Recommended Pattern**: **Ternary operator with fallback UI** (Pattern 2) combined with **defensive null checks** (Pattern 4).

**Rationale**:
1. **User Experience**: Always renders feedback (loading, error, or content) instead of blank screen
2. **Debugging**: Fallback UI can include diagnostic information (e.g., "No subclasses available for Cleric")
3. **Robustness**: Handles multiple failure modes (undefined data, empty arrays, API failures)
4. **React Best Practice**: Aligns with React documentation on conditional rendering for error states

**Implementation**:
```typescript
{currentStep === 'subclass' && (
  data.classData?.subclasses && data.classData.subclasses.length > 0 ? (
    <SubclassSelector subclasses={data.classData.subclasses} />
  ) : (
    <Card className="border-destructive/20 bg-destructive/5">
      <CardContent className="p-6 text-center">
        <h3 className="font-semibold text-destructive mb-2">Unable to Load Subclass Options</h3>
        <p className="text-sm text-foreground/70 mb-4">
          {data.classData?.subclasses === undefined
            ? `No subclass data available for ${data.class}.`
            : `${data.class} has no subclass options available.`}
        </p>
        <Button onClick={() => setCurrentStep('background')}>
          Continue to Background Selection
        </Button>
      </CardContent>
    </Card>
  )
)}
```

**Fail Silently vs Show Error UI**:
- **Show Error UI**: When user action is blocked (character creation cannot proceed)
- **Fail Silently**: When feature is optional (e.g., loading profile pictures)
- **This Bug**: Requires error UI because subclass selection blocks character creation flow

---

## Research Task 3: D&D 5e Subclass Rules

### Question
Which classes gain subclass at level 1 vs later levels?

### Investigation

Examined `/Users/therealtwobowshow/CodeStuff/ddcharacterbot/frontend/src/types/wizard.ts` (lines 5-10):

```typescript
export function getSubclassLevel(className: string): number {
  const lowerClass = className.toLowerCase()
  if (lowerClass === 'cleric' || lowerClass === 'warlock') return 1
  if (lowerClass === 'wizard') return 2
  return 3 // All other classes get subclass at level 3
}
```

**Analysis**: The function defines subclass acquisition levels for all D&D 5e classes:
- **Level 1**: Cleric, Warlock
- **Level 2**: Wizard
- **Level 3**: All others (Barbarian, Bard, Druid, Fighter, Monk, Paladin, Ranger, Rogue, Sorcerer)

**Cross-Referenced with D&D 5e PHB Rules**:
- Cleric: Gains Divine Domain at 1st level (PHB p. 58)
- Warlock: Gains Otherworldly Patron at 1st level (PHB p. 107)
- Wizard: Gains Arcane Tradition at 2nd level (PHB p. 115)
- Most martial/hybrid classes: Gain subclass at 3rd level (Fighter → Martial Archetype, Rogue → Roguish Archetype, etc.)

**Note**: Sorcerer was moved to level 3 in the codebase (differs from 5e 2014 rules where Sorcerous Origin is at level 1). This may be using 2024 D&D rules or a custom variant.

### Findings

**Subclass Level Table** (12 Core D&D 5e Classes):

| Class       | Subclass Level | Subclass Name          | Examples                                |
|-------------|----------------|------------------------|-----------------------------------------|
| Barbarian   | 3              | Primal Path            | Path of the Berserker, Totem Warrior    |
| Bard        | 3              | College                | College of Lore, College of Valor       |
| **Cleric**  | **1**          | **Divine Domain**      | **Life, Light, War, Knowledge, Nature** |
| Druid       | 3              | Circle                 | Circle of the Land, Circle of the Moon  |
| Fighter     | 3              | Martial Archetype      | Champion, Battle Master, Eldritch Knight|
| Monk        | 3              | Monastic Tradition     | Way of the Open Hand, Way of Shadow     |
| Paladin     | 3              | Sacred Oath            | Oath of Devotion, Oath of Vengeance     |
| Ranger      | 3              | Ranger Archetype       | Hunter, Beast Master                    |
| Rogue       | 3              | Roguish Archetype      | Thief, Assassin, Arcane Trickster       |
| Sorcerer    | 3              | Sorcerous Origin       | Draconic Bloodline, Wild Magic          |
| **Warlock** | **1**          | **Otherworldly Patron**| **The Fiend, The Archfey, The Great Old One** |
| Wizard      | 2              | Arcane Tradition       | School of Evocation, School of Abjuration|

**Key Insight**: Only **2 classes** (Cleric and Warlock) require subclass selection at level 1, making them edge cases that trigger the bug more frequently than other classes.

**Testing Priority**:
1. **Highest Priority**: Cleric (level 1), Warlock (level 1)
2. **Medium Priority**: Wizard (level 2)
3. **Lower Priority**: All other classes (level 3+)

---

## Research Task 4: Testing Strategy

### Question
How to systematically test all 12 classes to ensure consistency?

### Investigation

**Manual Testing Approach**:

Given the bug is caused by missing data transformation (Research Task 1), the testing strategy should focus on:
1. Verifying the fix correctly populates `subclasses` array for all classes
2. Ensuring no blank screens occur for any class at any level
3. Testing edge cases (level 1, level changes, backward navigation)

**Test Matrix Design**:

| Test Case ID | Class       | Level | Expected Sub-Step     | Expected Subclass Count | Pass/Fail |
|--------------|-------------|-------|-----------------------|-------------------------|-----------|
| TC-001       | Cleric      | 1     | Subclass Selection    | 5+ (Divine Domains)     | ☐         |
| TC-002       | Cleric      | 3     | Subclass Selection    | 5+                      | ☐         |
| TC-003       | Warlock     | 1     | Subclass Selection    | 3+ (Patrons)            | ☐         |
| TC-004       | Wizard      | 1     | Background Selection  | N/A (subclass at lvl 2) | ☐         |
| TC-005       | Wizard      | 2     | Subclass Selection    | 8+ (Schools of Magic)   | ☐         |
| TC-006       | Fighter     | 1     | Background Selection  | N/A (subclass at lvl 3) | ☐         |
| TC-007       | Fighter     | 3     | Subclass Selection    | 3+ (Archetypes)         | ☐         |
| TC-008       | Barbarian   | 3     | Subclass Selection    | 2+ (Primal Paths)       | ☐         |
| TC-009       | Bard        | 3     | Subclass Selection    | 2+ (Colleges)           | ☐         |
| TC-010       | Druid       | 3     | Subclass Selection    | 2+ (Circles)            | ☐         |
| TC-011       | Monk        | 3     | Subclass Selection    | 3+ (Traditions)         | ☐         |
| TC-012       | Paladin     | 3     | Subclass Selection    | 3+ (Sacred Oaths)       | ☐         |
| TC-013       | Ranger      | 3     | Subclass Selection    | 2+ (Archetypes)         | ☐         |
| TC-014       | Rogue       | 3     | Subclass Selection    | 3+ (Archetypes)         | ☐         |
| TC-015       | Sorcerer    | 3     | Subclass Selection    | 2+ (Origins)            | ☐         |

**Edge Case Tests**:

| Test Case ID | Scenario                              | Steps                                                       | Expected Behavior            | Pass/Fail |
|--------------|---------------------------------------|-------------------------------------------------------------|------------------------------|-----------|
| TC-016       | Level change after class selection    | 1. Select Cleric at level 1<br>2. Go back<br>3. Change level to 3<br>4. Re-select Cleric | Subclass selection displays  | ☐         |
| TC-017       | Backward navigation recovery          | 1. Select Cleric (causes bug)<br>2. Go back<br>3. Select Fighter | Fighter displays correctly   | ☐         |
| TC-018       | API failure simulation                | 1. Block API call<br>2. Select any class                    | Error UI displays, not blank | ☐         |

---

**Playwright Automation Approach**:

```typescript
// Proposed test structure (future work)
describe('Character Class Selection', () => {
  const classes = [
    { name: 'Cleric', subclassLevel: 1, expectedCount: 5 },
    { name: 'Warlock', subclassLevel: 1, expectedCount: 3 },
    { name: 'Wizard', subclassLevel: 2, expectedCount: 8 },
    { name: 'Fighter', subclassLevel: 3, expectedCount: 3 },
    // ... all 12 classes
  ];

  classes.forEach(({ name, subclassLevel, expectedCount }) => {
    test(`${name} at level ${subclassLevel} shows subclass selection`, async ({ page }) => {
      await page.goto('/characters/new');
      await page.fill('input[placeholder*="name"]', 'Test Character');
      await page.click('text=Human'); // Select any race
      await page.click(`text=${name}`); // Select class

      // Set level if needed
      if (subclassLevel > 1) {
        await page.click('button:has-text("+")'); // Increase level
      }

      // Verify subclass selection displays
      const subclassCard = page.locator('text=Choose.*Subclass');
      await expect(subclassCard).toBeVisible({ timeout: 1000 });

      // Verify subclass options are present
      const subclassOptions = page.locator('[data-testid="subclass-option"]');
      await expect(subclassOptions).toHaveCount({ min: expectedCount });
    });
  });
});
```

---

### Decision

**Testing Strategy**: Hybrid approach combining manual testing (immediate) and Playwright automation (future).

**Phase 1: Manual Testing (Pre-Deployment)**

**Checklist Format**:
```markdown
### Manual Testing Checklist

**Instructions**:
1. Navigate to https://dnd.cyberlees.dev/characters/new (or local dev environment)
2. For each test case:
   - Enter character name: "Test [ClassName]"
   - Select race: "Human"
   - Select class as specified
   - Set level as specified (use +/- buttons)
   - Verify expected sub-step displays
   - Mark Pass (✓) or Fail (✗) with notes

**Priority 1: Level 1 Subclass Classes (MUST PASS)**
- [ ] Cleric (Level 1) → Subclass Selection → 5+ Divine Domains visible
- [ ] Warlock (Level 1) → Subclass Selection → 3+ Patrons visible

**Priority 2: Level 2 Subclass Classes**
- [ ] Wizard (Level 1) → Background Selection (no subclass yet)
- [ ] Wizard (Level 2) → Subclass Selection → 8+ Schools visible

**Priority 3: Level 3 Subclass Classes (Sample)**
- [ ] Fighter (Level 1) → Background Selection
- [ ] Fighter (Level 3) → Subclass Selection → 3+ Archetypes visible
- [ ] Rogue (Level 3) → Subclass Selection → 3+ Archetypes visible

**Edge Cases (MUST PASS)**
- [ ] Cleric → Go Back → Select Fighter → Correct UI displays
- [ ] Level change after selection → Re-evaluate subclass requirement
- [ ] No blank screens observed in any test case

**Pass Criteria**: 100% of Priority 1 tests pass, 80%+ of Priority 2/3 pass
```

**Phase 2: Playwright Automation (Post-Deployment)**

**Scope**:
- Full regression suite for all 12 classes at levels 1, 2, 3, 5
- Edge case testing (navigation, level changes, API failures)
- Performance testing (sub-step transition < 100ms)

**Timeline**: Implement after Feature 005 deployment as part of Feature 004 comprehensive testing

---

## Summary of Findings

### Critical Discovery
The bug is caused by a **missing data transformation** in the frontend, not an API or timing issue. The `transformClassData()` function fails to extract the `subclasses` array from the API response, resulting in `data.classData.subclasses = undefined` for all classes.

### Recommended Fixes

**1. Primary Fix** (REQUIRED):
- **File**: `/Users/therealtwobowshow/CodeStuff/ddcharacterbot/frontend/src/services/dnd5eApi.ts`
- **Line**: 148 (inside `transformClassData` function)
- **Action**: Add `subclasses: apiClass.subclasses || [],`

**2. Secondary Fix** (DEFENSIVE):
- **File**: `/Users/therealtwobowshow/CodeStuff/ddcharacterbot/frontend/src/components/wizard/steps/BasicInfoStep.tsx`
- **Line**: 377-404 (subclass rendering)
- **Action**: Replace short-circuit with ternary operator + fallback error UI

**3. Testing**:
- Manual checklist: 15 test cases (12 classes + 3 edge cases)
- Focus on Cleric and Warlock (level 1 subclass classes)
- 100% pass rate required for deployment

### React Best Practices Applied
- Ternary operator with fallback UI (prevents blank screens)
- Defensive null checks with optional chaining (`?.`)
- Explicit length checks for arrays (`.length > 0`)
- User-facing error messages with actionable buttons

### D&D 5e Rules Verified
- 2 classes gain subclass at level 1 (Cleric, Warlock)
- 1 class gains subclass at level 2 (Wizard)
- 9 classes gain subclass at level 3 (all others)

---

**Research Complete**: All 4 tasks resolved with actionable findings and code-level recommendations.
