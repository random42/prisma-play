import dotenv from 'dotenv';
import { db } from './client';
import _ from 'lodash';
import { Prisma } from '@prisma/client';
dotenv.config();

const json = (x) => console.log(JSON.stringify(x, null, 2));
const r = (res) => _.omit(res, ['request']);
async function main() {
  const data = await db.user.findMany({
    cache: true,
  });
  await db.user.paginate({
    take: 1,
    page: 1,
  });
}

main().catch(console.error);
