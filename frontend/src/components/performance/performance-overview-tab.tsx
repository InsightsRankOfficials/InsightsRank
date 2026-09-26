import { useState, useMemo } from "react";
import {
  Globe2,
  Compass,
  Navigation,
  MousePointerClick,
  BarChart3,
  TrendingDown,
  TrendingUp,
  Zap,
  Layers,
  Calendar,
  ChevronDown,
} from "lucide-react";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { compactNumber } from "@/lib/format";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
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
import {
  IMPRESSIONS_DONUT_DATA,
  SEARCH_DONUT_DATA,
  MAPS_DONUT_DATA,
  CUSTOMER_ACTIONS_DONUT_DATA,
  PERFORMANCE_LINE_SERIES,
  ACTIONS_LINE_SERIES,
  TOP_10_STATES_IMPRESSIONS,
  TOP_10_CITIES_IMPRESSIONS,
  TOP_10_LOCATIONS_IMPRESSIONS,
  TOP_10_STATES_ACTIONS,
  TOP_10_CITIES_ACTIONS,
  TOP_10_LOCATIONS_ACTIONS,
  STATE_DESKTOP_BAR_DATA,
  METRICS_BAR_DATA,
  WEEKDAY_ANALYSIS_DATA,
} from "@/data/performance-analytics";

const CUSTOM_TOOLTIP_STYLE = {
  background: "#18181b",
  border: "1px solid #3f3f46",
  borderRadius: 6,
  fontSize: 12,
  color: "#f4f4f5",
};

import { LocationFilterDropdown, ALL_LOCATIONS } from "@/components/locations/state-city-filter-dropdowns";
import { evaluateDateRange } from "@/lib/date-range";

