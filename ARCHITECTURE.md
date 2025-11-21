# D&D Character Bot - Comprehensive Codebase Architecture Research Document

**Created:** 2025-11-20
**Project:** D&D Character Manager
**Repository:** ddcharacterbot
**Status:** Active Development (Post-Sprint 2, Multiple Bug Fixes)

---

## Executive Summary

The D&D Character Manager is a comprehensive web application for managing Dungeons & Dragons 5e characters and campaigns. It follows a modern frontend/backend separation architecture with:

- **Frontend:** React 18 with TypeScript, deployed on Cloudflare Pages
- **Backend:** Cloudflare Workers with Hono framework
- **Database:** SQLite via Cloudflare D1
- **Caching/Sessions:** Cloudflare KV namespace
- **Styling:** Tailwind CSS with Radix UI components

The application is production-ready with comprehensive character creation, management, and campaign features. It supports multiple D&D 5e sourcebooks and provides a wizard-based character creation flow with extensive validation.

---

## 1. Overall Architecture Overview

### Architecture Diagram
```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Cloudflare Pages)              │
│   React 18 + TypeScript + Vite + Tailwind CSS + Redux      │
│   https://dnd.cyberlees.dev                                  │
└────────────────────────────────┬────────────────────────────┘
                                 │ API Calls (Axios)
                                 │
┌────────────────────────────────▼────────────────────────────┐
│              Backend API (Cloudflare Workers)                │
│   Hono Framework + TypeScript + Zod Validation             │
│   https://dnd-character-manager-api-dev...                 │
└────────────────────────────────┬────────────────────────────┘
                                 │
                ┌────────────────┼────────────────┐
                │                │                │
        ┌───────▼─────┐  ┌──────▼──────┐  ┌─────▼─────┐
        │  Cloudflare │  │ Cloudflare  │  │ Cloudflare│
        │      D1     │  │     KV      │  │     R2    │
        │   Database  │  │   (Cache)   │  │  (Assets) │
        └─────────────┘  └─────────────┘  └───────────┘
```

### Directory Structure

**Frontend:**
```
frontend/src/
├── components/                # React components (50+ files)
│   ├── auth/                 # Authentication UI
│   ├── character-creation/   # Character creation UI (13 components)
│   ├── characters/           # Character management
│   ├── wizard/               # Multi-step wizard
│   ├── analytics/            # Analytics dashboard
│   └── ui/                   # Design system (10+ components)
├── contexts/                 # React providers
│   ├── AuthContext.tsx       # Auth state & functions
│   └── CharacterCreationContext.tsx  # Wizard state
├── features/                 # Redux slices
│   ├── characters/charactersSlice.ts
│   └── analytics/analyticsSlice.ts
├── services/                 # API service layer
│   ├── api.ts               # Axios configuration
│   ├── characterService.ts
│   ├── analyticsService.ts
│   └── dnd5eApi.ts
├── stores/                   # Redux store
├── types/                    # TypeScript definitions
├── utils/                    # Utilities
└── data/                     # Static D&D data
```

**Backend:**
```
api/src/
├── routes/                   # API endpoints (9 route files)
│   ├── auth.ts              # 532 lines - Auth endpoints
│   ├── characters.ts        # 944 lines - Character CRUD
│   ├── campaigns.ts         # 1194 lines - Campaign management
│   ├── races.ts             # 329 lines - Reference data (cached)
│   ├── classes.ts           # 500 lines - Reference data
│   ├── backgrounds.ts       # 520 lines - Reference data
│   ├── spells.ts            # 475 lines - Reference data
│   ├── analytics.ts         # 624 lines - Analytics tracking
│   └── health.ts            # 274 lines - Health check
├── middleware/               # Request processing
│   ├── security.ts          # Auth, CORS, rate limiting
│   └── authorization.ts     # Role-based access control
├── lib/                      # Utility libraries
│   ├── jwt-service.ts
│   ├── password-service.ts
│   ├── character-progression.ts
│   ├── classFeatures.ts
│   └── kv-manager.ts
├── db/                       # Database utilities
│   ├── client.ts            # Query execution wrappers
│   ├── transactions.ts       # Transaction simulation
│   ├── migrations.ts         # Migration runner
│   └── performance.ts        # Performance utilities
├── types.ts                  # TypeScript interfaces
└── index.ts                  # Main app entry
```

