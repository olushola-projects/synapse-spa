import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { userApiService } from '@/services/user-api';
import { apiClient } from '@/lib/api-client';
import type {
  UserProfile,
  UserSession,
  CreateUserDto,
  LoginDto,
  ChangePasswordDto,
  AuthResult
} from '@/types/user-api';
import { UserRole } from '@/types/user-api';

// Define types for authentication
export interface User extends UserProfile {
  // Add any additional frontend-specific properties if needed
  displayName?: string;
  avatar_url?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface RegisterData {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  acceptTerms: boolean;
}

interface AuthState {
  user: User | null;
  session: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  // Authentication methods
  login: (credentials: LoginCredentials) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithLinkedIn: () => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;

  // Profile management
  updateProfile: (data: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;

  // Session management
  refreshSession: () => Promise<void>;
  checkSession: () => Promise<void>;
  getUserSessions: () => Promise<UserSession[]>;
  logoutAllSessions: () => Promise<void>;

  // Email verification
  resendVerificationEmail: () => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;

  // Password reset
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;

  // Utility methods
  clearError: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;

  // Route protection helpers
  redirectAfterLogin: string | null;
  setRedirectAfterLogin: (path: string | null) => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage keys
const STORAGE_KEYS = {
  USER: 'auth_user',
  REDIRECT: 'auth_redirect_after_login',
  REMEMBER_ME: 'auth_remember_me'
} as const;

// Permission mapping based on roles
const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  [UserRole.USER]: ['read', 'write'],
  [UserRole.MODERATOR]: ['read', 'write', 'moderate'],
  [UserRole.ADMIN]: ['read', 'write', 'moderate', 'admin', 'delete']
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Conditionally use router hooks only when available
  let navigate: ReturnType<typeof useNavigate> | null = null;
  let location: ReturnType<typeof useLocation> | null = null;

  try {
    navigate = useNavigate();
    location = useLocation();
  } catch (error) {
    // Router hooks not available - this is fine, we'll handle navigation differently
    console.warn(
      'Router hooks not available in AuthProvider. Navigation features will be limited.'
    );
  }

  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState<string | null>(null);

  // Derived state
  const isAuthenticated = !!user && !!session && !!apiClient.getAuthToken();

  // Helper function to create user with display name
  const enhanceUser = useCallback((userProfile: UserProfile): User => {
    return {
      ...userProfile,
      displayName:
        `${userProfile.firstName} ${userProfile.lastName}`.trim() || userProfile.username,
      avatar_url: userProfile.metadata?.avatar_url
    };
  }, []);

  // Save user to storage
  const saveUser = useCallback((userData: User, rememberMe = false) => {
    if (rememberMe) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'true');
    } else {
      sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
    }
    setUser(userData);
  }, []);

