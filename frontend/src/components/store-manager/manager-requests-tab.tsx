import { useState, useMemo } from "react";
import { Eye, ArrowUpDown, ArrowUp, ArrowDown, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  STORE_LOCATIONS_REQUESTS_LIST,
  type StoreLocationRequest,
} from "@/data/store-manager-analytics";

type SortField = keyof StoreLocationRequest;
type SortOrder = "asc" | "desc";

interface ManagerRequestsTabProps {
  onViewRequest: (request: StoreLocationRequest) => void;
}

export function ManagerRequestsTab({ onViewRequest }: ManagerRequestsTabProps) {
  const [requestsList, setRequestsList] = useState<StoreLocationRequest[]>(STORE_LOCATIONS_REQUESTS_LIST);
  const [activeFilter, setActiveFilter] = useState<string>("All");

  // Sorting state
  const [sortField, setSortField] = useState<SortField>("storeName");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // Dynamically compute total aggregate counts across all locations
  const counts = useMemo(() => {
    const all = requestsList.length;
    let pending = 0;
    let approved = 0;
    let rejected = 0;
    let withdrawn = 0;

    requestsList.forEach((r) => {
      const cards = r.requestCards || [];
      pending += cards.filter((c) => c.status === "Pending").length;
      approved += cards.filter((c) => c.status === "Approved" || c.status === "Partially Approved").length;
      rejected += cards.filter((c) => c.status === "Rejected").length;
      withdrawn += cards.filter((c) => c.status === "Withdrawn").length;
    });

    return { all, pending, approved, rejected, withdrawn };
  }, [requestsList]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredAndSortedRequests = useMemo(() => {
    let list = requestsList.map((r) => {
      const cards = r.requestCards || [];
      const pendingCount = cards.filter((c) => c.status === "Pending").length;
      const approvedCount = cards.filter((c) => c.status === "Approved" || c.status === "Partially Approved").length;
      const rejectedCount = cards.filter((c) => c.status === "Rejected").length;
      const withdrawnCount = cards.filter((c) => c.status === "Withdrawn").length;
      const totalCount = cards.length;

      return {
        ...r,
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
        withdrawn: withdrawnCount,
        totalRequests: totalCount,
      };
    });

    if (activeFilter !== "All") {
      const filterLower = activeFilter.toLowerCase();
      list = list.filter((r) => {
        if (filterLower === "pending") return r.pending > 0;
        if (filterLower === "approved") return r.approved > 0;
        if (filterLower === "rejected") return r.rejected > 0;
        if (filterLower === "withdrawn") return r.withdrawn > 0;
        return r.lastStatus.toLowerCase() === filterLower;
      });
    }

    list.sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === "number" && typeof valB === "number") {
        return sortOrder === "asc" ? valA - valB : valB - valA;
      }
      const strA = String(valA || "").toLowerCase();
      const strB = String(valB || "").toLowerCase();
      return sortOrder === "asc" ? strA.localeCompare(strB) : strB.localeCompare(strA);
    });

    return list;
  }, [requestsList, activeFilter, sortField, sortOrder]);

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="size-3 text-muted-foreground/50 ml-1 inline" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="size-3 text-blue-400 ml-1 inline" />
    ) : (
      <ArrowDown className="size-3 text-blue-400 ml-1 inline" />
    );
  };

  const getStatusBadge = (status: StoreLocationRequest["lastStatus"]) => {
    switch (status) {
      case "Approved":
        return <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-[10.5px] font-bold">Approved</Badge>;
      case "Rejected":
        return <Badge variant="outline" className="border-rose-500/30 text-rose-400 bg-rose-500/10 text-[10.5px] font-bold">Rejected</Badge>;
      case "Pending":
        return <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10 text-[10.5px] font-bold">Pending</Badge>;
      case "Partially Approved":
        return <Badge variant="outline" className="border-sky-500/30 text-sky-400 bg-sky-500/10 text-[10.5px] font-bold">Partially Approved</Badge>;
      case "Withdrawn":
        return <Badge variant="outline" className="border-zinc-500/30 text-zinc-400 bg-zinc-500/10 text-[10.5px] font-bold">Withdrawn</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{status}</Badge>;
    }
  };

  return (
    <div className="rounded-2xl bg-card dark:bg-[#141416] p-6 sm:p-8 space-y-6 shadow-xl border border-border">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-xl font-bold text-foreground tracking-tight">Store Locations Request</h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          A detailed overview of request raised by store manager for store information
        </p>
      </div>

      {/* Filter Pills with EXACT matching dynamic counts */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { label: "All", count: counts.all },
          { label: "Pending", count: counts.pending },
          { label: "Approved", count: counts.approved },
          { label: "Rejected", count: counts.rejected },
          { label: "Withdrawn", count: counts.withdrawn },
        ].map((f) => {
          const isActive = activeFilter === f.label;
          return (
            <button
              key={f.label}
              onClick={() => setActiveFilter(f.label)}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? "bg-blue-500 text-black shadow-sm"
                  : "bg-secondary text-muted-foreground hover:text-foreground border border-border hover:bg-secondary/80"
              }`}
            >
              <span>{f.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? "bg-black/20 text-black font-extrabold" : "bg-muted text-muted-foreground"}`}>
                {f.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Requests Table */}
      <div className="panel overflow-hidden border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/40 text-muted-foreground font-semibold">
                <th className="py-3 px-3 w-10 text-center">#</th>
                <th className="py-3 px-3 cursor-pointer hover:text-foreground" onClick={() => handleSort("storeName")}>
                  Store Name {renderSortIcon("storeName")}
                </th>
                <th className="py-3 px-3 cursor-pointer hover:text-foreground" onClick={() => handleSort("managerName")}>
                  Store Manager {renderSortIcon("managerName")}
                </th>
                <th className="py-3 px-3 text-center cursor-pointer hover:text-foreground" onClick={() => handleSort("totalRequests")}>
                  Total Requests {renderSortIcon("totalRequests")}
                </th>
                <th className="py-3 px-3 text-center">Pending</th>
                <th className="py-3 px-3 text-center">Approved</th>
                <th className="py-3 px-3 text-center">Rejected</th>
                <th className="py-3 px-3 text-center">Withdrawn</th>
                <th className="py-3 px-3 cursor-pointer hover:text-foreground" onClick={() => handleSort("lastRequestDate")}>
                  Last Request {renderSortIcon("lastRequestDate")}
                </th>
                <th className="py-3 px-3 cursor-pointer hover:text-foreground" onClick={() => handleSort("lastStatus")}>
                  Last Status {renderSortIcon("lastStatus")}
                </th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredAndSortedRequests.map((req, idx) => (
                <tr key={req.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="py-3 px-3 text-center text-muted-foreground font-mono">{idx + 1}</td>
                  <td className="py-3 px-3">
                    <div className="space-y-0.5">
                      <p className="font-bold text-foreground text-xs">{req.storeName}</p>
                      <p className="text-[10px] text-muted-foreground/80 font-mono">{req.storeCode}</p>
                      <p className="text-[10px] text-muted-foreground/70 truncate max-w-xs">{req.address}</p>
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(req.storeName + " " + req.address)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-500 hover:underline pt-0.5"
                      >
                        <MapPin className="size-2.5" />
                        <span>View on Map</span>
                      </a>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-semibold text-foreground">{req.managerName}</td>
                  <td className="py-3 px-3 text-center tnum font-bold text-foreground">{req.totalRequests}</td>
                  <td className="py-3 px-3 text-center tnum font-semibold text-blue-400">{req.pending}</td>
                  <td className="py-3 px-3 text-center tnum font-semibold text-emerald-400">{req.approved}</td>
                  <td className="py-3 px-3 text-center tnum font-semibold text-rose-400">{req.rejected}</td>
                  <td className="py-3 px-3 text-center tnum font-semibold text-zinc-400">{req.withdrawn}</td>
                  <td className="py-3 px-3 tnum text-muted-foreground text-[11px] whitespace-nowrap">{req.lastRequestDate}</td>
                  <td className="py-3 px-3 whitespace-nowrap">{getStatusBadge(req.lastStatus)}</td>
                  <td className="py-3 px-3 text-right">
                    <Button
                      size="sm"
                      onClick={() => onViewRequest(req)}
                      className="h-7 px-2.5 bg-background border border-border hover:bg-secondary text-foreground text-xs font-medium cursor-pointer gap-1"
                    >
                      <Eye className="size-3 text-blue-500" />
                      <span>View</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
