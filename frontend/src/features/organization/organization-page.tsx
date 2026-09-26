import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Page } from "@/components/layout/page";
import { OrganizationOverviewTab } from "./organization-overview-tab";
import { OrganizationUsersTab } from "./organization-users-tab";
import { OrganizationRolesTab } from "./organization-roles-tab";
import { OrganizationAuditLogsTab } from "./organization-audit-logs-tab";

export type OrganizationSubTab = "overview" | "users" | "roles" | "audit-log";

export function OrganizationUnifiedPage({ initialTab = "overview" }: { initialTab?: OrganizationSubTab }) {
  const [activeTab, setActiveTab] = useState<OrganizationSubTab>(initialTab);
  const navigate = useNavigate();

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleTabChange = (tab: OrganizationSubTab) => {
    setActiveTab(tab);
    const targetPath =
      tab === "overview"
        ? "/organization"
        : tab === "users"
        ? "/organization/users"
        : tab === "roles"
        ? "/organization/roles"
        : "/organization/audit-log";

    navigate({ to: targetPath });
  };

  return (
    <Page>
      {/* Top Sub-Nav Bar matching Performance & Rankings structure */}
      <div className="border-b border-border bg-background -mx-4 -mt-4 px-4 sm:-mx-6 sm:-mt-6 sm:px-6 mb-6">
        <nav className="flex items-center gap-6 overflow-x-auto no-scrollbar">
          <button
            onClick={() => handleTabChange("overview")}
            className={`py-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
              activeTab === "overview"
                ? "border-blue-500 text-blue-500 font-bold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => handleTabChange("users")}
            className={`py-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
              activeTab === "users"
                ? "border-blue-500 text-blue-500 font-bold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Users
          </button>
          <button
            onClick={() => handleTabChange("roles")}
            className={`py-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
              activeTab === "roles"
                ? "border-blue-500 text-blue-500 font-bold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Roles &amp; Permissions
          </button>
          <button
            onClick={() => handleTabChange("audit-log")}
            className={`py-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
              activeTab === "audit-log"
                ? "border-blue-500 text-blue-500 font-bold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Audit Logs
          </button>
        </nav>
      </div>

      {/* Render Active Tab Content */}
      {activeTab === "overview" && <OrganizationOverviewTab onNavigateTab={handleTabChange} />}
      {activeTab === "users" && <OrganizationUsersTab />}
      {activeTab === "roles" && <OrganizationRolesTab />}
      {activeTab === "audit-log" && <OrganizationAuditLogsTab />}
    </Page>
  );
}
