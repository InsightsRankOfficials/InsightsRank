import { matchesSearch, paginate, request, sortRows } from "@/api/transport";
import { COMPETITORS } from "@/data/competitors";
import { generateGeoGrid } from "@/data/geo";
import { KEYWORDS } from "@/data/keywords";
import { LOCATIONS } from "@/data/locations";
import type { ListParams, Paginated } from "@/types/common";
import type {
  Competitor,
  GeoGrid,
  Keyword,
  RankMovement,
  RankingOverview,
} from "@/types/ranking";

const SIMULATED_KEYWORD_TOTAL = 482_640;

export interface KeywordListParams extends ListParams {
  locationId?: string;
  device?: "desktop" | "mobile" | "all";
  searchType?: "search" | "maps" | "all";
  competition?: "low" | "medium" | "high" | "all";
  bucket?: "top3" | "top10" | "top20" | "improved" | "declined" | "all";
}

/** GET /keywords */
export function getKeywords(params: KeywordListParams = {}): Promise<Paginated<Keyword>> {
  return request("GET /keywords", () => {
    const filtered = KEYWORDS.filter((k) => {
      if (!matchesSearch([k.term, k.locationName], params.search)) return false;
      if (params.locationId && params.locationId !== "all" && k.locationId !== params.locationId)
        return false;
      if (params.device && params.device !== "all" && k.device !== params.device) return false;
      if (params.searchType && params.searchType !== "all" && k.searchType !== params.searchType)
        return false;
      if (params.competition && params.competition !== "all" && k.competition !== params.competition)
        return false;
      switch (params.bucket) {
        case "top3":
          return k.currentRank <= 3;
        case "top10":
          return k.currentRank <= 10;
        case "top20":
          return k.currentRank <= 20;
        case "improved":
          return k.currentRank < k.previousRank;
        case "declined":
          return k.currentRank > k.previousRank;
        default:
          return true;
      }
    });
    const rows = sortRows(filtered, params.sortBy ?? "currentRank", params.sortDir ?? "asc");
    const ratio = rows.length / KEYWORDS.length;
    return paginate(rows, params, {
      simulatedTotal: Math.max(rows.length, Math.round(ratio * SIMULATED_KEYWORD_TOTAL)),
    });
  });
}

/** GET /rankings/overview */
export function getRankingOverview(locationId?: string): Promise<RankingOverview> {
  return request("GET /rankings/overview", () => {
    const scope = locationId ? KEYWORDS.filter((k) => k.locationId === locationId) : KEYWORDS;
    const avg = scope.reduce((a, k) => a + k.currentRank, 0) / Math.max(1, scope.length);
    const prev = scope.reduce((a, k) => a + k.previousRank, 0) / Math.max(1, scope.length);

    const weeks = 12;
    const trend = Array.from({ length: weeks }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (weeks - 1 - i) * 7);
      const drift = (weeks - i) * 0.22;
      return {
        date: d.toISOString().slice(0, 10),
        you: Number((avg + drift).toFixed(2)),
        competitorAvg: Number((avg + drift + 2.6 - i * 0.05).toFixed(2)),
      };
    });

    return {
      averageRank: Number(avg.toFixed(1)),
      previousAverageRank: Number(prev.toFixed(1)),
      trackedKeywords: locationId ? scope.length : SIMULATED_KEYWORD_TOTAL,
      top3: scope.filter((k) => k.currentRank <= 3).length,
      top10: scope.filter((k) => k.currentRank <= 10).length,
      top20: scope.filter((k) => k.currentRank <= 20).length,
      improved: scope.filter((k) => k.currentRank < k.previousRank).length,
      declined: scope.filter((k) => k.currentRank > k.previousRank).length,
      trend,
    };
  });
}

/** GET /rankings/movements */
export function getRankMovements(): Promise<{ improved: RankMovement[]; declined: RankMovement[] }> {
  return request("GET /rankings/movements", () => {
    const movements: RankMovement[] = LOCATIONS.slice(0, 60).map((l, i) => {
      const keyword = KEYWORDS.at((i * 7) % KEYWORDS.length);
      if (!keyword) throw new Error("At least one keyword is required");
      return {
        locationId: l.id,
        locationName: l.name,
        previousRank: keyword.previousRank,
        currentRank: keyword.currentRank,
        change: keyword.previousRank - keyword.currentRank,
        primaryKeyword: keyword.term,
      };
    });
    return {
      improved: [...movements].sort((a, b) => b.change - a.change).slice(0, 5),
      declined: [...movements].sort((a, b) => a.change - b.change).slice(0, 5),
    };
  });
}

/** GET /competitors */
export function getCompetitors(params: ListParams = {}): Promise<Paginated<Competitor>> {
  return request("GET /competitors", () => {
    const filtered = COMPETITORS.filter((c) => matchesSearch([c.name, ...c.categories], params.search));
    const rows = sortRows(filtered, params.sortBy ?? "visibilityPct", params.sortDir ?? "desc");
    return paginate(rows, { ...params, pageSize: params.pageSize ?? 10 });
  });
}

/** GET /rankings/geo-grid */
export function getGeoGrid(input: {
  keyword: string;
  locationId: string;
  radiusKm: number;
  device: "desktop" | "mobile";
}): Promise<GeoGrid> {
  return request("GET /rankings/geo-grid", () => {
    const location = LOCATIONS.find((l) => l.id === input.locationId) ?? LOCATIONS.at(0);
    if (!location) throw new Error("At least one location is required");
    return generateGeoGrid({
      keyword: input.keyword,
      locationId: location.id,
      locationName: location.name,
      lat: location.lat,
      lng: location.lng,
      radiusKm: input.radiusKm,
      device: input.device,
    });
  });
}
