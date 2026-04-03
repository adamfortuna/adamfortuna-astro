import { useState, useCallback } from 'react'
import pluralize from '@/lib/pluralize'
import type { Article, Comment as CommentType } from '@/types'
import Comment from './Comment'
import { WebmentionSummary } from './WebmentionSummary'
import { CommentForm } from './CommentForm'

const MAX_REPLY_DEPTH = 5

function insertReply(comments: CommentType[], parentId: number, newComment: CommentType): CommentType[] {
  return comments.map((c) => {
    if (c.id === parentId) {
      return { ...c, replies: [...c.replies, newComment] }
    }
    if (c.replies.length > 0) {
      return { ...c, replies: insertReply(c.replies, parentId, newComment) }
    }
    return c
  })
}

export const Comments = ({ article }: { article: Article }) => {
  const [comments, setComments] = useState<CommentType[]>(article.comments || [])
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [pendingCommentIds, setPendingCommentIds] = useState<Set<number>>(new Set())

  const handleNewComment = useCallback(
    (newComment: CommentType, parentId?: number) => {
      if (parentId) {
        setComments((prev) => insertReply(prev, parentId, newComment))
      } else {
        setComments((prev) => [...prev, newComment])
      }
      setPendingCommentIds((prev) => new Set(prev).add(newComment.id))
      setReplyingTo(null)
    },
    [],
  )

  const handleReply = useCallback((commentId: number) => {
    setReplyingTo(commentId)
  }, [])

  const handleCancelReply = useCallback(() => {
    setReplyingTo(null)
  }, [])

  const totalCount = (article.commentCount || 0) + pendingCommentIds.size

  return (
    <div className="pt-2" id="comments">
      <div className="mx-auto">
        {totalCount > 0 || comments.length > 0 ? (
          <div>
            <div className="mx-auto px-3 md:max-w-3xl md:px-0 flex justify-between flex-row items-baseline">
              <h2 className="font-handwriting text-4xl text-blue-700 mb-2">
                <span className="text-5xl">{totalCount}</span> {pluralize('Comment', totalCount)}
              </h2>
              {article.allowPings ? (
                <a
                  href="https://wp.adamfortuna.com/wp-json/webmention/1.0/endpoint"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:no-underline text-gray-700 text-sm hidden md:inline-block"
                >
                  Add a webmention
                </a>
              ) : (
                false
              )}
            </div>

            <WebmentionSummary comments={comments} />

            <div className="space-y-12 my-8">
              {comments.map((comment) => (
                <Comment
                  comment={comment}
                  key={`comment-${comment.id}`}
                  article={article}
                  depth={1}
                  maxDepth={MAX_REPLY_DEPTH}
                  replyingTo={replyingTo}
                  onReply={handleReply}
                  onCancelReply={handleCancelReply}
                  onCommentSubmitted={handleNewComment}
                  pendingCommentIds={pendingCommentIds}
                />
              ))}
            </div>
          </div>
        ) : (
          <>
            {article.allowPings ? (
              <div className="bg-white relative md:max-w-3xl mx-auto shadow-lg lg:rounded-lg py-2 px-2 my-2 md:my-2 md:p-2 md:pb-4 flex flex-row justify-center items-center space-x-6">
                <p className="mx-auto px-3 md:max-w-3xl md:px-0 pt-1">
                  Did you link to this article?{' '}
                  <a
                    href="https://wp.adamfortuna.com/wp-json/webmention/1.0/endpoint"
                    target="_blank"
                    rel="nofollow noreferrer"
                    className="underline hover:no-underline link--blue font-semibold"
                  >
                    Add it here
                  </a>
                  <span className="hidden md:inline"> and I'll include it</span>
                </p>
              </div>
            ) : (
              false
            )}
          </>
        )}

        {article.allowComments && (
          <div className="max-w-3xl mx-auto mt-8 mb-4">
            <div className="bg-white shadow-lg rounded-lg p-4 md:p-6">
              <h3 className="font-handwriting text-3xl text-blue-700 mb-4">Leave a Comment</h3>
              <CommentForm
                postId={article.id}
                onCommentSubmitted={(comment) => handleNewComment(comment)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
