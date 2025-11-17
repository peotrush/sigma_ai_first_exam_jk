# Epic 1: Foundation & Core Infrastructure

**Epic Goal:** Establish the foundational project structure for both mobile app (React Native) and backend API (NestJS), implement secure authentication system, set up CI/CD pipeline, and deliver a deployable application with health-check functionality. This epic ensures all developers can work in a consistent environment with automated testing and deployment from day one.

## Story 1.1: Project Initialization & Repository Setup

As a **developer**,
I want **a well-structured monorepo with mobile app and backend scaffolded**,
so that **the team can begin development with consistent tooling and organization**.

### Acceptance Criteria

1. Monorepo created with workspace structure: `/mobile` (React Native), `/backend` (NestJS), `/shared` (TypeScript types)
2. React Native mobile app initialized with TypeScript, targeting iOS 14+ and Android 10+
3. NestJS backend initialized with TypeScript, configured with environment variables
4. Shared workspace configured with npm/yarn workspaces for dependency management
5. README.md includes setup instructions, environment variable documentation, and development commands
6. .gitignore configured for Node.js, React Native, and IDE files
7. Package.json scripts defined for running mobile (`npm run mobile:ios`, `npm run mobile:android`) and backend (`npm run backend:dev`)
8. Both mobile and backend can successfully build and run locally following README instructions

## Story 1.2: Backend Health Check & Database Connection

As a **backend developer**,
I want **a basic API with health-check endpoint and PostgreSQL database connection**,
so that **I can verify the backend infrastructure is working before building features**.

### Acceptance Criteria

1. PostgreSQL database provisioned (local Docker container for dev, RDS for production)
2. NestJS configured with TypeORM or Prisma for database connection
3. Database connection configuration uses environment variables (DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME)
4. Health check endpoint `GET /health` returns 200 with `{"status": "ok", "database": "connected"}`
5. Health check endpoint fails gracefully with 503 if database is unreachable
6. Database connection pool configured with appropriate limits
7. Basic logging configured with Winston for request logging and error tracking
8. Backend can be started and health check endpoint responds successfully

## Story 1.3: User Authentication System

As a **user**,
I want **to create an account and securely log in to the app**,
so that **my financial data is private and associated with my account**.

### Acceptance Criteria

1. User model/entity created with fields: id (UUID), email, passwordHash, createdAt, updatedAt
2. POST /auth/register endpoint accepts email and password, validates email format and password strength (min 8 chars)
3. Passwords are hashed with bcrypt before storing in database
4. POST /auth/login endpoint authenticates user and returns JWT access token (expires in 24 hours)
5. JWT token includes user id and email in payload
6. JWT secret stored in environment variable (JWT_SECRET)
7. Protected routes use JWT authentication guard to verify token
8. Invalid tokens return 401 Unauthorized with clear error message
9. Mobile app has basic login and registration screens (no styling required yet)
10. Mobile app stores JWT token securely in device secure storage (Keychain/KeyStore)
11. Mobile app includes token in Authorization header for authenticated API requests

## Story 1.4: CI/CD Pipeline Setup

As a **developer**,
I want **automated testing and deployment pipeline**,
so that **code changes are validated and deployed consistently without manual steps**.

### Acceptance Criteria

1. GitHub Actions workflow created for backend: runs on push to main and pull requests
2. Backend CI workflow runs: `npm install`, `npm run lint`, `npm run test`, `npm run build`
3. GitHub Actions workflow created for mobile: runs linting and type-checking (build on device/simulator not required in CI for MVP)
4. Linting configured with ESLint for both backend and mobile with consistent rules
5. Unit test framework configured with Jest for backend
6. CI pipeline fails if linting, tests, or build fails
7. CD pipeline configured to deploy backend to AWS (ECS or App Runner) on successful main branch build
8. Environment variables for production are securely stored in GitHub Secrets or AWS Parameter Store
9. Deployment includes database migration execution before new code version starts
10. Deployment pipeline includes smoke test (health check endpoint) after deployment

---
