import { useState } from "react";
import { Calendar as CalendarIcon, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ALL_CITIES, ALL_STATES } from "./state-city-filter-dropdowns";

export type FilterTabType =
  | "master"
  | "platform"
  | "unclaimed"
  | "duplicate"
  | "tags"
  | "google_updates";

interface FieldConfig {
  key: string;
  label: string;
  type?: "text" | "select" | "date";
  options?: string[];
  hasCommaNote?: boolean;
  defaultOperator?: string;
  defaultValue?: string;
}

const TAB_FIELD_CONFIGS: Record<FilterTabType, FieldConfig[]> = {
  master: [
    {
      key: "locationAccount",
      label: "Location Account",
      type: "select",
      options: ["Demo Account", "Flagship Stores", "Metro Retail"],
    },
    {
      key: "storeCode",
      label: "Store Code",
      type: "text",
      hasCommaNote: true,
    },
    {
      key: "storeName",
      label: "Store Name",
      type: "text",
      hasCommaNote: true,
    },
    {
      key: "tags",
      label: "Tags",
      type: "select",
      options: ["test", "demo", "retail", "flagship"],
    },
    {
      key: "storeStatus",
      label: "Store Status",
      type: "select",
      options: ["Open", "Closed", "Temporarily Closed"],
    },
  ],
  platform: [
    {
      key: "locationAccount",
      label: "Location Account",
      type: "select",
      options: ["Demo Account", "Flagship Stores", "Metro Retail"],
    },
    {
      key: "storeCode",
      label: "Store Code",
      type: "text",
      hasCommaNote: true,
    },
    {
      key: "storeName",
      label: "Store Name",
      type: "text",
      hasCommaNote: true,
    },
    {
      key: "storeStatus",
      label: "Store Status",
      type: "select",
      options: ["Open", "Closed", "Temporarily Closed"],
    },
    {
      key: "verificationStatus",
      label: "Verification Status",
      type: "select",
      options: ["Verified", "Unverified", "Pending Review"],
    },
  ],
  unclaimed: [
    {
      key: "dateRange",
      label: "Date Range",
      type: "date",
      defaultOperator: "Date Between",
      defaultValue: "01 Apr 2026 - 20 Sep 2026",
    },
    {
      key: "state",
      label: "State",
      type: "select",
      options: ALL_STATES,
    },
    {
      key: "city",
      label: "City",
      type: "select",
      options: ALL_CITIES,
    },
  ],
  duplicate: [
    {
      key: "dateRange",
      label: "Date Range",
      type: "date",
      defaultOperator: "Date Between",
      defaultValue: "01 Apr 2026 - 20 Sep 2026",
    },
    {
      key: "storeCode",
      label: "Store Code",
      type: "text",
      hasCommaNote: true,
    },
    {
      key: "state",
      label: "State",
      type: "select",
      options: ALL_STATES,
    },
    {
      key: "city",
      label: "City",
      type: "select",
      options: ALL_CITIES,
    },
  ],
  tags: [
    {
      key: "tagName",
      label: "Tag Name",
      type: "text",
    },
    {
      key: "tagCode",
      label: "Tag Code",
      type: "text",
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: ["Active", "Inactive"],
    },
  ],
  google_updates: [
    {
      key: "dateRange",
      label: "Date Range",
      type: "date",
      defaultOperator: "Date Between",
      defaultValue: "01 Apr 2026 - 20 Sep 2026",
    },
    {
      key: "storeCode",
      label: "Store Code",
      type: "text",
      hasCommaNote: true,
    },
    {
      key: "updateStatus",
      label: "Update Status",
      type: "select",
      options: ["Pending Review", "Applied", "Rejected"],
    },
  ],
};

interface LocationsAdvancedFilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tabType: FilterTabType;
  onApplyFilters?: (count: number, activeFilters: Record<string, { op: string; val: string }>) => void;
}

