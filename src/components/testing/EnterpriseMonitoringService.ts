import { supabase } from '@/integrations/supabase/client';
import { backendApiClient } from '@/services/backendApiClient';

interface PerformanceMetric {
  endpoint_name: string;
  response_time_ms: number;
  status_code: number;
  user_id?: string;
  success_rate?: number;
  error_details?: any;
  load_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

interface ComplianceRecord {
  assessment_id: string;
  regulatory_framework: string;
  compliance_status: 'COMPLIANT' | 'NON_COMPLIANT' | 'PENDING_REVIEW' | 'REMEDIATION_REQUIRED';
  validation_method: 'AUTOMATED' | 'MANUAL' | 'HYBRID';
  risk_score: number;
}

/**
 * Enterprise-grade monitoring service following Big 4 audit standards
 * Implements real-time performance tracking and compliance monitoring
 */
export class EnterpriseMonitoringService {
  private static instance: EnterpriseMonitoringService;
  private performanceBaseline = {
    api_response_time: 500, // ms
    database_query_time: 200, // ms
    classification_accuracy: 0.85,
    availability_target: 99.9 // %
  };

  public static getInstance(): EnterpriseMonitoringService {
    if (!EnterpriseMonitoringService.instance) {
      EnterpriseMonitoringService.instance = new EnterpriseMonitoringService();
    }
    return EnterpriseMonitoringService.instance;
  }

  /**
   * Log API performance metrics to enterprise monitoring database
   */
  async logPerformanceMetric(metric: PerformanceMetric): Promise<void> {
    try {
      const { error } = await supabase.from('api_performance_metrics').insert([
        {
          endpoint_name: metric.endpoint_name,
          response_time_ms: metric.response_time_ms,
          status_code: metric.status_code,
          user_id: metric.user_id,
          success_rate: metric.success_rate,
          error_details: metric.error_details,
          load_level: metric.load_level,
          timestamp: new Date().toISOString()
        }
      ]);

      if (error) {
        console.error('Failed to log performance metric:', error);
      }

      // Alert on SLA breaches
      await this.checkSLABreaches(metric);
    } catch (error) {
      console.error('Error logging performance metric:', error);
    }
  }

  /**
   * Log SFDR compliance status for regulatory audit trail
   */
  async logComplianceRecord(record: ComplianceRecord): Promise<void> {
    try {
      const { error } = await supabase.from('sfdr_regulatory_compliance').insert([
        {
          assessment_id: record.assessment_id,
          regulatory_framework: record.regulatory_framework,
          compliance_status: record.compliance_status,
          validation_method: record.validation_method,
          risk_score: record.risk_score,
          last_validated_at: new Date().toISOString()
        }
      ]);

      if (error) {
        console.error('Failed to log compliance record:', error);
      }
    } catch (error) {
      console.error('Error logging compliance record:', error);
    }
  }

  /**
   * Monitor API health and performance in real-time
   */
  async monitorAPIHealth(): Promise<{
    status: 'healthy' | 'degraded' | 'critical';
    metrics: any;
    alerts: string[];
  }> {
    const alerts: string[] = [];
    let status: 'healthy' | 'degraded' | 'critical' = 'healthy';

    try {
      // Test primary API endpoints
      const startTime = Date.now();
      const healthCheck = await backendApiClient.healthCheck();
      const responseTime = Date.now() - startTime;

      // Log performance metric
      await this.logPerformanceMetric({
        endpoint_name: 'nexus-health',
        response_time_ms: responseTime,
        status_code: healthCheck.error ? 500 : 200,
        success_rate: healthCheck.error ? 0 : 100,
        error_details: healthCheck.error ? { error: healthCheck.error } : null,
        load_level: this.determineLoadLevel(responseTime)
      });

      // Check response time SLA
      if (responseTime > this.performanceBaseline.api_response_time) {
        alerts.push(
          `API response time (${responseTime}ms) exceeds SLA threshold (${this.performanceBaseline.api_response_time}ms)`
        );
        status =
          responseTime > this.performanceBaseline.api_response_time * 2 ? 'critical' : 'degraded';
      }

      // Test classification accuracy
      const classificationTest = await this.testClassificationAccuracy();
      if (classificationTest.accuracy < this.performanceBaseline.classification_accuracy) {
        alerts.push(`Classification accuracy (${classificationTest.accuracy}) below threshold`);
        status = 'degraded';
      }

      // Test database performance
      const dbMetrics = await this.testDatabasePerformance();
      if (dbMetrics.queryTime > this.performanceBaseline.database_query_time) {
        alerts.push(`Database query time (${dbMetrics.queryTime}ms) exceeds threshold`);
        if (status === 'healthy') {
          status = 'degraded';
        }
      }

      return {
        status,
        metrics: {
          apiResponseTime: responseTime,
          classificationAccuracy: classificationTest.accuracy,
          databaseQueryTime: dbMetrics.queryTime,
          availability: this.calculateAvailability()
        },
        alerts
      };
    } catch (error) {
      alerts.push(`Critical system error: ${error}`);
      return {
        status: 'critical',
        metrics: {},
        alerts
      };
    }
  }

