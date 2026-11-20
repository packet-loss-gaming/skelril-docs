<script setup lang="ts">
// /news/ shows the latest posts. With a year and month (news/[year]/[month].md, such as /news/2026/11) it is the
// archive for that month, with year and month pickers; years and months without posts are shown but greyed out.
// A static site cannot show "the last two weeks", so the latest page shows a fixed number of posts.
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { PixelIcon } from 'vitepress-theme-skelril'
import { formatDate, MONTH_NAMES, monthUrl, POST_TYPE_LABELS, type NewsPost } from './news'
import { data as posts } from './news.data'
import PageHero from './PageHero.vue'
import SectionHead from './SectionHead.vue'

const props = defineProps<{ year?: string; month?: string }>()

const LATEST = 10

// Posts run newest first, so the first post's month is the latest.
const latest = posts[0]?.date.slice(0, 7) ?? ''
const isArchive = computed(() => Boolean(props.year && props.month))
const shown = computed(() => (isArchive.value ? `${props.year}-${props.month}` : latest))
const shownYear = computed(() => shown.value.slice(0, 4))

// Every year from the first post's to the latest; each links to its newest month with posts.
const withPosts = new Set(posts.map((p) => p.date.slice(0, 7)))
const years: { year: string; url?: string }[] = []
if (posts.length) {
  for (let y = Number(latest.slice(0, 4)); y >= Number(posts[posts.length - 1].date.slice(0, 4)); y--) {
    const newest = posts.find((p) => p.date.startsWith(`${y}-`))
    years.push({ year: String(y), url: newest && monthUrl(newest.date) })
  }
  years.reverse()
}
const months = computed(() => MONTH_NAMES.map((name, i) => {
  const key = `${shownYear.value}-${String(i + 1).padStart(2, '0')}`
  return { name, key, url: withPosts.has(key) ? monthUrl(`${key}-01`) : undefined }
}))

const heading = computed(() => {
  if (!posts.length) return 'No news yet'
  return isArchive.value ? `${MONTH_NAMES[Number(shown.value.slice(5)) - 1]} ${shownYear.value}` : 'Latest news'
})

// Consecutive posts on the same day share one date marker.
const days = computed(() => {
  const out: { date: string; posts: NewsPost[] }[] = []
  const list = isArchive.value ? posts.filter((p) => p.date.startsWith(shown.value)) : posts.slice(0, LATEST)
  for (const p of list) {
    const last = out[out.length - 1]
    if (last && last.date === p.date) last.posts.push(p)
    else out.push({ date: p.date, posts: [p] })
  }
  return out
})
</script>

<template>
  <PageHero kicker="NEWS" />
  <main :class="$style.wrap">
    <nav v-if="isArchive" :class="$style.archive" aria-label="News archive">
      <p :class="$style.label">Year</p>
      <ul :class="$style.picker">
        <li v-for="y in years" :key="y.year">
          <span v-if="y.year === shownYear" :class="[$style.btn, $style.on]" aria-current="true">{{ y.year }}</span>
          <a v-else-if="y.url" :class="$style.btn" :href="withBase(y.url)">{{ y.year }}</a>
          <span v-else :class="[$style.btn, $style.off]">{{ y.year }}</span>
        </li>
      </ul>
      <p :class="$style.label">Month</p>
      <ul :class="[$style.picker, $style.months]">
        <li v-for="m in months" :key="m.key">
          <span v-if="m.key === shown" :class="[$style.btn, $style.on]" aria-current="page">{{ m.name }}</span>
          <a v-else-if="m.url" :class="$style.btn" :href="withBase(m.url)">{{ m.name }}</a>
          <span v-else :class="[$style.btn, $style.off]">{{ m.name }}</span>
        </li>
      </ul>
    </nav>

    <SectionHead :title="heading">
      <a :class="$style.rss" :href="withBase('/news/rss.xml')" title="RSS feed of new features">
        <svg viewBox="0 0 8 8" aria-hidden="true"><rect width="2" height="2" y="6" /><rect width="2" height="4" x="2" y="4" />
          <rect width="2" height="6" x="4" y="2" /><rect width="2" height="8" x="6" /></svg>
        Subscribe
      </a>
    </SectionHead>
    <div :class="$style.feed">
      <template v-for="day in days" :key="day.date">
        <time :class="$style.date" :datetime="day.date">{{ formatDate(day.date) }}</time>
        <div :class="$style.day">
          <a v-for="p in day.posts" :key="p.url" :class="$style.entry" :href="withBase(p.url)">
            <div :class="$style.top">
              <h3>{{ p.title }}</h3>
              <span v-if="p.type === 'fixes'" :class="$style.tag"><PixelIcon name="gear" :px="1" />{{ POST_TYPE_LABELS.fixes }}</span>
            </div>
            <p>{{ p.summary }}</p>
            <span :class="$style.more">Read more →</span>
          </a>
        </div>
      </template>
    </div>
    <p v-if="!isArchive && posts.length" :class="$style.next">
      <a :class="$style.btn" :href="withBase(monthUrl(posts[0].date))">News archive →</a>
    </p>
  </main>
