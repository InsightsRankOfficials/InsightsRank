# InsightsRank — Backend Implementation Plan

## Milestone 1: Authentication Foundation

### Objectives
Establish a production-ready authentication, multi-tenant database schema, NestJS backend foundation, and React frontend integration.

---

## Phased Execution Plan

### Phase 1: Environment & Project Setup
1. Initialize NestJS application in `backend/` with TypeScript configuration.
2. Install dependencies:
   - `@nestjs/core`, `@nestjs/common`, `@nestjs/config`, `@nestjs/jwt`, `@nestjs/passport`, `@nestjs/throttler`, `@nestjs/terminus`, `@nestjs/swagger`
   - `@prisma/client`, `prisma`
   - `passport`, `passport-jwt`, `bcrypt`
   - `class-validator`, `class-transformer`, `helmet`, `cookie-parser`
3. Configure environment management via `.env` and `configuration.ts` with strict schema validation (`env.validation.ts`).

### Phase 2: Database Schema & Migration
1. Write Prisma schema (`prisma/schema.prisma`) defining `Organization`, `User`, and `Role` (`OWNER`, `ADMIN`, `MEMBER`).
2. Add necessary composite indexes (`[organizationId, email]`, `[slug]`).
3. Execute initial Prisma migration (`npx prisma migrate dev --name init_auth`).
4. Implement development database seed script (`prisma/seed.ts`).

### Phase 3: Core NestJS Modules Implementation
1. **DatabaseModule**: Provide global `PrismaService` for database interaction.
2. **UsersModule**: Implement `UsersService` for user retrieval, password hashing, and user creation.
3. **AuthModule**: 
   - DTOs: `RegisterDto`, `LoginDto`, `AuthResponseDto`.
   - Strategies: `JwtStrategy` (reading JWT from HttpOnly cookie or Authorization header).
   - Guards: `JwtAuthGuard`, `RolesGuard`.
   - Decorators: `@CurrentUser()`, `@Roles()`, `@Public()`.
   - Service: `login()`, `register()`, `logout()`, `validateUser()`.
   - Controller: `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `POST /api/v1/auth/logout`, `GET /api/v1/auth/me`.
4. **HealthModule**:
   - `GET /api/v1/health` checking application, PostgreSQL, and Redis connectivity.

### Phase 4: Security & Middleware Configuration
1. Enable `Helmet` for HTTP security headers.
2. Enable CORS with configurable origin (`FRONTEND_URL`).
3. Configure global `ValidationPipe` (`whitelist: true`, `transform: true`).
4. Apply NestJS `ThrottlerModule` for rate limiting (stricter limit on auth routes).
5. Setup Swagger OpenAPI documentation at `/docs`.

### Phase 5: Frontend Integration & Route Protection
1. Create centralized Auth API Client (`src/services/auth.ts`).
2. Implement `AuthContext` and `useAuth` hook in `src/context/AuthContext.tsx`.
3. Create `/login` route in `src/routes/login.tsx` using existing shadcn UI components.
4. Update `src/routes/__root.tsx` to handle authenticated vs unauthenticated layout boundaries and route protection.

### Phase 6: Docker & Render Cloud Preparation
1. Create multi-stage production `Dockerfile` in `backend/`.
2. Ensure NestJS application binds to `0.0.0.0` and `process.env.PORT`.
3. Document deployment instructions for Render Free Web Service & PostgreSQL.
