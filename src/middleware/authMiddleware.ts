/**
 * Authentication Middleware
 * Priority 1: Debug Authentication - JWT-based session management
 * Integrates with security monitoring and session management
 */

import { NextFunction, Request, Response } from 'express';
import { backendConfig } from '../config/environment.backend';
import { authService } from '../services/authService';
import { securityMonitoringService } from '../services/securityMonitoringService';
import { log } from '../utils/logger';

export interface AuthenticatedRequest extends Omit<Request, 'session'> {
  user?: any;
  session?: any;
  ipAddress: string;
  userAgent: string;
  correlationId: string;
}

/**
 * Extract client IP address from request
 */
function getClientIP(req: Request): string {
  // Check for forwarded headers (proxy/load balancer)
  const forwardedFor = req.headers['x-forwarded-for'];
  if (forwardedFor) {
    const ips = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor;
    if (ips) {
      const firstIp = ips.split(',')[0].trim();
      return firstIp || 'unknown';
    }
  }

  // Check for real IP header
  const realIP = req.headers['x-real-ip'];
  if (realIP) {
    const ipValue = Array.isArray(realIP) ? realIP[0] : realIP;
    return ipValue || 'unknown';
  }

  // Fallback to connection remote address
  return req.connection?.remoteAddress || req.socket?.remoteAddress || 'unknown';
}

/**
 * Extract user agent from request
 */
function getUserAgent(req: Request): string {
  return req.headers['user-agent'] || 'unknown';
}

/**
 * Generate correlation ID for request tracking
 */
function generateCorrelationId(): string {
  return crypto.randomUUID();
}

/**
 * Log security event for authentication attempts
 */
async function logAuthEvent(
  req: AuthenticatedRequest,
  eventType: string,
  success: boolean,
  details: Record<string, any> = {}
): Promise<void> {
  try {
    await securityMonitoringService.logSecurityEvent({
      type: 'authentication',
      severity: success ? 'low' : 'high',
      source: 'auth_middleware',
      userId: req.user?.id,
      ipAddress: req.ipAddress,
      userAgent: req.userAgent,
      details: {
        eventType,
        success,
        endpoint: req.path,
        method: req.method,
        correlationId: req.correlationId,
        ...details
      }
    });
  } catch (error) {
    log.error('Failed to log auth event', { error, req: req.path });
  }
}

/**
 * JWT Authentication Middleware
 * Validates JWT tokens and attaches user/session to request
 */
export async function authenticateJWT(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Cast to AuthenticatedRequest and assign required properties
    const authenticatedReq = req as AuthenticatedRequest;
    authenticatedReq.ipAddress = getClientIP(req);
    authenticatedReq.userAgent = getUserAgent(req);
    authenticatedReq.correlationId = generateCorrelationId();

    // Check if IP is blocked
    if (securityMonitoringService.isIPBlocked(authenticatedReq.ipAddress)) {
      await logAuthEvent(authenticatedReq, 'blocked_ip_access', false, { reason: 'IP blocked' });
      res.status(403).json({
        error: 'Access denied',
        code: 'IP_BLOCKED',
        correlationId: authenticatedReq.correlationId
      });
      return;
    }

    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      await logAuthEvent(authenticatedReq, 'missing_token', false, { reason: 'No authorization header' });
      res.status(401).json({
        error: 'Authentication required',
        code: 'MISSING_TOKEN',
        correlationId: authenticatedReq.correlationId
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Validate token
    const authResult = await authService.validateToken(token, authenticatedReq.ipAddress);

    if (!authResult.success) {
      await logAuthEvent(authenticatedReq, 'invalid_token', false, {
        reason: authResult.error,
        tokenLength: token.length
      });
      res.status(401).json({
        error: 'Invalid or expired token',
        code: 'INVALID_TOKEN',
        correlationId: authenticatedReq.correlationId
      });
      return;
    }

    // Attach user and session to request
    authenticatedReq.user = authResult.user;
    authenticatedReq.session = authResult.session;

    // Log successful authentication
    await logAuthEvent(authenticatedReq, 'token_validated', true, {
      userId: authenticatedReq.user?.id,
      sessionId: authenticatedReq.session?.id
    });

    next();
  } catch (error) {
    log.error('JWT authentication error', { error, path: req.path });

    const authenticatedReq = req as AuthenticatedRequest;
    if (authenticatedReq.ipAddress && authenticatedReq.correlationId) {
      await logAuthEvent(authenticatedReq, 'auth_error', false, {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    res.status(500).json({
      error: 'Authentication service error',
      code: 'AUTH_SERVICE_ERROR',
      correlationId: authenticatedReq.correlationId || 'unknown'
    });
  }
}

/**
 * Optional Authentication Middleware
 * Attempts to authenticate but doesn't fail if no token provided
 */
export async function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Cast to AuthenticatedRequest and assign required properties
    const authenticatedReq = req as AuthenticatedRequest;
    authenticatedReq.ipAddress = getClientIP(req);
    authenticatedReq.userAgent = getUserAgent(req);
    authenticatedReq.correlationId = generateCorrelationId();

    // Check if IP is blocked
    if (securityMonitoringService.isIPBlocked(authenticatedReq.ipAddress)) {
      await logAuthEvent(authenticatedReq, 'blocked_ip_access', false, { reason: 'IP blocked' });
      res.status(403).json({
        error: 'Access denied',
        code: 'IP_BLOCKED',
        correlationId: authenticatedReq.correlationId
      });
      return;
    }

    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token provided, continue without authentication
      next();
      return;
    }

    const token = authHeader.substring(7);

    // Validate token
    const authResult = await authService.validateToken(token, authenticatedReq.ipAddress);

    if (authResult.success) {
      authenticatedReq.user = authResult.user;
      authenticatedReq.session = authResult.session;
      await logAuthEvent(authenticatedReq, 'optional_auth_success', true, {
        userId: authenticatedReq.user?.id,
        sessionId: authenticatedReq.session?.id
      });
    } else {
      await logAuthEvent(authenticatedReq, 'optional_auth_failed', false, {
        reason: authResult.error
      });
    }

    next();
  } catch (error) {
    log.error('Optional authentication error', { error, path: req.path });
    next(); // Continue even on error
  }
}

/**
 * Role-based Authorization Middleware
 * Checks if user has required role
 */
export function requireRole(requiredRole: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const authenticatedReq = req as AuthenticatedRequest;
      
      if (!authenticatedReq.user) {
        res.status(401).json({
          error: 'Authentication required',
          code: 'AUTHENTICATION_REQUIRED',
          correlationId: authenticatedReq.correlationId || 'unknown'
        });
        return;
      }

      const userRole = authenticatedReq.user.role || 'user';

      if (userRole !== requiredRole && userRole !== 'admin' && userRole !== 'super_admin') {
        logAuthEvent(authenticatedReq, 'insufficient_role', false, {
          requiredRole,
          userRole,
          userId: authenticatedReq.user.id
        });

        res.status(403).json({
          error: 'Insufficient permissions',
          code: 'INSUFFICIENT_ROLE',
          correlationId: authenticatedReq.correlationId
        });
        return;
      }

      logAuthEvent(authenticatedReq, 'role_authorized', true, {
        requiredRole,
        userRole,
        userId: authenticatedReq.user.id
      });

      next();
    } catch (error) {
      log.error('Role authorization error', { error, path: req.path });
      res.status(500).json({
        error: 'Authorization service error',
        code: 'AUTHZ_SERVICE_ERROR',
        correlationId: (req as AuthenticatedRequest).correlationId || 'unknown'
      });
    }
  };
}

