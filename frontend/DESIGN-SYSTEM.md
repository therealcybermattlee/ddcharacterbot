# D&D Character Manager - Design System

## Overview

The D&D Character Manager uses a comprehensive design system built on **Radix UI**, **Tailwind CSS**, and **class-variance-authority (CVA)**. This system provides both standard UI components and D&D-specific themed variants for an immersive tabletop RPG experience.

## Core Principles

1. **Accessibility First**: All components built with Radix UI primitives for WCAG compliance
2. **D&D Theming**: Custom color palette and variants inspired by tabletop RPG aesthetics
3. **Component Variants**: Flexible components with multiple visual styles via CVA
4. **Type Safety**: Full TypeScript support with proper prop types
5. **Reusability**: Composable components following the shadcn/ui pattern

---

## Color Palette

### Design System Colors

The base design system uses HSL color tokens defined in `index.css`:

```css
--background: 0 0% 100%;
--foreground: 0 0% 3.9%;
--primary: 0 72% 51%;
--secondary: 0 0% 96.1%;
--destructive: 0 84.2% 60.2%;
--muted: 0 0% 96.1%;
--accent: 0 0% 96.1%;
--card: 0 0% 100%;
--popover: 0 0% 100%;
```

### D&D-Specific Colors

#### **DND Red** - Primary brand color
- `dnd-50` to `dnd-900` - Used for primary buttons, highlights, and D&D branding
- Main color: `dnd-500: #f56565`
- Button color: `dnd-700: #c53030`

#### **Magic Purple/Blue** - Arcane and magical elements
- `magic-50` to `magic-900` - Used for spell-related UI, magical effects
- Main color: `magic-500: #6366f1`

#### **Spell Blue** - Spell casting and abilities
- `spell-50` to `spell-900` - Used for spell cards, casting interfaces
- Main color: `spell-500: #3b82f6`

### Ability Score Colors

Each D&D ability score has a dedicated color:

- **Strength**: `#dc2626` (Red) - Physical power
- **Dexterity**: `#16a34a` (Green) - Agility and reflexes
- **Constitution**: `#d97706` (Orange) - Endurance and health
- **Intelligence**: `#2563eb` (Blue) - Reasoning and memory
- **Wisdom**: `#7c3aed` (Purple) - Awareness and insight
- **Charisma**: `#db2777` (Pink) - Force of personality

### Class Colors

Each D&D class has a signature color:

```javascript
barbarian: '#8b5cf6',  // Purple
bard: '#f59e0b',       // Amber
cleric: '#facc15',     // Yellow
druid: '#22c55e',      // Green
fighter: '#ef4444',    // Red
monk: '#06b6d4',       // Cyan
paladin: '#fbbf24',    // Gold
ranger: '#10b981',     // Emerald
rogue: '#6b7280',      // Gray
sorcerer: '#ec4899',   // Pink
warlock: '#7c2d12',    // Brown
wizard: '#3b82f6',     // Blue
```

### Dice Colors

Visual representation of different dice types:

- D4: `#ef4444` (Red)
- D6: `#f97316` (Orange)
- D8: `#eab308` (Yellow)
- D10: `#22c55e` (Green)
- D12: `#3b82f6` (Blue)
- D20: `#8b5cf6` (Purple)

---

## Typography

### Font Families

```javascript
fontFamily: {
  'dnd': ['Cinzel', 'serif'],           // D&D-style headers
  'mono': ['JetBrains Mono', 'Monaco', 'Consolas', 'monospace'], // Stats and numbers
}
```

### Usage Guidelines

- **Headlines**: Use `font-dnd` (Cinzel) for main titles, page headers, and character names
- **Body Text**: Default system font for readability
- **Stats/Numbers**: Use `font-mono` for ability scores, modifiers, and numeric values

---

## Component Library

### Base Components

#### Button

