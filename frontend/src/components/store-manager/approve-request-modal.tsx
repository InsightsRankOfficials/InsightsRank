import React, { useState } from "react";
import { X, CheckCircle2 } from "lucide-react";

interface ApproveRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (comment: string) => void;
}

export function ApproveRequestModal({
  isOpen,
  onClose,
  onConfirm,
}: ApproveRequestModalProps) {
  const [comment, setComment] = useState("");

  if (!isOpen) return null;

  const handleApprove = () => {
    onConfirm(comment);
    setComment("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs animate-in fade-in duration-150 p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-card dark:bg-[#141416] border border-border p-6 shadow-2xl space-y-5 text-foreground">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg border border-border bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <X className="size-4" />
        </button>

        {/* Modal Title */}
        <h2 className="text-lg font-bold tracking-tight text-foreground">Approve Request</h2>

        {/* Confirmation Message */}
        <div className="flex items-center gap-3 pt-1">
          <div className="flex-shrink-0 size-8 rounded-full border border-emerald-500/40 bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="size-5 text-emerald-400" />
          </div>
          <p className="text-sm font-semibold text-foreground">
            Are you sure you want to approve this request?
          </p>
        </div>

        {/* Comment Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Comment <span className="text-muted-foreground/70 font-normal">(Optional)</span>
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Type your comment here"
            rows={3}
            className="w-full rounded-xl bg-background border border-border p-3 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 transition-all resize-none"
          />
        </div>

        {/* Action Buttons matching screenshot */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-xs font-semibold text-foreground transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleApprove}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-all cursor-pointer shadow-md shadow-emerald-950/30"
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  );
}
