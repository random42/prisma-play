import { Prisma, PrismaClient } from '@prisma/client';
import cache from './extensions/cache';
import paginate from './extensions/paginate';

export const db = new PrismaClient({
  log: ['query', 'info', 'error', 'warn'],
})
  .$extends(cache())
  .$extends(paginate);
