import { config } from 'dotenv';
import path from 'path';
import { defineConfig } from '@prisma/config';

// Load .env.local from the web directory
config({ path: path.resolve(__dirname, '..', '.env.local') });

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});