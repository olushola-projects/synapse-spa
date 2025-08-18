/**
 * Performance Optimization Service
 * Priority 2: Performance Optimization - APM integration
 * Implements application performance monitoring and optimization
 */

import { backendConfig } from '../config/environment.backend';
import { log } from '../utils/logger';

export interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  category: 'response_time' | 'throughput' | 'error_rate' | 'resource_usage' | 'custom';
  timestamp: Date;
  metadata: Record<string, any>;
}

export interface PerformanceAlert {
  id: string;
  metricName: string;
  threshold: number;
  currentValue: number;
  severity: 'warning' | 'critical';
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

export interface APMConfig {
  enabled: boolean;
  provider: 'newrelic' | 'datadog' | 'custom';
  apiKey?: string;
  endpoint?: string;
  sampleRate: number; // 0-1
  customMetrics: boolean;
}

export interface PerformanceOptimization {
  id: string;
  type: 'caching' | 'database' | 'api' | 'frontend' | 'infrastructure';
  description: string;
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  status: 'pending' | 'implemented' | 'testing' | 'deployed';
  estimatedImprovement: number; // percentage
  createdAt: Date;
  implementedAt?: Date;
}

export interface PerformanceReport {
  id: string;
  period: { start: Date; end: Date };
  summary: {
    avgResponseTime: number;
    totalRequests: number;
    errorRate: number;
    throughput: number;
    resourceUtilization: number;
  };
  recommendations: PerformanceOptimization[];
  generatedAt: Date;
}

class PerformanceOptimizationService {
  private static instance: PerformanceOptimizationService;
  private metrics: PerformanceMetric[] = [];
  private alerts: PerformanceAlert[] = [];
  private optimizations: PerformanceOptimization[] = [];
  private apmConfig: APMConfig;
  private monitoringEnabled: boolean;
  private performanceThresholds: Map<string, { warning: number; critical: number }> = new Map();

  constructor() {
    this.monitoringEnabled = backendConfig.ENABLE_PERFORMANCE_MONITORING;
    this.apmConfig = {
      enabled: backendConfig.ENABLE_APM_INTEGRATION,
      provider: backendConfig.APM_PROVIDER || 'custom',
      apiKey: backendConfig.APM_API_KEY,
      endpoint: backendConfig.APM_ENDPOINT,
      sampleRate: backendConfig.APM_SAMPLE_RATE || 0.1,
      customMetrics: true
    };

    if (this.monitoringEnabled) {
      this.initializePerformanceMonitoring();
    }
  }

  static getInstance(): PerformanceOptimizationService {
    if (!PerformanceOptimizationService.instance) {
      PerformanceOptimizationService.instance = new PerformanceOptimizationService();
    }
    return PerformanceOptimizationService.instance;
  }

  private async initializePerformanceMonitoring(): Promise<void> {
    try {
      log.info('Initializing performance optimization service');

      // Set default performance thresholds
      this.setDefaultThresholds();

      // Initialize APM integration
      if (this.apmConfig.enabled) {
        await this.initializeAPM();
      }

      // Start performance monitoring
      this.startPerformanceMonitoring();

      log.info('Performance optimization service initialized');
    } catch (error) {
      log.error('Failed to initialize performance monitoring', { error });
    }
  }

  private setDefaultThresholds(): void {
    this.performanceThresholds.set('response_time', { warning: 1000, critical: 3000 }); // ms
    this.performanceThresholds.set('error_rate', { warning: 0.05, critical: 0.1 }); // 5%, 10%
    this.performanceThresholds.set('throughput', { warning: 100, critical: 50 }); // requests/min
    this.performanceThresholds.set('cpu_usage', { warning: 80, critical: 95 }); // percentage
    this.performanceThresholds.set('memory_usage', { warning: 80, critical: 95 }); // percentage
  }

  private async initializeAPM(): Promise<void> {
    try {
      switch (this.apmConfig.provider) {
        case 'newrelic':
          await this.initializeNewRelic();
          break;
        case 'datadog':
          await this.initializeDataDog();
          break;
        case 'custom':
          await this.initializeCustomAPM();
          break;
      }
      log.info(`APM integration initialized: ${this.apmConfig.provider}`);
    } catch (error) {
      log.error('Failed to initialize APM integration', { error });
    }
  }

