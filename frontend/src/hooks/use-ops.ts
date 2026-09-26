import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  connectIntegration,
  disconnectIntegration,
  exportReport,
  getApiConnections,
  getAuditEvents,
  getIntegrations,
  getNotifications,
  getReports,
  getSyncJobs,
  getSyncOverview,
  markNotificationsRead,
  reconnectIntegration,
  startSync,
  type AuditParams,
  type SyncJobParams,
} from "@/services/opsService";
import type { ListParams } from "@/types/common";

export function useSyncJobs(params: SyncJobParams) {
  return useQuery({
    queryKey: ["sync", "jobs", params],
    queryFn: () => getSyncJobs(params),
    staleTime: 15_000,
    placeholderData: (prev) => prev,
  });
}

export function useSyncOverview() {
  return useQuery({ queryKey: ["sync", "overview"], queryFn: getSyncOverview, staleTime: 15_000 });
}

export function useStartSync() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (scope: string) => startSync(scope),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sync"] });
      toast.success("Sync queued", { description: "Progress appears in the Sync Center." });
    },
    onError: () => toast.error("Unable to queue the sync job"),
  });
}

export function useConnectIntegration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ accountEmail, accountName }: { accountEmail?: string; accountName?: string } = {}) =>
      connectIntegration(accountEmail, accountName),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
      toast.success("Google Account Connected", {
        description: `Successfully connected ${data.accountEmail} (${data.locationsConnected.toLocaleString()} locations).`,
      });
    },
    onError: () => toast.error("Unable to connect Google account"),
  });
}

export function useIntegrations() {
  return useQuery({ queryKey: ["integrations"], queryFn: getIntegrations, staleTime: 60_000 });
}

export function useApiConnections() {
  return useQuery({ queryKey: ["api-connections"], queryFn: getApiConnections, staleTime: 60_000 });
}

export function useReconnectIntegration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reconnectIntegration(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
      toast.success("Google account reconnected", { description: "Sync will resume within a minute." });
    },
    onError: () => toast.error("Reconnection failed", { description: "Google did not return a valid token." }),
  });
}

export function useDisconnectIntegration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => disconnectIntegration(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
      toast.success("Google account disconnected");
    },
    onError: () => toast.error("Unable to disconnect this account"),
  });
}

export function useAuditEvents(params: AuditParams) {
  return useQuery({
    queryKey: ["audit", params],
    queryFn: () => getAuditEvents(params),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });
}

export function useNotifications() {
  return useQuery({ queryKey: ["notifications"], queryFn: getNotifications, staleTime: 30_000 });
}

export function useMarkNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => markNotificationsRead(ids),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

export function useReports(params: ListParams) {
  return useQuery({
    queryKey: ["reports", params],
    queryFn: () => getReports(params),
    staleTime: 60_000,
    placeholderData: (prev) => prev,
  });
}

export function useExportReport() {
  return useMutation({
    mutationFn: (id: string) => exportReport(id),
    onSuccess: () => toast.success("Export ready", { description: "The download link was emailed to you." }),
    onError: () => toast.error("Unable to generate the export"),
  });
}
