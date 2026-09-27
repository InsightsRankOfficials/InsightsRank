import type {
  BusinessHours,
  HealthGrade,
  LocationDetail,
  LocationGroup,
  LocationIssue,
  LocationStatus,
  SyncState,
} from "@/types/location";
import { createRng, floatBetween, intBetween, pick } from "@/lib/random";
import {
  ADDITIONAL_CATEGORIES,
  ATTRIBUTES,
  CITIES,
  LOCATION_GROUP_NAMES,
  PRIMARY_CATEGORIES,
  SERVICES,
} from "./categories";
import { DEFAULT_ORGANIZATION_ID, ORGANIZATIONS } from "./organizations";
import { USERS } from "./users";

/**
 * The mock dataset intentionally holds ~180 rich records while the reported
 * totals simulate a multi-million-row backend (see locationRepository).
 */
const LOCATION_COUNT = 180;

const STATUSES: LocationStatus[] = ["published", "published", "published", "pending", "suspended", "duplicate"];
const SYNC_STATES: SyncState[] = ["synced", "synced", "synced", "syncing", "queued", "failed"];

const ISSUE_POOL: Omit<LocationIssue, "id">[] = [
  {
    severity: "critical",
    title: "Google connection expired",
    detail: "The OAuth token for this location's Google account expired 3 days ago.",
  },
  {
    severity: "critical",
    title: "Duplicate listing detected",
    detail: "A duplicate profile with a similar name exists within 400m.",
  },
  {
    severity: "warning",
    title: "Business hours incomplete",
    detail: "Sunday hours are missing, which suppresses the profile in evening searches.",
  },
  {
    severity: "warning",
    title: "Fewer than 5 photos",
    detail: "Profiles with 10+ photos receive around 35% more direction requests.",
  },
  {
    severity: "warning",
    title: "24 unanswered reviews",
    detail: "Response rate for this location is below the 90% organisation target.",
  },
  {
    severity: "info",
    title: "No posts in 30 days",
    detail: "Regular posts keep the profile active in Discovery surfaces.",
  },
  {
    severity: "info",
    title: "Description below 400 characters",
    detail: "Richer descriptions improve keyword coverage.",
  },
];

function buildHours(rng: () => number): BusinessHours[] {
  const days: BusinessHours["day"][] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  return days.map((day) => ({
    day,
    open: day === "sun" ? "11:00" : "10:00",
    close: day === "sat" || day === "sun" ? "22:00" : "21:00",
    closed: day === "sun" && rng() < 0.15,
  }));
}

function gradeFor(score: number, syncState: SyncState): HealthGrade {
  if (syncState === "failed") return "disconnected";
  if (score >= 85) return "healthy";
  if (score >= 65) return "needs_attention";
  return "critical";
}

