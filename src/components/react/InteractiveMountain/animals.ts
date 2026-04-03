export interface AnimalType {
  name: string
  emoji: string
  count: number
  animating: boolean
  speed: number // seconds to cross the screen
  yRange: [number, number] // percentage range for vertical position (0=top, 100=bottom)
  size: number // font size in px
  rare: boolean
}

export const defaultAnimals: AnimalType[] = [
  {
    name: 'Butterfly',
    emoji: '🦋',
    count: 0,
    animating: false,
    speed: 8,
    yRange: [25, 55],
    size: 28,
    rare: false,
  },
  {
    name: 'Bird',
    emoji: '🐦',
    count: 0,
    animating: false,
    speed: 5,
    yRange: [10, 35],
    size: 28,
    rare: false,
  },
  {
    name: 'Rabbit',
    emoji: '🐇',
    count: 0,
    animating: false,
    speed: 6,
    yRange: [72, 82],
    size: 30,
    rare: false,
  },
  {
    name: 'Deer',
    emoji: '🦌',
    count: 0,
    animating: false,
    speed: 10,
    yRange: [65, 78],
    size: 34,
    rare: false,
  },
  {
    name: 'Fox',
    emoji: '🦊',
    count: 0,
    animating: false,
    speed: 7,
    yRange: [70, 82],
    size: 30,
    rare: false,
  },
  {
    name: 'Eagle',
    emoji: '🦅',
    count: 0,
    animating: false,
    speed: 6,
    yRange: [5, 25],
    size: 36,
    rare: true,
  },
  {
    name: 'Dragon',
    emoji: '🐉',
    count: 0,
    animating: false,
    speed: 12,
    yRange: [8, 30],
    size: 44,
    rare: true,
  },
]
