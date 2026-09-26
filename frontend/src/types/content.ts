export type PostStatus = "published" | "scheduled" | "draft" | "failed";

export type PostType = "whats_new" | "offer" | "event" | "call_to_action";

export interface Post {
  id: string;
  organizationId: string;
  title: string;
  body: string;
  type: PostType;
  status: PostStatus;
  locationCount: number;
  locationScope: string;
  publishAt: string;
  ctaLabel: string;
  views: number;
  clicks: number;
  failureReason?: string;
}

export type PhotoCategory =
  | "logo"
  | "cover"
  | "interior"
  | "exterior"
  | "team"
  | "product"
  | "other";

export interface Photo {
  id: string;
  organizationId: string;
  locationId: string;
  locationName: string;
  category: PhotoCategory;
  fileName: string;
  sizeKb: number;
  width: number;
  height: number;
  uploadedAt: string;
  views: number;
  isCover: boolean;
  hue: number;
}
