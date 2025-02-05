import MountainAnimation from './MountainAnimation'

export default function InteractiveMountain({children}: {children: React.ReactElement}) {
  return (
    <MountainAnimation>
      <div className="absolute w-screen h-screen overflow-hidden">
        {children}
      </div>
    </MountainAnimation>
  )
}
