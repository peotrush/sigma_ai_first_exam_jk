# Kash Budget Fullstack Architecture Document

**Version:** 1.1
**Last Updated:** 2025-11-17
**Status:** Active - Development Environment Validated

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-11-17 | 1.1 | Added validated Development Environment section with VSCode DevContainer + Docker Compose | Winston (Architect Agent) |
| 2025-11-17 | 1.0 | Initial architecture document | Winston (Architect Agent) |

---

## Introduction

This document outlines the complete fullstack architecture for **Kash Budget**, including backend systems, frontend implementation, and their integration. It serves as the single source of truth for AI-driven development, ensuring consistency across the entire technology stack.

This unified approach combines what would traditionally be separate backend and frontend architecture documents, streamlining the development process for modern fullstack applications where these concerns are increasingly intertwined.

### Starter Template or Existing Project

**Status:** N/A - Greenfield Project

Kash Budget is a greenfield project built from scratch with no existing codebase or starter template. The architecture is designed specifically to meet the unique requirements of:
- Bulgarian QR receipt scanning
- Location-based behavioral nudges
- Gamification with virtual credits
- ML-powered transaction categorization
- Treat Yourself guilt-free spending philosophy

**Rationale:** While React Native and NestJS have starter templates available, the specialized requirements (QR parsing, geofencing, ML categorization) necessitate a custom architecture. The monorepo structure will be set up using npm workspaces for simplicity.

---

## High Level Architecture

### Technical Summary

Kash Budget is a **mobile-first personal finance application** built on a modern fullstack TypeScript architecture. The system follows a **monolithic backend** approach for MVP simplicity, deployed on **AWS infrastructure**, with a **React Native mobile app** as the primary user interface.

**Architectural Highlights:**
- **Mobile App:** React Native cross-platform application (iOS 14+, Android 10+) with offline-first capabilities, QR code scanning, and GPS geofencing
- **Backend API:** NestJS RESTful API server providing transaction management, ML categorization, gamification logic, and user insights
- **Database:** PostgreSQL 14+ for ACID-compliant financial data storage with JSON support for flexible transaction metadata
- **Infrastructure:** AWS cloud platform (EC2, RDS, ElastiCache, S3) with Docker containerization for consistent deployment
- **Integration:** Bulgarian QR receipt parsing, on-device ML categorization (TensorFlow Lite), Firebase Cloud Messaging for push notifications

The architecture achieves PRD goals by:
- **QR Scanning Speed:** Camera-first UI with < 2-second QR parse time (NFR1)
- **Offline Support:** Redux Persist enables viewing cached data without connectivity
- **Battery Efficiency:** Geofencing instead of continuous GPS tracking (< 5% daily battery usage, NFR4)
- **Scalability:** Monolithic backend designed for future microservices extraction
- **Developer Experience:** Monorepo with shared TypeScript types prevents API contract mismatches

### Platform and Infrastructure Choice

After evaluating multiple cloud platforms, **AWS (Amazon Web Services)** is selected as the infrastructure provider for Kash Budget.

**Platform Comparison:**

| Platform | Pros | Cons | Verdict |
|----------|------|------|---------|
| **AWS** | Comprehensive services, mature ecosystem, RDS PostgreSQL, ElastiCache Redis, proven at scale, strong security | More complex than Vercel/Supabase, requires infrastructure knowledge | ✅ **Selected** |
| **Vercel + Supabase** | Rapid development, excellent Next.js integration, built-in auth | Less control over infrastructure, limited for mobile-first apps, serverless constraints for background jobs | ❌ Not ideal for React Native |
| **Google Cloud** | Strong ML/AI services (TensorFlow integration), Firebase ecosystem | Less familiar to team, higher learning curve | ❌ Deferred |

**Selected Platform:** **AWS**

**Key Services:**
- **Compute:** Amazon EC2 (t3.small initially, auto-scaling group for future growth)
- **Database:** Amazon RDS PostgreSQL 14+ (Multi-AZ for production, automated backups)
- **Cache:** Amazon ElastiCache Redis (session management, credit balances, frequently accessed data)
- **Storage:** Amazon S3 (optional receipt images, encrypted at rest with SSE-S3)
- **CDN:** Amazon CloudFront (static assets, app bundles)
- **Container Orchestration:** Amazon ECS or AWS App Runner (Docker deployment)
- **Monitoring:** Amazon CloudWatch (logs, metrics, alarms)
- **Notifications:** Firebase Cloud Messaging (push notifications to mobile)
- **CI/CD:** GitHub Actions (testing, building, deploying to AWS)

**Deployment Host and Regions:**
- **Primary Region:** eu-central-1 (Frankfurt) - closest to Bulgaria for low latency
- **Development:** Single-region deployment
- **Production (Future):** Multi-AZ deployment within eu-central-1 for high availability

**Rationale:** AWS provides the right balance of control, scalability, and comprehensive services for a financial application. The ability to use RDS PostgreSQL with automated backups and encryption is critical for ACID compliance and data security. ElastiCache Redis supports high-performance credit calculations and session management. Firebase Cloud Messaging handles cross-platform push notifications without vendor lock-in.

### Repository Structure

**Structure:** **Monorepo** (Single repository containing mobile app, backend API, and shared TypeScript types)

**Monorepo Tool:** **npm workspaces** (built-in to npm 7+, no additional tooling required)

**Package Organization:**

```
kash-budget/
├── apps/
│   ├── mobile/          # React Native application
│   └── api/             # NestJS backend server
├── packages/
│   ├── shared/          # Shared TypeScript types, constants, utilities
│   ├── ui/              # Shared UI components (if needed for future web app)
│   └── config/          # Shared configuration (ESLint, TypeScript, Jest)
└── infrastructure/      # Infrastructure as Code (AWS CDK or Terraform)
```

**Workspace Configuration (package.json at root):**

```json
{
  "name": "kash-budget",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "npm run dev --workspaces",
    "build": "npm run build --workspaces",
    "test": "npm run test --workspaces"
  }
}
```

**Benefits:**
- **Atomic commits:** Single commit for frontend + backend changes ensures API contracts stay in sync
- **Type safety:** Shared TypeScript interfaces (`packages/shared/src/types`) prevent API mismatches
- **Dependency management:** Single `node_modules` at root reduces disk usage
- **Code reuse:** Utilities and constants shared between mobile and backend (e.g., category definitions, validation rules)
- **Simplified CI/CD:** Single pipeline tests and deploys both apps

**Rationale:** For a tightly coupled mobile app and API with a small development team, a monorepo eliminates coordination overhead. npm workspaces is chosen over Nx or Turborepo for simplicity—it provides sufficient features for MVP without additional complexity. As the project scales, migration to Nx for advanced caching is straightforward.

### High Level Architecture Diagram

```mermaid
graph TB
    subgraph "User Devices"
        iOS[iOS App<br/>React Native]
        Android[Android App<br/>React Native]
    end

    subgraph "AWS Cloud - eu-central-1"
        subgraph "Compute"
            ALB[Application<br/>Load Balancer]
            ECS1[ECS Container 1<br/>NestJS API]
            ECS2[ECS Container 2<br/>NestJS API]
        end

        subgraph "Data Layer"
            RDS[(RDS PostgreSQL<br/>Primary Database)]
            Redis[(ElastiCache Redis<br/>Session & Cache)]
            S3[S3 Bucket<br/>Receipt Images]
        end

        subgraph "Monitoring"
            CW[CloudWatch<br/>Logs & Metrics]
            Sentry[Sentry<br/>Error Tracking]
        end
    end

    subgraph "External Services"
        FCM[Firebase Cloud<br/>Messaging]
        Analytics[Amplitude/<br/>Mixpanel]
    end

    subgraph "Edge"
        CF[CloudFront CDN<br/>Static Assets]
    end

    iOS -->|HTTPS API Calls| ALB
    Android -->|HTTPS API Calls| ALB
    iOS -.->|Push Tokens| FCM
    Android -.->|Push Tokens| FCM
    iOS -.->|Analytics Events| Analytics
    Android -.->|Analytics Events| Analytics

    ALB --> ECS1
    ALB --> ECS2
    ECS1 --> RDS
    ECS2 --> RDS
    ECS1 --> Redis
    ECS2 --> Redis
    ECS1 --> S3
    ECS2 --> S3
    ECS1 -->|Logs| CW
    ECS2 -->|Logs| CW
    ECS1 -.->|Errors| Sentry
    ECS2 -.->|Errors| Sentry
    ECS1 -->|Send Notifications| FCM
    ECS2 -->|Send Notifications| FCM

    CF -->|Serve| iOS
    CF -->|Serve| Android

    style iOS fill:#61DAFB,stroke:#000,stroke-width:2px
    style Android fill:#3DDC84,stroke:#000,stroke-width:2px
    style RDS fill:#527FFF,stroke:#000,stroke-width:2px
    style Redis fill:#DC382D,stroke:#000,stroke-width:2px
    style ECS1 fill:#FF9900,stroke:#000,stroke-width:2px
    style ECS2 fill:#FF9900,stroke:#000,stroke-width:2px
```

**Diagram Notes:**
- Solid lines: Primary data flow (API requests, database queries)
- Dashed lines: Asynchronous/external integrations (push notifications, analytics)
- Mobile apps communicate directly with Load Balancer over HTTPS
- Backend services are stateless and horizontally scalable
- Redis provides session storage and caching layer
- CloudWatch and Sentry provide observability

### Architectural Patterns

The following patterns guide both frontend and backend development:

- **Monolithic Backend with Domain Modules:** Single NestJS application organized into domain modules (Auth, Transactions, Insights, Gamification, Notifications). Each module encapsulates its controllers, services, and repositories. _Rationale:_ Simplifies MVP development and deployment while maintaining loose coupling for future microservices extraction.

- **Mobile-First Progressive Enhancement:** React Native mobile app is the primary interface; web app is a future consideration. Design for mobile constraints (battery, connectivity, screen size) first. _Rationale:_ MVP targets mobile users; optimizing for mobile ensures the best user experience.

- **Offline-First with Optimistic Updates:** Mobile app caches data locally (Redux Persist) and allows viewing historical transactions offline. Mutations are queued and synced when connectivity resumes. _Rationale:_ Ensures app remains functional during temporary network loss, critical for on-the-go budget tracking.

- **Repository Pattern (Backend):** Abstract database access behind repository classes. Controllers → Services → Repositories → TypeORM Entities. _Rationale:_ Enables unit testing services without database dependencies; future-proofs for potential database changes or addition of read replicas.

- **Component-Based UI (Frontend):** Reusable React Native components with clear prop interfaces. Atomic design: Atoms → Molecules → Organisms → Templates → Pages. _Rationale:_ Promotes code reuse and consistency across screens; aligns with wireframe specifications.

- **State Management with Redux Toolkit:** Centralized state for transactions, user profile, budget goals, and credits. Redux Toolkit for reduced boilerplate. Thunks for async operations (API calls). _Rationale:_ Predictable state management essential for complex gamification logic (credit calculations, streak tracking). Redux DevTools aid debugging.

- **API Gateway Pattern (Future-Ready):** All mobile API requests go through a single entry point (ALB → NestJS API). _Rationale:_ Centralizes authentication, rate limiting, and logging. Prepares for future microservices by acting as a facade.

- **Event-Driven Notifications:** Backend emits events (transaction created, budget limit reached, streak achieved) that trigger push notifications and email alerts. _Rationale:_ Decouples business logic from notification delivery; enables adding new notification channels (SMS, in-app) without modifying core services.

- **TensorFlow Lite On-Device ML:** ML categorization model runs on-device (React Native), not server-side. Server provides model updates. _Rationale:_ Privacy (transaction data never leaves device for categorization), speed (< 100ms inference), and reduced server load.

- **BFF (Backend for Frontend) Endpoints:** API endpoints designed specifically for mobile app needs (e.g., `/dashboard` returns pre-aggregated data for See screen). _Rationale:_ Reduces mobile data transfer and processing; single API call replaces multiple smaller calls.

---

## Tech Stack

This is the **definitive technology selection** for the entire Kash Budget project. All development must use these exact technologies and versions. This table is the single source of truth.

### Technology Stack Table

| Category | Technology | Version | Purpose | Rationale |
|----------|-----------|---------|---------|-----------|
| **Frontend Language** | TypeScript | 5.3+ | Type-safe mobile app development | Prevents runtime errors, improves IDE support, shared types with backend ensure API contract compliance |
| **Frontend Framework** | React Native | 0.73+ | Cross-platform mobile app (iOS + Android) | Single codebase for both platforms reduces development time by 50%; mature ecosystem with extensive libraries for QR scanning, geofencing, and offline storage |
| **UI Component Library** | React Native Paper | 5.x | Material Design components | Provides pre-built accessible components (buttons, cards, inputs) aligned with Material Design; customizable theming for Kash Budget brand colors |
| **State Management** | Redux Toolkit | 2.0+ | Predictable state for complex credit system | Simplifies Redux boilerplate; DevTools for debugging; Redux Persist for offline support; essential for credit calculations and streak tracking |
| **Navigation** | React Navigation | 6.x | Mobile app routing and navigation | De facto standard for React Native; supports tab navigation (Scan/See/Save), stack navigation (drill-downs), and deep linking |
| **Backend Language** | TypeScript | 5.3+ | Type-safe server development | Consistency with frontend; compile-time type checking prevents API bugs; shared types via monorepo |
| **Backend Framework** | NestJS | 10.x | Structured, scalable Node.js framework | Built-in TypeScript support; dependency injection for testability; modular architecture aligns with domain-driven design; Swagger auto-docs |
| **API Style** | REST | OpenAPI 3.0 | RESTful HTTP API with clear resource endpoints | Simpler than GraphQL for MVP; OpenAPI spec auto-generated from NestJS decorators; widely understood standard |
| **Database** | PostgreSQL | 14+ | ACID-compliant relational database | Financial data requires ACID guarantees; JSON columns for flexible transaction metadata; mature ecosystem; excellent TypeORM support |
| **ORM** | TypeORM | 0.3+ | Database abstraction and migrations | Type-safe query builder; auto-generated migrations; supports PostgreSQL advanced features (JSONB, full-text search) |
| **Cache** | Redis | 7.x | In-memory data store for sessions and caching | Sub-millisecond latency for session lookups; credit balance caching reduces DB load; pub/sub for future real-time features |
| **File Storage** | Amazon S3 | N/A | Optional receipt image storage | Scalable object storage with encryption at rest (SSE-S3); S3 presigned URLs for secure uploads from mobile |
| **Authentication** | Passport.js + JWT | Passport 0.7+, JWT 9.x | OAuth 2.0 with JWT tokens | Passport strategies for Google/Apple Sign-In; stateless JWT for horizontal scaling; refresh tokens stored in Redis |
| **Frontend Testing** | Jest + React Native Testing Library | Jest 29.x, RNTL 12.x | Component unit tests and integration tests | Jest for snapshot testing and mocking; RNTL for user-centric component tests (queries by accessibility labels) |
| **Backend Testing** | Jest + Supertest | Jest 29.x, Supertest 6.x | API endpoint tests and unit tests | Jest for service unit tests; Supertest for integration tests (HTTP assertions); 70%+ coverage target for critical paths |
| **E2E Testing** | Manual Testing (MVP) | N/A | Manual user flow testing on real devices | E2E automation (Detox/Appium) deferred until post-MVP; manual testing sufficient for validating QR scanning and geofencing |
| **Build Tool (Mobile)** | Metro | 0.80+ (bundled with RN) | React Native JavaScript bundler | Default bundler for React Native; fast refresh for dev experience; tree-shaking for production builds |
| **Build Tool (Backend)** | Webpack | 5.x (NestJS default) | Backend bundling and optimization | NestJS CLI uses Webpack; TypeScript compilation; environment variable injection |
| **Bundler (Mobile)** | Metro | 0.80+ | JavaScript bundling for React Native | Optimized for React Native; supports Fast Refresh; Hermes bytecode compilation for Android |
| **IaC Tool** | AWS CDK | 2.x | Infrastructure as Code for AWS resources | TypeScript-based IaC (consistency with app code); higher-level abstractions than CloudFormation; synth to CloudFormation for deployment |
| **CI/CD** | GitHub Actions | N/A | Automated testing and deployment | Free for public repos; YAML workflows; matrix builds for iOS/Android; AWS CLI for ECS deployment |
| **Monitoring** | Amazon CloudWatch | N/A | Infrastructure monitoring and logging | Native AWS integration; log aggregation; custom metrics; alarms for error rates and latency |
| **Error Tracking** | Sentry | SaaS Latest | Application error and crash reporting | Real-time error alerts; source map support for stack traces; release tracking; mobile + backend coverage |
| **Logging** | Winston | 3.x | Structured JSON logging | Configurable transports (console, CloudWatch); log levels (error, warn, info, debug); contextual metadata |
| **Analytics** | Amplitude or Mixpanel | SDK Latest | Product analytics and user behavior tracking | Event tracking (QR scans, budget goal sets); cohort analysis; retention metrics; A/B test support (future) |
| **CSS Framework** | Styled Components (React Native) | 6.x | CSS-in-JS for dynamic theming | Component-scoped styles; dynamic theme switching (future dark mode); TypeScript theme typing |
| **QR Scanning** | react-native-camera or Expo Camera | Latest | QR code detection on mobile | Hardware-accelerated barcode scanning; supports Bulgarian QR format; < 2-second scan time (NFR1) |
| **Geofencing** | react-native-geolocation-service | Latest | GPS location and background geofencing | Battery-efficient geofencing; background location updates; works on iOS/Android with permission handling |
| **Push Notifications** | Firebase Cloud Messaging (FCM) | SDK Latest | Cross-platform push notifications | Single API for iOS + Android; topic-based messaging; rich notifications with actions |
| **ML Framework** | TensorFlow Lite | Latest (React Native TFLite) | On-device ML for transaction categorization | Privacy (data stays on device); fast inference (< 100ms); small model size (< 5MB) |
| **Local Storage (Mobile)** | AsyncStorage or MMKV | MMKV 2.x (faster) | Key-value storage for mobile app | MMKV for high-performance (10x faster than AsyncStorage); encryption support; used by Redux Persist |
| **Crash Reporting (Mobile)** | Sentry React Native | SDK Latest | Mobile crash reporting and performance monitoring | Automatic crash capture; breadcrumb trails; release health tracking; native crash support (iOS/Android) |
| **Code Quality** | ESLint + Prettier | ESLint 8.x, Prettier 3.x | Linting and code formatting | Enforce coding standards; Prettier for consistent formatting; pre-commit hooks with Husky |
| **Git Hooks** | Husky + lint-staged | Husky 8.x, lint-staged 15.x | Pre-commit linting and testing | Run linters and tests before commits; prevents broken code from being committed |
| **Package Manager** | npm | 9.x+ | Dependency management and workspaces | Built-in workspace support (npm workspaces); lockfile for reproducible builds; familiar tooling |
| **Container Runtime** | Docker | 24.x+ | Containerization for consistent deployment | Dockerfile for backend API; Docker Compose for local dev environment (PostgreSQL + Redis containers) |
| **Container Orchestration** | Amazon ECS or AWS App Runner | N/A | Managed container deployment | ECS for auto-scaling; App Runner for simpler setup; integrated with ALB and CloudWatch |
| **Load Balancer** | Amazon Application Load Balancer | N/A | HTTP/HTTPS load balancing and SSL termination | Layer 7 load balancing; SSL certificate from ACM; health checks for ECS tasks |

