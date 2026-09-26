export interface ScheduledPostItem {
  id: string;
  title: string;
  type: "update" | "offer" | "event";
  status: "Posted" | "Failed" | "Partially Failed" | "Upcoming" | "In Progress" | "Expired";
  date: string; // YYYY-MM-DD
  dayNumber: number;
  platforms: string[];
  listingsCount: number;
  description?: string;
  offerTitle?: string;
  couponCode?: string;
  eventTitle?: string;
  ctaButton?: string;
}

export interface PostsSummaryMetrics {
  scheduled: number;
  published: number;
  partiallyFailed: number;
  failed: number;
}

export const INITIAL_POSTS_SUMMARY: PostsSummaryMetrics = {
  scheduled: 0,
  published: 0,
  partiallyFailed: 0,
  failed: 0,
};

export const INITIAL_SCHEDULED_POSTS: ScheduledPostItem[] = [
  {
    id: "post-1",
    title: "Festive Season Discount Announcement",
    type: "offer",
    status: "Posted",
    date: "2026-09-05",
    dayNumber: 5,
    platforms: ["Google", "Facebook"],
    listingsCount: 315,
    description: "Get up to 30% off on all footwear purchases across participating stores.",
    offerTitle: "Festive Sale 30% Off",
    couponCode: "FESTIVE30",
  },
  {
    id: "post-2",
    title: "New Store Launch Celebration",
    type: "event",
    status: "Upcoming",
    date: "2026-09-18",
    dayNumber: 18,
    platforms: ["Google"],
    listingsCount: 315,
    description: "Join us for the grand opening of our new flagship store location.",
    eventTitle: "Grand Store Opening",
  },
  {
    id: "post-3",
    title: "Weekend Flash Sale Update",
    type: "update",
    status: "Partially Failed",
    date: "2026-09-22",
    dayNumber: 22,
    platforms: ["Google", "Facebook"],
    listingsCount: 280,
    description: "Limited stock available for weekend flash deals.",
  },
  {
    id: "post-4",
    title: "End of Season Clearance",
    type: "offer",
    status: "Failed",
    date: "2026-09-25",
    dayNumber: 25,
    platforms: ["Facebook"],
    listingsCount: 150,
    description: "Clearance sale valid until stocks last.",
  },
];

export const SELECT_TAGS_OPTIONS = [
  "All Stores",
  "North Region",
  "West Region",
  "South Region",
  "East Region",
  "Tier 1 Cities",
  "High Impact Stores",
  "Flagship Stores",
  "Retail Outlets",
];

export const STORE_CODE_OPTIONS = [
  "demo-store-127 (Mumbai)",
  "demo-store-297 (Bangalore)",
  "demo-store-308 (Bilaspur)",
  "demo-store-310 (Aurangabad)",
  "demo-store-371 (Delhi)",
  "demo-store-34 (Ahmedabad)",
  "demo-store-42 (Kolkata)",
];

export const CTA_BUTTON_OPTIONS = [
  "None",
  "Book",
  "Order online",
  "Buy",
  "Learn more",
  "Sign up",
  "Call now",
];
