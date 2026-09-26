import { useState } from "react";
import { EmptyTableRow } from "@/components/ui/empty-state";
import {
  ArrowUpDown,
  BarChart3,
  Check,
  ChevronDown,
  Download,
  FileText,
  Filter,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { LocationsAdvancedFilterModal } from "./locations-advanced-filter-modal";
import { LocationsImportView } from "./locations-import-view";

interface LocationsDuplicateProfilesTabProps {
  onViewModeChange?: (isFullScreen: boolean) => void;
}

export function LocationsDuplicateProfilesTab({ onViewModeChange }: LocationsDuplicateProfilesTabProps = {}) {
  const [viewMode, setViewMode] = useState<"list" | "import">("list");
  const [activeTab, setActiveTab] = useState<"pending" | "merged">("pending");

  // Advanced Filter Modal state
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [appliedFilterCount, setAppliedFilterCount] = useState(0);
  const [filterData, setFilterData] = useState<Record<string, { op: string; val: string }>>({});

  const duplicates = [
    {
      id: "dup-1",
      primaryName: "Demo Store 105, Mumbai",
      primaryAddress: "45 MG Road, Fort, Mumbai 400001",
      duplicateName: "Demo Store - Fort Mumbai",
      duplicateAddress: "47 MG Road, Near Station, Fort, Mumbai 400001",
      distance: "45m",
      similarityScore: 94,
      status: "Pending Review",
    },
    {
      id: "dup-2",
      primaryName: "Demo Store 210, Delhi",
      primaryAddress: "Sector 21 Market, Dwarka, New Delhi 110075",
      duplicateName: "Demo Store Dwarka Outlet",
      duplicateAddress: "Plot 12, Sector 21 Market, New Delhi 110075",
      distance: "120m",
      similarityScore: 88,
      status: "Pending Review",
    },
  ];

  const handleOpenImport = () => {
    setViewMode("import");
    onViewModeChange?.(true);
  };

  const handleBackToList = () => {
    setViewMode("list");
    onViewModeChange?.(false);
  };

  const handleDownloadReport = (type: "detailed" | "summarized") => {
    const csvContent =
      type === "detailed"
        ? "data:text/csv;charset=utf-8," +
          "ID,Primary Name,Primary Address,Duplicate Candidate,Duplicate Address,Distance,Similarity Score,Status\n" +
          duplicates
            .map(
              (d) =>
                `"${d.id}","${d.primaryName}","${d.primaryAddress}","${d.duplicateName}","${d.duplicateAddress}","${d.distance}","${d.similarityScore}%","${d.status}"`
            )
            .join("\n")
        : "data:text/csv;charset=utf-8," +
          "Category,Count,Status\n" +
          `"Pending Duplicates","${duplicates.length}","Requires Action"\n` +
          `"Merged Duplicates","0","Resolved"`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `duplicate_profiles_${type}_report_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Duplicate Profiles ${type === "detailed" ? "Detailed" : "Summarized"} Report downloaded!`);
  };

  if (viewMode === "import") {
    return <LocationsImportView onBack={handleBackToList} type="duplicate" />;
  }

  return (
    <div className="rounded-2xl bg-[#f4f4f6] dark:bg-[#141416] p-6 sm:p-8 space-y-6 shadow-xl border border-slate-200/80 dark:border-transparent">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">
            Duplicate Profiles
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Identify, compare, and merge potential duplicate Google Business Profiles.
          </p>
        </div>

        <div className="flex items-center gap-2">
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
            className="h-8 border-slate-300 dark:border-[#3f3f46] bg-white dark:bg-[#18181b] hover:bg-slate-100 dark:hover:bg-[#27272a] text-xs text-foreground font-semibold cursor-pointer gap-1.5 px-3 transition-colors"
          >
            <Upload className="size-3.5 text-blue-500" />
            <span>Import</span>
          </Button>

          {/* Export Dropdown matching Reference */}
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
                  <p className="text-[11px] text-muted-foreground">Duplicate candidates comparison & metrics</p>
                </div>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-[#27272a] my-1" />

              <DropdownMenuItem
                onClick={() => handleDownloadReport("summarized")}
                className="flex items-start gap-3 p-2.5 rounded-md cursor-pointer hover:bg-secondary/40"
              >
                <BarChart3 className="size-4 text-blue-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-foreground">Summarized Report</p>
                  <p className="text-[11px] text-muted-foreground">Duplicate resolution summary</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Pill Filter Bar */}
      <div className="flex items-center gap-2 bg-secondary/40 p-1.5 rounded-lg border border-border">
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
            activeTab === "pending"
              ? "bg-blue-500 text-black shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Pending Review
          <span className="tnum px-1.5 py-0.2 rounded-full bg-black/20 text-[10px]">2</span>
        </button>

        <button
          onClick={() => setActiveTab("merged")}
          className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
            activeTab === "merged"
              ? "bg-blue-500 text-black shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Merged / Resolved
          <span className="tnum px-1.5 py-0.2 rounded-full bg-black/20 text-[10px]">0</span>
        </button>
      </div>

      {/* Duplicates Table */}
      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-secondary/30 text-muted-foreground font-semibold">
                <th className="py-3 px-4">Primary Profile</th>
                <th className="py-3 px-4">Duplicate Candidate</th>
                <th className="py-3 px-4">Distance</th>
                <th className="py-3 px-4">Match Score</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {duplicates.length === 0 ? (
                <EmptyTableRow
                  colSpan={5}
                  description="No duplicate profile candidates found for the selected criteria."
                />
              ) : (
                duplicates.map((item) => (
                <tr key={item.id} className="hover:bg-secondary/20 transition-colors">
                  {/* Primary Profile */}
                  <td className="py-3.5 px-4 space-y-1">
                    <p className="font-bold text-foreground cursor-pointer hover:text-blue-500 transition-colors">{item.primaryName}</p>
                    <p className="text-[11px] text-muted-foreground">{item.primaryAddress}</p>
                  </td>

                  {/* Duplicate Candidate */}
                  <td className="py-3.5 px-4 space-y-1">
                    <p className="font-bold text-blue-400 cursor-pointer hover:underline">{item.duplicateName}</p>
                    <p className="text-[11px] text-muted-foreground">{item.duplicateAddress}</p>
                  </td>

                  {/* Distance */}
                  <td className="py-3.5 px-4 font-mono text-[11px] text-foreground font-semibold">
                    {item.distance}
                  </td>

                  {/* Similarity Score */}
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[11px]">
                      {item.similarityScore}% Match
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => toast.success(`Merged ${item.duplicateName} into ${item.primaryName}`)}
                        className="h-7 px-2.5 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-1 cursor-pointer"
                      >
                        <Check className="size-3" /> Merge
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toast.info(`Ignored duplicate candidate ${item.duplicateName}`)}
                        className="h-7 px-2.5 text-[11px] border-border text-muted-foreground hover:text-foreground gap-1 cursor-pointer"
                      >
                        <X className="size-3" /> Ignore
                      </Button>
                    </div>
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
        tabType="duplicate"
        onApplyFilters={(count, data) => {
          setAppliedFilterCount(count);
          setFilterData(data);
        }}
      />
    </div>
  );
}