  // Clear user from storage
  const clearUser = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
    sessionStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
    setSession(null);
    apiClient.clearAuthToken();
  }, []);

  // Load user from storage and validate session
  const loadSession = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      // Check if we have a token
      const token = apiClient.getAuthToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      // Try to get current user from API to validate session
      const userProfile = await userApiService.getCurrentUser();
      const enhancedUser = enhanceUser(userProfile);
      setUser(enhancedUser);

      // Create a mock session object since we don't get it from the API
      const mockSession: UserSession = {
        id: 'current-session',
        userId: userProfile.id,
        token,
        isActive: true,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setSession(mockSession);
    } catch (error) {
      console.error('Session validation failed:', error);
      clearUser();
    } finally {
      setIsLoading(false);
    }
  }, [enhanceUser, clearUser]);

  // Authentication methods
  const login = useCallback(
    async (credentials: LoginCredentials): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const loginData: LoginDto = {
          email: credentials.email,
          password: credentials.password
        };

        const authResult: AuthResult = await userApiService.login(loginData);

        // Set auth token in API client
        apiClient.setAuthToken(authResult.token, credentials.rememberMe);

        // Enhance user and save
        const enhancedUser = enhanceUser(authResult.user);
        saveUser(enhancedUser, credentials.rememberMe);
        setSession(authResult.session);

        toast({
          title: 'Login Successful',
          description: `Welcome back, ${enhancedUser.displayName}!`
        });

        // Handle redirect after login
        const redirect =
          redirectAfterLogin || localStorage.getItem(STORAGE_KEYS.REDIRECT) || '/dashboard';

        localStorage.removeItem(STORAGE_KEYS.REDIRECT);
        setRedirectAfterLogin(null);

        navigate?.(redirect, { replace: true });
      } catch (err: any) {
        const errorMessage = err?.message || 'Login failed';
        setError(errorMessage);
        toast({
          title: 'Login Failed',
          description: errorMessage,
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    },
    [enhanceUser, saveUser, redirectAfterLogin, navigate]
  );

  const loginWithGoogle = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // For now, show that social login is not implemented
      toast({
        title: 'Google Login',
        description: 'Google login will be implemented when OAuth is configured on the backend.',
        variant: 'default'
      });
    } catch (err: any) {
      const errorMessage = err?.message || 'Google login failed';
      setError(errorMessage);
      toast({
        title: 'Google Login Failed',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithLinkedIn = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // For now, show that social login is not implemented
      toast({
        title: 'LinkedIn Login',
        description: 'LinkedIn login will be implemented when OAuth is configured on the backend.',
        variant: 'default'
      });
    } catch (err: any) {
      const errorMessage = err?.message || 'LinkedIn login failed';
      setError(errorMessage);
      toast({
        title: 'LinkedIn Login Failed',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      // Call logout API
      await userApiService.logout();

      clearUser();
      setRedirectAfterLogin(null);
      localStorage.removeItem(STORAGE_KEYS.REDIRECT);

      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.'
      });

      navigate?.('/login', { replace: true });
    } catch (err) {
      console.error('Logout error:', err);
      // Even if API call fails, clear local state
      clearUser();
      navigate?.('/login', { replace: true });
    } finally {
      setIsLoading(false);
    }
  }, [clearUser, navigate]);

  const register = useCallback(
    async (data: RegisterData): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        if (!data.acceptTerms) {
          throw new Error('You must accept the terms and conditions');
        }

        const createUserData: CreateUserDto = {
          email: data.email,
          username: data.username,
          firstName: data.firstName,
          lastName: data.lastName,
          password: data.password
        };

        const userProfile = await userApiService.register(createUserData);
        const enhancedUser = enhanceUser(userProfile);

        toast({
          title: 'Registration Successful',
          description: `Welcome to Synapse, ${enhancedUser.displayName}! Please check your email for verification.`
        });

        // Redirect to login page for user to login with new credentials
        navigate?.('/login', { replace: true });
      } catch (err: any) {
        const errorMessage = err?.message || 'Registration failed';
        setError(errorMessage);
        toast({
          title: 'Registration Failed',
          description: errorMessage,
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    },
    [enhanceUser, navigate]
  );

  // Profile management
  const updateProfile = useCallback(
    async (data: Partial<User>): Promise<void> => {
      if (!user) throw new Error('No user logged in');

      setIsLoading(true);
      setError(null);

      try {
        const updateData: any = {};
        if (data.username) updateData.username = data.username;
        if (data.firstName) updateData.firstName = data.firstName;
        if (data.lastName) updateData.lastName = data.lastName;
        if (data.metadata) updateData.metadata = data.metadata;

        const updatedProfile = await userApiService.updateProfile(updateData);
        const enhancedUser = enhanceUser(updatedProfile);

        const rememberMe = localStorage.getItem(STORAGE_KEYS.REMEMBER_ME) === 'true';
        saveUser(enhancedUser, rememberMe);

        toast({
          title: 'Profile Updated',
          description: 'Your profile has been successfully updated.'
        });
      } catch (err: any) {
        const errorMessage = err?.message || 'Failed to update profile';
        setError(errorMessage);
        toast({
          title: 'Update Failed',
          description: errorMessage,
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    },
    [user, enhanceUser, saveUser]
  );

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const changePasswordData: ChangePasswordDto = {
          currentPassword,
          newPassword
        };

        await userApiService.changePassword(changePasswordData);

        toast({
          title: 'Password Changed',
          description: 'Your password has been successfully changed.'
        });
      } catch (err: any) {
        const errorMessage = err?.message || 'Failed to change password';
        setError(errorMessage);
        toast({
          title: 'Password Change Failed',
          description: errorMessage,
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Session management
  const refreshSession = useCallback(async (): Promise<void> => {
    try {
      // Get current user to refresh session data
      const userProfile = await userApiService.getCurrentUser();
      const enhancedUser = enhanceUser(userProfile);

      const rememberMe = localStorage.getItem(STORAGE_KEYS.REMEMBER_ME) === 'true';
      saveUser(enhancedUser, rememberMe);

      toast({
        title: 'Session Refreshed',
        description: 'Your session has been refreshed.'
      });
    } catch (err) {
      console.error('Session refresh failed:', err);
      clearUser();
      navigate?.('/login', { replace: true });
    }
  }, [enhanceUser, saveUser, clearUser, navigate]);

  const checkSession = useCallback(async (): Promise<void> => {
    try {
      await userApiService.getCurrentUser();
    } catch (err) {
      console.error('Session check failed:', err);
      clearUser();
      toast({
        title: 'Session Expired',
        description: 'Please log in again.',
        variant: 'destructive'
      });
      navigate?.('/login', { replace: true });
    }
  }, [clearUser, navigate]);

  const getUserSessions = useCallback(async (): Promise<UserSession[]> => {
    return userApiService.getUserSessions();
  }, []);

  const logoutAllSessions = useCallback(async (): Promise<void> => {
    try {
      await userApiService.logoutAll();
      clearUser();

      toast({
        title: 'All Sessions Logged Out',
        description: 'You have been logged out from all devices.'
      });

      navigate?.('/login', { replace: true });
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to logout all sessions';
      setError(errorMessage);
      toast({
        title: 'Logout Failed',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  }, [clearUser, navigate]);

  // Email verification
  const resendVerificationEmail = useCallback(async (): Promise<void> => {
    try {
      await userApiService.resendVerificationEmail();
      toast({
        title: 'Verification Email Sent',
        description: 'Please check your email for the verification link.'
      });
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to send verification email';
      setError(errorMessage);
      toast({
        title: 'Failed to Send Email',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  }, []);

  const verifyEmail = useCallback(
    async (token: string): Promise<void> => {
      try {
        await userApiService.verifyEmail(token);

        // Refresh user data to get updated email verification status
        if (user) {
          const userProfile = await userApiService.getCurrentUser();
          const enhancedUser = enhanceUser(userProfile);
          const rememberMe = localStorage.getItem(STORAGE_KEYS.REMEMBER_ME) === 'true';
          saveUser(enhancedUser, rememberMe);
        }

        toast({
          title: 'Email Verified',
          description: 'Your email has been successfully verified.'
        });
      } catch (err: any) {
        const errorMessage = err?.message || 'Email verification failed';
        setError(errorMessage);
        toast({
          title: 'Verification Failed',
          description: errorMessage,
          variant: 'destructive'
        });
      }
    },
    [user, enhanceUser, saveUser]
  );

  // Password reset
  const forgotPassword = useCallback(async (email: string): Promise<void> => {
    try {
      await userApiService.forgotPassword({ email });
      toast({
        title: 'Password Reset Email Sent',
        description: 'If the email exists, a password reset link has been sent.'
      });
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to send password reset email';
      setError(errorMessage);
      toast({
        title: 'Failed to Send Email',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  }, []);

  const resetPassword = useCallback(
    async (token: string, newPassword: string): Promise<void> => {
      try {
        await userApiService.resetPassword({ token, newPassword });
        toast({
          title: 'Password Reset Successful',
          description: 'Your password has been reset. Please log in with your new password.'
        });
        navigate?.('/login', { replace: true });
      } catch (err: any) {
        const errorMessage = err?.message || 'Password reset failed';
        setError(errorMessage);
        toast({
          title: 'Reset Failed',
          description: errorMessage,
          variant: 'destructive'
        });
      }
    },
    [navigate]
  );

  // Utility methods
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!user?.role) return false;
      const rolePermissions = ROLE_PERMISSIONS[user.role] || [];
      return rolePermissions.includes(permission);
    },
    [user]
  );

  const hasRole = useCallback(
    (role: string): boolean => {
      return user?.role === role;
    },
    [user]
  );

  // Initialize auth on mount
  useEffect(() => {
    loadSession();
  }, [loadSession]);

  // Auto-check session every hour
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(
      () => {
        checkSession();
      },
      60 * 60 * 1000
    ); // 1 hour

    return () => clearInterval(interval);
  }, [isAuthenticated, checkSession]);

  // Set redirect path from location state
  useEffect(() => {
    if (location?.state?.from?.pathname) {
      const from = location.state.from.pathname;
      if (from && from !== '/login' && from !== '/register') {
        setRedirectAfterLogin(from);
      }
    }
  }, [location?.state]);

  const contextValue: AuthContextType = {
    // State
    user,
    session,
    isAuthenticated,
    isLoading,
    error,

    // Authentication methods
    login,
    loginWithGoogle,
    loginWithLinkedIn,
    logout,
    register,

    // Profile management
    updateProfile,
    changePassword,

    // Session management
    refreshSession,
    checkSession,
    getUserSessions,
    logoutAllSessions,

    // Email verification
    resendVerificationEmail,
    verifyEmail,

    // Password reset
    forgotPassword,
    resetPassword,

    // Utility methods
    clearError,
    hasPermission,
    hasRole,

    // Route protection helpers
    redirectAfterLogin,
    setRedirectAfterLogin
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// Custom hook for using auth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
