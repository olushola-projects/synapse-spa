/**
 * JWT-Based Authentication Service
 * Priority 1: Critical Authentication Implementation
 * Implements secure session management with Wazuh/Falco integration
 */

import jwt from 'jsonwebtoken';
import { supabase } from '../integrations/supabase/client';
import { log } from '../utils/logger';

// JWT Configuration
const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  expiresIn: '1h',
  refreshExpiresIn: '7d',
  issuer: 'synapses-grc-platform',
  audience: 'synapses-grc-users'
};

// Session Management Configuration
const SESSION_CONFIG = {
  maxConcurrentSessions: 5,
  sessionTimeout: 8 * 60 * 60 * 1000, // 8 hours
  refreshThreshold: 15 * 60 * 1000, // 15 minutes
  cleanupInterval: 60 * 60 * 1000 // 1 hour
};

// Security Monitoring Configuration
const SECURITY_MONITORING = {
  enabled: process.env.ENABLE_SECURITY_MONITORING === 'true',
  wazuhEndpoint: process.env.WAZUH_ENDPOINT,
  falcoEndpoint: process.env.FALCO_ENDPOINT,
  alertThreshold: 5, // Failed attempts before alert
  blockThreshold: 10, // Failed attempts before blocking
  blockDuration: 30 * 60 * 1000 // 30 minutes
};

export interface UserSession {
  id: string;
  userId: string;
  token: string;
  refreshToken: string;
  expiresAt: Date;
  ipAddress: string;
  userAgent: string;
  isActive: boolean;
  lastActivity: Date;
  createdAt: Date;
}

export interface AuthResult {
  success: boolean;
  user?: any;
  session?: UserSession;
  error?: string;
  requiresMFA?: boolean;
  securityAlert?: boolean;
}

export interface SecurityEvent {
  type: 'login_success' | 'login_failure' | 'logout' | 'session_expired' | 'suspicious_activity' | 'brute_force_attempt';
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId?: string;
  ipAddress: string;
  userAgent: string;
  details: Record<string, any>;
  timestamp: Date;
}

