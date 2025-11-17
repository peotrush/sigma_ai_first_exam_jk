# Requirements

## Functional Requirements

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

## Non-Functional Requirements

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
