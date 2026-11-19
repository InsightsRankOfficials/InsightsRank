import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authApi, User, AuthResponse, DEFAULT_DEMO_USER } from '../api/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (details: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    organizationName: string;
  }) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  try {
    const rawUser = localStorage.getItem('insightsrank_user');
    if (rawUser) {
      return JSON.parse(rawUser);
    }
  } catch (e) {
    console.error('Failed to parse user from localStorage', e);
  }
  return null;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(getStoredUser);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await authApi.me();
      if (currentUser) {
        setUser(currentUser);
        localStorage.setItem('insightsrank_user', JSON.stringify(currentUser));
      }
    } catch {
      // Keep existing stored user if refresh fails
    }
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await authApi.login({ email, password });
      setUser(response.user);
      return response;
    } catch (err: any) {
      const msg = err?.message || 'Failed to sign in. Please check your credentials.';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (details: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    organizationName: string;
  }) => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await authApi.register(details);
      setUser(response.user);
      return response;
    } catch (err: any) {
      const msg = err?.message || 'Failed to create account.';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      setError(null);
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        register,
        logout,
        refreshUser,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
