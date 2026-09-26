import React, { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  FileText,
  Gift,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScheduledPostItem, INITIAL_SCHEDULED_POSTS } from "@/data/posts-analytics";

interface PostSchedulerTabProps {
  onCreateNew: (type: "update" | "offer" | "event") => void;
  posts?: ScheduledPostItem[];
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function PostSchedulerTab({ onCreateNew, posts = INITIAL_SCHEDULED_POSTS }: PostSchedulerTabProps) {
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(8); // 8 = September (0-indexed)

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Calendar days grid calculation (Sun - Sat format matching Screenshot 1)
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

    const startDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday

    const days: { date: Date; currentMonth: boolean; dayNum: number; fullDateStr: string }[] = [];

    // Prev month padding
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const dayVal = prevMonthLastDay - i;
      const prevDate = new Date(currentYear, currentMonth - 1, dayVal);
      days.push({
        date: prevDate,
        currentMonth: false,
        dayNum: dayVal,
        fullDateStr: prevDate.toISOString().slice(0, 10),
      });
    }

    // Current month days
    for (let d = 1; d <= lastDayOfMonth.getDate(); d++) {
      const curDate = new Date(currentYear, currentMonth, d);
      days.push({
        date: curDate,
        currentMonth: true,
        dayNum: d,
        fullDateStr: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
      });
    }

    // Next month padding to fill 35 or 42 grid cells
    const totalSlots = days.length > 35 ? 42 : 35;
    const remaining = totalSlots - days.length;
    for (let i = 1; i <= remaining; i++) {
      const nextDate = new Date(currentYear, currentMonth + 1, i);
      days.push({
        date: nextDate,
        currentMonth: false,
        dayNum: i,
        fullDateStr: nextDate.toISOString().slice(0, 10),
      });
    }

