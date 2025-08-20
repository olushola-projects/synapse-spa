/**
 * Authentication Middleware Service
 * Provides comprehensive security controls for API authentication
 * Implements rate limiting, audit logging, and circuit breaker patterns
 */
import { supabase } from '@/integrations/supabase/client';
export class AuthMiddleware {
  static instance;
  rateLimitStore = new Map();
  auditLogs = [];
  circuitBreakerFailures = 0;
  circuitBreakerLastFailure = 0;
  circuitBreakerThreshold = 5;
  circuitBreakerTimeout = 60000; // 1 minute
  defaultRateLimit = {
    maxRequests: 100,
    windowMs: 60000, // 1 minute
    blockDurationMs: 300000 // 5 minutes
  };
  constructor() {}
  static getInstance() {
    if (!AuthMiddleware.instance) {
      AuthMiddleware.instance = new AuthMiddleware();
    }
    return AuthMiddleware.instance;
  }
  /**
   * Validate authentication for API requests
   */
  async validateRequest(request) {
    const startTime = Date.now();
    try {
      // Check circuit breaker
      if (this.isCircuitBreakerOpen()) {
        return {
          success: false,
          error: 'Service temporarily unavailable due to high error rate',
          auditLog: this.createAuditLog(request, false, 'Circuit breaker open', startTime)
        };
      }
      // Check rate limiting
      const rateLimitResult = this.checkRateLimit(request.userId);
      if (rateLimitResult.rateLimited) {
        return {
          success: false,
          rateLimited: true,
          error: 'Rate limit exceeded',
          auditLog: this.createAuditLog(request, false, 'Rate limit exceeded', startTime)
        };
      }
      // Validate session
      const {
        data: { session },
        error
      } = await supabase.auth.getSession();
      if (error || !session) {
        this.recordFailure();
        return {
          success: false,
          error: 'Invalid or expired session',
          auditLog: this.createAuditLog(request, false, 'Invalid session', startTime)
        };
      }
      // Validate user ID matches session
      if (session.user.id !== request.userId) {
        this.recordFailure();
        return {
          success: false,
          error: 'User ID mismatch',
          auditLog: this.createAuditLog(request, false, 'User ID mismatch', startTime)
        };
      }
      // Check session expiry
      if (session.expires_at && session.expires_at * 1000 < Date.now()) {
        this.recordFailure();
        return {
          success: false,
          error: 'Session expired',
          auditLog: this.createAuditLog(request, false, 'Session expired', startTime)
        };
      }
      // Success - record success and return
      this.recordSuccess();
      return {
        success: true,
        userId: session.user.id,
        session,
        auditLog: this.createAuditLog(request, true, undefined, startTime)
      };
    } catch (error) {
      this.recordFailure();
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Authentication validation failed',
        auditLog: this.createAuditLog(
          request,
          false,
          error instanceof Error ? error.message : 'Unknown error',
          startTime
        )
      };
    }
  }
  /**
   * Check rate limiting for a user
   */
  checkRateLimit(userId) {
    const now = Date.now();
    const key = `rate_limit:${userId}`;
    const userLimit = this.rateLimitStore.get(key);
    if (!userLimit) {
      this.rateLimitStore.set(key, {
        count: 1,
        resetTime: now + this.defaultRateLimit.windowMs
      });
      return { rateLimited: false, remainingRequests: this.defaultRateLimit.maxRequests - 1 };
    }
    // Check if user is blocked
    if (userLimit.blockedUntil && now < userLimit.blockedUntil) {
      return { rateLimited: true };
    }
    // Check if window has reset
    if (now > userLimit.resetTime) {
      this.rateLimitStore.set(key, {
        count: 1,
        resetTime: now + this.defaultRateLimit.windowMs
      });
      return { rateLimited: false, remainingRequests: this.defaultRateLimit.maxRequests - 1 };
    }
    // Increment count
    userLimit.count++;
    this.rateLimitStore.set(key, userLimit);
    // Check if limit exceeded
    if (userLimit.count > this.defaultRateLimit.maxRequests) {
      userLimit.blockedUntil = now + this.defaultRateLimit.blockDurationMs;
      this.rateLimitStore.set(key, userLimit);
      return { rateLimited: true };
    }
    return {
      rateLimited: false,
      remainingRequests: this.defaultRateLimit.maxRequests - userLimit.count
    };
  }
  /**
   * Circuit breaker pattern implementation
   */
  isCircuitBreakerOpen() {
    if (this.circuitBreakerFailures < this.circuitBreakerThreshold) {
      return false;
    }
    const timeSinceLastFailure = Date.now() - this.circuitBreakerLastFailure;
    return timeSinceLastFailure < this.circuitBreakerTimeout;
  }
  recordSuccess() {
    this.circuitBreakerFailures = 0;
  }
  recordFailure() {
    this.circuitBreakerFailures++;
    this.circuitBreakerLastFailure = Date.now();
  }
  /**
   * Create audit log entry
   */
  createAuditLog(request, success, error, startTime) {
    const auditLog = {
      timestamp: new Date().toISOString(),
      userId: request.userId,
      endpoint: request.endpoint,
      method: request.method,
      ip: request.ip,
      userAgent: request.userAgent,
      success,
      error,
      responseTime: Date.now() - startTime
    };
    this.auditLogs.push(auditLog);
    // Keep only last 1000 audit logs
    if (this.auditLogs.length > 1000) {
      this.auditLogs = this.auditLogs.slice(-1000);
    }
    return auditLog;
  }
  /**
   * Get audit logs for monitoring
   */
  getAuditLogs(limit = 100) {
    return this.auditLogs.slice(-limit);
  }
  /**
   * Get rate limit status for a user
   */
  getRateLimitStatus(userId) {
    const key = `rate_limit:${userId}`;
    const userLimit = this.rateLimitStore.get(key);
    if (!userLimit) {
      return {
        currentCount: 0,
        maxRequests: this.defaultRateLimit.maxRequests,
        resetTime: new Date(Date.now() + this.defaultRateLimit.windowMs),
        isBlocked: false
      };
    }
    return {
      currentCount: userLimit.count,
      maxRequests: this.defaultRateLimit.maxRequests,
      resetTime: new Date(userLimit.resetTime),
      blockedUntil: userLimit.blockedUntil ? new Date(userLimit.blockedUntil) : undefined,
      isBlocked: userLimit.blockedUntil ? Date.now() < userLimit.blockedUntil : false
    };
  }
  /**
   * Get circuit breaker status
   */
  getCircuitBreakerStatus() {
    return {
      isOpen: this.isCircuitBreakerOpen(),
      failures: this.circuitBreakerFailures,
      threshold: this.circuitBreakerThreshold,
      lastFailure: new Date(this.circuitBreakerLastFailure),
      timeout: this.circuitBreakerTimeout
    };
  }
  /**
   * Reset rate limits for a user (admin function)
   */
  resetRateLimit(userId) {
    const key = `rate_limit:${userId}`;
    this.rateLimitStore.delete(key);
  }
  /**
   * Reset circuit breaker (admin function)
   */
  resetCircuitBreaker() {
    this.circuitBreakerFailures = 0;
    this.circuitBreakerLastFailure = 0;
  }
  /**
   * Update rate limit configuration
   */
  updateRateLimitConfig(config) {
    this.defaultRateLimit.maxRequests = config.maxRequests ?? this.defaultRateLimit.maxRequests;
    this.defaultRateLimit.windowMs = config.windowMs ?? this.defaultRateLimit.windowMs;
    this.defaultRateLimit.blockDurationMs =
      config.blockDurationMs ?? this.defaultRateLimit.blockDurationMs;
  }
  /**
   * Get security metrics
   */
  getSecurityMetrics() {
    const totalRequests = this.auditLogs.length;
    const successfulRequests = this.auditLogs.filter(log => log.success).length;
    const failedRequests = this.auditLogs.filter(log => !log.success).length;
    const rateLimitedRequests = this.auditLogs.filter(
      log => log.error === 'Rate limit exceeded'
    ).length;
    const averageResponseTime =
      this.auditLogs.length > 0
        ? this.auditLogs.reduce((sum, log) => sum + log.responseTime, 0) / this.auditLogs.length
        : 0;
    return {
      totalRequests,
      successfulRequests,
      failedRequests,
      rateLimitedRequests,
      circuitBreakerStatus: this.isCircuitBreakerOpen() ? 'OPEN' : 'CLOSED',
      averageResponseTime
    };
  }
}
// Export singleton instance
export const authMiddleware = AuthMiddleware.getInstance();
/**
 * Decorator for API functions to automatically apply authentication
 */
export function requireAuth() {
  return function (_target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args) {
      const request = {
        userId: args[0]?.userId || 'unknown',
        endpoint: propertyKey,
        method: 'POST',
        timestamp: new Date(),
        ip: args[0]?.ip,
        userAgent: args[0]?.userAgent
      };
      const authResult = await authMiddleware.validateRequest(request);
      if (!authResult.success) {
        throw new Error(authResult.error || 'Authentication failed');
      }
      return originalMethod.apply(this, args);
    };
    return descriptor;
  };
}
