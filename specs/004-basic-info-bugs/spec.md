# Feature Specification: Basic Information Area Bug Fixes

**Feature Branch**: `004-basic-info-bugs`
**Created**: 2025-12-04
**Status**: Investigation Complete
**Input**: User request: "could you check for any bugs in the basic information area?"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Accurate Class Information Display (Priority: P1)

As a user creating a new D&D character, I need to see accurate skill selection information for each class so that I can make informed decisions about which class to choose for my character.

**Why this priority**: Critical bug that displays mathematically nonsensical data ("Skills: 3 of 0"), severely damaging application credibility and potentially blocking users from understanding class mechanics.

**Independent Test**: Navigate to character creation wizard → select any name and race → view Bard class card → verify "Skills: X of Y" shows correct total available skills.

**Acceptance Scenarios**:

1. **Given** user is on class selection sub-step, **When** viewing Bard class card, **Then** skill count shows "Skills: 3 of [total available]" not "Skills: 3 of 0"
2. **Given** user is on class selection sub-step, **When** viewing any spellcaster class, **Then** all class metadata (hit die, skills, features) displays correctly
3. **Given** user is comparing multiple classes, **When** looking at skill counts, **Then** each class shows its correct skill choice count and total pool

---

### User Story 2 - Clear Character Preview (Priority: P1)

As a user progressing through character creation, I need the character preview sidebar to show meaningful information about my character-in-progress so that I can track what I've selected and what's still pending.

**Why this priority**: High-impact UX issue where preview shows cryptic "?" symbols instead of friendly placeholder text, making the interface appear broken.

**Independent Test**: Start character creation → enter name only → verify preview shows descriptive text like "Race: Not selected" instead of "?".

**Acceptance Scenarios**:

1. **Given** user has only entered character name, **When** viewing character preview, **Then** preview shows "Level 1 [Race: Not selected] [Class: Not selected]" or similar descriptive text
2. **Given** user has selected name and race, **When** viewing character preview, **Then** preview shows "Level 1 [RaceName] [Class: Not selected]"
3. **Given** user has completed all basic info, **When** viewing character preview, **Then** preview shows "Level X [RaceName] [ClassName]" with no placeholder symbols

---

### User Story 3 - Flexible Sub-Step Navigation (Priority: P2)

As a user filling out basic character information, I need to navigate backward through sub-steps to review or change my earlier selections without losing my progress.

**Why this priority**: Medium-impact UX issue that forces linear progression and prevents users from easily correcting mistakes.

**Independent Test**: Complete name → race → class selections → click on the "1" sub-step indicator → verify navigation returns to name sub-step with data preserved.

**Acceptance Scenarios**:

1. **Given** user is on class selection (sub-step 3), **When** clicking sub-step 1 indicator, **Then** user returns to name sub-step with previously entered name still populated
2. **Given** user is on background selection (sub-step 4), **When** clicking sub-step 2 indicator, **Then** user returns to race selection with previously selected race highlighted
3. **Given** user is on name sub-step (sub-step 1), **When** viewing sub-step indicators, **Then** incomplete future sub-steps are visually disabled and non-clickable
4. **Given** user has completed alignment sub-step, **When** clicking any prior sub-step indicator, **Then** user can navigate to that step and modify their selection

---

### User Story 4 - Smooth Name Entry Experience (Priority: P2)

As a user entering my character's name, I need the form to stay on the name sub-step while I'm typing so that I'm not interrupted by automatic navigation.

**Why this priority**: Potential UX disruption that could cause jarring experience during the first interaction with the wizard.

**Independent Test**: Click into character name field → type characters slowly → verify sub-step does not auto-advance to race selection until "Continue" button is clicked.

**Acceptance Scenarios**:

1. **Given** user is on name sub-step, **When** typing in name field, **Then** sub-step remains on name entry and does not auto-advance
2. **Given** user has entered a valid name, **When** pausing without clicking Continue, **Then** wizard stays on name sub-step
3. **Given** user has entered a name and clicked "Continue to Race Selection", **When** button is clicked, **Then** wizard advances to race sub-step

