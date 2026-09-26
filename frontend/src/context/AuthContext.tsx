import React, { createContext, useContext, useState, useCallback } from 'react';
import { authApi, User, AuthResponse } from '../api/auth';

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
  try {
    const rawUser = localStorage.getItem('global360_user');
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
        localStorage.setItem('global360_user', JSON.stringify(currentUser));
      }
    } catch {
      // Keep existing stored user if silent refresh fails
    }
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      const response = await authApi.login({ email, password });
      const authenticatedUser = response.user || {
        id: 'usr_' + Date.now(),
        email,
        firstName: email.split('@')[0],
        lastName: '',
        role: 'OWNER',
        organizationId: 'org_1',
      };
      setUser(authenticatedUser);
      localStorage.setItem('global360_user', JSON.stringify(authenticatedUser));
      return response;
    } catch (err: any) {
      const msg = err.message || 'Failed to sign in. Please check your credentials.';
      setError(msg);
      throw err;
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
    try {
      const response = await authApi.register(details);
      const registeredUser = response.user || {
        id: 'usr_' + Date.now(),
        email: details.email,
        firstName: details.firstName || details.email.split('@')[0],
        lastName: details.lastName || '',
        role: 'OWNER',
        organizationId: 'org_1',
      };
      setUser(registeredUser);
      localStorage.setItem('global360_user', JSON.stringify(registeredUser));
      return response;
    } catch (err: any) {
      const msg = err.message || 'Failed to create account.';
      setError(msg);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      setError(null);
      localStorage.removeItem('global360_user');
      localStorage.removeItem('global360_token');
      localStorage.removeItem('global360_credentials');
      sessionStorage.removeItem('global360_token');
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

