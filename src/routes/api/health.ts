/**
 * Health Check API Routes
 * Provides system health monitoring and status endpoints
 * Part of Phase 2: Security Infrastructure
 */

import express from 'express';
import { getSupabase } from '../../integrations/supabase/client';
import { SecurityMonitoring } from '../../lib/monitoring';

const router = express.Router();

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  uptime: number;
  environment: string;
  services: {
    database: ServiceHealth;
    authentication: ServiceHealth;
    monitoring: ServiceHealth;
    api: ServiceHealth;
  };
  metrics: {
    memoryUsage: NodeJS.MemoryUsage;
    cpuUsage: NodeJS.CpuUsage;
    activeConnections: number;
  };
}

interface ServiceHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime?: number;
  lastCheck: string;
  error?: string;
}

/**
 * Basic health check endpoint
 * GET /api/health
 */
router.get('/', async (req: express.Request, res: express.Response) => {
  try {
    const startTime = Date.now();

    // Check database connectivity
    const dbHealth = await checkDatabaseHealth();

    // Check authentication service
    const authHealth = await checkAuthenticationHealth();

    // Check monitoring service
    const monitoringHealth = await checkMonitoringHealth();

    // Get system metrics
    const metrics = getSystemMetrics();

    // Determine overall status
    const services = {
      database: dbHealth,
      authentication: authHealth,
      monitoring: monitoringHealth,
      api: {
        status: 'healthy' as const,
        responseTime: Date.now() - startTime,
        lastCheck: new Date().toISOString()
      }
    };

    const overallStatus = determineOverallStatus(services);

    const healthStatus: HealthStatus = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: process.env.APP_VERSION || '1.0.0',
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      services,
      metrics
    };

    // Set appropriate HTTP status code
    const statusCode = overallStatus === 'healthy' ? 200 : overallStatus === 'degraded' ? 200 : 503;

    res.status(statusCode).json(healthStatus);
  } catch (error) {
    console.error('Health check error:', error);

    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Detailed health check with service-specific information
 * GET /api/health/detailed
 */
router.get('/detailed', async (req: express.Request, res: express.Response) => {
  try {
    const checks = await Promise.allSettled([
      checkDatabaseHealth(),
      checkAuthenticationHealth(),
      checkMonitoringHealth(),
      checkExternalServices(),
      getSecurityMetrics(),
      getPerformanceMetrics()
    ]);

    const [
      dbResult,
      authResult,
      monitoringResult,
      externalResult,
      securityResult,
      performanceResult
    ] = checks;

    const detailedHealth = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.APP_VERSION || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      checks: {
        database:
          dbResult.status === 'fulfilled'
            ? dbResult.value
            : { status: 'unhealthy', error: dbResult.reason },
        authentication:
          authResult.status === 'fulfilled'
            ? authResult.value
            : { status: 'unhealthy', error: authResult.reason },
        monitoring:
          monitoringResult.status === 'fulfilled'
            ? monitoringResult.value
            : { status: 'unhealthy', error: monitoringResult.reason },
        external:
          externalResult.status === 'fulfilled'
            ? externalResult.value
            : { status: 'unhealthy', error: externalResult.reason },
        security:
          securityResult.status === 'fulfilled'
            ? securityResult.value
            : { status: 'unhealthy', error: securityResult.reason },
        performance:
          performanceResult.status === 'fulfilled'
            ? performanceResult.value
            : { status: 'healthy', metrics: {} }
      },
      systemInfo: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage()
      }
    };

    res.json(detailedHealth);
  } catch (error) {
    console.error('Detailed health check error:', error);
    res.status(503).json({
      status: 'unhealthy',
      error: 'Detailed health check failed',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Readiness probe for Kubernetes/container orchestration
 * GET /api/health/ready
 */
router.get('/ready', async (req: express.Request, res: express.Response) => {
  try {
    // Check critical services that must be available
    const dbHealth = await checkDatabaseHealth();

    if (dbHealth.status === 'unhealthy') {
      return res.status(503).json({
        ready: false,
        reason: 'Database unavailable',
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      ready: true,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      ready: false,
      reason: 'Readiness check failed',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Liveness probe for Kubernetes/container orchestration
 * GET /api/health/live
 */
router.get('/live', (req: express.Request, res: express.Response) => {
  // Simple liveness check - if we can respond, we're alive
  res.json({
    alive: true,
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

/**
 * Security health check
 * GET /api/health/security
 */
router.get('/security', async (req: express.Request, res: express.Response) => {
  try {
    const securityMetrics = await getSecurityMetrics();

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      security: securityMetrics
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: 'Security health check failed',
      timestamp: new Date().toISOString()
    });
  }
});

// Helper functions

/**
 * Check database health
 */
async function checkDatabaseHealth(): Promise<ServiceHealth> {
  const startTime = Date.now();

  try {
    // Simple query to test database connectivity
    const { data, error } = await getSupabase().from('user_profiles').select('id').limit(1);

    if (error) {
      return {
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        lastCheck: new Date().toISOString(),
        error: error.message
      };
    }

    const responseTime = Date.now() - startTime;

    return {
      status: responseTime > 1000 ? 'degraded' : 'healthy',
      responseTime,
      lastCheck: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      responseTime: Date.now() - startTime,
      lastCheck: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown database error'
    };
  }
}

/**
 * Check authentication service health
 */
async function checkAuthenticationHealth(): Promise<ServiceHealth> {
  const startTime = Date.now();

  try {
    // Test Supabase auth service
    const { data, error } = await getSupabase().auth.getSession();

    if (error && error.message !== 'No session found') {
      return {
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        lastCheck: new Date().toISOString(),
        error: error.message
      };
    }

    const responseTime = Date.now() - startTime;

    return {
      status: responseTime > 500 ? 'degraded' : 'healthy',
      responseTime,
      lastCheck: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      responseTime: Date.now() - startTime,
      lastCheck: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown auth error'
    };
  }
}

/**
 * Check monitoring service health
 */
async function checkMonitoringHealth(): Promise<ServiceHealth> {
  const startTime = Date.now();

  try {
    // Test monitoring system by checking recent events
    const { data, error } = await supabase.from('security_events').select('id').limit(1);

    if (error) {
      return {
        status: 'degraded', // Monitoring is not critical for basic operation
        responseTime: Date.now() - startTime,
        lastCheck: new Date().toISOString(),
        error: error.message
      };
    }

    const responseTime = Date.now() - startTime;

    return {
      status: responseTime > 1000 ? 'degraded' : 'healthy',
      responseTime,
      lastCheck: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'degraded',
      responseTime: Date.now() - startTime,
      lastCheck: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown monitoring error'
    };
  }
}

/**
 * Check external services
 */
async function checkExternalServices(): Promise<Record<string, ServiceHealth>> {
  const services: Record<string, ServiceHealth> = {};

  // Check Supabase API
  try {
    const startTime = Date.now();
    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/`, {
      headers: {
        apikey: process.env.SUPABASE_ANON_KEY || '',
        Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`
      }
    });

    const responseTime = Date.now() - startTime;

    services.supabase = {
      status: response.ok ? (responseTime > 2000 ? 'degraded' : 'healthy') : 'unhealthy',
      responseTime,
      lastCheck: new Date().toISOString(),
      ...(response.ok ? {} : { error: `HTTP ${response.status}` })
    };
  } catch (error) {
    services.supabase = {
      status: 'unhealthy',
      lastCheck: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }

  return services;
}

/**
 * Get security metrics
 */
async function getSecurityMetrics(): Promise<Record<string, any>> {
  try {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    // Get recent security events
    const { data: recentEvents } = await getSupabase()
      .from('security_events')
      .select('event_type, severity')
      .gte('created_at', oneHourAgo.toISOString());

    // Get blocked IPs count
    const { count: blockedIPs } = await getSupabase()
      .from('ip_blocklist')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    // Get active incidents
    const { count: activeIncidents } = await getSupabase()
      .from('security_incidents')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'open');

    return {
      recentEvents: recentEvents?.length || 0,
      blockedIPs: blockedIPs || 0,
      activeIncidents: activeIncidents || 0,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to get security metrics'
    };
  }
}

/**
 * Get performance metrics
 */
async function getPerformanceMetrics(): Promise<Record<string, any>> {
  return {
    memoryUsage: process.memoryUsage(),
    cpuUsage: process.cpuUsage(),
    uptime: process.uptime(),
    loadAverage: process.platform !== 'win32' ? (await import('os')).loadavg() : null,
    timestamp: new Date().toISOString()
  };
}

/**
 * Get system metrics
 */
async function getSystemMetrics() {
  return {
    memoryUsage: process.memoryUsage(),
    cpuUsage: process.cpuUsage(),
    activeConnections: 0 // This would need to be tracked separately
  };
}

/**
 * Determine overall system status
 */
function determineOverallStatus(
  services: Record<string, ServiceHealth>
): 'healthy' | 'degraded' | 'unhealthy' {
  const statuses = Object.values(services).map(service => service.status);

  if (statuses.includes('unhealthy')) {
    return 'unhealthy';
  }

  if (statuses.includes('degraded')) {
    return 'degraded';
  }

  return 'healthy';
}

export default router;
