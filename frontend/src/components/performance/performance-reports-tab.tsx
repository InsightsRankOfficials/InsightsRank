import { useState, useMemo } from "react";
import {
  Download,
  BarChart3,
  Table as TableIcon,
  Globe2,
  MousePointerClick,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { compactNumber } from "@/lib/format";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  STORE_PERFORMANCE_STACKED_BAR_DATA,
  STORE_ACTIONS_STACKED_BAR_DATA,
  CUSTOMER_ACTIONS_DONUT_DATA,
  STATE_PERFORMANCE_STACKED_BAR_DATA,
  STATE_ACTIONS_STACKED_BAR_DATA,
} from "@/data/performance-analytics";

import { evaluateDateRange } from "@/lib/date-range";

const CUSTOM_TOOLTIP_STYLE = {
  background: "#18181b",
  border: "1px solid #3f3f46",
  borderRadius: 6,
  fontSize: 12,
  color: "#f4f4f5",
};

// Store Performance tag pills
const STORE_PERFORMANCE_TAG_PILLS = [
  { label: "Top Performing Days", date: "Apr 19, 2026" },
  { label: "Least Performing Days", date: "Apr 30, 2026" },
  { label: "Most Desktop Search", date: "Apr 01, 2026" },
  { label: "Least Desktop Search", date: "Apr 20, 2026" },
  { label: "Most Mobile Search", date: "Apr 19, 2026" },
  { label: "Least Mobile Search", date: "Apr 30, 2026" },
  { label: "Most Desktop Maps", date: "Apr 19, 2026" },
  { label: "Least Desktop Maps", date: "Apr 12, 2026" },
  { label: "Most Mobile Maps", date: "Apr 19, 2026" },
  { label: "Least Mobile Maps", date: "Apr 03, 2026" },
];

const STORE_ACTIONS_TAG_PILLS = [
  { label: "Most Calls", date: "Apr 20, 2026" },
  { label: "Least Calls", date: "Apr 27, 2026" },
  { label: "Most Directions", date: "Apr 14, 2026" },
  { label: "Least Directions", date: "Apr 09, 2026" },
  { label: "Most Website Clicks", date: "Apr 18, 2026" },
  { label: "Least Website Clicks", date: "Apr 30, 2026" },
];

// State Performance Tag Pills matching Screenshot 1
const STATE_PERFORMANCE_TAG_PILLS = [
  { label: "Top Performing State", value: "Maharashtra" },
  { label: "Least Performing State", value: "Andhra Pradesh" },
  { label: "Most Desktop Search", value: "Maharashtra" },
  { label: "Least Desktop Search", value: "Andhra Pradesh" },
  { label: "Most Mobile Search", value: "Maharashtra" },
  { label: "Least Mobile Search", value: "Andhra Pradesh" },
  { label: "Most Desktop Maps", value: "Gujarat" },
  { label: "Least Desktop Maps", value: "Andhra Pradesh" },
  { label: "Most Mobile Maps", value: "Gujarat" },
  { label: "Least Mobile Maps", value: "Andhra Pradesh" },
];

const STATE_ACTIONS_TAG_PILLS = [
  { label: "Most Calls", value: "Gujarat" },
  { label: "Least Calls", value: "Andhra Pradesh" },
  { label: "Most Directions", value: "Gujarat" },
  { label: "Least Directions", value: "Andhra Pradesh" },
  { label: "Most Website Clicks", value: "Gujarat" },
  { label: "Least Website Clicks", value: "Andhra Pradesh" },
];

const METRICS_PERFORMANCE_DONUT = [
  { name: "Desktop Search", value: 48200, fill: "#eab308" },
  { name: "Mobile Search", value: 214400, fill: "#3b82f6" },
  { name: "Desktop Maps", value: 18500, fill: "#10b981" },
  { name: "Mobile Maps", value: 102400, fill: "#ef4444" },
];
const STATE_OPTIONS = [
  "Andhra Pradesh",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Gujarat",
  "Haryana",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Madhya Pradesh",
  "Maharashtra",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Uttarakhand",
  "West Bengal",
];

const LOCATION_OPTIONS = [
  "Demo Store 371",
  "Demo Store 312",
  "Demo Store 304",
  "Demo Store 42",
  "Demo Store 100",
  "Demo Store 101",
  "Demo Store 102",
  "Demo Store 103",
  "Demo Store 104",
];

