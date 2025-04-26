import { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';
import { ApiEndpoints } from '../api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Helper to minimize console logging - now disabled
const logUserData = (userData) => {
  // Logging disabled - we don't want to see these messages
  return;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user data on startup
  useEffect(() => {
    async function initAuth() {
      try {
        setLoading(true);
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (storedUser && token) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          
          // Verify token by getting current user profile
          try {
            await getCurrentUser();
          } catch (err) {
            console.error('Token validation failed');
            logout();
          }
        }
      } finally {
        setLoading(false);
      }
    }
    
    initAuth();
  }, []);
  
  // Get current user profile
  const getCurrentUser = useCallback(async () => {
    try {
      const response = await ApiEndpoints.auth.getCurrentUser();
      
      if (response.data && response.data.data) {
        const userData = response.data.data;
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
      }
      throw new Error('Invalid user data received');
    } catch (err) {
      setError(err.message || 'Failed to get user profile');
      throw err;
    }
  }, []);

  // Register new user
  const register = useCallback(async (userData) => {
    try {
      setError(null);
      const response = await ApiEndpoints.auth.register(userData);
      
      if (response.data && response.data.data) {
        const { token, user: userData } = response.data.data;
        setUser(userData);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        logUserData(userData);
        return userData;
      }
      throw new Error('Registration failed');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
      throw err;
    }
  }, []);

  // Login user
  const login = useCallback(async (credentials) => {
    try {
      setError(null);
      const response = await ApiEndpoints.auth.login(credentials);
      
      if (response.data && response.data.data) {
        const { token, user: userData } = response.data.data;
        setUser(userData);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        logUserData(userData);
        return userData;
      }
      throw new Error('Login failed');
    } catch (err) {
      console.error('Login failed');
      setError(err.response?.data?.message || err.message || 'Login failed');
      throw err;
    }
  }, []);

  // Update user profile
  const updateProfile = useCallback(async (profileData) => {
    try {
      setError(null);
      const response = await ApiEndpoints.auth.updateProfile(profileData);
      
      if (response.data && response.data.data) {
        const updatedUser = response.data.data;
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        logUserData(updatedUser);
        return updatedUser;
      }
      throw new Error('Profile update failed');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Profile update failed');
      throw err;
    }
  }, []);

  // Change password
  const changePassword = useCallback(async (passwordData) => {
    try {
      setError(null);
      const response = await ApiEndpoints.auth.changePassword(passwordData);
      return response.data && response.status === 200;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Password change failed');
      throw err;
    }
  }, []);

  // Logout user
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (process.env.NODE_ENV === 'development') {
      console.log('User logged out');
    }
  }, []);

  // Memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    user,
    loading,
    error,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    getCurrentUser
  }), [
    user, loading, error, register, login, 
    logout, updateProfile, changePassword, getCurrentUser
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
} 