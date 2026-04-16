import type { MiddlewareNext } from 'astro';
import { getVersions, versionToken } from './cacheVersion';

const ONE_YEAR = 31_536_000;

// Routes whose rendered HTML we want to cache at the edge, with the
// cache-tags each route should be keyed against. Tags are bumped by the
// WordPress webhook (see src/lib/cache.ts + src/pages/api/webhook.json.ts).
type RouteTagResolver = (pathname: string) => string[] | null;

const routeResolvers: RouteTagResolver[] = [
  (p) => (p === '/' ? ['home'] : null),
  (p) => (p === '/projects' ? ['projects'] : null),
  (p) => (p === '/blog' || p === '/blog/' ? ['blog', 'blog/all'] : null),
  (p) => (p.startsWith('/blog/all') ? ['blog/all'] : null),
  (p) => {
    const m = p.match(/^\/blog\/tags\/([^/]+)/);
    return m ? [`blog/tags/${m[1]}`, 'blog/all'] : null;
  },
  (p) => {
    const m = p.match(/^\/blog\/projects\/([^/]+)/);
    return m ? [`blog/projects/${m[1]}`, 'blog/all'] : null;
  },
  (p) => (p.startsWith('/lain') ? ['lain', 'lain-index'] : null),
  // Fallback for every other GET page (single posts, pages, etc.) — keyed
  // only on the global version so any webhook invalidates them. Excludes
  // API routes explicitly below.
  (p) => (p.startsWith('/api/') || p.startsWith('/_') ? null : ['global']),
];

function resolveTags(pathname: string): string[] | null {
  for (const r of routeResolvers) {
    const tags = r(pathname);
    if (tags) return tags;
  }
  return null;
}

function shouldCache(request: Request): boolean {
  if (request.method !== 'GET') return false;
  // Don't cache if the request opts out.
  const cc = request.headers.get('cache-control') || '';
  if (/no-cache|no-store/.test(cc)) return false;
  return true;
}

function isHtml(response: Response): boolean {
  const ct = response.headers.get('content-type') || '';
  return ct.includes('text/html');
}

async function buildCacheKey(
  request: Request,
  tags: string[],
): Promise<Request> {
  const versions = await getVersions(tags);
  const url = new URL(request.url);
  url.searchParams.set('__v', versionToken(versions));
  return new Request(url.toString(), { method: 'GET' });
}

export async function edgeCache(
  context: { request: Request; url: URL },
  next: MiddlewareNext,
): Promise<Response> {
  const { request, url } = context;
  if (!shouldCache(request)) return next();

  const tags = resolveTags(url.pathname);
  if (!tags) return next();

  // `caches.default` is only available in the Cloudflare runtime. In local
  // `astro dev` it's undefined — fall through to normal SSR.
  const cache = (globalThis as any).caches?.default as Cache | undefined;
  if (!cache) return next();

  const cacheKey = await buildCacheKey(request, tags);

  const hit = await cache.match(cacheKey);
  if (hit) {
    const headers = new Headers(hit.headers);
    headers.set('x-edge-cache', 'HIT');
    // Always tell the browser to revalidate; the edge is the source of truth.
    headers.set('cache-control', 'public, max-age=0, must-revalidate');
    return new Response(hit.body, {
      status: hit.status,
      statusText: hit.statusText,
      headers,
    });
  }

  const response = await next();
  if (response.status !== 200 || !isHtml(response)) return response;

  const body = await response.clone().arrayBuffer();

  // Build the version we'll store in the edge cache: long max-age so
  // Cloudflare keeps it. Readers go through our cache-key URL which already
  // encodes the current version, so stale entries are never served.
  const cacheable = new Response(body, {
    status: response.status,
    statusText: response.statusText,
    headers: new Headers(response.headers),
  });
  cacheable.headers.set(
    'cache-control',
    `public, max-age=${ONE_YEAR}, s-maxage=${ONE_YEAR}`,
  );
  cacheable.headers.set('x-edge-cache-tags', tags.join(','));
  await cache.put(cacheKey, cacheable);

  const out = new Response(body, {
    status: response.status,
    statusText: response.statusText,
    headers: new Headers(response.headers),
  });
  out.headers.set('cache-control', 'public, max-age=0, must-revalidate');
  out.headers.set('x-edge-cache', 'MISS');
  return out;
}
