import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/features/content/content-page";

export const Route = createFileRoute("/content/posts")({
  head: () => ({
    meta: [
      { title: "Posts — Global360" },
      { name: "description", content: "Create, schedule and govern local content across location groups." },
    ],
  }),
  component: () => <ContentPage initialTab="posts" />,
});
