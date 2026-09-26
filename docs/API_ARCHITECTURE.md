# Global360 — API Architecture Documentation

## 1. API Principles
All backend endpoints are prefixed with `/api/v1/`.

### 1.1 Response Format
All API responses use a standardized JSON wrapper:

#### Success Response (200, 201)
```json
{
  "success": true,
  "data": { ... },
  "requestId": "req_123456789"
}
```

#### Error Response (400, 401, 403, 404, 429, 500)
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password"
  },
  "requestId": "req_123456789"
}
```

---

## 2. API Endpoints Specification

### 2.1 Health Check
- **Path**: `GET /api/v1/health`
- **Authentication**: None (Public)
- **Rate Limit**: Standard (100 req/min)
- **Response**:
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "info": {
      "database": { "status": "up" },
      "redis": { "status": "up" }
    }
  },
  "requestId": "req_health_01"
}
```

---

### 2.2 User Registration
- **Path**: `POST /api/v1/auth/register`
- **Authentication**: None (Public)
- **Rate Limit**: Stricter (10 req/min)
- **Request Body**:
```json
{
  "email": "owner@acme.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "organizationName": "Acme Retail Group"
}
```
- **Response** (210 Created):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_uuid",
      "email": "owner@acme.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "OWNER",
      "organizationId": "org_uuid"
    },
    "organization": {
      "id": "org_uuid",
      "name": "Acme Retail Group",
      "slug": "acme-retail-group"
    }
  },
  "requestId": "req_reg_01"
}
```

---

### 2.3 User Login
- **Path**: `POST /api/v1/auth/login`
- **Authentication**: None (Public)
- **Rate Limit**: Stricter (10 req/min)
- **Request Body**:
```json
{
  "email": "owner@acme.com",
  "password": "SecurePassword123!"
}
```
- **Response** (200 OK):
  - Sets HttpOnly Cookie: `global360_access_token`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_uuid",
      "email": "owner@acme.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "OWNER",
      "organizationId": "org_uuid"
    },
    "accessToken": "eyJhbGciOi..."
  },
  "requestId": "req_login_01"
}
```

---

### 2.4 Get Current User (`/me`)
- **Path**: `GET /api/v1/auth/me`
- **Authentication**: Required (`JwtAuthGuard`)
- **Rate Limit**: Standard (100 req/min)
- **Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "usr_uuid",
    "email": "owner@acme.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "OWNER",
    "organizationId": "org_uuid",
    "organization": {
      "id": "org_uuid",
      "name": "Acme Retail Group",
      "slug": "acme-retail-group"
    }
  },
  "requestId": "req_me_01"
}
```

---

### 2.5 User Logout
- **Path**: `POST /api/v1/auth/logout`
- **Authentication**: Required (`JwtAuthGuard`)
- **Response** (200 OK):
  - Clears `global360_access_token` cookie.
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  },
  "requestId": "req_logout_01"
}
```
