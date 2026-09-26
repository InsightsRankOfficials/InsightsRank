import { createFileRoute } from "@tanstack/react-router";
import { ReviewAssistantPage } from "@/features/review-assistant/review-assistant-page";

export const Route = createFileRoute("/review-assistant")({
  head: () => ({
    meta: [
      { title: "Review Assistant — Global360" },
      { name: "description", content: "Review Generator Dashboard, customer review logs, and AI feedback options." },
      { property: "og:title", content: "Review Assistant — Global360" },
      { property: "og:description", content: "Review Generator Dashboard, customer review logs, and AI feedback options." },
    ],
  }),
  component: ReviewAssistantPage,
});
