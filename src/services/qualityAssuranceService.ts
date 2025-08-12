/**
 * Quality Assurance Service
 * Implements response quality validation, A/B testing, and performance monitoring
 * Ensures LLM responses meet regulatory standards and business requirements
 */

import { supabase } from '@/integrations/supabase/client';
import { enterpriseMonitoring } from './enterpriseMonitoringService';

export interface QualityMetrics {
  confidence_threshold: number;
  response_time_ms: number;
  accuracy_score: number;
  completeness_score: number;
  regulatory_compliance: boolean;
}

export interface ABTestConfig {
  test_id: string;
  strategy_a: string;
  strategy_b: string;
  traffic_split: number; // 0-100 percentage for strategy A
  success_metrics: string[];
  min_sample_size: number;
}

export interface SLAMetric {
  metric_type: 'response_time' | 'uptime' | 'accuracy' | 'availability';
  metric_value: number;
  threshold_value: number;
  service_name: string;
  additional_data?: any;
}

class QualityAssuranceService {
  private static instance: QualityAssuranceService;
  private readonly CONFIDENCE_THRESHOLD = 0.7;
  private readonly RESPONSE_TIME_THRESHOLD = 10000; // 10 seconds
  
  public static getInstance(): QualityAssuranceService {
    if (!QualityAssuranceService.instance) {
      QualityAssuranceService.instance = new QualityAssuranceService();
    }
    return QualityAssuranceService.instance;
  }

  /**
   * Validate LLM response quality against regulatory standards
   */
  async validateResponseQuality(response: any, processingTimeMs: number): Promise<{
    isValid: boolean;
    issues: string[];
    metrics: QualityMetrics;
    recommendations: string[];
  }> {
    const issues: string[] = [];
    const recommendations: string[] = [];
    
    // Confidence validation
    const confidence = response.confidence || 0;
    if (confidence < this.CONFIDENCE_THRESHOLD) {
      issues.push(`Low confidence score: ${confidence} < ${this.CONFIDENCE_THRESHOLD}`);
      recommendations.push('Consider manual review or request additional information');
    }

    // Response time validation
    if (processingTimeMs > this.RESPONSE_TIME_THRESHOLD) {
      issues.push(`Slow response time: ${processingTimeMs}ms > ${this.RESPONSE_TIME_THRESHOLD}ms`);
      recommendations.push('Optimize processing pipeline or implement caching');
    }

    // Classification validity
    const validClassifications = ['Article 6', 'Article 8', 'Article 9'];
    if (!validClassifications.includes(response.classification)) {
      issues.push(`Invalid classification: ${response.classification}`);
      recommendations.push('Ensure classification matches SFDR article definitions');
    }

    // Completeness check
    const completenessScore = this.calculateCompletenessScore(response);
    if (completenessScore < 0.8) {
      issues.push(`Incomplete response data: ${completenessScore} completeness`);
      recommendations.push('Enhance input validation and processing completeness');
    }

    const metrics: QualityMetrics = {
      confidence_threshold: confidence,
      response_time_ms: processingTimeMs,
      accuracy_score: this.estimateAccuracyScore(response),
      completeness_score: completenessScore,
      regulatory_compliance: issues.length === 0
    };

    // Record SLA metrics
    await this.recordSLAMetrics([
      {
        metric_type: 'response_time',
        metric_value: processingTimeMs,
        threshold_value: this.RESPONSE_TIME_THRESHOLD,
        service_name: 'nexus_classification'
      },
      {
        metric_type: 'accuracy',
        metric_value: confidence,
        threshold_value: this.CONFIDENCE_THRESHOLD,
        service_name: 'nexus_classification'
      }
    ]);

    return {
      isValid: issues.length === 0,
      issues,
      metrics,
      recommendations
    };
  }

  /**
   * Implement A/B testing for classification strategies
   */
  async executeABTest(testConfig: ABTestConfig): Promise<{
    strategy_used: string;
    test_group: 'A' | 'B';
    result: any;
  }> {
    // Determine which strategy to use based on traffic split
    const random = Math.random() * 100;
    const useStrategyA = random < testConfig.traffic_split;
    const strategy = useStrategyA ? testConfig.strategy_a : testConfig.strategy_b;
    const testGroup = useStrategyA ? 'A' : 'B';

    // Log A/B test execution
    await this.recordBusinessMetric('ab_test_execution', 1, 'count', 'daily', {
      test_id: testConfig.test_id,
      strategy_used: strategy,
      test_group: testGroup
    });

    // Return configuration for the calling service to use
    return {
      strategy_used: strategy,
      test_group: testGroup,
      result: null // Will be filled by the calling service
    };
  }

