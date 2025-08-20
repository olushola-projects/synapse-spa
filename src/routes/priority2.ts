/**
 * Priority 2 API Routes
 * Implements endpoints for compliance automation, performance optimization, and error handling
 */

import { Router } from 'express';
import { authenticateJWT, requireRole } from '../middleware/authMiddleware';
import { complianceAutomationService } from '../services/complianceAutomationService';
import { errorHandlingService } from '../services/errorHandlingService';
import { performanceOptimizationService } from '../services/performanceOptimizationService';
import { log } from '../utils/logger';

const router = Router();

// ============================================================================
// COMPLIANCE AUTOMATION ROUTES
// ============================================================================

/**
 * GET /api/priority2/compliance/rules
 * Get all compliance rules
 */
router.get(
  '/compliance/rules',
  authenticateJWT,
  requireRole(['admin', 'compliance']),
  async (req, res) => {
    try {
      const rules = await complianceAutomationService.getComplianceRules();
      res.json({ success: true, data: rules });
    } catch (error) {
      log.error('Failed to get compliance rules', { error });
      res.status(500).json({ success: false, error: 'Failed to get compliance rules' });
    }
  }
);

/**
 * POST /api/priority2/compliance/rules
 * Create a new compliance rule
 */
router.post('/compliance/rules', authenticateJWT, requireRole(['admin']), async (req, res) => {
  try {
    const { name, category, severity, status, automated, checkInterval } = req.body;

    const rule = await complianceAutomationService.createComplianceRule({
      name,
      category,
      severity,
      status,
      automated,
      checkInterval
    });

    res.status(201).json({ success: true, data: rule });
  } catch (error) {
    log.error('Failed to create compliance rule', { error });
    res.status(500).json({ success: false, error: 'Failed to create compliance rule' });
  }
});

/**
 * GET /api/priority2/compliance/checks
 * Get compliance checks
 */
router.get(
  '/compliance/checks',
  authenticateJWT,
  requireRole(['admin', 'compliance']),
  async (req, res) => {
    try {
      const checks = await complianceAutomationService.getComplianceChecks();
      res.json({ success: true, data: checks });
    } catch (error) {
      log.error('Failed to get compliance checks', { error });
      res.status(500).json({ success: false, error: 'Failed to get compliance checks' });
    }
  }
);

/**
 * POST /api/priority2/compliance/execute-check/:ruleId
 * Manually execute a compliance check
 */
router.post(
  '/compliance/execute-check/:ruleId',
  authenticateJWT,
  requireRole(['admin']),
  async (req, res) => {
    try {
      const { ruleId } = req.params;
      const check = await complianceAutomationService.executeComplianceCheck(ruleId);
      res.json({ success: true, data: check });
    } catch (error) {
      log.error('Failed to execute compliance check', { error });
      res.status(500).json({ success: false, error: 'Failed to execute compliance check' });
    }
  }
);

/**
 * POST /api/priority2/compliance/reports
 * Generate compliance report
 */
router.post(
  '/compliance/reports',
  authenticateJWT,
  requireRole(['admin', 'compliance']),
  async (req, res) => {
    try {
      const { startDate, endDate } = req.body;
      const generatedBy = req.user?.id || 'system';

      const report = await complianceAutomationService.generateComplianceReport(
        { start: new Date(startDate), end: new Date(endDate) },
        generatedBy
      );

      res.json({ success: true, data: report });
    } catch (error) {
      log.error('Failed to generate compliance report', { error });
      res.status(500).json({ success: false, error: 'Failed to generate compliance report' });
    }
  }
);

// ============================================================================
// PERFORMANCE OPTIMIZATION ROUTES
// ============================================================================

/**
 * GET /api/priority2/performance/metrics
 * Get performance metrics
 */
router.get(
  '/performance/metrics',
  authenticateJWT,
  requireRole(['admin', 'devops']),
  async (req, res) => {
    try {
      const { name, category, startDate, endDate } = req.query;

      const filters: any = {};
      if (name) filters.name = name as string;
      if (category) filters.category = category as string;
      if (startDate) filters.startDate = new Date(startDate as string);
      if (endDate) filters.endDate = new Date(endDate as string);

      const metrics = await performanceOptimizationService.getPerformanceMetrics(filters);
      res.json({ success: true, data: metrics });
    } catch (error) {
      log.error('Failed to get performance metrics', { error });
      res.status(500).json({ success: false, error: 'Failed to get performance metrics' });
    }
  }
);

