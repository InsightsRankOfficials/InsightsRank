export interface ImprovedDeclinedStoreItem {
  id: string;
  name: string;
  location: string;
  currentRank: string;
  lastRank: string;
  changeValue: number;
}

export interface RankReportStoreItem {
  id: string;
  rank: number;
  name: string;
  code: string;
  address: string;
  keywordCount: number;
  avgRank: string;
  rankChange: string;
  changeType: "up" | "down" | "neutral";
  lastRunDate: string;
}

export interface KeywordTimeseriesItem {
  keyword: string;
  apr01Rank: string;
  may01Rank: string;
  status: "improved" | "declined" | "constant";
}

export interface CompetitorMatrixBrand {
  brandName: string;
  isSelf?: boolean;
  keywords: Record<
    string,
    {
      avgRank: string;
      trajectory: "Improved" | "Declined" | "Constant" | "Dropped Off" | "Not on list" | "New";
    }
  >;
}

export interface TopCompetitorCard {
  keyword: string;
  competitors: {
    brand: string;
    reviewsCount?: string;
    avgRank: string;
    trajectory: "Constant" | "Declined" | "New" | "Improved";
    trajectoryType: "up" | "down" | "neutral" | "new";
  }[];
}

export const MOST_IMPROVED_STORES: ImprovedDeclinedStoreItem[] = [
  {
    id: "imp-1",
    name: "Demo Store 371",
    location: "Unnao",
    currentRank: "4",
    lastRank: "20+",
    changeValue: 17,
  },
  {
    id: "imp-2",
    name: "Demo Store 312",
    location: "Bikaner",
    currentRank: "6",
    lastRank: "20+",
    changeValue: 15,
  },
  {
    id: "imp-3",
    name: "Demo Store 304",
    location: "Nashik",
    currentRank: "8",
    lastRank: "20+",
    changeValue: 13,
  },
  {
    id: "imp-4",
    name: "Demo Store 42",
    location: "East Delhi",
    currentRank: "11",
    lastRank: "20+",
    changeValue: 10,
  },
  {
    id: "imp-5",
    name: "Demo Store 306",
    location: "Baghpat",
    currentRank: "8",
    lastRank: "17",
    changeValue: 9,
  },
];

export const MOST_DECLINED_STORES: ImprovedDeclinedStoreItem[] = [
  {
    id: "dec-1",
    name: "Demo Store 140",
    location: "Morbi",
    currentRank: "20+",
    lastRank: "5",
    changeValue: 16,
  },
  {
    id: "dec-2",
    name: "Demo Store 108",
    location: "Ahmedabad",
    currentRank: "20+",
    lastRank: "9",
    changeValue: 12,
  },
  {
    id: "dec-3",
    name: "Demo Store 192",
    location: "Mumbai",
    currentRank: "16",
    lastRank: "6",
    changeValue: 10,
  },
  {
    id: "dec-4",
    name: "Demo Store 158",
    location: "South Delhi",
    currentRank: "19",
    lastRank: "10",
    changeValue: 9,
  },
  {
    id: "dec-5",
    name: "Demo Store 170",
    location: "Lucknow",
    currentRank: "20+",
    lastRank: "13",
    changeValue: 8,
  },
];

export const AVERAGE_RANK_TREND_DATA = [
  { date: "21 Mar 2026", demoPvtLtd: 9, bata: 13, comet: 15, redTape: 20 },
  { date: "25 Mar 2026", demoPvtLtd: 9, bata: 13, comet: 15, redTape: 19 },
  { date: "29 Mar 2026", demoPvtLtd: 8, bata: 14, comet: 16, redTape: 18 },
  { date: "01 Apr 2026", demoPvtLtd: 8, bata: 13, comet: 15, redTape: 18 },
  { date: "05 Apr 2026", demoPvtLtd: 8, bata: 13, comet: 15, redTape: 17 },
  { date: "10 Apr 2026", demoPvtLtd: 7, bata: 13, comet: 15, redTape: 17 },
  { date: "15 Apr 2026", demoPvtLtd: 7, bata: 12, comet: 15, redTape: 16 },
  { date: "20 Apr 2026", demoPvtLtd: 7, bata: 12, comet: 16, redTape: 16 },
  { date: "25 Apr 2026", demoPvtLtd: 7, bata: 12, comet: 16, redTape: 16 },
  { date: "01 May 2026", demoPvtLtd: 7, bata: 12, comet: 16, redTape: 16 },
];

export const STORES_APPEARED_BAR_DATA = [
  { month: "Mar 2026", locations: 280, keywords: 290 },
  { month: "Apr 2026", locations: 290, keywords: 295 },
];

