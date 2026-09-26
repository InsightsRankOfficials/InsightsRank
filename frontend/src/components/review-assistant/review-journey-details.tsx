import React, { useState } from "react";
import { ReviewLogItem } from "@/data/review-assistant-analytics";
import {
  Home,
  ChevronRight,
  ArrowLeft,
  MapPin,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Smile,
  Meh,
  Frown,
} from "lucide-react";

interface ReviewJourneyDetailsProps {
  log: ReviewLogItem;
  onBack: () => void;
}

export function ReviewJourneyDetails({ log, onBack }: ReviewJourneyDetailsProps) {
  const [selectedVersion, setSelectedVersion] = useState("Version 1");
  const [selectedTone, setSelectedTone] = useState("Casual");

  // Sample version generated reviews for dropdown selection
  const reviewVersions: Record<string, string> = {
    "Version 1":
      log.reviewText ||
      "The place itself was pretty nice to walk around, had a good vibe. But honestly, the products were a letdown — they didn't hold up like I hoped. The service was okay, not bad, but nothing stood out either.",
    "Version 2":
      "Visited the store today. The ambiance was pleasant and staff was helpful, though product variety in stock could be improved.",
    "Version 3":
      "Great overall store experience! Fast service at billing desk and polite staff assistance throughout.",
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200 pb-16">
      {/* Breadcrumb Navigation matching Locations section */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground px-1 pb-1">
        <Home
          className="size-3.5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
          onClick={onBack}
        />
        <ChevronRight className="size-3 text-muted-foreground/60" />
        <span onClick={onBack} className="cursor-pointer hover:text-foreground font-medium">
          Review Logs
        </span>
        <ChevronRight className="size-3 text-muted-foreground/60" />
        <span className="font-semibold text-foreground">Review Journey Details</span>
      </div>

      {/* Rounded Off-Black Card Container wrapping main content */}
      <div className="rounded-2xl bg-card dark:bg-[#141416] p-6 sm:p-8 space-y-6 shadow-xl border border-border">
        {/* Top Header & Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-foreground tracking-tight">Review Journey Details</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-500 dark:text-blue-400 border border-blue-500/30">
                {log.status}
              </span>
            </div>
          <p className="text-xs text-muted-foreground">
            Detailed logs of all reviews generated through the AI Review Assistant.
          </p>
        </div>

        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg border border-border dark:border-[#27272a] bg-background dark:bg-[#18181b] hover:bg-secondary/40 text-xs font-semibold text-foreground cursor-pointer transition-colors self-start sm:self-auto"
        >
          <ArrowLeft className="size-3.5" />
          Back
        </button>
      </div>

      {/* Main 2-Column Grid matching Screenshot 1 & 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (4 Cols): Store & Session Info */}
        <div className="lg:col-span-4 space-y-5">
          {/* Card 1: Store Information */}
          <div className="rounded-xl border border-border dark:border-[#27272a] bg-card dark:bg-[#121214] p-5 space-y-3">
            <h3 className="text-xs font-bold text-foreground border-b border-border/60 dark:border-[#27272a]/60 pb-2">
              Store Information
            </h3>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px]">Store Name:</span>
                <span className="font-bold text-foreground text-sm">{log.storeName}</span>
              </div>

              <div>
                <span className="text-muted-foreground block text-[11px]">Address:</span>
                <p className="text-foreground leading-relaxed text-[11px] font-medium">
                  {log.address}
                </p>
              </div>

              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(log.storeName + " " + log.address)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-500 hover:underline pt-1 cursor-pointer"
              >
                <MapPin className="size-3" />
                <span>View on Map</span>
              </a>
            </div>
          </div>

          {/* Card 2: Session Information */}
          <div className="rounded-xl border border-border dark:border-[#27272a] bg-card dark:bg-[#121214] p-5 space-y-3">
            <h3 className="text-xs font-bold text-foreground border-b border-border/60 dark:border-[#27272a]/60 pb-2">
              Session Information
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px]">IP Address</span>
                <span className="font-bold text-foreground font-mono">{log.ipAddress}</span>
              </div>

              <div>
                <span className="text-muted-foreground block text-[11px]">Device Type</span>
                <span className="font-semibold text-foreground">{log.device}</span>
              </div>

              <div>
                <span className="text-muted-foreground block text-[11px]">Date & Time</span>
                <span className="font-semibold text-foreground">{log.dateTime}</span>
              </div>

              <div>
                <span className="text-muted-foreground block text-[11px]">Session Duration</span>
                <div className="flex items-center gap-1.5 pt-0.5">
                  <div className="size-4 rounded-full bg-cyan-500/20 text-cyan-500 dark:text-cyan-400 flex items-center justify-center text-[10px]">
                    ⏱
                  </div>
                  <span className="font-bold text-foreground">53s</span>
                </div>
              </div>

              <div>
                <span className="text-muted-foreground block text-[11px]">Review Generated</span>
                <div className="flex items-center gap-1.5 pt-0.5">
                  <div className="size-4 rounded-full bg-blue-500/20 text-blue-500 dark:text-blue-400 flex items-center justify-center text-[10px]">
                    💬
                  </div>
                  <span className="font-bold text-foreground">1 time</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (8 Cols): Review Journey Progress & Rating Aspects */}
        <div className="lg:col-span-8 space-y-5">
          {/* Card 1: Review Journey Progress */}
          <div className="rounded-xl border border-border dark:border-[#27272a] bg-card dark:bg-[#121214] p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border/60 dark:border-[#27272a]/60">
              <h3 className="text-xs font-bold text-foreground">Review Journey Progress</h3>
              <span className="text-[11px] text-muted-foreground font-semibold">
                3 of 4 steps completed
              </span>
            </div>

            <div className="space-y-3">
              {/* Step 1 */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-border dark:border-[#27272a] bg-secondary/30 dark:bg-[#18181b]/50">
                <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                  <CheckCircle2 className="size-4 text-emerald-500 dark:text-emerald-400 fill-emerald-500/20" />
                  <span>Page Visited</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  Completed
                </span>
              </div>

              {/* Step 2 */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-border dark:border-[#27272a] bg-secondary/30 dark:bg-[#18181b]/50">
                <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                  <CheckCircle2 className="size-4 text-emerald-500 dark:text-emerald-400 fill-emerald-500/20" />
                  <span>Aspect Selection</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  Completed
                </span>
              </div>

              {/* Step 3 */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-border dark:border-[#27272a] bg-secondary/30 dark:bg-[#18181b]/50">
                <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                  <CheckCircle2 className="size-4 text-emerald-500 dark:text-emerald-400 fill-emerald-500/20" />
                  <span>Review Generation</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  Completed
                </span>
              </div>

              {/* Step 4 */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-border dark:border-[#27272a] bg-secondary/30 dark:bg-[#18181b]/50">
                <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                  <XCircle className="size-4 text-rose-500 dark:text-rose-400 fill-rose-500/20" />
                  <span>Review Sharing</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                  ✕ Abandoned
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Customer Rating & Aspects */}
          <div className="rounded-xl border border-border dark:border-[#27272a] bg-card dark:bg-[#121214] p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60 dark:border-[#27272a]/60">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-foreground">Customer Rating & Aspects</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-secondary text-muted-foreground border border-border">
                  Draft
                </span>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedVersion}
                  onChange={(e) => setSelectedVersion(e.target.value)}
                  className="px-2.5 py-1 rounded-lg border border-border dark:border-[#27272a] bg-background dark:bg-[#18181b] text-xs text-foreground focus:outline-none focus:border-blue-500 cursor-pointer font-medium"
                >
                  <option value="Version 1" className="bg-popover text-foreground">Version 1</option>
                  <option value="Version 2" className="bg-popover text-foreground">Version 2</option>
                  <option value="Version 3" className="bg-popover text-foreground">Version 3</option>
                </select>

                <select
                  value={selectedTone}
                  onChange={(e) => setSelectedTone(e.target.value)}
                  className="px-2.5 py-1 rounded-lg border border-border dark:border-[#27272a] bg-background dark:bg-[#18181b] text-xs text-foreground focus:outline-none focus:border-blue-500 cursor-pointer font-medium"
                >
                  <option value="Casual" className="bg-popover text-foreground">Casual</option>
                  <option value="Professional" className="bg-popover text-foreground">Professional</option>
                  <option value="Enthusiastic" className="bg-popover text-foreground">Enthusiastic</option>
                </select>
              </div>
            </div>

            {/* Selected Aspects Ratings */}
            <div className="space-y-2.5 pt-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                Selected Aspects
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg border border-border dark:border-[#27272a] bg-secondary/30 dark:bg-[#18181b]">
                  <span className="font-bold text-foreground">Store Experience</span>
                  <Smile className="size-4 text-emerald-500 dark:text-emerald-400" />
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg border border-border dark:border-[#27272a] bg-secondary/30 dark:bg-[#18181b]">
                  <span className="font-bold text-foreground">Service Quality</span>
                  <Meh className="size-4 text-blue-500 dark:text-blue-400" />
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg border border-border dark:border-[#27272a] bg-secondary/30 dark:bg-[#18181b]">
                  <span className="font-bold text-foreground">Product Quality</span>
                  <Frown className="size-4 text-rose-500 dark:text-rose-400" />
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg border border-border dark:border-[#27272a] bg-secondary/30 dark:bg-[#18181b]">
                  <span className="font-bold text-foreground">Product Range</span>
                  <Frown className="size-4 text-rose-500 dark:text-rose-400" />
                </div>
              </div>
            </div>

            {/* Generated Review Text Box */}
            <div className="space-y-1.5 pt-2">
              <span className="text-xs font-bold text-foreground block">
                Generated Review ({selectedVersion} - {selectedTone})
              </span>
              <div className="p-4 rounded-xl border border-border dark:border-[#27272a] bg-background dark:bg-[#09090b] text-xs text-muted-foreground leading-relaxed italic">
                "{reviewVersions[selectedVersion] || reviewVersions["Version 1"]}"
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}
