import type { Article, Comment as CommentType } from '@/types'
import { Webmention } from './types/Webmention'
import { CommentComment } from './CommentComment'

const Comment = ({ article, comment }: { article: Article; comment: CommentType }) => {
  const type = comment.type.toLocaleLowerCase()

  if (type === 'mention') {
    return <Webmention comment={comment} />
  }
  if (type === 'comment') {
    return <CommentComment comment={comment} article={article} />
  }
  return <></>
}
export default Comment
