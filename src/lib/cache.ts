/**
 * Cache management utilities
 * Supports both Netlify and Cloudflare cache purging
 */
import { getEnv } from '../middleware';

type CacheProvider = 'netlify' | 'cloudflare';

interface PurgeCacheOptions {
  tags: string[];
  provider?: CacheProvider;
}

/**
 * Purge cache by tags
 * Auto-detects provider based on environment variables
 */
export async function purgeCache({ tags, provider }: PurgeCacheOptions): Promise<void> {
  const detectedProvider = provider || detectProvider();
  
  if (detectedProvider === 'cloudflare') {
    await purgeCloudflareCache(tags);
  } else {
    await purgeNetlifyCache(tags);
  }
}

function detectProvider(): CacheProvider {
  if (getEnv('CLOUDFLARE_ZONE_ID')) {
    return 'cloudflare';
  }
  return 'netlify';
}

async function purgeNetlifyCache(tags: string[]): Promise<void> {
  // Dynamic import to avoid issues when not on Netlify
  const { purgeCache: netlifyPurge } = await import('@netlify/functions');

  await netlifyPurge({
    siteID: getEnv('NETLIFY_SITE_ID'),
    tags,
    token: getEnv('NETLIFY_TOKEN'),
  });
}

async function purgeCloudflareCache(tags: string[]): Promise<void> {
  const zoneId = getEnv('CLOUDFLARE_ZONE_ID');
  const apiToken = getEnv('CLOUDFLARE_API_TOKEN');
  
  if (!zoneId || !apiToken) {
    console.error('Cloudflare cache purge: Missing CLOUDFLARE_ZONE_ID or CLOUDFLARE_API_TOKEN');
    return;
  }

  // Cloudflare cache purge by Cache-Tag header
  // Requires Enterprise plan for tag-based purging, otherwise purge by URL
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // For Enterprise: use tags
        // tags: tags,
        // For non-Enterprise: purge everything (or maintain URL list)
        purge_everything: true,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error('Cloudflare cache purge failed:', error);
    throw new Error(`Cache purge failed: ${error}`);
  }
}

/**
 * Set cache headers for a response
 * Works across both Netlify and Cloudflare
 */
export function setCacheHeaders(headers: Headers, options: {
  maxAge?: number;
  cdnMaxAge?: number;
  tags?: string[];
  staleWhileRevalidate?: boolean;
}) {
  const { maxAge = 0, cdnMaxAge = 31536000, tags = [], staleWhileRevalidate = true } = options;
  
  // Browser cache control
  headers.set('Cache-Control', `public, max-age=${maxAge}${staleWhileRevalidate ? ', must-revalidate' : ''}`);
  
  // CDN cache control (works for both Netlify and Cloudflare)
  headers.set('CDN-Cache-Control', `s-maxage=${cdnMaxAge}`);
  
  // Netlify-specific
  headers.set('Netlify-CDN-Cache-Control', `s-maxage=${cdnMaxAge}`);
  
  // Cache tags
  if (tags.length > 0) {
    // Netlify format
    headers.set('Netlify-Cache-Tag', tags.join(','));
    // Cloudflare format
    headers.set('Cache-Tag', tags.join(','));
  }
}
