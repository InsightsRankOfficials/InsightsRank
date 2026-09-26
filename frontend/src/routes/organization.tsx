import { createFileRoute } from "@tanstack/react-router";
import { OrganizationUnifiedPage } from "@/features/organization/organization-page";

export const Route = createFileRoute("/organization")({
  head: () => ({
    meta: [
      { title: "Organization Overview — Global360" },
      { name: "description", content: "Enterprise tenancy, account usage and governance posture." },
    ],
  }),
  component: () => <OrganizationUnifiedPage initialTab="overview" />,
});
