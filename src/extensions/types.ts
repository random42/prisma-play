import { Prisma, PrismaClient } from '@prisma/client';

export type Extension = Parameters<PrismaClient['$extends']>[0];
