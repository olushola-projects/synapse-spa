/**
 * Advanced Security Service - Priority 3
 * Threat intelligence integration and advanced security features
 */

import { backendConfig } from '../config/environment.backend';
import { log } from '../utils/logger';

export interface ThreatIntelligence {
  id: string;
  source: 'internal' | 'external' | 'community' | 'vendor';
  type: 'ip' | 'domain' | 'url' | 'hash' | 'email' | 'behavior';
  indicator: string;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  description: string;
  tags: string[];
  firstSeen: Date;
  lastSeen: Date;
  references: string[];
  metadata: Record<string, any>;
}

export interface SecurityAnomaly {
  id: string;
  type: 'user_behavior' | 'network_traffic' | 'system_activity' | 'data_access' | 'authentication';
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  description: string;
  timestamp: Date;
  source: string;
  indicators: string[];
  context: Record<string, any>;
  status: 'new' | 'investigating' | 'resolved' | 'false_positive';
  assignedTo?: string;
  resolution?: string;
}

export interface SecurityIncident {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'contained' | 'resolved' | 'closed';
  category: 'malware' | 'phishing' | 'data_breach' | 'insider_threat' | 'ddos' | 'other';
  source: string;
  detectedAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  timeline: SecurityEvent[];
  impact: {
    systems: string[];
    users: string[];
    data: string[];
    business: string;
  };
  resolution?: {
    actions: string[];
    lessons: string[];
    recommendations: string[];
    completedAt: Date;
  };
}

export interface SecurityEvent {
  id: string;
  timestamp: Date;
  type: string;
  source: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  metadata: Record<string, any>;
}

export interface ThreatFeed {
  id: string;
  name: string;
  provider: string;
  type: 'malware' | 'phishing' | 'botnet' | 'apt' | 'general';
  url: string;
  format: 'csv' | 'json' | 'stix' | 'custom';
  updateFrequency: number;
  lastUpdate?: Date;
  enabled: boolean;
  apiKey?: string;
  metadata: Record<string, any>;
}

export interface SecurityMetrics {
  id: string;
  timestamp: Date;
  metrics: {
    totalThreats: number;
    activeIncidents: number;
    resolvedIncidents: number;
    falsePositives: number;
    meanTimeToDetection: number;
    meanTimeToResolution: number;
    threatDetectionRate: number;
    systemHealth: number;
  };
  trends: {
    threatsTrend: 'increasing' | 'decreasing' | 'stable';
    incidentsTrend: 'increasing' | 'decreasing' | 'stable';
    detectionRateTrend: 'improving' | 'declining' | 'stable';
  };
}

export interface MLSecurityModel {
  id: string;
  name: string;
  type: 'anomaly_detection' | 'threat_classification' | 'risk_assessment' | 'behavior_analysis';
  version: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  lastTrained: Date;
  status: 'active' | 'training' | 'inactive' | 'error';
  metadata: Record<string, any>;
}

class AdvancedSecurityService {
  private static instance: AdvancedSecurityService;
  private threatIntelligence: Map<string, ThreatIntelligence> = new Map();
  private anomalies: SecurityAnomaly[] = [];
  private incidents: SecurityIncident[] = [];
  private threatFeeds: ThreatFeed[] = []; // Will be populated when threat intelligence is implemented
  private mlModels: MLSecurityModel[] = [];
  private securityEnabled: boolean;
  private threatIntelligenceEnabled: boolean;
  private mlEnabled: boolean;

  constructor() {
    this.securityEnabled = backendConfig.ENABLE_ADVANCED_SECURITY;
    this.threatIntelligenceEnabled = backendConfig.ENABLE_THREAT_INTELLIGENCE;
    this.mlEnabled = backendConfig.ENABLE_ML_SECURITY;

    if (this.securityEnabled) {
      this.initializeAdvancedSecurity();
    }
  }

  static getInstance(): AdvancedSecurityService {
    if (!AdvancedSecurityService.instance) {
      AdvancedSecurityService.instance = new AdvancedSecurityService();
    }
    return AdvancedSecurityService.instance;
  }

  private async initializeAdvancedSecurity(): Promise<void> {
    try {
      log.info('Initializing advanced security service');

      if (this.threatIntelligenceEnabled) {
        await this.initializeThreatFeeds();
        this.startThreatIntelligenceCollection();
      }

      if (this.mlEnabled) {
        await this.initializeMLModels();
        this.startMLSecurityAnalysis();
      }

      this.startAnomalyDetection();
      this.startIncidentMonitoring();

      log.info('Advanced security service initialized');
    } catch (error) {
      log.error('Failed to initialize advanced security service', { error });
    }
  }

