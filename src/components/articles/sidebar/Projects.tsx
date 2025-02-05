import Link from 'next/link'
import Af from '@/images/af.svg'
import Minafi from '@/images/minafi.svg'
import Hardcover from '@/images/hardcover.svg'

const Projects = () => (
  <div>
    <p className="font-handwriting text-4xl text-ablue-700 mb-4 underline underline-offset-4 decoration-yellow-300">
      Active Projects
    </p>

    <div className="space-y-1">
      <Link
        href="/blog/projects/adamfortuna"
        className="flex flex-row items-center hover:bg-ablue-300/20 rounded space-x-4 p-2"
      >
        <Af className="w-10 h-10 text-ablue-700" />
        <div className="flex flex-col">
          <span className="font-bold text-xl text-ablue-700">Adam Fortuna</span>
          <span className="text-ablue-200 font-semibold">This site. So meta.</span>
        </div>
      </Link>

      <Link
        href="/blog/projects/hardcover"
        className="flex flex-row items-center hover:bg-ablue-300/20 rounded space-x-4 p-2"
      >
        <Hardcover className="w-10 h-10 text-ablue-700" />
        <div className="flex flex-col">
          <span className="font-bold text-xl text-ablue-700">Hardcover</span>
          <span className="text-ablue-200 font-semibold">A social network for readers</span>
        </div>
      </Link>

      <Link
        href="/blog/projects/minafi"
        className="flex flex-row items-center hover:bg-ablue-300/20 rounded space-x-4 p-2"
      >
        <Minafi className="w-10 h-10 text-ablue-700" />
        <div className="flex flex-col">
          <span className="font-bold text-xl text-ablue-700">Minafi</span>
          <span className="text-ablue-200 font-semibold">FIRE & finance blog</span>
        </div>
      </Link>
    </div>
  </div>
)

export default Projects
