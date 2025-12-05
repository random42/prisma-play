import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import cache from './extensions/cache';
import paginate from './extensions/paginate';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set.');
}

const adapter = new PrismaPg({ connectionString: databaseUrl });

export const db = new PrismaClient({
  log: ['query', 'info', 'error', 'warn'],
  adapter,
})
  .$extends(cache())
  .$extends(paginate);
