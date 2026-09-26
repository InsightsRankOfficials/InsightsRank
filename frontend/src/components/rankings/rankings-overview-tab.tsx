import { useState, useMemo } from "react";
import {
  Award,
  BarChart3,
  Calendar as CalendarIcon,
  Hourglass,
  Search,
  Store,
  Target,
  TrendingDown,
  TrendingUp,
  ChevronDown,
} from "lucide-react";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  MOST_DECLINED_STORES,
  MOST_IMPROVED_STORES,
} from "@/data/rankings-analytics";

const KEYWORD_OPTIONS = [
  "footwear shop near me",
  "ladies shoes",
  "men shoes",
  "shoe shop near me",
  "sports shoes",
];

const LOCATION_OPTIONS = [
  "Demo Store 371",
  "Demo Store 312",
  "Demo Store 304",
  "Demo Store 42",
];

function formatDateShort(d: Date): string {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${String(d.getDate()).padStart(2, "0")} ${monthNames[d.getMonth()]}`;
}

import { evaluateDateRange } from "@/lib/date-range";

import { KeywordFilterDropdown, LocationFilterDropdown, ALL_KEYWORDS, ALL_LOCATIONS } from "@/components/locations/state-city-filter-dropdowns";

export function RankingsOverviewTab() {
  const [dateRange, setDateRange] = useState("01 Apr 2026 - 17 Sep 2026");

  // Keywords & Location Checkbox State - default empty [] to show "All Keywords" and "All Locations"
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  // Completion Score Tab State
  const [completionTab, setCompletionTab] = useState<"business" | "photos">("business");

  // Dynamic Date calculations based on active selection
  const { startDate, endDate, numDays, hasData, multiplier } = useMemo(() => {
    const res = evaluateDateRange(dateRange);
    return {
      startDate: res.startDate || new Date(2026, 3, 1),
      endDate: res.endDate || new Date(2026, 8, 17),
      numDays: res.days,
      hasData: res.hasData,
      multiplier: res.multiplier,
    };
  }, [dateRange]);

  const kwCount = selectedKeywords.length === 0 ? ALL_KEYWORDS.length : selectedKeywords.length;
  const locCount = selectedLocations.length === 0 ? ALL_LOCATIONS.length : selectedLocations.length;

  // Dynamic Chart Trend Data
  const trendData = useMemo(() => {
    if (!hasData) return [];
    const pointsCount = numDays <= 10 ? numDays : Math.min(10, Math.max(5, Math.floor(numDays / 8)));
    const stepDays = Math.max(1, Math.floor(numDays / pointsCount));
    const data = [];

    const seed = (startDate.getTime() % 1000) + kwCount * 13 + locCount * 19;
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    for (let i = 0; i <= pointsCount; i++) {
      const curr = new Date(startDate);
      curr.setDate(startDate.getDate() + i * stepDays);
      if (curr > endDate && i > 0) break;

      const dateStr = `${String(curr.getDate()).padStart(2, "0")} ${monthNames[curr.getMonth()]} ${curr.getFullYear()}`;
      const factor = Math.sin((seed + i * 1.7) * 0.4);

      const demoPvtLtd = Math.min(14, Math.max(4, Math.round(8 + factor * 2.5)));
      const bata = Math.min(16, Math.max(7, Math.round(13 - factor * 1.8)));
      const comet = Math.min(18, Math.max(9, Math.round(15 + Math.cos(i) * 2.2)));
      const redTape = Math.min(20, Math.max(12, Math.round(18 + factor * 1.2)));

      data.push({
        date: dateStr,
        demoPvtLtd,
        bata,
        comet,
        redTape,
      });
    }

    return data;
  }, [startDate, endDate, numDays, kwCount, locCount, hasData]);

  // Dynamic Metric Cards
  const metrics = useMemo(() => {
    if (!hasData) {
      return {
        totalStores: 0,
        visibilityScore: 0,
        averageRanking: "0.0",
        lastRunDate: formatDateShort(endDate),
      };
    }
    const kwRatio = kwCount / ALL_KEYWORDS.length;
    const locRatio = locCount / ALL_LOCATIONS.length;
    const rangeFactor = Math.min(1.2, Math.max(0.3, numDays / 60));

    const totalStores = Math.max(1, Math.round(315 * kwRatio * locRatio * Math.min(1, multiplier * 1.5)));
    const visibilityScore = Math.min(99, Math.max(0, Math.round(88 * kwRatio * (0.85 + rangeFactor * 0.15))));
    
    const sumRank = trendData.reduce((acc, curr) => acc + curr.demoPvtLtd, 0);
    const averageRanking = trendData.length > 0 ? (sumRank / trendData.length).toFixed(1) : "0.0";

    return {
      totalStores,
      visibilityScore,
      averageRanking,
      lastRunDate: formatDateShort(endDate),
    };
  }, [numDays, kwCount, locCount, trendData, endDate, hasData, multiplier]);

  // Dynamic Bar Chart Data
  const storesAppearedBarData = useMemo(() => {
    if (!hasData) return [];
    if (numDays <= 30) {
      return [
        { month: "Week 1", locations: Math.round(metrics.totalStores * 0.85), keywords: Math.round(metrics.totalStores * 0.9) },
        { month: "Week 2", locations: Math.round(metrics.totalStores * 0.92), keywords: Math.round(metrics.totalStores * 0.95) },
        { month: "Week 3", locations: metrics.totalStores, keywords: Math.round(metrics.totalStores * 1.05) },
      ];
    }
    return [
      { month: "Mar 2026", locations: Math.round(metrics.totalStores * 0.88), keywords: Math.round(metrics.totalStores * 0.92) },
      { month: "Apr 2026", locations: Math.round(metrics.totalStores * 0.94), keywords: Math.round(metrics.totalStores * 0.97) },
      { month: "May 2026", locations: metrics.totalStores, keywords: Math.round(metrics.totalStores * 1.02) },
    ];
  }, [numDays, metrics.totalStores, hasData]);

  // Dynamic Improved & Declined Store Rankings
  const improvedStoresList = useMemo(() => {
    if (!hasData) return [];
    const factor = Math.min(1.5, Math.max(0.5, numDays / 30));
    return MOST_IMPROVED_STORES.map((item) => ({
      ...item,
      changeValue: Math.max(1, Math.round(item.changeValue * factor * (kwCount / 5))),
    }));
  }, [numDays, kwCount, hasData]);

  const declinedStoresList = useMemo(() => {
    if (!hasData) return [];
    const factor = Math.min(1.5, Math.max(0.5, numDays / 30));
    return MOST_DECLINED_STORES.map((item) => ({
      ...item,
      changeValue: Math.max(1, Math.round(item.changeValue * factor * (kwCount / 5))),
    }));
  }, [numDays, kwCount, hasData]);

  const completionItemsBusiness = [
    { label: "Store Code", pct: 100 },
    { label: "Description", pct: 100 },
    { label: "Locality", pct: 100 },
    { label: "Phone No.", pct: 100 },
    { label: "Website URL", pct: 100 },
  ];

  const completionItemsPhotos = [
    { label: "Cover Photo", pct: 100 },
    { label: "Logo", pct: 100 },
    { label: "Interior Photos", pct: 100 },
    { label: "Exterior Photos", pct: 100 },
  ];

  const activeCompletionList =
    completionTab === "business" ? completionItemsBusiness : completionItemsPhotos;

  return (
    <div className="rounded-2xl bg-[#f4f4f6] dark:bg-[#141416] p-6 sm:p-8 space-y-6 shadow-xl border border-slate-200/80 dark:border-transparent">
      {/* Page Title & Subtitle */}
      <div>
        <h1 className="text-xl font-bold text-foreground tracking-tight">
          GBP Ranking Insights
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Monitor your Google Business Profile rank across locations, keywords, and competitors.
        </p>
      </div>

      {/* Filter Inputs Bar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Date Range Popover Filter */}
        <DateRangePicker value={dateRange} onChange={setDateRange} />

        {/* Keywords Dropdown Filter */}
        <KeywordFilterDropdown
          selectedKeywords={selectedKeywords}
          onChange={setSelectedKeywords}
          options={ALL_KEYWORDS}
        />

        {/* Location Dropdown Filter */}
        <LocationFilterDropdown
          selectedLocations={selectedLocations}
          onChange={setSelectedLocations}
          options={ALL_LOCATIONS}
        />
      </div>

      {/* Row 1: 4 Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
        {/* Card 1: Total Stores */}
        <div className="panel p-4 flex flex-col justify-between h-full space-y-2">
          <div className="flex items-center gap-1.5 text-blue-500">
            <Store className="size-3.5" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-500">
              Total Stores
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <p className="tnum text-3xl font-extrabold tracking-tight text-foreground">
                {metrics.totalStores}
              </p>
              <span className="flex items-center text-xs font-bold text-emerald-400 gap-0.5">
                <TrendingUp className="size-3" /> +5
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              In 107 Cities
            </p>
          </div>
        </div>

        {/* Card 2: Total Keyword(s) */}
        <div className="panel p-4 flex flex-col justify-between h-full space-y-2">
          <div className="flex items-center gap-1.5 text-blue-500">
            <Search className="size-3.5" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-500">
              Total Keyword(s)
            </span>
          </div>
          <div>
            <p className="tnum text-3xl font-extrabold tracking-tight text-foreground">
              {selectedKeywords.length}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Last Run {metrics.lastRunDate}
            </p>
          </div>
        </div>

        {/* Card 3: Visibility Score */}
        <div className="panel p-4 flex flex-col justify-between h-full space-y-2">
          <div className="flex items-center gap-1.5 text-blue-500">
            <Target className="size-3.5" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-500">
              Visibility Score
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <p className="tnum text-3xl font-extrabold tracking-tight text-foreground">
                {metrics.visibilityScore}%
              </p>
              <span className="flex items-center text-xs font-bold text-red-400 gap-0.5">
                <TrendingDown className="size-3" /> -2.54%
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Last Run {metrics.lastRunDate}
            </p>
          </div>
        </div>

        {/* Card 4: Average Ranking */}
        <div className="panel p-4 flex flex-col justify-between h-full space-y-2">
          <div className="flex items-center gap-1.5 text-blue-500">
            <Award className="size-3.5" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-500">
              Average Ranking
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <p className="tnum text-3xl font-extrabold tracking-tight text-foreground">
                {metrics.averageRanking}
              </p>
              <span className="flex items-center text-xs font-bold text-emerald-400 gap-0.5">
                <TrendingUp className="size-3" /> +0.50
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Last Run {metrics.lastRunDate}
            </p>
          </div>
        </div>
      </div>

      {/* Row 2: Average Rank Trend Over Time Chart */}
      <div className="panel p-4 sm:p-5 flex flex-col justify-between space-y-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="size-4 text-blue-500" />
          <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
            Average Rank Trend Over Time
          </h3>
        </div>

        <div className="relative h-64 w-full">
          <p className="absolute -left-2 top-0 text-[10px] text-muted-foreground z-10">
            Rankings
          </p>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={trendData}
              margin={{ top: 20, right: 15, left: -15, bottom: 0 }}
            >
              <CartesianGrid stroke="var(--border)" vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                reversed={true}
                domain={[1, 20]}
                ticks={[1, 6, 11, 16, 20]}
                tickFormatter={(v) => (v === 20 ? "20+" : String(v))}
                tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#18181b] border border-[#3f3f46] p-2.5 rounded-lg shadow-xl text-xs space-y-1.5">
                        <p className="font-bold text-muted-foreground text-[11px]">{label}</p>
                        <div className="space-y-1">
                          {payload.map((entry) => (
                            <p key={entry.name} className="flex items-center gap-2 text-white font-semibold">
                              <span className="size-2 rounded-full" style={{ backgroundColor: entry.color }} />
                              <span>{entry.name}: {entry.value}</span>
                            </p>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="demoPvtLtd"
                name="Demo Pvt Ltd"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="bata"
                name="Bata"
                stroke="#06b6d4"
                strokeWidth={2}
                dot={{ fill: "#06b6d4", r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="comet"
                name="Comet"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ fill: "#22c55e", r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="redTape"
                name="Red Tape"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ fill: "#ef4444", r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 text-xs pt-2 border-t border-border">
          <span className="flex items-center gap-1.5 cursor-pointer hover:opacity-80">
            <span className="size-2.5 rounded-full bg-[#3b82f6]" /> Demo Pvt Ltd
          </span>
          <span className="flex items-center gap-1.5 cursor-pointer hover:opacity-80">
            <span className="size-2.5 rounded-full bg-[#06b6d4]" /> Bata
          </span>
          <span className="flex items-center gap-1.5 cursor-pointer hover:opacity-80">
            <span className="size-2.5 rounded-full bg-[#22c55e]" /> Comet
          </span>
          <span className="flex items-center gap-1.5 cursor-pointer hover:opacity-80">
            <span className="size-2.5 rounded-full bg-[#ef4444]" /> Red Tape
          </span>
        </div>
      </div>

      {/* Row 3: Most Improved Stores & Most Declined Stores */}
      <div className="grid gap-4 lg:grid-cols-2 items-stretch">
        {/* Most Improved Stores */}
        <div className="panel p-4 sm:p-5 flex flex-col justify-between h-full space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Search className="size-4 text-blue-500" />
            <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
              Most Improved Stores
            </h3>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-secondary/30 text-muted-foreground font-semibold">
                  <th className="py-2.5 px-3">Store</th>
                  <th className="py-2.5 px-3 text-center">Current Rank</th>
                  <th className="py-2.5 px-3 text-center">Last Rank</th>
                  <th className="py-2.5 px-3 text-right">Improvement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {improvedStoresList.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-secondary/20 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-3">
                      <p className="font-bold text-foreground text-xs">
                        {item.name}, {item.location}
                      </p>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-foreground tnum">
                      {item.currentRank}
                    </td>
                    <td className="py-3 px-3 text-center text-muted-foreground tnum">
                      {item.lastRank}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold tnum">
                        <TrendingUp className="size-3" /> +{item.changeValue}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Most Declined Stores */}
        <div className="panel p-4 sm:p-5 flex flex-col justify-between h-full space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Search className="size-4 text-blue-500" />
            <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
              Most Declined Stores
            </h3>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-secondary/30 text-muted-foreground font-semibold">
                  <th className="py-2.5 px-3">Store</th>
                  <th className="py-2.5 px-3 text-center">Current Rank</th>
                  <th className="py-2.5 px-3 text-center">Last Rank</th>
                  <th className="py-2.5 px-3 text-right">Decrement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {declinedStoresList.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-secondary/20 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-3">
                      <p className="font-bold text-foreground text-xs">
                        {item.name}, {item.location}
                      </p>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-foreground tnum">
                      {item.currentRank}
                    </td>
                    <td className="py-3 px-3 text-center text-muted-foreground tnum">
                      {item.lastRank}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 text-xs font-bold tnum">
                        <TrendingDown className="size-3" /> -{item.changeValue}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Row 4: Stores Appeared on Keyword Searched & Completion Score Grid */}
      <div className="grid gap-4 lg:grid-cols-2 items-stretch">
        {/* Left Panel: Stores Appeared on Keyword Searched Bar Chart */}
        <div className="panel p-4 sm:p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="size-4 text-blue-500" />
            <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
              Stores Appeared on Keyword Searched
            </h3>
          </div>

          <div className="relative h-64 w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={storesAppearedBarData}
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
                />
                <Tooltip
                  contentStyle={{
                    background: "#18181b",
                    border: "1px solid #3f3f46",
                    borderRadius: 6,
                    fontSize: 12,
                    color: "#ffffff",
                  }}
                />
                <Bar dataKey="locations" name="Locations" fill="#eab308" barSize={100} />
                <Bar dataKey="keywords" name="Keywords" fill="#facc15" barSize={100} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs pt-2 border-t border-border">
            <span className="flex items-center gap-1.5 cursor-pointer">
              <span className="size-2.5 rounded-full bg-[#eab308]" /> Locations
            </span>
            <span className="flex items-center gap-1.5 cursor-pointer">
              <span className="size-2.5 rounded-full bg-[#facc15]" /> Keywords
            </span>
          </div>
        </div>

        {/* Right Panel: Completion Score */}
        <div className="panel p-3.5 sm:p-4 flex flex-col justify-between space-y-3.5">
          <div className="flex items-center gap-2 mb-1">
            <Hourglass className="size-4 text-blue-500" />
            <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
              Completion Score
            </h3>
          </div>

          {/* Compact Semi-circle Gauge Arc */}
          <div className="flex flex-col items-center justify-center pt-1">
            <div className="relative size-36 grid place-items-center">
              <svg className="size-full" viewBox="0 0 100 100">
                <path
                  d="M 20 75 A 40 40 0 1 1 80 75"
                  fill="none"
                  stroke="var(--secondary)"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
                <path
                  d="M 20 75 A 40 40 0 1 1 80 75"
                  fill="none"
                  stroke="#facc15"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray="188.5"
                  strokeDashoffset={0}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pb-2">
                <span className="tnum text-2xl font-extrabold text-foreground tracking-tight">
                  100%
                </span>
              </div>
            </div>

            <div className="mt-[-8px] z-10">
              <span className="inline-block px-3 py-0.5 rounded-full bg-[#052e16] border border-[#14532d] text-emerald-400 font-semibold text-[11px]">
                Completed
              </span>
            </div>
          </div>

          {/* Tab Pill Buttons */}
          <div className="bg-background p-1 rounded-lg border border-border flex items-center">
            <button
              onClick={() => setCompletionTab("business")}
              className={`flex-1 py-1 text-[11px] font-medium rounded-md transition-all cursor-pointer ${
                completionTab === "business"
                  ? "bg-secondary text-foreground font-semibold shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Business Info
            </button>
            <button
              onClick={() => setCompletionTab("photos")}
              className={`flex-1 py-1 text-[11px] font-medium rounded-md transition-all cursor-pointer ${
                completionTab === "photos"
                  ? "bg-secondary text-foreground font-semibold shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Photo Gallery
            </button>
          </div>

          {/* Progress Rows */}
          <div className="space-y-2 pt-0.5">
            {activeCompletionList.map((item) => (
              <div key={item.label} className="grid grid-cols-[100px_1fr] items-center gap-2">
                <span className="text-[11px] font-medium text-foreground truncate">
                  {item.label}
                </span>
                <div className="w-full bg-secondary rounded-md overflow-hidden h-5 border border-emerald-900/30">
                  <div
                    className="h-full bg-[#10b981] flex items-center justify-center rounded-md transition-all duration-500"
                    style={{ width: `${item.pct}%` }}
                  >
                    <span className="tnum text-[10px] font-bold text-white tracking-wide">
                      {item.pct}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
