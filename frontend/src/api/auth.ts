/**
 * Centralized Authentication API Client for Global360 Frontend
 */

export interface Organization {
  id: string;
  name: string;
  slug: string;
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  organizationId: string;
  organization?: Organization;
}

export interface AuthResponse {
  user: User;
  accessToken?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  requestId?: string;
}

// Configurable API base URL with fallback to deployed InsightsRank backend server
const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string) || 'https://insightsrank-backend.onrender.com/api/v1';

/**
 * Standard HTTP request wrapper supporting HttpOnly cookies and JSON payloads.
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  // If access token stored in localStorage/sessionStorage, attach Bearer header
  const token = localStorage.getItem('global360_token') || sessionStorage.getItem('global360_token');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: 'include', // Include HttpOnly auth cookies
  });

  const payload: ApiResponse<T> = await response.json().catch(() => ({
    success: false,
    error: {
      code: 'INVALID_RESPONSE',
      message: 'Server returned an invalid response',
    },
  }));

  if (!response.ok || !payload.success) {
    const errorMessage =
      payload.error?.message ||
      (response.status === 401
        ? 'Invalid email or password'
        : `Request failed with status ${response.status}`);
    const error = new Error(errorMessage) as Error & { code?: string };
    error.code = payload.error?.code || 'AUTH_ERROR';
    throw error;
  }

  return payload.data as T;
}

export const authApi = {
  /**
   * Log in user with email & password
   */
  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    const data = await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    const token = data.accessToken || (data as any).token;
    if (token) {
      localStorage.setItem('global360_token', token);
      sessionStorage.setItem('global360_token', token);
    }
    if (data.user) {
      localStorage.setItem('global360_user', JSON.stringify(data.user));
    }
    localStorage.setItem('global360_credentials', JSON.stringify({ email: credentials.email, timestamp: Date.now() }));
    return data;
  },

  /**
   * Register a new user and organization
   */
  async register(details: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    organizationName: string;
  }): Promise<AuthResponse> {
    const data = await apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(details),
    });
    const token = data.accessToken || (data as any).token;
    if (token) {
      localStorage.setItem('global360_token', token);
      sessionStorage.setItem('global360_token', token);
    }
    if (data.user) {
      localStorage.setItem('global360_user', JSON.stringify(data.user));
    }
    localStorage.setItem('global360_credentials', JSON.stringify({ email: details.email, timestamp: Date.now() }));
    return data;
  },

  /**
   * Get current authenticated user session
   */
  async me(): Promise<User> {
    return apiRequest<User>('/auth/me', {
      method: 'GET',
    });
  },

  /**
   * Log out user and clear authentication session/cookies
   */
  async logout(): Promise<{ message: string }> {
    try {
      await apiRequest<{ message: string }>('/auth/logout', {
        method: 'POST',
      });
    } catch {
      // Ignore errors on network disconnect
    } finally {
      localStorage.removeItem('global360_token');
      localStorage.removeItem('global360_user');
      localStorage.removeItem('global360_credentials');
      sessionStorage.removeItem('global360_token');
    }
    return { message: 'Logged out' };
  },
};

export const usersApi = {
  /**
   * Invite or create a new user in the organization database
   */
  async inviteUser(details: {
    email: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    role?: 'OWNER' | 'ADMIN' | 'MEMBER';
  }): Promise<User> {
    return apiRequest<User>('/users/invite', {
      method: 'POST',
      body: JSON.stringify(details),
    });
  },

  /**
   * Fetch all users in current organization from database
   */
  async getOrganizationUsers(): Promise<User[]> {
    return apiRequest<User[]>('/users', {
      method: 'GET',
    });
  },
};
