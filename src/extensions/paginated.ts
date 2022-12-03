import { Extension } from './types';

type Delegate = {
  findMany(arg?: any): Promise<any[]>;
  count(arg?: any): Promise<number>;
};

type Args<D extends Delegate> = {
  page: number;
  take: number;
} & Parameters<D['findMany']>[0];

export const paginated = {
  model: {
    $allModels: {
      async findPaginated<D extends Delegate>(args: Args<D>) {
        const self = this as any as D;
        const { page, take } = args as { page: number; take: number };
        const skip = page * take;
        const findManyArgs = {
          ...args,
          skip,
          page: undefined,
        };
        const countArgs = {
          ...args,
          page: undefined,
          skip: undefined,
          take: undefined,
          cursor: undefined,
        };
        const [results, count] = await Promise.all([
          self.findMany(findManyArgs) as ReturnType<D['findMany']>,
          self.count(countArgs),
        ]);
        const totalPages =
          count % take === 0 ? count / take : Math.ceil(count / take);
        return {
          page: args.page,
          totalPages,
          count,
          results,
        };
      },
    },
  },
};
