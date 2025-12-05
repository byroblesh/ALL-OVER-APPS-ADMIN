# ALL OVER APPS - ADMIN API Documentation

**Version:** 1.0.0
**Base URL:** `http://localhost:3001/api`
**Contact:** support@bannersallover.com

## Overview

API de administración centralizada para todas las aplicaciones de ALL OVER APPS. Gestiona múltiples apps Shopify desde un panel administrativo unificado.

## Authentication

This API uses JWT Bearer token authentication.

### How to authenticate:

1. Login with your credentials at `/api/auth/login`
2. Use the returned JWT token in the `Authorization` header for subsequent requests
3. Format: `Authorization: Bearer <your-token>`

### Example:
```bash
# 1. Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tuempresa.com","password":"admin123"}'

# Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "email": "admin@tuempresa.com",
    "name": "Admin",
    "role": "admin"
  }
}

# 2. Use token in subsequent requests
curl -X GET http://localhost:3001/api/apps \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Table of Contents

1. [Health](#health)
2. [Authentication](#authentication-endpoints)
3. [Applications](#applications)
4. [Users](#users)
5. [Email Templates](#email-templates)
6. [Metrics (Per App)](#metrics-per-app)
7. [Aggregate Metrics (All Apps)](#aggregate-metrics-all-apps)

---

## Health

### GET /api/health

Check server status and database connections.

**Authentication:** Not required

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "databases": {
    "connected": 1,
    "total": 1,
    "failed": 0
  }
}
```

---

## Authentication Endpoints

### POST /api/auth/login

Authenticate internal team users.

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "admin@bannersallover.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "email": "admin@bannersallover.com",
    "name": "Admin",
    "role": "admin"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

---

### POST /api/auth/refresh

Generate a new JWT token from an existing one.

**Authentication:** Required (Bearer token)

**Success Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

---

### GET /api/auth/me

Get authenticated user information.

**Authentication:** Required (Bearer token)

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "1",
    "email": "admin@bannersallover.com",
    "name": "Admin",
    "role": "admin"
  }
}
```

---

### POST /api/auth/hash-password

**[DEVELOPMENT ONLY]** Generate bcrypt hash for a password.

**Authentication:** Not required

**Request Body:**
```json
{
  "password": "mypassword123"
}
```

**Success Response (200):**
```json
{
  "hash": "$2a$10$A88rlrMDcrqYi5lEf1rP6emK.uwTQjpCCCsmWdmW1/ZPJdgjh.EoW"
}
```

---

## Applications

### GET /api/apps

Get the list of all Shopify applications configured in the Back Office.

**Authentication:** Required (Bearer token)

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "banners-all-over",
      "name": "Banners All Over",
      "features": {
        "canEditTemplates": true,
        "canManageShops": true,
        "canViewMetrics": true
      }
    }
  ]
}
```

---

## Users

All user endpoints require the `{appId}` parameter in the URL (e.g., `banners-all-over`).

### GET /api/{appId}/users/stats

Get aggregated user statistics for an app.

**Authentication:** Required (Bearer token)

**Query Parameters:**
- `shop` (optional): Filter by specific shop

**Example Request:**
```bash
GET /api/banners-all-over/users/stats
GET /api/banners-all-over/users/stats?shop=mystore.myshopify.com
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "total": 1500,
    "active": 1200,
    "inactive": 300,
    "byStatus": {
      "premium": 500,
      "basic": 700,
      "trial": 300
    },
    "growthRate": 5.2
  }
}
```

---

### GET /api/{appId}/users

Get paginated list of users.

**Authentication:** Required (Bearer token)

**Query Parameters:**
- `page` (default: 1): Page number
- `limit` (default: 20, max: 100): Items per page
- `shop` (optional): Filter by shop
- `status` (optional): Filter by status
- `search` (optional): Search by name or email

