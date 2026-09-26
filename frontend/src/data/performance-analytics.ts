export interface PerformanceTotals {
  totalImpressions: number;
  mobileImpressions: number;
  desktopImpressions: number;
  totalActions: number;
  searchImpressions: number;
  mapsImpressions: number;
  websiteClicks: number;
  callClicks: number;
  directionRequests: number;
}

export interface StoreInsightItem {
  id: number;
  storeName: string;
  address: string;
  storeCode: string;
  desktopSearch: number;
  mobileSearch: number;
  desktopMaps: number;
  mobileMaps: number;
  websiteClicks: number;
  callClicks: number;
  directionRequests: number;
  city?: string;
  state?: string;
  tags?: string;
  status?: string;
}

export const PERFORMANCE_OVERVIEW_TOTALS: PerformanceTotals = {
  totalImpressions: 383400,
  mobileImpressions: 355700,
  desktopImpressions: 27700,
  totalActions: 21600,
  searchImpressions: 262600,
  mapsImpressions: 120900,
  websiteClicks: 4800,
  callClicks: 12300,
  directionRequests: 4500,
};

export const IMPRESSIONS_DONUT_DATA = [
  { name: "Desktop Impressions", value: 27700, fill: "#3b82f6" },
  { name: "Mobile Impressions", value: 355700, fill: "#10b981" },
];

export const SEARCH_DONUT_DATA = [
  { name: "Desktop Search", value: 48200, fill: "#eab308" },
  { name: "Mobile Search", value: 214400, fill: "#3b82f6" },
];

export const MAPS_DONUT_DATA = [
  { name: "Desktop Maps", value: 18500, fill: "#10b981" },
  { name: "Mobile Maps", value: 102400, fill: "#ef4444" },
];

export const CUSTOMER_ACTIONS_DONUT_DATA = [
  { name: "Call Clicks", value: 12300, fill: "#facc15" },
  { name: "Website Clicks", value: 4800, fill: "#3b82f6" },
  { name: "Direction Requests", value: 4500, fill: "#a855f7" },
];

export const PERFORMANCE_LINE_SERIES = [
  { date: "Apr 2026", desktopSearch: 25000, mobileSearch: 240000, desktopMaps: 10000, mobileMaps: 118000 },
  { date: "May 2026", desktopSearch: 2000, mobileSearch: 5000, desktopMaps: 1000, mobileMaps: 3000 },
  { date: "Jun 2026", desktopSearch: 1800, mobileSearch: 4200, desktopMaps: 900, mobileMaps: 2500 },
  { date: "Jul 2026", desktopSearch: 2100, mobileSearch: 4800, desktopMaps: 1100, mobileMaps: 2800 },
  { date: "Aug 2026", desktopSearch: 2400, mobileSearch: 5300, desktopMaps: 1200, mobileMaps: 3100 },
  { date: "Sep 2026", desktopSearch: 2700, mobileSearch: 5900, desktopMaps: 1300, mobileMaps: 3400 },
];

export const ACTIONS_LINE_SERIES = [
  { date: "Apr 2026", callClicks: 2700, websiteClicks: 800, directionRequests: 18600 },
  { date: "May 2026", callClicks: 400, websiteClicks: 200, directionRequests: 1200 },
  { date: "Jun 2026", callClicks: 350, websiteClicks: 180, directionRequests: 1000 },
  { date: "Jul 2026", callClicks: 380, websiteClicks: 190, directionRequests: 1100 },
  { date: "Aug 2026", callClicks: 420, websiteClicks: 210, directionRequests: 1250 },
  { date: "Sep 2026", callClicks: 450, websiteClicks: 230, directionRequests: 1350 },
];

export const TOP_10_STATES_IMPRESSIONS = [
  { name: "Maharashtra", value: 84500 },
  { name: "Uttar Pradesh", value: 72100 },
  { name: "Gujarat", value: 64200 },
  { name: "Delhi", value: 51000 },
  { name: "Karnataka", value: 42300 },
  { name: "Rajasthan", value: 31200 },
  { name: "Tamil Nadu", value: 24500 },
  { name: "Telangana", value: 18900 },
  { name: "West Bengal", value: 14200 },
  { name: "Madhya Pradesh", value: 11500 },
];

