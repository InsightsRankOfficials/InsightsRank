import { useState } from "react";
import { Page } from "@/components/layout/page";
import { ReviewsOverviewTab } from "@/components/reviews/reviews-overview-tab";
import { ReviewsFeedTab } from "@/components/reviews/reviews-feed-tab";
import { ReviewsReportsTab } from "@/components/reviews/reviews-reports-tab";
import { ReviewsSentimentCategoryTab } from "@/components/reviews/reviews-sentiment-category-tab";
import { ReviewsResponseTemplatesTab } from "@/components/reviews/reviews-response-templates-tab";

export type ReviewSubTab =
  | "overview"
  | "reviews"
  | "reports"
  | "sentiment-category"
  | "response-templates";

export function ReviewsPage({ initialTab = "overview" }: { initialTab?: ReviewSubTab }) {
  const [activeTab, setActiveTab] = useState<ReviewSubTab>(initialTab);

  const tabs: { id: ReviewSubTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "reviews", label: "Reviews" },
    { id: "reports", label: "Reports" },
    { id: "sentiment-category", label: "Sentiment Category" },
    { id: "response-templates", label: "Response Templates" },
  ];

  return (
    <Page>
      {/* Top Sub-Nav Tab Bar */}
      <div className="border-b border-border bg-background -mx-4 -mt-4 px-4 sm:-mx-6 sm:-mt-6 sm:px-6 mb-6">
        <nav className="flex items-center gap-6 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-500 font-bold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Sub-tab Views */}
      {activeTab === "overview" && <ReviewsOverviewTab />}
      {activeTab === "reviews" && <ReviewsFeedTab />}
      {activeTab === "reports" && <ReviewsReportsTab />}
      {activeTab === "sentiment-category" && <ReviewsSentimentCategoryTab />}
      {activeTab === "response-templates" && <ReviewsResponseTemplatesTab />}
    </Page>
  );
}
