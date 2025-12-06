import { Prisma } from '@prisma/client';

/**
 * Query Logger Extension
 * Logs all queries with timing information
 */
export default Prisma.defineExtension({
  name: 'queryLogger',
  query: {
    async $allOperations({ operation, model, args, query }) {
      const start = performance.now();
      const result = await query(args);
      const end = performance.now();
      const duration = (end - start).toFixed(2);

      console.log(
        `[Query] ${model}.${operation} - ${duration}ms ${
          args ? `- ${JSON.stringify(args).substring(0, 100)}` : ''
        }`
      );

      return result;
    },
  },
});
