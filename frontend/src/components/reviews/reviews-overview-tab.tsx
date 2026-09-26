import { useState, useMemo } from "react";
import {
  BarChart3,
  Calendar,
  Clock,
  Hourglass,
  Key,
  MessageSquare,
  PieChart as PieIcon,
  RotateCcw,
  Smile,
  Star,
  ThumbsUp,
  Timer,
  TrendingUp,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { StateFilterDropdown, CityFilterDropdown, LocationFilterDropdown, ALL_STATES, ALL_CITIES, ALL_LOCATIONS } from "@/components/locations/state-city-filter-dropdowns";
import { VariablePieChart } from "@/components/charts/variable-pie-chart";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { BEST_5_STORES, WORST_5_STORES } from "@/data/reviews-analytics";
import { ReviewHeaderActions } from "./review-header-actions";

import { evaluateDateRange } from "@/lib/date-range";

// SVG Arc Math Helper for 3-segment Gauge
function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees - 90) * (Math.PI / 180.0);
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return ["M", start.x, start.y, "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(" ");
}

export function ReviewsOverviewTab() {
  const [dateRange, setDateRange] = useState("01 Apr 2026 - 17 Sep 2026");
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [responseTimeUnit, setResponseTimeUnit] = useState<
    "minutes" | "hours" | "days"
  >("days");

  // Disabled Legend Items state for NPS and Sentiment gauges
  const [disabledNpsGroups, setDisabledNpsGroups] = useState<Record<string, boolean>>({
    promoters: false,
    passives: false,
    detractors: false,
  });

  const [disabledSentimentGroups, setDisabledSentimentGroups] = useState<Record<string, boolean>>({
    positive: false,
    neutral: false,
    negative: false,
  });

  const toggleNpsGroup = (group: "promoters" | "passives" | "detractors") => {
    setDisabledNpsGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const toggleSentimentGroup = (group: "positive" | "neutral" | "negative") => {
    setDisabledSentimentGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  // Dynamic Multiplier based on Active Filters
  const filterMultiplier = useMemo(() => {
    const { multiplier, hasData } = evaluateDateRange(dateRange);
    if (!hasData) return 0;
    let mult = multiplier;
    if (selectedStates.length > 0 && selectedStates.length < ALL_STATES.length) {
      mult *= Math.max(0.2, selectedStates.length / ALL_STATES.length);
    }
    if (selectedCities.length > 0 && selectedCities.length < ALL_CITIES.length) {
      mult *= Math.max(0.2, selectedCities.length / ALL_CITIES.length);
    }
    if (selectedLocations.length > 0 && selectedLocations.length < ALL_LOCATIONS.length) {
      mult *= Math.max(0.2, selectedLocations.length / ALL_LOCATIONS.length);
    }
    return mult;
  }, [dateRange, selectedStates, selectedCities, selectedLocations]);

  // Dynamically calculated Metrics based on filters
  const totalReviewsCount = Math.round(3264 * filterMultiplier);
  const totalReviewsStr = totalReviewsCount.toLocaleString();

  // Dynamic Chart Datasets
  const reviewOverTimeData = useMemo(() => [
    { month: "Apr 2026", one: Math.round(80 * filterMultiplier), two: Math.round(120 * filterMultiplier), three: Math.round(250 * filterMultiplier), four: Math.round(600 * filterMultiplier), five: Math.round(2214 * filterMultiplier) },
    { month: "May 2026", one: Math.round(30 * filterMultiplier), two: Math.round(50 * filterMultiplier), three: Math.round(90 * filterMultiplier), four: Math.round(200 * filterMultiplier), five: Math.round(894 * filterMultiplier) },
  ], [filterMultiplier]);

  const responseRateData = useMemo(() => ({
    days: [
      { month: "Apr 2026", avgTime: 3.0, count: Math.round(3000 * filterMultiplier) },
      { month: "May 2026", avgTime: 0.8, count: Math.round(650 * filterMultiplier) },
    ],
    hours: [
      { month: "Apr 2026", avgTime: 72, count: Math.round(3000 * filterMultiplier) },
      { month: "May 2026", avgTime: 19, count: Math.round(650 * filterMultiplier) },
    ],
    minutes: [
      { month: "Apr 2026", avgTime: 4320, count: Math.round(3000 * filterMultiplier) },
      { month: "May 2026", avgTime: 1140, count: Math.round(650 * filterMultiplier) },
    ],
  }), [filterMultiplier]);

  const textVsNoTextData = useMemo(() => [
    { name: "Text", value: 51, count: `${(1.7 * filterMultiplier).toFixed(1)}k Reviews`, color: "#f97316" },
    { name: "No Text", value: 49, count: `${(2.0 * filterMultiplier).toFixed(1)}k Reviews`, color: "#2563eb" },
  ], [filterMultiplier]);

  const repliedVsNotRepliedData = useMemo(() => [
    { name: "Replied", value: 100, count: `${(3.3 * filterMultiplier).toFixed(1)}k Reviews`, color: "#f97316" },
    { name: "Not Replied", value: 0, count: "0 Reviews", color: "#3f3f46" },
  ], [filterMultiplier]);

  const sentimentOverTimeData = useMemo(() => [
    { month: "Apr 2026", positive: 92, neutral: 5, negative: 3 },
    { month: "May 2026", positive: 94, neutral: 4, negative: 2 },
    { month: "Jun 2026", positive: 0, neutral: 0, negative: 0 },
    { month: "Jul 2026", positive: 0, neutral: 0, negative: 0 },
    { month: "Aug 2026", positive: 0, neutral: 0, negative: 0 },
    { month: "Sep 2026", positive: 0, neutral: 0, negative: 0 },
  ], []);

  const sentimentKeywordsData = useMemo(() => [
    { category: "Ambience", positive: 96, neutral: 3, negative: 1 },
    { category: "Delivery", positive: 98, neutral: 1, negative: 1 },
    { category: "Other", positive: 88, neutral: 10, negative: 2 },
    { category: "Pricing", positive: 78, neutral: 11, negative: 11 },
    { category: "Product", positive: 85, neutral: 8, negative: 7 },
    { category: "Quality", positive: 87, neutral: 8, negative: 5 },
    { category: "Service", positive: 86, neutral: 8, negative: 6 },
  ], []);

  const keywordCategoryData = useMemo(() => [
    { name: "Service", y: 48.08, z: 100, color: "#f97316" },
    { name: "Other", y: 24.06, z: 80, color: "#2563eb" },
    { name: "Product", y: 12.89, z: 65, color: "#ec4899" },
    { name: "Pricing", y: 4.12, z: 50, color: "#3b82f6" },
    { name: "Ambience", y: 1.49, z: 40, color: "#eab308" },
    { name: "Quality", y: 0.28, z: 30, color: "#14b8a6" },
    { name: "Delivery", y: 0.05, z: 20, color: "#22c55e" },
  ], []);

  // Calculate NPS Score dynamically based on toggles
  const npsScore = useMemo(() => {
    let p = disabledNpsGroups.promoters ? 0 : 90;
    let pas = disabledNpsGroups.passives ? 0 : 6;
    let d = disabledNpsGroups.detractors ? 0 : 4;
    let total = p + pas + d;
    if (total === 0) return 0;
    let pPct = (p / total) * 100;
    let dPct = (d / total) * 100;
    return Math.round(pPct - dPct);
  }, [disabledNpsGroups]);

  // Calculate Sentiment Score dynamically based on toggles
  const sentimentScore = useMemo(() => {
    let pos = disabledSentimentGroups.positive ? 0 : 94;
    let neu = disabledSentimentGroups.neutral ? 0 : 4;
    let neg = disabledSentimentGroups.negative ? 0 : 2;
    let total = pos + neu + neg;
    if (total === 0) return 0;
    return Math.round((pos / total) * 100);
  }, [disabledSentimentGroups]);

  return (
    <div className="rounded-2xl bg-[#f4f4f6] dark:bg-[#141416] p-6 sm:p-8 space-y-6 shadow-xl border border-slate-200/80 dark:border-transparent">
      {/* Header & Export Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Overview</h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Analyze Business Review Performance Against Key Metrics and Trends.
          </p>
        </div>

        {/* Top Actions Export Button matching reference screenshot */}
        <ReviewHeaderActions />
      </div>

      {/* Filter Inputs Bar */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Date Range Picker */}
        <DateRangePicker value={dateRange} onChange={setDateRange} />

        {/* State Filter Dropdown */}
        <StateFilterDropdown
          selectedStates={selectedStates}
          onChange={setSelectedStates}
        />

        {/* City Filter Dropdown */}
        <CityFilterDropdown
          selectedCities={selectedCities}
          onChange={setSelectedCities}
        />

        {/* Location Filter Dropdown */}
        <LocationFilterDropdown
          selectedLocations={selectedLocations}
          onChange={setSelectedLocations}
        />
      </div>

      {/* Row 1: Top 4 Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
        {/* Total Reviews */}
        <div className="panel p-4 flex flex-col justify-between h-full space-y-2">
          <div className="flex items-center gap-1.5 text-blue-500">
            <MessageSquare className="size-3.5" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-500">
              Total Reviews
            </span>
          </div>
          <p className="tnum text-3xl font-extrabold tracking-tight text-foreground">
            {totalReviewsStr}
          </p>
        </div>

        {/* Pending Responses */}
        <div className="panel p-4 flex flex-col justify-between h-full space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-blue-500">
              <Hourglass className="size-3.5" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-500">
                Pending Responses
              </span>
            </div>
            <Badge
              variant="outline"
              className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5"
            >
              ● None
            </Badge>
          </div>
          <p className="tnum text-3xl font-extrabold tracking-tight text-foreground">
            0<span className="text-muted-foreground font-normal text-xl">/{totalReviewsStr}</span>
          </p>
        </div>

        {/* Response Rate */}
        <div className="panel p-4 flex flex-col justify-between h-full space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-blue-500">
              <RotateCcw className="size-3.5" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-500">
                Response Rate
              </span>
            </div>
            <Badge
              variant="outline"
              className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5"
            >
              ● Very High
            </Badge>
          </div>
          <p className="tnum text-3xl font-extrabold tracking-tight text-foreground">
            100%
          </p>
        </div>

        {/* Average Response Time */}
        <div className="panel p-4 flex flex-col justify-between h-full space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-blue-500">
              <Timer className="size-3.5" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-500">
                Average Response Time
              </span>
            </div>
            <Badge
              variant="outline"
              className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5"
            >
              ● Very Fast
            </Badge>
          </div>
          <p className="tnum text-3xl font-extrabold tracking-tight text-foreground">
            3.0 <span className="text-muted-foreground font-normal text-base">hour(s)</span>
          </p>
        </div>
      </div>

      {/* Row 2: Equal Height Grid - Left Stacked Cards vs Right Main Charts */}
      <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)] items-stretch">
        {/* Left Column Stacked Cards */}
        <div className="flex flex-col gap-4 h-full">
          {/* Card 1: Rating Breakdown */}
          <div className="panel p-4 sm:p-5 flex-1 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2">
              <Star className="size-4 text-blue-500" />
              <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
                Rating Breakdown
              </h3>
            </div>

            <div className="flex items-center justify-between my-auto">
              <div>
                <p className="tnum text-3xl font-extrabold text-foreground">4.9</p>
                <p className="text-[10px] font-medium text-muted-foreground">out of 5</p>
                <div className="flex text-blue-400 text-xs mt-1 gap-0.5">
                  ★★★★★
                </div>
                <p className="tnum text-[10px] text-muted-foreground mt-0.5">
                  {totalReviewsStr} Reviews
                </p>
              </div>

              {/* Rating Bars */}
              <div className="space-y-1.5 flex-1 pl-4 text-[10px]">
                <div className="flex items-center gap-2">
                  <span className="w-8 text-right font-medium text-foreground">5 Stars</span>
                  <div className="flex-1 bg-secondary rounded-full h-2 overflow-hidden">
                    <div className="bg-blue-500 h-full" style={{ width: "93%" }} />
                  </div>
                  <span className="w-6 tnum font-bold text-foreground">93%</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-8 text-right font-medium text-foreground">4 Stars</span>
                  <div className="flex-1 bg-secondary rounded-full h-2 overflow-hidden">
                    <div className="bg-blue-500 h-full" style={{ width: "4%" }} />
                  </div>
                  <span className="w-6 tnum font-bold text-foreground">4%</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-8 text-right font-medium text-muted-foreground">3 Stars</span>
                  <div className="flex-1 bg-secondary rounded-full h-2 overflow-hidden">
                    <div className="bg-muted-foreground/40 h-full" style={{ width: "1%" }} />
                  </div>
                  <span className="w-6 tnum font-bold text-muted-foreground">1%</span>
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
          </div>

          {/* Card 2: Interactive Net Promoter Score (3 Visible Arc Segments & Clickable Legend) */}
          <div className="panel p-4 sm:p-5 flex-1 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-1">
              <ThumbsUp className="size-4 text-blue-500" />
              <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
                Net Promoter Score
              </h3>
            </div>

            <div className="relative size-32 mx-auto grid place-items-center my-auto">
              <svg className="size-full" viewBox="0 0 100 100">
                {/* Background Arc */}
                <path
                  d={describeArc(50, 55, 38, -120, 120)}
                  fill="none"
                  stroke="var(--secondary)"
                  strokeWidth="8"
                  strokeLinecap="round"
                />

                {/* Promoters Arc Segment (0 to 70% of 240 deg) */}
                <path
                  d={describeArc(50, 55, 38, -120, -120 + 240 * 0.70)}
                  fill="none"
                  stroke={disabledNpsGroups.promoters ? "#3f3f46" : "#4ade80"}
                  strokeWidth="9"
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />

                {/* Passives Arc Segment (70% to 88% of 240 deg) */}
                <path
                  d={describeArc(50, 55, 38, -120 + 240 * 0.72, -120 + 240 * 0.88)}
                  fill="none"
                  stroke={disabledNpsGroups.passives ? "#3f3f46" : "#facc15"}
                  strokeWidth="9"
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />

                {/* Detractors Arc Segment (88% to 100% of 240 deg) */}
                <path
                  d={describeArc(50, 55, 38, -120 + 240 * 0.90, 120)}
                  fill="none"
                  stroke={disabledNpsGroups.detractors ? "#3f3f46" : "#f87171"}
                  strokeWidth="9"
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                <span className="tnum text-2xl font-extrabold text-foreground">{npsScore}</span>
                <span className="text-[10px] font-semibold text-emerald-400">
                  {npsScore >= 70 ? "Excellent" : npsScore >= 50 ? "Good" : "Needs Audit"}
                </span>
              </div>
            </div>

            {/* Clickable Legend items to Toggle / Disable Detractors, Passives, Promoters */}
            <div className="flex items-center justify-between text-[11px] pt-2 border-t border-border">
              <button
                onClick={() => toggleNpsGroup("promoters")}
                className={`flex items-center gap-1 text-muted-foreground hover:text-foreground cursor-pointer transition-opacity ${
                  disabledNpsGroups.promoters ? "opacity-40 line-through" : ""
                }`}
              >
                <span className="size-2 rounded-sm bg-[#4ade80]" /> Promoters
              </button>

              <button
                onClick={() => toggleNpsGroup("passives")}
                className={`flex items-center gap-1 text-muted-foreground hover:text-foreground cursor-pointer transition-opacity ${
                  disabledNpsGroups.passives ? "opacity-40 line-through" : ""
                }`}
              >
                <span className="size-2 rounded-sm bg-[#facc15]" /> Passives
              </button>

              <button
                onClick={() => toggleNpsGroup("detractors")}
                className={`flex items-center gap-1 text-muted-foreground hover:text-foreground cursor-pointer transition-opacity ${
                  disabledNpsGroups.detractors ? "opacity-40 line-through" : ""
                }`}
              >
                <span className="size-2 rounded-sm bg-[#f87171]" /> Detractors
              </button>
            </div>
          </div>

          {/* Card 3: Interactive Sentiment Analysis (3 Visible Arc Segments & Clickable Legend) */}
          <div className="panel p-4 sm:p-5 flex-1 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-1">
              <Smile className="size-4 text-blue-500" />
              <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
                Sentiment Analysis
              </h3>
            </div>

            <div className="relative size-32 mx-auto grid place-items-center my-auto">
              <svg className="size-full" viewBox="0 0 100 100">
                {/* Background Arc */}
                <path
                  d={describeArc(50, 55, 38, -120, 120)}
                  fill="none"
                  stroke="var(--secondary)"
                  strokeWidth="8"
                  strokeLinecap="round"
                />

                {/* Positive Arc Segment */}
                <path
                  d={describeArc(50, 55, 38, -120, -120 + 240 * 0.75)}
                  fill="none"
                  stroke={disabledSentimentGroups.positive ? "#3f3f46" : "#4ade80"}
                  strokeWidth="9"
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />

                {/* Neutral Arc Segment */}
                <path
                  d={describeArc(50, 55, 38, -120 + 240 * 0.77, -120 + 240 * 0.90)}
                  fill="none"
                  stroke={disabledSentimentGroups.neutral ? "#3f3f46" : "#facc15"}
                  strokeWidth="9"
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />

                {/* Negative Arc Segment */}
                <path
                  d={describeArc(50, 55, 38, -120 + 240 * 0.92, 120)}
                  fill="none"
                  stroke={disabledSentimentGroups.negative ? "#3f3f46" : "#f87171"}
                  strokeWidth="9"
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                <span className="tnum text-2xl font-extrabold text-foreground">{sentimentScore}%</span>
                <span className="text-[10px] font-semibold text-emerald-400">Positive</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-2 border-t border-border">
              <button
                onClick={() => toggleSentimentGroup("positive")}
                className={`flex items-center gap-1 text-muted-foreground hover:text-foreground cursor-pointer transition-opacity ${
                  disabledSentimentGroups.positive ? "opacity-40 line-through" : ""
                }`}
              >
                <span className="size-2 rounded-sm bg-[#4ade80]" /> Positive
              </button>

              <button
                onClick={() => toggleSentimentGroup("neutral")}
                className={`flex items-center gap-1 text-muted-foreground hover:text-foreground cursor-pointer transition-opacity ${
                  disabledSentimentGroups.neutral ? "opacity-40 line-through" : ""
                }`}
              >
                <span className="size-2 rounded-sm bg-[#facc15]" /> Neutral
              </button>

              <button
                onClick={() => toggleSentimentGroup("negative")}
                className={`flex items-center gap-1 text-muted-foreground hover:text-foreground cursor-pointer transition-opacity ${
                  disabledSentimentGroups.negative ? "opacity-40 line-through" : ""
                }`}
              >
                <span className="size-2 rounded-sm bg-[#f87171]" /> Negative
              </button>
            </div>
          </div>
        </div>

        {/* Right Column Stacked Charts */}
        <div className="flex flex-col gap-4 h-full">
          {/* Chart 1: Review Over Time */}
          <div className="panel p-4 sm:p-5 flex-1 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="size-4 text-blue-500" />
              <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
                Review Over Time
              </h3>
            </div>

            <div className="relative flex-1 min-h-[220px] w-full my-auto">
              <p className="absolute -left-2 top-0 text-[10px] text-muted-foreground z-10">
                No. of Reviews
              </p>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={reviewOverTimeData}
                  margin={{ top: 20, right: 15, left: -15, bottom: 0 }}
                >
                  <CartesianGrid stroke="var(--border)" vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#18181b",
                      border: "1px solid #3f3f46",
                      borderRadius: 6,
                      fontSize: 12,
                      color: "#ffffff",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
                    }}
                    itemStyle={{ color: "#ffffff" }}
                    labelStyle={{ color: "#60a5fa", fontWeight: 600 }}
                  />
                  <Bar dataKey="one" name="1 Star" stackId="a" fill="#ef4444" barSize={100} />
                  <Bar dataKey="two" name="2 Star" stackId="a" fill="#f97316" barSize={100} />
                  <Bar dataKey="three" name="3 Star" stackId="a" fill="#eab308" barSize={100} />
                  <Bar dataKey="four" name="4 Star" stackId="a" fill="#84cc16" barSize={100} />
                  <Bar dataKey="five" name="5 Star" stackId="a" fill="#22c55e" radius={[3, 3, 0, 0]} barSize={100} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center gap-5 text-xs pt-2 border-t border-border">
              <span className="flex items-center gap-1.5 cursor-pointer hover:opacity-80">
                <span className="size-2.5 rounded-sm bg-[#ef4444]" /> 1 Star
              </span>
              <span className="flex items-center gap-1.5 cursor-pointer hover:opacity-80">
                <span className="size-2.5 rounded-sm bg-[#f97316]" /> 2 Star
              </span>
              <span className="flex items-center gap-1.5 cursor-pointer hover:opacity-80">
                <span className="size-2.5 rounded-sm bg-[#eab308]" /> 3 Star
              </span>
              <span className="flex items-center gap-1.5 cursor-pointer hover:opacity-80">
                <span className="size-2.5 rounded-sm bg-[#84cc16]" /> 4 Star
              </span>
              <span className="flex items-center gap-1.5 cursor-pointer hover:opacity-80">
                <span className="size-2.5 rounded-sm bg-[#22c55e]" /> 5 Star
              </span>
            </div>
          </div>

          {/* Chart 2: Average Response Rate */}
          <div className="panel p-4 sm:p-5 flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-blue-500" />
                <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
                  Average Response Rate
                </h3>
              </div>

              <div className="flex items-center bg-background border border-border p-0.5 rounded-md text-[11px]">
                <button
                  onClick={() => setResponseTimeUnit("minutes")}
                  className={`px-2.5 py-0.5 rounded cursor-pointer transition-all ${
                    responseTimeUnit === "minutes"
                      ? "bg-secondary text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Minutes
                </button>
                <button
                  onClick={() => setResponseTimeUnit("hours")}
                  className={`px-2.5 py-0.5 rounded cursor-pointer transition-all ${
                    responseTimeUnit === "hours"
                      ? "bg-secondary text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Hours
                </button>
                <button
                  onClick={() => setResponseTimeUnit("days")}
                  className={`px-2.5 py-0.5 rounded cursor-pointer transition-all ${
                    responseTimeUnit === "days"
                      ? "bg-secondary text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Days
                </button>
              </div>
            </div>

            <div className="relative flex-1 min-h-[220px] w-full my-auto">
              <p className="absolute -left-2 top-0 text-[10px] text-muted-foreground z-10">
                Avg Time ({responseTimeUnit === "days" ? "Days" : responseTimeUnit === "hours" ? "Hours" : "Minutes"})
              </p>
              <p className="absolute -right-2 top-0 text-[10px] text-muted-foreground z-10">
                Response Count
              </p>

              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={responseRateData[responseTimeUnit]}
                  margin={{ top: 25, right: 25, left: -15, bottom: 0 }}
                >
                  <CartesianGrid stroke="var(--border)" vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v} Day`}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#18181b",
                      border: "1px solid #3f3f46",
                      borderRadius: 6,
                      fontSize: 12,
                      color: "#ffffff",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
                    }}
                    itemStyle={{ color: "#ffffff" }}
                    labelStyle={{ color: "#60a5fa", fontWeight: 600 }}
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="count"
                    name="Response Count"
                    fill="#eab308"
                    barSize={24}
                    radius={[3, 3, 0, 0]}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="avgTime"
                    name="Avg Response Time"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={{ fill: "#22c55e", r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center gap-6 text-xs pt-2 border-t border-border">
              <span className="flex items-center gap-1.5 cursor-pointer hover:opacity-80">
                <span className="size-2 rounded-full bg-[#22c55e]" /> Avg Response Time
              </span>
              <span className="flex items-center gap-1.5 cursor-pointer hover:opacity-80">
                <span className="size-2.5 rounded-sm bg-[#eab308]" /> Response Count
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Lower Stacked Section - Equal Height Grid */}
      <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)] items-stretch">
        {/* Left Column Stacked Cards */}
        <div className="flex flex-col gap-4 h-full">
          {/* Card 1: Text vs No Text */}
          <div className="panel p-4 sm:p-5 flex-1 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2">
              <PieIcon className="size-4 text-blue-500" />
              <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
                Text vs No Text
              </h3>
            </div>

            <div className="flex items-center justify-between px-2 my-auto">
              <div className="relative size-24 shrink-0 grid place-items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={textVsNoTextData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={28}
                      outerRadius={40}
                      paddingAngle={4}
                      cornerRadius={6}
                      stroke="none"
                    >
                      {textVsNoTextData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2 text-xs flex-1 pl-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-foreground font-medium">
                    <span className="size-2.5 rounded-sm bg-[#f97316]" /> Text
                  </span>
                  <span className="tnum font-bold text-foreground">51%</span>
                  <span className="text-[10px] text-muted-foreground">{textVsNoTextData[0].count}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                    <span className="size-2.5 rounded-sm bg-[#2563eb]" /> No Text
                  </span>
                  <span className="tnum font-bold text-foreground">49%</span>
                  <span className="text-[10px] text-muted-foreground">{textVsNoTextData[1].count}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Replied vs Not Replied (with Rounded Corners) */}
          <div className="panel p-4 sm:p-5 flex-1 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2">
              <RotateCcw className="size-4 text-blue-500" />
              <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
                Replied vs Not Replied
              </h3>
            </div>

            <div className="flex items-center justify-between px-2 my-auto">
              <div className="relative size-24 shrink-0 grid place-items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={repliedVsNotRepliedData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={28}
                      outerRadius={40}
                      paddingAngle={4}
                      cornerRadius={8}
                      stroke="none"
                    >
                      {repliedVsNotRepliedData.map((entry, index) => (
                        <Cell key={`cell-replied-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2 text-xs flex-1 pl-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-foreground font-medium">
                    <span className="size-2.5 rounded-sm bg-[#f97316]" /> Replied
                  </span>
                  <span className="tnum font-bold text-foreground">100%</span>
                  <span className="text-[10px] text-muted-foreground">{repliedVsNotRepliedData[0].count}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                    <span className="size-2.5 rounded-sm bg-[#3f3f46]" /> Not Replied
                  </span>
                  <span className="tnum font-bold text-muted-foreground">0%</span>
                  <span className="text-[10px] text-muted-foreground">0 Reviews</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Keyword Category Analysis */}
          <div className="panel p-4 sm:p-5 flex-1 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-1">
              <Key className="size-4 text-blue-500" />
              <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
                Keyword Category Analysis
              </h3>
            </div>

            <div className="my-auto">
              <VariablePieChart
                data={keywordCategoryData}
                innerSize="40%"
                height={220}
                showDataLabels={true}
              />
            </div>
          </div>
        </div>

        {/* Right Column Stacked Charts */}
        <div className="flex flex-col gap-4 h-full">
          {/* Chart 1: Sentiment Over Time */}
          <div className="panel p-4 sm:p-5 flex-1 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="size-4 text-blue-500" />
              <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
                Sentiment Over Time
              </h3>
            </div>

            <div className="relative flex-1 min-h-[220px] w-full my-auto">
              <p className="absolute -left-2 top-0 text-[10px] text-muted-foreground z-10">
                100%
              </p>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={sentimentOverTimeData}
                  margin={{ top: 20, right: 15, left: -15, bottom: 0 }}
                >
                  <CartesianGrid stroke="var(--border)" vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#18181b",
                      border: "1px solid #3f3f46",
                      borderRadius: 6,
                      fontSize: 12,
                      color: "#ffffff",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
                    }}
                    itemStyle={{ color: "#ffffff" }}
                    labelStyle={{ color: "#60a5fa", fontWeight: 600 }}
                  />
                  <Area type="monotone" dataKey="positive" name="Positive" stackId="1" stroke="#22c55e" fill="#22c55e" />
                  <Area type="monotone" dataKey="neutral" name="Neutral" stackId="1" stroke="#facc15" fill="#facc15" />
                  <Area type="monotone" dataKey="negative" name="Negative" stackId="1" stroke="#ef4444" fill="#ef4444" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center gap-6 text-xs pt-2 border-t border-border">
              <span className="flex items-center gap-1.5 cursor-pointer hover:opacity-80">
                <span className="size-2.5 rounded-sm bg-[#22c55e]" /> Positive
              </span>
              <span className="flex items-center gap-1.5 cursor-pointer hover:opacity-80">
                <span className="size-2.5 rounded-sm bg-[#facc15]" /> Neutral
              </span>
              <span className="flex items-center gap-1.5 cursor-pointer hover:opacity-80">
                <span className="size-2.5 rounded-sm bg-[#ef4444]" /> Negative
              </span>
            </div>
          </div>

          {/* Chart 2: Sentiment of Keywords */}
          <div className="panel p-4 sm:p-5 flex-1 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2">
              <Smile className="size-4 text-blue-500" />
              <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
                Sentiment of Keywords
              </h3>
            </div>

            <div className="relative flex-1 min-h-[220px] w-full my-auto">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sentimentKeywordsData}
                  margin={{ top: 15, right: 15, left: -15, bottom: 0 }}
                >
                  <CartesianGrid stroke="var(--border)" vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="category"
                    tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#18181b",
                      border: "1px solid #3f3f46",
                      borderRadius: 6,
                      fontSize: 12,
                      color: "#ffffff",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
                    }}
                    itemStyle={{ color: "#ffffff" }}
                    labelStyle={{ color: "#60a5fa", fontWeight: 600 }}
                  />
                  <Bar dataKey="positive" name="Positive" fill="#22c55e" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="neutral" name="Neutral" fill="#facc15" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="negative" name="Negative" fill="#ef4444" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center gap-6 text-xs pt-2 border-t border-border">
              <span className="flex items-center gap-1.5 cursor-pointer hover:opacity-80">
                <span className="size-2.5 rounded-sm bg-[#22c55e]" /> Positive
              </span>
              <span className="flex items-center gap-1.5 cursor-pointer hover:opacity-80">
                <span className="size-2.5 rounded-sm bg-[#facc15]" /> Neutral
              </span>
              <span className="flex items-center gap-1.5 cursor-pointer hover:opacity-80">
                <span className="size-2.5 rounded-sm bg-[#ef4444]" /> Negative
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Best 5 & Worst 5 Stores Tables */}
      <div className="grid gap-4 lg:grid-cols-2 items-stretch">
        {/* Best 5 Stores */}
        <div className="panel p-4 sm:p-5 flex flex-col justify-between h-full space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <ThumbsUp className="size-4 text-blue-500" />
            <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
              Best 5 Stores by Ratings and Reviews
            </h3>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-secondary/30 text-muted-foreground font-semibold">
                  <th className="py-2.5 px-3 w-8">#</th>
                  <th className="py-2.5 px-3">Store Name</th>
                  <th className="py-2.5 px-3">Avg. Rating</th>
                  <th className="py-2.5 px-3">Total Reviews</th>
                  <th className="py-2.5 px-3">Positive</th>
                  <th className="py-2.5 px-3">Negative</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {BEST_5_STORES.map((store) => (
                  <tr key={store.rank} className="hover:bg-secondary/20 cursor-pointer transition-colors">
                    <td className="py-2.5 px-3 font-medium text-muted-foreground tnum">{store.rank}</td>
                    <td className="py-2.5 px-3">
                      <p className="font-bold text-foreground text-xs">{store.name}</p>
                      <p className="text-[10px] text-muted-foreground">{store.location}</p>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-blue-400 tnum">
                      {store.avgRating} ★
                    </td>
                    <td className="py-2.5 px-3 tnum font-semibold text-foreground">{store.totalReviews}</td>
                    <td className="py-2.5 px-3 tnum font-semibold text-emerald-400">{store.positiveCount}</td>
                    <td className="py-2.5 px-3 tnum font-semibold text-muted-foreground">{store.negativeCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Worst 5 Stores */}
        <div className="panel p-4 sm:p-5 flex flex-col justify-between h-full space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Star className="size-4 text-blue-500" />
            <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
              Worst 5 Stores by Ratings and Reviews
            </h3>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-secondary/30 text-muted-foreground font-semibold">
                  <th className="py-2.5 px-3 w-8">#</th>
                  <th className="py-2.5 px-3">Store Name</th>
                  <th className="py-2.5 px-3">Avg. Rating</th>
                  <th className="py-2.5 px-3">Total Reviews</th>
                  <th className="py-2.5 px-3">Positive</th>
                  <th className="py-2.5 px-3">Negative</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {WORST_5_STORES.map((store) => (
                  <tr key={store.rank} className="hover:bg-secondary/20 cursor-pointer transition-colors">
                    <td className="py-2.5 px-3 font-medium text-muted-foreground tnum">{store.rank}</td>
                    <td className="py-2.5 px-3">
                      <p className="font-bold text-foreground text-xs">{store.name}</p>
                      <p className="text-[10px] text-muted-foreground">{store.location}</p>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-red-400 tnum">
                      {store.avgRating} ★
                    </td>
                    <td className="py-2.5 px-3 tnum font-semibold text-foreground">{store.totalReviews}</td>
                    <td className="py-2.5 px-3 tnum font-semibold text-muted-foreground">{store.positiveCount}</td>
                    <td className="py-2.5 px-3 tnum font-semibold text-red-400">{store.negativeCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
