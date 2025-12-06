import { Prisma } from '@prisma/client';

/**
 * Slug Extension
 * Automatically generates URL-friendly slugs from titles
 */
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function generateUniqueSlug(baseSlug: string): string {
  const timestamp = Date.now();
  return `${baseSlug}-${timestamp}`;
}

export default Prisma.defineExtension({
  name: 'slug',
  query: {
    post: {
      async create({ args, query }) {
        // Auto-generate slug from title if not provided
        if (args.data && !args.data.slug) {
          const title = (args.data as any).title;
          if (title) {
            (args.data as any).slug = generateUniqueSlug(generateSlug(title));
          }
        }
        return query(args);
      },
      async update({ args, query }) {
        // Regenerate slug if title is being updated
        if (args.data && (args.data as any).title && !(args.data as any).slug) {
          const title = (args.data as any).title;
          if (typeof title === 'string') {
            (args.data as any).slug = generateUniqueSlug(generateSlug(title));
          }
        }
        return query(args);
      },
    },
    tag: {
      async create({ args, query }) {
        if (args.data && !args.data.slug) {
          const name = (args.data as any).name;
          if (name) {
            (args.data as any).slug = generateSlug(name);
          }
        }
        return query(args);
      },
    },
    category: {
      async create({ args, query }) {
        if (args.data && !args.data.slug) {
          const name = (args.data as any).name;
          if (name) {
            (args.data as any).slug = generateSlug(name);
          }
        }
        return query(args);
      },
    },
  },
});
