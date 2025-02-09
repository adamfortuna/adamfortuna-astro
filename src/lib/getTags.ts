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
  return getClientForProject(project)({ query: findWordPressTags }).then((result) => {
    return parseTags(result.data.tags.nodes)
  })
}

// Cache for getTags
let tagsCache: Record<string, Tag[]> = {}

export const getTags = async () => {
  const projects: WordpressClientIdentifier[] = ['adamfortuna', 'minafi', 'hardcover']

  // Create a cache key based on the sorted projects
  const cacheKey = projects.sort().join(',')

  // Return cached result if available
  if (tagsCache[cacheKey] && import.meta.env.ENABLE_CACHE === "1") {
    return tagsCache[cacheKey]
  }

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

  const unsortedTags: Tag[] = Object.values(tagHash).sort((a, b) => 
    a.name.toLocaleUpperCase().localeCompare(b.name.toLocaleUpperCase())
  )

  // Store result in cache
  tagsCache[cacheKey] = unsortedTags

  return unsortedTags
}
