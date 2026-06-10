/**
 * Cache management utilities.
 *
 * Content invalidation is done by bumping per-tag versions stored in KV
 * (see src/lib/cacheVersion.ts). Cache keys in both the edge HTML cache
 * (src/lib/edgeCache.ts) and the GraphQL response cache
 * (src/lib/kvCache.ts) embed the current version, so bumping a tag
 * effectively invalidates every key that depended on it — without needing
 * enterprise tag-based purging or tracking the full URL/query list.
 */
import { bumpVersions } from './cacheVersion';

interface PurgeCacheOptions {
  tags: string[];
}

/**
 * Invalidate caches for the given tags by bumping their version numbers
 * in KV. Works across the edge HTML cache and the GraphQL response cache.
 */
export async function purgeCache({ tags }: PurgeCacheOptions): Promise<void> {
  await bumpVersions(tags);
}
