# GitHub Actions CI/CD Workflows

This directory contains all GitHub Actions workflows for the Kash Budget project. These workflows automate testing, building, and deploying the application across development and production environments.

## Workflow Overview

### 1. Backend CI (`backend.yml`)

**Trigger:** Push or Pull Request to `main` branch with changes to:
- `apps/api/**`
- `packages/shared/**`
- `package.json`, `package-lock.json`
- Workflow file itself

**Jobs:**
- **Lint:** ESLint checks for code quality
- **Type Check:** TypeScript compilation without output
- **Test:** Jest unit tests
- **Build:** NestJS application build

**Status Badge:** [![Backend CI](../../.github/workflows/backend.yml/badge.svg)](../../actions/workflows/backend.yml)

**When to Use:** All code changes to the backend API

---

### 2. Mobile CI (`mobile.yml`)

**Trigger:** Push or Pull Request to `main` branch with changes to:
- `apps/mobile/**`
- `packages/shared/**`
- `package.json`, `package-lock.json`
- Workflow file itself

**Jobs:**
- **Lint:** ESLint checks for mobile code
- **Type Check:** TypeScript type validation

**Status Badge:** [![Mobile CI](../../.github/workflows/mobile.yml/badge.svg)](../../actions/workflows/mobile.yml)

**When to Use:** All code changes to the React Native mobile app

---

### 3. Backend Deploy (`backend-deploy.yml`)

**Trigger:** Push to `main` branch with changes to:
- `apps/api/**`
- `packages/shared/**`
- `Dockerfile`
- `.dockerignore`
- Package files
- Workflow file itself

**Prerequisites:**
- AWS account configured with ECR repository
- App Runner service created
- GitHub Secrets configured (see [AWS-DEPLOYMENT-SETUP.md](./AWS-DEPLOYMENT-SETUP.md))

**Jobs:**
1. **Checkout:** Clone repository
2. **AWS Login:** Configure AWS credentials from GitHub Secrets
3. **ECR Login:** Authenticate with Elastic Container Registry
4. **Build Docker Image:** Multi-stage build from Dockerfile
5. **Push to ECR:** Upload image with commit SHA and `latest` tags
6. **Update App Runner:** Deploy new image to AWS App Runner
7. **Wait for Deployment:** Poll service status until RUNNING
8. **Health Check:** Verify `/api/health` endpoint
9. **Notify:** Report success or failure

**Deployment Flow:**

```
Code Push to main
    ↓
Backend CI tests pass (backend.yml)
    ↓
Docker build from Dockerfile
    ↓
Push image to AWS ECR
    ↓
Update App Runner service
    ↓
Wait for service to start
    ↓
Health check endpoint
    ↓
Deployment complete
```

**Environment Variables (set in workflow):**
- `AWS_REGION`: `eu-central-1`
- `ECR_REPOSITORY`: `kash-budget-api`
- `APP_RUNNER_SERVICE`: `kash-budget-api`

**Secrets Required (GitHub Settings):**
- `AWS_ACCOUNT_ID`: Your AWS account ID
- `AWS_ACCESS_KEY_ID`: IAM user access key
- `AWS_SECRET_ACCESS_KEY`: IAM user secret key

---

## Setup Instructions

### First-Time Setup

1. **Enable GitHub Actions**
   - Go to repository Settings → Actions
   - Select "Allow all actions and reusable workflows"

2. **Configure AWS Access** (see [AWS-DEPLOYMENT-SETUP.md](./AWS-DEPLOYMENT-SETUP.md))
   - Create IAM user `github-actions-kash`
   - Generate access keys
   - Create ECR repository
   - Create App Runner service

3. **Add GitHub Secrets**
   - Go to Settings → Secrets and variables → Actions
   - Add all required secrets (see section below)

4. **Test Workflow**
   - Make a small change to `apps/api/`
   - Push to `main`
   - Verify Backend CI workflow passes
   - Verify Backend Deploy workflow starts and completes

### Adding Secrets to GitHub

Using GitHub CLI:

```bash
gh secret set AWS_ACCOUNT_ID --body "123456789012"
gh secret set AWS_ACCESS_KEY_ID --body "AKIAIOSFODNN7EXAMPLE"
gh secret set AWS_SECRET_ACCESS_KEY --body "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
gh secret set AWS_REGION --body "eu-central-1"
```

Using GitHub Web Interface:

1. Go to repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Enter secret name and value
4. Click "Add secret"

---

## Workflow Files Structure

```
.github/workflows/
├── README.md                      # This file
├── AWS-DEPLOYMENT-SETUP.md       # AWS infrastructure setup guide
├── backend.yml                    # Backend CI workflow
├── mobile.yml                     # Mobile CI workflow
└── backend-deploy.yml             # Backend CD/deployment workflow
```

---

## Troubleshooting

### Workflow Won't Trigger

**Problem:** Changes pushed but workflow didn't run

**Solutions:**
1. Check path filters match your changes
2. Verify branch is `main`
3. Check GitHub Actions is enabled in Settings
4. Verify workflow file has no syntax errors (check Actions tab)

**Debug Command:**
```bash
# View recent pushes
git log --oneline -5

# Check workflow syntax
act -l
```

---

### Backend CI Fails

**Problem:** Linting, type-check, or test failures

