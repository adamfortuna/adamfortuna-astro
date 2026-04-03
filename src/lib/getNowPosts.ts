import { adamfortunaClient } from './api'

export interface NowPost {
  id: number
  slug: string
  title: string
  date: string
  content: string
}

export const findAllNows = `
  query GetAllNows {
    nows(first: 1000, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        databaseId
        slug
        title
        date
        content
      }
    }
  }
`

export interface NowPostsResult {
  posts: NowPost[]
  error: string | null
}

export const getNowPosts = async (): Promise<NowPostsResult> => {
  try {
    const result = await adamfortunaClient({
      query: findAllNows,
    })

    if (result?.errors) {
      const msg = result.errors.map((e: any) => e.message).join('; ')
      console.log('GraphQL errors fetching nows:', msg)
      return { posts: [], error: `GraphQL error: ${msg}` }
    }

    if (!result?.data?.nows?.nodes) {
      console.log('No nows data returned. Full response:', JSON.stringify(result?.data))
      return { posts: [], error: `No "nows" field in response. Available fields: ${Object.keys(result?.data || {}).join(', ')}` }
    }

    return {
      posts: result.data.nows.nodes.map((node: any) => ({
        id: node.databaseId,
        slug: node.slug,
        title: node.title,
        date: node.date,
        content: node.content,
      })),
      error: null,
    }
  } catch (e) {
    console.log('Error fetching nows', e)
    return { posts: [], error: `Fetch error: ${e}` }
  }
}