**Database:**
```
database/
├── migrations/               # 22 SQL migration files
│   ├── 0001_initial_schema.sql       # Core tables
│   ├── 0002_seed_reference_data.sql  # D&D 5e data
│   ├── 003-022_updates.sql          # Sourcebook updates
│   └── ...
├── seeds/                    # Initial data
└── analytics/                # Analytics models
```

---

## 2. State Management Patterns

### Frontend State Architecture

**Redux (Global State):**
- `characters/charactersSlice.ts` - Character list, selection, CRUD
- `analytics/analyticsSlice.ts` - Analytics data

**React Context (Provider Patterns):**
- `AuthContext.tsx` - User session, login/logout
- `CharacterCreationContext.tsx` - Wizard state, form validation

**Local Component State:**
- Character sheet uses optimistic updates with debounced sync
- Forms use React Hook Form + Zod validation

### Backend State Management

- **Database (D1)** - Primary persistent storage
- **KV Namespace** - Session storage, caching (1 hour TTL)
- **Environment Variables** - Per-environment configuration

---

## 3. API Contracts & Data Models

### Standard Response Format

```typescript
interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  timestamp: string
}
```

### Key API Endpoints

**Authentication:**
- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - User authentication
- POST `/api/auth/logout` - Session termination
- GET `/api/auth/profile` - User profile
- POST `/api/auth/refresh` - Token refresh

**Characters:**
- GET `/api/characters` - List user's characters
- POST `/api/characters` - Create character
- GET `/api/characters/:id` - Get character
- PUT `/api/characters/:id` - Update character
- DELETE `/api/characters/:id` - Delete character
- POST `/api/characters/:id/experience` - Award XP

**Campaigns:**
- GET `/api/campaigns` - List campaigns
- POST `/api/campaigns` - Create campaign
- GET `/api/campaigns/:id` - Get campaign
- POST `/api/campaigns/:id/members` - Add member
- POST `/api/campaigns/:id/characters` - Add character

**Reference Data (Public, Cached):**
- GET `/api/races` - D&D 5e races (1 hour cache)
- GET `/api/classes` - D&D 5e classes
- GET `/api/backgrounds` - D&D 5e backgrounds
- GET `/api/spells` - D&D 5e spells (filterable)

### Core Data Models

**Character:**
```typescript
{
  id: string
  name: string
  userId: string
  race: string                    // e.g., "Human"
  characterClass: string          // e.g., "Fighter"
  level: number                   // 1-20
  experiencePoints: number

  // Ability Scores (3-20 range)
  strength: number
  dexterity: number
  constitution: number
  intelligence: number
  wisdom: number
  charisma: number

  // Derived Stats
  armorClass: number
  hitPointsMax: number
  hitPointsCurrent: number
  speed: number                   // feet per round

  // Optional Details
  background?: string
  alignment?: string

  createdAt: string
  updatedAt: string
}
```

**Race:**
```typescript
{
  id: string
  name: string                    // e.g., "Human"
  size: string                    // "Medium"
  speed: number                   // feet per round
  abilityScoreBonuses: {          // Racial modifiers
    strength?: number
    dexterity?: number
    // ... other abilities
  }
  traits: string[]                // Racial features
  languages: string[]
  proficiencies: {
    skills?: string[]
    tools?: string[]
    weapons?: string[]
    armor?: string[]
  }
  source: string                  // "phb", "xge", "ua"
  isHomebrew: boolean
}
```

**Campaign:**
```typescript
{
  id: string
  name: string
  description?: string
  dmUserId: string                // Dungeon Master
  isPublic: boolean
  settings?: Record<string, any>  // Custom settings (JSON)
  createdAt: string
  updatedAt: string
}
```

### Input Validation

All endpoints use Zod schema validation:
```typescript
const createCharacterSchema = z.object({
  name: z.string().min(1).max(100).transform(sanitizeText),
  race: z.string().min(1).max(50),
  characterClass: z.string().min(1).max(50),
  level: z.number().int().min(1).max(20),
  strength: z.number().int().min(3).max(20),
  // ... ability scores
})
```

---

## 4. Tech Stack & Conventions

