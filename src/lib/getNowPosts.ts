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

export const getNowPosts = async (): Promise<NowPost[]> => {
  try {
    const result = await adamfortunaClient({
      query: findAllNows,
    })

    if (!result?.data?.nows?.nodes) {
      console.log('No nows data returned:', result?.errors)
      return []
    }

    return result.data.nows.nodes.map((node: any) => ({
      id: node.databaseId,
      slug: node.slug,
      title: node.title,
      date: node.date,
      content: node.content,
    }))
  } catch (e) {
    console.log('Error fetching nows', e)
    return []
  }
}
