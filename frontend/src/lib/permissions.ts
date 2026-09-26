import type { RoleId } from "@/types/user";

/**
 * Permission constants. Frontend checks drive UI affordances only —
 * real authorization is enforced server-side.
 */

export const PERMISSION_DOMAINS = [
  "locations",
  "reviews",
  "rankings",
  "analytics",
  "content",
  "reports",
  "users",
  "organization",
  "integrations",
  "settings",
] as const;

export type PermissionDomain = (typeof PERMISSION_DOMAINS)[number];

export const PERMISSION_ACTIONS = ["read", "create", "update", "delete", "manage"] as const;
export type PermissionAction = (typeof PERMISSION_ACTIONS)[number];

export type Permission = `${PermissionDomain}:${PermissionAction}`;

const ALL: PermissionAction[] = ["read", "create", "update", "delete", "manage"];

function grant(domains: PermissionDomain[], actions: PermissionAction[]): Permission[] {
  return domains.flatMap((d) => actions.map((a) => `${d}:${a}` as Permission));
}

export const ROLE_PERMISSIONS: Record<RoleId, Permission[]> = {
  owner: grant([...PERMISSION_DOMAINS], ALL),
  admin: [
    ...grant(
      ["locations", "reviews", "rankings", "analytics", "content", "reports", "integrations"],
      ALL,
    ),
    ...grant(["users"], ["read", "create", "update"]),
    ...grant(["organization", "settings"], ["read", "update"]),
  ],
  manager: [
    ...grant(["locations", "reviews", "content"], ["read", "create", "update"]),
    ...grant(["rankings", "analytics", "reports"], ["read"]),
    ...grant(["integrations", "organization", "users", "settings"], ["read"]),
  ],
  analyst: [
    ...grant(["locations", "reviews", "rankings", "analytics", "content"], ["read"]),
    ...grant(["reports"], ["read", "create", "update"]),
    ...grant(["organization", "users", "integrations", "settings"], ["read"]),
  ],
  viewer: grant([...PERMISSION_DOMAINS], ["read"]),
};

export const ROLE_LABELS: Record<RoleId, string> = {
  owner: "Owner",
  admin: "Admin",
  manager: "Manager",
  analyst: "Analyst",
  viewer: "Viewer",
};

export function roleHas(role: RoleId, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}
