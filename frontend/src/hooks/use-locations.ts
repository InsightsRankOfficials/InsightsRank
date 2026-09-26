import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  getLocation,
  getLocationFilterOptions,
  getLocationGroups,
  getLocationHealthSummary,
  getLocations,
  runBulkOperation,
  syncLocation,
  updateLocation,
  type LocationListParams,
} from "@/services/locationService";
import type { LocationDetail } from "@/types/location";

const KEY = "locations";

export function useLocations(params: LocationListParams) {
  return useQuery({
    queryKey: [KEY, "list", params],
    queryFn: () => getLocations(params),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });
}

export function useLocation(id: string) {
  return useQuery({
    queryKey: [KEY, "detail", id],
    queryFn: () => getLocation(id),
    staleTime: 60_000,
  });
}

export function useLocationGroups() {
  return useQuery({ queryKey: [KEY, "groups"], queryFn: getLocationGroups, staleTime: 300_000 });
}

export function useLocationHealthSummary() {
  return useQuery({
    queryKey: [KEY, "health-summary"],
    queryFn: getLocationHealthSummary,
    staleTime: 120_000,
  });
}

export function useLocationFilterOptions() {
  return useQuery({
    queryKey: [KEY, "facets"],
    queryFn: getLocationFilterOptions,
    staleTime: Infinity,
  });
}

export function useUpdateLocation(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<LocationDetail>) => updateLocation(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY, "detail", id] });
      queryClient.invalidateQueries({ queryKey: [KEY, "list"] });
      toast.success("Location updated", { description: "Changes will publish to Google on the next sync." });
    },
    onError: (error: Error) =>
      toast.error("Unable to save changes", {
        description: error.message || "The Google connection may have expired.",
      }),
  });
}

export function useSyncLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => syncLocation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY] });
      toast.success("Sync started", { description: "We'll refresh insights when the job completes." });
    },
    onError: () => toast.error("Unable to start the sync", { description: "Try again in a moment." }),
  });
}

export function useBulkLocationOperation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: runBulkOperation,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: [KEY, "list"] });
      toast.success("Bulk operation completed", {
        description: `${result.completed.toLocaleString()} completed · ${result.failed.toLocaleString()} failed · ${result.skipped.toLocaleString()} skipped`,
      });
    },
    onError: () => toast.error("The bulk operation could not be queued"),
  });
}
