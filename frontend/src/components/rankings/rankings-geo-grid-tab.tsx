import { useState, useMemo } from "react";
import {
  Grid3x3,
  MapPin,
  Search,
  Filter,
  Layers,
  Award,
  TrendingUp,
  CheckCircle2,
  Navigation,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GEOGRID_LOCATIONS,
  GEOGRID_KEYWORDS,
  generateGeoGridNodes,
  type GeoGridNodeItem,
} from "@/data/rankings-geogrid-data";

export function RankingsGeoGridTab() {
  const [selectedLocationId, setSelectedLocationId] = useState("store-371");
  const [selectedKeyword, setSelectedKeyword] = useState("footwear shop near me");
  const [gridSize, setGridSize] = useState<number>(5); // 3, 5, or 7
  const [radiusKm, setRadiusKm] = useState<number>(5); // 1, 3, 5, 10
  const [activeNode, setActiveNode] = useState<GeoGridNodeItem | null>(null);

  // Selected Location Object
  const selectedLocation = useMemo(
    () => GEOGRID_LOCATIONS.find((l) => l.id === selectedLocationId) ?? GEOGRID_LOCATIONS[0],
    [selectedLocationId]
  );

  // Dynamically generate Geo Grid Nodes
  const nodes = useMemo(
    () => generateGeoGridNodes(selectedLocationId, selectedKeyword, gridSize, radiusKm),
    [selectedLocationId, selectedKeyword, gridSize, radiusKm]
  );

  // Set default active node to center pin on data change
  const centerNode = useMemo(() => {
    const centerIdx = Math.floor(nodes.length / 2);
    return nodes[centerIdx] ?? nodes[0];
  }, [nodes]);

  const activeDisplayNode = activeNode ?? centerNode;

  // Grid Stats
  const stats = useMemo(() => {
    const top3Count = nodes.filter((n) => n.rank <= 3).length;
    const midCount = nodes.filter((n) => n.rank >= 4 && n.rank <= 9).length;
    const lowCount = nodes.filter((n) => n.rank >= 10).length;

    const total = nodes.length;
    const avgRank = (nodes.reduce((acc, n) => acc + n.rank, 0) / total).toFixed(1);
    const top3Pct = ((top3Count / total) * 100).toFixed(1);

    return {
      avgRank,
      top3Count,
      top3Pct,
      midCount,
      lowCount,
      total,
    };
  }, [nodes]);

  return (
    <div className="rounded-2xl bg-card dark:bg-[#141416] p-6 sm:p-8 space-y-6 shadow-xl border border-border">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <span>Geo Grid Rank Analysis</span>
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Visualize localized Google Maps ranking performance across GPS grid pinpoints around your store.
          </p>
        </div>
      </div>

      {/* 4 Metric KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="panel p-4 flex flex-col justify-between space-y-2">
          <div className="flex items-center gap-1.5 text-blue-500">
            <Grid3x3 className="size-3.5" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-500">
              Average Grid Rank
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <p className="tnum text-2xl font-extrabold tracking-tight text-foreground">
                #{stats.avgRank}
              </p>
              <span className="text-xs font-bold text-emerald-400 tnum">
                Top 3 Dominant
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Across {stats.total} GPS Nodes
            </p>
          </div>
        </div>

        <div className="panel p-4 flex flex-col justify-between space-y-2">
          <div className="flex items-center gap-1.5 text-blue-500">
            <Award className="size-3.5" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-500">
              Top 3 Dominance
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <p className="tnum text-2xl font-extrabold tracking-tight text-emerald-400">
                {stats.top3Pct}%
              </p>
              <span className="text-xs font-bold text-emerald-400 tnum">
                {stats.top3Count} of {stats.total} Pins
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Ranked #1 to #3 on Google Maps
            </p>
          </div>
        </div>

        <div className="panel p-4 flex flex-col justify-between space-y-2">
          <div className="flex items-center gap-1.5 text-blue-500">
            <Navigation className="size-3.5" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-500">
              Grid Radius Coverage
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <p className="tnum text-2xl font-extrabold tracking-tight text-foreground">
                {radiusKm} km Radius
              </p>
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Around {selectedLocation.name}
            </p>
          </div>
        </div>

        <div className="panel p-4 flex flex-col justify-between space-y-2">
          <div className="flex items-center gap-1.5 text-blue-500">
            <MapPin className="size-3.5" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-500">
              Selected Location
            </span>
          </div>
          <div>
            <p className="font-bold text-sm text-foreground line-clamp-1">
              {selectedLocation.name}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
              {selectedLocation.city}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="panel p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          {/* Store Selector */}
          <Select value={selectedLocationId} onValueChange={setSelectedLocationId}>
            <SelectTrigger className="h-8 min-w-[180px] bg-background border-border text-xs cursor-pointer">
              <SelectValue placeholder="Select Store Location" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border text-popover-foreground text-xs">
              {GEOGRID_LOCATIONS.map((loc) => (
                <SelectItem key={loc.id} value={loc.id} className="cursor-pointer">
                  {loc.name} ({loc.city})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Keyword Selector */}
          <Select value={selectedKeyword} onValueChange={setSelectedKeyword}>
            <SelectTrigger className="h-8 min-w-[200px] bg-background border-border text-xs cursor-pointer">
              <SelectValue placeholder="Select Target Keyword" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border text-popover-foreground text-xs">
              {GEOGRID_KEYWORDS.map((kw) => (
                <SelectItem key={kw} value={kw} className="cursor-pointer">
                  {kw}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Grid Size Selector */}
          <Select value={String(gridSize)} onValueChange={(v) => setGridSize(Number(v))}>
            <SelectTrigger className="h-8 w-32 bg-background border-border text-xs cursor-pointer">
              <SelectValue placeholder="Grid Size" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border text-popover-foreground text-xs">
              <SelectItem value="3">3x3 Grid (9 Pins)</SelectItem>
              <SelectItem value="5">5x5 Grid (25 Pins)</SelectItem>
              <SelectItem value="7">7x7 Grid (49 Pins)</SelectItem>
            </SelectContent>
          </Select>

          {/* Radius Selector */}
          <Select value={String(radiusKm)} onValueChange={(v) => setRadiusKm(Number(v))}>
            <SelectTrigger className="h-8 w-32 bg-background border-border text-xs cursor-pointer">
              <SelectValue placeholder="Radius" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border text-popover-foreground text-xs">
              <SelectItem value="1">1 km Radius</SelectItem>
              <SelectItem value="3">3 km Radius</SelectItem>
              <SelectItem value="5">5 km Radius</SelectItem>
              <SelectItem value="10">10 km Radius</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="size-2.5 rounded-full bg-emerald-500" /> Rank 1-3
          </span>
          <span className="flex items-center gap-1.5 text-blue-400 font-bold">
            <span className="size-2.5 rounded-full bg-blue-500" /> Rank 4-9
          </span>
          <span className="flex items-center gap-1.5 text-red-400 font-bold">
            <span className="size-2.5 rounded-full bg-red-500" /> Rank 10+
          </span>
        </div>
      </div>

      {/* Main Interactive Geo Grid Visualizer & Node Detail Panel */}
      <div className="grid gap-4 lg:grid-cols-[1fr_340px] items-start">
        {/* Interactive Grid Map Canvas */}
        <div className="panel p-5 space-y-4 flex flex-col items-center justify-center min-h-[420px] bg-card dark:bg-[#0c0c0e] border-border relative overflow-hidden">
          {/* Watermark Grid Map Background Accent */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#eab308_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* Location Header Badge */}
          <div className="z-10 flex items-center gap-2 bg-secondary/90 dark:bg-[#18181b]/90 border border-border dark:border-[#27272a] px-3 py-1 rounded-full text-xs font-semibold text-foreground">
            <MapPin className="size-3.5 text-blue-500" />
            <span>{selectedLocation.name}</span>
            <span className="text-muted-foreground">• Keyword: "{selectedKeyword}"</span>
          </div>

          {/* Grid Map Layout */}
          <div
            className="grid gap-3.5 z-10 my-4"
            style={{
              gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
            }}
          >
            {nodes.map((node) => {
              const isCenter = node.row === Math.floor(gridSize / 2) && node.col === Math.floor(gridSize / 2);
              const isActive = activeDisplayNode?.id === node.id;

              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => setActiveNode(node)}
                  className={`relative flex flex-col items-center justify-center rounded-full p-2.5 cursor-pointer transition-all transform hover:scale-110 shadow-lg ${
                    node.rank <= 3
                      ? "bg-emerald-500 text-black font-extrabold shadow-emerald-500/20"
                      : node.rank <= 9
                      ? "bg-blue-500 text-black font-extrabold shadow-blue-500/20"
                      : "bg-red-500 text-white font-extrabold shadow-red-500/20"
                  } ${
                    gridSize === 7 ? "size-9 text-xs" : gridSize === 5 ? "size-11 text-sm" : "size-14 text-base"
                  } ${isActive ? "ring-4 ring-blue-400 scale-110 z-20" : ""}`}
                >
                  <span className="tnum font-extrabold leading-none">{node.rank}</span>

                  {isCenter && (
                    <span className="absolute -top-1 -right-1 size-3 rounded-full bg-blue-400 border-2 border-black animate-pulse" title="Store Location Center" />
                  )}
                </button>
              );
            })}
          </div>

          <p className="text-[11px] text-muted-foreground z-10">
            Click any GPS grid node pin above to inspect rank & competitors at that coordinate.
          </p>
        </div>

        {/* Selected Node Details Card */}
        <div className="panel p-4 sm:p-5 space-y-4 bg-card dark:bg-[#121214]">
          <div className="flex items-center justify-between border-b border-border dark:border-[#27272a] pb-2">
            <h3 className="text-xs font-bold text-blue-500 uppercase tracking-wide flex items-center gap-1.5">
              <Info className="size-4" />
              <span>GPS Node Inspection</span>
            </h3>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
              Node #{activeDisplayNode.id}
            </span>
          </div>

          {/* Node Meta Details */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded bg-secondary/40 dark:bg-[#18181b] border border-border dark:border-[#27272a]">
              <span className="text-muted-foreground">Distance from Store:</span>
              <span className="font-bold text-foreground tnum">{activeDisplayNode.distanceKm}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-secondary/40 dark:bg-[#18181b] border border-border dark:border-[#27272a]">
              <span className="text-muted-foreground">GPS Coordinates:</span>
              <span className="font-mono text-[11px] text-blue-400 tnum">
                {activeDisplayNode.latLabel}, {activeDisplayNode.lngLabel}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-secondary/40 dark:bg-[#18181b] border border-border dark:border-[#27272a]">
              <span className="text-muted-foreground">Your Rank at Node:</span>
              <span className="font-extrabold text-sm text-emerald-400 tnum">
                Rank #{activeDisplayNode.rank}
              </span>
            </div>
          </div>

          {/* Top Competitors at Node */}
          <div className="space-y-2 pt-2 border-t border-border dark:border-[#27272a]">
            <h4 className="text-[11px] font-bold text-blue-500 uppercase tracking-wider">
              Top Competitors at this Coordinate
            </h4>

            <div className="space-y-1.5">
              {activeDisplayNode.topCompetitors.map((c) => (
                <div
                  key={c.brand}
                  className="flex items-center justify-between p-2 rounded bg-secondary/40 dark:bg-[#18181b] border border-border dark:border-[#27272a] text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className={`size-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                        c.rank === 1
                          ? "bg-blue-500 text-black"
                          : c.rank === 2
                          ? "bg-secondary text-foreground"
                          : "bg-secondary/60 text-muted-foreground"
                      }`}
                    >
                      {c.rank}
                    </span>
                    <span className="font-semibold text-foreground truncate">{c.brand}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground tnum">
                    {c.reviews} reviews
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid Pins Breakdown Table */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-bold text-blue-500 uppercase tracking-wide">
          Geo Grid Nodes Coordinate Log
        </h3>

        <div className="rounded-xl border border-border dark:border-[#27272a] bg-card dark:bg-[#121214] overflow-hidden shadow-sm">
          <div className="overflow-x-auto max-h-64 overflow-y-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 bg-card dark:bg-[#121214] z-10">
                <tr className="border-b border-border dark:border-[#27272a] bg-secondary/30 text-muted-foreground font-semibold">
                  <th className="py-2.5 px-4 font-bold text-foreground">Node ID</th>
                  <th className="py-2.5 px-4 text-muted-foreground">Distance</th>
                  <th className="py-2.5 px-4 text-muted-foreground">GPS Coordinates</th>
                  <th className="py-2.5 px-4 text-center text-muted-foreground">Rank</th>
                  <th className="py-2.5 px-4 text-right text-muted-foreground">Top Competitor At Node</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 dark:divide-[#27272a]/50 text-foreground">
                {nodes.map((n) => (
                  <tr
                    key={n.id}
                    onClick={() => setActiveNode(n)}
                    className={`hover:bg-secondary/20 cursor-pointer transition-colors ${
                      activeDisplayNode.id === n.id ? "bg-blue-500/10" : ""
                    }`}
                  >
                    <td className="py-3 px-4 font-mono text-[11px] text-blue-500 font-semibold">{n.id}</td>
                    <td className="py-3 px-4 text-muted-foreground tnum">{n.distanceKm}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-foreground">
                      {n.latLabel}, {n.lngLabel}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded font-extrabold text-[11px] tnum ${
                          n.rank <= 3
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : n.rank <= 9
                            ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                            : "bg-red-500/10 text-red-400 border border-red-500/30"
                        }`}
                      >
                        Rank #{n.rank}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-muted-foreground font-medium">
                      {n.topCompetitors[0]?.brand ?? "Bata Footwear"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
