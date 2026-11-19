// The public Skelril wiki (https://wiki.skelril.net): player guide and roadmap. Deployed by GitHub Actions to GitHub Pages.
import { fileURLToPath } from 'node:url'
import { defineConfigWithTheme } from 'vitepress'
import { scanChapters, skelrilMarkdown, type SkelrilThemeConfig } from 'vitepress-theme-skelril/node'

const root = fileURLToPath(new URL('..', import.meta.url))
// docs/NN-name.md is served at /guide/name (see the theme's scanChapters).
const guide = scanChapters(root, 'docs', 'guide')

export default defineConfigWithTheme<SkelrilThemeConfig>({
  title: 'Skelril',
  description: 'The Grindstone server, rebuilt on Luanti.',
  lang: 'en',
  srcDir: '.',
  srcExclude: ['README.md', 'AGENTS.md', 'roadmap/**', 'build/**'],
  outDir: 'build',
  // GitHub Pages serves /page.html for /page; keep URLs without .html or a trailing slash.
  cleanUrls: true,
  rewrites: guide.rewrites,
  // Dead links fail the build (ignoreDeadLinks stays unset).
  head: [['link', { rel: 'icon', type: 'image/svg+xml', href: '/img/favicon.svg' }]],
  // Always follows the visitor's system light/dark preference; no toggle.
  appearance: 'force-auto',
  markdown: { config: skelrilMarkdown },
  themeConfig: {
    logo: { src: '/img/favicon.svg', width: 24, height: 24, alt: '' },
    siteTitle: 'Skelril',
    nav: [
      { text: 'Player guide', link: '/guide/welcome', activeMatch: '^/guide/' },
      { text: 'Roadmap', link: '/roadmap' },
    ],
    sidebar: { '/guide/': guide.sidebar },
    categories: guide.categories,
    outline: [2, 3],
    editLink: {
      pattern: ({ filePath }) => `https://github.com/packet-loss-gaming/skelril-docs/edit/main/${filePath}`,
      text: 'Edit this page',
    },
    footer: { copyright: 'Skelril is free software (GPLv3) and built on Mineclonia.' },
  },
})
