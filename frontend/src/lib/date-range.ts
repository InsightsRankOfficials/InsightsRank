/** Global date-range system shared by every analytics surface. */

export interface DateRangeAnalysis {
  hasData: boolean;
  multiplier: number;
  days: number;
  startDate: Date | null;
  endDate: Date | null;
  label: string;
}

const MOCK_DATA_START = new Date(2026, 3, 1); // 01 Apr 2026
const MOCK_DATA_END = new Date(2026, 8, 30);   // 30 Sep 2026
const BASELINE_DAYS = 170;

export function evaluateDateRange(dateRangeString?: string): DateRangeAnalysis {
  if (!dateRangeString || !dateRangeString.trim()) {
    return {
      hasData: true,
      multiplier: 1.0,
      days: BASELINE_DAYS,
      startDate: new Date(2026, 3, 1),
      endDate: new Date(2026, 8, 17),
      label: "01 Apr 2026 - 17 Sep 2026",
    };
  }

  const rangeStr = dateRangeString.trim();

  // Handle presets
  if (rangeStr === "Last 7 Days" || rangeStr === "Last Week" || rangeStr === "7d") {
    return {
      hasData: true,
      multiplier: 7 / BASELINE_DAYS,
      days: 7,
      startDate: new Date(2026, 8, 10),
      endDate: new Date(2026, 8, 17),
      label: "Last 7 Days",
    };
  }
  if (rangeStr === "Last 30 Days" || rangeStr === "Last Month" || rangeStr === "30d") {
    return {
      hasData: true,
      multiplier: 30 / BASELINE_DAYS,
      days: 30,
      startDate: new Date(2026, 7, 18),
      endDate: new Date(2026, 8, 17),
      label: "Last 30 Days",
    };
  }
  if (rangeStr === "Last 2 Months" || rangeStr === "Last 60 Days" || rangeStr === "60d" || rangeStr === "6m") {
    return {
      hasData: true,
      multiplier: 60 / BASELINE_DAYS,
      days: 60,
      startDate: new Date(2026, 6, 18),
      endDate: new Date(2026, 8, 17),
      label: "Last 2 Months",
    };
  }
  if (rangeStr === "Last 3 Months" || rangeStr === "Last 90 Days" || rangeStr === "90d" || rangeStr === "12m") {
    return {
      hasData: true,
      multiplier: 90 / BASELINE_DAYS,
      days: 90,
      startDate: new Date(2026, 5, 18),
      endDate: new Date(2026, 8, 17),
      label: "Last 3 Months",
    };
  }
  if (rangeStr === "Today") {
    return {
      hasData: true,
      multiplier: 1 / BASELINE_DAYS,
      days: 1,
      startDate: new Date(2026, 8, 17),
      endDate: new Date(2026, 8, 17),
      label: "Today",
    };
  }
  if (rangeStr === "Yesterday") {
    return {
      hasData: true,
      multiplier: 1 / BASELINE_DAYS,
      days: 1,
      startDate: new Date(2026, 8, 16),
      endDate: new Date(2026, 8, 16),
      label: "Yesterday",
    };
  }

  // Handle custom date range string e.g., "01 Apr 2026 - 17 Sep 2026"
  const parts = rangeStr.split(" - ");
  if (parts.length === 2) {
    const d1 = new Date(parts[0]);
    const d2 = new Date(parts[1]);

    if (!isNaN(d1.getTime()) && !isNaN(d2.getTime())) {
      if (d1 > d2) {
        return {
          hasData: false,
          multiplier: 0,
          days: 0,
          startDate: d1,
          endDate: d2,
          label: rangeStr,
        };
      }

      const totalDays = Math.max(1, Math.round(Math.abs(d2.getTime() - d1.getTime()) / 86400000) + 1);

      // Check overlap with mock data period [01 Apr 2026, 30 Sep 2026]
      const overlapStart = Math.max(d1.getTime(), MOCK_DATA_START.getTime());
      const overlapEnd = Math.min(d2.getTime(), MOCK_DATA_END.getTime());

      if (overlapStart > overlapEnd) {
        // Out of available data bounds -> Data is 0
        return {
          hasData: false,
          multiplier: 0,
          days: totalDays,
          startDate: d1,
          endDate: d2,
          label: rangeStr,
        };
      }

      const overlapDays = Math.max(1, Math.round((overlapEnd - overlapStart) / 86400000) + 1);
      const mult = overlapDays / BASELINE_DAYS;

      return {
        hasData: true,
        multiplier: mult,
        days: totalDays,
        startDate: d1,
        endDate: d2,
        label: rangeStr,
      };
    }
  }

  return {
    hasData: true,
    multiplier: 1.0,
    days: BASELINE_DAYS,
    startDate: new Date(2026, 3, 1),
    endDate: new Date(2026, 8, 17),
    label: rangeStr,
  };
}

export const RANGE_PRESETS: { value: RangePreset; label: string; days: number }[] = [
  { value: "today", label: "Today", days: 1 },
  { value: "yesterday", label: "Yesterday", days: 1 },
  { value: "7d", label: "Last 7 days", days: 7 },
  { value: "30d", label: "Last 30 days", days: 30 },
  { value: "90d", label: "Last 90 days", days: 90 },
  { value: "6m", label: "Last 6 months", days: 182 },
  { value: "12m", label: "Last 12 months", days: 365 },
];

export function presetLabel(preset: RangePreset): string {
  return RANGE_PRESETS.find((p) => p.value === preset)?.label ?? "Custom range";
}

export function presetDays(preset: RangePreset): number {
  return RANGE_PRESETS.find((p) => p.value === preset)?.days ?? 30;
}

export function resolveRange(preset: RangePreset, from?: string, to?: string): ResolvedRange {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (preset === "custom" && from && to) {
    const f = new Date(from);
    const t = new Date(to);
    const days = Math.max(1, Math.round((t.getTime() - f.getTime()) / 86_400_000) + 1);
    return { from: f, to: t, days, preset, label: "Custom range" };
  }

  if (preset === "yesterday") {
    const y = new Date(end.getTime() - 86_400_000);
    return { from: y, to: y, days: 1, preset, label: "Yesterday" };
  }

  const days = presetDays(preset);
  const start = new Date(end.getTime() - (days - 1) * 86_400_000);
  return { from: start, to: end, days, preset, label: presetLabel(preset) };
}

/** Bucket granularity chosen from the span so charts stay readable. */
export function granularityFor(days: number): "day" | "week" | "month" {
  if (days <= 31) return "day";
  if (days <= 120) return "week";
  return "month";
}

export function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

