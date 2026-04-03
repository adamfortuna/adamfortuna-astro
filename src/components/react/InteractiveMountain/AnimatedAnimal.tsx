import { useEffect, useRef, useState } from 'react'
import type { ActiveAnimal } from './useAnimalState'
import type { MovementStyle } from './animals'

// Lazy-load SVG components
const svgComponents: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {}
const svgModules = import.meta.glob('./svg/*.svg', { eager: true }) as Record<string, { default: React.ComponentType<React.SVGProps<SVGSVGElement>> }>
for (const [path, mod] of Object.entries(svgModules)) {
  const name = path.replace('./svg/', '').replace('.svg', '')
  svgComponents[name] = mod.default
}

interface AnimatedAnimalProps {
  active: ActiveAnimal
  onComplete: (id: number) => void
  onAnimationEnd: (name: string) => void
}

function applyMovementAnimations(
  gsap: typeof import('gsap').gsap,
  el: HTMLElement,
  svgEl: SVGSVGElement | null,
  movement: MovementStyle,
  direction: 'left' | 'right',
  speed: number,
  endX: number,
  onDone: () => void,
) {
  // Main horizontal traversal
  gsap.to(el, {
    left: `${endX}%`,
    duration: speed,
    ease: 'none',
    onComplete: onDone,
  })

  // Per-movement-style vertical and SVG part animations
  switch (movement) {
    case 'flutter': {
      // Erratic fluttery path
      gsap.to(el, {
        y: '-=15',
        duration: 0.4,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      })
      gsap.to(el, {
        x: '+=8',
        duration: 0.7,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      })
      // Wing flap
      if (svgEl) {
        gsap.to(svgEl.querySelectorAll('[class*="wing"]'), {
          scaleY: 0.3,
          duration: 0.15,
          yoyo: true,
          repeat: -1,
          transformOrigin: '50% 100%',
          ease: 'sine.inOut',
        })
      }
      break
    }
    case 'glide': {
      // Gentle sine wave path
      gsap.to(el, {
        y: '-=12',
        duration: 1.2,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      })
      // Wing flap cycle
      if (svgEl) {
        gsap.to(svgEl.querySelectorAll('[class*="wing"]'), {
          rotation: -15,
          duration: 0.3,
          yoyo: true,
          repeat: -1,
          transformOrigin: '20% 80%',
          ease: 'power1.inOut',
        })
      }
      break
    }
    case 'hop': {
      // Discrete hops
      gsap.to(el, {
        y: '-=20',
        duration: 0.35,
        yoyo: true,
        repeat: -1,
        repeatDelay: 0.6,
        ease: 'power2.out',
      })
      // Squash and stretch
      if (svgEl) {
        gsap.to(svgEl, {
          scaleY: 0.85,
          scaleX: 1.15,
          duration: 0.1,
          yoyo: true,
          repeat: -1,
          repeatDelay: 0.85,
          transformOrigin: '50% 100%',
          ease: 'power2.in',
        })
      }
      break
    }
    case 'walk': {
      // Gentle sway while walking
      gsap.to(el, {
        y: '-=4',
        duration: 0.8,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      })
      // Head bob
      if (svgEl) {
        gsap.to(svgEl.querySelectorAll('[class*="head"]'), {
          y: -1,
          rotation: 3,
          duration: 0.8,
          yoyo: true,
          repeat: -1,
          transformOrigin: '50% 80%',
          ease: 'sine.inOut',
        })
        // Leg stride
        gsap.to(svgEl.querySelectorAll('[class*="leg-front"]'), {
          rotation: 12,
          duration: 0.5,
          yoyo: true,
          repeat: -1,
          transformOrigin: '50% 0%',
          ease: 'sine.inOut',
        })
        gsap.to(svgEl.querySelectorAll('[class*="leg-back"]'), {
          rotation: -12,
          duration: 0.5,
          yoyo: true,
          repeat: -1,
          transformOrigin: '50% 0%',
          ease: 'sine.inOut',
          delay: 0.25,
        })
      }
      break
    }
    case 'trot': {
      // Faster bouncier walk
      gsap.to(el, {
        y: '-=6',
        duration: 0.4,
        yoyo: true,
        repeat: -1,
        ease: 'power1.inOut',
      })
      // Tail wag
      if (svgEl) {
        gsap.to(svgEl.querySelectorAll('[class*="tail"]'), {
          rotation: 15,
          duration: 0.3,
          yoyo: true,
          repeat: -1,
          transformOrigin: '0% 50%',
          ease: 'sine.inOut',
        })
        gsap.to(svgEl.querySelectorAll('[class*="leg"]'), {
          rotation: 10,
          duration: 0.3,
          yoyo: true,
          repeat: -1,
          stagger: 0.08,
          transformOrigin: '50% 0%',
          ease: 'sine.inOut',
        })
      }
      break
    }
    case 'soar': {
      // Majestic slow banking
      gsap.to(el, {
        y: '-=20',
        duration: 3,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      })
      gsap.to(el, {
        rotation: direction === 'right' ? 5 : -5,
        duration: 3,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      })
      // Subtle wing tip flex
      if (svgEl) {
        gsap.to(svgEl.querySelectorAll('[class*="wing"]'), {
          rotation: -4,
          duration: 2,
          yoyo: true,
          repeat: -1,
          transformOrigin: '30% 80%',
          ease: 'sine.inOut',
        })
      }
      break
    }
    case 'fly': {
      // Dragon: powerful undulating flight
      gsap.to(el, {
        y: '-=30',
        duration: 2.5,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      })
      gsap.to(el, {
        rotation: direction === 'right' ? 4 : -4,
        duration: 4,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      })
      if (svgEl) {
        // Wing beats
        gsap.to(svgEl.querySelectorAll('[class*="wing"]'), {
          rotation: -10,
          scaleY: 0.85,
          duration: 0.8,
          yoyo: true,
          repeat: -1,
          transformOrigin: '30% 90%',
          ease: 'power1.inOut',
        })
        // Tail sway
        gsap.to(svgEl.querySelectorAll('[class*="tail"]'), {
          rotation: 8,
          duration: 1.5,
          yoyo: true,
          repeat: -1,
          transformOrigin: '0% 50%',
          ease: 'sine.inOut',
        })
      }
      break
    }
  }
}

