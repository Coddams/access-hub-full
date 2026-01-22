// client/src/services/index.ts

/**
 * Central export point for all services
 * This makes imports cleaner:
 * 
 * Instead of:  import { authService } from '@/services/authService'
 * You can do:  import { authService } from '@/services'
 */

export { authService } from './authService';
export { userService } from './userService';
export { activityService } from './activityService';