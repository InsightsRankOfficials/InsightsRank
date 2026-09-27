import { createFileRoute } from "@tanstack/react-router";
import { RankingsPage } from "@/features/rankings/rankings-page";

export const Route = createFileRoute("/rankings/competitors")({
  head: () => ({
    meta: [
      { title: "Competitor Intelligence — InsightsRank" },
      { name: "description", content: "Compare visibility, reviews and keyword overlap against local competitors." },
      { property: "og:title", content: "Competitor Intelligence — InsightsRank" },
      { property: "og:description", content: "Compare visibility, reviews and keyword overlap against local competitors." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <RankingsPage initialTab="competitors" />,
});
