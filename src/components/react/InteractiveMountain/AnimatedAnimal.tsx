import { useEffect, useRef } from 'react'
import type { ActiveAnimal } from './useAnimalState'

interface AnimatedAnimalProps {
  active: ActiveAnimal
  onComplete: (id: number) => void
  onAnimationEnd: (name: string) => void
}

export function AnimatedAnimal({ active, onComplete, onAnimationEnd }: AnimatedAnimalProps) {
  const ref = useRef<HTMLDivElement>(null)
  const hasCompleted = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let gsap: typeof import('gsap').gsap

    async function animate() {
      const gsapModule = await import('gsap')
      gsap = gsapModule.gsap

      const endX = active.direction === 'right' ? 110 : -10
      const bobAmount = active.animal.yRange[0] < 40 ? 3 : 1.5 // birds bob more

      // Main movement
      gsap.to(el, {
        left: `${endX}%`,
        duration: active.animal.speed,
        ease: 'none',
        onComplete: () => {
          if (!hasCompleted.current) {
            hasCompleted.current = true
            onComplete(active.id)
            onAnimationEnd(active.animal.name)
          }
        },
      })

      // Bobbing motion (vertical)
      gsap.to(el, {
        y: `-=${bobAmount * 10}`,
        duration: active.animal.yRange[0] < 40 ? 0.6 : 0.8,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      })

      // Slight rotation for flying creatures
      if (active.animal.yRange[0] < 40) {
        gsap.to(el, {
          rotation: active.direction === 'right' ? 5 : -5,
          duration: 1.2,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
        })
      }
    }

    animate()

    return () => {
      if (gsap && el) {
        gsap.killTweensOf(el)
      }
    }
  }, [active, onComplete, onAnimationEnd])

  const flipX = active.direction === 'left' ? 'scaleX(-1)' : ''

  return (
    <div
      ref={ref}
      className="absolute pointer-events-none"
      style={{
        left: `${active.startX}%`,
        top: `${active.y}%`,
        fontSize: `${active.animal.size}px`,
        transform: flipX,
        zIndex: Math.round(active.y),
        filter: active.y < 30 ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' : 'none',
      }}
    >
      {active.animal.emoji}
    </div>
  )
}
