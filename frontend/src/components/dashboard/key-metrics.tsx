import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Hourglass, Key, MessageSquare, Smile } from "lucide-react";

import type { ReviewInsights } from "@/types/review";
import { VariablePieChart } from "@/components/charts/variable-pie-chart";
import { compactNumber } from "@/lib/format";

interface KeyMetricsProps {
  insights?: ReviewInsights;
  multiplier?: number;
}

export function KeyMetrics({ insights, multiplier = 1.0 }: KeyMetricsProps) {
  const [completionTab, setCompletionTab] = useState<"business" | "photos">("business");

  const completionData = insights?.completionScore ?? {
    overallPct: 100,
    businessInfo: [
      { label: "Store Code", pct: 100 },
      { label: "Description", pct: 100 },
      { label: "Locality", pct: 100 },
      { label: "Phone No.", pct: 100 },
      { label: "Website URL", pct: 100 },
    ],
    photoGallery: [
      { label: "Cover Photo", pct: 100 },
      { label: "Logo", pct: 100 },
      { label: "Interior Photos", pct: 100 },
      { label: "Exterior Photos", pct: 100 },
      { label: "Team Photos", pct: 100 },
    ],
  };

  const currentProgressList =
    completionTab === "business"
      ? completionData.businessInfo
      : completionData.photoGallery;

  const rawRepliedStats = insights?.repliedStats ?? {
    repliedPct: 100,
    repliedCount: "3.3k Reviews",
    notRepliedPct: 0,
    notRepliedCount: "0 Reviews",
  };

  const scaledCountNum = (3.3 * multiplier).toFixed(1);
  const repliedStats = {
    ...rawRepliedStats,
    repliedCount: `${scaledCountNum}k Reviews`,
  };

  const sentimentData = insights?.sentimentBreakdown ?? {
    score: 94,
    label: "Excellent",
    positivePct: 94,
    neutralPct: 4,
    negativePct: 2,
  };

  const sentimentVariablePieData = [
    { name: "Positive", y: sentimentData.positivePct, z: 100, color: "#4ade80" },
    { name: "Neutral", y: sentimentData.neutralPct, z: 60, color: "#facc15" },
    { name: "Negative", y: sentimentData.negativePct, z: 35, color: "#f87171" },
  ];

  const keywordCategories = insights?.keywordCategories ?? [
    { category: "Service", sharePct: 48.0, color: "#f97316" },
    { category: "Other", sharePct: 24.0, color: "#2563eb" },
    { category: "Product", sharePct: 12.89, color: "#ec4899" },
    { category: "Pricing", sharePct: 4.12, color: "#3b82f6" },
    { category: "Ambience", sharePct: 1.49, color: "#eab308" },
    { category: "Quality", sharePct: 0.28, color: "#14b8a6" },
    { category: "Delivery", sharePct: 0.05, color: "#22c55e" },
  ];

  // Highcharts Variable Radius Pie data for Keyword Category Analysis
  const keywordVariablePieData = keywordCategories.map((item, idx) => {
    const radiusDepths = [100, 85, 70, 58, 46, 36, 26];
    return {
      name: item.category,
      y: item.sharePct,
      z: radiusDepths[idx] ?? 40,
      color: item.color || "#f97316",
    };
  });

  return (
    <section className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-base font-semibold text-foreground">Key Metrics</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Monitor essential performance indicators driving your business growth.
        </p>
      </div>

      {/* Grid Layout: Thin Completion Score column (0.8fr), wider middle column (1.4fr), standard right column (1fr) */}
      <div className="grid gap-4 lg:grid-cols-[minmax(240px,0.8fr)_minmax(360px,1.4fr)_minmax(280px,1fr)]">
        {/* Card 1: Completion Score */}
        <div className="panel p-3.5 sm:p-4 flex flex-col justify-between space-y-3.5">
          <div className="flex items-center gap-2 mb-1">
            <Hourglass className="size-4 text-blue-500" />
            <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
              Completion Score
            </h3>
          </div>

          {/* Compact Semi-circle Gauge */}
          <div className="flex flex-col items-center justify-center pt-1">
            <div className="relative size-36 grid place-items-center">
              <svg className="size-full" viewBox="0 0 100 100">
                {/* Background Arc */}
                <path
                  d="M 20 75 A 40 40 0 1 1 80 75"
                  fill="none"
                  stroke="var(--secondary)"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
                {/* Foreground Arc */}
                <path
                  d="M 20 75 A 40 40 0 1 1 80 75"
                  fill="none"
                  stroke="#facc15"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray="188.5"
                  strokeDashoffset={188.5 * (1 - completionData.overallPct / 100)}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pb-2">
                <span className="tnum text-2xl font-extrabold text-foreground tracking-tight">
                  {completionData.overallPct}%
                </span>
              </div>
            </div>

            {/* Completed Badge Pill */}
            <div className="mt-[-8px] z-10">
              <span className="inline-block px-3 py-0.5 rounded-full bg-[#052e16] border border-[#14532d] text-emerald-400 font-semibold text-[11px]">
                Completed
              </span>
            </div>
          </div>

          {/* Tab Pill Buttons */}
          <div className="bg-background p-1 rounded-lg border border-border flex items-center">
            <button
              onClick={() => setCompletionTab("business")}
              className={`flex-1 py-1 text-[11px] font-medium rounded-md transition-all ${
                completionTab === "business"
                  ? "bg-secondary text-foreground font-semibold shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Business Info
            </button>
            <button
              onClick={() => setCompletionTab("photos")}
              className={`flex-1 py-1 text-[11px] font-medium rounded-md transition-all ${
                completionTab === "photos"
                  ? "bg-secondary text-foreground font-semibold shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Photo Gallery
            </button>
          </div>

          {/* Progress Rows with Thick Green Bars and White Text Inside */}
          <div className="space-y-2 pt-0.5">
            {currentProgressList.map((item) => (
              <div key={item.label} className="grid grid-cols-[90px_1fr] items-center gap-2">
                <span className="text-[11px] font-medium text-foreground truncate">{item.label}</span>
                <div className="w-full bg-secondary rounded-md overflow-hidden h-5 border border-emerald-900/30">
                  <div
                    className="h-full bg-[#10b981] flex items-center justify-center rounded-md transition-all duration-500"
                    style={{ width: `${item.pct}%` }}
                  >
                    <span className="tnum text-[10px] font-bold text-white tracking-wide">
                      {item.pct}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Middle Column (Replied vs Not Replied & Sentiment Analysis) */}
        <div className="flex flex-col gap-4">
          {/* Top Panel: Replied vs Not Replied */}
          <div className="panel p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare className="size-4 text-blue-500" />
              <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
                Replied vs Not Replied
              </h3>
            </div>

            <div className="flex items-center justify-between px-4 py-1">
              {/* Semi-circle Arc Gauge Chart */}
              <div className="relative size-32 shrink-0 grid place-items-center">
                <svg className="size-full" viewBox="0 0 100 100">
                  <path
                    d="M 20 75 A 40 40 0 1 1 80 75"
                    fill="none"
                    stroke="var(--secondary)"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 20 75 A 40 40 0 1 1 80 75"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray="188.5"
                    strokeDashoffset={188.5 * (1 - repliedStats.repliedPct / 100)}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pb-2">
                  <span className="tnum text-2xl font-extrabold text-foreground tracking-tight">
                    {repliedStats.repliedPct}%
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-xs pl-4 flex-1">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="size-2.5 rounded-sm bg-[#f97316]" />
                    <span className="font-medium text-foreground">Replied</span>
                  </div>
                  <div className="text-right">
                    <span className="tnum font-bold text-foreground">
                      {repliedStats.repliedPct}%
                    </span>
                    <span className="ml-2 text-muted-foreground">
                      {repliedStats.repliedCount}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="size-2.5 rounded-sm bg-muted-foreground/30" />
                    <span className="font-medium text-muted-foreground">Not Replied</span>
                  </div>
                  <div className="text-right">
                    <span className="tnum font-bold text-muted-foreground">
                      {repliedStats.notRepliedPct}%
                    </span>
                    <span className="ml-2 text-muted-foreground">
                      {repliedStats.notRepliedCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Panel: Sentiment Analysis (Highcharts Variable Radius Pie Chart) */}
          <div className="panel p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <Smile className="size-4 text-blue-500" />
              <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
                Sentiment Analysis
              </h3>
            </div>

            {/* Highcharts Variable Radius Pie Chart with centered 94 score */}
            <div className="my-1 flex justify-center items-center">
              <VariablePieChart
                data={sentimentVariablePieData}
                innerSize="60%"
                height={150}
                centerScore={sentimentData.score}
                showDataLabels={false}
              />
            </div>

            {/* Narrow centered legend underneath chart */}
            <div className="w-full max-w-[220px] mx-auto flex items-center justify-between text-xs pt-1 border-t border-border">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="size-2.5 rounded-sm bg-[#4ade80]" /> Positive
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="size-2.5 rounded-sm bg-[#facc15]" /> Neutral
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="size-2.5 rounded-sm bg-[#f87171]" /> Negative
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Keyword Category Analysis */}
        <div className="panel p-4 sm:p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Key className="size-4 text-blue-500" />
            <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
              Keyword Category Analysis
            </h3>
          </div>

          {/* Highcharts Variable Radius Pie Chart */}
          <div className="my-2">
            <VariablePieChart
              data={keywordVariablePieData}
              innerSize="40%"
              height={220}
            />
          </div>

          {/* Categories Legend Grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs pt-2 border-t border-border">
            {keywordCategories.map((item) => (
              <div key={item.category} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 truncate">
                  <span
                    className="size-2.5 shrink-0 rounded-sm"
                    style={{ backgroundColor: item.color || "#f97316" }}
                  />
                  <span className="text-muted-foreground truncate">{item.category}</span>
                </div>
                <span className="tnum font-semibold text-foreground ml-2">
                  {item.sharePct.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
