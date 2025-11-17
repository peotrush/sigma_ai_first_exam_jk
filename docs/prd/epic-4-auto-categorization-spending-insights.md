# Epic 4: Auto-Categorization & Spending Insights

**Epic Goal:** Implement machine learning-powered transaction categorization that learns from user feedback, reducing manual work to near-zero after initial training. Deliver spending insights dashboard that reveals patterns and provides the "aha moments" that solve the financial fog problem.

## Story 4.1: Pre-defined Spending Categories

As a **user**,
I want **a set of common spending categories to organize my transactions**,
so that **I can see where my money goes by category**.

### Acceptance Criteria

1. Category model/entity created with fields: id, name, icon, color, isDefault, displayOrder
2. Database seeded with 8 default categories on app initialization: Groceries, Dining, Transport, Entertainment, Shopping, Bills, Health, Treat Yourself
3. Each category has an associated icon (emoji or icon font) and color for visual distinction
4. Categories are returned via GET /categories endpoint ordered by displayOrder
5. Mobile app caches categories locally for offline access
6. Treat Yourself category is visually distinct (special color, icon) to highlight guilt-free spending
7. Categories cannot be deleted by users in MVP (fixed set)
8. Future: Allow custom category creation (out of scope for MVP)

## Story 4.2: Manual Transaction Categorization

As a **user**,
I want **to assign categories to my first 5-10 transactions manually**,
so that **the app learns my spending patterns and can auto-categorize future transactions**.

### Acceptance Criteria

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

## Story 4.3: ML-Powered Auto-Categorization

As a **backend system**,
I want **to use machine learning to predict transaction categories based on historical user behavior**,
so that **users don't have to manually categorize most transactions after initial training**.

### Acceptance Criteria

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

## Story 4.4: Spending Insights Dashboard

As a **user**,
I want **to see a summary of my spending by category and over time**,
so that **I understand my spending patterns and identify areas to improve**.

### Acceptance Criteria

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
