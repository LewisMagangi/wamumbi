# Authentication

Wamumbi uses Clerk for secure authentication and session management. This guide covers authentication flows, session handling, and security best practices.

## Authentication Overview

### Supported Authentication Methods

- **Email/Password** - Traditional email and password authentication
- **Social Logins** - Google, GitHub, and other OAuth providers
- **Magic Links** - Passwordless authentication via email
- **Phone Authentication** - SMS-based verification

### User Roles and Permissions

The system supports four primary user roles:

1. **Admin** - Full system access and management
2. **Team Leader** - Team and project management
3. **Volunteer** - Participate in activities and projects
4. **Donor** - Make donations and track contributions

## Authentication Flow

### 1. User Registration

```javascript
// Frontend - User signs up
import { useSignUp } from '@clerk/nextjs';

const { signUp, isLoaded } = useSignUp();

const handleSignUp = async (email, password, firstName, lastName) => {
  if (!isLoaded) return;
  
  try {
    const result = await signUp.create({
      emailAddress: email,
      password,
      firstName,
      lastName
    });
    
    // Send verification email
    await signUp.prepareEmailAddressVerification({
      strategy: 'email_code'
    });
  } catch (error) {
    console.error('Sign up error:', error);
  }
};
```

### 2. Email Verification

```javascript
// Verify email with code
const handleVerification = async (code) => {
  try {
    const result = await signUp.attemptEmailAddressVerification({
      code
    });
    
    if (result.status === 'complete') {
      // User is now verified and signed in
      await setSession(result.createdSessionId);
    }
  } catch (error) {
    console.error('Verification error:', error);
  }
};
```

### 3. User Sign In

```javascript
import { useSignIn } from '@clerk/nextjs';

const { signIn, isLoaded } = useSignIn();

const handleSignIn = async (email, password) => {
  if (!isLoaded) return;
  
  try {
    const result = await signIn.create({
      identifier: email,
      password
    });
    
    if (result.status === 'complete') {
      // User is signed in
      window.location.href = '/dashboard';
    }
  } catch (error) {
    console.error('Sign in error:', error);
  }
};
```

## API Authentication

### Session-Based Authentication

All API routes are protected using Clerk's middleware:

```javascript
// middleware.ts
import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: ['/api/health', '/api/webhooks/(.*)'],
  apiRoutes: ['/api/(.*)']
});
```

### Protecting API Routes

```javascript
// pages/api/protected-route.ts
import { getAuth } from '@clerk/nextjs/server';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId, sessionId } = getAuth(req);
  
  if (!userId) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required'
      }
    });
  }
  
  // Route logic here
}
```

### Role-Based Access Control

```javascript
// utils/auth.ts
export const requireRole = (allowedRoles: string[]) => {
  return async (req: NextApiRequest, res: NextApiResponse, next: Function) => {
    const { userId } = getAuth(req);
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });
    
    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    req.user = user;
    next();
  };
};

// Usage in API route
export default requireRole(['admin', 'team_leader'])(async (req, res) => {
  // Only admins and team leaders can access this route
});
```

## Frontend Authentication

### React Components

```javascript
// components/ProtectedRoute.tsx
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isLoaded, isSignedIn, user } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    }
    
    if (requiredRole && user?.publicMetadata?.role !== requiredRole) {
      router.push('/unauthorized');
    }
  }, [isLoaded, isSignedIn, user, router, requiredRole]);
  
  if (!isLoaded || !isSignedIn) {
    return <div>Loading...</div>;
  }
  
  return <>{children}</>;
};
```

### Getting User Information

```javascript
// Get current user in component
import { useUser } from '@clerk/nextjs';

const Dashboard = () => {
  const { user, isLoaded } = useUser();
  
  if (!isLoaded) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>Welcome, {user?.firstName}!</h1>
      <p>Role: {user?.publicMetadata?.role}</p>
    </div>
  );
};
```

## API Endpoints

### Authentication Status

```http
GET /api/auth/me
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "volunteer",
      "status": "active"
    }
  }
}
```

### Update User Profile

```http
PATCH /api/auth/profile
```

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

## Security Best Practices

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

### Session Management

- Sessions are automatically managed by Clerk
- Token refresh is handled transparently
- Session expiration redirects to sign-in page
- Multi-device session support

### Security Headers

```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders
      }
    ];
  }
};
```

## Webhooks

### User Events

Clerk sends webhooks for user lifecycle events:

```javascript
// pages/api/webhooks/clerk.ts
import { Webhook } from 'svix';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  const payload = JSON.stringify(req.body);
  const headers = req.headers;
  
  const wh = new Webhook(webhookSecret);
  
  try {
    const event = wh.verify(payload, headers);
    
    switch (event.type) {
      case 'user.created':
        await createUserInDatabase(event.data);
        break;
      case 'user.updated':
        await updateUserInDatabase(event.data);
        break;
      case 'user.deleted':
        await deleteUserFromDatabase(event.data);
        break;
    }
    
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: 'Invalid signature' });
  }
}
```

## Troubleshooting

### Common Issues

1. **Session not found**
   - Check if user is signed in
   - Verify middleware configuration
   - Check for expired sessions

2. **Role permissions**
   - Verify user role in database
   - Check role-based access control logic
   - Ensure metadata is properly set

3. **Redirect loops**
   - Check middleware public routes
   - Verify redirect URLs configuration
   - Check for conflicting route protection

### Debug Mode

```javascript
// Enable debug mode for development
import { setClerkOptions } from '@clerk/nextjs';

setClerkOptions({
  debug: process.env.NODE_ENV === 'development'
});
```

---

For more detailed information, refer to the [Clerk documentation](https://clerk.com/docs) and [Next.js authentication guide](https://nextjs.org/docs/authentication).
