/**
 * Logging Utility
 *
 * Provides centralized logging functionality with environment-based controls
 * Replaces direct console usage for better production management
 */
/**
 * Log levels for controlling output verbosity
 */
const LOG_LEVEL_DEBUG = 3;
export var LogLevel;
(function (LogLevel) {
  LogLevel[(LogLevel['ERROR'] = 0)] = 'ERROR';
  LogLevel[(LogLevel['WARN'] = 1)] = 'WARN';
  LogLevel[(LogLevel['INFO'] = 2)] = 'INFO';
  LogLevel[(LogLevel['DEBUG'] = 3)] = 'DEBUG';
})(LogLevel || (LogLevel = {}));
/**
 * Centralized logging utility class
 */
class Logger {
  config;
  logHistory = [];
  maxHistorySize = 1000;
  constructor(config = {}) {
    // Determine if we're in production mode
    const isProduction =
      typeof process !== 'undefined' && process.env ? process.env.NODE_ENV === 'production' : false;
    this.config = {
      level: this.getEnvironmentLogLevel(),
      enableConsole: !isProduction,
      enableRemote: isProduction,
      prefix: 'Synapse',
      ...config
    };
  }
  /**
   * Determine log level based on environment
   */
  getEnvironmentLogLevel() {
    // Use process.env for Node.js backend, fallback to import.meta.env for frontend
    let envLevel;
    if (typeof process !== 'undefined' && process.env) {
      envLevel = process.env.LOG_LEVEL || process.env.VITE_LOG_LEVEL;
    } else if (typeof globalThis.window !== 'undefined' && globalThis.process?.env) {
      envLevel = globalThis.import.meta.env.VITE_LOG_LEVEL;
    }
    const level = envLevel?.toUpperCase();
    switch (level) {
      case 'ERROR':
        return LogLevel.ERROR;
      case 'WARN':
        return LogLevel.WARN;
      case 'INFO':
        return LogLevel.INFO;
      case 'DEBUG':
        return LogLevel.DEBUG;
      default:
        // Use NODE_ENV for Node.js, fallback to development mode
        const mode =
          typeof process !== 'undefined' && process.env ? process.env.NODE_ENV : 'development';
        return mode === 'production' ? LogLevel.WARN : LogLevel.DEBUG;
    }
  }
  /**
   * Create a formatted log entry
   */
  createLogEntry(level, message, data, context) {
    return {
      level,
      message,
      data,
      timestamp: new Date(),
      context
    };
  }
  /**
   * Format log message for console output
   */
  formatMessage(entry) {
    const timestamp = entry.timestamp.toISOString();
    const levelName = LogLevel[entry.level];
    const context = entry.context ? `[${entry.context}]` : '';
    return `[${this.config.prefix}] ${timestamp} ${levelName} ${context} ${entry.message}`;
  }
  /**
   * Log a message if it meets the current log level threshold
   */
  log(level, message, data, context) {
    if (level > this.config.level) {
      return;
    }
    const entry = this.createLogEntry(level, message, data, context);
    // Add to history
    this.addToHistory(entry);
    // Console output
    if (this.config.enableConsole) {
      this.logToConsole(entry);
    }
    // Remote logging (if enabled)
    if (this.config.enableRemote && level <= LogLevel.WARN) {
      this.logToRemote(entry);
    }
  }
  /**
   * Output to console with appropriate method
   */
  logToConsole(entry) {
    const formattedMessage = this.formatMessage(entry);
    switch (entry.level) {
      case LogLevel.ERROR:
        // eslint-disable-next-line no-console
        console.error(formattedMessage, entry.data);
        break;
      case LogLevel.WARN:
        // eslint-disable-next-line no-console
        console.warn(formattedMessage, entry.data);
        break;
      case LogLevel.INFO:
        // eslint-disable-next-line no-console
        console.info(formattedMessage, entry.data);
        break;
      case LogLevel.DEBUG:
        // eslint-disable-next-line no-console
        console.debug(formattedMessage, entry.data);
        break;
      default:
        // eslint-disable-next-line no-console
        console.log(formattedMessage, entry.data);
        break;
    }
  }
  /**
   * Send logs to remote service (placeholder for future implementation)
   */
  logToRemote(entry) {
    // TODO: Implement remote logging service integration
    // This could send to services like LogRocket, Sentry, or custom endpoints
    if (entry.level <= LogLevel.ERROR) {
      // For now, just ensure critical errors are noted
      // eslint-disable-next-line no-console
      console.error('REMOTE LOG:', this.formatMessage(entry), entry.data);
    }
  }
  /**
   * Add entry to log history with size management
   */
  addToHistory(entry) {
    this.logHistory.push(entry);
    if (this.logHistory.length > this.maxHistorySize) {
      this.logHistory = this.logHistory.slice(-this.maxHistorySize);
    }
  }
  /**
   * Log an error message
   */
  error(message, data, context) {
    this.log(LogLevel.ERROR, message, data, context);
  }
  /**
   * Log a warning message
   */
  warn(message, data, context) {
    this.log(LogLevel.WARN, message, data, context);
  }
  /**
   * Log an info message
   */
  info(message, data, context) {
    this.log(LogLevel.INFO, message, data, context);
  }
  /**
   * Log a debug message
   */
  debug(message, data, context) {
    this.log(LogLevel.DEBUG, message, data, context);
  }
  /**
   * Get recent log entries
   */
  getRecentLogs(limit = 50) {
    return this.logHistory.slice(-limit);
  }
  /**
   * Get logs by level
   */
  getLogsByLevel(level) {
    return this.logHistory.filter(entry => entry.level === level);
  }
  /**
   * Clear log history
   */
  clearHistory() {
    this.logHistory = [];
  }
  /**
   * Update logger configuration
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }
  /**
   * Create a child logger with specific context
   */
  createChild(context) {
    return new ChildLogger(this, context);
  }
}
/**
 * Child logger for component-specific logging
 */
class ChildLogger {
  parent;
  context;
  constructor(parent, context) {
    this.parent = parent;
    this.context = context;
  }
  error(message, data) {
    this.parent.error(message, data, this.context);
  }
  warn(message, data) {
    this.parent.warn(message, data, this.context);
  }
  info(message, data) {
    this.parent.info(message, data, this.context);
  }
  debug(message, data) {
    this.parent.debug(message, data, this.context);
  }
}
// Create and export default logger instance
const defaultLogger = new Logger();
export { Logger, ChildLogger };
export default defaultLogger;
// Named export for compatibility
export const logger = defaultLogger;
// Convenience exports for common usage
export const log = {
  error: (message, data, context) => defaultLogger.error(message, data, context),
  warn: (message, data, context) => defaultLogger.warn(message, data, context),
  info: (message, data, context) => defaultLogger.info(message, data, context),
  debug: (message, data, context) => defaultLogger.debug(message, data, context)
};
