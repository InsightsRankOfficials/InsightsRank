import { useState, useMemo } from "react";
import {
  Download,
  Filter,
  MapPin,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
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
  INSIGHTS_STORE_LIST,
  type StoreInsightItem,
} from "@/data/performance-analytics";
import {
  PerformanceAdvancedFilterModal,
  type PerformanceFilterState,
} from "@/components/performance/performance-advanced-filter-modal";

type SortField = keyof StoreInsightItem;
type SortOrder = "asc" | "desc";

export function PerformanceInsightsTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);
  const [filterState, setFilterState] = useState<PerformanceFilterState>({});

  // Sorting state
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Filter & Sort Logic
  const filteredAndSortedStores = useMemo(() => {
    let list = [...INSIGHTS_STORE_LIST];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.storeName.toLowerCase().includes(q) ||
          s.address.toLowerCase().includes(q) ||
          s.storeCode.toLowerCase().includes(q) ||
          (s.city && s.city.toLowerCase().includes(q)) ||
          (s.state && s.state.toLowerCase().includes(q))
      );
    }

    // Advanced modal filters
    if (filterState.storeName?.val) {
      const names = filterState.storeName.val.split(",").map((n) => n.trim().toLowerCase());
      list = list.filter((s) => names.some((n) => s.storeName.toLowerCase().includes(n)));
    }
    if (filterState.storeCode?.val) {
      const codes = filterState.storeCode.val.split(",").map((c) => c.trim().toLowerCase());
      list = list.filter((s) => codes.some((c) => s.storeCode.toLowerCase().includes(c)));
    }
    if (filterState.city?.val) {
      const cities = filterState.city.val.split(",").map((c) => c.trim().toLowerCase());
      list = list.filter((s) => s.city && cities.some((c) => s.city!.toLowerCase().includes(c)));
    }
    if (filterState.state?.val) {
      const states = filterState.state.val.split(",").map((st) => st.trim().toLowerCase());
      list = list.filter((s) => s.state && states.some((st) => s.state!.toLowerCase().includes(st)));
    }
    if (filterState.tags?.val && filterState.tags.val !== "All Tags") {
      list = list.filter((s) => s.tags === filterState.tags?.val);
    }
    if (filterState.storeStatus?.val && filterState.storeStatus.val !== "All Status") {
      list = list.filter((s) => s.status === filterState.storeStatus?.val);
    }

    // Sorting
    list.sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === "number" && typeof valB === "number") {
        return sortOrder === "asc" ? valA - valB : valB - valA;
      }
      const strA = String(valA || "").toLowerCase();
      const strB = String(valB || "").toLowerCase();
      return sortOrder === "asc" ? strA.localeCompare(strB) : strB.localeCompare(strA);
    });

    return list;
  }, [searchQuery, filterState, sortField, sortOrder]);

  // Paginated Stores
  const totalItems = filteredAndSortedStores.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(totalItems, startIndex + pageSize);
  const paginatedStores = useMemo(() => {
    return filteredAndSortedStores.slice(startIndex, endIndex);
  }, [filteredAndSortedStores, startIndex, endIndex]);

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "ID,Store Name,Store Code,Address,Desktop Search,Mobile Search,Desktop Maps,Mobile Maps,Website Clicks,Call Clicks,Direction Requests\n" +
      filteredAndSortedStores
        .map(
          (s) =>
            `"${s.id}","${s.storeName}","${s.storeCode}","${s.address}","${s.desktopSearch}","${s.mobileSearch}","${s.desktopMaps}","${s.mobileMaps}","${s.websiteClicks}","${s.callClicks}","${s.directionRequests}"`
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `performance_insights_report_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Performance Insights data exported to CSV!");
  };

  const handleApplyModalFilters = (filters: PerformanceFilterState, count: number) => {
    setFilterState(filters);
    setActiveFilterCount(count);
    setCurrentPage(1);
    toast.success(`Applied ${count} advanced filter(s)`);
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="size-3 text-muted-foreground/50 ml-1 inline" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="size-3 text-blue-400 ml-1 inline" />
    ) : (
      <ArrowDown className="size-3 text-blue-400 ml-1 inline" />
    );
  };

  return (
    <div className="rounded-2xl bg-card dark:bg-[#141416] p-6 sm:p-8 space-y-6 shadow-xl border border-border">
      {/* Header & Actions Bar matching Screenshot 2 */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Insights</h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Granular store-level breakdown of search, maps, and action performance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative min-w-[220px]">
            <Search className="size-3.5 text-muted-foreground absolute left-2.5 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search store name or city..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="h-8 w-full rounded-md bg-background dark:bg-[#121214] border border-border dark:border-[#27272a] hover:border-[#3f3f46] pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
            />
          </div>

          {/* Advanced Filter Trigger matching Reviews (Icon + Badge only) */}
          <button
            onClick={() => setFilterModalOpen(true)}
            className="h-8 border-border dark:border-[#3f3f46] bg-background dark:bg-[#18181b] hover:bg-secondary/40 text-xs text-foreground cursor-pointer gap-1.5 px-3 transition-colors rounded-md border flex items-center"
            title="Advanced Filter"
          >
            <Filter className="size-3.5 text-muted-foreground" />
            <span className="relative flex size-4 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-black tnum">
              {activeFilterCount}
            </span>
          </button>

          <Button
            onClick={handleExport}
            className="h-8 bg-blue-500 hover:bg-blue-600 text-black font-bold text-xs px-4 cursor-pointer gap-1.5 shadow-sm rounded-md"
          >
            <Download className="size-3.5" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Main Insights Table */}
      <div className="panel p-4 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border dark:border-[#27272a] bg-secondary/30 text-muted-foreground font-semibold">
                <th
                  onClick={() => handleSort("id")}
                  className="py-2.5 px-3 cursor-pointer select-none hover:text-foreground"
                >
                  # {renderSortIcon("id")}
                </th>
                <th
                  onClick={() => handleSort("storeName")}
                  className="py-2.5 px-3 min-w-[280px] cursor-pointer select-none hover:text-foreground"
                >
                  Store Name {renderSortIcon("storeName")}
                </th>
                <th
                  onClick={() => handleSort("storeCode")}
                  className="py-2.5 px-3 cursor-pointer select-none hover:text-foreground"
                >
                  Store Code {renderSortIcon("storeCode")}
                </th>
                <th
                  onClick={() => handleSort("desktopSearch")}
                  className="py-2.5 px-3 text-center cursor-pointer select-none hover:text-foreground"
                >
                  Desktop Search {renderSortIcon("desktopSearch")}
                </th>
                <th
                  onClick={() => handleSort("mobileSearch")}
                  className="py-2.5 px-3 text-center cursor-pointer select-none hover:text-foreground"
                >
                  Mobile Search {renderSortIcon("mobileSearch")}
                </th>
                <th
                  onClick={() => handleSort("desktopMaps")}
                  className="py-2.5 px-3 text-center cursor-pointer select-none hover:text-foreground"
                >
                  Desktop Maps {renderSortIcon("desktopMaps")}
                </th>
                <th
                  onClick={() => handleSort("mobileMaps")}
                  className="py-2.5 px-3 text-center cursor-pointer select-none hover:text-foreground"
                >
                  Mobile Maps {renderSortIcon("mobileMaps")}
                </th>
                <th
                  onClick={() => handleSort("websiteClicks")}
                  className="py-2.5 px-3 text-center cursor-pointer select-none hover:text-foreground"
                >
                  Website Clicks {renderSortIcon("websiteClicks")}
                </th>
                <th
                  onClick={() => handleSort("callClicks")}
                  className="py-2.5 px-3 text-center cursor-pointer select-none hover:text-foreground"
                >
                  Call Clicks {renderSortIcon("callClicks")}
                </th>
                <th
                  onClick={() => handleSort("directionRequests")}
                  className="py-2.5 px-3 text-center cursor-pointer select-none hover:text-foreground"
                >
                  Direction Requests {renderSortIcon("directionRequests")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {paginatedStores.map((item) => (
                <tr key={item.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="py-3 px-3 text-muted-foreground font-mono">{item.id}</td>
                  <td className="py-3 px-3">
                    <p className="font-bold text-foreground text-xs">{item.storeName}</p>
                    <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5 max-w-md">
                      {item.address}
                    </p>
                    <button
                      onClick={() => toast.info(`Viewing ${item.storeName} on map`)}
                      className="text-[10px] text-blue-500 hover:underline flex items-center gap-1 mt-1 cursor-pointer font-semibold"
                    >
                      <MapPin className="size-2.5" />
                      <span>View on Map</span>
                    </button>
                  </td>
                  <td className="py-3 px-3 font-mono text-blue-400 text-[11px]">{item.storeCode}</td>
                  <td className="py-3 px-3 text-center font-bold text-foreground tnum">{item.desktopSearch}</td>
                  <td className="py-3 px-3 text-center font-bold text-foreground tnum">{item.mobileSearch}</td>
                  <td className="py-3 px-3 text-center font-bold text-foreground tnum">{item.desktopMaps}</td>
                  <td className="py-3 px-3 text-center font-bold text-foreground tnum">{item.mobileMaps}</td>
                  <td className="py-3 px-3 text-center font-bold text-foreground tnum">{item.websiteClicks}</td>
                  <td className="py-3 px-3 text-center font-bold text-foreground tnum">{item.callClicks}</td>
                  <td className="py-3 px-3 text-center font-bold text-foreground tnum">{item.directionRequests}</td>
                </tr>
              ))}

              {paginatedStores.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-xs text-muted-foreground">
                    No store insights found matching the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-border dark:border-[#27272a] text-xs">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-[11px]">Rows per page:</span>
            <Select
              value={String(pageSize)}
              onValueChange={(val) => {
                setPageSize(Number(val));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-7 w-16 bg-background dark:bg-[#18181b] border-border dark:border-[#27272a] text-xs cursor-pointer">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent className="bg-popover dark:bg-[#18181b] border-border dark:border-[#27272a] text-xs">
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-muted-foreground text-[11px] ml-2">
              Showing <span className="font-semibold text-foreground">{totalItems > 0 ? startIndex + 1 : 0}</span> -{" "}
              <span className="font-semibold text-foreground">{endIndex}</span> of{" "}
              <span className="font-semibold text-foreground">{totalItems}</span> items
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-7 w-7 p-0 border-border dark:border-[#27272a] disabled:opacity-40"
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
                    : "bg-background dark:bg-[#18181b] text-muted-foreground hover:text-foreground border border-border dark:border-[#27272a]"
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
              className="h-7 w-7 p-0 border-border dark:border-[#27272a] disabled:opacity-40"
            >
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Advanced Filter Modal */}
      <PerformanceAdvancedFilterModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        onApplyFilters={handleApplyModalFilters}
      />
    </div>
  );
}
