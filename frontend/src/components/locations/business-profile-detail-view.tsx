import { useState, useMemo } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import {
  ArrowLeft,
  BarChart3,
  Building2,
  Calendar as CalendarIcon,
  Check,
  CheckCircle2,
  ChevronRight,
  Download,
  ExternalLink,
  Globe,
  Home,
  Hourglass,
  MapPin,
  Phone,
  QrCode,
  RefreshCw,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Tag,
  TrendingDown,
  TrendingUp,
  UserCheck,
  X,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { GoogleGIcon } from "@/components/ui/google-g-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { evaluateDateRange } from "@/lib/date-range";

const CUSTOM_TOOLTIP_STYLE = {
  background: "#18181b",
  border: "1px solid #3f3f46",
  borderRadius: 6,
  fontSize: 12,
  color: "#f4f4f5",
};

interface BusinessProfileDetailViewProps {
  onBack: () => void;
  location?: any;
}

export function BusinessProfileDetailView({
  onBack,
  location,
}: BusinessProfileDetailViewProps) {
  const [activeTab, setActiveTab] = useState("listing-details");
  const [dateRange, setDateRange] = useState("01 Apr 2026 - 17 Sep 2026");
  const [isSyncing, setIsSyncing] = useState(false);
  const [chartPerformerMode, setChartPerformerMode] = useState<"chart" | "top5" | "worst5">("chart");
  const [weeklyViewMode, setWeeklyViewMode] = useState<"Action" | "Performance">("Action");

  // Reviews tab state matching Screenshots 1 & 2
  const [reviewResponseTimeGranularity, setReviewResponseTimeGranularity] = useState<"Minutes" | "Hours" | "Days">("Minutes");
  const [reviewFilterStatus, setReviewFilterStatus] = useState<"all" | "responded" | "unresponded">("all");
  const [reviewRatingFilter, setReviewRatingFilter] = useState<string>("all");

  const dateAnalysis = useMemo(() => evaluateDateRange(dateRange), [dateRange]);
  const { hasData, multiplier } = dateAnalysis;

  // Reviews Tab Datasets matching Screenshots 1 & 2
  const profileReviewTextVsNoTextDonut = useMemo(() => [
    { name: "Text", value: hasData ? Math.round(19 * multiplier) : 0, fill: "#3b82f6" },
    { name: "No Text", value: hasData ? Math.round(5 * multiplier) : 0, fill: "#eab308" },
  ], [hasData, multiplier]);

  const profileReviewRepliedVsNotRepliedDonut = useMemo(() => [
    { name: "Replied", value: hasData ? Math.round(20 * multiplier) : 0, fill: "#3b82f6" },
    { name: "Not Replied", value: hasData ? Math.round(4 * multiplier) : 0, fill: "#eab308" },
  ], [hasData, multiplier]);

  const profileReviewOverTimeTrend = useMemo(() => [
    { date: "Apr 2026", reviews: hasData ? Math.round(6 * multiplier) : 0 },
    { date: "May 2026", reviews: hasData ? Math.round(4 * multiplier) : 0 },
    { date: "Jun 2026", reviews: hasData ? Math.round(5 * multiplier) : 0 },
    { date: "Jul 2026", reviews: hasData ? Math.round(3 * multiplier) : 0 },
    { date: "Aug 2026", reviews: hasData ? Math.round(4 * multiplier) : 0 },
    { date: "Sep 2026", reviews: hasData ? Math.round(2 * multiplier) : 0 },
  ], [hasData, multiplier]);

  const profileAverageResponseTimeTrend = useMemo(() => [
    { date: "Apr 2026", minutes: hasData ? 12 : 0 },
    { date: "May 2026", minutes: hasData ? 15 : 0 },
    { date: "Jun 2026", minutes: hasData ? 10 : 0 },
    { date: "Jul 2026", minutes: hasData ? 14 : 0 },
    { date: "Aug 2026", minutes: hasData ? 16 : 0 },
    { date: "Sep 2026", minutes: hasData ? 14 : 0 },
  ], [hasData]);

  const profileSentimentOverTimeTrend = useMemo(() => [
    { date: "Apr 2026", positive: hasData ? Math.round(5 * multiplier) : 0, neutral: hasData ? Math.round(1 * multiplier) : 0, negative: 0 },
    { date: "May 2026", positive: hasData ? Math.round(3 * multiplier) : 0, neutral: hasData ? Math.round(1 * multiplier) : 0, negative: 0 },
    { date: "Jun 2026", positive: hasData ? Math.round(4 * multiplier) : 0, neutral: 0, negative: hasData ? Math.round(1 * multiplier) : 0 },
    { date: "Jul 2026", positive: hasData ? Math.round(3 * multiplier) : 0, neutral: 0, negative: 0 },
    { date: "Aug 2026", positive: hasData ? Math.round(3 * multiplier) : 0, neutral: hasData ? Math.round(1 * multiplier) : 0, negative: 0 },
    { date: "Sep 2026", positive: hasData ? Math.round(2 * multiplier) : 0, neutral: 0, negative: 0 },
  ], [hasData, multiplier]);

  const profileReviewsList = useMemo(() => [
    {
      id: "1",
      author: "Rahul Sharma",
      rating: 5,
      date: "15 Sep 2026",
      text: "Great collection of footwear and very helpful store staff! Highly recommended.",
      status: "Replied",
      response: "Thank you Rahul for your kind review! We look forward to serving you again.",
    },
    {
      id: "2",
      author: "Priya Patel",
      rating: 4,
      date: "10 Sep 2026",
      text: "Good experience overall. Nice sports shoes variety.",
      status: "Replied",
      response: "Thanks Priya for your feedback!",
    },
    {
      id: "3",
      author: "Amit Verma",
      rating: 5,
      date: "02 Sep 2026",
      text: "Excellent customer service and fair pricing.",
      status: "Replied",
      response: "Thank you Amit!",
    },
    {
      id: "4",
      author: "Sneh Lata",
      rating: 3,
      date: "28 Aug 2026",
      text: "Store was crowded but product quality is decent.",
      status: "Unresponded",
      response: "",
    },
  ], []);

  const filteredProfileReviews = useMemo(() => {
    return profileReviewsList.filter((item) => {
      const matchesStatus =
        reviewFilterStatus === "all" ||
        (reviewFilterStatus === "responded" && item.status === "Replied") ||
        (reviewFilterStatus === "unresponded" && item.status === "Unresponded");

      const matchesRating =
        reviewRatingFilter === "all" || item.rating === Number(reviewRatingFilter);

      return matchesStatus && matchesRating;
    });
  }, [reviewFilterStatus, reviewRatingFilter, profileReviewsList]);

  // Performance tab datasets matching Screenshots 1 & 2
  const profilePerformanceDonut1 = [
    { name: "Desktop Impressions", value: 900, fill: "#3b82f6" },
    { name: "Mobile Impressions", value: 5200, fill: "#10b981" },
  ];

  const profilePerformanceDonut2 = [
    { name: "Desktop Search", value: 700, fill: "#10b981" },
    { name: "Mobile Search", value: 3900, fill: "#3b82f6" },
  ];

  const profilePerformanceDonut3 = [
    { name: "Desktop Maps", value: 200, fill: "#10b981" },
    { name: "Mobile Maps", value: 1300, fill: "#ef4444" },
  ];

  const profilePerformanceTrend = [
    { date: "Apr 2026", desktopSearch: 3800, mobileSearch: 1400, desktopMaps: 800, mobileMaps: 300 },
    { date: "May 2026", desktopSearch: 120, mobileSearch: 80, desktopMaps: 40, mobileMaps: 15 },
    { date: "Jun 2026", desktopSearch: 80, mobileSearch: 60, desktopMaps: 30, mobileMaps: 10 },
    { date: "Jul 2026", desktopSearch: 95, mobileSearch: 70, desktopMaps: 35, mobileMaps: 12 },
    { date: "Aug 2026", desktopSearch: 110, mobileSearch: 85, desktopMaps: 45, mobileMaps: 18 },
    { date: "Sep 2026", desktopSearch: 130, mobileSearch: 90, desktopMaps: 50, mobileMaps: 20 },
  ];

  const profileCustomerActionsDonut = [
    { name: "Call Clicks", value: 56, fill: "#eab308" },
    { name: "Website Clicks", value: 19, fill: "#06b6d4" },
    { name: "Direction Requests", value: 315, fill: "#a855f7" },
  ];

  const profileActionTrend = [
    { date: "Apr 2026", directionRequests: 290, callClicks: 56, websiteClicks: 19 },
    { date: "May 2026", directionRequests: 18, callClicks: 4, websiteClicks: 2 },
    { date: "Jun 2026", directionRequests: 12, callClicks: 3, websiteClicks: 1 },
    { date: "Jul 2026", directionRequests: 15, callClicks: 4, websiteClicks: 2 },
    { date: "Aug 2026", directionRequests: 22, callClicks: 5, websiteClicks: 2 },
    { date: "Sep 2026", directionRequests: 28, callClicks: 6, websiteClicks: 3 },
  ];

  const profileWeekdayAnalysis = [
    { id: 1, day: "Sunday", totalActions: 70, changePct: "-84.4%", websiteClicks: 3, websiteChange: "-81.9%", callClicks: 14, callChange: "-75.4%", directionRequests: 53, directionChange: "-85.9%" },
    { id: 2, day: "Monday", totalActions: 45, changePct: "-84.8%", websiteClicks: 2, websiteChange: "-77.8%", callClicks: 6, callChange: "-89.5%", directionRequests: 37, directionChange: "-83.9%" },
    { id: 3, day: "Tuesday", totalActions: 28, changePct: "-90.6%", websiteClicks: 2, websiteChange: "-90.8%", callClicks: 4, callChange: "-92%", directionRequests: 22, directionChange: "-90.1%" },
    { id: 4, day: "Wednesday", totalActions: 54, changePct: "-80.6%", websiteClicks: 6, websiteChange: "0%", callClicks: 7, callChange: "-88.7%", directionRequests: 41, directionChange: "-82.6%" },
    { id: 5, day: "Thursday", totalActions: 71, changePct: "-71.3%", websiteClicks: 2, websiteChange: "-61.8%", callClicks: 8, callChange: "-85.7%", directionRequests: 61, directionChange: "-65.3%" },
    { id: 6, day: "Friday", totalActions: 68, changePct: "-77.9%", websiteClicks: 2, websiteChange: "-100%", callClicks: 18, callChange: "-81.1%", directionRequests: 48, directionChange: "-74.7%" },
    { id: 7, day: "Saturday", totalActions: 52, changePct: "-85.3%", websiteClicks: 2, websiteChange: "-88.3%", callClicks: 7, callChange: "-85.4%", directionRequests: 43, directionChange: "-85.7%" },
  ];

  const defaultLoc = {
    name: "Demo Store 127",
    storeCode: "demo-store-127",
    address: "JMD Regent Arcade, 4th floor, MG Road, Mumbai, 400050, Maharashtra, IN",
    phone: "+91-8368761913",
    additionalPhones: "N/A",
    website: "https://insightsrank.com/",
    lat: "28.479716",
    lng: "77.0885703",
    visibilityScore: "100%",
    avgRank: "13",
    totalKeywords: "5",
    completionScore: "100%",
    managerName: "Pushkar Rana",
    managerPhone: "+918368999766",
    managerEmail: "pushkar.rana@insightsrank.com",
  };

  const loc = {
    ...defaultLoc,
    ...location,
    name: location?.name || defaultLoc.name,
    storeCode: location?.storeCode || defaultLoc.storeCode,
    address: location?.address || defaultLoc.address,
    phone: location?.phone || location?.contacts?.[0] || defaultLoc.phone,
    additionalPhones: location?.additionalPhones || defaultLoc.additionalPhones,
    website: location?.website || defaultLoc.website,
    lat: location?.lat || defaultLoc.lat,
    lng: location?.lng || defaultLoc.lng,
    visibilityScore: hasData ? (location?.visibilityScore || defaultLoc.visibilityScore) : "0%",
    avgRank: hasData ? (location?.avgRank || defaultLoc.avgRank) : "0.0",
    totalKeywords: hasData ? (location?.totalKeywords || defaultLoc.totalKeywords) : "0",
    completionScore: location?.completionScore || defaultLoc.completionScore,
    managerName: location?.managerName || defaultLoc.managerName,
    managerPhone: location?.managerPhone || defaultLoc.managerPhone,
    managerEmail: location?.managerEmail || defaultLoc.managerEmail,
  };

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      toast.success(`Successfully synced ${loc.name} with connected platforms`);
    }, 1200);
  };

  const handleDownloadQR = () => {
    toast.success("Downloading QR Code for Review...");
  };

  // Keyword chart data matching Screenshots 4 & 5
  const keywordTrendData = [
    { date: "29 Mar", kw1: 15, kw2: 18, kw3: 20, kw4: 20, kw5: 20 },
    { date: "05 Apr", kw1: 20, kw2: 20, kw3: 20, kw4: 20, kw5: 20 },
    { date: "12 Apr", kw1: 20, kw2: 20, kw3: 20, kw4: 20, kw5: 20 },
    { date: "19 Apr", kw1: 20, kw2: 20, kw3: 20, kw4: 20, kw5: 20 },
    { date: "26 Apr", kw1: 7, kw2: 10, kw3: 13, kw4: 20, kw5: 20 },
    { date: "03 May", kw1: 20, kw2: 20, kw3: 20, kw4: 20, kw5: 20 },
    { date: "10 May", kw1: 20, kw2: 20, kw3: 20, kw4: 20, kw5: 20 },
    { date: "17 May", kw1: 20, kw2: 20, kw3: 20, kw4: 20, kw5: 20 },
    { date: "24 May", kw1: 20, kw2: 20, kw3: 20, kw4: 20, kw5: 20 },
    { date: "31 May", kw1: 20, kw2: 20, kw3: 20, kw4: 20, kw5: 20 },
    { date: "07 Jun", kw1: 20, kw2: 20, kw3: 20, kw4: 20, kw5: 20 },
    { date: "14 Jun", kw1: 20, kw2: 20, kw3: 20, kw4: 20, kw5: 20 },
    { date: "21 Jun", kw1: 20, kw2: 20, kw3: 20, kw4: 20, kw5: 20 },
    { date: "28 Jun", kw1: 20, kw2: 20, kw3: 20, kw4: 20, kw5: 20 },
    { date: "05 Jul", kw1: 20, kw2: 20, kw3: 20, kw4: 20, kw5: 20 },
    { date: "12 Jul", kw1: 20, kw2: 20, kw3: 20, kw4: 20, kw5: 20 },
    { date: "15 Jul", kw1: 20, kw2: 20, kw3: 20, kw4: 20, kw5: 20 },
    { date: "26 Jul", kw1: 20, kw2: 20, kw3: 20, kw4: 20, kw5: 20 },
    { date: "02 Aug", kw1: 20, kw2: 20, kw3: 20, kw4: 20, kw5: 20 },
    { date: "09 Aug", kw1: 20, kw2: 20, kw3: 20, kw4: 20, kw5: 20 },
    { date: "16 Aug", kw1: 20, kw2: 20, kw3: 20, kw4: 20, kw5: 20 },
    { date: "23 Aug", kw1: 20, kw2: 20, kw3: 20, kw4: 20, kw5: 20 },
    { date: "30 Aug", kw1: 20, kw2: 20, kw3: 20, kw4: 20, kw5: 20 },
    { date: "06 Sept", kw1: 20, kw2: 20, kw3: 20, kw4: 20, kw5: 20 },
    { date: "13 Sept", kw1: 20, kw2: 20, kw3: 20, kw4: 20, kw5: 20 },
  ];

  const top5PerformingKeywords = [
    {
      keyword: "men shoes",
      currentRank: "#7",
      averageRank: "#11",
      previousRank: "#8",
      change: "+1",
      changePositive: true,
      topCompetitor: "Navrang Shoes",
      competitorRank: "#2",
    },
    {
      keyword: "footwear shop near me",
      currentRank: "#12",
      averageRank: "#17",
      previousRank: "#20",
      change: "+0",
      changePositive: true,
      topCompetitor: "KIYANSH SHOES - Best Footwear Shop in Bhandup",
      competitorRank: "#1",
    },
    {
      keyword: "shoe shop near me",
      currentRank: "#13",
      averageRank: "#16",
      previousRank: "#15",
      change: "+2",
      changePositive: true,
      topCompetitor: "New Maharashtra Footwear",
      competitorRank: "#1",
    },
    {
      keyword: "ladies shoes",
      currentRank: "20+",
      averageRank: "20+",
      previousRank: "20+",
      change: "0",
      changePositive: false,
      topCompetitor: "Sadhika Ladies Footwear",
      competitorRank: "#1",
    },
    {
      keyword: "sports shoes",
      currentRank: "20+",
      averageRank: "20+",
      previousRank: "20+",
      change: "0",
      changePositive: false,
      topCompetitor: "TAB SPORTS BELAPUR : Best Sports Shoe store in Belapur",
      competitorRank: "#2",
    },
  ];

  const worst5PerformingKeywords = [
    {
      keyword: "ladies shoes",
      currentRank: "20+",
      averageRank: "20+",
      previousRank: "20+",
      change: "0",
      changePositive: false,
      topCompetitor: "Sadhika Ladies Footwear",
      competitorRank: "#1",
    },
    {
      keyword: "sports shoes",
      currentRank: "20+",
      averageRank: "20+",
      previousRank: "20+",
      change: "0",
      changePositive: false,
      topCompetitor: "TAB SPORTS BELAPUR : Best Sports Shoe store in Belapur",
      competitorRank: "#2",
    },
    {
      keyword: "shoe shop near me",
      currentRank: "#13",
      averageRank: "#16",
      previousRank: "#15",
      change: "+2",
      changePositive: true,
      topCompetitor: "New Maharashtra Footwear",
      competitorRank: "#1",
    },
    {
      keyword: "footwear shop near me",
      currentRank: "#12",
      averageRank: "#17",
      previousRank: "#20",
      change: "+0",
      changePositive: true,
      topCompetitor: "KIYANSH SHOES - Best Footwear Shop in Bhandup",
      competitorRank: "#1",
    },
    {
      keyword: "men shoes",
      currentRank: "#7",
      averageRank: "#11",
      previousRank: "#8",
      change: "+1",
      changePositive: true,
      topCompetitor: "Navrang Shoes",
      competitorRank: "#2",
    },
  ];

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200 pb-16">
      {/* Breadcrumb Navigation matching Create Listing UI */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground px-1 pb-1">
        <Home
          className="size-3.5 text-muted-foreground hover:text-foreground cursor-pointer"
          onClick={onBack}
        />
        <ChevronRight className="size-3 text-muted-foreground/60" />
        <span onClick={onBack} className="cursor-pointer hover:text-foreground font-medium">
          Business Profiles
        </span>
        <ChevronRight className="size-3 text-muted-foreground/60" />
        <span className="font-semibold text-foreground">Business Profile Details</span>
      </div>

      {/* Rounded Off-Black Card Container wrapping main content */}
      <div className="rounded-2xl bg-card dark:bg-[#141416] p-6 sm:p-8 space-y-6 shadow-xl border border-border">
        {/* Main Title & Action Buttons Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-xl font-bold text-foreground tracking-tight">
            Business Profile - {loc.name}
          </h1>

          <div className="flex flex-wrap items-center gap-3">
            {/* Functional Date Range Picker */}
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
              variant="input"
              className="w-56"
            />

            {/* Sync Now Button */}
            <Button
              size="sm"
              onClick={handleSync}
              disabled={isSyncing}
              className="h-8 bg-blue-500 hover:bg-blue-600 text-black font-semibold text-xs gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`size-3.5 ${isSyncing ? "animate-spin" : ""}`} />
              <span>Sync Now</span>
            </Button>

            {/* Back Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="h-8 border-slate-300 dark:border-[#3f3f46] bg-white dark:bg-[#18181b] hover:bg-slate-100 dark:hover:bg-[#27272a] text-foreground text-xs gap-1 cursor-pointer"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back</span>
            </Button>
          </div>
        </div>

      {/* Top Profile Summary Card matching Screenshot 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-5 rounded-xl border border-slate-300 dark:border-[#27272a] bg-white dark:bg-[#18181b]">
        {/* Left Image Placeholder (col 3) */}
        <div className="lg:col-span-3 rounded-lg border border-slate-300 dark:border-[#27272a] bg-slate-50 dark:bg-[#121214] flex flex-col items-center justify-center min-h-[160px] p-4 text-center">
          <Building2 className="size-14 text-muted-foreground/30 mb-2" />
          <span className="text-xs text-muted-foreground font-medium">No Image Uploaded</span>
        </div>

        {/* Middle Info Details (col 6) */}
        <div className="lg:col-span-6 space-y-2 py-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold text-foreground">{loc.name}</h2>
            <Badge className="bg-emerald-950/80 text-emerald-400 border-emerald-800/80 text-[10px] font-semibold gap-1">
              <GoogleGIcon className="size-3" />
              Google: Synced
            </Badge>
            <Badge variant="outline" className="text-muted-foreground border-slate-300 dark:border-[#3f3f46] text-[10px]">
              Facebook: Not connected
            </Badge>
          </div>

          <div className="space-y-1 text-xs text-muted-foreground">
            <p className="flex items-start gap-1.5">
              <MapPin className="size-3.5 text-blue-500 shrink-0 mt-0.5" />
              <span>{loc.address}</span>
            </p>
            <p className="pl-5 text-[11px] font-mono text-muted-foreground/80">
              {loc.lat}, {loc.lng}
            </p>
            <a
              href={`https://maps.google.com/?q=${loc.lat},${loc.lng}`}
              target="_blank"
              rel="noreferrer"
              className="pl-5 inline-flex items-center gap-1 text-[11px] font-semibold text-blue-500 hover:underline cursor-pointer"
            >
              <ExternalLink className="size-3" />
              View on Map
            </a>
          </div>

          <div className="flex flex-wrap gap-4 pt-1 text-xs">
            <span className="flex items-center gap-1.5 text-foreground font-medium">
              <Phone className="size-3.5 text-blue-500" />
              {loc.phone}
            </span>
            <a
              href={loc.website}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-blue-500 hover:underline font-medium cursor-pointer"
            >
              <Globe className="size-3.5" />
              {loc.website}
            </a>
          </div>
        </div>

        {/* Right QR Code Box matching Screenshot 1 (col 3 with left divider line) */}
        <div className="lg:col-span-3 rounded-lg border border-slate-300 dark:border-[#27272a] lg:border-l lg:border-l-[#27272a] bg-slate-50 dark:bg-[#121214] p-3 flex flex-col items-center justify-between text-center space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
            Scan for Review
          </span>
          <div className="size-20 bg-white p-1.5 rounded flex items-center justify-center">
            <QrCode className="size-full text-black" />
          </div>
          <div className="flex gap-2 w-full pt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadQR}
              className="flex-1 h-7 text-[10px] border-slate-300 dark:border-[#3f3f46] bg-white dark:bg-[#18181b] hover:bg-slate-100 dark:hover:bg-slate-100 dark:bg-[#27272a] text-foreground cursor-pointer gap-1"
            >
              <Download className="size-3 text-blue-500" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info(`Review link: ${loc.website}review`)}
              className="flex-1 h-7 text-[10px] border-slate-300 dark:border-[#3f3f46] bg-white dark:bg-[#18181b] hover:bg-slate-100 dark:hover:bg-slate-100 dark:bg-[#27272a] text-foreground cursor-pointer gap-1"
            >
              <ExternalLink className="size-3 text-blue-500" />
              Open Link
            </Button>
          </div>
        </div>
      </div>

      {/* 4 KPI Score Cards Row matching Screenshot 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Visibility Score */}
        <div className="p-4 rounded-xl border border-slate-300 dark:border-[#27272a] bg-white dark:bg-[#18181b] space-y-2">
          <div className="flex items-center justify-between text-xs text-blue-500 font-semibold">
            <span className="flex items-center gap-1">
              <Search className="size-3.5" /> Visibility Score
            </span>
          </div>
          <p className="text-3xl font-extrabold text-foreground tnum">{loc.visibilityScore}</p>
          <p className="text-[10px] text-muted-foreground">Last Run 01 May, 26</p>
        </div>

        {/* Average Ranking */}
        <div className="p-4 rounded-xl border border-slate-300 dark:border-[#27272a] bg-white dark:bg-[#18181b] space-y-2">
          <div className="flex items-center justify-between text-xs text-blue-500 font-semibold">
            <span className="flex items-center gap-1">
              <TrendingDown className="size-3.5 text-red-400" /> Average Ranking
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-extrabold text-foreground tnum">{loc.avgRank}</p>
            <span className="text-[10px] text-red-400 font-medium">↓ 0.0999999999999993</span>
          </div>
          <p className="text-[10px] text-muted-foreground">Last Run 01 May, 26</p>
        </div>

        {/* Total Keywords */}
        <div className="p-4 rounded-xl border border-slate-300 dark:border-[#27272a] bg-white dark:bg-[#18181b] space-y-2">
          <div className="flex items-center justify-between text-xs text-blue-500 font-semibold">
            <span className="flex items-center gap-1">
              <Tag className="size-3.5" /> Total Keyword(s)
            </span>
          </div>
          <p className="text-3xl font-extrabold text-foreground tnum">{loc.totalKeywords}</p>
          <p className="text-[10px] text-muted-foreground">Last Run 01 May, 26</p>
        </div>

        {/* Completion Score */}
        <div className="p-4 rounded-xl border border-slate-300 dark:border-[#27272a] bg-white dark:bg-[#18181b] space-y-2">
          <div className="flex items-center justify-between text-xs text-blue-500 font-semibold">
            <span className="flex items-center gap-1">
              <UserCheck className="size-3.5" /> Completion Score
            </span>
          </div>
          <p className="text-3xl font-extrabold text-foreground tnum">{loc.completionScore}</p>
          <p className="text-[10px] text-muted-foreground">All sections complete</p>
        </div>
      </div>

      {/* Sub Navigation Tabs matching Screenshot 1 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-white dark:bg-[#18181b] border-b border-slate-300 dark:border-[#27272a] w-full justify-start rounded-none h-11 p-0 gap-6">
          {["Listing Details", "Keywords", "Performance", "Reviews"].map((tab) => {
            const tabId = tab.toLowerCase().replace(" ", "-");
            return (
              <TabsTrigger
                key={tabId}
                value={tabId}
                className="data-[state=active]:bg-transparent data-[state=active]:text-blue-500 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none text-xs font-semibold text-muted-foreground hover:text-foreground h-full px-2 cursor-pointer transition-all"
              >
                {tab}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Listing Details Tab matching Screenshots 1, 2, 3 */}
        <TabsContent value="listing-details" className="mt-4 space-y-6">
          {/* NAP Consistency Status Box matching Screenshot 1 */}
          <div className="rounded-xl border border-slate-300 dark:border-[#27272a] bg-white dark:bg-[#18181b] p-4 space-y-3">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider text-muted-foreground">
              NAP Consistency Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-[#27272a] text-xs">
              <div className="pr-4 pb-2 md:pb-0">
                <span className="text-[10px] uppercase text-muted-foreground block font-semibold mb-0.5">Name</span>
                <span className="font-bold text-foreground">{loc.name}</span>
              </div>
              <div className="px-0 md:px-4 py-2 md:py-0">
                <span className="text-[10px] uppercase text-muted-foreground block font-semibold mb-0.5">Address</span>
                <span className="text-foreground">{loc.address}</span>
              </div>
              <div className="pl-0 md:pl-4 pt-2 md:pt-0">
                <span className="text-[10px] uppercase text-muted-foreground block font-semibold mb-0.5">Phone</span>
                <span className="font-medium text-foreground tnum">{loc.phone}</span>
              </div>
            </div>
          </div>

          {/* Grid Layout matching Screenshots 1 & 2 in 50/50 Split Ratio */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column (50% Width): Basic Info & Address + Map Box + Business Hours */}
            <div className="space-y-6">
              {/* Basic Info & Address */}
              <div className="rounded-xl border border-slate-300 dark:border-[#27272a] bg-white dark:bg-[#18181b] p-5 space-y-4">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider text-muted-foreground border-b border-slate-300 dark:border-[#27272a] pb-2">
                  Basic Info & Address
                </h3>
                <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs">
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Business Name</span>
                    <span className="font-semibold text-foreground">{loc.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Store Code</span>
                    <span className="font-mono text-muted-foreground">{loc.storeCode}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Opening Date</span>
                    <span className="text-muted-foreground">N/A</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Business Status</span>
                    <span className="text-emerald-400 font-semibold">Open</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Address line 1</span>
                    <span className="text-foreground">JMD Regent Arcade</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Address line 2</span>
                    <span className="text-foreground">4th floor</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Address line 3</span>
                    <span className="text-foreground">MG Road</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Address line 4</span>
                    <span className="text-muted-foreground">N/A</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Sub-locality</span>
                    <span className="text-muted-foreground">N/A</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Locality</span>
                    <span className="text-foreground">Mumbai</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Pincode</span>
                    <span className="font-mono text-foreground">400050</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Administrative Area</span>
                    <span className="text-foreground">Maharashtra</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Country</span>
                    <span className="text-foreground">IN</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Latitude / Longitude</span>
                    <span className="font-mono text-muted-foreground">{loc.lat}, {loc.lng}</span>
                  </div>
                </div>
              </div>

              {/* Interactive Map Box matching Screenshot 2 */}
              <div className="rounded-xl border border-slate-300 dark:border-[#27272a] bg-white dark:bg-[#18181b] p-3 space-y-2">
                <div className="h-60 bg-slate-50 dark:bg-[#121214] rounded-lg border border-slate-300 dark:border-[#27272a] relative flex items-center justify-center overflow-hidden">
                  <div className="flex flex-col items-center gap-1 z-10">
                    <MapPin className="size-8 text-red-500 animate-bounce" />
                    <span className="text-[11px] font-mono text-muted-foreground bg-white dark:bg-[#18181b]/90 px-2.5 py-0.5 rounded border border-slate-300 dark:border-[#27272a]">
                      {loc.lat}, {loc.lng}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`https://maps.google.com/?q=${loc.lat},${loc.lng}`, "_blank")}
                    className="absolute bottom-2 left-2 h-7 text-[11px] border-slate-300 dark:border-[#3f3f46] bg-white dark:bg-[#18181b] hover:bg-slate-100 dark:hover:bg-slate-100 dark:bg-[#27272a] text-blue-500 font-semibold cursor-pointer gap-1"
                  >
                    <ExternalLink className="size-3" /> Open in Maps ↗
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column (50% Width): Contact & URL, Store Manager, Categories */}
            <div className="space-y-6">
              {/* Contact & URL */}
              <div className="rounded-xl border border-slate-300 dark:border-[#27272a] bg-white dark:bg-[#18181b] p-5 space-y-3">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider text-muted-foreground border-b border-slate-300 dark:border-[#27272a] pb-2">
                  Contact & URL
                </h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Primary Phone Number</span>
                    <span className="font-semibold text-foreground tnum">{loc.phone}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Additional Phone Numbers</span>
                    <span className="text-muted-foreground">{loc.additionalPhones}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-muted-foreground block font-medium">Website URL</span>
                    <a href={loc.website} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline font-medium cursor-pointer">
                      {loc.website}
                    </a>
                  </div>
                </div>
              </div>

              {/* Store Manager */}
              <div className="rounded-xl border border-slate-300 dark:border-[#27272a] bg-white dark:bg-[#18181b] p-5 space-y-3">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider text-muted-foreground border-b border-slate-300 dark:border-[#27272a] pb-2">
                  Store Manager
                </h3>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Name</span>
                    <span className="font-semibold text-foreground">{loc.managerName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Contact No.</span>
                    <span className="font-medium text-blue-500 tnum">{loc.managerPhone}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Email</span>
                    <span className="font-medium text-blue-500 truncate block">{loc.managerEmail}</span>
                  </div>
                </div>
              </div>

              {/* Categories, Description & Tags */}
              <div className="rounded-xl border border-slate-300 dark:border-[#27272a] bg-white dark:bg-[#18181b] p-5 space-y-3">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider text-muted-foreground border-b border-slate-300 dark:border-[#27272a] pb-2">
                  Categories, Description & Tags
                </h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Primary Category</span>
                    <span className="font-bold text-foreground">Shoe Shop</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium mb-1">Additional Categories</span>
                    <div className="flex gap-2">
                      <Badge className="bg-slate-100 dark:bg-[#27272a] text-foreground text-[10px]">Shop</Badge>
                      <Badge className="bg-slate-100 dark:bg-[#27272a] text-foreground text-[10px]">Sportswear Shop</Badge>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Business Description (short)</span>
                    <p className="text-muted-foreground">Demo location for evaluation purposes.</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Business Description (long)</span>
                    <p className="text-muted-foreground">This is a demo location created for staging and evaluation purposes. All details shown here are representative of the platform capabilities.</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium mb-1">Tags</span>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/40 text-[10px]">Test</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Business Hours & Special Hours Side-by-Side Panel matching Screenshot 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Business Hours Table */}
            <div className="rounded-xl border border-slate-300 dark:border-[#27272a] bg-white dark:bg-[#18181b] p-5 space-y-3">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider text-muted-foreground border-b border-slate-300 dark:border-[#27272a] pb-2">
                Business Hours
              </h3>
              <div className="space-y-2 text-xs">
                {[
                  { day: "Monday", open: true, hours: "10:30-21:30" },
                  { day: "Tuesday", open: true, hours: "10:30-21:30" },
                  { day: "Wednesday", open: true, hours: "10:30-21:30" },
                  { day: "Thursday", open: true, hours: "10:30-21:30" },
                  { day: "Friday", open: true, hours: "10:30-21:30" },
                  { day: "Saturday", open: false, hours: "Closed" },
                  { day: "Sunday", open: false, hours: "Closed" },
                ].map((row) => (
                  <div key={row.day} className="flex items-center justify-between py-1 border-b border-slate-300 dark:border-[#27272a]/50">
                    <span className="font-semibold text-foreground w-28">{row.day}</span>
                    <span className={`font-semibold ${row.open ? "text-blue-500" : "text-red-400"}`}>
                      {row.open ? "Open" : "Closed"}
                    </span>
                    <span className="font-mono text-muted-foreground text-right w-32 tnum">{row.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Hours Table matching Screenshot 3 */}
            <div className="rounded-xl border border-slate-300 dark:border-[#27272a] bg-white dark:bg-[#18181b] p-5 space-y-3">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider text-muted-foreground border-b border-slate-300 dark:border-[#27272a] pb-2">
                Special Hours
              </h3>
              <div className="space-y-2 text-xs">
                {[
                  { date: "25 Dec 2026", occasion: "Christmas Day", open: false, hours: "Closed" },
                  { date: "01 Jan 2027", occasion: "New Year's Day", open: false, hours: "Closed" },
                  { date: "26 Jan 2027", occasion: "Republic Day", open: true, hours: "10:30-18:00" },
                  { date: "15 Aug 2027", occasion: "Independence Day", open: true, hours: "10:30-18:00" },
                  { date: "02 Oct 2027", occasion: "Gandhi Jayanti", open: false, hours: "Closed" },
                ].map((row, idx) => (
                  <div key={idx} className="flex items-center justify-between py-1 border-b border-slate-300 dark:border-[#27272a]/50">
                    <div className="space-y-0.5">
                      <span className="font-semibold text-foreground block">{row.date}</span>
                      <span className="text-[10px] text-muted-foreground">{row.occasion}</span>
                    </div>
                    <span className={`font-semibold ${row.open ? "text-blue-500" : "text-red-400"}`}>
                      {row.open ? "Open" : "Closed"}
                    </span>
                    <span className="font-mono text-muted-foreground text-right w-32 tnum">{row.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Full Width Panels below split grid */}
          <div className="space-y-6">
            {/* Services & Attributes matching Screenshot 3 */}
            <div className="rounded-xl border border-slate-300 dark:border-[#27272a] bg-white dark:bg-[#18181b] p-5 space-y-4">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider text-muted-foreground border-b border-slate-300 dark:border-[#27272a] pb-2">
                Services
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-[10px] text-muted-foreground block uppercase font-bold mb-1.5">Service options</span>
                  <div className="flex flex-wrap gap-2">
                    {["Delivery", "In-store pickup", "Onsite services", "In-store shopping"].map((s) => (
                      <Badge key={s} className="bg-blue-500/20 text-blue-400 border border-blue-500/40 text-[10px] px-2.5 py-0.5">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-muted-foreground block uppercase font-bold mb-1.5">Place page URLs</span>
                  <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/40 text-[10px] px-2.5 py-0.5 cursor-pointer">
                    Facebook <ExternalLink className="size-3 ml-1" />
                  </Badge>
                </div>

                <div>
                  <span className="text-[10px] text-muted-foreground block uppercase font-bold mb-1.5">Payments</span>
                  <div className="flex flex-wrap gap-2">
                    {["Debit cards", "NFC mobile payments", "Credit cards", "Cash-only", "Credit cards: Diners Club, JCB, VISA, Discover, MasterCard"].map((p) => (
                      <Badge key={p} className="bg-blue-500/20 text-blue-400 border border-blue-500/40 text-[10px] px-2.5 py-0.5">
                        {p}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-muted-foreground block uppercase font-bold mb-1.5">Offerings</span>
                  <div className="flex flex-wrap gap-2">
                    {["Men's shoes", "Women's shoes", "Kids' shoes"].map((o) => (
                      <Badge key={o} className="bg-blue-500/20 text-blue-400 border border-blue-500/40 text-[10px] px-2.5 py-0.5">
                        {o}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-muted-foreground block uppercase font-bold mb-1.5">Recycling</span>
                  <div className="flex flex-wrap gap-2">
                    {["Clothing", "Electronics"].map((r) => (
                      <Badge key={r} className="bg-slate-100 dark:bg-[#27272a] text-foreground border border-slate-300 dark:border-[#3f3f46] text-[10px] px-2.5 py-0.5">
                        {r}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-muted-foreground block uppercase font-bold mb-1.5">Accessibility</span>
                  <div className="flex flex-wrap gap-2">
                    {["Wheelchair accessible seating", "Wheelchair accessible restroom"].map((a) => (
                      <Badge key={a} className="bg-slate-100 dark:bg-[#27272a] text-foreground border border-slate-300 dark:border-[#3f3f46] text-[10px] px-2.5 py-0.5">
                        {a}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Media matching Screenshot 3 */}
            <div className="rounded-xl border border-slate-300 dark:border-[#27272a] bg-white dark:bg-[#18181b] p-5 space-y-2">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider text-muted-foreground border-b border-slate-300 dark:border-[#27272a] pb-2">
                Media
              </h3>
              <p className="text-xs text-muted-foreground">No media available</p>
            </div>

            {/* Documents matching Screenshot 3 */}
            <div className="rounded-xl border border-slate-300 dark:border-[#27272a] bg-white dark:bg-[#18181b] p-5 space-y-2">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider text-muted-foreground border-b border-slate-300 dark:border-[#27272a] pb-2">
                Documents
              </h3>
              <p className="text-xs text-muted-foreground">No documents available</p>
            </div>
          </div>
        </TabsContent>

        {/* KEYWORDS TAB matching Screenshots 4 & 5 (EXACT UI Reference requested by user!) */}
        <TabsContent value="keywords" className="mt-4 space-y-6">
          {/* Keyword Ranking Performance Panel */}
          <div className="rounded-xl border border-slate-300 dark:border-[#27272a] bg-white dark:bg-[#18181b] p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="size-4 text-blue-500" />
                <h3 className="text-xs font-bold text-blue-500 uppercase tracking-wider">
                  Keyword Ranking Performance
                </h3>
              </div>
            </div>

            {/* Chart View Toggle Buttons matching Screenshots 4 */}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => setChartPerformerMode("chart")}
                className={`h-7 px-3 text-xs font-semibold cursor-pointer rounded-md ${
                  chartPerformerMode === "chart"
                    ? "bg-blue-500 text-black font-bold"
                    : "bg-slate-100 dark:bg-[#27272a] text-foreground hover:bg-slate-200 dark:hover:bg-[#3f3f46]"
                }`}
              >
                Chart View
              </Button>
              <Button
                size="sm"
                onClick={() => setChartPerformerMode("top5")}
                className={`h-7 px-3 text-xs font-semibold cursor-pointer rounded-md ${
                  chartPerformerMode === "top5"
                    ? "bg-blue-500 text-black font-bold"
                    : "bg-slate-100 dark:bg-[#27272a] text-foreground hover:bg-slate-200 dark:hover:bg-[#3f3f46]"
                }`}
              >
                Top 5 Performers
              </Button>
              <Button
                size="sm"
                onClick={() => setChartPerformerMode("worst5")}
                className={`h-7 px-3 text-xs font-semibold cursor-pointer rounded-md ${
                  chartPerformerMode === "worst5"
                    ? "bg-blue-500 text-black font-bold"
                    : "bg-slate-100 dark:bg-[#27272a] text-foreground hover:bg-slate-200 dark:hover:bg-[#3f3f46]"
                }`}
              >
                Worst 5 Performers
              </Button>
            </div>

            {/* Line Chart matching Screenshot 4 */}
            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={keywordTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid stroke="#27272a" vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#a1a1aa", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    reversed
                    tick={{ fill: "#a1a1aa", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    domain={[1, 20]}
                    ticks={[1, 6, 11, 16, 20]}
                    tickFormatter={(val) => (val === 20 ? "20+" : `${val}`)}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#121214",
                      border: "1px solid #27272a",
                      borderRadius: 6,
                      fontSize: 12,
                      color: "#f4f4f5",
                    }}
                  />
                  <Line type="monotone" dataKey="kw1" stroke="#eab308" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="kw2" stroke="#ec4899" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="kw3" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="kw4" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="kw5" stroke="#a855f7" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Keyword Color Dots Legend matching Screenshot 4 */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs pt-2 border-t border-slate-300 dark:border-[#27272a]">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="size-2.5 rounded-full bg-[#eab308]" /> footwear shop near me
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="size-2.5 rounded-full bg-[#ec4899]" /> ladies shoes
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="size-2.5 rounded-full bg-[#22c55e]" /> men shoes
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="size-2.5 rounded-full bg-[#06b6d4]" /> shoe shop near me
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="size-2.5 rounded-full bg-[#a855f7]" /> sports shoes
              </span>
            </div>
          </div>

          {/* Top 5 Movers Section matching Screenshot 4 */}
          <div className="rounded-xl border border-slate-300 dark:border-[#27272a] bg-white dark:bg-[#18181b] p-5 space-y-3">
            <h3 className="text-xs font-bold text-blue-500 uppercase tracking-wider">
              Top 5 Movers
            </h3>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#121214] border border-slate-300 dark:border-[#27272a] w-full max-w-xs space-y-1">
              <p className="text-xs font-bold text-foreground">footwear shop near me</p>
              <div className="flex items-center gap-2 text-xs">
                <span className="font-mono text-muted-foreground font-semibold">#17</span>
                <span className="text-emerald-400 font-bold">↑ +3</span>
              </div>
            </div>
          </div>

          {/* Top 5 Performing Keyword Details Table matching Screenshots 4 & 5 */}
          <div className="rounded-xl border border-slate-300 dark:border-[#27272a] bg-white dark:bg-[#18181b] p-5 space-y-3">
            <h3 className="text-xs font-bold text-blue-500 uppercase tracking-wider">
              Top 5 Performing Keyword Details
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-300 dark:border-[#27272a] text-muted-foreground font-semibold">
                    <th className="py-2.5 px-3">Keyword</th>
                    <th className="py-2.5 px-3">Current Rank</th>
                    <th className="py-2.5 px-3">Average Rank</th>
                    <th className="py-2.5 px-3">Previous Rank</th>
                    <th className="py-2.5 px-3">Change</th>
                    <th className="py-2.5 px-3">Top Competitor</th>
                    <th className="py-2.5 px-3">Competitor Rank</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-[#27272a]/60">
                  {top5PerformingKeywords.map((item, idx) => (
                    <tr key={idx} className="hover:bg-secondary/20 transition-colors">
                      <td className="py-3 px-3 font-semibold text-foreground">{item.keyword}</td>
                      <td className="py-3 px-3 font-mono text-foreground font-medium">{item.currentRank}</td>
                      <td className="py-3 px-3 font-mono text-muted-foreground">{item.averageRank}</td>
                      <td className="py-3 px-3 font-mono text-muted-foreground">{item.previousRank}</td>
                      <td className={`py-3 px-3 font-mono font-bold ${item.changePositive ? "text-emerald-400" : "text-muted-foreground"}`}>
                        {item.change}
                      </td>
                      <td className="py-3 px-3 text-muted-foreground">{item.topCompetitor}</td>
                      <td className="py-3 px-3 font-mono text-foreground font-medium">{item.competitorRank}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Worst 5 Performing Keyword Details Table matching Screenshot 5 */}
          <div className="rounded-xl border border-slate-300 dark:border-[#27272a] bg-white dark:bg-[#18181b] p-5 space-y-3">
            <h3 className="text-xs font-bold text-blue-500 uppercase tracking-wider">
              Worst 5 Performing Keyword Details
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-300 dark:border-[#27272a] text-muted-foreground font-semibold">
                    <th className="py-2.5 px-3">Keyword</th>
                    <th className="py-2.5 px-3">Current Rank</th>
                    <th className="py-2.5 px-3">Average Rank</th>
                    <th className="py-2.5 px-3">Previous Rank</th>
                    <th className="py-2.5 px-3">Change</th>
                    <th className="py-2.5 px-3">Top Competitor</th>
                    <th className="py-2.5 px-3">Competitor Rank</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-[#27272a]/60">
                  {worst5PerformingKeywords.map((item, idx) => (
                    <tr key={idx} className="hover:bg-secondary/20 transition-colors">
                      <td className="py-3 px-3 font-semibold text-foreground">{item.keyword}</td>
                      <td className="py-3 px-3 font-mono text-foreground font-medium">{item.currentRank}</td>
                      <td className="py-3 px-3 font-mono text-muted-foreground">{item.averageRank}</td>
                      <td className="py-3 px-3 font-mono text-muted-foreground">{item.previousRank}</td>
                      <td className={`py-3 px-3 font-mono font-bold ${item.changePositive ? "text-emerald-400" : "text-muted-foreground"}`}>
                        {item.change}
                      </td>
                      <td className="py-3 px-3 text-muted-foreground">{item.topCompetitor}</td>
                      <td className="py-3 px-3 font-mono text-foreground font-medium">{item.competitorRank}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* Performance Tab matching Screenshots 1 & 2 */}
        <TabsContent value="performance" className="mt-4 space-y-6">
          {/* Section Header */}
          <div>
            <h2 className="text-lg font-bold text-foreground tracking-tight">Performance Analyse</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Analyse performance metrics about your brand.</p>
          </div>

          {/* 4 Metric Cards Row matching Screenshot 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-slate-300 dark:border-[#27272a] bg-white dark:bg-[#18181b] space-y-2">
              <div className="flex items-center gap-1.5 text-blue-500 text-xs font-semibold">
                <BarChart3 className="size-3.5" /> Total Impressions
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-foreground tnum">6.1k</span>
                <span className="text-xs font-bold text-red-400 tnum flex items-center gap-0.5">
                  <TrendingDown className="size-3" /> -39.9k
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-300 dark:border-[#27272a] bg-white dark:bg-[#18181b] space-y-2">
              <div className="flex items-center gap-1.5 text-blue-500 text-xs font-semibold">
                <BarChart3 className="size-3.5" /> Mobile Impressions
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-foreground tnum">5.2k</span>
                <span className="text-xs font-bold text-red-400 tnum flex items-center gap-0.5">
                  <TrendingDown className="size-3" /> -36.7k
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-300 dark:border-[#27272a] bg-white dark:bg-[#18181b] space-y-2">
              <div className="flex items-center gap-1.5 text-blue-500 text-xs font-semibold">
                <BarChart3 className="size-3.5" /> Desktop Impressions
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-foreground tnum">0.9k</span>
                <span className="text-xs font-bold text-red-400 tnum flex items-center gap-0.5">
                  <TrendingDown className="size-3" /> -3.1k
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-300 dark:border-[#27272a] bg-white dark:bg-[#18181b] space-y-2">
              <div className="flex items-center gap-1.5 text-blue-500 text-xs font-semibold">
                <BarChart3 className="size-3.5" /> Total Actions
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-foreground tnum">388</span>
                <span className="text-xs font-bold text-red-400 tnum flex items-center gap-0.5">
                  <TrendingDown className="size-3" /> -1.9k
                </span>
              </div>
            </div>
          </div>

          {/* Row of 3 Donut Charts matching Screenshot 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Donut 1: Total Impressions */}
            <div className="p-5 rounded-xl border border-slate-300 dark:border-[#27272a] bg-white dark:bg-[#18181b] space-y-4 flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="size-4 text-blue-500" />
                <h3 className="text-xs font-bold text-blue-500 uppercase tracking-wider">Total Impressions</h3>
              </div>
              <div className="relative h-48 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={profilePerformanceDonut1}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={4}
                      cornerRadius={6}
                      stroke="none"
                    >
                      {profilePerformanceDonut1.map((entry) => (
                        <Cell key={entry.name} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-extrabold text-foreground tnum">6.1k</span>
                  <span className="text-[10px] text-muted-foreground font-medium leading-tight max-w-[70px]">Total Impressions</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-4 text-xs pt-2 border-t border-slate-300 dark:border-[#27272a]">
                <span className="flex items-center gap-1.5 text-muted-foreground"><span className="size-2.5 rounded-sm bg-[#3b82f6]" /> Desktop Impressions</span>
                <span className="flex items-center gap-1.5 text-muted-foreground"><span className="size-2.5 rounded-sm bg-[#10b981]" /> Mobile Impressions</span>
              </div>
            </div>

            {/* Donut 2: Search Impressions */}
            <div className="p-5 rounded-xl border border-slate-300 dark:border-[#27272a] bg-white dark:bg-[#18181b] space-y-4 flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <Search className="size-4 text-blue-500" />
                <h3 className="text-xs font-bold text-blue-500 uppercase tracking-wider">Search Impressions</h3>
              </div>
              <div className="relative h-48 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={profilePerformanceDonut2}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={4}
                      cornerRadius={6}
                      stroke="none"
                    >
                      {profilePerformanceDonut2.map((entry) => (
                        <Cell key={entry.name} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-extrabold text-foreground tnum">4.6k</span>
                  <span className="text-[10px] text-muted-foreground font-medium leading-tight max-w-[70px]">Total Searches</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-4 text-xs pt-2 border-t border-slate-300 dark:border-[#27272a]">
                <span className="flex items-center gap-1.5 text-muted-foreground"><span className="size-2.5 rounded-sm bg-[#10b981]" /> Desktop Search</span>
                <span className="flex items-center gap-1.5 text-muted-foreground"><span className="size-2.5 rounded-sm bg-[#3b82f6]" /> Mobile Search</span>
              </div>
            </div>

            {/* Donut 3: Map Impressions */}
            <div className="p-5 rounded-xl border border-slate-300 dark:border-[#27272a] bg-white dark:bg-[#18181b] space-y-4 flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-blue-500" />
                <h3 className="text-xs font-bold text-blue-500 uppercase tracking-wider">Map Impressions</h3>
              </div>
              <div className="relative h-48 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={profilePerformanceDonut3}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={4}
                      cornerRadius={6}
                      stroke="none"
                    >
                      {profilePerformanceDonut3.map((entry) => (
                        <Cell key={entry.name} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-extrabold text-foreground tnum">1.5k</span>
                  <span className="text-[10px] text-muted-foreground font-medium leading-tight max-w-[70px]">Total Maps</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-4 text-xs pt-2 border-t border-slate-300 dark:border-[#27272a]">
                <span className="flex items-center gap-1.5 text-muted-foreground"><span className="size-2.5 rounded-sm bg-[#10b981]" /> Desktop Maps</span>
                <span className="flex items-center gap-1.5 text-muted-foreground"><span className="size-2.5 rounded-sm bg-[#ef4444]" /> Mobile Maps</span>
              </div>
            </div>
          </div>

          {/* Performance Trend Line Chart Card matching Screenshot 1 */}
          <div className="rounded-xl border border-slate-300 dark:border-[#27272a] bg-white dark:bg-[#18181b] p-5 space-y-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="size-4 text-blue-500" />
              <h3 className="text-xs font-bold text-blue-500 uppercase tracking-wider">Performance</h3>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={profilePerformanceTrend} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                  <CartesianGrid stroke="#27272a" vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fill: "#a1a1aa", fontSize: 10 }} axisLine={{ stroke: "#27272a" }} tickLine={false} />
                  <YAxis tickFormatter={(val) => (val >= 1000 ? `${val / 1000}k` : val)} tick={{ fill: "#a1a1aa", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} />
                  <Line type="monotone" dataKey="desktopSearch" name="Desktop Search" stroke="#eab308" strokeWidth={2} dot={{ fill: "#eab308", r: 3 }} />
                  <Line type="monotone" dataKey="mobileSearch" name="Mobile Search" stroke="#22c55e" strokeWidth={2} dot={{ fill: "#22c55e", r: 3 }} />
                  <Line type="monotone" dataKey="desktopMaps" name="Desktop Maps" stroke="#f97316" strokeWidth={2} dot={{ fill: "#f97316", r: 3 }} />
                  <Line type="monotone" dataKey="mobileMaps" name="Mobile Maps" stroke="#ec4899" strokeWidth={2} dot={{ fill: "#ec4899", r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs pt-2 border-t border-slate-300 dark:border-[#27272a]">
              <span className="flex items-center gap-1.5 text-muted-foreground"><span className="size-2.5 rounded-sm bg-[#eab308]" /> Desktop Search</span>
              <span className="flex items-center gap-1.5 text-muted-foreground"><span className="size-2.5 rounded-sm bg-[#22c55e]" /> Mobile Search</span>
              <span className="flex items-center gap-1.5 text-muted-foreground"><span className="size-2.5 rounded-sm bg-[#f97316]" /> Desktop Maps</span>
              <span className="flex items-center gap-1.5 text-muted-foreground"><span className="size-2.5 rounded-sm bg-[#ec4899]" /> Mobile Maps</span>
            </div>
          </div>

          {/* Customer Actions Section matching Screenshot 2 */}
          <div className="space-y-4 pt-2 border-t border-slate-300 dark:border-[#27272a]">
            <div>
              <h2 className="text-base font-bold text-foreground tracking-tight">Customer Actions</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Monitor customer engagement and interactions with your business.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left Customer Actions Donut Card (4 cols) */}
              <div className="lg:col-span-4 p-5 rounded-xl border border-slate-300 dark:border-[#27272a] bg-white dark:bg-[#18181b] space-y-4 flex flex-col justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="size-4 text-blue-500" />
                  <h3 className="text-xs font-bold text-blue-500 uppercase tracking-wider">Customer Actions</h3>
                </div>
                <div className="relative h-56 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={profileCustomerActionsDonut}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={78}
                        paddingAngle={4}
                        cornerRadius={6}
                        stroke="none"
                      >
                        {profileCustomerActionsDonut.map((entry) => (
                          <Cell key={entry.name} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-extrabold text-foreground tnum">388</span>
                    <span className="text-[10px] text-muted-foreground font-medium leading-tight max-w-[70px]">Total Actions</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 text-xs pt-2 border-t border-slate-300 dark:border-[#27272a]">
                  <span className="flex items-center gap-1.5 text-muted-foreground"><span className="size-2.5 rounded-sm bg-[#eab308]" /> Call Clicks</span>
                  <span className="flex items-center gap-1.5 text-muted-foreground"><span className="size-2.5 rounded-sm bg-[#06b6d4]" /> Website Clicks</span>
                  <span className="flex items-center gap-1.5 text-muted-foreground"><span className="size-2.5 rounded-sm bg-[#a855f7]" /> Direction Requests</span>
                </div>
              </div>

              {/* Right Action Trend Chart Card (8 cols) */}
              <div className="lg:col-span-8 p-5 rounded-xl border border-slate-300 dark:border-[#27272a] bg-white dark:bg-[#18181b] space-y-4 flex flex-col justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="size-4 text-blue-500" />
                  <h3 className="text-xs font-bold text-blue-500 uppercase tracking-wider">Action</h3>
                </div>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={profileActionTrend} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                      <CartesianGrid stroke="#27272a" vertical={false} strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fill: "#a1a1aa", fontSize: 10 }} axisLine={{ stroke: "#27272a" }} tickLine={false} />
                      <YAxis tick={{ fill: "#a1a1aa", fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} />
                      <Line type="monotone" dataKey="callClicks" name="Call Clicks" stroke="#eab308" strokeWidth={2} dot={{ fill: "#eab308", r: 3 }} />
                      <Line type="monotone" dataKey="websiteClicks" name="Website Clicks" stroke="#06b6d4" strokeWidth={2} dot={{ fill: "#06b6d4", r: 3 }} />
                      <Line type="monotone" dataKey="directionRequests" name="Direction Requests" stroke="#a855f7" strokeWidth={2} dot={{ fill: "#a855f7", r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-4 text-xs pt-2 border-t border-slate-300 dark:border-[#27272a]">
                  <span className="flex items-center gap-1.5 text-muted-foreground"><span className="size-2.5 rounded-sm bg-[#eab308]" /> Call Clicks</span>
                  <span className="flex items-center gap-1.5 text-muted-foreground"><span className="size-2.5 rounded-sm bg-[#06b6d4]" /> Website Clicks</span>
                  <span className="flex items-center gap-1.5 text-muted-foreground"><span className="size-2.5 rounded-sm bg-[#a855f7]" /> Direction Requests</span>
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Analysis Section matching Screenshot 2 */}
          <div className="space-y-4 pt-2 border-t border-slate-300 dark:border-[#27272a]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-foreground tracking-tight">Weekly Analysis</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Day-by-day breakdown of performance and customer actions throughout the week</p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-300 dark:border-[#27272a] bg-white dark:bg-[#18181b] p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-300 dark:border-[#27272a] pb-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="size-4 text-blue-500" />
                  <h3 className="text-xs font-bold text-blue-500 uppercase tracking-wider">
                    Performance and Action on Weekdays
                  </h3>
                </div>

                {/* Action / Performance toggle buttons */}
                <div className="flex items-center gap-1 bg-slate-50 dark:bg-[#121214] border border-slate-300 dark:border-[#27272a] p-1 rounded-md text-xs">
                  <button
                    onClick={() => setWeeklyViewMode("Action")}
                    className={`px-3 py-1 rounded text-[11px] font-semibold cursor-pointer transition-all ${
                      weeklyViewMode === "Action" ? "bg-blue-500 text-black font-bold" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Action
                  </button>
                  <button
                    onClick={() => setWeeklyViewMode("Performance")}
                    className={`px-3 py-1 rounded text-[11px] font-semibold cursor-pointer transition-all ${
                      weeklyViewMode === "Performance" ? "bg-blue-500 text-black font-bold" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Performance
                  </button>
                </div>
              </div>

              {/* Weekly Analysis Breakdown Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-300 dark:border-[#27272a] text-muted-foreground font-semibold">
                      <th className="py-2.5 px-3 w-10">#</th>
                      <th className="py-2.5 px-3 w-28">Weekday</th>
                      <th className="py-2.5 px-3">Total Actions</th>
                      <th className="py-2.5 px-3">Change</th>
                      <th className="py-2.5 px-3">Website Clicks</th>
                      <th className="py-2.5 px-3">Change</th>
                      <th className="py-2.5 px-3">Call Clicks</th>
                      <th className="py-2.5 px-3">Change</th>
                      <th className="py-2.5 px-3">Direction Requests</th>
                      <th className="py-2.5 px-3">Change</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-[#27272a]/60">
                    {profileWeekdayAnalysis.map((row) => (
                      <tr key={row.id} className="hover:bg-secondary/20 transition-colors">
                        <td className="py-3 px-3 text-muted-foreground font-mono">{row.id}</td>
                        <td className="py-3 px-3 font-semibold text-foreground">{row.day}</td>

                        {/* Total Actions Bar */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-28 bg-slate-50 dark:bg-[#121214] rounded-full h-2.5 overflow-hidden border border-slate-300 dark:border-[#27272a]">
                              <div className="bg-[#06b6d4] h-full rounded-full" style={{ width: `${Math.min(100, (row.totalActions / 80) * 100)}%` }} />
                            </div>
                            <span className="font-mono text-foreground font-bold text-[11px] tnum">{row.totalActions}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono text-red-400 font-semibold text-[11px] tnum">{row.changePct}</td>

                        {/* Website Clicks Bar */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-slate-50 dark:bg-[#121214] rounded-full h-2.5 overflow-hidden border border-slate-300 dark:border-[#27272a]">
                              <div className="bg-[#3b82f6] h-full rounded-full" style={{ width: `${Math.min(100, (row.websiteClicks / 10) * 100)}%` }} />
                            </div>
                            <span className="font-mono text-foreground font-medium text-[11px] tnum">{row.websiteClicks}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono text-red-400 font-semibold text-[11px] tnum">{row.websiteChange}</td>

                        {/* Call Clicks Bar */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-slate-50 dark:bg-[#121214] rounded-full h-2.5 overflow-hidden border border-slate-300 dark:border-[#27272a]">
                              <div className="bg-[#a855f7] h-full rounded-full" style={{ width: `${Math.min(100, (row.callClicks / 25) * 100)}%` }} />
                            </div>
                            <span className="font-mono text-foreground font-medium text-[11px] tnum">{row.callClicks}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono text-red-400 font-semibold text-[11px] tnum">{row.callChange}</td>

                        {/* Direction Requests Bar */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-slate-50 dark:bg-[#121214] rounded-full h-2.5 overflow-hidden border border-slate-300 dark:border-[#27272a]">
                              <div className="bg-[#eab308] h-full rounded-full" style={{ width: `${Math.min(100, (row.directionRequests / 70) * 100)}%` }} />
                            </div>
                            <span className="font-mono text-foreground font-medium text-[11px] tnum">{row.directionRequests}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono text-red-400 font-semibold text-[11px] tnum">{row.directionChange}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-slate-300 dark:border-[#27272a] bg-slate-50 dark:bg-[#121214] font-bold text-xs">
                      <td colSpan={2} className="py-3 px-3 text-muted-foreground uppercase text-[10px] tracking-wider">
                        Totals:
                      </td>
                      <td className="py-3 px-3 text-sky-400 font-mono text-sm tnum">388</td>
                      <td className="py-3 px-3"></td>
                      <td className="py-3 px-3 text-sky-400 font-mono text-sm tnum">19</td>
                      <td className="py-3 px-3"></td>
                      <td className="py-3 px-3 text-purple-400 font-mono text-sm tnum">56</td>
                      <td className="py-3 px-3"></td>
                      <td className="py-3 px-3 text-blue-400 font-mono text-sm tnum">315</td>
                      <td className="py-3 px-3"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Reviews Tab matching Screenshots 1 & 2 */}
        <TabsContent value="reviews" className="mt-4 space-y-6">
          {/* Top 4 Metric KPI Cards Row matching Screenshot 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-slate-300 dark:border-[#27272a] bg-white dark:bg-[#18181b] space-y-2">
              <div className="flex items-center gap-1.5 text-blue-500 text-xs font-semibold">
                <Star className="size-3.5" /> Total Reviews
              </div>
              <p className="text-3xl font-extrabold text-foreground tnum">24</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-300 dark:border-[#27272a] bg-white dark:bg-[#18181b] space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-blue-500">
                <span className="flex items-center gap-1.5"><Hourglass className="size-3.5" /> Pending Responses</span>
                <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/40 text-[10px]">Active</Badge>
              </div>
              <p className="text-3xl font-extrabold text-foreground tnum">4<span className="text-lg text-muted-foreground font-normal">/24</span></p>
            </div>

            <div className="p-4 rounded-xl border border-slate-300 dark:border-[#27272a] bg-white dark:bg-[#18181b] space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-blue-500">
                <span className="flex items-center gap-1.5"><BarChart3 className="size-3.5" /> Response Rate</span>
                <Badge className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px]">83%</Badge>
              </div>
              <p className="text-3xl font-extrabold text-foreground tnum">83%</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-300 dark:border-[#27272a] bg-white dark:bg-[#18181b] space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-blue-500">
                <span className="flex items-center gap-1.5"><RefreshCw className="size-3.5" /> Average Response Time</span>
                <Badge className="bg-sky-950 text-sky-400 border border-sky-800 text-[10px]">Fast</Badge>
              </div>
              <p className="text-3xl font-extrabold text-foreground tnum">14 <span className="text-sm font-normal text-muted-foreground">min(s)</span></p>
            </div>
          </div>

          {/* Main Grid: Left Sidebar (Breakdowns) & Right Main Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar (4 Columns): Rating Breakdown, Text vs No Text, Replied vs Not Replied, Sentiment */}
            <div className="lg:col-span-4 space-y-6">
              {/* Card 1: Rating Breakdown */}
              <div className="p-5 rounded-xl border border-slate-300 dark:border-[#27272a] bg-white dark:bg-[#18181b] space-y-4">
                <h3 className="text-xs font-bold text-blue-500 uppercase tracking-wider">
                  Rating Breakdown
                </h3>
                <div className="flex items-center gap-4 border-b border-slate-300 dark:border-[#27272a] pb-4">
                  <div className="text-center">
                    <p className="text-4xl font-extrabold text-foreground tnum">4.8</p>
                    <p className="text-[10px] text-muted-foreground">out of 5</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex text-blue-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="size-4 fill-blue-400 text-blue-400" />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">24 Reviews</p>
                  </div>
                </div>

                {/* 5-Star progress bars list */}
                <div className="space-y-2 text-xs">
                  {[
                    { stars: "5 Stars", pct: "75%", val: 18 },
                    { stars: "4 Stars", pct: "15%", val: 4 },
                    { stars: "3 Stars", pct: "5%", val: 1 },
                    { stars: "2 Stars", pct: "3%", val: 1 },
                    { stars: "1 Star", pct: "2%", val: 0 },
                  ].map((row) => (
                    <div key={row.stars} className="flex items-center gap-3">
                      <span className="w-14 text-muted-foreground text-[11px] font-medium">{row.stars}</span>
                      <div className="flex-1 bg-slate-50 dark:bg-[#121214] rounded-full h-2 overflow-hidden border border-slate-300 dark:border-[#27272a]">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: row.pct }} />
                      </div>
                      <span className="w-8 text-right font-mono text-foreground font-bold text-[11px] tnum">{row.pct}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 2: Text vs No Text */}
              <div className="p-5 rounded-xl border border-slate-300 dark:border-[#27272a] bg-white dark:bg-[#18181b] space-y-3">
                <h3 className="text-xs font-bold text-blue-500 uppercase tracking-wider">
                  Text vs No Text
                </h3>
                <div className="flex items-center gap-4">
                  <div className="relative size-24 shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={profileReviewTextVsNoTextDonut}
                          dataKey="value"
                          cx="50%"
                          cy="50%"
                          innerRadius={22}
                          outerRadius={38}
                          paddingAngle={3}
                          stroke="none"
                        >
                          {profileReviewTextVsNoTextDonut.map((entry) => (
                            <Cell key={entry.name} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 text-xs flex-1">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-muted-foreground"><span className="size-2 rounded bg-[#3b82f6]" /> Text</span>
                      <span className="font-bold text-foreground tnum">80% <span className="text-muted-foreground font-normal text-[10px]">(19)</span></span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-muted-foreground"><span className="size-2 rounded bg-[#eab308]" /> No Text</span>
                      <span className="font-bold text-foreground tnum">20% <span className="text-muted-foreground font-normal text-[10px]">(5)</span></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Replied vs Not Replied */}
              <div className="p-5 rounded-xl border border-slate-300 dark:border-[#27272a] bg-white dark:bg-[#18181b] space-y-3">
                <h3 className="text-xs font-bold text-blue-500 uppercase tracking-wider">
                  Replied vs Not Replied
                </h3>
                <div className="flex items-center gap-4">
                  <div className="relative size-24 shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={profileReviewRepliedVsNotRepliedDonut}
                          dataKey="value"
                          cx="50%"
                          cy="50%"
                          innerRadius={22}
                          outerRadius={38}
                          paddingAngle={3}
                          stroke="none"
                        >
                          {profileReviewRepliedVsNotRepliedDonut.map((entry) => (
                            <Cell key={entry.name} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 text-xs flex-1">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-muted-foreground"><span className="size-2 rounded bg-[#3b82f6]" /> Replied</span>
                      <span className="font-bold text-foreground tnum">83% <span className="text-muted-foreground font-normal text-[10px]">(20)</span></span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-muted-foreground"><span className="size-2 rounded bg-[#eab308]" /> Not Replied</span>
                      <span className="font-bold text-foreground tnum">17% <span className="text-muted-foreground font-normal text-[10px]">(4)</span></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4: Sentiment Analysis */}
              <div className="p-5 rounded-xl border border-slate-300 dark:border-[#27272a] bg-white dark:bg-[#18181b] space-y-3">
                <h3 className="text-xs font-bold text-blue-500 uppercase tracking-wider">
                  Sentiment Analysis
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-medium">Positive</span>
                    <span className="font-bold text-foreground tnum">87%</span>
                  </div>
                  <div className="w-full bg-slate-50 dark:bg-[#121214] rounded-full h-2 overflow-hidden border border-slate-300 dark:border-[#27272a]">
                    <div className="bg-emerald-400 h-full rounded-full" style={{ width: "87%" }} />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="flex items-center gap-1.5 text-blue-400 font-medium">Neutral</span>
                    <span className="font-bold text-foreground tnum">8%</span>
                  </div>
                  <div className="w-full bg-slate-50 dark:bg-[#121214] rounded-full h-2 overflow-hidden border border-slate-300 dark:border-[#27272a]">
                    <div className="bg-blue-400 h-full rounded-full" style={{ width: "8%" }} />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="flex items-center gap-1.5 text-red-400 font-medium">Negative</span>
                    <span className="font-bold text-foreground tnum">5%</span>
                  </div>
                  <div className="w-full bg-slate-50 dark:bg-[#121214] rounded-full h-2 overflow-hidden border border-slate-300 dark:border-[#27272a]">
                    <div className="bg-red-400 h-full rounded-full" style={{ width: "5%" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Main Panel (8 Columns): Review Over Time, Average Response Rate, Sentiment Over Time */}
            <div className="lg:col-span-8 space-y-6">
              {/* Card 1: Review Over Time */}
              <div className="p-5 rounded-xl border border-slate-300 dark:border-[#27272a] bg-white dark:bg-[#18181b] space-y-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="size-4 text-blue-500" />
                  <h3 className="text-xs font-bold text-blue-500 uppercase tracking-wider">
                    Review Over Time
                  </h3>
                </div>
                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={profileReviewOverTimeTrend} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                      <CartesianGrid stroke="#27272a" vertical={false} strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fill: "#a1a1aa", fontSize: 10 }} axisLine={{ stroke: "#27272a" }} tickLine={false} />
                      <YAxis tick={{ fill: "#a1a1aa", fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} />
                      <Line type="monotone" dataKey="reviews" name="Reviews" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: "#3b82f6", r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Card 2: Average Response Rate */}
              <div className="p-5 rounded-xl border border-slate-300 dark:border-[#27272a] bg-white dark:bg-[#18181b] space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="size-4 text-blue-500" />
                    <h3 className="text-xs font-bold text-blue-500 uppercase tracking-wider">
                      Average Response Rate
                    </h3>
                  </div>

                  {/* Granularity Toggle Buttons: Minutes / Hours / Days */}
                  <div className="flex items-center gap-1 bg-slate-50 dark:bg-[#121214] border border-slate-300 dark:border-[#27272a] p-1 rounded-md text-xs">
                    {(["Minutes", "Hours", "Days"] as const).map((g) => (
                      <button
                        key={g}
                        onClick={() => setReviewResponseTimeGranularity(g)}
                        className={`px-3 py-1 rounded text-[11px] font-semibold cursor-pointer transition-all ${
                          reviewResponseTimeGranularity === g
                            ? "bg-blue-500 text-black font-bold"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={profileAverageResponseTimeTrend} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                      <CartesianGrid stroke="#27272a" vertical={false} strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fill: "#a1a1aa", fontSize: 10 }} axisLine={{ stroke: "#27272a" }} tickLine={false} />
                      <YAxis tick={{ fill: "#a1a1aa", fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} />
                      <Line type="monotone" dataKey="minutes" name="Response Time" stroke="#38bdf8" strokeWidth={2.5} dot={{ fill: "#38bdf8", r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Card 3: Sentiment Over Time */}
              <div className="p-5 rounded-xl border border-slate-300 dark:border-[#27272a] bg-white dark:bg-[#18181b] space-y-4">
                <div className="flex items-center gap-2">
                  <Search className="size-4 text-blue-500" />
                  <h3 className="text-xs font-bold text-blue-500 uppercase tracking-wider">
                    Sentiment Over Time
                  </h3>
                </div>
                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={profileSentimentOverTimeTrend} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                      <CartesianGrid stroke="#27272a" vertical={false} strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fill: "#a1a1aa", fontSize: 10 }} axisLine={{ stroke: "#27272a" }} tickLine={false} />
                      <YAxis tick={{ fill: "#a1a1aa", fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} />
                      <Line type="monotone" dataKey="positive" name="Positive" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981", r: 3 }} />
                      <Line type="monotone" dataKey="neutral" name="Neutral" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6", r: 3 }} />
                      <Line type="monotone" dataKey="negative" name="Negative" stroke="#ef4444" strokeWidth={2} dot={{ fill: "#ef4444", r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center gap-4 text-xs pt-2 border-t border-slate-300 dark:border-[#27272a]">
                  <span className="flex items-center gap-1.5 text-muted-foreground"><span className="size-2.5 rounded-sm bg-[#10b981]" /> Positive</span>
                  <span className="flex items-center gap-1.5 text-muted-foreground"><span className="size-2.5 rounded-sm bg-[#3b82f6]" /> Neutral</span>
                  <span className="flex items-center gap-1.5 text-muted-foreground"><span className="size-2.5 rounded-sm bg-[#ef4444]" /> Negative</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Reviews Log Feed Section matching Screenshot 2 */}
          <div className="space-y-4 pt-2 border-t border-slate-300 dark:border-[#27272a]">
            {/* Filter Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Tab Pills: All, Responded, Unresponded */}
              <div className="flex items-center gap-1 bg-white dark:bg-[#18181b] border border-slate-300 dark:border-[#27272a] p-1 rounded-lg text-xs">
                {(["all", "responded", "unresponded"] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setReviewFilterStatus(st)}
                    className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer capitalize transition-all ${
                      reviewFilterStatus === st
                        ? "bg-blue-500 text-black font-bold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {st === "all" ? "All" : st === "responded" ? "Responded" : "Unresponded"}
                  </button>
                ))}
              </div>

              {/* Rating Dropdown Filter */}
              <select
                value={reviewRatingFilter}
                onChange={(e) => setReviewRatingFilter(e.target.value)}
                className="h-8 px-3 rounded-md bg-white dark:bg-[#18181b] border border-slate-300 dark:border-[#27272a] text-foreground text-xs font-semibold focus:border-blue-500 cursor-pointer"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>

            {/* Reviews List / Table Container */}
            <div className="p-5 rounded-xl border border-slate-300 dark:border-[#27272a] bg-white dark:bg-[#18181b]">
              {filteredProfileReviews.length === 0 ? (
                <EmptyState
                  title="No Record Found"
                  description="No reviews found matching your search or filter criteria. Try adjusting your filters."
                />
              ) : (
                /* Reviews List */
                <div className="divide-y divide-slate-200 dark:divide-[#27272a]">
                  {filteredProfileReviews.map((rev) => (
                    <div key={rev.id} className="py-4 first:pt-0 last:pb-0 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground text-sm">{rev.author}</span>
                          <div className="flex text-blue-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`size-3.5 ${i < rev.rating ? "fill-blue-400 text-blue-400" : "text-[#3f3f46]"}`} />
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-muted-foreground font-mono">{rev.date}</span>
                          {rev.status === "Replied" ? (
                            <Badge className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px]">
                              Replied
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-blue-400 border-blue-500/40 text-[10px]">
                              Unresponded
                            </Badge>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-foreground leading-relaxed">{rev.text}</p>

                      {rev.response && (
                        <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#121214] border border-slate-300 dark:border-[#27272a] text-xs space-y-1">
                          <span className="text-[10px] text-blue-500 font-bold uppercase tracking-wider block">
                            Store Response
                          </span>
                          <p className="text-muted-foreground">{rev.response}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}
