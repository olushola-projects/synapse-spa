import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  ErrorHandler,
  CustomError,
  ErrorCategory,
  ErrorSeverity,
  handleAuthError,
  handleNetworkError,
  handleValidationError,
  handleSystemError,
  handleUserInputError
} from '../error-handler';

// Mock console methods
const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {
  // Mock implementation for console.error
});
const mockConsoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {
  // Mock implementation for console.warn
});
const mockConsoleInfo = vi.spyOn(console, 'info').mockImplementation(() => {
  // Mock implementation for console.info
});

describe('ErrorHandler', () => {
  let errorHandler: ErrorHandler;

  beforeEach(() => {
    errorHandler = ErrorHandler.getInstance();
    errorHandler.clearErrorLog();
    vi.clearAllMocks();
  });

  describe('CustomError', () => {
    it('should create a custom error with all properties', () => {
      const error = new CustomError('Test error', {
        category: ErrorCategory.AUTHENTICATION,
        severity: ErrorSeverity.HIGH,
        context: { userId: '123' }
      });

      expect(error.message).toBe('Test error');
      expect(error.category).toBe(ErrorCategory.AUTHENTICATION);
      expect(error.severity).toBe(ErrorSeverity.HIGH);
      expect(error.context?.userId).toBe('123');
      expect(error.id).toBeDefined();
      expect(error.timestamp).toBeInstanceOf(Date);
    });

    it('should generate unique error IDs', () => {
      const error1 = new CustomError('Error 1', { category: ErrorCategory.SYSTEM });
      const error2 = new CustomError('Error 2', { category: ErrorCategory.SYSTEM });

      expect(error1.id).not.toBe(error2.id);
    });

    it('should serialize to JSON correctly', () => {
      const error = new CustomError('Test error', {
        category: ErrorCategory.VALIDATION,
        severity: ErrorSeverity.LOW
      });

      const json = error.toJSON();

      expect(json.id).toBe(error.id);
      expect(json.message).toBe('Test error');
      expect(json.category).toBe(ErrorCategory.VALIDATION);
      expect(json.severity).toBe(ErrorSeverity.LOW);
      expect(json.timestamp).toBeInstanceOf(Date);
    });
  });

  describe('ErrorHandler.handleError', () => {
    it('should handle Error objects', () => {
      const originalError = new Error('Original error');
      const result = errorHandler.handleError(originalError, {
        category: ErrorCategory.NETWORK,
        severity: ErrorSeverity.MEDIUM
      });

      expect(result.message).toBe('Original error');
      expect(result.category).toBe(ErrorCategory.NETWORK);
      expect(result.severity).toBe(ErrorSeverity.MEDIUM);
    });

    it('should handle string errors', () => {
      const result = errorHandler.handleError('String error', {
        category: ErrorCategory.USER_INPUT,
        severity: ErrorSeverity.LOW
      });

      expect(result.message).toBe('String error');
      expect(result.category).toBe(ErrorCategory.USER_INPUT);
      expect(result.severity).toBe(ErrorSeverity.LOW);
    });

    it('should handle CustomError objects', () => {
      const customError = new CustomError('Custom error', {
        category: ErrorCategory.AUTHENTICATION,
        severity: ErrorSeverity.HIGH
      });

      const result = errorHandler.handleError(customError);

      expect(result.message).toBe('Custom error');
      expect(result.category).toBe(ErrorCategory.AUTHENTICATION);
      expect(result.severity).toBe(ErrorSeverity.HIGH);
    });

    it('should log errors with appropriate console methods', () => {
      errorHandler.handleError('Critical error', {
        category: ErrorCategory.SYSTEM,
        severity: ErrorSeverity.CRITICAL
      });
      expect(mockConsoleError).toHaveBeenCalled();

      errorHandler.handleError('High error', {
        category: ErrorCategory.SYSTEM,
        severity: ErrorSeverity.HIGH
      });
      expect(mockConsoleError).toHaveBeenCalled();

      errorHandler.handleError('Medium error', {
        category: ErrorCategory.SYSTEM,
        severity: ErrorSeverity.MEDIUM
      });
      expect(mockConsoleWarn).toHaveBeenCalled();

      errorHandler.handleError('Low error', {
        category: ErrorCategory.SYSTEM,
        severity: ErrorSeverity.LOW
      });
      expect(mockConsoleInfo).toHaveBeenCalled();
    });

    it('should store errors in memory log', () => {
      errorHandler.handleError('Test error 1', { category: ErrorCategory.SYSTEM });
      errorHandler.handleError('Test error 2', { category: ErrorCategory.NETWORK });

      const recentErrors = errorHandler.getRecentErrors();
      expect(recentErrors).toHaveLength(2);
      expect(recentErrors[0]?.message).toBe('Test error 1');
      expect(recentErrors[1]?.message).toBe('Test error 2');
    });
  });

  describe('Error log management', () => {
    it('should limit log size', () => {
      // Create more errors than the max log size (1000)
      for (let i = 0; i < 1005; i++) {
        errorHandler.handleError(`Error ${i}`, { category: ErrorCategory.SYSTEM });
      }

      const recentErrors = errorHandler.getRecentErrors(1005);
      expect(recentErrors.length).toBeLessThanOrEqual(1000);
    });

    it('should clear error log', () => {
      errorHandler.handleError('Test error', { category: ErrorCategory.SYSTEM });
      expect(errorHandler.getRecentErrors()).toHaveLength(1);

      errorHandler.clearErrorLog();
      expect(errorHandler.getRecentErrors()).toHaveLength(0);
    });

    it('should filter errors by category', () => {
      errorHandler.handleError('Auth error', { category: ErrorCategory.AUTHENTICATION });
      errorHandler.handleError('Network error', { category: ErrorCategory.NETWORK });
      errorHandler.handleError('Another auth error', { category: ErrorCategory.AUTHENTICATION });

      const authErrors = errorHandler.getErrorsByCategory(ErrorCategory.AUTHENTICATION);
      const networkErrors = errorHandler.getErrorsByCategory(ErrorCategory.NETWORK);

      expect(authErrors).toHaveLength(2);
      expect(networkErrors).toHaveLength(1);
      expect(authErrors[0]?.message).toBe('Auth error');
      expect(networkErrors[0]?.message).toBe('Network error');
    });

    it('should filter errors by severity', () => {
      errorHandler.handleError('Critical error', {
        category: ErrorCategory.SYSTEM,
        severity: ErrorSeverity.CRITICAL
      });
      errorHandler.handleError('High error', {
        category: ErrorCategory.SYSTEM,
        severity: ErrorSeverity.HIGH
      });
      errorHandler.handleError('Another critical error', {
        category: ErrorCategory.SYSTEM,
        severity: ErrorSeverity.CRITICAL
      });

      const criticalErrors = errorHandler.getErrorsBySeverity(ErrorSeverity.CRITICAL);
      const highErrors = errorHandler.getErrorsBySeverity(ErrorSeverity.HIGH);

      expect(criticalErrors).toHaveLength(2);
      expect(highErrors).toHaveLength(1);
    });

    it('should generate error statistics', () => {
      errorHandler.handleError('Auth error', {
        category: ErrorCategory.AUTHENTICATION,
        severity: ErrorSeverity.HIGH
      });
      errorHandler.handleError('Network error', {
        category: ErrorCategory.NETWORK,
        severity: ErrorSeverity.MEDIUM
      });
      errorHandler.handleError('System error', {
        category: ErrorCategory.SYSTEM,
        severity: ErrorSeverity.CRITICAL
      });

      const stats = errorHandler.getErrorStats();

      expect(stats.total).toBe(3);
      expect(stats.category_authentication).toBe(1);
      expect(stats.category_network).toBe(1);
      expect(stats.category_system).toBe(1);
      expect(stats.severity_high).toBe(1);
      expect(stats.severity_medium).toBe(1);
      expect(stats.severity_critical).toBe(1);
    });
  });

  describe('Convenience functions', () => {
    it('should handle auth errors correctly', () => {
      const result = handleAuthError('Login failed', { userId: '123' });

      expect(result.category).toBe(ErrorCategory.AUTHENTICATION);
      expect(result.severity).toBe(ErrorSeverity.HIGH);
      expect(result.message).toBe('Login failed');
      expect(result.context?.userId).toBe('123');
    });

    it('should handle network errors correctly', () => {
      const result = handleNetworkError('Connection timeout');

      expect(result.category).toBe(ErrorCategory.NETWORK);
      expect(result.severity).toBe(ErrorSeverity.MEDIUM);
      expect(result.message).toBe('Connection timeout');
    });

    it('should handle validation errors correctly', () => {
      const result = handleValidationError('Invalid email format');

      expect(result.category).toBe(ErrorCategory.VALIDATION);
      expect(result.severity).toBe(ErrorSeverity.LOW);
      expect(result.message).toBe('Invalid email format');
    });

    it('should handle system errors correctly', () => {
      const result = handleSystemError('Database connection failed');

      expect(result.category).toBe(ErrorCategory.SYSTEM);
      expect(result.severity).toBe(ErrorSeverity.CRITICAL);
      expect(result.message).toBe('Database connection failed');
    });

    it('should handle user input errors correctly', () => {
      const result = handleUserInputError('Required field missing');

      expect(result.category).toBe(ErrorCategory.USER_INPUT);
      expect(result.severity).toBe(ErrorSeverity.LOW);
      expect(result.message).toBe('Required field missing');
    });
  });

  describe('Singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = ErrorHandler.getInstance();
      const instance2 = ErrorHandler.getInstance();

      expect(instance1).toBe(instance2);
    });

    it('should maintain state across instances', () => {
      const instance1 = ErrorHandler.getInstance();
      instance1.handleError('Test error', { category: ErrorCategory.SYSTEM });

      const instance2 = ErrorHandler.getInstance();
      const errors = instance2.getRecentErrors();

      expect(errors).toHaveLength(1);
      expect(errors[0]?.message).toBe('Test error');
    });
  });
});
