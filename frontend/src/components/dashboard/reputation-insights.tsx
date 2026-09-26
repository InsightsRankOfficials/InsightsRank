import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BarChart3,
  Clock,
  Hourglass,
  MessageSquare,
  RotateCcw,
  Timer,
} from "lucide-react";

import type { ReviewInsights } from "@/types/review";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { compactNumber } from "@/lib/format";

interface ReputationInsightsProps {
  insights?: ReviewInsights;
  multiplier?: number;
}

export function ReputationInsights({ insights, multiplier = 1.0 }: ReputationInsightsProps) {
  const [timeUnit, setTimeUnit] = useState<"minutes" | "hours" | "days">("days");

  const rawTotal = insights?.total ?? 3264;
  const totalReviews = Math.round(rawTotal * multiplier);
  const unansweredCount = insights?.unanswered ?? 0;
  const responseRate = insights?.responseRatePct ?? 100;
  const avgResponseHours = insights?.averageResponseHours ?? 3.0;

  const rawOverTime = insights?.overTime ?? [
    { date: "Jan 2026", one: 8, two: 12, three: 25, four: 60, five: 130 },
    { date: "Feb 2026", one: 10, two: 15, three: 30, four: 68, five: 142 },
    { date: "Mar 2026", one: 7, two: 14, three: 28, four: 72, five: 155 },
    { date: "Apr 2026", one: 12, two: 18, three: 32, four: 78, five: 160 },
    { date: "May 2026", one: 15, two: 20, three: 35, four: 85, five: 170 },
  ];

  const overTimeData = rawOverTime.map((d) => ({
    ...d,
    one: Math.round(d.one * multiplier),
    two: Math.round(d.two * multiplier),
    three: Math.round(d.three * multiplier),
    four: Math.round(d.four * multiplier),
    five: Math.round(d.five * multiplier),
  }));

  const responseRateOverTime = insights?.responseRateOverTime ?? {
    days: [
      { date: "Jan 2026", avgTime: 0.15, count: 2400 },
      { date: "Feb 2026", avgTime: 0.14, count: 2650 },
      { date: "Mar 2026", avgTime: 0.13, count: 2900 },
      { date: "Apr 2026", avgTime: 0.125, count: 3300 },
      { date: "May 2026", avgTime: 0.125, count: 3264 },
    ],
    hours: [
      { date: "Jan 2026", avgTime: 3.6, count: 2400 },
      { date: "Feb 2026", avgTime: 3.4, count: 2650 },
      { date: "Mar 2026", avgTime: 3.2, count: 2900 },
      { date: "Apr 2026", avgTime: 3.0, count: 3300 },
      { date: "May 2026", avgTime: 3.0, count: 3264 },
    ],
    minutes: [
      { date: "Jan 2026", avgTime: 216, count: 2400 },
      { date: "Feb 2026", avgTime: 204, count: 2650 },
      { date: "Mar 2026", avgTime: 192, count: 2900 },
      { date: "Apr 2026", avgTime: 180, count: 3300 },
      { date: "May 2026", avgTime: 180, count: 3264 },
    ],
  };

  const rawResponseData = responseRateOverTime[timeUnit] || responseRateOverTime.days;
  const selectedResponseData = rawResponseData.map((d) => ({
    ...d,
    count: Math.round(d.count * multiplier),
  }));

  return (
    <section className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-base font-semibold text-foreground">Reputation Insights</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Analyze customer sentiment and review trends shaping your online reputation.
        </p>
      </div>

      {/* KPI Cards Row */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Reviews */}
        <div className="panel p-4 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-blue-500">
              <MessageSquare className="size-3.5" />
              <span className="text-[11px] font-medium uppercase tracking-wider text-blue-500">
                Total Reviews
              </span>
            </div>
            <p className="tnum mt-2 text-2xl font-bold tracking-normal text-foreground">
              {compactNumber(totalReviews)}
            </p>
          </div>
        </div>

        {/* Pending Responses */}
        <div className="panel p-4 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-blue-500">
              <Hourglass className="size-3.5" />
              <span className="text-[11px] font-medium uppercase tracking-wider text-blue-500">
                Pending Responses
              </span>
            </div>
            <p className="tnum mt-2 text-2xl font-bold tracking-normal text-foreground">
              {unansweredCount}
              <span className="text-muted-foreground font-normal text-lg">
                /{compactNumber(totalReviews)}
              </span>
            </p>
          </div>
          <Badge
            variant="outline"
            className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5"
          >
            ● None
          </Badge>
        </div>

        {/* Response Rate */}
        <div className="panel p-4 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-blue-500">
              <RotateCcw className="size-3.5" />
              <span className="text-[11px] font-medium uppercase tracking-wider text-blue-500">
                Response Rate
              </span>
            </div>
            <p className="tnum mt-2 text-2xl font-bold tracking-normal text-foreground">
              {responseRate}%
            </p>
          </div>
          <Badge
            variant="outline"
            className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5"
          >
            ● Very High
          </Badge>
        </div>

        {/* Average Response Time */}
        <div className="panel p-4 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-blue-500">
              <Timer className="size-3.5" />
              <span className="text-[11px] font-medium uppercase tracking-wider text-blue-500">
                Average Response Time
              </span>
            </div>
            <p className="tnum mt-2 text-2xl font-bold tracking-normal text-foreground">
              {avgResponseHours.toFixed(1)}{" "}
              <span className="text-muted-foreground font-normal text-sm">hour(s)</span>
            </p>
          </div>
          <Badge
            variant="outline"
            className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5"
          >
            ● Very Fast
          </Badge>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Left Chart: Review Over Time */}
        <div className="panel p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="size-4 text-blue-500" />
            <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
              Review Over Time
            </h3>
          </div>

          <div className="relative h-64 w-full">
            <p className="absolute -left-2 top-0 text-[10px] text-muted-foreground">
              No. of Reviews
            </p>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={overTimeData}
                margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
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
                />
                <Bar dataKey="one" name="1 Star" stackId="a" fill="#ef4444" radius={[0, 0, 0, 0]} />
                <Bar dataKey="two" name="2 Star" stackId="a" fill="#f97316" radius={[0, 0, 0, 0]} />
                <Bar dataKey="three" name="3 Star" stackId="a" fill="#eab308" radius={[0, 0, 0, 0]} />
                <Bar dataKey="four" name="4 Star" stackId="a" fill="#84cc16" radius={[0, 0, 0, 0]} />
                <Bar dataKey="five" name="5 Star" stackId="a" fill="#22c55e" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-[#ef4444]" /> 1 Star
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-[#f97316]" /> 2 Star
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-[#eab308]" /> 3 Star
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-[#84cc16]" /> 4 Star
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-[#22c55e]" /> 5 Star
            </span>
          </div>
        </div>

        {/* Right Chart: Average Response Rate */}
        <div className="panel p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-blue-500" />
              <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
                Average Response Rate
              </h3>
            </div>
            <Tabs
              value={timeUnit}
              onValueChange={(val) => setTimeUnit(val as "minutes" | "hours" | "days")}
            >
              <TabsList className="h-7 p-0.5 bg-background border border-border">
                <TabsTrigger value="minutes" className="text-[11px] px-2 py-0.5">
                  Minutes
                </TabsTrigger>
                <TabsTrigger value="hours" className="text-[11px] px-2 py-0.5">
                  Hours
                </TabsTrigger>
                <TabsTrigger value="days" className="text-[11px] px-2 py-0.5">
                  Days
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="relative h-64 w-full">
            <p className="absolute -left-2 top-0 text-[10px] text-muted-foreground">
              Avg Time ({timeUnit === "days" ? "Days" : timeUnit === "hours" ? "Hours" : "Minutes"})
            </p>
            <p className="absolute -right-2 top-0 text-[10px] text-muted-foreground">
              Response Count
            </p>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={selectedResponseData}
                margin={{ top: 25, right: 25, left: -20, bottom: 0 }}
              >
                <CartesianGrid stroke="var(--border)" vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => `${val} ${timeUnit === "days" ? "Day" : ""}`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => compactNumber(val)}
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
                />
                <Bar
                  yAxisId="right"
                  dataKey="count"
                  name="Response Count"
                  fill="#eab308"
                  barSize={20}
                  radius={[2, 2, 0, 0]}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="avgTime"
                  name="Avg Response Time"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ fill: "#22c55e", r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center justify-center gap-6 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-[#22c55e]" /> Avg Response Time
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-[#eab308]" /> Response Count
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
