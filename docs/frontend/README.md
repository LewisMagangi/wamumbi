# Frontend Documentation

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Shadcn/UI Components
- Clerk Authentication
- tRPC for type-safe API communication

## Project Structure

```text
web/
├── src/
│   ├── app/              # Next.js app directory (pages and layouts)
│   ├── components/       # Reusable UI components
│   │   ├── ui/          # Shadcn/UI base components
│   │   ├── auth/        # Authentication components
│   │   ├── dashboard/   # Dashboard-specific components
│   │   └── ...          # Feature-specific components
│   ├── contexts/        # React contexts (AuthContext)
│   ├── db/              # Database utilities
│   ├── generated/       # Generated Prisma client
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions and configurations
│   ├── middleware.ts    # Authentication middleware
│   ├── pages/           # Additional pages
│   ├── trpc/            # tRPC client configuration and routers
│   └── types/           # TypeScript type definitions
├── prisma/              # Database schema and migrations
├── public/              # Static assets
├── next.config.js       # Next.js configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── components.json      # Shadcn/UI configuration
├── package.json         # Dependencies and scripts
└── tsconfig.json        # TypeScript configuration
```

## Key Components

- Landing page with hero section
- Dashboard with statistics and charts for donations, campaigns, and teams
- Basic donation page with M-Pesa payment instructions
- Campaign listing and display
- Event listing with creation modal
- Volunteer signup form
- Authentication pages (login, signup, forgot password)
- Profile management

## API Integration

### tRPC Client Setup

The frontend uses tRPC for type-safe communication with the backend:

```typescript
// tRPC client configuration (src/trpc/index.ts)
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

### Usage Examples

```typescript
// Query example
const { data: campaigns } = trpc.campaigns.getAll.useQuery();

// Mutation example
const createDonation = trpc.donations.create.useMutation();
createDonation.mutate({
  campaignId: 123,
  amount: 100.00,
  paymentMethodId: 1,
  isAnonymous: false
});
```

### Authentication with Clerk

Authentication is handled through Clerk with automatic session management:

```typescript
// Usage in components
import { useUser } from '@clerk/nextjs';

const { user, isLoaded } = useUser();
```

## Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

## Styling

Uses Tailwind CSS with basic custom CSS variables defined in `globals.css`.
