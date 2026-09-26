import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { AppSidebar } from "./app-sidebar";
import { AppHeader } from "./app-header";
import { MOBILE_NAV } from "./navigation";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  return <div className="min-h-svh bg-background text-foreground">
    <aside className={cn("fixed inset-y-0 left-0 z-40 hidden border-r border-sidebar-border bg-sidebar transition-[width] duration-200 md:block", collapsed ? "w-14" : "w-60")}><AppSidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} /></aside>
    <div className={cn("min-h-svh transition-[padding] duration-200 md:pl-60", collapsed && "md:pl-14")}><AppHeader collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} /><main id="main-content" className="pb-20 md:pb-0">{children}</main></div>
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden" aria-label="Mobile navigation">{MOBILE_NAV.map(({ to, label, icon: Icon }) => { const active = to === '/' ? pathname === '/' : pathname.startsWith(to); return <Link key={to} to={to} className={cn("flex min-h-14 flex-col items-center justify-center gap-1 text-[10px] text-muted-foreground", active && "text-primary")}><Icon className="size-4" /><span>{label}</span></Link> })}</nav>
  </div>;
}
