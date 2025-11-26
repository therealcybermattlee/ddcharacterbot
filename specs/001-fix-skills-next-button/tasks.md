# Tasks: Fix Skills & Proficiencies Next Button

**Input**: Design documents from `/specs/001-fix-skills-next-button/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: NOT INCLUDED - This is a focused bug fix where manual testing and regression tests are sufficient. No new test files requested in specification.

**Organization**: Tasks are organized by user story priority (P1 → P2 → P3) to enable incremental delivery and independent testing of each scenario.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different concerns, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Investigation & Root Cause Verification

**Purpose**: Confirm the root cause identified in research.md before making code changes

- [ ] T001 Navigate to production site (https://dnd.cyberlees.dev) and reproduce the bug by creating a character and selecting all required skills in the Skills & Proficiencies step
- [ ] T002 Open browser DevTools console and verify validation useEffect is firing when skills are selected (check for existing console.log statements in frontend/src/components/wizard/steps/SkillsProficienciesStep.tsx around line 381)
- [ ] T003 Verify onValidationChange callback is being invoked by adding temporary console.log before the call (line 415 in frontend/src/components/wizard/steps/SkillsProficienciesStep.tsx)
- [ ] T004 Confirm root cause: Check if CharacterWizard's handleValidationChange useCallback dependencies cause callback identity changes (frontend/src/components/wizard/CharacterWizard.tsx lines 146-150)

**Checkpoint**: Root cause confirmed - callback identity instability prevents wizard state updates

---

## Phase 2: User Story 1 - Complete Skill Selection and Progress (Priority: P1) 🎯 MVP

**Goal**: Fix the Next button so it enables immediately when all required skill selections are complete (class + race skills)

**Independent Test**: Navigate to Skills & Proficiencies step, select all required class skills (e.g., 4 for Rogue), verify Next button enables within 100ms, click Next and verify progression to next step

### Implementation for User Story 1

- [ ] T005 [US1] Add useRef to React imports in frontend/src/components/wizard/steps/SkillsProficienciesStep.tsx line 1
- [ ] T006 [US1] Create onValidationChangeRef and ref update useEffect after line 224 (after previousRace state declaration) in frontend/src/components/wizard/steps/SkillsProficienciesStep.tsx
- [ ] T007 [US1] Replace onValidationChange(errors.length === 0, errors) with onValidationChangeRef.current(errors.length === 0, errors) at line 415 in frontend/src/components/wizard/steps/SkillsProficienciesStep.tsx
- [ ] T008 [US1] Update validation useEffect comments (lines 416-420) to document Bug #23 fix and ref pattern in frontend/src/components/wizard/steps/SkillsProficienciesStep.tsx

### Manual Testing for User Story 1

- [ ] T009 [US1] Test basic flow: Create new character (Rogue class), navigate to Skills step, select exactly 4 class skills, verify Next button enables immediately
- [ ] T010 [US1] Test race skills: Create Half-Elf character, navigate to Skills step, select required class skills + 2 race skills, verify Next button enables
- [ ] T011 [US1] Test incremental selection: Select 3 of 4 required skills, verify button disabled, select 4th skill, verify button enables within 100ms
- [ ] T012 [US1] Test navigation: Complete all selections, click Next button, verify progression to Equipment & Spells step without errors

### Regression Testing for User Story 1

- [ ] T013 [US1] Verify Bug #14 still fixed: Rapidly toggle skills on/off (click multiple times quickly), verify no infinite render loops in browser console
- [ ] T014 [US1] Verify Bug #22 still fixed: Select skills one by one, verify button enables after final selection, deselect one skill, verify button disables

**Checkpoint**: User Story 1 complete - Next button enables when selections are complete for new character creation

---

## Phase 3: User Story 2 - Return to Saved Character (Priority: P2)

**Goal**: Fix the Next button for users returning to saved character creation sessions with localStorage data

**Independent Test**: Create character with saved skills, refresh page, verify skills are restored and Next button is already enabled

### Manual Testing for User Story 2

- [ ] T015 [US2] Test localStorage restoration with complete data: Start character creation, select all required skills, refresh page, verify skills restored and Next button enabled
- [ ] T016 [US2] Test localStorage restoration with incomplete data: Start character creation, select only 2 of 4 required skills, refresh page, verify skills restored but Next button remains disabled
- [ ] T017 [US2] Test API failure scenario: Throttle network in DevTools (slow 3G), refresh page with saved skills, verify validation works with fallback data and button enables correctly

### Regression Testing for User Story 2

- [ ] T018 [US2] Verify Bug #16 still fixed: Return to saved character with skills already selected, check browser console for errors, verify skills display correctly and button state is correct

**Checkpoint**: User Story 2 complete - Next button works correctly when restoring from localStorage

---

## Phase 4: User Story 3 - Handle API Loading States (Priority: P3)

**Goal**: Fix the Next button to work correctly when API data is slow to load or fails

**Independent Test**: Throttle network, block API calls, or use fallback data, then complete skill selections and verify Next button enables

### Manual Testing for User Story 3

- [ ] T019 [US3] Test slow API: Set network to "Slow 3G" in DevTools, create new character, navigate to Skills step, select required skills while API loads, verify button enables once selections complete
- [ ] T020 [US3] Test API failure with fallback: Block /api/classes/* endpoints in DevTools, create character with various classes (Fighter, Wizard, Cleric), verify fallback data works and button enables
- [ ] T021 [US3] Test late API arrival: Start with throttled network, select skills using fallback data, wait for API to load, verify validation re-evaluates correctly without requiring re-selection

### Regression Testing for User Story 3

- [ ] T022 [US3] Verify Bug #21 still fixed: Throttle network, create characters with all 12 D&D classes (Barbarian, Bard, Cleric, Druid, Fighter, Monk, Paladin, Ranger, Rogue, Sorcerer, Warlock, Wizard), verify fallback data works for all

**Checkpoint**: User Story 3 complete - Next button works correctly with slow/failed API

---

## Phase 5: Edge Cases & Final Validation

**Purpose**: Test edge cases from specification and verify all acceptance criteria

### Edge Case Testing

- [ ] T023 Test rapid toggling: Click skills rapidly on/off multiple times in quick succession, verify button state updates correctly without lag or incorrect state
- [ ] T024 Test API returning unexpected skill counts: Use DevTools to modify API response with wrong skillChoices value, verify validation gracefully handles mismatch
- [ ] T025 Test character switching: Start character creation, select skills, go back to Basic Info step, change class/race, return to Skills step, verify selections reset correctly and button state is accurate
- [ ] T026 Test corrupted localStorage: Manually edit localStorage to have invalid skill data, refresh page, verify validation handles corrupted data without crashing and button behaves correctly

### Performance Validation

- [ ] T027 Verify <100ms response time: Use browser DevTools Performance tab, record while selecting final skill, verify time from click to button enable is under 100ms
- [ ] T028 Test with 18 skills (all D&D skills): Select and deselect all 18 skills in various combinations, verify validation remains fast and responsive

---

## Phase 6: Build, Deploy & Production Verification

**Purpose**: Deploy the fix to production and verify in real environment

### Build

- [ ] T029 Build frontend production bundle from frontend directory using npm run build:production
- [ ] T030 Verify build completes without errors and check output bundle size is reasonable (should be similar to previous builds)

### Git & Deployment

- [ ] T031 Stage all changes using git add frontend/src/components/wizard/steps/SkillsProficienciesStep.tsx
- [ ] T032 Create commit with message "fix: Skills step Next button using ref pattern (Bug #23)" including detailed description, fixes/related tags, and Claude Code attribution
- [ ] T033 Push commit to origin main and wait for Cloudflare Pages deployment to complete

### Production Verification

- [ ] T034 Navigate to production URL (https://dnd.cyberlees.dev) and verify site loads without errors
- [ ] T035 Run through User Story 1 acceptance scenarios on production (create Rogue, select 4 skills, verify button enables, progress to next step)
- [ ] T036 Run through User Story 2 acceptance scenarios on production (refresh with saved skills, verify button state)
- [ ] T037 Run through User Story 3 acceptance scenarios on production (test with throttled network)
- [ ] T038 Monitor browser console on production for any errors or warnings during character creation flow

**Checkpoint**: Fix deployed to production and verified working

---

## Phase 7: Documentation & Closure

**Purpose**: Update project documentation and close the bug

### Documentation Updates

- [ ] T039 Update MEMORY.md with new session entry documenting Bug #23 fix, including root cause (callback identity instability), solution (ref pattern), files modified, deployment status, and commit hash
- [ ] T040 [P] Update MEMORY.md to note Bug #22 was an incomplete fix that has now been properly resolved by Bug #23
- [ ] T041 [P] Add note in MEMORY.md about ref pattern being the preferred solution for unstable callback issues in React components

### Analytics & Monitoring

- [ ] T042 Check character creation analytics (if available) for baseline completion rate before fix
- [ ] T043 Schedule follow-up check in 1 week to measure character creation completion rate improvement (target: 20%+ improvement)

**Checkpoint**: Bug #23 fully documented and closed

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Investigation)**: No dependencies - can start immediately
- **Phase 2 (US1 - MVP)**: Depends on Phase 1 investigation confirming root cause
- **Phase 3 (US2)**: Depends on Phase 2 completion - tests localStorage scenarios with the fix
- **Phase 4 (US3)**: Depends on Phase 2 completion - tests API failure scenarios with the fix
- **Phase 5 (Edge Cases)**: Depends on Phases 2, 3, 4 completion - validates all scenarios together
- **Phase 6 (Deploy)**: Depends on Phases 2-5 completion - all testing must pass before deploy
- **Phase 7 (Documentation)**: Depends on Phase 6 completion - document after production verification

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Phase 1 investigation - No dependencies on other stories (CRITICAL PATH)
- **User Story 2 (P2)**: Depends on US1 completion - Uses same fix, tests different scenario (localStorage)
- **User Story 3 (P3)**: Depends on US1 completion - Uses same fix, tests different scenario (API failures)

### Sequential Execution (Recommended)

Since this is a single-file bug fix, sequential execution is most efficient:

1. Phase 1: Investigation (T001-T004) - 15 minutes
2. Phase 2: US1 Implementation + Testing (T005-T014) - 30 minutes
3. Phase 3: US2 Testing (T015-T018) - 15 minutes
4. Phase 4: US3 Testing (T019-T022) - 15 minutes
5. Phase 5: Edge Cases (T023-T028) - 20 minutes
6. Phase 6: Deploy & Verify (T029-T038) - 15 minutes
7. Phase 7: Documentation (T039-T043) - 10 minutes

**Total Estimated Time**: ~2 hours

### Parallel Opportunities

Limited parallelization opportunities due to single-file bug fix:

- **Within Phase 7**: T040 and T041 (MEMORY.md updates) can be done in parallel
- **Testing across US2/US3**: If you have multiple browsers/devices, you could test US2 and US3 scenarios in parallel after Phase 2 completes

---

## Parallel Example: Phase 7 Documentation

```bash
# These documentation tasks can run in parallel:
Task T040: "Update MEMORY.md to note Bug #22 incomplete fix"
Task T041: "Add note about ref pattern best practice"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Investigation (confirm root cause)
2. Complete Phase 2: User Story 1 (core fix + MVP testing)
3. **STOP and VALIDATE**: Test US1 independently on local dev
4. If US1 works, deploy immediately for maximum value

