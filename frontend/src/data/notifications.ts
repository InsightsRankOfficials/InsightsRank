import type { AppNotification } from "@/types/ops";
import { DEFAULT_ORGANIZATION_ID } from "./organizations";

const mins = (m: number) => new Date(Date.now() - m * 60_000).toISOString();

export const NOTIFICATIONS: AppNotification[] = [
  {
    id: "ntf_1",
    organizationId: DEFAULT_ORGANIZATION_ID,
    title: "412 locations failed to sync",
    description: "Performance API returned 429 for the North region batch. Retry scheduled in 12 minutes.",
    category: "sync",
    priority: "high",
    createdAt: mins(6),
    read: false,
  },
  {
    id: "ntf_2",
    organizationId: DEFAULT_ORGANIZATION_ID,
    title: "Google connection requires attention",
    description: "gbp-south@global360.com expired — 12,842 locations are serving stale data.",
    category: "integrations",
    priority: "high",
    createdAt: mins(48),
    read: false,
  },
  {
    id: "ntf_3",
    organizationId: DEFAULT_ORGANIZATION_ID,
    title: "94 unanswered reviews",
    description: "34 are 1–2 star and older than 24 hours across 18 locations.",
    category: "reviews",
    priority: "medium",
    createdAt: mins(126),
    read: false,
  },
  {
    id: "ntf_4",
    organizationId: DEFAULT_ORGANIZATION_ID,
    title: "Ranking dropped for 5 keywords",
    description: "\"running shoes mumbai\" fell from position 4 to 12 in the last crawl.",
    category: "rankings",
    priority: "medium",
    createdAt: mins(240),
    read: true,
  },
  {
    id: "ntf_5",
    organizationId: DEFAULT_ORGANIZATION_ID,
    title: "Monthly executive report ready",
    description: "September performance summary generated for 128,452 locations.",
    category: "reports",
    priority: "low",
    createdAt: mins(720),
    read: true,
  },
  {
    id: "ntf_6",
    organizationId: DEFAULT_ORGANIZATION_ID,
    title: "Bulk category update completed",
    description: "2,421 completed · 62 failed · 14 skipped.",
    category: "bulk",
    priority: "low",
    createdAt: mins(1_440),
    read: true,
  },
];
