import {
  Activity,
  BarChart3,
  Building2,
  CalendarClock,
  Camera,
  CircleHelp,
  FileBarChart,
  Gauge,
  Globe2,
  Grid3x3,
  Images,
  LayoutDashboard,
  ListChecks,
  MapPin,
  MessageSquare,
  Plug,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Star,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  UserCheck,
  Waypoints,
} from "lucide-react";

/**
 * Single source of truth for navigation. `to` values are literal route paths,
 * so TanStack Router type-checks every link at build time.
 */
export const NAV_SECTIONS = [
  {
    id: "main",
    label: "",
    items: [
      { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
      { to: "/locations", label: "Locations", icon: MapPin, badge: "128K" },
      { to: "/reviews/analytics", label: "Reviews", icon: Star },
      { to: "/rankings", label: "Rankings", icon: TrendingUp },
      { to: "/performance", label: "Performance", icon: Gauge },
      { to: "/store-manager", label: "Store Manager", icon: UserCheck },
      { to: "/review-assistant", label: "Review Assistant", icon: Sparkles },
      { to: "/content/posts", label: "Content", icon: Images },
      { to: "/reports", label: "Reports", icon: FileBarChart },
      { to: "/organization", label: "Organization", icon: Building2 },
      { to: "/integrations", label: "Platform", icon: Plug, badge: "2" },
    ],
  },
] as const;

export type NavItem = (typeof NAV_SECTIONS)[number]["items"][number];
export type NavPath = NavItem["to"];

export const MOBILE_NAV = [
  { to: "/", label: "Home", icon: LayoutDashboard },
  { to: "/locations", label: "Locations", icon: MapPin },
  { to: "/reviews", label: "Reviews", icon: MessageSquare },
  { to: "/rankings", label: "Rankings", icon: TrendingUp },
  { to: "/performance", label: "Insights", icon: Gauge },
] as const;

export const PHOTO_ICON = Camera;
