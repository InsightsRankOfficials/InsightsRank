import { useState, useMemo } from "react";
import { EmptyTableRow } from "@/components/ui/empty-state";
import {
  ArrowUpDown,
  BarChart3,
  Bot,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  MapPin,
  MoreVertical,
  Phone,
  Plus,
  Star,
  Upload,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { BusinessProfileDetailView } from "./business-profile-detail-view";
import { EditProfileView } from "./edit-profile-view";
import { LocationsAdvancedFilterModal } from "./locations-advanced-filter-modal";
import { LocationsImportView } from "./locations-import-view";

interface LocationsUnclaimedProfilesTabProps {
  onViewModeChange?: (isFullScreen: boolean) => void;
}

export function LocationsUnclaimedProfilesTab({ onViewModeChange }: LocationsUnclaimedProfilesTabProps) {
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState<"list" | "detail" | "edit" | "import">("list");
  const [selectedStore, setSelectedStore] = useState<any>(null);

  const [activeFilter, setActiveFilter] = useState<
    "all" | "pending" | "claimed" | "reported" | "ignored" | "merged"
  >("claimed");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Advanced Filter Modal state
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [appliedFilterCount, setAppliedFilterCount] = useState(0);
  const [filterData, setFilterData] = useState<Record<string, { op: string; val: string }>>({});

  const handleOpenImport = () => {
    setViewMode("import");
    onViewModeChange?.(true);
  };

  const handleBackToList = () => {
    setViewMode("list");
    onViewModeChange?.(false);
  };

  const unclaimedListings = [
    {
      id: "1",
      name: "Demo Store 22",
      rating: 4.5,
      ratingCount: 10,
      address: "JMD Regent Arcade, 4th floor, Varanasi, Uttar Pradesh 221002, India",
      city: "Varanasi",
      state: "Uttar Pradesh",
      phone: "+91-8368761913",
      placeId: "ChUgacxTRMfjkkRyHAXbS27DZc",
      status: "Claimed",
      identified: "26 Apr, 2026 06:31 PM",
      lastAction: "28 Apr, 2026 12:43 AM",
      remarkText: "Claimed System - 28 Apr, 2026 12:43 AM",
      lat: "25.3176",
      lng: "82.9739",
    },
    {
      id: "2",
      name: "Demo Store 13",
      rating: 4.0,
      ratingCount: 6,
      address: "JMD Regent Arcade, 4th floor, New Delhi, Delhi, 110015, India",
      city: "New Delhi",
      state: "Delhi",
      phone: "+91-8368761913",
      placeId: "ChIJ__97swYDDTkRFU2KayZjfu0",
      status: "Claimed",
      identified: "12 Apr, 2026 06:31 PM",
      lastAction: "15 Apr, 2026 12:11 AM",
      remarkText: null,
      lat: "28.6139",
      lng: "77.2090",
    },
  ];

  const filteredListings = useMemo(() => {
    return unclaimedListings.filter((store) => {
      const stateVal = filterData.state?.val?.toLowerCase().trim() || "";
      const cityVal = filterData.city?.val?.toLowerCase().trim() || "";

      if (stateVal && !store.state.toLowerCase().includes(stateVal)) return false;
      if (cityVal && !store.city.toLowerCase().includes(cityVal)) return false;

      return true;
    });
  }, [filterData, unclaimedListings]);

  const totalPages = Math.max(1, Math.ceil(filteredListings.length / pageSize));
  const paginatedListings = useMemo(() => {
    return filteredListings.slice((page - 1) * pageSize, page * pageSize);
  }, [filteredListings, page, pageSize]);

  const handleDownloadReport = (type: "detailed" | "summarized") => {
    const csvContent =
      type === "detailed"
        ? "data:text/csv;charset=utf-8," +
          "ID,Name,Place ID,Rating,Address,City,State,Phone,Status,Identified,Last Action,Remarks\n" +
          filteredListings
            .map(
              (s) =>
                `"${s.id}","${s.name}","${s.placeId}","${s.rating}","${s.address}","${s.city}","${s.state}","${s.phone}","${s.status}","${s.identified}","${s.lastAction}","${s.remarkText || "None"}"`
            )
            .join("\n")
        : "data:text/csv;charset=utf-8," +
          "Status Filter,Total Unclaimed Profiles,Claimed Count,Pending Count,Reported Count\n" +
          `"ALL","19","2","6","10"`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `unclaimed_profiles_${type}_report_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Unclaimed Profiles ${type === "detailed" ? "Detailed" : "Summarized"} Report downloaded!`);
  };

  if (viewMode === "detail") {
    return (
      <BusinessProfileDetailView
        onBack={handleBackToList}
        location={selectedStore}
      />
    );
  }

  if (viewMode === "edit") {
    return (
      <EditProfileView
        onBack={handleBackToList}
        location={selectedStore}
        mode="edit"
      />
    );
  }

  if (viewMode === "import") {
    return <LocationsImportView onBack={handleBackToList} type="unclaimed" />;
  }

  const handleOpenDetail = (store: any) => {
    setSelectedStore(store);
    setViewMode("detail");
    onViewModeChange?.(true);
  };

  const handleOpenEdit = (store: any) => {
    setSelectedStore(store);
    setViewMode("edit");
    onViewModeChange?.(true);
  };

  const handleReviewAssistant = (store: any) => {
    toast.info(`Opening Review Assistant for ${store.name}`);
    navigate({ to: "/reviews/assistant" });
  };

  return (
    <div className="rounded-2xl bg-card dark:bg-[#141416] p-6 sm:p-8 space-y-6 shadow-xl border border-border">
      {/* Action Header & Control Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-foreground tracking-tight">
          Unclaimed Profiles
        </h1>

        <div className="flex flex-wrap items-center gap-2">
          {/* Advanced Filter Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFilterModalOpen(true)}
            className="h-8 border-border bg-background hover:bg-secondary text-xs text-foreground cursor-pointer gap-1.5 px-3"
          >
            <Filter className="size-3.5 text-muted-foreground" />
            {appliedFilterCount > 0 && (
              <span className="inline-flex size-4 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-black">
                {appliedFilterCount}
              </span>
            )}
          </Button>

          {/* Import Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenImport}
            className="h-8 border-border bg-background hover:bg-secondary text-xs text-foreground font-semibold cursor-pointer gap-1.5 px-3 transition-colors"
          >
            <Upload className="size-3.5 text-blue-500" />
            <span>Import</span>
          </Button>

          {/* Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 border-border bg-background hover:bg-secondary text-xs text-foreground font-semibold cursor-pointer gap-1.5 px-3 transition-colors"
              >
                <Download className="size-3.5 text-blue-500" />
                <span>Export</span>
                <ChevronDown className="size-3 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-72 bg-popover border-border text-popover-foreground p-1.5 shadow-xl rounded-lg"
            >
              <DropdownMenuItem
                onClick={() => handleDownloadReport("detailed")}
                className="flex items-start gap-3 p-2.5 rounded-md cursor-pointer hover:bg-secondary/40"
              >
                <FileText className="size-4 text-blue-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-foreground">Detailed Report</p>
                  <p className="text-[11px] text-muted-foreground">Unclaimed place metrics & remarks</p>
                </div>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-border my-1" />

              <DropdownMenuItem
                onClick={() => handleDownloadReport("summarized")}
                className="flex items-start gap-3 p-2.5 rounded-md cursor-pointer hover:bg-secondary/40"
              >
                <BarChart3 className="size-4 text-blue-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-foreground">Summarized Report</p>
                  <p className="text-[11px] text-muted-foreground">Claim status breakdown</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Filter Badges Pill Bar */}
      <div className="flex flex-wrap items-center gap-2 bg-secondary/40 p-1.5 rounded-lg border border-border">
        {(["all", "pending", "claimed", "reported", "ignored", "merged"] as const).map((filterId) => (
          <button
            key={filterId}
            onClick={() => setActiveFilter(filterId)}
            className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
              activeFilter === filterId
                ? "bg-blue-500 text-black shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="capitalize">{filterId}</span>
            <span className="tnum px-1.5 py-0.2 rounded-full bg-black/20 text-[10px]">
              {filterId === "all" ? 19 : filterId === "claimed" ? 2 : filterId === "pending" ? 6 : filterId === "reported" ? 10 : 1}
            </span>
          </button>
        ))}
      </div>

      {/* Unclaimed Profiles Table */}
      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-secondary/30 text-muted-foreground font-semibold">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">Listing</th>
                <th className="py-3 px-4">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-foreground">
                    <span>Status</span>
                    <ArrowUpDown className="size-3" />
                  </div>
                </th>
                <th className="py-3 px-4">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-foreground">
                    <span>Identified</span>
                    <ArrowUpDown className="size-3" />
                  </div>
                </th>
                <th className="py-3 px-4">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-foreground">
                    <span>Last Action</span>
                    <ArrowUpDown className="size-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Remarks</th>
                <th className="py-3 px-4 w-12 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {paginatedListings.length === 0 ? (
                <EmptyTableRow
                  colSpan={7}
                  description="No unclaimed profiles match your search & filter criteria."
                />
              ) : (
                paginatedListings.map((item) => (
                <tr key={item.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="py-4 px-4 text-center tnum text-muted-foreground font-medium">
                    {item.id}
                  </td>

                  <td className="py-4 px-4 space-y-1.5 max-w-md">
                    <div className="flex items-center gap-2">
                      <span
                        onClick={() => handleOpenDetail(item)}
                        className="font-bold text-foreground text-xs hover:text-blue-500 cursor-pointer transition-colors"
                      >
                        {item.name}
                      </span>
                      <div className="flex items-center text-blue-400 text-[11px] gap-0.5">
                        <Star className="size-3 fill-blue-400 text-blue-400" />
                        <Star className="size-3 fill-blue-400 text-blue-400" />
                        <Star className="size-3 fill-blue-400 text-blue-400" />
                        <Star className="size-3 fill-blue-400 text-blue-400" />
                        <Star className="size-3 text-blue-400" />
                        <span className="tnum ml-1 font-semibold text-foreground">
                          {item.rating} ({item.ratingCount})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-1 text-[11px] text-muted-foreground">
                      <MapPin className="size-3 shrink-0 mt-0.5 text-muted-foreground/70" />
                      <span>{item.address}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <Phone className="size-3 text-muted-foreground/70" />
                      <span className="tnum">{item.phone}</span>
                    </div>

                    {item.placeId && (
                      <p className="font-mono text-[10px] text-muted-foreground/80">
                        # Place ID: {item.placeId}
                      </p>
                    )}

                    <button
                      onClick={() => handleOpenDetail(item)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-500 hover:underline pt-0.5 cursor-pointer"
                    >
                      <ExternalLink className="size-3" />
                      <span>View Details & Map</span>
                    </button>
                  </td>

                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#052e16] border border-[#14532d] text-emerald-400 font-semibold text-[11px]">
                      ✓ {item.status}
                    </span>
                  </td>

                  <td className="py-4 px-4 font-mono text-[11px] text-muted-foreground">
                    {item.identified}
                  </td>

                  <td className="py-4 px-4 font-mono text-[11px] text-muted-foreground">
                    {item.lastAction}
                  </td>

                  <td className="py-4 px-4">
                    {item.remarkText ? (
                      <div className="space-y-1">
                        <p className="text-[11px] text-muted-foreground font-medium">
                          {item.remarkText}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toast.info(`Remarks: ${item.remarkText}`)}
                          className="h-6 px-2.5 text-[10px] border-blue-500/40 text-blue-500 hover:bg-blue-500/10 gap-1 font-semibold cursor-pointer"
                        >
                          <Eye className="size-3" />
                          <span>View Remarks</span>
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toast.success("Remark added to location profile")}
                        className="h-6 px-2.5 text-[10px] border-blue-500/40 text-blue-500 hover:bg-blue-500/10 gap-1 font-semibold cursor-pointer"
                      >
                        <Plus className="size-3" />
                        <span>Add Remark</span>
                      </Button>
                    )}
                  </td>

                  {/* Actions 3-Dots Dropdown */}
                  <td className="py-4 px-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer transition-colors"
                          aria-label="Location actions"
                        >
                          <MoreVertical className="size-4" />
                        </button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="end"
                        className="w-48 bg-white dark:bg-[#121214] border-slate-200 dark:border-[#27272a] text-foreground p-1 shadow-xl rounded-lg"
                      >
                        <DropdownMenuItem
                          onClick={() => handleOpenDetail(item)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold cursor-pointer hover:bg-slate-100 dark:hover:bg-secondary/40 focus:bg-slate-100 dark:focus:bg-secondary/40 transition-colors"
                        >
                          <Eye className="size-3.5 text-blue-500" />
                          <span>View Profile</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => handleOpenEdit(item)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold cursor-pointer hover:bg-slate-100 dark:hover:bg-secondary/40 focus:bg-slate-100 dark:focus:bg-secondary/40 transition-colors"
                        >
                          <Edit className="size-3.5 text-blue-500 dark:text-blue-400" />
                          <span>Edit Listing</span>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="bg-slate-200 dark:bg-[#27272a] my-1" />

                        <DropdownMenuItem
                          onClick={() => handleReviewAssistant(item)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold cursor-pointer text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 focus:bg-blue-500/10 transition-colors"
                        >
                          <Bot className="size-3.5 text-blue-500" />
                          <span>Review Assistant Link</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
                ))
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
                setPage(1);
              }}
            >
              <SelectTrigger className="h-7 w-16 bg-background border-border text-foreground text-xs cursor-pointer">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border text-popover-foreground text-xs">
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-muted-foreground text-[11px] ml-2">
              Showing <span className="font-semibold text-foreground">{filteredListings.length > 0 ? (page - 1) * pageSize + 1 : 0}</span> -{" "}
              <span className="font-semibold text-foreground">{Math.min(page * pageSize, filteredListings.length)}</span> of{" "}
              <span className="font-semibold text-foreground">{filteredListings.length}</span> items
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-7 w-7 p-0 border-border text-foreground hover:bg-secondary disabled:opacity-40"
            >
              <ChevronLeft className="size-3.5" />
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                onClick={() => setPage(pg)}
                className={`h-7 min-w-[28px] px-1.5 rounded text-xs font-semibold cursor-pointer transition-colors ${
                  page === pg
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
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="h-7 w-7 p-0 border-border text-foreground hover:bg-secondary disabled:opacity-40"
            >
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Advanced Filter Modal */}
      <LocationsAdvancedFilterModal
        open={isFilterModalOpen}
        onOpenChange={setIsFilterModalOpen}
        tabType="unclaimed"
        onApplyFilters={(count, data) => {
          setAppliedFilterCount(count);
          setFilterData(data);
        }}
      />
    </div>
  );
}
