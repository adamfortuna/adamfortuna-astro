import { useMemo, useRef } from 'react'
import { gsap } from 'gsap'

export const useSelector = () => {
  const ref = useRef(null)
  const q = useMemo(() => gsap.utils.selector(ref), [ref])
  return {
    q,
    ref,
  }
}
