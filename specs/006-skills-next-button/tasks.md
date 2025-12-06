# Implementation Tasks: Skills & Proficiencies Next Button Not Working

**Feature**: 006-skills-next-button
**Branch**: `006-skills-next-button`
**Created**: 2025-12-05
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

---

## Summary

This feature addresses a bug where the Next button in the Skills & Proficiencies wizard step remains disabled even after users complete all required skill selections. Investigation revealed the bug was **already fixed** in commit a3d3873 (2025-11-27) for SkillsProficienciesStep.tsx using a ref pattern. However, users are still experiencing the issue, likely due to:
1. Fix not deployed to production
2. Browser cache issues
3. BasicInfoStep.tsx has the same vulnerability (not yet fixed)
4. Other wizard steps may have the same issue

**Implementation Strategy**:
- **MVP (US1)**: Verify SkillsProficienciesStep deployment + apply fix to BasicInfoStep (1-2 hours)
- **Incremental (US2)**: Audit and fix remaining wizard steps (4-6 hours)
- **Polish (US3)**: Create reusable hook and comprehensive testing (2-3 hours)

**Total Tasks**: 47 tasks across 6 phases
**Parallelizable Tasks**: 12 tasks marked with [P]

---

## Task Organization

Tasks are organized by user story to enable independent implementation and testing:

- **Phase 1: Setup** (4 tasks) - Repository setup and documentation review
- **Phase 2: Foundational** (7 tasks) - Verify existing fix and deployment status
- **Phase 3: User Story 1 - MVP** (13 tasks) - Apply fix to BasicInfoStep + core testing
- **Phase 4: User Story 2** (10 tasks) - Audit and fix remaining wizard steps
- **Phase 5: User Story 3** (6 tasks) - Edge case handling and robustness
- **Phase 6: Polish** (7 tasks) - Reusable hook, cleanup, deployment

---

## Phase 1: Setup (4 tasks)

**Goal**: Prepare development environment and review documentation

- [ ] T001 Read feature specification at specs/006-skills-next-button/spec.md
- [ ] T002 Read implementation plan at specs/006-skills-next-button/plan.md
- [ ] T003 [P] Read research findings at specs/006-skills-next-button/research.md
- [ ] T004 [P] Checkout feature branch 006-skills-next-button

**Duration**: 10-15 minutes

---

## Phase 2: Foundational (7 tasks)

**Goal**: Verify existing SkillsProficienciesStep fix and deployment status

**Blocks**: All user stories depend on completing this phase

- [ ] T005 Verify commit a3d3873 is in git history using `git log --oneline | grep a3d3873`
- [ ] T006 Review SkillsProficienciesStep.tsx ref pattern implementation at frontend/src/components/wizard/steps/SkillsProficienciesStep.tsx lines 226-462
- [ ] T007 Check if fix is on main branch using `git branch --contains a3d3873`
- [ ] T008 [P] Navigate to production URL https://dnd.cyberlees.dev and test character creation
- [ ] T009 Test SkillsProficienciesStep in production: Create Cleric, select 2 skills, verify Next button enables
- [ ] T010 Document current deployment status in research.md (deployed/not deployed/regression)
- [ ] T011 If fix not deployed or regression found, identify blocker and document in tasks.md

**Duration**: 20-30 minutes

**Exit Criteria**:
- ✅ Confirmed SkillsProficienciesStep fix exists in codebase
- ✅ Deployment status documented
- ✅ Production testing complete or blockers identified

---

## Phase 3: User Story 1 - Complete Skill Selection Without Errors (Priority: P1)

**Story Goal**: Users can select all required skills and progress to the next wizard step 100% of the time

**Independent Test**: Create character → Navigate to Skills step → Select required skills → Verify Next button enables → Click Next → Advance to Equipment step

**Why MVP**: This unblocks the critical path for character creation. Without this fix, users cannot complete the wizard at all.

### Implementation Tasks (13 tasks)

