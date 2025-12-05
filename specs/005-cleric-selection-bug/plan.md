# Implementation Plan: Cleric Selection Blank Screen Bug

**Branch**: `005-cleric-selection-bug` | **Date**: 2025-12-05 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-cleric-selection-bug/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

When users select the Cleric class during character creation, the wizard advances to sub-step 4 but displays a blank screen instead of rendering the subclass selection UI (Divine Domain options). This bug completely blocks Cleric character creation, affecting approximately 8.3% of potential character builds.

**Primary Requirement**: Fix the blank screen bug by adding null-safety checks and fallback UI to the subclass rendering logic in BasicInfoStep.tsx.

**Technical Approach**:
1. Add null-safety check to verify `data.classData.subclasses` exists before rendering SubclassSelector
2. Provide fallback UI when subclass data is missing (error card with "Skip to Background" button)
3. Add defensive logging to diagnose root cause (API data vs timing issue)
4. Ensure auto-advance useEffect checks for `data.classData` existence before advancing to 'subclass' step

This is a **hotfix** that should be deployed before Feature 004 (Basic Information Bug Fixes), as Feature 004 Bug #6 will remove the auto-advance logic entirely and prevent similar issues in the future.

## Technical Context

**Language/Version**: TypeScript 5.x, React 18.x
**Primary Dependencies**: React Hooks (useState, useEffect, useMemo), Radix UI components, D&D 5e API
**Storage**: localStorage (character creation progress), context API (CharacterCreationContext)
**Testing**: Manual testing (Playwright for reproduction), unit tests (future)
**Target Platform**: Web browser (Cloudflare Pages deployment)
**Project Type**: Web (frontend-only fix)
**Performance Goals**: Sub-step progression < 100ms (per Feature 004 SC-003)
**Constraints**: No backend changes, must maintain backward compatibility with existing localStorage data
**Scale/Scope**: Single component fix (BasicInfoStep.tsx), affects 1 of 12 classes (Cleric) but may impact others

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Note**: The project does not have a formalized constitution file (template only). The following checks are based on project best practices evident from codebase:

### ✅ Simplicity & YAGNI
- **Status**: PASS
- **Rationale**: Fix adds minimal code (null-safety check + fallback UI), addresses specific blocking bug
- **No over-engineering**: Not creating abstractions, just defensive programming

### ✅ Test Coverage
- **Status**: PASS (with note)
- **Rationale**: Manual testing sufficient for hotfix, automated tests should follow
- **Action**: Manual test all 12 classes at levels 1, 3, 5 before deployment

### ✅ Performance
- **Status**: PASS
- **Rationale**: Null-safety check adds negligible overhead (<1ms), no API calls or complex logic

### ⚠️ Error Handling
- **Status**: PASS (improves current state)
- **Rationale**: Adds missing error handling (fallback UI when subclass data unavailable)
- **Current**: Blank screen with no user feedback
- **After Fix**: Error card with clear message and "Skip" option

### ✅ Maintainability
- **Status**: PASS
- **Rationale**: Fix aligns with Feature 004's larger refactoring, will be superseded by Bug #6 fix
- **Temporary**: Auto-advance useEffect will be removed in Feature 004, making this fix obsolete
- **Value**: Unblocks users immediately while proper refactor is in progress

**Constitution Re-Check After Phase 1**: Will verify that contracts and data models don't introduce complexity.

## Project Structure

### Documentation (this feature)

