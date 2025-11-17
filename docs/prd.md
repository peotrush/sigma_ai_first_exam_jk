# Kash Budget Product Requirements Document (PRD)

**Project Name:** Kash Budget (Smart Budget Application)
**Version:** 1.0
**Date:** 2025-11-17
**Document Owner:** PM Agent (John)
**Status:** Draft

---

## Goals and Background Context

### Goals

- Deliver a mobile-first personal finance application that eliminates the "financial fog" problem through effortless 10-second daily interaction
- Enable guilt-free, conscious spending decisions through real-time behavioral coaching and clear visibility
- Leverage Bulgaria's mandatory receipt QR codes for instant, accurate transaction capture with zero manual entry burden
- Provide proactive location-based coaching that helps users make smarter spending decisions before and during purchases
- Create an encouraging, non-judgmental financial companion (Kash mascot) that celebrates smart choices and supports users emotionally
- Implement gamification through virtual credits that reward engagement and unlock premium features
- Achieve 60% 30-day retention rate (2x industry average) and 70% weekly engagement through effortless UX
- Build loyal early adopter base through lifetime premium access, creating viral growth and market differentiation

### Background Context

Millions of Bulgarian consumers experience "financial fog"—a frustrating lack of clarity about where their money actually goes each month. Despite adequate income, they struggle to save for meaningful goals (social causes, big purchases, experiences) because existing budget apps create more problems than they solve: tedious manual entry leads to 70%+ abandonment within 30 days, judgmental interfaces create guilt around all spending, and complex features overwhelm users who just want simple visibility.

Kash Budget transforms this experience by combining three unique innovations: (1) Bulgaria's mandatory receipt QR code infrastructure enables instant, accurate transaction capture without manual entry, (2) GPS-powered location intelligence provides proactive behavioral coaching at the moment of spending decision, and (3) Kash—a confident, supportive AI mascot—guides users with encouragement rather than judgment. The "guilt-free spending" philosophy, featuring a dedicated Treat Yourself Budget, addresses the emotional barriers to financial management that technical solutions alone cannot solve. With post-pandemic financial wellness demand at an all-time high and Bulgaria's QR infrastructure providing a 2-3 year competitive moat, now is the optimal time to establish market leadership before competitors catch up.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-11-17 | 1.0 | Initial PRD creation from Project Brief | PM Agent (John) |

---

## Requirements

### Functional Requirements

**FR1:** The system shall provide a camera-based QR code scanner that parses Bulgarian receipt QR format to extract time and amount data.

**FR2:** The system shall maintain a receipt history with timestamps, amounts, categories, and locations for all transactions.

**FR3:** The system shall provide manual transaction entry as a fallback for receipts without QR codes or cash purchases.

**FR4:** The system shall display Kash mascot throughout the app with contextual messages based on user actions and financial status.

**FR5:** The system shall provide Kash-guided onboarding flow that explains app features and helps user set initial goals.

**FR6:** The system shall deliver morning motivation messages from Kash to encourage daily engagement.

**FR7:** The system shall provide Kash celebration messages when users scan receipts or achieve milestones.

**FR8:** The system shall include pre-defined spending categories (Groceries, Dining, Transport, Entertainment, Shopping, Bills, Health, Other).

**FR9:** The system shall require manual categorization for the first 5-10 transactions to train the ML model.

**FR10:** The system shall use ML to auto-categorize 90%+ of transactions after initial training period.

**FR11:** The system shall allow users to correct auto-categorized transactions to improve ML accuracy.

**FR12:** The system shall enable users to tag frequent spending locations (stores, restaurants, cafes) with GPS coordinates.

**FR13:** The system shall auto-suggest tagging a location after detecting 2+ visits to the same GPS coordinates.

**FR14:** The system shall display spending history filtered by tagged location.

**FR15:** The system shall use geofencing to detect when user exits a tagged location and trigger a notification.

**FR16:** The system shall provide quick-action exit prompts with options: Scan Receipt / Enter Amount / Skip.

**FR17:** The system shall include a dedicated "Treat Yourself" budget category separate from other spending categories.

**FR18:** The system shall allow users to set a monthly Treat Yourself budget allocation.

**FR19:** The system shall display Kash celebration messages when users make purchases from Treat Yourself category: "Enjoy guilt-free!"

**FR20:** The system shall track Treat Yourself spending separately with positive, non-judgmental messaging.

**FR21:** The system shall award virtual credits for scanning receipts with progressive rewards (5, 10, 15, 20 credits as habits build).

**FR22:** The system shall award bonus credits for consecutive day scanning streaks.

**FR23:** The system shall award milestone credits (first week complete, 50 scans, 100 scans, etc.).

**FR24:** The system shall display credit balance prominently in the app interface.

**FR25:** The system shall track which premium features users have unlocked with credits (for future freemium model).

**FR26:** The system shall display current week spending summary on the main dashboard.

**FR27:** The system shall visualize top spending categories with pie or bar charts.

**FR28:** The system shall show week-over-week spending comparison.

**FR29:** The system shall display monthly spending trend view.

**FR30:** The system shall keep visualizations simple and avoid complex analytics in MVP.

**FR31:** The system shall allow users to set an overall monthly budget goal.

**FR32:** The system shall allow users to set optional category-specific budget limits.

**FR33:** The system shall display visual progress indicators toward budget goals.

**FR34:** The system shall trigger Kash encouragement messages when user is on-track with budget.

**FR35:** The system shall trigger Kash warning messages when user approaches budget limits.

**FR36:** The system shall provide a 3-screen minimal interface: Scan / See / Save.

**FR37:** The system shall implement simple bottom navigation between the 3 core screens.

**FR38:** The Scan screen shall be the primary action screen with prominent QR scanner activation.

**FR39:** The See screen shall display insights dashboard and spending summary.

**FR40:** The Save screen shall show goals, progress tracking, and achievement badges.

### Non-Functional Requirements

**NFR1:** QR code scanning shall process and extract data in under 2 seconds.

**NFR2:** The app shall launch to usable state in under 3 seconds.

**NFR3:** All scrolling and animations shall maintain 60fps for smooth user experience.

