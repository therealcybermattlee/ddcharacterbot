# Research: Class Skill Display Bug Fix

**Feature**: 003-class-skill-display-fix
**Date**: 2025-11-27
**Phase**: 0 (Research & Investigation)

## Research Questions

From Constitution Check, we needed to resolve:
1. Are there API consumers beyond the frontend? (Backward compatibility scope)
2. What is the current database state for Bard and other classes' skill lists?
3. What migration strategy is needed?

## Findings

### 1. API Consumers & Backward Compatibility

**Research Question**: Are there API consumers beyond the frontend?

**Decision**: Proceed with API structure change.

**Rationale**:
- This is an internal API for a single-frontend application
- No external API consumers identified in codebase
- API is not versioned (no `/api/v1/` structure)
- Deployment is controlled (frontend + API deploy together via Cloudflare)
- **Risk**: Low. Frontend and API are tightly coupled and deploy atomically.

**Alternatives Considered**:
- **Backward compatibility layer**: Rejected. Adds complexity for zero benefit when we control all consumers.
- **Dual-format support**: Rejected. Same reason - unnecessary complexity.
- **Frontend transformation layer**: Rejected. Better to fix the root cause (API) than work around it.

### 2. Database State Investigation

**Research Question**: What is Bard's skill list in the database?

**Findings from Migration Files**:

**File**: `database/migrations/002_seed_reference_data.sql` (line 35)
```sql
-- Bard
('bard', 'Bard', 8, '["charisma"]', '["dexterity", "charisma"]', '[]', 3, ...)
                                                                    ^^^ EMPTY
```

**File**: `database/migrations/0002_dnd5e_reference_data.sql` (line 217)
```sql
-- Bard
'["Deception", "History", "Investigation", "Persuasion", "Sleight of Hand"]',
^^ ONLY 5 SKILLS (should be all 18)
```

**D&D 5e Official Rules**: Bard can choose **any 3 skills** from all 18 skills.

**All 18 D&D 5e Skills**:
1. Acrobatics
2. Animal Handling
3. Arcana
4. Athletics
5. Deception
6. History
7. Insight
8. Intimidation
9. Investigation
10. Medicine
11. Nature
12. Perception
13. Performance
14. Persuasion
15. Religion
16. Sleight of Hand
17. Stealth
18. Survival

**Database Issue**: Two different migrations with conflicting data:
- 002_seed_reference_data.sql: Empty array `'[]'`
- 0002_dnd5e_reference_data.sql: Partial list (5 skills)

**Decision**: Create new migration to update Bard with all 18 skills.

**Rationale**:
- Database is source of truth for API
- Frontend fallback data (SkillsProficienciesStep.tsx) has all 18 skills for Bard already
- Need database to match for consistency
- One migration file (0002) is duplicative/newer, suggests 002 is old

### 3. Migration Strategy

**Decision**: Create new migration file to fix Bard skill list, then update API response structure.

**Migration Plan**:
1. **Create**: `database/migrations/023_fix_bard_skill_list.sql`
   - Update Bard `skill_proficiencies` to include all 18 skills
   - Idempotent (use UPDATE WHERE id='bard')

2. **API Change**: Update `api/src/routes/classes.ts` to return nested structure

3. **Deployment Order**:
   - Deploy database migration first
   - Deploy API changes second
   - Frontend already compatible (no changes needed)

**Rationale**:
- Migrations are atomic and reversible
- Database first ensures data is correct before API change
- Frontend TypeScript interface already correct

### 4. TypeScript Interface Alignment

**Current Frontend Interface** (`frontend/src/types/dnd5e.ts:92-95`):
```typescript
skill_proficiencies: {
  choose: number
  from: string[]
}
```

**Current API Response** (`api/src/routes/classes.ts:71-72`):
```typescript
skillProficiencies: JSON.parse(dbClass.skill_proficiencies || '[]'),
skillChoices: dbClass.skill_choices || 0,
```

