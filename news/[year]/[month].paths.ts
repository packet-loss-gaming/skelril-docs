// One archive page per month with news: /news/2026/11. See News.vue.
import { fileURLToPath } from 'node:url'
import { postMonths } from '../../.vitepress/theme/news.node'

export default {
  watch: ['../*.md'],
  paths: () => postMonths(fileURLToPath(new URL('..', import.meta.url))).map((params) => ({ params })),
}