**NFR4:** Daily battery usage shall remain under 5% for typical usage patterns (5-10 scans per day).

**NFR5:** GPS/location tracking shall be optimized for battery efficiency using geofencing rather than continuous tracking.

**NFR6:** The system shall achieve 95%+ accuracy in parsing Bulgarian receipt QR codes.

**NFR7:** The app shall support iOS 14+ and Android 10+ devices.

**NFR8:** The app shall work reliably on mid-range Android devices, not just flagship models.

**NFR9:** The system shall scale to support 10,000 concurrent users without major re-architecture.

**NFR10:** Financial data shall be encrypted end-to-end and encrypted at rest in the database.

**NFR11:** The system shall implement OAuth 2.0 secure token-based authentication.

**NFR12:** The system shall comply with GDPR requirements for Bulgarian user data.

**NFR13:** Location tracking shall be opt-in with clear user consent and privacy policy.

**NFR14:** The system shall minimize data collection and anonymize analytics data.

**NFR15:** Receipt data storage shall be minimal (amount, time, category only), with optional encrypted receipt image storage.

**NFR16:** The system shall maintain strong data consistency and ACID compliance for financial transactions.

**NFR17:** API response times shall be under 500ms for 95% of requests.

**NFR18:** The system shall implement proper error handling with user-friendly error messages.

**NFR19:** The system shall include crash reporting and monitoring (Sentry or Firebase Crashlytics).

**NFR20:** The system shall track product analytics for user behavior insights (Mixpanel or Amplitude).

---

## User Interface Design Goals

### Overall UX Vision

Kash Budget's interface embodies "Intelligent Invisible" design—features appear contextually when needed, guided by Kash, while maintaining relentless simplicity. The visual design is warm, approachable, and encouraging (never clinical or judgmental), with Kash's personality infused throughout. Every interaction should feel effortless, requiring minimal cognitive load, with the entire app navigable in under 10 seconds for core actions. The UI celebrates progress and smart choices while maintaining financial seriousness through clear data visualization and trustworthy information architecture.

### Key Interaction Paradigms

**Camera-First Interaction:** The QR scanner is the primary interaction—one tap opens camera, point at receipt QR code, done. Scanning becomes a habitual gesture, like taking a photo.

**Conversational Guidance:** Kash appears in key moments (onboarding, after scans, at milestones) with short, supportive messages. Never blocks the user; always dismissible but engaging.

**Swipe-and-Done Patterns:** Quick categorization corrections via swipe gestures. Location tagging with simple tap-to-confirm. Minimal typing required.

**Progressive Disclosure:** Users see 3 core screens initially. Advanced features (detailed breakdowns, goal editing, credit unlocks) are accessed through intuitive drill-downs, revealed as users become comfortable.

**Haptic Feedback:** Subtle vibrations confirm scans, celebrate milestones, and acknowledge interactions, making the app feel responsive and alive.

### Core Screens and Views

From a product perspective, the most critical screens necessary to deliver the PRD goals are:

1. **Onboarding Flow** - Kash introduction, permissions requests (camera, location), goal-setting wizard
2. **Scan Screen (Primary)** - Large QR scanner button, recent scans list, quick manual entry option
3. **See Screen (Dashboard)** - Week spending summary, category breakdown chart, budget progress bars, Kash insight card
4. **Save Screen (Goals & Progress)** - Monthly budget goals, Treat Yourself budget tracker, credit balance, achievement badges
5. **Transaction Detail** - Individual transaction view with edit options (category, notes, location)
6. **Location Management** - Map view with tagged locations, spending by location, tag management
7. **Category Management** - Category budget allocation, spending by category over time
8. **Settings** - Account settings, notification preferences, privacy controls, app info

### Accessibility

**Target:** WCAG AA compliance for MVP

- High contrast text and UI elements for readability
- Minimum touch target sizes (44x44pt) for all interactive elements
- Screen reader support for visually impaired users
- Haptic feedback alternatives to visual-only cues
- Clear focus indicators for navigation
- Text resizing support without breaking layouts

### Branding

**Brand Personality:** Confident, supportive, non-judgmental, slightly playful but financially responsible

**Color Palette Guidance:**
- Primary: Warm, trustworthy blue-green (financial trustworthiness without corporate coldness)
- Accent: Energetic orange or yellow (celebration, achievements, Kash personality)
- Success: Encouraging green (budget on-track, smart choices)
- Warning: Gentle amber (approaching limits, no harsh reds that create guilt)
- Treat Yourself: Special color (perhaps purple/magenta) to distinguish guilt-free spending

**Typography:** Modern, friendly sans-serif. Readable at small sizes on mobile. Slightly rounded for warmth without being childish.

**Kash Character Design:** Confident, approachable mascot inspired by Snoop Dogg/Michael Jordan vibe—cool but supportive. Character design pending (outsourced to illustrator).

**Motion Design:** Smooth, quick animations. Kash can appear with subtle slide or fade. Scan confirmation with satisfying check animation. Budget progress bars fill smoothly. Celebrate milestones with confetti or sparkle effects.

### Target Device and Platforms

**Mobile Responsive:** iOS and Android mobile apps (MVP is mobile-only)

- **iPhone:** iOS 14+ (iPhone 8 and newer)
- **Android:** Android 10+ (mid-range devices, not just flagships)
- **Responsive Design:** Adapt to various screen sizes from iPhone SE to large Android devices
- **Tablet Support:** Not prioritized for MVP; focus on phone-sized screens
- **Web App:** Out of scope for MVP; future consideration for desktop analytics

---

## Technical Assumptions

### Repository Structure

**Monorepo** (Frontend + Backend + Shared Types)

- Single repository containing mobile app, backend API, and shared TypeScript types
- Workspace structure: `/mobile`, `/backend`, `/shared`
- Simplifies dependency management and code sharing
- Enables atomic commits across frontend and backend changes
- Tools: npm workspaces or Yarn workspaces

**Rationale:** For a small team building a tightly coupled mobile app and API, monorepo reduces coordination overhead and keeps codebase cohesive. Shared types between frontend and backend prevent API contract mismatches.

### Service Architecture

