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
  try {
    const query = type === 'photos' ? findWordPressRecentPhotoPosts : findWordPressRecentPosts
    console.log("Fetching from", project)
    const result = await getClientForProject(project)({
      query,
      variables: {
        where: {
          authorName: 'adamfortuna',
          categoryName: 'Canonical',
        },
      },
      tags: ['blog/all'],
    })

    // Handle missing or failed API responses gracefully
    if (!result?.data?.posts?.nodes) {
      console.log(`No posts data returned for ${project}, skipping`);
      return [] as WordpressPost[];
    }

    return result.data.posts.nodes.map((p: WordpressPost) => {
      return {
        ...p,
        project,
      }
    }) as WordpressPost[]
  } catch(e) {
    console.log(`Error fetching recent posts for ${project}`, e);
    // Return empty array instead of throwing to allow other projects to still load
    return [] as WordpressPost[];
  }
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
  count: number;
  offset?: number;
  projects?: WordpressClientIdentifier[];
  filterBy?: any;
  type?: WordpressPostType;
  sortBy?: any;
}): Promise<RecentPostType> => {
  // Fetch posts for each project. Responses are cached in KV (see
  // fetchClient), so no extra in-memory caching is needed here.
  const finders = projects.map((p) => getRecentPostsByProject(p, type));
  const results = await Promise.all(finders);

  // Process and filter articles
  const allArticles = results.map((wordpressArticles: WordpressPost[]) =>
    wordpressArticles.map((post: WordpressPost) => parsePost(post))
  );
  const flatArticles = flatten(allArticles).filter(filterBy).sort(sortBy);
  const articles = [...flatArticles.slice(offset, offset + count)];

  return {
    articlesCount: flatArticles.length,
    articles,
    totalPages: Math.ceil(flatArticles.length / count),
  };
};