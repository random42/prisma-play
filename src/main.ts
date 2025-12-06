import dotenv from 'dotenv';
import { Prisma } from '@prisma/client';
import { db, rawDb } from './client';
import {
  section,
  subsection,
  printData,
  success,
  info,
  printTable,
  printCount,
} from './utils';

dotenv.config();

/**
 * ═══════════════════════════════════════════════════════════════════
 * PRISMA ORM SHOWCASE - Comprehensive Feature Demonstration
 * ═══════════════════════════════════════════════════════════════════
 *
 * This file demonstrates every major Prisma ORM feature in a tutorial format.
 * Run this file to see Prisma's capabilities with real data.
 */

// ═══════════════════════════════════════════════════════════════════
// SECTION 1: BASIC CRUD OPERATIONS
// ═══════════════════════════════════════════════════════════════════

async function basicCRUD() {
  section(
    'BASIC CRUD OPERATIONS',
    'Create, Read, Update, Delete - The fundamentals'
  );

  // CREATE
  subsection('1.1 - Create a single record');
  const newUser = await db.user.create({
    data: {
      email: 'demo@prisma.io',
      name: 'Demo User',
      bio: 'I love Prisma ORM!',
      role: 'USER',
    },
  });
  printData('Created User', newUser);
  success(`User created with ID: ${newUser.id}`);

  // READ - findMany
  subsection('1.2 - Find many records');
  const users = await db.user.findMany({
    take: 3,
    select: { id: true, name: true, email: true, role: true },
  });
  printTable(users);
  info(`Found ${users.length} users`);

  // READ - findUnique
  subsection('1.3 - Find unique record by ID');
  const user = await db.user.findUnique({
    where: { id: 1 },
    select: { id: true, name: true, email: true, createdAt: true },
  });
  printData('User #1', user);

  // READ - findFirst
  subsection('1.4 - Find first matching record');
  const admin = await db.user.findFirst({
    where: { role: 'ADMIN' },
    select: { id: true, name: true, role: true },
  });
  printData('First Admin', admin);

  // UPDATE
  subsection('1.5 - Update a record');
  const updated = await db.user.update({
    where: { id: newUser.id },
    data: { bio: 'Updated bio - Prisma is awesome!' },
    select: { id: true, name: true, bio: true },
  });
  printData('Updated User', updated);
  success('User updated successfully');

  // DELETE
  subsection('1.6 - Delete a record');
  await db.user.delete({
    where: { id: newUser.id },
  });
  success(`User #${newUser.id} deleted`);

  // UPSERT (Update or Insert)
  subsection('1.7 - Upsert (create if not exists, update if exists)');
  const upserted = await db.user.upsert({
    where: { email: 'upsert@example.com' },
    update: { name: 'Updated Name' },
    create: {
      email: 'upsert@example.com',
      name: 'Upserted User',
      role: 'USER',
    },
  });
  printData('Upserted User', {
    id: upserted.id,
    email: upserted.email,
    name: upserted.name,
  });
}

// ═══════════════════════════════════════════════════════════════════
// SECTION 2: FILTERING & SORTING
// ═══════════════════════════════════════════════════════════════════

