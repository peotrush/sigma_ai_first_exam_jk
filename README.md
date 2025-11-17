# Kash Budget - Personal Finance Mobile App

**A mobile-first personal finance application that eliminates financial fog through effortless QR code receipt scanning, AI-powered categorization, and guilt-free spending philosophy.**

> 📱 **Platform:** iOS 14+ | Android 10+
> 🏗️ **Architecture:** React Native (Mobile) + NestJS (Backend) + PostgreSQL (Database)
> 🏢 **Deployment:** AWS (eu-central-1)
> 📅 **Status:** Development (Epic 1 - Foundation)

---

## 🎯 Quick Start

### Prerequisites
- **Node.js:** v20.0.0 or higher
- **npm:** v9.0.0 or higher
- **Docker Desktop:** 4.0+ (for DevContainer)
- **VSCode** with DevContainers extension

### Setup (5 minutes)

```bash
# 1. Clone the repository
git clone <repo-url>
cd exercise

# 2. Open in VSCode with DevContainer
code .
# VSCode will prompt: "Reopen in Container"
# OR: Ctrl+Shift+P → "Dev Containers: Rebuild Container"

# 3. Wait for container to build (2-3 minutes on first run)
# Services automatically start: PostgreSQL, Redis, Node.js

# 4. Install dependencies
npm install

# 5. Verify setup
redis-cli -h cache ping          # Should print: PONG
npm run api:dev                  # Start backend
```

### Project Structure

```
kash-budget/
├── apps/
│   ├── api/                     # NestJS Backend API
│   │   ├── src/
│   │   │   ├── auth/            # Authentication module
│   │   │   ├── transactions/    # Transaction module
│   │   │   ├── insights/        # Analytics module
│   │   │   ├── gamification/    # Credits & streaks
│   │   │   ├── notifications/   # Push notifications
│   │   │   ├── database/        # TypeORM entities
│   │   │   └── main.ts          # App entry point
│   │   ├── test/                # Integration tests
│   │   ├── .env.example         # Environment variables template
│   │   └── package.json
│   │
│   └── mobile/                  # React Native Mobile App
│       ├── src/
│       │   ├── screens/         # Page-level components (Scan, See, Save)
│       │   ├── components/      # Reusable UI components
│       │   ├── services/        # API client, geofencing, ML
│       │   ├── redux/           # State management
│       │   ├── types/           # TypeScript interfaces
│       │   ├── utils/           # Helper functions
│       │   └── App.tsx          # Entry point
│       ├── ios/                 # iOS native code
│       ├── android/             # Android native code
│       ├── .env.example         # Environment variables
│       └── package.json
│
├── packages/
│   ├── shared/                  # Shared Types & Constants
│   │   ├── src/
│   │   │   ├── types.ts         # TypeScript interfaces for API contracts
│   │   │   ├── constants.ts     # Shared configuration constants
│   │   │   └── index.ts         # Public API
│   │   └── package.json
│   │
│   └── config/                  # Shared Configuration
│       ├── eslint.js            # ESLint rules
│       ├── jest.js              # Jest testing config
│       ├── tsconfig.json        # TypeScript settings
│       └── package.json
│
├── .devcontainer/               # VSCode DevContainer configuration
│   ├── docker-compose.yml       # Multi-service orchestration
│   ├── devcontainer.json        # VSCode settings
│   └── Dockerfile               # API service container
│
├── docs/                        # Documentation
│   ├── architecture.md          # System architecture
│   ├── developer-setup.md       # Developer onboarding
│   ├── prd/                     # Product requirements
│   └── ...
│
└── package.json                 # Monorepo root configuration
```

---

## 🚀 Development Workflow

### Start Backend API

```bash
npm run api:dev
```

The API will start on `http://localhost:3000` with:
- ✅ Auto-reload on file changes
- ✅ Database migrations auto-run
- ✅ Swagger docs available at `http://localhost:3000/api/docs`

### Start Mobile App (iOS)

```bash
npm run mobile:dev          # Start Metro bundler
npm run ios                 # Launch iOS simulator
```

### Run Tests

```bash
npm run test                # Run all tests
npm run api:test            # Backend tests only
npm run mobile:test         # Mobile tests only
npm run test:watch          # Watch mode
```

### Database Commands

```bash
# Connect to PostgreSQL
export PGPASSWORD=dev_password
psql -h db -U kash -d kash_budget

# Run migrations
npm run api migration:run

# Generate new migration
npm run api migration:generate -- -n MigrationName

# Revert last migration
npm run api migration:revert
```

### Redis Commands

```bash
# Connect to Redis
redis-cli -h cache

# Common commands
PING                 # Test connection
KEYS *               # List all keys
GET key_name         # Get value
DEL key_name         # Delete key
FLUSHDB              # Clear all data
```

---

## 📋 Available Scripts

### Monorepo Level

```bash
npm run dev           # Start all workspaces in dev mode
npm run build         # Build all workspaces
npm run test          # Test all workspaces
npm run lint          # Lint all workspaces
```

### Backend (API)

```bash
npm run api:dev       # Start API with auto-reload
npm run api:build     # Build for production
npm run api:test      # Run API tests
npm run api migration:run    # Run pending migrations
npm run api migration:generate -- -n MigrationName
```

### Mobile

```bash
npm run mobile:dev    # Start Metro bundler
npm run ios           # Run on iOS simulator
npm run android       # Run on Android emulator
npm run mobile:test   # Run mobile tests
npm run mobile:build:ios    # Build iOS archive
npm run mobile:build:android # Build Android APK
```

---

## 🔑 Environment Variables

### Backend (.env)

