import { useForm } from 'react-hook-form'
import { useState } from 'react'
import type { Comment } from '@/types'

interface CommentFormData {
  author: string
  authorEmail: string
  authorUrl: string
  content: string
}

interface CommentFormProps {
  postId: number
  parentId?: number
  onCommentSubmitted: (comment: Comment) => void
  onCancel?: () => void
}

export const CommentForm = ({ postId, parentId, onCommentSubmitted, onCancel }: CommentFormProps) => {
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormData>({
    defaultValues: {
      author: typeof window !== 'undefined' ? localStorage.getItem('comment_author') || '' : '',
      authorEmail: typeof window !== 'undefined' ? localStorage.getItem('comment_email') || '' : '',
      authorUrl: typeof window !== 'undefined' ? localStorage.getItem('comment_url') || '' : '',
      content: '',
    },
  })

  const onSubmit = async (data: CommentFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Remember commenter info for next time
      localStorage.setItem('comment_author', data.author)
      localStorage.setItem('comment_email', data.authorEmail)
      if (data.authorUrl) {
        localStorage.setItem('comment_url', data.authorUrl)
      }

      const res = await fetch('/api/comments.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          parentId: parentId || null,
          author: data.author,
          authorEmail: data.authorEmail,
          authorUrl: data.authorUrl || null,
          content: data.content,
        }),
      })

      const result = await res.json()

      if (!res.ok || result.error) {
        setSubmitError(result.error || 'Failed to submit comment')
        return
      }

      const newComment: Comment = {
        id: result.comment?.id || Date.now(),
        author: result.comment?.author || {
          name: data.author,
          url: data.authorUrl || undefined,
          avatar: { url: result.comment?.author?.avatar?.url },
        },
        content: data.content,
        date: result.comment?.date || new Date().toISOString(),
        type: 'comment',
        webmention: null as any,
        root: !parentId,
        parentDatabaseId: parentId || 0,
        replies: [],
      }

      onCommentSubmitted(newComment)
      reset({ ...data, content: '' })
    } catch {
      setSubmitError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={`author-${parentId || 'root'}`} className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id={`author-${parentId || 'root'}`}
            type="text"
            {...register('author', { required: 'Name is required' })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          />
          {errors.author && <p className="text-red-500 text-xs mt-1">{errors.author.message}</p>}
        </div>

        <div>
          <label htmlFor={`email-${parentId || 'root'}`} className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id={`email-${parentId || 'root'}`}
            type="email"
            {...register('authorEmail', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
            })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          />
          {errors.authorEmail && <p className="text-red-500 text-xs mt-1">{errors.authorEmail.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor={`url-${parentId || 'root'}`} className="block text-sm font-medium text-gray-700 mb-1">
          Website
        </label>
        <input
          id={`url-${parentId || 'root'}`}
          type="url"
          {...register('authorUrl')}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          placeholder="https://"
        />
      </div>

      <div>
        <label htmlFor={`content-${parentId || 'root'}`} className="block text-sm font-medium text-gray-700 mb-1">
          Comment <span className="text-red-500">*</span>
        </label>
        <textarea
          id={`content-${parentId || 'root'}`}
          rows={4}
          {...register('content', { required: 'Comment is required' })}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
        />
        {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>}
      </div>

      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-red-700 text-sm">{submitError}</p>
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Post Comment'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
