import { useQuery } from "@tanstack/react-query";

import {
  getCompetitors,
  getGeoGrid,
  getKeywords,
  getRankMovements,
  getRankingOverview,
  type KeywordListParams,
} from "@/services/rankingService";
import type { ListParams } from "@/types/common";

const KEY = "rankings";

export function useRankingOverview(locationId?: string) {
  return useQuery({
    queryKey: [KEY, "overview", locationId ?? "all"],
    queryFn: () => getRankingOverview(locationId),
    staleTime: 120_000,
  });
}

export function useKeywords(params: KeywordListParams) {
  return useQuery({
    queryKey: [KEY, "keywords", params],
    queryFn: () => getKeywords(params),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });
}

export function useRankMovements() {
  return useQuery({ queryKey: [KEY, "movements"], queryFn: getRankMovements, staleTime: 120_000 });
}

export function useCompetitors(params: ListParams) {
  return useQuery({
    queryKey: [KEY, "competitors", params],
    queryFn: () => getCompetitors(params),
    staleTime: 120_000,
    placeholderData: (prev) => prev,
  });
}

export function useGeoGrid(input: {
  keyword: string;
  locationId: string;
  radiusKm: number;
  device: "desktop" | "mobile";
}) {
  return useQuery({
    queryKey: [KEY, "geo-grid", input],
    queryFn: () => getGeoGrid(input),
    staleTime: 120_000,
  });
}
