import { useState, useRef } from "react";
import { ArrowLeft, CheckCircle2, ChevronRight, FileCode, Home, Upload, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LocationsFormatGuideModal } from "./locations-format-guide-modal";

export type ImportSectionType = "master" | "platform" | "unclaimed" | "duplicate" | "managers";

interface LocationsImportViewProps {
  onBack: () => void;
  onSuccess?: () => void;
  type?: ImportSectionType;
}

export function LocationsImportView({
  onBack,
  onSuccess,
  type = "master",
}: LocationsImportViewProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isGuidelinesModalOpen, setIsGuidelinesModalOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const getSectionTitle = () => {
    switch (type) {
      case "unclaimed":
        return "Import Unclaimed Profiles";
      case "platform":
        return "Import Platform Profiles";
      case "duplicate":
        return "Import Duplicate Candidates";
      case "managers":
        return "Import Store Managers";
      case "master":
      default:
        return "Import Locations";
    }
  };

  const getSourceLabel = () => {
    switch (type) {
      case "unclaimed":
        return "Unclaimed Profiles";
      case "platform":
        return "Platform Profiles";
      case "duplicate":
        return "Duplicate Profiles";
      case "managers":
        return "Store Managers";
      case "master":
      default:
        return "Master Profiles";
    }
  };

  const handleProcessFile = (file: File) => {
    if (!file.name.endsWith(".csv")) {
      toast.error("Invalid file format. Please upload a valid CSV file.");
      return;
    }

    setSelectedFileName(file.name);
    setIsUploading(true);
    toast.info(`Reading ${file.name}...`);

    setTimeout(() => {
      setIsUploading(false);
      setStep(2);
      toast.success(`Successfully parsed ${file.name}. Ready for review!`);
    }, 1200);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleProcessFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleConfirmImport = () => {
    setStep(3);
    setTimeout(() => {
      toast.success(`${getSourceLabel()} imported successfully!`);
      if (onSuccess) {
        onSuccess();
      } else {
        onBack();
      }
    }, 1000);
  };

  // Preview Grid headers & sample rows per section type
  const renderPreviewGrid = () => {
    if (type === "platform") {
      return (
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border bg-secondary/30 text-muted-foreground font-semibold">
              <th className="py-2.5 px-4">Store Code</th>
              <th className="py-2.5 px-4">Business Name</th>
              <th className="py-2.5 px-4">Platform</th>
              <th className="py-2.5 px-4">Sync Status</th>
              <th className="py-2.5 px-4">Verification Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            <tr className="hover:bg-secondary/20">
              <td className="py-2.5 px-4 font-mono text-foreground font-medium">demo-store-127</td>
              <td className="py-2.5 px-4 font-bold text-foreground">Demo Store 127</td>
              <td className="py-2.5 px-4 text-muted-foreground">Google Business</td>
              <td className="py-2.5 px-4 text-emerald-400 font-semibold">Synced</td>
              <td className="py-2.5 px-4 text-blue-400 font-semibold">Unverified</td>
            </tr>
            <tr className="hover:bg-secondary/20">
              <td className="py-2.5 px-4 font-mono text-foreground font-medium">demo-store-100</td>
              <td className="py-2.5 px-4 font-bold text-foreground">Demo Store 100</td>
              <td className="py-2.5 px-4 text-muted-foreground">Facebook Local</td>
              <td className="py-2.5 px-4 text-emerald-400 font-semibold">Synced</td>
              <td className="py-2.5 px-4 text-emerald-400 font-semibold">Verified</td>
            </tr>
          </tbody>
        </table>
      );
    }

    if (type === "unclaimed") {
      return (
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border bg-secondary/30 text-muted-foreground font-semibold">
              <th className="py-2.5 px-4">Place ID</th>
              <th className="py-2.5 px-4">Business Name</th>
              <th className="py-2.5 px-4">Address</th>
              <th className="py-2.5 px-4">City</th>
              <th className="py-2.5 px-4">Phone</th>
              <th className="py-2.5 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            <tr className="hover:bg-secondary/20">
              <td className="py-2.5 px-4 font-mono text-foreground font-medium">ChUgacxTRMfjkkRyHAXbS27DZc</td>
              <td className="py-2.5 px-4 font-bold text-foreground">Demo Store 22</td>
              <td className="py-2.5 px-4 text-muted-foreground">JMD Regent Arcade, Varanasi</td>
              <td className="py-2.5 px-4 text-muted-foreground">Varanasi</td>
              <td className="py-2.5 px-4 text-muted-foreground">+91-8368761913</td>
              <td className="py-2.5 px-4 text-emerald-400 font-semibold">Claimed</td>
            </tr>
            <tr className="hover:bg-secondary/20">
              <td className="py-2.5 px-4 font-mono text-foreground font-medium">ChIJ__97swYDDTkRFU2KayZjfu0</td>
              <td className="py-2.5 px-4 font-bold text-foreground">Demo Store 13</td>
              <td className="py-2.5 px-4 text-muted-foreground">JMD Regent Arcade, New Delhi</td>
              <td className="py-2.5 px-4 text-muted-foreground">New Delhi</td>
              <td className="py-2.5 px-4 text-muted-foreground">+91-8368761913</td>
              <td className="py-2.5 px-4 text-emerald-400 font-semibold">Claimed</td>
            </tr>
          </tbody>
        </table>
      );
    }

    if (type === "duplicate") {
      return (
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border bg-secondary/30 text-muted-foreground font-semibold">
              <th className="py-2.5 px-4">Primary Code</th>
              <th className="py-2.5 px-4">Primary Profile</th>
              <th className="py-2.5 px-4">Duplicate Candidate</th>
              <th className="py-2.5 px-4">Distance</th>
              <th className="py-2.5 px-4">Match Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            <tr className="hover:bg-secondary/20">
              <td className="py-2.5 px-4 font-mono text-foreground font-medium">demo-store-105</td>
              <td className="py-2.5 px-4 font-bold text-foreground">Demo Store 105, Mumbai</td>
              <td className="py-2.5 px-4 text-blue-400 font-bold">Demo Store - Fort Mumbai</td>
              <td className="py-2.5 px-4 font-mono text-muted-foreground">45m</td>
              <td className="py-2.5 px-4 text-emerald-400 font-bold">94% Match</td>
            </tr>
            <tr className="hover:bg-secondary/20">
              <td className="py-2.5 px-4 font-mono text-foreground font-medium">demo-store-210</td>
              <td className="py-2.5 px-4 font-bold text-foreground">Demo Store 210, Delhi</td>
              <td className="py-2.5 px-4 text-blue-400 font-bold">Demo Store Dwarka Outlet</td>
              <td className="py-2.5 px-4 font-mono text-muted-foreground">120m</td>
              <td className="py-2.5 px-4 text-emerald-400 font-bold">88% Match</td>
            </tr>
          </tbody>
        </table>
      );
    }

    if (type === "managers") {
      return (
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border bg-secondary/30 text-muted-foreground font-semibold">
              <th className="py-2.5 px-4">First Name</th>
              <th className="py-2.5 px-4">Last Name</th>
              <th className="py-2.5 px-4">Email</th>
              <th className="py-2.5 px-4">Mobile</th>
              <th className="py-2.5 px-4">Status</th>
              <th className="py-2.5 px-4">Accessible Locations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            <tr className="hover:bg-secondary/20">
              <td className="py-2.5 px-4 font-bold text-foreground">Pushkar</td>
              <td className="py-2.5 px-4 font-bold text-foreground">Rana</td>
              <td className="py-2.5 px-4 font-mono text-muted-foreground">pushkar.rana@global360.com</td>
              <td className="py-2.5 px-4 font-mono text-muted-foreground">+91 83609 99766</td>
              <td className="py-2.5 px-4 text-emerald-400 font-semibold">Active</td>
              <td className="py-2.5 px-4 text-muted-foreground">Demo Store 127, Demo Store 100</td>
            </tr>
            <tr className="hover:bg-secondary/20">
              <td className="py-2.5 px-4 font-bold text-foreground">Animesh</td>
              <td className="py-2.5 px-4 font-bold text-foreground">Mallick</td>
              <td className="py-2.5 px-4 font-mono text-muted-foreground">animesh.mallick@global360.com</td>
              <td className="py-2.5 px-4 font-mono text-muted-foreground">+91 90000 00000</td>
              <td className="py-2.5 px-4 text-emerald-400 font-semibold">Active</td>
              <td className="py-2.5 px-4 text-muted-foreground">Demo Store 296</td>
            </tr>
          </tbody>
        </table>
      );
    }

    // Default: Master Profiles
    return (
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="border-b border-border bg-secondary/30 text-muted-foreground font-semibold">
            <th className="py-2.5 px-4">Store Code</th>
            <th className="py-2.5 px-4">Business Name</th>
            <th className="py-2.5 px-4">Address</th>
            <th className="py-2.5 px-4">City</th>
            <th className="py-2.5 px-4">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          <tr className="hover:bg-secondary/20">
            <td className="py-2.5 px-4 font-mono text-foreground font-medium">demo-store-001</td>
            <td className="py-2.5 px-4 font-bold text-foreground">Demo Store Mumbai</td>
            <td className="py-2.5 px-4 text-muted-foreground">45 MG Road Fort</td>
            <td className="py-2.5 px-4 text-muted-foreground">Mumbai</td>
            <td className="py-2.5 px-4 text-emerald-400 font-semibold">Valid</td>
          </tr>
          <tr className="hover:bg-secondary/20">
            <td className="py-2.5 px-4 font-mono text-foreground font-medium">demo-store-002</td>
            <td className="py-2.5 px-4 font-bold text-foreground">Demo Store Delhi</td>
            <td className="py-2.5 px-4 text-muted-foreground">Sector 21 Market Dwarka</td>
            <td className="py-2.5 px-4 text-muted-foreground">New Delhi</td>
            <td className="py-2.5 px-4 text-emerald-400 font-semibold">Valid</td>
          </tr>
        </tbody>
      </table>
    );
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200 pb-16">
      {/* Top Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground px-1 pb-1">
        <Home
          className="size-3.5 text-muted-foreground hover:text-foreground cursor-pointer"
          onClick={onBack}
        />
        <ChevronRight className="size-3 text-muted-foreground/60" />
        <span onClick={onBack} className="cursor-pointer hover:text-foreground font-medium">
          {getSourceLabel()}
        </span>
        <ChevronRight className="size-3 text-muted-foreground/60" />
        <span className="font-bold text-foreground">{getSectionTitle()}</span>
      </div>

      {/* Main Rounded Container */}
      <div className="rounded-2xl bg-[#f4f4f6] dark:bg-[#141416] p-6 sm:p-8 space-y-6 shadow-xl border border-slate-200/80 dark:border-transparent">
        {/* Top Header & Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-[#27272a]">
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              {getSectionTitle()}
            </h1>
            <p className="mt-0.5 text-xs text-muted-foreground max-w-2xl leading-relaxed">
              Easily update your system data by uploading a CSV file. Please review the formatting
              guidelines or download the template to ensure a smooth import.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Back to Source Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="h-8 border-slate-300 dark:border-[#3f3f46] bg-white dark:bg-[#18181b] hover:bg-slate-100 dark:hover:bg-[#27272a] text-xs text-foreground cursor-pointer gap-1.5 px-3"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to {getSourceLabel()}</span>
            </Button>

            {/* View Format Guide Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsGuidelinesModalOpen(true)}
              className="h-8 border-slate-300 dark:border-[#3f3f46] bg-white dark:bg-[#18181b] hover:bg-slate-100 dark:hover:bg-[#27272a] text-xs text-foreground cursor-pointer gap-1.5 px-3"
            >
              <FileCode className="size-3.5 text-blue-500" />
              <span>View Format Guide</span>
            </Button>
          </div>
        </div>

        {/* Stepper Header (1) Upload File -> (2) Review Results -> (3) Finalize */}
        <div className="flex items-center justify-center max-w-xl mx-auto py-2">
          <div className="flex items-center w-full justify-between relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center gap-1.5 z-10">
              <div
                className={`size-8 rounded-full flex items-center justify-center font-extrabold text-xs transition-colors ${
                  step >= 1
                    ? "bg-blue-500 text-black shadow-md"
                    : "bg-slate-200 dark:bg-[#27272a] text-muted-foreground"
                }`}
              >
                1
              </div>
              <span
                className={`text-xs font-semibold ${
                  step === 1 ? "text-blue-500" : "text-muted-foreground"
                }`}
              >
                Upload File
              </span>
            </div>

            {/* Connecting Line 1-2 */}
            <div className="flex-1 h-0.5 bg-slate-200 dark:bg-[#27272a] -mt-5 mx-2" />

            {/* Step 2 */}
            <div className="flex flex-col items-center gap-1.5 z-10">
              <div
                className={`size-8 rounded-full flex items-center justify-center font-extrabold text-xs transition-colors ${
                  step >= 2
                    ? "bg-blue-500 text-black shadow-md"
                    : "bg-slate-200 dark:bg-[#27272a] text-muted-foreground"
                }`}
              >
                2
              </div>
              <span
                className={`text-xs font-semibold ${
                  step === 2 ? "text-blue-500" : "text-muted-foreground"
                }`}
              >
                Review Results
              </span>
            </div>

            {/* Connecting Line 2-3 */}
            <div className="flex-1 h-0.5 bg-slate-200 dark:bg-[#27272a] -mt-5 mx-2" />

            {/* Step 3 */}
            <div className="flex flex-col items-center gap-1.5 z-10">
              <div
                className={`size-8 rounded-full flex items-center justify-center font-extrabold text-xs transition-colors ${
                  step === 3
                    ? "bg-blue-500 text-black shadow-md"
                    : "bg-slate-200 dark:bg-[#27272a] text-muted-foreground"
                }`}
              >
                3
              </div>
              <span
                className={`text-xs font-semibold ${
                  step === 3 ? "text-blue-500" : "text-muted-foreground"
                }`}
              >
                Finalize
              </span>
            </div>
          </div>
        </div>

        {/* Step 1: Main Drag and Drop Container */}
        {step === 1 && (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`rounded-xl bg-white dark:bg-[#09090b] p-12 sm:p-16 border-2 border-dashed transition-colors shadow-sm flex flex-col items-center justify-center text-center space-y-4 ${
              dragActive
                ? "border-blue-500 bg-blue-500/5"
                : "border-slate-300 dark:border-[#27272a]"
            }`}
          >
            <div className="size-16 rounded-full bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Upload className="size-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">Upload CSV File</h3>
              <p className="text-xs text-muted-foreground">
                Drag and drop your file here, or click to browse
              </p>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />

            <Button
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="h-9 bg-blue-500 hover:bg-blue-600 text-black font-extrabold text-xs px-6 cursor-pointer gap-1.5 shadow-md"
            >
              <UploadCloud className="size-4" />
              <span>{isUploading ? "Reading File..." : "Select File"}</span>
            </Button>

            <p className="text-[11px] text-muted-foreground">Supported: .csv (Max 10MB)</p>
          </div>
        )}

        {/* Step 2: Review Results */}
        {step === 2 && (
          <div className="rounded-xl bg-white dark:bg-[#09090b] p-8 border border-slate-200 dark:border-[#27272a] shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#27272a]">
              <div>
                <h3 className="text-sm font-bold text-foreground">File Parsing Summary</h3>
                <p className="text-xs text-muted-foreground">
                  File: <span className="font-mono text-blue-500 font-semibold">{selectedFileName}</span>
                </p>
              </div>
              <span className="px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                Valid Records Ready to Import
              </span>
            </div>

            {/* Section Specific Preview Table */}
            <div className="panel overflow-hidden">
              <div className="overflow-x-auto max-h-60">
                {renderPreviewGrid()}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStep(1)}
                className="h-8 border-slate-300 dark:border-[#3f3f46] bg-white dark:bg-[#18181b] text-xs font-semibold px-4 cursor-pointer"
              >
                Re-upload File
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmImport}
                className="h-8 bg-blue-500 hover:bg-blue-600 text-black font-extrabold text-xs px-6 cursor-pointer"
              >
                Confirm & Import Records
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Finalize */}
        {step === 3 && (
          <div className="rounded-xl bg-white dark:bg-[#09090b] p-16 border border-slate-200 dark:border-[#27272a] shadow-sm text-center space-y-4">
            <div className="size-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="size-8" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Import Completed Successfully!</h3>
            <p className="text-xs text-muted-foreground">
              {getSourceLabel()} records have been processed and updated into your database.
            </p>
            <Button
              size="sm"
              onClick={onBack}
              className="h-9 bg-blue-500 hover:bg-blue-600 text-black font-extrabold text-xs px-6 cursor-pointer mt-2"
            >
              Return to {getSourceLabel()}
            </Button>
          </div>
        )}

        {/* Import Guidelines Modal */}
        <LocationsFormatGuideModal
          open={isGuidelinesModalOpen}
          onOpenChange={setIsGuidelinesModalOpen}
          type={type === "unclaimed" ? "unclaimed" : "master"}
        />
      </div>
    </div>
  );
}
