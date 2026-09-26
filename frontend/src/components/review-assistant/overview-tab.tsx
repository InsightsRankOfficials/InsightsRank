import React, { useState, useMemo } from "react";
import {
  Calendar,
  MapPin,
  QrCode,
  CheckCircle,
  Edit3,
  Clock,
  Filter,
  BarChart2,
  TrendingUp,
  Flame,
  TrendingDown,
  ChevronDown,
} from "lucide-react";
import {
  REVIEW_ASSISTANT_KPI,
  REVIEW_GENERATION_FUNNEL,
  EDIT_RATIO_DATA,
  SCANS_OVER_TIME_MONTH,
  SCANS_SUMMARY,
  PUBLISHED_REVIEWS_TREND,
  ASPECT_SENTIMENT_ANALYSIS,
  REVIEW_ACTIVITY_HEATMAP,
  PEAK_ACTIVITY_HOURS,
  LOWEST_ACTIVITY_PERIODS,
} from "@/data/review-assistant-analytics";
import { HighchartsLineChart } from "@/components/charts/highcharts-line-chart";
import { HighchartsTrendChart } from "@/components/charts/highcharts-trend-chart";
import { EditRatioDonutChart } from "@/components/charts/edit-ratio-donut-chart";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { evaluateDateRange } from "@/lib/date-range";

import { LocationFilterDropdown, ALL_LOCATIONS } from "@/components/locations/state-city-filter-dropdowns";

