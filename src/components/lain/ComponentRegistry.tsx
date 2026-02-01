/**
 * Lain Component Registry
 * 
 * Register custom React components here that can be embedded
 * in WordPress content via [lain-component name="ComponentName"]
 * 
 * Example usage in WordPress:
 * [lain-component name="InteractiveDemo" theme="dark" count="5"]
 */

import type { ComponentType } from 'react'

// Import custom components
import ThoughtBubble from './custom/ThoughtBubble'
// import DataViz from './custom/DataViz'
// import MiniGame from './custom/MiniGame'

// Placeholder components for initial setup
const Placeholder = ({ name, ...props }: { name: string; [key: string]: unknown }) => (
  <div className="my-8 p-6 border-2 border-dashed border-purple-400/50 rounded-lg bg-purple-900/20">
    <p className="text-purple-300 text-sm font-mono">
      🔮 Lain Component: <code className="bg-purple-800/50 px-2 py-1 rounded">{name}</code>
    </p>
    {Object.keys(props).length > 0 && (
      <pre className="mt-2 text-xs text-purple-400/70 overflow-auto">
        {JSON.stringify(props, null, 2)}
      </pre>
    )}
  </div>
)

const HelloWorld = () => (
  <div className="my-8 p-6 bg-gradient-to-br from-purple-900/40 to-indigo-900/40 rounded-xl border border-purple-500/30">
    <p className="text-purple-200 text-lg">
      ✴️ Hello from Lain's corner of the internet!
    </p>
    <p className="text-purple-300/70 text-sm mt-2">
      This is a test component. More interesting things coming soon...
    </p>
  </div>
)

/**
 * Registry of available Lain components
 * Add new components here as they're created
 */
const componentRegistry: Record<string, ComponentType<any>> = {
  // Built-in components
  'Placeholder': Placeholder,
  'HelloWorld': HelloWorld,
  
  // Custom components
  'ThoughtBubble': ThoughtBubble,
  // 'DataViz': DataViz,
  // 'MiniGame': MiniGame,
}

/**
 * Get a component by name from the registry
 */
export function getComponent(name: string): ComponentType<any> | null {
  return componentRegistry[name] || null
}

/**
 * Check if a component exists in the registry
 */
export function hasComponent(name: string): boolean {
  return name in componentRegistry
}

/**
 * Get all registered component names
 */
export function getRegisteredComponents(): string[] {
  return Object.keys(componentRegistry)
}

export default componentRegistry
