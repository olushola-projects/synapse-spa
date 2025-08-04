/**
 * Admin API Routes
 * Handles system administration, user management, and organization settings
 * Part of Phase 2: Security and Phase 3: Compliance Framework Implementation
 */

import express from 'express';
import { SecurityMonitoring, SecurityEventType } from '../../lib/monitoring';
import { SecurityMiddleware } from '../../middleware/security';
import { validateInput } from '../../lib/validation';
import { getSupabase } from '../../integrations/supabase/client';
import bcrypt from 'bcrypt';

const router = express.Router();

/**
 * Get Users
 * GET /api/admin/users
 */
router.get(
  '/users',
  SecurityMiddleware.createSecurityMiddleware({
    authentication: {
      required: true,
      permissions: ['admin:users:read']
    }
  }),
  async (req: express.Request, res: express.Response) => {
    try {
      const user = (req as any).user;
      const { role, status, search, page = 1, limit = 50 } = req.query;

      let query = getSupabase()
        .from('user_profiles')
        .select(
          `
          *,
          user_organization_memberships!inner(
            role,
            status,
            joined_at
          )
        `
        )
        .eq('user_organization_memberships.organization_id', user.organizationId);

      // Apply filters
      if (role) {
        query = query.eq('user_organization_memberships.role', role);
      }
      if (status) {
        query = query.eq('user_organization_memberships.status', status);
      }
      if (search) {
        query = query.or(
          `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`
        );
      }

      // Pagination
      const offset = (Number(page) - 1) * Number(limit);
      query = query.range(offset, offset + Number(limit) - 1);

      const { data: users, error, count } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ error: 'Failed to fetch users' });
      }

      // Log user list access
      await SecurityMonitoring.logSecurityEvent(
        SecurityEventType.DATA_ACCESS,
        'admin_users',
        {
          action: 'list',
          filters: { role, status, search },
          count: users?.length || 0
        },
        user.id,
        req.ip,
        req.get('User-Agent')
      );

      res.json({
        users,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: count || 0,
          totalPages: Math.ceil((count || 0) / Number(limit))
        }
      });
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * Create User
 * POST /api/admin/users
 */
