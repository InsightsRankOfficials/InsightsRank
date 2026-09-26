import { useQuery } from "@tanstack/react-query";

import { globalSearch } from "@/services/searchService";
import { useDebouncedValue } from "./use-debounced-value";

export function useGlobalSearch(query: string) {
  const debounced = useDebouncedValue(query, 250);
  return useQuery({
    queryKey: ["global-search", debounced],
    queryFn: () => globalSearch(debounced),
    enabled: debounced.trim().length >= 2,
    staleTime: 30_000,
  });
}
