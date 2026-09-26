import { createFileRoute } from "@tanstack/react-router";
import { RankingsPage } from "@/features/rankings/rankings-page";

export const Route = createFileRoute("/rankings/keywords")({
  head: () => ({
    meta: [
      { title: "Keyword Tracking — Global360" },
      { name: "description", content: "Monitor local search terms at scale." },
      { property: "og:title", content: "Keyword Tracking — Global360" },
      { property: "og:description", content: "Monitor local search terms at scale." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <RankingsPage initialTab="overview" />,
});
