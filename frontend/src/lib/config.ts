/**
 * Application configuration + feature flags.
 * Flags are local values today; they can be sourced from a remote config
 * service later without touching consumers.
 */

export const APP = {
  name: "InsightsRank",
  tagline: "Google Business Profile intelligence at scale",
  /** Simulated backend latency window (ms) for the mock repositories. */
  mockLatency: [180, 620] as const,
  defaultPageSize: 25,
  pageSizeOptions: [10, 25, 50, 100],
} as const;

export const FEATURES = {
  ENABLE_AI_RESPONSES: true,
  ENABLE_GEO_GRID: true,
  ENABLE_BULK_OPERATIONS: true,
  ENABLE_REPORT_BUILDER: true,
  ENABLE_GOOGLE_INTEGRATION: false,
  ENABLE_ADVANCED_ANALYTICS: true,
} as const;

export type FeatureFlag = keyof typeof FEATURES;

export function isEnabled(flag: FeatureFlag): boolean {
  return FEATURES[flag];
}

/** Development-only logging so mock service behaviour stays inspectable. */
export function devLog(scope: string, ...args: unknown[]): void {
  if (import.meta.env.DEV) {
    console.debug(`[${scope}]`, ...args);
  }
}
