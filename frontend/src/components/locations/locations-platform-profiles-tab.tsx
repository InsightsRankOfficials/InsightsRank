import { useState, useMemo } from "react";
import { EmptyTableRow } from "@/components/ui/empty-state";
import {
  ArrowUpDown,
  BarChart3,
  Bot,
  ChevronDown,
  Download,
  Edit,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  MapPin,
  MoreVertical,
  Phone,
  Upload,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { GoogleGIcon } from "@/components/ui/google-g-icon";
import { Button } from "@/components/ui/button";
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
import { LocationsImportView } from "./locations-import-view";
import { LocationsAdvancedFilterModal } from "./locations-advanced-filter-modal";

interface LocationsPlatformProfilesTabProps {
  onViewModeChange?: (isFullScreen: boolean) => void;
}

export function LocationsPlatformProfilesTab({ onViewModeChange }: LocationsPlatformProfilesTabProps) {
  const navigate = useNavigate();
  const [platform, setPlatform] = useState<"google" | "facebook">("google");

  // View state ("list" | "detail" | "edit" | "import")
  const [viewMode, setViewMode] = useState<"list" | "detail" | "edit" | "import">("list");
  const [selectedStore, setSelectedStore] = useState<any>(null);

  // Advanced Filter Modal state
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [appliedFilterCount, setAppliedFilterCount] = useState(0);
  const [filterData, setFilterData] = useState<Record<string, { op: string; val: string }>>({});

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

  const handleOpenImport = () => {
    setSelectedStore(null);
    setViewMode("import");
    onViewModeChange?.(true);
  };

  const handleBackToList = () => {
    setViewMode("list");
    onViewModeChange?.(false);
  };

  const platformListings = [
    {
      id: "1",
      name: "Demo Store 127",
      address: "JMD Regent Arcade, 4th floor, MG Road, Mumbai, 400050, Maharashtra, IN",
      city: "Mumbai",
      state: "Maharashtra",
      storeCode: "demo-store-127",
      contacts: ["+91 83687 61913"],
      storeStatus: "Open",
      status: "Unverified",
      placeId: "ChIJ127_Mumbai_Google",
      lat: "28.479716",
      lng: "77.0885703",
    },
    {
      id: "2",
      name: "Demo Store 100",
      address: "JMD Regent Arcade, 4th floor, MG Road, Palghar, 401303, Maharashtra, IN",
      city: "Palghar",
      state: "Maharashtra",
      storeCode: "demo-store-100",
      contacts: ["+91 83687 61913"],
      storeStatus: "Open",
      status: "Unverified",
      placeId: "ChIJ100_Palghar_Google",
      lat: "19.6967",
      lng: "72.7699",
    },
    {
      id: "3",
      name: "Demo Store 308",
      address: "JMD Regent Arcade, 4th floor, MG Road, Bilaspur, 495001, Chhattisgarh, IN",
      city: "Bilaspur",
      state: "Chhattisgarh",
      storeCode: "demo-store-308",
      contacts: ["+91 95705 36949"],
      storeStatus: "Open",
      status: "Unverified",
      placeId: "ChIJ308_Bilaspur_Google",
      lat: "22.0797",
      lng: "82.1391",
    },
    {
      id: "4",
      name: "Demo Store 296 - 3556",
      address:
        "JMD Regent Arcade, 4th floor, MG Road, New addressline colony, Chhatarpur, East, Delhi, 110032, Delhi, IN",
      city: "Delhi",
      state: "Delhi",
      storeCode: "demo-store-296",
      contacts: [
        "+91 83687 61913",
        "+91 87654 23698",
        "+91 86543 39754",
        "+91 89484 64946",
      ],
      storeStatus: "Open",
      status: "Unverified",
      placeId: "ChIJ296_Delhi_Google",
      lat: "28.5000",
      lng: "77.1800",
    },
    {
      id: "5",
      name: "Demo Store 299",
      address: "JMD Regent Arcade, 4th floor, MG Road, Delhi, 110041, Delhi, IN",
      city: "Delhi",
      state: "Delhi",
      storeCode: "demo-store-299",
      contacts: ["+91 83687 61913"],
      storeStatus: "Open",
      status: "Verified",
      placeId: "ChIJ299_Delhi_Google",
      lat: "28.6100",
      lng: "77.2300",
    },
    {
      id: "6",
      name: "Demo Store 311",
      address: "JMD Regent Arcade, 4th floor, MG Road, Unnao, 209801, Uttar Pradesh, IN",
      city: "Unnao",
      state: "Uttar Pradesh",
      storeCode: "demo-store-311",
      contacts: ["+91 83687 61913"],
      storeStatus: "Open",
      status: "Verified",
      placeId: "ChIJ311_Unnao_Google",
      lat: "26.5393",
      lng: "80.4878",
    },
  ];

  const filteredListings = useMemo(() => {
    return platformListings.filter((store) => {
      const codeVal = filterData.storeCode?.val?.toLowerCase().trim() || "";
      const nameVal = filterData.storeName?.val?.toLowerCase().trim() || "";
      const statusVal = filterData.storeStatus?.val?.toLowerCase().trim() || "";
      const verifVal = filterData.verificationStatus?.val?.toLowerCase().trim() || "";

      if (codeVal) {
        const codes = codeVal.split(",").map((c) => c.trim());
        if (!codes.some((c) => store.storeCode.toLowerCase().includes(c))) return false;
      }

      if (nameVal) {
        const names = nameVal.split(",").map((n) => n.trim());
        if (!names.some((n) => store.name.toLowerCase().includes(n))) return false;
      }

      if (statusVal && statusVal !== "all") {
        if (store.storeStatus.toLowerCase() !== statusVal) return false;
      }

      if (verifVal && verifVal !== "all") {
        if (store.status.toLowerCase() !== verifVal) return false;
      }

      return true;
    });
  }, [filterData, platformListings]);

  const handleReviewAssistant = (store: any) => {
    toast.info(`Opening Review Assistant for ${store.name}`);
    navigate({ to: "/reviews/assistant" });
  };

  const handleDownloadReport = (type: "detailed" | "summarized") => {
    const csvContent =
      type === "detailed"
        ? "data:text/csv;charset=utf-8," +
          "ID,Platform,Store Code,Name,Place ID,Verification Status,Store Status,Phone,Address\n" +
          filteredListings
            .map(
              (s) =>
                `"${s.id}","${platform.toUpperCase()}","${s.storeCode}","${s.name}","${s.placeId}","${s.status}","${s.storeStatus}","${s.contacts[0]}","${s.address}"`
            )
            .join("\n")
        : "data:text/csv;charset=utf-8," +
          "Platform,Total Locations,Verified Count,Unverified Count,Sync Status\n" +
          `"${platform.toUpperCase()}","${filteredListings.length}","${filteredListings.filter(f => f.status === "Verified").length}","${filteredListings.filter(f => f.status !== "Verified").length}","Synced"`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `${platform}_platform_profiles_${type}_report_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(
      `${platform === "google" ? "Google" : "Facebook"} Platform Profiles ${type === "detailed" ? "Detailed" : "Summarized"} Report downloaded!`
    );
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
    return <LocationsImportView onBack={handleBackToList} type="platform" />;
  }

  return (
    <div className="rounded-2xl bg-[#f4f4f6] dark:bg-[#141416] p-6 sm:p-8 space-y-6 shadow-xl border border-slate-200/80 dark:border-transparent">
      {/* Platform Toggle Bar */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setPlatform("google")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
            platform === "google"
              ? "bg-secondary text-foreground border border-border shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <GoogleGIcon className="size-3.5" />
          <span>Google</span>
        </button>

        <button
          onClick={() => setPlatform("facebook")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
            platform === "facebook"
              ? "bg-secondary text-foreground border border-border shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span className="size-3.5 rounded-full bg-[#1877f2] text-white flex items-center justify-center text-[10px] font-black">
            f
          </span>
          <span>Facebook</span>
        </button>
      </div>

      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-foreground tracking-tight">
          {platform === "google" ? "Google Listings" : "Facebook Listings"}
        </h1>

        <div className="flex flex-wrap items-center gap-2">
          {/* Advanced Filter Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFilterModalOpen(true)}
            className="h-8 border-slate-300 dark:border-[#3f3f46] bg-white dark:bg-[#18181b] hover:bg-slate-100 dark:hover:bg-[#27272a] text-xs text-foreground cursor-pointer gap-1.5 px-3"
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
            className="h-8 border-slate-300 dark:border-[#3f3f46] bg-white dark:bg-[#18181b] hover:bg-slate-100 dark:hover:bg-[#27272a] text-xs text-foreground cursor-pointer gap-1.5 px-3"
          >
            <Upload className="size-3.5 text-muted-foreground" />
            <span>Import</span>
          </Button>

          {/* Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 border-slate-300 dark:border-[#3f3f46] bg-white dark:bg-[#18181b] hover:bg-slate-100 dark:hover:bg-[#27272a] text-xs text-foreground font-semibold cursor-pointer gap-1.5 px-3 transition-colors"
              >
                <Download className="size-3.5 text-blue-500" />
                <span>Export</span>
                <ChevronDown className="size-3 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-72 bg-white dark:bg-[#121214] border-slate-200 dark:border-[#27272a] text-foreground p-1.5 shadow-xl rounded-lg"
            >
              <DropdownMenuItem
                onClick={() => handleDownloadReport("detailed")}
                className="flex items-start gap-3 p-2.5 rounded-md cursor-pointer hover:bg-secondary/40"
              >
                <FileText className="size-4 text-blue-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-foreground">Detailed Report</p>
                  <p className="text-[11px] text-muted-foreground">Verification status and place IDs</p>
                </div>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-slate-200 dark:bg-[#27272a] my-1" />

              <DropdownMenuItem
                onClick={() => handleDownloadReport("summarized")}
                className="flex items-start gap-3 p-2.5 rounded-md cursor-pointer hover:bg-secondary/40"
              >
                <BarChart3 className="size-4 text-blue-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-foreground">Summarized Report</p>
                  <p className="text-[11px] text-muted-foreground">Platform verification summary</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Platform Profiles Table */}
      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-secondary/30 text-muted-foreground font-semibold">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-foreground">
                    <span>Location</span>
                    <ArrowUpDown className="size-3" />
                  </div>
                </th>
                <th className="py-3 px-4">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-foreground">
                    <span>Store Code</span>
                    <ArrowUpDown className="size-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Contact Numbers</th>
                <th className="py-3 px-4">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-foreground">
                    <span>Store Status</span>
                    <ArrowUpDown className="size-3" />
                  </div>
                </th>
                <th className="py-3 px-4">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-foreground">
                    <span>Status</span>
                    <ArrowUpDown className="size-3" />
                  </div>
                </th>
                <th className="py-3 px-4 w-12 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredListings.length === 0 ? (
                <EmptyTableRow
                  colSpan={9}
                  description="No platform profiles match your search & filter criteria."
                />
              ) : (
                filteredListings.map((store) => (
                <tr key={store.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="py-3.5 px-4 text-center tnum text-muted-foreground font-medium">
                    {store.id}
                  </td>

                  <td className="py-3.5 px-4 space-y-1 max-w-md">
                    <p
                      onClick={() => handleOpenDetail(store)}
                      className="font-bold text-foreground text-xs hover:text-blue-500 cursor-pointer transition-colors"
                    >
                      {store.name}
                    </p>
                    <div className="flex items-start gap-1 text-[11px] text-muted-foreground">
                      <MapPin className="size-3 shrink-0 mt-0.5 text-muted-foreground/70" />
                      <span>{store.address}</span>
                    </div>

                    {store.placeId && (
                      <p className="font-mono text-[10px] text-muted-foreground/80">
                        # Place ID: {store.placeId}
                      </p>
                    )}

                    <button
                      onClick={() => handleOpenDetail(store)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-500 hover:underline pt-0.5 cursor-pointer"
                    >
                      <ExternalLink className="size-3" />
                      <span>View Details & Map</span>
                    </button>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[11px] text-muted-foreground">
                    {store.storeCode}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      {store.contacts.map((contact, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[11px] text-foreground">
                          <Phone className="size-3 text-blue-500" />
                          <span className="tnum font-medium">{contact}</span>
                        </div>
                      ))}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#052e16] border border-[#14532d] text-emerald-400 font-semibold text-[11px]">
                      {store.storeStatus}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    {store.status === "Verified" ? (
                      <span className="inline-block px-2.5 py-0.5 rounded bg-[#052e16] border border-[#14532d] text-emerald-400 font-semibold text-[11px]">
                        Verified
                      </span>
                    ) : (
                      <span className="inline-block px-2.5 py-0.5 rounded bg-[#451a03] border border-[#78350f] text-blue-400 font-semibold text-[11px]">
                        Unverified
                      </span>
                    )}
                  </td>

                  {/* Actions 3-Dots Dropdown */}
                  <td className="py-3.5 px-4 text-right">
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
                          onClick={() => handleOpenDetail(store)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold cursor-pointer hover:bg-slate-100 dark:hover:bg-secondary/40 focus:bg-slate-100 dark:focus:bg-secondary/40 transition-colors"
                        >
                          <Eye className="size-3.5 text-blue-500" />
                          <span>View Profile</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => handleOpenEdit(store)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold cursor-pointer hover:bg-slate-100 dark:hover:bg-secondary/40 focus:bg-slate-100 dark:focus:bg-secondary/40 transition-colors"
                        >
                          <Edit className="size-3.5 text-blue-500 dark:text-blue-400" />
                          <span>Edit Listing</span>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="bg-slate-200 dark:bg-[#27272a] my-1" />

                        <DropdownMenuItem
                          onClick={() => handleReviewAssistant(store)}
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
      </div>

      {/* Advanced Filter Modal */}
      <LocationsAdvancedFilterModal
        open={isFilterModalOpen}
        onOpenChange={setIsFilterModalOpen}
        tabType="platform"
        onApplyFilters={(count, data) => {
          setAppliedFilterCount(count);
          setFilterData(data);
        }}
      />
    </div>
  );
}
