// client/src/lib/api.ts

import axios from 'axios';

/**
 * API CONFIGURATION
 * 
 * This file sets up axios with default configuration.
 * Think of it as the "phone line" to your backend.
 */

// Base URL for all API calls
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

/**
 * REQUEST INTERCEPTOR
 * 
 * This runs BEFORE every request.
 * It automatically adds the auth token to requests if user is logged in.
 */
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * RESPONSE INTERCEPTOR
 * 
 * This runs AFTER every response.
 * It handles errors globally (like expired tokens).
 */
api.interceptors.response.use(
  (response) => {
    // If response is successful, just return the data
    return response.data;
  },
  (error) => {
    // Handle specific error cases
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      // Token expired or invalid - logout user
      if (status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      
      // Return the error message from server
      return Promise.reject(data?.message || 'Something went wrong');
    } else if (error.request) {
      // Request made but no response (server down?)
      return Promise.reject('Cannot connect to server. Please try again.');
    } else {
      // Something else happened
      return Promise.reject(error.message);
    }
  }
);

export default api;