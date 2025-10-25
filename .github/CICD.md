# CI/CD Pipeline Documentation

## Overview

The D&D Character Manager uses a comprehensive CI/CD pipeline built with GitHub Actions that handles testing, building, deploying, and monitoring across multiple environments.

---

## Pipeline Architecture

### Workflow Triggers

The deployment pipeline runs on:
- **Push** to `main`, `staging`, or `develop` branches
- **Pull Requests** targeting `main` or `staging`
- **Manual workflow_dispatch** for rollbacks

### Environments

| Environment | Branch | Frontend URL | API URL |
|------------|--------|--------------|---------|
| **Development** | `develop` | https://develop.dnd-character-manager.pages.dev | https://dnd-character-manager-api-dev.cybermattlee-llc.workers.dev |
| **Staging** | `staging` | https://staging.dnd-character-manager.pages.dev | https://dnd-character-manager-api-staging.cybermattlee-llc.workers.dev |
| **Production** | `main` | https://dnd.cyberlees.dev | https://dnd-character-manager-api.cybermattlee-llc.workers.dev |

---

## Pipeline Stages

### 1. Security Scan
**Duration**: ~2-3 minutes

- Runs `npm audit` on both API and Frontend (high-level vulnerabilities)
- Lints code for quality issues
- Type checks TypeScript in both projects
- **Fails on**: TypeScript errors in API or Frontend
- **Continues on**: Security vulnerabilities (warns only), linting issues

### 2. Test
**Duration**: ~1-2 minutes

- Runs unit tests for API and Frontend with Vitest
- Generates test coverage reports
- **Current Status**: Tests run but allow failures (continue-on-error: true)
- **Future**: Will be required once test suite is comprehensive

**Run tests locally**:
```bash
# API tests
cd api && npm test

# Frontend tests
cd frontend && npm test

# With coverage
npm run test:coverage
```

### 3. Build
**Duration**: ~1-2 minutes

- Validates both API and Frontend build successfully
- Ensures no TypeScript errors
- Confirms bundle sizes are acceptable
- **Fails on**: Build errors, TypeScript errors

### 4. Database Validation
**Duration**: ~30 seconds
**Only runs on**: `main` and `staging` branches

- Validates SQL migration files exist
- Checks for basic SQL syntax (CREATE TABLE, ALTER TABLE, etc.)
- **Fails on**: Missing migration files or invalid syntax

### 5. Deploy API
**Duration**: ~30-60 seconds

- Deploys Cloudflare Worker to appropriate environment
- Captures deployment version ID
- Waits 30 seconds for propagation
- Runs health check with retry logic (5 attempts, exponential backoff)
- **Fails on**: Health check failure after 5 attempts
- **Outputs**: deployment-url, version-id

**Health Check Criteria**:
- HTTP 200 response
- Response body contains `"status":"healthy"`
- Database and KV health checks passing

**Smoke Tests**:
- `/health` endpoint returns success
- `/api/v1/status` endpoint returns success
- Rate limiting headers present

### 6. Deploy Frontend
**Duration**: ~1-2 minutes

- Builds Frontend with environment-specific configuration
- Deploys to Cloudflare Pages
- Waits 60 seconds for propagation
- Runs health check with retry logic (5 attempts)
- **Fails on**: Health check failure after 5 attempts
- **Outputs**: deployment-url

**Health Check Criteria**:
- HTTP 200 response
- Page content contains "D&D"

### 7. Post-Deploy
**Duration**: ~30 seconds
**Only runs on**: `main` and `staging` branches

- Runs end-to-end integration smoke tests
- Tests CORS configuration
- Warms up caches at edge locations
- Creates deployment tag (production only)
- **Fails on**: CORS configuration errors, integration test failures

**Deployment Tagging** (Production only):
- Format: `deploy-YYYYMMDD-HHMMSS`
- Includes SHA reference
- Used for rollbacks

---

## Health Checks & Monitoring

### API Health Check

**Endpoint**: `https://<api-url>/health`

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "environment": "production",
    "timestamp": "2025-10-25T12:00:00.000Z",
    "services": {
      "database": {
        "status": "healthy",
        "latency": "150ms"
      },
      "kv": {
        "status": "healthy",
        "latency": "50ms"
      }
    },
    "version": "1.0.0"
  }
}
```

### Health Check Retry Logic

- **Max attempts**: 5
- **Backoff strategy**: Exponential (10s, 20s, 30s, 40s, 50s)
- **Total max wait**: ~2.5 minutes
- **Failure action**: Exit 1 (fails deployment)

---

## Rollback Mechanism

### Automatic Rollback Triggers

Currently, deployments fail and stop (not automatic rollback) on:
- Health check failures
- Smoke test failures
- Build errors

### Manual Rollback Process

Rollback to a previous deployment using the deployment tag:

**1. Find Deployment Tag**
```bash
git tag | grep deploy-
# Example output:
# deploy-20251025-120000
# deploy-20251025-130000
```

**2. Trigger Rollback**

Go to GitHub Actions:
1. Navigate to Actions → "Deploy D&D Character Manager"
2. Click "Run workflow"
3. Select branch: `main`
4. Enter `rollback_version`: `deploy-20251025-120000`
5. Click "Run workflow"

**3. Rollback Process**

The rollback workflow will:
1. Checkout the code from the specified tag
2. Build and deploy API to production
3. Build and deploy Frontend to production
4. Run health checks to verify rollback
5. Notify success

**Manual Rollback via CLI** (Alternative):
```bash
# Checkout the deployment tag
git checkout deploy-20251025-120000

