import Link from 'next/link'
import { faStars as faStar, faFire, faTypewriter } from '@fortawesome/pro-duotone-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const FeaturingMini = () => (
  <div className="sm:hidden mt-8">
    <p>
      Currently showing <span className="font-bold text-xl text-ablue-700">Highlights</span>
      <div className="" />
    </p>
    <p />
  </div>
)

const Featuring = () => (
  <div>
    <p className="font-handwriting text-4xl text-ablue-700 mb-4 underline underline-offset-4 decoration-yellow-300">
      Featuring
    </p>

    <div className="space-y-1">
      <Link
        href="/blog/tags/highlights"
        className="flex flex-row items-center hover:bg-ablue-300/20 rounded space-x-4 p-2"
      >
        <FontAwesomeIcon icon={faStar} className="text-ablue-700 w-[32px] md:w-[48px]" size="3x" />
        <div className="flex flex-col">
          <span className="font-bold text-xl text-ablue-700">Highlights</span>
          <span className="text-ablue-200 font-semibold">My favorites</span>
        </div>
      </Link>

      <Link href="/blog/popular" className="flex flex-row items-center hover:bg-ablue-300/20 rounded space-x-4 p-2">
        <FontAwesomeIcon icon={faFire} className="text-ablue-700 w-[32px] md:w-[48px]" size="3x" />
        <div className="flex flex-col">
          <span className="font-bold text-xl text-ablue-700">
            <span className="hidden md:inline">Most </span>Popular
          </span>
          <span className="text-ablue-200 font-semibold">Most comments</span>
        </div>
      </Link>

      <Link href="/blog/all" className="flex flex-row items-center hover:bg-ablue-300/20 rounded space-x-4 p-2">
        <FontAwesomeIcon icon={faTypewriter} className="text-ablue-700 w-[32px] md:w-[48px]" size="3x" />
        <div className="flex flex-col">
          <span className="font-bold text-xl text-ablue-700">Everything</span>
          <span className="text-ablue-200 font-semibold">Some of it good</span>
        </div>
      </Link>
    </div>
  </div>
)

export default Featuring
