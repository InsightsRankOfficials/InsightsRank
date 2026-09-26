import type { LucideIcon } from "lucide-react";
import { AlertTriangle, DatabaseZap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function MetricSkeletons({ count = 6 }: { count?: number }) { return <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">{Array.from({ length: count }, (_, i) => <Skeleton key={i} className="h-32 rounded-lg" />)}</div>; }
export function PanelSkeleton({ className = "h-80" }: { className?: string }) { return <Skeleton className={`${className} rounded-lg`} />; }
export function EmptyState({ title, description, icon: Icon = DatabaseZap, action }: { title: string; description: string; icon?: LucideIcon; action?: React.ReactNode }) { return <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center"><span className="grid size-11 place-items-center rounded-md bg-secondary text-muted-foreground"><Icon /></span><h3 className="mt-4 text-sm font-semibold">{title}</h3><p className="mt-1 max-w-sm text-xs text-muted-foreground">{description}</p>{action && <div className="mt-4">{action}</div>}</div>; }
export function ErrorState({ message, retry }: { message: string; retry?: () => void }) { return <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center" role="alert"><AlertTriangle className="size-8 text-destructive" /><h3 className="mt-3 text-sm font-semibold">Unable to load this view</h3><p className="mt-1 max-w-md text-xs text-muted-foreground">{message}</p>{retry && <Button variant="outline" size="sm" className="mt-4" onClick={retry}>Try again</Button>}</div>; }