**Monolithic Backend for MVP**

- Single Node.js application handling all API endpoints
- Modules organized by domain (auth, transactions, insights, gamification, notifications)
- RESTful API design with clear resource endpoints
- Design for future microservices extraction (loose coupling between modules)

**Future Evolution:**
- Eventual microservices: Auth Service, Transaction Service, Insights Service, Notification Service
- API Gateway pattern for future service orchestration

**Rationale:** Monolith allows faster MVP development with simpler deployment. As scale and complexity grow, well-organized modules can be extracted into microservices without major rewrites.

### Testing Requirements

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

### Additional Technical Assumptions and Requests

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

## Epic List

Below is the high-level list of all epics for MVP development. Each epic delivers a significant, end-to-end increment of testable functionality that provides tangible value.

**Epic 1: Foundation & Core Infrastructure**
*Goal:* Establish project setup, basic mobile app structure, authentication, and CI/CD pipeline while delivering a functional health-check endpoint and deployable app skeleton.

**Epic 2: QR Receipt Scanning & Transaction Management**
*Goal:* Enable users to scan Bulgarian receipt QR codes, manually enter transactions, and view transaction history—delivering the core data capture functionality.

**Epic 3: Kash Mascot & Onboarding Experience**
*Goal:* Introduce Kash character, create guided onboarding flow, and establish message delivery system for motivational and contextual guidance throughout the app.

**Epic 4: Auto-Categorization & Spending Insights**
*Goal:* Implement ML-powered transaction categorization with user feedback loop and deliver basic spending insights dashboard (category breakdown, weekly summaries).

**Epic 5: GPS Location Tagging & Exit Prompts**
*Goal:* Enable location-based features including tagging frequent spending locations, geofencing exit detection, and proactive transaction entry prompts.

**Epic 6: Budget Goals & Treat Yourself Category**
*Goal:* Allow users to set monthly budget goals, category-specific limits, and introduce the Treat Yourself guilt-free spending category with Kash celebrations.

**Epic 7: Virtual Credits & Gamification**
*Goal:* Implement virtual credits system rewarding scanning behavior, streaks, and milestones to drive engagement and prepare for future freemium model.

**Epic 8: Polish, Performance, & Launch Preparation**
*Goal:* Optimize performance (QR scan speed, app launch time, battery usage), fix bugs, conduct user acceptance testing, and prepare for beta launch.

---

## Epic 1: Foundation & Core Infrastructure

**Epic Goal:** Establish the foundational project structure for both mobile app (React Native) and backend API (NestJS), implement secure authentication system, set up CI/CD pipeline, and deliver a deployable application with health-check functionality. This epic ensures all developers can work in a consistent environment with automated testing and deployment from day one.

### Story 1.1: Project Initialization & Repository Setup

As a **developer**,
I want **a well-structured monorepo with mobile app and backend scaffolded**,
so that **the team can begin development with consistent tooling and organization**.

#### Acceptance Criteria

1. Monorepo created with workspace structure: `/mobile` (React Native), `/backend` (NestJS), `/shared` (TypeScript types)
2. React Native mobile app initialized with TypeScript, targeting iOS 14+ and Android 10+
3. NestJS backend initialized with TypeScript, configured with environment variables
4. Shared workspace configured with npm/yarn workspaces for dependency management
5. README.md includes setup instructions, environment variable documentation, and development commands
6. .gitignore configured for Node.js, React Native, and IDE files
7. Package.json scripts defined for running mobile (`npm run mobile:ios`, `npm run mobile:android`) and backend (`npm run backend:dev`)
8. Both mobile and backend can successfully build and run locally following README instructions

### Story 1.2: Backend Health Check & Database Connection

As a **backend developer**,
I want **a basic API with health-check endpoint and PostgreSQL database connection**,
so that **I can verify the backend infrastructure is working before building features**.

#### Acceptance Criteria

1. PostgreSQL database provisioned (local Docker container for dev, RDS for production)
2. NestJS configured with TypeORM or Prisma for database connection
3. Database connection configuration uses environment variables (DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME)
4. Health check endpoint `GET /health` returns 200 with `{"status": "ok", "database": "connected"}`
5. Health check endpoint fails gracefully with 503 if database is unreachable
6. Database connection pool configured with appropriate limits
7. Basic logging configured with Winston for request logging and error tracking
8. Backend can be started and health check endpoint responds successfully

### Story 1.3: User Authentication System

As a **user**,
I want **to create an account and securely log in to the app**,
so that **my financial data is private and associated with my account**.

#### Acceptance Criteria

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

### Story 1.4: CI/CD Pipeline Setup

As a **developer**,
I want **automated testing and deployment pipeline**,
so that **code changes are validated and deployed consistently without manual steps**.

#### Acceptance Criteria

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

## Epic 2: QR Receipt Scanning & Transaction Management

**Epic Goal:** Deliver the core value proposition of effortless data capture by implementing Bulgarian receipt QR code scanning, manual transaction entry fallback, and transaction history display. Users can begin tracking their spending without manual entry burden.

### Story 2.1: QR Code Scanner UI & Camera Integration

As a **user**,
I want **to activate my device camera to scan receipt QR codes**,
so that **I can quickly capture transaction data without typing**.

#### Acceptance Criteria

1. Scan screen is the default/home screen when app opens (primary action)
2. Large, prominent "Scan Receipt" button is centered on Scan screen
3. Tapping Scan button requests camera permission if not already granted
4. Camera permission request includes clear explanation: "Kash needs camera access to scan receipt QR codes"
5. Camera opens in QR code scanning mode with real-time QR detection
6. QR code detection highlights detected codes with visual overlay
7. When QR code is detected, camera automatically captures and closes (no manual capture button)
8. Loading indicator appears while QR code is being processed
9. If QR scan fails, error message displays with option to retry or enter manually
10. Camera can be dismissed/cancelled returning user to Scan screen

### Story 2.2: Bulgarian Receipt QR Code Parsing

As a **backend system**,
I want **to parse Bulgarian receipt QR code data and extract transaction details**,
so that **transaction amount, date, and time can be automatically captured**.

#### Acceptance Criteria

