import axios from 'axios';

// Get API URL from environment variables with fallback
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Determine environment
const IS_DEV = import.meta.env.DEV === true;
const IS_PROD = import.meta.env.PROD === true;

// Enable logging for development debugging
const ENABLE_LOGGING = IS_DEV && true;

// Simple logging utility - now enabled for development
const logApiCall = (method, endpoint, success = true, data = null) => {
  if (IS_DEV && ENABLE_LOGGING) {
    const style = success ? 'color: green; font-weight: bold' : 'color: red; font-weight: bold';
    console.log(`%c${method} ${endpoint}: ${success ? 'SUCCESS' : 'FAILED'}`, style);
    
    if (data && ENABLE_LOGGING) {
      console.log('Response data:', data);
    }
  }
};

// Log environment information on startup
if (IS_DEV && ENABLE_LOGGING) {
  console.log('%cAPI Configuration:', 'color: blue; font-weight: bold');
  console.log('API URL:', API_URL);
  console.log('Environment:', IS_DEV ? 'Development' : IS_PROD ? 'Production' : 'Unknown');
  console.log('All env vars:', import.meta.env);
}

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Prevent HTTP errors from being thrown for non-2xx responses
  validateStatus: (status) => status >= 200 && status < 500,
  // Set timeout to prevent hanging requests
  timeout: 15000
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log outgoing requests in development
    if (IS_DEV && ENABLE_LOGGING) {
      console.log(`%c→ ${config.method.toUpperCase()} ${config.url}`, 'color: #9b59b6');
      if (config.data && ENABLE_LOGGING) {
        console.log('Request payload:', config.data);
      }
    }
    
    return config;
  },
  (error) => {
    if (IS_DEV && ENABLE_LOGGING) console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (IS_DEV && ENABLE_LOGGING) {
      console.log(`%c← ${response.status} ${response.config.method.toUpperCase()} ${response.config.url}`, 'color: #2ecc71');
    }
    return response;
  },
  (error) => {
    // Log minimized error info
    if (IS_DEV && ENABLE_LOGGING) {
      console.error(`API Error (${error.code || 'UNKNOWN'}): ${error.message || 'Unknown error'}`);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
    }
    
    if (error.code === 'ECONNABORTED') {
      return Promise.reject({ 
        message: 'Request timed out. Please try again.',
        code: 'TIMEOUT'
      });
    }
    
    if (error.code === 'ERR_NETWORK') {
      return Promise.reject({ 
        message: 'Network error - Unable to connect to server',
        code: 'NETWORK'
      });
    }
    
    // Certificate errors
    if (error.code === 'CERT_AUTHORITY_INVALID' || 
        error.code === 'ERR_CERT_AUTHORITY_INVALID') {
      return Promise.reject({ 
        message: 'Secure connection failed. SSL certificate issue.',
        code: 'SSL_ERROR'
      });
    }
    
    const { response } = error;
    
    // Handle session expiration
    if (response && response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Helper functions for API requests
const ApiRequest = {
  /**
   * Make a GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} params - Query parameters
   * @returns {Promise} - Response promise
   */
  get: (endpoint, params = {}) => {
    return apiClient.get(endpoint, { params })
      .then(response => {
        if (response.status >= 400) {
          logApiCall('GET', endpoint, false, response.data);
          throw new Error(response.data?.message || 'Error during GET request');
        }
        logApiCall('GET', endpoint, true, response.data);
        return response;
      });
  },

  /**
   * Make a POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body
   * @returns {Promise} - Response promise
   */
  post: (endpoint, data = {}) => {
    return apiClient.post(endpoint, data)
      .then(response => {
        if (response.status >= 400) {
          logApiCall('POST', endpoint, false, response.data);
          throw new Error(response.data?.message || 'Error during POST request');
        }
        logApiCall('POST', endpoint, true, response.data);
        return response;
      });
  },

  /**
   * Make a PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body
   * @returns {Promise} - Response promise
   */
  put: (endpoint, data = {}) => {
    return apiClient.put(endpoint, data)
      .then(response => {
        if (response.status >= 400) {
          logApiCall('PUT', endpoint, false, response.data);
          throw new Error(response.data?.message || 'Error during PUT request');
        }
        logApiCall('PUT', endpoint, true, response.data);
        return response;
      });
  },

  /**
   * Make a DELETE request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body
   * @returns {Promise} - Response promise
   */
  delete: (endpoint, data = {}) => {
    return apiClient.delete(endpoint, { data })
      .then(response => {
        if (response.status >= 400) {
          logApiCall('DELETE', endpoint, false, response.data);
          throw new Error(response.data?.message || 'Error during DELETE request');
        }
        logApiCall('DELETE', endpoint, true, response.data);
        return response;
      });
  },
};

export default ApiRequest;