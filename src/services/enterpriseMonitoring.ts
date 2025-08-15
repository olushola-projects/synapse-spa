/**
 * Enterprise Monitoring Service
 * Provides comprehensive monitoring, alerting, and observability for SFDR Navigator
 * Implements industry-standard monitoring practices for RegTech applications
 */

import { config } from '@/config/environment';
import { backendApiClient } from './backendApiClient';
import { llmValidationService } from './llmValidationService';

export interface MetricData {
  name: string;
  value: number;
  unit: string;
  timestamp: string;
  tags?: Record<string, string>;
}

export interface HealthCheck {
  service: string;
  status: 'healthy' | 'degraded' | 'critical' | 'unknown';
  responseTime: number;
  message: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface Alert {
  id: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  service: string;
  timestamp: string;
  resolved: boolean;
  metadata?: Record<string, any>;
}

export interface SystemStatus {
  overall: 'healthy' | 'degraded' | 'critical';
  services: HealthCheck[];
  alerts: Alert[];
  metrics: MetricData[];
  lastUpdated: string;
  slaStatus: {
    availability: number;
    responseTime: number;
    errorRate: number;
  };
}

export class EnterpriseMonitoringService {
  private static instance: EnterpriseMonitoringService;
  private alerts: Alert[] = [];
  private metrics: MetricData[] = [];
  private healthChecks: HealthCheck[] = [];
  private monitoringInterval: NodeJS.Timeout | null = null;
  private subscribers: Array<(status: SystemStatus) => void> = [];

  // SLA Thresholds
  private readonly SLA_THRESHOLDS = {
    availability: 99.9, // 99.9% uptime
    responseTime: 5000, // 5 seconds max response time
    errorRate: 1.0 // Max 1% error rate
  };

  static getInstance(): EnterpriseMonitoringService {
    if (!EnterpriseMonitoringService.instance) {
      EnterpriseMonitoringService.instance = new EnterpriseMonitoringService();
    }
    return EnterpriseMonitoringService.instance;
  }

  /**
   * Start continuous monitoring
   */
  startMonitoring(intervalMs = 60000): void {
    if (this.monitoringInterval) {
      this.stopMonitoring();
    }

    console.log('📊 Starting enterprise monitoring...');

    // Initial check
    this.performComprehensiveCheck();

    // Set up periodic monitoring
    this.monitoringInterval = setInterval(() => {
      this.performComprehensiveCheck();
    }, intervalMs);
  }

