/* eslint-disable react/jsx-no-useless-fragment */
export interface TagsProps {
  tags?: string[]
}

export const Tags = ({ tags }: TagsProps) => {
  if (!tags) {
    return <></>
  }

  const sortedTags = tags.sort()

  return (
    <ul className="flex flex-wrap font-semibold gap-2 text-xs text-white dark:text-blue-900">
      {sortedTags.map((tag) => (
        <li key={tag}>
          <span className="bg-sky-400 dark:bg-sky-400 rounded-xs px-1 py-0.5">{tag}</span>
        </li>
      ))}
    </ul>
  )
}
