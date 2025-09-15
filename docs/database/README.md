# Database Documentation

This document provides comprehensive information about the Wamumbi Charity Management System database design, schema, and data management.

## Table of Contents

- [Overview](#overview)
- [Database Schema](#database-schema)
- [Entity Relationships](#entity-relationships)
- [Data Models](#data-models)
- [Migrations](#migrations)
- [Seeding](#seeding)
- [Backup and Recovery](#backup-and-recovery)
- [Performance Optimization](#performance-optimization)

## Overview

The Wamumbi database is built using **PostgreSQL** with **Prisma** as the ORM (Object-Relational Mapping) tool. The database is designed to handle complex relationships between users, donations, campaigns, volunteers, events, and projects.

### Technology Stack

- **Database**: PostgreSQL 14+
- **ORM**: Prisma 5+
- **Migration Tool**: Prisma Migrate
- **Admin Interface**: Prisma Studio

### Key Features

- ACID compliance for financial transactions
- Audit logging for all critical operations
- Soft deletes for data integrity
- Indexing for optimal query performance
- Foreign key constraints for referential integrity

## Database Schema

The complete database schema is defined in DBML format and has been normalized to Third Normal Form (3NF). You can find the detailed schema in [`databasechema.dbml`](./databasechema.dbml).

### Normalized Architecture

The database follows a normalized design with:

- **Lookup tables** for categories, roles, and statuses
- **Address normalization** for consistent location data
- **Statistics tables** for performance optimization
- **Audit tables** for comprehensive tracking

### Core Entities

1. **Users** - System users with normalized roles and statuses
2. **Categories** - Centralized category management for teams, campaigns, and blog posts
3. **Addresses** - Normalized address data with geographic coordinates
4. **Teams** - Organizational teams for project management
5. **Campaigns** - Fundraising campaigns linked to categories
6. **Donations** - Financial contributions and tracking
7. **Projects** - Charitable projects and initiatives
8. **Events** - Community events and gatherings
9. **Volunteers** - Volunteer management with skills tracking
10. **Statistics Tables** - Pre-calculated metrics for performance

### Normalization Features

- **Third Normal Form (3NF)** compliance
- **Lookup tables** for all enum values
- **Address normalization** across all entities
- **Skills normalization** with proficiency tracking
- **Emergency contacts** as separate entities
- **Audit system** with normalized action types

### Schema Visualization

```text
Users ──── User_Roles (lookup)
  │   ──── User_Statuses (lookup)
  │   ──── Addresses (normalized)
  │
  ├── (1) ──── (∞) Team_Members ──── (∞) Teams ──── Categories (lookup)
  │
  ├── (1) ──── (∞) Volunteers ──── Emergency_Contacts ──── Addresses
  │                │
  │                └── (∞) Volunteer_Skill_Assignments ──── Volunteer_Skills (lookup)
  │
  ├── (1) ──── (∞) Event_Registrations ──── (∞) Events ──── Addresses
  │
  └── (1) ──── (∞) Donations ──── (∞) Campaigns ──── Categories (lookup)
                                      │           ──── Addresses
                                      │
                                      └── (∞) Projects ──── Teams

Statistics Tables:
├── Campaign_Statistics (calculated values)
├── Volunteer_Statistics (calculated values)
└── Project_Progress (calculated values)

Audit System:
├── Entity_Types (lookup)
├── Audit_Actions (lookup)
└── Audit_Logs
```

## Entity Relationships

### User Management

- **Users** have one role (admin, team_leader, volunteer, donor)
- **Users** can be members of multiple **Teams**
- **Users** can be **Volunteers** with additional profile information
- **Users** can register for multiple **Events**

### Financial Management

- **Donors** can make multiple **Donations**
- **Donations** are linked to specific **Campaigns**
- **Campaigns** can fund multiple **Projects**
- Financial audit trails track all money movements

### Project Management

- **Teams** manage multiple **Projects**
- **Projects** can be linked to **Campaigns** for funding
- **Volunteer Activities** are logged against **Projects** or **Events**

## Data Models

### Prisma Schema

The Prisma schema is located at `web/prisma/schema.prisma`. Here are key model definitions:

```prisma
model User {
  id           Int      @id @default(autoincrement())
  email        String   @unique
  passwordHash String   @map("password_hash")
  firstName    String   @map("first_name")
  lastName     String   @map("last_name")
  phone        String?
  role         Role     @default(VOLUNTEER)
  status       UserStatus @default(PENDING)
  profileImage String?  @map("profile_image")
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")
  lastLogin    DateTime? @map("last_login")

  // Relations
  teamMembers    TeamMember[]
  createdCampaigns Campaign[] @relation("CampaignCreator")
  createdProjects  Project[]  @relation("ProjectCreator")
  volunteer        Volunteer?
  eventRegistrations EventRegistration[]
  notifications    Notification[]
  auditLogs        AuditLog[]

  @@map("users")
}

model Campaign {
  id            Int      @id @default(autoincrement())
  title         String
  description   String
  goalAmount    Decimal  @map("goal_amount") @db.Decimal(12, 2)
  currentAmount Decimal  @default(0) @map("current_amount") @db.Decimal(12, 2)
  category      Category
  status        CampaignStatus @default(ACTIVE)
  startDate     DateTime @map("start_date") @db.Date
  endDate       DateTime? @map("end_date") @db.Date
  imageUrl      String?  @map("image_url")
  createdBy     Int      @map("created_by")
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  // Relations
  creator     User       @relation("CampaignCreator", fields: [createdBy], references: [id])
  donations   Donation[]
  projects    Project[]

  @@map("campaigns")
}
```

### Enums

```prisma
enum Role {
  ADMIN
  TEAM_LEADER
  VOLUNTEER
  DONOR
}

enum UserStatus {
  ACTIVE
  INACTIVE
  PENDING
}

enum Category {
  WATER_PROJECTS
  EDUCATION
  HUNGER_RELIEF
  HEALTHCARE
  OTHER
}

enum CampaignStatus {
  ACTIVE
  PAUSED
  COMPLETED
  CANCELLED
}
```

## Migrations

### Migration Strategy

Wamumbi uses Prisma Migrate for database schema versioning and migrations.

#### Development Migrations

```bash
# Create and apply a new migration
npx prisma migrate dev --name add_user_preferences

# Reset database (development only)
npx prisma migrate reset

# Check migration status
npx prisma migrate status
```

#### Production Migrations

```bash
# Deploy migrations to production
npx prisma migrate deploy

# Generate Prisma client after migration
npx prisma generate
```

### Migration Files

Migration files are stored in `web/prisma/migrations/` directory:

```text
migrations/
├── migration_lock.toml
├── 20250423124251_init/
│   └── migration.sql
└── 20250527091022_implement_complete_models/
    └── migration.sql
```

### Sample Migration

```sql
-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20),
    "role" "Role" NOT NULL DEFAULT 'VOLUNTEER',
    "status" "UserStatus" NOT NULL DEFAULT 'PENDING',
    "profile_image" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_login" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
```

## Seeding

### Seed Data

The database can be populated with initial data using Prisma's seeding functionality.

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: 'admin@wamumbi.org',
      passwordHash: 'hashed_password',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      status: 'ACTIVE'
    }
  });

  // Create sample campaign
  const campaign = await prisma.campaign.create({
    data: {
      title: 'Clean Water Initiative 2025',
      description: 'Providing clean water access to rural communities',
      goalAmount: 50000,
      category: 'WATER_PROJECTS',
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-12-31'),
      createdBy: admin.id
    }
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### Running Seeds

```bash
# Run seed script
npx prisma db seed
```

## Backup and Recovery

### Backup Strategy

#### Automated Backups

```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="wamumbi_backup_$DATE.sql"

pg_dump $DATABASE_URL > backups/$BACKUP_FILE
gzip backups/$BACKUP_FILE

# Upload to cloud storage
aws s3 cp backups/$BACKUP_FILE.gz s3://wamumbi-backups/
```

#### Manual Backup

```bash
# Create backup
pg_dump $DATABASE_URL > backup.sql

# Restore from backup
psql $DATABASE_URL < backup.sql
```

### Recovery Procedures

1. **Point-in-time Recovery**: Use PostgreSQL's WAL (Write-Ahead Logging)
2. **Full Restore**: Restore from complete database dump
3. **Selective Restore**: Restore specific tables or data

## Performance Optimization

### Indexing Strategy

```sql
-- User lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role_status ON users(role, status);

-- Donation queries
CREATE INDEX idx_donations_campaign_date ON donations(campaign_id, donation_date);
CREATE INDEX idx_donations_donor_id ON donations(donor_id);

-- Campaign performance
CREATE INDEX idx_campaigns_status_category ON campaigns(status, category);
CREATE INDEX idx_campaigns_dates ON campaigns(start_date, end_date);

-- Team and project queries
CREATE INDEX idx_team_members_user_team ON team_members(user_id, team_id);
CREATE INDEX idx_projects_team_status ON projects(team_id, status);
```

### Query Optimization

```typescript
// Efficient pagination with cursor-based pagination
const campaigns = await prisma.campaign.findMany({
  take: 20,
  skip: (page - 1) * 20,
  where: {
    status: 'ACTIVE'
  },
  include: {
    _count: {
      select: { donations: true }
    }
  },
  orderBy: {
    createdAt: 'desc'
  }
});

// Optimized donation aggregations
const campaignStats = await prisma.campaign.findUnique({
  where: { id: campaignId },
  include: {
    donations: {
      where: { status: 'COMPLETED' }
    },
    _count: {
      select: { donations: true }
    }
  }
});
```

### Connection Pooling

```typescript
// Prisma Client configuration
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  log: ['query', 'info', 'warn', 'error']
});
```

## Database Administration

### Monitoring

```typescript
// Database health check
export async function checkDatabaseHealth() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: 'healthy', timestamp: new Date() };
  } catch (error) {
    return { status: 'unhealthy', error: error.message, timestamp: new Date() };
  }
}
```

### Maintenance Tasks

```sql
-- Analyze table statistics
ANALYZE;

-- Vacuum to reclaim space
VACUUM ANALYZE;

-- Reindex for performance
REINDEX DATABASE wamumbi;
```

## Security Considerations

### Data Protection

- All sensitive data is encrypted at rest
- PII (Personally Identifiable Information) is handled according to GDPR
- Audit logs track all data access and modifications

### Access Control

- Database access restricted to application tier
- Role-based access control at application level
- No direct database access for end users

### Data Retention

- Financial records: 7 years
- User activity logs: 2 years
- Audit logs: 5 years
- Soft delete for user accounts

---

For more information about specific database operations, refer to the [Prisma documentation](https://www.prisma.io/docs) and [PostgreSQL documentation](https://www.postgresql.org/docs/).
