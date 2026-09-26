import React, { useState } from "react";
import { EmptyTableRow } from "@/components/ui/empty-state";
import { STORE_MANAGERS_LIST, StoreManagerItem } from "@/data/store-manager-analytics";
import {
  Plus,
  Download,
  Upload,
  Filter,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Search,
  Mail,
  Edit2,
  Trash2,
  FileText,
  BarChart3,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { AdvancedFilterModal, FilterCriteria } from "./advanced-filter-modal";
import { LocationsImportView } from "@/components/locations/locations-import-view";

interface StoreManagersTabProps {
  onAddStoreManager: () => void;
  onEditStoreManager?: (manager: StoreManagerItem) => void;
}

export function StoreManagersTab({
  onAddStoreManager,
  onEditStoreManager,
}: StoreManagersTabProps) {
  const [viewMode, setViewMode] = useState<"list" | "import">("list");
  const [managers, setManagers] = useState<StoreManagerItem[]>(STORE_MANAGERS_LIST);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(30);

  // Sorting
  const [sortField, setSortField] = useState<keyof StoreManagerItem | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  // Advanced Filter Modal state
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterCriteria | null>(null);

  const activeFilterCount = appliedFilters
    ? (appliedFilters.firstNameVal ? 1 : 0) +
      (appliedFilters.lastNameVal ? 1 : 0) +
      (appliedFilters.emailVal ? 1 : 0) +
      (appliedFilters.isActiveVal !== "all" ? 1 : 0)
    : 0;

  const handleSort = (field: keyof StoreManagerItem) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleDownloadReport = (type: "managers" | "locations") => {
    const csvContent =
      type === "managers"
        ? "data:text/csv;charset=utf-8," +
          "ID,First Name,Last Name,Email,Mobile,Status,Login Status,Last Seen,Last Modified\n" +
          managers
            .map(
              (m) =>
                `"${m.id}","${m.firstName}","${m.lastName}","${m.email}","${m.mobile}","${m.status}","${m.loginStatus}","${m.lastSeen}","${m.lastModifiedAt}"`
            )
            .join("\n")
        : "data:text/csv;charset=utf-8," +
          "Manager Name,Email,Accessible Store Count,Accessible Locations\n" +
          managers
            .map((m) => {
              const locs = m.accessibleLocations.map((l) => `${l.storeName} (${l.storeCode})`).join("; ");
              return `"${m.firstName} ${m.lastName}","${m.email}","${m.accessibleLocations.length}","${locs}"`;
            })
            .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `store_managers_${type}_report_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(
      `${type === "managers" ? "Store Manager" : "Store Manager Location"} Report downloaded!`
    );
  };

  const filteredManagers = managers.filter((m) => {
    // Basic search query
    const fullName = `${m.firstName} ${m.lastName}`.toLowerCase();
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      fullName.includes(query) ||
      m.email.toLowerCase().includes(query) ||
      m.mobile.includes(query);

    if (!matchesSearch) return false;

    // Advanced filters
    if (appliedFilters) {
      if (appliedFilters.firstNameVal) {
        const fn = m.firstName.toLowerCase();
        const target = appliedFilters.firstNameVal.toLowerCase();
        if (!fn.includes(target)) return false;
      }
      if (appliedFilters.lastNameVal) {
        const ln = m.lastName.toLowerCase();
        const target = appliedFilters.lastNameVal.toLowerCase();
        if (!ln.includes(target)) return false;
      }
      if (appliedFilters.emailVal) {
        const em = m.email.toLowerCase();
        const target = appliedFilters.emailVal.toLowerCase();
        if (!em.includes(target)) return false;
      }
      if (appliedFilters.isActiveVal && appliedFilters.isActiveVal !== "all") {
        if (m.status.toLowerCase() !== appliedFilters.isActiveVal.toLowerCase()) return false;
      }
    }

    return true;
  });

  const sortedManagers = [...filteredManagers].sort((a, b) => {
    if (!sortField) return 0;
    const valA = String(a[sortField] || "").toLowerCase();
    const valB = String(b[sortField] || "").toLowerCase();
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedManagers.length / pageSize) || 1;
  const paginatedManagers = sortedManagers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleDelete = (id: string) => {
    setManagers((prev) => prev.filter((m) => m.id !== id));
    toast.success("Manager removed successfully.");
  };

  if (viewMode === "import") {
    return (
      <LocationsImportView
        onBack={() => setViewMode("list")}
        type="managers"
      />
    );
  }

  return (
    <div className="rounded-2xl bg-card dark:bg-[#141416] p-6 sm:p-8 space-y-6 shadow-xl border border-border">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Store Managers</h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Manage your store managers, assign location access, and monitor request permissions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Filter Button opening Advanced Filter Modal */}
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="relative px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-secondary text-xs font-semibold text-muted-foreground flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Filter className="size-3.5 text-muted-foreground/80" />
            <span className="size-4 rounded-full bg-blue-500 text-black text-[10px] font-extrabold flex items-center justify-center">
              {activeFilterCount}
            </span>
          </button>

          {/* Import Button */}
          <button
            onClick={() => setViewMode("import")}
            className="px-3.5 py-1.5 rounded-lg border border-border bg-background hover:bg-secondary text-xs font-semibold text-foreground flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Upload className="size-3.5 text-blue-500" />
            Import
          </button>

          {/* Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="px-3.5 py-1.5 rounded-lg border border-border bg-background hover:bg-secondary text-xs font-semibold text-foreground flex items-center gap-1.5 transition-colors cursor-pointer">
                <Download className="size-3.5 text-blue-500" />
                Export ▾
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-popover border-border text-popover-foreground text-xs p-2 w-72 shadow-xl space-y-1"
            >
              <DropdownMenuItem
                onClick={() => handleDownloadReport("managers")}
                className="p-2.5 rounded-lg hover:bg-secondary/60 cursor-pointer flex items-start gap-3 group"
              >
                <FileText className="size-4 text-blue-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-foreground text-xs group-hover:text-blue-500 transition-colors">
                    Store Manager Report
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                    Exports a list of all store managers with their details.
                  </p>
                </div>
              </DropdownMenuItem>

              <div className="border-b border-border my-1" />

              <DropdownMenuItem
                onClick={() => handleDownloadReport("locations")}
                className="p-2.5 rounded-lg hover:bg-secondary/60 cursor-pointer flex items-start gap-3 group"
              >
                <BarChart3 className="size-4 text-blue-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-foreground text-xs group-hover:text-blue-500 transition-colors">
                    Location Report
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                    Exports a list of all locations with their assigned managers.
                  </p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Add Store Manager Button */}
          <button
            onClick={onAddStoreManager}
            className="px-4 py-1.5 rounded-lg bg-blue-400 hover:bg-blue-500 text-black text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="size-4" />
            Add Store Manager
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by manager name or email..."
          className="w-full pl-9 pr-4 py-1.5 rounded-lg border border-border dark:border-[#27272a] bg-background dark:bg-[#121214] text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
        />
      </div>

      {/* Data Table Container */}
      <div className="rounded-xl border border-border dark:border-[#27272a] bg-card dark:bg-[#121214] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border dark:border-[#27272a] bg-secondary/30 text-muted-foreground font-semibold select-none">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th
                  onClick={() => handleSort("firstName")}
                  className="py-3 px-4 cursor-pointer hover:text-foreground transition-colors"
                >
                  <div className="flex items-center gap-1">
                    First Name <span className="text-[10px] opacity-60">⇅</span>
                  </div>
                </th>
                <th
                  onClick={() => handleSort("lastName")}
                  className="py-3 px-4 cursor-pointer hover:text-foreground transition-colors"
                >
                  <div className="flex items-center gap-1">
                    Last Name <span className="text-[10px] opacity-60">⇅</span>
                  </div>
                </th>
                <th
                  onClick={() => handleSort("email")}
                  className="py-3 px-4 cursor-pointer hover:text-foreground transition-colors"
                >
                  <div className="flex items-center gap-1">
                    Email <span className="text-[10px] opacity-60">⇅</span>
                  </div>
                </th>
                <th className="py-3 px-4">Mobile</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Login Status</th>
                <th
                  onClick={() => handleSort("lastSeen")}
                  className="py-3 px-4 cursor-pointer hover:text-foreground transition-colors"
                >
                  <div className="flex items-center gap-1">
                    Last Seen <span className="text-[10px] opacity-60">⇅</span>
                  </div>
                </th>
                <th className="py-3 px-4">Last Login IP</th>
                <th
                  onClick={() => handleSort("lastModifiedAt")}
                  className="py-3 px-4 cursor-pointer hover:text-foreground transition-colors"
                >
                  <div className="flex items-center gap-1">
                    Last Modified At <span className="text-[10px] opacity-60">⇅</span>
                  </div>
                </th>
                <th className="py-3 px-4 text-center w-12">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border/50 text-foreground">
              {paginatedManagers.length === 0 ? (
                <EmptyTableRow
                  colSpan={11}
                  description="No store managers found matching search criteria."
                />
              ) : (
                paginatedManagers.map((mgr, index) => {
                  const itemIndex = (currentPage - 1) * pageSize + index + 1;
                  return (
                    <tr
                      key={mgr.id}
                      className="hover:bg-secondary/20 transition-colors group"
                    >
                      <td className="py-3 px-4 text-center text-muted-foreground font-mono">
                        {itemIndex}
                      </td>
                      <td className="py-3 px-4 font-semibold text-foreground">
                        {mgr.firstName}
                      </td>
                      <td className="py-3 px-4 font-semibold text-foreground">
                        {mgr.lastName}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground font-mono text-[11px]">
                        {mgr.email}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground font-mono text-[11px]">
                        {mgr.mobile}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                          {mgr.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                          {mgr.loginStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{mgr.lastSeen}</td>
                      <td className="py-3 px-4 text-muted-foreground font-mono text-[11px]">
                        {mgr.lastLoginIp}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{mgr.lastModifiedAt}</td>
                      <td className="py-3 px-4 text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer">
                              <MoreVertical className="size-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-popover border-border text-popover-foreground text-xs"
                          >
                            <DropdownMenuItem
                              onClick={() => onEditStoreManager?.(mgr)}
                              className="hover:bg-secondary cursor-pointer flex items-center gap-2"
                            >
                              <Edit2 className="size-3.5 text-blue-500" /> Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => toast.success(`Invitation resent to ${mgr.email}`)}
                              className="hover:bg-secondary cursor-pointer flex items-center gap-2"
                            >
                              <Mail className="size-3.5 text-blue-500" /> Resend Invite
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(mgr.id)}
                              className="hover:bg-secondary cursor-pointer text-rose-500 flex items-center gap-2"
                            >
                              <Trash2 className="size-3.5" /> Remove Manager
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-t border-border text-xs bg-card dark:bg-[#141416]">
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
                <SelectValue placeholder="30" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border text-popover-foreground text-xs">
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="30">30</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-muted-foreground text-[11px] ml-2">
              Showing <span className="font-semibold text-foreground">{sortedManagers.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</span> -{" "}
              <span className="font-semibold text-foreground">{Math.min(currentPage * pageSize, sortedManagers.length)}</span> of{" "}
              <span className="font-semibold text-foreground">{sortedManagers.length}</span> items
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
      <AdvancedFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={(filters) => setAppliedFilters(filters)}
        initialFilters={appliedFilters || undefined}
      />
    </div>
  );
}
