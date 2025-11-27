# Data Model: Class Skill Display Bug Fix

**Feature**: 003-class-skill-display-fix
**Date**: 2025-11-27
**Phase**: 1 (Design & Contracts)

## Entities

### Class

**Description**: Represents a D&D 5e character class with its proficiencies and features.

**Source**: Database table `classes`, API endpoint `/api/classes`

**Fields**:

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| id | string | Yes | Unique identifier (lowercase, e.g., "bard") | Pattern: `^[a-z]+$` |
| name | string | Yes | Display name (e.g., "Bard") | Length: 1-50 |
| hit_die | string | Yes | Hit die type (e.g., "d8") | Pattern: `^d(6\|8\|10\|12)$` |
| primary_abilities | string[] | Yes | Primary ability scores | Each in: STR, DEX, CON, INT, WIS, CHA |
| saving_throw_proficiencies | string[] | Yes | Proficient saving throws | Each in: STR, DEX, CON, INT, WIS, CHA |
| **skill_proficiencies** | **SkillProficiency** | **Yes** | **Skill selection rules** | **See below** |
| armor_proficiencies | string[] | No | Armor types | e.g., ["Light armor", "Medium armor"] |
| weapon_proficiencies | string[] | No | Weapon types | e.g., ["Simple weapons", "Martial weapons"] |
| tool_proficiencies | string[] | No | Tool types | e.g., ["Thieves' tools"] |
| starting_equipment | object | No | Starting gear | JSON object |
| spellcasting_ability | string \| null | No | Spellcasting ability | One of: INT, WIS, CHA, or null |
| source | string | Yes | Source book | e.g., "PHB", "XGE" |
| is_homebrew | boolean | Yes | Homebrew flag | Default: false |

### SkillProficiency (NEW STRUCTURE)

**Description**: Defines how many skills a class can choose and from which skills.

**Structure**:
```typescript
interface SkillProficiency {
  choose: number        // Number of skills to select
  from: string[]        // Available skill choices
}
```

**Example - Bard** (choose any 3 skills):
```json
{
  "choose": 3,
  "from": [
    "Acrobatics", "Animal Handling", "Arcana", "Athletics",
    "Deception", "History", "Insight", "Intimidation",
    "Investigation", "Medicine", "Nature", "Perception",
    "Performance", "Persuasion", "Religion", "Sleight of Hand",
    "Stealth", "Survival"
  ]
}
```

**Example - Cleric** (choose 2 from 5 specific skills):
```json
{
  "choose": 2,
  "from": ["History", "Insight", "Medicine", "Persuasion", "Religion"]
}
```

**Validation Rules**:
- `choose` must be > 0 and ≤ `from.length`
- `from` must contain valid D&D 5e skill names
- `from` must have no duplicates
- All skills in `from` must be from the master skill list

**Master Skill List** (D&D 5e):
```typescript
const VALID_SKILLS = [
  "Acrobatics", "Animal Handling", "Arcana", "Athletics",
  "Deception", "History", "Insight", "Intimidation",
  "Investigation", "Medicine", "Nature", "Perception",
  "Performance", "Persuasion", "Religion", "Sleight of Hand",
  "Stealth", "Survival"
] as const;
```

## Database Schema Changes

### Current Schema (classes table)

```sql
CREATE TABLE classes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  hit_die TEXT NOT NULL,
  primary_ability TEXT NOT NULL,  -- JSON array
  saving_throw_proficiencies TEXT NOT NULL,  -- JSON array
  skill_proficiencies TEXT NOT NULL,  -- JSON array (FLAT)
  skill_choices INTEGER NOT NULL,  -- Separate field
  armor_proficiencies TEXT NOT NULL,
  weapon_proficiencies TEXT NOT NULL,
  tool_proficiencies TEXT,
  starting_equipment TEXT,
  spellcasting_ability TEXT,
  source TEXT NOT NULL,
  is_homebrew BOOLEAN DEFAULT 0
);
```

### No Schema Change Required

**Decision**: Keep database schema as-is. Transform data in API layer.

**Rationale**:
- Database stores `skill_proficiencies` as JSON TEXT (array of strings)
- Database stores `skill_choices` as INTEGER
- API will combine these into nested `skill_proficiencies` object
- No database migration needed for schema structure
- Only need data migration for Bard's skill list

