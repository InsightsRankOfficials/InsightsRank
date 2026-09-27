import { createFileRoute } from "@tanstack/react-router";
import { OrganizationUnifiedPage } from "@/features/organization/organization-page";

export const Route = createFileRoute("/organization/users")({
  head: () => ({
    meta: [
      { title: "Users — InsightsRank" },
      { name: "description", content: "Manage access, teams, location scopes and account status." },
    ],
  }),
  component: () => <OrganizationUnifiedPage initialTab="users" />,
});
