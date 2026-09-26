import { useState } from "react";
import { BarChart3, ChevronDown, Download, FileText, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  downloadDetailedReport,
  downloadSummarizedReport,
} from "@/data/reviews-analytics";
import { AdvancedFilterModal } from "./advanced-filter-modal";

interface ReviewHeaderActionsProps {
  activeFilterCount?: number;
  onFilterApply?: (filters: any) => void;
}

export function ReviewHeaderActions({
  activeFilterCount = 0,
}: ReviewHeaderActionsProps) {
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  return (
    <div className="flex items-center gap-2.5">
      {/* Advanced Filter Modal Trigger Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setFilterModalOpen(true)}
        className="h-8 border-border bg-card dark:bg-[#18181b] hover:bg-secondary text-xs text-foreground cursor-pointer gap-1.5 px-3 transition-colors"
      >
        <Filter className="size-3.5 text-muted-foreground" />
        <span className="relative flex size-4 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-black tnum">
          {activeFilterCount}
        </span>
      </Button>

      {/* Export Dropdown matching Reference Screenshot */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-border bg-card dark:bg-[#18181b] hover:bg-secondary text-xs text-foreground font-semibold cursor-pointer gap-1.5 px-3 transition-colors"
          >
            <Download className="size-3.5 text-blue-500" />
            <span>Export</span>
            <ChevronDown className="size-3 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-80 bg-popover dark:bg-[#121214] border-border text-popover-foreground p-1.5 shadow-xl rounded-lg"
        >
          {/* Detailed Report Item */}
          <DropdownMenuItem
            onClick={downloadDetailedReport}
            className="flex items-start gap-3 p-3 rounded-md cursor-pointer hover:bg-secondary/40 focus:bg-secondary/40 transition-colors"
          >
            <div className="p-1.5 rounded bg-blue-500/10 border border-blue-500/30 shrink-0 mt-0.5">
              <FileText className="size-4 text-blue-500" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <p className="text-xs font-bold text-foreground">Detailed Report</p>
              <p className="text-[11px] text-muted-foreground leading-normal">
                Comprehensive data with all metrics and breakdowns
              </p>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-border my-1" />

          {/* Summarized Report Item */}
          <DropdownMenuItem
            onClick={downloadSummarizedReport}
            className="flex items-start gap-3 p-3 rounded-md cursor-pointer hover:bg-secondary/40 focus:bg-secondary/40 transition-colors"
          >
            <div className="p-1.5 rounded bg-blue-500/10 border border-blue-500/30 shrink-0 mt-0.5">
              <BarChart3 className="size-4 text-blue-500" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <p className="text-xs font-bold text-foreground">Summarized Report</p>
              <p className="text-[11px] text-muted-foreground leading-normal">
                Aggregated overview of key performance indicators
              </p>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Advanced Filter Modal */}
      <AdvancedFilterModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
      />
    </div>
  );
}