# Deploy API
cd api
npm ci
npm run build
npx wrangler deploy --env production

# Deploy Frontend
cd ../frontend
npm ci
npm run build:production
# Then manually deploy via Cloudflare Pages dashboard
```

---

## Deployment Notifications

### GitHub Actions Outputs

The pipeline provides real-time feedback:
- ✅ **Success**: Green checkmarks for passing steps
- ❌ **Failure**: Red X for failing steps
- ⚠️ **Warning**: Yellow warnings for non-blocking issues

### Deployment Summary (Production)

After successful deployment:
```
🚀 Deployment completed successfully!

📊 Deployment Details:
- Environment: Production
- Frontend: https://dnd.cyberlees.dev
- API: https://dnd-character-manager-api.cybermattlee-llc.workers.dev
- API Version: abc123-def456
- Commit: 1234567890abcdef

✅ All systems operational
```

### Future Enhancements

Planned notifications:
- Slack webhooks for deployment status
- Email notifications for failures
- Discord bot for deployment updates
- Status page integration

---

## Smoke Tests

### API Smoke Tests

Automatically run after deployment:

1. **Health Endpoint**: `/health` returns `success: true`
2. **Status Endpoint**: `/api/v1/status` returns success
3. **Rate Limiting**: Headers include `x-ratelimit-limit`

### Integration Smoke Tests

Run after both deployments complete:

1. **CORS Configuration**: Frontend origin allowed in API responses
2. **End-to-End**: Frontend can reach API
3. **Cache Warming**: Edge locations warmed up

---

## Monitoring & Alerting

### Current Monitoring

- GitHub Actions job status
- Health check responses
- Deployment tags for version tracking

### Metrics to Monitor

- Deployment frequency
- Deployment success rate
- Health check latency
- Test pass rate
- Build times

### Recommended External Tools

- **Cloudflare Analytics**: Built-in metrics
- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **Uptime Robot**: Availability monitoring
- **Better Uptime**: Status page

---

## Troubleshooting

### Deployment Failures

**Health Check Timeout**
```
::error::API health check failed after 5 attempts
```

**Solutions**:
- Check Cloudflare Worker logs: `npx wrangler tail --env production`
- Verify environment variables in Cloudflare dashboard
- Check database connectivity: `npx wrangler d1 list`
- Review recent code changes for breaking issues

**Build Failures**
```
npm run build
> tsc && vite build
Error: TypeScript compilation failed
```

**Solutions**:
- Run `npm run type-check` locally
- Fix TypeScript errors before pushing
- Check for missing dependencies

**Test Failures**
```
Tests: 2 failed, 5 passed, 7 total
```

**Solutions**:
- Run tests locally: `npm test`
- Review failing test output
- Fix code or update tests
- Commit fixes

### Rollback Failures

**Tag Not Found**
```
error: pathspec 'deploy-20251025-120000' did not match any file(s) known to git
```

**Solutions**:
- Verify tag exists: `git tag | grep deploy-`
- Use correct tag format: `deploy-YYYYMMDD-HHMMSS`
- Pull latest tags: `git fetch --tags`

---

## Performance Benchmarks

### Target Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Pipeline Duration (main) | < 8 min | ~7 min |
| API Deploy Time | < 60s | ~45s |
| Frontend Deploy Time | < 120s | ~90s |
| Health Check Latency | < 500ms | ~150ms |
| Test Suite Duration | < 2 min | ~1 min |

---

## Security

### Secrets Management

All secrets stored in GitHub Secrets:
- `CLOUDFLARE_API_TOKEN` - Cloudflare API authentication
- `CLOUDFLARE_ACCOUNT_ID` - Cloudflare account identifier

**Never commit**:
- API tokens
- Private keys
- Environment-specific secrets
- Database credentials

### Permissions

GitHub Actions requires:
- `contents: write` - For creating deployment tags
- `deployments: write` - For deployment records
- `issues: write` - For commenting on issues (future)

---

## Best Practices

### Before Pushing to Main

1. **Run tests locally**: `npm test` in both api/ and frontend/
2. **Type check**: `npm run type-check`
3. **Build locally**: `npm run build`
4. **Test in development**: Deploy to `develop` branch first
5. **Test in staging**: Merge to `staging` for final validation

### During Deployment

1. **Monitor GitHub Actions**: Watch for failures
2. **Check health endpoints**: Verify services are responding
3. **Test manually**: Smoke test the deployed application
4. **Review logs**: Check for errors in Cloudflare dashboard

### After Deployment

1. **Verify functionality**: Test critical user flows
2. **Monitor errors**: Check for spikes in error rates
3. **Review performance**: Ensure latency is acceptable
4. **Tag release**: Deployment tags created automatically

---

## Future Improvements

### Planned Enhancements

1. **Required Tests**: Remove `continue-on-error` once tests are comprehensive
2. **E2E Tests**: Add Playwright tests for critical flows
3. **Performance Tests**: Lighthouse CI for frontend performance
4. **Security Scans**: SAST tools (Snyk, SonarCloud)
5. **Deployment Previews**: Preview builds for PRs
6. **Blue-Green Deployments**: Zero-downtime deployments
7. **Canary Releases**: Gradual rollout to percentage of users

---

## Support

For issues with CI/CD pipeline:
1. Check GitHub Actions logs
2. Review this documentation
3. Check Cloudflare Workers logs: `npx wrangler tail`
4. Open GitHub issue with `ci/cd` label
