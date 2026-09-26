import { useState, useMemo } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateRangePickerProps {
  value: string;
  onChange: (value: string) => void;
  variant?: "button" | "input";
  className?: string;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const PRESETS = [
  "Last Week",
  "Last 7 Days",
  "Last 30 Days",
  "Last Month",
  "Last 2 Months",
  "Last 3 Months",
];

function formatDate(d: Date): string {
  const day = String(d.getDate()).padStart(2, "0");
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

export function DateRangePicker({
  value,
  onChange,
  variant = "button",
  className,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date(2026, 9, 1)); // Oct 2026 default view

  // Selection range state
  const [startDate, setStartDate] = useState<Date | null>(new Date(2026, 3, 1)); // 01 Apr 2026
  const [endDate, setEndDate] = useState<Date | null>(new Date(2026, 8, 17));   // 17 Sep 2026
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  // Calendar days grid calculation
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Monday is start of week (0 index for Mo)
    let startDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    const days: { date: Date; currentMonth: boolean }[] = [];

    // Previous month padding days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        currentMonth: false,
      });
    }

    // Current month days
    for (let d = 1; d <= lastDayOfMonth.getDate(); d++) {
      days.push({
        date: new Date(year, month, d),
        currentMonth: true,
      });
    }

    // Next month padding days to fill 35 or 42 slots
    const totalSlots = days.length > 35 ? 42 : 35;
    const remaining = totalSlots - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        currentMonth: false,
      });
    }

    return days;
  }, [year, month]);

  const handleDayClick = (date: Date) => {
    if (!startDate || (startDate && endDate)) {
      // First click: Pick Start Date
      setStartDate(date);
      setEndDate(null);
    } else {
      // Second click: Pick End Date
      if (date < startDate) {
        setStartDate(date);
        setEndDate(null);
      } else {
        setEndDate(date);
        const rangeString = `${formatDate(startDate)} - ${formatDate(date)}`;
        onChange(rangeString);
      }
    }
  };

  const handleSelectPreset = (preset: string) => {
    const today = new Date(2026, 8, 17);
    let from = new Date(today);

    if (preset === "Last Week" || preset === "Last 7 Days") {
      from.setDate(today.getDate() - 7);
    } else if (preset === "Last 30 Days" || preset === "Last Month") {
      from.setDate(today.getDate() - 30);
    } else if (preset === "Last 2 Months") {
      from.setDate(today.getDate() - 60);
    } else if (preset === "Last 3 Months") {
      from.setDate(today.getDate() - 90);
    }

    setStartDate(from);
    setEndDate(today);
    onChange(preset);
    setOpen(false);
  };

  const handleApply = () => {
    if (startDate && endDate) {
      const rangeString = `${formatDate(startDate)} - ${formatDate(endDate)}`;
      onChange(rangeString);
    } else if (startDate) {
      const rangeString = `${formatDate(startDate)} - ${formatDate(startDate)}`;
      onChange(rangeString);
    }
    setOpen(false);
  };

  const isSelectedStart = (d: Date) =>
    startDate ? d.toDateString() === startDate.toDateString() : false;

  const isSelectedEnd = (d: Date) =>
    endDate ? d.toDateString() === endDate.toDateString() : false;

  const isInRange = (d: Date) => {
    if (!startDate) return false;
    const target = endDate || hoverDate;
    if (!target) return false;
    return d > startDate && d < target;
  };

  const statusText = useMemo(() => {
    if (startDate && endDate) {
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }
    if (startDate) {
      return `Start: ${formatDate(startDate)} (Select End Date)`;
    }
    return value || "Select Date Range";
  }, [startDate, endDate, value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {variant === "input" ? (
          <div
            onClick={() => setOpen(true)}
            className={cn(
              "relative flex items-center h-8 w-full rounded bg-white dark:bg-[#18181b] border border-slate-300 dark:border-[#27272a] hover:border-slate-400 dark:hover:border-[#3f3f46] px-2.5 text-xs text-slate-800 dark:text-foreground cursor-pointer transition-colors focus-within:ring-1 focus-within:ring-blue-500 shadow-sm select-none",
              className
            )}
          >
            <span className="truncate pr-5 tnum font-medium text-xs">
              {value || "01 Apr 2026 - 17 Sep 2026"}
            </span>
            <CalendarIcon className="size-3.5 text-blue-500 absolute right-2 shrink-0 pointer-events-none" />
          </div>
        ) : (
          <button
            type="button"
            className={cn(
              "h-8 px-3 rounded-md bg-white dark:bg-[#121214] border border-slate-300 dark:border-[#27272a] hover:bg-slate-100 dark:hover:bg-[#27272a] hover:border-slate-400 dark:hover:border-[#3f3f46] text-xs font-semibold text-slate-800 dark:text-foreground flex items-center gap-2 cursor-pointer transition-colors shadow-sm max-w-full select-none",
              className
            )}
          >
            <CalendarIcon className="size-3.5 text-blue-500 shrink-0" />
            <span className="tnum truncate">{value}</span>
          </button>
        )}
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-[280px] sm:w-[290px] max-w-[calc(100vw-2rem)] p-3 bg-white dark:bg-[#121214] border-slate-200 dark:border-[#27272a] text-slate-900 dark:text-foreground shadow-2xl rounded-xl z-50 overflow-hidden"
      >
        {/* Status Indicator Banner */}
        <div className="bg-slate-100 dark:bg-[#18181b] border border-slate-200 dark:border-[#27272a] rounded-md px-2.5 py-1 mb-2.5 text-[11px] text-blue-600 dark:text-blue-400 font-semibold tnum flex items-center justify-between">
          <span className="truncate">{statusText}</span>
          {startDate && endDate && <Check className="size-3 text-emerald-600 dark:text-emerald-400 shrink-0 ml-1" />}
        </div>

        {/* Month Navigation Header */}
        <div className="flex items-center justify-between text-xs font-bold pb-2 border-b border-slate-200 dark:border-[#27272a]">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setViewDate(new Date(year, month - 1, 1));
            }}
            className="p-1 hover:bg-slate-100 dark:hover:bg-[#27272a] rounded cursor-pointer transition-colors text-foreground"
          >
            <ChevronLeft className="size-3.5" />
          </button>
          <span className="text-xs font-bold text-foreground">
            {MONTH_NAMES[month]} {year}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setViewDate(new Date(year, month + 1, 1));
            }}
            className="p-1 hover:bg-slate-100 dark:hover:bg-[#27272a] rounded cursor-pointer transition-colors text-foreground"
          >
            <ChevronRight className="size-3.5" />
          </button>
        </div>

        {/* Weekdays Header */}
        <div className="grid grid-cols-7 text-center text-[10px] font-semibold text-muted-foreground my-1.5">
          <span>Mo</span>
          <span>Tu</span>
          <span>We</span>
          <span>Th</span>
          <span>Fr</span>
          <span>Sa</span>
          <span>Su</span>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-0.5 text-center text-[11px] tnum">
          {calendarDays.map(({ date, currentMonth }, i) => {
            const isStart = isSelectedStart(date);
            const isEnd = isSelectedEnd(date);
            const inRange = isInRange(date);

            return (
              <button
                key={i}
                type="button"
                onMouseEnter={() => startDate && !endDate && setHoverDate(date)}
                onClick={() => handleDayClick(date)}
                className={cn(
                  "h-6 w-full text-[10px] flex items-center justify-center transition-colors cursor-pointer rounded-xs",
                  !currentMonth && "text-muted-foreground/40",
                  currentMonth && !isStart && !isEnd && !inRange && "text-slate-800 dark:text-foreground hover:bg-blue-500/20 hover:text-blue-600 dark:hover:text-blue-400",
                  (isStart || isEnd) && "bg-blue-500 text-black font-extrabold shadow-sm rounded-md",
                  inRange && "bg-blue-500/25 text-blue-700 dark:text-blue-300 rounded-none"
                )}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>

        {/* Quick Presets Grid */}
        <div className="grid grid-cols-2 gap-1 pt-2.5 mt-2 border-t border-slate-200 dark:border-[#27272a]">
          {PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className={cn(
                "py-1 px-1.5 text-[9.5px] font-semibold rounded border transition-colors cursor-pointer text-center truncate",
                value === preset
                  ? "bg-blue-500 text-black border-blue-500 font-bold shadow-xs"
                  : "bg-slate-100 dark:bg-[#18181b] border-slate-200 dark:border-[#27272a] text-blue-600 dark:text-blue-500 hover:bg-blue-500/10 hover:border-blue-500/40"
              )}
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Apply & Close Action Bar */}
        <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-200 dark:border-[#27272a]">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-[10px] font-semibold text-muted-foreground hover:text-foreground cursor-pointer px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-[#18181b]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="text-[10px] font-bold bg-blue-500 hover:bg-blue-600 text-black px-3 py-1 rounded cursor-pointer transition-colors"
          >
            Apply Range
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
