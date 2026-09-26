import { matchesSearch, paginate, request, ServiceError, sortRows } from "@/api/transport";
import { LOCATION_GROUPS, LOCATIONS } from "@/data/locations";
import type { ListParams, Option, Paginated } from "@/types/common";
import type {
  HealthGrade,
  LocationDetail,
  LocationGroup,
  LocationStatus,
  LocationSummary,
  SyncState,
} from "@/types/location";
import type { BulkOperationResult } from "@/types/ops";
import { PRIMARY_CATEGORIES, REGIONS } from "@/data/categories";

/** Simulated backend scale — the UI must never assume rows.length is the truth. */
const SIMULATED_TOTAL = 128_452;

export interface LocationListParams extends ListParams {
  status?: LocationStatus | "all";
  health?: HealthGrade | "all";
  region?: string;
  group?: string;
  category?: string;
  syncState?: SyncState | "all";
  minRating?: number;
}

function applyFilters(params: LocationListParams): LocationDetail[] {
  return LOCATIONS.filter((l) => {
    if (!matchesSearch([l.name, l.storeCode, l.id, l.city, l.primaryCategory], params.search))
      return false;
    if (params.status && params.status !== "all" && l.status !== params.status) return false;
    if (params.health && params.health !== "all" && l.health.grade !== params.health) return false;
    if (params.region && params.region !== "all" && l.region !== params.region) return false;
    if (params.group && params.group !== "all" && l.group !== params.group) return false;
    if (params.category && params.category !== "all" && l.primaryCategory !== params.category)
      return false;
    if (params.syncState && params.syncState !== "all" && l.syncState !== params.syncState)
      return false;
    if (params.minRating && l.rating < params.minRating) return false;
    return true;
  });
}

/** GET /locations */
export function getLocations(
  params: LocationListParams = {},
): Promise<Paginated<LocationSummary>> {
  return request("GET /locations", () => {
    const filtered = applyFilters(params);
    const rows = sortRows(filtered, params.sortBy ?? "name", params.sortDir ?? "asc");
    const isFiltered = Boolean(
      params.search ||
        (params.status && params.status !== "all") ||
        (params.health && params.health !== "all") ||
        (params.region && params.region !== "all") ||
        (params.group && params.group !== "all") ||
        (params.category && params.category !== "all") ||
        (params.syncState && params.syncState !== "all") ||
        params.minRating,
    );
    // Unfiltered queries report the full simulated backend total.
    const simulatedTotal = isFiltered
      ? Math.round((rows.length / LOCATIONS.length) * SIMULATED_TOTAL)
      : SIMULATED_TOTAL;
    return paginate(rows, params, { simulatedTotal: Math.max(rows.length, simulatedTotal) });
  });
}

/** GET /locations/:id */
export function getLocation(id: string): Promise<LocationDetail> {
  return request(`GET /locations/${id}`, () => {
    const found = LOCATIONS.find(
      (l) => l.id === id || l.storeCode === id || l.name.toLowerCase() === id.toLowerCase()
    );
    return found || LOCATIONS[0];
  });
}

/** PATCH /locations/:id */
export function updateLocation(
  id: string,
  payload: Partial<LocationDetail>,
): Promise<LocationDetail> {
  return request(`PATCH /locations/${id}`, () => {
    const index = LOCATIONS.findIndex((l) => l.id === id);
    if (index < 0)
      throw new ServiceError("Unable to update this location — it no longer exists.", "not_found", false);
    const current = LOCATIONS.at(index);
    if (!current) throw new ServiceError("Unable to update this location — it no longer exists.", "not_found", false);
    const updated: LocationDetail = { ...current, ...payload };
    LOCATIONS[index] = updated;
    return updated;
  });
}

/** POST /locations/:id/sync */
export function syncLocation(id: string): Promise<{ jobId: string }> {
  return request(`POST /locations/${id}/sync`, () => ({ jobId: `job_${Date.now()}` }));
}

/** GET /location-groups */
export function getLocationGroups(): Promise<LocationGroup[]> {
  return request("GET /location-groups", () => LOCATION_GROUPS);
}

export interface LocationHealthSummary {
  healthy: number;
  needsAttention: number;
  critical: number;
  disconnected: number;
  total: number;
  topIssues: { title: string; locations: number; severity: "critical" | "warning" | "info" }[];
}

/** GET /locations/health-summary */
export function getLocationHealthSummary(): Promise<LocationHealthSummary> {
  return request("GET /locations/health-summary", () => {
    const share = (grade: HealthGrade) =>
      LOCATIONS.filter((l) => l.health.grade === grade).length / LOCATIONS.length;

    const issueMap = new Map<string, { count: number; severity: "critical" | "warning" | "info" }>();
    for (const l of LOCATIONS) {
      for (const issue of l.health.issues) {
        const existing = issueMap.get(issue.title);
        issueMap.set(issue.title, {
          count: (existing?.count ?? 0) + 1,
          severity: issue.severity,
        });
      }
    }

    return {
      total: SIMULATED_TOTAL,
      healthy: Math.round(share("healthy") * SIMULATED_TOTAL),
      needsAttention: Math.round(share("needs_attention") * SIMULATED_TOTAL),
      critical: Math.round(share("critical") * SIMULATED_TOTAL),
      disconnected: Math.round(share("disconnected") * SIMULATED_TOTAL),
      topIssues: [...issueMap.entries()]
        .map(([title, v]) => ({
          title,
          severity: v.severity,
          locations: Math.round((v.count / LOCATIONS.length) * SIMULATED_TOTAL),
        }))
        .sort((a, b) => b.locations - a.locations)
        .slice(0, 6),
    };
  });
}

/** POST /locations/bulk */
export function runBulkOperation(input: {
  action: string;
  selectedCount: number;
}): Promise<BulkOperationResult> {
  return request("POST /locations/bulk", () => {
    const failed = Math.round(input.selectedCount * 0.025);
    const skipped = Math.round(input.selectedCount * 0.006);
    return {
      operationId: `bulk_${Date.now()}`,
      completed: input.selectedCount - failed - skipped,
      failed,
      skipped,
      errors: [
        { locationName: "Demo Store 140, Mumbai", reason: "Google connection expired" },
        { locationName: "Demo Store 108, Ahmedabad", reason: "Duplicate listing pending review" },
        { locationName: "Demo Store 170, Lucknow", reason: "Category not valid for this country" },
      ],
    };
  });
}

/** Filter option sources — replaceable by a facets endpoint later. */
export function getLocationFilterOptions(): Promise<{
  regions: Option[];
  groups: Option[];
  categories: Option[];
}> {
  return request("GET /locations/facets", () => ({
    regions: REGIONS.map((r) => ({ label: r, value: r })),
    groups: [...new Set(LOCATIONS.map((l) => l.group))].map((g) => ({ label: g, value: g })),
    categories: PRIMARY_CATEGORIES.map((c) => ({ label: c, value: c })),
  }));
}
