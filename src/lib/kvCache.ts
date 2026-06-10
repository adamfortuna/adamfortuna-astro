import { getKV } from '../middleware';
import { getVersion } from './cacheVersion';

const ONE_YEAR = 60 * 60 * 24 * 365;

async function sha256(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function kvGetJSON<T>(key: string): Promise<T | null> {
  const kv = getKV();
  if (!kv) return null;
  const raw = await kv.get(key, { cacheTtl: 60 });
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function kvPutJSON(
  key: string,
  value: unknown,
  ttl = ONE_YEAR,
): Promise<void> {
  const kv = getKV();
  if (!kv) return;
  await kv.put(key, JSON.stringify(value), { expirationTtl: ttl });
}

export async function queryCacheKey(
  url: string,
  query: string,
  variables: unknown,
  tags?: string[],
): Promise<string> {
  // When tags are provided the key only rotates when one of those tags is
  // bumped by the webhook. Untagged queries fall back to the global version,
  // which is bumped on every webhook, so they can never serve stale data.
  const tagList = tags && tags.length > 0 ? [...tags].sort() : ['global'];
  const versions = await Promise.all(tagList.map((t) => getVersion(t)));
  const versionPart = tagList.map((t, i) => `${t}=${versions[i]}`).join(',');
  const hash = await sha256(
    `${url}|${query}|${JSON.stringify(variables ?? {})}|v=${versionPart}`,
  );
  return `q:${hash}`;
}
