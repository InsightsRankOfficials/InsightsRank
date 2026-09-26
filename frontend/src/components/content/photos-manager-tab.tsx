import React, { useState, useMemo, useRef } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Upload,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Image as ImageIcon,
  Trash2,
  Eye,
  Star,
  Download,
  ExternalLink,
  Layers,
  Building2,
  X,
  UploadCloud,
  Check,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { GoogleGIcon } from "@/components/ui/google-g-icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type PhotoCategoryType =
  | "all"
  | "cover"
  | "logo"
  | "exterior"
  | "interior"
  | "team"
  | "product"
  | "other";

export interface PhotoItem {
  id: string;
  url: string;
  title: string;
  category: PhotoCategoryType;
  locationId: string;
  locationName: string;
  storeCode: string;
  uploadedAt: string;
  views: number;
  width: number;
  height: number;
  sizeKb: number;
  isCover?: boolean;
  isLogo?: boolean;
  status: "Published" | "Pending" | "Failed";
}

// Sample initial photos dataset with high quality Unsplash URLs
const INITIAL_PHOTOS: PhotoItem[] = [
  {
    id: "pho-101",
    url: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1000&q=80",
    title: "Storefront Main Entrance",
    category: "exterior",
    locationId: "req-1",
    locationName: "Demo Store 297",
    storeCode: "demo-store-297",
    uploadedAt: "2026-09-18 10:30 am",
    views: 3420,
    width: 1920,
    height: 1080,
    sizeKb: 1420,
    isCover: true,
    status: "Published",
  },
  {
    id: "pho-102",
    url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=80",
    title: "Brand Logo Profile Icon",
    category: "logo",
    locationId: "req-1",
    locationName: "Demo Store 297",
    storeCode: "demo-store-297",
    uploadedAt: "2026-09-15 02:15 pm",
    views: 8910,
    width: 800,
    height: 800,
    sizeKb: 450,
    isLogo: true,
    status: "Published",
  },
  {
    id: "pho-103",
    url: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1000&q=80",
    title: "Main Retail Floor Area",
    category: "interior",
    locationId: "req-1",
    locationName: "Demo Store 297",
    storeCode: "demo-store-297",
    uploadedAt: "2026-09-12 11:00 am",
    views: 2150,
    width: 1920,
    height: 1280,
    sizeKb: 1850,
    status: "Published",
  },
  {
    id: "pho-104",
    url: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=1000&q=80",
    title: "Product Display Shelf",
    category: "product",
    locationId: "req-2",
    locationName: "Demo Store 371",
    storeCode: "demo-store-371",
    uploadedAt: "2026-09-10 04:45 pm",
    views: 1840,
    width: 1600,
    height: 1066,
    sizeKb: 1200,
    status: "Published",
  },
  {
    id: "pho-105",
    url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1000&q=80",
    title: "Store Customer Team",
    category: "team",
    locationId: "req-3",
    locationName: "Demo Store 298",
    storeCode: "demo-store-298",
    uploadedAt: "2026-09-08 09:20 am",
    views: 4120,
    width: 1920,
    height: 1080,
    sizeKb: 2100,
    status: "Published",
  },
  {
    id: "pho-106",
    url: "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&w=1000&q=80",
    title: "Evening Exterior View",
    category: "exterior",
    locationId: "req-4",
    locationName: "Demo Store 296",
    storeCode: "demo-store-296",
    uploadedAt: "2026-09-05 07:30 pm",
    views: 3050,
    width: 2048,
    height: 1365,
    sizeKb: 2400,
    status: "Published",
  },
  {
    id: "pho-107",
    url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1000&q=80",
    title: "Promotional Cover Banner",
    category: "cover",
    locationId: "req-5",
    locationName: "Demo Store 127",
    storeCode: "demo-store-127",
    uploadedAt: "2026-09-02 01:10 pm",
    views: 6540,
    width: 1920,
    height: 1080,
    sizeKb: 1900,
    isCover: true,
    status: "Published",
  },
  {
    id: "pho-108",
    url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80",
    title: "Checkout & Reception Counter",
    category: "interior",
    locationId: "req-6",
    locationName: "Demo Store 100",
    storeCode: "demo-store-100",
    uploadedAt: "2026-08-28 03:00 pm",
    views: 1290,
    width: 1920,
    height: 1080,
    sizeKb: 1350,
    status: "Published",
  },
];