/**
 * Permission-based Authorization Middleware
 * Checks if user has required permission
 */
export function requirePermission(requiredPermission: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const authenticatedReq = req as AuthenticatedRequest;
      
      if (!authenticatedReq.user) {
        res.status(401).json({
          error: 'Authentication required',
          code: 'AUTHENTICATION_REQUIRED',
          correlationId: authenticatedReq.correlationId || 'unknown'
        });
        return;
      }

      const userPermissions = authenticatedReq.user.permissions || [];

      if (!userPermissions.includes(requiredPermission)) {
        logAuthEvent(authenticatedReq, 'insufficient_permission', false, {
          requiredPermission,
          userPermissions,
          userId: authenticatedReq.user.id
        });

        res.status(403).json({
          error: 'Insufficient permissions',
          code: 'INSUFFICIENT_PERMISSION',
          correlationId: authenticatedReq.correlationId
        });
        return;
      }

      logAuthEvent(authenticatedReq, 'permission_authorized', true, {
        requiredPermission,
        userId: authenticatedReq.user.id
      });

      next();
    } catch (error) {
      log.error('Permission authorization error', { error, path: req.path });
      res.status(500).json({
        error: 'Authorization service error',
        code: 'AUTHZ_SERVICE_ERROR',
        correlationId: (req as AuthenticatedRequest).correlationId || 'unknown'
      });
    }
  };
}

/**
 * Rate Limiting Middleware
 * Implements rate limiting based on user/IP
 */
export function rateLimit(
  windowMs: number = backendConfig.RATE_LIMIT_WINDOW_MS,
  maxRequests: number = backendConfig.RATE_LIMIT_MAX_REQUESTS
) {
  const requestCounts = new Map<string, { count: number; resetTime: number }>();

  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const authenticatedReq = req as AuthenticatedRequest;
      const key = authenticatedReq.user?.id || authenticatedReq.ipAddress;
      const now = Date.now();

      // Get or create request count for this key
      let requestCount = requestCounts.get(key);
      if (!requestCount || now > requestCount.resetTime) {
        requestCount = { count: 0, resetTime: now + windowMs };
        requestCounts.set(key, requestCount);
      }

      // Increment request count
      requestCount.count++;

      // Check if rate limit exceeded
      if (requestCount.count > maxRequests) {
        logAuthEvent(authenticatedReq, 'rate_limit_exceeded', false, {
          key,
          count: requestCount.count,
          maxRequests,
          windowMs
        });

        res.status(429).json({
          error: 'Rate limit exceeded',
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: Math.ceil((requestCount.resetTime - now) / 1000),
          correlationId: authenticatedReq.correlationId
        });
        return;
      }

      // Add rate limit headers
      res.set({
        'X-RateLimit-Limit': maxRequests.toString(),
        'X-RateLimit-Remaining': Math.max(0, maxRequests - requestCount.count).toString(),
        'X-RateLimit-Reset': new Date(requestCount.resetTime).toISOString()
      });

      next();
    } catch (error) {
      log.error('Rate limiting error', { error, path: req.path });
      next(); // Continue on error
    }
  };
}

