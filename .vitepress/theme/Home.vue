<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { withBase } from 'vitepress'
import { PixelIcon } from 'vitepress-theme-skelril'
import PageHero from './PageHero.vue'
import SectionHead from './SectionHead.vue'
import { formatDate } from './news'
import { data as posts } from './news.data'
import { HORIZONS } from './roadmap'
import { data as roadmap } from './roadmap.data'
import { CHEAT_SHEET_URL, codeParts, TIPS_PATH, type Tip, type TipsFile } from './tips'

const NEWS_COUNT = 4
const TEASER_COUNT = 3

const latest = posts.slice(0, NEWS_COUNT)
// Nearest first, as on the roadmap page.
const teasers = HORIZONS.flatMap((h) => roadmap.teasers.filter((t) => t.horizon === h)).slice(0, TEASER_COUNT)

// No tip is in the pre-rendered page: once mounted, it fetches the full list (tips.json) and shows a random one, with a
// loading bar until then.
const tip = ref<Tip | 'loading' | 'failed'>('loading')
let all: Tip[] = []

function another() {
  const current = tip.value
  const others = all.filter((t) => t !== current)
  if (others.length) tip.value = others[Math.floor(Math.random() * others.length)]
}

onMounted(async () => {
  try {
    const res = await fetch(withBase(TIPS_PATH))
    if (!res.ok) throw new Error(`${TIPS_PATH}: HTTP ${res.status}`)
    all = ((await res.json()) as TipsFile).tips
    if (!all.length) throw new Error(`${TIPS_PATH} has no tips`)
    another()
  } catch {
    tip.value = 'failed'
  }
})
</script>

<template>
  <PageHero />
  <main :class="$style.wrap">
    <div :class="$style.cols">
      <div :class="$style.main">
        <SectionHead title="Latest news"><a :class="$style.more" :href="withBase('/news/')">All news →</a></SectionHead>
        <div :class="$style.news">
          <a v-for="p in latest" :key="p.url" :href="withBase(p.url)">
            <time :datetime="p.date">{{ formatDate(p.date) }}</time>
            <b>{{ p.title }}</b>
            <span>{{ p.summary }}</span>
          </a>
        </div>
      </div>

      <section :class="$style.tip" aria-live="polite">
        <div :class="$style.tipHead">
          <h2>Did you know?</h2>
          <button v-if="typeof tip === 'object'" type="button" @click="another">Another tip</button>
        </div>
        <div v-if="tip === 'loading'" :class="$style.loading" role="status">
          <span :class="$style.cubes" aria-hidden="true"><span v-for="n in 3" :key="n" :class="$style.cube" /></span><span :class="$style.srOnly">Loading a tip…</span>
        </div>
        <p v-else-if="tip === 'failed'">Tips didn't load. Every command is on the <a :href="withBase(CHEAT_SHEET_URL)">cheat sheet</a>.</p>
        <template v-else>
          <p>
            <code v-if="tip.command" :class="$style.cmd">{{ tip.command }}</code>
            <template v-for="(part, i) in codeParts(tip.text)" :key="i"><code v-if="part.code">{{ part.text }}</code><template v-else>{{ part.text }}</template></template>
          </p>
          <a :class="$style.tipLink" :href="withBase(tip.link)">{{ tip.link === CHEAT_SHEET_URL ? 'Cheat sheet' : 'Read more' }} →</a>
        </template>
      </section>

      <aside :class="$style.side">
        <section :class="[$style.panel, $style.newHere]">
          <h2><span :class="$style.icon"><PixelIcon name="bed" :px="2" /></span>New here?</h2>
          <ol :class="$style.steps">
            <li><span>Get an activation code from a player who invites you.</span></li>
            <li><span>In the arrival room, type the code into chat or use <code>/activate &lt;code&gt;</code>.</span></li>
            <li><span>Step through a room portal, then read <a :href="withBase('/guide/getting-started')">Getting started</a>.</span></li>
          </ol>
        </section>

        <a :class="$style.button" :href="withBase(CHEAT_SHEET_URL)">
          <span :class="$style.icon"><PixelIcon name="key" :px="2" /></span>
          <span><b>Cheat sheet</b><small>All player commands on one page</small></span>
          <span :class="$style.arrow">→</span>
        </a>

        <section :class="$style.panel">
          <h2><span :class="$style.icon"><PixelIcon name="torch" :px="2" /></span>Next up</h2>
          <ul :class="$style.next">
            <li v-for="t in teasers" :key="t.title">
              <span :class="$style.icon"><PixelIcon :name="t.icon" :px="2" /></span>
              <span :class="$style.teaserTitle">{{ t.title }}<span :class="[$style.chip, $style['c-' + t.horizon]]">{{ roadmap.horizons[t.horizon] }}</span></span>
              <p>{{ t.text }}</p>
            </li>
          </ul>
          <a :class="$style.panelMore" :href="withBase('/roadmap')">Full roadmap →</a>
        </section>
      </aside>
    </div>
  </main>
