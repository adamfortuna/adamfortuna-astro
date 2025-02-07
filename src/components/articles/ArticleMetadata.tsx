/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { Article } from '@/types'

const ArticleMetadata = ({ article }: { article: Article }) => (
  <>
    <meta property="og:title" content={article.title} />
    <meta property="og:type" content="article" />
    <meta property="og:url" content={`${process.env.PUBLIC_URL}/${article.slug}`} />

    {article.featuredImage && (
      <>
        <meta property="og:image" content={article.featuredImage.sourceUrl} />
        {article.featuredImage.mediaDetails && (
          <>
            <meta property="og:image:width" content={String(article.featuredImage.mediaDetails.width)} />
            <meta property="og:image:height" content={String(article.featuredImage.mediaDetails.height)} />
          </>
        )}
      </>
    )}
    <meta property="og:description" content={article.excerpt || article.title} />
    <meta name="description" content={article.excerpt || article.title} />

    <meta property="article:published_time" content={article.date} />
    <meta property="article:author" content="Adam Fortuna" />
    <meta property="article:section" content="Technology" />
    {article.tags && article.tags.length > 0 && (
      <meta property="article:tag" content={article.tags?.map((t) => t.name).join(',')} />
    )}

    <meta name="twitter:card" content="summary" />
    <meta name="twitter:creator" content="@adamfortuna" />
  </>
)

export default ArticleMetadata
