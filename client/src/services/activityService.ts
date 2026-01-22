// client/src/services/activityService.ts

import api from '@/lib/api';

/**
 * ACTIVITY SERVICE
 * 
 * All activity-related API calls.
 */

interface Activity {
  _id: string;
  user: string;
  userName: string;
  userEmail: string;
  action: string;
  target: string;
  type: string;
  description?: string;
  createdAt: Date;
}

interface ActivitiesResponse {
  success: boolean;
  count: number;
  data: Activity[];
}

interface ActivityStatsResponse {
  success: boolean;
  data: {
    total: number;
    byType: Array<{ _id: string; count: number }>;
  };
}

export const activityService = {
  /**
   * Get current user's activities
   * GET /api/activities/me?limit=50&type=view
   */
  getMyActivities: async (filters?: {
    limit?: number;
    type?: string;
  }): Promise<ActivitiesResponse> => {
    const params = new URLSearchParams();
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.type) params.append('type', filters.type);
    
    return await api.get(`/activities/me?${params.toString()}`);
  },

  /**
   * Get all activities (Manager/Admin)
   * GET /api/activities?userId=xxx&type=view&limit=100
   */
  getAllActivities: async (filters?: {
    userId?: string;
    type?: string;
    action?: string;
    limit?: number;
  }): Promise<ActivitiesResponse> => {
    const params = new URLSearchParams();
    if (filters?.userId) params.append('userId', filters.userId);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.action) params.append('action', filters.action);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    
    return await api.get(`/activities?${params.toString()}`);
  },

  /**
   * Get activity statistics
   * GET /api/activities/stats
   */
  getActivityStats: async (filters?: {
    userId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ActivityStatsResponse> => {
    const params = new URLSearchParams();
    if (filters?.userId) params.append('userId', filters.userId);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    
    return await api.get(`/activities/stats?${params.toString()}`);
  },
};