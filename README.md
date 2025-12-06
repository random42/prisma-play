# Prisma ORM Complete Showcase

A comprehensive demonstration of Prisma ORM v7's features, including advanced patterns, custom client extensions, and best practices. This is a learning resource and experimental playground for Prisma developers.

## 🎯 What This Project Demonstrates

This project showcases **every major Prisma v7 feature** documented at [prisma.io/docs](https://www.prisma.io/docs/orm) in a working, executable format:

### 1. **Basic CRUD Operations** (Section 1)
- Create, Read, Update, Delete operations
- `findMany`, `findUnique`, `findFirst`
- `upsert` for conditional create/update

### 2. **Filtering & Sorting** (Section 2)
- Logical operators: AND, OR, NOT
- Text search with case-insensitive `contains`
- IN operator for multiple values
- Null filtering
- Single and multi-field sorting
- **Full-text search** (PostgreSQL preview feature) with AND/OR operators

### 3. **Relation Queries** (Section 3)
- Including related data with `include`
- Nested relations (3+ levels deep)
- Many-to-many relationships
- Self-relations (followers/following)
- Relation filters
- Nested writes with `connect`

### 4. **Aggregations & Grouping** (Section 4)
- Counting records
- Aggregate functions: `_avg`, `_sum`, `_min`, `_max`
- Relation counts with `_count`
- `groupBy` with `having` clauses
- `distinct` for unique values

### 5. **Pagination** (Section 5)
- Offset pagination (skip/take)
- Custom pagination extension
- Cursor-based pagination for large datasets

### 6. **Transactions** (Section 6)
- Sequential operations in transactions
- Interactive transactions with rollback
- Batch operations: `createMany`, `updateMany`, `deleteMany`

### 7. **Raw SQL** (Section 7)
- `$queryRaw` for SELECT queries
- Parameterized queries (SQL injection safe)
- `$executeRaw` for UPDATE/INSERT/DELETE
- `$queryRawUnsafe` for dynamic table/column names

### 8. **Client Extensions** (Section 8)
- **Cache Extension**: Optional query caching
- **Paginate Extension**: Custom pagination method
- **Soft Delete Extension**: Logical deletion pattern
- **Computed Fields Extension**: Virtual fields
- **Slug Extension**: Auto-generate URL slugs
- **Query Logger Extension**: Log all queries with timing

### 9. **Advanced Patterns** (Section 9)
- Type-safe queries with `Prisma.validator`
- Conditional includes/selects
- JSON field operations
- Composite unique constraints
- Optimistic concurrency control
- Hierarchical data (tree structures)
- **Field omission** with `omit` option (exclude sensitive data)

### 10. **Performance & Optimization** (Section 10)
- Field selection for reduced data transfer
- Avoiding N+1 queries
- Index usage and query optimization
- Connection pooling with `@prisma/adapter-pg`
- Efficient counting

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Docker and Docker Compose (for PostgreSQL)

### Setup

1. **Clone and install dependencies**:
   ```bash
   npm install
   ```

2. **Start PostgreSQL database**:
   ```bash
   docker-compose up -d
   ```

3. **Sync database schema** (no migrations, using db push):
   ```bash
   npm run sync
   ```

4. **Seed with fake data** (10 users, 50 posts, 200 comments, etc.):
   ```bash
   npm run seed
   ```

5. **Run the showcase**:
   ```bash
   npm run dev
   ```

   This runs `main.ts` in watch mode with source maps and remote debugging enabled.

## 📊 Database Seed Data

After running `npm run seed`, you'll have:
- **20 users**: Mix of USER, ADMIN, MODERATOR roles
- **60 posts**: Across DRAFT, PUBLISHED, ARCHIVED statuses
- **200 comments**: Including threaded replies
- **15 tags**: Connected to posts via many-to-many
- **10 categories**: In 2-level hierarchy (5 root + 5 children)
- **Follower relationships**: Realistic social connections

All data is generated with faker.js for realistic names, emails, content, etc.

## 🔧 Available Scripts

```bash
npm run dev          # Run showcase in watch mode with debugging
npm run sync         # Push schema changes to DB (no migrations)
npm run seed         # Populate database with fake data
npm run studio       # Open Prisma Studio (database GUI)
npm run check        # Lint with Biome
npm run fix          # Auto-fix linting issues
```
