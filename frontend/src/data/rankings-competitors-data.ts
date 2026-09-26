export interface TrackedCompetitorItem {
  id: string;
  brandName: string;
  website: string;
  avgRank: number;
  marketShare: string;
  reviewCount: number;
  avgRating: number;
  status: "Active" | "Paused";
  trajectory: "Improved" | "Declined" | "Constant";
  keywordsCovered: number;
}

export interface CompetitorStatCard {
  label: string;
  value: string;
  change: string;
  changeType: "up" | "down" | "neutral";
  subtitle: string;
}

export const COMPETITOR_KPI_STATS: CompetitorStatCard[] = [
  {
    label: "Tracked Competitors",
    value: "6 Brands",
    change: "+1 new this month",
    changeType: "up",
    subtitle: "Active market monitoring",
  },
  {
    label: "Market Share of Voice",
    value: "38.4%",
    change: "+3.2%",
    changeType: "up",
    subtitle: "Rank 1-3 SERP Share",
  },
  {
    label: "Avg Rank Advantage",
    value: "+2.8 Ranks Ahead",
    change: "Outranking Bata & Comet",
    changeType: "up",
    subtitle: "Vs Top 5 Competitors",
  },
  {
    label: "Top SERP Competitor",
    value: "Bata India",
    change: "Avg Rank 4.2",
    changeType: "neutral",
    subtitle: "Closest competitor threat",
  },
];

export const INITIAL_TRACKED_COMPETITORS: TrackedCompetitorItem[] = [
  {
    id: "comp-1",
    brandName: "Demo Pvt Ltd (Your Store)",
    website: "https://demostores.com",
    avgRank: 2.1,
    marketShare: "38.4%",
    reviewCount: 1420,
    avgRating: 4.8,
    status: "Active",
    trajectory: "Improved",
    keywordsCovered: 5,
  },
  {
    id: "comp-2",
    brandName: "Bata India",
    website: "https://bata.in",
    avgRank: 4.2,
    marketShare: "24.1%",
    reviewCount: 3890,
    avgRating: 4.4,
    status: "Active",
    trajectory: "Constant",
    keywordsCovered: 5,
  },
  {
    id: "comp-3",
    brandName: "Comet Footwear",
    website: "https://wearcomet.com",
    avgRank: 6.8,
    marketShare: "15.6%",
    reviewCount: 940,
    avgRating: 4.6,
    status: "Active",
    trajectory: "Improved",
    keywordsCovered: 5,
  },
  {
    id: "comp-4",
    brandName: "Red Tape Stores",
    website: "https://redtape.com",
    avgRank: 9.4,
    marketShare: "11.2%",
    reviewCount: 2150,
    avgRating: 4.2,
    status: "Active",
    trajectory: "Declined",
    keywordsCovered: 4,
  },
  {
    id: "comp-5",
    brandName: "Paragon Footwear",
    website: "https://paragonfootwear.com",
    avgRank: 12.1,
    marketShare: "6.5%",
    reviewCount: 1780,
    avgRating: 4.1,
    status: "Active",
    trajectory: "Declined",
    keywordsCovered: 3,
  },
  {
    id: "comp-6",
    brandName: "Liberty Shoes",
    website: "https://libertyshoes.com",
    avgRank: 14.8,
    marketShare: "4.2%",
    reviewCount: 1120,
    avgRating: 4.0,
    status: "Active",
    trajectory: "Constant",
    keywordsCovered: 3,
  },
];

export const COMPETITOR_TREND_CHART_DATA = [
  { date: "01 Apr", demoPvtLtd: 2, bata: 4, comet: 7, redTape: 9, paragon: 12 },
  { date: "10 Apr", demoPvtLtd: 2, bata: 4, comet: 6, redTape: 10, paragon: 13 },
  { date: "20 Apr", demoPvtLtd: 2, bata: 5, comet: 6, redTape: 10, paragon: 12 },
  { date: "01 May", demoPvtLtd: 1, bata: 4, comet: 7, redTape: 9, paragon: 11 },
  { date: "10 May", demoPvtLtd: 2, bata: 4, comet: 6, redTape: 9, paragon: 12 },
  { date: "20 May", demoPvtLtd: 2, bata: 4, comet: 7, redTape: 10, paragon: 13 },
];
