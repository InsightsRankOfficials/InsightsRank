export type Sentiment = "positive" | "neutral" | "negative";

export type ReviewStatus = "answered" | "unanswered";

export interface ReviewResponse {
  text: string;
  respondedAt: string;
  respondedBy: string;
}

export interface Review {
  id: string;
  organizationId: string;
  locationId: string;
  locationName: string;
  reviewerName: string;
  reviewerInitials: string;
  rating: number;
  text: string;
  createdAt: string;
  sentiment: Sentiment;
  status: ReviewStatus;
  source: "google";
  keywords: string[];
  response?: ReviewResponse;
  flagged: boolean;
}

export interface ResponseTemplate {
  id: string;
  organizationId: string;
  name: string;
  category: "positive" | "neutral" | "negative" | "operational";
  body: string;
  usageCount: number;
  updatedAt: string;
}

export interface KeywordCategoryShare {
  category: string;
  sharePct: number;
  color?: string;
}

export interface ReviewInsights {
  total: number;
  averageRating: number;
  responseRatePct: number;
  averageResponseHours: number;
  unanswered: number;
  sentimentScore: number;
  ratingBreakdown: { rating: number; count: number }[];
  overTime: { date: string; one: number; two: number; three: number; four: number; five: number }[];
  sentimentTrend: { date: string; positive: number; neutral: number; negative: number }[];
  keywordCategories: KeywordCategoryShare[];
  responseRateOverTime?: {
    days: { date: string; avgTime: number; count: number }[];
    hours: { date: string; avgTime: number; count: number }[];
    minutes: { date: string; avgTime: number; count: number }[];
  };
  completionScore?: {
    overallPct: number;
    businessInfo: { label: string; pct: number }[];
    photoGallery: { label: string; pct: number }[];
  };
  repliedStats?: {
    repliedPct: number;
    repliedCount: string;
    notRepliedPct: number;
    notRepliedCount: string;
  };
  sentimentBreakdown?: {
    score: number;
    label: string;
    positivePct: number;
    neutralPct: number;
    negativePct: number;
  };
}

