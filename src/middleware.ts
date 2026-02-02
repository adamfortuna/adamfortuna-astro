import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
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
