/**
 * Authentication Routes
 * Priority 1: Debug Authentication - JWT-based session management
 * Provides comprehensive authentication endpoints with security monitoring
 */

import { Request, Response, Router } from 'express';
import { backendConfig } from '../config/environment.backend';
import {
  AuthenticatedRequest,
  authMiddleware,
  optionalAuthMiddleware,
  rateLimit,
  requireRole
} from '../middleware/authMiddleware';
import { authService } from '../services/authService';
import { securityMonitoringService } from '../services/securityMonitoringService';
import { log } from '../utils/logger';

const router = Router();

/**
 * POST /auth/login
 * Authenticate user with email and password
 */
router.post('/login', rateLimit(5 * 60 * 1000, 10), async (req: Request, res: Response) => {
  try {
    const { email, password, rememberMe } = req.body;
    const ipAddress =
      (req.headers['x-forwarded-for'] as string) || req.connection.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required',
        code: 'MISSING_CREDENTIALS'
      });
    }

    // Authenticate user
    const authResult = await authService.authenticateUser(email, password, ipAddress, userAgent);

    if (!authResult.success) {
      return res.status(401).json({
        error: authResult.error || 'Authentication failed',
        code: 'AUTHENTICATION_FAILED',
        requiresMFA: authResult.requiresMFA
      });
    }

    // Set cookies if remember me is enabled
    if (rememberMe && authResult.session) {
      res.cookie('refresh_token', authResult.session.refreshToken, {
        httpOnly: true,
        secure: backendConfig.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
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
      session: {
        id: authResult.session.id,
        expiresAt: authResult.session.expiresAt,
        token: authResult.session.token
      },
      message: 'Authentication successful'
    });
  } catch (error) {
    log.error('Login error', { error, email: req.body.email });
    res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * POST /auth/logout
 * Logout user and invalidate session
 */
router.post('/logout', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.session) {
      await authService.logout(req.session.id, req.ipAddress);
    }

    // Clear cookies
    res.clearCookie('refresh_token');

    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    log.error('Logout error', { error, userId: req.user?.id });
    res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * POST /auth/refresh
 * Refresh JWT token using refresh token
 */
router.post('/refresh', rateLimit(5 * 60 * 1000, 20), async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    const ipAddress =
      (req.headers['x-forwarded-for'] as string) || req.connection.remoteAddress || 'unknown';

    if (!refreshToken) {
      return res.status(400).json({
        error: 'Refresh token is required',
        code: 'MISSING_REFRESH_TOKEN'
      });
    }

    // Refresh token
    const authResult = await authService.refreshToken(refreshToken, ipAddress);

    if (!authResult.success) {
      return res.status(401).json({
        error: authResult.error || 'Token refresh failed',
        code: 'REFRESH_FAILED'
      });
    }

    res.json({
      success: true,
      session: {
        id: authResult.session.id,
        expiresAt: authResult.session.expiresAt,
        token: authResult.session.token
      },
      message: 'Token refreshed successfully'
    });
  } catch (error) {
    log.error('Token refresh error', { error });
    res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * GET /auth/me
 * Get current user information
 */
router.get('/me', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    res.json({
      success: true,
      user: {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        permissions: req.user.permissions,
        avatar_url: req.user.avatar_url,
        jurisdiction: req.user.jurisdiction
      },
      session: {
        id: req.session.id,
        expiresAt: req.session.expiresAt,
        lastActivity: req.session.lastActivity
      }
    });
  } catch (error) {
    log.error('Get user info error', { error, userId: req.user?.id });
    res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * POST /auth/validate
 * Validate JWT token without requiring authentication middleware
 */
router.post('/validate', rateLimit(1 * 60 * 1000, 30), async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const ipAddress =
      (req.headers['x-forwarded-for'] as string) || req.connection.remoteAddress || 'unknown';

    if (!token) {
      return res.status(400).json({
        error: 'Token is required',
        code: 'MISSING_TOKEN'
      });
    }

    // Validate token
    const authResult = await authService.validateToken(token, ipAddress);

    if (!authResult.success) {
      return res.status(401).json({
        error: authResult.error || 'Token validation failed',
        code: 'VALIDATION_FAILED'
      });
    }

    res.json({
      success: true,
      valid: true,
      user: {
        id: authResult.user.id,
        email: authResult.user.email,
        name: authResult.user.name,
        role: authResult.user.role
      },
      session: {
        id: authResult.session.id,
        expiresAt: authResult.session.expiresAt
      }
    });
  } catch (error) {
    log.error('Token validation error', { error });
    res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * GET /auth/sessions
 * Get active sessions for current user (admin only)
 */
router.get(
  '/sessions',
  authMiddleware,
  requireRole('admin'),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        });
      }

      const sessions = await authService.getActiveSessions(req.user.id);

      res.json({
        success: true,
        sessions: sessions.map(session => ({
          id: session.id,
          ipAddress: session.ipAddress,
          userAgent: session.userAgent,
          createdAt: session.createdAt,
          lastActivity: session.lastActivity,
          expiresAt: session.expiresAt,
          isActive: session.isActive
        }))
      });
    } catch (error) {
      log.error('Get sessions error', { error, userId: req.user?.id });
      res.status(500).json({
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  }
);

/**
 * DELETE /auth/sessions/:sessionId
 * Invalidate specific session (admin or session owner)
 */
router.delete(
  '/sessions/:sessionId',
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { sessionId } = req.params;
      const isAdmin = req.user?.role === 'admin' || req.user?.role === 'super_admin';
      const isSessionOwner = req.session?.id === sessionId;

      if (!isAdmin && !isSessionOwner) {
        return res.status(403).json({
          error: 'Insufficient permissions',
          code: 'INSUFFICIENT_PERMISSIONS'
        });
      }

      await authService.logout(sessionId, req.ipAddress);

      res.json({
        success: true,
        message: 'Session invalidated successfully'
      });
    } catch (error) {
      log.error('Invalidate session error', { error, sessionId: req.params.sessionId });
      res.status(500).json({
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  }
);

/**
 * POST /auth/mfa/verify
 * Verify MFA token
 */
router.post('/mfa/verify', rateLimit(5 * 60 * 1000, 10), async (req: Request, res: Response) => {
  try {
    const { userId, mfaToken } = req.body;
    const ipAddress =
      (req.headers['x-forwarded-for'] as string) || req.connection.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    if (!userId || !mfaToken) {
      return res.status(400).json({
        error: 'User ID and MFA token are required',
        code: 'MISSING_MFA_CREDENTIALS'
      });
    }

    // TODO: Implement MFA verification logic
    // This would integrate with your MFA service (TOTP, SMS, etc.)

    // For now, return a placeholder response
    res.json({
      success: true,
      message: 'MFA verification successful',
      requiresSetup: false
    });
  } catch (error) {
    log.error('MFA verification error', { error, userId: req.body.userId });
    res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * POST /auth/mfa/setup
 * Setup MFA for user
 */
router.post('/mfa/setup', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    // TODO: Implement MFA setup logic
    // This would generate QR codes, backup codes, etc.

    res.json({
      success: true,
      message: 'MFA setup initiated',
      setupUrl: 'https://example.com/mfa-setup',
      backupCodes: ['code1', 'code2', 'code3', 'code4', 'code5']
    });
  } catch (error) {
    log.error('MFA setup error', { error, userId: req.user?.id });
    res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * GET /auth/security/stats
 * Get security statistics (admin only)
 */
router.get(
  '/security/stats',
  authMiddleware,
  requireRole('admin'),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const [authStats, securityMetrics] = await Promise.all([
        authService.getSecurityStats(),
        securityMonitoringService.getSecurityMetrics()
      ]);

      res.json({
        success: true,
        authStats,
        securityMetrics
      });
    } catch (error) {
      log.error('Get security stats error', { error });
      res.status(500).json({
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  }
);

/**
 * GET /auth/security/alerts
 * Get active security alerts (admin only)
 */
router.get(
  '/security/alerts',
  authMiddleware,
  requireRole('admin'),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const alerts = await securityMonitoringService.getActiveAlerts();

      res.json({
        success: true,
        alerts: alerts.map(alert => ({
          id: alert.id,
          type: alert.type,
          severity: alert.severity,
          title: alert.title,
          description: alert.description,
          timestamp: alert.timestamp,
          status: alert.status,
          metadata: alert.metadata
        }))
      });
    } catch (error) {
      log.error('Get security alerts error', { error });
      res.status(500).json({
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  }
);

/**
 * GET /auth/security/indicators
 * Get threat indicators (admin only)
 */
router.get(
  '/security/indicators',
  authMiddleware,
  requireRole('admin'),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const indicators = await securityMonitoringService.getThreatIndicators();

      res.json({
        success: true,
        indicators: indicators.map(indicator => ({
          type: indicator.type,
          value: indicator.value,
          riskScore: indicator.riskScore,
          confidence: indicator.confidence,
          firstSeen: indicator.firstSeen,
          lastSeen: indicator.lastSeen,
          frequency: indicator.frequency,
          source: indicator.source,
          tags: indicator.tags
        }))
      });
    } catch (error) {
      log.error('Get threat indicators error', { error });
      res.status(500).json({
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  }
);

/**
 * POST /auth/security/block-ip
 * Block IP address (admin only)
 */
router.post(
  '/security/block-ip',
  authMiddleware,
  requireRole('admin'),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { ipAddress, reason } = req.body;

      if (!ipAddress) {
        return res.status(400).json({
          error: 'IP address is required',
          code: 'MISSING_IP_ADDRESS'
        });
      }

      await securityMonitoringService.blockIP(ipAddress, reason || 'Manual block by admin');

      res.json({
        success: true,
        message: `IP address ${ipAddress} blocked successfully`
      });
    } catch (error) {
      log.error('Block IP error', { error, ipAddress: req.body.ipAddress });
      res.status(500).json({
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  }
);

/**
 * POST /auth/security/unblock-ip
 * Unblock IP address (admin only)
 */
router.post(
  '/security/unblock-ip',
  authMiddleware,
  requireRole('admin'),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { ipAddress, reason } = req.body;

      if (!ipAddress) {
        return res.status(400).json({
          error: 'IP address is required',
          code: 'MISSING_IP_ADDRESS'
        });
      }

      await securityMonitoringService.unblockIP(ipAddress, reason || 'Manual unblock by admin');

      res.json({
        success: true,
        message: `IP address ${ipAddress} unblocked successfully`
      });
    } catch (error) {
      log.error('Unblock IP error', { error, ipAddress: req.body.ipAddress });
      res.status(500).json({
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  }
);

/**
 * GET /auth/debug/info
 * Get debug information (development only)
 */
router.get(
  '/debug/info',
  optionalAuthMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    if (backendConfig.NODE_ENV !== 'development') {
      return res.status(404).json({
        error: 'Debug endpoint not available in production',
        code: 'DEBUG_NOT_AVAILABLE'
      });
    }

    try {
      const debugInfo = {
        environment: backendConfig.NODE_ENV,
        timestamp: new Date().toISOString(),
        request: {
          ipAddress: req.ipAddress,
          userAgent: req.userAgent,
          correlationId: req.correlationId,
          path: req.path,
          method: req.method
        },
        user: req.user
          ? {
              id: req.user.id,
              email: req.user.email,
              role: req.user.role
            }
          : null,
        session: req.session
          ? {
              id: req.session.id,
              expiresAt: req.session.expiresAt,
              isActive: req.session.isActive
            }
          : null,
        security: {
          monitoringEnabled: backendConfig.ENABLE_SECURITY_MONITORING,
          wazuhEndpoint: backendConfig.WAZUH_ENDPOINT ? 'configured' : 'not configured',
          falcoEndpoint: backendConfig.FALCO_ENDPOINT ? 'configured' : 'not configured'
        }
      };

      res.json({
        success: true,
        debugInfo
      });
    } catch (error) {
      log.error('Debug info error', { error });
      res.status(500).json({
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  }
);

export default router;
