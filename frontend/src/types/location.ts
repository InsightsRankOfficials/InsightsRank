export type LocationStatus = "published" | "pending" | "suspended" | "duplicate";

export type HealthGrade = "healthy" | "needs_attention" | "critical" | "disconnected";

export type SyncState = "synced" | "syncing" | "queued" | "failed" | "never";

export interface LocationHealth {
  grade: HealthGrade;
  score: number;
  completeness: number;
  issues: LocationIssue[];
}

export interface LocationIssue {
  id: string;
  severity: "critical" | "warning" | "info";
  title: string;
  detail: string;
}

export interface BusinessHours {
  day: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
  open: string;
  close: string;
  closed: boolean;
}

export interface LocationSummary {
  id: string;
  organizationId: string;
  name: string;
  storeCode: string;
  status: LocationStatus;
  primaryCategory: string;
  city: string;
  region: string;
  country: string;
  group: string;
  rating: number;
  reviewCount: number;
  lastSyncAt: string;
  syncState: SyncState;
  health: LocationHealth;
  averageRank: number;
  lat: number;
  lng: number;
}

export interface LocationDetail extends LocationSummary {
  description: string;
  addressLine1: string;
  postalCode: string;
  phone: string;
  website: string;
  bookingUrl: string;
  additionalCategories: string[];
  attributes: string[];
  services: string[];
  hours: BusinessHours[];
  googleLocationId: string;
  googleAccount: string;
  impressions: number;
  calls: number;
  websiteClicks: number;
  directionRequests: number;
  photoCount: number;
  postCount: number;
}

export interface LocationGroup {
  id: string;
  organizationId: string;
  name: string;
  region: string;
  locationCount: number;
  averageRating: number;
  healthyPct: number;
  owner: string;
}
