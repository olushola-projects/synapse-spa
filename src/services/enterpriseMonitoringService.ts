// Enterprise Monitoring Service for SFDR Navigator
// Implements comprehensive monitoring, alerting, and regulatory compliance tracking

import { supabase } from '@/integrations/supabase/client';

interface SystemAlert {
  id: string;
  type: 'authentication' | 'performance' | 'compliance' | 'security';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: string;
  resolved: boolean;
  metadata?: Record<string, any>;
}

interface PerformanceMetric {
  service: string;
  responseTime: number;
  success: boolean;
  timestamp: string;
  endpoint?: string;
  userId?: string;
}

interface ComplianceEvent {
  id: string;
  userId: string;
  action: string;
  classification: string;
  confidence: number;
  strategy: string;
  timestamp: string;
  auditTrail: Record<string, any>;
}

class EnterpriseMonitoringService {
  private static instance: EnterpriseMonitoringService;
  private alerts: SystemAlert[] = [];
  private metrics: PerformanceMetric[] = [];
  private alertListeners: Array<(alert: SystemAlert) => void> = [];

  static getInstance(): EnterpriseMonitoringService {
    if (!EnterpriseMonitoringService.instance) {
      EnterpriseMonitoringService.instance = new EnterpriseMonitoringService();
    }
    return EnterpriseMonitoringService.instance;
  }

  // PHASE 1: Critical Authentication Monitoring
  async recordAuthenticationFailure(details: {
    endpoint: string;
    reason: string;
    userId?: string;
    apiKeyStatus: string;
  }): Promise<void> {
    const alert: SystemAlert = {
      id: crypto.randomUUID(),
      type: 'authentication',
      severity: 'critical',
      title: 'API Authentication Failure',
      message: `Authentication failed for ${details.endpoint}: ${details.reason}`,
      timestamp: new Date().toISOString(),
      resolved: false,
      metadata: details
    };

    this.alerts.push(alert);
    this.notifyListeners(alert);

    // Log authentication failure for security monitoring
    console.log(
      `🔒 Security Alert: Authentication Failed - ${details.endpoint} - ${details.reason}`
    );
  }

  // PHASE 2: LLM Performance Monitoring
  async recordLLMClassification(event: {
    userId: string;
    inputText: string;
    classification: string;
    confidence: number;
    strategy: string;
    processingTime: number;
    modelVersion?: string;
  }): Promise<void> {
    // Record performance metric
    this.metrics.push({
      service: 'llm-classification',
      responseTime: event.processingTime,
      success: event.confidence >= 0.7,
      timestamp: new Date().toISOString(),
      endpoint: `classify/${event.strategy}`,
      userId: event.userId
    });

    // SFDR Compliance: Store in compliance assessments for now
    try {
      await supabase.from('compliance_assessments').insert({
        user_id: event.userId,
        entity_id: `llm_${Date.now()}`,
        fund_name: 'LLM Classification',
        target_article: event.classification,
        assessment_data: {
          input_text: event.inputText,
          confidence: event.confidence,
          strategy: event.strategy,
          processing_time: event.processingTime,
          model_version: event.modelVersion || 'unknown'
        },
        compliance_score: Math.round(event.confidence * 100),
        status: event.confidence >= 0.7 ? 'completed' : 'review_required'
      });
    } catch (error) {
      console.error('Failed to record LLM classification audit:', error);
    }

    // Check for low confidence alerts
    if (event.confidence < 0.7) {
      const alert: SystemAlert = {
        id: crypto.randomUUID(),
        type: 'compliance',
        severity: 'medium',
        title: 'Low Confidence Classification',
        message: `LLM classification confidence (${event.confidence}) below threshold for ${event.strategy}`,
        timestamp: new Date().toISOString(),
        resolved: false,
        metadata: {
          strategy: event.strategy,
          confidence: event.confidence,
          userId: event.userId
        }
      };

      this.alerts.push(alert);
      this.notifyListeners(alert);
    }
  }

  // PHASE 3: System Health Monitoring
  async recordSystemHealth(
    service: string,
    status: 'healthy' | 'degraded' | 'critical' | 'down',
    details?: Record<string, any>
  ): Promise<void> {
    try {
      // Log system health for monitoring
      console.log(`📊 System Health: ${service} - ${status}`, details);

      // Create alert for degraded services
      if (status === 'critical' || status === 'down') {
        const alert: SystemAlert = {
          id: crypto.randomUUID(),
          type: 'performance',
          severity: status === 'down' ? 'critical' : 'high',
          title: `Service ${status}`,
          message: `${service} is ${status}`,
          timestamp: new Date().toISOString(),
          resolved: false,
          metadata: { service, details }
        };

        this.alerts.push(alert);
        this.notifyListeners(alert);
      }
    } catch (error) {
      console.error('Failed to record system health:', error);
    }
  }

