import React, { useState } from "react";
import { EmptyTableRow } from "@/components/ui/empty-state";
import { CUSTOMER_REVIEW_LOGS, ReviewLogItem, downloadSummarizedReport } from "@/data/review-assistant-analytics";
import {
  Filter,
  Download,
  Eye,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Search,
  FileText,
  BarChart3,
  Smartphone,
  Monitor,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdvancedFilterModal } from "@/components/reviews/advanced-filter-modal";
import { ReviewJourneyDetails } from "@/components/review-assistant/review-journey-details";

interface ReviewLogsTabProps {
  onViewLog?: (log: ReviewLogItem | null) => void;
}

export function ReviewLogsTab({ onViewLog }: ReviewLogsTabProps) {
  const [logs] = useState<ReviewLogItem[]>(CUSTOMER_REVIEW_LOGS);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(30);

  // Selected Log for detail journey view inside tab
  const [viewingLog, setViewingLog] = useState<ReviewLogItem | null>(null);

  // Filter modal state
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  // Sorting
  const [sortField, setSortField] = useState<keyof ReviewLogItem>("dateTime");
  const [sortAsc, setSortAsc] = useState(false);

  const handleSort = (field: keyof ReviewLogItem) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const filteredLogs = logs.filter((l) => {
    const query = searchTerm.toLowerCase();
    return (
      l.storeName.toLowerCase().includes(query) ||
      l.storeCode.toLowerCase().includes(query) ||
      l.ipAddress.includes(query) ||
      l.status.toLowerCase().includes(query)
    );
  });

  const sortedLogs = [...filteredLogs].sort((a, b) => {
    const valA = String(a[sortField] || "").toLowerCase();
    const valB = String(b[sortField] || "").toLowerCase();
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedLogs.length / pageSize) || 1;
  const paginatedLogs = sortedLogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getStatusBadge = (status: ReviewLogItem["status"]) => {
    switch (status) {
      case "Generated":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
            Generated
          </span>
        );
      case "Started":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">
            Started
          </span>
        );
      case "Shared":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            Shared
          </span>
        );
    }
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Store Name", "Store Code", "Address", "Date Time", "IP Address", "Device", "Versions", "Status"];
    const rows = logs.map((l) => [l.id, l.storeName, l.storeCode, `"${l.address}"`, l.dateTime, l.ipAddress, l.device, l.versions, l.status]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `customer_review_logs_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleViewClick = (log: ReviewLogItem) => {
    setViewingLog(log);
    if (onViewLog) {
      onViewLog(log);
    }
  };

  const handleBackFromDetails = () => {
    setViewingLog(null);
    if (onViewLog) {
      onViewLog(null);
    }
  };

  // If viewing a log, render Review Journey Details page view!
  if (viewingLog) {
    return <ReviewJourneyDetails log={viewingLog} onBack={handleBackFromDetails} />;
  }

  return (
    <div className="rounded-2xl bg-card dark:bg-[#141416] p-6 sm:p-8 space-y-6 shadow-xl border border-border">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Customer Review Logs</h1>
          <p className="mt-0.5 text-xs text-muted-foreground">View and filter detailed customer review interaction logs</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Advanced Filter Button matching Reviews section */}
          <button
            onClick={() => setFilterModalOpen(true)}
            className="px-3 py-1.5 rounded-lg border border-border dark:border-[#27272a] bg-background dark:bg-[#121214] hover:bg-secondary/40 text-xs font-semibold text-foreground flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Filter className="size-3.5 text-muted-foreground" />
            <span>Filter</span>
            <span className="size-4 rounded-full bg-blue-400 text-black text-[10px] font-extrabold flex items-center justify-center tnum">
              {activeFilterCount}
            </span>
          </button>

          {/* Export Dropdown matching Reviews section UI */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="px-3.5 py-1.5 rounded-lg border border-border dark:border-[#27272a] bg-background dark:bg-[#121214] hover:bg-secondary/40 text-xs font-semibold text-foreground flex items-center gap-1.5 transition-colors cursor-pointer">
                <Download className="size-3.5 text-blue-500" />
                <span>Export</span>
                <ChevronDown className="size-3 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-72 bg-popover dark:bg-[#121214] border-border dark:border-[#27272a] text-foreground p-1.5 shadow-xl rounded-lg"
            >
              <DropdownMenuItem
                onClick={handleExportCSV}
                className="flex items-start gap-3 p-2.5 rounded-md cursor-pointer hover:bg-secondary/40 dark:hover:bg-[#18181b] focus:bg-secondary/40 dark:focus:bg-[#18181b] transition-colors"
              >
                <div className="p-1.5 rounded bg-blue-500/10 border border-blue-500/30 shrink-0 mt-0.5">
                  <FileText className="size-4 text-blue-500" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <p className="text-xs font-bold text-foreground">Detailed CSV Report</p>
                  <p className="text-[11px] text-muted-foreground leading-normal">
                    Comprehensive review logs with device and status
                  </p>
                </div>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-border dark:bg-[#27272a] my-1" />

              <DropdownMenuItem
                onClick={downloadSummarizedReport}
                className="flex items-start gap-3 p-2.5 rounded-md cursor-pointer hover:bg-secondary/40 dark:hover:bg-[#18181b] focus:bg-secondary/40 dark:focus:bg-[#18181b] transition-colors"
              >
                <div className="p-1.5 rounded bg-blue-500/10 border border-blue-500/30 shrink-0 mt-0.5">
                  <BarChart3 className="size-4 text-blue-500" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <p className="text-xs font-bold text-foreground">Summarized Report</p>
                  <p className="text-[11px] text-muted-foreground leading-normal">
                    Aggregated overview of customer engagement
                  </p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by store name, code, or IP..."
          className="w-full pl-9 pr-4 py-1.5 rounded-lg border border-border dark:border-[#27272a] bg-background dark:bg-[#121214] text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
        />
      </div>

      {/* Data Table */}
      <div className="rounded-xl border border-border dark:border-[#27272a] bg-card dark:bg-[#121214] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border dark:border-[#27272a] bg-secondary/30 text-muted-foreground font-semibold select-none">
                <th className="py-3 px-3 w-10 text-center">#</th>
                <th className="py-3 px-4 cursor-pointer hover:text-foreground" onClick={() => handleSort("storeName")}>
                  Store Name <span className="text-[10px] opacity-60">⇅</span>
                </th>
                <th className="py-3 px-3">Store Code</th>
                <th className="py-3 px-3 cursor-pointer hover:text-foreground" onClick={() => handleSort("dateTime")}>
                  Date & Time <span className="text-[10px] opacity-60">⇅</span>
                </th>
                <th className="py-3 px-3">IP Address</th>
                <th className="py-3 px-3 cursor-pointer hover:text-foreground" onClick={() => handleSort("device")}>
                  Device <span className="text-[10px] opacity-60">⇅</span>
                </th>
                <th className="py-3 px-3 cursor-pointer hover:text-foreground" onClick={() => handleSort("versions")}>
                  Versions <span className="text-[10px] opacity-60">⇅</span>
                </th>
                <th className="py-3 px-3 cursor-pointer hover:text-foreground" onClick={() => handleSort("status")}>
                  Status <span className="text-[10px] opacity-60">⇅</span>
                </th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border/50 text-foreground">
              {paginatedLogs.length === 0 ? (
                <EmptyTableRow
                  colSpan={8}
                  description="No review assistant logs match your search & filter criteria."
                />
              ) : (
                paginatedLogs.map((log, idx) => {
                const itemIndex = (currentPage - 1) * pageSize + idx + 1;
                return (
                  <tr key={log.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="py-3 px-3 text-center text-muted-foreground font-mono">{itemIndex}</td>
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <p className="font-bold text-foreground text-xs">{log.storeName}</p>
                        <p className="text-[10px] text-muted-foreground/80 font-mono">{log.storeCode}</p>
                        <p className="text-[10px] text-muted-foreground/70 truncate max-w-xs">{log.address}</p>
                        <a
                          href={`https://maps.google.com/?q=${encodeURIComponent(log.storeName + " " + log.address)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-500 hover:underline pt-0.5 cursor-pointer"
                        >
                          <MapPin className="size-2.5" />
                          <span>View on Map</span>
                        </a>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-muted-foreground font-mono text-[11px]">{log.storeCode}</td>
                    <td className="py-3 px-3 text-muted-foreground font-mono text-[11px] whitespace-nowrap">{log.dateTime}</td>
                    <td className="py-3 px-3 text-muted-foreground font-mono text-[11px]">{log.ipAddress}</td>

                    {/* Perfectly Aligned Device Column */}
                    <td className="py-3 px-3 font-semibold text-foreground">
                      <div className="flex items-center gap-1.5">
                        {log.device === "Mobile" ? (
                          <Smartphone className="size-3.5 text-blue-400 shrink-0" />
                        ) : (
                          <Monitor className="size-3.5 text-emerald-400 shrink-0" />
                        )}
                        <span>{log.device}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-bold text-foreground">{log.versions}</td>
                    <td className="py-3 px-3">{getStatusBadge(log.status)}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleViewClick(log)}
                        className="px-2.5 py-1 rounded border border-border dark:border-[#27272a] bg-background dark:bg-[#18181b] hover:bg-secondary/40 text-xs font-semibold text-foreground inline-flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Eye className="size-3 text-blue-500" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                );
              })
              )}
            </tbody>
          </table>
        </div>
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
              <SelectValue placeholder="30" />
            </SelectTrigger>
            <SelectContent className="bg-popover dark:bg-[#18181b] border-border dark:border-[#27272a] text-xs">
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="30">30</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-muted-foreground text-[11px] ml-2">
            Showing <span className="font-semibold text-foreground">{sortedLogs.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</span> -{" "}
            <span className="font-semibold text-foreground">{Math.min(currentPage * pageSize, sortedLogs.length)}</span> of{" "}
            <span className="font-semibold text-foreground">{sortedLogs.length}</span> items
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

      {/* Filter Modal matching Reviews section */}
      <AdvancedFilterModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        onApplyFilters={(count) => setActiveFilterCount(count)}
      />
    </div>
  );
}
