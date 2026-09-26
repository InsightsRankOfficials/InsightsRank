export interface ReviewFunnelStep {
  label: string;
  count: number;
  pctOfTotal: string;
  change?: string;
  rightPct?: string;
}

export interface AspectSentimentItem {
  name: string;
  positive: number;
  neutral: number;
  negative: number;
  scoreText: string;
  detail: string;
}

export interface ReviewLogItem {
  id: string;
  storeName: string;
  storeCode: string;
  address: string;
  dateTime: string;
  ipAddress: string;
  device: "Desktop" | "Mobile" | "Tablet";
  versions: number;
  status: "Generated" | "Started" | "Shared";
  reviewText?: string;
  customerRating?: number;
}

export interface ReviewOptionItem {
  id: string;
  name: string;
  sequence: number;
  status: "Active" | "Inactive";
  lastModifiedAt: string;
}

export const REVIEW_ASSISTANT_KPI = {
  totalQrScans: 20,
  completionRate: "25%",
  editRate: "20%",
  avgCompletionTime: "2m 47s",
};

export const REVIEW_GENERATION_FUNNEL: ReviewFunnelStep[] = [
  {
    label: "QR Code Scanned",
    count: 20,
    pctOfTotal: "100.0% of total",
    rightPct: "100.0%",
  },
  {
    label: "Review Generated",
    count: 9,
    pctOfTotal: "45.0% of total",
    change: "↑ 55%",
    rightPct: "45.0%",
  },
  {
    label: "Review Copied",
    count: 5,
    pctOfTotal: "25.0% of total",
    change: "↑ 75%",
    rightPct: "25.0%",
  },
];

export const EDIT_RATIO_DATA = {
  editRatioPct: 20,
  editedBullet: "1 of 5 generated reviews were manually edited before copying.",
  asIsBullet: "80% copied the AI draft as-is.",
  aiGeneratedPct: 80,
  aiGeneratedCount: 4,
  editedPct: 20,
  editedCount: 1,
  toneCopyRates: [
    { tone: "Professional", pct: "20%" },
    { tone: "Casual", pct: "40%" },
    { tone: "Enthusiastic", pct: "40%" },
    { tone: "Balanced", pct: "0%" },
  ],
};

export const SCANS_OVER_TIME_MONTH = [
  { month: "Apr 2026", scans: 0 },
  { month: "May 2026", scans: 2 },
  { month: "Jun 2026", scans: 17 },
  { month: "Jul 2026", scans: 4 },
  { month: "Aug 2026", scans: 1 },
  { month: "Sep 2026", scans: 20 },
];

export const SCANS_SUMMARY = {
  peakMonth: "Jun 2026",
  peakScans: "17 scans",
  monthlyAvg: "3",
  avgText: "scans / month",
  totalScans: "20",
  totalText: "in selected date range",
};

export const PUBLISHED_REVIEWS_TREND = [
  { month: "Apr 2026", positive: 0, neutral: 0, negative: 0 },
  { month: "May 2026", positive: 0, neutral: 0, negative: 0 },
  { month: "Jun 2026", positive: 3, neutral: 2, negative: 0 },
  { month: "Jul 2026", positive: 0, neutral: 0, negative: 0 },
  { month: "Aug 2026", positive: 0, neutral: 0, negative: 0 },
  { month: "Sep 2026", positive: 0, neutral: 0, negative: 0 },
];

export const ASPECT_SENTIMENT_ANALYSIS: AspectSentimentItem[] = [
  {
    name: "Store Experience",
    positive: 4,
    neutral: 0,
    negative: 1,
    scoreText: "80% Positive",
    detail: "↑ 4 - 0 - 1",
  },
  {
    name: "Service Quality",
    positive: 2,
    neutral: 2,
    negative: 0,
    scoreText: "50% Positive",
    detail: "↑ 2 - 2 - 0",
  },
  {
    name: "Product Range",
    positive: 4,
    neutral: 0,
    negative: 1,
    scoreText: "80% Positive",
    detail: "↑ 4 - 0 - 1",
  },
  {
    name: "Product Quality",
    positive: 1,
    neutral: 3,
    negative: 1,
    scoreText: "20% Neutral",
    detail: "↑ 1 - 3 - 1",
  },
];

