# Epic 3: Kash Mascot & Onboarding Experience

**Epic Goal:** Introduce users to Kash, the supportive financial coach mascot, through an engaging onboarding flow that explains the app's philosophy and key features. Establish the message delivery system that enables Kash to provide contextual encouragement throughout the user journey.

## Story 3.1: Kash Character Design Integration

As a **user**,
I want **to see the Kash mascot character in the app**,
so that **I feel guided by a friendly companion rather than using a cold financial tool**.

### Acceptance Criteria

1. Kash character assets (illustrations) are integrated into mobile app (PNG or SVG format)
2. Kash character poses include: greeting, celebration, thinking, encouraging, warning (gentle)
3. Kash component created that displays character with text message bubble
4. Kash component is reusable and can be placed on any screen
5. Kash messages use friendly, supportive tone matching personality guidelines (confident, non-judgmental, Snoop/MJ vibe)
6. Kash visual design is warm, approachable, and modern (not childish or cartoon-like)
7. Kash character is sized appropriately for mobile screens (not too large/intrusive)
8. All Kash poses render correctly on various device sizes (tested on small and large screens)

## Story 3.2: Onboarding Flow with Kash Guidance

As a **new user**,
I want **Kash to guide me through initial app setup and explain key features**,
so that **I understand how to use the app and feel welcomed**.

### Acceptance Criteria

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

## Story 3.3: Kash Message Delivery System

As a **user**,
I want **Kash to appear with contextual messages at key moments**,
so that **I receive encouragement and guidance based on my actions**.

### Acceptance Criteria

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

## Story 3.4: Morning Motivation Messages

As a **user**,
I want **Kash to send me a motivational message each morning**,
so that **I'm encouraged to track my spending and stay engaged with the app**.

### Acceptance Criteria

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
