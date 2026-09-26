import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createPost,
  getPhotos,
  getPosts,
  type PhotoListParams,
  type PostListParams,
} from "@/services/contentService";

export function usePosts(params: PostListParams) {
  return useQuery({
    queryKey: ["posts", params],
    queryFn: () => getPosts(params),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });
}

export function usePhotos(params: PhotoListParams) {
  return useQuery({
    queryKey: ["photos", params],
    queryFn: () => getPhotos(params),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPost,
    onSuccess: (post) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success(
        post.status === "scheduled" ? "Post scheduled" : "Draft saved",
        { description: `${post.locationCount.toLocaleString()} locations targeted.` },
      );
    },
    onError: () => toast.error("Unable to save the post"),
  });
}
