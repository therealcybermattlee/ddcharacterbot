# Tasks: Basic Information Bug Fixes

**Feature**: 004-basic-info-bugs
**Branch**: `004-basic-info-bugs`
**Input**: Design documents from `/specs/004-basic-info-bugs/`

**Organization**: Tasks are grouped by user story (bug priority) to enable independent implementation and testing.

**Tests**: Unit tests and E2E tests are included per the specification requirements.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story/bug this task belongs to (US1=Bug#2, US2=Bug#3, US3=Bug#6, US4=Bug#7)
- Include exact file paths in descriptions

## Path Conventions

This is a **web application** with frontend (React) and backend (Cloudflare Workers):
- **Frontend**: `frontend/src/`
- **Tests**: `frontend/tests/`
- **No backend changes** required for this feature

---

## Phase 1: Setup (No Changes Needed)

**Purpose**: Project already initialized - no setup tasks required

**Note**: This is a bug fix feature in an existing codebase. The project structure, dependencies, and development environment are already in place.

---

## Phase 2: Foundational (Prerequisites)

**Purpose**: Read and understand existing codebase before making changes

**⚠️ CRITICAL**: Must understand current implementation before fixing bugs

- [ ] T001 Read CharacterPreview component in frontend/src/components/character-creation/CharacterPreview.tsx
- [ ] T002 Read BasicInfoStep component in frontend/src/components/wizard/steps/BasicInfoStep.tsx
- [ ] T003 Read ClassSelector component in frontend/src/components/character-creation/ClassSelector.tsx
- [ ] T004 [P] Read WizardStepProps interface in frontend/src/types/wizard.ts
- [ ] T005 [P] Read D&D 5e types in frontend/src/types/dnd5e.ts
- [ ] T006 Navigate to https://dnd.cyberlees.dev/characters/new and verify current bugs exist

**Checkpoint**: Codebase understood, bugs verified in production - user story implementation can begin

---

## Phase 3: User Story 1 - Clear Character Preview (Priority: P1) 🎯 MVP QUICKWIN

**Goal**: Fix character preview to show "Not selected yet" instead of "?" symbols when race/class is undefined

**Why This First**: High-impact, quick fix (1-2 hours), immediately improves UX, fully independent

**Independent Test**: Navigate to /characters/new → enter name only → verify preview shows "Not selected yet" not "?"

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T007 [P] [US1] Create CharacterPreview unit test file at frontend/tests/components/CharacterPreview.test.tsx
- [ ] T008 [P] [US1] Write test "displays placeholder when race is undefined" in CharacterPreview.test.tsx
- [ ] T009 [P] [US1] Write test "displays placeholder when class is undefined" in CharacterPreview.test.tsx
- [ ] T010 [P] [US1] Write test "never displays question mark symbols" in CharacterPreview.test.tsx
- [ ] T011 [P] [US1] Write test "placeholder has proper ARIA labels" in CharacterPreview.test.tsx
- [ ] T012 [US1] Run tests and verify they FAIL (npm run test CharacterPreview.test.tsx)

### Implementation for User Story 1

- [ ] T013 [US1] Locate race/class display logic in frontend/src/components/character-creation/CharacterPreview.tsx (around line 50-100)
- [ ] T014 [US1] Replace `{race ? race.name : '?'}` with placeholder pattern in CharacterPreview.tsx
- [ ] T015 [US1] Replace `{class ? class.name : '?'}` with placeholder pattern in CharacterPreview.tsx
- [ ] T016 [US1] Add ARIA labels to placeholder spans in CharacterPreview.tsx
- [ ] T017 [US1] Apply muted styling (text-muted-foreground, italic) to placeholders in CharacterPreview.tsx
- [ ] T018 [US1] Run unit tests and verify they PASS (npm run test CharacterPreview.test.tsx)
- [ ] T019 [US1] Manual test: Navigate to /characters/new, enter name, verify "Not selected yet" appears in preview
- [ ] T020 [US1] Build frontend and verify no TypeScript errors (npm run build)

**Checkpoint**: Bug #2 fixed - character preview shows friendly placeholders, never "?" symbols

**Estimated Time**: 1-2 hours

---

## Phase 4: User Story 2 - Flexible Sub-Step Navigation (Priority: P2)

**Goal**: Enable users to click sub-step indicators to navigate backward through completed steps without losing data

**Why Second**: Medium effort (2-3 hours), high UX value, independent of other bugs

**Independent Test**: Complete name → race → class → click sub-step 1 indicator → verify navigation to name with data preserved

### Tests for User Story 2

- [ ] T021 [P] [US2] Create BasicInfoStep unit test file at frontend/tests/components/BasicInfoStep.test.tsx
- [ ] T022 [P] [US2] Write test "sub-step indicators are clickable for completed steps" in BasicInfoStep.test.tsx
- [ ] T023 [P] [US2] Write test "sub-step indicators are disabled for incomplete steps" in BasicInfoStep.test.tsx
- [ ] T024 [P] [US2] Write test "backward navigation preserves all data" in BasicInfoStep.test.tsx
- [ ] T025 [P] [US2] Write test "sub-step indicators have proper ARIA attributes" in BasicInfoStep.test.tsx
- [ ] T026 [US2] Run tests and verify they FAIL (npm run test BasicInfoStep.test.tsx)

### Implementation for User Story 2

- [ ] T027 [US2] Add completedSteps state (Set<SubStep>) in frontend/src/components/wizard/steps/BasicInfoStep.tsx
- [ ] T028 [US2] Create handleSubStepClick function in BasicInfoStep.tsx
- [ ] T029 [US2] Add useEffect to track completed steps when data changes in BasicInfoStep.tsx
- [ ] T030 [US2] Locate sub-step indicator rendering (around line 246-264) in BasicInfoStep.tsx
- [ ] T031 [US2] Replace `<div>` with `<button>` for sub-step indicators in BasicInfoStep.tsx
- [ ] T032 [US2] Add onClick handler calling handleSubStepClick in BasicInfoStep.tsx
- [ ] T033 [US2] Add aria-current="step" for active step in BasicInfoStep.tsx
- [ ] T034 [US2] Add aria-disabled for incomplete steps (NOT native disabled) in BasicInfoStep.tsx
- [ ] T035 [US2] Add aria-label with step description in BasicInfoStep.tsx
- [ ] T036 [US2] Update CSS classes for clickable vs disabled states in BasicInfoStep.tsx
- [ ] T037 [US2] Run unit tests and verify they PASS (npm run test BasicInfoStep.test.tsx)
- [ ] T038 [US2] Manual test: Navigate through wizard, click backward, verify data preserved
- [ ] T039 [US2] Test keyboard navigation (Tab, Enter) for accessibility
- [ ] T040 [US2] Build frontend and verify no errors (npm run build)

**Checkpoint**: Bug #3 fixed - users can navigate backward through sub-steps, data preserved

**Estimated Time**: 2-3 hours

---

## Phase 5: User Story 3 - Smooth Name Entry Experience (Priority: P2)

**Goal**: Remove automatic step progression during typing to prevent jarring UX

**Why Third**: Quick fix (1 hour), prevents UX friction, independent of other bugs

**Independent Test**: Type slowly in name field → verify no auto-advance until Continue button clicked

### Tests for User Story 3

- [ ] T041 [P] [US3] Write test "does not auto-advance while typing in name field" in BasicInfoStep.test.tsx
- [ ] T042 [P] [US3] Write test "Continue button advances to next step" in BasicInfoStep.test.tsx
- [ ] T043 [US3] Run tests and verify they FAIL (npm run test BasicInfoStep.test.tsx)

### Implementation for User Story 3

- [ ] T044 [US3] Locate and DELETE auto-advance useEffect (lines 68-91) in frontend/src/components/wizard/steps/BasicInfoStep.tsx
- [ ] T045 [US3] Verify Continue button onClick handlers still exist in BasicInfoStep.tsx
- [ ] T046 [US3] Remove auto-advance dependencies from any remaining useEffects in BasicInfoStep.tsx
- [ ] T047 [US3] Run unit tests and verify they PASS (npm run test BasicInfoStep.test.tsx)
- [ ] T048 [US3] Manual test: Type slowly "G-a-n-d-a-l-f", verify UI stays on name step
- [ ] T049 [US3] Manual test: Click Continue button, verify navigation to race step
- [ ] T050 [US3] Build frontend and verify no errors (npm run build)

**Checkpoint**: Bug #6 fixed - no auto-advance during typing, explicit Continue required

**Estimated Time**: 1 hour

---

## Phase 6: User Story 4 - Progressive Validation Feedback (Priority: P3)

**Goal**: Show validation errors only after user interaction, not on pristine form

**Why Fourth**: Medium effort (2-3 hours), UX enhancement, independent of other bugs

**Independent Test**: Load /characters/new → verify no errors shown → click Next → verify errors appear

### Tests for User Story 4

- [ ] T051 [P] [US4] Write test "no validation errors shown on initial mount" in BasicInfoStep.test.tsx
- [ ] T052 [P] [US4] Write test "validation errors appear after Next attempt" in BasicInfoStep.test.tsx
- [ ] T053 [P] [US4] Write test "validation errors removed when data valid" in BasicInfoStep.test.tsx
- [ ] T054 [US4] Run tests and verify they FAIL (npm run test BasicInfoStep.test.tsx)

### Implementation for User Story 4

- [ ] T055 [US4] Add touchedFields state (Set<string>) in frontend/src/components/wizard/steps/BasicInfoStep.tsx
- [ ] T056 [US4] Add hasAttemptedNext state (boolean) in BasicInfoStep.tsx
- [ ] T057 [US4] Create onValidationChangeRef using useRef pattern (like Bug #23 fix) in BasicInfoStep.tsx
- [ ] T058 [US4] Add useEffect to update onValidationChangeRef when callback changes in BasicInfoStep.tsx
- [ ] T059 [US4] Modify validation useEffect (lines 93-117) to use onValidationChangeRef.current in BasicInfoStep.tsx
- [ ] T060 [US4] Update validation logic to always run but control error display in BasicInfoStep.tsx
- [ ] T061 [US4] Run unit tests and verify they PASS (npm run test BasicInfoStep.test.tsx)
- [ ] T062 [US4] Manual test: Load page, verify no errors shown initially
- [ ] T063 [US4] Manual test: Click Next with empty form, verify errors appear
- [ ] T064 [US4] Build frontend and verify no errors (npm run build)

**Checkpoint**: Bug #7 fixed - validation timing improved, errors only after interaction

**Estimated Time**: 2-3 hours

---

## Phase 7: Integration Testing

**Purpose**: Verify all bug fixes work together without regressions

- [ ] T065 [P] Create E2E test file at frontend/tests/e2e/basic-info-bugs.spec.ts
- [ ] T066 [P] Write E2E test "complete basic information wizard flow" in basic-info-bugs.spec.ts
- [ ] T067 [P] Write E2E test "backward navigation preserves data" in basic-info-bugs.spec.ts
- [ ] T068 [P] Write E2E test "character preview updates correctly" in basic-info-bugs.spec.ts
- [ ] T069 Run E2E tests with Playwright (npx playwright test basic-info-bugs.spec.ts)
- [ ] T070 Run full test suite and verify no regressions (npm run test)
- [ ] T071 Run full build and verify production-ready (npm run build)

**Checkpoint**: All bugs fixed, tests passing, no regressions

---

## Phase 8: Manual Testing & Validation

**Purpose**: Comprehensive manual testing per quickstart.md checklist

- [ ] T072 Execute Bug #2 manual testing checklist from quickstart.md
- [ ] T073 Execute Bug #3 manual testing checklist from quickstart.md
- [ ] T074 Execute Bug #6 manual testing checklist from quickstart.md
- [ ] T075 Execute Bug #7 manual testing checklist from quickstart.md
- [ ] T076 Test keyboard navigation (Tab, Enter, Space) for accessibility
- [ ] T077 Test screen reader compatibility (VoiceOver/NVDA)
- [ ] T078 Verify WCAG 2.1 contrast ratios for muted text (4.5:1 minimum)
- [ ] T079 Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] T080 Test on mobile viewport sizes

**Checkpoint**: All manual tests passed, accessibility verified

---

## Phase 9: Deployment & Verification

**Purpose**: Deploy to production and verify fixes

- [ ] T081 Commit all changes to 004-basic-info-bugs branch (git add . && git commit -m "fix: Resolve Basic Information bugs #2, #3, #6, #7")
- [ ] T082 Push branch to GitHub (git push origin 004-basic-info-bugs)
- [ ] T083 Create pull request to main branch
- [ ] T084 Verify Cloudflare Pages preview deployment succeeds
- [ ] T085 Test all fixes on preview deployment URL
- [ ] T086 Request code review (if applicable)
- [ ] T087 Merge pull request to main
- [ ] T088 Monitor Cloudflare Pages production deployment
- [ ] T089 Smoke test production site (https://dnd.cyberlees.dev/characters/new)
- [ ] T090 Verify all 4 success criteria from spec.md met on production
- [ ] T091 Update MEMORY.md with deployment completion

**Checkpoint**: All fixes deployed to production and verified

---

## Phase 10: Polish & Documentation (Optional)

**Purpose**: Additional enhancements and documentation (only if time allows)

- [ ] T092 [P] Implement Bug #4 (Continue button enhancements) - OPTIONAL
- [ ] T093 [P] Implement Bug #5 (Level selection discoverability) - OPTIONAL
- [ ] T094 [P] Add JSDoc comments to modified functions
- [ ] T095 [P] Update component README if exists
- [ ] T096 Update MEMORY.md with lessons learned
- [ ] T097 Archive quickstart.md checklist results

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Not applicable - existing codebase
- **Foundational (Phase 2)**: No dependencies - code reading only - BLOCKS all user stories
- **User Stories (Phases 3-6)**: All depend on Foundational phase completion
  - US1 (Bug #2): Can start after Foundational - No dependencies
  - US2 (Bug #3): Can start after Foundational - No dependencies
  - US3 (Bug #6): Can start after Foundational - No dependencies
  - US4 (Bug #7): Can start after Foundational - No dependencies
- **Integration Testing (Phase 7)**: Depends on US1, US2, US3, US4 completion
- **Manual Testing (Phase 8)**: Depends on Phase 7 completion
- **Deployment (Phase 9)**: Depends on Phase 8 completion
- **Polish (Phase 10)**: Optional - can happen anytime after deployment

### User Story Dependencies

**All user stories are INDEPENDENT**:
- **US1 (Bug #2 - CharacterPreview)**: Different file, no dependencies
- **US2 (Bug #3 - Sub-step navigation)**: Same file as US3/US4 but different sections
- **US3 (Bug #6 - Auto-advance)**: Same file as US2/US4 but different sections
- **US4 (Bug #7 - Validation)**: Same file as US2/US3 but different sections

**⚠️ File Conflict Warning**: US2, US3, US4 all modify BasicInfoStep.tsx
- **Sequential approach**: Implement US2 → US3 → US4 in order (safer)
- **Parallel approach**: Coordinate changes or merge frequently to avoid conflicts

### Within Each User Story

1. Tests FIRST (write, verify FAIL)
2. Implementation (fix bug)
3. Tests PASS
4. Manual verification
5. Build verification

### Parallel Opportunities

**High Parallelism**:
- All Foundational tasks (T001-T006) can run in parallel
- All US1 tests (T007-T011) can run in parallel
- US1 can be implemented completely independently

**Medium Parallelism**:
- Tests for US2, US3, US4 can be written in parallel (different test cases)
- US1 implementation can happen in parallel with US2/US3/US4 tests being written

**Low Parallelism**:
- US2, US3, US4 implementations should be sequential (same file) OR require careful coordination
- Integration tests (Phase 7) must wait for all user stories

**Optimal Strategy**:
1. Developer A: Complete US1 (Bug #2) first → Quick win in 1-2 hours
2. Then Developer A: US2 → US3 → US4 sequentially (same file, avoid conflicts)
3. **Total time**: 6-8 hours for one developer, all 4 bugs fixed

---

## Parallel Example: User Story 1 (Bug #2)

```bash
# Step 1: Launch all tests for US1 together (5 parallel tasks):
Task T007: "Create CharacterPreview unit test file"
Task T008: "Write test displays placeholder when race is undefined"
Task T009: "Write test displays placeholder when class is undefined"
Task T010: "Write test never displays question mark symbols"
Task T011: "Write test placeholder has proper ARIA labels"

# Step 2: Run tests, verify they FAIL:
Task T012: "Run tests and verify they FAIL"

# Step 3: Implement sequentially (same file):
Task T013: "Locate race/class display logic"
Task T014: "Replace race display with placeholder"
Task T015: "Replace class display with placeholder"
Task T016: "Add ARIA labels"
Task T017: "Apply muted styling"

# Step 4: Verify:
Task T018: "Run unit tests - verify PASS"
Task T019: "Manual test"
Task T020: "Build verification"
```

**Time Estimate for US1**: 1-2 hours

---

## Parallel Example: Multiple User Stories (with coordination)

```bash
# After Foundational phase, IF you have 2 developers:

# Developer A (2 hours):
Tasks T007-T020: Complete User Story 1 (Bug #2) entirely
  → Quick win, independent file
  → Deploy to get immediate value

# Developer B (2 hours):
Tasks T021-T026: Write ALL tests for US2, US3, US4
  → Different test cases in BasicInfoStep.test.tsx
  → Can work in parallel with Developer A

# Then both developers coordinate on BasicInfoStep.tsx:
# Developer A: US2 (Bug #3) - 2-3 hours
# Developer B: Waits or works on documentation
# Developer A: US3 (Bug #6) - 1 hour
# Developer A: US4 (Bug #7) - 2-3 hours

# Total: 6-8 hours with coordination
```

---

## Implementation Strategy

### MVP First: Bug #2 Only (1-2 hours)

**Fastest path to value**:

1. Complete Phase 2: Foundational (read code) - 30 mins
2. Complete Phase 3: User Story 1 (Bug #2 - CharacterPreview) - 1-2 hours
3. **STOP and VALIDATE**: Test independently
4. Deploy to production → Immediate UX improvement
5. Users see "Not selected yet" instead of "?"

**Why Bug #2 First**:
- Quickest fix (1-2 hours)
- Most visible improvement (user-facing text)
- Independent file (no conflicts)
- High impact on perceived quality

### Incremental Delivery (Priority Order)

**Full implementation path** (6-8 hours total):

1. **Phase 2**: Foundational - 30 mins
2. **Phase 3**: US1 (Bug #2) → Test → Deploy - 1-2 hours ✅ **MVP!**
3. **Phase 4**: US2 (Bug #3) → Test → Deploy - 2-3 hours ✅ **Navigation improved**
4. **Phase 5**: US3 (Bug #6) → Test → Deploy - 1 hour ✅ **Auto-advance removed**
5. **Phase 6**: US4 (Bug #7) → Test → Deploy - 2-3 hours ✅ **Validation improved**
6. **Phase 7-9**: Integration + Manual + Deploy - 2 hours ✅ **All bugs fixed**

Each deployment adds value without breaking previous fixes.

### Alternative: All Critical Bugs (Bugs #2, #3, #6, #7)

If you want all bugs fixed before deploying:

1. Phase 2: Foundational - 30 mins
2. Phases 3-6: All user stories sequentially - 6-8 hours
3. Phases 7-9: Testing + deployment - 2 hours
4. **Total**: 8-10 hours → Deploy once with all fixes

**Trade-off**: Longer time to first deployment, but fewer deployments overall.

---

## Task Summary

**Total Tasks**: 97 tasks (91 required + 6 optional)

**Breakdown by Phase**:
- Phase 1 (Setup): 0 tasks (existing codebase)
- Phase 2 (Foundational): 6 tasks (code reading)
- Phase 3 (US1 - Bug #2): 14 tasks
- Phase 4 (US2 - Bug #3): 20 tasks
- Phase 5 (US3 - Bug #6): 10 tasks
- Phase 6 (US4 - Bug #7): 10 tasks
- Phase 7 (Integration): 7 tasks
- Phase 8 (Manual Testing): 9 tasks
- Phase 9 (Deployment): 11 tasks
- Phase 10 (Polish): 6 tasks (OPTIONAL)

**Breakdown by User Story**:
- US1 (Bug #2 - CharacterPreview): 14 tasks (1-2 hours)
- US2 (Bug #3 - Sub-step navigation): 20 tasks (2-3 hours)
- US3 (Bug #6 - Auto-advance): 10 tasks (1 hour)
- US4 (Bug #7 - Validation): 10 tasks (2-3 hours)

**Parallel Opportunities**:
- 28 tasks marked [P] can run in parallel
- All 4 user stories are independent (can parallelize with coordination)
- Tests can be written before implementation (TDD approach)

**Independent Test Criteria**:
- US1: Navigate to /characters/new, enter name, verify "Not selected yet" not "?"
- US2: Complete wizard, click step 1, verify data preserved
- US3: Type in name field slowly, verify no auto-advance
- US4: Load page, verify no errors until Next clicked

**Suggested MVP Scope**: User Story 1 only (Bug #2) - 1-2 hours for quick win

**Full Implementation**: All 4 user stories - 6-8 hours for one developer

---

## Notes

- All tasks follow strict checklist format: `- [ ] [ID] [P?] [Story?] Description with file path`
- Tests are included per specification requirements
- Each user story is independently testable
- File conflict warning for US2/US3/US4 (all modify BasicInfoStep.tsx)
- Recommend Bug #2 first for quick win, then others sequentially
- Bug #1 (class skills) not included - depends on Bug #003 API fix
- Bugs #4, #5 marked optional in spec - included in Phase 10 if time allows
- All tasks have specific file paths from quickstart.md and contracts
