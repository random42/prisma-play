import { PrismaClient } from '@prisma/client';

// type Extension = Parameters<PrismaClient['$extends']>[0];

// const extension: Extension = ;

export const db = new PrismaClient().$extends({
  model: {
    $allModels: {
      async findPaginated<T = any>(args?) {
        const self = this as any;
        return {
          page: 1,
          data: (await self.findMany(args)) as T[],
          count: (await self.count(args)) as number,
        };
      },
    },
    user: {
      async current() {
        const self = this as any;
        return self.findMany();
      },
    },
  },
});
