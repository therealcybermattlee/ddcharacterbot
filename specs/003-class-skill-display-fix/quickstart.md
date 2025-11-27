# Quickstart: Class Skill Display Bug Fix

**Feature**: 003-class-skill-display-fix
**Date**: 2025-11-27
**Estimated Time**: 2-3 hours

## Overview

Fix the class skill count display bug where some classes (e.g., Bard) show incorrect skill counts like "3 of 0" instead of "3 of 18".

**Root Cause**: API returns flat `skillProficiencies` array instead of nested `skill_proficiencies: {choose, from}` structure expected by frontend.

**Solution**:
1. Update Bard database record to include all 18 skills
2. Change API response structure to match frontend TypeScript interface
3. Verify display shows correct counts

## Prerequisites

- [x] Feature branch created: `003-class-skill-display-fix`
- [x] Research complete: [research.md](./research.md)
- [x] Data model defined: [data-model.md](./data-model.md)
- [x] API contract specified: [contracts/classes-api.yaml](./contracts/classes-api.yaml)

## Implementation Steps

### Step 1: Database Migration (15 min)

**File**: Create `database/migrations/023_fix_bard_skill_list.sql`

**Task**: Update Bard to have all 18 D&D 5e skills

```sql
-- Migration 023: Fix Bard skill list to include all 18 D&D 5e skills
-- Bard should be able to choose from ANY skill, not just 5

UPDATE classes
SET skill_proficiencies = '["Acrobatics", "Animal Handling", "Arcana", "Athletics", "Deception", "History", "Insight", "Intimidation", "Investigation", "Medicine", "Nature", "Perception", "Performance", "Persuasion", "Religion", "Sleight of Hand", "Stealth", "Survival"]'
WHERE id = 'bard' AND is_homebrew = 0;

-- Verify the update
SELECT id, name, skill_proficiencies, skill_choices
FROM classes
WHERE id = 'bard';

-- Expected result:
-- id: bard
-- name: Bard
-- skill_proficiencies: ["Acrobatics", "Animal Handling", ..., "Survival"] (18 skills)
-- skill_choices: 3
```

**Commands**:
```bash
# Create migration file
cat > database/migrations/023_fix_bard_skill_list.sql <<'EOF'
[paste SQL above]
EOF

# Run migration on development database
cd api
npx wrangler d1 execute dnd-character-manager-dev \
  --file=../database/migrations/023_fix_bard_skill_list.sql

# Verify
npx wrangler d1 execute dnd-character-manager-dev \
  --command="SELECT id, name, skill_proficiencies FROM classes WHERE id='bard'"
```

**Verification**: Bard should have 18 skills in the returned JSON array.

---

### Step 2: Update API Response Structure (30 min)

**File**: `api/src/routes/classes.ts`

**Location**: Lines 68-73 (or search for `skillProficiencies`)

**Current Code**:
```typescript
const transformedClass = {
  id: dbClass.id,
  name: dbClass.name,
  hitDie: dbClass.hit_die,
  primaryAbility: JSON.parse(dbClass.primary_ability || '[]'),
  savingThrowProficiencies: JSON.parse(dbClass.saving_throw_proficiencies || '[]'),
  skillProficiencies: JSON.parse(dbClass.skill_proficiencies || '[]'),
  skillChoices: dbClass.skill_choices || 0,
  // ... rest of fields
}
```

**New Code**:
```typescript
const transformedClass = {
  id: dbClass.id,
  name: dbClass.name,
  hitDie: dbClass.hit_die,
  primaryAbility: JSON.parse(dbClass.primary_ability || '[]'),
  savingThrowProficiencies: JSON.parse(dbClass.saving_throw_proficiencies || '[]'),
  skill_proficiencies: {
    choose: dbClass.skill_choices || 0,
    from: JSON.parse(dbClass.skill_proficiencies || '[]')
  },
  // ... rest of fields (remove skillChoices line)
}
```

**Changes**:
1. Rename field: `skillProficiencies` → `skill_proficiencies`
2. Nest structure: Create object with `choose` and `from` properties
3. Remove: Separate `skillChoices` field (now part of nested object)

**Apply to all locations**:
- Search file for ALL occurrences of `skillProficiencies`
- Replace with nested `skill_proficiencies` structure
- Ensure camelCase → snake_case conversion for field name

---

### Step 3: Update API Tests (45 min)

