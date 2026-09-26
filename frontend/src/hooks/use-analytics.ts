import { useQuery } from "@tanstack/react-query";

import { getAnalyticsSummary, type AnalyticsParams } from "@/services/analyticsService";

export function useAnalytics(params: AnalyticsParams) {
  return useQuery({
    queryKey: ["analytics", params],
    queryFn: () => getAnalyticsSummary(params),
    staleTime: 60_000,
    placeholderData: (prev) => prev,
  });
}
