import { request } from "@/api/transport";
import { KEYWORDS } from "@/data/keywords";
import { LOCATIONS } from "@/data/locations";
import { POSTS } from "@/data/posts";
import { REPORTS } from "@/data/reports";
import { REVIEWS } from "@/data/reviews";
import { USERS } from "@/data/users";

export type SearchGroup = "locations" | "reviews" | "keywords" | "users" | "posts" | "reports";

export interface SearchHit {
  id: string;
  group: SearchGroup;
  title: string;
  subtitle: string;
  /** Route target, resolved by the caller into a typed Link. */
  target: { kind: "location"; locationId: string } | { kind: "route"; path: SearchRoute };
}

export type SearchRoute =
  | "/locations"
  | "/reviews"
  | "/rankings/keywords"
  | "/organization/users"
  | "/content/posts"
  | "/reports";

/** GET /search?q= */
export function globalSearch(query: string): Promise<SearchHit[]> {
  return request(`GET /search?q=${query}`, () => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    const hits: SearchHit[] = [];

    for (const l of LOCATIONS) {
      if (hits.filter((h) => h.group === "locations").length >= 5) break;
      if (`${l.name} ${l.storeCode} ${l.city}`.toLowerCase().includes(q)) {
        hits.push({
          id: l.id,
          group: "locations",
          title: l.name,
          subtitle: `${l.storeCode} · ${l.city} · ${l.primaryCategory}`,
          target: { kind: "location", locationId: l.id },
        });
      }
    }

    for (const r of REVIEWS) {
      if (hits.filter((h) => h.group === "reviews").length >= 4) break;
      if (`${r.reviewerName} ${r.text}`.toLowerCase().includes(q)) {
        hits.push({
          id: r.id,
          group: "reviews",
          title: `${r.rating}★ ${r.reviewerName}`,
          subtitle: r.text.slice(0, 72),
          target: { kind: "route", path: "/reviews" },
        });
      }
    }

    for (const k of KEYWORDS) {
      if (hits.filter((h) => h.group === "keywords").length >= 4) break;
      if (k.term.toLowerCase().includes(q)) {
        hits.push({
          id: k.id,
          group: "keywords",
          title: k.term,
          subtitle: `Rank ${k.currentRank} · ${k.locationName}`,
          target: { kind: "route", path: "/rankings/keywords" },
        });
      }
    }

    for (const u of USERS) {
      if (hits.filter((h) => h.group === "users").length >= 3) break;
      if (`${u.name} ${u.email}`.toLowerCase().includes(q)) {
        hits.push({
          id: u.id,
          group: "users",
          title: u.name,
          subtitle: `${u.email} · ${u.role}`,
          target: { kind: "route", path: "/organization/users" },
        });
      }
    }

    for (const p of POSTS) {
      if (hits.filter((h) => h.group === "posts").length >= 3) break;
      if (p.title.toLowerCase().includes(q)) {
        hits.push({
          id: p.id,
          group: "posts",
          title: p.title,
          subtitle: `${p.status} · ${p.locationScope}`,
          target: { kind: "route", path: "/content/posts" },
        });
      }
    }

    for (const r of REPORTS) {
      if (hits.filter((h) => h.group === "reports").length >= 3) break;
      if (r.name.toLowerCase().includes(q)) {
        hits.push({
          id: r.id,
          group: "reports",
          title: r.name,
          subtitle: `${r.type} · ${r.locationScope}`,
          target: { kind: "route", path: "/reports" },
        });
      }
    }

    return hits;
  });
}
