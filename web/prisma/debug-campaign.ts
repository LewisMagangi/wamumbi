import { config } from 'dotenv';
// Load from .env.local first
const result = config({ path: '.env.local' });
console.log('Dotenv loaded:', result.parsed ? 'yes' : 'no');

import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';
import { PrismaClient } from '../src/generated/prisma';

neonConfig.webSocketConstructor = ws;

const connectionString = result.parsed?.DATABASE_URL || process.env.DATABASE_URL;
console.log('Connection string prefix:', connectionString?.substring(0, 30) + '...');

if (!connectionString) {
  console.error('DATABASE_URL not found!');
  process.exit(1);
}

// Use the same pattern as src/lib/prisma.ts - pass object with connectionString
const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Checking campaign with ID 1...\n');
  
  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id: 1 },
      include: {
        category: true,
        status: true,
        urgency_level: true,
        currency: true,
        statistics: true,
        donations: {
          include: {
            donor: true,
            status: true
          }
        }
      }
    });

    if (!campaign) {
      console.log('❌ Campaign with ID 1 not found!');
      
      // List all campaigns
      const allCampaigns = await prisma.campaign.findMany({
        select: { id: true, title: true }
      });
      console.log('\nAll campaigns in database:', allCampaigns);
      return;
    }

    console.log('✅ Campaign found:');
    console.log('  ID:', campaign.id);
    console.log('  Title:', campaign.title);
    console.log('  Category:', campaign.category?.name || 'NULL - MISSING!');
    console.log('  Status:', campaign.status?.name || 'NULL - MISSING!');
    console.log('  Urgency Level:', campaign.urgency_level?.name || 'NULL - MISSING!');
    console.log('  Currency:', campaign.currency?.code || 'NULL - MISSING!');
    console.log('  Statistics:', campaign.statistics ? 'Present' : 'NULL - MISSING!');
    console.log('  Donations count:', campaign.donations?.length || 0);
    
    // Check for any null relations that could cause issues
    if (!campaign.category) console.log('\n⚠️ WARNING: category relation is null!');
    if (!campaign.status) console.log('\n⚠️ WARNING: status relation is null!');
    if (!campaign.urgency_level) console.log('\n⚠️ WARNING: urgency_level relation is null!');
    if (!campaign.currency) console.log('\n⚠️ WARNING: currency relation is null!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