```text
specs/005-cleric-selection-bug/
├── spec.md              # Feature specification (COMPLETE)
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (technical research)
├── data-model.md        # Phase 1 output (component state models)
├── quickstart.md        # Phase 1 output (implementation guide)
├── contracts/           # Phase 1 output (component contracts)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Web application structure (frontend + backend)
frontend/
├── src/
│   ├── components/
│   │   ├── wizard/
│   │   │   └── steps/
│   │   │       └── BasicInfoStep.tsx          # PRIMARY FIX LOCATION (lines 377-404)
│   │   └── character-creation/
│   │       ├── SubclassSelector.tsx           # VERIFY: Handles empty subclass arrays
│   │       └── CharacterPreview.tsx           # RELATED: Bug #2 from Feature 004 (shows "?")
│   ├── types/
│   │   ├── dnd5e.ts                           # VERIFY: Class interface with subclasses array
│   │   └── wizard.ts                          # VERIFY: getSubclassLevel() function
│   ├── services/
│   │   └── dnd5eApi.ts                        # INVESTIGATE: fetchAllReferenceData() returns
│   └── contexts/
│       └── CharacterCreationContext.tsx       # VERIFY: Data flow and state updates
└── tests/
    └── components/
        └── wizard/
            └── BasicInfoStep.test.tsx         # ADD: Tests for null-safety

backend/ (NO CHANGES REQUIRED)
api/
└── src/
    └── routes/
        └── classes.ts                         # INVESTIGATE: Verify subclasses array populated
```

**Structure Decision**: This is a frontend-only hotfix affecting a single component (BasicInfoStep.tsx). The fix adds null-safety checks to the subclass rendering logic (lines 377-404) and defensive checks to the auto-advance useEffect (lines 68-91). No backend API changes required, but backend investigation needed to verify whether API is returning subclasses array for Cleric.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**No violations.** This hotfix follows simplicity principles and improves error handling without adding unnecessary complexity. The fix will be superseded by Feature 004 Bug #6 (auto-advance removal), which addresses the root cause.

---

## Phase 0: Research Tasks

### Research Task 1: Root Cause Verification
**Question**: Is the bug caused by missing API data, timing issue, or conditional rendering logic?

**Investigation Steps**:
1. Add console.log to `handleClassSelect` to log `cls.subclasses` length
2. Add console.log to auto-advance useEffect to log `data.classData?.subclasses` status
3. Verify D&D 5e API returns subclasses array for Cleric class
4. Check if timing issue: useEffect runs before `data.classData` is updated

**Expected Finding**: Either API is not returning subclasses, or there's a race condition in state updates.

### Research Task 2: Best Practices for Conditional Rendering with Undefined Data
**Question**: What is the React best practice for handling undefined data in conditional rendering?

**Investigation Areas**:
- Null-safety patterns: `data?.field && <Component />` vs `data?.field ? <Component /> : <Fallback />`
- Error boundary patterns for component-level failures
- Defensive programming: when to fail silently vs show error UI

**Expected Decision**: Use ternary operator with explicit fallback UI (error card) instead of short-circuit evaluation that results in blank screen.

### Research Task 3: D&D 5e Subclass Rules
**Question**: Which classes gain subclass at level 1 vs later levels?

**Investigation**: Review `getSubclassLevel()` function and D&D 5e PHB rules.

**Expected Finding**:
- Cleric: Level 1 (Divine Domain)
- Warlock: Level 1 (Otherworldly Patron)
- Sorcerer: Level 1 (Sorcerous Origin)
- Most others: Level 3

### Research Task 4: Testing Strategy for Class-Specific Bugs
**Question**: How to systematically test all 12 classes to ensure consistency?

**Investigation**:
- Manual testing checklist for each class at levels 1, 3, 5
- Playwright automation to test all class selections
- Data-driven testing approach (loop through classes array)

**Expected Outcome**: Manual testing checklist with clear pass/fail criteria for each class.

---

## Phase 1: Design & Contracts

**Prerequisites**: research.md complete

### Deliverable 1: data-model.md

**Content**:
- **SubStep State Model**: String literal type with 8 possible values
- **ClassData Entity**: D&D 5e Class interface with subclasses array
- **Subclass Entity**: Divine Domain (Cleric) or equivalent for other classes
- **Validation State**: Boolean flags for data completeness checks

**Key Diagrams**:
- State machine: Class selection → Subclass check → (Has subclasses? → Show selector : Skip to background)
- Data flow: handleClassSelect → onChange → Context update → Re-render → useEffect → setCurrentStep

### Deliverable 2: contracts/BasicInfoStep.contract.md

