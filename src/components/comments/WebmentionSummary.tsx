import pluralize from '@/lib/pluralize'
import type { Comment as CommentType } from '@/types'
import { WebmentionAvatar } from './WebmentionAvatar'

export const WebmentionSummary = ({ comments }: { comments: CommentType[] }) => {
  if (comments.length === 0) {
    return <></>
  }
  const filteredComments = comments.filter((c) => c.type === 'repost' || c.type === 'like')
  const avatarComments = filteredComments.filter((c) => (c.author.avatar.url ? c.author.avatar.url.length : 0) > 0)
  if (filteredComments.length === 0) {
    return <></>
  }
  return (
    <div className="bg-white relative md:max-w-3xl mx-auto shadow-lg lg:rounded-lg py-2 px-2 my-2 md:my-2 md:p-2 md:pb-4">
      <div className="mx-auto px-3 max-w-3xl md:px-0">
        <p className="text-gray-600 text-lg mt-2 font-semibold">
          {filteredComments.length} {pluralize('Like', filteredComments.length)} and{' '}
          {pluralize('Repost', filteredComments.length)}
        </p>
        <div className="flex flex-row -space-x-2 flex-wrap">
          {avatarComments.map((comment) => (
            <WebmentionAvatar comment={comment} key={`comment-avatar-${comment.id}`} />
          ))}
        </div>
      </div>
    </div>
  )
}