**Variants**:
- `default` - Standard button
- `destructive` - Dangerous actions (red)
- `outline` - Bordered button
- `secondary` - Secondary actions
- `ghost` - Transparent button
- `link` - Link-styled button
- `dnd` - D&D red theme with border
- `magic` - Gradient purple to blue (spells)
- `spell` - Blue theme for spell casting
- `skill` - Green theme for skill checks

**Sizes**: `sm`, `default`, `lg`, `xl`, `icon`

**Example**:
```tsx
import { Button } from '@/components/ui';

<Button variant="dnd" size="lg">Roll Initiative</Button>
<Button variant="magic">Cast Fireball</Button>
```

#### Input

**Variants**:
- `default` - Standard text input
- `error` - Error state (red border)
- `success` - Success state (green border)
- `stat` - Character ability score input (centered, bold, monospace)
- `modifier` - Modifier input (small, centered)
- `dice` - Dice notation input (red theme)

**Props**: `label`, `error`, `helper`, `required`

**Example**:
```tsx
import { Input } from '@/components/ui';

<Input
  label="Character Name"
  placeholder="Gandalf the Grey"
  required
/>

<Input
  label="Strength"
  variant="stat"
  defaultValue="16"
/>
```

#### Card

**Variants**:
- `default` - Standard card
- `outline` - Card with thick border
- `ghost` - Borderless card
- `character` - Character sheet styling (amber border)
- `stat` - Stat block styling
- `spell` - Spell card (blue theme)
- `item` - Item card (gold gradient)

**Sub-components**: `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`

**Example**:
```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';

<Card variant="spell">
  <CardHeader>
    <CardTitle>Fireball</CardTitle>
  </CardHeader>
  <CardContent>
    <p>A bright streak flashes from your pointing finger...</p>
  </CardContent>
</Card>
```

#### Label

**Variants**:
- `default` - Standard label
- `muted` - Muted text
- `error` - Error state (red)
- `success` - Success state (green)
- `stat` - Ability score label (small caps, bold)
- `ability` - Ability name label (semibold)

**Props**: `required`

#### Checkbox

**Variants**:
- `default` - Standard checkbox
- `dnd` - D&D red theme
- `magic` - Magic purple theme
- `success` - Green theme

**Props**: `label`, `error`

#### Textarea

**Variants**:
- `default` - Standard textarea
- `error` - Error state
- `success` - Success state
- `story` - Backstory/narrative text (serif font, amber theme)
- `notes` - Session notes (monospace, gray theme)

**Sizes**: `sm`, `default`, `lg`, `xl`

#### Select

Radix UI-based select dropdown with:
- `SelectTrigger` with variants: `default`, `error`, `stat`, `class`
- `SelectContent`, `SelectItem`, `SelectLabel`, `SelectSeparator`
- Full keyboard navigation and accessibility

#### Dialog

Modal dialog components:
- `Dialog`, `DialogTrigger`, `DialogContent`
- `DialogHeader`, `DialogTitle`, `DialogDescription`
- `DialogFooter`, `DialogClose`

#### Toast

Notification system with variants:
- `default`, `destructive`, `success`, `warning`, `info`
- `dnd`, `magic`, `levelUp` (special D&D notifications)

#### Badge

Small status indicators with variants:
- `default`, `secondary`, `destructive`, `outline`
- D&D-specific variants for class, level, etc.

---

## D&D-Specific Components

### Dice Components

Located in `components/ui/dice.tsx`:

- `Dice` - Generic dice roller
- `D4`, `D6`, `D8`, `D10`, `D12`, `D20`, `D100` - Specific dice types

Each has appropriate color coding matching the dice color palette.

---

## Utilities

### `cn()` Function

Located in `utils/cn.ts`, combines `clsx` and `tailwind-merge` for conditional class names:

```tsx
import { cn } from '@/utils/cn';

<div className={cn(
  "base-classes",
  condition && "conditional-classes",
  className
)} />
```

---

## Shadows

Custom D&D-themed box shadows:

