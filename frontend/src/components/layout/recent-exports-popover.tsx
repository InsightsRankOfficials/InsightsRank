import { Download } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface RecentExportsPopoverProps {
  onViewAllDownloads: () => void;
}

export function RecentExportsPopover({ onViewAllDownloads }: RecentExportsPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-9 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground"
          aria-label="Recent exports & downloads"
        >
          <Download className="size-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-80 p-0 bg-card dark:bg-[#121214] border-border dark:border-[#27272a] text-foreground shadow-2xl overflow-hidden"
      >
        {/* Header matching Screenshot 2 */}
        <div className="px-4 py-3 border-b border-border dark:border-[#27272a]">
          <h4 className="text-xs font-bold text-foreground">Recent Exports</h4>
        </div>

        {/* Content Body */}
        <div className="p-6 flex flex-col items-center justify-center text-center space-y-3">
          <div className="size-12 rounded-full bg-secondary/80 flex items-center justify-center border border-border">
            <Download className="size-6 text-muted-foreground/70" />
          </div>

          <div className="space-y-1">
            <p className="text-xs font-bold text-foreground">No downloads yet</p>
            <p className="text-[11px] text-muted-foreground">
              Your generated reports will appear here.
            </p>
          </div>
        </div>

        {/* Footer Button matching Screenshot 2 */}
        <div className="p-3 border-t border-border dark:border-[#27272a] bg-secondary/40 dark:bg-[#18181b]/60 text-center">
          <button
            onClick={onViewAllDownloads}
            className="text-xs font-bold text-blue-500 hover:text-blue-400 transition-colors"
          >
            View All Downloads
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
