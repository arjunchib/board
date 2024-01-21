import { lt, desc } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { images } from '../schema';
import { json } from '../helpers/json';

interface Env {
  DB: D1Database;
  BUCKET: R2Bucket;
}

function bound(input: number, lower: number, upper: number) {
  if (input < lower) {
    return lower;
  } else if (input > upper) {
    return upper;
  } else {
    return input;
  }
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const cursor = new Date(url.searchParams.get('cursor') || new Date());
  const limit = bound(parseInt(url.searchParams.get('limit')), 0, 100);
  const db = drizzle(context.env.DB);
  const imgs = await db
    .select({ key: images.path, createdAt: images.created_at })
    .from(images)
    .where(lt(images.created_at, cursor))
    .limit(limit + 1)
    .orderBy(desc(images.created_at));
  const limitedImgs = imgs.slice(0, limit);
  return json({
    images: limitedImgs,
    cursor: limitedImgs.at(-1).createdAt,
    hasMore: imgs.length > limit,
  });
};
