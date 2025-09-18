// frontend/src/hooks/useAuth.js
// Copy this file to your React frontend: src/hooks/useAuth.js
// Custom hook for handling authentication with your backend

import { useState, useEffect, createContext, useContext } from 'react';
import apiService from '../services/api';

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const userData = await apiService.getMemberDetail();
      setUser(userData);
    } catch (err) {
      // User is not authenticated
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setError(null);
      const response = await apiService.login(credentials);
      
      if (response.success) {
        setUser(response.member);
        return { success: true };
      } else {
        setError(response.message || 'Login failed');
        return { success: false, error: response.message };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const signup = async (userData) => {
    try {
      setError(null);
      const response = await apiService.signup(userData);
      
      if (response.success) {
        setUser(response.member);
        return { success: true };
      } else {
        setError(response.message || 'Signup failed');
        return { success: false, error: response.message };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
      setUser(null);
      setError(null);
    } catch (err) {
      console.error('Logout error:', err);
      // Still clear user even if logout request fails
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Example Login Component
export const LoginForm = () => {
  const { login, error, loading } = useAuth();
  const [formData, setFormData] = useState({
    memberNick: '',
    memberPassword: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData);
    
    if (result.success) {
      console.log('Login successful!');
      // Redirect or update UI
    } else {
      console.error('Login failed:', result.error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h3>Login</h3>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="memberNick">Username:</label>
        <input
          type="text"
          id="memberNick"
          name="memberNick"
          value={formData.memberNick}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="memberPassword">Password:</label>
        <input
          type="password"
          id="memberPassword"
          name="memberPassword"
          value={formData.memberPassword}
          onChange={handleChange}
          required
        />
      </div>
      
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

// Example Protected Component
export const ProtectedContent = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please log in to view this content.</div>;
  }

  return children;
};