### Frontend Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | React | 18.3.1 |
| **Language** | TypeScript | 5.6.3 |
| **Build** | Vite | 5.4.8 |
| **State** | Redux Toolkit | 2.2.8 |
| **Routing** | React Router | 6.26.2 |
| **HTTP** | Axios | 1.7.7 |
| **Styling** | Tailwind CSS | 3.4.13 |
| **UI Primitives** | Radix UI | Latest |
| **Icons** | Heroicons | 2.1.5 |
| **Validation** | Zod | 3.23.8 |
| **Forms** | React Hook Form | 7.53.0 |
| **Testing** | Vitest | 3.0.0 |
| **Documentation** | Storybook | 9.1.15 |

### Backend Stack

| Component | Technology |
|-----------|-----------|
| **Framework** | Hono |
| **Runtime** | Cloudflare Workers |
| **Language** | TypeScript |
| **Database** | SQLite (D1) |
| **Validation** | Zod |
| **Hashing** | Scrypt (@noble/hashes) |
| **JWT** | Custom implementation |

### Naming Conventions

- **Files:** PascalCase for components, camelCase for utilities
- **Variables:** camelCase for functions and variables
- **Constants:** UPPER_SNAKE_CASE
- **Database:** snake_case for tables and columns
- **API:** lowercase with hyphens for paths, camelCase for JSON keys

### Code Organization

**Frontend Components:**
```typescript
// 1. Imports
import React, { useState } from 'react'
import { useSelector } from 'react-redux'

// 2. Type definitions
interface ComponentProps { }

// 3. Component function
export default function ComponentName() {
  // Local state
  const [state, setState] = useState()

  // Redux/Context hooks
  const data = useSelector(selectData)

  // Effects
  useEffect(() => { }, [])

  // Handlers
  const handleEvent = () => { }

  // Render
  return <JSX />
}
```

**Backend Routes:**
```typescript
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'

const router = new Hono<HonoEnv>()

// Middleware
router.use('*', authMiddleware())

// Schemas
const schema = z.object({ /* ... */ })

// Handlers
router.get('/', async (c) => { })
router.post('/', zValidator('json', schema), async (c) => { })

export default router
```

---

## 5. Authentication & Authorization

### JWT Implementation

**Token Lifecycle:**
1. User logs in with credentials
2. Backend verifies password using Scrypt
3. JWT generated with HS256 signature
4. Token stored in browser `localStorage`
5. Axios adds token to Authorization header on API calls
6. Backend verifies signature and expiration
7. Token refreshable via POST `/api/auth/refresh`

**JWT Structure:**
```
Header: { alg: "HS256", typ: "JWT" }
Payload: { userId, email, username, role, iat, exp }
Signature: HMAC(header.payload, JWT_SECRET)
```

**Token Duration:** 3600 seconds (1 hour)

### Password Security

**Algorithm:** Scrypt
- N = 2^16 (65,536 iterations)
- r = 8 (block size)
- p = 1 (parallelization)
- Hash Length = 32 bytes

**Format:** `algorithm$salt$hash`

### Authorization

**Roles:**
- `player` - Can create/edit own characters
- `dm` - Can create campaigns
- `observer` - Read-only access

**Protected Routes:**
- All `/api/characters/*` - Require authentication
- All `/api/campaigns/*` - Require authentication
- Reference data (races, classes, spells) - Public (no auth)

**Implementation:**
```typescript
router.use('*', createAuthMiddleware())
// All subsequent routes require valid JWT
```

### Security Features

- CORS validation against `CORS_ORIGIN` env var
- Rate limiting (development: 1000 req/min, production: 100 req/min)
- CSRF protection via Hono middleware
- Input sanitization (HTML/script tag removal)
- Secure headers (X-Content-Type-Options, X-Frame-Options, etc.)

---

## 6. Database Schema

### Core Tables (18 total)

**users**
```sql
id (TEXT PRIMARY KEY)
email (TEXT UNIQUE)
username (TEXT UNIQUE)
password_hash (TEXT)
role (TEXT) - 'dm', 'player', 'observer'
created_at, updated_at (TEXT)
```

