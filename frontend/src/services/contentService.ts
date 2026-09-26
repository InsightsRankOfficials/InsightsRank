import { matchesSearch, paginate, request, sortRows } from "@/api/transport";
import { PHOTOS } from "@/data/photos";
import { POSTS } from "@/data/posts";
import type { ListParams, Paginated } from "@/types/common";
import type { Photo, PhotoCategory, Post, PostStatus, PostType } from "@/types/content";

export interface PostListParams extends ListParams {
  status?: PostStatus | "all";
  type?: PostType | "all";
}

/** GET /posts */
export function getPosts(params: PostListParams = {}): Promise<Paginated<Post>> {
  return request("GET /posts", () => {
    const filtered = POSTS.filter(
      (p) =>
        matchesSearch([p.title, p.body, p.locationScope], params.search) &&
        (!params.status || params.status === "all" || p.status === params.status) &&
        (!params.type || params.type === "all" || p.type === params.type),
    );
    const rows = sortRows(filtered, params.sortBy ?? "publishAt", params.sortDir ?? "desc");
    return paginate(rows, params, { simulatedTotal: Math.max(rows.length, rows.length * 74) });
  });
}

/** POST /posts */
export function createPost(payload: Partial<Post>): Promise<Post> {
  return request("POST /posts", () => {
    const post: Post = {
      id: `post_${Date.now()}`,
      organizationId: payload.organizationId ?? "org_global360",
      title: payload.title ?? "Untitled post",
      body: payload.body ?? "",
      type: payload.type ?? "whats_new",
      status: payload.status ?? "draft",
      locationCount: payload.locationCount ?? 1,
      locationScope: payload.locationScope ?? "All locations",
      publishAt: payload.publishAt ?? new Date().toISOString(),
      ctaLabel: payload.ctaLabel ?? "Learn more",
      views: 0,
      clicks: 0,
    };
    POSTS.unshift(post);
    return post;
  });
}

export interface PhotoListParams extends ListParams {
  category?: PhotoCategory | "all";
  locationId?: string;
}

/** GET /photos */
export function getPhotos(params: PhotoListParams = {}): Promise<Paginated<Photo>> {
  return request("GET /photos", () => {
    const filtered = PHOTOS.filter(
      (p) =>
        matchesSearch([p.fileName, p.locationName, p.category], params.search) &&
        (!params.category || params.category === "all" || p.category === params.category) &&
        (!params.locationId || params.locationId === "all" || p.locationId === params.locationId),
    );
    const rows = sortRows(filtered, params.sortBy ?? "uploadedAt", params.sortDir ?? "desc");
    return paginate(rows, { ...params, pageSize: params.pageSize ?? 24 }, {
      simulatedTotal: Math.max(rows.length, rows.length * 118),
    });
  });
}
