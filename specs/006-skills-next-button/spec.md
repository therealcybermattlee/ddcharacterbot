# Feature Specification: Skills & Proficiencies Next Button Not Working

**Feature Branch**: `006-skills-next-button`
**Created**: 2025-12-05
**Status**: Draft
**Input**: User description: "the next button in the skills and proficiency tab doesn't work"

**Related**: This issue is a duplicate or continuation of Feature 001-fix-skills-next-button. Feature 001 was specified but may not have been fully implemented or deployed, or a regression occurred.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Complete Skill Selection Without Errors (Priority: P1)

A user creating a D&D character reaches the Skills & Proficiencies step, selects all required skill proficiencies based on their class and race, and needs to proceed to the next step of character creation.

**Why this priority**: This is a critical blocker in the character creation wizard. Users cannot complete character creation if the Next button remains disabled after making all required selections. This directly impacts the core user flow and represents a complete failure point.

**Independent Test**: Can be fully tested by navigating to step 3 (Skills & Proficiencies), selecting the exact number of required skills (e.g., 4 class skills for Rogue, 2 race skills for Half-Elf), and verifying the Next button becomes enabled. Clicking Next should advance to step 4 (Equipment & Spells). Delivers immediate value by unblocking the wizard progression.

**Acceptance Scenarios**:

1. **Given** a user has created a Rogue character (requires 4 class skills), **When** they select exactly 4 skills from the available class skill list, **Then** the Next button becomes enabled within 100ms
2. **Given** a user has created a Fighter character (requires 2 class skills), **When** they select 2 skills, **Then** the Next button enables immediately
3. **Given** a user has selected 3 out of 4 required skills, **When** they click the 4th skill checkbox, **Then** the Next button transitions from disabled to enabled state
4. **Given** a user has selected all required skills and the Next button is enabled, **When** they click Next, **Then** they advance to the Equipment & Spells step without errors
5. **Given** a user has selected all required skills, **When** they refresh the page and selections are restored from localStorage, **Then** the Next button is already enabled on page load

---

### User Story 2 - Handle Multiple Skill Sources (Priority: P2)

A user with a race that provides additional skill proficiencies (e.g., Half-Elf with 2 bonus skills) needs both their class skills and race skills validated correctly before the Next button enables.

**Why this priority**: Important for complete validation logic but affects fewer characters than the basic class skill selection (only certain races provide bonus skills). Still critical for those specific race/class combinations.

**Independent Test**: Can be tested by creating a Half-Elf Rogue character (4 class skills + 2 race skills = 6 total), selecting skills from both pools, and verifying the Next button only enables when both requirements are met.

**Acceptance Scenarios**:

1. **Given** a Half-Elf Rogue (4 class + 2 race skills), **When** the user selects 4 class skills but 0 race skills, **Then** the Next button remains disabled
2. **Given** a Half-Elf Rogue, **When** the user selects 2 race skills but only 3 class skills, **Then** the Next button remains disabled
3. **Given** a Half-Elf Rogue, **When** the user selects all 4 class skills and 2 race skills, **Then** the Next button becomes enabled
4. **Given** a Human Fighter (no bonus race skills), **When** the user selects the required 2 class skills, **Then** the Next button enables without waiting for non-existent race skill selections

---

### User Story 3 - Recover from Invalid States (Priority: P3)

A user encounters API loading delays, network errors, or has corrupted localStorage data, and the system needs to validate skill selections correctly despite these edge cases.

**Why this priority**: Edge case handling that improves robustness but doesn't affect the primary happy-path flow. Important for production reliability but can be addressed after core functionality works.

**Independent Test**: Can be tested by simulating slow network (throttling), blocking API calls, clearing localStorage mid-session, or injecting invalid data, then verifying validation still works correctly with fallback mechanisms.

**Acceptance Scenarios**:

1. **Given** the class skills API is loading slowly, **When** a user makes skill selections using cached/fallback data, **Then** validation works correctly and Next button enables when requirements are met
2. **Given** localStorage contains corrupted skill data from a previous session, **When** the user loads the Skills step, **Then** the system resets to a clean state and allows new selections
3. **Given** the user switches to a different class in a previous step after saving skill selections, **When** they return to the Skills step, **Then** previous selections are cleared and new requirements are enforced

---

### Edge Cases