export const TOP_10_CITIES_IMPRESSIONS = [
  { name: "Mumbai", value: 52100 },
  { name: "Delhi NCR", value: 48900 },
  { name: "Ahmedabad", value: 41200 },
  { name: "Pune", value: 32400 },
  { name: "Bengaluru", value: 29800 },
  { name: "Jaipur", value: 22100 },
  { name: "Hyderabad", value: 17800 },
  { name: "Lucknow", value: 14500 },
  { name: "Chennai", value: 12400 },
  { name: "Kolkata", value: 9800 },
];

export const TOP_10_LOCATIONS_IMPRESSIONS = [
  { name: "Demo Store 371 (Unnao)", value: 28400 },
  { name: "Demo Store 312 (Bikaner)", value: 24100 },
  { name: "Demo Store 304 (Nashik)", value: 21500 },
  { name: "Demo Store 42 (East Delhi)", value: 19200 },
  { name: "Demo Store 197 (Aurangabad)", value: 16800 },
  { name: "Demo Store 242 (Mumbai)", value: 14500 },
  { name: "Demo Store 70 (Pune)", value: 12100 },
  { name: "Demo Store 298 (West Delhi)", value: 10400 },
  { name: "Demo Store 180 (Kadi)", value: 8900 },
  { name: "Demo Store 140 (Morbi)", value: 7200 },
];

export const TOP_10_STATES_ACTIONS = [
  { name: "Maharashtra", value: 5400 },
  { name: "Uttar Pradesh", value: 4800 },
  { name: "Gujarat", value: 3900 },
  { name: "Delhi", value: 2900 },
  { name: "Karnataka", value: 2100 },
  { name: "Rajasthan", value: 1600 },
  { name: "Tamil Nadu", value: 1200 },
  { name: "Telangana", value: 950 },
  { name: "West Bengal", value: 720 },
  { name: "Madhya Pradesh", value: 550 },
];

export const TOP_10_CITIES_ACTIONS = [
  { name: "Mumbai", value: 3200 },
  { name: "Delhi NCR", value: 2800 },
  { name: "Ahmedabad", value: 2400 },
  { name: "Pune", value: 1900 },
  { name: "Bengaluru", value: 1600 },
  { name: "Jaipur", value: 1200 },
  { name: "Hyderabad", value: 920 },
  { name: "Lucknow", value: 780 },
  { name: "Chennai", value: 610 },
  { name: "Kolkata", value: 490 },
];

export const TOP_10_LOCATIONS_ACTIONS = [
  { name: "Demo Store 371 (Unnao)", value: 1850 },
  { name: "Demo Store 312 (Bikaner)", value: 1540 },
  { name: "Demo Store 304 (Nashik)", value: 1320 },
  { name: "Demo Store 42 (East Delhi)", value: 1180 },
  { name: "Demo Store 197 (Aurangabad)", value: 980 },
  { name: "Demo Store 242 (Mumbai)", value: 860 },
  { name: "Demo Store 70 (Pune)", value: 740 },
  { name: "Demo Store 298 (West Delhi)", value: 620 },
  { name: "Demo Store 180 (Kadi)", value: 510 },
  { name: "Demo Store 140 (Morbi)", value: 420 },
];

export const STATE_DESKTOP_BAR_DATA = [
  { state: "Maharashtra", searchImpressions: 48000, mapsImpressions: 22000 },
  { state: "Uttar Pradesh", searchImpressions: 42000, mapsImpressions: 19000 },
  { state: "Gujarat", searchImpressions: 36000, mapsImpressions: 16000 },
  { state: "Delhi", searchImpressions: 29000, mapsImpressions: 14000 },
  { state: "Karnataka", searchImpressions: 24000, mapsImpressions: 11000 },
];

