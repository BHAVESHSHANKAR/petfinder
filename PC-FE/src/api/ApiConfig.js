/**
 * API Configuration
 * Central configuration for API settings and environment variables
 */

// Get API URL from environment variables with fallback
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Determine environment
const IS_DEV = import.meta.env.DEV === true;
const IS_PROD = import.meta.env.PROD === true;

// Enable logging for development debugging
const ENABLE_LOGGING = IS_DEV && true;

// Log environment information on startup
if (IS_DEV && ENABLE_LOGGING) {
  console.log('%cAPI Configuration:', 'color: blue; font-weight: bold');
  console.log('API URL:', API_URL);
  console.log('Environment:', IS_DEV ? 'Development' : IS_PROD ? 'Production' : 'Unknown');
}

// Export configuration
const ApiConfig = {
  API_URL,
  IS_DEV,
  IS_PROD,
  ENABLE_LOGGING
};

export default ApiConfig;
