/**
 * Security Monitoring and Threat Detection System
 * Implements real-time security monitoring, anomaly detection, and incident response
 * Part of Phase 2: Security Infrastructure (Week 4)
 */

import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Types for security monitoring
interface SecurityEvent {
  id: string;
  type: SecurityEventType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  userId?: string;
  ipAddress: string;
  userAgent?: string;
  timestamp: Date;
  details: Record<string, any>;
  status: 'active' | 'investigating' | 'resolved' | 'false_positive';
}

interface ThreatIndicator {
  type: 'ip' | 'user_agent' | 'behavior_pattern' | 'geolocation';
  value: string;
  riskScore: number;
  lastSeen: Date;
  frequency: number;
}

interface AnomalyDetectionResult {
  isAnomaly: boolean;
  confidence: number;
  reasons: string[];
  riskScore: number;
  recommendedAction: 'monitor' | 'alert' | 'block' | 'investigate';
}

interface SecurityMetrics {
  totalEvents: number;
  criticalEvents: number;
  resolvedIncidents: number;
  averageResponseTime: number;
  topThreats: ThreatIndicator[];
  riskTrend: 'increasing' | 'stable' | 'decreasing';
}

enum SecurityEventType {
  FAILED_LOGIN = 'failed_login',
  SUCCESSFUL_LOGIN = 'successful_login',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
  DATA_ACCESS = 'data_access',
  PRIVILEGE_ESCALATION = 'privilege_escalation',
  MALWARE_DETECTION = 'malware_detection',
  BRUTE_FORCE_ATTACK = 'brute_force_attack',
  SQL_INJECTION_ATTEMPT = 'sql_injection_attempt',
  XSS_ATTEMPT = 'xss_attempt',
  UNAUTHORIZED_API_ACCESS = 'unauthorized_api_access',
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  GEOLOCATION_ANOMALY = 'geolocation_anomaly',
  SESSION_HIJACKING = 'session_hijacking',
  DATA_EXFILTRATION = 'data_exfiltration'
}

/**
 * Main Security Monitoring Service
 * Provides real-time threat detection and incident response capabilities
 */
export class SecurityMonitoring {
  private static _supabase: any = null;

  private static get supabase() {
    if (!this._supabase) {
      this._supabase = createClient(
        process.env.SUPABASE_URL || '',
        process.env.SUPABASE_SERVICE_ROLE_KEY || ''
      );
    }
    return this._supabase;
  }

  private static threatIndicators: Map<string, ThreatIndicator> = new Map();
  private static eventBuffer: SecurityEvent[] = [];
  private static readonly BUFFER_SIZE = 1000;
  private static readonly ANOMALY_THRESHOLD = 0.7;

  /**
   * Log a security event and perform real-time analysis
   * @param eventType - Type of security event
   * @param source - Source of the event (e.g., 'auth', 'api', 'web')
   * @param details - Additional event details
   * @param userId - Optional user ID if applicable
   * @param ipAddress - IP address of the source
   * @param userAgent - User agent string
   */
  static async logSecurityEvent(
    eventType: SecurityEventType,
    source: string,
    details: Record<string, any>,
    userId?: string,
    ipAddress = 'unknown',
    userAgent?: string
  ): Promise<void> {
    const event: SecurityEvent = {
      id: crypto.randomUUID(),
      type: eventType,
      severity: this.calculateSeverity(eventType, details),
      source,
      userId,
      ipAddress,
      userAgent,
      timestamp: new Date(),
      details,
      status: 'active'
    };

    // Store event in database
    await this.storeSecurityEvent(event);

    // Add to buffer for real-time analysis
    this.addToBuffer(event);

    // Perform real-time threat analysis
    const anomalyResult = await this.detectAnomalies(event);

    if (anomalyResult.isAnomaly) {
      await this.handleAnomaly(event, anomalyResult);
    }

    // Update threat indicators
    await this.updateThreatIndicators(event);

    // Check for incident escalation
    if (event.severity === 'critical') {
      await this.escalateIncident(event);
    }
  }

