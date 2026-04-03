import type { AnimalType } from './animals'

interface AnimalChartProps {
  visibleAnimals: AnimalType[]
  maxCount: number
}

const BAR_MAX_WIDTH = 120

export function AnimalChart({ visibleAnimals, maxCount }: AnimalChartProps) {
  if (visibleAnimals.length === 0) return null

  return (
    <div className="z-10 absolute top-[30%] right-4 md:right-8 hidden md:block">
      <div className="bg-white/60 backdrop-blur-sm rounded-xl px-3 py-3 shadow-sm">
        <ul className="space-y-2">
          {visibleAnimals.map((animal) => (
            <li
              key={animal.name}
              className="flex items-center gap-2 transition-all duration-500"
            >
              <span
                className="text-lg shrink-0 inline-block transition-transform duration-300"
                style={{
                  transform: animal.animating ? 'scale(1.3)' : 'scale(1)',
                }}
              >
                {animal.emoji}
              </span>
              <div
                className="h-4 rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${Math.max((animal.count / maxCount) * BAR_MAX_WIDTH, 8)}px`,
                  background: animal.rare
                    ? 'linear-gradient(90deg, #f59e0b, #ef4444)'
                    : 'linear-gradient(90deg, #0ea5e9, #0369a1)',
                }}
              />
              <span className="text-xs font-semibold text-sky-900 tabular-nums min-w-[1rem] text-right">
                {animal.count}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