async function filteringAndSorting() {
  section(
    'FILTERING & SORTING',
    'Advanced query filtering and result ordering'
  );

  // Simple filters
  subsection('2.1 - Simple equality filters');
  const publishedPosts = await db.post.findMany({
    where: { status: 'PUBLISHED' },
    take: 3,
    select: { id: true, title: true, status: true },
  });
  printTable(publishedPosts);

  // Combining filters with AND
  subsection('2.2 - Combine filters with AND');
  const popularPublished = await db.post.findMany({
    where: {
      AND: [{ status: 'PUBLISHED' }, { viewCount: { gte: 100 } }],
    },
    take: 3,
    select: { id: true, title: true, viewCount: true, status: true },
  });
  printTable(popularPublished);

  // OR operator
  subsection('2.3 - OR operator - Posts that are archived OR have high views');
  const posts = await db.post.findMany({
    where: {
      OR: [{ status: 'ARCHIVED' }, { viewCount: { gte: 2000 } }],
    },
    take: 3,
    select: { id: true, title: true, status: true, viewCount: true },
  });
  printTable(posts);

  // NOT operator
  subsection('2.4 - NOT operator - All non-draft posts');
  const nonDrafts = await db.post.findMany({
    where: {
      NOT: { status: 'DRAFT' },
    },
    take: 3,
    select: { id: true, title: true, status: true },
  });
  printTable(nonDrafts);

  // Text search (contains, startsWith, endsWith)
  subsection('2.5 - Text search with contains (case-insensitive)');
  const searchResults = await db.user.findMany({
    where: {
      name: {
        contains: 'a',
        mode: 'insensitive',
      },
    },
    take: 3,
    select: { id: true, name: true, email: true },
  });
  printTable(searchResults);

  // In operator
  subsection('2.6 - IN operator - Posts with specific statuses');
  const specificPosts = await db.post.findMany({
    where: {
      status: { in: ['PUBLISHED', 'ARCHIVED'] },
    },
    take: 3,
    select: { id: true, title: true, status: true },
  });
  printTable(specificPosts);

  // Null filtering
  subsection('2.7 - Null filtering - Users without bios');
  const noBioUsers = await db.user.findMany({
    where: { bio: null },
    take: 3,
    select: { id: true, name: true, bio: true },
  });
  printTable(noBioUsers);

  // Sorting
  subsection('2.8 - Sorting - Top posts by view count');
  const topPosts = await db.post.findMany({
    orderBy: { viewCount: 'desc' },
    take: 5,
    select: { id: true, title: true, viewCount: true, likeCount: true },
  });
  printTable(topPosts);

  // Multi-field sorting
  subsection('2.9 - Multi-field sorting - Sort by status, then viewCount');
  const sortedPosts = await db.post.findMany({
    orderBy: [{ status: 'asc' }, { viewCount: 'desc' }],
    take: 5,
    select: { id: true, title: true, status: true, viewCount: true },
  });
  printTable(sortedPosts);

  // Full-text search (PostgreSQL preview feature)
  subsection('2.10 - Full-text search (PostgreSQL)');
  try {
    // Search for posts containing specific words
    const searchResults = await db.post.findMany({
      where: {
        OR: [{ title: { search: 'ipsum' } }, { content: { search: 'ipsum' } }],
      },
      take: 3,
      select: { id: true, title: true },
    });
    printTable(searchResults);
    info(`Full-text search uses PostgreSQL's native text search capabilities`);

    // Search with AND operator
    const combinedSearch = await db.post.findMany({
      where: {
        content: { search: 'ipsum & dolor' }, // Both words must be present
      },
      take: 2,
      select: { id: true, title: true },
    });
    info(`Found ${combinedSearch.length} posts with both 'ipsum' AND 'dolor'`);

    // Search with OR operator
    const orSearch = await db.post.findMany({
      where: {
        content: { search: 'ipsum | dolor' }, // Either word can be present
      },
      take: 2,
      select: { id: true, title: true },
    });
    info(`Found ${orSearch.length} posts with either 'ipsum' OR 'dolor'`);
  } catch (error) {
    warn(
      'Full-text search requires the fullTextSearchPostgres preview feature'
    );
  }
}

// ═══════════════════════════════════════════════════════════════════
// SECTION 3: RELATIONS
// ═══════════════════════════════════════════════════════════════════

