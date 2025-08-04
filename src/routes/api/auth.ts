/**
 * Authentication API Routes
 * Handles user authentication, registration, and session management
 * Part of Phase 2: Security Infrastructure
 */

import express from 'express';
import { AuthService, UserRole } from '../../lib/auth';
import { SecurityMonitoring, SecurityEventType } from '../../lib/monitoring';
import { SecurityMiddleware } from '../../middleware/security';
import { validateInput } from '../../lib/validation';
import { createHash, randomBytes } from 'crypto';
import { getSupabase } from '../../integrations/supabase/client';

const router = express.Router();

/**
 * User Registration
 * POST /api/auth/register
 */
router.post('/register', async (req: express.Request, res: express.Response) => {
  try {
    // Validate input
    const validation = validateInput(req.body, {
      email: { required: true, type: 'email' },
      password: { required: true, type: 'string', minLength: 8 },
      firstName: { required: true, type: 'string', maxLength: 50 },
      lastName: { required: true, type: 'string', maxLength: 50 },
      organizationName: { required: false, type: 'string', maxLength: 100 },
      role: { required: false, type: 'string', enum: Object.values(UserRole) }
    });

    if (!validation.isValid) {
      await SecurityMonitoring.logSecurityEvent(
        SecurityEventType.SUSPICIOUS_ACTIVITY,
        'auth_register',
        { reason: 'Invalid input', errors: validation.errors },
        undefined,
        req.ip,
        req.get('User-Agent')
      );
      return res.status(400).json({ error: 'Invalid input', details: validation.errors });
    }

    const { email, password, firstName, lastName, organizationName, role } = req.body;

    // Check if user already exists
    const existingUser = await AuthService.getUserByEmail(email);
    if (existingUser) {
      await SecurityMonitoring.logSecurityEvent(
        SecurityEventType.SUSPICIOUS_ACTIVITY,
        'auth_register',
        { reason: 'Email already exists', email },
        undefined,
        req.ip,
        req.get('User-Agent')
      );
      return res.status(409).json({ error: 'User already exists' });
    }

    // Register user
    const result = await AuthService.registerUser({
      email,
      password,
      firstName,
      lastName,
      organizationName,
      role: role || UserRole.USER
    });

    if (!result.success) {
      await SecurityMonitoring.logSecurityEvent(
        SecurityEventType.AUTHENTICATION_FAILURE,
        'auth_register',
        { reason: result.error, email },
        undefined,
        req.ip,
        req.get('User-Agent')
      );
      return res.status(400).json({ error: result.error });
    }

    // Log successful registration
    await SecurityMonitoring.logSecurityEvent(
      SecurityEventType.USER_REGISTRATION,
      'auth_register',
      { email, role: role || UserRole.USER },
      result.user?.id,
      req.ip,
      req.get('User-Agent')
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: result.user?.id,
        email: result.user?.email,
        firstName: result.user?.firstName,
        lastName: result.user?.lastName,
        role: result.user?.role
      },
      requiresEmailVerification: true
    });
  } catch (error) {
    console.error('Registration error:', error);
    await SecurityMonitoring.logSecurityEvent(
      SecurityEventType.SUSPICIOUS_ACTIVITY,
      'auth_register',
      { error: error.message },
      undefined,
      req.ip,
      req.get('User-Agent')
    );
    res.status(500).json({ error: 'Registration failed' });
  }
});

/**
 * User Login
 * POST /api/auth/login
 */