  /**
   * Record SLA metrics for monitoring
   */
  async recordSLAMetrics(metrics: SLAMetric[]): Promise<void> {
    try {
      const records = metrics.map(metric => ({
        ...metric,
        is_breached: metric.metric_value > metric.threshold_value,
        measurement_timestamp: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('sla_metrics')
        .insert(records);

      if (error) {
        console.error('Failed to record SLA metrics:', error);
      }

      // Check for SLA breaches and trigger alerts
      for (const record of records) {
        if (record.is_breached) {
          await enterpriseMonitoring.recordSystemHealth({
            service: record.service_name,
            status: 'warning',
            responseTime: record.metric_value,
            details: {
              sla_breach: true,
              metric_type: record.metric_type,
              threshold: record.threshold_value,
              actual: record.metric_value
            }
          });
        }
      }
    } catch (error) {
      console.error('Error recording SLA metrics:', error);
    }
  }

  /**
   * Record business metrics for performance tracking
   */
  async recordBusinessMetric(
    metricName: string, 
    value: number, 
    unit: string = 'count',
    period: string = 'daily',
    tags: any = {}
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('business_metrics')
        .insert([{
          metric_name: metricName,
          metric_value: value,
          metric_unit: unit,
          measurement_period: period,
          tags,
          created_at: new Date().toISOString()
        }]);

      if (error) {
        console.error('Failed to record business metric:', error);
      }
    } catch (error) {
      console.error('Error recording business metric:', error);
    }
  }

  /**
   * Generate quality dashboard data
   */
  async getQualityDashboard(timeRange: { start: Date; end: Date }): Promise<any> {
    try {
      // Fetch SLA metrics
      const { data: slaMetrics, error: slaError } = await supabase
        .from('sla_metrics')
        .select('*')
        .gte('measurement_timestamp', timeRange.start.toISOString())
        .lte('measurement_timestamp', timeRange.end.toISOString())
        .order('measurement_timestamp', { ascending: false });

      if (slaError) {
        console.error('Failed to fetch SLA metrics:', slaError);
      }

      // Fetch business metrics
      const { data: businessMetrics, error: businessError } = await supabase
        .from('business_metrics')
        .select('*')
        .gte('created_at', timeRange.start.toISOString())
        .lte('created_at', timeRange.end.toISOString())
        .order('created_at', { ascending: false });

      if (businessError) {
        console.error('Failed to fetch business metrics:', businessError);
      }

      return {
        sla_summary: this.analyzeSLAMetrics(slaMetrics || []),
        business_summary: this.analyzeBusinessMetrics(businessMetrics || []),
        quality_trends: this.calculateQualityTrends(slaMetrics || []),
        performance_insights: this.generatePerformanceInsights(slaMetrics || [], businessMetrics || [])
      };
    } catch (error) {
      console.error('Error generating quality dashboard:', error);
      throw error;
    }
  }

  /**
   * Predictive alerting for quota exhaustion and performance degradation
   */
  async checkPredictiveAlerts(): Promise<void> {
    try {
      const now = new Date();
      const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);

      // Check recent response times for trend analysis
      const { data: recentMetrics } = await supabase
        .from('sla_metrics')
        .select('*')
        .eq('metric_type', 'response_time')
        .gte('measurement_timestamp', hourAgo.toISOString())
        .order('measurement_timestamp', { ascending: true });

      if (recentMetrics && recentMetrics.length > 5) {
        const trend = this.calculateTrend(recentMetrics.map(m => m.metric_value));
        
        if (trend > 0.2) { // 20% increase trend
          await enterpriseMonitoring.recordSystemHealth({
            service: 'nexus_classification',
            status: 'warning',
            responseTime: 0,
            details: {
              alert_type: 'predictive',
              trend_analysis: 'Increasing response times detected',
              trend_value: trend,
              recommendation: 'Consider scaling up resources or optimizing queries'
            }
          });
        }
      }

      // Check for usage patterns that might indicate quota exhaustion
      const { data: usageMetrics } = await supabase
        .from('business_metrics')
        .select('*')
        .eq('metric_name', 'api_calls')
        .gte('created_at', hourAgo.toISOString());

      if (usageMetrics && usageMetrics.length > 0) {
        const totalCalls = usageMetrics.reduce((sum, metric) => sum + metric.metric_value, 0);
        const hourlyRate = totalCalls;
        const dailyProjection = hourlyRate * 24;

        if (dailyProjection > 8000) { // Approaching daily limits
          await enterpriseMonitoring.recordSystemHealth({
            service: 'nexus_classification',
            status: 'warning',
            responseTime: 0,
            details: {
              alert_type: 'quota_warning',
              projected_daily_usage: dailyProjection,
              recommendation: 'Monitor API usage and consider rate limiting or quota increases'
            }
          });
        }
      }
    } catch (error) {
      console.error('Error in predictive alerting:', error);
    }
  }

  // Private helper methods
  private calculateCompletenessScore(response: any): number {
    const requiredFields = ['classification', 'confidence'];
    const optionalFields = ['processing_time', 'explanation', 'regulatory_basis'];
    
    const presentRequired = requiredFields.filter(field => response[field] !== undefined).length;
    const presentOptional = optionalFields.filter(field => response[field] !== undefined).length;
    
    const requiredScore = presentRequired / requiredFields.length;
    const optionalScore = presentOptional / optionalFields.length;
    
    return (requiredScore * 0.8) + (optionalScore * 0.2);
  }

  private estimateAccuracyScore(response: any): number {
    // Use confidence as a proxy for accuracy
    // In production, this would be based on validation against known correct answers
    return response.confidence || 0;
  }

  private analyzeSLAMetrics(metrics: any[]): any {
    if (metrics.length === 0) {
      return { total_metrics: 0, breach_rate: 0, avg_response_time: 0 };
    }

    const breaches = metrics.filter(m => m.is_breached).length;
    const responseTimeMetrics = metrics.filter(m => m.metric_type === 'response_time');
    const avgResponseTime = responseTimeMetrics.length > 0
      ? responseTimeMetrics.reduce((sum, m) => sum + m.metric_value, 0) / responseTimeMetrics.length
      : 0;

    return {
      total_metrics: metrics.length,
      breach_rate: (breaches / metrics.length) * 100,
      avg_response_time: avgResponseTime,
      uptime: this.calculateUptime(metrics),
      accuracy_rate: this.calculateAccuracyRate(metrics)
    };
  }

  private analyzeBusinessMetrics(metrics: any[]): any {
    const groupedMetrics = metrics.reduce((acc, metric) => {
      if (!acc[metric.metric_name]) {
        acc[metric.metric_name] = [];
      }
      acc[metric.metric_name].push(metric.metric_value);
      return acc;
    }, {} as Record<string, number[]>);

    const summary = Object.entries(groupedMetrics).map(([name, values]) => ({
      metric_name: name,
      total: values.reduce((sum, val) => sum + val, 0),
      average: values.reduce((sum, val) => sum + val, 0) / values.length,
      count: values.length
    }));

    return summary;
  }

  private calculateQualityTrends(metrics: any[]): any {
    const responseTimeMetrics = metrics
      .filter(m => m.metric_type === 'response_time')
      .sort((a, b) => new Date(a.measurement_timestamp).getTime() - new Date(b.measurement_timestamp).getTime());

    const accuracyMetrics = metrics
      .filter(m => m.metric_type === 'accuracy')
      .sort((a, b) => new Date(a.measurement_timestamp).getTime() - new Date(b.measurement_timestamp).getTime());

    return {
      response_time_trend: this.calculateTrend(responseTimeMetrics.map(m => m.metric_value)),
      accuracy_trend: this.calculateTrend(accuracyMetrics.map(m => m.metric_value)),
      quality_score_trend: this.calculateOverallQualityTrend(metrics)
    };
  }

  private generatePerformanceInsights(slaMetrics: any[], businessMetrics: any[]): string[] {
    const insights: string[] = [];

    // Response time insights
    const responseTimeMetrics = slaMetrics.filter(m => m.metric_type === 'response_time');
    if (responseTimeMetrics.length > 0) {
      const avgResponseTime = responseTimeMetrics.reduce((sum, m) => sum + m.metric_value, 0) / responseTimeMetrics.length;
      if (avgResponseTime > 5000) {
        insights.push('Average response time exceeds 5 seconds - consider optimization');
      }
    }

    // Accuracy insights
    const accuracyMetrics = slaMetrics.filter(m => m.metric_type === 'accuracy');
    if (accuracyMetrics.length > 0) {
      const avgAccuracy = accuracyMetrics.reduce((sum, m) => sum + m.metric_value, 0) / accuracyMetrics.length;
      if (avgAccuracy < 0.8) {
        insights.push('Accuracy below target threshold - review classification models');
      }
    }

    // Usage pattern insights
    const apiCallMetrics = businessMetrics.filter(m => m.metric_name === 'api_calls');
    if (apiCallMetrics.length > 0) {
      const totalCalls = apiCallMetrics.reduce((sum, m) => sum + m.metric_value, 0);
      if (totalCalls > 1000) {
        insights.push('High API usage detected - monitor for quota limits');
      }
    }

    return insights;
  }

  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;
    
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
    
    return (secondAvg - firstAvg) / firstAvg;
  }

  private calculateUptime(metrics: any[]): number {
    const uptimeMetrics = metrics.filter(m => m.metric_type === 'uptime');
    if (uptimeMetrics.length === 0) return 100;
    
    return uptimeMetrics.reduce((sum, m) => sum + m.metric_value, 0) / uptimeMetrics.length;
  }

  private calculateAccuracyRate(metrics: any[]): number {
    const accuracyMetrics = metrics.filter(m => m.metric_type === 'accuracy');
    if (accuracyMetrics.length === 0) return 100;
    
    return (accuracyMetrics.reduce((sum, m) => sum + m.metric_value, 0) / accuracyMetrics.length) * 100;
  }

  private calculateOverallQualityTrend(metrics: any[]): number {
    const qualityScores = metrics.map(m => {
      if (m.is_breached) return 0;
      if (m.metric_type === 'response_time') return Math.max(0, 1 - (m.metric_value / m.threshold_value));
      if (m.metric_type === 'accuracy') return m.metric_value;
      return 1;
    });

    return this.calculateTrend(qualityScores);
  }
}

export const qualityAssurance = QualityAssuranceService.getInstance();
export default qualityAssurance;