export type RoleId = "owner" | "admin" | "manager" | "analyst" | "viewer";

export type UserStatus = "active" | "invited" | "suspended";

export interface OrganizationUser {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  role: RoleId;
  teams: string[];
  status: UserStatus;
  lastActiveAt: string;
  locationScope: string;
  avatarInitials: string;
}

export interface Role {
  id: RoleId;
  name: string;
  description: string;
  userCount: number;
  system: boolean;
}
