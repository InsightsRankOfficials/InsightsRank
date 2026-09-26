import { APP, devLog } from "@/lib/config";
import type { DataMeta, ListParams, Paginated, SortDirection } from "@/types/common";

/**
 * Mock transport layer.
 *
 * Every service call goes through `request()`, which simulates realistic
 * network latency and returns a promise. Swapping the mock repositories for a
 * real HTTP client only requires replacing the body of `request()` (and the
 * per-service resolvers) — no UI changes.
 */

const [MIN, MAX] = APP.mockLatency;

function latency(): number {
  return MIN + Math.random() * (MAX - MIN);
}

export async function request<T>(endpoint: string, resolve: () => T): Promise<T> {
  devLog("api", endpoint);
  await new Promise((r) => setTimeout(r, latency()));
  return resolve();
}

export function nowMeta(overrides: Partial<DataMeta> = {}): DataMeta {
  return {
    lastUpdatedAt: new Date(Date.now() - 4 * 60_000).toISOString(),
    source: "google_business_profile",
    syncStatus: "fresh",
    ...overrides,
  };
}

/**
 * Page a filtered in-memory collection while reporting a simulated backend
 * total, so the UI is written against server-side pagination semantics.
 */
export function paginate<T>(
  rows: T[],
  params: ListParams,
  options: { simulatedTotal?: number; meta?: DataMeta } = {},
): Paginated<T> {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = params.pageSize ?? APP.defaultPageSize;
  const start = (page - 1) * pageSize;
  const data = rows.slice(start, start + pageSize);
  const total = options.simulatedTotal ?? rows.length;

  return {
    data,
    pagination: {
      page,
      pageSize,
      total,
      hasNext: start + pageSize < rows.length,
      hasPrevious: page > 1,
    },
    meta: options.meta ?? nowMeta(),
  };
}

export function sortRows<T>(
  rows: T[],
  sortBy: string | undefined,
  dir: SortDirection = "asc",
): T[] {
  if (!sortBy) return rows;
  const factor = dir === "asc" ? 1 : -1;
  return [...rows].sort((a, b) => {
    const av = (a as Record<string, unknown>)[sortBy];
    const bv = (b as Record<string, unknown>)[sortBy];
    if (typeof av === "number" && typeof bv === "number") return (av - bv) * factor;
    return String(av ?? "").localeCompare(String(bv ?? "")) * factor;
  });
}

export function matchesSearch(haystack: string[], search?: string): boolean {
  if (!search) return true;
  const q = search.trim().toLowerCase();
  if (!q) return true;
  return haystack.some((h) => h.toLowerCase().includes(q));
}

/** Domain error carrying an actionable, human message for error states. */
export class ServiceError extends Error {
  constructor(
    message: string,
    readonly code: string = "unknown_error",
    readonly retryable = true,
  ) {
    super(message);
    this.name = "ServiceError";
  }
}
