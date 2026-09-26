import type { Photo, PhotoCategory } from "@/types/content";
import { createRng, intBetween, pick } from "@/lib/random";
import { LOCATIONS } from "./locations";
import { DEFAULT_ORGANIZATION_ID } from "./organizations";

const CATEGORIES: PhotoCategory[] = [
  "logo",
  "cover",
  "interior",
  "exterior",
  "team",
  "product",
  "other",
];

function build(): Photo[] {
  const rng = createRng(15_926_535);
  return Array.from({ length: 168 }, (_, i) => {
    const location = LOCATIONS.at(i % LOCATIONS.length);
    if (!location) throw new Error("At least one location is required");
    const category = pick(rng, CATEGORIES);
    return {
      id: `pho_${7_000 + i}`,
      organizationId: DEFAULT_ORGANIZATION_ID,
      locationId: location.id,
      locationName: location.name,
      category,
      fileName: `${category}-${location.storeCode.toLowerCase()}-${i}.jpg`,
      sizeKb: intBetween(rng, 120, 4_800),
      width: pick(rng, [1200, 1600, 1920, 2400]),
      height: pick(rng, [800, 900, 1080, 1600]),
      uploadedAt: new Date(Date.now() - intBetween(rng, 1, 400) * 86_400_000).toISOString(),
      views: intBetween(rng, 40, 92_000),
      isCover: category === "cover" && rng() < 0.4,
      hue: intBetween(rng, 0, 359),
    };
  });
}

export const PHOTOS: Photo[] = build();
