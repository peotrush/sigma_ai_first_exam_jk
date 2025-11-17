/**
 * Kash Budget - Shared Constants
 * Used across frontend and backend
 */
export declare const API_CONFIG: {
    REQUEST_TIMEOUT: number;
    RETRY_ATTEMPTS: number;
    RETRY_DELAY: number;
};
export declare const VALIDATION: {
    TRANSACTION_MIN_AMOUNT: number;
    TRANSACTION_MAX_AMOUNT: number;
    TRANSACTION_DECIMAL_PLACES: number;
    PASSWORD_MIN_LENGTH: number;
    PASSWORD_MAX_LENGTH: number;
    EMAIL_REGEX: RegExp;
    LOCATION_RADIUS_METERS: number;
    GEOFENCE_RADIUS_METERS: number;
    GEOFENCE_DWELL_TIME_MS: number;
    CATEGORIES_MAX_LENGTH: number;
    NOTES_MAX_LENGTH: number;
};
export declare const GAMIFICATION: {
    CREDITS_BY_SCAN_COUNT: {
        FIRST_10: number;
        SCANS_11_30: number;
        SCANS_31_100: number;
        SCANS_100_PLUS: number;
    };
    STREAK_BONUSES: {
        THREE_DAY: {
            days: number;
            credits: number;
        };
        SEVEN_DAY: {
            days: number;
            credits: number;
        };
        FOURTEEN_DAY: {
            days: number;
            credits: number;
        };
        THIRTY_DAY: {
            days: number;
            credits: number;
        };
    };
    MILESTONE_BONUSES: {
        TEN_SCANS: number;
        FIFTY_SCANS: number;
        HUNDRED_SCANS: number;
    };
    MAX_SCANS_PER_DAY: number;
    STREAK_RESET_HOURS: number;
};
export declare const ML: {
    MIN_TRAINING_SAMPLES: number;
    CONFIDENCE_THRESHOLD: number;
    TARGET_ACCURACY: number;
    INFERENCE_TIMEOUT_MS: number;
};
export declare const QR_SCANNING: {
    SCAN_TIMEOUT_MS: number;
    BULGARIAN_QR_VERSION: string;
};
export declare const PERFORMANCE: {
    QR_SCAN_TARGET_MS: number;
    APP_LAUNCH_TARGET_MS: number;
    ANIMATION_FPS_TARGET: number;
    BATTERY_BUDGET_PERCENT: number;
    API_RESPONSE_TARGET_MS: number;
};
export declare const NOTIFICATIONS: {
    MORNING_MESSAGE_HOUR: number;
    QUIET_HOURS_START: number;
    QUIET_HOURS_END: number;
    EXIT_PROMPT_THROTTLE_HOURS: number;
    NOTIFICATION_DISMISS_MS: number;
    REENGAGEMENT_DAYS: number;
};
export declare const BUDGET: {
    STATUS_GREEN_THRESHOLD: number;
    STATUS_YELLOW_THRESHOLD: number;
    TREAT_YOURSELF_CATEGORY: string;
};
export declare const AUTH: {
    ACCESS_TOKEN_EXPIRY_HOURS: number;
    REFRESH_TOKEN_EXPIRY_DAYS: number;
    SOCIAL_AUTH_PROVIDERS: readonly ["google", "apple"];
};
export declare const DATABASE: {
    POOL_MIN: number;
    POOL_MAX: number;
    QUERY_TIMEOUT_MS: number;
};
export declare const FEATURE_FLAGS: {
    QR_SCANNING: boolean;
    GEOFENCING: boolean;
    ML_CATEGORIZATION: boolean;
    GAMIFICATION: boolean;
    LOCATION_TAGGING: boolean;
    TREAT_YOURSELF: boolean;
};
//# sourceMappingURL=constants.d.ts.map