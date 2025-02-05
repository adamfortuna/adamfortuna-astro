export interface Link {
  url: string
  title: string
}
export type WordpressClientIdentifier = 'adamfortuna' | 'hardcover' | 'minafi'

export interface Project {
  slug: string
  tags?: string[]
  links: Link[]
  description: string
  salary: string
  role: string
  employed: boolean
  years_active: string
  category: string // app |
  size: string
  state: 'idea' | 'development' | 'live' | 'retired' | 'transferred' | 'left'
  state_description: string
  title: string
  icon_url: string
  date_started: Date
  date_ended: Date
}

export interface Article {
  id: number
  slug: string
  title: string
  content?: string
  date: string
  project: WordpressClientIdentifier
  readingTime?: number
  external: boolean
  url: string
  featuredImage?: WordpressImage
  allowComments?: boolean
  allowPings?: boolean
  commentCount: number
  author: string

  // Todo: Move these to Post
  tags?: Tag[]
  categories?: Category[]
  excerpt?: string
  comments?: Comment[]
}

export interface Post extends Article {}
export interface Page extends Article {}
export interface PhotoPost extends Article {
  root: boolean
  series?: WordpressSeriesType
}

export interface ArticlesListType {
  articles: Article[]
}
export interface Category {
  count?: number
  description?: string
  name: string
  slug: string
}

export interface Tag {
  name: string
  slug: string
  description?: string
  count?: number
  __typename?: string
}

interface WordpressCategories {
  nodes: Category[]
}

interface WordpressMedia {
  width: number
  height: number
}
interface WordpressTags {
  nodes: Tag[]
}
interface WordpressImage {
  sourceUrl: string
  mediaDetails?: WordpressMedia
}
interface WordpressImageNode {
  node: WordpressImage
}
interface Avatar {
  url?: string
  width?: number
  height?: number
}
interface WordpressAuthor {
  url?: string
  name: string
  avatar: Avatar
}
interface WordpressAuthorNode {
  node: WordpressAuthor
}
export interface Author extends WordpressAuthor {}

export interface Webmention {
  source_url: string
  target_url: string
}
export type CommentType = 'mention' | 'comment' | 'like' | 'repost'
export interface Comment {
  author: Author
  content: string
  id: number
  date: string
  type: CommentType
  webmention: Webmention
  root: boolean
  parentDatabaseId: number
  replies: Comment[]
}
export interface WordPressComment {
  author: WordpressAuthorNode
  content: string
  databaseId: number
  replies?: WordpressComments
  date: string
  status: 'APPROVE' | 'PENDING'
  type?: CommentType
  parentDatabaseId: number
  webmention: {
    author_avatar?: string
    author_url?: string
    webmention_source_url?: string
    webmention_target_url?: string
  }
}
interface WordpressComments {
  nodes: WordPressComment[]
}

export type WordpressPostType = 'photos' | 'post' | 'page'
export interface WordpressContent {
  id: number
  slug: string
  title: string
  date: string
  featuredImage?: WordpressImageNode
  content: string
  project?: string
  guid: string
  comments?: WordpressComments
  commentStatus: 'open' | 'closed'
  pingStatus: 'open' | 'closed'
  commentCount?: number
  contentTypeName: WordpressPostType
  author: {
    node: {
      name: string
    }
  }
}
interface WordpressSeriesType {
  series: string
  seriesCount: number
  seriesOrder: number
}
export interface WordpressPost extends WordpressContent {
  categories: WordpressCategories | null
  tags: WordpressTags | null
  excerpt: string
  parentId?: string
  series?: WordpressSeriesType
}

export interface WordpressPage extends WordpressContent {}

export interface WordpressProjectAcf {
  category: string
  compensation: string
  dateEnded: string
  dateStarted: string
  employed: boolean
  employer: string
  link1: string
  link1Text: string
  link2: string
  link2Text: string
  link3: string
  link3Text: string
  link4: string
  link4Text: string
  link5: string
  link5Text: string
  link6: string
  link6Text: string
  role: string
  size: 'sm' | 'md' | 'lg'
  state: string
  stateDescription: string
  yearsActive: string
  icon: WordpressImage
}
export interface WordpressProject extends WordpressContent {
  tags: WordpressTags | null
  excerpt: string
  projectInfo: WordpressProjectAcf
}

interface HardcoverImageType {
  url: string
  height: number
  width: number
}
interface HardcoverAuthor {
  name: string
}
interface HardcoverContributionType {
  contribution: string
  author: HardcoverAuthor
}
interface BookType {
  title: string
  slug: string
  cachedImage: HardcoverImageType
  contributions: HardcoverContributionType[]
}
interface BookReviewType {
  id: number
  rating: number
  book: BookType
  reviewedAt: string
  review?: string
  likesCount: number
}
export interface BookReviewReadType {
  id: number
  startedAt?: string
  finishedAt: string
  userBook: BookReviewType
}
