# InsightsRank — Database Architecture Documentation

## 1. Data Store Strategy
PostgreSQL 16 is the **sole source of truth** for all core application data, users, multi-tenant organizations, and future domain entities.

Redis 7 is strictly used as an ephemeral data store for rate-limiting, session/token revocation caching, and future asynchronous queue operations (BullMQ). Redis is **never** the primary database for user or tenant records.

---

## 2. Relational Schema (Milestone 1)

### 2.1 Organization Model (`organizations`)
Represents an enterprise tenant account in the multi-tenant hierarchy.

| Field | Type | Attributes | Description |
|---|---|---|---|
| `id` | String / UUID | `@id @default(uuid())` | Primary key |
| `name` | String | | Tenant name (e.g. "InsightsRank Operations") |
| `slug` | String | `@unique` | URL-friendly identifier |
| `status` | String | `@default("ACTIVE")` | Status: `ACTIVE`, `SUSPENDED`, `ARCHIVED` |
| `createdAt` | DateTime | `@default(now())` | Record creation timestamp |
| `updatedAt` | DateTime | `@updatedAt` | Record update timestamp |

**Indexes**:
- `PRIMARY KEY (id)`
- `UNIQUE INDEX (slug)`

---

### 2.2 User Model (`users`)
Represents a user belonging to an organization.

| Field | Type | Attributes | Description |
|---|---|---|---|
| `id` | String / UUID | `@id @default(uuid())` | Primary key |
| `organizationId` | String / UUID | `@map("organization_id")` | Foreign key to `Organization` |
| `email` | String | | User email address |
| `passwordHash` | String | `@map("password_hash")` | Argon2id / bcrypt hashed password |
| `firstName` | String? | `@map("first_name")` | First name |
| `lastName` | String? | `@map("last_name")` | Last name |
| `status` | String | `@default("ACTIVE")` | User status: `ACTIVE`, `INACTIVE`, `INVITED` |
| `role` | Role | `@default(MEMBER)` | User role enum: `OWNER`, `ADMIN`, `MEMBER` |
| `emailVerified` | Boolean | `@default(false) @map("email_verified")` | Email verification flag |
| `lastLoginAt` | DateTime? | `@map("last_login_at")` | Last successful login timestamp |
| `createdAt` | DateTime | `@default(now())` | Record creation timestamp |
| `updatedAt` | DateTime | `@updatedAt` | Record update timestamp |

**Indexes & Constraints**:
- `PRIMARY KEY (id)`
- `UNIQUE INDEX (email)` (Global unique email identification across tenants)
- `INDEX (organization_id)`
- `UNIQUE INDEX (organization_id, email)`
- `FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE`

---

### 2.3 Role Enum (`Role`)
```prisma
enum Role {
  OWNER
  ADMIN
  MEMBER
}
```

---

## 3. Future Domain Schema Hierarchy (Extensibility Roadmap)

```
Organization
    │
    ├── User (Role: OWNER | ADMIN | MEMBER)
    │
    └── GoogleConnection (Future OAuth)
            │
            └── GoogleAccount
                    │
                    └── Location
                            │
                            ├── Review / ReviewReply
                            ├── Post
                            └── Metric / Analytics
```

The data model is engineered so future modules can link directly to `organizationId` and `locationId` without requiring schema refactoring.