**characters**
```sql
id (TEXT PRIMARY KEY)
name, user_id, campaign_id (TEXT FOREIGN KEY)
race, character_class, level, experience_points
strength, dexterity, constitution, intelligence, wisdom, charisma
armor_class, hit_points_max, hit_points_current, speed
background, alignment
skills, saving_throws, languages, tool_proficiencies (TEXT - JSON)
created_at, updated_at (TEXT)
```

**campaigns**
```sql
id (TEXT PRIMARY KEY)
name, description, dm_user_id (TEXT FOREIGN KEY)
is_public (BOOLEAN)
settings (TEXT - JSON)
created_at, updated_at (TEXT)
```

**campaign_members**
```sql
campaign_id, user_id (TEXT FOREIGN KEY)
role (TEXT) - 'dm', 'player', 'observer'
joined_at (TEXT)
PRIMARY KEY (campaign_id, user_id)
```

**Reference Data Tables:**
- `races` - D&D 5e races with ability bonuses, traits
- `classes` - D&D 5e classes with hit dice, proficiencies
- `backgrounds` - D&D 5e backgrounds with features
- `spells` - D&D 5e spells with schools, components
- `equipment` - Weapons, armor, gear

**Other Tables:**
- `character_classes` - Multiclass tracking
- `character_progression` - Level history
- `character_spells` - Known/prepared spells
- `character_equipment` - Inventory
- `usage_analytics` - Event tracking

### Migrations (22 files)

