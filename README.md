# D&D Character Manager

A comprehensive web application for managing Dungeons & Dragons characters and campaigns, built with modern web technologies and deployed on Cloudflare's edge infrastructure.

## Features

### Character Management
- Create and customize D&D 5e characters
- Track ability scores, skills, and proficiencies
- Manage equipment, spells, and features
- Character progression and leveling
- Portrait and token uploads

### Campaign Management
- Create and organize campaigns
- Invite players and manage permissions
- Track session logs and character progression
- Share maps, handouts, and assets
- Campaign-specific settings and rules

### User Experience
- Responsive design for desktop and mobile
- Offline capability with service workers
- Real-time updates and collaboration
- Secure authentication and authorization
- Fast global performance via Cloudflare Edge

## Architecture

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Redux Toolkit** for state management
- **React Router** for navigation

### Backend
- **Cloudflare Workers** for serverless API
- **Hono** framework for request routing
- **TypeScript** for type safety
- **Zod** for input validation
- **JWT** for authentication

### Infrastructure
- **Cloudflare D1** for SQLite database
- **Cloudflare KV** for caching and sessions
- **Cloudflare R2** for file storage
- **Cloudflare Pages** for static hosting
- **GitHub Actions** for CI/CD

## 🚀 Current Implementation Status

### ✅ Completed Features (Sprint 1 & 2)

#### Frontend
- **Design System**: Complete D&D-themed UI components with Radix UI + Tailwind CSS
- **Components**: Button, Input, Card, Badge, Dice, Dialog components
- **Development Server**: Running at http://localhost:3000
- **Responsive Design**: Mobile-first approach with touch-friendly interfaces

#### Backend API
- **Production Deployment**: https://dnd-character-manager-api-dev.cybermattlee-llc.workers.dev
- **Frontend Production**: https://dnd.cyberlees.dev
- **Authentication**: JWT-based with secure session management
- **Character Management**: Full CRUD operations for D&D 5e characters
- **Security**: CORS, rate limiting, input validation, password hashing
- **Database**: D1 SQLite with complete D&D 5e schema (17 tables)

#### Working API Endpoints
- `POST /api/auth/register` - User registration ✅
- `POST /api/auth/login` - User authentication ✅
- `POST /api/auth/logout` - Session termination ✅
- `GET /api/auth/profile` - User profile ✅
- `POST /api/auth/refresh` - Token refresh ✅
- `GET /api/characters` - List characters ✅
- `POST /api/characters` - Create character ✅
- `GET /api/characters/:id` - Get character ✅
- `PUT /api/characters/:id` - Update character ✅
- `DELETE /api/characters/:id` - Delete character ✅
- `GET /health` - System health check ✅

### 🔄 Next Steps (Sprint 3 & 4)
- Character creation wizard UI
- Interactive character sheets
- Campaign management
- Real-time collaboration features

## Quick Start

### Prerequisites
- Node.js 20 or higher
- npm package manager
- Cloudflare account (for deployment)
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ddcharacterbot
   ```

2. **Install dependencies**
   ```bash
   # Install API dependencies
   cd api && npm install
   
   # Install frontend dependencies
   cd ../frontend && npm install
   ```

3. **Start development servers**
   ```bash
   # Terminal 1: Start frontend (from /frontend directory)
   npm run dev
   
   # Terminal 2: Start API (from /api directory)  
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - API: http://localhost:8787
   - Design System: http://localhost:3000/design-system

### Production Setup

1. **Install Wrangler CLI**
   ```bash
   npm install -g wrangler
   ```

2. **Authenticate with Cloudflare**
   ```bash
   wrangler auth login
   ```

3. **Set up database and KV**
   ```bash
   cd api
   
   # Create D1 database
   wrangler d1 create dnd-character-manager-dev
   
   # Create KV namespace
   wrangler kv namespace create "KV"
   wrangler kv namespace create "KV" --preview
   
   # Update wrangler.toml with generated IDs
   ```

4. **Run database migrations**
   ```bash
   wrangler d1 execute DB --file=../database/migrations/0001_initial_schema.sql --env=development --remote
   ```

5. **Set JWT secret**
   ```bash
   echo "your-jwt-secret-key" | wrangler secret put JWT_SECRET --env development
   ```

6. **Deploy API**
   ```bash
   npm run deploy:dev
   ```

6. **Start development servers**
   ```bash
   # Terminal 1: Start API
   cd api && npm run dev
   
   # Terminal 2: Start frontend
   cd frontend && npm run dev
   ```

Visit `http://localhost:3000` to access the application.

## Development

