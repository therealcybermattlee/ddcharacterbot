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

## Project Memory Management
**REQUIRED:** Always update project memory files after significant changes:
- Update MEMORY.md with session context and decisions
- Update PROJECT-PLAN.md with progress and next steps
- Maintain context between sessions

## Model Configuration
Use Sonnet (claude-sonnet-4) as the primary model for main tasks and complex reasoning.