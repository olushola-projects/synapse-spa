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
    // eslint-disable-next-line no-magic-numbers
    MIN_LENGTH: 2,
    // eslint-disable-next-line no-magic-numbers
    MAX_LENGTH: 50
  },
  BIO: {
    // eslint-disable-next-line no-magic-numbers
    MAX_LENGTH: 500
  },
  COMPANY: {
    // eslint-disable-next-line no-magic-numbers
    MAX_LENGTH: 100
  },
  POSITION: {
    // eslint-disable-next-line no-magic-numbers
    MAX_LENGTH: 100
  },
  CONTACT: {
    // eslint-disable-next-line no-magic-numbers
    SUBJECT_MIN_LENGTH: 5,
    // eslint-disable-next-line no-magic-numbers
    MESSAGE_MIN_LENGTH: 10
  }
} as const;

/**
 * UI Constants
 * Used for user interface elements and interactions
 */
export const UI_CONSTANTS = {
  ANIMATION: {
    // eslint-disable-next-line no-magic-numbers
    DURATION_MS: 200
  },
  SPACING: {
    // eslint-disable-next-line no-magic-numbers
    SMALL: 4,
    // eslint-disable-next-line no-magic-numbers
    MEDIUM: 8,
    // eslint-disable-next-line no-magic-numbers
    LARGE: 16
  }
} as const;

/**
 * API Constants
 * Used for API interactions and configurations
 */
export const API_CONSTANTS = {
  // eslint-disable-next-line no-magic-numbers
  TIMEOUT_MS: 30000,
  // eslint-disable-next-line no-magic-numbers
  RETRY_ATTEMPTS: 3,
  RATE_LIMIT: {
    // eslint-disable-next-line no-magic-numbers
    REQUESTS_PER_MINUTE: 60
  }
} as const;

/**
 * Time-related constants for consistent time calculations
 */
// eslint-disable-next-line no-magic-numbers
const SECONDS_PER_MINUTE = 60;
// eslint-disable-next-line no-magic-numbers
const MINUTES_PER_HOUR = 60;
// eslint-disable-next-line no-magic-numbers
const HOURS_PER_DAY = 24;
// eslint-disable-next-line no-magic-numbers
const DAYS_PER_WEEK = 7;

export const TIME_CONSTANTS = {
  // eslint-disable-next-line no-magic-numbers
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
  // eslint-disable-next-line no-magic-numbers
  PROCESSING_STAGE_DELAY_MS: 1000,
  // eslint-disable-next-line no-magic-numbers
  SIMPLE_PROCESSING_DELAY_MS: 1500
} as const;

/**
 * Security-related constants
 */
export const SECURITY_CONSTANTS = {
  TOKEN: {
    // eslint-disable-next-line no-magic-numbers
    RANDOM_BYTES: 16,
    // eslint-disable-next-line no-magic-numbers
    DEFAULT_LENGTH: 32
  },
  HASH: {
    // eslint-disable-next-line no-magic-numbers
    SALT_ROUNDS: 10
  },
  ENCRYPTION: {
    // eslint-disable-next-line no-magic-numbers
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
