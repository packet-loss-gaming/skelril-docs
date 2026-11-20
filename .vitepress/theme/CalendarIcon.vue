<script setup lang="ts">
// A 12x12 pixel calendar in the style and palette of the theme's icons (vitepress-theme-skelril's pixelData.json), for
// the news post date chip. The theme has no calendar; if it gains one, use <PixelIcon name="calendar" /> instead.
const ROWS = [
  '..k......k..',
  'RRkRRRRRRkRR',
  'RrrrrrrrrrrR',
  'RrrrrrrrrrrR',
  'SnnnnnnnnnnS',
  'SnSnSnnSnSnS',
  'SnnnnnnnnnnS',
  'SnSnSnnSnSnS',
  'SnnnnnnnnnnS',
  'SnSnSnnrnSnS',
  'SnnnnnnnnnnS',
  'SSSSSSSSSSSS',
]
const PALETTE: Record<string, string> = { k: '#2b2b2b', r: '#c0392b', R: '#8b2418', S: '#6b6b6b', n: '#f3ead0' }
const rects = ROWS.flatMap((row, y) => [...row].flatMap((c, x) => (c === '.' ? [] : [{ x, y, fill: PALETTE[c] }])))
</script>

<template>
  <svg class="pixel-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" width="12" height="12" shape-rendering="crispEdges"
    aria-hidden="true" focusable="false">
    <rect v-for="(r, i) in rects" :key="i" :x="r.x" :y="r.y" width="1" height="1" :fill="r.fill" />
  </svg>
</template>