---

### User Story 5 - Progressive Validation Feedback (Priority: P3)

As a user starting character creation, I need validation errors to appear only after I interact with the form so that I'm not discouraged by seeing errors on a blank form.

**Why this priority**: Lower priority UX enhancement that improves first impression but doesn't block core functionality.

**Independent Test**: Navigate to /characters/new → check wizard state → verify no validation errors appear until user attempts to proceed or fills fields.

**Acceptance Scenarios**:

1. **Given** user first loads character creation page, **When** viewing Basic Information step, **Then** no validation error messages are displayed
2. **Given** user has not entered any data, **When** attempting to click Next button, **Then** validation errors appear highlighting required fields
3. **Given** user starts typing in name field, **When** field loses focus, **Then** validation feedback appears for that field only

---

### Edge Cases

- What happens when user clicks browser back button while on race selection sub-step? (Should preserve data and return to name sub-step)
- How does system handle selecting a class, advancing to background, then going back and changing class? (Should preserve background if compatible, clear if not)
- What happens when user has completed all sub-steps but clicks a middle sub-step indicator? (Should allow editing with data preserved)
- How does preview behave when race/class data fails to load from API? (Should show friendly error, not "?")
- What happens when user selects level 3+ character and needs subclass selection? (Sub-step indicator should dynamically add subclass step)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display accurate class metadata including correct "Skills: X of Y" format where Y is the total available skills for selection
- **FR-002**: System MUST display friendly placeholder text in character preview when race/class data is not yet selected (never raw "?" symbols)
- **FR-003**: Users MUST be able to navigate backward through completed sub-steps by clicking sub-step indicator circles
- **FR-004**: System MUST preserve all entered data when user navigates backward through sub-steps
- **FR-005**: System MUST NOT auto-advance from name sub-step to race sub-step while user is typing in name field
- **FR-006**: System MUST disable/grey out sub-step indicators for incomplete future sub-steps
- **FR-007**: System MUST only display validation errors after user interaction (field blur, attempted navigation, or form submission)
- **FR-008**: Character preview MUST update in real-time as user makes selections without requiring page refresh
- **FR-009**: System MUST handle missing/undefined race or class data gracefully in preview component
- **FR-010**: System MUST maintain current sub-step state when user navigates away and returns (via browser back/forward)

### Key Entities *(include if feature involves data)*

- **Character Creation Data**: Tracks user's selections through wizard including name, race, class, subclass, background, feat, alignment, and level
- **Sub-Step State**: Manages current position in Basic Information wizard ('name' | 'race' | 'class' | 'subclass' | 'background' | 'feat' | 'alignment' | 'complete')
- **Validation State**: Tracks form completeness and error messages for parent wizard component

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 12 D&D classes display skill counts in correct "X of Y" format with Y > 0 for classes offering skill choices
- **SC-002**: Character preview never displays "?" symbols - shows descriptive placeholder text like "Race: Not selected" when data is missing
- **SC-003**: Users can navigate backward through any completed sub-step by clicking indicator circles without data loss
- **SC-004**: Users can type in character name field without UI automatically advancing to next sub-step before clicking Continue button
- **SC-005**: Validation error messages only appear after user attempts to proceed or after field interaction, not on initial page load
- **SC-006**: 0% of users report confusion about class skill selection numbers in user testing
- **SC-007**: Character preview updates reflect user selections within 100ms of selection change
- **SC-008**: Sub-step navigation supports both forward (Continue buttons) and backward (indicator clicks) with 100% data preservation

### Technical Success Criteria

