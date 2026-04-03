import type { AnimalType } from './animals'

interface AnimalChartProps {
  visibleAnimals: AnimalType[]
  maxCount: number
}

// Lazy-load SVG components for chart icons
const svgComponents: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {}
const svgModules = import.meta.glob('./svg/*.svg', { eager: true }) as Record<string, { default: React.ComponentType<React.SVGProps<SVGSVGElement>> }>
for (const [path, mod] of Object.entries(svgModules)) {
  const name = path.replace('./svg/', '').replace('.svg', '')
  svgComponents[name] = mod.default
}

const BAR_MAX_WIDTH = 100

export function AnimalChart({ visibleAnimals, maxCount }: AnimalChartProps) {
  if (visibleAnimals.length === 0) return null

  return (
    <div className="z-10 absolute top-[30%] right-4 md:right-8 hidden md:block">
      <div className="bg-white/50 backdrop-blur-sm rounded-xl px-3 py-3 shadow-sm">
        <ul className="space-y-2">
          {visibleAnimals.map((animal) => {
            const SvgIcon = svgComponents[animal.svgName]
            return (
              <li
                key={animal.name}
                className="flex items-center gap-2 transition-all duration-500"
              >
                <span
                  className="shrink-0 inline-flex items-center justify-center w-6 h-6 transition-transform duration-300"
                  style={{
                    transform: animal.animating ? 'scale(1.2)' : 'scale(1)',
                  }}
                >
                  {SvgIcon && <SvgIcon style={{ height: '100%', width: 'auto' }} />}
                </span>
                <div
                  className="h-3.5 rounded transition-all duration-700 ease-out"
                  style={{
                    width: `${Math.max((animal.count / maxCount) * BAR_MAX_WIDTH, 6)}px`,
                    backgroundColor: animal.color,
                  }}
                />
                <span className="text-xs font-semibold text-sky-900 tabular-nums min-w-[1rem] text-right">
                  {animal.count}
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