### Project Structure
```
dnd-character-manager/
├── api/                    # Cloudflare Workers API
│   ├── src/
│   │   ├── routes/        # API route handlers
│   │   ├── lib/           # Utilities and managers
│   │   ├── middleware/    # Security and validation
│   │   └── index.ts       # Main application entry
│   ├── wrangler.toml      # Workers configuration
│   └── package.json
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Redux store
│   │   ├── utils/         # Utilities
│   │   └── main.tsx       # Application entry
│   ├── vite.config.ts     # Vite configuration
│   └── package.json
├── database/               # Database schema and migrations
│   ├── migrations/        # SQL migration files
│   └── seeds/            # Sample data
├── infrastructure/         # Environment configurations
│   ├── environments/      # Environment-specific settings
│   └── setup.sh          # Infrastructure setup script
├── .github/workflows/     # CI/CD pipelines
└── docs/                  # Additional documentation
```

### Available Scripts

#### API Development
```bash
cd api

# Development server
npm run dev

# Build TypeScript
npm run build

# Run tests
npm run test

# Database operations
npm run db:migrate
npm run db:seed

# Deploy
npm run deploy
npm run deploy:staging
npm run deploy:production
```

#### Frontend Development
```bash
cd frontend

# Development server
npm run dev

# Build for production
npm run build
npm run build:staging
npm run build:production

# Preview production build
npm run preview

# Run tests
npm run test

# Linting and type checking
npm run lint
npm run type-check
```

### Environment Variables

Create environment files for local development:

**Frontend (`frontend/.env.local`):**
```bash
VITE_API_URL=http://localhost:8787
VITE_ENVIRONMENT=development
VITE_FEATURE_AI_GENERATION=true
```

**API (via Wrangler secrets):**
```bash
wrangler secret put JWT_SECRET --env development
wrangler secret put DATABASE_ENCRYPTION_KEY --env development
```

## Deployment

The application uses automated deployment via GitHub Actions:

- **Development**: Push to `develop` branch
- **Staging**: Push to `staging` branch  
- **Production**: Push to `main` branch

### Manual Deployment

```bash
# Deploy API
cd api && npm run deploy:production

# Deploy Frontend  
cd frontend && npm run build:production
wrangler pages deploy dist --project-name dnd-character-manager
```

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Characters
- `GET /api/characters` - List user's characters
- `POST /api/characters` - Create new character
- `GET /api/characters/:id` - Get character details
- `PUT /api/characters/:id` - Update character
- `DELETE /api/characters/:id` - Delete character

### Campaigns
- `GET /api/campaigns` - List user's campaigns
- `POST /api/campaigns` - Create new campaign
- `GET /api/campaigns/:id` - Get campaign details
- `PUT /api/campaigns/:id` - Update campaign
- `DELETE /api/campaigns/:id` - Delete campaign

### Assets
- `POST /api/assets/upload` - Upload character portrait/asset
- `GET /api/assets/:id` - Download asset
- `DELETE /api/assets/:id` - Delete asset

### Health & Monitoring
- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed system status
- `GET /health/metrics` - Application metrics

## Security

### Authentication & Authorization
- JWT-based authentication with secure sessions
- Role-based access control (RBAC)
- Resource ownership validation
- Campaign membership verification

### Security Features
- Content Security Policy (CSP)
- CSRF protection
- Rate limiting per user/IP
- Input validation and sanitization
- Secure file upload validation

### Data Protection
- Encrypted sensitive data storage
- Secure session management
- Privacy-compliant user data handling
- Automated data retention policies

## Performance

### Optimization Features
- Global edge deployment via Cloudflare
- Intelligent caching strategies
- Asset optimization and compression
- Code splitting and lazy loading
- Service worker for offline capability

### Monitoring
- Real-time performance metrics
- Error tracking and alerting
- Health checks and uptime monitoring
- Database query optimization

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Follow existing code style and patterns
- Update documentation for API changes
- Test in staging before production deployment

## Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test suite
npm test -- --grep "Character Management"
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Documentation**: See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment details
- **Issues**: Report bugs and feature requests on GitHub Issues
- **Security**: Report security vulnerabilities privately to [security@example.com]
- **Community**: Join our Discord server for community support

## Roadmap

### Version 1.1
- [ ] Advanced character sheet customization
- [ ] Campaign calendar and scheduling
- [ ] Enhanced mobile experience
- [ ] Character import/export features

### Version 1.2
- [ ] Real-time collaborative editing
- [ ] Voice/video integration
- [ ] Advanced campaign analytics
- [ ] Third-party integrations (Roll20, D&D Beyond)

### Version 2.0
- [ ] Multi-system support (Pathfinder, etc.)
- [ ] AI-powered character generation
- [ ] Advanced campaign management tools
- [ ] Mobile applications

---

Built with ❤️ using Cloudflare's edge infrastructure for global performance and reliability.