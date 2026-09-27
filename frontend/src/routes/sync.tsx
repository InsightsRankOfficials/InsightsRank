import { createFileRoute } from "@tanstack/react-router";
import { PlatformUnifiedPage } from "@/features/platform/platform-page";

export const Route = createFileRoute("/sync")({
  head: () => ({
    meta: [
      { title: "Sync center — InsightsRank" },
      { name: "description", content: "Monitor high-volume jobs, retries, throughput and data freshness." },
    ],
  }),
  component: () => <PlatformUnifiedPage initialTab="sync" />,
});