  /**
   * Stop monitoring
   */
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      console.log('⏹️ Enterprise monitoring stopped');
    }
  }

  /**
   * Subscribe to system status updates
   */
  subscribe(callback: (status: SystemStatus) => void): () => void {
    this.subscribers.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  /**
   * Perform comprehensive system check
   */
  private async performComprehensiveCheck(): Promise<void> {
    const startTime = Date.now();

    try {
      console.log('🔍 Performing comprehensive system check...');

      // Run all health checks in parallel
      const [apiHealth, llmHealth, authHealth, performanceMetrics] = await Promise.allSettled([
        this.checkApiHealth(),
        this.checkLLMHealth(),
        this.checkAuthenticationHealth(),
        this.collectPerformanceMetrics()
      ]);

      // Process results and update system status
      this.processHealthCheckResults([
        { name: 'API', result: apiHealth },
        { name: 'LLM', result: llmHealth },
        { name: 'Auth', result: authHealth },
        { name: 'Performance', result: performanceMetrics }
      ]);

      // Calculate SLA metrics
      this.updateSLAMetrics();

      // Notify subscribers
      this.notifySubscribers();

      const checkDuration = Date.now() - startTime;
      console.log(`✅ System check completed in ${checkDuration}ms`);
    } catch (error) {
      console.error('❌ Comprehensive check failed:', error);
      this.addAlert({
        level: 'critical',
        title: 'Monitoring System Failure',
        message: 'Failed to perform system health check',
        service: 'monitoring',
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
    }
  }

  /**
   * Check API health and connectivity
   */
  private async checkApiHealth(): Promise<HealthCheck> {
    const startTime = Date.now();

    try {
      const response = await backendApiClient.healthCheck();
      const responseTime = Date.now() - startTime;

      if (response.error) {
        return {
          service: 'API',
          status: 'critical',
          responseTime,
          message: response.error,
          timestamp: new Date().toISOString(),
          metadata: { error: response.error }
        };
      }

      const status = responseTime > this.SLA_THRESHOLDS.responseTime ? 'degraded' : 'healthy';

      return {
        service: 'API',
        status,
        responseTime,
        message: response.data?.status === 'healthy' ? 'API operational' : 'API degraded',
        timestamp: new Date().toISOString(),
        metadata: response.data
      };
    } catch (error) {
      return {
        service: 'API',
        status: 'critical',
        responseTime: Date.now() - startTime,
        message: error instanceof Error ? error.message : 'Unknown API error',
        timestamp: new Date().toISOString(),
        metadata: { error }
      };
    }
  }

  /**
   * Check LLM health across all strategies
   */
  private async checkLLMHealth(): Promise<HealthCheck> {
    const startTime = Date.now();

    try {
      const validationResults = await llmValidationService.validateAllStrategies();
      const responseTime = Date.now() - startTime;

      let status: HealthCheck['status'];
      let message: string;

      switch (validationResults.overallStatus) {
        case 'healthy':
          status = 'healthy';
          message = `All ${validationResults.successfulStrategies} LLM strategies operational`;
          break;
        case 'degraded':
          status = 'degraded';
          message = `${validationResults.failedStrategies}/${validationResults.totalStrategies} LLM strategies failed`;
          break;
        case 'critical':
          status = 'critical';
          message = 'All LLM strategies failed';
          break;
        default:
          status = 'unknown';
          message = 'Unable to determine LLM status';
      }

      return {
        service: 'LLM',
        status,
        responseTime,
        message,
        timestamp: new Date().toISOString(),
        metadata: {
          totalStrategies: validationResults.totalStrategies,
          successfulStrategies: validationResults.successfulStrategies,
          failedStrategies: validationResults.failedStrategies,
          averageResponseTime: validationResults.averageResponseTime
        }
      };
    } catch (error) {
      return {
        service: 'LLM',
        status: 'critical',
        responseTime: Date.now() - startTime,
        message: error instanceof Error ? error.message : 'LLM validation failed',
        timestamp: new Date().toISOString(),
        metadata: { error }
      };
    }
  }

  /**
   * Check authentication health
   */
  private async checkAuthenticationHealth(): Promise<HealthCheck> {
    const startTime = Date.now();

    try {
      // Check if API key is properly configured
      const hasApiKey = !!(
        config.NEXUS_API_KEY &&
        config.NEXUS_API_KEY !== 'your_nexus_api_key' &&
        config.NEXUS_API_KEY !== 'demo_key_placeholder'
      );

      const responseTime = Date.now() - startTime;

      if (!hasApiKey) {
        return {
          service: 'Authentication',
          status: 'critical',
          responseTime,
          message: 'NEXUS_API_KEY not configured or using placeholder',
          timestamp: new Date().toISOString(),
          metadata: {
            configured: false,
            recommendation: 'Configure NEXUS_API_KEY in Supabase secrets'
          }
        };
      }

      // Test authentication with simple API call
      const authTest = await backendApiClient.healthCheck();

      return {
        service: 'Authentication',
        status: authTest.error ? 'degraded' : 'healthy',
        responseTime,
        message: authTest.error ? 'Authentication may be invalid' : 'Authentication verified',
        timestamp: new Date().toISOString(),
        metadata: {
          configured: true,
          validated: !authTest.error
        }
      };
    } catch (error) {
      return {
        service: 'Authentication',
        status: 'critical',
        responseTime: Date.now() - startTime,
        message: error instanceof Error ? error.message : 'Authentication check failed',
        timestamp: new Date().toISOString(),
        metadata: { error }
      };
    }
  }

  /**
   * Collect performance metrics
   */
  private async collectPerformanceMetrics(): Promise<HealthCheck> {
    const startTime = Date.now();

    try {
      // Collect browser performance metrics
      const navigation = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;
      const paintEntries = performance.getEntriesByType('paint');

      const metrics = {
        pageLoadTime: navigation ? navigation.loadEventEnd - navigation.fetchStart : 0,
        domContentLoaded: navigation
          ? navigation.domContentLoadedEventEnd - navigation.fetchStart
          : 0,
        firstPaint: paintEntries.find(entry => entry.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint:
          paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0
      };

      // Add metrics to collection
      Object.entries(metrics).forEach(([name, value]) => {
        this.addMetric({
          name: `performance_${name}`,
          value,
          unit: 'ms',
          timestamp: new Date().toISOString(),
          tags: { category: 'performance' }
        });
      });

      const responseTime = Date.now() - startTime;

      return {
        service: 'Performance',
        status: 'healthy',
        responseTime,
        message: 'Performance metrics collected',
        timestamp: new Date().toISOString(),
        metadata: metrics
      };
    } catch (error) {
      return {
        service: 'Performance',
        status: 'degraded',
        responseTime: Date.now() - startTime,
        message: error instanceof Error ? error.message : 'Failed to collect performance metrics',
        timestamp: new Date().toISOString(),
        metadata: { error }
      };
    }
  }

  /**
   * Process health check results and generate alerts
   */
  private processHealthCheckResults(
    results: Array<{ name: string; result: PromiseSettledResult<HealthCheck> }>
  ): void {
    this.healthChecks = []; // Reset health checks

    results.forEach(({ name, result }) => {
      if (result.status === 'fulfilled') {
        this.healthChecks.push(result.value);

        // Generate alerts for degraded or critical services
        if (result.value.status === 'critical') {
          this.addAlert({
            level: 'critical',
            title: `${name} Service Critical`,
            message: result.value.message,
            service: name.toLowerCase(),
            metadata: result.value.metadata
          });
        } else if (result.value.status === 'degraded') {
          this.addAlert({
            level: 'warning',
            title: `${name} Service Degraded`,
            message: result.value.message,
            service: name.toLowerCase(),
            metadata: result.value.metadata
          });
        }
      } else {
        // Handle rejected promise
        this.healthChecks.push({
          service: name,
          status: 'critical',
          responseTime: 0,
          message: result.reason?.message || 'Health check failed',
          timestamp: new Date().toISOString()
        });

        this.addAlert({
          level: 'critical',
          title: `${name} Health Check Failed`,
          message: result.reason?.message || 'Unknown error during health check',
          service: name.toLowerCase(),
          metadata: { error: result.reason }
        });
      }
    });
  }

  /**
   * Add metric to collection
   */
  private addMetric(metric: MetricData): void {
    this.metrics.push(metric);

    // Keep only last 100 metrics per type
    const metricsOfType = this.metrics.filter(m => m.name === metric.name);
    if (metricsOfType.length > 100) {
      const toRemove = metricsOfType.slice(0, metricsOfType.length - 100);
      this.metrics = this.metrics.filter(m => !toRemove.includes(m));
    }
  }

  /**
   * Add alert
   */
  private addAlert(alert: Omit<Alert, 'id' | 'timestamp' | 'resolved'>): void {
    const newAlert: Alert = {
      ...alert,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      resolved: false
    };

    this.alerts.push(newAlert);

    // Keep only last 50 alerts
    if (this.alerts.length > 50) {
      this.alerts = this.alerts.slice(-50);
    }

    console.warn(`🚨 Alert [${alert.level.toUpperCase()}]:`, alert.title, '-', alert.message);
  }

  /**
   * Update SLA metrics
   */
  private updateSLAMetrics(): void {
    const now = new Date().toISOString();
    const healthyServices = this.healthChecks.filter(h => h.status === 'healthy').length;
    const totalServices = this.healthChecks.length;

    // Calculate availability (percentage of healthy services)
    const availability = totalServices > 0 ? (healthyServices / totalServices) * 100 : 0;

    // Calculate average response time
    const avgResponseTime =
      totalServices > 0
        ? this.healthChecks.reduce((sum, h) => sum + h.responseTime, 0) / totalServices
        : 0;

    // Calculate error rate (percentage of critical/degraded services)
    const errorServices = this.healthChecks.filter(
      h => h.status === 'critical' || h.status === 'degraded'
    ).length;
    const errorRate = totalServices > 0 ? (errorServices / totalServices) * 100 : 0;

    // Add SLA metrics
    this.addMetric({
      name: 'sla_availability',
      value: availability,
      unit: '%',
      timestamp: now,
      tags: { category: 'sla' }
    });

    this.addMetric({
      name: 'sla_response_time',
      value: avgResponseTime,
      unit: 'ms',
      timestamp: now,
      tags: { category: 'sla' }
    });

    this.addMetric({
      name: 'sla_error_rate',
      value: errorRate,
      unit: '%',
      timestamp: now,
      tags: { category: 'sla' }
    });
  }

  /**
   * Get current system status
   */
  getSystemStatus(): SystemStatus {
    const criticalServices = this.healthChecks.filter(h => h.status === 'critical');
    const degradedServices = this.healthChecks.filter(h => h.status === 'degraded');

    let overall: SystemStatus['overall'];
    if (criticalServices.length > 0) {
      overall = 'critical';
    } else if (degradedServices.length > 0) {
      overall = 'degraded';
    } else {
      overall = 'healthy';
    }

    // Get latest SLA metrics
    const latestAvailability = this.getLatestMetric('sla_availability')?.value || 0;
    const latestResponseTime = this.getLatestMetric('sla_response_time')?.value || 0;
    const latestErrorRate = this.getLatestMetric('sla_error_rate')?.value || 0;

    return {
      overall,
      services: this.healthChecks,
      alerts: this.alerts.filter(a => !a.resolved),
      metrics: this.metrics,
      lastUpdated: new Date().toISOString(),
      slaStatus: {
        availability: latestAvailability,
        responseTime: latestResponseTime,
        errorRate: latestErrorRate
      }
    };
  }

  /**
   * Get latest metric by name
   */
  private getLatestMetric(name: string): MetricData | undefined {
    const metricsOfType = this.metrics.filter(m => m.name === name);
    return metricsOfType.length > 0 ? metricsOfType[metricsOfType.length - 1] : undefined;
  }

  /**
   * Notify all subscribers of status update
   */
  private notifySubscribers(): void {
    const status = this.getSystemStatus();
    this.subscribers.forEach(callback => {
      try {
        callback(status);
      } catch (error) {
        console.error('Error notifying subscriber:', error);
      }
    });
  }

  /**
   * Resolve alert by ID
   */
  resolveAlert(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      console.log(`✅ Alert resolved: ${alert.title}`);
    }
  }

  /**
   * Get system health summary
   */
  getHealthSummary(): string {
    const status = this.getSystemStatus();
    const totalServices = status.services.length;
    const healthyServices = status.services.filter(s => s.status === 'healthy').length;
    const activeAlerts = status.alerts.length;

    return `System: ${status.overall.toUpperCase()} | Services: ${healthyServices}/${totalServices} healthy | Alerts: ${activeAlerts} active`;
  }
}

// Export singleton instance
export const enterpriseMonitoring = EnterpriseMonitoringService.getInstance();
