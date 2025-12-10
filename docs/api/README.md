# API Documentation

Welcome to the Wamumbi Charity Management System API documentation. This API provides comprehensive tRPC procedures for managing charitable activities, donations, volunteers, and organizational operations.

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Base URL](#base-url)
- [Response Format](#response-format)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [API Procedures](#api-procedures)
- [Database Seeding](#database-seeding)
- [Quick Start](#quick-start)

## Overview

The Wamumbi API is built using tRPC with Next.js, providing type-safe, end-to-end API communication. It provides secure access to all system functionality including:

- **User Management**: Clerk authentication with role-based access control
- **Donation Processing**: Multi-currency donation tracking with seeded reference data
- **Campaign Management**: Full CRUD operations with category and urgency level management
- **Volunteer Coordination**: Complete volunteer lifecycle with user creation and emergency contacts
- **Event Management**: Full CRUD operations with category management and editing
- **Project Tracking**: Project management and coordination
- **Team Management**: Team coordination and management

## Authentication

All tRPC procedures require authentication using Clerk's session-based authentication system.

### Authentication Flow

1. Users authenticate through Clerk's authentication system (including social auth)
2. Session tokens are automatically managed by the frontend
3. tRPC procedures validate sessions using Clerk middleware
4. User roles and permissions are enforced at the procedure level
5. Sign out functionality properly clears sessions and redirects

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

## API Procedures

### Core Routers

The API is organized into the following tRPC routers:

- **auth-router.ts**: User authentication and session management
- **campaigns-router.ts**: Campaign CRUD operations with category and urgency management
- **donations-router.ts**: Donation processing and tracking
- **events-router.ts**: Event management with full CRUD operations
- **volunteers-router.ts**: Volunteer coordination with user creation
- **teams-router.ts**: Team management and coordination
- **blog-posts-router.ts**: Content management for blog posts
- **dashboard-router.ts**: Dashboard analytics and reporting

### Key Features Implemented

#### Date Validation Fixes

All date fields now use `z.coerce.date()` for proper validation:

- Campaign start/end dates
- Event dates
- Volunteer registration dates

#### Enhanced Volunteer Registration

- `createWithUser` mutation creates user + volunteer + emergency contact in one transaction
- Seamless registration flow without requiring pre-existing users

#### Full Event CRUD

- Create, read, update, and delete events
- Category management with seeded reference data
- Modal-based editing with form pre-population

#### Database Seeding

Comprehensive seeding of all reference tables (17 tables total):

- Categories, urgency levels, currencies
- Event types, volunteer roles, donation types
- And more reference data for full functionality

### Manual Documentation

For detailed procedure descriptions and examples, see:

- **[Authentication](./authentication.md)** - User authentication and session management
- **[Endpoints](./endpoints.md)** - Detailed procedure documentation

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
