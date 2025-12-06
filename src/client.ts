import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import cache from './extensions/cache';
import paginate from './extensions/paginate';
import softDelete from './extensions/softDelete';
import computedFields from './extensions/computedFields';
import slug from './extensions/slug';
import queryLogger from './extensions/queryLogger';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set.');
}

const adapter = new PrismaPg({ connectionString: databaseUrl });

// Basic client without extensions for certain operations
export const rawDb = new PrismaClient({ adapter });

// Extended client with all extensions
export const db = new PrismaClient({
  log: ['error', 'warn'], // Reduced logging since queryLogger extension handles it
  adapter,
})
  .$extends(cache())
  .$extends(paginate)
  .$extends(softDelete)
  .$extends(computedFields)
  .$extends(slug)
  .$extends(queryLogger);
