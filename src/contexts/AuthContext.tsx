
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast";
import { handleAuthError, ErrorCategory, ErrorSeverity } from '@/utils/error-handler';

// Define types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
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
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithLinkedIn: () => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  error: string | null;
  clearError: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock authentication functions (to be replaced with real implementation)
const mockUsers: User[] = [
  {
    id: '1',
    email: 'demo@synapse.com',
    name: 'Demo User',
    avatar: 'https://i.pravatar.cc/150?u=demo',
    jurisdiction: ['EU', 'UK']
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check for stored user on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('synapseUser');
      if (storedUser) {
        const userData = JSON.parse(storedUser) as User;
        // Validate saved user data
        if (userData && userData.id && userData.email && userData.name) {
          setUser(userData);
        } else {
          // Invalid saved data, clear it
          localStorage.removeItem('synapseUser');
        }
      }
    } catch (error) {
      // Invalid JSON in localStorage, clear it
      localStorage.removeItem('synapseUser');
      handleAuthError(error instanceof Error ? error : new Error('Failed to load saved user data'), {
        component: 'AuthContext',
        action: 'loadSavedUser'
      });
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Helper function to validate email
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Login function - this would connect to your backend in production
  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      setError(null);
      
      // Validate input
      if (!credentials.email || !credentials.password) {
        throw new Error('Email and password are required');
      }
      
      if (!isValidEmail(credentials.email)) {
        throw new Error('Please enter a valid email address');
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const foundUser = mockUsers.find(u => u.email === credentials.email);
      if (!foundUser) {
        throw new Error('Invalid credentials');
      }
      
      // Set user in state and localStorage
      setUser(foundUser);
      localStorage.setItem('synapseUser', JSON.stringify(foundUser));
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${foundUser.name}!`,
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
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function - would connect to backend in production
  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      setError(null);
      
      // Validate input
      if (!data.email || !data.password || !data.name) {
        throw new Error('All fields are required');
      }
      
      if (!isValidEmail(data.email)) {
        throw new Error('Please enter a valid email address');
      }
      
      if (data.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }
      
      if (data.name.trim().length < 2) {
        throw new Error('Name must be at least 2 characters long');
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (mockUsers.some(u => u.email === data.email)) {
        throw new Error('Email already in use');
      }
      
      // Create new user
      const newUser: User = {
        id: (mockUsers.length + 1).toString(),
        email: data.email,
        name: data.name.trim(),
        avatar: `https://i.pravatar.cc/150?u=${data.email}`,
      };
      
      mockUsers.push(newUser);
      
      // Set user in state and localStorage
      setUser(newUser);
      localStorage.setItem('synapseUser', JSON.stringify(newUser));
      
      toast({
        title: "Registration successful",
        description: `Welcome to Synapse, ${data.name}!`,
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
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Social login methods - placeholders for now
  const loginWithGoogle = async () => {
    toast({
      title: "Google login",
      description: "This feature is coming soon!",
    });
    return Promise.resolve();
  };

  const loginWithLinkedIn = async () => {
    toast({
      title: "LinkedIn login",
      description: "This feature is coming soon!",
    });
    return Promise.resolve();
  };

  // Logout function
  const logout = () => {
    try {
      setUser(null);
      setError(null);
      localStorage.removeItem('synapseUser');
      toast({
        title: "Logout successful",
        description: "You have been logged out",
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (!user) throw new Error('Not authenticated');
      
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('synapseUser', JSON.stringify(updatedUser));
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error) {
      console.error('Profile update failed:', error);
      toast({
        title: "Profile update failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
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
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithGoogle,
        loginWithLinkedIn,
        logout,
        register,
        updateProfile,
        error,
        clearError,
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
