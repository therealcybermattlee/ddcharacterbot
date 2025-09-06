# D&D Character Manager - Deployment Guide

## Overview

This guide covers the complete deployment strategy for the D&D Character Manager application using Cloudflare's ecosystem. The application consists of:

- **Frontend**: React application deployed on Cloudflare Pages
- **Backend**: Node.js API deployed on Cloudflare Workers
- **Database**: D1 SQLite database for character and campaign data
- **Storage**: KV for caching/sessions, R2 for file assets
- **CI/CD**: GitHub Actions for automated deployments

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Cloudflare    │    │   Cloudflare    │    │   Cloudflare    │
│     Pages       │────│    Workers      │────│       D1        │
│   (Frontend)    │    │     (API)       │    │   (Database)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                       ┌────────┴────────┐
                       │                 │
                ┌──────▼──────┐   ┌──────▼──────┐
                │      KV     │   │      R2     │
                │  (Cache/    │   │   (File     │
                │  Sessions)  │   │  Storage)   │
                └─────────────┘   └─────────────┘
```

## Prerequisites

1. **Node.js 20+** - Required for development and build processes
2. **Cloudflare Account** - With access to Workers, Pages, D1, KV, and R2
3. **GitHub Account** - For repository and CI/CD
4. **Domain** (Optional) - For custom domain setup

## Initial Setup

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url> dnd-character-manager
cd dnd-character-manager

# Install API dependencies
cd api
npm install

# Install Frontend dependencies
cd ../frontend
npm install

cd ..
```

### 2. Cloudflare Authentication

```bash
# Install Wrangler CLI globally
npm install -g wrangler

# Authenticate with Cloudflare
wrangler auth login
```

### 3. Infrastructure Setup

Run the automated setup script to create all necessary Cloudflare resources:

```bash
chmod +x infrastructure/setup.sh
./infrastructure/setup.sh
```

This script will:
- Create D1 databases for all environments
- Set up KV namespaces for caching and sessions
- Create R2 buckets for asset storage
- Generate configuration templates

### 4. Update Configuration Files

After running the setup script, update these files with the generated resource IDs:

#### `api/wrangler.toml`
Replace placeholder values with actual resource IDs:
```toml
[[env.production.d1_databases]]
binding = "DB"
database_name = "dnd-character-db-prod"
database_id = "your-actual-database-id"  # Update this

[[env.production.kv_namespaces]]
binding = "CACHE"
id = "your-actual-kv-id"  # Update this
```

#### Environment Configuration Files
Update `infrastructure/environments/*.toml` with your actual domains and settings.

## Environment Configuration

### Development Environment

For local development:

```bash
# In the frontend directory
cd frontend
cp .env.example .env.local

# Edit .env.local with your settings
VITE_API_URL=http://localhost:8787
VITE_ENVIRONMENT=development
```

### Staging Environment

Staging environment is automatically configured through CI/CD when pushing to the `staging` branch.

### Production Environment

Production environment is automatically configured through CI/CD when pushing to the `main` branch.

## Database Setup

### 1. Run Migrations

```bash
cd api

# Development
npm run db:migrate

# Staging
npm run db:migrate:staging

# Production
npm run db:migrate:production
```

### 2. Seed Development Data (Optional)

```bash
npm run db:seed
```

## Deployment Process

### Automated Deployment (Recommended)

The application uses GitHub Actions for automated deployment:

1. **Push to `develop` branch** → Deploys to development environment
2. **Push to `staging` branch** → Deploys to staging environment  
3. **Push to `main` branch** → Deploys to production environment

### Manual Deployment

If needed, you can deploy manually:

```bash
# Deploy API
cd api
wrangler deploy --env production

# Deploy Frontend
cd ../frontend
npm run build:production
wrangler pages deploy dist --project-name dnd-character-manager
```

## GitHub Actions Setup

### Required Secrets

Add these secrets to your GitHub repository (Settings → Secrets):

```
CLOUDFLARE_API_TOKEN=your-cloudflare-api-token
CLOUDFLARE_ACCOUNT_ID=your-cloudflare-account-id
```

### Workflow Triggers

- **Pull Requests**: Runs tests and security checks
- **Push to develop**: Deploys to development environment
- **Push to staging**: Deploys to staging environment
- **Push to main**: Deploys to production environment

## Monitoring and Health Checks

### Health Check Endpoints

- `GET /health` - Basic health status
- `GET /health/detailed` - Detailed service status
- `GET /health/ready` - Readiness check for load balancers
- `GET /health/alive` - Liveness check for monitoring
- `GET /health/metrics` - Application metrics
- `GET /health/performance` - Performance metrics

