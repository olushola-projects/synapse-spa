/**
 * Risk Management API Routes
 * Handles risk assessments, risk monitoring, and risk reporting
 * Part of Phase 3: Compliance Framework Implementation
 */

import express from 'express';
import { SecurityMonitoring, SecurityEventType } from '../../lib/monitoring';
import { SecurityMiddleware } from '../../middleware/security';
import { validateInput } from '../../lib/validation';
import { getSupabase } from '../../integrations/supabase/client';

const router = express.Router();

/**
 * Get Risk Register
 * GET /api/risk/register
 */
router.get('/register', async (req: express.Request, res: express.Response) => {
  try {
    const user = (req as any).user;
    const { category, severity, status, owner_id, page = 1, limit = 50 } = req.query;

    let query = getSupabase()
      .from('risk_register')
      .select(
        `
        *,
        user_profiles!owner_id(first_name, last_name, email),
        risk_assessments(
          id,
          assessment_date,
          likelihood,
          impact,
          risk_score,
          status
        )
      `
      )
      .eq('organization_id', user.organizationId);

    // Apply filters
    if (category) {
      query = query.eq('category', category);
    }
    if (severity) {
      query = query.eq('severity', severity);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (owner_id) {
      query = query.eq('owner_id', owner_id);
    }

    // Pagination
    const offset = (Number(page) - 1) * Number(limit);
    query = query.range(offset, offset + Number(limit) - 1);

    const { data: risks, error, count } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching risk register:', error);
      return res.status(500).json({ error: 'Failed to fetch risk register' });
    }

    // Log risk register access
    await SecurityMonitoring.logSecurityEvent(
      SecurityEventType.DATA_ACCESS,
      'risk_register',
      {
        action: 'list',
        filters: { category, severity, status },
        count: risks?.length || 0
      },
      user.id,
      req.ip,
      req.get('User-Agent')
    );

    res.json({
      risks,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count || 0,
        totalPages: Math.ceil((count || 0) / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get risk register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Create Risk
 * POST /api/risk/register
 */
router.post(
  '/register',
  SecurityMiddleware.createSecurityMiddleware({
    authentication: {
      required: true,
      permissions: ['risk:create']
    }
  }),
  async (req: express.Request, res: express.Response) => {
    try {
      const user = (req as any).user;

      // Validate input
      const validation = validateInput(req.body, {
        title: { required: true, type: 'string', maxLength: 200 },
        description: { required: true, type: 'string' },
        category: {
          required: true,
          type: 'string',
          enum: [
            'operational',
            'financial',
            'strategic',
            'compliance',
            'technology',
            'reputation',
            'legal'
          ]
        },
        severity: {
          required: true,
          type: 'string',
          enum: ['low', 'medium', 'high', 'critical']
        },
        likelihood: {
          required: true,
          type: 'number',
          min: 1,
          max: 5
        },
        impact: {
          required: true,
          type: 'number',
          min: 1,
          max: 5
        },
        owner_id: { required: true, type: 'string' },
        due_date: { required: false, type: 'string' },
        mitigation_strategy: { required: false, type: 'string' }
      });

      if (!validation.isValid) {
        return res.status(400).json({ error: 'Invalid input', details: validation.errors });
      }

      const {
        title,
        description,
        category,
        severity,
        likelihood,
        impact,
        owner_id,
        due_date,
        mitigation_strategy
      } = req.body;

      // Calculate risk score
      const riskScore = likelihood * impact;

      // Verify owner exists in organization
      const { data: owner } = await getSupabase()
        .from('user_profiles')
        .select('id')
        .eq('id', owner_id)
        .eq('organization_id', user.organizationId)
        .single();

      if (!owner) {
        return res.status(400).json({ error: 'Invalid risk owner' });
      }

      // Create risk
      const { data: risk, error } = await getSupabase()
        .from('risk_register')
        .insert({
          title,
          description,
          category,
          severity,
          likelihood,
          impact,
          risk_score: riskScore,
          owner_id,
          due_date,
          mitigation_strategy,
          status: 'identified',
          organization_id: user.organizationId,
          created_by: user.id
        })
        .select(
          `
          *,
          user_profiles!owner_id(first_name, last_name, email)
        `
        )
        .single();

      if (error) {
        console.error('Error creating risk:', error);
        return res.status(500).json({ error: 'Failed to create risk' });
      }

      // Log risk creation
      await SecurityMonitoring.logSecurityEvent(
        SecurityEventType.DATA_MODIFICATION,
        'risk_register',
        {
          action: 'create',
          riskId: risk.id,
          category,
          severity,
          riskScore
        },
        user.id,
        req.ip,
        req.get('User-Agent')
      );

      res.status(201).json({ risk });
    } catch (error) {
      console.error('Create risk error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * Update Risk
 * PUT /api/risk/register/:id
 */
router.put(
  '/register/:id',
  SecurityMiddleware.createSecurityMiddleware({
    authentication: {
      required: true,
      permissions: ['risk:update']
    }
  }),
  async (req: express.Request, res: express.Response) => {
    try {
      const user = (req as any).user;
      const { id } = req.params;

      // Validate input
      const validation = validateInput(req.body, {
        title: { required: false, type: 'string', maxLength: 200 },
        description: { required: false, type: 'string' },
        category: {
          required: false,
          type: 'string',
          enum: [
            'operational',
            'financial',
            'strategic',
            'compliance',
            'technology',
            'reputation',
            'legal'
          ]
        },
        severity: {
          required: false,
          type: 'string',
          enum: ['low', 'medium', 'high', 'critical']
        },
        likelihood: {
          required: false,
          type: 'number',
          min: 1,
          max: 5
        },
        impact: {
          required: false,
          type: 'number',
          min: 1,
          max: 5
        },
        status: {
          required: false,
          type: 'string',
          enum: ['identified', 'assessed', 'mitigated', 'monitored', 'closed']
        },
        owner_id: { required: false, type: 'string' },
        due_date: { required: false, type: 'string' },
        mitigation_strategy: { required: false, type: 'string' }
      });

      if (!validation.isValid) {
        return res.status(400).json({ error: 'Invalid input', details: validation.errors });
      }

      // Verify risk exists and user has access
      const { data: existingRisk } = await getSupabase()
        .from('risk_register')
        .select('*')
        .eq('id', id)
        .eq('organization_id', user.organizationId)
        .single();

      if (!existingRisk) {
        return res.status(404).json({ error: 'Risk not found' });
      }

      const updateData = { ...req.body };

      // Recalculate risk score if likelihood or impact changed
      if (updateData.likelihood || updateData.impact) {
        const likelihood = updateData.likelihood || existingRisk.likelihood;
        const impact = updateData.impact || existingRisk.impact;
        updateData.risk_score = likelihood * impact;
      }

      // Verify new owner if provided
      if (updateData.owner_id) {
        const { data: owner } = await getSupabase()
          .from('user_profiles')
          .select('id')
          .eq('id', updateData.owner_id)
          .eq('organization_id', user.organizationId)
          .single();

        if (!owner) {
          return res.status(400).json({ error: 'Invalid risk owner' });
        }
      }

      // Update risk
      const { data: risk, error } = await getSupabase()
        .from('risk_register')
        .update(updateData)
        .eq('id', id)
        .eq('organization_id', user.organizationId)
        .select(
          `
          *,
          user_profiles!owner_id(first_name, last_name, email)
        `
        )
        .single();

      if (error) {
        console.error('Error updating risk:', error);
        return res.status(500).json({ error: 'Failed to update risk' });
      }

      // Log risk update
      await SecurityMonitoring.logSecurityEvent(
        SecurityEventType.DATA_MODIFICATION,
        'risk_register',
        {
          action: 'update',
          riskId: id,
          changes: Object.keys(updateData)
        },
        user.id,
        req.ip,
        req.get('User-Agent')
      );

      res.json({ risk });
    } catch (error) {
      console.error('Update risk error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * Get Risk Assessments
 * GET /api/risk/assessments
 */
router.get('/assessments', async (req: express.Request, res: express.Response) => {
  try {
    const user = (req as any).user;
    const { risk_id, assessor_id, status } = req.query;

    let query = getSupabase()
      .from('risk_assessments')
      .select(
        `
        *,
        risk_register!inner(
          id,
          title,
          category,
          organization_id
        ),
        user_profiles!assessor_id(first_name, last_name, email)
      `
      )
      .eq('risk_register.organization_id', user.organizationId);

    // Apply filters
    if (risk_id) {
      query = query.eq('risk_id', risk_id);
    }
    if (assessor_id) {
      query = query.eq('assessor_id', assessor_id);
    }
    if (status) {
      query = query.eq('status', status);
    }

    const { data: assessments, error } = await query.order('assessment_date', { ascending: false });

    if (error) {
      console.error('Error fetching risk assessments:', error);
      return res.status(500).json({ error: 'Failed to fetch risk assessments' });
    }

    // Log assessments access
    await SecurityMonitoring.logSecurityEvent(
      SecurityEventType.DATA_ACCESS,
      'risk_assessments',
      {
        action: 'list',
        filters: { risk_id, assessor_id, status },
        count: assessments?.length || 0
      },
      user.id,
      req.ip,
      req.get('User-Agent')
    );

    res.json({ assessments });
  } catch (error) {
    console.error('Get risk assessments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Create Risk Assessment
 * POST /api/risk/assessments
 */
router.post(
  '/assessments',
  SecurityMiddleware.createSecurityMiddleware({
    authentication: {
      required: true,
      permissions: ['risk:assess']
    }
  }),
  async (req: express.Request, res: express.Response) => {
    try {
      const user = (req as any).user;

      // Validate input
      const validation = validateInput(req.body, {
        risk_id: { required: true, type: 'string' },
        assessment_type: {
          required: true,
          type: 'string',
          enum: ['initial', 'periodic', 'incident_driven', 'change_driven']
        },
        likelihood: { required: true, type: 'number', min: 1, max: 5 },
        impact: { required: true, type: 'number', min: 1, max: 5 },
        assessment_notes: { required: false, type: 'string' },
        recommendations: { required: false, type: 'string' },
        next_review_date: { required: false, type: 'string' }
      });

      if (!validation.isValid) {
        return res.status(400).json({ error: 'Invalid input', details: validation.errors });
      }

      const {
        risk_id,
        assessment_type,
        likelihood,
        impact,
        assessment_notes,
        recommendations,
        next_review_date
      } = req.body;

      // Verify risk exists and user has access
      const { data: risk } = await getSupabase()
        .from('risk_register')
        .select('id, title')
        .eq('id', risk_id)
        .eq('organization_id', user.organizationId)
        .single();

      if (!risk) {
        return res.status(404).json({ error: 'Risk not found' });
      }

      // Calculate risk score
      const riskScore = likelihood * impact;

      // Create assessment
      const { data: assessment, error } = await getSupabase()
        .from('risk_assessments')
        .insert({
          risk_id,
          assessment_type,
          likelihood,
          impact,
          risk_score: riskScore,
          assessment_notes,
          recommendations,
          next_review_date,
          assessor_id: user.id,
          assessment_date: new Date().toISOString(),
          status: 'completed'
        })
        .select(
          `
          *,
          risk_register(id, title, category),
          user_profiles!assessor_id(first_name, last_name, email)
        `
        )
        .single();

      if (error) {
        console.error('Error creating risk assessment:', error);
        return res.status(500).json({ error: 'Failed to create risk assessment' });
      }

      // Update risk register with latest assessment
      await supabase
        .from('risk_register')
        .update({
          likelihood,
          impact,
          risk_score: riskScore,
          last_assessment_date: new Date().toISOString()
        })
        .eq('id', risk_id);

      // Log assessment creation
      await SecurityMonitoring.logSecurityEvent(
        SecurityEventType.DATA_MODIFICATION,
        'risk_assessment',
        {
          action: 'create',
          assessmentId: assessment.id,
          riskId: risk_id,
          assessmentType: assessment_type,
          riskScore
        },
        user.id,
        req.ip,
        req.get('User-Agent')
      );

      res.status(201).json({ assessment });
    } catch (error) {
      console.error('Create risk assessment error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * Get Risk Dashboard
 * GET /api/risk/dashboard
 */
router.get('/dashboard', async (req: express.Request, res: express.Response) => {
  try {
    const user = (req as any).user;

    // Get risk summary statistics
    const { data: riskSummary } = await getSupabase().rpc('get_risk_summary', {
      org_id: user.organizationId
    });

    // Get top risks
    const { data: topRisks } = await getSupabase()
      .from('risk_register')
      .select(
        `
        id,
        title,
        category,
        severity,
        risk_score,
        status,
        user_profiles!owner_id(first_name, last_name)
      `
      )
      .eq('organization_id', user.organizationId)
      .eq('status', 'identified')
      .order('risk_score', { ascending: false })
      .limit(10);

    // Get overdue risks
    const { data: overdueRisks } = await getSupabase()
      .from('risk_register')
      .select(
        `
        id,
        title,
        due_date,
        severity,
        user_profiles!owner_id(first_name, last_name)
      `
      )
      .eq('organization_id', user.organizationId)
      .lt('due_date', new Date().toISOString())
      .neq('status', 'closed');

    // Get recent assessments
    const { data: recentAssessments } = await getSupabase()
      .from('risk_assessments')
      .select(
        `
        id,
        assessment_date,
        assessment_type,
        risk_score,
        risk_register!inner(
          title,
          organization_id
        ),
        user_profiles!assessor_id(first_name, last_name)
      `
      )
      .eq('risk_register.organization_id', user.organizationId)
      .order('assessment_date', { ascending: false })
      .limit(5);

    // Get risk trends (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const { data: riskTrends } = await getSupabase()
      .from('risk_assessments')
      .select(
        `
        assessment_date,
        risk_score,
        risk_register!inner(
          organization_id
        )
      `
      )
      .eq('risk_register.organization_id', user.organizationId)
      .gte('assessment_date', sixMonthsAgo.toISOString())
      .order('assessment_date', { ascending: true });

    const dashboard = {
      summary: riskSummary?.[0] || {
        total_risks: 0,
        high_risks: 0,
        medium_risks: 0,
        low_risks: 0,
        overdue_risks: 0,
        avg_risk_score: 0
      },
      topRisks: topRisks || [],
      overdueRisks: overdueRisks || [],
      recentAssessments: recentAssessments || [],
      trends: riskTrends || []
    };

    // Log dashboard access
    await SecurityMonitoring.logSecurityEvent(
      SecurityEventType.DATA_ACCESS,
      'risk_dashboard',
      { action: 'view' },
      user.id,
      req.ip,
      req.get('User-Agent')
    );

    res.json({ dashboard });
  } catch (error) {
    console.error('Get risk dashboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Get Risk Reports
 * GET /api/risk/reports
 */
router.get('/reports', async (req: express.Request, res: express.Response) => {
  try {
    const user = (req as any).user;
    const { report_type, start_date, end_date } = req.query;

    let query = supabase
      .from('risk_reports')
      .select(
        `
        *,
        user_profiles!generated_by(first_name, last_name)
      `
      )
      .eq('organization_id', user.organizationId);

    // Apply filters
    if (report_type) {
      query = query.eq('report_type', report_type);
    }
    if (start_date) {
      query = query.gte('period_start', start_date as string);
    }
    if (end_date) {
      query = query.lte('period_end', end_date as string);
    }

    const { data: reports, error } = await query.order('generated_at', { ascending: false });

    if (error) {
      console.error('Error fetching risk reports:', error);
      return res.status(500).json({ error: 'Failed to fetch risk reports' });
    }

    // Log reports access
    await SecurityMonitoring.logSecurityEvent(
      SecurityEventType.DATA_ACCESS,
      'risk_reports',
      {
        action: 'list',
        filters: { report_type },
        count: reports?.length || 0
      },
      user.id,
      req.ip,
      req.get('User-Agent')
    );

    res.json({ reports });
  } catch (error) {
    console.error('Get risk reports error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Generate Risk Report
 * POST /api/risk/reports/generate
 */
router.post(
  '/reports/generate',
  SecurityMiddleware.createSecurityMiddleware({
    authentication: {
      required: true,
      permissions: ['risk:report']
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
            'risk_register',
            'risk_assessment',
            'risk_trends',
            'risk_heatmap',
            'mitigation_status'
          ]
        },
        period_start: { required: true, type: 'string' },
        period_end: { required: true, type: 'string' },
        include_charts: { required: false, type: 'boolean' },
        include_recommendations: { required: false, type: 'boolean' }
      });

      if (!validation.isValid) {
        return res.status(400).json({ error: 'Invalid input', details: validation.errors });
      }

      const { report_type, period_start, period_end, include_charts, include_recommendations } =
        req.body;

      // Generate report data based on type
      let reportData: any = {};
      let title = '';

      switch (report_type) {
        case 'risk_register':
          title = 'Risk Register Report';
          reportData = await generateRiskRegisterReport(
            user.organizationId,
            period_start,
            period_end
          );
          break;

        case 'risk_assessment':
          title = 'Risk Assessment Report';
          reportData = await generateRiskAssessmentReport(
            user.organizationId,
            period_start,
            period_end
          );
          break;

        case 'risk_trends':
          title = 'Risk Trends Report';
          reportData = await generateRiskTrendsReport(
            user.organizationId,
            period_start,
            period_end
          );
          break;

        case 'risk_heatmap':
          title = 'Risk Heatmap Report';
          reportData = await generateRiskHeatmapReport(user.organizationId);
          break;

        case 'mitigation_status':
          title = 'Risk Mitigation Status Report';
          reportData = await generateMitigationStatusReport(user.organizationId);
          break;

        default:
          return res.status(400).json({ error: 'Invalid report type' });
      }

      // Create report record
      const { data: report, error } = await supabase
        .from('risk_reports')
        .insert({
          title,
          report_type,
          period_start,
          period_end,
          report_data: reportData,
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
        console.error('Error creating risk report:', error);
        return res.status(500).json({ error: 'Failed to generate risk report' });
      }

      // Log report generation
      await SecurityMonitoring.logSecurityEvent(
        SecurityEventType.DATA_MODIFICATION,
        'risk_report',
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
      console.error('Generate risk report error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Helper functions for report generation

async function generateRiskRegisterReport(
  organizationId: string,
  periodStart: string,
  periodEnd: string
) {
  const { data: risks } = await supabase
    .from('risk_register')
    .select(
      `
      *,
      user_profiles!owner_id(first_name, last_name)
    `
    )
    .eq('organization_id', organizationId)
    .gte('created_at', periodStart)
    .lte('created_at', periodEnd)
    .order('risk_score', { ascending: false });

  return {
    risks: risks || [],
    summary: {
      totalRisks: risks?.length || 0,
      byCategory:
        risks?.reduce((acc: any, risk) => {
          acc[risk.category] = (acc[risk.category] || 0) + 1;
          return acc;
        }, {}) || {},
      bySeverity:
        risks?.reduce((acc: any, risk) => {
          acc[risk.severity] = (acc[risk.severity] || 0) + 1;
          return acc;
        }, {}) || {}
    }
  };
}

async function generateRiskAssessmentReport(
  organizationId: string,
  periodStart: string,
  periodEnd: string
) {
  const { data: assessments } = await supabase
    .from('risk_assessments')
    .select(
      `
      *,
      risk_register!inner(
        title,
        category,
        organization_id
      ),
      user_profiles!assessor_id(first_name, last_name)
    `
    )
    .eq('risk_register.organization_id', organizationId)
    .gte('assessment_date', periodStart)
    .lte('assessment_date', periodEnd)
    .order('assessment_date', { ascending: false });

  return {
    assessments: assessments || [],
    summary: {
      totalAssessments: assessments?.length || 0,
      averageRiskScore:
        assessments?.reduce((sum, a) => sum + a.risk_score, 0) / (assessments?.length || 1) || 0,
      byType:
        assessments?.reduce((acc: any, assessment) => {
          acc[assessment.assessment_type] = (acc[assessment.assessment_type] || 0) + 1;
          return acc;
        }, {}) || {}
    }
  };
}

async function generateRiskTrendsReport(
  organizationId: string,
  periodStart: string,
  periodEnd: string
) {
  const { data: trends } = await supabase
    .from('risk_assessments')
    .select(
      `
      assessment_date,
      risk_score,
      likelihood,
      impact,
      risk_register!inner(
        category,
        organization_id
      )
    `
    )
    .eq('risk_register.organization_id', organizationId)
    .gte('assessment_date', periodStart)
    .lte('assessment_date', periodEnd)
    .order('assessment_date', { ascending: true });

  return {
    trends: trends || [],
    summary: {
      totalDataPoints: trends?.length || 0,
      averageRiskScore:
        trends?.reduce((sum, t) => sum + t.risk_score, 0) / (trends?.length || 1) || 0,
      trendDirection: calculateTrendDirection(trends || [])
    }
  };
}

async function generateRiskHeatmapReport(organizationId: string) {
  const { data: risks } = await supabase
    .from('risk_register')
    .select('likelihood, impact, category, severity')
    .eq('organization_id', organizationId)
    .neq('status', 'closed');

  // Create heatmap data
  const heatmap = Array(5)
    .fill(null)
    .map(() => Array(5).fill(0));

  risks?.forEach(risk => {
    if (risk.likelihood && risk.impact) {
      heatmap[risk.likelihood - 1][risk.impact - 1]++;
    }
  });

  return {
    heatmap,
    risks: risks || [],
    summary: {
      totalRisks: risks?.length || 0,
      highRiskCount: risks?.filter(r => r.likelihood * r.impact >= 15).length || 0,
      mediumRiskCount:
        risks?.filter(r => {
          const score = r.likelihood * r.impact;
          return score >= 8 && score < 15;
        }).length || 0,
      lowRiskCount: risks?.filter(r => r.likelihood * r.impact < 8).length || 0
    }
  };
}

async function generateMitigationStatusReport(organizationId: string) {
  const { data: risks } = await supabase
    .from('risk_register')
    .select(
      `
      *,
      user_profiles!owner_id(first_name, last_name)
    `
    )
    .eq('organization_id', organizationId)
    .order('status', { ascending: true });

  return {
    risks: risks || [],
    summary: {
      totalRisks: risks?.length || 0,
      byStatus:
        risks?.reduce((acc: any, risk) => {
          acc[risk.status] = (acc[risk.status] || 0) + 1;
          return acc;
        }, {}) || {},
      mitigatedPercentage:
        ((risks?.filter(r => r.status === 'mitigated').length || 0) / (risks?.length || 1)) * 100
    }
  };
}

function calculateTrendDirection(trends: any[]): 'increasing' | 'decreasing' | 'stable' {
  if (trends.length < 2) {
    return 'stable';
  }

  const firstHalf = trends.slice(0, Math.floor(trends.length / 2));
  const secondHalf = trends.slice(Math.floor(trends.length / 2));

  const firstAvg = firstHalf.reduce((sum, t) => sum + t.risk_score, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, t) => sum + t.risk_score, 0) / secondHalf.length;

  const difference = secondAvg - firstAvg;

  if (difference > 0.5) {
    return 'increasing';
  }
  if (difference < -0.5) {
    return 'decreasing';
  }
  return 'stable';
}

export default router;
