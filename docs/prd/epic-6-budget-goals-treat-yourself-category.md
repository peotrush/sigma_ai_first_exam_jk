# Epic 6: Budget Goals & Treat Yourself Category

**Epic Goal:** Enable users to set financial goals and track progress, providing the control and accountability they seek. Introduce the Treat Yourself guilt-free spending category that operationalizes the product's core emotional value proposition, differentiating from restrictive budget apps.

## Story 6.1: Monthly Budget Goal Setting

As a **user**,
I want **to set a monthly spending budget goal**,
so that **I can track my progress and stay accountable to my financial intentions**.

### Acceptance Criteria

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

## Story 6.2: Category-Specific Budget Limits

As a **user**,
I want **to set spending limits for specific categories**,
so that **I can control my spending in areas where I tend to overspend**.

### Acceptance Criteria

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

## Story 6.3: Treat Yourself Budget Category Setup

As a **user**,
I want **to set aside a dedicated budget for guilt-free spending**,
so that **I can enjoy discretionary purchases without feeling bad**.

### Acceptance Criteria

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

## Story 6.4: Budget Goal Progress Tracking & Insights

As a **user**,
I want **to see real-time progress toward my budget goals throughout the month**,
so that **I can make informed spending decisions and adjust behavior if needed**.

### Acceptance Criteria

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