async function relationQueries() {
  section('RELATION QUERIES', 'Working with related data');

  // Include relations
  subsection('3.1 - Include related data (User with posts)');
  const userWithPosts = await db.user.findFirst({
    where: { posts: { some: {} } },
    include: {
      posts: {
        take: 2,
        select: { id: true, title: true, status: true },
      },
    },
  });
  printData('User with Posts', userWithPosts);

  // Nested relations
  subsection('3.2 - Nested relations (Post with author and comments)');
  const postWithDetails = await db.post.findFirst({
    where: { comments: { some: {} } },
    include: {
      author: {
        select: { id: true, name: true, email: true },
      },
      comments: {
        take: 2,
        select: {
          id: true,
          content: true,
          author: {
            select: { name: true },
          },
        },
      },
    },
  });
  printData('Post with Author and Comments', postWithDetails);

  // Many-to-many relations
  subsection('3.3 - Many-to-many (Post with tags)');
  const postWithTags = await db.post.findFirst({
    where: { tags: { some: {} } },
    include: {
      tags: {
        select: { id: true, name: true, slug: true },
      },
    },
  });
  printData('Post with Tags', postWithTags);

  // Self-relations
  subsection('3.4 - Self-relations (User followers)');
  const userWithFollowers = await db.user.findFirst({
    where: { followers: { some: {} } },
    include: {
      followers: {
        take: 3,
        select: { id: true, name: true },
      },
      following: {
        take: 3,
        select: { id: true, name: true },
      },
    },
  });
  printData('User with Followers/Following', userWithFollowers);

  // Relation filters
  subsection('3.5 - Relation filters (Users with published posts)');
  const usersWithPublishedPosts = await db.user.findMany({
    where: {
      posts: {
        some: {
          status: 'PUBLISHED',
        },
      },
    },
    take: 3,
    select: {
      id: true,
      name: true,
      _count: {
        select: { posts: true },
      },
    },
  });
  printTable(usersWithPublishedPosts);

  // Nested writes - Create with relations
  subsection('3.6 - Nested writes (Create post with tags)');
  const timestamp = Date.now();
  const postWithNestedTags = await db.post.create({
    data: {
      title: `My New Post with Tags ${timestamp}`,
      slug: `my-new-post-${timestamp}`,
      content: 'This post demonstrates nested writes',
      status: 'DRAFT',
      author: {
        connect: { id: 1 },
      },
      tags: {
        connect: [{ id: 1 }, { id: 2 }],
      },
    },
    include: {
      tags: true,
    },
  });
  printData('Created Post with Tags', postWithNestedTags);
  success('Post created with connected tags');
}

// ═══════════════════════════════════════════════════════════════════
// SECTION 4: AGGREGATIONS & GROUPING
// ═══════════════════════════════════════════════════════════════════

async function aggregationsAndGrouping() {
  section('AGGREGATIONS & GROUPING', 'Analyzing data with aggregate functions');

  // Count
  subsection('4.1 - Count records');
  const userCount = await db.user.count();
  const publishedCount = await db.post.count({
    where: { status: 'PUBLISHED' },
  });
  printCount('Total Users', userCount);
  printCount('Published Posts', publishedCount);

  // Aggregate functions
  subsection('4.2 - Aggregate (avg, sum, min, max)');
  const postStats = await db.post.aggregate({
    _avg: { viewCount: true, likeCount: true },
    _sum: { viewCount: true, likeCount: true },
    _min: { viewCount: true },
    _max: { viewCount: true },
  });
  printData('Post Statistics', postStats);

  // Count with select
  subsection('4.3 - Count non-null values');
  const fieldCounts = await db.user.count({
    select: {
      _all: true,
      name: true,
      bio: true,
    },
  });
  printData('Field Counts', fieldCounts);

  // Relation counts
  subsection('4.4 - Relation counts (Users with post counts)');
  const usersWithCounts = await db.user.findMany({
    take: 5,
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          posts: true,
          comments: true,
        },
      },
    },
    orderBy: {
      posts: {
        _count: 'desc',
      },
    },
  });
  printTable(usersWithCounts);

  // GroupBy
  subsection('4.5 - Group by (Posts grouped by status)');
  const postsByStatus = await db.post.groupBy({
    by: ['status'],
    _count: {
      _all: true,
    },
    _avg: {
      viewCount: true,
      likeCount: true,
    },
  });
  printTable(postsByStatus);

  // GroupBy with having
  subsection('4.6 - Group by with HAVING clause');
  const popularAuthors = await db.post.groupBy({
    by: ['authorId'],
    _count: {
      _all: true,
    },
    _sum: {
      viewCount: true,
    },
    having: {
      viewCount: {
        _sum: {
          gt: 1000,
        },
      },
    },
    orderBy: {
      _sum: {
        viewCount: 'desc',
      },
    },
  });
  printTable(popularAuthors);

  // Distinct
  subsection('4.7 - Select distinct values');
  const distinctRoles = await db.user.findMany({
    distinct: ['role'],
    select: { role: true },
  });
  printData('Distinct Roles', distinctRoles);
}