router.post('/login', async (req: express.Request, res: express.Response) => {
  try {
    // Validate input
    const validation = validateInput(req.body, {
      email: { required: true, type: 'email' },
      password: { required: true, type: 'string' },
      rememberMe: { required: false, type: 'boolean' }
    });

    if (!validation.isValid) {
      await SecurityMonitoring.logSecurityEvent(
        SecurityEventType.AUTHENTICATION_FAILURE,
        'auth_login',
        { reason: 'Invalid input', errors: validation.errors },
        undefined,
        req.ip,
        req.get('User-Agent')
      );
      return res.status(400).json({ error: 'Invalid input', details: validation.errors });
    }

    const { email, password, rememberMe } = req.body;

    // Attempt login
    const result = await AuthService.loginUser(email, password, {
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      rememberMe
    });

    if (!result.success) {
      await SecurityMonitoring.logSecurityEvent(
        SecurityEventType.AUTHENTICATION_FAILURE,
        'auth_login',
        { reason: result.error, email },
        undefined,
        req.ip,
        req.get('User-Agent')
      );
      return res.status(401).json({ error: result.error });
    }

    // Log successful login
    await SecurityMonitoring.logSecurityEvent(
      SecurityEventType.USER_LOGIN,
      'auth_login',
      { email, sessionId: result.session?.id },
      result.user?.id,
      req.ip,
      req.get('User-Agent')
    );

    // Set secure cookie if remember me is enabled
    if (rememberMe && result.session?.accessToken) {
      res.cookie('auth_token', result.session.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });
    }

    res.json({
      message: 'Login successful',
      user: {
        id: result.user?.id,
        email: result.user?.email,
        firstName: result.user?.firstName,
        lastName: result.user?.lastName,
        role: result.user?.role,
        permissions: result.user?.permissions
      },
      session: {
        accessToken: result.session?.accessToken,
        refreshToken: result.session?.refreshToken,
        expiresAt: result.session?.expiresAt
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    await SecurityMonitoring.logSecurityEvent(
      SecurityEventType.AUTHENTICATION_FAILURE,
      'auth_login',
      { error: error.message },
      undefined,
      req.ip,
      req.get('User-Agent')
    );
    res.status(500).json({ error: 'Login failed' });
  }
});

/**
 * User Logout
 * POST /api/auth/logout
 */
router.post(
  '/logout',
  SecurityMiddleware.createSecurityMiddleware({ authentication: { required: true } }),
  async (req: express.Request, res: express.Response) => {
    try {
      const user = (req as any).user;
      const session = (req as any).session;

      // Logout user
      await AuthService.logoutUser(session.id);

      // Clear cookie
      res.clearCookie('auth_token');

      // Log logout
      await SecurityMonitoring.logSecurityEvent(
        SecurityEventType.USER_LOGOUT,
        'auth_logout',
        { sessionId: session.id },
        user.id,
        req.ip,
        req.get('User-Agent')
      );

      res.json({ message: 'Logout successful' });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ error: 'Logout failed' });
    }
  }
);

/**
 * Refresh Token
 * POST /api/auth/refresh
 */
router.post('/refresh', async (req: express.Request, res: express.Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token required' });
    }

    // Validate and refresh session
    const result = await AuthService.refreshSession(refreshToken);

    if (!result.success) {
      await SecurityMonitoring.logSecurityEvent(
        SecurityEventType.AUTHENTICATION_FAILURE,
        'auth_refresh',
        { reason: result.error },
        undefined,
        req.ip,
        req.get('User-Agent')
      );
      return res.status(401).json({ error: result.error });
    }

    // Log successful refresh
    await SecurityMonitoring.logSecurityEvent(
      SecurityEventType.SESSION_REFRESH,
      'auth_refresh',
      { sessionId: result.session?.id },
      result.user?.id,
      req.ip,
      req.get('User-Agent')
    );

    res.json({
      message: 'Token refreshed successfully',
      session: {
        accessToken: result.session?.accessToken,
        refreshToken: result.session?.refreshToken,
        expiresAt: result.session?.expiresAt
      }
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ error: 'Token refresh failed' });
  }
});

/**
 * Get Current User
 * GET /api/auth/me
 */
router.get(
  '/me',
  SecurityMiddleware.createSecurityMiddleware({ authentication: { required: true } }),
  async (req: express.Request, res: express.Response) => {
    try {
      const user = (req as any).user;

      res.json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          permissions: user.permissions,
          organizationId: user.organizationId,
          createdAt: user.createdAt,
          lastLoginAt: user.lastLoginAt
        }
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ error: 'Failed to get user information' });
    }
  }
);

/**
 * Change Password
 * POST /api/auth/change-password
 */
router.post(
  '/change-password',
  SecurityMiddleware.createSecurityMiddleware({ authentication: { required: true } }),
  async (req: express.Request, res: express.Response) => {
    try {
      const user = (req as any).user;
      const { currentPassword, newPassword } = req.body;

      // Validate input
      const validation = validateInput(req.body, {
        currentPassword: { required: true, type: 'string' },
        newPassword: { required: true, type: 'string', minLength: 8 }
      });

      if (!validation.isValid) {
        return res.status(400).json({ error: 'Invalid input', details: validation.errors });
      }

      // Change password
      const result = await AuthService.changePassword(user.id, currentPassword, newPassword);

      if (!result.success) {
        await SecurityMonitoring.logSecurityEvent(
          SecurityEventType.AUTHENTICATION_FAILURE,
          'auth_change_password',
          { reason: result.error, userId: user.id },
          user.id,
          req.ip,
          req.get('User-Agent')
        );
        return res.status(400).json({ error: result.error });
      }

      // Log successful password change
      await SecurityMonitoring.logSecurityEvent(
        SecurityEventType.PASSWORD_CHANGE,
        'auth_change_password',
        { userId: user.id },
        user.id,
        req.ip,
        req.get('User-Agent')
      );

      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ error: 'Password change failed' });
    }
  }
);

