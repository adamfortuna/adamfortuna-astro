import Link from 'next/link'

const Tag = ({ tag }: { tag: string }) => (
  <p>
    <Link href={`/blog/tags/${tag}`} className="link--blue">
      # {tag}
    </Link>
  </p>
)

const groups = [
  {
    name: 'Development',
    tags: ['code', 'design', 'javascript', 'product', 'ruby', 'tech'].sort(),
  },
  {
    name: 'Personal',
    tags: ['betterment', 'journal', 'photos', 'travel', 'year-in-review'].sort(),
  },
  {
    name: 'Misc',
    tags: ['personal-finance', 'fire', 'books', 'mindfulness', 'minimalism', 'interactive'].sort(),
  },
]
const Tags = () => (
  <div>
    <p className="font-handwriting text-4xl text-blue-700 mb-4">
      <Link href="/blog/tags" className="decoration-yellow-300 underline underline-offset-4 hover:no-underline">
        Tags
      </Link>
    </p>

    {groups.map((group) => (
      <div key={group.name} className="mb-3">
        <p className="font-semibold text-gray-600">{group.name}</p>
        <div className="space-y-1 ml-2">
          {group.tags.map((t) => (
            <Tag key={t} tag={t} />
          ))}
        </div>
      </div>
    ))}
  </div>
)

export default Tags
