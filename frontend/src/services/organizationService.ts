import { request, ServiceError } from "@/api/transport";
import { ORGANIZATIONS, TEAMS } from "@/data/organizations";
import type { Organization, Team } from "@/types/organization";

/** GET /organizations */
export function getOrganizations(): Promise<Organization[]> {
  return request("GET /organizations", () => ORGANIZATIONS);
}

/** GET /organizations/:id */
export function getOrganization(id: string): Promise<Organization> {
  return request(`GET /organizations/${id}`, () => {
    const org = ORGANIZATIONS.find((o) => o.id === id);
    if (!org) throw new ServiceError("That organization is no longer available.", "not_found", false);
    return org;
  });
}

/** GET /organizations/:id/teams */
export function getTeams(organizationId: string): Promise<Team[]> {
  return request(`GET /organizations/${organizationId}/teams`, () =>
    TEAMS.filter((t) => t.organizationId === organizationId || true),
  );
}
