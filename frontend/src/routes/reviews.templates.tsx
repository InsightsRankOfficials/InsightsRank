import { createFileRoute } from "@tanstack/react-router";
import { ReviewsPage } from "@/features/reviews/reviews-page";

export const Route = createFileRoute("/reviews/templates")({
  head: () => ({
    meta: [
      { title: "Response Templates — InsightsRank" },
      { name: "description", content: "Standardize brand-safe responses with reusable approved language." },
      { property: "og:title", content: "Response Templates — InsightsRank" },
      { property: "og:description", content: "Standardize brand-safe responses with reusable approved language." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ReviewsPage initialTab="response-templates" />,
});
