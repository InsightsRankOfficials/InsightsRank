import React, { useState } from "react";
import { REVIEW_OPTIONS_LIST, ReviewOptionItem } from "@/data/review-assistant-analytics";
import {
  Plus,
  Filter,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Search,
  Edit2,
  Trash2,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdvancedFilterModal } from "@/components/reviews/advanced-filter-modal";

export function OptionsTab() {
  const [options, setOptions] = useState<ReviewOptionItem[]>(REVIEW_OPTIONS_LIST);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(30);

  // Filter modal state
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  // Sorting
  const [sortField, setSortField] = useState<keyof ReviewOptionItem>("sequence");
  const [sortAsc, setSortAsc] = useState(false);

  // Add Option Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newOptionName, setNewOptionName] = useState("");
  const [newSequence, setNewSequence] = useState(options.length + 1);
  const [isActive, setIsActive] = useState(true);

  const handleSort = (field: keyof ReviewOptionItem) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const filteredOptions = options.filter((o) =>
    o.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedOptions = [...filteredOptions].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    if (typeof valA === "number" && typeof valB === "number") {
      return sortAsc ? valA - valB : valB - valA;
    }
    const strA = String(valA || "").toLowerCase();
    const strB = String(valB || "").toLowerCase();
    return sortAsc ? strA.localeCompare(strB) : strB.localeCompare(strA);
  });

  const totalPages = Math.ceil(sortedOptions.length / pageSize) || 1;
  const paginatedOptions = sortedOptions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleDeleteOption = (id: string) => {
    setOptions((prev) => prev.filter((o) => o.id !== id));
  };

  const handleAddOption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOptionName.trim()) return;

    const newOpt: ReviewOptionItem = {
      id: `opt-${Date.now()}`,
      name: newOptionName,
      sequence: Number(newSequence),
      status: isActive ? "Active" : "Inactive",
      lastModifiedAt: "Just now",
    };

    setOptions((prev) => [newOpt, ...prev]);
    setNewOptionName("");
    setIsAddModalOpen(false);
  };

  return (
    <div className="rounded-2xl bg-card dark:bg-[#141416] p-6 sm:p-8 space-y-6 shadow-xl border border-border">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Options</h1>
          <p className="mt-0.5 text-xs text-muted-foreground">Manage review generator options, sequences, and active statuses</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Functional Filter Button matching Review Logs */}
          <button
            onClick={() => setFilterModalOpen(true)}
            className="px-3 py-1.5 rounded-lg border border-border dark:border-[#27272a] bg-background dark:bg-[#121214] hover:bg-secondary/40 text-xs font-semibold text-foreground flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Filter className="size-3.5 text-muted-foreground" />
            <span>Filter</span>
            <span className="size-4 rounded-full bg-blue-400 text-black text-[10px] font-extrabold flex items-center justify-center tnum">
              {activeFilterCount}
            </span>
          </button>

          {/* Add Option Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-1.5 rounded-lg bg-blue-400 hover:bg-blue-500 text-black text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="size-4" />
            Add Option
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
          placeholder="Search by option name..."
          className="w-full pl-9 pr-4 py-1.5 rounded-lg border border-border dark:border-[#27272a] bg-background dark:bg-[#121214] text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
        />
      </div>

      {/* Data Table */}
      <div className="rounded-xl border border-border dark:border-[#27272a] bg-card dark:bg-[#121214] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border dark:border-[#27272a] bg-secondary/30 text-muted-foreground font-semibold select-none">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4 cursor-pointer hover:text-foreground" onClick={() => handleSort("name")}>
                  Name <span className="text-[10px] opacity-60">⇅</span>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:text-foreground" onClick={() => handleSort("sequence")}>
                  Sequence <span className="text-[10px] opacity-60">⇅</span>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:text-foreground" onClick={() => handleSort("status")}>
                  Status <span className="text-[10px] opacity-60">⇅</span>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:text-foreground" onClick={() => handleSort("lastModifiedAt")}>
                  Last Modified At <span className="text-[10px] opacity-60">⇅</span>
                </th>
                <th className="py-3 px-4 text-center w-12">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border/50 text-foreground">
              {paginatedOptions.map((opt, idx) => {
                const itemIndex = (currentPage - 1) * pageSize + idx + 1;
                return (
                  <tr key={opt.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="py-3 px-4 text-center text-muted-foreground font-mono">{itemIndex}</td>
                    <td className="py-3 px-4 font-bold text-foreground">{opt.name}</td>
                    <td className="py-3 px-4 font-mono font-bold text-foreground">{opt.sequence}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                        {opt.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{opt.lastModifiedAt}</td>
                    <td className="py-3 px-4 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors cursor-pointer">
                            <MoreVertical className="size-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover dark:bg-[#18181b] border-border dark:border-[#27272a] text-foreground text-xs">
                          <DropdownMenuItem className="hover:bg-secondary/40 dark:hover:bg-[#27272a] cursor-pointer flex items-center gap-2">
                            <Edit2 className="size-3.5 text-blue-500 dark:text-blue-400" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteOption(opt.id)}
                            className="hover:bg-secondary/40 dark:hover:bg-[#27272a] cursor-pointer text-rose-500 dark:text-rose-400 flex items-center gap-2"
                          >
                            <Trash2 className="size-3.5" /> Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-border dark:border-[#27272a] text-xs">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-[11px]">Rows per page:</span>
          <Select
            value={String(pageSize)}
            onValueChange={(val) => {
              setPageSize(Number(val));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-7 w-16 bg-background dark:bg-[#18181b] border-border dark:border-[#27272a] text-xs cursor-pointer">
              <SelectValue placeholder="30" />
            </SelectTrigger>
            <SelectContent className="bg-popover dark:bg-[#18181b] border-border dark:border-[#27272a] text-xs">
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="30">30</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-muted-foreground text-[11px] ml-2">
            Showing <span className="font-semibold text-foreground">{sortedOptions.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</span> -{" "}
            <span className="font-semibold text-foreground">{Math.min(currentPage * pageSize, sortedOptions.length)}</span> of{" "}
            <span className="font-semibold text-foreground">{sortedOptions.length}</span> items
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="h-7 w-7 p-0 border-border dark:border-[#27272a] disabled:opacity-40"
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
                  : "bg-background dark:bg-[#18181b] text-muted-foreground hover:text-foreground border border-border dark:border-[#27272a]"
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
            className="h-7 w-7 p-0 border-border dark:border-[#27272a] disabled:opacity-40"
          >
            <ChevronRight className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* Add Option Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <form
            onSubmit={handleAddOption}
            className="w-full max-w-md rounded-xl border border-border dark:border-zinc-800 bg-card dark:bg-[#141416] p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between pb-2 border-b border-border dark:border-zinc-800">
              <h3 className="text-base font-bold text-foreground">Add Option</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Option Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newOptionName}
                  onChange={(e) => setNewOptionName(e.target.value)}
                  placeholder="e.g. Store Experience"
                  className="w-full px-3 py-2 rounded-lg border border-border dark:border-[#27272a] bg-background dark:bg-[#09090b] text-xs text-foreground focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Sequence Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={newSequence}
                  onChange={(e) => setNewSequence(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-border dark:border-[#27272a] bg-background dark:bg-[#09090b] text-xs text-foreground focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isActive ? "bg-blue-400" : "bg-zinc-300 dark:bg-zinc-700"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-background dark:bg-black shadow ring-0 transition duration-200 ease-in-out ${
                      isActive ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
                <span className="text-xs font-bold text-foreground">Is Active?</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-1.5 rounded-lg border border-border dark:border-[#27272a] bg-background dark:bg-[#18181b] hover:bg-secondary/40 text-xs font-semibold text-foreground cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-blue-400 hover:bg-blue-500 text-black text-xs font-bold cursor-pointer shadow-sm"
              >
                Save Option
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Advanced Filter Modal matching Review Logs & Reviews section */}
      <AdvancedFilterModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        onApplyFilters={(count) => setActiveFilterCount(count)}
      />
    </div>
  );
}
