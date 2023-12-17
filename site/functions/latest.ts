interface Env {
  BUCKET: R2Bucket;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const obj = await context.env.BUCKET.get('latest.png', {
    onlyIf: context.request.headers,
  });

  if (!obj) {
    return new Response('Not found', { status: 404 });
  }

  if (!('body' in obj)) {
    return new Response(null, { status: 304 });
  }

  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set('etag', obj.httpEtag);

  return new Response(obj.body, {
    headers,
  });
};
