import { useState } from "react";
import {
  CheckCircle2,
  ChevronRight,
  Filter,
  Home,
  TrendingDown,
  TrendingUp,
  Minus,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  COMPETITOR_MATRIX_DATA,
  KEYWORD_TIMESERIES_DATA,
  RANK_REPORTS_LIST,
  TOP_COMPETITORS_ON_KEYWORDS,
  type RankReportStoreItem,
} from "@/data/rankings-analytics";
import { RankingsAdvancedFilterModal } from "./rankings-advanced-filter-modal";

interface RankReportDetailViewProps {
  initialStore?: RankReportStoreItem | undefined;
  onBack: () => void;
}

export function RankReportDetailView({
  initialStore,
  onBack,
}: RankReportDetailViewProps) {
  const [selectedStoreId, setSelectedStoreId] = useState<string>(
    initialStore?.id ?? "store-3"
  );
  const [viewMode, setViewMode] = useState<"timeseries" | "competitor">("timeseries");

  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200 pb-16">
      {/* Breadcrumb Navigation matching Locations section */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground px-1 pb-1">
        <Home
          className="size-3.5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
          onClick={onBack}
        />
        <ChevronRight className="size-3 text-muted-foreground/60" />
        <span onClick={onBack} className="cursor-pointer hover:text-foreground font-medium">
          Local Rank Report
        </span>
        <ChevronRight className="size-3 text-muted-foreground/60" />
        <span className="font-semibold text-foreground">Rank Report Detail</span>
      </div>

      {/* Rounded Card Container wrapping main content */}
      <div className="rounded-2xl bg-card dark:bg-[#141416] p-6 sm:p-8 space-y-6 shadow-xl border border-border">
        {/* Top Header & Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">

        {/* Filter Action Trigger */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilterModalOpen(true)}
            className="h-8 border-border dark:border-[#3f3f46] bg-card dark:bg-[#18181b] hover:bg-secondary text-xs text-foreground cursor-pointer gap-1.5 px-3"
          >
            <Filter className="size-3.5 text-muted-foreground" />
            <span className="flex size-4 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-black tnum">
              {activeFilterCount}
            </span>
          </Button>
        </div>
      </div>

      {/* Store Selector Dropdown (Back to List button removed per user request) */}
      <div className="flex flex-wrap items-center gap-3">
        <Select value={selectedStoreId} onValueChange={setSelectedStoreId}>
          <SelectTrigger className="h-9 min-w-[320px] max-w-full bg-background border-border dark:border-[#3f3f46] text-xs font-semibold cursor-pointer">
            <SelectValue placeholder="Select Store" />
          </SelectTrigger>
          <SelectContent className="bg-popover dark:bg-[#18181b] border-border dark:border-[#27272a] text-popover-foreground text-xs">
            {RANK_REPORTS_LIST.map((store) => (
              <SelectItem
                key={store.id}
                value={store.id}
                className="cursor-pointer"
              >
                {store.name} ({store.code}), {store.address.split(",")[3] ?? "IN"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* View Mode Toggle Buttons */}
      <div className="flex items-center gap-2 bg-secondary/30 p-1 rounded-lg border border-border w-fit">
        <button
          onClick={() => setViewMode("timeseries")}
          className={`px-4 py-1.5 rounded text-xs font-semibold cursor-pointer transition-all ${
            viewMode === "timeseries"
              ? "bg-blue-500 text-black shadow-sm font-bold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Timeseries View
        </button>
        <button
          onClick={() => setViewMode("competitor")}
          className={`px-4 py-1.5 rounded text-xs font-semibold cursor-pointer transition-all ${
            viewMode === "competitor"
              ? "bg-blue-500 text-black shadow-sm font-bold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Competitor View
        </button>
      </div>

      {/* VIEW MODE A: TIMESERIES VIEW */}
      {viewMode === "timeseries" && (
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-bold text-foreground">Timeseries View :</span> This dashboard provides a detailed view of your store&apos;s search visibility over time, allowing you to track improvements and trends.
          </p>

          <div className="panel p-4 sm:p-5 space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border bg-secondary/30 text-muted-foreground font-semibold">
                    <th className="py-2.5 px-4 font-bold text-foreground">Keyword</th>
                    <th className="py-2.5 px-4 text-center">Apr 01</th>
                    <th className="py-2.5 px-4 text-center">May 01</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {KEYWORD_TIMESERIES_DATA.map((row) => (
                    <tr
                      key={row.keyword}
                      className="hover:bg-secondary/20 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 font-semibold text-blue-500 flex items-center gap-2">
                        <span className="size-2 rounded-full bg-blue-500 shrink-0" />
                        <span>{row.keyword}</span>
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-foreground tnum">
                        {row.apr01Rank}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded font-bold tnum text-xs ${
                            row.status === "improved"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                              : row.status === "declined"
                              ? "bg-red-500/10 text-red-400 border border-red-500/30"
                              : "bg-secondary text-muted-foreground border border-border"
                          }`}
                        >
                          {row.status === "improved" && (
                            <CheckCircle2 className="size-3 text-emerald-400" />
                          )}
                          {row.status === "declined" && (
                            <TrendingDown className="size-3 text-red-400" />
                          )}
                          {row.status === "constant" && (
                            <Minus className="size-3 text-muted-foreground" />
                          )}
                          <span>{row.may01Rank}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom Legend */}
            <div className="flex items-center gap-6 text-xs pt-3 border-t border-border">
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <span className="size-2.5 rounded-full bg-emerald-400" /> Rank Improved
              </span>
              <span className="flex items-center gap-1.5 text-red-400 font-medium">
                <span className="size-2.5 rounded-full bg-red-400" /> Rank Declined
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                <span className="size-2.5 rounded-full bg-slate-400" /> Rank Constant
              </span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE B: COMPETITOR VIEW */}
      {viewMode === "competitor" && (
        <div className="space-y-5">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-bold text-foreground">Competitor View :</span> This dashboard shows how your store ranks for key search terms over time, helping you track search visibility improvements across multiple locations and compare with competitors.
          </p>

          {/* Top Brand Rank Matrix Table */}
          <div className="panel p-4 sm:p-5 space-y-3">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border bg-secondary/30 text-muted-foreground font-semibold">
                    <th className="py-2.5 px-3 min-w-[120px]">Brands</th>
                    {KEYWORD_TIMESERIES_DATA.map((kw) => (
                      <th key={kw.keyword} className="py-2.5 px-3 text-center min-w-[140px]" colSpan={2}>
                        <span className="text-blue-500 font-bold block truncate">{kw.keyword}</span>
                        <div className="grid grid-cols-2 text-[10px] text-muted-foreground mt-0.5">
                          <span>Avg Rank</span>
                          <span>Trajectory</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {COMPETITOR_MATRIX_DATA.map((b) => (
                    <tr
                      key={b.brandName}
                      className="hover:bg-secondary/20 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-3">
                        <p className={`font-bold text-xs ${b.isSelf ? "text-blue-400" : "text-foreground"}`}>
                          {b.brandName}
                        </p>
                      </td>
                      {KEYWORD_TIMESERIES_DATA.map((kw) => {
                        const cell = b.keywords[kw.keyword] ?? {
                          avgRank: "-",
                          trajectory: "Not on list",
                        };
                        return (
                          <td key={kw.keyword} className="py-3 px-3 text-center" colSpan={2}>
                            <div className="grid grid-cols-2 items-center text-[11px] gap-1">
                              <span className="font-semibold text-foreground tnum">{cell.avgRank}</span>
                              <span className="text-[10px] text-muted-foreground flex items-center justify-center gap-1">
                                <Minus className="size-2.5 text-muted-foreground" />
                                <span>{cell.trajectory}</span>
                              </span>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Cards: Other Top Competitors On Selected Keywords */}
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
                    <div className="grid grid-cols-[1fr_50px_65px] text-[10px] font-bold text-muted-foreground pb-1">
                      <span>Brand</span>
                      <span>Avg Rank</span>
                      <span>Trajectory</span>
                    </div>

                    {card.competitors.map((c, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-[1fr_50px_65px] items-center text-[11px] py-1 border-b border-border/40 last:border-0"
                      >
                        <div className="min-w-0 pr-1">
                          <p className="font-bold text-foreground text-[11px] truncate">{c.brand}</p>
                          {c.reviewsCount && (
                            <p className="text-[9px] text-muted-foreground truncate">★ {c.reviewsCount}</p>
                          )}
                        </div>
                        <span className="tnum font-bold text-foreground">{c.avgRank}</span>
                        <span
                          className={`inline-flex items-center gap-0.5 text-[10px] font-semibold ${
                            c.trajectoryType === "up"
                              ? "text-emerald-400"
                              : c.trajectoryType === "down"
                              ? "text-red-400"
                              : c.trajectoryType === "new"
                              ? "text-blue-400"
                              : "text-muted-foreground"
                          }`}
                        >
                          {c.trajectoryType === "up" && <TrendingUp className="size-2.5" />}
                          {c.trajectoryType === "down" && <TrendingDown className="size-2.5" />}
                          {c.trajectoryType === "new" && <Sparkles className="size-2.5" />}
                          {c.trajectoryType === "neutral" && <Minus className="size-2.5" />}
                          <span>{c.trajectory}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Rankings Advanced Filter Modal */}
      <RankingsAdvancedFilterModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        type="detail"
        onApplyFilters={(count) => setActiveFilterCount(count)}
      />
    </div>
  </div>
);
}
