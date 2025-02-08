/* eslint-disable react/jsx-props-no-spreading */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRefresh } from '@fortawesome/pro-solid-svg-icons'
import clsx from 'clsx'

type Props = {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'none' | 'primary'
  className?: string
}

const sizes = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
}

const variants = {
  none: '',
  primary: 'dark:text-gray-400 text-gray-600',
}

const LoadingSpinner = ({ size = 'md', variant = 'none', className, ...rest }: Props) => {
  const finalClassName = clsx('animate-spin', sizes[size], variants[variant], className)

  const props = {
    className: finalClassName,
    ...rest,
  }

  return <FontAwesomeIcon icon={faRefresh} {...props} />
}

export default LoadingSpinner
