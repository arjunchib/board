interface Env {
  BUCKET: R2Bucket;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  await context.env.BUCKET.put('test.png', context.request.body);
  return new Response('ok');
};
