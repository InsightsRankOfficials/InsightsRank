import { createFileRoute } from "@tanstack/react-router";
import { ReviewsPage } from "@/features/reviews/reviews-page";

export const Route = createFileRoute("/reviews/analytics")({
  head: () => ({
    meta: [
      { title: "Review Analytics — Global360" },
      { name: "description", content: "Understand rating, response and sentiment trends across locations." },
      { property: "og:title", content: "Review Analytics — Global360" },
      { property: "og:description", content: "Understand rating, response and sentiment trends across locations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ReviewsPage initialTab="overview" />,
});