  /**
   * Detect anomalies in security events using pattern analysis
   * @param event - Security event to analyze
   * @returns Anomaly detection result
   */
  private static async detectAnomalies(event: SecurityEvent): Promise<AnomalyDetectionResult> {
    const reasons: string[] = [];
    let riskScore = 0;
    let confidence = 0;

    // Check for brute force patterns
    if (await this.detectBruteForce(event)) {
      reasons.push('Brute force attack pattern detected');
      riskScore += 0.8;
      confidence += 0.3;
    }

    // Check for geolocation anomalies
    if (await this.detectGeolocationAnomaly(event)) {
      reasons.push('Unusual geolocation detected');
      riskScore += 0.6;
      confidence += 0.2;
    }

    // Check for time-based anomalies
    if (await this.detectTimeAnomaly(event)) {
      reasons.push('Unusual access time detected');
      riskScore += 0.4;
      confidence += 0.1;
    }

    // Check for behavioral anomalies
    if (await this.detectBehavioralAnomaly(event)) {
      reasons.push('Unusual user behavior detected');
      riskScore += 0.7;
      confidence += 0.25;
    }

    // Check against known threat indicators
    if (await this.checkThreatIndicators(event)) {
      reasons.push('Matches known threat indicators');
      riskScore += 0.9;
      confidence += 0.4;
    }

    const isAnomaly = confidence >= this.ANOMALY_THRESHOLD;
    const recommendedAction = this.getRecommendedAction(riskScore, confidence);

    return {
      isAnomaly,
      confidence: Math.min(confidence, 1.0),
      reasons,
      riskScore: Math.min(riskScore, 1.0),
      recommendedAction
    };
  }

  /**
   * Detect brute force attack patterns
   * @param event - Security event to analyze
   * @returns True if brute force pattern detected
   */
  private static async detectBruteForce(event: SecurityEvent): Promise<boolean> {
    if (event.type !== SecurityEventType.FAILED_LOGIN) {
      return false;
    }

    const recentEvents = this.eventBuffer.filter(
      e =>
        e.type === SecurityEventType.FAILED_LOGIN &&
        e.ipAddress === event.ipAddress &&
        Date.now() - e.timestamp.getTime() < 300000 // 5 minutes
    );

    return recentEvents.length >= 5; // 5 failed attempts in 5 minutes
  }

