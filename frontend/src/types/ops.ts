export type SyncJobStatus = "queued" | "running" | "completed" | "failed" | "partial";

export interface SyncJob {
  id: string;
  organizationId: string;
  type: "full_sync" | "reviews_sync" | "insights_sync" | "bulk_update" | "ranking_crawl";
  status: SyncJobStatus;
  startedAt: string;
  finishedAt?: string;
  durationSec: number;
  locationsTotal: number;
  locationsProcessed: number;
  recordsProcessed: number;
  errorCount: number;
  triggeredBy: string;
  message?: string;
}

export interface AuditEvent {
  id: string;
  organizationId: string;
  timestamp: string;
  userName: string;
  userEmail: string;
  action: string;
  resource: string;
  locationName: string;
  ipAddress: string;
  status: "success" | "failed" | "denied";
  detail: string;
}

export interface Integration {
  id: string;
  organizationId: string;
  provider: "google_business_profile";
  accountEmail: string;
  accountName: string;
  status: "connected" | "needs_attention" | "disconnected" | "expired";
  locationsConnected: number;
  lastSyncAt: string;
  nextSyncAt: string;
  tokenExpiresAt: string;
  scopes: string[];
  message?: string;
}

export interface AppNotification {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  category: "sync" | "reviews" | "rankings" | "reports" | "integrations" | "bulk";
  priority: "high" | "medium" | "low";
  createdAt: string;
  read: boolean;
}

export interface Report {
  id: string;
  organizationId: string;
  name: string;
  type: "performance" | "ranking" | "reviews" | "reputation" | "location_health" | "executive";
  schedule: "none" | "weekly" | "monthly" | "quarterly";
  recipients: number;
  lastRunAt: string;
  nextRunAt?: string;
  format: "pdf" | "csv" | "xlsx";
  locationScope: string;
  status: "ready" | "generating" | "failed";
}

export interface BulkOperationResult {
  operationId: string;
  completed: number;
  failed: number;
  skipped: number;
  errors: { locationName: string; reason: string }[];
}
