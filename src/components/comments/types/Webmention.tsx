/* eslint-disable @next/next/no-img-element, react/no-danger */
import { useMemo } from 'react'
import { Comment as CommentType } from '@/types'
import clsx from 'clsx'
import { stripHtml } from 'string-strip-html'
import { dateFullLong } from '@/lib/dateService'

const ReadMoreLink = ({ url }: { url: string }) => {
  return (
    <>
      Read more at{' '}
      <a href={url} target="_blank" rel="nofollow noopener noreferrer">
        {url.replace(/https?:\/\//, '')}
      </a>
    </>
  )
}
export const Webmention = ({ comment }: { comment: CommentType }) => {
  const content = useMemo(() => {
    const commentContent =
      comment.type === 'mention' && comment.content.length > 0
        ? stripHtml(comment.content).result
        : comment.content || ''

    if (comment.type === 'mention') {
      return commentContent.length > 280 ? `${commentContent.substring(0, 280)}...` : commentContent
    }
    return commentContent
  }, [comment.type, comment.content])
  return (
    <div
      id={`comment-${comment.id}`}
      className={clsx(
        'bg-white relative md:max-w-3xl mx-auto',
        comment.root ? 'shadow-lg lg:rounded-lg py-4 px-2 my-2 md:my-6 md:p-6' : 'my-2 pb-0 ml-4 md:ml-8',
      )}
    >
      <div className="mx-auto px-3 md:max-w-3xl md:px-0 flex items-center">
        <img
          loading="lazy"
          width={64}
          height={64}
          className="rounded-lg w-12 h-12"
          src={comment.author.avatar.url}
          alt={comment.author.name}
        />

        <div className="flex-1 ml-6">
          <p className="text-base md:text-lg md:mb-2 leading-5">
            {comment.author.url ? (
              <a
                href={comment.author.url}
                className="link--blue whitespace-wrap"
                rel="noopener nofollow noreferrer"
                target="_blank"
              >
                {comment.author.name}
              </a>
            ) : (
              <>{comment.author.name}</>
            )}{' '}
            {comment.type === 'mention' ? (
              <>
                mentioned <span className="md:hidden">on</span>
                <span className="hidden md:inline">this article on</span>
              </>
            ) : (
              <>
                commented on
                <span className="hidden md:inline"> this article on</span>
              </>
            )}{' '}
            <a
              href={`#comment-${comment.id}`}
              className="block md:inline text-gray-700 hover:underline text-sm md:text-base"
            >
              #{dateFullLong(comment.date)}.
            </a>
          </p>
        </div>
      </div>

      <div className="prose dark:prose-invert">
        <blockquote style={{ marginTop: '10px', paddingTop: '10px', marginBottom: '0px' }}>
          <span dangerouslySetInnerHTML={{ __html: content || '' }} />
          <cite className="mt-2 text-base" style={{ width: '100%' }}>
            <ReadMoreLink url={comment.webmention.source_url} />
          </cite>
        </blockquote>
      </div>
    </div>
  )
}
