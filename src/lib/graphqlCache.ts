/**
 * GraphQL response caching via Cloudflare KV
 *
 * Caches all GraphQL responses in KV storage. Cache persists
 * until cleared by the WordPress webhook.
 *
 * Falls back to no caching when KV isn't available (local dev).
 */

// Global reference to KV namespace, set by middleware
let kvNamespace: KVNamespace | null = null;

export function setKVNamespace(kv: KVNamespace) {
  kvNamespace = kv;
}

export function getKVNamespace(): KVNamespace | null {
  return kvNamespace;
}

/**
 * Generate a cache key from a GraphQL query and variables.
 * Uses a simple hash to keep keys short.
 */
function cacheKey(query: string, variables: Record<string, any> = {}): string {
  const input = query + JSON.stringify(variables);
  // Simple string hash - good enough for cache keys
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `gql:${hash >>> 0}`; // unsigned
}

/**
 * Get a cached GraphQL response from KV
 */
export async function getCachedResponse(
  query: string,
  variables: Record<string, any> = {}
): Promise<any | null> {
  if (!kvNamespace) return null;

  try {
    const key = cacheKey(query, variables);
    const cached = await kvNamespace.get(key, 'json');
    if (cached) {
      console.log(`[cache] HIT: ${key}`);
    }
    return cached;
  } catch (e) {
    console.error('[cache] GET error:', e);
    return null;
  }
}

/**
 * Store a GraphQL response in KV cache
 */
export async function setCachedResponse(
  query: string,
  variables: Record<string, any> = {},
  data: any
): Promise<void> {
  if (!kvNamespace) return;

  try {
    const key = cacheKey(query, variables);
    // Store without expiration - webhook will clear it
    await kvNamespace.put(key, JSON.stringify(data));
    console.log(`[cache] SET: ${key}`);
  } catch (e) {
    console.error('[cache] SET error:', e);
  }
}

/**
 * Clear all cached GraphQL responses.
 * Called by the webhook when WordPress content changes.
 */
export async function clearCache(): Promise<number> {
  if (!kvNamespace) return 0;

  let deleted = 0;
  let cursor: string | undefined;

  try {
    do {
      const listed = await kvNamespace.list({
        prefix: 'gql:',
        cursor,
        limit: 1000,
      });

      const deletePromises = listed.keys.map(key =>
        kvNamespace!.delete(key.name)
      );
      await Promise.all(deletePromises);
      deleted += listed.keys.length;

      cursor = listed.list_complete ? undefined : listed.cursor;
    } while (cursor);

    console.log(`[cache] Cleared ${deleted} entries`);
    return deleted;
  } catch (e) {
    console.error('[cache] CLEAR error:', e);
    return deleted;
  }
}