**File**: `api/tests/routes/classes.test.ts` (or create if doesn't exist)

**Add Test Cases**:

```typescript
import { describe, it, expect } from 'vitest'

describe('GET /api/classes', () => {
  it('should return classes with skill_proficiencies in correct format', async () => {
    const response = await fetch('http://localhost:8787/api/classes')
    const data = await response.json()

    expect(data.success).toBe(true)
    expect(Array.isArray(data.data.classes)).toBe(true)

    const bard = data.data.classes.find(c => c.id === 'bard')
    expect(bard).toBeDefined()
    expect(bard.skill_proficiencies).toHaveProperty('choose')
    expect(bard.skill_proficiencies).toHaveProperty('from')
    expect(bard.skill_proficiencies.choose).toBe(3)
    expect(Array.isArray(bard.skill_proficiencies.from)).toBe(true)
    expect(bard.skill_proficiencies.from.length).toBe(18)
  })

  it('should have all 18 skills for Bard', async () => {
    const response = await fetch('http://localhost:8787/api/classes/bard')
    const data = await response.json()

    const expectedSkills = [
      'Acrobatics', 'Animal Handling', 'Arcana', 'Athletics',
      'Deception', 'History', 'Insight', 'Intimidation',
      'Investigation', 'Medicine', 'Nature', 'Perception',
      'Performance', 'Persuasion', 'Religion', 'Sleight of Hand',
      'Stealth', 'Survival'
    ]

    expect(data.data.skill_proficiencies.from).toEqual(expect.arrayContaining(expectedSkills))
    expect(data.data.skill_proficiencies.from.length).toBe(18)
  })

  it('should have 5 skills for Cleric', async () => {
    const response = await fetch('http://localhost:8787/api/classes/cleric')
    const data = await response.json()

    expect(data.data.skill_proficiencies.choose).toBe(2)
    expect(data.data.skill_proficiencies.from.length).toBe(5)
    expect(data.data.skill_proficiencies.from).toContain('History')
    expect(data.data.skill_proficiencies.from).toContain('Insight')
  })
})
```

**Run Tests**:
```bash
cd api
npm test -- classes.test.ts
```

---

### Step 4: Frontend Verification (15 min)

**File**: `frontend/src/components/character-creation/ClassSelector.tsx`

**No changes needed!** Frontend already expects the correct structure.

**Verify Display Code** (line 360):
```typescript
<div className="text-muted-foreground">
  {cls?.skill_proficiencies?.choose || 0} of {cls?.skill_proficiencies?.from?.length || 0}
</div>
```

This will now work correctly once API returns the nested structure.

---

### Step 5: Integration Testing (30 min)

**Manual Testing Checklist**:

1. **Start Development Servers**:
   ```bash
   # Terminal 1: API
   cd api
   npm run dev

   # Terminal 2: Frontend
   cd frontend
   npm run dev
   ```

2. **Test Class Selector Display**:
   - Navigate to: http://localhost:5173/characters/new
   - Check each class card:
     - ✅ Bard shows: "Skills: 3 of 18"
     - ✅ Cleric shows: "Skills: 2 of 5"
     - ✅ Wizard shows: "Skills: 2 of 6"
     - ✅ Rogue shows: "Skills: 4 of 11"
     - ✅ All classes show "X of Y" format (no "X of 0")

3. **Test API Directly**:
   ```bash
   # Get all classes
   curl http://localhost:8787/api/classes | jq '.data.classes[] | {name: .name, skills: .skill_proficiencies}'

   # Get Bard specifically
   curl http://localhost:8787/api/classes/bard | jq '.data.skill_proficiencies'

   # Expected output:
   # {
   #   "choose": 3,
   #   "from": ["Acrobatics", "Animal Handling", ...]  // 18 skills
   # }
   ```

4. **Test Character Creation Flow**:
   - Complete Basic Info step (select Bard)
   - Navigate to Skills & Proficiencies step
   - Verify skill selection shows all 18 skills
   - Select 3 skills
   - Verify Next button enables

---

### Step 6: Deployment (15 min)

**Deploy Database Migration**:
```bash
cd api

# Development
npx wrangler d1 execute dnd-character-manager-dev \
  --file=../database/migrations/023_fix_bard_skill_list.sql

# Staging (after dev verification)
npx wrangler d1 execute dnd-character-manager-staging \
  --file=../database/migrations/023_fix_bard_skill_list.sql

# Production (after staging verification)
npx wrangler d1 execute dnd-character-manager-prod \
  --file=../database/migrations/023_fix_bard_skill_list.sql
```

**Deploy API**:
```bash
cd api

# Deploy to development
npx wrangler deploy --env development

# Test development endpoint
curl https://dnd-character-manager-api-dev.cybermattlee-llc.workers.dev/api/classes/bard | jq '.data.skill_proficiencies'
```

**Deploy Frontend**:
```bash
# Frontend auto-deploys via Cloudflare Pages on git push
git add -A
git commit -m "fix: Update API to return nested skill_proficiencies structure (Feature 003)"
git push origin 003-class-skill-display-fix

# Create PR to main
gh pr create --title "Fix class skill display bug" --body "Fixes #003 - Updates API response structure"
```

---

## Rollback Plan

If issues arise after deployment:

**Database Rollback** (Not needed - migration only adds data):
```sql
-- To revert Bard to previous state (if needed):
UPDATE classes
SET skill_proficiencies = '["Deception", "History", "Investigation", "Persuasion", "Sleight of Hand"]'
WHERE id = 'bard' AND is_homebrew = 0;
```

**API Rollback**:
```bash
# Revert to previous deployment
cd api
npx wrangler rollback --env development
```

---

## Completion Checklist

- [ ] Migration 023 created and tested locally
- [ ] Migration deployed to dev database
- [ ] API response structure updated in `api/src/routes/classes.ts`
- [ ] API tests added and passing
- [ ] Local testing complete (all classes show correct counts)
- [ ] API deployed to development
- [ ] Frontend tested against development API
- [ ] Migration deployed to staging/production
- [ ] API deployed to staging/production
- [ ] Frontend PR merged and deployed
- [ ] Production verification complete
- [ ] MEMORY.md updated with deployment details

---

## Time Breakdown

| Task | Estimated | Actual |
|------|-----------|--------|
| Database Migration | 15 min | ___ |
| API Code Changes | 30 min | ___ |
| API Tests | 45 min | ___ |
| Frontend Verification | 15 min | ___ |
| Integration Testing | 30 min | ___ |
| Deployment | 15 min | ___ |
| **Total** | **2h 30min** | ___ |

---

## Related Files

- **Spec**: [spec.md](./spec.md)
- **Research**: [research.md](./research.md)
- **Data Model**: [data-model.md](./data-model.md)
- **API Contract**: [contracts/classes-api.yaml](./contracts/classes-api.yaml)
- **Plan**: [plan.md](./plan.md)

**Status**: ✅ Quickstart Complete. Ready for implementation via `/speckit.tasks`.
