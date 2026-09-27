import { createFileRoute } from "@tanstack/react-router";
import { ReportsPage } from "@/features/reports/reports-page";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — InsightsRank" },
      { name: "description", content: "Build, schedule and distribute executive reporting at scale." },
      { property: "og:title", content: "Reports — InsightsRank" },
      { property: "og:description", content: "Build, schedule and distribute executive reporting at scale." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ReportsPage />,
});