/**
 * Session Validation Middleware
 * Ensures session is still valid and active
 */
export async function validateSession(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authenticatedReq = req as AuthenticatedRequest;
    
    if (!authenticatedReq.session) {
      res.status(401).json({
        error: 'No active session',
        code: 'NO_SESSION',
        correlationId: authenticatedReq.correlationId || 'unknown'
      });
      return;
    }

    // Check if session is still active
    if (!authenticatedReq.session.isActive || authenticatedReq.session.expiresAt < new Date()) {
      await logAuthEvent(authenticatedReq, 'session_expired', false, {
        sessionId: authenticatedReq.session.id,
        userId: authenticatedReq.user?.id
      });

      res.status(401).json({
        error: 'Session expired',
        code: 'SESSION_EXPIRED',
        correlationId: authenticatedReq.correlationId
      });
      return;
    }

    // Update session activity
    authenticatedReq.session.lastActivity = new Date();

    next();
  } catch (error) {
    log.error('Session validation error', { error, path: req.path });
    res.status(500).json({
      error: 'Session validation error',
      code: 'SESSION_VALIDATION_ERROR',
      correlationId: (req as AuthenticatedRequest).correlationId || 'unknown'
    });
  }
}

/**
 * Debug Authentication Middleware
 * Provides detailed authentication information in development
 */
export function debugAuth(req: Request, res: Response, next: NextFunction): void {
  const authenticatedReq = req as AuthenticatedRequest;
  
  if (backendConfig.NODE_ENV === 'development') {
    // Add debug information to response headers
    res.set({
      'X-Debug-Auth-User': authenticatedReq.user ? 'authenticated' : 'anonymous',
      'X-Debug-Auth-Session': authenticatedReq.session ? 'active' : 'none',
      'X-Debug-Auth-IP': authenticatedReq.ipAddress || 'unknown',
      'X-Debug-Auth-Correlation': authenticatedReq.correlationId || 'unknown'
    });

    // Log debug information
    log.debug('Authentication debug info', {
      path: req.path,
      method: req.method,
      user: authenticatedReq.user?.id,
      session: authenticatedReq.session?.id,
      ipAddress: authenticatedReq.ipAddress,
      userAgent: authenticatedReq.userAgent,
      correlationId: authenticatedReq.correlationId
    });
  }

  next();
}

/**
 * Security Headers Middleware
 * Adds security headers to responses
 */
export function securityHeaders(
  _req: Request,
  res: Response,
  next: NextFunction
): void {
  // Security headers
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy':
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
  });

  next();
}

/**
 * Request Logging Middleware
 * Logs all requests for audit purposes
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const authenticatedReq = req as AuthenticatedRequest;
  const startTime = Date.now();

  // Log request start
  log.info('Request started', {
    method: req.method,
    path: req.path,
    ipAddress: authenticatedReq.ipAddress || 'unknown',
    userAgent: authenticatedReq.userAgent || 'unknown',
    correlationId: authenticatedReq.correlationId || 'unknown',
    userId: authenticatedReq.user?.id
  });

  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function (chunk?: any, encoding?: any) {
    const duration = Date.now() - startTime;

    log.info('Request completed', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
      ipAddress: authenticatedReq.ipAddress || 'unknown',
      correlationId: authenticatedReq.correlationId || 'unknown',
      userId: authenticatedReq.user?.id
    });

    return originalEnd.call(res, chunk, encoding);
  } as any;

  next();
}

/**
 * Error Handling Middleware
 * Handles authentication and authorization errors
 */
export function authErrorHandler(
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const authenticatedReq = req as AuthenticatedRequest;
  
  log.error('Authentication error', {
    error: error.message,
    stack: error.stack,
    path: req.path,
    correlationId: authenticatedReq.correlationId || 'unknown'
  });

  // Log security event
  logAuthEvent(authenticatedReq, 'auth_error', false, {
    error: error.message,
    stack: error.stack
  });

  res.status(500).json({
    error: 'Authentication service error',
    code: 'AUTH_SERVICE_ERROR',
    correlationId: authenticatedReq.correlationId || 'unknown'
  });
}

// Export middleware chain for common use cases
export const authMiddleware = [
  requestLogger,
  securityHeaders,
  debugAuth,
  authenticateJWT,
  validateSession
];

export const optionalAuthMiddleware = [requestLogger, securityHeaders, debugAuth, optionalAuth];

export const publicMiddleware = [requestLogger, securityHeaders, debugAuth];