- [ ] T012 [US1] Read BasicInfoStep.tsx component at frontend/src/components/wizard/steps/BasicInfoStep.tsx
- [ ] T013 [P] [US1] Identify onValidationChange in BasicInfoStep.tsx dependency array (line 116)
- [ ] T014 [US1] Add useRef import to BasicInfoStep.tsx line 1
- [ ] T015 [US1] Create onValidationChangeRef after state declarations in BasicInfoStep.tsx (after line 27)
- [ ] T016 [US1] Add useEffect to update ref when callback changes in BasicInfoStep.tsx
- [ ] T017 [US1] Replace onValidationChange(true, []) with onValidationChangeRef.current(true, []) at line 105
- [ ] T018 [US1] Replace onValidationChange(false, errors) with onValidationChangeRef.current(false, errors) at line 114
- [ ] T019 [US1] Remove onValidationChange from dependency array at line 116
- [ ] T020 [P] [US1] Run production build with `npm run build:production` from frontend directory
- [ ] T021 [US1] Verify build succeeds with no TypeScript errors
- [ ] T022 [US1] Test BasicInfoStep locally: Enter name, select race/class/background/alignment, verify Next enables
- [ ] T023 [US1] Test backward navigation: Go to Ability Scores, return to BasicInfo, verify Next still enabled
- [ ] T024 [US1] Commit changes with message "fix: BasicInfo Next button using ref pattern (Bug #006)"

**Duration**: 45-60 minutes

**Exit Criteria for US1**:
- ✅ BasicInfoStep.tsx implements ref pattern correctly
- ✅ Production build succeeds
- ✅ Next button enables when all BasicInfo fields are complete
- ✅ Next button state persists correctly during backward/forward navigation
- ✅ Code committed to feature branch

**Deliverable**: BasicInfoStep.tsx with stable validation callback (same pattern as SkillsProficienciesStep.tsx)

---

## Phase 4: User Story 2 - Handle Multiple Skill Sources (Priority: P2)

**Story Goal**: Validation correctly handles both class skills AND race skills before enabling Next button

**Independent Test**: Create Half-Elf Rogue → Navigate to Skills → Select 4 class skills + 2 race skills → Verify Next enables only when both complete

**Why This Priority**: Affects specific race/class combinations (Half-Elf, Variant Human). Still critical but fewer users than basic validation.

### Audit & Fix Remaining Steps (10 tasks)

- [ ] T025 [P] [US2] Search for onValidationChange in all wizard step files with `grep -n "onValidationChange\]" frontend/src/components/wizard/steps/*.tsx`
- [ ] T026 [P] [US2] Read AbilityScoresStep.tsx at frontend/src/components/wizard/steps/AbilityScoresStep.tsx
- [ ] T027 [US2] If AbilityScoresStep has onValidationChange in dependencies, apply ref pattern (same as T015-T019)
- [ ] T028 [P] [US2] Read EquipmentSpellsStep.tsx at frontend/src/components/wizard/steps/EquipmentSpellsStep.tsx
- [ ] T029 [US2] If EquipmentSpellsStep has onValidationChange in dependencies, apply ref pattern
- [ ] T030 [P] [US2] Read BackgroundDetailsStep.tsx at frontend/src/components/wizard/steps/BackgroundDetailsStep.tsx
- [ ] T031 [US2] If BackgroundDetailsStep has onValidationChange in dependencies, apply ref pattern
- [ ] T032 [P] [US2] Read ReviewCreateStep.tsx at frontend/src/components/wizard/steps/ReviewCreateStep.tsx
- [ ] T033 [US2] If ReviewCreateStep has onValidationChange in dependencies, apply ref pattern
- [ ] T034 [US2] Run production build and verify all fixed components build successfully

**Duration**: 1.5-2 hours (depends on how many steps need fixes)

**Exit Criteria for US2**:
- ✅ All wizard steps audited for callback stability issues
- ✅ Ref pattern applied to any vulnerable steps
- ✅ Production build succeeds
- ✅ All steps tested for Next button functionality

**Deliverable**: All wizard steps immune to unstable callback identity issues

---

## Phase 5: User Story 3 - Recover from Invalid States (Priority: P3)

**Story Goal**: System handles edge cases (API delays, corrupted localStorage, rapid toggling) gracefully

**Independent Test**: Simulate slow network → Make selections → Verify validation works with fallback data

**Why This Priority**: Edge case handling for robustness. Important for production but doesn't block primary flow.

### Testing & Validation (6 tasks)

- [ ] T035 [P] [US3] Test rapid skill toggling: Click skills quickly in succession, verify Next button updates correctly
- [ ] T036 [P] [US3] Test localStorage corruption: Inject invalid data into localStorage, verify system resets cleanly
- [ ] T037 [P] [US3] Test API delay: Throttle network, make selections, verify validation uses fallback data
- [ ] T038 [US3] Test class switching: Select skills for Rogue, go back and change to Fighter, verify selections cleared
- [ ] T039 [US3] Test component unmount: Navigate away mid-selection, return, verify state is consistent
- [ ] T040 [US3] Document all edge case test results in specs/006-skills-next-button/testing-report.md

**Duration**: 45-60 minutes

