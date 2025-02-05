import { getClientForProject } from './api'
import type { WordpressClientIdentifier } from '../types'

export const findPostsCount = `
query GetPostsCountByProject($count: Int, $where: RootQueryToPostConnectionWhereArgs) {
  posts(first: $count, where: $where) {
    nodes {
      id
    }
  }
}
`

export const getPostsCountByProject = async (project: WordpressClientIdentifier): Promise<number> => {
  return getClientForProject(project)({
    query: findPostsCount,
    variables: {
      count: 1000, // If there are more posts than this we're in trouble
      where: {
        authorName: 'adamfortuna',
        categoryName: 'Canonical',
      },
    },
  }).then((result) => {
    return result.data.posts.nodes.length
  })
}

export const getPostsCount = async (
  projects: WordpressClientIdentifier[] = ['adamfortuna', 'minafi', 'hardcover'],
): Promise<number | null> => {
  const finders = projects.map((p) => getPostsCountByProject(p))
  const results = await Promise.all(finders)

  return results.reduce((sum, current) => current + sum, 0)
}
