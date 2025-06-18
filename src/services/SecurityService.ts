import { createClient } from '@supabase/supabase-js';
import CryptoJS from 'crypto-js';

// Security configuration
interface SecurityConfig {
  encryptionKey: string;
  sessionTimeout: number;
  maxLoginAttempts: number;
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
  };
}

// Audit log entry
interface AuditLogEntry {
  id: string;
  userId: string;
  action: string;
  resource: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, any>;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

// Security incident
interface SecurityIncident {
  id: string;
  type: 'unauthorized_access' | 'data_breach' | 'suspicious_activity' | 'policy_violation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  userId?: string;
  timestamp: Date;
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  metadata?: Record<string, any>;
}

// Data classification
interface DataClassification {
  level: 'public' | 'internal' | 'confidential' | 'restricted';
  retention: number; // days
  encryption: boolean;
  accessControl: string[];
}

class SecurityService {
  private config: SecurityConfig;
  private supabase: any;
  private auditLogs: AuditLogEntry[] = [];
  private securityIncidents: SecurityIncident[] = [];
  private loginAttempts: Map<string, number> = new Map();

  constructor() {
    this.config = {
      encryptionKey: process.env.VITE_ENCRYPTION_KEY || 'default-key-change-in-production',
      sessionTimeout: 30 * 60 * 1000, // 30 minutes
      maxLoginAttempts: 5,
      passwordPolicy: {
        minLength: 12,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
      },
    };

    // Initialize Supabase client if available
    if (process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_ANON_KEY) {
      this.supabase = createClient(
        process.env.VITE_SUPABASE_URL,
        process.env.VITE_SUPABASE_ANON_KEY
      );
    }
  }

  // Data Encryption/Decryption
  encryptData(data: string): string {
    try {
      return CryptoJS.AES.encrypt(data, this.config.encryptionKey).toString();
    } catch (error) {
      this.logSecurityIncident({
        type: 'policy_violation',
        severity: 'high',
        description: 'Encryption failed',
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
      });
      throw new Error('Encryption failed');
    }
  }

  decryptData(encryptedData: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.config.encryptionKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      this.logSecurityIncident({
        type: 'policy_violation',
        severity: 'high',
        description: 'Decryption failed',
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
      });
      throw new Error('Decryption failed');
    }
  }

  // Password Security
  validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const policy = this.config.passwordPolicy;

    if (password.length < policy.minLength) {
      errors.push(`Password must be at least ${policy.minLength} characters long`);
    }