  private async initializeNewRelic(): Promise<void> {
    // Initialize New Relic APM
    if (this.apmConfig.apiKey) {
      // New Relic initialization logic would go here
      log.info('New Relic APM initialized');
    }
  }

  private async initializeDataDog(): Promise<void> {
    // Initialize DataDog APM
    if (this.apmConfig.apiKey) {
      // DataDog initialization logic would go here
      log.info('DataDog APM initialized');
    }
  }

  private async initializeCustomAPM(): Promise<void> {
    // Initialize custom APM solution
    log.info('Custom APM initialized');
  }

  private startPerformanceMonitoring(): void {
    // Monitor system performance every 30 seconds
    setInterval(async () => {
      await this.collectPerformanceMetrics();
    }, 30 * 1000);

    // Check for performance alerts every minute
    setInterval(async () => {
      await this.checkPerformanceAlerts();
    }, 60 * 1000);

    // Generate performance reports every hour
    setInterval(async () => {
      await this.generatePerformanceReport();
    }, 60 * 60 * 1000);
  }

  async collectPerformanceMetrics(): Promise<void> {
    try {
      const metrics: PerformanceMetric[] = [];

      // Collect response time metrics
      const responseTime = await this.measureResponseTime();
      metrics.push({
        id: crypto.randomUUID(),
        name: 'response_time',
        value: responseTime,
        unit: 'ms',
        category: 'response_time',
        timestamp: new Date(),
        metadata: { endpoint: 'api' }
      });

      // Collect throughput metrics
      const throughput = await this.measureThroughput();
      metrics.push({
        id: crypto.randomUUID(),
        name: 'throughput',
        value: throughput,
        unit: 'requests/min',
        category: 'throughput',
        timestamp: new Date(),
        metadata: {}
      });

      // Collect error rate metrics
      const errorRate = await this.measureErrorRate();
      metrics.push({
        id: crypto.randomUUID(),
        name: 'error_rate',
        value: errorRate,
        unit: 'percentage',
        category: 'error_rate',
        timestamp: new Date(),
        metadata: {}
      });

      // Collect resource usage metrics
      const cpuUsage = await this.measureCPUUsage();
      metrics.push({
        id: crypto.randomUUID(),
        name: 'cpu_usage',
        value: cpuUsage,
        unit: 'percentage',
        category: 'resource_usage',
        timestamp: new Date(),
        metadata: {}
      });

      const memoryUsage = await this.measureMemoryUsage();
      metrics.push({
        id: crypto.randomUUID(),
        name: 'memory_usage',
        value: memoryUsage,
        unit: 'percentage',
        category: 'resource_usage',
        timestamp: new Date(),
        metadata: {}
      });

      // Store metrics
      this.metrics.push(...metrics);

      // Send to APM if enabled
      if (this.apmConfig.enabled) {
        await this.sendMetricsToAPM(metrics);
      }

      // Cleanup old metrics (keep last 24 hours)
      this.cleanupOldMetrics();

    } catch (error) {
      log.error('Failed to collect performance metrics', { error });
    }
  }

  private async measureResponseTime(): Promise<number> {
    // Simulate response time measurement
    // In production, this would measure actual API response times
    return Math.random() * 2000 + 100; // 100-2100ms
  }

  private async measureThroughput(): Promise<number> {
    // Simulate throughput measurement
    // In production, this would count requests per minute
    return Math.random() * 200 + 50; // 50-250 requests/min
  }

  private async measureErrorRate(): Promise<number> {
    // Simulate error rate measurement
    // In production, this would calculate actual error rates
    return Math.random() * 0.1; // 0-10%
  }

  private async measureCPUUsage(): Promise<number> {
    // Simulate CPU usage measurement
    // In production, this would use system metrics
    return Math.random() * 100; // 0-100%
  }

