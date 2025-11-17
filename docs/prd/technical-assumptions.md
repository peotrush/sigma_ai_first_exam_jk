# Technical Assumptions

## Repository Structure

**Monorepo** (Frontend + Backend + Shared Types)

- Single repository containing mobile app, backend API, and shared TypeScript types
- Workspace structure: `/mobile`, `/backend`, `/shared`
- Simplifies dependency management and code sharing
- Enables atomic commits across frontend and backend changes
- Tools: npm workspaces or Yarn workspaces

**Rationale:** For a small team building a tightly coupled mobile app and API, monorepo reduces coordination overhead and keeps codebase cohesive. Shared types between frontend and backend prevent API contract mismatches.

## Service Architecture

**Monolithic Backend for MVP**

- Single Node.js application handling all API endpoints
- Modules organized by domain (auth, transactions, insights, gamification, notifications)
- RESTful API design with clear resource endpoints
- Design for future microservices extraction (loose coupling between modules)

**Future Evolution:**
- Eventual microservices: Auth Service, Transaction Service, Insights Service, Notification Service
- API Gateway pattern for future service orchestration

**Rationale:** Monolith allows faster MVP development with simpler deployment. As scale and complexity grow, well-organized modules can be extracted into microservices without major rewrites.

## Testing Requirements

**MVP Testing Strategy: Unit + Integration + Manual Testing**

**Unit Testing:**
- Frontend: Jest + React Testing Library for component logic
- Backend: Jest for business logic, data transformations, and utility functions
- Target: 70%+ code coverage for critical paths (auth, transaction processing, categorization ML)

**Integration Testing:**
- API endpoint testing with Supertest
- Database integration tests with test database
- ML model integration tests for categorization accuracy

**Manual Testing:**
- QR code scanning on real Bulgarian receipts (critical for MVP validation)
- Location geofencing testing in real-world scenarios
- User flow testing on multiple device types (iOS/Android, various screen sizes)

**E2E Testing:**
- Not required for MVP (manual testing sufficient)
- Detox or Appium consideration for post-MVP automation

**Performance Testing:**
- Load testing with 1,000 concurrent users before public launch
- QR scan speed testing (must be < 2 seconds)
- App launch time testing (must be < 3 seconds)

**Rationale:** Focus testing efforts on high-risk areas (QR parsing, ML categorization, geofencing) while keeping manual testing for user experience validation. Full E2E automation deferred until product-market fit is established.

## Additional Technical Assumptions and Requests

**Frontend Technology:**
- **Framework:** React Native (cross-platform iOS/Android from single codebase)
- **State Management:** Redux Toolkit (predictable state for complex credit system and offline support)
- **Navigation:** React Navigation v6
- **UI Components:** Custom design system built on React Native Paper or native components
- **Offline Support:** Redux Persist for basic offline functionality (view cached data)

**Backend Technology:**
- **Runtime:** Node.js v18 LTS
- **Framework:** NestJS (structured, scalable Node.js with TypeScript)
- **API Style:** RESTful with clear resource endpoints
- **Validation:** Class-validator for request validation
- **Documentation:** Swagger/OpenAPI auto-generated from code

**Database:**
- **Primary DB:** PostgreSQL 14+ (ACID compliance for financial data, JSON support for flexible transaction metadata)
- **Caching:** Redis for session management, frequently accessed user preferences, credit balances
- **Migrations:** TypeORM or Prisma for schema versioning and migrations

**Hosting & Infrastructure:**
- **Cloud Provider:** AWS (familiar, comprehensive services)
- **Compute:** EC2 t3.small initially, auto-scaling group for future
- **Database:** RDS PostgreSQL with automated backups
- **Caching:** ElastiCache Redis
- **Storage:** S3 for optional receipt images (encrypted at rest)
- **CDN:** CloudFront for app assets and static content
- **CI/CD:** GitHub Actions for automated testing and deployment
- **Deployment:** Docker containers with ECS or App Runner for simplicity

**Mobile-Specific Technologies:**
- **QR Scanning:** react-native-camera with QR code detection, or expo-camera if using Expo
- **Geofencing:** react-native-geolocation-service + background geofencing libraries
- **Push Notifications:** Firebase Cloud Messaging (FCM) for both iOS and Android
- **Analytics:** Amplitude or Mixpanel SDK
- **Crash Reporting:** Sentry React Native SDK
- **Local Storage:** AsyncStorage or MMKV for fast local key-value storage

**ML/AI for Categorization:**
- **Approach:** On-device ML model for privacy and speed
- **Technology:** TensorFlow Lite for mobile, trained from user correction feedback
- **Training:** Server-side model training with anonymized transaction patterns, export to TFLite
- **Fallback:** Rule-based categorization (merchant name patterns) if ML confidence is low

**Authentication & Security:**
- **Auth Strategy:** OAuth 2.0 with JWT tokens
- **Password Hashing:** bcrypt (if email/password auth)
- **Social Auth:** Google Sign-In, Apple Sign-In (for iOS requirement)
- **Token Storage:** Secure storage (iOS Keychain, Android KeyStore)
- **API Security:** Rate limiting, CORS configuration, helmet.js for security headers
- **Data Encryption:** AES-256 for sensitive data at rest, TLS 1.3 for data in transit

**Monitoring & Observability:**
- **Application Monitoring:** Sentry for error tracking
- **Infrastructure Monitoring:** AWS CloudWatch for server metrics
- **User Analytics:** Amplitude/Mixpanel for product metrics (KPIs tracking)
- **Logging:** Structured JSON logging with Winston, centralized in CloudWatch Logs

**Third-Party Integrations (MVP):**
- None required for MVP—fully standalone app
- Future: Banking APIs (open banking standards), payment processors (Stripe for subscriptions)

**Compliance & Privacy:**
- GDPR compliance for Bulgarian users (data access, deletion, portability)
- Privacy policy and terms of service (legal review required)
- App Store privacy labels (iOS) and Google Play Data Safety (Android)
- Minimal data collection: no selling user data, no third-party advertising

---
