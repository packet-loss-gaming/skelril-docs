<script setup lang="ts">
// The landscape banner at the top of the site's own pages (home, News, Roadmap): a kicker line over the bevelled title.
// One component so every page's banner sits and sizes the same.
import { Landscape } from 'vitepress-theme-skelril'

// `kicker` names the page after "A GAME ON LUANTI"; the home page leaves it out.
defineProps<{ kicker?: string; title?: string }>()
</script>

<template>
  <header :class="$style.hero">
    <Landscape />
    <div :class="$style.title">
      <p :class="$style.kicker">A GAME ON LUANTI<template v-if="kicker"> · {{ kicker }}</template></p>
      <h1 class="skelril-bevel">{{ title ?? 'SKELRIL' }}</h1>
    </div>
  </header>
</template>

<style module>
.hero { position: relative; height: 300px; overflow: hidden; border-bottom: 6px solid var(--grass); }
.hero svg { position: absolute; inset: 0; }
.title { position: absolute; left: 0; right: 0; top: 46px; text-align: center; padding: 0 16px; }
.kicker { font-family: "Silkscreen", monospace; font-size: 12px; line-height: 16px; letter-spacing: 1px; color: var(--deepslate); margin: 0 0 10px; }
:global(.dark) .kicker { color: #c9d4f5; }
</style>