/**
 * Request Password Reset
 * POST /api/auth/forgot-password
 */
router.post('/forgot-password', async (req: express.Request, res: express.Response) => {
  try {
    const { email } = req.body;

    // Validate input
    const validation = validateInput(req.body, {
      email: { required: true, type: 'email' }
    });

    if (!validation.isValid) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Request password reset
    const result = await AuthService.requestPasswordReset(email);

    // Always return success to prevent email enumeration
    res.json({ message: 'If the email exists, a password reset link has been sent' });

    // Log the attempt
    await SecurityMonitoring.logSecurityEvent(
      SecurityEventType.PASSWORD_RESET_REQUEST,
      'auth_forgot_password',
      { email, success: result.success },
      undefined,
      req.ip,
      req.get('User-Agent')
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    res.json({ message: 'If the email exists, a password reset link has been sent' });
  }
});

/**
 * Reset Password
 * POST /api/auth/reset-password
 */
router.post('/reset-password', async (req: express.Request, res: express.Response) => {
  try {
    const { token, newPassword } = req.body;

    // Validate input
    const validation = validateInput(req.body, {
      token: { required: true, type: 'string' },
      newPassword: { required: true, type: 'string', minLength: 8 }
    });

    if (!validation.isValid) {
      return res.status(400).json({ error: 'Invalid input', details: validation.errors });
    }

    // Reset password
    const result = await AuthService.resetPassword(token, newPassword);

    if (!result.success) {
      await SecurityMonitoring.logSecurityEvent(
        SecurityEventType.AUTHENTICATION_FAILURE,
        'auth_reset_password',
        { reason: result.error, token: `${token.substring(0, 8)}...` },
        undefined,
        req.ip,
        req.get('User-Agent')
      );
      return res.status(400).json({ error: result.error });
    }

    // Log successful password reset
    await SecurityMonitoring.logSecurityEvent(
      SecurityEventType.PASSWORD_RESET,
      'auth_reset_password',
      { userId: result.userId },
      result.userId,
      req.ip,
      req.get('User-Agent')
    );

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Password reset failed' });
  }
});

/**
 * Verify Email
 * POST /api/auth/verify-email
 */
router.post('/verify-email', async (req: express.Request, res: express.Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Verification token required' });
    }

    // Verify email
    const result = await AuthService.verifyEmail(token);

    if (!result.success) {
      await SecurityMonitoring.logSecurityEvent(
        SecurityEventType.AUTHENTICATION_FAILURE,
        'auth_verify_email',
        { reason: result.error, token: `${token.substring(0, 8)}...` },
        undefined,
        req.ip,
        req.get('User-Agent')
      );
      return res.status(400).json({ error: result.error });
    }

    // Log successful email verification
    await SecurityMonitoring.logSecurityEvent(
      SecurityEventType.EMAIL_VERIFICATION,
      'auth_verify_email',
      { userId: result.userId },
      result.userId,
      req.ip,
      req.get('User-Agent')
    );

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ error: 'Email verification failed' });
  }
});

/**
 * Resend Email Verification
 * POST /api/auth/resend-verification
 */
router.post('/resend-verification', async (req: express.Request, res: express.Response) => {
  try {
    const { email } = req.body;

    // Validate input
    const validation = validateInput(req.body, {
      email: { required: true, type: 'email' }
    });

    if (!validation.isValid) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Resend verification email
    const result = await AuthService.resendEmailVerification(email);

    // Always return success to prevent email enumeration
    res.json({
      message: 'If the email exists and is unverified, a verification email has been sent'
    });

    // Log the attempt
    await SecurityMonitoring.logSecurityEvent(
      SecurityEventType.EMAIL_VERIFICATION_REQUEST,
      'auth_resend_verification',
      { email, success: result.success },
      undefined,
      req.ip,
      req.get('User-Agent')
    );
  } catch (error) {
    console.error('Resend verification error:', error);
    res.json({
      message: 'If the email exists and is unverified, a verification email has been sent'
    });
  }
});

export default router;