**Version Policy:**
- Use latest stable versions at project start
- Lock exact versions in `package.json` and `package-lock.json`
- Update dependencies quarterly with regression testing
- Security patches applied immediately (Dependabot alerts)

---

*[End of Section 1 - Foundation]*

---

## Development Environment

### Overview

Kash Budget uses **VSCode DevContainers** with Docker Compose for local development. This provides a one-click setup that mirrors production architecture with isolated services for API, database, and cache.

**Benefits:**
- ✅ Zero "works on my machine" issues - consistent environment across all developer machines
- ✅ New developer onboarding in < 5 minutes
- ✅ Production-like architecture - separate database/cache services
- ✅ Automatic service startup and health checks
- ✅ Auto-installation of VSCode extensions (ESLint, Prettier, Claude Code)

**Status:** ✅ **Validated** - All critical tests passed (see [DevContainer Validation Report](experiments/2025-11-17-devcontainer-validation.md))

### Architecture

The development environment consists of three Docker containers orchestrated via Docker Compose:

```
┌─────────────────────────────────────────────────────────┐
│  VSCode DevContainer (Workspace: /workspaces/exercise)  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Service: api (Node.js 20)                       │  │
│  │  - TypeScript, ESLint, NestJS CLI                │  │
│  │  - PostgreSQL client (psql)                      │  │
│  │  - Workspace mounted as volume                   │  │
│  │  - Ports: 3000, 8080                             │  │
│  └──────────────────────────────────────────────────┘  │
│                       │                                  │
│                       ├─── connects to ───┐             │
│                       │                    │             │
│  ┌────────────────────▼──────┐  ┌─────────▼──────────┐ │
│  │  Service: db              │  │  Service: cache    │ │
│  │  (PostgreSQL 15-alpine)   │  │  (Redis 7-alpine)  │ │
│  │  - Port: 5432             │  │  - Port: 6379      │ │
│  │  - Volume: postgres-data  │  │  - Volume: redis   │ │
│  │  - Auto-initialized       │  │  - Health checks   │ │
│  └───────────────────────────┘  └────────────────────┘ │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Configuration Files

**File Structure:**
```
.devcontainer/
├── docker-compose.yml      # Multi-service orchestration
├── devcontainer.json        # VSCode configuration
└── Dockerfile               # API service container definition
```

#### Service: `api`
- **Base Image:** Custom (built from `.devcontainer/Dockerfile`)
- **Working Directory:** `/workspaces/exercise`
- **Command:** `sleep infinity` (VSCode takes over process management)
- **Volumes:** Workspace mounted with `cached` flag for performance
- **Environment Variables:**
  - `DATABASE_URL=postgresql://kash:dev_password@db:5432/kash_budget`
  - `REDIS_URL=redis://cache:6379`
  - `NODE_ENV=development`
- **Dependencies:** Waits for `db` and `cache` via `depends_on`
- **Network:** `kash-network` (bridge)

#### Service: `db`
- **Base Image:** `postgres:15-alpine`
- **Initialization:** Automatic via PostgreSQL environment variables
  - `POSTGRES_USER=kash`
  - `POSTGRES_PASSWORD=dev_password`
  - `POSTGRES_DB=kash_budget`
- **Volume:** `postgres-data:/var/lib/postgresql/data` (persistent)
- **Health Check:** `pg_isready -U kash -d kash_budget` every 10s
- **Port Forwarding:** `5432:5432`
- **Restart Policy:** `unless-stopped`

#### Service: `cache`
- **Base Image:** `redis:7-alpine`
- **Volume:** `redis-data:/data` (persistent)
- **Health Check:** `redis-cli ping` every 10s
- **Port Forwarding:** `6379:6379`
- **Restart Policy:** `unless-stopped`

**Networking:**
- All services connected via `kash-network` bridge network
- Services can reference each other by service name (e.g., `db`, `cache`)

**Data Persistence:**
- Two named volumes: `postgres-data` and `redis-data`
- Data persists across container restarts
- To reset: `docker-compose down -v`

### API Container Dockerfile

**Base Image:** `node:20` (Debian-based)

**Installed Packages:**
- `postgresql-client-15` - For connecting to PostgreSQL (`psql`, `pg_dump`, etc.)
- `redis-tools` - For connecting to Redis (`redis-cli`, debugging tools)

**Global Node.js Tools:**
- `typescript` - TypeScript compiler
- `eslint` - JavaScript linter
- `@nestjs/cli` - NestJS framework CLI

**Design Rationale:**
- Minimal container focused on Node.js development
- PostgreSQL/Redis run in separate containers (better isolation)
- Only client tools installed (not servers) for database/cache access
- Global tools installed for CLI convenience

### Connection Details

#### Database Connection

**From API Service:**
```bash
# Hostname: db (Docker Compose service name)
DATABASE_URL=postgresql://kash:dev_password@db:5432/kash_budget
```

**From Host Machine (via port forwarding):**
```bash
# Hostname: localhost (forwarded from container)
DATABASE_URL=postgresql://kash:dev_password@localhost:5432/kash_budget
```

**Connect via psql (inside container):**
```bash
export PGPASSWORD=dev_password
psql -h db -U kash -d kash_budget
```

#### Redis Connection

**From API Service:**
```bash
# Hostname: cache (Docker Compose service name)
REDIS_URL=redis://cache:6379
```

**From Host Machine (via port forwarding):**
```bash
# Hostname: localhost
REDIS_URL=redis://localhost:6379
```

**Test connection (inside container):**
```bash
redis-cli -h cache ping
# Expected: PONG
```

### Developer Workflow

#### Initial Setup (One-Time)

1. **Prerequisites:**
   - Docker Desktop 4.0+ installed
   - VSCode with DevContainers extension
   - Git (for cloning repo)

2. **Clone and Open:**
   ```bash
   git clone <repo-url>
   cd exercise
   code .
   ```

3. **Build DevContainer:**
   - VSCode will prompt: "Reopen in Container"
   - OR: `Ctrl+Shift+P` → "Dev Containers: Rebuild Container"

4. **Wait for Services:**
   - Docker Compose pulls images (PostgreSQL, Redis)
   - Builds API container
   - Starts all three services
   - Runs `npm install`
   - **Estimated Time:** 3-5 minutes (first time)

5. **Verify Setup:**
   ```bash
   # Check PostgreSQL
   export PGPASSWORD=dev_password
   psql -h db -U kash -d kash_budget -c "SELECT version();"

   # Check Redis
   redis-cli -h cache ping
   # Expected: PONG

   # Check Node.js
   node --version  # Expected: v20.x.x
   ```

#### Daily Workflow

1. **Start DevContainer:**
   - Open VSCode → Reopen in Container (if not already)
   - Services auto-start via Docker Compose

2. **Run Application:**
   ```bash
   # Install dependencies (if new packages added)
   npm install

   # Run database migrations
   npm run migration:run

   # Start API server
   npm run start:dev
   ```

3. **Access Services:**
   - API: `http://localhost:3000`
   - PostgreSQL: `localhost:5432`
   - Redis: `localhost:6379`

4. **Run Tests:**
   ```bash
   npm run test
   npm run test:e2e
   ```

#### Troubleshooting Commands

```bash
# View running services
docker-compose ps

# Check service logs
docker-compose logs api
docker-compose logs db
docker-compose logs cache

# Restart a service
docker-compose restart db

# Reset database (delete all data)
docker-compose down -v
docker-compose up -d

# Rebuild API container (after Dockerfile changes)
docker-compose build api
docker-compose up -d
```

### Known Issues & Workarounds

#### Issue 1: First Build Takes Long Time
**Symptom:** Docker pulls large images (Node.js, PostgreSQL)
**Workaround:** Expected behavior. Subsequent builds are cached.
**Status:** Not an issue

#### Issue 2: Port Already in Use
**Symptom:** `Error: Port 5432 is already allocated`
**Cause:** PostgreSQL already running on host machine
**Workaround:** Stop host PostgreSQL or change port in docker-compose.yml
**Status:** Documented

#### Issue 3: Volume Permission Issues (Linux)
**Symptom:** Cannot write to `/workspaces/exercise`
**Cause:** UID mismatch between host and container
**Workaround:** Add `remoteUser` to devcontainer.json
**Status:** Monitor during testing

### Demo and Testing Strategies

#### Demo Data Seeding

For impressive demos, pre-populate with realistic data:

```typescript
// File: apps/api/src/database/seeds/demo.seed.ts
export class DemoSeeder {
  async run() {
    // Create demo user
    const user = await this.createDemoUser({
      email: 'demo@kash-budget.com',
      name: 'Demo User',
      totalCredits: 45,  // Show progress
    });

    // Create realistic transaction history (last 30 days)
    await this.createTransactions(user, [
      { amount: 12.50, category: 'Coffee & Breakfast', merchant: 'Starbucks', date: '2025-11-16' },
      { amount: 45.00, category: 'Groceries', merchant: 'Kaufland', date: '2025-11-15' },
      { amount: 25.00, category: 'Treat Yourself', merchant: 'Cinema City', date: '2025-11-14' },
      // ... more transactions for realistic dashboard
    ]);

    // Create spending categories with patterns
    await this.createCategories([
      { name: 'Coffee & Breakfast', budget: 100, spent: 67.50, color: '#E9C46A' },
      { name: 'Groceries', budget: 500, spent: 345.00, color: '#2A9D8F' },
      { name: 'Treat Yourself', budget: 150, spent: 75.00, color: '#9D4EDD' },
    ]);
  }
}
```

**Run Seeder:**
```bash
npm run seed:demo
```

#### Remote Demo with ngrok

For demos to stakeholders not on the same WiFi network:

```bash
# Install ngrok
brew install ngrok  # or download from ngrok.com

# Create public tunnel to local backend
ngrok http 3000

# Output: https://abc123.ngrok.io -> http://localhost:3000
# Use this URL in mobile app config
```

**Benefits of ngrok:**
- ✅ Demo app to anyone, anywhere (no same WiFi needed)
- ✅ Share demo link with stakeholders
- ✅ Test push notifications (requires public URL)

**Limitations:**
- ⚠️ Free tier has random URLs (URL changes on restart)
- ⚠️ Paid tier ($8/month) for stable URLs

### Migration from Single Container Approach

**What Changed:**

**Before (Single Container with Supervisor):**
```
Dockerfile: Node.js + PostgreSQL Server + Redis Server + Supervisor
├── Complexity: High (multi-process management)
├── Debugging: Hard (mixed logs)
└── Issues: Race conditions, sudo errors, timing problems
```

**After (Docker Compose):**
```
docker-compose.yml: Three separate services
├── api: Node.js + PostgreSQL client only
├── db: PostgreSQL 15 (official image)
└── cache: Redis 7 (official image)
```

**Files Removed:**
- `.devcontainer/init-db.sh` (no longer needed)
- `.devcontainer/supervisord.conf` (no longer needed)

**Benefits Gained:**
- ✅ No more race conditions (Docker Compose handles startup order)
- ✅ No more `sudo` errors (each service runs as proper user)
- ✅ Easier debugging (isolated logs per service)
- ✅ Production-like (matches cloud architecture)
- ✅ Simpler Dockerfile (just Node.js + dev tools)

### Production Alignment

#### How DevContainer Mirrors Production

| Component | DevContainer | Production (AWS) |
|-----------|--------------|------------------|
| **API** | Node.js container | ECS task (Fargate) |
| **Database** | PostgreSQL container | RDS PostgreSQL |
| **Cache** | Redis container | ElastiCache Redis |
| **Networking** | Docker network | VPC with security groups |
| **Environment Variables** | docker-compose.yml | ECS task definition |
| **Data Persistence** | Docker volumes | RDS/ElastiCache storage |

**Key Difference:** Production uses managed services (RDS, ElastiCache) instead of self-hosted containers.

### Migration Path: Local Development → Production

When ready to deploy for real users:

**Phase 1: Export Local Data (Optional)**
```bash
# Backup PostgreSQL database
docker exec kash-budget-db pg_dump -U kash kash_budget > backup.sql

# Upload to production
psql $PRODUCTION_DATABASE_URL < backup.sql
```

**Phase 2: Update Environment Variables**

**Local (.env.local):**
```bash
DATABASE_URL=postgresql://kash:dev_password@localhost:5432/kash_budget
REDIS_URL=redis://localhost:6379
API_URL=http://localhost:3000
```

**Production (.env.production):**
```bash
DATABASE_URL=postgresql://user:pass@production-db.amazonaws.com:5432/kash_budget
REDIS_URL=redis://production-cache.amazonaws.com:6379
API_URL=https://api.kash-budget.com
JWT_SECRET=<strong-production-secret>
```

**Phase 3: Deploy to Cloud**

See **Infrastructure Deployment** section for AWS deployment details.

---

*[End of Section 2 - Development Environment]*


## Data Models

The following data models represent the core business entities shared between frontend and backend. All models are defined as TypeScript interfaces in `packages/shared/src/types` for type safety across the stack.

### User

**Purpose:** Represents an authenticated user of the Kash Budget application.

**Key Attributes:**
- `id`: string (UUID) - Unique user identifier
- `email`: string - User email address (unique)
- `displayName`: string - User's display name
- `authProvider`: enum ('google' | 'apple' | 'email') - OAuth provider or email/password
- `profilePhotoUrl`: string | null - URL to user's profile photo
- `createdAt`: Date - Account creation timestamp
- `updatedAt`: Date - Last profile update timestamp
- `preferences`: UserPreferences - User settings and preferences
- `onboardingCompleted`: boolean - Whether user completed onboarding flow
- `streakDays`: number - Current consecutive scanning streak

#### TypeScript Interface

