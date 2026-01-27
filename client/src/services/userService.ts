import api from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  department: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: Date;
  lastLogin: Date;
}

interface UsersResponse {
  success: boolean;
  count: number;
  data: User[];
}

interface UserResponse {
  success: boolean;
  data: User;
}

interface UpdateUserData {
  name?: string;
  email?: string;
  department?: string;
  status?: string;
  role?: string;
}

interface UserStatsResponse {
  success: boolean;
  data: {
    total: number;
    active: number;
    pending: number;
    byRole: Array<{ _id: string; count: number }>;
    byDepartment: Array<{ _id: string; count: number }>;
  };
}

export const userService = {
  getAllUsers: async (filters?: {
    role?: string;
    status?: string;
    department?: string;
    search?: string;
  }): Promise<UsersResponse> => {
    const params = new URLSearchParams();
    if (filters?.role) params.append('role', filters.role);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.department) params.append('department', filters.department);
    if (filters?.search) params.append('search', filters.search);

    return await api.get(`/users?${params.toString()}`);
  },

  /**
   * Get single user by ID
   * GET /api/users/:id
   */
  getUser: async (id: string): Promise<UserResponse> => {
    return await api.get(`/users/${id}`);
  },

  updateUser: async (id: string, data: UpdateUserData): Promise<UserResponse> => {
    return await api.put(`/users/${id}`, data);
  },

  deleteUser: async (id: string): Promise<{ success: boolean; message: string }> => {
    return await api.delete(`/users/${id}`);
  },

  getUserStats: async (): Promise<UserStatsResponse> => {
    return await api.get('/users/stats');
  },
};