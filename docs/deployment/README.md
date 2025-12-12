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

## Clerk Authentication Setup

### Domain Configuration for Production

**⚠️ IMPORTANT**: Clerk requires a custom domain for production deployments.
You cannot use Vercel's automatic `*.vercel.app` domains with Clerk's production
instance.

#### Why Custom Domains Are Required

Clerk's production authentication relies on DNS-based security and session cookie
validation. The `*.vercel.app` domains provided by Vercel are not suitable because:

- Clerk needs DNS control to validate allowed parties
- Production instances require secure cookie generation
- CNAME validation and SSL certificates must be properly configured
- Session security depends on domain ownership verification

#### Production Domain Setup Steps

1. **Purchase a Custom Domain**
   - Buy a domain from a registrar (Namecheap, GoDaddy, etc.)
   - Ensure you can add DNS records (A/CNAME and TXT records)

2. **Configure Domain in Clerk Dashboard**
   - Go to [Clerk Dashboard](https://dashboard.clerk.com/)
   - Navigate to your Production instance → Settings → Domains
   - Add your custom domain (e.g., `auth.yourdomain.com` or `app.yourdomain.com`)
   - Clerk will provide DNS records to add to your domain registrar

3. **Update Vercel Project Settings**
   - In Vercel dashboard, go to your project settings
   - Add your custom domain under "Domains"
   - Set it as the production domain (not `*.vercel.app`)
   - Update environment variables to use production Clerk keys

4. **Environment Variables for Production**

   ```bash
   # Production Clerk Keys (pk_live_*, sk_live_*)
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
   CLERK_SECRET_KEY=sk_live_...

   # Production domain URLs
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=https://yourdomain.com/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=https://yourdomain.com/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=https://yourdomain.com/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=https://yourdomain.com/dashboard
   ```

#### Domain Examples

- **Main App Domain**: `wamumbi.org` or `app.wamumbi.org`
- **Auth Subdomain**: `auth.wamumbi.org` (recommended for Clerk)
- **Full Domain**: Use your main domain if preferred

#### Troubleshooting Domain Issues

**Still seeing "Development Mode" banner in production?**

1. **Check Domain Configuration**
   - Verify your custom domain is properly configured in Clerk dashboard
   - Ensure DNS records are propagated (may take 24-48 hours)
   - Confirm SSL certificate is issued by Clerk

2. **Verify Environment Variables**
   - Ensure you're using `pk_live_*` and `sk_live_*` keys in production
   - Check that URLs in environment variables match your custom domain

3. **Domain Ownership**
   - Clerk must verify you own the domain through DNS records
   - Cannot use `*.vercel.app` or other hosted domains

4. **Preview Deployments**
   - For preview deployments, you can add `*.vercel.app` as an allowed domain
     in Clerk
   - This allows test keys to work on preview URLs
   - Production deployments still require custom domains

#### Additional Clerk Configuration

For preview deployments to work with Clerk:

1. Go to Clerk Dashboard → Production Instance → Settings → Domains
2. Add `*.vercel.app` as an allowed domain
3. This enables Clerk on preview deployments while maintaining production security

### Authentication Flow

- **Development**: Uses test keys, works on localhost and `*.vercel.app`
- **Production**: Uses live keys, requires custom domain
- **Session Security**: Production uses secure cookies tied to your domain

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