```typescript
interface User {
  id: string;
  email: string;
  displayName: string;
  authProvider: 'google' | 'apple' | 'email';
  profilePhotoUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  preferences: UserPreferences;
  onboardingCompleted: boolean;
  streakDays: number;
}

interface UserPreferences {
  currency: string; // 'BGN', 'EUR', 'USD'
  language: string; // 'en', 'bg'
  notificationsEnabled: boolean;
  geofencingEnabled: boolean;
  monthlyBudget: number | null;
  treatYourselfBudget: number | null;
  categoryBudgets: Record<string, number>; // category name → budget amount
}
```

#### Relationships
- **One-to-Many** with Transaction (user owns multiple transactions)
- **One-to-Many** with Location (user tags multiple locations)
- **One-to-Many** with Budget (user sets multiple budget goals)
- **One-to-One** with CreditBalance (user has one credit balance)

---

### Transaction

**Purpose:** Represents a single spending transaction (from receipt scan or manual entry).

**Key Attributes:**
- `id`: string (UUID) - Unique transaction identifier
- `userId`: string (UUID, FK) - Owner of transaction
- `amount`: number - Transaction amount (positive for expenses, negative for refunds)
- `currency`: string - Currency code ('BGN', 'EUR', 'USD')
- `category`: string - Spending category (from predefined list + 'Treat Yourself')
- `merchant`: string | null - Merchant name (from QR or manual entry)
- `description`: string | null - Optional user-added notes
- `transactionDate`: Date - Date/time of purchase (from receipt or manual entry)
- `createdAt`: Date - When transaction was added to app
- `updatedAt`: Date - Last modification timestamp
- `source`: enum ('qr_scan' | 'manual_entry') - How transaction was created
- `qrData`: string | null - Raw QR code data (for Bulgarian receipts)
- `locationId`: string | null (FK) - Associated tagged location
- `autoCategor ized`: boolean - Whether ML auto-categorized (vs manual)
- `mlConfidence`: number | null - ML model confidence score (0-1)
- `receiptImageUrl`: string | null - S3 URL to optional receipt photo

#### TypeScript Interface

```typescript
interface Transaction {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  category: string;
  merchant: string | null;
  description: string | null;
  transactionDate: Date;
  createdAt: Date;
  updatedAt: Date;
  source: 'qr_scan' | 'manual_entry';
  qrData: string | null;
  locationId: string | null;
  autoCategorized: boolean;
  mlConfidence: number | null;
  receiptImageUrl: string | null;
}
```

#### Relationships
- **Many-to-One** with User (transaction belongs to one user)
- **Many-to-One** with Location (transaction can occur at one tagged location)

---

### Category

**Purpose:** Predefined spending categories for transaction classification.

**Key Attributes:**
- `id`: string (UUID) - Unique category identifier
- `name`: string - Category name ('Food & Groceries', 'Dining Out', 'Transportation', etc.)
- `icon`: string - Emoji or icon identifier
- `color`: string - Hex color code for UI display
- `isDefault`: boolean - Whether category is predefined (true) or user-created (false)
- `isTreatYourself`: boolean - Special flag for Treat Yourself category
- `userId`: string | null (FK) - Null for default categories, user ID for custom categories

#### TypeScript Interface

```typescript
interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  isDefault: boolean;
  isTreatYourself: boolean;
  userId: string | null;
}

// Predefined categories exported as constants
export const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Food & Groceries', icon: '🛒', color: '#06D6A0', isDefault: true, isTreatYourself: false, userId: null },
  { id: '2', name: 'Dining Out', icon: '☕', color: '#EF476F', isDefault: true, isTreatYourself: false, userId: null },
  { id: '3', name: 'Transportation', icon: '🚗', color: '#FFB703', isDefault: true, isTreatYourself: false, userId: null },
  { id: '4', name: 'Entertainment', icon: '🎬', color: '#8338EC', isDefault: true, isTreatYourself: false, userId: null },
  { id: '5', name: 'Shopping', icon: '👕', color: '#FF006E', isDefault: true, isTreatYourself: false, userId: null },
  { id: '6', name: 'Bills & Utilities', icon: '🏠', color: '#118AB2', isDefault: true, isTreatYourself: false, userId: null },
  { id: '7', name: 'Healthcare', icon: '🏥', color: '#FB5607', isDefault: true, isTreatYourself: false, userId: null },
  { id: '8', name: 'Other', icon: '💼', color: '#ADB5BD', isDefault: true, isTreatYourself: false, userId: null },
  { id: '9', name: 'Treat Yourself', icon: '🎉', color: '#9D4EDD', isDefault: true, isTreatYourself: true, userId: null },
];
```

#### Relationships
- **One-to-Many** with Transaction (category appears in multiple transactions)

---

### Location

**Purpose:** User-tagged frequent spending locations for geofencing and location-based insights.

**Key Attributes:**
- `id`: string (UUID) - Unique location identifier
- `userId`: string (UUID, FK) - Owner of tagged location
- `name`: string - User-assigned location name ('Kaufland Studentski', 'Office', 'Home')
- `latitude`: number - GPS latitude
- `longitude`: number - GPS longitude
- `radiusMeters`: number - Geofence radius (default: 100 meters)
- `visitCount`: number - Number of times user has transacted here
- `totalSpent`: number - Total amount spent at this location
- `isTrustedLocation`: boolean - User-flagged trusted location (green badge)
- `isHighSpendAlert`: boolean - System-flagged high-spend location (red badge)
- `createdAt`: Date - When location was tagged
- `lastVisit`: Date | null - Last time geofence was triggered

#### TypeScript Interface

```typescript
interface Location {
  id: string;
  userId: string;
  name: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  visitCount: number;
  totalSpent: number;
  isTrustedLocation: boolean;
  isHighSpendAlert: boolean;
  createdAt: Date;
  lastVisit: Date | null;
}
```

#### Relationships
- **Many-to-One** with User (location belongs to one user)
- **One-to-Many** with Transaction (location can have multiple transactions)

---

### Budget

**Purpose:** User-defined budget goals (monthly overall budget + category-specific budgets).

**Key Attributes:**
- `id`: string (UUID) - Unique budget identifier
- `userId`: string (UUID, FK) - Owner of budget
- `type`: enum ('monthly_overall' | 'category_specific' | 'treat_yourself') - Budget type
- `category`: string | null - Category name (null for overall budget)
- `amount`: number - Budget limit amount
- `period`: enum ('weekly' | 'monthly') - Budget period (MVP: monthly only)
- `startDate`: Date - Budget period start
- `endDate`: Date - Budget period end
- `isActive`: boolean - Whether budget is currently active
- `createdAt`: Date - Budget creation timestamp
- `updatedAt`: Date - Last update timestamp

#### TypeScript Interface

