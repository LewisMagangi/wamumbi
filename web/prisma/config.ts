import { config } from 'dotenv';
import path from 'path';
import { defineConfig, env } from 'prisma/config';

// Load .env.local from the web directory
config({ path: path.resolve(__dirname, '..', '.env.local') });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});