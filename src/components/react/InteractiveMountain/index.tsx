import { useEffect, useRef } from 'react'
import MountainAnimation from './MountainAnimation'
import { useAnimalState } from './useAnimalState'
import { AnimatedAnimal } from './AnimatedAnimal'
import { AnimalChart } from './AnimalChart'

// SVG groups that should render IN FRONT of animals (closest foreground)
const FOREGROUND_CLASSES = [
  'mountain__grasses',
  'mountain__white-stones',
  'mountain__bottom-right',
  'mountain__bottom-left',
]

export default function InteractiveMountain({children}: {children: React.ReactElement}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const foregroundRef = useRef<HTMLDivElement>(null)

  const {
    visibleAnimals,
    activeAnimals,
    maxCount,
    removeActiveAnimal,
    markNotAnimating,
  } = useAnimalState()

  // After mount, move foreground SVG elements into a separate overlay above the animals
  useEffect(() => {
    const container = containerRef.current
    const foreground = foregroundRef.current
    if (!container || !foreground) return

    const svg = container.querySelector('svg')
    if (!svg) return

    // Create an overlay SVG with the same coordinate system
    const overlaySvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    overlaySvg.setAttribute('viewBox', svg.getAttribute('viewBox') || '0 0 750 500')
    overlaySvg.setAttribute('preserveAspectRatio', svg.getAttribute('preserveAspectRatio') || 'xMidYMax slice')
    overlaySvg.style.width = '100%'
    overlaySvg.style.height = '100%'

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    g.setAttribute('fill', 'none')
    g.setAttribute('fill-rule', 'evenodd')
    overlaySvg.appendChild(g)

    // Move the foreground groups (DOM move, not clone — GSAP animations still target them)
    for (const cls of FOREGROUND_CLASSES) {
      const els = svg.querySelectorAll(`.${cls}`)
      els.forEach((el) => g.appendChild(el))
    }

    foreground.appendChild(overlaySvg)

    return () => {
      // On cleanup, move elements back so React reconciliation doesn't break
      const mountainGroup = svg.querySelector('.mountain')
      if (mountainGroup) {
        const moved = g.childNodes
        while (moved.length) {
          mountainGroup.appendChild(moved[0])
        }
      }
      if (foreground.contains(overlaySvg)) {
        foreground.removeChild(overlaySvg)
      }
    }
  }, [])

  return (
    <MountainAnimation>
      <div ref={containerRef} className="absolute w-screen h-screen overflow-hidden">
        {/* Layer 0: Mountain SVG (with foreground elements removed) */}
        {children}

        {/* Layer 1: Animals (between background and foreground) */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
          {activeAnimals.map((active) => (
            <AnimatedAnimal
              key={active.id}
              active={active}
              onComplete={removeActiveAnimal}
              onAnimationEnd={markNotAnimating}
            />
          ))}
        </div>

        {/* Layer 2: Foreground SVG overlay (grasses, stones, foliage — appears in front of animals) */}
        <div
          ref={foregroundRef}
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 20 }}
        />
      </div>
      <AnimalChart visibleAnimals={visibleAnimals} maxCount={maxCount} />
    </MountainAnimation>
  )
}