1. POST /transactions/scan endpoint accepts QR code raw data string
2. Backend parses Bulgarian receipt QR format and extracts: amount (in BGN), timestamp (date and time), merchant identifier (if available)
3. QR parsing handles common Bulgarian receipt formats (research actual format and handle variations)
4. Successfully parsed QR returns transaction data: `{amount, timestamp, merchantName (optional)}`
5. Failed parsing returns 400 Bad Request with error message: "Unable to parse receipt QR code"
6. QR parsing completes in under 2 seconds (NFR1 requirement)
7. QR parser includes logging for debugging parse failures
8. Unit tests cover successful parsing and various failure scenarios (invalid format, missing data)

### Story 2.3: Transaction Creation & History

As a **user**,
I want **scanned transactions to be saved to my account and viewable in a list**,
so that **I can see my recent spending history**.

#### Acceptance Criteria

1. Transaction model/entity created with fields: id, userId, amount, timestamp, category (nullable), location (nullable), source (qr_scan | manual), createdAt
2. POST /transactions endpoint creates new transaction associated with authenticated user
3. Transactions are stored with original timestamp from receipt (not current time)
4. GET /transactions endpoint returns user's transactions ordered by timestamp descending (most recent first)
5. GET /transactions supports pagination: query params `?limit=20&offset=0`
6. Transaction list endpoint includes total count for pagination UI
7. Mobile app displays transaction history below Scan button on Scan screen
8. Each transaction list item shows: amount (in BGN), timestamp (formatted "Today 3:45 PM" or "Nov 16, 2:30 PM"), category (if categorized, else "Uncategorized")
9. Empty state message displays when user has no transactions: "Scan your first receipt to start tracking!"
10. Pull-to-refresh gesture reloads transaction list

### Story 2.4: Manual Transaction Entry

As a **user**,
I want **to manually enter transaction details when QR code scanning fails or I paid with cash**,
so that **I can track all my spending even without receipts**.

#### Acceptance Criteria

1. "Enter Manually" button is visible on Scan screen below Scan button
2. Tapping Enter Manually opens manual entry form modal
3. Manual entry form includes fields: Amount (required, numeric input with BGN currency), Date & Time (defaults to now, editable with picker), Notes (optional text field)
4. Amount input validates positive number with up to 2 decimal places
5. Date/time picker defaults to current date and time
6. "Save" button submits manual transaction via POST /transactions endpoint
7. "Cancel" button closes modal without saving
8. Successfully saved manual transaction appears immediately in transaction history
9. Manual transactions are tagged with source=manual to distinguish from QR scans
10. Form validates required fields and shows error messages for invalid input

---

## Epic 3: Kash Mascot & Onboarding Experience

**Epic Goal:** Introduce users to Kash, the supportive financial coach mascot, through an engaging onboarding flow that explains the app's philosophy and key features. Establish the message delivery system that enables Kash to provide contextual encouragement throughout the user journey.

### Story 3.1: Kash Character Design Integration

As a **user**,
I want **to see the Kash mascot character in the app**,
so that **I feel guided by a friendly companion rather than using a cold financial tool**.

#### Acceptance Criteria

1. Kash character assets (illustrations) are integrated into mobile app (PNG or SVG format)
2. Kash character poses include: greeting, celebration, thinking, encouraging, warning (gentle)
3. Kash component created that displays character with text message bubble
4. Kash component is reusable and can be placed on any screen
5. Kash messages use friendly, supportive tone matching personality guidelines (confident, non-judgmental, Snoop/MJ vibe)
6. Kash visual design is warm, approachable, and modern (not childish or cartoon-like)
7. Kash character is sized appropriately for mobile screens (not too large/intrusive)
8. All Kash poses render correctly on various device sizes (tested on small and large screens)

### Story 3.2: Onboarding Flow with Kash Guidance

As a **new user**,
I want **Kash to guide me through initial app setup and explain key features**,
so that **I understand how to use the app and feel welcomed**.

#### Acceptance Criteria

1. First app launch (after registration) triggers onboarding flow before showing main screens
2. Onboarding consists of 4-5 short screens with Kash introducing the app
3. Onboarding screen 1: Kash greeting - "Hey! I'm Kash, your financial coach. Let's get your money clarity sorted!"
4. Onboarding screen 2: QR scanning explanation - "Just scan your receipt's QR code. That's it. No typing, ever."
5. Onboarding screen 3: Guilt-free philosophy - "I'm here to help you spend smart AND enjoy life. No guilt, just clarity."
6. Onboarding screen 4: Permissions request - "I'll need camera access for scanning and location to remind you to track spending"
7. Each onboarding screen has "Next" button to proceed, final screen has "Get Started" button
8. User can skip onboarding with "Skip" link (not prominent, but available)
9. Permissions are requested within onboarding flow when explained (not abruptly)
10. After onboarding, user lands on Scan screen ready to scan first receipt
11. User cannot return to onboarding after completion (one-time experience)

### Story 3.3: Kash Message Delivery System

As a **user**,
I want **Kash to appear with contextual messages at key moments**,
so that **I receive encouragement and guidance based on my actions**.

#### Acceptance Criteria

1. Kash message system can trigger messages based on user events: first scan, milestone reached, budget status
2. Kash messages include: message text, character pose, optional action button
3. Message model/entity stores: id, userId, messageText, pose, triggerEvent, readAt (nullable), createdAt
4. GET /messages/unread endpoint returns unread Kash messages for authenticated user
5. POST /messages/:id/read marks message as read
6. Kash message card component displays on relevant screens (e.g., dashboard top)
7. Users can dismiss Kash messages (swipe away or tap X button)
8. Dismissed messages are marked as read and don't reappear
9. Kash messages are non-blocking—users can interact with app without dismissing message
10. Maximum 1 Kash message visible at a time (priority to most important/recent)

### Story 3.4: Morning Motivation Messages

As a **user**,
I want **Kash to send me a motivational message each morning**,
so that **I'm encouraged to track my spending and stay engaged with the app**.

#### Acceptance Criteria

