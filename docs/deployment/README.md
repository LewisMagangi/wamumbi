# Deployment Guide

## Development Setup

1. Clone repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env.local`
4. Run database migrations: `npx prisma migrate dev`
5. Start development server: `npm run dev`

## Production Deployment

### Vercel (Recommended)

1. Connect GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

### Environment Variables

```bash
DATABASE_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=
```

## Database

- Development: Local PostgreSQL or cloud database
- Production: PostgreSQL on cloud provider (Supabase, PlanetScale, etc.)

## Monitoring

Set up monitoring and error tracking for production environment.
