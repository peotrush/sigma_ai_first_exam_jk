# Epic 7: Virtual Credits & Gamification

**Epic Goal:** Implement the virtual credits gamification system that rewards users for consistent scanning behavior, streak maintenance, and milestone achievements. This drives engagement, creates habit formation, and prepares the infrastructure for future freemium monetization.

## Story 7.1: Virtual Credits System Foundation

As a **backend system**,
I want **to track virtual credits for each user and provide APIs for awarding and redeeming credits**,
so that **the gamification system can reward user behavior**.

### Acceptance Criteria

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

## Story 7.2: Credits for Scanning Receipts

As a **user**,
I want **to earn credits every time I scan a receipt**,
so that **I'm rewarded for actively tracking my spending**.

### Acceptance Criteria

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

## Story 7.3: Streak Bonuses & Milestone Credits

As a **user**,
I want **to earn bonus credits for maintaining scanning streaks and reaching milestones**,
so that **I'm motivated to build consistent tracking habits**.

### Acceptance Criteria

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

## Story 7.4: Credit Display & Future Premium Feature Unlocks

As a **user**,
I want **to see my credit balance and understand what I can unlock in the future**,
so that **I'm motivated to earn credits and understand their value**.

### Acceptance Criteria

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
