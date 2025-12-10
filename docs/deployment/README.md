# Deployment Guide

## Development Setup

1. **Clone repository**

   ```bash
   git clone <repository-url>
   cd wamumbi
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env.local`
   - Configure required environment variables (see Environment Variables section)

4. **Set up database**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma migrate dev

   # Seed database with reference data
   npx prisma db seed
   ```

5. **Start development server**

   ```bash
   npm run dev
   ```

## Production Deployment

### Vercel (Recommended)

1. **Connect repository**
   - Connect GitHub repository to Vercel
   - Configure build settings for Next.js

2. **Environment variables**
   - Set all required environment variables in Vercel dashboard
   - Ensure database URL points to production database

3. **Database setup**
   - Run migrations: `npx prisma migrate deploy`
   - Execute seeding: `npx prisma db seed`
   - Verify reference data is populated

4. **Deploy**
   - Automatic deployment on push to main branch
   - Manual deployment available in Vercel dashboard

### Manual Deployment

For self-hosted deployments:

```bash
# Build application
npm run build

# Start production server
npm start
```

## Environment Variables

### Required Variables

```bash
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Optional: Email service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Database Configuration

- **Development**: Local PostgreSQL or Neon serverless
- **Production**: Managed PostgreSQL (Neon, Supabase, PlanetScale, AWS RDS)
- **Connection**: Ensure connection pooling for production workloads

## Database Management

### Initial Setup

```bash
# Reset and migrate (development only)
npx prisma migrate reset

# Production migration
npx prisma migrate deploy

# Seed reference data (required for all environments)
npx prisma db seed
```

### Post-Deployment Verification

After deployment, verify:

- [ ] Database connection successful
- [ ] All reference tables seeded (17 tables)
- [ ] Authentication working with Clerk
- [ ] API endpoints responding
- [ ] Frontend loads without errors
- [ ] Dropdown menus populated with seed data

## Monitoring

### Recommended Setup

- **Error Tracking**: Sentry or similar
- **Performance Monitoring**: Vercel Analytics
- **Database Monitoring**: Built-in database provider tools
- **Uptime Monitoring**: UptimeRobot or Pingdom

### Health Checks

- API health endpoint: `/api/health`
- Database connectivity check
- Authentication service status

## Troubleshooting

### Common Issues

1. **Empty dropdowns**: Run `npx prisma db seed` to populate reference data
2. **Authentication errors**: Verify Clerk environment variables
3. **Database connection**: Check DATABASE_URL format and credentials
4. **Build failures**: Ensure all dependencies are installed and compatible

### Logs

- **Development**: Check terminal/console output
- **Production**: Use Vercel dashboard logs or logging service
