/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base design system colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // D&D specific color palette
        dnd: {
          50: '#fdf2f2',
          100: '#fce8e8', 
          200: '#fbd5d5',
          300: '#f8b4b4',
          400: '#f98080',
          500: '#f56565', // Main D&D red
          600: '#e53e3e',
          700: '#c53030', // Darker red for buttons
          800: '#9b2c2c',
          900: '#742a2a',
        },
        magic: {
          50: '#f0f4ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1', // Main magic purple/blue
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        spell: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6', // Main spell blue
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Ability scores colors
        strength: '#dc2626', // Red
        dexterity: '#16a34a', // Green
        constitution: '#d97706', // Orange
        intelligence: '#2563eb', // Blue
        wisdom: '#7c3aed', // Purple
        charisma: '#db2777', // Pink
        // Class colors
        barbarian: '#8b5cf6',
        bard: '#f59e0b',
        cleric: '#facc15',
        druid: '#22c55e',
        fighter: '#ef4444',
        monk: '#06b6d4',
        paladin: '#fbbf24',
        ranger: '#10b981',
        rogue: '#6b7280',
        sorcerer: '#ec4899',
        warlock: '#7c2d12',
        wizard: '#3b82f6',
        // Dice colors
        dice: {
          d4: '#ef4444',
          d6: '#f97316', 
          d8: '#eab308',
          d10: '#22c55e',
          d12: '#3b82f6',
          d20: '#8b5cf6',
        }
      },
      fontFamily: {
        'dnd': ['Cinzel', 'serif'], // D&D-style serif font
        'mono': ['JetBrains Mono', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'dnd': '0 4px 8px rgba(220, 38, 38, 0.3)',
        'magic': '0 4px 8px rgba(139, 92, 246, 0.3)',
        'spell': '0 4px 8px rgba(59, 130, 246, 0.3)',
      },
      animation: {
        'dice-roll': 'spin 0.5s ease-in-out',
        'magic-glow': 'pulse 2s infinite',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}