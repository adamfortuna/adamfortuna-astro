import { useState, useCallback, useRef, useEffect } from 'react'
import { defaultAnimals, type AnimalType } from './animals'

export interface ActiveAnimal {
  id: number
  animal: AnimalType
  y: number // percentage from top
  startX: number
  direction: 'left' | 'right'
}

export function useAnimalState() {
  const [animals, setAnimals] = useState<AnimalType[]>(defaultAnimals)
  const [activeAnimals, setActiveAnimals] = useState<ActiveAnimal[]>([])
  const nextId = useRef(0)
  const spawnTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const spawnAnimal = useCallback(() => {
    setAnimals((prev) => {
      // Pick a random animal, weighted toward common ones
      const roll = Math.random()
      let candidates: AnimalType[]
      if (roll < 0.15) {
        candidates = prev.filter((a) => a.rare)
      } else {
        candidates = prev.filter((a) => !a.rare)
      }
      if (candidates.length === 0) candidates = prev

      const animal = candidates[Math.floor(Math.random() * candidates.length)]
      const y = animal.yRange[0] + Math.random() * (animal.yRange[1] - animal.yRange[0])
      const direction = Math.random() > 0.5 ? 'left' : 'right'
      const id = nextId.current++

      const newActive: ActiveAnimal = {
        id,
        animal,
        y,
        startX: direction === 'right' ? -10 : 110,
        direction,
      }

      setActiveAnimals((active) => [...active, newActive])

      // Update count for this animal
      const updated = prev.map((a) =>
        a.name === animal.name ? { ...a, count: a.count + 1, animating: true } : a,
      )
      return updated
    })
  }, [])

  const removeActiveAnimal = useCallback((id: number) => {
    setActiveAnimals((prev) => prev.filter((a) => a.id !== id))
  }, [])

  const markNotAnimating = useCallback((name: string) => {
    setAnimals((prev) =>
      prev.map((a) => (a.name === name ? { ...a, animating: false } : a)),
    )
  }, [])

  // Auto-spawn animals at random intervals
  useEffect(() => {
    function scheduleNext() {
      const delay = 3000 + Math.random() * 6000 // 3-9 seconds
      spawnTimer.current = setTimeout(() => {
        spawnAnimal()
        scheduleNext()
      }, delay)
    }

    // First spawn after a short delay
    spawnTimer.current = setTimeout(() => {
      spawnAnimal()
      scheduleNext()
    }, 2000)

    return () => {
      if (spawnTimer.current) clearTimeout(spawnTimer.current)
    }
  }, [spawnAnimal])

  const visibleAnimals = animals.filter((a) => a.count > 0)
  const maxCount = Math.max(...animals.map((a) => a.count), 1)

  return {
    animals,
    visibleAnimals,
    activeAnimals,
    maxCount,
    spawnAnimal,
    removeActiveAnimal,
    markNotAnimating,
  }
}
