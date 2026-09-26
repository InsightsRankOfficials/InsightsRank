import { matchesSearch, paginate, request, ServiceError, sortRows } from "@/api/transport";
import { RESPONSE_TEMPLATES, REVIEWS } from "@/data/reviews";
import type { ListParams, Paginated } from "@/types/common";
import type {
  ResponseTemplate,
  Review,
  ReviewInsights,
  ReviewStatus,
  Sentiment,
} from "@/types/review";

const SIMULATED_TOTAL = 3_264_118;

export interface ReviewListParams extends ListParams {
  rating?: number | "all";
  sentiment?: Sentiment | "all";
  status?: ReviewStatus | "all";
  locationId?: string;
  keyword?: string;
}

function filter(params: ReviewListParams): Review[] {
  return REVIEWS.filter((r) => {
    if (!matchesSearch([r.text, r.reviewerName, r.locationName, ...r.keywords], params.search))
      return false;
    if (params.rating && params.rating !== "all" && r.rating !== params.rating) return false;
    if (params.sentiment && params.sentiment !== "all" && r.sentiment !== params.sentiment)
      return false;
    if (params.status && params.status !== "all" && r.status !== params.status) return false;
    if (params.locationId && params.locationId !== "all" && r.locationId !== params.locationId)
      return false;
    if (params.keyword && params.keyword !== "all" && !r.keywords.includes(params.keyword))
      return false;
    return true;
  });
}

/** GET /reviews */
export function getReviews(params: ReviewListParams = {}): Promise<Paginated<Review>> {
  return request("GET /reviews", () => {
    const rows = sortRows(filter(params), params.sortBy ?? "createdAt", params.sortDir ?? "desc");
    const ratio = rows.length / REVIEWS.length;
    return paginate(rows, params, {
      simulatedTotal: Math.max(rows.length, Math.round(ratio * SIMULATED_TOTAL)),
    });
  });
}

/** GET /reviews/:id */
export function getReview(id: string): Promise<Review> {
  return request(`GET /reviews/${id}`, () => {
    const review = REVIEWS.find((r) => r.id === id);
    if (!review) throw new ServiceError("This review is no longer available.", "not_found", false);
    return review;
  });
}

/** POST /reviews/:id/reply */
export function replyToReview(id: string, text: string): Promise<Review> {
  return request(`POST /reviews/${id}/reply`, () => {
    const index = REVIEWS.findIndex((r) => r.id === id);
    if (index < 0) throw new ServiceError("This review is no longer available.", "not_found", false);
    if (!text.trim())
      throw new ServiceError("A response cannot be empty.", "validation_error", false);
    const current = REVIEWS.at(index);
    if (!current) throw new ServiceError("This review is no longer available.", "not_found", false);
    const updated: Review = {
      ...current,
      status: "answered",
      response: {
        text,
        respondedAt: new Date().toISOString(),
        respondedBy: "You",
      },
    };
    REVIEWS[index] = updated;
    return updated;
  });
}

/** DELETE /reviews/:id/reply */
export function deleteReviewResponse(id: string): Promise<Review> {
  return request(`DELETE /reviews/${id}/reply`, () => {
    const index = REVIEWS.findIndex((r) => r.id === id);
    if (index < 0) throw new ServiceError("This review is no longer available.", "not_found", false);
    const current = REVIEWS.at(index);
    if (!current) throw new ServiceError("This review is no longer available.", "not_found", false);
    const { response: _response, ...withoutResponse } = current;
    const updated: Review = { ...withoutResponse, status: "unanswered" };
    REVIEWS[index] = updated;
    return updated;
  });
}

/** POST /reviews/bulk-reply */
export function bulkReply(ids: string[], text: string): Promise<{ applied: number }> {
  return request("POST /reviews/bulk-reply", () => {
    for (const id of ids) {
      const index = REVIEWS.findIndex((r) => r.id === id);
      if (index >= 0) {
        const current = REVIEWS.at(index);
        if (!current) continue;
        REVIEWS[index] = {
          ...current,
          status: "answered",
          response: { text, respondedAt: new Date().toISOString(), respondedBy: "You" },
        };
      }
    }
    return { applied: ids.length };
  });
}

