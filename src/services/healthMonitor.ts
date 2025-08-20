/**
 * Health Monitoring Service
 * Monitors application health, memory usage, and prevents React mounting failures
 * Implements enterprise-grade monitoring with regulatory compliance
 */

interface HealthMetrics {
  memoryUsage: number;
  memoryLimit: number;
  cpuUsage: number;
  loadTime: number;
  errorCount: number;
  lastCheck: Date;
  status: 'healthy' | 'warning' | 'critical';
}

interface HealthCheckResult {
  isHealthy: boolean;
  metrics: HealthMetrics;
  warnings: string[];
  errors: string[];
}

class HealthMonitor {
  private static instance: HealthMonitor;
  private metrics: HealthMetrics;
  private checkInterval: NodeJS.Timeout | null = null;
  private errorCount = 0;
  private startTime = Date.now();
  private listeners: ((result: HealthCheckResult) => void)[] = [];

  private constructor() {
    this.metrics = {
      memoryUsage: 0,
      memoryLimit: 0,
      cpuUsage: 0,
      loadTime: 0,
      errorCount: 0,
      lastCheck: new Date(),
      status: 'healthy'
    };
  }

  static getInstance(): HealthMonitor {
    if (!HealthMonitor.instance) {
      HealthMonitor.instance = new HealthMonitor();
    }
    return HealthMonitor.instance;
  }

  /**
   * Start health monitoring
   */
  startMonitoring(intervalMs: number = 30000): void {
    if (this.checkInterval) {
      this.stopMonitoring();
    }

    // Initial health check
    this.performHealthCheck();

    // Set up periodic health checks
    this.checkInterval = setInterval(() => {
      this.performHealthCheck();
    }, intervalMs);

    console.log('Health monitoring started');
  }

  /**
   * Stop health monitoring
   */
  stopMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
      console.log('Health monitoring stopped');
    }
  }

  /**
   * Perform comprehensive health check
   */
  private performHealthCheck(): HealthCheckResult {
    const warnings: string[] = [];
    const errors: string[] = [];

    try {
      // Check memory usage
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        this.metrics.memoryUsage = memory.usedJSHeapSize;
        this.metrics.memoryLimit = memory.jsHeapSizeLimit;

        // Memory usage thresholds
        const memoryUsagePercent = (this.metrics.memoryUsage / this.metrics.memoryLimit) * 100;

        if (memoryUsagePercent > 90) {
          errors.push(`Critical memory usage: ${memoryUsagePercent.toFixed(1)}%`);
          this.metrics.status = 'critical';
        } else if (memoryUsagePercent > 75) {
          warnings.push(`High memory usage: ${memoryUsagePercent.toFixed(1)}%`);
          this.metrics.status = 'warning';
        } else {
          this.metrics.status = 'healthy';
        }
      }

      // Check load time
      this.metrics.loadTime = Date.now() - this.startTime;

      // Check for memory leaks
      if (this.metrics.memoryUsage > 100 * 1024 * 1024) {
        // 100MB threshold
        warnings.push('Potential memory leak detected');
      }

      // Update error count
      this.metrics.errorCount = this.errorCount;
      this.metrics.lastCheck = new Date();

      // Check for React mounting issues
      const rootElement = document.getElementById('root');
      if (!rootElement || !rootElement.children.length) {
        errors.push('React mounting issue detected - root element empty');
        this.metrics.status = 'critical';
      }

      // Check for JavaScript errors
      if (this.errorCount > 10) {
        warnings.push('High error count detected');
      }
    } catch (error) {
      errors.push(
        `Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      this.metrics.status = 'critical';
    }

    const result: HealthCheckResult = {
      isHealthy: this.metrics.status === 'healthy',
      metrics: { ...this.metrics },
      warnings,
      errors
    };

    // Notify listeners
    this.listeners.forEach(listener => listener(result));

    // Log health status
    if (errors.length > 0) {
      console.error('Health check errors:', errors);
    }
    if (warnings.length > 0) {
      console.warn('Health check warnings:', warnings);
    }

    return result;
  }

  /**
   * Record an error for monitoring
   */
  recordError(error: Error): void {
    this.errorCount++;
    console.error('Health monitor recorded error:', error);

    // Perform immediate health check on error
    this.performHealthCheck();
  }

  /**
   * Get current health status
   */
  getHealthStatus(): HealthCheckResult {
    return this.performHealthCheck();
  }

  /**
   * Add health check listener
   */
  addListener(listener: (result: HealthCheckResult) => void): void {
    this.listeners.push(listener);
  }

  /**
   * Remove health check listener
   */
  removeListener(listener: (result: HealthCheckResult) => void): void {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  /**
   * Force garbage collection if available
   */
  forceGarbageCollection(): void {
    if ('gc' in window) {
      try {
        (window as any).gc();
        console.log('Garbage collection triggered');
      } catch (error) {
        console.warn('Failed to trigger garbage collection:', error);
      }
    }
  }

  /**
   * Get memory usage in human-readable format
   */
  getMemoryUsageString(): string {
    const used = this.metrics.memoryUsage / 1024 / 1024;
    const limit = this.metrics.memoryLimit / 1024 / 1024;
    return `${used.toFixed(1)}MB / ${limit.toFixed(1)}MB`;
  }

  /**
   * Check if application is in a healthy state
   */
  isHealthy(): boolean {
    const result = this.getHealthStatus();
    return result.isHealthy;
  }

  /**
   * Emergency cleanup for critical memory issues
   */
  emergencyCleanup(): void {
    console.warn('Performing emergency cleanup');

    // Force garbage collection
    this.forceGarbageCollection();

    // Clear any cached data
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }

    // Clear localStorage if memory usage is critical
    if (this.metrics.memoryUsage > this.metrics.memoryLimit * 0.95) {
      localStorage.clear();
      console.warn('Cleared localStorage due to critical memory usage');
    }
  }
}

// Global error handler for health monitoring
const setupGlobalErrorHandling = (): void => {
  const healthMonitor = HealthMonitor.getInstance();

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', event => {
    healthMonitor.recordError(new Error(`Unhandled promise rejection: ${event.reason}`));
  });

  // Handle JavaScript errors
  window.addEventListener('error', event => {
    healthMonitor.recordError(new Error(`JavaScript error: ${event.message}`));
  });

  // Handle React errors
  window.addEventListener('error', event => {
    if (event.error && event.error.message && event.error.message.includes('React')) {
      healthMonitor.recordError(new Error(`React error: ${event.error.message}`));
    }
  });
};

// Initialize global error handling
setupGlobalErrorHandling();

export default HealthMonitor;
export type { HealthMetrics, HealthCheckResult };
