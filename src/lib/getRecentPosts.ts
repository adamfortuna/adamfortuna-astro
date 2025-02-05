import { getClientForProject, parsePost, sortByDateDesc } from './api'
import flatten from 'lodash/flatten'
import type { WordpressPost, WordpressPostType, WordpressClientIdentifier, Article, PhotoPost } from '../types'

export const findWordPressRecentPosts = `
  query GetWordPressRecentPosts($where: RootQueryToPostConnectionWhereArgs) {
    posts(first: 1000, where: $where) {
      nodes {
        title
        slug
        date
        excerpt(format: RAW)
        commentCount

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

export const findWordPressRecentPhotoPosts = `
  query GetWordPressRecentPosts($where: RootQueryToPhotoblogConnectionWhereArgs) {
    posts:photoblogs(first: 1000, where: $where) {
      nodes {
        title
        slug
        date
        excerpt(format: RAW)
        commentCount
        parentId
        contentTypeName

        featuredImage {
          node {
            sourceUrl
            mediaDetails {
              width
              height
            }
          }
        }

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

export const getRecentPostsByProject = async (project: WordpressClientIdentifier, type: WordpressPostType) => {
  const query = type === 'photos' ? findWordPressRecentPhotoPosts : findWordPressRecentPosts
  // const parent = type === 'photos' ? { parent: 0 } : {}

  const result = await getClientForProject(project)({
    query,
    variables: {
      where: {
        authorName: 'adamfortuna',
        categoryName: 'Canonical',
      },
    },
  })

  return result.data.posts.nodes.map((p: WordpressPost) => {
    return {
      ...p,
      project,
    }
  }) as WordpressPost[]
}

interface RecentPostType {
  articlesCount: number
  totalPages: number
  articles: Article[] | PhotoPost[]
}

export const getRecentPosts = async ({
  count,
  offset = 0,
  type = 'post',
  projects = ['adamfortuna', 'minafi', 'hardcover'],
  sortBy = sortByDateDesc,
  filterBy = (a: Article) => a,
}: {
  count: number
  offset?: number
  projects?: WordpressClientIdentifier[]
  filterBy?: any
  type?: WordpressPostType
  sortBy?: any
}): Promise<RecentPostType> => {
  const finders = projects.map((p) => getRecentPostsByProject(p, type))
  const results = await Promise.all(finders)

  const allArticles = results.map((wordpressArticles: WordpressPost[]) =>
    wordpressArticles.map((post: WordpressPost) => parsePost(post)),
  )
  const flatArticles = flatten(allArticles).filter(filterBy).sort(sortBy)
  const articles = [...flatArticles.slice(offset, offset + count)]

  return {
    articlesCount: flatArticles.length,
    articles,
    totalPages: Math.ceil(flatArticles.length / count),
  }
}
