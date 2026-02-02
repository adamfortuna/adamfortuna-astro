/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { getEnv } from '../middleware';
import type {
  Author,
  Article,
  Comment,
  Page,
  PhotoPost,
  Post,
  Tag,
  Webmention,
  WordpressPost,
  WordpressPage,
  WordpressProject,
  WordpressClientIdentifier,
  WordPressComment,
  Category,
  WordpressProjectAcf,
  Link,
  Project,
} from '../types'
import omitBy from "lodash/omitBy"

const parseUrl = (post: WordpressPost) => {
  if (post.project === 'minafi') {
    return `https://minafi.com/${post.slug}`
  }
  if (post.project === 'hardcover') {
    return `https://hardcover.app/blog/${post.slug}`
  }
  return null
}

export const sortByDateDesc = (a1: Article, a2: Article) => {
  const a1d = new Date(a1.date).getTime()
  const a2d = new Date(a2.date).getTime()
  if (a1d === a2d) {
    return 0
  }
  return a1d < a2d ? 1 : -1
}

export const sortByCommentsDesc = (a1: Article, a2: Article) => {
  if (Number(a1.commentCount) === Number(a2.commentCount)) {
    return 0
  }
  return Number(a1.commentCount) < Number(a2.commentCount) ? 1 : -1
}

export const parseTags = (tags: Tag[]) => {
  return tags.map((t) => {
    const tag = {
      name: t.name,
      slug: t.slug,
      description: t.description,
      count: t.count,
    } as Tag
    return omitBy(tag, (v) => v === null || v === undefined) as Tag
  })
}

const parseCategories = (categories: Category[]) => {
  return categories.map((c) => {
    const category = {
      name: c.name,
      slug: c.slug,
      description: c.description,
      count: c.count,
    } as Category
    return omitBy(category, (v) => v === null || v === undefined) as Category
  })
}

const parseWebmention = (wpComment: WordPressComment) => {
  if (!wpComment.webmention) {
    return null
  }
  return {
    source_url: wpComment.webmention.webmention_source_url,
    target_url: wpComment.webmention.webmention_target_url,
  } as Webmention
}

const parseCommentAuthor = (wpComment: WordPressComment) => {
  const authorNode = wpComment.author.node
  let url
  if (wpComment.type === 'mention') {
    const { webmention } = wpComment
    url = webmention.author_avatar
  } else if (wpComment.type === 'comment') {
    url = authorNode?.avatar?.url
  }
  const author = {
    url: authorNode.url,
    name: authorNode.name,
    avatar: { url },
  } as Author

  return omitBy(author, (v) => v === null || v === undefined) as Author
}

const parseReplies = (parentCommentDatadatabseId: number, comments: WordPressComment[]) => {
  const replies = comments.filter((c) => c.parentDatabaseId === parentCommentDatadatabseId)
  return replies
    .map((comment) => parseComment(comment, comments))
    .sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    })
}

const parseComment = (wpComment: WordPressComment, comments: WordPressComment[]) => {
  const hasChildren = comments.filter((c) => c.parentDatabaseId === wpComment.databaseId).length > 0

  const webmention = parseWebmention(wpComment)
  const comment = {
    id: wpComment.databaseId,
    author: parseCommentAuthor(wpComment),
    content: wpComment.content,
    date: wpComment.date,
    type: wpComment.type,
    root: wpComment.parentDatabaseId === 0,
    replies: hasChildren ? parseReplies(wpComment.databaseId, comments) : [],
    webmention,
  } as Comment
  return omitBy(comment, (v) => v === null || v === undefined) as Comment
}

const parseComments = (comments: WordPressComment[]) => {
  return comments
    .filter((c) => c.status === 'APPROVE')
    .map((comment) => parseComment(comment, comments))
    .filter((c) => c.root)
    .sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    })
}

export const parsePost = (post: WordpressPost, full: boolean = false) => {
  const url = parseUrl(post)
  const tags = post.tags?.nodes ? parseTags(post.tags.nodes) : undefined
  const isHighlighted = tags?.length && tags.length > 0 ? tags.map((t) => t.slug).indexOf('highlights') !== -1 : false
  const comments =
    post.comments && post.comments.nodes && post.comments.nodes.length > 0 ? parseComments(post.comments.nodes) : null

  const article = {
    id: post.id,
    title: post.title,
    uri: post.uri,
    slug: post.slug,
    date: post.date,
    author: post.author?.node ? post.author.node.name : null,
    featuredImage: post.featuredImage?.node ? post.featuredImage?.node : null,
    categories: post.categories?.nodes ? parseCategories(post.categories.nodes) : undefined,
    content: post.content || null,
    excerpt: post.excerpt?.length > 0 && (full || isHighlighted) ? post.excerpt : null,
    readingTime: post.content ? Math.round(post.content.split(' ').length / 300) + 1 : null,
    tags,
    url,
    external: !!url,
    project: post.project,
    commentCount: comments ? comments.length : post.commentCount || null,
    comments,
    allowComments: post.commentStatus === 'open',
    allowPings: post.pingStatus === 'open',
  } as Article
  const aritcleWithoutParams = omitBy(article, (v) => v === null || v === undefined)

  if (post.contentTypeName === 'photos') {
    return {
      ...aritcleWithoutParams,
      ...{
        root: post.parentId === null,
        excerpt: post.excerpt,
      },
      ...{
        series: post.series,
      },
    } as PhotoPost
  }
  return aritcleWithoutParams as Post
}

