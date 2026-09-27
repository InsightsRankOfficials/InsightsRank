import { useState, useMemo } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import {
  AlertCircle,
  Archive,
  BarChart3,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  FileText,
  FolderOpen,
  Info,
  Lock,
  Sparkles,
  Store,
  Zap,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { GoogleGIcon } from "@/components/ui/google-g-icon";
import { compactNumber } from "@/lib/format";

import { StateFilterDropdown, CityFilterDropdown, ALL_STATES, ALL_CITIES } from "./state-city-filter-dropdowns";

export function LocationsOverviewTab() {
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const filterRatio = useMemo(() => {
    let r = 1;
    if (selectedStates.length > 0 && selectedStates.length < ALL_STATES.length) {
      r *= Math.max(0.1, selectedStates.length / ALL_STATES.length);
    }
    if (selectedCities.length > 0 && selectedCities.length < ALL_CITIES.length) {
      r *= Math.max(0.1, selectedCities.length / ALL_CITIES.length);
    }
    return r;
  }, [selectedStates, selectedCities]);

  const kpis = useMemo(() => {
    return {
      total: Math.max(1, Math.round(315 * filterRatio)),
      published: Math.max(1, Math.round(315 * filterRatio)),
      googlePublished: Math.max(1, Math.round(309 * filterRatio)),
      verified: Math.max(1, Math.round(315 * filterRatio)),
      unverified: Math.round(5 * filterRatio),
      open: Math.max(1, Math.round(315 * filterRatio)),
      tempClosed: 0,
      permClosed: 0,
      unclaimed: Math.round(6 * filterRatio),
      duplicate: 0,
    };
  }, [filterRatio]);

  const unclaimedClaimedData = useMemo(() => [
    { month: "Apr 2026", pending: Math.round(3 * filterRatio), claimed: Math.round(2 * filterRatio) },
    { month: "May 2026", monthLabel: "May 2026", pending: Math.round(3 * filterRatio), claimed: 0 },
    { month: "Jun 2026", pending: 0, claimed: 0 },
    { month: "Jul 2026", pending: 0, claimed: 0 },
    { month: "Aug 2026", pending: 0, claimed: 0 },
    { month: "Sep 2026", pending: 0, claimed: 0 },
  ], [filterRatio]);

  const suggestedFields = [
    { label: "Total Suggestions", count: 0 },
    { label: "Store Name", count: 0 },
    { label: "Address", count: 0 },
    { label: "Contact", count: 0 },
    { label: "Categories", count: 0 },
    { label: "Attributes", count: 0 },
    { label: "Business Hours", count: 0 },
    { label: "Others", count: 0 },
  ];

  return (
    <div className="rounded-2xl bg-[#f4f4f6] dark:bg-[#141416] p-6 sm:p-8 space-y-6 shadow-xl border border-slate-200/80 dark:border-transparent">
      {/* Section 1 Header & Sub-filters */}
      <div className="space-y-3">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Overview</h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Monitor your business profile performance, track key metrics, and gain insights.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <StateFilterDropdown
            selectedStates={selectedStates}
            onChange={setSelectedStates}
          />
          <CityFilterDropdown
            selectedCities={selectedCities}
            onChange={setSelectedCities}
          />
          {(selectedStates.length > 0 || selectedCities.length > 0) && (
            <button
              onClick={() => {
                setSelectedStates([]);
                setSelectedCities([]);
              }}
              className="text-xs text-blue-500 hover:underline cursor-pointer font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* 9 KPI Cards Grid (3x3) */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {/* 1. Total Listing */}
        <div className="panel p-4 flex flex-col justify-between space-y-3 relative overflow-visible cursor-pointer hover:border-blue-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Store className="size-4 text-blue-500" />
              <span className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
                Total Listing
              </span>
            </div>
          </div>
          <span className="tnum text-3xl font-extrabold text-foreground tracking-tight">{kpis.total}</span>
        </div>

        {/* 2. Published Listing */}
        <div
          className="panel p-4 flex flex-col justify-between space-y-3 relative overflow-visible cursor-pointer hover:border-blue-500/40 transition-colors"
          onMouseEnter={() => setHoveredCard("published")}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-blue-500" />
              <span className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
                Published Listing
              </span>
            </div>
            <div className="flex items-center gap-1 bg-secondary/80 px-1.5 py-0.5 rounded border border-border cursor-pointer">
              <GoogleGIcon className="size-3.5" />
            </div>
          </div>
          <span className="tnum text-3xl font-extrabold text-foreground tracking-tight">{kpis.published}</span>

          {/* Hover Tooltip Popup matching Screenshot 1 */}
          {hoveredCard === "published" && (
            <div className="absolute right-2 top-10 z-30 w-56 p-2.5 rounded-lg bg-white dark:bg-[#18181b] border border-slate-300 dark:border-[#3f3f46] shadow-xl text-xs space-y-2 pointer-events-none">
              <p className="font-semibold text-[11px] text-foreground border-b border-border pb-1">
                Published stores across Platform
              </p>
              <div className="space-y-1 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <span className="text-[10px] text-sky-400">••••</span> InsightsRank
                  </span>
                  <span className="tnum font-bold text-foreground">{kpis.published}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <GoogleGIcon className="size-3" /> Google
                  </span>
                  <span className="tnum font-bold text-foreground">{kpis.googlePublished} / {kpis.published}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. Verified Listing */}
        <div className="panel p-4 flex flex-col justify-between space-y-3 relative cursor-pointer hover:border-blue-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-blue-500" />
              <span className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
                Verified Listing
              </span>
            </div>
            <div className="flex items-center gap-1 bg-secondary/80 px-1.5 py-0.5 rounded border border-border">
              <GoogleGIcon className="size-3.5" />
            </div>
          </div>
          <span className="tnum text-3xl font-extrabold text-foreground tracking-tight">{kpis.verified}</span>
        </div>

        {/* 4. Unverified Listing */}
        <div className="panel p-4 flex flex-col justify-between space-y-3 relative cursor-pointer hover:border-blue-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Info className="size-4 text-blue-500" />
              <span className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
                Unverified Listing
              </span>
            </div>
            <div className="flex items-center gap-1 bg-secondary/80 px-1.5 py-0.5 rounded border border-border">
              <GoogleGIcon className="size-3.5" />
            </div>
          </div>
          <span className="tnum text-3xl font-extrabold text-foreground tracking-tight">{kpis.unverified}</span>
        </div>

        {/* 5. Open Listing */}
        <div className="panel p-4 flex flex-col justify-between space-y-3 relative cursor-pointer hover:border-blue-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-blue-500" />
              <span className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
                Open Listing
              </span>
            </div>
            <div className="flex items-center gap-1 bg-secondary/80 px-1.5 py-0.5 rounded border border-border">
              <GoogleGIcon className="size-3.5" />
            </div>
          </div>
          <span className="tnum text-3xl font-extrabold text-foreground tracking-tight">{kpis.open}</span>
        </div>

        {/* 6. Temporary Closed Listing */}
        <div className="panel p-4 flex flex-col justify-between space-y-3 relative cursor-pointer hover:border-blue-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-blue-500" />
              <span className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
                Temporary Closed Listing
              </span>
            </div>
            <div className="flex items-center gap-1 bg-secondary/80 px-1.5 py-0.5 rounded border border-border">
              <GoogleGIcon className="size-3.5" />
            </div>
          </div>
          <span className="tnum text-3xl font-extrabold text-foreground tracking-tight">{kpis.tempClosed}</span>
        </div>

        {/* 7. Permanent Closed Listing */}
        <div className="panel p-4 flex flex-col justify-between space-y-3 relative cursor-pointer hover:border-blue-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="size-4 text-blue-500" />
              <span className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
                Permanent Closed Listing
              </span>
            </div>
            <div className="flex items-center gap-1 bg-secondary/80 px-1.5 py-0.5 rounded border border-border">
              <GoogleGIcon className="size-3.5" />
            </div>
          </div>
          <span className="tnum text-3xl font-extrabold text-foreground tracking-tight">{kpis.permClosed}</span>
        </div>

        {/* 8. Unclaimed Listing */}
        <div className="panel p-4 flex flex-col justify-between space-y-3 relative cursor-pointer hover:border-blue-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="size-4 text-blue-500" />
              <span className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
                Unclaimed Listing
              </span>
            </div>
            <div className="flex items-center gap-1 bg-secondary/80 px-1.5 py-0.5 rounded border border-border cursor-pointer">
              <GoogleGIcon className="size-3.5" />
              <ExternalLink className="size-3 text-muted-foreground" />
            </div>
          </div>
          <span className="tnum text-3xl font-extrabold text-foreground tracking-tight">{kpis.unclaimed}</span>
        </div>

        {/* 9. Duplicate Listing */}
        <div className="panel p-4 flex flex-col justify-between space-y-3 relative cursor-pointer hover:border-blue-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Copy className="size-4 text-blue-500" />
              <span className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
                Duplicate Listing
              </span>
            </div>
            <div className="flex items-center gap-1 bg-secondary/80 px-1.5 py-0.5 rounded border border-border cursor-pointer">
              <GoogleGIcon className="size-3.5" />
              <ExternalLink className="size-3 text-muted-foreground" />
            </div>
          </div>
          <span className="tnum text-3xl font-extrabold text-foreground tracking-tight">{kpis.duplicate}</span>
        </div>
      </div>

      {/* Health Score Panel */}
      <div className="panel p-4 sm:p-5 flex flex-col md:flex-row items-stretch justify-between gap-6">
        {/* Left Side Score */}
        <div className="flex flex-col justify-center min-w-[200px] border-b md:border-b-0 md:border-r border-border pb-4 md:pb-0 md:pr-6">
          <div className="flex items-center gap-2 text-blue-500 mb-1">
            <Zap className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">Health Score</span>
          </div>
          <div className="mt-2">
            <span className="tnum text-4xl font-extrabold text-foreground tracking-tight">
              93.8%
            </span>
            <p className="text-xs font-medium text-muted-foreground mt-1">Overall Health Score</p>
            <p className="text-xs font-semibold text-emerald-400 mt-0.5">Excellent Performance</p>
          </div>
        </div>

        {/* Right Side Progress Bars */}
        <div className="flex-1 flex flex-col justify-center space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">Business Information Completeness</span>
              <span className="tnum font-bold text-foreground">87.5%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-3.5 overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: "87.5%" }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">
                Customer Review Response Rate (Last 6 months)
              </span>
              <span className="tnum font-bold text-foreground">100%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-3.5 overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="panel p-4 sm:p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="size-4 text-blue-500" />
            <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
              Unclaimed & Claimed Listing
            </h3>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={unclaimedClaimedData}
                margin={{ top: 15, right: 15, left: -15, bottom: 0 }}
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
                  domain={[0, 3]}
                  ticks={[0, 0.5, 1, 1.5, 2, 2.5, 3]}
                />
                <Tooltip
                  contentStyle={{
                    background: "#18181b",
                    border: "1px solid #3f3f46",
                    borderRadius: 6,
                    fontSize: 12,
                    color: "#f4f4f5",
                  }}
                  itemStyle={{ color: "#f4f4f5" }}
                  labelStyle={{ color: "#a1a1aa", fontWeight: 600 }}
                />
                <Bar dataKey="pending" name="Pending" fill="#f87171" radius={[3, 3, 0, 0]} barSize={16} />
                <Bar dataKey="claimed" name="Claimed" fill="#4ade80" radius={[3, 3, 0, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs pt-2 border-t border-border">
            <span className="flex items-center gap-1.5 cursor-pointer">
              <span className="size-2.5 rounded-sm bg-[#f87171]" /> Pending
            </span>
            <span className="flex items-center gap-1.5 cursor-pointer">
              <span className="size-2.5 rounded-sm bg-[#4ade80]" /> Claimed
            </span>
          </div>
        </div>

        <div className="panel p-4 sm:p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center gap-2">
            <Copy className="size-4 text-blue-500" />
            <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
              Duplicate & Merged Listing
            </h3>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center min-h-[220px] text-center p-4">
            <EmptyState
              description="Try adjusting the filters to see if any data is available."
              imageClassName="w-40 max-w-full h-auto object-contain mx-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
