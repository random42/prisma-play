import { Prisma } from '@prisma/client';
import omit from 'lodash/omit';

async function _paginate<T, A>(
  this: T,
  args: Prisma.Exact<
    A,
    Omit<Prisma.Args<T, 'findMany'>, 'skip'> & {
      page: number;
      take: number;
    }
  >,
): Promise<{
  page: number;
  totalPages: number;
  count: number;
  results: Prisma.Result<T, A, 'findMany'>;
}> {
  const ctx = Prisma.getExtensionContext(this) as any;
  const arg = args as any;
  const { page, take } = arg;
  const safePage = page < 1 ? 1 : page;
  const skip = Math.max(0, (safePage - 1) * take);
  const findManyArgs = {
    ...omit(arg, ['page']),
    skip,
  };
  const countArgs = omit(arg, ['select', 'include', 'page', 'skip', 'take']);
  const [results, count] = await Promise.all([
    ctx.findMany(findManyArgs),
    ctx.count(countArgs),
  ]);
  const totalPages = count === 0 ? 0 : Math.ceil(count / take);
  return {
    page: safePage,
    totalPages,
    count,
    results,
  };
}

export default Prisma.defineExtension({
  model: {
    $allModels: {
      paginate: _paginate,
    },
  },
});
