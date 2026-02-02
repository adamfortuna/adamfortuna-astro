import { defineMiddleware } from 'astro:middleware';
import Bugsnag from '@bugsnag/js';

// Initialize Bugsnag once
let bugsnagInitialized = false;

function initBugsnag(env?: any) {
  if (bugsnagInitialized) return;

  // Try multiple ways to get the API key (Astro env, Cloudflare env)
  const apiKey = import.meta.env.BUGSNAG_API_KEY || env?.BUGSNAG_API_KEY;
  if (apiKey) {
    Bugsnag.start({
      apiKey,
      appType: 'cloudflare-worker',
      releaseStage: import.meta.env.MODE || 'production',
    });
    bugsnagInitialized = true;
  }
}

export const onRequest = defineMiddleware(async (context, next) => {
  // Get Cloudflare env from locals (set by @astrojs/cloudflare)
  const runtime = context.locals.runtime;
  initBugsnag(runtime?.env);

  try {
    return await next();
  } catch (error) {
    // Report to Bugsnag
    if (bugsnagInitialized && error instanceof Error) {
      Bugsnag.notify(error, (event) => {
        event.addMetadata('request', {
          url: context.url.toString(),
          method: context.request.method,
          pathname: context.url.pathname,
        });
      });
    }

    // Log the error
    console.error('Request error:', context.url.pathname, error);

    // Re-throw to let Astro handle the error page
    throw error;
  }
});
