/**
 * Reporting API Routes
 * Handles compliance reporting, security reporting, and dashboard analytics
 * Part of Phase 3: Compliance Framework Implementation
 */

import express from 'express';
import { SecurityMonitoring, SecurityEventType } from '../../lib/monitoring';
import { SecurityMiddleware } from '../../middleware/security';
import { validateInput } from '../../lib/validation';
import { getSupabase } from '../../integrations/supabase/client';

const router = express.Router();

/**
 * Get Executive Dashboard
 * GET /api/reporting/dashboard/executive
 */
router.get('/dashboard/executive', async (req: express.Request, res: express.Response) => {
  try {
    const user = (req as any).user;

    // Get compliance overview
    const { data: complianceOverview } = await getSupabase().rpc('get_compliance_overview', {
      org_id: user.organizationId
    });

    // Get risk overview
    const { data: riskOverview } = await getSupabase().rpc('get_risk_summary', {
      org_id: user.organizationId
    });

    // Get security metrics
    const { data: securityMetrics } = await getSupabase().rpc('get_security_metrics_summary', {
      org_id: user.organizationId,
      days: 30
    });

    // Get recent incidents
    const { data: recentIncidents } = await getSupabase()
      .from('security_incidents')
      .select(
        `
        id,
        title,
        severity,
        status,
        created_at,
        resolved_at
      `
      )
      .eq('organization_id', user.organizationId)
      .order('created_at', { ascending: false })
      .limit(5);

    // Get upcoming deadlines
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const { data: upcomingDeadlines } = await getSupabase()
      .from('compliance_controls')
      .select(
        `
        id,
        title,
        next_review_date,
        compliance_frameworks(name, framework_type)
      `
      )
      .lte('next_review_date', thirtyDaysFromNow.toISOString())
      .gte('next_review_date', new Date().toISOString())
      .order('next_review_date', { ascending: true })
      .limit(10);

    // Get audit status
    const { data: auditStatus } = await getSupabase()
      .from('compliance_assessments')
      .select('status, assessment_type')
      .eq('organization_id', user.organizationId)
      .gte('created_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString());

    const dashboard = {
      compliance: complianceOverview?.[0] || {
        total_frameworks: 0,
        active_frameworks: 0,
        total_controls: 0,
        implemented_controls: 0,
        compliance_score: 0
      },
      risk: riskOverview?.[0] || {
        total_risks: 0,
        high_risks: 0,
        medium_risks: 0,
        low_risks: 0,
        avg_risk_score: 0
      },
      security: securityMetrics?.[0] || {
        total_events: 0,
        security_incidents: 0,
        blocked_attempts: 0,
        threat_level: 'low'
      },
      incidents: recentIncidents || [],
      deadlines: upcomingDeadlines || [],
      auditStatus: {
        total: auditStatus?.length || 0,
        completed: auditStatus?.filter(a => a.status === 'completed').length || 0,
        inProgress: auditStatus?.filter(a => a.status === 'in_progress').length || 0,
        pending: auditStatus?.filter(a => a.status === 'pending').length || 0
      }
    };

    // Log dashboard access
    await SecurityMonitoring.logSecurityEvent(
      SecurityEventType.DATA_ACCESS,
      'executive_dashboard',
      { action: 'view' },
      user.id,
      req.ip,
      req.get('User-Agent')
    );

    res.json({ dashboard });
  } catch (error) {
    console.error('Get executive dashboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Get Compliance Dashboard
 * GET /api/reporting/dashboard/compliance
 */
router.get('/dashboard/compliance', async (req: express.Request, res: express.Response) => {
  try {
    const user = (req as any).user;
    const { framework_id } = req.query;

    // Get compliance frameworks with detailed metrics
    let frameworkQuery = getSupabase()
      .from('compliance_frameworks')
      .select(
        `
        *,
        compliance_controls(
          id,
          status,
          priority,
          next_review_date
        )
      `
      )
      .eq('organization_id', user.organizationId)
      .eq('is_active', true);

    if (framework_id) {
      frameworkQuery = frameworkQuery.eq('id', framework_id);
    }

    const { data: frameworks } = await frameworkQuery;

    // Get recent assessments
    const { data: recentAssessments } = await getSupabase()
      .from('compliance_assessments')
      .select(
        `
        *,
        compliance_frameworks(name, framework_type),
        user_profiles!assessor_id(first_name, last_name)
      `
      )
      .eq('organization_id', user.organizationId)
      .order('created_at', { ascending: false })
      .limit(10);

    // Get evidence collection status
    const { data: evidenceStatus } = await getSupabase()
      .from('compliance_evidence')
      .select(
        `
        evidence_type,
        status,
        compliance_controls!inner(
          compliance_frameworks!inner(
            organization_id
          )
        )
      `
      )
      .eq('compliance_controls.compliance_frameworks.organization_id', user.organizationId);

    // Get control effectiveness trends
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: controlTrends } = await getSupabase()
      .from('compliance_assessment_results')
      .select(
        `
        assessment_date,
        result,
        compliance_controls!inner(
          compliance_frameworks!inner(
            organization_id
          )
        )
      `
      )
      .eq('compliance_controls.compliance_frameworks.organization_id', user.organizationId)
      .gte('assessment_date', thirtyDaysAgo.toISOString())
      .order('assessment_date', { ascending: true });

    const dashboard = {
      frameworks:
        frameworks?.map(framework => ({
          ...framework,
          metrics: {
            totalControls: framework.compliance_controls?.length || 0,
            implementedControls:
              framework.compliance_controls?.filter((c: any) => c.status === 'implemented')
                .length || 0,
            overdueControls:
              framework.compliance_controls?.filter(
                (c: any) => c.next_review_date && new Date(c.next_review_date) < new Date()
              ).length || 0,
            highPriorityControls:
              framework.compliance_controls?.filter((c: any) => c.priority === 'high').length || 0
          }
        })) || [],
      recentAssessments: recentAssessments || [],
      evidenceStatus: {
        total: evidenceStatus?.length || 0,
        byType:
          evidenceStatus?.reduce((acc: any, evidence) => {
            acc[evidence.evidence_type] = (acc[evidence.evidence_type] || 0) + 1;
            return acc;
          }, {}) || {},
        byStatus:
          evidenceStatus?.reduce((acc: any, evidence) => {
            acc[evidence.status] = (acc[evidence.status] || 0) + 1;
            return acc;
          }, {}) || {}
      },
      controlTrends: controlTrends || []
    };

    // Log compliance dashboard access
    await SecurityMonitoring.logSecurityEvent(
      SecurityEventType.DATA_ACCESS,
      'compliance_dashboard',
      { action: 'view', frameworkId: framework_id },
      user.id,
      req.ip,
      req.get('User-Agent')
    );

    res.json({ dashboard });
  } catch (error) {
    console.error('Get compliance dashboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Get Security Dashboard
 * GET /api/reporting/dashboard/security
 */
router.get('/dashboard/security', async (req: express.Request, res: express.Response) => {
  try {
    const user = (req as any).user;
    const { period = '24h' } = req.query;

    // Calculate time range
    const endTime = new Date();
    const startTime = new Date();

    switch (period) {
      case '1h':
        startTime.setHours(endTime.getHours() - 1);
        break;
      case '24h':
        startTime.setDate(endTime.getDate() - 1);
        break;
      case '7d':
        startTime.setDate(endTime.getDate() - 7);
        break;
      case '30d':
        startTime.setDate(endTime.getDate() - 30);
        break;
      default:
        startTime.setDate(endTime.getDate() - 1);
    }

    // Get security events
    const { data: securityEvents } = await getSupabase()
      .from('security_events')
      .select('event_type, severity, created_at, source_ip')
      .gte('created_at', startTime.toISOString())
      .lte('created_at', endTime.toISOString())
      .order('created_at', { ascending: false });

    // Get active incidents
    const { data: activeIncidents } = await getSupabase()
      .from('security_incidents')
      .select(
        `
        id,
        title,
        severity,
        status,
        created_at,
        assigned_to,
        user_profiles!assigned_to(first_name, last_name)
      `
      )
      .in('status', ['open', 'investigating', 'containment'])
      .order('severity', { ascending: false });

    // Get threat indicators
    const { data: threatIndicators } = await getSupabase()
      .from('threat_indicators')
      .select('indicator_type, risk_level, last_seen')
      .eq('is_active', true)
      .order('risk_level', { ascending: false })
      .limit(20);

    // Get blocked IPs
    const { data: blockedIPs } = await getSupabase()
      .from('ip_blocklist')
      .select('ip_address, reason, blocked_at, expires_at')
      .eq('is_active', true)
      .order('blocked_at', { ascending: false })
      .limit(10);

    // Get security metrics
    const { data: securityMetrics } = await getSupabase().rpc('get_security_metrics_summary', {
      org_id: user.organizationId,
      hours: period === '1h' ? 1 : period === '24h' ? 24 : period === '7d' ? 168 : 720
    });

    // Process event statistics
    const eventStats = {
      total: securityEvents?.length || 0,
      byType:
        securityEvents?.reduce((acc: any, event) => {
          acc[event.event_type] = (acc[event.event_type] || 0) + 1;
          return acc;
        }, {}) || {},
      bySeverity:
        securityEvents?.reduce((acc: any, event) => {
          acc[event.severity] = (acc[event.severity] || 0) + 1;
          return acc;
        }, {}) || {},
      timeline: generateEventTimeline(securityEvents || [], period)
    };

    const dashboard = {
      period,
      metrics: securityMetrics?.[0] || {
        total_events: 0,
        security_incidents: 0,
        blocked_attempts: 0,
        threat_level: 'low'
      },
      events: eventStats,
      activeIncidents: activeIncidents || [],
      threatIndicators: threatIndicators || [],
      blockedIPs: blockedIPs || []
    };

    // Log security dashboard access
    await SecurityMonitoring.logSecurityEvent(
      SecurityEventType.DATA_ACCESS,
      'security_dashboard',
      { action: 'view', period },
      user.id,
      req.ip,
      req.get('User-Agent')
    );

    res.json({ dashboard });
  } catch (error) {
    console.error('Get security dashboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Generate Compliance Report
 * POST /api/reporting/compliance/generate
 */
router.post(
  '/compliance/generate',
  SecurityMiddleware.createSecurityMiddleware({
    authentication: {
      required: true,
      permissions: ['reporting:create']
    }
  }),
  async (req: express.Request, res: express.Response) => {
    try {
      const user = (req as any).user;

      // Validate input
      const validation = validateInput(req.body, {
        report_type: {
          required: true,
          type: 'string',
          enum: [
            'compliance_status',
            'gap_analysis',
            'control_effectiveness',
            'audit_readiness',
            'executive_summary'
          ]
        },
        framework_ids: { required: false, type: 'array' },
        period_start: { required: true, type: 'string' },
        period_end: { required: true, type: 'string' },
        include_charts: { required: false, type: 'boolean' },
        include_recommendations: { required: false, type: 'boolean' },
        format: { required: false, type: 'string', enum: ['pdf', 'excel', 'json'] }
      });

      if (!validation.isValid) {
        return res.status(400).json({ error: 'Invalid input', details: validation.errors });
      }

      const {
        report_type,
        framework_ids,
        period_start,
        period_end,
        include_charts,
        include_recommendations,
        format = 'json'
      } = req.body;

      // Generate report data
      const reportData = await generateComplianceReport(
        user.organizationId,
        report_type,
        framework_ids,
        period_start,
        period_end,
        { include_charts, include_recommendations }
      );

      // Create report record
      const { data: report, error } = await getSupabase()
        .from('compliance_reports')
        .insert({
          title: getReportTitle(report_type),
          report_type,
          framework_ids,
          period_start,
          period_end,
          report_data: reportData,
          format,
          organization_id: user.organizationId,
          generated_by: user.id,
          status: 'completed'
        })
        .select(
          `
          *,
          user_profiles!generated_by(first_name, last_name)
        `
        )
        .single();

      if (error) {
        console.error('Error creating compliance report:', error);
        return res.status(500).json({ error: 'Failed to generate compliance report' });
      }

      // Log report generation
      await SecurityMonitoring.logSecurityEvent(
        SecurityEventType.DATA_MODIFICATION,
        'compliance_report',
        {
          action: 'generate',
          reportId: report.id,
          reportType: report_type,
          frameworkIds: framework_ids
        },
        user.id,
        req.ip,
        req.get('User-Agent')
      );

      res.status(201).json({ report });
    } catch (error) {
      console.error('Generate compliance report error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * Generate Security Report
 * POST /api/reporting/security/generate
 */
router.post(
  '/security/generate',
  SecurityMiddleware.createSecurityMiddleware({
    authentication: {
      required: true,
      permissions: ['reporting:create']
    }
  }),
  async (req: express.Request, res: express.Response) => {
    try {
      const user = (req as any).user;

      // Validate input
      const validation = validateInput(req.body, {
        report_type: {
          required: true,
          type: 'string',
          enum: [
            'security_events',
            'incident_summary',
            'threat_analysis',
            'vulnerability_assessment',
            'security_metrics'
          ]
        },
        period_start: { required: true, type: 'string' },
        period_end: { required: true, type: 'string' },
        include_charts: { required: false, type: 'boolean' },
        include_recommendations: { required: false, type: 'boolean' },
        format: { required: false, type: 'string', enum: ['pdf', 'excel', 'json'] }
      });

      if (!validation.isValid) {
        return res.status(400).json({ error: 'Invalid input', details: validation.errors });
      }

      const {
        report_type,
        period_start,
        period_end,
        include_charts,
        include_recommendations,
        format = 'json'
      } = req.body;

      // Generate report data
      const reportData = await generateSecurityReport(
        user.organizationId,
        report_type,
        period_start,
        period_end,
        { include_charts, include_recommendations }
      );

      // Create report record
      const { data: report, error } = await getSupabase()
        .from('security_reports')
        .insert({
          title: getSecurityReportTitle(report_type),
          report_type,
          period_start,
          period_end,
          report_data: reportData,
          format,
          organization_id: user.organizationId,
          generated_by: user.id,
          status: 'completed'
        })
        .select(
          `
          *,
          user_profiles!generated_by(first_name, last_name)
        `
        )
        .single();

      if (error) {
        console.error('Error creating security report:', error);
        return res.status(500).json({ error: 'Failed to generate security report' });
      }

      // Log report generation
      await SecurityMonitoring.logSecurityEvent(
        SecurityEventType.DATA_MODIFICATION,
        'security_report',
        {
          action: 'generate',
          reportId: report.id,
          reportType: report_type
        },
        user.id,
        req.ip,
        req.get('User-Agent')
      );

      res.status(201).json({ report });
    } catch (error) {
      console.error('Generate security report error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * Get Reports List
 * GET /api/reporting/reports
 */
router.get('/reports', async (req: express.Request, res: express.Response) => {
  try {
    const user = (req as any).user;
    const { report_type, category, start_date, end_date, page = 1, limit = 20 } = req.query;

    // Get compliance reports
    let complianceQuery = getSupabase()
      .from('compliance_reports')
      .select(
        `
        *,
        user_profiles!generated_by(first_name, last_name)
      `
      )
      .eq('organization_id', user.organizationId);

    // Get security reports
    let securityQuery = getSupabase()
      .from('security_reports')
      .select(
        `
        *,
        user_profiles!generated_by(first_name, last_name)
      `
      )
      .eq('organization_id', user.organizationId);

    // Apply filters
    if (report_type) {
      complianceQuery = complianceQuery.eq('report_type', report_type);
      securityQuery = securityQuery.eq('report_type', report_type);
    }
    if (start_date) {
      complianceQuery = complianceQuery.gte('generated_at', start_date as string);
      securityQuery = securityQuery.gte('generated_at', start_date as string);
    }
    if (end_date) {
      complianceQuery = complianceQuery.lte('generated_at', end_date as string);
      securityQuery = securityQuery.lte('generated_at', end_date as string);
    }

    const [complianceResult, securityResult] = await Promise.all([
      complianceQuery.order('generated_at', { ascending: false }),
      securityQuery.order('generated_at', { ascending: false })
    ]);

    // Combine and categorize reports
    const allReports = [
      ...(complianceResult.data || []).map(r => ({ ...r, category: 'compliance' })),
      ...(securityResult.data || []).map(r => ({ ...r, category: 'security' }))
    ].sort((a, b) => new Date(b.generated_at).getTime() - new Date(a.generated_at).getTime());

    // Apply category filter
    const filteredReports = category ? allReports.filter(r => r.category === category) : allReports;

    // Apply pagination
    const offset = (Number(page) - 1) * Number(limit);
    const paginatedReports = filteredReports.slice(offset, offset + Number(limit));

    // Log reports access
    await SecurityMonitoring.logSecurityEvent(
      SecurityEventType.DATA_ACCESS,
      'reports_list',
      {
        action: 'list',
        filters: { report_type, category },
        count: paginatedReports.length
      },
      user.id,
      req.ip,
      req.get('User-Agent')
    );

    res.json({
      reports: paginatedReports,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: filteredReports.length,
        totalPages: Math.ceil(filteredReports.length / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Get Analytics Data
 * GET /api/reporting/analytics
 */
router.get('/analytics', async (req: express.Request, res: express.Response) => {
  try {
    const user = (req as any).user;
    const { metric, period = '30d', granularity = 'daily' } = req.query;

    // Calculate time range
    const endDate = new Date();
    const startDate = new Date();

    switch (period) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(endDate.getDate() - 30);
    }

    let analyticsData: any = {};

    switch (metric) {
      case 'compliance_trends':
        analyticsData = await getComplianceTrends(
          user.organizationId,
          startDate,
          endDate,
          granularity as string
        );
        break;

      case 'security_events':
        analyticsData = await getSecurityEventsTrends(
          user.organizationId,
          startDate,
          endDate,
          granularity as string
        );
        break;

      case 'risk_trends':
        analyticsData = await getRiskTrends(
          user.organizationId,
          startDate,
          endDate,
          granularity as string
        );
        break;

      case 'audit_activity':
        analyticsData = await getAuditActivityTrends(
          user.organizationId,
          startDate,
          endDate,
          granularity as string
        );
        break;

      default:
        return res.status(400).json({ error: 'Invalid metric type' });
    }

    // Log analytics access
    await SecurityMonitoring.logSecurityEvent(
      SecurityEventType.DATA_ACCESS,
      'analytics',
      { action: 'view', metric, period, granularity },
      user.id,
      req.ip,
      req.get('User-Agent')
    );

    res.json({
      metric,
      period,
      granularity,
      data: analyticsData
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper functions

function generateEventTimeline(events: any[], period: string) {
  const timeline: any[] = [];
  const now = new Date();
  let intervals = 24; // Default for 24h
  let intervalMs = 60 * 60 * 1000; // 1 hour

  switch (period) {
    case '1h':
      intervals = 12;
      intervalMs = 5 * 60 * 1000; // 5 minutes
      break;
    case '7d':
      intervals = 7;
      intervalMs = 24 * 60 * 60 * 1000; // 1 day
      break;
    case '30d':
      intervals = 30;
      intervalMs = 24 * 60 * 60 * 1000; // 1 day
      break;
  }

  for (let i = intervals - 1; i >= 0; i--) {
    const intervalStart = new Date(now.getTime() - (i + 1) * intervalMs);
    const intervalEnd = new Date(now.getTime() - i * intervalMs);

    const intervalEvents = events.filter(event => {
      const eventTime = new Date(event.created_at);
      return eventTime >= intervalStart && eventTime < intervalEnd;
    });

    timeline.push({
      timestamp: intervalEnd.toISOString(),
      count: intervalEvents.length,
      events: intervalEvents
    });
  }

  return timeline;
}

function getReportTitle(reportType: string): string {
  const titles: { [key: string]: string } = {
    compliance_status: 'Compliance Status Report',
    gap_analysis: 'Compliance Gap Analysis Report',
    control_effectiveness: 'Control Effectiveness Report',
    audit_readiness: 'Audit Readiness Report',
    executive_summary: 'Executive Compliance Summary'
  };
  return titles[reportType] || 'Compliance Report';
}

function getSecurityReportTitle(reportType: string): string {
  const titles: { [key: string]: string } = {
    security_events: 'Security Events Report',
    incident_summary: 'Security Incident Summary',
    threat_analysis: 'Threat Analysis Report',
    vulnerability_assessment: 'Vulnerability Assessment Report',
    security_metrics: 'Security Metrics Report'
  };
  return titles[reportType] || 'Security Report';
}

async function generateComplianceReport(
  organizationId: string,
  reportType: string,
  frameworkIds: string[] | undefined,
  periodStart: string,
  periodEnd: string,
  options: { include_charts?: boolean; include_recommendations?: boolean }
) {
  // Implementation would depend on report type
  // This is a simplified version
  const baseData = {
    organizationId,
    reportType,
    period: { start: periodStart, end: periodEnd },
    generatedAt: new Date().toISOString()
  };

  // Add specific data based on report type
  switch (reportType) {
    case 'compliance_status':
      return { ...baseData /* compliance status data */ };
    case 'gap_analysis':
      return { ...baseData /* gap analysis data */ };
    default:
      return baseData;
  }
}

async function generateSecurityReport(
  organizationId: string,
  reportType: string,
  periodStart: string,
  periodEnd: string,
  options: { include_charts?: boolean; include_recommendations?: boolean }
) {
  // Implementation would depend on report type
  // This is a simplified version
  const baseData = {
    organizationId,
    reportType,
    period: { start: periodStart, end: periodEnd },
    generatedAt: new Date().toISOString()
  };

  // Add specific data based on report type
  switch (reportType) {
    case 'security_events':
      return { ...baseData /* security events data */ };
    case 'incident_summary':
      return { ...baseData /* incident summary data */ };
    default:
      return baseData;
  }
}

async function getComplianceTrends(
  organizationId: string,
  startDate: Date,
  endDate: Date,
  granularity: string
) {
  // Implementation for compliance trends analytics
  return { trends: [], summary: {} };
}

async function getSecurityEventsTrends(
  organizationId: string,
  startDate: Date,
  endDate: Date,
  granularity: string
) {
  // Implementation for security events trends analytics
  return { trends: [], summary: {} };
}

async function getRiskTrends(
  organizationId: string,
  startDate: Date,
  endDate: Date,
  granularity: string
) {
  // Implementation for risk trends analytics
  return { trends: [], summary: {} };
}

async function getAuditActivityTrends(
  organizationId: string,
  startDate: Date,
  endDate: Date,
  granularity: string
) {
  // Implementation for audit activity trends analytics
  return { trends: [], summary: {} };
}

export default router;
