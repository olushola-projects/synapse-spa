/**
 * Production Monitoring Service
 * Implements enterprise-grade monitoring for SFDR Navigator backend services
 */
import { logger } from '@/utils/logger';
class ProductionMonitoringService {
  config;
  metrics = new Map();
  alerts = [];
  listeners = [];
  constructor() {
    this.config = {
      alertThresholds: {
        responseTimeMs: 5000, // Alert if response time > 5s
        errorRate: 0.1, // Alert if error rate > 10%
        availabilityPercent: 95 // Alert if availability < 95%
      },
      healthCheckInterval: 60000, // Check every minute
      retentionDays: 30
    };
  }
  /**
   * Record service metrics for monitoring
   */
  recordMetric(serviceName, responseTime, success, error) {
    const timestamp = new Date().toISOString();
    if (!this.metrics.has(serviceName)) {
      this.metrics.set(serviceName, []);
    }
    const serviceMetrics = this.metrics.get(serviceName);
    // Calculate running totals
    const recentMetrics = this.getRecentMetrics(serviceName, 24); // Last 24 hours
    const errorCount = recentMetrics.filter(m => m.errorCount > 0).length + (success ? 0 : 1);
    const successCount = recentMetrics.filter(m => m.successCount > 0).length + (success ? 1 : 0);
    const totalRequests = errorCount + successCount;
    const availability = totalRequests > 0 ? (successCount / totalRequests) * 100 : 100;
    const metric = {
      serviceName,
      responseTime,
      errorCount: success ? 0 : 1,
      successCount: success ? 1 : 0,
      availability,
      lastError: error,
      timestamp
    };
    serviceMetrics.push(metric);
    // Keep only recent metrics (retention policy)
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.config.retentionDays);
    this.metrics.set(
      serviceName,
      serviceMetrics.filter(m => new Date(m.timestamp) > cutoffDate)
    );
    // Check for alert conditions
    this.checkAlertConditions(serviceName, metric);
    logger.info('Service metric recorded', {
      serviceName,
      responseTime,
      success,
      availability: `${availability.toFixed(2)}%`
    });
  }
  /**
   * Check if metrics trigger any alerts
   */
  checkAlertConditions(serviceName, metric) {
    const alerts = [];
    // Response time alert
    if (metric.responseTime > this.config.alertThresholds.responseTimeMs) {
      alerts.push({
        id: `${serviceName}-response-time-${Date.now()}`,
        severity: 'warning',
        service: serviceName,
        message: `High response time: ${metric.responseTime}ms (threshold: ${this.config.alertThresholds.responseTimeMs}ms)`,
        timestamp: new Date().toISOString(),
        resolved: false
      });
    }
    // Availability alert
    if (metric.availability < this.config.alertThresholds.availabilityPercent) {
      alerts.push({
        id: `${serviceName}-availability-${Date.now()}`,
        severity: 'critical',
        service: serviceName,
        message: `Low availability: ${metric.availability.toFixed(1)}% (threshold: ${this.config.alertThresholds.availabilityPercent}%)`,
        timestamp: new Date().toISOString(),
        resolved: false
      });
    }
    // Error rate alert
    const recentMetrics = this.getRecentMetrics(serviceName, 1); // Last hour
    if (recentMetrics.length > 0) {
      const totalErrors = recentMetrics.reduce((sum, m) => sum + m.errorCount, 0);
      const totalRequests = recentMetrics.reduce(
        (sum, m) => sum + m.errorCount + m.successCount,
        0
      );
      const errorRate = totalRequests > 0 ? totalErrors / totalRequests : 0;
      if (errorRate > this.config.alertThresholds.errorRate) {
        alerts.push({
          id: `${serviceName}-error-rate-${Date.now()}`,
          severity: 'warning',
          service: serviceName,
          message: `High error rate: ${(errorRate * 100).toFixed(1)}% (threshold: ${(this.config.alertThresholds.errorRate * 100).toFixed(1)}%)`,
          timestamp: new Date().toISOString(),
          resolved: false
        });
      }
    }
    // Process alerts
    alerts.forEach(alert => {
      this.alerts.push(alert);
      this.notifyListeners(alert);
      logger.warn('Alert triggered', alert);
    });
  }
  /**
   * Get recent metrics for a service
   */
  getRecentMetrics(serviceName, hours) {
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - hours);
    const serviceMetrics = this.metrics.get(serviceName) || [];
    return serviceMetrics.filter(m => new Date(m.timestamp) > cutoffTime);
  }
  /**
   * Get service health summary
   */
  getServiceHealth(serviceName) {
    const recentMetrics = this.getRecentMetrics(serviceName, 24);
    if (recentMetrics.length === 0) {
      return {
        status: 'critical',
        availability: 0,
        averageResponseTime: 0,
        errorRate: 0,
        uptime: 0
      };
    }
    const totalRequests = recentMetrics.reduce((sum, m) => sum + m.errorCount + m.successCount, 0);
    const totalErrors = recentMetrics.reduce((sum, m) => sum + m.errorCount, 0);
    const totalSuccess = recentMetrics.reduce((sum, m) => sum + m.successCount, 0);
    const availability = totalRequests > 0 ? (totalSuccess / totalRequests) * 100 : 0;
    const errorRate = totalRequests > 0 ? totalErrors / totalRequests : 0;
    const averageResponseTime =
      recentMetrics.reduce((sum, m) => sum + m.responseTime, 0) / recentMetrics.length;
    // Calculate uptime (time since last critical error)
    const lastCriticalError = recentMetrics
      .filter(m => m.errorCount > 0)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
    const uptime = lastCriticalError
      ? Date.now() - new Date(lastCriticalError.timestamp).getTime()
      : 24 * 60 * 60 * 1000; // 24 hours if no errors
    let status = 'healthy';
    if (availability < this.config.alertThresholds.availabilityPercent) {
      status = 'critical';
    } else if (
      errorRate > this.config.alertThresholds.errorRate ||
      averageResponseTime > this.config.alertThresholds.responseTimeMs
    ) {
      status = 'degraded';
    }
    const lastError = recentMetrics
      .filter(m => m.lastError)
      .sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )[0]?.lastError;
    return {
      status,
      availability,
      averageResponseTime,
      errorRate,
      lastError,
      uptime
    };
  }
  /**
   * Get all active alerts
   */
  getActiveAlerts() {
    return this.alerts.filter(alert => !alert.resolved);
  }
  /**
   * Get system overview
   */
  getSystemOverview() {
    const services = Array.from(this.metrics.keys());
    const healthStatuses = services.map(service => this.getServiceHealth(service));
    const healthyServices = healthStatuses.filter(h => h.status === 'healthy').length;
    const degradedServices = healthStatuses.filter(h => h.status === 'degraded').length;
    const criticalServices = healthStatuses.filter(h => h.status === 'critical').length;
    let overallStatus = 'healthy';
    if (criticalServices > 0) {
      overallStatus = 'critical';
    } else if (degradedServices > 0) {
      overallStatus = 'degraded';
    }
    return {
      totalServices: services.length,
      healthyServices,
      degradedServices,
      criticalServices,
      activeAlerts: this.getActiveAlerts().length,
      overallStatus
    };
  }
  /**
   * Resolve an alert
   */
  resolveAlert(alertId) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      logger.info('Alert resolved', { alertId });
    }
  }
  /**
   * Add alert listener
   */
  addAlertListener(listener) {
    this.listeners.push(listener);
  }
  /**
   * Notify all listeners of new alert
   */
  notifyListeners(alert) {
    this.listeners.forEach(listener => {
      try {
        listener(alert);
      } catch (error) {
        logger.error('Failed to notify alert listener', error);
      }
    });
  }
  /**
   * Get performance trends
   */
  getPerformanceTrends(serviceName, hours = 24) {
    const metrics = this.getRecentMetrics(serviceName, hours);
    // Group by hour for trending
    const hourlyGroups = new Map();
    metrics.forEach(metric => {
      const hour = new Date(metric.timestamp).toISOString().slice(0, 13); // YYYY-MM-DDTHH
      if (!hourlyGroups.has(hour)) {
        hourlyGroups.set(hour, []);
      }
      hourlyGroups.get(hour).push(metric);
    });
    const timestamps = [];
    const responseTimes = [];
    const errorRates = [];
    const availability = [];
    Array.from(hourlyGroups.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([hour, hourMetrics]) => {
        timestamps.push(hour);
        const avgResponseTime =
          hourMetrics.reduce((sum, m) => sum + m.responseTime, 0) / hourMetrics.length;
        responseTimes.push(Math.round(avgResponseTime));
        const totalRequests = hourMetrics.reduce(
          (sum, m) => sum + m.errorCount + m.successCount,
          0
        );
        const totalErrors = hourMetrics.reduce((sum, m) => sum + m.errorCount, 0);
        const errorRate = totalRequests > 0 ? totalErrors / totalRequests : 0;
        errorRates.push(Math.round(errorRate * 100));
        const avgAvailability =
          hourMetrics.reduce((sum, m) => sum + m.availability, 0) / hourMetrics.length;
        availability.push(Math.round(avgAvailability));
      });
    return {
      timestamps,
      responseTimes,
      errorRates,
      availability
    };
  }
}
// Export singleton instance
export const productionMonitor = new ProductionMonitoringService();