```typescript
interface Budget {
  id: string;
  userId: string;
  type: 'monthly_overall' | 'category_specific' | 'treat_yourself';
  category: string | null;
  amount: number;
  period: 'weekly' | 'monthly';
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Relationships
- **Many-to-One** with User (budget belongs to one user)

---

### CreditBalance

**Purpose:** Tracks user's virtual credit balance and unlocked features.

**Key Attributes:**
- `userId`: string (UUID, PK/FK) - One-to-one with User
- `totalCredits`: number - Cumulative credits earned
- `currentCredits`: number - Current spendable credit balance
- `lifetimeScans`: number - Total number of receipts scanned
- `lastScanDate`: Date | null - Last receipt scan timestamp
- `streakDays`: number - Current consecutive scanning streak
- `longestStreak`: number - All-time longest streak
- `unlockedFeatures`: string[] - Array of unlocked feature IDs
- `createdAt`: Date - When credits tracking started
- `updatedAt`: Date - Last credit change timestamp

#### TypeScript Interface

```typescript
interface CreditBalance {
  userId: string;
  totalCredits: number;
  currentCredits: number;
  lifetimeScans: number;
  lastScanDate: Date | null;
  streakDays: number;
  longestStreak: number;
  unlockedFeatures: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

#### Relationships
- **One-to-One** with User (each user has one credit balance)

---

### CreditTransaction

**Purpose:** Audit log of credit earnings and spending.

**Key Attributes:**
- `id`: string (UUID) - Unique credit transaction identifier
- `userId`: string (UUID, FK) - User who earned/spent credits
- `amount`: number - Credits earned (positive) or spent (negative)
- `type`: enum ('scan' | 'streak_bonus' | 'milestone' | 'feature_unlock') - Credit transaction type
- `description`: string - Human-readable description ('Scanned receipt #42', '5-day streak bonus')
- `relatedEntityId`: string | null - ID of related transaction, achievement, etc.
- `createdAt`: Date - When credit transaction occurred

#### TypeScript Interface

```typescript
interface CreditTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'scan' | 'streak_bonus' | 'milestone' | 'feature_unlock';
  description: string;
  relatedEntityId: string | null;
  createdAt: Date;
}
```

#### Relationships
- **Many-to-One** with User (credit transaction belongs to one user)

---

### KashMessage

**Purpose:** Kash mascot messages displayed to users (motivation, celebrations, warnings).

**Key Attributes:**
- `id`: string (UUID) - Unique message identifier
- `userId`: string (UUID, FK) - Recipient user
- `messageType`: enum ('greeting' | 'motivation' | 'celebration' | 'warning' | 'tip') - Message category
- `content`: string - Kash message text
- `trigger`: string - What triggered this message ('morning_check_in', 'budget_warning', 'milestone_achieved')
- `isRead`: boolean - Whether user has seen message
- `createdAt`: Date - Message creation timestamp
- `expiresAt`: Date | null - Optional message expiration

#### TypeScript Interface

```typescript
interface KashMessage {
  id: string;
  userId: string;
  messageType: 'greeting' | 'motivation' | 'celebration' | 'warning' | 'tip';
  content: string;
  trigger: string;
  isRead: boolean;
  createdAt: Date;
  expiresAt: Date | null;
}
```

#### Relationships
- **Many-to-One** with User (message belongs to one user)

---

## API Specification

### REST API Overview

The Kash Budget API follows RESTful design principles with resource-based endpoints. All endpoints return JSON responses and accept JSON request bodies (where applicable). Authentication is required for all endpoints except `/auth/*`.

**Base URL:**
- **Development:** `http://localhost:3000/api/v1`
- **Staging:** `https://api-staging.kashbudget.com/api/v1`
- **Production:** `https://api.kashbudget.com/api/v1`

**Authentication:** Bearer JWT token in `Authorization` header

**API Versioning:** URL-based versioning (`/api/v1`)

### OpenAPI 3.0 Specification

```yaml
openapi: 3.0.0
info:
  title: Kash Budget API
  version: 1.0.0
  description: RESTful API for Kash Budget mobile application - personal finance tracking with QR receipt scanning, ML categorization, and gamification.
  contact:
    name: Kash Budget Team
    email: dev@kashbudget.com

servers:
  - url: https://api.kashbudget.com/api/v1
    description: Production server
  - url: https://api-staging.kashbudget.com/api/v1
    description: Staging server
  - url: http://localhost:3000/api/v1
    description: Local development server

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    User:
      type: object
      properties:
        id: {type: string, format: uuid}
        email: {type: string, format: email}
        displayName: {type: string}
        authProvider: {type: string, enum: [google, apple, email]}
        profilePhotoUrl: {type: string, nullable: true}
        createdAt: {type: string, format: date-time}
        onboardingCompleted: {type: boolean}
        streakDays: {type: integer}
        preferences:
          type: object
          properties:
            currency: {type: string}
            language: {type: string}
            notificationsEnabled: {type: boolean}
            geofencingEnabled: {type: boolean}
            monthlyBudget: {type: number, nullable: true}
            treatYourselfBudget: {type: number, nullable: true}

    Transaction:
      type: object
      properties:
        id: {type: string, format: uuid}
        userId: {type: string, format: uuid}
        amount: {type: number}
        currency: {type: string}
        category: {type: string}
        merchant: {type: string, nullable: true}
        description: {type: string, nullable: true}
        transactionDate: {type: string, format: date-time}
        createdAt: {type: string, format: date-time}
        source: {type: string, enum: [qr_scan, manual_entry]}
        qrData: {type: string, nullable: true}
        locationId: {type: string, nullable: true}
        autoCategorized: {type: boolean}
        mlConfidence: {type: number, nullable: true}

    Location:
      type: object
      properties:
        id: {type: string, format: uuid}
        name: {type: string}
        latitude: {type: number}
        longitude: {type: number}
        radiusMeters: {type: integer}
        visitCount: {type: integer}
        totalSpent: {type: number}
        isTrustedLocation: {type: boolean}
        isHighSpendAlert: {type: boolean}

    Error:
      type: object
      properties:
        error:
          type: object
          properties:
            code: {type: string}
            message: {type: string}
            details: {type: object}
            timestamp: {type: string, format: date-time}
            requestId: {type: string}

paths:
  # ==================== Authentication ====================
  /auth/google:
    post:
      summary: Authenticate with Google
      tags: [Authentication]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                idToken: {type: string}
      responses:
        '200':
          description: Authentication successful
          content:
            application/json:
              schema:
                type: object
                properties:
                  accessToken: {type: string}
                  refreshToken: {type: string}
                  user: {$ref: '#/components/schemas/User'}

  /auth/apple:
    post:
      summary: Authenticate with Apple
      tags: [Authentication]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                identityToken: {type: string}
                user: {type: object, nullable: true}
      responses:
        '200':
          description: Authentication successful

  /auth/refresh:
    post:
      summary: Refresh access token
      tags: [Authentication]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                refreshToken: {type: string}
      responses:
        '200':
          description: Token refreshed

  /auth/logout:
    post:
      summary: Logout user
      tags: [Authentication]
      security:
        - BearerAuth: []
      responses:
        '204':
          description: Logged out successfully

  # ==================== User Management ====================
  /users/me:
    get:
      summary: Get current user profile
      tags: [Users]
      security:
        - BearerAuth: []
      responses:
        '200':
          description: User profile
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'

    patch:
      summary: Update current user profile
      tags: [Users]
      security:
        - BearerAuth: []
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                displayName: {type: string}
                preferences: {type: object}
      responses:
        '200':
          description: Profile updated

  /users/me/onboarding:
    post:
      summary: Mark onboarding as completed
      tags: [Users]
      security:
        - BearerAuth: []
      responses:
        '200':
          description: Onboarding completed

  # ==================== Transactions ====================
  /transactions:
    get:
      summary: List user transactions
      tags: [Transactions]
      security:
        - BearerAuth: []
      parameters:
        - name: startDate
          in: query
          schema: {type: string, format: date}
        - name: endDate
          in: query
          schema: {type: string, format: date}
        - name: category
          in: query
          schema: {type: string}
        - name: limit
          in: query
          schema: {type: integer, default: 50}
        - name: offset
          in: query
          schema: {type: integer, default: 0}
      responses:
        '200':
          description: List of transactions
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items: {$ref: '#/components/schemas/Transaction'}
                  pagination:
                    type: object
                    properties:
                      total: {type: integer}
                      limit: {type: integer}
                      offset: {type: integer}

    post:
      summary: Create new transaction (from QR scan or manual entry)
      tags: [Transactions]
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [amount, transactionDate, source]
              properties:
                amount: {type: number}
                currency: {type: string, default: 'BGN'}
                category: {type: string}
                merchant: {type: string}
                description: {type: string}
                transactionDate: {type: string, format: date-time}
                source: {type: string, enum: [qr_scan, manual_entry]}
                qrData: {type: string}
                locationId: {type: string}
      responses:
        '201':
          description: Transaction created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Transaction'

  /transactions/{id}:
    get:
      summary: Get transaction by ID
      tags: [Transactions]
      security:
        - BearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema: {type: string}
      responses:
        '200':
          description: Transaction details

    patch:
      summary: Update transaction (e.g., change category, add notes)
      tags: [Transactions]
      security:
        - BearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema: {type: string}
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                category: {type: string}
                description: {type: string}
                merchant: {type: string}
      responses:
        '200':
          description: Transaction updated

    delete:
      summary: Delete transaction
      tags: [Transactions]
      security:
        - BearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema: {type: string}
      responses:
        '204':
          description: Transaction deleted

  # ==================== QR Code Parsing ====================
  /qr/parse:
    post:
      summary: Parse Bulgarian receipt QR code
      description: Extracts time and amount from Bulgarian receipt QR format
      tags: [QR Parsing]
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [qrData]
              properties:
                qrData: {type: string}
      responses:
        '200':
          description: QR code parsed successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  amount: {type: number}
                  currency: {type: string}
                  transactionDate: {type: string, format: date-time}
                  merchant: {type: string, nullable: true}
                  success: {type: boolean}
        '400':
          description: Invalid QR format

  # ==================== ML Categorization ====================
  /ml/categorize:
    post:
      summary: Get ML category suggestion for transaction
      description: Returns category suggestion with confidence score (Note - this may be moved to on-device in future)
      tags: [ML]
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                merchant: {type: string}
                amount: {type: number}
                description: {type: string}
      responses:
        '200':
          description: Category suggestion
          content:
            application/json:
              schema:
                type: object
                properties:
                  category: {type: string}
                  confidence: {type: number}

  /ml/feedback:
    post:
      summary: Submit ML categorization feedback
      description: User correction to improve ML model
      tags: [ML]
      security:
        - BearerAuth: []
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                transactionId: {type: string}
                suggestedCategory: {type: string}
                correctedCategory: {type: string}
      responses:
        '204':
          description: Feedback recorded

  # ==================== Locations ====================
  /locations:
    get:
      summary: List user-tagged locations
      tags: [Locations]
      security:
        - BearerAuth: []
      responses:
        '200':
          description: List of locations

    post:
      summary: Tag new location
      tags: [Locations]
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [name, latitude, longitude]
              properties:
                name: {type: string}
                latitude: {type: number}
                longitude: {type: number}
                radiusMeters: {type: integer, default: 100}
      responses:
        '201':
          description: Location created

  /locations/{id}:
    patch:
      summary: Update location (change name, adjust geofence radius, toggle trusted)
      tags: [Locations]
      security:
        - BearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema: {type: string}
      responses:
        '200':
          description: Location updated

    delete:
      summary: Delete tagged location
      tags: [Locations]
      security:
        - BearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema: {type: string}
      responses:
        '204':
          description: Location deleted

  # ==================== Budgets ====================
  /budgets:
    get:
      summary: List user budget goals
      tags: [Budgets]
      security:
        - BearerAuth: []
      responses:
        '200':
          description: List of budgets

    post:
      summary: Create new budget goal
      tags: [Budgets]
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [type, amount, period]
              properties:
                type: {type: string, enum: [monthly_overall, category_specific, treat_yourself]}
                category: {type: string, nullable: true}
                amount: {type: number}
                period: {type: string, enum: [weekly, monthly]}
      responses:
        '201':
          description: Budget created

  /budgets/{id}:
    patch:
      summary: Update budget goal amount
      tags: [Budgets]
      security:
        - BearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema: {type: string}
      responses:
        '200':
          description: Budget updated

  # ==================== Credits ====================
  /credits/balance:
    get:
      summary: Get current credit balance and stats
      tags: [Credits]
      security:
        - BearerAuth: []
      responses:
        '200':
          description: Credit balance
          content:
            application/json:
              schema:
                type: object
                properties:
                  totalCredits: {type: integer}
                  currentCredits: {type: integer}
                  lifetimeScans: {type: integer}
                  streakDays: {type: integer}
                  longestStreak: {type: integer}
                  unlockedFeatures: {type: array, items: {type: string}}

  /credits/transactions:
    get:
      summary: List credit transaction history
      tags: [Credits]
      security:
        - BearerAuth: []
      responses:
        '200':
          description: Credit transaction log

  # ==================== Dashboard & Insights ====================
  /dashboard:
    get:
      summary: Get dashboard data (See screen)
      description: BFF endpoint returning pre-aggregated data for mobile dashboard
      tags: [Dashboard]
      security:
        - BearerAuth: []
      parameters:
        - name: period
          in: query
          schema: {type: string, enum: [week, month], default: week}
      responses:
        '200':
          description: Dashboard data
          content:
            application/json:
              schema:
                type: object
                properties:
                  periodSummary:
                    type: object
                    properties:
                      totalSpent: {type: number}
                      budgetLimit: {type: number}
                      percentUsed: {type: number}
                      daysRemaining: {type: integer}
                  topCategories:
                    type: array
                    items:
                      type: object
                      properties:
                        category: {type: string}
                        spent: {type: number}
                        budget: {type: number}
                        transactionCount: {type: integer}
                  weeklyTrend:
                    type: array
                    items:
                      type: object
                      properties:
                        date: {type: string}
                        amount: {type: number}
                  kashInsight:
                    type: object
                    properties:
                      messageType: {type: string}
                      content: {type: string}

  /insights/spending:
    get:
      summary: Get spending insights and trends
      tags: [Insights]
      security:
        - BearerAuth: []
      responses:
        '200':
          description: Spending insights

  # ==================== Kash Messages ====================
  /kash/messages:
    get:
      summary: Get Kash mascot messages
      tags: [Kash]
      security:
        - BearerAuth: []
      parameters:
        - name: unreadOnly
          in: query
          schema: {type: boolean, default: false}
      responses:
        '200':
          description: List of Kash messages

  /kash/messages/{id}/read:
    post:
      summary: Mark Kash message as read
      tags: [Kash]
      security:
        - BearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema: {type: string}
      responses:
        '204':
          description: Message marked as read

  # ==================== Notifications ====================
  /notifications/register:
    post:
      summary: Register device for push notifications
      tags: [Notifications]
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [fcmToken, platform]
              properties:
                fcmToken: {type: string}
                platform: {type: string, enum: [ios, android]}
      responses:
        '204':
          description: Device registered

  # ==================== Health Check ====================
  /health:
    get:
      summary: Health check endpoint
      tags: [System]
      responses:
        '200':
          description: API is healthy
          content:
            application/json:
              schema:
                type: object
                properties:
                  status: {type: string}
                  timestamp: {type: string}
                  version: {type: string}
```

**Authentication Requirements:**
- All endpoints except `/auth/*` and `/health` require Bearer JWT token
- JWT tokens expire after 15 minutes; use `/auth/refresh` for renewal
- Refresh tokens expire after 30 days

**Error Responses:**
All error responses follow consistent format:
```json
{
  "error": {
    "code": "INVALID_QR_FORMAT",
    "message": "QR code data does not match Bulgarian receipt format",
    "details": {},
    "timestamp": "2025-11-17T10:30:00Z",
    "requestId": "req_abc123"
  }
}
```

Common HTTP status codes:
- `200` OK - Request successful
- `201` Created - Resource created
- `204` No Content - Successful deletion or action with no return value
- `400` Bad Request - Invalid input
- `401` Unauthorized - Missing or invalid token
- `403` Forbidden - Valid token but insufficient permissions
- `404` Not Found - Resource not found
- `409` Conflict - Resource conflict (e.g., duplicate email)
- `429` Too Many Requests - Rate limit exceeded
- `500` Internal Server Error - Server error

---

*[End of Section 2 - Data Models & API Specification]*

## Components

The Kash Budget system is composed of the following major logical components. Each component has clear responsibilities and well-defined interfaces to other components.

### Mobile App (React Native)

**Responsibility:** Primary user interface for iOS and Android devices. Handles QR scanning, offline data access, ML categorization (on-device), GPS geofencing, and user interactions.

**Key Interfaces:**
- REST API client (HTTP/HTTPS to Backend API)
- On-device TensorFlow Lite model for ML categorization
- Device camera API for QR scanning
- GPS/Location Services API for geofencing
- Firebase Cloud Messaging for push notifications
- AsyncStorage/MMKV for local persistence

**Dependencies:**
- Backend API Server (for data sync, authentication, insights)
- Firebase Cloud Messaging (for push notifications)
- Device OS services (camera, GPS, notifications permissions)

**Technology Stack:**
- React Native 0.73+, TypeScript, Redux Toolkit
- react-native-camera (QR scanning)
- react-native-geolocation-service (GPS)
- TensorFlow Lite React Native (ML)
- Redux Persist (offline storage)

---

### API Server (NestJS)

**Responsibility:** Backend RESTful API providing authentication, transaction management, budget calculations, credit system logic, Kash message generation, and user insights.

**Key Interfaces:**
- REST API endpoints (Express/Fastify HTTP server)
- PostgreSQL database connection (TypeORM)
- Redis cache connection
- S3 client (optional receipt images)
- Firebase Admin SDK (push notification sending)

**Dependencies:**
- PostgreSQL Database (data persistence)
- Redis Cache (sessions, credits)
- Amazon S3 (receipt images)
- Firebase Cloud Messaging (notification delivery)

**Technology Stack:**
- NestJS 10.x, TypeScript, Passport.js (auth)
- TypeORM 0.3+ (database ORM)
- ioredis (Redis client)
- AWS SDK (S3)
- Firebase Admin SDK

**Module Structure:**
```
api/src/
├── auth/           # Authentication (Google, Apple, JWT)
├── users/          # User profile management
├── transactions/   # Transaction CRUD and categorization
├── qr/             # QR code parsing (Bulgarian receipts)
├── ml/             # ML feedback collection (on-device categorization)
├── locations/      # Location tagging and geofencing
├── budgets/        # Budget goal management
├── credits/        # Credit system logic
├── dashboard/      # BFF endpoints for mobile screens
├── insights/       # Spending insights and trends
├── kash/           # Kash mascot message generation
├── notifications/  # Push notification handling
└── common/         # Shared utilities, guards, interceptors
```

---

### PostgreSQL Database

**Responsibility:** Primary relational database for all persistent data (users, transactions, budgets, credits, locations).

**Key Interfaces:**
- SQL interface (via TypeORM from API Server)
- Read/write queries, transactions, migrations

**Dependencies:** None (standalone)

**Technology Stack:** PostgreSQL 14+, RDS Multi-AZ (production)

**Schema Summary:**
- `users` table
- `transactions` table
- `categories` table (seed data)
- `locations` table
- `budgets` table
- `credit_balances` table
- `credit_transactions` table
- `kash_messages` table
- `notification_devices` table

---

### Redis Cache

**Responsibility:** In-memory caching for sessions, credit balances, frequently accessed user preferences, and rate limiting.

**Key Interfaces:**
- Redis protocol (via ioredis from API Server)
- Key-value operations, TTL-based expiration

**Dependencies:** None (standalone)

**Technology Stack:** Redis 7.x, ElastiCache (production)

**Cached Data:**
- User sessions (JWT refresh tokens)
- Credit balances (invalidated on credit transactions)
- User preferences (invalidated on profile updates)
- Rate limit counters (per-user, per-endpoint)

---

### Amazon S3 Storage

**Responsibility:** Optional receipt image storage (encrypted at rest).

**Key Interfaces:**
- S3 API (via AWS SDK from API Server)
- Presigned URLs for mobile app uploads

**Dependencies:** None (standalone)

**Technology Stack:** Amazon S3, SSE-S3 encryption

**Bucket Structure:**
```
kash-budget-receipts/
├── {userId}/
│   ├── {transactionId}.jpg
│   └── {transactionId}.png
```

---

### Firebase Cloud Messaging (FCM)

**Responsibility:** Cross-platform push notification delivery to iOS and Android devices.

**Key Interfaces:**
- Firebase Admin SDK (from API Server)
- FCM device token registration

**Dependencies:** None (external SaaS)

**Technology Stack:** Firebase Cloud Messaging

**Notification Types:**
- Budget warning notifications (approaching limit)
- Geofence exit prompts (scan reminder)
- Daily motivation messages (morning check-in)
- Milestone celebrations (streak achievements)

---

### Analytics Service (Amplitude/Mixpanel)

**Responsibility:** Product analytics, user behavior tracking, cohort analysis, and retention metrics.

**Key Interfaces:**
- Mobile SDK (from React Native app)
- Event tracking API

**Dependencies:** None (external SaaS)

**Technology Stack:** Amplitude or Mixpanel SDK

**Tracked Events:**
- QR code scanned
- Transaction created (manual)
- Transaction category corrected
- Budget goal set
- Location tagged
- Geofence exited
- Kash message viewed
- Credit milestone reached

---

### Sentry Error Tracking

**Responsibility:** Real-time error monitoring, crash reporting, and performance monitoring for both mobile app and backend API.

**Key Interfaces:**
- Sentry SDK (React Native for mobile, Node.js for backend)
- Automatic error capture, breadcrumb trails

**Dependencies:** None (external SaaS)

**Technology Stack:** Sentry SaaS

**Monitored Components:**
- Mobile app crashes (iOS/Android)
- Backend API errors (500s, unhandled exceptions)
- Performance monitoring (API response times)

---

### Component Diagrams

#### C4 Container Diagram

```mermaid
C4Container
    title Kash Budget System - Container Diagram

    Person(user, "Kash User", "Mobile app user tracking expenses")

    System_Boundary(kashBudget, "Kash Budget System") {
        Container(mobileApp, "Mobile App", "React Native", "QR scanning, expense tracking, insights")
        Container(apiServer, "API Server", "NestJS", "REST API, business logic, authentication")
        ContainerDb(database, "Database", "PostgreSQL", "User data, transactions, budgets")
        ContainerDb(cache, "Cache", "Redis", "Sessions, credit balances")
        Container(storage, "Storage", "Amazon S3", "Receipt images")
    }

    System_Ext(fcm, "Firebase Cloud Messaging", "Push notifications")
    System_Ext(analytics, "Amplitude", "Product analytics")
    System_Ext(sentry, "Sentry", "Error tracking")

    Rel(user, mobileApp, "Uses", "HTTPS")
    Rel(mobileApp, apiServer, "API calls", "HTTPS/JSON")
    Rel(mobileApp, fcm, "Registers for notifications")
    Rel(mobileApp, analytics, "Sends events")
    Rel(mobileApp, sentry, "Sends errors")

    Rel(apiServer, database, "Reads/writes", "SQL")
    Rel(apiServer, cache, "Reads/writes", "Redis protocol")
    Rel(apiServer, storage, "Uploads", "S3 API")
    Rel(apiServer, fcm, "Sends notifications", "Firebase Admin SDK")
    Rel(apiServer, sentry, "Sends errors")

    UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
```

---

## External APIs

### Bulgarian Receipt QR Code Format

**Purpose:** Parse QR codes from Bulgarian receipts to extract transaction time and amount.

**Documentation:** Bulgarian National Revenue Agency (NRA) fiscal receipt standards

**Base URL:** N/A (QR data is self-contained, no external API call needed)

**Authentication:** Not applicable

**Rate Limits:** N/A

**Key Endpoints Used:**
- N/A (parsing is done on-device or server-side from QR string)

**Integration Notes:**

Bulgarian receipt QR codes contain fiscal data in a specific format. The QR string typically includes:
- Receipt timestamp (date and time)
- Total amount
- Merchant tax ID
- Receipt serial number
- Optional: Merchant name

**Example QR Data:**
```
FD:2025111712345678
DT:2025-11-17T14:30:00
AM:45.00
CU:BGN
TN:BG123456789
MN:Kaufland Bulgaria
```

**Parsing Logic:**
```typescript
interface BulgarianReceiptQR {
  fiscalDeviceId: string;
  transactionDate: Date;
  amount: number;
  currency: string;
  merchantTaxId: string;
  merchantName?: string;
}

function parseBulgarianQR(qrData: string): BulgarianReceiptQR {
  // Split QR string by newlines
  const lines = qrData.split('\n');
  const data: any = {};
  
  lines.forEach(line => {
    const [key, value] = line.split(':');
    data[key] = value;
  });
  
  return {
    fiscalDeviceId: data.FD,
    transactionDate: new Date(data.DT),
    amount: parseFloat(data.AM),
    currency: data.CU || 'BGN',
    merchantTaxId: data.TN,
    merchantName: data.MN
  };
}
```

**Error Handling:**
- Invalid QR format → Return error to user with option to manual entry
- Missing required fields (amount, date) → Prompt user to fill manually
- Future-proof: Support multiple QR formats as standards evolve

---

### GPS Geofencing

**Purpose:** Detect when user exits a tagged location and trigger scan reminder notification.

**Documentation:** React Native Geolocation Service

**Implementation:** On-device geofencing using native iOS/Android location services

**Key Features:**
- Circular geofences (radius 50-200 meters)
- Background location updates (battery-optimized)
- Geofence enter/exit events
- Permission handling (location always/when-in-use)

**Integration Notes:**

```typescript
import Geolocation from 'react-native-geolocation-service';

// Register geofence
async function registerGeofence(location: Location) {
  const geofenceOptions = {
    identifier: location.id,
    latitude: location.latitude,
    longitude: location.longitude,
    radius: location.radiusMeters,
    notifyOnEntry: false,  // Don't notify on entry
    notifyOnExit: true,    // Notify on exit
    notifyOnDwell: false
  };
  
  await Geolocation.startGeofencing(geofenceOptions);
}

// Handle geofence exit event
function onGeofenceExit(locationId: string) {
  // Trigger local notification: "Did you make a purchase at Kaufland? Tap to scan receipt."
  // Options: Scan Receipt / Enter Amount / Skip
}
```

**Battery Optimization:**
- Use significant location changes (not continuous tracking)
- Geofence radius minimum 50m (smaller = more battery drain)
- Defer background updates when battery low

---

### Firebase Cloud Messaging (FCM)

**Purpose:** Send push notifications to iOS and Android devices for budget alerts, geofence prompts, and Kash messages.

**Documentation:** https://firebase.google.com/docs/cloud-messaging

**Base URL:** `https://fcm.googleapis.com/v1/projects/{project-id}/messages:send`

**Authentication:** Firebase service account key (server-side), device FCM tokens (mobile)

**Rate Limits:** 
- 1 million messages per project per day (free tier)
- 3000 messages per second burst

**Key Endpoints Used:**
- `POST /v1/projects/{project-id}/messages:send` - Send notification to device token or topic

**Integration Notes:**

**Device Token Registration (Mobile):**
```typescript
import messaging from '@react-native-firebase/messaging';

async function registerForNotifications() {
  const fcmToken = await messaging().getToken();
  
  // Send token to backend
  await api.post('/notifications/register', {
    fcmToken,
    platform: Platform.OS // 'ios' or 'android'
  });
}
```

**Send Notification (Backend):**
```typescript
import * as admin from 'firebase-admin';

async function sendBudgetWarning(userId: string, category: string, percentUsed: number) {
  const userDevice = await getUserFCMToken(userId);
  
  const message = {
    token: userDevice.fcmToken,
    notification: {
      title: '⚠️ Budget Alert',
      body: `You've used ${percentUsed}% of your ${category} budget. Watch your spending!`
    },
    data: {
      type: 'budget_warning',
      category,
      userId
    },
    apns: {
      payload: {
        aps: {
          sound: 'default',
          badge: 1
        }
      }
    }
  };
  
  await admin.messaging().send(message);
}
```

**Notification Types:**
- Budget warning: Approaching category budget limit (85%)
- Geofence exit: Prompt to scan receipt after leaving tagged location
- Daily motivation: Morning check-in from Kash
- Milestone celebration: Streak achievements, credit unlocks

---

### Amplitude/Mixpanel Analytics

**Purpose:** Track product metrics, user retention, feature usage, and cohort analysis.

**Documentation:**
- Amplitude: https://developers.amplitude.com/
- Mixpanel: https://developer.mixpanel.com/

**Authentication:** API key (mobile SDK)

**Rate Limits:** 
- Amplitude: 1000 events per second
- Mixpanel: No hard limit (fair use)

**Key Events Tracked:**

```typescript
import { Amplitude } from '@amplitude/react-native';

