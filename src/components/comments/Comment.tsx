import type { Article, Comment as CommentType } from '@/types'
import { Webmention } from './types/Webmention'
import { CommentComment } from './CommentComment'

interface CommentProps {
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

const Comment = ({ article, comment, depth = 1, maxDepth = 5, replyingTo, onReply, onCancelReply, onCommentSubmitted, pendingCommentIds }: CommentProps) => {
  const type = comment.type.toLocaleLowerCase()

  if (type === 'mention') {
    return <Webmention comment={comment} />
  }
  if (type === 'comment') {
    return (
      <CommentComment
        comment={comment}
        article={article}
        depth={depth}
        maxDepth={maxDepth}
        replyingTo={replyingTo}
        onReply={onReply}
        onCancelReply={onCancelReply}
        onCommentSubmitted={onCommentSubmitted}
        pendingCommentIds={pendingCommentIds}
      />
    )
  }
  return <></>
}
export default Comment
