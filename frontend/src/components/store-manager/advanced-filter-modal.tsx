import React, { useState } from "react";
import { X } from "lucide-react";

export interface FilterCriteria {
  firstNameOp: string;
  firstNameVal: string;
  lastNameOp: string;
  lastNameVal: string;
  emailOp: string;
  emailVal: string;
  isActiveOp: string;
  isActiveVal: string;
}

interface AdvancedFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterCriteria) => void;
  initialFilters?: FilterCriteria;
}

const DEFAULT_FILTERS: FilterCriteria = {
  firstNameOp: "contains",
  firstNameVal: "",
  lastNameOp: "contains",
  lastNameVal: "",
  emailOp: "contains",
  emailVal: "",
  isActiveOp: "equals",
  isActiveVal: "all",
};

export function AdvancedFilterModal({
  isOpen,
  onClose,
  onApply,
  initialFilters = DEFAULT_FILTERS,
}: AdvancedFilterModalProps) {
  const [filters, setFilters] = useState<FilterCriteria>(initialFilters);

  if (!isOpen) return null;

  const handleResetRow = (field: keyof FilterCriteria) => {
    setFilters((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl rounded-xl border border-border dark:border-zinc-800 bg-card dark:bg-[#121214] p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200 text-foreground">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border dark:border-zinc-800/80">
          <h3 className="text-base font-bold text-foreground">Advanced Filter</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filter Rows */}
        <div className="space-y-4">
          {/* First Name */}
          <div className="space-y-1">
            <div className="grid grid-cols-12 gap-2 items-center">
              <label className="col-span-3 text-xs font-semibold text-foreground">
                First Name
              </label>
              <div className="col-span-4">
                <select
                  value={filters.firstNameOp}
                  onChange={(e) => setFilters({ ...filters, firstNameOp: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-border dark:border-zinc-800 bg-background dark:bg-[#09090b] text-xs text-foreground focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="contains" className="bg-popover text-foreground">Contains</option>
                  <option value="equals" className="bg-popover text-foreground">Equals</option>
                  <option value="starts_with" className="bg-popover text-foreground">Starts with</option>
                  <option value="ends_with" className="bg-popover text-foreground">Ends with</option>
                </select>
              </div>
              <div className="col-span-4">
                <input
                  type="text"
                  value={filters.firstNameVal}
                  onChange={(e) => setFilters({ ...filters, firstNameVal: e.target.value })}
                  placeholder="Value"
                  className="w-full px-3 py-1.5 rounded-lg border border-border dark:border-zinc-800 bg-background dark:bg-[#09090b] text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="col-span-1 text-right">
                <button
                  type="button"
                  onClick={() => handleResetRow("firstNameVal")}
                  className="p-1 rounded border border-blue-500/40 text-blue-500 hover:bg-blue-500/10 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground pl-28">
              * Use comma-separated values for multiple searches.
            </p>
          </div>

          {/* Last Name */}
          <div className="space-y-1">
            <div className="grid grid-cols-12 gap-2 items-center">
              <label className="col-span-3 text-xs font-semibold text-foreground">
                Last Name
              </label>
              <div className="col-span-4">
                <select
                  value={filters.lastNameOp}
                  onChange={(e) => setFilters({ ...filters, lastNameOp: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-border dark:border-zinc-800 bg-background dark:bg-[#09090b] text-xs text-foreground focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="contains" className="bg-popover text-foreground">Contains</option>
                  <option value="equals" className="bg-popover text-foreground">Equals</option>
                  <option value="starts_with" className="bg-popover text-foreground">Starts with</option>
                  <option value="ends_with" className="bg-popover text-foreground">Ends with</option>
                </select>
              </div>
              <div className="col-span-4">
                <input
                  type="text"
                  value={filters.lastNameVal}
                  onChange={(e) => setFilters({ ...filters, lastNameVal: e.target.value })}
                  placeholder="Value"
                  className="w-full px-3 py-1.5 rounded-lg border border-border dark:border-zinc-800 bg-background dark:bg-[#09090b] text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="col-span-1 text-right">
                <button
                  type="button"
                  onClick={() => handleResetRow("lastNameVal")}
                  className="p-1 rounded border border-blue-500/40 text-blue-500 hover:bg-blue-500/10 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground pl-28">
              * Use comma-separated values for multiple searches.
            </p>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <div className="grid grid-cols-12 gap-2 items-center">
              <label className="col-span-3 text-xs font-semibold text-foreground">
                Email
              </label>
              <div className="col-span-4">
                <select
                  value={filters.emailOp}
                  onChange={(e) => setFilters({ ...filters, emailOp: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-border dark:border-zinc-800 bg-background dark:bg-[#09090b] text-xs text-foreground focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="contains" className="bg-popover text-foreground">Contains</option>
                  <option value="equals" className="bg-popover text-foreground">Equals</option>
                  <option value="starts_with" className="bg-popover text-foreground">Starts with</option>
                  <option value="ends_with" className="bg-popover text-foreground">Ends with</option>
                </select>
              </div>
              <div className="col-span-4">
                <input
                  type="text"
                  value={filters.emailVal}
                  onChange={(e) => setFilters({ ...filters, emailVal: e.target.value })}
                  placeholder="Value"
                  className="w-full px-3 py-1.5 rounded-lg border border-border dark:border-zinc-800 bg-background dark:bg-[#09090b] text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="col-span-1 text-right">
                <button
                  type="button"
                  onClick={() => handleResetRow("emailVal")}
                  className="p-1 rounded border border-blue-500/40 text-blue-500 hover:bg-blue-500/10 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground pl-28">
              * Use comma-separated values for multiple searches.
            </p>
          </div>

          {/* Is Active? */}
          <div className="grid grid-cols-12 gap-2 items-center pt-1">
            <label className="col-span-3 text-xs font-semibold text-foreground">
              Is Active?
            </label>
            <div className="col-span-4">
              <select
                value={filters.isActiveOp}
                onChange={(e) => setFilters({ ...filters, isActiveOp: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-border dark:border-zinc-800 bg-background dark:bg-[#09090b] text-xs text-foreground focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="equals" className="bg-popover text-foreground">Equals</option>
              </select>
            </div>
            <div className="col-span-4">
              <select
                value={filters.isActiveVal}
                onChange={(e) => setFilters({ ...filters, isActiveVal: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-border dark:border-zinc-800 bg-background dark:bg-[#09090b] text-xs text-foreground focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="all" className="bg-popover text-foreground">Value</option>
                <option value="Active" className="bg-popover text-foreground">Active</option>
                <option value="Inactive" className="bg-popover text-foreground">Inactive</option>
              </select>
            </div>
            <div className="col-span-1 text-right">
              <button
                type="button"
                onClick={() => setFilters({ ...filters, isActiveVal: "all" })}
                className="p-1 rounded border border-blue-500/40 text-blue-500 hover:bg-blue-500/10 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border dark:border-zinc-800/80">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-border dark:border-zinc-700 bg-background dark:bg-zinc-800/60 hover:bg-secondary text-xs font-semibold text-foreground transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-5 py-1.5 rounded-lg bg-blue-400 hover:bg-blue-500 text-xs font-bold text-black transition-colors shadow-sm cursor-pointer"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
