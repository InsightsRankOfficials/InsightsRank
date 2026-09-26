import React, { useState } from "react";
import {
  Plus,
  Filter,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Search,
  Edit2,
  Trash2,
  ArrowLeft,
  Home,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AIPromptItem, INITIAL_AI_PROMPTS } from "@/data/settings-analytics";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdvancedFilterModal } from "@/components/reviews/advanced-filter-modal";

interface AIPromptsListViewProps {
  onBack: () => void;
  onAddPrompt: () => void;
  onEditPrompt: (prompt: AIPromptItem) => void;
  promptsList: AIPromptItem[];
  onDeletePrompt: (id: string) => void;
}

export function AIPromptsListView({
  onBack,
  onAddPrompt,
  onEditPrompt,
  promptsList,
  onDeletePrompt,
}: AIPromptsListViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(30);

  // Filter modal state
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  // Sorting
  const [sortField, setSortField] = useState<keyof AIPromptItem>("name");
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (field: keyof AIPromptItem) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const filteredPrompts = promptsList.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sentiment.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.tone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedPrompts = [...filteredPrompts].sort((a, b) => {
    const valA = String(a[sortField] || "").toLowerCase();
    const valB = String(b[sortField] || "").toLowerCase();
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedPrompts.length / pageSize) || 1;
  const paginatedPrompts = sortedPrompts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200 pb-16">
      {/* Breadcrumb Navigation matching Locations section */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground px-1 pb-1">
        <Home
          className="size-3.5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
          onClick={onBack}
        />
        <ChevronRight className="size-3 text-muted-foreground/60" />
        <span onClick={onBack} className="cursor-pointer hover:text-foreground font-medium">
          Settings
        </span>
        <ChevronRight className="size-3 text-muted-foreground/60" />
        <span className="font-semibold text-foreground">AI Prompts</span>
      </div>

      {/* Rounded Off-Black Card Container wrapping main content */}
      <div className="rounded-2xl bg-card dark:bg-[#141416] p-6 sm:p-8 space-y-6 shadow-xl border border-border">
        {/* Top Header & Action Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">AI Prompts</h1>
            <p className="mt-0.5 text-xs text-muted-foreground">Manage and configure AI response generation prompts and system rules.</p>
          </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Filter Button */}
          <button
            onClick={() => setFilterModalOpen(true)}
            className="px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-secondary text-xs font-semibold text-foreground flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Filter className="size-3.5 text-muted-foreground" />
            <span>Filter</span>
            <span className="size-4 rounded-full bg-blue-500 text-black text-[10px] font-extrabold flex items-center justify-center tnum">
              {activeFilterCount}
            </span>
          </button>

          {/* Add Prompt Button */}
          <button
            type="button"
            onClick={onAddPrompt}
            className="px-4 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-black text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="size-4" />
            Add Prompt
          </button>

          <button
            type="button"
            onClick={onBack}
            className="px-3.5 py-1.5 rounded-lg border border-border bg-background hover:bg-secondary text-xs font-semibold text-foreground flex items-center gap-1 transition-colors cursor-pointer"
          >
            <ArrowLeft className="size-3.5" />
            Back
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
          placeholder="Search by prompt name, sentiment, tone..."
          className="w-full pl-9 pr-4 py-1.5 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
        />
      </div>

      {/* Data Table matching Screenshot 2 */}
      <div className="rounded-xl border border-border dark:border-[#27272a] bg-card dark:bg-[#121214] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border dark:border-[#27272a] bg-secondary/30 text-muted-foreground font-semibold select-none">
                <th className="py-3 px-3 w-10 text-center">#</th>
                <th className="py-3 px-4 cursor-pointer hover:text-foreground" onClick={() => handleSort("name")}>
                  Name <span className="text-[10px] opacity-60">⇅</span>
                </th>
                <th className="py-3 px-3 cursor-pointer hover:text-foreground" onClick={() => handleSort("sentiment")}>
                  Sentiment <span className="text-[10px] opacity-60">⇅</span>
                </th>
                <th className="py-3 px-3">Rating</th>
                <th className="py-3 px-3 cursor-pointer hover:text-foreground" onClick={() => handleSort("tone")}>
                  Tone <span className="text-[10px] opacity-60">⇅</span>
                </th>
                <th className="py-3 px-3 cursor-pointer hover:text-foreground" onClick={() => handleSort("wordLength")}>
                  Word Length <span className="text-[10px] opacity-60">⇅</span>
                </th>
                <th className="py-3 px-3 cursor-pointer hover:text-foreground" onClick={() => handleSort("status")}>
                  Status <span className="text-[10px] opacity-60">⇅</span>
                </th>
                <th className="py-3 px-3 cursor-pointer hover:text-foreground" onClick={() => handleSort("lastModifiedAt")}>
                  Last Modified At <span className="text-[10px] opacity-60">⇅</span>
                </th>
                <th className="py-3 px-3 text-center w-12">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border/50 dark:divide-[#27272a]/50 text-foreground">
              {paginatedPrompts.map((item, idx) => {
                const itemIndex = (currentPage - 1) * pageSize + idx + 1;
                return (
                  <tr key={item.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="py-3 px-3 text-center text-muted-foreground font-mono">{itemIndex}</td>
                    <td className="py-3 px-4 font-bold text-foreground">{item.name}</td>
                    <td className="py-3 px-3 text-muted-foreground">{item.sentiment}</td>
                    <td className="py-3 px-3 text-muted-foreground font-medium">{item.rating}</td>
                    <td className="py-3 px-3 text-muted-foreground">{item.tone}</td>
                    <td className="py-3 px-3 text-muted-foreground">{item.wordLength}</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-muted-foreground">{item.lastModifiedAt}</td>
                    <td className="py-3 px-3 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer">
                            <MoreVertical className="size-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover border-border text-popover-foreground text-xs">
                          <DropdownMenuItem
                            onClick={() => onEditPrompt(item)}
                            className="hover:bg-secondary cursor-pointer flex items-center gap-2"
                          >
                            <Edit2 className="size-3.5 text-blue-500" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDeletePrompt(item.id)}
                            className="hover:bg-secondary cursor-pointer text-rose-500 flex items-center gap-2"
                          >
                            <Trash2 className="size-3.5" /> Delete
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
      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-border text-xs">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-[11px]">Rows per page:</span>
          <Select
            value={String(pageSize)}
            onValueChange={(val) => {
              setPageSize(Number(val));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-7 w-16 bg-background border-border text-foreground text-xs cursor-pointer">
              <SelectValue placeholder="30" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border text-popover-foreground text-xs">
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="30">30</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-muted-foreground text-[11px] ml-2">
            Showing <span className="font-semibold text-foreground">{sortedPrompts.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</span> -{" "}
            <span className="font-semibold text-foreground">{Math.min(currentPage * pageSize, sortedPrompts.length)}</span> of{" "}
            <span className="font-semibold text-foreground">{sortedPrompts.length}</span> items
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="h-7 w-7 p-0 border-border text-foreground hover:bg-secondary disabled:opacity-40"
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
                  : "bg-background text-muted-foreground hover:text-foreground border border-border hover:bg-secondary"
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
            className="h-7 w-7 p-0 border-border text-foreground hover:bg-secondary disabled:opacity-40"
          >
            <ChevronRight className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* Advanced Filter Modal */}
      <AdvancedFilterModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        onApplyFilters={(count) => setActiveFilterCount(count)}
      />
    </div>
  </div>
);
}