export const REVIEW_ACTIVITY_HEATMAP = {
  timeSlots: ["12 AM", "3 AM", "6 AM", "9 AM", "12 PM", "3 PM", "6 PM", "9 PM"],
  days: [
    { day: "Sun", values: [0, 0, 0, 0, 0, 0, 0, 0] },
    { day: "Mon", values: [0, 0, 0, 0, 0, 0, 0, 0] },
    { day: "Tue", values: [0, 0, 0, 0, 0, 0, 0, 0] },
    { day: "Wed", values: [0, 0, 0, 0, 2, 0, 0, 0] },
    { day: "Thu", values: [0, 0, 0, 0, 0, 0, 0, 0] },
    { day: "Fri", values: [0, 0, 0, 0, 1, 0, 0, 0] },
    { day: "Sat", values: [0, 0, 0, 0, 0, 0, 0, 0] },
  ],
};

export const PEAK_ACTIVITY_HOURS = [
  { period: "Wednesday, 12 PM - 3 PM", tag: "Highest volume slot", count: "2 scans" },
  { period: "Friday, 12 PM - 3 PM", tag: "Second active slot", count: "1 scans" },
];

export const LOWEST_ACTIVITY_PERIODS = [
  { period: "Overnight (12 AM - 6 AM)", tag: "Zero scan activity", count: "0 scans" },
  { period: "Early Morning (6 AM - 9 AM)", tag: "Zero scan activity", count: "0 scans" },
];

export const CUSTOMER_REVIEW_LOGS: ReviewLogItem[] = [
  {
    id: "log-1",
    storeName: "Demo Store 127",
    storeCode: "demo-store-127",
    address: "JMD Regent Arcade, 4th Floor, MG Road, Mumbai, 400050, Maharashtra, IN",
    dateTime: "Aug 12, 2026 03:47 AM",
    ipAddress: "49.47.70.155",
    device: "Desktop",
    versions: 1,
    status: "Generated",
    reviewText: "The place itself was pretty nice to walk around, had a good vibe. But honestly, the products were a letdown — they didn't hold up like I hoped. The service was okay, not bad, but nothing stood out either.",
  },
  {
    id: "log-2",
    storeName: "Demo Store 127",
    storeCode: "demo-store-127",
    address: "JMD Regent Arcade, 4th Floor, MG Road, Mumbai, 400050, Maharashtra, IN",
    dateTime: "Aug 12, 2026 03:46 AM",
    ipAddress: "49.47.70.155",
    device: "Desktop",
    versions: 0,
    status: "Started",
  },
  {
    id: "log-3",
    storeName: "Demo Store 127",
    storeCode: "demo-store-127",
    address: "JMD Regent Arcade, 4th Floor, MG Road, Mumbai, 400050, Maharashtra, IN",
    dateTime: "Jul 29, 2026 01:14 AM",
    ipAddress: "106.192.199.2",
    device: "Mobile",
    versions: 1,
    status: "Generated",
    reviewText: "Prompt service and nice clean environment.",
  },
  {
    id: "log-4",
    storeName: "Demo Store 127",
    storeCode: "demo-store-127",
    address: "JMD Regent Arcade, 4th Floor, MG Road, Mumbai, 400050, Maharashtra, IN",
    dateTime: "Jul 28, 2026 06:17 AM",
    ipAddress: "106.192.199.2",
    device: "Desktop",
    versions: 0,
    status: "Started",
  },
  {
    id: "log-5",
    storeName: "Demo Store 127",
    storeCode: "demo-store-127",
    address: "JMD Regent Arcade, 4th Floor, MG Road, Mumbai, 400050, Maharashtra, IN",
    dateTime: "Jul 24, 2026 02:22 AM",
    ipAddress: "106.192.199.2",
    device: "Mobile",
    versions: 0,
    status: "Started",
  },
  {
    id: "log-6",
    storeName: "Demo Store 127",
    storeCode: "demo-store-127",
    address: "JMD Regent Arcade, 4th Floor, MG Road, Mumbai, 400050, Maharashtra, IN",
    dateTime: "Jul 23, 2026 10:14 PM",
    ipAddress: "106.192.199.2",
    device: "Desktop",
    versions: 1,
    status: "Generated",
  },
  {
    id: "log-7",
    storeName: "Demo Store 297",
    storeCode: "demo-store-297",
    address: "JMD Regent Arcade, 4th Floor, MG Road, Bangalore, 560001, Karnataka, IN",
    dateTime: "Jun 24, 2026 03:02 AM",
    ipAddress: "106.192.199.2",
    device: "Mobile",
    versions: 1,
    status: "Generated",
  },
  {
    id: "log-8",
    storeName: "Demo Store 297",
    storeCode: "demo-store-297",
    address: "JMD Regent Arcade, 4th Floor, MG Road, Bangalore, 560001, Karnataka, IN",
    dateTime: "Jun 24, 2026 03:02 AM",
    ipAddress: "106.192.199.2",
    device: "Desktop",
    versions: 0,
    status: "Started",
  },
  {
    id: "log-9",
    storeName: "Demo Store 297",
    storeCode: "demo-store-297",
    address: "JMD Regent Arcade, 4th Floor, MG Road, Bangalore, 560001, Karnataka, IN",
    dateTime: "Jun 23, 2026 09:34 PM",
    ipAddress: "106.192.199.2",
    device: "Mobile",
    versions: 1,
    status: "Shared",
  },
  {
    id: "log-10",
    storeName: "Demo Store 297",
    storeCode: "demo-store-297",
    address: "JMD Regent Arcade, 4th Floor, MG Road, Bangalore, 560001, Karnataka, IN",
    dateTime: "Jun 23, 2026 09:20 PM",
    ipAddress: "106.192.199.2",
    device: "Desktop",
    versions: 1,
    status: "Generated",
  },
  {
    id: "log-11",
    storeName: "Demo Store 308",
    storeCode: "demo-store-308",
    address: "JMD Regent Arcade, 4th Floor, MG Road, Bilaspur, 495001, Chhattisgarh, IN",
    dateTime: "Jun 17, 2026 12:47 AM",
    ipAddress: "106.192.199.2",
    device: "Mobile",
    versions: 1,
    status: "Shared",
  },
  {
    id: "log-12",
    storeName: "Demo Store 308",
    storeCode: "demo-store-308",
    address: "JMD Regent Arcade, 4th Floor, MG Road, Bilaspur, 495001, Chhattisgarh, IN",
    dateTime: "Jun 17, 2026 12:47 AM",
    ipAddress: "106.192.199.2",
    device: "Desktop",
    versions: 0,
    status: "Started",
  },
];