</template>

<style module>
.wrap { max-width: 1040px; margin: 0 auto; padding: 0 16px 64px; }

/* Archive picker: a sunken stone tray of block buttons. */
.archive { margin: 32px 0 0; background: var(--card-alt); border: 4px solid; border-color: #5e4129 #c9a07a #c9a07a #5e4129; padding: 10px 14px 14px; }
.label { margin: 4px 0 6px; font-family: "Silkscreen", monospace; font-size: 11px; letter-spacing: 1px; color: var(--stone); text-transform: uppercase; }
.picker { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 8px; }
.months { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); }
.picker li { margin: 0; }
.btn { display: block; text-align: center; font-family: "Silkscreen", monospace; font-size: 12px; line-height: 1; padding: 9px 10px 7px;
  background: var(--dirt); color: #fff; text-decoration: none; border: 3px solid; border-color: #c9a07a #5e4129 #5e4129 #c9a07a; white-space: nowrap; }
a.btn:hover { background: var(--grass); border-color: #8bbd5a #3f6b22 #3f6b22 #8bbd5a; color: #fff; }
a.btn:focus-visible { outline: 3px solid var(--sky); outline-offset: 2px; }
.btn.on { background: var(--gold); color: var(--deepslate); border-color: #5e4129 #c9a07a #c9a07a #5e4129; }
.btn.off { background: transparent; color: var(--stone); border: 3px dashed var(--stone-light); }


.rss { display: inline-flex; align-items: center; gap: 7px; font-family: "Silkscreen", monospace; font-size: 11px; color: #fff; background: #d96f1c;
  padding: 6px 10px 4px; line-height: 14px; border: 2px solid var(--deepslate); text-decoration: none; }
.rss:hover { background: #c05f12; color: #fff; }
.rss:focus-visible { outline: 3px solid var(--sky); outline-offset: 2px; }
.rss svg { width: 12px; height: 12px; fill: currentColor; }

.feed { display: grid; grid-template-columns: 120px minmax(0, 1fr); gap: 0 18px; }
.date { font-family: "VT323", monospace; font-size: 21px; line-height: 1; color: var(--stone); text-align: right; padding-top: 16px; white-space: nowrap; }
.day { border-left: 4px solid var(--stone-light); padding: 8px 0 16px 18px; position: relative; display: flex; flex-direction: column; gap: 12px; }
.day::before { content: ""; position: absolute; left: -10px; top: 16px; width: 12px; height: 12px; border: 2px solid var(--deepslate); background: var(--grass); }
/* The whole card is the link to the post. */
.entry { display: block; background: var(--card); color: var(--ink); text-decoration: none; border: 4px solid;
  border-color: #c9a07a #5e4129 #5e4129 #c9a07a; padding: 10px 14px 12px; }
.entry:hover { color: var(--ink); border-color: #8bbd5a #3f6b22 #3f6b22 #8bbd5a; }
.entry:focus-visible { outline: 3px solid var(--sky); outline-offset: 2px; }
.entry h3 { margin: 0 0 4px; font-family: "Silkscreen", monospace; font-weight: 700; font-size: 14px; color: var(--ink); }
.entry p { margin: 0 0 4px; font-size: 15px; }
.top { display: flex; align-items: flex-start; justify-content: space-between; gap: 4px 12px; flex-wrap: wrap; }
.top h3 { flex: 1 1 auto; min-width: 0; }
.tag { display: inline-flex; align-items: center; gap: 6px; margin-top: -2px; white-space: nowrap; font-family: "Silkscreen", monospace; font-size: 10px; line-height: 14px;
  text-transform: uppercase; color: #fff; background: var(--dirt); border: 2px solid var(--dirt-dark); padding: 2px 7px 2px 4px; }
.tag svg { width: 14px; height: 14px; }
.more { font-size: 14px; color: var(--vp-c-brand-1); }
.entry:hover .more { text-decoration: underline; }
.next { margin: 32px 0 0; display: flex; justify-content: center; }
@media (max-width: 760px) {
  .months { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}
@media (max-width: 560px) {
  .months { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .btn { padding: 9px 4px 7px; font-size: 11px; }
  .feed { grid-template-columns: 1fr; }
  .date { text-align: left; padding: 4px 0 6px; }
}
</style>
