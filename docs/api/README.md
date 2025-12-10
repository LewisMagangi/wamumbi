# API Documentation

Welcome to the Wamumbi Charity Management System API documentation. This API provides comprehensive tRPC procedures for managing charitable activities, donations, volunteers, and organizational operations.

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Base URL](#base-url)
- [Response Format](#response-format)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [tRPC Procedures](#trpc-procedures)
- [Quick Start](#quick-start)

## Overview

The Wamumbi API is built using tRPC with Next.js, providing type-safe, end-to-end API communication. It provides secure access to all system functionality including:

- User management and authentication
- Donation processing and tracking
- Campaign management
- Volunteer coordination
- Event management
- Project tracking
- Team management

## Authentication

All tRPC procedures require authentication using Clerk's session-based authentication system.

### Authentication Flow

1. Users authenticate through Clerk's authentication system
2. Session tokens are automatically managed by the frontend
3. tRPC procedures validate sessions using Clerk middleware
4. User roles and permissions are enforced at the procedure level

### Headers Required

tRPC handles authentication automatically through the client configuration.

## Base URL

```text
Development: http://localhost:3000/api/trpc
Production: https://wamumbi.vercel.app/api/trpc
```

## Response Format

tRPC procedures return typed responses. Success responses contain the requested data, while errors are thrown as tRPC errors.

### Success Response

Procedures return the expected data type directly:

```typescript
// Example response from user.getProfile
{
  id: 1,
  email: "john@example.com",
  firstName: "John",
  lastName: "Doe",
  // ... other fields
}
```

### Error Response

Errors are thrown with specific error codes:

```typescript
// Example error
throw new TRPCError({
  code: 'UNAUTHORIZED',
  message: 'Authentication required'
});
```

## Error Handling

### tRPC Error Codes

- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `BAD_REQUEST` - Invalid input
- `INTERNAL_SERVER_ERROR` - Server error

## Rate Limiting

tRPC requests are limited to:

- **Authenticated users**: 1000 requests per hour
- **Donation procedures**: 100 requests per hour

## tRPC Procedures

### Core Procedures

- **[Authentication](./authentication.md)** - User authentication and session management
- **[Users](./endpoints.md#users)** - User management and profiles
- **[Donations](./endpoints.md#donations)** - Donation processing and tracking
- **[Campaigns](./endpoints.md#campaigns)** - Fundraising campaign management
- **[Volunteers](./endpoints.md#volunteers)** - Volunteer registration and management
- **[Events](./endpoints.md#events)** - Event creation and registration
- **[Projects](./endpoints.md#projects)** - Project tracking and management
- **[Teams](./endpoints.md#teams)** - Team management

## Quick Start

### Setting Up the tRPC Client

1. **Install dependencies** (handled by the project)
2. **Configure the client** in your frontend:

```typescript
import { createTRPCNext } from '@trpc/next';
import { appRouter } from '~/server/routers/_app';

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      url: '/api/trpc',
    };
  },
  ssr: false,
});
```

### Making Your First tRPC Call

```typescript
// Example: Get current user profile
const { data: user } = trpc.user.getProfile.useQuery();

// Example: Create a donation
const createDonation = trpc.donation.create.useMutation();
createDonation.mutate({
  campaignId: 123,
  amount: 100.00,
  paymentMethodId: 1,
  isAnonymous: false
});
```

## SDK and Libraries

### TypeScript Integration

tRPC provides full type safety between client and server:

```typescript
// Client-side type safety
const campaigns = trpc.campaign.list.useQuery({
  status: 'active' // TypeScript ensures valid status
});
```

## Need Help?

- 📖 Check the [detailed procedures documentation](./endpoints.md)
- 🔐 Review [authentication guide](./authentication.md)
- 🐛 Report issues on [GitHub](https://github.com/LewisMagangi/wamumbi/issues)
- 💬 Join our [Discord community](https://discord.gg/wamumbi)

---

**Note**: This API uses tRPC for type-safe communication. All procedures are documented with their input/output types.
