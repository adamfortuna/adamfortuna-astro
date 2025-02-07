import { useEffect, useState } from 'react'
import clsx from 'clsx'
import sortBy from 'lodash/sortBy'
import type { Project } from '../../types'
import { ProjectsTimeline } from './ProjectsTimeline'
import { ProjectTags } from './ProjectTags'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/pro-regular-svg-icons'

type SortType = 'date_started' | 'date_ended' | 'technology' | 'project'
interface Sorters {
  name: string
  sortBy: SortType
}

const sortButtons = [
  {
    name: 'End date',
    sortBy: 'date_ended',
  },
  {
    name: 'Start date',
    sortBy: 'date_started',
  },
  {
    name: 'Technology',
    sortBy: 'technology',
  },
] as Sorters[]

const ProjectListing = ({ projects }: { projects: Project[] }) => {
  const sortProjects = (allProjects: Project[], sortByField: SortType) => {
    return sortBy(allProjects, sortByField).reverse()
  }

  const [sortedBy, setSortedBy] = useState<SortType>('date_ended')
  const [sortedProjects, setSortedProjects] = useState(sortProjects(projects, 'date_ended'))

  const updateResults = (sortByField: SortType) => {
    setSortedProjects(sortProjects(projects, sortByField))
  }

  const setSortBy = (sortByField: SortType) => {
    setSortedBy(sortByField)
    updateResults(sortByField)
  }

  useEffect(() => {
    updateResults(sortedBy)
  })

  return (
    <div className="px-2 md:px-0">
      <div className="flex items-center sm:justify-between sm:items-center mt-8 flex-col md:flex-row space-y-4 md:space-y-0">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-center md:text-left">Organize by</span>

          <span className="isolate inline-flex rounded-md shadow-xs">
            {sortButtons.map((sortButton, index) => (
              <button
                type="button"
                key={`button-${sortButton.sortBy}`}
                onClick={() => setSortBy(sortButton.sortBy)}
                className={clsx(
                  'pointer-cursor space-x-1 relative -ml-px inline-flex items-center border border-gray-300 dark:border-sky-600 bg-white px-2 py-1 text-sm font-medium text-gray-700  focus:z-10 focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500',
                  sortedBy === sortButton.sortBy
                    ? 'bg-gray-50 dark:bg-sky-500'
                    : 'hover:bg-gray-50 bg-white dark:hover:bg-sky-500 dark:bg-sky-400',
                  index === 0 ? 'rounded-l-md' : '',
                  index === sortButtons.length - 1 ? 'rounded-r-md' : '',
                )}
              >
                {sortedBy === sortButton.sortBy && (
                  <FontAwesomeIcon icon={faCheck} className="h-4 w-4 text-green-500 dark:text-sky-900" />
                )}
                <span>{sortButton.name}</span>
              </button>
            ))}
          </span>
        </div>
      </div>

      {(sortedBy === 'date_started' || sortedBy === 'date_ended') && (
        <ProjectsTimeline projects={sortedProjects} sortField={sortedBy} />
      )}

      {sortedBy === 'technology' && <ProjectTags projects={projects} />}
    </div>
  )
}

export default ProjectListing
