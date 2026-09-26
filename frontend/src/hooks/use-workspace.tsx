import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import { DEFAULT_ORGANIZATION_ID, ORGANIZATIONS } from "@/data/organizations";
import { CURRENT_USER } from "@/data/users";
import { roleHas, type Permission } from "@/lib/permissions";
import type { Organization } from "@/types/organization";
import type { OrganizationUser } from "@/types/user";

/**
 * Global workspace state: the only genuinely global concerns are the active
 * organization, the signed-in user, permissions and the location scope.
 * Everything else stays local or in the URL.
 */

export interface LocationScope {
  id: string;
  label: string;
}

export const LOCATION_SCOPES: LocationScope[] = [
  { id: "all", label: "Locations" },
  { id: "north", label: "North region" },
  { id: "south", label: "South region" },
  { id: "west", label: "West region" },
  { id: "east", label: "East region" },
  { id: "flagship", label: "Flagship Stores group" },
];

interface WorkspaceValue {
  organizations: Organization[];
  organization: Organization;
  setOrganizationId: (id: string) => void;
  user: OrganizationUser;
  scope: LocationScope;
  setScopeId: (id: string) => void;
  can: (permission: Permission) => boolean;
}

const WorkspaceContext = createContext<WorkspaceValue | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [organizationId, setOrganizationId] = useState(DEFAULT_ORGANIZATION_ID);
  const [scopeId, setScopeId] = useState("all");

  const can = useCallback(
    (permission: Permission) => roleHas(CURRENT_USER.role, permission),
    [],
  );

  const value = useMemo<WorkspaceValue>(() => {
    const organization = ORGANIZATIONS.find((o) => o.id === organizationId);
    const scope = LOCATION_SCOPES.find((s) => s.id === scopeId);
    if (!organization || !scope) throw new Error("Workspace selection is unavailable");
    return {
      organizations: ORGANIZATIONS,
      organization,
      setOrganizationId,
      user: CURRENT_USER,
      scope,
      setScopeId,
      can,
    };
  }, [organizationId, scopeId, can]);

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace(): WorkspaceValue {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used inside WorkspaceProvider");
  return ctx;
}

/** Permission-aware rendering helper: <Can do="reviews:reply">…</Can> */
export function Can({
  do: permission,
  children,
  fallback = null,
}: {
  do: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { can } = useWorkspace();
  return <>{can(permission) ? children : fallback}</>;
}
