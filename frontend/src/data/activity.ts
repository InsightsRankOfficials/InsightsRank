import type { AuditEvent } from "@/types/ops";
import { createRng, intBetween, pick } from "@/lib/random";
import { LOCATIONS } from "./locations";
import { DEFAULT_ORGANIZATION_ID } from "./organizations";
import { USERS } from "./users";

export const AUDIT_ACTIONS = [
  "location.update",
  "location.hours.update",
  "review.reply",
  "review.reply.delete",
  "post.publish",
  "photo.upload",
  "bulk.category.update",
  "sync.trigger",
  "integration.reconnect",
  "user.invite",
  "role.update",
  "report.export",
  "settings.update",
] as const;

export const AUDIT_RESOURCES = [
  "Location",
  "Review",
  "Post",
  "Photo",
  "Bulk operation",
  "Sync job",
  "Integration",
  "User",
  "Role",
  "Report",
  "Settings",
] as const;

function build(): AuditEvent[] {
  const rng = createRng(1_618_033);
  return Array.from({ length: 420 }, (_, i) => {
    const user = pick(rng, USERS);
    const location = pick(rng, LOCATIONS);
    const action = pick(rng, AUDIT_ACTIONS);
    const status = rng() < 0.9 ? "success" : rng() < 0.6 ? "failed" : "denied";
    return {
      id: `aud_${200_000 + i}`,
      organizationId: DEFAULT_ORGANIZATION_ID,
      timestamp: new Date(Date.now() - intBetween(rng, 1, 20_000) * 60_000).toISOString(),
      userName: user.name,
      userEmail: user.email,
      action,
      resource: pick(rng, AUDIT_RESOURCES),
      locationName: action.startsWith("location") || action.startsWith("review") ? location.name : "—",
      ipAddress: `10.${intBetween(rng, 0, 40)}.${intBetween(rng, 0, 255)}.${intBetween(rng, 2, 254)}`,
      status: status as AuditEvent["status"],
      detail:
        status === "denied"
          ? "Blocked by role policy: missing organization:manage permission."
          : status === "failed"
            ? "Google API rejected the change (INVALID_ARGUMENT on regularHours)."
            : `Changed via ${pick(rng, ["web app", "bulk editor", "API client", "scheduler"])}.`,
    };
  }).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

export const AUDIT_EVENTS: AuditEvent[] = build();