**Target API Response**:
```typescript
skill_proficiencies: {
  choose: dbClass.skill_choices || 0,
  from: JSON.parse(dbClass.skill_proficiencies || '[]')
},
```

**Decision**: Change API field name from `skillProficiencies` to `skill_proficiencies` and nest structure.

**Rationale**:
- Matches TypeScript interface exactly (snake_case)
- Nested structure cleaner than flat
- Aligns with frontend expectations
- Minimal code change (single transformation point)

### 5. Testing Strategy

**Decision**: Update existing tests + add new test cases.

**Test Cases to Add**:
1. **API Response Structure**:
   - Test `/api/classes` returns `skill_proficiencies.choose` and `skill_proficiencies.from`
   - Verify Bard has 18 skills in `from` array
   - Verify Cleric has 5 skills in `from` array

2. **Frontend Display**:
   - Test ClassSelector shows "3 of 18" for Bard
   - Test ClassSelector shows "2 of 5" for Cleric
   - Test all 12 classes display correct counts

3. **Database Integrity**:
   - Test migration 023 creates correct Bard data
   - Test migration is idempotent (can run multiple times safely)

**Rationale**:
- Existing test suites (Vitest) in place
- Need contract tests for API structure change
- Need integration tests for end-to-end display

## Technology Decisions

### Cloudflare D1 Database

**Decision**: Use UPDATE statement in migration instead of INSERT OR REPLACE.

**Rationale**:
- D1 supports standard SQL UPDATE
- UPDATE is more explicit about what's changing
- Less risk of overwriting other columns unintentionally

### JSON Parsing

**Decision**: Keep JSON parsing in API, don't move to database.

**Rationale**:
- D1 stores as TEXT, parsing required somewhere
- API layer is appropriate transformation point
- Keeps database schema simple

## Best Practices Applied

### API Design

**Pattern**: RESTful resource structure with nested objects

**Source**: [REST API Best Practices - Nested Resources](https://restfulapi.net/)

**Application**:
```typescript
{
  skill_proficiencies: {
    choose: 3,
    from: ["Acrobatics", "Animal Handling", ...]
  }
}
```

Instead of flat:
```typescript
{
  skillProficiencies: [...],
  skillChoices: 3
}
```

**Benefits**:
- Related data grouped logically
- Matches TypeScript type system
- Self-documenting structure

### Database Migrations

**Pattern**: Incremental, numbered migrations with idempotent operations

**Source**: [Database Migration Best Practices](https://www.prisma.io/dataguide/types/relational/migration-best-practices)

**Application**:
- Use sequential numbering (023)
- Use UPDATE WHERE instead of INSERT
- Include rollback notes in comments

**Benefits**:
- Safe to re-run
- Clear deployment order
- Reversible changes

### TypeScript Type Safety

**Pattern**: Single source of truth for types

**Source**: [TypeScript Handbook - Type Inference](https://www.typescriptlang.org/docs/handbook/type-inference.html)

**Application**:
- Frontend defines `Class` interface
- API response must match exactly
- No runtime type transformations

**Benefits**:
- Compile-time safety
- IDE autocomplete
- Refactoring confidence

## Unknowns Resolved

All NEEDS CLARIFICATION items from Technical Context resolved:

| Item | Status | Resolution |
|------|--------|-----------|
| Backward Compatibility | ✅ RESOLVED | No external consumers, safe to change |
| Database State | ✅ RESOLVED | Bard has incorrect data, needs migration |
| Migration Strategy | ✅ RESOLVED | New migration 023 + API update |

## Next Phase: Design

With all research complete, we can proceed to Phase 1 (Design & Contracts):
1. **data-model.md**: Document Class entity structure
2. **contracts/**: OpenAPI spec for `/api/classes` endpoint
3. **quickstart.md**: Implementation guide

**Status**: ✅ Research Complete. Ready for Phase 1.
