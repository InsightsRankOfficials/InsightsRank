import { useState } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AdvancedFilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters?: (count: number) => void;
}

export function AdvancedFilterModal({
  open,
  onOpenChange,
  onApplyFilters,
}: AdvancedFilterModalProps) {
  const fields = [
    { label: "Location Account", key: "locAccount" },
    { label: "Store Code", key: "storeCode" },
    { label: "Store Name", key: "storeName" },
    { label: "City", key: "city" },
    { label: "State", key: "state" },
    { label: "Tags", key: "tags" },
    { label: "Store Status", key: "storeStatus" },
    { label: "Reviewer Name", key: "reviewerName" },
    { label: "Comment Date", key: "commentDate" },
    { label: "Category", key: "category" },
  ];

  const [filterValues, setFilterValues] = useState<
    Record<string, { op: string; val: string }>
  >({});

  const handleClear = (key: string) => {
    setFilterValues((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const handleApply = () => {
    const activeCount = Object.values(filterValues).filter(
      (item) => item.val.trim().length > 0
    ).length;
    if (onApplyFilters) {
      onApplyFilters(activeCount);
    }
    onOpenChange(false);
  };

  const handleResetAll = () => {
    setFilterValues({});
    if (onApplyFilters) {
      onApplyFilters(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl bg-card dark:bg-[#121214] border-border text-foreground p-6 sm:p-7 shadow-2xl">
        <DialogHeader className="border-b border-border pb-3 flex flex-row items-center justify-between">
          <DialogTitle className="text-base font-bold text-foreground">
            Advanced Filter
          </DialogTitle>
          {Object.keys(filterValues).length > 0 && (
            <button
              onClick={handleResetAll}
              className="text-xs text-blue-500 hover:underline cursor-pointer font-semibold"
            >
              Reset All
            </button>
          )}
        </DialogHeader>

        {/* Filter Rows Form matching Screenshot 4 */}
        <div className="space-y-3 my-2 max-h-[60vh] overflow-y-auto px-1 pt-3 pb-1">
          {fields.map((field) => (
            <div
              key={field.key}
              className="grid grid-cols-[130px_1fr_1fr_32px] items-center gap-2 text-xs"
            >
              <span className="font-semibold text-muted-foreground truncate">
                {field.label}
              </span>

              {/* Shadcn Select for Operator */}
              <Select
                value={filterValues[field.key]?.op ?? "contains"}
                onValueChange={(opVal) =>
                  setFilterValues((prev) => ({
                    ...prev,
                    [field.key]: { op: opVal, val: prev[field.key]?.val ?? "" },
                  }))
                }
              >
                <SelectTrigger className="h-8 bg-background border-border text-foreground text-xs cursor-pointer">
                  <SelectValue placeholder="Operator" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border text-popover-foreground text-xs">
                  <SelectItem value="contains" className="cursor-pointer">
                    Contains
                  </SelectItem>

                  <SelectItem value="equals_exact" className="cursor-pointer">
                    Equals Exact
                  </SelectItem>
                  <SelectItem value="starts_with" className="cursor-pointer">
                    Starts With
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Text Input for Value */}
              <input
                type="text"
                placeholder="Value"
                value={filterValues[field.key]?.val ?? ""}
                onChange={(e) =>
                  setFilterValues((prev) => ({
                    ...prev,
                    [field.key]: {
                      op: prev[field.key]?.op ?? "contains",
                      val: e.target.value,
                    },
                  }))
                }
                className="h-8 rounded bg-background border border-border px-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />

              <button
                onClick={() => handleClear(field.key)}
                className="size-8 rounded border border-blue-500/30 text-blue-500 hover:bg-blue-500/10 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
        </div>

        <p className="text-[10px] text-muted-foreground italic">
          * Use comma-separated values for multiple searches.
        </p>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-8 border-border text-xs font-semibold cursor-pointer"
          >
            Close
          </Button>

          <Button
            size="sm"
            onClick={handleApply}
            className="h-8 bg-blue-500 hover:bg-blue-600 text-black font-semibold text-xs px-5 cursor-pointer"
          >
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
