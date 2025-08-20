/**
 * Authentication Routes
 * Priority 1: Debug Authentication - JWT-based session management
 * Handles user authentication, session management, and security features
 */
import { Router } from 'express';
import { authMiddleware, rateLimit, requireRole } from '../middleware/authMiddleware';
import { authService } from '../services/authService';
import { securityMonitoringService } from '../services/securityMonitoringService';
import { log } from '../utils/logger';
const router = Router();
// ============================================================================
// AUTHENTICATION ROUTES
// ============================================================================
/**
 * POST /auth/login
 * Authenticate user with email and password
 */
router.post('/login', rateLimit(5 * 60 * 1000, 10), async (req, res) => {
  try {
    const { email, password } = req.body;
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    // Validate input
    if (!email || !password) {
      res.status(400).json({
        error: 'Email and password are required',
        code: 'MISSING_CREDENTIALS'
      });
      return;
    }
    // Authenticate user
    const authResult = await authService.authenticateUser(email, password, ipAddress, userAgent);
    if (!authResult.success) {
      res.status(401).json({
        error: authResult.error || 'Authentication failed',
        code: 'AUTH_FAILED'
      });
      return;
    }
    // Return success response
    res.json({
      success: true,
      user: {
        id: authResult.user.id,
        email: authResult.user.email,
        name: authResult.user.name,
        role: authResult.user.role,
        permissions: authResult.user.permissions
      },
      session: authResult.session
        ? {
            id: authResult.session.id,
            expiresAt: authResult.session.expiresAt,
            token: authResult.session.token
          }
        : null,
      message: 'Authentication successful'
    });
  } catch (error) {
    log.error('Login error', { error });
    res.status(500).json({
      error: 'Authentication service error',
      code: 'AUTH_SERVICE_ERROR'
    });
  }
});
/**
 * POST /auth/logout
 * Logout user and invalidate session
 */
router.post('/logout', ...authMiddleware, async (req, res) => {
  try {
    const sessionId = req.session?.id;
    if (sessionId) {
      await authService.logout(sessionId, req.ipAddress || 'unknown');
    }
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    log.error('Logout error', { error });
    res.status(500).json({
      error: 'Logout service error',
      code: 'LOGOUT_SERVICE_ERROR'
    });
  }
});
/**
 * POST /auth/refresh
 * Refresh authentication token
 */
router.post('/refresh', rateLimit(5 * 60 * 1000, 20), async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
    if (!refreshToken) {
      res.status(400).json({
        error: 'Refresh token is required',
        code: 'MISSING_REFRESH_TOKEN'
      });
      return;
    }
    const authResult = await authService.refreshToken(refreshToken, ipAddress);
    if (!authResult.success) {
      res.status(401).json({
        error: authResult.error || 'Token refresh failed',
        code: 'REFRESH_FAILED'
      });
      return;
    }
    // Return new tokens
    res.json({
      success: true,
      session: authResult.session
        ? {
            id: authResult.session.id,
            expiresAt: authResult.session.expiresAt,
            token: authResult.session.token
          }
        : null,
      message: 'Token refreshed successfully'
    });
  } catch (error) {
    log.error('Token refresh error', { error });
    res.status(500).json({
      error: 'Token refresh service error',
      code: 'REFRESH_SERVICE_ERROR'
    });
  }
});
/**
 * GET /auth/me
 * Get current user information
 */
router.get('/me', ...authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'User not authenticated',
        code: 'NOT_AUTHENTICATED'
      });
      return;
    }
    res.json({
      success: true,
      user: {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        permissions: req.user.permissions
      },
      session: req.session
        ? {
            id: req.session.id,
            expiresAt: req.session.expiresAt
          }
        : null
    });
  } catch (error) {
    log.error('Get user info error', { error });
    res.status(500).json({
      error: 'User service error',
      code: 'USER_SERVICE_ERROR'
    });
  }
});
// ============================================================================
// SESSION MANAGEMENT ROUTES
// ============================================================================
/**
 * DELETE /auth/sessions/:sessionId
 * Invalidate a specific session
 */
