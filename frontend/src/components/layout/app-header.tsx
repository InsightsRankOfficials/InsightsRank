import { useEffect, useState } from "react";
import {
  Bell,
  Compass,
  Menu,
  Moon,
  Sun,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { useNotifications } from "@/hooks/use-ops";
import { relativeTime } from "@/lib/format";

import { AppSidebar } from "./app-sidebar";
import { RecentExportsPopover } from "./recent-exports-popover";
import { MyDownloadsModal } from "./my-downloads-modal";
import { GuidedTourModal } from "./guided-tour-modal";
import { UserProfileMenu } from "./user-profile-menu";

export function AppHeader({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [downloadsOpen, setDownloadsOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);

  const notifications = useNotifications();
  const unread = notifications.data?.filter((item) => !item.read).length ?? 0;

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
    const initialTheme = savedTheme || "dark";
    setTheme(initialTheme);
    document.documentElement.classList.toggle("light", initialTheme === "light");
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
    if (document.body) {
      document.body.classList.toggle("light", initialTheme === "light");
      document.body.classList.toggle("dark", initialTheme === "dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    document.documentElement.classList.toggle("light", nextTheme === "light");
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    if (document.body) {
      document.body.classList.toggle("light", nextTheme === "light");
      document.body.classList.toggle("dark", nextTheme === "dark");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-2 border-b border-border bg-background/95 px-3 backdrop-blur sm:px-5">
        {/* Left Section: Mobile Menu + Organization & Scope Selectors */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-9 md:hidden"
                aria-label="Open navigation"
              >
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 border-sidebar-border bg-sidebar p-0">
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation</SheetTitle>
                <SheetDescription>Open the InsightsRank navigation.</SheetDescription>
              </SheetHeader>
              <AppSidebar
                collapsed={false}
                onToggle={() => undefined}
                onNavigate={() => setMobileOpen(false)}
                variant="sheet"
              />
            </SheetContent>
          </Sheet>
        </div>

        {/* Right Section: Actions */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">

          {/* Take a Tour Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTourOpen(true)}
            className="hidden sm:flex h-8 px-2.5 text-xs border-blue-500/40 text-blue-500 hover:bg-blue-500/10 font-semibold gap-1.5"
          >
            <Compass className="size-3.5 text-blue-500" />
            <span>Take a Tour</span>
          </Button>

          {/* Recent Exports / Downloads */}
          <RecentExportsPopover onViewAllDownloads={() => setDownloadsOpen(true)} />

          {/* Theme Switcher */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="size-8 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="size-4 text-blue-400" />
            ) : (
              <Moon className="size-4 text-slate-700" />
            )}
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative size-8 rounded-md text-muted-foreground hover:text-foreground"
                aria-label={`${unread} unread notifications`}
              >
                <Bell className="size-4" />
                {unread > 0 && (
                  <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive ring-2 ring-background" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[min(24rem,calc(100vw-1rem))] p-0">
              <div className="flex items-center justify-between px-4 py-3">
                <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
                <Badge variant="outline">{unread} unread</Badge>
              </div>
              <DropdownMenuSeparator />
              {(notifications.data ?? []).slice(0, 5).map((item) => (
                <DropdownMenuItem key={item.id} className="items-start rounded-none px-4 py-3">
                  <span
                    className={`mt-1.5 size-2 shrink-0 rounded-full ${
                      item.priority === "high" ? "bg-destructive" : "bg-primary"
                    }`}
                  />
                  <span className="min-w-0">
                    <span className="block text-xs font-medium">{item.title}</span>
                    <span className="mt-1 block line-clamp-2 text-xs text-muted-foreground">
                      {item.description}
                    </span>
                    <span className="mt-1 block text-[10px] text-muted-foreground">
                      {relativeTime(item.createdAt)}
                    </span>
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile */}
          <UserProfileMenu />
        </div>
      </header>

      {/* Full Downloads Modal matching Screenshot 1 */}
      <MyDownloadsModal open={downloadsOpen} onOpenChange={setDownloadsOpen} />

      {/* Guided Tour Modal */}
      <GuidedTourModal open={tourOpen} onOpenChange={setTourOpen} />
    </>
  );
}
