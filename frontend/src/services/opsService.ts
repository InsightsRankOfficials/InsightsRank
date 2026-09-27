import { matchesSearch, paginate, request, sortRows } from "@/api/transport";
import { AUDIT_EVENTS } from "@/data/activity";
import { API_CONNECTIONS, INTEGRATIONS, type ApiConnectionHealth } from "@/data/integrations";
import { NOTIFICATIONS } from "@/data/notifications";
import { REPORTS } from "@/data/reports";
import { SYNC_JOBS } from "@/data/sync";
import type { ListParams, Paginated } from "@/types/common";
import type {
  AppNotification,
  AuditEvent,
  Integration,
  Report,
  SyncJob,
  SyncJobStatus,
} from "@/types/ops";

/* ---------------------------------- sync ---------------------------------- */

export interface SyncJobParams extends ListParams {
  status?: SyncJobStatus | "all";
  type?: SyncJob["type"] | "all";
}

/** GET /sync/jobs */
export function getSyncJobs(params: SyncJobParams = {}): Promise<Paginated<SyncJob>> {
  return request("GET /sync/jobs", () => {
    const filtered = SYNC_JOBS.filter(
      (j) =>
        matchesSearch([j.id, j.type, j.triggeredBy], params.search) &&
        (!params.status || params.status === "all" || j.status === params.status) &&
        (!params.type || params.type === "all" || j.type === params.type),
    );
    const rows = sortRows(filtered, params.sortBy ?? "startedAt", params.sortDir ?? "desc");
    return paginate(rows, params);
  });
}

export interface SyncOverview {
  running: number;
  queued: number;
  completed24h: number;
  failed24h: number;
  locationsProcessed24h: number;
  recordsProcessed24h: number;
  lastSuccessfulSyncAt: string;
  errorCount24h: number;
  throughputPerMin: number;
}

/** GET /sync/overview */
export function getSyncOverview(): Promise<SyncOverview> {
  return request("GET /sync/overview", () => {
    const day = Date.now() - 86_400_000;
    const recent = SYNC_JOBS.filter((j) => new Date(j.startedAt).getTime() > day);
    return {
      running: SYNC_JOBS.filter((j) => j.status === "running").length,
      queued: SYNC_JOBS.filter((j) => j.status === "queued").length,
      completed24h: recent.filter((j) => j.status === "completed").length,
      failed24h: recent.filter((j) => j.status === "failed").length,
      locationsProcessed24h: recent.reduce((a, j) => a + j.locationsProcessed, 0),
      recordsProcessed24h: recent.reduce((a, j) => a + j.recordsProcessed, 0),
      lastSuccessfulSyncAt:
        SYNC_JOBS.find((j) => j.status === "completed")?.finishedAt ?? new Date().toISOString(),
      errorCount24h: recent.reduce((a, j) => a + j.errorCount, 0),
      throughputPerMin: 1_842,
    };
  });
}

/** POST /sync */
export function startSync(scope: string): Promise<SyncJob> {
  return request("POST /sync", () => {
    const job: SyncJob = {
      id: `job_${Date.now()}`,
      organizationId: "org_insightsrank",
      type: "full_sync",
      status: "queued",
      startedAt: new Date().toISOString(),
      durationSec: 0,
      locationsTotal: 25_000,
      locationsProcessed: 0,
      recordsProcessed: 0,
      errorCount: 0,
      triggeredBy: "You",
      message: `Queued for ${scope}.`,
    };
    SYNC_JOBS.unshift(job);
    return job;
  });
}

/* ------------------------------ integrations ------------------------------ */

/** GET /integrations */
export function getIntegrations(): Promise<Integration[]> {
  return request("GET /integrations", () => INTEGRATIONS);
}

/** GET /integrations/api-health */
export function getApiConnections(): Promise<ApiConnectionHealth[]> {
  return request("GET /integrations/api-health", () => API_CONNECTIONS);
}

/** POST /integrations/:id/reconnect — real OAuth is added later. */
export function reconnectIntegration(id: string): Promise<Integration> {
  return request(`POST /integrations/${id}/reconnect`, () => {
    const index = INTEGRATIONS.findIndex((i) => i.id === id);
    const current = INTEGRATIONS.at(index);
    if (!current) throw new Error("Integration not found");
    const { message: _message, ...withoutMessage } = current;
    const updated: Integration = {
      ...withoutMessage,
      status: "connected",
      lastSyncAt: new Date().toISOString(),
      tokenExpiresAt: new Date(Date.now() + 60 * 86_400_000).toISOString(),
    };
    INTEGRATIONS[index] = updated;
    return updated;
  });
}