**Example Request:**
```bash
GET /api/banners-all-over/users?page=1&limit=20&status=active
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "email": "user@example.com",
      "shop": "mystore.myshopify.com",
      "status": "active",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "lastLoginAt": "2024-01-20T15:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1500,
    "pages": 75
  }
}
```

---

### GET /api/{appId}/users/:id

Get details of a specific user.

**Authentication:** Required (Bearer token)

**Example Request:**
```bash
GET /api/banners-all-over/users/507f1f77bcf86cd799439011
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "shop": "mystore.myshopify.com",
    "status": "active",
    "settings": { ... },
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-20T15:30:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "User not found"
}
```

---

### PUT /api/{appId}/users/:id

Update a user.

**Authentication:** Required (Bearer token)

**Request Body:**
```json
{
  "status": "inactive",
  "settings": {
    "notifications": true
  }
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": { ... }
}
```

---

### DELETE /api/{appId}/users/:id

Delete a user.

**Authentication:** Required (Bearer token)

**Success Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## Email Templates

### GET /api/{appId}/templates

Get paginated list of email templates.

**Authentication:** Required (Bearer token)

**Query Parameters:**
- `page` (default: 1): Page number
- `limit` (default: 20, max: 100): Items per page
- `language` (optional): Filter by language (en, es, fr, de, it, pt)
- `isActive` (optional): Filter by active status

**Example Request:**
```bash
GET /api/banners-all-over/templates?language=en&isActive=true
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "welcome-email",
      "language": "en",
      "subject": "Welcome to our App!",
      "htmlTemplate": "<html>...</html>",
      "textTemplate": "Welcome...",
      "variables": ["userName", "shopName"],
      "isActive": true,
      "version": 1,
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "pages": 3
  }
}
```

---

### GET /api/{appId}/templates/:id

Get details of a specific template.

**Authentication:** Required (Bearer token)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "welcome-email",
    "language": "en",
    "subject": "Welcome!",
    "htmlTemplate": "<html>...</html>",
    "textTemplate": "Welcome...",
    "variables": ["userName"],
    "isActive": true,
    "version": 1
  }
}
```

---

### POST /api/{appId}/templates

Create a new email template.

**Authentication:** Required (Bearer token)

**Request Body:**
```json
{
  "name": "password-reset",
  "language": "en",
  "subject": "Reset your password",
  "htmlTemplate": "<html><body>Reset link: {{resetLink}}</body></html>",
  "textTemplate": "Reset your password: {{resetLink}}",
  "variables": ["resetLink"],
  "isActive": true,
  "shopId": "mystore.myshopify.com"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Template created successfully",
  "data": { ... }
}
```

---

### PUT /api/{appId}/templates/:id

Update an email template.

**Authentication:** Required (Bearer token)

**Request Body:**
```json
{
  "subject": "Updated subject",
  "htmlTemplate": "<html>...</html>",
  "isActive": false
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Template updated successfully",
  "data": { ... }
}
```

---

### DELETE /api/{appId}/templates/:id

Delete an email template.

**Authentication:** Required (Bearer token)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Template deleted successfully"
}
```

---

### PUT /api/{appId}/templates/:id/toggle

Toggle template active status.

