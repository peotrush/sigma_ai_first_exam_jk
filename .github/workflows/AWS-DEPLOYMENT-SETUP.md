# AWS Deployment Infrastructure Setup Guide

This guide provides step-by-step instructions for setting up the AWS infrastructure required to deploy the Kash Budget backend API.

## Overview

The deployment architecture uses:
- **Amazon ECR** (Elastic Container Registry) for Docker image storage
- **AWS App Runner** or **ECS** (Elastic Container Service) for application hosting
- **Amazon RDS** for PostgreSQL database (existing setup)
- **Amazon ElastiCache** for Redis caching (existing setup)
- **AWS CloudWatch** for logging and monitoring
- **GitHub Actions** for CI/CD orchestration

**Region:** `eu-central-1` (Frankfurt) - closest to Bulgaria for low latency

## Prerequisites

Before starting, ensure you have:
1. AWS Account with appropriate permissions
2. AWS CLI installed and configured locally
3. GitHub repository with Actions enabled
4. Docker installed locally (for testing images)

## Step 1: Create IAM User for GitHub Actions

GitHub Actions needs AWS credentials to build and push Docker images to ECR and deploy the application.

### 1.1 Create IAM User

```bash
aws iam create-user --user-name github-actions-kash
```

### 1.2 Create Access Keys

```bash
aws iam create-access-key --user-name github-actions-kash
```

**Output:** You'll receive `AccessKeyId` and `SecretAccessKey`. Save these securely - you cannot retrieve the secret key again.

### 1.3 Attach Inline Policy (ECR & App Runner)

Create a file `github-actions-policy.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ECRPullPushImages",
      "Effect": "Allow",
      "Action": [
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "ecr:PutImage",
        "ecr:InitiateLayerUpload",
        "ecr:UploadLayerPart",
        "ecr:CompleteLayerUpload",
        "ecr:GetAuthorizationToken"
      ],
      "Resource": "arn:aws:ecr:eu-central-1:*:repository/kash-budget-api"
    },
    {
      "Sid": "ECRAuthToken",
      "Effect": "Allow",
      "Action": "ecr:GetAuthorizationToken",
      "Resource": "*"
    },
    {
      "Sid": "AppRunnerDeploy",
      "Effect": "Allow",
      "Action": [
        "apprunner:UpdateService",
        "apprunner:DescribeService",
        "iam:PassRole"
      ],
      "Resource": [
        "arn:aws:apprunner:eu-central-1:*:service/kash-budget-api/*",
        "arn:aws:iam::*:role/kash-apprunner-role"
      ]
    }
  ]
}
```

Apply the policy:

```bash
aws iam put-user-policy \
  --user-name github-actions-kash \
  --policy-name kash-deployment-policy \
  --policy-document file://github-actions-policy.json
```

## Step 2: Create ECR Repository

```bash
aws ecr create-repository \
  --repository-name kash-budget-api \
  --region eu-central-1 \
  --encryption-configuration encryptionType=AES
```

**Output:** Note the `repositoryUri` - format: `{ACCOUNT_ID}.dkr.ecr.eu-central-1.amazonaws.com/kash-budget-api`

## Step 3: Create App Runner Service Role

```bash
# Create trust policy document
cat > apprunner-trust.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "apprunner.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

# Create role
aws iam create-role \
  --role-name kash-apprunner-role \
  --assume-role-policy-document file://apprunner-trust.json

# Attach basic policy for CloudWatch logs
aws iam put-role-policy \
  --role-name kash-apprunner-role \
  --policy-name apprunner-logs \
  --policy-document '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "logs:DescribeLogGroups"
        ],
        "Resource": "arn:aws:logs:eu-central-1:*:log-group:/aws/apprunner/*"
      }
    ]
  }'
```

## Step 4: Configure GitHub Secrets

Add the following secrets to your GitHub repository (`Settings > Secrets and variables > Actions`):

### Required Secrets

| Secret Name | Value | Example |
|------------|-------|---------|
| `AWS_ACCOUNT_ID` | AWS Account ID (12 digits) | `123456789012` |
| `AWS_ACCESS_KEY_ID` | From IAM user creation | `AKIAIOSFODNN7EXAMPLE` |
| `AWS_SECRET_ACCESS_KEY` | From IAM user creation | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |
| `AWS_REGION` | AWS region | `eu-central-1` |

### Environment Configuration Secrets

These are used by the deployed application:

| Secret Name | Purpose | Example |
|------------|---------|---------|
| `DB_HOST` | PostgreSQL RDS endpoint | `kash-db.xxxxx.eu-central-1.rds.amazonaws.com` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_USER` | Database username | `kash_user` |
| `DB_PASSWORD` | Database password | `SecurePassword123!` |
| `DB_NAME` | Database name | `kash_budget` |
| `REDIS_HOST` | ElastiCache endpoint | `kash-redis.xxxxx.ng.0001.euc1.cache.amazonaws.com` |
| `REDIS_PORT` | Redis port | `6379` |
| `JWT_SECRET` | JWT signing secret | `GenerateRandomString32Characters!` |
| `LOG_LEVEL` | Logging level | `info` |
| `NODE_ENV` | Environment | `production` |

### How to Add Secrets

1. Go to GitHub repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Enter name and value
4. Click "Add secret"

**Example command to add a secret (using GitHub CLI):**

```bash
gh secret set AWS_ACCOUNT_ID --body "123456789012"
gh secret set AWS_ACCESS_KEY_ID --body "YOUR_KEY"
gh secret set AWS_SECRET_ACCESS_KEY --body "YOUR_SECRET"
gh secret set AWS_REGION --body "eu-central-1"
gh secret set DB_HOST --body "your-rds-endpoint.eu-central-1.rds.amazonaws.com"
gh secret set DB_PASSWORD --body "YourSecurePassword"
gh secret set JWT_SECRET --body "$(openssl rand -base64 32)"
```

## Step 5: Create App Runner Service (Manual or CLI)

### Option A: Using AWS CLI

```bash
aws apprunner create-service \
  --service-name kash-budget-api \
  --region eu-central-1 \
  --source-configuration \
    ImageRepository="{
      RepositoryType=ECR,
      ImageIdentifier={ACCOUNT_ID}.dkr.ecr.eu-central-1.amazonaws.com/kash-budget-api:latest,
      ImageConfiguration={
        Port=3000,
        RuntimeEnvironmentVariables='{
          DB_HOST=your-rds-host,
          DB_PORT=5432,
          DB_USER=kash_user,
          DB_NAME=kash_budget,
          REDIS_HOST=your-redis-host,
          REDIS_PORT=6379,
          NODE_ENV=production,
          LOG_LEVEL=info
        }',
        ImageRepositoryType=ECR
      }
    }" \
  --instance-configuration Cpu=1024,Memory=2048,InstanceRoleArn=arn:aws:iam::{ACCOUNT_ID}:role/kash-apprunner-role \
  --auto-scaling-configuration MaxConcurrency=10,MaxSize=3,MinSize=1
```

### Option B: Manual Setup in AWS Console

1. Navigate to AWS App Runner console
2. Create new service
3. Choose "Container registry" → ECR
4. Select the `kash-budget-api` repository
5. Set:
   - **Port:** 3000
   - **CPU:** 1 vCPU (1024)
   - **Memory:** 2 GB (2048)
   - **Auto-scaling:** Min 1, Max 3
6. Add environment variables from Step 4
7. Create service

## Step 6: Verify Deployment

After GitHub Actions completes a deployment, verify the service is running:

```bash
# Check service status
aws apprunner describe-service \
  --service-arn arn:aws:apprunner:eu-central-1:{ACCOUNT_ID}:service/kash-budget-api/{SERVICE_ID} \
  --region eu-central-1

# Test health endpoint (replace with actual URL)
curl https://kash-budget-api.{RANDOM}.eu-central-1.apprunner.aws.com/api/health
```

## Step 7: Configure CloudWatch Monitoring (Optional)

Create alarms for critical metrics:

```bash
# High error rate alarm
aws cloudwatch put-metric-alarm \
  --alarm-name kash-api-errors \
  --alarm-description "Alert if error rate exceeds 5%" \
  --metric-name RequestCount \
  --namespace AWS/AppRunner \
  --statistic Average \
  --period 300 \
  --threshold 5 \
  --comparison-operator GreaterThanThreshold
```

## Troubleshooting

### Issue: GitHub Actions fails with "Access Denied"

**Solution:** Verify IAM policy is attached to `github-actions-kash` user:

```bash
aws iam list-attached-user-policies --user-name github-actions-kash
aws iam get-user-policy --user-name github-actions-kash --policy-name kash-deployment-policy
```

### Issue: Docker build fails in Actions

**Solution:** Check CloudWatch logs:

```bash
aws logs tail /aws/apprunner/kash-budget-api --follow
```

### Issue: App Runner service won't start

**Solution:** Check App Runner logs and environment variables:

```bash
aws apprunner describe-service --service-arn {service-arn} --region eu-central-1
```

## Security Considerations

1. **Access Keys:** Rotate IAM access keys every 90 days
2. **Secrets:** Never commit AWS credentials to git
3. **Database Access:** RDS should be in a private subnet; only App Runner can access
4. **Network:** Use Security Groups to restrict inbound/outbound traffic
5. **Encryption:** Enable encryption at rest for RDS, S3, and ElastiCache

## Next Steps

1. Complete AWS setup following this guide
2. Add GitHub Secrets from Step 4
3. Push changes to trigger automated deployment
4. Monitor CloudWatch logs for any issues
5. Test API endpoints after deployment

## Rollback Procedure

If deployment fails or causes issues:

```bash
# Revert to previous App Runner service version
aws apprunner update-service \
  --service-arn arn:aws:apprunner:eu-central-1:{ACCOUNT_ID}:service/kash-budget-api/{SERVICE_ID} \
  --region eu-central-1 \
  --source-configuration ImageRepository="{RepositoryType=ECR,ImageIdentifier={ACCOUNT_ID}.dkr.ecr.eu-central-1.amazonaws.com/kash-budget-api:previous-version}"
```

Alternatively, use AWS Console to manually select a previous deployment.