1. Backend scheduled job runs daily at 8:00 AM user local time (configurable)
2. Job sends push notification to all active users with morning motivation message
3. Morning messages are randomly selected from pre-defined message bank (10+ variations)
4. Example messages: "Morning! Let's make today a financially smart one 💪", "New day, fresh budget. You got this!", "Ready to track your wins today?"
5. Push notification taps open the app to Scan screen
6. Users can disable morning messages in Settings (opt-out)
7. Morning messages respect user's notification preferences and timezone
8. If user opens app before morning message time, message is marked as delivered in-app instead of notification
9. Morning message creates a Kash message entry in database for in-app display
10. Users who haven't scanned in 7+ days receive re-engagement message: "Miss you! Let's get back on track."

---

## Epic 4: Auto-Categorization & Spending Insights

**Epic Goal:** Implement machine learning-powered transaction categorization that learns from user feedback, reducing manual work to near-zero after initial training. Deliver spending insights dashboard that reveals patterns and provides the "aha moments" that solve the financial fog problem.

### Story 4.1: Pre-defined Spending Categories

As a **user**,
I want **a set of common spending categories to organize my transactions**,
so that **I can see where my money goes by category**.

#### Acceptance Criteria

1. Category model/entity created with fields: id, name, icon, color, isDefault, displayOrder
2. Database seeded with 8 default categories on app initialization: Groceries, Dining, Transport, Entertainment, Shopping, Bills, Health, Treat Yourself
3. Each category has an associated icon (emoji or icon font) and color for visual distinction
4. Categories are returned via GET /categories endpoint ordered by displayOrder
5. Mobile app caches categories locally for offline access
6. Treat Yourself category is visually distinct (special color, icon) to highlight guilt-free spending
7. Categories cannot be deleted by users in MVP (fixed set)
8. Future: Allow custom category creation (out of scope for MVP)

### Story 4.2: Manual Transaction Categorization

As a **user**,
I want **to assign categories to my first 5-10 transactions manually**,
so that **the app learns my spending patterns and can auto-categorize future transactions**.

#### Acceptance Criteria

1. Transaction detail screen accessible by tapping transaction in history list
2. Transaction detail displays full transaction info: amount, timestamp, location (if available), current category
3. "Change Category" button opens category picker with all available categories
4. Category picker is visual (grid of category cards with icons and names)
5. Selecting a category updates transaction and closes picker
6. PATCH /transactions/:id endpoint updates transaction category
7. Updated transaction immediately reflects new category in history list
8. First time user categorizes a transaction, Kash message explains: "Nice! The more you categorize, the smarter I get at auto-categorizing for you."
9. After user manually categorizes 5 transactions, Kash message: "You've trained me! I'll start auto-categorizing your future transactions."
10. User can re-categorize any transaction at any time (corrections improve ML model)

### Story 4.3: ML-Powered Auto-Categorization

As a **backend system**,
I want **to use machine learning to predict transaction categories based on historical user behavior**,
so that **users don't have to manually categorize most transactions after initial training**.

#### Acceptance Criteria

