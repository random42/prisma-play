# Copilot Instructions for prisma-play

**IMPORTANT**: update this file (`.github/copilot-instructions.md`) when needed.

## Project Overview
This is a **comprehensive Prisma ORM showcase** demonstrating every major Prisma v7 feature including advanced patterns, custom client extensions, and best practices. The project serves as both a learning resource and experimental playground. The codebase uses Prisma with PostgreSQL 17 via the `@prisma/adapter-pg` driver adapter.

## Architecture & Key Patterns

### Prisma Client Extensions (Core Feature)
The project showcases **6 custom client extensions** in `src/extensions/`:

- **Cache Extension** (`src/extensions/cache.ts`): Adds an optional `cache` parameter to all model operations. Uses `defineExtension` with `$allOperations` query hook. The extension strips `cache` args before passing to actual query using `lodash/omit`.
  
- **Paginate Extension** (`src/extensions/paginate.ts`): Adds a `paginate()` method to all models. Takes `{ page, take }` instead of `skip`. Returns structured result: `{ page, totalPages, count, results }`. Uses `Prisma.getExtensionContext()` to access the underlying model context.

- **Soft Delete Extension** (`src/extensions/softDelete.ts`): Implements soft delete pattern with `softDelete()`, `findManyActive()`, and `restore()` methods. Sets/clears `deletedAt` timestamp instead of hard deleting records.

- **Computed Fields Extension** (`src/extensions/computedFields.ts`): Adds virtual fields to models using `$extends({ result })`. User gets `displayName`, `isAdmin`, `accountAge`. Post gets `isPublished`, `excerpt`, `engagementScore`.

- **Slug Extension** (`src/extensions/slug.ts`): Auto-generates URL-friendly slugs from titles on create/update operations. Uses `$allOperations` hook to intercept Post, Tag, and Category mutations.

- **Query Logger Extension** (`src/extensions/queryLogger.ts`): Logs all database queries with operation name, execution timing, and arguments. Uses `$allOperations` with `performance.now()`.

**Extension Composition**: Extensions are chained in `src/client.ts`:
```typescript
export const rawDb = new PrismaClient({ adapter }); // No extensions
export const db = rawDb
  .$extends(cache())
  .$extends(paginate)
  .$extends(softDelete)
  .$extends(computedFields)
  .$extends(slug)
  .$extends(queryLogger);
```

### Database Setup
- PostgreSQL 17 via Docker Compose
- Connection via `@prisma/adapter-pg` (not default connection pooling)
- Data persisted in `./var/pg` directory (git-ignored)
- Database URL: `postgresql://pg:pg@localhost:5432/mydb`

### Schema Design
**Enhanced blog schema** in `prisma/schema.prisma`:
- **Models**: User, Post, Comment, Tag, Category (5 models)
- **Enums**: Role (USER, ADMIN, MODERATOR), PostStatus (DRAFT, PUBLISHED, ARCHIVED)
- **User model**: role, bio, JSON metadata, soft delete (deletedAt), self-relations (followers/following), reputation, profileViews
- **Post model**: status enum, slug, view/like counts, timestamps, JSON metadata, composite unique constraint `@@unique([authorId, title])`
- **Comment model**: self-relations for threaded replies (parentId/replies)
- **Tag model**: many-to-many with Post via implicit join table
- **Category model**: hierarchical with parent/child self-relations
- **Indexes**: On email, role, status, slug, createdAt, and foreign keys
- Uses auto-increment integer IDs throughout

## Development Workflows

### Essential Commands
- `npm run dev` - Watch mode with source maps and remote debugging on `0.0.0.0:9229`
- `npm run sync` - Push schema changes to DB (`prisma db push`, no migrations)
- `npm run seed` - Seed database with faker data (20 users, 60 posts, 200 comments, 15 tags, 10 categories)
- `npm run studio` - Open Prisma Studio (database GUI)
- `npm run check` / `npm run fix` - Biome linting/formatting

### Database Workflow
1. Start DB: `docker-compose up -d`
2. Sync schema: `npm run sync`
3. Seed data: `npm run seed`
4. Run showcase: `npm run dev`

**No migrations directory** - this project uses `db push` for schema changes (prototyping workflow).

## Code Conventions

### Module Pattern
- **`src/client.ts`**: Exports both `rawDb` (basic client) and `db` (extended client with all 6 extensions)
- **`src/main.ts`**: Main showcase file with 10 comprehensive sections demonstrating all Prisma features
- **`src/data.ts`**: Comprehensive seed script (both importable module and runnable script)
- **`src/utils.ts`**: Formatting utilities (section, subsection, printData, printTable, success, info, warn, etc.)

### Main Showcase Structure (`src/main.ts`)
The main file demonstrates **10 major feature sections**:
1. Basic CRUD Operations (create, read, update, delete, upsert)
2. Filtering & Sorting (AND/OR/NOT, text search, IN, null filtering, multi-field sort)
3. Relation Queries (include, nested relations, many-to-many, self-relations, nested writes)
4. Aggregations & Grouping (count, aggregate, groupBy with having, distinct)
5. Pagination (offset, custom extension, cursor-based)
6. Transactions (sequential, interactive, batch operations)
7. Raw SQL ($queryRaw, $executeRaw, $queryRawUnsafe)
8. Client Extensions (demonstrates all 6 custom extensions)
9. Advanced Patterns (Prisma.validator, conditional includes, JSON queries, optimistic concurrency, hierarchical data)
10. Performance & Optimization (field selection, N+1 avoidance, indexes, connection pooling, efficient counting)

## Development Notes

- **tsx** is used for TypeScript execution (not ts-node)
- Remote debugging pre-configured for Docker/VS Code on port 9229
- `dotenv` loaded via `dotenv/config` import at top of files
- Project uses `@prisma/config` for centralized Prisma configuration (`prisma.config.ts`)
- No test suite yet (`test` script is placeholder)
- **Important**: Use `rawDb` (not `db`) for raw SQL operations and seeding to avoid extension interference

## When Modifying Extensions

1. Extensions must use `Prisma.defineExtension()` API
2. For model methods, add to `$allModels` object or specific model (e.g., `model.user`)
3. For query hooks, use `$allOperations` or specific operation names
4. For computed fields, use `result` extension type
5. Always use `Prisma.Exact<>` for type-safe args
6. Clean custom args before passing to underlying query (see cache extension pattern)
7. Use `Prisma.getExtensionContext(this)` to access model context in extension methods
8. Query hooks can interfere with raw SQL - use `rawDb` for `$queryRaw`/`$executeRaw`

## Seeding Best Practices

1. Always use `rawDb` (non-extended client) for seeding to avoid extension side effects
2. Use faker.js for realistic test data (names, emails, content, etc.)
3. Handle unique constraints carefully (add random suffixes if needed)
4. Create data in proper dependency order: Users → Posts/Tags/Categories → Comments → Join tables
5. Establish relationships after all records exist (use `connect` in nested writes)
