/**
 * Main API Router
 * Implements secure API endpoints with comprehensive security controls
 * Part of Phase 2: Security Infrastructure & Phase 3: Compliance Framework
 */

import express from 'express';
import { SecurityMiddleware } from '../../middleware/security';
import { AuthService } from '../../lib/auth';
import { SecurityMonitoring, SecurityEventType } from '../../lib/monitoring';

// Import route modules
import authRoutes from './auth';
import complianceRoutes from './compliance';
import auditRoutes from './audit';
import riskRoutes from './risk';
import reportingRoutes from './reporting';
import adminRoutes from './admin';
import healthRoutes from './health';

const router = express.Router();

// Initialize security middleware
SecurityMiddleware.initialize();

// Apply global security middleware
router.use(SecurityMiddleware.createHelmetMiddleware());
router.use(SecurityMiddleware.createCORSMiddleware());
router.use(SecurityMiddleware.createRateLimitMiddleware());

// Health check endpoint (no authentication required)
router.use('/health', healthRoutes);

// Authentication routes (no authentication required for login/register)
router.use('/auth', authRoutes);

// Protected API routes (authentication required)
router.use(
  '/compliance',
  SecurityMiddleware.createSecurityMiddleware({
    authentication: {
      required: true,
      permissions: ['compliance:read']
    }
  }),
  complianceRoutes
);

router.use(
  '/audit',
  SecurityMiddleware.createSecurityMiddleware({
    authentication: {
      required: true,
      permissions: ['audit:read']
    }
  }),
  auditRoutes
);

router.use(
  '/risk',
  SecurityMiddleware.createSecurityMiddleware({
    authentication: {
      required: true,
      permissions: ['risk:read']
    }
  }),
  riskRoutes
);

router.use(
  '/reporting',
  SecurityMiddleware.createSecurityMiddleware({
    authentication: {
      required: true,
      permissions: ['reporting:read']
    }
  }),
  reportingRoutes
);

// Admin routes (admin role required)
router.use(
  '/admin',
  SecurityMiddleware.createSecurityMiddleware({
    authentication: {
      required: true,
      roles: ['admin', 'super_admin'],
      permissions: ['admin:read']
    }
  }),
  adminRoutes
);

// Global error handler
router.use(
  (error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('API Error:', error);

    // Log security event for errors
    SecurityMonitoring.logSecurityEvent(
      SecurityEventType.SUSPICIOUS_ACTIVITY,
      'api_error',
      {
        error: error.message,
        stack: error.stack,
        endpoint: req.path,
        method: req.method
      },
      (req as any).user?.id,
      req.ip,
      req.get('User-Agent')
    ).catch(console.error);

    // Don't expose internal errors in production
    const isDevelopment = process.env.NODE_ENV === 'development';

    res.status(error.status || 500).json({
      error: isDevelopment ? error.message : 'Internal server error',
      ...(isDevelopment && { stack: error.stack })
    });
  }
);

// 404 handler
router.use('*', (req: express.Request, res: express.Response) => {
  SecurityMonitoring.logSecurityEvent(
    SecurityEventType.UNAUTHORIZED_API_ACCESS,
    'api_404',
    {
      endpoint: req.path,
      method: req.method,
      reason: 'Endpoint not found'
    },
    (req as any).user?.id,
    req.ip,
    req.get('User-Agent')
  ).catch(console.error);

  res.status(404).json({ error: 'API endpoint not found' });
});

export default router;
