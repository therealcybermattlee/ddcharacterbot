# Implementation Plan: Class Skill Display Bug Fix

**Branch**: `003-class-skill-display-fix` | **Date**: 2025-11-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-class-skill-display-fix/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Fix data structure mismatch between API and frontend causing incorrect skill count display (e.g., Bard shows "3 of 0" instead of "3 of 18"). Update API response in `api/src/routes/classes.ts` to return nested `skill_proficiencies: {choose, from}` structure matching frontend TypeScript interface. Ensure Bard and other "any skill" classes have complete skill lists in database.

## Technical Context

**Language/Version**: TypeScript 5.x (Frontend), TypeScript 5.x on Cloudflare Workers (Backend)
**Primary Dependencies**: React 18, Vite (Frontend); Hono, Cloudflare Workers SDK (Backend)
**Storage**: Cloudflare D1 SQLite database
**Testing**: Vitest (Frontend), Vitest (Backend)
**Target Platform**: Cloudflare Workers (API), Cloudflare Pages (Frontend)
**Project Type**: Web application (backend + frontend)
**Performance Goals**: API response < 100ms, Frontend render < 50ms
**Constraints**: Cloudflare Workers runtime limits, no breaking changes to existing API consumers
**Scale/Scope**: 12 D&D classes, ~18 skills total in D&D 5e, affects class selection UI and data API

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Note**: No project constitution file populated yet. Using standard software engineering practices.

| Check | Status | Notes |
|-------|--------|-------|
| **No Breaking Changes** | ⚠️ NEEDS VERIFICATION | API structure change could break existing consumers. Need backward compatibility strategy. |
| **Test Coverage** | ✅ PASS | Existing test suites in place (Vitest). Will add tests for new structure. |
| **TypeScript Safety** | ✅ PASS | Frontend already has correct TypeScript interface. API change will align to it. |
| **Performance** | ✅ PASS | Minimal performance impact - just restructuring existing data. |
| **Database Integrity** | ⚠️ NEEDS VERIFICATION | Need to verify Bard skill list in database. May need migration. |

**Action Items Before Research**:
1. Determine if API consumers exist beyond frontend (backward compatibility scope)
2. Check current database state for Bard and other classes' skill lists
3. Plan migration strategy if database update needed

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
api/
├── src/
│   ├── routes/
│   │   └── classes.ts              # API response transformation (MAIN FIX)
│   └── types.ts                    # TypeScript interfaces
└── tests/
    └── routes/
        └── classes.test.ts         # Tests for new structure

frontend/
├── src/
│   ├── components/
│   │   └── character-creation/
│   │       └── ClassSelector.tsx   # Display logic (already correct)
│   ├── types/
│   │   └── dnd5e.ts                # Class interface (already correct)
│   └── services/
│       └── dnd5eApi.ts             # May need transformation layer
└── tests/
    └── components/
        └── ClassSelector.test.tsx  # Update tests for new structure

database/
└── migrations/
    └── 0XX_update_bard_skills.sql  # If needed: populate Bard skill list
```

**Structure Decision**: Web application structure (backend + frontend). This is a bug fix affecting:
1. **Primary Change**: `api/src/routes/classes.ts` response transformation
2. **Secondary**: Database migration if Bard skill list incomplete
3. **Verification**: Frontend already correct, just needs API to match

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
