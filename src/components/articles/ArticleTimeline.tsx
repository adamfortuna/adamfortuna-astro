import { useMemo } from 'react'
import { Article } from '@/types'
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
      <div className="mt-24">
        <span className="text-black dark:text-gray-100 font-black text-2xl">
          {currentArticleYear}
          <ArticlesCount articles={articles} year={currentArticleYear} />
        </span>
      </div>
    )
  }

  return <></>
}

export interface ArticleTimelineProps {
  articles: Article[]
}

export const ArticleTimeline = ({ articles }: ArticleTimelineProps) => {
  return (
    <div>
      {articles.map((article, index) => (
        <div key={`${article.slug}-${article.title}-${article.date}`}>
          <ArticleTimelineSeparator
            articles={articles}
            currentArticle={article}
            previousArticle={index > 0 ? articles[index - 1] : null}
          />
          <ArticleLink article={article} />
        </div>
      ))}
    </div>
  )
}
