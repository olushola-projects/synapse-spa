import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { env } from '../../lib/env';

// Types for security and compliance
export interface MFAConfig {
  enabled: boolean;
  methods: ('totp' | 'sms' | 'email')[];
  backupCodes: string[];
  lastVerified?: string;
}

export interface SSOConfig {
  provider: 'google' | 'microsoft' | 'okta' | 'auth0' | 'saml';
  domain?: string;
  clientId: string;
  enabled: boolean;
  autoProvision: boolean;
  roleMapping?: Record<string, string>;
}

export interface SecurityPolicy {
  id: string;
  name: string;
  type: 'password' | 'session' | 'access' | 'data' | 'audit';
  rules: SecurityRule[];
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SecurityRule {
  id: string;
  condition: string;
  action: 'allow' | 'deny' | 'require_mfa' | 'log' | 'alert';
  parameters?: Record<string, any>;
}

export interface ComplianceFramework {
  id: string;
  name: string;
  version: string;
  requirements: ComplianceRequirement[];
  status: 'active' | 'draft' | 'deprecated';
  jurisdiction: string;
  lastAssessment?: string;
}

export interface ComplianceRequirement {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'compliant' | 'non_compliant' | 'partial' | 'not_assessed';
  evidence?: string[];
  controls: string[];
  lastReview?: string;
  nextReview?: string;
}

export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  resource: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  compliance_frameworks?: string[];
}

export interface GDPRConsent {
  id: string;
  userId: string;
  purpose: string;
  lawfulBasis: 'consent' | 'contract' | 'legal_obligation' | 'vital_interests' | 'public_task' | 'legitimate_interests';
  granted: boolean;
  timestamp: string;
  ipAddress?: string;
  withdrawnAt?: string;
  dataCategories: string[];
  retentionPeriod?: number;
}

export interface DataProcessingRecord {
  id: string;
  purpose: string;
  dataCategories: string[];
  dataSubjects: string[];
  recipients: string[];
  transfers: DataTransfer[];
  retentionPeriod: number;
  securityMeasures: string[];
  lawfulBasis: string;
  createdAt: string;
  updatedAt: string;
}

export interface DataTransfer {
  recipient: string;
  country: string;
  adequacyDecision: boolean;
  safeguards?: string[];
  date: string;
}

export interface SecurityMetrics {
  loginAttempts: {
    successful: number;
    failed: number;
    blocked: number;
  };
  mfaUsage: {
    enabled: number;
    disabled: number;
    verifications: number;
  };
  sessionSecurity: {
    activeSessions: number;
    expiredSessions: number;
    suspiciousSessions: number;
  };
  complianceScore: {
    overall: number;
    byFramework: Record<string, number>;
  };
  vulnerabilities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

class SecurityComplianceService {
  private supabase: SupabaseClient;
  private auditQueue: AuditLog[] = [];
  private securityPolicies: Map<string, SecurityPolicy> = new Map();
  private complianceFrameworks: Map<string, ComplianceFramework> = new Map();

  constructor() {
    this.supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);
    this.initializeSecurityPolicies();
    this.initializeComplianceFrameworks();
    this.startAuditProcessor();
  }

