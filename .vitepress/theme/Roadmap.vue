<script setup lang="ts">
import { Landscape, PixelIcon } from 'vitepress-theme-skelril'
import { STATUSES, type Status } from './roadmap'
import { data } from './roadmap.data'

const COLOURS: Record<Status, string> = {
  done: 'var(--grass)', active: 'var(--gold)', next: 'var(--sky)', planned: 'var(--stone-light)', later: 'transparent',
}
const { legend } = data
const counts = Object.fromEntries(STATUSES.map((s) => [s, 0])) as Record<Status, number>
data.phases.forEach((phase) => phase.items.forEach((item) => { counts[item.status] += 1 }))
const total = STATUSES.reduce((sum, s) => sum + counts[s], 0)
</script>

<template>
  <header :class="$style.hero">
    <Landscape />
    <div :class="$style.heroTitle">
      <p :class="$style.kicker">A GAME ON LUANTI · ROADMAP</p>
      <h1 class="skelril-bevel">{{ data.title.toUpperCase() }}</h1>
    </div>
  </header>
  <p :class="$style.tagline">{{ data.tagline }}</p>
  <main :class="$style.wrap">
    <p :class="$style.intro">{{ data.intro.trim() }}</p>
    <p :class="$style.updated">Updated {{ data.updated }}</p>
    <div :class="$style.bar" role="img" :aria-label="`Progress across ${total} items`">
      <i v-for="s in STATUSES.filter((s) => counts[s])" :key="s" :style="{ width: `${(counts[s] * 100) / total}%`, background: COLOURS[s] }"
        :title="`${legend[s]}: ${counts[s]}`" />
    </div>
    <div :class="$style.legend">
      <span v-for="s in STATUSES" :key="s"><i :class="[$style.dot, $style['s-' + s]]" />{{ legend[s] }} ({{ counts[s] }})</span>
    </div>
    <div :class="$style.phases">
      <section v-for="phase in data.phases" :key="phase.name" :class="[$style.phase, $style['st-' + phase.status]]">
        <h2>
          <PixelIcon :name="phase.icon" :px="3" />
          {{ phase.name }}
          <span :class="[$style.pill, $style['s-' + phase.status]]">{{ legend[phase.status] }}</span>
        </h2>
        <p :class="$style.sum">{{ phase.summary }}</p>
        <ul>
          <li v-for="item in phase.items" :key="item.text" :class="item.status === 'done' ? $style.isDone : undefined">
            <i :class="[$style.dot, $style['s-' + item.status]]" :title="legend[item.status]" />
            <span>{{ item.text }}</span>
          </li>
        </ul>
      </section>
    </div>
  </main>
</template>

<style module>
.wrap { max-width: 1040px; margin: 0 auto; padding: 0 16px 64px; }
.hero { position: relative; height: 300px; overflow: hidden; border-bottom: 6px solid var(--grass); }
.hero svg { position: absolute; inset: 0; }
.heroTitle { position: absolute; left: 0; right: 0; top: 46px; text-align: center; padding: 0 16px; }
.kicker { font-family: "Silkscreen", monospace; font-size: 12px; letter-spacing: 1px; color: var(--deepslate); margin: 0 0 10px; }
:global(.dark) .kicker { color: #c9d4f5; }
.tagline { font-family: "Silkscreen", monospace; font-size: clamp(13px, 2.8vw, 20px); color: var(--heading); text-align: center; margin: 26px 16px 0; }
.intro { max-width: 700px; margin: 14px auto 8px; text-align: center; font-size: 18px; }
.updated { text-align: center; font-family: "VT323", monospace; font-size: 20px; color: var(--stone); margin: 0 0 24px; }
.bar { display: flex; height: 22px; border: 3px solid var(--deepslate); background: var(--card); margin: 0 0 10px; }
.bar i { display: block; height: 100%; }
.legend { display: flex; flex-wrap: wrap; gap: 8px 18px; margin: 10px 0 30px; font-family: "Silkscreen", monospace; font-size: 11px; }
.legend span { display: inline-flex; align-items: center; gap: 6px; }
.dot { width: 12px; height: 12px; display: inline-block; border: 2px solid var(--deepslate); flex: none; }
.s-done { background: var(--grass); }
.s-active { background: var(--gold); }
.s-next { background: var(--sky); }
.s-planned { background: var(--stone-light); }
.s-later { background: transparent; border-style: dashed; }
:global(.dark) .dot, :global(.dark) .pill { border-color: var(--stone); }
.phases { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(310px, 100%), 1fr)); gap: 20px; }
.phase { background: var(--card); border: 4px solid; border-color: #c9a07a #5e4129 #5e4129 #c9a07a; display: flex; flex-direction: column; }
.st-done { border-color: #8bbd5a #3f6b22 #3f6b22 #8bbd5a; }
.st-active { border-color: #f9dc84 #c99a1f #c99a1f #f9dc84; }
.st-next { border-color: #b9defb #4d8fcb #4d8fcb #b9defb; }
.st-later { border-style: dashed; }
.phase h2 { margin: 0; display: flex; align-items: center; gap: 12px; font-family: "Silkscreen", monospace; font-weight: 700; font-size: 15px; color: #fff;
  background: var(--dirt); padding: 10px 12px 8px; border-top: 7px solid var(--grass); }
.st-active h2 { border-top-color: var(--gold); }
.st-next h2 { border-top-color: var(--sky); }
.st-planned h2 { border-top-color: var(--stone); }
.st-later h2 { border-top-color: var(--stone-light); }
.pill { margin-left: auto; font-size: 10px; padding: 3px 6px 1px; color: var(--deepslate); border: 2px solid var(--deepslate); white-space: nowrap; }
.sum { margin: 12px 14px 6px; font-size: 14.5px; }
.phase ul { list-style: none; margin: 0; padding: 4px 14px 14px; }
.phase li { display: flex; gap: 10px; align-items: flex-start; padding: 5px 0; border-top: 2px solid var(--stone-light); font-size: 14.5px; margin: 0; }
.phase li:first-child { border-top: none; }
.phase li .dot { margin-top: 5px; }
.isDone { color: var(--stone); }
</style>