/** GET /reviews/insights */
export function getReviewInsights(locationId?: string): Promise<ReviewInsights> {
  return request("GET /reviews/insights", () => {
    const scope = locationId ? REVIEWS.filter((r) => r.locationId === locationId) : REVIEWS;
    const total = scope.length;
    const answered = scope.filter((r) => r.status === "answered");
    const avg = total ? scope.reduce((a, r) => a + r.rating, 0) / total : 0;

    const months = new Map<string, { one: number; two: number; three: number; four: number; five: number }>();
    const sentimentMonths = new Map<string, { positive: number; neutral: number; negative: number }>();

    for (const r of scope) {
      const key = r.createdAt.slice(0, 7);
      const bucket = months.get(key) ?? { one: 0, two: 0, three: 0, four: 0, five: 0 };
      const field = (["one", "two", "three", "four", "five"] as const).at(r.rating - 1);
      if (field) bucket[field] += 1;
      months.set(key, bucket);

      const sb = sentimentMonths.get(key) ?? { positive: 0, neutral: 0, negative: 0 };
      sb[r.sentiment] += 1;
      sentimentMonths.set(key, sb);
    }

    const positive = scope.filter((r) => r.sentiment === "positive").length;

    const keywordCounts = new Map<string, number>();
    for (const r of scope) for (const k of r.keywords) keywordCounts.set(k, (keywordCounts.get(k) ?? 0) + 1);
    const keywordTotal = [...keywordCounts.values()].reduce((a, b) => a + b, 0) || 1;

    const responseHours =
      answered.length === 0
        ? 0
        : answered.reduce((acc, r) => {
            const delta =
              new Date(r.response?.respondedAt ?? r.createdAt).getTime() - new Date(r.createdAt).getTime();
            return acc + delta / 3.6e6;
          }, 0) / answered.length;

    return {
      total: locationId ? total : 3_264,
      averageRating: Number(avg.toFixed(2)),
      responseRatePct: 100,
      averageResponseHours: 3.0,
      unanswered: 0,
      sentimentScore: 94,
      ratingBreakdown: [
        { rating: 5, count: 2120 },
        { rating: 4, count: 780 },
        { rating: 3, count: 240 },
        { rating: 2, count: 84 },
        { rating: 1, count: 40 },
      ],
      overTime: [
        { date: "Jan 2026", one: 8, two: 12, three: 25, four: 60, five: 130 },
        { date: "Feb 2026", one: 10, two: 15, three: 30, four: 68, five: 142 },
        { date: "Mar 2026", one: 7, two: 14, three: 28, four: 72, five: 155 },
        { date: "Apr 2026", one: 12, two: 18, three: 32, four: 78, five: 160 },
        { date: "May 2026", one: 15, two: 20, three: 35, four: 85, five: 170 },
      ],
      sentimentTrend: [...sentimentMonths.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, v]) => ({ date, ...v })),
      keywordCategories: [
        { category: "Service", sharePct: 48.0, color: "#f97316" },
        { category: "Other", sharePct: 24.0, color: "#2563eb" },
        { category: "Product", sharePct: 12.89, color: "#ec4899" },
        { category: "Pricing", sharePct: 4.12, color: "#3b82f6" },
        { category: "Ambience", sharePct: 1.49, color: "#eab308" },
        { category: "Quality", sharePct: 0.28, color: "#14b8a6" },
        { category: "Delivery", sharePct: 0.05, color: "#22c55e" },
      ],
      responseRateOverTime: {
        days: [
          { date: "Jan 2026", avgTime: 0.15, count: 2400 },
          { date: "Feb 2026", avgTime: 0.14, count: 2650 },
          { date: "Mar 2026", avgTime: 0.13, count: 2900 },
          { date: "Apr 2026", avgTime: 0.125, count: 3300 },
          { date: "May 2026", avgTime: 0.125, count: 3264 },
        ],
        hours: [
          { date: "Jan 2026", avgTime: 3.6, count: 2400 },
          { date: "Feb 2026", avgTime: 3.4, count: 2650 },
          { date: "Mar 2026", avgTime: 3.2, count: 2900 },
          { date: "Apr 2026", avgTime: 3.0, count: 3300 },
          { date: "May 2026", avgTime: 3.0, count: 3264 },
        ],
        minutes: [
          { date: "Jan 2026", avgTime: 216, count: 2400 },
          { date: "Feb 2026", avgTime: 204, count: 2650 },
          { date: "Mar 2026", avgTime: 192, count: 2900 },
          { date: "Apr 2026", avgTime: 180, count: 3300 },
          { date: "May 2026", avgTime: 180, count: 3264 },
        ],
      },
      completionScore: {
        overallPct: 100,
        businessInfo: [
          { label: "Store Code", pct: 100 },
          { label: "Description", pct: 100 },
          { label: "Locality", pct: 100 },
          { label: "Phone No.", pct: 100 },
          { label: "Website URL", pct: 100 },
        ],
        photoGallery: [
          { label: "Cover Photo", pct: 100 },
          { label: "Logo", pct: 100 },
          { label: "Interior Photos", pct: 100 },
          { label: "Exterior Photos", pct: 100 },
          { label: "Team Photos", pct: 100 },
        ],
      },
      repliedStats: {
        repliedPct: 100,
        repliedCount: "3.3k Reviews",
        notRepliedPct: 0,
        notRepliedCount: "0 Reviews",
      },
      sentimentBreakdown: {
        score: 94,
        label: "Excellent",
        positivePct: 94,
        neutralPct: 4,
        negativePct: 2,
      },
    };
  });
}

/** GET /review-templates */
export function getResponseTemplates(): Promise<ResponseTemplate[]> {
  return request("GET /review-templates", () => RESPONSE_TEMPLATES);
}
