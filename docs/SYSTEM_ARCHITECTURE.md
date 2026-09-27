# InsightsRank — System Architecture Documentation

## 1. System Overview
InsightsRank is an enterprise-grade multi-tenant Google Business Profile (GBP) management platform designed for multi-location brands, franchises, and agencies. 

The architecture follows a **Modular Monolith + Separate Workers** model. The application consists of a single codebase structured into distinct, decoupled domain modules that communicate via clear internal interfaces. This allows rapid development, straightforward deployment, and seamless extraction of individual services into microservices or background workers as scale requires.

```
+-----------------------------------------------------------------------+
|                           CLIENT TIER                                 |
|  React 19 + TypeScript + TanStack Router / Start + Tailwind CSS v4   |
+-----------------------------------------------------------------------+
                                   |
                         HTTPS / REST / JSON
                                   v
+-----------------------------------------------------------------------+
|                           BACKEND TIER                                |
|  Node.js + NestJS (Modular Monolith)                                  |
|  - Rate Limiting (Throttler)                                          |
|  - Security Headers (Helmet)                                          |
|  - Authentication & Authorization (JWT + Guards)                      |
|  - Validation & Serialization (class-validator / class-transformer)   |
+-----------------------------------------------------------------------+
                        /                     \
                       v                       v
+-------------------------------+   +-----------------------------------+
|      PERSISTENCE TIER         |   |          CACHE / QUEUE            |
|  PostgreSQL 16 (Source of Truth)|   |  Redis 7 (Throttling / Sessions)  |
|  Prisma ORM                   |   |  BullMQ (Future Job Engine)       |
+-------------------------------+   +-----------------------------------+
```

---

## 2. Component Breakdown

### 2.1 Frontend Tier (`frontend/`)
- **Framework**: React 19.2 + TypeScript 5.8
- **Meta Framework / Router**: TanStack Start + `@tanstack/react-router`
- **UI Components**: shadcn/ui primitives built on Radix UI
- **State & Data Fetching**: `@tanstack/react-query` v5
- **Forms & Validation**: `react-hook-form` + `zod`
- **Responsibility**: User interface rendering, client-side route guards, theme management, and consuming REST APIs.

### 2.2 Backend Tier (`backend/`)
- **Framework**: NestJS + Node.js (TypeScript)
- **API Style**: RESTful `/api/v1/`
- **ORM**: Prisma ORM
- **Security**: Passport.js, JWT, bcrypt/argon2, Helmet, NestJS Throttler
- **Documentation**: Swagger / OpenAPI exposed at `/docs`
- **Responsibility**: Multi-tenant data validation, authentication, authorization, business logic, health checks, and API delivery.

### 2.3 Data & Infrastructure Tier
- **PostgreSQL 16**: Primary relational database. Serves as the single authoritative source of truth for Organizations, Users, Roles, and future GBP data.
- **Redis 7**: High-performance key-value store used for rate-limiting, session cache, and future BullMQ async task processing.

---

## 3. Modular Monolith Architecture
The backend is structured into self-contained domain modules:
- `AuthModule`: Handles registration, authentication, token issuance, session destruction.
- `UsersModule`: Manages user data, credentials, roles, and profile retrieval.
- `DatabaseModule`: Provides database connectivity via `PrismaService`.
- `HealthModule`: Provides light, fast system readiness checks for orchestration tools like Render.

Future modules (e.g. `GoogleConnectionsModule`, `LocationsModule`, `ReviewsModule`, `AnalyticsModule`) will plug directly into this modular structure without altering the core authentication or database foundation.

---

## 4. Multi-Tenant Isolation Strategy
- Multi-tenancy is enforced at the data model level via `organizationId`.
- Every authenticated request injects `req.user` containing `{ id, email, organizationId, role }` derived strictly from verified server-side JWT credentials.
- Client-provided `organizationId` is **never trusted**.
- Database queries are scoped using `WHERE organizationId = authenticatedUser.organizationId`.
