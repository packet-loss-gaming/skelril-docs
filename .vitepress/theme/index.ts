import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme-without-fonts'
import SkelrilTheme, { DocFooterNote } from 'vitepress-theme-skelril'
import Home from './Home.vue'
import News from './News.vue'
import NewsHeader from './NewsHeader.vue'
import Roadmap from './Roadmap.vue'
import SkinTool from './SkinTool.vue'
import './style.css'

export default {
  extends: SkelrilTheme,
  // The theme's own Layout plus a news post heading. Keep its doc-after slot in step with the theme's src/index.ts.
  Layout: () => h(DefaultTheme.Layout, null, { 'doc-before': () => h(NewsHeader), 'doc-after': () => h(DocFooterNote) }),
  enhanceApp({ app }) {
    app.component('Home', Home)
    app.component('News', News)
    app.component('Roadmap', Roadmap)
    app.component('SkinTool', SkinTool)
  },
} satisfies Theme
