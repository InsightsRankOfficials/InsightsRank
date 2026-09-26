import { nowMeta, request } from "@/api/transport";
import { generateRegionBreakdown, generateSeries } from "@/data/analytics";
import { granularityFor, resolveRange, type RangePreset } from "@/lib/date-range";
import type { DataMeta, MetricDelta } from "@/types/common";
import type { AnalyticsSummary, MetricKey } from "@/types/analytics";

const METRIC_KEYS: MetricKey[] = [
  "totalImpressions",
  "searchImpressions",
  "mapsImpressions",
  "desktopSearch",
  "mobileSearch",
  "desktopMaps",
  "mobileMaps",
  "websiteClicks",
  "phoneCalls",
  "directionRequests",
  "messages",
  "bookings",
];

export const METRIC_LABELS: Record<MetricKey, string> = {
  totalImpressions: "Total impressions",
  searchImpressions: "Search impressions",
  mapsImpressions: "Maps impressions",
  desktopSearch: "Desktop search",
  mobileSearch: "Mobile search",
  desktopMaps: "Desktop maps",
  mobileMaps: "Mobile maps",
  websiteClicks: "Website clicks",
  phoneCalls: "Phone calls",
  directionRequests: "Direction requests",
  messages: "Messages",
  bookings: "Bookings",
};

export interface AnalyticsParams {
  preset: RangePreset;
  from?: string;
  to?: string;
  locationId?: string;
  region?: string;
}

function delta(value: number, previous: number, higherIsBetter = true): MetricDelta {
  const changePct = previous === 0 ? 0 : ((value - previous) / previous) * 100;
  return {
    value,
    previous,
    changePct: Number(changePct.toFixed(1)),
    direction: changePct > 0.5 ? "up" : changePct < -0.5 ? "down" : "flat",
    higherIsBetter,
  };
}

/** GET /analytics */
export function getAnalyticsSummary(
  params: AnalyticsParams,
): Promise<AnalyticsSummary & { meta: DataMeta }> {
  return request("GET /analytics", () => {
    const range = resolveRange(params.preset, params.from, params.to);
    const granularity = granularityFor(range.days);
    const scopeKey = `${params.locationId ?? "all"}:${params.region ?? "all"}:${range.days}`;

    const series = generateSeries(range.from, range.to, granularity, scopeKey);
    const prevFrom = new Date(range.from.getTime() - range.days * 86_400_000);
    const prevTo = new Date(range.to.getTime() - range.days * 86_400_000);
    const previousSeries = generateSeries(prevFrom, prevTo, granularity, `${scopeKey}:prev`);

    const sum = (rows: typeof series, key: keyof (typeof series)[number]) =>
      rows.reduce((a, r) => a + (typeof r[key] === "number" ? (r[key] as number) : 0), 0);

    const totalsFor = (rows: typeof series): Record<MetricKey, number> => {
      const searchImpressions = sum(rows, "searchImpressions");
      const mapsImpressions = sum(rows, "mapsImpressions");
      return {
        totalImpressions: searchImpressions + mapsImpressions,
        searchImpressions,
        mapsImpressions,
        desktopSearch: sum(rows, "desktopSearch"),
        mobileSearch: sum(rows, "mobileSearch"),
        desktopMaps: sum(rows, "desktopMaps"),
        mobileMaps: sum(rows, "mobileMaps"),
        websiteClicks: sum(rows, "websiteClicks"),
        phoneCalls: sum(rows, "phoneCalls"),
        directionRequests: sum(rows, "directionRequests"),
        messages: sum(rows, "messages"),
        bookings: sum(rows, "bookings"),
      };
    };

    const totals = totalsFor(series);
    const previousTotals = totalsFor(previousSeries);

    const deltas = METRIC_KEYS.reduce(
      (acc, key) => {
        acc[key] = delta(totals[key], previousTotals[key]);
        return acc;
      },
      {} as Record<MetricKey, MetricDelta>,
    );

    return {
      totals,
      deltas,
      series,
      deviceSplit: [
        { name: "Mobile search", value: totals.mobileSearch },
        { name: "Desktop search", value: totals.desktopSearch },
        { name: "Mobile maps", value: totals.mobileMaps },
        { name: "Desktop maps", value: totals.desktopMaps },
      ],
      regionBreakdown: generateRegionBreakdown(scopeKey),
      meta: nowMeta(),
    };
  });
}