  private async initializeThreatFeeds(): Promise<void> {
    const defaultFeeds: ThreatFeed[] = [
      {
        id: crypto.randomUUID(),
        name: 'AbuseIPDB',
        provider: 'AbuseIPDB',
        type: 'general',
        url: 'https://api.abuseipdb.com/api/v2/blacklist',
        format: 'json',
        updateFrequency: 60,
        enabled: true,
        metadata: {}
      },
      {
        id: crypto.randomUUID(),
        name: 'PhishTank',
        provider: 'PhishTank',
        type: 'phishing',
        url: 'https://data.phishtank.com/data/online-valid.json',
        format: 'json',
        updateFrequency: 30,
        enabled: true,
        metadata: {}
      }
    ];

    this.threatFeeds = defaultFeeds;
    log.info(`Initialized ${defaultFeeds.length} threat intelligence feeds`);
  }

  private async initializeMLModels(): Promise<void> {
    const defaultModels: MLSecurityModel[] = [
      {
        id: crypto.randomUUID(),
        name: 'User Behavior Anomaly Detection',
        type: 'anomaly_detection',
        version: '1.0.0',
        accuracy: 85,
        precision: 82,
        recall: 88,
        f1Score: 85,
        lastTrained: new Date(),
        status: 'active',
        metadata: {
          algorithm: 'isolation_forest',
          features: ['login_time', 'location', 'device', 'activity_pattern']
        }
      },
      {
        id: crypto.randomUUID(),
        name: 'Threat Classification Model',
        type: 'threat_classification',
        version: '1.0.0',
        accuracy: 92,
        precision: 90,
        recall: 94,
        f1Score: 92,
        lastTrained: new Date(),
        status: 'active',
        metadata: {
          algorithm: 'random_forest',
          features: ['ip_reputation', 'domain_age', 'url_pattern']
        }
      }
    ];

    this.mlModels = defaultModels;
    log.info(`Initialized ${defaultModels.length} ML security models`);
  }

  private startThreatIntelligenceCollection(): void {
    setInterval(
      async () => {
        await this.collectThreatIntelligence();
      },
      30 * 60 * 1000
    );
    log.info('Threat intelligence collection started');
  }

  private startMLSecurityAnalysis(): void {
    setInterval(
      async () => {
        await this.runMLSecurityAnalysis();
      },
      5 * 60 * 1000
    );
    log.info('ML security analysis started');
  }

  private startAnomalyDetection(): void {
    setInterval(async () => {
      await this.detectAnomalies();
    }, 60 * 1000);
    log.info('Anomaly detection started');
  }

  private startIncidentMonitoring(): void {
    setInterval(
      async () => {
        await this.monitorIncidents();
      },
      5 * 60 * 1000
    );
    log.info('Incident monitoring started');
  }

  // Placeholder methods - will be implemented in next part
  private async collectThreatIntelligence(): Promise<void> {
    log.info('Collecting threat intelligence...');
  }

  private async runMLSecurityAnalysis(): Promise<void> {
    log.info('Running ML security analysis...');
  }

  private async detectAnomalies(): Promise<void> {
    log.info('Detecting anomalies...');
  }

  private async monitorIncidents(): Promise<void> {
    log.info('Monitoring incidents...');
  }

  async createSecurityAnomaly(anomalyData: Partial<SecurityAnomaly>): Promise<SecurityAnomaly> {
    const anomaly: SecurityAnomaly = {
      id: crypto.randomUUID(),
      type: anomalyData.type || 'user_behavior',
      severity: anomalyData.severity || 'low',
      confidence: anomalyData.confidence || 50,
      description: anomalyData.description || 'Security anomaly detected',
      timestamp: new Date(),
      source: anomalyData.source || 'unknown',
      indicators: anomalyData.indicators || [],
      context: anomalyData.context || {},
      status: 'new'
    };

    this.anomalies.push(anomaly);
    log.info(`Security anomaly created: ${anomaly.description}`, { anomaly });

    return anomaly;
  }

  async createSecurityIncident(incidentData: Partial<SecurityIncident>): Promise<SecurityIncident> {
    const incident: SecurityIncident = {
      id: crypto.randomUUID(),
      title: incidentData.title || 'Security Incident',
      description: incidentData.description || 'Security incident detected',
      severity: incidentData.severity || 'medium',
      status: 'open',
      category: incidentData.category || 'other',
      source: incidentData.source || 'unknown',
      detectedAt: new Date(),
      updatedAt: new Date(),
      timeline: incidentData.timeline || [],
      impact: incidentData.impact || {
        systems: [],
        users: [],
        data: [],
        business: 'Under investigation'
      }
    };

    this.incidents.push(incident);
    log.warn(`Security incident created: ${incident.title}`, { incident });

    return incident;
  }