### Incremental Delivery (Recommended)

1. Complete Phase 1: Investigation → Root cause confirmed
2. Complete Phase 2: User Story 1 → MVP working (Next button enables for new characters)
3. Complete Phase 3: User Story 2 → localStorage scenarios working
4. Complete Phase 4: User Story 3 → API failure scenarios working
5. Complete Phase 5: Edge Cases → All edge cases validated
6. Complete Phase 6: Deploy → Production verification
7. Complete Phase 7: Documentation → Bug closed

Each phase validates incrementally without breaking previous validation.

### Single Developer Strategy (Optimal for Bug Fix)

1. Work through phases sequentially (Phase 1 → 2 → 3 → 4 → 5 → 6 → 7)
2. Code changes only in Phase 2 (T005-T008) - takes ~5 minutes
3. All other phases are testing and verification
4. Complete all testing before deploying to production

---

## Success Criteria Checklist

After completing all tasks, verify:

- ✅ **SC-001**: Users can progress from Skills step 100% of the time when selections complete
- ✅ **SC-002**: Next button enables within 100ms (validated in T027)
- ✅ **SC-003**: Zero instances of disabled button with complete selections
- ✅ **SC-004**: Character creation completion rate improves 20%+ (measured in T042-T043)
- ✅ **SC-005**: Validation works 100% of time with slow/failed API (validated in Phase 4)

