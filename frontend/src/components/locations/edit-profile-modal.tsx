import { useState } from "react";
import {
  ArrowRight,
  Calendar as CalendarIcon,
  ChevronRight,
  MapPin,
  Plus,
  Save,
  X,
} from "lucide-react";
import { GoogleGIcon } from "@/components/ui/google-g-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  location?: any;
  mode?: "edit" | "create";
}

export function EditProfileModal({
  open,
  onOpenChange,
  location,
  mode = "edit",
}: EditProfileModalProps) {
  const isEdit = mode === "edit";
  const [step, setStep] = useState(1);
  const [autoSync, setAutoSync] = useState(true);

  // Form state pre-populated for edit or blank for create
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
    websiteUrl: isEdit ? "https://insightsrank.com/" : "",
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
    onOpenChange(false);
  };

  const steps = [
    { num: 1, label: "Basic Info & Address" },
    { num: 2, label: "Contact & Website" },
    { num: 3, label: "Hours" },
    { num: 4, label: "Services" },
    { num: 5, label: "Media" },
    { num: 6, label: "Documents" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[95vw] max-h-[92vh] overflow-y-auto p-0 bg-white dark:bg-[#121214] border-slate-200 dark:border-[#27272a] text-foreground shadow-2xl rounded-xl">
        <DialogHeader className="sr-only">
          <DialogTitle>{mode === "create" ? "Create Profile" : "Edit Listing"}</DialogTitle>
        </DialogHeader>

        {/* Modal Top Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-3 border-b border-slate-200 dark:border-[#27272a] bg-white/95 dark:bg-[#121214]/95 backdrop-blur">
          {/* Title & Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="cursor-pointer hover:text-foreground">Master Profiles</span>
            <ChevronRight className="size-3" />
            <span className="font-semibold text-foreground">
              {mode === "create" ? "Create Profile" : "Edit Profile"}
            </span>
          </div>

          {/* Action Buttons */}
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
              onClick={() => onOpenChange(false)}
              className="h-8 border-slate-300 dark:border-[#3f3f46] bg-white dark:bg-[#18181b] hover:bg-slate-100 dark:hover:bg-[#27272a] text-foreground text-xs cursor-pointer"
            >
              Back
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Main Header Title */}
          <h1 className="text-xl font-bold text-foreground tracking-tight">
            {mode === "create" ? "Create Listing" : "Edit Listing"}
          </h1>

          {/* Stepper Navigation Bar */}
          <div className="flex items-center justify-center py-3 overflow-x-auto no-scrollbar border-b border-slate-200 dark:border-[#27272a]">
            <div className="flex items-center gap-2 sm:gap-4">
              {steps.map((s, idx) => {
                const isActive = step === s.num;
                const isCompleted = step > s.num;
                return (
                  <div key={s.num} className="flex items-center gap-2">
                    <button
                      onClick={() => setStep(s.num)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
                        isActive
                          ? "bg-blue-500 text-black font-extrabold shadow-md"
                          : isCompleted
                            ? "bg-slate-200 dark:bg-[#27272a] text-blue-400 font-semibold"
                            : "bg-white dark:bg-[#18181b] border border-slate-300 dark:border-[#27272a] text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span
                        className={`size-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                          isActive
                            ? "bg-black text-blue-400"
                            : isCompleted
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-slate-200 dark:bg-[#27272a] text-muted-foreground"
                        }`}
                      >
                        {s.num}
                      </span>
                      <span className="whitespace-nowrap">{s.label}</span>
                    </button>
                    {idx < steps.length - 1 && (
                      <div className="w-4 sm:w-8 h-[1px] bg-slate-300 dark:bg-[#27272a]" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 1: Basic Info & Address */}
          {step === 1 && (
            <div className="space-y-8">
              {/* Basic Info Section */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-4 space-y-1">
                  <h3 className="text-sm font-bold text-foreground">Basic Info</h3>
                  <p className="text-xs text-muted-foreground leading-normal">
                    Basic information of your business
                  </p>
                </div>

                <div className="md:col-span-8 space-y-4">
                  {/* Business Name & Store Code */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-foreground">
                        Business Name <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="h-9 bg-white dark:bg-black border-slate-300 dark:border-[#27272a] text-xs text-foreground focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-foreground">Store Code</Label>
                      <Input
                        value={formData.storeCode}
                        onChange={(e) => setFormData({ ...formData, storeCode: e.target.value })}
                        className="h-9 bg-white dark:bg-black border-slate-300 dark:border-[#27272a] text-xs text-foreground focus:border-blue-500 font-mono"
                      />
                    </div>
                  </div>

                  {/* Opening Date & Business Status */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-foreground">Opening Date</Label>
                      <div className="relative">
                        <Input
                          placeholder="Select opening date"
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

                  {/* Short Description */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">Business Description (short)</Label>
                    <Textarea
                      rows={2}
                      value={formData.shortDesc}
                      onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                      className="bg-white dark:bg-black border-slate-300 dark:border-[#27272a] text-xs text-foreground focus:border-blue-500"
                    />
                    <div className="text-right text-[10px] text-muted-foreground">
                      {formData.shortDesc.length} / 300
                    </div>
                  </div>

                  {/* Long Description */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">Business Description (long)</Label>
                    <Textarea
                      rows={4}
                      value={formData.longDesc}
                      onChange={(e) => setFormData({ ...formData, longDesc: e.target.value })}
                      className="bg-white dark:bg-black border-slate-300 dark:border-[#27272a] text-xs text-foreground focus:border-blue-500"
                    />
                    <div className="text-right text-[10px] text-muted-foreground">
                      {formData.longDesc.length} / 750
                    </div>
                  </div>

                  {/* Tags */}
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
                            className="h-7 px-2 bg-blue-500 text-black text-[10px] font-bold"
                          >
                            Add
                          </Button>
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      * Add custom tags to help organize and filter your locations
                    </p>
                  </div>

                  {/* Auto Sync Switch */}
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
                        value={formData.address1}
                        onChange={(e) => setFormData({ ...formData, address1: e.target.value })}
                        className="h-9 bg-white dark:bg-black border-slate-300 dark:border-[#27272a] text-xs text-foreground focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-foreground">Address line 2</Label>
                      <Input
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
                        value={formData.address3}
                        onChange={(e) => setFormData({ ...formData, address3: e.target.value })}
                        className="h-9 bg-white dark:bg-black border-slate-300 dark:border-[#27272a] text-xs text-foreground focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-foreground">Address line 4</Label>
                      <Input
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
                        value={formData.lng}
                        onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                        className="h-9 bg-white dark:bg-black border-slate-300 dark:border-[#27272a] text-xs text-foreground focus:border-blue-500 font-mono"
                      />
                    </div>
                  </div>

                  {/* Interactive Pin Map Box */}
                  <div className="rounded-xl border border-slate-300 dark:border-[#27272a] bg-white dark:bg-black overflow-hidden space-y-2 p-3">
                    <div className="flex items-center justify-between p-2 rounded bg-blue-500/10 border border-blue-500/30 text-xs text-blue-400">
                      <span>Your pin is set to coordinates.</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toast.success("Pin snapped to current address coordinates")}
                        className="h-6 text-[10px] text-blue-500 hover:bg-blue-500/20 font-bold px-2 cursor-pointer"
                      >
                        Snap pin to address
                      </Button>
                    </div>

                    <div className="h-44 bg-white dark:bg-black rounded-lg border border-slate-300 dark:border-[#27272a] relative flex items-center justify-center">
                      <div className="flex flex-col items-center gap-1">
                        <MapPin className="size-8 text-blue-500 animate-bounce" />
                        <span className="text-[11px] font-mono text-muted-foreground">
                          {formData.lat}, {formData.lng}
                        </span>
                      </div>
                      <div className="absolute bottom-2 left-2 flex gap-1">
                        <Badge className="bg-slate-200 dark:bg-[#27272a] text-foreground text-[10px] cursor-pointer">Address marker</Badge>
                        <Badge className="bg-slate-200 dark:bg-[#27272a] text-foreground text-[10px] cursor-pointer">Coordinate position</Badge>
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
                        value={formData.primaryCategory}
                        onChange={(e) => setFormData({ ...formData, primaryCategory: e.target.value })}
                        className="h-9 bg-white dark:bg-black border-slate-300 dark:border-[#27272a] text-xs text-foreground focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Additional Categories */}
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
                    </div>
                  </div>

                  {/* Labels */}
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
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      * Enter keywords separated by commas. Maximum 10 labels allowed.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Navigation for Step 1 */}
              <div className="flex justify-end pt-4 border-t border-slate-300 dark:border-[#27272a]">
                <Button
                  onClick={() => setStep(2)}
                  className="bg-blue-500 hover:bg-blue-600 text-black font-semibold text-xs gap-1 cursor-pointer"
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
              {/* Contact Section */}
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
                        value={formData.primaryPhone}
                        onChange={(e) => setFormData({ ...formData, primaryPhone: e.target.value })}
                        className="h-9 bg-white dark:bg-black border-slate-300 dark:border-[#27272a] text-xs text-foreground focus:border-blue-500 font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-foreground">Additional Phone Number 1</Label>
                      <Input
                        value={formData.additionalPhone1}
                        onChange={(e) => setFormData({ ...formData, additionalPhone1: e.target.value })}
                        className="h-9 bg-white dark:bg-black border-slate-300 dark:border-[#27272a] text-xs text-foreground focus:border-blue-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">Additional Phone Number 2</Label>
                    <Input
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
                        value={formData.supportPhone}
                        onChange={(e) => setFormData({ ...formData, supportPhone: e.target.value })}
                        className="h-9 bg-white dark:bg-black border-slate-300 dark:border-[#27272a] text-xs text-foreground focus:border-blue-500 font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-foreground">Customer Support Email</Label>
                      <Input
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

              {/* Reporting Persons */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-4 space-y-1">
                  <h3 className="text-sm font-bold text-foreground">Reporting Persons</h3>
                  <p className="text-xs text-muted-foreground leading-normal">
                    Add email addresses of the reporting persons for this location.
                  </p>
                </div>

                <div className="md:col-span-8 space-y-2">
                  <Label className="text-xs font-semibold text-foreground">Reporting Person Email</Label>
                  <div className="flex flex-wrap gap-2 p-2 rounded-md bg-white dark:bg-black border border-slate-300 dark:border-[#27272a] min-h-[44px]">
                    <Badge className="bg-slate-100 dark:bg-[#27272a] text-foreground text-xs gap-1 py-1 px-2">
                      <span>{formData.reportingEmail}</span>
                      <X className="size-3 text-muted-foreground hover:text-foreground cursor-pointer" />
                    </Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    * Enter email addresses separated by commas.
                  </p>
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
                  <Input
                    value={formData.websiteUrl}
                    onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                    className="h-9 bg-white dark:bg-black border-slate-300 dark:border-[#27272a] text-xs text-foreground focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Bottom Navigation for Step 2 */}
              <div className="flex justify-between pt-4 border-t border-slate-300 dark:border-[#27272a]">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="border-slate-300 dark:border-[#3f3f46] bg-white dark:bg-black hover:bg-slate-100 dark:hover:bg-[#27272a] text-foreground text-xs cursor-pointer"
                >
                  ← Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  className="bg-blue-500 hover:bg-blue-600 text-black font-semibold text-xs gap-1 cursor-pointer"
                >
                  <span>Next</span>
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEPS 3-6 generic smooth handler */}
          {step > 2 && (
            <div className="p-8 text-center space-y-4 border border-slate-300 dark:border-[#27272a] rounded-xl bg-white dark:bg-[#18181b]">
              <h3 className="text-base font-bold text-foreground">
                Step {step}: {steps.find((s) => s.num === step)?.label}
              </h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                Configure store hours, service offerings, image assets, and compliance documents for {formData.name}.
              </p>

              <div className="flex justify-between pt-4 max-w-md mx-auto">
                <Button
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  className="border-slate-300 dark:border-[#3f3f46] bg-white dark:bg-[#18181b] hover:bg-slate-100 dark:hover:bg-[#27272a] text-xs cursor-pointer text-foreground"
                >
                  ← Back
                </Button>
                {step < 6 ? (
                  <Button
                    onClick={() => setStep(step + 1)}
                    className="bg-blue-500 hover:bg-blue-600 text-black font-semibold text-xs cursor-pointer"
                  >
                    Next Step →
                  </Button>
                ) : (
                  <Button
                    onClick={handleSave}
                    className="bg-blue-500 hover:bg-blue-600 text-black font-semibold text-xs cursor-pointer"
                  >
                    Complete & Save
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
