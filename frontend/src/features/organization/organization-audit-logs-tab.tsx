import React, { useState, useMemo } from "react";
import {
  ScrollText,
  Search,
  Filter,
  Download,
  Eye,
  UserPlus,
  ShieldCheck,
  RefreshCw,
  FileText,
  Plug,
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Code,
} from "lucide-react";
import { toast } from "sonner";
import { initials } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: { name: string; email: string; avatarInitials: string };
  action: string;
  category: "User Management" | "Integration Sync" | "Review Operations" | "Bulk Operations" | "Security";
  target: string;
  ipAddress: string;
  region: string;
  status: "success" | "warning" | "error";
  metadata: Record<string, any>;
}

const AUDIT_LOG_ITEMS: AuditLogItem[] = [
  {
    id: "log_101",
    timestamp: "25 Sep 2026, 02:30 PM",
    actor: { name: "Aarav Sharma", email: "aarav.sharma@insightsrank.com", avatarInitials: "AS" },
    action: "User Invited",
    category: "User Management",
    target: "diya.patel@insightsrank.com (Analyst)",
    ipAddress: "49.37.12.98",
    region: "Mumbai, IN",
    status: "success",
    metadata: { roleAssigned: "analyst", team: "Operations", scope: "All locations" },
  },
  {
    id: "log_102",
    timestamp: "25 Sep 2026, 01:15 PM",
    actor: { name: "Sneha Joshi", email: "sneha.joshi@insightsrank.com", avatarInitials: "SJ" },
    action: "OAuth Token Reconnected",
    category: "Integration Sync",
    target: "Google Business Account #104",
    ipAddress: "103.21.126.4",
    region: "Delhi, IN",
    status: "success",
    metadata: { accountId: "acc_google_104", scope: "https://www.googleapis.com/auth/business.manage" },
  },
  {
    id: "log_103",
    timestamp: "25 Sep 2026, 11:45 AM",
    actor: { name: "Vikram Bose", email: "vikram.bose@insightsrank.com", avatarInitials: "VB" },
    action: "Bulk Location Sync Queued",
    category: "Bulk Operations",
    target: "25 Locations in Maharashtra",
    ipAddress: "157.33.24.11",
    region: "Pune, IN",
    status: "success",
    metadata: { locationCount: 25, syncType: "full_metrics" },
  },
  {
    id: "log_104",
    timestamp: "25 Sep 2026, 09:20 AM",
    actor: { name: "Ananya Roy", email: "ananya.roy@insightsrank.com", avatarInitials: "AR" },
    action: "Performance Report Exported",
    category: "Review Operations",
    target: "Store Performance CSV",
    ipAddress: "122.176.45.19",
    region: "Bengaluru, IN",
    status: "success",
    metadata: { format: "csv", recordsExported: 1248 },
  },
  {
    id: "log_105",
    timestamp: "24 Sep 2026, 08:05 PM",
    actor: { name: "Rohan Verma", email: "rohan.verma@insightsrank.com", avatarInitials: "RV" },
    action: "Role Permissions Updated",
    category: "Security",
    target: "Role: Location Manager",
    ipAddress: "182.72.90.2",
    region: "Hyderabad, IN",
    status: "warning",
    metadata: { modifiedFields: ["permissions.locations.sync"], granted: true },
  },
  {
    id: "log_106",
    timestamp: "24 Sep 2026, 05:40 PM",
    actor: { name: "Kabir Mehta", email: "kabir.mehta@insightsrank.com", avatarInitials: "KM" },
    action: "AI Review Auto-Response Rule Saved",
    category: "Review Operations",
    target: "Rule #5 Star Auto Response",
    ipAddress: "115.240.18.5",
    region: "Ahmedabad, IN",
    status: "success",
    metadata: { ruleId: "rule_star5", sentiment: "positive" },
  },
  {
    id: "log_107",
    timestamp: "24 Sep 2026, 03:10 PM",
    actor: { name: "Meera Nair", email: "meera.nair@insightsrank.com", avatarInitials: "MN" },
    action: "User Access Suspended",
    category: "User Management",
    target: "karan.singh@insightsrank.com",
    ipAddress: "49.37.12.98",
    region: "Mumbai, IN",
    status: "warning",
    metadata: { previousStatus: "active", reason: "Administrative security review" },
  },
  {
    id: "log_108",
    timestamp: "24 Sep 2026, 12:00 PM",
    actor: { name: "System Operations", email: "system@insightsrank.com", avatarInitials: "SO" },
    action: "Scheduled API Health Check",
    category: "Integration Sync",
    target: "Google Business Profile API",
    ipAddress: "127.0.0.1",
    region: "System Worker",
    status: "success",
    metadata: { latencyP95Ms: 142, uptimePct: 99.98 },
  },
];

