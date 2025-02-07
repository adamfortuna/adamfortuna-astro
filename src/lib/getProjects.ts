import { getClientForProject, parseProject } from './api'
import type { Project } from '../types'

export const findProjects = `
query GetProjects {
  projects(first: 10000) {
    nodes {
      projectInfo: project {
        category
        compensation
        dateEnded
        dateStarted
        employed
        employer
        fieldGroupName
        link1
        link1Text
        link2
        link2Text
        link3
        link3Text
        link4
        link4Text
        link5
        link5Text
        link6
        link6Test
        role
        size
        state
        stateDescription
        yearsActive
        icon {
          sourceUrl
          mediaDetails {
            height
            width
          }
        }
      }
      excerpt(format: RAW)
      title
      slug
      tags {
        nodes {
          name
        }
      }
    }
  }
}
`

export const getProjects = async (): Promise<Project[]> => {
  const result = await getClientForProject('adamfortuna')({
    query: findProjects,
  })

  return result.data.projects.nodes.map((node: any) => parseProject(node))
}