1. ML categorization service implemented (TensorFlow Lite model or rule-based with ML future enhancement)
2. Model trains on user's manually categorized transactions (minimum 5 transactions required for training)
3. Model uses features: transaction amount range, merchant name (if available), time of day, day of week
4. For new transactions after training, model predicts category with confidence score
5. Auto-categorization applied if confidence score > 70%
6. Transactions with low confidence (<70%) remain uncategorized and prompt user to categorize
7. User corrections on auto-categorized transactions feed back into model for retraining (online learning or batch retraining)
8. Auto-categorization achieves 90%+ accuracy after 20+ transactions (NFR requirement)
9. ML categorization completes in under 500ms (doesn't block transaction creation)
10. Fallback to rule-based categorization (keyword matching on merchant names) if ML model not yet trained

### Story 4.4: Spending Insights Dashboard

As a **user**,
I want **to see a summary of my spending by category and over time**,
so that **I understand my spending patterns and identify areas to improve**.

#### Acceptance Criteria

1. "See" screen displays spending insights dashboard
2. Dashboard shows current week spending summary: total spent this week in BGN
3. Dashboard displays top spending categories as pie chart or bar chart (visual breakdown)
4. Each category slice/bar shows category name, amount spent, and percentage of total
5. Week-over-week comparison widget: "This week: 450 BGN | Last week: 380 BGN" with up/down indicator
6. Monthly trend chart displays spending over past 4 weeks (simple line or bar chart)
7. GET /insights/weekly endpoint returns aggregated spending data for current week grouped by category
8. GET /insights/trends endpoint returns weekly spending totals for past 4 weeks
9. Dashboard includes Kash insight card with personalized message: "You spent 40% less on Dining this week! 🎉"
10. Dashboard charts are simple and uncluttered (avoid complex analytics in MVP)

---

## Epic 5: GPS Location Tagging & Exit Prompts

**Epic Goal:** Enable proactive location-based behavioral coaching by allowing users to tag frequent spending locations and implementing geofencing exit detection that prompts users to record transactions. This solves the "forgetting to track" problem and creates a unique product differentiator.

### Story 5.1: GPS Location Tagging

As a **user**,
I want **to tag stores and restaurants I frequently visit**,
so that **I can see my spending history by location and enable location-based reminders**.

#### Acceptance Criteria

1. Transaction model includes location field: JSON with {latitude, longitude, name (optional)}
2. Location is automatically captured when scanning QR code (device GPS coordinates at scan time)
3. POST /transactions includes optional location payload if GPS permission granted
4. Transaction detail screen displays map pin icon if transaction has location data
5. Tapping map pin opens location detail view with map showing transaction location
6. Location detail view shows all transactions at same location (within 50m radius)
7. "Tag This Location" button on location detail allows user to save as tagged location
8. Tagged location creation prompts user for location name (e.g., "Kaufland Sofia Center")
9. TaggedLocation model/entity: id, userId, name, latitude, longitude, createdAt
10. GET /locations endpoint returns user's tagged locations

### Story 5.2: Auto-Suggest Location Tagging

As a **user**,
I want **the app to suggest tagging a location after I've visited it multiple times**,
so that **I don't have to manually tag every frequent location**.

#### Acceptance Criteria

1. Backend detects when user has 2+ transactions at same GPS coordinates (within 50m radius)
2. After 2nd transaction at same location, system suggests location tagging via Kash message
3. Kash message: "Looks like you visit [approximate address] often! Want to tag it for tracking?"
4. Message includes "Tag Location" action button and "Not Now" dismiss option
5. Tapping "Tag Location" opens pre-filled location tagging form with suggested name from reverse geocoding
6. User can edit suggested name before saving tagged location
7. Once location is tagged, suggestion doesn't repeat for that location
8. Auto-suggest respects a maximum of 1 suggestion per day (avoid notification fatigue)
9. Reverse geocoding service (Google Maps API or similar) provides approximate address/place name
10. Auto-suggest only triggers if GPS permission is granted

### Story 5.3: Geofencing Setup & Exit Detection

As a **backend system**,
I want **to set up geofences around user's tagged locations and detect when they exit**,
so that **exit prompt notifications can be triggered for transaction entry reminders**.

#### Acceptance Criteria

1. When user creates tagged location, system registers geofence with 100m radius around location
2. Mobile app geofencing service monitors user's location in background (when app is backgrounded)
3. Geofencing uses battery-efficient techniques (iOS region monitoring, Android geofencing API)
4. When user exits a geofenced tagged location, mobile app triggers local notification
5. Exit detection has appropriate dwell time threshold (minimum 3 minutes inside geofence before exit triggers)
6. Geofence exit event is logged to backend: POST /events/geofence-exit with locationId and timestamp
7. Mobile app handles geofence exit events even when app is closed/backgrounded (background tasks)
8. Maximum 10 geofences active at a time (system limitations), prioritize most frequently visited locations
9. Geofencing respects user's location permission (continuous background location required, clearly explained)
10. Geofencing can be disabled in app Settings

### Story 5.4: Exit Prompt Notifications

As a **user**,
I want **to receive a gentle reminder to log my spending when I leave a tagged location**,
so that **I don't forget to track transactions and maintain complete spending records**.

#### Acceptance Criteria

1. Geofence exit triggers local push notification: "Did you spend at [Location Name]?"
2. Notification includes quick actions: "Scan Receipt" / "Enter Amount" / "Skip"
3. Tapping "Scan Receipt" opens app directly to QR scanner
4. Tapping "Enter Amount" opens app to manual entry form with location pre-filled
5. Tapping "Skip" dismisses notification without opening app
6. Notification is respectful and non-intrusive (gentle tone, not accusatory)
7. Notification respects quiet hours (no notifications between 10 PM - 8 AM)
8. If user doesn't interact with notification within 1 hour, it auto-dismisses (avoid stale notifications)
9. Exit prompts are throttled: maximum 1 per location per day (avoid repeated prompts for same visit)
10. Users can disable exit prompts entirely in Settings with Kash explanation: "Okay, I won't remind you. But tracking consistently helps me give you better insights!"

---

## Epic 6: Budget Goals & Treat Yourself Category

**Epic Goal:** Enable users to set financial goals and track progress, providing the control and accountability they seek. Introduce the Treat Yourself guilt-free spending category that operationalizes the product's core emotional value proposition, differentiating from restrictive budget apps.

### Story 6.1: Monthly Budget Goal Setting

As a **user**,
I want **to set a monthly spending budget goal**,
so that **I can track my progress and stay accountable to my financial intentions**.

#### Acceptance Criteria

1. "Save" screen (3rd main screen) displays budget goals and progress
2. "Set Monthly Budget" button opens budget goal setting form
3. Budget goal form allows user to enter total monthly budget amount (in BGN)
4. User can optionally set start date (defaults to 1st of current month)
5. Budget goal model/entity: id, userId, monthYear, totalBudget, createdAt
6. POST /budget-goals endpoint creates monthly budget goal for authenticated user
7. Budget progress widget on Save screen shows: "450 / 1500 BGN spent this month (30%)"
8. Progress bar visualizes budget utilization with color coding: green (<70%), yellow (70-90%), red (>90%)
9. Kash message when user is on track (< 70%): "You're doing great! 🙌 70% of budget remaining."
10. Kash warning when approaching limit (> 90%): "Heads up—you're at 90% of your monthly budget. Let's be mindful!"

### Story 6.2: Category-Specific Budget Limits

As a **user**,
I want **to set spending limits for specific categories**,
so that **I can control my spending in areas where I tend to overspend**.

#### Acceptance Criteria

1. Budget goal detail screen shows option to "Set Category Limits"
2. Category limit form displays all spending categories with input fields for monthly limit amounts
3. Category limits are optional (user can set limits for some categories and leave others unlimited)
4. CategoryBudgetLimit model/entity: id, budgetGoalId, categoryId, limitAmount
5. Category budget limits are stored associated with parent monthly budget goal
6. Spending insights dashboard shows category progress: "Dining: 120 / 200 BGN (60%)"
7. Category budget bars use same color coding as overall budget (green/yellow/red)
8. Kash provides category-specific encouragement: "Your Groceries spending is 20% under limit this week!"
9. Kash warning when category limit exceeded: "Oops, you've gone 15 BGN over your Dining budget. Want to adjust or move funds from another category?"
10. Category limits can be edited/updated at any time

### Story 6.3: Treat Yourself Budget Category Setup

As a **user**,
I want **to set aside a dedicated budget for guilt-free spending**,
so that **I can enjoy discretionary purchases without feeling bad**.

#### Acceptance Criteria

1. During budget goal setup, Treat Yourself category is highlighted separately
2. Budget goal form prompts user: "How much do you want for guilt-free treats this month?"
3. Treat Yourself budget is clearly explained: "This is YOUR money for joy—coffee, movies, whatever makes you happy. No guilt!"
4. Treat Yourself category has a special visual design (distinct color, icon) in budget UI
5. Treat Yourself budget allocation is part of overall monthly budget (not additional)
6. User can allocate percentage of total budget (e.g., 10%) or fixed amount to Treat Yourself
7. Treat Yourself spending tracked separately with positive messaging
8. Save screen displays Treat Yourself budget prominently: "Treat Yourself Budget: 80 / 150 BGN (53%) 🎉"
9. Progress bar for Treat Yourself uses encouraging colors (never red/warning state)
10. Kash celebrates when user spends from Treat Yourself: "Enjoy that! You've earned it and it's within your treat budget. 😊"

### Story 6.4: Budget Goal Progress Tracking & Insights

As a **user**,
I want **to see real-time progress toward my budget goals throughout the month**,
so that **I can make informed spending decisions and adjust behavior if needed**.

#### Acceptance Criteria

1. GET /budget-goals/current endpoint returns current month's budget goal with aggregated spending data
2. Budget progress updates in real-time as new transactions are added
3. Save screen displays days remaining in month: "12 days left in November"
4. Projected spending widget shows forecast: "At this pace, you'll spend 1,420 BGN (within budget!)"
5. Projection uses current daily average spend to estimate month-end total
6. Weekly mini-summary Kash message: "Week 2 of November: You spent 280 BGN. You're 15% under your weekly target!"
7. If user is on pace to exceed budget, Kash provides proactive coaching: "Heads up—you're trending 120 BGN over budget. Want tips to adjust?"
8. Budget insights include comparison to previous months: "You're spending 10% less than October!"
9. Budget reset happens automatically on 1st of each month with option to roll over or set new budget
10. Budget history accessible: users can view past months' budget performance

---

## Epic 7: Virtual Credits & Gamification

**Epic Goal:** Implement the virtual credits gamification system that rewards users for consistent scanning behavior, streak maintenance, and milestone achievements. This drives engagement, creates habit formation, and prepares the infrastructure for future freemium monetization.

### Story 7.1: Virtual Credits System Foundation

As a **backend system**,
I want **to track virtual credits for each user and provide APIs for awarding and redeeming credits**,
so that **the gamification system can reward user behavior**.

#### Acceptance Criteria

1. User model extended with field: creditBalance (integer, default 0)
2. CreditTransaction model/entity created: id, userId, amount (positive for earning, negative for spending), reason, transactionType (scan | streak | milestone | unlock), createdAt
3. POST /credits/award endpoint adds credits to user balance and logs credit transaction
4. POST /credits/spend endpoint deducts credits and logs spending transaction
5. GET /credits/balance endpoint returns current user credit balance
6. GET /credits/history endpoint returns user's credit transaction history with pagination
7. Credit balance updates are atomic (database transaction ensures consistency)
8. Credit balance cannot go negative (validation prevents spending more than available)
9. Mobile app displays credit balance prominently in header or navigation bar (coin icon + number)
10. Tapping credit balance opens credit history modal showing all earned/spent credits

### Story 7.2: Credits for Scanning Receipts

As a **user**,
I want **to earn credits every time I scan a receipt**,
so that **I'm rewarded for actively tracking my spending**.

#### Acceptance Criteria

1. After successful QR code scan and transaction creation, backend awards credits to user
2. Credit award amount is progressive based on user's scanning habit level:
   - First 10 scans: 5 credits each
   - Scans 11-30: 10 credits each
   - Scans 31-100: 15 credits each
   - Scans 100+: 20 credits each
3. Credit award reason logged: "Scanned receipt"
4. Mobile app displays toast notification after scan: "Receipt saved! +10 credits earned 🪙"
5. Credit award is immediate (synchronous with transaction creation)
6. Manual transaction entries do not earn credits (only QR scans to incentivize effortless behavior)
7. Progressive credit levels are explained in-app: "Scan more to level up your rewards!"
8. Credit earning is capped at 10 scans per day to prevent gaming the system
9. Kash celebrates first scan credit earning: "Nice! You just earned your first credits. Keep scanning to earn more!"
10. Credit balance updates visibly in UI after earning (animated increment)

### Story 7.3: Streak Bonuses & Milestone Credits

As a **user**,
I want **to earn bonus credits for maintaining scanning streaks and reaching milestones**,
so that **I'm motivated to build consistent tracking habits**.

#### Acceptance Criteria

1. Backend tracks user's scanning streak: consecutive days with at least 1 scan
2. Streak bonus credits awarded for maintaining streaks:
   - 3-day streak: 25 bonus credits
   - 7-day streak: 75 bonus credits
   - 14-day streak: 150 bonus credits
   - 30-day streak: 500 bonus credits
3. Streak resets to 0 if user doesn't scan for 24+ hours
4. Backend scheduled job runs daily to check streaks and award bonuses
5. Milestone credits awarded for total scans:
   - 10 scans: 50 credits
   - 50 scans: 200 credits
   - 100 scans: 500 credits
6. Kash message celebrates streaks: "7 days in a row! You're on fire 🔥 Here's 75 bonus credits!"
7. Kash message warns when streak is at risk: "Don't forget to scan today to keep your 5-day streak alive!"
8. Save screen displays current streak: "🔥 5-day streak" with next milestone
9. Achievement badges displayed on Save screen for completed milestones
10. Credit history shows streak/milestone bonuses with special icons

### Story 7.4: Credit Display & Future Premium Feature Unlocks

As a **user**,
I want **to see my credit balance and understand what I can unlock in the future**,
so that **I'm motivated to earn credits and understand their value**.

#### Acceptance Criteria

1. Credit balance displayed in app header/nav: "1,250 🪙"
2. Tapping credit balance opens "Your Credits" screen
3. Your Credits screen shows: current balance, total earned (lifetime), recent credit transactions
4. "Coming Soon: Unlock Premium Features" section displays future unlockable features with credit costs:
   - "Predictive Insights (1,000 credits)"
   - "Spending Heat Maps (1,500 credits)"
   - "Export to Excel (500 credits)"
5. Future features are disabled/locked in UI with "Unlock with credits" label
6. Early adopters receive message: "As an early user, you'll keep these features free forever when we launch!"
7. Credit earning is explained clearly: "Earn credits by scanning receipts, maintaining streaks, and hitting milestones"
8. Kash provides credit coaching: "You're halfway to unlocking Predictive Insights! Keep scanning!"
9. Credit balance persists across app sessions (stored in backend, synced to mobile)
10. Credits have no expiration date (users keep earned credits forever)

---

## Epic 8: Polish, Performance, & Launch Preparation

**Epic Goal:** Optimize application performance to meet non-functional requirements, fix bugs discovered during development, conduct thorough testing with real users, and prepare the app for beta launch. Ensure the app is stable, fast, and delivers on the "10-second daily interaction" promise.

### Story 8.1: QR Scanning Performance Optimization

As a **user**,
I want **QR code scanning to be nearly instantaneous**,
so that **the effortless experience lives up to the product promise**.

#### Acceptance Criteria

1. QR code detection latency measured: target < 1 second from camera open to code detection
2. QR code parsing backend API response time < 1 second (measured with production-like data)
3. Total time from "Scan Receipt" tap to transaction saved < 2 seconds (NFR1 requirement met)
4. Camera initialization optimized to reduce delay before QR detection starts
5. QR parsing endpoint includes performance logging to identify slow parsing cases
6. Load testing performed: QR parsing endpoint handles 100 concurrent requests without degradation
7. QR scanning tested on mid-range Android devices (not just flagship iPhones) to ensure performance
8. Network latency accounted for: mobile app shows loading state during API call
9. Offline QR detection implemented: camera detects QR locally before sending to backend (reduces perceived latency)
10. Performance regression tests added: CI fails if QR scan endpoint response time exceeds threshold

### Story 8.2: App Launch Time & Battery Optimization

As a **user**,
I want **the app to open quickly and not drain my phone battery**,
so that **I use it frequently without frustration or worrying about battery life**.

#### Acceptance Criteria

1. App launch time measured: target < 3 seconds from tap to usable Scan screen (NFR2 requirement)
2. Cold start time optimized: lazy load non-essential screens (See, Save) after Scan screen renders
3. Splash screen displays immediately while app initializes (no black screen delay)
4. Background geofencing tested for battery impact: target < 5% daily battery drain (NFR4 requirement)
5. Geofencing uses efficient strategies: significant location change monitoring, not continuous GPS
6. Background tasks optimized to minimize CPU wake-ups
7. Network requests batched where possible to reduce radio-on time
8. Battery usage tested over 7-day period with typical usage (5-10 scans per day, geofencing enabled)
9. Battery usage stats reported via app Settings screen for transparency
10. Performance profiling conducted with Xcode Instruments (iOS) and Android Profiler to identify battery drains

### Story 8.3: Bug Fixes & Edge Case Handling

As a **developer**,
I want **to fix all known bugs and handle edge cases gracefully**,
so that **users have a stable, frustration-free experience**.

#### Acceptance Criteria

1. Bug tracking system (GitHub Issues or Jira) reviewed: all P0/P1 bugs resolved before launch
2. Edge cases documented and handled:
   - No internet connection: graceful offline mode with queued transactions
   - GPS permission denied: app functions without location features, clear explanation provided
   - Camera permission denied: manual entry as fallback, clear re-permission instructions
   - Invalid QR codes: helpful error message with manual entry fallback
   - Concurrent transaction creation: prevent duplicate transactions
3. Error messages are user-friendly (no technical jargon or stack traces exposed)
4. All API error responses include clear error codes and messages for mobile app to display
5. Mobile app handles network timeouts gracefully (retry mechanism or offline queue)
6. Database constraints prevent data corruption (unique constraints, foreign key validation)
7. Regression testing performed: previously fixed bugs verified as still resolved
8. Crash reporting analyzed: no unhandled exceptions in production logs
9. Input validation comprehensive: all user inputs sanitized and validated (prevent SQL injection, XSS)
10. Security audit performed: no exposed secrets, secure authentication, encrypted data storage verified

### Story 8.4: User Acceptance Testing & Beta Launch

As a **product team**,
I want **to conduct thorough user acceptance testing with real users before public launch**,
so that **we validate product-market fit and identify any critical issues**.

#### Acceptance Criteria

1. Beta test plan created: 50-100 beta users recruited from target demographic (Bulgaria, ages 25-45)
2. Beta users onboarded with instructions: how to use app, what to focus on, feedback channels (in-app form, email)
3. Beta testing period: minimum 2 weeks of active usage
4. Success metrics tracked during beta:
   - 60%+ users scan at least 3 receipts per week (Engagement Success)
   - 50%+ users still active after 2 weeks (Retention Success)
   - QR scanning works with 95%+ accuracy on real Bulgarian receipts (Technical Success)
   - 40%+ users achieve 7-day streak (Habit Formation)
5. User feedback collected via in-app survey: satisfaction rating (1-5), "Do you feel more in control?", "What do you like/dislike?"
6. NPS survey sent to beta users: "How likely are you to recommend Kash Budget to a friend?"
7. Feedback analyzed and prioritized: critical issues fixed before public launch, nice-to-haves added to backlog
8. Beta users rewarded: early adopter status, lifetime premium access, bonus credits
9. App Store and Google Play listings prepared: screenshots, description, keywords optimized
10. Public launch readiness checklist completed: backend scaled to 10,000 users, monitoring in place, support channels established, privacy policy published

---

## Checklist Results Report

_(This section will be populated after executing the PM checklist to validate PRD completeness and quality.)_

---

## Next Steps

### UX Expert Prompt

"Please review this PRD and create a comprehensive design system and wireframes for Kash Budget. Focus on the 3-screen minimal interface (Scan / See / Save), Kash character integration, and the Treat Yourself category visual differentiation. The design should embody 'Intelligent Invisible' principles—simple, warm, and encouraging. Deliverables: design system documentation, high-fidelity mockups for all core screens, and interaction design specifications."

### Architect Prompt

"Please review this PRD and create a comprehensive technical architecture document for Kash Budget. Define the system architecture (React Native mobile app + NestJS backend + PostgreSQL), API specifications, database schema, authentication flow, QR parsing implementation, geofencing strategy, ML categorization approach, and deployment architecture on AWS. Ensure the architecture supports the 10-second interaction requirement, 95% QR accuracy, and scalability to 10,000 users. Deliverables: architecture document with diagrams, API contract specifications, database ERD, and deployment pipeline design."

---

*PRD v1.0 - Created 2025-11-17 using BMAD-METHOD™*
