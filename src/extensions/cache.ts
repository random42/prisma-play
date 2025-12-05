import { Prisma, PrismaPromise } from '@prisma/client';
import omit from 'lodash/omit';

const REQUIRED_ARGS_OPERATIONS = [
  'findUnique',
  'findUniqueOrThrow',
  'groupBy',
] as const;
const OPTIONAL_ARGS_OPERATIONS = [
  'findMany',
  'findFirst',
  'findFirstOrThrow',
  'count',
] as const;

type RequiredArgsOperation = (typeof REQUIRED_ARGS_OPERATIONS)[number];
type OptionalArgsOperation = (typeof OPTIONAL_ARGS_OPERATIONS)[number];

type RequiredArgsFunction<O extends RequiredArgsOperation> = <T, A>(
  this: T,
  args: Prisma.Exact<A, Prisma.Args<T, O> & PrismaCacheArgs>,
) => PrismaPromise<Prisma.Result<T, A, O>>;

type OptionalArgsFunction<O extends OptionalArgsOperation> = <T, A>(
  this: T,
  args?: Prisma.Exact<A, Prisma.Args<T, O> & PrismaCacheArgs>,
) => PrismaPromise<Prisma.Result<T, A, O>>;

type ModelExtension = {
  [O1 in RequiredArgsOperation]: RequiredArgsFunction<O1>;
} & {
  [O2 in OptionalArgsOperation]: OptionalArgsFunction<O2>;
};

interface CacheOptions {
  ttl?: number;
}

export interface PrismaCacheArgs {
  cache?: true | CacheOptions;
}

const cacheExtension = () =>
  Prisma.defineExtension({
    name: 'cache',
    model: {
      $allModels: {} as ModelExtension,
    },
    query: {
      async $allOperations({
        args,
        query,
      }: {
        args: unknown;
        query: (args: unknown) => PrismaPromise<unknown>;
      }) {
        const cleanedArgs = omit(args ?? {}, ['cache']);
        return query(cleanedArgs);
      },
    },
  });

export default cacheExtension;