## Data Transformations

### Database → API Response

**Location**: `api/src/routes/classes.ts`

**Current Code** (lines 68-73):
```typescript
{
  skillProficiencies: JSON.parse(dbClass.skill_proficiencies || '[]'),
  skillChoices: dbClass.skill_choices || 0,
  // ... other fields ...
}
```

**New Code**:
```typescript
{
  skill_proficiencies: {
    choose: dbClass.skill_choices || 0,
    from: JSON.parse(dbClass.skill_proficiencies || '[]')
  },
  // ... other fields ...
}
```

**Changes**:
1. Field name: `skillProficiencies` → `skill_proficiencies` (snake_case)
2. Structure: Flat array → Nested object `{choose, from}`
3. Remove separate `skillChoices` field (merged into nested object)

### API Response → Frontend

**Location**: Frontend already compatible, no changes needed.

**Frontend Type** (`frontend/src/types/dnd5e.ts:85-108`):
```typescript
export interface Class {
  id: string
  name: string
  hit_die: number
  primary_abilities: string[]
  saving_throw_proficiencies: string[]
  skill_proficiencies: {  // Already correct!
    choose: number
    from: string[]
  }
  // ... other fields ...
}
```

**Frontend Display** (`frontend/src/components/character-creation/ClassSelector.tsx:360`):
```typescript
{cls?.skill_proficiencies?.choose || 0} of {cls?.skill_proficiencies?.from?.length || 0}
```

This will now work correctly once API returns the nested structure.

## State Transitions

### Data Flow

```
Database (D1)
  ↓
  skill_proficiencies: TEXT (JSON array of skill names)
  skill_choices: INTEGER
  ↓
API Transformation (api/src/routes/classes.ts)
  ↓
  skill_proficiencies: {
    choose: number,
    from: string[]
  }
  ↓
Frontend Type System (frontend/src/types/dnd5e.ts)
  ↓
React Component (ClassSelector.tsx)
  ↓
Display: "X of Y" where X = choose, Y = from.length
```

### Error States

| State | Trigger | Resolution |
|-------|---------|------------|
| `from` array empty | Database has `skill_proficiencies: '[]'` | Display "X of 0" (current bug) → Fixed by migration |
| `choose` is 0 | Database has `skill_choices: 0` | Display "0 of Y" (valid for some classes) |
| `choose` > `from.length` | Data integrity issue | Display shows mismatch, validation should prevent |

## Migration Data Changes

### Migration 023: Fix Bard Skill List

**File**: `database/migrations/023_fix_bard_skill_list.sql`

**Operation**: UPDATE Bard `skill_proficiencies` to include all 18 skills

**Before**:
```sql
skill_proficiencies = '["Deception", "History", "Investigation", "Persuasion", "Sleight of Hand"]'
-- OR
skill_proficiencies = '[]'
```

**After**:
```sql
skill_proficiencies = '["Acrobatics", "Animal Handling", "Arcana", "Athletics", "Deception", "History", "Insight", "Intimidation", "Investigation", "Medicine", "Nature", "Perception", "Performance", "Persuasion", "Religion", "Sleight of Hand", "Stealth", "Survival"]'
```

**SQL**:
```sql
UPDATE classes
SET skill_proficiencies = '["Acrobatics", "Animal Handling", "Arcana", "Athletics", "Deception", "History", "Insight", "Intimidation", "Investigation", "Medicine", "Nature", "Perception", "Performance", "Persuasion", "Religion", "Sleight of Hand", "Stealth", "Survival"]'
WHERE id = 'bard' AND is_homebrew = 0;
```

## Verification Checklist

- [ ] Database migration creates correct Bard data (all 18 skills)
- [ ] API response structure matches TypeScript interface
- [ ] Bard displays "3 of 18"
- [ ] Cleric displays "2 of 5"
- [ ] All 12 classes display correct "X of Y" format
- [ ] No TypeScript errors in frontend
- [ ] Existing tests still pass
- [ ] New tests cover API structure change

## Related Documentation

- **Spec**: [spec.md](./spec.md) - Original problem statement
- **Research**: [research.md](./research.md) - Investigation findings
- **Contracts**: [contracts/](./contracts/) - OpenAPI specification

**Status**: ✅ Data Model Complete. Ready for contract generation.
