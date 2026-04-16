/**
 * Cache management utilities.
 *
 * Content invalidation is done by bumping per-tag versions stored in KV
 * (see src/lib/cacheVersion.ts). Cache keys in both the edge HTML cache
 * (src/lib/edgeCache.ts) and the GraphQL response cache
 * (src/lib/kvCache.ts) embed the current version, so bumping a tag
 * effectively invalidates every key that depended on it — without needing
 * enterprise tag-based purging or tracking the full URL/query list.
 *
 * `setCacheHeaders` is kept for the Netlify deployment path which uses
 * its native CDN cache tags.
 */
import { bumpVersions } from './cacheVersion';
import { getEnv } from '../middleware';

interface PurgeCacheOptions {
  tags: string[];
}

/**
 * Invalidate caches for the given tags by bumping their version numbers
 * in KV. Also triggers the Netlify tag purge when running on Netlify for
 * backwards compatibility with the legacy deployment.
 */
export async function purgeCache({ tags }: PurgeCacheOptions): Promise<void> {
  // Primary path: version bump in KV. Works across edge + GraphQL caches.
  await bumpVersions(tags);

  // Netlify backwards-compat: if the Netlify env vars are present, also
  // trigger their native tag purge. No-op on Cloudflare.
  if (getEnv('NETLIFY_SITE_ID') && getEnv('NETLIFY_TOKEN')) {
    try {
      const { purgeCache: netlifyPurge } = await import('@netlify/functions');
      await netlifyPurge({
        siteID: getEnv('NETLIFY_SITE_ID'),
        tags,
        token: getEnv('NETLIFY_TOKEN'),
      });
    } catch (e) {
      console.error('Netlify cache purge failed:', e);
    }
  }
}

/**
 * Set cache headers for a response. Used by the Netlify deployment path;
 * on Cloudflare the edge cache middleware handles this automatically.
 */
export function setCacheHeaders(headers: Headers, options: {
  maxAge?: number;
  cdnMaxAge?: number;
  tags?: string[];
  staleWhileRevalidate?: boolean;
}) {
  const { maxAge = 0, cdnMaxAge = 31536000, tags = [], staleWhileRevalidate = true } = options;

  headers.set('Cache-Control', `public, max-age=${maxAge}${staleWhileRevalidate ? ', must-revalidate' : ''}`);
  headers.set('CDN-Cache-Control', `s-maxage=${cdnMaxAge}`);
  headers.set('Netlify-CDN-Cache-Control', `s-maxage=${cdnMaxAge}`);

  if (tags.length > 0) {
    headers.set('Netlify-Cache-Tag', tags.join(','));
    headers.set('Cache-Tag', tags.join(','));
  }
}
