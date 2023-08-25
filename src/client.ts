import { Prisma, PrismaClient } from '@prisma/client';
import { paginate } from './extensions';

export const db = new PrismaClient({
  log: ['query', 'info', 'error', 'warn'],
}).$extends(paginate);
