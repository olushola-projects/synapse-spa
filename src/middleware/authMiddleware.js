/**
 * Authentication Middleware
 * Priority 1: Debug Authentication - JWT-based session management
 * Integrates with security monitoring and session management
 */
import { backendConfig } from '../config/environment.backend';
import { authService } from '../services/authService';
import { securityMonitoringService } from '../services/securityMonitoringService';
import { log } from '../utils/logger';
/**
 * Extract client IP address from request
 */
function getClientIP(req) {
    // Check for forwarded headers (proxy/load balancer)
    const forwardedFor = req.headers['x-forwarded-for'];
    if (forwardedFor) {
        const ips = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor;
        return ips?.split(',')[0]?.trim() || 'unknown';
    }
    // Check for real IP header
    const realIP = req.headers['x-real-ip'];
    if (realIP) {
        return Array.isArray(realIP) ? realIP[0] || 'unknown' : realIP;
    }
    // Fallback to connection remote address
    return req.connection.remoteAddress || req.socket.remoteAddress || 'unknown';
}
/**
 * Extract user agent from request
 */
function getUserAgent(req) {
    return req.headers['user-agent'] || 'unknown';
}
/**
 * Generate correlation ID for request tracking
 */
function generateCorrelationId() {
    return crypto.randomUUID();
}
/**
 * Log security event for authentication attempts
 */
async function logAuthEvent(req, eventType, success, details = {}) {
    try {
        await securityMonitoringService.logSecurityEvent({
            type: 'authentication',
            severity: success ? 'low' : 'high',
            source: 'auth_middleware',
            userId: req.user?.id,
            ipAddress: req.ipAddress || 'unknown',
            userAgent: req.userAgent || 'unknown',
            details: {
                eventType,
                success,
                endpoint: req.path,
                method: req.method,
                correlationId: req.correlationId,
                ...details
            }
        });
    }
    catch (error) {
        log.error('Failed to log auth event', { error, req: req.path });
    }
}
/**
 * JWT Authentication Middleware
 * Validates JWT tokens and attaches user/session to request
 */
export async function authenticateJWT(req, res, next) {
    try {
        // Cast request to AuthenticatedRequest and add required properties
        const authReq = req;
        authReq.ipAddress = getClientIP(req);
        authReq.userAgent = getUserAgent(req);
        authReq.correlationId = generateCorrelationId();
        // Check if IP is blocked
        if (securityMonitoringService.isIPBlocked(authReq.ipAddress || 'unknown')) {
            await logAuthEvent(authReq, 'blocked_ip_access', false, { reason: 'IP blocked' });
            res.status(403).json({
                error: 'Access denied',
                code: 'IP_BLOCKED',
                correlationId: authReq.correlationId
            });
            return;
        }
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            await logAuthEvent(authReq, 'missing_token', false);
            res.status(401).json({
                error: 'Authentication token required',
                code: 'MISSING_TOKEN',
                correlationId: authReq.correlationId
            });
            return;
        }
        const token = authHeader.substring(7);
        const authResult = await authService.validateToken(token, authReq.ipAddress || 'unknown');
        if (!authResult.success) {
            await logAuthEvent(authReq, 'invalid_token', false, { reason: authResult.error });
            res.status(401).json({
                error: 'Invalid authentication token',
                code: 'INVALID_TOKEN',
                correlationId: authReq.correlationId
            });
            return;
        }
        // Attach user and session to request
        authReq.user = authResult.user;
        authReq.session = authResult.session;
        // Log successful authentication
        await logAuthEvent(authReq, 'token_validated', true);
        next();
    }
    catch (error) {
        log.error('JWT authentication error', { error, path: req.path });
        res.status(500).json({
            error: 'Authentication service error',
            code: 'AUTH_SERVICE_ERROR'
        });
    }
}
/**
 * Role-based Authorization Middleware
 * Checks if user has required roles
 */
export function requireRole(requiredRoles) {
    return (req, res, next) => {
        const authReq = req;
        if (!authReq.user) {
            res.status(401).json({
                error: 'Authentication required',
                code: 'AUTHENTICATION_REQUIRED',
                correlationId: authReq.correlationId
            });
            return;
        }
        const userRoles = authReq.user.roles || [];
        const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
        if (!hasRequiredRole) {
            logAuthEvent(authReq, 'insufficient_permissions', false, {
                requiredRoles,
                userRoles
            });
            res.status(403).json({
                error: 'Insufficient permissions',
                code: 'INSUFFICIENT_PERMISSIONS',
                correlationId: authReq.correlationId
            });
            return;
        }
        next();
    };
}
/**
 * Permission-based Authorization Middleware
 * Checks if user has required permissions
 */
