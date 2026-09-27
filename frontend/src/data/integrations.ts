import type { Integration } from "@/types/ops";
import { DEFAULT_ORGANIZATION_ID } from "./organizations";

const SCOPES = [
  "business.manage",
  "plus.business.manage",
  "userinfo.email",
];

export const INTEGRATIONS: Integration[] = [
  {
    id: "int_1",
    organizationId: DEFAULT_ORGANIZATION_ID,
    provider: "google_business_profile",
    accountEmail: "ops@insightsrank.com",
    accountName: "InsightsRank Operations",
    status: "connected",
    locationsConnected: 84_206,
    lastSyncAt: new Date(Date.now() - 4 * 60_000).toISOString(),
    nextSyncAt: new Date(Date.now() + 26 * 60_000).toISOString(),
    tokenExpiresAt: new Date(Date.now() + 41 * 86_400_000).toISOString(),
    scopes: SCOPES,
  },
  {
    id: "int_2",
    organizationId: DEFAULT_ORGANIZATION_ID,
    provider: "google_business_profile",
    accountEmail: "gbp-north@insightsrank.com",
    accountName: "North Region GBP",
    status: "needs_attention",
    locationsConnected: 31_204,
    lastSyncAt: new Date(Date.now() - 9 * 60 * 60_000).toISOString(),
    nextSyncAt: new Date(Date.now() + 51 * 60_000).toISOString(),
    tokenExpiresAt: new Date(Date.now() + 3 * 86_400_000).toISOString(),
    scopes: SCOPES,
    message:
      "Access token expires in 3 days. Reconnect to avoid interrupting insight and review sync for 31,204 locations.",
  },
  {
    id: "int_3",
    organizationId: DEFAULT_ORGANIZATION_ID,
    provider: "google_business_profile",
    accountEmail: "gbp-south@insightsrank.com",
    accountName: "South Region GBP",
    status: "expired",
    locationsConnected: 12_842,
    lastSyncAt: new Date(Date.now() - 3 * 86_400_000).toISOString(),
    nextSyncAt: "",
    tokenExpiresAt: new Date(Date.now() - 2 * 86_400_000).toISOString(),
    scopes: SCOPES,
    message:
      "The Google connection expired 2 days ago. 12,842 locations are serving stale data until it is reconnected.",
  },
  {
    id: "int_4",
    organizationId: DEFAULT_ORGANIZATION_ID,
    provider: "google_business_profile",
    accountEmail: "franchise-partners@insightsrank.com",
    accountName: "Franchise Partner Group",
    status: "disconnected",
    locationsConnected: 0,
    lastSyncAt: "",
    nextSyncAt: "",
    tokenExpiresAt: "",
    scopes: [],
    message: "Never connected. Connect to onboard 8,412 partner-managed locations.",
  },
];

export interface ApiConnectionHealth {
  id: string;
  name: string;
  endpoint: string;
  status: "healthy" | "degraded" | "error";
  successRatePct: number;
  p95LatencyMs: number;
  quotaUsedPct: number;
  requests24h: number;
}

export const API_CONNECTIONS: ApiConnectionHealth[] = [
  {
    id: "api_gbp_info",
    name: "Business Information API",
    endpoint: "mybusinessbusinessinformation.googleapis.com",
    status: "healthy",
    successRatePct: 99.94,
    p95LatencyMs: 412,
    quotaUsedPct: 46,
    requests24h: 1_284_902,
  },
  {
    id: "api_gbp_perf",
    name: "Business Profile Performance API",
    endpoint: "businessprofileperformance.googleapis.com",
    status: "degraded",
    successRatePct: 97.1,
    p95LatencyMs: 1_824,
    quotaUsedPct: 88,
    requests24h: 842_118,
  },
  {
    id: "api_gbp_reviews",
    name: "Reviews API",
    endpoint: "mybusiness.googleapis.com/v4",
    status: "healthy",
    successRatePct: 99.62,
    p95LatencyMs: 688,
    quotaUsedPct: 61,
    requests24h: 412_664,
  },
  {
    id: "api_rank_crawler",
    name: "Rank Crawler (internal)",
    endpoint: "rank-crawler.internal.insightsrank.com",
    status: "error",
    successRatePct: 81.4,
    p95LatencyMs: 4_920,
    quotaUsedPct: 34,
    requests24h: 98_204,
  },
];