/**
 * POST /api/priority2/performance/metrics
 * Record a custom performance metric
 */
router.post(
  '/performance/metrics',
  authenticateJWT,
  requireRole(['admin', 'devops']),
  async (req, res) => {
    try {
      const { name, value, unit, category, metadata } = req.body;

      await performanceOptimizationService.recordMetric(name, value, unit, category, metadata);
      res.status(201).json({ success: true, message: 'Metric recorded successfully' });
    } catch (error) {
      log.error('Failed to record performance metric', { error });
      res.status(500).json({ success: false, error: 'Failed to record performance metric' });
    }
  }
);

/**
 * GET /api/priority2/performance/alerts
 * Get performance alerts
 */
router.get(
  '/performance/alerts',
  authenticateJWT,
  requireRole(['admin', 'devops']),
  async (req, res) => {
    try {
      const alerts = await performanceOptimizationService.getPerformanceAlerts();
      res.json({ success: true, data: alerts });
    } catch (error) {
      log.error('Failed to get performance alerts', { error });
      res.status(500).json({ success: false, error: 'Failed to get performance alerts' });
    }
  }
);

/**
 * POST /api/priority2/performance/alerts/:alertId/acknowledge
 * Acknowledge a performance alert
 */
router.post(
  '/performance/alerts/:alertId/acknowledge',
  authenticateJWT,
  requireRole(['admin', 'devops']),
  async (req, res) => {
    try {
      const { alertId } = req.params;
      await performanceOptimizationService.acknowledgeAlert(alertId);
      res.json({ success: true, message: 'Alert acknowledged successfully' });
    } catch (error) {
      log.error('Failed to acknowledge performance alert', { error });
      res.status(500).json({ success: false, error: 'Failed to acknowledge performance alert' });
    }
  }
);

/**
 * POST /api/priority2/performance/thresholds
 * Set performance threshold
 */
router.post(
  '/performance/thresholds',
  authenticateJWT,
  requireRole(['admin']),
  async (req, res) => {
    try {
      const { metricName, warning, critical } = req.body;
      await performanceOptimizationService.setPerformanceThreshold(metricName, warning, critical);
      res.json({ success: true, message: 'Performance threshold set successfully' });
    } catch (error) {
      log.error('Failed to set performance threshold', { error });
      res.status(500).json({ success: false, error: 'Failed to set performance threshold' });
    }
  }
);

/**
 * GET /api/priority2/performance/optimizations
 * Get performance optimizations
 */
router.get(
  '/performance/optimizations',
  authenticateJWT,
  requireRole(['admin', 'devops']),
  async (req, res) => {
    try {
      const optimizations = await performanceOptimizationService.getPerformanceOptimizations();
      res.json({ success: true, data: optimizations });
    } catch (error) {
      log.error('Failed to get performance optimizations', { error });
      res.status(500).json({ success: false, error: 'Failed to get performance optimizations' });
    }
  }
);

/**
 * POST /api/priority2/performance/optimizations/:optimizationId/implement
 * Implement a performance optimization
 */
router.post(
  '/performance/optimizations/:optimizationId/implement',
  authenticateJWT,
  requireRole(['admin']),
  async (req, res) => {
    try {
      const { optimizationId } = req.params;
      await performanceOptimizationService.implementOptimization(optimizationId);
      res.json({ success: true, message: 'Performance optimization implemented successfully' });
    } catch (error) {
      log.error('Failed to implement performance optimization', { error });
      res
        .status(500)
        .json({ success: false, error: 'Failed to implement performance optimization' });
    }
  }
);

/**
 * POST /api/priority2/performance/reports
 * Generate performance report
 */
router.post(
  '/performance/reports',
  authenticateJWT,
  requireRole(['admin', 'devops']),
  async (req, res) => {
    try {
      const report = await performanceOptimizationService.generatePerformanceReport();
      res.json({ success: true, data: report });
    } catch (error) {
      log.error('Failed to generate performance report', { error });
      res.status(500).json({ success: false, error: 'Failed to generate performance report' });
    }
  }
);

// ============================================================================
// ERROR HANDLING ROUTES
// ============================================================================

/**
 * GET /api/priority2/errors/circuit-breakers
 * Get all circuit breaker states
 */
router.get(
  '/errors/circuit-breakers',
  authenticateJWT,
  requireRole(['admin', 'devops']),
  async (req, res) => {
    try {
      const circuitBreakers = await errorHandlingService.getAllCircuitBreakers();
      res.json({ success: true, data: circuitBreakers });
    } catch (error) {
      log.error('Failed to get circuit breakers', { error });
      res.status(500).json({ success: false, error: 'Failed to get circuit breakers' });
    }
  }
);

