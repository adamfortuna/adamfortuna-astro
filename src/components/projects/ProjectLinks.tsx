/* eslint-disable react/jsx-no-useless-fragment */
import { useMemo } from 'react'
import sortBy from 'lodash/sortBy'

import { Link } from '../layout/Link'
import type { LinkThemeProps } from '../layout/Link'
import type { Link as LinkType } from '../../types'
import { FaIcon, type FaIconName } from '../layout/FaIcon'


export interface ProjectLinksProps {
  links?: LinkType[]
  size?: LinkThemeProps['size']
}

const lookupIcon = (link: LinkType): FaIconName => {
  if (link.url.indexOf('https://github.com') !== -1) {
    return 'github'
  }
  if (link.url.indexOf('https://web.archive.org') !== -1) {
    return 'hard-drive'
  }
  return 'link'
}

const ProjectLink = ({ link, size }: { link: LinkType; size: LinkThemeProps['size'] }) => {
  const icon = useMemo(() => {
    return lookupIcon(link)
  }, [link])
  return (
    <li className="mr-2" key={link.url}>
      <Link
        target="_blank"
        href={link.url as string}
        size={size}
        variant="button"
        className="flex space-x-2 items-center"
      >
        <FaIcon name={icon} className="h-4 w-4 text-sky-800 dark:text-sky-100 group-hover:text-black" />
        <span>{link.title}</span>
      </Link>
    </li>
  )
}
export const ProjectLinks = ({ links, size = 'sm' }: ProjectLinksProps) => {
  if (!links) {
    return <></>
  }

  const sortedLinks = sortBy(links, (t) => t.title)

  return (
    <ul className="flex flex-wrap font-semibold leading-10">
      {sortedLinks.map((link) => (
        <ProjectLink key={link.url} link={link} size={size} />
      ))}
    </ul>
  )
}
