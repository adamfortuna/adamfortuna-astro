import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faLightbulb,
  faLaptopCode,
  faRocket,
  faHandHoldingDollar,
  faDoorOpen,
} from '@fortawesome/free-solid-svg-icons'

export interface ProjectStateTagProps {
  state: 'idea' | 'development' | 'live' | 'retired' | 'transferred' | 'left'
  className?: string
  children: any
}

const iconMap = {
  idea: faLightbulb,
  development: faLaptopCode,
  live: faRocket,
  left: faDoorOpen,
  retired: faRocket,
  transferred: faHandHoldingDollar,
}

const classMap = {
  idea: 'bg-yellow-200 text-yellow-700',
  development: 'bg-purple-200 text-purple-700',
  live: 'bg-blue-200 text-blue-700',
  retired: 'bg-red-200 text-red-700',
  left: 'bg-orange-200 text-orange-700',
  transferred: 'bg-green-200 text-green-700',
}

const iconClassMap = {
  idea: '',
  development: '',
  live: '',
  retired: 'transform-gpu rotate-90',
  left: '',
  transferred: '',
}

export const ProjectStateTag = ({ state, className = '', children }: ProjectStateTagProps) => {
  return (
    <span className={`px-1 py-0.5 rounded-sm font-semibold ${className} ${classMap[state]}`}>
      <FontAwesomeIcon icon={iconMap[state]} className={`w-4 h-4 hidden sm:inline-block mr-2 ${iconClassMap[state]}`} />
      {children}
    </span>
  )
}
