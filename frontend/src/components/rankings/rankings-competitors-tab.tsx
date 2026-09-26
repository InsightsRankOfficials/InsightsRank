import { useState, useMemo } from "react";
import { EmptyTableRow } from "@/components/ui/empty-state";
import {
  Target,
  Plus,
  Search,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Award,
  Globe,
  Minus,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  COMPETITOR_KPI_STATS,
  COMPETITOR_TREND_CHART_DATA,
  INITIAL_TRACKED_COMPETITORS,
  type TrackedCompetitorItem,
} from "@/data/rankings-competitors-data";
import {
  COMPETITOR_MATRIX_DATA,
  KEYWORD_TIMESERIES_DATA,
  TOP_COMPETITORS_ON_KEYWORDS,
} from "@/data/rankings-analytics";

import { evaluateDateRange } from "@/lib/date-range";

export function RankingsCompetitorsTab() {
  const [competitors, setCompetitors] = useState<TrackedCompetitorItem[]>(INITIAL_TRACKED_COMPETITORS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKeyword, setSelectedKeyword] = useState("all");
  const [dateRange, setDateRange] = useState("01 Apr 2026 - 17 Sep 2026");

  const { hasData, multiplier } = useMemo(() => evaluateDateRange(dateRange), [dateRange]);

  const kpiStats = useMemo(() => {
    if (!hasData) {
      return [
        { label: "Visibility Share", value: "0%", change: "0%", subtitle: "No data available" },
        { label: "Average Brand Rank", value: "#0", change: "+0.0", subtitle: "No data available" },
        { label: "Total Competitors", value: "0", change: "0", subtitle: "No data available" },
        { label: "Rank Volatility", value: "0.0", change: "Flat", subtitle: "No data available" },
      ];
    }
    const scaledShare = (18.4 * Math.min(1.2, multiplier * 1.1)).toFixed(1);
    return [
      { label: "Visibility Share", value: `${scaledShare}%`, change: "+2.4%", subtitle: "vs Portfolio Share" },
      { label: "Average Brand Rank", value: "#8.4", change: "+0.5", subtitle: "Top 10 Average" },
      { label: "Total Competitors", value: `${Math.round(48 * Math.min(1, multiplier * 1.2))}`, change: "+3", subtitle: "Tracked in City" },
      { label: "Rank Volatility", value: "1.2", change: "Low", subtitle: "Standard Deviation" },
    ];
  }, [hasData, multiplier]);

  const chartData = useMemo(() => {
    if (!hasData) return [];
    return COMPETITOR_TREND_CHART_DATA;
  }, [hasData]);

  // Add Competitor Modal
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const [newWebsite, setNewWebsite] = useState("");

  const filteredCompetitors = useMemo(() => {
    const list = competitors.filter((c) =>
      c.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.website.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (!hasData) {
      return list.map((item) => ({
        ...item,
        avgRank: 0,
        marketShare: "0%",
        reviewCount: 0,
        avgRating: 0,
      }));
    }
    return list.map((item) => ({
      ...item,
      reviewCount: Math.round(item.reviewCount * Math.min(1, multiplier)),
    }));
  }, [competitors, searchQuery, hasData, multiplier]);

  const handleAddCompetitor = () => {
    if (!newBrandName.trim()) {
      toast.error("Please enter a brand name.");
      return;
    }
    const newComp: TrackedCompetitorItem = {
      id: `comp-${Date.now()}`,
      brandName: newBrandName,
      website: newWebsite || "https://example.com",
      avgRank: 8.5,
      marketShare: "8.0%",
      reviewCount: 450,
      avgRating: 4.3,
      status: "Active",
      trajectory: "Constant",
      keywordsCovered: 4,
    };
    setCompetitors((prev) => [...prev, newComp]);
    toast.success(`Competitor "${newBrandName}" added to tracking.`);
    setNewBrandName("");
    setNewWebsite("");
    setAddModalOpen(false);
  };

  return (
    <div className="rounded-2xl bg-card dark:bg-[#141416] p-6 sm:p-8 space-y-6 shadow-xl border border-border">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <span>Competitor Analysis</span>
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Compare search ranking visibility, SERP market share, and performance against key competitors.
          </p>
        </div>

        <Button
          onClick={() => setAddModalOpen(true)}
          className="h-8 bg-blue-500 hover:bg-blue-600 text-black font-bold text-xs px-4 cursor-pointer gap-1.5 shadow-sm"
        >
          <Plus className="size-4" />
          <span>Add Competitor</span>
        </Button>
      </div>

      {/* 4 Metric KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiStats.map((stat) => (
          <div key={stat.label} className="panel p-4 flex flex-col justify-between space-y-2">
            <div className="flex items-center gap-1.5 text-blue-500">
              <Target className="size-3.5" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-500">
                {stat.label}
              </span>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <p className="tnum text-2xl font-extrabold tracking-tight text-foreground">
                  {stat.value}
                </p>
                <span className="text-xs font-bold text-emerald-400 tnum">
                  {stat.change}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {stat.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Toolbar */}
      <div className="panel p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <Search className="size-3.5 text-muted-foreground absolute left-2.5 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search competitor brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-full rounded bg-background border border-border pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Keyword Selector */}
          <Select value={selectedKeyword} onValueChange={setSelectedKeyword}>
            <SelectTrigger className="h-8 w-44 bg-background border-border text-xs cursor-pointer">
              <SelectValue placeholder="Keywords" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border text-popover-foreground text-xs">
              <SelectItem value="all">All Keywords</SelectItem>
              <SelectItem value="footwear">footwear shop near me</SelectItem>
              <SelectItem value="ladies">ladies shoes</SelectItem>
              <SelectItem value="men">men shoes</SelectItem>
              <SelectItem value="sports">sports shoes</SelectItem>
            </SelectContent>
          </Select>

          {/* Date Range Picker */}
          <DateRangePicker value={dateRange} onChange={setDateRange} />
        </div>
      </div>

      {/* Competitor Rank Trend Line Chart */}
      <div className="panel p-4 sm:p-5 space-y-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="size-4 text-blue-500" />
          <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
            Competitor Rank Comparison Over Time
          </h3>
        </div>

        <div className="relative h-64 w-full">
          <p className="absolute -left-2 top-0 text-[10px] text-muted-foreground z-10">
            Average Rank
          </p>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
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
                domain={[1, 15]}
                ticks={[1, 5, 10, 15]}
                tickFormatter={(v) => (v === 15 ? "15+" : String(v))}
                tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  fontSize: 12,
                  color: "var(--popover-foreground)",
                }}
              />
              <Line type="monotone" dataKey="demoPvtLtd" name="Demo Pvt Ltd" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: "#3b82f6", r: 4 }} />
              <Line type="monotone" dataKey="bata" name="Bata" stroke="#06b6d4" strokeWidth={2} dot={{ fill: "#06b6d4", r: 3 }} />
              <Line type="monotone" dataKey="comet" name="Comet" stroke="#22c55e" strokeWidth={2} dot={{ fill: "#22c55e", r: 3 }} />
              <Line type="monotone" dataKey="redTape" name="Red Tape" stroke="#ef4444" strokeWidth={2} dot={{ fill: "#ef4444", r: 3 }} />
              <Line type="monotone" dataKey="paragon" name="Paragon" stroke="#a855f7" strokeWidth={2} dot={{ fill: "#a855f7", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Brand Rank Comparison Matrix */}
      <div className="panel p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <h3 className="text-xs font-bold text-blue-500 uppercase tracking-wide flex items-center gap-1.5">
            <Award className="size-4" />
            <span>Brand Rank Comparison Matrix</span>
          </h3>
          <span className="text-[10px] text-muted-foreground">Updated Today</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/30 text-muted-foreground font-semibold">
                <th className="py-2.5 px-3">Brand Name</th>
                <th className="py-2.5 px-3 text-center">Avg Rank</th>
                <th className="py-2.5 px-3 text-center">SERP Share</th>
                <th className="py-2.5 px-3 text-center">Reviews</th>
                <th className="py-2.5 px-3 text-center">Rating</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Trajectory</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredCompetitors.length === 0 ? (
                <EmptyTableRow
                  colSpan={7}
                  description="No competitor data matches your filter criteria."
                />
              ) : (
                filteredCompetitors.map((item) => (
                <tr key={item.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="py-3 px-3">
                    <p className={`font-bold text-xs ${item.id === "comp-1" ? "text-blue-400 font-extrabold" : "text-foreground"}`}>
                      {item.brandName}
                    </p>
                    <a
                      href={item.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-muted-foreground hover:text-blue-400 flex items-center gap-1 mt-0.5"
                    >
                      <Globe className="size-2.5" />
                      <span>{item.website}</span>
                    </a>
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-foreground tnum">
                    #{item.avgRank}
                  </td>
                  <td className="py-3 px-3 text-center font-semibold text-blue-400 tnum">
                    {item.marketShare}
                  </td>
                  <td className="py-3 px-3 text-center text-muted-foreground tnum">
                    {item.reviewCount.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-yellow-400 tnum">
                    ★ {item.avgRating}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold tnum ${
                        item.trajectory === "Improved"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          : item.trajectory === "Declined"
                          ? "bg-red-500/10 text-red-400 border border-red-500/30"
                          : "bg-secondary text-muted-foreground border border-border"
                      }`}
                    >
                      {item.trajectory === "Improved" && <TrendingUp className="size-3" />}
                      {item.trajectory === "Declined" && <TrendingDown className="size-3" />}
                      {item.trajectory === "Constant" && <Minus className="size-3" />}
                      <span>{item.trajectory}</span>
                    </span>
                  </td>
                </tr>
              ))
            )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Other Top Competitors on Selected Keywords Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-blue-500 uppercase tracking-wide">
          Other Top Competitors On Selected Keywords
        </h3>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 items-stretch">
          {TOP_COMPETITORS_ON_KEYWORDS.map((card) => (
            <div key={card.keyword} className="panel p-3.5 flex flex-col justify-between space-y-3">
              <span className="text-xs font-bold text-blue-500 truncate block border-b border-border pb-2">
                {card.keyword}
              </span>

              <div className="space-y-2 flex-1">
                <div className="grid grid-cols-[1fr_50px_65px] text-[10px] font-bold text-muted-foreground pb-1 border-b border-border">
                  <span>Brand</span>
                  <span className="text-center">Avg Rank</span>
                  <span className="text-right">Trajectory</span>
                </div>

                {card.competitors.map((comp) => (
                  <div key={comp.brand} className="grid grid-cols-[1fr_50px_65px] items-center text-xs">
                    <span className="font-semibold text-foreground truncate text-[11px]">
                      {comp.brand}
                    </span>
                    <span className="text-center font-bold text-foreground tnum text-[11px]">
                      {comp.avgRank}
                    </span>
                    <span className="text-right text-[10px] text-muted-foreground truncate">
                      {comp.trajectory}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Competitor Modal */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="max-w-md bg-card dark:bg-[#121214] border-border text-foreground p-5 sm:p-6 shadow-2xl rounded-xl">
          <DialogHeader className="border-b border-border pb-3">
            <DialogTitle className="text-base font-bold text-foreground">
              Add Competitor to Track
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 my-3 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground">Competitor Brand Name</label>
              <input
                type="text"
                placeholder="e.g. Metro Shoes"
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
                className="h-8 w-full rounded bg-background border border-border px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground">Website URL (Optional)</label>
              <input
                type="text"
                placeholder="https://metroshoes.net"
                value={newWebsite}
                onChange={(e) => setNewWebsite(e.target.value)}
                className="h-8 w-full rounded bg-background border border-border px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <DialogFooter className="border-t border-border pt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAddModalOpen(false)}
              className="h-8 border-border bg-background text-foreground hover:bg-secondary text-xs font-semibold cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleAddCompetitor}
              className="h-8 bg-blue-500 hover:bg-blue-600 text-black font-bold text-xs px-4 cursor-pointer"
            >
              Add Competitor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
