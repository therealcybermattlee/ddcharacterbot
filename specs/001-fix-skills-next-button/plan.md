# Implementation Plan: Fix Skills & Proficiencies Next Button

**Branch**: `001-fix-skills-next-button` | **Date**: 2025-11-26 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-fix-skills-next-button/spec.md`

## Summary

Fix the validation logic in the Skills & Proficiencies wizard step to ensure the Next button properly enables/disables based on skill selection state. The issue appears to be a regression or incomplete fix from Bug #22 (Session 30), where the validation useEffect dependencies may not properly trigger when skill selections change. The fix must ensure validation runs immediately when selections are complete, handle localStorage restoration correctly, and work even when API data hasn't loaded yet.

## Technical Context

**Language/Version**: TypeScript 5.6.3, React 18.3.1
**Primary Dependencies**: React (hooks: useState, useEffect, useMemo), React Router DOM 6.26.2, Axios 1.7.7
**Storage**: localStorage (browser) for character creation state persistence
**Testing**: Vitest 3.0.0, @testing-library/react 16.3.0
**Target Platform**: Modern web browsers (ES2020+), deployed to Cloudflare Pages
**Project Type**: Web application (frontend + backend separation)
**Performance Goals**: <100ms validation response time, real-time button state updates
**Constraints**: Must work offline with fallback data, no race conditions between state updates, backwards compatible with existing localStorage data
**Scale/Scope**: Single component fix (~850 lines), affects critical user flow (character creation wizard)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Status**: ✅ NOT APPLICABLE - This is a bug fix for existing functionality, not new feature development. The constitution template is empty and provides no enforceable gates for this project.

## Project Structure

### Documentation (this feature)

```text
specs/001-fix-skills-next-button/
├── plan.md              # This file (/speckit.plan command output)
├── spec.md              # Feature specification (already created)
├── checklists/          # Quality checklists
│   └── requirements.md  # Specification quality checklist (already created)
├── research.md          # Phase 0 output (to be created)
├── data-model.md        # Phase 1 output (to be created)
├── quickstart.md        # Phase 1 output (to be created)
└── contracts/           # Phase 1 output (to be created)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── components/
│   │   └── wizard/
│   │       ├── steps/
│   │       │   └── SkillsProficienciesStep.tsx    # PRIMARY FIX TARGET (849 lines)
│   │       └── CharacterWizard.tsx                # Wizard container (manages Next button state)
│   ├── contexts/
│   │   └── CharacterCreationContext.tsx           # Provides onValidationChange callback
│   ├── types/
│   │   ├── wizard.ts                              # WizardStepProps interface
│   │   └── dnd5e.ts                               # D&D type definitions
│   └── services/
│       └── api.ts                                 # API service with fallback handling
└── tests/
    └── components/
        └── wizard/
            └── SkillsProficienciesStep.test.tsx   # Tests to be added/updated
```

**Structure Decision**: This is a focused bug fix in the existing frontend codebase. The primary change will be in `SkillsProficienciesStep.tsx`, specifically the validation useEffect hook (lines 360-420). No new files or architectural changes are required.

## Complexity Tracking

**Status**: ✅ NO VIOLATIONS - This is a straightforward bug fix within existing architecture.

---

## Phase 0: Research & Root Cause Analysis

### Investigation Areas

1. **Previous Fix Analysis (Bug #22)**
   - **Task**: Analyze the Session 30 fix that added `selectedClassSkills` and `selectedRaceSkills` to useEffect dependencies (line 417)
   - **Questions**:
     - Was the fix actually deployed to production?
     - Are there other useEffect hooks that might conflict?
     - Could there be stale closures over the validation state?
   - **Approach**: Review git history, check deployment logs, trace validation flow

2. **Validation Flow Tracing**
   - **Task**: Map the complete validation data flow from skill selection to Next button state
   - **Path**:
     1. User clicks skill → `handleClassSkillToggle` or `handleRaceSkillToggle`
     2. Updates `selectedClassSkills` or `selectedRaceSkills` state
     3. Triggers validation useEffect (line 360)
     4. Calls `onValidationChange(isValid, errors)`
     5. CharacterCreationContext updates wizard state
     6. CharacterWizard re-renders with updated `isStepValid`
     7. Next button enabled/disabled
   - **Questions**:
     - Where might this chain break?
     - Are there batched state updates causing delays?
     - Is onValidationChange being called but ignored?

3. **React Hooks Best Practices for Validation**
   - **Task**: Research proper patterns for dependent validation in React
   - **Topics**:
     - useEffect dependency arrays for validation logic
     - Avoiding race conditions between multiple state updates
     - When to use useCallback vs inline functions in dependencies
     - Handling validation with async data (API loading states)
   - **Resources**: React docs on useEffect, common validation patterns

4. **Edge Cases from Spec**
   - **Task**: Identify potential edge cases that might cause validation to fail
   - **Cases**:
     - Rapid toggling of skills (multiple state updates queued)
     - API returning different skill counts than expected
     - localStorage containing invalid/corrupted skill data
     - Switching characters mid-creation
     - Class/race changes in previous steps after skills selected
   - **Approach**: Create test scenarios for each case

5. **localStorage State Restoration**
   - **Task**: Verify localStorage restoration logic properly triggers validation
   - **Questions**:
     - When does `getInitialClassSkills()` run vs when does validation useEffect run?
     - Could there be a timing issue where validation runs before state is restored?
     - Does the validation useEffect fire during initial render?

### Research Output Format

**File**: `research.md`

Each research item will include:
- **Finding**: What was discovered
- **Impact**: How it affects the bug fix
- **Recommendation**: Proposed solution approach
- **Alternatives Considered**: Other approaches evaluated and why they were rejected

---

## Phase 1: Design & Implementation Strategy

**Prerequisites:** `research.md` complete with root cause identified

### 1. Data Model

**File**: `data-model.md`

Since this is a bug fix, there are no new entities. However, we need to document the validation state model:

**Validation State Flow**:
```
SkillSelectionState {
  selectedClassSkills: Set<SkillName>      // User's class skill selections
  selectedRaceSkills: Set<SkillName>       // User's race skill selections
  classData: ClassData | null              // API data (may be null during loading)
  raceSkillCount: number                   // Required race skills (0-2)
}

