import type { SyncJob, SyncJobStatus } from "@/types/ops";
import { createRng, intBetween, pick } from "@/lib/random";
import { DEFAULT_ORGANIZATION_ID } from "./organizations";
import { USERS } from "./users";

const TYPES: SyncJob["type"][] = [
  "full_sync",
  "reviews_sync",
  "insights_sync",
  "bulk_update",
  "ranking_crawl",
];

const STATUSES: SyncJobStatus[] = [
  "running",
  "running",
  "queued",
  "completed",
  "completed",
  "completed",
  "failed",
  "partial",
];

function build(): SyncJob[] {
  const rng = createRng(4_815_162);
  return Array.from({ length: 64 }, (_, i) => {
    const status = i === 0 ? "running" : pick(rng, STATUSES);
    const locationsTotal = intBetween(rng, 1_200, 25_000);
    const processed =
      status === "completed"
        ? locationsTotal
        : status === "queued"
          ? 0
          : intBetween(rng, 200, locationsTotal - 1);
    const startedAt = new Date(Date.now() - intBetween(rng, 2, 4_320) * 60_000);
    const durationSec = intBetween(rng, 45, 5_400);

    const job: SyncJob = {
      id: `job_${(90_000 + i).toString()}`,
      organizationId: DEFAULT_ORGANIZATION_ID,
      type: pick(rng, TYPES),
      status,
      startedAt: startedAt.toISOString(),
      durationSec,
      locationsTotal,
      locationsProcessed: processed,
      recordsProcessed: processed * intBetween(rng, 3, 42),
      errorCount: status === "failed" ? intBetween(rng, 40, 1_800) : status === "partial" ? intBetween(rng, 4, 240) : 0,
      triggeredBy: i % 4 === 0 ? "Scheduler" : pick(rng, USERS).name,
    };
    if (status === "completed" || status === "failed" || status === "partial") {
      job.finishedAt = new Date(startedAt.getTime() + durationSec * 1000).toISOString();
    }
    if (status === "failed") {
      job.message = "Google returned 429 RESOURCE_EXHAUSTED for the Performance API. The job will retry with backoff.";
    } else if (status === "partial") {
      job.message = "Completed with errors: 182 locations rejected due to expired credentials.";
    }
    return job;
  }).sort((a, b) => b.startedAt.localeCompare(a.startedAt));
}

export const SYNC_JOBS: SyncJob[] = build();
