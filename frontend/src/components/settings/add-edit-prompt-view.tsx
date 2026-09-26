import React, { useState } from "react";
import { ArrowLeft, Save, Eye, Home, ChevronRight } from "lucide-react";
import { AIPromptItem } from "@/data/settings-analytics";
import { SampleResponsesModal } from "./sample-responses-modal";

interface AddEditPromptViewProps {
  initialPrompt?: AIPromptItem | null;
  onBack: () => void;
  onSave: (promptData: AIPromptItem) => void;
}

export function AddEditPromptView({
  initialPrompt,
  onBack,
  onSave,
}: AddEditPromptViewProps) {
  const isEditing = !!initialPrompt;

  const [promptName, setPromptName] = useState(initialPrompt?.name || "");
  const [sentiment, setSentiment] = useState<AIPromptItem["sentiment"]>(
    initialPrompt?.sentiment || "Positive"
  );
  const [rating, setRating] = useState(initialPrompt?.rating || "5 Stars");
  const [tone, setTone] = useState<AIPromptItem["tone"]>(
    initialPrompt?.tone || "Friendly"
  );
  const [wordLength, setWordLength] = useState<AIPromptItem["wordLength"]>(
    initialPrompt?.wordLength || "Short (50-100 words)"
  );
  const [preferredLanguage, setPreferredLanguage] = useState(
    initialPrompt?.preferredLanguage || "English"
  );
  const [isActive, setIsActive] = useState(
    initialPrompt ? initialPrompt.status === "Active" : true
  );

  const [openingLine, setOpeningLine] = useState(
    initialPrompt?.openingLine || "Hi [:reviewer_name],"
  );
  const [closingLine, setClosingLine] = useState(
    initialPrompt?.closingLine || "Warm regards, Campus Team."
  );
  const [promptTemplate, setPromptTemplate] = useState(
    initialPrompt?.promptTemplate ||
      `You are an AI assistant working as an Online Reputation Manager for Demo Brand.\nWrite a [:word_length], [:tone] reply in [:preferred_language] for a [:rating]-star review with [:sentiment] sentiment.\n\nGuidelines:\n1. Start with [:opening_line].\n2. Thank the customer for their feedback and express genuine happiness.\n3. Include appreciation and an invitation to visit again similar to "Glad to know that we made your shopping experience great today. Looking forward to assist you again..."\n4. For product feedback include appreciation like "Glad you like our collection! Keep exploring our new styles. Happy shopping!"`
  );

  // Sample Responses modal state
  const [sampleModalOpen, setSampleModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptName.trim()) return;

    const savedPrompt: AIPromptItem = {
      id: initialPrompt?.id || `prompt-${Date.now()}`,
      name: promptName,
      sentiment,
      rating,
      tone,
      wordLength,
      status: isActive ? "Active" : "Inactive",
      lastModifiedAt: "Just now",
      openingLine,
      closingLine,
      promptTemplate,
      preferredLanguage,
    };

    onSave(savedPrompt);
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
          AI Prompts
        </span>
        <ChevronRight className="size-3 text-muted-foreground/60" />
        <span className="font-semibold text-foreground">
          {isEditing ? "Edit Prompt" : "Add Prompt"}
        </span>
      </div>

      {/* Rounded Off-Black Card Container wrapping main content */}
      <div className="rounded-2xl bg-card dark:bg-[#141416] p-6 sm:p-8 space-y-6 shadow-xl border border-border">
        {/* Header & Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              {isEditing ? "Edit Prompt" : "Add Prompt"}
            </h1>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Configure system prompts, sentiment criteria, tones, and AI response parameters.
            </p>
          </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSampleModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg border border-blue-500/40 bg-blue-500/10 hover:bg-blue-500/20 text-xs font-bold text-blue-400 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="size-3.5" />
            Show Sample Responses
          </button>

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
        {/* Section 1: Prompt Info */}
        <div className="rounded-xl border border-border dark:border-[#27272a] bg-card dark:bg-[#121214] p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-4 space-y-1">
              <h3 className="text-xs font-bold text-foreground">Prompt Info</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Define the prompt and rules for the AI-generated responses
              </p>
            </div>

            <div className="md:col-span-8 space-y-4">
              {/* Prompt Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">
                  Prompt Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={promptName}
                  onChange={(e) => setPromptName(e.target.value)}
                  placeholder="e.g. Positive 5-Star Cheerful Reply"
                  className="w-full px-3 py-2 rounded-lg border border-border dark:border-[#27272a] bg-background dark:bg-[#09090b] text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Grid 2 Cols: Sentiment & Ratings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">
                    Sentiment <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={sentiment}
                    onChange={(e) => setSentiment(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-border dark:border-[#27272a] bg-background dark:bg-[#09090b] text-xs text-foreground focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="Positive">Positive</option>
                    <option value="Neutral">Neutral</option>
                    <option value="Negative">Negative</option>
                    <option value="Any Sentiment">Any Sentiment</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">
                    Ratings <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border dark:border-[#27272a] bg-background dark:bg-[#09090b] text-xs text-foreground focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="5 Stars">5 Stars</option>
                    <option value="4 Stars">4 Stars</option>
                    <option value="3 Stars">3 Stars</option>
                    <option value="2 Stars">2 Stars</option>
                    <option value="1 Star">1 Star</option>
                    <option value="All Stars">All Stars</option>
                  </select>
                </div>
              </div>

              {/* Grid 2 Cols: Tone & Word Length */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">
                    Tone <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-border dark:border-[#27272a] bg-background dark:bg-[#09090b] text-xs text-foreground focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="Friendly">Friendly</option>
                    <option value="Professional">Professional</option>
                    <option value="Formal">Formal</option>
                    <option value="Casual">Casual</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">
                    Word Length <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={wordLength}
                    onChange={(e) => setWordLength(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-border dark:border-[#27272a] bg-background dark:bg-[#09090b] text-xs text-foreground focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="Short (50-100 words)">Short (50-100 words)</option>
                    <option value="Medium (100-200 words)">Medium (100-200 words)</option>
                    <option value="Long (200+ words)">Long (200+ words)</option>
                  </select>
                </div>
              </div>

              {/* Preferred Language */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">
                  Preferred Language <span className="text-rose-500">*</span>
                </label>
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border dark:border-[#27272a] bg-background dark:bg-[#09090b] text-xs text-foreground focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                </select>
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
                * Toggle to activate or deactivate this prompt.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Reply Settings */}
        <div className="rounded-xl border border-border dark:border-[#27272a] bg-card dark:bg-[#121214] p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-4 space-y-1">
              <h3 className="text-xs font-bold text-foreground">Reply Settings</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Customize the opening and closing lines for the AI-generated replies.
              </p>
            </div>

            <div className="md:col-span-8 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">
                  Opening Line <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={openingLine}
                  onChange={(e) => setOpeningLine(e.target.value)}
                  placeholder="e.g. Hi [:reviewer_name],"
                  className="w-full px-3 py-2 rounded-lg border border-border dark:border-[#27272a] bg-background dark:bg-[#09090b] text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-blue-500 font-mono"
                />
                <p className="text-[10px] text-muted-foreground italic">
                  * Available placeholders: [:reviewer_name]
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Closing Line</label>
                <input
                  type="text"
                  value={closingLine}
                  onChange={(e) => setClosingLine(e.target.value)}
                  placeholder="e.g. Best regards, The Team"
                  className="w-full px-3 py-2 rounded-lg border border-border dark:border-[#27272a] bg-background dark:bg-[#09090b] text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: AI Prompt */}
        <div className="rounded-xl border border-border dark:border-[#27272a] bg-card dark:bg-[#121214] p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-4 space-y-1">
              <h3 className="text-xs font-bold text-foreground">AI Prompt</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Craft the AI prompt template using available variables for dynamic content.
              </p>
            </div>

            <div className="md:col-span-8 space-y-3">
              <textarea
                rows={8}
                value={promptTemplate}
                onChange={(e) => setPromptTemplate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-border dark:border-[#27272a] bg-background dark:bg-[#09090b] text-xs text-foreground font-mono leading-relaxed focus:outline-none focus:border-blue-500"
              />

              <div className="p-3 rounded-lg border border-border dark:border-[#27272a] bg-secondary/40 dark:bg-[#18181b]/60 space-y-1 text-[11px] text-muted-foreground">
                <p className="font-bold text-foreground text-xs">Important Notes</p>
                <p>
                  * Available placeholders: <span className="text-blue-400 font-mono">[:reviewer_name]</span>, <span className="text-blue-400 font-mono">[:tone]</span>, <span className="text-blue-400 font-mono">[:sentiment]</span>, <span className="text-blue-400 font-mono">[:rating]</span>, <span className="text-blue-400 font-mono">[:word_length]</span>, <span className="text-blue-400 font-mono">[:preferred_language]</span>, <span className="text-blue-400 font-mono">[:opening_line]</span>, <span className="text-blue-400 font-mono">[:closing_line]</span>, <span className="text-blue-400 font-mono">[:signature]</span>
                </p>
                <p>
                  * Other useful placeholders: <span className="text-blue-400 font-mono">[:customer_support_email]</span>, <span className="text-blue-400 font-mono">[:customer_support_phone]</span>, <span className="text-blue-400 font-mono">[:customer_support_url]</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Sample Responses Modal */}
      <SampleResponsesModal
        open={sampleModalOpen}
        onClose={() => setSampleModalOpen(false)}
      />
    </div>
  </div>
);
}
