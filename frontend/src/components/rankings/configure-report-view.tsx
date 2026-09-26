import { useState } from "react";
import { ArrowLeft, ChevronRight, Home, Plus, Save, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CompetitorItem {
  id: string;
  name: string;
  domain: string;
}

interface ConfigureReportViewProps {
  onBack: () => void;
  onSave?: (() => void) | undefined;
}

export function ConfigureReportView({ onBack, onSave }: ConfigureReportViewProps) {
  const [keywords, setKeywords] = useState<string[]>([
    "men shoes",
    "shoe shop near me",
    "footwear shop near me",
    "ladies shoes",
    "sports shoes",
  ]);

  const [inputKw, setInputKw] = useState("");

  const [competitors, setCompetitors] = useState<CompetitorItem[]>([
    { id: "comp-1", name: "Bata", domain: "bata.com" },
    { id: "comp-2", name: "Comet", domain: "wearcomet.com" },
    { id: "comp-3", name: "RedTape", domain: "redtape.com" },
  ]);

  const handleAddKeyword = () => {
    if (inputKw.trim() && !keywords.includes(inputKw.trim())) {
      setKeywords((prev) => [...prev, inputKw.trim()]);
      setInputKw("");
    }
  };

  const handleRemoveKeyword = (kwToRemove: string) => {
    setKeywords((prev) => prev.filter((k) => k !== kwToRemove));
  };

  const handleAddCompetitor = () => {
    const newId = `comp-${Date.now()}`;
    setCompetitors((prev) => [
      ...prev,
      { id: newId, name: "New Competitor", domain: "example.com" },
    ]);
  };

  const handleRemoveCompetitor = (id: string) => {
    setCompetitors((prev) => prev.filter((c) => c.id !== id));
  };

  const handleCompetitorChange = (
    id: string,
    field: "name" | "domain",
    val: string
  ) => {
    setCompetitors((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: val } : c))
    );
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
          Local Rank Report
        </span>
        <ChevronRight className="size-3 text-muted-foreground/60" />
        <span className="font-semibold text-foreground">Configure Report</span>
      </div>

      {/* Rounded Off-Black Card Container wrapping main content */}
      <div className="rounded-2xl bg-card dark:bg-[#141416] p-6 sm:p-8 space-y-6 shadow-xl border border-border">
        {/* Header Title & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">Configure Report</h1>
            <p className="mt-0.5 text-xs text-muted-foreground">Set target keywords, competitors, and scan frequencies for automated rank audits.</p>
          </div>

          {/* Action Buttons: Save & Back */}
          <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => (onSave ? onSave() : onBack())}
            className="h-8 bg-blue-500 hover:bg-blue-600 text-black font-semibold text-xs px-4 cursor-pointer gap-1.5"
          >
            <Save className="size-3.5" />
            <span>Save</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="h-8 border-border bg-background text-xs font-semibold cursor-pointer gap-1.5"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back</span>
          </Button>
        </div>
      </div>

      {/* Main Title */}
      <div>
        <h1 className="text-xl font-bold text-foreground tracking-tight">
          Configure Report
        </h1>
      </div>

      {/* Main Content Form Panels */}
      <div className="space-y-8 max-w-4xl">
        {/* Section 1: Add Keywords */}
        <div className="grid gap-6 md:grid-cols-[240px_minmax(0,1fr)] items-start pt-2 border-t border-border/50">
          <div>
            <h3 className="text-sm font-bold text-foreground">Add Keywords</h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Add keywords you want to track for ranking.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground block">
              Keywords <span className="text-red-400">*</span>
            </label>

            {/* Tag Input Box */}
            <div className="bg-background border border-border rounded-lg p-3 min-h-[100px] space-y-2">
              <div className="flex flex-wrap gap-2">
                {keywords.map((kw) => (
                  <span
                    key={kw}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-secondary text-foreground text-xs font-medium border border-border"
                  >
                    <span>{kw}</span>
                    <button
                      onClick={() => handleRemoveKeyword(kw)}
                      className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>

              <input
                type="text"
                placeholder="Enter value..."
                value={inputKw}
                onChange={(e) => setInputKw(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    handleAddKeyword();
                  }
                }}
                className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none pt-1"
              />
            </div>

            <p className="text-[11px] text-muted-foreground italic">
              * Enter keywords separated by commas.
            </p>
          </div>
        </div>

        {/* Section 2: Competitors */}
        <div className="grid gap-6 md:grid-cols-[240px_minmax(0,1fr)] items-start pt-6 border-t border-border/50">
          <div>
            <h3 className="text-sm font-bold text-foreground">Competitors</h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Monitor competitors&apos; rankings to benchmark your progress.
            </p>
          </div>

          <div className="space-y-3">
            {competitors.map((comp) => (
              <div
                key={comp.id}
                className="grid grid-cols-[1fr_1fr_36px] items-center gap-3 text-xs"
              >
                <div>
                  <label className="text-[11px] font-semibold text-foreground block mb-1">
                    Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={comp.name}
                    onChange={(e) =>
                      handleCompetitorChange(comp.id, "name", e.target.value)
                    }
                    className="h-8 w-full rounded bg-background border border-border px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-foreground block mb-1">
                    Domain <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={comp.domain}
                    onChange={(e) =>
                      handleCompetitorChange(comp.id, "domain", e.target.value)
                    }
                    className="h-8 w-full rounded bg-background border border-border px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="pt-5">
                  <button
                    onClick={() => handleRemoveCompetitor(comp.id)}
                    className="size-8 rounded border border-blue-500/30 text-blue-500 hover:bg-blue-500/10 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={handleAddCompetitor}
              className="h-8 border-border bg-background text-xs text-foreground font-semibold cursor-pointer gap-1.5 mt-2 hover:bg-secondary"
            >
              <Plus className="size-3.5" />
              <span>Add Competitor</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}
