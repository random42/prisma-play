import { faker } from '@faker-js/faker';
import { Prisma } from '@prisma/client';
import { db } from './client';

const USERS = 10;
const POSTS = 50;
const COMMENTS = 300;

type SeedData = {
  users: Prisma.UserCreateManyInput[];
  posts: Prisma.PostCreateManyInput[];
  comments: Prisma.CommentCreateManyInput[];
};

export function generate(): SeedData {
  const users = Array.from({ length: USERS }, (_, i) => ({
    id: i + 1,
    email: `${faker.internet.email().split('@')[0]}+${i}@example.com`,
    name: faker.internet.username(),
  }));

  const posts = Array.from({ length: POSTS }, (_, i) => ({
    id: i + 1,
    title: faker.lorem.words(3),
    content: faker.lorem.paragraph({ min: 1, max: 2 }),
    published: faker.helpers.arrayElement([true, false]),
    authorId: faker.number.int({ min: 1, max: USERS }),
  }));

  const comments = Array.from({ length: COMMENTS }, (_, i) => ({
    id: i + 1,
    content: faker.lorem.paragraph({ min: 1, max: 2 }),
    authorId: faker.number.int({ min: 1, max: USERS }),
    postId: faker.number.int({ min: 1, max: POSTS }),
  }));

  return {
    users,
    posts,
    comments,
  };
}

export async function genAndInsert(): Promise<void> {
  const data = generate();
  await db.user.createMany({
    data: data.users,
  });
  await db.post.createMany({
    data: data.posts,
  });
  await db.comment.createMany({
    data: data.comments,
  });
}

if (require.main === module) {
  genAndInsert().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
