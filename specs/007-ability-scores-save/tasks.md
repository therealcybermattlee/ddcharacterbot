# Tasks: Ability Scores Not Persisting on Navigation

**Feature**: 007-ability-scores-save
**Input**: Design documents from `/specs/007-ability-scores-save/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Tests**: Manual testing only (automated tests out of scope for this bug fix)

**Organization**: Tasks are organized by user story to enable independent testing of each fix aspect.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `frontend/src/components/wizard/steps/AbilityScoresStep.tsx` (primary file)
- **Context**: `frontend/src/contexts/CharacterCreationContext.tsx`
- **Parent**: `frontend/src/components/wizard/CharacterWizard.tsx`

---

## Phase 1: Setup (No Prerequisites)

**Purpose**: Verify environment and prepare for implementation

- [ ] T001 Verify current git branch is 007-ability-scores-save
- [ ] T002 Ensure frontend dev dependencies are installed (npm install in frontend/)
- [ ] T003 Read quickstart.md implementation guide for detailed change locations

---

## Phase 2: Foundational (Reference Analysis)

**Purpose**: Understand the working ref pattern from previously fixed components

**⚠️ CRITICAL**: Complete this before making any changes to AbilityScoresStep

- [ ] T004 Read SkillsProficienciesStep.tsx lines 226-462 to understand ref pattern implementation
- [ ] T005 Read BasicInfoStep.tsx lines 30-150 to see ref pattern for validation callbacks
- [ ] T006 Compare CharacterWizard.tsx handleValidationChange (lines 146-164) to confirm unstable callback source

**Checkpoint**: Ref pattern understood - ready to apply fix to AbilityScoresStep

---

## Phase 3: User Story 1 - Save Ability Scores on Forward Navigation (Priority: P1) 🎯 MVP

**Goal**: Fix the primary bug - Next button must enable when ability scores are complete, allowing forward navigation with data persistence

**Independent Test**:
1. Navigate to Ability Scores step
2. Complete all six ability scores using any method (Standard Array recommended)
3. Verify Next button enables
4. Click Next to advance to Skills step
5. Click Back to return to Ability Scores
6. Verify all values are preserved

### Implementation for User Story 1

- [ ] T007 [US1] Add useRef to imports in frontend/src/components/wizard/steps/AbilityScoresStep.tsx:1
- [ ] T008 [US1] Create onValidationChangeRef with update effect after line 49 in AbilityScoresStep.tsx
- [ ] T009 [US1] Create onChangeRef with update effect after onValidationChangeRef in AbilityScoresStep.tsx
- [ ] T010 [US1] Update onChange call to use onChangeRef.current at line 79 in handleStateChange
- [ ] T011 [US1] Update onValidationChange call to use onValidationChangeRef.current at line 134 in handleStateChange
- [ ] T012 [US1] Update onValidationChange call to use onValidationChangeRef.current at line 192 in mount effect (saved data path)
- [ ] T013 [US1] Update onValidationChange call to use onValidationChangeRef.current at line 195 in mount effect (no data path)
- [ ] T014 [US1] Add dependency array comment at line 197 explaining ref pattern safety
- [ ] T015 [US1] Build frontend to verify TypeScript compilation (npm run build in frontend/)
- [ ] T016 [US1] Manual Test: Basic save and navigation (Standard Array method)
- [ ] T017 [US1] Manual Test: Next button validation (Point Buy incomplete → complete)
- [ ] T018 [US1] Manual Test: Browser console check for errors

**Checkpoint**: User Story 1 complete - Next button enables correctly, data persists on navigation

---

## Phase 4: User Story 2 - Preserve Ability Scores Across Different Entry Methods (Priority: P2)

**Goal**: Ensure all ability score generation methods (Point Buy, Standard Array, Manual, Rolled) preserve data correctly when navigating

**Independent Test**:
1. Select Point Buy method, allocate 27 points
2. Navigate forward and back
3. Verify Point Buy still selected with correct allocations
4. Switch to Standard Array, assign values
5. Navigate forward and back
6. Verify Standard Array selections preserved

### Implementation for User Story 2

**Note**: Implementation completed in Phase 3 (ref pattern fixes all methods)

- [ ] T019 [US2] Manual Test: Point Buy method preservation (27 points allocation)
- [ ] T020 [US2] Manual Test: Standard Array method preservation (verify assignments)
- [ ] T021 [US2] Manual Test: Manual entry method preservation
- [ ] T022 [US2] Manual Test: Method switching (Point Buy → Standard Array → verify last method)

**Checkpoint**: User Story 2 complete - All generation methods preserve data correctly

---

## Phase 5: User Story 3 - Apply Racial Modifiers to Saved Ability Scores (Priority: P3)

**Goal**: Verify racial ability score bonuses are correctly applied and persist when navigating

**Independent Test**:
1. Create Dwarf character (+2 Constitution)
2. Navigate to Ability Scores
3. Set Constitution base = 13
4. Verify display shows final = 15 (13 + 2)
5. Navigate forward and back
6. Verify both base (13) and final (15) values preserved

### Implementation for User Story 3

**Note**: Implementation completed in Phase 3 (ref pattern fixes validation for all data including racial modifiers)

- [ ] T023 [US3] Manual Test: Racial modifiers with Dwarf (+2 Constitution)
- [ ] T024 [US3] Manual Test: Racial modifiers preserved across navigation
- [ ] T025 [US3] Manual Test: Multi-step navigation (Ability Scores → Skills → Equipment → Back to Ability Scores)

**Checkpoint**: User Story 3 complete - Racial modifiers correctly applied and persisted

---

## Phase 6: Polish & Validation

**Purpose**: Final verification and deployment

- [ ] T026 Verify all 7 test scenarios from quickstart.md pass
- [ ] T027 Check browser console for any React warnings or errors
- [ ] T028 Verify success criteria SC-001: 100% data persistence on navigation
- [ ] T029 Verify success criteria SC-004: All methods preserve data correctly
- [ ] T030 Verify success criteria SC-005: Updates complete within 100ms
- [ ] T031 Git commit with message: "fix: Apply ref pattern to AbilityScoresStep to fix validation state (Feature #007)"
- [ ] T032 Deploy to production (git push origin 007-ability-scores-save)
- [ ] T033 Test on production site (https://dnd.cyberlees.dev)
- [ ] T034 Update MEMORY.md with feature completion details

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - understand ref pattern first
- **User Story 1 (Phase 3)**: Depends on Foundational - core fix implementation
- **User Story 2 (Phase 4)**: Depends on US1 completion - tests method preservation
- **User Story 3 (Phase 5)**: Depends on US1 completion - tests racial modifier persistence
- **Polish (Phase 6)**: Depends on all user stories complete - final validation and deployment

### User Story Dependencies

- **User Story 1 (P1)**: Must complete first - core bug fix
  - All code changes happen here (T007-T015)
  - Initial testing happens here (T016-T018)
- **User Story 2 (P2)**: Depends on US1 implementation being complete
  - Only testing tasks (no new implementation needed)
  - Tests different generation methods
- **User Story 3 (P3)**: Depends on US1 implementation being complete
  - Only testing tasks (no new implementation needed)
  - Tests racial modifier edge cases

### Within Each User Story

**User Story 1 (Implementation + Testing)**:
1. T007-T009: Setup refs (sequential - same file section)
2. T010-T013: Update callback calls (can review in parallel, but edit sequentially)
3. T014: Add comment
4. T015: Build verification
5. T016-T018: Manual testing (sequential)

**User Story 2 & 3 (Testing Only)**:
- All tasks are manual testing scenarios
- Can be executed in any order within the phase
- Should verify fix works for all use cases

### Parallel Opportunities

**Limited parallelism** for this bug fix:
- **Phase 1**: T001-T003 can be done in parallel (checking different things)
- **Phase 2**: T004-T006 should be done sequentially (building understanding)
- **Phase 3**: T007-T014 must be sequential (editing same file)
- **Phase 3**: T016-T018 should be sequential (logical test flow)
- **Phase 4**: T019-T022 can be done in any order (independent test scenarios)
- **Phase 5**: T023-T025 can be done in any order (independent test scenarios)
- **Phase 6**: T026-T030 should be sequential, T031-T034 must be sequential

**Reason for limited parallelism**: Single file fix (AbilityScoresStep.tsx) with interdependent changes.

---

## Parallel Example: User Story 1

```bash
# Phase 3 tasks MUST be sequential (same file edits):
# 1. Read quickstart.md for exact change locations
# 2. Edit line 1 (add useRef import)
# 3. Edit after line 49 (add ref setup)
# 4. Edit line 79 (onChange call)
# 5. Edit line 134 (onValidationChange call)
# 6. Edit line 192 (onValidationChange call)
# 7. Edit line 195 (onValidationChange call)
# 8. Edit line 197 (add comment)
# 9. Build and verify
# 10. Test scenarios

