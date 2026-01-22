// client/src/contexts/AuthContext.tsx

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authService } from '@/services/authService';

export type UserRole = 'admin' | 'manager' | 'user';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  department: string;
  status: string;
  createdAt: Date;
  lastLogin: Date;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Load user from localStorage on mount
   * This maintains login state across page refreshes
   */
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          // Verify token is still valid by fetching current user
          const response = await authService.getCurrentUser();
          setUser(response.data.user);
        } catch (error) {
          console.error('Token validation failed:', error);
          // Token invalid, clear it
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  /**
   * LOGIN
   * Authenticates user with backend and stores token
   */
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Call backend API
      const response = await authService.login({ email, password });

      // Store token in localStorage
      localStorage.setItem('token', response.data.token);

      // Set user in state
      setUser(response.data.user);

      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * LOGOUT
   * Clears user session
   */
  const logout = useCallback(async () => {
    try {
      // Call backend to log activity
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local state
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, []);

  /**
   * SWITCH ROLE (Demo feature - in production, this would require admin approval)
   * For your portfolio demo, this shows how different roles see different things
   */
  const switchRole = useCallback((role: UserRole) => {
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      // Note: In production, you'd call an API endpoint to actually change the role
    }
  }, [user]);

  /**
   * REFRESH USER
   * Re-fetch current user data from backend
   */
  const refreshUser = useCallback(async () => {
    try {
      const response = await authService.getCurrentUser();
      setUser(response.data.user);
    } catch (error) {
      console.error('Refresh user error:', error);
      // If refresh fails, logout
      logout();
    }
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        switchRole,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}