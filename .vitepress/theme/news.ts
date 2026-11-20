// The news posts' shape, shared by the data loader, the RSS feed and the pages. Client-safe.

/** feature: one new feature, linking to its guide page. fixes: bug fixes, any number of topics, no guide link. */
export const POST_TYPES = ['feature', 'fixes'] as const
export type PostType = (typeof POST_TYPES)[number]
/** How each type is labelled on the site and in the feed. */
export const POST_TYPE_LABELS: Record<PostType, string> = { feature: 'New feature', fixes: 'Bug fixes' }

/** One post in news/, which is also one RSS item. */
export interface NewsPost {
  /** Page URL, such as /news/gold-rush. */
  url: string
  type: PostType
  title: string
  /** YYYY-MM-DD */
  date: string
  /** One line for the news list and the feed. */
  summary: string
  /** Player guide URL, such as /guide/areas/gold-rush. Feature posts only. */
  guide?: string
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** 2026-11-19 -> 19 Nov 2026 */
export function formatDate(date: string): string {
  const [y, m, d] = date.split('-')
  return `${Number(d)} ${MONTHS[Number(m) - 1]} ${y}`
}

export const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October',
  'November', 'December']

/** A news/*.md file that is a post: not the list page news/index.md, nor the month pages under news/[year]/. */
export function isPostFile(relativePath: string): boolean {
  return /^news\/[^/]+\.md$/.test(relativePath) && relativePath !== 'news/index.md'
}

/** The archive page of a post's month: 2026-11-19 -> /news/2026/11 */
export function monthUrl(date: string): string {
  return `/news/${date.slice(0, 4)}/${date.slice(5, 7)}`
}