# Testing can follow any order after build succeeds
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (verify environment)
2. Complete Phase 2: Foundational (understand ref pattern)
3. Complete Phase 3: User Story 1 (apply fix + core testing)
4. **STOP and VALIDATE**: Test basic save/navigation + Next button validation
5. If passing, proceed to US2/US3 testing or deploy immediately

**Rationale**: User Story 1 fixes the core bug. US2 and US3 are verification of edge cases that should automatically work once the ref pattern is applied.

### Incremental Delivery

1. **Setup + Foundational** → Understand the fix
2. **Add User Story 1** → Core bug fixed, basic testing complete → **Can deploy here as MVP**
3. **Add User Story 2** → Method preservation verified → Deploy/Demo
4. **Add User Story 3** → Racial modifier persistence verified → Deploy/Demo
5. **Polish** → All success criteria validated → Final deployment

### Single Developer Strategy

Most efficient approach for this bug fix:

1. Phase 1: Setup (5 minutes)
2. Phase 2: Foundational (10 minutes - read reference components)
3. Phase 3: User Story 1 (15 minutes implementation + 15 minutes testing)
4. Phase 4: User Story 2 (10 minutes testing)
5. Phase 5: User Story 3 (10 minutes testing)
6. Phase 6: Polish (10 minutes validation + deployment)