export function LocationsAdvancedFilterModal({
  open,
  onOpenChange,
  tabType,
  onApplyFilters,
}: LocationsAdvancedFilterModalProps) {
  const fields = TAB_FIELD_CONFIGS[tabType] || [];

  const [filters, setFilters] = useState<Record<string, { op: string; val: string }>>({});

  const handleUpdateFilter = (key: string, op?: string, val?: string) => {
    setFilters((prev) => {
      const existing = prev[key] || { op: "Operator", val: "" };
      return {
        ...prev,
        [key]: {
          op: op !== undefined ? op : existing.op,
          val: val !== undefined ? val : existing.val,
        },
      };
    });
  };

  const handleClearField = (key: string) => {
    setFilters((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const handleApply = () => {
    const activeCount = Object.values(filters).filter(
      (item) => item.val && item.val.trim().length > 0
    ).length;
    if (onApplyFilters) {
      onApplyFilters(activeCount, filters);
    }
    onOpenChange(false);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white dark:bg-[#141416] border-slate-200 dark:border-[#27272a] text-foreground p-6 shadow-2xl rounded-2xl">
        <DialogHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-200 dark:border-[#27272a]/80">
          <DialogTitle className="text-base font-bold text-foreground">
            Advanced Filter
          </DialogTitle>
        </DialogHeader>

        {/* Filter Rows Form */}
        <div className="space-y-4 py-3 max-h-[65vh] overflow-y-auto pr-1">
          {fields.map((field) => {
            const currentFilter = filters[field.key] || {
              op: field.defaultOperator || "Operator",
              val: field.defaultValue || "",
            };

            return (
              <div key={field.key} className="space-y-1">
                <div className="grid grid-cols-[140px_1fr_1fr_36px] items-center gap-3">
                  {/* Field Label */}
                  <span className="text-xs font-bold text-foreground">
                    {field.label}
                  </span>

                  {/* Operator Dropdown */}
                  <Select
                    value={currentFilter.op}
                    onValueChange={(opVal) => handleUpdateFilter(field.key, opVal, undefined)}
                  >
                    <SelectTrigger className="h-9 bg-white dark:bg-[#09090b] border-slate-300 dark:border-[#27272a] text-xs text-foreground focus:border-blue-500 cursor-pointer">
                      <SelectValue placeholder="Operator" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-[#141416] border-slate-300 dark:border-[#27272a] text-foreground">
                      {field.type === "date" ? (
                        <>
                          <SelectItem value="Date Between">Date Between</SelectItem>
                          <SelectItem value="Equals">Equals</SelectItem>
                          <SelectItem value="Before">Before</SelectItem>
                          <SelectItem value="After">After</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="Operator">Operator</SelectItem>
                          <SelectItem value="Equals">Equals</SelectItem>
                          <SelectItem value="Contains">Contains</SelectItem>
                          <SelectItem value="Starts With">Starts With</SelectItem>
                          <SelectItem value="In List">In List</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>

                  {/* Value Component */}
                  {field.type === "date" ? (
                    <div className="relative flex items-center">
                      <Input
                        value={currentFilter.val}
                        onChange={(e) => handleUpdateFilter(field.key, undefined, e.target.value)}
                        placeholder="Select Date Range"
                        className="h-9 bg-white dark:bg-[#09090b] border-slate-300 dark:border-[#27272a] text-xs text-foreground pr-8 font-mono focus:border-blue-500"
                      />
                      <CalendarIcon className="size-4 text-muted-foreground absolute right-2.5 pointer-events-none" />
                    </div>
                  ) : field.type === "select" ? (
                    <Select
                      value={currentFilter.val}
                      onValueChange={(val) => handleUpdateFilter(field.key, undefined, val)}
                    >
                      <SelectTrigger className="h-9 bg-white dark:bg-[#09090b] border-slate-300 dark:border-[#27272a] text-xs text-foreground focus:border-blue-500 cursor-pointer">
                        <SelectValue placeholder="Value" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-[#141416] border-slate-300 dark:border-[#27272a] text-foreground max-h-48">
                        {field.options?.map((opt) => (
                          <SelectItem key={opt} value={opt} className="cursor-pointer">
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      placeholder="Value"
                      value={currentFilter.val}
                      onChange={(e) => handleUpdateFilter(field.key, undefined, e.target.value)}
                      className="h-9 bg-white dark:bg-[#09090b] border-slate-300 dark:border-[#27272a] text-xs text-foreground focus:border-blue-500"
                    />
                  )}

                  {/* Clear [X] Button matching screenshot yellow/orange border */}
                  <button
                    type="button"
                    onClick={() => handleClearField(field.key)}
                    className="size-8 rounded-md border border-blue-500/60 hover:bg-blue-500/10 flex items-center justify-center text-blue-500 cursor-pointer transition-colors"
                    title="Clear field"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                {/* Comma-separated note if configured */}
                {field.hasCommaNote && (
                  <div className="pl-[152px] text-[11px] text-muted-foreground font-normal">
                    * Use comma-separated values for multiple searches.
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-[#27272a]">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClose}
            className="h-9 border-slate-300 dark:border-[#3f3f46] bg-white dark:bg-[#18181b] hover:bg-slate-100 dark:hover:bg-[#27272a] text-foreground text-xs font-semibold px-4 cursor-pointer"
          >
            Close
          </Button>

          <Button
            size="sm"
            onClick={handleApply}
            className="h-9 bg-blue-500 hover:bg-blue-600 text-black font-extrabold text-xs px-6 cursor-pointer rounded-md shadow-md"
          >
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
