import type { TrendPoint } from "./common";

export interface Keyword {
  id: string;
  organizationId: string;
  term: string;
  locationId: string;
  locationName: string;
  currentRank: number;
  previousRank: number;
  bestRank: number;
  searchVolume: number;
  competition: "low" | "medium" | "high";
  device: "desktop" | "mobile";
  searchType: "search" | "maps";
  lastCheckedAt: string;
  trend: TrendPoint[];
}

export interface RankingOverview {
  averageRank: number;
  previousAverageRank: number;
  trackedKeywords: number;
  top3: number;
  top10: number;
  top20: number;
  improved: number;
  declined: number;
  trend: { date: string; you: number; competitorAvg: number }[];
}

export interface RankMovement {
  locationId: string;
  locationName: string;
  previousRank: number;
  currentRank: number;
  change: number;
  primaryKeyword: string;
}

export interface Competitor {
  id: string;
  organizationId: string;
  name: string;
  locations: number;
  averageRank: number;
  rating: number;
  reviews: number;
  visibilityPct: number;
  trendPct: number;
  categories: string[];
  keywordOverlapPct: number;
}

export interface GeoGridPoint {
  id: string;
  lat: number;
  lng: number;
  row: number;
  col: number;
  rank: number;
}

export interface GeoGrid {
  keyword: string;
  locationId: string;
  locationName: string;
  radiusKm: number;
  device: "desktop" | "mobile";
  capturedAt: string;
  averageRank: number;
  size: number;
  points: GeoGridPoint[];
}
