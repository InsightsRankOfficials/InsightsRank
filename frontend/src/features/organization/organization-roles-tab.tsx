import React, { useState } from "react";
import {
  ShieldCheck,
  Plus,
  Edit2,
  Copy,
  Trash2,
  Check,
  X,
  Lock,
  Users,
  Building,
  Save,
  Sliders,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface RoleItem {
  id: string;
  name: string;
  description: string;
  userCount: number;
  isSystem: boolean;
  permissions: {
    locations: { view: boolean; edit: boolean; sync: boolean; import: boolean };
    reviews: { view: boolean; reply: boolean; templates: boolean; delete: boolean };
    rankings: { view: boolean; config: boolean; export: boolean };
    org: { users: boolean; roles: boolean; audit: boolean; billing: boolean };
  };
}

const INITIAL_ROLES: RoleItem[] = [
  {
    id: "owner",
    name: "Owner",
    description: "Full control including billing, organization tenancy and integrations.",
    userCount: 1,
    isSystem: true,
    permissions: {
      locations: { view: true, edit: true, sync: true, import: true },
      reviews: { view: true, reply: true, templates: true, delete: true },
      rankings: { view: true, config: true, export: true },
      org: { users: true, roles: true, audit: true, billing: true },
    },
  },
  {
    id: "admin",
    name: "Administrator",
    description: "Manage locations, reviews, rankings, organization users and integrations.",
    userCount: 3,
    isSystem: true,
    permissions: {
      locations: { view: true, edit: true, sync: true, import: true },
      reviews: { view: true, reply: true, templates: true, delete: true },
      rankings: { view: true, config: true, export: true },
      org: { users: true, roles: true, audit: true, billing: false },
    },
  },
  {
    id: "manager",
    name: "Location Manager",
    description: "Operate assigned store locations: profiles, review assistant, and local rank reports.",
    userCount: 14,
    isSystem: true,
    permissions: {
      locations: { view: true, edit: true, sync: true, import: false },
      reviews: { view: true, reply: true, templates: true, delete: false },
      rankings: { view: true, config: false, export: true },
      org: { users: false, roles: false, audit: false, billing: false },
    },
  },
  {
    id: "reputation_mgr",
    name: "Reputation Manager",
    description: "Dedicated access for customer review responding, templates and prompt rules.",
    userCount: 4,
    isSystem: false,
    permissions: {
      locations: { view: true, edit: false, sync: false, import: false },
      reviews: { view: true, reply: true, templates: true, delete: false },
      rankings: { view: true, config: false, export: false },
      org: { users: false, roles: false, audit: false, billing: false },
    },
  },
  {
    id: "analyst",
    name: "Data Analyst",
    description: "Read-only data access with full export and reporting capabilities.",
    userCount: 3,
    isSystem: true,
    permissions: {
      locations: { view: true, edit: false, sync: false, import: false },
      reviews: { view: true, reply: false, templates: false, delete: false },
      rankings: { view: true, config: false, export: true },
      org: { users: false, roles: false, audit: true, billing: false },
    },
  },
  {
    id: "viewer",
    name: "Viewer",
    description: "Read-only access to dashboards, store listings and performance data.",
    userCount: 1,
    isSystem: true,
    permissions: {
      locations: { view: true, edit: false, sync: false, import: false },
      reviews: { view: true, reply: false, templates: false, delete: false },
      rankings: { view: true, config: false, export: false },
      org: { users: false, roles: false, audit: false, billing: false },
    },
  },
];

export function OrganizationRolesTab() {
  const [roles, setRoles] = useState<RoleItem[]>(INITIAL_ROLES);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleItem | null>(null);

  const handleOpenCreateRole = () => {
    const newRole: RoleItem = {
      id: `role_${Date.now().toString(36)}`,
      name: "",
      description: "",
      userCount: 0,
      isSystem: false,
      permissions: {
        locations: { view: true, edit: false, sync: false, import: false },
        reviews: { view: true, reply: false, templates: false, delete: false },
        rankings: { view: true, config: false, export: false },
        org: { users: false, roles: false, audit: false, billing: false },
      },
    };
    setEditingRole(newRole);
    setRoleModalOpen(true);
  };

  const handleOpenEditRole = (role: RoleItem) => {
    setEditingRole(JSON.parse(JSON.stringify(role)));
    setRoleModalOpen(true);
  };

  const handleDuplicateRole = (role: RoleItem) => {
    const dup: RoleItem = {
      ...JSON.parse(JSON.stringify(role)),
      id: `role_${Date.now().toString(36)}`,
      name: `${role.name} (Copy)`,
      isSystem: false,
      userCount: 0,
    };
    setRoles((prev) => [...prev, dup]);
    toast.success(`Duplicated role "${role.name}"`);
  };

  const handleDeleteRole = (role: RoleItem) => {
    if (role.isSystem) {
      toast.error("System default roles cannot be deleted.");
      return;
    }
    setRoles((prev) => prev.filter((r) => r.id !== role.id));
    toast.success(`Role "${role.name}" deleted.`);
  };

  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRole || !editingRole.name) {
      toast.error("Please enter a role name.");
      return;
    }

    const exists = roles.some((r) => r.id === editingRole.id);
    if (exists) {
      setRoles((prev) => prev.map((r) => (r.id === editingRole.id ? editingRole : r)));
      toast.success(`Role "${editingRole.name}" updated successfully!`);
    } else {
      setRoles((prev) => [...prev, editingRole]);
      toast.success(`Custom role "${editingRole.name}" created successfully!`);
    }
    setRoleModalOpen(false);
  };

  return (
    <div className="space-y-6 text-foreground">
      {/* Header matching Rankings Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <span>Roles &amp; Permissions</span>
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Control granular capabilities with reusable, tenant-wide role policies.
          </p>
        </div>

        <div>
          <Button
            onClick={handleOpenCreateRole}
            className="h-8 bg-blue-500 hover:bg-blue-600 text-black font-bold text-xs px-4 cursor-pointer gap-1.5 rounded-md shadow-sm transition-colors"
          >
            <Plus className="size-4" />
            <span>Create Custom Role</span>
          </Button>
        </div>
      </div>

      {/* Role Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {roles.map((role) => (
          <div
            key={role.id}
            className="panel p-5 flex flex-col justify-between space-y-4 hover:border-blue-500/40 transition-colors shadow-sm"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="grid size-8 place-items-center rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-500 font-bold shrink-0">
                    <ShieldCheck className="size-4" />
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                      <span>{role.name}</span>
                    </h3>
                    <p className="text-[10px] text-muted-foreground font-mono">
                      {role.userCount} {role.userCount === 1 ? "User" : "Users"} assigned
                    </p>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${
                    role.isSystem
                      ? "bg-sky-500/15 text-sky-400 border-sky-500/30"
                      : "bg-blue-500/15 text-blue-400 border-blue-500/30"
                  }`}
                >
                  {role.isSystem ? "System Role" : "Custom Role"}
                </span>
              </div>

              <p className="text-xs text-muted-foreground line-clamp-2">{role.description}</p>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenEditRole(role)}
                  className="h-7 px-2.5 text-xs border-border bg-background hover:bg-secondary text-foreground cursor-pointer gap-1"
                >
                  <Edit2 className="size-3 text-blue-500" />
                  <span>Permissions</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDuplicateRole(role)}
                  className="h-7 px-2 text-xs border-border bg-background hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
                  title="Duplicate Role"
                >
                  <Copy className="size-3" />
                </Button>
              </div>

              {!role.isSystem && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteRole(role)}
                  className="h-7 px-2 text-xs border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 cursor-pointer"
                  title="Delete Custom Role"
                >
                  <Trash2 className="size-3" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Permissions Matrix Overview Table */}
      <div className="panel p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Sliders className="size-4 text-blue-500" />
          <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
            Module Permission Capabilities Matrix
          </h3>
        </div>

        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/40 text-muted-foreground font-semibold">
                <th className="py-3 px-4 min-w-[180px]">Feature Module</th>
                {roles.map((r) => (
                  <th key={r.id} className="py-3 px-3 text-center min-w-[100px]">
                    {r.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-foreground">
              {/* Module 1: Locations */}
              <tr>
                <td className="py-2.5 px-4 font-bold text-blue-400" colSpan={roles.length + 1}>
                  Locations &amp; Profiles
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 text-muted-foreground pl-6">View Location Listings</td>
                {roles.map((r) => (
                  <td key={r.id} className="py-2 px-3 text-center">
                    {r.permissions.locations.view ? <Check className="size-4 text-emerald-400 mx-auto" /> : <X className="size-4 text-muted-foreground/40 mx-auto" />}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-2 px-4 text-muted-foreground pl-6">Edit Profile Details</td>
                {roles.map((r) => (
                  <td key={r.id} className="py-2 px-3 text-center">
                    {r.permissions.locations.edit ? <Check className="size-4 text-emerald-400 mx-auto" /> : <X className="size-4 text-muted-foreground/40 mx-auto" />}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-2 px-4 text-muted-foreground pl-6">Sync Live to Platforms</td>
                {roles.map((r) => (
                  <td key={r.id} className="py-2 px-3 text-center">
                    {r.permissions.locations.sync ? <Check className="size-4 text-emerald-400 mx-auto" /> : <X className="size-4 text-muted-foreground/40 mx-auto" />}
                  </td>
                ))}
              </tr>

              {/* Module 2: Reviews */}
              <tr className="border-t border-border">
                <td className="py-2.5 px-4 font-bold text-blue-400" colSpan={roles.length + 1}>
                  Review Assistant &amp; AI
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 text-muted-foreground pl-6">Reply to Customer Reviews</td>
                {roles.map((r) => (
                  <td key={r.id} className="py-2 px-3 text-center">
                    {r.permissions.reviews.reply ? <Check className="size-4 text-emerald-400 mx-auto" /> : <X className="size-4 text-muted-foreground/40 mx-auto" />}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-2 px-4 text-muted-foreground pl-6">Manage Templates &amp; Rules</td>
                {roles.map((r) => (
                  <td key={r.id} className="py-2 px-3 text-center">
                    {r.permissions.reviews.templates ? <Check className="size-4 text-emerald-400 mx-auto" /> : <X className="size-4 text-muted-foreground/40 mx-auto" />}
                  </td>
                ))}
              </tr>

              {/* Module 3: Organization */}
              <tr className="border-t border-border">
                <td className="py-2.5 px-4 font-bold text-blue-400" colSpan={roles.length + 1}>
                  Organization Governance
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 text-muted-foreground pl-6">Invite &amp; Manage Users</td>
                {roles.map((r) => (
                  <td key={r.id} className="py-2 px-3 text-center">
                    {r.permissions.org.users ? <Check className="size-4 text-emerald-400 mx-auto" /> : <X className="size-4 text-muted-foreground/40 mx-auto" />}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-2 px-4 text-muted-foreground pl-6">View Audit Trail Logs</td>
                {roles.map((r) => (
                  <td key={r.id} className="py-2 px-3 text-center">
                    {r.permissions.org.audit ? <Check className="size-4 text-emerald-400 mx-auto" /> : <X className="size-4 text-muted-foreground/40 mx-auto" />}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create or Edit Role Modal */}
      <Dialog open={roleModalOpen} onOpenChange={setRoleModalOpen}>
        <DialogContent className="sm:max-w-md bg-card dark:bg-[#121214] border-border text-foreground shadow-2xl rounded-xl">
          <DialogHeader className="border-b border-border pb-3">
            <DialogTitle className="text-sm font-bold text-blue-500 flex items-center gap-2">
              <ShieldCheck className="size-4" />
              <span>{editingRole?.id && roles.some(r => r.id === editingRole.id) ? "Edit Role Permissions" : "Create Custom Role"}</span>
            </DialogTitle>
          </DialogHeader>

          {editingRole && (
            <form onSubmit={handleSaveRole} className="space-y-4 py-2 text-xs">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Role Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Reputation Specialist"
                  value={editingRole.name}
                  onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
                  className="w-full h-8 px-3 rounded-md bg-background border border-border text-foreground focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe scope and access capabilities..."
                  value={editingRole.description}
                  onChange={(e) => setEditingRole({ ...editingRole, description: e.target.value })}
                  className="w-full p-2 rounded-md bg-background border border-border text-foreground focus:border-blue-500 focus:outline-none resize-none"
                />
              </div>

              <div className="space-y-2 border-t border-border pt-3">
                <p className="text-[11px] font-bold text-blue-500 uppercase tracking-wider">
                  Module Capability Toggles
                </p>

                <div className="space-y-2">
                  <label className="flex items-center justify-between p-2 rounded bg-background border border-border cursor-pointer">
                    <span>Edit Location Profiles &amp; Hours</span>
                    <input
                      type="checkbox"
                      checked={editingRole.permissions.locations.edit}
                      onChange={(e) =>
                        setEditingRole({
                          ...editingRole,
                          permissions: {
                            ...editingRole.permissions,
                            locations: { ...editingRole.permissions.locations, edit: e.target.checked },
                          },
                        })
                      }
                      className="accent-blue-500 size-4 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded bg-background border border-border cursor-pointer">
                    <span>Sync Live Data to Google</span>
                    <input
                      type="checkbox"
                      checked={editingRole.permissions.locations.sync}
                      onChange={(e) =>
                        setEditingRole({
                          ...editingRole,
                          permissions: {
                            ...editingRole.permissions,
                            locations: { ...editingRole.permissions.locations, sync: e.target.checked },
                          },
                        })
                      }
                      className="accent-blue-500 size-4 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded bg-background border border-border cursor-pointer">
                    <span>Reply to Reviews &amp; AI Assistant</span>
                    <input
                      type="checkbox"
                      checked={editingRole.permissions.reviews.reply}
                      onChange={(e) =>
                        setEditingRole({
                          ...editingRole,
                          permissions: {
                            ...editingRole.permissions,
                            reviews: { ...editingRole.permissions.reviews, reply: e.target.checked },
                          },
                        })
                      }
                      className="accent-blue-500 size-4 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded bg-background border border-border cursor-pointer">
                    <span>Invite &amp; Manage Organization Users</span>
                    <input
                      type="checkbox"
                      checked={editingRole.permissions.org.users}
                      onChange={(e) =>
                        setEditingRole({
                          ...editingRole,
                          permissions: {
                            ...editingRole.permissions,
                            org: { ...editingRole.permissions.org, users: e.target.checked },
                          },
                        })
                      }
                      className="accent-blue-500 size-4 cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setRoleModalOpen(false)}
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
                  <span>Save Policy</span>
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
