# Global360 — Authentication Architecture Documentation

## 1. Authentication Flow Diagram

```
Frontend (React + TanStack Router)
    ↓
Authentication API (/api/v1/auth/login, /api/v1/auth/me)
    ↓
NestJS Auth Module (JwtAuthGuard, Local / JwtStrategy, Throttler)
    ↓
Users Module (UsersService, Password Verification via Argon2/Bcrypt)
    ↓
Prisma ORM (PrismaService)
    ↓
PostgreSQL 16 (Authoritative User & Tenant Database)
```

> **CRITICAL ARCHITECTURAL GUARANTEE**:
> Redis is **NOT** the source of truth for users or authentication records. PostgreSQL 16 is the authoritative source of truth for all users, credentials, roles, and tenants. Redis is used solely for rate limiting, session revocation caching, and transient queue state.

---

## 2. Token & Session Strategy

### Access Token
- **Format**: JSON Web Token (JWT)
- **Lifetime**: Short-lived (e.g. 15 minutes to 1 hour in dev, 15 minutes in production)
- **Claims**:
  - `sub`: User ID (UUID)
  - `email`: User email address
  - `orgId`: Organization / Tenant ID (UUID)
  - `role`: Role (`OWNER` | `ADMIN` | `MEMBER`)
  - `iat`, `exp`: Issued at / Expiration timestamps
- **Security Constraints**: No sensitive data (e.g. password hashes, internal secrets) inside JWT payload.

### Cookie Delivery
- For browser client compatibility and protection against XSS token extraction, credentials are set in HttpOnly cookies (`global360_access_token`).
- **Cookie Properties**:
  - `HttpOnly`: `true` (Inaccessible to client-side JavaScript)
  - `Secure`: `true` in production (`process.env.NODE_ENV === 'production'`)
  - `SameSite`: `lax` (or `strict` based on cross-domain requirements)
  - `Path`: `/`
- Bearer token header fallback (`Authorization: Bearer <token>`) is also supported for programmatic API clients.

---

## 3. Password Hashing Security

- **Algorithm**: Argon2id (or bcrypt with cost factor 12 if native binaries encounter compatibility issues).
- **Validation**: Passwords must contain a minimum of 8 characters, including upper & lower case, numbers, and special characters.
- **Privacy Rules**:
  - Plaintext passwords are **never logged**.
  - `passwordHash` is excluded from Prisma selectors and API DTO responses.
  - Verification failures return generic `"Invalid email or password"` error messages to prevent account enumeration attacks.

---

## 4. Client-Side Authentication State Restoration (`GET /api/v1/auth/me`)

On page load or refresh:
1. React client mounts `AuthContext` / `WorkspaceProvider`.
2. Client invokes `GET /api/v1/auth/me`.
3. Backend `JwtAuthGuard` verifies HttpOnly cookie or Bearer token.
4. On success, backend returns safe user details (`id`, `email`, `firstName`, `lastName`, `role`, `organizationId`, `organization`).
5. Client sets `user` state and opens protected routes.
6. If 401 Unauthorized or expired token, client clears auth state and redirects to `/login`.

---

## 5. Application Login vs. Google Business Profile OAuth

```
[Application Login]
User Credentials -> Global360 Auth API -> NestJS -> PostgreSQL Users Table
(Performs login to the Global360 SaaS Platform)

[Google Business Profile OAuth] (Future Milestone)
User Action -> Google OAuth 2.0 -> NestJS -> Google Connection Table -> GBP APIs
(Grants permission to pull store location data & reviews from Google)
```

Application login and Google OAuth are strictly separate. Google OAuth tokens will never be used as Global360 user login credentials.
