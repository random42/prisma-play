import { db } from './client';

import { PrismaClient } from '@prisma/client';

async function main() {
  // const db = new PrismaClient();
  console.log(await db.user.findPaginated());
}

main().catch(console.error);
