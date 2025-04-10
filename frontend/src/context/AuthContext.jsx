import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

// Create context
const AuthContext = createContext();

// Context provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on component mount
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = authService.getCurrentUser();
        if (token) {
          setIsAuthenticated(true);
          // Here you could also fetch user details from a /me endpoint
          // setUser(userData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = (token, userData = null) => {
    // Token should already be stored by authService
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      // This will clear cookies and local storage
      await authService.logout();
      // Update state
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const value = {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 