/** POST /integrations/connect */
export function connectIntegration(
  accountEmail: string = "gbp-central@insightsrank.com",
  accountName: string = "Central Region GBP"
): Promise<Integration> {
  return request("POST /integrations/connect", () => {
    const newIntegration: Integration = {
      id: `int_${Date.now()}`,
      organizationId: "org_insightsrank",
      provider: "google_business_profile",
      accountEmail,
      accountName,
      status: "connected",
      locationsConnected: Math.floor(Math.random() * 15_000) + 5_000,
      lastSyncAt: new Date().toISOString(),
      nextSyncAt: new Date(Date.now() + 30 * 60_000).toISOString(),
      tokenExpiresAt: new Date(Date.now() + 60 * 86_400_000).toISOString(),
      scopes: ["business.manage", "plus.business.manage", "userinfo.email"],
    };
    INTEGRATIONS.unshift(newIntegration);
    return newIntegration;
  });
}

/** DELETE /integrations/:id */
export function disconnectIntegration(id: string): Promise<Integration> {
  return request(`DELETE /integrations/${id}`, () => {
    const index = INTEGRATIONS.findIndex((i) => i.id === id);
    const current = INTEGRATIONS.at(index);
    if (!current) throw new Error("Integration not found");
    const updated: Integration = {
      ...current,
      status: "disconnected",
      locationsConnected: 0,
      message: "Disconnected. Location data will become stale until reconnected.",
    };
    INTEGRATIONS[index] = updated;
    return updated;
  });
}

/* -------------------------------- audit log ------------------------------- */

export interface AuditParams extends ListParams {
  action?: string;
  resource?: string;
  status?: AuditEvent["status"] | "all";
  user?: string;
}

/** GET /audit-logs */
export function getAuditEvents(params: AuditParams = {}): Promise<Paginated<AuditEvent>> {
  return request("GET /audit-logs", () => {
    const filtered = AUDIT_EVENTS.filter(
      (e) =>
        matchesSearch([e.userName, e.userEmail, e.action, e.resource, e.locationName], params.search) &&
        (!params.action || params.action === "all" || e.action === params.action) &&
        (!params.resource || params.resource === "all" || e.resource === params.resource) &&
        (!params.status || params.status === "all" || e.status === params.status) &&
        (!params.user || params.user === "all" || e.userName === params.user),
    );
    const rows = sortRows(filtered, params.sortBy ?? "timestamp", params.sortDir ?? "desc");
    return paginate(rows, params, { simulatedTotal: Math.max(rows.length, rows.length * 240) });
  });
}

/* ------------------------------ notifications ----------------------------- */

/** GET /notifications */
export function getNotifications(): Promise<AppNotification[]> {
  return request("GET /notifications", () => NOTIFICATIONS);
}

/** POST /notifications/read */
export function markNotificationsRead(ids: string[]): Promise<AppNotification[]> {
  return request("POST /notifications/read", () => {
    for (const id of ids) {
      const index = NOTIFICATIONS.findIndex((n) => n.id === id);
      const current = NOTIFICATIONS.at(index);
      if (current) NOTIFICATIONS[index] = { ...current, read: true };
    }
    return NOTIFICATIONS;
  });
}

/* --------------------------------- reports -------------------------------- */

/** GET /reports */
export function getReports(params: ListParams = {}): Promise<Paginated<Report>> {
  return request("GET /reports", () => {
    const filtered = REPORTS.filter((r) => matchesSearch([r.name, r.type, r.locationScope], params.search));
    return paginate(sortRows(filtered, params.sortBy ?? "lastRunAt", params.sortDir ?? "desc"), {
      ...params,
      pageSize: params.pageSize ?? 10,
    });
  });
}

/** POST /reports/:id/export */
export function exportReport(id: string): Promise<{ url: string }> {
  return request(`POST /reports/${id}/export`, () => ({
    url: `https://exports.insightsrank.com/${id}.pdf`,
  }));
}
