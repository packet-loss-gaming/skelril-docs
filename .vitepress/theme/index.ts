import type { Theme } from 'vitepress'
import SkelrilTheme from 'vitepress-theme-skelril'
import Home from './Home.vue'
import Roadmap from './Roadmap.vue'

export default {
  extends: SkelrilTheme,
  enhanceApp({ app }) {
    app.component('Home', Home)
    app.component('Roadmap', Roadmap)
  },
} satisfies Theme
