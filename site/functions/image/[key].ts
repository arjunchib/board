interface Env {
  BUCKET: R2Bucket;
}

export const onRequest: PagesFunction<Env> = async ({
  request,
  env,
  params,
}) => {
  const key = params.key as string;

  switch (request.method) {
    case 'GET':
      const object = await env.BUCKET.get(key);

      if (object === null) {
        return new Response('Object Not Found', { status: 404 });
      }

      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set('etag', object.httpEtag);

      return new Response(object.body, {
        headers,
      });
    default:
      return new Response('Method Not Allowed', {
        status: 405,
        headers: {
          Allow: 'GET',
        },
      });
  }
};
