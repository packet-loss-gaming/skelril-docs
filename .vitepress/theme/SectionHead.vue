<script setup lang="ts">
// A section heading row on the site's own pages: the title on the left, an optional note or button (the default slot)
// on the right. The row has a fixed height, so a heading sits in the same place whatever is beside it.
defineProps<{ title: string }>()
</script>

<template>
  <div :class="$style.head">
    <h2>{{ title }}</h2>
    <div v-if="$slots.default" :class="$style.side"><slot /></div>
  </div>
</template>

<style module>
.head { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px 16px; min-height: 38px;
  margin: 40px 0 16px; border-bottom: 4px solid var(--grass); padding-bottom: 6px; }
.head h2 { margin: 0; padding: 0; border: 0; font-family: "Silkscreen", monospace; font-weight: 700; font-size: 18px; line-height: 24px;
  color: var(--heading); }
.side { font-size: 14px; line-height: 20px; color: var(--stone); }
</style>
