import { createFileRoute } from "@tanstack/react-router";
import { PlatformUnifiedPage } from "@/features/platform/platform-page";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help & Docs — InsightsRank" },
      { name: "description", content: "Guides, API reference and support resources." },
    ],
  }),
  component: () => <PlatformUnifiedPage initialTab="help" />,
});
