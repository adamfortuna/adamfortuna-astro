import { getClientForProject, adamfortunaClient, parsePost, sortByDateDesc } from '@/lib/api'
import type { Article, WordpressPost, WordpressClientIdentifier, Tag } from '@/types'
import flatten from 'lodash/flatten'

export const findTagInfo = `
  query GetTagInfo($tag: ID!) {
    tag(idType: SLUG, id: $tag) {
      count
      description
      name
      slug
    }
  }
`

export const findRecentPostsByTag = `
  query GetWordPressRecentPostsByTag($where: RootQueryToPostConnectionWhereArgs) {
    posts(first: 1000, where: $where) {
      nodes {
        title
        slug
        date
        excerpt(format: RAW)

        tags {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`

export const getRecentPostsByProjectAndTag = async (project: WordpressClientIdentifier, tag: string) => {
  try {
    return getClientForProject(project)({
      query: findRecentPostsByTag,
      variables: {
        where: {
          authorName: 'adamfortuna',
          tagSlugIn: [tag],
          categoryName: 'Canonical',
        },
      },
    }).then((result) => {
      console.log("DONE: getRecentPostsByProjectAndTag project:", project, "tag", tag)
      if (!result.data.posts?.nodes) {
        return []
      }
      return result.data.posts.nodes.map((p: WordpressPost) => {
        return {
          ...p,
          project,
        }
      }) as WordpressPost[]
    })
  } catch(e) {
    console.log("getRecentPostsByProjectAndTag project:", project, "tag:", tag, "error:", e)
    throw(e)
  }
}

// Cache for tags
let tagCache: Record<string, any> = {}

export const getTag = async (tag: string):Promise<Tag | null> => {
  if (tagCache[tag]) {
    return tagCache[tag]
  }

  try {
    const result = await adamfortunaClient({
      query: findTagInfo,
      variables: { tag },
    })
    tagCache[tag] = result.data.tag // Store in cache
    return result.data.tag
  } catch {
    return null
  }
}

export interface PostsWithTag {
  articles: Article[]
  articlesCount: number
  tag: Tag
}

export interface PostsWithOptionalTag{
  articles: Article[]
  articlesCount: number
  tag: Tag | null
}

// Cache for recent posts by tag
let recentPostsByTagCache: Record<string, PostsWithOptionalTag> = {}

export const getRecentPostsByTag = async ({
  count,
  offset = 0,
  tag,
  projects = ['adamfortuna', 'minafi', 'hardcover'],
}: {
  count: number
  tag: string
  offset?: number
  projects?: WordpressClientIdentifier[]
}) => {
  // Generate cache key
  const cacheKey = JSON.stringify({ tag, projects: projects.sort(), count, offset })
 
  // Return cached results if available
  if (recentPostsByTagCache[cacheKey] && (import.meta.env.ENABLE_CACHE === "1" || import.meta.env.BUILDING)) {
    return recentPostsByTagCache[cacheKey]
  }

  const foundTag = await getTag(tag)
  if (!foundTag) {
    recentPostsByTagCache[cacheKey] = {
      articles: [],
      articlesCount: 0,
      tag: null,
    };
    return recentPostsByTagCache[cacheKey];
  }

  console.log("STARTED getRecentPostsByTag tag:", tag)
  const finders = projects.map((p) => getRecentPostsByProjectAndTag(p, tag))
  const results = await Promise.all(finders)

  const allArticles = results.map((wordpressArticles: WordpressPost[]) =>
    wordpressArticles.map((post: WordpressPost) => parsePost(post)),
  )
  const articles = flatten(allArticles).sort(sortByDateDesc) as Article[]

  const response = {
    articles: [...articles.slice(offset, offset + count)],
    articlesCount: articles.length,
    tag: foundTag,
  }

  // Store in cache
  recentPostsByTagCache[cacheKey] = response

  return response
}
