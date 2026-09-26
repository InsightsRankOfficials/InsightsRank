import { useQuery } from "@tanstack/react-query";

import { getTeams } from "@/services/organizationService";
import { getRoles, getUsers, type UserListParams } from "@/services/userService";

export function useUsers(params: UserListParams) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
    staleTime: 60_000,
    placeholderData: (prev) => prev,
  });
}

export function useRoles() {
  return useQuery({ queryKey: ["roles"], queryFn: getRoles, staleTime: Infinity });
}

export function useTeams(organizationId: string) {
  return useQuery({
    queryKey: ["teams", organizationId],
    queryFn: () => getTeams(organizationId),
    staleTime: 300_000,
  });
}
