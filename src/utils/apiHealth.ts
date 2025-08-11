/**
 * API Health Monitoring Utilities
 * Provides comprehensive health checking for Supabase Edge Functions
 */

import { apiClient } from '@/services/supabaseApiClient';

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'down';
  latency: number;
  timestamp: string;
  version?: string;
  checks?: {
    database?: { status: string; latency: number };
    functions?: { status: string; latency: number };
  };
}

export interface SystemHealth {
  overall: 'healthy' | 'degraded' | 'down';
  services: {
    nexusHealth: HealthStatus;
    nexusClassify: HealthStatus;
    nexusAnalytics: HealthStatus;
    database: HealthStatus;
  };
  timestamp: string;
}

export class HealthMonitor {
  private static instance: HealthMonitor;
  private healthCache: Map<string, { status: HealthStatus; expiry: number }> = new Map();
  private readonly CACHE_TTL = 30000; // 30 seconds

  static getInstance(): HealthMonitor {
    if (!HealthMonitor.instance) {
      HealthMonitor.instance = new HealthMonitor();
    }
    return HealthMonitor.instance;
  }

  /**
   * Check health of a specific service
   */
  async checkServiceHealth(serviceName: string): Promise<HealthStatus> {
    const cached = this.healthCache.get(serviceName);
    if (cached && Date.now() < cached.expiry) {
      return cached.status;
    }

    const startTime = Date.now();
    
    try {
      let response;
      
      switch (serviceName) {
        case 'nexus-health':
          response = await apiClient.healthCheck();
          break;
        case 'nexus-classify':
          response = await apiClient.callFunction('nexus-classify', { test: true });
          break;
        case 'nexus-analytics':
          response = await apiClient.callFunction('nexus-analytics', {});
          break;
        default:
          throw new Error(`Unknown service: ${serviceName}`);
      }

      const latency = Date.now() - startTime;
      const status: HealthStatus = {
        status: response.error ? 'down' : 'healthy',
        latency,
        timestamp: new Date().toISOString(),
        ...(response.data && { 
          version: response.data.version,
          checks: response.data.checks
        })
      };

      // Cache the result
      this.healthCache.set(serviceName, {
        status,
        expiry: Date.now() + this.CACHE_TTL
      });

      return status;
    } catch (error) {
      const latency = Date.now() - startTime;
      const status: HealthStatus = {
        status: 'down',
        latency,
        timestamp: new Date().toISOString()
      };

      console.error(`Health check failed for ${serviceName}:`, error);
      return status;
    }
  }

  /**
   * Check overall system health
   */
  async checkSystemHealth(): Promise<SystemHealth> {
    const services = ['nexus-health', 'nexus-classify', 'nexus-analytics'];
    
    const healthChecks = await Promise.all(
      services.map(async (service) => ({
        service,
        health: await this.checkServiceHealth(service)
      }))
    );

    const systemHealth: SystemHealth = {
      overall: 'healthy',
      services: {
        nexusHealth: healthChecks.find(h => h.service === 'nexus-health')?.health || { status: 'down', latency: 0, timestamp: new Date().toISOString() },
        nexusClassify: healthChecks.find(h => h.service === 'nexus-classify')?.health || { status: 'down', latency: 0, timestamp: new Date().toISOString() },
        nexusAnalytics: healthChecks.find(h => h.service === 'nexus-analytics')?.health || { status: 'down', latency: 0, timestamp: new Date().toISOString() },
        database: { status: 'healthy', latency: 0, timestamp: new Date().toISOString() } // Placeholder
      },
      timestamp: new Date().toISOString()
    };

    // Determine overall status
    const statuses = Object.values(systemHealth.services).map(s => s.status);
    if (statuses.includes('down')) {
      systemHealth.overall = 'down';
    } else if (statuses.includes('degraded')) {
      systemHealth.overall = 'degraded';
    }

    return systemHealth;
  }

  /**
   * Clear health cache
   */
  clearCache(): void {
    this.healthCache.clear();
  }

  /**
   * Get cached health status
   */
  getCachedHealth(serviceName: string): HealthStatus | null {
    const cached = this.healthCache.get(serviceName);
    return cached && Date.now() < cached.expiry ? cached.status : null;
  }
}

// Export singleton instance
export const healthMonitor = HealthMonitor.getInstance();

/**
 * React Hook for health monitoring
 */
export function useHealthMonitor() {
  return {
    checkServiceHealth: (service: string) => healthMonitor.checkServiceHealth(service),
    checkSystemHealth: () => healthMonitor.checkSystemHealth(),
    getCachedHealth: (service: string) => healthMonitor.getCachedHealth(service),
    clearCache: () => healthMonitor.clearCache()
  };
}