**Authentication:** Required (Bearer token)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Template status updated",
  "data": {
    "isActive": false
  }
}
```

---

## Metrics (Per App)

### GET /api/{appId}/metrics/dashboard

Get general dashboard metrics for a specific app.

**Authentication:** Required (Bearer token)

**Example Request:**
```bash
GET /api/banners-all-over/metrics/dashboard
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "users": {
      "total": 500,
      "active": 400,
      "newToday": 5,
      "newThisWeek": 42,
      "newThisMonth": 180,
      "byStatus": {
        "premium": 150,
        "basic": 250,
        "trial": 100
      }
    },
    "shops": {
      "total": 100,
      "active": 85,
      "inactive": 15
    },
    "activity": {
      "last24h": 450,
      "last7d": 2800,
      "last30d": 12000
    }
  }
}
```

---

### GET /api/{appId}/metrics/users-over-time

Get statistics of registered users per day.

**Authentication:** Required (Bearer token)

**Query Parameters:**
- `days` (default: 30): Number of days to query

**Example Request:**
```bash
GET /api/banners-all-over/metrics/users-over-time?days=7
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "date": "2024-01-15",
      "newUsers": 12,
      "totalUsers": 488
    },
    {
      "date": "2024-01-16",
      "newUsers": 8,
      "totalUsers": 496
    }
  ]
}
```

---

### GET /api/{appId}/metrics/top-shops

Get shops with the most users.

**Authentication:** Required (Bearer token)

**Query Parameters:**
- `limit` (default: 10): Number of shops to return

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "shop": "bigstore.myshopify.com",
      "totalUsers": 50,
      "activeUsers": 45,
      "inactiveUsers": 5
    },
    {
      "shop": "mediumstore.myshopify.com",
      "totalUsers": 30,
      "activeUsers": 28,
      "inactiveUsers": 2
    }
  ]
}
```

---

### GET /api/{appId}/metrics/activity

Get recent activity in the app.

**Authentication:** Required (Bearer token)

**Query Parameters:**
- `limit` (default: 20): Number of activities to return

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "type": "new_user",
      "user": {
        "email": "newuser@example.com",
        "shop": "store.myshopify.com"
      },
      "timestamp": "2024-01-20T15:30:00.000Z"
    },
    {
      "type": "user_login",
      "user": {
        "email": "user@example.com"
      },
      "timestamp": "2024-01-20T15:25:00.000Z"
    }
  ]
}
```

---

### GET /api/{appId}/metrics/summary

Get a quick summary of key metrics.

**Authentication:** Required (Bearer token)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "totalUsers": 500,
    "activeUsers": 400,
    "totalShops": 100,
    "activeShops": 85,
    "templatesCount": 15,
    "activeTemplatesCount": 12
  }
}
```

---

## Aggregate Metrics (All Apps)

These endpoints aggregate data from all configured applications.

### GET /api/metrics/aggregate/dashboard

Get combined metrics from all configured applications.

**Authentication:** Required (Bearer token)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "aggregate": {
      "users": {
        "total": 1500,
        "active": 1200,
        "newToday": 15,
        "newThisWeek": 120,
        "newThisMonth": 500
      },
      "shops": {
        "total": 300,
        "active": 250
      }
    },
    "byApp": [
      {
        "appId": "banners-all-over",
        "appName": "Banners All Over",
        "users": {
          "total": 500,
          "active": 400
        },
        "shops": {
          "total": 100,
          "active": 85
        }
      }
    ]
  }
}
```

---

### GET /api/metrics/aggregate/users-over-time

Get statistics of registered users per day, aggregated from all applications.

**Authentication:** Required (Bearer token)

**Query Parameters:**
- `days` (default: 30): Number of days to query

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "aggregate": [
      {
        "date": "2024-01-15",
        "total": 35,
        "byApp": {
          "banners-all-over": 12,
          "app2": 23
        }
      }
    ],
    "byApp": [
      {
        "appId": "banners-all-over",
        "appName": "Banners All Over",
        "data": [...]
      }
    ]
  }
}
```

---

### GET /api/metrics/aggregate/top-shops

Get shops with most users, aggregating data from all applications.

**Authentication:** Required (Bearer token)

**Query Parameters:**
- `limit` (default: 10): Number of shops to return

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "aggregate": [
      {
        "shop": "bigstore.myshopify.com",
        "totalUsers": 150,
        "totalActiveUsers": 120,
        "byApp": {
          "banners-all-over": {
            "users": 50,
            "active": 45
          },
          "app2": {
            "users": 100,
            "active": 75
          }
        }
      }
    ],
    "byApp": [...]
  }
}
```

---

### GET /api/metrics/aggregate/activity

Get recent activity from all applications, combined and sorted.

**Authentication:** Required (Bearer token)

**Query Parameters:**
- `limit` (default: 20): Number of activities to return

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "type": "new_user",
      "appId": "banners-all-over",
      "appName": "Banners All Over",
      "user": {
        "email": "user@example.com",
        "shop": "store.myshopify.com"
      },
      "timestamp": "2024-01-20T15:30:00.000Z"
    }
  ]
}
```

