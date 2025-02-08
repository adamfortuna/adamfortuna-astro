import type { Article, Comment as CommentType } from '@/types'
import clsx from 'clsx'
import Comment from './Comment'

export const CommentComment = ({ comment, article }: { article: Article; comment: CommentType }) => {
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
        )}
      >
        <div className="flex">
          <img
            className="rounded-lg w-16 h-16"
            loading="lazy"
            height={64}
            width={64}
            src={comment.author.avatar.url}
            alt={comment.author.name}
          />

          <div className="flex-1 ml-6 flex justify-center flex-col">
            <p className="text-xl mb-2">
              {comment.author.url ? (
                <a href={comment.author.url} className="link--blue" rel="noopener nofollow noreferrer" target="_blank">
                  {comment.author.name}
                </a>
              ) : (
                <span>{comment.author.name}</span>
              )}
            </p>
            <p>
              <a href={`#comment-#${comment.id}`} className="text-grey-700 font-400 no-underline hover:underline">
                {comment.date.toString()}
              </a>
            </p>
          </div>
        </div>
        <div className="comment--text mt-6 mb-4 text-grey-800 tracking-normal leading-normal text-base md:text-lg text-justify whitespace-pre-line">
          {comment.content}
        </div>

        {comment.replies.length > 0 ? (
          <div className="py-2">
            {comment.replies.map((reply) => (
              <Comment comment={reply} article={article} key={`comment-${reply.id}`} />
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
