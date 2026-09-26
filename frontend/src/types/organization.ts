export type PlanTier = "starter" | "growth" | "enterprise" | "enterprise_plus";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: PlanTier;
  locationCount: number;
  userCount: number;
  connectedGoogleAccounts: number;
  apiStatus: "healthy" | "degraded" | "error";
  storageUsedGb: number;
  storageLimitGb: number;
  lastSyncAt: string;
  createdAt: string;
  regions: string[];
}

export interface Team {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  memberCount: number;
  locationScope: string;
}
