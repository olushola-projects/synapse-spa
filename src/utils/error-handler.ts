/**
 * Centralized Error Handling Utility
 * Provides consistent error handling, logging, and user feedback across the application
 */

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum ErrorCategory {
  AUTHENTICATION = 'authentication',
  NETWORK = 'network',
  VALIDATION = 'validation',
  PERMISSION = 'permission',
  SYSTEM = 'system',
  USER_INPUT = 'user_input'
}

export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  component?: string;
  action?: string;
  metadata?: Record<string, unknown>;
}

export interface AppError {
  id: string;
  message: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  timestamp: Date;
  context?: ErrorContext;
  originalError?: Error;
  stack?: string;
}

export class CustomError extends Error {
  public readonly id: string;
  public readonly category: ErrorCategory;
  public readonly severity: ErrorSeverity;
  public readonly context?: ErrorContext;
  public readonly timestamp: Date;

  constructor(
    message: string,
    category: ErrorCategory,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    context?: ErrorContext,
    originalError?: Error
  ) {
    super(message);
    this.name = 'CustomError';
    this.id = this.generateErrorId();
    this.category = category;
    this.severity = severity;
    this.context = context;
    this.timestamp = new Date();
    
    if (originalError) {
      this.stack = originalError.stack;
      this.cause = originalError;
    }
  }

  private generateErrorId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  toJSON(): AppError {
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

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLog: AppError[] = [];
  private maxLogSize = 1000;

  private constructor() {}

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Handle and log an error
   */
  public handleError(
    error: Error | CustomError | string,
    category: ErrorCategory = ErrorCategory.SYSTEM,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    context?: ErrorContext
  ): AppError {
    let appError: AppError;

    if (error instanceof CustomError) {
      appError = error.toJSON();
    } else if (error instanceof Error) {
      const customError = new CustomError(
        error.message,
        category,
        severity,
        context,
        error
      );
      appError = customError.toJSON();
    } else {
      const customError = new CustomError(
        error,
        category,
        severity,
        context
      );
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
  private logError(error: AppError): void {
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
        console.error(logMessage, logData);
        break;
      case ErrorSeverity.MEDIUM:
        console.warn(logMessage, logData);
        break;
      case ErrorSeverity.LOW:
        console.info(logMessage, logData);
        break;
    }
  }

  /**
   * Add error to in-memory log with size management
   */
  private addToErrorLog(error: AppError): void {
    this.errorLog.push(error);
    
    // Maintain log size limit
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(-this.maxLogSize);
    }
  }

  /**
   * Report critical errors to external monitoring service
   */
  private reportCriticalError(error: AppError): void {
    // TODO: Implement external error reporting (e.g., Sentry, LogRocket)
    console.error('CRITICAL ERROR REPORTED:', error);
  }

  /**
   * Get recent errors for debugging
   */
  public getRecentErrors(limit = 50): AppError[] {
    return this.errorLog.slice(-limit);
  }

  /**
   * Get errors by category
   */
  public getErrorsByCategory(category: ErrorCategory): AppError[] {
    return this.errorLog.filter(error => error.category === category);
  }

  /**
   * Get errors by severity
   */
  public getErrorsBySeverity(severity: ErrorSeverity): AppError[] {
    return this.errorLog.filter(error => error.severity === severity);
  }

  /**
   * Clear error log
   */
  public clearErrorLog(): void {
    this.errorLog = [];
  }

  /**
   * Get error statistics
   */
  public getErrorStats(): Record<string, number> {
    const stats: Record<string, number> = {};
    
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

export const handleAuthError = (error: Error | string, context?: ErrorContext): AppError => {
  return errorHandler.handleError(error, ErrorCategory.AUTHENTICATION, ErrorSeverity.HIGH, context);
};

export const handleNetworkError = (error: Error | string, context?: ErrorContext): AppError => {
  return errorHandler.handleError(error, ErrorCategory.NETWORK, ErrorSeverity.MEDIUM, context);
};

export const handleValidationError = (error: Error | string, context?: ErrorContext): AppError => {
  return errorHandler.handleError(error, ErrorCategory.VALIDATION, ErrorSeverity.LOW, context);
};

export const handleSystemError = (error: Error | string, context?: ErrorContext): AppError => {
  return errorHandler.handleError(error, ErrorCategory.SYSTEM, ErrorSeverity.CRITICAL, context);
};

export const handleUserInputError = (error: Error | string, context?: ErrorContext): AppError => {
  return errorHandler.handleError(error, ErrorCategory.USER_INPUT, ErrorSeverity.LOW, context);
};