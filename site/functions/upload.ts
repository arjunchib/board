import { count } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { images } from '../schema';

interface Env {
  BUCKET: R2Bucket;
  BOARD_WEBHOOKS: string;
  DB: D1Database;
}

function chunk(arr: unknown[], chunkSize = 20) {
  const chunkedArr = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    chunkedArr.push(arr.slice(i, i + chunkSize));
  }
  return chunkedArr;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const db = drizzle(context.env.DB);
  const [stream1, stream2] = context.request.body.tee();
  const filename = new Date().toISOString() + '.png';
  const numImages = (await db.select({ value: count() }).from(images))?.[0]
    ?.value;
  if (!numImages) {
    const imgs = (await context.env.BUCKET.list()).objects;
    const values = imgs
      .filter((img) => img.key.startsWith('202'))
      .map((img) => ({
        path: img.key,
        created_at: img.uploaded,
      }));
    await Promise.all(chunk(values).map((c) => db.insert(images).values(c)));
    // await db.insert(images).values(values);
  }
  await Promise.all([
    await context.env.BUCKET.put('latest.png', stream1),
    await context.env.BUCKET.put(filename, stream2),
    await db.insert(images).values({ path: filename, created_at: new Date() }),
  ]);
  // assuming one for now but should eventually allow a comma-separated string
  if (context.env.BOARD_WEBHOOKS) {
    context.waitUntil(fetch(context.env.BOARD_WEBHOOKS, { method: 'POST' }));
  }
  return new Response('ok');
};
