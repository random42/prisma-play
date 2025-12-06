import { Prisma } from '@prisma/client';

/**
 * Computed Fields Extension
 * Adds virtual fields to models that are computed from existing data
 */
export default Prisma.defineExtension({
  name: 'computedFields',
  result: {
    user: {
      displayName: {
        needs: { name: true, email: true },
        compute(user) {
          return user.name || user.email.split('@')[0];
        },
      },
      isAdmin: {
        needs: { role: true },
        compute(user) {
          return user.role === 'ADMIN';
        },
      },
      accountAge: {
        needs: { createdAt: true },
        compute(user) {
          const now = new Date();
          const created = new Date(user.createdAt);
          const diffTime = Math.abs(now.getTime() - created.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays;
        },
      },
    },
    post: {
      isPublished: {
        needs: { status: true },
        compute(post) {
          return post.status === 'PUBLISHED';
        },
      },
      excerpt: {
        needs: { content: true },
        compute(post) {
          if (!post.content) return '';
          return post.content.length > 100
            ? post.content.substring(0, 100) + '...'
            : post.content;
        },
      },
      engagementScore: {
        needs: { viewCount: true, likeCount: true },
        compute(post) {
          return post.viewCount * 0.1 + post.likeCount * 2;
        },
      },
    },
  },
});
