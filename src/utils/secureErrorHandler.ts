/**
 * Secure Error Handler
 * Implements secure error handling for Zero-Trust architecture
 * 
 * Prevents information disclosure while maintaining audit trail
 */

import { logger } from './logger';

export interface SecureError {
  message: string;
  code: string;
  timestamp: string;
  requestId?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  endpoint?: string;
  method?: string;
  requestId?: string;
}

/**
 * Error codes for different types of errors
 */
export const ERROR_CODES = {
  // Authentication errors
  AUTH_INVALID_CREDENTIALS: 'AUTH_001',
  AUTH_TOKEN_EXPIRED: 'AUTH_002',
  AUTH_INSUFFICIENT_PERMISSIONS: 'AUTH_003',
  AUTH_MFA_REQUIRED: 'AUTH_004',
  AUTH_SESSION_INVALID: 'AUTH_005',
  
  // Authorization errors
  AUTHZ_ACCESS_DENIED: 'AUTHZ_001',
  AUTHZ_RESOURCE_NOT_FOUND: 'AUTHZ_002',
  AUTHZ_INVALID_ROLE: 'AUTHZ_003',
  
  // Validation errors
  VALIDATION_INPUT_INVALID: 'VAL_001',
  VALIDATION_MISSING_REQUIRED: 'VAL_002',
  VALIDATION_FORMAT_INVALID: 'VAL_003',
  
  // API errors
  API_RATE_LIMIT_EXCEEDED: 'API_001',
  API_ENDPOINT_NOT_FOUND: 'API_002',
  API_METHOD_NOT_ALLOWED: 'API_003',
  API_INVALID_REQUEST: 'API_004',
  
  // Database errors
  DB_CONNECTION_FAILED: 'DB_001',
  DB_QUERY_FAILED: 'DB_002',
  DB_TRANSACTION_FAILED: 'DB_003',
  
  // External service errors
  EXTERNAL_SERVICE_UNAVAILABLE: 'EXT_001',
  EXTERNAL_SERVICE_TIMEOUT: 'EXT_002',
  EXTERNAL_SERVICE_ERROR: 'EXT_003',
  
  // Security errors
  SECURITY_INVALID_TOKEN: 'SEC_001',
  SECURITY_CSRF_VIOLATION: 'SEC_002',
  SECURITY_RATE_LIMIT: 'SEC_003',
  SECURITY_SUSPICIOUS_ACTIVITY: 'SEC_004',
  
  // Internal errors
  INTERNAL_SERVER_ERROR: 'INT_001',
  INTERNAL_CONFIGURATION_ERROR: 'INT_002',
  INTERNAL_DEPENDENCY_ERROR: 'INT_003'
} as const;

/**
 * Error severity levels
 */
export const ERROR_SEVERITY = {
  low: 'low',
  medium: 'medium', 
  high: 'high',
  critical: 'critical'
} as const;

/**
 * Secure error handler class
 */
export class SecureErrorHandler {
  private static instance: SecureErrorHandler;
  
  private constructor() {}
  
  static getInstance(): SecureErrorHandler {
    if (!SecureErrorHandler.instance) {
      SecureErrorHandler.instance = new SecureErrorHandler();
    }
    return SecureErrorHandler.instance;
  }
  
  /**
   * Handle and sanitize errors for user response
   */
  handleError(
    error: Error | string,
    context: ErrorContext = {},
    severity: keyof typeof ERROR_SEVERITY = 'medium'
  ): SecureError {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const errorName = typeof error === 'string' ? 'UnknownError' : error.name;
    
    // Generate secure error response
    const secureError: SecureError = {
      message: this.getSecureMessage(errorName, severity),
      code: this.getErrorCode(errorName, errorMessage),
      timestamp: new Date().toISOString(),
      requestId: context.requestId,
      severity
    };
    
    // Log detailed error for monitoring (but don't expose to user)
    this.logError(error, context, severity);
    
    return secureError;
  }
  
