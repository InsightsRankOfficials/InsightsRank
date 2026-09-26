import React, { useState } from "react";
import { ArrowLeft, Upload, Lock, Calendar, Clock, Edit2, Home, ChevronRight } from "lucide-react";
import { CTA_BUTTON_OPTIONS } from "@/data/posts-analytics";

interface CreatePostUpdateViewProps {
  onBack: () => void;
  onPostNow: (postData: any) => void;
  onOpenEditSelection: () => void;
  selectedListingsCount?: number;
}

export function CreatePostUpdateView({
  onBack,
  onPostNow,
  onOpenEditSelection,
  selectedListingsCount = 315,
}: CreatePostUpdateViewProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [ctaButton, setCtaButton] = useState("None");
  const [mediaFile, setMediaFile] = useState<File | null>(null);

  // Platform selection
  const [googleSelected, setGoogleSelected] = useState(true);
  const [facebookSelected, setFacebookSelected] = useState(false);

  // Schedule later state
  const [scheduleLater, setScheduleLater] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("2026-09-20");
  const [scheduleTime, setScheduleTime] = useState("10:00");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMediaFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPostNow({
      type: "update",
      name,
      description,
      link,
      ctaButton,
      mediaFile,
      googleSelected,
      facebookSelected,
      scheduleLater,
      scheduleDate,
      scheduleTime,
      listingsCount: selectedListingsCount,
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
          Manage Posts
        </span>
        <ChevronRight className="size-3 text-muted-foreground/60" />
        <span className="font-semibold text-foreground">Create Post Update</span>
      </div>

      {/* Rounded Off-Black Card Container wrapping main content */}
      <div className="rounded-2xl bg-card dark:bg-[#141416] p-6 sm:p-8 space-y-6 shadow-xl border border-border">
        {/* Top Header & Action Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">Create Post Update</h1>
            <p className="mt-0.5 text-xs text-muted-foreground">Publish fresh news, announcements, and updates to Google & Facebook profiles.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBack}
              className="px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-secondary text-xs font-semibold text-foreground flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="size-3.5" /> Back
            </button>

          <button
            type="button"
            onClick={onOpenEditSelection}
            className="px-3.5 py-1.5 rounded-lg border border-blue-500/40 bg-blue-500/10 hover:bg-blue-500/20 text-xs font-bold text-blue-400 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Edit2 className="size-3.5" /> Edit Selection
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-1.5 rounded-lg bg-blue-400 hover:bg-blue-500 text-black text-xs font-bold transition-colors cursor-pointer shadow-sm"
          >
            Post Now
          </button>
        </div>
      </div>

      {/* Subtitle listing selection count indicator */}
      <p className="text-xs text-muted-foreground font-medium">
        All ({selectedListingsCount}) Business Listings have been selected for the post. Listing may differ for each platform.
      </p>

      {/* 2-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (3 Cols): Select Platforms & Schedule Later */}
        <div className="lg:col-span-3 space-y-4 rounded-xl border border-border bg-card dark:bg-[#121214] p-4">
          {/* Select Platforms */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-foreground block">Select Platforms</span>

            <div
              onClick={() => setGoogleSelected(!googleSelected)}
              className={`flex items-center justify-between p-2.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                googleSelected
                  ? "border-blue-500/50 bg-blue-500/10 text-foreground"
                  : "border-border bg-background text-muted-foreground"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="size-4 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center text-[10px]">
                  G
                </span>
                <span>Google</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-bold">
                {selectedListingsCount}
              </span>
            </div>

            <div
              onClick={() => setFacebookSelected(!facebookSelected)}
              className={`flex items-center justify-between p-2.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                facebookSelected
                  ? "border-blue-500/50 bg-blue-500/10 text-foreground"
                  : "border-border bg-background text-muted-foreground"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="size-4 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px]">
                  f
                </span>
                <span>Facebook</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px] font-bold">
                0
              </span>
            </div>
          </div>

          {/* Schedule Later */}
          <div className="pt-3 border-t border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">Schedule Later</span>
              <button
                type="button"
                onClick={() => setScheduleLater(!scheduleLater)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  scheduleLater ? "bg-blue-400" : "bg-muted"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-black shadow ring-0 transition duration-200 ease-in-out ${
                    scheduleLater ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {!scheduleLater ? (
              <div className="flex items-center gap-2 p-2 rounded bg-secondary text-[11px] text-sky-400 font-medium">
                <Lock className="size-3.5" />
                <span>No schedule set</span>
              </div>
            ) : (
              <div className="space-y-2 pt-1">
                <div>
                  <label className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-border bg-background text-xs text-foreground focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-border bg-background text-xs text-foreground focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (9 Cols): Post Update Form Fields */}
        <div className="lg:col-span-9 space-y-5 rounded-xl border border-border bg-card dark:bg-[#121214] p-5">
          {/* Name Field */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-foreground">
              Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-blue-500"
            />
            <p className="text-[10px] text-muted-foreground italic">
              * This info is needed for internal purpose
            </p>
          </div>

          {/* Post Description Field */}
          <div className="space-y-1 relative">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground">Post Description</label>
              <span className="text-[10px] text-muted-foreground font-mono">
                {description.length} / 1500
              </span>
            </div>
            <textarea
              rows={4}
              maxLength={1500}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What would you like to share?"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-blue-500 leading-relaxed"
            />
          </div>

          {/* Media Asset Upload Box */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-foreground">Media Asset</label>
            <label className="border-2 border-dashed border-border hover:border-blue-500/50 rounded-xl bg-background p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-center block">
              <input type="file" accept="image/*,video/*" onChange={handleFileChange} className="hidden" />
              <Upload className="size-6 text-muted-foreground" />
              <span className="text-xs font-bold text-foreground">Upload</span>
              {mediaFile && (
                <span className="text-[11px] text-blue-400 font-semibold">{mediaFile.name}</span>
              )}
            </label>
          </div>

          {/* Link Field */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-foreground">Link</label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Type here"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Additional Platform Customisation */}
          <div className="pt-4 border-t border-border space-y-3">
            <h3 className="text-xs font-bold text-foreground">Additional Platform Customisation</h3>

            <div className="flex items-center gap-2 text-xs font-bold text-foreground">
              <span className="size-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px]">
                G
              </span>
              <span>Google</span>
            </div>

            <div className="space-y-1 max-w-xs">
              <label className="text-xs font-semibold text-muted-foreground">CTA Button</label>
              <select
                value={ctaButton}
                onChange={(e) => setCtaButton(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {CTA_BUTTON_OPTIONS.map((c) => (
                  <option key={c} value={c} className="bg-popover text-foreground">
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}