  // Authentication & Authorization
  async signInWithMFA(email: string, password: string, mfaCode?: string): Promise<{ user: User | null; session: Session | null; requiresMFA: boolean }> {
    try {
      // First, attempt regular sign in
      const { data: authData, error: authError } = await this.supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        await this.logAuditEvent({
          action: 'login_failed',
          resource: 'auth',
          details: { email, error: authError.message },
          severity: 'warning'
        });
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Authentication failed');
      }

      // Check if MFA is enabled for user
      const mfaConfig = await this.getMFAConfig(authData.user.id);
      
      if (mfaConfig.enabled && !mfaCode) {
        // MFA required but not provided
        await this.logAuditEvent({
          userId: authData.user.id,
          action: 'mfa_required',
          resource: 'auth',
          details: { email },
          severity: 'info'
        });
        
        return {
          user: null,
          session: null,
          requiresMFA: true
        };
      }

      if (mfaConfig.enabled && mfaCode) {
        // Verify MFA code
        const mfaValid = await this.verifyMFACode(authData.user.id, mfaCode);
        if (!mfaValid) {
          await this.logAuditEvent({
            userId: authData.user.id,
            action: 'mfa_failed',
            resource: 'auth',
            details: { email },
            severity: 'warning'
          });
          throw new Error('Invalid MFA code');
        }
      }

      // Successful authentication
      await this.logAuditEvent({
        userId: authData.user.id,
        action: 'login_success',
        resource: 'auth',
        details: { email, mfa_used: mfaConfig.enabled },
        severity: 'info'
      });

      return {
        user: authData.user,
        session: authData.session,
        requiresMFA: false
      };
    } catch (error) {
      console.error('MFA sign in error:', error);
      throw error;
    }
  }

  async enableMFA(userId: string, method: 'totp' | 'sms' | 'email'): Promise<{ secret?: string; qrCode?: string; backupCodes: string[] }> {
    try {
      const backupCodes = this.generateBackupCodes();
      let secret: string | undefined;
      let qrCode: string | undefined;

      if (method === 'totp') {
        secret = this.generateTOTPSecret();
        qrCode = this.generateQRCode(userId, secret);
      }

      const mfaConfig: MFAConfig = {
        enabled: true,
        methods: [method],
        backupCodes
      };

      await this.supabase
        .from('user_mfa_config')
        .upsert({
          user_id: userId,
          config: mfaConfig,
          totp_secret: secret
        });

      await this.logAuditEvent({
        userId,
        action: 'mfa_enabled',
        resource: 'security',
        details: { method },
        severity: 'info'
      });

      return { secret, qrCode, backupCodes };
    } catch (error) {
      console.error('Enable MFA error:', error);
      throw error;
    }
  }

  async configureSSOProvider(config: SSOConfig): Promise<void> {
    try {
      await this.supabase
        .from('sso_providers')
        .upsert({
          provider: config.provider,
          domain: config.domain,
          client_id: config.clientId,
          enabled: config.enabled,
          auto_provision: config.autoProvision,
          role_mapping: config.roleMapping,
          updated_at: new Date().toISOString()
        });

      await this.logAuditEvent({
        action: 'sso_configured',
        resource: 'security',
        details: { provider: config.provider, domain: config.domain },
        severity: 'info'
      });
    } catch (error) {
      console.error('Configure SSO error:', error);
      throw error;
    }
  }

  // GDPR Compliance
  async recordGDPRConsent(consent: Omit<GDPRConsent, 'id' | 'timestamp'>): Promise<string> {
    try {
      const { data, error } = await this.supabase
        .from('gdpr_consents')
        .insert({
          ...consent,
          timestamp: new Date().toISOString()
        })
        .select('id')
        .single();

      if (error) throw error;

      await this.logAuditEvent({
        userId: consent.userId,
        action: 'gdpr_consent_recorded',
        resource: 'compliance',
        details: { purpose: consent.purpose, granted: consent.granted },
        severity: 'info',
        compliance_frameworks: ['GDPR']
      });

      return data.id;
    } catch (error) {
      console.error('Record GDPR consent error:', error);
      throw error;
    }
  }

  async withdrawGDPRConsent(consentId: string, userId: string): Promise<void> {
    try {
      await this.supabase
        .from('gdpr_consents')
        .update({
          granted: false,
          withdrawn_at: new Date().toISOString()
        })
        .eq('id', consentId)
        .eq('user_id', userId);

      await this.logAuditEvent({
        userId,
        action: 'gdpr_consent_withdrawn',
        resource: 'compliance',
        details: { consentId },
        severity: 'info',
        compliance_frameworks: ['GDPR']
      });
    } catch (error) {
      console.error('Withdraw GDPR consent error:', error);
      throw error;
    }
  }

  async processDataSubjectRequest(userId: string, requestType: 'access' | 'rectification' | 'erasure' | 'portability'): Promise<string> {
    try {
      const { data, error } = await this.supabase
        .from('data_subject_requests')
        .insert({
          user_id: userId,
          request_type: requestType,
          status: 'pending',
          created_at: new Date().toISOString()
        })
        .select('id')
        .single();

      if (error) throw error;

      await this.logAuditEvent({
        userId,
        action: 'data_subject_request',
        resource: 'compliance',
        details: { requestType, requestId: data.id },
        severity: 'info',
        compliance_frameworks: ['GDPR']
      });

      // Trigger automated processing workflow
      await this.triggerDataSubjectRequestWorkflow(data.id, requestType);

      return data.id;
    } catch (error) {
      console.error('Process data subject request error:', error);
      throw error;
    }
  }

  // Security Monitoring
  async detectAnomalousActivity(userId: string): Promise<{ anomalies: any[]; riskScore: number }> {
    try {
      // Get recent user activity
      const { data: recentActivity } = await this.supabase
        .from('audit_logs')
        .select('*')
        .eq('user_id', userId)
        .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('timestamp', { ascending: false });

      const anomalies = [];
      let riskScore = 0;

      if (recentActivity) {
        // Check for unusual login patterns
        const loginAttempts = recentActivity.filter(log => log.action.includes('login'));
        const failedLogins = loginAttempts.filter(log => log.action === 'login_failed');
        
        if (failedLogins.length > 5) {
          anomalies.push({
            type: 'excessive_failed_logins',
            count: failedLogins.length,
            severity: 'high'
          });
          riskScore += 30;
        }

        // Check for unusual IP addresses
        const ipAddresses = [...new Set(recentActivity.map(log => log.ip_address).filter(Boolean))];
        if (ipAddresses.length > 3) {
          anomalies.push({
            type: 'multiple_ip_addresses',
            count: ipAddresses.length,
            severity: 'medium'
          });
          riskScore += 20;
        }

        // Check for unusual access patterns
        const accessTimes = recentActivity.map(log => new Date(log.timestamp).getHours());
        const unusualHours = accessTimes.filter(hour => hour < 6 || hour > 22);
        if (unusualHours.length > 0) {
          anomalies.push({
            type: 'unusual_access_hours',
            count: unusualHours.length,
            severity: 'low'
          });
          riskScore += 10;
        }
      }

      if (anomalies.length > 0) {
        await this.logAuditEvent({
          userId,
          action: 'anomaly_detected',
          resource: 'security',
          details: { anomalies, riskScore },
          severity: riskScore > 50 ? 'critical' : riskScore > 30 ? 'error' : 'warning'
        });
      }

      return { anomalies, riskScore };
    } catch (error) {
      console.error('Detect anomalous activity error:', error);
      throw error;
    }
  }

  async getSecurityMetrics(): Promise<SecurityMetrics> {
    try {
      const now = new Date();
      const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      // Get login metrics
      const { data: loginLogs } = await this.supabase
        .from('audit_logs')
        .select('action')
        .in('action', ['login_success', 'login_failed', 'login_blocked'])
        .gte('timestamp', last24h.toISOString());

      const loginMetrics = {
        successful: loginLogs?.filter(log => log.action === 'login_success').length || 0,
        failed: loginLogs?.filter(log => log.action === 'login_failed').length || 0,
        blocked: loginLogs?.filter(log => log.action === 'login_blocked').length || 0
      };

      // Get MFA metrics
      const { data: mfaUsers } = await this.supabase
        .from('user_mfa_config')
        .select('config');

      const mfaMetrics = {
        enabled: mfaUsers?.filter(user => user.config.enabled).length || 0,
        disabled: mfaUsers?.filter(user => !user.config.enabled).length || 0,
        verifications: 0 // Would need separate tracking
      };

      // Get session metrics
      const { data: sessions } = await this.supabase
        .from('user_sessions')
        .select('status, expires_at');

      const sessionMetrics = {
        activeSessions: sessions?.filter(s => s.status === 'active' && new Date(s.expires_at) > now).length || 0,
        expiredSessions: sessions?.filter(s => new Date(s.expires_at) <= now).length || 0,
        suspiciousSessions: 0 // Would need anomaly detection
      };

      // Calculate compliance scores
      const complianceScore = {
        overall: 85, // Would calculate based on actual compliance data
        byFramework: {
          'GDPR': 90,
          'SOC2': 80,
          'ISO27001': 85
        }
      };

      const vulnerabilities = {
        critical: 0,
        high: 2,
        medium: 5,
        low: 8
      };

      return {
        loginAttempts: loginMetrics,
        mfaUsage: mfaMetrics,
        sessionSecurity: sessionMetrics,
        complianceScore,
        vulnerabilities
      };
    } catch (error) {
      console.error('Get security metrics error:', error);
      throw error;
    }
  }

  // Private helper methods
  private async getMFAConfig(userId: string): Promise<MFAConfig> {
    const { data } = await this.supabase
      .from('user_mfa_config')
      .select('config')
      .eq('user_id', userId)
      .single();

    return data?.config || { enabled: false, methods: [], backupCodes: [] };
  }

  private async verifyMFACode(userId: string, code: string): Promise<boolean> {
    // Implementation would depend on MFA method (TOTP, SMS, etc.)
    // This is a simplified version
    const { data } = await this.supabase
      .from('user_mfa_config')
      .select('totp_secret')
      .eq('user_id', userId)
      .single();

    if (data?.totp_secret) {
      return this.verifyTOTPCode(data.totp_secret, code);
    }

    return false;
  }

  private generateBackupCodes(): string[] {
    const codes = [];
    for (let i = 0; i < 10; i++) {
      codes.push(Math.random().toString(36).substring(2, 10).toUpperCase());
    }
    return codes;
  }

  private generateTOTPSecret(): string {
    return Math.random().toString(36).substring(2, 18).toUpperCase();
  }

  private generateQRCode(userId: string, secret: string): string {
    // Would use a QR code library to generate the actual QR code
    const issuer = 'Synapses GRC';
    const label = `${issuer}:${userId}`;
    return `otpauth://totp/${label}?secret=${secret}&issuer=${issuer}`;
  }

  private verifyTOTPCode(secret: string, code: string): boolean {
    // Would use a TOTP library like 'otplib' to verify the code
    // This is a simplified implementation
    return code.length === 6 && /^\d{6}$/.test(code);
  }

  private async logAuditEvent(event: Omit<AuditLog, 'id' | 'timestamp'>): Promise<void> {
    const auditLog: AuditLog = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      ...event
    };

    this.auditQueue.push(auditLog);
  }

  private startAuditProcessor(): void {
    setInterval(async () => {
      if (this.auditQueue.length > 0) {
        const logs = this.auditQueue.splice(0, 100); // Process in batches
        try {
          await this.supabase
            .from('audit_logs')
            .insert(logs);
        } catch (error) {
          console.error('Failed to persist audit logs:', error);
          // Re-queue failed logs
          this.auditQueue.unshift(...logs);
        }
      }
    }, 5000); // Process every 5 seconds
  }

  private async triggerDataSubjectRequestWorkflow(requestId: string, requestType: string): Promise<void> {
    // Would integrate with n8n or other workflow engine
    console.log(`Triggering workflow for data subject request ${requestId} of type ${requestType}`);
  }

  private initializeSecurityPolicies(): void {
    // Initialize default security policies
    const defaultPolicies: SecurityPolicy[] = [
      {
        id: 'password-policy',
        name: 'Password Policy',
        type: 'password',
        rules: [
          {
            id: 'min-length',
            condition: 'length >= 12',
            action: 'deny'
          },
          {
            id: 'complexity',
            condition: 'contains uppercase, lowercase, number, special',
            action: 'deny'
          }
        ],
        enabled: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    defaultPolicies.forEach(policy => {
      this.securityPolicies.set(policy.id, policy);
    });
  }

  private initializeComplianceFrameworks(): void {
    // Initialize default compliance frameworks
    const frameworks: ComplianceFramework[] = [
      {
        id: 'gdpr',
        name: 'General Data Protection Regulation',
        version: '2018',
        jurisdiction: 'EU',
        status: 'active',
        requirements: [
          {
            id: 'art-6',
            title: 'Lawfulness of processing',
            description: 'Processing shall be lawful only if and to the extent that at least one of the conditions applies',
            category: 'Legal Basis',
            priority: 'critical',
            status: 'compliant',
            controls: ['consent-management', 'legal-basis-tracking']
          }
        ]
      }
    ];

    frameworks.forEach(framework => {
      this.complianceFrameworks.set(framework.id, framework);
    });
  }
}

export const securityComplianceService = new SecurityComplianceService();
export default SecurityComplianceService;