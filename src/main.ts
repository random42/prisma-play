// import { db } from './client';

import { PrismaClient } from '@prisma/client';

async function main() {
  const db = new PrismaClient();
  db.user.findPaginated();
  console.log('Hello world!');
}

main().catch(console.error);
