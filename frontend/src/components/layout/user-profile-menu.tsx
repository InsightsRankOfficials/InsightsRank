import { useState } from "react";
import { Building2, Check, CheckCircle2, ChevronDown, Edit3, LogOut, MapPin, User } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useWorkspace, LOCATION_SCOPES } from "@/hooks/use-workspace";
import { useAuth } from "@/hooks/use-auth";

export function UserProfileMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { organizations, organization, setOrganizationId, scope, setScopeId } =
    useWorkspace();

  const handleLogout = async () => {
    setOpen(false);
    try {
      await logout();
      navigate({ to: "/login" });
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  const displayName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email.split('@')[0]
    : "Demo User";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="flex items-center gap-1.5 p-1 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground focus:outline-none"
          aria-label="User profile menu"
        >
          <div className="size-8 rounded-full border border-border bg-secondary flex items-center justify-center">
            <User className="size-4 text-foreground" />
          </div>
          <ChevronDown className="size-3.5 text-muted-foreground" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-80 max-h-[90vh] overflow-y-auto p-4 bg-popover dark:bg-[#121214] border-border dark:border-[#27272a] text-popover-foreground shadow-2xl rounded-xl space-y-4"
      >
        {/* Top Email & Managed info */}
        <div className="text-center space-y-0.5">
          <p className="text-xs font-semibold text-foreground">{user?.email || "demo@example.com"}</p>
          <p className="text-[10px] text-muted-foreground">
            {user?.organization?.name ? `Organization: ${user.organization.name}` : "Managed by Global360"}
          </p>
        </div>

        {/* User Icon Circle */}
        <div className="flex flex-col items-center justify-center space-y-2 py-1">
          <div className="size-16 rounded-full border-2 border-border dark:border-[#27272a] bg-secondary/80 flex items-center justify-center shadow-inner">
            <User className="size-9 text-foreground" />
          </div>

          <div className="text-center">
            <span className="block text-[11px] text-muted-foreground font-medium">Hello!</span>
            <span className="block text-sm font-extrabold text-foreground">{displayName}</span>
            {user?.role && (
              <span className="inline-block mt-0.5 text-[10px] font-mono px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30">
                {user.role}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpen(false)}
            className="w-full h-8 text-xs border-border dark:border-[#3f3f46] bg-transparent text-foreground hover:bg-secondary gap-1.5 font-semibold"
          >
            <Edit3 className="size-3.5" /> Edit Profile
          </Button>

          <Button
            size="sm"
            onClick={handleLogout}
            className="w-full h-9 text-xs bg-secondary dark:bg-[#27272a] hover:bg-secondary/80 dark:hover:bg-[#3f3f46] text-foreground font-semibold rounded-full gap-2 border border-border dark:border-transparent"
          >
            <LogOut className="size-3.5" /> Sign Out
          </Button>
        </div>

        {/* Connected Accounts & Locations Section */}
        <div className="border-t border-border dark:border-[#27272a] pt-3 space-y-3">
          {/* Connected Accounts */}
          <div>
            <div className="flex items-center justify-between px-1 mb-1.5">
              <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase flex items-center gap-1.5">
                <Building2 className="size-3.5 text-blue-500" />
                Connected Accounts
              </span>
              <span className="text-[10px] text-blue-500 font-semibold px-1.5 py-0.5 rounded bg-blue-500/10">
                {organizations.length} Active
              </span>
            </div>
            <div className="space-y-1 max-h-36 overflow-y-auto pr-0.5">
              {organizations.map((org) => {
                const isSelected = org.id === organization.id;
                return (
                  <button
                    key={org.id}
                    onClick={() => setOrganizationId(org.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-all ${
                      isSelected
                        ? "bg-blue-500/15 border border-blue-500/40 text-foreground font-semibold"
                        : "bg-secondary/40 dark:bg-[#18181b] border border-border dark:border-[#27272a] hover:bg-secondary dark:hover:bg-[#27272a] text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`size-6 rounded flex items-center justify-center shrink-0 font-bold text-[10px] ${isSelected ? "bg-blue-500 text-black" : "bg-secondary dark:bg-[#27272a] text-muted-foreground"}`}>
                        {org.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="truncate">{org.name}</span>
                    </div>
                    {isSelected && <CheckCircle2 className="size-3.5 text-blue-500 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Locations Scope */}
          <div>
            <div className="flex items-center justify-between px-1 mb-1.5">
              <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase flex items-center gap-1.5">
                <MapPin className="size-3.5 text-blue-500" />
                Locations
              </span>
              <span className="text-[10px] text-muted-foreground font-medium truncate max-w-[110px]">
                {scope.label}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {LOCATION_SCOPES.map((s) => {
                const isSelected = s.id === scope.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setScopeId(s.id)}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-[11px] transition-all ${
                      isSelected
                        ? "bg-blue-500/20 border border-blue-500/50 text-blue-400 font-semibold"
                        : "bg-secondary/40 dark:bg-[#18181b] border border-border dark:border-[#27272a] hover:bg-secondary dark:hover:bg-[#27272a] text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span className="truncate">{s.label}</span>
                    {isSelected && <Check className="size-3 text-blue-500 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Privacy & Terms links */}
        <div className="text-center text-[11px] text-blue-500 pt-2 border-t border-border dark:border-[#27272a] space-x-2">
          <Link
            to="/privacy-policy"
            onClick={() => setOpen(false)}
            className="hover:underline font-medium text-blue-500"
          >
            Privacy Policy
          </Link>
          <span className="text-muted-foreground">•</span>
          <Link
            to="/terms-of-service"
            onClick={() => setOpen(false)}
            className="hover:underline font-medium text-blue-500"
          >
            Terms of Use
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