export const parsePage = (page: WordpressPage) => {
  const article = {
    title: page.title,
    uri: page.uri,
    slug: page.slug,
    date: page.date,
    featuredImage: page.featuredImage?.node ? page.featuredImage?.node : null,
    content: page.content || null,
    project: page.project,
    allowComments: page.commentStatus === 'open',
  } as Page

  return omitBy(article, (v) => v === null || v === undefined) as Page
}

const parseLinks = (projectInfo: WordpressProjectAcf) => {
  const links: Link[] = []

  if (projectInfo.link1) {
    links.push({
      url: projectInfo.link1,
      title: projectInfo.link1Text,
    })
  }
  if (projectInfo.link2) {
    links.push({
      url: projectInfo.link2,
      title: projectInfo.link2Text,
    })
  }
  if (projectInfo.link3) {
    links.push({
      url: projectInfo.link3,
      title: projectInfo.link3Text,
    })
  }
  if (projectInfo.link4) {
    links.push({
      url: projectInfo.link4,
      title: projectInfo.link4Text,
    })
  }
  if (projectInfo.link5) {
    links.push({
      url: projectInfo.link5,
      title: projectInfo.link5Text,
    })
  }
  if (projectInfo.link6) {
    links.push({
      url: projectInfo.link6,
      title: projectInfo.link6Text,
    })
  }

  return links
}
export const parseProject = (project: WordpressProject) => {
  const { projectInfo } = project

  const tags = project.tags?.nodes ? parseTags(project.tags.nodes) : []
  return {
    slug: project.slug,
    tags: tags.map((t) => t.name),
    links: parseLinks(projectInfo),
    description: project.excerpt,
    salary: projectInfo.compensation,
    role: projectInfo.role,
    employed: projectInfo.employed === "yes",
    years_active: projectInfo.yearsActive,
    category: projectInfo.category,
    size: projectInfo.size,
    state: projectInfo.state,
    state_description: projectInfo.stateDescription,
    title: project.title,
    icon_url: projectInfo.icon?.sourceUrl,
    date_started: projectInfo.dateStarted ? new Date(projectInfo.dateStarted) : null,
    date_ended: projectInfo.dateEnded ? new Date(projectInfo.dateEnded) : null,
  } as Project
}

export const fetchClient = ({
  url,
  auth,
  query,
  variables = {},
}: {
  url: string
  auth: string
  query: string
  variables?: any
}) => {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: auth,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  }).then((res) => res.json())
}

export const adamfortunaClient = ({ query, variables = {} }: { query: string; variables?: any }) => {
  const token = getEnv('WP_ADAMFORTUNA_TOKEN');
  if (!token) {
    console.error('WP_ADAMFORTUNA_TOKEN is not set');
  }
  return fetchClient({
    url: 'https://wp.adamfortuna.com/graphql',
    auth: `Basic ${token}`,
    query,
    variables,
  })
}

export const hardcoverClient = ({ query, variables = {} }: { query: string; variables?: any }) => {
  const token = getEnv('WP_HARDCOVER_TOKEN');
  if (!token) {
    console.error('WP_HARDCOVER_TOKEN is not set');
  }
  return fetchClient({
    url: 'https://wp.hardcover.app/graphql',
    auth: `Basic ${token}`,
    query,
    variables,
  })
}

export const minafiClient = ({ query, variables = {} }: { query: string; variables?: any }) => {
  const token = getEnv('WP_MINAFI_TOKEN');
  if (!token) {
    console.error('WP_MINAFI_TOKEN is not set');
  }
  return fetchClient({
    url: 'https://wp.minafi.com/graphql',
    auth: `Basic ${token}`,
    query,
    variables,
  })
}

export const getClientForProject = (project: WordpressClientIdentifier) => {
  if (project === 'hardcover') {
    return hardcoverClient
  }
  if (project === 'minafi') {
    return minafiClient
  }
  return adamfortunaClient
}
