
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast";

// Define types
interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  jurisdiction?: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithLinkedIn: () => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
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

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('synapseUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Login function - this would connect to your backend in production
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const foundUser = mockUsers.find(u => u.email === email);
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
      console.error('Login failed:', error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An error occurred during login",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function - would connect to backend in production
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (mockUsers.some(u => u.email === email)) {
        throw new Error('Email already in use');
      }
      
      // Create new user
      const newUser: User = {
        id: (mockUsers.length + 1).toString(),
        email,
        name,
        avatar: `https://i.pravatar.cc/150?u=${email}`,
      };
      
      mockUsers.push(newUser);
      
      // Set user in state and localStorage
      setUser(newUser);
      localStorage.setItem('synapseUser', JSON.stringify(newUser));
      
      toast({
        title: "Registration successful",
        description: `Welcome to Synapse, ${name}!`,
      });
    } catch (error) {
      console.error('Registration failed:', error);
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An error occurred during registration",
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
    setUser(null);
    localStorage.removeItem('synapseUser');
    toast({
      title: "Logout successful",
      description: "You have been logged out",
    });
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
