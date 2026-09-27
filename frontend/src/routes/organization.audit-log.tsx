import { createFileRoute } from "@tanstack/react-router";
import { OrganizationUnifiedPage } from "@/features/organization/organization-page";

export const Route = createFileRoute("/organization/audit-log")({
  head: () => ({
    meta: [
      { title: "Audit log — InsightsRank" },
      { name: "description", content: "Review immutable user, sync and policy activity across the organization." },
    ],
  }),
  component: () => <OrganizationUnifiedPage initialTab="audit-log" />,
});