const LOCATIONS_LIST = [
  { id: "all", name: "All Locations" },
  { id: "req-1", name: "Demo Store 297 (demo-store-297)" },
  { id: "req-2", name: "Demo Store 371 (demo-store-371)" },
  { id: "req-3", name: "Demo Store 298 (demo-store-298)" },
  { id: "req-4", name: "Demo Store 296 (demo-store-296)" },
  { id: "req-5", name: "Demo Store 127 (demo-store-127)" },
  { id: "req-6", name: "Demo Store 100 (demo-store-100)" },
];

export function PhotosManagerTab() {
  const [photos, setPhotos] = useState<PhotoItem[]>(INITIAL_PHOTOS);
  const [activeCategory, setActiveCategory] = useState<PhotoCategoryType>("all");
  const [selectedLocationId, setSelectedLocationId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Selection for bulk actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Preview Modal
  const [previewPhoto, setPreviewPhoto] = useState<PhotoItem | null>(null);

  // Upload Modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Calculate dynamic category counts
  const counts = useMemo(() => {
    return {
      all: photos.length,
      cover: photos.filter((p) => p.category === "cover").length,
      logo: photos.filter((p) => p.category === "logo").length,
      exterior: photos.filter((p) => p.category === "exterior").length,
      interior: photos.filter((p) => p.category === "interior").length,
      team: photos.filter((p) => p.category === "team").length,
      product: photos.filter((p) => p.category === "product").length,
      other: photos.filter((p) => p.category === "other").length,
    };
  }, [photos]);

  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) => {
      // Category filter
      if (activeCategory !== "all" && photo.category !== activeCategory) {
        return false;
      }
      // Location filter
      if (selectedLocationId !== "all" && photo.locationId !== selectedLocationId) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          photo.title.toLowerCase().includes(q) ||
          photo.locationName.toLowerCase().includes(q) ||
          photo.storeCode.toLowerCase().includes(q) ||
          photo.category.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [photos, activeCategory, selectedLocationId, searchQuery]);

  // Handle setting image as Cover
  const handleSetCover = (photo: PhotoItem) => {
    setPhotos((prev) =>
      prev.map((p) => {
        if (p.locationId === photo.locationId) {
          return {
            ...p,
            isCover: p.id === photo.id,
            category: p.id === photo.id ? "cover" : p.category === "cover" ? "exterior" : p.category,
          };
        }
        return p;
      })
    );
    toast.success(`Set "${photo.title}" as Cover Photo for ${photo.locationName} on Google!`);
  };

  // Handle setting image as Logo
  const handleSetLogo = (photo: PhotoItem) => {
    setPhotos((prev) =>
      prev.map((p) => {
        if (p.locationId === photo.locationId) {
          return {
            ...p,
            isLogo: p.id === photo.id,
            category: p.id === photo.id ? "logo" : p.category === "logo" ? "other" : p.category,
          };
        }
        return p;
      })
    );
    toast.success(`Set "${photo.title}" as Profile Logo for ${photo.locationName} on Google!`);
  };

  // Handle photo deletion
  const handleDeletePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    setSelectedIds((prev) => prev.filter((i) => i !== id));
    toast.success("Photo removed from Google Business Profile successfully.");
  };

  // Bulk actions
  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredPhotos.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredPhotos.map((p) => p.id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setPhotos((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
    toast.success(`Removed ${selectedIds.length} photo(s) from Google Business Profile.`);
    setSelectedIds([]);
  };

  const handleAddNewPhoto = (newPhoto: PhotoItem) => {
    setPhotos((prev) => [newPhoto, ...prev]);
  };

  return (
    <div className="rounded-2xl bg-card dark:bg-[#141416] p-6 sm:p-8 space-y-6 shadow-xl border border-border animate-in fade-in duration-200">
      {/* Top Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-foreground tracking-tight">Photos Audit & Publisher</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold">
              <GoogleGIcon className="size-3" />
              Google Business Sync Active
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Audit, upload, and organize visual assets published across your Google Business Profiles.
          </p>
        </div>

        {/* Upload Button */}
        <Button
          onClick={() => setIsUploadModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-black font-extrabold text-xs px-4 py-2 rounded-xl gap-1.5 cursor-pointer shadow-md self-start md:self-auto"
        >
          <Plus className="size-4" />
          <span>Upload Photos to Google</span>
        </Button>
      </div>

      {/* Category Pills Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: "all", label: "All Photos", count: counts.all },
          { id: "cover", label: "Cover Photos", count: counts.cover },
          { id: "logo", label: "Logos", count: counts.logo },
          { id: "exterior", label: "Exteriors", count: counts.exterior },
          { id: "interior", label: "Interiors", count: counts.interior },
          { id: "team", label: "Team Photos", count: counts.team },
          { id: "product", label: "Product Imagery", count: counts.product },
          { id: "other", label: "Other", count: counts.other },
        ].map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as PhotoCategoryType)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-all whitespace-nowrap ${
                isActive
                  ? "bg-blue-500 text-black shadow-sm font-extrabold"
                  : "bg-secondary text-muted-foreground border border-border hover:text-foreground hover:bg-secondary/80"
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                  isActive ? "bg-black/20 text-black" : "bg-muted text-muted-foreground"
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Location Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Location Select Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 border-border bg-background hover:bg-secondary text-xs font-semibold text-foreground flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Building2 className="size-3.5 text-blue-500" />
                <span>
                  {LOCATIONS_LIST.find((l) => l.id === selectedLocationId)?.name || "All Locations"}
                </span>
                <ChevronDown className="size-3 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-64 bg-popover border-border text-popover-foreground text-xs p-1 shadow-xl space-y-1"
            >
              {LOCATIONS_LIST.map((loc) => (
                <DropdownMenuItem
                  key={loc.id}
                  onClick={() => setSelectedLocationId(loc.id)}
                  className={`px-3 py-2 rounded-lg cursor-pointer flex items-center justify-between ${
                    selectedLocationId === loc.id
                      ? "bg-blue-500/10 text-blue-400 font-bold"
                      : "hover:bg-secondary text-foreground"
                  }`}
                >
                  <span>{loc.name}</span>
                  {selectedLocationId === loc.id && <Check className="size-3.5 text-blue-400" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Search Input */}
          <div className="relative flex-1 sm:w-72">
            <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by photo title, location or code..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Bulk Action Controls */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 bg-secondary border border-blue-500/40 px-3 py-1.5 rounded-xl text-xs text-blue-400 animate-in fade-in">
            <span className="font-bold">{selectedIds.length} Selected</span>
            <button
              onClick={handleBulkDelete}
              className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Trash2 className="size-3" />
              Delete Selected
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="text-muted-foreground hover:text-foreground text-xs underline cursor-pointer ml-1"
            >
              Deselect
            </button>
          </div>
        )}
      </div>

      {/* Main Photos Grid */}
      {filteredPhotos.length === 0 ? (
        <div className="panel p-6">
          <EmptyState
            title="No Photos Found"
            description="Try adjusting your search query, location filter, or upload a new photo."
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPhotos.map((photo) => {
            const isSelected = selectedIds.includes(photo.id);

            return (
              <div
                key={photo.id}
                className={`group relative rounded-xl border overflow-hidden bg-card dark:bg-[#121214] transition-all duration-200 shadow-sm flex flex-col justify-between ${
                  isSelected
                    ? "border-blue-500 ring-2 ring-blue-500/30"
                    : "border-border hover:border-border/80"
                }`}
              >
                {/* Photo Thumbnail Container */}
                <div className="relative w-full h-44 bg-muted overflow-hidden">
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Multi-Select Checkbox Overlay */}
                  <button
                    onClick={() =>
                      setSelectedIds((prev) =>
                        isSelected ? prev.filter((id) => id !== photo.id) : [...prev, photo.id]
                      )
                    }
                    className={`absolute top-2 left-2 size-5 rounded border flex items-center justify-center transition-all cursor-pointer z-10 ${
                      isSelected
                        ? "bg-blue-500 border-blue-500 text-black shadow-sm"
                        : "bg-black/60 border-white/40 text-transparent group-hover:border-white"
                    }`}
                  >
                    <Check className="size-3.5 stroke-[3]" />
                  </button>

                  {/* Badges Overlay */}
                  <div className="absolute top-2 right-2 flex flex-col items-end gap-1 pointer-events-none">
                    {photo.isCover && (
                      <span className="px-2 py-0.5 rounded bg-blue-500 text-black text-[10px] font-extrabold shadow flex items-center gap-1">
                        <Star className="size-2.5 fill-black text-black" />
                        Cover
                      </span>
                    )}
                    {photo.isLogo && (
                      <span className="px-2 py-0.5 rounded bg-cyan-500 text-black text-[10px] font-extrabold shadow flex items-center gap-1">
                        <Sparkles className="size-2.5 fill-black text-black" />
                        Logo
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-xs text-white text-[10px] font-semibold capitalize border border-white/10">
                      {photo.category}
                    </span>
                  </div>

                  {/* Hover Actions Overlay */}
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 p-3">
                    <button
                      onClick={() => setPreviewPhoto(photo)}
                      title="View Photo"
                      className="p-2 rounded-lg bg-secondary border border-border hover:bg-secondary/80 text-foreground transition-colors cursor-pointer"
                    >
                      <Eye className="size-4" />
                    </button>
                    {!photo.isCover && (
                      <button
                        onClick={() => handleSetCover(photo)}
                        title="Set as Cover Photo"
                        className="px-2.5 py-1.5 rounded-lg bg-blue-500/20 border border-blue-500/60 hover:bg-blue-500/30 text-blue-400 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Set Cover
                      </button>
                    )}
                    {!photo.isLogo && (
                      <button
                        onClick={() => handleSetLogo(photo)}
                        title="Set as Logo"
                        className="px-2.5 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/60 hover:bg-cyan-500/30 text-cyan-400 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Set Logo
                      </button>
                    )}
                    <button
                      onClick={() => handleDeletePhoto(photo.id)}
                      title="Delete from Google"
                      className="p-2 rounded-lg bg-rose-500/20 border border-rose-500/60 hover:bg-rose-500/30 text-rose-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>

                {/* Card Details Body */}
                <div className="p-3.5 space-y-2 text-xs">
                  <div>
                    <h3 className="font-bold text-foreground truncate text-xs">{photo.title}</h3>
                    <p className="text-[11px] text-blue-500 font-semibold truncate mt-0.5">
                      {photo.locationName}
                    </p>
                    <p className="text-[10px] text-muted-foreground/75 font-mono">
                      {photo.storeCode}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-2 border-t border-border">
                    <span>{photo.uploadedAt}</span>
                    <span className="font-mono text-emerald-400 font-semibold">
                      {photo.views.toLocaleString()} views
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Fullscreen Photo Preview Modal */}
      {previewPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-3xl rounded-2xl bg-card dark:bg-[#141416] border border-border p-6 shadow-2xl space-y-4 text-foreground">
            <button
              onClick={() => setPreviewPhoto(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg border border-border bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="size-4" />
            </button>

            <div className="space-y-1">
              <h2 className="text-lg font-bold text-foreground">{previewPhoto.title}</h2>
              <p className="text-xs text-blue-500 font-semibold">{previewPhoto.locationName} ({previewPhoto.storeCode})</p>
            </div>

            <div className="rounded-xl overflow-hidden bg-black max-h-[60vh] flex items-center justify-center border border-border">
              <img src={previewPhoto.url} alt={previewPhoto.title} className="max-h-[60vh] w-auto object-contain" />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground pt-2">
              <div className="flex items-center gap-4">
                <span>Dimensions: <strong className="text-foreground">{previewPhoto.width}x{previewPhoto.height}</strong></span>
                <span>Size: <strong className="text-foreground">{previewPhoto.sizeKb} KB</strong></span>
                <span>Category: <strong className="text-foreground capitalize">{previewPhoto.category}</strong></span>
              </div>

              <div className="flex items-center gap-2">
                {!previewPhoto.isCover && (
                  <button
                    onClick={() => {
                      handleSetCover(previewPhoto);
                      setPreviewPhoto(null);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-400 text-black text-xs font-bold transition-colors cursor-pointer"
                  >
                    Set as Cover
                  </button>
                )}
                {!previewPhoto.isLogo && (
                  <button
                    onClick={() => {
                      handleSetLogo(previewPhoto);
                      setPreviewPhoto(null);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition-colors cursor-pointer"
                  >
                    Set as Logo
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Photos to Google Modal */}
      {isUploadModalOpen && (
        <UploadPhotosModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onUpload={handleAddNewPhoto}
        />
      )}
    </div>
  );
}

// Modal component for Uploading Photos to Google Business Profile
function UploadPhotosModal({
  isOpen,
  onClose,
  onUpload,
}: {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (photo: PhotoItem) => void;
}) {
  const [photoTitle, setPhotoTitle] = useState("");
  const [category, setCategory] = useState<PhotoCategoryType>("exterior");
  const [locationId, setLocationId] = useState("req-1");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      if (!photoTitle) {
        setPhotoTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handlePublish = () => {
    if (!selectedFile && !previewUrl) {
      toast.error("Please select an image file to upload.");
      return;
    }

    setIsPublishing(true);
    toast.info("Connecting to Google Business Profile API...");

    setTimeout(() => {
      const targetLoc = LOCATIONS_LIST.find((l) => l.id === locationId) || LOCATIONS_LIST[1];
      const newPhoto: PhotoItem = {
        id: `pho-${Date.now()}`,
        url: previewUrl || "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1000&q=80",
        title: photoTitle || "New Published Photo",
        category,
        locationId: targetLoc.id,
        locationName: targetLoc.name.split("(")[0].trim(),
        storeCode: targetLoc.name.match(/\(([^)]+)\)/)?.[1] || "demo-store",
        uploadedAt: "Just now",
        views: 1,
        width: 1920,
        height: 1080,
        sizeKb: selectedFile ? Math.round(selectedFile.size / 1024) : 1500,
        status: "Published",
        isCover: category === "cover",
        isLogo: category === "logo",
      };

      onUpload(newPhoto);
      setIsPublishing(false);
      toast.success(`Photo "${newPhoto.title}" successfully published on Google Business Profile!`);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs animate-in fade-in duration-150 p-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-card dark:bg-[#141416] border border-border p-6 shadow-2xl space-y-5 text-foreground">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg border border-border bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <X className="size-4" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-2">
          <GoogleGIcon className="size-5" />
          <h2 className="text-lg font-bold text-foreground">Publish Photo to Google</h2>
        </div>

        {/* Form Controls */}
        <div className="space-y-4 text-xs">
          {/* Category Select */}
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">Photo Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as PhotoCategoryType)}
              className="w-full rounded-xl bg-background border border-border p-2.5 text-xs text-foreground focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="exterior" className="bg-popover text-foreground">Exterior View</option>
              <option value="interior" className="bg-popover text-foreground">Interior View</option>
              <option value="cover" className="bg-popover text-foreground">Cover Photo</option>
              <option value="logo" className="bg-popover text-foreground">Profile Logo</option>
              <option value="product" className="bg-popover text-foreground">Product Imagery</option>
              <option value="team" className="bg-popover text-foreground">Team Photo</option>
              <option value="other" className="bg-popover text-foreground">Other</option>
            </select>
          </div>

          {/* Location Select */}
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">Target Store Location</label>
            <select
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
              className="w-full rounded-xl bg-background border border-border p-2.5 text-xs text-foreground focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {LOCATIONS_LIST.filter((l) => l.id !== "all").map((loc) => (
                <option key={loc.id} value={loc.id} className="bg-popover text-foreground">
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Photo Title */}
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">Photo Title / Caption</label>
            <input
              type="text"
              value={photoTitle}
              onChange={(e) => setPhotoTitle(e.target.value)}
              placeholder="e.g. Main Store Entrance View"
              className="w-full rounded-xl bg-background border border-border p-2.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* File Drag and Drop Box */}
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">Image File</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="rounded-xl border-2 border-dashed border-border hover:border-blue-500 bg-background p-6 text-center cursor-pointer transition-colors flex flex-col items-center justify-center space-y-2"
            >
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {previewUrl ? (
                <div className="relative size-24 rounded-lg overflow-hidden border border-border">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <>
                  <UploadCloud className="size-8 text-blue-500" />
                  <p className="text-xs font-semibold text-foreground">
                    Click to select or drag photo here
                  </p>
                  <p className="text-[10px] text-muted-foreground">JPG, PNG or WEBP (Max 10MB)</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-xs font-semibold text-foreground transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="px-5 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-black text-xs font-bold transition-all cursor-pointer shadow-md shadow-blue-950/30 flex items-center gap-1.5"
          >
            <Upload className="size-3.5" />
            <span>{isPublishing ? "Publishing to Google..." : "Publish to Google"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