export function PerformanceReportsTab() {
  const [subTab, setSubTab] = useState<"State Performance" | "Store Performance" | "Metrics">("State Performance");
  const [viewMode, setViewMode] = useState<"Graph" | "Table">("Graph");
  const [dateRange, setDateRange] = useState("01 Apr 2026 - 17 Sep 2026");
  const [selectedLocation, setSelectedLocation] = useState("all");
  
  // Multi-Select Checkbox States
  const [selectedStates, setSelectedStates] = useState<string[]>(STATE_OPTIONS);
  const [tempStates, setTempStates] = useState<string[]>(STATE_OPTIONS);
  const [statePopoverOpen, setStatePopoverOpen] = useState(false);

  const [selectedLocations, setSelectedLocations] = useState<string[]>(LOCATION_OPTIONS);
  const [tempLocations, setTempLocations] = useState<string[]>(LOCATION_OPTIONS);
  const [locationPopoverOpen, setLocationPopoverOpen] = useState(false);

  const handleApplyStates = () => {
    setSelectedStates(tempStates);
    setStatePopoverOpen(false);
  };

  const handleApplyLocations = () => {
    setSelectedLocations(tempLocations);
    setLocationPopoverOpen(false);
  };

  const [selectedPill, setSelectedPill] = useState<string | null>(null);

  // Series toggle states for Highcharts style interactive legend disabling
  const [disabledPerfSeries, setDisabledPerfSeries] = useState<string[]>([]);
  const [disabledActionSeries, setDisabledActionSeries] = useState<string[]>([]);

  const dateAnalysis = useMemo(() => evaluateDateRange(dateRange), [dateRange]);
  const { hasData, multiplier } = dateAnalysis;

  const togglePerfSeries = (key: string) => {
    setDisabledPerfSeries((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const toggleActionSeries = (key: string) => {
    setDisabledActionSeries((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // Filtered State Data based on multi-select checkbox selection & DateRange
  const filteredStatePerfData = useMemo(() => {
    let base = STATE_PERFORMANCE_STACKED_BAR_DATA;
    if (selectedStates.length > 0 && selectedStates.length < STATE_OPTIONS.length) {
      base = base.filter((d) =>
        selectedStates.some((s) => s.toLowerCase() === d.state.toLowerCase())
      );
    }
    if (!hasData) {
      return base.map((d) => ({
        ...d,
        desktopSearch: 0,
        mobileSearch: 0,
        desktopMaps: 0,
        mobileMaps: 0,
      }));
    }
    return base.map((d) => ({
      ...d,
      desktopSearch: Math.round(d.desktopSearch * multiplier),
      mobileSearch: Math.round(d.mobileSearch * multiplier),
      desktopMaps: Math.round(d.desktopMaps * multiplier),
      mobileMaps: Math.round(d.mobileMaps * multiplier),
    }));
  }, [selectedStates, hasData, multiplier]);

  const filteredStateActionsData = useMemo(() => {
    let base = STATE_ACTIONS_STACKED_BAR_DATA;
    if (selectedStates.length > 0 && selectedStates.length < STATE_OPTIONS.length) {
      base = base.filter((d) =>
        selectedStates.some((s) => s.toLowerCase() === d.state.toLowerCase())
      );
    }
    if (!hasData) {
      return base.map((d) => ({
        ...d,
        websiteClicks: 0,
        callClicks: 0,
        directionRequests: 0,
      }));
    }
    return base.map((d) => ({
      ...d,
      websiteClicks: Math.round(d.websiteClicks * multiplier),
      callClicks: Math.round(d.callClicks * multiplier),
      directionRequests: Math.round(d.directionRequests * multiplier),
    }));
  }, [selectedStates, hasData, multiplier]);

  const storePerfData = useMemo(() => {
    if (!hasData) {
      return STORE_PERFORMANCE_STACKED_BAR_DATA.map((d) => ({
        ...d,
        desktopSearch: 0,
        mobileSearch: 0,
        desktopMaps: 0,
        mobileMaps: 0,
      }));
    }
    return STORE_PERFORMANCE_STACKED_BAR_DATA.map((d) => ({
      ...d,
      desktopSearch: Math.round(d.desktopSearch * multiplier),
      mobileSearch: Math.round(d.mobileSearch * multiplier),
      desktopMaps: Math.round(d.desktopMaps * multiplier),
      mobileMaps: Math.round(d.mobileMaps * multiplier),
    }));
  }, [hasData, multiplier]);

  const storeActionsData = useMemo(() => {
    if (!hasData) {
      return STORE_ACTIONS_STACKED_BAR_DATA.map((d) => ({
        ...d,
        websiteClicks: 0,
        callClicks: 0,
        directionRequests: 0,
      }));
    }
    return STORE_ACTIONS_STACKED_BAR_DATA.map((d) => ({
      ...d,
      websiteClicks: Math.round(d.websiteClicks * multiplier),
      callClicks: Math.round(d.callClicks * multiplier),
      directionRequests: Math.round(d.directionRequests * multiplier),
    }));
  }, [hasData, multiplier]);

  const metricsPerfDonut = useMemo(() => {
    if (!hasData) {
      return METRICS_PERFORMANCE_DONUT.map((d) => ({ ...d, value: 0 }));
    }
    return METRICS_PERFORMANCE_DONUT.map((d) => ({ ...d, value: Math.round(d.value * multiplier) }));
  }, [hasData, multiplier]);

  const metricsActionsDonut = useMemo(() => {
    if (!hasData) {
      return CUSTOMER_ACTIONS_DONUT_DATA.map((d) => ({ ...d, value: 0 }));
    }
    return CUSTOMER_ACTIONS_DONUT_DATA.map((d) => ({ ...d, value: Math.round(d.value * multiplier) }));
  }, [hasData, multiplier]);

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Subtab,Entity,Desktop Search,Mobile Search,Desktop Maps,Mobile Maps,Website Clicks,Call Clicks,Direction Requests\n" +
      filteredStatePerfData
        .map(
          (s, i) =>
            `"State Performance","${s.state}","${s.desktopSearch}","${s.mobileSearch}","${s.desktopMaps}","${s.mobileMaps}","${filteredStateActionsData[i]?.websiteClicks || 0}","${filteredStateActionsData[i]?.callClicks || 0}","${filteredStateActionsData[i]?.directionRequests || 0}"`
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `performance_reports_${subTab.toLowerCase().replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Performance ${subTab} Report exported to CSV!`);
  };

  return (
    <div className="rounded-2xl bg-card dark:bg-[#141416] p-6 sm:p-8 space-y-6 shadow-xl border border-border">
      {/* Sub-Nav Tabs matching Rankings & Screenshots */}
      <div className="flex items-center gap-2 border-b border-border dark:border-[#27272a] pb-3 mb-6">
        {(["State Performance", "Store Performance", "Metrics"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setSubTab(tab)}
            className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
              subTab === tab
                ? "bg-secondary text-blue-500 dark:bg-[#27272a] dark:text-blue-400 border border-blue-500/30 shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Sub-tab 1: State Performance (Screenshot 1) */}
      {subTab === "State Performance" && (
        <div className="space-y-6">
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">State Performance</h1>
            <p className="mt-0.5 text-xs text-muted-foreground">
              A detailed look at your store's performance.
            </p>
          </div>

          {/* Controls Row matching Screenshot 1 */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 bg-background dark:bg-[#18181b] border border-border dark:border-[#27272a] p-1 rounded-md text-[10px]">
                <button
                  onClick={() => setViewMode("Graph")}
                  className={`px-2.5 py-1 rounded cursor-pointer font-bold transition-colors flex items-center gap-1 ${
                    viewMode === "Graph" ? "bg-blue-500 text-black" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <BarChart3 className="size-3" />
                  <span>Graph</span>
                </button>
                <button
                  onClick={() => setViewMode("Table")}
                  className={`px-2.5 py-1 rounded cursor-pointer font-bold transition-colors flex items-center gap-1 ${
                    viewMode === "Table" ? "bg-blue-500 text-black" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <TableIcon className="size-3" />
                  <span>Table</span>
                </button>
              </div>

              <DateRangePicker value={dateRange} onChange={setDateRange} />

              {/* Multi-Select Checkbox Popover for State matching GBP Ranking Insights */}
              <Popover open={statePopoverOpen} onOpenChange={(open) => {
                setStatePopoverOpen(open);
                if (open) setTempStates(selectedStates);
              }}>
                <PopoverTrigger asChild>
                  <button className="h-8 px-3 rounded-md bg-background dark:bg-[#121214] border border-border dark:border-[#27272a] hover:border-[#3f3f46] text-xs font-semibold text-foreground flex items-center justify-between gap-2 min-w-[150px] cursor-pointer transition-colors shadow-sm">
                    <span className="truncate">
                      {selectedStates.length === STATE_OPTIONS.length
                        ? "State"
                        : `${selectedStates.length} States`}
                    </span>
                    <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-3 bg-popover dark:bg-[#121214] border-border dark:border-[#27272a] text-foreground shadow-2xl rounded-xl space-y-3">
                  <p className="text-[11px] font-bold text-blue-500 border-b border-border dark:border-[#27272a] pb-1.5">
                    State
                  </p>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {STATE_OPTIONS.map((state) => {
                      const checked = tempStates.includes(state);
                      return (
                        <label
                          key={state}
                          className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer hover:text-blue-400 select-none"
                        >
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(isCheck) => {
                              if (isCheck) {
                                setTempStates((prev) => [...prev, state]);
                              } else {
                                setTempStates((prev) => prev.filter((s) => s !== state));
                              }
                            }}
                            className="border-border dark:border-[#3f3f46] data-[state=checked]:bg-blue-500 data-[state=checked]:text-black"
                          />
                          <span className="truncate">{state}</span>
                        </label>
                      );
                    })}
                  </div>

                  <Button
                    size="sm"
                    onClick={handleApplyStates}
                    className="w-full h-7 bg-secondary dark:bg-[#27272a] hover:bg-blue-500 hover:text-black text-foreground text-xs font-bold rounded cursor-pointer transition-colors"
                  >
                    Apply
                  </Button>
                </PopoverContent>
              </Popover>
            </div>

            <Button
              onClick={handleExport}
              className="h-8 bg-blue-500 hover:bg-blue-600 text-black font-bold text-xs px-3.5 cursor-pointer gap-1.5 shadow-sm rounded-md"
            >
              <Download className="size-3.5" />
              <span>Export</span>
            </Button>
          </div>

          {viewMode === "Graph" ? (
            <>
              {/* Card 1: Performance Stacked Bar Chart matching Screenshot 1 */}
              <div className="panel p-4 sm:p-5 flex flex-col justify-between space-y-4">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">Performance</h3>

                {/* Tag Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                  {STATE_PERFORMANCE_TAG_PILLS.map((pill) => (
                    <button
                      key={pill.label}
                      onClick={() => {
                        setSelectedPill(pill.label);
                        toast.info(`${pill.label}: ${pill.value}`);
                      }}
                      className={`whitespace-nowrap px-2.5 py-1 rounded-md text-[10.5px] font-medium border transition-all cursor-pointer ${
                        selectedPill === pill.label
                          ? "bg-blue-500 text-black font-bold border-blue-500 shadow-sm"
                          : "bg-secondary/40 dark:bg-[#18181b] text-sky-600 dark:text-sky-400 border-sky-500/20 dark:border-sky-900/40 hover:bg-secondary dark:hover:bg-[#27272a]"
                      }`}
                    >
                      <span className="text-sky-700 dark:text-sky-300">{pill.label}: </span>
                      <span className="font-bold text-blue-500 dark:text-blue-400">{pill.value}</span>
                    </button>
                  ))}
                </div>

                {/* Stacked Chart */}
                <div className="h-64 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={filteredStatePerfData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid stroke="var(--border)" vertical={false} strokeDasharray="3 5" />
                      <XAxis dataKey="state" tick={{ fill: "var(--muted-foreground)", fontSize: 9 }} axisLine={false} tickLine={false} />
                      <YAxis tickFormatter={compactNumber} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} formatter={(val: number) => compactNumber(val)} />
                      <Bar dataKey="desktopSearch" name="Desktop Search" stackId="statePerf" fill="#2563eb" hide={disabledPerfSeries.includes("desktopSearch")} />
                      <Bar dataKey="mobileSearch" name="Mobile Search" stackId="statePerf" fill="#facc15" hide={disabledPerfSeries.includes("mobileSearch")} />
                      <Bar dataKey="desktopMaps" name="Desktop Maps" stackId="statePerf" fill="#10b981" hide={disabledPerfSeries.includes("desktopMaps")} />
                      <Bar dataKey="mobileMaps" name="Mobile Maps" stackId="statePerf" fill="#ef4444" radius={[3, 3, 0, 0]} hide={disabledPerfSeries.includes("mobileMaps")} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Interactive Highcharts-style clickable Legend */}
                <div className="flex items-center justify-center gap-6 text-xs pt-2 border-t border-border">
                  {[
                    { key: "desktopSearch", label: "Desktop Search", color: "#2563eb" },
                    { key: "mobileSearch", label: "Mobile Search", color: "#facc15" },
                    { key: "desktopMaps", label: "Desktop Maps", color: "#10b981" },
                    { key: "mobileMaps", label: "Mobile Maps", color: "#ef4444" },
                  ].map((item) => {
                    const disabled = disabledPerfSeries.includes(item.key);
                    return (
                      <button
                        key={item.key}
                        onClick={() => togglePerfSeries(item.key)}
                        className={`flex items-center gap-1.5 cursor-pointer transition-opacity select-none ${
                          disabled ? "opacity-35 line-through" : "opacity-100 font-semibold"
                        }`}
                      >
                        <span className="size-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Card 2: Actions Stacked Bar Chart matching Screenshot 1 */}
              <div className="panel p-4 sm:p-5 flex flex-col justify-between space-y-4">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">Actions</h3>

                {/* Tag Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                  {STATE_ACTIONS_TAG_PILLS.map((pill) => (
                    <button
                      key={pill.label}
                      onClick={() => {
                        setSelectedPill(pill.label);
                        toast.info(`${pill.label}: ${pill.value}`);
                      }}
                      className={`whitespace-nowrap px-2.5 py-1 rounded-md text-[10.5px] font-medium border transition-all cursor-pointer ${
                        selectedPill === pill.label
                          ? "bg-blue-500 text-black font-bold border-blue-500 shadow-sm"
                          : "bg-secondary/40 dark:bg-[#18181b] text-sky-600 dark:text-sky-400 border-sky-500/20 dark:border-sky-900/40 hover:bg-secondary dark:hover:bg-[#27272a]"
                      }`}
                    >
                      <span className="text-sky-700 dark:text-sky-300">{pill.label}: </span>
                      <span className="font-bold text-blue-500 dark:text-blue-400">{pill.value}</span>
                    </button>
                  ))}
                </div>

                {/* Stacked Chart */}
                <div className="h-60 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={filteredStateActionsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid stroke="var(--border)" vertical={false} strokeDasharray="3 5" />
                      <XAxis dataKey="state" tick={{ fill: "var(--muted-foreground)", fontSize: 9 }} axisLine={false} tickLine={false} />
                      <YAxis tickFormatter={compactNumber} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} formatter={(val: number) => compactNumber(val)} />
                      <Bar dataKey="websiteClicks" name="Website Clicks" stackId="stateActions" fill="#3b82f6" hide={disabledActionSeries.includes("websiteClicks")} />
                      <Bar dataKey="callClicks" name="Call Clicks" stackId="stateActions" fill="#a855f7" hide={disabledActionSeries.includes("callClicks")} />
                      <Bar dataKey="directionRequests" name="Direction Requests" stackId="stateActions" fill="#facc15" radius={[3, 3, 0, 0]} hide={disabledActionSeries.includes("directionRequests")} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Interactive Highcharts-style clickable Legend */}
                <div className="flex items-center justify-center gap-6 text-xs pt-2 border-t border-border">
                  {[
                    { key: "websiteClicks", label: "Website Clicks", color: "#3b82f6" },
                    { key: "callClicks", label: "Call Clicks", color: "#a855f7" },
                    { key: "directionRequests", label: "Direction Requests", color: "#facc15" },
                  ].map((item) => {
                    const disabled = disabledActionSeries.includes(item.key);
                    return (
                      <button
                        key={item.key}
                        onClick={() => toggleActionSeries(item.key)}
                        className={`flex items-center gap-1.5 cursor-pointer transition-opacity select-none ${
                          disabled ? "opacity-35 line-through" : "opacity-100 font-semibold"
                        }`}
                      >
                        <span className="size-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            /* State Table View */
            <div className="panel p-4 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#27272a] bg-secondary/30 text-muted-foreground font-semibold">
                    <th className="py-2.5 px-3">State</th>
                    <th className="py-2.5 px-3">Desktop Search</th>
                    <th className="py-2.5 px-3">Mobile Search</th>
                    <th className="py-2.5 px-3">Desktop Maps</th>
                    <th className="py-2.5 px-3">Mobile Maps</th>
                    <th className="py-2.5 px-3">Total Impressions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredStatePerfData.map((row) => {
                    const total = row.desktopSearch + row.mobileSearch + row.desktopMaps + row.mobileMaps;
                    return (
                      <tr key={row.state} className="hover:bg-secondary/20 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-foreground">{row.state}</td>
                        <td className="py-2.5 px-3 tnum font-semibold">{row.desktopSearch}</td>
                        <td className="py-2.5 px-3 tnum font-semibold">{row.mobileSearch}</td>
                        <td className="py-2.5 px-3 tnum font-semibold">{row.desktopMaps}</td>
                        <td className="py-2.5 px-3 tnum font-semibold">{row.mobileMaps}</td>
                        <td className="py-2.5 px-3 tnum font-bold text-foreground">{total}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Sub-tab 2: Store Performance */}
      {subTab === "Store Performance" && (
        <div className="space-y-6">
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">Store Performance</h1>
            <p className="mt-0.5 text-xs text-muted-foreground">
              A detailed look at your store's performance.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 bg-background dark:bg-[#18181b] border border-border dark:border-[#27272a] p-1 rounded-md text-[10px]">
                <button
                  onClick={() => setViewMode("Graph")}
                  className={`px-2.5 py-1 rounded cursor-pointer font-bold transition-colors flex items-center gap-1 ${
                    viewMode === "Graph" ? "bg-blue-500 text-black" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <BarChart3 className="size-3" />
                  <span>Graphs</span>
                </button>
                <button
                  onClick={() => setViewMode("Table")}
                  className={`px-2.5 py-1 rounded cursor-pointer font-bold transition-colors flex items-center gap-1 ${
                    viewMode === "Table" ? "bg-blue-500 text-black" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <TableIcon className="size-3" />
                  <span>Table</span>
                </button>
              </div>

              <DateRangePicker value={dateRange} onChange={setDateRange} />

              {/* Multi-Select Checkbox Popover for Location matching GBP Ranking Insights */}
              <Popover open={locationPopoverOpen} onOpenChange={(open) => {
                setLocationPopoverOpen(open);
                if (open) setTempLocations(selectedLocations);
              }}>
                <PopoverTrigger asChild>
                  <button className="h-8 px-3 rounded-md bg-background dark:bg-[#121214] border border-border dark:border-[#27272a] hover:border-[#3f3f46] text-xs font-semibold text-foreground flex items-center justify-between gap-2 min-w-[160px] cursor-pointer transition-colors shadow-sm">
                    <span className="truncate">
                      {selectedLocations.length === LOCATION_OPTIONS.length
                        ? "Location"
                        : `${selectedLocations.length} Locations`}
                    </span>
                    <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-3 bg-popover dark:bg-[#121214] border-border dark:border-[#27272a] text-foreground shadow-2xl rounded-xl space-y-3">
                  <p className="text-[11px] font-bold text-blue-500 border-b border-border dark:border-[#27272a] pb-1.5">
                    Location
                  </p>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {LOCATION_OPTIONS.map((loc) => {
                      const checked = tempLocations.includes(loc);
                      return (
                        <label
                          key={loc}
                          className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer hover:text-blue-400 select-none"
                        >
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(isCheck) => {
                              if (isCheck) {
                                setTempLocations((prev) => [...prev, loc]);
                              } else {
                                setTempLocations((prev) => prev.filter((l) => l !== loc));
                              }
                            }}
                            className="border-border dark:border-[#3f3f46] data-[state=checked]:bg-blue-500 data-[state=checked]:text-black"
                          />
                          <span className="truncate">{loc}</span>
                        </label>
                      );
                    })}
                  </div>

                  <Button
                    size="sm"
                    onClick={handleApplyLocations}
                    className="w-full h-7 bg-secondary dark:bg-[#27272a] hover:bg-blue-500 hover:text-black text-foreground text-xs font-bold rounded cursor-pointer transition-colors"
                  >
                    Apply
                  </Button>
                </PopoverContent>
              </Popover>
            </div>

            <Button
              onClick={handleExport}
              className="h-8 bg-blue-500 hover:bg-blue-600 text-black font-bold text-xs px-3.5 cursor-pointer gap-1.5 shadow-sm rounded-md"
            >
              <Download className="size-3.5" />
              <span>Export</span>
            </Button>
          </div>

          {viewMode === "Graph" ? (
            <>
              {/* Performance Card */}
              <div className="panel p-4 sm:p-5 flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="size-4 text-blue-500" />
                    <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">Performance Breakdown</h3>
                  </div>
                  {selectedPill && (
                    <span className="text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 font-mono">
                      Active Filter: {selectedPill}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                  {STORE_PERFORMANCE_TAG_PILLS.map((pill) => (
                    <button
                      key={pill.label}
                      onClick={() => {
                        setSelectedPill(pill.label);
                        toast.info(`${pill.label}: ${pill.date}`);
                      }}
                      className={`whitespace-nowrap px-2.5 py-1 rounded-md text-[10.5px] font-medium border transition-all cursor-pointer ${
                        selectedPill === pill.label
                          ? "bg-blue-500 text-black font-bold border-blue-500 shadow-sm"
                          : "bg-secondary/40 dark:bg-[#18181b] text-sky-600 dark:text-sky-400 border-sky-500/20 dark:border-sky-900/40 hover:bg-secondary dark:hover:bg-[#27272a]"
                      }`}
                    >
                      <span className="text-sky-700 dark:text-sky-300">{pill.label}: </span>
                      <span className="font-bold text-blue-500 dark:text-blue-400">{pill.date}</span>
                    </button>
                  ))}
                </div>

                <div className="h-64 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={storePerfData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid stroke="var(--border)" vertical={false} strokeDasharray="3 5" />
                      <XAxis dataKey="date" tick={{ fill: "var(--muted-foreground)", fontSize: 9 }} axisLine={false} tickLine={false} />
                      <YAxis tickFormatter={compactNumber} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} formatter={(val: number) => compactNumber(val)} />
                      <Bar dataKey="desktopSearch" name="Desktop Search" stackId="a" fill="#eab308" hide={disabledPerfSeries.includes("desktopSearch")} />
                      <Bar dataKey="mobileSearch" name="Mobile Search" stackId="a" fill="#facc15" hide={disabledPerfSeries.includes("mobileSearch")} />
                      <Bar dataKey="desktopMaps" name="Desktop Maps" stackId="a" fill="#10b981" hide={disabledPerfSeries.includes("desktopMaps")} />
                      <Bar dataKey="mobileMaps" name="Mobile Maps" stackId="a" fill="#ef4444" radius={[3, 3, 0, 0]} hide={disabledPerfSeries.includes("mobileMaps")} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex items-center justify-center gap-6 text-xs pt-2 border-t border-border">
                  {[
                    { key: "desktopSearch", label: "Desktop Search", color: "#eab308" },
                    { key: "mobileSearch", label: "Mobile Search", color: "#facc15" },
                    { key: "desktopMaps", label: "Desktop Maps", color: "#10b981" },
                    { key: "mobileMaps", label: "Mobile Maps", color: "#ef4444" },
                  ].map((item) => {
                    const disabled = disabledPerfSeries.includes(item.key);
                    return (
                      <button
                        key={item.key}
                        onClick={() => togglePerfSeries(item.key)}
                        className={`flex items-center gap-1.5 cursor-pointer transition-opacity select-none ${
                          disabled ? "opacity-35 line-through" : "opacity-100 font-semibold"
                        }`}
                      >
                        <span className="size-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Actions Card */}
              <div className="panel p-4 sm:p-5 flex flex-col justify-between space-y-4">
                <div className="flex items-center gap-2">
                  <MousePointerClick className="size-4 text-blue-500" />
                  <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">Actions Breakdown</h3>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                  {STORE_ACTIONS_TAG_PILLS.map((pill) => (
                    <button
                      key={pill.label}
                      onClick={() => {
                        setSelectedPill(pill.label);
                        toast.info(`${pill.label}: ${pill.date}`);
                      }}
                      className={`whitespace-nowrap px-2.5 py-1 rounded-md text-[10.5px] font-medium border transition-all cursor-pointer ${
                        selectedPill === pill.label
                          ? "bg-blue-500 text-black font-bold border-blue-500 shadow-sm"
                          : "bg-secondary/40 dark:bg-[#18181b] text-sky-600 dark:text-sky-400 border-sky-500/20 dark:border-sky-900/40 hover:bg-secondary dark:hover:bg-[#27272a]"
                      }`}
                    >
                      <span className="text-sky-700 dark:text-sky-300">{pill.label}: </span>
                      <span className="font-bold text-blue-500 dark:text-blue-400">{pill.date}</span>
                    </button>
                  ))}
                </div>

                <div className="h-60 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={storeActionsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid stroke="var(--border)" vertical={false} strokeDasharray="3 5" />
                      <XAxis dataKey="date" tick={{ fill: "var(--muted-foreground)", fontSize: 9 }} axisLine={false} tickLine={false} />
                      <YAxis tickFormatter={compactNumber} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} formatter={(val: number) => compactNumber(val)} />
                      <Bar dataKey="websiteClicks" name="Website Clicks" stackId="b" fill="#3b82f6" hide={disabledActionSeries.includes("websiteClicks")} />
                      <Bar dataKey="callClicks" name="Call Clicks" stackId="b" fill="#a855f7" hide={disabledActionSeries.includes("callClicks")} />
                      <Bar dataKey="directionRequests" name="Direction Requests" stackId="b" fill="#facc15" radius={[3, 3, 0, 0]} hide={disabledActionSeries.includes("directionRequests")} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex items-center justify-center gap-6 text-xs pt-2 border-t border-border">
                  {[
                    { key: "websiteClicks", label: "Website Clicks", color: "#3b82f6" },
                    { key: "callClicks", label: "Call Clicks", color: "#a855f7" },
                    { key: "directionRequests", label: "Direction Requests", color: "#facc15" },
                  ].map((item) => {
                    const disabled = disabledActionSeries.includes(item.key);
                    return (
                      <button
                        key={item.key}
                        onClick={() => toggleActionSeries(item.key)}
                        className={`flex items-center gap-1.5 cursor-pointer transition-opacity select-none ${
                          disabled ? "opacity-35 line-through" : "opacity-100 font-semibold"
                        }`}
                      >
                        <span className="size-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="panel p-4 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#27272a] bg-secondary/30 text-muted-foreground font-semibold">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Desktop Search</th>
                    <th className="py-2.5 px-3">Mobile Search</th>
                    <th className="py-2.5 px-3">Desktop Maps</th>
                    <th className="py-2.5 px-3">Mobile Maps</th>
                    <th className="py-2.5 px-3">Total Impressions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {storePerfData.map((row) => {
                    const total = row.desktopSearch + row.mobileSearch + row.desktopMaps + row.mobileMaps;
                    return (
                      <tr key={row.date} className="hover:bg-secondary/20 transition-colors">
                        <td className="py-2.5 px-3 font-mono text-blue-400">{row.date}</td>
                        <td className="py-2.5 px-3 tnum font-semibold">{row.desktopSearch}</td>
                        <td className="py-2.5 px-3 tnum font-semibold">{row.mobileSearch}</td>
                        <td className="py-2.5 px-3 tnum font-semibold">{row.desktopMaps}</td>
                        <td className="py-2.5 px-3 tnum font-semibold">{row.mobileMaps}</td>
                        <td className="py-2.5 px-3 tnum font-bold text-foreground">{total}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Sub-tab 3: Metrics */}
      {subTab === "Metrics" && (
        <div className="space-y-6">
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">Google Business Insights</h1>
            <p className="mt-0.5 text-xs text-muted-foreground">
              A detailed look at your store's performance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <DateRangePicker value={dateRange} onChange={setDateRange} />

            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="h-8 w-44 bg-background dark:bg-[#121214] border-border dark:border-[#27272a] text-xs cursor-pointer font-semibold">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent className="bg-popover dark:bg-[#18181b] border-border dark:border-[#27272a] text-xs">
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="store-371">Demo Store 371</SelectItem>
                <SelectItem value="store-312">Demo Store 312</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="panel p-5 space-y-4 flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <Globe2 className="size-4 text-blue-500" />
                <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">Performance Breakdown</h3>
              </div>

              <div className="relative h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={metricsPerfDonut}
                      innerRadius={54}
                      outerRadius={80}
                      paddingAngle={4}
                      cornerRadius={6}
                      dataKey="value"
                      stroke="none"
                      label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(1)}%`}
                    >
                      {metricsPerfDonut.map((entry) => (
                        <Cell key={entry.name} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} formatter={(val: number) => compactNumber(val)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 text-xs pt-2 border-t border-border">
                <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-[#eab308]" /> Desktop Search</span>
                <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-[#3b82f6]" /> Mobile Search</span>
                <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-[#10b981]" /> Desktop Maps</span>
                <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-[#ef4444]" /> Mobile Maps</span>
              </div>
            </div>

            <div className="panel p-5 space-y-4 flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <MousePointerClick className="size-4 text-blue-500" />
                <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">Actions Breakdown</h3>
              </div>

              <div className="relative h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={metricsActionsDonut}
                      innerRadius={54}
                      outerRadius={80}
                      paddingAngle={4}
                      cornerRadius={6}
                      dataKey="value"
                      stroke="none"
                      label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(1)}%`}
                    >
                      {metricsActionsDonut.map((entry) => (
                        <Cell key={entry.name} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} formatter={(val: number) => compactNumber(val)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 text-xs pt-2 border-t border-border">
                <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-[#3b82f6]" /> Website Clicks</span>
                <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-[#facc15]" /> Call Clicks</span>
                <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-[#a855f7]" /> Direction Requests</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
