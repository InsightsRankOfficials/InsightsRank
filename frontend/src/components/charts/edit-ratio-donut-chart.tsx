import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface EditRatioDonutChartProps {
  aiGeneratedPct?: number;
  editedPct?: number;
  height?: number;
}

export function EditRatioDonutChart({
  aiGeneratedPct = 80,
  editedPct = 20,
  height = 160,
}: EditRatioDonutChartProps) {
  const data = [
    { name: "AI Generated", value: aiGeneratedPct, color: "#facc15" },
    { name: "Edited", value: editedPct, color: "#34d399" },
  ];

  return (
    <div className="relative w-full flex items-center justify-center" style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={65}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "#18181b",
              border: "1px solid #3f3f46",
              borderRadius: "8px",
              color: "#f4f4f5",
              fontSize: "11px",
            }}
            formatter={(val: number) => [`${val}%`, "Ratio"]}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Center Label Overlay matching Total Impressions chart */}
      <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-center">
        <span className="tnum text-xl font-extrabold text-foreground">{editedPct}%</span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
          Edited
        </span>
      </div>
    </div>
  );
}
