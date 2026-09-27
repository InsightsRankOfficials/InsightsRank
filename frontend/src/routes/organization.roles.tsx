import { createFileRoute } from "@tanstack/react-router";
import { OrganizationUnifiedPage } from "@/features/organization/organization-page";

export const Route = createFileRoute("/organization/roles")({
  head: () => ({
    meta: [
      { title: "Roles & permissions — InsightsRank" },
      { name: "description", content: "Control granular capabilities with reusable role policies." },
    ],
  }),
  component: () => <OrganizationUnifiedPage initialTab="roles" />,
});