1. **0001** - Initial schema
2. **0002** - PHB reference data seed
3. **003-010** - D&D sourcebooks (Volo's, Xanathar's, Mordenkainen's, UA)
4. **011-013** - More UA content
5. **014** - Password hashing upgrade
6. **015** - Transaction support
7. **016** - Performance indexes
8. **017** - Spell data seed
9. **018-022** - Schema fixes and updates

### Key Indexes

- `idx_users_email` - Login lookup
- `idx_characters_user_id` - User's characters
- `idx_characters_campaign_id` - Campaign's characters
- `idx_spells_level` - Spell filtering
- And 15+ others for performance

---

## 7. Frontend Component Architecture

### Character Creation Wizard

The wizard is a multi-step form with validation at each step:

**Steps:**
1. **BasicInfoStep** - Character name, race, class, background, alignment
2. **AbilityScoresStep** - Ability score selection (standard array, point buy, rolling)
3. **SkillsProficienciesStep** - Skill proficiency selection
4. **EquipmentSpellsStep** - Equipment and spells
5. **BackgroundDetailsStep** - Personality traits, ideals, bonds, flaws
6. **ReviewCreateStep** - Final confirmation

**Validation:**
- Zod schemas for each step
- Subclass level requirements (varies by class)
- Ability score range enforcement (3-20)
- Character name required

### Character Sheet

Interactive display showing:
- Character header (name, class, level)
- Ability scores and modifiers
- Core stats (AC, HP, speed, initiative)
- Skills panel with proficiency bonuses

Uses **optimistic updates** with debounced API sync (1000ms delay).

### UI Design System

**Components:**
- Button, Input, Card, Badge, Dialog
- Select, Checkbox, Label, Toast
- Dice roller component
- Custom Radix UI integrations

All styled with **Tailwind CSS** utility classes.

---

## 8. Backend Route Architecture

### Auth Routes (532 lines)
- User registration with password validation
- Login with Scrypt verification
- Logout and session termination
- Profile retrieval
- Token refresh

### Character Routes (944 lines)
- CRUD operations (Create, Read, Update, Delete)
- Experience point tracking with auto-leveling
- Character import from external sources
- Ability score validation
- Full XP and progression calculations

### Campaign Routes (1194 lines - Largest)
- Campaign creation and management
- Member invitation and role assignment
- Character assignment to campaigns
- Campaign-specific character tracking
- Permissions enforcement

### Reference Data Routes (Public)
- **Races** (329 lines) - Cached 1 hour in KV
- **Classes** (500 lines) - Class features and subclasses
- **Backgrounds** (520 lines) - Skill proficiencies and features
- **Spells** (475 lines) - With level/school filtering

### Analytics Routes (624 lines)
- Event tracking
- Dashboard statistics
- User behavior tracking

### Health Endpoint (274 lines)
- Database connectivity check
- KV storage check
- Service status reporting

---

## 9. Integration Points & Dependencies

### Frontend ↔ Backend
- **Base URL:** `https://dnd-character-manager-api-dev.cybermattlee-llc.workers.dev/api`
- **Auth:** JWT Bearer token in Authorization header
- **Errors:** 401 triggers redirect to home, public endpoints retry

### Backend ↔ Database (D1)
- Direct SQL execution
- Parameterized queries to prevent SQL injection
- Batch operations for transaction-like behavior

### Backend ↔ Cache (KV)
- Reference data caching (1 hour TTL)
- Session storage
- Rate limit tracking

### External Services
- **Cloudflare Workers** - API runtime
- **Cloudflare Pages** - Frontend hosting
- **GitHub** - Source control and CI/CD

### Environment Configuration
- **Development:** Relaxed rate limits, verbose logging
- **Staging:** Balanced settings
- **Production:** Strict rate limits, minimal logging

---

## 10. Key Architectural Patterns

### Design Patterns Used

1. **MVC** - Backend routes separate from business logic
2. **Redux Toolkit** - Centralized state with actions/reducers
3. **Context API** - Provider patterns for shared state
4. **Middleware** - Request processing pipeline
5. **Observer** - React hooks and effects
6. **Factory** - Component generators

### Data Flow Examples

**Character Creation:**
```
User Input (Form)
  ↓
React Hook Form Validation
  ↓
Zod Schema Validation
  ↓
Redux Action
  ↓
Axios POST /api/characters
  ↓
Backend Zod Validation
  ↓
Database INSERT
  ↓
Response with Created Character
  ↓
Redux Store Update
  ↓
UI Re-render
```

**Character Update:**
```
User Modifies Character (Edit)
  ↓
Local State Update (Optimistic)
  ↓
Debounce 1000ms
  ↓
Axios PUT /api/characters/:id
  ↓
Backend Validates & Updates
  ↓
Redux Dispatch with Response
  ↓
UI Confirms Changes
```

---

## 11. Recent Development History

**Recent Commits:**
- Bug #22: Skills step Next button validation not updating
- Bug #14-21: Critical bug fixes and improvements
- Password hashing upgrade to Scrypt
- JWT encoding fixes for Unicode characters

**Current Status:**
- Character creation wizard fully functional
- Character management complete
- Campaign system implemented
- Analytics tracking enabled
- Multiple D&D sourcebooks supported

---

## 12. Performance Optimizations

### Frontend
- Code splitting via Vite (vendor, ui, utils chunks)
- PWA service worker caching
- Image optimization
- Redux selectors to prevent unnecessary re-renders

### Backend
- KV caching for reference data (1 hour TTL)
- Database indexes on frequently queried columns
- Rate limiting to prevent abuse
- Batch queries where possible

### Database
- Foreign key constraints
- Proper indexing strategy
- JSON storage for complex data
- SQLite pragmas for performance

---

## 13. Development Workflow

**Setup:**
```bash
# Frontend
cd frontend && npm install && npm run dev

# Backend
cd api && npm install && npx wrangler dev
```

**Available Scripts:**
- `npm run build` - Production build
- `npm run test` - Run tests
- `npm run lint` - Check code quality
- `npx wrangler deploy --env development` - Deploy backend

**Code Quality:**
- ESLint for style enforcement
- TypeScript for type safety
- Vitest for unit testing
- Prettier for formatting (recommended)

---

## Summary

This codebase demonstrates a **production-ready, full-stack D&D character management application** with:

✅ **Robust Architecture** - Clean separation of concerns, middleware patterns
✅ **Type Safety** - Comprehensive TypeScript across frontend and backend
✅ **Security** - JWT auth, password hashing, CORS, rate limiting, input validation
✅ **Scalability** - Cloudflare edge infrastructure, serverless backend
✅ **Validation** - Zod schemas at API boundaries
✅ **Testing** - Vitest setup for components and units
✅ **Documentation** - Storybook for components, inline comments

**Total Files:** 61 TypeScript files
**Database:** 22 migration files, 18 tables
**API Routes:** 9 route files, 50+ endpoints
**D&D Support:** PHB, XGE, Volo's, Xanathar's, Mordenkainen's, UA, and more

This architecture serves as an excellent reference for building modern web applications with React, TypeScript, and edge computing infrastructure.