function buildLocations(): LocationDetail[] {
  const rng = createRng(451_337);
  const out: LocationDetail[] = [];

  for (let i = 0; i < LOCATION_COUNT; i++) {
    const place = CITIES.at(i % CITIES.length);
    if (!place) throw new Error("At least one city is required");
    const status = pick(rng, STATUSES);
    const syncState = pick(rng, SYNC_STATES);
    const score = intBetween(rng, 42, 99);
    const grade = gradeFor(score, syncState);
    const ratingValue = Number(floatBetween(rng, 3.2, 4.9).toFixed(1));
    const reviewCount = intBetween(rng, 12, 1840);
    const issueCount = grade === "healthy" ? intBetween(rng, 0, 1) : intBetween(rng, 1, 3);
    const issues: LocationIssue[] = Array.from({ length: issueCount }, (_, n) => {
      const base = ISSUE_POOL.at((i + n * 3) % ISSUE_POOL.length);
      if (!base) throw new Error("At least one location issue is required");
      return { ...base, id: `iss_${i}_${n}` };
    });
    const storeNumber = 100 + i;
    const org = i % 9 === 0 ? pick(rng, ORGANIZATIONS).id : DEFAULT_ORGANIZATION_ID;

    out.push({
      id: `loc_${storeNumber}`,
      organizationId: org,
      name: `Demo Store ${storeNumber}, ${place.city}`,
      storeCode: `IR-${place.city.slice(0, 3).toUpperCase()}-${storeNumber}`,
      status,
      primaryCategory: pick(rng, PRIMARY_CATEGORIES),
      city: place.city,
      region: place.region,
      country: "India",
      group: pick(rng, LOCATION_GROUP_NAMES),
      rating: ratingValue,
      reviewCount,
      lastSyncAt: new Date(Date.now() - intBetween(rng, 3, 6_000) * 60_000).toISOString(),
      syncState,
      health: { grade, score, completeness: Math.min(100, score + intBetween(rng, 0, 8)), issues },
      averageRank: Number(floatBetween(rng, 1.4, 21).toFixed(1)),
      lat: place.lat + floatBetween(rng, -0.08, 0.08),
      lng: place.lng + floatBetween(rng, -0.08, 0.08),
      description: `Demo Store ${storeNumber} in ${place.city} offers the full product range with in-store pickup, expert fitting and same-day delivery across the metro area. Our team supports corporate orders and after-sales service six days a week.`,
      addressLine1: `${intBetween(rng, 1, 240)} ${pick(rng, ["MG Road", "Ring Road", "Link Road", "Station Road", "Sector 21 Market"])}`,
      postalCode: String(intBetween(rng, 110001, 799999)),
      phone: `+91 ${intBetween(rng, 70, 99)}${intBetween(rng, 10000000, 99999999)}`,
      website: `https://demo-brand.example.com/stores/${storeNumber}`,
      bookingUrl: `https://demo-brand.example.com/book/${storeNumber}`,
      additionalCategories: [pick(rng, ADDITIONAL_CATEGORIES), pick(rng, ADDITIONAL_CATEGORIES)].filter(
        (v, idx, arr) => arr.indexOf(v) === idx,
      ),
      attributes: [...ATTRIBUTES].slice(0, intBetween(rng, 3, 7)),
      services: [...SERVICES].slice(0, intBetween(rng, 2, 5)),
      hours: buildHours(rng),
      googleLocationId: `accounts/1128${intBetween(rng, 100000, 999999)}/locations/${intBetween(rng, 100000000, 999999999)}`,
      googleAccount: pick(rng, ["ops@insightsrank.com", "gbp-north@insightsrank.com", "gbp-south@insightsrank.com"]),
      impressions: intBetween(rng, 4_000, 210_000),
      calls: intBetween(rng, 40, 4_200),
      websiteClicks: intBetween(rng, 90, 9_800),
      directionRequests: intBetween(rng, 120, 12_400),
      photoCount: intBetween(rng, 2, 68),
      postCount: intBetween(rng, 0, 42),
    });
  }
  return out;
}

export const LOCATIONS: LocationDetail[] = buildLocations();

function buildGroups(): LocationGroup[] {
  const rng = createRng(77_711);
  return LOCATION_GROUP_NAMES.map((name, i) => {
    const members = LOCATIONS.filter((l) => l.group === name);
    const healthy = members.filter((l) => l.health.grade === "healthy").length;
    return {
      id: `grp_${i + 1}`,
      organizationId: DEFAULT_ORGANIZATION_ID,
      name,
      region: pick(rng, [...new Set(members.map((m) => m.region))].length ? [...new Set(members.map((m) => m.region))] : ["North India"]),
      locationCount: intBetween(rng, 1_200, 42_000),
      averageRating: Number(
        (members.reduce((a, l) => a + l.rating, 0) / Math.max(1, members.length)).toFixed(1),
      ),
      healthyPct: Math.round((healthy / Math.max(1, members.length)) * 100),
      owner: USERS.at((i + 1) % USERS.length)?.name ?? "Unassigned",
    };
  });
}

export const LOCATION_GROUPS: LocationGroup[] = buildGroups();
