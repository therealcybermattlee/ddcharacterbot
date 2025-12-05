# Tasks: Cleric Selection Blank Screen Bug Fix

**Input**: Design documents from `/specs/005-cleric-selection-bug/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Manual testing tasks included (no automated test tasks - hotfix priority)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

---

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Path Conventions

- **Web app**: `frontend/src/`, `backend/src/` (this project structure)
- **Primary fix**: `frontend/src/services/dnd5eApi.ts` line 148
- **Related**: `frontend/src/components/wizard/steps/BasicInfoStep.tsx` lines 377-404

---

## Phase 1: Setup (Verification & Preparation)

**Purpose**: Verify current state and prepare for implementation

- [ ] T001 Read research.md to understand root cause (missing field extraction in transformClassData)
- [ ] T002 Read data-model.md to understand API → frontend transformation gap
- [ ] T003 Read contracts/dnd5eApi.contract.md to understand transformation requirements
- [ ] T004 Read quickstart.md for implementation steps and testing checklist

**Checkpoint**: Understanding complete - ready to implement fix

---

## Phase 2: Foundational (Pre-Implementation Verification)

**Purpose**: Verify bug exists and understand current behavior

**⚠️ CRITICAL**: These verification steps confirm the bug before applying the fix

- [ ] T005 Start frontend development server (npm run dev in frontend directory)
- [ ] T006 Navigate to http://localhost:5173/characters/new in browser
- [ ] T007 Reproduce bug: Create character with name "Test", race "Human", click "Cleric" class
- [ ] T008 Verify blank screen appears at sub-step 4 (no SubclassSelector UI)
- [ ] T009 Open browser console and verify console logs show UPDATE_STEP_DATA with newSkills: undefined
- [ ] T010 Verify no JavaScript runtime errors (logic bug, not exception)
- [ ] T011 Stop development server (Ctrl+C)

**Checkpoint**: Bug confirmed - root cause is missing `subclasses` field extraction

---

## Phase 3: User Story 1 - Cleric Class Selection Completes Successfully (Priority: P1) 🎯 MVP

**Goal**: Fix the transformClassData function to extract subclasses array from API response, allowing Cleric character creation to complete without blank screens.

**Independent Test**: Navigate to character wizard, select Cleric class at level 1, verify Divine Domain subclass selection UI renders with 6 options, complete character creation end-to-end.

### Implementation for User Story 1

- [ ] T012 [US1] Open file frontend/src/services/dnd5eApi.ts in editor
- [ ] T013 [US1] Navigate to transformClassData() function (lines 102-162)
- [ ] T014 [US1] Locate insertion point after class_features line (line 147, before spellcasting)
- [ ] T015 [US1] Add missing line at line 148: `subclasses: apiClass.subclasses || [],`
- [ ] T016 [US1] Verify syntax is correct (comma at end, proper indentation)
- [ ] T017 [US1] Save file (Ctrl+S or Cmd+S)

### Manual Testing for User Story 1

- [ ] T018 [US1] Start frontend development server (npm run dev in frontend directory)
- [ ] T019 [US1] Open browser to http://localhost:5173/characters/new
- [ ] T020 [US1] Test Cleric at Level 1: Enter name "Tiberius", select race "Human"
- [ ] T021 [US1] Click "Cleric" class card
- [ ] T022 [US1] Verify SubclassSelector UI renders (displays 6 Divine Domain options)
- [ ] T023 [US1] Verify no blank screen at sub-step 4
- [ ] T024 [US1] Select "Life Domain" subclass
- [ ] T025 [US1] Click "Continue to Background Selection" button
- [ ] T026 [US1] Verify background selection UI displays correctly
- [ ] T027 [US1] Complete character creation: Select background "Acolyte", alignment "Lawful Good"
- [ ] T028 [US1] Click "Complete Basic Info" and verify wizard advances to next main step
- [ ] T029 [US1] Verify no console errors in browser console (F12)

### Production Build for User Story 1

- [ ] T030 [US1] Stop development server (Ctrl+C)
- [ ] T031 [US1] Run production build: cd frontend && npm run build:production
- [ ] T032 [US1] Verify build completes successfully with no errors
- [ ] T033 [US1] Verify dist/ directory was created with index.html and assets

**Checkpoint**: At this point, User Story 1 should be fully functional - Cleric character creation works end-to-end

---

## Phase 4: User Story 2 - All Classes Handle Sub-Step Progression Consistently (Priority: P2)

**Goal**: Verify that the fix doesn't just solve Cleric, but ensures all 12 D&D 5e classes have consistent sub-step progression behavior with subclasses data available.

**Independent Test**: Test all 12 core classes (Barbarian, Bard, Cleric, Druid, Fighter, Monk, Paladin, Ranger, Rogue, Sorcerer, Warlock, Wizard) at levels 1, 3, and 5 - verify 0 blank screens and correct subclass UI rendering for each.

### Manual Testing for User Story 2

**Level 1 Subclass Classes (Gain subclass at level 1)**:

- [ ] T034 [US2] Test Cleric at level 1 (should show 6 Divine Domain subclass options)
- [ ] T035 [P] [US2] Test Warlock at level 1 (should show Otherworldly Patron subclass options)

**Level 2 Subclass Classes (Gain subclass at level 2)**:

- [ ] T036 [P] [US2] Test Wizard at level 2 (should show Arcane Tradition subclass options)

**Level 3 Subclass Classes (Gain subclass at level 3 - most classes)**:

- [ ] T037 [P] [US2] Test Barbarian at level 1 (should skip subclass, advance to background)
- [ ] T038 [P] [US2] Test Barbarian at level 3 (should show Primal Path subclass options)
- [ ] T039 [P] [US2] Test Bard at level 1 (should skip subclass, advance to background)
- [ ] T040 [P] [US2] Test Bard at level 3 (should show Bard College subclass options)
- [ ] T041 [P] [US2] Test Druid at level 1 (should skip subclass, advance to background)
- [ ] T042 [P] [US2] Test Druid at level 3 (should show Druid Circle subclass options)
- [ ] T043 [P] [US2] Test Fighter at level 1 (should skip subclass, advance to background)
- [ ] T044 [P] [US2] Test Fighter at level 3 (should show Martial Archetype subclass options)
- [ ] T045 [P] [US2] Test Monk at level 1 (should skip subclass, advance to background)
- [ ] T046 [P] [US2] Test Monk at level 3 (should show Monastic Tradition subclass options)
- [ ] T047 [P] [US2] Test Paladin at level 1 (should skip subclass, advance to background)
- [ ] T048 [P] [US2] Test Paladin at level 3 (should show Sacred Oath subclass options)
- [ ] T049 [P] [US2] Test Ranger at level 1 (should skip subclass, advance to background)
- [ ] T050 [P] [US2] Test Ranger at level 3 (should show Ranger Archetype subclass options)
- [ ] T051 [P] [US2] Test Rogue at level 1 (should skip subclass, advance to background)
- [ ] T052 [P] [US2] Test Rogue at level 3 (should show Roguish Archetype subclass options)
- [ ] T053 [P] [US2] Test Sorcerer at level 1 (should skip subclass, advance to background)
- [ ] T054 [P] [US2] Test Sorcerer at level 3 (should show Sorcerous Origin subclass options)

**Level 5 Tests (Verify higher levels work consistently)**:

- [ ] T055 [P] [US2] Test Cleric at level 5 (should show Divine Domain options)
- [ ] T056 [P] [US2] Test Fighter at level 5 (should show Martial Archetype options)
- [ ] T057 [P] [US2] Test Wizard at level 5 (should show Arcane Tradition options)

### Edge Case Testing for User Story 2

- [ ] T058 [US2] Test backward navigation: Select Cleric, advance to subclass, click back, select Fighter
- [ ] T059 [US2] Verify Fighter displays correctly (wizard recovers from Cleric state)
- [ ] T060 [US2] Test level change: Create level 1 Cleric, complete wizard, change level to 3, verify subclass still shows

**Checkpoint**: All 12 classes tested and verified - consistent behavior with 0 blank screens

---

## Phase 5: User Story 3 - Clear Error Messages for Sub-Step Failures (Priority: P3)

**Goal**: Add defensive error handling to provide fallback UI when subclass data is unexpectedly missing, instead of showing a blank screen.

**Independent Test**: Simulate missing subclass data (temporarily modify code to return undefined), verify error card displays with "Skip to Background" button instead of blank screen.

### Implementation for User Story 3 (Optional Enhancement)

**Note**: This is an optional enhancement since the primary fix (US1) ensures subclasses is always an array. Include these tasks only if defensive error handling is desired.

- [ ] T061 [US3] Open file frontend/src/components/wizard/steps/BasicInfoStep.tsx in editor
- [ ] T062 [US3] Navigate to subclass rendering logic (lines 377-404)
- [ ] T063 [US3] Replace short-circuit evaluation with ternary operator for fallback UI
- [ ] T064 [US3] Add error card for when data.classData.subclasses is undefined or empty
- [ ] T065 [US3] Error card should display message "Unable to load subclass options"
- [ ] T066 [US3] Error card should include "Skip to Background Selection" button
- [ ] T067 [US3] Button onClick should call setCurrentStep('background')
- [ ] T068 [US3] Save file

### Manual Testing for User Story 3 (Optional)

- [ ] T069 [US3] Temporarily modify transformClassData to NOT include subclasses (comment out line 148)
- [ ] T070 [US3] Start dev server and test Cleric selection
- [ ] T071 [US3] Verify error card displays instead of blank screen
- [ ] T072 [US3] Click "Skip to Background Selection" button
- [ ] T073 [US3] Verify wizard advances to background selection
- [ ] T074 [US3] Restore line 148 (uncomment subclasses extraction)
- [ ] T075 [US3] Verify normal behavior returns (subclass UI renders)

**Checkpoint**: Defensive error handling complete - graceful degradation if API fails

---

## Phase 6: Polish & Deployment

**Purpose**: Final verification, production deployment, and post-deployment monitoring

### Final Verification

- [ ] T076 Run full regression test: Test all 12 classes one final time
- [ ] T077 Verify no console errors or warnings in browser console
- [ ] T078 Verify localStorage persists character data correctly
- [ ] T079 Test on different browsers (Chrome, Firefox, Safari) if available
- [ ] T080 Clear browser cache and test again to ensure fresh state works

### Git Commit

- [ ] T081 Stop development server if running (Ctrl+C)
- [ ] T082 Git add: git add frontend/src/services/dnd5eApi.ts
- [ ] T083 Git commit with descriptive message referencing Bug #005 and fix details
- [ ] T084 Include testing summary in commit message (12 classes tested, 0 blank screens)

### Production Deployment

- [ ] T085 Git push: git push origin 005-cleric-selection-bug
- [ ] T086 Monitor GitHub Actions workflow (if configured) for build status
- [ ] T087 Monitor Cloudflare Pages deployment dashboard
- [ ] T088 Wait for deployment to complete (typically 2-5 minutes)

### Production Verification

- [ ] T089 Open production site: https://dnd.cyberlees.dev/characters/new
- [ ] T090 Test Cleric selection on production: Name "Production Test", race "Human", class "Cleric"
- [ ] T091 Verify SubclassSelector renders with 6 Divine Domain options
- [ ] T092 Select "Life Domain" and complete character creation
- [ ] T093 Verify character creation wizard advances to ability scores step
- [ ] T094 Test Warlock on production (level 1 subclass class verification)
- [ ] T095 Test Fighter on production (level 3 subclass class verification)

### Post-Deployment Monitoring

- [ ] T096 Monitor production console logs for any unexpected errors
- [ ] T097 Watch for user reports of Cleric bug (should drop to 0 reports)
- [ ] T098 Verify character creation completion rate increases for Cleric/Warlock
- [ ] T099 Document deployment time and verification results in MEMORY.md

**Final Checkpoint**: Feature 005 deployed and verified in production ✅

---

## Dependencies

### User Story Dependencies

```
Phase 1 (Setup) → Phase 2 (Verification)
                       ↓
                  Phase 3 (US1: Cleric Fix) 🎯 MVP
                       ↓
      ┌────────────────┴────────────────┐
      ↓                                  ↓