    if (policy.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (policy.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (policy.requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (policy.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  hashPassword(password: string): string {
    return CryptoJS.SHA256(password + this.config.encryptionKey).toString();
  }

  // Session Management
  createSecureSession(userId: string): string {
    const sessionData = {
      userId,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.config.sessionTimeout,
      sessionId: this.generateSecureId(),
    };

    const sessionToken = this.encryptData(JSON.stringify(sessionData));
    
    this.logAuditEvent({
      userId,
      action: 'session_created',
      resource: 'authentication',
      riskLevel: 'low',
    });

    return sessionToken;
  }

  validateSession(sessionToken: string): { isValid: boolean; userId?: string } {
    try {
      const decryptedData = this.decryptData(sessionToken);
      const sessionData = JSON.parse(decryptedData);

      if (Date.now() > sessionData.expiresAt) {
        this.logAuditEvent({
          userId: sessionData.userId,
          action: 'session_expired',
          resource: 'authentication',
          riskLevel: 'low',
        });
        return { isValid: false };
      }

      return { isValid: true, userId: sessionData.userId };
    } catch (error) {
      this.logSecurityIncident({
        type: 'unauthorized_access',
        severity: 'medium',
        description: 'Invalid session token',
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
      });
      return { isValid: false };
    }
  }

  // Login Attempt Tracking
  recordLoginAttempt(identifier: string, success: boolean): boolean {
    const attempts = this.loginAttempts.get(identifier) || 0;

    if (success) {
      this.loginAttempts.delete(identifier);
      return true;
    }

    const newAttempts = attempts + 1;
    this.loginAttempts.set(identifier, newAttempts);

    if (newAttempts >= this.config.maxLoginAttempts) {
      this.logSecurityIncident({
        type: 'suspicious_activity',
        severity: 'high',
        description: `Maximum login attempts exceeded for ${identifier}`,
        metadata: { identifier, attempts: newAttempts },
      });
      return false;
    }

    return true;
  }

  isAccountLocked(identifier: string): boolean {
    const attempts = this.loginAttempts.get(identifier) || 0;
    return attempts >= this.config.maxLoginAttempts;
  }

  // Data Classification
  classifyData(data: any, classification: DataClassification): string {
    const classifiedData = {
      data: classification.encryption ? this.encryptData(JSON.stringify(data)) : data,
      classification,
      timestamp: new Date().toISOString(),
      id: this.generateSecureId(),
    };

    this.logAuditEvent({
      userId: 'system',
      action: 'data_classified',
      resource: 'data_management',
      riskLevel: classification.level === 'restricted' ? 'high' : 'low',
      details: { classification: classification.level },
    });

    return JSON.stringify(classifiedData);
  }

  // Audit Logging
  logAuditEvent(event: Omit<AuditLogEntry, 'id' | 'timestamp'>): void {
    const auditEntry: AuditLogEntry = {
      ...event,
      id: this.generateSecureId(),
      timestamp: new Date(),
    };

    this.auditLogs.push(auditEntry);

    // In production, send to secure logging service
    if (this.supabase) {
      this.supabase
        .from('audit_logs')
        .insert(auditEntry)
        .catch((error: any) => console.error('Failed to log audit event:', error));
    }
  }

  // Security Incident Management
  logSecurityIncident(incident: Omit<SecurityIncident, 'id' | 'timestamp' | 'status'>): void {
    const securityIncident: SecurityIncident = {
      ...incident,
      id: this.generateSecureId(),
      timestamp: new Date(),
      status: 'open',
    };

    this.securityIncidents.push(securityIncident);

    // Alert security team for high/critical incidents
    if (incident.severity === 'high' || incident.severity === 'critical') {
      this.alertSecurityTeam(securityIncident);
    }

    // Store in database
    if (this.supabase) {
      this.supabase
        .from('security_incidents')
        .insert(securityIncident)
        .catch((error: any) => console.error('Failed to log security incident:', error));
    }
  }

  // Security Monitoring
  detectAnomalousActivity(userId: string, activity: any): boolean {
    // Implement anomaly detection logic
    const riskFactors = [
      activity.unusualLocation,
      activity.unusualTime,
      activity.multipleFailedAttempts,
      activity.suspiciousUserAgent,
    ].filter(Boolean);

    if (riskFactors.length >= 2) {
      this.logSecurityIncident({
        type: 'suspicious_activity',
        severity: 'medium',
        description: 'Anomalous activity detected',
        userId,
        metadata: { activity, riskFactors },
      });
      return true;
    }

    return false;
  }

  // Compliance Reporting
  generateComplianceReport(startDate: Date, endDate: Date): any {
    const relevantLogs = this.auditLogs.filter(
      log => log.timestamp >= startDate && log.timestamp <= endDate
    );

    const relevantIncidents = this.securityIncidents.filter(
      incident => incident.timestamp >= startDate && incident.timestamp <= endDate
    );

    return {
      period: { startDate, endDate },
      auditLogs: relevantLogs,
      securityIncidents: relevantIncidents,
      summary: {
        totalAuditEvents: relevantLogs.length,
        totalIncidents: relevantIncidents.length,
        criticalIncidents: relevantIncidents.filter(i => i.severity === 'critical').length,
        highRiskEvents: relevantLogs.filter(l => l.riskLevel === 'high').length,
      },
      generatedAt: new Date().toISOString(),
    };
  }

  // Utility Methods
  private generateSecureId(): string {
    return CryptoJS.lib.WordArray.random(16).toString();
  }

  private alertSecurityTeam(incident: SecurityIncident): void {
    // In production, integrate with alerting system (email, Slack, PagerDuty, etc.)
    console.warn('SECURITY ALERT:', incident);
  }

  // Public getters for monitoring
  getAuditLogs(limit: number = 100): AuditLogEntry[] {
    return this.auditLogs.slice(-limit);
  }

  getSecurityIncidents(limit: number = 50): SecurityIncident[] {
    return this.securityIncidents.slice(-limit);
  }

  getSecurityMetrics(): any {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const recentLogs = this.auditLogs.filter(log => log.timestamp >= last24Hours);
    const recentIncidents = this.securityIncidents.filter(incident => incident.timestamp >= last24Hours);

    return {
      auditEvents24h: recentLogs.length,
      securityIncidents24h: recentIncidents.length,
      criticalIncidents24h: recentIncidents.filter(i => i.severity === 'critical').length,
      activeLoginAttempts: this.loginAttempts.size,
      lockedAccounts: Array.from(this.loginAttempts.entries()).filter(([, attempts]) => attempts >= this.config.maxLoginAttempts).length,
    };
  }
}

export const securityService = new SecurityService();
export default SecurityService;
export type { SecurityConfig, AuditLogEntry, SecurityIncident, DataClassification };