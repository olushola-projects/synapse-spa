/**
 * Error Handling Service
 * Priority 2: Error Handling - Circuit breaker patterns
 * Implements circuit breaker, retry mechanisms, and graceful degradation
 */
import { log } from '../utils/logger';
class ErrorHandlingService {
  static instance;
  circuitBreakers = new Map();
  errorEvents = [];
  degradationStrategies = [];
  retryConfigs = new Map();
  defaultCircuitBreakerConfig;
  defaultRetryConfig;
  constructor() {
    this.defaultCircuitBreakerConfig = {
      failureThreshold: 5,
      recoveryTimeout: 30000, // 30 seconds
      expectedResponseTime: 5000, // 5 seconds
      monitoringWindow: 60000 // 1 minute
    };
    this.defaultRetryConfig = {
      maxAttempts: 3,
      baseDelay: 1000, // 1 second
      maxDelay: 10000, // 10 seconds
      backoffMultiplier: 2,
      retryableErrors: ['NetworkError', 'TimeoutError', 'ServiceUnavailable']
    };
    this.initializeErrorHandling();
  }
  static getInstance() {
    if (!ErrorHandlingService.instance) {
      ErrorHandlingService.instance = new ErrorHandlingService();
    }
    return ErrorHandlingService.instance;
  }
  initializeErrorHandling() {
    try {
      log.info('Initializing error handling service');
      // Initialize default degradation strategies
      this.initializeDegradationStrategies();
      // Start error monitoring
      this.startErrorMonitoring();
      log.info('Error handling service initialized');
    } catch (error) {
      log.error('Failed to initialize error handling service', { error });
    }
  }
  initializeDegradationStrategies() {
    const strategies = [
      {
        id: crypto.randomUUID(),
        name: 'API Fallback Strategy',
        description: 'Use cached data when API is unavailable',
        trigger: {
          type: 'error_rate',
          threshold: 0.1, // 10% error rate
          duration: 300000 // 5 minutes
        },
        actions: [
          {
            type: 'fallback',
            target: 'cached_data',
            parameters: { ttl: 3600000 } // 1 hour
          }
        ],
        priority: 'high',
        enabled: true
      },
      {
        id: crypto.randomUUID(),
        name: 'Response Time Degradation',
        description: 'Reduce response time by using simplified data',
        trigger: {
          type: 'response_time',
          threshold: 5000, // 5 seconds
          duration: 60000 // 1 minute
        },
        actions: [
          {
            type: 'fallback',
            target: 'simplified_data',
            parameters: { fields: ['id', 'name', 'status'] }
          }
        ],
        priority: 'medium',
        enabled: true
      },
      {
        id: crypto.randomUUID(),
        name: 'Circuit Breaker Fallback',
        description: 'Use alternative service when circuit is open',
        trigger: {
          type: 'circuit_open',
          threshold: 1,
          duration: 0
        },
        actions: [
          {
            type: 'redirect',
            target: 'backup_service',
            parameters: { endpoint: '/api/backup' }
          }
        ],
        priority: 'critical',
        enabled: true
      }
    ];
    this.degradationStrategies = strategies;
  }
  startErrorMonitoring() {
    // Monitor error rates every minute
    setInterval(async () => {
      await this.monitorErrorRates();
    }, 60 * 1000);
    // Cleanup old error events every hour
    setInterval(
      async () => {
        this.cleanupOldErrorEvents();
      },
      60 * 60 * 1000
    );
  }
  /**
   * Circuit Breaker Implementation
   */
  async executeWithCircuitBreaker(name, operation, config) {
    const circuitBreaker = this.getOrCreateCircuitBreaker(name, config);
    // Check if circuit is open
    if (circuitBreaker.status === 'open') {
      if (circuitBreaker.nextAttemptTime && new Date() < circuitBreaker.nextAttemptTime) {
        throw new Error(
          `Circuit breaker '${name}' is open. Retry after ${circuitBreaker.nextAttemptTime}`
        );
      }
      // Try to transition to half-open
      circuitBreaker.status = 'half_open';
      log.info(`Circuit breaker '${name}' transitioning to half-open`);
    }
    const startTime = Date.now();
    try {
      const result = await operation();
      // Success - close circuit if it was half-open
      if (circuitBreaker.status === 'half_open') {
        circuitBreaker.status = 'closed';
        circuitBreaker.failureCount = 0;
        log.info(`Circuit breaker '${name}' closed after successful operation`);
      }
      // Update success metrics
      circuitBreaker.lastSuccessTime = new Date();
      circuitBreaker.totalRequests++;
      circuitBreaker.successRate =
        (circuitBreaker.totalRequests - circuitBreaker.totalFailures) /
        circuitBreaker.totalRequests;
      circuitBreaker.averageResponseTime = this.calculateAverageResponseTime(
        circuitBreaker,
        Date.now() - startTime
      );
      return result;
    } catch (error) {
      // Failure - update failure metrics
      circuitBreaker.lastFailureTime = new Date();
      circuitBreaker.failureCount++;
      circuitBreaker.totalFailures++;
      circuitBreaker.totalRequests++;
      circuitBreaker.successRate =
        (circuitBreaker.totalRequests - circuitBreaker.totalFailures) /
        circuitBreaker.totalRequests;
      // Check if circuit should open
      if (
        circuitBreaker.failureCount >=
        (config?.failureThreshold || this.defaultCircuitBreakerConfig.failureThreshold)
      ) {
        circuitBreaker.status = 'open';
        circuitBreaker.nextAttemptTime = new Date(
          Date.now() + (config?.recoveryTimeout || this.defaultCircuitBreakerConfig.recoveryTimeout)
        );
        log.warn(`Circuit breaker '${name}' opened due to ${circuitBreaker.failureCount} failures`);
      }
      throw error;
    }
  }
  getOrCreateCircuitBreaker(name, _config) {
    if (!this.circuitBreakers.has(name)) {
      const circuitBreaker = {
        name,
        status: 'closed',
        failureCount: 0,
        totalRequests: 0,
        totalFailures: 0,
        successRate: 1,
        averageResponseTime: 0
      };
      this.circuitBreakers.set(name, circuitBreaker);
    }
    return this.circuitBreakers.get(name);
  }
  calculateAverageResponseTime(circuitBreaker, newResponseTime) {
    const totalRequests = circuitBreaker.totalRequests;
    const currentAvg = circuitBreaker.averageResponseTime;
    if (totalRequests === 1) {
      return newResponseTime;
    }
    return (currentAvg * (totalRequests - 1) + newResponseTime) / totalRequests;
  }
  /**
   * Retry Mechanism Implementation
   */
  async executeWithRetry(name, operation, config) {
    const retryConfig = { ...this.defaultRetryConfig, ...config };
    let lastError;
    for (let attempt = 1; attempt <= retryConfig.maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        // Check if error is retryable
        if (!this.isRetryableError(error, retryConfig.retryableErrors)) {
          throw error;
        }
        // If this is the last attempt, throw the error
        if (attempt === retryConfig.maxAttempts) {
          log.error(`Operation '${name}' failed after ${attempt} attempts`, { error: lastError });
          throw lastError;
        }
        // Calculate delay for next attempt
        const delay = this.calculateRetryDelay(attempt, retryConfig);
        log.warn(
          `Operation '${name}' failed (attempt ${attempt}/${retryConfig.maxAttempts}), retrying in ${delay}ms`,
          { error: lastError }
        );
        await this.sleep(delay);
      }
    }
    throw lastError;
  }
  isRetryableError(error, retryableErrors) {
    return retryableErrors.some(
      errorType =>
        error.name === errorType || error.message.includes(errorType) || error.code === errorType
    );
  }
  calculateRetryDelay(attempt, config) {
    const delay = config.baseDelay * Math.pow(config.backoffMultiplier, attempt - 1);
    return Math.min(delay, config.maxDelay);
  }
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  /**
   * Error Event Recording
   */
  async recordError(service, operation, error, context = {}, severity = 'medium') {
    const errorEvent = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      service,
      operation,
      error: {
        type: error.name || 'UnknownError',
        message: error.message,
        stack: error.stack,
        code: error.code
      },
      context,
      severity,
      handled: false
    };
    this.errorEvents.push(errorEvent);
    log.error(`Error recorded: ${errorEvent.error.type} in ${service}.${operation}`, {
      errorEvent
    });
    // Check if degradation strategies should be triggered
    await this.checkDegradationStrategies(errorEvent);
  }
  async checkDegradationStrategies(errorEvent) {
    for (const strategy of this.degradationStrategies) {
      if (!strategy.enabled) continue;
      const shouldTrigger = await this.evaluateDegradationTrigger(strategy, errorEvent);
      if (shouldTrigger) {
        await this.executeDegradationStrategy(strategy, errorEvent);
      }
    }
  }
  async evaluateDegradationTrigger(strategy, errorEvent) {
    const now = new Date();
    const windowStart = new Date(now.getTime() - strategy.trigger.duration);
    switch (strategy.trigger.type) {
      case 'error_rate':
        const recentErrors = this.errorEvents.filter(
          e => e.timestamp >= windowStart && e.service === errorEvent.service
        );
        const errorRate = recentErrors.length / Math.max(1, recentErrors.length);
        return errorRate >= strategy.trigger.threshold;
      case 'response_time':
        // This would be evaluated based on performance metrics
        return false;
      case 'circuit_open':
        const circuitBreaker = this.circuitBreakers.get(errorEvent.service);
        return circuitBreaker?.status === 'open';
      default:
        return false;
    }
  }
  async executeDegradationStrategy(strategy, errorEvent) {
    log.info(`Executing degradation strategy: ${strategy.name}`, { strategy, errorEvent });
    for (const action of strategy.actions) {
      try {
        switch (action.type) {
          case 'fallback':
            await this.executeFallbackAction(action, errorEvent);
            break;
          case 'cache':
            await this.executeCacheAction(action, errorEvent);
            break;
          case 'timeout':
            await this.executeTimeoutAction(action, errorEvent);
            break;
          case 'redirect':
            await this.executeRedirectAction(action, errorEvent);
            break;
          case 'custom':
            await this.executeCustomAction(action, errorEvent);
            break;
        }
      } catch (error) {
        log.error(`Failed to execute degradation action: ${action.type}`, {
          error,
          action,
          errorEvent
        });
      }
    }
  }
  async executeFallbackAction(action, errorEvent) {
    log.info(`Executing fallback action: ${action.target}`, { action, errorEvent });
    // Implementation would use cached or alternative data
  }
  async executeCacheAction(action, errorEvent) {
    log.info(`Executing cache action: ${action.target}`, { action, errorEvent });
    // Implementation would serve cached data
  }
  async executeTimeoutAction(action, errorEvent) {
    log.info(`Executing timeout action: ${action.target}`, { action, errorEvent });
    // Implementation would reduce timeout values
  }
  async executeRedirectAction(action, errorEvent) {
    log.info(`Executing redirect action: ${action.target}`, { action, errorEvent });
    // Implementation would redirect to alternative service
  }
  async executeCustomAction(action, errorEvent) {
    log.info(`Executing custom action: ${action.target}`, { action, errorEvent });
    // Implementation would execute custom degradation logic
  }
  /**
   * Error Monitoring
   */
  async monitorErrorRates() {
    try {
      const now = new Date();
      const last5Minutes = new Date(now.getTime() - 5 * 60 * 1000);
      const recentErrors = this.errorEvents.filter(e => e.timestamp >= last5Minutes);
      const totalRequests = recentErrors.length; // Simplified - in production would track total requests
      if (totalRequests > 0) {
        const errorRate = recentErrors.length / totalRequests;
        if (errorRate > 0.1) {
          // 10% error rate
          log.warn(`High error rate detected: ${(errorRate * 100).toFixed(2)}%`, {
            totalRequests,
            errorCount: recentErrors.length,
            errorRate
          });
        }
      }
    } catch (error) {
      log.error('Failed to monitor error rates', { error });
    }
  }
  /**
   * Error Report Generation
   */
  async generateErrorReport(period) {
    try {
      const errorsInPeriod = this.errorEvents.filter(
        e => e.timestamp >= period.start && e.timestamp <= period.end
      );
      const totalErrors = errorsInPeriod.length;
      const criticalErrors = errorsInPeriod.filter(e => e.severity === 'critical').length;
      const resolvedErrors = errorsInPeriod.filter(e => e.handled).length;
      // Calculate error rate (simplified)
      const errorRate = totalErrors > 0 ? totalErrors / 1000 : 0; // Assuming 1000 total requests
      // Calculate average resolution time
      const resolvedErrorsWithTime = errorsInPeriod.filter(e => e.handled);
      const averageResolutionTime =
        resolvedErrorsWithTime.length > 0
          ? resolvedErrorsWithTime.reduce(
              (acc, e) => acc + (e.timestamp.getTime() - period.start.getTime()),
              0
            ) / resolvedErrorsWithTime.length
          : 0;
      // Get top errors
      const errorCounts = new Map();
      errorsInPeriod.forEach(e => {
        const key = e.error.type;
        errorCounts.set(key, (errorCounts.get(key) || 0) + 1);
      });
      const topErrors = Array.from(errorCounts.entries())
        .map(([type, count]) => ({
          type,
          count,
          percentage: (count / totalErrors) * 100
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
      const report = {
        id: crypto.randomUUID(),
        period,
        summary: {
          totalErrors,
          errorRate,
          criticalErrors,
          resolvedErrors,
          averageResolutionTime
        },
        topErrors,
        circuitBreakers: Array.from(this.circuitBreakers.values()),
        generatedAt: new Date()
      };
      log.info('Error report generated', { report: report.summary });
      return report;
    } catch (error) {
      log.error('Failed to generate error report', { error });
      throw error;
    }
  }
  /**
   * Public API Methods
   */
  async getCircuitBreakerState(name) {
    return this.circuitBreakers.get(name) || null;
  }
  async getAllCircuitBreakers() {
    return Array.from(this.circuitBreakers.values());
  }
  async resetCircuitBreaker(name) {
    const circuitBreaker = this.circuitBreakers.get(name);
    if (circuitBreaker) {
      circuitBreaker.status = 'closed';
      circuitBreaker.failureCount = 0;
      circuitBreaker.nextAttemptTime = undefined;
      log.info(`Circuit breaker '${name}' manually reset`);
    }
  }
  async getErrorEvents(filters) {
    let filteredEvents = this.errorEvents;
    if (filters?.service) {
      filteredEvents = filteredEvents.filter(e => e.service === filters.service);
    }
    if (filters?.severity) {
      filteredEvents = filteredEvents.filter(e => e.severity === filters.severity);
    }
    if (filters?.startDate) {
      filteredEvents = filteredEvents.filter(e => e.timestamp >= filters.startDate);
    }
    if (filters?.endDate) {
      filteredEvents = filteredEvents.filter(e => e.timestamp <= filters.endDate);
    }
    return filteredEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
  async markErrorAsHandled(errorId, resolution) {
    const errorEvent = this.errorEvents.find(e => e.id === errorId);
    if (errorEvent) {
      errorEvent.handled = true;
      errorEvent.resolution = resolution;
      log.info(`Error marked as handled: ${errorId}`, { resolution });
    }
  }
  async getDegradationStrategies() {
    return this.degradationStrategies;
  }
  async updateDegradationStrategy(strategyId, updates) {
    const strategy = this.degradationStrategies.find(s => s.id === strategyId);
    if (strategy) {
      Object.assign(strategy, updates);
      log.info(`Degradation strategy updated: ${strategy.name}`);
    }
  }
  async setRetryConfig(service, config) {
    this.retryConfigs.set(service, config);
    log.info(`Retry config set for service: ${service}`, { config });
  }
  cleanupOldErrorEvents() {
    const cutoffDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
    this.errorEvents = this.errorEvents.filter(event => event.timestamp >= cutoffDate);
  }
  // Utility method for wrapping async operations with error handling
  async withErrorHandling(service, operation, fn, context = {}) {
    try {
      return await fn();
    } catch (error) {
      await this.recordError(service, operation, error, context);
      throw error;
    }
  }
}
export const errorHandlingService = ErrorHandlingService.getInstance();
