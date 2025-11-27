# Feature Specification: Investigate Skills Next Button Persistent Issue

**Feature Branch**: `002-skills-next-investigation`
**Created**: 2025-11-26
**Status**: Draft
**Input**: User description: "the prior change did not fix the issue as the issue is still there"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Identify Actual Root Cause (Priority: P1)

A developer needs to identify why the Next button in the Skills & Proficiencies step still doesn't enable after making all required skill selections, despite previous investigation suggesting it was a callback identity issue.

**Why this priority**: Without understanding the true root cause, any fix will be a guess. This is blocking character creation and needs systematic investigation.

**Independent Test**: Can be fully tested by using browser DevTools to inspect the actual behavior at runtime, adding comprehensive logging, and verifying each step of the validation flow to identify where it actually breaks.

**Acceptance Scenarios**:

1. **Given** the Skills & Proficiencies step is loaded with a character class requiring skill selections, **When** the developer inspects the component state in React DevTools, **Then** they can see the current values of selectedClassSkills, selectedRaceSkills, and validation state
2. **Given** a user selects all required skills, **When** the developer checks the browser console logs, **Then** they can trace whether validation useEffect fires, what values it computes, and whether onValidationChange is called
3. **Given** the validation useEffect runs, **When** the developer inspects the callback being invoked, **Then** they can determine if the issue is callback identity, stale closure, or something else entirely
4. **Given** comprehensive logging is in place, **When** a user completes skill selection, **Then** the developer can identify the exact point where the Next button enable flow breaks

---

### User Story 2 - Test Previous Theory (Priority: P2)

A developer needs to verify whether the ref pattern solution from the previous investigation would actually fix the issue, or if the root cause was misidentified.

**Why this priority**: The previous research concluded it was a callback identity issue, but if the fix didn't work, we need to validate or invalidate that theory.

**Independent Test**: Can be tested by implementing the ref pattern fix as researched, deploying to a test environment, and verifying whether it resolves the issue or not.

**Acceptance Scenarios**:

1. **Given** the ref pattern fix is implemented exactly as specified in the previous research, **When** a user selects all required skills, **Then** if the issue persists, the previous theory is invalidated
2. **Given** the ref pattern is implemented, **When** the developer checks console logs, **Then** they can see if onValidationChangeRef.current is being called with correct values
3. **Given** the fix is deployed, **When** testing all three user stories from the previous spec (new character, localStorage, API failure), **Then** the developer can document which scenarios work and which don't

---

### User Story 3 - Explore Alternative Root Causes (Priority: P3)

A developer needs to investigate alternative explanations for why the Next button doesn't enable beyond callback identity issues.

**Why this priority**: If the callback theory is wrong, we need to explore other possibilities like wizard state management, context updates, or button rendering logic.

**Independent Test**: Can be tested by systematically ruling out each alternative cause through targeted investigation and logging.

**Acceptance Scenarios**:

1. **Given** onValidationChange is confirmed to be called with isValid=true, **When** the developer checks the CharacterCreationContext reducer, **Then** they can verify if stepValidities is being updated correctly
2. **Given** stepValidities is updated correctly in context, **When** the developer inspects CharacterWizard component state, **Then** they can see if isStepValid is reflecting the correct value
3. **Given** isStepValid is correct in CharacterWizard, **When** the developer inspects the Next button props, **Then** they can verify if the disabled prop is being set correctly
4. **Given** all state appears correct, **When** the developer checks for React rendering issues, **Then** they can identify if there's a re-render problem preventing button state updates

---

### Edge Cases

- What if the issue only occurs with specific character classes or races?
- What if the issue is intermittent and timing-dependent?
- What if there's a difference between development and production builds?
- What if the issue only occurs on certain browsers or devices?
- What if there are multiple validation paths and only one is broken?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Investigation MUST capture complete validation flow execution including all state changes, function calls, and prop updates
- **FR-002**: Investigation MUST verify whether the validation useEffect actually fires when skill selections change
- **FR-003**: Investigation MUST confirm whether onValidationChange callback is invoked with correct parameters (isValid, errors)
- **FR-004**: Investigation MUST trace whether context reducer receives and processes the SET_STEP_VALIDITY action
- **FR-005**: Investigation MUST verify whether CharacterWizard re-renders with updated isStepValid after validation
- **FR-006**: Investigation MUST check if Next button receives the correct disabled prop value
- **FR-007**: Investigation MUST test the ref pattern fix to validate or invalidate the previous theory
- **FR-008**: Investigation MUST document all findings including what works, what doesn't, and why

### Key Entities

- **Validation Execution State**: Whether validation useEffect fired, what dependencies triggered it, what values were computed
- **Callback Invocation State**: Whether onValidationChange was called, with what parameters, and what callback identity/closure it had
- **Context Update State**: Whether SET_STEP_VALIDITY action was dispatched and processed, what the updated stepValidities looks like
- **Wizard Render State**: Whether CharacterWizard re-rendered, what isStepValid value it has, what the button disabled prop is

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Developer can identify the exact point in the validation flow where the expected behavior breaks
- **SC-002**: Developer can confirm or refute the callback identity theory with concrete evidence from runtime inspection
- **SC-003**: Developer documents at least 3 alternative root cause hypotheses with evidence for or against each
- **SC-004**: Investigation produces a definitive root cause with 95% plus confidence, supported by runtime data
- **SC-005**: If ref pattern is tested, developer can measure if it changes any part of the broken flow

## Assumptions *(if applicable)*

- The issue is consistently reproducible on the production site or local development
- Browser DevTools and React DevTools are available for runtime inspection
- Console logging can be added temporarily to the codebase for investigation
- The issue manifests in a way that can be observed through logging and state inspection
- Previous research may have misidentified the root cause

## Dependencies *(if applicable)*

- Access to production site or local development environment
- Browser DevTools with Console and React DevTools installed
- Ability to modify code temporarily to add logging
- Knowledge of validation flow documented in previous investigation
- Previous research findings from feature 001

## Out of Scope *(if applicable)*

- Implementing a fix (this spec is investigation only)
- Testing across all browsers and devices (focus on primary browser first)
- Performance optimization
- UI or UX improvements beyond fixing the bug
- Adding automated tests (manual investigation focus)