/**
 * LainContent - Renders WordPress content with embedded React components
 * 
 * Parses [lain-component] shortcodes and renders them inline with
 * the surrounding HTML content.
 */

import React, { useMemo } from 'react'
import { getComponent, hasComponent } from './ComponentRegistry'
import type { LainComponentRef } from '../../types'

interface LainContentProps {
  content: string
  components?: LainComponentRef[]
  className?: string
}

/**
 * Split content around component shortcodes and render everything
 */
export default function LainContent({ content, components = [], className = '' }: LainContentProps) {
  const renderedContent = useMemo(() => {
    if (!components || components.length === 0) {
      // No components, just render the HTML content
      return [
        <div 
          key="content-only"
          className="prose prose-invert prose-purple max-w-none"
          dangerouslySetInnerHTML={{ __html: content }} 
        />
      ]
    }

    // Split content around shortcodes and intersperse components
    const shortcodeRegex = /\[lain-component\s+[^\]]+\]/g
    const parts: React.ReactNode[] = []
    let lastIndex = 0
    let componentIndex = 0
    let match

    while ((match = shortcodeRegex.exec(content)) !== null) {
      // Add content before this shortcode
      if (match.index > lastIndex) {
        const htmlBefore = content.slice(lastIndex, match.index)
        parts.push(
          <div 
            key={`html-${lastIndex}`}
            className="prose prose-invert prose-purple max-w-none"
            dangerouslySetInnerHTML={{ __html: htmlBefore }} 
          />
        )
      }

      // Render the component
      const componentRef = components[componentIndex]
      if (componentRef && hasComponent(componentRef.name)) {
        const Component = getComponent(componentRef.name)
        if (Component) {
          parts.push(
            <Component 
              key={`component-${componentIndex}`} 
              {...(componentRef.props || {})} 
            />
          )
        }
      } else if (componentRef) {
        // Component not found in registry - show placeholder in dev
        parts.push(
          <div 
            key={`missing-${componentIndex}`}
            className="my-4 p-4 bg-yellow-900/30 border border-yellow-600/50 rounded-lg"
          >
            <p className="text-yellow-400 text-sm">
              ⚠️ Component not found: <code>{componentRef?.name}</code>
            </p>
          </div>
        )
      }

      lastIndex = match.index + match[0].length
      componentIndex++
    }

    // Add any remaining content after the last shortcode
    if (lastIndex < content.length) {
      const htmlAfter = content.slice(lastIndex)
      parts.push(
        <div 
          key={`html-final`}
          className="prose prose-invert prose-purple max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlAfter }} 
        />
      )
    }

    return parts
  }, [content, components])

  return (
    <div className={`lain-content ${className}`}>
      {renderedContent}
    </div>
  )
}
