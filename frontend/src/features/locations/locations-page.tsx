import { useState } from "react";
import { Page } from "@/components/layout/page";
import { LocationsOverviewTab } from "@/components/locations/locations-overview-tab";
import { LocationsMasterProfilesTab } from "@/components/locations/locations-master-profiles-tab";
import { LocationsPlatformProfilesTab } from "@/components/locations/locations-platform-profiles-tab";
import { LocationsUnclaimedProfilesTab } from "@/components/locations/locations-unclaimed-profiles-tab";
import { LocationsDuplicateProfilesTab } from "@/components/locations/locations-duplicate-profiles-tab";
import { LocationsGoogleUpdatesTab } from "@/components/locations/locations-google-updates-tab";
import { LocationsTagsTab } from "@/components/locations/locations-tags-tab";

type LocationSubTab =
  | "overview"
  | "master-profiles"
  | "platform-profiles"
  | "unclaimed-profiles"
  | "duplicate-profiles"
  | "google-updates"
  | "tags";

export function LocationsPage() {
  const [activeTab, setActiveTab] = useState<LocationSubTab>("overview");
  const [isFullScreen, setIsFullScreen] = useState(false);

  const tabs: { id: LocationSubTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "master-profiles", label: "Master Profiles" },
    { id: "platform-profiles", label: "Platform Profiles" },
    { id: "unclaimed-profiles", label: "Unclaimed Profiles" },
    { id: "duplicate-profiles", label: "Duplicate Profiles" },
    { id: "google-updates", label: "Google Updates" },
    { id: "tags", label: "Tags" },
  ];

  const handleTabChange = (tabId: LocationSubTab) => {
    setActiveTab(tabId);
    setIsFullScreen(false);
  };

  return (
    <Page>
      {/* Top Sub-Nav Tab Bar hided when in full screen Create/Edit/Detail view */}
      {!isFullScreen && (
        <div className="border-b border-border bg-background -mx-4 -mt-4 px-4 sm:-mx-6 sm:-mt-6 sm:px-6 mb-6">
          <nav className="flex items-center gap-6 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`py-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-500"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Tab Contents */}
      {activeTab === "overview" && <LocationsOverviewTab />}
      {activeTab === "master-profiles" && (
        <LocationsMasterProfilesTab onViewModeChange={setIsFullScreen} />
      )}
      {activeTab === "platform-profiles" && (
        <LocationsPlatformProfilesTab onViewModeChange={setIsFullScreen} />
      )}
      {activeTab === "unclaimed-profiles" && (
        <LocationsUnclaimedProfilesTab onViewModeChange={setIsFullScreen} />
      )}
      {activeTab === "duplicate-profiles" && <LocationsDuplicateProfilesTab />}
      {activeTab === "google-updates" && <LocationsGoogleUpdatesTab />}
      {activeTab === "tags" && <LocationsTagsTab />}
    </Page>
  );
}
