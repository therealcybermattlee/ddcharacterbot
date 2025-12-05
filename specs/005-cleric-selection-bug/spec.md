# Feature Specification: Cleric Selection Blank Screen Bug

**Feature Branch**: `005-cleric-selection-bug`
**Created**: 2025-12-05
**Status**: Draft
**Input**: User description: "Whenever choosing cleric it seems to break for some reason. Could you look around to figure out what could be causing the issues?"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Cleric Class Selection Completes Successfully (Priority: P1)

When a user selects the Cleric class during character creation, the wizard should advance to the appropriate next sub-step and render the expected UI content, allowing the user to continue the character creation flow without encountering blank screens or broken states.

**Why this priority**: This is a critical bug that completely blocks users from creating Cleric characters, affecting approximately 8.3% of potential character builds (1 of 12 core D&D 5e classes). The blank screen provides no feedback or error message, leaving users confused and unable to proceed.

**Independent Test**: Can be fully tested by navigating to the character wizard, selecting Cleric as the class, and verifying that the wizard advances to the correct sub-step (subclass or background) with visible UI content. Delivers immediate value by unblocking Cleric character creation.

**Acceptance Scenarios**:

1. **Given** a user is on the class selection sub-step with a level 1 character, **When** the user clicks the Cleric class card, **Then** the wizard should advance to the background selection sub-step (since Cleric subclass is chosen at level 1 but may not be required immediately) and display the background selection UI
2. **Given** a user is on the class selection sub-step with a level 3+ character, **When** the user clicks the Cleric class card, **Then** the wizard should advance to the subclass selection sub-step and display the Divine Domain selection UI with Cleric-specific subclasses
3. **Given** a user has selected Cleric and the wizard advances, **When** the next sub-step renders, **Then** the sub-step indicator (numbered circles) should correctly highlight the active sub-step and the main content area should display the appropriate card/form UI (not a blank screen)

---

### User Story 2 - All Classes Handle Sub-Step Progression Consistently (Priority: P2)

All character classes should follow consistent sub-step progression logic, advancing users through the wizard in a predictable order (class → subclass if applicable → background → feat if applicable → alignment) without blank screens or inconsistent behavior.

**Why this priority**: While Cleric is the reported issue, the underlying problem may affect other classes. Ensuring consistent behavior across all 12 classes prevents similar bugs and provides a uniform user experience. This is P2 because it's preventative rather than addressing the immediate blocking issue.

**Independent Test**: Can be tested by creating characters with each of the 12 core classes (Barbarian, Bard, Cleric, Druid, Fighter, Monk, Paladin, Ranger, Rogue, Sorcerer, Warlock, Wizard) at various levels (1, 3, 5) and verifying that each class advances through the correct sub-steps without blank screens.

**Acceptance Scenarios**:

1. **Given** a user selects any class at level 1, **When** the class selection is complete, **Then** the wizard should advance to either the subclass selection (if the class gains subclass at level 1) or background selection (if subclass is gained later), never showing a blank screen
2. **Given** a user selects any class at level 3 or higher, **When** the class selection is complete, **Then** the wizard should advance to subclass selection if the class's `getSubclassLevel()` value is ≤ character level, and the subclass selector should display class-appropriate subclasses
3. **Given** a user completes subclass selection (or skips it if not applicable), **When** the wizard advances, **Then** the background selection UI should display without blank screens or missing content

---

### User Story 3 - Clear Error Messages for Sub-Step Failures (Priority: P3)

When the wizard encounters an error loading sub-step content (missing data, API failure, etc.), users should see clear, actionable error messages instead of blank screens, allowing them to understand the problem and take corrective action.

**Why this priority**: This is an enhancement that improves error handling and user experience. While important for polish and debugging, it's P3 because the primary goal is to fix the Cleric bug (P1) and ensure consistency (P2). Error messaging is valuable but doesn't directly unblock character creation if the underlying logic works correctly.

**Independent Test**: Can be tested by simulating failure conditions (e.g., API returning no subclasses for a class, missing class data) and verifying that the wizard displays a user-friendly error card with a "Retry" or "Go Back" button instead of a blank screen.

**Acceptance Scenarios**:

