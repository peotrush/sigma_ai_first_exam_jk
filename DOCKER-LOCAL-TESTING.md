# Local Docker Testing Guide

This guide helps you test the Docker container locally before deploying to AWS.

## Prerequisites

- Docker installed and running on your local machine
- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- Port 3000 available (or modify `-p` flag)
- Kash Budget project cloned locally

## Step 1: Build the Docker Image

```bash
# Navigate to project root
cd /path/to/kash-budget

# Build the Docker image
docker build -t kash-budget-api:latest .
```

**Expected output:**
```
[1/2] FROM node:20-alpine                          0.3s
[1/2] RUN npm ci                                   XX.XXs
[1/2] RUN npm run build --workspace=apps/api      XX.XXs
[2/2] FROM node:20-alpine                          0.3s
[2/2] COPY --from=builder /app/apps/api/dist ...  X.XXs
[2/2] RUN npm ci --only=production                X.XXs
[2/2] RUN addgroup -g 1001 -S nodejs              0.1s
[2/2] RUN adduser -S nestjs -u 1001               0.1s
[2/2] EXPOSE 3000                                  0.0s
[2/2] HEALTHCHECK --interval=30s ...              0.0s
[2/2] CMD ["node", "dist/apps/api/src/main.js"]  0.0s
 => => naming to docker.io/library/kash-budget-api:latest
```

**Troubleshooting build issues:**

If build fails, check:
1. Node.js version: `node --version` (should be 20.x)
2. npm workspaces: `npm ls --depth=0`
3. Missing dependencies: `npm ls`
4. Clean build: `docker build --no-cache -t kash-budget-api:latest .`

## Step 2: Verify Image Creation

```bash
# List images
docker images | grep kash-budget-api
```

**Expected output:**
```
kash-budget-api   latest   abc123def456   2 minutes ago   ~280MB
```

## Step 3: Run the Container

### Basic Run (without environment variables)

```bash
docker run -p 3000:3000 kash-budget-api:latest
```

**Expected output:**
```
[Nest] 1   - 11/17/2025, 10:30:45 AM     LOG [NestFactory] Starting Nest application...
[Nest] 1   - 11/17/2025, 10:30:46 AM     LOG [InstanceLoader] TypeOrmModule dependencies initialized
[Nest] 1   - 11/17/2025, 10:30:46 AM     LOG [InstanceLoader] ConfigModule dependencies initialized
[Nest] 1   - 11/17/2025, 10:30:46 AM     LOG [InstanceLoader] JwtModule dependencies initialized
[Nest] 1   - 11/17/2025, 10:30:47 AM     LOG [NestApplication] Nest application successfully started
[Nest] 1   - 11/17/2025, 10:30:47 AM     LOG [BootstrapService] 🚀 API running on port 3000
```

### Run with Environment Variables (Recommended)

```bash
docker run -p 3000:3000 \
  -e NODE_ENV=development \
  -e LOG_LEVEL=debug \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=5432 \
  -e DB_USER=postgres \
  -e DB_PASSWORD=dev-password \
  -e DB_NAME=kash_budget \
  -e REDIS_HOST=host.docker.internal \
  -e REDIS_PORT=6379 \
  -e JWT_SECRET=dev-secret-key \
  kash-budget-api:latest
```

**Note:** `host.docker.internal` allows the container to access services on your host machine (for local PostgreSQL/Redis)

### Run in Detached Mode (Background)

```bash
# Start container in background
docker run -d --name kash-api \
  -p 3000:3000 \
  -e NODE_ENV=development \
  kash-budget-api:latest

# View logs
docker logs -f kash-api

# Stop container
docker stop kash-api

# Remove container
docker rm kash-api
```

## Step 4: Test Health Endpoint

In another terminal:

```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Pretty-print with jq (if installed)
curl -s http://localhost:3000/api/health | jq .
```

**Expected output:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-17T10:30:47.123Z",
  "database": "connected",
  "uptime": 5.234
}
```

**If database is not available:**
```json
{
  "status": "error",
  "timestamp": "2025-11-17T10:30:47.123Z",
  "database": "disconnected",
  "error": "Connection refused"
}
```

This is expected if PostgreSQL isn't running. The container starts successfully but reports database status.

## Step 5: Test Non-Health Endpoints

### Test Authentication Endpoint

```bash
# Try to access protected endpoint without token
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Content-Type: application/json"

# Expected response (401 Unauthorized):
# {
#   "statusCode": 401,
#   "message": "Unauthorized"
# }

# Try with invalid token
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer invalid-token" \
  -H "Content-Type: application/json"

# Expected response (401 Unauthorized):
# {
#   "statusCode": 401,
#   "message": "Unauthorized"
# }
```

## Step 6: Check Container Health

```bash
# Get container status
docker ps | grep kash-budget-api

# Expected output (if running):
# CONTAINER ID  IMAGE              COMMAND                 STATUS
# abc123def456  kash-budget-api    "node dist/apps/..."    Up 2 minutes (healthy)

# View health status specifically
docker inspect --format='{{.State.Health.Status}}' <container-id>

