import { useRef, useEffect, useCallback } from 'react'
import type { NowPost } from '@/lib/getNowPosts'

function formatShortDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function formatFullDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function toDateParam(dateStr: string) {
  return dateStr.slice(0, 10)
}

interface NowTimelineProps {
  posts: NowPost[]
  selectedDate: string | null
}

export const NowTimeline = ({ posts, selectedDate }: NowTimelineProps) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const selectedRef = useRef<HTMLAnchorElement>(null)

  // Find the selected post index
  const selectedIndex = selectedDate
    ? posts.findIndex((p) => toDateParam(p.date) === selectedDate)
    : 0

  // Scroll to selected item on mount
  useEffect(() => {
    if (selectedRef.current && scrollRef.current) {
      const container = scrollRef.current
      const item = selectedRef.current
      const containerRect = container.getBoundingClientRect()
      const itemRect = item.getBoundingClientRect()
      const scrollLeft = item.offsetLeft - container.offsetLeft - containerRect.width / 2 + itemRect.width / 2
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' })
    }
  }, [selectedIndex])

  // Group posts by year for visual separation
  let lastYear = ''

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-1 py-3 px-2 scrollbar-thin"
        style={{ scrollbarWidth: 'thin' }}
      >
        {posts.map((post, index) => {
          const year = new Date(post.date).getFullYear().toString()
          const showYear = year !== lastYear
          lastYear = year
          const isSelected = index === selectedIndex

          return (
            <div key={post.id} className="flex items-center shrink-0">
              {showYear && index > 0 && (
                <span className="text-xs text-gray-400 font-semibold px-2 mr-1 border-l border-gray-300">
                  {year}
                </span>
              )}
              <a
                ref={isSelected ? selectedRef : undefined}
                href={index === 0 ? '/now' : `/now?date=${toDateParam(post.date)}`}
                className={`
                  block px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors
                  ${isSelected
                    ? 'bg-blue-600 text-white font-semibold shadow-md'
                    : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                  }
                `}
              >
                {formatShortDate(post.date)}
              </a>
            </div>
          )
        })}
      </div>

      {/* Fade edges to indicate scrollability */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-sky-100 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-sky-100 to-transparent" />
    </div>
  )
}
