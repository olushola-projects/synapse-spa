/**
 * Audit Management API Routes
 * Handles audit trails, evidence collection, and audit reporting
 * Part of Phase 3: Compliance Framework Implementation
 */

import express from 'express';
import { SecurityMonitoring, SecurityEventType } from '../../lib/monitoring';
import { SecurityMiddleware } from '../../middleware/security';
import { validateInput } from '../../lib/validation';
import { getSupabase } from '../../integrations/supabase/client';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow common document and image formats
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/png',
      'image/gif',
      'text/plain',
      'text/csv'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

/**
 * Get Audit Trail
 * GET /api/audit/trail
 */
router.get('/trail', async (req: express.Request, res: express.Response) => {
  try {
    const user = (req as any).user;
    const {
      start_date,
      end_date,
      entity_type,
      entity_id,
      action,
      user_id,
      page = 1,
      limit = 50
    } = req.query;

    let query = getSupabase()
      .from('audit_trail')
      .select(
        `
        *,
        user_profiles!user_id(first_name, last_name, email)
      `
      )
      .eq('organization_id', user.organizationId);

    // Apply filters
    if (start_date) {
      query = query.gte('created_at', start_date as string);
    }
    if (end_date) {
      query = query.lte('created_at', end_date as string);
    }
    if (entity_type) {
      query = query.eq('entity_type', entity_type);
    }
    if (entity_id) {
      query = query.eq('entity_id', entity_id);
    }
    if (action) {
      query = query.eq('action', action);
    }
    if (user_id) {
      query = query.eq('user_id', user_id);
    }

    // Pagination
    const offset = (Number(page) - 1) * Number(limit);
    query = query.range(offset, offset + Number(limit) - 1);

    const {
      data: auditTrail,
      error,
      count
    } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching audit trail:', error);
      return res.status(500).json({ error: 'Failed to fetch audit trail' });
    }

    // Log audit trail access
    await SecurityMonitoring.logSecurityEvent(
      SecurityEventType.DATA_ACCESS,
      'audit_trail',
      {
        action: 'view',
        filters: { start_date, end_date, entity_type, action },
        count: auditTrail?.length || 0
      },
      user.id,
      req.ip,
      req.get('User-Agent')
    );

    res.json({
      auditTrail,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count || 0,
        totalPages: Math.ceil((count || 0) / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get audit trail error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Get Evidence Collection
 * GET /api/audit/evidence
 */
router.get('/evidence', async (req: express.Request, res: express.Response) => {
  try {
    const user = (req as any).user;
    const { control_id, evidence_type, status } = req.query;

    let query = getSupabase().from('compliance_evidence').select(`
        *,
        compliance_controls(
          control_id,
          title,
          compliance_frameworks(name, framework_type)
        ),
        user_profiles!collected_by(first_name, last_name)
      `);

    // Apply filters
    if (control_id) {
      query = query.eq('control_id', control_id);
    }
    if (evidence_type) {
      query = query.eq('evidence_type', evidence_type);
    }
    if (status) {
      query = query.eq('status', status);
    }

    const { data: evidence, error } = await query.order('collection_date', { ascending: false });

    if (error) {
      console.error('Error fetching evidence:', error);
      return res.status(500).json({ error: 'Failed to fetch evidence' });
    }

    // Log evidence access
    await SecurityMonitoring.logSecurityEvent(
      SecurityEventType.DATA_ACCESS,
      'compliance_evidence',
      {
        action: 'list',
        filters: { control_id, evidence_type, status },
        count: evidence?.length || 0
      },
      user.id,
      req.ip,
      req.get('User-Agent')
    );

    res.json({ evidence });
  } catch (error) {
    console.error('Get evidence error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Upload Evidence
 * POST /api/audit/evidence
 */
router.post(
  '/evidence',
  SecurityMiddleware.createSecurityMiddleware({
    authentication: {
      required: true,
      permissions: ['audit:create']
    }
  }),
  upload.single('file'),
  async (req: express.Request, res: express.Response) => {
    try {
      const user = (req as any).user;
      const file = req.file;

      // Validate input
      const validation = validateInput(req.body, {
        control_id: { required: true, type: 'string' },
        evidence_type: {
          required: true,
          type: 'string',
          enum: [
            'document',
            'screenshot',
            'log_file',
            'configuration',
            'policy',
            'procedure',
            'other'
          ]
        },
        title: { required: true, type: 'string', maxLength: 200 },
        description: { required: false, type: 'string' },
        collection_date: { required: true, type: 'string' }
      });

      if (!validation.isValid) {
        return res.status(400).json({ error: 'Invalid input', details: validation.errors });
      }

      const { control_id, evidence_type, title, description, collection_date } = req.body;

      // Verify control exists and user has access
      const { data: control } = await getSupabase()
        .from('compliance_controls')
        .select(
          `
          id,
          compliance_frameworks!inner(
            organization_id
          )
        `
        )
        .eq('id', control_id)
        .eq('compliance_frameworks.organization_id', user.organizationId)
        .single();

      if (!control) {
        return res.status(404).json({ error: 'Compliance control not found' });
      }

      let fileUrl = null;
      let fileName = null;
      let fileSize = null;
      let mimeType = null;

      // Handle file upload if present
      if (file) {
        fileName = `${Date.now()}-${file.originalname}`;
        fileSize = file.size;
        mimeType = file.mimetype;

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('evidence')
          .upload(`${user.organizationId}/${fileName}`, file.buffer, {
            contentType: file.mimetype,
            upsert: false
          });

        if (uploadError) {
          console.error('File upload error:', uploadError);
          return res.status(500).json({ error: 'Failed to upload file' });
        }

        // Get public URL
        const { data: urlData } = supabase.storage.from('evidence').getPublicUrl(uploadData.path);

        fileUrl = urlData.publicUrl;
      }

      // Create evidence record
      const { data: evidence, error } = await supabase
        .from('compliance_evidence')
        .insert({
          control_id,
          evidence_type,
          title,
          description,
          collection_date,
          file_url: fileUrl,
          file_name: fileName,
          file_size: fileSize,
          mime_type: mimeType,
          status: 'collected',
          collected_by: user.id
        })
        .select(
          `
          *,
          compliance_controls(
            control_id,
            title,
            compliance_frameworks(name, framework_type)
          )
        `
        )
        .single();

      if (error) {
        console.error('Error creating evidence:', error);
        return res.status(500).json({ error: 'Failed to create evidence record' });
      }

      // Log evidence creation
      await SecurityMonitoring.logSecurityEvent(
        SecurityEventType.DATA_MODIFICATION,
        'compliance_evidence',
        {
          action: 'create',
          evidenceId: evidence.id,
          controlId: control_id,
          evidenceType: evidence_type,
          hasFile: !!file
        },
        user.id,
        req.ip,
        req.get('User-Agent')
      );

      res.status(201).json({ evidence });
    } catch (error) {
      console.error('Upload evidence error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * Get Audit Reports
 * GET /api/audit/reports
 */
router.get('/reports', async (req: express.Request, res: express.Response) => {
  try {
    const user = (req as any).user;
    const { report_type, framework_id, start_date, end_date } = req.query;

    let query = supabase
      .from('audit_reports')
      .select(
        `
        *,
        compliance_frameworks(name, framework_type),
        user_profiles!generated_by(first_name, last_name)
      `
      )
      .eq('organization_id', user.organizationId);

    // Apply filters
    if (report_type) {
      query = query.eq('report_type', report_type);
    }
    if (framework_id) {
      query = query.eq('framework_id', framework_id);
    }
    if (start_date) {
      query = query.gte('period_start', start_date as string);
    }
    if (end_date) {
      query = query.lte('period_end', end_date as string);
    }

    const { data: reports, error } = await query.order('generated_at', { ascending: false });

    if (error) {
      console.error('Error fetching reports:', error);
      return res.status(500).json({ error: 'Failed to fetch audit reports' });
    }

    // Log reports access
    await SecurityMonitoring.logSecurityEvent(
      SecurityEventType.DATA_ACCESS,
      'audit_reports',
      {
        action: 'list',
        filters: { report_type, framework_id },
        count: reports?.length || 0
      },
      user.id,
      req.ip,
      req.get('User-Agent')
    );

    res.json({ reports });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Generate Audit Report
 * POST /api/audit/reports/generate
 */
router.post(
  '/reports/generate',
  SecurityMiddleware.createSecurityMiddleware({
    authentication: {
      required: true,
      permissions: ['audit:create']
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
            'evidence_summary',
            'control_effectiveness',
            'audit_readiness'
          ]
        },
        framework_id: { required: false, type: 'string' },
        period_start: { required: true, type: 'string' },
        period_end: { required: true, type: 'string' },
        include_evidence: { required: false, type: 'boolean' },
        include_recommendations: { required: false, type: 'boolean' }
      });

      if (!validation.isValid) {
        return res.status(400).json({ error: 'Invalid input', details: validation.errors });
      }

      const {
        report_type,
        framework_id,
        period_start,
        period_end,
        include_evidence,
        include_recommendations
      } = req.body;

      // Generate report data based on type
      let reportData: any = {};
      let title = '';

      switch (report_type) {
        case 'compliance_status':
          title = 'Compliance Status Report';
          reportData = await generateComplianceStatusReport(
            user.organizationId,
            framework_id,
            period_start,
            period_end
          );
          break;

        case 'gap_analysis':
          title = 'Gap Analysis Report';
          reportData = await generateGapAnalysisReport(user.organizationId, framework_id);
          break;

        case 'evidence_summary':
          title = 'Evidence Summary Report';
          reportData = await generateEvidenceSummaryReport(
            user.organizationId,
            framework_id,
            period_start,
            period_end
          );
          break;

        case 'control_effectiveness':
          title = 'Control Effectiveness Report';
          reportData = await generateControlEffectivenessReport(
            user.organizationId,
            framework_id,
            period_start,
            period_end
          );
          break;

        case 'audit_readiness':
          title = 'Audit Readiness Report';
          reportData = await generateAuditReadinessReport(user.organizationId, framework_id);
          break;

        default:
          return res.status(400).json({ error: 'Invalid report type' });
      }

      // Create report record
      const { data: report, error } = await supabase
        .from('audit_reports')
        .insert({
          title,
          report_type,
          framework_id,
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
          compliance_frameworks(name, framework_type)
        `
        )
        .single();

      if (error) {
        console.error('Error creating report:', error);
        return res.status(500).json({ error: 'Failed to generate audit report' });
      }

      // Log report generation
      await SecurityMonitoring.logSecurityEvent(
        SecurityEventType.DATA_MODIFICATION,
        'audit_report',
        {
          action: 'generate',
          reportId: report.id,
          reportType: report_type,
          frameworkId: framework_id
        },
        user.id,
        req.ip,
        req.get('User-Agent')
      );

      res.status(201).json({ report });
    } catch (error) {
      console.error('Generate report error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * Get Audit Statistics
 * GET /api/audit/statistics
 */
router.get('/statistics', async (req: express.Request, res: express.Response) => {
  try {
    const user = (req as any).user;
    const { period = '30d' } = req.query;

    // Calculate date range
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

    // Get audit trail statistics
    const { data: auditStats } = await supabase
      .from('audit_trail')
      .select('action, created_at')
      .eq('organization_id', user.organizationId)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    // Get evidence collection statistics
    const { data: evidenceStats } = await supabase
      .from('compliance_evidence')
      .select('evidence_type, status, collection_date')
      .gte('collection_date', startDate.toISOString())
      .lte('collection_date', endDate.toISOString());

    // Get assessment statistics
    const { data: assessmentStats } = await supabase
      .from('compliance_assessments')
      .select('status, assessment_type, created_at')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    // Process statistics
    const statistics = {
      period,
      auditTrail: {
        total: auditStats?.length || 0,
        byAction:
          auditStats?.reduce((acc: any, item) => {
            acc[item.action] = (acc[item.action] || 0) + 1;
            return acc;
          }, {}) || {}
      },
      evidence: {
        total: evidenceStats?.length || 0,
        byType:
          evidenceStats?.reduce((acc: any, item) => {
            acc[item.evidence_type] = (acc[item.evidence_type] || 0) + 1;
            return acc;
          }, {}) || {},
        byStatus:
          evidenceStats?.reduce((acc: any, item) => {
            acc[item.status] = (acc[item.status] || 0) + 1;
            return acc;
          }, {}) || {}
      },
      assessments: {
        total: assessmentStats?.length || 0,
        byStatus:
          assessmentStats?.reduce((acc: any, item) => {
            acc[item.status] = (acc[item.status] || 0) + 1;
            return acc;
          }, {}) || {},
        byType:
          assessmentStats?.reduce((acc: any, item) => {
            acc[item.assessment_type] = (acc[item.assessment_type] || 0) + 1;
            return acc;
          }, {}) || {}
      }
    };

    // Log statistics access
    await SecurityMonitoring.logSecurityEvent(
      SecurityEventType.DATA_ACCESS,
      'audit_statistics',
      { action: 'view', period },
      user.id,
      req.ip,
      req.get('User-Agent')
    );

    res.json({ statistics });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper functions for report generation

async function generateComplianceStatusReport(
  organizationId: string,
  frameworkId?: string,
  periodStart?: string,
  periodEnd?: string
) {
  // Implementation for compliance status report
  let query = supabase
    .from('compliance_frameworks')
    .select(
      `
      *,
      compliance_controls(
        id,
        status,
        priority
      )
    `
    )
    .eq('organization_id', organizationId)
    .eq('is_active', true);

  if (frameworkId) {
    query = query.eq('id', frameworkId);
  }

  const { data: frameworks, error } = await query;

  return {
    frameworks: frameworks || [],
    summary: {
      totalFrameworks: frameworks?.length || 0,
      totalControls:
        frameworks?.reduce((sum, f) => sum + (f.compliance_controls?.length || 0), 0) || 0,
      implementedControls:
        frameworks?.reduce(
          (sum, f) =>
            sum +
            (f.compliance_controls?.filter((c: any) => c.status === 'implemented').length || 0),
          0
        ) || 0
    }
  };
}

async function generateGapAnalysisReport(organizationId: string, frameworkId?: string) {
  // Implementation for gap analysis report
  let query = supabase
    .from('compliance_controls')
    .select(
      `
      *,
      compliance_frameworks!inner(
        name,
        framework_type,
        organization_id
      )
    `
    )
    .eq('compliance_frameworks.organization_id', organizationId)
    .neq('status', 'implemented');

  if (frameworkId) {
    query = query.eq('framework_id', frameworkId);
  }

  const { data: controls } = await query;

  return {
    gaps: controls || [],
    summary: {
      totalGaps: controls?.length || 0,
      byPriority:
        controls?.reduce((acc: any, control) => {
          acc[control.priority] = (acc[control.priority] || 0) + 1;
          return acc;
        }, {}) || {}
    }
  };
}

async function generateEvidenceSummaryReport(
  organizationId: string,
  frameworkId?: string,
  periodStart?: string,
  periodEnd?: string
) {
  // Implementation for evidence summary report
  let query = supabase
    .from('compliance_evidence')
    .select(
      `
      *,
      compliance_controls!inner(
        control_id,
        title,
        compliance_frameworks!inner(
          name,
          framework_type,
          organization_id
        )
      )
    `
    )
    .eq('compliance_controls.compliance_frameworks.organization_id', organizationId);

  if (frameworkId) {
    query = query.eq('compliance_controls.framework_id', frameworkId);
  }
  if (periodStart) {
    query = query.gte('collection_date', periodStart);
  }
  if (periodEnd) {
    query = query.lte('collection_date', periodEnd);
  }

  const { data: evidence } = await query;

  return {
    evidence: evidence || [],
    summary: {
      totalEvidence: evidence?.length || 0,
      byType:
        evidence?.reduce((acc: any, item) => {
          acc[item.evidence_type] = (acc[item.evidence_type] || 0) + 1;
          return acc;
        }, {}) || {}
    }
  };
}

async function generateControlEffectivenessReport(
  organizationId: string,
  frameworkId?: string,
  periodStart?: string,
  periodEnd?: string
) {
  // Implementation for control effectiveness report
  let query = supabase
    .from('compliance_assessment_results')
    .select(
      `
      *,
      compliance_controls!inner(
        control_id,
        title,
        compliance_frameworks!inner(
          name,
          framework_type,
          organization_id
        )
      )
    `
    )
    .eq('compliance_controls.compliance_frameworks.organization_id', organizationId);

  if (frameworkId) {
    query = query.eq('compliance_controls.framework_id', frameworkId);
  }
  if (periodStart) {
    query = query.gte('assessment_date', periodStart);
  }
  if (periodEnd) {
    query = query.lte('assessment_date', periodEnd);
  }

  const { data: assessments } = await query;

  return {
    assessments: assessments || [],
    summary: {
      totalAssessments: assessments?.length || 0,
      effectiveControls: assessments?.filter(a => a.result === 'pass').length || 0,
      ineffectiveControls: assessments?.filter(a => a.result === 'fail').length || 0
    }
  };
}

async function generateAuditReadinessReport(organizationId: string, frameworkId?: string) {
  // Implementation for audit readiness report
  const { data: readiness } = await supabase.rpc('assess_audit_readiness', {
    org_id: organizationId,
    framework_id: frameworkId
  });

  return {
    readiness: readiness || [],
    summary: {
      overallScore: readiness?.[0]?.overall_score || 0,
      readyControls: readiness?.[0]?.ready_controls || 0,
      notReadyControls: readiness?.[0]?.not_ready_controls || 0
    }
  };
}

export default router;
