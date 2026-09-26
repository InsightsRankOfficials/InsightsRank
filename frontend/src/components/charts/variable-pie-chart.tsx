import { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

let variablePieInitialized = false;

export interface VariablePiePoint {
  name: string;
  y: number;
  z: number;
  color: string;
}

interface VariablePieChartProps {
  data: VariablePiePoint[];
  innerSize?: string;
  height?: number;
  centerScore?: number | string;
  centerLabel?: string;
  showDataLabels?: boolean;
}

export function VariablePieChart({
  data,
  innerSize = "45%",
  height = 240,
  centerScore,
  centerLabel,
  showDataLabels = true,
}: VariablePieChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("highcharts/modules/variable-pie").then((module) => {
        const initModule = module.default || module;
        const hc = (Highcharts as any)?.default || Highcharts;
        if (typeof initModule === "function" && !variablePieInitialized) {
          initModule(hc);
          variablePieInitialized = true;
        }
        setIsMounted(true);
      });
    }
  }, []);

  if (!isMounted) {
    return (
      <div
        className="w-full flex items-center justify-center text-xs text-muted-foreground"
        style={{ height: `${height}px` }}
      >
        Loading variable pie chart...
      </div>
    );
  }

  const chartOptions: Highcharts.Options = {
    chart: {
      type: "variablepie",
      backgroundColor: "transparent",
      height,
      margin: [0, 0, 0, 0],
      spacing: [0, 0, 0, 0],
    },
    title: { text: undefined },
    credits: { enabled: false },
    tooltip: {
      useHTML: true,
      backgroundColor: "#18181b",
      borderColor: "#3f3f46",
      borderRadius: 6,
      shadow: false,
      style: { color: "#f4f4f5", fontSize: "11px" },
      pointFormat:
        '<div style="color:#f4f4f5; font-size:11px; padding: 2px 4px;"><span style="color:{point.color}; font-weight:bold;">\u25CF</span> <span style="font-weight:600; color:#f4f4f5;">{point.name}</span>: <span style="color:#38bdf8; font-weight:600;">{point.y:.2f}%</span></div>',
    },
    plotOptions: {
      variablepie: {
        dataLabels: {
          enabled: showDataLabels,
          distance: 12,
          format: "<b>{point.name}</b><br/>{point.y:.2f}%",
          style: {
            color: "#e4e4e7",
            fontSize: "10px",
            textOutline: "none",
            fontWeight: "normal",
          },
        },
        borderWidth: 2,
        borderColor: "var(--surface)",
        innerSize,
        zMin: 0,
        zMax: 100,
      },
    },
    series: [
      {
        type: "variablepie",
        name: "Share",
        data: data.map((item) => ({
          name: item.name,
          y: item.y,
          z: item.z,
          color: item.color,
        })),
      },
    ],
  };

  const HighchartsReactComp: any =
    typeof HighchartsReact === "function"
      ? HighchartsReact
      : (HighchartsReact as any)?.default?.default ||
        (HighchartsReact as any)?.default ||
        HighchartsReact;

  const HighchartsObj: any = (Highcharts as any)?.default || Highcharts;

  return (
    <div className="relative w-full" style={{ height: `${height}px` }}>
      <HighchartsReactComp highcharts={HighchartsObj} options={chartOptions} />
      {centerScore !== undefined && (
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-center">
          <span className="tnum text-3xl font-extrabold text-foreground">{centerScore}</span>
          {centerLabel && (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
              {centerLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
