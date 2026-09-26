import type { Competitor } from "@/types/ranking";
import { createRng, floatBetween, intBetween, pick } from "@/lib/random";
import { PRIMARY_CATEGORIES } from "./categories";
import { DEFAULT_ORGANIZATION_ID } from "./organizations";

const NAMES = [
  "Bata", "Comet Footwear", "RedTape", "Metro Shoes", "Skechers India", "Campus Activewear",
  "Liberty Retail", "Woodland", "Relaxo Stores", "Puma Select", "Adidas Originals", "Khadims",
  "Mochi", "Paragon Retail", "Sparx Outlets", "Crocs India", "Hush Puppies", "Lee Cooper Shoes",
  "VKC Pride", "Action Shoes", "Nike Rise", "Reebok Fit Hub",
];

function build(): Competitor[] {
  const rng = createRng(88_991);
  return NAMES.map((name, i) => ({
    id: `cmp_${i + 1}`,
    organizationId: DEFAULT_ORGANIZATION_ID,
    name,
    locations: intBetween(rng, 240, 18_400),
    averageRank: Number(floatBetween(rng, 2.1, 17.8).toFixed(1)),
    rating: Number(floatBetween(rng, 3.4, 4.8).toFixed(1)),
    reviews: intBetween(rng, 4_200, 412_000),
    visibilityPct: Number(floatBetween(rng, 12, 78).toFixed(1)),
    trendPct: Number(floatBetween(rng, -14, 22).toFixed(1)),
    categories: [pick(rng, PRIMARY_CATEGORIES), pick(rng, PRIMARY_CATEGORIES)].filter(
      (v, idx, arr) => arr.indexOf(v) === idx,
    ),
    keywordOverlapPct: Number(floatBetween(rng, 8, 82).toFixed(1)),
  }));
}

export const COMPETITORS: Competitor[] = build();