export function AnimatedAnimal({ active, onComplete, onAnimationEnd }: AnimatedAnimalProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)
  const hasCompleted = useRef(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let gsapInstance: typeof import('gsap').gsap

    async function animate() {
      const gsapModule = await import('gsap')
      gsapInstance = gsapModule.gsap

      const endX = active.direction === 'right' ? 110 : -10
      const svgEl = el.querySelector('svg') as SVGSVGElement | null
      svgRef.current = svgEl

      applyMovementAnimations(
        gsapInstance,
        el,
        svgEl,
        active.animal.movement,
        active.direction,
        active.animal.speed,
        endX,
        () => {
          if (!hasCompleted.current) {
            hasCompleted.current = true
            onComplete(active.id)
            onAnimationEnd(active.animal.name)
          }
        },
      )
    }

    animate()

    return () => {
      if (gsapInstance && el) {
        gsapInstance.killTweensOf(el)
        const svgEl = el.querySelector('svg')
        if (svgEl) {
          gsapInstance.killTweensOf(svgEl.querySelectorAll('*'))
          gsapInstance.killTweensOf(svgEl)
        }
      }
    }
  }, [active, onComplete, onAnimationEnd])

  const SvgComponent = svgComponents[active.animal.svgName]
  if (!SvgComponent) return null

  const flipStyle = active.direction === 'left' ? 'scaleX(-1)' : ''

  return (
    <div
      ref={containerRef}
      className="absolute pointer-events-none"
      style={{
        left: `${active.startX}%`,
        top: `${active.y}%`,
        height: `${active.animal.size}px`,
        width: 'auto',
        transform: flipStyle,
        zIndex: Math.round(active.y),
      }}
    >
      <SvgComponent
        style={{ height: '100%', width: 'auto' }}
      />
    </div>
  )
}
