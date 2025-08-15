/**
 * Performance Monitoring for Enhanced SFDR Backend
 * Real-time tracking of API performance, classification accuracy, and system health
 */

import { backendApiClient } from '@/services/backendApiClient';

export interface PerformanceMetric {
  id: string;
  timestamp: string;
  metric: string;
  value: number;
  unit: string;
  context?: Record<string, any>;
}

export interface ClassificationMetrics {
  total_requests: number;
  success_rate: number;
  average_response_time: number;
  confidence_distribution: {
    low: number;    // < 60%
    medium: number; // 60-80%
    high: number;   // > 80%
  };
  classification_distribution: {
    article_6: number;
    article_8: number;
    article_9: number;
  };
  error_rate: number;
  last_updated: string;
}

export interface SystemHealthMetrics {
  api_status: 'healthy' | 'degraded' | 'critical';
  response_time_p50: number;
  response_time_p90: number;
  response_time_p99: number;
  error_rate_1h: number;
  uptime_percentage: number;
  last_health_check: string;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private classificationHistory: any[] = [];
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private metricsInterval: NodeJS.Timeout | null = null;
  
  private readonly MAX_METRICS_HISTORY = 1000;
  private readonly HEALTH_CHECK_INTERVAL = 30000; // 30 seconds
  private readonly METRICS_UPDATE_INTERVAL = 60000; // 1 minute

  constructor() {
    this.startMonitoring();
  }

  /**
   * Start continuous monitoring
   */
  startMonitoring(): void {
    console.log('📊 Starting performance monitoring...');
    
    // Regular health checks
    this.healthCheckInterval = setInterval(() => {
      this.performHealthCheck();
    }, this.HEALTH_CHECK_INTERVAL);

    // Metrics collection
    this.metricsInterval = setInterval(() => {
      this.updateMetrics();
    }, this.METRICS_UPDATE_INTERVAL);

    // Initial health check
    this.performHealthCheck();
  }