/**
 * GET /api/priority2/errors/circuit-breakers/:name
 * Get specific circuit breaker state
 */
router.get(
  '/errors/circuit-breakers/:name',
  authenticateJWT,
  requireRole(['admin', 'devops']),
  async (req, res) => {
    try {
      const { name } = req.params;
      const circuitBreaker = await errorHandlingService.getCircuitBreakerState(name);

      if (!circuitBreaker) {
        return res.status(404).json({ success: false, error: 'Circuit breaker not found' });
      }

      res.json({ success: true, data: circuitBreaker });
    } catch (error) {
      log.error('Failed to get circuit breaker state', { error });
      res.status(500).json({ success: false, error: 'Failed to get circuit breaker state' });
    }
  }
);

/**
 * POST /api/priority2/errors/circuit-breakers/:name/reset
 * Reset a circuit breaker
 */
router.post(
  '/errors/circuit-breakers/:name/reset',
  authenticateJWT,
  requireRole(['admin']),
  async (req, res) => {
    try {
      const { name } = req.params;
      await errorHandlingService.resetCircuitBreaker(name);
      res.json({ success: true, message: 'Circuit breaker reset successfully' });
    } catch (error) {
      log.error('Failed to reset circuit breaker', { error });
      res.status(500).json({ success: false, error: 'Failed to reset circuit breaker' });
    }
  }
);

/**
 * GET /api/priority2/errors/events
 * Get error events
 */
router.get(
  '/errors/events',
  authenticateJWT,
  requireRole(['admin', 'devops']),
  async (req, res) => {
    try {
      const { service, severity, startDate, endDate } = req.query;

      const filters: any = {};
      if (service) filters.service = service as string;
      if (severity) filters.severity = severity as string;
      if (startDate) filters.startDate = new Date(startDate as string);
      if (endDate) filters.endDate = new Date(endDate as string);

      const events = await errorHandlingService.getErrorEvents(filters);
      res.json({ success: true, data: events });
    } catch (error) {
      log.error('Failed to get error events', { error });
      res.status(500).json({ success: false, error: 'Failed to get error events' });
    }
  }
);

/**
 * POST /api/priority2/errors/events/:errorId/handle
 * Mark error as handled
 */
router.post(
  '/errors/events/:errorId/handle',
  authenticateJWT,
  requireRole(['admin', 'devops']),
  async (req, res) => {
    try {
      const { errorId } = req.params;
      const { resolution } = req.body;
      await errorHandlingService.markErrorAsHandled(errorId, resolution);
      res.json({ success: true, message: 'Error marked as handled successfully' });
    } catch (error) {
      log.error('Failed to mark error as handled', { error });
      res.status(500).json({ success: false, error: 'Failed to mark error as handled' });
    }
  }
);

/**
 * GET /api/priority2/errors/degradation-strategies
 * Get degradation strategies
 */
router.get(
  '/errors/degradation-strategies',
  authenticateJWT,
  requireRole(['admin', 'devops']),
  async (req, res) => {
    try {
      const strategies = await errorHandlingService.getDegradationStrategies();
      res.json({ success: true, data: strategies });
    } catch (error) {
      log.error('Failed to get degradation strategies', { error });
      res.status(500).json({ success: false, error: 'Failed to get degradation strategies' });
    }
  }
);

/**
 * PUT /api/priority2/errors/degradation-strategies/:strategyId
 * Update degradation strategy
 */
router.put(
  '/errors/degradation-strategies/:strategyId',
  authenticateJWT,
  requireRole(['admin']),
  async (req, res) => {
    try {
      const { strategyId } = req.params;
      const updates = req.body;
      await errorHandlingService.updateDegradationStrategy(strategyId, updates);
      res.json({ success: true, message: 'Degradation strategy updated successfully' });
    } catch (error) {
      log.error('Failed to update degradation strategy', { error });
      res.status(500).json({ success: false, error: 'Failed to update degradation strategy' });
    }
  }
);

/**
 * POST /api/priority2/errors/retry-config
 * Set retry configuration for a service
 */
router.post('/errors/retry-config', authenticateJWT, requireRole(['admin']), async (req, res) => {
  try {
    const { service, config } = req.body;
    await errorHandlingService.setRetryConfig(service, config);
    res.json({ success: true, message: 'Retry configuration set successfully' });
  } catch (error) {
    log.error('Failed to set retry configuration', { error });
    res.status(500).json({ success: false, error: 'Failed to set retry configuration' });
  }
});

