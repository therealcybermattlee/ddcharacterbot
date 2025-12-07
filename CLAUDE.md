# Claude Configuration

## Development Environment Policy
**PRODUCTION ONLY DEVELOPMENT**
- NEVER run local development servers (`npm run dev`, `npm start`)
- NEVER use localhost URLs for API calls
- ALWAYS use Cloudflare Pages for frontend deployment
- ALWAYS use Cloudflare Workers for API deployment
- Frontend URL: https://dnd.cyberlees.dev
- API URL: https://dnd-character-manager-api-dev.cybermattlee-llc.workers.dev/api

## Agent Usage Policy
**MANDATORY AGENT USAGE**
- ALWAYS use Task tool with specialized agents for ANY task that matches agent capabilities
- NEVER perform direct implementation when a specialized agent is available
- If unsure which agent to use, use general-purpose agent for research first
- Agent usage is REQUIRED, not optional - direct implementation is prohibited

Available agents include:
- general-purpose: Complex research and multi-step tasks
- frontend-developer: React components, UI implementation
- typescript-pro: Advanced TypeScript patterns
- ui-ux-designer: Interface design and user experience
- deployment-engineer: CI/CD and infrastructure
- architect-review: Code architecture review
- data-scientist: Data analysis and SQL queries
- api-documenter: API documentation and specs
- test-automator: Test suites and automation
- code-reviewer: Code quality review
- backend-architect: API and system design

## Cloudflare Workers Commands
**Authentication:**
```bash
npx wrangler login
npx wrangler whoami
```

**Development Deployment:**
```bash
npx wrangler deploy --config api/wrangler.toml --env development
```

**Production Deployment:**
```bash
npx wrangler deploy --config api/wrangler.toml --env production
```

**Secrets Management:**
```bash
npx wrangler secret put JWT_SECRET --config api/wrangler.toml --env development
npx wrangler secret put JWT_SECRET --config api/wrangler.toml --env production
npx wrangler secret list --config api/wrangler.toml --env development
```

**Database Operations:**
```bash
npx wrangler d1 list
npx wrangler d1 execute dnd-character-manager-dev --file=database/migrations/001_initial.sql --env development
npx wrangler d1 execute dnd-character-manager-prod --file=database/migrations/001_initial.sql --env production
```

**KV Operations:**
```bash
npx wrangler kv:namespace list
npx wrangler kv:key list --binding=KV --env development
```

**Monitoring:**
```bash
npx wrangler tail --config api/wrangler.toml --env development
npx wrangler list
```

## Git Configuration
**Authentication Setup:**
- Username: TheRealTwoBowShow
- Token stored in environment: GITHUB_TOKEN
- Remote configured with token authentication
- Commits and pushes automated with stored credentials

## Project Memory Management
**REQUIRED:** Always update project memory files after significant changes:
- Update MEMORY.md with session context and decisions
- Update PROJECT-PLAN.md with progress and next steps
- Maintain context between sessions

### Auto-Compaction Rules
**Trigger compaction when MEMORY.md exceeds:**
- **Line count**: >800 lines
- **Byte size**: >100KB
- **Session count**: >15 detailed sessions

**Compaction Strategy:**
1. **Keep Recent** (retain in MEMORY.md):
   - Current sprint status and progress
   - Last 3-5 sessions with full details
   - All active bugs and open issues
   - Critical decisions from last 30 days
   - Current deployment state

2. **Archive Old** (move to MEMORY-ARCHIVE.md):
   - Sessions older than 30 days
   - Completed sprints (summarized)
   - Resolved bugs (one-line summary only)
   - Historical deployment logs

3. **Compression Format**:
   - Detailed sessions: Full markdown with all sub-items
   - Summarized sessions: One paragraph per major task
   - Archived sessions: Title, date, 2-3 bullet points max

**Archive File Structure:**
```
MEMORY-ARCHIVE.md
├── Archive: [Date Range]
│   ├── Sprint Summary
│   ├── Key Decisions
│   └── Major Milestones
└── Session History (compressed)
```

**When to Compact:**
- At the start of each new sprint
- When MEMORY.md exceeds thresholds
- Before major releases
- Monthly maintenance (first session of month)

## Model Configuration
Use Sonnet (claude-sonnet-4) as the primary model for main tasks and complex reasoning.

## Active Technologies
- TypeScript 5.6.3, React 18.3.1 + React (hooks: useState, useEffect, useMemo), React Router DOM 6.26.2, Axios 1.7.7 (001-fix-skills-next-button)
- localStorage (browser) for character creation state persistence (001-fix-skills-next-button)
- TypeScript 5.x, React 18.x + React, React hooks (useState, useEffect, useMemo, useRef), Tailwind CSS for styling (004-basic-info-bugs)
- Browser localStorage (via CharacterCreationContext), Cloudflare D1 (backend) (004-basic-info-bugs)
- TypeScript 5.x, React 18.x + React Hooks (useState, useEffect, useMemo), Radix UI components, D&D 5e API (005-cleric-selection-bug)
- localStorage (character creation progress), context API (CharacterCreationContext) (005-cleric-selection-bug)
- TypeScript 5.x (Frontend), TypeScript 5.x on Cloudflare Workers (Backend) + React 18, Vite (Frontend); Hono, Cloudflare Workers SDK (Backend) (003-class-skill-display-fix)
- Cloudflare D1 SQLite database (003-class-skill-display-fix)
- TypeScript 5.x, React 18.x + React hooks (useState, useEffect, useRef), ref pattern for unstable callbacks (006-skills-next-button)
- localStorage (character state), CharacterCreationContext (wizard validation) (006-skills-next-button)
- TypeScript 5.x, React 18.x + React 18.x (useState, useEffect, useRef hooks), CharacterCreationContext, localStorage (007-ability-scores-save)
- Client-side localStorage for character data persistence (007-ability-scores-save)

## Recent Changes
- 001-fix-skills-next-button: Added TypeScript 5.6.3, React 18.3.1 + React (hooks: useState, useEffect, useMemo), React Router DOM 6.26.2, Axios 1.7.7
