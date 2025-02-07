/* eslint-disable no-nested-ternary, react/jsx-no-useless-fragment */
import clsx from 'clsx'
import { useMemo } from 'react'
import flatten from 'lodash/flatten'
import uniq from 'lodash/uniq'
import sortBy from 'lodash/sortBy'
import compact from 'lodash/compact'
import { ProjectIcon } from './ProjectIcon'
import { ProjectCategory } from './ProjectCategory'
import { ProjectStateTag } from './ProjectStateTag'
import { ProjectLinks } from './ProjectLinks'
import type { Project } from '../../types'

export const ProductTechnoloyIcon = ({ project }: { project: Project }) => {
  return (
    <span
      className={clsx(
        'drop-shadow-xl flex absolute justify-center items-center rounded-full bg-white ring-4',
        project.employed ? 'ring-green-400' : 'ring-blue-400',
        '-left-12 w-8 h-8',
      )}
    >
      <ProjectIcon icon_url={project.icon_url} size={32} />
    </span>
  )
}

const ProjectTimeline = ({ project }: { project: Project }) => {
  return (
    <div className="mb-4 relative">
      <ProductTechnoloyIcon project={project} />
      <div className="flex flex-col">
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
        {project.size === 'lg' ? (
          <>
            <div className="block mt-1 mb-2 text-sm font-normal leading-none text-gray-500 dark:text-gray-300">
              <ul className="list-comma leading-5">
                <li>
                  <b>Active:</b> {project.years_active}
                </li>
                <li>
                  <ProjectCategory category={project.category} />
                </li>
                {project.employed && (
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
            <div className="mt-2">
              <ProjectLinks links={project.links} size="sm" />
            </div>
          </>
        ) : (
          <>
            <p className="mb-2 text-base font-normal text-gray-600 dark:text-gray-400">{project.description}</p>
            <div className="mt-2">
              <ProjectLinks links={project.links} size="sm" />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

interface ProjectsTagProps {
  projects: Project[]
  tag: string
}
export const ProjectsTag = ({ projects, tag }: ProjectsTagProps) => {
  const filteredProjects = useMemo(() => {
    const pr = projects.filter((p) => (p.tags || []).indexOf(tag) !== -1)
    return sortBy(pr, 'title')
  }, [projects, tag])

  return (
    <div>
      <h3 className="text-2xl font-bold mb-4 dark:text-white">{tag}</h3>
      {filteredProjects.map((project) => (
        <ProjectTimeline key={project.slug} project={project} />
      ))}
    </div>
  )
}

interface ProjectsTagsProps {
  projects: Project[]
}
export const ProjectTags = ({ projects }: ProjectsTagsProps) => {
  const tags = useMemo(() => {
    const a = projects.map((project) => project.tags)
    const b = compact(flatten(a))
    return uniq(b).sort()
  }, [projects])

  return (
    <div className="ml-12 md:ml-0 mt-12 relative space-y-16">
      {tags.map((tag) => (
        <ProjectsTag key={`tag-${tag}`} tag={tag} projects={projects} />
      ))}
    </div>
  )
}
