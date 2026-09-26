import { useState } from "react";
import {
  ArrowLeft,
  Building2,
  Calendar as CalendarIcon,
  Check,
  CheckCircle2,
  ChevronRight,
  Download,
  ExternalLink,
  Globe,
  MapPin,
  Phone,
  QrCode,
  RefreshCw,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Tag,
  TrendingDown,
  TrendingUp,
  UserCheck,
  X,
} from "lucide-react";
import { GoogleGIcon } from "@/components/ui/google-g-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface BusinessProfileDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  location?: any;
}

export function BusinessProfileDetailModal({
  open,
  onOpenChange,
  location,
}: BusinessProfileDetailProps) {
  const [activeTab, setActiveTab] = useState("listing-details");
  const [dateRange, setDateRange] = useState("01 Apr 2026 - 17 Sep 2026");
  const [isSyncing, setIsSyncing] = useState(false);

  const loc = location || {
    name: "Demo Store 127",
    storeCode: "demo-store-127",
    address: "JMD Regent Arcade, 4th floor, MG Road, Mumbai, 400050, Maharashtra, IN",
    phone: "+91-8368761913",
    website: "https://global360.com/",
    lat: "28.479716",
    lng: "77.0885703",
    visibilityScore: "100%",
    avgRank: "13",
    totalKeywords: "5",
    completionScore: "100%",
    managerName: "Pushkar Rana",
    managerPhone: "+918368999766",
    managerEmail: "pushkar.rana@global360.com",
  };

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      toast.success(`Successfully synced ${loc.name} with connected platforms`);
    }, 1200);
  };

  const handleDownloadQR = () => {
    toast.success("Downloading QR Code for Review...");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-[95vw] max-h-[92vh] overflow-y-auto p-0 bg-[#121214] border-[#27272a] text-foreground shadow-2xl rounded-xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Business Profile - {loc.name}</DialogTitle>
        </DialogHeader>

        {/* Modal Top Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-3 border-b border-[#27272a] bg-[#121214]/95 backdrop-blur">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="cursor-pointer hover:text-foreground">Business Profiles</span>
            <ChevronRight className="size-3" />
            <span className="font-semibold text-foreground">Business Profile Details</span>
          </div>

          {/* Right Header Actions matching Screenshot 1 */}
          <div className="flex items-center gap-3">
            {/* Date Range Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded border border-[#27272a] bg-[#18181b] text-xs text-muted-foreground">
              <span className="text-[10px] text-muted-foreground uppercase font-bold mr-1">Date Range:</span>
              <CalendarIcon className="size-3 text-blue-500" />
              <span className="font-medium text-foreground tnum">{dateRange}</span>
            </div>

            {/* Sync Now Button */}
            <Button
              size="sm"
              onClick={handleSync}
              disabled={isSyncing}
              className="h-8 bg-blue-500 hover:bg-blue-600 text-black font-semibold text-xs gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`size-3.5 ${isSyncing ? "animate-spin" : ""}`} />
              <span>Sync Now</span>
            </Button>

            {/* Back Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 border-[#3f3f46] bg-[#18181b] hover:bg-[#27272a] text-foreground text-xs gap-1 cursor-pointer"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back</span>
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Main Title Header matching Screenshot 1 */}
          <h1 className="text-xl font-bold text-foreground tracking-tight">
            Business Profile - {loc.name}
          </h1>

          {/* Top Profile Summary Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 rounded-xl border border-[#27272a] bg-[#18181b]">
            {/* Left Image Placeholder */}
            <div className="lg:col-span-3 rounded-lg border border-[#27272a] bg-[#121214] flex flex-col items-center justify-center min-h-[150px] p-4 text-center">
              <Building2 className="size-12 text-muted-foreground/40 mb-2" />
              <span className="text-xs text-muted-foreground font-medium">No Image Uploaded</span>
            </div>

            {/* Middle Info Details */}
            <div className="lg:col-span-6 space-y-2 py-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-foreground">{loc.name}</h2>
                <Badge className="bg-emerald-950/80 text-emerald-400 border-emerald-800/80 text-[10px] font-semibold gap-1">
                  <GoogleGIcon className="size-3" />
                  Google: Synced
                </Badge>
                <Badge variant="outline" className="text-muted-foreground border-[#3f3f46] text-[10px]">
                  Facebook: Not connected
                </Badge>
              </div>

              <div className="space-y-1 text-xs text-muted-foreground">
                <p className="flex items-start gap-1.5">
                  <MapPin className="size-3.5 text-blue-500 shrink-0 mt-0.5" />
                  <span>{loc.address}</span>
                </p>
                <p className="pl-5 text-[11px] font-mono text-muted-foreground/80">
                  {loc.lat}, {loc.lng}
                </p>
                <a
                  href={`https://maps.google.com/?q=${loc.lat},${loc.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="pl-5 inline-flex items-center gap-1 text-[11px] font-semibold text-blue-500 hover:underline cursor-pointer"
                >
                  <ExternalLink className="size-3" />
                  View on Map
                </a>
              </div>

              <div className="flex flex-wrap gap-4 pt-1 text-xs">
                <span className="flex items-center gap-1.5 text-foreground font-medium">
                  <Phone className="size-3.5 text-blue-500" />
                  {loc.phone}
                </span>
                <a
                  href={loc.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-blue-500 hover:underline font-medium cursor-pointer"
                >
                  <Globe className="size-3.5" />
                  {loc.website}
                </a>
              </div>
            </div>

            {/* Right QR Code Box matching Screenshot 1 */}
            <div className="lg:col-span-3 rounded-lg border border-[#27272a] bg-[#121214] p-3 flex flex-col items-center justify-between text-center space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                Scan for Review
              </span>
              <div className="size-20 bg-white p-1.5 rounded flex items-center justify-center">
                {/* SVG QR Code Simulation */}
                <QrCode className="size-full text-black" />
              </div>
              <div className="flex gap-2 w-full pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadQR}
                  className="flex-1 h-7 text-[10px] border-[#3f3f46] bg-[#18181b] hover:bg-[#27272a] text-foreground cursor-pointer gap-1"
                >
                  <Download className="size-3 text-blue-500" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.info(`Review link: ${loc.website}review`)}
                  className="flex-1 h-7 text-[10px] border-[#3f3f46] bg-[#18181b] hover:bg-[#27272a] text-foreground cursor-pointer gap-1"
                >
                  <ExternalLink className="size-3 text-blue-500" />
                  Open Link
                </Button>
              </div>
            </div>
          </div>

          {/* 4 KPI Score Cards Row matching Screenshot 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Visibility Score */}
            <div className="p-4 rounded-xl border border-[#27272a] bg-[#18181b] space-y-2">
              <div className="flex items-center justify-between text-xs text-blue-500 font-semibold">
                <span className="flex items-center gap-1">
                  <Search className="size-3.5" /> Visibility Score
                </span>
              </div>
              <p className="text-3xl font-extrabold text-foreground tnum">{loc.visibilityScore}</p>
              <p className="text-[10px] text-muted-foreground">Last Run 01 May, 26</p>
            </div>

            {/* Average Ranking */}
            <div className="p-4 rounded-xl border border-[#27272a] bg-[#18181b] space-y-2">
              <div className="flex items-center justify-between text-xs text-blue-500 font-semibold">
                <span className="flex items-center gap-1">
                  <TrendingDown className="size-3.5 text-red-400" /> Average Ranking
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-extrabold text-foreground tnum">{loc.avgRank}</p>
                <span className="text-[10px] text-red-400 font-medium">↓ 0.0999999999999993</span>
              </div>
              <p className="text-[10px] text-muted-foreground">Last Run 01 May, 26</p>
            </div>

            {/* Total Keywords */}
            <div className="p-4 rounded-xl border border-[#27272a] bg-[#18181b] space-y-2">
              <div className="flex items-center justify-between text-xs text-blue-500 font-semibold">
                <span className="flex items-center gap-1">
                  <Tag className="size-3.5" /> Total Keyword(s)
                </span>
              </div>
              <p className="text-3xl font-extrabold text-foreground tnum">{loc.totalKeywords}</p>
              <p className="text-[10px] text-muted-foreground">Last Run 01 May, 26</p>
            </div>

            {/* Completion Score */}
            <div className="p-4 rounded-xl border border-[#27272a] bg-[#18181b] space-y-2">
              <div className="flex items-center justify-between text-xs text-blue-500 font-semibold">
                <span className="flex items-center gap-1">
                  <UserCheck className="size-3.5" /> Completion Score
                </span>
              </div>
              <p className="text-3xl font-extrabold text-foreground tnum">{loc.completionScore}</p>
              <p className="text-[10px] text-muted-foreground">All sections complete</p>
            </div>
          </div>

          {/* Sub Navigation Tabs matching Screenshot 1 */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-[#18181b] border-b border-[#27272a] w-full justify-start rounded-none h-11 p-0 gap-6">
              {["Listing Details", "Keywords", "Performance", "Reviews"].map((tab) => {
                const tabId = tab.toLowerCase().replace(" ", "-");
                return (
                  <TabsTrigger
                    key={tabId}
                    value={tabId}
                    className="data-[state=active]:bg-transparent data-[state=active]:text-blue-500 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none text-xs font-semibold text-muted-foreground hover:text-foreground h-full px-2 cursor-pointer transition-all"
                  >
                    {tab}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {/* Listing Details Tab */}
            <TabsContent value="listing-details" className="mt-4 space-y-6">
              {/* NAP Consistency Status Box */}
              <div className="rounded-xl border border-[#27272a] bg-[#18181b] p-4 space-y-3">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider text-muted-foreground">
                  NAP Consistency Status
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] uppercase text-muted-foreground block font-semibold">Name</span>
                    <span className="font-bold text-foreground">{loc.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-muted-foreground block font-semibold">Address</span>
                    <span className="text-foreground">{loc.address}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-muted-foreground block font-semibold">Phone</span>
                    <span className="font-medium text-foreground tnum">{loc.phone}</span>
                  </div>
                </div>
              </div>

              {/* Basic Info & Address Grid */}
              <div className="rounded-xl border border-[#27272a] bg-[#18181b] p-5 space-y-4">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider text-muted-foreground border-b border-[#27272a] pb-2">
                  Basic Info & Address
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6 text-xs">
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Business Name</span>
                    <span className="font-semibold text-foreground">{loc.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Store Code</span>
                    <span className="font-mono text-muted-foreground">{loc.storeCode}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Opening Date</span>
                    <span className="text-muted-foreground">N/A</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Business Status</span>
                    <span className="text-emerald-400 font-semibold">Open</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Address line 1</span>
                    <span className="text-foreground">JMD Regent Arcade</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Address line 2</span>
                    <span className="text-foreground">4th floor</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Address line 3</span>
                    <span className="text-foreground">MG Road</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Address line 4</span>
                    <span className="text-muted-foreground">N/A</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Sub-locality</span>
                    <span className="text-muted-foreground">N/A</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Locality</span>
                    <span className="text-foreground">Mumbai</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Pincode</span>
                    <span className="font-mono text-foreground">400050</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Administrative Area</span>
                    <span className="text-foreground">Maharashtra</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Country</span>
                    <span className="text-foreground">IN</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Latitude / Longitude</span>
                    <span className="font-mono text-muted-foreground">{loc.lat}, {loc.lng}</span>
                  </div>
                </div>
              </div>

              {/* Contact & URL + Store Manager matching Screenshot 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Contact & URL */}
                <div className="rounded-xl border border-[#27272a] bg-[#18181b] p-5 space-y-3">
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider text-muted-foreground border-b border-[#27272a] pb-2">
                    Contact & URL
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Primary Phone Number</span>
                      <span className="font-semibold text-foreground tnum">{loc.phone}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Website URL</span>
                      <a href={loc.website} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline font-medium cursor-pointer">
                        {loc.website}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Store Manager */}
                <div className="rounded-xl border border-[#27272a] bg-[#18181b] p-5 space-y-3">
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider text-muted-foreground border-b border-[#27272a] pb-2">
                    Store Manager
                  </h3>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Name</span>
                      <span className="font-semibold text-foreground">{loc.managerName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Contact No.</span>
                      <span className="font-medium text-blue-500 tnum">{loc.managerPhone}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Email</span>
                      <span className="font-medium text-blue-500 truncate block">{loc.managerEmail}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Categories, Description & Tags */}
              <div className="rounded-xl border border-[#27272a] bg-[#18181b] p-5 space-y-3">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider text-muted-foreground border-b border-[#27272a] pb-2">
                  Categories, Description & Tags
                </h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Primary Category</span>
                    <span className="font-bold text-foreground">Shoe Shop</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium mb-1">Additional Categories</span>
                    <div className="flex gap-2">
                      <Badge className="bg-[#27272a] text-foreground text-[10px]">Shop</Badge>
                      <Badge className="bg-[#27272a] text-foreground text-[10px]">Sportswear Shop</Badge>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Business Description (short)</span>
                    <p className="text-muted-foreground">Demo location for evaluation purposes.</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Business Description (long)</span>
                    <p className="text-muted-foreground">This is a demo location created for staging and evaluation purposes. All details shown here are representative of the platform capabilities.</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium mb-1">Tags</span>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/40 text-[10px]">Test</Badge>
                  </div>
                </div>
              </div>

              {/* Services, Payments & Attributes matching Screenshot 2 */}
              <div className="rounded-xl border border-[#27272a] bg-[#18181b] p-5 space-y-4">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider text-muted-foreground border-b border-[#27272a] pb-2">
                  Services & Attributes
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[10px] text-muted-foreground block uppercase font-bold mb-1.5">Service Options</span>
                    <div className="flex flex-wrap gap-2">
                      {["Delivery", "In-store pickup", "Onsite services", "In-store shopping"].map((s) => (
                        <Badge key={s} className="bg-blue-500/20 text-blue-400 border border-blue-500/40 text-[10px] px-2 py-0.5">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-muted-foreground block uppercase font-bold mb-1.5">Payments</span>
                    <div className="flex flex-wrap gap-2">
                      {["Debit cards", "NFC mobile payments", "Credit cards", "Cash only", "Diners Club", "JCB", "VISA", "Discover", "MasterCard"].map((p) => (
                        <Badge key={p} className="bg-blue-500/20 text-blue-400 border border-blue-500/40 text-[10px] px-2 py-0.5">
                          {p}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-muted-foreground block uppercase font-bold mb-1.5">Offerings</span>
                    <div className="flex flex-wrap gap-2">
                      {["Men's shoes", "Women's shoes", "Kids' shoes"].map((o) => (
                        <Badge key={o} className="bg-blue-500/20 text-blue-400 border border-blue-500/40 text-[10px] px-2 py-0.5">
                          {o}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Other Tabs Placeholders */}
            <TabsContent value="keywords" className="mt-4 p-8 text-center border border-[#27272a] rounded-xl bg-[#18181b]">
              <Tag className="size-8 text-blue-500 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-foreground">Keywords Performance</h4>
              <p className="text-xs text-muted-foreground mt-1">5 active keywords tracked for {loc.name}.</p>
            </TabsContent>

            <TabsContent value="performance" className="mt-4 p-8 text-center border border-[#27272a] rounded-xl bg-[#18181b]">
              <TrendingUp className="size-8 text-blue-500 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-foreground">Performance Analytics</h4>
              <p className="text-xs text-muted-foreground mt-1">Monthly search impressions and customer action trends.</p>
            </TabsContent>

            <TabsContent value="reviews" className="mt-4 p-8 text-center border border-[#27272a] rounded-xl bg-[#18181b]">
              <Star className="size-8 text-blue-500 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-foreground">Customer Reviews Log</h4>
              <p className="text-xs text-muted-foreground mt-1">Review feed and automated response status.</p>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
