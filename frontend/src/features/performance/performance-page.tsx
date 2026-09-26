import { useState } from "react";
import { Page } from "@/components/layout/page";
import { PerformanceOverviewTab } from "@/components/performance/performance-overview-tab";
import { PerformanceInsightsTab } from "@/components/performance/performance-insights-tab";
import { PerformanceReportsTab } from "@/components/performance/performance-reports-tab";

interface PerformancePageProps {
  initialTab?: "overview" | "insights" | "reports";
}

export function PerformancePage({ initialTab = "overview" }: PerformancePageProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "insights" | "reports">(initialTab);

  return (
    <Page>
      {/* Top Sub-Nav Bar matching Rankings identical structure */}
      <div className="border-b border-border bg-background -mx-4 -mt-4 px-4 sm:-mx-6 sm:-mt-6 sm:px-6 mb-6">
        <nav className="flex items-center gap-6 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
              activeTab === "overview"
                ? "border-blue-500 text-blue-500 font-bold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("insights")}
            className={`py-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
              activeTab === "insights"
                ? "border-blue-500 text-blue-500 font-bold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Insights
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`py-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
              activeTab === "reports"
                ? "border-blue-500 text-blue-500 font-bold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Reports
          </button>
        </nav>
      </div>

      {/* Render Active Tab Content */}
      {activeTab === "overview" && <PerformanceOverviewTab />}
      {activeTab === "insights" && <PerformanceInsightsTab />}
      {activeTab === "reports" && <PerformanceReportsTab />}
    </Page>
  );
}