// ═══════════════════════════════════════════════════════════════════
// SECTION 5: PAGINATION
// ═══════════════════════════════════════════════════════════════════

async function paginationExamples() {
  section('PAGINATION', 'Offset and cursor-based pagination');

  // Offset pagination (skip/take)
  subsection('5.1 - Offset pagination (skip/take)');
  const page2 = await db.post.findMany({
    skip: 5,
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true, createdAt: true },
  });
  printTable(page2);
  info('Showing records 6-10');

  // Custom paginate extension
  subsection('5.2 - Custom paginate extension');
  const paginatedUsers = await db.user.paginate({
    page: 1,
    take: 5,
  });
  printData('Paginated Users', {
    page: paginatedUsers.page,
    totalPages: paginatedUsers.totalPages,
    count: paginatedUsers.count,
    results: paginatedUsers.results.length + ' users',
  });

  // Cursor-based pagination
  subsection('5.3 - Cursor-based pagination');
  const firstBatch = await db.post.findMany({
    take: 3,
    orderBy: { id: 'asc' },
    select: { id: true, title: true },
  });
  const lastId = firstBatch[firstBatch.length - 1]?.id;

  const nextBatch = await db.post.findMany({
    take: 3,
    skip: 1, // Skip the cursor itself
    cursor: { id: lastId },
    orderBy: { id: 'asc' },
    select: { id: true, title: true },
  });
  info(`First batch: posts with IDs ${firstBatch.map((p) => p.id).join(', ')}`);
  info(`Next batch: posts with IDs ${nextBatch.map((p) => p.id).join(', ')}`);
}

// ═══════════════════════════════════════════════════════════════════
// SECTION 6: TRANSACTIONS
// ═══════════════════════════════════════════════════════════════════

async function transactionExamples() {
  section('TRANSACTIONS', 'Ensuring data consistency with transactions');

  // Sequential operations transaction
  subsection('6.1 - Sequential operations in transaction');
  const [users, posts, count] = await db.$transaction([
    db.user.findMany({ take: 2 }),
    db.post.findMany({ take: 2 }),
    db.user.count(),
  ]);
  info(
    `Transaction returned ${users.length} users, ${posts.length} posts, and count of ${count}`
  );

  // Interactive transaction
  subsection('6.2 - Interactive transaction (transfer reputation)');
  try {
    await db.$transaction(async (tx) => {
      // Deduct reputation from one user
      const sender = await tx.user.update({
        where: { id: 1 },
        data: {
          reputation: {
            decrement: 10,
          },
        },
      });

      // Verify sender has enough reputation
      if (sender.reputation < 0) {
        throw new Error('Insufficient reputation');
      }

      // Add reputation to another user
      await tx.user.update({
        where: { id: 2 },
        data: {
          reputation: {
            increment: 10,
          },
        },
      });

      info('Reputation transferred successfully');
    });
    success('Interactive transaction completed');
  } catch (error: any) {
    info(`Transaction rolled back: ${error.message}`);
  }

  // Batch operations
  subsection('6.3 - Batch operations (createMany, updateMany, deleteMany)');

  // Create many
  const created = await db.tag.createMany({
    data: [
      { name: 'BatchTag1', slug: `batch-tag-1-${Date.now()}`, creatorId: 1 },
      { name: 'BatchTag2', slug: `batch-tag-2-${Date.now()}`, creatorId: 1 },
    ],
    skipDuplicates: true,
  });
  success(`Created ${created.count} tags via createMany`);

  // Update many
  const updated = await db.post.updateMany({
    where: {
      viewCount: { lt: 10 },
      status: 'DRAFT',
    },
    data: {
      viewCount: 10,
    },
  });
  success(`Updated ${updated.count} posts via updateMany`);

  // Delete many
  const deleted = await db.tag.deleteMany({
    where: {
      name: {
        startsWith: 'BatchTag',
      },
    },
  });
  success(`Deleted ${deleted.count} tags via deleteMany`);
}

