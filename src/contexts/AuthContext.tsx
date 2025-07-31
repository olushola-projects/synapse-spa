import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { handleAuthError } from '@/utils/error-handler';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { SecurityUtils } from '@/utils/security';

// Define types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  jurisdiction?: string[];
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

// interface AuthError {
//   message: string;
//   code?: string;
// }
// AuthError interface removed - not used in this context

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithLinkedIn: () => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  error: string | null;
  clearError: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Set up Supabase auth state listener
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        setSession(session);
        
        if (session?.user) {
          // Fetch user profile from profiles table
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile && !error) {
            setUser({
              id: profile.id,
              email: session.user.email || '',
              name: profile.name,
              avatar_url: profile.avatar_url || undefined,
              jurisdiction: profile.jurisdiction || undefined
            });
          } else {
            // Create profile if it doesn't exist
            if (session.user.email) {
              const newProfile = {
                id: session.user.id,
                name: session.user.user_metadata?.name || session.user.email.split('@')[0],
                avatar_url: null,
                jurisdiction: []
              };

              const { error: insertError } = await supabase
                .from('profiles')
                .insert([newProfile]);

              if (!insertError) {
                setUser({
                  id: session.user.id,
                  email: session.user.email,
                  name: newProfile.name,
                  avatar_url: undefined,
                  jurisdiction: newProfile.jurisdiction
                });
              }
            }
          }
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Helper function to validate email
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Login function with Supabase
  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      setError(null);

      // Validate and sanitize input
      if (!credentials.email || !credentials.password) {
        throw new Error('Email and password are required');
      }

      const sanitizedEmail = SecurityUtils.sanitizeInput(credentials.email.trim());
      
      if (!isValidEmail(sanitizedEmail)) {
        throw new Error('Please enter a valid email address');
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password: credentials.password
      });

      if (signInError) {
        throw new Error(signInError.message);
      }

      // Check for redirect path
      const redirectPath = SecurityUtils.storage.get<string>('redirectPath');
      if (redirectPath) {
        SecurityUtils.storage.remove('redirectPath');
      }

      toast({
        title: 'Login successful',
        description: 'Welcome back!'
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setError(errorMessage);

      handleAuthError(error instanceof Error ? error : new Error(errorMessage), {
        component: 'AuthContext',
        action: 'login',
        metadata: { email: credentials.email }
      });

      toast({
        title: 'Login failed',
        description: errorMessage,
        variant: 'destructive'
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function with Supabase
  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      setError(null);

      // Validate and sanitize input
      if (!data.email || !data.password || !data.name) {
        throw new Error('All fields are required');
      }

      const sanitizedEmail = SecurityUtils.sanitizeInput(data.email.trim());
      const sanitizedName = SecurityUtils.sanitizeInput(data.name.trim());

      if (!isValidEmail(sanitizedEmail)) {
        throw new Error('Please enter a valid email address');
      }

      // Validate password strength
      const passwordValidation = SecurityUtils.validatePasswordStrength(data.password);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.errors[0]);
      }

      if (sanitizedName.length < 2) {
        throw new Error('Name must be at least 2 characters long');
      }

      const redirectUrl = `${window.location.origin}/`;

      const { error: signUpError } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password: data.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: sanitizedName
          }
        }
      });

      if (signUpError) {
        throw new Error(signUpError.message);
      }

      toast({
        title: 'Registration successful',
        description: 'Please check your email to confirm your account!'
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setError(errorMessage);

      handleAuthError(error instanceof Error ? error : new Error(errorMessage), {
        component: 'AuthContext',
        action: 'register',
        metadata: { email: data.email, name: data.name }
      });

      toast({
        title: 'Registration failed',
        description: errorMessage,
        variant: 'destructive'
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Social login methods - placeholders for now
  const loginWithGoogle = async () => {
    toast({
      title: 'Google login',
      description: 'This feature is coming soon!'
    });
    return Promise.resolve();
  };

  const loginWithLinkedIn = async () => {
    toast({
      title: 'LinkedIn login',
      description: 'This feature is coming soon!'
    });
    return Promise.resolve();
  };

  // Logout function
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      
      setUser(null);
      setSession(null);
      setError(null);
      SecurityUtils.storage.clear();
      
      toast({
        title: 'Logout successful',
        description: 'You have been logged out'
      });
    } catch (error) {
      handleAuthError(error instanceof Error ? error : new Error('Logout failed'), {
        component: 'AuthContext',
        action: 'logout'
      });
    }
  };

  const clearError = () => {
    setError(null);
  };

  // Update profile function
  const updateProfile = async (data: Partial<User>) => {
    setIsLoading(true);
    try {
      if (!user || !session) {
        throw new Error('Not authenticated');
      }

      // Sanitize input data
      const sanitizedData: any = {};
      if (data.name) {
        sanitizedData.name = SecurityUtils.sanitizeInput(data.name.trim());
      }
      if (data.avatar_url) {
        sanitizedData.avatar_url = SecurityUtils.sanitizeInput(data.avatar_url);
      }
      if (data.jurisdiction) {
        sanitizedData.jurisdiction = data.jurisdiction.map(j => SecurityUtils.sanitizeInput(j));
      }

      const { error } = await supabase
        .from('profiles')
        .update(sanitizedData)
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      const updatedUser = { ...user, ...sanitizedData };
      setUser(updatedUser);

      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully'
      });
    } catch (error) {
      console.error('Profile update failed:', error);
      toast({
        title: 'Profile update failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive'
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!user && !!session,
        isLoading,
        login,
        loginWithGoogle,
        loginWithLinkedIn,
        logout,
        register,
        updateProfile,
        error,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
