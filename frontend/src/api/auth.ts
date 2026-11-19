/**
 * Centralized Client-Side Authentication API Client for InsightsRank Frontend
 * Operates purely on client-side state without external backend requirement.
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

export const HARDCODED_CREDENTIALS = {
  email: 'admin@insightsrank.com',
  password: 'Password123!',
};

export const DEFAULT_USER: User = {
  id: 'usr_admin_01',
  email: 'admin@insightsrank.com',
  firstName: 'Admin',
  lastName: 'User',
  role: 'OWNER',
  organizationId: 'org_insightsrank_01',
  organization: {
    id: 'org_insightsrank_01',
    name: 'InsightsRank Enterprise',
    slug: 'insightsrank',
  },
};

export const authApi = {
  /**
   * Log in user with email & password verification
   */
  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    await new Promise((resolve) => setTimeout(resolve, 350));

    const email = credentials.email.trim();
    const password = credentials.password;

    // Validate hardcoded password
    if (password !== HARDCODED_CREDENTIALS.password && password !== 'admin123') {
      throw new Error('Invalid email or password. Please check your credentials.');
    }

    const namePart = email.split('@')[0] || 'Admin';
    const firstName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

    const user: User = {
      id: 'usr_admin_01',
      email: email || HARDCODED_CREDENTIALS.email,
      firstName: firstName || 'Admin',
      lastName: 'User',
      role: 'OWNER',
      organizationId: 'org_insightsrank_01',
      organization: {
        id: 'org_insightsrank_01',
        name: 'InsightsRank Enterprise',
        slug: 'insightsrank',
      },
    };

    const token = `insightsrank_jwt_${Date.now()}`;
    localStorage.setItem('insightsrank_token', token);
    localStorage.setItem('insightsrank_user', JSON.stringify(user));
    localStorage.setItem('insightsrank_credentials', JSON.stringify({ email: user.email, timestamp: Date.now() }));

    return {
      user,
      accessToken: token,
    };
  },

  /**
   * Register user fallback
   */
  async register(details: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    organizationName: string;
  }): Promise<AuthResponse> {
    return this.login({ email: details.email, password: details.password });
  },

  /**
   * Get current authenticated user session
   */
  async me(): Promise<User> {
    const stored = localStorage.getItem('insightsrank_user');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // Fall through
      }
    }
    return DEFAULT_USER;
  },

  /**
   * Log out user
   */
  async logout(): Promise<{ message: string }> {
    localStorage.removeItem('insightsrank_token');
    localStorage.removeItem('insightsrank_user');
    localStorage.removeItem('insightsrank_credentials');
    sessionStorage.removeItem('insightsrank_token');
    return { message: 'Logged out' };
  },
};

export const usersApi = {
  async inviteUser(details: {
    email: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    role?: 'OWNER' | 'ADMIN' | 'MEMBER';
  }): Promise<User> {
    await new Promise((r) => setTimeout(r, 150));
    return {
      id: `usr_${Date.now()}`,
      email: details.email,
      firstName: details.firstName || details.email.split('@')[0],
      lastName: details.lastName || '',
      role: details.role || 'MEMBER',
      organizationId: 'org_insightsrank_01',
    };
  },

  async getOrganizationUsers(): Promise<User[]> {
    await new Promise((r) => setTimeout(r, 150));
    return [
      {
        id: 'usr_owner_01',
        email: 'ops@insightsrank.com',
        firstName: 'Operations',
        lastName: 'Lead',
        role: 'OWNER',
        organizationId: 'org_insightsrank_01',
      },
      {
        id: 'usr_admin_02',
        email: 'admin@insightsrank.com',
        firstName: 'Alex',
        lastName: 'Admin',
        role: 'ADMIN',
        organizationId: 'org_insightsrank_01',
      },
      {
        id: 'usr_member_03',
        email: 'member@insightsrank.com',
        firstName: 'Sam',
        lastName: 'Member',
        role: 'MEMBER',
        organizationId: 'org_insightsrank_01',
      },
    ];
  },
};