export function PerformanceOverviewTab() {
  const [dateRange, setDateRange] = useState("01 Apr 2026 - 17 Sep 2026");
  
  // Location Multi-Select Checkbox State - default empty [] for "All Locations"
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  // Toggles for charts
  const [trendGranularity, setTrendGranularity] = useState<"Month" | "Week" | "Day">("Day");
  const [topImpressionsType, setTopImpressionsType] = useState<"States" | "Cities" | "Locations">("States");
  const [stateDesktopType, setStateDesktopType] = useState<"Desktop" | "Mobile">("Desktop");
  const [actionsGranularity, setActionsGranularity] = useState<"Month" | "Week" | "Day">("Day");
  const [topActionsType, setTopActionsType] = useState<"States" | "Cities" | "Locations">("States");
  const [weeklyViewType, setWeeklyViewType] = useState<"Actions" | "Performance">("Actions");

  const { hasData, multiplier } = useMemo(() => {
    const res = evaluateDateRange(dateRange);
    let mult = res.multiplier;
    if (selectedLocations.length > 0 && selectedLocations.length < ALL_LOCATIONS.length) {
      mult *= Math.max(0.1, selectedLocations.length / ALL_LOCATIONS.length);
    }
    return { hasData: res.hasData, multiplier: mult };
  }, [dateRange, selectedLocations]);

  const kpiStats = useMemo(() => ({
    totalImp: hasData ? compactNumber(Math.round(383400 * multiplier)) : "0",
    mobileImp: hasData ? compactNumber(Math.round(355700 * multiplier)) : "0",
    desktopImp: hasData ? compactNumber(Math.round(27700 * multiplier)) : "0",
    totalActions: hasData ? compactNumber(Math.round(21600 * multiplier)) : "0",
    searchImpSum: hasData ? compactNumber(Math.round(262600 * multiplier)) : "0",
    mapImpSum: hasData ? compactNumber(Math.round(120900 * multiplier)) : "0",
  }), [hasData, multiplier]);

  const impressionsDonutData = useMemo(() => IMPRESSIONS_DONUT_DATA.map(d => ({ ...d, value: hasData ? Math.round(d.value * multiplier) : 0 })), [hasData, multiplier]);
  const searchDonutData = useMemo(() => SEARCH_DONUT_DATA.map(d => ({ ...d, value: hasData ? Math.round(d.value * multiplier) : 0 })), [hasData, multiplier]);
  const mapsDonutData = useMemo(() => MAPS_DONUT_DATA.map(d => ({ ...d, value: hasData ? Math.round(d.value * multiplier) : 0 })), [hasData, multiplier]);

  const performanceLineSeries = useMemo(() => PERFORMANCE_LINE_SERIES.map(d => ({
    ...d,
    desktopSearch: hasData ? Math.round(d.desktopSearch * multiplier) : 0,
    mobileSearch: hasData ? Math.round(d.mobileSearch * multiplier) : 0,
    desktopMaps: hasData ? Math.round(d.desktopMaps * multiplier) : 0,
    mobileMaps: hasData ? Math.round(d.mobileMaps * multiplier) : 0,
  })), [hasData, multiplier]);

  const actionsLineSeries = useMemo(() => ACTIONS_LINE_SERIES.map(d => ({
    ...d,
    callClicks: hasData ? Math.round(d.callClicks * multiplier) : 0,
    websiteClicks: hasData ? Math.round(d.websiteClicks * multiplier) : 0,
    directionRequests: hasData ? Math.round(d.directionRequests * multiplier) : 0,
  })), [hasData, multiplier]);

  // Top 10 Impressions dataset switcher
  const top10ImpressionsData = useMemo(() => {
    const raw = topImpressionsType === "Cities" ? TOP_10_CITIES_IMPRESSIONS : topImpressionsType === "Locations" ? TOP_10_LOCATIONS_IMPRESSIONS : TOP_10_STATES_IMPRESSIONS;
    return raw.map(d => ({ ...d, value: hasData ? Math.round(d.value * multiplier) : 0 }));
  }, [topImpressionsType, hasData, multiplier]);

  const stateDesktopBarData = useMemo(() => STATE_DESKTOP_BAR_DATA.map(d => ({
    ...d,
    searchImpressions: hasData ? Math.round(d.searchImpressions * multiplier) : 0,
    mapsImpressions: hasData ? Math.round(d.mapsImpressions * multiplier) : 0,
  })), [hasData, multiplier]);

  // Top 10 Actions dataset switcher
  const top10ActionsData = useMemo(() => {
    const raw = topActionsType === "Cities" ? TOP_10_CITIES_ACTIONS : topActionsType === "Locations" ? TOP_10_LOCATIONS_ACTIONS : TOP_10_STATES_ACTIONS;
    return raw.map(d => ({ ...d, value: hasData ? Math.round(d.value * multiplier) : 0 }));
  }, [topActionsType, hasData, multiplier]);

  const metricsBarData = useMemo(() => METRICS_BAR_DATA.map(d => ({ ...d, value: hasData ? Math.round(d.value * multiplier) : 0 })), [hasData, multiplier]);

  const weekdayAnalysisData = useMemo(() => WEEKDAY_ANALYSIS_DATA.map(d => ({
    ...d,
    totalActions: hasData ? Math.round(d.totalActions * multiplier) : 0,
    websiteClicks: hasData ? Math.round(d.websiteClicks * multiplier) : 0,
    callClicks: hasData ? Math.round(d.callClicks * multiplier) : 0,
    directionRequests: hasData ? Math.round(d.directionRequests * multiplier) : 0,
  })), [hasData, multiplier]);

  return (
    <div className="rounded-2xl bg-[#f4f4f6] dark:bg-[#141416] p-6 sm:p-8 space-y-6 shadow-xl border border-slate-200/80 dark:border-transparent">
      {/* Page Title & Subtitle matching Dashboard & Rankings style */}
      <div>
        <h1 className="text-xl font-bold text-foreground tracking-tight">Overview</h1>
        <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed max-w-5xl">
          The Google Business Profile Insights Dashboard provides a comprehensive overview of your store's online performance. Monitor key metrics for business views, search terms, call visibility, and customer actions in real time to help optimize your local search presence and drive growth.
        </p>
      </div>

      {/* Filter Inputs Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <DateRangePicker value={dateRange} onChange={setDateRange} />

        {/* Location Dropdown Filter */}
        <LocationFilterDropdown
          selectedLocations={selectedLocations}
          onChange={setSelectedLocations}
          options={ALL_LOCATIONS}
        />
      </div>

      {/* Row 1: 4 Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
        <div className="panel p-4 flex flex-col justify-between h-full space-y-2">
          <div className="flex items-center gap-1.5 text-blue-500">
            <Globe2 className="size-3.5" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-500">Total Impressions</span>
          </div>
          <div>
            <div className="flex items-baseline justify-between">
              <p className="tnum text-3xl font-extrabold tracking-tight text-foreground">{kpiStats.totalImp}</p>
              <span className={`flex items-center text-xs font-bold gap-0.5 tnum ${hasData ? "text-red-400" : "text-muted-foreground"}`}>
                <TrendingDown className="size-3" /> {hasData ? "-2.56%" : "0%"}
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">Last Run 30 Apr 2026</p>
          </div>
        </div>

        <div className="panel p-4 flex flex-col justify-between h-full space-y-2">
          <div className="flex items-center gap-1.5 text-blue-500">
            <Compass className="size-3.5" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-500">Mobile Impressions</span>
          </div>
          <div>
            <div className="flex items-baseline justify-between">
              <p className="tnum text-3xl font-extrabold tracking-tight text-foreground">{kpiStats.mobileImp}</p>
              <span className={`flex items-center text-xs font-bold gap-0.5 tnum ${hasData ? "text-red-400" : "text-muted-foreground"}`}>
                <TrendingDown className="size-3" /> {hasData ? "-0.28%" : "0%"}
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">Last Run 30 Apr 2026</p>
          </div>
        </div>

        <div className="panel p-4 flex flex-col justify-between h-full space-y-2">
          <div className="flex items-center gap-1.5 text-blue-500">
            <Navigation className="size-3.5" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-500">Desktop Impressions</span>
          </div>
          <div>
            <div className="flex items-baseline justify-between">
              <p className="tnum text-3xl font-extrabold tracking-tight text-foreground">{kpiStats.desktopImp}</p>
              <span className={`flex items-center text-xs font-bold gap-0.5 tnum ${hasData ? "text-red-400" : "text-muted-foreground"}`}>
                <TrendingDown className="size-3" /> {hasData ? "-0.52%" : "0%"}
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">Last Run 30 Apr 2026</p>
          </div>
        </div>

        <div className="panel p-4 flex flex-col justify-between h-full space-y-2">
          <div className="flex items-center gap-1.5 text-blue-500">
            <MousePointerClick className="size-3.5" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-500">Total Actions</span>
          </div>
          <div>
            <div className="flex items-baseline justify-between">
              <p className="tnum text-3xl font-extrabold tracking-tight text-foreground">{kpiStats.totalActions}</p>
              <span className={`flex items-center text-xs font-bold gap-0.5 tnum ${hasData ? "text-red-400" : "text-muted-foreground"}`}>
                <TrendingDown className="size-3" /> {hasData ? "-0.23%" : "0%"}
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">Last Run 30 Apr 2026</p>
          </div>
        </div>
      </div>

      {/* Row 2: 3 Donut KPI Cards - Exact Dashboard donut UI */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Donut 1: Total Impressions */}
        <div className="panel p-4 sm:p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center gap-2">
            <Globe2 className="size-4 text-blue-500" />
            <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">Total Impressions</h3>
          </div>
          <div className="relative h-48 w-full grid place-items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={impressionsDonutData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={54}
                  outerRadius={72}
                  paddingAngle={5}
                  cornerRadius={6}
                  stroke="none"
                >
                  {impressionsDonutData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={CUSTOM_TOOLTIP_STYLE}
                  itemStyle={{ color: "#f4f4f5" }}
                  formatter={(val: number) => compactNumber(val)}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-center">
              <span className="tnum text-2xl font-extrabold text-foreground tracking-tight leading-none">{kpiStats.totalImp}</span>
              <span className="text-[11px] font-medium text-muted-foreground leading-tight mt-1 max-w-[80px]">Total Impressions</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-5 text-xs pt-1 border-t border-border">
            <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-[#3b82f6]" /> Desktop Impressions</span>
            <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-[#10b981]" /> Mobile Impressions</span>
          </div>
        </div>

        {/* Donut 2: Search Impressions */}
        <div className="panel p-4 sm:p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center gap-2">
            <Compass className="size-4 text-blue-500" />
            <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">Search Impressions</h3>
          </div>
          <div className="relative h-48 w-full grid place-items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={searchDonutData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={54}
                  outerRadius={72}
                  paddingAngle={5}
                  cornerRadius={6}
                  stroke="none"
                >
                  {searchDonutData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={CUSTOM_TOOLTIP_STYLE}
                  itemStyle={{ color: "#f4f4f5" }}
                  formatter={(val: number) => compactNumber(val)}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-center">
              <span className="tnum text-2xl font-extrabold text-foreground tracking-tight leading-none">{kpiStats.searchImpSum}</span>
              <span className="text-[11px] font-medium text-muted-foreground leading-tight mt-1 max-w-[80px]">Search Impressions</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-5 text-xs pt-1 border-t border-border">
            <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-[#eab308]" /> Desktop Search</span>
            <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-[#3b82f6]" /> Mobile Search</span>
          </div>
        </div>

        {/* Donut 3: Maps Impressions */}
        <div className="panel p-4 sm:p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center gap-2">
            <Navigation className="size-4 text-blue-500" />
            <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">Map Impressions</h3>
          </div>
          <div className="relative h-48 w-full grid place-items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mapsDonutData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={54}
                  outerRadius={72}
                  paddingAngle={5}
                  cornerRadius={6}
                  stroke="none"
                >
                  {mapsDonutData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={CUSTOM_TOOLTIP_STYLE}
                  itemStyle={{ color: "#f4f4f5" }}
                  formatter={(val: number) => compactNumber(val)}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-center">
              <span className="tnum text-2xl font-extrabold text-foreground tracking-tight leading-none">{kpiStats.mapImpSum}</span>
              <span className="text-[11px] font-medium text-muted-foreground leading-tight mt-1 max-w-[80px]">Map Impressions</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-5 text-xs pt-1 border-t border-border">
            <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-[#10b981]" /> Desktop Maps</span>
            <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-[#ef4444]" /> Mobile Maps</span>
          </div>
        </div>
      </div>

      {/* Row 3: 2 Side-by-Side Line Trend Charts (Performance & Action) - Identical to Dashboard! */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Left Line Chart: Performance */}
        <div className="panel p-4 sm:p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-4 text-blue-500" />
              <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
                Performance
              </h3>
            </div>
            <div className="flex items-center gap-1 bg-[#18181b] border border-[#27272a] p-1 rounded-md text-[10px]">
              {(["Month", "Week", "Day"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTrendGranularity(t)}
                  className={`px-2 py-0.5 rounded cursor-pointer font-semibold transition-colors ${
                    trendGranularity === t ? "bg-blue-500 text-black font-bold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceLineSeries} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(val) => (val >= 1000 ? `${val / 1000}k` : val)} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} formatter={(val: number) => compactNumber(val)} />
                <Line type="monotone" dataKey="desktopSearch" name="Desktop Search" stroke="#2563eb" strokeWidth={2} dot={{ fill: "#2563eb", r: 3 }} />
                <Line type="monotone" dataKey="mobileSearch" name="Mobile Search" stroke="#facc15" strokeWidth={2} dot={{ fill: "#facc15", r: 3 }} />
                <Line type="monotone" dataKey="desktopMaps" name="Desktop Maps" stroke="#22c55e" strokeWidth={2} dot={{ fill: "#22c55e", r: 3 }} />
                <Line type="monotone" dataKey="mobileMaps" name="Mobile Maps" stroke="#f87171" strokeWidth={2} dot={{ fill: "#f87171", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs pt-1 border-t border-border">
            <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-[#2563eb]" /> Desktop Search</span>
            <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-[#facc15]" /> Mobile Search</span>
            <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-[#22c55e]" /> Desktop Maps</span>
            <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-[#f87171]" /> Mobile Maps</span>
          </div>
        </div>

        {/* Right Line Chart: Action */}
        <div className="panel p-4 sm:p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="size-4 text-blue-500" />
              <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
                Action
              </h3>
            </div>
            <div className="flex items-center gap-1 bg-[#18181b] border border-[#27272a] p-1 rounded-md text-[10px]">
              {(["Month", "Week", "Day"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setActionsGranularity(t)}
                  className={`px-2 py-0.5 rounded cursor-pointer font-semibold transition-colors ${
                    actionsGranularity === t ? "bg-blue-500 text-black font-bold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={actionsLineSeries} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(val) => (val >= 1000 ? `${val / 1000}k` : val)} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} formatter={(val: number) => compactNumber(val)} />
                <Line type="monotone" dataKey="callClicks" name="Call Clicks" stroke="#c084fc" strokeWidth={2} dot={{ fill: "#c084fc", r: 3 }} />
                <Line type="monotone" dataKey="websiteClicks" name="Website Clicks" stroke="#38bdf8" strokeWidth={2} dot={{ fill: "#38bdf8", r: 3 }} />
                <Line type="monotone" dataKey="directionRequests" name="Direction Requests" stroke="#facc15" strokeWidth={2} dot={{ fill: "#facc15", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs pt-1 border-t border-border">
            <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-[#c084fc]" /> Call Clicks</span>
            <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-[#38bdf8]" /> Website Clicks</span>
            <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-[#facc15]" /> Direction Requests</span>
          </div>
        </div>
      </div>

      {/* Row 4: Top 10 States by Impression Horizontal Bar Chart */}
      <div className="panel p-4 sm:p-5 flex flex-col justify-between space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="size-4 text-blue-500" />
            <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
              Top 10 {topImpressionsType} by Impression
            </h3>
          </div>
          <div className="flex items-center gap-1 bg-[#18181b] border border-[#27272a] p-1 rounded-md text-[10px]">
            {(["States", "Cities", "Locations"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTopImpressionsType(t)}
                className={`px-2 py-0.5 rounded cursor-pointer font-semibold transition-colors ${
                  topImpressionsType === t ? "bg-blue-500 text-black font-bold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={top10ImpressionsData} margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
              <CartesianGrid stroke="var(--border)" horizontal={false} strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={compactNumber} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} width={100} />
              <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} formatter={(val: number) => compactNumber(val)} />
              <Bar dataKey="value" name="Impressions" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 5: State Wise Desktop Impressions Bar Chart */}
      <div className="panel p-4 sm:p-5 flex flex-col justify-between space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="size-4 text-blue-500" />
            <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
              State Wise {stateDesktopType} Impressions
            </h3>
          </div>
          <div className="flex items-center gap-1 bg-[#18181b] border border-[#27272a] p-1 rounded-md text-[10px]">
            {(["Desktop", "Mobile"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setStateDesktopType(t)}
                className={`px-2 py-0.5 rounded cursor-pointer font-semibold transition-colors ${
                  stateDesktopType === t ? "bg-blue-500 text-black font-bold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stateDesktopBarData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
              <CartesianGrid stroke="var(--border)" vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="state" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={compactNumber} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} formatter={(val: number) => compactNumber(val)} />
              <Bar dataKey="searchImpressions" name="Search Impression" fill="#2563eb" radius={[3, 3, 0, 0]} barSize={120} />
              <Bar dataKey="mapsImpressions" name="Maps Impression" fill="#84cc16" radius={[3, 3, 0, 0]} barSize={120} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-center gap-6 text-xs pt-2 border-t border-border">
          <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-[#2563eb]" /> Search Impression</span>
          <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-[#84cc16]" /> Maps Impression</span>
        </div>
      </div>

      {/* Row 6: Top 10 States by Actions Bar Chart */}
      <div className="space-y-4 pt-2 border-t border-[#27272a]">
        <div>
          <h2 className="text-base font-bold text-foreground tracking-tight">Customer Actions Breakdown</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Monitor customer engagement and interactions with your business.
          </p>
        </div>

        <div className="panel p-4 sm:p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="size-4 text-blue-500" />
              <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
                Top 10 {topActionsType} by Actions
              </h3>
            </div>
            <div className="flex items-center gap-1 bg-[#18181b] border border-[#27272a] p-1 rounded-md text-[10px]">
              {(["States", "Cities", "Locations"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTopActionsType(t)}
                  className={`px-2 py-0.5 rounded cursor-pointer font-semibold transition-colors ${
                    topActionsType === t ? "bg-blue-500 text-black font-bold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={top10ActionsData} margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid stroke="var(--border)" horizontal={false} strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={compactNumber} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} width={100} />
                <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} formatter={(val: number) => compactNumber(val)} />
                <Bar dataKey="value" name="Actions" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 7: Additional Metrics */}
      <div className="space-y-4 pt-2 border-t border-[#27272a]">
        <div>
          <h2 className="text-base font-bold text-foreground tracking-tight">Additional Metrics</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Comprehensive overview of combined performance indicators.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          <div className="panel p-4 sm:p-5 flex flex-col justify-between space-y-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="size-4 text-blue-500" />
              <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">Metrics Bar</h3>
            </div>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metricsBarData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                  <CartesianGrid stroke="var(--border)" vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="metric" tick={{ fill: "var(--muted-foreground)", fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={compactNumber} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} formatter={(val: number) => compactNumber(val)} />
                  <Bar dataKey="value" name="Value" radius={[3, 3, 0, 0]} barSize={35}>
                    {metricsBarData.map((entry) => (
                      <Cell key={entry.metric} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="panel p-4 sm:p-5 flex flex-col justify-between space-y-4">
            <div className="flex items-center gap-2">
              <Layers className="size-4 text-blue-500" />
              <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">Metrics Breakdown</h3>
            </div>
            <div className="relative h-56 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={metricsBarData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={4}
                    cornerRadius={6}
                    stroke="none"
                  >
                    {metricsBarData.map((entry) => (
                      <Cell key={entry.metric} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} formatter={(val: number) => compactNumber(val)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Row 8: Weekly Analysis Section */}
      <div className="space-y-4 pt-2 border-t border-[#27272a]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-foreground tracking-tight">Weekly Analysis</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Day-by-day breakdown of performance and customer actions throughout the week.
            </p>
          </div>
          <div className="flex items-center gap-1 bg-[#18181b] border border-[#27272a] p-1 rounded-md text-[10px]">
            {(["Actions", "Performance"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setWeeklyViewType(t)}
                className={`px-2 py-0.5 rounded cursor-pointer font-semibold transition-colors ${
                  weeklyViewType === t ? "bg-blue-500 text-black font-bold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="panel p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="size-4 text-blue-500" />
            <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
              Performance and Actions vs Weekdays
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#27272a] bg-secondary/30 text-muted-foreground font-semibold">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Weekday</th>
                  <th className="py-2.5 px-3">Total Actions</th>
                  <th className="py-2.5 px-3">Change %</th>
                  <th className="py-2.5 px-3">Website Clicks</th>
                  <th className="py-2.5 px-3">Call Clicks</th>
                  <th className="py-2.5 px-3">Direction Requests</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {weekdayAnalysisData.map((row, i) => (
                  <tr key={row.weekday} className="hover:bg-secondary/20 transition-colors">
                    <td className="py-3 px-3 text-muted-foreground font-mono">{i + 1}</td>
                    <td className="py-3 px-3 font-bold text-foreground">{row.weekday}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-secondary rounded-full h-3 overflow-hidden">
                          <div className="bg-[#06b6d4] h-full rounded-full" style={{ width: `${Math.min(100, (row.totalActions / 4000) * 100)}%` }} />
                        </div>
                        <span className="tnum font-bold text-foreground text-[11px]">{row.totalActions}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-[11px] font-bold tnum ${row.changePct.startsWith("+") ? "text-emerald-400" : row.changePct === "0%" ? "text-muted-foreground" : "text-red-400"}`}>
                        {row.changePct}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-secondary rounded-full h-3 overflow-hidden">
                          <div className="bg-[#3b82f6] h-full rounded-full" style={{ width: `${Math.min(100, (row.websiteClicks / 1000) * 100)}%` }} />
                        </div>
                        <span className="tnum font-semibold text-foreground text-[11px]">{row.websiteClicks}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-secondary rounded-full h-3 overflow-hidden">
                          <div className="bg-[#a855f7] h-full rounded-full" style={{ width: `${Math.min(100, (row.callClicks / 2500) * 100)}%` }} />
                        </div>
                        <span className="tnum font-semibold text-foreground text-[11px]">{row.callClicks}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-secondary rounded-full h-3 overflow-hidden">
                          <div className="bg-[#facc15] h-full rounded-full" style={{ width: `${Math.min(100, (row.directionRequests / 1000) * 100)}%` }} />
                        </div>
                        <span className="tnum font-semibold text-foreground text-[11px]">{row.directionRequests}</span>
                      </div>
                    </td>
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
