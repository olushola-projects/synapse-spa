// Authentication and Authorization Library
// Comprehensive auth implementation for Synapses GRC Platform

import { createClient } from '@supabase/supabase-js';
import { hashPassword, verifyPassword, generateSecureToken } from './security';

// Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  organization?: string;
  role: UserRole;
  permissions: Permission[];
  isActive: boolean;
  lastLogin?: Date;
  mfaEnabled: boolean;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  refreshToken: string;
  expiresAt: Date;
  createdAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  COMPLIANCE_MANAGER = 'compliance_manager',
  AUDITOR = 'auditor',
  USER = 'user',
  VIEWER = 'viewer'
}

export enum Permission {
  // User management
  CREATE_USER = 'create_user',
  READ_USER = 'read_user',
  UPDATE_USER = 'update_user',
  DELETE_USER = 'delete_user',

  // Compliance management
  CREATE_COMPLIANCE_FRAMEWORK = 'create_compliance_framework',
  READ_COMPLIANCE_FRAMEWORK = 'read_compliance_framework',
  UPDATE_COMPLIANCE_FRAMEWORK = 'update_compliance_framework',
  DELETE_COMPLIANCE_FRAMEWORK = 'delete_compliance_framework',

  // Audit management
  CREATE_AUDIT = 'create_audit',
  READ_AUDIT = 'read_audit',
  UPDATE_AUDIT = 'update_audit',
  DELETE_AUDIT = 'delete_audit',

  // Risk management
  CREATE_RISK_ASSESSMENT = 'create_risk_assessment',
  READ_RISK_ASSESSMENT = 'read_risk_assessment',
  UPDATE_RISK_ASSESSMENT = 'update_risk_assessment',
  DELETE_RISK_ASSESSMENT = 'delete_risk_assessment',

  // Reporting
  GENERATE_REPORTS = 'generate_reports',
  VIEW_ANALYTICS = 'view_analytics',
  EXPORT_DATA = 'export_data',

  // System administration
  MANAGE_SYSTEM_SETTINGS = 'manage_system_settings',
  VIEW_SYSTEM_LOGS = 'view_system_logs',
  MANAGE_INTEGRATIONS = 'manage_integrations'
}

// Role-based permissions mapping
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.SUPER_ADMIN]: Object.values(Permission),
  [UserRole.ADMIN]: [
    Permission.CREATE_USER,
    Permission.READ_USER,
    Permission.UPDATE_USER,
    Permission.CREATE_COMPLIANCE_FRAMEWORK,
    Permission.READ_COMPLIANCE_FRAMEWORK,
    Permission.UPDATE_COMPLIANCE_FRAMEWORK,
    Permission.CREATE_AUDIT,
    Permission.READ_AUDIT,
    Permission.UPDATE_AUDIT,
    Permission.CREATE_RISK_ASSESSMENT,
    Permission.READ_RISK_ASSESSMENT,
    Permission.UPDATE_RISK_ASSESSMENT,
    Permission.GENERATE_REPORTS,
    Permission.VIEW_ANALYTICS,
    Permission.EXPORT_DATA,
    Permission.VIEW_SYSTEM_LOGS
  ],
  [UserRole.COMPLIANCE_MANAGER]: [
    Permission.READ_USER,
    Permission.CREATE_COMPLIANCE_FRAMEWORK,
    Permission.READ_COMPLIANCE_FRAMEWORK,
    Permission.UPDATE_COMPLIANCE_FRAMEWORK,
    Permission.CREATE_AUDIT,
    Permission.READ_AUDIT,
    Permission.UPDATE_AUDIT,
    Permission.CREATE_RISK_ASSESSMENT,
    Permission.READ_RISK_ASSESSMENT,
    Permission.UPDATE_RISK_ASSESSMENT,
    Permission.GENERATE_REPORTS,
    Permission.VIEW_ANALYTICS,
    Permission.EXPORT_DATA
  ],
  [UserRole.AUDITOR]: [
    Permission.READ_USER,
    Permission.READ_COMPLIANCE_FRAMEWORK,
    Permission.CREATE_AUDIT,
    Permission.READ_AUDIT,
    Permission.UPDATE_AUDIT,
    Permission.READ_RISK_ASSESSMENT,
    Permission.GENERATE_REPORTS,
    Permission.VIEW_ANALYTICS
  ],
  [UserRole.USER]: [
    Permission.READ_COMPLIANCE_FRAMEWORK,
    Permission.READ_AUDIT,
    Permission.READ_RISK_ASSESSMENT,
    Permission.VIEW_ANALYTICS
  ],
  [UserRole.VIEWER]: [
    Permission.READ_COMPLIANCE_FRAMEWORK,
    Permission.READ_AUDIT,
    Permission.READ_RISK_ASSESSMENT
  ]
};

