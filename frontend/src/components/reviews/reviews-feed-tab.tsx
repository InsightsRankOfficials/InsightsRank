import { useState } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Download,
  Edit3,
  ExternalLink,
  Filter,
  MapPin,
  MessageSquare,
  Sparkles,
  Star,
  Trash2,
  User,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CUSTOMER_REVIEWS_LIST, type CustomerReviewItem } from "@/data/reviews-analytics";
import { ReviewHeaderActions } from "./review-header-actions";
import { ResponseToReviewModal } from "./response-to-review-modal";

const THEME_DATA: Record<
  string,
  { count: number; pos: number; neg: number; quote1: string; quote2: string }
> = {
  service: {
    count: 1603,
    pos: 1551,
    neg: 52,
    quote1: "Excellent service, Niranjan was very helpful in suggesting the best footwear...",
    quote2: "Laxman reddy and other staff member Vinay were very kind to assist...",
  },
  other: {
    count: 886,
    pos: 780,
    neg: 106,
    quote1: "Clean store ambiance and quick billing desk response.",
    quote2: "Good store location with ample parking space outside.",
  },
  product: {
    count: 482,
    pos: 410,
    neg: 72,
    quote1: "Super comfy running shoes, great arch support and lightweight material.",
    quote2: "Vast collection of sports footwear and latest arrival designs.",
  },
  quality: {
    count: 245,
    pos: 215,
    neg: 30,
    quote1: "Durable stitching and premium sole quality that lasts over a year.",
    quote2: "Original genuine brand quality with warranty assurance.",
  },
  pricing: {
    count: 142,
    pos: 110,
    neg: 32,
    quote1: "Value for money offers and nice buy-one-get-one seasonal discounts.",
    quote2: "Reasonable price range compared to competitor retail outlets.",
  },
  ambience: {
    count: 51,
    pos: 48,
    neg: 3,
    quote1: "Modern decor, pleasant music, and well-lit store displays.",
    quote2: "Spacious air-conditioned store layout with comfortable seating.",
  },
  delivery: {
    count: 12,
    pos: 10,
    neg: 2,
    quote1: "Prompt home delivery service for out-of-stock sizes.",
    quote2: "Smooth online order pickup experience at counter.",
  },
};

