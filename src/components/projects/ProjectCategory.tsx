/* eslint-disable react/jsx-no-useless-fragment, @typescript-eslint/no-unnecessary-condition */
export interface ProjectCategoryProps {
  category?: string
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const ProjectCategory = ({ category }: ProjectCategoryProps) => {
  if (!category || category?.length === 0 || !category.charAt) {
    return <></>
  }

  return (
    <span>
      <b>Category:</b> {capitalizeFirstLetter(category)}
    </span>
  )
}