export const RANK_REPORTS_LIST: RankReportStoreItem[] = [
  {
    id: "store-2",
    rank: 1,
    name: "Demo Store 2",
    code: "demo-store-2",
    address: "JMD Regent Arcade, 4th floor, MG Road, Valsad, 396001, Gujarat, IN",
    keywordCount: 5,
    avgRank: "2",
    rankChange: "0.6",
    changeType: "up",
    lastRunDate: "1 May, 2026",
  },
  {
    id: "store-3",
    rank: 2,
    name: "Demo Store 3",
    code: "demo-store-3",
    address: "JMD Regent Arcade, 4th floor, MG Road, Cuttack, 753001, Odisha, IN",
    keywordCount: 5,
    avgRank: "7",
    rankChange: "2.9",
    changeType: "up",
    lastRunDate: "1 May, 2026",
  },
  {
    id: "store-4",
    rank: 3,
    name: "Demo Store 4",
    code: "demo-store-4",
    address: "JMD Regent Arcade, 4th floor, MG Road, Noida, 201301, Uttar Pradesh, IN",
    keywordCount: 5,
    avgRank: "16",
    rankChange: "30.1",
    changeType: "down",
    lastRunDate: "1 May, 2026",
  },
  {
    id: "store-5",
    rank: 4,
    name: "Demo Store 5",
    code: "demo-store-5",
    address: "JMD Regent Arcade, 4th floor, MG Road, Bhopal, 462001, Madhya Pradesh, IN",
    keywordCount: 5,
    avgRank: "10",
    rankChange: "4.9",
    changeType: "up",
    lastRunDate: "1 May, 2026",
  },
  {
    id: "store-6",
    rank: 5,
    name: "Demo Store 6",
    code: "demo-store-6",
    address: "JMD Regent Arcade, 4th floor, MG Road, Nashik, 422002, Maharashtra, IN",
    keywordCount: 5,
    avgRank: "10",
    rankChange: "14.1",
    changeType: "up",
    lastRunDate: "1 May, 2026",
  },
  {
    id: "store-7",
    rank: 6,
    name: "Demo Store 7",
    code: "demo-store-7",
    address: "JMD Regent Arcade, 4th floor, MG Road, Guwahati, 781002, Assam, IN",
    keywordCount: 5,
    avgRank: "20+",
    rankChange: "0",
    changeType: "neutral",
    lastRunDate: "1 May, 2026",
  },
  {
    id: "store-8",
    rank: 7,
    name: "Demo Store 8",
    code: "demo-store-8",
    address: "JMD Regent Arcade, 4th floor, MG Road, East Delhi, 110092, Delhi, IN",
    keywordCount: 5,
    avgRank: "15",
    rankChange: "40.6",
    changeType: "up",
    lastRunDate: "1 May, 2026",
  },
  {
    id: "store-9",
    rank: 8,
    name: "Demo Store 9",
    code: "demo-store-9",
    address: "JMD Regent Arcade, 4th floor, MG Road, Thane, 400601, Maharashtra, IN",
    keywordCount: 5,
    avgRank: "17",
    rankChange: "22.3",
    changeType: "up",
    lastRunDate: "1 May, 2026",
  },
  {
    id: "store-10",
    rank: 9,
    name: "Demo Store 10",
    code: "demo-store-10",
    address: "JMD Regent Arcade, 4th floor, MG Road, Kashipur, 244713, Uttarakhand, IN",
    keywordCount: 5,
    avgRank: "7",
    rankChange: "19.4",
    changeType: "up",
    lastRunDate: "1 May, 2026",
  },
  {
    id: "store-11",
    rank: 10,
    name: "Demo Store 11",
    code: "demo-store-11",
    address: "JMD Regent Arcade, 4th floor, MG Road, Rajkot, 360001, Gujarat, IN",
    keywordCount: 5,
    avgRank: "13",
    rankChange: "17.7",
    changeType: "up",
    lastRunDate: "1 May, 2026",
  },
  {
    id: "store-12",
    rank: 11,
    name: "Demo Store 12",
    code: "demo-store-12",
    address: "JMD Regent Arcade, 4th floor, MG Road, Bhopal, 462001, Madhya Pradesh, IN",
    keywordCount: 5,
    avgRank: "16",
    rankChange: "12.5",
    changeType: "up",
    lastRunDate: "1 May, 2026",
  },
  {
    id: "store-13",
    rank: 12,
    name: "Demo Store 13",
    code: "demo-store-13",
    address: "JMD Regent Arcade, 4th floor, MG Road, Kanpur, 208001, Uttar Pradesh, IN",
    keywordCount: 5,
    avgRank: "1",
    rankChange: "0",
    changeType: "up",
    lastRunDate: "1 May, 2026",
  },
];

export const KEYWORD_TIMESERIES_DATA: KeywordTimeseriesItem[] = [
  { keyword: "footwear shop near me", apr01Rank: "4", may01Rank: "4", status: "improved" },
  { keyword: "ladies shoes", apr01Rank: "10", may01Rank: "11", status: "declined" },
  { keyword: "men shoes", apr01Rank: "4", may01Rank: "4", status: "constant" },
  { keyword: "shoe shop near me", apr01Rank: "2", may01Rank: "3", status: "declined" },
  { keyword: "sports shoes", apr01Rank: "18", may01Rank: "18", status: "constant" },
];

