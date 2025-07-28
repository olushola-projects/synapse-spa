/**
 * ProtectedRoute Component
 *
 * A higher-order component that protects routes from unauthorized access.
 * Redirects unauthenticated users to the login page.
 * Provides consistent route protection across the application.
 */

import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SecurityUtils from '../utils/security';

/**
 * Props for the ProtectedRoute component
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

/**
 * ProtectedRoute component that ensures users are authenticated
 * before allowing access to protected routes
 *
 * @param children - The child components to render if authenticated
 * @param requireAuth - Whether authentication is required (default: true)
 * @returns The protected route component
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAuth = true }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Store the attempted URL for redirecting after login
  useEffect(() => {
    if (!isAuthenticated && requireAuth) {
      // Save the current path to redirect back after login
      SecurityUtils.storage.set('redirectPath', location.pathname);
    }
  }, [isAuthenticated, location.pathname, requireAuth]);

  // If authentication is required but user is not authenticated, redirect to login
  if (requireAuth && !isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  // If user is authenticated but this is a non-auth route (like login/register), redirect to dashboard
  if (!requireAuth && isAuthenticated) {
    return <Navigate to='/dashboard' replace />;
  }

  // If all checks pass, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