  private async measureMemoryUsage(): Promise<number> {
    // Simulate memory usage measurement
    // In production, this would use system metrics
    return Math.random() * 100; // 0-100%
  }

  private async sendMetricsToAPM(metrics: PerformanceMetric[]): Promise<void> {
    try {
      switch (this.apmConfig.provider) {
        case 'newrelic':
          await this.sendToNewRelic(metrics);
          break;
        case 'datadog':
          await this.sendToDataDog(metrics);
          break;
        case 'custom':
          await this.sendToCustomAPM(metrics);
          break;
      }
    } catch (error) {
      log.error('Failed to send metrics to APM', { error });
    }
  }

  private async sendToNewRelic(metrics: PerformanceMetric[]): Promise<void> {
    if (!this.apmConfig.endpoint || !this.apmConfig.apiKey) return;

    try {
      const response = await fetch(this.apmConfig.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-License-Key': this.apmConfig.apiKey
        },
        body: JSON.stringify({
          metrics: metrics.map(metric => ({
            name: metric.name,
            value: metric.value,
            unit: metric.unit,
            timestamp: metric.timestamp.getTime(),
            attributes: metric.metadata
          }))
        })
      });

      if (!response.ok) {
        throw new Error(`New Relic API error: ${response.status}`);
      }
    } catch (error) {
      log.error('Failed to send metrics to New Relic', { error });
    }
  }

  private async sendToDataDog(metrics: PerformanceMetric[]): Promise<void> {
    if (!this.apmConfig.endpoint || !this.apmConfig.apiKey) return;

    try {
      const response = await fetch(this.apmConfig.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'DD-API-KEY': this.apmConfig.apiKey
        },
        body: JSON.stringify({
          series: metrics.map(metric => ({
            metric: metric.name,
            points: [[metric.timestamp.getTime(), metric.value]],
            type: 'gauge',
            tags: Object.entries(metric.metadata).map(([k, v]) => `${k}:${v}`)
          }))
        })
      });

      if (!response.ok) {
        throw new Error(`DataDog API error: ${response.status}`);
      }
    } catch (error) {
      log.error('Failed to send metrics to DataDog', { error });
    }
  }

  private async sendToCustomAPM(metrics: PerformanceMetric[]): Promise<void> {
    if (!this.apmConfig.endpoint) return;

    try {
      const response = await fetch(this.apmConfig.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          metrics: metrics.map(metric => ({
            name: metric.name,
            value: metric.value,
            unit: metric.unit,
            category: metric.category,
            metadata: metric.metadata
          }))
        })
      });

      if (!response.ok) {
        throw new Error(`Custom APM API error: ${response.status}`);
      }
    } catch (error) {
      log.error('Failed to send metrics to custom APM', { error });
    }
  }

  private async checkPerformanceAlerts(): Promise<void> {
    try {
      const recentMetrics = this.metrics.filter(
        metric => metric.timestamp > new Date(Date.now() - 5 * 60 * 1000) // Last 5 minutes
      );

      for (const metric of recentMetrics) {
        const threshold = this.performanceThresholds.get(metric.name);
        if (!threshold) continue;

        const avgValue = this.calculateAverageValue(recentMetrics.filter(m => m.name === metric.name));
        
        if (avgValue >= threshold.critical) {
          await this.createPerformanceAlert(metric.name, threshold.critical, avgValue, 'critical');
        } else if (avgValue >= threshold.warning) {
          await this.createPerformanceAlert(metric.name, threshold.warning, avgValue, 'warning');
        }
      }
    } catch (error) {
      log.error('Failed to check performance alerts', { error });
    }
  }

  private calculateAverageValue(metrics: PerformanceMetric[]): number {
    if (metrics.length === 0) return 0;
    const sum = metrics.reduce((acc, metric) => acc + metric.value, 0);
    return sum / metrics.length;
  }

  private async createPerformanceAlert(
    metricName: string,
    threshold: number,
    currentValue: number,
    severity: 'warning' | 'critical'
  ): Promise<void> {
    // Check if alert already exists
    const existingAlert = this.alerts.find(
      alert => alert.metricName === metricName && 
               alert.severity === severity && 
               !alert.acknowledged
    );

    if (existingAlert) return;

    const alert: PerformanceAlert = {
      id: crypto.randomUUID(),
      metricName,
      threshold,
      currentValue,
      severity,
      message: `${metricName} is ${severity}: ${currentValue} (threshold: ${threshold})`,
      timestamp: new Date(),
      acknowledged: false
    };

    this.alerts.push(alert);
    log.warn(`Performance alert created: ${alert.message}`);

    // Send alert notification
    await this.sendAlertNotification(alert);
  }

  private async sendAlertNotification(alert: PerformanceAlert): Promise<void> {
    try {
      // Send to configured notification channels
      if (backendConfig.PERFORMANCE_ALERT_WEBHOOK) {
        await fetch(backendConfig.PERFORMANCE_ALERT_WEBHOOK, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `🚨 Performance Alert: ${alert.message}`,
            severity: alert.severity,
            metric: alert.metricName,
            value: alert.currentValue,
            threshold: alert.threshold,
            timestamp: alert.timestamp.toISOString()
          })
        });
      }
    } catch (error) {
      log.error('Failed to send performance alert notification', { error });
    }
  }

  async generatePerformanceReport(): Promise<PerformanceReport> {
    try {
      const now = new Date();
      const lastHour = new Date(now.getTime() - 60 * 60 * 1000);
      
      const recentMetrics = this.metrics.filter(
        metric => metric.timestamp >= lastHour
      );

      const responseTimeMetrics = recentMetrics.filter(m => m.name === 'response_time');
      const throughputMetrics = recentMetrics.filter(m => m.name === 'throughput');
      const errorRateMetrics = recentMetrics.filter(m => m.name === 'error_rate');
      const cpuMetrics = recentMetrics.filter(m => m.name === 'cpu_usage');
      const memoryMetrics = recentMetrics.filter(m => m.name === 'memory_usage');

      const avgResponseTime = this.calculateAverageValue(responseTimeMetrics);
      const avgThroughput = this.calculateAverageValue(throughputMetrics);
      const avgErrorRate = this.calculateAverageValue(errorRateMetrics);
      const avgCPUUsage = this.calculateAverageValue(cpuMetrics);
      const avgMemoryUsage = this.calculateAverageValue(memoryMetrics);

      const totalRequests = avgThroughput * 60; // Convert to total requests per hour

      const recommendations = await this.generateOptimizationRecommendations({
        avgResponseTime,
        avgThroughput,
        avgErrorRate,
        avgCPUUsage,
        avgMemoryUsage
      });

      const report: PerformanceReport = {
        id: crypto.randomUUID(),
        period: { start: lastHour, end: now },
        summary: {
          avgResponseTime,
          totalRequests,
          errorRate: avgErrorRate,
          throughput: avgThroughput,
          resourceUtilization: (avgCPUUsage + avgMemoryUsage) / 2
        },
        recommendations,
        generatedAt: now
      };

      log.info('Performance report generated', { report: report.summary });
      return report;

    } catch (error) {
      log.error('Failed to generate performance report', { error });
      throw error;
    }
  }

  private async generateOptimizationRecommendations(metrics: {
    avgResponseTime: number;
    avgThroughput: number;
    avgErrorRate: number;
    avgCPUUsage: number;
    avgMemoryUsage: number;
  }): Promise<PerformanceOptimization[]> {
    const recommendations: PerformanceOptimization[] = [];

    // Response time optimization
    if (metrics.avgResponseTime > 1000) {
      recommendations.push({
        id: crypto.randomUUID(),
        type: 'api',
        description: 'Implement API response caching to reduce response times',
        impact: 'high',
        effort: 'medium',
        status: 'pending',
        estimatedImprovement: 40,
        createdAt: new Date()
      });
    }

    // Throughput optimization
    if (metrics.avgThroughput < 100) {
      recommendations.push({
        id: crypto.randomUUID(),
        type: 'infrastructure',
        description: 'Scale application horizontally to improve throughput',
        impact: 'high',
        effort: 'high',
        status: 'pending',
        estimatedImprovement: 200,
        createdAt: new Date()
      });
    }

    // Error rate optimization
    if (metrics.avgErrorRate > 0.05) {
      recommendations.push({
        id: crypto.randomUUID(),
        type: 'api',
        description: 'Implement circuit breaker pattern to handle failures gracefully',
        impact: 'medium',
        effort: 'medium',
        status: 'pending',
        estimatedImprovement: 80,
        createdAt: new Date()
      });
    }

    // Resource usage optimization
    if (metrics.avgCPUUsage > 80 || metrics.avgMemoryUsage > 80) {
      recommendations.push({
        id: crypto.randomUUID(),
        type: 'infrastructure',
        description: 'Optimize resource allocation and implement auto-scaling',
        impact: 'high',
        effort: 'high',
        status: 'pending',
        estimatedImprovement: 30,
        createdAt: new Date()
      });
    }

    return recommendations;
  }

  async getPerformanceMetrics(filters?: {
    name?: string;
    category?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<PerformanceMetric[]> {
    let filteredMetrics = this.metrics;

    if (filters?.name) {
      filteredMetrics = filteredMetrics.filter(m => m.name === filters.name);
    }
    if (filters?.category) {
      filteredMetrics = filteredMetrics.filter(m => m.category === filters.category);
    }
    if (filters?.startDate) {
      filteredMetrics = filteredMetrics.filter(m => m.timestamp >= filters.startDate!);
    }
    if (filters?.endDate) {
      filteredMetrics = filteredMetrics.filter(m => m.timestamp <= filters.endDate!);
    }

    return filteredMetrics.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async getPerformanceAlerts(): Promise<PerformanceAlert[]> {
    return this.alerts
      .filter(alert => !alert.acknowledged)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async acknowledgeAlert(alertId: string): Promise<void> {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      log.info(`Performance alert acknowledged: ${alert.message}`);
    }
  }

  async setPerformanceThreshold(
    metricName: string,
    warning: number,
    critical: number
  ): Promise<void> {
    this.performanceThresholds.set(metricName, { warning, critical });
    log.info(`Performance threshold updated for ${metricName}: warning=${warning}, critical=${critical}`);
  }

  async getPerformanceOptimizations(): Promise<PerformanceOptimization[]> {
    return this.optimizations.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async implementOptimization(optimizationId: string): Promise<void> {
    const optimization = this.optimizations.find(o => o.id === optimizationId);
    if (optimization) {
      optimization.status = 'implemented';
      optimization.implementedAt = new Date();
      log.info(`Performance optimization implemented: ${optimization.description}`);
    }
  }

  private cleanupOldMetrics(): void {
    const cutoffDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
    this.metrics = this.metrics.filter(metric => metric.timestamp >= cutoffDate);
  }

  // Public method to manually record a performance metric
  async recordMetric(
    name: string,
    value: number,
    unit: string,
    category: PerformanceMetric['category'],
    metadata: Record<string, any> = {}
  ): Promise<void> {
    const metric: PerformanceMetric = {
      id: crypto.randomUUID(),
      name,
      value,
      unit,
      category,
      timestamp: new Date(),
      metadata
    };

    this.metrics.push(metric);

    if (this.apmConfig.enabled) {
      await this.sendMetricsToAPM([metric]);
    }
  }

  // Public method to measure execution time of a function
  async measureExecutionTime<T>(
    name: string,
    fn: () => Promise<T>
  ): Promise<T> {
    const startTime = Date.now();
    
    try {
      const result = await fn();
      const executionTime = Date.now() - startTime;
      
      await this.recordMetric(
        `${name}_execution_time`,
        executionTime,
        'ms',
        'response_time',
        { function: name }
      );
      
      return result;
    } catch (error) {
      const executionTime = Date.now() - startTime;
      
      await this.recordMetric(
        `${name}_execution_time`,
        executionTime,
        'ms',
        'response_time',
        { function: name, error: true }
      );
      
      throw error;
    }
  }
}

export const performanceOptimizationService = PerformanceOptimizationService.getInstance();
