import { Key, Smile } from "lucide-react";
import { VariablePieChart } from "@/components/charts/variable-pie-chart";
import { ReviewHeaderActions } from "./review-header-actions";

export function ReviewsSentimentCategoryTab() {
  const categories = [
    { name: "Service", share: "48.08%", positive: "1,551", neutral: "42", negative: "10", color: "#f97316" },
    { name: "Other", share: "24.06%", positive: "780", neutral: "88", negative: "18", color: "#2563eb" },
    { name: "Product", share: "12.89%", positive: "410", neutral: "38", negative: "34", color: "#ec4899" },
    { name: "Pricing", share: "4.12%", positive: "110", neutral: "16", negative: "16", color: "#3b82f6" },
    { name: "Ambience", share: "1.49%", positive: "48", neutral: "2", negative: "1", color: "#eab308" },
    { name: "Quality", share: "0.28%", positive: "8", neutral: "1", negative: "0", color: "#14b8a6" },
    { name: "Delivery", share: "0.05%", positive: "2", neutral: "0", negative: "0", color: "#22c55e" },
  ];

  const variablePieData = categories.map((cat, idx) => ({
    name: cat.name,
    y: parseFloat(cat.share),
    z: [100, 80, 65, 50, 40, 30, 20][idx] ?? 30,
    color: cat.color,
  }));

  return (
    <div className="rounded-2xl bg-[#f4f4f6] dark:bg-[#141416] p-6 sm:p-8 space-y-6 shadow-xl border border-slate-200/80 dark:border-transparent">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Sentiment Category Analysis</h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Deep-dive feedback keyword categorization across key service themes.
          </p>
        </div>

        <ReviewHeaderActions />
      </div>

      <div className="grid gap-4 lg:grid-cols-[360px_minmax(0,1fr)]">
        {/* Chart Panel */}
        <div className="panel p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center gap-2">
            <Key className="size-4 text-blue-500" />
            <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
              Category Distribution
            </h3>
          </div>

          <div className="my-2">
            <VariablePieChart data={variablePieData} innerSize="40%" height={240} showDataLabels={true} />
          </div>
        </div>

        {/* Table Panel */}
        <div className="panel p-5 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Smile className="size-4 text-blue-500" />
            <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
              Keyword Sentiment Breakdown Table
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-secondary/30 text-muted-foreground font-semibold">
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Share %</th>
                  <th className="py-2.5 px-3">Positive Count</th>
                  <th className="py-2.5 px-3">Neutral Count</th>
                  <th className="py-2.5 px-3">Negative Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {categories.map((cat) => (
                  <tr key={cat.name} className="hover:bg-secondary/20 cursor-pointer transition-colors">
                    <td className="py-3 px-3 font-bold text-foreground flex items-center gap-2">
                      <span className="size-2.5 rounded-sm shrink-0" style={{ backgroundColor: cat.color }} />
                      <span>{cat.name}</span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-blue-400 tnum">{cat.share}</td>
                    <td className="py-3 px-3 font-semibold text-emerald-400 tnum">{cat.positive}</td>
                    <td className="py-3 px-3 font-semibold text-yellow-400 tnum">{cat.neutral}</td>
                    <td className="py-3 px-3 font-semibold text-red-400 tnum">{cat.negative}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
