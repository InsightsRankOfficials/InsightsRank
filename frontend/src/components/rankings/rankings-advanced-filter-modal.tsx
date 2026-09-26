import { useState } from "react";
import { Calendar, X } from "lucide-react";
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
import { DateRangePicker } from "@/components/ui/date-range-picker";

interface RankingsAdvancedFilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type?: "reports" | "detail";
  onApplyFilters?: (count: number) => void;
}

export function RankingsAdvancedFilterModal({
  open,
  onOpenChange,
  type = "reports",
  onApplyFilters,
}: RankingsAdvancedFilterModalProps) {
  // Fields for Reports Tab (Screenshot 3) vs Report Detail Tab (Screenshot 5)
  const reportFields = [
    { label: "Store Name", key: "storeName", type: "text" },
    { label: "Store Code", key: "storeCode", type: "text" },
    { label: "Tags", key: "tags", type: "select", options: ["All Tags", "Primary Store", "Secondary"] },
    { label: "Store Status", key: "storeStatus", type: "select", options: ["All Status", "Active", "Inactive"] },
    { label: "Date Range", key: "dateRange", type: "date" },
  ];

  const detailFields = [
    { label: "Date Range", key: "dateRange", type: "date" },
    { label: "Keywords", key: "keywords", type: "select", options: ["All Keywords", "footwear shop near me", "ladies shoes", "men shoes", "shoe shop near me", "sports shoes"] },
    { label: "Competitors", key: "competitors", type: "select", options: ["All Competitors", "Bata", "Comet", "RedTape"] },
  ];

  const fields = type === "reports" ? reportFields : detailFields;

  const [filterValues, setFilterValues] = useState<
    Record<string, { op: string; val: string }>
  >({
    dateRange: { op: "date_between", val: "01 Apr 2026 - 17 Sep 2026" },
  });

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-card dark:bg-[#121214] border-border text-foreground p-5 sm:p-6 shadow-2xl rounded-xl">
        <DialogHeader className="border-b border-border pb-3 flex flex-row items-center justify-between">
          <DialogTitle className="text-base font-bold text-foreground">
            Advanced Filter
          </DialogTitle>
        </DialogHeader>

        {/* Filter Rows Form matching Screenshot 3 & 5 */}
        <div className="space-y-4 my-2 max-h-[60vh] overflow-y-auto px-1 pt-3 pb-1">
          {fields.map((field) => {
            const current = filterValues[field.key] ?? { op: "contains", val: "" };

            return (
              <div key={field.key} className="space-y-1">
                <div className="grid grid-cols-[110px_1fr_1fr_32px] items-center gap-2 text-xs">
                  <span className="font-semibold text-muted-foreground truncate">
                    {field.label}
                  </span>

                  {/* Operator Selection */}
                  <Select
                    value={current.op || (field.type === "date" ? "date_between" : "contains")}
                    onValueChange={(opVal) =>
                      setFilterValues((prev) => ({
                        ...prev,
                        [field.key]: { op: opVal, val: prev[field.key]?.val ?? "" },
                      }))
                    }
                  >
                    <SelectTrigger className="h-8 bg-background border-border text-xs cursor-pointer">
                      <SelectValue placeholder="Operator" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border text-popover-foreground text-xs">
                      {field.type === "date" ? (
                        <SelectItem value="date_between" className="cursor-pointer">
                          Date Between
                        </SelectItem>
                      ) : (
                        <>
                          <SelectItem value="contains" className="cursor-pointer">
                            Contains
                          </SelectItem>
                          <SelectItem value="equals" className="cursor-pointer">
                            Equals Exact
                          </SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>

                  {/* Value Field (Input, Select, or Date Picker Display) */}
                  {field.type === "select" ? (
                    <Select
                      value={current.val}
                      onValueChange={(val) =>
                        setFilterValues((prev) => ({
                          ...prev,
                          [field.key]: { op: current.op, val },
                        }))
                      }
                    >
                      <SelectTrigger className="h-8 bg-background border-border text-xs cursor-pointer">
                        <SelectValue placeholder="Value" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border text-popover-foreground text-xs">
                        {field.options?.map((opt) => (
                          <SelectItem key={opt} value={opt} className="cursor-pointer">
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : field.type === "date" ? (
                    <DateRangePicker
                      variant="input"
                      value={current.val || "01 Apr 2026 - 17 Sep 2026"}
                      onChange={(newVal) =>
                        setFilterValues((prev) => ({
                          ...prev,
                          [field.key]: { op: current.op, val: newVal },
                        }))
                      }
                    />
                  ) : (
                    <input
                      type="text"
                      placeholder="Value"
                      value={current.val}
                      onChange={(e) =>
                        setFilterValues((prev) => ({
                          ...prev,
                          [field.key]: { op: current.op, val: e.target.value },
                        }))
                      }
                      className="h-8 rounded bg-background border border-border px-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  )}

                  {/* Remove Row Action */}
                  <button
                    onClick={() => handleClear(field.key)}
                    className="size-8 rounded border border-red-500/40 text-red-400 hover:bg-red-500/10 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>

                {field.key === "storeName" || field.key === "storeCode" ? (
                  <p className="text-[10px] text-muted-foreground italic pl-[118px]">
                    * Use comma-separated values for multiple searches.
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-8 border-border text-xs font-semibold cursor-pointer bg-background hover:bg-secondary text-foreground"
          >
            Close
          </Button>

          <Button
            size="sm"
            onClick={handleApply}
            className="h-8 bg-blue-500 hover:bg-blue-600 text-black font-bold text-xs px-5 cursor-pointer"
          >
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
