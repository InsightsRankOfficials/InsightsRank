import { createFileRoute } from "@tanstack/react-router";
import { PerformancePage } from "@/features/performance/performance-page";

export const Route = createFileRoute("/performance/maps")({
  head: () => ({
    meta: [
      { title: "Maps performance — InsightsRank" },
      { name: "description", content: "Analyze Google Maps view performance across locations." },
    ],
  }),
  component: () => <PerformancePage initialTab="reports" />,
});
