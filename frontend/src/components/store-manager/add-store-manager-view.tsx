import React, { useState } from "react";
import { EmptyTableRow } from "@/components/ui/empty-state";
import { STORE_LOCATIONS_REQUESTS_LIST, StoreManagerItem } from "@/data/store-manager-analytics";
import { Home, ChevronRight, Save, ArrowLeft, Plus, Trash2 } from "lucide-react";

interface AddStoreManagerViewProps {
  onBack: () => void;
  onSave: (manager: Partial<StoreManagerItem>) => void;
  initialData?: StoreManagerItem | null;
}

export function AddStoreManagerView({
  onBack,
  onSave,
  initialData,
}: AddStoreManagerViewProps) {
  const [firstName, setFirstName] = useState(initialData?.firstName || "");
  const [lastName, setLastName] = useState(initialData?.lastName || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [mobile, setMobile] = useState(initialData?.mobile || "");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [isActive, setIsActive] = useState(initialData?.status === "Active" ?? true);

  // Form Validation Touch States
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Locations Access state
  const [selectedLocations, setSelectedLocations] = useState<
    { id: string; storeName: string; storeCode: string }[]
  >(initialData?.accessibleLocations || []);
  const [locationInput, setLocationInput] = useState("");

  const handleAddLocation = () => {
    if (!locationInput.trim()) return;
    const matched = STORE_LOCATIONS_REQUESTS_LIST.find(
      (s) =>
        s.storeName.toLowerCase().includes(locationInput.toLowerCase()) ||
        s.storeCode.toLowerCase().includes(locationInput.toLowerCase())
    );

    const newItem = matched
      ? { id: matched.id, storeName: matched.storeName, storeCode: matched.storeCode }
      : {
          id: `loc-${Date.now()}`,
          storeName: locationInput,
          storeCode: `demo-${locationInput.toLowerCase().replace(/\s+/g, "-")}`,
        };

    if (!selectedLocations.some((loc) => loc.id === newItem.id)) {
      setSelectedLocations([...selectedLocations, newItem]);
    }
    setLocationInput("");
  };

  const handleRemoveLocation = (id: string) => {
    setSelectedLocations((prev) => prev.filter((loc) => loc.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      locations: true,
    });

    if (!firstName || !lastName || !email || selectedLocations.length === 0) {
      return;
    }

    onSave({
      firstName,
      lastName,
      email,
      mobile: mobile || "-",
      status: isActive ? "Active" : "Inactive",
      loginStatus: "Invited",
      lastSeen: "Never",
      lastLoginIp: "Never",
      lastModifiedAt: "Just now",
      accessibleLocations: selectedLocations,
    });
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200 pb-16">
      {/* Breadcrumb Navigation matching Locations section */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground px-1 pb-1">
        <Home
          className="size-3.5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
          onClick={onBack}
        />
        <ChevronRight className="size-3 text-muted-foreground/60" />
        <span onClick={onBack} className="cursor-pointer hover:text-foreground font-medium">
          Store Managers
        </span>
        <ChevronRight className="size-3 text-muted-foreground/60" />
        <span className="font-semibold text-foreground">
          {initialData ? "Edit Store Manager" : "Add Store Manager"}
        </span>
      </div>

      {/* Rounded Off-Black Card Container wrapping main content */}
      <div className="rounded-2xl bg-card dark:bg-[#141416] p-6 sm:p-8 space-y-6 shadow-xl border border-border">
        {/* Top Header & Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              {initialData ? "Edit Store Manager" : "Add Store Manager"}
            </h1>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {initialData ? "Update manager details and store access permissions." : "Create a new store manager profile and assign location access."}
            </p>
          </div>

          <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-1.5 rounded-lg bg-blue-400 hover:bg-blue-500 text-black text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <Save className="size-3.5" />
            Save
          </button>
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-1.5 rounded-lg border border-border dark:border-[#27272a] bg-background dark:bg-[#18181b] hover:bg-secondary/40 text-xs font-semibold text-foreground flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="size-3.5" />
            Back
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Store Manager Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 rounded-xl border border-border dark:border-[#27272a] bg-card dark:bg-[#121214]">
          {/* Left Description Column */}
          <div className="lg:col-span-4 space-y-1">
            <h3 className="text-sm font-bold text-foreground">Store Manager Details</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The details entered here will be used to identify the store manager.
            </p>
          </div>

          {/* Right Form Fields Column */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* First Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                First Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onBlur={() => setTouched((p) => ({ ...p, firstName: true }))}
                placeholder="First name"
                className="w-full px-3 py-2 rounded-lg border border-border dark:border-[#27272a] bg-background dark:bg-[#09090b] text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              />
              {touched.firstName && !firstName && (
                <div className="space-y-0.5">
                  <p className="text-[11px] text-rose-500 font-medium">
                    The first name field is required.
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    * Only letters, single spaces, apostrophes, and hyphens allowed.
                  </p>
                </div>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Last Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onBlur={() => setTouched((p) => ({ ...p, lastName: true }))}
                placeholder="Last name"
                className="w-full px-3 py-2 rounded-lg border border-border dark:border-[#27272a] bg-background dark:bg-[#09090b] text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              />
              {touched.lastName && !lastName && (
                <div className="space-y-0.5">
                  <p className="text-[11px] text-rose-500 font-medium">
                    The last name field is required.
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    * Only letters, single spaces, apostrophes, and hyphens allowed.
                  </p>
                </div>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5 sm:col-span-1">
              <label className="text-xs font-semibold text-foreground">
                Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((p) => ({ ...p, email: true }))}
                placeholder="email@example.com"
                className="w-full px-3 py-2 rounded-lg border border-border dark:border-[#27272a] bg-background dark:bg-[#09090b] text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              />
              {touched.email && !email && (
                <p className="text-[11px] text-rose-500 font-medium">
                  The email field is required.
                </p>
              )}
            </div>

            {/* Mobile */}
            <div className="space-y-1.5 sm:col-span-1">
              <label className="text-xs font-semibold text-foreground">Mobile</label>
              <div className="flex rounded-lg border border-border dark:border-[#27272a] bg-background dark:bg-[#09090b] overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                <span className="px-3 py-2 text-xs text-muted-foreground bg-secondary dark:bg-[#18181b] border-r border-border dark:border-[#27272a] flex items-center gap-1 select-none font-medium">
                  🇮🇳 +91
                </span>
                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="81234 56789"
                  className="w-full px-3 py-2 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                />
              </div>
            </div>

            {/* Timezone */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-foreground">
                Timezone <span className="text-rose-500">*</span>
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border dark:border-[#27272a] bg-background dark:bg-[#09090b] text-xs text-foreground focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer font-medium"
              >
                <option value="Asia/Kolkata" className="bg-popover text-foreground">Asia/Kolkata (GMT+05:30)</option>
                <option value="UTC" className="bg-popover text-foreground">UTC (GMT+00:00)</option>
                <option value="America/New_York" className="bg-popover text-foreground">America/New_York (GMT-05:00)</option>
                <option value="Europe/London" className="bg-popover text-foreground">Europe/London (GMT+00:00)</option>
              </select>
            </div>

            {/* Is Active Toggle */}
            <div className="space-y-1.5 sm:col-span-2 pt-1">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isActive ? "bg-blue-400" : "bg-zinc-300 dark:bg-zinc-700"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-background dark:bg-black shadow ring-0 transition duration-200 ease-in-out ${
                      isActive ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
                <span className="text-xs font-bold text-foreground">
                  Is Active?
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                * Toggle to activate or deactivate this store manager.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Location Access */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 rounded-xl border border-border dark:border-[#27272a] bg-card dark:bg-[#121214]">
          {/* Left Description Column */}
          <div className="lg:col-span-4 space-y-1">
            <h3 className="text-sm font-bold text-foreground">Location Access</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Manage the locations this store manager has access to.
            </p>
          </div>

          {/* Right Access Table & Selector */}
          <div className="lg:col-span-8 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Locations <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  placeholder="Enter store name or code (e.g. Demo Store 297)"
                  className="flex-1 px-3 py-2 rounded-lg border border-border dark:border-[#27272a] bg-background dark:bg-[#09090b] text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={handleAddLocation}
                  className="px-4 py-2 rounded-lg bg-blue-400 hover:bg-blue-500 text-black text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Plus className="size-3.5" />
                  Add Access
                </button>
              </div>

              {touched.locations && selectedLocations.length === 0 && (
                <p className="text-[11px] text-rose-500 font-medium">
                  The locations field is required.
                </p>
              )}
            </div>

            {/* Selected Locations Table */}
            <div className="rounded-lg border border-border dark:border-[#27272a] bg-background dark:bg-[#09090b] overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border dark:border-[#27272a] bg-secondary/30 dark:bg-[#18181b]/60 text-muted-foreground font-semibold">
                    <th className="py-2.5 px-4 w-12 text-center">#</th>
                    <th className="py-2.5 px-4">Store Name</th>
                    <th className="py-2.5 px-4">Store Code</th>
                    <th className="py-2.5 px-4 w-16 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 dark:divide-[#27272a]/50 text-foreground">
                  {selectedLocations.length === 0 ? (
                    <EmptyTableRow
                      colSpan={4}
                      description="No record found. Please change your search criteria."
                    />
                  ) : (
                    selectedLocations.map((loc, idx) => (
                      <tr key={loc.id} className="hover:bg-secondary/20 transition-colors">
                        <td className="py-2.5 px-4 text-center text-muted-foreground font-mono">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-4 font-semibold text-foreground">
                          {loc.storeName}
                        </td>
                        <td className="py-2.5 px-4 text-muted-foreground font-mono text-[11px]">
                          {loc.storeCode}
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveLocation(loc.id)}
                            className="p-1 rounded text-rose-500 dark:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
);
}
