/**
 * Time and Date Utilities (JavaScript Version)
 * Ensures all cursor settings and document creation use live time and date from the computer
 * Provides consistent time formatting and timezone handling across the application
 */


/**
 * Time zone configuration
 */
export const TIMEZONE_CONFIG = {
  DEFAULT_TIMEZONE: 'UTC',
  USER_TIMEZONE: Intl.DateTimeFormat().resolvedOptions().timeZone,
  SUPPORTED_TIMEZONES: [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Australia/Sydney'
  ]
};

/**
 * Time format options for consistent display
 */
export const TIME_FORMATS = {
  // Short formats for UI display
  SHORT_TIME: 'HH:mm',
  SHORT_DATE: 'MMM dd, yyyy',
  SHORT_DATETIME: 'MMM dd, yyyy HH:mm',
  
  // Long formats for detailed display
  LONG_TIME: 'HH:mm:ss',
  LONG_DATE: 'EEEE, MMMM dd, yyyy',
  LONG_DATETIME: 'EEEE, MMMM dd, yyyy HH:mm:ss',
  
  // ISO formats for API and storage
  ISO_DATE: 'yyyy-MM-dd',
  ISO_DATETIME: 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx',
  ISO_DATETIME_UTC: 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\'',
  
  // Relative time formats
  RELATIVE: 'relative',
  RELATIVE_SHORT: 'relative-short',
  
  // Timestamp formats
  TIMESTAMP: 'timestamp',
  TIMESTAMP_MS: 'timestamp-ms'
};

/**
 * Get current live time from computer
 * @returns {Date} Current Date object with live time
 */
export function getCurrentTime() {
  return new Date();
}

/**
 * Get current timestamp in milliseconds
 * @returns {number} Current timestamp as number
 */
export function getCurrentTimestamp() {
  return Date.now();
}

/**
 * Get current timestamp in seconds
 * @returns {number} Current timestamp in seconds
 */
export function getCurrentTimestampSeconds() {
  return Math.floor(Date.now() / 1000);
}

/**
 * Format relative time (e.g., "2 hours ago", "yesterday")
 * @param {Date} date - Date to format
 * @param {boolean} short - Whether to use short format
 * @returns {string} Relative time string
 */
