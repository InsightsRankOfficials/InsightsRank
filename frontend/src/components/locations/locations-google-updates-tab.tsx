import { useState } from "react";
import { EmptyTableRow } from "@/components/ui/empty-state";
import { Check, Filter, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LocationsAdvancedFilterModal } from "./locations-advanced-filter-modal";

export function LocationsGoogleUpdatesTab() {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [appliedFilterCount, setAppliedFilterCount] = useState(0);
  const [filterData, setFilterData] = useState<Record<string, { op: string; val: string }>>({});

  const updates = [
    {
      id: "upd-1",
      location: "Demo Store 127, Mumbai",
      field: "Business Hours",
      suggestedValue: "Mon-Sat: 09:30 AM - 09:30 PM, Sun: 11:00 AM - 07:00 PM",
      currentValue: "Mon-Sat: 10:00 AM - 09:00 PM, Sun: Closed",
      source: "Google Maps User Suggestion",
      date: "Sep 12, 2026",
    },
    {
      id: "upd-2",
      location: "Demo Store 299, Delhi",
      field: "Phone Number",
      suggestedValue: "+91 83687 61913",
      currentValue: "+91 11 2345 6789",
      source: "Google Automated Verification",
      date: "Sep 11, 2026",
    },
  ];

  return (
    <div className="rounded-2xl bg-[#f4f4f6] dark:bg-[#141416] p-6 sm:p-8 space-y-6 shadow-xl border border-slate-200/80 dark:border-transparent">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Google Updates</h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Review and accept Google's suggested edits before they publish to your business listings.
          </p>
        </div>

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
      </div>

      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-secondary/30 text-muted-foreground font-semibold">
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Field Changed</th>
                <th className="py-3 px-4">Google Suggested Value</th>
                <th className="py-3 px-4">Current Value</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {updates.length === 0 ? (
                <EmptyTableRow
                  colSpan={5}
                  description="No pending Google updates match your filter criteria."
                />
              ) : (
                updates.map((item) => (
                <tr key={item.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-foreground cursor-pointer hover:text-blue-500 transition-colors">
                    {item.location}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400 font-semibold text-[11px]">
                      {item.field}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-emerald-400 font-medium">{item.suggestedValue}</td>
                  <td className="py-3.5 px-4 text-muted-foreground line-through">{item.currentValue}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => toast.success(`Accepted Google edit for ${item.location}`)}
                        className="h-7 px-2.5 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-1 cursor-pointer"
                      >
                        <Check className="size-3" /> Accept
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toast.info(`Rejected Google edit for ${item.location}`)}
                        className="h-7 px-2.5 text-[11px] border-border text-muted-foreground hover:text-foreground gap-1 cursor-pointer"
                      >
                        <X className="size-3" /> Reject
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
        tabType="google_updates"
        onApplyFilters={(count, data) => {
          setAppliedFilterCount(count);
          setFilterData(data);
        }}
      />
    </div>
  );
}
