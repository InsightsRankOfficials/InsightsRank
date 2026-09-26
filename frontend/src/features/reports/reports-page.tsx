import React, { useState } from "react";
import { Page } from "@/components/layout/page";
import {
  FileBarChart,
  Calendar,
  Download,
  Mail,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  TrendingUp,
  FileText,
  Eye,
  Settings,
  X,
  Save,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { RankReportsTab } from "@/components/rankings/rank-reports-tab";
import { RankReportDetailView } from "@/components/rankings/rank-report-detail-view";
import { ReviewsReportsTab } from "@/components/reviews/reviews-reports-tab";
import { type RankReportStoreItem } from "@/data/rankings-analytics";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { evaluateDateRange } from "@/lib/date-range";

export type ReportsSubTab =
  | "executive"
  | "performance"
  | "ranking"
  | "review"
  | "scheduled";

const EXECUTIVE_REPORTS_LIST = [
  { id: "rep-1", name: "Monthly Executive Performance Summary", category: "Performance", format: "PDF", frequency: "Monthly", date: "15 Sep 2026", status: "Generated" },
  { id: "rep-2", name: "Weekly GBP Rank Tracker Digest", category: "Ranking", format: "CSV", frequency: "Weekly", date: "17 Sep 2026", status: "Generated" },
  { id: "rep-3", name: "Q3 Store Manager Review Velocity", category: "Review", format: "PDF", frequency: "Quarterly", date: "10 Sep 2026", status: "Generated" },
  { id: "rep-4", name: "Multi-Store Location Health Audit", category: "Health", format: "XLSX", frequency: "Bi-Weekly", date: "12 Sep 2026", status: "Generated" },
  { id: "rep-5", name: "Competitor Share of Search Report", category: "Ranking", format: "PDF", frequency: "Monthly", date: "01 Sep 2026", status: "Generated" },
];

const SCHEDULED_EXPORTS_LIST = [
  { id: "sch-1", name: "Weekly Executive Digest", type: "Executive Summary", recipients: "execs@demo.com", frequency: "Every Monday at 9:00 AM", status: true, lastSent: "15 Sep 2026" },
  { id: "sch-2", name: "Monthly Local Rank Breakdown", type: "Ranking Report", recipients: "seo-team@demo.com", frequency: "1st of every month", status: true, lastSent: "01 Sep 2026" },
  { id: "sch-3", name: "Store Manager Review Audit", type: "Review Report", recipients: "ops@demo.com", frequency: "Every Friday at 5:00 PM", status: true, lastSent: "12 Sep 2026" },
];

const REPORT_TREND_DATA = [
  { month: "Apr", reports: 85, downloads: 220 },
  { month: "May", reports: 110, downloads: 290 },
  { month: "Jun", reports: 140, downloads: 380 },
  { month: "Jul", reports: 195, downloads: 490 },
  { month: "Aug", reports: 230, downloads: 580 },
  { month: "Sep", reports: 285, downloads: 710 },
];

const AUDIT_LOGS_BASE = [
  { store: "Campus Store Jaipur 371", code: "demo-jaipur-371", imp: 48290, maps: 32150, dir: 12400, calls: 3890 },
  { store: "Campus Store Delhi 312", code: "demo-delhi-312", imp: 62400, maps: 41800, dir: 18200, calls: 5120 },
  { store: "Campus Store Mumbai 304", code: "demo-mumbai-304", imp: 55100, maps: 38900, dir: 14750, calls: 4300 },
  { store: "Campus Store Bangalore 42", code: "demo-blr-42", imp: 41800, maps: 29400, dir: 9800, calls: 2950 },
];

export function ReportsPage({ initialTab = "executive" }: { initialTab?: ReportsSubTab }) {
  const [activeTab, setActiveTab] = useState<ReportsSubTab>(initialTab);
  const [selectedRankStore, setSelectedRankStore] = useState<RankReportStoreItem | undefined>();
  const [dateRange, setDateRange] = useState("01 Apr 2026 - 17 Sep 2026");

  // Schedule Modal State
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [schedules, setSchedules] = useState(SCHEDULED_EXPORTS_LIST);
  const [newSchName, setNewSchName] = useState("");
  const [newSchEmail, setNewSchEmail] = useState("");
  const [newSchFreq, setNewSchFreq] = useState("Every Monday at 9:00 AM");

  const dateAnalysis = React.useMemo(() => evaluateDateRange(dateRange), [dateRange]);
  const { hasData, multiplier } = dateAnalysis;

  const kpiStats = React.useMemo(() => {
    if (!hasData) {
      return {
        reportsGenerated: "0",
        scheduledExports: "0 Active",
        exportVolume: "0 Downloads",
        systemHealth: "0%",
      };
    }
    return {
      reportsGenerated: Math.round(1428 * multiplier).toLocaleString(),
      scheduledExports: "12 Active",
      exportVolume: `${Math.round(710 * multiplier).toLocaleString()} Downloads`,
      systemHealth: "99.9%",
    };
  }, [hasData, multiplier]);

  const reportTrendData = React.useMemo(() => {
    if (!hasData) {
      return REPORT_TREND_DATA.map((d) => ({ ...d, reports: 0, downloads: 0 }));
    }
    return REPORT_TREND_DATA.map((d) => ({
      ...d,
      reports: Math.round(d.reports * multiplier),
      downloads: Math.round(d.downloads * multiplier),
    }));
  }, [hasData, multiplier]);

  const auditLogsData = React.useMemo(() => {
    if (!hasData) {
      return AUDIT_LOGS_BASE.map((s) => ({
        ...s,
        imp: "0",
        maps: "0",
        dir: "0",
        calls: "0",
      }));
    }
    return AUDIT_LOGS_BASE.map((s) => ({
      ...s,
      imp: Math.round(s.imp * multiplier).toLocaleString(),
      maps: Math.round(s.maps * multiplier).toLocaleString(),
      dir: Math.round(s.dir * multiplier).toLocaleString(),
      calls: Math.round(s.calls * multiplier).toLocaleString(),
    }));
  }, [hasData, multiplier]);

  const handleCreateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchName.trim() || !newSchEmail.trim()) return;

    setSchedules([
      {
        id: `sch-${Date.now()}`,
        name: newSchName,
        type: "Custom Scheduled Report",
        recipients: newSchEmail,
        frequency: newSchFreq,
        status: true,
        lastSent: "Just now",
      },
      ...schedules,
    ]);
    setNewSchName("");
    setNewSchEmail("");
    setScheduleModalOpen(false);
  };

  const toggleScheduleStatus = (id: string) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: !s.status } : s))
    );
  };

  return (
    <Page>
      {/* Top Sub-Nav Bar matching Rankings/Performance */}
      <div className="border-b border-border bg-background -mx-4 -mt-4 px-4 sm:-mx-6 sm:-mt-6 sm:px-6 mb-6">
        <nav className="flex items-center gap-6 overflow-x-auto no-scrollbar">
          <button
            onClick={() => {
              setSelectedRankStore(undefined);
              setActiveTab("executive");
            }}
            className={`py-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
              activeTab === "executive"
                ? "border-blue-500 text-blue-500 font-bold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Executive Summary
          </button>

          <button
            onClick={() => {
              setSelectedRankStore(undefined);
              setActiveTab("performance");
            }}
            className={`py-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
              activeTab === "performance"
                ? "border-blue-500 text-blue-500 font-bold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Performance Reports
          </button>

          <button
            onClick={() => setActiveTab("ranking")}
            className={`py-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
              activeTab === "ranking"
                ? "border-blue-500 text-blue-500 font-bold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Ranking Reports
          </button>

          <button
            onClick={() => {
              setSelectedRankStore(undefined);
              setActiveTab("review");
            }}
            className={`py-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
              activeTab === "review"
                ? "border-blue-500 text-blue-500 font-bold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Review Reports
          </button>

          <button
            onClick={() => {
              setSelectedRankStore(undefined);
              setActiveTab("scheduled");
            }}
            className={`py-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
              activeTab === "scheduled"
                ? "border-blue-500 text-blue-500 font-bold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Scheduled Exports
          </button>
        </nav>
      </div>

      {/* Render Selected Tab */}

      {/* 1. EXECUTIVE SUMMARY TAB */}
      {activeTab === "executive" && (
        <div className="rounded-2xl bg-card dark:bg-[#141416] p-6 sm:p-8 space-y-6 shadow-xl border border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">
                Executive Reporting Summary
              </h1>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Overview of generated report volumes, automated email dispatches, and download metrics.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <DateRangePicker value={dateRange} onChange={setDateRange} />
              <button
                type="button"
                onClick={() => setScheduleModalOpen(true)}
                className="px-4 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-black text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <Plus className="size-4" />
                Schedule Report
              </button>
            </div>
          </div>

          {/* 4 Metric Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
            <div className="rounded-xl border border-border bg-background p-4 flex flex-col justify-between h-full space-y-2 shadow-sm">
              <div className="flex items-center gap-1.5 text-blue-500">
                <FileBarChart className="size-3.5" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-500">
                  Reports Generated
                </span>
              </div>
              <div>
                <p className="tnum text-3xl font-extrabold tracking-tight text-foreground">{kpiStats.reportsGenerated}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{hasData ? "+24% vs last month" : "No data for range"}</p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-background p-4 flex flex-col justify-between h-full space-y-2 shadow-sm">
              <div className="flex items-center gap-1.5 text-blue-500">
                <Mail className="size-3.5" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-500">
                  Scheduled Exports
                </span>
              </div>
              <div>
                <p className="tnum text-3xl font-extrabold tracking-tight text-foreground">{kpiStats.scheduledExports}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Automated emails</p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-background p-4 flex flex-col justify-between h-full space-y-2 shadow-sm">
              <div className="flex items-center gap-1.5 text-blue-500">
                <Download className="size-3.5" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-500">
                  Export Volume
                </span>
              </div>
              <div>
                <p className="tnum text-3xl font-extrabold tracking-tight text-foreground">{kpiStats.exportVolume}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">CSV &amp; PDF formats</p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-background p-4 flex flex-col justify-between h-full space-y-2 shadow-sm">
              <div className="flex items-center gap-1.5 text-emerald-500">
                <CheckCircle2 className="size-3.5" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-500">
                  System Health
                </span>
              </div>
              <div>
                <p className="tnum text-3xl font-extrabold tracking-tight text-emerald-500">{kpiStats.systemHealth}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">All scheduled runs active</p>
              </div>
            </div>
          </div>

          {/* Chart Panel */}
          <div className="rounded-xl border border-border bg-background p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2">
              <FileBarChart className="size-4 text-blue-500" />
              <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
                Report Generation &amp; Download Trend
              </h3>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={reportTrendData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                  <CartesianGrid stroke="var(--border)" vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "var(--popover)", borderColor: "var(--border)", borderRadius: 8, fontSize: 12, color: "var(--popover-foreground)" }}
                  />
                  <Line type="monotone" dataKey="reports" name="Reports Generated" stroke="#facc15" strokeWidth={2} dot={{ fill: "#facc15", r: 4 }} />
                  <Line type="monotone" dataKey="downloads" name="Downloads" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Reports Table */}
          <div className="rounded-xl border border-border bg-background p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-blue-500" />
                <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
                  Recent Generated Reports
                </h3>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border bg-secondary/30 text-muted-foreground font-semibold">
                    <th className="py-3 px-4">Report Name</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Format</th>
                    <th className="py-3 px-3">Frequency</th>
                    <th className="py-3 px-4">Generated Date</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-foreground">
                  {EXECUTIVE_REPORTS_LIST.map((r) => (
                    <tr key={r.id} className="hover:bg-secondary/20 transition-colors">
                      <td className="py-3 px-4 font-bold text-foreground">{r.name}</td>
                      <td className="py-3 px-3 text-muted-foreground">{r.category}</td>
                      <td className="py-3 px-3 font-mono text-[11px] text-blue-500 font-semibold">{r.format}</td>
                      <td className="py-3 px-4 text-muted-foreground">{r.frequency}</td>
                      <td className="py-3 px-4 text-muted-foreground">{r.date}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          className="px-3 py-1 rounded-lg border border-blue-500/40 bg-blue-500/10 hover:bg-blue-500/20 text-xs font-bold text-blue-500 flex items-center gap-1 transition-colors ml-auto cursor-pointer"
                        >
                          <Download className="size-3" /> Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. PERFORMANCE REPORTS TAB */}
      {activeTab === "performance" && (
        <div className="rounded-2xl bg-card dark:bg-[#141416] p-6 sm:p-8 space-y-6 shadow-xl border border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">
                Store Performance Reports
              </h1>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Download store search impressions, customer actions, and phone calls report sets.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <DateRangePicker value={dateRange} onChange={setDateRange} />
              <button
                type="button"
                className="px-4 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-black text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <Download className="size-4" /> Export All
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-background p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-4 text-blue-500" />
              <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
                Location Performance Audit Logs
              </h3>
            </div>

            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border bg-secondary/30 text-muted-foreground font-semibold">
                    <th className="py-3 px-4">Store Location</th>
                    <th className="py-3 px-3 text-right">Search Impressions</th>
                    <th className="py-3 px-3 text-right">Maps Views</th>
                    <th className="py-3 px-3 text-right">Direction Requests</th>
                    <th className="py-3 px-3 text-right">Phone Calls</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-foreground">
                  {auditLogsData.map((s, idx) => (
                    <tr key={idx} className="hover:bg-secondary/20 transition-colors">
                      <td className="py-3 px-4 font-bold text-foreground">
                        {s.store}
                        <p className="text-[10px] text-muted-foreground font-mono">{s.code}</p>
                      </td>
                      <td className="py-3 px-3 text-right font-bold tnum">{s.imp}</td>
                      <td className="py-3 px-3 text-right font-bold tnum">{s.maps}</td>
                      <td className="py-3 px-3 text-right font-bold tnum text-blue-500">{s.dir}</td>
                      <td className="py-3 px-3 text-right font-bold tnum text-emerald-500">{s.calls}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          className="px-3 py-1 rounded-lg border border-border bg-background hover:bg-secondary text-xs font-semibold text-foreground transition-colors cursor-pointer"
                        >
                          Export CSV
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. RANKING REPORTS TAB */}
      {activeTab === "ranking" && (
        selectedRankStore ? (
          <RankReportDetailView
            initialStore={selectedRankStore}
            onBack={() => setSelectedRankStore(undefined)}
          />
        ) : (
          <RankReportsTab
            onSelectStore={(store) => setSelectedRankStore(store)}
            onConfigureReport={() => setActiveTab("scheduled")}
          />
        )
      )}

      {/* 4. REVIEW REPORTS TAB */}
      {activeTab === "review" && (
        <ReviewsReportsTab />
      )}

      {/* 5. SCHEDULED EXPORTS TAB */}
      {activeTab === "scheduled" && (
        <div className="rounded-2xl bg-card dark:bg-[#141416] p-6 sm:p-8 space-y-6 shadow-xl border border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">
                Scheduled Automated Email Exports
              </h1>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Set up recurring email dispatches to stakeholders, managers, and store owners.
              </p>
            </div>

            <div>
              <button
                type="button"
                onClick={() => setScheduleModalOpen(true)}
                className="px-4 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-black text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <Plus className="size-4" />
                Schedule New Report
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-background p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Mail className="size-4 text-blue-500" />
              <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
                Active Email Schedules
              </h3>
            </div>

            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border bg-secondary/30 text-muted-foreground font-semibold">
                    <th className="py-3 px-4">Schedule Name</th>
                    <th className="py-3 px-3">Report Type</th>
                    <th className="py-3 px-4">Recipient Email(s)</th>
                    <th className="py-3 px-4">Frequency</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-4">Last Sent</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-foreground">
                  {schedules.map((s) => (
                    <tr key={s.id} className="hover:bg-secondary/20 transition-colors">
                      <td className="py-3 px-4 font-bold text-foreground">{s.name}</td>
                      <td className="py-3 px-3 text-muted-foreground">{s.type}</td>
                      <td className="py-3 px-4 font-mono text-[11px] text-blue-500">{s.recipients}</td>
                      <td className="py-3 px-4 text-muted-foreground">{s.frequency}</td>
                      <td className="py-3 px-3">
                        <button
                          type="button"
                          onClick={() => toggleScheduleStatus(s.id)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                            s.status ? "bg-blue-500" : "bg-muted"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-background dark:bg-black shadow ring-0 transition duration-200 ease-in-out ${
                              s.status ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{s.lastSent}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSchedules((prev) => prev.filter((item) => item.id !== s.id))}
                          className="px-3 py-1 rounded-lg border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-xs font-bold text-rose-500 transition-colors cursor-pointer"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Schedule New Report Modal */}
      {scheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card dark:bg-[#121214] text-foreground p-6 shadow-2xl space-y-5 relative">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20">
                  <Mail className="size-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground">Schedule Automated Export</h3>
                  <p className="text-xs text-muted-foreground">Configure recurring email delivery parameters.</p>
                </div>
              </div>
              <button
                onClick={() => setScheduleModalOpen(false)}
                className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSchedule} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-foreground">Schedule Name <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  value={newSchName}
                  onChange={(e) => setNewSchName(e.target.value)}
                  placeholder="e.g. Weekly Executive Performance Digest"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs text-foreground focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-foreground">Recipient Email(s) <span className="text-rose-500">*</span></label>
                <input
                  type="email"
                  required
                  value={newSchEmail}
                  onChange={(e) => setNewSchEmail(e.target.value)}
                  placeholder="e.g. execs@demobrand.com"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs text-foreground focus:border-blue-500 focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-foreground">Delivery Frequency <span className="text-rose-500">*</span></label>
                <select
                  value={newSchFreq}
                  onChange={(e) => setNewSchFreq(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs text-foreground focus:border-blue-500 focus:outline-none cursor-pointer"
                >
                  <option value="Every Monday at 9:00 AM">Every Monday at 9:00 AM</option>
                  <option value="Every Friday at 5:00 PM">Every Friday at 5:00 PM</option>
                  <option value="1st of every month">1st of every month</option>
                  <option value="Daily at 8:00 AM">Daily at 8:00 AM</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setScheduleModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-border bg-background hover:bg-secondary font-semibold text-foreground cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 font-bold text-black flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Save className="size-4" /> Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Page>
  );
}
