/**
 * Compliance Framework API Routes
 * Handles compliance frameworks, controls, assessments, and evidence management
 * Part of Phase 3: Compliance Framework Implementation
 */

import express from 'express';
import { SecurityMonitoring, SecurityEventType } from '../../lib/monitoring';
import { SecurityMiddleware } from '../../middleware/security';
import { validateInput } from '../../lib/validation';
import { getSupabase } from '../../integrations/supabase/client';

const router = express.Router();

/**
 * Get All Compliance Frameworks
 * GET /api/compliance/frameworks
 */
router.get('/frameworks', async (req: express.Request, res: express.Response) => {
  try {
    const user = (req as any).user;

    const { data: frameworks, error } = await getSupabase()
      .from('compliance_frameworks')
      .select(
        `
        *,
        compliance_controls(count),
        compliance_assessments(count)
      `
      )
      .eq('organization_id', user.organizationId);

    if (error) {
      console.error('Error fetching frameworks:', error);
      return res.status(500).json({ error: 'Failed to fetch compliance frameworks' });
    }

    // Log data access
    await SecurityMonitoring.logSecurityEvent(
      SecurityEventType.DATA_ACCESS,
      'compliance_frameworks',
      { action: 'list', count: frameworks?.length || 0 },
      user.id,
      req.ip,
      req.get('User-Agent')
    );

    res.json({ frameworks });
  } catch (error) {
    console.error('Get frameworks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Get Specific Compliance Framework
 * GET /api/compliance/frameworks/:id
 */
router.get('/frameworks/:id', async (req: express.Request, res: express.Response) => {
  try {
    const user = (req as any).user;
    const { id } = req.params;

    const { data: framework, error } = await getSupabase()
      .from('compliance_frameworks')
      .select(
        `
        *,
        compliance_controls(*),
        compliance_assessments(
          *,
          compliance_assessment_results(*)
        )
      `
      )
      .eq('id', id)
      .eq('organization_id', user.organizationId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Compliance framework not found' });
      }
      console.error('Error fetching framework:', error);
      return res.status(500).json({ error: 'Failed to fetch compliance framework' });
    }

    // Log data access
    await SecurityMonitoring.logSecurityEvent(
      SecurityEventType.DATA_ACCESS,
      'compliance_framework',
      { action: 'view', frameworkId: id, frameworkType: framework.framework_type },
      user.id,
      req.ip,
      req.get('User-Agent')
    );

    res.json({ framework });
  } catch (error) {
    console.error('Get framework error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Create Compliance Framework
 * POST /api/compliance/frameworks
 */
router.post(
  '/frameworks',
  SecurityMiddleware.createSecurityMiddleware({
    authentication: {
      required: true,
      permissions: ['compliance:create']
    }
  }),
  async (req: express.Request, res: express.Response) => {
    try {
      const user = (req as any).user;

      // Validate input
      const validation = validateInput(req.body, {
        name: { required: true, type: 'string', maxLength: 100 },
        description: { required: false, type: 'string', maxLength: 500 },
        framework_type: {
          required: true,
          type: 'string',
          enum: ['soc2', 'iso27001', 'gdpr', 'ccpa', 'hipaa', 'pci_dss', 'fedramp', 'custom']
        },
        version: { required: false, type: 'string', maxLength: 20 },
        is_active: { required: false, type: 'boolean' }
      });

      if (!validation.isValid) {
        return res.status(400).json({ error: 'Invalid input', details: validation.errors });
      }

      const { name, description, framework_type, version, is_active } = req.body;

      // Check if framework already exists
      const { data: existing } = await getSupabase()
        .from('compliance_frameworks')
        .select('id')
        .eq('organization_id', user.organizationId)
        .eq('framework_type', framework_type)
        .single();

      if (existing) {
        return res.status(409).json({ error: 'Framework of this type already exists' });
      }

      // Create framework
      const { data: framework, error } = await getSupabase()
        .from('compliance_frameworks')
        .insert({
          name,
          description,
          framework_type,
          version: version || '1.0',
          is_active: is_active !== false,
          organization_id: user.organizationId,
          created_by: user.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating framework:', error);
        return res.status(500).json({ error: 'Failed to create compliance framework' });
      }

      // Log framework creation
      await SecurityMonitoring.logSecurityEvent(
        SecurityEventType.DATA_MODIFICATION,
        'compliance_framework',
        {
          action: 'create',
          frameworkId: framework.id,
          frameworkType: framework_type,
          name
        },
        user.id,
        req.ip,
        req.get('User-Agent')
      );

      res.status(201).json({ framework });
    } catch (error) {
      console.error('Create framework error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * Update Compliance Framework
 * PUT /api/compliance/frameworks/:id
 */
router.put(
  '/frameworks/:id',
  SecurityMiddleware.createSecurityMiddleware({
    authentication: {
      required: true,
      permissions: ['compliance:update']
    }
  }),
  async (req: express.Request, res: express.Response) => {
    try {
      const user = (req as any).user;
      const { id } = req.params;

      // Validate input
      const validation = validateInput(req.body, {
        name: { required: false, type: 'string', maxLength: 100 },
        description: { required: false, type: 'string', maxLength: 500 },
        version: { required: false, type: 'string', maxLength: 20 },
        is_active: { required: false, type: 'boolean' }
      });

      if (!validation.isValid) {
        return res.status(400).json({ error: 'Invalid input', details: validation.errors });
      }

      // Check if framework exists and user has access
      const { data: existing } = await getSupabase()
        .from('compliance_frameworks')
        .select('id, framework_type')
        .eq('id', id)
        .eq('organization_id', user.organizationId)
        .single();

      if (!existing) {
        return res.status(404).json({ error: 'Compliance framework not found' });
      }

      // Update framework
      const { data: framework, error } = await getSupabase()
        .from('compliance_frameworks')
        .update({
          ...req.body,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating framework:', error);
        return res.status(500).json({ error: 'Failed to update compliance framework' });
      }

      // Log framework update
      await SecurityMonitoring.logSecurityEvent(
        SecurityEventType.DATA_MODIFICATION,
        'compliance_framework',
        {
          action: 'update',
          frameworkId: id,
          frameworkType: existing.framework_type,
          changes: Object.keys(req.body)
        },
        user.id,
        req.ip,
        req.get('User-Agent')
      );

      res.json({ framework });
    } catch (error) {
      console.error('Update framework error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * Get Compliance Controls for Framework
 * GET /api/compliance/frameworks/:id/controls
 */
router.get('/frameworks/:id/controls', async (req: express.Request, res: express.Response) => {
  try {
    const user = (req as any).user;
    const { id } = req.params;
    const { status, category } = req.query;

    let query = getSupabase()
      .from('compliance_controls')
      .select(
        `
        *,
        compliance_evidence(count),
        compliance_control_assessments(
          id,
          status,
          assessment_date,
          next_assessment_date
        )
      `
      )
      .eq('framework_id', id);

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }
    if (category) {
      query = query.eq('category', category);
    }

    const { data: controls, error } = await query.order('control_id');

    if (error) {
      console.error('Error fetching controls:', error);
      return res.status(500).json({ error: 'Failed to fetch compliance controls' });
    }

    // Log data access
    await SecurityMonitoring.logSecurityEvent(
      SecurityEventType.DATA_ACCESS,
      'compliance_controls',
      { action: 'list', frameworkId: id, count: controls?.length || 0 },
      user.id,
      req.ip,
      req.get('User-Agent')
    );

    res.json({ controls });
  } catch (error) {
    console.error('Get controls error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Create Compliance Control
 * POST /api/compliance/frameworks/:id/controls
 */
router.post(
  '/frameworks/:id/controls',
  SecurityMiddleware.createSecurityMiddleware({
    authentication: {
      required: true,
      permissions: ['compliance:create']
    }
  }),
  async (req: express.Request, res: express.Response) => {
    try {
      const user = (req as any).user;
      const { id: frameworkId } = req.params;

      // Validate input
      const validation = validateInput(req.body, {
        control_id: { required: true, type: 'string', maxLength: 50 },
        title: { required: true, type: 'string', maxLength: 200 },
        description: { required: true, type: 'string' },
        category: { required: true, type: 'string', maxLength: 100 },
        priority: { required: true, type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
        implementation_guidance: { required: false, type: 'string' },
        testing_procedures: { required: false, type: 'string' },
        frequency: {
          required: true,
          type: 'string',
          enum: ['daily', 'weekly', 'monthly', 'quarterly', 'annually']
        }
      });

      if (!validation.isValid) {
        return res.status(400).json({ error: 'Invalid input', details: validation.errors });
      }

      // Verify framework exists and user has access
      const { data: framework } = await getSupabase()
        .from('compliance_frameworks')
        .select('id')
        .eq('id', frameworkId)
        .eq('organization_id', user.organizationId)
        .single();

      if (!framework) {
        return res.status(404).json({ error: 'Compliance framework not found' });
      }

      // Check if control already exists
      const { data: existing } = await getSupabase()
        .from('compliance_controls')
        .select('id')
        .eq('framework_id', frameworkId)
        .eq('control_id', req.body.control_id)
        .single();

      if (existing) {
        return res.status(409).json({ error: 'Control with this ID already exists' });
      }

      // Create control
      const { data: control, error } = await getSupabase()
        .from('compliance_controls')
        .insert({
          ...req.body,
          framework_id: frameworkId,
          status: 'not_implemented',
          created_by: user.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating control:', error);
        return res.status(500).json({ error: 'Failed to create compliance control' });
      }

      // Log control creation
      await SecurityMonitoring.logSecurityEvent(
        SecurityEventType.DATA_MODIFICATION,
        'compliance_control',
        {
          action: 'create',
          controlId: control.id,
          frameworkId,
          controlIdentifier: req.body.control_id
        },
        user.id,
        req.ip,
        req.get('User-Agent')
      );

      res.status(201).json({ control });
    } catch (error) {
      console.error('Create control error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * Get Compliance Assessments
 * GET /api/compliance/assessments
 */
router.get('/assessments', async (req: express.Request, res: express.Response) => {
  try {
    const user = (req as any).user;
    const { framework_id, status, assessor_id } = req.query;

    let query = getSupabase().from('compliance_assessments').select(`
        *,
        compliance_frameworks(name, framework_type),
        user_profiles!assessor_id(first_name, last_name),
        compliance_assessment_results(count)
      `);

    // Apply filters
    if (framework_id) {
      query = query.eq('framework_id', framework_id);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (assessor_id) {
      query = query.eq('assessor_id', assessor_id);
    }

    const { data: assessments, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching assessments:', error);
      return res.status(500).json({ error: 'Failed to fetch compliance assessments' });
    }

    // Log data access
    await SecurityMonitoring.logSecurityEvent(
      SecurityEventType.DATA_ACCESS,
      'compliance_assessments',
      { action: 'list', count: assessments?.length || 0 },
      user.id,
      req.ip,
      req.get('User-Agent')
    );

    res.json({ assessments });
  } catch (error) {
    console.error('Get assessments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Create Compliance Assessment
 * POST /api/compliance/assessments
 */
router.post(
  '/assessments',
  SecurityMiddleware.createSecurityMiddleware({
    authentication: {
      required: true,
      permissions: ['compliance:create']
    }
  }),
  async (req: express.Request, res: express.Response) => {
    try {
      const user = (req as any).user;

      // Validate input
      const validation = validateInput(req.body, {
        framework_id: { required: true, type: 'string' },
        assessment_type: { required: true, type: 'string', enum: ['internal', 'external', 'self'] },
        scope: { required: true, type: 'string' },
        planned_start_date: { required: true, type: 'string' },
        planned_end_date: { required: true, type: 'string' },
        assessor_id: { required: false, type: 'string' }
      });

      if (!validation.isValid) {
        return res.status(400).json({ error: 'Invalid input', details: validation.errors });
      }

      // Verify framework exists and user has access
      const { data: framework } = await getSupabase()
        .from('compliance_frameworks')
        .select('id, name')
        .eq('id', req.body.framework_id)
        .eq('organization_id', user.organizationId)
        .single();

      if (!framework) {
        return res.status(404).json({ error: 'Compliance framework not found' });
      }

      // Create assessment
      const { data: assessment, error } = await getSupabase()
        .from('compliance_assessments')
        .insert({
          ...req.body,
          status: 'planned',
          created_by: user.id,
          assessor_id: req.body.assessor_id || user.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating assessment:', error);
        return res.status(500).json({ error: 'Failed to create compliance assessment' });
      }

      // Log assessment creation
      await SecurityMonitoring.logSecurityEvent(
        SecurityEventType.DATA_MODIFICATION,
        'compliance_assessment',
        {
          action: 'create',
          assessmentId: assessment.id,
          frameworkId: req.body.framework_id,
          assessmentType: req.body.assessment_type
        },
        user.id,
        req.ip,
        req.get('User-Agent')
      );

      res.status(201).json({ assessment });
    } catch (error) {
      console.error('Create assessment error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * Get Compliance Dashboard Summary
 * GET /api/compliance/dashboard
 */
router.get('/dashboard', async (req: express.Request, res: express.Response) => {
  try {
    const user = (req as any).user;

    // Get framework summary
    const { data: frameworkSummary } = await getSupabase().rpc('get_compliance_summary', {
      org_id: user.organizationId
    });

    // Get recent assessments
    const { data: recentAssessments } = await getSupabase()
      .from('compliance_assessments')
      .select(
        `
        id,
        status,
        assessment_type,
        planned_start_date,
        planned_end_date,
        compliance_frameworks(name, framework_type)
      `
      )
      .order('created_at', { ascending: false })
      .limit(5);

    // Get controls due for review
    const { data: controlsDue } = await getSupabase().rpc('get_controls_due_for_review', {
      org_id: user.organizationId,
      days_ahead: 30
    });

    // Get compliance score trends (last 6 months)
    const { data: scoreTrends } = await getSupabase()
      .from('compliance_score_history')
      .select('*')
      .eq('organization_id', user.organizationId)
      .gte('created_at', new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at');

    const dashboard = {
      summary: frameworkSummary?.[0] || {
        total_frameworks: 0,
        active_frameworks: 0,
        total_controls: 0,
        implemented_controls: 0,
        compliance_score: 0
      },
      recentAssessments: recentAssessments || [],
      controlsDue: controlsDue || [],
      scoreTrends: scoreTrends || []
    };

    // Log dashboard access
    await SecurityMonitoring.logSecurityEvent(
      SecurityEventType.DATA_ACCESS,
      'compliance_dashboard',
      { action: 'view' },
      user.id,
      req.ip,
      req.get('User-Agent')
    );

    res.json({ dashboard });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
