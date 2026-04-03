import MountainAnimation from './MountainAnimation'
import { useAnimalState } from './useAnimalState'
import { AnimatedAnimal } from './AnimatedAnimal'
import { AnimalChart } from './AnimalChart'

export default function InteractiveMountain({children}: {children: React.ReactElement}) {
  const {
    visibleAnimals,
    activeAnimals,
    maxCount,
    removeActiveAnimal,
    markNotAnimating,
  } = useAnimalState()

  return (
    <MountainAnimation>
      <div className="absolute w-screen h-screen overflow-hidden">
        {children}
        {activeAnimals.map((active) => (
          <AnimatedAnimal
            key={active.id}
            active={active}
            onComplete={removeActiveAnimal}
            onAnimationEnd={markNotAnimating}
          />
        ))}
      </div>
      <AnimalChart visibleAnimals={visibleAnimals} maxCount={maxCount} />
    </MountainAnimation>
  )
}
