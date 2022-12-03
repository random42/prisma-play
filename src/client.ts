import { Prisma, PrismaClient } from '@prisma/client';
import { paginated } from './extensions';

export const db = new PrismaClient().$extends(paginated);
