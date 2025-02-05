'use client'

import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronRight } from '@fortawesome/pro-solid-svg-icons'
import clsx from 'clsx'

const ExpandedKey = 'blog-about-expanded'

const getExpandedFromLocalStorage = (): string | null => {
  return typeof localStorage !== 'undefined' ? localStorage.getItem(ExpandedKey) : '1'
}
const BlogAboutCalloutWrapper = ({ children }: { children: React.ReactElement }) => {
  const [expanded, setExpanded] = useState(true)

  const toggleExpanded = () => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(ExpandedKey, !expanded ? '1' : '0')
    }
    setExpanded((e) => {
      return !e
    })
  }

  useEffect(() => {
    const e = getExpandedFromLocalStorage()
    setExpanded(e === null || e === '1')
  }, [])

  return (
    <div className="bg-yellow-200 rounded leading-5">
      <button
        type="button"
        className={clsx(
          'p-2 w-full rounded text-ablue-700 font-bold text-xl flex items-center justify-between space-x-2 hover:bg-yellow-400 bg-yellow-300',
          expanded ? 'border-b border-yellow-400 rounded-b-none' : '',
        )}
        onClick={toggleExpanded}
      >
        <span>About this blog</span>
        <FontAwesomeIcon icon={expanded ? faChevronDown : faChevronRight} className="max-w-[23px]" />
      </button>
      <div className={clsx('p-4 flex flex-row md:space-x-4 items-center', expanded ? '' : 'hidden')}>{children}</div>
    </div>
  )
}

export default BlogAboutCalloutWrapper
