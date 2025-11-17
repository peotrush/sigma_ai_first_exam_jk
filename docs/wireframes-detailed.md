# Kash Budget - Detailed Wireframe Specifications

**Document Version:** 1.0
**Last Updated:** 2025-11-17
**Related Documents:** [Front-End Spec](front-end-spec.md), [PRD](prd.md)

This document provides granular wireframe specifications for all 8 core screens in the Kash Budget mobile application, including precise element positioning, dimensions, hierarchy, and spacing details.

---

## Design Grid System

All screens follow a consistent 8px grid system with the following foundation:

- **Screen Width:** 375px (iPhone SE base, scales responsively)
- **Safe Area Top:** 44px (status bar + notch accommodation)
- **Safe Area Bottom:** 34px (home indicator on newer iPhones)
- **Horizontal Padding:** 16px (standard edge margins)
- **Vertical Rhythm:** Multiples of 8px (8, 16, 24, 32, 48, 64)
- **Component Spacing:** 12px (between related elements), 24px (between sections)

---

## Screen 1: Onboarding Flow

### Screen 1.1: Splash Screen

**Duration:** 2 seconds (auto-transition)

```
┌─────────────────────────────────────┐
│  STATUS BAR (44px)                  │
├─────────────────────────────────────┤
│                                     │
│           [VERTICAL CENTER]         │
│                                     │
│      ┌─────────────────────┐       │
│      │                     │       │
│      │   KASH LOGO         │       │ 120x120px
│      │   (Mascot Head)     │       │ Center aligned
│      │                     │       │
│      └─────────────────────┘       │
│                                     │
│         Kash Budget                 │ H1: 32px, Bold
│                                     │ Center aligned
│                                     │ Primary color (#2A9D8F)
│                                     │
│     [Loading animation]             │ 40px width spinner
│                                     │ 24px below title
│                                     │
├─────────────────────────────────────┤
│  SAFE AREA BOTTOM (34px)            │
└─────────────────────────────────────┘
```