export function OverviewTab() {
  const [dateRange, setDateRange] = useState("01 Apr 2026 - 17 Sep 2026");
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [trendGraphType, setTrendGraphType] = useState<"bar" | "line">("bar");
  const [hoveredAspect, setHoveredAspect] = useState<string | null>(null);

  const { hasData, multiplier } = useMemo(() => {
    const res = evaluateDateRange(dateRange);
    let mult = res.multiplier;
    if (selectedLocations.length > 0 && selectedLocations.length < ALL_LOCATIONS.length) {
      mult *= Math.max(0.2, selectedLocations.length / ALL_LOCATIONS.length);
    }
    return { hasData: res.hasData, multiplier: mult };
  }, [dateRange, selectedLocations]);

  const kpiStats = useMemo(() => ({
    totalQrScans: hasData ? Math.round(1842 * multiplier).toLocaleString() : "0",
    completionRate: hasData ? "91.2%" : "0%",
    editRate: hasData ? "28.4%" : "0%",
    avgCompletionTime: hasData ? "1m 14s" : "0s",
  }), [hasData, multiplier]);

  // Prepare data for Highcharts Scans Over Time
  const scansCategories = SCANS_OVER_TIME_MONTH.map((s) => s.month);
  const scansData = useMemo(() => SCANS_OVER_TIME_MONTH.map((s) => (hasData ? Math.round(s.scans * multiplier) : 0)), [hasData, multiplier]);

  // Prepare data for Highcharts Published Reviews Trend
  const trendCategories = PUBLISHED_REVIEWS_TREND.map((t) => t.month);
  const positiveData = useMemo(() => PUBLISHED_REVIEWS_TREND.map((t) => (hasData ? Math.round(t.positive * multiplier) : 0)), [hasData, multiplier]);
  const neutralData = useMemo(() => PUBLISHED_REVIEWS_TREND.map((t) => (hasData ? Math.round(t.neutral * multiplier) : 0)), [hasData, multiplier]);
  const negativeData = useMemo(() => PUBLISHED_REVIEWS_TREND.map((t) => (hasData ? Math.round(t.negative * multiplier) : 0)), [hasData, multiplier]);

  return (
    <div className="rounded-2xl bg-card dark:bg-[#141416] p-6 sm:p-8 space-y-6 shadow-xl border border-border">
      {/* Overview Header & Filter Bar */}
      <div className="space-y-3">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Overview</h1>
          <p className="text-xs text-muted-foreground mt-1 max-w-4xl leading-relaxed">
            The Review Generator Dashboard helps you understand how customers perceive your store. Monitor feedback patterns, analyze sentiment, and generate AI-powered review responses to enhance your online reputation.
          </p>
        </div>

        {/* Filter Inputs Bar */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          {/* Date Range Picker */}
          <DateRangePicker value={dateRange} onChange={setDateRange} />

          {/* Location Filter Dropdown */}
          <LocationFilterDropdown
            selectedLocations={selectedLocations}
            onChange={setSelectedLocations}
            options={ALL_LOCATIONS}
          />
        </div>
      </div>

      {/* KPI Cards Row (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="rounded-xl border border-border dark:border-[#27272a] bg-card dark:bg-[#121214] p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <QrCode className="size-3.5 text-blue-500 dark:text-blue-400" />
            <span>Total QR Scans</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{kpiStats.totalQrScans}</p>
        </div>

        {/* Card 2 */}
        <div className="rounded-xl border border-border dark:border-[#27272a] bg-card dark:bg-[#121214] p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <CheckCircle className="size-3.5 text-blue-500 dark:text-blue-400" />
            <span>Completion Rate</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{kpiStats.completionRate}</p>
        </div>

        {/* Card 3 */}
        <div className="rounded-xl border border-border dark:border-[#27272a] bg-card dark:bg-[#121214] p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <Edit3 className="size-3.5 text-blue-500 dark:text-blue-400" />
            <span>Edit Rate</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{kpiStats.editRate}</p>
        </div>

        {/* Card 4 */}
        <div className="rounded-xl border border-border dark:border-[#27272a] bg-card dark:bg-[#121214] p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <Clock className="size-3.5 text-blue-500 dark:text-blue-400" />
            <span>Average Completion Time</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{kpiStats.avgCompletionTime}</p>
        </div>
      </div>

      {/* Middle Section: Funnel & Edit Ratio (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Card: Review Generation Funnel */}
        <div className="lg:col-span-7 rounded-xl border border-border dark:border-[#27272a] bg-card dark:bg-[#121214] p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border/60 dark:border-[#27272a]/60">
            <Filter className="size-4 text-blue-500 dark:text-blue-400" />
            <h3 className="text-xs font-bold text-foreground">Review Generation Funnel</h3>
          </div>

          <div className="space-y-4">
            {REVIEW_GENERATION_FUNNEL.map((step, idx) => (
              <div key={step.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="size-5 rounded-full bg-blue-500/20 text-blue-500 dark:text-blue-400 text-[10px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-foreground">{step.label}</span>
                    <span className="font-bold text-foreground">{step.count}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-muted-foreground">
                    {step.change && <span className="text-rose-500 dark:text-rose-400 font-mono">{step.change}</span>}
                    <span className="text-foreground">{step.rightPct}</span>
                  </div>
                </div>

                {/* Progress bar container */}
                <div className="w-full h-7 rounded-lg bg-secondary/40 dark:bg-[#18181b] overflow-hidden relative flex items-center px-3 border border-border/60 dark:border-[#27272a]/60">
                  <div
                    className="absolute top-0 bottom-0 left-0 bg-blue-400 transition-all duration-500 rounded-lg"
                    style={{
                      width: step.label.includes("QR") ? "100%" : step.label.includes("Generated") ? "45%" : "25%",
                    }}
                  />
                  <span className="relative z-10 text-[11px] font-bold text-black drop-shadow-sm">
                    {step.pctOfTotal}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Card: Edit Ratio (Taking Reference from Total Impressions Chart) */}
        <div className="lg:col-span-5 rounded-xl border border-border dark:border-[#27272a] bg-card dark:bg-[#121214] p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-border/60 dark:border-[#27272a]/60">
              <Edit3 className="size-4 text-blue-500 dark:text-blue-400" />
              <h3 className="text-xs font-bold text-foreground">Edit Ratio</h3>
            </div>

            {/* Circular Donut & Bullets (Total Impressions Chart Reference) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
              <EditRatioDonutChart
                aiGeneratedPct={EDIT_RATIO_DATA.aiGeneratedPct}
                editedPct={EDIT_RATIO_DATA.editedPct}
                height={140}
              />

              <div className="space-y-2 text-[11px] text-muted-foreground">
                <div className="flex items-start gap-1.5">
                  <span className="size-2 rounded-full bg-emerald-500 dark:bg-emerald-400 shrink-0 mt-1" />
                  <p className="leading-snug">{EDIT_RATIO_DATA.editedBullet}</p>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="size-2 rounded-full bg-blue-500 dark:bg-blue-400 shrink-0 mt-1" />
                  <p className="leading-snug">{EDIT_RATIO_DATA.asIsBullet}</p>
                </div>
              </div>
            </div>

            {/* Progress Bars for AI Generated vs Edited */}
            <div className="space-y-2 pt-1">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-foreground">AI Generated</span>
                  <span className="font-mono text-muted-foreground">{EDIT_RATIO_DATA.aiGeneratedCount} ({EDIT_RATIO_DATA.aiGeneratedPct}%)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-secondary/40 dark:bg-[#18181b] overflow-hidden">
                  <div className="h-full bg-blue-400 rounded-full" style={{ width: `${EDIT_RATIO_DATA.aiGeneratedPct}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-foreground">Edited</span>
                  <span className="font-mono text-muted-foreground">{EDIT_RATIO_DATA.editedCount} ({EDIT_RATIO_DATA.editedPct}%)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-secondary/40 dark:bg-[#18181b] overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${EDIT_RATIO_DATA.editedPct}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Tone Copy Rates Grid */}
          <div className="pt-2 border-t border-border/60 dark:border-[#27272a]/60 space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-muted-foreground block">Review Tone Copy Rate</span>
            <div className="grid grid-cols-4 gap-2 text-center">
              {EDIT_RATIO_DATA.toneCopyRates.map((t) => (
                <div key={t.tone} className="p-2 rounded-lg border border-border dark:border-[#27272a] bg-secondary/30 dark:bg-[#18181b]">
                  <p className="text-xs font-extrabold text-foreground">{t.pct}</p>
                  <p className="text-[10px] text-muted-foreground font-medium truncate mt-0.5">{t.tone}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scans Over Time Month Chart (Proper Highcharts Line Chart) */}
      <div className="rounded-xl border border-border dark:border-[#27272a] bg-card dark:bg-[#121214] p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border/60 dark:border-[#27272a]/60">
          <div className="flex items-center gap-2">
            <BarChart2 className="size-4 text-blue-500 dark:text-blue-400" />
            <h3 className="text-xs font-bold text-foreground">Scans Over Time Month</h3>
          </div>
        </div>

        {/* Highcharts Line Chart Component */}
        <HighchartsLineChart
          categories={scansCategories}
          data={scansData}
          height={240}
          seriesName="QR Scans"
          color="#6366f1"
        />

        {/* Footer Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-border/60 dark:border-[#27272a]/60 text-center">
          <div className="space-y-0.5">
            <p className="text-[10px] uppercase font-bold text-muted-foreground">Peak Month</p>
            <p className="text-xs font-bold text-foreground">{SCANS_SUMMARY.peakMonth}</p>
            <p className="text-[10px] text-muted-foreground">{SCANS_SUMMARY.peakScans}</p>
          </div>
          <div className="space-y-0.5 border-t sm:border-t-0 sm:border-l border-border dark:border-[#27272a] pt-2 sm:pt-0">
            <p className="text-[10px] uppercase font-bold text-muted-foreground">Monthly Average</p>
            <p className="text-xs font-bold text-foreground">{SCANS_SUMMARY.monthlyAvg}</p>
            <p className="text-[10px] text-muted-foreground">{SCANS_SUMMARY.avgText}</p>
          </div>
          <div className="space-y-0.5 border-t sm:border-t-0 sm:border-l border-border dark:border-[#27272a] pt-2 sm:pt-0">
            <p className="text-[10px] uppercase font-bold text-muted-foreground">Total Scans</p>
            <p className="text-xs font-bold text-foreground">{SCANS_SUMMARY.totalScans}</p>
            <p className="text-[10px] text-muted-foreground">{SCANS_SUMMARY.totalText}</p>
          </div>
        </div>
      </div>

      {/* Published Reviews Trend Month Chart (Highcharts Stacked Bar / Multi-Line Chart with Functional Toggle) */}
      <div className="rounded-xl border border-border dark:border-[#27272a] bg-card dark:bg-[#121214] p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border/60 dark:border-[#27272a]/60">
          <div className="flex items-center gap-2">
            <BarChart2 className="size-4 text-blue-500 dark:text-blue-400" />
            <h3 className="text-xs font-bold text-foreground">Published Reviews Trend Month</h3>
          </div>

          <div className="flex items-center gap-1 bg-background dark:bg-[#18181b] p-1 rounded-lg border border-border dark:border-[#27272a]">
            <button
              onClick={() => setTrendGraphType("bar")}
              className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                trendGraphType === "bar"
                  ? "bg-blue-500 text-black shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Bar Graph
            </button>
            <button
              onClick={() => setTrendGraphType("line")}
              className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                trendGraphType === "line"
                  ? "bg-blue-500 text-black shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Line Graph
            </button>
          </div>
        </div>

        {/* Dynamic Highcharts Bar/Line Trend Chart */}
        <HighchartsTrendChart
          categories={trendCategories}
          positiveData={positiveData}
          neutralData={neutralData}
          negativeData={negativeData}
          graphType={trendGraphType}
          height={240}
        />
      </div>

      {/* Aspect Sentiment Analysis */}
      <div className="rounded-xl border border-border dark:border-[#27272a] bg-card dark:bg-[#121214] p-5 space-y-4 relative">
        <div className="flex items-center justify-between pb-2 border-b border-border/60 dark:border-[#27272a]/60">
          <div className="flex items-center gap-2">
            <TrendingUp className="size-4 text-blue-500 dark:text-blue-400" />
            <h3 className="text-xs font-bold text-foreground">Aspect Sentiment Analysis</h3>
          </div>
        </div>

        {/* Horizontal Stacked Sentiment Bars */}
        <div className="space-y-3 pt-2">
          {ASPECT_SENTIMENT_ANALYSIS.map((aspect) => (
            <div
              key={aspect.name}
              onMouseEnter={() => setHoveredAspect(aspect.name)}
              onMouseLeave={() => setHoveredAspect(null)}
              className="space-y-1 relative cursor-pointer group"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-foreground">{aspect.name}</span>
              </div>

              {/* Tooltip Popup on Hover */}
              {hoveredAspect === aspect.name && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-20 bg-popover dark:bg-[#18181b] border border-border dark:border-[#27272a] p-2 rounded-lg text-[10px] text-foreground shadow-xl pointer-events-none whitespace-nowrap space-y-0.5">
                  <p className="font-bold text-blue-500 dark:text-blue-400">{aspect.name}</p>
                  <p>🟢 Positive: {aspect.positive} | 🟡 Neutral: {aspect.neutral} | 🔴 Negative: {aspect.negative}</p>
                </div>
              )}

              {/* Stacked Horizontal Bar */}
              <div className="w-full h-7 rounded-lg overflow-hidden flex bg-secondary/40 dark:bg-[#18181b] border border-border/60 dark:border-[#27272a]/60">
                {aspect.positive > 0 && (
                  <div
                    className="bg-emerald-500 h-full flex items-center justify-center text-[10px] font-bold text-black"
                    style={{ width: `${(aspect.positive / 5) * 100}%` }}
                  >
                    {aspect.positive}
                  </div>
                )}
                {aspect.neutral > 0 && (
                  <div
                    className="bg-blue-400 h-full flex items-center justify-center text-[10px] font-bold text-black"
                    style={{ width: `${(aspect.neutral / 5) * 100}%` }}
                  >
                    {aspect.neutral}
                  </div>
                )}
                {aspect.negative > 0 && (
                  <div
                    className="bg-rose-500 h-full flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ width: `${(aspect.negative / 5) * 100}%` }}
                  >
                    {aspect.negative}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 text-[11px] text-muted-foreground pt-2">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded bg-emerald-500"></span>
            <span>Positive</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded bg-blue-400"></span>
            <span>Neutral</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded bg-rose-500"></span>
            <span>Negative</span>
          </div>
        </div>

        {/* Aspect Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-border/60 dark:border-[#27272a]/60">
          {ASPECT_SENTIMENT_ANALYSIS.map((item) => (
            <div key={item.name} className="p-3 rounded-lg border border-border dark:border-[#27272a] bg-secondary/30 dark:bg-[#18181b] flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-foreground">{item.name}</p>
                <p className="text-[11px] text-blue-500 dark:text-blue-400 font-mono mt-0.5">{item.detail}</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20">
                {item.scoreText}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Review Activity Heatmap */}
      <div className="rounded-xl border border-border dark:border-[#27272a] bg-card dark:bg-[#121214] p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border/60 dark:border-[#27272a]/60">
          <div className="flex items-center gap-2">
            <Flame className="size-4 text-blue-500 dark:text-blue-400" />
            <h3 className="text-xs font-bold text-foreground">Review Activity Heatmap</h3>
          </div>
        </div>

        {/* Heatmap Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs border-collapse min-w-[600px]">
            <thead>
              <tr className="text-[10px] text-muted-foreground font-bold border-b border-border dark:border-[#27272a]">
                <th className="py-2 px-2 text-left w-14"></th>
                {REVIEW_ACTIVITY_HEATMAP.timeSlots.map((slot) => (
                  <th key={slot} className="py-2 px-2 font-bold">{slot}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 dark:divide-[#27272a]/50">
              {REVIEW_ACTIVITY_HEATMAP.days.map((row) => (
                <tr key={row.day} className="hover:bg-secondary/20 transition-colors">
                  <td className="py-2 px-2 text-left font-bold text-muted-foreground text-[11px]">{row.day}</td>
                  {row.values.map((val, idx) => {
                    let bg = "bg-secondary text-muted-foreground/60";
                    if (val === 2) bg = "bg-blue-600 text-white font-bold";
                    if (val === 1) bg = "bg-orange-500 text-white font-bold";
                    return (
                      <td key={idx} className="p-1">
                        <div className={`h-8 rounded flex items-center justify-center text-xs transition-colors ${bg}`}>
                          {val}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Heatmap Legend Bar */}
        <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground pt-2">
          <div className="flex items-center gap-1">
            <span className="size-3 rounded bg-secondary"></span>
            <span>0 to 0</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="size-3 rounded bg-blue-600"></span>
            <span>1 to 35</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="size-3 rounded bg-orange-500"></span>
            <span>36 to 60</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="size-3 rounded bg-blue-400"></span>
            <span>61 to 85</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="size-3 rounded bg-emerald-500"></span>
            <span>86 to 100</span>
          </div>
        </div>
      </div>

      {/* Activity Period Cards (2 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Left Card: Peak Activity Hours */}
        <div className="rounded-xl border border-border dark:border-[#27272a] bg-card dark:bg-[#121214] p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border/60 dark:border-[#27272a]/60">
            <TrendingUp className="size-4 text-emerald-500 dark:text-emerald-400" />
            <div>
              <h3 className="text-xs font-bold text-foreground">Peak Activity Hours</h3>
              <p className="text-[10px] text-muted-foreground">Highest review engagement periods</p>
            </div>
          </div>

          <div className="space-y-3">
            {PEAK_ACTIVITY_HOURS.map((item) => (
              <div
                key={item.period}
                className="flex items-center justify-between p-3 rounded-lg border border-border dark:border-[#27272a] bg-secondary/30 dark:bg-[#18181b]/60"
              >
                <div>
                  <p className="text-xs font-bold text-foreground">{item.period}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{item.tag}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-emerald-500 dark:text-emerald-400">{item.count.split(" ")[0]}</span>
                  <span className="text-[10px] text-muted-foreground block">reviews</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Card: Lowest Activity Periods */}
        <div className="rounded-xl border border-border dark:border-[#27272a] bg-card dark:bg-[#121214] p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border/60 dark:border-[#27272a]/60">
            <TrendingDown className="size-4 text-rose-500 dark:text-rose-400" />
            <div>
              <h3 className="text-xs font-bold text-foreground">Lowest Activity Periods</h3>
              <p className="text-[10px] text-muted-foreground">Times with minimal engagement</p>
            </div>
          </div>

          <div className="space-y-3">
            {LOWEST_ACTIVITY_PERIODS.map((item) => (
              <div
                key={item.period}
                className="flex items-center justify-between p-3 rounded-lg border border-border dark:border-[#27272a] bg-secondary/30 dark:bg-[#18181b]/60"
              >
                <div>
                  <p className="text-xs font-bold text-foreground">{item.period}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{item.tag}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-muted-foreground">{item.count.split(" ")[0]}</span>
                  <span className="text-[10px] text-muted-foreground block">reviews</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
