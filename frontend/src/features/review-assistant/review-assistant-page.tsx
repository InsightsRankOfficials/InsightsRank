import React, { useState } from "react";
import { Page } from "@/components/layout/page";
import { OverviewTab } from "@/components/review-assistant/overview-tab";
import { ReviewLogsTab } from "@/components/review-assistant/review-logs-tab";
import { OptionsTab } from "@/components/review-assistant/options-tab";
import { ReviewJourneyDetails } from "@/components/review-assistant/review-journey-details";
import { ReviewLogItem } from "@/data/review-assistant-analytics";

export type ReviewAssistantSubTab = "overview" | "review-logs" | "options";

export function ReviewAssistantPage() {
  const [activeTab, setActiveTab] = useState<ReviewAssistantSubTab>("overview");
  const [selectedLogForJourney, setSelectedLogForJourney] = useState<ReviewLogItem | null>(null);

  return (
    <Page>
      {/* If viewing Review Journey Details, render details view without top sub-nav bar */}
      {selectedLogForJourney ? (
        <ReviewJourneyDetails
          log={selectedLogForJourney}
          onBack={() => setSelectedLogForJourney(null)}
        />
      ) : (
        <>
          {/* Top Sub-Nav Tab Bar matching standard design system */}
          <div className="border-b border-border bg-background -mx-4 -mt-4 sm:-mx-5 sm:-mt-5 lg:-mx-6 lg:-mt-6 px-4 sm:px-5 lg:px-6 mb-6">
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
                onClick={() => setActiveTab("review-logs")}
                className={`py-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                  activeTab === "review-logs"
                    ? "border-blue-500 text-blue-500 font-bold"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Review Logs
              </button>

              <button
                onClick={() => setActiveTab("options")}
                className={`py-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                  activeTab === "options"
                    ? "border-blue-500 text-blue-500 font-bold"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Options
              </button>
            </nav>
          </div>

          {/* Render Active Sub Tab Content */}
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "review-logs" && (
            <ReviewLogsTab onViewLog={(log) => setSelectedLogForJourney(log)} />
          )}
          {activeTab === "options" && <OptionsTab />}
        </>
      )}
    </Page>
  );
}
