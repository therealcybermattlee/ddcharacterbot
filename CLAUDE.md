# Claude Configuration

## Development Environment Policy
**PRODUCTION ONLY DEVELOPMENT**
- NEVER run local development servers (`npm run dev`, `npm start`)
- NEVER use localhost URLs for API calls
- ALWAYS use Cloudflare Pages for frontend deployment
- ALWAYS use Cloudflare Workers for API deployment
- Frontend URL: https://dnd.cyberlees.dev
- API URL: https://dnd-character-manager-api-dev.cybermattlee-llc.workers.dev/api

## Agent Preference
ALWAYS prefer using specialized agents over direct implementation when available. Agents are optimized for specific tasks and provide better results.

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

## Model Configuration
Use Sonnet (claude-sonnet-4) as the primary model for main tasks and complex reasoning.