- **TSC-001**: ClassSelector component correctly calculates and displays total available skills for each class
- **TSC-002**: CharacterPreview component handles undefined raceData/classData with friendly fallback text
- **TSC-003**: Sub-step indicator renders clickable buttons for completed steps and disabled divs for incomplete steps
- **TSC-004**: Name input useEffect includes proper debouncing or explicit Continue action requirement to prevent auto-advance
- **TSC-005**: Validation useEffect checks for dirty state before calling onValidationChange with errors
- **TSC-006**: Browser back/forward navigation maintains sub-step state consistency
- **TSC-007**: All changes pass existing unit and integration tests without regression

## Bugs Identified (Detailed Analysis)

### Bug #1: Bard Class Shows "Skills: 3 of 0" (CRITICAL)
**Location**: `frontend/src/components/character-creation/ClassSelector.tsx`
**File Reference**: `frontend/src/components/wizard/steps/BasicInfoStep.tsx:342-348` (ClassSelector usage)
**Severity**: Critical
**Status**: Duplicate of Bug #003, still present in production

**Technical Details**:
- Bard class card displays "Skills: 3 of 0"
- Issue is in ClassSelector component calculation of total available skills
- Same bug likely affects other classes (Rogue shows "4 of 11" correctly, suggesting inconsistent data)
- Browser snapshot ref e222 shows "Skills: 3 of 0" for Bard

**Root Cause**: ClassSelector receives class data from D&D 5e API but is not correctly calculating the total skill pool available for Bard class selection.

---

### Bug #2: Character Preview Shows "Level 1 ? ?" (HIGH)
**Location**: `frontend/src/components/character-creation/CharacterPreview.tsx`
**File Reference**: `frontend/src/components/wizard/steps/BasicInfoStep.tsx:604-612`
**Severity**: High

**Technical Details**:
- Preview displays "Verification Test Character, Level 1 ? ?" when race/class not selected
- BasicInfoStep.tsx getCharacterConcept() returns `{ race: data.raceData, class: data.classData }` which can be undefined
- CharacterPreview component displays "?" when raceData or classData is undefined
- Browser snapshot ref e672 shows "Level 1 ? ?"

**Root Cause**: CharacterPreview component uses "?" as fallback for undefined race/class instead of descriptive placeholder text.

**Suggested Fix**: Update CharacterPreview to check for undefined and display "Race: Not selected" or similar friendly text.

---

### Bug #3: Cannot Navigate Back Through Sub-Steps (MEDIUM)
**Location**: `frontend/src/components/wizard/steps/BasicInfoStep.tsx:246-264`
**Severity**: Medium

**Technical Details**:
- Sub-step indicators render as styled divs with no click handlers
- Current implementation: `<div className={...}>{index + 1}</div>`
- No mechanism for backward navigation except browser back button
- Users must cancel and restart to change earlier selections

**Root Cause**: Sub-step indicators are purely visual, not interactive.

**Suggested Fix**:
```typescript
<button
  onClick={() => isCompleted && setCurrentStep(step as typeof currentStep)}
  disabled={!isCompleted}
  className={`w-8 h-8 rounded-full...`}
>
  {index + 1}
</button>
```

---

### Bug #4: Continue Buttons Force Linear Progression (LOW)
**Location**: Multiple locations in BasicInfoStep.tsx (lines 295, 325, 360, 397, 429, 465, 544)
**Severity**: Low (UX Enhancement)

**Technical Details**:
- After each selection (race, class, background), UI shows "Continue to X Selection" button
- No option to stay and review selection
- Forces explicit click to advance even when user is ready to proceed

**Note**: This is functional but could be enhanced with auto-advance + timeout or in-place editing.

---

### Bug #5: Level Defaults to 1 Without Visual Indication (LOW)
**Location**: `frontend/src/components/wizard/steps/BasicInfoStep.tsx:497-501`
**Severity**: Low

**Technical Details**:
- Level badge shows "1" without indicating it's changeable
- +/- buttons are visible but level itself looks like static display
- Could add placeholder or tooltip to draw attention

**Suggested Enhancement**: Add help text like "Starting level (1-20)" above the control.

---

