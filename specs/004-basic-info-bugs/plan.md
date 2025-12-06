# Implementation Plan: Basic Information Area Bug Fixes

**Branch**: `004-basic-info-bugs` | **Date**: 2025-12-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-basic-info-bugs/spec.md`

## Summary

This feature fixes 7 bugs identified in the Basic Information step of the character creation wizard. The bugs range from critical data display issues (class skills showing "3 of 0", character preview showing "?") to medium-priority UX issues (no backward navigation through sub-steps) and low-priority enhancements (validation timing, level discoverability).

**Technical Approach**:
- Phase 1 (Critical): Fix CharacterPreview component to display friendly placeholders, and address class skill display (dependent on Bug #003 fix)
- Phase 2 (UX): Add click handlers to sub-step indicators for backward navigation, verify name input behavior
- Phase 3 (Enhancement): Improve validation timing and visual indicators

## Technical Context

**Language/Version**: TypeScript 5.x, React 18.x
**Primary Dependencies**: React, React hooks (useState, useEffect, useMemo, useRef), Tailwind CSS for styling
**Storage**: Browser localStorage (via CharacterCreationContext), Cloudflare D1 (backend)
**Testing**: React Testing Library, Playwright (E2E), Jest
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge), deployed on Cloudflare Pages
**Project Type**: Web application (frontend React + backend Cloudflare Workers)
**Performance Goals**: Sub-step navigation < 100ms, character preview updates < 100ms, wizard remains responsive during data loading
**Constraints**: Must maintain backward compatibility with existing character data in localStorage, cannot break existing wizard flow, must work without API (offline-first with fallback data)
**Scale/Scope**: 7 bugs across 3 components, affecting 1 wizard step with 8 sub-steps, impacts all users creating characters

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Project Constitution Status**: Constitution template exists but not yet filled in (`.specify/memory/constitution.md`).

Since no project-specific constitution principles are defined, applying general software engineering best practices:

**✅ Simplicity Gate**:
- Bug fixes maintain existing architecture, no new abstractions introduced
- Reuses existing React patterns (hooks, state management)
- Minimal code changes (3 components affected)

**✅ Test-First Gate**:
- Unit tests required for CharacterPreview with undefined data
- Integration tests required for sub-step navigation
- Manual E2E tests required for validation timing

**✅ Backward Compatibility Gate**:
- All changes are additive or fix existing bugs
- No breaking changes to component interfaces
- Character data structure unchanged

**⚠️ Dependency Gate**:
- Bug #1 depends on Bug #003 fix (class skill display) - must be implemented first or in parallel
- No new external dependencies required

**Action**: Proceed with planning. Re-evaluate after Phase 1 design to ensure no architectural complexity introduced.

## Project Structure

### Documentation (this feature)

```text
specs/004-basic-info-bugs/
├── spec.md              # Feature specification (DONE)
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (PENDING)
├── data-model.md        # Phase 1 output (PENDING) - Component state models
├── quickstart.md        # Phase 1 output (PENDING) - Developer guide for fixes
├── contracts/           # Phase 1 output (PENDING) - Component interfaces
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
│   │   │       └── BasicInfoStep.tsx          # Bug #3, #6, #7 fixes
│   │   └── character-creation/
│   │       ├── CharacterPreview.tsx            # Bug #2 fix (HIGH PRIORITY)
│   │       ├── ClassSelector.tsx               # Bug #1 fix (depends on #003)
│   │       ├── RaceSelector.tsx                # No changes
│   │       ├── BackgroundSelector.tsx          # No changes
│   │       └── SubclassSelector.tsx            # No changes
│   ├── types/
│   │   ├── wizard.ts                           # May need sub-step state types
│   │   └── dnd5e.ts                            # No changes expected
│   ├── contexts/
│   │   └── CharacterCreationContext.tsx        # No changes expected
│   └── services/
│       └── dnd5eApi.ts                         # No changes expected
└── tests/
    ├── components/
    │   ├── CharacterPreview.test.tsx           # New tests for Bug #2
    │   └── BasicInfoStep.test.tsx              # New tests for Bugs #3, #6, #7
    └── e2e/
        └── character-wizard.spec.ts            # Integration tests for navigation

