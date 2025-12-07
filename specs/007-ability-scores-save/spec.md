# Feature Specification: Ability Scores Not Persisting on Navigation

**Feature Branch**: `007-ability-scores-save`
**Created**: 2025-12-07
**Status**: Draft
**Input**: User description: "when setting the ability scores in Ability Scores it doesn't save what was put there when you hit the next button. Could you find the problem and fix it?"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Save Ability Scores on Forward Navigation (Priority: P1)

A user creating a D&D character reaches the Ability Scores step, sets values for their six ability scores (Strength, Dexterity, Constitution, Intelligence, Wisdom, Charisma), and clicks the Next button to proceed to the next step. They expect their ability score values to be saved and available when they return to this step.

**Why this priority**: This is a critical bug that prevents users from completing character creation. If ability scores aren't saved, the character data is incomplete and invalid, blocking progression through the wizard. This is a P1 because it represents a complete failure of core functionality.

**Independent Test**: Can be fully tested by navigating to the Ability Scores step, entering values for all six ability scores, clicking Next to advance to the Skills step, then clicking Back to return to Ability Scores. If values are preserved and display correctly, the bug is fixed. Delivers immediate value by unblocking character creation workflow.

**Acceptance Scenarios**:

1. **Given** a user is on the Ability Scores step, **When** they enter values for all six ability scores and click Next, **Then** the values are persisted and the wizard advances to the next step
2. **Given** a user has completed the Ability Scores step and advanced to the Skills step, **When** they click Back to return to Ability Scores, **Then** all previously entered ability score values are displayed correctly
3. **Given** a user has entered ability scores and navigated forward, **When** they refresh the page (browser reload), **Then** the ability scores are restored from localStorage and displayed correctly
4. **Given** a user enters ability scores using the point buy method, **When** they click Next and return, **Then** both the point buy allocation and final scores are preserved
5. **Given** a user enters ability scores using standard array, **When** they click Next and return, **Then** the array assignment to each ability is preserved

---

### User Story 2 - Preserve Ability Scores Across Different Entry Methods (Priority: P2)

A user needs to switch between different ability score generation methods (point buy, standard array, manual entry, roll dice) and have their selections preserved regardless of which method they used.

**Why this priority**: Important for user flexibility and preventing data loss when users experiment with different character builds. Users often compare different ability score distributions before finalizing their choice. Less critical than P1 because the core save functionality must work first.

**Independent Test**: Can be tested by selecting point buy method, allocating points, clicking Next, returning to Ability Scores, switching to standard array, assigning values, advancing and returning again. If the most recent method's values are preserved correctly, this works independently of P1.

**Acceptance Scenarios**:

1. **Given** a user selects point buy and allocates points, **When** they click Next and return, **Then** the point buy method is still selected and allocations are preserved
2. **Given** a user selects standard array and assigns values, **When** they click Next and return, **Then** standard array is still selected with correct assignments
3. **Given** a user switches from point buy to standard array, **When** they click Next and return, **Then** the system remembers the last selected method and its values
4. **Given** a user enters manual values, **When** they click Next and return, **Then** manual entry mode is preserved with entered values

---

### User Story 3 - Apply Racial Modifiers to Saved Ability Scores (Priority: P3)

A user's ability scores should correctly reflect racial ability score bonuses (e.g., +2 Dexterity for Wood Elf, +1 to all for Human) when saved and displayed, with both base scores and modified scores preserved.

**Why this priority**: Nice-to-have enhancement that ensures accuracy of character sheet. While important for correct character stats, the core save functionality (P1) and method preservation (P2) are more critical. This can be addressed after the fundamental save bug is fixed.

**Independent Test**: Can be tested by creating a character with a race that has ability score bonuses (e.g., Dwarf with +2 Constitution), entering base ability scores, advancing to Skills step, and returning to Ability Scores. If both base scores and final scores (with racial bonuses) are displayed correctly, this works independently.

**Acceptance Scenarios**:

1. **Given** a user creates a Dwarf character (with +2 Constitution), **When** they enter a base Constitution of 14 and click Next, **Then** the system saves base score (14) and final score (16)
2. **Given** a user has saved ability scores with racial modifiers applied, **When** they return to the Ability Scores step, **Then** both base scores and modified scores are displayed correctly
3. **Given** a user changes their race in the Basic Info step after setting ability scores, **When** they return to Ability Scores, **Then** the racial modifiers are recalculated and applied to the existing base scores