</template>

<style module>
.wrap { max-width: 1040px; margin: 0 auto; padding: 0 16px 64px; }

/* News with the tip under it, beside the sidebar. On phones the tip moves below the sidebar, to the end of the page.
   The second row takes any extra height when the sidebar is the taller column, so the tip stays close under the news. */
.cols { display: grid; grid-template-columns: minmax(0, 1fr) 300px; grid-template-rows: auto 1fr; grid-template-areas: "news side" "tip side";
  column-gap: 32px; align-items: start; }
@media (max-width: 800px) { .cols { grid-template-columns: minmax(0, 1fr); grid-template-rows: auto; grid-template-areas: "news" "side" "tip"; } }
.main { grid-area: news; min-width: 0; }
/* Lines the sidebar's first panel up with the news heading (SectionHead's top margin). */
.side { grid-area: side; display: grid; gap: 16px; min-width: 0; margin-top: 40px; }

.more, .panelMore, .tipLink { font-family: "Silkscreen", monospace; font-size: 12px; color: var(--vp-c-brand-1); text-decoration: none; white-space: nowrap; }
.more:hover, .panelMore:hover, .tipLink:hover { text-decoration: underline; }

.news { display: grid; }
.news a { display: grid; grid-template-columns: 100px minmax(0, 1fr); gap: 2px 14px; padding: 12px 0; border-bottom: 2px dashed var(--card-alt);
  color: var(--ink); text-decoration: none; }
.news a:first-child { padding-top: 0; }
.news time { font-family: "VT323", monospace; font-size: 19px; line-height: 20px; color: var(--stone); }
.news b { font-family: "Silkscreen", monospace; font-size: 14px; line-height: 20px; color: var(--heading); }
.news a span { grid-column: 2; font-size: 15px; }
.news a:hover b { text-decoration: underline; }
@media (max-width: 520px) { .news a { grid-template-columns: minmax(0, 1fr); } .news a span { grid-column: 1; } }

/* Fixed minimum height, so swapping in a longer tip after the fetch does not push the page about. */
.tip { grid-area: tip; margin-top: 28px; min-height: 128px; box-sizing: border-box; display: flex; flex-direction: column; gap: 8px; padding: 14px 16px;
  background: var(--card-alt); border-left: 6px solid var(--gold); }
/* The heading row keeps the button's height while it is hidden (loading), so nothing shifts when it appears. */
.tipHead { display: flex; align-items: center; justify-content: space-between; gap: 8px 16px; min-height: 28px; }
.tip h2 { margin: 0; padding: 0; border: 0; font-family: "Silkscreen", monospace; font-size: 12px; line-height: 16px; letter-spacing: 1px;
  text-transform: uppercase; color: var(--heading); }
.tip p { margin: 0; font-size: 16px; flex: 1; }
.tip .cmd { display: table; margin-bottom: 2px; font-size: 22px; }
/* A row of three off-white cubes, centered, that slides left and right in block-sized steps. */
.loading { flex: 1; display: flex; align-items: center; justify-content: center; min-height: 48px; }
.cubes { display: flex; gap: 6px; animation: tip-cubes 1s steps(8, jump-none) infinite alternate; }
.cube { --cube: #fffaf0; --cube-shade: #d9cfb4; --cube-edge: var(--dirt-light);
  width: 12px; height: 12px; background: var(--cube); border: 2px solid var(--cube-edge); box-shadow: inset -3px -3px 0 var(--cube-shade); }