**Contract Sections**:
- **Input Contract**: Props interface (data, onChange, onValidationChange)
- **Output Contract**: Rendering guarantees (never blank screen)
- **Behavior Contract**: Sub-step progression rules (with null-safety)
- **Error Handling Contract**: Fallback UI for missing subclass data

**Key Requirements**:
- MUST check `data.classData?.subclasses` exists before rendering SubclassSelector
- MUST provide fallback UI (error card) when subclass data is undefined
- MUST log diagnostic information (class name, subclasses length) for debugging
- MUST NOT crash or show blank screen under any circumstances

### Deliverable 3: contracts/SubclassSelector.contract.md

**Contract Sections**:
- **Input Contract**: subclasses array (may be undefined or empty)
- **Output Contract**: Graceful handling of edge cases
- **Error Handling**: What to render when subclasses array is empty

**Key Requirements**:
- MUST handle undefined subclasses array gracefully
- MUST handle empty subclasses array (length === 0)
- SHOULD display meaningful message if no options available

### Deliverable 4: quickstart.md

**Structure**:
1. **Prerequisites**: Node.js, repository cloned, dependencies installed
2. **Step 1**: Add null-safety check to subclass rendering (lines 377-404)
3. **Step 2**: Add defensive logging to handleClassSelect (lines 135-143)
4. **Step 3**: Add data.classData check to auto-advance useEffect (lines 68-91)
5. **Step 4**: Manual testing checklist (all 12 classes)
6. **Step 5**: Deployment via Cloudflare Pages

**Time Estimate**: 1-2 hours total (30 min coding, 30 min testing, 30 min deployment)

### Deliverable 5: Agent Context Update

**Script**: `.specify/scripts/bash/update-agent-context.sh claude`

**New Technology to Add**:
- React conditional rendering patterns (ternary operator vs short-circuit)
- Null-safety with optional chaining (`?.`)
- D&D 5e subclass progression rules

**Preserve Existing**: All manual additions for React 18, TypeScript 5, Cloudflare Pages, etc.

---

## Implementation Phases

### Phase 0: Research & Clarification (1-2 hours)
**Status**: To be executed by `/speckit.plan` command

**Tasks**:
1. Investigate API response: Does Cleric class have subclasses array populated?
2. Confirm timing: Does useEffect run before classData is set?
3. Review D&D 5e rules: Which classes need subclass at level 1?
4. Document findings in research.md

**Output**: research.md with all NEEDS CLARIFICATION resolved

### Phase 1: Design & Contracts (1-2 hours)
**Status**: To be executed by `/speckit.plan` command

**Tasks**:
1. Create data-model.md with component state models
2. Write BasicInfoStep.contract.md with null-safety requirements
3. Write SubclassSelector.contract.md for graceful degradation
4. Create quickstart.md with step-by-step implementation guide
5. Update CLAUDE.md agent context with new patterns

**Output**: data-model.md, contracts/, quickstart.md, CLAUDE.md updated

### Phase 2: Task Breakdown (NOT executed by /speckit.plan)
**Status**: User must run `/speckit.tasks` command separately

**Tasks**:
1. Generate dependency-ordered task list
2. Each task references specific file and line numbers
3. Include test tasks (manual + automated)
4. Include deployment tasks

**Output**: tasks.md with executable task list

---

## Integration Points

### With Feature 004 (Basic Information Bug Fixes)
- **Conflict Risk**: Low (different lines in BasicInfoStep.tsx)
- **Feature 005**: Fixes lines 377-404 (subclass rendering) + lines 68-91 (useEffect defensive check)
- **Feature 004 Bug #6**: Removes lines 68-91 entirely (auto-advance useEffect)
- **Deployment Order**: Feature 005 first (hotfix), then Feature 004 (comprehensive fix)

### With SubclassSelector Component
- **Current**: May not handle undefined/empty subclasses array gracefully
- **Feature 005**: Prevents SubclassSelector from receiving undefined data
- **Future**: SubclassSelector should add defensive checks (separate task)