---

### GET /api/metrics/aggregate/summary

Get a concise summary of key metrics for all applications.

**Authentication:** Required (Bearer token)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "totals": {
      "totalUsers": 1500,
      "activeUsers": 1200,
      "totalShops": 300,
      "activeShops": 250
    },
    "byApp": [
      {
        "appId": "banners-all-over",
        "appName": "Banners All Over",
        "totalUsers": 500,
        "activeUsers": 400,
        "totalShops": 100,
        "activeShops": 85
      }
    ]
  }
}
```

---

## Error Handling

All endpoints return standard error responses:

### 400 Bad Request
```json
{
  "success": false,
  "error": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "No token provided" // or "Invalid token"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## Rate Limiting

Currently, no rate limiting is implemented. This may be added in future versions.

---

## CORS Policy

- **Development:** All origins are allowed
- **Production:** Only configured frontend origin is allowed

---

## Data Models

### User Schema
```javascript
{
  _id: ObjectId,
  email: String,
  shop: String,
  status: String, // 'active', 'inactive', etc.
  settings: Object,
  createdAt: Date,
  updatedAt: Date,
  lastLoginAt: Date
}
```

### Email Template Schema
```javascript
{
  _id: ObjectId,
  name: String,
  language: String, // 'en', 'es', 'fr', 'de', 'it', 'pt'
  subject: String,
  htmlTemplate: String,
  textTemplate: String,
  variables: [String],
  isActive: Boolean,
  version: Number,
  shopId: String, // optional
  createdAt: Date,
  updatedAt: Date
}
```

### Shop Schema
```javascript
{
  _id: ObjectId,
  id: String,
  name: String,
  email: String,
  domain: String,
  myshopifyDomain: String,
  isActive: Boolean,
  lastLoginAt: Date,
  plan: {
    type: String, // 'basic', 'standard', 'pro', 'business', 'enterprise'
    activatedAt: Date,
    trialEndsAt: Date
  },
  settings: Object,
  auth: Object,
  needsAuthUpdate: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Testing with cURL

### Complete workflow example:

```bash
# 1. Check server health
curl http://localhost:3001/api/health

# 2. Login
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tuempresa.com","password":"admin123"}' \
  | jq -r '.token')

# 3. Get list of apps
curl -X GET http://localhost:3001/api/apps \
  -H "Authorization: Bearer $TOKEN"

# 4. Get users from an app
curl -X GET "http://localhost:3001/api/banners-all-over/users?page=1&limit=20" \
  -H "Authorization: Bearer $TOKEN"

# 5. Get user stats
curl -X GET http://localhost:3001/api/banners-all-over/users/stats \
  -H "Authorization: Bearer $TOKEN"

# 6. Get templates
curl -X GET "http://localhost:3001/api/banners-all-over/templates?language=en" \
  -H "Authorization: Bearer $TOKEN"

# 7. Get dashboard metrics
curl -X GET http://localhost:3001/api/banners-all-over/metrics/dashboard \
  -H "Authorization: Bearer $TOKEN"

# 8. Get aggregate metrics from all apps
curl -X GET http://localhost:3001/api/metrics/aggregate/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

---

## Swagger UI

Interactive API documentation is available at: **http://localhost:3001/docs**

The Swagger UI provides:
- Interactive endpoint testing
- Request/response examples
- Schema definitions
- Authentication testing

---

## Support

For issues or questions, contact: **support@bannersallover.com**

---

**Last Updated:** December 5, 2024
