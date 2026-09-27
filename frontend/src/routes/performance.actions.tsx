import { createFileRoute } from "@tanstack/react-router";
import { PerformancePage } from "@/features/performance/performance-page";

export const Route = createFileRoute("/performance/actions")({
  head: () => ({
    meta: [
      { title: "Customer actions — InsightsRank" },
      { name: "description", content: "Analyze phone calls, directions and website clicks." },
    ],
  }),
  component: () => <PerformancePage initialTab="overview" />,
});
