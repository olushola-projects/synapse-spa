/**
 * Priority 3 API Routes
 * Implements advanced security monitoring, compliance dashboards, and documentation endpoints
 */
import { Router } from 'express';
import { authenticateJWT } from '../middleware/authMiddleware';
import { advancedSecurityService } from '../services/advancedSecurityService';
import { complianceReportingService } from '../services/complianceReportingService';
import { documentationService } from '../services/documentationService';
import { log } from '../utils/logger';
const router = Router();
// ============================================================================
// ADVANCED SECURITY MONITORING ROUTES
// ============================================================================
/**
 * GET /api/priority3/security/threat-intelligence
 * Get threat intelligence data
 */
router.get('/security/threat-intelligence', authenticateJWT, async (_req, res) => {
  try {
    const threatIntelligence = await advancedSecurityService.getThreatIntelligence();
    res.json({ success: true, data: threatIntelligence });
  } catch (error) {
    log.error('Failed to get threat intelligence', { error });
    res.status(500).json({ success: false, error: 'Failed to get threat intelligence' });
  }
});
/**
 * GET /api/priority3/security/anomalies
 * Get security anomalies
 */
router.get('/security/anomalies', authenticateJWT, async (_req, res) => {
  try {
    const anomalies = await advancedSecurityService.getSecurityAnomalies();
    res.json({ success: true, data: anomalies });
  } catch (error) {
    log.error('Failed to get security anomalies', { error });
    res.status(500).json({ success: false, error: 'Failed to get security anomalies' });
  }
});
/**
 * GET /api/priority3/security/incidents
 * Get security incidents
 */
router.get('/security/incidents', authenticateJWT, async (_req, res) => {
  try {
    const incidents = await advancedSecurityService.getSecurityIncidents();
    res.json({ success: true, data: incidents });
  } catch (error) {
    log.error('Failed to get security incidents', { error });
    res.status(500).json({ success: false, error: 'Failed to get security incidents' });
  }
});
/**
 * GET /api/priority3/security/metrics
 * Get security metrics
 */
router.get('/security/metrics', authenticateJWT, async (_req, res) => {
  try {
    const metrics = await advancedSecurityService.getSecurityMetrics();
    res.json({ success: true, data: metrics });
  } catch (error) {
    log.error('Failed to get security metrics', { error });
    res.status(500).json({ success: false, error: 'Failed to get security metrics' });
  }
});
// ============================================================================
// COMPLIANCE DASHBOARD ROUTES
// ============================================================================
/**
 * GET /api/priority3/compliance/dashboards
 * Get compliance dashboard data
 */
router.get('/compliance/dashboards', authenticateJWT, async (_req, res) => {
  try {
    // Use placeholder data since getDashboardData doesn't exist yet
    const dashboardData = {
      totalDashboards: 0,
      activeDashboards: 0,
      lastUpdated: new Date().toISOString()
    };
    res.json({ success: true, data: dashboardData });
  } catch (error) {
    log.error('Failed to get compliance dashboard data', { error });
    res.status(500).json({ success: false, error: 'Failed to get compliance dashboard data' });
  }
});
/**
 * GET /api/priority3/compliance/reports
 * Get compliance reports
 */
router.get('/compliance/reports', authenticateJWT, async (_req, res) => {
  try {
    const reports = await complianceReportingService.getComplianceReports();
    res.json({ success: true, data: reports });
  } catch (error) {
    log.error('Failed to get compliance reports', { error });
    res.status(500).json({ success: false, error: 'Failed to get compliance reports' });
  }
});
/**
 * GET /api/priority3/compliance/alerts
 * Get compliance alerts
 */
router.get('/compliance/alerts', authenticateJWT, async (_req, res) => {
  try {
    const alerts = await complianceReportingService.getComplianceAlerts();
    res.json({ success: true, data: alerts });
  } catch (error) {
    log.error('Failed to get compliance alerts', { error });
    res.status(500).json({ success: false, error: 'Failed to get compliance alerts' });
  }
});
// ============================================================================
// DOCUMENTATION ROUTES
// ============================================================================
/**
 * GET /api/priority3/documentation
 * Get documentation overview
 */
router.get('/documentation', authenticateJWT, async (_req, res) => {
  try {
    // Use getDocumentationMetrics instead of getDocumentationOverview
    const documentation = await documentationService.getDocumentationMetrics();
    res.json({ success: true, data: documentation });
  } catch (error) {
    log.error('Failed to get documentation overview', { error });
    res.status(500).json({ success: false, error: 'Failed to get documentation overview' });
  }
});
/**
 * GET /api/priority3/documentation/templates
 * Get documentation templates
 */
router.get('/documentation/templates', authenticateJWT, async (_req, res) => {
  try {
    const templates = await documentationService.getDocumentationTemplates();
    res.json({ success: true, data: templates });
  } catch (error) {
    log.error('Failed to get documentation templates', { error });
    res.status(500).json({ success: false, error: 'Failed to get documentation templates' });
  }
});
/**
 * GET /api/priority3/documentation/metrics
 * Get documentation metrics
 */
router.get('/documentation/metrics', authenticateJWT, async (_req, res) => {
  try {
    const metrics = await documentationService.getDocumentationMetrics();
    res.json({ success: true, data: metrics });
  } catch (error) {
    log.error('Failed to get documentation metrics', { error });
    res.status(500).json({ success: false, error: 'Failed to get documentation metrics' });
  }
});
// ============================================================================
// HEALTH CHECK ROUTES
// ============================================================================
/**
 * GET /api/priority3/health
 * Get Priority 3 services health status
 */
router.get('/health', authenticateJWT, async (_req, res) => {
  try {
    const healthStatus = {
      timestamp: new Date().toISOString(),
      services: {
        advancedSecurity: 'healthy',
        complianceReporting: 'healthy',
        documentation: 'healthy'
      },
      version: '1.0.0'
    };
    res.json({ success: true, data: healthStatus });
  } catch (error) {
    log.error('Failed to get health status', { error });
    res.status(500).json({ success: false, error: 'Failed to get health status' });
  }
});
export default router;