```javascript
boxShadow: {
  'dnd': '0 4px 8px rgba(220, 38, 38, 0.3)',      // Red shadow
  'magic': '0 4px 8px rgba(139, 92, 246, 0.3)',   // Purple shadow
  'spell': '0 4px 8px rgba(59, 130, 246, 0.3)',   // Blue shadow
}
```

**Usage**: `shadow-dnd`, `shadow-magic`, `shadow-spell`

---

## Animations

Custom animations defined in Tailwind config:

```javascript
animation: {
  'dice-roll': 'spin 0.5s ease-in-out',  // Dice rolling animation
  'magic-glow': 'pulse 2s infinite',     // Magical glow effect
}
```

**Usage**: `animate-dice-roll`, `animate-magic-glow`

---

## Usage Best Practices

### 1. Component Composition

Build complex UIs by composing base components:

```tsx
<Card variant="character">
  <CardHeader>
    <CardTitle className="font-dnd">Character Name</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-3 gap-2">
      <Input variant="stat" label="STR" defaultValue="16" />
      <Input variant="stat" label="DEX" defaultValue="14" />
      <Input variant="stat" label="CON" defaultValue="15" />
    </div>
  </CardContent>
  <CardFooter>
    <Button variant="dnd">Save Character</Button>
  </CardFooter>
</Card>
```

### 2. Variant Selection

Choose variants based on context:

- **Primary Actions**: `Button variant="dnd"`
- **Spell Casting**: `Button variant="magic"` or `variant="spell"`
- **Skill Checks**: `Button variant="skill"`
- **Dangerous Actions**: `Button variant="destructive"`

### 3. Accessibility

All components include:
- Proper ARIA labels
- Keyboard navigation
- Focus management
- Screen reader support
- Required field indicators

### 4. Responsive Design

Use Tailwind's responsive prefixes:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Components */}
</div>
```

---

## Storybook

View all components and variants in Storybook:

```bash
npm run storybook
```

Storybook provides:
- Interactive component playground
- All variants and props documented
- Accessibility testing
- Visual regression testing
- Component usage examples

---

## File Structure

```
frontend/src/
├── components/
│   └── ui/
│       ├── button.tsx          # Button component
│       ├── button.stories.tsx  # Button documentation
│       ├── input.tsx
│       ├── input.stories.tsx
│       ├── card.tsx
│       ├── card.stories.tsx
│       ├── label.tsx
│       ├── checkbox.tsx
│       ├── textarea.tsx
│       ├── select.tsx
│       ├── toast.tsx
│       ├── dialog.tsx
│       ├── badge.tsx
│       ├── dice.tsx
│       └── index.ts            # Barrel exports
├── utils/
│   └── cn.ts                   # Utility function
└── index.css                   # Global styles & CSS variables
```

---

## Extending the Design System

### Adding New Variants

Use class-variance-authority (CVA):

```tsx
const componentVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        newVariant: "variant-specific-classes",
      },
    },
  }
);
```

### Adding New Colors

1. Define in `tailwind.config.js`:
```javascript
colors: {
  newColor: {
    50: '#...',
    // ... through 900
  }
}
```

2. Use in components:
```tsx
className="bg-newColor-500 text-newColor-50"
```

### Creating New Components

1. Create component file: `components/ui/newcomponent.tsx`
2. Use existing patterns (CVA, forwardRef, TypeScript types)
3. Export from `components/ui/index.ts`
4. Create Storybook stories: `components/ui/newcomponent.stories.tsx`
5. Document usage in this file

---

## Resources

- **Radix UI**: https://www.radix-ui.com/primitives/docs/overview/introduction
- **Tailwind CSS**: https://tailwindcss.com/docs
- **CVA**: https://cva.style/docs
- **Storybook**: https://storybook.js.org/docs
- **shadcn/ui**: https://ui.shadcn.com/ (pattern inspiration)

---

## Support

For questions or suggestions about the design system, please open an issue in the GitHub repository.
