import { faker } from '@faker-js/faker';
import type { Prisma } from '@prisma/client';
import { rawDb } from './client'; // Use rawDb to bypass extensions for seeding

const USERS = 20;
const POSTS = 60;
const COMMENTS = 200;
const TAGS = 15;
const CATEGORIES = 10;

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function genAndInsert(): Promise<void> {
  console.log('🌱 Seeding database...');

  // 1. Create users with various roles
  console.log('Creating users...');
  const users = await Promise.all(
    Array.from({ length: USERS }, async (_, i) => {
      const name = faker.person.fullName();
      const email = `${faker.internet.email().split('@')[0]}+${i}@example.com`;
      const role = i === 0 ? 'ADMIN' : i < 3 ? 'MODERATOR' : 'USER';

      const hasWebsite = faker.datatype.boolean();
      const hasBio = faker.datatype.boolean({ probability: 0.7 });

      return rawDb.user.create({
        data: {
          email,
          name,
          ...(hasBio && { bio: faker.person.bio() }),
          role,
          profileViews: faker.number.int({ min: 0, max: 1000 }),
          reputation: faker.number.int({ min: 0, max: 500 }),
          metadata: {
            location: faker.location.city(),
            ...(hasWebsite && {
              website: faker.internet.url(),
            }),
            social: {
              twitter: faker.internet.username(),
              github: faker.internet.username(),
            },
          },
        },
      });
    })
  );

  // 2. Create profiles for some users (demonstrating view data)
  console.log('Creating profiles...');
  await Promise.all(
    users.slice(0, Math.floor(USERS / 2)).map(async (user) => {
      const hasWebsite = faker.datatype.boolean();

      return rawDb.profile.create({
        data: {
          userId: user.id,
          bio: faker.person.bio(),
          avatarUrl: faker.image.avatar(),
          ...(hasWebsite && { website: faker.internet.url() }),
          location: faker.location.city(),
        },
      });
    })
  );

  // 3. Create categories with hierarchy
  console.log('Creating categories...');
  const rootCategories = await Promise.all(
    Array.from({ length: 5 }, async (_, i) => {
      const name = faker.commerce.department();
      return rawDb.category.create({
        data: {
          name,
          slug: generateSlug(name) + `-${i}`,
          description: faker.commerce.productDescription(),
        },
      });
    })
  );

  // Create child categories
  await Promise.all(
    Array.from({ length: CATEGORIES - 5 }, async (_, i) => {
      const name = faker.commerce.department();
      return rawDb.category.create({
        data: {
          name,
          slug: generateSlug(name) + `-child-${i}`,
          description: faker.commerce.productDescription(),
          parentId: faker.helpers.arrayElement(rootCategories).id,
        },
      });
    })
  );

  // 4. Create tags
  console.log('Creating tags...');
  const tags = await Promise.all(
    Array.from({ length: TAGS }, async () => {
      const name = faker.helpers.arrayElement([
        'JavaScript',
        'TypeScript',
        'React',
        'Node.js',
        'PostgreSQL',
        'Prisma',
        'Testing',
        'DevOps',
        'Security',
        'Performance',
        'Architecture',
        'Best Practices',
        'Tutorial',
        'Guide',
        'Tips',
      ]);
      return rawDb.tag.create({
        data: {
          name: `${name}-${faker.string.alphanumeric(4)}`,
          slug: generateSlug(name + faker.string.alphanumeric(4)),
          creatorId: faker.helpers.arrayElement(users).id,
        },
      });
    })
  );

  // 5. Create posts with various statuses
  console.log('Creating posts...');
  const posts = await Promise.all(
    Array.from({ length: POSTS }, async (_, i) => {
      const title = faker.lorem.sentence({ min: 3, max: 8 });
      const status = faker.helpers.arrayElement([
        'DRAFT',
        'PUBLISHED',
        'PUBLISHED',
        'ARCHIVED',
      ]);
      const author = faker.helpers.arrayElement(users);

      return rawDb.post.create({
        data: {
          title,
          slug: generateSlug(title) + `-${i}`,
          content: faker.lorem.paragraphs({ min: 2, max: 5 }),
          status,
          authorId: author.id,
          viewCount:
            status === 'PUBLISHED'
              ? faker.number.int({ min: 0, max: 5000 })
              : 0,
          likeCount:
            status === 'PUBLISHED' ? faker.number.int({ min: 0, max: 500 }) : 0,
          publishedAt: status === 'PUBLISHED' ? faker.date.past() : null,
          metadata: {
            readTime: faker.number.int({ min: 1, max: 20 }),
            featured: faker.datatype.boolean(),
          },
          tags: {
            connect: faker.helpers
              .arrayElements(tags, { min: 1, max: 4 })
              .map((tag) => ({ id: tag.id })),
          },
        },
      });
    })
  );

  // 6. Create comments (including replies)
  console.log('Creating comments...');
  const topLevelComments = await Promise.all(
    Array.from({ length: Math.floor(COMMENTS * 0.7) }, async () => {
      return rawDb.comment.create({
        data: {
          content: faker.lorem.sentences({ min: 1, max: 3 }),
          authorId: faker.helpers.arrayElement(users).id,
          postId: faker.helpers.arrayElement(posts).id,
        },
      });
    })
  );

  // Create comment replies
  await Promise.all(
    Array.from({ length: Math.floor(COMMENTS * 0.3) }, async () => {
      return rawDb.comment.create({
        data: {
          content: faker.lorem.sentences({ min: 1, max: 2 }),
          authorId: faker.helpers.arrayElement(users).id,
          postId: faker.helpers.arrayElement(posts).id,
          parentId: faker.helpers.arrayElement(topLevelComments).id,
        },
      });
    })
  );

  // 6. Create follower relationships
  console.log('Creating user relationships...');
  await Promise.all(
    users.slice(0, 10).map(async (user) => {
      const followCount = faker.number.int({ min: 1, max: 5 });
      const usersToFollow = faker.helpers.arrayElements(
        users.filter((u) => u.id !== user.id),
        followCount
      );

      return rawDb.user.update({
        where: { id: user.id },
        data: {
          following: {
            connect: usersToFollow.map((u) => ({ id: u.id })),
          },
        },
      });
    })
  );

  console.log('✅ Seeding completed!');
  console.log(`Created ${users.length} users`);
  console.log(`Created ${posts.length} posts`);
  console.log(`Created ${COMMENTS} comments`);
  console.log(`Created ${tags.length} tags`);
}

if (require.main === module) {
  genAndInsert()
    .catch((err) => {
      console.error(err);
      process.exit(1);
    })
    .finally(() => {
      rawDb.$disconnect();
    });
}
