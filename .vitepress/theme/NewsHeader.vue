<script setup lang="ts">
// The heading of a news post (news/*.md): the title, then matching chips: the date, which opens that month's news, and
// for a feature the guide page it is about (guideTitle is set from the guide page's heading in config.mts), or for a
// fixes post a "Bug fixes" label. Shown by the
// Layout in index.ts above every doc page's content; renders nothing outside news/.
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { PixelIcon } from 'vitepress-theme-skelril'
import CalendarIcon from './CalendarIcon.vue'
import { formatDate, isPostFile, MONTH_NAMES, monthUrl, POST_TYPE_LABELS } from './news'

const { frontmatter, page } = useData()
const isPost = computed(() => isPostFile(page.value.relativePath))
// The frontmatter date reaches the client as an ISO string.
const date = computed(() => String(frontmatter.value.date ?? '').slice(0, 10))
const month = computed(() => `${MONTH_NAMES[Number(date.value.slice(5, 7)) - 1]} ${date.value.slice(0, 4)}`)
</script>

<template>
  <header v-if="isPost" :class="$style.head">
    <h1>{{ frontmatter.title }}</h1>
    <p :class="$style.chips">
      <a :class="[$style.chip, $style.date]" :href="withBase(monthUrl(date))" :title="`More news from ${month}`">
        <CalendarIcon /><time :datetime="date">{{ formatDate(date) }}</time>
      </a>
      <a v-if="frontmatter.type === 'feature'" :class="[$style.chip, $style.guide]" :href="withBase(frontmatter.guide)">
        <PixelIcon name="sign" :px="1" />Guide: {{ frontmatter.guideTitle }} →
      </a>
      <span v-else :class="[$style.chip, $style.fixes]"><PixelIcon name="gear" :px="1" />{{ POST_TYPE_LABELS.fixes }}</span>
    </p>
  </header>
</template>

<style module>
.head { margin-bottom: 24px; border-bottom: 4px solid var(--grass); padding-bottom: 14px; }
.head h1 { margin: 0 0 12px; font-family: "Silkscreen", monospace; font-weight: 700; font-size: 26px; line-height: 1.3; color: var(--heading); }
.chips { display: flex; flex-wrap: wrap; gap: 8px; margin: 0; }
/* Both chips share font, height and border weight; only their colours differ. */
.chip { display: inline-flex; align-items: center; gap: 8px; font-family: "Silkscreen", monospace; font-size: 11px; line-height: 16px;
  text-transform: uppercase; text-decoration: none; padding: 4px 9px; border: 2px solid; white-space: nowrap; }
.chip:focus-visible { outline: 3px solid var(--sky); outline-offset: 2px; }
.chip svg { width: 16px; height: 16px; }
.date { background: var(--card-alt); color: var(--ink); border-color: var(--stone-light); padding-left: 6px; }
.date:hover { color: var(--ink); border-color: var(--stone); }
.guide { background: var(--grass); color: #fff; border-color: var(--grass-dark); padding-left: 6px; }
.guide:hover { background: var(--grass-dark); color: #fff; }
/* A label, not a link: no hover. */
.fixes { background: var(--dirt); color: #fff; border-color: var(--dirt-dark); padding-left: 6px; }
</style>
