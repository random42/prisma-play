import { db } from './client';
import { PrismaClient } from '@prisma/client';
import { json } from './utils';

async function main() {
  // const db = new PrismaClient();
  const data = await db.comment.findPaginated({
    page: 2,
    take: 11,
    select: {
      id: true,
      content: true,
      author: {
        select: {
          _count: true,
          email: true,
          posts: {
            select: {
              title: true,
            },
          },
        },
      },
    },
    orderBy: {
      id: 'desc',
    },
  });
}

main().catch(console.error);
