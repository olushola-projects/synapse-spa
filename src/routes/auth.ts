/**
 * Authentication Routes
 * Priority 1: Debug Authentication - JWT-based session management
 * Provides comprehensive authentication endpoints with security monitoring
 */

import { Request, Response, Router } from 'express';
import { backendConfig } from '../config/environment.backend';
import {
  AuthenticatedRequest,
  authenticateJWT,
  optionalAuth,
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
router.post('/login', rateLimit(5 * 60 * 1000, 10), async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, rememberMe } = req.body;
    const ipAddress =
      (req.headers['x-forwarded-for'] as string) || req.connection?.remoteAddress || 'unknown';
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
        code: 'AUTHENTICATION_FAILED',
        requiresMFA: authResult.requiresMFA
      });
      return;
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
        id: authResult.user!.id,
        email: authResult.user!.email,
        name: authResult.user!.name,
        role: authResult.user!.role,
        permissions: authResult.user!.permissions
      },
      session: {
        id: authResult.session!.id,
        expiresAt: authResult.session!.expiresAt,
        token: authResult.session!.token
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
router.post('/logout', authenticateJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const authenticatedReq = req as AuthenticatedRequest;
    if (authenticatedReq.session) {
      await authService.logout(authenticatedReq.session.id, authenticatedReq.ipAddress);
    }

    // Clear cookies
    res.clearCookie('refresh_token');

    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    log.error('Logout error', { error, userId: (req as AuthenticatedRequest).user?.id });
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
router.post('/refresh', rateLimit(5 * 60 * 1000, 20), async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    const ipAddress =
      (req.headers['x-forwarded-for'] as string) || req.connection?.remoteAddress || 'unknown';

    if (!refreshToken) {
      res.status(400).json({
        error: 'Refresh token is required',
        code: 'MISSING_REFRESH_TOKEN'
      });
      return;
    }

    // Refresh token
    const authResult = await authService.refreshToken(refreshToken, ipAddress);

    if (!authResult.success) {
      res.status(401).json({
        error: authResult.error || 'Token refresh failed',
        code: 'REFRESH_FAILED'
      });
      return;
    }

    res.json({
      success: true,
      session: {
        id: authResult.session!.id,
        expiresAt: authResult.session!.expiresAt,
        token: authResult.session!.token
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
router.get('/me', authenticateJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const authenticatedReq = req as AuthenticatedRequest;
    if (!authenticatedReq.user) {
      res.status(401).json({
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
      return;
    }

    res.json({
      success: true,
      user: {
        id: authenticatedReq.user.id,
        email: authenticatedReq.user.email,
        name: authenticatedReq.user.name,
        role: authenticatedReq.user.role,
        permissions: authenticatedReq.user.permissions,
        avatar_url: authenticatedReq.user.avatar_url,
        jurisdiction: authenticatedReq.user.jurisdiction
      },
      session: {
        id: authenticatedReq.session?.id,
        expiresAt: authenticatedReq.session?.expiresAt,
        lastActivity: authenticatedReq.session?.lastActivity
      }
    });
  } catch (error) {
    log.error('Get user info error', { error, userId: (req as AuthenticatedRequest).user?.id });
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
router.post('/validate', rateLimit(1 * 60 * 1000, 30), async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body;
    const ipAddress =
      (req.headers['x-forwarded-for'] as string) || req.connection?.remoteAddress || 'unknown';

    if (!token) {
      res.status(400).json({
        error: 'Token is required',
        code: 'MISSING_TOKEN'
      });
      return;
    }

    // Validate token
    const authResult = await authService.validateToken(token, ipAddress);

    if (!authResult.success) {
      res.status(401).json({
        error: authResult.error || 'Token validation failed',
        code: 'VALIDATION_FAILED'
      });
      return;
    }

    res.json({
      success: true,
      valid: true,
      user: {
        id: authResult.user!.id,
        email: authResult.user!.email,
        name: authResult.user!.name,
        role: authResult.user!.role
      },
      session: {
        id: authResult.session!.id,
        expiresAt: authResult.session!.expiresAt
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
  authenticateJWT,
  requireRole('admin'),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const authenticatedReq = req as AuthenticatedRequest;
      if (!authenticatedReq.user) {
        res.status(401).json({
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        });
        return;
      }

      const sessions = await authService.getActiveSessions(authenticatedReq.user.id);

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
      log.error('Get sessions error', { error, userId: (req as AuthenticatedRequest).user?.id });
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
  authenticateJWT,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const authenticatedReq = req as AuthenticatedRequest;
      const { sessionId } = req.params;
      const isAdmin = authenticatedReq.user?.role === 'admin' || authenticatedReq.user?.role === 'super_admin';
      const isSessionOwner = authenticatedReq.session?.id === sessionId;

      if (!isAdmin && !isSessionOwner) {
        res.status(403).json({
          error: 'Insufficient permissions',
          code: 'INSUFFICIENT_PERMISSIONS'
        });
        return;
      }

      await authService.logout(sessionId, authenticatedReq.ipAddress);

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
router.post('/mfa/verify', rateLimit(5 * 60 * 1000, 10), async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, mfaToken } = req.body;

    if (!userId || !mfaToken) {
      res.status(400).json({
        error: 'User ID and MFA token are required',
        code: 'MISSING_MFA_CREDENTIALS'
      });
      return;
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
router.post('/mfa/setup', authenticateJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const authenticatedReq = req as AuthenticatedRequest;
    if (!authenticatedReq.user) {
      res.status(401).json({
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
      return;
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
    log.error('MFA setup error', { error, userId: (req as AuthenticatedRequest).user?.id });
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
  authenticateJWT,
  requireRole('admin'),
  async (_req: Request, res: Response): Promise<void> => {
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
  authenticateJWT,
  requireRole('admin'),
  async (_req: Request, res: Response): Promise<void> => {
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
  authenticateJWT,
  requireRole('admin'),
  async (_req: Request, res: Response): Promise<void> => {
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
  authenticateJWT,
  requireRole('admin'),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { ipAddress, reason } = req.body;

      if (!ipAddress) {
        res.status(400).json({
          error: 'IP address is required',
          code: 'MISSING_IP_ADDRESS'
        });
        return;
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
  authenticateJWT,
  requireRole('admin'),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { ipAddress, reason } = req.body;

      if (!ipAddress) {
        res.status(400).json({
          error: 'IP address is required',
          code: 'MISSING_IP_ADDRESS'
        });
        return;
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
  optionalAuth,
  async (req: Request, res: Response): Promise<void> => {
    const authenticatedReq = req as AuthenticatedRequest;
    
    if (backendConfig.NODE_ENV !== 'development') {
      res.status(404).json({
        error: 'Debug endpoint not available in production',
        code: 'DEBUG_NOT_AVAILABLE'
      });
      return;
    }

    try {
      const debugInfo = {
        environment: backendConfig.NODE_ENV,
        timestamp: new Date().toISOString(),
        request: {
          ipAddress: authenticatedReq.ipAddress,
          userAgent: authenticatedReq.userAgent,
          correlationId: authenticatedReq.correlationId,
          path: req.path,
          method: req.method
        },
        user: authenticatedReq.user
          ? {
              id: authenticatedReq.user.id,
              email: authenticatedReq.user.email,
              role: authenticatedReq.user.role
            }
          : null,
        session: authenticatedReq.session
          ? {
              id: authenticatedReq.session.id,
              expiresAt: authenticatedReq.session.expiresAt,
              isActive: authenticatedReq.session.isActive
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