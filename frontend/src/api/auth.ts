/**
 * Centralized Client-Side Authentication API Client for InsightsRank Frontend (Dummy/Standalone Mode)
 * No backend server or database required.
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

export const DEFAULT_DEMO_USER: User = {
  id: "usr_demo_01",
  email: "demo@insightsrank.com",
  firstName: "Demo",
  lastName: "Administrator",
  role: "OWNER",
  organizationId: "org_insightsrank_demo",
  organization: {
    id: "org_insightsrank_demo",
    name: "InsightsRank Brand Org",
    slug: "insightsrank-demo",
  },
};

export const authApi = {
  /**
   * Log in user with email & password (Dummy Mock Authentication)
   */
  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const email = credentials.email.trim();
    const namePart = email.split('@')[0] || 'User';
    const firstName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    const role: 'OWNER' | 'ADMIN' | 'MEMBER' = email.toLowerCase().includes('admin')
      ? 'ADMIN'
      : email.toLowerCase().includes('member')
      ? 'MEMBER'
      : 'OWNER';

    const user: User = {
      id: `usr_${Date.now()}`,
      email,
      firstName,
      lastName: 'User',
      role,
      organizationId: 'org_insightsrank_demo',
      organization: {
        id: 'org_insightsrank_demo',
        name: 'InsightsRank Brand Org',
        slug: 'insightsrank-demo',
      },
    };

    const token = `mock_access_token_${Date.now()}`;
    localStorage.setItem('insightsrank_token', token);
    localStorage.setItem('insightsrank_user', JSON.stringify(user));
    localStorage.setItem('insightsrank_credentials', JSON.stringify({ email, timestamp: Date.now() }));

    return {
      user,
      accessToken: token,
    };
  },

  /**
   * Register a new user and organization (Dummy Mock Registration)
   */
  async register(details: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    organizationName: string;
  }): Promise<AuthResponse> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const email = details.email.trim();
    const user: User = {
      id: `usr_${Date.now()}`,
      email,
      firstName: details.firstName || email.split('@')[0] || 'User',
      lastName: details.lastName || '',
      role: 'OWNER',
      organizationId: `org_${Date.now()}`,
      organization: {
        id: `org_${Date.now()}`,
        name: details.organizationName || 'My Organization',
        slug: (details.organizationName || 'my-org').toLowerCase().replace(/\s+/g, '-'),
      },
    };

    const token = `mock_access_token_${Date.now()}`;
    localStorage.setItem('insightsrank_token', token);
    localStorage.setItem('insightsrank_user', JSON.stringify(user));
    localStorage.setItem('insightsrank_credentials', JSON.stringify({ email, timestamp: Date.now() }));

    return {
      user,
      accessToken: token,
    };
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
    return DEFAULT_DEMO_USER;
  },

  /**
   * Log out user and clear dummy credentials
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
  /**
   * Invite or create a new user in organization
   */
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
      organizationId: 'org_insightsrank_demo',
    };
  },

  /**
   * Fetch users in current organization
   */
  async getOrganizationUsers(): Promise<User[]> {
    await new Promise((r) => setTimeout(r, 150));
    return [
      {
        id: 'usr_owner_01',
        email: 'ops@insightsrank.com',
        firstName: 'Operations',
        lastName: 'Lead',
        role: 'OWNER',
        organizationId: 'org_insightsrank_demo',
      },
      {
        id: 'usr_admin_02',
        email: 'admin@insightsrank.com',
        firstName: 'Alex',
        lastName: 'Admin',
        role: 'ADMIN',
        organizationId: 'org_insightsrank_demo',
      },
      {
        id: 'usr_member_03',
        email: 'member@insightsrank.com',
        firstName: 'Sam',
        lastName: 'Member',
        role: 'MEMBER',
        organizationId: 'org_insightsrank_demo',
      },
    ];
  },
};