// ═══════════════════════════════════════════════════════════════════
// SECTION 7: RAW SQL & ADVANCED QUERIES
// ═══════════════════════════════════════════════════════════════════

async function rawSQLExamples() {
  section('RAW SQL & ADVANCED QUERIES', 'When you need more control');

  // Use rawDb for raw SQL queries (extensions can interfere with these)
  // $queryRaw
  subsection('7.1 - $queryRaw (SELECT query)');
  const users = await rawDb.$queryRaw<
    Array<{ id: number; name: string; email: string }>
  >`
    SELECT id, name, email
    FROM "User"
    WHERE "role" = 'USER'
    LIMIT 3
  `;
  printTable(users);

  // $queryRaw with parameters
  subsection('7.2 - $queryRaw with parameters (SQL injection safe)');
  const minViews = 100;
  const posts = await rawDb.$queryRaw<
    Array<{ id: number; title: string; viewCount: number }>
  >`
    SELECT id, title, "viewCount"
    FROM "Post"
    WHERE "viewCount" > ${minViews}
    ORDER BY "viewCount" DESC
    LIMIT 3
  `;
  printTable(posts);

  // $executeRaw
  subsection('7.3 - $executeRaw (UPDATE query)');
  const affected = await rawDb.$executeRaw`
    UPDATE "User"
    SET "profileViews" = "profileViews" + 1
    WHERE "id" = 1
  `;
  success(`Updated ${affected} record(s)`);

  // $queryRawUnsafe (use with caution!)
  subsection('7.4 - $queryRawUnsafe (dynamic table/column names)');
  const tableName = 'User';
  const results = await rawDb.$queryRawUnsafe(
    `SELECT COUNT(*) as count FROM "${tableName}"`
  );
  printData('Raw count', results);
  info('⚠️  Use queryRawUnsafe carefully - vulnerable to SQL injection!');
}

// ═══════════════════════════════════════════════════════════════════
// SECTION 8: CLIENT EXTENSIONS
// ═══════════════════════════════════════════════════════════════════

async function clientExtensionsDemo() {
  section(
    'CLIENT EXTENSIONS',
    'Extending Prisma Client with custom functionality'
  );

  // Computed fields extension
  subsection('8.1 - Computed fields (virtual fields)');
  const user = await db.user.findFirst({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      displayName: true, // Computed field
      isAdmin: true, // Computed field
      accountAge: true, // Computed field
    },
  });
  printData('User with Computed Fields', user);
  info(`displayName: ${user?.displayName} (computed from name or email)`);
  info(`isAdmin: ${user?.isAdmin} (computed from role)`);
  info(`accountAge: ${user?.accountAge} days (computed from createdAt)`);

  // Post computed fields
  const post = await db.post.findFirst({
    where: { content: { not: null } },
    select: {
      id: true,
      title: true,
      status: true,
      viewCount: true,
      likeCount: true,
      isPublished: true, // Computed
      excerpt: true, // Computed
      engagementScore: true, // Computed
    },
  });
  printData('Post with Computed Fields', post);

  // Cache extension
  subsection('8.2 - Cache extension (optional caching)');
  const cachedUsers = await db.user.findMany({
    take: 3,
    cache: true, // Custom cache parameter
  });
  info(`Fetched ${cachedUsers.length} users (with caching enabled)`);

  // Pagination extension
  subsection('8.3 - Pagination extension (already shown in section 5)');
  info('See section 5.2 for paginate() extension example');

  // Slug extension
  subsection('8.4 - Slug extension (auto-generate slugs)');
  const slugTimestamp = Date.now();
  const newPost = await db.post.create({
    data: {
      title: `This Title Will Auto-Generate a Slug ${slugTimestamp}`,
      content: 'The slug extension automatically creates URL-friendly slugs',
      status: 'DRAFT',
      authorId: 1,
      // Note: slug is NOT provided - extension generates it
    },
    select: { id: true, title: true, slug: true },
  });
  printData('Post with Auto-Generated Slug', newPost);
  success(`Slug automatically generated: ${newPost.slug}`);

  // Soft delete extension
  subsection('8.5 - Soft delete extension');

  // Find a user to soft delete
  const userToDelete = await db.user.findFirst({
    where: { email: 'upsert@example.com' },
  });

  if (userToDelete) {
    // Soft delete a user
    const softDeleted = await db.user.softDelete({ id: userToDelete.id });
    info(`Soft deleted user (deletedAt set to ${softDeleted.deletedAt})`);
  }

  // Find active users only
  const activeUsers = await db.user.findManyActive({
    take: 3,
    select: { id: true, name: true, deletedAt: true },
  });
  info(`Found ${activeUsers.length} active users (where deletedAt is null)`);

  // Query logger extension
  subsection('8.6 - Query logger extension');
  info('All queries in this demo are logged with timing (see console output)');
}

