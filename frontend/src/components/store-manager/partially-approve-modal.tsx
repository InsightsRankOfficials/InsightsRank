import React, { useState } from "react";
import { RequestCard } from "@/data/store-manager-analytics";
import { X, Check, X as XIcon } from "lucide-react";

interface PartiallyApproveModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: RequestCard | null;
  onApply?: (decisions: Record<string, "approved" | "rejected">, comment: string) => void;
}

export function PartiallyApproveModal({
  isOpen,
  onClose,
  card,
  onApply,
}: PartiallyApproveModalProps) {
  const [decisions, setDecisions] = useState<Record<string, "approved" | "rejected">>({});
  const [comment, setComment] = useState("");

  if (!isOpen || !card) return null;

  const toggleDecision = (imageId: string, status: "approved" | "rejected") => {
    setDecisions((prev) => ({
      ...prev,
      [imageId]: status,
    }));
  };

  const handleApply = () => {
    if (onApply) {
      onApply(decisions, comment);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-xl border border-border bg-card dark:bg-[#141416] text-foreground p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-border">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Partially Approve</h3>
            <p className="text-xs text-muted-foreground mt-1">
              You can approve or reject the selected images. You can also check the uploaded images.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Image List */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">Requested Images</span>
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold">
              {card.images.length}
            </span>
          </div>

          <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
            {card.images.map((img, idx) => {
              const currentDecision = decisions[img.id] || (img.status === "approved" ? "approved" : img.status === "rejected" ? "rejected" : "approved");
              return (
                <div
                  key={img.id || idx}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-secondary/40 dark:bg-[#18181b]/60 gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={img.url}
                      alt={`Image ${idx + 1}`}
                      className="w-14 h-12 rounded object-cover border border-border"
                    />
                    <span className="text-xs font-medium text-foreground">
                      {img.title || "New Image"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleDecision(img.id, "rejected")}
                      className={`px-3 py-1.5 rounded text-xs font-semibold border flex items-center gap-1 transition-all cursor-pointer ${
                        currentDecision === "rejected"
                          ? "bg-red-500/20 border-red-500/80 text-red-400 shadow-sm"
                          : "border-border text-muted-foreground hover:border-red-500/50 hover:text-red-400"
                      }`}
                    >
                      <XIcon className="w-3.5 h-3.5" />
                      Reject
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleDecision(img.id, "approved")}
                      className={`px-3 py-1.5 rounded text-xs font-semibold border flex items-center gap-1 transition-all cursor-pointer ${
                        currentDecision === "approved"
                          ? "bg-emerald-500/20 border-emerald-500/80 text-emerald-400 shadow-sm"
                          : "border-border text-muted-foreground hover:border-emerald-500/50 hover:text-emerald-400"
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      Approve
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Comment Textarea */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Your Comment <span className="text-red-500">*</span>
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Type your reason here"
            rows={3}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all resize-none"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-secondary transition-colors cursor-pointer"
          >
            Cancel
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