1. **Given** the wizard attempts to load subclass data for a class, **When** the API returns no subclasses or fails, **Then** the wizard should display an error card with message "Unable to load subclass options" and a "Go Back" button to return to class selection
2. **Given** the wizard is on any sub-step, **When** a rendering error occurs (missing component, undefined data), **Then** the wizard should display a fallback error UI with the current sub-step name and option to restart or go back, not a blank screen
3. **Given** the wizard encounters an error, **When** the error message is displayed, **Then** the error details should be logged to the console for debugging purposes with sufficient context (class name, level, sub-step, data state)

---

### Edge Cases

- **Cleric at Level 1**: Clerics gain their Divine Domain subclass at level 1 in D&D 5e 2014 rules. The wizard's `getSubclassLevel('Cleric')` should return 1, triggering subclass selection immediately after class selection.
- **Missing Subclass Data**: If the API returns a Cleric class object without the `subclasses` array populated, the SubclassSelector may fail to render. The wizard should detect this and either skip to background selection or show an error.
- **Level Changes After Class Selection**: If a user goes back and changes their level from 1 to 3 after selecting Cleric, the wizard should re-evaluate whether to show subclass selection without breaking the flow.
- **Multiple Class Changes**: If a user selects Cleric (causing potential blank screen), then goes back and selects Fighter, the wizard should recover and display the correct sub-steps for Fighter without persisting the Cleric error state.
- **Browser Console Shows No Errors**: The screenshot investigation showed console logs but no JavaScript errors, suggesting the issue is logic-based (incorrect sub-step progression) rather than a runtime exception.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST correctly determine the next sub-step after Cleric class selection based on character level and `getSubclassLevel('Cleric')` value
- **FR-002**: System MUST render the appropriate UI component (SubclassSelector, BackgroundSelector, etc.) for the determined sub-step, never leaving the content area blank
- **FR-003**: System MUST verify that `data.classData.subclasses` array exists and is non-empty before attempting to render SubclassSelector
- **FR-004**: System MUST handle missing or undefined subclass data gracefully by either skipping to the next sub-step or displaying an error message
- **FR-005**: System MUST maintain consistent sub-step progression logic across all 12 core D&D 5e classes (Barbarian, Bard, Cleric, Druid, Fighter, Monk, Paladin, Ranger, Rogue, Sorcerer, Warlock, Wizard)
- **FR-006**: System MUST update the sub-step indicator UI (numbered circles) to reflect the correct active sub-step when advancing from class selection
- **FR-007**: System MUST log sub-step progression events to the console with sufficient detail (current step, next step, reason for progression) to aid debugging
- **FR-008**: System MUST provide a fallback error UI when a sub-step fails to render, including the option to go back to the previous sub-step

### Key Entities

- **SubStep**: String literal type representing wizard sub-steps ('name' | 'race' | 'class' | 'subclass' | 'background' | 'feat' | 'alignment' | 'complete')
- **Class**: D&D 5e class data including name, subclasses array, and metadata (returned by fetchAllReferenceData())
- **Subclass**: Divine Domain options for Cleric (Life, Light, Knowledge, Nature, Tempest, Trickery, War) or equivalent for other classes
- **ClassData**: The stored class object in `data.classData` that includes the `subclasses` property

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can select Cleric class and successfully advance to the next sub-step without encountering a blank screen (100% success rate in manual testing across levels 1, 3, 5, 10, 20)
- **SC-002**: All 12 core D&D 5e classes exhibit consistent sub-step progression behavior, with 0 blank screens and correct UI rendering for each class at levels 1, 3, and 5
- **SC-003**: Sub-step progression completes within 100ms of class selection (consistent with Feature 004 performance requirements)
- **SC-004**: When subclass data is missing or undefined, the wizard either skips to background selection or displays a clear error message within 200ms, never showing a blank screen for more than 100ms
- **SC-005**: Console logs provide sufficient debugging information to diagnose sub-step progression issues, including current step, next step, character level, and class name for each progression event

## Investigation Findings

### Bug Reproduction

**Environment**: Production site at https://dnd.cyberlees.dev/characters/new

**Steps to Reproduce**:
1. Navigate to character creation wizard
2. Enter character name (e.g., "Tiberius")
3. Select any race (e.g., "Human")
4. Click the "Cleric" class card (displays "Skills: 2 of 5")
5. Observe wizard behavior

**Expected Behavior**: Wizard advances to subclass selection showing Divine Domain options

