import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfigureKeywordsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConfigureKeywordsModal({
  open,
  onOpenChange,
}: ConfigureKeywordsModalProps) {
  const [keywords, setKeywords] = useState<string[]>([
    "footwear shop near me",
    "ladies shoes",
    "men shoes",
    "shoe shop near me",
    "sports shoes",
  ]);

  const [newKw, setNewKw] = useState("");

  const handleAdd = () => {
    if (newKw.trim() && !keywords.includes(newKw.trim())) {
      setKeywords((prev) => [...prev, newKw.trim()]);
      setNewKw("");
    }
  };

  const handleRemove = (kw: string) => {
    setKeywords((prev) => prev.filter((k) => k !== kw));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-[#121214] border-[#27272a] text-foreground p-6 sm:p-7 shadow-2xl">
        <DialogHeader className="border-b border-[#27272a] pb-3">
          <DialogTitle className="text-base font-bold text-foreground flex items-center justify-between">
            <span>Configure Tracked Keywords</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 my-2">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Manage active keywords tracked for ranking positions across all business locations.
          </p>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Enter new keyword (e.g. casual shoes)"
              value={newKw}
              onChange={(e) => setNewKw(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="h-8 flex-1 rounded bg-[#18181b] border border-[#27272a] px-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <Button
              size="sm"
              onClick={handleAdd}
              className="h-8 bg-blue-500 hover:bg-blue-600 text-black font-semibold text-xs px-3 cursor-pointer gap-1"
            >
              <Plus className="size-3.5" />
              <span>Add</span>
            </Button>
          </div>

          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {keywords.map((kw) => (
              <div
                key={kw}
                className="flex items-center justify-between p-2.5 rounded bg-[#18181b] border border-[#27272a] text-xs"
              >
                <span className="font-semibold text-foreground">{kw}</span>
                <button
                  onClick={() => handleRemove(kw)}
                  className="text-muted-foreground hover:text-red-400 cursor-pointer p-1 transition-colors"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#27272a]">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-8 border-[#3f3f46] text-xs font-semibold cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-8 bg-blue-500 hover:bg-blue-600 text-black font-semibold text-xs px-5 cursor-pointer"
          >
            Save Configuration
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
