import { Download, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MyDownloadsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MyDownloadsModal({ open, onOpenChange }: MyDownloadsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-card dark:bg-[#121214] border-border dark:border-[#27272a] text-foreground p-6 sm:p-8">
        <DialogHeader className="space-y-1 text-left">
          <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">
            My Downloads
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Manage and download your generated reports from the last 30 days.
          </DialogDescription>
        </DialogHeader>

        {/* Empty Downloads Container matching Screenshot 1 */}
        <div className="my-6 rounded-xl border border-border dark:border-[#27272a] bg-secondary/40 dark:bg-[#18181b]/80 p-12 sm:p-16 flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
          <div className="size-16 rounded-full bg-secondary/80 flex items-center justify-center border border-border">
            <Download className="size-8 text-muted-foreground/70" />
          </div>

          <div className="space-y-1 max-w-sm">
            <h3 className="text-base font-bold text-foreground">No downloads yet</h3>
            <p className="text-xs text-muted-foreground">
              When you export data from tables or reports, it will appear here.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