  /**
   * Get secure error message that doesn't expose sensitive information
   */
  private getSecureMessage(errorName: string, severity: keyof typeof ERROR_SEVERITY): string {
    const messages = {
      low: 'A minor issue occurred. Please try again.',
      medium: 'An error occurred. Please try again or contact support.',
      high: 'A system error occurred. Please contact support.',
      critical: 'A critical error occurred. Please contact support immediately.'
    };
    
    // Map specific error types to appropriate messages
    if (errorName.includes('Auth') || errorName.includes('Token')) {
      return 'Authentication error. Please log in again.';
    }
    
    if (errorName.includes('Validation') || errorName.includes('Input')) {
      return 'Invalid input provided. Please check your data and try again.';
    }
    
    if (errorName.includes('RateLimit') || errorName.includes('Throttle')) {
      return 'Too many requests. Please wait a moment and try again.';
    }
    
    if (errorName.includes('Permission') || errorName.includes('Access')) {
      return 'Access denied. You do not have permission to perform this action.';
    }
    
    return messages[severity];
  }
  
  /**
   * Get appropriate error code based on error type
   */
  private getErrorCode(errorName: string, errorMessage: string): string {
    // Map error names to error codes
    const errorCodeMap: Record<string, string> = {
      'AuthenticationError': ERROR_CODES.AUTH_INVALID_CREDENTIALS,
      'TokenExpiredError': ERROR_CODES.AUTH_TOKEN_EXPIRED,
      'PermissionError': ERROR_CODES.AUTH_INSUFFICIENT_PERMISSIONS,
      'MFARequiredError': ERROR_CODES.AUTH_MFA_REQUIRED,
      'SessionError': ERROR_CODES.AUTH_SESSION_INVALID,
      'ValidationError': ERROR_CODES.VALIDATION_INPUT_INVALID,
      'RateLimitError': ERROR_CODES.API_RATE_LIMIT_EXCEEDED,
      'NotFoundError': ERROR_CODES.AUTHZ_RESOURCE_NOT_FOUND,
      'DatabaseError': ERROR_CODES.DB_QUERY_FAILED,
      'ExternalServiceError': ERROR_CODES.EXTERNAL_SERVICE_ERROR,
      'SecurityError': ERROR_CODES.SECURITY_INVALID_TOKEN
    };
    
    // Check for specific error patterns
    if (errorMessage.toLowerCase().includes('rate limit')) {
      return ERROR_CODES.API_RATE_LIMIT_EXCEEDED;
    }
    
    if (errorMessage.toLowerCase().includes('permission') || errorMessage.toLowerCase().includes('access')) {
      return ERROR_CODES.AUTHZ_ACCESS_DENIED;
    }
    
    if (errorMessage.toLowerCase().includes('validation') || errorMessage.toLowerCase().includes('invalid')) {
      return ERROR_CODES.VALIDATION_INPUT_INVALID;
    }
    
    if (errorMessage.toLowerCase().includes('not found')) {
      return ERROR_CODES.AUTHZ_RESOURCE_NOT_FOUND;
    }
    
    // Return mapped error code or default
    return errorCodeMap[errorName] || ERROR_CODES.INTERNAL_SERVER_ERROR;
  }
  
  /**
   * Log error details for monitoring and debugging
   */
  private logError(
    error: Error | string,
    context: ErrorContext,
    severity: keyof typeof ERROR_SEVERITY
  ): void {
    const errorDetails = {
      message: typeof error === 'string' ? error : error.message,
      name: typeof error === 'string' ? 'UnknownError' : error.name,
      stack: typeof error === 'string' ? undefined : error.stack,
      context,
      severity,
      timestamp: new Date().toISOString()
    };
    
    // Log based on severity
    switch (severity) {
      case 'critical':
        logger.error('Critical error occurred', errorDetails);
        break;
      case 'high':
        logger.error('High severity error occurred', errorDetails);
        break;
      case 'medium':
        logger.warn('Medium severity error occurred', errorDetails);
        break;
      case 'low':
        logger.info('Low severity error occurred', errorDetails);
        break;
    }
    
    // Send to monitoring service for critical and high severity errors
    if (severity === 'critical' || severity === 'high') {
      this.sendToMonitoring(errorDetails);
    }
  }
  
  /**
   * Send error to monitoring service
   */
  private sendToMonitoring(errorDetails: any): void {
    // Implementation for sending to monitoring service
    // This could be Sentry, DataDog, or custom monitoring
    try {
      // Example: Send to external monitoring service
      // monitoringService.captureException(errorDetails);
      console.log('Error sent to monitoring service:', errorDetails);
    } catch (monitoringError) {
      logger.error('Failed to send error to monitoring service', { monitoringError });
    }
  }
  