// State Performance Stacked Bar Chart Dataset matching Screenshot 1
export const STATE_PERFORMANCE_STACKED_BAR_DATA = [
  { state: "Andhra Pradesh", desktopSearch: 300, mobileSearch: 1200, desktopMaps: 150, mobileMaps: 450 },
  { state: "Bihar", desktopSearch: 1400, mobileSearch: 21000, desktopMaps: 600, mobileMaps: 9200 },
  { state: "Chhattisgarh", desktopSearch: 800, mobileSearch: 6200, desktopMaps: 300, mobileMaps: 1900 },
  { state: "Delhi", desktopSearch: 3200, mobileSearch: 24000, desktopMaps: 1400, mobileMaps: 11500 },
  { state: "Gujarat", desktopSearch: 4500, mobileSearch: 29500, desktopMaps: 2100, mobileMaps: 23000 },
  { state: "Haryana", desktopSearch: 950, mobileSearch: 8200, desktopMaps: 450, mobileMaps: 2100 },
  { state: "Jammu and Kashmir", desktopSearch: 200, mobileSearch: 1500, desktopMaps: 80, mobileMaps: 400 },
  { state: "Jharkhand", desktopSearch: 650, mobileSearch: 5800, desktopMaps: 250, mobileMaps: 1600 },
  { state: "Karnataka", desktopSearch: 1800, mobileSearch: 14200, desktopMaps: 850, mobileMaps: 5800 },
  { state: "Madhya Pradesh", desktopSearch: 2100, mobileSearch: 15400, desktopMaps: 920, mobileMaps: 5100 },
  { state: "Maharashtra", desktopSearch: 6200, mobileSearch: 43500, desktopMaps: 3100, mobileMaps: 15200 },
  { state: "Odisha", desktopSearch: 720, mobileSearch: 4800, desktopMaps: 310, mobileMaps: 1400 },
  { state: "Punjab", desktopSearch: 890, mobileSearch: 5600, desktopMaps: 380, mobileMaps: 1800 },
  { state: "Rajasthan", desktopSearch: 2400, mobileSearch: 17800, desktopMaps: 1100, mobileMaps: 7200 },
  { state: "Uttarakhand", desktopSearch: 510, mobileSearch: 4900, desktopMaps: 220, mobileMaps: 1500 },
  { state: "West Bengal", desktopSearch: 780, mobileSearch: 6200, desktopMaps: 340, mobileMaps: 1900 },
];

export const STATE_ACTIONS_STACKED_BAR_DATA = [
  { state: "Andhra Pradesh", websiteClicks: 40, callClicks: 120, directionRequests: 320 },
  { state: "Bihar", websiteClicks: 180, callClicks: 1250, directionRequests: 3400 },
  { state: "Chhattisgarh", websiteClicks: 90, callClicks: 320, directionRequests: 890 },
  { state: "Delhi", websiteClicks: 410, callClicks: 1850, directionRequests: 5200 },
  { state: "Gujarat", websiteClicks: 720, callClicks: 3900, directionRequests: 9800 },
  { state: "Haryana", websiteClicks: 140, callClicks: 820, directionRequests: 2100 },
  { state: "Jammu and Kashmir", websiteClicks: 20, callClicks: 90, directionRequests: 250 },
  { state: "Jharkhand", websiteClicks: 80, callClicks: 380, directionRequests: 920 },
  { state: "Karnataka", websiteClicks: 210, callClicks: 1120, directionRequests: 2800 },
  { state: "Madhya Pradesh", websiteClicks: 190, callClicks: 980, directionRequests: 2600 },
  { state: "Maharashtra", websiteClicks: 650, callClicks: 3400, directionRequests: 8900 },
  { state: "Odisha", websiteClicks: 60, callClicks: 240, directionRequests: 620 },
  { state: "Punjab", websiteClicks: 75, callClicks: 310, directionRequests: 810 },
  { state: "Rajasthan", websiteClicks: 260, callClicks: 1450, directionRequests: 3900 },
  { state: "Uttarakhand", websiteClicks: 50, callClicks: 210, directionRequests: 580 },
  { state: "West Bengal", websiteClicks: 85, callClicks: 410, directionRequests: 1100 },
];