backend/
└── [No backend changes required for this feature]
```

**Structure Decision**: This is a frontend-only bug fix feature. All changes confined to React components in `frontend/src/components/`. No API changes, no database migrations, no backend logic required. Testing will use existing React Testing Library setup and Playwright for E2E validation.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No constitution violations identified. All fixes maintain existing patterns and architecture. No new complexity introduced.

---

## Phase 0: Research & Technical Decisions

**Status**: PENDING (to be filled by `/speckit.plan` execution)

### Research Tasks

1. **React Hook Best Practices for Sub-Step Navigation**
   - Question: What's the best pattern for making sub-step indicators clickable without breaking progressive disclosure?
   - Research: React event handler patterns, accessibility (ARIA) requirements for wizard navigation
   - Decision Target: Button vs. anchor tag, disabled state handling, keyboard navigation support

2. **Character Preview Placeholder Patterns**
   - Question: What's the UX best practice for showing "not yet selected" states in a preview component?
   - Research: Review similar wizard implementations, accessibility guidelines for placeholder text
   - Decision Target: Exact wording ("Race: Not selected" vs "Pending" vs "—"), visual styling

3. **Validation Timing Patterns**
   - Question: When should validation errors appear in a multi-step wizard?
   - Research: Form validation best practices, pristine vs. dirty state tracking patterns in React
   - Decision Target: useEffect dependency strategy, dirty state tracking implementation

4. **Auto-Advance Prevention Strategies**
   - Question: How to prevent useEffect from auto-advancing during typing without breaking progressive disclosure?
   - Research: React useEffect patterns, debouncing vs. explicit Continue button
   - Decision Target: Modify existing useEffect or add explicit user action requirement

5. **Dependency on Bug #003**
   - Question: Can Bug #2 be fixed independently of Bug #1/#003?
   - Research: Review ClassSelector component, check if preview uses same data source
   - Decision Target: Implementation order, potential for parallel work

### Output Artifact

`research.md` will document:
- Chosen navigation pattern with code examples
- Placeholder text decisions with accessibility notes
- Validation timing strategy with dependency array patterns
- Auto-advance prevention approach
- Implementation order based on dependencies

---

## Phase 1: Design & Contracts

**Status**: PENDING (to be filled by `/speckit.plan` execution)

### Data Models

`data-model.md` will define:

1. **CharacterPreview Component State**
   ```typescript
   interface CharacterPreviewProps {
     characterConcept: {
       name: string
       race?: Race           // May be undefined
       class?: Class         // May be undefined
       background?: Background
       level: number
     }
     baseAbilityScores: AbilityScores
     compact: boolean
   }
   ```

2. **Sub-Step Navigation State**
   ```typescript
   type SubStep = 'name' | 'race' | 'class' | 'subclass' | 'background' | 'feat' | 'alignment' | 'complete'

   interface SubStepIndicator {
     step: SubStep
     index: number
     isActive: boolean
     isCompleted: boolean
     isClickable: boolean
   }
   ```

3. **Validation State Tracking**
   ```typescript
   interface ValidationState {
     isDirty: boolean        // Has user interacted?
     isValid: boolean
     errors: string[]
     touchedFields: Set<string>
   }
   ```

### Component Contracts

`contracts/` will include:

1. **CharacterPreview.tsx Contract**
   ```typescript
   // Input: May receive undefined race/class
   // Output: Always renders valid UI (never "?")
   // Behavior: Shows friendly placeholder when data missing
   ```

2. **BasicInfoStep.tsx Contract**
   ```typescript
   // Input: WizardStepProps with data, onChange, onValidationChange
   // Output: Renders sub-steps with clickable indicators
   // Behavior:
   //   - Allows backward navigation to completed steps
   //   - Prevents auto-advance during name typing
   //   - Delays validation until user interaction
   ```

3. **Sub-Step Indicator Contract**
   ```typescript
   // Input: Current step, list of steps, completion status
   // Output: Clickable buttons for completed steps, disabled for incomplete
   // Behavior: onClick sets currentStep, maintains data preservation
   ```

### API Contracts

No new API endpoints required. This is a frontend-only feature using existing D&D 5e API data.

### Quickstart Guide

`quickstart.md` will provide:
- How to test each bug fix locally
- How to run unit tests for new behaviors
- How to verify no regression in existing wizard flow
- How to test accessibility (keyboard navigation, screen readers)

### Agent Context Update

After Phase 1 design completion, run:
```bash
.specify/scripts/bash/update-agent-context.sh claude
```

This will update `.claude/agent-context.md` with:
- New component interface patterns for bug fixes
- Sub-step navigation state management approach
- Validation timing strategy
- Testing patterns for wizard components

---

## Phase 2: Task Breakdown

**Status**: NOT STARTED (requires `/speckit.tasks` command)

This phase is NOT executed by `/speckit.plan`. After completing Phase 0 (research) and Phase 1 (design), run:
```bash
/speckit.tasks
```

This will generate `tasks.md` with dependency-ordered implementation tasks based on the completed research and design artifacts.

**Expected Task Categories**:
1. **Critical Fixes** (Phase 1 from spec.md)
   - Task: Fix CharacterPreview "?" symbols (Bug #2)
   - Task: Coordinate with Bug #003 fix for class skills (Bug #1)

2. **UX Improvements** (Phase 2 from spec.md)
   - Task: Add sub-step indicator click handlers (Bug #3)
   - Task: Verify/fix name input auto-advance (Bug #6)

3. **Enhancements** (Phase 3 from spec.md)
   - Task: Improve validation timing (Bug #7)
   - Task: Optional enhancements (Bugs #4, #5)

4. **Testing Tasks**
   - Task: Write unit tests for CharacterPreview
   - Task: Write unit tests for sub-step navigation
   - Task: Write E2E tests for wizard flow
   - Task: Manual testing checklist execution

---

## Implementation Order

Based on dependencies and priority:

1. **First**: Research phase (resolves all technical questions)
2. **Second**: Design phase (contracts, data models, quickstart)
3. **Third**: Update agent context
4. **Fourth**: Generate tasks (via `/speckit.tasks`)
5. **Fifth**: Implement in priority order (Critical → UX → Enhancement)

**Parallel Work Opportunities**:
- Bug #2 (CharacterPreview) can be implemented independently
- Bug #3 (sub-step navigation) can be implemented independently
- Bug #1 depends on Bug #003 - must coordinate or wait

**Testing Strategy**:
- Unit tests written alongside each fix
- Integration tests after all fixes complete
- E2E tests validate entire wizard flow
- Manual testing validates accessibility and edge cases

---

## Success Criteria Validation

Implementation complete when:
- ✅ All unit tests pass (new + existing)
- ✅ All integration tests pass
- ✅ Manual testing checklist 100% complete
- ✅ No regressions in existing wizard functionality
- ✅ All 8 success criteria from spec.md met:
  - SC-001: Classes show "X of Y" format (depends on Bug #003)
  - SC-002: Preview shows friendly placeholders, never "?"
  - SC-003: Backward navigation works without data loss
  - SC-004: Name typing doesn't auto-advance
  - SC-005: Validation after interaction only
  - SC-006: 0% user confusion (via user testing)
  - SC-007: Preview updates < 100ms
  - SC-008: Navigation preserves 100% of data

---

## Deployment Plan

1. **Build**: `npm run build` in frontend/
2. **Deploy**: Automatic via Cloudflare Pages on push to main
3. **Verification**: Manual testing on https://dnd.cyberlees.dev
4. **Rollback**: Git revert if critical issues found

**Deployment Checklist**:
- [ ] All tests passing locally
- [ ] Code review completed
- [ ] Manual testing on staging (Cloudflare Pages preview)
- [ ] User acceptance testing (if applicable)
- [ ] Deploy to production
- [ ] Post-deployment smoke testing
- [ ] Monitor for errors/user reports

---

## Next Steps

1. Execute Phase 0 research (automated by this command)
2. Execute Phase 1 design (automated by this command)
3. Update agent context (automated by this command)
4. Review generated artifacts (manual)
5. Run `/speckit.tasks` to generate implementation tasks
6. Begin implementation following task order
