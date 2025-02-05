import { getPostsCount } from '@/queries/wordpress/getPostsCount'

const BlogPostsCount = async (): Promise<React.ReactElement> => {
  const postsCount = (await getPostsCount()) || 624
  return <span>{postsCount.toLocaleString()}</span>
}

export default BlogPostsCount
