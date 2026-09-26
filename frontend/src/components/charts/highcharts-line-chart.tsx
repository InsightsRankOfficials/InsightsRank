import { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

interface HighchartsLineChartProps {
  categories: string[];
  data: number[];
  height?: number;
  seriesName?: string;
  color?: string;
}

export function HighchartsLineChart({
  categories,
  data,
  height = 240,
  seriesName = "Scans",
  color = "#6366f1",
}: HighchartsLineChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div
        style={{ height: `${height}px` }}
        className="w-full flex items-center justify-center text-xs text-muted-foreground"
      >
        Loading line chart...
      </div>
    );
  }

  const options: Highcharts.Options = {
    chart: {
      type: "spline",
      backgroundColor: "transparent",
      height: height,
      spacing: [10, 10, 15, 10],
      style: { fontFamily: "inherit" },
    },
    title: { text: undefined },
    credits: { enabled: false },
    xAxis: {
      categories: categories,
      lineColor: "#27272a",
      tickColor: "#27272a",
      labels: { style: { color: "#a1a1aa", fontSize: "11px", fontWeight: "500" } },
    },
    yAxis: {
      title: { text: undefined },
      gridLineColor: "#27272a",
      gridLineDashStyle: "Dash",
      labels: { style: { color: "#a1a1aa", fontSize: "11px" } },
      min: 0,
    },
    tooltip: {
      useHTML: true,
      backgroundColor: "#18181b",
      borderColor: "#3f3f46",
      borderRadius: 8,
      shadow: true,
      style: { color: "#f4f4f5", fontSize: "12px" },
      formatter: function () {
        return `<div style="padding: 2px 4px;">
          <span style="color:#a1a1aa; font-size:10px;">${this.x}</span><br/>
          <span style="color:${color}; font-weight:bold;">\u25CF</span> 
          <span style="font-weight:600; color:#f4f4f5;">${this.series.name}</span>: 
          <span style="color:#facc15; font-weight:bold;">${this.y}</span>
        </div>`;
      },
    },
    legend: { enabled: false },
    plotOptions: {
      spline: {
        lineWidth: 3,
        color: color,
        marker: {
          enabled: true,
          radius: 5,
          fillColor: color,
          lineWidth: 2,
          lineColor: "#ffffff",
          states: {
            hover: {
              radius: 7,
              lineWidth: 3,
            },
          },
        },
        states: {
          hover: {
            lineWidth: 3.5,
          },
        },
      },
    },
    series: [
      {
        type: "spline",
        name: seriesName,
        data: data,
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
    <div className="w-full relative" style={{ height: `${height}px` }}>
      <HighchartsReactComp highcharts={HighchartsObj} options={options} />
    </div>
  );
}
