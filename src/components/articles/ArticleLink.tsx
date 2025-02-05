import { useMemo } from 'react'

import { dateFormatLong } from '@/lib/dateService'
import { Link } from '@/components/layout/Link'
import { Article } from '@/types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquareUpRight, faComment } from '@fortawesome/pro-regular-svg-icons'
import { faStar } from '@fortawesome/pro-solid-svg-icons'
import clsx from 'clsx'
import ArticleProjectIcon from './ArticleProjectIcon'

export interface ArticleLinkProps {
  article: Article
}

export const ArticleLink = ({ article }: ArticleLinkProps) => {
  const publishDate = useMemo(() => dateFormatLong(article.date), [article.date])
  const isHighlighted = useMemo(() => {
    return article.tags?.length && article.tags.length > 0
      ? article.tags.map((t) => t.slug).indexOf('highlights') !== -1
      : false
  }, [article.tags])

  return (
    <div className={clsx('my-2 flex justify-between p-1', isHighlighted ? 'rounded bg-yellow-100' : '')}>
      <div className="flex flex-col">
        <div className="flex flex-row items-center space-x-4">
          <ArticleProjectIcon project={article.project} />
          {article.external ? (
            <a
              href={article.url}
              className="text-lg link--blue font-semibold flex-grow"
              target="_blank"
              rel="noreferrer"
            >
              <span>{article.title}</span>
              <FontAwesomeIcon size="1x" icon={faSquareUpRight} className="inline ml-2 max-w-[24px]" />
              {isHighlighted && <FontAwesomeIcon size="1x" icon={faStar} className="inline ml-2 max-w-[24px]" />}
            </a>
          ) : (
            <Link href={`/${article.slug}`} className="text-lg link--blue font-semibold flex-grow">
              <span>{article.title}</span>
              {isHighlighted && <FontAwesomeIcon size="sm" icon={faStar} className="inline ml-2 max-w-[18px]" />}
            </Link>
          )}
        </div>
        {isHighlighted && (article.excerpt?.length || 0) > 0 && (
          <p className="text-gray-600 ml-[48px]">{article.excerpt}</p>
        )}
      </div>
      <p className="hidden md:block text-ablue-500 text-sm text-right whitespace-nowrap space-x-2">
        {article.commentCount > 0 && (
          <span className={`${isHighlighted ? 'border-yellow-200' : 'bg-sky-100'} py-0.5 px-1 rounded`}>
            <FontAwesomeIcon size="sm" icon={faComment} className="inline ml-2 max-w-[24px] mr-1" />
            <span>{article.commentCount}</span>
          </span>
        )}
        <span>{publishDate}</span>
      </p>
    </div>
  )
}