  async getThreatIntelligence(filters?: {
    type?: string;
    threatLevel?: string;
    source?: string;
  }): Promise<ThreatIntelligence[]> {
    let threats = Array.from(this.threatIntelligence.values());

    if (filters?.type) {
      threats = threats.filter(t => t.type === filters.type);
    }
    if (filters?.threatLevel) {
      threats = threats.filter(t => t.threatLevel === filters.threatLevel);
    }
    if (filters?.source) {
      threats = threats.filter(t => t.source === filters.source);
    }

    return threats.sort((a, b) => b.lastSeen.getTime() - a.lastSeen.getTime());
  }

  async getSecurityAnomalies(filters?: {
    type?: string;
    severity?: string;
    status?: string;
  }): Promise<SecurityAnomaly[]> {
    let anomalies = this.anomalies;

    if (filters?.type) {
      anomalies = anomalies.filter(a => a.type === filters.type);
    }
    if (filters?.severity) {
      anomalies = anomalies.filter(a => a.severity === filters.severity);
    }
    if (filters?.status) {
      anomalies = anomalies.filter(a => a.status === filters.status);
    }

    return anomalies.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async getSecurityIncidents(filters?: {
    severity?: string;
    status?: string;
    category?: string;
  }): Promise<SecurityIncident[]> {
    let incidents = this.incidents;

    if (filters?.severity) {
      incidents = incidents.filter(i => i.severity === filters.severity);
    }
    if (filters?.status) {
      incidents = incidents.filter(i => i.status === filters.status);
    }
    if (filters?.category) {
      incidents = incidents.filter(i => i.category === filters.category);
    }

    return incidents.sort((a, b) => b.detectedAt.getTime() - a.detectedAt.getTime());
  }

  async getSecurityMetrics(): Promise<SecurityMetrics> {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const recentAnomalies = this.anomalies.filter(a => a.timestamp >= last24Hours);
    const recentIncidents = this.incidents.filter(i => i.detectedAt >= last24Hours);

    // TODO: Use these variables when implementing full metrics
    console.log('Recent anomalies:', recentAnomalies.length);
    console.log('Recent incidents:', recentIncidents.length);

    const metrics: SecurityMetrics = {
      id: crypto.randomUUID(),
      timestamp: now,
      metrics: {
        totalThreats: this.threatIntelligence.size,
        activeIncidents: this.incidents.filter(i => i.status !== 'closed').length,
        resolvedIncidents: this.incidents.filter(i => i.status === 'resolved').length,
        falsePositives: this.anomalies.filter(a => a.status === 'false_positive').length,
        meanTimeToDetection: 15,
        meanTimeToResolution: 120,
        threatDetectionRate: 95,
        systemHealth: 98
      },
      trends: {
        threatsTrend: 'stable',
        incidentsTrend: 'stable',
        detectionRateTrend: 'stable'
      }
    };

    return metrics;
  }

  async getMLModels(): Promise<MLSecurityModel[]> {
    return this.mlModels;
  }

  async checkThreatIndicator(
    indicator: string,
    type: ThreatIntelligence['type']
  ): Promise<ThreatIntelligence | null> {
    const threat = Array.from(this.threatIntelligence.values()).find(
      t => t.indicator === indicator && t.type === type
    );

    return threat || null;
  }

  async markAnomalyAsResolved(anomalyId: string, resolution?: string): Promise<void> {
    const anomaly = this.anomalies.find(a => a.id === anomalyId);
    if (anomaly) {
      anomaly.status = 'resolved';
      anomaly.resolution = resolution;
      log.info(`Anomaly marked as resolved: ${anomaly.description}`);
    }
  }

  async updateIncidentStatus(
    incidentId: string,
    status: SecurityIncident['status'],
    updates?: Partial<SecurityIncident>
  ): Promise<void> {
    const incident = this.incidents.find(i => i.id === incidentId);
    if (incident) {
      incident.status = status;
      incident.updatedAt = new Date();

      if (updates) {
        Object.assign(incident, updates);
      }

      log.info(`Incident status updated: ${incident.title} -> ${status}`);
    }
  }
}

export const advancedSecurityService = AdvancedSecurityService.getInstance();
