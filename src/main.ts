import { db } from './client';
import { PrismaClient } from '@prisma/client';
import { json } from './utils';

async function main() {
  // const db = new PrismaClient();
  const data = await db.comment.findPaginated<typeof db.comment>({
    page: 0,
    take: 0,
  });
  console.log(json(data));
  const x = await db.user.upsert({
    where: {
      id: 1,
    },
    create: {
      email: 'asd',
    },
    update: { email: 'asd' },
  });
  console.log(json(x));
}

main().catch(console.error);
