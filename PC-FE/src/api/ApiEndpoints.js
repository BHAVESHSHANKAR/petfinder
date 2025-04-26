/**
 * API Endpoints
 * This file contains all the API endpoints used in the application
 */
import ApiRequest from './ApiRequest';
import ApiConfig from './ApiConfig';

// Get API URL directly from environment variable with fallback
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Authentication Endpoints
 */
const AuthEndpoints = {
  // User registration
  register: (userData) => 
    ApiRequest.post('/auth/register', userData),
  
  // User login
  login: (credentials) => 
    ApiRequest.post('/auth/login', credentials),
  
  // Get current user profile
  getCurrentUser: () => 
    ApiRequest.get('/auth/me'),
  
  // Update user profile
  updateProfile: (profileData) => 
    ApiRequest.put('/auth/profile', profileData),
  
  // Change user password
  changePassword: (passwordData) => 
    ApiRequest.put('/auth/change-password', passwordData),
};

/**
 * Export all endpoint groups
 * New endpoint groups can be added here as the application grows
 */
const ApiEndpoints = {
  auth: AuthEndpoints,
  // Add API URL for direct access if needed
  apiUrl: API_URL
};

export default ApiEndpoints;