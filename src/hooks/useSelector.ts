import { useEffect, useRef, useState } from 'react'

export const useSelector = () => {
  const ref = useRef(null)
  const [q, setQ] = useState<ReturnType<typeof import('gsap').gsap.utils.selector> | null>(null)

  useEffect(() => {
    import('gsap').then(({ gsap }) => {
      setQ(() => gsap.utils.selector(ref))
    })
  }, [])

  return {
    q,
    ref,
  }
}
