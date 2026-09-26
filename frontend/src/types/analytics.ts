import type { MetricDelta } from "./common";

export type MetricKey =
  | "totalImpressions"
  | "searchImpressions"
  | "mapsImpressions"
  | "desktopSearch"
  | "mobileSearch"
  | "desktopMaps"
  | "mobileMaps"
  | "websiteClicks"
  | "phoneCalls"
  | "directionRequests"
  | "messages"
  | "bookings";

export interface AnalyticsSeriesPoint {
  date: string;
  searchImpressions: number;
  mapsImpressions: number;
  websiteClicks: number;
  phoneCalls: number;
  directionRequests: number;
  messages: number;
  bookings: number;
  desktopSearch: number;
  mobileSearch: number;
  desktopMaps: number;
  mobileMaps: number;
}

export interface AnalyticsSummary {
  totals: Record<MetricKey, number>;
  deltas: Record<MetricKey, MetricDelta>;
  series: AnalyticsSeriesPoint[];
  deviceSplit: { name: string; value: number }[];
  regionBreakdown: { region: string; searchImpressions: number; mapsImpressions: number }[];
}