**Solutions:**
1. Run locally: `npm run lint --workspace=apps/api`
2. Check TypeScript: `npx tsc --noEmit --project apps/api/tsconfig.json`
3. Run tests: `npm run test --workspace=apps/api`
4. Fix errors before pushing

---

### Docker Build Fails

**Problem:** Dockerfile build fails in backend-deploy workflow

**Solutions:**
1. Test locally: `docker build -t test-image .`
2. Check Dockerfile syntax
3. Verify all dependencies are in package.json
4. Check `.dockerignore` isn't excluding needed files

**Debug Steps:**
```bash
# Test build locally
docker build -t kash-test .

# Test with no cache (forces full rebuild)
docker build --no-cache -t kash-test .

# Run container locally
docker run -p 3000:3000 kash-test
curl http://localhost:3000/api/health
```

---

### AWS Deployment Fails

**Problem:** Backend Deploy workflow fails at AWS steps

**Solutions:**

1. **ECR Login Fails**
   - Verify `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` are correct
   - Check IAM user has ECR permissions
   - Verify repository name matches `kash-budget-api`

2. **App Runner Update Fails**
   - Verify App Runner service is created
   - Check IAM policy has `apprunner:UpdateService` permission
   - Verify service ARN is correct

3. **Health Check Fails**
   - Service may still be starting (takes 2-5 minutes)
   - Check CloudWatch logs: `aws logs tail /aws/apprunner/kash-budget-api --follow`
   - Verify environment variables are set in App Runner service

**Debug Commands:**
```bash
# Check ECR repository
aws ecr describe-repositories --region eu-central-1

# List pushed images
aws ecr list-images --repository-name kash-budget-api --region eu-central-1

# Check App Runner service
aws apprunner describe-services --region eu-central-1

# Check service logs
aws logs tail /aws/apprunner/kash-budget-api --follow
```

---

## Best Practices

### Code Changes

1. **Always test locally before pushing**
   ```bash
   npm run lint --workspace=apps/api
   npm run test --workspace=apps/api
   npm run build --workspace=apps/api
   ```

2. **Keep Docker image minimal**
   - Use `.dockerignore` to exclude unnecessary files
   - Multi-stage builds keep production image small

3. **Monitor deployment health**
   - Check CloudWatch logs after deployment
   - Monitor API metrics for errors or latency

### Secrets Management

1. **Never commit secrets to git**
   - Use GitHub Secrets for all sensitive data
   - Use `.env.local` (in `.gitignore`) for local development

2. **Rotate credentials regularly**
   - Regenerate AWS access keys every 90 days
   - Update GitHub Secrets after rotation

3. **Limit IAM permissions**
   - GitHub Actions user should only have necessary permissions
   - Use separate credentials for development and production

### Performance

1. **Path filters reduce unnecessary runs**
   - Only backend workflow runs for API changes
   - Only deploy workflow runs after Backend CI passes

2. **Caching optimizes builds**
   - npm cache is enabled in CI
   - Docker layer caching is automatic

---

## Monitoring and Alerts

### CloudWatch Monitoring

Monitor these metrics after deployment:

```bash
# View recent errors
aws logs tail /aws/apprunner/kash-budget-api --filter-pattern ERROR

# Count requests per minute
aws logs insights --log-group /aws/apprunner/kash-budget-api \
  --query 'fields @timestamp, @message | stats count() by bin(5m)'
```

### GitHub Actions Dashboard

1. Go to Actions tab in repository
2. View workflow runs
3. Click run to see detailed logs
4. Diagnose failures from step output

---

## Rollback Procedure

If deployed code has critical issues:

### Quick Rollback (AWS Console)

1. Go to AWS App Runner console
2. Select `kash-budget-api` service
3. Click "Deployments"
4. Select previous deployment
5. Click "Deploy"

### CLI Rollback

```bash
# Get previous image tag
PREVIOUS_TAG=$(aws ecr list-images --repository-name kash-budget-api \
  --query 'imageIds[1].imageTag' --output text)

# Update service to previous image
aws apprunner update-service \
  --service-arn arn:aws:apprunner:eu-central-1:ACCOUNT_ID:service/kash-budget-api/SERVICE_ID \
  --source-configuration "ImageRepository={RepositoryType=ECR,ImageIdentifier=ACCOUNT_ID.dkr.ecr.eu-central-1.amazonaws.com/kash-budget-api:$PREVIOUS_TAG}"
```

---

## FAQ

**Q: Why is my deployment taking so long?**
A: App Runner typically takes 2-5 minutes to deploy and start the service. This is normal.

**Q: Can I deploy to multiple environments?**
A: Currently configured for production (main branch). For staging, create `staging` branch and duplicate workflows with different service names.

**Q: How do I manually trigger a workflow?**
A: Go to Actions tab → Select workflow → Click "Run workflow" → Select branch → Click "Run workflow"

**Q: What happens if tests fail?**
A: Deployment workflow won't start until Backend CI passes. Fix code locally and push again.

**Q: Can I skip the health check?**
A: Yes, modify `backend-deploy.yml` step "Health check" - set `continue-on-error: true`

---

## Additional Resources

- [AWS-DEPLOYMENT-SETUP.md](./AWS-DEPLOYMENT-SETUP.md) - Complete AWS infrastructure guide
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [AWS App Runner Documentation](https://docs.aws.amazon.com/apprunner/)
- [Docker Documentation](https://docs.docker.com/)

---

**Last Updated:** November 17, 2025
**Maintained By:** Developer Agent