export const REVIEW_OPTIONS_LIST: ReviewOptionItem[] = [
  {
    id: "opt-1",
    name: "Product Range",
    sequence: 4,
    status: "Active",
    lastModifiedAt: "3 months ago",
  },
  {
    id: "opt-2",
    name: "Product Quality",
    sequence: 3,
    status: "Active",
    lastModifiedAt: "0 months ago",
  },
  {
    id: "opt-3",
    name: "Service Quality",
    sequence: 2,
    status: "Active",
    lastModifiedAt: "0 months ago",
  },
  {
    id: "opt-4",
    name: "Store Experience",
    sequence: 1,
    status: "Active",
    lastModifiedAt: "0 months ago",
  },
];

export function downloadDetailedReport() {
  const headers = ["Log ID", "Store Name", "Store Code", "Address", "Date & Time", "IP Address", "Device", "Versions", "Status"];
  const rows = CUSTOMER_REVIEW_LOGS.map((l) => [
    l.id,
    l.storeName,
    l.storeCode,
    `"${l.address}"`,
    l.dateTime,
    l.ipAddress,
    l.device,
    l.versions,
    l.status,
  ]);
  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "Detailed_Review_Logs_Report.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadSummarizedReport() {
  const headers = ["Metric", "Value", "Notes"];
  const rows = [
    ["Total QR Scans", "20", "Overall scanned count"],
    ["Completion Rate", "25%", "Successful completion percentage"],
    ["Edit Rate", "20%", "AI draft edit ratio"],
    ["Average Completion Time", "2m 47s", "Mean session duration"],
    ["Generated Reviews", "9", "Total reviews created"],
    ["Shared Reviews", "5", "Reviews posted to Google"],
  ];
  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "Summarized_Review_Assistant_Report.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
