export interface GeoGridNodeItem {
  id: string;
  row: number;
  col: number;
  latLabel: string;
  lngLabel: string;
  distanceKm: string;
  rank: number;
  topCompetitors: { brand: string; rank: number; reviews: number }[];
}

export interface GeoGridLocationOption {
  id: string;
  name: string;
  city: string;
  address: string;
  baseLat: number;
  baseLng: number;
}

export const GEOGRID_LOCATIONS: GeoGridLocationOption[] = [
  {
    id: "store-371",
    name: "Demo Store 371",
    city: "Unnao, UP",
    address: "MG Road, Unnao, Uttar Pradesh 209801",
    baseLat: 26.5393,
    baseLng: 80.4878,
  },
  {
    id: "store-312",
    name: "Demo Store 312",
    city: "Bikaner, RJ",
    address: "Station Road, Bikaner, Rajasthan 334001",
    baseLat: 28.0229,
    baseLng: 73.3119,
  },
  {
    id: "store-304",
    name: "Demo Store 304",
    city: "Nashik, MH",
    address: "College Road, Nashik, Maharashtra 422005",
    baseLat: 20.0059,
    baseLng: 73.7898,
  },
  {
    id: "store-42",
    name: "Demo Store 42",
    city: "East Delhi, DL",
    address: "Laxmi Nagar, East Delhi 110092",
    baseLat: 28.6304,
    baseLng: 77.2777,
  },
];

export const GEOGRID_KEYWORDS = [
  "footwear shop near me",
  "ladies shoes",
  "men shoes",
  "shoe shop near me",
  "sports shoes",
];

export function generateGeoGridNodes(
  locationId: string,
  keyword: string,
  gridSize: number, // 3, 5, or 7
  radiusKm: number // 1, 3, 5, 10
): GeoGridNodeItem[] {
  const loc = GEOGRID_LOCATIONS.find((l) => l.id === locationId) ?? GEOGRID_LOCATIONS[0];
  const kwIndex = GEOGRID_KEYWORDS.indexOf(keyword);
  const baseSeed = (loc.baseLat * 100 + loc.baseLng * 10 + (kwIndex >= 0 ? kwIndex : 0) * 7) % 100;

  const nodes: GeoGridNodeItem[] = [];
  const center = Math.floor(gridSize / 2);

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const distFromCenter = Math.sqrt(Math.pow(r - center, 2) + Math.pow(c - center, 2));
      const kmDistance = (distFromCenter * (radiusKm / center)).toFixed(1);

      // Seeded rank generation: Center nodes get better ranks (1-3), outer nodes drop to (4-12)
      const noise = Math.floor((Math.sin(r * 3 + c * 5 + baseSeed) + 1) * 2);
      let calculatedRank = 1 + Math.floor(distFromCenter * 1.8) + noise;

      if (r === center && c === center) {
        calculatedRank = 1; // Always #1 rank at store center
      } else {
        calculatedRank = Math.min(20, Math.max(1, calculatedRank));
      }

      // Generate realistic competitors for this GPS coordinate
      const competitors = [
        { brand: "Demo Store (Self)", rank: calculatedRank, reviews: 1420 },
        { brand: "Bata Footwear", rank: calculatedRank === 1 ? 2 : calculatedRank - 1, reviews: 3890 },
        { brand: "Comet Shoes", rank: calculatedRank === 1 ? 3 : calculatedRank + 1, reviews: 940 },
        { brand: "Red Tape Outlet", rank: calculatedRank + 2, reviews: 2150 },
      ].sort((a, b) => a.rank - b.rank);

      nodes.push({
        id: `node-${r}-${c}`,
        row: r,
        col: c,
        latLabel: (loc.baseLat + (r - center) * 0.01).toFixed(4),
        lngLabel: (loc.baseLng + (c - center) * 0.01).toFixed(4),
        distanceKm: `${kmDistance} km`,
        rank: calculatedRank,
        topCompetitors: competitors,
      });
    }
  }

  return nodes;
}
