export type MovementStyle = 'flutter' | 'glide' | 'hop' | 'walk' | 'trot' | 'soar' | 'fly'

export interface AnimalType {
  name: string
  svgName: string
  count: number
  animating: boolean
  speed: number // seconds to cross the screen
  yRange: [number, number] // percentage range for vertical position
  size: number // height in px (relative sizing: dragon=10x deer)
  rare: boolean
  movement: MovementStyle
  color: string // single color for the chart bar
}

export const defaultAnimals: AnimalType[] = [
  {
    name: 'Butterfly',
    svgName: 'butterfly',
    count: 0,
    animating: false,
    speed: 14,
    yRange: [30, 55],
    size: 40,
    rare: false,
    movement: 'flutter',
    color: '#62C2CD',
  },
  {
    name: 'Bird',
    svgName: 'bird',
    count: 0,
    animating: false,
    speed: 10,
    yRange: [12, 35],
    size: 45,
    rare: false,
    movement: 'glide',
    color: '#274928',
  },
  {
    name: 'Rabbit',
    svgName: 'rabbit',
    count: 0,
    animating: false,
    speed: 12,
    yRange: [72, 82],
    size: 50,
    rare: false,
    movement: 'hop',
    color: '#9A8B78',
  },
  {
    name: 'Deer',
    svgName: 'deer',
    count: 0,
    animating: false,
    speed: 18,
    yRange: [65, 78],
    size: 70,
    rare: false,
    movement: 'walk',
    color: '#8B6C4A',
  },
  {
    name: 'Fox',
    svgName: 'fox',
    count: 0,
    animating: false,
    speed: 14,
    yRange: [70, 82],
    size: 55,
    rare: false,
    movement: 'trot',
    color: '#C66B2B',
  },
  {
    name: 'Eagle',
    svgName: 'eagle',
    count: 0,
    animating: false,
    speed: 14,
    yRange: [5, 25],
    size: 90,
    rare: true,
    movement: 'soar',
    color: '#4A3728',
  },
  {
    name: 'Dragon',
    svgName: 'dragon',
    count: 0,
    animating: false,
    speed: 22,
    yRange: [8, 30],
    size: 320,
    rare: true,
    movement: 'fly',
    color: '#78AB5F',
  },
]