router.delete('/sessions/:sessionId', ...authMiddleware, async (req, res) => {
  try {
    const { sessionId } = req.params;
    if (!sessionId) {
      res.status(400).json({
        error: 'Session ID is required',
        code: 'MISSING_SESSION_ID'
      });
      return;
    }
    await authService.logout(sessionId, req.ipAddress || 'unknown');
    res.json({
      success: true,
      message: 'Session invalidated successfully'
    });
  } catch (error) {
    log.error('Session invalidation error', { error });
    res.status(500).json({
      error: 'Session invalidation service error',
      code: 'SESSION_INVALIDATION_ERROR'
    });
  }
});
// ============================================================================
// SECURITY ROUTES
// ============================================================================
/**
 * GET /auth/security/stats
 * Get security statistics for admin
 */
router.get('/security/stats', ...authMiddleware, requireRole(['admin']), async (_req, res) => {
  try {
    const stats = await securityMonitoringService.getSecurityMetrics();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    log.error('Get security stats error', { error });
    res.status(500).json({
      error: 'Security stats service error',
      code: 'SECURITY_STATS_ERROR'
    });
  }
});
/**
 * GET /auth/security/alerts
 * Get security alerts for admin
 */
router.get('/security/alerts', ...authMiddleware, requireRole(['admin']), async (_req, res) => {
  try {
    const alerts = await securityMonitoringService.getActiveAlerts();
    res.json({
      success: true,
      data: alerts
    });
  } catch (error) {
    log.error('Get security alerts error', { error });
    res.status(500).json({
      error: 'Security alerts service error',
      code: 'SECURITY_ALERTS_ERROR'
    });
  }
});
/**
 * GET /auth/security/indicators
 * Get threat indicators for admin
 */
router.get('/security/indicators', ...authMiddleware, requireRole(['admin']), async (_req, res) => {
  try {
    const indicators = await securityMonitoringService.getThreatIndicators();
    res.json({
      success: true,
      data: indicators
    });
  } catch (error) {
    log.error('Get threat indicators error', { error });
    res.status(500).json({
      error: 'Threat indicators service error',
      code: 'THREAT_INDICATORS_ERROR'
    });
  }
});
/**
 * POST /auth/security/block-ip
 * Block an IP address
 */
router.post('/security/block-ip', ...authMiddleware, requireRole(['admin']), async (req, res) => {
  try {
    const { ipAddress, reason } = req.body;
    if (!ipAddress) {
      res.status(400).json({
        error: 'IP address is required',
        code: 'MISSING_IP_ADDRESS'
      });
      return;
    }
    await securityMonitoringService.blockIP(ipAddress, reason || 'Blocked by admin');
    res.json({
      success: true,
      message: 'IP address blocked successfully'
    });
  } catch (error) {
    log.error('Block IP error', { error });
    res.status(500).json({
      error: 'IP blocking service error',
      code: 'IP_BLOCKING_ERROR'
    });
  }
});
/**
 * POST /auth/security/unblock-ip
 * Unblock an IP address
 */
router.post('/security/unblock-ip', ...authMiddleware, requireRole(['admin']), async (req, res) => {
  try {
    const { ipAddress, reason } = req.body;
    if (!ipAddress) {
      res.status(400).json({
        error: 'IP address is required',
        code: 'MISSING_IP_ADDRESS'
      });
      return;
    }
    await securityMonitoringService.unblockIP(ipAddress, reason || 'Unblocked by admin');
    res.json({
      success: true,
      message: 'IP address unblocked successfully'
    });
  } catch (error) {
    log.error('Unblock IP error', { error });
    res.status(500).json({
      error: 'IP unblocking service error',
      code: 'IP_UNBLOCKING_ERROR'
    });
  }
});
export default router;
