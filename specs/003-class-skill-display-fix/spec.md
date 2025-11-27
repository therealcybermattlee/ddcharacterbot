# Feature 003: Class Skill Display Bug Fix

**Status:** Specification
**Created:** 2025-11-27
**Branch:** feature/003-class-skill-display-fix
**Priority:** High
**Type:** Bug Fix

## Problem Statement

The class selection UI shows incorrect skill counts for some classes. Specifically:
- **Bard** displays "Skills: 3 of 0" instead of "Skills: 3 of 18" (or appropriate count)
- Other classes with large skill lists may have similar issues
- **Cleric** displays correctly as "Skills: 2 of 5" (working as expected)

### Root Cause

There is a **data structure mismatch** between the API and frontend:

**Frontend expects** (`frontend/src/types/dnd5e.ts:92-95`):
```typescript
skill_proficiencies: {
  choose: number
  from: string[]
}
```

**API returns** (`api/src/routes/classes.ts:71-72`):
```typescript
skillProficiencies: string[]  // Flat array
skillChoices: number
```

**Frontend displays** (`frontend/src/components/character-creation/ClassSelector.tsx:360`):
```typescript
{cls?.skill_proficiencies?.choose || 0} of {cls?.skill_proficiencies?.from?.length || 0}
```

This code expects `skill_proficiencies.from.length` but the API provides `skillProficiencies` as a flat array, so `from` is undefined, resulting in `|| 0`.

### Evidence

API response for Bard:
```json
{
  "name": "Bard",
  "skillProficiencies": [],
  "skillChoices": 3
}
```

API response for Cleric:
```json
{
  "name": "Cleric",
  "skillProficiencies": ["History", "Insight", "Medicine", "Persuasion", "Religion"],
  "skillChoices": 2
}
```

Bard has an empty `skillProficiencies` array because Bards can choose from ANY skill (all 18 D&D skills), but the API doesn't populate this. The display code then shows "3 of 0" because it can't find the `from` array.

## Solution Options

### Option A: Fix API Response Structure (Recommended)
Modify `api/src/routes/classes.ts` to return the expected nested structure:

```typescript
{
  skill_proficiencies: {
    choose: dbClass.skill_choices || 0,
    from: JSON.parse(dbClass.skill_proficiencies || '[]')
  }
}
```

**Pros:**
- Matches TypeScript interface expectations
- Consistent with frontend code
- No frontend changes needed

**Cons:**
- Breaking change for API consumers
- Requires updating API everywhere it's used

### Option B: Fix Frontend Display Logic
Modify `ClassSelector.tsx:360` to work with current API structure:

```typescript
{cls?.skillChoices || cls?.skill_proficiencies?.choose || 0} of {cls?.skillProficiencies?.length || cls?.skill_proficiencies?.from?.length || 0}
```

**Pros:**
- No API changes
- Backward compatible

**Cons:**
- Doesn't fix the type mismatch
- Still need to populate full skill list for Bard (18 skills)

### Option C: Hybrid Approach (Best)
1. Fix API to return proper structure (Option A)
2. Ensure Bard's `skill_proficiencies` includes all 18 D&D skills in the database
3. Add data transformation layer in API to handle edge cases

## Recommended Solution: Option C

### Implementation Steps

1. **Update Database Migration** (`database/migrations/`)
   - Ensure Bard class has all 18 skills in `skill_proficiencies` column
   - Verify other "any skill" classes (if any)

2. **Update API Response** (`api/src/routes/classes.ts:68-73`)
   - Change from:
     ```typescript
     skillProficiencies: JSON.parse(dbClass.skill_proficiencies || '[]'),
     skillChoices: dbClass.skill_choices || 0,
     ```
   - To:
     ```typescript
     skill_proficiencies: {
       choose: dbClass.skill_choices || 0,
       from: JSON.parse(dbClass.skill_proficiencies || '[]')
     },
     ```

3. **Update Frontend Service** (`frontend/src/services/dnd5eApi.ts`)
   - Update data transformation to handle both old and new formats (temporary backward compatibility)

4. **Verification**
   - Test all 12 classes display correct "X of Y" format
   - Verify Bard shows "3 of 18"
   - Verify Cleric still shows "2 of 5"

## Files Affected

### API (Backend)
- `api/src/routes/classes.ts` - Lines 68-73 (response transformation)
- `database/migrations/` - Bard skill data population

### Frontend
- `frontend/src/types/dnd5e.ts` - Already correct, no changes needed
- `frontend/src/components/character-creation/ClassSelector.tsx` - Already correct, will work once API fixed
- `frontend/src/services/dnd5eApi.ts` - May need transformation layer for compatibility

## Testing Checklist

- [ ] Bard displays "Skills: 3 of 18"
- [ ] Cleric displays "Skills: 2 of 5"
- [ ] All 12 classes show correct skill counts
- [ ] API response matches TypeScript `Class` interface
- [ ] No TypeScript errors in frontend
- [ ] Character creation wizard skills step works correctly

## Related Issues

- **User Report:** "check for any issues having to do with the class cleric"
- **Actual Issue:** Not specific to Cleric; affects classes with empty/incomplete skill lists
- **Cleric Status:** Working correctly, no Cleric-specific issues found

## Notes

- This bug was discovered while investigating potential Cleric class issues
- Cleric itself is working correctly
- The real issue is a data structure mismatch affecting classes like Bard that have empty skill arrays
- Root cause: API returns flat array structure instead of nested {choose, from} structure expected by frontend
