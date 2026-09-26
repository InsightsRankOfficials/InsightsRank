import { useState } from "react";
import { Page } from "@/components/layout/page";
import { RankingsOverviewTab } from "@/components/rankings/rankings-overview-tab";
import { RankReportsTab } from "@/components/rankings/rank-reports-tab";
import { RankReportDetailView } from "@/components/rankings/rank-report-detail-view";
import { ConfigureReportView } from "@/components/rankings/configure-report-view";
import { RankingsCompetitorsTab } from "@/components/rankings/rankings-competitors-tab";
import { RankingsGeoGridTab } from "@/components/rankings/rankings-geo-grid-tab";
import { type RankReportStoreItem } from "@/data/rankings-analytics";

export type RankingSubTab =
  | "overview"
  | "reports"
  | "competitors"
  | "geo-grid"
  | "report-detail"
  | "configure";

export function RankingsPage({ initialTab = "overview" }: { initialTab?: RankingSubTab }) {
  const [activeTab, setActiveTab] = useState<RankingSubTab>(initialTab);
  const [selectedReportStore, setSelectedReportStore] = useState<RankReportStoreItem | undefined>();

  const handleSelectStoreReport = (store: RankReportStoreItem) => {
    setSelectedReportStore(store);
    setActiveTab("report-detail");
  };

  const handleBackToReports = () => {
    setActiveTab("reports");
  };

  return (
    <Page>
      {/* Top Sub-Nav Bar */}
      {activeTab !== "configure" && (
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
              onClick={() => setActiveTab("reports")}
              className={`py-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                activeTab === "reports" || activeTab === "report-detail"
                  ? "border-blue-500 text-blue-500 font-bold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Rank Reports
            </button>

            <button
              onClick={() => setActiveTab("competitors")}
              className={`py-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                activeTab === "competitors"
                  ? "border-blue-500 text-blue-500 font-bold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Competitors
            </button>

            <button
              onClick={() => setActiveTab("geo-grid")}
              className={`py-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                activeTab === "geo-grid"
                  ? "border-blue-500 text-blue-500 font-bold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Geo Grid
            </button>
          </nav>
        </div>
      )}

      {/* View Sub-Tabs */}
      {activeTab === "overview" && <RankingsOverviewTab />}

      {activeTab === "reports" && (
        <RankReportsTab
          onSelectStore={handleSelectStoreReport}
          onConfigureReport={() => setActiveTab("configure")}
        />
      )}

      {activeTab === "competitors" && <RankingsCompetitorsTab />}

      {activeTab === "geo-grid" && <RankingsGeoGridTab />}

      {activeTab === "report-detail" && (
        <RankReportDetailView
          initialStore={selectedReportStore}
          onBack={handleBackToReports}
        />
      )}

      {activeTab === "configure" && (
        <ConfigureReportView
          onBack={handleBackToReports}
          onSave={handleBackToReports}
        />
      )}
    </Page>
  );
}
