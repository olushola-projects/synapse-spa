/**
 * API Health Monitoring Service
 * Provides real-time health monitoring, fallback logic, and performance tracking
 */

import { backendApiClient } from './backendApiClient';
import { nexusClient } from './nexusAgentClient';

export interface HealthStatus {
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime: number;
  lastChecked: Date;
  error?: string;
  fallbackAvailable: boolean;
}

export interface SystemHealth {
  overall: 'healthy' | 'degraded' | 'unhealthy';
  services: HealthStatus[];
  recommendations: string[];
}

class ApiHealthMonitor {
  private healthData: Map<string, HealthStatus> = new Map();
  private checkInterval = 60000; // 1 minute
  private intervalId: NodeJS.Timeout | null = null;
  private listeners: Array<(health: SystemHealth) => void> = [];

  /**
   * Start monitoring API health
   */
  startMonitoring(): void {
    if (this.intervalId) {
      this.stopMonitoring();
    }

    // Initial check
    this.performHealthCheck();

    // Schedule regular checks
    this.intervalId = setInterval(() => {
      this.performHealthCheck();
    }, this.checkInterval);

    console.log('🔍 API Health Monitoring started');
  }

  /**
   * Stop monitoring
   */
  stopMonitoring(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    console.log('🔍 API Health Monitoring stopped');
  }

  /**
   * Add health status listener
   */
  addListener(listener: (health: SystemHealth) => void): void {
    this.listeners.push(listener);
  }

  /**
   * Remove health status listener
   */
  removeListener(listener: (health: SystemHealth) => void): void {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  /**
   * Get current system health
   */
  getSystemHealth(): SystemHealth {
    const services = Array.from(this.healthData.values());
    const healthyServices = services.filter(s => s.status === 'healthy').length;
    const degradedServices = services.filter(s => s.status === 'degraded').length;
    const unhealthyServices = services.filter(s => s.status === 'unhealthy').length;

    let overall: 'healthy' | 'degraded' | 'unhealthy';
    if (unhealthyServices > 0) {
      overall = healthyServices > 0 ? 'degraded' : 'unhealthy';
    } else if (degradedServices > 0) {
      overall = 'degraded';
    } else {
      overall = 'healthy';
    }

    const recommendations = this.generateRecommendations(services);

    return { overall, services, recommendations };
  }

  /**
   * Perform health check on all services
   */
  private async performHealthCheck(): Promise<void> {
    const checks = [
      this.checkExternalApi(),
      this.checkSupabaseEdgeFunctions(),
      this.checkLLMIntegration()
    ];

    await Promise.allSettled(checks);

    // Notify listeners
    const systemHealth = this.getSystemHealth();
    this.listeners.forEach(listener => listener(systemHealth));
  }

  /**
   * Check external API health
   */
  private async checkExternalApi(): Promise<void> {
    const startTime = Date.now();
    const serviceName = 'External API (api.joinsynapses.com)';

    try {
      const response = await backendApiClient.healthCheck();
      const responseTime = Date.now() - startTime;

      if (response.error) {
        this.updateHealthStatus(serviceName, {
          status: response.status === 0 ? 'unhealthy' : 'degraded',
          responseTime,
          error: response.error,
          fallbackAvailable: true
        });
      } else {
        this.updateHealthStatus(serviceName, {
          status: responseTime > 5000 ? 'degraded' : 'healthy',
          responseTime,
          fallbackAvailable: true
        });
      }
    } catch (error) {
      this.updateHealthStatus(serviceName, {
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
        fallbackAvailable: true
      });
    }
  }

  /**
   * Check Supabase Edge Functions health
   */
  private async checkSupabaseEdgeFunctions(): Promise<void> {
    const startTime = Date.now();
    const serviceName = 'Supabase Edge Functions';

    try {
      await nexusClient.getHealth();
      const responseTime = Date.now() - startTime;

      this.updateHealthStatus(serviceName, {
        status: responseTime > 3000 ? 'degraded' : 'healthy',
        responseTime,
        fallbackAvailable: false
      });
    } catch (error) {
      this.updateHealthStatus(serviceName, {
        status: 'degraded',
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
        fallbackAvailable: false
      });
    }
  }

  /**
   * Check LLM integration health
   */
  private async checkLLMIntegration(): Promise<void> {
    const startTime = Date.now();
    const serviceName = 'LLM Integration';

    try {
      const testRequest = {
        text: 'Health check test for SFDR classification',
        document_type: 'health_check',
        strategy: 'primary' as const
      };

      const response = await backendApiClient.classifyDocument(testRequest);
      const responseTime = Date.now() - startTime;

      if (response.error) {
        this.updateHealthStatus(serviceName, {
          status: 'degraded',
          responseTime,
          error: response.error,
          fallbackAvailable: true
        });
      } else {
        this.updateHealthStatus(serviceName, {
          status: responseTime > 10000 ? 'degraded' : 'healthy',
          responseTime,
          fallbackAvailable: true
        });
      }
    } catch (error) {
      this.updateHealthStatus(serviceName, {
        status: 'degraded',
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
        fallbackAvailable: true
      });
    }
  }

  /**
   * Update health status for a service
   */
  private updateHealthStatus(
    service: string,
    update: Omit<HealthStatus, 'service' | 'lastChecked'>
  ): void {
    this.healthData.set(service, {
      service,
      lastChecked: new Date(),
      ...update
    });
  }

  /**
   * Generate recommendations based on current health status
   */
  private generateRecommendations(services: HealthStatus[]): string[] {
    const recommendations: string[] = [];

    const externalApi = services.find(s => s.service.includes('External API'));
    const supabase = services.find(s => s.service.includes('Supabase'));
    const llm = services.find(s => s.service.includes('LLM'));

    if (externalApi?.status === 'unhealthy') {
      recommendations.push(
        'External API is unreachable. Verify network connectivity and API status.'
      );
      recommendations.push('Configure NEXUS_API_KEY in Supabase secrets for authentication.');
    }

    if (externalApi?.status === 'degraded') {
      recommendations.push(
        'External API is responding slowly. Consider implementing request caching.'
      );
    }

    if (llm?.status === 'degraded') {
      recommendations.push(
        'LLM integration is experiencing issues. Check API quotas and rate limits.'
      );
    }

    if (supabase?.status === 'degraded') {
      recommendations.push(
        'Supabase Edge Functions are responding slowly. Monitor database performance.'
      );
    }

    const unhealthyCount = services.filter(s => s.status === 'unhealthy').length;
    if (unhealthyCount > 1) {
      recommendations.push('Multiple services are unhealthy. Consider activating fallback mode.');
    }

    if (recommendations.length === 0) {
      recommendations.push('All systems are operating normally.');
    }

    return recommendations;
  }

  /**
   * Get recommended backend strategy based on health status
   */
  getRecommendedStrategy(): 'external' | 'supabase' | 'hybrid' {
    const externalApi = this.healthData.get('External API (api.joinsynapses.com)');
    const supabase = this.healthData.get('Supabase Edge Functions');

    if (externalApi?.status === 'healthy') {
      return 'external';
    } else if (supabase?.status === 'healthy') {
      return 'supabase';
    } else {
      return 'hybrid';
    }
  }
}

// Export singleton instance
export const apiHealthMonitor = new ApiHealthMonitor();

// Auto-start monitoring in production
if (typeof window !== 'undefined') {
  apiHealthMonitor.startMonitoring();
}
