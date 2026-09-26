import React, { useState, useMemo, useEffect } from "react";
import {
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  Edit2,
  Mail,
  ShieldAlert,
  Trash2,
  CheckCircle2,
  Plus,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Building,
  Save,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { USERS } from "@/data/users";
import type { OrganizationUser, RoleId, UserStatus } from "@/types/user";
import { initials } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usersApi } from "@/api/auth";

const ROLE_OPTIONS = [
  { value: "owner", label: "Owner" },
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "analyst", label: "Analyst" },
  { value: "viewer", label: "Viewer" },
];

const TEAM_OPTIONS = ["Support", "Operations", "Marketing", "Executive", "Sales", "Regional"];

export function OrganizationUsersTab() {
  // Local list state for users
  const [usersList, setUsersList] = useState<OrganizationUser[]>(USERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load live DB users on mount
  useEffect(() => {
    usersApi
      .getOrganizationUsers()
      .then((dbUsers) => {
        if (dbUsers && dbUsers.length > 0) {
          const mappedUsers: OrganizationUser[] = dbUsers.map((u) => ({
            id: u.id,
            organizationId: u.organizationId,
            name: `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.email.split("@")[0],
            email: u.email,
            role: (u.role?.toLowerCase() as RoleId) || "manager",
            teams: ["Operations"],
            status: "active",
            lastActiveAt: new Date().toISOString(),
            locationScope: "All locations",
            avatarInitials: initials(`${u.firstName || ""} ${u.lastName || ""}`.trim() || u.email),
          }));
          setUsersList(mappedUsers);
        }
      })
      .catch(() => {
        // Fallback to local state if offline/demo
      });
  }, []);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal States
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<OrganizationUser | null>(null);

  // Invite Form State
  const [inviteForm, setInviteForm] = useState({
    name: "",
    email: "",
    password: "Password123!",
    role: "manager" as RoleId,
    team: "Operations",
    locationScope: "All locations",
  });

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return usersList.filter((u) => {
      const matchQuery =
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.role.toLowerCase().includes(searchTerm.toLowerCase());
      const matchRole = roleFilter === "all" || u.role === roleFilter;
      const matchStatus = statusFilter === "all" || u.status === statusFilter;

      return matchQuery && matchRole && matchStatus;
    });
  }, [usersList, searchTerm, roleFilter, statusFilter]);

  // Paginated Users
  const totalItems = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const paginatedUsers = useMemo(() => {
    return filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  // Handlers
  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteForm.name || !inviteForm.email) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const nameParts = inviteForm.name.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const roleMap: Record<string, "OWNER" | "ADMIN" | "MEMBER"> = {
      owner: "OWNER",
      admin: "ADMIN",
      manager: "MEMBER",
      analyst: "MEMBER",
      viewer: "MEMBER",
    };

    setIsSubmitting(true);
    try {
      // Save user details to PostgreSQL database
      const createdUser = await usersApi.inviteUser({
        email: inviteForm.email,
        password: inviteForm.password,
        firstName,
        lastName,
        role: roleMap[inviteForm.role] || "MEMBER",
      });

      const newUser: OrganizationUser = {
        id: createdUser.id,
        organizationId: createdUser.organizationId,
        name: inviteForm.name,
        email: inviteForm.email,
        role: inviteForm.role,
        teams: [inviteForm.team],
        status: "active",
        lastActiveAt: new Date().toISOString(),
        locationScope: inviteForm.locationScope,
        avatarInitials: initials(inviteForm.name),
      };

      setUsersList((prev) => [newUser, ...prev]);
      setInviteModalOpen(false);
      toast.success(`User ${inviteForm.email} created & saved to database!`);

      // Reset Form
      setInviteForm({
        name: "",
        email: "",
        password: "Password123!",
        role: "manager",
        team: "Operations",
        locationScope: "All locations",
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to create user in database.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEditUser = (user: OrganizationUser) => {
    setEditingUser({ ...user });
    setEditModalOpen(true);
  };

  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setUsersList((prev) =>
      prev.map((u) => (u.id === editingUser.id ? { ...editingUser } : u))
    );
    setEditModalOpen(false);
    toast.success(`User details for ${editingUser.name} updated successfully!`);
    setEditingUser(null);
  };

  const handleResendInvite = (user: OrganizationUser) => {
    toast.success(`Invitation email resent to ${user.email}`);
  };

  const handleToggleStatus = (user: OrganizationUser) => {
    const nextStatus: UserStatus = user.status === "active" ? "suspended" : "active";
    setUsersList((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u))
    );

    if (nextStatus === "suspended") {
      toast.success(`User ${user.name} has been suspended.`);
    } else {
      toast.success(`User ${user.name} access restored to active.`);
    }
  };

  const handleDeleteUser = (user: OrganizationUser) => {
    if (user.role === "owner") {
      toast.error("Organization owner cannot be deleted.");
      return;
    }

    setUsersList((prev) => prev.filter((u) => u.id !== user.id));
    toast.success(`User ${user.name} removed from organization.`);
  };

  return (
    <div className="space-y-6 text-foreground">
      {/* Header matching Rankings Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">
            Organization Users
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Manage access, team roles, location scopes, and account invitations.
          </p>
        </div>

        <div>
          <Button
            onClick={() => setInviteModalOpen(true)}
            className="h-8 bg-blue-500 hover:bg-blue-600 text-black font-bold text-xs px-4 cursor-pointer gap-1.5 rounded-md shadow-sm transition-colors"
          >
            <UserPlus className="size-4" />
            <span>Invite User</span>
          </Button>
        </div>
      </div>

      {/* Control Bar: Search & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search users by name, email, or role..."
            className="w-full pl-9 pr-4 h-8 rounded-md border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Role Filter */}
          <Select
            value={roleFilter}
            onValueChange={(val) => {
              setRoleFilter(val);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-8 w-32 bg-background border-border text-xs cursor-pointer">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border text-popover-foreground text-xs">
              <SelectItem value="all">All Roles</SelectItem>
              {ROLE_OPTIONS.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select
            value={statusFilter}
            onValueChange={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-8 w-32 bg-background border-border text-xs cursor-pointer">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border text-popover-foreground text-xs">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="invited">Invited</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Users Data Table */}
      <div className="panel p-0 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/30 text-muted-foreground font-semibold select-none">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Teams</th>
                <th className="py-3 px-4">Location Scope</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4">Last Active</th>
                <th className="py-3 px-3 text-center w-12">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-foreground">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-muted-foreground">
                    No organization users found matching criteria.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 font-bold flex items-center justify-center text-xs shrink-0">
                          {u.avatarInitials || initials(u.name)}
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{u.name}</p>
                          <p className="text-[10px] text-muted-foreground font-mono">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-secondary/50 dark:bg-[#18181b] border border-border text-blue-400 uppercase tracking-wider">
                        {u.role}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-muted-foreground font-medium">
                      {u.teams.join(", ")}
                    </td>

                    <td className="py-3 px-4 text-muted-foreground font-medium">{u.locationScope}</td>

                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          u.status === "active"
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                            : u.status === "invited"
                            ? "bg-blue-500/15 text-blue-400 border-blue-500/30"
                            : "bg-rose-500/15 text-rose-400 border-rose-500/30"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-muted-foreground text-[11px] font-mono">
                      {u.lastActiveAt ? new Date(u.lastActiveAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "Never"}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer">
                            <MoreVertical className="size-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44 bg-popover border-border text-popover-foreground text-xs p-1">
                          <DropdownMenuItem
                            onClick={() => handleOpenEditUser(u)}
                            className="flex items-center gap-2 px-2.5 py-1.5 cursor-pointer hover:bg-secondary rounded"
                          >
                            <Edit2 className="size-3.5 text-blue-500" />
                            <span>Edit Role &amp; Access</span>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => handleResendInvite(u)}
                            className="flex items-center gap-2 px-2.5 py-1.5 cursor-pointer hover:bg-secondary rounded"
                          >
                            <Mail className="size-3.5 text-blue-400" />
                            <span>Resend Invite</span>
                          </DropdownMenuItem>

                          <DropdownMenuSeparator className="bg-border my-1" />

                          <DropdownMenuItem
                            onClick={() => handleToggleStatus(u)}
                            className="flex items-center gap-2 px-2.5 py-1.5 cursor-pointer hover:bg-secondary rounded"
                          >
                            <ShieldAlert className="size-3.5 text-blue-400" />
                            <span>{u.status === "active" ? "Suspend User" : "Activate User"}</span>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => handleDeleteUser(u)}
                            className="flex items-center gap-2 px-2.5 py-1.5 cursor-pointer hover:bg-secondary text-rose-400 rounded"
                          >
                            <Trash2 className="size-3.5 text-rose-400" />
                            <span>Delete User</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Standardized Pagination Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-t border-border text-xs bg-card dark:bg-[#121214]">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-[11px]">Rows per page:</span>
            <Select
              value={String(pageSize)}
              onValueChange={(val) => {
                setPageSize(Number(val));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-7 w-16 bg-background border-border text-foreground text-xs cursor-pointer">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border text-popover-foreground text-xs">
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-muted-foreground text-[11px] ml-2">
              Showing <span className="font-semibold text-foreground">{startItem}</span> -{" "}
              <span className="font-semibold text-foreground">{endItem}</span> of{" "}
              <span className="font-semibold text-foreground">{totalItems}</span> items
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-7 w-7 p-0 border-border text-foreground hover:bg-secondary disabled:opacity-40"
            >
              <ChevronLeft className="size-3.5" />
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                onClick={() => setCurrentPage(pg)}
                className={`h-7 min-w-[28px] px-1.5 rounded text-xs font-semibold cursor-pointer transition-colors ${
                  currentPage === pg
                    ? "bg-blue-500 text-black font-bold"
                    : "bg-background text-muted-foreground hover:text-foreground border border-border hover:bg-secondary"
                }`}
              >
                {pg}
              </button>
            ))}

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="h-7 w-7 p-0 border-border text-foreground hover:bg-secondary disabled:opacity-40"
            >
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Modal 1: Invite User Modal */}
      <Dialog open={inviteModalOpen} onOpenChange={setInviteModalOpen}>
        <DialogContent className="sm:max-w-md bg-card dark:bg-[#121214] border-border text-foreground shadow-2xl rounded-xl">
          <DialogHeader className="border-b border-border pb-3">
            <DialogTitle className="text-sm font-bold text-blue-500 flex items-center gap-2">
              <UserPlus className="size-4" />
              <span>Invite New User</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleInviteUser} className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Diya Patel"
                value={inviteForm.name}
                onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                className="w-full h-8 px-3 rounded-md bg-background border border-border text-foreground focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Email Address *</label>
              <input
                type="email"
                required
                placeholder="diya.patel@global360.com"
                value={inviteForm.email}
                onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                className="w-full h-8 px-3 rounded-md bg-background border border-border text-foreground focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Initial Password *</label>
              <input
                type="text"
                required
                placeholder="Password123!"
                value={inviteForm.password}
                onChange={(e) => setInviteForm({ ...inviteForm, password: e.target.value })}
                className="w-full h-8 px-3 rounded-md bg-background border border-border text-foreground font-mono focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Role</label>
                <select
                  value={inviteForm.role}
                  onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value as RoleId })}
                  className="w-full h-8 px-2.5 rounded-md bg-background border border-border text-foreground focus:border-blue-500 focus:outline-none cursor-pointer"
                >
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Assign Team</label>
                <select
                  value={inviteForm.team}
                  onChange={(e) => setInviteForm({ ...inviteForm, team: e.target.value })}
                  className="w-full h-8 px-2.5 rounded-md bg-background border border-border text-foreground focus:border-blue-500 focus:outline-none cursor-pointer"
                >
                  {TEAM_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Location Scope</label>
              <input
                type="text"
                value={inviteForm.locationScope}
                onChange={(e) => setInviteForm({ ...inviteForm, locationScope: e.target.value })}
                className="w-full h-8 px-3 rounded-md bg-background border border-border text-foreground focus:border-blue-500 focus:outline-none"
                placeholder="e.g. All locations or Operations scope"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isSubmitting}
                onClick={() => setInviteModalOpen(false)}
                className="h-8 border-border bg-background hover:bg-secondary text-foreground cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="h-8 bg-blue-500 hover:bg-blue-600 text-black font-bold cursor-pointer gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Saving to DB...</span>
                  </>
                ) : (
                  <>
                    <Mail className="size-3.5" />
                    <span>Save User to Database</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal 2: Edit User Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-md bg-card dark:bg-[#121214] border-border text-foreground shadow-2xl rounded-xl">
          <DialogHeader className="border-b border-border pb-3">
            <DialogTitle className="text-sm font-bold text-blue-500 flex items-center gap-2">
              <Edit2 className="size-4" />
              <span>Edit User Access &amp; Permissions</span>
            </DialogTitle>
          </DialogHeader>

          {editingUser && (
            <form onSubmit={handleSaveEditUser} className="space-y-4 py-2 text-xs">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full h-8 px-3 rounded-md bg-background border border-border text-foreground focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={editingUser.email}
                  className="w-full h-8 px-3 rounded-md bg-muted/50 border border-border text-muted-foreground font-mono cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Role</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as RoleId })}
                    className="w-full h-8 px-2.5 rounded-md bg-background border border-border text-foreground focus:border-blue-500 focus:outline-none cursor-pointer"
                  >
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Status</label>
                  <select
                    value={editingUser.status}
                    onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as UserStatus })}
                    className="w-full h-8 px-2.5 rounded-md bg-background border border-border text-foreground focus:border-blue-500 focus:outline-none cursor-pointer"
                  >
                    <option value="active">Active</option>
                    <option value="invited">Invited</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Location Scope</label>
                <input
                  type="text"
                  value={editingUser.locationScope}
                  onChange={(e) => setEditingUser({ ...editingUser, locationScope: e.target.value })}
                  className="w-full h-8 px-3 rounded-md bg-background border border-border text-foreground focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditModalOpen(false)}
                  className="h-8 border-border bg-background hover:bg-secondary text-foreground cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="h-8 bg-blue-500 hover:bg-blue-600 text-black font-bold cursor-pointer gap-1.5"
                >
                  <Save className="size-3.5" />
                  <span>Update User</span>
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