Phase 4 (US2: All Classes)    Phase 5 (US3: Error Handling)
      ↓                                  ↓
      └────────────────┬────────────────┘
                       ↓
                  Phase 6 (Polish & Deployment)
```

**Critical Path**: Phase 1 → Phase 2 → Phase 3 (US1) → Phase 6
- **MVP**: Phase 3 (T012-T033) fixes the bug, ~30-45 minutes
- **Full Feature**: All phases, ~2-3 hours

**Parallel Opportunities**:
- Phase 4 (US2): Tasks T034-T057 can be executed in parallel (different classes)
- Phase 5 (US3): Can be done independently after Phase 3

### Task Dependencies Within Phases

**Phase 3 (US1) - Sequential**:
- T012-T017: Implementation (must be sequential)
- T018-T029: Testing (must be sequential - server → navigate → test → verify)
- T030-T033: Build (sequential after testing)

**Phase 4 (US2) - Highly Parallel**:
- T034-T060: All class tests can run in parallel (independent test cases)

**Phase 5 (US3) - Sequential**:
- T061-T068: Implementation (sequential code changes)
- T069-T075: Testing (sequential - modify → test → restore)

**Phase 6 - Sequential**:
- T076-T099: Must complete in order (verify → commit → deploy → verify production)

---

## Parallel Execution Examples

### Example 1: MVP Implementation (Phase 3 Only)

**Single developer - 30-45 minutes**:
1. Complete Phase 1 (T001-T004): 5 minutes - Read documentation
2. Complete Phase 2 (T005-T011): 5 minutes - Verify bug exists
3. Complete Phase 3 (T012-T033): 20-30 minutes - Implement, test, build
4. Skip Phase 4, 5 (defer comprehensive testing)
5. Complete Phase 6 (T081-T095): 10-15 minutes - Deploy and verify

**Result**: Cleric bug fixed and deployed, minimal testing

---

### Example 2: Full Feature Implementation

**Single developer - 2-3 hours**:
1. Phase 1 (T001-T004): 5 min
2. Phase 2 (T005-T011): 5 min
3. Phase 3 (T012-T033): 30 min
4. Phase 4 (T034-T060): 45 min - Test all 12 classes
5. Phase 5 (T061-T075): 20 min - Add error handling
6. Phase 6 (T076-T099): 20 min - Deploy and verify

**Result**: Complete fix with comprehensive testing and error handling

---

### Example 3: Parallel Team Execution

**Two developers - 1.5-2 hours**:

**Developer 1** (Critical path):
- Phase 1 (T001-T004): 5 min
- Phase 2 (T005-T011): 5 min
- Phase 3 (T012-T033): 30 min
- Phase 6 (T081-T095): 15 min
- **Total**: 55 min

**Developer 2** (Verification + Enhancement):
- Wait for Developer 1 to complete T017 (code change pushed)
- Phase 4 (T034-T060): 45 min - Test all classes in parallel
- Phase 5 (T061-T075): 20 min - Add error handling
- **Total**: 65 min

**Combined**: Both developers work in parallel, feature complete in ~1.5 hours

---

## Implementation Strategy

### MVP First Approach (Recommended for Hotfix)

**Phase**: Phase 3 (US1) only
**Time**: 30-45 minutes
**Value**: Unblocks Cleric character creation immediately

**Tasks**: T012-T033 (22 tasks)
1. Add 1-line fix (T012-T017)
2. Test Cleric at level 1 (T018-T029)
3. Build for production (T030-T033)
4. Deploy (Phase 6: T081-T095)

**Deliver**: Working Cleric selection, minimum viable fix

---

### Incremental Delivery Approach

**Iteration 1**: MVP (Phase 3)
- Deploy: Cleric bug fixed
- Time: 30-45 min

**Iteration 2**: Comprehensive Testing (Phase 4)
- Verify: All 12 classes work correctly
- Time: +45 min

**Iteration 3**: Error Handling (Phase 5)
- Enhance: Graceful degradation for edge cases
- Time: +20 min

**Total**: 2 hours with 3 production deployments

---

### All-at-Once Approach

**Phases**: 1 → 2 → 3 → 4 → 5 → 6
**Time**: 2-3 hours
**Value**: Complete fix with comprehensive testing and error handling

**Tasks**: All 99 tasks
1. Setup and verification (Phase 1-2)
2. Core fix (Phase 3)
3. Comprehensive testing (Phase 4)
4. Error handling enhancement (Phase 5)
5. Deploy with full confidence (Phase 6)

**Deliver**: Production-ready fix with extensive verification

---

## Task Summary

**Total Tasks**: 99 tasks across 6 phases

### Task Count by Phase

| Phase | Task Count | Can Parallelize | Time Estimate |
|-------|------------|-----------------|---------------|
| Phase 1: Setup | 4 | No | 5 min |
| Phase 2: Foundational | 7 | No | 5-10 min |
| Phase 3: US1 (MVP) | 22 | No (sequential) | 30-45 min |
| Phase 4: US2 (Testing) | 27 | Yes (24 tasks) | 45 min |
| Phase 5: US3 (Optional) | 15 | No | 20 min |
| Phase 6: Polish & Deploy | 24 | No | 20 min |

### Task Count by User Story

| User Story | Priority | Task Count | Independent Test |
|------------|----------|------------|------------------|
| US1: Cleric Fix | P1 🎯 | 22 tasks | Cleric level 1 completes end-to-end |
| US2: All Classes | P2 | 27 tasks | All 12 classes at levels 1, 3, 5 |
| US3: Error Messages | P3 | 15 tasks | Simulate missing data, verify error card |

### Parallel Opportunities

**High Parallelization** (Phase 4): 24 out of 27 tasks can run in parallel
- T034-T057: Class testing (24 independent test cases)

**Sequential Phases** (Phase 3, 5, 6): Must complete tasks in order
- Phase 3: Code change → Test → Build
- Phase 5: Modify code → Test → Restore
- Phase 6: Verify → Commit → Deploy → Verify production

---

## Format Validation

✅ **ALL 99 tasks follow the required checklist format**:
- [x] Every task starts with `- [ ]` (markdown checkbox)
- [x] Every task has a sequential ID (T001-T099)
- [x] Parallelizable tasks marked with `[P]`
- [x] User story tasks marked with `[US1]`, `[US2]`, or `[US3]`
- [x] Setup/Foundational/Polish tasks have no story label
- [x] Every task includes clear description with file paths where applicable

---

## Success Criteria Mapping

**SC-001** (Cleric works at all levels):
- Verified by: T020-T028 (Phase 3), T034 (Phase 4), T055 (Phase 4)

**SC-002** (All 12 classes consistent):
- Verified by: T034-T060 (Phase 4 - all class tests)

**SC-003** (Performance < 100ms):
- Verified by: T029 (no lag observed), T091 (production performance)

**SC-004** (Graceful error handling):
- Verified by: T069-T075 (Phase 5 - simulate missing data)

**SC-005** (Console logs for debugging):
- Verified by: T009, T029, T077, T096 (console verification tasks)

---

**Status**: Ready for implementation
**Recommended Approach**: MVP First (Phase 3 only) for immediate hotfix, then iterate
**Critical Path**: T001 → T012 → T018 → T081 → T085 → T089 (55 minutes MVP)
