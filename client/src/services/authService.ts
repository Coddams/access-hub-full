// client/src/services/authService.ts

import api from '@/lib/api';

/**
 * AUTHENTICATION SERVICE
 * 
 * All authentication-related API calls go here.
 * This keeps our components clean and organized.
 */

interface RegisterData {
  name: string;
  email: string;
  password: string;
  department?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      role: 'admin' | 'manager' | 'user';
      department: string;
      status: string;
      avatar?: string;
      lastLogin: Date;
      createdAt: Date;
    };
    token: string;
  };
}

interface UserResponse {
  success: boolean;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      role: 'admin' | 'manager' | 'user';
      department: string;
      status: string;
      lastLogin: Date;
      createdAt: Date;
    };
  };
}

export const authService = {
  /**
   * Register new user
   * POST /api/auth/register
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    return await api.post('/auth/register', data);
  },

  /**
   * Login user
   * POST /api/auth/login
   */
  login: async (data: LoginData): Promise<AuthResponse> => {
    return await api.post('/auth/login', data);
  },

  /**
   * Get current user
   * GET /api/auth/me
   */
  getCurrentUser: async (): Promise<UserResponse> => {
    return await api.get('/auth/me');
  },

  /**
   * Logout user
   * POST /api/auth/logout
   */
  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Even if logout fails on server, clear local data
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },
};