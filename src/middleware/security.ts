/**
 * Security Middleware for API Protection
 * Implements comprehensive security controls for all API endpoints
 * Part of Phase 2: Security Infrastructure (Week 4)
 */

import type { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import { createHash, randomBytes } from 'crypto';
import { SecurityMonitoring, SecurityEventType } from '../lib/monitoring';
import { AuthService } from '../lib/auth';

// Types for security middleware
interface SecurityConfig {
  rateLimit: {
    windowMs: number;
    max: number;
    skipSuccessfulRequests?: boolean;
  };
  cors: {
    origin: string[];
    credentials: boolean;
    optionsSuccessStatus: number;
  };
  helmet: {
    contentSecurityPolicy: boolean;
    crossOriginEmbedderPolicy: boolean;
  };
  authentication: {
    required: boolean;
    roles?: string[];
    permissions?: string[];
  };
}

interface SecurityContext {
  userId?: string;
  sessionId?: string;
  ipAddress: string;
  userAgent?: string;
  requestId: string;
  timestamp: Date;
}

interface ThreatDetectionResult {
  isThreat: boolean;
  threatType?: string;
  riskScore: number;
  action: 'allow' | 'block' | 'monitor' | 'challenge';
  reason?: string;
}

/**
 * Main Security Middleware Class
 * Provides comprehensive API security controls
 */
import { getSupabase } from '../integrations/supabase/client';

export class SecurityMiddleware {
  private static get supabase() {
    return getSupabase();
  }

  private static blockedIPs: Set<string> = new Set();
  private static suspiciousIPs: Map<string, number> = new Map();
  private static rateLimitStore: Map<string, { count: number; resetTime: number }> = new Map();

  /**
   * Initialize security middleware with configuration
   * @param config - Security configuration
   */
  static initialize(config?: Partial<SecurityConfig>) {
    const defaultConfig: SecurityConfig = {
      rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
        skipSuccessfulRequests: false
      },
      cors: {
        origin: [
          'https://synapses.app',
          'https://www.synapses.app',
          'https://app.synapses.com',
          'http://localhost:3000',
          'http://localhost:8080'
        ],
        credentials: true,
        optionsSuccessStatus: 200
      },
      helmet: {
        contentSecurityPolicy: true,
        crossOriginEmbedderPolicy: false
      },
      authentication: {
        required: true
      }
    };

    const finalConfig = { ...defaultConfig, ...config };

    // Load blocked IPs from database
    this.loadBlockedIPs();

    // Start cleanup interval
    setInterval(
      () => {
        this.cleanupRateLimitStore();
        this.cleanupSuspiciousIPs();
      },
      5 * 60 * 1000
    ); // Every 5 minutes

    console.log('Security middleware initialized with config:', finalConfig);
  }

  /**
   * Main security middleware function
   * @param config - Optional security configuration override
   */
  static createSecurityMiddleware(config?: Partial<SecurityConfig>) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        // Create security context
        const context = this.createSecurityContext(req);

        // Add security headers
        this.addSecurityHeaders(res);

        // Check IP blocklist
        if (await this.isIPBlocked(context.ipAddress)) {
          await this.logSecurityEvent(
            SecurityEventType.UNAUTHORIZED_API_ACCESS,
            'middleware',
            { reason: 'Blocked IP address', endpoint: req.path },
            undefined,
            context.ipAddress,
            context.userAgent
          );
          return res.status(403).json({ error: 'Access denied' });
        }

        // Threat detection
        const threatResult = await this.detectThreats(req, context);
        if (threatResult.isThreat && threatResult.action === 'block') {
          await this.handleThreatDetection(req, context, threatResult);
          return res.status(403).json({ error: 'Security threat detected' });
        }

        // Rate limiting
        const rateLimitResult = await this.checkRateLimit(context.ipAddress, req.path);
        if (!rateLimitResult.allowed) {
          await this.logSecurityEvent(
            SecurityEventType.RATE_LIMIT_EXCEEDED,
            'middleware',
            {
              endpoint: req.path,
              limit: rateLimitResult.limit,
              current: rateLimitResult.current
            },
            undefined,
            context.ipAddress,
            context.userAgent
          );
          return res.status(429).json({
            error: 'Rate limit exceeded',
            retryAfter: rateLimitResult.retryAfter
          });
        }

        // Input validation and sanitization
        await this.validateAndSanitizeInput(req);

        // Authentication check (if required)
        if (config?.authentication?.required !== false) {
          const authResult = await this.authenticateRequest(req, config?.authentication);
          if (!authResult.success) {
            await this.logSecurityEvent(
              SecurityEventType.UNAUTHORIZED_API_ACCESS,
              'middleware',
              { reason: authResult.reason, endpoint: req.path },
              undefined,
              context.ipAddress,
              context.userAgent
            );
            return res.status(401).json({ error: authResult.reason });
          }

          // Add user context to request
          (req as any).user = authResult.user;
          (req as any).session = authResult.session;
        }

        // Log successful request
        await this.logSecurityEvent(
          SecurityEventType.DATA_ACCESS,
          'api',
          {
            endpoint: req.path,
            method: req.method,
            success: true
          },
          (req as any).user?.id,
          context.ipAddress,
          context.userAgent
        );

        // Add security context to request
        (req as any).securityContext = context;

        next();
      } catch (error) {
        console.error('Security middleware error:', error);
        await this.logSecurityEvent(
          SecurityEventType.SUSPICIOUS_ACTIVITY,
          'middleware',
          { error: error.message, endpoint: req.path },
          undefined,
          req.ip,
          req.get('User-Agent')
        );
        res.status(500).json({ error: 'Internal security error' });
      }
    };
  }

  /**
   * Create CORS middleware with security configuration
   */
  static createCORSMiddleware(config?: SecurityConfig['cors']) {
    const corsConfig = config || {
      origin: ['https://synapses.app', 'http://localhost:3000'],
      credentials: true,
      optionsSuccessStatus: 200
    };

    return cors({
      ...corsConfig,
      origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, etc.)
        if (!origin) {
          return callback(null, true);
        }

        if (corsConfig.origin.includes(origin)) {
          return callback(null, true);
        }

        // Log suspicious CORS request
        this.logSecurityEvent(SecurityEventType.SUSPICIOUS_ACTIVITY, 'cors', {
          origin,
          reason: 'Unauthorized origin'
        });

        return callback(new Error('Not allowed by CORS'), false);
      }
    });
  }

  /**
   * Create Helmet middleware for security headers
   */
  static createHelmetMiddleware(config?: SecurityConfig['helmet']) {
    return helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],
          imgSrc: ["'self'", 'data:', 'https:'],
          scriptSrc: ["'self'"],
          connectSrc: ["'self'", 'https://api.synapses.app'],
          frameSrc: ["'none'"],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: []
        }
      },
      crossOriginEmbedderPolicy: config?.crossOriginEmbedderPolicy ?? false,
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
      }
    });
  }

  /**
   * Create rate limiting middleware
   */
  static createRateLimitMiddleware(config?: SecurityConfig['rateLimit']) {
    const rateLimitConfig = config || {
      windowMs: 15 * 60 * 1000,
      max: 100
    };

    return rateLimit({
      ...rateLimitConfig,
      handler: async (req, res) => {
        await this.logSecurityEvent(
          SecurityEventType.RATE_LIMIT_EXCEEDED,
          'rate_limiter',
          { endpoint: req.path, ip: req.ip },
          undefined,
          req.ip,
          req.get('User-Agent')
        );

        res.status(429).json({
          error: 'Too many requests',
          retryAfter: Math.round(rateLimitConfig.windowMs / 1000)
        });
      },
      skip: req => {
        // Skip rate limiting for health checks
        return req.path === '/health' || req.path === '/api/health';
      }
    });
  }

  /**
   * Create security context from request
   */
  private static createSecurityContext(req: Request): SecurityContext {
    return {
      ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
      userAgent: req.get('User-Agent'),
      requestId: randomBytes(16).toString('hex'),
      timestamp: new Date()
    };
  }

  /**
   * Add security headers to response
   */
  private static addSecurityHeaders(res: Response): void {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  }

  /**
   * Check if IP address is blocked
   */
  private static async isIPBlocked(ipAddress: string): Promise<boolean> {
    // Check in-memory cache first
    if (this.blockedIPs.has(ipAddress)) {
      return true;
    }

    // Check database
    try {
      const { data } = await this.supabase
        .from('ip_blocklist')
        .select('id')
        .eq('ip_address', ipAddress)
        .eq('is_active', true)
        .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
        .single();

      if (data) {
        this.blockedIPs.add(ipAddress);
        return true;
      }
    } catch (error) {
      console.error('Error checking IP blocklist:', error);
    }

    return false;
  }

  /**
   * Detect security threats in request
   */
  private static async detectThreats(
    req: Request,
    context: SecurityContext
  ): Promise<ThreatDetectionResult> {
    let riskScore = 0;
    const threats: string[] = [];

    // Check for SQL injection patterns
    if (this.detectSQLInjection(req)) {
      threats.push('SQL injection attempt');
      riskScore += 0.8;
    }

    // Check for XSS patterns
    if (this.detectXSS(req)) {
      threats.push('XSS attempt');
      riskScore += 0.7;
    }

    // Check for suspicious user agents
    if (this.detectSuspiciousUserAgent(context.userAgent)) {
      threats.push('Suspicious user agent');
      riskScore += 0.5;
    }

    // Check for path traversal
    if (this.detectPathTraversal(req)) {
      threats.push('Path traversal attempt');
      riskScore += 0.6;
    }

    // Check for command injection
    if (this.detectCommandInjection(req)) {
      threats.push('Command injection attempt');
      riskScore += 0.9;
    }

    const isThreat = riskScore > 0.5;
    const action = riskScore > 0.8 ? 'block' : riskScore > 0.5 ? 'monitor' : 'allow';

    return {
      isThreat,
      threatType: threats.join(', '),
      riskScore,
      action,
      reason: threats.length > 0 ? threats.join(', ') : undefined
    };
  }

  /**
   * Detect SQL injection patterns
   */
  private static detectSQLInjection(req: Request): boolean {
    const sqlPatterns = [
      /('|(\-\-)|(;)|(\||\|)|(\*|\*))/i,
      /(union|select|insert|delete|update|drop|create|alter|exec|execute)/i,
      /(script|javascript|vbscript|onload|onerror|onclick)/i
    ];

    const checkString = JSON.stringify(req.query) + JSON.stringify(req.body) + req.url;
    return sqlPatterns.some(pattern => pattern.test(checkString));
  }

  /**
   * Detect XSS patterns
   */
  private static detectXSS(req: Request): boolean {
    const xssPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /<iframe[^>]*>.*?<\/iframe>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<img[^>]+src[\s]*=[\s]*["']?[\s]*javascript:/gi
    ];

    const checkString = JSON.stringify(req.query) + JSON.stringify(req.body) + req.url;
    return xssPatterns.some(pattern => pattern.test(checkString));
  }

  /**
   * Detect suspicious user agents
   */
  private static detectSuspiciousUserAgent(userAgent?: string): boolean {
    if (!userAgent) {
      return true;
    } // No user agent is suspicious

    const suspiciousPatterns = [
      /bot|crawler|spider|scraper/i,
      /curl|wget|python|java|go-http/i,
      /scanner|exploit|hack|attack/i
    ];

    return suspiciousPatterns.some(pattern => pattern.test(userAgent));
  }

  /**
   * Detect path traversal attempts
   */
  private static detectPathTraversal(req: Request): boolean {
    const pathTraversalPatterns = [
      new RegExp('\\.\\.\\/', 'g'),
      new RegExp('\\.\\.\\\\', 'g'),
      /%2e%2e%2f/gi,
      /%2e%2e%5c/gi
    ];

    return pathTraversalPatterns.some(pattern => pattern.test(req.url));
  }

  /**
   * Detect command injection attempts
   */
  private static detectCommandInjection(req: Request): boolean {
    const commandPatterns = [
      /[;&|`$(){}\[\]]/,
      /(cat|ls|pwd|whoami|id|uname|ps|netstat|ifconfig)/i,
      /(rm|mv|cp|chmod|chown|kill|killall)/i
    ];

    const checkString = JSON.stringify(req.query) + JSON.stringify(req.body);
    return commandPatterns.some(pattern => pattern.test(checkString));
  }

  /**
   * Handle threat detection
   */
  private static async handleThreatDetection(
    req: Request,
    context: SecurityContext,
    threatResult: ThreatDetectionResult
  ): Promise<void> {
    // Log the threat
    await this.logSecurityEvent(
      SecurityEventType.SUSPICIOUS_ACTIVITY,
      'threat_detection',
      {
        threatType: threatResult.threatType,
        riskScore: threatResult.riskScore,
        endpoint: req.path,
        method: req.method,
        action: threatResult.action
      },
      undefined,
      context.ipAddress,
      context.userAgent
    );

    // Add to suspicious IPs
    const currentScore = this.suspiciousIPs.get(context.ipAddress) || 0;
    this.suspiciousIPs.set(context.ipAddress, currentScore + threatResult.riskScore);

    // Block IP if risk score is too high
    if (currentScore + threatResult.riskScore > 2.0) {
      await this.blockIP(context.ipAddress, 'Automated threat detection');
    }
  }

  /**
   * Check rate limiting
   */
  private static async checkRateLimit(
    ipAddress: string,
    endpoint: string
  ): Promise<{
    allowed: boolean;
    limit: number;
    current: number;
    retryAfter?: number;
  }> {
    const key = `${ipAddress}:${endpoint}`;
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutes
    const limit = 100;

    const existing = this.rateLimitStore.get(key);

    if (!existing || now > existing.resetTime) {
      // New window
      this.rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      return { allowed: true, limit, current: 1 };
    }

    existing.count += 1;

    if (existing.count > limit) {
      return {
        allowed: false,
        limit,
        current: existing.count,
        retryAfter: Math.round((existing.resetTime - now) / 1000)
      };
    }

    return { allowed: true, limit, current: existing.count };
  }

  /**
   * Validate and sanitize input
   */
  private static async validateAndSanitizeInput(req: Request): Promise<void> {
    // Sanitize query parameters
    if (req.query) {
      for (const [key, value] of Object.entries(req.query)) {
        if (typeof value === 'string') {
          req.query[key] = this.sanitizeString(value);
        }
      }
    }

    // Sanitize body parameters
    if (req.body && typeof req.body === 'object') {
      this.sanitizeObject(req.body);
    }
  }

  /**
   * Sanitize string input
   */
  private static sanitizeString(input: string): string {
    return input
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  }

  /**
   * Sanitize object recursively
   */
  private static sanitizeObject(obj: any): void {
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        obj[key] = this.sanitizeString(value);
      } else if (typeof value === 'object' && value !== null) {
        this.sanitizeObject(value);
      }
    }
  }

  /**
   * Authenticate request
   */
  private static async authenticateRequest(
    req: Request,
    authConfig?: SecurityConfig['authentication']
  ): Promise<{
    success: boolean;
    user?: any;
    session?: any;
    reason?: string;
  }> {
    try {
      const token = this.extractToken(req);
      if (!token) {
        return { success: false, reason: 'No authentication token provided' };
      }

      const { user, session } = await AuthService.validateSession(token);
      if (!user || !session) {
        return { success: false, reason: 'Invalid or expired token' };
      }

      // Check role requirements
      if (authConfig?.roles && authConfig.roles.length > 0) {
        if (!authConfig.roles.includes(user.role)) {
          return { success: false, reason: 'Insufficient role permissions' };
        }
      }

      // Check permission requirements
      if (authConfig?.permissions && authConfig.permissions.length > 0) {
        const hasPermissions = await AuthService.checkPermissions(user.id, authConfig.permissions);
        if (!hasPermissions) {
          return { success: false, reason: 'Insufficient permissions' };
        }
      }

      return { success: true, user, session };
    } catch (error) {
      return { success: false, reason: 'Authentication error' };
    }
  }

  /**
   * Extract authentication token from request
   */
  private static extractToken(req: Request): string | null {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    // Check for token in cookies
    const cookieToken = req.cookies?.auth_token;
    if (cookieToken) {
      return cookieToken;
    }

    return null;
  }

  /**
   * Block IP address
   */
  private static async blockIP(ipAddress: string, reason: string): Promise<void> {
    try {
      await this.supabase.from('ip_blocklist').insert({
        ip_address: ipAddress,
        reason,
        blocked_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        is_active: true
      });

      this.blockedIPs.add(ipAddress);
      console.log(`Blocked IP address: ${ipAddress} - ${reason}`);
    } catch (error) {
      console.error('Failed to block IP address:', error);
    }
  }

  /**
   * Load blocked IPs from database
   */
  private static async loadBlockedIPs(): Promise<void> {
    try {
      const { data } = await this.supabase
        .from('ip_blocklist')
        .select('ip_address')
        .eq('is_active', true)
        .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`);

      if (data) {
        data.forEach(row => this.blockedIPs.add(row.ip_address));
        console.log(`Loaded ${data.length} blocked IP addresses`);
      }
    } catch (error) {
      console.error('Failed to load blocked IPs:', error);
    }
  }

  /**
   * Log security event
   */
  private static async logSecurityEvent(
    eventType: SecurityEventType,
    source: string,
    details: Record<string, any>,
    userId?: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    try {
      await SecurityMonitoring.logSecurityEvent(
        eventType,
        source,
        details,
        userId,
        ipAddress || 'unknown',
        userAgent
      );
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }

  /**
   * Cleanup rate limit store
   */
  private static cleanupRateLimitStore(): void {
    const now = Date.now();
    for (const [key, value] of this.rateLimitStore.entries()) {
      if (now > value.resetTime) {
        this.rateLimitStore.delete(key);
      }
    }
  }

  /**
   * Cleanup suspicious IPs
   */
  private static cleanupSuspiciousIPs(): void {
    // Decay suspicious IP scores over time
    for (const [ip, score] of this.suspiciousIPs.entries()) {
      const newScore = score * 0.9; // 10% decay
      if (newScore < 0.1) {
        this.suspiciousIPs.delete(ip);
      } else {
        this.suspiciousIPs.set(ip, newScore);
      }
    }
  }
}

// Export middleware functions for easy use
export const securityMiddleware = SecurityMiddleware.createSecurityMiddleware();
export const corsMiddleware = SecurityMiddleware.createCORSMiddleware();
export const helmetMiddleware = SecurityMiddleware.createHelmetMiddleware();
export const rateLimitMiddleware = SecurityMiddleware.createRateLimitMiddleware();

// Export types
export { SecurityConfig, SecurityContext, ThreatDetectionResult };