---

## Rollback Plan

If critical issues arise after deployment:

1. **Immediate Rollback** (5 minutes):
   ```bash
   git revert HEAD
   git push origin main
   ```

2. **Wait for Cloudflare deployment** and verify site is functional

3. **Investigate** issue using browser DevTools and error logs

4. **Fix** identified issue and re-deploy

---

## Notes

- [P] tasks = parallel execution possible (currently only T040/T041)
- [Story] label maps task to specific user story for traceability
- Each user story tests the same fix in different scenarios (new character, localStorage, API failure)
- All testing is manual as no automated tests were requested in specification
- Commit after code changes (T031-T032)
- Phase 2 (US1) is the MVP - delivers immediate value
- Phases 3-5 validate additional scenarios without code changes
- Total code changes: ~10 lines in 1 file (SkillsProficienciesStep.tsx)
- Low risk fix using proven React pattern (useRef for unstable callbacks)

---

## File Changes Summary

**Files Modified** (1 file total):
- `frontend/src/components/wizard/steps/SkillsProficienciesStep.tsx`
  - Line 1: Add `useRef` to imports (T005)
  - After line 224: Add ref and update useEffect (T006)
  - Line 415: Use ref instead of direct callback (T007)
  - Lines 416-420: Update comments (T008)

**Files Read** (for context):
- `frontend/src/components/wizard/CharacterWizard.tsx` (investigation only)
- `frontend/src/contexts/CharacterCreationContext.tsx` (investigation only)

**Total Lines Changed**: ~10 lines (3 additions, 3 modifications, ~4 comment updates)

---

## Quick Reference

**Most Critical Tasks**:
- T001-T004: Confirm root cause before changing code
- T005-T008: Actual code changes (the fix itself)
- T009-T012: MVP validation (US1)
- T029-T033: Build and deploy
- T034-T038: Production verification

**Can Skip If Time Constrained** (but not recommended):
- T023-T026: Edge case testing (nice to have but not critical)
- T042-T043: Analytics follow-up (future monitoring)

**Must Not Skip**:
- All other tasks are essential for proper fix validation