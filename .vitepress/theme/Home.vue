<script setup lang="ts">
import { withBase } from 'vitepress'
import { Landscape, PixelIcon } from 'vitepress-theme-skelril'

const CARDS = [
  { to: '/guide/welcome', icon: 'sign', title: 'Player guide', text: 'Wallet, warps, guilds, mini-games and every command, chapter by chapter.' },
  { to: '/guide/cheat-sheet', icon: 'key', title: 'Cheat sheet', text: 'All player commands on one page.' },
  { to: '/roadmap', icon: 'torch', title: 'Roadmap', text: 'What already works and what comes next.' },
]
</script>

<template>
  <header :class="$style.hero">
    <Landscape />
    <div :class="$style.heroTitle">
      <p :class="$style.kicker">A GAME ON LUANTI</p>
      <h1 class="skelril-bevel">SKELRIL</h1>
    </div>
  </header>
  <main :class="$style.wrap">
    <p :class="$style.tagline">The Grindstone server, rebuilt on Luanti.</p>
    <div :class="$style.cards">
      <a v-for="card in CARDS" :key="card.to" :href="withBase(card.to)" :class="$style.card">
        <h2><PixelIcon :name="card.icon" :px="3" />{{ card.title }}</h2>
        <p>{{ card.text }}</p>
      </a>
    </div>
  </main>
</template>

<style module>
.hero { position: relative; height: 320px; overflow: hidden; border-bottom: 6px solid var(--grass); }
.hero svg { position: absolute; inset: 0; }
.heroTitle { position: absolute; left: 0; right: 0; top: 56px; text-align: center; padding: 0 16px; }
.kicker { font-family: "Silkscreen", monospace; font-size: 12px; letter-spacing: 1px; color: var(--deepslate); margin: 0 0 10px; }
:global(.dark) .kicker { color: #c9d4f5; }
.wrap { max-width: 1040px; margin: 0 auto; padding: 0 16px 64px; }
.tagline { font-family: "Silkscreen", monospace; font-size: clamp(13px, 2.8vw, 20px); color: var(--heading); text-align: center; margin: 26px 0 30px; }
.cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(260px, 100%), 1fr)); gap: 20px; }
.card { display: block; background: var(--card); color: var(--ink); text-decoration: none; border: 4px solid; border-color: #c9a07a #5e4129 #5e4129 #c9a07a; }
.card:hover { color: var(--ink); border-color: #8bbd5a #3f6b22 #3f6b22 #8bbd5a; }
.card h2 { margin: 0; display: flex; align-items: center; gap: 12px; font-family: "Silkscreen", monospace; font-weight: 700; font-size: 15px;
  color: #fff; background: var(--dirt); padding: 10px 12px 8px; border-top: 7px solid var(--grass); }
.card p { margin: 12px 14px 14px; }
</style>
