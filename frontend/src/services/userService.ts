import { matchesSearch, paginate, request, sortRows } from "@/api/transport";
import { CURRENT_USER, ROLE_DEFINITIONS, USERS } from "@/data/users";
import type { ListParams, Paginated } from "@/types/common";
import type { OrganizationUser, Role, RoleId, UserStatus } from "@/types/user";

export interface UserListParams extends ListParams {
  role?: RoleId | "all";
  status?: UserStatus | "all";
  team?: string;
}

/** GET /users */
export function getUsers(params: UserListParams = {}): Promise<Paginated<OrganizationUser>> {
  return request("GET /users", () => {
    let rows = USERS.filter(
      (u) =>
        matchesSearch([u.name, u.email, u.role, ...u.teams], params.search) &&
        (!params.role || params.role === "all" || u.role === params.role) &&
        (!params.status || params.status === "all" || u.status === params.status) &&
        (!params.team || params.team === "all" || u.teams.includes(params.team)),
    );
    rows = sortRows(rows, params.sortBy ?? "name", params.sortDir ?? "asc");
    return paginate(rows, params, { simulatedTotal: rows.length });
  });
}

/** GET /me */
export function getCurrentUser(): Promise<OrganizationUser> {
  return request("GET /me", () => CURRENT_USER);
}

/** GET /roles */
export function getRoles(): Promise<Role[]> {
  return request("GET /roles", () => ROLE_DEFINITIONS);
}
