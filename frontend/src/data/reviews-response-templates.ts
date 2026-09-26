export interface ResponseTemplateItem {
  id: string;
  title: string;
  category: "Service" | "Product" | "Pricing" | "Ambience" | "Quality" | "Delivery" | "General";
  targetRating: "5-Star" | "4-Star" | "3-Star" | "1-2 Star" | "All Ratings";
  sentiment: "Positive" | "Neutral" | "Negative";
  variables: string[];
  content: string;
  usageCount: number;
  status: "Approved" | "Draft" | "Archived";
  lastUpdated: string;
  author: string;
}

export interface ResponseTemplateStat {
  label: string;
  value: string;
  change: string;
  changeType: "up" | "down" | "neutral";
  subtitle: string;
}

export const RESPONSE_TEMPLATE_STATS: ResponseTemplateStat[] = [
  {
    label: "Active Templates",
    value: "12 Templates",
    change: "+2 this month",
    changeType: "up",
    subtitle: "Across 7 Categories",
  },
  {
    label: "Total Uses",
    value: "4,820 Uses",
    change: "+14.2%",
    changeType: "up",
    subtitle: "Auto-filled in Review Responses",
  },
  {
    label: "Avg Time Saved",
    value: "4.5 Min",
    change: "-38% response time",
    changeType: "up",
    subtitle: "Per customer reply",
  },
  {
    label: "Brand Compliance",
    value: "99.2%",
    change: "+1.5%",
    changeType: "up",
    subtitle: "Approved language score",
  },
];

export const RESPONSE_TEMPLATE_USAGE_CHART_DATA = [
  { category: "Service Recovery", count: 1840, fill: "#3b82f6" },
  { category: "5-Star Gratitude", count: 1420, fill: "#10b981" },
  { category: "Product Inquiry", count: 680, fill: "#3b82f6" },
  { category: "Pricing & Offer", count: 420, fill: "#8b5cf6" },
  { category: "Ambience Feedback", count: 290, fill: "#ec4899" },
  { category: "Delivery Issue", count: 170, fill: "#ef4444" },
];

export const INITIAL_RESPONSE_TEMPLATES: ResponseTemplateItem[] = [
  {
    id: "tpl-1",
    title: "5-Star Appreciation & Brand Loyalty",
    category: "Service",
    targetRating: "5-Star",
    sentiment: "Positive",
    variables: ["Customer_Name", "Store_Name", "City"],
    content: "Hi {Customer_Name}, thank you so much for taking the time to leave us a 5-star review! We're thrilled to hear you had an amazing experience at {Store_Name} in {City}. We look forward to welcoming you back soon!",
    usageCount: 1840,
    status: "Approved",
    lastUpdated: "12 May 2026",
    author: "Marketing Team",
  },
  {
    id: "tpl-2",
    title: "1-2 Star Critical Service Recovery & Callback",
    category: "Service",
    targetRating: "1-2 Star",
    sentiment: "Negative",
    variables: ["Customer_Name", "Store_Name", "Manager_Phone"],
    content: "Dear {Customer_Name}, we sincerely apologize for falling short of your expectations during your visit to {Store_Name}. Your experience is very important to us. Please reach out directly to our store manager at {Manager_Phone} so we can make this right.",
    usageCount: 960,
    status: "Approved",
    lastUpdated: "10 May 2026",
    author: "Customer Ops",
  },
  {
    id: "tpl-3",
    title: "4-Star Positive Feedback & Continuous Improvement",
    category: "General",
    targetRating: "4-Star",
    sentiment: "Positive",
    variables: ["Customer_Name", "Store_Name"],
    content: "Hi {Customer_Name}, thanks a lot for your 4-star rating! We're glad you enjoyed your visit to {Store_Name}. We're constantly striving for 5-star service, so please let us know how we can make your next visit even better.",
    usageCount: 720,
    status: "Approved",
    lastUpdated: "08 May 2026",
    author: "CX Team",
  },
  {
    id: "tpl-4",
    title: "Product Quality & Item Availability Response",
    category: "Product",
    targetRating: "3-Star",
    sentiment: "Neutral",
    variables: ["Customer_Name", "Product_Name", "Store_Name"],
    content: "Hello {Customer_Name}, thank you for sharing your thoughts regarding {Product_Name} at {Store_Name}. We take product feedback seriously and have shared your notes with our merchandising team to ensure consistent stock and quality.",
    usageCount: 450,
    status: "Approved",
    lastUpdated: "04 May 2026",
    author: "Quality Team",
  },
  {
    id: "tpl-5",
    title: "Pricing & Promotional Discount Clarification",
    category: "Pricing",
    targetRating: "3-Star",
    sentiment: "Neutral",
    variables: ["Customer_Name", "Store_Name", "Promo_Code"],
    content: "Hi {Customer_Name}, thank you for reaching out about our pricing and offers at {Store_Name}. We strive to provide transparent value. Use code {Promo_Code} on your next visit for an exclusive discount as our appreciation.",
    usageCount: 310,
    status: "Approved",
    lastUpdated: "01 May 2026",
    author: "Marketing Team",
  },
  {
    id: "tpl-6",
    title: "Store Ambience & Seating Comfort Reply",
    category: "Ambience",
    targetRating: "4-Star",
    sentiment: "Positive",
    variables: ["Customer_Name", "Store_Name"],
    content: "Hi {Customer_Name}, we're delighted to hear that you enjoyed the atmosphere and ambience at {Store_Name}! Creating a comfortable environment for our guests is a top priority.",
    usageCount: 280,
    status: "Approved",
    lastUpdated: "28 Apr 2026",
    author: "Store Operations",
  },
  {
    id: "tpl-7",
    title: "Delivery Delay & Order Follow-Up",
    category: "Delivery",
    targetRating: "1-2 Star",
    sentiment: "Negative",
    variables: ["Customer_Name", "Order_ID", "Support_Email"],
    content: "Hello {Customer_Name}, we regret to learn about the delay with Order #{Order_ID}. This does not reflect our standard delivery speed. Please email us at {Support_Email} with your details so we can investigate and credit your account.",
    usageCount: 160,
    status: "Approved",
    lastUpdated: "25 Apr 2026",
    author: "Logistics Team",
  },
  {
    id: "tpl-8",
    title: "Draft - Seasonal Campaign Special Response",
    category: "General",
    targetRating: "5-Star",
    sentiment: "Positive",
    variables: ["Customer_Name", "Campaign_Name"],
    content: "Hi {Customer_Name}, thank you for joining us for our {Campaign_Name}! We are so happy you loved the special event offerings.",
    usageCount: 0,
    status: "Draft",
    lastUpdated: "15 May 2026",
    author: "Brand Team",
  },
];
