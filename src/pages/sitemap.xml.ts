export const prerender = false

import { getAllUris } from '@/lib/getAllUris'

const SITE = 'https://adamfortuna.com'

const STATIC_PATHS = [
  '/',
  '/blog',
  '/blog/all',
  '/blog/tags',
  '/blog/projects',
  '/projects',
  '/now',
  '/lain',
]

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

export async function GET() {
  // Only posts/pages hosted on this site belong in the sitemap; minafi and
  // hardcover posts link out to their own domains.
  let uris: string[] = []
  try {
    uris = await getAllUris({ projects: ['adamfortuna'] })
  } catch (e) {
    console.error('Error building sitemap', e)
  }

  const paths = [...new Set([...STATIC_PATHS, ...uris])]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
  .map((path) => `  <url><loc>${escapeXml(new URL(path, SITE).toString())}</loc></url>`)
  .join('\n')}
</urlset>
`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  })
}