// User events
Amplitude.track('QR Code Scanned', {
  source: 'camera',
  scanDuration: 1.2,
  success: true
});

Amplitude.track('Transaction Created', {
  amount: 45.00,
  category: 'Food & Groceries',
  source: 'qr_scan',
  autoCategorized: true,
  mlConfidence: 0.95
});

Amplitude.track('Budget Goal Set', {
  type: 'category_specific',
  category: 'Dining Out',
  amount: 100
});

Amplitude.track('Location Tagged', {
  visitCount: 1,
  geofenceEnabled: true
});

Amplitude.track('Credit Milestone Reached', {
  milestone: '50_scans',
  totalCredits: 275
});
```

**Integration Notes:**
- Track all user actions (not just transactions)
- User properties: signup date, streak days, onboarding completed
- Revenue tracking for future premium features
- Cohort analysis: retention by signup date, streak lengths

---

## Core Workflows

### QR Scan → Transaction Creation

**User Goal:** Scan receipt QR code to automatically create transaction

**Entry Points:** 
- Scan screen (primary action)
- Geofence exit notification (tap to scan)

**Success Criteria:** Transaction created in < 2 seconds from QR scan

```mermaid
sequenceDiagram
    actor User
    participant MobileApp
    participant Camera
    participant QRParser
    participant MLModel
    participant API
    participant Database

    User->>MobileApp: Taps "Scan Receipt" button
    MobileApp->>Camera: Opens camera with QR detection
    Camera-->>MobileApp: QR code detected
    MobileApp->>QRParser: Parse Bulgarian QR format
    QRParser-->>MobileApp: {amount: 45, date: 2025-11-17T14:30, merchant: "Kaufland"}
    
    MobileApp->>MLModel: Categorize (merchant: "Kaufland", amount: 45)
    MLModel-->>MobileApp: {category: "Food & Groceries", confidence: 0.95}
    
    MobileApp->>MobileApp: Display transaction preview
    User->>MobileApp: Confirms transaction
    
    MobileApp->>API: POST /transactions {amount, category, qrData, ...}
    API->>Database: INSERT INTO transactions
    Database-->>API: Transaction created (ID: abc123)
    API->>API: Award credits (+5 for scan)
    API-->>MobileApp: {transaction: {...}, creditsEarned: 5}
    
    MobileApp->>MobileApp: Show success animation + Kash celebration
    MobileApp->>User: "Great job! +5 credits earned"
```

**Edge Cases & Error Handling:**
- Invalid QR format → Show error, offer manual entry
- ML low confidence (< 0.7) → Prompt user to select category
- Network failure → Queue transaction locally, sync when online
- Duplicate QR (same QR within 5 minutes) → Warn user, ask to confirm

**Notes:** QR parsing happens on-device for speed. ML categorization also on-device (TensorFlow Lite) for privacy.

---

### User Registration & Authentication

**User Goal:** Sign up for Kash Budget using Google or Apple account

**Entry Points:**
- App launch (first time)
- Login screen

**Success Criteria:** User authenticated and redirected to onboarding

```mermaid
sequenceDiagram
    actor User
    participant MobileApp
    participant GoogleAuth
    participant API
    participant Database
    participant Redis

    User->>MobileApp: Taps "Sign in with Google"
    MobileApp->>GoogleAuth: Initiate OAuth flow
    GoogleAuth-->>User: Google login prompt
    User->>GoogleAuth: Enters credentials
    GoogleAuth-->>MobileApp: ID token
    
    MobileApp->>API: POST /auth/google {idToken}
    API->>GoogleAuth: Verify ID token
    GoogleAuth-->>API: Token valid, user profile
    
    API->>Database: Check if user exists (by email)
    alt New User
        Database-->>API: User not found
        API->>Database: INSERT INTO users {...}
        API->>Database: INSERT INTO credit_balances (initial: 0 credits)
        Database-->>API: User created
    else Existing User
        Database-->>API: User found
    end
    
    API->>API: Generate JWT access token (15 min expiry)
    API->>API: Generate refresh token (30 day expiry)
    API->>Redis: Store refresh token (30 day TTL)
    API-->>MobileApp: {accessToken, refreshToken, user}
    
    MobileApp->>MobileApp: Store tokens in secure storage (Keychain/KeyStore)
    
    alt First time user
        MobileApp->>User: Navigate to onboarding flow
    else Returning user
        MobileApp->>User: Navigate to Scan screen
    end
```

**Edge Cases & Error Handling:**
- OAuth cancelled → Return to login screen
- Invalid token → Show error, retry
- Network failure → Show offline message
- Account already exists with different provider → Suggest account linking

**Notes:** JWT access tokens are short-lived (15 min). Mobile app auto-refreshes using refresh token before expiry.

---

### Location Geofencing Workflow

**User Goal:** Get reminded to scan receipt when leaving a frequent spending location

**Entry Points:**
- User tags location (after 2+ visits detected)
- Background geofence monitoring

**Success Criteria:** Notification appears within 30 seconds of exit

```mermaid
sequenceDiagram
    actor User
    participant MobileApp
    participant Geofencing
    participant API
    participant FCM
    participant User as UserDevice

    Note over User,API: Part 1: Location Tagging
    
    User->>MobileApp: Visits Kaufland (GPS: 42.6977, 23.3219)
    MobileApp->>API: POST /transactions {locationCoords: ...}
    API->>API: Detect 2nd visit to same coordinates
    API-->>MobileApp: Suggestion: "Tag this as 'Kaufland'?"
    User->>MobileApp: Confirms tag
    MobileApp->>API: POST /locations {name: "Kaufland", lat, lng, radius: 100m}
    API-->>MobileApp: Location created
    
    MobileApp->>Geofencing: Register geofence (lat, lng, radius)
    Geofencing-->>MobileApp: Geofence active
    
    Note over User,UserDevice: Part 2: Geofence Exit Detection
    
    User->>User: Leaves Kaufland (exits 100m radius)
    Geofencing->>MobileApp: Geofence exit event (locationId)
    
    alt Foreground
        MobileApp->>User: Show local notification immediately
    else Background
        MobileApp->>MobileApp: Schedule local notification
        MobileApp->>API: POST /geofence/exit {locationId}
        API->>FCM: Send push notification
        FCM-->>UserDevice: "Did you make a purchase at Kaufland?"
        UserDevice-->>User: Push notification with actions
    end
    
    User->>UserDevice: Taps "Scan Receipt"
    UserDevice->>MobileApp: Opens app to QR scanner
    
    Note over User,MobileApp: User proceeds with QR scan workflow
```

**Edge Cases & Error Handling:**
- GPS permission denied → Disable geofencing, show warning
- Location services off → Notify user, prompt to enable
- Battery saver mode → Geofence updates deferred (acceptable)
- Multiple geofence exits in short time → Debounce notifications (max 1 per 15 min)

**Notes:** Geofencing is battery-optimized using significant location changes (not continuous tracking). Background location permission required (iOS: "Always", Android: "Allow all the time").

---

### ML Categorization Feedback Loop

**User Goal:** Correct auto-categorized transaction to improve ML accuracy

**Entry Points:**
- Transaction detail screen (tap category to edit)
- Recent transactions list (swipe to edit)

**Success Criteria:** ML model improves accuracy over time based on user corrections

```mermaid
sequenceDiagram
    actor User
    participant MobileApp
    participant MLModel
    participant API
    participant Database
    participant MLTraining

    Note over User,MLTraining: Scenario: User corrects ML category
    
    User->>MobileApp: Scans receipt (merchant: "Billa")
    MobileApp->>MLModel: Categorize("Billa", 32.50)
    MLModel-->>MobileApp: {category: "Shopping", confidence: 0.72}
    MobileApp->>MobileApp: Auto-categorize as "Shopping"
    MobileApp->>API: POST /transactions {..., category: "Shopping", autoCategorized: true}
    API-->>MobileApp: Transaction created
    
    User->>MobileApp: Views transaction, sees wrong category
    User->>MobileApp: Taps category → Selects "Food & Groceries"
    MobileApp->>API: PATCH /transactions/{id} {category: "Food & Groceries"}
    API->>Database: UPDATE transactions SET category = "Food & Groceries"
    
    API->>API: Record ML feedback
    API->>Database: INSERT INTO ml_feedback {suggestedCategory: "Shopping", correctedCategory: "Food & Groceries", merchant: "Billa"}
    
    Note over API,MLTraining: Async: Model Retraining (weekly batch)
    
    API->>MLTraining: Export ml_feedback table
    MLTraining->>MLTraining: Retrain model with user corrections
    MLTraining->>MLTraining: Export updated TFLite model
    MLTraining->>API: Upload new model version
    
    API->>MobileApp: Push notification: "ML model updated! Try scanning."
    MobileApp->>MobileApp: Download new TFLite model
    
    Note over User,MobileApp: Next scan of "Billa"
    
    User->>MobileApp: Scans receipt (merchant: "Billa")
    MobileApp->>MLModel: Categorize("Billa", 28.00)
    MLModel-->>MobileApp: {category: "Food & Groceries", confidence: 0.91}
    MobileApp->>User: Correct category! 🎉