**Exit Criteria for US3**:
- ✅ All edge cases tested and documented
- ✅ System handles invalid states gracefully
- ✅ No console errors during edge case testing
- ✅ localStorage corruption doesn't break character creation

**Deliverable**: Comprehensive edge case testing report demonstrating robustness

---

## Phase 6: Polish & Cross-Cutting Concerns (7 tasks)

**Goal**: Create reusable pattern, clean up code, deploy to production

- [ ] T041 [P] Create useStableCallback hook at frontend/src/hooks/useStableCallback.ts with ref pattern logic
- [ ] T042 [P] Add JSDoc documentation to useStableCallback hook explaining unstable callback problem
- [ ] T043 Remove debug console.log statements from SkillsProficienciesStep.tsx lines 390-397, 424-448, 452-455
- [ ] T044 [P] Update MEMORY.md with Feature 006 resolution and ref pattern discovery
- [ ] T045 Run final production build with `npm run build:production` from frontend directory
- [ ] T046 Git add all changes and commit with comprehensive message linking to spec.md and research.md
- [ ] T047 Push to GitHub and create pull request with title "Fix: Skills & BasicInfo Next button validation (Feature 006)"

**Duration**: 30-45 minutes

**Exit Criteria**:
- ✅ Reusable hook created for future use
- ✅ Debug logging removed
- ✅ Code committed and pushed
- ✅ Pull request created
- ✅ Ready for code review and deployment

---

## Dependencies

### Story Completion Order

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational) ← BLOCKS all user stories
    ↓
    ├── Phase 3 (US1 - MVP) ← Can start immediately after Phase 2
    │   ↓
    ├── Phase 4 (US2) ← Can start after US1 OR in parallel if team has capacity
    │   ↓
    └── Phase 5 (US3) ← Can start after US1 OR run in parallel with US2
        ↓
