import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  bulkReply,
  deleteReviewResponse,
  getResponseTemplates,
  getReviewInsights,
  getReviews,
  replyToReview,
  type ReviewListParams,
} from "@/services/reviewService";

const KEY = "reviews";

export function useReviews(params: ReviewListParams) {
  return useQuery({
    queryKey: [KEY, "list", params],
    queryFn: () => getReviews(params),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });
}

export function useReviewInsights(locationId?: string) {
  return useQuery({
    queryKey: [KEY, "insights", locationId ?? "all"],
    queryFn: () => getReviewInsights(locationId),
    staleTime: 120_000,
  });
}

export function useResponseTemplates() {
  return useQuery({ queryKey: [KEY, "templates"], queryFn: getResponseTemplates, staleTime: Infinity });
}

export function useReplyToReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, text }: { id: string; text: string }) => replyToReview(id, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY] });
      toast.success("Response published", { description: "It is live on the Google profile." });
    },
    onError: (error: Error) =>
      toast.error("Unable to publish the response", {
        description:
          error.message || "The Google connection for this location may have expired.",
      }),
  });
}

export function useDeleteReviewResponse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteReviewResponse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY] });
      toast.success("Response removed");
    },
    onError: () => toast.error("Unable to remove the response"),
  });
}

export function useBulkReply() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, text }: { ids: string[]; text: string }) => bulkReply(ids, text),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: [KEY] });
      toast.success("Bulk response queued", {
        description: `${result.applied.toLocaleString()} reviews will be answered.`,
      });
    },
    onError: () => toast.error("Unable to queue the bulk response"),
  });
}
