import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function KpiCard({ label, value, change, hint, icon: Icon, tone = "default" }: { label: string; value: string; change?: number; hint?: string; icon: LucideIcon; tone?: "default" | "success" | "warning" | "danger" }) {
 const positive = (change ?? 0) > 0; const flat = change === 0; const Trend = flat ? ArrowRight : positive ? ArrowUpRight : ArrowDownRight;
 return <article className="panel group min-w-0 p-4 transition-colors hover:border-border-strong"><div className="flex items-start justify-between gap-2"><div className="min-w-0"><Tooltip><TooltipTrigger asChild><p className="truncate text-[11px] font-medium uppercase text-muted-foreground">{label}</p></TooltipTrigger>{hint && <TooltipContent>{hint}</TooltipContent>}</Tooltip><p className="tnum mt-2 text-2xl font-semibold tracking-normal">{value}</p></div><span className={cn("grid size-8 shrink-0 place-items-center rounded-md bg-secondary text-muted-foreground", tone === 'success' && 'bg-success-muted text-success', tone === 'warning' && 'bg-warning-muted text-warning', tone === 'danger' && 'bg-destructive-muted text-destructive')}><Icon className="size-4" /></span></div>{change !== undefined && <div className="mt-3 flex items-center gap-1 text-[11px]"><span className={cn("flex items-center gap-0.5 font-medium", positive ? "text-success" : flat ? "text-muted-foreground" : "text-destructive")}><Trend className="size-3" />{Math.abs(change).toFixed(1)}%</span><span className="text-muted-foreground">vs prior period</span></div>}</article>
}
