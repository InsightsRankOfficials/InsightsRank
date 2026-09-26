import { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

interface HighchartsTrendChartProps {
  categories: string[];
  positiveData: number[];
  neutralData: number[];
  negativeData: number[];
  graphType: "bar" | "line";
  height?: number;
}

export function HighchartsTrendChart({
  categories,
  positiveData,
  neutralData,
  negativeData,
  graphType,
  height = 220,
}: HighchartsTrendChartProps) {
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
        Loading trend chart...
      </div>
    );
  }

  const isBar = graphType === "bar";

  const options: Highcharts.Options = {
    chart: {
      type: isBar ? "column" : "spline",
      backgroundColor: "transparent",
      height: height,
      spacing: [10, 10, 10, 10],
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
      allowDecimals: false,
    },
    tooltip: {
      useHTML: true,
      backgroundColor: "#18181b",
      borderColor: "#3f3f46",
      borderRadius: 8,
      shared: true,
      shadow: true,
      style: { color: "#f4f4f5", fontSize: "12px" },
    },
    legend: {
      enabled: true,
      align: "center",
      verticalAlign: "bottom",
      itemStyle: { color: "#a1a1aa", fontSize: "11px", fontWeight: "500" },
      itemHoverStyle: { color: "#f4f4f5" },
    },
    plotOptions: {
      column: {
        stacking: "normal",
        borderWidth: 0,
        borderRadius: 4,
        maxPointWidth: 48,
        dataLabels: {
          enabled: true,
          style: { color: "#ffffff", fontSize: "10px", textOutline: "none" },
          formatter: function () {
            return this.y && this.y > 0 ? String(this.y) : "";
          },
        },
      },
      spline: {
        lineWidth: 3,
        marker: {
          enabled: true,
          radius: 5,
        },
      },
    },
    series: [
      {
        type: isBar ? "column" : "spline",
        name: "Positive",
        color: "#10b981",
        data: positiveData,
      },
      {
        type: isBar ? "column" : "spline",
        name: "Neutral",
        color: "#3b82f6",
        data: neutralData,
      },
      {
        type: isBar ? "column" : "spline",
        name: "Negative",
        color: "#ef4444",
        data: negativeData,
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
      <HighchartsReactComp highcharts={HighchartsObj} options={options} key={graphType} />
    </div>
  );
}
