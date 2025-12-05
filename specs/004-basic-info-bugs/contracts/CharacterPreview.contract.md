# Component Contract: CharacterPreview

**Feature**: 004-basic-info-bugs (Bug #2 Fix)
**Component**: `frontend/src/components/character-creation/CharacterPreview.tsx`
**Date**: 2025-12-04

## Contract Overview

CharacterPreview displays a live preview of the character being created. This contract defines how the component MUST handle undefined/missing data to fix Bug #2 ("Level 1 ? ?" display).

---

## Input Contract

### Props Interface

```typescript
interface CharacterPreviewProps {
  characterConcept: {
    name: string                // REQUIRED: Never empty
    race?: Race                 // OPTIONAL: May be undefined during wizard
    class?: Class               // OPTIONAL: May be undefined during wizard
    background?: Background     // OPTIONAL: May be undefined
    level: number               // REQUIRED: 1-20, defaults to 1
  }
  baseAbilityScores: {
    strength: number
    dexterity: number
    constitution: number
    intelligence: number
    wisdom: number
    charisma: number
  }
  compact?: boolean             // OPTIONAL: Defaults to false
}
```

### Input Constraints

**MUST Accept:**
- ✅ `characterConcept.race` = undefined
- ✅ `characterConcept.class` = undefined
- ✅ `characterConcept.background` = undefined
- ✅ `characterConcept.name` = any non-empty string
- ✅ `characterConcept.level` = 1-20

**MUST Reject:**
- ❌ `characterConcept.name` = empty string "" (caller's responsibility)
- ❌ `characterConcept.level` < 1 or > 20 (caller's responsibility)
- ❌ `characterConcept` = null or undefined (TypeScript enforces)

---

## Output Contract

### Rendering Guarantees

**The component MUST:**

1. **Never display "?" symbols**
   ```typescript
   // ❌ FORBIDDEN:
   <span>{race ? race.name : '?'}</span>

   // ✅ REQUIRED:
   <span>{race?.name || <PlaceholderText text="Not selected yet" />}</span>
   ```

2. **Always render valid UI** (never crash, never blank screen)
   - Even with all optional fields undefined
   - Even with partial data (only name and level)

3. **Show descriptive placeholders** when data is missing
   - Race missing: Display "Not selected yet" (not "?", not "—", not blank)
   - Class missing: Display "Not selected yet"
   - Background missing: May omit from display OR show placeholder (optional field)

4. **Use accessible, translatable text**
   - All placeholder text wrapped in elements with proper ARIA
   - Text uses semantic meaning, not symbols
   - Minimum 4.5:1 contrast ratio for muted text

---

## Behavior Contract

### Display States

**State 1: Only Name (Initial)**
```typescript
Input:
  name: "Gandalf"
  race: undefined
  class: undefined
  level: 1

Expected Display:
  "Gandalf"
  "Level 1"
  "Not selected yet" (race)
  "Not selected yet" (class)
```

**State 2: Name + Race**
```typescript
Input:
  name: "Gandalf"
  race: { name: "Human", ... }
  class: undefined
  level: 1

Expected Display:
  "Gandalf"
  "Level 1 Human"
  "Not selected yet" (class)
```

**State 3: Complete Basic Info**
```typescript
Input:
  name: "Gandalf"
  race: { name: "Human", ... }
  class: { name: "Wizard", ... }
  level: 5

Expected Display:
  "Gandalf"
  "Level 5 Human Wizard"
```

### Edge Cases

**Empty Name (Caller Error)**
```typescript
// Component receives:
characterConcept.name = ""

// Component behavior:
// NOT component's job to validate - caller should never pass empty name
// BUT component should not crash - display empty name gracefully
```

**All Undefined (Extreme Edge)**
```typescript
// Component receives:
characterConcept = {
  name: "",
  race: undefined,
  class: undefined,
  background: undefined,
  level: 1
}

// Component behavior:
// Display: ", Level 1 Not selected yet Not selected yet"
// (Not ideal, but doesn't crash)
```

---

## Accessibility Contract

### ARIA Requirements

**MUST provide:**

1. **Semantic HTML**
   ```html
   <!-- ✅ GOOD: -->
   <div role="region" aria-label="Character preview">
     <h3>Gandalf</h3>
     <p>Level 1 <span className="text-muted-foreground">Not selected yet</span></p>
   </div>

   <!-- ❌ BAD: -->
   <div>Gandalf, Level 1 ? ?</div>
   ```

2. **Screen Reader Support**
   ```html
   <!-- For placeholder text: -->
   <span className="text-muted-foreground italic" aria-label="Race not yet selected">
     Not selected yet
   </span>
   ```

3. **Visual Indicators**
   - Muted color for placeholders (but maintain 4.5:1 contrast)
   - Italic styling to differentiate from selected values
   - Never use color alone to convey meaning

### WCAG 2.1 Compliance

- **SC 3.3.2 (Labels or Instructions)**: Placeholder text provides clear meaning
- **SC 1.4.3 (Contrast Minimum)**: Muted text meets 4.5:1 ratio
- **SC 2.4.6 (Headings and Labels)**: Character name and level clearly labeled

---

## Performance Contract

**Rendering Performance:**
- Component updates < 100ms when props change (per spec.md SC-007)
- No unnecessary re-renders (use React.memo if needed)
- Lazy load ability score calculations

**Memory:**
- No memory leaks from undefined data handling
- Clean up any subscriptions/effects on unmount

---

## Error Handling Contract

### What Component MUST Handle

**Graceful Degradation:**
```typescript
// ✅ Component handles:
- race = undefined → Show placeholder
- class = undefined → Show placeholder
- background = undefined → Show placeholder or omit
- race.name = undefined → Show placeholder
- Invalid data shape → Show safe defaults
```

### What Component MAY Assume

**Caller Responsibilities:**
```typescript
// Component may assume caller ensures:
- name is never null (may be empty string)
- level is 1-20 number
- race/class follow Race/Class TypeScript types when defined
```

### Error States

**If critical error occurs:**
```typescript
// Component should:
1. Log error to console.error()
2. Render fallback UI: "Unable to display character preview"
3. NOT crash the entire wizard
4. NOT show "?" symbols
```

---

## Testing Contract

### Unit Test Requirements

**MUST have tests for:**

1. **Undefined Race**
   ```typescript
   test('displays placeholder when race is undefined', () => {
     render(<CharacterPreview characterConcept={{ name: "Test", race: undefined, ... }} />)
     expect(screen.getByText(/not selected yet/i)).toBeInTheDocument()
     expect(screen.queryByText('?')).not.toBeInTheDocument()
   })
   ```

2. **Undefined Class**
   ```typescript
   test('displays placeholder when class is undefined', () => {
     render(<CharacterPreview characterConcept={{ name: "Test", class: undefined, ... }} />)
     expect(screen.getAllByText(/not selected yet/i)).toHaveLength(2) // race + class
   })
   ```

3. **Both Defined**
   ```typescript
   test('displays race and class when both defined', () => {
     const concept = {
       name: "Gandalf",
       race: { name: "Human", ... },
       class: { name: "Wizard", ... },
       level: 5
     }
     render(<CharacterPreview characterConcept={concept} />)
     expect(screen.getByText(/Human/)).toBeInTheDocument()
     expect(screen.getByText(/Wizard/)).toBeInTheDocument()
     expect(screen.queryByText(/not selected/i)).not.toBeInTheDocument()
   })
   ```

4. **Accessibility**
   ```typescript
   test('placeholder has proper ARIA labels', () => {
     render(<CharacterPreview characterConcept={{ name: "Test", race: undefined, ... }} />)
     const placeholder = screen.getByText(/not selected yet/i)
     expect(placeholder).toHaveAttribute('aria-label', expect.stringContaining('not yet selected'))
   })
   ```

5. **No "?" Symbols Ever**
   ```typescript
   test('never displays question mark symbols', () => {
     // Test with all combinations of undefined fields
     const cases = [
       { race: undefined, class: undefined },
       { race: undefined, class: { name: "Wizard" } },
       { race: { name: "Elf" }, class: undefined },
     ]

     cases.forEach(concept => {
       const { container } = render(<CharacterPreview characterConcept={{ name: "Test", ...concept }} />)
       expect(container.textContent).not.toContain('?')
     })
   })
   ```

---

## Integration Contract

### With BasicInfoStep

**Data Flow:**
```typescript
BasicInfoStep
  → calls getCharacterConcept()
  → passes characterConcept to CharacterPreview
  → CharacterPreview renders without "?"
```

**Timing:**
- Preview updates immediately when data.raceData or data.classData changes
- No delay, no flicker, smooth transition

### With Character Creation Context

**Context Independence:**
- Component does NOT directly access CharacterCreationContext
- All data comes through props (functional component pattern)
- No side effects that modify global state

---

## Change Log

**Version 1.0 (2025-12-04)**
- Initial contract for Bug #2 fix
- Defines placeholder text requirements
- Specifies accessibility and testing requirements

---

## Contract Validation

**Before merging, verify:**
- [ ] All unit tests pass
- [ ] No "?" symbols in any test case
- [ ] Placeholder text is translatable
- [ ] ARIA labels present
- [ ] Contrast ratio meets 4.5:1
- [ ] Performance < 100ms updates
- [ ] Integration with BasicInfoStep works

**Acceptance Criteria (from spec.md):**
- [ ] SC-002: Preview never displays "?" symbols
- [ ] SC-007: Preview updates reflect selections within 100ms
