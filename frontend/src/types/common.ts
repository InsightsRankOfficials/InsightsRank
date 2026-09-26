/** Shared primitives for every domain. Mirrors the future REST contract. */

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface Paginated<T> {
  data: T[];
  pagination: Pagination;
  /** Server-reported freshness of the underlying dataset. */
  meta?: DataMeta;
}

export interface DataMeta {
  lastUpdatedAt: string;
  source: "google_business_profile" | "internal" | "cache";
  syncStatus: "fresh" | "stale" | "syncing" | "error";
}

export type SortDirection = "asc" | "desc";

export interface ListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDir?: SortDirection;
  organizationId?: string;
}

export interface DateRangeParams {
  from?: string;
  to?: string;
}

export interface TrendPoint {
  date: string;
  value: number;
}

export interface MetricDelta {
  value: number;
  previous: number;
  changePct: number;
  direction: "up" | "down" | "flat";
  /** Whether an upward move is good (impressions) or bad (rank position). */
  higherIsBetter: boolean;
}

export interface Option {
  label: string;
  value: string;
  count?: number;
}