export function requirePermission(requiredPermissions) {
    return (req, res, next) => {
        const authReq = req;
        if (!authReq.user) {
            res.status(401).json({
                error: 'Authentication required',
                code: 'AUTHENTICATION_REQUIRED',
                correlationId: authReq.correlationId
            });
            return;
        }
        const userPermissions = authReq.user.permissions || [];
        const hasRequiredPermission = requiredPermissions.every(permission => userPermissions.includes(permission));
        if (!hasRequiredPermission) {
            logAuthEvent(authReq, 'insufficient_permissions', false, {
                requiredPermissions,
                userPermissions
            });
            res.status(403).json({
                error: 'Insufficient permissions',
                code: 'INSUFFICIENT_PERMISSIONS',
                correlationId: authReq.correlationId
            });
            return;
        }
        next();
    };
}
/**
 * Rate Limiting Middleware
 * Implements rate limiting for authentication endpoints
 */
export function rateLimit(windowMs, maxRequests) {
    const requests = new Map();
    return (req, res, next) => {
        const authReq = req;
        const key = authReq.ipAddress || 'unknown';
        const now = Date.now();
        const requestData = requests.get(key);
        if (!requestData || now > requestData.resetTime) {
            requests.set(key, { count: 1, resetTime: now + windowMs });
            next();
            return;
        }
        if (requestData.count >= maxRequests) {
            logAuthEvent(authReq, 'rate_limit_exceeded', false, {
                limit: maxRequests,
                window: windowMs
            });
            res.status(429).json({
                error: 'Too many requests',
                code: 'RATE_LIMIT_EXCEEDED',
                retryAfter: Math.ceil((requestData.resetTime - now) / 1000),
                correlationId: authReq.correlationId
            });
            return;
        }
        requestData.count++;
        next();
    };
}
/**
 * Session Management Middleware
 * Manages user sessions and session cleanup
 */
export function sessionManager(req, res, next) {
    const authReq = req;
    // Check session expiry
    if (authReq.session && authReq.session.expiresAt) {
        const now = new Date();
        if (now > new Date(authReq.session.expiresAt)) {
            // Session expired, clear it
            authReq.session = undefined;
            authReq.user = undefined;
            logAuthEvent(authReq, 'session_expired', false);
            res.status(401).json({
                error: 'Session expired',
                code: 'SESSION_EXPIRED',
                correlationId: authReq.correlationId
            });
            return;
        }
    }
    next();
}
/**
 * Security Headers Middleware
 * Adds security headers to responses
 */
export function securityHeaders(_req, res, next) {
    // Security headers
    res.set({
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
    });
    next();
}
/**
 * Request Logging Middleware
 * Logs all requests for audit purposes
 */
export function requestLogger(req, res, next) {
    const startTime = Date.now();
    // Log request start
    log.info('Request started', {
        method: req.method,
        path: req.path,
        ipAddress: req.ipAddress,
        userAgent: req.userAgent,
        correlationId: req.correlationId,
        userId: req.user?.id
    });
    // Override res.end to log response
    const originalEnd = res.end;
    res.end = function (chunk, encoding) {
        const duration = Date.now() - startTime;
        log.info('Request completed', {
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            duration,
            ipAddress: req.ipAddress,
            correlationId: req.correlationId,
            userId: req.user?.id
        });
        return originalEnd.call(this, chunk, encoding);
    };
    next();
}
/**
 * Error Handling Middleware
 * Handles authentication and authorization errors
 */
export function authErrorHandler(error, req, res, _next) {
    log.error('Authentication error', {
        error: error.message,
        stack: error.stack,
        path: req.path,
        correlationId: req.correlationId
    });
    // Log security event
    logAuthEvent(req, 'auth_error', false, {
        error: error.message,
        stack: error.stack
    });
    res.status(500).json({
        error: 'Authentication service error',
        code: 'AUTH_SERVICE_ERROR',
        correlationId: req.correlationId
    });
}
/**
 * Debug Authentication Middleware
 * Provides detailed authentication debugging information
 */
export function debugAuth(req, _res, next) {
    const authReq = req;
    if (backendConfig.NODE_ENV === 'development') {
        log.debug('Authentication debug info', {
            path: req.path,
            method: req.method,
            headers: {
                authorization: req.headers.authorization ? 'present' : 'missing',
                'user-agent': req.headers['user-agent'],
                'x-forwarded-for': req.headers['x-forwarded-for']
            },
            user: authReq.user ? {
                id: authReq.user.id,
                email: authReq.user.email,
                roles: authReq.user.roles
            } : 'not authenticated',
            session: authReq.session ? {
                id: authReq.session.id,
                expiresAt: authReq.session.expiresAt
            } : 'no session',
            ipAddress: authReq.ipAddress,
            correlationId: authReq.correlationId
        });
    }
    next();
}
// Export middleware chain for common use cases
export const authMiddleware = [
    requestLogger,
    securityHeaders,
    debugAuth,
    authenticateJWT
];
export const optionalAuthMiddleware = [
    requestLogger,
    securityHeaders,
    debugAuth
];
export const publicMiddleware = [
    requestLogger,
    securityHeaders,
    debugAuth
];
