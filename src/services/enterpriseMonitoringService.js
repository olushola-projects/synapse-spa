// Enterprise Monitoring Service for SFDR Navigator
// Implements comprehensive monitoring, alerting, and regulatory compliance tracking
import { supabase } from '@/integrations/supabase/client';
class EnterpriseMonitoringService {
  static instance;
  alerts = [];
  metrics = [];
  alertListeners = [];
  static getInstance() {
    if (!EnterpriseMonitoringService.instance) {
      EnterpriseMonitoringService.instance = new EnterpriseMonitoringService();
    }
    return EnterpriseMonitoringService.instance;
  }
  // PHASE 1: Critical Authentication Monitoring
  async recordAuthenticationFailure(details) {
    const alert = {
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
  async recordLLMClassification(event) {
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
      const alert = {
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
  async recordSystemHealth(service, status, details) {
    try {
      // Log system health for monitoring
      console.log(`📊 System Health: ${service} - ${status}`, details);
      // Create alert for degraded services
      if (status === 'critical' || status === 'down') {
        const alert = {
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
  async getSystemOverview() {
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
    let overallHealth = 'healthy';
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
  addAlertListener(listener) {
    this.alertListeners.push(listener);
  }
  removeAlertListener(listener) {
    const index = this.alertListeners.indexOf(listener);
    if (index > -1) {
      this.alertListeners.splice(index, 1);
    }
  }
  notifyListeners(alert) {
    this.alertListeners.forEach(listener => {
      try {
        listener(alert);
      } catch (error) {
        console.error('Error in alert listener:', error);
      }
    });
  }
  getActiveAlerts() {
    return this.alerts.filter(a => !a.resolved);
  }
  resolveAlert(alertId) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
    }
  }
  // Regulatory Compliance Helpers
  analyzeRegulatoryFlags(event) {
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
  generateExplainabilityData(event) {
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
  calculateComplianceScore(metrics) {
    if (metrics.length === 0) {
      return 100;
    }
    const classificationMetrics = metrics.filter(m => m.service === 'llm-classification');
    const highConfidenceClassifications = classificationMetrics.filter(m => m.success).length;
    return classificationMetrics.length > 0
      ? (highConfidenceClassifications / classificationMetrics.length) * 100
      : 100;
  }
  hashInput(input) {
    // Simple hash for audit trail (not for security)
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(16);
  }
  assessInputQuality(input) {
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
  getStrategyReliability(strategy) {
    const strategyReliability = {
      primary: 0.95,
      secondary: 0.9,
      hybrid: 0.85,
      fallback: 0.7
    };
    return strategyReliability[strategy] || 0.7;
  }
}
export const enterpriseMonitoring = EnterpriseMonitoringService.getInstance();
