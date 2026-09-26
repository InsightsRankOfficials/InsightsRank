import type { Keyword } from "@/types/ranking";
import { createRng, floatBetween, intBetween, pick } from "@/lib/random";
import { LOCATIONS } from "./locations";
import { DEFAULT_ORGANIZATION_ID } from "./organizations";

const TERMS = [
  "shoe store near me", "running shoes {city}", "sports shoes shop", "formal shoes {city}",
  "sneakers outlet", "school shoes near me", "branded footwear {city}", "shoe repair near me",
  "kids shoes shop", "leather shoes {city}", "women's sandals near me", "sports store {city}",
  "shoe showroom open now", "best shoe shop {city}", "walking shoes near me",
  "canvas shoes shop {city}", "trekking shoes near me", "shoe sale {city}",
  "footwear store open sunday", "orthopedic shoes near me",
];

function buildTrend(rng: () => number, current: number) {
  const points: { date: string; value: number }[] = [];
  let value = current + intBetween(rng, -6, 6);
  for (let i = 11; i >= 0; i--) {
    value = Math.min(24, Math.max(1, value + intBetween(rng, -2, 2)));
    const d = new Date();
    d.setDate(d.getDate() - i * 7);
    points.push({ date: d.toISOString().slice(0, 10), value: i === 0 ? current : value });
  }
  return points;
}

function buildKeywords(): Keyword[] {
  const rng = createRng(31_415_926);
  const out: Keyword[] = [];

  for (let i = 0; i < 240; i++) {
    const location = LOCATIONS.at(i % LOCATIONS.length);
    if (!location) throw new Error("At least one location is required");
    const term = pick(rng, TERMS).replace("{city}", location.city.toLowerCase());
    const currentRank = Math.max(1, Math.round(floatBetween(rng, 1, 24)));
    const previousRank = Math.max(1, Math.min(24, currentRank + intBetween(rng, -8, 8)));

    out.push({
      id: `kw_${5_000 + i}`,
      organizationId: DEFAULT_ORGANIZATION_ID,
      term,
      locationId: location.id,
      locationName: location.name,
      currentRank,
      previousRank,
      bestRank: Math.max(1, Math.min(currentRank, previousRank) - intBetween(rng, 0, 3)),
      searchVolume: intBetween(rng, 120, 74_000),
      competition: pick(rng, ["low", "medium", "high"] as const),
      device: pick(rng, ["desktop", "mobile"] as const),
      searchType: pick(rng, ["search", "maps"] as const),
      lastCheckedAt: new Date(Date.now() - intBetween(rng, 10, 2_800) * 60_000).toISOString(),
      trend: buildTrend(rng, currentRank),
    });
  }
  return out;
}

export const KEYWORDS: Keyword[] = buildKeywords();
