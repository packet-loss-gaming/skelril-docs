// The public Skelril wiki (https://wiki.skelril.net): player guide, news and roadmap. Deployed by GitHub Actions to GitHub Pages.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createContentLoader, defineConfigWithTheme } from 'vitepress'
import { scanChapters, skelrilMarkdown, type SkelrilThemeConfig } from 'vitepress-theme-skelril/node'
import { isPostFile, MONTH_NAMES } from './theme/news'
import { FEED_PATH, FEED_TITLE, guideTitle, guideUrls, NEWS_GLOB, renderFeed, toPosts } from './theme/news.node'
import { TIPS_PATH } from './theme/tips'
import { loadTips, renderTips } from './theme/tips.node'

const root = fileURLToPath(new URL('..', import.meta.url))
// docs/NN-name.md is served at /guide/name (see the theme's scanChapters).
const guide = scanChapters(root, 'docs', 'guide')

// The newest news posts, in full, as an RSS feed. Needs a running VitePress (build or dev) for createContentLoader.
async function feed(): Promise<string> {
  const pages = await createContentLoader(NEWS_GLOB, { render: true }).load()
  return renderFeed(toPosts(pages, guideUrls(guide.rewrites)), new Map(pages.map((p) => [p.url, p.html ?? ''])))
}

// Files written next to the pages at build time and served by the dev server: the feed, and the home page's tips.
const generated: Record<string, { type: string; render: () => Promise<string> }> = {
  [FEED_PATH]: { type: 'application/rss+xml', render: feed },
  [TIPS_PATH]: { type: 'application/json', render: async () => renderTips(loadTips(root, guide.rewrites)) },
}

export default defineConfigWithTheme<SkelrilThemeConfig>({
  title: 'Skelril',
  description: 'The Grindstone server, rebuilt on Luanti.',
  lang: 'en',
  srcDir: '.',
  srcExclude: ['README.md', 'AGENTS.md', 'roadmap/**', 'tips/**', 'build/**'],
  outDir: 'build',
  // GitHub Pages serves /page.html for /page; keep URLs without .html or a trailing slash.
  cleanUrls: true,
  rewrites: guide.rewrites,
  // Dead links fail the build (ignoreDeadLinks stays unset).
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/img/favicon.svg' }],
    ['link', { rel: 'alternate', type: 'application/rss+xml', title: FEED_TITLE, href: FEED_PATH }],
  ],
  // The feed is /news/rss.xml, beside the posts. The news list is news/index.md, served at /news/: with both news.html
  // and a news/ folder, GitHub Pages would redirect /news to an empty /news/.
  async buildEnd({ outDir }) {
    for (const [file, { render }] of Object.entries(generated)) {
      fs.mkdirSync(path.dirname(path.join(outDir, file)), { recursive: true })
      fs.writeFileSync(path.join(outDir, file), await render())
    }
  },
  transformPageData(pageData) {
    // News posts (news/*.md) get their heading from NewsHeader.vue. A feature post's header names the guide page it
    // links to, and it has no outline to show beside it; a fixes post keeps the outline of its topics (## headings).
    if (isPostFile(pageData.relativePath) && pageData.frontmatter.type === 'feature') {
      pageData.frontmatter.aside ??= false
      pageData.frontmatter.guideTitle = guideTitle(root, guide.rewrites, String(pageData.frontmatter.guide))
    }
    // Month archives (news/[year]/[month].md) are titled after their month.
    const { year, month } = pageData.params ?? {}
    if (year && month) pageData.title = `News: ${MONTH_NAMES[Number(month) - 1]} ${year}`
  },
  // `vitepress dev` never runs buildEnd, so serve the generated files from the current sources there too.
  vite: {
    plugins: [{
      name: 'skelril-generated',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const file = generated[req.url?.split('?')[0] ?? '']
          if (!file) return next()
          file.render().then((body) => {
            res.setHeader('Content-Type', `${file.type}; charset=utf-8`)
            res.end(body)
          }, next)
        })
      },
    }],
  },
  // Always follows the visitor's system light/dark preference; no toggle.
  appearance: 'force-auto',
  markdown: { config: skelrilMarkdown },
  themeConfig: {
    logo: { src: '/img/favicon.svg', width: 24, height: 24, alt: '' },
    siteTitle: 'Skelril',
    nav: [
      { text: 'Player guide', link: '/guide/welcome', activeMatch: '^/guide/' },
      { text: 'News', link: '/news/', activeMatch: '^/news/' },
      { text: 'Roadmap', link: '/roadmap' },
    ],
    sidebar: { '/guide/': guide.sidebar },
    categories: guide.categories,
    outline: [2, 3],
    editLink: {
      pattern: ({ filePath }) => `https://github.com/packet-loss-gaming/skelril-docs/edit/main/${filePath}`,
      text: 'Edit this page',
    },
  },
})
