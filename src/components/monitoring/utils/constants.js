/**
 * Monitoring System Constants
 */
export const MONITORING_CONSTANTS = {
    METRICS: {
        LOAD: {
            WARNING_THRESHOLD: 0.82,
            CRITICAL_THRESHOLD: 0.95,
        },
        MEMORY: {
            WARNING_THRESHOLD_MB: 800,
            CRITICAL_THRESHOLD_MB: 950,
        },
        CPU: {
            WARNING_THRESHOLD_PERCENT: 80,
            CRITICAL_THRESHOLD_PERCENT: 90,
        },
        API: {
            WARNING_THRESHOLD: 0.95,
            CRITICAL_THRESHOLD: 0.9,
            SUCCESS_RATE: {
                WARNING_THRESHOLD: 0.95,
                CRITICAL_THRESHOLD: 0.9,
            },
            LATENCY: {
                WARNING_MS: 200,
                CRITICAL_MS: 400,
            }
        },
        API_LATENCY: {
            WARNING_MS: 200,
            CRITICAL_MS: 500,
        },
    },
    ICON: {
        SIZE: {
            SMALL_PX: 4,
            MEDIUM_PX: 6,
            LARGE_PX: 8,
        },
    },
    POLLING_INTERVALS: {
        SYSTEM_OVERVIEW: 5000,
        ALERTS: 3000,
        METRICS: 2000,
    },
    ALERT_LIMITS: {
        MAX_DISPLAYED: 50,
        AUTO_RESOLVE_HOURS: 24,
    },
};
