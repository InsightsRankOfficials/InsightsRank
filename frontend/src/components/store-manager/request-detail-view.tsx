import React, { useState, useMemo } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { StoreLocationRequest, RequestCard } from "@/data/store-manager-analytics";
import {
  ArrowLeft,
  ExternalLink,
  MapPin,
  Check,
  X,
  ImageOff,
  CheckCircle2,
  XCircle,
  Home,
  ChevronRight,
  Phone,
  FileText,
  ImageIcon,
} from "lucide-react";
import { PartiallyApproveModal } from "./partially-approve-modal";
import { ApproveRequestModal } from "./approve-request-modal";

interface RequestDetailViewProps {
  request: StoreLocationRequest;
  onBack: () => void;
}

export function RequestDetailView({ request, onBack }: RequestDetailViewProps) {
  const [requestCards, setRequestCards] = useState<RequestCard[]>(request.requestCards);
  const [activeFilter, setActiveFilter] = useState<string>("All");

  // State for modals
  const [selectedCardForPartial, setSelectedCardForPartial] = useState<RequestCard | null>(null);
  const [isPartialModalOpen, setIsPartialModalOpen] = useState(false);

  const [selectedCardForApprove, setSelectedCardForApprove] = useState<RequestCard | null>(null);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);

  // Dynamic counts calculated straight from actual data array
  const counts = useMemo(() => {
    const all = requestCards.length;
    const pending = requestCards.filter((c) => c.status === "Pending").length;
    const approved = requestCards.filter((c) => c.status === "Approved" || c.status === "Partially Approved").length;
    const rejected = requestCards.filter((c) => c.status === "Rejected").length;
    const withdrawn = requestCards.filter((c) => c.status === "Withdrawn").length;
    return { all, pending, approved, rejected, withdrawn };
  }, [requestCards]);

  const filterOptions = [
    { label: "All", count: counts.all },
    { label: "Pending", count: counts.pending },
    { label: "Withdrawn", count: counts.withdrawn },
    { label: "Approved", count: counts.approved },
    { label: "Rejected", count: counts.rejected },
  ];

  // Open Approve Modal
  const handleOpenApproveModal = (card: RequestCard) => {
    setSelectedCardForApprove(card);
    setIsApproveModalOpen(true);
  };

  // Handle Approval Action with optional comment
  const handleConfirmApprove = (comment: string) => {
    if (!selectedCardForApprove) return;
    const nowStr = "Super Admin on Today, " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setRequestCards((prev) =>
      prev.map((card) =>
        card.id === selectedCardForApprove.id
          ? {
              ...card,
              status: "Approved",
              statusInfo: nowStr,
              approverComment: comment || card.approverComment || "Approved",
              images: (card.images || []).map((img) => ({ ...img, status: "approved", isNew: false })),
            }
          : card
      )
    );
    setSelectedCardForApprove(null);
  };

  // Handle Reject Action
  const handleRejectCard = (cardId: string) => {
    const nowStr = "Super Admin on Today, " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setRequestCards((prev) =>
      prev.map((card) =>
        card.id === cardId
          ? {
              ...card,
              status: "Rejected",
              statusInfo: nowStr,
              approverComment: "Request rejected by approver.",
              images: (card.images || []).map((img) => ({ ...img, status: "rejected", isNew: false })),
            }
          : card
      )
    );
  };

  // Partial approval handlers
  const handleOpenPartialModal = (card: RequestCard) => {
    setSelectedCardForPartial(card);
    setIsPartialModalOpen(true);
  };

  const handleApplyPartial = (
    decisions: Record<string, "approved" | "rejected">,
    comment: string
  ) => {
    if (!selectedCardForPartial) return;

    setRequestCards((prev) =>
      prev.map((card) => {
        if (card.id !== selectedCardForPartial.id) return card;
        const updatedImages = (card.images || []).map((img) => ({
          ...img,
          status: decisions[img.id] || img.status || "approved",
          isNew: false,
        }));
        const approvedCount = updatedImages.filter((i) => i.status === "approved").length;
        const total = updatedImages.length;
        let newStatus: RequestCard["status"] = "Partially Approved";
        if (approvedCount === total) newStatus = "Approved";
        if (approvedCount === 0) newStatus = "Rejected";

        return {
          ...card,
          status: newStatus,
          statusInfo: `Demo User on Just now`,
          approverComment: comment || `partially approved test`,
          images: updatedImages,
        };
      })
    );
  };

  const filteredCards = useMemo(() => {
    if (activeFilter === "All") return requestCards;
    if (activeFilter === "Approved") {
      return requestCards.filter(
        (card) => card.status === "Approved" || card.status === "Partially Approved"
      );
    }
    return requestCards.filter((card) => card.status.toLowerCase() === activeFilter.toLowerCase());
  }, [requestCards, activeFilter]);

  const getCardIcon = (type: string) => {
    if (type.includes("Phone")) return <Phone className="size-3.5 text-cyan-400" />;
    if (type.includes("Image")) return <ImageIcon className="size-3.5 text-blue-400" />;
    return <FileText className="size-3.5 text-emerald-400" />;
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
          Store Manager
        </span>
        <ChevronRight className="size-3 text-muted-foreground/60" />
        <span className="font-semibold text-foreground">Request Details</span>
      </div>

      {/* Main Off-Black Card Container */}
      <div className="rounded-2xl bg-card dark:bg-[#141416] p-6 sm:p-8 space-y-6 shadow-xl border border-border">
        {/* Header Info Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              {request.storeName}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5 text-muted-foreground/60" />
                {request.storeCode}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5 text-muted-foreground/60" />
                {request.address}
              </span>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(request.storeName + " " + request.address)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-blue-500 hover:underline font-semibold cursor-pointer transition-colors"
              >
                <ExternalLink className="size-3" />
                <span>View on Map</span>
              </a>
            </div>
          </div>

          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-secondary text-xs font-semibold text-foreground cursor-pointer transition-colors self-start md:self-auto"
          >
            <ArrowLeft className="size-3.5" />
            Back
          </button>
        </div>

        {/* Summary Filter Badges with EXACT matching counts */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {filterOptions.map((opt) => {
            const isActive = activeFilter === opt.label;
            return (
              <button
                key={opt.label}
                onClick={() => setActiveFilter(opt.label)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-background text-foreground border border-border shadow-sm"
                    : "bg-secondary/40 text-muted-foreground border border-border hover:text-foreground"
                }`}
              >
                <span>{opt.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive
                      ? "bg-cyan-500 text-black font-extrabold"
                      : "bg-cyan-500/20 text-cyan-500"
                  }`}
                >
                  {opt.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Cards List rendering image and non-image request cards */}
        <div className="space-y-4">
          {filteredCards.length === 0 ? (
            <div className="panel p-6">
              <EmptyState description={`No request cards matching filter "${activeFilter}".`} />
            </div>
          ) : (
            filteredCards.map((card) => {
              const isImageType = card.type.includes("Image");

              return (
                <div
                  key={card.id}
                  className="rounded-xl border border-border bg-card dark:bg-[#121214] p-5 space-y-4 shadow-sm"
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {getCardIcon(card.type)}
                        <h3 className="text-xs font-bold text-foreground">{card.type}</h3>
                        {card.isUpdated && (
                          <span className="px-2 py-0.5 rounded border border-cyan-500/40 bg-cyan-500/10 text-cyan-400 text-[10px] font-extrabold tracking-wide">
                            Request Updated
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-muted-foreground space-y-0.5">
                        <p>
                          {card.date.startsWith("Submitted") ? card.date : `Submitted ${card.date}`} by{" "}
                          <span className="text-foreground/90 font-medium">{card.raisedBy}</span>
                        </p>
                        {card.lastUpdatedDate && (
                          <p className="text-muted-foreground/75 text-[10px]">
                            Last updated {card.lastUpdatedDate}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right side Actions / Status Badge */}
                    <div className="flex items-center gap-2 self-start sm:self-center">
                      {card.status === "Pending" ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleRejectCard(card.id)}
                            className="px-3 py-1 rounded-md border border-rose-500/60 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <X className="size-3.5" />
                            Reject
                          </button>
                          {isImageType && card.images && card.images.length > 0 && (
                            <button
                              onClick={() => handleOpenPartialModal(card)}
                              className="px-3 py-1 rounded-md border border-cyan-500/60 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              Partially Approve
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenApproveModal(card)}
                            className="px-3 py-1.5 rounded-md bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-sm"
                          >
                            <Check className="size-3.5" />
                            Approve
                          </button>
                        </div>
                      ) : card.status === "Rejected" ? (
                        <div className="text-right">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold">
                            <X className="size-3.5" /> Rejected
                          </span>
                          {card.statusInfo && (
                            <p className="text-[10px] text-muted-foreground mt-0.5">{card.statusInfo}</p>
                          )}
                        </div>
                      ) : card.status === "Partially Approved" ? (
                        <div className="text-right">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-bold">
                            <Check className="size-3.5" /> Partially Approved
                          </span>
                          {card.statusInfo && (
                            <p className="text-[10px] text-muted-foreground mt-0.5">{card.statusInfo}</p>
                          )}
                        </div>
                      ) : card.status === "Withdrawn" ? (
                        <div className="text-right">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-bold">
                            Request Withdrawn
                          </span>
                          {card.statusInfo && (
                            <p className="text-[10px] text-muted-foreground mt-0.5">{card.statusInfo}</p>
                          )}
                        </div>
                      ) : (
                        <div className="text-right">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                            <Check className="size-3.5" /> Approved
                          </span>
                          {card.statusInfo && (
                            <p className="text-[10px] text-muted-foreground mt-0.5">{card.statusInfo}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Non-Image Value Content Box */}
                  {!isImageType && (
                    <div className="p-3.5 rounded-xl border border-border bg-secondary/30 text-xs font-mono space-y-2">
                      {card.phoneNumbers && card.phoneNumbers.length > 0 ? (
                        <div className="text-emerald-500 font-bold tracking-wide">
                          {card.phoneNumbers.join(", ")}
                        </div>
                      ) : card.oldValue && card.newValue ? (
                        <div className="space-y-1.5">
                          <div className="flex items-start gap-2 text-rose-500/90 line-through">
                            <span className="px-1.5 py-0.2 rounded bg-rose-500/10 text-[10px] font-sans no-underline font-bold text-rose-500">Old</span>
                            <span>{card.oldValue}</span>
                          </div>
                          <div className="flex items-start gap-2 text-emerald-500 font-bold">
                            <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-[10px] font-sans font-bold text-emerald-600 dark:text-emerald-300">New</span>
                            <span>{card.newValue}</span>
                          </div>
                        </div>
                      ) : card.newValue ? (
                        <div className="text-emerald-500 font-bold">{card.newValue}</div>
                      ) : card.oldValue ? (
                        <div className="text-foreground">{card.oldValue}</div>
                      ) : null}
                    </div>
                  )}

                  {/* Manager's Comment Container matching screenshot 2 */}
                  {card.managerComment && (
                    <div className="p-3 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-xs space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-500 block">
                        Manager's Comment
                      </span>
                      <p className="text-foreground/90 font-medium">{card.managerComment}</p>
                    </div>
                  )}

                  {/* Approver's Comment Container */}
                  {card.approverComment && (
                    <div
                      className={`p-3 rounded-xl border text-xs space-y-1 ${
                        card.status === "Rejected"
                          ? "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-300"
                          : "border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-300"
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider block text-foreground">
                        Approver's Comment
                      </span>
                      <p>{card.approverComment}</p>
                    </div>
                  )}

                  {/* Image Grid / "No Images" Container for Image Cards */}
                  {isImageType && (
                    <div className="pt-1">
                      {!card.images || card.images.length === 0 ? (
                        <div className="flex flex-col items-center justify-center w-44 h-28 rounded-xl border border-dashed border-border bg-secondary/30 text-muted-foreground text-xs space-y-1">
                          <ImageOff className="size-6 text-muted-foreground/60" />
                          <span className="font-semibold text-[11px]">No images</span>
                          <span className="text-[10px] text-muted-foreground/60">Image no longer available</span>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-3">
                          {card.images.map((img, idx) => (
                            <div
                              key={img.id || idx}
                              className="relative group w-36 h-28 rounded-xl overflow-hidden border border-border bg-background"
                            >
                              <img
                                src={img.url}
                                alt={`Requested image ${idx + 1}`}
                                className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-200"
                              />

                              {/* Badges overlay */}
                              {img.isNew && (
                                <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-sky-500 text-black text-[10px] font-extrabold shadow">
                                  New
                                </span>
                              )}

                              {img.status === "approved" && (
                                <span className="absolute top-1.5 right-1.5 size-5 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow">
                                  <CheckCircle2 className="size-3.5 text-black" />
                                </span>
                              )}

                              {img.status === "rejected" && (
                                <span className="absolute top-1.5 right-1.5 size-5 rounded-full bg-rose-500 text-white flex items-center justify-center shadow">
                                  <XCircle className="size-3.5 text-white" />
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Approve Modal with optional comment */}
        <ApproveRequestModal
          isOpen={isApproveModalOpen}
          onClose={() => {
            setIsApproveModalOpen(false);
            setSelectedCardForApprove(null);
          }}
          onConfirm={handleConfirmApprove}
        />

        {/* Partially Approve Modal */}
        <PartiallyApproveModal
          isOpen={isPartialModalOpen}
          onClose={() => {
            setIsPartialModalOpen(false);
            setSelectedCardForPartial(null);
          }}
          card={selectedCardForPartial}
          onApply={handleApplyPartial}
        />
      </div>
    </div>
  );
}