// Authentication service
export class AuthService {
  private _supabase: any = null;
  private sessions: Map<string, Session> = new Map();

  constructor() {
    // Supabase client will be initialized lazily
  }

  private get supabase() {
    if (!this._supabase) {
      this._supabase = createClient(
        process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '',
        process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''
      );
    }
    return this._supabase;
  }

  // User registration
  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    organization?: string;
  }): Promise<{ user: User; session: Session }> {
    try {
      // Check if user already exists
      const existingUser = await this.getUserByEmail(userData.email);
      if (existingUser) {
        throw new Error('User already exists');
      }

      // Hash password
      const hashedPassword = await hashPassword(userData.password);

      // Create user in Supabase
      const { data: authData, error: authError } = await this.supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            organization: userData.organization
          }
        }
      });

      if (authError) {
        throw authError;
      }

      // Create user profile
      const user: User = {
        id: authData.user!.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        organization: userData.organization,
        role: UserRole.USER, // Default role
        permissions: ROLE_PERMISSIONS[UserRole.USER],
        isActive: true,
        mfaEnabled: false,
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Store user profile in database
      const { error: profileError } = await this.supabase.from('user_profiles').insert({
        id: user.id,
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
        organization: user.organization,
        role: user.role,
        permissions: user.permissions,
        is_active: user.isActive,
        mfa_enabled: user.mfaEnabled,
        email_verified: user.emailVerified
      });

      if (profileError) {
        throw profileError;
      }

      // Create session
      const session = await this.createSession(user.id);

      return { user, session };
    } catch (error) {
      throw new Error(`Registration failed: ${error}`);
    }
  }

  // User login
  async login(
    email: string,
    password: string,
    rememberMe = false
  ): Promise<{ user: User; session: Session }> {
    try {
      // Authenticate with Supabase
      const { data: authData, error: authError } = await this.supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        throw authError;
      }

      // Get user profile
      const user = await this.getUserById(authData.user!.id);
      if (!user) {
        throw new Error('User profile not found');
      }

      if (!user.isActive) {
        throw new Error('Account is deactivated');
      }

      // Update last login
      await this.updateLastLogin(user.id);

      // Create session
      const sessionDuration = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 30 days or 1 day
      const session = await this.createSession(user.id, sessionDuration);

      return { user, session };
    } catch (error) {
      throw new Error(`Login failed: ${error}`);
    }
  }

  // Logout
  async logout(sessionToken: string): Promise<void> {
    try {
      // Remove session from memory
      this.sessions.delete(sessionToken);

      // Sign out from Supabase
      await this.supabase.auth.signOut();

      // Remove session from database
      await this.supabase.from('user_sessions').delete().eq('token', sessionToken);
    } catch (error) {
      throw new Error(`Logout failed: ${error}`);
    }
  }

  // Validate session
  async validateSession(sessionToken: string): Promise<User | null> {
    try {
      // Check memory cache first
      const cachedSession = this.sessions.get(sessionToken);
      if (cachedSession && cachedSession.expiresAt > new Date()) {
        return await this.getUserById(cachedSession.userId);
      }

      // Check database
      const { data: sessionData, error } = await this.supabase
        .from('user_sessions')
        .select('*')
        .eq('token', sessionToken)
        .single();

      if (error || !sessionData) {
        return null;
      }

      const session: Session = {
        id: sessionData.id,
        userId: sessionData.user_id,
        token: sessionData.token,
        refreshToken: sessionData.refresh_token,
        expiresAt: new Date(sessionData.expires_at),
        createdAt: new Date(sessionData.created_at),
        ipAddress: sessionData.ip_address,
        userAgent: sessionData.user_agent
      };

      // Check if session is expired
      if (session.expiresAt <= new Date()) {
        await this.deleteSession(sessionToken);
        return null;
      }

      // Cache session
      this.sessions.set(sessionToken, session);

      return await this.getUserById(session.userId);
    } catch (error) {
      console.error('Session validation error:', error);
      return null;
    }
  }

  // Check user permissions
  hasPermission(user: User, permission: Permission): boolean {
    return user.permissions.includes(permission);
  }

  // Check multiple permissions (user must have ALL)
  hasAllPermissions(user: User, permissions: Permission[]): boolean {
    return permissions.every(permission => user.permissions.includes(permission));
  }

  // Check multiple permissions (user must have ANY)
  hasAnyPermission(user: User, permissions: Permission[]): boolean {
    return permissions.some(permission => user.permissions.includes(permission));
  }

  // Update user role
  async updateUserRole(userId: string, newRole: UserRole): Promise<void> {
    try {
      const newPermissions = ROLE_PERMISSIONS[newRole];

      const { error } = await this.supabase
        .from('user_profiles')
        .update({
          role: newRole,
          permissions: newPermissions,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        throw error;
      }
    } catch (error) {
      throw new Error(`Failed to update user role: ${error}`);
    }
  }

  // Private helper methods
  private async createSession(
    userId: string,
    duration: number = 24 * 60 * 60 * 1000
  ): Promise<Session> {
    const token = generateSecureToken(32);
    const refreshToken = generateSecureToken(32);
    const expiresAt = new Date(Date.now() + duration);

    const session: Session = {
      id: generateSecureToken(16),
      userId,
      token,
      refreshToken,
      expiresAt,
      createdAt: new Date()
    };

    // Store in database
    const { error } = await this.supabase.from('user_sessions').insert({
      id: session.id,
      user_id: session.userId,
      token: session.token,
      refresh_token: session.refreshToken,
      expires_at: session.expiresAt.toISOString(),
      created_at: session.createdAt.toISOString()
    });

    if (error) {
      throw error;
    }

    // Cache in memory
    this.sessions.set(token, session);

    return session;
  }

  private async deleteSession(sessionToken: string): Promise<void> {
    this.sessions.delete(sessionToken);
    await this.supabase.from('user_sessions').delete().eq('token', sessionToken);
  }

  private async getUserById(userId: string): Promise<User | null> {
    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) {
        return null;
      }

      return {
        id: data.id,
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
        organization: data.organization,
        role: data.role,
        permissions: data.permissions,
        isActive: data.is_active,
        lastLogin: data.last_login ? new Date(data.last_login) : undefined,
        mfaEnabled: data.mfa_enabled,
        emailVerified: data.email_verified,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }

  private async getUserByEmail(email: string): Promise<User | null> {
    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !data) {
        return null;
      }

      return {
        id: data.id,
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
        organization: data.organization,
        role: data.role,
        permissions: data.permissions,
        isActive: data.is_active,
        lastLogin: data.last_login ? new Date(data.last_login) : undefined,
        mfaEnabled: data.mfa_enabled,
        emailVerified: data.email_verified,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (error) {
      console.error('Error fetching user by email:', error);
      return null;
    }
  }

  private async updateLastLogin(userId: string): Promise<void> {
    await this.supabase
      .from('user_profiles')
      .update({ last_login: new Date().toISOString() })
      .eq('id', userId);
  }
}

// Export singleton instance
export const authService = new AuthService();

// Authentication middleware for API routes
export const requireAuth = (requiredPermissions?: Permission[]) => {
  return async (req: any, res: any, next: any) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const token = authHeader.substring(7);
      const user = await authService.validateSession(token);

      if (!user) {
        return res.status(401).json({ error: 'Invalid or expired session' });
      }

      if (requiredPermissions && requiredPermissions.length > 0) {
        if (!authService.hasAllPermissions(user, requiredPermissions)) {
          return res.status(403).json({ error: 'Insufficient permissions' });
        }
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(500).json({ error: 'Authentication error' });
    }
  };
};