```

**Edge Cases & Error Handling:**
- User corrects multiple times → Track correction history
- Conflicting corrections (user changes back and forth) → Use most recent
- ML confidence very low (< 0.5) → Skip auto-categorization, prompt user

**Notes:** ML model retraining happens server-side weekly. TFLite model is versioned and pushed to mobile apps. On-device inference ensures privacy (transaction data never sent to server for categorization).

---

*[End of Section 3 - Components & Integration]*

## Database Schema

### PostgreSQL Schema Design

The following SQL DDL defines the complete database schema for Kash Budget. All tables use UUIDs for primary keys, timestamps for audit trails, and appropriate indexes for query performance.

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================== Users Table ====================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  auth_provider VARCHAR(50) NOT NULL CHECK (auth_provider IN ('google', 'apple', 'email')),
  auth_provider_id VARCHAR(255), -- Provider's user ID
  profile_photo_url TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  streak_days INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT users_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_auth_provider_id ON users(auth_provider, auth_provider_id);

-- ==================== User Preferences (JSONB column) ====================
ALTER TABLE users ADD COLUMN preferences JSONB DEFAULT '{
  "currency": "BGN",
  "language": "en",
  "notificationsEnabled": true,
  "geofencingEnabled": true,
  "monthlyBudget": null,
  "treatYourselfBudget": null,
  "categoryBudgets": {}
}'::jsonb;

-- ==================== Categories Table ====================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(50) NOT NULL,
  color VARCHAR(7) NOT NULL, -- Hex color code
  is_default BOOLEAN DEFAULT FALSE,
  is_treat_yourself BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- NULL for default categories
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_user_id ON categories(user_id);

-- Seed default categories
INSERT INTO categories (id, name, icon, color, is_default, is_treat_yourself, user_id) VALUES
  (uuid_generate_v4(), 'Food & Groceries', '🛒', '#06D6A0', TRUE, FALSE, NULL),
  (uuid_generate_v4(), 'Dining Out', '☕', '#EF476F', TRUE, FALSE, NULL),
  (uuid_generate_v4(), 'Transportation', '🚗', '#FFB703', TRUE, FALSE, NULL),
  (uuid_generate_v4(), 'Entertainment', '🎬', '#8338EC', TRUE, FALSE, NULL),
  (uuid_generate_v4(), 'Shopping', '👕', '#FF006E', TRUE, FALSE, NULL),
  (uuid_generate_v4(), 'Bills & Utilities', '🏠', '#118AB2', TRUE, FALSE, NULL),
  (uuid_generate_v4(), 'Healthcare', '🏥', '#FB5607', TRUE, FALSE, NULL),
  (uuid_generate_v4(), 'Other', '💼', '#ADB5BD', TRUE, FALSE, NULL),
  (uuid_generate_v4(), 'Treat Yourself', '🎉', '#9D4EDD', TRUE, TRUE, NULL);

-- ==================== Locations Table ====================
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  radius_meters INTEGER DEFAULT 100 CHECK (radius_meters >= 50 AND radius_meters <= 500),
  visit_count INTEGER DEFAULT 0,
  total_spent DECIMAL(12, 2) DEFAULT 0.00,
  is_trusted_location BOOLEAN DEFAULT FALSE,
  is_high_spend_alert BOOLEAN DEFAULT FALSE,
  last_visit TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_locations_user_id ON locations(user_id);
CREATE INDEX idx_locations_coords ON locations(latitude, longitude);

-- ==================== Transactions Table ====================
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'BGN',
  category VARCHAR(100) NOT NULL,
  merchant VARCHAR(255),
  description TEXT,
  transaction_date TIMESTAMP WITH TIME ZONE NOT NULL,
  source VARCHAR(50) NOT NULL CHECK (source IN ('qr_scan', 'manual_entry')),
  qr_data TEXT, -- Raw QR code string
  location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
  auto_categorized BOOLEAN DEFAULT FALSE,
  ml_confidence DECIMAL(3, 2), -- 0.00 to 1.00
  receipt_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_user_date ON transactions(user_id, transaction_date DESC);
CREATE INDEX idx_transactions_category ON transactions(category);
CREATE INDEX idx_transactions_location_id ON transactions(location_id);

-- ==================== Budgets Table ====================
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('monthly_overall', 'category_specific', 'treat_yourself')),
  category VARCHAR(100), -- NULL for overall budget
  amount DECIMAL(12, 2) NOT NULL,
  period VARCHAR(20) DEFAULT 'monthly' CHECK (period IN ('weekly', 'monthly')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT budgets_category_check CHECK ((type = 'monthly_overall' AND category IS NULL) OR (type != 'monthly_overall' AND category IS NOT NULL))
);

CREATE INDEX idx_budgets_user_id ON budgets(user_id);
CREATE INDEX idx_budgets_user_active ON budgets(user_id, is_active);

-- ==================== Credit Balances Table ====================
CREATE TABLE credit_balances (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  total_credits INTEGER DEFAULT 0,
  current_credits INTEGER DEFAULT 0,
  lifetime_scans INTEGER DEFAULT 0,
  last_scan_date TIMESTAMP WITH TIME ZONE,
  streak_days INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  unlocked_features TEXT[] DEFAULT '{}', -- Array of feature IDs
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==================== Credit Transactions Table ====================
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- Positive for earnings, negative for spending
  type VARCHAR(50) NOT NULL CHECK (type IN ('scan', 'streak_bonus', 'milestone', 'feature_unlock')),
  description VARCHAR(255) NOT NULL,
  related_entity_id UUID, -- ID of transaction, achievement, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_created ON credit_transactions(created_at DESC);

-- ==================== Kash Messages Table ====================
CREATE TABLE kash_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message_type VARCHAR(50) NOT NULL CHECK (message_type IN ('greeting', 'motivation', 'celebration', 'warning', 'tip')),
  content TEXT NOT NULL,
  trigger VARCHAR(100) NOT NULL, -- Event that triggered message
  is_read BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_kash_messages_user_unread ON kash_messages(user_id, is_read);
CREATE INDEX idx_kash_messages_expires ON kash_messages(expires_at);

-- ==================== Notification Devices Table ====================
CREATE TABLE notification_devices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  fcm_token VARCHAR(255) NOT NULL UNIQUE,
  platform VARCHAR(20) NOT NULL CHECK (platform IN ('ios', 'android')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notification_devices_user_id ON notification_devices(user_id);
CREATE INDEX idx_notification_devices_fcm_token ON notification_devices(fcm_token);

-- ==================== ML Feedback Table (for model improvement) ====================
CREATE TABLE ml_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
  suggested_category VARCHAR(100) NOT NULL,
  corrected_category VARCHAR(100) NOT NULL,
  merchant VARCHAR(255),
  amount DECIMAL(12, 2),
  ml_confidence DECIMAL(3, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ml_feedback_created ON ml_feedback(created_at DESC);

-- ==================== Refresh Tokens Table (for JWT refresh) ====================
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(64) NOT NULL UNIQUE, -- SHA-256 hash of refresh token
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires ON refresh_tokens(expires_at);

-- ==================== Triggers for updated_at ====================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON budgets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_credit_balances_updated_at BEFORE UPDATE ON credit_balances FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

**Schema Notes:**
- All tables use UUID primary keys for distributed ID generation
- JSONB columns for flexible user preferences
- Indexes on foreign keys and frequently queried columns
- CHECK constraints for data integrity (enum values, email format)
- Cascading deletes for user data cleanup
- Triggers for automatic `updated_at` timestamp updates

---

## Frontend Architecture (React Native)

### Component Organization

```
apps/mobile/src/
├── components/              # Reusable UI components
│   ├── atoms/               # Atomic design: smallest components
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.styles.ts
│   │   │   └── Button.test.tsx
│   │   ├── Badge/
│   │   ├── Icon/
│   │   ├── Text/
│   │   └── Input/
│   ├── molecules/           # Composite components
│   │   ├── TransactionCard/
│   │   ├── CategoryBadge/
│   │   ├── ProgressBar/
│   │   ├── KashInsightCard/
│   │   └── ScanButton/
│   ├── organisms/           # Complex UI sections
│   │   ├── TransactionList/
│   │   ├── CategoryPicker/
│   │   ├── BudgetGoalCard/
│   │   ├── LocationMap/
│   │   └── OnboardingSlide/
│   └── templates/           # Page layouts
│       ├── ScreenLayout/
│       └── ModalLayout/
├── screens/                 # Screen components (pages)
│   ├── Onboarding/
│   │   ├── WelcomeScreen.tsx
│   │   ├── QRExplanationScreen.tsx
│   │   ├── PhilosophyScreen.tsx
│   │   └── PermissionsScreen.tsx
│   ├── Scan/
│   │   ├── ScanScreen.tsx
│   │   └── QRScannerView.tsx
│   ├── See/
│   │   ├── SeeScreen.tsx (Dashboard)
│   │   └── CategoryDetailScreen.tsx
│   ├── Save/
│   │   ├── SaveScreen.tsx (Goals & Progress)
│   │   ├── BudgetEditScreen.tsx
│   │   └── AchievementsScreen.tsx
│   ├── Transaction/
│   │   ├── TransactionDetailScreen.tsx
│   │   └── ManualEntryScreen.tsx
│   ├── Location/
│   │   ├── LocationManagementScreen.tsx
│   │   └── LocationTagScreen.tsx
│   └── Settings/
│       ├── SettingsScreen.tsx
│       └── ProfileEditScreen.tsx
├── navigation/              # React Navigation setup
│   ├── RootNavigator.tsx    # Tab + Stack navigation
│   ├── AuthNavigator.tsx    # Auth flow (login, onboarding)
│   └── types.ts             # Navigation types
├── hooks/                   # Custom React hooks
│   ├── useAuth.ts           # Authentication state and methods
│   ├── useTransactions.ts   # Transaction CRUD
│   ├── useBudgets.ts        # Budget management
│   ├── useCredits.ts        # Credit balance
│   ├── useGeofencing.ts     # Geofence setup and monitoring
│   └── useMLCategorization.ts # On-device ML inference
├── services/                # API client and external integrations
│   ├── api/
│   │   ├── apiClient.ts     # Axios instance with auth interceptors
│   │   ├── auth.ts          # Auth endpoints
│   │   ├── transactions.ts  # Transaction endpoints
│   │   ├── budgets.ts
│   │   ├── locations.ts
│   │   ├── credits.ts
│   │   └── dashboard.ts
│   ├── ml/
│   │   └── categorizer.ts   # TensorFlow Lite model wrapper
│   ├── qr/
│   │   └── parser.ts        # Bulgarian QR parsing logic
│   ├── geofencing/
│   │   └── geofenceManager.ts # Geofence registration and monitoring
│   └── analytics/
│       └── amplitude.ts     # Analytics event tracking
├── store/                   # Redux Toolkit state management
│   ├── index.ts             # Store configuration
│   ├── slices/
│   │   ├── authSlice.ts     # Auth state (user, tokens)
│   │   ├── transactionsSlice.ts # Transactions state
│   │   ├── budgetsSlice.ts
│   │   ├── creditsSlice.ts
│   │   ├── locationsSlice.ts
│   │   └── uiSlice.ts       # UI state (modals, loading)
│   └── middleware/
│       └── offlineSync.ts   # Queue actions when offline
├── theme/                   # Design system tokens
│   ├── colors.ts            # Color palette from UI spec
│   ├── typography.ts        # Font sizes, weights
│   ├── spacing.ts           # 8px grid spacing scale
│   └── theme.ts             # Combined theme object
├── utils/                   # Utility functions
│   ├── formatters.ts        # Currency, date formatting
│   ├── validators.ts        # Input validation
│   └── constants.ts         # App constants
├── types/                   # TypeScript type definitions
│   └── index.ts             # Re-export from packages/shared
└── App.tsx                  # Root component
```

### Component Template

**Example: PrimaryButton Component**

```typescript
// components/atoms/Button/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../../../theme';

export interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'destructive';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  testID?: string;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  testID,
}) => {
  const buttonStyle = [
    styles.button,
    fullWidth && styles.fullWidth,
    variant === 'primary' && styles.primaryButton,
    variant === 'secondary' && styles.secondaryButton,
    variant === 'destructive' && styles.destructiveButton,
    (disabled || loading) && styles.disabledButton,
  ];

  const textStyle = [
    styles.text,
    variant === 'primary' && styles.primaryText,
    variant === 'secondary' && styles.secondaryText,
    variant === 'destructive' && styles.destructiveText,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' ? colors.primary : colors.white} />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text style={textStyle}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  fullWidth: {
    width: '100%',
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  destructiveButton: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.error,
  },
  disabledButton: {
    opacity: 0.5,
  },
  text: {
    ...typography.h4,
    marginLeft: spacing.xs,
  },
  primaryText: {
    color: colors.white,
  },
  secondaryText: {
    color: colors.primary,
  },
  destructiveText: {
    color: colors.error,
  },
});
```

### State Management Architecture

**Redux Toolkit Structure:**

```typescript
// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import authReducer from './slices/authSlice';
import transactionsReducer from './slices/transactionsSlice';
import budgetsReducer from './slices/budgetsSlice';
import creditsReducer from './slices/creditsSlice';
import locationsReducer from './slices/locationsSlice';
import uiReducer from './slices/uiSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'transactions', 'budgets'], // Persist these slices
};

const persistedReducer = persistReducer(persistConfig, combineReducers({
  auth: authReducer,
  transactions: transactionsReducer,
  budgets: budgetsReducer,
  credits: creditsReducer,
  locations: locationsReducer,
  ui: uiReducer,
}));

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

**Example Slice:**

```typescript
// store/slices/transactionsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Transaction } from '@kash-budget/shared/types';
import { transactionsApi } from '../../services/api/transactions';

interface TransactionsState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}

const initialState: TransactionsState = {
  transactions: [],
  loading: false,
  error: null,
  pagination: { total: 0, limit: 50, offset: 0 },
};

export const fetchTransactions = createAsyncThunk(
  'transactions/fetch',
  async (params: { startDate?: Date; endDate?: Date; category?: string }) => {
    const response = await transactionsApi.getTransactions(params);
    return response.data;
  }
);

export const createTransaction = createAsyncThunk(
  'transactions/create',
  async (transaction: Partial<Transaction>) => {
    const response = await transactionsApi.createTransaction(transaction);
    return response.data;
  }
);

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action: PayloadAction<{ data: Transaction[]; pagination: any }>) => {
        state.loading = false;
        state.transactions = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch transactions';
      })
      .addCase(createTransaction.fulfilled, (state, action: PayloadAction<Transaction>) => {
        state.transactions.unshift(action.payload); // Add to beginning
      });
  },
});

export const { clearError } = transactionsSlice.actions;
export default transactionsSlice.reducer;
```

### Routing Architecture

**React Navigation Setup:**

```typescript
// navigation/RootNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

import { ScanScreen } from '../screens/Scan/ScanScreen';
import { SeeScreen } from '../screens/See/SeeScreen';
import { SaveScreen } from '../screens/Save/SaveScreen';
import { TransactionDetailScreen } from '../screens/Transaction/TransactionDetailScreen';
import { AuthNavigator } from './AuthNavigator';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.neutral500,
      headerShown: false,
    }}
  >
    <Tab.Screen
      name="Scan"
      component={ScanScreen}
      options={{
        tabBarIcon: ({ color, size }) => <Icon name="qrcode-scan" size={size} color={color} />,
      }}
    />
    <Tab.Screen
      name="See"
      component={SeeScreen}
      options={{
        tabBarIcon: ({ color, size }) => <Icon name="chart-bar" size={size} color={color} />,
      }}
    />
    <Tab.Screen
      name="Save"
      component={SaveScreen}
      options={{
        tabBarIcon: ({ color, size }) => <Icon name="piggy-bank" size={size} color={color} />,
      }}
    />
  </Tab.Navigator>
);

export const RootNavigator = () => {
  const { isAuthenticated, onboardingCompleted } = useSelector((state: RootState) => state.auth);

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        <AuthNavigator />
      ) : !onboardingCompleted ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
          <Stack.Screen name="TransactionDetail" component={TransactionDetailScreen} />
          <Stack.Screen name="CategoryPicker" component={CategoryPickerScreen} options={{ presentation: 'modal' }} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};
```

### API Client Setup

```typescript
// services/api/apiClient.ts
import axios, { AxiosInstance, AxiosError } from 'axios';
import { store } from '../../store';
import { logout, refreshAccessToken } from '../../store/slices/authSlice';
import Config from 'react-native-config';

const API_BASE_URL = Config.API_BASE_URL || 'http://localhost:3000/api/v1';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const { accessToken } = store.getState().auth;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle 401 and refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await store.dispatch(refreshAccessToken()).unwrap();
        return apiClient(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

---

## Backend Architecture (NestJS)

### Service Architecture

**Controller/Route Organization:**

```
apps/api/src/
├── main.ts                  # Application entry point
├── app.module.ts            # Root module
├── common/                  # Shared utilities
│   ├── decorators/
│   │   ├── current-user.decorator.ts
│   │   └── public.decorator.ts
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   ├── interceptors/
│   │   ├── logging.interceptor.ts
│   │   └── transform.interceptor.ts
│   ├── filters/
│   │   └── http-exception.filter.ts
│   ├── pipes/
│   │   └── validation.pipe.ts
│   └── middleware/
│       ├── logger.middleware.ts
│       └── rate-limit.middleware.ts
├── config/                  # Configuration
│   ├── database.config.ts
│   ├── redis.config.ts
│   ├── jwt.config.ts
│   └── aws.config.ts
├── auth/                    # Authentication module
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── strategies/
│   │   ├── jwt.strategy.ts
│   │   ├── google.strategy.ts
│   │   └── apple.strategy.ts
│   └── dto/
│       ├── login.dto.ts
│       └── register.dto.ts
├── users/                   # User management module
│   ├── users.module.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── users.repository.ts
│   ├── entities/
│   │   └── user.entity.ts
│   └── dto/
│       ├── create-user.dto.ts
│       └── update-user.dto.ts
├── transactions/            # Transactions module
│   ├── transactions.module.ts
│   ├── transactions.controller.ts
│   ├── transactions.service.ts
│   ├── transactions.repository.ts
│   ├── entities/
│   │   └── transaction.entity.ts
│   └── dto/
│       ├── create-transaction.dto.ts
│       └── update-transaction.dto.ts
├── qr/                      # QR parsing module
│   ├── qr.module.ts
│   ├── qr.controller.ts
│   ├── qr.service.ts
│   └── parsers/
│       └── bulgarian-receipt.parser.ts
├── ml/                      # ML feedback module
│   ├── ml.module.ts
│   ├── ml.controller.ts
│   ├── ml.service.ts
│   └── dto/
│       └── ml-feedback.dto.ts
├── locations/               # Locations module
│   ├── locations.module.ts
│   ├── locations.controller.ts
│   ├── locations.service.ts
│   ├── locations.repository.ts
│   └── entities/
│       └── location.entity.ts
├── budgets/                 # Budgets module
│   ├── budgets.module.ts
│   ├── budgets.controller.ts
│   ├── budgets.service.ts
│   ├── budgets.repository.ts
│   └── entities/
│       └── budget.entity.ts
├── credits/                 # Credits system module
│   ├── credits.module.ts
│   ├── credits.controller.ts
│   ├── credits.service.ts
│   ├── credits.repository.ts
│   ├── entities/
│   │   ├── credit-balance.entity.ts
│   │   └── credit-transaction.entity.ts
│   └── strategies/
│       └── credit-calculator.ts
├── dashboard/               # BFF dashboard module
│   ├── dashboard.module.ts
│   ├── dashboard.controller.ts
│   └── dashboard.service.ts
├── insights/                # Insights module
│   ├── insights.module.ts
│   ├── insights.controller.ts
│   └── insights.service.ts
├── kash/                    # Kash messages module
│   ├── kash.module.ts
│   ├── kash.controller.ts
│   ├── kash.service.ts
│   ├── entities/
│   │   └── kash-message.entity.ts
│   └── message-templates/
│       └── templates.ts
├── notifications/           # Notifications module
│   ├── notifications.module.ts
│   ├── notifications.controller.ts
│   ├── notifications.service.ts
│   └── entities/
│       └── notification-device.entity.ts
└── database/                # Database migrations
    └── migrations/
        └── 1700000000000-InitialSchema.ts
```

### Controller Template

**Example: Transactions Controller**

```typescript
// transactions/transactions.controller.ts
import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionQueryDto } from './dto/transaction-query.dto';
import { User } from '../users/entities/user.entity';

