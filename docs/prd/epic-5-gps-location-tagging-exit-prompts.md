# Epic 5: GPS Location Tagging & Exit Prompts

**Epic Goal:** Enable proactive location-based behavioral coaching by allowing users to tag frequent spending locations and implementing geofencing exit detection that prompts users to record transactions. This solves the "forgetting to track" problem and creates a unique product differentiator.

## Story 5.1: GPS Location Tagging

As a **user**,
I want **to tag stores and restaurants I frequently visit**,
so that **I can see my spending history by location and enable location-based reminders**.

### Acceptance Criteria

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

## Story 5.2: Auto-Suggest Location Tagging

As a **user**,
I want **the app to suggest tagging a location after I've visited it multiple times**,
so that **I don't have to manually tag every frequent location**.

### Acceptance Criteria

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

## Story 5.3: Geofencing Setup & Exit Detection

As a **backend system**,
I want **to set up geofences around user's tagged locations and detect when they exit**,
so that **exit prompt notifications can be triggered for transaction entry reminders**.

### Acceptance Criteria

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

## Story 5.4: Exit Prompt Notifications

As a **user**,
I want **to receive a gentle reminder to log my spending when I leave a tagged location**,
so that **I don't forget to track transactions and maintain complete spending records**.

### Acceptance Criteria

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
