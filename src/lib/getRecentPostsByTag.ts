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

export const getRecentPostsByProjectAndTag = async (project: WordpressClientIdentifier, tag: string): Promise<WordpressPost[]> => {
  try {
    const result = await getClientForProject(project)({
      query: findRecentPostsByTag,
      variables: {
        where: {
          authorName: 'adamfortuna',
          tagSlugIn: [tag],
          categoryName: 'Canonical',
        },
      },
      tags: ['blog/all'],
    })
    console.log("DONE: getRecentPostsByProjectAndTag project:", project, "tag:", tag)
    if (!result.data.posts?.nodes) {
      return []
    }
    return result.data.posts.nodes.map((p: WordpressPost) => {
      return {
        ...p,
        project,
      }
    }) as WordpressPost[]
  } catch(e) {
    console.warn("WARN: getRecentPostsByProjectAndTag failed, returning empty array. project:", project, "tag:", tag, "error:", e)
    return []
  }
}

export const getTag = async (tag: string):Promise<Tag | null> => {
  try {
    const result = await adamfortunaClient({
      query: findTagInfo,
      variables: { tag },
      tags: ['blog/all'],
    })
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
}): Promise<PostsWithOptionalTag> => {
  const foundTag = await getTag(tag)
  if (!foundTag) {
    return {
      articles: [],
      articlesCount: 0,
      tag: null,
    };
  }

  const finders = projects.map((p) => getRecentPostsByProjectAndTag(p, tag))
  const results = await Promise.all(finders)

  const allArticles = results.map((wordpressArticles: WordpressPost[]) =>
    wordpressArticles.map((post: WordpressPost) => parsePost(post)),
  )
  const articles = flatten(allArticles).sort(sortByDateDesc) as Article[]

  return {
    articles: [...articles.slice(offset, offset + count)],
    articlesCount: articles.length,
    tag: foundTag,
  }
}