  /**
   * Stop monitoring
   */
  stopMonitoring(): void {
    console.log('📊 Stopping performance monitoring...');
    
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }

    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
      this.metricsInterval = null;
    }
  }

  /**
   * Record a performance metric
   */
  recordMetric(metric: string, value: number, unit: string, context?: Record<string, any>): void {
    const performanceMetric: PerformanceMetric = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      metric,
      value,
      unit,
      context
    };

    this.metrics.push(performanceMetric);

    // Keep only recent metrics
    if (this.metrics.length > this.MAX_METRICS_HISTORY) {
      this.metrics = this.metrics.slice(-this.MAX_METRICS_HISTORY);
    }

    console.log(`📈 Metric recorded: ${metric} = ${value}${unit}`, context);
  }

  /**
   * Record classification request metrics
   */
  recordClassification(
    request: any,
    response: any,
    startTime: number,
    endTime: number
  ): void {
    const duration = endTime - startTime;
    const classification = response?.data?.classification || 'unknown';
    const confidence = response?.data?.confidence || 0;
    const success = !response?.error;

    // Record timing
    this.recordMetric('api_response_time', duration, 'ms', {
      endpoint: 'classify',
      classification,
      confidence,
      success
    });

    // Record confidence score
    this.recordMetric('classification_confidence', confidence, '%', {
      classification,
      text_length: request.text?.length || 0
    });

    // Store for analysis
    const classificationRecord = {
      timestamp: new Date().toISOString(),
      request: {
        text_length: request.text?.length || 0,
        document_type: request.document_type,
        strategy: request.strategy
      },
      response: {
        classification,
        confidence,
        processing_time: response?.data?.processing_time || duration,
        success,
        error: response?.error
      },
      duration
    };

    this.classificationHistory.push(classificationRecord);

    // Keep only recent history
    if (this.classificationHistory.length > this.MAX_METRICS_HISTORY) {
      this.classificationHistory = this.classificationHistory.slice(-this.MAX_METRICS_HISTORY);
    }
  }

  /**
   * Perform system health check
   */
  private async performHealthCheck(): Promise<void> {
    const startTime = Date.now();
    
    try {
      const response = await backendApiClient.healthCheck();
      const duration = Date.now() - startTime;
      
      this.recordMetric('health_check_time', duration, 'ms', {
        status: response.error ? 'error' : 'success',
        error: response.error
      });

      if (response.error) {
        console.warn(`⚠️ Health check failed: ${response.error}`);
        this.recordMetric('health_check_status', 0, 'boolean');
      } else {
        this.recordMetric('health_check_status', 1, 'boolean');
        console.log(`💚 Health check passed (${duration}ms)`);
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`💔 Health check error:`, error);
      
      this.recordMetric('health_check_time', duration, 'ms', {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      this.recordMetric('health_check_status', 0, 'boolean');
    }
  }

  /**
   * Update aggregate metrics
   */
  private updateMetrics(): void {
    const now = new Date().toISOString();
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    // Filter recent classifications
    const recentClassifications = this.classificationHistory.filter(
      record => record.timestamp > oneHourAgo
    );

    if (recentClassifications.length > 0) {
      // Calculate success rate
      const successfulRequests = recentClassifications.filter(r => r.response.success).length;
      const successRate = (successfulRequests / recentClassifications.length) * 100;
      
      this.recordMetric('success_rate_1h', successRate, '%');

      // Calculate average response time
      const totalTime = recentClassifications.reduce((sum, r) => sum + r.duration, 0);
      const avgResponseTime = totalTime / recentClassifications.length;
      
      this.recordMetric('avg_response_time_1h', avgResponseTime, 'ms');

      // Calculate confidence distribution
      const confidences = recentClassifications
        .filter(r => r.response.success)
        .map(r => r.response.confidence);

      if (confidences.length > 0) {
        const avgConfidence = confidences.reduce((sum, c) => sum + c, 0) / confidences.length;
        this.recordMetric('avg_confidence_1h', avgConfidence, '%');
      }

      console.log(`📊 Metrics updated: ${recentClassifications.length} requests, ${successRate.toFixed(1)}% success`);
    }
  }

  /**
   * Get classification metrics
   */
  getClassificationMetrics(): ClassificationMetrics {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const recentClassifications = this.classificationHistory.filter(
      record => record.timestamp > oneHourAgo
    );

    const successfulClassifications = recentClassifications.filter(r => r.response.success);
    
    // Calculate confidence distribution
    const confidenceDistribution = {
      low: 0,
      medium: 0,
      high: 0
    };

    successfulClassifications.forEach(record => {
      const confidence = record.response.confidence;
      if (confidence < 60) confidenceDistribution.low++;
      else if (confidence <= 80) confidenceDistribution.medium++;
      else confidenceDistribution.high++;
    });

    // Calculate classification distribution
    const classificationDistribution = {
      article_6: 0,
      article_8: 0,
      article_9: 0
    };

    successfulClassifications.forEach(record => {
      const classification = record.response.classification;
      if (classification === 'Article 6') classificationDistribution.article_6++;
      else if (classification === 'Article 8') classificationDistribution.article_8++;
      else if (classification === 'Article 9') classificationDistribution.article_9++;
    });

    const totalRequests = recentClassifications.length;
    const successfulRequests = successfulClassifications.length;
    const avgResponseTime = totalRequests > 0 
      ? recentClassifications.reduce((sum, r) => sum + r.duration, 0) / totalRequests 
      : 0;

    return {
      total_requests: totalRequests,
      success_rate: totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 0,
      average_response_time: avgResponseTime,
      confidence_distribution: confidenceDistribution,
      classification_distribution: classificationDistribution,
      error_rate: totalRequests > 0 ? ((totalRequests - successfulRequests) / totalRequests) * 100 : 0,
      last_updated: new Date().toISOString()
    };
  }

  /**
   * Get system health metrics
   */
  getSystemHealthMetrics(): SystemHealthMetrics {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    
    // Get recent health checks
    const recentHealthChecks = this.metrics.filter(
      m => m.metric === 'health_check_status' && m.timestamp > oneHourAgo
    );

    const healthCheckSuccesses = recentHealthChecks.filter(m => m.value === 1).length;
    const uptimePercentage = recentHealthChecks.length > 0 
      ? (healthCheckSuccesses / recentHealthChecks.length) * 100 
      : 0;

    // Get response time percentiles
    const recentResponseTimes = this.metrics
      .filter(m => m.metric === 'api_response_time' && m.timestamp > oneHourAgo)
      .map(m => m.value)
      .sort((a, b) => a - b);

    const getPercentile = (percentile: number): number => {
      if (recentResponseTimes.length === 0) return 0;
      const index = Math.ceil((percentile / 100) * recentResponseTimes.length) - 1;
      return recentResponseTimes[Math.max(0, index)];
    };

    // Calculate error rate
    const recentClassifications = this.classificationHistory.filter(
      record => record.timestamp > oneHourAgo
    );
    const errorRate = recentClassifications.length > 0
      ? ((recentClassifications.filter(r => !r.response.success).length) / recentClassifications.length) * 100
      : 0;

    // Determine API status
    let apiStatus: 'healthy' | 'degraded' | 'critical' = 'healthy';
    if (errorRate > 10 || uptimePercentage < 95) {
      apiStatus = 'critical';
    } else if (errorRate > 5 || uptimePercentage < 98) {
      apiStatus = 'degraded';
    }

    return {
      api_status: apiStatus,
      response_time_p50: getPercentile(50),
      response_time_p90: getPercentile(90),
      response_time_p99: getPercentile(99),
      error_rate_1h: errorRate,
      uptime_percentage: uptimePercentage,
      last_health_check: recentHealthChecks.length > 0 
        ? recentHealthChecks[recentHealthChecks.length - 1].timestamp
        : new Date().toISOString()
    };
  }

  /**
   * Get recent metrics
   */
  getRecentMetrics(hours: number = 1): PerformanceMetric[] {
    const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
    return this.metrics.filter(m => m.timestamp > cutoffTime);
  }

  /**
   * Export metrics for analysis
   */
  exportMetrics(): {
    metrics: PerformanceMetric[];
    classifications: any[];
    summary: {
      classification_metrics: ClassificationMetrics;
      health_metrics: SystemHealthMetrics;
    };
  } {
    return {
      metrics: this.metrics,
      classifications: this.classificationHistory,
      summary: {
        classification_metrics: this.getClassificationMetrics(),
        health_metrics: this.getSystemHealthMetrics()
      }
    };
  }

  /**
   * Clear metrics history
   */
  clearMetrics(): void {
    this.metrics = [];
    this.classificationHistory = [];
    console.log('📊 Metrics cleared');
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * Hook for monitoring API calls
 */
export const useApiMonitoring = () => {
  const recordClassification = (
    request: any,
    response: any,
    startTime: number,
    endTime: number
  ) => {
    performanceMonitor.recordClassification(request, response, startTime, endTime);
  };

  const getMetrics = () => ({
    classification: performanceMonitor.getClassificationMetrics(),
    health: performanceMonitor.getSystemHealthMetrics()
  });

  return {
    recordClassification,
    getMetrics,
    exportMetrics: () => performanceMonitor.exportMetrics(),
    clearMetrics: () => performanceMonitor.clearMetrics()
  };
};
