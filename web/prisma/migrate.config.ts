import { config } from 'dotenv';
import path from 'path';
import { defineConfig } from 'prisma/config';

// Config for `prisma migrate` (Prisma 7 needs the URL here).
// Uses Neon's direct (non-pooled) host, which migrations require.
config({ path: path.resolve(__dirname, '..', '.env.local') });

const pooled = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL || '';
const direct = pooled.replace('-pooler.', '.');

export default defineConfig({
  schema: path.resolve(__dirname, 'schema.prisma'),
  migrations: { path: path.resolve(__dirname, 'migrations') },
  datasource: { url: direct },
});
