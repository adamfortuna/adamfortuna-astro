/* eslint-disable sonarjs/no-duplicate-string, import/no-extraneous-dependencies */
// const defaultTheme = require('tailwindcss/defaultTheme')

const typography = require('@tailwindcss/typography')
const forms = require('@tailwindcss/forms')

const blogWidth = (theme, width = '3') => {
  // const t = "leading.loose"
  // console.log("t", theme(t))
  return {
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: theme('spacing.3'),
    paddingRight: theme('spacing.3'),

    '@media(min-width: theme(--breakpoint-md))': {
      textAlign: theme('text.left'),
      maxWidth: theme(`maxWidth.${width}xl`),
      paddingLeft: theme('spacing.0'),
    },
  }
}
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,astro}'],
  darkMode: 'class',
  plugins: [typography, forms],
  theme: {
    extend: {
      fontFamily: {
        handwriting: ['var(--font-handwriting)', 'Pacifico', 'cursive'],
        sans: ['var(--font-sans)', 'sans-serif'],
        serif: ['var(--font-serif)', 'serif'],
        digital: ['var(--font-digital)', 'Press Start 2P', 'cursive'],
      },
      colors: {
        ablue: {
          200: '#5F94C2',
          300: '#0088FF',
          400: '#B6E0EF',
          500: '#5585AF',
          600: '#0059A7',
          700: '#0068C3',
        },
        bluesky: '#1285fe',
      },
      keyframes: {
        wave: {
          '0%': { transform: 'rotate(0.0deg)' },
          '10%': { transform: 'rotate(14deg)' },
          '20%': { transform: 'rotate(-8deg)' },
          '30%': { transform: 'rotate(14deg)' },
          '40%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(10.0deg)' },
          '60%': { transform: 'rotate(0.0deg)' },
          '100%': { transform: 'rotate(0.0deg)' },
        },
      },
      animation: {
        'waving-hand': 'wave 2s linear infinite',
      },
    },
    fontSize: {
      xs: ['0.8125rem', { lineHeight: '1.5rem' }],
      sm: ['0.875rem', { lineHeight: '1.5rem' }],
      base: ['1rem', { lineHeight: '1.75rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '2rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '3.5rem' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
      '7xl': ['4.5rem', { lineHeight: '1' }],
      '8xl': ['6rem', { lineHeight: '1' }],
      '9xl': ['8rem', { lineHeight: '1' }],
    },
    typography: (theme) => ({
      invert: {
        css: {
          '--tw-prose-body': 'var(--tw-prose-invert-body)',
          '--tw-prose-headings': 'var(--tw-prose-invert-headings)',
          '--tw-prose-links': 'var(--tw-prose-invert-links)',
          '--tw-prose-links-hover': 'var(--tw-prose-invert-links-hover)',
          '--tw-prose-underline': 'var(--tw-prose-invert-underline)',
          '--tw-prose-underline-hover': 'var(--tw-prose-invert-underline-hover)',
          '--tw-prose-bold': 'var(--tw-prose-invert-bold)',
          '--tw-prose-counters': 'var(--tw-prose-invert-counters)',
          '--tw-prose-bullets': 'var(--tw-prose-invert-bullets)',
          '--tw-prose-hr': 'var(--tw-prose-invert-hr)',
          '--tw-prose-quote-borders': 'var(--tw-prose-invert-quote-borders)',
          '--tw-prose-captions': 'var(--tw-prose-invert-captions)',
          '--tw-prose-code': 'var(--tw-prose-invert-code)',
          '--tw-prose-code-bg': 'var(--tw-prose-invert-code-bg)',
          '--tw-prose-pre-code': 'var(--tw-prose-invert-pre-code)',
          '--tw-prose-pre-bg': 'var(--tw-prose-invert-pre-bg)',
          '--tw-prose-pre-border': 'var(--tw-prose-invert-pre-border)',
          '--tw-prose-th-borders': 'var(--tw-prose-invert-th-borders)',
          '--tw-prose-td-borders': 'var(--tw-prose-invert-td-borders)',
        },
      },
      DEFAULT: {
        css: {
          '--tw-prose-body': theme('colors.slate.900'),
          '--tw-prose-headings': theme('colors.slate.900'),
          '--tw-prose-links': theme('colors.blue.700'),
          '--tw-prose-links-hover': theme('colors.blue.800'),
          '--tw-prose-underline': theme('colors.blue.700 / 0.2'),
          '--tw-prose-underline-hover': theme('colors.blue.800'),
          '--tw-prose-bold': theme('colors.slate.900'),
          '--tw-prose-counters': theme('colors.slate.900'),
          '--tw-prose-bullets': theme('colors.slate.900'),
          '--tw-prose-hr': theme('colors.slate.100'),
          '--tw-prose-quote-borders': theme('colors.slate.200'),
          '--tw-prose-captions': theme('colors.slate.500'),
          '--tw-prose-code': theme('colors.slate.700'),
          '--tw-prose-code-bg': theme('colors.slate.300 / 0.2'),
          '--tw-prose-pre-code': theme('colors.slate.100'),
          '--tw-prose-pre-bg': theme('colors.slate.900'),
          '--tw-prose-pre-border': 'transparent',
          '--tw-prose-th-borders': theme('colors.slate.200'),
          '--tw-prose-td-borders': theme('colors.slate.100'),

          '--tw-prose-invert-body': theme('colors.slate.100'),
          '--tw-prose-invert-headings': theme('colors.slate.200'),
          '--tw-prose-invert-links': theme('colors.sky.200'),
          '--tw-prose-invert-links-hover': theme('colors.sky.100'),
          '--tw-prose-invert-underline': theme('colors.teal.400 / 0.3'),
          '--tw-prose-invert-underline-hover': theme('colors.teal.400'),
          '--tw-prose-invert-bold': theme('colors.slate.200'),
          '--tw-prose-invert-counters': theme('colors.slate.200'),
          '--tw-prose-invert-bullets': theme('colors.slate.200'),
          '--tw-prose-invert-hr': theme('colors.slate.700 / 0.4'),
          '--tw-prose-invert-quote-borders': theme('colors.slate.500'),
          '--tw-prose-invert-captions': theme('colors.slate.500'),
          '--tw-prose-invert-code': theme('colors.slate.300'),
          '--tw-prose-invert-code-bg': theme('colors.slate.200 / 0.05'),
          '--tw-prose-invert-pre-code': theme('colors.slate.100'),
          '--tw-prose-invert-pre-bg': 'rgb(0 0 0 / 0.4)',
          '--tw-prose-invert-pre-border': theme('colors.slate.200 / 0.1'),
          '--tw-prose-invert-th-borders': theme('colors.slate.700'),
          '--tw-prose-invert-td-borders': theme('colors.slate.800'),

          // Base
          color: 'var(--tw-prose-body)',
          fontSize: theme('fontSize.lg')[0],
          '@media(min-width: theme(--breakpoint-md))': {
            fontSize: theme('fontSize.xl')[0],
          },
          lineHeight: theme('lineHeight.7'),
          '> *': {
            marginTop: theme('spacing.10'),
            marginBottom: theme('spacing.10'),
          },
          p: {
            marginTop: theme('spacing.7'),
            marginBottom: theme('spacing.7'),
            overflowX: 'auto',
            ...blogWidth(theme),
          },

          // Headings
          'h2, h3, h4': {
            color: 'var(--tw-prose-headings)',
            fontWeight: theme('fontWeight.semibold'),
            ...blogWidth(theme),
          },
          h2: {
            fontSize: theme('fontSize.3xl')[0],
            lineHeight: theme('lineHeight.7'),
            marginTop: theme('spacing.12'),
            marginBottom: theme('spacing.4'),
            '@media(min-width: theme(--breakpoint-md))': {
              marginTop: theme('spacing.16'),
              marginBottom: theme('spacing.4'),
            },
          },
          h3: {
            fontSize: theme('fontSize.xl')[0],
            lineHeight: theme('lineHeight.7'),
            marginTop: theme('spacing.10'),
            marginBottom: theme('spacing.4'),
            '@media(min-width: theme(--breakpoint-md))': {
              marginTop: theme('spacing.12'),
              marginBottom: theme('spacing.4'),
            },
          },
          h4: {
            fontSize: theme('fontSize.lg')[0],
            lineHeight: theme('lineHeight.6'),
            marginTop: theme('spacing.8'),
            marginBottom: theme('spacing.4'),
            '@media(min-width: theme(--breakpoint-md))': {
              marginTop: theme('spacing.10'),
              marginBottom: theme('spacing.2'),
            },
          },
          ':is(h2, h3) + *': {
            marginTop: 0,
          },

          // Images
          'img:not(.pic)': {
            marginLeft: 'auto',
            marginRight: 'auto',
            '@media(min-width: theme(--breakpoint-lg))': {
              textAlign: theme('text.left'),
              maxWidth: theme('maxWidth.5xl'),
              paddingLeft: theme('spacing.0'),
            },
          },

          // Inline elements
          a: {
            color: 'var(--tw-prose-links)',
            fontWeight: theme('fontWeight.semibold'),
            textDecoration: 'underline',
            textDecorationColor: 'var(--tw-prose-underline)',
            transitionProperty: 'color, text-decoration-color',
            transitionDuration: theme('transitionDuration.150'),
            transitionTimingFunction: theme('transitionTimingFunction.in-out'),
          },
          'a:hover': {
            color: 'var(--tw-prose-links-hover)',
            textDecorationColor: 'var(--tw-prose-underline-hover)',
          },
          strong: {
            color: 'var(--tw-prose-bold)',
            fontWeight: theme('fontWeight.semibold'),
          },
          code: {
            display: 'inline-block',
            color: 'var(--tw-prose-code)',
            fontSize: theme('fontSize.sm')[0],
            fontWeight: theme('fontWeight.semibold'),
            backgroundColor: 'var(--tw-prose-code-bg)',
            borderRadius: theme('borderRadius.lg'),
            paddingLeft: theme('spacing.1'),
            paddingRight: theme('spacing.1'),
          },
          'a code': {
            color: 'inherit',
          },
          ':is(h2, h3) code': {
            fontWeight: theme('fontWeight.bold'),
          },

          // Quotes
          blockquote: {
            // @apply px-24 border-blue-500 py-8 relative mx-auto
            paddingLeft: theme('spacing.6'),
            paddingRight: theme('spacing.6'),

            width: '100%',
            paddingTop: theme('spacing.2'),
            paddingBottom: theme('spacing.4'),
            position: 'relative',
            marginLeft: 'auto',
            marginRight: 'auto',
            borderColor: theme('colors.blue.500'),
            borderTopWidth: '8px',
            borderBottomWidth: '8px',
            borderRadius: theme('borderRadius.md'),

            '@media(min-width: theme(--breakpoint-sm))': {
              paddingTop: theme('spacing.4'),
              paddingBottom: theme('spacing.1'),
              borderTopWidth: '0px',
              borderBottomWidth: '0px',
              borderLeftWidth: '8px',
              borderRightWidth: '0px',
              maxWidth: theme('maxWidth.4xl'),
            },

            p: {
              // @apply text-2xl leading-normal font-semibold text-grey-800 text-justify mb-4
              marginLeft: 'auto',
              marginRight: 'auto',
              marginBottom: theme('spacing.4'),
              marginTop: theme('spacing.2'),
              padding: 0,
              fontSize: theme('fontSize.2xl')[0],
              color: theme('colors.gray.800'),
              lineHeight: theme('lineHeight.8'),
              width: '100%',

              '@media(min-width: theme(--breakpoint-md))': {
                marginTop: theme('spacing.0'),
                maxWidth: theme('maxWidth.3xl'),
                lineHeight: theme('lineHeight.9'),
              },
            },
            cite: {
              marginLeft: 'auto',
              marginRight: 'auto',
              display: 'block',
              '@media(min-width: theme(--breakpoint-md))': {
                width: theme('maxWidth.3xl'),
                marginBottom: theme('spacing.2'),
              },
            },
          },

          // Figures
          figure: {
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: theme('spacing.2'),
            marginBottom: theme('spacing.2'),
            '@media(min-width: theme(--breakpoint-sm))': {
              '&.alignright': {
                float: 'right',
                marginLeft: '1rem',
              },
            },
            '@media(min-width: theme(--breakpoint-lg))': {
              textAlign: theme('text.left'),
              maxWidth: theme('maxWidth.5xl'),
              paddingLeft: theme('spacing.0'),
            },
            textAlign: 'center',

            '.wp-block-embed__wrapper iframe': {
              marginLeft: 'auto',
              marginRight: 'auto',
              width: '100%',
              '@media(min-width: theme(--breakpoint-md))': {
                maxWidth: theme('maxWidth.5xl'),
              },
            },
          },
          figcaption: {
            color: 'var(--tw-prose-captions)',
            fontSize: theme('fontSize.sm')[0],
            lineHeight: theme('lineHeight.6'),
            marginTop: theme('spacing.3'),
            paddingLeft: theme('spacing.2'),
          },
          'figcaption > p': {
            margin: 0,
          },

          // Lists
          ul: {
            listStyleType: 'disc',
          },
          ol: {
            listStyleType: 'decimal',
          },
          'ul, ol': {
            marginLeft: 'auto',
            marginRight: 'auto',
            paddingLeft: theme('spacing.8'),
            paddingRight: theme('spacing.1'),

            '@media(min-width: theme(--breakpoint-md))': {
              textAlign: theme('text.left'),
              width: theme('maxWidth.3xl'),
              paddingLeft: theme('spacing.4'),
              paddingRight: theme('spacing.0'),
            },
          },
          li: {
            marginTop: theme('spacing.1'),
            marginBottom: theme('spacing.1'),
            // paddingLeft: theme('spacing[3.5]'),
          },
          'li::marker': {
            fontSize: theme('fontSize.sm')[0],
            fontWeight: theme('fontWeight.semibold'),
          },
          'ol > li::marker': {
            color: 'var(--tw-prose-counters)',
          },
          'ul > li::marker': {
            color: 'var(--tw-prose-bullets)',
          },
          'li :is(ol, ul)': {
            marginTop: theme('spacing.1'),
            marginBottom: theme('spacing.1'),
            paddingLeft: theme('spacing.4'),
            paddingRight: theme('spacing.0'),
          },
          'li :is(li, p)': {
            marginTop: theme('spacing.1'),
            marginBottom: theme('spacing.1'),
          },

          // Code blocks
          pre: {
            color: 'var(--tw-prose-pre-code)',
            fontSize: theme('fontSize.sm')[0],
            fontWeight: theme('fontWeight.medium'),
            backgroundColor: 'var(--tw-prose-pre-bg)',
            padding: theme('spacing.4'),
            overflowX: 'auto',

            marginLeft: 'auto',
            marginRight: 'auto',
            paddingLeft: theme('spacing.3'),
            paddingRight: theme('spacing.3'),

            '@media(min-width: theme(--breakpoint-md))': {
              textAlign: theme('text.left'),
              maxWidth: theme('maxWidth.4xl'),
              paddingLeft: theme('spacing.16'),
              paddingRight: theme('spacing.4'),
              border: '1px solid',
              borderColor: 'var(--tw-prose-pre-border)',
              borderRadius: theme('borderRadius.2xl'),
            },
          },
          'pre code': {
            marginLeft: 'auto',
            marginRight: 'auto',
            display: 'inline',
            color: 'inherit',
            fontSize: 'inherit',
            fontWeight: 'inherit',
            backgroundColor: 'transparent',
            borderRadius: 0,
            padding: 0,
          },

          // Horizontal rules
          hr: {
            marginTop: theme('spacing.20'),
            marginBottom: theme('spacing.20'),
            borderTopWidth: '1px',
            borderColor: 'var(--tw-prose-hr)',
            '@media(min-width: theme(--breakpoint-lg))': {
              marginLeft: `calc(${theme('spacing.12')} * -1)`,
              marginRight: `calc(${theme('spacing.12')} * -1)`,
            },
          },

          // Tables
          table: {
            ...blogWidth(theme),
            tableLayout: 'auto',
            textAlign: 'left',
            fontSize: theme('fontSize.base')[0],
          },
          thead: {
            borderBottomWidth: '1px',
            borderBottomColor: 'var(--tw-prose-th-borders)',
          },
          'thead th': {
            color: 'var(--tw-prose-headings)',
            fontWeight: theme('fontWeight.semibold'),
            verticalAlign: 'bottom',
            fontSize: theme('fontSize.lg')[0],
            paddingBottom: theme('spacing.2'),
          },
          'thead th:not(:first-child)': {
            paddingLeft: theme('spacing.2'),
          },
          'thead th:not(:last-child)': {
            paddingRight: theme('spacing.2'),
          },
          'tbody tr': {
            borderBottomWidth: '1px',
            borderBottomColor: 'var(--tw-prose-td-borders)',
          },
          'tbody tr:last-child': {
            borderBottomWidth: 0,
          },
          'tbody td': {
            verticalAlign: 'baseline',
          },
          tfoot: {
            borderTopWidth: '1px',
            borderTopColor: 'var(--tw-prose-th-borders)',
          },
          'tfoot td': {
            verticalAlign: 'top',
            fontSize: theme('fontSize.lg')[0],
          },
          ':is(tbody, tfoot) td': {
            paddingTop: theme('spacing.2'),
            paddingBottom: theme('spacing.2'),
          },
          ':is(tbody, tfoot) td:not(:first-child)': {
            paddingLeft: theme('spacing.2'),
          },
          ':is(tbody, tfoot) td:not(:last-child)': {
            paddingRight: theme('spacing.2'),
          },
        },
      },
    }),
  },
}