class AuthService {
  private static instance: AuthService;
  private activeSessions: Map<string, UserSession> = new Map();
  private failedAttempts: Map<string, { count: number; lastAttempt: Date; blockedUntil?: Date }> = new Map();

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Authenticate user with email and password
   */
  async authenticateUser(email: string, password: string, ipAddress: string, userAgent: string): Promise<AuthResult> {
    try {
      // Check if IP is blocked
      if (this.isIPBlocked(ipAddress)) {
        await this.logSecurityEvent({
          type: 'login_failure',
          severity: 'high',
          ipAddress,
          userAgent,
          timestamp: new Date(),
          details: { reason: 'IP blocked due to previous violations' }
        });
        return { success: false, error: 'Access temporarily blocked' };
      }

      // Authenticate with Supabase
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error || !user) {
        await this.handleFailedLogin(email, ipAddress, userAgent, error?.message);
        return { success: false, error: error?.message || 'Authentication failed' };
      }

      // Check if user account is active
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('is_active, mfa_enabled')
        .eq('id', user.id)
        .single();

      if (!profile?.is_active) {
        await this.logSecurityEvent({
          type: 'login_failure',
          severity: 'medium',
          userId: user.id,
          ipAddress,
          userAgent,
          timestamp: new Date(),
          details: { reason: 'Account deactivated' }
        });
        return { success: false, error: 'Account is deactivated' };
      }

      // Check MFA requirement
      if (profile.mfa_enabled) {
        return { success: false, requiresMFA: true, user };
      }

      // Create session
      const session = await this.createSession(user.id, ipAddress, userAgent);
      
      // Log successful login
      await this.logSecurityEvent({
        type: 'login_success',
        severity: 'low',
        userId: user.id,
        ipAddress,
        userAgent,
        timestamp: new Date(),
        details: { sessionId: session.id }
      });

      // Clear failed attempts
      this.clearFailedAttempts(ipAddress);

      return { success: true, user, session };

    } catch (error) {
      log.error('Authentication error', { error, email, ipAddress });
      return { success: false, error: 'Internal authentication error' };
    }
  }

  /**
   * Create JWT session for user
   */
  async createSession(userId: string, ipAddress: string, userAgent: string): Promise<UserSession> {
    const sessionId = crypto.randomUUID();
    const token = jwt.sign(
      { 
        userId, 
        sessionId, 
        type: 'access',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour
      },
      JWT_CONFIG.secret,
      { 
        issuer: JWT_CONFIG.issuer,
        audience: JWT_CONFIG.audience
      }
    );

    const refreshToken = jwt.sign(
      { 
        userId, 
        sessionId, 
        type: 'refresh',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
      },
      JWT_CONFIG.secret,
      { 
        issuer: JWT_CONFIG.issuer,
        audience: JWT_CONFIG.audience
      }
    );

    const session: UserSession = {
      id: sessionId,
      userId,
      token,
      refreshToken,
      expiresAt: new Date(Date.now() + SESSION_CONFIG.sessionTimeout),
      ipAddress,
      userAgent,
      isActive: true,
      lastActivity: new Date(),
      createdAt: new Date()
    };

    // Store session in database
    await supabase.from('user_sessions').insert({
      id: sessionId,
      user_id: userId,
      token: refreshToken, // Store refresh token
      refresh_token: refreshToken,
      expires_at: session.expiresAt,
      ip_address: ipAddress,
      user_agent: userAgent,
      is_active: true
    });

    // Store in memory for quick access
    this.activeSessions.set(sessionId, session);

    // Enforce session limits
    await this.enforceSessionLimits(userId);

    return session;
  }

  /**
   * Validate JWT token and return user session
   */
  async validateToken(token: string, ipAddress: string): Promise<AuthResult> {
    try {
      const decoded = jwt.verify(token, JWT_CONFIG.secret, {
        issuer: JWT_CONFIG.issuer,
        audience: JWT_CONFIG.audience
      }) as any;

      const session = this.activeSessions.get(decoded.sessionId);
      
      if (!session || !session.isActive) {
        await this.logSecurityEvent({
          type: 'session_expired',
          severity: 'medium',
          userId: decoded.userId,
          ipAddress,
          userAgent: session?.userAgent || 'unknown',
          timestamp: new Date(),
          details: { sessionId: decoded.sessionId, reason: 'Session not found or inactive' }
        });
        return { success: false, error: 'Invalid or expired session' };
      }

      // Check if session has expired
      if (session.expiresAt < new Date()) {
        await this.invalidateSession(decoded.sessionId);
        return { success: false, error: 'Session expired' };
      }

      // Update last activity
      session.lastActivity = new Date();
      this.activeSessions.set(decoded.sessionId, session);

      // Get user data
      const { data: user } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', decoded.userId)
        .single();

      return { success: true, user, session };

    } catch (error) {
      log.error('Token validation error', { error, ipAddress });
      return { success: false, error: 'Invalid token' };
    }
  }

  /**
   * Refresh JWT token
   */
  async refreshToken(refreshToken: string, ipAddress: string): Promise<AuthResult> {
    try {
      const decoded = jwt.verify(refreshToken, JWT_CONFIG.secret, {
        issuer: JWT_CONFIG.issuer,
        audience: JWT_CONFIG.audience
      }) as any;

      if (decoded.type !== 'refresh') {
        return { success: false, error: 'Invalid refresh token' };
      }

      const session = this.activeSessions.get(decoded.sessionId);
      
      if (!session || !session.isActive) {
        return { success: false, error: 'Invalid session' };
      }

      // Create new access token
      const newToken = jwt.sign(
        { 
          userId: decoded.userId, 
          sessionId: decoded.sessionId, 
          type: 'access',
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour
        },
        JWT_CONFIG.secret,
        { 
          issuer: JWT_CONFIG.issuer,
          audience: JWT_CONFIG.audience
        }
      );

      // Update session
      session.token = newToken;
      session.lastActivity = new Date();
      this.activeSessions.set(decoded.sessionId, session);

      return { success: true, session };

    } catch (error) {
      log.error('Token refresh error', { error, ipAddress });
      return { success: false, error: 'Invalid refresh token' };
    }
  }

  /**
   * Logout user and invalidate session
   */
  async logout(sessionId: string, ipAddress: string): Promise<void> {
    try {
      await this.invalidateSession(sessionId);
      
      await this.logSecurityEvent({
        type: 'logout',
        severity: 'low',
        ipAddress,
        userAgent: 'unknown',
        timestamp: new Date(),
        details: { sessionId }
      });
    } catch (error) {
      log.error('Logout error', { error, sessionId, ipAddress });
    }
  }

  /**
   * Invalidate session
   */
  private async invalidateSession(sessionId: string): Promise<void> {
    // Remove from memory
    this.activeSessions.delete(sessionId);

    // Update database
    await supabase
      .from('user_sessions')
      .update({ is_active: false })
      .eq('id', sessionId);
  }

  /**
   * Handle failed login attempts
   */
  private async handleFailedLogin(email: string, ipAddress: string, userAgent: string, reason: string): Promise<void> {
    const key = `${ipAddress}:${email}`;
    const attempts = this.failedAttempts.get(key) || { count: 0, lastAttempt: new Date() };
    
    attempts.count++;
    attempts.lastAttempt = new Date();

    // Block IP if threshold exceeded
    if (attempts.count >= SECURITY_MONITORING.blockThreshold) {
      attempts.blockedUntil = new Date(Date.now() + SECURITY_MONITORING.blockDuration);
      
      await this.logSecurityEvent({
        type: 'brute_force_attempt',
        severity: 'critical',
        ipAddress,
        userAgent,
        timestamp: new Date(),
        details: { 
          email,
          attempts: attempts.count,
          blockedUntil: attempts.blockedUntil
        }
      });
    }

    this.failedAttempts.set(key, attempts);

    // Alert if threshold exceeded
    if (attempts.count >= SECURITY_MONITORING.alertThreshold) {
      await this.logSecurityEvent({
        type: 'suspicious_activity',
        severity: 'high',
        ipAddress,
        userAgent,
        timestamp: new Date(),
        details: { 
          email,
          attempts: attempts.count,
          reason
        }
      });
    }
  }

  /**
   * Check if IP is blocked
   */
  private isIPBlocked(ipAddress: string): boolean {
    for (const [key, attempts] of this.failedAttempts.entries()) {
      if (key.startsWith(ipAddress) && attempts.blockedUntil && attempts.blockedUntil > new Date()) {
        return true;
      }
    }
    return false;
  }

  /**
   * Clear failed attempts for IP
   */
  private clearFailedAttempts(ipAddress: string): void {
    for (const key of this.failedAttempts.keys()) {
      if (key.startsWith(ipAddress)) {
        this.failedAttempts.delete(key);
      }
    }
  }

  /**
   * Enforce session limits per user
   */
  private async enforceSessionLimits(userId: string): Promise<void> {
    const userSessions = Array.from(this.activeSessions.values())
      .filter(session => session.userId === userId && session.isActive)
      .sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime());

    if (userSessions.length > SESSION_CONFIG.maxConcurrentSessions) {
      // Invalidate oldest sessions
      const sessionsToInvalidate = userSessions.slice(SESSION_CONFIG.maxConcurrentSessions);
      for (const session of sessionsToInvalidate) {
        await this.invalidateSession(session.id);
      }
    }
  }

  /**
   * Log security events to Wazuh/Falco
   */
  private async logSecurityEvent(event: SecurityEvent): Promise<void> {
    try {
      // Log to database
      await supabase.from('security_events').insert({
        type: event.type,
        severity: event.severity,
        source: 'auth_service',
        user_id: event.userId,
        ip_address: event.ipAddress,
        user_agent: event.userAgent,
        details: event.details
      });

      // Send to Wazuh if configured
      if (SECURITY_MONITORING.enabled && SECURITY_MONITORING.wazuhEndpoint) {
        await this.sendToWazuh(event);
      }

      // Send to Falco if configured
      if (SECURITY_MONITORING.enabled && SECURITY_MONITORING.falcoEndpoint) {
        await this.sendToFalco(event);
      }

      // Log locally
      log.info('Security event logged', { event });

    } catch (error) {
      log.error('Failed to log security event', { error, event });
    }
  }

  /**
   * Send security event to Wazuh
   */
  private async sendToWazuh(event: SecurityEvent): Promise<void> {
    try {
      const response = await fetch(SECURITY_MONITORING.wazuhEndpoint!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: event.type,
          severity: event.severity,
          source: 'synapses-grc-auth',
          timestamp: event.timestamp.toISOString(),
          data: event
        })
      });

      if (!response.ok) {
        throw new Error(`Wazuh API error: ${response.status}`);
      }
    } catch (error) {
      log.error('Failed to send event to Wazuh', { error, event });
    }
  }

  /**
   * Send security event to Falco
   */
  private async sendToFalco(event: SecurityEvent): Promise<void> {
    try {
      const response = await fetch(SECURITY_MONITORING.falcoEndpoint!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rule: `auth_${event.type}`,
          priority: event.severity.toUpperCase(),
          output: `Security event: ${event.type} from ${event.ipAddress}`,
          output_fields: event.details,
          time: event.timestamp.toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`Falco API error: ${response.status}`);
      }
    } catch (error) {
      log.error('Failed to send event to Falco', { error, event });
    }
  }

  /**
   * Cleanup expired sessions and failed attempts
   */
  async cleanup(): Promise<void> {
    try {
      // Cleanup expired sessions
      const now = new Date();
      for (const [sessionId, session] of this.activeSessions.entries()) {
        if (session.expiresAt < now) {
          await this.invalidateSession(sessionId);
        }
      }

      // Cleanup old failed attempts
      const cleanupTime = new Date(Date.now() - (24 * 60 * 60 * 1000)); // 24 hours
      for (const [key, attempts] of this.failedAttempts.entries()) {
        if (attempts.lastAttempt < cleanupTime && !attempts.blockedUntil) {
          this.failedAttempts.delete(key);
        }
      }
    } catch (error) {
      log.error('Cleanup error', { error });
    }
  }

  /**
   * Get active sessions for user (debug/admin only)
   */
  async getActiveSessions(userId: string): Promise<UserSession[]> {
    return Array.from(this.activeSessions.values())
      .filter(session => session.userId === userId && session.isActive);
  }

  /**
   * Get security statistics (debug/admin only)
   */
  async getSecurityStats(): Promise<{
    activeSessions: number;
    failedAttempts: number;
    blockedIPs: number;
  }> {
    const blockedIPs = Array.from(this.failedAttempts.values())
      .filter(attempts => attempts.blockedUntil && attempts.blockedUntil > new Date()).length;

    return {
      activeSessions: this.activeSessions.size,
      failedAttempts: this.failedAttempts.size,
      blockedIPs
    };
  }
}

export const authService = AuthService.getInstance();

// Start cleanup interval
setInterval(() => {
  authService.cleanup();
}, SESSION_CONFIG.cleanupInterval);