@ApiTags('transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @ApiOperation({ summary: 'List user transactions' })
  @ApiResponse({ status: 200, description: 'Transactions retrieved successfully' })
  async findAll(@CurrentUser() user: User, @Query() query: TransactionQueryDto) {
    const { data, pagination } = await this.transactionsService.findAll(user.id, query);
    return { data, pagination };
  }

  @Post()
  @ApiOperation({ summary: 'Create new transaction from QR scan or manual entry' })
  @ApiResponse({ status: 201, description: 'Transaction created successfully' })
  async create(@CurrentUser() user: User, @Body() createDto: CreateTransactionDto) {
    const transaction = await this.transactionsService.create(user.id, createDto);
    
    // Award credits for scan
    if (createDto.source === 'qr_scan') {
      await this.creditsService.awardScanCredits(user.id, transaction.id);
    }
    
    return transaction;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get transaction by ID' })
  async findOne(@CurrentUser() user: User, @Param('id') id: string) {
    return this.transactionsService.findOne(user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update transaction (e.g., change category)' })
  async update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() updateDto: UpdateTransactionDto
  ) {
    return this.transactionsService.update(user.id, id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete transaction' })
  @ApiResponse({ status: 204, description: 'Transaction deleted successfully' })
  async remove(@CurrentUser() user: User, @Param('id') id: string) {
    await this.transactionsService.remove(user.id, id);
  }
}
```

### Repository Pattern (Data Access Layer)

```typescript
// transactions/transactions.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { TransactionQueryDto } from './dto/transaction-query.dto';

@Injectable()
export class TransactionsRepository {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>
  ) {}

  async findByUserId(userId: string, query: TransactionQueryDto): Promise<[Transaction[], number]> {
    const { startDate, endDate, category, limit = 50, offset = 0 } = query;

    const queryBuilder = this.transactionRepo
      .createQueryBuilder('transaction')
      .where('transaction.userId = :userId', { userId })
      .orderBy('transaction.transactionDate', 'DESC')
      .take(limit)
      .skip(offset);

    if (startDate && endDate) {
      queryBuilder.andWhere('transaction.transactionDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    if (category) {
      queryBuilder.andWhere('transaction.category = :category', { category });
    }

    return queryBuilder.getManyAndCount();
  }

  async create(transaction: Partial<Transaction>): Promise<Transaction> {
    const newTransaction = this.transactionRepo.create(transaction);
    return this.transactionRepo.save(newTransaction);
  }

  async update(id: string, userId: string, updates: Partial<Transaction>): Promise<Transaction> {
    await this.transactionRepo.update({ id, userId }, updates);
    return this.findOne(id, userId);
  }

  async findOne(id: string, userId: string): Promise<Transaction | null> {
    return this.transactionRepo.findOne({ where: { id, userId } });
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.transactionRepo.delete({ id, userId });
  }
}
```

### Auth Middleware (JWT Strategy)

```typescript
// auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: string; email: string }) {
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user; // Attached to request.user
  }
}
```

---

*[End of Section 4 - Part 1]*

*[Continuing Section 4 - Part 2]...*

## Unified Project Structure

Complete monorepo folder structure for Kash Budget project:

```
kash-budget/
├── .github/                         # GitHub CI/CD workflows
│   └── workflows/
│       ├── ci.yml                   # Continuous integration (lint, test)
│       ├── deploy-staging.yml       # Deploy to staging environment
│       └── deploy-production.yml    # Deploy to production environment
├── apps/                            # Application packages
│   ├── mobile/                      # React Native mobile app
│   │   ├── android/                 # Android native project
│   │   ├── ios/                     # iOS native project
│   │   ├── src/
│   │   │   ├── components/          # (See Frontend Architecture above)
│   │   │   ├── screens/
│   │   │   ├── navigation/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── store/
│   │   │   ├── theme/
│   │   │   ├── utils/
│   │   │   ├── types/
│   │   │   └── App.tsx
│   │   ├── assets/                  # Images, fonts
│   │   │   ├── images/
│   │   │   ├── fonts/
│   │   │   └── kash-mascot/         # Kash character illustrations
│   │   ├── ml-models/               # TensorFlow Lite models
│   │   │   └── categorizer.tflite
│   │   ├── __tests__/               # Tests
│   │   │   ├── components/
│   │   │   └── screens/
│   │   ├── .env.example             # Environment variables template
│   │   ├── app.json                 # React Native config
│   │   ├── babel.config.js
│   │   ├── metro.config.js
│   │   ├── tsconfig.json
│   │   └── package.json
│   └── api/                         # NestJS backend API
│       ├── src/
│       │   ├── main.ts              # (See Backend Architecture above)
│       │   ├── app.module.ts
│       │   ├── common/
│       │   ├── config/
│       │   ├── auth/
│       │   ├── users/
│       │   ├── transactions/
│       │   ├── qr/
│       │   ├── ml/
│       │   ├── locations/
│       │   ├── budgets/
│       │   ├── credits/
│       │   ├── dashboard/
│       │   ├── insights/
│       │   ├── kash/
│       │   ├── notifications/
│       │   └── database/
│       │       └── migrations/
│       ├── test/                    # Integration tests
│       │   ├── auth.e2e-spec.ts
│       │   └── transactions.e2e-spec.ts
│       ├── .env.example
│       ├── Dockerfile               # Production Docker image
│       ├── docker-compose.yml       # Local dev environment
│       ├── nest-cli.json
│       ├── tsconfig.json
│       └── package.json
├── packages/                        # Shared packages
│   ├── shared/                      # Shared types, constants, utilities
│   │   ├── src/
│   │   │   ├── types/
│   │   │   │   ├── user.types.ts
│   │   │   │   ├── transaction.types.ts
│   │   │   │   ├── budget.types.ts
│   │   │   │   ├── location.types.ts
│   │   │   │   ├── credit.types.ts
│   │   │   │   └── index.ts         # Re-export all types
│   │   │   ├── constants/
│   │   │   │   ├── categories.ts    # Default category definitions
│   │   │   │   ├── credit-rewards.ts
│   │   │   │   └── index.ts
│   │   │   ├── utils/
│   │   │   │   ├── validation.ts    # Shared validation functions
│   │   │   │   ├── formatters.ts
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   ├── config/                      # Shared configuration
│   │   ├── eslint/
│   │   │   └── .eslintrc.js         # Shared ESLint config
│   │   ├── typescript/
│   │   │   └── tsconfig.base.json   # Base TypeScript config
│   │   └── jest/
│   │       └── jest.config.js       # Shared Jest config
├── infrastructure/                  # Infrastructure as Code
│   ├── aws-cdk/                     # AWS CDK stacks (TypeScript)
│   │   ├── lib/
│   │   │   ├── networking-stack.ts  # VPC, subnets, security groups
│   │   │   ├── database-stack.ts    # RDS PostgreSQL, ElastiCache
│   │   │   ├── compute-stack.ts     # ECS/App Runner, ALB
│   │   │   └── storage-stack.ts     # S3 buckets
│   │   ├── bin/
│   │   │   └── cdk.ts               # CDK app entry point
│   │   ├── cdk.json
│   │   └── package.json
│   └── terraform/                   # Alternative: Terraform configs (if not using CDK)
│       ├── modules/
│       ├── environments/
│       │   ├── dev/
│       │   ├── staging/
│       │   └── production/
│       └── main.tf
├── scripts/                         # Build and deployment scripts
│   ├── build-mobile.sh              # Build React Native app
│   ├── deploy-api.sh                # Deploy API to AWS
│   ├── db-migrate.sh                # Run database migrations
│   └── seed-data.sh                 # Seed development data
├── docs/                            # Project documentation
│   ├── prd.md                       # Product Requirements Document
│   ├── prd/                         # Sharded PRD documents
│   ├── front-end-spec.md            # UI/UX Specification
│   ├── wireframes-detailed.md       # Detailed wireframes
│   ├── architecture.md              # This document
│   ├── api/                         # API documentation
│   │   └── openapi.yaml             # OpenAPI 3.0 spec
│   └── guides/
│       ├── development.md
│       ├── deployment.md
│       └── contributing.md
├── .env.example                     # Root environment variables
├── .gitignore
├── .prettierrc
├── .eslintrc.js                     # Root ESLint config
├── package.json                     # Root package.json (workspaces)
├── package-lock.json
├── tsconfig.json                    # Root TypeScript config
├── README.md
└── LICENSE
```

**Key Directory Purposes:**
- **apps/mobile** - React Native mobile application (iOS + Android)
- **apps/api** - NestJS backend API server
- **packages/shared** - Shared TypeScript types and utilities (prevents API contract drift)
- **packages/config** - Shared linting, testing, and TypeScript configuration
- **infrastructure/** - AWS CDK (or Terraform) for provisioning cloud resources
- **scripts/** - Automation scripts for building, deploying, and database operations
- **docs/** - All product and technical documentation

---

## Development Workflow

### Local Development Setup

#### Prerequisites

```bash
# Node.js (v18 LTS or later)
node -v  # Should be v18+
npm -v   # Should be v9+

# iOS development (macOS only)
xcode-select --install
sudo gem install cocoapods

# Android development
# Install Android Studio and Android SDK (API 30+)
# Set ANDROID_HOME environment variable

# Docker (for local PostgreSQL + Redis)
docker --version
docker-compose --version

# AWS CLI (for deployment)
aws --version
```

#### Initial Setup

```bash
# Clone repository
git clone https://github.com/your-org/kash-budget.git
cd kash-budget

# Install all dependencies (monorepo)
npm install

# Setup environment variables
cp apps/mobile/.env.example apps/mobile/.env
cp apps/api/.env.example apps/api/.env

# Edit .env files with your local configuration
# (See Environment Configuration section below)

# Start Docker services (PostgreSQL + Redis)
cd apps/api
docker-compose up -d

# Run database migrations
npm run migrate:dev

# Seed development data (optional)
npm run seed

# Install iOS dependencies (macOS only)
cd ../mobile/ios
pod install
cd ../..
```

#### Development Commands

**Root commands (run from project root):**

```bash
# Install all dependencies
npm install

# Build all packages
npm run build

# Run tests across all packages
npm run test

# Lint all code
npm run lint

# Format all code with Prettier
npm run format
```

**Mobile app commands:**

```bash
cd apps/mobile

# Start Metro bundler
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Type check
npm run type-check

# Lint
npm run lint
```

**Backend API commands:**

```bash
cd apps/api

# Start development server (watch mode)
npm run start:dev

# Start production build
npm run start:prod

# Run tests
npm test

# Run E2E tests
npm run test:e2e

# Run database migrations
npm run migrate:dev

# Create new migration
npm run migration:create --name=AddIndexToTransactions

# Seed development data
npm run seed

# Generate Swagger API docs (http://localhost:3000/api/docs)
npm run start:dev
```

### Environment Configuration

#### Mobile App (.env.local)

```bash
# Frontend environment variables (apps/mobile/.env)

# API Configuration
API_BASE_URL=http://localhost:3000/api/v1  # Use 10.0.2.2 for Android emulator
API_TIMEOUT=10000

# Firebase Configuration (for push notifications)
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_APP_ID=your_firebase_app_id
FIREBASE_MESSAGING_SENDER_ID=your_sender_id

# Analytics
AMPLITUDE_API_KEY=your_amplitude_key

# Sentry (error tracking)
SENTRY_DSN=your_sentry_dsn

# Feature Flags
ENABLE_ML_CATEGORIZATION=true
ENABLE_GEOFENCING=true
ENABLE_ANALYTICS=true

# Development
DEV_MODE=true
LOG_LEVEL=debug
```

#### Backend API (.env)

```bash
# Backend environment variables (apps/api/.env)

# Node Environment
NODE_ENV=development

# Server Configuration
PORT=3000
API_PREFIX=api/v1

# Database Configuration (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=kashbudget
DB_PASSWORD=kashbudget_dev_password
DB_NAME=kashbudget_dev
DB_SSL=false

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=15m
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_REFRESH_EXPIRATION=30d

# OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
APPLE_CLIENT_ID=your_apple_client_id
APPLE_TEAM_ID=your_apple_team_id
APPLE_KEY_ID=your_apple_key_id
APPLE_PRIVATE_KEY_PATH=./certs/apple_private_key.p8

# AWS Configuration
AWS_REGION=eu-central-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
S3_BUCKET_NAME=kash-budget-receipts-dev

# Firebase Admin SDK (for push notifications)
FIREBASE_PROJECT_ID=kash-budget
FIREBASE_PRIVATE_KEY_PATH=./certs/firebase-adminsdk.json

# Analytics
AMPLITUDE_API_KEY=your_amplitude_server_key

# Sentry (error tracking)
SENTRY_DSN=your_sentry_backend_dsn

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100

# Logging
LOG_LEVEL=debug
LOG_TO_FILE=false

# Swagger API Docs
SWAGGER_ENABLED=true
```

#### Shared Environment Variables (.env at root)

```bash
# Shared across mobile and API

# Project Configuration
PROJECT_NAME=Kash Budget
VERSION=1.0.0

# Feature Flags (can be overridden per environment)
ENABLE_ANALYTICS=true
ENABLE_ERROR_TRACKING=true
```

**Environment Variable Management:**
- Development: `.env` files (not committed to git)
- Staging/Production: Environment variables set in AWS (ECS task definitions, App Runner)
- Secrets: AWS Secrets Manager for sensitive credentials (DB passwords, API keys)
- Configuration: AWS Systems Manager Parameter Store for non-sensitive config

---

*[End of Section 4 - Implementation Architecture]*

## Deployment Architecture

### Deployment Strategy

**Frontend Deployment (Mobile App):**
- **Platform:** App Store (iOS) and Google Play Store (Android)
- **Build System:** GitHub Actions CI/CD
- **Build Commands:**
  - iOS: `cd ios && xcodebuild archive -workspace KashBudget.xcworkspace -scheme KashBudget`
  - Android: `cd android && ./gradlew bundleRelease`
- **Distribution:**
  - iOS: TestFlight (beta) → App Store (production)
  - Android: Internal testing → Open testing → Production
- **Code Signing:** Fastlane for automated signing and provisioning
- **Over-the-Air Updates:** CodePush for minor JavaScript updates (bypasses app store review)

**Backend Deployment:**
- **Platform:** AWS ECS (Elastic Container Service) or AWS App Runner
- **Container Registry:** Amazon ECR (Elastic Container Registry)
- **Build Command:** `docker build -t kash-budget-api:latest .`
- **Deployment Method:**
  - Build Docker image in CI/CD
  - Push image to ECR
  - Update ECS task definition or App Runner service
  - Rolling deployment (zero downtime)

### CI/CD Pipeline

**GitHub Actions Workflow (.github/workflows/ci.yml):**

```yaml
name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run type check
        run: npm run type-check
      
      - name: Run tests
        run: npm run test -- --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  build-api:
    runs-on: ubuntu-latest
    needs: lint-and-test
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: eu-central-1
      
      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1
      
      - name: Build, tag, and push Docker image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: kash-budget-api
          IMAGE_TAG: ${{ github.sha }}
        run: |
          cd apps/api
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
      
      - name: Deploy to ECS
        run: |
          aws ecs update-service --cluster kash-budget-cluster \
            --service kash-budget-api-service --force-new-deployment

  build-mobile-ios:
    runs-on: macos-latest
    needs: lint-and-test
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install pods
        run: cd apps/mobile/ios && pod install
      
      - name: Build iOS app
        run: |
          cd apps/mobile
          npx react-native build-ios --mode Release
      
      - name: Upload to TestFlight
        uses: apple-actions/upload-testflight-build@v1
        with:
          app-path: apps/mobile/ios/build/KashBudget.ipa
          issuer-id: ${{ secrets.APPLE_ISSUER_ID }}
          api-key-id: ${{ secrets.APPLE_API_KEY_ID }}
          api-private-key: ${{ secrets.APPLE_API_PRIVATE_KEY }}
```

### Environments

| Environment | Frontend URL | Backend URL | Purpose | Database |
|-------------|--------------|-------------|---------|----------|
| **Development** | N/A (local emulator) | `http://localhost:3000` | Local development | PostgreSQL (Docker) |
| **Staging** | N/A (TestFlight/Internal Testing) | `https://api-staging.kashbudget.com` | Pre-production testing, QA | RDS PostgreSQL (staging) |
| **Production** | App Store / Google Play | `https://api.kashbudget.com` | Live environment | RDS PostgreSQL (Multi-AZ) |

**Environment Promotion Flow:**
1. Develop on feature branches → Merge to `develop` → Deploy to Staging
2. Test in Staging → Merge `develop` to `main` → Deploy to Production
3. Mobile app releases: Manual approval in App Store Connect / Google Play Console

---

## Security and Performance

### Security Requirements

**Frontend Security:**
- **CSP Headers:** Not applicable (mobile app, not web)
- **XSS Prevention:** React Native escapes all dynamic content by default; avoid `dangerouslySetInnerHTML`
- **Secure Storage:**
  - iOS: Keychain for tokens (react-native-keychain)
  - Android: KeyStore for tokens
  - Never store sensitive data in AsyncStorage unencrypted
- **SSL Pinning:** Pin API server certificate to prevent MITM attacks (production only)
- **Code Obfuscation:** ProGuard (Android), Hermes bytecode (both platforms)

**Backend Security:**
- **Input Validation:** class-validator for all DTOs; sanitize user input to prevent injection
- **Rate Limiting:**
  - 100 requests per minute per user (authenticated endpoints)
  - 20 requests per minute per IP (unauthenticated endpoints)
  - Implemented via NestJS throttler module
- **CORS Policy:**
  - Allow only mobile app user agents
  - No CORS for mobile (uses native HTTP, not browser)
- **SQL Injection Prevention:** TypeORM parameterized queries (never string concatenation)
- **Helmet.js:** Security headers (XSS protection, no-sniff, frameguard)

**Authentication Security:**
- **Token Storage:**
  - Access tokens: In-memory (Redux state) + encrypted secure storage
  - Refresh tokens: Encrypted secure storage only (never in Redux)
- **Session Management:** Stateless JWT; refresh tokens stored in Redis with TTL
- **Password Policy:** If email/password auth (future):
  - Minimum 8 characters
  - Requires: 1 uppercase, 1 lowercase, 1 number, 1 special character
  - bcrypt hashing with salt rounds = 10

### Performance Optimization

**Frontend Performance:**
- **Bundle Size Target:** < 15 MB total app size (React Native optimizations)
- **Loading Strategy:**
  - Lazy load screens with React.lazy() and Suspense
  - Optimize images with react-native-fast-image (caching, WebP support)
  - Use Hermes engine for faster startup (default in RN 0.73+)
- **Caching Strategy:**
  - Redux Persist for offline data access
  - API response caching with TTL (e.g., category list cached for 24 hours)
  - Image caching with react-native-fast-image

**Backend Performance:**
- **Response Time Target:** < 200ms for 95th percentile (API endpoints)
- **Database Optimization:**
  - Indexes on foreign keys and frequently queried columns
  - Query optimization: Use joins instead of N+1 queries
  - Connection pooling: Max 20 connections per instance
- **Caching Strategy:**
  - Redis caching for:
    - User sessions (JWT refresh tokens)
    - Credit balances (invalidate on transaction)
    - Category list (24-hour TTL)
  - Cache-aside pattern: Check cache first, fallback to DB

**Performance Budgets:**
- App cold start: < 3 seconds (NFR2)
- QR scan processing: < 2 seconds (NFR1)
- API response time (p95): < 200ms
- Database query time (p95): < 50ms

---

## Testing Strategy

### Testing Pyramid

```
        E2E Tests (Manual for MVP)
       /                      \
      /    Integration Tests   \
     /     (API endpoints)       \
    /_____________________________\
   /                               \
  /  Frontend Unit  Backend Unit    \
 /   (Components)   (Services)       \
/_____________________________________\
```

### Test Organization

**Frontend Tests (apps/mobile/__tests__):**

```
__tests__/
├── components/
│   ├── atoms/
│   │   └── Button.test.tsx
│   ├── molecules/
│   │   └── TransactionCard.test.tsx
│   └── organisms/
│       └── TransactionList.test.tsx
├── screens/
│   ├── ScanScreen.test.tsx
│   └── SeeScreen.test.tsx
├── hooks/
│   ├── useAuth.test.ts
│   └── useTransactions.test.ts
├── services/
│   ├── qr/
│   │   └── parser.test.ts
│   └── ml/
│       └── categorizer.test.ts
└── integration/
    └── auth-flow.test.tsx
```

**Backend Tests (apps/api/test/):**

```
test/
├── unit/
│   ├── auth/
│   │   └── auth.service.spec.ts
│   ├── transactions/
│   │   └── transactions.service.spec.ts
│   └── credits/
│       └── credit-calculator.spec.ts
├── integration/
│   ├── auth.e2e-spec.ts
│   ├── transactions.e2e-spec.ts
│   └── dashboard.e2e-spec.ts
└── setup.ts
```

**E2E Tests:**

- Manual testing for MVP (automated E2E with Detox deferred to post-MVP)
- Test scenarios:
  - Complete onboarding flow
  - QR scan → transaction creation
  - Manual transaction entry
  - Category correction (ML feedback)
  - Budget goal creation
  - Location tagging
  - Geofence exit → notification
  - Credit earning and unlocks

### Test Examples

**Frontend Component Test (React Native Testing Library):**

```typescript
// __tests__/components/molecules/TransactionCard.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TransactionCard } from '../../../src/components/molecules/TransactionCard';

describe('TransactionCard', () => {
  const mockTransaction = {
    id: '123',
    merchant: 'Kaufland',
    amount: 45.00,
    category: 'Food & Groceries',
    transactionDate: new Date('2025-11-17T14:30:00'),
    source: 'qr_scan' as const,
  };

  it('renders transaction details correctly', () => {
    const { getByText } = render(<TransactionCard transaction={mockTransaction} />);
    
    expect(getByText('Kaufland')).toBeTruthy();
    expect(getByText('Food & Groceries')).toBeTruthy();
    expect(getByText('-€45.00')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const onPressMock = jest.fn();
    const { getByTestID } = render(
      <TransactionCard transaction={mockTransaction} onPress={onPressMock} />
    );
    
    fireEvent.press(getByTestID('transaction-card'));
    expect(onPressMock).toHaveBeenCalledWith('123');
  });

  it('displays QR scan badge for scanned transactions', () => {
    const { getByTestID } = render(<TransactionCard transaction={mockTransaction} />);
    expect(getByTestID('qr-badge')).toBeTruthy();
  });
});
```

**Backend API Test (Supertest):**

```typescript
// test/integration/transactions.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('TransactionsController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Authenticate test user
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'test@example.com', password: 'TestPass123!' });
    authToken = response.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /transactions', () => {
    it('should create a new transaction', async () => {
      const createDto = {
        amount: 45.00,
        currency: 'BGN',
        category: 'Food & Groceries',
        merchant: 'Kaufland',
        transactionDate: new Date().toISOString(),
        source: 'qr_scan',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createDto)
        .expect(201);

      expect(response.body.id).toBeDefined();
      expect(response.body.amount).toBe(45.00);
      expect(response.body.category).toBe('Food & Groceries');
    });

    it('should reject invalid amount', async () => {
      const invalidDto = {
        amount: -10, // Negative amount
        category: 'Food & Groceries',
        transactionDate: new Date().toISOString(),
        source: 'manual_entry',
      };

      await request(app.getHttpServer())
        .post('/api/v1/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidDto)
        .expect(400);
    });
  });
});
```

**Coverage Targets:**
- Frontend: 70%+ code coverage (components, hooks, services)
- Backend: 80%+ code coverage (controllers, services, repositories)
- Focus on critical paths: Auth, transactions, QR parsing, ML categorization, credits

---

## Coding Standards

**CRITICAL: These standards are for AI development agents to prevent common mistakes.**

### Critical Fullstack Rules

- **Type Sharing:** Always define types in `packages/shared/src/types` and import from `@kash-budget/shared`. Never duplicate type definitions between mobile and API.
- **API Calls:** Never make direct HTTP calls with `fetch` or `axios` from components. Always use the service layer (`services/api/*`).
- **Environment Variables:** Access only through config objects (`config.ts`), never `process.env` directly in application code.
- **Error Handling:** All API routes must use the standard error handler (NestJS exception filters). All mobile API calls must use try-catch with error toast display.
- **State Updates:** Never mutate Redux state directly. Use Redux Toolkit's `createSlice` reducers which use Immer internally.
- **Database Queries:** Never use raw SQL strings. Always use TypeORM query builder or repository methods for type safety.
- **Async Operations:** Always handle promises with async/await and try-catch. Never use `.then().catch()` (inconsistent error handling).
- **Component Props:** Always define TypeScript interfaces for component props. Use `React.FC<PropsInterface>` for type safety.
- **API Validation:** All DTOs must use class-validator decorators. Never trust client input without validation.
- **Secrets Management:** Never commit `.env` files or API keys to git. Use `.env.example` for templates.

### Naming Conventions

| Element | Frontend | Backend | Example |
|---------|----------|---------|---------|
| **Components** | PascalCase | - | `UserProfile.tsx`, `TransactionCard.tsx` |
| **Hooks** | camelCase with 'use' prefix | - | `useAuth.ts`, `useTransactions.ts` |
| **Services** | camelCase | - | `apiClient.ts`, `qrParser.ts` |
| **Controllers** | PascalCase with 'Controller' suffix | PascalCase | `TransactionsController` |
| **Services** (Backend) | - | PascalCase with 'Service' suffix | `TransactionsService`, `AuthService` |
| **Entities** | - | PascalCase | `User`, `Transaction` (TypeORM entities) |
| **DTOs** | - | PascalCase with 'Dto' suffix | `CreateTransactionDto`, `LoginDto` |
| **API Routes** | - | kebab-case | `/api/v1/user-profile`, `/transactions` |
| **Database Tables** | - | snake_case | `user_profiles`, `credit_transactions` |
| **Database Columns** | - | snake_case | `created_at`, `is_active` |
| **Environment Variables** | UPPER_SNAKE_CASE | UPPER_SNAKE_CASE | `API_BASE_URL`, `DB_HOST` |
| **Constants** | UPPER_SNAKE_CASE | UPPER_SNAKE_CASE | `DEFAULT_CATEGORIES`, `MAX_BUDGET_LIMIT` |

**File Naming:**
- Components: `ComponentName.tsx` (PascalCase)
- Hooks: `useHookName.ts` (camelCase with 'use')
- Services: `serviceName.ts` (camelCase)
- Tests: `ComponentName.test.tsx` or `serviceName.spec.ts`

---

## Error Handling Strategy

### Error Flow Diagram

```mermaid
sequenceDiagram
    participant User
    participant MobileApp
    participant API
    participant Database

    User->>MobileApp: Performs action
    MobileApp->>API: API request
    
    alt Success
        API->>Database: Query
        Database-->>API: Data
        API-->>MobileApp: 200 OK {data}
        MobileApp-->>User: Display success
    else Validation Error (400)
        API->>API: Validate DTO with class-validator
        API-->>MobileApp: 400 {error: "Invalid input"}
        MobileApp-->>User: Show error toast
    else Authorization Error (401/403)
        API->>API: Check JWT token
        API-->>MobileApp: 401 {error: "Unauthorized"}
        MobileApp->>MobileApp: Clear tokens, redirect to login
    else Server Error (500)
        API->>Sentry: Log error with stack trace
        API-->>MobileApp: 500 {error: "Internal error", requestId}
        MobileApp->>Sentry: Log mobile context
        MobileApp-->>User: "Something went wrong. Please try again."
    end
```

### Error Response Format

**Consistent error format (TypeScript interface in `packages/shared`):**

```typescript
interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
    timestamp: string;
    requestId: string;
  };
}

// Example error response:
{
  "error": {
    "code": "INVALID_QR_FORMAT",
    "message": "QR code data does not match Bulgarian receipt format",
    "details": {
      "expectedFormat": "FD:xxx\\nDT:yyyy-MM-dd\\nAM:number",
      "receivedFormat": "Unknown"
    },
    "timestamp": "2025-11-17T10:30:00Z",
    "requestId": "req_abc123def456"
  }
}
```

### Frontend Error Handling

```typescript
// services/api/apiClient.ts (Error interceptor)
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const { response } = error;

    if (!response) {
      // Network error
      Toast.show({
        type: 'error',
        text1: 'Network Error',
        text2: 'Please check your internet connection',
      });
      return Promise.reject(error);
    }

    // Log to Sentry
    Sentry.captureException(error, {
      tags: { requestId: response.data?.error?.requestId },
      contexts: { response: { status: response.status, data: response.data } },
    });

    switch (response.status) {
      case 400:
        Toast.show({
          type: 'error',
          text1: 'Invalid Input',
          text2: response.data.error.message,
        });
        break;
      case 401:
        // Try refresh token, or logout
        break;
      case 403:
        Toast.show({
          type: 'error',
          text1: 'Access Denied',
          text2: response.data.error.message,
        });
        break;
      case 500:
        Toast.show({
          type: 'error',
          text1: 'Server Error',
          text2: 'Something went wrong. Please try again.',
          text3: `Request ID: ${response.data.error.requestId}`,
        });
        break;
    }

    return Promise.reject(error);
  }
);
```

### Backend Error Handling

```typescript
// common/filters/http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const requestId = uuidv4();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code = 'INTERNAL_ERROR';
    let details = {};

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message = typeof exceptionResponse === 'string' ? exceptionResponse : (exceptionResponse as any).message;
      code = (exceptionResponse as any).error || 'HTTP_EXCEPTION';
      details = (exceptionResponse as any).details || {};
    }

    // Log error with context
    this.logger.error({
      requestId,
      method: request.method,
      url: request.url,
      status,
      message,
      stack: exception instanceof Error ? exception.stack : undefined,
      userId: (request as any).user?.id,
    });

    // Send structured error response
    response.status(status).json({
      error: {
        code,
        message,
        details,
        timestamp: new Date().toISOString(),
        requestId,
      },
    });
  }
}
```

---

## Monitoring and Observability

### Monitoring Stack

- **Frontend Monitoring:** Sentry React Native SDK (crash reporting, performance monitoring)
- **Backend Monitoring:** Sentry Node.js SDK (error tracking, performance monitoring)
- **Infrastructure Monitoring:** Amazon CloudWatch (EC2, RDS, ElastiCache metrics)
- **Error Tracking:** Sentry (unified error dashboard for mobile + backend)
- **Performance Monitoring:** Sentry Performance, CloudWatch Application Insights
- **Logging:** Winston (structured JSON logs) → CloudWatch Logs
- **User Analytics:** Amplitude (product metrics, retention, cohorts)

### Key Metrics

**Frontend Metrics (Sentry + Amplitude):**
- App crash rate (< 0.1% target)
- JavaScript errors per session (< 1 error/session target)
- API response times (mobile perspective)
- Screen load times (< 1 second target)
- User interactions (QR scans, transactions created, budget goals set)
- Retention: Day 1, Day 7, Day 30

**Backend Metrics (CloudWatch + Sentry):**
- Request rate (requests per minute)
- Error rate (< 1% target)
- Response time (p50, p95, p99)
- Database query performance (slow query log, p95 < 50ms)
- Cache hit rate (Redis, > 80% target)
- ECS task CPU/memory utilization (< 70% average)

**Database Metrics (CloudWatch):**
- Connection count
- Query latency (read/write)
- Deadlocks
- Storage usage

**Business Metrics (Amplitude):**
- Daily Active Users (DAU)
- QR scans per user per day
- Transaction categorization accuracy (manual corrections / total transactions)
- Budget goal completion rate
- Credit earning progression
- Geofence exit → scan conversion rate

### Alerting

**Critical Alerts (PagerDuty or CloudWatch Alarms):**
- API error rate > 5% for 5 minutes
- API p95 response time > 1 second for 10 minutes
- Database connection pool exhausted
- ECS task failures
- Mobile app crash rate > 1%

**Warning Alerts (Slack notifications):**
- API error rate > 2% for 15 minutes
- Database storage > 80%
- Cache memory > 80%

---

## Checklist Results Report

The fullstack architecture document is now complete. The following checklist should be executed before implementation:

**Architecture Review Checklist:**
- [ ] All tech stack choices documented with rationale
- [ ] Database schema reviewed for normalization and indexing
- [ ] API endpoints aligned with PRD functional requirements
- [ ] Authentication and authorization flows defined
- [ ] Error handling strategy consistent across stack
- [ ] Security requirements (OWASP Top 10) addressed
- [ ] Performance budgets defined and achievable
- [ ] Monitoring and observability in place
- [ ] Deployment strategy validated (CI/CD pipeline)
- [ ] Development workflow tested locally

**Readiness Criteria:**
- [ ] PRD approved by stakeholders
- [ ] UI/UX spec approved by design team
- [ ] Architecture reviewed by technical lead
- [ ] AWS infrastructure provisioned (or CDK ready)
- [ ] Firebase project created (for push notifications)
- [ ] Sentry projects created (mobile + backend)
- [ ] GitHub repository set up with CI/CD workflows
- [ ] Development environment tested (Docker, PostgreSQL, Redis)

**Next Steps:**
1. Provision AWS infrastructure using AWS CDK (or Terraform)
2. Set up GitHub repository and CI/CD pipelines
3. Initialize mobile app with React Native CLI
4. Initialize backend API with NestJS CLI
5. Set up monorepo with npm workspaces
6. Implement authentication module (first epic)
7. Begin Epic 1: Foundation & Core Infrastructure

---

**Document Status:** ✅ Complete

**Last Updated:** 2025-11-17

**Version:** 1.0

---

*[End of Kash Budget Fullstack Architecture Document]*
