import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/features/content/content-page";

export const Route = createFileRoute("/content/photos")({
  head: () => ({
    meta: [
      { title: "Photos — Global360" },
      { name: "description", content: "Audit, publish and organize visual assets across every profile." },
    ],
  }),
  component: () => <ContentPage initialTab="photos" />,
});