---

### Edge Cases

- What happens when a user enters ability scores, navigates forward multiple steps (past Skills to Equipment), then navigates back multiple steps to Ability Scores? Are values still preserved?
- How does the system handle when a user manually edits localStorage while the wizard is open?
- What happens if the onChange callback for ability score inputs fails or throws an error?
- How does the system behave when the user rapidly clicks Next before state updates complete?
- What happens when a user enters invalid values (negative numbers, values over 20, non-numeric input)?
- How does the system handle when ability scores are set but the validation callback fails or isn't triggered?
- What happens when a user has ability scores from a previous character creation session in localStorage?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST persist all six ability score values (Strength, Dexterity, Constitution, Intelligence, Wisdom, Charisma) when the user clicks Next to navigate forward
- **FR-002**: System MUST restore ability score values from localStorage when the user returns to the Ability Scores step via Back navigation
- **FR-003**: System MUST save ability scores to the parent wizard state (CharacterCreationContext) when values change
- **FR-004**: System MUST call the onChange callback with updated character data whenever ability score values are modified
- **FR-005**: System MUST preserve the selected ability score generation method (point buy, standard array, manual entry, dice roll) across navigation
- **FR-006**: System MUST save both base ability scores and racially-modified final ability scores
- **FR-007**: System MUST persist ability scores even when the user navigates forward multiple steps before returning
- **FR-008**: System MUST validate that all ability scores are set before enabling the Next button
- **FR-009**: System MUST prevent navigation if ability score values are incomplete or invalid
- **FR-010**: System MUST handle browser refresh gracefully by restoring ability scores from localStorage

### Key Entities

- **Ability Scores**: The six core D&D ability scores with numeric values (typically 8-18 for standard methods, 3-20 range overall)
  - Strength, Dexterity, Constitution, Intelligence, Wisdom, Charisma
  - Each has a base value (user-entered) and final value (base + racial modifiers)
- **Ability Score Generation Method**: The method used to determine ability scores (point buy, standard array, manual entry, dice rolling)
  - Each method has different rules and constraints
  - Method selection affects how values are entered and validated
- **Character Data State**: The persistent character creation data stored in localStorage and context
  - Contains ability scores as a nested object or individual fields
  - Synced between component state, context, and localStorage

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can navigate forward from Ability Scores step and return to find all entered values preserved 100% of the time
- **SC-002**: Ability scores persist correctly across browser refresh/reload with zero data loss
- **SC-003**: Character creation abandonment rate at the Ability Scores step decreases by at least 40% (baseline: users losing data and abandoning)
- **SC-004**: All ability score generation methods (point buy, standard array, manual, dice) preserve data correctly in 100% of test cases
- **SC-005**: Ability scores update and save within 100ms of user input to prevent race conditions
- **SC-006**: Racial ability score modifiers are correctly applied and persisted in 100% of test cases across all 9 playable races

## Assumptions *(if applicable)*

- The Ability Scores step component implements the WizardStepProps interface (similar to BasicInfoStep and SkillsProficienciesStep)
- The parent CharacterWizard component provides onChange and onValidationChange callbacks
- Character data is stored in CharacterCreationContext and persisted to localStorage
- The bug may be related to the same callback identity issue fixed in Features 004 and 006 (ref pattern for unstable callbacks)
- Ability scores are stored in the character data as either individual fields (stats.strength, stats.dexterity, etc.) or as a nested object
- The component uses React hooks (useState, useEffect) for managing ability score state

## Dependencies *(if applicable)*

- CharacterCreationContext for shared state management
- localStorage for persistence between sessions
- WizardStepProps interface for component contract
- React 18.x hooks (useState, useEffect, possibly useRef if callback identity issue)
- Parent wizard's onChange callback for updating character data
- D&D 5e rules for ability score generation methods and racial modifiers

## Out of Scope *(if applicable)*

- Implementing new ability score generation methods (only fixing save functionality for existing methods)
- Redesigning the Ability Scores UI or improving the user experience beyond fixing the save bug
- Adding ability score rolling animations or visual enhancements
- Calculating derived stats (ability modifiers, saving throws) beyond racial bonuses
- Implementing ability score increases from levels or feats (handled in later character progression)
- Adding validation for optimal or recommended ability score distributions for specific classes
- Performance optimization beyond fixing the immediate save bug
- Automated testing (will be covered in implementation phase)