ValidationState {
  isValid: boolean                         // True when all requirements met
  errors: string[]                         // List of validation error messages
}

ValidationRules {
  classSkillsRule: selectedClassSkills.size === classData?.skillChoices
  raceSkillsRule: raceSkillCount > 0 ? selectedRaceSkills.size === raceSkillCount : true
  fallbackRule: if (!classData && finalSkillProficiencies.size === 0) → invalid
}
```

### 2. API Contracts

**File**: `contracts/validation.contract.md`

**Component Interface Contract**:
```typescript
interface WizardStepProps {
  data: CharacterCreationData;
  onChange: (data: Partial<CharacterCreationData>) => void;
  onValidationChange: (isValid: boolean, errors: string[]) => void;
  // Contract: onValidationChange MUST be called whenever validation state changes
  // Contract: onValidationChange MUST be called synchronously (not debounced)
}

// Validation Contract
// MUST validate when:
// - selectedClassSkills changes
// - selectedRaceSkills changes
// - classData loads/changes
// - raceSkillCount changes
// - Component mounts with restored data

// MUST NOT validate when:
// - onChange or onValidationChange callbacks change (causes infinite loops)
```

### 3. Implementation Strategy

**File**: `quickstart.md`

**Fix Strategy** (based on research findings):

1. **Verify Current State**
   - Use browser DevTools to inspect actual component state when bug occurs
   - Add temporary console.log statements to trace validation flow
   - Confirm which dependencies are actually triggering useEffect

2. **Root Cause Resolution** (one of these, determined by research):

   **Option A: Dependencies Missing**
   - Add missing dependencies to useEffect array
   - Ensure all state that affects validation is included

   **Option B: Infinite Loop Prevention**
   - Move onValidationChange to a ref to exclude from dependencies
   - Use useCallback to stabilize onChange if needed

   **Option C: Batched Updates Issue**
   - Use flushSync to force synchronous state updates
   - Or restructure to use single state update pattern

   **Option D: Race Condition**
   - Ensure validation runs AFTER state updates complete
   - Use useLayoutEffect instead of useEffect if timing critical

3. **Testing Strategy**
   - Unit tests for validation logic in isolation
   - Integration tests for full wizard flow
   - Manual testing for each acceptance scenario from spec
   - Regression tests for previous bugs (#14, #16, #21, #22)

4. **Deployment Verification**
   - Deploy to Cloudflare Pages preview
   - Test all user stories from spec
   - Verify localStorage scenarios
   - Confirm API fallback handling

### 4. Agent Context Update

After Phase 1 design is complete, run:
```bash
.specify/scripts/bash/update-agent-context.sh claude
```

This will update the Claude-specific context file with any new patterns or technologies discovered during research (though none are expected for this bug fix).

---

## Phase 2: Task Generation

**Not included in this plan - generated by `/speckit.tasks` command**

The tasks file will break down the implementation into:
- Investigation tasks (reproduce bug, identify root cause)
- Fix implementation tasks (code changes)
- Testing tasks (unit tests, integration tests, manual testing)
- Documentation tasks (update MEMORY.md, commit messages)
- Deployment tasks (build, deploy, verify)

---

## Next Steps

1. **Execute Phase 0**: Run research tasks to identify root cause
2. **Complete Phase 1**: Generate data-model.md, contracts/, quickstart.md
3. **Run `/speckit.tasks`**: Generate detailed task breakdown
4. **Implement Fix**: Execute tasks in dependency order
5. **Verify**: Test all acceptance scenarios from spec.md
6. **Deploy**: Push to production and monitor

**Current Status**: ✅ Planning complete, ready for Phase 0 research