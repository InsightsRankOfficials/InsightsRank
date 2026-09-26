import { useState } from "react";
import { Download, FileText, Filter, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReviewHeaderActions } from "./review-header-actions";
import {
  downloadDetailedReport,
  downloadSummarizedReport,
} from "@/data/reviews-analytics";

export function ReviewsReportsTab() {
  const reports = [
    {
      title: "Monthly Sentiment Audit Report",
      description: "Complete breakdown of positive, neutral, and negative sentiment distribution across all locations.",
      format: "PDF / CSV",
      lastGenerated: "Sep 15, 2026",
      downloadFn: downloadDetailedReport,
    },
    {
      title: "Response Rate & Velocity Report",
      description: "Detailed track record of staff response times, unanswered counts, and organizational targets.",
      format: "CSV",
      lastGenerated: "Sep 14, 2026",
      downloadFn: downloadSummarizedReport,
    },
    {
      title: "Store Performance Ranking Audit",
      description: "Best and worst performing stores ranked by average rating and customer review counts.",
      format: "CSV / PDF",
      lastGenerated: "Sep 12, 2026",
      downloadFn: downloadDetailedReport,
    },
  ];

  return (
    <div className="rounded-2xl bg-[#f4f4f6] dark:bg-[#141416] p-6 sm:p-8 space-y-6 shadow-xl border border-slate-200/80 dark:border-transparent">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Review Reports</h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Generate, schedule, and download executive review analytics reports.
          </p>
        </div>

        <ReviewHeaderActions />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {reports.map((report) => (
          <div key={report.title} className="panel p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-blue-500">
                <FileText className="size-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/30">
                  {report.format}
                </span>
              </div>
              <h3 className="font-bold text-sm text-foreground">{report.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{report.description}</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border text-xs">
              <span className="text-[11px] text-muted-foreground">Updated {report.lastGenerated}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={report.downloadFn}
                className="h-7 text-xs border-blue-500/40 text-blue-500 hover:bg-blue-500/10 font-semibold cursor-pointer gap-1"
              >
                <Download className="size-3" /> Download
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
