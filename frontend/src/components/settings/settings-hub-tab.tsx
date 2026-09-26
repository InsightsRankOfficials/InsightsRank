import React, { useState } from "react";
import {
  Sparkles,
  FileText,
  SlidersHorizontal,
  Database,
  Building2,
  MapPin,
  QrCode,
  Settings as SettingsIcon,
  ChevronRight,
  X,
  Save,
  CheckCircle2,
} from "lucide-react";
import { AIPromptsListView } from "./ai-prompts-list-view";
import { AddEditPromptView } from "./add-edit-prompt-view";
import { ReviewTemplatesListView } from "./review-templates-list-view";
import {
  AIPromptItem,
  ReviewTemplateItem,
  INITIAL_AI_PROMPTS,
  INITIAL_REVIEW_TEMPLATES,
} from "@/data/settings-analytics";

type SettingsViewMode =
  | "HUB"
  | "AI_PROMPTS_LIST"
  | "ADD_AI_PROMPT"
  | "EDIT_AI_PROMPT"
  | "REVIEW_TEMPLATES_LIST";

interface GenericConfigModalProps {
  title: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
}

function GenericConfigModal({
  title,
  description,
  isOpen,
  onClose,
}: GenericConfigModalProps) {
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-xl border border-border dark:border-[#27272a] bg-card dark:bg-[#121214] text-foreground p-6 shadow-2xl space-y-5 relative">
        <div className="flex items-center justify-between border-b border-border dark:border-[#27272a] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-400/10 text-blue-400 border border-blue-400/20">
              <SettingsIcon className="size-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-foreground">{title}</h3>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {saved ? (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-2">
            <CheckCircle2 className="size-12 text-emerald-400 animate-bounce" />
            <h4 className="font-bold text-lg text-foreground">Settings Updated!</h4>
            <p className="text-xs text-muted-foreground">Your changes have been saved successfully.</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-muted-foreground">Module Status</label>
              <select className="w-full px-3 py-2 rounded-lg border border-border dark:border-[#27272a] bg-background dark:bg-[#18181b] text-foreground focus:border-blue-500 focus:outline-none">
                <option value="enabled">Enabled (Active)</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-muted-foreground">Configuration Option / API Key</label>
              <input
                type="text"
                defaultValue="DEFAULT_CONFIG_PROD_V1"
                className="w-full px-3 py-2 rounded-lg border border-border dark:border-[#27272a] bg-background dark:bg-[#18181b] text-foreground focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-muted-foreground">Notification Preferences</label>
              <div className="flex items-center gap-3 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-blue-400 size-4 rounded" />
                  <span>Email Alerts</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-blue-400 size-4 rounded" />
                  <span>Webhook Sync</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-border dark:border-[#27272a]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-border dark:border-[#27272a] bg-background dark:bg-[#18181b] hover:bg-secondary font-semibold text-foreground cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-400 hover:bg-blue-500 font-bold text-black flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Save className="size-4" /> Save Configuration
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export function SettingsHubTab() {
  const [viewMode, setViewMode] = useState<SettingsViewMode>("HUB");

  // State data for AI Prompts
  const [promptsList, setPromptsList] = useState<AIPromptItem[]>(INITIAL_AI_PROMPTS);
  const [editingPrompt, setEditingPrompt] = useState<AIPromptItem | null>(null);

  // State data for Review Templates
  const [templatesList, setTemplatesList] = useState<ReviewTemplateItem[]>(INITIAL_REVIEW_TEMPLATES);
  const [editingTemplate, setEditingTemplate] = useState<ReviewTemplateItem | null>(null);

  // Generic modal state for other configuration cards
  const [genericModal, setGenericModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
  }>({
    isOpen: false,
    title: "",
    description: "",
  });

  const handleSavePrompt = (savedPrompt: AIPromptItem) => {
    if (editingPrompt) {
      setPromptsList((prev) =>
        prev.map((p) => (p.id === savedPrompt.id ? savedPrompt : p))
      );
    } else {
      setPromptsList((prev) => [savedPrompt, ...prev]);
    }
    setViewMode("AI_PROMPTS_LIST");
    setEditingPrompt(null);
  };

  const handleSaveTemplate = (savedTemplate: ReviewTemplateItem) => {
    if (editingTemplate) {
      setTemplatesList((prev) =>
        prev.map((t) => (t.id === savedTemplate.id ? savedTemplate : t))
      );
    } else {
      setTemplatesList((prev) => [savedTemplate, ...prev]);
    }
    setViewMode("REVIEW_TEMPLATES_LIST");
    setEditingTemplate(null);
  };

  const handleDeletePrompt = (id: string) => {
    setPromptsList((prev) => prev.filter((p) => p.id !== id));
  };

  const openGenericConfig = (title: string, description: string) => {
    setGenericModal({
      isOpen: true,
      title,
      description,
    });
  };

  // Subview routing
  if (viewMode === "AI_PROMPTS_LIST") {
    return (
      <AIPromptsListView
        onBack={() => setViewMode("HUB")}
        onAddPrompt={() => {
          setEditingPrompt(null);
          setViewMode("ADD_AI_PROMPT");
        }}
        onEditPrompt={(prompt) => {
          setEditingPrompt(prompt);
          setViewMode("EDIT_AI_PROMPT");
        }}
        promptsList={promptsList}
        onDeletePrompt={handleDeletePrompt}
      />
    );
  }

  if (viewMode === "ADD_AI_PROMPT" || viewMode === "EDIT_AI_PROMPT") {
    return (
      <AddEditPromptView
        onBack={() => setViewMode("AI_PROMPTS_LIST")}
        initialPrompt={editingPrompt}
        onSave={handleSavePrompt}
      />
    );
  }

  if (viewMode === "REVIEW_TEMPLATES_LIST") {
    return (
      <ReviewTemplatesListView
        onBack={() => setViewMode("HUB")}
        templatesList={templatesList}
        onAddTemplate={() => {
          setEditingTemplate(null);
          setViewMode("ADD_REVIEW_TEMPLATE");
        }}
        onEditTemplate={(template) => {
          setEditingTemplate(template);
          setViewMode("EDIT_REVIEW_TEMPLATE");
        }}
        onDeleteTemplate={(id) => setTemplatesList((prev) => prev.filter((t) => t.id !== id))}
      />
    );
  }

  if (viewMode === "ADD_REVIEW_TEMPLATE" || viewMode === "EDIT_REVIEW_TEMPLATE") {
    return (
      <AddEditTemplateView
        onBack={() => setViewMode("REVIEW_TEMPLATES_LIST")}
        initialTemplate={editingTemplate}
        onSave={handleSaveTemplate}
      />
    );
  }

  // Main Settings Hub matching Screenshot 1
  return (
    <div className="rounded-2xl bg-card dark:bg-[#141416] p-6 sm:p-8 space-y-6 shadow-xl border border-border">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground tracking-tight">Settings</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Configure your account and application settings.
        </p>
      </div>

      {/* Category 1: Review Automation */}
      <div className="space-y-3">
        <div>
          <h2 className="text-base font-bold text-foreground">Review Automation</h2>
          <p className="text-xs text-muted-foreground">
            Tools for automating how you respond to customer reviews.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: AI Review Reply Prompts */}
          <div className="rounded-xl border border-border dark:border-[#27272a] bg-card dark:bg-[#121214] p-5 flex flex-col justify-between space-y-4 hover:border-blue-400/40 transition-colors shadow-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-blue-400" />
                <h3 className="font-bold text-sm text-foreground">AI Review Reply Prompts</h3>
              </div>
              <p className="text-xs font-semibold text-foreground/90">
                Manage prompts for AI-generated review replies.
              </p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Create and manage custom prompts to generate AI-powered responses to customer reviews. Tailor replies based on sentiment, tone, and length to ensure your brand voice is consistent and engaging.
              </p>
            </div>

            <div>
              <button
                type="button"
                onClick={() => setViewMode("AI_PROMPTS_LIST")}
                className="px-3.5 py-1.5 rounded-lg bg-blue-400 hover:bg-blue-500 text-black text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <SettingsIcon className="size-3.5" />
                Configure
              </button>
            </div>
          </div>

          {/* Card 2: Review Reply Templates */}
          <div className="rounded-xl border border-border dark:border-[#27272a] bg-card dark:bg-[#121214] p-5 flex flex-col justify-between space-y-4 hover:border-blue-400/40 transition-colors shadow-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-blue-400" />
                <h3 className="font-bold text-sm text-foreground">Review Reply Templates</h3>
              </div>
              <p className="text-xs font-semibold text-foreground/90">
                Manage templates for replying to reviews.
              </p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Save time by creating response templates for customer reviews. You can set them to be sent automatically based on the rating, or use them for manual replies to maintain a consistent brand voice.
              </p>
            </div>

            <div>
              <button
                type="button"
                onClick={() => setViewMode("REVIEW_TEMPLATES_LIST")}
                className="px-3.5 py-1.5 rounded-lg bg-blue-400 hover:bg-blue-500 text-black text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <SettingsIcon className="size-3.5" />
                Configure
              </button>
            </div>
          </div>

          {/* Card 3: Auto Reply Rules */}
          <div className="rounded-xl border border-border dark:border-[#27272a] bg-card dark:bg-[#121214] p-5 flex flex-col justify-between space-y-4 hover:border-blue-400/40 transition-colors shadow-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="size-4 text-blue-400" />
                <h3 className="font-bold text-sm text-foreground">Auto Reply Rules</h3>
              </div>
              <p className="text-xs font-semibold text-foreground/90">
                Configure automated responses for incoming reviews.
              </p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Define intelligent logic to automatically reply to reviews. Set up rules based on star ratings and sentiment to trigger either AI-generated responses or pre-defined templates.
              </p>
            </div>

            <div>
              <button
                type="button"
                onClick={() =>
                  openGenericConfig(
                    "Auto Reply Rules",
                    "Configure automated response rules based on star ratings and sentiment."
                  )
                }
                className="px-3.5 py-1.5 rounded-lg bg-blue-400 hover:bg-blue-500 text-black text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <SettingsIcon className="size-3.5" />
                Configure
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category 2: Connected Systems */}
      <div className="space-y-3">
        <div>
          <h2 className="text-base font-bold text-foreground">Connected Systems</h2>
          <p className="text-xs text-muted-foreground">
            Third party integrations and CRM connectors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: CRM Configuration */}
          <div className="rounded-xl border border-border dark:border-[#27272a] bg-card dark:bg-[#121214] p-5 flex flex-col justify-between space-y-4 hover:border-blue-400/40 transition-colors shadow-sm md:col-span-1">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Database className="size-4 text-blue-400" />
                <h3 className="font-bold text-sm text-foreground">CRM Configuration</h3>
              </div>
              <p className="text-xs font-semibold text-foreground/90">
                Configure CRM access credentials and settings.
              </p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                The CRM Review Reply module seamlessly integrates your Google Business Profile with external CRMs like Zoho. It automatically converts incoming reviews into support tickets, and instantly publishes your team's CRM replies directly back to the Google Review.
              </p>
            </div>

            <div>
              <button
                type="button"
                onClick={() =>
                  openGenericConfig(
                    "CRM Configuration",
                    "Configure Zoho CRM & third-party ticketing integration settings."
                  )
                }
                className="px-3.5 py-1.5 rounded-lg bg-blue-400 hover:bg-blue-500 text-black text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <SettingsIcon className="size-3.5" />
                Configure
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category 3: Account & Configuration */}
      <div className="space-y-3">
        <div>
          <h2 className="text-base font-bold text-foreground">Account &amp; Configuration</h2>
          <p className="text-xs text-muted-foreground">
            General account settings and brand configuration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: Brand Profile */}
          <div className="rounded-xl border border-border dark:border-[#27272a] bg-card dark:bg-[#121214] p-5 flex flex-col justify-between space-y-4 hover:border-blue-400/40 transition-colors shadow-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Building2 className="size-4 text-blue-400" />
                <h3 className="font-bold text-sm text-foreground">Brand Profile</h3>
              </div>
              <p className="text-xs font-semibold text-foreground/90">
                Manage your brand profile settings.
              </p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Update your brand information, including name, logo, and description. This information will be displayed on your public profile.
              </p>
            </div>

            <div>
              <button
                type="button"
                onClick={() =>
                  openGenericConfig(
                    "Brand Profile Settings",
                    "Update brand name, public logo, and organizational metadata."
                  )
                }
                className="px-3.5 py-1.5 rounded-lg bg-blue-400 hover:bg-blue-500 text-black text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <SettingsIcon className="size-3.5" />
                Configure
              </button>
            </div>
          </div>

          {/* Card 2: Store Locator Config */}
          <div className="rounded-xl border border-border dark:border-[#27272a] bg-card dark:bg-[#121214] p-5 flex flex-col justify-between space-y-4 hover:border-blue-400/40 transition-colors shadow-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-blue-400" />
                <h3 className="font-bold text-sm text-foreground">Store Locator Config</h3>
              </div>
              <p className="text-xs font-semibold text-foreground/90">
                Manage settings for the store locator Config.
              </p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Configure the store locator Config, including map options, search filters, and display preferences.
              </p>
            </div>

            <div>
              <button
                type="button"
                onClick={() =>
                  openGenericConfig(
                    "Store Locator Config",
                    "Customize map filters, store radius, and embed widgets."
                  )
                }
                className="px-3.5 py-1.5 rounded-lg bg-blue-400 hover:bg-blue-500 text-black text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <SettingsIcon className="size-3.5" />
                Configure
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category 4: Marketing Tools */}
      <div className="space-y-3">
        <div>
          <h2 className="text-base font-bold text-foreground">Marketing Tools</h2>
          <p className="text-xs text-muted-foreground">
            Tools for promoting your business and engaging customers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: QR Code Studio */}
          <div className="rounded-xl border border-border dark:border-[#27272a] bg-card dark:bg-[#121214] p-5 flex flex-col justify-between space-y-4 hover:border-blue-400/40 transition-colors shadow-sm md:col-span-1">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <QrCode className="size-4 text-blue-400" />
                <h3 className="font-bold text-sm text-foreground">QR Code Studio</h3>
              </div>
              <p className="text-xs font-semibold text-foreground/90">
                Design and customize your branded QR codes.
              </p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Create branded QR codes for all your locations using your brand colors, logo, and dot style. Single QR codes are rendered live in the browser, while bulk exports generate a downloadable ZIP of all location QR codes in the background.
              </p>
            </div>

            <div>
              <button
                type="button"
                onClick={() =>
                  openGenericConfig(
                    "QR Code Studio Config",
                    "Set default QR logo, color gradients, and bulk export parameters."
                  )
                }
                className="px-3.5 py-1.5 rounded-lg bg-blue-400 hover:bg-blue-500 text-black text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <SettingsIcon className="size-3.5" />
                Configure
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Generic Configuration Modal */}
      <GenericConfigModal
        isOpen={genericModal.isOpen}
        title={genericModal.title}
        description={genericModal.description}
        onClose={() => setGenericModal({ ...genericModal, isOpen: false })}
      />
    </div>
  );
}