export function ReviewsFeedTab() {
  const [activeTab, setActiveTab] = useState<"all" | "responded" | "unresponded">("all");
  const [selectedRating, setSelectedRating] = useState<string>("all");
  const [selectedTheme, setSelectedTheme] = useState<string>("service");

  const [reviews, setReviews] = useState<CustomerReviewItem[]>(CUSTOMER_REVIEWS_LIST);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<CustomerReviewItem | null>(null);

  const handleEditClick = (review: CustomerReviewItem) => {
    setSelectedReview(review);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const handleSaveResponse = (id: string, newText: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              responseText: newText,
              status: "Responded",
              responseBy: "Manual",
            }
          : r
      )
    );
  };

  const filteredReviews = reviews.filter((r) => {
    if (activeTab === "responded" && r.status !== "Responded") return false;
    if (activeTab === "unresponded" && r.status === "Responded") return false;
    if (selectedRating !== "all" && r.rating !== Number(selectedRating)) return false;
    return true;
  });

  const activeThemeInfo = THEME_DATA[selectedTheme] ?? THEME_DATA.service;

  return (
    <div className="rounded-2xl bg-card dark:bg-[#141416] p-6 sm:p-8 space-y-6 shadow-xl border border-border">
      {/* Title & Top Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">
            Customer Reviews
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Monitor customer feedback, respond to reviews, and manage reputation across platforms.
          </p>
        </div>

        {/* Top Header Export & Filter Button matching reference screenshot */}
        <ReviewHeaderActions activeFilterCount={2} />
      </div>

      {/* Top Hero Section matching reference screenshot 3 */}
      <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        {/* Left Panel: Rating Breakdown */}
        <div className="panel p-4 flex flex-col justify-between space-y-3">
          <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
            Rating Breakdown
          </h3>

          <div className="text-center py-1">
            <p className="tnum text-3xl font-extrabold text-foreground">4.8</p>
            <p className="text-[10px] text-muted-foreground">out of 5</p>
            <div className="flex justify-center text-blue-400 text-xs mt-1 gap-0.5">
              ★★★★☆
            </div>
            <p className="tnum text-[10px] text-muted-foreground mt-0.5">
              90,105 Reviews
            </p>
          </div>

          <div className="space-y-1.5 text-[10px] pt-1 border-t border-border">
            <div className="flex items-center gap-2">
              <span className="w-8 text-right font-medium text-foreground">5 Stars</span>
              <div className="flex-1 bg-secondary rounded-full h-2 overflow-hidden">
                <div className="bg-blue-500 h-full" style={{ width: "89%" }} />
              </div>
              <span className="w-6 tnum font-bold text-foreground">89%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 text-right font-medium text-foreground">4 Stars</span>
              <div className="flex-1 bg-secondary rounded-full h-2 overflow-hidden">
                <div className="bg-blue-500 h-full" style={{ width: "7%" }} />
              </div>
              <span className="w-6 tnum font-bold text-foreground">7%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 text-right font-medium text-muted-foreground">3 Stars</span>
              <div className="flex-1 bg-secondary rounded-full h-2 overflow-hidden">
                <div className="bg-muted-foreground/40 h-full" style={{ width: "2%" }} />
              </div>
              <span className="w-6 tnum font-bold text-muted-foreground">2%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 text-right font-medium text-muted-foreground">2 Stars</span>
              <div className="flex-1 bg-secondary rounded-full h-2 overflow-hidden">
                <div className="bg-muted-foreground/40 h-full" style={{ width: "1%" }} />
              </div>
              <span className="w-6 tnum font-bold text-muted-foreground">1%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 text-right font-medium text-muted-foreground">1 Star</span>
              <div className="flex-1 bg-secondary rounded-full h-2 overflow-hidden">
                <div className="bg-muted-foreground/40 h-full" style={{ width: "2%" }} />
              </div>
              <span className="w-6 tnum font-bold text-muted-foreground">2%</span>
            </div>
          </div>
        </div>

        {/* Right Panel: What our customer are saying */}
        <div className="panel p-4 sm:p-5 flex flex-col justify-between space-y-3">
          <div>
            <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide mb-1">
              What our customer are saying
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Based on 90,105 reviews, customer feedback was overwhelmingly positive. Analysis of the comments shows a clear focus on several key strengths such as Service, Other, and Product.
            </p>
          </div>

          {/* Interactive Category Pills */}
          <div className="space-y-2 pt-2 border-t border-border">
            <span className="text-[11px] font-semibold text-foreground block">
              Select to learn more:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {["Service", "Other", "Product", "Quality", "Pricing", "Ambience", "Delivery"].map(
                (theme) => {
                  const themeKey = theme.toLowerCase();
                  const isSelected = selectedTheme === themeKey;
                  return (
                    <button
                      key={theme}
                      onClick={() => setSelectedTheme(themeKey)}
                      className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-all ${
                        isSelected
                          ? "bg-blue-500 text-black font-bold shadow-sm"
                          : "text-muted-foreground hover:text-foreground bg-background/60 hover:bg-secondary"
                      }`}
                    >
                      {theme}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* Selected Theme Quote Highlights (Dynamically Updates on Theme Change) */}
          <div className="bg-background/80 border border-border rounded-lg p-3.5 text-xs space-y-2 transition-all">
            <p className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-blue-500" />
              <span>
                {activeThemeInfo.count.toLocaleString()} customers mention &quot;{selectedTheme}&quot; ({activeThemeInfo.pos} positive, {activeThemeInfo.neg} negative)
              </span>
            </p>
            <p className="text-muted-foreground italic text-[11px] border-l-2 border-blue-500/50 pl-2">
              &quot;{activeThemeInfo.quote1}&quot;
            </p>
            <p className="text-muted-foreground italic text-[11px] border-l-2 border-blue-500/50 pl-2">
              &quot;{activeThemeInfo.quote2}&quot;
            </p>
          </div>
        </div>
      </div>

      {/* Action Filter Pills Bar matching Screenshot 3 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-all ${
              activeTab === "all"
                ? "bg-blue-500 text-black shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab("responded")}
            className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-all ${
              activeTab === "responded"
                ? "bg-blue-500 text-black shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Responded
          </button>
          <button
            onClick={() => setActiveTab("unresponded")}
            className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-all ${
              activeTab === "unresponded"
                ? "bg-blue-500 text-black shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Unresponded
          </button>
        </div>

        {/* Rating Filter using Shadcn Select */}
        <Select value={selectedRating} onValueChange={setSelectedRating}>
          <SelectTrigger className="h-7 w-[130px] bg-background border-border text-xs cursor-pointer">
            <SelectValue placeholder="All Ratings" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border text-popover-foreground text-xs">
            <SelectItem value="all" className="cursor-pointer">All Ratings</SelectItem>
            <SelectItem value="5" className="cursor-pointer">5 Stars</SelectItem>
            <SelectItem value="4" className="cursor-pointer">4 Stars</SelectItem>
            <SelectItem value="3" className="cursor-pointer">3 Stars</SelectItem>
            <SelectItem value="2" className="cursor-pointer">2 Stars</SelectItem>
            <SelectItem value="1" className="cursor-pointer">1 Star</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Customer Review Cards List */}
      <div className="space-y-3">
        {filteredReviews.length === 0 ? (
          <div className="panel p-6">
            <EmptyState description="No customer reviews match your selected filter criteria." />
          </div>
        ) : (
          filteredReviews.map((review) => (
          <div key={review.id} className="panel p-4 sm:p-5 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-full bg-secondary flex items-center justify-center border border-border">
                  <User className="size-5 text-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-foreground">
                      {review.reviewerName}
                    </span>
                    <div className="flex text-blue-400 text-xs gap-0.5">
                      ★★★★★
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                    {review.dateStr}
                  </p>
                </div>
              </div>

              {review.status === "Responded" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#052e16] border border-[#14532d] text-emerald-400 font-semibold text-[11px]">
                  ✓ Responded
                </span>
              )}
            </div>

            <div className="flex items-start gap-1 text-[11px] text-muted-foreground">
              <MapPin className="size-3 shrink-0 mt-0.5 text-muted-foreground/70" />
              <span>{review.address}</span>
              <a
                href="#map"
                className="inline-flex items-center gap-1 text-blue-500 hover:underline font-semibold ml-2 cursor-pointer"
              >
                <ExternalLink className="size-3" /> View on Map
              </a>
            </div>

            {/* Response Box matching reference screenshot */}
            {review.responseText && (
              <div className="bg-secondary/40 dark:bg-[#18181b]/80 border border-border dark:border-[#27272a] rounded-lg p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-foreground flex items-center gap-1.5">
                    <MessageSquare className="size-3.5 text-blue-500" />
                    Replied by {review.responseBy ?? "AI"} on {review.responseDateStr ?? review.dateStr}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {review.responseText}
                </p>

                <div className="flex items-center gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditClick(review)}
                    className="h-7 px-2.5 text-[11px] border-blue-500/40 text-blue-500 hover:bg-blue-500/10 font-semibold cursor-pointer gap-1"
                  >
                    <Edit3 className="size-3" /> Edit
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteClick(review.id)}
                    className="h-7 px-2.5 text-[11px] border-border text-muted-foreground hover:text-foreground cursor-pointer gap-1"
                  >
                    <Trash2 className="size-3" /> Delete
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))
      )}
      </div>

      {/* Response Edit Modal */}
      <ResponseToReviewModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        review={selectedReview}
        onSaveResponse={handleSaveResponse}
      />
    </div>
  );
}
