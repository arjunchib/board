interface Env {
  BUCKET: R2Bucket;
  BOARD_WEBHOOKS: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const [stream1, stream2] = context.request.body.tee();
  const filename = new Date().toISOString() + '.png';
  await Promise.all([
    await context.env.BUCKET.put('latest.png', stream1),
    await context.env.BUCKET.put(filename, stream2),
  ]);
  // assuming one for now but should eventually allow a comma-separated string
  if (context.env.BOARD_WEBHOOKS) {
    context.waitUntil(fetch(context.env.BOARD_WEBHOOKS, { method: 'POST' }));
  }
  return new Response('ok');
};