# Expected output:
# healthy
```

## Step 7: Test Logs

```bash
# View real-time logs
docker logs -f <container-id>

# View last 100 lines
docker logs --tail 100 <container-id>

# View logs with timestamps
docker logs -t <container-id>
```

## Step 8: Test Resource Usage

```bash
# Check CPU and memory usage
docker stats <container-id>

# Expected output (approximately):
# CONTAINER       CPU %    MEM USAGE / LIMIT    MEM %
# abc123def456    0.5%     50MiB / 7960MiB      0.6%
```

## Full Integration Test Script

Save as `test-docker.sh` and run with `bash test-docker.sh`:

```bash
#!/bin/bash

set -e

echo "🔨 Building Docker image..."
docker build -t kash-budget-api:test .

echo "✅ Image built successfully"
echo ""

echo "🚀 Starting container..."
CONTAINER_ID=$(docker run -d \
  -p 3000:3000 \
  -e NODE_ENV=development \
  -e LOG_LEVEL=debug \
  kash-budget-api:test)

echo "Container ID: $CONTAINER_ID"
echo ""

echo "⏳ Waiting for application to start..."
sleep 3

echo "🏥 Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s http://localhost:3000/api/health)
echo "Response: $HEALTH_RESPONSE"

if echo "$HEALTH_RESPONSE" | grep -q '"status":"ok"'; then
  echo "✅ Health check PASSED"
else
  echo "⚠️  Health check returned non-ok status (expected if DB not running)"
fi

echo ""
echo "📊 Container statistics:"
docker stats --no-stream $CONTAINER_ID

echo ""
echo "📝 Recent logs:"
docker logs --tail 20 $CONTAINER_ID

echo ""
echo "🧹 Cleaning up..."
docker stop $CONTAINER_ID
docker rm $CONTAINER_ID

echo "✅ Testing complete!"
```

## Docker Compose for Full Stack (Advanced)

For testing with PostgreSQL and Redis locally:

Create `docker-compose.local.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: kash_budget
      POSTGRES_USER: kash_user
      POSTGRES_PASSWORD: dev-password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: development
      LOG_LEVEL: debug
      DB_HOST: postgres
      DB_PORT: 5432
      DB_USER: kash_user
      DB_PASSWORD: dev-password
      DB_NAME: kash_budget
      REDIS_HOST: redis
      REDIS_PORT: 6379
      JWT_SECRET: dev-secret-key
    depends_on:
      - postgres
      - redis
    volumes:
      - ./apps/api/src:/app/apps/api/src

volumes:
  postgres_data:
```

Run with:
```bash
docker-compose -f docker-compose.local.yml up

# In another terminal:
curl http://localhost:3000/api/health

# Tear down:
docker-compose -f docker-compose.local.yml down
```

## Common Issues & Solutions

### Issue: Port 3000 already in use

```bash
# Find what's using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
docker run -p 3001:3000 kash-budget-api:latest
```

### Issue: Build fails with "Node version mismatch"

```bash
# Check your local Node version
node --version

# Should be 20.x for compatibility
# If not, use nvm or update Node
nvm install 20
nvm use 20
```

### Issue: Container exits immediately

```bash
# View logs to see error
docker logs <container-id>

# Check for environment variable issues
docker run -e NODE_ENV=development kash-budget-api:latest

# Test locally first
npm run build --workspace=apps/api
npm start --workspace=apps/api
```

### Issue: Health check failing

The health check requires the API to be responsive on port 3000. If it's failing:

```bash
# Check if application is actually running
docker exec <container-id> curl -f http://localhost:3000/api/health

# Check logs
docker logs <container-id>

# Increase health check timeout if needed (modify Dockerfile)
```

## Performance Baseline

Expected metrics on a modern machine:

| Metric | Value |
|--------|-------|
| Build time (first) | 2-3 minutes |
| Build time (cached) | 30-60 seconds |
| Container startup | 2-5 seconds |
| Memory usage | ~50-100MB |
| CPU usage (idle) | <1% |
| Health check response | <100ms |

## Next Steps

After successful local testing:

1. **Push to Docker Hub** (optional):
   ```bash
   docker tag kash-budget-api:latest your-username/kash-budget-api:latest
   docker push your-username/kash-budget-api:latest
   ```

2. **Deploy to AWS**:
   - Follow `.github/workflows/AWS-DEPLOYMENT-SETUP.md`
   - Image will be built automatically in GitHub Actions
   - Pushed to AWS ECR
   - Deployed to App Runner

3. **Monitor in production**:
   - View App Runner service logs in AWS Console
   - Check CloudWatch metrics
   - Monitor health endpoint

## References

- [Docker Documentation](https://docs.docker.com/)
- [Node.js Docker Best Practices](https://snyk.io/blog/10-docker-image-security-best-practices/)
- [NestJS Docker Deployment](https://docs.nestjs.com/deployment)
- [Alpine Linux Images](https://www.alpinelinux.org/)

---

**Last Updated:** November 17, 2025
**Author:** Developer Agent