// ═══════════════════════════════════════════════════════════════════
// SECTION 9: ADVANCED PATTERNS & BEST PRACTICES
// ═══════════════════════════════════════════════════════════════════

async function advancedPatterns() {
  section('ADVANCED PATTERNS', 'Best practices and advanced techniques');

  // Type-safe field selection
  subsection('9.1 - Type-safe field selection with Prisma.validator');
  const userSelect = Prisma.validator<Prisma.UserSelect>()({
    id: true,
    name: true,
    email: true,
  });
  const selectedUsers = await db.user.findMany({
    take: 2,
    select: userSelect,
  });
  printTable(selectedUsers);
  info('Using Prisma.validator ensures type safety for reusable queries');

  // Conditional includes
  subsection('9.2 - Conditional includes/selects');
  const includePosts = true;
  const user = await db.user.findFirst({
    include: {
      posts: includePosts
        ? {
            take: 2,
            select: { id: true, title: true },
          }
        : false,
    },
  });
  info(`Conditionally included posts: ${includePosts}`);

  // JSON field queries
  subsection('9.3 - JSON field operations');
  const usersWithMetadata = await db.user.findMany({
    where: {
      metadata: {
        path: ['location'],
        not: Prisma.AnyNull,
      },
    },
    take: 3,
    select: {
      id: true,
      name: true,
      metadata: true,
    },
  });
  printTable(usersWithMetadata);
  info('Filtered users by JSON field property');

  // Composite unique constraints
  subsection('9.4 - Composite unique constraint (authorId + title)');
  info('Schema has @@unique([authorId, title]) on Post model');
  info(
    'This prevents the same author from creating posts with duplicate titles'
  );

  // Optimistic concurrency control pattern
  subsection('9.5 - Update with concurrent modification check');
  const userToUpdate = await db.user.findFirst();
  if (userToUpdate) {
    const currentViews = userToUpdate.profileViews;

    // Update only if profileViews hasn't changed
    const updated = await db.user.updateMany({
      where: {
        id: userToUpdate.id,
        profileViews: currentViews, // Check current value hasn't changed
      },
      data: {
        profileViews: { increment: 1 },
      },
    });

    if (updated.count === 0) {
      info('Update skipped - record was modified concurrently');
    } else {
      success('Optimistic concurrency control: Update succeeded');
    }
  }

  // Hierarchical data (self-relations)
  subsection('9.6 - Hierarchical data (Category tree)');
  const rootCategories = await db.category.findMany({
    where: { parentId: null },
    include: {
      children: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
    take: 2,
  });
  printData('Category Hierarchy', rootCategories);

  // Omit fields (exclude sensitive data)
  subsection('9.7 - Omit fields (exclude sensitive data)');
  // Local omit - exclude metadata from this query only
  const userWithoutMetadata = await db.user.findFirst({
    omit: {
      metadata: true,
      deletedAt: true,
    },
  });
  info('User without metadata and deletedAt fields (using local omit)');
  if (userWithoutMetadata) {
    info(`Fields returned: ${Object.keys(userWithoutMetadata).join(', ')}`);
  }

  // You can also omit multiple fields to reduce payload size
  const postWithLimitedFields = await db.post.findFirst({
    where: { content: { not: null } },
    omit: {
      content: true, // Large text field
      metadata: true,
    },
  });
  info('Post without content and metadata (reduces payload size)');
  if (postWithLimitedFields) {
    info(`Post ID ${postWithLimitedFields.id}: ${postWithLimitedFields.title}`);
  }
}

// ═══════════════════════════════════════════════════════════════════
// SECTION 10: PERFORMANCE & OPTIMIZATION
// ═══════════════════════════════════════════════════════════════════

async function performanceOptimization() {
  section('PERFORMANCE & OPTIMIZATION', 'Making your queries fast');

  // Select only needed fields
  subsection('10.1 - Select only needed fields (reduces data transfer)');
  const start1 = performance.now();
  const allFields = await db.post.findMany({ take: 10 });
  const time1 = performance.now() - start1;

  const start2 = performance.now();
  const selectedFields = await db.post.findMany({
    take: 10,
    select: { id: true, title: true, viewCount: true },
  });
  const time2 = performance.now() - start2;

  info(`All fields: ${time1.toFixed(2)}ms`);
  info(`Selected fields: ${time2.toFixed(2)}ms`);
  info(`Difference: ${(time1 - time2).toFixed(2)}ms faster with select`);

  // Batching vs N+1 queries
  subsection('10.2 - Avoid N+1 queries (use include/select)');
  info('❌ BAD: Fetching posts then querying author for each post');
  info('✅ GOOD: Use include to fetch posts with authors in one query');

  const postsWithAuthors = await db.post.findMany({
    take: 5,
    include: {
      author: {
        select: { id: true, name: true },
      },
    },
  });
  success(
    `Fetched ${postsWithAuthors.length} posts with authors in a single query`
  );

  // Using indexes
  subsection('10.3 - Index usage');
  info('Schema includes indexes on frequently queried fields:');
  info('  - User: email, role, createdAt');
  info('  - Post: status, authorId, slug, createdAt');
  info('  - Comment: postId, authorId, createdAt');
  info('Indexes speed up WHERE, ORDER BY, and JOIN operations');

  // Connection pooling
  subsection('10.4 - Connection pooling');
  info('Using @prisma/adapter-pg for PostgreSQL connection pooling');
  info('Multiple Prisma Client instances share the same connection pool');

  // Count performance
  subsection('10.5 - Efficient counting');
  const countStart = performance.now();
  const count = await db.post.count({
    where: { status: 'PUBLISHED' },
  });
  const countTime = performance.now() - countStart;
  info(`Counted ${count} published posts in ${countTime.toFixed(2)}ms`);
  info('count() is more efficient than findMany().length');
}

// ═══════════════════════════════════════════════════════════════════
// MAIN EXECUTION
// ═══════════════════════════════════════════════════════════════════

async function main(): Promise<void> {
  console.log('\n');
  console.log('╔' + '═'.repeat(78) + '╗');
  console.log('║' + ' '.repeat(78) + '║');
  console.log('║' + '     🚀 PRISMA ORM COMPLETE SHOWCASE'.padEnd(79) + '║');
  console.log(
    '║' +
      '     Demonstrating every major feature with real examples'.padEnd(79) +
      '║'
  );
  console.log('║' + ' '.repeat(78) + '║');
  console.log('╚' + '═'.repeat(78) + '╝');
  console.log('\n');

  try {
    await basicCRUD();
    await filteringAndSorting();
    await relationQueries();
    await aggregationsAndGrouping();
    await paginationExamples();
    await transactionExamples();
    await rawSQLExamples();
    await clientExtensionsDemo();
    await advancedPatterns();
    await performanceOptimization();

    console.log('\n');
    section(
      '🎉 SHOWCASE COMPLETE!',
      "You just witnessed Prisma ORM's full power"
    );
    success('All features demonstrated successfully');
    info('Check out the code in src/main.ts to see how everything works');
    console.log('\n');
  } catch (error) {
    console.error('\n❌ Error during showcase:', error);
    throw error;
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
