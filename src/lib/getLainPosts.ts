import { adamfortunaClient, parseTags } from './api'
import type { LainPost, WordpressLainPost, Tag } from '../types'
import omitBy from 'lodash/omitBy'

/**
 * GraphQL query for Lain posts
 * Assumes a custom post type 'lain' exists in WordPress
 * with custom fields via ACF
 */
export const findLainPosts = `
  query GetLainPosts($first: Int, $after: String) {
    lainPosts(first: $first, after: $after, where: { orderby: { field: DATE, order: DESC } }) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        databaseId
        slug
        uri
        title
        date
        content
        excerpt(format: RAW)
        
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
        
        lainInfo {
          mood
          type
          interactive
          componentName
          customStyles
        }
      }
    }
  }
`

export const findLainPostBySlug = `
  query GetLainPostBySlug($slug: ID!) {
    lainPost(id: $slug, idType: SLUG) {
      id
      databaseId
      slug
      uri
      title
      date
      content
      excerpt(format: RAW)
      
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
      
      lainInfo {
        mood
        type
        interactive
        componentName
        customStyles
      }
    }
  }
`

export const parseLainPost = (post: WordpressLainPost): LainPost => {
  const tags = post.tags?.nodes ? parseTags(post.tags.nodes as Tag[]) : undefined
  
  const lainPost: LainPost = {
    id: post.id,
    slug: post.slug,
    uri: post.uri || `/lain/${post.slug}`,
    title: post.title,
    content: post.content,
    excerpt: post.excerpt,
    date: post.date,
    featuredImage: post.featuredImage?.node,
    tags,
    lainInfo: post.lainInfo,
    components: parseComponentsFromContent(post.content),
  }
  
  return omitBy(lainPost, (v) => v === null || v === undefined) as LainPost
}

/**
 * Parse [lain-component] shortcodes from WordPress content
 * Format: [lain-component name="ComponentName" prop1="value1" prop2="value2"]
 */
export const parseComponentsFromContent = (content: string): LainComponentRef[] => {
  const componentRegex = /\[lain-component\s+([^\]]+)\]/g
  const components: LainComponentRef[] = []
  let match
  
  while ((match = componentRegex.exec(content)) !== null) {
    const attributeString = match[1]
    const attributes = parseShortcodeAttributes(attributeString)
    
    if (attributes.name) {
      components.push({
        name: attributes.name,
        props: omitBy(attributes, (_, key) => key === 'name') as Record<string, unknown>,
        position: match.index,
      })
    }
  }
  
  return components
}

interface LainComponentRef {
  name: string
  props?: Record<string, unknown>
  position?: number
}

/**
 * Parse shortcode attributes from a string like: name="Foo" bar="baz"
 */
function parseShortcodeAttributes(str: string): Record<string, string> {
  const attrs: Record<string, string> = {}
  const attrRegex = /(\w+)=["']([^"']+)["']/g
  let match
  
  while ((match = attrRegex.exec(str)) !== null) {
    attrs[match[1]] = match[2]
  }
  
  return attrs
}

// Cache for Lain posts
let lainPostsCache: LainPost[] | null = null

export const getLainPosts = async ({ 
  count = 100,
  useCache = true,
}: { 
  count?: number
  useCache?: boolean 
} = {}): Promise<LainPost[]> => {
  if (useCache && lainPostsCache && (import.meta.env.ENABLE_CACHE === "1" || import.meta.env.BUILDING)) {
    return lainPostsCache
  }
  
  try {
    const result = await adamfortunaClient({
      query: findLainPosts,
      variables: { first: count },
    })
    
    if (!result.data?.lainPosts?.nodes) {
      console.log('No Lain posts found or query error:', result.errors)
      return []
    }
    
    const posts = result.data.lainPosts.nodes.map(parseLainPost)
    lainPostsCache = posts
    
    return posts
  } catch (error) {
    console.error('Error fetching Lain posts:', error)
    return []
  }
}

export const getLainPostBySlug = async (slug: string): Promise<LainPost | null> => {
  try {
    const result = await adamfortunaClient({
      query: findLainPostBySlug,
      variables: { slug },
    })
    
    if (!result.data?.lainPost) {
      return null
    }
    
    return parseLainPost(result.data.lainPost)
  } catch (error) {
    console.error('Error fetching Lain post:', error)
    return null
  }
}
