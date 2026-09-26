import { createFileRoute } from "@tanstack/react-router";
import { PlatformUnifiedPage } from "@/features/platform/platform-page";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Global360" },
      { name: "description", content: "Workspace defaults, sync policy and notification preferences." },
    ],
  }),
  component: () => <PlatformUnifiedPage initialTab="settings" />,
});
