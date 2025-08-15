/**
 * Performance Monitoring Service for SFDR Classification System
 * Tracks API response times, classification accuracy, and system health
 */

import { PerformanceMetrics, ClassificationAnalytics } from '@/types/enhanced-classification';

interface PerformanceEvent {
  type: 'classification' | 'health_check' | 'error';
  timestamp: string;
  data: any;
  duration?: number;
  success: boolean;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private events: PerformanceEvent[] = [];
  private maxEvents = 1000; // Keep last 1000 events
  private webhookUrl?: string;

  private constructor() {
    this.webhookUrl = process.env.MONITORING_WEBHOOK_URL || undefined;
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  /**
   * Track a classification event
   */
  trackClassification(
    startTime: number,
    endTime: number,
    request: any,
    response: any,
    success: boolean,
    error?: string
  ) {
    const event: PerformanceEvent = {
      type: 'classification',
      timestamp: new Date().toISOString(),
      duration: endTime - startTime,
      success,
      data: {
        request: {
          text_length: request.text?.length || 0,
          document_type: request.document_type,
          has_audit_trail: request.include_audit_trail,
          has_benchmark: request.include_benchmark_comparison
        },
        response: success ? {
          classification: response.classification,
          confidence: response.confidence,
          processing_time: response.processing_time,
          sustainability_score: response.sustainability_score,
          explainability_score: response.explainability_score,
          key_indicators_count: response.key_indicators?.length || 0,
          regulatory_citations_count: response.regulatory_basis?.length || 0
        } : null,
        error: error || null
      }
    };

    this.addEvent(event);
    this.sendToWebhook(event);
  }

  /**
   * Track a health check event
   */
  trackHealthCheck(duration: number, success: boolean, status?: any) {
    const event: PerformanceEvent = {
      type: 'health_check',
      timestamp: new Date().toISOString(),
      duration,
      success,
      data: {
        status: success ? status : null,
        endpoint: '/api/health'
      }
    };

    this.addEvent(event);
  }

  /**
   * Track an error event
   */
  trackError(error: Error, context: any) {
    const event: PerformanceEvent = {
      type: 'error',
      timestamp: new Date().toISOString(),
      success: false,
      data: {
        error: {
          message: error.message,
          name: error.name,
          stack: error.stack
        },
        context
      }
    };

    this.addEvent(event);
    this.sendToWebhook(event);
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): PerformanceMetrics {
    const recentEvents = this.getRecentEvents(60 * 60 * 1000); // Last hour
    const classificationEvents = recentEvents.filter(e => e.type === 'classification');
    const successfulClassifications = classificationEvents.filter(e => e.success);

    const responseTimes = successfulClassifications
      .map(e => e.duration)
      .filter(d => d !== undefined) as number[];

    const confidenceScores = successfulClassifications
      .map(e => e.data?.response?.confidence)
      .filter(c => c !== undefined) as number[];

    const avgResponseTime = responseTimes.length > 0 
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length 
      : 0;

    const avgConfidence = confidenceScores.length > 0
      ? confidenceScores.reduce((a, b) => a + b, 0) / confidenceScores.length
      : 0;

    const errorRate = classificationEvents.length > 0
      ? (classificationEvents.length - successfulClassifications.length) / classificationEvents.length
      : 0;

    // Calculate confidence distribution
    const highConfidence = confidenceScores.filter(c => c >= 0.8).length;
    const mediumConfidence = confidenceScores.filter(c => c >= 0.6 && c < 0.8).length;
    const lowConfidence = confidenceScores.filter(c => c < 0.6).length;
    const totalConfidenceScores = confidenceScores.length || 1;

    return {
      response_time: avgResponseTime,
      classification_accuracy: avgConfidence,
      confidence_distribution: {
        'high (80-100%)': highConfidence / totalConfidenceScores,
        'medium (60-79%)': mediumConfidence / totalConfidenceScores,
        'low (50-59%)': lowConfidence / totalConfidenceScores
      },
      error_rate: errorRate,
      throughput: (successfulClassifications.length / 60), // per minute
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get detailed analytics
   */
  getAnalytics(): ClassificationAnalytics {
    const allClassifications = this.events.filter(e => 
      e.type === 'classification' && e.success
    );

    const classifications = allClassifications.map(e => e.data.response.classification);
    const article6Count = classifications.filter(c => c.includes('Article 6')).length;
    const article8Count = classifications.filter(c => c.includes('Article 8')).length;
    const article9Count = classifications.filter(c => c.includes('Article 9')).length;
    const total = classifications.length || 1;

    const processingTimes = allClassifications
      .map(e => e.duration)
      .filter(d => d !== undefined)
      .sort((a, b) => a - b);

    const confidenceScores = allClassifications
      .map(e => e.data.response.confidence)
      .filter(c => c !== undefined);

    const avgConfidence = confidenceScores.length > 0
      ? confidenceScores.reduce((a, b) => a + b, 0) / confidenceScores.length
      : 0;

    return {
      total_classifications: allClassifications.length,
      article_distribution: {
        article_6: Math.round((article6Count / total) * 100),
        article_8: Math.round((article8Count / total) * 100),
        article_9: Math.round((article9Count / total) * 100)
      },
      average_confidence: avgConfidence,
      processing_times: {
        average: processingTimes.length > 0 
          ? processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length 
          : 0,
        p50: processingTimes[Math.floor(processingTimes.length * 0.5)] || 0,
        p90: processingTimes[Math.floor(processingTimes.length * 0.9)] || 0,
        p99: processingTimes[Math.floor(processingTimes.length * 0.99)] || 0
      },
      success_rate: this.getSuccessRate()
    };
  }

  /**
   * Get system health status
   */
  getHealthStatus(): {
    status: 'healthy' | 'degraded' | 'down';
    issues: string[];
    lastHealthCheck?: string;
  } {
    const recentEvents = this.getRecentEvents(5 * 60 * 1000); // Last 5 minutes
    const errorEvents = recentEvents.filter(e => !e.success);
    const healthChecks = recentEvents.filter(e => e.type === 'health_check');
    
    const errorRate = recentEvents.length > 0 
      ? errorEvents.length / recentEvents.length 
      : 0;

    const issues: string[] = [];
    let status: 'healthy' | 'degraded' | 'down' = 'healthy';

    if (errorRate > 0.1) {
      issues.push(`High error rate: ${(errorRate * 100).toFixed(1)}%`);
      status = 'degraded';
    }

    if (errorRate > 0.5) {
      status = 'down';
    }

    const lastHealthCheck = healthChecks.length > 0 
      ? healthChecks[healthChecks.length - 1].timestamp 
      : undefined;

    if (!lastHealthCheck) {
      issues.push('No recent health checks');
      status = 'degraded';
    }

    return {
      status,
      issues,
      lastHealthCheck
    };
  }

  /**
   * Get recent events
   */
  private getRecentEvents(timeWindow: number): PerformanceEvent[] {
    const cutoff = Date.now() - timeWindow;
    return this.events.filter(e => 
      new Date(e.timestamp).getTime() > cutoff
    );
  }

  /**
   * Add event to memory store
   */
  private addEvent(event: PerformanceEvent) {
    this.events.push(event);
    
    // Keep only the most recent events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }
  }

  /**
   * Calculate overall success rate
   */
  private getSuccessRate(): number {
    if (this.events.length === 0) return 1.0;
    
    const successfulEvents = this.events.filter(e => e.success).length;
    return successfulEvents / this.events.length;
  }

  /**
   * Send event to monitoring webhook
   */
  private async sendToWebhook(event: PerformanceEvent) {
    if (!this.webhookUrl) return;

    try {
      await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service: 'sfdr-classification',
          event,
          metrics: this.getMetrics()
        })
      });
    } catch (error) {
      console.warn('Failed to send monitoring webhook:', error);
    }
  }

  /**
   * Clear all stored events (for testing/reset)
   */
  clear() {
    this.events = [];
  }

  /**
   * Export events for analysis
   */
  exportEvents(): PerformanceEvent[] {
    return [...this.events];
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();

// Helper function to wrap API calls with monitoring
export const withPerformanceMonitoring = async <T>(
  operation: () => Promise<T>,
  context: any
): Promise<T> => {
  const startTime = performance.now();
  
  try {
    const result = await operation();
    const endTime = performance.now();
    
    performanceMonitor.trackClassification(
      startTime,
      endTime,
      context.request,
      result,
      true
    );
    
    return result;
  } catch (error) {
    const endTime = performance.now();
    
    performanceMonitor.trackClassification(
      startTime,
      endTime,
      context.request,
      null,
      false,
      error instanceof Error ? error.message : 'Unknown error'
    );
    
    throw error;
  }
};