  /**
   * Detect geolocation anomalies
   * @param event - Security event to analyze
   * @returns True if geolocation anomaly detected
   */
  private static async detectGeolocationAnomaly(event: SecurityEvent): Promise<boolean> {
    if (!event.userId) {
      return false;
    }

    // Get user's typical locations from recent successful logins
    const { data: recentLogins } = await this.supabase
      .from('security_events')
      .select('details')
      .eq('user_id', event.userId)
      .eq('type', SecurityEventType.SUCCESSFUL_LOGIN)
      .gte('timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) // Last 30 days
      .limit(50);

    if (!recentLogins || recentLogins.length < 5) {
      return false; // Not enough data
    }

    const currentCountry = event.details.geolocation?.country;
    if (!currentCountry) {
      return false;
    }

    const typicalCountries = recentLogins
      .map(login => login.details?.geolocation?.country)
      .filter(country => country);

    const isTypicalLocation = typicalCountries.includes(currentCountry);
    return !isTypicalLocation;
  }

  /**
   * Detect time-based anomalies
   * @param event - Security event to analyze
   * @returns True if time anomaly detected
   */
  private static async detectTimeAnomaly(event: SecurityEvent): Promise<boolean> {
    const hour = event.timestamp.getHours();
    const isBusinessHours = hour >= 9 && hour <= 17;
    const isWeekend = [0, 6].includes(event.timestamp.getDay());

    // Flag access during unusual hours for sensitive operations
    const sensitiveEvents = [
      SecurityEventType.PRIVILEGE_ESCALATION,
      SecurityEventType.DATA_ACCESS,
      SecurityEventType.DATA_EXFILTRATION
    ];

    if (sensitiveEvents.includes(event.type)) {
      return !isBusinessHours || isWeekend;
    }

    return false;
  }

  /**
   * Detect behavioral anomalies
   * @param event - Security event to analyze
   * @returns True if behavioral anomaly detected
   */
  private static async detectBehavioralAnomaly(event: SecurityEvent): Promise<boolean> {
    if (!event.userId) {
      return false;
    }

    // Check for rapid successive actions
    const recentEvents = this.eventBuffer.filter(
      e => e.userId === event.userId && Date.now() - e.timestamp.getTime() < 60000 // 1 minute
    );

    if (recentEvents.length > 20) {
      return true; // Too many actions in short time
    }

    // Check for unusual API access patterns
    if (event.source === 'api') {
      const apiEvents = recentEvents.filter(e => e.source === 'api');
      if (apiEvents.length > 10) {
        return true; // Unusual API usage
      }
    }

    return false;
  }

  /**
   * Check event against known threat indicators
   * @param event - Security event to analyze
   * @returns True if matches threat indicators
   */
  private static async checkThreatIndicators(event: SecurityEvent): Promise<boolean> {
    // Check IP address against threat indicators
    const ipThreat = this.threatIndicators.get(`ip:${event.ipAddress}`);
    if (ipThreat && ipThreat.riskScore > 0.7) {
      return true;
    }

    // Check user agent against threat indicators
    if (event.userAgent) {
      const uaThreat = this.threatIndicators.get(`user_agent:${event.userAgent}`);
      if (uaThreat && uaThreat.riskScore > 0.7) {
        return true;
      }
    }

    return false;
  }

  /**
   * Handle detected anomaly
   * @param event - Security event
   * @param anomalyResult - Anomaly detection result
   */
  private static async handleAnomaly(
    event: SecurityEvent,
    anomalyResult: AnomalyDetectionResult
  ): Promise<void> {
    // Log the anomaly
    console.warn(`Security anomaly detected:`, {
      eventId: event.id,
      confidence: anomalyResult.confidence,
      riskScore: anomalyResult.riskScore,
      reasons: anomalyResult.reasons
    });

    // Take action based on recommendation
    switch (anomalyResult.recommendedAction) {
      case 'block':
        await this.blockSource(event.ipAddress, event.userId);
        break;
      case 'investigate':
        await this.createIncident(event, anomalyResult);
        break;
      case 'alert':
        await this.sendSecurityAlert(event, anomalyResult);
        break;
      case 'monitor':
        await this.enhanceMonitoring(event.ipAddress, event.userId);
        break;
    }
  }

  /**
   * Calculate event severity based on type and details
   * @param eventType - Type of security event
   * @param details - Event details
   * @returns Event severity level
   */
  private static calculateSeverity(
    eventType: SecurityEventType,
    details: Record<string, any>
  ): 'low' | 'medium' | 'high' | 'critical' {
    const criticalEvents = [
      SecurityEventType.DATA_EXFILTRATION,
      SecurityEventType.PRIVILEGE_ESCALATION,
      SecurityEventType.MALWARE_DETECTION
    ];

    const highEvents = [
      SecurityEventType.BRUTE_FORCE_ATTACK,
      SecurityEventType.SQL_INJECTION_ATTEMPT,
      SecurityEventType.SESSION_HIJACKING
    ];

    const mediumEvents = [
      SecurityEventType.SUSPICIOUS_ACTIVITY,
      SecurityEventType.UNAUTHORIZED_API_ACCESS,
      SecurityEventType.XSS_ATTEMPT
    ];

    if (criticalEvents.includes(eventType)) {
      return 'critical';
    } else if (highEvents.includes(eventType)) {
      return 'high';
    } else if (mediumEvents.includes(eventType)) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  /**
   * Get recommended action based on risk score and confidence
   * @param riskScore - Risk score (0-1)
   * @param confidence - Confidence level (0-1)
   * @returns Recommended action
   */
  private static getRecommendedAction(
    riskScore: number,
    confidence: number
  ): 'monitor' | 'alert' | 'block' | 'investigate' {
    if (riskScore >= 0.9 && confidence >= 0.8) {
      return 'block';
    } else if (riskScore >= 0.7 && confidence >= 0.6) {
      return 'investigate';
    } else if (riskScore >= 0.5 && confidence >= 0.4) {
      return 'alert';
    } else {
      return 'monitor';
    }
  }

  /**
   * Store security event in database
   * @param event - Security event to store
   */
  private static async storeSecurityEvent(event: SecurityEvent): Promise<void> {
    try {
      const { error } = await this.supabase.from('security_events').insert({
        id: event.id,
        type: event.type,
        severity: event.severity,
        source: event.source,
        user_id: event.userId,
        ip_address: event.ipAddress,
        user_agent: event.userAgent,
        timestamp: event.timestamp.toISOString(),
        details: event.details,
        status: event.status
      });

      if (error) {
        console.error('Failed to store security event:', error);
      }
    } catch (error) {
      console.error('Error storing security event:', error);
    }
  }

  /**
   * Add event to buffer for real-time analysis
   * @param event - Security event to add
   */
  private static addToBuffer(event: SecurityEvent): void {
    this.eventBuffer.push(event);

    // Maintain buffer size
    if (this.eventBuffer.length > this.BUFFER_SIZE) {
      this.eventBuffer.shift();
    }
  }

  /**
   * Update threat indicators based on event
   * @param event - Security event
   */
  private static async updateThreatIndicators(event: SecurityEvent): Promise<void> {
    // Update IP address threat indicator
    const ipKey = `ip:${event.ipAddress}`;
    const ipThreat = this.threatIndicators.get(ipKey) || {
      type: 'ip' as const,
      value: event.ipAddress,
      riskScore: 0,
      lastSeen: new Date(),
      frequency: 0
    };

    ipThreat.frequency += 1;
    ipThreat.lastSeen = event.timestamp;

    // Increase risk score for suspicious events
    if (['high', 'critical'].includes(event.severity)) {
      ipThreat.riskScore = Math.min(ipThreat.riskScore + 0.1, 1.0);
    }

    this.threatIndicators.set(ipKey, ipThreat);

    // Update user agent threat indicator if present
    if (event.userAgent) {
      const uaKey = `user_agent:${event.userAgent}`;
      const uaThreat = this.threatIndicators.get(uaKey) || {
        type: 'user_agent' as const,
        value: event.userAgent,
        riskScore: 0,
        lastSeen: new Date(),
        frequency: 0
      };

      uaThreat.frequency += 1;
      uaThreat.lastSeen = event.timestamp;

      if (['high', 'critical'].includes(event.severity)) {
        uaThreat.riskScore = Math.min(uaThreat.riskScore + 0.05, 1.0);
      }

      this.threatIndicators.set(uaKey, uaThreat);
    }
  }

  /**
   * Block source (IP address and/or user)
   * @param ipAddress - IP address to block
   * @param userId - Optional user ID to block
   */
  private static async blockSource(ipAddress: string, userId?: string): Promise<void> {
    try {
      // Add IP to blocklist
      await this.supabase.from('ip_blocklist').insert({
        ip_address: ipAddress,
        reason: 'Automated security block',
        blocked_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      });

      // Suspend user if provided
      if (userId) {
        await this.supabase
          .from('user_profiles')
          .update({
            status: 'suspended',
            suspended_reason: 'Automated security suspension',
            suspended_at: new Date().toISOString()
          })
          .eq('id', userId);
      }

      console.log(`Blocked source: IP ${ipAddress}${userId ? `, User ${userId}` : ''}`);
    } catch (error) {
      console.error('Failed to block source:', error);
    }
  }

  /**
   * Create security incident
   * @param event - Security event
   * @param anomalyResult - Anomaly detection result
   */
  private static async createIncident(
    event: SecurityEvent,
    anomalyResult: AnomalyDetectionResult
  ): Promise<void> {
    try {
      const incident = {
        id: crypto.randomUUID(),
        title: `Security Incident: ${event.type}`,
        description: `Anomaly detected with confidence ${anomalyResult.confidence.toFixed(2)}`,
        severity: event.severity,
        status: 'open',
        created_at: new Date().toISOString(),
        event_id: event.id,
        details: {
          anomalyResult,
          event
        }
      };

      await this.supabase.from('security_incidents').insert(incident);

      console.log(`Created security incident: ${incident.id}`);
    } catch (error) {
      console.error('Failed to create incident:', error);
    }
  }

  /**
   * Send security alert
   * @param event - Security event
   * @param anomalyResult - Anomaly detection result
   */
  private static async sendSecurityAlert(
    event: SecurityEvent,
    anomalyResult: AnomalyDetectionResult
  ): Promise<void> {
    // Implementation would integrate with alerting system (email, Slack, etc.)
    console.warn('Security Alert:', {
      event: event.type,
      severity: event.severity,
      confidence: anomalyResult.confidence,
      reasons: anomalyResult.reasons
    });
  }

  /**
   * Enhance monitoring for specific source
   * @param ipAddress - IP address to monitor
   * @param userId - Optional user ID to monitor
   */
  private static async enhanceMonitoring(ipAddress: string, userId?: string): Promise<void> {
    // Add to enhanced monitoring list
    const monitoringEntry = {
      ip_address: ipAddress,
      user_id: userId,
      enhanced_until: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours
      created_at: new Date().toISOString()
    };

    await this.supabase.from('enhanced_monitoring').insert(monitoringEntry);

    console.log(
      `Enhanced monitoring enabled for IP ${ipAddress}${userId ? `, User ${userId}` : ''}`
    );
  }

  /**
   * Escalate critical incident
   * @param event - Critical security event
   */
  private static async escalateIncident(event: SecurityEvent): Promise<void> {
    // Implementation would integrate with incident response system
    console.error('CRITICAL SECURITY INCIDENT:', {
      eventId: event.id,
      type: event.type,
      source: event.source,
      timestamp: event.timestamp
    });

    // Create high-priority incident
    await this.createIncident(event, {
      isAnomaly: true,
      confidence: 1.0,
      reasons: ['Critical security event detected'],
      riskScore: 1.0,
      recommendedAction: 'investigate'
    });
  }

  /**
   * Get security metrics for dashboard
   * @returns Security metrics
   */
  static async getSecurityMetrics(): Promise<SecurityMetrics> {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    try {
      const { data: events } = await this.supabase
        .from('security_events')
        .select('*')
        .gte('timestamp', last24Hours.toISOString());

      const totalEvents = events?.length || 0;
      const criticalEvents = events?.filter(e => e.severity === 'critical').length || 0;

      const { data: incidents } = await this.supabase
        .from('security_incidents')
        .select('*')
        .eq('status', 'resolved')
        .gte('created_at', last24Hours.toISOString());

      const resolvedIncidents = incidents?.length || 0;

      // Calculate average response time (mock implementation)
      const averageResponseTime = 45; // minutes

      // Get top threats
      const topThreats = Array.from(this.threatIndicators.values())
        .sort((a, b) => b.riskScore - a.riskScore)
        .slice(0, 5);

      return {
        totalEvents,
        criticalEvents,
        resolvedIncidents,
        averageResponseTime,
        topThreats,
        riskTrend: criticalEvents > 5 ? 'increasing' : 'stable'
      };
    } catch (error) {
      console.error('Failed to get security metrics:', error);
      return {
        totalEvents: 0,
        criticalEvents: 0,
        resolvedIncidents: 0,
        averageResponseTime: 0,
        topThreats: [],
        riskTrend: 'stable'
      };
    }
  }

  /**
   * Initialize security monitoring system
   */
  static async initialize(): Promise<void> {
    console.log('Initializing Security Monitoring System...');

    // Load existing threat indicators
    await this.loadThreatIndicators();

    // Start periodic cleanup
    setInterval(
      () => {
        this.cleanupOldEvents();
      },
      60 * 60 * 1000
    ); // Every hour

    console.log('Security Monitoring System initialized successfully');
  }

  /**
   * Load threat indicators from database
   */
  private static async loadThreatIndicators(): Promise<void> {
    try {
      const { data: indicators } = await this.supabase
        .from('threat_indicators')
        .select('*')
        .gte('last_seen', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()); // Last 7 days

      if (indicators) {
        indicators.forEach(indicator => {
          const key = `${indicator.type}:${indicator.value}`;
          this.threatIndicators.set(key, {
            type: indicator.type,
            value: indicator.value,
            riskScore: indicator.risk_score,
            lastSeen: new Date(indicator.last_seen),
            frequency: indicator.frequency
          });
        });
      }

      console.log(`Loaded ${this.threatIndicators.size} threat indicators`);
    } catch (error) {
      console.error('Failed to load threat indicators:', error);
    }
  }

  /**
   * Clean up old events from buffer
   */
  private static cleanupOldEvents(): void {
    const cutoff = Date.now() - 60 * 60 * 1000; // 1 hour
    this.eventBuffer = this.eventBuffer.filter(event => event.timestamp.getTime() > cutoff);
  }
}

// Export types for use in other modules
export {
  SecurityEvent,
  SecurityEventType,
  ThreatIndicator,
  AnomalyDetectionResult,
  SecurityMetrics
};
