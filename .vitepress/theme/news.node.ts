// Build-time side of the news: validates the posts in news/ and writes the RSS feed. Used by news.data.ts (the /news
// page) and config.mts (news/rss.xml); never import this from the client.
import fs from 'node:fs'
import path from 'node:path'
import type { ContentData } from 'vitepress'
import { isPostFile, POST_TYPE_LABELS, POST_TYPES, type NewsPost, type PostType } from './news'

export const SITE_URL = 'https://wiki.skelril.net'
export const FEED_PATH = '/news/rss.xml'
// The posts; news/index.md is the /news/ list page itself and is skipped.
export const NEWS_GLOB = 'news/*.md'
export const NEWS_URL = '/news/'
export const FEED_TITLE = 'Skelril news'

/**
 * Every year and month (as { year: '2026', month: '11' }) with at least one post, read straight from the posts'
 * frontmatter dates. Used by news/[year]/[month].paths.ts, which runs before createContentLoader can.
 */
export function postMonths(newsDir: string): { year: string; month: string }[] {
  const months = new Set<string>()
  for (const name of fs.readdirSync(newsDir)) {
    if (!isPostFile(`news/${name}`)) continue
    const date = /^date:\s*(\d{4})-(\d{2})-\d{2}\s*$/m.exec(fs.readFileSync(path.join(newsDir, name), 'utf8'))
    if (!date) throw new Error(`news/${name} needs a date such as 2026-11-19 (unquoted) in its frontmatter`)
    months.add(`${date[1]}/${date[2]}`)
  }
  return [...months].map((m) => ({ year: m.slice(0, 4), month: m.slice(5) }))
}

/** Player guide URLs from scanChapters' rewrites (docs/06-areas/11-gold-rush.md -> /guide/areas/gold-rush). */
export function guideUrls(rewrites: Record<string, string>): Set<string> {
  return new Set(Object.values(rewrites).map(pageUrl))
}

function pageUrl(page: string): string {
  return '/' + page.replace(/(^|\/)index\.md$/, '').replace(/\.md$/, '').replace(/\/$/, '')
}

/** The source file of the guide page at `url`, such as /guide/cheat-sheet -> docs/10-cheat-sheet.md. */
export function guideSource(rewrites: Record<string, string>, url: string): string | undefined {
  return Object.keys(rewrites).find((src) => pageUrl(rewrites[src]) === url)
}

/** The title (first "# " heading) of the guide page at `url`, such as /guide/areas/sky-world -> The Sky World. */
export function guideTitle(root: string, rewrites: Record<string, string>, url: string): string {
  const source = guideSource(rewrites, url)
  if (!source) throw new Error(`news: no guide page at "${url}"`)
  const heading = /^# (.+)$/m.exec(fs.readFileSync(path.join(root, source), 'utf8'))
  if (!heading) throw new Error(`news: guide page ${source} has no "# " heading`)
  return heading[1].trim()
}

/**
 * Validates the posts' frontmatter and sorts them newest first (then by title). The guide link must be a real guide
 * page, since the dead-link check does not see links made by Vue components.
 */
export function toPosts(pages: ContentData[], guides: ReadonlySet<string>): NewsPost[] {
  const posts = pages.filter((p) => p.url !== NEWS_URL).map((p): NewsPost => {
    const fm = p.frontmatter
    const where = `news post ${p.url}`
    if (!(POST_TYPES as readonly unknown[]).includes(fm.type)) throw new Error(`${where} needs a type: ${POST_TYPES.join(' or ')}`)
    const type = fm.type as PostType
    for (const field of ['title', 'summary', ...(type === 'feature' ? ['guide'] : [])]) {
      if (typeof fm[field] !== 'string' || !fm[field].trim()) throw new Error(`${where} needs a "${field}" in its frontmatter`)
    }
    // YAML parses date: 2026-11-19 as a Date.
    if (!(fm.date instanceof Date)) throw new Error(`${where} needs a date such as 2026-11-19 (unquoted) in its frontmatter`)
    if (type === 'fixes' && fm.guide !== undefined) throw new Error(`${where} is a fixes post; only feature posts have a guide link`)
    if (type === 'feature' && !guides.has(fm.guide)) throw new Error(`${where} links to missing guide page "${fm.guide}"`)
    return { url: p.url, type, title: fm.title.trim(), date: fm.date.toISOString().slice(0, 10), summary: fm.summary.trim(),
      ...(type === 'feature' ? { guide: fm.guide as string } : {}) }
  })
  return posts.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title))
}

function xml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

// Noon UTC keeps the day the same in every reader's time zone.
const rfc822 = (date: string) => new Date(`${date}T12:00:00Z`).toUTCString()

export const FEED_SIZE = 30

/** Makes a post's rendered HTML work outside the site: root-relative links and images get the site URL. */
function absolute(html: string): string {
  return html.replace(/(href|src)="\/(?!\/)/g, `$1="${SITE_URL}/`)
}

// "]]>" is the only text a CDATA section cannot hold; split it across two sections.
const cdata = (s: string) => `<![CDATA[${s.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`

/**
 * RSS 2.0 feed of the newest FEED_SIZE posts. Each item carries the summary as its description, the post type as its
 * category, and the full post (ending with the guide link, for features) as content:encoded. `html` maps a post URL to its rendered body.
 */
export function renderFeed(posts: NewsPost[], html: ReadonlyMap<string, string>): string {
  const items = posts.slice(0, FEED_SIZE).map((p) => {
    const guide = p.guide ? `\n<p><a href="${xml(SITE_URL + p.guide)}">Read the guide →</a></p>` : ''
    const body = absolute(html.get(p.url) ?? '') + guide
    return `    <item>
      <title>${xml(p.title)}</title>
      <link>${xml(SITE_URL + p.url)}</link>
      <description>${xml(p.summary)}</description>
      <category>${POST_TYPE_LABELS[p.type]}</category>
      <content:encoded>${cdata(body)}</content:encoded>
      <pubDate>${rfc822(p.date)}</pubDate>
      <guid isPermaLink="true">${xml(SITE_URL + p.url)}</guid>
    </item>`
  })
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${FEED_TITLE}</title>
    <link>${SITE_URL}${NEWS_URL}</link>
    <description>New features in Skelril, the Grindstone server rebuilt on Luanti.</description>
    <language>en</language>
    <atom:link href="${SITE_URL}${FEED_PATH}" rel="self" type="application/rss+xml"/>
${posts[0] ? `    <lastBuildDate>${rfc822(posts[0].date)}</lastBuildDate>\n` : ''}${items.join('\n')}
  </channel>
</rss>
`
}
