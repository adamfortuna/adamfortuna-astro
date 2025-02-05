import { useState, useEffect, useRef } from 'react'
import throttle from 'lodash/throttle'

type UseVerticalScrollPositionReturnType = {
  scrollPosition: number
  direction?: 'toTop' | 'toBottom'
}

export const useVerticalScrollPosition = (): UseVerticalScrollPositionReturnType => {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [direction, setDirection] = useState<UseVerticalScrollPositionReturnType['direction'] | undefined>()
  const prevScrollPosition = useRef(0)

  useEffect(() => {
    const updatePosition = () => {
      if (window.pageYOffset > prevScrollPosition.current) {
        setDirection('toBottom')
      } else {
        setDirection('toTop')
      }
      prevScrollPosition.current = window.pageYOffset
      setScrollPosition(window.pageYOffset)
    }

    const throttledUpdate = throttle(updatePosition, 200)
    window.addEventListener('scroll', throttledUpdate)
    updatePosition()

    return () => window.removeEventListener('scroll', throttledUpdate)
  }, [])

  return { scrollPosition, direction }
}
