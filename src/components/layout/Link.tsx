/* eslint-disable react/jsx-props-no-spreading, jsx-a11y/anchor-has-content */
import React from 'react'
import clsx from 'clsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquareUpRight } from '@fortawesome/pro-regular-svg-icons'


export type LinkThemeProps = {
  variant: 'default' | 'none' | 'header' | 'info' | 'tag' | 'button'
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

type LinkTheme = {
  variant: {
    [K in keyof { [x: string]: LinkThemeProps } as LinkThemeProps['variant']]: string
  }
  size: {
    [K in keyof { [LinkThemeProps: string]: LinkThemeProps } as LinkThemeProps['size']]: string
  }
}

export const linkTheme: LinkTheme = {
  variant: {
    default: 'text-blue-600 dark:text-blue-200 underline hover:no-underline',
    none: '',
    header: 'text-blue-600 dark:text-blue-200 underline hover:no-underline',
    info: 'link text-slate-400 text-sm hover:underline',
    tag: 'bg-sky-100 px-1 py-0.5 rounded-xs hover:bg-gray-300 hover:text-black',
    button:
      'inline-flex items-center border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 font-medium text-gray-700 dark:text-sky-100 shadow-xs hover:bg-gray-50 dark:hover:bg-sky-600 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
  },
  size: {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-md ',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
  },
}

const variantSizes = {
  none: {
    ...{ ...linkTheme.size },
  },
  default: {
    ...{ ...linkTheme.size },
  },
  header: {
    ...{ ...linkTheme.size },
  },
  info: {
    ...{ ...linkTheme.size },
  },
  tag: {
    ...{ ...linkTheme.size },
  },
  button: {
    xs: 'rounded-sm px-2.5 py-1.5 text-xs',
    sm: 'rounded-sm px-2.5 py-1.5 text-xs',
    md: 'rounded-md px-3 py-2 text-sm',
    lg: 'rounded-md px-4 py-2 text-sm',
    xl: 'rounded-md px-4 py-2 text-base',
    '2xl': 'rounded-md px-6 py-3 text-base',
  },
}

export type LinkProps = {
  variant?: LinkThemeProps['variant']
  size?: LinkThemeProps['size']
  className?: string
  href: string
  target?: string
  showExternal?: boolean
}

export const Link = React.forwardRef<HTMLAnchorElement, React.PropsWithChildren<LinkProps>>(
  ({ variant = 'default', size = 'md', className = '', showExternal = true, href, ...props }, ref) => {
    const newClassName = clsx(linkTheme.variant[variant], linkTheme.size[size], variantSizes[variant][size], className)
    const externalLink = href ? href.indexOf('http') === 0 : false

    if (externalLink) {
      if (showExternal) {
        return (
          <a ref={ref} href={href} className={newClassName} {...props}>
            {props.children}
            <FontAwesomeIcon
              icon={faSquareUpRight}
              className="ml-2 hidden sm:inline-block text-blue-600 dark:text-sky-100"
            />
          </a>
        )
      }
      return <a ref={ref} href={href} className={newClassName} {...props} />
    }
    return <a ref={ref} href={href} className={newClassName} {...props} />
  },
)
