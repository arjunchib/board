// @ts-nocheck
interface Env {
  ASSETS: { fetch: typeof fetch };
  BUCKET: R2Bucket;
}

export const api = async (request: Request, env: Env) => {
  const url = new URL(request.url);
  const paths = url.pathname.split('/').filter(Boolean);
  if (paths?.[0] === 'api') {
    const route = routes[paths?.[1] as keyof typeof routes];
    if (route) return await route(request, env);
    return new Response('Not found', { status: 404 });
  }
  return false;
};

const routes = {
  async upload(request: Request, env: Env) {
    await env.BUCKET.put('test.png', request.body);
    return new Response('ok');
  },
  async download(request: Request, env: Env) {
    const obj = await env.BUCKET.get('test.png');
    if (!obj) {
      return new Response('Not found', { status: 404 });
    }
    return new Response(obj.body);
  },
};