    return days;
  }, [currentYear, currentMonth]);

  // Metrics counts calculated from posts
  const scheduledCount = posts.filter((p) => p.status === "Upcoming" || p.status === "In Progress").length;
  const publishedCount = posts.filter((p) => p.status === "Posted").length;
  const partiallyFailedCount = posts.filter((p) => p.status === "Partially Failed").length;
  const failedCount = posts.filter((p) => p.status === "Failed").length;

  const getStatusBadge = (status: ScheduledPostItem["status"]) => {
    switch (status) {
      case "Posted":
        return <span className="size-2 rounded-full bg-emerald-500" title="Posted" />;
      case "Failed":
        return <span className="size-2 rounded-full bg-rose-500" title="Failed" />;
      case "Partially Failed":
        return <span className="size-2 rounded-full bg-orange-500" title="Partially Failed" />;
      case "Upcoming":
        return <span className="size-2 rounded-full bg-blue-500" title="Upcoming" />;
      case "In Progress":
        return <span className="size-2 rounded-full bg-zinc-400" title="In Progress" />;
      case "Expired":
        return <span className="size-2 rounded-full bg-zinc-100" title="Expired" />;
    }
  };

  return (
    <div className="rounded-2xl bg-card dark:bg-[#141416] p-6 sm:p-8 space-y-6 shadow-xl border border-border">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Post Scheduler</h1>
          <p className="mt-0.5 text-xs text-muted-foreground">Schedule, manage, and publish updates, offers, and events across your locations.</p>
        </div>

        {/* Top Right + Create New Dropdown Button matching Screenshot 1 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="px-4 py-1.5 rounded-lg bg-blue-400 hover:bg-blue-500 text-black text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm self-start sm:self-auto">
              <Plus className="size-4" />
              <span>Create New</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 bg-popover border-border text-popover-foreground p-1 shadow-xl rounded-lg text-xs"
          >
            <DropdownMenuItem
              onClick={() => onCreateNew("update")}
              className="flex items-center gap-2 p-2 rounded hover:bg-secondary cursor-pointer"
            >
              <FileText className="size-4 text-blue-400" />
              <span>Post Update</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onCreateNew("offer")}
              className="flex items-center gap-2 p-2 rounded hover:bg-secondary cursor-pointer"
            >
              <Gift className="size-4 text-blue-400" />
              <span>Offer</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onCreateNew("event")}
              className="flex items-center gap-2 p-2 rounded hover:bg-secondary cursor-pointer"
            >
              <CalendarIcon className="size-4 text-blue-400" />
              <span>Event</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Month Navigator Header */}
      <div className="flex items-center gap-2 text-sm font-bold text-foreground">
        <button
          onClick={handlePrevMonth}
          className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
        >
          <ChevronLeft className="size-4" />
        </button>
        <span>
          {MONTH_NAMES[currentMonth]} {currentYear}
        </span>
        <button
          onClick={handleNextMonth}
          className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      {/* 4 Summary Metric Cards Grid matching Screenshot 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Scheduled */}
        <div className="rounded-xl border border-border bg-card dark:bg-[#121214] p-4 space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <Clock className="size-3.5 text-blue-400" />
            <span>Scheduled</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{scheduledCount}</p>
        </div>

        {/* Card 2: Published */}
        <div className="rounded-xl border border-border bg-card dark:bg-[#121214] p-4 space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <CheckCircle2 className="size-3.5 text-blue-400" />
            <span>Published</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{publishedCount}</p>
        </div>

        {/* Card 3: Partially Failed */}
        <div className="rounded-xl border border-border bg-card dark:bg-[#121214] p-4 space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <AlertTriangle className="size-3.5 text-blue-400" />
            <span>Partially Failed</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{partiallyFailedCount}</p>
        </div>

        {/* Card 4: Failed */}
        <div className="rounded-xl border border-border bg-card dark:bg-[#121214] p-4 space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <XCircle className="size-3.5 text-blue-400" />
            <span>Failed</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{failedCount}</p>
        </div>
      </div>

      {/* Main Full-Width Month Calendar Grid (Matching Screenshot 1) */}
      <div className="rounded-xl border border-border bg-card dark:bg-[#121214] overflow-hidden shadow-sm">
        {/* Weekday Header Row */}
        <div className="grid grid-cols-7 border-b border-border bg-secondary/40 dark:bg-[#18181b]/60 text-center text-xs font-bold text-foreground py-2.5">
          <span>SUN</span>
          <span>MON</span>
          <span>TUE</span>
          <span>WED</span>
          <span>THU</span>
          <span>FRI</span>
          <span>SAT</span>
        </div>

        {/* Month Grid Cells (35 or 42 cells) */}
        <div className="grid grid-cols-7 divide-x divide-y divide-border">
          {calendarDays.map((cell, idx) => {
            const dayPosts = posts.filter((p) => p.date === cell.fullDateStr);
            // Check if this day is today (September 18, 2026 as per screenshot 1 highlight!)
            const isToday = cell.dayNum === 18 && cell.currentMonth;

            return (
              <div
                key={idx}
                className={`min-h-[110px] p-2 flex flex-col justify-between transition-colors ${
                  !cell.currentMonth ? "bg-muted/40 opacity-40" : "bg-card dark:bg-[#121214]"
                }`}
              >
                {/* Date Number Header */}
                <div className="flex items-center justify-between">
                  {isToday ? (
                    <span className="size-5 rounded-full bg-blue-500 text-black text-[11px] font-extrabold flex items-center justify-center shadow-sm">
                      {cell.dayNum}
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-muted-foreground">{cell.dayNum}</span>
                  )}
                </div>

                {/* Scheduled Posts Badges in Calendar Cell */}
                <div className="space-y-1 my-1 overflow-y-auto max-h-[70px]">
                  {dayPosts.map((post) => (
                    <div
                      key={post.id}
                      className="p-1 rounded bg-secondary/60 dark:bg-[#18181b] border border-border hover:border-blue-500/50 text-[10px] space-y-0.5 cursor-pointer transition-colors"
                      title={post.title}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-foreground truncate">{post.title}</span>
                        {getStatusBadge(post.status)}
                      </div>
                      <span className="text-[9px] text-muted-foreground block truncate">
                        {post.type.toUpperCase()} • {post.listingsCount} stores
                      </span>
                    </div>
                  ))}
                </div>

                <div />
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Post Legend Bar (Matching Screenshot 1) */}
      <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
        <span className="font-bold text-foreground mr-1">Post Legend</span>

        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <span className="size-2 rounded-full bg-emerald-500" />
          Posted
        </span>

        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
          <span className="size-2 rounded-full bg-rose-500" />
          Failed
        </span>

        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-500/15 text-orange-400 border border-orange-500/30">
          <span className="size-2 rounded-full bg-orange-500" />
          Partially Failed
        </span>

        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
          <span className="size-2 rounded-full bg-blue-500" />
          Upcoming
        </span>

        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-zinc-800 text-muted-foreground border border-zinc-700">
          <span className="size-2 rounded-full bg-zinc-400" />
          In Progress
        </span>

        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-black text-foreground border border-foreground/60">
          <span className="size-2 rounded-full bg-zinc-100" />
          Expired
        </span>
      </div>
    </div>
  );
}
