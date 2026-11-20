// Loads the posts in news/ at build time, validates them, and hands them to the /news page.
import { fileURLToPath } from 'node:url'
import { createContentLoader } from 'vitepress'
import { scanChapters } from 'vitepress-theme-skelril/node'
import type { NewsPost } from './news'
import { guideUrls, NEWS_GLOB, toPosts } from './news.node'

declare const data: NewsPost[]
export { data }

const root = fileURLToPath(new URL('../..', import.meta.url))

export default createContentLoader(NEWS_GLOB, {
  transform: (pages) => toPosts(pages, guideUrls(scanChapters(root, 'docs', 'guide').rewrites)),
})
