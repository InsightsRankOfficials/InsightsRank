import React, { useState } from "react";
import {
  Building2,
  Cloud,
  Users,
  Plug,
  ShieldCheck,
  Activity,
  Edit2,
  ExternalLink,
  CheckCircle2,
  Database,
  Globe2,
  Clock,
  ArrowRight,
  Save,
  X,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useWorkspace } from "@/hooks/use-workspace";
import { compactNumber, titleCase, relativeTime } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface OrganizationOverviewTabProps {
  onNavigateTab: (tab: "overview" | "users" | "roles" | "audit-log") => void;
}

export function OrganizationOverviewTab({ onNavigateTab }: OrganizationOverviewTabProps) {
  const navigate = useNavigate();
  const { organization } = useWorkspace();

  // Organization Tenancy Editable State
  const [orgData, setOrgData] = useState({
    name: organization.name || "InsightsRank Officials",
    plan: organization.plan || "enterprise",
    region: "India (Mumbai)",
    storageUsedGb: organization.storageUsedGb || 42,
    storageLimitGb: organization.storageLimitGb || 100,
    createdDate: "14 Mar 2021",
  });

  // Modal States
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [apiHealthModalOpen, setApiHealthModalOpen] = useState(false);

  // Form State for Edit Modal
  const [editForm, setEditForm] = useState({ ...orgData });

  const handleSaveTenancy = (e: React.FormEvent) => {
    e.preventDefault();
    setOrgData({ ...editForm });
    setEditModalOpen(false);
    toast.success("Organization tenancy details updated successfully!");
  };

  // Mock API Services status
  const apiServices = [
    { name: "Google Business Profile API", endpoint: "accounts.locations", status: "Operational", latency: "142 ms", uptime: "99.98%" },
    { name: "Google Search Console API", endpoint: "searchAnalytics.query", status: "Operational", latency: "185 ms", uptime: "99.95%" },
    { name: "Google Maps Insights API", endpoint: "insights.locations", status: "Operational", latency: "120 ms", uptime: "99.99%" },
    { name: "Reviews Management API", endpoint: "locations.reviews", status: "Operational", latency: "160 ms", uptime: "99.96%" },
  ];

  // Recent Organization Audit Trail Preview
  const recentActivities = [
    { id: "act_1", user: "Aarav Sharma", action: "Invited user Diya Patel (Analyst)", time: "10 mins ago", type: "user" },
    { id: "act_2", user: "Sneha Joshi", action: "Updated Google Account OAuth permissions", time: "1 hour ago", type: "integration" },
    { id: "act_3", user: "Vikram Bose", action: "Triggered bulk sync for 25 store locations", time: "3 hours ago", type: "sync" },
    { id: "act_4", user: "Ananya Roy", action: "Exported monthly Performance Insights report", time: "5 hours ago", type: "export" },
  ];

  return (
    <div className="space-y-6 text-foreground">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">
            Organization Overview
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Enterprise tenancy, account usage, managed locations, and governance posture.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => {
              setEditForm({ ...orgData });
              setEditModalOpen(true);
            }}
            className="h-8 bg-blue-500 hover:bg-blue-600 text-black font-bold text-xs px-3.5 cursor-pointer gap-1.5 rounded-md transition-colors shadow-sm"
          >
            <Edit2 className="size-3.5" />
            <span>Edit Tenancy Info</span>
          </Button>
        </div>
      </div>

      {/* Row 1: 4 Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
        {/* Card 1: Managed Locations */}
        <div
          onClick={() => navigate({ to: "/locations" })}
          className="panel p-4 flex flex-col justify-between h-full space-y-2 cursor-pointer hover:border-blue-500/40 transition-all shadow-sm group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-blue-500">
              <Cloud className="size-3.5" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-500">
                Managed Locations
              </span>
            </div>
            <ExternalLink className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <p className="tnum text-3xl font-extrabold tracking-tight text-foreground">
              {compactNumber(organization.locationCount || 1248)}
            </p>
            <p className="text-[10px] text-emerald-400 font-semibold mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="size-3" /> 100% Synced live
            </p>
          </div>
        </div>

        {/* Card 2: Organization Users */}
        <div
          onClick={() => onNavigateTab("users")}
          className="panel p-4 flex flex-col justify-between h-full space-y-2 cursor-pointer hover:border-blue-500/40 transition-all shadow-sm group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-blue-500">
              <Users className="size-3.5" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-500">
                Organization Users
              </span>
            </div>
            <ArrowRight className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <p className="tnum text-3xl font-extrabold tracking-tight text-foreground">
              {compactNumber(organization.userCount || 26)}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">12 Active Teams</p>
          </div>
        </div>

        {/* Card 3: Google Accounts */}
        <div
          onClick={() => navigate({ to: "/integrations" })}
          className="panel p-4 flex flex-col justify-between h-full space-y-2 cursor-pointer hover:border-blue-500/40 transition-all shadow-sm group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-blue-500">
              <Plug className="size-3.5" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-500">
                Google Accounts
              </span>
            </div>
            <ExternalLink className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <p className="tnum text-3xl font-extrabold tracking-tight text-foreground">
              {organization.connectedGoogleAccounts || 4}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">OAuth 2.0 Connected</p>
          </div>
        </div>

        {/* Card 4: API Status */}
        <div
          onClick={() => setApiHealthModalOpen(true)}
          className="panel p-4 flex flex-col justify-between h-full space-y-2 cursor-pointer hover:border-emerald-500/40 transition-all shadow-sm group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="size-3.5" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                API Status
              </span>
            </div>
            <Activity className="size-3 text-emerald-400 opacity-60 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <p className="tnum text-3xl font-extrabold tracking-tight text-emerald-400">
              {titleCase(organization.apiStatus || "operational")}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">SOC2 &amp; GDPR Compliant</p>
          </div>
        </div>
      </div>

      {/* Row 2: Organization Details Panel */}
      <div className="panel p-6 space-y-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Building2 className="size-4 text-blue-500" />
            <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
              {orgData.name} — Tenancy Details
            </h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setEditForm({ ...orgData });
              setEditModalOpen(true);
            }}
            className="h-7 text-xs border-border bg-background hover:bg-secondary text-foreground cursor-pointer"
          >
            Edit Info
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 text-xs">
          <div>
            <p className="text-[11px] font-semibold text-blue-500 uppercase tracking-wider mb-1">
              Subscription Plan
            </p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-500/15 text-blue-400 border border-blue-500/30">
              {titleCase(orgData.plan)} Tier
            </span>
          </div>

          <div>
            <p className="text-[11px] font-semibold text-blue-500 uppercase tracking-wider mb-1">
              Organization Created
            </p>
            <p className="text-sm font-bold text-foreground">{orgData.createdDate}</p>
          </div>

          <div>
            <p className="text-[11px] font-semibold text-blue-500 uppercase tracking-wider mb-1">
              Data Residency Region
            </p>
            <p className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <Globe2 className="size-3.5 text-blue-500" />
              <span>{orgData.region}</span>
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold text-blue-500 uppercase tracking-wider mb-1">
              Cloud Storage Usage
            </p>
            <div className="space-y-1">
              <p className="text-sm font-bold text-foreground">
                {orgData.storageUsedGb} / {orgData.storageLimitGb} GB
              </p>
              <div className="w-full bg-secondary dark:bg-[#18181b] rounded-full h-1.5 overflow-hidden border border-border">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (orgData.storageUsedGb / orgData.storageLimitGb) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Recent Organization Activity */}
      <div className="panel p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-blue-500" />
            <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
              Recent Organization Activity
            </h3>
          </div>
          <button
            onClick={() => onNavigateTab("audit-log")}
            className="text-xs text-blue-500 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>View All Audit Logs</span>
            <ArrowRight className="size-3.5" />
          </button>
        </div>

        <div className="divide-y divide-border">
          {recentActivities.map((act) => (
            <div key={act.id} className="py-3 flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <span className="size-7 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center font-bold text-[10px]">
                  {act.user.charAt(0)}
                </span>
                <div>
                  <p className="font-semibold text-foreground">{act.action}</p>
                  <p className="text-[10px] text-muted-foreground">Performed by {act.user}</p>
                </div>
              </div>
              <span className="text-[11px] text-muted-foreground font-mono shrink-0">{act.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal 1: Edit Tenancy Details Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-md bg-card dark:bg-[#121214] border-border text-foreground shadow-2xl rounded-xl">
          <DialogHeader className="border-b border-border pb-3">
            <DialogTitle className="text-sm font-bold text-blue-500 flex items-center gap-2">
              <Building2 className="size-4" />
              <span>Edit Organization Tenancy</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveTenancy} className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Organization Name</label>
              <input
                type="text"
                required
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full h-8 px-3 rounded-md bg-background border border-border text-foreground focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Subscription Plan</label>
                <select
                  value={editForm.plan}
                  onChange={(e) => setEditForm({ ...editForm, plan: e.target.value })}
                  className="w-full h-8 px-2.5 rounded-md bg-background border border-border text-foreground focus:border-blue-500 focus:outline-none cursor-pointer"
                >
                  <option value="starter" className="bg-popover text-foreground">Starter</option>
                  <option value="pro" className="bg-popover text-foreground">Pro</option>
                  <option value="enterprise" className="bg-popover text-foreground">Enterprise</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Data Residency Region</label>
                <select
                  value={editForm.region}
                  onChange={(e) => setEditForm({ ...editForm, region: e.target.value })}
                  className="w-full h-8 px-2.5 rounded-md bg-background border border-border text-foreground focus:border-blue-500 focus:outline-none cursor-pointer"
                >
                  <option value="India (Mumbai)" className="bg-popover text-foreground">India (Mumbai)</option>
                  <option value="US East (N. Virginia)" className="bg-popover text-foreground">US East (N. Virginia)</option>
                  <option value="EU Central (Frankfurt)" className="bg-popover text-foreground">EU Central (Frankfurt)</option>
                  <option value="Asia Pacific (Singapore)" className="bg-popover text-foreground">Asia Pacific (Singapore)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Used Storage (GB)</label>
                <input
                  type="number"
                  value={editForm.storageUsedGb}
                  onChange={(e) => setEditForm({ ...editForm, storageUsedGb: Number(e.target.value) })}
                  className="w-full h-8 px-3 rounded-md bg-background border border-border text-foreground focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Storage Limit (GB)</label>
                <input
                  type="number"
                  value={editForm.storageLimitGb}
                  onChange={(e) => setEditForm({ ...editForm, storageLimitGb: Number(e.target.value) })}
                  className="w-full h-8 px-3 rounded-md bg-background border border-border text-foreground focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEditModalOpen(false)}
                className="h-8 border-border bg-background hover:bg-secondary text-foreground cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="h-8 bg-blue-500 hover:bg-blue-600 text-black font-bold cursor-pointer gap-1.5"
              >
                <Save className="size-3.5" />
                <span>Save Changes</span>
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal 2: API Services Health Modal */}
      <Dialog open={apiHealthModalOpen} onOpenChange={setApiHealthModalOpen}>
        <DialogContent className="sm:max-w-xl bg-card dark:bg-[#121214] border-border text-foreground shadow-2xl rounded-xl">
          <DialogHeader className="border-b border-border pb-3">
            <DialogTitle className="text-sm font-bold text-emerald-400 flex items-center gap-2">
              <ShieldCheck className="size-4" />
              <span>Google API Infrastructure Readiness</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border bg-secondary/40 dark:bg-[#18181b] text-muted-foreground font-semibold">
                    <th className="py-2.5 px-3">Service Name</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">p95 Latency</th>
                    <th className="py-2.5 px-3 text-right">Uptime</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {apiServices.map((srv, idx) => (
                    <tr key={idx} className="hover:bg-muted/50">
                      <td className="py-2.5 px-3">
                        <p className="font-bold text-foreground">{srv.name}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">{srv.endpoint}</p>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          {srv.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono tnum text-muted-foreground">
                        {srv.latency}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold tnum text-emerald-400">
                        {srv.uptime}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setApiHealthModalOpen(false)}
                className="h-8 border-border bg-background text-foreground hover:bg-secondary cursor-pointer"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
