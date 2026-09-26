import { useState } from "react";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Compass,
  Download,
  MapPin,
  MessageSquare,
  Sparkles,
  Star,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface GuidedTourModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GuidedTourModal({ open, onOpenChange }: GuidedTourModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const tourSteps = [
    {
      title: "Executive Overview Dashboard",
      subtitle: "Comprehensive high-level performance metrics",
      icon: BarChart3,
      description:
        "Get a 360-degree view of your brand's online reputation. Monitor rating breakdown, response rates, average response times, sentiment analysis, and multi-channel impression trends in real time.",
      highlights: [
        "Reputation Insights & Star Rating Trends",
        "Sentiment Analysis & Keyword Categories",
        "Desktop & Mobile Performance Analytics",
      ],
    },
    {
      title: "Enterprise Locations Management",
      subtitle: "Operate and monitor enterprise Google Business Profiles",
      icon: MapPin,
      description:
        "Manage Master Profiles, Platform Listings, Unclaimed Profiles, and Google Updates across all states and cities. Ensure business info completeness and track overall profile health scores.",
      highlights: [
        "Master & Platform Listing Verification",
        "Unclaimed & Duplicate Listing Resolution",
        "Google Suggested Field Update Review",
      ],
    },
    {
      title: "Reviews Intelligence & Automation",
      subtitle: "Customer review tracking & response management",
      icon: MessageSquare,
      description:
        "Respond to incoming customer reviews instantly, filter reviews by rating or sentiment, create response templates, and track review response rate targets effortlessly.",
      highlights: [
        "Unified Review Management Feed",
        "Automated & Custom Response Templates",
        "Response Time & Sentiment Tracking",
      ],
    },
    {
      title: "Rankings & Local Geo-Grid Analytics",
      subtitle: "Google Maps local search visibility tracking",
      icon: Star,
      description:
        "Track exact local search rank positioning across high-value keywords. Visualize rank heatmaps on interactive geo-grids and analyze competitor visibility.",
      highlights: [
        "Interactive Geo-Grid Rank Heatmaps",
        "Keyword Rank Position History",
        "Competitor Rank Share Comparison",
      ],
    },
    {
      title: "Data Exports & Downloads",
      subtitle: "Export reports & generated datasets anytime",
      icon: Download,
      description:
        "Export table data, location audits, review summaries, and performance reports to CSV or PDF. Access all your generated exports directly from the header downloads tray.",
      highlights: [
        "One-Click Table Data Exports",
        "Centralized Downloads & Reports Tray",
        "30-Day Download History Access",
      ],
    },
  ];

  const step = tourSteps[currentStep];
  const StepIcon = step?.icon ?? Sparkles;

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onOpenChange(false);
      setCurrentStep(0);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card dark:bg-[#121214] border-border dark:border-[#27272a] text-foreground p-6 sm:p-8">
        <DialogHeader>
          <div className="flex items-center gap-2 text-blue-500 mb-1">
            <Compass className="size-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Product Tour • Step {currentStep + 1} of {tourSteps.length}
            </span>
          </div>
          <DialogTitle className="text-xl font-bold text-foreground">
            {step.title}
          </DialogTitle>
          <p className="text-xs text-muted-foreground">{step.subtitle}</p>
        </DialogHeader>

        {/* Step Card Content */}
        <div className="my-4 panel p-5 bg-secondary/40 dark:bg-[#18181b]/80 border-border dark:border-[#27272a] space-y-4">
          <div className="flex items-start gap-4">
            <div className="size-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0">
              <StepIcon className="size-6 text-blue-500" />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed pt-1">
              {step.description}
            </p>
          </div>

          {/* Highlights bullet list */}
          <div className="space-y-1.5 pt-2 border-t border-border dark:border-[#27272a]">
            <span className="text-[11px] font-semibold text-foreground block">
              Key Capabilities:
            </span>
            <div className="grid gap-1.5 sm:grid-cols-2">
              {step.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-blue-500" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step Navigation Bar */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => {
              onOpenChange(false);
              setCurrentStep(0);
            }}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            Skip Tour
          </button>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrev}
                className="h-8 border-border dark:border-[#3f3f46] bg-background dark:bg-transparent text-foreground hover:bg-secondary text-xs font-semibold"
              >
                <ChevronLeft className="size-4 mr-1" /> Previous
              </Button>
            )}

            <Button
              size="sm"
              onClick={handleNext}
              className="h-8 bg-blue-500 hover:bg-blue-600 text-black font-semibold text-xs cursor-pointer"
            >
              {currentStep === tourSteps.length - 1 ? (
                "Finish Tour"
              ) : (
                <>
                  Next <ChevronRight className="size-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
