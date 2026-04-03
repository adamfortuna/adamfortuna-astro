export const prerender = false

import { adamfortunaClient } from '@/lib/api'

const createCommentMutation = `
mutation CreateComment($input: CreateCommentInput!) {
  createComment(input: $input) {
    success
    comment {
      databaseId
      status
      date
      content(format: RAW)
      author {
        node {
          name
          url
          avatar {
            url
          }
        }
      }
    }
  }
}
`

export async function POST(context: { request: Request }) {
  const { request } = context

  try {
    const body = await request.json()
    const { postId, parentId, author, authorEmail, authorUrl, content } = body

    if (!postId || !author || !authorEmail || !content) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: postId, author, authorEmail, content' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      )
    }

    const input: Record<string, unknown> = {
      commentOn: postId,
      content,
      author,
      authorEmail,
    }

    if (authorUrl) {
      input.authorUrl = authorUrl
    }

    if (parentId) {
      input.parent = parentId
    }

    const result = await adamfortunaClient({
      query: createCommentMutation,
      variables: { input },
    })

    if (result.errors) {
      return new Response(
        JSON.stringify({ error: result.errors[0]?.message || 'Failed to create comment' }),
        { status: 422, headers: { 'Content-Type': 'application/json' } },
      )
    }

    const comment = result.data?.createComment?.comment
    const success = result.data?.createComment?.success

    return new Response(
      JSON.stringify({
        success,
        comment: comment
          ? {
              id: comment.databaseId,
              status: comment.status,
              date: comment.date,
              content: comment.content,
              author: {
                name: comment.author?.node?.name,
                url: comment.author?.node?.url,
                avatar: { url: comment.author?.node?.avatar?.url },
              },
            }
          : null,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    )
  } catch (e) {
    return new Response(JSON.stringify({ error: `Something went wrong: ${e}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
