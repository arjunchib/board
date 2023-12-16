interface Env {
  BUCKET: R2Bucket;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const filename = new Date().toISOString() + '.png';
  await Promise.all([
    await context.env.BUCKET.put('latest.png', context.request.body),
    await context.env.BUCKET.put(filename, context.request.body),
  ]);
  await fetch('https://ollie.arjunchib.com/webhook', {
    method: 'POST',
    body: JSON.stringify({ image: filename }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return new Response('ok');
};
