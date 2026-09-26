import { createFileRoute } from "@tanstack/react-router";
import { OrganizationUnifiedPage } from "@/features/organization/organization-page";

export const Route = createFileRoute("/organization/users")({
  head: () => ({
    meta: [
      { title: "Users — Global360" },
      { name: "description", content: "Manage access, teams, location scopes and account status." },
    ],
  }),
  component: () => <OrganizationUnifiedPage initialTab="users" />,
});
