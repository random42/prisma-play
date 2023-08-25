import dotenv from 'dotenv';
import { db } from './client';
dotenv.config();

const json = (x) => console.log(JSON.stringify(x, null, 2));

async function main() {
  // const db = new PrismaClient();
  let data;
  data = {};
  data = {};
  data = await db.comment.paginate({
    page: 0,
    take: 1,
    select: {
      id: true,
      author: {
        select: {
          id: true,
          posts: {
            select: {
              id: true,
            },
            where: {
              authorId: {
                lt: db.post.fields.id,
              },
            },
          },
        },
      },
    },
    orderBy: {
      id: 'desc',
    },
    cursor: {
      id: 1,
    },
  });
  return data;
}

main().then(json).catch(console.error);
