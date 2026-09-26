import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar as CalendarIcon,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  FileText,
  Globe,
  Home,
  ImageIcon,
  MapPin,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
  Upload,
  User,
  X,
  ShoppingCart,
  Utensils,
  Lock,
  Tag,
  Sparkles,
  Eye,
  Pencil,
  CheckCircle2,
  Info,
} from "lucide-react";
import { GoogleGIcon } from "@/components/ui/google-g-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";

// Social Media Icons
function FacebookIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function XIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.77a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
    </svg>
  );
}

function InstagramIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function YouTubeIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function WhatsAppIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}

// Custom Time Picker Popover Component matching screenshot
function CustomTimePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const parts = (value || "10:30").split(":");
  const hours = parseInt(parts[0] || "10", 10);
  const minutes = parseInt(parts[1] || "30", 10);

  const handleHourChange = (delta: number) => {
    const newH = (hours + delta + 24) % 24;
    const hStr = newH.toString().padStart(2, "0");
    const mStr = minutes.toString().padStart(2, "0");
    onChange(`${hStr}:${mStr}`);
  };

  const handleMinuteChange = (delta: number) => {
    const newM = (minutes + delta + 60) % 60;
    const hStr = hours.toString().padStart(2, "0");
    const mStr = newM.toString().padStart(2, "0");
    onChange(`${hStr}:${mStr}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative flex items-center cursor-pointer group">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-8 w-24 bg-white dark:bg-black border-slate-300 dark:border-[#27272a] group-hover:border-blue-500/60 text-xs text-foreground font-mono pr-7 text-center rounded-md"
          />
          <CalendarIcon className="size-3 text-muted-foreground group-hover:text-blue-400 absolute right-2 pointer-events-none" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-32 bg-white dark:bg-[#121214] border-slate-300 dark:border-[#27272a] p-2 text-foreground shadow-2xl rounded-lg">
        <div className="flex items-center justify-center gap-2">
          {/* Hours Column */}
          <div className="flex flex-col items-center gap-0.5">
            <button
              type="button"
              onClick={() => handleHourChange(1)}
              className="p-1 text-muted-foreground hover:text-blue-400 hover:bg-[#27272a] rounded cursor-pointer transition-colors"
            >
              <ChevronUp className="size-3.5" />
            </button>
            <span className="font-mono text-sm font-bold text-foreground py-0.5">
              {hours.toString().padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={() => handleHourChange(-1)}
              className="p-1 text-muted-foreground hover:text-blue-400 hover:bg-[#27272a] rounded cursor-pointer transition-colors"
            >
              <ChevronDown className="size-3.5" />
            </button>
          </div>

          <span className="font-mono text-sm font-bold text-muted-foreground pb-0.5">:</span>

          {/* Minutes Column */}
          <div className="flex flex-col items-center gap-0.5">
            <button
              type="button"
              onClick={() => handleMinuteChange(5)}
              className="p-1 text-muted-foreground hover:text-blue-400 hover:bg-[#27272a] rounded cursor-pointer transition-colors"
            >
              <ChevronUp className="size-3.5" />
            </button>
            <span className="font-mono text-sm font-bold text-foreground py-0.5">
              {minutes.toString().padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={() => handleMinuteChange(-5)}
              className="p-1 text-muted-foreground hover:text-blue-400 hover:bg-[#27272a] rounded cursor-pointer transition-colors"
            >
              <ChevronDown className="size-3.5" />
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface EditProfileViewProps {
  onBack: () => void;
  location?: any;
  mode?: "edit" | "create";
}

export function EditProfileView({
  onBack,
  location,
  mode = "edit",
}: EditProfileViewProps) {
  const isEdit = mode === "edit";
  const [step, setStep] = useState(3);
  const [autoSync, setAutoSync] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    name: isEdit ? (location?.name || "Demo Store 127") : "",
    storeCode: isEdit ? (location?.storeCode || "demo-store-127") : "",
    openingDate: isEdit ? "2024-01-15" : "",
    status: isEdit ? (location?.status || "Open") : "Open",
    shortDesc: isEdit ? "Demo location for evaluation purposes." : "",
    longDesc: isEdit
      ? "This is a demo location created for staging and evaluation purposes. All details shown here are representative of the platform capabilities."
      : "",
    
    address1: isEdit ? "JMD Regent Arcade" : "",
    address2: isEdit ? "4th floor" : "",
    address3: isEdit ? "MG Road" : "",
    address4: isEdit ? "" : "",
    country: isEdit ? "India" : "India",
    postcode: isEdit ? "400050" : "",
    sublocality: isEdit ? "" : "",
    locality: isEdit ? (location?.city || "Mumbai") : "",
    adminArea: isEdit ? (location?.state || "Maharashtra") : "",
    lat: isEdit ? (location?.lat || "28.479716") : "",
    lng: isEdit ? (location?.lng || "77.0885703") : "",
    
    locationGroup: isEdit ? "Demo Account" : "Demo Account",
    primaryCategory: isEdit ? "Shoe Shop" : "",
    
    primaryPhone: isEdit ? (location?.contacts?.[0] || "+91 83687 61913") : "",
    additionalPhone1: isEdit ? "+91 81234 56789" : "",
    additionalPhone2: isEdit ? "+91 98234 56789" : "",
    supportPhone: isEdit ? "+91 92344 56789" : "",
    supportEmail: isEdit ? "support@example.com" : "",
    supportUrl: isEdit ? "https://example.com/support" : "",
    reportingEmail: isEdit ? "pushkar.rana@ennigo.co.uk" : "",
    
    websiteUrl: isEdit ? "https://global360.com/" : "",
    
    menuUrl: isEdit ? "https://example.com/menu" : "",
    orderUrl: isEdit ? "https://example.com/order" : "",
    reservationUrl: isEdit ? "https://example.com/reserve" : "",
    
    facebookUrl: isEdit ? "https://facebook.com/demostore" : "",
    xUrl: isEdit ? "https://x.com/demostore" : "",
    linkedinUrl: isEdit ? "https://linkedin.com/company/demostore" : "",
    instagramUrl: isEdit ? "https://instagram.com/demostore" : "",
    youtubeUrl: isEdit ? "https://youtube.com/@demostore" : "",
    whatsappUrl: isEdit ? "https://wa.me/918368761913" : "",
    pinterestUrl: isEdit ? "https://pinterest.com/demostore" : "",
    placeAnOrderLink: isEdit ? "https://order.example.com" : "",
    inventorySearchUrl: isEdit ? "https://inventory.example.com" : "",
    trackingNumberUrl: isEdit ? "https://track.example.com" : "",
  });

  const [tags, setTags] = useState<string[]>(isEdit ? ["test"] : []);
  const [newTagInput, setNewTagInput] = useState("");
  const [showNewTagInput, setShowNewTagInput] = useState(false);

  const [additionalCategories, setAdditionalCategories] = useState<string[]>(
    isEdit ? ["Shop", "Sportswear Shop"] : []
  );

  const [labels, setLabels] = useState<string[]>(
    isEdit ? ["hyper local", "marketing agency", "digital marketing", "marketing firm"] : []
  );

  // Business Hours
  const [businessHours, setBusinessHours] = useState([
    { day: "Monday", open: true, open24: false, startTime: "10:30", endTime: "21:30" },
    { day: "Tuesday", open: true, open24: false, startTime: "10:30", endTime: "21:30" },
    { day: "Wednesday", open: true, open24: false, startTime: "10:30", endTime: "21:30" },
    { day: "Thursday", open: true, open24: false, startTime: "10:30", endTime: "21:30" },
    { day: "Friday", open: true, open24: false, startTime: "10:30", endTime: "21:30" },
    { day: "Saturday", open: true, open24: false, startTime: "00:00", endTime: "00:00" },
    { day: "Sunday", open: false, open24: false, startTime: "10:00", endTime: "22:00" },
  ]);

  const [specialHours, setSpecialHours] = useState<
    Array<{ id: string; date: string; open: boolean; startTime: string; endTime: string; note: string }>
  >(
    isEdit
      ? [{ id: "1", date: "2024-12-25", open: false, startTime: "", endTime: "", note: "Christmas Day" }]
      : []
  );

  // Services (Step 4)
  const [serviceAttributes, setServiceAttributes] = useState([
    { id: "wheelchair", name: "Wheelchair accessible entrance", enabled: isEdit },
    { id: "pickup", name: "In-store pickup available", enabled: isEdit },
    { id: "delivery", name: "Same-day delivery", enabled: isEdit },
    { id: "wifi", name: "Free Wi-Fi for customers", enabled: isEdit },
    { id: "cards", name: "Credit & Debit cards accepted", enabled: isEdit },
    { id: "restroom", name: "Gender neutral restroom", enabled: false },
  ]);
  const [customServices, setCustomServices] = useState<string[]>(
    isEdit ? ["Custom Fitting & Sizing", "Shoe Repair & Polishing"] : []
  );
  const [newCustomServiceInput, setNewCustomServiceInput] = useState("");

  // Media Upload Cards (Step 5)
  const [mediaUploads, setMediaUploads] = useState<Record<string, string[]>>({
    coverPhoto: isEdit ? ["cover_image_01.jpg"] : [],
    profilePhoto: isEdit ? ["profile_avatar.jpg"] : [],
    logo: isEdit ? ["brand_logo.png"] : [],
    exteriorPhotos: isEdit ? ["exterior_front.jpg", "exterior_street.jpg"] : [],
    interiorPhotos: isEdit ? ["interior_main.jpg"] : [],
    productPhotos: isEdit ? ["product_display_1.jpg"] : [],
    atWorkPhotos: [],
    foodDrinkPhotos: [],
    menuPhotos: [],
    commonAreaPhotos: [],
    roomPhotos: [],
    teamPhotos: [],
    additionalPhotos: [],
    documents: isEdit ? ["store_license_2024.pdf"] : [],
  });

  const mediaConfig = [
    { key: "coverPhoto", title: "Cover Photo", specs: "Format: JPG, JPEG | Minimum: 1080x608 px | Maximum: 2120x1192 px | Size: 10KB to 5MB | Capacity: Single Image" },
    { key: "profilePhoto", title: "Profile Photo", specs: "Format: JPG, JPEG | Minimum: 1080x608 px | Maximum: 2120x1192 px | Size: 10KB to 5MB | Capacity: Single Image" },
    { key: "logo", title: "Logo", specs: "Format: JPG, JPEG | Minimum: 1080x608 px | Maximum: 2120x1192 px | Size: 10KB to 5MB | Capacity: Single Image" },
    { key: "exteriorPhotos", title: "Exterior Photos", specs: "Format: JPG, JPEG | Minimum: 1080x608 px | Maximum: 2120x1192 px | Size: 10KB to 5MB | Capacity: Multiple Images" },
    { key: "interiorPhotos", title: "Interior Photos", specs: "Format: JPG, JPEG | Minimum: 1080x608 px | Maximum: 2120x1192 px | Size: 10KB to 5MB | Capacity: Multiple Images" },
    { key: "productPhotos", title: "Product Photos", specs: "Format: JPG, JPEG | Minimum: 1080x608 px | Maximum: 2120x1192 px | Size: 10KB to 5MB | Capacity: Multiple Images" },
    { key: "atWorkPhotos", title: "At Work Photos", specs: "Format: JPG, JPEG | Minimum: 1080x608 px | Maximum: 2120x1192 px | Size: 10KB to 5MB | Capacity: Multiple Images" },
    { key: "foodDrinkPhotos", title: "Food & Drink Photos", specs: "Format: JPG, JPEG | Minimum: 1080x608 px | Maximum: 2120x1192 px | Size: 10KB to 5MB | Capacity: Multiple Images" },
    { key: "menuPhotos", title: "Menu Photos", specs: "Format: JPG, JPEG | Minimum: 1080x608 px | Maximum: 2120x1192 px | Size: 10KB to 5MB | Capacity: Multiple Images" },
    { key: "commonAreaPhotos", title: "Common Area Photos", specs: "Format: JPG, JPEG | Minimum: 1080x608 px | Maximum: 2120x1192 px | Size: 10KB to 5MB | Capacity: Multiple Images" },
    { key: "roomPhotos", title: "Room Photos", specs: "Format: JPG, JPEG | Minimum: 1080x608 px | Maximum: 2120x1192 px | Size: 10KB to 5MB | Capacity: Multiple Images" },
    { key: "teamPhotos", title: "Teams Photos", specs: "Format: JPG, JPEG | Minimum: 1080x608 px | Maximum: 2120x1192 px | Size: 10KB to 5MB | Capacity: Multiple Images" },
    { key: "additionalPhotos", title: "Additional Photos", specs: "Format: JPG, JPEG | Minimum: 1080x608 px | Maximum: 2120x1192 px | Size: 10KB to 5MB | Capacity: Multiple Images" },
    { key: "documents", title: "Documents", specs: "Add documents for your internal reference" },
  ];

  const handleSimulateUpload = (key: string) => {
    const mockFileName = `uploaded_${key}_${Date.now().toString().slice(-4)}.jpg`;
    setMediaUploads((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), mockFileName],
    }));
    toast.success(`Uploaded file for ${key}`);
  };

  const handleRemoveMedia = (key: string, fileName: string) => {
    setMediaUploads((prev) => ({
      ...prev,
      [key]: (prev[key] || []).filter((f) => f !== fileName),
    }));
  };

  const handleAddTag = () => {
    if (newTagInput.trim() && !tags.includes(newTagInput.trim())) {
      setTags([...tags, newTagInput.trim()]);
      setNewTagInput("");
      setShowNewTagInput(false);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error("Please enter a Business Name before saving.");
      setStep(1);
      return;
    }
    toast.success(
      mode === "create"
        ? `New Business Profile "${formData.name}" created successfully!`
        : `Listing changes saved for "${formData.name}"`
    );
    onBack();
  };

  const steps = [
    { num: 1, label: "Basic Info & Address" },
    { num: 2, label: "Contact & Website" },
    { num: 3, label: "Business & Special Hours" },
    { num: 4, label: "Services" },
    { num: 5, label: "Media & Doc." },
    { num: 6, label: "Preview" },
  ];

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200 pb-16">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground px-1 pb-1">
        <Home className="size-3.5 text-muted-foreground hover:text-foreground cursor-pointer" onClick={onBack} />
        <ChevronRight className="size-3 text-muted-foreground/60" />
        <span onClick={onBack} className="cursor-pointer hover:text-foreground font-medium">
          Master Profiles
        </span>
        <ChevronRight className="size-3 text-muted-foreground/60" />
        <span className="font-bold text-foreground">
          {mode === "create" ? "Create Profile" : "Edit Profile"}
        </span>
      </div>

      {/* Container Card Box wrapping all content after Master Profiles > Create Profile */}
      <div className="rounded-2xl bg-card dark:bg-[#141416] p-6 sm:p-8 space-y-6 shadow-xl border border-border">
        {/* Title & Top Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-xl font-bold text-foreground tracking-tight">
            {mode === "create" ? "Create Listing" : "Edit Listing"}
          </h1>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={handleSave}
              className="h-8 bg-blue-500 hover:bg-blue-600 text-black font-semibold text-xs gap-1.5 cursor-pointer"
            >
              <Save className="size-3.5" />
              <span>Save</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="h-8 border-slate-300 dark:border-[#3f3f46] bg-white dark:bg-black hover:bg-slate-100 dark:hover:bg-[#27272a] text-foreground text-xs cursor-pointer"
            >
              Back
            </Button>
          </div>
        </div>

        {/* Stepper Navigation Bar */}
        <div className="flex items-center justify-center py-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 sm:gap-5">
            {steps.map((s, idx) => {
              const isActive = step === s.num;
              const isCompleted = step > s.num;
              return (
                <div key={s.num} className="flex items-center gap-2 sm:gap-5">
                  <button
                    onClick={() => setStep(s.num)}
                    className={`flex items-center gap-2 transition-all cursor-pointer ${
                      isActive
                        ? "bg-blue-500/10 text-blue-400 font-extrabold border border-blue-500/40 px-3 py-1.5 rounded-full"
                        : "text-muted-foreground hover:text-foreground p-1"
                    }`}
                  >
                    <span
                      className={`size-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                        isActive
                          ? "bg-blue-500 text-black shadow-md"
                          : isCompleted
                            ? "bg-slate-200 dark:bg-[#27272a] text-blue-400 border border-blue-500/30"
                            : "bg-white dark:bg-black border border-slate-300 dark:border-[#3f3f46] text-muted-foreground"
                      }`}
                    >
                      {s.num}
                    </span>
                    {isActive && (
                      <span className="whitespace-nowrap font-bold text-blue-400 pr-1">
                        {s.label}
                      </span>
                    )}
                  </button>

                  {idx < steps.length - 1 && (
                    <div className="w-8 sm:w-12 h-[1px] bg-slate-300 dark:bg-[#3f3f46]" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Info / Fields Section Centered in Box */}
        <div className="max-w-4xl mx-auto pt-2">
        {/* STEP 1: Basic Info & Address */}
        {step === 1 && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-4 space-y-1">
                <h3 className="text-sm font-bold text-foreground">Basic Info</h3>
                <p className="text-xs text-muted-foreground leading-normal">
                  Basic information of your business
                </p>
              </div>

              <div className="md:col-span-8 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">
                      Business Name <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      placeholder="e.g. Demo Store 127"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="h-9 bg-white dark:bg-black border-slate-300 dark:border-[#27272a] text-xs text-foreground focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">Store Code</Label>
                    <Input
                      placeholder="e.g. demo-store-127"
                      value={formData.storeCode}
                      onChange={(e) => setFormData({ ...formData, storeCode: e.target.value })}
                      className="h-9 bg-white dark:bg-black border-slate-300 dark:border-[#27272a] text-xs text-foreground focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">Opening Date</Label>
                    <div className="relative">
                      <Input
                        placeholder="YYYY-MM-DD"
                        value={formData.openingDate}
                        onChange={(e) => setFormData({ ...formData, openingDate: e.target.value })}
                        className="h-9 bg-white dark:bg-black border-slate-300 dark:border-[#27272a] text-xs text-foreground focus:border-blue-500 pr-8"
                      />
                      <CalendarIcon className="size-4 text-muted-foreground absolute right-2.5 top-2.5 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">
                      Business Status <span className="text-red-400">*</span>
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(val) => setFormData({ ...formData, status: val })}
                    >
                      <SelectTrigger className="h-9 bg-white dark:bg-black border-slate-300 dark:border-[#27272a] text-xs text-foreground focus:border-blue-500 cursor-pointer">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-[#121214] border-slate-300 dark:border-[#27272a] text-foreground">
                        <SelectItem value="Open" className="cursor-pointer">Open</SelectItem>
                        <SelectItem value="Closed" className="cursor-pointer">Closed</SelectItem>
                        <SelectItem value="Temporarily Closed" className="cursor-pointer">Temporarily Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">Business Description (short)</Label>
                  <Textarea
                    rows={2}
                    placeholder="Enter a brief short description of your business..."
                    value={formData.shortDesc}
                    onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                    className="bg-white dark:bg-black border-slate-300 dark:border-[#27272a] text-xs text-foreground focus:border-blue-500"
                  />
                  <div className="text-right text-[10px] text-muted-foreground">
                    {formData.shortDesc.length} / 300
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">Business Description (long)</Label>
                  <Textarea
                    rows={4}
                    placeholder="Enter detailed information about services..."
                    value={formData.longDesc}
                    onChange={(e) => setFormData({ ...formData, longDesc: e.target.value })}
                    className="bg-white dark:bg-black border-slate-300 dark:border-[#27272a] text-xs text-foreground focus:border-blue-500"
                  />
                  <div className="text-right text-[10px] text-muted-foreground">
                    {formData.longDesc.length} / 750
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold text-foreground">Tags</Label>
                    <button
                      type="button"
                      onClick={() => setShowNewTagInput(true)}
                      className="text-xs text-blue-500 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="size-3" /> New Tag
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 p-2 rounded-md bg-white dark:bg-black border border-slate-300 dark:border-[#27272a] min-h-[40px]">
                    {tags.length === 0 && !showNewTagInput && (
                      <span className="text-xs text-muted-foreground italic px-1">No tags added yet</span>
                    )}
                    {tags.map((t) => (
                      <Badge
                        key={t}
                        className="bg-slate-100 dark:bg-[#27272a] hover:bg-slate-200 dark:hover:bg-[#3f3f46] text-foreground text-xs gap-1 py-1 px-2 font-normal"
                      >
                        <span>{t}</span>
                        <X
                          className="size-3 text-muted-foreground hover:text-foreground cursor-pointer"
                          onClick={() => handleRemoveTag(t)}
                        />
                      </Badge>
                    ))}

                    {showNewTagInput && (
                      <div className="flex items-center gap-1">
                        <Input
                          autoFocus
                          value={newTagInput}
                          onChange={(e) => setNewTagInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                          placeholder="Type tag & Enter"
                          className="h-7 w-32 bg-slate-50 dark:bg-black border-blue-500/50 text-xs text-foreground"
                        />
                        <Button
                          size="sm"
                          type="button"
                          onClick={handleAddTag}
                          className="h-7 px-2 bg-blue-500 text-black text-[10px] font-bold cursor-pointer"
                        >
                          Add
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-black border border-slate-300 dark:border-[#27272a]">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold text-foreground">Auto Sync</Label>
                    <p className="text-[11px] text-muted-foreground">
                      Automatically push saved changes to connected platforms
                    </p>
                  </div>
                  <Switch
                    checked={autoSync}
                    onCheckedChange={setAutoSync}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-300 dark:border-[#27272a]" />

            {/* Business Address Section */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-4 space-y-1">
                <h3 className="text-sm font-bold text-foreground">Business Address</h3>
                <p className="text-xs text-muted-foreground leading-normal">
                  Enter the physical address for your business
                </p>
              </div>

              <div className="md:col-span-8 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">
                      Address line 1 <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      placeholder="e.g. JMD Regent Arcade"
                      value={formData.address1}
                      onChange={(e) => setFormData({ ...formData, address1: e.target.value })}
                      className="h-9 bg-white dark:bg-black border-slate-300 dark:border-[#27272a] text-xs text-foreground focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">Address line 2</Label>
                    <Input
                      placeholder="e.g. 4th floor"
                      value={formData.address2}
                      onChange={(e) => setFormData({ ...formData, address2: e.target.value })}
                      className="h-9 bg-white dark:bg-black border-slate-300 dark:border-[#27272a] text-xs text-foreground focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">Address line 3</Label>
                    <Input
                      placeholder="e.g. MG Road"
                      value={formData.address3}
                      onChange={(e) => setFormData({ ...formData, address3: e.target.value })}
                      className="h-9 bg-white dark:bg-black border-slate-300 dark:border-[#27272a] text-xs text-foreground focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">Address line 4</Label>
                    <Input
                      placeholder="e.g. Landmark"
                      value={formData.address4}
                      onChange={(e) => setFormData({ ...formData, address4: e.target.value })}
                      className="h-9 bg-white dark:bg-black border-slate-300 dark:border-[#27272a] text-xs text-foreground focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">
                      Country <span className="text-red-400">*</span>
                    </Label>
                    <Select
                      value={formData.country}
                      onValueChange={(val) => setFormData({ ...formData, country: val })}
                    >
                      <SelectTrigger className="h-9 bg-white dark:bg-black border-slate-300 dark:border-[#27272a] text-xs text-foreground focus:border-blue-500 cursor-pointer">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-[#121214] border-slate-300 dark:border-[#27272a] text-foreground">
                        <SelectItem value="India" className="cursor-pointer">India</SelectItem>
                        <SelectItem value="United States" className="cursor-pointer">United States</SelectItem>
                        <SelectItem value="United Kingdom" className="cursor-pointer">United Kingdom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">
                      Post Code <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      placeholder="e.g. 400050"
                      value={formData.postcode}
                      onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                      className="h-9 bg-white dark:bg-black border-slate-300 dark:border-[#27272a] text-xs text-foreground focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">Sub-locality</Label>
                    <Input
                      placeholder="Type here"
                      value={formData.sublocality}
                      onChange={(e) => setFormData({ ...formData, sublocality: e.target.value })}
                      className="h-9 bg-white dark:bg-black border-slate-300 dark:border-[#27272a] text-xs text-foreground focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">Locality</Label>
                    <Input
                      placeholder="e.g. Mumbai"
                      value={formData.locality}
                      onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                      className="h-9 bg-white dark:bg-black border-slate-300 dark:border-[#27272a] text-xs text-foreground focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">
                    Administrative Area <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    placeholder="e.g. Maharashtra"
                    value={formData.adminArea}
                    onChange={(e) => setFormData({ ...formData, adminArea: e.target.value })}
                    className="h-9 bg-white dark:bg-black border-slate-300 dark:border-[#27272a] text-xs text-foreground focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">
                      Latitude <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      placeholder="e.g. 28.479716"
                      value={formData.lat}
                      onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                      className="h-9 bg-white dark:bg-black border-slate-300 dark:border-[#27272a] text-xs text-foreground focus:border-blue-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">
                      Longitude <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      placeholder="e.g. 77.0885703"
                      value={formData.lng}
                      onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                      className="h-9 bg-white dark:bg-black border-slate-300 dark:border-[#27272a] text-xs text-foreground focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-slate-300 dark:border-[#27272a] bg-white dark:bg-black overflow-hidden space-y-2 p-3">
                  <div className="flex items-center justify-between p-2 rounded bg-blue-500/10 border border-blue-500/30 text-xs text-blue-400">
                    <span>Your pin is set to latitude {formData.lat || '0'} and longitude {formData.lng || '0'}.</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toast.success("Pin snapped to current address coordinates")}
                      className="h-6 text-[10px] text-blue-500 hover:bg-blue-500/20 font-bold px-2 cursor-pointer"
                    >
                      Snap pin to address
                    </Button>
                  </div>

                  <div className="h-52 bg-white dark:bg-black rounded-lg border border-slate-300 dark:border-[#27272a] relative flex items-center justify-center">
                    <div className="flex flex-col items-center gap-1">
                      <MapPin className="size-8 text-blue-500 animate-bounce" />
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {formData.lat || '0'}, {formData.lng || '0'}
                      </span>
                    </div>
                    <div className="absolute bottom-2 left-2 flex gap-1">
                      <Badge className="bg-slate-200 dark:bg-[#27272a] text-foreground text-[10px]">Address marker</Badge>
                      <Badge className="bg-slate-200 dark:bg-[#27272a] text-foreground text-[10px]">Coordinate position</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-300 dark:border-[#27272a]" />

            {/* Google Business Profile Section */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-4 space-y-1">
                <div className="flex items-center gap-2">
                  <GoogleGIcon className="size-4" />
                  <h3 className="text-sm font-bold text-foreground">Google Business Profile</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-normal">
                  Google-specific listing fields
                </p>
              </div>

              <div className="md:col-span-8 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">
                      Location Group <span className="text-red-400">*</span>
                    </Label>
                    <Select
                      value={formData.locationGroup}
                      onValueChange={(val) => setFormData({ ...formData, locationGroup: val })}
                    >
                      <SelectTrigger className="h-9 bg-white dark:bg-black border-slate-300 dark:border-[#27272a] text-xs text-foreground focus:border-blue-500 cursor-pointer">
                        <SelectValue placeholder="Select group" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-[#121214] border-slate-300 dark:border-[#27272a] text-foreground">
                        <SelectItem value="Demo Account" className="cursor-pointer">Demo Account</SelectItem>
                        <SelectItem value="Flagship Stores" className="cursor-pointer">Flagship Stores</SelectItem>
                        <SelectItem value="Metro Retail" className="cursor-pointer">Metro Retail</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">
                      Primary Category <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      placeholder="e.g. Shoe Shop"
                      value={formData.primaryCategory}
                      onChange={(e) => setFormData({ ...formData, primaryCategory: e.target.value })}
                      className="h-9 bg-white dark:bg-black border-slate-300 dark:border-[#27272a] text-xs text-foreground focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">Additional Categories</Label>
                  <div className="flex flex-wrap gap-2 p-2 rounded-md bg-white dark:bg-black border border-slate-300 dark:border-[#27272a]">
                    {additionalCategories.map((c) => (
                      <Badge key={c} className="bg-slate-100 dark:bg-[#27272a] text-foreground text-xs gap-1 py-1 px-2">
                        <span>{c}</span>
                        <X
                          className="size-3 text-muted-foreground hover:text-foreground cursor-pointer"
                          onClick={() =>
                            setAdditionalCategories(additionalCategories.filter((item) => item !== c))
                          }
                        />
                      </Badge>
                    ))}
                    {additionalCategories.length === 0 && (
                      <span className="text-xs text-muted-foreground italic px-1">None added</span>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">Labels</Label>
                  <div className="flex flex-wrap gap-2 p-2 rounded-md bg-white dark:bg-black border border-slate-300 dark:border-[#27272a]">
                    {labels.map((l) => (
                      <Badge key={l} className="bg-slate-100 dark:bg-[#27272a] text-foreground text-xs gap-1 py-1 px-2">
                        <span>{l}</span>
                        <X
                          className="size-3 text-muted-foreground hover:text-foreground cursor-pointer"
                          onClick={() => setLabels(labels.filter((item) => item !== l))}
                        />
                      </Badge>
                    ))}
                    {labels.length === 0 && (
                      <span className="text-xs text-muted-foreground italic px-1">None added</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-300 dark:border-[#27272a]">
              <Button
                onClick={() => setStep(2)}
                className="bg-blue-500 hover:bg-blue-600 text-black font-semibold text-xs gap-1 cursor-pointer px-6"
              >
                <span>Next</span>
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: Contact & Website */}
        {step === 2 && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-4 space-y-1">
                <h3 className="text-sm font-bold text-foreground">Contact</h3>
                <p className="text-xs text-muted-foreground leading-normal">
                  Add contact details that will be visible in your Google Business Profile.
                </p>
              </div>

              <div className="md:col-span-8 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">Primary Phone Number</Label>
                    <Input
                      placeholder="e.g. +91 83687 61913"
                      value={formData.primaryPhone}
                      onChange={(e) => setFormData({ ...formData, primaryPhone: e.target.value })}
                      className="h-9 bg-white dark:bg-black border-slate-300 dark:border-[#27272a] text-xs text-foreground focus:border-blue-500 font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">Additional Phone Number 1</Label>
                    <Input
                      placeholder="e.g. +91 81234 56789"
                      value={formData.additionalPhone1}
                      onChange={(e) => setFormData({ ...formData, additionalPhone1: e.target.value })}
                      className="h-9 bg-white dark:bg-black border-slate-300 dark:border-[#27272a] text-xs text-foreground focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">Additional Phone Number 2</Label>
                  <Input
                    placeholder="e.g. +91 98234 56789"
                    value={formData.additionalPhone2}
                    onChange={(e) => setFormData({ ...formData, additionalPhone2: e.target.value })}
                    className="h-9 bg-white dark:bg-black border-slate-300 dark:border-[#27272a] text-xs text-foreground focus:border-blue-500 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-300 dark:border-[#27272a]" />

            {/* Customer Care */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-4 space-y-1">
                <h3 className="text-sm font-bold text-foreground">Customer Care</h3>
                <p className="text-xs text-muted-foreground leading-normal">
                  Add information about customer care
                </p>
              </div>

              <div className="md:col-span-8 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">Customer Support Phone</Label>
                    <Input
                      placeholder="e.g. +91 92344 56789"
                      value={formData.supportPhone}
                      onChange={(e) => setFormData({ ...formData, supportPhone: e.target.value })}
                      className="h-9 bg-white dark:bg-black border-slate-300 dark:border-[#27272a] text-xs text-foreground focus:border-blue-500 font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">Customer Support Email</Label>
                    <Input
                      placeholder="e.g. support@example.com"
                      value={formData.supportEmail}
                      onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                      className="h-9 bg-white dark:bg-black border-slate-300 dark:border-[#27272a] text-xs text-foreground focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">Customer Support URL</Label>
                  <Input
                    placeholder="e.g. https://example.com/support"
                    value={formData.supportUrl}
                    onChange={(e) => setFormData({ ...formData, supportUrl: e.target.value })}
                    className="h-9 bg-white dark:bg-black border-slate-300 dark:border-[#27272a] text-xs text-foreground focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-300 dark:border-[#27272a]" />

            {/* Website */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-4 space-y-1">
                <h3 className="text-sm font-bold text-foreground">Website</h3>
                <p className="text-xs text-muted-foreground leading-normal">
                  Add your website to link your store page
                </p>
              </div>

              <div className="md:col-span-8 space-y-2">
                <Label className="text-xs font-semibold text-foreground">URL</Label>
                <div className="relative">
                  <Globe className="size-4 text-muted-foreground absolute left-3 top-2.5 pointer-events-none" />
                  <Input
                    placeholder="https://global360.com/"
                    value={formData.websiteUrl}
                    onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                    className="h-9 pl-9 bg-white dark:bg-black border-slate-300 dark:border-[#27272a] text-xs text-foreground focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-300 dark:border-[#27272a]" />

            {/* Online Actions */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-4 space-y-1">
                <h3 className="text-sm font-bold text-foreground">Online Actions</h3>
                <p className="text-xs text-muted-foreground leading-normal">
                  Let customers take action directly from your listing
                </p>
              </div>

              <div className="md:col-span-8 space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">Menu URL</Label>
                  <div className="relative">
                    <Utensils className="size-4 text-muted-foreground absolute left-3 top-2.5 pointer-events-none" />
                    <Input
                      placeholder="e.g. https://example.com/menu"
                      value={formData.menuUrl}
                      onChange={(e) => setFormData({ ...formData, menuUrl: e.target.value })}
                      className="h-9 pl-9 bg-white dark:bg-black border-slate-300 dark:border-[#27272a] text-xs text-foreground focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">Order URL</Label>
                  <div className="relative">
                    <ShoppingCart className="size-4 text-muted-foreground absolute left-3 top-2.5 pointer-events-none" />
                    <Input
                      placeholder="e.g. https://example.com/order"
                      value={formData.orderUrl}
                      onChange={(e) => setFormData({ ...formData, orderUrl: e.target.value })}
                      className="h-9 pl-9 bg-white dark:bg-black border-slate-300 dark:border-[#27272a] text-xs text-foreground focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">Reservation URL</Label>
                  <div className="relative">
                    <Lock className="size-4 text-muted-foreground absolute left-3 top-2.5 pointer-events-none" />
                    <Input
                      placeholder="e.g. https://example.com/reserve"
                      value={formData.reservationUrl}
                      onChange={(e) => setFormData({ ...formData, reservationUrl: e.target.value })}
                      className="h-9 pl-9 bg-white dark:bg-black border-slate-300 dark:border-[#27272a] text-xs text-foreground focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-300 dark:border-[#27272a]" />

            {/* Social profile & URLs */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-4 space-y-1">
                <h3 className="text-sm font-bold text-foreground">Social profile & URLs</h3>
                <p className="text-xs text-muted-foreground leading-normal">
                  This information will appear for template selection
                </p>
              </div>

              <div className="md:col-span-8 space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">Facebook URL</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-2.5 text-muted-foreground">
                      <FacebookIcon className="size-4" />
                    </div>
                    <Input
                      placeholder="Type here"
                      value={formData.facebookUrl}
                      onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                      className="h-9 pl-9 bg-white dark:bg-black border-slate-300 dark:border-[#27272a] text-xs text-foreground focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">X URL</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-2.5 text-muted-foreground">
                      <XIcon className="size-4" />
                    </div>
                    <Input
                      placeholder="Type here"
                      value={formData.xUrl}
                      onChange={(e) => setFormData({ ...formData, xUrl: e.target.value })}
                      className="h-9 pl-9 bg-white dark:bg-black border-slate-300 dark:border-[#27272a] text-xs text-foreground focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">LinkedIn URL</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-2.5 text-muted-foreground">
                      <LinkedInIcon className="size-4" />
                    </div>
                    <Input
                      placeholder="Type here"
                      value={formData.linkedinUrl}
                      onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                      className="h-9 pl-9 bg-white dark:bg-black border-slate-300 dark:border-[#27272a] text-xs text-foreground focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">Instagram URL</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-2.5 text-muted-foreground">
                      <InstagramIcon className="size-4" />
                    </div>
                    <Input
                      placeholder="Type here"
                      value={formData.instagramUrl}
                      onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                      className="h-9 pl-9 bg-white dark:bg-black border-slate-300 dark:border-[#27272a] text-xs text-foreground focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">YouTube URL</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-2.5 text-muted-foreground">
                      <YouTubeIcon className="size-4" />
                    </div>
                    <Input
                      placeholder="Type here"
                      value={formData.youtubeUrl}
                      onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                      className="h-9 pl-9 bg-white dark:bg-black border-slate-300 dark:border-[#27272a] text-xs text-foreground focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">WhatsApp URL</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-2.5 text-muted-foreground">
                      <WhatsAppIcon className="size-4" />
                    </div>
                    <Input
                      placeholder="Type here"
                      value={formData.whatsappUrl}
                      onChange={(e) => setFormData({ ...formData, whatsappUrl: e.target.value })}
                      className="h-9 pl-9 bg-white dark:bg-black border-slate-300 dark:border-[#27272a] text-xs text-foreground focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-300 dark:border-[#27272a]">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="border-slate-300 dark:border-[#3f3f46] bg-white dark:bg-black hover:bg-slate-100 dark:hover:bg-[#27272a] text-foreground text-xs cursor-pointer px-6"
              >
                ← Previous
              </Button>
              <Button
                onClick={() => setStep(3)}
                className="bg-blue-500 hover:bg-blue-600 text-black font-semibold text-xs gap-1 cursor-pointer px-6"
              >
                <span>Next</span>
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        )}        {/* STEP 3: Business & Special Hours */}
        {step === 3 && (
          <div className="space-y-8">
            {/* Business Hours Section */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <div className="md:col-span-4 space-y-1 pt-1">
                <h3 className="text-sm font-bold text-foreground">Business Hours</h3>
                <p className="text-xs text-muted-foreground leading-normal">
                  Set your store hours for each day of the week.
                </p>
              </div>

              <div className="md:col-span-8 space-y-5">
                {businessHours.map((item, idx) => (
                  <div key={item.day} className="space-y-2">
                    <div className="flex items-center gap-4">
                      <span className="w-24 font-bold text-xs text-foreground">{item.day}</span>

                      <div className="flex items-center gap-2">
                        <Switch
                          checked={item.open}
                          onCheckedChange={(checked) => {
                            const updated = [...businessHours];
                            updated[idx].open = checked;
                            setBusinessHours(updated);
                          }}
                          className="cursor-pointer"
                        />
                        <span className={`text-xs font-semibold ${item.open ? "text-blue-400" : "text-muted-foreground"}`}>
                          {item.open ? "Open" : "Close"}
                        </span>
                      </div>

                      {item.open && (
                        <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer ml-4">
                          <Checkbox
                            checked={item.open24}
                            onCheckedChange={(checked) => {
                              const updated = [...businessHours];
                              updated[idx].open24 = !!checked;
                              setBusinessHours(updated);
                            }}
                          />
                          <span>Open 24 hours</span>
                        </label>
                      )}
                    </div>

                    {item.open && !item.open24 && (
                      <div className="flex items-center gap-2 pl-28">
                        <CustomTimePicker
                          value={item.startTime}
                          onChange={(val) => {
                            const updated = [...businessHours];
                            updated[idx].startTime = val;
                            setBusinessHours(updated);
                          }}
                        />
                        <span className="text-muted-foreground text-xs font-mono">—</span>
                        <CustomTimePicker
                          value={item.endTime}
                          onChange={(val) => {
                            const updated = [...businessHours];
                            updated[idx].endTime = val;
                            setBusinessHours(updated);
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => toast.info(`Added split hours slot for ${item.day}`)}
                          className="p-1 rounded text-muted-foreground hover:text-foreground cursor-pointer"
                          title="Add split hours"
                        >
                          <Plus className="size-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                <div className="pt-2 pl-28">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast.info("Opening bulk hours editor for multiple days")}
                    className="h-8 border-slate-300 dark:border-[#3f3f46] bg-white dark:bg-black hover:bg-slate-100 dark:hover:bg-[#27272a] text-xs text-foreground cursor-pointer gap-1.5"
                  >
                    <CalendarIcon className="size-3.5 text-blue-500" />
                    <span>Add/Edit Hours for Multiple Days</span>
                  </Button>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-300 dark:border-[#27272a]" />

            {/* Special Hours Section */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <div className="md:col-span-4 space-y-1 pt-1">
                <h3 className="text-sm font-bold text-foreground">Special Hours</h3>
                <p className="text-xs text-muted-foreground leading-normal">
                  This information will appear for template selection
                </p>
              </div>

              <div className="md:col-span-8 space-y-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setSpecialHours([
                        ...specialHours,
                        { id: Date.now().toString(), date: "2024-12-31", open: false, startTime: "", endTime: "", note: "New Year's Eve" },
                      ])
                    }
                    className="h-8 border-slate-300 dark:border-[#3f3f46] bg-white dark:bg-black hover:bg-slate-100 dark:hover:bg-[#27272a] text-xs text-foreground cursor-pointer gap-1.5"
                  >
                    <Plus className="size-3.5" />
                    <span>Add</span>
                  </Button>
                </div>

                {specialHours.map((sh, idx) => (
                  <div
                    key={sh.id}
                    className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg bg-white dark:bg-black border border-slate-300 dark:border-[#27272a]"
                  >
                    <Input
                      type="date"
                      value={sh.date}
                      onChange={(e) => {
                        const updated = [...specialHours];
                        updated[idx].date = e.target.value;
                        setSpecialHours(updated);
                      }}
                      className="h-8 w-36 bg-slate-50 dark:bg-black border-slate-300 dark:border-[#27272a] text-xs text-foreground"
                    />

                    <Input
                      placeholder="Holiday / Event name"
                      value={sh.note}
                      onChange={(e) => {
                        const updated = [...specialHours];
                        updated[idx].note = e.target.value;
                        setSpecialHours(updated);
                      }}
                      className="h-8 w-40 bg-slate-50 dark:bg-black border-slate-300 dark:border-[#27272a] text-xs text-foreground"
                    />

                    <div className="flex items-center gap-2">
                      <Switch
                        checked={sh.open}
                        onCheckedChange={(checked) => {
                          const updated = [...specialHours];
                          updated[idx].open = checked;
                          setSpecialHours(updated);
                        }}
                      />
                      <span className="text-xs font-medium text-foreground">
                        {sh.open ? "Open" : "Closed"}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSpecialHours(specialHours.filter((item) => item.id !== sh.id))}
                      className="p-1.5 text-muted-foreground hover:text-red-400 cursor-pointer"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-slate-300 dark:border-[#27272a]">
              <div></div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="h-9 border-slate-300 dark:border-[#3f3f46] bg-white dark:bg-black hover:bg-slate-100 dark:hover:bg-[#27272a] text-foreground text-xs cursor-pointer px-6"
                >
                  ← Previous
                </Button>
                <Button
                  onClick={() => setStep(4)}
                  className="h-9 bg-blue-500 hover:bg-blue-600 text-black font-semibold text-xs gap-1 cursor-pointer px-6"
                >
                  <span>Next</span>
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Services */}
        {step === 4 && (
          <div className="space-y-8">
            <div className="p-8 text-center space-y-3 rounded-xl border border-slate-300 dark:border-[#27272a] bg-white dark:bg-black">
              <div className="size-12 rounded-full bg-slate-100 dark:bg-[#27272a] flex items-center justify-center mx-auto text-muted-foreground">
                <Tag className="size-6 text-blue-500" />
              </div>
              <h3 className="text-sm font-bold text-foreground">Services & Business Attributes</h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                Select a Google category in Step 1 to see applicable attributes, or toggle common store attributes below.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-4 space-y-1">
                <h3 className="text-sm font-bold text-foreground">Applicable Attributes</h3>
                <p className="text-xs text-muted-foreground leading-normal">
                  Enable attributes for your Google Business Profile
                </p>
              </div>

              <div className="md:col-span-8 space-y-3">
                {serviceAttributes.map((attr, idx) => (
                  <div
                    key={attr.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-black border border-slate-300 dark:border-[#27272a]"
                  >
                    <span className="text-xs font-medium text-foreground">{attr.name}</span>
                    <Switch
                      checked={attr.enabled}
                      onCheckedChange={(checked) => {
                        const updated = [...serviceAttributes];
                        updated[idx].enabled = checked;
                        setServiceAttributes(updated);
                      }}
                      className="cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-300 dark:border-[#27272a]">
              <Button
                variant="outline"
                onClick={() => setStep(3)}
                className="border-slate-300 dark:border-[#3f3f46] bg-white dark:bg-black hover:bg-slate-100 dark:hover:bg-[#27272a] text-foreground text-xs cursor-pointer px-6"
              >
                ← Previous
              </Button>
              <Button
                onClick={() => setStep(5)}
                className="bg-blue-500 hover:bg-blue-600 text-black font-semibold text-xs gap-1 cursor-pointer px-6"
              >
                <span>Next</span>
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 5: Media & Doc. */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">Media & Documents Upload</h3>
              <p className="text-xs text-muted-foreground">
                Upload photos and compliance documents to showcase your business listing.
              </p>
            </div>

            <div className="space-y-4">
              {mediaConfig.map((item) => {
                const uploadedFiles = mediaUploads[item.key] || [];

                return (
                  <div
                    key={item.key}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-black border border-slate-300 dark:border-[#27272a]"
                  >
                    <div className="space-y-1 max-w-md">
                      <h4 className="text-xs font-bold text-foreground">{item.title}</h4>
                      <p className="text-[11px] text-muted-foreground whitespace-pre-line leading-relaxed font-mono">
                        {item.specs}
                      </p>

                      {uploadedFiles.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {uploadedFiles.map((fn) => (
                            <Badge
                              key={fn}
                              className="bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] gap-1.5 font-mono py-0.5 px-2"
                            >
                              <FileText className="size-3" />
                              <span>{fn}</span>
                              <X
                                className="size-3 cursor-pointer hover:text-foreground"
                                onClick={() => handleRemoveMedia(item.key, fn)}
                              />
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSimulateUpload(item.key)}
                      className="w-full sm:w-44 h-24 rounded-lg border-2 border-dashed border-slate-300 dark:border-[#3f3f46] hover:border-blue-500 bg-slate-50 dark:bg-black flex flex-col items-center justify-center gap-1.5 text-muted-foreground hover:text-blue-500 transition-colors cursor-pointer shrink-0"
                    >
                      <Upload className="size-5" />
                      <span className="text-xs font-semibold">Upload</span>
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-300 dark:border-[#27272a]">
              <Button
                variant="outline"
                onClick={() => setStep(4)}
                className="border-slate-300 dark:border-[#3f3f46] bg-white dark:bg-black hover:bg-slate-100 dark:hover:bg-[#27272a] text-foreground text-xs cursor-pointer px-6"
              >
                ← Previous
              </Button>
              <Button
                onClick={() => setStep(6)}
                className="bg-blue-500 hover:bg-blue-600 text-black font-semibold text-xs gap-1 cursor-pointer px-6"
              >
                <span>Preview Profile</span>
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 6: Preview */}
        {step === 6 && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="size-5 text-blue-500 shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-foreground">Profile Ready for Review</h3>
                  <p className="text-xs text-muted-foreground">
                    Review all details below before saving your business profile.
                  </p>
                </div>
              </div>
              <Button
                onClick={handleSave}
                className="bg-blue-500 hover:bg-blue-600 text-black font-semibold text-xs gap-1.5 cursor-pointer"
              >
                <Save className="size-4" />
                <span>{isEdit ? "Save Listing" : "Publish Profile"}</span>
              </Button>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-black border border-slate-300 dark:border-[#27272a] space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-300 dark:border-[#27272a]">
                <div className="flex items-center gap-2">
                  <Building2 className="size-4 text-blue-500" />
                  <h4 className="text-sm font-bold text-foreground">1. Basic Info & Address</h4>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep(1)}
                  className="h-7 text-xs text-blue-500 hover:bg-blue-500/10 font-medium cursor-pointer"
                >
                  <Pencil className="size-3 mr-1" /> Edit
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground block">Business Name:</span>
                  <span className="font-bold text-foreground text-sm">{formData.name || "—"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Store Code:</span>
                  <span className="font-mono text-foreground">{formData.storeCode || "—"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Status:</span>
                  <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px]">
                    {formData.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-300 dark:border-[#27272a]">
              <Button
                variant="outline"
                onClick={() => setStep(5)}
                className="border-slate-300 dark:border-[#3f3f46] bg-white dark:bg-black hover:bg-slate-100 dark:hover:bg-[#27272a] text-foreground text-xs cursor-pointer px-6"
              >
                ← Previous
              </Button>
              <Button
                onClick={handleSave}
                className="bg-blue-500 hover:bg-blue-600 text-black font-extrabold text-xs gap-1.5 cursor-pointer px-8 h-10 shadow-lg"
              >
                <Check className="size-4" />
                <span>{isEdit ? "Complete & Save Listing" : "Create & Publish Listing"}</span>
              </Button>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
