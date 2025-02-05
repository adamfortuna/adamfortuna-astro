import { useMemo } from 'react'
import { Article } from '@/types'
import Pagination from '@/components/layout/Pagination'
import { ArticleLink } from './ArticleLink'

interface ArticlesCountProps {
  articles: Article[]
  year: number
}
export const ArticlesCount = ({ articles, year }: ArticlesCountProps) => {
  const count = useMemo(() => {
    return articles.filter((a) => new Date(a.date).getFullYear() === year).length
  }, [articles, year])

  return (
    <span className="text-sm font-semibold text-gray-400 dark:text-gray-200 block">
      {count} article{count === 1 ? '' : 's'}
    </span>
  )
}

interface ArticleTimelineSeparatorProps {
  articles: Article[]
  currentArticle: Article
  previousArticle: Article | null
}

export const ArticleTimelineSeparator = ({
  articles,
  currentArticle,
  previousArticle,
}: ArticleTimelineSeparatorProps) => {
  const currentArticleDate = new Date(currentArticle.date)
  const currentArticleYear = currentArticleDate.getFullYear()

  const previousArticleDate = previousArticle ? new Date(previousArticle.date) : null
  const previousProjectYear = previousArticleDate ? previousArticleDate.getFullYear() : null

  if (!Number.isNaN(currentArticleYear) && currentArticleYear !== previousProjectYear) {
    return (
      <div className="mt-8 md:mt-12 flex justify-between items-baseline border-yellow-300 border-b-4">
        <span className="text-blue-700 dark:text-gray-100 font-bold text-4xl font-handwriting">
          {currentArticleYear}
        </span>
        <ArticlesCount articles={articles} year={currentArticleYear} />
      </div>
    )
  }

  return <></>
}

export interface ArticleTimelineProps {
  articles: Article[]
  page?: number
  totalPages?: number
  url: string
  showSeparator?: boolean
}

export const ArticlesList = ({ articles, page, totalPages, url, showSeparator = true }: ArticleTimelineProps) => {
  return (
    <div>
      {articles.map((article, index) => (
        <div key={`${article.slug}-${article.title}-${article.date}`}>
          {showSeparator && (
            <ArticleTimelineSeparator
              articles={articles}
              currentArticle={article}
              previousArticle={index > 0 ? articles[index - 1] : null}
            />
          )}
          <ArticleLink article={article} />
        </div>
      ))}

      {page && totalPages && <Pagination page={page} totalPages={totalPages} url={url} />}
    </div>
  )
}
