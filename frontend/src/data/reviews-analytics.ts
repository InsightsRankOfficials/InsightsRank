export interface StoreRatingItem {
  rank: number;
  name: string;
  location: string;
  avgRating: number;
  totalReviews: number;
  positiveCount: number;
  negativeCount: number;
}

export interface CustomerReviewItem {
  id: string;
  reviewerName: string;
  reviewerInitials: string;
  rating: number;
  dateStr: string;
  address: string;
  placeId?: string;
  status: "Responded" | "Unresponded";
  responseBy?: string;
  responseDateStr?: string;
  responseText?: string;
  sentiment?: "Positive" | "Neutral" | "Negative";
  category?: string;
}

export const BEST_5_STORES: StoreRatingItem[] = [
  {
    rank: 1,
    name: "Demo Store 296 - 3556",
    location: "East, Delhi, Delhi",
    avgRating: 4.99,
    totalReviews: 107,
    positiveCount: 107,
    negativeCount: 0,
  },
  {
    rank: 2,
    name: "Demo Store 310",
    location: "Aurangabad, Maharashtra",
    avgRating: 4.96,
    totalReviews: 80,
    positiveCount: 80,
    negativeCount: 0,
  },
  {
    rank: 3,
    name: "Demo Store 34",
    location: "Ahmedabad, Gujarat",
    avgRating: 4.97,
    totalReviews: 75,
    positiveCount: 75,
    negativeCount: 0,
  },
  {
    rank: 4,
    name: "Demo Store 197",
    location: "East, Delhi, Delhi",
    avgRating: 4.99,
    totalReviews: 70,
    positiveCount: 70,
    negativeCount: 0,
  },
  {
    rank: 5,
    name: "Demo Store 242",
    location: "Mumbai, Maharashtra",
    avgRating: 4.9,
    totalReviews: 62,
    positiveCount: 61,
    negativeCount: 1,
  },
];

export const WORST_5_STORES: StoreRatingItem[] = [
  {
    rank: 1,
    name: "Demo Store 70",
    location: "Pune, Maharashtra",
    avgRating: 1.0,
    totalReviews: 1,
    positiveCount: 0,
    negativeCount: 1,
  },
  {
    rank: 2,
    name: "Demo Store 298",
    location: "West Delhi, Delhi",
    avgRating: 1.0,
    totalReviews: 1,
    positiveCount: 0,
    negativeCount: 1,
  },
  {
    rank: 3,
    name: "Demo Store 180",
    location: "Kadi, Gujarat",
    avgRating: 1.0,
    totalReviews: 1,
    positiveCount: 0,
    negativeCount: 1,
  },
  {
    rank: 4,
    name: "Demo Store 204",
    location: "Palanpur, Gujarat",
    avgRating: 1.0,
    totalReviews: 1,
    positiveCount: 0,
    negativeCount: 1,
  },
  {
    rank: 5,
    name: "Demo Store 112",
    location: "Surat, Gujarat",
    avgRating: 1.2,
    totalReviews: 2,
    positiveCount: 0,
    negativeCount: 2,
  },
];

