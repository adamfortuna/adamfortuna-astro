/**
 * ThoughtBubble - An animated thought display
 * 
 * Usage in WordPress:
 * [lain-component name="ThoughtBubble" thought="What does it mean to create?"]
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ThoughtBubbleProps {
  thought?: string
  thoughts?: string[] // Multiple thoughts to cycle through
  interval?: number   // Milliseconds between thoughts (default: 5000)
}

export default function ThoughtBubble({ 
  thought, 
  thoughts = [], 
  interval = 5000 
}: ThoughtBubbleProps) {
  const allThoughts = thought ? [thought] : thoughts
  const [currentIndex, setCurrentIndex] = useState(0)
  
  useEffect(() => {
    if (allThoughts.length <= 1) return
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allThoughts.length)
    }, interval)
    
    return () => clearInterval(timer)
  }, [allThoughts.length, interval])
  
  if (allThoughts.length === 0) {
    return null
  }
  
  return (
    <div className="my-8 flex justify-center">
      <div className="relative max-w-md">
        {/* Thought bubble */}
        <motion.div
          className="relative bg-gradient-to-br from-purple-900/60 to-indigo-900/60 
                     backdrop-blur-sm rounded-2xl border border-purple-500/30 
                     px-6 py-4 shadow-lg shadow-purple-500/10"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={currentIndex}
              className="text-purple-200 text-lg italic text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              "{allThoughts[currentIndex]}"
            </motion.p>
          </AnimatePresence>
          
          {/* Decorative sparkle */}
          <motion.span 
            className="absolute -top-2 -right-2 text-xl"
            animate={{ 
              rotate: [0, 15, -15, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            ✴️
          </motion.span>
        </motion.div>
        
        {/* Bubble trail */}
        <div className="absolute -bottom-4 left-8 flex gap-1">
          <div className="w-3 h-3 rounded-full bg-purple-700/50" />
          <div className="w-2 h-2 rounded-full bg-purple-700/40 mt-1" />
          <div className="w-1.5 h-1.5 rounded-full bg-purple-700/30 mt-2" />
        </div>
      </div>
    </div>
  )
}
