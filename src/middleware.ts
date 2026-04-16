import { defineMiddleware } from 'astro:middleware';
import type { KV } from './lib/kvTypes';
import { edgeCache } from './lib/edgeCache';

let runtimeEnv: Record<string, any> = {};

export function getEnv(key: string): string | undefined {
  const val = runtimeEnv[key] ?? (import.meta.env as any)[key];
  return typeof val === 'string' ? val : undefined;
}

export function getKV(): KV | undefined {
  return runtimeEnv.CACHE as KV | undefined;
}

export const onRequest = defineMiddleware(async (context, next) => {
  const runtime = (context.locals as any).runtime;
  if (runtime?.env) {
    runtimeEnv = runtime.env;
  }

  try {
    return await edgeCache(context, next);
  } catch (error) {
    console.error('Request error:', {
      url: context.url.toString(),
      pathname: context.url.pathname,
      method: context.request.method,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
});
