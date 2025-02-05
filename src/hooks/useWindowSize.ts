import { useEffect, useLayoutEffect, useState } from 'react'

export const useWindowSize = () => {
  const [size, setSize] = useState([0, 0])

  const whichEffect = typeof document === 'undefined' ? useEffect : useLayoutEffect

  whichEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight])
    }
    window.addEventListener('resize', updateSize)
    updateSize()
    return () => window.removeEventListener('resize', updateSize)
  }, [])
  return size
}
