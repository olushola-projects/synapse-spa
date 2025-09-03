/**
 * Enhanced ProtectedRoute Component
 *
 * A comprehensive higher-order component that protects routes from unauthorized access.
 * Supports role-based access control, permission checking, and flexible authentication requirements.
 */

import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

/**
 * Props for the ProtectedRoute component
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: string | string[];
  requiredPermissions?: string | string[];
  requireEmailVerification?: boolean;
  fallbackPath?: string;
  loadingComponent?: React.ReactNode;
  unauthorizedComponent?: React.ReactNode;
}

/**
 * Default loading component
 */
const DefaultLoadingComponent: React.FC = () => (
  <div className='min-h-screen flex items-center justify-center'>
    <Card className='w-96'>
      <CardContent className='flex flex-col items-center justify-center p-8 space-y-4'>
        <Loader2 className='h-8 w-8 animate-spin' />
        <p className='text-lg font-medium'>Loading...</p>
        <p className='text-sm text-muted-foreground'>Checking authentication status</p>
      </CardContent>
    </Card>
  </div>
);

/**
 * Default unauthorized component
 */
const DefaultUnauthorizedComponent: React.FC<{ message: string }> = ({ message }) => (
  <div className='min-h-screen flex items-center justify-center'>
    <Card className='w-96'>
      <CardContent className='flex flex-col items-center justify-center p-8 space-y-4'>
        <div className='h-16 w-16 bg-destructive/20 rounded-full flex items-center justify-center'>
          <span className='text-2xl'>🚫</span>
        </div>
        <h1 className='text-xl font-semibold'>Access Denied</h1>
        <p className='text-sm text-muted-foreground text-center'>{message}</p>
      </CardContent>
    </Card>
  </div>
);

/**
 * Enhanced ProtectedRoute component with role-based access control
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requiredRole,
  requiredPermissions,
  requireEmailVerification = false,
  fallbackPath = '/login',
  loadingComponent,
  unauthorizedComponent
}) => {
  const { user, isAuthenticated, isLoading, hasRole, hasPermission, setRedirectAfterLogin } =
    useAuth();
  const location = useLocation();

  // Store the attempted URL for redirecting after login
  useEffect(() => {
    if (!isAuthenticated && requireAuth) {
      setRedirectAfterLogin(location.pathname + location.search);
    }
  }, [isAuthenticated, location.pathname, location.search, requireAuth, setRedirectAfterLogin]);

  // Show loading state while checking authentication
  if (isLoading) {
    return loadingComponent || <DefaultLoadingComponent />;
  }

  // Handle non-auth routes (login, register, etc.)
  if (!requireAuth) {
    // If user is authenticated but trying to access auth pages, redirect to dashboard
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      return <Navigate to={from} replace />;
    }
    // Allow access to non-auth routes
    return <>{children}</>;
  }

  // From here, authentication is required
  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check email verification requirement
  if (requireEmailVerification && !user?.isEmailVerified) {
    const message = 'Email verification required. Please check your email and verify your account.';
    return unauthorizedComponent || <DefaultUnauthorizedComponent message={message} />;
  }

  // Check role requirements
  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    const hasRequiredRole = roles.some(role => hasRole(role));

    if (!hasRequiredRole) {
      const message = `This page requires ${Array.isArray(requiredRole) ? 'one of these roles' : 'the role'}: ${roles.join(', ')}`;
      return unauthorizedComponent || <DefaultUnauthorizedComponent message={message} />;
    }
  }

  // Check permission requirements
  if (requiredPermissions) {
    const permissions = Array.isArray(requiredPermissions)
      ? requiredPermissions
      : [requiredPermissions];
    const hasRequiredPermissions = permissions.every(permission => hasPermission(permission));

    if (!hasRequiredPermissions) {
      const message = `You don't have the required permissions: ${permissions.join(', ')}`;
      return unauthorizedComponent || <DefaultUnauthorizedComponent message={message} />;
    }
  }

  // All checks passed, render the protected content
  return <>{children}</>;
};

/**
 * Convenience wrapper components for common use cases
 */
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRole='admin'>{children}</ProtectedRoute>
);

export const ModeratorRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRole={['admin', 'moderator']}>{children}</ProtectedRoute>
);

export const VerifiedUserRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requireEmailVerification>{children}</ProtectedRoute>
);

export const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requireAuth={false}>{children}</ProtectedRoute>
);

export default ProtectedRoute;
