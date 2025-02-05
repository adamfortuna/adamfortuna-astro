import { Suspense } from 'react'
import { faRss, faStar, faTypewriter } from '@fortawesome/pro-duotone-svg-icons'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Af from '@/images/af.svg'
import Minafi from '@/images/minafi.svg'
import Hardcover from '@/images/hardcover.svg'
import BlogAboutCalloutWrapper from './BlogAboutCalloutWrapper'
import BlogPostsCount from './BlogPostsCount'

const BlogAboutCallout = async () => {
  return (
    <BlogAboutCalloutWrapper>
      <>
        <FontAwesomeIcon icon={faRss} className="hidden md:block text-ablue-700 w-[48px]" size="3x" />
        <div className="text-ablue-500">
          <p className="mb-4">
            Welcome to my blog! Since 2001 I've written
            <Link
              href="/blog/all"
              className="bg-yellow-400 hover:bg-yellow-500 rounded px-1 py-0.5 mx-1 text-blue-800 space-x-2"
            >
              <FontAwesomeIcon icon={faTypewriter} className="text-blue-800 w-4 h-4 inline" size="1x" />
              <span>
                <Suspense fallback={<span>1,000+</span>}>
                  <BlogPostsCount />
                </Suspense>{' '}
                posts
              </span>
            </Link>
            about software/personal development, technology, minimalism, FIRE, movies, startups and my life. These span{' '}
            <b>three separate blogs</b>, with all articles linked from here.
          </p>
          <p className="mb-4">
            <Link
              href="/blog/projects/adamfortuna"
              className="bg-yellow-400 hover:bg-yellow-500 rounded px-1 py-0.5 mx-1 text-blue-800"
            >
              <Af className="w-4 h-4 text-ablue-700 inline mb-0.5" /> <span>This blog</span>
            </Link>{' '}
            Focuses on exploring the intersection of minimalism, mindfulness and technology + my journal.
          </p>
          <p className="mb-4">
            <Link
              href="/blog/projects/minafi"
              className="bg-yellow-400 hover:bg-yellow-500 rounded px-1 py-0.5 mx-1 text-blue-800"
            >
              <Minafi className="w-4 h-4 inline mb-0.5" /> <span>Minafi</span>
            </Link>{' '}
            Financial indepenence, investing and my journy to retire early (36 ✔️).
          </p>
          <p className="mb-4">
            <Link
              href="/blog/projects/hardcover"
              className="bg-yellow-400 hover:bg-yellow-500 rounded px-1 py-0.5 mx-1 text-blue-800"
            >
              <Hardcover className="w-5 h-5 inline mb-0.5" /> <span>Hardcover</span>
            </Link>{' '}
            Building Hardcover in public.
          </p>
          <p>
            Check out some
            <Link
              href="/blog/tags/highlights"
              className="bg-yellow-400 hover:bg-yellow-500 rounded px-1 py-0.5 mx-1 text-blue-800 space-x-2"
            >
              <FontAwesomeIcon icon={faStar} className="text-blue-800 inline w-4 h-4" size="1x" />
              <span>highlights</span>
            </Link>
            and stay in touch by following me on{' '}
            <a href="https://ruby.social/@adam" className="link--blue" target="_blank" rel="noreferrer">
              Mastodon
            </a>
            , subscribing to my{' '}
            <Link href="/newsletter" className="link--blue">
              newsletter
            </Link>{' '}
            or{' '}
            <a href="/feed" target="_blank" className="link--blue">
              RSS feed
            </a>
            .
          </p>
        </div>
      </>
    </BlogAboutCalloutWrapper>
  )
}

export default BlogAboutCallout
