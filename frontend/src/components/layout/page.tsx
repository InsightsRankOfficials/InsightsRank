import type { ReactNode } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Page({ children }: { children: ReactNode }) { return <div className="mx-auto w-full max-w-[1680px] p-4 sm:p-5 lg:p-6">{children}</div>; }
export function PageHeader({ title, description, actions }: { title: string; description: string; actions?: ReactNode }) { return <div className="mb-5 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4"><div className="min-w-0"><h1 className="truncate text-xl font-semibold tracking-normal sm:text-2xl">{title}</h1><p className="mt-1 text-xs text-muted-foreground sm:text-sm">{description}</p></div>{actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}</div>; }
export function Freshness({ label = "Updated 4 minutes ago", onRefresh }: { label?: string; onRefresh?: () => void }) { return <Button variant="outline" size="sm" onClick={onRefresh}><RefreshCw /> <span className="hidden sm:inline">{label}</span></Button>; }