**Actual Behavior**:
- Wizard advances to sub-step 4 (sub-step indicator shows blue circle on position 4)
- Main content area is completely blank (no card, no UI elements)
- Character preview shows "Verification... Level 1 ? ?" (related to Bug #2 from Feature 004)
- Console logs show: `UPDATE_STEP_DATA: {stepId: basic-info, newSkills: undefined}`
- No JavaScript errors or exceptions thrown

**Screenshot**: `.playwright-mcp/cleric-bug-blank-screen.png`

### Root Cause Analysis

**Hypothesis 1: Incorrect Sub-Step Progression Logic (LIKELY)**

The auto-advance `useEffect` in BasicInfoStep.tsx:68-91 determines the next sub-step based on data completion. The logic is:

```typescript
useEffect(() => {
  if (!data.name?.trim()) {
    setCurrentStep('name')
  } else if (data.name?.trim() && !data.race?.trim() && currentStep === 'name') {
    return  // Stay on name step
  } else if (!data.race?.trim()) {
    setCurrentStep('race')
  } else if (!data.class?.trim()) {
    setCurrentStep('class')
  } else if (data.class && data.level && data.level >= getSubclassLevel(data.class) && !data.subclass?.trim()) {
    setCurrentStep('subclass')  // Line 80 - Sets to 'subclass'
  } else if (!data.background?.trim()) {
    setCurrentStep('background')
  } else if (shouldShowFeatSelection && !data.selectedFeat) {
    setCurrentStep('feat')
  } else if (!data.alignment) {
    setCurrentStep('alignment')
  } else {
    setCurrentStep('complete')
  }
}, [data, currentStep, shouldShowFeatSelection])
```

**Analysis**:
- When Cleric is selected, `data.class = "Cleric"` and `data.level = 1`
- `getSubclassLevel("Cleric")` returns 1 (Clerics gain Divine Domain at level 1)
- Condition `data.level >= getSubclassLevel(data.class)` evaluates to true (1 >= 1)
- `data.subclass?.trim()` is falsy (subclass not yet selected)
- `setCurrentStep('subclass')` is called, advancing to the 'subclass' sub-step

**The Issue**: The wizard correctly advances to `currentStep = 'subclass'`, but when we look at the rendering logic:

```typescript
{/* Subclass Selection */}
{currentStep === 'subclass' && data.classData?.subclasses && (
  <Card className="ring-2 ring-primary/50">
    {/* SubclassSelector UI */}
  </Card>
)}
```

**Line 377**: The condition `currentStep === 'subclass' && data.classData?.subclasses` must both be true to render the UI.

**Suspected Problem**: `data.classData` is set when `handleClassSelect` is called:

```typescript
const handleClassSelect = (cls: Class) => {
  const newData = {
    ...data,
    class: cls.name,      // Sets data.class to "Cleric"
    classData: cls        // Sets data.classData to the Class object
  }
  onChange(newData)
}
```

**Potential Issue**: Either:
1. `data.classData` is undefined (not being set correctly)
2. `data.classData.subclasses` is undefined (API returned Class object without subclasses)
3. Timing issue: `useEffect` for sub-step progression runs before `data.classData` is updated in state

**Hypothesis 2: Missing Cleric Subclass Data (POSSIBLE)**

The D&D 5e API may not be returning the `subclasses` array for Cleric, or it may be empty. This would cause the condition `data.classData?.subclasses` to be falsy, preventing the SubclassSelector from rendering.

**Hypothesis 3: Race Condition in State Updates (POSSIBLE)**

When `handleClassSelect` calls `onChange(newData)`, the parent component updates the context, which triggers a re-render of BasicInfoStep. The `useEffect` for sub-step progression runs, but `data` may still contain the old state (without `classData`), causing the check `data.classData?.subclasses` to fail.

### Recommended Fix

**Primary Fix**: Add null-safety and fallback logic to the subclass rendering condition:

```typescript
{/* Subclass Selection */}
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

**Secondary Fix**: Add defensive logging to diagnose the issue:

```typescript
const handleClassSelect = (cls: Class) => {
  console.log('[BasicInfoStep] Class selected:', cls.name, 'Subclasses:', cls.subclasses?.length || 0)
  const newData = {
    ...data,
    class: cls.name,
    classData: cls
  }
  onChange(newData)
}
```

**Tertiary Fix**: Ensure the auto-advance `useEffect` checks for `data.classData` before advancing to 'subclass':

```typescript
} else if (
  data.class &&
  data.classData &&  // Add this check
  data.level &&
  data.level >= getSubclassLevel(data.class) &&
  !data.subclass?.trim()
) {
  setCurrentStep('subclass')
}
```

### Relationship to Feature 004

This bug is **related but independent** from Feature 004 (Basic Information Bug Fixes):

- **Feature 004 Bug #6**: Addresses the problematic auto-advance logic in lines 68-91 by removing it entirely and requiring explicit user clicks to advance between sub-steps
- **Feature 005**: Addresses a specific blank screen bug in the subclass sub-step rendering logic

**Recommendation**:
1. Fix Feature 005 first as a **hotfix** to immediately unblock Cleric character creation
2. Then implement Feature 004 Bug #6, which will remove the auto-advance logic entirely and prevent similar issues in the future

**Conflict Risk**: Low. Feature 005 fixes the subclass rendering condition (lines 377-404), while Feature 004 Bug #6 modifies the auto-advance useEffect (lines 68-91). These changes are in different parts of the file and should not conflict.

---

## Technical Context

**File**: `frontend/src/components/wizard/steps/BasicInfoStep.tsx`

**Lines of Interest**:
- **68-91**: Auto-advance `useEffect` (determines next sub-step)
- **135-143**: `handleClassSelect` (sets `data.classData`)
- **377-404**: Subclass Selection rendering (conditionally renders SubclassSelector)
- **386-390**: SubclassSelector component (displays Divine Domain options)

**Dependencies**:
- D&D 5e API (`fetchAllReferenceData()`) must return Class objects with populated `subclasses` array
- `getSubclassLevel(className)` utility function must return correct values for each class
- SubclassSelector component must handle empty or undefined subclass arrays gracefully

**Related Components**:
- `SubclassSelector.tsx`: Renders the subclass selection UI
- `CharacterPreview.tsx`: Shows "?" symbols (Bug #2 from Feature 004)

---

## Testing Strategy

### Manual Testing Checklist

**Test Case 1: Cleric at Level 1**
- [ ] Navigate to character creation wizard
- [ ] Enter name, select race
- [ ] Select Cleric class
- [ ] Verify wizard advances to subclass selection or background selection
- [ ] Verify no blank screen is displayed
- [ ] Verify sub-step indicator correctly highlights active step
- [ ] Verify content area shows UI card (SubclassSelector or BackgroundSelector)

**Test Case 2: Cleric at Level 5**
- [ ] Navigate to character creation wizard
- [ ] Enter name, select race
- [ ] Select Cleric class
- [ ] Increase level to 5
- [ ] Verify subclass selection displays Divine Domain options
- [ ] Select a Divine Domain
- [ ] Verify wizard advances to background selection

**Test Case 3: All Classes at Level 1**
- [ ] Test each class: Barbarian, Bard, Cleric, Druid, Fighter, Monk, Paladin, Ranger, Rogue, Sorcerer, Warlock, Wizard
- [ ] Verify each class advances correctly without blank screens
- [ ] Document which classes show subclass selection at level 1 vs. skipping to background

**Test Case 4: Backward Navigation**
- [ ] Select Cleric and advance past class selection
- [ ] Click back to return to class selection
- [ ] Select Fighter
- [ ] Verify wizard recovers and shows correct sub-steps for Fighter

### Automated Testing (Future)

**Unit Test**:
```typescript
test('Cleric class selection advances to subclass step at level 1', () => {
  // Render BasicInfoStep with level 1 character
  // Simulate Cleric class selection
  // Verify currentStep becomes 'subclass'
  // Verify SubclassSelector renders
})

test('Subclass step shows error when subclass data is missing', () => {
  // Render BasicInfoStep with Cleric selected
  // Mock data.classData.subclasses as undefined
  // Verify error card is rendered with "Skip to Background" button
})
```

**Integration Test**:
```typescript
test('Full Cleric character creation flow completes successfully', () => {
  // Navigate to wizard
  // Enter name, select race, select Cleric
  // Verify subclass selection displays
  // Select Divine Domain
  // Verify background selection displays
  // Complete character creation
})
```

---

## Change Log

**Version 1.0 (2025-12-05)**
- Initial specification for Cleric selection bug
- Documented investigation findings and root cause analysis
- Defined 3 user stories (P1: Fix Cleric, P2: Consistency, P3: Error messages)
- Established success criteria and testing strategy
