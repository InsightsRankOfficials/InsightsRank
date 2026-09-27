import { createFileRoute } from "@tanstack/react-router";
import { StoreManagerPage } from "@/features/store-manager/store-manager-page";

export const Route = createFileRoute("/store-manager")({
  head: () => ({
    meta: [
      { title: "Store Manager — InsightsRank" },
      { name: "description", content: "Manage store locations requests and store manager accounts." },
      { property: "og:title", content: "Store Manager — InsightsRank" },
      { property: "og:description", content: "Manage store locations requests and store manager accounts." },
    ],
  }),
  component: StoreManagerPage,
});
