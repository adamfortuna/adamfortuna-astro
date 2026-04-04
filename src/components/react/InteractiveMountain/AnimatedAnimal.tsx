import { useEffect, useRef, useState } from 'react'
import type { ActiveAnimal } from './useAnimalState'
import type { MovementStyle } from './animals'

// Load SVG files as raw strings so we can inline them (Vite doesn't convert .svg to React components by default)
const svgStrings: Record<string, string> = {}
const svgModules = import.meta.glob('./svg/*.svg', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
for (const [path, raw] of Object.entries(svgModules)) {
  const name = path.replace('./svg/', '').replace('.svg', '')
  svgStrings[name] = raw
}

interface AnimatedAnimalProps {
  active: ActiveAnimal
  onComplete: (id: number) => void
  onAnimationEnd: (name: string) => void
}

function q(svgEl: SVGSVGElement, sel: string) {
  return svgEl.querySelectorAll(`[class*="${sel}"]`)
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

  switch (movement) {
    case 'flutter': {
      // Butterfly: erratic path with rapid multi-phase wing beats

      // Bobbing vertical path
      gsap.to(el, { y: '-=18', duration: 0.45, yoyo: true, repeat: -1, ease: 'sine.inOut' })
      // Lateral drift
      gsap.to(el, { x: '+=10', duration: 0.8, yoyo: true, repeat: -1, ease: 'sine.inOut' })
      // Slight body rotation wobble
      gsap.to(el, { rotation: 8, duration: 0.6, yoyo: true, repeat: -1, ease: 'sine.inOut' })

      if (svgEl) {
        // Upper wings: rapid open/close flap
        gsap.to(q(svgEl, 'wing-upper'), {
          scaleY: 0.2, duration: 0.12, yoyo: true, repeat: -1,
          transformOrigin: '50% 100%', ease: 'power1.inOut',
        })
        // Lower wings: slightly delayed, different rhythm
        gsap.to(q(svgEl, 'wing-lower'), {
          scaleY: 0.3, duration: 0.14, yoyo: true, repeat: -1,
          transformOrigin: '50% 0%', ease: 'power1.inOut', delay: 0.04,
        })
        // Antennae wave
        gsap.to(q(svgEl, 'antenna'), {
          rotation: 12, duration: 0.3, yoyo: true, repeat: -1,
          transformOrigin: '50% 100%', ease: 'sine.inOut', stagger: 0.08,
        })
        // Body pulse (slight vertical squash)
        gsap.to(q(svgEl, 'body'), {
          scaleY: 0.92, scaleX: 1.04, duration: 0.12, yoyo: true, repeat: -1,
          transformOrigin: '50% 50%', ease: 'sine.inOut',
        })
      }
      break
    }
    case 'glide': {
      // Bird: wing-beat cycle with tuck phases, tail and head movement

      // Sine wave flight path
      gsap.to(el, { y: '-=14', duration: 1.4, yoyo: true, repeat: -1, ease: 'sine.inOut' })
      // Gentle body tilt with flight
      gsap.to(el, { rotation: 4, duration: 1.4, yoyo: true, repeat: -1, ease: 'sine.inOut' })

      if (svgEl) {
        // Wing beat: sweep up then down with slight scale
        const wingTl = gsap.timeline({ repeat: -1 })
        wingTl
          .to(q(svgEl, 'wing-upper'), { rotation: -20, scaleY: 0.8, duration: 0.25, transformOrigin: '30% 100%', ease: 'power2.out' })
          .to(q(svgEl, 'wing-upper'), { rotation: 5, scaleY: 1.1, duration: 0.2, transformOrigin: '30% 100%', ease: 'power1.in' })
          .to(q(svgEl, 'wing-upper'), { rotation: 0, scaleY: 1, duration: 0.6, transformOrigin: '30% 100%', ease: 'sine.inOut' })

        const wingLowerTl = gsap.timeline({ repeat: -1 })
        wingLowerTl
          .to(q(svgEl, 'wing-lower'), { rotation: -12, duration: 0.25, transformOrigin: '30% 100%', ease: 'power2.out' })
          .to(q(svgEl, 'wing-lower'), { rotation: 3, duration: 0.2, transformOrigin: '30% 100%', ease: 'power1.in' })
          .to(q(svgEl, 'wing-lower'), { rotation: 0, duration: 0.6, transformOrigin: '30% 100%', ease: 'sine.inOut' })

        // Tail feathers fan
        gsap.to(q(svgEl, 'tail'), {
          rotation: 6, scaleX: 1.1, duration: 1.0, yoyo: true, repeat: -1,
          transformOrigin: '100% 50%', ease: 'sine.inOut',
        })
        // Head bob counter to body
        gsap.to(q(svgEl, 'head'), {
          y: -1.5, rotation: -3, duration: 0.7, yoyo: true, repeat: -1,
          transformOrigin: '50% 100%', ease: 'sine.inOut',
        })
        // Beak opens slightly
        gsap.to(q(svgEl, 'beak'), {
          rotation: 4, duration: 0.8, yoyo: true, repeat: -1, repeatDelay: 1.5,
          transformOrigin: '0% 50%', ease: 'sine.inOut',
        })
      }
      break
    }
    case 'hop': {
      // Rabbit: multi-phase hop with ear flop, leg extension, landing squash

      if (svgEl) {
        // Full hop cycle as a timeline
        const hopTl = gsap.timeline({ repeat: -1 })

        // Phase 1: Crouch (squash down)
        hopTl.to(svgEl, { scaleY: 0.82, scaleX: 1.12, duration: 0.15, transformOrigin: '50% 100%', ease: 'power2.in' })
        // Phase 2: Launch up
        hopTl.to(el, { y: '-=24', duration: 0.3, ease: 'power2.out' }, '<0.05')
        hopTl.to(svgEl, { scaleY: 1.15, scaleX: 0.92, duration: 0.15, transformOrigin: '50% 100%', ease: 'power1.out' }, '<')
        // Ears flap back during jump
        hopTl.to(q(svgEl, 'ear-left'), { rotation: -25, duration: 0.2, transformOrigin: '50% 100%', ease: 'power1.out' }, '<')
        hopTl.to(q(svgEl, 'ear-right'), { rotation: -20, duration: 0.2, transformOrigin: '50% 100%', ease: 'power1.out' }, '<')
        // Front legs extend forward
        hopTl.to(q(svgEl, 'leg-front'), { rotation: 15, duration: 0.2, transformOrigin: '50% 0%', ease: 'sine.out' }, '<')
        // Back legs extend backward
        hopTl.to(q(svgEl, 'leg-back'), { rotation: -10, duration: 0.2, transformOrigin: '50% 0%', ease: 'sine.out' }, '<')
        // Phase 3: Fall
        hopTl.to(el, { y: '+=24', duration: 0.25, ease: 'power2.in' })
        // Phase 4: Land (squash)
        hopTl.to(svgEl, { scaleY: 0.85, scaleX: 1.1, duration: 0.1, transformOrigin: '50% 100%', ease: 'power2.in' }, '<0.15')
        // Ears flop forward on landing
        hopTl.to(q(svgEl, 'ear-left'), { rotation: 10, duration: 0.15, transformOrigin: '50% 100%', ease: 'bounce.out' }, '<')
        hopTl.to(q(svgEl, 'ear-right'), { rotation: 8, duration: 0.15, transformOrigin: '50% 100%', ease: 'bounce.out' }, '<')
        // Legs tuck back
        hopTl.to(q(svgEl, 'leg-front'), { rotation: 0, duration: 0.15, transformOrigin: '50% 0%' }, '<')
        hopTl.to(q(svgEl, 'leg-back'), { rotation: 0, duration: 0.15, transformOrigin: '50% 0%' }, '<')
        // Phase 5: Recover to normal
        hopTl.to(svgEl, { scaleY: 1, scaleX: 1, duration: 0.2, transformOrigin: '50% 100%', ease: 'elastic.out(1, 0.5)' })
        hopTl.to(q(svgEl, 'ear-left'), { rotation: 0, duration: 0.3, transformOrigin: '50% 100%' }, '<')
        hopTl.to(q(svgEl, 'ear-right'), { rotation: 0, duration: 0.3, transformOrigin: '50% 100%' }, '<')
        // Pause before next hop
        hopTl.to({}, { duration: 0.4 })

        // Tail wiggle (independent)
        gsap.to(q(svgEl, 'tail'), {
          x: 1.5, y: -1, duration: 0.2, yoyo: true, repeat: -1,
          transformOrigin: '50% 50%', ease: 'sine.inOut',
        })
        // Nose twitch (independent)
        gsap.to(q(svgEl, 'nose'), {
          scaleX: 1.3, scaleY: 0.8, duration: 0.15, yoyo: true, repeat: -1, repeatDelay: 0.5,
          transformOrigin: '50% 50%', ease: 'sine.inOut',
        })
      } else {
        gsap.to(el, { y: '-=20', duration: 0.35, yoyo: true, repeat: -1, repeatDelay: 0.6, ease: 'power2.out' })
      }
      break
    }
    case 'walk': {
      // Deer: 4-leg walk cycle, head bob, ear flick, tail swish

      // Gentle body bob
      gsap.to(el, { y: '-=3', duration: 0.5, yoyo: true, repeat: -1, ease: 'sine.inOut' })

      if (svgEl) {
        // Walk cycle: diagonal pairs alternate
        const walkTl = gsap.timeline({ repeat: -1 })
        // Step 1: front-1 + back-2 forward, front-2 + back-1 back
        walkTl.to(q(svgEl, 'leg-front-1'), { rotation: 15, duration: 0.4, transformOrigin: '50% 0%', ease: 'sine.inOut' })
        walkTl.to(q(svgEl, 'leg-back-2'), { rotation: 15, duration: 0.4, transformOrigin: '50% 0%', ease: 'sine.inOut' }, '<')
        walkTl.to(q(svgEl, 'leg-front-2'), { rotation: -12, duration: 0.4, transformOrigin: '50% 0%', ease: 'sine.inOut' }, '<')
        walkTl.to(q(svgEl, 'leg-back-1'), { rotation: -12, duration: 0.4, transformOrigin: '50% 0%', ease: 'sine.inOut' }, '<')
        // Step 2: swap
        walkTl.to(q(svgEl, 'leg-front-1'), { rotation: -12, duration: 0.4, transformOrigin: '50% 0%', ease: 'sine.inOut' })
        walkTl.to(q(svgEl, 'leg-back-2'), { rotation: -12, duration: 0.4, transformOrigin: '50% 0%', ease: 'sine.inOut' }, '<')
        walkTl.to(q(svgEl, 'leg-front-2'), { rotation: 15, duration: 0.4, transformOrigin: '50% 0%', ease: 'sine.inOut' }, '<')
        walkTl.to(q(svgEl, 'leg-back-1'), { rotation: 15, duration: 0.4, transformOrigin: '50% 0%', ease: 'sine.inOut' }, '<')

        // Head bob synced to steps
        gsap.to(q(svgEl, 'head'), {
          y: -2, rotation: 3, duration: 0.4, yoyo: true, repeat: -1,
          transformOrigin: '50% 100%', ease: 'sine.inOut',
        })
        gsap.to(q(svgEl, 'snout'), {
          y: -1, duration: 0.4, yoyo: true, repeat: -1,
          transformOrigin: '50% 100%', ease: 'sine.inOut',
        })
        // Ear flick
        gsap.to(q(svgEl, 'ear'), {
          rotation: 10, duration: 0.6, yoyo: true, repeat: -1, repeatDelay: 2,
          transformOrigin: '50% 100%', ease: 'sine.inOut',
        })
        // Antler sway
        gsap.to(q(svgEl, 'antler'), {
          rotation: 3, duration: 0.4, yoyo: true, repeat: -1,
          transformOrigin: '50% 100%', ease: 'sine.inOut',
        })
        // Tail flick
        gsap.to(q(svgEl, 'tail'), {
          rotation: 20, duration: 0.4, yoyo: true, repeat: -1, repeatDelay: 1.5,
          transformOrigin: '100% 50%', ease: 'power1.inOut',
        })
        // Body sway
        gsap.to(q(svgEl, 'body'), {
          rotation: 1, duration: 0.8, yoyo: true, repeat: -1,
          transformOrigin: '50% 100%', ease: 'sine.inOut',
        })
      }
      break
    }
    case 'trot': {
      // Fox: bouncy trot with ear/tail movement, pounce-like energy

      // Bouncy path
      gsap.to(el, { y: '-=8', duration: 0.3, yoyo: true, repeat: -1, ease: 'power1.inOut' })

      if (svgEl) {
        // Trot cycle: faster alternating legs
        const trotTl = gsap.timeline({ repeat: -1 })
        trotTl.to(q(svgEl, 'leg-front-1'), { rotation: 20, duration: 0.2, transformOrigin: '50% 0%', ease: 'sine.inOut' })
        trotTl.to(q(svgEl, 'leg-back-2'), { rotation: 20, duration: 0.2, transformOrigin: '50% 0%', ease: 'sine.inOut' }, '<')
        trotTl.to(q(svgEl, 'leg-front-2'), { rotation: -15, duration: 0.2, transformOrigin: '50% 0%', ease: 'sine.inOut' }, '<')
        trotTl.to(q(svgEl, 'leg-back-1'), { rotation: -15, duration: 0.2, transformOrigin: '50% 0%', ease: 'sine.inOut' }, '<')
        trotTl.to(q(svgEl, 'leg-front-1'), { rotation: -15, duration: 0.2, transformOrigin: '50% 0%', ease: 'sine.inOut' })
        trotTl.to(q(svgEl, 'leg-back-2'), { rotation: -15, duration: 0.2, transformOrigin: '50% 0%', ease: 'sine.inOut' }, '<')
        trotTl.to(q(svgEl, 'leg-front-2'), { rotation: 20, duration: 0.2, transformOrigin: '50% 0%', ease: 'sine.inOut' }, '<')
        trotTl.to(q(svgEl, 'leg-back-1'), { rotation: 20, duration: 0.2, transformOrigin: '50% 0%', ease: 'sine.inOut' }, '<')

        // Tail: bushy swish
        const tailTl = gsap.timeline({ repeat: -1 })
        tailTl.to(q(svgEl, 'tail'), { rotation: 20, duration: 0.3, transformOrigin: '100% 50%', ease: 'sine.out' })
        tailTl.to(q(svgEl, 'tail'), { rotation: -15, duration: 0.3, transformOrigin: '100% 50%', ease: 'sine.out' })
        tailTl.to(q(svgEl, 'tail'), { rotation: 0, duration: 0.4, transformOrigin: '100% 50%', ease: 'sine.inOut' })
        // Tail tip has its own delay
        gsap.to(q(svgEl, 'tail-tip'), {
          rotation: 25, duration: 0.35, yoyo: true, repeat: -1,
          transformOrigin: '100% 50%', ease: 'sine.inOut', delay: 0.05,
        })

        // Ears: alert, angling forward/back
        gsap.to(q(svgEl, 'ear-left'), {
          rotation: -8, duration: 0.4, yoyo: true, repeat: -1,
          transformOrigin: '50% 100%', ease: 'sine.inOut',
        })
        gsap.to(q(svgEl, 'ear-right'), {
          rotation: 6, duration: 0.35, yoyo: true, repeat: -1,
          transformOrigin: '50% 100%', ease: 'sine.inOut', delay: 0.1,
        })
        // Head: slight predatory focus bob
        gsap.to(q(svgEl, 'head'), {
          y: -1, rotation: 2, duration: 0.3, yoyo: true, repeat: -1,
          transformOrigin: '50% 100%', ease: 'sine.inOut',
        })
        // Body bounce
        gsap.to(q(svgEl, 'body'), {
          scaleY: 0.96, duration: 0.3, yoyo: true, repeat: -1,
          transformOrigin: '50% 100%', ease: 'sine.inOut',
        })
      }
      break
    }
    case 'soar': {
      // Eagle: long glide with periodic powerful wing beats, tail steering

      // Slow altitude changes
      gsap.to(el, { y: '-=25', duration: 3.5, yoyo: true, repeat: -1, ease: 'sine.inOut' })
      // Banking tilt
      gsap.to(el, { rotation: direction === 'right' ? 6 : -6, duration: 3.5, yoyo: true, repeat: -1, ease: 'sine.inOut' })

      if (svgEl) {
        // Wing beat cycle: glide... glide... then powerful flap
        const wingTl = gsap.timeline({ repeat: -1 })
        // Glide phase: wings extended, slight flex
        wingTl.to(q(svgEl, 'wing-upper'), { rotation: -2, duration: 2, transformOrigin: '20% 90%', ease: 'sine.inOut' })
        wingTl.to(q(svgEl, 'wing-lower'), { rotation: 2, duration: 2, transformOrigin: '20% 10%', ease: 'sine.inOut' }, '<')
        // Power flap down
        wingTl.to(q(svgEl, 'wing-upper'), { rotation: -18, scaleY: 0.85, duration: 0.3, transformOrigin: '20% 90%', ease: 'power2.out' })
        wingTl.to(q(svgEl, 'wing-lower'), { rotation: 15, scaleY: 0.9, duration: 0.3, transformOrigin: '20% 10%', ease: 'power2.out' }, '<')
        // Flap up
        wingTl.to(q(svgEl, 'wing-upper'), { rotation: 8, scaleY: 1.05, duration: 0.25, transformOrigin: '20% 90%', ease: 'power1.in' })
        wingTl.to(q(svgEl, 'wing-lower'), { rotation: -5, scaleY: 1, duration: 0.25, transformOrigin: '20% 10%', ease: 'power1.in' }, '<')
        // Settle back
        wingTl.to(q(svgEl, 'wing-upper'), { rotation: 0, scaleY: 1, duration: 0.5, transformOrigin: '20% 90%', ease: 'sine.out' })
        wingTl.to(q(svgEl, 'wing-lower'), { rotation: 0, scaleY: 1, duration: 0.5, transformOrigin: '20% 10%', ease: 'sine.out' }, '<')

        // Feather detail flutter
        gsap.to(q(svgEl, 'feather'), {
          rotation: 3, duration: 1.5, yoyo: true, repeat: -1,
          transformOrigin: '20% 80%', ease: 'sine.inOut', stagger: 0.2,
        })
        // Tail fan for steering
        gsap.to(q(svgEl, 'tail'), {
          rotation: 8, scaleX: 1.15, duration: 2.5, yoyo: true, repeat: -1,
          transformOrigin: '100% 50%', ease: 'sine.inOut',
        })
        // Head: stays stable (counter-rotates vs body banking)
        gsap.to(q(svgEl, 'head'), {
          rotation: direction === 'right' ? -3 : 3, duration: 3.5, yoyo: true, repeat: -1,
          transformOrigin: '50% 50%', ease: 'sine.inOut',
        })
        // Crown feathers ruffle
        gsap.to(q(svgEl, 'crown'), {
          rotation: 6, duration: 0.8, yoyo: true, repeat: -1,
          transformOrigin: '50% 100%', ease: 'sine.inOut',
        })
      }
      break
    }
    case 'fly': {
      // Dragon: powerful undulating flight, no container rotation (avoid upside-down flip)

      // Slow altitude wave
      gsap.to(el, { y: '-=35', duration: 3, yoyo: true, repeat: -1, ease: 'sine.inOut' })

      if (svgEl) {
        // Wing beat cycle
        const wingTl = gsap.timeline({ repeat: -1 })
        wingTl.to(q(svgEl, 'wing-front'), { rotation: -15, scaleY: 0.8, duration: 0.6, transformOrigin: '30% 100%', ease: 'power2.out' })
        wingTl.to(q(svgEl, 'wing-back'), { rotation: -12, scaleY: 0.85, duration: 0.6, transformOrigin: '30% 100%', ease: 'power2.out' }, '<0.05')
        wingTl.to(q(svgEl, 'wing-front'), { rotation: 8, scaleY: 1.1, duration: 0.5, transformOrigin: '30% 100%', ease: 'power1.in' })
        wingTl.to(q(svgEl, 'wing-back'), { rotation: 6, scaleY: 1.05, duration: 0.5, transformOrigin: '30% 100%', ease: 'power1.in' }, '<0.05')
        wingTl.to(q(svgEl, 'wing-front'), { rotation: 0, scaleY: 1, duration: 0.8, transformOrigin: '30% 100%', ease: 'sine.out' })
        wingTl.to(q(svgEl, 'wing-back'), { rotation: 0, scaleY: 1, duration: 0.8, transformOrigin: '30% 100%', ease: 'sine.out' }, '<')

        // Wing membrane detail lines flex
        gsap.to(q(svgEl, 'wing-detail'), {
          rotation: 5, duration: 0.8, yoyo: true, repeat: -1,
          transformOrigin: '50% 100%', ease: 'sine.inOut', stagger: 0.1,
        })

        // Tail: serpentine undulation (each tail section delayed)
        gsap.to(q(svgEl, 'tail-mid'), {
          rotation: 6, y: 2, duration: 1.2, yoyo: true, repeat: -1,
          transformOrigin: '100% 50%', ease: 'sine.inOut',
        })
        gsap.to(q(svgEl, 'tail'), {
          rotation: 10, y: 3, duration: 1.2, yoyo: true, repeat: -1,
          transformOrigin: '100% 50%', ease: 'sine.inOut', delay: 0.15,
        })
        gsap.to(q(svgEl, 'tail-tip'), {
          rotation: 15, duration: 1.0, yoyo: true, repeat: -1,
          transformOrigin: '100% 50%', ease: 'sine.inOut', delay: 0.3,
        })

        // Head bob
        gsap.to(q(svgEl, 'head'), {
          y: -2, rotation: 3, duration: 1.5, yoyo: true, repeat: -1,
          transformOrigin: '50% 100%', ease: 'sine.inOut',
        })
        // Horns flex
        gsap.to(q(svgEl, 'horn'), {
          rotation: 5, duration: 1.0, yoyo: true, repeat: -1, stagger: 0.1,
          transformOrigin: '50% 100%', ease: 'sine.inOut',
        })
        // Leg tuck/extend
        gsap.to(q(svgEl, 'leg-back'), {
          rotation: 8, duration: 2, yoyo: true, repeat: -1,
          transformOrigin: '50% 0%', ease: 'sine.inOut',
        })
        gsap.to(q(svgEl, 'leg-front'), {
          rotation: -6, duration: 2, yoyo: true, repeat: -1,
          transformOrigin: '50% 0%', ease: 'sine.inOut', delay: 0.3,
        })
        // Spines flex along back
        gsap.to(q(svgEl, 'spine'), {
          scaleY: 1.3, duration: 0.6, yoyo: true, repeat: -1, stagger: 0.1,
          transformOrigin: '50% 100%', ease: 'sine.inOut',
        })
        // Nostril smoke puff
        gsap.to(q(svgEl, 'smoke'), {
          scale: 2, opacity: 0, duration: 1.5, repeat: -1, repeatDelay: 2,
          transformOrigin: '50% 50%', ease: 'power1.out',
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

  const svgMarkup = svgStrings[active.animal.svgName]
  if (!svgMarkup) return null

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
      <div
        style={{ height: '100%', width: 'auto', display: 'inline-block' }}
        ref={(node) => {
          if (node) {
            const svg = node.querySelector('svg')
            if (svg) {
              svg.style.height = '100%'
              svg.style.width = 'auto'
              svg.style.display = 'block'
            }
          }
        }}
        dangerouslySetInnerHTML={{ __html: svgMarkup }}
      />
    </div>
  )
}
