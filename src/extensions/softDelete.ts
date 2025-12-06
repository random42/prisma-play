import { Prisma } from '@prisma/client';

/**
 * Soft Delete Extension
 * Automatically filters out soft-deleted records (where deletedAt is not null)
 * and provides a softDelete method instead of hard delete
 */
export default Prisma.defineExtension({
  name: 'softDelete',
  model: {
    user: {
      async softDelete<T>(
        this: T,
        where: Prisma.Args<T, 'update'>['where']
      ): Promise<Prisma.Result<T, { where: typeof where }, 'update'>> {
        const ctx = Prisma.getExtensionContext(this) as any;
        return ctx.update({
          where,
          data: {
            deletedAt: new Date(),
          },
        });
      },
      async findManyActive<T, A>(
        this: T,
        args?: Prisma.Exact<A, Prisma.Args<T, 'findMany'>>
      ): Promise<Prisma.Result<T, A, 'findMany'>> {
        const ctx = Prisma.getExtensionContext(this) as any;
        return ctx.findMany({
          ...args,
          where: {
            ...(args as any)?.where,
            deletedAt: null,
          },
        });
      },
      async restore<T>(
        this: T,
        where: Prisma.Args<T, 'update'>['where']
      ): Promise<Prisma.Result<T, { where: typeof where }, 'update'>> {
        const ctx = Prisma.getExtensionContext(this) as any;
        return ctx.update({
          where,
          data: {
            deletedAt: null,
          },
        });
      },
    },
  },
});
