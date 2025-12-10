import { PrismaClient } from '../src/generated/prisma';
import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import * as dotenv from 'dotenv';
import * as ws from 'ws';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Configure Neon for Node.js environment
neonConfig.webSocketConstructor = ws.default || ws;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seed...');

  // Seed User Roles
  console.log('Creating user roles...');
  const roles = await Promise.all([
    prisma.userRole.upsert({
      where: { name: 'admin' },
      update: {},
      create: {
        name: 'admin',
        description: 'Administrator with full access',
        permissions: { all: true }
      }
    }),
    prisma.userRole.upsert({
      where: { name: 'staff' },
      update: {},
      create: {
        name: 'staff',
        description: 'Staff member with limited admin access',
        permissions: { read: true, write: true, manage_volunteers: true }
      }
    }),
    prisma.userRole.upsert({
      where: { name: 'volunteer' },
      update: {},
      create: {
        name: 'volunteer',
        description: 'Volunteer user',
        permissions: { read: true, volunteer: true }
      }
    }),
    prisma.userRole.upsert({
      where: { name: 'donor' },
      update: {},
      create: {
        name: 'donor',
        description: 'Donor user',
        permissions: { read: true, donate: true }
      }
    })
  ]);
  console.log(`  ✓ Created ${roles.length} user roles`);

  // Seed User Statuses
  console.log('Creating user statuses...');
  const userStatuses = await Promise.all([
    prisma.userStatus.upsert({
      where: { name: 'active' },
      update: {},
      create: { name: 'active', description: 'Active user account' }
    }),
    prisma.userStatus.upsert({
      where: { name: 'inactive' },
      update: {},
      create: { name: 'inactive', description: 'Inactive user account' }
    }),
    prisma.userStatus.upsert({
      where: { name: 'pending' },
      update: {},
      create: { name: 'pending', description: 'Pending verification' }
    }),
    prisma.userStatus.upsert({
      where: { name: 'suspended' },
      update: {},
      create: { name: 'suspended', description: 'Suspended account' }
    })
  ]);
  console.log(`  ✓ Created ${userStatuses.length} user statuses`);

  // Seed Currencies
  console.log('Creating currencies...');
  const currencies = await Promise.all([
    prisma.currency.upsert({
      where: { code: 'USD' },
      update: {},
      create: {
        code: 'USD',
        name: 'US Dollar',
        symbol: '$',
        exchange_rate_to_usd: 1.0,
        is_active: true
      }
    }),
    prisma.currency.upsert({
      where: { code: 'EUR' },
      update: {},
      create: {
        code: 'EUR',
        name: 'Euro',
        symbol: '€',
        exchange_rate_to_usd: 1.08,
        is_active: true
      }
    }),
    prisma.currency.upsert({
      where: { code: 'GBP' },
      update: {},
      create: {
        code: 'GBP',
        name: 'British Pound',
        symbol: '£',
        exchange_rate_to_usd: 1.27,
        is_active: true
      }
    }),
    prisma.currency.upsert({
      where: { code: 'KES' },
      update: {},
      create: {
        code: 'KES',
        name: 'Kenyan Shilling',
        symbol: 'KSh',
        exchange_rate_to_usd: 0.0065,
        is_active: true
      }
    }),
    prisma.currency.upsert({
      where: { code: 'CAD' },
      update: {},
      create: {
        code: 'CAD',
        name: 'Canadian Dollar',
        symbol: 'C$',
        exchange_rate_to_usd: 0.74,
        is_active: true
      }
    })
  ]);
  console.log(`  ✓ Created ${currencies.length} currencies`);

  // Seed Categories (for campaigns, events, teams, blogs)
  console.log('Creating categories...');
  const categories = await Promise.all([
    // Campaign categories
    prisma.category.upsert({
      where: { name: 'Education' },
      update: {},
      create: { name: 'Education', description: 'Educational initiatives and scholarships', type: 'campaign', display_order: 1 }
    }),
    prisma.category.upsert({
      where: { name: 'Healthcare' },
      update: {},
      create: { name: 'Healthcare', description: 'Medical care and health services', type: 'campaign', display_order: 2 }
    }),
    prisma.category.upsert({
      where: { name: 'Environment' },
      update: {},
      create: { name: 'Environment', description: 'Environmental conservation', type: 'campaign', display_order: 3 }
    }),
    prisma.category.upsert({
      where: { name: 'Hunger Relief' },
      update: {},
      create: { name: 'Hunger Relief', description: 'Food security and nutrition', type: 'campaign', display_order: 4 }
    }),
    prisma.category.upsert({
      where: { name: 'Water & Sanitation' },
      update: {},
      create: { name: 'Water & Sanitation', description: 'Clean water access', type: 'campaign', display_order: 5 }
    }),
    prisma.category.upsert({
      where: { name: 'Emergency Relief' },
      update: {},
      create: { name: 'Emergency Relief', description: 'Disaster and emergency response', type: 'campaign', display_order: 6 }
    }),
    // Team categories
    prisma.category.upsert({
      where: { name: 'Outreach Team' },
      update: {},
      create: { name: 'Outreach Team', description: 'Community outreach teams', type: 'team', display_order: 1 }
    }),
    prisma.category.upsert({
      where: { name: 'Fundraising Team' },
      update: {},
      create: { name: 'Fundraising Team', description: 'Fundraising teams', type: 'team', display_order: 2 }
    }),
    // Event categories
    prisma.category.upsert({
      where: { name: 'Fundraiser Event' },
      update: {},
      create: { name: 'Fundraiser Event', description: 'Fundraising events', type: 'event', display_order: 1 }
    }),
    prisma.category.upsert({
      where: { name: 'Workshop Event' },
      update: {},
      create: { name: 'Workshop Event', description: 'Training and workshops', type: 'event', display_order: 2 }
    }),
    prisma.category.upsert({
      where: { name: 'Volunteer Day' },
      update: {},
      create: { name: 'Volunteer Day', description: 'Volunteer activities', type: 'event', display_order: 3 }
    }),
    // Blog categories
    prisma.category.upsert({
      where: { name: 'News & Updates' },
      update: {},
      create: { name: 'News & Updates', description: 'Organization news', type: 'blog', display_order: 1 }
    }),
    prisma.category.upsert({
      where: { name: 'Impact Stories' },
      update: {},
      create: { name: 'Impact Stories', description: 'Success stories', type: 'blog', display_order: 2 }
    })
  ]);
  console.log(`  ✓ Created ${categories.length} categories`);

  // Seed Urgency Levels
  console.log('Creating urgency levels...');
  const urgencyLevels = await Promise.all([
    prisma.urgencyLevel.upsert({
      where: { name: 'low' },
      update: {},
      create: { name: 'low', description: 'Low priority', priority_score: 1, color_code: '#22C55E' }
    }),
    prisma.urgencyLevel.upsert({
      where: { name: 'medium' },
      update: {},
      create: { name: 'medium', description: 'Medium priority', priority_score: 2, color_code: '#F59E0B' }
    }),
    prisma.urgencyLevel.upsert({
      where: { name: 'high' },
      update: {},
      create: { name: 'high', description: 'High priority', priority_score: 3, color_code: '#EF4444' }
    }),
    prisma.urgencyLevel.upsert({
      where: { name: 'critical' },
      update: {},
      create: { name: 'critical', description: 'Critical - Immediate action needed', priority_score: 4, color_code: '#DC2626' }
    })
  ]);
  console.log(`  ✓ Created ${urgencyLevels.length} urgency levels`);

  // Seed Campaign Statuses
  console.log('Creating campaign statuses...');
  const campaignStatuses = await Promise.all([
    prisma.campaignStatus.upsert({
      where: { name: 'draft' },
      update: {},
      create: { name: 'draft', description: 'Campaign is being prepared', display_order: 1 }
    }),
    prisma.campaignStatus.upsert({
      where: { name: 'active' },
      update: {},
      create: { name: 'active', description: 'Campaign is live and accepting donations', display_order: 2 }
    }),
    prisma.campaignStatus.upsert({
      where: { name: 'paused' },
      update: {},
      create: { name: 'paused', description: 'Campaign is temporarily paused', display_order: 3 }
    }),
    prisma.campaignStatus.upsert({
      where: { name: 'completed' },
      update: {},
      create: { name: 'completed', description: 'Campaign has reached its goal', display_order: 4 }
    }),
    prisma.campaignStatus.upsert({
      where: { name: 'cancelled' },
      update: {},
      create: { name: 'cancelled', description: 'Campaign was cancelled', display_order: 5 }
    })
  ]);
  console.log(`  ✓ Created ${campaignStatuses.length} campaign statuses`);

  // Seed Project Statuses
  console.log('Creating project statuses...');
  const projectStatuses = await Promise.all([
    prisma.projectStatus.upsert({
      where: { name: 'planning' },
      update: {},
      create: { name: 'planning', description: 'Project in planning phase', display_order: 1 }
    }),
    prisma.projectStatus.upsert({
      where: { name: 'in_progress' },
      update: {},
      create: { name: 'in_progress', description: 'Project is in progress', display_order: 2 }
    }),
    prisma.projectStatus.upsert({
      where: { name: 'completed' },
      update: {},
      create: { name: 'completed', description: 'Project completed', display_order: 3 }
    }),
    prisma.projectStatus.upsert({
      where: { name: 'on_hold' },
      update: {},
      create: { name: 'on_hold', description: 'Project is on hold', display_order: 4 }
    })
  ]);
  console.log(`  ✓ Created ${projectStatuses.length} project statuses`);

  // Seed Event Statuses
  console.log('Creating event statuses...');
  const eventStatuses = await Promise.all([
    prisma.eventStatus.upsert({
      where: { name: 'scheduled' },
      update: {},
      create: { name: 'scheduled', description: 'Event is scheduled', display_order: 1 }
    }),
    prisma.eventStatus.upsert({
      where: { name: 'ongoing' },
      update: {},
      create: { name: 'ongoing', description: 'Event is happening now', display_order: 2 }
    }),
    prisma.eventStatus.upsert({
      where: { name: 'completed' },
      update: {},
      create: { name: 'completed', description: 'Event has ended', display_order: 3 }
    }),
    prisma.eventStatus.upsert({
      where: { name: 'cancelled' },
      update: {},
      create: { name: 'cancelled', description: 'Event was cancelled', display_order: 4 }
    })
  ]);
  console.log(`  ✓ Created ${eventStatuses.length} event statuses`);

  // Seed Volunteer Statuses
  console.log('Creating volunteer statuses...');
  const volunteerStatuses = await Promise.all([
    prisma.volunteerStatus.upsert({
      where: { name: 'active' },
      update: {},
      create: { name: 'active', description: 'Active volunteer' }
    }),
    prisma.volunteerStatus.upsert({
      where: { name: 'inactive' },
      update: {},
      create: { name: 'inactive', description: 'Inactive volunteer' }
    }),
    prisma.volunteerStatus.upsert({
      where: { name: 'pending' },
      update: {},
      create: { name: 'pending', description: 'Pending approval' }
    })
  ]);
  console.log(`  ✓ Created ${volunteerStatuses.length} volunteer statuses`);

  // Seed Background Check Statuses
  console.log('Creating background check statuses...');
  const bgCheckStatuses = await Promise.all([
    prisma.backgroundCheckStatus.upsert({
      where: { name: 'pending' },
      update: {},
      create: { name: 'pending', description: 'Background check pending' }
    }),
    prisma.backgroundCheckStatus.upsert({
      where: { name: 'in_progress' },
      update: {},
      create: { name: 'in_progress', description: 'Background check in progress' }
    }),
    prisma.backgroundCheckStatus.upsert({
      where: { name: 'cleared' },
      update: {},
      create: { name: 'cleared', description: 'Background check cleared' }
    }),
    prisma.backgroundCheckStatus.upsert({
      where: { name: 'failed' },
      update: {},
      create: { name: 'failed', description: 'Background check failed' }
    })
  ]);
  console.log(`  ✓ Created ${bgCheckStatuses.length} background check statuses`);

  // Seed Donation Statuses
  console.log('Creating donation statuses...');
  const donationStatuses = await Promise.all([
    prisma.donationStatus.upsert({
      where: { name: 'pending' },
      update: {},
      create: { name: 'pending', description: 'Payment pending' }
    }),
    prisma.donationStatus.upsert({
      where: { name: 'processing' },
      update: {},
      create: { name: 'processing', description: 'Payment processing' }
    }),
    prisma.donationStatus.upsert({
      where: { name: 'completed' },
      update: {},
      create: { name: 'completed', description: 'Payment completed' }
    }),
    prisma.donationStatus.upsert({
      where: { name: 'failed' },
      update: {},
      create: { name: 'failed', description: 'Payment failed' }
    }),
    prisma.donationStatus.upsert({
      where: { name: 'refunded' },
      update: {},
      create: { name: 'refunded', description: 'Payment refunded' }
    })
  ]);
  console.log(`  ✓ Created ${donationStatuses.length} donation statuses`);

  // Seed Payment Methods
  console.log('Creating payment methods...');
  const paymentMethods = await Promise.all([
    prisma.paymentMethod.upsert({
      where: { name: 'credit_card' },
      update: {},
      create: { name: 'credit_card', description: 'Credit/Debit Card' }
    }),
    prisma.paymentMethod.upsert({
      where: { name: 'paypal' },
      update: {},
      create: { name: 'paypal', description: 'PayPal' }
    }),
    prisma.paymentMethod.upsert({
      where: { name: 'bank_transfer' },
      update: {},
      create: { name: 'bank_transfer', description: 'Bank Transfer' }
    }),
    prisma.paymentMethod.upsert({
      where: { name: 'mpesa' },
      update: {},
      create: { name: 'mpesa', description: 'M-Pesa' }
    }),
    prisma.paymentMethod.upsert({
      where: { name: 'cash' },
      update: {},
      create: { name: 'cash', description: 'Cash' }
    })
  ]);
  console.log(`  ✓ Created ${paymentMethods.length} payment methods`);

  // Seed Registration Statuses
  console.log('Creating registration statuses...');
  const registrationStatuses = await Promise.all([
    prisma.registrationStatus.upsert({
      where: { name: 'pending' },
      update: {},
      create: { name: 'pending', description: 'Registration pending', display_order: 1 }
    }),
    prisma.registrationStatus.upsert({
      where: { name: 'confirmed' },
      update: {},
      create: { name: 'confirmed', description: 'Registration confirmed', display_order: 2 }
    }),
    prisma.registrationStatus.upsert({
      where: { name: 'cancelled' },
      update: {},
      create: { name: 'cancelled', description: 'Registration cancelled', display_order: 3 }
    }),
    prisma.registrationStatus.upsert({
      where: { name: 'attended' },
      update: {},
      create: { name: 'attended', description: 'Attended event', display_order: 4 }
    })
  ]);
  console.log(`  ✓ Created ${registrationStatuses.length} registration statuses`);

  // Seed Payment Statuses
  console.log('Creating payment statuses...');
  const paymentStatuses = await Promise.all([
    prisma.paymentStatus.upsert({
      where: { name: 'pending' },
      update: {},
      create: { name: 'pending', description: 'Payment pending', display_order: 1 }
    }),
    prisma.paymentStatus.upsert({
      where: { name: 'paid' },
      update: {},
      create: { name: 'paid', description: 'Payment received', display_order: 2 }
    }),
    prisma.paymentStatus.upsert({
      where: { name: 'refunded' },
      update: {},
      create: { name: 'refunded', description: 'Payment refunded', display_order: 3 }
    })
  ]);
  console.log(`  ✓ Created ${paymentStatuses.length} payment statuses`);

  // Seed Activity Types
  console.log('Creating activity types...');
  const activityTypes = await Promise.all([
    prisma.activityType.upsert({
      where: { name: 'general_volunteer' },
      update: {},
      create: { name: 'general_volunteer', description: 'General volunteering', display_order: 1 }
    }),
    prisma.activityType.upsert({
      where: { name: 'event_support' },
      update: {},
      create: { name: 'event_support', description: 'Event support', display_order: 2 }
    }),
    prisma.activityType.upsert({
      where: { name: 'fundraising' },
      update: {},
      create: { name: 'fundraising', description: 'Fundraising activities', display_order: 3 }
    }),
    prisma.activityType.upsert({
      where: { name: 'community_outreach' },
      update: {},
      create: { name: 'community_outreach', description: 'Community outreach', display_order: 4 }
    }),
    prisma.activityType.upsert({
      where: { name: 'administrative' },
      update: {},
      create: { name: 'administrative', description: 'Administrative work', display_order: 5 }
    })
  ]);
  console.log(`  ✓ Created ${activityTypes.length} activity types`);

  // Seed Skills (VolunteerSkill)
  console.log('Creating skills...');
  const skills = await Promise.all([
    prisma.volunteerSkill.upsert({
      where: { name: 'first_aid' },
      update: {},
      create: { name: 'first_aid', description: 'First Aid certified', category: 'Medical' }
    }),
    prisma.volunteerSkill.upsert({
      where: { name: 'teaching' },
      update: {},
      create: { name: 'teaching', description: 'Teaching experience', category: 'Education' }
    }),
    prisma.volunteerSkill.upsert({
      where: { name: 'event_planning' },
      update: {},
      create: { name: 'event_planning', description: 'Event planning', category: 'Administrative' }
    }),
    prisma.volunteerSkill.upsert({
      where: { name: 'social_media' },
      update: {},
      create: { name: 'social_media', description: 'Social media management', category: 'Marketing' }
    }),
    prisma.volunteerSkill.upsert({
      where: { name: 'driving' },
      update: {},
      create: { name: 'driving', description: 'Valid driver license', category: 'Transportation' }
    }),
    prisma.volunteerSkill.upsert({
      where: { name: 'cooking' },
      update: {},
      create: { name: 'cooking', description: 'Cooking skills', category: 'Food Service' }
    }),
    prisma.volunteerSkill.upsert({
      where: { name: 'photography' },
      update: {},
      create: { name: 'photography', description: 'Photography', category: 'Media' }
    }),
    prisma.volunteerSkill.upsert({
      where: { name: 'translation' },
      update: {},
      create: { name: 'translation', description: 'Translation services', category: 'Language' }
    })
  ]);
  console.log(`  ✓ Created ${skills.length} skills`);

  // Seed Notification Types
  console.log('Creating notification types...');
  const notificationTypes = await Promise.all([
    prisma.notificationType.upsert({
      where: { name: 'donation_received' },
      update: {},
      create: { 
        name: 'donation_received', 
        description: 'Donation received notification',
        template_subject: 'Thank you for your donation!',
        template_body: 'Thank you for your donation of {amount} to {campaign}!'
      }
    }),
    prisma.notificationType.upsert({
      where: { name: 'event_reminder' },
      update: {},
      create: { 
        name: 'event_reminder', 
        description: 'Event reminder',
        template_subject: 'Event Reminder',
        template_body: 'Reminder: {event} is happening on {date}'
      }
    }),
    prisma.notificationType.upsert({
      where: { name: 'campaign_update' },
      update: {},
      create: { 
        name: 'campaign_update', 
        description: 'Campaign progress update',
        template_subject: 'Campaign Update',
        template_body: 'Campaign {campaign} has reached {percentage}% of its goal!'
      }
    }),
    prisma.notificationType.upsert({
      where: { name: 'volunteer_approved' },
      update: {},
      create: { 
        name: 'volunteer_approved', 
        description: 'Volunteer application approved',
        template_subject: 'Volunteer Application Approved',
        template_body: 'Your volunteer application has been approved!'
      }
    })
  ]);
  console.log(`  ✓ Created ${notificationTypes.length} notification types`);

  console.log('\n✅ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