:global(.dark) .cube { --cube: #efe6d2; --cube-shade: #b8ae99; --cube-edge: #5e4129; }
@keyframes tip-cubes { from { transform: translateX(-64px); } to { transform: translateX(64px); } }
@media (prefers-reduced-motion: reduce) { .cubes { animation: none; } }
.srOnly { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
.tipLink { align-self: flex-start; }
.tipHead button { font-family: "Silkscreen", monospace; font-size: 11px; line-height: 14px; padding: 4px 9px 3px; cursor: pointer; color: #fff;
  background: var(--dirt); border: 3px solid; border-color: var(--dirt-light) var(--dirt-dark) var(--dirt-dark) var(--dirt-light); }
.tipHead button:hover { background: var(--grass); border-color: var(--grass-light) var(--grass-dark) var(--grass-dark) var(--grass-light); }
.tipHead button:focus-visible { outline: 3px solid var(--sky); outline-offset: 2px; }

.panel { background: var(--card); border: 4px solid; border-color: var(--dirt-light) var(--dirt-dark) var(--dirt-dark) var(--dirt-light); }
/* Icons differ in grid size (bed 14x8, torch 6x10, cloud 16x5); a fixed slot sized to the largest at px=2 keeps
   pixels crisp and starts every title at the same x. Panel headers and the cheat sheet button share the inset. */
.icon { flex: none; width: 32px; height: 24px; display: grid; place-items: center; }
.panel h2 { margin: 0; padding: 8px 10px 6px; border: 0; border-top: 6px solid var(--gold); display: flex; align-items: center; gap: 10px;
  font-family: "Silkscreen", monospace; font-weight: 700; font-size: 14px; line-height: 18px; color: #fff; background: var(--dirt); }
.newHere h2 { background: var(--grass-dark); border-top-color: var(--grass-light); }
.panelMore { display: block; padding: 0 12px 12px; }

.steps { list-style: none; margin: 0; padding: 6px 12px 10px; counter-reset: step; }
.steps li { counter-increment: step; display: grid; grid-template-columns: 26px minmax(0, 1fr); gap: 10px; margin: 0; padding: 8px 0;
  border-bottom: 1px dashed var(--card-alt); font-size: 14px; line-height: 1.45; }
.steps li:last-child { border: 0; }
.steps a, .tip p a { color: var(--vp-c-brand-1); text-decoration: underline; }
.steps li::before { content: counter(step); display: grid; place-items: center; width: 26px; height: 26px; box-sizing: border-box;
  font-family: "Silkscreen", monospace; font-size: 12px; color: #fff; background: var(--grass); border: 2px solid var(--grass-dark); }

.button { display: flex; align-items: center; gap: 10px; padding: 9px 12px 8px 11px; color: #fff; text-decoration: none; background: var(--dirt);
  border: 3px solid; border-color: var(--dirt-light) var(--dirt-dark) var(--dirt-dark) var(--dirt-light); }
.button:hover { color: #fff; background: var(--grass); border-color: var(--grass-light) var(--grass-dark) var(--grass-dark) var(--grass-light); }
.button span { display: grid; min-width: 0; }
.button b { font-family: "Silkscreen", monospace; font-size: 13px; line-height: 16px; }
.button small { font-size: 13px; line-height: 1.3; opacity: .9; }
.button .arrow { margin-left: auto; font-family: "Silkscreen", monospace; }

.next { list-style: none; margin: 0; padding: 4px 12px 8px; }
.next li { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 2px 10px; margin: 0; padding: 9px 0; border-bottom: 1px solid var(--card-alt); }
.next li:last-child { border: 0; }
.next li > .icon { grid-row: span 2; height: auto; align-self: start; margin-top: 2px; }
.teaserTitle { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 8px; font-weight: 700; font-size: 15px; }
.next p { margin: 0; font-size: 14px; line-height: 1.4; }
.chip { font-family: "Silkscreen", monospace; font-size: 10px; font-weight: 400; line-height: 14px; padding: 2px 6px 1px; border: 2px solid var(--deepslate);
  color: var(--deepslate); white-space: nowrap; }
.c-soon { background: var(--sky); }
.c-working { background: var(--gold); }
.c-later { background: transparent; color: var(--ink); border-style: dashed; border-color: var(--stone); }
</style>
