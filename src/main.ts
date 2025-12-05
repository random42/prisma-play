import dotenv from 'dotenv';
import { db } from './client';

dotenv.config();

async function main(): Promise<void> {
  const users = await db.user.findMany({ cache: true });
  const firstPage = await db.user.paginate({
    take: 10,
    page: 1,
  });

  console.log(`Fetched ${users.length} users`);
  console.log(JSON.stringify(firstPage, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