**Total Time**: ~75 minutes (matches quickstart.md estimate of 30 min implementation + 20 min testing + 25 min for additional edge case testing and deployment)

---

## Task Count Summary

**Total Tasks**: 34

**By Phase**:
- Phase 1 (Setup): 3 tasks
- Phase 2 (Foundational): 3 tasks
- Phase 3 (US1 - P1): 12 tasks (8 implementation + 4 testing)
- Phase 4 (US2 - P2): 4 tasks (testing only)
- Phase 5 (US3 - P3): 3 tasks (testing only)
- Phase 6 (Polish): 9 tasks (validation + deployment)

**By Type**:
- Setup/Reading: 6 tasks (T001-T006)
- Code Implementation: 8 tasks (T007-T014)
- Build Verification: 1 task (T015)
- Manual Testing: 12 tasks (T016-T025, T026-T027)
- Success Criteria Validation: 3 tasks (T028-T030)
- Git/Deployment: 4 tasks (T031-T034)

**Parallel Opportunities**:
- Phase 1: 3 tasks can be done in any order
- Phase 4: 4 test tasks can be done in any order
- Phase 5: 3 test tasks can be done in any order
- Most tasks are sequential due to single-file fix

**Independent Test Criteria**:
- US1: Basic navigation + Next button validation
- US2: All generation methods preserve data
- US3: Racial modifiers persist correctly

**MVP Scope**: User Story 1 only (Tasks T001-T018)
- Fixes core bug (Next button enables, data persists)
- Sufficient for production deployment
- US2 and US3 are edge case validation

---

## Notes

- [P] tasks = different files or independent operations, no dependencies
- [Story] label maps task to specific user story for traceability (US1, US2, US3)
- Each user story tests an independent aspect of the fix
- All code changes happen in User Story 1 (single component fix)
- User Stories 2 and 3 are testing-only phases
- Manual testing required (automated tests out of scope)
- Quickstart.md contains detailed implementation steps with exact line numbers
- Reference components (SkillsProficienciesStep, BasicInfoStep) show proven working pattern
- Commit after completing User Story 1 implementation before testing
- Can stop after User Story 1 for MVP deployment

---

**Last Updated**: 2025-12-07
**Status**: Ready for implementation
**Implementation Path**: Follow quickstart.md for step-by-step code changes
