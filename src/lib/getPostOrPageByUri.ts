import { adamfortunaClient, parsePage, parsePost } from './api'
import type { PhotoPost, Post } from '../types'

export const findWordpressPost = `
query GetWordPressPost($uri: String!) {
  post: postBy(uri: $uri) {
    __typename
    id: databaseId
    title
    content
    excerpt(format: RAW)
    date
    slug
    uri
    commentStatus
    pingStatus
    contentTypeName
    author {
      node {
        name
      }
    }
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

    commentCount
    comments(first: 1000) {
      nodes {
        type
        databaseId
        parentDatabaseId
        date
        status
        content(format: RAW)
        webmention {
          author_avatar
          author_url
          webmention_source_url
          webmention_target_url
        }
        author {
          node {
            url
            name
            avatar {
              url
            }
          }
        }
      }
    }
  }

  page: pageBy(uri: $uri) {
    __typename
    id: databaseId
    title
    content
    date
    uri
    slug
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
  }
}
`

export const getPostOrPageByUri = async (uri: string): Promise<null | Post | PhotoPost> => {
  const result = await adamfortunaClient({
    query: findWordpressPost,
    variables: {
      uri,
    },
  })

  if (!result.data?.post && !result.data?.page) {
    return null
  }

  if (result.data.post) {
    return parsePost(
      {
        ...result.data.post,
        project: 'adamfortuna',
      },
      true,
    )
  }
  if (result.data.page) {
    return parsePage({
      ...result.data.page,
      project: 'adamfortuna',
    })
  }
  return null
}
