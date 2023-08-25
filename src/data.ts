import { faker } from '@faker-js/faker';
import { db } from './client';

export function generate() {
  const USERS = 10;
  const POSTS = 50;
  const COMMENTS = 300;
  const users = new Array(USERS).fill({}).map((x, i) => ({
    id: i + 1,
    email: faker.helpers.unique(faker.internet.email),
    name: faker.internet.userName(),
  }));
  const posts = new Array(POSTS).fill({}).map((x, i) => ({
    id: i + 1,
    title: faker.word.noun(2),
    content: faker.lorem.paragraph(2),
    published: faker.datatype.boolean(),
    authorId: faker.datatype.number({
      min: 1,
      max: USERS - 1,
    }),
  }));
  const comments = new Array(COMMENTS).fill({}).map((x, i) => ({
    id: i + 1,
    content: faker.lorem.paragraph(2),
    authorId: faker.datatype.number({
      min: 1,
      max: USERS - 1,
    }),
    postId: faker.datatype.number({
      min: 1,
      max: POSTS - 1,
    }),
  }));
  return {
    users,
    posts,
    comments,
  };
}

export async function genAndInsert() {
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
  genAndInsert().catch(console.error);
}
