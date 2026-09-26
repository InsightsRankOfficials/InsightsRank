import { createFileRoute } from "@tanstack/react-router";
import { PerformancePage } from "@/features/performance/performance-page";

export const Route = createFileRoute("/performance/search")({
  head: () => ({
    meta: [
      { title: "Search performance — Global360" },
      { name: "description", content: "Analyze direct and discovery demand across desktop and mobile search." },
    ],
  }),
  component: () => <PerformancePage initialTab="insights" />,
});