### Bug #6: Name Input May Auto-Advance During Typing (MEDIUM)
**Location**: `frontend/src/components/wizard/steps/BasicInfoStep.tsx:68-91`
**Severity**: Medium (Requires Testing)

**Technical Details**:
- useEffect attempts to prevent auto-advance with logic on lines 71-73:
```typescript
} else if (data.name?.trim() && !data.race?.trim() && currentStep === 'name') {
  return // Stay on name step until user explicitly continues
```
- However, useEffect runs on every data change (dependency: `[data, currentStep, shouldShowFeatSelection]`)
- Unclear if this successfully prevents auto-advance while typing

**Requires**: User testing to verify behavior doesn't cause jarring step changes during typing.

---

### Bug #7: Validation Runs on Pristine Form (LOW)
**Location**: `frontend/src/components/wizard/steps/BasicInfoStep.tsx:93-117`
**Severity**: Low

**Technical Details**:
- Validation useEffect runs immediately on mount
- Calls `onValidationChange(false, errors)` even if user hasn't touched form
- May show validation errors before user interaction

**Impact**: Depends on parent wizard component's error display logic. May be intentional to disable Next button.

**Suggested Enhancement**: Track dirty state and only show errors after user interaction.

---

## Files Affected

### Primary Files (Require Changes)
1. **frontend/src/components/character-creation/CharacterPreview.tsx** (Bug #2)
2. **frontend/src/components/character-creation/ClassSelector.tsx** (Bug #1 - duplicate of Bug #003)
3. **frontend/src/components/wizard/steps/BasicInfoStep.tsx** (Bugs #3, #6, #7)

### Supporting Files (May Need Review)
- `frontend/src/types/wizard.ts` - Type definitions
- `frontend/src/types/dnd5e.ts` - D&D data types
- `frontend/src/services/dnd5eApi.ts` - API service for class data

## Implementation Priority

### Phase 1 - Critical Fixes (Must Fix)
1. Bug #1: Fix class skill count display (depends on Bug #003 fix)
2. Bug #2: Fix character preview "?" symbols

### Phase 2 - UX Improvements (Should Fix)
3. Bug #3: Add backward sub-step navigation
4. Bug #6: Verify and fix name input auto-advance behavior

### Phase 3 - Enhancements (Nice to Have)
5. Bug #7: Improve validation timing
6. Bug #4: Consider progressive enhancement for Continue buttons
7. Bug #5: Add level selection discoverability

## Testing Plan

### Unit Tests Required
- [ ] CharacterPreview with undefined race/class data
- [ ] Sub-step indicator click handlers
- [ ] Step progression logic with name input
- [ ] Validation state management

### Integration Tests Required
- [ ] Complete Basic Information flow (name → race → class → background → alignment)
- [ ] Backward navigation preserves data
- [ ] Character preview updates in real-time
- [ ] Browser back/forward button handling

### Manual Testing Checklist
- [ ] Verify all 12 classes show correct "Skills: X of Y" format
- [ ] Verify preview never shows "?" - shows friendly placeholders
- [ ] Click each sub-step indicator to navigate backward
- [ ] Type slowly in name field - confirm no auto-advance
- [ ] Load fresh page - confirm no validation errors shown initially
- [ ] Complete wizard - confirm Next button enables at correct time
- [ ] Test with different character levels (1, 3, 5, 10, 20)
- [ ] Test subclass selection for high-level characters

## Related Issues & Dependencies

- **Bug #003**: Class skill display fix (ClassSelector component) - same as Bug #1
- **Bug #022**: Skills step Next button validation - similar validation timing issues

## References

- **Production URL**: https://dnd.cyberlees.dev/characters/new
- **Component**: `frontend/src/components/wizard/steps/BasicInfoStep.tsx` (617 lines)
- **Evidence**: Browser snapshot showing Bard "Skills: 3 of 0" and preview "Level 1 ? ?"
- **Related Components**: ClassSelector, CharacterPreview, RaceSelector, BackgroundSelector
