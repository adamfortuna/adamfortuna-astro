import { getClientForProject, parseTags } from '@/lib/api'
import type { Tag, WordpressClientIdentifier } from '@/types'
import flatten from 'lodash/flatten'

export const findWordPressTags = `
  query GetTags {
    tags(first: 1000) {
      nodes {
        name
        slug
        count
      }
    }
  }
`

export const getTagsByProject = async (project: WordpressClientIdentifier) => {
  try {
    const result = await getClientForProject(project)({ query: findWordPressTags, tags: ['blog/all'] });
    if (!result?.data?.tags?.nodes) {
      console.log(`No tags data returned for ${project}, skipping`);
      return [];
    }
    return parseTags(result.data.tags.nodes);
  } catch (e) {
    console.log(`Error fetching tags for ${project}`, e);
    return [];
  }
}

export const getTags = async () => {
  const projects: WordpressClientIdentifier[] = ['adamfortuna', 'minafi', 'hardcover']

  // Fetch tags for each project
  const finders = projects.map((p) => getTagsByProject(p))
  const results = await Promise.all(finders)

  const allTags = flatten(results)

  const tagHash = {} as Record<string, Tag>
  allTags.forEach((tag) => {
    if (!tag.count || tag.count === 0) {
      return
    }

    if (tagHash[tag.slug]) {
      tagHash[tag.slug].count = tagHash[tag.slug].count || 0
      tagHash[tag.slug].count += tag.count
    } else {
      tagHash[tag.slug] = {
        count: 0,
        ...tag,
      } as Tag
    }
  })

  return Object.values(tagHash).sort((a, b) =>
    a.name.toLocaleUpperCase().localeCompare(b.name.toLocaleUpperCase())
  )
}