### With D&D 5e API
- **Investigation Required**: Verify API returns subclasses array for Cleric
- **If API broken**: Fix API first OR skip to background selection in frontend
- **If API works**: Timing issue in frontend, fix useEffect dependencies

---

## Deployment Strategy

### Testing Checklist
**Before deployment**:
- [ ] All 12 classes tested at level 1 (Barbarian, Bard, Cleric, Druid, Fighter, Monk, Paladin, Ranger, Rogue, Sorcerer, Warlock, Wizard)
- [ ] Cleric tested at levels 1, 3, 5, 10, 20
- [ ] Backward navigation tested (select Cleric, go back, select Fighter)
- [ ] Console logs verified (diagnostic information appears)
- [ ] No blank screens observed in any test case
- [ ] Fallback UI tested (if API fails to return subclasses)

### Deployment Steps
1. **Build**: `cd frontend && npm run build:production`
2. **Commit**: Git commit with descriptive message referencing Bug/Feature number
3. **Push**: Push to GitHub (triggers Cloudflare Pages deployment)
4. **Monitor**: Watch Cloudflare Pages build log for errors
5. **Verify**: Test Cleric selection on production site (https://dnd.cyberlees.dev)

### Rollback Plan
- If deployment fails: Revert commit and redeploy previous version
- If bug persists: Investigate API response, add more logging
- If new issues: Hotfix immediately or revert and investigate

---

## Success Criteria

**From spec.md**:
- **SC-001**: Users can select Cleric class and advance without blank screen (100% success rate)
- **SC-002**: All 12 classes exhibit consistent behavior (0 blank screens)
- **SC-003**: Sub-step progression < 100ms
- **SC-004**: Missing subclass data shows error message within 200ms (not blank screen)
- **SC-005**: Console logs provide debugging information

**Verification**:
- Manual testing: 100% pass rate on all 12 classes
- Production testing: Cleric character creation completes end-to-end
- No user reports of blank screens after deployment

---

## Timeline

**Total Estimate**: 4-6 hours (hotfix priority)

- **Phase 0 (Research)**: 1-2 hours
  - API investigation: 30 min
  - Timing analysis: 30 min
  - D&D 5e rules review: 15 min
  - Testing strategy: 15 min

- **Phase 1 (Design)**: 1-2 hours
  - data-model.md: 30 min
  - contracts/: 45 min (2 contracts)
  - quickstart.md: 30 min
  - Agent context update: 15 min

- **Phase 2 (Implementation)**: 1-2 hours
  - Code changes: 30 min
  - Manual testing: 30 min
  - Deployment: 30 min
  - Production verification: 15 min

**Target Deployment**: Same day as fix (hotfix urgency)

---

## Risk Assessment

### High Risk
- **API not returning subclasses**: If D&D 5e API is broken, fix requires backend changes (out of scope for hotfix)
  - **Mitigation**: Add fallback UI to skip subclass selection, allow users to continue

### Medium Risk
- **Timing issue persists**: If useEffect race condition not resolved by defensive check
  - **Mitigation**: Feature 004 Bug #6 will remove auto-advance entirely (proper fix)

### Low Risk
- **Other classes affected**: Bug may impact classes beyond Cleric
  - **Mitigation**: Manual testing of all 12 classes catches this before deployment

### No Risk
- **Backward compatibility**: No localStorage schema changes, no breaking changes to data structures

---

## Post-Deployment

### Monitoring
- Watch for user reports of blank screens (should drop to 0)
- Monitor console logs for diagnostic information
- Track character creation completion rate for Cleric class

### Future Work
- **Feature 004 Bug #6**: Remove auto-advance logic entirely (supersedes this hotfix)
- **SubclassSelector hardening**: Add defensive checks to handle undefined/empty arrays
- **Automated testing**: Write Playwright tests to catch similar bugs

---

**Status**: Ready for Phase 0 research execution
**Next Command**: Continue with research.md generation (automatic as part of `/speckit.plan`)
