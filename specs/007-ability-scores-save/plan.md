# Implementation Plan: Ability Scores Not Persisting on Navigation

**Branch**: `007-ability-scores-save` | **Date**: 2025-12-07 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/007-ability-scores-save/spec.md`

## Summary

Fix the ability scores save bug where the Next button stays disabled even when all ability scores are complete. The issue is caused by unstable callback identity from the parent CharacterWizard component, resulting in stale closures in AbilityScoresStep. The solution is to apply the same ref pattern successfully used in SkillsProficienciesStep (Bug #23) and BasicInfoStep (Feature 006).

**Primary Requirement**: Ability scores must persist when users click Next and navigate forward, and the Next button must enable correctly when validation passes.

**Technical Approach**: Implement ref pattern in AbilityScoresStep.tsx - store `onValidationChange` and `onChange` callbacks in refs, update refs on every render, and call via refs to always get the latest callback version. This decouples the component from parent callback identity changes.

## Technical Context

**Language/Version**: TypeScript 5.x, React 18.x
**Primary Dependencies**: React 18.x (useState, useEffect, useRef hooks), CharacterCreationContext, localStorage
**Storage**: Client-side localStorage for character data persistence
**Testing**: Manual testing (automated tests out of scope for this bug fix)
**Target Platform**: Web browsers (Cloudflare Pages deployment)
**Project Type**: Web application (frontend-only bug fix)
**Performance Goals**: Ability score updates <100ms, validation state updates in real-time
**Constraints**: No breaking changes to component props or data structure, backward compatible
**Scale/Scope**: Single component fix (AbilityScoresStep.tsx), ~10 lines of code changes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Status**: ✅ PASSED

**Rationale**: This is a simple bug fix that:
- Does not add new dependencies or libraries
- Does not introduce new complexity or abstractions
- Uses existing React patterns (refs and effects)
- Follows established pattern from previous bug fixes (Bug #23, Feature 006)
- Maintains existing component contracts and interfaces
- Requires no changes to parent components or architecture

**No Violations**: This bug fix adheres to all project principles and introduces no additional complexity.

## Project Structure

### Documentation (this feature)

```text
specs/007-ability-scores-save/
├── plan.md              # This file (Phase 1 complete)
├── research.md          # Phase 0 complete - root cause analysis
├── data-model.md        # Phase 1 complete - entity definitions
├── quickstart.md        # Phase 1 complete - implementation guide
├── contracts/           # Phase 1 complete
│   └── AbilityScoresStep.contract.md
├── checklists/
│   └── requirements.md  # Spec validation (complete)
└── spec.md              # Feature specification (complete)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── components/
│   │   ├── wizard/
│   │   │   ├── CharacterWizard.tsx (parent - provides callbacks)
│   │   │   └── steps/
│   │   │       ├── AbilityScoresStep.tsx ← PRIMARY FIX HERE
│   │   │       ├── BasicInfoStep.tsx (reference - has ref pattern)
│   │   │       └── SkillsProficienciesStep.tsx (reference - has ref pattern)
│   │   └── character-creation/
│   │       └── AbilityScoreGenerator.tsx (child component)
│   ├── contexts/
│   │   └── CharacterCreationContext.tsx (state management)
│   └── types/
│       └── wizard.ts (WizardStepProps interface)
└── tests/ (not part of this fix)

backend/ (not affected by this fix)

api/ (not affected by this fix)
```

**Structure Decision**: Web application structure with frontend/backend separation. This fix only affects the frontend React component `AbilityScoresStep.tsx` in the wizard steps directory. No backend, API, or database changes required.

**Affected Files**:
1. **Primary**: `frontend/src/components/wizard/steps/AbilityScoresStep.tsx` (apply ref pattern)
2. **References**: `SkillsProficienciesStep.tsx` and `BasicInfoStep.tsx` (working examples of the fix)

## Complexity Tracking

**No complexity violations** - this is a simple bug fix using existing patterns.

---

## Phase 0: Research ✅ COMPLETE

**Status**: Complete
**Artifacts**: `research.md` created with comprehensive root cause analysis

**Key Findings**:
- **Root Cause**: Unstable callback identity from CharacterWizard's `handleValidationChange`
- **Impact**: AbilityScoresStep captures stale closures, validation doesn't update parent
- **Solution**: Ref pattern (proven in SkillsProficienciesStep and BasicInfoStep)
- **Lines to Change**: 1 (import), 49 (ref setup), 79, 134, 192, 195 (callback invocations)

---

## Phase 1: Design & Contracts ✅ COMPLETE

**Status**: Complete
**Artifacts**:
- `data-model.md` - Entity definitions and data flow
- `contracts/AbilityScoresStep.contract.md` - Component interface contract
- `quickstart.md` - Step-by-step implementation guide
- `plan.md` - This file (updated with technical context)

**Key Design Decisions**:
- Use ref pattern for both `onValidationChange` and `onChange` (consistency)
- Apply same pattern as Bug #23 and Feature 006 (proven solution)
- No changes to props interface or data structure (backward compatible)
- Empty dependency array is safe with ref pattern (documented)

---

## Phase 2: Task Generation (NEXT STEP)

**Status**: Not started (requires separate `/speckit.tasks` command)

**Expected Tasks**:
1. Apply ref pattern to AbilityScoresStep.tsx
2. Build and verify TypeScript compilation
3. Manual testing (7 test scenarios from quickstart.md)
4. Deploy to production
5. Verify success criteria

---

## Implementation Readiness

**Ready to Implement**: ✅ YES

All planning phases complete:
- ✅ Specification validated (requirements.md checklist passed)
- ✅ Root cause identified (research.md)
- ✅ Solution designed (data-model.md, contracts)
- ✅ Implementation guide ready (quickstart.md)
- ✅ Constitution check passed
- ✅ No blockers or unknowns

**Next Action**: Run `/speckit.tasks` to generate task breakdown for implementation.

---

**Last Updated**: 2025-12-07
**Status**: Phase 1 Complete - Ready for Task Generation
**Estimated Implementation Time**: 30 minutes + 20 minutes testing
