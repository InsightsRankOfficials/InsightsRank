import { useState } from "react";
import { X, Check } from "lucide-react";
import { SELECT_TAGS_OPTIONS, STORE_CODE_OPTIONS } from "@/data/posts-analytics";

interface EditSelectionModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (mode: "tags" | "store_code", selectedItems: string[]) => void;
  initialMode?: "tags" | "store_code";
  initialSelected?: string[];
}

export function EditSelectionModal({
  open,
  onClose,
  onSave,
  initialMode = "tags",
  initialSelected = [],
}: EditSelectionModalProps) {
  const [selectMode, setSelectMode] = useState<"tags" | "store_code">(initialMode);
  const [selectedItems, setSelectedItems] = useState<string[]>(initialSelected);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (!open) return null;

  const currentOptions = selectMode === "tags" ? SELECT_TAGS_OPTIONS : STORE_CODE_OPTIONS;

  const handleToggleItem = (item: string) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((i) => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleRemoveItem = (item: string) => {
    setSelectedItems(selectedItems.filter((i) => i !== item));
  };

  const handleSave = () => {
    onSave(selectMode, selectedItems);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-xl border border-border bg-card dark:bg-[#141416] p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 text-foreground">
        {/* Header */}
        <div className="flex items-start justify-between pb-2 border-b border-border">
          <div>
            <h3 className="text-base font-bold text-foreground">Edit Selection</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              You can use only one way to select business listing
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Radio Selection Modes */}
        <div className="flex items-center gap-6 text-xs font-semibold">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="radio"
              name="selectMode"
              checked={selectMode === "tags"}
              onChange={() => {
                setSelectMode("tags");
                setSelectedItems([]);
              }}
              className="accent-blue-400 size-4 cursor-pointer"
            />
            <span className={selectMode === "tags" ? "text-blue-400 font-bold" : "text-foreground"}>
              Select by Tags
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="radio"
              name="selectMode"
              checked={selectMode === "store_code"}
              onChange={() => {
                setSelectMode("store_code");
                setSelectedItems([]);
              }}
              className="accent-blue-400 size-4 cursor-pointer"
            />
            <span className={selectMode === "store_code" ? "text-blue-400 font-bold" : "text-foreground"}>
              Select by Store Code
            </span>
          </label>
        </div>

        {/* Dropdown Selector */}
        <div className="space-y-2 relative">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
            {selectMode === "tags" ? "Select Tags" : "Select Store Code"}
          </label>

          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs text-left text-foreground flex items-center justify-between cursor-pointer hover:border-border/80 transition-colors"
          >
            <span className="truncate">
              {selectedItems.length > 0
                ? `${selectedItems.length} selected`
                : selectMode === "tags"
                ? "Select Tags"
                : "Select Store Code"}
            </span>
            <span className="text-muted-foreground text-[10px]">▼</span>
          </button>

          {/* Custom Dropdown List */}
          {dropdownOpen && (
            <div className="absolute top-full left-0 right-0 z-20 mt-1 max-h-48 overflow-y-auto rounded-lg border border-border bg-popover text-popover-foreground p-1 shadow-xl space-y-0.5 text-xs">
              {currentOptions.map((opt) => {
                const isSelected = selectedItems.includes(opt);
                return (
                  <div
                    key={opt}
                    onClick={() => handleToggleItem(opt)}
                    className="flex items-center justify-between px-3 py-2 rounded hover:bg-secondary cursor-pointer text-foreground transition-colors"
                  >
                    <span>{opt}</span>
                    {isSelected && <Check className="size-3.5 text-blue-400" />}
                  </div>
                );
              })}
            </div>
          )}

          {/* Selected Item Chips */}
          <div className="min-h-[48px] p-2.5 rounded-lg border border-border bg-background flex flex-wrap items-center gap-1.5 text-xs">
            {selectedItems.length === 0 ? (
              <span className="text-muted-foreground/60 text-xs italic">
                {selectMode === "tags" ? "Selected tags will appear here" : "Selected store codes will appear here"}
              </span>
            ) : (
              selectedItems.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/15 border border-blue-500/30 text-blue-400 font-semibold text-[11px]"
                >
                  <span>{item}</span>
                  <X
                    className="size-3 cursor-pointer hover:text-blue-200"
                    onClick={() => handleRemoveItem(item)}
                  />
                </span>
              ))
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-border bg-secondary hover:bg-secondary/80 text-xs font-semibold text-foreground cursor-pointer transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-1.5 rounded-lg bg-blue-400 hover:bg-blue-500 text-black text-xs font-bold cursor-pointer transition-colors shadow-sm"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
