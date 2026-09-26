import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BarChart3,
  LineChart as LineChartIcon,
  Map,
  Search,
  TrendingUp,
  Zap,
} from "lucide-react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { compactNumber } from "@/lib/format";

export function PerformanceSections({ multiplier = 1.0 }: { multiplier?: number }) {
  const [stateImpressionTab, setStateImpressionTab] = useState<"desktop" | "mobile">(
    "desktop"
  );

  // Row 1: Donut KPI Data matching screenshot 2 colors & proportions
  const totalImpressionsData = [
    { name: "Desktop Impressions", value: Math.round(38500 * multiplier), color: "#60a5fa" },
    { name: "Mobile Impressions", value: Math.round(345000 * multiplier), color: "#4ade80" },
  ];

  const searchImpressionsData = [
    { name: "Desktop Search", value: Math.round(140000 * multiplier), color: "#4ade80" },
    { name: "Mobile Search", value: Math.round(122600 * multiplier), color: "#facc15" },
  ];

  const mapImpressionsData = [
    { name: "Desktop Maps", value: Math.round(45000 * multiplier), color: "#a3e635" },
    { name: "Mobile Maps", value: Math.round(75900 * multiplier), color: "#f87171" },
  ];

  // Total sums formatted
  const totalImpSumStr = compactNumber(Math.round(383500 * multiplier));
  const searchImpSumStr = compactNumber(Math.round(262600 * multiplier));
  const mapImpSumStr = compactNumber(Math.round(120900 * multiplier));

  // Row 2: Line Trend Charts Data
  const rawPerformanceTrendData = [
    {
      date: "Apr 2026",
      desktopSearch: 25000,
      mobileSearch: 240000,
      desktopMaps: 10000,
      mobileMaps: 118000,
    },
    {
      date: "May 2026",
      desktopSearch: 2000,
      mobileSearch: 5000,
      desktopMaps: 1000,
      mobileMaps: 3000,
    },
    {
      date: "Jun 2026",
      desktopSearch: 1800,
      mobileSearch: 4200,
      desktopMaps: 900,
      mobileMaps: 2500,
    },
    {
      date: "Jul 2026",
      desktopSearch: 2100,
      mobileSearch: 4800,
      desktopMaps: 1100,
      mobileMaps: 2800,
    },
    {
      date: "Aug 2026",
      desktopSearch: 2400,
      mobileSearch: 5300,
      desktopMaps: 1200,
      mobileMaps: 3100,
    },
    {
      date: "Sep 2026",
      desktopSearch: 2700,
      mobileSearch: 5900,
      desktopMaps: 1300,
      mobileMaps: 3400,
    },
  ];

  const performanceTrendData = rawPerformanceTrendData.map((d) => ({
    ...d,
    desktopSearch: Math.round(d.desktopSearch * multiplier),
    mobileSearch: Math.round(d.mobileSearch * multiplier),
    desktopMaps: Math.round(d.desktopMaps * multiplier),
    mobileMaps: Math.round(d.mobileMaps * multiplier),
  }));

  const rawActionTrendData = [
    {
      date: "Apr 2026",
      callClicks: 2700,
      websiteClicks: 800,
      directionRequests: 18600,
    },
    {
      date: "May 2026",
      callClicks: 400,
      websiteClicks: 200,
      directionRequests: 1200,
    },
    {
      date: "Jun 2026",
      callClicks: 350,
      websiteClicks: 180,
      directionRequests: 1000,
    },
    {
      date: "Jul 2026",
      callClicks: 380,
      websiteClicks: 190,
      directionRequests: 1100,
    },
    {
      date: "Aug 2026",
      callClicks: 420,
      websiteClicks: 210,
      directionRequests: 1250,
    },
    {
      date: "Sep 2026",
      callClicks: 450,
      websiteClicks: 230,
      directionRequests: 1350,
    },
  ];

  const actionTrendData = rawActionTrendData.map((d) => ({
    ...d,
    callClicks: Math.round(d.callClicks * multiplier),
    websiteClicks: Math.round(d.websiteClicks * multiplier),
    directionRequests: Math.round(d.directionRequests * multiplier),
  }));

  // Row 3: State Wise Impressions Data
  const desktopStateData = [
    { state: "Bihar", search: Math.round(820 * multiplier), maps: Math.round(280 * multiplier) },
    { state: "Chhattisgarh", search: Math.round(450 * multiplier), maps: Math.round(150 * multiplier) },
    { state: "Delhi", search: Math.round(3600 * multiplier), maps: Math.round(380 * multiplier) },
    { state: "Gujarat", search: Math.round(3580 * multiplier), maps: Math.round(760 * multiplier) },
    { state: "Haryana", search: Math.round(1380 * multiplier), maps: Math.round(210 * multiplier) },
    { state: "Jammu & Kashmir", search: Math.round(120 * multiplier), maps: Math.round(50 * multiplier) },
    { state: "Jharkhand", search: Math.round(240 * multiplier), maps: Math.round(90 * multiplier) },
    { state: "Karnataka", search: Math.round(1380 * multiplier), maps: Math.round(210 * multiplier) },
    { state: "Madhya Pradesh", search: Math.round(950 * multiplier), maps: Math.round(260 * multiplier) },
  ];

  const mobileStateData = [
    { state: "Bihar", search: Math.round(2100 * multiplier), maps: Math.round(850 * multiplier) },
    { state: "Chhattisgarh", search: Math.round(1200 * multiplier), maps: Math.round(420 * multiplier) },
    { state: "Delhi", search: Math.round(7800 * multiplier), maps: Math.round(2400 * multiplier) },
    { state: "Gujarat", search: Math.round(7200 * multiplier), maps: Math.round(2100 * multiplier) },
    { state: "Haryana", search: Math.round(3100 * multiplier), maps: Math.round(950 * multiplier) },
    { state: "Jammu & Kashmir", search: Math.round(450 * multiplier), maps: Math.round(180 * multiplier) },
    { state: "Jharkhand", search: Math.round(820 * multiplier), maps: Math.round(310 * multiplier) },
    { state: "Karnataka", search: Math.round(3400 * multiplier), maps: Math.round(1100 * multiplier) },
    { state: "Madhya Pradesh", search: Math.round(2600 * multiplier), maps: Math.round(890 * multiplier) },
  ];

  const currentStateData =
    stateImpressionTab === "desktop" ? desktopStateData : mobileStateData;

  return (
    <section className="space-y-4 pt-4 border-t border-border">
      {/* Main Section Header */}
      <div>
        <h2 className="text-base font-semibold text-foreground">Performance</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Monitor customer engagement and interactions with your business
        </p>
      </div>

      {/* ROW 1: 3 Donut KPI Cards */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Card 1: Total Impressions */}
        <div className="panel p-4 sm:p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center gap-2">
            <LineChartIcon className="size-4 text-blue-500" />
            <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
              Total Impressions
            </h3>
          </div>

          <div className="relative h-48 w-full grid place-items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={totalImpressionsData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={54}
                  outerRadius={72}
                  paddingAngle={5}
                  cornerRadius={6}
                  stroke="none"
                >
                  {totalImpressionsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#18181b",
                    border: "1px solid #3f3f46",
                    borderRadius: 6,
                    fontSize: 12,
                    color: "#f4f4f5",
                  }}
                  itemStyle={{ color: "#f4f4f5" }}
                  labelStyle={{ color: "#a1a1aa", fontWeight: 600 }}
                  formatter={(val: number) => compactNumber(val)}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-center">
              <span className="tnum text-2xl font-extrabold text-foreground tracking-tight leading-none">
                383.5k
              </span>
              <span className="text-[11px] font-medium text-muted-foreground leading-tight mt-1 max-w-[80px]">
                Total Impressions
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-5 text-xs pt-1 border-t border-border">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-[#60a5fa]" /> Desktop Impressions
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-[#4ade80]" /> Mobile Impressions
            </span>
          </div>
        </div>

        {/* Card 2: Search Impressions */}
        <div className="panel p-4 sm:p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center gap-2">
            <Search className="size-4 text-blue-500" />
            <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
              Search Impressions
            </h3>
          </div>

          <div className="relative h-48 w-full grid place-items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={searchImpressionsData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={54}
                  outerRadius={72}
                  paddingAngle={5}
                  cornerRadius={6}
                  stroke="none"
                >
                  {searchImpressionsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#18181b",
                    border: "1px solid #3f3f46",
                    borderRadius: 6,
                    fontSize: 12,
                    color: "#f4f4f5",
                  }}
                  itemStyle={{ color: "#f4f4f5" }}
                  labelStyle={{ color: "#a1a1aa", fontWeight: 600 }}
                  formatter={(val: number) => compactNumber(val)}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-center">
              <span className="tnum text-2xl font-extrabold text-foreground tracking-tight leading-none">
                262.6k
              </span>
              <span className="text-[11px] font-medium text-muted-foreground leading-tight mt-1 max-w-[80px]">
                Total Searches
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-5 text-xs pt-1 border-t border-border">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-[#4ade80]" /> Desktop Search
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-[#facc15]" /> Mobile Search
            </span>
          </div>
        </div>

        {/* Card 3: Map Impressions */}
        <div className="panel p-4 sm:p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center gap-2">
            <Map className="size-4 text-blue-500" />
            <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
              Map Impressions
            </h3>
          </div>

          <div className="relative h-48 w-full grid place-items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mapImpressionsData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={54}
                  outerRadius={72}
                  paddingAngle={5}
                  cornerRadius={6}
                  stroke="none"
                >
                  {mapImpressionsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#18181b",
                    border: "1px solid #3f3f46",
                    borderRadius: 6,
                    fontSize: 12,
                    color: "#f4f4f5",
                  }}
                  itemStyle={{ color: "#f4f4f5" }}
                  labelStyle={{ color: "#a1a1aa", fontWeight: 600 }}
                  formatter={(val: number) => compactNumber(val)}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-center">
              <span className="tnum text-2xl font-extrabold text-foreground tracking-tight leading-none">
                120.9k
              </span>
              <span className="text-[11px] font-medium text-muted-foreground leading-tight mt-1 max-w-[80px]">
                Total Maps
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-5 text-xs pt-1 border-t border-border">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-[#a3e635]" /> Desktop Maps
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-[#f87171]" /> Mobile Maps
            </span>
          </div>
        </div>
      </div>

      {/* ROW 2: 2 Line Trend Charts (Performance & Action) */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Left Card: Performance */}
        <div className="panel p-4 sm:p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="size-4 text-blue-500" />
            <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
              Performance
            </h3>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={performanceTrendData}
                margin={{ top: 10, right: 15, left: -15, bottom: 0 }}
              >
                <CartesianGrid stroke="var(--border)" vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => (val >= 1000 ? `${val / 1000}k` : val)}
                />
                <Tooltip
                  contentStyle={{
                    background: "#18181b",
                    border: "1px solid #3f3f46",
                    borderRadius: 6,
                    fontSize: 12,
                    color: "#f4f4f5",
                  }}
                  itemStyle={{ color: "#f4f4f5" }}
                  labelStyle={{ color: "#a1a1aa", fontWeight: 600 }}
                  formatter={(val: number) => compactNumber(val)}
                />
                <Line
                  type="monotone"
                  dataKey="desktopSearch"
                  name="Desktop Search"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ fill: "#2563eb", r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="mobileSearch"
                  name="Mobile Search"
                  stroke="#facc15"
                  strokeWidth={2}
                  dot={{ fill: "#facc15", r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="desktopMaps"
                  name="Desktop Maps"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ fill: "#22c55e", r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="mobileMaps"
                  name="Mobile Maps"
                  stroke="#f87171"
                  strokeWidth={2}
                  dot={{ fill: "#f87171", r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs pt-1 border-t border-border">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-[#2563eb]" /> Desktop Search
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-[#facc15]" /> Mobile Search
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-[#22c55e]" /> Desktop Maps
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-[#f87171]" /> Mobile Maps
            </span>
          </div>
        </div>

        {/* Right Card: Action */}
        <div className="panel p-4 sm:p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="size-4 text-blue-500" />
            <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
              Action
            </h3>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={actionTrendData}
                margin={{ top: 10, right: 15, left: -15, bottom: 0 }}
              >
                <CartesianGrid stroke="var(--border)" vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => (val >= 1000 ? `${val / 1000}k` : val)}
                />
                <Tooltip
                  contentStyle={{
                    background: "#18181b",
                    border: "1px solid #3f3f46",
                    borderRadius: 6,
                    fontSize: 12,
                    color: "#f4f4f5",
                  }}
                  itemStyle={{ color: "#f4f4f5" }}
                  labelStyle={{ color: "#a1a1aa", fontWeight: 600 }}
                  formatter={(val: number) => compactNumber(val)}
                />
                <Line
                  type="monotone"
                  dataKey="callClicks"
                  name="Call Clicks"
                  stroke="#c084fc"
                  strokeWidth={2}
                  dot={{ fill: "#c084fc", r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="websiteClicks"
                  name="Website Clicks"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  dot={{ fill: "#38bdf8", r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="directionRequests"
                  name="Direction Requests"
                  stroke="#facc15"
                  strokeWidth={2}
                  dot={{ fill: "#facc15", r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs pt-1 border-t border-border">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-[#c084fc]" /> Call Clicks
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-[#38bdf8]" /> Website Clicks
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-[#facc15]" /> Direction Requests
            </span>
          </div>
        </div>
      </div>

      {/* ROW 3: State Wise Desktop/Mobile Impressions Bar Chart */}
      <div className="panel p-4 sm:p-5 flex flex-col justify-between space-y-4">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="size-4 text-blue-500" />
            <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
              State Wise {stateImpressionTab === "desktop" ? "Desktop" : "Mobile"} Impressions
            </h3>
          </div>

          <Tabs
            value={stateImpressionTab}
            onValueChange={(val) => setStateImpressionTab(val as "desktop" | "mobile")}
          >
            <TabsList className="h-7 p-0.5 bg-background border border-border">
              <TabsTrigger value="desktop" className="text-[11px] px-2.5 py-0.5">
                Desktop
              </TabsTrigger>
              <TabsTrigger value="mobile" className="text-[11px] px-2.5 py-0.5">
                Mobile
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={currentStateData}
              margin={{ top: 15, right: 15, left: -15, bottom: 5 }}
            >
              <CartesianGrid stroke="var(--border)" vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="state"
                tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                interval={0}
                angle={0}
                dy={6}
                textAnchor="middle"
              />
              <YAxis
                tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => (val >= 1000 ? `${val / 1000}k` : val)}
              />
              <Tooltip
                contentStyle={{
                  background: "#18181b",
                  border: "1px solid #3f3f46",
                  borderRadius: 6,
                  fontSize: 12,
                  color: "#f4f4f5",
                }}
                itemStyle={{ color: "#f4f4f5" }}
                labelStyle={{ color: "#a1a1aa", fontWeight: 600 }}
                formatter={(val: number) => compactNumber(val)}
              />
              <Bar
                dataKey="search"
                name="Search Impressions"
                fill="#2563eb"
                radius={[3, 3, 0, 0]}
              />
              <Bar
                dataKey="maps"
                name="Maps Impressions"
                fill="#84cc16"
                radius={[3, 3, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
