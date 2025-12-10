# Wamumbi Web Application

Frontend for the Wamumbi Charity Management System built with Next.js 14, TypeScript, Tailwind CSS, and tRPC.

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with Shadcn/UI components
- **API**: tRPC for type-safe communication
- **Authentication**: Clerk
- **Database**: Prisma with PostgreSQL

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   # Configure your Clerk keys and database URL
   ```

3. **Run database migrations**

   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```text
src/
├── app/              # Next.js app router pages
├── components/       # Reusable UI components
├── lib/             # Utilities and configurations
├── trpc/            # tRPC client setup
├── hooks/           # Custom React hooks
├── contexts/        # React contexts
└── types/           # TypeScript definitions
```

## Key Features

- User authentication with Clerk
- Dashboard with statistics and charts
- Campaign management
- Donation tracking
- Volunteer registration
- Event management
- Project tracking