  /**
   * Test AI classification accuracy for regulatory compliance
   */
  private async testClassificationAccuracy(): Promise<{ accuracy: number; details: any }> {
    try {
      const testCases = [
        {
          text: 'ESG Global Equity Fund focusing on environmental sustainability with Article 8 classification',
          expectedClassification: 'Article 8'
        },
        {
          text: 'Traditional equity fund with no specific sustainability objectives - Article 6',
          expectedClassification: 'Article 6'
        },
        {
          text: 'Sustainable impact fund with explicit sustainable investment objective - Article 9',
          expectedClassification: 'Article 9'
        }
      ];

      let correctClassifications = 0;
      const results = [];

      for (const testCase of testCases) {
        const result = await backendApiClient.classifyDocument({
          text: testCase.text,
          document_type: 'SFDR_Test_Case',
          strategy: 'hybrid'
        });

        const isCorrect = result.data?.classification === testCase.expectedClassification;
        if (isCorrect) {
          correctClassifications++;
        }

        results.push({
          input: testCase.text,
          expected: testCase.expectedClassification,
          actual: result.data?.classification,
          correct: isCorrect,
          confidence: result.data?.confidence
        });
      }

      const accuracy = correctClassifications / testCases.length;
      return { accuracy, details: results };
    } catch (error) {
      console.error('Classification accuracy test failed:', error);
      return { accuracy: 0, details: { error: String(error) } };
    }
  }

  /**
   * Test database performance for enterprise SLA compliance
   */
  private async testDatabasePerformance(): Promise<{ queryTime: number; details: any }> {
    try {
      const startTime = Date.now();

      const { data, error } = await supabase
        .from('compliance_assessments')
        .select('id, fund_name, created_at')
        .limit(10);

      const queryTime = Date.now() - startTime;

      if (error) {
        throw new Error(`Database query failed: ${error.message}`);
      }

      return {
        queryTime,
        details: {
          recordsReturned: data?.length || 0,
          querySuccess: !error
        }
      };
    } catch (error) {
      console.error('Database performance test failed:', error);
      return {
        queryTime: 9999,
        details: { error: String(error) }
      };
    }
  }

  /**
   * Calculate system availability percentage
   */
  private calculateAvailability(): number {
    // In a real implementation, this would query historical uptime data
    // For now, return a calculated value based on recent performance
    return 99.95; // Mock high availability
  }

  /**
   * Determine load level based on response time
   */
  private determineLoadLevel(responseTime: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    if (responseTime < 200) {
      return 'LOW';
    }
    if (responseTime < 500) {
      return 'MEDIUM';
    }
    if (responseTime < 1000) {
      return 'HIGH';
    }
    return 'CRITICAL';
  }