  /**
   * Handle async errors
   */
  async handleAsyncError<T>(
    promise: Promise<T>,
    context: ErrorContext = {},
    severity: keyof typeof ERROR_SEVERITY = 'medium'
  ): Promise<T | SecureError> {
    try {
      return await promise;
    } catch (error) {
      return this.handleError(error as Error, context, severity);
    }
  }
  
  /**
   * Create error handler middleware for Express
   */
  createErrorMiddleware() {
    return (error: Error, req: any, res: any, next: any) => {
      const context: ErrorContext = {
        userId: req.user?.id,
        sessionId: req.session?.id,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        endpoint: req.path,
        method: req.method,
        requestId: req.headers['x-request-id']
      };
      
      const secureError = this.handleError(error, context, 'high');
      
      res.status(this.getHttpStatus(secureError.code)).json({
        error: secureError
      });
    };
  }
  
  /**
   * Get HTTP status code for error code
   */
  private getHttpStatus(errorCode: string): number {
    const statusMap: Record<string, number> = {
      [ERROR_CODES.AUTH_INVALID_CREDENTIALS]: 401,
      [ERROR_CODES.AUTH_TOKEN_EXPIRED]: 401,
      [ERROR_CODES.AUTH_INSUFFICIENT_PERMISSIONS]: 403,
      [ERROR_CODES.AUTH_MFA_REQUIRED]: 403,
      [ERROR_CODES.AUTH_SESSION_INVALID]: 401,
      [ERROR_CODES.AUTHZ_ACCESS_DENIED]: 403,
      [ERROR_CODES.AUTHZ_RESOURCE_NOT_FOUND]: 404,
      [ERROR_CODES.AUTHZ_INVALID_ROLE]: 403,
      [ERROR_CODES.VALIDATION_INPUT_INVALID]: 400,
      [ERROR_CODES.VALIDATION_MISSING_REQUIRED]: 400,
      [ERROR_CODES.VALIDATION_FORMAT_INVALID]: 400,
      [ERROR_CODES.API_RATE_LIMIT_EXCEEDED]: 429,
      [ERROR_CODES.API_ENDPOINT_NOT_FOUND]: 404,
      [ERROR_CODES.API_METHOD_NOT_ALLOWED]: 405,
      [ERROR_CODES.API_INVALID_REQUEST]: 400,
      [ERROR_CODES.DB_CONNECTION_FAILED]: 503,
      [ERROR_CODES.DB_QUERY_FAILED]: 500,
      [ERROR_CODES.DB_TRANSACTION_FAILED]: 500,
      [ERROR_CODES.EXTERNAL_SERVICE_UNAVAILABLE]: 503,
      [ERROR_CODES.EXTERNAL_SERVICE_TIMEOUT]: 504,
      [ERROR_CODES.EXTERNAL_SERVICE_ERROR]: 502,
      [ERROR_CODES.SECURITY_INVALID_TOKEN]: 401,
      [ERROR_CODES.SECURITY_CSRF_VIOLATION]: 403,
      [ERROR_CODES.SECURITY_RATE_LIMIT]: 429,
      [ERROR_CODES.SECURITY_SUSPICIOUS_ACTIVITY]: 403,
      [ERROR_CODES.INTERNAL_SERVER_ERROR]: 500,
      [ERROR_CODES.INTERNAL_CONFIGURATION_ERROR]: 500,
      [ERROR_CODES.INTERNAL_DEPENDENCY_ERROR]: 500
    };
    
    return statusMap[errorCode] || 500;
  }
}

// Export singleton instance
export const secureErrorHandler = SecureErrorHandler.getInstance();

// Export convenience functions
export const handleError = (error: Error | string, context?: ErrorContext, severity?: keyof typeof ERROR_SEVERITY) => 
  secureErrorHandler.handleError(error, context, severity);

export const handleAsyncError = <T>(promise: Promise<T>, context?: ErrorContext, severity?: keyof typeof ERROR_SEVERITY) =>
  secureErrorHandler.handleAsyncError(promise, context, severity);

export default secureErrorHandler;
