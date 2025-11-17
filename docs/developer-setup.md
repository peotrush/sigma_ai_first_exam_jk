# Kash Budget - Developer Setup Guide

**Last Updated:** 2025-11-17
**Estimated Setup Time:** 5-10 minutes (first time)

This guide provides step-by-step instructions for setting up your local development environment for Kash Budget. By the end, you'll have a fully functional development environment with the API, database, and cache running in Docker containers.

---

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

### Required Software

1. **Docker Desktop** (version 4.0 or higher)
   - **macOS:** [Download Docker Desktop for Mac](https://www.docker.com/products/docker-desktop)
   - **Windows:** [Download Docker Desktop for Windows](https://www.docker.com/products/docker-desktop)
   - **Linux:** [Install Docker Engine](https://docs.docker.com/engine/install/) + [Docker Compose](https://docs.docker.com/compose/install/)

   **Verify installation:**
   ```bash
   docker --version
   # Expected: Docker version 24.0.0 or higher

   docker-compose --version
   # Expected: Docker Compose version 2.0.0 or higher
   ```

2. **Visual Studio Code**
   - [Download VS Code](https://code.visualstudio.com/)

   **Install required extension:**
   - [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

   **How to install:**
   1. Open VS Code
   2. Press `Ctrl+Shift+X` (Windows/Linux) or `Cmd+Shift+X` (Mac)
   3. Search for "Dev Containers"
   4. Click "Install"

3. **Git** (for cloning the repository)
   - **macOS:** Pre-installed or install via [Homebrew](https://brew.sh/): `brew install git`
   - **Windows:** [Download Git for Windows](https://git-scm.com/download/win)
   - **Linux:** `sudo apt-get install git` (Ubuntu/Debian) or `sudo yum install git` (CentOS/RHEL)

   **Verify installation:**
   ```bash
   git --version
   # Expected: git version 2.0.0 or higher
   ```

---

## Setup Steps

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd exercise

# Verify you're in the correct directory
ls -la
# You should see: .devcontainer/, docs/, package.json, etc.
```

### Step 2: Start Docker Desktop

**Before opening VS Code**, ensure Docker Desktop is running:

- **macOS:** Look for the Docker icon in the menu bar (whale icon)
- **Windows:** Look for the Docker icon in the system tray
- **Linux:** Start Docker daemon: `sudo systemctl start docker`

**Verify Docker is running:**
```bash
docker ps
# Expected: Empty table (no errors)
```

### Step 3: Open Project in VS Code

```bash
# Open the project in VS Code
code .
```

Alternatively:
1. Open VS Code
2. File → Open Folder → Select the `exercise` directory

### Step 4: Reopen in Container

VS Code will automatically detect the `.devcontainer` configuration.

**You should see a popup notification in the bottom-right corner:**

```
Folder contains a Dev Container configuration file.
Reopen folder to develop in a container?
```

**Click "Reopen in Container"**

**If you don't see the popup:**
1. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
2. Type: "Dev Containers: Rebuild and Reopen in Container"
3. Press Enter

### Step 5: Wait for Container Build

**What's happening:**
- Docker is pulling images (Node.js 20, PostgreSQL 15, Redis 7)
- Building the API container
- Starting all three services
- Installing VS Code extensions
- Running `npm install`

**Expected duration:**
- **First time:** 3-5 minutes (downloading images)
- **Subsequent times:** 10-30 seconds (using cached images)

**Progress indicators:**
- VS Code will show progress in the bottom-left corner
- You can click "Show Log" to see detailed output

**Successful completion indicators:**
- VS Code status bar (bottom-left) shows: "Dev Container: Kash Budget - Full Stack"
- No error messages in the output

### Step 6: Verify Setup

Once the container is running, open a new terminal in VS Code:

**Open Terminal:**
- Menu: Terminal → New Terminal
- Or: `Ctrl+`` ` (backtick)

**Run verification commands:**

```bash
# 1. Check Node.js version
node --version
# Expected: v20.x.x

# 2. Check npm version
npm --version
# Expected: 10.x.x

# 3. Check PostgreSQL connection
export PGPASSWORD=dev_password
psql -h db -U kash -d kash_budget -c "SELECT version();"
# Expected: PostgreSQL 15.15 on ...

# 4. Check Redis connection
redis-cli -h cache ping
# Expected: PONG

# 5. List running Docker services
docker-compose ps
# Expected: api, db, cache all showing "Up" status
```

**If all commands succeed, your environment is ready! 🎉**

---

## Common Issues & Solutions

### Issue 1: "Cannot connect to the Docker daemon"

**Symptom:**
```
error during connect: ... Is the docker daemon running?
```

**Solution:**
1. Ensure Docker Desktop is running
2. macOS/Windows: Click the Docker icon in the menu bar/system tray
3. Linux: `sudo systemctl start docker`
4. Retry: Dev Containers: Rebuild Container

---

### Issue 2: "Port 5432 is already allocated"

**Symptom:**
```
Error: bind: address already in use ... :5432
```

**Cause:** PostgreSQL is already running on your host machine

**Solution Option A (Stop host PostgreSQL):**
```bash
# macOS
brew services stop postgresql

# Linux
sudo systemctl stop postgresql

# Windows
# Open Services → Find PostgreSQL → Stop
```

**Solution Option B (Change DevContainer port):**
Edit `.devcontainer/docker-compose.yml`:
```yaml
db:
  ports:
    - "5433:5432"  # Change host port to 5433
```
Then rebuild container.

---

### Issue 3: "npm install" fails with permission errors

**Symptom:**
```
EACCES: permission denied, mkdir '/app/node_modules'
```

**Solution:**
This usually happens if you ran `npm install` on the host before opening in DevContainer.

```bash
# Delete node_modules on host
rm -rf node_modules

# Rebuild container
# Press Ctrl+Shift+P → "Dev Containers: Rebuild Container"
```

---

### Issue 4: Extensions not auto-installing

**Symptom:** ESLint, Prettier, or Claude Code extensions missing

**Solution:**
Manually install from VS Code:
1. Press `Ctrl+Shift+X` (Extensions view)
2. Search and install:
   - ESLint (dbaeumer.vscode-eslint)
   - Prettier (esbenp.prettier-vscode)
   - Claude Code (anthropic.claude-code)

Or check `.devcontainer/devcontainer.json` has:
```json
"extensions": [
  "dbaeumer.vscode-eslint",
  "esbenp.prettier-vscode",
  "anthropic.claude-code"
]
```

---

### Issue 5: "Database does not exist" error

**Symptom:**
```
psql: error: database "kash_budget" does not exist
```

**Cause:** PostgreSQL container didn't initialize properly

**Solution:**
```bash
# Reset database volumes
docker-compose down -v

# Rebuild container
# Press Ctrl+Shift+P → "Dev Containers: Rebuild Container"
```

---

### Issue 6: Container build is very slow

**Possible causes:**
- First-time image downloads (expected)
- Slow internet connection
- Docker Desktop resource limits

**Solutions:**
1. **Check Docker resource allocation:**
   - Docker Desktop → Settings → Resources
   - Recommended: 4GB RAM, 2 CPUs minimum

2. **Use Docker BuildKit (faster builds):**
   ```bash
   export DOCKER_BUILDKIT=1
   ```

3. **Clear Docker cache (if persistent):**
   ```bash
   docker system prune -a
   # Warning: This deletes ALL unused images
   ```

---

## Daily Workflow

Once set up, here's your typical daily workflow:

### Starting Work

1. **Open VS Code**
   ```bash
   code .
   ```

2. **Reopen in Container** (if not already)
   - VS Code should remember your preference
   - If not, click "Reopen in Container" when prompted

3. **Services auto-start** (no manual intervention needed)
   - PostgreSQL ready on `db:5432`
   - Redis ready on `cache:6379`
   - API ready to run on port `3000`

### Running the Application

```bash
# Install new dependencies (if package.json changed)
npm install

# Run database migrations (if schema changed)
npm run migration:run

# Start the API server in development mode
npm run start:dev

# Server will start on http://localhost:3000
```

### Running Tests

```bash
# Unit tests
npm run test

# End-to-end tests
npm run test:e2e

# Test with coverage
npm run test:cov
```

### Database Operations

```bash
# Connect to PostgreSQL
export PGPASSWORD=dev_password
psql -h db -U kash -d kash_budget

# Common psql commands:
\dt         # List tables
\d users    # Describe users table
\q          # Quit

# Run SQL query
psql -h db -U kash -d kash_budget -c "SELECT COUNT(*) FROM users;"
```

### Viewing Logs

```bash
# View all service logs
docker-compose logs

# View specific service logs
docker-compose logs api
docker-compose logs db
docker-compose logs cache

# Follow logs in real-time
docker-compose logs -f api
```

### Stopping Work

**Option 1: Keep containers running** (recommended)
- Just close VS Code
- Containers stay running in background
- Fastest restart next time

**Option 2: Stop containers**
```bash
docker-compose stop
```

**Option 3: Stop and remove containers**
```bash
docker-compose down
```

**Option 4: Nuclear option (reset everything)**
```bash
docker-compose down -v  # WARNING: Deletes all data
```

---

## Troubleshooting Commands

### Check Container Status

```bash
# List running containers
docker-compose ps

# Expected output:
# NAME      COMMAND          SERVICE   STATUS    PORTS
# api       "sleep infinity" api       Up        0.0.0.0:3000->3000/tcp
# db        "postgres"       db        Up        0.0.0.0:5432->5432/tcp
# cache     "redis-server"   cache     Up        0.0.0.0:6379->6379/tcp
```

### Restart a Service

```bash
# Restart database only
docker-compose restart db

# Restart all services
docker-compose restart
```

### Rebuild Containers

```bash
# Rebuild API container (after Dockerfile changes)
docker-compose build api

# Rebuild and restart
docker-compose up -d --build
```

### Reset Database

```bash
# Delete all data and start fresh
docker-compose down -v
docker-compose up -d

# Wait for initialization, then run migrations
npm run migration:run
```

### View Container Resource Usage

```bash
# Check CPU and memory usage
docker stats
```

---

## IDE Tips & Tricks

### Recommended VS Code Extensions

These extensions will auto-install with the DevContainer, but you can manually verify:

1. **ESLint** - Real-time linting
2. **Prettier** - Code formatting on save
3. **Claude Code** - AI-powered coding assistant

### Useful VS Code Shortcuts

- **Open Terminal:** ``Ctrl+` ``
- **Command Palette:** `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
- **Search Files:** `Ctrl+P` (Windows/Linux) or `Cmd+P` (Mac)
- **Format Document:** `Shift+Alt+F` (Windows/Linux) or `Shift+Option+F` (Mac)

### Format on Save

Already enabled in `.devcontainer/devcontainer.json`:
```json
"settings": {
  "editor.formatOnSave": true
}
```

---

## Next Steps

Now that your development environment is set up:

1. **Read the Architecture Document**
   - [docs/architecture.md](architecture.md) - Complete system architecture

2. **Review the PRD**
   - [docs/prd.md](prd.md) - Product requirements and features

3. **Start Coding**
   - Check the [docs/stories/](stories/) folder for user stories
   - Pick a story and start implementing!

4. **Run the Test Suite**
   ```bash
   npm run test
   ```

5. **Make Your First Commit**
   ```bash
   git checkout -b feature/your-feature-name
   # Make changes
   git add .
   git commit -m "feat: your feature description"
   ```

---

## Getting Help

If you encounter issues not covered in this guide:

1. **Check the main architecture document**
   - [docs/architecture.md](architecture.md#development-environment)

2. **Review the DevContainer experiment validation**
   - [docs/experiments/2025-11-17-devcontainer-validation.md](experiments/2025-11-17-devcontainer-validation.md)

3. **Check Docker logs**
   ```bash
   docker-compose logs
   ```

4. **Ask the team**
   - Post in the team Slack channel with error details
   - Include relevant logs and screenshots

---

## Environment Details

For reference, here's what's running in your DevContainer:

| Service | Technology | Version | Port | Purpose |
|---------|-----------|---------|------|---------|
| **api** | Node.js | 20.x | 3000, 8080 | API development environment |
| **db** | PostgreSQL | 15-alpine | 5432 | Database server |
| **cache** | Redis | 7-alpine | 6379 | Cache server |

**Environment Variables:**
```bash
DATABASE_URL=postgresql://kash:dev_password@db:5432/kash_budget
REDIS_URL=redis://cache:6379
NODE_ENV=development
```

**Data Persistence:**
- Database data: `/var/lib/postgresql/data` (Docker volume)
- Redis data: `/data` (Docker volume)
- Application code: `/workspaces/exercise` (host mount)

---

**Happy coding! 🚀**

*If you found this guide helpful, please update it when you discover new issues or solutions.*
