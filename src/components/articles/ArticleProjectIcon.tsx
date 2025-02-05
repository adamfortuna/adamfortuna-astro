import Af from '@/images/af.svg'
import Minafi from '@/images/minafi.svg'
import Hardcover from '@/images/hardcover.svg'
import { WordpressClientIdentifier } from '@/types'

const ArticleProjectIcon = ({ project }: { project: WordpressClientIdentifier }) => {
  if (project === 'hardcover') {
    return <Hardcover className="w-8 h-8 min-w-[32px]" />
  }
  if (project === 'minafi') {
    return <Minafi className="w-6 h-6 text-blue-700 min-w-[32px]" />
  }
  return <Af className="w-6 h-6 text-blue-700 min-w-[32px]" />
}

export default ArticleProjectIcon