export const CUSTOMER_REVIEWS_LIST: CustomerReviewItem[] = [
  {
    id: "rev-1",
    reviewerName: "M************* S.",
    reviewerInitials: "MS",
    rating: 5,
    dateStr: "May 4, 2026 12:13 AM",
    address: "JMD Regent Arcade, 4th Floor, MG Road, Jaipur, 302001, Rajasthan, IN",
    status: "Responded",
    responseBy: "AI",
    responseDateStr: "May 4, 2026 12:23 AM",
    responseText:
      "Hello Manisha sharma, Thank you for your feedback! Glad to know that we made your shopping experience great today. Looking forward to assist you again... Warm regards, Campus Team.",
    sentiment: "Positive",
    category: "Service",
  },
  {
    id: "rev-2",
    reviewerName: "K************* V.",
    reviewerInitials: "KV",
    rating: 5,
    dateStr: "May 4, 2026 12:13 AM",
    address: "JMD Regent Arcade, 4th Floor, MG Road, Jaipur, 302001, Rajasthan, IN",
    status: "Responded",
    responseBy: "AI",
    responseDateStr: "May 4, 2026 12:23 AM",
    responseText:
      "Hello kuldeep verma, Thank you for your positive feedback! We're so pleased to know you had a great experience with us. Looking forward to assisting you again. Warm regards, Campus Team.",
    sentiment: "Positive",
    category: "Product",
  },
  {
    id: "rev-3",
    reviewerName: "R************* K.",
    reviewerInitials: "RK",
    rating: 4,
    dateStr: "May 3, 2026 09:45 PM",
    address: "JMD Regent Arcade, 4th Floor, MG Road, Delhi, 110032, Delhi, IN",
    placeId: "ChIJ8aQ2G4ceDTkRMRKb53WBJWY",
    status: "Responded",
    responseBy: "Support Team",
    responseDateStr: "May 3, 2026 10:15 PM",
    responseText:
      "Hello Rahul Kumar, Thank you for taking the time to share your feedback. We appreciate your rating and look forward to welcoming you back soon!",
    sentiment: "Positive",
    category: "Ambience",
  },
  {
    id: "rev-4",
    reviewerName: "S************* P.",
    reviewerInitials: "SP",
    rating: 2,
    dateStr: "Apr 28, 2026 04:20 PM",
    address: "Phoenix Marketcity, LBS Marg, Kurla West, Mumbai, 400070, Maharashtra, IN",
    status: "Unresponded",
    sentiment: "Negative",
    category: "Pricing",
  },
  {
    id: "rev-5",
    reviewerName: "A************* G.",
    reviewerInitials: "AG",
    rating: 3,
    dateStr: "Apr 20, 2026 11:05 AM",
    address: "Alpha One Mall, Vastrapur, Ahmedabad, 380054, Gujarat, IN",
    status: "Responded",
    responseBy: "AI",
    responseText: "Hello Amit, thank you for sharing your thoughts. We will work on pricing and delivery speed.",
    sentiment: "Neutral",
    category: "Delivery",
  }
];

export function downloadCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers.join(","), ...rows.map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadDetailedReport() {
  const headers = [
    "Review ID",
    "Reviewer Name",
    "Rating",
    "Date",
    "Address",
    "Reply Status",
    "Responded By",
    "Response Text",
    "Sentiment",
    "Category",
  ];

  const rows = CUSTOMER_REVIEWS_LIST.map((r) => [
    r.id,
    r.reviewerName,
    r.rating,
    r.dateStr,
    r.address,
    r.status,
    r.responseBy ?? "N/A",
    r.responseText ?? "No response",
    r.sentiment ?? "Positive",
    r.category ?? "General",
  ]);

  downloadCSV("Detailed_Review_Analytics_Report.csv", headers, rows);
}

export function downloadSummarizedReport() {
  const headers = ["Performance Metric", "Aggregated Value", "Executive Context"];
  const rows = [
    ["Total Reviews Analyzed", 3264, "All active locations"],
    ["Pending Unanswered Reviews", 0, "100% SLA compliance"],
    ["Global Response Rate", "100%", "Target: >95%"],
    ["Average SLA Response Time", "3.0 hours", "Target: <24 hours"],
    ["Net Promoter Score (NPS)", 90, "Industry Benchmark: 65+"],
    ["Positive Sentiment Rate", "94%", "93% 5-star concentration"],
    ["Top Strengths", "Service, Product, Other", "Primary satisfaction drivers"],
    ["Top Performing Store", "Demo Store 296 (4.99 ★)", "107 positive reviews"],
    ["Lowest Performing Store", "Demo Store 70 (1.00 ★)", "Requires regional audit"],
  ];

  downloadCSV("Summarized_Review_Analytics_Report.csv", headers, rows);
}
