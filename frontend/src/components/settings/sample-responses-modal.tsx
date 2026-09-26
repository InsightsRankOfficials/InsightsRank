import { useState } from "react";
import { X, ChevronDown, ChevronUp, Star, Bot } from "lucide-react";
import { SAMPLE_AI_RESPONSES } from "@/data/settings-analytics";

interface SampleResponsesModalProps {
  open: boolean;
  onClose: () => void;
}

export function SampleResponsesModal({ open, onClose }: SampleResponsesModalProps) {
  const [expandedId, setExpandedId] = useState<number>(1);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-xl border border-border dark:border-[#27272a] bg-card dark:bg-[#141416] p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 text-foreground">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border dark:border-[#27272a]/60">
          <h3 className="text-base font-bold text-foreground">Sample AI Responses</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Accordion Items */}
        <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
          {SAMPLE_AI_RESPONSES.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                className="rounded-xl border border-border dark:border-[#27272a] bg-card dark:bg-[#18181b]/60 overflow-hidden transition-all"
              >
                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? 0 : item.id)}
                  className="w-full px-4 py-3 text-xs font-bold text-foreground flex items-center justify-between hover:bg-secondary/40 cursor-pointer transition-colors text-left"
                >
                  <span>{item.title}</span>
                  {isExpanded ? (
                    <ChevronUp className="size-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="size-4 text-muted-foreground" />
                  )}
                </button>

                {/* Accordion Content */}
                {isExpanded && (
                  <div className="p-4 pt-1 border-t border-border dark:border-[#27272a]/60 space-y-3 text-xs">
                    {/* Customer Review Post Card */}
                    <div className="p-3.5 rounded-lg border border-border dark:border-[#27272a] bg-background dark:bg-[#09090b] space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="size-6 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                            A
                          </div>
                          <span className="font-bold text-foreground text-xs">{item.reviewerName}</span>
                          <span className="size-2 rounded-full bg-blue-400" />
                        </div>

                        {/* Stars */}
                        <div className="flex items-center gap-0.5 text-blue-400">
                          {Array.from({ length: item.stars }).map((_, i) => (
                            <Star key={i} className="size-3 fill-blue-400 text-blue-400" />
                          ))}
                        </div>
                      </div>

                      <p className="text-[11px] text-muted-foreground font-mono">{item.date}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed italic">
                        "{item.reviewText}"
                      </p>

                      <div className="pt-1">
                        <span className="text-[10px] font-bold text-blue-400 block">Selection and Variety</span>
                        <p className="text-[11px] text-muted-foreground">
                          {item.highlightText} <span className="text-blue-500 font-bold hover:underline cursor-pointer">Read More</span>
                        </p>
                      </div>
                    </div>

                    {/* AI Generated Reply Box */}
                    <div className="p-4 rounded-xl border border-blue-500/30 bg-background dark:bg-[#09090b] space-y-2 relative">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400 pb-1 border-b border-blue-500/20">
                        <Bot className="size-3.5 text-blue-400" />
                        <span>AI Generated Reply</span>
                      </div>
                      <p className="text-xs text-foreground leading-relaxed whitespace-pre-line">
                        {item.aiReplyText}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
