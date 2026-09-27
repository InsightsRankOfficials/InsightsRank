import { createFileRoute } from "@tanstack/react-router";
import { ReviewAssistantPage } from "@/features/review-assistant/review-assistant-page";

export const Route = createFileRoute("/review-assistant")({
  head: () => ({
    meta: [
      { title: "Review Assistant — InsightsRank" },
      { name: "description", content: "Review Generator Dashboard, customer review logs, and AI feedback options." },
      { property: "og:title", content: "Review Assistant — InsightsRank" },
      { property: "og:description", content: "Review Generator Dashboard, customer review logs, and AI feedback options." },
    ],
  }),
  component: ReviewAssistantPage,
});