export const METRICS_BAR_DATA = [
  { metric: "Desktop Search", value: 48200, fill: "#eab308" },
  { metric: "Mobile Search", value: 214400, fill: "#eab308" },
  { metric: "Desktop Maps", value: 18500, fill: "#10b981" },
  { metric: "Mobile Maps", value: 102400, fill: "#ef4444" },
  { metric: "Website Clicks", value: 4800, fill: "#3b82f6" },
  { metric: "Call Clicks", value: 12300, fill: "#facc15" },
  { metric: "Direction Requests", value: 4500, fill: "#10b981" },
];

export const WEEKDAY_ANALYSIS_DATA = [
  { weekday: "Sunday", totalActions: 3450, changePct: "+12.4%", websiteClicks: 720, callClicks: 1980, directionRequests: 750 },
  { weekday: "Monday", totalActions: 2890, changePct: "-4.2%", websiteClicks: 610, callClicks: 1620, directionRequests: 660 },
  { weekday: "Tuesday", totalActions: 3120, changePct: "+2.8%", websiteClicks: 680, callClicks: 1750, directionRequests: 690 },
  { weekday: "Wednesday", totalActions: 3280, changePct: "+5.1%", websiteClicks: 710, callClicks: 1840, directionRequests: 730 },
  { weekday: "Thursday", totalActions: 3050, changePct: "-1.5%", websiteClicks: 650, callClicks: 1710, directionRequests: 690 },
  { weekday: "Friday", totalActions: 3620, changePct: "+15.8%", websiteClicks: 810, callClicks: 2040, directionRequests: 770 },
  { weekday: "Saturday", totalActions: 3950, changePct: "+18.9%", websiteClicks: 910, callClicks: 2210, directionRequests: 830 },
];

const CITIES = ["Gurgaon", "Rohtak", "Nagpur", "Ahmedabad", "Bangalore", "Prayagraj", "Patna", "Taloja", "Noida", "Deoghar", "Mumbai", "Pune", "Bikaner", "Unnao", "Kashipur", "Nashik", "Rajkot"];
const STATES = ["Haryana", "Maharashtra", "Gujarat", "Karnataka", "Uttar Pradesh", "Bihar", "Jharkhand", "Rajasthan", "Uttarakhand"];

export const INSIGHTS_STORE_LIST: StoreInsightItem[] = Array.from({ length: 48 }, (_, i) => {
  const id = i + 1;
  const city = CITIES[i % CITIES.length];
  const state = STATES[i % STATES.length];
  const base = (i + 1) * 23 + 40;
  return {
    id,
    storeName: `Demo Store ${id}`,
    address: `JMD Regent Arcade, 4th floor, MG Road, ${city}, ${100000 + i * 123}, ${state}, IN`,
    storeCode: `demo-store-${id}`,
    desktopSearch: Math.round(base * 0.8),
    mobileSearch: Math.round(base * 6.2),
    desktopMaps: Math.round(base * 0.4),
    mobileMaps: Math.round(base * 2.8),
    websiteClicks: Math.round(base * 0.08),
    callClicks: Math.round(base * 0.25),
    directionRequests: Math.round(base * 1.4),
    city,
    state,
    tags: i % 2 === 0 ? "Primary Store" : "Secondary",
    status: "Active",
  };
});

export const STORE_PERFORMANCE_STACKED_BAR_DATA = Array.from({ length: 30 }, (_, i) => {
  const day = (i + 1).toString().padStart(2, "0");
  const base = 8000 + (i % 7) * 400 + Math.sin(i) * 1200;
  return {
    date: `Apr ${day}, 2026`,
    desktopSearch: Math.round(base * 0.12),
    mobileSearch: Math.round(base * 0.62),
    desktopMaps: Math.round(base * 0.06),
    mobileMaps: Math.round(base * 0.20),
  };
});

export const STORE_ACTIONS_STACKED_BAR_DATA = Array.from({ length: 30 }, (_, i) => {
  const day = (i + 1).toString().padStart(2, "0");
  const base = 500 + (i % 5) * 40 + Math.cos(i) * 90;
  return {
    date: `Apr ${day}, 2026`,
    websiteClicks: Math.round(base * 0.22),
    callClicks: Math.round(base * 0.58),
    directionRequests: Math.round(base * 0.20),
  };
});
