<script setup lang="ts">
import { PixelIcon } from 'vitepress-theme-skelril'
import PageHero from './PageHero.vue'
import SectionHead from './SectionHead.vue'
import { HORIZONS } from './roadmap'
import { data } from './roadmap.data'

// Nearest first: soon, then in the works, then later; file order within each.
const teasers = HORIZONS.flatMap((h) => data.teasers.filter((t) => t.horizon === h))
</script>

<template>
  <PageHero kicker="ROADMAP" />
  <main :class="$style.wrap">
    <SectionHead title="Coming up">Rough timing, not promises.</SectionHead>
    <div :class="$style.teasers">
      <section v-for="t in teasers" :key="t.title" :class="[$style.teaser, $style['h-' + t.horizon]]">
        <h3><PixelIcon :name="t.icon" :px="3" />{{ t.title }}</h3>
        <div :class="$style.body">
          <span :class="[$style.chip, $style['c-' + t.horizon]]">{{ data.horizons[t.horizon] }}</span>
          <p>{{ t.text }}</p>
        </div>
      </section>
    </div>
  </main>
</template>

<style module>
.wrap { max-width: 1040px; margin: 0 auto; padding: 0 16px 64px; }

.teasers { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(300px, 100%), 1fr)); gap: 20px; }
.teaser { background: var(--card); border: 4px solid; border-color: #c9a07a #5e4129 #5e4129 #c9a07a; display: flex; flex-direction: column; }
.teaser h3 { margin: 0; display: flex; align-items: center; gap: 12px; font-family: "Silkscreen", monospace; font-weight: 700; font-size: 14px;
  line-height: 1.3; color: #fff; background: var(--dirt); padding: 10px 12px 8px; border-top: 7px solid var(--sky); }
.h-working h3 { border-top-color: var(--gold); }
.h-later { border-style: dashed; border-color: var(--stone-light); }
.h-later h3 { border-top-color: var(--stone-light); background: var(--card-alt); color: var(--ink); }
.body { padding: 12px 14px 14px; display: flex; flex-direction: column; align-items: flex-start; gap: 8px; }
.body p { margin: 0; font-size: 15px; }
.chip { font-family: "Silkscreen", monospace; font-size: 10px; padding: 3px 6px 1px; border: 2px solid var(--deepslate); color: var(--deepslate); white-space: nowrap; }
.c-soon { background: var(--sky); }
.c-working { background: var(--gold); }
.c-later { background: transparent; color: var(--ink); border-style: dashed; border-color: var(--stone); }
</style>
