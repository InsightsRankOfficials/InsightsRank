import type { OrganizationUser, Role, RoleId } from "@/types/user";
import { initials } from "@/lib/format";
import { createRng, intBetween, pick } from "@/lib/random";
import { DEFAULT_ORGANIZATION_ID } from "./organizations";
import { TEAMS } from "./organizations";

const FIRST = [
  "Aarav", "Diya", "Kabir", "Meera", "Rohan", "Ananya", "Vikram", "Isha", "Arjun", "Nisha",
  "Rahul", "Priya", "Karan", "Sneha", "Aditya", "Tara", "Manav", "Ritu", "Dev", "Kavya",
  "Sameer", "Pooja", "Nikhil", "Aisha",
];
const LAST = [
  "Sharma", "Iyer", "Patel", "Nair", "Verma", "Reddy", "Kapoor", "Bose", "Menon", "Chopra",
  "Singh", "Desai", "Rao", "Joshi", "Gupta", "Mehta",
];

const ROLES: RoleId[] = ["owner", "admin", "manager", "analyst", "viewer"];

function buildUsers(): OrganizationUser[] {
  const rng = createRng(910_723);
  const users: OrganizationUser[] = [];

  for (let i = 0; i < 26; i++) {
    const name = `${pick(rng, FIRST)} ${pick(rng, LAST)}`;
    const role: RoleId = i === 0 ? "owner" : i < 4 ? "admin" : pick(rng, ROLES.slice(2));
    const teamCount = intBetween(rng, 1, 2);
    const teams = Array.from({ length: teamCount }, () => pick(rng, TEAMS).name);
    users.push({
      id: `usr_${(1000 + i).toString(36)}`,
      organizationId: DEFAULT_ORGANIZATION_ID,
      name,
      email: `${name.toLowerCase().replace(/\s+/g, ".")}@global360.com`,
      role,
      teams: [...new Set(teams)],
      status: i % 11 === 0 ? "invited" : i % 17 === 0 ? "suspended" : "active",
      lastActiveAt: new Date(Date.now() - intBetween(rng, 2, 20_000) * 60_000).toISOString(),
      locationScope:
        role === "owner" || role === "admin"
          ? "All locations"
          : `${pick(rng, TEAMS).name} scope`,
      avatarInitials: initials(name),
    });
  }
  return users;
}

export const USERS: OrganizationUser[] = buildUsers();

const currentUser = USERS.at(0);
if (!currentUser) throw new Error("At least one user is required");
export const CURRENT_USER: OrganizationUser = currentUser;

export const ROLE_DEFINITIONS: Role[] = [
  {
    id: "owner",
    name: "Owner",
    description: "Full control including billing, organization and integrations.",
    userCount: USERS.filter((u) => u.role === "owner").length,
    system: true,
  },
  {
    id: "admin",
    name: "Admin",
    description: "Manage locations, content, reviews, users and integrations.",
    userCount: USERS.filter((u) => u.role === "admin").length,
    system: true,
  },
  {
    id: "manager",
    name: "Manager",
    description: "Operate assigned locations: profiles, reviews and posts.",
    userCount: USERS.filter((u) => u.role === "manager").length,
    system: true,
  },
  {
    id: "analyst",
    name: "Analyst",
    description: "Read-only data access with full reporting capability.",
    userCount: USERS.filter((u) => u.role === "analyst").length,
    system: true,
  },
  {
    id: "viewer",
    name: "Viewer",
    description: "Read-only access to dashboards and location records.",
    userCount: USERS.filter((u) => u.role === "viewer").length,
    system: true,
  },
];
