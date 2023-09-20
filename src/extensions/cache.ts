import { Prisma, PrismaPromise } from '@prisma/client';
import { Operation } from '@prisma/client/runtime/library';
import omit from 'lodash/omit';

// export interface PrismaCacheExtensionConfig {}

// export interface Cache {}

const REQUIRED_ARGS_OPERATIONS = ['findUnique', 'findUniqueOrThrow', 'groupBy'] as const satisfies ReadonlyArray<Operation>;
const OPTIONAL_ARGS_OPERATIONS = ['findMany', 'findFirst', 'findFirstOrThrow', 'count'] as const satisfies ReadonlyArray<Operation>;
// const OPERATIONS = ["findMany"] as const satisfies ReadonlyArray<Operation>;
type RequiredArgsOperation = (typeof REQUIRED_ARGS_OPERATIONS)[number];
type OptionalArgsOperation = (typeof OPTIONAL_ARGS_OPERATIONS)[number];
type CacheOperation = RequiredArgsOperation | OptionalArgsOperation;

type RequiredArgsFunction<O extends RequiredArgsOperation> = <T, A>(
  this: T,
  args: Prisma.Exact<
    A,
    Prisma.Args<T, O> & PrismaCacheArgs
  >
) => PrismaPromise<Prisma.Result<T, A, O>>;

type OptionalArgsFunction<O extends OptionalArgsOperation> = <T, A>(
  this: T,
  args?: Prisma.Exact<
    A,
    Prisma.Args<T, O> & PrismaCacheArgs
  >
) => PrismaPromise<Prisma.Result<T, A, O>>;


type ModelExtension = {
  [O1 in RequiredArgsOperation]: RequiredArgsFunction<O1>;
} & {
  [O2 in OptionalArgsOperation]: OptionalArgsFunction<O2>;
}

interface CacheOptions {
  ttl?: number;
}

export interface PrismaCacheArgs {
  cache?: true | CacheOptions;
}

export interface ExtensionConfig {
  a: string
}

export default (config?: ExtensionConfig) => {
  return Prisma.defineExtension({
    name: 'cache',
    client: {
      // $queryRaw:
    },
    model: {
      $allModels: {} as ModelExtension,
    },
    query: {
      async $allOperations({ model, operation, args, query }) {
        console.log({ model, operation, args });
        const arg = omit(args, ['cache'])
        return query(arg);
      },
      // '$allOperations'
    },
  });
};
