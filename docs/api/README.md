# API Documentation

Welcome to the Wamumbi Charity Management System API documentation. This API provides comprehensive endpoints for managing charitable activities, donations, volunteers, and organizational operations.

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Base URL](#base-url)
- [Response Format](#response-format)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [API Endpoints](#api-endpoints)
- [Quick Start](#quick-start)

## Overview

The Wamumbi API is built using Next.js API Routes and follows REST principles. It provides secure access to all system functionality including:

- User management and authentication
- Donation processing and tracking
- Campaign management
- Volunteer coordination
- Event management
- Project tracking
- Team communications

## Authentication

All API endpoints require authentication using Clerk's session-based authentication system.

### Authentication Flow

1. Users authenticate through Clerk's authentication system
2. Session tokens are automatically managed by the frontend
3. API routes validate sessions using Clerk middleware
4. User roles and permissions are enforced at the API level

### Headers Required

```http
Authorization: Bearer <session-token>
Content-Type: application/json
```

## Base URL

```text
Development: http://localhost:3000/api
Production: https://wamumbi.vercel.app/api
```

## Response Format

All API responses follow a consistent format:

### Success Response

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation completed successfully"
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {}
  }
}
```

## Error Handling

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

### Common Error Codes

- `INVALID_INPUT` - Request validation failed
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `DUPLICATE_ENTRY` - Resource already exists
- `PAYMENT_FAILED` - Payment processing error

## Rate Limiting

API requests are limited to:

- **Authenticated users**: 1000 requests per hour
- **Donation endpoints**: 100 requests per hour
- **File uploads**: 50 requests per hour

## API Endpoints

### Core Endpoints

- **[Authentication](./authentication.md)** - User authentication and session management
- **[Users](./endpoints.md#users)** - User management and profiles
- **[Donations](./endpoints.md#donations)** - Donation processing and tracking
- **[Campaigns](./endpoints.md#campaigns)** - Fundraising campaign management
- **[Volunteers](./endpoints.md#volunteers)** - Volunteer registration and management
- **[Events](./endpoints.md#events)** - Event creation and registration
- **[Projects](./endpoints.md#projects)** - Project tracking and management
- **[Teams](./endpoints.md#teams)** - Team management and communications

## Quick Start

### Making Your First API Call

1. **Authenticate** through the frontend application
2. **Get session token** (handled automatically by Clerk)
3. **Make API request**:

```javascript
// Example: Get current user profile
const response = await fetch('/api/users/profile', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
```

### Example: Create a Donation

```javascript
const donation = await fetch('/api/donations', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    campaignId: 123,
    amount: 100.00,
    paymentMethod: 'credit_card',
    isAnonymous: false
  })
});
```

## SDK and Libraries

### JavaScript/TypeScript Client

```bash
npm install @wamumbi/api-client
```

```javascript
import { WamumbiClient } from '@wamumbi/api-client';

const client = new WamumbiClient({
  baseUrl: 'https://wamumbi.vercel.app/api'
});

// Usage
const campaigns = await client.campaigns.list();
```

## Need Help?

- 📖 Check the [detailed endpoints documentation](./endpoints.md)
- 🔐 Review [authentication guide](./authentication.md)
- 🐛 Report issues on [GitHub](https://github.com/LewisMagangi/wamumbi/issues)
- 💬 Join our [Discord community](https://discord.gg/wamumbi)

---

**Note**: This API is under active development. Breaking changes will be communicated through our changelog and migration guides.
