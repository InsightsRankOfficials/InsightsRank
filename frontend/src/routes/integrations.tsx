import { createFileRoute } from "@tanstack/react-router";
import { PlatformUnifiedPage } from "@/features/platform/platform-page";

export const Route = createFileRoute("/integrations")({
  head: () => ({
    meta: [
      { title: "Google integrations — Global360" },
      { name: "description", content: "Connection health, token status and API readiness for every account." },
    ],
  }),
  component: () => <PlatformUnifiedPage initialTab="integrations" />,
});