export function OrganizationAuditLogsTab() {
  const [logs] = useState<AuditLogItem[]>(AUDIT_LOG_ITEMS);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal State for Viewing Log Details
  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchQuery =
        log.actor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.actor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ipAddress.includes(searchTerm);
      const matchCategory = categoryFilter === "all" || log.category === categoryFilter;

      return matchQuery && matchCategory;
    });
  }, [logs, searchTerm, categoryFilter]);

  // Pagination Math
  const totalItems = filteredLogs.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const paginatedLogs = useMemo(() => {
    return filteredLogs.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }, [filteredLogs, currentPage, pageSize]);

  // CSV Export Handler
  const handleExportAuditLogs = () => {
    const header = "ID,Timestamp,Actor Name,Actor Email,Action,Category,Target,IP Address,Region,Status\n";
    const body = filteredLogs
      .map(
        (l) =>
          `"${l.id}","${l.timestamp}","${l.actor.name}","${l.actor.email}","${l.action}","${l.category}","${l.target}","${l.ipAddress}","${l.region}","${l.status}"`
      )
      .join("\n");

    const csvContent = "data:text/csv;charset=utf-8," + header + body;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `organization_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Audit Log exported to CSV!");
  };

  const getCategoryBadge = (category: AuditLogItem["category"]) => {
    switch (category) {
      case "User Management":
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30"><UserPlus className="size-3" /> User Mgmt</span>;
      case "Integration Sync":
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/15 text-sky-400 border border-sky-500/30"><RefreshCw className="size-3" /> Sync</span>;
      case "Review Operations":
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30"><FileText className="size-3" /> Reviews</span>;
      case "Bulk Operations":
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"><CheckCircle2 className="size-3" /> Bulk</span>;
      case "Security":
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30"><ShieldCheck className="size-3" /> Security</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#18181b] text-muted-foreground border border-[#27272a]">{category}</span>;
    }
  };

  return (
    <div className="space-y-6 text-foreground">
      {/* Header matching Rankings Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <span>Audit Trail &amp; Governance Logs</span>
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Review immutable user, sync, and security policy activity across the organization.
          </p>
        </div>

        <div>
          <Button
            onClick={handleExportAuditLogs}
            className="h-8 bg-blue-500 hover:bg-blue-600 text-black font-bold text-xs px-4 cursor-pointer gap-1.5 rounded-md shadow-sm transition-colors"
          >
            <Download className="size-3.5" />
            <span>Export Audit Log</span>
          </Button>
        </div>
      </div>

      {/* Control Bar: Search & Category Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search audit logs by actor, action, target, or IP address..."
            className="w-full pl-9 pr-4 h-8 rounded-md border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Category Filter */}
          <Select
            value={categoryFilter}
            onValueChange={(val) => {
              setCategoryFilter(val);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-8 w-44 bg-background border-border text-xs cursor-pointer">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border text-popover-foreground text-xs">
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="User Management">User Management</SelectItem>
              <SelectItem value="Integration Sync">Integration Sync</SelectItem>
              <SelectItem value="Review Operations">Review Operations</SelectItem>
              <SelectItem value="Bulk Operations">Bulk Operations</SelectItem>
              <SelectItem value="Security">Security</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="panel p-0 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/30 text-muted-foreground font-semibold select-none">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-4">Action &amp; Target</th>
                <th className="py-3 px-4">IP &amp; Location</th>
                <th className="py-3 px-3 text-center w-20">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-foreground">
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-muted-foreground">
                    No audit log entries match your search criteria.
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                      {log.timestamp}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="size-7 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 font-bold flex items-center justify-center text-[10px] shrink-0">
                          {log.actor.avatarInitials}
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{log.actor.name}</p>
                          <p className="text-[10px] text-muted-foreground font-mono">{log.actor.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">{getCategoryBadge(log.category)}</td>

                    <td className="py-3 px-4">
                      <p className="font-bold text-foreground">{log.action}</p>
                      <p className="text-[11px] text-muted-foreground truncate max-w-xs">{log.target}</p>
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                      <p className="text-foreground font-semibold">{log.ipAddress}</p>
                      <p className="text-[10px] text-muted-foreground">{log.region}</p>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedLog(log)}
                        className="h-7 px-2.5 text-[11px] border-border bg-background hover:bg-secondary text-blue-500 font-semibold cursor-pointer gap-1"
                      >
                        <Eye className="size-3" />
                        <span>View</span>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Standardized Pagination Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-t border-border text-xs bg-card dark:bg-[#121214]">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-[11px]">Rows per page:</span>
            <Select
              value={String(pageSize)}
              onValueChange={(val) => {
                setPageSize(Number(val));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-7 w-16 bg-background border-border text-foreground text-xs cursor-pointer">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border text-popover-foreground text-xs">
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-muted-foreground text-[11px] ml-2">
              Showing <span className="font-semibold text-foreground">{startItem}</span> -{" "}
              <span className="font-semibold text-foreground">{endItem}</span> of{" "}
              <span className="font-semibold text-foreground">{totalItems}</span> items
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-7 w-7 p-0 border-border text-foreground hover:bg-secondary disabled:opacity-40"
            >
              <ChevronLeft className="size-3.5" />
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                onClick={() => setCurrentPage(pg)}
                className={`h-7 min-w-[28px] px-1.5 rounded text-xs font-semibold cursor-pointer transition-colors ${
                  currentPage === pg
                    ? "bg-blue-500 text-black font-bold"
                    : "bg-background text-muted-foreground hover:text-foreground border border-border hover:bg-secondary"
                }`}
              >
                {pg}
              </button>
            ))}

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="h-7 w-7 p-0 border-border text-foreground hover:bg-secondary disabled:opacity-40"
            >
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Modal: View Audit Log Details */}
      <Dialog open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
        <DialogContent className="sm:max-w-lg bg-card dark:bg-[#121214] border-border text-foreground shadow-2xl rounded-xl">
          <DialogHeader className="border-b border-border pb-3">
            <DialogTitle className="text-sm font-bold text-blue-500 flex items-center gap-2">
              <ScrollText className="size-4" />
              <span>Audit Log Event Details</span>
            </DialogTitle>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-4 py-2 text-xs">
              <div className="grid grid-cols-2 gap-4 rounded-lg bg-secondary/50 p-3 border border-border">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">Event ID</p>
                  <p className="font-mono font-bold text-foreground mt-0.5">{selectedLog.id}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">Timestamp</p>
                  <p className="font-mono font-bold text-foreground mt-0.5">{selectedLog.timestamp}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">Actor</p>
                  <p className="font-bold text-foreground mt-0.5">{selectedLog.actor.name}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">{selectedLog.actor.email}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">Origin IP</p>
                  <p className="font-mono font-bold text-foreground mt-0.5">{selectedLog.ipAddress}</p>
                  <p className="text-[10px] text-muted-foreground">{selectedLog.region}</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-[11px] font-bold text-blue-500 uppercase tracking-wider">
                  Event Action &amp; Target
                </p>
                <div className="p-3 rounded-lg bg-secondary/50 border border-border space-y-1">
                  <p className="font-bold text-foreground">{selectedLog.action}</p>
                  <p className="text-muted-foreground">{selectedLog.target}</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-[11px] font-bold text-blue-500 uppercase tracking-wider flex items-center gap-1">
                  <Code className="size-3" />
                  <span>Payload Metadata (JSON)</span>
                </p>
                <pre className="p-3 rounded-lg bg-secondary/50 border border-border text-[11px] font-mono text-emerald-500 dark:text-emerald-400 overflow-x-auto">
                  {JSON.stringify(selectedLog.metadata, null, 2)}
                </pre>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedLog(null)}
                  className="h-8 border-border bg-background text-foreground hover:bg-secondary cursor-pointer"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
