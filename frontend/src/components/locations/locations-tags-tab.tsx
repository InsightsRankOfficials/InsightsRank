import { useState } from "react";
import { EmptyTableRow } from "@/components/ui/empty-state";
import {
  AlertTriangle,
  ArrowUpDown,
  Check,
  ChevronDown,
  ChevronRight,
  Edit,
  Filter,
  Home,
  MoreVertical,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { LocationsAdvancedFilterModal } from "./locations-advanced-filter-modal";

export function LocationsTagsTab() {
  const [activeView, setActiveView] = useState<"list" | "create">("list");

  // Advanced Filter Modal state
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [appliedFilterCount, setAppliedFilterCount] = useState(0);
  const [filterData, setFilterData] = useState<Record<string, { op: string; val: string }>>({});

  // Tags State
  const [tagsList, setTagsList] = useState([
    { id: "1", name: "new test", code: "new-test", assigned: 1, status: "Active" },
    { id: "2", name: "test", code: "test", assigned: 1, status: "Active" },
    { id: "3", name: "Flagship Store", code: "flagship", assigned: 42, status: "Active" },
    { id: "4", name: "Tier-1 Metro", code: "metro-1", assigned: 128, status: "Active" },
    { id: "5", name: "Express Outlet", code: "express", assigned: 65, status: "Active" },
  ]);

  // Form State for Create Tag
  const [tagName, setTagName] = useState("");
  const [tagCode, setTagCode] = useState("");
  const [isCodeCustomized, setIsCodeCustomized] = useState(false);

  // Edit Tag Modal State
  const [editingTag, setEditingTag] = useState<{ id: string; name: string; code: string } | null>(null);
  const [editName, setEditName] = useState("");

  // Toggle Status Confirmation Modal State
  const [toggleConfirmTag, setToggleConfirmTag] = useState<{ id: string; name: string; status: string } | null>(null);

  const handleNameChange = (val: string) => {
    setTagName(val);
    if (!isCodeCustomized) {
      const generated = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setTagCode(generated);
    }
  };

  const handleCodeChange = (val: string) => {
    setTagCode(val);
    setIsCodeCustomized(true);
  };

  const handleOpenCreate = () => {
    setTagName("");
    setTagCode("");
    setIsCodeCustomized(false);
    setActiveView("create");
  };

  const handleSaveTag = () => {
    if (!tagName.trim()) {
      toast.error("Please enter a tag name");
      return;
    }

    const finalCode = (
      tagCode.trim() ||
      tagName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") ||
      `tag-${Date.now()}`
    ).toLowerCase();

    // Check duplicate code
    if (tagsList.some((t) => t.code.toLowerCase() === finalCode)) {
      toast.error(`Tag code "${finalCode}" already exists! Please use a unique code.`);
      return;
    }

    const newTag = {
      id: String(tagsList.length + 1),
      name: tagName.trim(),
      code: finalCode,
      assigned: 0,
      status: "Active",
    };

    setTagsList([newTag, ...tagsList]);
    toast.success(`Tag "${newTag.name}" created successfully!`);
    setActiveView("list");
  };

  // Handle Edit Tag
  const handleOpenEditTag = (tag: { id: string; name: string; code: string }) => {
    setEditingTag(tag);
    setEditName(tag.name);
  };

  const handleSaveEditTag = () => {
    if (!editingTag || !editName.trim()) {
      toast.error("Tag name cannot be empty");
      return;
    }

    setTagsList((prev) =>
      prev.map((t) => (t.id === editingTag.id ? { ...t, name: editName.trim() } : t))
    );
    toast.success("Tag updated successfully!");
    setEditingTag(null);
  };

  // Handle Toggle Status
  const handleConfirmToggleStatus = () => {
    if (!toggleConfirmTag) return;

    setTagsList((prev) =>
      prev.map((t) => {
        if (t.id === toggleConfirmTag.id) {
          const nextStatus = t.status === "Active" ? "Inactive" : "Active";
          toast.success(`Tag "${t.name}" status updated to ${nextStatus}`);
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
    setToggleConfirmTag(null);
  };

  const handleDeleteTag = (id: string, name: string) => {
    setTagsList((prev) => prev.filter((t) => t.id !== id));
    toast.success(`Tag "${name}" removed`);
  };

  const filteredTags = tagsList.filter((item) => {
    const nameVal = filterData.tagName?.val?.toLowerCase().trim() || "";
    const codeVal = filterData.tagCode?.val?.toLowerCase().trim() || "";
    const statusVal = filterData.status?.val?.toLowerCase().trim() || "";

    if (nameVal && !item.name.toLowerCase().includes(nameVal)) return false;
    if (codeVal && !item.code.toLowerCase().includes(codeVal)) return false;
    if (statusVal && item.status.toLowerCase() !== statusVal) return false;
    return true;
  });

  // Render Create View with Breadcrumbs OUTSIDE and Header INSIDE rounded container
  if (activeView === "create") {
    return (
      <div className="space-y-4 animate-in fade-in duration-200">
        {/* Breadcrumb Navigation (OUTSIDE rounded container) */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground px-1">
          <Home className="size-3.5 text-muted-foreground" />
          <ChevronRight className="size-3 text-muted-foreground/60" />
          <span
            onClick={() => setActiveView("list")}
            className="cursor-pointer hover:text-foreground font-medium transition-colors"
          >
            Tags
          </span>
          <ChevronRight className="size-3 text-muted-foreground/60" />
          <span className="font-semibold text-foreground">Add Tag</span>
        </div>

        {/* Main Box Container (INSIDE Off-Black / Light Rounded Container) */}
        <div className="rounded-2xl bg-[#f4f4f6] dark:bg-[#141416] p-6 sm:p-8 space-y-6 shadow-xl border border-slate-200/80 dark:border-transparent">
          {/* Header Row INSIDE rounded container */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#27272a]">
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">Add Tag</h1>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Create a tag to organize and filter your locations
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleSaveTag}
                className="h-8 bg-blue-500 hover:bg-blue-600 text-black font-semibold text-xs gap-1.5 cursor-pointer"
              >
                <Save className="size-3.5" />
                <span>Save</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveView("list")}
                className="h-8 border-slate-300 dark:border-[#3f3f46] bg-white dark:bg-[#18181b] hover:bg-slate-100 dark:hover:bg-[#27272a] text-xs text-foreground cursor-pointer px-3"
              >
                <span>Back</span>
              </Button>
            </div>
          </div>

          {/* Details & Form Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Description */}
            <div className="lg:col-span-4 space-y-1">
              <h3 className="text-sm font-bold text-foreground">Details</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The name and code used to identify this tag when filtering and reporting on locations.
              </p>
            </div>

            {/* Right Form Inputs */}
            <div className="lg:col-span-8 space-y-4 max-w-2xl">
              {/* Tag Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-foreground">
                  Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={tagName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Enter tag name"
                  className="h-9 bg-white dark:bg-[#09090b] border-slate-300 dark:border-[#27272a] text-xs text-foreground focus:border-blue-500 max-w-xl"
                />
              </div>

              {/* Tag Code */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-foreground">Code</label>
                <Input
                  value={tagCode}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  placeholder="Auto-generated from name"
                  className="h-9 bg-white dark:bg-[#09090b] border-slate-300 dark:border-[#27272a] text-xs text-foreground focus:border-blue-500 font-mono max-w-xl"
                />
                <ul className="space-y-1 pt-1 text-[11px] text-muted-foreground/80 list-disc list-inside">
                  <li>Unique identifier used for filtering and reporting.</li>
                  <li>Use lowercase letters, numbers, hyphens, or underscores.</li>
                  <li>Leave blank to auto-generate from the name.</li>
                  <li>Once set, the code cannot be changed.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-[#f4f4f6] dark:bg-[#141416] p-6 sm:p-8 space-y-6 shadow-xl border border-slate-200/80 dark:border-transparent animate-in fade-in duration-200">
      {/* List Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Tags</h1>
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

          <Button
            size="sm"
            onClick={handleOpenCreate}
            className="h-8 bg-blue-500 hover:bg-blue-600 text-black font-semibold text-xs gap-1 cursor-pointer"
          >
            <Plus className="size-4" />
            <span>Add Tag</span>
          </Button>
        </div>
      </div>

      {/* Tags Table matching Screenshot 1 */}
      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-secondary/30 text-muted-foreground font-semibold">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 cursor-pointer hover:text-foreground">
                    Tag <ArrowUpDown className="size-3" />
                  </span>
                </th>
                <th className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 cursor-pointer hover:text-foreground">
                    Tag Code <ArrowUpDown className="size-3" />
                  </span>
                </th>
                <th className="py-3 px-4">Locations</th>
                <th className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 cursor-pointer hover:text-foreground">
                    Status <ArrowUpDown className="size-3" />
                  </span>
                </th>
                <th className="py-3 px-4 w-12 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredTags.length === 0 ? (
                <EmptyTableRow
                  colSpan={6}
                  description="No location tags match your search & filter criteria."
                />
              ) : (
                filteredTags.map((tag) => (
                <tr key={tag.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="py-3.5 px-4 text-center text-muted-foreground font-medium">
                    {tag.id}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-foreground">
                    {tag.name}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-muted-foreground">
                    {tag.code}
                  </td>
                  <td className="py-3.5 px-4 text-muted-foreground">
                    {tag.assigned}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded font-semibold text-[11px] ${
                        tag.status === "Active"
                          ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                          : "bg-slate-500/10 border border-slate-500/30 text-slate-400"
                      }`}
                    >
                      {tag.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer transition-colors"
                          aria-label="Tag actions"
                        >
                          <MoreVertical className="size-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-40 bg-white dark:bg-[#121214] border-slate-200 dark:border-[#27272a] text-foreground p-1 shadow-xl rounded-lg"
                      >
                        {/* Option 1: Edit */}
                        <DropdownMenuItem
                          onClick={() => handleOpenEditTag(tag)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold cursor-pointer hover:bg-slate-100 dark:hover:bg-secondary/40 focus:bg-slate-100 dark:focus:bg-secondary/40 transition-colors"
                        >
                          <Pencil className="size-3.5 text-blue-500 dark:text-blue-400" />
                          <span>Edit</span>
                        </DropdownMenuItem>

                        {/* Option 2: Toggle Status */}
                        <DropdownMenuItem
                          onClick={() =>
                            setToggleConfirmTag({
                              id: tag.id,
                              name: tag.name,
                              status: tag.status,
                            })
                          }
                          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold cursor-pointer hover:bg-slate-100 dark:hover:bg-secondary/40 focus:bg-slate-100 dark:focus:bg-secondary/40 transition-colors"
                        >
                          <Check className="size-3.5 text-emerald-500 dark:text-emerald-400" />
                          <span>Toggle Status</span>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="bg-slate-200 dark:bg-[#27272a] my-1" />

                        {/* Option 3: Delete */}
                        <DropdownMenuItem
                          onClick={() => handleDeleteTag(tag.id, tag.name)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold cursor-pointer text-red-500 hover:bg-red-500/10 focus:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="size-3.5 text-red-500" />
                          <span>Delete</span>
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

      {/* Table Pagination Matching Screenshot 1 */}
      <div className="flex items-center justify-center gap-2 pt-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3 text-xs bg-blue-500/20 text-blue-500 border-blue-500/30 hover:bg-blue-500/30 cursor-pointer font-semibold"
        >
          &lt; Prev
        </Button>
        <span className="px-3 py-1 bg-secondary/60 border border-border rounded text-xs font-medium text-foreground">
          Page 1
        </span>
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3 text-xs bg-blue-500 text-black border-blue-500 hover:bg-blue-600 cursor-pointer font-bold"
        >
          Next &gt;
        </Button>
        <div className="relative">
          <select className="h-8 px-3 pr-7 bg-secondary/60 border border-border rounded text-xs text-foreground font-medium appearance-none cursor-pointer focus:outline-none">
            <option value="30">30</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <ChevronDown className="size-3 text-muted-foreground absolute right-2 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Advanced Filter Modal */}
      <LocationsAdvancedFilterModal
        open={isFilterModalOpen}
        onOpenChange={setIsFilterModalOpen}
        tabType="tags"
        onApplyFilters={(count, data) => {
          setAppliedFilterCount(count);
          setFilterData(data);
        }}
      />

      {/* Toggle Status Confirmation Modal Matching Screenshot 2 */}
      <Dialog
        open={!!toggleConfirmTag}
        onOpenChange={(open) => !open && setToggleConfirmTag(null)}
      >
        <DialogContent className="max-w-md bg-white dark:bg-[#141416] border-slate-200 dark:border-[#27272a] text-foreground p-6 shadow-2xl rounded-2xl">
          <DialogHeader className="flex flex-row items-center justify-between pb-2">
            <DialogTitle className="text-base font-bold text-foreground">
              Confirmation
            </DialogTitle>
          </DialogHeader>

          <div className="flex items-center gap-3 py-3">
            <div className="p-2 rounded-full bg-blue-500/10 text-blue-500 shrink-0">
              <AlertTriangle className="size-6 text-blue-500" />
            </div>
            <p className="text-xs text-muted-foreground font-medium">
              Are you sure you want to toggle the status of this tag?
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-[#27272a]">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setToggleConfirmTag(null)}
              className="h-8 border-slate-300 dark:border-[#3f3f46] bg-white dark:bg-[#18181b] hover:bg-slate-100 dark:hover:bg-[#27272a] text-xs font-semibold px-4 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleConfirmToggleStatus}
              className="h-8 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold text-xs px-4 cursor-pointer"
            >
              Toggle Status
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Tag Dialog */}
      <Dialog
        open={!!editingTag}
        onOpenChange={(open) => !open && setEditingTag(null)}
      >
        <DialogContent className="max-w-md bg-white dark:bg-[#141416] border-slate-200 dark:border-[#27272a] text-foreground p-6 shadow-2xl rounded-2xl">
          <DialogHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-200 dark:border-[#27272a]">
            <DialogTitle className="text-base font-bold text-foreground">
              Edit Tag
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground">Name</label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="h-9 bg-white dark:bg-[#09090b] border-slate-300 dark:border-[#27272a] text-xs text-foreground focus:border-blue-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground">Code</label>
              <Input
                value={editingTag?.code || ""}
                disabled
                className="h-9 bg-slate-100 dark:bg-[#18181b] border-slate-300 dark:border-[#27272a] text-xs text-muted-foreground font-mono cursor-not-allowed"
              />
              <p className="text-[11px] text-muted-foreground">
                * Once set, tag code cannot be modified.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-[#27272a]">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditingTag(null)}
              className="h-8 border-slate-300 dark:border-[#3f3f46] bg-white dark:bg-[#18181b] hover:bg-slate-100 dark:hover:bg-[#27272a] text-xs font-semibold px-4 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSaveEditTag}
              className="h-8 bg-blue-500 hover:bg-blue-600 text-black font-semibold text-xs px-4 cursor-pointer"
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
