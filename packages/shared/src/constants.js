"use strict";
/**
 * Kash Budget - Shared Constants
 * Used across frontend and backend
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FEATURE_FLAGS = exports.DATABASE = exports.AUTH = exports.BUDGET = exports.NOTIFICATIONS = exports.PERFORMANCE = exports.QR_SCANNING = exports.ML = exports.GAMIFICATION = exports.VALIDATION = exports.API_CONFIG = void 0;
// ============================================================================
// API CONFIGURATION
// ============================================================================
exports.API_CONFIG = {
    REQUEST_TIMEOUT: 30000, // 30 seconds
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // 1 second
};
// ============================================================================
// VALIDATION RULES
// ============================================================================
exports.VALIDATION = {
    // Transaction amounts
    TRANSACTION_MIN_AMOUNT: 0.01,
    TRANSACTION_MAX_AMOUNT: 999999.99,
    TRANSACTION_DECIMAL_PLACES: 2,
    // Password
    PASSWORD_MIN_LENGTH: 8,
    PASSWORD_MAX_LENGTH: 128,
    // Email
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    // Location
    LOCATION_RADIUS_METERS: 50, // 50m radius for detecting same location
    GEOFENCE_RADIUS_METERS: 100, // 100m geofence
    GEOFENCE_DWELL_TIME_MS: 3 * 60 * 1000, // 3 minutes
    // Categories
    CATEGORIES_MAX_LENGTH: 50,
    // Notes
    NOTES_MAX_LENGTH: 500,
};
// ============================================================================
// GAMIFICATION CONFIGURATION
// ============================================================================
exports.GAMIFICATION = {
    // Progressive credit rewards for scanning
    CREDITS_BY_SCAN_COUNT: {
        FIRST_10: 5,
        SCANS_11_30: 10,
        SCANS_31_100: 15,
        SCANS_100_PLUS: 20,
    },
    // Streak bonuses
    STREAK_BONUSES: {
        THREE_DAY: { days: 3, credits: 25 },
        SEVEN_DAY: { days: 7, credits: 75 },
        FOURTEEN_DAY: { days: 14, credits: 150 },
        THIRTY_DAY: { days: 30, credits: 500 },
    },
    // Milestone bonuses
    MILESTONE_BONUSES: {
        TEN_SCANS: 50,
        FIFTY_SCANS: 200,
        HUNDRED_SCANS: 500,
    },
    // Max scans per day (prevent gaming)
    MAX_SCANS_PER_DAY: 10,
    // Streak reset threshold
    STREAK_RESET_HOURS: 24,
};
// ============================================================================
// ML/CATEGORIZATION CONFIGURATION
// ============================================================================
exports.ML = {
    // Minimum training samples required
    MIN_TRAINING_SAMPLES: 5,
    // ML confidence threshold for auto-categorization
    CONFIDENCE_THRESHOLD: 0.7,
    // Target accuracy for auto-categorization (NFR10)
    TARGET_ACCURACY: 0.9,
    // Model inference timeout
    INFERENCE_TIMEOUT_MS: 500,
};
// ============================================================================
// QR CODE SCANNING
// ============================================================================
exports.QR_SCANNING = {
    // QR scanning timeout
    SCAN_TIMEOUT_MS: 2000, // NFR1: < 2 seconds
    // Bulgarian QR format details
    BULGARIAN_QR_VERSION: '1.0',
};
// ============================================================================
// PERFORMANCE TARGETS (NFRs)
// ============================================================================
exports.PERFORMANCE = {
    // NFR1: QR scanning < 2 seconds
    QR_SCAN_TARGET_MS: 2000,
    // NFR2: App launch < 3 seconds
    APP_LAUNCH_TARGET_MS: 3000,
    // NFR3: Animations at 60 FPS
    ANIMATION_FPS_TARGET: 60,
    // NFR4: Battery usage < 5% per day
    BATTERY_BUDGET_PERCENT: 5,
    // NFR17: API response < 500ms for 95% of requests
    API_RESPONSE_TARGET_MS: 500,
};
// ============================================================================
// NOTIFICATION CONFIGURATION
// ============================================================================
exports.NOTIFICATIONS = {
    // Morning motivation message time (local time)
    MORNING_MESSAGE_HOUR: 8, // 8 AM
    // Quiet hours (no notifications)
    QUIET_HOURS_START: 22, // 10 PM
    QUIET_HOURS_END: 8, // 8 AM
    // Exit prompt throttle (max 1 per location per day)
    EXIT_PROMPT_THROTTLE_HOURS: 24,
    // Notification auto-dismiss timeout
    NOTIFICATION_DISMISS_MS: 1 * 60 * 60 * 1000, // 1 hour
    // Re-engagement message threshold (no scans in X days)
    REENGAGEMENT_DAYS: 7,
};
// ============================================================================
// BUDGET CONFIGURATION
// ============================================================================
exports.BUDGET = {
    // Budget progress color coding thresholds
    STATUS_GREEN_THRESHOLD: 0.7, // < 70% = green
    STATUS_YELLOW_THRESHOLD: 0.9, // 70-90% = yellow
    // > 90% = red
    // Treat Yourself category ID (special)
    TREAT_YOURSELF_CATEGORY: 'treat_yourself',
};
// ============================================================================
// AUTHENTICATION
// ============================================================================
exports.AUTH = {
    // JWT token expiry
    ACCESS_TOKEN_EXPIRY_HOURS: 24,
    REFRESH_TOKEN_EXPIRY_DAYS: 30,
    // Social auth providers
    SOCIAL_AUTH_PROVIDERS: ['google', 'apple'],
};
// ============================================================================
// DATABASE CONFIGURATION
// ============================================================================
exports.DATABASE = {
    // Connection pool size
    POOL_MIN: 2,
    POOL_MAX: 10,
    // Query timeout
    QUERY_TIMEOUT_MS: 30000,
};
// ============================================================================
// FEATURE FLAGS
// ============================================================================
exports.FEATURE_FLAGS = {
    // Enable/disable features
    QR_SCANNING: true,
    GEOFENCING: true,
    ML_CATEGORIZATION: true,
    GAMIFICATION: true,
    LOCATION_TAGGING: true,
    TREAT_YOURSELF: true,
    // Can be toggled via admin panel in future
};
