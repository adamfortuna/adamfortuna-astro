/**
 * Article embeds
 *
 * Lets a WordPress post drop a React component from this repo into its
 * content. Write either form in the post (a Custom HTML block is easiest):
 *
 *   <CodeTimeline />
 *   [code-timeline]
 *
 * ArticleContent.astro splits the post HTML around these markers and
 * ArticleEmbed.astro renders the matching island in between. Attributes on
 * the marker are passed through as string props.
 *
 * To add a component: register it here, then render it in ArticleEmbed.astro.
 */

export const ARTICLE_EMBEDS = {
  CodeTimeline: { shortcode: 'code-timeline' },
} as const

export type ArticleEmbedName = keyof typeof ARTICLE_EMBEDS

export type ArticleContentPart =
  | { type: 'html'; html: string }
  | { type: 'embed'; name: ArticleEmbedName; props: Record<string, string> }

const tagNames = Object.keys(ARTICLE_EMBEDS).join('|')
const shortcodeNames = Object.values(ARTICLE_EMBEDS)
  .map((embed) => embed.shortcode)
  .join('|')

// Optionally swallow a <p> wrapper WordPress may add around the marker, so we
// never leave an empty paragraph (or an unbalanced one) behind.
const MARKER_REGEX = new RegExp(
  `(?:<p[^>]*>\\s*)?(?:<(${tagNames})\\b([^>]*?)\\s*/?>(?:\\s*</\\1\\s*>)?|\\[(${shortcodeNames})\\b([^\\]]*)\\])(?:\\s*</p>)?`,
  'g',
)

const ATTRIBUTE_REGEX = /([\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g

function parseAttributes(source: string | undefined): Record<string, string> {
  const props: Record<string, string> = {}
  if (!source) return props
  for (const match of source.matchAll(ATTRIBUTE_REGEX)) {
    props[match[1]] = match[2] ?? match[3] ?? ''
  }
  return props
}

function embedNameForShortcode(shortcode: string): ArticleEmbedName | undefined {
  return (Object.keys(ARTICLE_EMBEDS) as ArticleEmbedName[]).find(
    (name) => ARTICLE_EMBEDS[name].shortcode === shortcode,
  )
}

export function hasArticleEmbeds(content: string | undefined): boolean {
  if (!content) return false
  MARKER_REGEX.lastIndex = 0
  return MARKER_REGEX.test(content)
}

export function splitArticleContent(content: string | undefined): ArticleContentPart[] {
  if (!content) return []

  const parts: ArticleContentPart[] = []
  let lastIndex = 0

  for (const match of content.matchAll(MARKER_REGEX)) {
    const index = match.index ?? 0
    const [full, tagName, tagAttributes, shortcode, shortcodeAttributes] = match
    const name = tagName ? (tagName as ArticleEmbedName) : embedNameForShortcode(shortcode)
    if (!name) continue

    if (index > lastIndex) {
      parts.push({ type: 'html', html: content.slice(lastIndex, index) })
    }
    parts.push({ type: 'embed', name, props: parseAttributes(tagName ? tagAttributes : shortcodeAttributes) })
    lastIndex = index + full.length
  }

  if (lastIndex < content.length) {
    parts.push({ type: 'html', html: content.slice(lastIndex) })
  }

  return parts
}