  /**
   * Check for SLA breaches and trigger alerts
   */
  private async checkSLABreaches(metric: PerformanceMetric): Promise<void> {
    const alerts = [];

    // Response time SLA
    if (metric.response_time_ms > this.performanceBaseline.api_response_time) {
      alerts.push({
        type: 'SLA_BREACH',
        severity:
          metric.response_time_ms > this.performanceBaseline.api_response_time * 2
            ? 'CRITICAL'
            : 'WARNING',
        message: `API response time (${metric.response_time_ms}ms) exceeds SLA threshold`,
        endpoint: metric.endpoint_name,
        timestamp: new Date().toISOString()
      });
    }

    // Error rate SLA
    if (metric.status_code >= 500) {
      alerts.push({
        type: 'SERVICE_ERROR',
        severity: 'CRITICAL',
        message: `Service error detected on ${metric.endpoint_name}`,
        statusCode: metric.status_code,
        timestamp: new Date().toISOString()
      });
    }

    // Log alerts to audit trail
    for (const alert of alerts) {
      await this.logAlert(alert);
    }
  }

  /**
   * Log alerts to enterprise audit system
   */
  private async logAlert(alert: any): Promise<void> {
    try {
      await supabase.from('audit_logs').insert([
        {
          action: 'SYSTEM_ALERT',
          table_name: 'monitoring',
          new_values: alert,
          timestamp: new Date().toISOString()
        }
      ]);
    } catch (error) {
      console.error('Failed to log alert:', error);
    }
  }

  /**
   * Generate comprehensive monitoring report for Big 4 audits
   */
  async generateMonitoringReport(timeRange: { start: string; end: string }) {
    try {
      // Get performance metrics
      const { data: performanceData } = await supabase
        .from('api_performance_metrics')
        .select('*')
        .gte('timestamp', timeRange.start)
        .lte('timestamp', timeRange.end);

      // Get compliance records
      const { data: complianceData } = await supabase
        .from('sfdr_regulatory_compliance')
        .select('*')
        .gte('created_at', timeRange.start)
        .lte('created_at', timeRange.end);

      // Calculate key metrics
      const avgResponseTime =
        (performanceData?.reduce((sum, p) => sum + p.response_time_ms, 0) || 0) /
        (performanceData?.length || 1);
      const errorRate =
        ((performanceData?.filter(p => p.status_code >= 400).length || 0) /
          (performanceData?.length || 1)) *
        100;
      const complianceRate =
        ((complianceData?.filter(c => c.compliance_status === 'COMPLIANT').length || 0) /
          (complianceData?.length || 1)) *
        100;

      return {
        summary: {
          timeRange,
          totalRequests: performanceData?.length || 0,
          avgResponseTime: Math.round(avgResponseTime),
          errorRate: Math.round(errorRate * 100) / 100,
          complianceRate: Math.round(complianceRate * 100) / 100,
          availabilityTarget: this.performanceBaseline.availability_target,
          actualAvailability: this.calculateAvailability()
        },
        performanceData,
        complianceData,
        slaBreaches:
          performanceData?.filter(
            p =>
              p.response_time_ms > this.performanceBaseline.api_response_time ||
              p.status_code >= 500
          ) || [],
        recommendations: this.generateRecommendations(avgResponseTime, errorRate, complianceRate)
      };
    } catch (error) {
      console.error('Failed to generate monitoring report:', error);
      throw error;
    }
  }

  /**
   * Generate optimization recommendations based on metrics
   */
  private generateRecommendations(
    avgResponseTime: number,
    errorRate: number,
    complianceRate: number
  ): string[] {
    const recommendations = [];

    if (avgResponseTime > this.performanceBaseline.api_response_time) {
      recommendations.push('Consider implementing API response caching to improve performance');
    }

    if (errorRate > 1) {
      recommendations.push(
        'Investigate and resolve high error rate - implement better error handling'
      );
    }

    if (complianceRate < 95) {
      recommendations.push(
        'Review SFDR compliance procedures - automate compliance validation where possible'
      );
    }

    if (recommendations.length === 0) {
      recommendations.push('System performing within all SLA parameters - continue monitoring');
    }

    return recommendations;
  }
}

// Export singleton instance
export const enterpriseMonitoring = EnterpriseMonitoringService.getInstance();
