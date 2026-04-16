import { getKV } from '../middleware';

const versionKey = (tag: string) => `v:${tag}`;
const GLOBAL_TAG = 'global';

export async function getVersion(tag: string): Promise<string> {
  const kv = getKV();
  if (!kv) return '0';
  const v = await kv.get(versionKey(tag), { cacheTtl: 60 });
  return v ?? '0';
}

export async function getVersions(tags: string[]): Promise<Record<string, string>> {
  const unique = Array.from(new Set([GLOBAL_TAG, ...tags]));
  const entries = await Promise.all(
    unique.map(async (t) => [t, await getVersion(t)] as const),
  );
  return Object.fromEntries(entries);
}

export async function bumpVersions(tags: string[]): Promise<void> {
  const kv = getKV();
  if (!kv) return;
  const unique = Array.from(new Set([GLOBAL_TAG, ...tags]));
  const now = Date.now().toString(36);
  await Promise.all(unique.map((t) => kv.put(versionKey(t), now)));
}

export function versionToken(versions: Record<string, string>): string {
  return Object.keys(versions)
    .sort()
    .map((k) => `${k}:${versions[k]}`)
    .join('|');
}
