/**
 * API Endpoints
 * This file contains all the API endpoints used in the application
 */
import ApiRequest from './ApiRequest';

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
};

export default ApiEndpoints; 