/**
 * POST /api/priority2/errors/reports
 * Generate error report
 */
router.post(
  '/errors/reports',
  authenticateJWT,
  requireRole(['admin', 'devops']),
  async (req, res) => {
    try {
      const { startDate, endDate } = req.body;
      const report = await errorHandlingService.generateErrorReport({
        start: new Date(startDate),
        end: new Date(endDate)
      });
      res.json({ success: true, data: report });
    } catch (error) {
      log.error('Failed to generate error report', { error });
      res.status(500).json({ success: false, error: 'Failed to generate error report' });
    }
  }
);

// ============================================================================
// UTILITY ROUTES
// ============================================================================

/**
 * POST /api/priority2/execute-with-circuit-breaker
 * Execute operation with circuit breaker protection
 */
router.post(
  '/execute-with-circuit-breaker',
  authenticateJWT,
  requireRole(['admin', 'devops']),
  async (req, res) => {
    try {
      const { name, operation, config } = req.body;

      // This is a simplified example - in practice, you'd have predefined operations
      const result = await errorHandlingService.executeWithCircuitBreaker(
        name,
        async () => {
          // Simulate the operation
          await new Promise(resolve => setTimeout(resolve, 1000));
          return { message: 'Operation completed successfully' };
        },
        config
      );

      res.json({ success: true, data: result });
    } catch (error) {
      log.error('Failed to execute with circuit breaker', { error });
      res.status(500).json({ success: false, error: 'Failed to execute with circuit breaker' });
    }
  }
);

/**
 * POST /api/priority2/execute-with-retry
 * Execute operation with retry mechanism
 */
router.post(
  '/execute-with-retry',
  authenticateJWT,
  requireRole(['admin', 'devops']),
  async (req, res) => {
    try {
      const { name, operation, config } = req.body;

      const result = await errorHandlingService.executeWithRetry(
        name,
        async () => {
          // Simulate the operation
          await new Promise(resolve => setTimeout(resolve, 1000));
          return { message: 'Operation completed successfully' };
        },
        config
      );

      res.json({ success: true, data: result });
    } catch (error) {
      log.error('Failed to execute with retry', { error });
      res.status(500).json({ success: false, error: 'Failed to execute with retry' });
    }
  }
);

/**
 * POST /api/priority2/measure-execution-time
 * Measure execution time of an operation
 */
router.post(
  '/measure-execution-time',
  authenticateJWT,
  requireRole(['admin', 'devops']),
  async (req, res) => {
    try {
      const { name, operation } = req.body;

      const result = await performanceOptimizationService.measureExecutionTime(name, async () => {
        // Simulate the operation
        await new Promise(resolve => setTimeout(resolve, Math.random() * 2000));
        return { message: 'Operation completed successfully' };
      });

      res.json({ success: true, data: result });
    } catch (error) {
      log.error('Failed to measure execution time', { error });
      res.status(500).json({ success: false, error: 'Failed to measure execution time' });
    }
  }
);

/**
 * GET /api/priority2/status
 * Get overall Priority 2 services status
 */
router.get('/status', authenticateJWT, requireRole(['admin', 'devops']), async (req, res) => {
  try {
    const [complianceRules, performanceAlerts, circuitBreakers, errorEvents] = await Promise.all([
      complianceAutomationService.getComplianceRules(),
      performanceOptimizationService.getPerformanceAlerts(),
      errorHandlingService.getAllCircuitBreakers(),
      errorHandlingService.getErrorEvents({ startDate: new Date(Date.now() - 24 * 60 * 60 * 1000) })
    ]);

    const status = {
      compliance: {
        totalRules: complianceRules.length,
        activeRules: complianceRules.filter(r => r.status === 'active').length
      },
      performance: {
        activeAlerts: performanceAlerts.length,
        criticalAlerts: performanceAlerts.filter(a => a.severity === 'critical').length
      },
      errorHandling: {
        totalCircuitBreakers: circuitBreakers.length,
        openCircuitBreakers: circuitBreakers.filter(cb => cb.status === 'open').length,
        recentErrors: errorEvents.length
      }
    };

    res.json({ success: true, data: status });
  } catch (error) {
    log.error('Failed to get Priority 2 status', { error });
    res.status(500).json({ success: false, error: 'Failed to get Priority 2 status' });
  }
});

export default router;