router.post(
  '/users',
  SecurityMiddleware.createSecurityMiddleware({
    authentication: {
      required: true,
      permissions: ['admin:users:create']
    }
  }),
  async (req: express.Request, res: express.Response) => {
    try {
      const user = (req as any).user;

      // Validate input
      const validation = validateInput(req.body, {
        email: { required: true, type: 'email' },
        first_name: { required: true, type: 'string', maxLength: 50 },
        last_name: { required: true, type: 'string', maxLength: 50 },
        role: {
          required: true,
          type: 'string',
          enum: ['super_admin', 'admin', 'compliance_manager', 'auditor', 'user', 'viewer']
        },
        password: { required: true, type: 'string', minLength: 8 },
        send_invitation: { required: false, type: 'boolean' }
      });

      if (!validation.isValid) {
        return res.status(400).json({ error: 'Invalid input', details: validation.errors });
      }

      const { email, first_name, last_name, role, password, send_invitation } = req.body;

      // Check if user already exists
      const { data: existingUser } = await getSupabase()
        .from('user_profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (existingUser) {
        return res.status(400).json({ error: 'User with this email already exists' });
      }

      // Create auth user
      const { data: authUser, error: authError } = await getSupabase().auth.admin.createUser({
        email,
        password,
        email_confirm: !send_invitation
      });

      if (authError) {
        console.error('Error creating auth user:', authError);
        return res.status(500).json({ error: 'Failed to create user account' });
      }

      // Create user profile
      const { data: userProfile, error: profileError } = await getSupabase()
        .from('user_profiles')
        .insert({
          id: authUser.user.id,
          email,
          first_name,
          last_name,
          organization_id: user.organizationId
        })
        .select()
        .single();

      if (profileError) {
        console.error('Error creating user profile:', profileError);
        // Cleanup auth user if profile creation fails
        await supabase.auth.admin.deleteUser(authUser.user.id);
        return res.status(500).json({ error: 'Failed to create user profile' });
      }

      // Create organization membership
      const { error: membershipError } = await getSupabase()
        .from('user_organization_memberships')
        .insert({
          user_id: authUser.user.id,
          organization_id: user.organizationId,
          role,
          status: 'active'
        });

      if (membershipError) {
        console.error('Error creating organization membership:', membershipError);
        // Cleanup user and auth if membership creation fails
        await getSupabase().from('user_profiles').delete().eq('id', authUser.user.id);
        await getSupabase().auth.admin.deleteUser(authUser.user.id);
        return res.status(500).json({ error: 'Failed to create organization membership' });
      }

      // Send invitation email if requested
      if (send_invitation) {
        // Implementation for sending invitation email
        // This would typically use an email service
      }

      // Log user creation
      await SecurityMonitoring.logSecurityEvent(
        SecurityEventType.USER_MANAGEMENT,
        'user_created',
        {
          action: 'create',
          newUserId: authUser.user.id,
          email,
          role,
          sendInvitation: send_invitation
        },
        user.id,
        req.ip,
        req.get('User-Agent')
      );

      res.status(201).json({
        user: {
          ...userProfile,
          role,
          status: 'active'
        }
      });
    } catch (error) {
      console.error('Create user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * Update User
 * PUT /api/admin/users/:id
 */
router.put(
  '/users/:id',
  SecurityMiddleware.createSecurityMiddleware({
    authentication: {
      required: true,
      permissions: ['admin:users:update']
    }
  }),
  async (req: express.Request, res: express.Response) => {
    try {
      const user = (req as any).user;
      const { id } = req.params;

      // Validate input
      const validation = validateInput(req.body, {
        first_name: { required: false, type: 'string', maxLength: 50 },
        last_name: { required: false, type: 'string', maxLength: 50 },
        role: {
          required: false,
          type: 'string',
          enum: ['super_admin', 'admin', 'compliance_manager', 'auditor', 'user', 'viewer']
        },
        status: {
          required: false,
          type: 'string',
          enum: ['active', 'inactive', 'suspended']
        }
      });

      if (!validation.isValid) {
        return res.status(400).json({ error: 'Invalid input', details: validation.errors });
      }

      // Verify user exists and is in the same organization
      const { data: existingUser } = await getSupabase()
        .from('user_profiles')
        .select(
          `
          *,
          user_organization_memberships!inner(
            role,
            status,
            organization_id
          )
        `
        )
        .eq('id', id)
        .eq('user_organization_memberships.organization_id', user.organizationId)
        .single();

      if (!existingUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Prevent users from modifying their own role/status
      if (id === user.id && (req.body.role || req.body.status)) {
        return res.status(400).json({ error: 'Cannot modify your own role or status' });
      }

      const updateData = { ...req.body };
      const membershipUpdate: any = {};

      // Separate profile updates from membership updates
      if (updateData.role) {
        membershipUpdate.role = updateData.role;
        delete updateData.role;
      }
      if (updateData.status) {
        membershipUpdate.status = updateData.status;
        delete updateData.status;
      }

      // Update user profile if there are profile fields to update
      if (Object.keys(updateData).length > 0) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .update(updateData)
          .eq('id', id);

        if (profileError) {
          console.error('Error updating user profile:', profileError);
          return res.status(500).json({ error: 'Failed to update user profile' });
        }
      }

      // Update organization membership if there are membership fields to update
      if (Object.keys(membershipUpdate).length > 0) {
        const { error: membershipError } = await supabase
          .from('user_organization_memberships')
          .update(membershipUpdate)
          .eq('user_id', id)
          .eq('organization_id', user.organizationId);

        if (membershipError) {
          console.error('Error updating user membership:', membershipError);
          return res.status(500).json({ error: 'Failed to update user membership' });
        }
      }

      // Get updated user data
      const { data: updatedUser } = await supabase
        .from('user_profiles')
        .select(
          `
          *,
          user_organization_memberships!inner(
            role,
            status
          )
        `
        )
        .eq('id', id)
        .eq('user_organization_memberships.organization_id', user.organizationId)
        .single();

      // Log user update
      await SecurityMonitoring.logSecurityEvent(
        SecurityEventType.USER_MANAGEMENT,
        'user_updated',
        {
          action: 'update',
          targetUserId: id,
          changes: { ...updateData, ...membershipUpdate }
        },
        user.id,
        req.ip,
        req.get('User-Agent')
      );

      res.json({ user: updatedUser });
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * Delete User
 * DELETE /api/admin/users/:id
 */
router.delete(
  '/users/:id',
  SecurityMiddleware.createSecurityMiddleware({
    authentication: {
      required: true,
      permissions: ['admin:users:delete']
    }
  }),
  async (req: express.Request, res: express.Response) => {
    try {
      const user = (req as any).user;
      const { id } = req.params;

      // Prevent users from deleting themselves
      if (id === user.id) {
        return res.status(400).json({ error: 'Cannot delete your own account' });
      }

      // Verify user exists and is in the same organization
      const { data: existingUser } = await supabase
        .from('user_profiles')
        .select(
          `
          *,
          user_organization_memberships!inner(
            organization_id
          )
        `
        )
        .eq('id', id)
        .eq('user_organization_memberships.organization_id', user.organizationId)
        .single();

      if (!existingUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Delete organization membership
      const { error: membershipError } = await supabase
        .from('user_organization_memberships')
        .delete()
        .eq('user_id', id)
        .eq('organization_id', user.organizationId);

      if (membershipError) {
        console.error('Error deleting user membership:', membershipError);
        return res.status(500).json({ error: 'Failed to delete user membership' });
      }

      // Check if user has memberships in other organizations
      const { data: otherMemberships } = await supabase
        .from('user_organization_memberships')
        .select('id')
        .eq('user_id', id);

      // If no other memberships, delete the user profile and auth account
      if (!otherMemberships || otherMemberships.length === 0) {
        // Delete user profile
        const { error: profileError } = await supabase.from('user_profiles').delete().eq('id', id);

        if (profileError) {
          console.error('Error deleting user profile:', profileError);
        }

        // Delete auth user
        const { error: authError } = await supabase.auth.admin.deleteUser(id);
        if (authError) {
          console.error('Error deleting auth user:', authError);
        }
      }

      // Log user deletion
      await SecurityMonitoring.logSecurityEvent(
        SecurityEventType.USER_MANAGEMENT,
        'user_deleted',
        {
          action: 'delete',
          deletedUserId: id,
          email: existingUser.email,
          fullDeletion: !otherMemberships || otherMemberships.length === 0
        },
        user.id,
        req.ip,
        req.get('User-Agent')
      );

      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * Get Organization Settings
 * GET /api/admin/organization
 */
router.get(
  '/organization',
  SecurityMiddleware.createSecurityMiddleware({
    authentication: {
      required: true,
      permissions: ['admin:organization:read']
    }
  }),
  async (req: express.Request, res: express.Response) => {
    try {
      const user = (req as any).user;

      const { data: organization, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', user.organizationId)
        .single();

      if (error) {
        console.error('Error fetching organization:', error);
        return res.status(500).json({ error: 'Failed to fetch organization settings' });
      }

      // Log organization settings access
      await SecurityMonitoring.logSecurityEvent(
        SecurityEventType.DATA_ACCESS,
        'organization_settings',
        { action: 'view' },
        user.id,
        req.ip,
        req.get('User-Agent')
      );

      res.json({ organization });
    } catch (error) {
      console.error('Get organization error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * Update Organization Settings
 * PUT /api/admin/organization
 */
router.put(
  '/organization',
  SecurityMiddleware.createSecurityMiddleware({
    authentication: {
      required: true,
      permissions: ['admin:organization:update']
    }
  }),
  async (req: express.Request, res: express.Response) => {
    try {
      const user = (req as any).user;

      // Validate input
      const validation = validateInput(req.body, {
        name: { required: false, type: 'string', maxLength: 100 },
        description: { required: false, type: 'string' },
        industry: { required: false, type: 'string', maxLength: 50 },
        size: {
          required: false,
          type: 'string',
          enum: ['startup', 'small', 'medium', 'large', 'enterprise']
        },
        website: { required: false, type: 'url' },
        phone: { required: false, type: 'string', maxLength: 20 },
        address: { required: false, type: 'object' },
        settings: { required: false, type: 'object' }
      });

      if (!validation.isValid) {
        return res.status(400).json({ error: 'Invalid input', details: validation.errors });
      }

      const updateData = { ...req.body };

      // Update organization
      const { data: organization, error } = await supabase
        .from('organizations')
        .update(updateData)
        .eq('id', user.organizationId)
        .select()
        .single();

      if (error) {
        console.error('Error updating organization:', error);
        return res.status(500).json({ error: 'Failed to update organization settings' });
      }

      // Log organization update
      await SecurityMonitoring.logSecurityEvent(
        SecurityEventType.CONFIGURATION_CHANGE,
        'organization_updated',
        {
          action: 'update',
          changes: Object.keys(updateData)
        },
        user.id,
        req.ip,
        req.get('User-Agent')
      );

      res.json({ organization });
    } catch (error) {
      console.error('Update organization error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * Get System Statistics
 * GET /api/admin/statistics
 */
router.get(
  '/statistics',
  SecurityMiddleware.createSecurityMiddleware({
    authentication: {
      required: true,
      permissions: ['admin:system:read']
    }
  }),
  async (req: express.Request, res: express.Response) => {
    try {
      const user = (req as any).user;

      // Get user statistics
      const { data: userStats } = await supabase
        .from('user_organization_memberships')
        .select('role, status')
        .eq('organization_id', user.organizationId);

      // Get compliance statistics
      const { data: complianceStats } = await supabase
        .from('compliance_frameworks')
        .select(
          `
          framework_type,
          is_active,
          compliance_controls(status)
        `
        )
        .eq('organization_id', user.organizationId);

      // Get security statistics
      const { data: securityStats } = await supabase
        .from('security_events')
        .select('event_type, severity, created_at')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      // Get audit statistics
      const { data: auditStats } = await supabase
        .from('audit_trail')
        .select('action, created_at')
        .eq('organization_id', user.organizationId)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      const statistics = {
        users: {
          total: userStats?.length || 0,
          byRole:
            userStats?.reduce((acc: any, user) => {
              acc[user.role] = (acc[user.role] || 0) + 1;
              return acc;
            }, {}) || {},
          byStatus:
            userStats?.reduce((acc: any, user) => {
              acc[user.status] = (acc[user.status] || 0) + 1;
              return acc;
            }, {}) || {}
        },
        compliance: {
          totalFrameworks: complianceStats?.length || 0,
          activeFrameworks: complianceStats?.filter(f => f.is_active).length || 0,
          totalControls:
            complianceStats?.reduce((sum, f) => sum + (f.compliance_controls?.length || 0), 0) || 0,
          implementedControls:
            complianceStats?.reduce(
              (sum, f) =>
                sum +
                (f.compliance_controls?.filter((c: any) => c.status === 'implemented').length || 0),
              0
            ) || 0
        },
        security: {
          totalEvents: securityStats?.length || 0,
          byType:
            securityStats?.reduce((acc: any, event) => {
              acc[event.event_type] = (acc[event.event_type] || 0) + 1;
              return acc;
            }, {}) || {},
          bySeverity:
            securityStats?.reduce((acc: any, event) => {
              acc[event.severity] = (acc[event.severity] || 0) + 1;
              return acc;
            }, {}) || {}
        },
        audit: {
          totalActions: auditStats?.length || 0,
          byAction:
            auditStats?.reduce((acc: any, audit) => {
              acc[audit.action] = (acc[audit.action] || 0) + 1;
              return acc;
            }, {}) || {}
        }
      };

      // Log statistics access
      await SecurityMonitoring.logSecurityEvent(
        SecurityEventType.DATA_ACCESS,
        'admin_statistics',
        { action: 'view' },
        user.id,
        req.ip,
        req.get('User-Agent')
      );

      res.json({ statistics });
    } catch (error) {
      console.error('Get statistics error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * Get System Logs
 * GET /api/admin/logs
 */
router.get(
  '/logs',
  SecurityMiddleware.createSecurityMiddleware({
    authentication: {
      required: true,
      permissions: ['admin:system:read']
    }
  }),
  async (req: express.Request, res: express.Response) => {
    try {
      const user = (req as any).user;
      const { log_type, severity, start_date, end_date, page = 1, limit = 100 } = req.query;

      let query = supabase.from('security_events').select(`
          *,
          user_profiles(first_name, last_name, email)
        `);

      // Apply filters
      if (log_type) {
        query = query.eq('event_type', log_type);
      }
      if (severity) {
        query = query.eq('severity', severity);
      }
      if (start_date) {
        query = query.gte('created_at', start_date as string);
      }
      if (end_date) {
        query = query.lte('created_at', end_date as string);
      }

      // Pagination
      const offset = (Number(page) - 1) * Number(limit);
      query = query.range(offset, offset + Number(limit) - 1);

      const { data: logs, error, count } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching logs:', error);
        return res.status(500).json({ error: 'Failed to fetch system logs' });
      }

      // Log system logs access
      await SecurityMonitoring.logSecurityEvent(
        SecurityEventType.DATA_ACCESS,
        'system_logs',
        {
          action: 'view',
          filters: { log_type, severity },
          count: logs?.length || 0
        },
        user.id,
        req.ip,
        req.get('User-Agent')
      );

      res.json({
        logs,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: count || 0,
          totalPages: Math.ceil((count || 0) / Number(limit))
        }
      });
    } catch (error) {
      console.error('Get logs error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * System Backup
 * POST /api/admin/backup
 */
router.post(
  '/backup',
  SecurityMiddleware.createSecurityMiddleware({
    authentication: {
      required: true,
      permissions: ['admin:system:backup']
    }
  }),
  async (req: express.Request, res: express.Response) => {
    try {
      const user = (req as any).user;

      // Validate input
      const validation = validateInput(req.body, {
        backup_type: {
          required: true,
          type: 'string',
          enum: ['full', 'incremental', 'compliance_data', 'user_data']
        },
        include_files: { required: false, type: 'boolean' },
        encryption: { required: false, type: 'boolean' }
      });

      if (!validation.isValid) {
        return res.status(400).json({ error: 'Invalid input', details: validation.errors });
      }

      const { backup_type, include_files, encryption } = req.body;

      // Create backup record
      const { data: backup, error } = await supabase
        .from('system_backups')
        .insert({
          backup_type,
          organization_id: user.organizationId,
          initiated_by: user.id,
          status: 'initiated',
          include_files: include_files || false,
          encryption: encryption || true,
          backup_size: 0
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating backup record:', error);
        return res.status(500).json({ error: 'Failed to initiate backup' });
      }

      // Log backup initiation
      await SecurityMonitoring.logSecurityEvent(
        SecurityEventType.SYSTEM_OPERATION,
        'backup_initiated',
        {
          action: 'backup',
          backupId: backup.id,
          backupType: backup_type,
          includeFiles: include_files,
          encryption
        },
        user.id,
        req.ip,
        req.get('User-Agent')
      );

      // In a real implementation, this would trigger an async backup process
      // For now, we'll just return the backup record
      res.status(202).json({
        backup,
        message: 'Backup initiated successfully'
      });
    } catch (error) {
      console.error('Backup error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;
