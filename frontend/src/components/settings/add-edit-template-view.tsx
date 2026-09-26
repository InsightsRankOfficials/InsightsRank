import React, { useState } from "react";
import { ArrowLeft, Save, Home, ChevronRight } from "lucide-react";
import { ReviewTemplateItem } from "@/data/settings-analytics";

interface AddEditTemplateViewProps {
  initialTemplate?: ReviewTemplateItem | null;
  onBack: () => void;
  onSave: (templateData: ReviewTemplateItem) => void;
}

export function AddEditTemplateView({
  initialTemplate,
  onBack,
  onSave,
}: AddEditTemplateViewProps) {
  const isEditing = !!initialTemplate;

  const [name, setName] = useState(initialTemplate?.name || "");
  const [sentiment, setSentiment] = useState<ReviewTemplateItem["sentiment"]>(
    initialTemplate?.sentiment || "Positive"
  );
  const [rating, setRating] = useState(initialTemplate?.rating || "5 Stars");
  const [linkedAccounts, setLinkedAccounts] = useState(
    initialTemplate?.linkedLocationAccounts || 1
  );
  const [isActive, setIsActive] = useState(
    initialTemplate ? initialTemplate.status === "Active" : true
  );
  const [templateContent, setTemplateContent] = useState(
    initialTemplate?.templateContent ||
      `Dear [:reviewer_name],\nThank you so much for your rating and feedback. We are always striving to deliver the best experience.\n\nWarm regards,\nCustomer Support Team`
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const savedTemplate: ReviewTemplateItem = {
      id: initialTemplate?.id || `template-${Date.now()}`,
      name,
      sentiment,
      rating,
      linkedLocationAccounts: Number(linkedAccounts) || 1,
      activeTemplates: initialTemplate?.activeTemplates || "3/3",
      status: isActive ? "Active" : "Inactive",
      lastModifiedAt: "Just now",
      templateContent,
    };

    onSave(savedTemplate);
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
          Settings
        </span>
        <ChevronRight className="size-3 text-muted-foreground/60" />
        <span onClick={onBack} className="cursor-pointer hover:text-foreground font-medium">
          Review Templates
        </span>
        <ChevronRight className="size-3 text-muted-foreground/60" />
        <span className="font-semibold text-foreground">
          {isEditing ? "Edit Template" : "Add Template"}
        </span>
      </div>

      {/* Rounded Off-Black Card Container wrapping main content */}
      <div className="rounded-2xl bg-card dark:bg-[#141416] p-6 sm:p-8 space-y-6 shadow-xl border border-border">
        {/* Header & Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              {isEditing ? "Edit Template" : "Add Template"}
            </h1>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Create and edit pre-approved response template content and target sentiment variables.
            </p>
          </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-1.5 rounded-lg bg-blue-400 hover:bg-blue-500 text-black text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <Save className="size-3.5" />
            Save
          </button>

          <button
            type="button"
            onClick={onBack}
            className="px-4 py-1.5 rounded-lg border border-border dark:border-[#27272a] bg-background dark:bg-[#18181b] hover:bg-secondary text-xs font-semibold text-foreground flex items-center gap-1 transition-colors cursor-pointer"
          >
            <ArrowLeft className="size-3.5" />
            Back
          </button>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
        {/* Section 1: Template Info */}
        <div className="rounded-xl border border-border dark:border-[#27272a] bg-card dark:bg-[#121214] p-6 space-y-4 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-4 space-y-1">
              <h3 className="text-xs font-bold text-foreground">Template Info</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Define template parameters and linked location scope.
              </p>
            </div>

            <div className="md:col-span-8 space-y-4">
              {/* Template Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">
                  Template Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. 5 Star rating templates"
                  className="w-full px-3 py-2 rounded-lg border border-border dark:border-[#27272a] bg-background dark:bg-[#09090b] text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Grid 2 Cols: Sentiment & Rating */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">
                    Sentiment <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={sentiment}
                    onChange={(e) => setSentiment(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-border dark:border-[#27272a] bg-background dark:bg-[#09090b] text-xs text-foreground focus:outline-none focus:border-blue-500 cursor-pointer font-medium"
                  >
                    <option value="Positive">Positive</option>
                    <option value="Mixed">Mixed</option>
                    <option value="Negative">Negative</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">
                    Rating <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border dark:border-[#27272a] bg-background dark:bg-[#09090b] text-xs text-foreground focus:outline-none focus:border-blue-500 cursor-pointer font-medium"
                  >
                    <option value="5 Stars">5 Stars</option>
                    <option value="4 Stars">4 Stars</option>
                    <option value="3 Stars">3 Stars</option>
                    <option value="2 Stars">2 Stars</option>
                    <option value="1 Star">1 Star</option>
                  </select>
                </div>
              </div>

              {/* Linked Location Accounts */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">
                  Linked Location Accounts <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  value={linkedAccounts}
                  onChange={(e) => setLinkedAccounts(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-border dark:border-[#27272a] bg-background dark:bg-[#09090b] text-xs text-foreground focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              {/* Is Active Toggle */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    isActive ? "bg-blue-400" : "bg-zinc-700"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-black shadow ring-0 transition duration-200 ease-in-out ${
                      isActive ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
                <span className="text-xs font-bold text-foreground">Is Active?</span>
              </div>
              <p className="text-[10px] text-muted-foreground italic">
                * Toggle to activate or deactivate this template.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Template Content */}
        <div className="rounded-xl border border-border dark:border-[#27272a] bg-card dark:bg-[#121214] p-6 space-y-4 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-4 space-y-1">
              <h3 className="text-xs font-bold text-foreground">Template Response Content</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Craft canned reply responses with dynamic placeholder variables.
              </p>
            </div>

            <div className="md:col-span-8 space-y-3">
              <textarea
                rows={8}
                value={templateContent}
                onChange={(e) => setTemplateContent(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-border dark:border-[#27272a] bg-background dark:bg-[#09090b] text-xs text-foreground font-mono leading-relaxed focus:outline-none focus:border-blue-500"
              />

              <div className="p-3 rounded-lg border border-border dark:border-[#27272a] bg-secondary/40 dark:bg-[#18181b]/60 space-y-1 text-[11px] text-muted-foreground">
                <p className="font-bold text-foreground text-xs">Available Placeholders</p>
                <p>
                  * <span className="text-blue-400 font-mono">[:reviewer_name]</span>, <span className="text-blue-400 font-mono">[:rating]</span>, <span className="text-blue-400 font-mono">[:location_name]</span>, <span className="text-blue-400 font-mono">[:support_email]</span>, <span className="text-blue-400 font-mono">[:support_phone]</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
);
}
