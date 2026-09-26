import type { GeoGrid, GeoGridPoint } from "@/types/ranking";
import { createRng, hashSeed, intBetween } from "@/lib/random";

/** Builds a square geo grid of ranked sample points around a location. */
export function generateGeoGrid(params: {
  keyword: string;
  locationId: string;
  locationName: string;
  lat: number;
  lng: number;
  radiusKm: number;
  device: "desktop" | "mobile";
  size?: number;
}): GeoGrid {
  const size = params.size ?? 7;
  const rng = createRng(hashSeed(`${params.keyword}:${params.locationId}:${params.device}`) || 3);
  const points: GeoGridPoint[] = [];
  const stepDeg = (params.radiusKm / 111) / ((size - 1) / 2);
  const mid = (size - 1) / 2;

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const distance = Math.hypot(row - mid, col - mid);
      const base = 1 + distance * 2.4 + intBetween(rng, -1, 3);
      points.push({
        id: `gp_${row}_${col}`,
        row,
        col,
        lat: params.lat + (mid - row) * stepDeg,
        lng: params.lng + (col - mid) * stepDeg,
        rank: Math.min(21, Math.max(1, Math.round(base))),
      });
    }
  }

  return {
    keyword: params.keyword,
    locationId: params.locationId,
    locationName: params.locationName,
    radiusKm: params.radiusKm,
    device: params.device,
    capturedAt: new Date(Date.now() - 42 * 60_000).toISOString(),
    averageRank: Number(
      (points.reduce((a, p) => a + p.rank, 0) / points.length).toFixed(1),
    ),
    size,
    points,
  };
}
