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
  try {
    const result = await getClientForProject(project)({
      query: findPostsCount,
      variables: {
        count: 1000, // If there are more posts than this we're in trouble
        where: {
          authorName: 'adamfortuna',
          categoryName: 'Canonical',
        },
      },
    });
    return result?.data?.posts?.nodes?.length ?? 0;
  } catch (e) {
    console.log(`Error fetching posts count for ${project}`, e);
    return 0;
  }
}

// Store cached post counts per project set
let postsCountCache: Record<string, number> = {};

export const getPostsCount = async (
  projects: WordpressClientIdentifier[] = ['adamfortuna', 'minafi', 'hardcover'],
): Promise<number> => {
  // Create a unique cache key for the requested projects
  const cacheKey = projects.sort().join(',');

  // Return cached value if available
  if (postsCountCache[cacheKey] !== undefined && (import.meta.env.ENABLE_CACHE === "1" || import.meta.env.BUILDING)) {
    return postsCountCache[cacheKey];
  }

  // Fetch post counts for each project
  const finders = projects.map((p) => getPostsCountByProject(p));
  const results = await Promise.all(finders);

  // Calculate total count
  const totalPosts = results.reduce((sum, current) => sum + current, 0);

  // Store the result in the cache
  postsCountCache[cacheKey] = totalPosts;

  return totalPosts;
};