- What happens when a user rapidly toggles skill selections (clicking checkboxes in quick succession)?
- How does the system handle when a user deselects a required skill after the Next button is already enabled?
- What happens if the React component unmounts and remounts while selections are in progress?
- How does validation behave when switching between characters (if multiple character drafts are in localStorage)?
- What happens when API returns unexpected skill count data (e.g., null, undefined, or negative numbers)?
- How does the button state update when useEffect dependencies change but the validation callback isn't triggered?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST enable the Next button immediately (within 100ms) when all required skill proficiency selections are complete
- **FR-002**: System MUST disable the Next button when skill selections are incomplete (fewer than required selections)
- **FR-003**: Validation logic MUST execute whenever skill selections change (user adds or removes a skill)
- **FR-004**: System MUST validate both class skill requirements AND race skill requirements independently
- **FR-005**: System MUST correctly count selected skills from both class and race pools separately
- **FR-006**: System MUST handle cases where race provides zero bonus skills (e.g., Human has no bonus skills)
- **FR-007**: System MUST persist Next button enabled state when user returns to the step after moving forward or backward in the wizard
- **FR-008**: Validation MUST work correctly when skill data is loaded from localStorage (page refresh scenario)
- **FR-009**: System MUST prevent race conditions between state updates (selectedSkills) and validation callback execution
- **FR-010**: System MUST handle undefined or null API responses gracefully without breaking validation

### Key Entities

- **Class Skill Requirements**: Number of skills the user must select from their class's available skill list (typically 2-4 skills depending on class)
- **Race Skill Requirements**: Number of bonus skills provided by the character's race (typically 0-2 skills, race-dependent; e.g., Half-Elf gets 2, Human gets 0)
- **Selected Class Skills**: Array of skill IDs currently selected by the user from the class skill pool
- **Selected Race Skills**: Array of skill IDs currently selected by the user from the race skill pool (if applicable)
- **Validation State**: Boolean indicating whether all skill requirements are met (class skills complete AND race skills complete)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can progress past the Skills & Proficiencies step 100% of the time when all required selections are made
- **SC-002**: Next button enables within 100ms of the final required skill selection
- **SC-003**: Zero instances of the Next button remaining disabled when skill requirements are met
- **SC-004**: Character creation abandonment rate at the Skills step decreases by at least 30% (baseline: users stuck and abandon)
- **SC-005**: Skill selection validation works correctly in 100% of test cases across all class/race combinations (12 classes × 9 races = 108 combinations)
- **SC-006**: Next button state correctly reflects validation status when returning to the step from forward or backward navigation

## Assumptions *(if applicable)*

- The skill selection checkboxes/toggles are functioning correctly (users can click to select/deselect)
- The issue is with the validation logic or the communication between the component and the wizard's navigation state
- Feature 001 (001-fix-skills-next-button) was either not implemented, not deployed, or a regression was introduced after it was fixed
- The component uses React hooks (useState, useEffect) for managing selection state and validation
- The wizard uses a shared context (CharacterCreationContext) that provides validation callbacks
- SkillsProficienciesStep component implements the WizardStepProps interface which includes validation methods
- localStorage is available and used for persistence between sessions

## Dependencies *(if applicable)*

- React 18.x hooks (useState, useEffect, useCallback)
- CharacterCreationContext providing onValidationChange callback
- WizardStepProps interface defining the validation contract
- localStorage for persisting skill selections
- API endpoints for fetching class and race skill data
- Previous wizard steps (Basic Info, Ability Scores) must be complete before reaching Skills step

## Out of Scope *(if applicable)*

- Redesigning the skills selection UI or adding new visual indicators
- Changing which skills are available for selection (D&D 5e rules are fixed)
- Modifying the number of required skills per class or race (defined by D&D 5e rules)
- Adding skill proficiency calculations or modifiers (handled in later steps)
- Implementing skill descriptions or help text
- Changing the wizard step order or navigation flow
- Performance optimization beyond fixing the immediate button state bug
- Adding automated tests (will be covered in implementation phase)

## Investigation Notes

**Context from Feature 001**:
- Feature 001-fix-skills-next-button specified this exact issue on 2025-11-26
- Root cause likely involves:
  - useEffect dependency arrays not triggering validation when selections change
  - Race condition between state updates (selectedClassSkills, selectedRaceSkills) and validation callback
  - Validation logic not accounting for both class AND race skill requirements
  - Next button state not synchronized with validation state

**Possible Root Causes** (to be investigated during planning):
1. useEffect hook missing dependencies (selectedClassSkills, selectedRaceSkills not in dependency array)
2. onValidationChange callback not being invoked when skill state changes
3. Validation logic checking wrong state variables or using stale closures
4. localStorage restoration not triggering validation on initial load
5. Component re-renders not causing validation to re-run
6. Validation logic not handling edge cases (e.g., race with 0 bonus skills)

**Next Steps**:
1. Run `/speckit.plan` to investigate the actual code and identify the specific bug
2. Review SkillsProficienciesStep component implementation
3. Check if Feature 001 was implemented and if so, what changed to cause regression
4. Review commit history for recent changes to SkillsProficienciesStep.tsx
