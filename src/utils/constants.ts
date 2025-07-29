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
} as const;

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
} as const;

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
} as const;

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
} as const;

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
} as const;

export default {
  VALIDATION: VALIDATION_CONSTANTS,
  UI: UI_CONSTANTS,
  API: API_CONSTANTS,
  TIME: TIME_CONSTANTS,
  SECURITY: SECURITY_CONSTANTS
};