**Elements:**
- **Kash Logo:** 120x120px, centered horizontally and vertically
- **App Name:** H1 typography, 32px below logo
- **Loading Spinner:** Accent color (#E9C46A), 24px below app name
- **Background:** White (#FFFFFF)

---

### Screen 1.2: Welcome Screen - Kash Greeting

```
┌─────────────────────────────────────┐
│  STATUS BAR (44px)                  │
├─────────────────────────────────────┤
│  [Skip] ───────────────────────────┤ Top-right, 16px margin
│                                     │ Small text, Neutral-600
│         [Progress: 1/4]             │
│     ●○○○                            │ 24px below status bar
│                                     │ Center aligned
│  ┌────────┐                         │
│  │        │                         │
│  │  KASH  │ 80x80px                 │ 48px below progress
│  │        │ Left: 16px              │
│  └────────┘                         │
│                                     │
│  "Hey there! I'm Kash,             │ H2: 24px, Bold
│   your budget buddy."               │ Left: 16px
│                                     │ Top: 12px below Kash
│                                     │
│  No judgment, no guilt—just        │ Body: 16px, Regular
│  smart choices and real talk       │ Left: 16px, Right: 16px
│  about your money.                  │ Top: 16px below heading
│                                     │ Line-height: 24px
│                                     │
│  [Illustration]                     │ 343x200px
│  QR scanner + phone visual          │ 32px below body text
│                                     │ Centered
│                                     │
│                                     │
│  ┌─────────────────────────────┐   │
│  │   Let's Get Started         │   │ 343x56px button
│  └─────────────────────────────┘   │ Primary color fill
│                                     │ 24px from bottom
│                                     │ 16px horizontal margin
├─────────────────────────────────────┤
│  SAFE AREA BOTTOM (34px)            │
└─────────────────────────────────────┘
```

**Elements:**
1. **Skip Button:** Top-right, Small text (14px), Neutral-600, tap target 44x44px
2. **Progress Indicator:** 4 dots, active dot Primary color, inactive Neutral-300, 8px between dots
3. **Kash Avatar:** 80x80px circular avatar, Primary color background
4. **Greeting Header:** H2 (24px Bold), Neutral-900, 12px below avatar
5. **Description Text:** Body (16px Regular), Neutral-700, 16px below header, line-height 24px
6. **Illustration:** 343x200px, centered, 32px below text
7. **CTA Button:** PrimaryButton component, 343x56px, 24px from safe area bottom

---

### Screen 1.3: QR Scanning Explanation

```
┌─────────────────────────────────────┐
│  STATUS BAR (44px)                  │
├─────────────────────────────────────┤
│  [Skip] ───────────────────────────┤
│                                     │
│         [Progress: 2/4]             │
│     ○●○○                            │
│                                     │
│  ┌────────────────────────────────┐│
│  │                                ││ 343x240px
│  │   [Animation/Illustration]     ││ Centered
│  │                                ││ 48px below progress
│  │   Phone scanning receipt QR    ││
│  │   with checkmark animation     ││
│  │                                ││
│  └────────────────────────────────┘│
│                                     │
│  One Tap to Track                  │ H2: 24px Bold
│                                     │ Center aligned
│                                     │ 24px below illustration
│                                     │
│  In Bulgaria, every receipt has    │ Body: 16px Regular
│  a QR code. Just scan it and       │ Center aligned
│  Kash does the rest—no typing,     │ 16px horizontal padding
│  no hassle.                         │ 16px below header
│                                     │ Line-height: 24px
│                                     │
│  ✓ Instant capture                 │ Small: 14px Regular
│  ✓ Auto-categorization             │ Left: 32px (bullet offset)
│  ✓ Location tagged                 │ 24px below description
│                                     │ 12px between items
│                                     │ Success color (#06D6A0)
│                                     │
│  ┌─────────────────────────────┐   │
│  │   Next                      │   │ 343x56px
│  └─────────────────────────────┘   │ 24px from bottom
│                                     │
│  ┌─────────────────────────────┐   │
│  │   Back                      │   │ 343x56px
│  └─────────────────────────────┘   │ 12px below Next button
│                                     │ Secondary variant
├─────────────────────────────────────┤
│  SAFE AREA BOTTOM (34px)            │
└─────────────────────────────────────┘
```

**Elements:**
1. **Skip Button:** Consistent with previous screen
2. **Progress Indicator:** 2nd dot active
3. **Illustration:** 343x240px animated illustration, centered, 48px from progress dots
4. **Header:** H2 (24px Bold), center-aligned, Neutral-900
5. **Description:** Body (16px Regular), center-aligned, 16px horizontal padding
6. **Feature List:** 3 items with checkmark icons, 12px spacing, Success color
7. **Next Button:** PrimaryButton, primary variant
8. **Back Button:** PrimaryButton, secondary variant, 12px below Next

---

### Screen 1.4: Guilt-Free Philosophy

```
┌─────────────────────────────────────┐
│  STATUS BAR (44px)                  │
├─────────────────────────────────────┤
│  [Skip] ───────────────────────────┤
│                                     │
│         [Progress: 3/4]             │
│     ○○●○                            │
│                                     │
│  ┌────────────────────────────────┐│
│  │                                ││ 343x220px
│  │   [Illustration]               ││
│  │                                ││
│  │   Kash with "Treat Yourself"   ││
│  │   shopping bags, smiling       ││
│  │                                ││
│  └────────────────────────────────┘│
│                                     │
│  Enjoy Without Guilt                │ H2: 24px Bold
│                                     │ Center aligned
│                                     │
│  Your "Treat Yourself" budget is   │ Body: 16px Regular
│  sacred. When Kash says it's       │ Center aligned
│  okay to spend, it's OKAY.         │ 16px horizontal padding
│                                     │
│  ┌──────────────────────────────┐  │
│  │  Treat Yourself Budget       │  │ 311x120px card
│  │                              │  │ Treat Yourself color
│  │  🎉 $150 / month             │  │ background (#9D4EDD20)
│  │                              │  │ 24px below description
│  │  Spend it all—you've         │  │ Centered
│  │  earned it!                  │  │ 16px padding
│  │                              │  │
│  └──────────────────────────────┘  │
│                                     │
│  ┌─────────────────────────────┐   │
│  │   Next                      │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │   Back                      │   │
│  └─────────────────────────────┘   │
├─────────────────────────────────────┤
│  SAFE AREA BOTTOM (34px)            │
└─────────────────────────────────────┘
```

**Elements:**
1. **Progress Indicator:** 3rd dot active
2. **Illustration:** 343x220px, Kash mascot with shopping theme
3. **Header:** H2, center-aligned
4. **Description:** Body text, center-aligned, 16px horizontal padding
5. **Feature Card:** 311x120px, Treat Yourself color background (20% opacity), rounded corners (12px), centered, 16px internal padding
6. **Card Content:** Emoji + amount (H3, 20px Bold), description (Body, 16px Regular)
7. **Buttons:** Consistent with previous screen

---

### Screen 1.5: Permissions Request

```
┌─────────────────────────────────────┐
│  STATUS BAR (44px)                  │
├─────────────────────────────────────┤
│                                     │
│         [Progress: 4/4]             │
│     ○○○●                            │
│                                     │
│  ┌────────┐                         │
│  │  KASH  │ 64x64px                 │
│  └────────┘ Center aligned          │
│                                     │
│  Just Need a Few Things            │ H2: 24px Bold
│                                     │ Center aligned
│                                     │
│  To give you the best experience,  │ Body: 16px Regular
│  Kash needs a couple permissions.  │ Center aligned
│  Your privacy matters.              │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  📷                          │  │ 343x80px
│  │  Camera Access               │  │ Permission card
│  │  To scan receipt QR codes    │  │ White background
│  │                          [>] │  │ Shadow: 0 2px 8px
│  └──────────────────────────────┘  │ rgba(0,0,0,0.1)
│                                     │ 24px below description
│  ┌──────────────────────────────┐  │
│  │  📍                          │  │ 343x80px
│  │  Location Services           │  │ 12px below previous
│  │  For smart spending insights │  │
│  │                          [>] │  │
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  🔔                          │  │ 343x80px
│  │  Notifications               │  │ 12px below previous
│  │  Budget alerts & milestones  │  │
│  │                          [>] │  │
│  └──────────────────────────────┘  │
│                                     │
│  ┌─────────────────────────────┐   │
│  │   Grant Permissions         │   │ Primary button
│  └─────────────────────────────┘   │ 32px below cards
│                                     │
│  ┌─────────────────────────────┐   │
│  │   I'll Do This Later        │   │ Secondary button
│  └─────────────────────────────┘   │ 12px below
├─────────────────────────────────────┤
│  SAFE AREA BOTTOM (34px)            │
└─────────────────────────────────────┘
```

**Elements:**
1. **Progress Indicator:** 4th dot active
2. **Kash Avatar:** 64x64px, centered, 32px below progress
3. **Header:** H2, center-aligned, 16px below avatar
4. **Description:** Body text, center-aligned
5. **Permission Cards:** 3 cards, each 343x80px, 12px spacing between
   - Icon: 24x24px, left-aligned with 16px left padding
   - Title: H3 (18px Bold), 12px left of icon
   - Description: Small (14px Regular), Neutral-600, below title
   - Chevron: 16x16px, right-aligned with 16px right padding
   - Background: White, border-radius 12px, shadow
6. **Primary Button:** "Grant Permissions", 32px below last card
7. **Secondary Button:** "I'll Do This Later", text-only variant

---

## Screen 2: Scan Screen (Primary)

**Purpose:** Primary interaction point for QR code scanning

```
┌─────────────────────────────────────┐
│  STATUS BAR (44px)                  │
├─────────────────────────────────────┤
│  NAVIGATION BAR (56px)              │
│                                     │
│  [≡] ←─  Scan  ──→ [Profile Icon]  │ H3: 20px Bold
│                                     │ Centered title
│  16px←              →16px           │ Icons: 24x24px
│                                     │
├─────────────────────────────────────┤
│  CONTENT AREA                       │
│                                     │
│  ┌─────────────────────────────┐   │
│  │                             │   │
│  │                             │   │
│  │         ┌───────┐           │   │ 200x200px
│  │         │       │           │   │ Centered
│  │         │  [QR  │           │   │ Primary color
│  │         │  SCAN]│           │   │ 64px from top
│  │         │       │           │   │
│  │         └───────┘           │   │
│  │                             │   │
│  │    Tap to Scan Receipt      │   │ Body: 16px
│  │                             │   │ Center aligned
│  │                             │   │ 16px below icon
│  └─────────────────────────────┘   │ 343x280px card
│                                     │ White background
│  Manual Entry ──────────────────>  │ Small: 14px
│                                     │ Right-aligned link
│                                     │ 16px below card
│                                     │ Primary color
│                                     │
│  Recent Scans                      │ H3: 18px Bold
│  ───────────────                    │ Left: 16px
│                                     │ 24px below link
│  ┌──────────────────────────────┐  │
│  │ 🛒 Kaufland                  │  │ TransactionCard
│  │ Food & Groceries        -$45 │  │ 343x72px
│  │ 10 min ago • Studentski grad │  │ 12px below header
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │ ☕ Costa Coffee              │  │ 343x72px
│  │ Dining Out              -$8  │  │ 12px below previous
│  │ 2 hours ago • Center Sofia   │  │
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │ 🚗 OMV Gas Station           │  │ 343x72px
│  │ Transportation          -$50 │  │ 12px below previous
│  │ Yesterday • Ring Road        │  │
│  └──────────────────────────────┘  │
│                                     │
│  View All ────────────────────────>│ Small: 14px
│                                     │ Right-aligned
│                                     │ Primary color
│                                     │
├─────────────────────────────────────┤
│  BOTTOM TAB BAR (72px)              │
│                                     │
│  [Scan] [See] [Save]                │ 3 tabs, equal width
│  ● Scan (active)                    │ Active: Primary color
│                                     │ Inactive: Neutral-500
│                                     │ Icons: 28x28px
│                                     │ Labels: 12px
├─────────────────────────────────────┤
│  SAFE AREA BOTTOM (34px)            │
└─────────────────────────────────────┘
```

**Elements:**

1. **Navigation Bar (56px height):**
   - Menu icon (left): 24x24px, 16px from left edge, Neutral-900
   - Title "Scan": H3 (20px Bold), center-aligned
   - Profile icon (right): 24x24px circular avatar, 16px from right edge

2. **Scan Card (343x280px):**
   - Background: White
   - Border-radius: 16px
   - Shadow: 0 4px 12px rgba(0,0,0,0.08)
   - Top margin: 24px from nav bar
   - Horizontal margin: 16px
   - QR icon: 200x200px, Primary color (#2A9D8F), centered
   - Text: Body (16px Regular), center-aligned, 16px below icon

3. **Manual Entry Link:**
   - Position: Right-aligned, 16px from right edge
   - Typography: Small (14px Regular)
   - Color: Primary (#2A9D8F)
   - Top margin: 16px below scan card
   - Tap target: 44px height

4. **Recent Scans Section:**
   - Header: H3 (18px Bold), left-aligned, 16px from left
   - Top margin: 24px below manual entry link
   - Underline: 2px solid Neutral-300, 100px width

5. **Transaction Cards (343x72px each):**
   - Background: White
   - Border-radius: 12px
   - Border: 1px solid Neutral-200
   - Horizontal margin: 16px
   - Vertical spacing: 12px between cards
   - Internal padding: 12px
   - Layout:
     - Icon: 32x32px, left-aligned
     - Merchant name: H4 (16px SemiBold), 12px right of icon
     - Category: Small (14px Regular), Neutral-600, below merchant
     - Amount: H4 (16px SemiBold), right-aligned, Negative color (#EF476F)
     - Timestamp: Small (12px Regular), Neutral-500, below merchant

6. **View All Link:**
   - Consistent with Manual Entry Link styling
   - Top margin: 16px below last transaction card

7. **Bottom Tab Bar (72px height):**
   - Background: White
   - Border-top: 1px solid Neutral-200
   - 3 tabs with equal width (125px each)
   - Active tab:
     - Icon: Primary color (#2A9D8F), 28x28px
     - Label: Primary color, 12px Regular
     - Indicator: 4px dot below icon
   - Inactive tabs:
     - Icon: Neutral-500, 28x28px
     - Label: Neutral-600, 12px Regular
   - Tab padding: 12px vertical

**States:**

- **Default:** As shown above
- **Scanning Active:** QR icon replaced with camera viewfinder, "Scanning..." text
- **Scan Success:** Green checkmark animation (500ms), haptic feedback
- **Scan Error:** Red X icon, "Try Again" text, shake animation
- **Empty State (no recent scans):** Illustration with "No scans yet" message

---

## Screen 3: See Screen (Dashboard)

**Purpose:** Weekly spending overview with insights

```
┌─────────────────────────────────────┐
│  STATUS BAR (44px)                  │
├─────────────────────────────────────┤
│  NAVIGATION BAR (56px)              │
│                                     │
│  [≡]  ←─  See  ──→  [Period: Week ▼]│
│                                     │
├─────────────────────────────────────┤
│  SCROLLABLE CONTENT                 │
│                                     │
│  ┌──────────────────────────────┐  │ Hero Card
│  │  This Week                   │  │ 343x160px
│  │                              │  │ Gradient background
│  │      $342                    │  │ Primary → Accent
│  │      ───────                 │  │ 16px margin
│  │      $500 budget             │  │ 24px from nav
│  │                              │  │
│  │  [Progress Bar: 68%]         │  │ 311px width
│  │  ████████████░░░░░░           │  │ 8px height
│  │                              │  │ 16px below amount
│  │  $158 left • 3 days to go    │  │
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │ Kash Insight Card
│  │  💡 Kash Says:               │  │ 343x100px
│  │                              │  │ Accent background
│  │  "You're doing great! Just   │  │ (#E9C46A20)
│  │  watch the dining out        │  │ 16px below hero
│  │  spending this weekend."     │  │ 12px padding
│  │                              │  │ Border-radius: 12px
│  └──────────────────────────────┘  │
│                                     │
│  Top Categories                    │ H3: 18px Bold
│  ────────────────                   │ 24px below insight
│                                     │
│  ┌──────────────────────────────┐  │ Category Card
│  │  🛒 Food & Groceries         │  │ 343x88px
│  │                              │  │ 12px below header
│  │  $156 / $200                 │  │
│  │  [Progress: 78%] ████████░░  │  │ ProgressBar
│  │                              │  │ component
│  │  12 transactions             │  │
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  ☕ Dining Out               │  │ 343x88px
│  │                              │  │ 12px below previous
│  │  $94 / $100                  │  │
│  │  [Progress: 94%] ███████████░│  │ Warning color
│  │                              │  │ (#FFB703)
│  │  8 transactions              │  │
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  🚗 Transportation           │  │ 343x88px
│  │                              │  │
│  │  $65 / $120                  │  │
│  │  [Progress: 54%] ██████░░░░  │  │ Success color
│  │                              │  │ (#06D6A0)
│  │  5 transactions              │  │
│  └──────────────────────────────┘  │
│                                     │
│  See All Categories ─────────────> │ Link
│                                     │ 16px below
│                                     │
│  Spending Trend                    │ H3: 18px Bold
│  ────────────────                   │ 32px below link
│                                     │
│  ┌──────────────────────────────┐  │ Chart Card
│  │                              │  │ 343x200px
│  │  [Bar Chart: 7 days]         │  │ 16px below header
│  │                              │  │
│  │   ▄                          │  │ Bars: Primary color
│  │  ▄█▄  ▄   ▄                  │  │ Grid lines:
│  │ ▄███▄██  ██ ▄█               │  │ Neutral-200
│  │ ████████████████             │  │
│  │ M T W T F S S                │  │ X-axis labels:
│  │                              │  │ Small (12px)
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │ Achievement Badge
│  │  🏆 3-Day Streak!            │  │ 343x72px
│  │  Keep scanning to maintain   │  │ Success background
│  │  your streak.                │  │ (#06D6A020)
│  └──────────────────────────────┘  │ 24px below chart
│                                     │
│  [Spacer: 24px]                    │
│                                     │
├─────────────────────────────────────┤
│  BOTTOM TAB BAR (72px)              │
│  [Scan] [See] [Save]                │
│  ● See (active)                     │
├─────────────────────────────────────┤
│  SAFE AREA BOTTOM (34px)            │
└─────────────────────────────────────┘
```

**Elements:**

1. **Navigation Bar:**
   - Left: Menu icon (24x24px)
   - Center: "See" title (H3, 20px Bold)
   - Right: Period selector dropdown (Small, 14px, with chevron icon)
   - Dropdown options: Week, Month, Year

2. **Hero Card (343x160px):**
   - Background: Linear gradient Primary → Accent
   - Border-radius: 16px
   - Padding: 20px
   - Period label: Small (14px Regular), White, opacity 0.9
   - Current amount: H1 (48px Bold), White
   - Divider: 1px solid White (opacity 0.3), 80px width
   - Budget amount: Body (16px Regular), White, opacity 0.9
   - Progress bar: 311x8px, White background (opacity 0.3), filled portion White
   - Status text: Small (14px Regular), White, opacity 0.9

3. **Kash Insight Card (343x100px):**
   - Background: Accent color (#E9C46A) at 20% opacity
   - Border-radius: 12px
   - Padding: 12px
   - Icon: 24x24px emoji, left-aligned
   - Header: H4 (16px SemiBold), Neutral-900
   - Message: Body (16px Regular), Neutral-700, line-height 24px

4. **Category Cards (343x88px):**
   - Background: White
   - Border: 1px solid Neutral-200
   - Border-radius: 12px
   - Padding: 16px
   - Icon + Name: Left-aligned, H4 (16px SemiBold)
   - Amount: H4 (16px SemiBold), Neutral-900, "spent / budget" format
   - Progress bar: ProgressBar component, 311x6px
     - Color based on percentage:
       - 0-70%: Success (#06D6A0)
       - 71-85%: Warning (#FFB703)
       - 86-100%: Error (#EF476F)
   - Transaction count: Small (12px Regular), Neutral-600

5. **Chart Card (343x200px):**
   - Background: White
   - Border: 1px solid Neutral-200
   - Border-radius: 12px
   - Padding: 16px
   - Bar chart: 7 bars for 7 days
   - Bar color: Primary (#2A9D8F)
   - Grid lines: Neutral-200, horizontal only
   - Y-axis: 0 to max value, 4 steps
   - X-axis labels: Day initials (M, T, W, T, F, S, S)

6. **Achievement Badge (343x72px):**
   - Background: Success color (#06D6A0) at 20% opacity
   - Border-radius: 12px
   - Padding: 12px
   - Icon: 32x32px emoji, left-aligned
   - Title: H4 (16px SemiBold), Success color
   - Message: Small (14px Regular), Neutral-700

**States:**

- **Loading:** Skeleton screens for all cards
- **Empty State:** "No spending data yet" with illustration
- **Over Budget:** Hero card shows red progress bar, warning message
- **On Track:** Success message in Kash insight card

---

## Screen 4: Save Screen (Goals & Progress)

**Purpose:** Budget goals, Treat Yourself tracker, achievements

```
┌─────────────────────────────────────┐
│  STATUS BAR (44px)                  │
├─────────────────────────────────────┤
│  NAVIGATION BAR (56px)              │
│  [≡] ←─  Save  ──→ [Settings Icon] │
├─────────────────────────────────────┤
│  SCROLLABLE CONTENT                 │
│                                     │
│  ┌──────────────────────────────┐  │ Treat Yourself Card
│  │  🎉 Treat Yourself Budget    │  │ 343x140px
│  │                              │  │ Treat Yourself color
│  │      $75 left                │  │ (#9D4EDD) gradient
│  │      ─────────                │  │ 16px margin
│  │      $150 monthly            │  │ 24px from nav
│  │                              │  │
│  │  [Progress: 50%] ██████░░░░  │  │ White progress bar
│  │                              │  │ 12px below amount
│  │  Spend guilt-free! 💜        │  │
│  └──────────────────────────────┘  │
│                                     │
│  Monthly Budget Goals              │ H3: 18px Bold
│  ──────────────────────              │ 24px below card
│                                     │
│  ┌──────────────────────────────┐  │ Goal Card
│  │  Food & Groceries            │  │ 343x120px
│  │  [Edit ✏️]                   │  │ 12px below header
│  │                              │  │
│  │  $156 / $200                 │  │ H3: 20px SemiBold
│  │  [Progress: 78%] ████████░░  │  │ 8px below title
│  │                              │  │
│  │  $44 remaining • 3 days left │  │ Small: 14px
│  └──────────────────────────────┘  │ Neutral-600
│                                     │
│  ┌──────────────────────────────┐  │
│  │  Dining Out                  │  │ 343x120px
│  │  [Edit ✏️]                   │  │ 12px below previous
│  │                              │  │
│  │  $94 / $100                  │  │ Warning state
│  │  [Progress: 94%] ███████████░│  │ Orange progress
│  │                              │  │
│  │  ⚠️ $6 remaining • Watch it! │  │
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  Transportation              │  │ 343x120px
│  │  [Edit ✏️]                   │  │
│  │                              │  │
│  │  $65 / $120                  │  │ Success state
│  │  [Progress: 54%] ██████░░░░  │  │ Green progress
│  │                              │  │
│  │  $55 remaining • On track ✓  │  │
│  └──────────────────────────────┘  │
│                                     │
│  + Add Budget Goal ──────────────> │ Link, Primary color
│                                     │ 16px below cards
│                                     │
│  Credits Balance                   │ H3: 18px Bold
│  ─────────────────                  │ 32px below link
│                                     │
│  ┌──────────────────────────────┐  │ Credits Card
│  │  💎 125 Credits              │  │ 343x100px
│  │                              │  │ Accent background
│  │  Next unlock at 150 credits: │  │ (#E9C46A40)
│  │  [Progress: 83%] █████████░  │  │ 16px below header
│  │                              │  │
│  │  "Smart Insights"            │  │
│  └──────────────────────────────┘  │
│                                     │
│  Achievements                      │ H3: 18px Bold
│  ──────────────                     │ 24px below credits
│                                     │
│  ┌────┬────┬────┬────┬────┐        │ Achievement Grid
│  │ 🏆 │ 🔥 │ 💪 │ 🎯 │ 🌟 │       │ 5 columns
│  │ 3d │10d │25d │50d │100│        │ Badge: 60x80px
│  ├────┼────┼────┼────┼────┤        │ 8px spacing
│  │ ✅ │ ✅ │ 🔒 │ 🔒 │ 🔒 │       │ Active: full color
│  └────┴────┴────┴────┴────┘        │ Locked: grayscale
│                                     │ 16px below header
│                                     │
│  Streak Achievements               │ Small: 14px
│  3-day, 10-day, 25-day, 50-day,    │ Centered
│  100-day scanning streaks           │ Neutral-600
│                                     │
│  [Spacer: 32px]                    │
│                                     │
├─────────────────────────────────────┤
│  BOTTOM TAB BAR (72px)              │
│  [Scan] [See] [Save]                │
│  ● Save (active)                    │
├─────────────────────────────────────┤
│  SAFE AREA BOTTOM (34px)            │
└─────────────────────────────────────┘
```

**Elements:**

1. **Treat Yourself Card (343x140px):**
   - Background: Linear gradient Treat Yourself color (#9D4EDD → #C77DFF)
   - Border-radius: 16px
   - Padding: 20px
   - Icon: 32x32px emoji
   - Title: H3 (18px SemiBold), White
   - Amount left: H2 (32px Bold), White
   - Divider: 1px solid White (opacity 0.3)
   - Total budget: Body (16px Regular), White (opacity 0.9)
   - Progress bar: White background (opacity 0.3), White fill
   - Message: Small (14px Regular), White

2. **Budget Goal Cards (343x120px):**
   - Background: White
   - Border: 1px solid based on status:
     - On track: Neutral-200
     - Warning (71-85%): Warning color (#FFB703)
     - Over budget (86%+): Error color (#EF476F)
   - Border-radius: 12px
   - Padding: 16px
   - Header row:
     - Category name: H4 (16px SemiBold), left-aligned
     - Edit icon: 20x20px, right-aligned, Primary color
   - Amount: H3 (20px SemiBold), "spent / budget" format
   - Progress bar: ProgressBar component, 311x8px
   - Status text: Small (14px Regular), color based on status
     - Success: Neutral-700 with ✓
     - Warning: Warning color with ⚠️
     - Error: Error color with ⚠️

3. **Credits Card (343x100px):**
   - Background: Accent color (#E9C46A) at 40% opacity
   - Border-radius: 12px
   - Padding: 16px
   - Icon: 28x28px gem emoji
   - Current credits: H3 (20px Bold), Neutral-900
   - Next unlock text: Small (14px Regular), Neutral-700
   - Progress bar: Neutral-300 background, Accent color fill
   - Feature name: Body (16px SemiBold), in quotes, Neutral-900

4. **Achievement Grid:**
   - 5 columns, equal width (67px each with 8px spacing)
   - Each badge: 60x80px
   - Active badges:
     - Icon: 40x40px emoji, full color
     - Label: Small (12px Bold), Neutral-900
     - Background: White
     - Border: 2px solid Success color
     - Border-radius: 8px
   - Locked badges:
     - Icon: 40x40px lock emoji, grayscale
     - Label: Small (12px Regular), Neutral-500
     - Background: Neutral-100
     - Border: 1px solid Neutral-300
     - Border-radius: 8px
   - Caption: Small (14px Regular), Neutral-600, center-aligned

**Interactive Elements:**

- Edit icon on each goal card → Opens edit modal
- Add Budget Goal link → Opens category selection + amount input modal
- Each achievement badge → Tap to see details (date earned, progress)

**States:**

- **Over Budget:** Card border turns red, warning icon, suggestion to adjust budget
- **Nearly Full:** Card border turns orange, warning message
- **Credits Level Up:** Confetti animation when crossing unlock threshold
- **New Achievement:** Pulse animation + haptic feedback when badge is earned

---

## Screen 5: Transaction Detail

**Purpose:** View and edit individual transaction details

```
┌─────────────────────────────────────┐
│  STATUS BAR (44px)                  │
├─────────────────────────────────────┤
│  NAVIGATION BAR (56px)              │
│  [← Back]  Transaction  [Delete 🗑] │
├─────────────────────────────────────┤
│  SCROLLABLE CONTENT                 │
│                                     │
│  ┌──────────────────────────────┐  │ Amount Card
│  │                              │  │ 343x120px
│  │         -$45.00              │  │ Primary gradient
│  │                              │  │ background
│  │     Kaufland                 │  │ 16px margin
│  │  Food & Groceries            │  │ 24px from nav
│  │                              │  │
│  │  Apr 15, 2025 • 2:34 PM      │  │
│  └──────────────────────────────┘  │
│                                     │
│  Details                           │ H3: 18px Bold
│  ────────                           │ 24px below card
│                                     │
│  ┌──────────────────────────────┐  │ Detail Row
│  │  Category                    │  │ 343x60px
│  │  🛒 Food & Groceries     [>] │  │ Tappable
│  └──────────────────────────────┘  │ 12px below header
│                                     │
│  ┌──────────────────────────────┐  │
│  │  Location                    │  │ 343x60px
│  │  📍 Kaufland Studentski  [>] │  │
│  │     (Trusted Location)       │  │ Small: 12px
│  └──────────────────────────────┘  │ Neutral-600
│                                     │ 8px below previous
│  ┌──────────────────────────────┐  │
│  │  Payment Method              │  │ 343x60px
│  │  💳 Cash                 [>] │  │
│  └──────────────────────────────┘  │ 8px below previous
│                                     │
│  ┌──────────────────────────────┐  │
│  │  Receipt                     │  │ 343x60px
│  │  📄 QR Code Scanned      [>] │  │
│  │     (View Receipt Image)     │  │
│  └──────────────────────────────┘  │ 8px below previous
│                                     │
│  Notes                             │ H4: 16px SemiBold
│  ─────                              │ 24px below rows
│                                     │
│  ┌──────────────────────────────┐  │ Notes Field
│  │                              │  │ 343x100px
│  │  [Tap to add notes...]       │  │ Textarea
│  │                              │  │ 12px below header
│  │                              │  │ Border: Neutral-300
│  │                              │  │ Border-radius: 8px
│  └──────────────────────────────┘  │ Padding: 12px
│                                     │
│  Smart Insights                    │ H4: 16px SemiBold
│  ────────────────                   │ 24px below notes
│                                     │
│  ┌──────────────────────────────┐  │ Insight Card
│  │  💡 You typically spend      │  │ 343x80px
│  │  $40-50 at Kaufland.         │  │ Accent background
│  │  This is within your normal  │  │ (#E9C46A20)
│  │  range.                      │  │ 12px below header
│  └──────────────────────────────┘  │ Padding: 12px
│                                     │ Border-radius: 12px
│                                     │
│  Location History                  │ H4: 16px SemiBold
│  ──────────────────                 │ 24px below insight
│                                     │
│  ┌──────────────────────────────┐  │ Map Card
│  │                              │  │ 343x160px
│  │  [Interactive Map]           │  │ 12px below header
│  │                              │  │ Shows pin for
│  │  📍 Kaufland                 │  │ transaction location
│  │  Studentski Grad, Sofia      │  │
│  │                              │  │
│  │  4 transactions at this      │  │ Small: 12px
│  │  location this month         │  │ Overlay at bottom
│  └──────────────────────────────┘  │
│                                     │
│  ┌─────────────────────────────┐   │ Save Button
│  │   Save Changes              │   │ 343x56px
│  └─────────────────────────────┘   │ Primary variant
│                                     │ 32px below map
│                                     │ Fixed at bottom when
│                                     │ keyboard open
│  [Spacer: 24px]                    │
│                                     │
├─────────────────────────────────────┤
│  SAFE AREA BOTTOM (34px)            │
└─────────────────────────────────────┘
```

**Elements:**

1. **Navigation Bar:**
   - Back button: "← Back" (Body, 16px), left-aligned, Primary color
   - Title: "Transaction" (H3, 20px Bold), center-aligned
   - Delete button: Delete icon (20x20px) + "Delete" text, right-aligned, Error color

2. **Amount Card (343x120px):**
   - Background: Linear gradient Primary → Accent
   - Border-radius: 16px
   - Padding: 20px
   - Amount: H1 (48px Bold), White, center-aligned
   - Merchant: H3 (20px SemiBold), White, center-aligned, 8px below amount
   - Category: Body (16px Regular), White (opacity 0.9), center-aligned
   - Timestamp: Small (14px Regular), White (opacity 0.8), center-aligned

3. **Detail Rows (343x60px each):**
   - Background: White
   - Border: 1px solid Neutral-200
   - Border-radius: 8px
   - Padding: 12px 16px
   - Label: Small (12px Regular), Neutral-600, top-aligned
   - Value: Body (16px Regular), Neutral-900, 4px below label
   - Icon: 20x20px, left of value
   - Chevron: 16x16px, right-aligned, Neutral-400
   - Tap target: Full row height
   - Sub-text (where applicable): Small (12px Regular), Neutral-500, 4px below value

4. **Notes Field (343x100px):**
   - Border: 1px solid Neutral-300
   - Border-radius: 8px
   - Padding: 12px
   - Placeholder: Body (16px Regular), Neutral-400
   - Input text: Body (16px Regular), Neutral-900
   - Focus state: Border changes to Primary color

5. **Insight Card (343x80px):**
   - Background: Accent color (#E9C46A) at 20% opacity
   - Border-radius: 12px
   - Padding: 12px
   - Icon: 20x20px emoji, left-aligned
   - Text: Body (16px Regular), Neutral-700, line-height 24px

6. **Map Card (343x160px):**
   - Background: Map tiles (Google Maps or Mapbox)
   - Border-radius: 12px
   - Pin: Primary color marker at location
   - Overlay: Semi-transparent black gradient at bottom
   - Location name: Body (16px SemiBold), White
   - Address: Small (14px Regular), White (opacity 0.9)
   - Transaction count: Small (12px Regular), White (opacity 0.8)

**Interactive States:**

- **Category Row Tap:** Opens CategoryPicker modal
- **Location Row Tap:** Opens LocationPicker modal with map
- **Payment Method Tap:** Opens payment method selector
- **Receipt Row Tap:** Opens full-screen receipt image viewer
- **Notes Field Focus:** Keyboard appears, Save button sticks to keyboard top
- **Delete Button Tap:** Confirmation modal appears
- **Save Button Tap:** Saves changes, shows success toast, navigates back

---

## Screen 6: Category Picker

**Purpose:** Select or change transaction category

```
┌─────────────────────────────────────┐
│  STATUS BAR (44px)                  │
├─────────────────────────────────────┤
│  MODAL HEADER (64px)                │
│                                     │
│  [✕]      Select Category      [✓] │ H3: 18px Bold
│                                     │ X: left, Check: right
│                                     │ 16px margins
├─────────────────────────────────────┤
│  SEARCH BAR (56px)                  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │ 🔍 Search categories...      │  │ 343x40px
│  └──────────────────────────────┘  │ Border: Neutral-300
│                                     │ Border-radius: 20px
│                                     │ 8px margin
├─────────────────────────────────────┤
│  SCROLLABLE CONTENT                 │
│                                     │
│  Popular                           │ H4: 16px SemiBold
│  ────────                           │ Neutral-600
│                                     │ 16px left margin
│                                     │ 12px top margin
│  ┌────┬────┬────┬────┐             │ Category Grid
│  │ 🛒 │ ☕ │ 🚗 │ 🏠 │            │ 4 columns
│  │Food│Café│Cars│Home│            │ 81px width each
│  ├────┼────┼────┼────┤             │ + 8px spacing
│  │ 🎬 │ 🏥 │ 👕 │ 🎮 │            │ 100px height
│  │Fun │Med │Shop│Game│            │
│  └────┴────┴────┴────┘             │ 12px below header
│                                     │
│  All Categories                    │ H4: 16px SemiBold
│  ────────────────                   │ 24px below grid
│                                     │
│  ┌──────────────────────────────┐  │ Category Row
│  │  🛒 Food & Groceries     [✓] │  │ 343x56px
│  └──────────────────────────────┘  │ Selected state
│                                     │ Primary color bg
│  ┌──────────────────────────────┐  │ (#2A9D8F20)
│  │  ☕ Dining Out               │  │ 343x56px
│  └──────────────────────────────┘  │ Default state
│                                     │
│  ┌──────────────────────────────┐  │
│  │  🚗 Transportation           │  │ 343x56px
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  🏠 Housing & Utilities      │  │
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  🎬 Entertainment            │  │
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  🏥 Healthcare               │  │
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  👕 Shopping                 │  │
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  🎮 Hobbies & Subscriptions  │  │
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  💼 Work & Business          │  │
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  🎉 Treat Yourself           │  │ Special styling
│  │                          💜  │  │ Treat Yourself color
│  └──────────────────────────────┘  │ border
│                                     │
│  ┌──────────────────────────────┐  │
│  │  + Create Custom Category    │  │ 343x56px
│  └──────────────────────────────┘  │ Primary color text
│                                     │ Dashed border
│  [Spacer: 24px]                    │
│                                     │
├─────────────────────────────────────┤
│  SAFE AREA BOTTOM (34px)            │
└─────────────────────────────────────┘
```

**Elements:**

1. **Modal Header (64px):**
   - Background: White
   - Border-bottom: 1px solid Neutral-200
   - Close button (X): 24x24px, left-aligned, 16px margin, Neutral-700
   - Title: H3 (18px Bold), center-aligned
   - Confirm button (✓): 24x24px, right-aligned, 16px margin, Primary color

2. **Search Bar (343x40px):**
   - Background: Neutral-100
   - Border: 1px solid Neutral-300
   - Border-radius: 20px (pill shape)
   - Padding: 8px 16px
   - Search icon: 20x20px, left-aligned, Neutral-500
   - Placeholder: Body (16px Regular), Neutral-400
   - Input text: Body (16px Regular), Neutral-900

3. **Popular Categories Grid:**
   - 4 columns, 81px width each (with 8px spacing = 343px total)
   - Each tile: 81x100px
   - Background: White
   - Border: 1px solid Neutral-200
   - Border-radius: 8px
   - Icon: 40x40px emoji, center-aligned, 16px from top
   - Label: Small (14px Regular), center-aligned, 8px below icon
   - Active state: Border changes to Primary color (2px), background tint

4. **Category Rows (343x56px):**
   - Background: White
   - Border: 1px solid Neutral-200
   - Border-radius: 8px
   - Padding: 16px
   - Vertical spacing: 8px between rows
   - Icon: 24x24px emoji, left-aligned
   - Label: Body (16px Regular), 12px left of icon
   - Checkmark: 20x20px, right-aligned, Primary color (when selected)
   - Selected state:
     - Background: Primary color at 20% opacity
     - Border: 2px solid Primary color
     - Checkmark visible

5. **Treat Yourself Category Row:**
   - Border: 2px solid Treat Yourself color (#9D4EDD)
   - Purple heart icon (💜) on right instead of checkmark
   - Slight gradient background when selected

6. **Create Custom Category Row:**
   - Border: 2px dashed Primary color
   - Plus icon: 20x20px, left-aligned
   - Text: Primary color
   - No emoji icon

**Interactive States:**

- **Tile Tap:** Selects category, shows checkmark, enables confirm button
- **Row Tap:** Same as tile tap
- **Search Input:** Filters list in real-time
- **Create Custom Tap:** Opens modal with category name + icon picker
- **Confirm Button Tap:** Saves selection, closes modal
- **Close Button Tap:** Dismisses modal without saving

**Animation:**

- Modal slides up from bottom (300ms ease-out)
- Selected state: Scale animation 1.0 → 0.95 → 1.0 (200ms)
- Checkmark: Fade in with slight rotation (150ms)

---

## Screen 7: Location Management

**Purpose:** View, tag, and manage spending locations

```
┌─────────────────────────────────────┐
│  STATUS BAR (44px)                  │
├─────────────────────────────────────┤
│  NAVIGATION BAR (56px)              │
│  [← Back]    Locations    [Filter ⚙]│
├─────────────────────────────────────┤
│  TAB BAR (48px)                     │
│                                     │
│  ┌─────────┬─────────┬─────────┐   │
│  │   Map   │  List   │  Tags   │   │ 3 tabs, equal width
│  └─────────┴─────────┴─────────┘   │ Active: Primary color
│  ──────────                         │ 2px underline
│                                     │
├─────────────────────────────────────┤
│  MAP VIEW (Active Tab)              │
│                                     │
│  ┌──────────────────────────────┐  │ Map Container
│  │                              │  │ Full width x 400px
│  │  [Interactive Map]           │  │
│  │                              │  │
│  │  📍 Multiple pins showing    │  │ Primary color pins
│  │     transaction locations    │  │ Clustered when zoom
│  │                              │  │ out
│  │  🟢 Trusted locations (green)│  │ Success color pins
│  │  🔴 High-spend (red)         │  │ Warning color pins
│  │                              │  │
│  │  [+/-] Zoom controls         │  │ Bottom-right
│  │  [📍] Center on user         │  │ Bottom-left
│  │                              │  │
│  └──────────────────────────────┘  │
│                                     │
│  Top Locations                     │ H3: 18px Bold
│  ───────────────                    │ 16px below map
│                                     │ 16px left margin
│                                     │
│  ┌──────────────────────────────┐  │ Location Card
│  │  📍 Kaufland Studentski      │  │ 343x88px
│  │  Studentski Grad, Sofia      │  │ 12px below header
│  │                              │  │
│  │  $450 • 12 transactions      │  │ H4: 16px SemiBold
│  │  [View on Map]               │  │ Link: Primary color
│  │                              │  │
│  │  🏷️ Trusted Location        │  │ Badge: Success bg
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  📍 Mall of Sofia            │  │ 343x88px
│  │  Tsarigradsko Shose, Sofia   │  │ 12px below previous
│  │                              │  │
│  │  $320 • 8 transactions       │  │
│  │  [View on Map]               │  │
│  │                              │  │
│  │  🔴 High-Spend Alert         │  │ Badge: Warning bg
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  📍 Costa Coffee Center      │  │ 343x88px
│  │  Vitosha Blvd, Sofia         │  │
│  │                              │  │
│  │  $96 • 15 transactions       │  │
│  │  [View on Map]               │  │
│  │                              │  │
│  │  [Tag Location]              │  │ Link: Primary color
│  └──────────────────────────────┘  │
│                                     │
│  [Spacer: 24px]                    │
│                                     │
├─────────────────────────────────────┤
│  SAFE AREA BOTTOM (34px)            │
└─────────────────────────────────────┘
```

**Elements:**

1. **Navigation Bar:**
   - Back button: "← Back", left-aligned
   - Title: "Locations", center-aligned
   - Filter button: Gear icon (20x20px) + "Filter", right-aligned

2. **Tab Bar (48px):**
   - 3 tabs: Map, List, Tags
   - Equal width (125px each)
   - Active tab:
     - Text: Primary color, H4 (16px SemiBold)
     - Underline: 2px solid Primary color, full width of tab
   - Inactive tabs:
     - Text: Neutral-600, H4 (16px Regular)
     - No underline

3. **Map Container (375x400px):**
   - Full-width map using Google Maps or Mapbox
   - Pin colors:
     - Default: Primary color (#2A9D8F)
     - Trusted: Success color (#06D6A0)
     - High-spend: Warning color (#FFB703)
   - Pin size: 32x32px for individual, scaled for clusters
   - Cluster bubbles: Show number of transactions, Primary color background
   - Zoom controls: 40x40px buttons, bottom-right, 16px margin
   - Center button: 40x40px, bottom-left, 16px margin
   - Tap on pin: Shows location info card overlay (343x120px)

4. **Location Cards (343x88px):**
   - Background: White
   - Border: 1px solid Neutral-200
   - Border-radius: 12px
   - Padding: 16px
   - Vertical spacing: 12px between cards
   - Pin icon: 20x20px, left-aligned, Neutral-700
   - Location name: H4 (16px SemiBold), Neutral-900, 8px right of icon
   - Address: Small (14px Regular), Neutral-600, below name
   - Stats: Body (16px Regular), Neutral-700, 8px below address
   - View on Map link: Small (14px Regular), Primary color, right-aligned
   - Badge (if applicable):
     - Size: Auto-width x 24px
     - Border-radius: 12px
     - Padding: 4px 8px
     - Typography: Small (12px SemiBold)
     - Colors:
       - Trusted: Success background (#06D6A020), Success text
       - High-Spend: Warning background (#FFB70320), Warning text
   - Tag Location link: Small (14px Regular), Primary color, bottom-left

**List Tab View:**

```
┌─────────────────────────────────────┐
│  LIST VIEW                          │
│                                     │
│  Sort by: [Spending ▼]             │ Dropdown, right-aligned
│                                     │ Options: Spending,
│                                     │ Visits, Recent, Name
│  ┌──────────────────────────────┐  │ Full location cards
│  │  Same as map view cards      │  │ (as shown above)
│  │  but full-height list        │  │
│  └──────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

**Tags Tab View:**

```
┌─────────────────────────────────────┐
│  TAGS VIEW                          │
│                                     │
│  Manage Tags                       │ H3: 18px Bold
│  ─────────────                      │ 16px margin
│                                     │
│  ┌──────────────────────────────┐  │ Tag Card
│  │  🏷️ Trusted Location        │  │ 343x72px
│  │  4 locations                 │  │ Success color theme
│  │  [Manage]                    │  │ 12px below header
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  🔴 High-Spend Alert         │  │ 343x72px
│  │  2 locations                 │  │ Warning color theme
│  │  [Manage]                    │  │
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  + Create Custom Tag         │  │ 343x56px
│  └──────────────────────────────┘  │ Primary color
│                                     │ Dashed border
│                                     │
└─────────────────────────────────────┘
```

**Interactive States:**

- **Map Pin Tap:** Shows location info card overlay
- **Location Card Tap:** Opens location detail view
- **View on Map Link:** Switches to Map tab, centers on location
- **Tag Location Link:** Opens tag selector modal
- **Filter Button:** Opens filter modal (by category, date range, amount)

---

## Screen 8: Settings

**Purpose:** App configuration, account management, preferences

```
┌─────────────────────────────────────┐
│  STATUS BAR (44px)                  │
├─────────────────────────────────────┤
│  NAVIGATION BAR (56px)              │
│  [← Back]      Settings             │
├─────────────────────────────────────┤
│  SCROLLABLE CONTENT                 │
│                                     │
│  ┌──────────────────────────────┐  │ Profile Card
│  │  ┌────┐                      │  │ 343x88px
│  │  │ KM │  Kash User           │  │ 16px margin
│  │  └────┘  kashuser@email.com  │  │ 24px from nav
│  │          [Edit Profile >]    │  │ Primary bg gradient
│  └──────────────────────────────┘  │ White text
│                                     │
│  Account                           │ H4: 16px SemiBold
│  ────────                           │ Neutral-600
│                                     │ 24px below profile
│                                     │ 16px left margin
│                                     │
│  ┌──────────────────────────────┐  │ Setting Row
│  │  💳 Payment Methods      [>] │  │ 343x56px
│  └──────────────────────────────┘  │ 12px below header
│                                     │
│  ┌──────────────────────────────┐  │
│  │  🔔 Notifications        [>] │  │ 343x56px
│  └──────────────────────────────┘  │ 8px below previous
│                                     │
│  ┌──────────────────────────────┐  │
│  │  🔒 Privacy & Security   [>] │  │ 343x56px
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  💾 Data & Backup        [>] │  │ 343x56px
│  └──────────────────────────────┘  │
│                                     │
│  Preferences                       │ H4: 16px SemiBold
│  ─────────────                      │ 24px below section
│                                     │
│  ┌──────────────────────────────┐  │ Toggle Row
│  │  🌙 Dark Mode        [Toggle]│  │ 343x56px
│  └──────────────────────────────┘  │ Toggle: off state
│                                     │
│  ┌──────────────────────────────┐  │
│  │  🔊 Haptic Feedback  [Toggle]│  │ 343x56px
│  │                          ●●  │  │ Toggle: on state
│  └──────────────────────────────┘  │ Primary color
│                                     │
│  ┌──────────────────────────────┐  │
│  │  📍 Location Services [Toggle]│ │ 343x56px
│  │                          ●●  │  │
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │ Dropdown Row
│  │  💱 Currency         BGN [>] │  │ 343x56px
│  └──────────────────────────────┘  │ Shows current value
│                                     │
│  ┌──────────────────────────────┐  │
│  │  🌐 Language     English [>] │  │ 343x56px
│  └──────────────────────────────┘  │
│                                     │
│  Budget & Goals                    │ H4: 16px SemiBold
│  ────────────────                   │ 24px below section
│                                     │
│  ┌──────────────────────────────┐  │
│  │  🎯 Edit Budget Goals    [>] │  │ 343x56px
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  🗓️ Budget Period      Week [>]│ │ 343x56px
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  🎉 Treat Yourself Budget[>] │  │ 343x56px
│  └──────────────────────────────┘  │
│                                     │
│  About                             │ H4: 16px SemiBold
│  ──────                             │ 24px below section
│                                     │
│  ┌──────────────────────────────┐  │
│  │  ℹ️ Help & Support       [>] │  │ 343x56px
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  📜 Terms & Privacy      [>] │  │ 343x56px
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  ⚠️ About Kash Budget    [>] │  │ 343x56px
│  │     Version 1.0.0            │  │ Small: 12px
│  └──────────────────────────────┘  │ Neutral-500
│                                     │
│  ┌─────────────────────────────┐   │ Destructive Button
│  │   🚪 Sign Out               │   │ 343x56px
│  └─────────────────────────────┘   │ Error color text
│                                     │ 32px below section
│                                     │ Border: Error color
│                                     │
│  [Spacer: 48px]                    │
│                                     │
├─────────────────────────────────────┤
│  SAFE AREA BOTTOM (34px)            │
└─────────────────────────────────────┘
```

**Elements:**

1. **Profile Card (343x88px):**
   - Background: Linear gradient Primary → Accent
   - Border-radius: 16px
   - Padding: 16px
   - Avatar: 56x56px circle, initials if no photo, White background, Primary color text
   - Name: H4 (16px SemiBold), White, 12px right of avatar
   - Email: Small (14px Regular), White (opacity 0.9), below name
   - Edit Profile link: Small (14px Regular), White, right-aligned, chevron icon

2. **Section Headers:**
   - Typography: H4 (16px SemiBold), Neutral-600
   - Left margin: 16px
   - Top margin: 24px (first section), 32px (subsequent sections)
   - Bottom margin: 12px
   - Underline: 2px solid Neutral-300, 60px width

3. **Setting Rows (343x56px):**
   - Background: White
   - Border: 1px solid Neutral-200
   - Border-radius: 8px
   - Padding: 16px
   - Horizontal margin: 16px
   - Vertical spacing: 8px between rows
   - Icon: 20x20px emoji, left-aligned
   - Label: Body (16px Regular), Neutral-900, 12px right of icon
   - Accessory (right side):
     - Chevron: 16x16px, Neutral-400 (for navigation rows)
     - Toggle: 51x31px switch (iOS style) (for toggle rows)
     - Value: Small (14px Regular), Neutral-600 (for dropdown rows)
   - Tap target: Full row height
   - Active state: Background Neutral-100

4. **Toggle Switch:**
   - Size: 51x31px (standard iOS toggle)
   - Off state:
     - Track: Neutral-300 background
     - Thumb: White, 27x27px circle
   - On state:
     - Track: Primary color background
     - Thumb: White, 27x27px circle, slides right
   - Animation: 200ms ease-in-out

5. **Sign Out Button (343x56px):**
   - Background: White
   - Border: 2px solid Error color (#EF476F)
   - Border-radius: 12px
   - Text: Error color, H4 (16px SemiBold), center-aligned
   - Icon: Door emoji, 20x20px, left of text
   - Tap state: Background Error color (10% opacity)

**Interactive States:**

- **Row Tap:** Navigate to detail screen or show modal
- **Toggle Tap:** Switches state with animation
- **Sign Out Tap:** Shows confirmation modal
- **Edit Profile Tap:** Opens profile editing screen

**Sub-Screens (Modal or Navigation):**

- **Notifications:** Granular notification preferences (budget alerts, milestones, tips)
- **Privacy & Security:** Biometric lock, data permissions, account deletion
- **Data & Backup:** Export data, backup to cloud, restore options
- **Currency:** Dropdown list of supported currencies (BGN, EUR, USD, etc.)
- **Language:** List of supported languages (English, Bulgarian, etc.)
- **Edit Budget Goals:** Navigate to budget goal editing (same as Save screen)
- **Budget Period:** Radio buttons for Week, Month, Year
- **Treat Yourself Budget:** Edit monthly allocation
- **Help & Support:** FAQ, contact support, tutorial videos
- **Terms & Privacy:** Legal documents
- **About Kash Budget:** App info, credits, open source licenses

---

## Component Specifications Summary

### Reusable Components (Reference)

All components use the design system defined in the front-end spec. Here's a quick reference for implementation:

1. **PrimaryButton**
   - Variants: primary, secondary, destructive
   - States: default, disabled, loading
   - Height: 56px
   - Border-radius: 12px
   - Typography: H4 (16px SemiBold)

2. **TransactionCard**
   - Height: 72px
   - Border-radius: 12px
   - Icon: 32x32px
   - Typography: H4 (16px SemiBold) for merchant, Small (14px Regular) for details

3. **CategoryBadge**
   - Height: 24px
   - Border-radius: 12px
   - Padding: 4px 8px
   - Typography: Small (12px SemiBold)

4. **ProgressBar**
   - Height: 6-8px (depending on context)
   - Border-radius: 4px
   - Colors: Success, Warning, Error based on percentage

5. **KashInsightCard**
   - Min-height: 80px
   - Border-radius: 12px
   - Background: Accent color (20% opacity)
   - Icon: 20-24px emoji
   - Typography: Body (16px Regular)

6. **ScanButton**
   - Size: 200x200px (on Scan screen)
   - Border-radius: 100px (circular)
   - Icon: 80x80px QR code icon
   - Primary color background

---

## Responsive Breakpoints

While the MVP is mobile-only, these wireframes are designed for the following breakpoints:

- **Base (iPhone SE):** 375px width (all dimensions above)
- **iPhone 12/13/14:** 390px width (scales proportionally)
- **iPhone 14 Plus:** 428px width (scales proportionally)
- **Android Mid-Range:** 360-412px width (scales within safe margins)

**Scaling Strategy:**
- Horizontal margins scale proportionally: 16px base becomes 4.26% of screen width
- Component widths use calc: `100% - 32px` (for 16px margins each side)
- Typography remains fixed (no scaling)
- Icons remain fixed at specified sizes
- Grid system maintains 8px base

---

## Design Handoff Checklist

✅ All 8 screens wireframed with granular specifications
✅ Grid system and spacing defined (8px base)
✅ Element dimensions specified (width x height)
✅ Typography hierarchy documented (H1-H4, Body, Small)
✅ Color usage indicated (Primary, Accent, Success, Warning, Error, Neutral)
✅ Interactive states described (tap, focus, loading, error)
✅ Component reusability identified (6 core components)
✅ Navigation flows defined (modal vs. navigation)
✅ Responsive scaling strategy outlined
✅ Accessibility tap targets specified (minimum 44x44px)

---

## Next Steps for Designers

1. **Create high-fidelity mockups** in Figma based on these wireframes
2. **Design Kash character** illustrations and personality expressions
3. **Build component library** in Figma matching the 6 core components
4. **Create prototype** linking all screens for user testing
5. **Export assets** (icons, illustrations, Kash graphics) for development
6. **Document animations** (micro-interactions, transitions) with Lottie or video
7. **Conduct usability testing** with wireframe prototypes before high-fidelity design

---

**Document End**