### Monitoring Setup

1. **Cloudflare Analytics** - Built-in request/response monitoring
2. **Custom Metrics** - Application-specific metrics via health endpoints
3. **Error Tracking** - Console logging with structured data
4. **Performance Monitoring** - Request timing and resource usage

### Alerting

Set up alerts for:
- High error rates (>5% over 5 minutes)
- High response times (>2s average over 5 minutes)
- Service unavailability
- Database connection failures
- Storage service failures

## Security Configuration

### Authentication

- JWT-based authentication with session management
- Secure session storage in KV
- Configurable session timeouts

### Authorization

- Role-based access control (RBAC)
- Resource ownership validation
- Campaign membership verification

### Security Headers

- Content Security Policy (CSP)
- CSRF protection
- Rate limiting
- Input validation

### Environment Variables

Never commit sensitive data. Use Cloudflare Workers secrets:

```bash
# Set production secrets
wrangler secret put JWT_SECRET --env production
wrangler secret put DATABASE_ENCRYPTION_KEY --env production
```

## Performance Optimization

### Caching Strategy

- **KV Cache**: API responses, user preferences
- **Browser Cache**: Static assets (1 year)
- **CDN Cache**: Images and assets (1 year)
- **Database Cache**: Query results (30 minutes)

### Asset Optimization

- **Images**: Automatic WebP conversion, responsive sizing
- **JavaScript**: Code splitting, tree shaking
- **CSS**: Minification, critical CSS inlining

### Database Optimization

- Proper indexing on frequently queried fields
- Query optimization with EXPLAIN QUERY PLAN
- Connection pooling via D1

## Cost Optimization

### Free Tier Usage

The application is designed to operate within Cloudflare's free tiers:

- **Workers**: 100,000 requests/day
- **Pages**: Unlimited static requests  
- **D1**: 5M reads, 100K writes per day
- **KV**: 100K reads, 1K writes per day
- **R2**: 10GB storage, 1M Class A operations

### Scaling Considerations

For high-traffic applications:

1. **Upgrade to paid plans** for higher limits
2. **Implement caching** to reduce database calls
3. **Optimize queries** to reduce D1 usage
4. **Use R2 CDN** for static asset delivery
5. **Consider sharding** for very large datasets

## Disaster Recovery

### Backup Strategy

1. **Database Backups**: D1 automatic backups (paid plans)
2. **Asset Backups**: R2 versioning enabled
3. **Code Backups**: Git repository with tags

### Recovery Procedures

1. **Database Recovery**: Restore from D1 backup
2. **Asset Recovery**: Restore from R2 versions
3. **Application Recovery**: Deploy from Git tags

### Rollback Process

```bash
# Rollback to previous deployment
git checkout tags/deploy-YYYYMMDD-HHMMSS
git push origin main --force-with-lease
```

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check wrangler.toml configuration
   - Verify database ID is correct
   - Run migrations

2. **CORS Errors**
   - Verify CORS_ORIGIN environment variable
   - Check frontend domain configuration

3. **Authentication Failures** 
   - Verify JWT_SECRET is set
   - Check session expiration settings

4. **File Upload Issues**
   - Verify R2 bucket configuration
   - Check CORS settings on bucket

### Debug Mode

Enable debug mode in development:

```bash
# Set debug environment variable
wrangler dev --var DEBUG=true
```

### Logs

View application logs:

```bash
# Workers logs
wrangler tail --env production

# Pages logs  
wrangler pages deployment tail
```

## Best Practices

### Development

1. **Use TypeScript** for type safety
2. **Write tests** for critical functionality  
3. **Follow security guidelines** for authentication
4. **Implement proper error handling**
5. **Use structured logging**

### Deployment

1. **Test in staging** before production
2. **Use feature flags** for gradual rollouts
3. **Monitor deployment health** 
4. **Have rollback plans ready**
5. **Document changes** in deployment tags

### Operations

1. **Monitor key metrics** continuously
2. **Set up proper alerting**
3. **Regular security updates**
4. **Performance optimization**
5. **Disaster recovery testing**

## Support and Maintenance

### Regular Tasks

- **Weekly**: Review metrics and performance
- **Monthly**: Security updates and dependency updates
- **Quarterly**: Disaster recovery testing
- **Annually**: Architecture review and optimization

### Support Contacts

- **Cloudflare Support**: For infrastructure issues
- **GitHub Issues**: For application bugs and features
- **Team Contact**: For operational support

## Additional Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [D1 Database Documentation](https://developers.cloudflare.com/d1/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)

---

**Last Updated**: 2024-09-05  
**Version**: 1.0.0