export function formatRelativeTime(date, short = false) {
  const now = getCurrentTime();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSeconds < 60) {
    return short ? 'now' : 'just now';
  }
  
  if (diffMinutes < 60) {
    return short ? `${diffMinutes}m ago` : `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
  }
  
  if (diffHours < 24) {
    return short ? `${diffHours}h ago` : `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  }
  
  if (diffDays < 7) {
    return short ? `${diffDays}d ago` : `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  }
  
  // For longer periods, use absolute date
  return formatDateTime(date, short ? 'SHORT_DATE' : 'LONG_DATE');
}

/**
 * Format date/time according to specified format
 * @param {Date|string|number} date - Date to format
 * @param {string} format - Format to use (from TIME_FORMATS)
 * @param {string} timezone - Optional timezone (defaults to user's timezone)
 * @returns {string} Formatted date string
 */
export function formatDateTime(
  date,
  format = 'SHORT_DATETIME',
  timezone = TIMEZONE_CONFIG.USER_TIMEZONE
) {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  
  // Handle relative time formats
  if (format === 'RELATIVE' || format === 'RELATIVE_SHORT') {
    return formatRelativeTime(dateObj, format === 'RELATIVE_SHORT');
  }
  
  // Handle timestamp formats
  if (format === 'TIMESTAMP') {
    return dateObj.getTime().toString();
  }
  
  if (format === 'TIMESTAMP_MS') {
    return dateObj.getTime().toString();
  }
  
  // Handle ISO formats
  if (format === 'ISO_DATE') {
    return dateObj.toISOString().split('T')[0];
  }
  
  if (format === 'ISO_DATETIME') {
    return dateObj.toISOString();
  }
  
  if (format === 'ISO_DATETIME_UTC') {
    return dateObj.toISOString();
  }
  
  // Handle standard formats using Intl.DateTimeFormat
  const formatMap = {
    SHORT_TIME: { hour: '2-digit', minute: '2-digit' },
    SHORT_DATE: { month: 'short', day: '2-digit', year: 'numeric' },
    SHORT_DATETIME: { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' },
    LONG_TIME: { hour: '2-digit', minute: '2-digit', second: '2-digit' },
    LONG_DATE: { weekday: 'long', month: 'long', day: '2-digit', year: 'numeric' },
    LONG_DATETIME: { weekday: 'long', month: 'long', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }
  };
  
  const options = formatMap[format];
  if (options) {
    return new Intl.DateTimeFormat('en-US', {
      ...options,
      timeZone: timezone
    }).format(dateObj);
  }
  
  // Fallback to default format
  return dateObj.toLocaleString('en-US', { timeZone: timezone });
}

/**
 * Create a timestamp for document creation
 * @returns {Object} Timestamp object with creation time
 */
export function createDocumentTimestamp() {
  const now = getCurrentTime();
  
  return {
    created_at: formatDateTime(now, 'LONG_DATETIME'),
    created_at_iso: formatDateTime(now, 'ISO_DATETIME'),
    created_at_timestamp: now.getTime(),
    created_at_relative: formatRelativeTime(now)
  };
}

/**
 * Create a timestamp for cursor settings and activities
 * @returns {Object} Timestamp object for cursor activities
 */
export function createCursorTimestamp() {
  const now = getCurrentTime();
  
  return {
    timestamp: formatDateTime(now, 'SHORT_DATETIME'),
    timestamp_iso: formatDateTime(now, 'ISO_DATETIME'),
    timestamp_ms: now.getTime(),
    timestamp_relative: formatRelativeTime(now, true),
    timezone: TIMEZONE_CONFIG.USER_TIMEZONE
  };
}

/**
 * Create a timestamp for API responses and logging
 * @returns {Object} Timestamp object for API activities
 */
export function createApiTimestamp() {
  const now = getCurrentTime();
  
  return {
    timestamp: formatDateTime(now, 'LONG_DATETIME'),
    timestamp_iso: formatDateTime(now, 'ISO_DATETIME_UTC'),
    timestamp_ms: now.getTime()
  };
}

/**
 * Calculate time difference between two dates
 * @param {Date|string|number} startDate - Start date
 * @param {Date|string|number} endDate - End date (defaults to current time)
 * @returns {Object} Time difference object
 */
export function calculateTimeDifference(startDate, endDate = getCurrentTime()) {
  const start = typeof startDate === 'string' || typeof startDate === 'number' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' || typeof endDate === 'number' ? new Date(endDate) : endDate;
  
  const diffMs = end.getTime() - start.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  let formatted = '';
  if (diffDays > 0) {
    formatted = `${diffDays}d ${diffHours % 24}h ${diffMinutes % 60}m`;
  } else if (diffHours > 0) {
    formatted = `${diffHours}h ${diffMinutes % 60}m`;
  } else if (diffMinutes > 0) {
    formatted = `${diffMinutes}m ${diffSeconds % 60}s`;
  } else {
    formatted = `${diffSeconds}s`;
  }
  
  return {
    milliseconds: diffMs,
    seconds: diffSeconds,
    minutes: diffMinutes,
    hours: diffHours,
    days: diffDays,
    formatted
  };
}

/**
 * Check if a date is today
 * @param {Date|string|number} date - Date to check
 * @returns {boolean} True if date is today
 */
export function isToday(date) {
  const checkDate = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  const today = getCurrentTime();
  
  return (
    checkDate.getDate() === today.getDate() &&
    checkDate.getMonth() === today.getMonth() &&
    checkDate.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if a date is in the past
 * @param {Date|string|number} date - Date to check
 * @returns {boolean} True if date is in the past
 */
export function isPast(date) {
  const checkDate = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  return checkDate < getCurrentTime();
}

/**
 * Check if a date is in the future
 * @param {Date|string|number} date - Date to check
 * @returns {boolean} True if date is in the future
 */
export function isFuture(date) {
  const checkDate = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  return checkDate > getCurrentTime();
}

/**
 * Get timezone offset in minutes
 * @param {string} timezone - Timezone to get offset for (defaults to user's timezone)
 * @returns {number} Timezone offset in minutes
 */
export function getTimezoneOffset(timezone = TIMEZONE_CONFIG.USER_TIMEZONE) {
  const now = getCurrentTime();
  const utc = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
  const local = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
  return (utc.getTime() - local.getTime()) / (1000 * 60);
}

/**
 * Convert date to user's timezone
 * @param {Date|string|number} date - Date to convert
 * @param {string} fromTimezone - Source timezone (defaults to UTC)
 * @returns {Date} Date in user's timezone
 */
export function convertToUserTimezone(date, fromTimezone = 'UTC') {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  
  // Create a new date object in the user's timezone
  const userTimezoneDate = new Date(
    dateObj.toLocaleString('en-US', { timeZone: TIMEZONE_CONFIG.USER_TIMEZONE })
  );
  
  return userTimezoneDate;
}

/**
 * Get current time in a specific timezone
 * @param {string} timezone - Target timezone
 * @returns {Date} Date object in specified timezone
 */
export function getCurrentTimeInTimezone(timezone) {
  const now = getCurrentTime();
  return new Date(now.toLocaleString('en-US', { timeZone: timezone }));
}

/**
 * Validate if a timezone is supported
 * @param {string} timezone - Timezone to validate
 * @returns {boolean} True if timezone is supported
 */
export function isValidTimezone(timezone) {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get list of all available timezones
 * @returns {string[]} Array of timezone names
 */
export function getAvailableTimezones() {
  return Intl.supportedValuesOf('timeZone');
}

/**
 * Time utility for performance monitoring
 */
export class PerformanceTimer {
  constructor() {
    this.startTime = getCurrentTimestamp();
  }
  
  /**
   * Stop the timer
   * @returns {PerformanceTimer} Timer instance for chaining
   */
  stop() {
    this.endTime = getCurrentTimestamp();
    return this;
  }
  
  /**
   * Get elapsed time in milliseconds
   * @returns {number} Elapsed time
   */
  getElapsedMs() {
    const end = this.endTime || getCurrentTimestamp();
    return end - this.startTime;
  }
  
  /**
   * Get elapsed time formatted
   * @returns {string} Formatted elapsed time
   */
  getElapsedFormatted() {
    const elapsed = this.getElapsedMs();
    if (elapsed < 1000) {
      return `${elapsed}ms`;
    } else if (elapsed < 60000) {
      return `${(elapsed / 1000).toFixed(2)}s`;
    } else {
      const minutes = Math.floor(elapsed / 60000);
      const seconds = ((elapsed % 60000) / 1000).toFixed(2);
      return `${minutes}m ${seconds}s`;
    }
  }
  
  /**
   * Reset the timer
   */
  reset() {
    this.startTime = getCurrentTimestamp();
    this.endTime = undefined;
  }
}

/**
 * Create a new performance timer
 * @returns {PerformanceTimer} PerformanceTimer instance
 */
export function createTimer() {
  return new PerformanceTimer();
}

// Export default functions for backward compatibility
export default {
  getCurrentTime,
  getCurrentTimestamp,
  formatDateTime,
  formatRelativeTime,
  createDocumentTimestamp,
  createCursorTimestamp,
  createApiTimestamp,
  calculateTimeDifference,
  isToday,
  isPast,
  isFuture,
  getTimezoneOffset,
  convertToUserTimezone,
  getCurrentTimeInTimezone,
  isValidTimezone,
  getAvailableTimezones,
  createTimer
};