Phase 6 (Polish) ← Starts after US1, US2, US3 complete
```

**MVP Path (Fastest to Value)**:
- Phase 1 → Phase 2 → Phase 3 (US1) → Phase 6 (deploy)
- **Total Time**: 2-3 hours

**Full Implementation**:
- All phases in sequence
- **Total Time**: 6-8 hours

---

## Parallel Execution Opportunities

### Phase 1 (2 parallel tasks)
- T003 and T004 can run in parallel

### Phase 2 (1 parallel task)
- T008 can run while waiting for T005-T007 git operations

### Phase 3 - US1 (2 parallel tasks)
- T013 can run in parallel with T012 (reading and analyzing)
- T020 can run in parallel with T019 (build while finalizing code)

### Phase 4 - US2 (5 parallel tasks)
- T025, T026, T028, T030, T032 can all run in parallel (reading different files)

### Phase 5 - US3 (3 parallel tasks)
- T035, T036, T037 can run in parallel (independent edge case tests)

### Phase 6 - Polish (3 parallel tasks)
- T041, T042, T044 can run in parallel (independent documentation tasks)

**Total Parallelizable**: 12 tasks across all phases

**Team Optimization**: With 2 developers, MVP time reduces to ~1.5-2 hours

---

## Testing Checklist

### Manual Testing (Required for US1 MVP)

**Test Case 1: BasicInfoStep Next Button**
```
1. Navigate to /characters/new
2. Enter character name: "Test Character"
3. Select race: Human
4. Select class: Fighter
5. Select background: Soldier
6. Select alignment: Neutral
7. VERIFY: Next button enables immediately
8. Click Next
9. VERIFY: Advances to Ability Scores step
```

**Test Case 2: Skills & Proficiencies (Verify Fix Still Works)**
```
1. Create Fighter character through BasicInfo
2. Complete Ability Scores step
3. Navigate to Skills & Proficiencies
4. Select 2 class skills (e.g., Athletics, Intimidation)
5. VERIFY: Next button enables within 100ms
6. Click Next
7. VERIFY: Advances to Equipment step
```

**Test Case 3: Backward Navigation Preservation**
```
1. Complete BasicInfo step (all fields filled)
2. Navigate to Ability Scores
3. Click Back button
4. VERIFY: BasicInfo fields are still filled
5. VERIFY: Next button is enabled (not reset to disabled)
```

### Manual Testing (Required for US2)

**Test Case 4: Multi-Source Skills (Half-Elf Rogue)**
```
1. Create Half-Elf Rogue character
2. Navigate to Skills step
3. Select 2 race skills (from Half-Elf bonus)
4. VERIFY: Next button disabled (need 4 class skills too)
5. Select 4 class skills (from Rogue)
6. VERIFY: Next button enables
7. VERIFY: Can advance to next step
```

**Test Case 5: Single-Source Skills (Human Fighter)**
```
1. Create Human Fighter character
2. Navigate to Skills step
3. Select 2 class skills
4. VERIFY: Next button enables (no race skills required)
5. Verify no waiting for non-existent race skill selections
```

### Edge Case Testing (Required for US3)

**Test Case 6: Rapid Skill Toggling**
```
1. Navigate to Skills step for Rogue (4 skills required)
2. Rapidly click 6 different skills in quick succession
3. VERIFY: Final state shows exactly 4 selected skills
4. VERIFY: Next button state matches selection state
5. VERIFY: No console errors
```

**Test Case 7: localStorage Corruption**
```
1. Open DevTools → Application → Local Storage
2. Modify character data to have invalid skill counts
3. Refresh page
4. Navigate to Skills step
5. VERIFY: System resets to clean state
6. VERIFY: Can make new selections
7. VERIFY: Next button works correctly
```

**Test Case 8: Component Unmount During Selection**
```
1. Navigate to Skills step
2. Select 2 out of 4 required skills
3. Click Back button (unmounts Skills component)
4. Click Next to return to Skills step
5. VERIFY: Partial selections preserved or cleared consistently
6. VERIFY: Validation state is consistent
```

---

## Implementation Strategy

### Minimum Viable Product (MVP) - User Story 1 Only

**Goal**: Fix the immediate blocker (BasicInfoStep Next button)

**Phases**: 1 → 2 → 3 → 6 (minimal)

**Tasks**: T001-T024, T045-T047 (27 tasks)

**Time**: 2-3 hours

**Value**: Unblocks character creation wizard, fixes critical user-reported bug

**Risk**: Low (same pattern already proven in SkillsProficienciesStep.tsx)

### Incremental Delivery - US1 + US2

**Goal**: Fix all wizard steps proactively

**Phases**: 1 → 2 → 3 → 4 → 6

**Tasks**: T001-T034, T045-T047 (37 tasks)

**Time**: 4-6 hours

**Value**: Prevents future bug reports from other wizard steps

**Risk**: Medium (more steps to test, potential for introducing regressions)

### Complete Implementation - All User Stories

**Goal**: Robust solution with comprehensive edge case handling and reusable pattern

**Phases**: 1 → 2 → 3 → 4 → 5 → 6 (all)

**Tasks**: T001-T047 (47 tasks)

**Time**: 6-8 hours

**Value**: Production-ready solution with excellent maintainability

**Risk**: Low (thorough testing at each phase)

### Recommended Approach

**Start with MVP (US1)**, deploy to production, monitor for issues, then incrementally add US2 and US3 based on priority and available time.

**Rationale**:
- US1 fixes the immediate user-reported bug
- Quick deployment validates the fix works in production
- US2 and US3 can be added later without blocking users
- Each user story is independently testable and deployable

---

## Success Metrics

### User Story 1 Success Criteria

- ✅ SC-001: Users can progress past BasicInfo step 100% of time when all fields filled
- ✅ SC-002: Next button enables within 100ms of completing final field
- ✅ SC-003: Zero instances of button staying disabled when all fields valid

### User Story 2 Success Criteria

- ✅ SC-005: Validation works in 100% of test cases across all wizard steps
- ✅ SC-006: Next button state correct during backward/forward navigation

### User Story 3 Success Criteria

- ✅ SC-004: No console errors during edge case scenarios
- ✅ SC-005: System recovers gracefully from corrupted localStorage or API failures

### Overall Feature Success

- ✅ Character creation abandonment rate decreases (SC-004 from spec.md)
- ✅ Zero user-reported bugs about Next button not enabling
- ✅ All 6 wizard steps use consistent validation pattern
- ✅ Codebase has reusable useStableCallback hook for future components

---

## Notes

- **Bug Already Fixed**: SkillsProficienciesStep.tsx was fixed in commit a3d3873 (2025-11-27)
- **Root Cause**: Unstable callback identity from parent's `currentStep` dependency
- **Solution**: Ref pattern stores callback in ref, updates on every render, calls via ref
- **No API Changes**: This is purely a frontend validation bug fix
- **No Breaking Changes**: Ref pattern is backward-compatible
- **Test Coverage**: Manual testing required initially, automated tests recommended for US3

---

**Last Updated**: 2025-12-05
**Status**: Ready for implementation
**Blocking Issues**: None (research complete, fix pattern proven)
**Next Command**: Begin with Phase 1 (Setup tasks T001-T004)
