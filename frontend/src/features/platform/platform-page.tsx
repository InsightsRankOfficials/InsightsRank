import { useState } from "react";
import { Page } from "@/components/layout/page";
import { IntegrationsPage, SyncPage, SettingsPage } from "@/features/platform/platform-pages";
import { SecondaryPage } from "@/features/platform/secondary-page";
import { CircleHelp } from "lucide-react";

export type PlatformSubTab = "integrations" | "sync" | "settings" | "help";

export function PlatformUnifiedPage({ initialTab = "integrations" }: { initialTab?: PlatformSubTab }) {
  const [activeTab, setActiveTab] = useState<PlatformSubTab>(initialTab);

  return (
    <Page>
      {/* Top Sub-Nav Bar matching Performance & Rankings structure */}
      <div className="border-b border-border bg-background -mx-4 -mt-4 px-4 sm:-mx-6 sm:-mt-6 sm:px-6 mb-6">
        <nav className="flex items-center gap-6 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("integrations")}
            className={`py-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
              activeTab === "integrations"
                ? "border-blue-500 text-blue-500 font-bold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Integrations
          </button>
          <button
            onClick={() => setActiveTab("sync")}
            className={`py-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
              activeTab === "sync"
                ? "border-blue-500 text-blue-500 font-bold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Sync Center
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`py-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
              activeTab === "settings"
                ? "border-blue-500 text-blue-500 font-bold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Settings
          </button>
          <button
            onClick={() => setActiveTab("help")}
            className={`py-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
              activeTab === "help"
                ? "border-blue-500 text-blue-500 font-bold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Help & Docs
          </button>
        </nav>
      </div>

      {/* Render Active Tab Content */}
      {activeTab === "integrations" && <IntegrationsPage />}
      {activeTab === "sync" && <SyncPage />}
      {activeTab === "settings" && <SettingsPage />}
      {activeTab === "help" && (
        <SecondaryPage
          title="Help & documentation"
          description="Guides, API reference and support resources."
          icon={CircleHelp}
          items={["Getting started guide", "API reference", "Webhooks & events", "Troubleshooting", "System status", "Contact support"]}
        />
      )}
    </Page>
  );
}
