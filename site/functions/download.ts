interface Env {
  BUCKET: R2Bucket;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const obj = await context.env.BUCKET.get('test.png');
  if (!obj) {
    return new Response('Not found', { status: 404 });
  }
  return new Response(obj.body);
};
