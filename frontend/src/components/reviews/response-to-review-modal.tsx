import { useState, useEffect } from "react";
import { MapPin, RotateCcw, Star, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { CustomerReviewItem } from "@/data/reviews-analytics";

interface ResponseToReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review: CustomerReviewItem | null;
  onSaveResponse?: (id: string, newText: string) => void;
}

export function ResponseToReviewModal({
  open,
  onOpenChange,
  review,
  onSaveResponse,
}: ResponseToReviewModalProps) {
  const [responseType, setResponseType] = useState<"manual" | "ai" | "template">("manual");
  const [responseText, setResponseText] = useState("");

  useEffect(() => {
    if (review?.responseText) {
      setResponseText(review.responseText);
    } else {
      setResponseText("");
    }
  }, [review]);

  if (!review) return null;

  const handleSave = () => {
    if (onSaveResponse) {
      onSaveResponse(review.id, responseText);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-[#121214] border-[#27272a] text-foreground p-6 sm:p-7">
        <DialogHeader className="border-b border-[#27272a] pb-3 text-left">
          <DialogTitle className="text-base font-bold text-foreground">
            Response to Review
          </DialogTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Modify your responses to the review below. Make sure to save your changes once you&apos;re satisfied.
          </p>
        </DialogHeader>

        {/* Review Context Box matching Screenshot 5 */}
        <div className="space-y-4 my-2">
          <div className="bg-[#18181b]/80 border border-[#27272a] rounded-lg p-3.5 space-y-2">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-full bg-secondary flex items-center justify-center border border-border">
                <User className="size-5 text-foreground" />
              </div>
              <div>
                <p className="font-bold text-xs text-foreground">{review.reviewerName}</p>
                <div className="flex text-blue-400 text-xs gap-0.5 mt-0.5">
                  ★★★★★
                </div>
              </div>
            </div>

            <div className="text-[11px] text-muted-foreground space-y-0.5 pt-1 border-t border-[#27272a]">
              <p className="flex items-center gap-1 font-mono">
                <span className="size-1.5 rounded-full bg-blue-500" />
                {review.dateStr}
              </p>
              <p className="flex items-start gap-1">
                <MapPin className="size-3 shrink-0 mt-0.5 text-muted-foreground/70" />
                <span>{review.address}</span>
              </p>
            </div>
          </div>

          {/* Response Type Selector */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground block">
              Response Type
            </label>
            <div className="relative">
              <select
                value={responseType}
                onChange={(e) => setResponseType(e.target.value as any)}
                className="w-full h-9 rounded bg-[#18181b] border border-[#27272a] px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="manual">Manual Reply</option>
                <option value="ai">AI Generated Reply</option>
                <option value="template">Use Template</option>
              </select>
            </div>
            <p className="text-[10px] text-muted-foreground italic mt-0.5">
              Instruction : You can change response type to AI Generated or use Use Template
            </p>
          </div>

          {/* Response Textarea */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground block">
              Response
            </label>
            <textarea
              rows={5}
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Write your public response to the customer..."
              className="w-full rounded bg-[#18181b] border border-[#27272a] p-3 text-xs text-foreground leading-relaxed focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-start gap-3 pt-3 border-t border-[#27272a]">
          <Button
            size="sm"
            onClick={handleSave}
            className="h-8 bg-blue-500 hover:bg-blue-600 text-black font-semibold text-xs px-5"
          >
            Submit
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-8 border-[#3f3f46] text-xs font-semibold"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
