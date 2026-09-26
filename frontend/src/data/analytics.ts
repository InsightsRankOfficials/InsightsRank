import type { AnalyticsSeriesPoint } from "@/types/analytics";
import { createRng, floatBetween, hashSeed, intBetween } from "@/lib/random";
import { REGIONS } from "./categories";

/**
 * Analytics are generated on demand for a requested window so the mock layer
 * behaves like a time-series API instead of a static array.
 */
export function generateSeries(
  from: Date,
  to: Date,
  granularity: "day" | "week" | "month",
  scopeKey: string,
): AnalyticsSeriesPoint[] {
  const rng = createRng(hashSeed(`${scopeKey}:${granularity}`) || 7);
  const stepDays = granularity === "day" ? 1 : granularity === "week" ? 7 : 30;
  const points: AnalyticsSeriesPoint[] = [];

  const totalSteps = Math.max(
    1,
    Math.ceil((to.getTime() - from.getTime()) / (stepDays * 86_400_000)) + 1,
  );
  const scale = stepDays;

  for (let i = 0; i < totalSteps; i++) {
    const date = new Date(from.getTime() + i * stepDays * 86_400_000);
    if (date > to) break;
    // Seasonal wave + gentle growth so charts read like real traffic.
    const wave = 1 + 0.18 * Math.sin((i / totalSteps) * Math.PI * 2.2);
    const growth = 1 + (i / Math.max(1, totalSteps)) * 0.22;
    const noise = floatBetween(rng, 0.9, 1.12);
    const base = 8_400 * scale * wave * growth * noise;

    const desktopSearch = Math.round(base * 0.22);
    const mobileSearch = Math.round(base * 0.46);
    const desktopMaps = Math.round(base * 0.09);
    const mobileMaps = Math.round(base * 0.23);

    points.push({
      date: date.toISOString().slice(0, 10),
      desktopSearch,
      mobileSearch,
      desktopMaps,
      mobileMaps,
      searchImpressions: desktopSearch + mobileSearch,
      mapsImpressions: desktopMaps + mobileMaps,
      websiteClicks: Math.round(base * 0.058),
      phoneCalls: Math.round(base * 0.031),
      directionRequests: Math.round(base * 0.072),
      messages: Math.round(base * 0.009),
      bookings: Math.round(base * 0.004),
    });
  }
  return points;
}

export function generateRegionBreakdown(scopeKey: string) {
  const rng = createRng(hashSeed(`region:${scopeKey}`) || 11);
  return REGIONS.map((region) => ({
    region,
    searchImpressions: intBetween(rng, 480, 3_900),
    mapsImpressions: intBetween(rng, 240, 2_400),
  }));
}
