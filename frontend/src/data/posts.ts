import type { Post, PostStatus, PostType } from "@/types/content";
import { createRng, intBetween, pick } from "@/lib/random";
import { LOCATION_GROUP_NAMES } from "./categories";
import { DEFAULT_ORGANIZATION_ID } from "./organizations";

const TITLES = [
  "Monsoon Sale — up to 40% off",
  "New autumn collection has landed",
  "Weekend fitting camp at your store",
  "Festive offer: buy 2 get 1",
  "Extended hours this Diwali week",
  "Free doorstep delivery all month",
  "Meet our new store manager",
  "Loyalty members get early access",
  "Kids' back-to-school range",
  "Trade-in your old pair",
];

const TYPES: PostType[] = ["whats_new", "offer", "event", "call_to_action"];
const STATUSES: PostStatus[] = ["published", "published", "scheduled", "draft", "failed"];
const CTAS = ["Learn more", "Shop now", "Book", "Call now", "Sign up"];

function build(): Post[] {
  const rng = createRng(602_214);
  return Array.from({ length: 120 }, (_, i) => {
    const status = pick(rng, STATUSES);
    const offsetDays = status === "scheduled" ? intBetween(rng, 1, 30) : -intBetween(rng, 0, 120);
    const post: Post = {
      id: `post_${3_000 + i}`,
      organizationId: DEFAULT_ORGANIZATION_ID,
      title: pick(rng, TITLES),
      body: "Visit your nearest store this week for exclusive in-store pricing, expert fitting and same-day home delivery on selected ranges.",
      type: pick(rng, TYPES),
      status,
      locationCount: intBetween(rng, 1, 24_800),
      locationScope: pick(rng, [...LOCATION_GROUP_NAMES, "All locations", "North India"]),
      publishAt: new Date(Date.now() + offsetDays * 86_400_000).toISOString(),
      ctaLabel: pick(rng, CTAS),
      views: status === "published" ? intBetween(rng, 400, 184_000) : 0,
      clicks: status === "published" ? intBetween(rng, 20, 9_400) : 0,
    };
    if (status === "failed") {
      post.failureReason = "Google rejected the post: the offer end date is in the past for 412 locations.";
    }
    return post;
  });
}

export const POSTS: Post[] = build();
