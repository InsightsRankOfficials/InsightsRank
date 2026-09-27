import { createFileRoute } from "@tanstack/react-router";
import { RankingsPage } from "@/features/rankings/rankings-page";

export const Route = createFileRoute("/rankings/geo-grid")({
  head: () => ({
    meta: [
      { title: "Geo Grid — InsightsRank" },
      { name: "description", content: "Explore neighborhood-level ranking coverage through a provider-neutral map model." },
      { property: "og:title", content: "Geo Grid — InsightsRank" },
      { property: "og:description", content: "Explore neighborhood-level ranking coverage through a provider-neutral map model." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <RankingsPage initialTab="geo-grid" />,
});
