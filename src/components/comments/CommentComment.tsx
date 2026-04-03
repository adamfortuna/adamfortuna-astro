import type { Article, Comment as CommentType } from '@/types'
import clsx from 'clsx'
import Comment from './Comment'
import { CommentForm } from './CommentForm'

interface CommentCommentProps {
  article: Article
  comment: CommentType
  depth?: number
  maxDepth?: number
  replyingTo?: number | null
  onReply?: (commentId: number) => void
  onCancelReply?: () => void
  onCommentSubmitted?: (comment: CommentType, parentId?: number) => void
  pendingCommentIds?: Set<number>
}

export const CommentComment = ({
  comment,
  article,
  depth = 1,
  maxDepth = 5,
  replyingTo,
  onReply,
  onCancelReply,
  onCommentSubmitted,
  pendingCommentIds,
}: CommentCommentProps) => {
  const isPending = pendingCommentIds?.has(comment.id)
  const canReply = article.allowComments && depth < maxDepth
  const isReplying = replyingTo === comment.id

  return (
    <div className="max-w-3xl mx-auto">
      <a id={`comment-${comment.id}`} className="sr-only">
        Link to Comment
      </a>
      <div
        className={clsx(
          'bg-white',
          comment.root
            ? 'shadow-lg rounded-lg p-4 pr-2 my-2 md:my-6 md:p-6'
            : 'border-grey-100 border-t my-2 pt-4 pl-4 md:px-6 pb-0',
          isPending && 'ring-2 ring-blue-300 ring-offset-2',
        )}
      >
        <div className="flex">
          {comment.author.avatar?.url ? (
            <img
              className="rounded-lg w-16 h-16"
              loading="lazy"
              height={64}
              width={64}
              src={comment.author.avatar.url}
              alt={comment.author.name}
            />
          ) : (
            <div className="rounded-lg w-16 h-16 bg-gray-200 flex items-center justify-center text-gray-500 text-xl font-bold">
              {comment.author.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
          )}

          <div className="flex-1 ml-6 flex justify-center flex-col">
            <p className="text-xl mb-2">
              {comment.author.url ? (
                <a href={comment.author.url} className="link--blue" rel="noopener nofollow noreferrer" target="_blank">
                  {comment.author.name}
                </a>
              ) : (
                <span>{comment.author.name}</span>
              )}
              {isPending && (
                <span className="ml-2 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  Awaiting moderation
                </span>
              )}
            </p>
            <p>
              <a href={`#comment-${comment.id}`} className="text-grey-700 font-400 no-underline hover:underline">
                {comment.date.toString()}
              </a>
            </p>
          </div>
        </div>
        <div className="comment--text mt-6 mb-4 text-grey-800 tracking-normal leading-normal text-base md:text-lg text-justify whitespace-pre-line">
          {comment.content}
        </div>

        {canReply && !isReplying && (
          <button
            type="button"
            onClick={() => onReply?.(comment.id)}
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline mb-2"
          >
            Reply
          </button>
        )}

        {isReplying && onCommentSubmitted && (
          <div className="mb-4 mt-2 pl-2 border-l-2 border-blue-200">
            <CommentForm
              postId={article.id}
              parentId={comment.id}
              onCommentSubmitted={(newComment) => onCommentSubmitted(newComment, comment.id)}
              onCancel={onCancelReply}
            />
          </div>
        )}

        {comment.replies.length > 0 ? (
          <div className="py-2">
            {comment.replies.map((reply) => (
              <Comment
                comment={reply}
                article={article}
                key={`comment-${reply.id}`}
                depth={depth + 1}
                maxDepth={maxDepth}
                replyingTo={replyingTo}
                onReply={onReply}
                onCancelReply={onCancelReply}
                onCommentSubmitted={onCommentSubmitted}
                pendingCommentIds={pendingCommentIds}
              />
            ))}
          </div>
        ) : (
          false
        )}
      </div>
    </div>
  )
}
export default CommentComment
