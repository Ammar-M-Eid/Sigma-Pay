import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import apiClient, { ApiError, NetworkError, TimeoutError } from '../api/apiClientEnhanced';

// ==================== Types ====================

interface User {
  id: string;
  username?: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, phoneNumber: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// ==================== Context ====================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ==================== Provider ====================

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.login(email, password);

      if (response.success && response.data) {
        setUser({
          id: response.data.userId,
          email: email,
        });
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof NetworkError) {
        setError('Network error. Please check your connection.');
      } else if (err instanceof TimeoutError) {
        setError('Request timed out. Please try again.');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (
    username: string,
    email: string,
    password: string,
    phoneNumber: string
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.register(username, email, password, phoneNumber);

      if (response.success && response.data) {
        setUser({
          id: response.data.userId,
          username: username,
          email: email,
        });
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        if (err.errors && err.errors.length > 0) {
          setError(err.errors.map(e => e.message).join(', '));
        }
      } else if (err instanceof NetworkError) {
        setError('Network error. Please check your connection.');
      } else if (err instanceof TimeoutError) {
        setError('Request timed out. Please try again.');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    apiClient.logout();
    setUser(null);
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ==================== Hook ====================

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export types
export type { User, AuthContextType };
