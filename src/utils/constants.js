/**
 * Application Constants
 *
 * Centralized configuration values and constants used across the application
 * This helps maintain consistency and makes values easier to update
 */
/**
 * Validation Constants
 * Used for form validation and input constraints
 */
export const VALIDATION_CONSTANTS = {
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50
  },
  BIO: {
    MAX_LENGTH: 500
  },
  COMPANY: {
    MAX_LENGTH: 100
  },
  POSITION: {
    MAX_LENGTH: 100
  },
  CONTACT: {
    SUBJECT_MIN_LENGTH: 5,
    MESSAGE_MIN_LENGTH: 10
  }
};
/**
 * UI Constants
 * Used for user interface elements and interactions
 */
export const UI_CONSTANTS = {
  ANIMATION: {
    DURATION_MS: 200
  },
  SPACING: {
    SMALL: 4,
    MEDIUM: 8,
    LARGE: 16
  }
};
/**
 * API Constants
 * Used for API interactions and configurations
 */
export const API_CONSTANTS = {
  TIMEOUT_MS: 30000,
  RETRY_ATTEMPTS: 3,
  RATE_LIMIT: {
    REQUESTS_PER_MINUTE: 60
  }
};
/**
 * Monitoring Constants
 * Used for system monitoring and dashboard configurations
 */
export const MONITORING_CONSTANTS = {
  UPDATE_INTERVAL_MS: 30000,
  RESPONSE_TIME: {
    MAX_THRESHOLD_MS: 5000,
    WARNING_THRESHOLD_MS: 3000,
    CRITICAL_THRESHOLD_MS: 8000
  },
  GRID: {
    COLUMNS: 4
  },
  PROGRESS: {
    HEIGHT_PX: 2
  },
  ICON: {
    SIZE: {
      SMALL_PX: 4,
      MEDIUM_PX: 5,
      LARGE_PX: 8,
      XLARGE_PX: 12
    }
  },
  METRICS: {
    LOAD: {
      WARNING_THRESHOLD: 0.82,
      CRITICAL_THRESHOLD: 0.95
    },
    MEMORY: {
      WARNING_THRESHOLD_MB: 800,
      CRITICAL_THRESHOLD_MB: 950
    },
    CPU: {
      WARNING_THRESHOLD_PERCENT: 80,
      CRITICAL_THRESHOLD_PERCENT: 90
    },
    API: {
      SUCCESS_RATE: {
        WARNING_THRESHOLD: 0.95,
        CRITICAL_THRESHOLD: 0.9
      },
      LATENCY: {
        WARNING_MS: 200,
        CRITICAL_MS: 400
      }
    }
  },
  CHART: {
    HEIGHT_PX: 220,
    WIDTH_PX: 400,
    BAR: {
      WIDTH_PX: 30,
      GAP_PX: 20
    },
    PADDING: {
      TOP_PX: 40,
      RIGHT_PX: 20,
      BOTTOM_PX: 40,
      LEFT_PX: 60
    }
  },
  GRAPH: {
    POINTS: {
      MIN: 0,
      MAX: 100
    },
    SCALE: {
      MIN: 0.82,
      STEP: 0.1
    },
    DIMENSIONS: {
      HEIGHT: 245,
      WIDTH: 220,
      LARGE_WIDTH: 400,
      XLARGE_WIDTH: 800,
      MARGIN: 200
    },
    THRESHOLD: {
      WARNING: 0.95,
      CRITICAL: 0.04
    }
  }
};
/**
 * Time-related constants for consistent time calculations
 */
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const DAYS_PER_WEEK = 7;
export const TIME_CONSTANTS = {
  SECOND_IN_MS: 1000,
  get MINUTE_IN_MS() {
    return SECONDS_PER_MINUTE * this.SECOND_IN_MS;
  },
  get HOUR_IN_MS() {
    return MINUTES_PER_HOUR * this.MINUTE_IN_MS;
  },
  get DAY_IN_MS() {
    return HOURS_PER_DAY * this.HOUR_IN_MS;
  },
  get WEEK_IN_MS() {
    return DAYS_PER_WEEK * this.DAY_IN_MS;
  },
  // Chat processing delays
  PROCESSING_STAGE_DELAY_MS: 1000,
  SIMPLE_PROCESSING_DELAY_MS: 1500
};
/**
 * Security-related constants
 */
export const SECURITY_CONSTANTS = {
  TOKEN: {
    RANDOM_BYTES: 16,
    DEFAULT_LENGTH: 32
  },
  HASH: {
    SALT_ROUNDS: 10
  },
  ENCRYPTION: {
    KEY_LENGTH: 16
  }
};
export default {
  VALIDATION: VALIDATION_CONSTANTS,
  UI: UI_CONSTANTS,
  API: API_CONSTANTS,
  TIME: TIME_CONSTANTS,
  SECURITY: SECURITY_CONSTANTS,
  MONITORING: MONITORING_CONSTANTS
};
