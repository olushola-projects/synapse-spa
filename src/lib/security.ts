/**
 * Security Library
 *
 * Re-exports security utilities from utils and provides additional security functions
 */

import bcrypt from 'bcrypt';
import crypto from 'crypto';

export * from '../utils/security';
export { SecurityUtils } from '../utils/security';

// Additional security interfaces and functions for backend use
export interface SecurityContext {
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  permissions?: string[];
}

export interface PermissionCheck {
  resource: string;
  action: string;
  context?: Record<string, any>;
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Verify a password against its hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

/**
 * Generate a secure random token
 */
export function generateSecureToken(length = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Generate a secure session token
 */
export function generateSessionToken(): string {
  return generateSecureToken(64);
}

/**
 * Generate a secure refresh token
 */
export function generateRefreshToken(): string {
  return generateSecureToken(64);
}

export interface TokenPayload {
  sub: string;
  iat: number;
  exp: number;
  scope?: string[];
}

export interface SecurityEvent {
  type: 'auth' | 'access' | 'error' | 'security';
  userId?: string;
  action: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

/**
 * Check if user has required permissions
 */
export function hasPermission(userPermissions: string[], requiredPermission: string): boolean {
  return userPermissions.includes(requiredPermission) || userPermissions.includes('*');
}

/**
 * Check if user has all required permissions
 */
export function hasAllPermissions(
  userPermissions: string[],
  requiredPermissions: string[]
): boolean {
  return requiredPermissions.every(permission => hasPermission(userPermissions, permission));
}

/**
 * Check if user has any of the required permissions
 */
export function hasAnyPermission(
  userPermissions: string[],
  requiredPermissions: string[]
): boolean {
  return requiredPermissions.some(permission => hasPermission(userPermissions, permission));
}

/**
 * Creates a security context for a user session
 * @param userId - User identifier
 * @param sessionId - Session identifier
 * @param permissions - User permissions
 * @returns Security context object
 */
export const createSecurityContext = (
  userId: string,
  sessionId: string,
  permissions: string[] = []
): SecurityContext => {
  return {
    userId,
    sessionId,
    permissions,
    lastActivity: Date.now()
  };
};

/**
 * Validates a security context
 * @param context - Security context to validate
 * @returns True if context is valid
 */
export const validateSecurityContext = (context: SecurityContext): boolean => {
  if (!context.userId || !context.sessionId) {
    return false;
  }

  // Check if session is still active (within last hour)
  const oneHour = 60 * 60 * 1000;
  const isActive = context.lastActivity && Date.now() - context.lastActivity < oneHour;

  return Boolean(isActive);
};
