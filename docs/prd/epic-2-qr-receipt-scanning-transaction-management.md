# Epic 2: QR Receipt Scanning & Transaction Management

**Epic Goal:** Deliver the core value proposition of effortless data capture by implementing Bulgarian receipt QR code scanning, manual transaction entry fallback, and transaction history display. Users can begin tracking their spending without manual entry burden.

## Story 2.1: QR Code Scanner UI & Camera Integration

As a **user**,
I want **to activate my device camera to scan receipt QR codes**,
so that **I can quickly capture transaction data without typing**.

### Acceptance Criteria

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

## Story 2.2: Bulgarian Receipt QR Code Parsing

As a **backend system**,
I want **to parse Bulgarian receipt QR code data and extract transaction details**,
so that **transaction amount, date, and time can be automatically captured**.

### Acceptance Criteria

1. POST /transactions/scan endpoint accepts QR code raw data string
2. Backend parses Bulgarian receipt QR format and extracts: amount (in BGN), timestamp (date and time), merchant identifier (if available)
3. QR parsing handles common Bulgarian receipt formats (research actual format and handle variations)
4. Successfully parsed QR returns transaction data: `{amount, timestamp, merchantName (optional)}`
5. Failed parsing returns 400 Bad Request with error message: "Unable to parse receipt QR code"
6. QR parsing completes in under 2 seconds (NFR1 requirement)
7. QR parser includes logging for debugging parse failures
8. Unit tests cover successful parsing and various failure scenarios (invalid format, missing data)

## Story 2.3: Transaction Creation & History

As a **user**,
I want **scanned transactions to be saved to my account and viewable in a list**,
so that **I can see my recent spending history**.

### Acceptance Criteria

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

## Story 2.4: Manual Transaction Entry

As a **user**,
I want **to manually enter transaction details when QR code scanning fails or I paid with cash**,
so that **I can track all my spending even without receipts**.

### Acceptance Criteria

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