export const COMPETITOR_MATRIX_DATA: CompetitorMatrixBrand[] = [
  {
    brandName: "Demo Store 3",
    isSelf: true,
    keywords: {
      "footwear shop near me": { avgRank: "-", trajectory: "Not on list" },
      "ladies shoes": { avgRank: "-", trajectory: "Not on list" },
      "men shoes": { avgRank: "-", trajectory: "Not on list" },
      "shoe shop near me": { avgRank: "-", trajectory: "Not on list" },
      "sports shoes": { avgRank: "-", trajectory: "Not on list" },
    },
  },
  {
    brandName: "Bata",
    keywords: {
      "footwear shop near me": { avgRank: "4.5 (370 reviews)", trajectory: "Dropped Off" },
      "ladies shoes": { avgRank: "-", trajectory: "Not on list" },
      "men shoes": { avgRank: "20.0", trajectory: "Declined" },
      "shoe shop near me": { avgRank: "8.0", trajectory: "Declined" },
      "sports shoes": { avgRank: "-", trajectory: "Not on list" },
    },
  },
  {
    brandName: "Comet",
    keywords: {
      "footwear shop near me": { avgRank: "-", trajectory: "Not on list" },
      "ladies shoes": { avgRank: "-", trajectory: "Not on list" },
      "men shoes": { avgRank: "-", trajectory: "Not on list" },
      "shoe shop near me": { avgRank: "-", trajectory: "Not on list" },
      "sports shoes": { avgRank: "-", trajectory: "Not on list" },
    },
  },
  {
    brandName: "Red Tape",
    keywords: {
      "footwear shop near me": { avgRank: "-", trajectory: "Not on list" },
      "ladies shoes": { avgRank: "-", trajectory: "Not on list" },
      "men shoes": { avgRank: "-", trajectory: "Not on list" },
      "shoe shop near me": { avgRank: "-", trajectory: "Not on list" },
      "sports shoes": { avgRank: "-", trajectory: "Not on list" },
    },
  },
];

export const TOP_COMPETITORS_ON_KEYWORDS: TopCompetitorCard[] = [
  {
    keyword: "footwear shop near me",
    competitors: [
      { brand: "Trends Footwear", reviewsCount: "4.5 (952 reviews)", avgRank: "1.0", trajectory: "Constant", trajectoryType: "neutral" },
      { brand: "Trends Footwear", reviewsCount: "4.0 (952 reviews)", avgRank: "1.5", trajectory: "Declined", trajectoryType: "down" },
      { brand: "MIR SHOE LOVERS", reviewsCount: "4.0 (485 reviews)", avgRank: "2.5", trajectory: "New", trajectoryType: "new" },
    ],
  },
  {
    keyword: "ladies shoes",
    competitors: [
      { brand: "Trends Footwear", reviewsCount: "4.0 (952 reviews)", avgRank: "1.0", trajectory: "Constant", trajectoryType: "neutral" },
      { brand: "Mir Shoe Lovers 2.0", reviewsCount: "4.0 (45 reviews)", avgRank: "2.0", trajectory: "New", trajectoryType: "new" },
      { brand: "MIR SHOE LOVERS", reviewsCount: "4.0 (485 reviews)", avgRank: "3.5", trajectory: "New", trajectoryType: "new" },
    ],
  },
  {
    keyword: "men shoes",
    competitors: [
      { brand: "Mir Shoe Lovers 2.0", reviewsCount: "4.0 (45 reviews)", avgRank: "1.5", trajectory: "New", trajectoryType: "new" },
      { brand: "Mir Shoe Lovers", reviewsCount: "4.0 (485 reviews)", avgRank: "2.5", trajectory: "Declined", trajectoryType: "down" },
      { brand: "MIR SHOE LOVERS", reviewsCount: "4.0 (485 reviews)", avgRank: "3.0", trajectory: "New", trajectoryType: "new" },
    ],
  },
  {
    keyword: "shoe shop near me",
    competitors: [
      { brand: "Mir Shoe Lovers", reviewsCount: "4.0 (485 reviews)", avgRank: "1.0", trajectory: "Improved", trajectoryType: "up" },
      { brand: "MIR SHOE LOVERS", reviewsCount: "4.0 (485 reviews)", avgRank: "1.0", trajectory: "New", trajectoryType: "new" },
      { brand: "Campus Exclusive Store", reviewsCount: "4.4 (530 reviews)", avgRank: "2.5", trajectory: "Improved", trajectoryType: "up" },
    ],
  },
  {
    keyword: "sports shoes",
    competitors: [
      { brand: "SPORTS LOVERS", reviewsCount: "4.1 (157 reviews)", avgRank: "1.0", trajectory: "Constant", trajectoryType: "neutral" },
      { brand: "Sports MART", reviewsCount: "4.7 (35 reviews)", avgRank: "2.1", trajectory: "Constant", trajectoryType: "neutral" },
      { brand: "adidas Outlet", reviewsCount: "4.1 (109 reviews)", avgRank: "4.3", trajectory: "Declined", trajectoryType: "down" },
    ],
  },
];
