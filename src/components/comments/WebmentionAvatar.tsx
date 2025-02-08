import type { Comment as CommentType } from '@/types'
import { extractFediverseName } from '@/lib/stringService'

export const WebmentionAvatar = ({ comment }: { comment: CommentType }) => {
  const id = `comment-avatar-${comment.id}`
  const username = extractFediverseName(comment.author.url || '', comment.author.name)

  if (comment.author.url) {
    return (
      <>
        <a
          href={comment.author.url}
          target="_blank"
          className="group relative"
          rel="noreferrer"
          data-tooltip-content={username}
          id={id}
        >
          <span className="bg-slate-800 -mt-6 font-semibold px-1 py-0.5 absolute rounded-lg hidden group-hover:block text-white z-10">
            {username}
          </span>
          <img
            src={comment.author.avatar.url}
            loading="lazy"
            width={64}
            height={64}
            className="rounded-full w-12 h-12 ring-4 ring-transparent group-hover:ring-blue-500"
            alt={comment.author.name}
          />
        </a>
      </>
    )
  }
  return (
    <>
      <img
        src={comment.author.avatar.url}
        loading="lazy"
        width={64}
        height={64}
        className="rounded-full w-12 h-12"
        alt={username}
        id={id}
      />
    </>
  )
}
