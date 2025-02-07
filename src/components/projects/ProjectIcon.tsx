/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-no-useless-fragment, no-nested-ternary */
export interface ProjectIconProps {
  icon_url: string | null
  size?: number
}

export const ProjectIcon = ({ icon_url, size = 64 }: ProjectIconProps) => {
  if (!icon_url) {
    return <></>
  }

  return (
    <img src={icon_url} className="bg-white-400 p-1" height={size} width={size} alt="Project icon" loading="lazy" />
  )
}
