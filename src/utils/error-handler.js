/**
 * Centralized Error Handling Utility
 * Provides consistent error handling, logging, and user feedback across the application
 */
import { logger } from './logger';
export var ErrorSeverity;
(function (ErrorSeverity) {
  ErrorSeverity['LOW'] = 'low';
  ErrorSeverity['MEDIUM'] = 'medium';
  ErrorSeverity['HIGH'] = 'high';
  ErrorSeverity['CRITICAL'] = 'critical';
})(ErrorSeverity || (ErrorSeverity = {}));
export var ErrorCategory;
(function (ErrorCategory) {
  ErrorCategory['AUTHENTICATION'] = 'authentication';
  ErrorCategory['NETWORK'] = 'network';
  ErrorCategory['VALIDATION'] = 'validation';
  ErrorCategory['PERMISSION'] = 'permission';
  ErrorCategory['SYSTEM'] = 'system';
  ErrorCategory['USER_INPUT'] = 'user_input';
})(ErrorCategory || (ErrorCategory = {}));
export class CustomError extends Error {
  id;
  category;
  severity;
  context;
  timestamp;
  constructor(message, options) {
    super(message);
    this.name = 'CustomError';
    this.id = this.generateErrorId();
    this.category = options.category;
    this.severity = options.severity ?? ErrorSeverity.MEDIUM;
    this.context = options.context;
    this.timestamp = new Date();
    if (options.originalError) {
      this.stack = options.originalError.stack;
      // Note: cause property may not be available in all environments
      if ('cause' in this) {
        this.cause = options.originalError;
      }
    }
  }
  generateErrorId() {
    const RADIX_BASE = 36;
    const SUBSTRING_LENGTH = 9;
    const SUBSTRING_START = 2;
    return `${Date.now()}-${Math.random()
      .toString(RADIX_BASE)
      .substr(SUBSTRING_START, SUBSTRING_LENGTH)}`;
  }
  toJSON() {
    return {
      id: this.id,
      message: this.message,
      category: this.category,
      severity: this.severity,
      timestamp: this.timestamp,
      context: this.context,
      stack: this.stack
    };
  }
}
const ERROR_HANDLER_CONSTANTS = {
  MAX_LOG_SIZE: 1000,
  DEFAULT_RETRY_LIMIT: 20,
  DEFAULT_RETRY_DAYS: 7
};
export class ErrorHandler {
  static instance;
  errorLog = [];
  maxLogSize = ERROR_HANDLER_CONSTANTS.MAX_LOG_SIZE;
  constructor() {
    // Initialize error handler singleton
    this.errorLog = [];
    this.maxLogSize = ERROR_HANDLER_CONSTANTS.MAX_LOG_SIZE;
  }
  static getInstance() {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }
  /**
   * Handle and log an error
   */
  handleError(error, options = {}) {
    const { category = ErrorCategory.SYSTEM, severity = ErrorSeverity.MEDIUM, context } = options;
    let appError;
    if (error instanceof CustomError) {
      appError = error.toJSON();
    } else if (error instanceof Error) {
      const customError = new CustomError(error.message, {
        category,
        severity,
        context,
        originalError: error
      });
      appError = customError.toJSON();
    } else {
      const customError = new CustomError(error, {
        category,
        severity,
        context
      });
      appError = customError.toJSON();
    }
    // Log the error
    this.logError(appError);
    // Store in memory log
    this.addToErrorLog(appError);
    // Report to external service if critical
    if (severity === ErrorSeverity.CRITICAL) {
      this.reportCriticalError(appError);
    }
    return appError;
  }
  /**
   * Log error to console with proper formatting
   */
  logError(error) {
    const logMessage = `[${error.severity.toUpperCase()}] ${error.category}: ${error.message}`;
    const logData = {
      id: error.id,
      timestamp: error.timestamp,
      context: error.context,
      stack: error.stack
    };
    switch (error.severity) {
      case ErrorSeverity.CRITICAL:
      case ErrorSeverity.HIGH:
        logger.error(logMessage, logData);
        break;
      case ErrorSeverity.MEDIUM:
        logger.warn(logMessage, logData);
        break;
      case ErrorSeverity.LOW:
        logger.info(logMessage, logData);
        break;
      default:
        logger.debug(logMessage, logData);
        break;
    }
  }
  /**
   * Add error to in-memory log with size management
   */
  addToErrorLog(error) {
    this.errorLog.push(error);
    // Maintain log size limit
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(-this.maxLogSize);
    }
  }
  /**
   * Report critical errors to external monitoring service
   */
  reportCriticalError(error) {
    // TODO: Implement external error reporting (e.g., Sentry, LogRocket)
    logger.error('CRITICAL ERROR REPORTED:', error);
  }
  /**
   * Get recent errors for debugging
   */
  getRecentErrors(limit = 50) {
    return this.errorLog.slice(-limit);
  }
  /**
   * Get errors by category
   */
  getErrorsByCategory(category) {
    return this.errorLog.filter(error => error.category === category);
  }
  /**
   * Get errors by severity
   */
  getErrorsBySeverity(severity) {
    return this.errorLog.filter(error => error.severity === severity);
  }
  /**
   * Clear error log
   */
  clearErrorLog() {
    this.errorLog = [];
  }
  /**
   * Get error statistics
   */
  getErrorStats() {
    const stats = {};
    // Count by category
    Object.values(ErrorCategory).forEach(category => {
      stats[`category_${category}`] = this.getErrorsByCategory(category).length;
    });
    // Count by severity
    Object.values(ErrorSeverity).forEach(severity => {
      stats[`severity_${severity}`] = this.getErrorsBySeverity(severity).length;
    });
    stats.total = this.errorLog.length;
    return stats;
  }
}
// Convenience functions for common error scenarios
export const errorHandler = ErrorHandler.getInstance();
export const handleAuthError = (error, context) => {
  return errorHandler.handleError(error, {
    category: ErrorCategory.AUTHENTICATION,
    severity: ErrorSeverity.HIGH,
    context
  });
};
export const handleNetworkError = (error, context) => {
  return errorHandler.handleError(error, {
    category: ErrorCategory.NETWORK,
    severity: ErrorSeverity.MEDIUM,
    context
  });
};
export const handleValidationError = (error, context) => {
  return errorHandler.handleError(error, {
    category: ErrorCategory.VALIDATION,
    severity: ErrorSeverity.LOW,
    context
  });
};
export const handleSystemError = (error, context) => {
  return errorHandler.handleError(error, {
    category: ErrorCategory.SYSTEM,
    severity: ErrorSeverity.CRITICAL,
    context
  });
};
export const handleUserInputError = (error, context) => {
  return errorHandler.handleError(error, {
    category: ErrorCategory.USER_INPUT,
    severity: ErrorSeverity.LOW,
    context
  });
};
