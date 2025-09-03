import type { User } from '@/contexts/AuthContext';
import { UserRole } from '@/types/user-api';

/**
 * Auth Guard Service
 *
 * Provides utility functions for authentication and authorization checks
 * Can be used outside of React components for programmatic auth checks
 */

export class AuthGuard {
  /**
   * Check if user has a specific role
   */
  static hasRole(user: User | null, role: string | string[]): boolean {
    if (!user?.role) return false;

    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(user.role);
  }

  /**
   * Check if user has specific permission(s)
   */
  static hasPermission(user: User | null, permission: string | string[]): boolean {
    if (!user?.role) return false;

    // Map roles to permissions
    const rolePermissions: Record<string, string[]> = {
      [UserRole.USER]: ['read', 'write'],
      [UserRole.MODERATOR]: ['read', 'write', 'moderate'],
      [UserRole.ADMIN]: ['read', 'write', 'moderate', 'admin', 'delete']
    };

    const userPermissions = rolePermissions[user.role] || [];
    const permissions = Array.isArray(permission) ? permission : [permission];
    return permissions.every(perm => userPermissions.includes(perm));
  }

  /**
   * Check if user has any of the specified permissions
   */
  static hasAnyPermission(user: User | null, permissions: string[]): boolean {
    if (!user?.role) return false;

    // Map roles to permissions
    const rolePermissions: Record<string, string[]> = {
      [UserRole.USER]: ['read', 'write'],
      [UserRole.MODERATOR]: ['read', 'write', 'moderate'],
      [UserRole.ADMIN]: ['read', 'write', 'moderate', 'admin', 'delete']
    };

    const userPermissions = rolePermissions[user.role] || [];
    return permissions.some(perm => userPermissions.includes(perm));
  }

  /**
   * Check if user's email is verified
   */
  static isEmailVerified(user: User | null): boolean {
    return user?.emailVerified === true;
  }

  /**
   * Check if user is admin
   */
  static isAdmin(user: User | null): boolean {
    return this.hasRole(user, UserRole.ADMIN);
  }

  /**
   * Check if user is moderator or admin
   */
  static isModerator(user: User | null): boolean {
    return this.hasRole(user, [UserRole.ADMIN, UserRole.MODERATOR]);
  }

  /**
   * Check if user can access a specific resource
   */
  static canAccess(
    user: User | null,
    resourcePermissions: {
      roles?: string[];
      permissions?: string[];
      requireEmailVerification?: boolean;
    }
  ): boolean {
    // Check email verification
    if (resourcePermissions.requireEmailVerification && !this.isEmailVerified(user)) {
      return false;
    }

    // Check roles
    if (resourcePermissions.roles && !this.hasRole(user, resourcePermissions.roles)) {
      return false;
    }

    // Check permissions
    if (
      resourcePermissions.permissions &&
      !this.hasPermission(user, resourcePermissions.permissions)
    ) {
      return false;
    }

    return true;
  }

  /**
   * Get user's display name
   */
  static getDisplayName(user: User | null): string {
    if (!user) return 'Anonymous';
    return (
      user.displayName ||
      `${user.firstName} ${user.lastName}`.trim() ||
      user.username ||
      user.email.split('@')[0] ||
      'User'
    );
  }

  /**
   * Get user's avatar URL or initials
   */
  static getAvatarInfo(user: User | null): { url?: string; initials: string } {
    if (!user) return { initials: 'AN' };

    const displayName = this.getDisplayName(user);
    const initials = displayName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();

    return {
      url: user.avatar_url,
      initials: initials || user.email.charAt(0).toUpperCase()
    };
  }

  /**
   * Check if session is expired (client-side check)
   */
  static isSessionExpired(expiresAt: string | Date): boolean {
    const expiry = new Date(expiresAt);
    return new Date() >= expiry;
  }

  /**
   * Get time until session expires
   */
  static getTimeUntilExpiry(expiresAt: string | Date): number {
    const expiry = new Date(expiresAt);
    const now = new Date();
    return Math.max(0, expiry.getTime() - now.getTime());
  }

  /**
   * Format time until expiry in human readable format
   */
  static formatTimeUntilExpiry(expiresAt: string | Date): string {
    const timeLeft = this.getTimeUntilExpiry(expiresAt);

    if (timeLeft <= 0) return 'Expired';

    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }

    return `${minutes}m`;
  }

  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength
   */
  static validatePassword(password: string): {
    isValid: boolean;
    errors: string[];
    strength: 'weak' | 'medium' | 'strong';
  } {
    const errors: string[] = [];
    let score = 0;

    // Length check
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    } else {
      score += 1;
    }

    // Uppercase check
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    } else {
      score += 1;
    }

    // Lowercase check
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    } else {
      score += 1;
    }

    // Number check
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    } else {
      score += 1;
    }

    // Special character check
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    } else {
      score += 1;
    }

    // Determine strength
    let strength: 'weak' | 'medium' | 'strong' = 'weak';
    if (score >= 4) strength = 'strong';
    else if (score >= 2) strength = 'medium';

    return {
      isValid: errors.length === 0,
      errors,
      strength
    };
  }

  /**
   * Generate secure random password
   */
  static generateSecurePassword(length = 12): string {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    const allChars = lowercase + uppercase + numbers + symbols;
    let password = '';

    // Ensure at least one character from each category
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    // Fill the rest randomly
    for (let i = 4; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password
    return password
      .split('')
      .sort(() => 0.5 - Math.random())
      .join('');
  }

  /**
   * Sanitize user data for safe storage
   */
  static sanitizeUserData(userData: any): Partial<User> {
    const allowedFields = [
      'id',
      'email',
      'name',
      'avatar_url',
      'jurisdiction',
      'role',
      'permissions',
      'lastLoginAt',
      'isEmailVerified'
    ];

    const sanitized: any = {};
    allowedFields.forEach(field => {
      if (userData[field] !== undefined) {
        sanitized[field] = userData[field];
      }
    });

    return sanitized;
  }
}

export default AuthGuard;
