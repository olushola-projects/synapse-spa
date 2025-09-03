import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthGuard } from '@/services/auth-guard';

/**
 * Enhanced auth hook that provides additional authentication utilities
 */
export const useAuthGuard = () => {
  const { user, isAuthenticated, isLoading, session } = useAuth();

  return useMemo(() => {
    const guard = {
      // Basic auth state
      user,
      isAuthenticated,
      isLoading,
      session,

      // Role checks
      hasRole: (role: string | string[]) => AuthGuard.hasRole(user, role),
      isAdmin: () => AuthGuard.isAdmin(user),
      isModerator: () => AuthGuard.isModerator(user),

      // Permission checks
      hasPermission: (permission: string | string[]) => AuthGuard.hasPermission(user, permission),
      hasAnyPermission: (permissions: string[]) => AuthGuard.hasAnyPermission(user, permissions),

      // User info
      isEmailVerified: () => AuthGuard.isEmailVerified(user),
      getDisplayName: () => AuthGuard.getDisplayName(user),
      getAvatarInfo: () => AuthGuard.getAvatarInfo(user),

      // Access control
      canAccess: (resourcePermissions: {
        roles?: string[];
        permissions?: string[];
        requireEmailVerification?: boolean;
      }) => AuthGuard.canAccess(user, resourcePermissions),

      // Session info
      getTimeUntilExpiry: () => (session ? AuthGuard.getTimeUntilExpiry(session.expires_at) : 0),
      formatTimeUntilExpiry: () =>
        session ? AuthGuard.formatTimeUntilExpiry(session.expires_at) : 'No session',
      isSessionExpired: () => (session ? AuthGuard.isSessionExpired(session.expires_at) : true),

      // Computed properties
      get canWrite() {
        return this.hasPermission('write');
      },

      get canDelete() {
        return this.hasPermission('delete');
      },

      get canAdmin() {
        return this.hasPermission('admin');
      },

      get userInitials() {
        return this.getAvatarInfo().initials;
      },

      get userAvatarUrl() {
        return this.getAvatarInfo().url;
      },

      get displayName() {
        return this.getDisplayName();
      },

      get isVerified() {
        return this.isEmailVerified();
      },

      get isExpired() {
        return this.isSessionExpired();
      },

      get timeLeft() {
        return this.formatTimeUntilExpiry();
      }
    };

    return guard;
  }, [user, isAuthenticated, isLoading, session]);
};

export default useAuthGuard;


