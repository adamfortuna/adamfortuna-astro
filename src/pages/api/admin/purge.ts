export const prerender = false;

import { bumpVersions } from '../../../lib/cacheVersion';
import { getEnv } from '../../../middleware';

/**
 * Manual cache flush. Bumps the `global` version plus any tags passed in
 * the JSON body. Secured by the same secret as the WordPress webhook so
 * we don't have to manage an extra env var.
 *
 * Usage:
 *   curl -X POST https://adamfortuna.com/api/admin/purge \
 *     -H "x-wordpress-webhook-secret: $SECRET"
 *
 *   curl -X POST https://adamfortuna.com/api/admin/purge \
 *     -H "x-wordpress-webhook-secret: $SECRET" \
 *     -H "content-type: application/json" \
 *     -d '{"tags":["blog","projects"]}'
 */
export async function POST(context: { request: Request }) {
  const { request } = context;
  const headerSecret = request.headers.get('x-wordpress-webhook-secret');
  const envSecret = getEnv('WORDPRESS_WEBHOOK_SECRET');

  if (!envSecret || headerSecret !== envSecret) {
    return new Response('Unauthorized', { status: 401 });
  }

  let tags: string[] = [];
  try {
    const body = await request.json().catch(() => null);
    if (body && Array.isArray((body as any).tags)) {
      tags = (body as any).tags.filter((t: unknown) => typeof t === 'string');
    }
  } catch {
    // empty body is fine — global still gets bumped
  }

  await bumpVersions(tags);

  return new Response(
    JSON.stringify({ ok: true, bumped: ['global', ...tags] }),
    { status: 200, headers: { 'content-type': 'application/json' } },
  );
}
