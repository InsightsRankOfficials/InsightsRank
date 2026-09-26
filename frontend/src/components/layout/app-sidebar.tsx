import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronsLeft, ChevronsRight, Radar } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { APP } from "@/lib/config";
import { cn } from "@/lib/utils";
import { NAV_SECTIONS } from "./navigation";

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
  /** Rendered inside the mobile sheet: always expanded, no collapse control. */
  variant?: "desktop" | "sheet";
}

export function AppSidebar({ collapsed, onToggle, onNavigate, variant = "desktop" }: AppSidebarProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isSheet = variant === "sheet";
  const isCollapsed = !isSheet && collapsed;

  return (
    <div className="flex h-full flex-col bg-sidebar">
      <div
        className={cn(
          "flex h-14 shrink-0 items-center gap-2 border-b border-sidebar-border px-3",
          isCollapsed && "justify-center px-0",
        )}
      >
        <Link
          to="/"
          onClick={onNavigate}
          className="flex min-w-0 items-center gap-2.5 rounded-md px-1 py-1"
          aria-label={`${APP.name} home`}
        >
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Radar className="size-4.5" aria-hidden />
          </span>
          {!isCollapsed && (
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold tracking-tight">
                {APP.name}
              </span>
              <span className="block truncate text-[11px] text-muted-foreground">
                GBP control plane
              </span>
            </span>
          )}
        </Link>
      </div>

      <ScrollArea className="flex-1">
        <nav aria-label="Primary" className={cn("space-y-5 px-2 py-4", isCollapsed && "px-1.5")}>
          {NAV_SECTIONS.map((section) => (
            <div key={section.id}>
              {!isCollapsed && section.label ? (
                <div className="flex items-center gap-1.5 px-2 pb-1.5">
                  {"icon" in section && section.icon && (
                    <section.icon className="size-3 text-muted-foreground/70 shrink-0" aria-hidden />
                  )}
                  <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/80">
                    {section.label}
                  </p>
                </div>
              ) : null}
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const active =
                    "exact" in item && item.exact
                      ? pathname === item.to
                      : pathname === item.to || pathname.startsWith(`${item.to}/`);
                  const Icon = item.icon;

                  const link = (
                    <Link
                      to={item.to}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group flex min-h-9 items-center gap-2.5 rounded-md px-2 text-[13px] font-medium transition-colors",
                        "text-sidebar-foreground/85 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        active &&
                          "bg-primary-muted text-primary hover:bg-primary-muted hover:text-primary",
                        isCollapsed && "justify-center px-0",
                      )}
                    >
                      <Icon className="size-4 shrink-0" aria-hidden />
                      {!isCollapsed && <span className="min-w-0 flex-1 truncate">{item.label}</span>}
                      {!isCollapsed && "badge" in item && item.badge && (
                        <Badge variant="outline" className="tnum h-5 shrink-0 px-1.5 text-[10.5px]">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  );

                  return (
                    <li key={item.to}>
                      {isCollapsed ? (
                        <Tooltip>
                          <TooltipTrigger asChild>{link}</TooltipTrigger>
                          <TooltipContent side="right">
                            {item.label}
                            {"badge" in item && item.badge ? ` · ${item.badge}` : ""}
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        link
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </ScrollArea>

      {!isSheet && (
        <div className="shrink-0 border-t border-sidebar-border p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className={cn("w-full justify-start gap-2 text-muted-foreground", isCollapsed && "justify-center")}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronsRight className="size-4" aria-hidden />
            ) : (
              <ChevronsLeft className="size-4" aria-hidden />
            )}
            {!isCollapsed && <span className="text-[13px]">Collapse</span>}
          </Button>
        </div>
      )}
    </div>
  );
}
