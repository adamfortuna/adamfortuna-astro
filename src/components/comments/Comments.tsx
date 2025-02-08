import { Suspense, lazy } from 'react'
import pluralize from '@/lib/pluralize'
import type { Article } from '@/types'
import Comment from './Comment'
import { WebmentionSummary } from './WebmentionSummary'

export const Comments = ({ article }: { article: Article }) => (
  <div className="pt-2" id="comments">
    <div className="mx-auto">
      {article.commentCount > 0 && article.comments ? (
        <div>
          <div className="mx-auto px-3 md:max-w-3xl md:px-0 flex justify-between flex-row items-baseline">
            <h2 className="font-handwriting text-4xl text-blue-700 mb-2">
              <span className="text-5xl">{article.commentCount}</span> {pluralize('Comment', article.commentCount)}
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

          <WebmentionSummary comments={article.comments} />

          <div className="space-y-12 my-8">
            {article.comments.map((comment) => (
              <Comment comment={comment} key={`comment-${comment.id}`} article={article} />
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
    </div>
  </div>
)