```bash
# Database
DATABASE_HOST=db
DATABASE_PORT=5432
DATABASE_USER=kash
DATABASE_PASSWORD=dev_password
DATABASE_NAME=kash_budget
DATABASE_URL=postgresql://kash:dev_password@db:5432/kash_budget

# Redis
REDIS_URL=redis://cache:6379

# JWT Authentication
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRY=24h

# Node Environment
NODE_ENV=development

# Server Port
PORT=3000

# AWS (for production)
AWS_REGION=eu-central-1
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
S3_BUCKET=kash-budget-receipts
```

### Mobile (.env)

```bash
# API Configuration
API_BASE_URL=http://localhost:3000/api
API_TIMEOUT=30000

# Firebase Configuration (for push notifications)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_API_KEY=your-api-key
FIREBASE_MESSAGING_SENDER_ID=your-sender-id

# Analytics Configuration
AMPLITUDE_API_KEY=your-amplitude-key
SENTRY_DSN=your-sentry-dsn

# Feature Flags
ENABLE_QR_SCANNING=true
ENABLE_GEOFENCING=true
ENABLE_ML_CATEGORIZATION=true
```

---

## 🏗️ Architecture Overview

### High-Level Architecture

```
┌─────────────────────────┐
│   iOS/Android Mobile    │
│   (React Native)        │
└────────────┬────────────┘
             │ HTTPS
             ▼
┌─────────────────────────────────┐
│   AWS Application Load Balancer │
└────────────┬────────────────────┘
             │
      ┌──────┴──────┐
      ▼             ▼
┌──────────┐  ┌──────────┐
│ NestJS   │  │ NestJS   │   (ECS Containers)
│ API #1   │  │ API #2   │   (Auto-scaling)
└────┬─────┘  └────┬─────┘
     │             │
     └──────┬──────┘
            ▼
    ┌─────────────────┐
    │ PostgreSQL RDS  │
    │ (ACID Finance)  │
    └─────────────────┘
            │
     ┌──────┴──────┐
     ▼             ▼
┌─────────┐  ┌────────────┐
│ Redis   │  │ S3 Bucket  │
│ Cache   │  │ (Images)   │
└─────────┘  └────────────┘
```

### Key Design Patterns

- **Monolithic Backend with Domain Modules:** Auth, Transactions, Insights, Gamification, Notifications
- **API Gateway Pattern:** Single entry point for all mobile requests
- **Repository Pattern:** Database access abstraction for testability
- **Redux State Management:** Predictable state for complex gamification logic
- **Offline-First:** Redux Persist enables app functionality without connectivity
- **On-Device ML:** TensorFlow Lite categorization (privacy-first)
- **Event-Driven Notifications:** Backend events trigger push notifications

---

## 📚 Documentation

- **[Architecture Document](docs/architecture.md)** - Complete system design
- **[Developer Setup Guide](docs/developer-setup.md)** - Detailed onboarding
- **[Product Requirements (PRD)](docs/prd.md)** - Feature specifications
- **[API Documentation](http://localhost:3000/api/docs)** - Swagger/OpenAPI (when running)

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

```
Push to main
    ↓
├─ Lint (ESLint)
├─ Type Check (TypeScript)
├─ Unit Tests (Jest)
├─ Integration Tests
    ↓
[All pass?]
    ├─ YES → Deploy to AWS ECS
    │         └─ Run database migrations
    │         └─ Start new containers
    │         └─ Smoke test (health check)
    │
    └─ NO → Fail pipeline, notify developers
```

---

## 🐛 Troubleshooting

### Container Not Starting

```bash
# Rebuild the DevContainer
Ctrl+Shift+P → "Dev Containers: Rebuild Container"

# Or from terminal
docker-compose down -v
docker-compose up -d
```

### Database Connection Error

```bash
# Verify database is running
docker-compose ps

# Check database logs
docker-compose logs db

# Reset database (careful: deletes all data)
docker-compose down -v
docker-compose up -d
```

### Redis Connection Error

```bash
# Test Redis connection
redis-cli -h cache ping
# Expected: PONG

# Check Redis logs
docker-compose logs cache
```

### Port Already in Use

```bash
# If port 5432 or 3000 already in use:
# Either stop the conflicting service or
# Change ports in docker-compose.yml
```

---

## 📊 Project Status

| Component | Status | Details |
|-----------|--------|---------|
| **DevContainer** | ✅ Validated | All 8/8 criteria passed |
| **Architecture** | ✅ Complete | v1.1 with diagrams |
| **PRD & Epics** | ✅ Complete | 8 epics, 40 FRs, 20 NFRs |
| **Monorepo Setup** | 🟢 **IN PROGRESS** | Story 1.1 - This task |
| **Backend Health Check** | ⏳ Pending | Story 1.2 |
| **Authentication** | ⏳ Pending | Story 1.3 |
| **CI/CD Pipeline** | ⏳ Pending | Story 1.4 |

---

## 🎯 Next Steps

### This Week (Sprint 1)

- [ ] Complete Story 1.1: Project initialization (CURRENT)
- [ ] Complete Story 1.2: Health check endpoint
- [ ] Complete Story 1.3: User authentication
- [ ] Complete Story 1.4: CI/CD pipeline

### Following Week (Sprint 2)

- [ ] Epic 2: QR Scanner & Transaction Management

---

## 📞 Support

For questions or issues:
1. Check [docs/developer-setup.md](docs/developer-setup.md)
2. Review troubleshooting section above
3. Check GitHub Issues
4. Contact the Kash team

---

## 📜 License

UNLICENSED - All rights reserved

---

**Last Updated:** 2025-11-17
**Maintained By:** Kash Team