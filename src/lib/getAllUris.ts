import { getClientForProject } from './api'
import flatten from 'lodash/flatten'
import type { WordpressClientIdentifier } from '../types'

export const findWordPressArticles = `
  query GetWordPressRecentPosts($where: RootQueryToPostConnectionWhereArgs) {
    posts(first: 1000, where: $where) {
      nodes {
        uri
      }
    }

    pages(first: 1000) {
      nodes {
        uri
      }
    }
  }
`

export const getUrisByProject = async (project: WordpressClientIdentifier) => {
  try {
    const result = await getClientForProject(project)({
      query: findWordPressArticles,
      variables: {
        where: {
          authorName: 'adamfortuna',
          categoryName: 'Canonical',
        },
      },
      tags: ['blog/all'],
    })

    if (!result?.data) {
      console.log(`No data returned for ${project} URIs, skipping`);
      return [];
    }

    const posts = result.data.posts?.nodes?.map(({uri}:{uri: string}) => uri) ?? [];
    const pages = result.data.pages?.nodes?.map(({uri}:{uri: string}) => uri) ?? [];

    return [...posts, ...pages];
  } catch (e) {
    console.log(`Error fetching URIs for ${project}`, e);
    return [];
  }
}

export const getAllUris = async ({
  projects = ['adamfortuna', 'minafi', 'hardcover'],
}: {
  projects?: WordpressClientIdentifier[];
}): Promise<string[]> => {
  const finders = projects.map((p) => getUrisByProject(p));
  const results = await Promise.all(finders);
  return flatten(results);
};
