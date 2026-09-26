import { useState } from "react";
import { EmptyTableRow } from "@/components/ui/empty-state";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  MapPin,
  Minus,
  Settings,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RANK_REPORTS_LIST, type RankReportStoreItem } from "@/data/rankings-analytics";
import { RankingsAdvancedFilterModal } from "./rankings-advanced-filter-modal";

interface RankReportsTabProps {
  onSelectStore: (store: RankReportStoreItem) => void;
  onConfigureReport?: () => void;
}

export function RankReportsTab({
  onSelectStore,
  onConfigureReport,
}: RankReportsTabProps) {
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const totalItems = RANK_REPORTS_LIST.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const paginatedStores = RANK_REPORTS_LIST.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const startItem = totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="rounded-2xl bg-card dark:bg-[#141416] p-6 sm:p-8 space-y-6 shadow-xl border border-border">
      {/* Title & Top Right Actions matching Screenshot 3 */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">
            Local Rank Report
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Generate and configure localized Google Search & Maps rank reports for your locations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Advanced Filter Modal Trigger */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilterModalOpen(true)}
            className="h-8 border-border bg-background hover:bg-secondary text-xs text-foreground cursor-pointer gap-1.5 px-3"
          >
            <Filter className="size-3.5 text-muted-foreground" />
            <span className="flex size-4 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-black tnum">
              {activeFilterCount}
            </span>
          </Button>

          {/* Configure Report Trigger */}
          <Button
            size="sm"
            onClick={onConfigureReport}
            className="h-8 bg-blue-500 hover:bg-blue-600 text-black font-semibold text-xs px-4 cursor-pointer gap-1.5"
          >
            <Settings className="size-3.5" />
            <span>Configure</span>
          </Button>
        </div>
      </div>

      {/* Local Rank Reports Table */}
      <div className="panel p-4 sm:p-5 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-secondary/30 text-muted-foreground font-semibold">
                <th className="py-2.5 px-3 w-8">#</th>
                <th className="py-2.5 px-3 min-w-[220px]">Store Name</th>
                <th className="py-2.5 px-3">Store Code</th>
                <th className="py-2.5 px-3 text-center">Keyword Count</th>
                <th className="py-2.5 px-3 text-center">Average Rank</th>
                <th className="py-2.5 px-3">Last Run At</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {paginatedStores.length === 0 ? (
                <EmptyTableRow
                  colSpan={7}
                  description="No rank reports match your search criteria."
                />
              ) : (
                paginatedStores.map((store) => (
                <tr
                  key={store.id}
                  onClick={() => onSelectStore(store)}
                  className="hover:bg-secondary/20 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-3 font-medium text-muted-foreground tnum">
                    {store.rank}
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-bold text-foreground text-xs">{store.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate max-w-sm">
                      {store.address}
                    </p>
                    <a
                      href="#map"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-[10px] text-blue-500 hover:underline font-semibold mt-0.5"
                    >
                      <MapPin className="size-2.5" />
                      <span>View on Map</span>
                    </a>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-muted-foreground">
                    {store.code}
                  </td>
                  <td className="py-3 px-3 text-center tnum font-semibold text-foreground">
                    {store.keywordCount}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-bold tnum text-xs ${
                        store.changeType === "up"
                          ? "text-emerald-400"
                          : store.changeType === "down"
                          ? "text-red-400"
                          : "text-muted-foreground"
                      }`}
                    >
                      <span>{store.avgRank}</span>
                      {store.changeType === "up" && (
                        <span className="flex items-center gap-0.5 text-[10px] text-emerald-400">
                          <TrendingUp className="size-2.5" />
                          <span>{store.rankChange}</span>
                        </span>
                      )}
                      {store.changeType === "down" && (
                        <span className="flex items-center gap-0.5 text-[10px] text-red-400">
                          <TrendingDown className="size-2.5" />
                          <span>{store.rankChange}</span>
                        </span>
                      )}
                      {store.changeType === "neutral" && (
                        <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                          <Minus className="size-2.5" />
                          <span>{store.rankChange}</span>
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-muted-foreground text-[11px] tnum">
                    {store.lastRunDate}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectStore(store);
                      }}
                      className="h-7 px-3 text-[11px] border-blue-500/40 text-blue-500 hover:bg-blue-500/10 font-semibold cursor-pointer gap-1.5"
                    >
                      <Eye className="size-3" />
                      <span>View</span>
                    </Button>
                  </td>
                </tr>
              ))
            )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-border text-xs">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-[11px]">Rows per page:</span>
            <Select
              value={String(pageSize)}
              onValueChange={(val) => {
                setPageSize(Number(val));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-7 w-16 bg-background border-border text-foreground text-xs cursor-pointer">
                <SelectValue placeholder="5" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border text-popover-foreground text-xs">
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-muted-foreground text-[11px] ml-2">
              Showing <span className="font-semibold text-foreground">{startItem}</span> -{" "}
              <span className="font-semibold text-foreground">{endItem}</span> of{" "}
              <span className="font-semibold text-foreground">{totalItems}</span> items
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-7 w-7 p-0 border-border text-foreground hover:bg-secondary disabled:opacity-40"
            >
              <ChevronLeft className="size-3.5" />
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                onClick={() => setCurrentPage(pg)}
                className={`h-7 min-w-[28px] px-1.5 rounded text-xs font-semibold cursor-pointer transition-colors ${
                  currentPage === pg
                    ? "bg-blue-500 text-black font-bold"
                    : "bg-background text-muted-foreground hover:text-foreground border border-border hover:bg-secondary"
                }`}
              >
                {pg}
              </button>
            ))}

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="h-7 w-7 p-0 border-border text-foreground hover:bg-secondary disabled:opacity-40"
            >
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Advanced Filter Modal */}
      <RankingsAdvancedFilterModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        type="reports"
        onApplyFilters={(count) => setActiveFilterCount(count)}
      />
    </div>
  );
}
