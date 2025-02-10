/* eslint-disable no-nested-ternary, react/jsx-no-useless-fragment */
import clsx from 'clsx'

import { ProjectIcon } from './ProjectIcon'
import { ProjectCategory } from './ProjectCategory'
import { ProjectStateTag } from './ProjectStateTag'
import { Tags } from '../tags/Tags'
import { ProjectLinks } from './ProjectLinks'
import type { Project } from '../../types'

export const ProductTimelineIcon = ({ project }: { project: Project }) => {
  return (
    <span
      className={clsx(
        'flex absolute justify-center items-center rounded-full bg-white ring-4 overflow-hidden',
        project.employed ? 'ring-green-400' : 'ring-blue-400',
        project.size === 'lg' ? '-left-8 w-16 h-16' : '',
        project.size === 'md' ? '-left-6 w-12 h-12 p-1' : '',
        project.size === 'sm' ? '-left-4 w-8 h-8 p-0.5' : '',
      )}
    >
      <ProjectIcon icon_url={project.icon_url} size={project.size === 'lg' ? 48 : project.size === 'md' ? 48 : 32} />
    </span>
  )
}

const ProjectTimeline = ({ project }: { project: Project }) => {
  return (
    <div className="mb-16 ml-8">
      <ProductTimelineIcon project={project} />
      <div className="ml-4 flex flex-col">
        <p className="leading-7">
          <span
            className={`dark:text-white mr-4 ${
              project.size === 'lg' ? 'text-2xl' : project.size === 'md' ? 'text-xl' : 'text-lg'
            }`}
          >
            {project.title}
          </span>
          <ProjectStateTag state={project.state} className="inline-block text-sm">
            {project.state_description}
          </ProjectStateTag>
        </p>
        <div className="block mt-1 mb-2 text-sm font-normal leading-none text-gray-500 dark:text-gray-300">
          <ul className="list-comma leading-5">
            <li>
              <b>Active:</b> {project.years_active}
            </li>
            <li>
              <ProjectCategory category={project.category} />
            </li>
            {project.employed && project.role && (
              <li>
                <b>Role:</b> {project.role}
              </li>
            )}
            {project.salary && (
              <li>
                <b>Compensation:</b> {project.salary}
              </li>
            )}
          </ul>
        </div>
        <p className="mb-2 text-base font-normal text-gray-600 dark:text-gray-400">{project.description}</p>
        <Tags tags={project.tags} />
        <div className="mt-2">
          <ProjectLinks links={project.links} size="sm" />
        </div>
      </div>
    </div>
  )
}

interface ProjectTimelineSeparatorProps {
  currentProject: Project
  previousProject: Project | null
  sortField: 'date_started' | 'date_ended'
}

const birthdate = new Date(1982, 4, 18)
function getAge(d1: Date) {
  const diff = d1.getTime() - birthdate.getTime()
  return Math.abs(Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)))
}

export const ProjectTimelineSeparator = ({
  currentProject,
  previousProject,
  sortField,
}: ProjectTimelineSeparatorProps) => {
  const currentProjectDate = new Date(currentProject[sortField])
  const currentProjectYear = currentProjectDate.getFullYear()

  const previousProjectDate = previousProject ? new Date(previousProject[sortField]) : null
  const previousProjectYear = previousProjectDate ? previousProjectDate.getFullYear() : null

  if (sortField === 'date_ended' && !previousProject) {
    return (
      <div className="mb-10 relative ml-12 lg:ml-0">
        <span className="md:ml-0 lg:absolute lg:-left-[150px] w-24 h-24 text-black dark:text-white font-black text-2xl lg:text-right">
          Now
          <span className="text-sm font-semibold text-gray-400 dark:text-gray-300 block">
            {getAge(new Date())} years old
          </span>
        </span>
      </div>
    )
  }

  if (!Number.isNaN(currentProjectYear) && currentProjectYear !== previousProjectYear) {
    return (
      <div className="mt-24 lg:mt-0 mb-4 relative ml-12 lg:ml-0">
        <span className="md:ml-0 lg:absolute lg:-left-[150px] w-24 h-24 text-black dark:text-white font-black text-2xl lg:text-right">
          {currentProjectYear}
          <span className="text-sm font-semibold text-gray-400 dark:text-gray-300 block">
            {currentProjectYear - 1982} years old
          </span>
        </span>
      </div>
    )
  }

  return <></>
}

interface ProjectsTimelineProps {
  projects: Project[]
  sortField: 'date_started' | 'date_ended'
}

export const ProjectsTimeline = ({ projects, sortField }: ProjectsTimelineProps) => {
  return (
    <div className="ml-8 md:ml-0 mt-12 relative border-l border-gray-400">
      {projects.map((project, index) => (
        <div key={`${project.title}-${sortField}`}>
          <ProjectTimelineSeparator
            currentProject={project}
            previousProject={index > 0 ? projects[index - 1] : null}
            sortField={sortField}
          />
          <ProjectTimeline key={project.slug} project={project} />
        </div>
      ))}
    </div>
  )
}
