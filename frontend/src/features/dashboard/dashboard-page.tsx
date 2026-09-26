import { useMemo, useState } from "react";
import { Activity, Building2, MapPin, MessageSquare, ShieldCheck, Star, TrendingUp } from "lucide-react";
import { useAnalytics } from "@/hooks/use-analytics";
import { useLocationHealthSummary, useLocations } from "@/hooks/use-locations";
import { useRankMovements, useRankingOverview } from "@/hooks/use-rankings";
import { useReviewInsights } from "@/hooks/use-reviews";
import { compactNumber, fullNumber } from "@/lib/format";
import { Page, PageHeader, Freshness } from "@/components/layout/page";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { AnalyticsChart } from "@/components/charts/analytics-chart";
import { MetricSkeletons, PanelSkeleton, ErrorState } from "@/components/feedback/states";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { ReputationInsights } from "@/components/dashboard/reputation-insights";
import { KeyMetrics } from "@/components/dashboard/key-metrics";
import { PerformanceSections } from "@/components/dashboard/performance-sections";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { evaluateDateRange, type RangePreset } from "@/lib/date-range";

export function DashboardPage() {
  const [dateRange, setDateRange] = useState("01 Apr 2026 - 17 Sep 2026");
  const [preset, setPreset] = useState<RangePreset>("30d");

  const analytics = useAnalytics({ preset });
  const health = useLocationHealthSummary();
  const reviews = useReviewInsights();
  const ranking = useRankingOverview();
  const movements = useRankMovements();
  const locations = useLocations({ page: 1, pageSize: 5, sortBy: "health.score", sortDir: "asc" });

  const handlePresetChange = (newPreset: RangePreset) => {
    setPreset(newPreset);
    if (newPreset === "7d") setDateRange("Last 7 Days");
    else if (newPreset === "30d") setDateRange("Last 30 Days");
    else if (newPreset === "90d") setDateRange("Last 3 Months");
  };

  const handleDateRangeChange = (newRange: string) => {
    setDateRange(newRange);
    if (newRange === "Last 7 Days" || newRange === "7d" || newRange === "Last Week") {
      setPreset("7d");
    } else if (newRange === "Last 30 Days" || newRange === "30d" || newRange === "Last Month") {
      setPreset("30d");
    } else if (newRange === "Last 3 Months" || newRange === "90d" || newRange === "Last 2 Months" || newRange === "60d") {
      setPreset("90d");
    }
  };

  const isPresetSelected =
    dateRange === "Last 7 Days" ||
    dateRange === "Last 30 Days" ||
    dateRange === "Last 3 Months" ||
    dateRange === "7d" ||
    dateRange === "30d" ||
    dateRange === "90d";

  const { multiplier: dateMultiplier } = useMemo(() => {
    if (preset === "7d") return { multiplier: 7 / 170 };
    if (preset === "30d") return { multiplier: 30 / 170 };
    if (preset === "90d") return { multiplier: 90 / 170 };
    return evaluateDateRange(dateRange);
  }, [dateRange, preset]);

  const scaledChartSeries = useMemo(() => {
    const rawSeries = analytics.data?.series ?? [];
    if (isPresetSelected) {
      return rawSeries;
    }
    return rawSeries.map((s) => ({
      ...s,
      impressions: Math.round(s.impressions * dateMultiplier),
      clicks: Math.round(s.clicks * dateMultiplier),
      calls: Math.round(s.calls * dateMultiplier),
      directions: Math.round(s.directions * dateMultiplier),
    }));
  }, [analytics.data?.series, dateMultiplier, isPresetSelected]);

  const scaledTotals = useMemo(() => {
    const raw = analytics.data?.totals;
    if (isPresetSelected && raw) {
      return {
        totalImpressions: raw.totalImpressions,
        websiteClicks: raw.websiteClicks,
        phoneCalls: raw.phoneCalls,
        directionRequests: raw.directionRequests,
      };
    }
    return {
      totalImpressions: Math.round((raw?.totalImpressions ?? 125000) * dateMultiplier),
      websiteClicks: Math.round((raw?.websiteClicks ?? 18400) * dateMultiplier),
      phoneCalls: Math.round((raw?.phoneCalls ?? 9200) * dateMultiplier),
      directionRequests: Math.round((raw?.directionRequests ?? 31000) * dateMultiplier),
    };
  }, [analytics.data?.totals, dateMultiplier, isPresetSelected]);

  const totalReviewsCount = Math.round((reviews.data?.total ?? 3264) * dateMultiplier);

  const loading = analytics.isLoading || health.isLoading || reviews.isLoading || ranking.isLoading;
  const failed = analytics.error || health.error || reviews.error || ranking.error;
  if (failed) return <Page><ErrorState message={failed.message} retry={() => { analytics.refetch(); health.refetch(); reviews.refetch(); ranking.refetch(); }} /></Page>;

  return <Page>
    <div className="rounded-2xl bg-card dark:bg-[#141416] p-6 sm:p-8 space-y-6 shadow-xl border border-border">
      <PageHeader title="Executive overview" description="Portfolio health, visibility and reputation across every connected location." actions={<><DateRangePicker value={dateRange} onChange={handleDateRangeChange} /><Freshness onRefresh={() => { analytics.refetch(); health.refetch(); reviews.refetch(); ranking.refetch(); }} /></>} />
      {loading && !health.data ? <MetricSkeletons /> : <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-6">
        <KpiCard label="Total locations" value={compactNumber(health.data?.total ?? 0)} change={3.2} icon={Building2} />
        <KpiCard label="Healthy locations" value={compactNumber(health.data?.healthy ?? 0)} change={5.8} icon={ShieldCheck} tone="success" />
        <KpiCard label="Needs attention" value={compactNumber((health.data?.needsAttention ?? 0) + (health.data?.critical ?? 0))} change={-8.4} icon={Activity} tone="warning" />
        <KpiCard label="Total reviews" value={compactNumber(totalReviewsCount)} change={12.6} icon={MessageSquare} />
        <KpiCard label="Average rating" value={(reviews.data?.averageRating ?? 4.6).toFixed(1)} change={1.4} icon={Star} tone="success" />
        <KpiCard label="Average ranking" value={(ranking.data?.averageRank ?? 8.4).toFixed(1)} change={7.3} icon={TrendingUp} tone="success" hint="Lower ranking position is better." />
      </div>}
      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.8fr)]">
        <section className="panel min-w-0 p-4 sm:p-5">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold">Performance overview</h2>
              <p className="mt-1 text-xs text-muted-foreground">Search and Maps discovery across the portfolio</p>
            </div>
            <Tabs value={preset} onValueChange={(val) => handlePresetChange(val as RangePreset)}>
              <TabsList className="h-8">
                <TabsTrigger value="7d">7D</TabsTrigger>
                <TabsTrigger value="30d">30D</TabsTrigger>
                <TabsTrigger value="90d">90D</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          {analytics.isLoading && !analytics.data ? <PanelSkeleton className="h-72" /> : <AnalyticsChart data={scaledChartSeries} />}
          <div className="mt-2 grid grid-cols-2 gap-3 border-t border-border pt-4 sm:grid-cols-4">
            <Mini label="Total impressions" value={compactNumber(scaledTotals.totalImpressions)} />
            <Mini label="Website clicks" value={compactNumber(scaledTotals.websiteClicks)} />
            <Mini label="Phone calls" value={compactNumber(scaledTotals.phoneCalls)} />
            <Mini label="Directions" value={compactNumber(scaledTotals.directionRequests)} />
          </div>
        </section>
        <section className="panel p-4 sm:p-5"><h2 className="text-sm font-semibold">Location health</h2><p className="mt-1 text-xs text-muted-foreground">Portfolio readiness and connection status</p><div className="my-6 flex items-center justify-between"><div><p className="tnum text-4xl font-semibold">{health.data ? Math.round(health.data.healthy / health.data.total * 100) : 0}%</p><p className="text-xs text-muted-foreground">healthy portfolio</p></div><ShieldCheck className="size-12 text-success" /></div><div className="space-y-3"><HealthRow label="Healthy" value={health.data?.healthy ?? 0} total={health.data?.total ?? 1} tone="bg-success" /><HealthRow label="Needs attention" value={health.data?.needsAttention ?? 0} total={health.data?.total ?? 1} tone="bg-warning" /><HealthRow label="Critical" value={health.data?.critical ?? 0} total={health.data?.total ?? 1} tone="bg-destructive" /><HealthRow label="Disconnected" value={health.data?.disconnected ?? 0} total={health.data?.total ?? 1} tone="bg-muted-foreground" /></div></section>
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <section className="panel overflow-hidden"><div className="border-b border-border p-4"><h2 className="text-sm font-semibold">Priority locations</h2><p className="mt-1 text-xs text-muted-foreground">Profiles with the highest operational risk</p></div><div className="divide-y divide-border">{(locations.data?.data ?? []).map((loc) => <div key={loc.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3"><div className="flex min-w-0 items-center gap-3"><span className="grid size-8 shrink-0 place-items-center rounded-md bg-destructive-muted text-destructive"><MapPin className="size-4" /></span><div className="min-w-0"><p className="truncate text-xs font-medium">{loc.name}</p><p className="truncate text-[11px] text-muted-foreground">{loc.city} · {loc.primaryCategory}</p></div></div><div className="text-right"><Badge variant="outline">{loc.health.score}/100</Badge><p className="mt-1 text-[10px] text-muted-foreground">{loc.health.issues.length} issues</p></div></div>)}</div></section>
        <section className="panel overflow-hidden"><div className="border-b border-border p-4"><h2 className="text-sm font-semibold">Ranking movement</h2><p className="mt-1 text-xs text-muted-foreground">Largest changes in local search visibility</p></div><div className="divide-y divide-border">{[...(movements.data?.improved ?? []).slice(0,3), ...(movements.data?.declined ?? []).slice(0,2)].map((item) => <div key={`${item.locationId}-${item.primaryKeyword}`} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3"><div className="min-w-0"><p className="truncate text-xs font-medium">{item.locationName}</p><p className="truncate text-[11px] text-muted-foreground">{item.primaryKeyword}</p></div><div className="flex items-center gap-2"><span className="tnum text-xs text-muted-foreground">{item.previousRank}</span><span>→</span><Badge className={item.change > 0 ? "border-success/30 bg-success-muted text-success" : "border-destructive/30 bg-destructive-muted text-destructive"} variant="outline">{item.currentRank}</Badge></div></div>)}</div></section>
      </div>

      {/* Reputation Insights, Key Metrics, and Performance Sections */}
      <div className="mt-8 space-y-8">
        <ReputationInsights insights={reviews.data} multiplier={dateMultiplier} />
        <KeyMetrics insights={reviews.data} multiplier={dateMultiplier} />
        <PerformanceSections multiplier={dateMultiplier} />
      </div>
    </div>
  </Page>;
}
function Mini({ label, value }: { label: string; value: string }) { return <div><p className="text-[10px] uppercase text-muted-foreground">{label}</p><p className="tnum mt-1 text-base font-semibold">{value}</p></div> }
function HealthRow({ label, value, total, tone }: { label:string; value:number; total:number; tone:string }) { const pct = Math.round(value / total * 100); return <div><div className="mb-1 flex items-center justify-between text-xs"><span>{label}</span><span className="tnum text-muted-foreground">{fullNumber(value)} · {pct}%</span></div><div className="h-1.5 overflow-hidden rounded-full bg-secondary"><div className={`h-full ${tone}`} style={{ width: `${pct}%` }} /></div></div> }