  // PHASE 4: Advanced Analytics
  async getSystemOverview(): Promise<{
    overallHealth: 'healthy' | 'degraded' | 'critical';
    activeAlerts: number;
    criticalAlerts: number;
    avgResponseTime: number;
    apiSuccessRate: number;
    complianceScore: number;
  }> {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;

    // Analyze recent metrics
    const recentMetrics = this.metrics.filter(m => new Date(m.timestamp).getTime() > oneHourAgo);

    const activeAlerts = this.alerts.filter(a => !a.resolved).length;
    const criticalAlerts = this.alerts.filter(a => !a.resolved && a.severity === 'critical').length;

    const avgResponseTime =
      recentMetrics.length > 0
        ? recentMetrics.reduce((sum, m) => sum + m.responseTime, 0) / recentMetrics.length
        : 0;

    const successfulCalls = recentMetrics.filter(m => m.success).length;
    const apiSuccessRate =
      recentMetrics.length > 0 ? (successfulCalls / recentMetrics.length) * 100 : 100;

    // Determine overall health
    let overallHealth: 'healthy' | 'degraded' | 'critical' = 'healthy';
    if (criticalAlerts > 0 || apiSuccessRate < 90) {
      overallHealth = 'critical';
    } else if (activeAlerts > 0 || apiSuccessRate < 95 || avgResponseTime > 10000) {
      overallHealth = 'degraded';
    }

    return {
      overallHealth,
      activeAlerts,
      criticalAlerts,
      avgResponseTime,
      apiSuccessRate,
      complianceScore: this.calculateComplianceScore(recentMetrics)
    };
  }

  // Alert Management
  addAlertListener(listener: (alert: SystemAlert) => void): void {
    this.alertListeners.push(listener);
  }

  removeAlertListener(listener: (alert: SystemAlert) => void): void {
    const index = this.alertListeners.indexOf(listener);
    if (index > -1) {
      this.alertListeners.splice(index, 1);
    }
  }

  private notifyListeners(alert: SystemAlert): void {
    this.alertListeners.forEach(listener => {
      try {
        listener(alert);
      } catch (error) {
        console.error('Error in alert listener:', error);
      }
    });
  }

  getActiveAlerts(): SystemAlert[] {
    return this.alerts.filter(a => !a.resolved);
  }

  resolveAlert(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
    }
  }

  // Regulatory Compliance Helpers
  analyzeRegulatoryFlags(event: any): Record<string, any> {
    return {
      sfdr_article: event.classification,
      confidence_level:
        event.confidence >= 0.9 ? 'high' : event.confidence >= 0.7 ? 'medium' : 'low',
      requires_review: event.confidence < 0.7,
      data_lineage: {
        input_hash: this.hashInput(event.inputText),
        model_version: event.modelVersion,
        strategy: event.strategy
      }
    };
  }

  generateExplainabilityData(event: any): Record<string, any> {
    return {
      reasoning: `Classification based on ${event.strategy} strategy`,
      confidence_factors: {
        model_certainty: event.confidence,
        input_quality: this.assessInputQuality(event.inputText),
        strategy_reliability: this.getStrategyReliability(event.strategy)
      },
      alternative_classifications: [],
      human_review_recommended: event.confidence < 0.7
    };
  }

  private calculateComplianceScore(metrics: PerformanceMetric[]): number {
    if (metrics.length === 0) {
      return 100;
    }

    const classificationMetrics = metrics.filter(m => m.service === 'llm-classification');
    const highConfidenceClassifications = classificationMetrics.filter(m => m.success).length;

    return classificationMetrics.length > 0
      ? (highConfidenceClassifications / classificationMetrics.length) * 100
      : 100;
  }

  private hashInput(input: string): string {
    // Simple hash for audit trail (not for security)
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(16);
  }

  private assessInputQuality(input: string): number {
    // Basic input quality assessment
    if (input.length < 10) {
      return 0.3;
    }
    if (input.length < 50) {
      return 0.6;
    }
    if (input.length < 200) {
      return 0.8;
    }
    return 1.0;
  }

  private getStrategyReliability(strategy: string): number {
    const strategyReliability: Record<string, number> = {
      primary: 0.95,
      secondary: 0.9,
      hybrid: 0.85,
      fallback: 0.7
    };
    return strategyReliability[strategy] || 0.7;
  }
}

export const enterpriseMonitoring = EnterpriseMonitoringService.getInstance();
export type { SystemAlert, PerformanceMetric, ComplianceEvent };
