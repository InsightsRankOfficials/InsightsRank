import React, { useState } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Cloud,
  Plug,
  RefreshCw,
  ShieldCheck,
  UserPlus,
  Users,
  Search,
  Filter,
  MoreVertical,
  Plus,
  Database,
  Building2,
  Zap,
  Server,
  Key,
  Globe,
  Sliders,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  useApiConnections,
  useConnectIntegration,
  useDisconnectIntegration,
  useIntegrations,
  useReconnectIntegration,
  useStartSync,
  useSyncJobs,
  useSyncOverview,
} from "@/hooks/use-ops";
import { useUsers } from "@/hooks/use-users";
import { useWorkspace } from "@/hooks/use-workspace";
import { compactNumber, formatDuration, relativeTime, titleCase } from "@/lib/format";
import { SettingsHubTab } from "@/components/settings/settings-hub-tab";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { GoogleGIcon } from "@/components/ui/google-g-icon";
import { toast } from "sonner";

/* -------------------------------------------------------------------------- */
/* 1. GOOGLE INTEGRATIONS PAGE                                                */
/* -------------------------------------------------------------------------- */
export function IntegrationsPage() {
  const integrations = useIntegrations();
  const api = useApiConnections();
  const reconnect = useReconnectIntegration();
  const disconnect = useDisconnectIntegration();
  const connectMutation = useConnectIntegration();
  const startSync = useStartSync();

  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [accountName, setAccountName] = useState("");
  const [accountEmail, setAccountEmail] = useState("");

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    const email = accountEmail.trim() || `gbp-partner-${Date.now().toString().slice(-4)}@insightsrank.com`;
    const name = accountName.trim() || "Central Region GBP";

    connectMutation.mutate(
      { accountEmail: email, accountName: name },
      {
        onSuccess: () => {
          setConnectModalOpen(false);
          setAccountName("");
          setAccountEmail("");
        },
      }
    );
  };

  const handleSyncNow = (name: string) => {
    startSync.mutate(name);
  };

  return (
    <div className="space-y-6 text-foreground">
      {/* Header matching Rankings Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">
            Google Integrations
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Connection health, OAuth token status, and Google Business Profile API readiness for every account.
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setConnectModalOpen(true)}
            className="px-4 py-1.5 rounded-lg bg-blue-400 hover:bg-blue-500 text-black text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <Plug className="size-4" />
            Connect Account
          </button>
        </div>
      </div>

      {/* Connected Accounts Cards Grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        {(integrations.data ?? []).map((item) => (
          <div
            key={item.id}
            className="panel p-5 flex flex-col justify-between space-y-4 hover:border-blue-500/40 transition-colors shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="grid size-10 place-items-center rounded-lg bg-blue-400/10 border border-blue-400/20 text-blue-400 shrink-0">
                  <GoogleGIcon className="size-5" />
                </span>
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-bold text-foreground">
                    {item.accountName}
                  </h2>
                  <p className="truncate text-xs text-muted-foreground font-mono">
                    {item.accountEmail}
                  </p>
                </div>
              </div>

              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                  item.status === "connected"
                    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                    : item.status === "expired"
                    ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                    : item.status === "disconnected"
                    ? "bg-zinc-700/30 text-zinc-400 border-zinc-600/30"
                    : "bg-blue-500/15 text-blue-400 border-blue-500/30"
                }`}
              >
                {titleCase(item.status)}
              </span>
            </div>

            {item.message && (
              <div className="flex items-center gap-2 rounded-lg border border-blue-500/20 bg-blue-500/5 p-3 text-xs text-blue-400">
                <AlertTriangle className="size-4 shrink-0" />
                <span>{item.message}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 border-y border-border py-3.5 text-xs">
              <div>
                <span className="text-[11px] font-semibold text-blue-500 uppercase tracking-wider block mb-0.5">
                  Locations Connected
                </span>
                <strong className="tnum block text-xl font-extrabold text-foreground">
                  {compactNumber(item.locationsConnected)}
                </strong>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-blue-500 uppercase tracking-wider block mb-0.5">
                  Last Sync
                </span>
                <strong className="block text-sm font-bold text-foreground mt-1">
                  {item.lastSyncAt ? relativeTime(item.lastSyncAt) : "Never"}
                </strong>
              </div>
            </div>

            <div className="flex justify-end items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleSyncNow(item.accountName)}
                className="px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-secondary text-xs font-semibold text-foreground transition-colors cursor-pointer"
              >
                Sync Now
              </button>
              {item.status !== "connected" ? (
                <button
                  type="button"
                  onClick={() => reconnect.mutate(item.id)}
                  disabled={reconnect.isPending}
                  className="px-3 py-1.5 rounded-lg bg-blue-400 hover:bg-blue-500 text-black text-xs font-bold transition-colors cursor-pointer shadow-sm"
                >
                  {reconnect.isPending ? "Connecting..." : "Reconnect"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => disconnect.mutate(item.id)}
                  disabled={disconnect.isPending}
                  className="px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-rose-500/20 hover:text-rose-400 text-xs font-semibold text-muted-foreground transition-colors cursor-pointer"
                >
                  Disconnect
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Connect Account Modal */}
      <Dialog open={connectModalOpen} onOpenChange={setConnectModalOpen}>
        <DialogContent className="max-w-md bg-card dark:bg-[#121214] border-border text-foreground p-6 shadow-2xl rounded-2xl space-y-4">
          <DialogHeader className="space-y-1">
            <div className="flex items-center gap-2.5 text-blue-500 mb-1">
              <span className="grid size-8 place-items-center rounded-lg bg-blue-400/10 border border-blue-400/20">
                <GoogleGIcon className="size-4" />
              </span>
              <DialogTitle className="text-base font-bold text-foreground">
                Connect Google Account
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Authorize InsightsRank to connect with Google Business Profile Manager to sync profile locations, insights, and reviews.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleConnect} className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-blue-500 uppercase tracking-wider block">
                Account Label / Group Name
              </label>
              <Input
                placeholder="e.g. Central Region GBP"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="bg-background border-border text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-blue-500 focus-visible:ring-0"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-blue-500 uppercase tracking-wider block">
                Google Manager Email Address
              </label>
              <Input
                type="email"
                placeholder="e.g. gbp-central@insightsrank.com"
                value={accountEmail}
                onChange={(e) => setAccountEmail(e.target.value)}
                className="bg-background border-border text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-blue-500 focus-visible:ring-0"
              />
            </div>

            <DialogFooter className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setConnectModalOpen(false)}
                className="px-3.5 py-1.5 rounded-lg border border-border bg-background hover:bg-secondary text-xs font-semibold text-foreground transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={connectMutation.isPending}
                className="px-4 py-1.5 rounded-lg bg-blue-400 hover:bg-blue-500 disabled:opacity-50 text-black text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
              >
                <GoogleGIcon className="size-4" />
                {connectMutation.isPending ? "Connecting..." : "Sign in with Google"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Section: API Health Table */}
      <div className="panel p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Activity className="size-4 text-blue-500" />
          <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
            Google Business Profile API Health
          </h3>
        </div>

        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/40 dark:bg-[#18181b]/40 text-muted-foreground font-semibold">
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Success Rate</th>
                <th className="py-3 px-3 text-right">p95 Latency</th>
                <th className="py-3 px-4">Quota Usage</th>
                <th className="py-3 px-4 text-right">Requests / 24h</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-foreground">
              {(api.data ?? []).map((x) => (
                <tr key={x.id} className="hover:bg-muted/40 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-bold text-foreground">{x.name}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">{x.endpoint}</p>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {x.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-bold tnum text-emerald-400">
                    {x.successRatePct}%
                  </td>
                  <td className="py-3 px-3 text-right font-mono tnum text-muted-foreground">
                    {x.p95LatencyMs} ms
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-36 bg-secondary dark:bg-[#18181b] rounded-full h-2 overflow-hidden border border-border">
                      <div
                        className="bg-blue-400 h-full rounded-full"
                        style={{ width: `${x.quotaUsedPct}%` }}
                      />
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-bold tnum">
                    {compactNumber(x.requests24h)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 2. SYNC CENTER PAGE                                                       */
/* -------------------------------------------------------------------------- */
export function SyncPage() {
  const overview = useSyncOverview();
  const jobs = useSyncJobs({ page: 1, pageSize: 20 });
  const start = useStartSync();
  const o = overview.data;

  return (
    <div className="space-y-6 text-foreground">
      {/* Header matching Rankings Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">
            Sync Center
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Monitor high-volume jobs, retries, real-time throughput, and data freshness across all locations.
          </p>
        </div>

        <div>
          <button
            type="button"
            disabled={start.isPending}
            onClick={() => start.mutate("all locations")}
            className="px-4 py-1.5 rounded-lg bg-blue-400 hover:bg-blue-500 disabled:opacity-50 text-black text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <RefreshCw className={`size-3.5 ${start.isPending ? "animate-spin" : ""}`} />
            Start Full Sync
          </button>
        </div>
      </div>

      {/* Row 1: 4 Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
        <div className="panel p-4 flex flex-col justify-between h-full space-y-2 shadow-sm">
          <div className="flex items-center gap-1.5 text-blue-500">
            <Activity className="size-3.5" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-500">
              Running Jobs
            </span>
          </div>
          <div>
            <p className="tnum text-3xl font-extrabold tracking-tight text-foreground">
              {o?.running ?? 0}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Active worker threads</p>
          </div>
        </div>

        <div className="panel p-4 flex flex-col justify-between h-full space-y-2 shadow-sm">
          <div className="flex items-center gap-1.5 text-blue-500">
            <Clock className="size-3.5" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-500">
              Queued Jobs
            </span>
          </div>
          <div>
            <p className="tnum text-3xl font-extrabold tracking-tight text-foreground">
              {o?.queued ?? 0}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Pending execution</p>
          </div>
        </div>

        <div className="panel p-4 flex flex-col justify-between h-full space-y-2 shadow-sm">
          <div className="flex items-center gap-1.5 text-blue-500">
            <RefreshCw className="size-3.5" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-500">
              Locations / 24h
            </span>
          </div>
          <div>
            <p className="tnum text-3xl font-extrabold tracking-tight text-foreground">
              {compactNumber(o?.locationsProcessed24h ?? 0)}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Processed successfully</p>
          </div>
        </div>

        <div className="panel p-4 flex flex-col justify-between h-full space-y-2 shadow-sm">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <AlertTriangle className="size-3.5" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
              Errors / 24h
            </span>
          </div>
          <div>
            <p className="tnum text-3xl font-extrabold tracking-tight text-emerald-400">
              {compactNumber(o?.errorCount24h ?? 0)}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">0% failure rate</p>
          </div>
        </div>
      </div>

      {/* Row 2: Live Sync Jobs Table */}
      <div className="panel p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-2">
          <RefreshCw className="size-4 text-blue-500" />
          <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
            Active &amp; Recent Sync Jobs
          </h3>
        </div>

        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/40 text-muted-foreground font-semibold select-none">
                <th className="py-3 px-4">Job</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4">Progress</th>
                <th className="py-3 px-3 text-right">Locations</th>
                <th className="py-3 px-3 text-right">Records</th>
                <th className="py-3 px-3">Duration</th>
                <th className="py-3 px-4">Triggered By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-foreground">
              {(jobs.data?.data ?? []).map((j) => {
                const pct = Math.round(
                  (j.locationsProcessed / Math.max(1, j.locationsTotal)) * 100
                );
                return (
                  <tr key={j.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-bold text-foreground">{titleCase(j.type)}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">{j.id}</p>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          j.status === "completed"
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                            : j.status === "failed"
                            ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                            : "bg-blue-500/15 text-blue-400 border-blue-500/30"
                        }`}
                      >
                        {j.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex w-36 items-center gap-2">
                        <div className="w-full bg-secondary rounded-full h-2 overflow-hidden border border-border">
                          <div
                            className="bg-blue-400 h-full rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="tnum text-[10px] font-bold text-blue-400">{pct}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right font-mono tnum text-foreground">
                      {compactNumber(j.locationsProcessed)} / {compactNumber(j.locationsTotal)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono tnum text-muted-foreground">
                      {compactNumber(j.recordsProcessed)}
                    </td>
                    <td className="py-3 px-3 text-muted-foreground font-mono">
                      {formatDuration(j.durationSec)}
                    </td>
                    <td className="py-3 px-4 text-foreground font-semibold">
                      {j.triggeredBy}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 3. ORGANIZATION USERS PAGE                                                 */
/* -------------------------------------------------------------------------- */
export function UsersPage() {
  const users = useUsers({ page: 1, pageSize: 25 });
  const [searchTerm, setSearchTerm] = useState("");

  const userList = users.data?.data ?? [];
  const filteredUsers = userList.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 text-foreground">
      {/* Header matching Rankings Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">
            Organization Users
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Manage access, team roles, location scopes, and account invitations.
          </p>
        </div>

        <div>
          <button
            type="button"
            className="px-4 py-1.5 rounded-lg bg-blue-400 hover:bg-blue-500 text-black text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <UserPlus className="size-4" />
            Invite User
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search users by name, email, or role..."
          className="w-full pl-9 pr-4 py-1.5 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
        />
      </div>

      {/* Data Table */}
      <div className="panel overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/40 text-muted-foreground font-semibold select-none">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Teams</th>
                <th className="py-3 px-4">Location Scope</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4">Last Active</th>
                <th className="py-3 px-3 text-center w-12">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-foreground">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-blue-400/20 border border-blue-400/40 text-blue-400 font-bold flex items-center justify-center text-xs">
                        {u.avatarInitials}
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{u.name}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-secondary border border-border text-blue-500 dark:text-blue-400">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-muted-foreground font-medium">
                    {u.teams.join(", ")}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{u.locationScope}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        u.status === "active"
                          ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                          : "bg-zinc-700/30 text-zinc-400 border-zinc-600/30"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {relativeTime(u.lastActiveAt)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer">
                          <MoreVertical className="size-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover border-border text-popover-foreground text-xs">
                        <DropdownMenuItem className="hover:bg-secondary cursor-pointer">Edit Role</DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-secondary cursor-pointer">Resend Invite</DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-secondary cursor-pointer text-rose-400">Deactivate</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 4. ORGANIZATION OVERVIEW PAGE                                              */
/* -------------------------------------------------------------------------- */
export function OrganizationPage() {
  const { organization } = useWorkspace();

  return (
    <div className="space-y-6 text-foreground">
      {/* Header matching Rankings Section */}
      <div>
        <h1 className="text-xl font-bold text-foreground tracking-tight">
          Organization Overview
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Enterprise tenancy, account usage, managed locations, and governance posture.
        </p>
      </div>

      {/* Row 1: 4 Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
        <div className="panel p-4 flex flex-col justify-between h-full space-y-2 shadow-sm">
          <div className="flex items-center gap-1.5 text-blue-500">
            <Cloud className="size-3.5" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-500">
              Managed Locations
            </span>
          </div>
          <div>
            <p className="tnum text-3xl font-extrabold tracking-tight text-foreground">
              {compactNumber(organization.locationCount)}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">100% Synced live</p>
          </div>
        </div>

        <div className="panel p-4 flex flex-col justify-between h-full space-y-2 shadow-sm">
          <div className="flex items-center gap-1.5 text-blue-500">
            <Users className="size-3.5" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-500">
              Organization Users
            </span>
          </div>
          <div>
            <p className="tnum text-3xl font-extrabold tracking-tight text-foreground">
              {compactNumber(organization.userCount)}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">12 Active Teams</p>
          </div>
        </div>

        <div className="panel p-4 flex flex-col justify-between h-full space-y-2 shadow-sm">
          <div className="flex items-center gap-1.5 text-blue-500">
            <Plug className="size-3.5" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-500">
              Google Accounts
            </span>
          </div>
          <div>
            <p className="tnum text-3xl font-extrabold tracking-tight text-foreground">
              {organization.connectedGoogleAccounts}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">OAuth 2.0 Connected</p>
          </div>
        </div>

        <div className="panel p-4 flex flex-col justify-between h-full space-y-2 shadow-sm">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="size-3.5" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
              API Status
            </span>
          </div>
          <div>
            <p className="tnum text-3xl font-extrabold tracking-tight text-emerald-400">
              {titleCase(organization.apiStatus)}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">SOC2 &amp; GDPR Compliant</p>
          </div>
        </div>
      </div>

      {/* Row 2: Organization Details Panel */}
      <div className="panel p-6 space-y-5 shadow-sm">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Building2 className="size-4 text-blue-500" />
          <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
            {organization.name} — Tenancy Details
          </h3>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 text-xs">
          <div>
            <p className="text-[11px] font-semibold text-blue-500 uppercase tracking-wider mb-1">
              Subscription Plan
            </p>
            <p className="text-base font-bold text-foreground">{titleCase(organization.plan)} Tier</p>
          </div>

          <div>
            <p className="text-[11px] font-semibold text-blue-500 uppercase tracking-wider mb-1">
              Organization Created
            </p>
            <p className="text-base font-bold text-foreground">14 Mar 2021</p>
          </div>

          <div>
            <p className="text-[11px] font-semibold text-blue-500 uppercase tracking-wider mb-1">
              Data Residency Region
            </p>
            <p className="text-base font-bold text-foreground">India (Mumbai)</p>
          </div>

          <div>
            <p className="text-[11px] font-semibold text-blue-500 uppercase tracking-wider mb-1">
              Cloud Storage Usage
            </p>
            <p className="text-base font-bold text-foreground">
              {organization.storageUsedGb} / {organization.storageLimitGb} GB
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 5. SETTINGS PAGE                                                           */
/* -------------------------------------------------------------------------- */
export function SettingsPage() {
  return <SettingsHubTab />;
}
