import { defineMiddleware } from 'astro:middleware';

// Global store for Cloudflare runtime env (set per-request)
let runtimeEnv: Record<string, string> = {};

export function getEnv(key: string): string | undefined {
  // Try Cloudflare runtime env first, then fall back to import.meta.env
  return runtimeEnv[key] || (import.meta.env as any)[key];
}

export const onRequest = defineMiddleware(async (context, next) => {
  // Capture Cloudflare runtime env for use in other modules
  const runtime = (context.locals as any).runtime;
  if (runtime?.env) {
    runtimeEnv = runtime.env;
  }

  try {
    return await next();
  } catch (error) {
    // Log the error (visible in Cloudflare real-time logs)
    console.error('Request error:', {
      url: context.url.toString(),
      pathname: context.url.pathname,
      method: context.request.method,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    // Re-throw to let Astro handle the error page
    throw error;
  }
});
